// app/watchlist/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

// Perhatikan: params di Next.js 15+ sekarang adalah Promise
export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Gunakan hook use() untuk unwrap params
  const { id } = use(params); 
  
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  
  // State untuk Edit
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Ambil data detail saat halaman dibuka
    axios.get(`/api/watchlist/${id}`)
      .then((res) => {
        setMovie(res.data);
        // Set default value form edit
        setTitle(res.data.title);
        setReview(res.data.review);
        setRating(res.data.rating);
      })
      .catch(() => alert("Gagal ambil data"));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/watchlist/${id}`, { title, review, rating });
      alert("Berhasil di-update!");
      setIsEditing(false);
      window.location.reload(); // Refresh halaman
    } catch (error) {
      alert("Gagal update");
    }
  };

  if (!movie) return <div className="p-5">Loading...</div>;

  return (
    <div className="container py-5">
      <Link href="/watchlist" className="btn btn-secondary mb-4">&larr; Kembali</Link>
      
      {!isEditing ? (
        // --- TAMPILAN DETAIL ---
        <div className="card shadow p-4">
          <h1>{movie.title}</h1>
          <span className="badge bg-warning text-dark w-25 mt-2">⭐ {movie.rating}/10</span>
          <p className="mt-4 lead">"{movie.review}"</p>
          <small className="text-muted">Ditambahkan pada: {new Date(movie.createdAt).toLocaleDateString()}</small>
          
          <button 
            className="btn btn-info mt-4 text-white" 
            onClick={() => setIsEditing(true)}
          >
            Edit Data Ini
          </button>
        </div>
      ) : (
        // --- FORM EDIT ---
        <div className="card shadow p-4 bg-light">
          <h3>Edit Data</h3>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label>Judul</label>
              <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="mb-3">
              <label>Review</label>
              <textarea className="form-control" value={review} onChange={e => setReview(e.target.value)} />
            </div>
            <div className="mb-3">
              <label>Rating</label>
              <input type="number" className="form-control" value={rating} onChange={e => setRating(Number(e.target.value))} />
            </div>
            <button type="submit" className="btn btn-success me-2">Simpan Perubahan</button>
            <button type="button" className="btn btn-danger" onClick={() => setIsEditing(false)}>Batal</button>
          </form>
        </div>
      )}
    </div>
  );
}