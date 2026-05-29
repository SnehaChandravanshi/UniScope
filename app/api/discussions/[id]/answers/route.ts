import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id || 'demo-user-id';

  try {
    const body = await req.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Answer content is required' }, { status: 400 });
    }

    // Verify user exists in database to prevent foreign key violations (e.g., if DB was reseeded)
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });
    const finalUserId = userExists ? userId : 'demo-user-id';

    // Also check if finalUserId exists in the database
    const finalUserExists = await prisma.user.findUnique({
      where: { id: finalUserId }
    });

    if (!finalUserExists && finalUserId === 'demo-user-id') {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          id: 'demo-user-id',
          name: 'Demo Student',
          email: 'demo@example.com',
          password: hashedPassword,
        }
      });
    }

    // Verify question exists
    const questionExists = await prisma.question.findUnique({
      where: { id }
    });

    if (!questionExists) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        userId: finalUserId,
        questionId: id
      },
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
