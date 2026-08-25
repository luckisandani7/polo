import React from "react";
import { Play, Bookmark, Check } from "lucide-react";
import { AnimeItem, BookmarkItem } from "../types";

interface AnimeCardProps {
  anime: AnimeItem;
  onSelect: (slug: string) => void;
  onPlayDirect?: (episodeSlug: string, animeSlug?: string) => void;
  isBookmarked?: BookmarkItem;
  onToggleBookmark?: (anime: AnimeItem) => void;
  showEpisodeBadge?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  showEpisodeBadge = true,
}) => {
  const posterUrl =
    anime.poster ||
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=70";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-[#121212] transition-all duration-200 hover:-translate-y-1 hover:border-red-600/70 hover:shadow-lg hover:shadow-red-950/20">
      {/* Poster Container */}
      <div
        className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden bg-neutral-900"
        onClick={() => onSelect(anime.slug)}
      >
        <img
          src={posterUrl}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30 opacity-60 transition-opacity group-hover:opacity-80" />

        {/* Top Badges */}
        <div className="absolute left-2 right-2 top-2 flex items-center justify-between gap-1 text-[10px] font-bold">
          {anime.score ? (
            <span className="rounded bg-amber-500 px-1.5 py-0.5 text-black font-extrabold shadow">
              ★ {anime.score}
            </span>
          ) : anime.type ? (
            <span className="rounded bg-black/80 px-1.5 py-0.5 text-neutral-200 border border-neutral-700">
              {anime.type}
            </span>
          ) : <div />}

          {showEpisodeBadge && anime.episode && (
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-white font-extrabold shadow-sm shadow-red-900">
              {anime.episode}
            </span>
          )}
        </div>

        {/* Release time tag */}
        {anime.releaseTime && (
          <div className="absolute bottom-2 left-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300 border border-neutral-800">
            {anime.releaseTime}
          </div>
        )}

        {/* Quick Play Hover Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/50 transition-transform group-hover:scale-110">
            <Play className="ml-0.5 h-4 w-4 fill-white" />
          </div>
        </div>
      </div>

      {/* Anime Info */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div>
          <h3
            onClick={() => onSelect(anime.slug)}
            className="cursor-pointer font-bold text-white line-clamp-2 text-xs leading-snug transition-colors hover:text-red-500"
            title={anime.title}
          >
            {anime.title}
          </h3>

          {anime.genres && anime.genres.length > 0 && (
            <p className="mt-1 text-[10px] text-neutral-400 line-clamp-1">
              {anime.genres.slice(0, 2).join(" • ")}
            </p>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-neutral-800/80">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            {anime.status || (anime.type === "TV" ? "TV Series" : "Sub Indo")}
          </span>

          {onToggleBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(anime);
              }}
              title={isBookmarked ? "Hapus dari Watchlist" : "Simpan ke Watchlist"}
              className={`rounded p-1 transition-colors ${
                isBookmarked
                  ? "bg-red-600/20 text-red-500"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {isBookmarked ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
