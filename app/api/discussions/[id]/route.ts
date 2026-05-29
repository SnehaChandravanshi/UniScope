import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true }
        },
        college: {
          select: { id: true, name: true, slug: true }
        },
        answers: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching question details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
