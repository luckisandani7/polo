import React, { useState, useEffect } from "react";
import { Search, ArrowLeft, Sparkles, Filter, X } from "lucide-react";
import { AnimeCard } from "./AnimeCard";
import { AnimeItem, BookmarkItem } from "../types";
import { searchAnime } from "../services/api";

interface SearchResultsViewProps {
  query: string;
  onSelectAnime: (slug: string) => void;
  onBack: () => void;
  onSearchNew: (newQuery: string) => void;
  isBookmarked: (slug: string) => BookmarkItem | undefined;
  onToggleBookmark: (anime: AnimeItem) => void;
  onExploreCatalog: () => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  query,
  onSelectAnime,
  onBack,
  onSearchNew,
  isBookmarked,
  onToggleBookmark,
  onExploreCatalog,
}) => {
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  useEffect(() => {
    setSearchInput(query);
    let isCancelled = false;

    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchAnime(query);
        if (!isCancelled) {
          setResults(data);
        }
      } catch (err) {
        console.error("Failed to perform full search:", err);
        if (!isCancelled) {
          setResults([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    performSearch();

    return () => {
      isCancelled = true;
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && searchInput.trim() !== query) {
      onSearchNew(searchInput.trim());
    }
  };

  // Filter results if user chooses a filter (e.g., status or genre)
  const filteredResults = React.useMemo(() => {
    if (selectedFilter === "ALL") return results;
    if (selectedFilter === "ONGOING") {
      return results.filter((item) =>
        item.status?.toLowerCase().includes("ongoing")
      );
    }
    if (selectedFilter === "COMPLETED") {
      return results.filter(
        (item) =>
          item.status?.toLowerCase().includes("complete") ||
          item.status?.toLowerCase().includes("tamat")
      );
    }
    return results.filter((item) =>
      item.genres?.some((g) => g.toLowerCase() === selectedFilter.toLowerCase())
    );
  }, [results, selectedFilter]);

  // Extract all unique genres from search results for dynamic quick filter tabs
  const availableGenres = React.useMemo(() => {
    const set = new Set<string>();
    results.forEach((item) => {
      item.genres?.forEach((g) => set.add(g));
    });
    return Array.from(set);
  }, [results]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Search Bar Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-neutral-800 bg-[#121212] p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 transition-colors hover:border-red-600/50 hover:bg-neutral-800 hover:text-white"
            title="Kembali"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Hasil Pencarian:</span>
              <span className="text-red-500 font-extrabold truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                "{query}"
              </span>
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              {loading
                ? "Sedang mencari database anime..."
                : `Ditemukan ${results.length} judul anime yang cocok`}
            </p>
          </div>
        </div>

        {/* Refined Search Form */}
        <form onSubmit={handleSubmit} className="relative w-full sm:w-72 md:w-80">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari judul anime lain..."
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900/90 py-2 pl-9 pr-9 text-xs text-neutral-100 placeholder-neutral-500 transition-all focus:border-red-600 focus:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-600"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Filter Tabs if multiple results */}
      {!loading && results.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1 text-xs font-bold text-neutral-400 mr-2 flex-shrink-0">
            <Filter className="h-3.5 w-3.5 text-red-500" />
            <span>Filter:</span>
          </div>

          <button
            onClick={() => setSelectedFilter("ALL")}
            className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
              selectedFilter === "ALL"
                ? "bg-red-600 text-white shadow-sm shadow-red-600/30"
                : "bg-[#121212] border border-neutral-800 text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            Semua ({results.length})
          </button>

          <button
            onClick={() => setSelectedFilter("ONGOING")}
            className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
              selectedFilter === "ONGOING"
                ? "bg-red-600 text-white"
                : "bg-[#121212] border border-neutral-800 text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            Ongoing
          </button>

          <button
            onClick={() => setSelectedFilter("COMPLETED")}
            className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
              selectedFilter === "COMPLETED"
                ? "bg-red-600 text-white"
                : "bg-[#121212] border border-neutral-800 text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            Tamat
          </button>

          {availableGenres.slice(0, 10).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedFilter(g)}
              className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                selectedFilter.toLowerCase() === g.toLowerCase()
                  ? "bg-red-600 text-white"
                  : "bg-[#121212] border border-neutral-800 text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Main Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-xl bg-neutral-900 border border-neutral-800"
            />
          ))}
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredResults.map((anime, idx) => (
            <AnimeCard
              key={`${anime.slug}-${idx}`}
              anime={anime}
              onSelect={onSelectAnime}
              isBookmarked={isBookmarked(anime.slug)}
              onToggleBookmark={(a) => onToggleBookmark(a)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-[#121212] p-12 text-center shadow-lg">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-neutral-900/80 p-2 border border-neutral-800 shadow-inner">
            <img
              src="https://www.pasteboard.co/yu1eLs804tjM.png"
              alt="Tidak Ditemukan"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-lg font-bold text-white">Tidak Ada Hasil Ditemukan</h3>
          <p className="mt-1 max-w-md text-xs text-neutral-400 leading-relaxed">
            Tidak ditemukan anime dengan kata kunci <span className="text-red-400 font-bold">"{query}"</span>.
            Cobalah menggunakan kata kunci yang lebih umum, periksa ejaan judul, atau cari melalui direktori A-Z.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onExploreCatalog}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/30 transition-transform active:scale-95 hover:bg-red-700"
            >
              <Sparkles className="h-4 w-4" />
              <span>Buka Katalog A-Z</span>
            </button>
            <button
              onClick={onBack}
              className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-bold text-neutral-200 transition-colors hover:bg-neutral-700"
            >
              Kembali ke Halaman Sebelumnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
