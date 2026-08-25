import React, { useState, useMemo } from "react";
import { Search, ChevronRight } from "lucide-react";
import { CatalogSection } from "../types";

interface CatalogViewProps {
  catalog: CatalogSection[];
  onSelectAnime: (slug: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ catalog, onSelectAnime }) => {
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const allLetters = useMemo(() => {
    const letters = catalog.map((c) => c.letter);
    return ["ALL", ...letters];
  }, [catalog]);

  const filteredSections = useMemo(() => {
    let result = catalog;

    if (selectedLetter !== "ALL") {
      result = result.filter((s) => s.letter === selectedLetter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result
        .map((sec) => ({
          ...sec,
          animeList: sec.animeList.filter((a) => a.title.toLowerCase().includes(q)),
        }))
        .filter((sec) => sec.animeList.length > 0);
    }

    return result;
  }, [catalog, selectedLetter, searchQuery]);

  const totalAnimeCount = useMemo(() => {
    return catalog.reduce((acc, curr) => acc + curr.animeList.length, 0);
  }, [catalog]);

  return (
    <div className="space-y-6">
      {/* Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="text-red-500 text-xs font-bold uppercase tracking-wider">
            Direktori Lengkap
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-white">
            Katalog Anime A - Z
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Jelajahi {totalAnimeCount} koleksi anime Sub Indo yang tersedia di Sandanime
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dalam direktori..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:border-red-600 focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      {/* Alphabet Fast Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-neutral-800 bg-[#121212] p-2.5">
        {allLetters.map((letter) => {
          const isSelected = selectedLetter === letter;
          return (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs font-bold transition-all ${
                isSelected
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Grouped Sections */}
      {filteredSections.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-[#121212] p-12 text-center text-neutral-400">
          Tidak ditemukan anime untuk filter "{selectedLetter}" {searchQuery && `dengan kata "${searchQuery}"`}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSections.map((sec) => (
            <div key={sec.letter} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-sm font-extrabold text-white shadow-md shadow-red-600/20">
                  {sec.letter}
                </span>
                <span className="text-xs font-semibold text-neutral-400">
                  ({sec.animeList.length} Anime)
                </span>
                <div className="flex-1 border-t border-neutral-800" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {sec.animeList.map((anime, idx) => (
                  <button
                    key={`${anime.slug}-${idx}`}
                    onClick={() => onSelectAnime(anime.slug)}
                    className="flex items-center justify-between rounded-xl border border-neutral-800 bg-[#121212] p-3 text-left transition-all hover:border-red-600/60 hover:bg-neutral-800/80 group"
                  >
                    <span className="truncate text-xs font-semibold text-neutral-200 group-hover:text-red-400 transition-colors pr-2">
                      {anime.title}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-neutral-600 group-hover:text-neutral-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
