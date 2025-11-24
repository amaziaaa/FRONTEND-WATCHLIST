// app/api/watchlist/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. DELETE: Menghapus data berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id); // Ubah ID dari string URL jadi angka

    await prisma.watchlist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}

// 2. PUT: Mengupdate data (Edit)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const body = await request.json(); // Ambil data baru dari form edit

    const updatedItem = await prisma.watchlist.update({
      where: { id },
      data: {
        title: body.title,
        review: body.review,
        rating: Number(body.rating),
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

// 3. GET: Mengambil 1 data saja (Untuk halaman Detail)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    
    const item = await prisma.watchlist.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil data detail" }, { status: 500 });
  }
}