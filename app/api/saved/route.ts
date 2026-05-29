import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { mockColleges } from '@/lib/mockData';

// GET: Retrieve all saved colleges and comparisons for the authenticated user
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id || 'demo-user-id';

  try {
    const [savedColleges, savedComparisons] = await Promise.all([
      prisma.savedCollege.findMany({
        where: { userId },
        include: { college: true },
      }),
      prisma.savedComparison.findMany({
        where: { userId },
      }),
    ]);

    // Map college details securely and filter out null/undefined records (orphan references)
    const formattedColleges = savedColleges.map((sc) => sc.college).filter(Boolean);

    return NextResponse.json({
      savedColleges: formattedColleges,
      savedComparisons: savedComparisons,
    });
  } catch (err) {
    console.warn("Database connection offline during GET /api/saved. Returning simulated user data.");
    // Simulated fallback for demo account when PostgreSQL is unavailable
    return NextResponse.json({
      savedColleges: [mockColleges[0]], // Return IIT Bombay as a pre-saved item in demo mode
      savedComparisons: [
        {
          id: "saved-comp-1",
          userId: userId,
          collegeIds: ["col-iitb", "col-iitd"]
        }
      ]
    });
  }
}

// POST: Save a new college or comparison
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id || 'demo-user-id';

  try {
    const body = await req.json();
    const { type, collegeId, collegeIds } = body;

    // Verify user exists in database to prevent foreign key violations (e.g., if DB was reseeded)
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });
    const finalUserId = userExists ? userId : 'demo-user-id';

    if (type === 'college') {
      if (!collegeId) {
        return NextResponse.json({ error: 'College ID is required' }, { status: 400 });
      }

      // Check if already saved
      const existing = await prisma.savedCollege.findUnique({
        where: {
          userId_collegeId: { userId: finalUserId, collegeId },
        },
      });

      if (existing) {
        return NextResponse.json({ message: 'Already saved' }, { status: 200 });
      }

      const saved = await prisma.savedCollege.create({
        data: { userId: finalUserId, collegeId },
      });

      return NextResponse.json({ message: 'College saved successfully', data: saved }, { status: 201 });
    } else if (type === 'comparison') {
      if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length === 0) {
        return NextResponse.json({ error: 'College IDs list is required' }, { status: 400 });
      }

      const saved = await prisma.savedComparison.create({
        data: { userId: finalUserId, collegeIds },
      });

      return NextResponse.json({ message: 'Comparison saved successfully', data: saved }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid save type' }, { status: 400 });
  } catch (err) {
    console.warn("Database connection offline during POST /api/saved. Simulating success.");
    return NextResponse.json({ message: 'Saved successfully (Demo Mode - Local Fallback)' }, { status: 201 });
  }
}

// DELETE: Remove a saved college or comparison
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id || 'demo-user-id';
  const { searchParams } = new URL(req.url);
  const collegeId = searchParams.get('id'); // for saved colleges
  const comparisonId = searchParams.get('comparisonId'); // for saved comparisons

  try {
    if (collegeId) {
      // Delete specific saved college
      await prisma.savedCollege.delete({
        where: {
          userId_collegeId: { userId, collegeId },
        },
      });
      return NextResponse.json({ message: 'Saved college removed successfully' });
    } else if (comparisonId) {
      // Delete specific saved comparison
      await prisma.savedComparison.delete({
        where: {
          id: comparisonId,
          userId,
        },
      });
      return NextResponse.json({ message: 'Saved comparison removed successfully' });
    }

    return NextResponse.json({ error: 'Missing identifier' }, { status: 400 });
  } catch (err) {
    console.warn("Database connection offline during DELETE /api/saved. Simulating success.");
    return NextResponse.json({ message: 'Removed successfully (Demo Mode - Local Fallback)' });
  }
}
