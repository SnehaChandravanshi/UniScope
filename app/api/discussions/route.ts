import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET: Fetch questions list
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const collegeId = searchParams.get('collegeId');
  const search = searchParams.get('search');

  try {
    const where: any = {};

    if (collegeId) {
      where.collegeId = collegeId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const questions = await prisma.question.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true }
        },
        college: {
          select: { id: true, name: true, slug: true }
        },
        _count: {
          select: { answers: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new question
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id || 'demo-user-id';
  console.log('[POST /api/discussions] Session user ID:', userId);

  try {
    const body = await req.json();
    const { title, content, collegeId } = body;
    console.log('[POST /api/discussions] Body parameters:', { title, content, collegeId });

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Verify user exists in database to prevent foreign key violations (e.g., if DB was reseeded)
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });
    console.log('[POST /api/discussions] userExists in DB:', !!userExists);

    const finalUserId = userExists ? userId : 'demo-user-id';
    console.log('[POST /api/discussions] finalUserId determined:', finalUserId);

    // Also check if finalUserId exists in the database
    const finalUserExists = await prisma.user.findUnique({
      where: { id: finalUserId }
    });
    console.log('[POST /api/discussions] finalUserExists in DB:', !!finalUserExists);

    if (!finalUserExists && finalUserId === 'demo-user-id') {
      console.log('[POST /api/discussions] Creating demo-user-id on the fly...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          id: 'demo-user-id',
          name: 'Demo Student',
          email: 'demo@example.com',
          password: hashedPassword,
        }
      });
      console.log('[POST /api/discussions] demo-user-id created.');
    }

    const question = await prisma.question.create({
      data: {
        title,
        content,
        userId: finalUserId,
        collegeId: collegeId || null,
      },
      include: {
        user: {
          select: { id: true, name: true }
        },
        college: {
          select: { id: true, name: true, slug: true }
        },
        _count: {
          select: { answers: true }
        }
      }
    });

    console.log('[POST /api/discussions] Question created successfully:', question.id);
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('[POST /api/discussions] Error creating question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
