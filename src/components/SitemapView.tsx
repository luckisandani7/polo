import React from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface SitemapViewProps {
  onNavigateTab: (tab: string) => void;
  onSelectGenre?: (genre: string) => void;
  onBack: () => void;
}

const SCHEDULE_DAYS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

const POPULAR_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Isekai",
  "Romance",
  "Sci-Fi",
  "Shounen",
  "Slice of Life",
  "Supernatural",
  "Mystery",
  "Horror",
  "Psychological",
  "Sports",
];

export const SitemapView: React.FC<SitemapViewProps> = ({
  onNavigateTab,
  onSelectGenre,
  onBack,
}) => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-[#121212] px-4 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Beranda</span>
        </button>

        <span className="text-[11px] font-medium text-neutral-500">
          sandanime.my.id • Peta Situs
        </span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl border border-neutral-800 bg-[#121212] p-6 sm:p-10 space-y-3 shadow-xl">
        <div className="inline-block rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
          Direktori Website
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Peta Situs SandAnime (Sitemap)
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
          Daftar hierarki tautan dan struktur konten di <strong className="text-neutral-200">sandanime.my.id</strong> untuk memudahkan navigasi langsung ke halaman yang Anda tuju.
        </p>
      </div>

      {/* Section 1: Halaman Utama */}
      <div className="rounded-2xl border border-neutral-800 bg-[#121212] p-6 space-y-4">
        <div className="border-b border-neutral-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Navigasi Halaman Utama
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => onNavigateTab("home")}
            className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3.5 text-left transition-colors hover:border-red-600/50 hover:bg-neutral-800"
          >
            <div className="font-bold text-neutral-200">Beranda Anime</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Rilisan terbaru & anime terpopuler</div>
          </button>

          <button
            onClick={() => onNavigateTab("schedule")}
            className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3.5 text-left transition-colors hover:border-amber-600/50 hover:bg-neutral-800"
          >
            <div className="font-bold text-neutral-200">Jadwal Rilis Mingguan</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Jadwal tayang Senin sampai Minggu</div>
          </button>

          <button
            onClick={() => onNavigateTab("catalog")}
            className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3.5 text-left transition-colors hover:border-blue-600/50 hover:bg-neutral-800"
          >
            <div className="font-bold text-neutral-200">Katalog Lengkap (A-Z)</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Semua anime berdasarkan abjad</div>
          </button>

          <button
            onClick={() => onNavigateTab("watchlist")}
            className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3.5 text-left transition-colors hover:border-pink-600/50 hover:bg-neutral-800"
          >
            <div className="font-bold text-neutral-200">Daftar Tontonan (Watchlist)</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Koleksi anime yang Anda simpan</div>
          </button>

          <button
            onClick={() => onNavigateTab("history")}
            className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3.5 text-left transition-colors hover:border-emerald-600/50 hover:bg-neutral-800"
          >
            <div className="font-bold text-neutral-200">Riwayat Tontonan</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Catatan episode yang sedang ditonton</div>
          </button>

          <button
            onClick={() => onNavigateTab("about")}
            className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3.5 text-left transition-colors hover:border-purple-600/50 hover:bg-neutral-800"
          >
            <div className="font-bold text-neutral-200">Tentang Kami</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Profil & komitmen SandAnime</div>
          </button>
        </div>
      </div>

      {/* Section 2: Jadwal Tayang Berdasarkan Hari */}
      <div className="rounded-2xl border border-neutral-800 bg-[#121212] p-6 space-y-4">
        <div className="border-b border-neutral-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            2. Jadwal Tayang Berdasarkan Hari
          </h2>
        </div>
        <p className="text-xs text-neutral-400">
          Pilih hari untuk melihat episode simulcast yang dirilis:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {SCHEDULE_DAYS.map((day) => (
            <button
              key={day}
              onClick={() => onNavigateTab("schedule")}
              className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3 text-center transition-colors hover:border-amber-500 hover:bg-neutral-800 group"
            >
              <div className="text-xs font-bold text-neutral-200 group-hover:text-amber-400">
                {day}
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Simulcast</div>
            </button>
          ))}
        </div>
      </div>

      {/* Section 3: Direktori Abjad A-Z */}
      <div className="rounded-2xl border border-neutral-800 bg-[#121212] p-6 space-y-4">
        <div className="border-b border-neutral-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            3. Indeks Abjad Direktori Anime (A - Z)
          </h2>
        </div>
        <p className="text-xs text-neutral-400">
          Temukan judul anime sesuai huruf awal:
        </p>

        <div className="flex flex-wrap gap-2">
          {ALPHABETS.map((letter) => (
            <button
              key={letter}
              onClick={() => onNavigateTab("catalog")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-xs font-bold text-neutral-300 transition-colors hover:border-red-500 hover:bg-red-600 hover:text-white"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Section 4: Genre Populer */}
      <div className="rounded-2xl border border-neutral-800 bg-[#121212] p-6 space-y-4">
        <div className="border-b border-neutral-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            4. Genre Anime
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {POPULAR_GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                if (onSelectGenre) {
                  onSelectGenre(genre);
                } else {
                  onNavigateTab("home");
                }
              }}
              className="rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:border-emerald-500 hover:text-white"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Section 5: Berkas Teknis Mesin Pencari */}
      <div className="rounded-2xl border border-neutral-800 bg-[#141414] p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
          Berkas Mesin Pencari (Crawler)
        </h3>
        <div className="flex flex-wrap gap-3 text-xs">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 font-medium text-neutral-200 transition-colors hover:text-white"
          >
            <span>sitemap.xml</span>
            <ExternalLink className="h-3 w-3 text-neutral-400" />
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 font-medium text-neutral-200 transition-colors hover:text-white"
          >
            <span>robots.txt</span>
            <ExternalLink className="h-3 w-3 text-neutral-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
