// app/api/watchlist/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. GET: Ambil SEMUA data watchlist
export async function GET() {
  try {
    const watchlist = await prisma.watchlist.findMany({
      orderBy: { createdAt: 'desc' } // Urutkan dari yang paling baru
    });
    return NextResponse.json(watchlist);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// 2. POST: Tambah data BARU
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newItem = await prisma.watchlist.create({
      data: {
        title: body.title,
        review: body.review,
        rating: Number(body.rating),
        // Data di bawah ini opsional (boleh ada boleh tidak)
        tmdbId: body.tmdbId ? Number(body.tmdbId) : null,
        posterPath: body.posterPath || null,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}