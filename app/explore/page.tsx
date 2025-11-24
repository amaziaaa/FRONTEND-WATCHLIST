import Link from "next/link";

async function getMovies() {
  const API_KEY = "d9d896821803dd9149083df5f312042a"; 
  
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Gagal fetch data");
    return res.json();
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
}

export default async function ExplorePage() {
  const data = await getMovies();
  const movies = data.results || [];

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">🌏 Explore Popular Movies</h2>
        <Link href="/" className="btn btn-secondary">
          &larr; Kembali ke Home
        </Link>
      </div>

      <div className="row g-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {movies.map((movie: any) => (
          <div key={movie.id} className="col-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                  : "https://placehold.co/500x750?text=No+Image"}
                className="card-img-top"
                alt={movie.title}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="small text-muted">Rating: {movie.vote_average}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}