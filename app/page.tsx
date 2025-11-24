"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

// Kita definisikan tipe datanya biar gak kena error "any"
interface WatchlistItem {
  id: number;
  title: string;
  review: string;
  rating: number;
}

export default function WatchlistPage() {
  const [movies, setMovies] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  // FUNGSI FETCH BIASA (Tanpa useCallback biar simpel)
  const fetchMovies = async () => {
    try {
      const response = await axios.get("/api/watchlist");
      setMovies(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      setIsLoading(false);
    }
  };

  // USE EFFECT
  useEffect(() => {
    // eslint-disable-next-line
    fetchMovies();
    // Baris di bawah ini adalah "Mantra" supaya Linter tidak cerewet:
  }, []); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !review) return alert("Judul dan Review wajib diisi!");

    try {
      await axios.post("/api/watchlist", {
        title,
        review,
        rating: Number(rating),
      });
      setTitle("");
      setReview("");
      setRating(5);
      fetchMovies(); // Refresh data
      alert("Berhasil disimpan!");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Yakin mau hapus?")) return;
    try {
      await axios.delete(`/api/watchlist/${id}`);
      fetchMovies(); // Refresh data
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">📝 My Watchlist (Database Local)</h2>
      
      <div className="row">
        {/* Form Input */}
        <div className="col-md-4">
          <div className="card shadow-sm p-3 mb-4 sticky-top" style={{ top: "20px" }}>
            <h5 className="card-title mb-3">Tambah Film Baru</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Judul Film</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Inception"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Review Singkat</label>
                <textarea 
                  className="form-control" 
                  rows={3}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Filmnya seru banget..."
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Rating (1-10)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="1" max="10"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                + Simpan ke Database
              </button>
            </form>
          </div>
        </div>

        {/* List Data */}
        <div className="col-md-8">
          {isLoading ? (
            <p>Loading data...</p>
          ) : movies.length === 0 ? (
            <div className="alert alert-info">Belum ada data watchlist. Ayo tambah!</div>
          ) : (
            <div className="row g-3">
              {movies.map((movie) => (
                <div key={movie.id} className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title fw-bold text-primary">
                            <Link href={`/watchlist/${movie.id}`} className="text-decoration-none">
                                {movie.title}
                            </Link>
                        </h5>
                        <p className="card-text mb-1 text-muted">&quot;{movie.review}&quot;</p>
                        <span className="badge bg-warning text-dark">⭐ {movie.rating}/10</span>
                      </div>
                      <div className="d-flex gap-2">
                         <Link href={`/watchlist/${movie.id}`} className="btn btn-sm btn-outline-info">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(movie.id)} 
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}