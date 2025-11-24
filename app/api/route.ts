import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const watchlist = await prisma.watchlist.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(watchlist);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = await prisma.watchlist.create({
      data: {
        title: body.title,
        review: body.review,
        rating: Number(body.rating),
        tmdbId: body.tmdbId ? Number(body.tmdbId) : null,
        posterPath: body.posterPath || null,
      },
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}