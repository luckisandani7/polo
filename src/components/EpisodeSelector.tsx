import React, { useState, useMemo } from "react";
import { Search, Play } from "lucide-react";
import { EpisodeItem } from "../types";

interface EpisodeSelectorProps {
  episodes: EpisodeItem[];
  onSelectEpisode: (slug: string) => void;
  watchedEpisodes?: Set<string>;
}

export const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  episodes,
  onSelectEpisode,
  watchedEpisodes = new Set(),
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0);

  const PAGE_SIZE = 25;

  // Filter episodes
  const filtered = useMemo(() => {
    if (!filterQuery.trim()) return episodes;
    return episodes.filter((ep) =>
      ep.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      ep.episode.includes(filterQuery)
    );
  }, [episodes, filterQuery]);

  // Generate range tabs if > 25 episodes
  const totalRanges = Math.ceil(filtered.length / PAGE_SIZE);
  const currentRangeEpisodes = useMemo(() => {
    if (filtered.length <= PAGE_SIZE) return filtered;
    const start = selectedRangeIndex * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, selectedRangeIndex]);

  return (
    <div className="space-y-4">
      {/* Header controls: Search & View Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
            Daftar Episode
          </h3>
          <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-black text-white">
            {episodes.length} EPISODE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Episode */}
          <div className="relative w-36 sm:w-48">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setSelectedRangeIndex(0);
              }}
              placeholder="Cari episode..."
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 py-1.5 pl-8 pr-3 text-xs text-neutral-200 placeholder-neutral-500 focus:border-red-600 focus:outline-none"
            />
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded px-2.5 py-1 transition-colors ${
                viewMode === "grid"
                  ? "bg-red-600 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded px-2.5 py-1 transition-colors ${
                viewMode === "list"
                  ? "bg-red-600 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Range Tabs if large list */}
      {totalRanges > 1 && !filterQuery && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-800 pb-3">
          {Array.from({ length: totalRanges }).map((_, idx) => {
            const start = idx * PAGE_SIZE + 1;
            const end = Math.min((idx + 1) * PAGE_SIZE, filtered.length);
            const isSelected = idx === selectedRangeIndex;
            return (
              <button
                key={idx}
                onClick={() => setSelectedRangeIndex(idx)}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                  isSelected
                    ? "bg-red-600 text-white"
                    : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                }`}
              >
                Ep {start} - {end}
              </button>
            );
          })}
        </div>
      )}

      {/* Episode Listing */}
      {currentRangeEpisodes.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center text-xs text-neutral-400">
          Tidak ada episode yang cocok dengan "{filterQuery}"
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {currentRangeEpisodes.map((ep) => {
            const isWatched = watchedEpisodes.has(ep.slug);
            return (
              <button
                key={ep.slug}
                onClick={() => onSelectEpisode(ep.slug)}
                className="group relative flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-[#141414] p-2.5 text-center transition-all hover:border-red-600 hover:bg-neutral-850"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-white group-hover:text-red-500">
                  <Play className="h-3 w-3 fill-current opacity-0 transition-opacity group-hover:opacity-100" />
                  <span>Ep {ep.episode}</span>
                </div>
                {ep.date && (
                  <span className="mt-1 text-[10px] text-neutral-400 truncate max-w-full">
                    {ep.date}
                  </span>
                )}
                {isWatched && (
                  <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-emerald-500" title="Sudah ditonton" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1.5">
          {currentRangeEpisodes.map((ep) => {
            const isWatched = watchedEpisodes.has(ep.slug);
            return (
              <button
                key={ep.slug}
                onClick={() => onSelectEpisode(ep.slug)}
                className="flex w-full items-center justify-between rounded-lg border border-neutral-800 bg-[#141414] p-2.5 text-left transition-all hover:border-red-600 hover:bg-neutral-850"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-neutral-900 text-xs font-bold text-red-500 border border-neutral-800">
                    {ep.episode}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{ep.title}</h4>
                    {ep.date && <p className="text-[10px] text-neutral-400">{ep.date}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isWatched && (
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      Ditonton
                    </span>
                  )}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 text-red-500">
                    <Play className="h-3 w-3 fill-current" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
