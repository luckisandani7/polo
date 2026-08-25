import React, { useState } from "react";
import {
  Star,
  Play,
  Bookmark,
  Check,
  Share2,
  ChevronLeft,
  Info,
} from "lucide-react";
import { AnimeDetail, BookmarkItem } from "../types";
import { EpisodeSelector } from "./EpisodeSelector";

interface AnimeDetailViewProps {
  anime: AnimeDetail;
  animeSlug: string;
  onSelectEpisode: (episodeSlug: string) => void;
  onBack: () => void;
  isBookmarked: BookmarkItem | undefined;
  onToggleBookmark: (status?: BookmarkItem["status"]) => void;
  watchedEpisodes?: Set<string>;
}

export const AnimeDetailView: React.FC<AnimeDetailViewProps> = ({
  anime,
  onSelectEpisode,
  onBack,
  isBookmarked,
  onToggleBookmark,
  watchedEpisodes = new Set(),
}) => {
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const firstEpisodeSlug =
    anime.episodeList && anime.episodeList.length > 0
      ? anime.episodeList[anime.episodeList.length - 1]?.slug ||
        anime.episodeList[0]?.slug
      : null;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-[#121212] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 transition-colors hover:border-red-600 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4 text-red-500" />
        <span>Kembali</span>
      </button>

      {/* Hero Backdrop & Details Header */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#101010] p-5 sm:p-7 shadow-xl">
        {/* Blurred backdrop artwork */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <img
            src={anime.poster}
            alt={anime.title}
            className="h-full w-full object-cover filter blur-xl scale-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        {/* Content Details */}
        <div className="relative z-10 flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Main Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0 w-44 sm:w-52 lg:w-60">
            <div className="overflow-hidden rounded-xl border border-neutral-700 shadow-2xl bg-neutral-900 aspect-[3/4]">
              <img
                src={anime.poster}
                alt={anime.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bookmark & Share Buttons */}
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() => onToggleBookmark("watching")}
                className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isBookmarked
                    ? "border border-emerald-600/50 bg-emerald-600/20 text-emerald-400"
                    : "border border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:border-red-600/50"
                }`}
              >
                {isBookmarked ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Di Watchlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    <span>+ Watchlist</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{copied ? "Link Disalin!" : "Bagikan"}</span>
              </button>
            </div>
          </div>

          {/* Anime Meta Details */}
          <div className="flex-1 space-y-4">
            {/* Title & Type */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {anime.type && (
                  <span className="rounded bg-neutral-800 px-2 py-0.5 font-bold text-neutral-300 border border-neutral-700">
                    {anime.type}
                  </span>
                )}
                {anime.status && (
                  <span
                    className={`rounded px-2 py-0.5 font-bold uppercase tracking-wider text-[11px] border ${
                      anime.status.toLowerCase().includes("ongoing")
                        ? "bg-red-600/20 text-red-500 border-red-600/30"
                        : "bg-emerald-600/20 text-emerald-400 border-emerald-600/30"
                    }`}
                  >
                    {anime.status}
                  </span>
                )}
                {anime.rating && (
                  <span className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 font-bold text-amber-400 border border-amber-500/30">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {anime.rating}
                  </span>
                )}
              </div>

              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {anime.title}
              </h1>
              {anime.japanese && (
                <p className="mt-0.5 text-xs text-neutral-400 font-medium">
                  {anime.japanese}
                </p>
              )}
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 rounded-xl bg-neutral-900/80 p-3.5 border border-neutral-800 text-xs">
              {anime.studio && (
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Studio:</span>
                  <span className="font-semibold text-neutral-200">{anime.studio}</span>
                </div>
              )}
              {anime.producers && (
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Produser:</span>
                  <span className="font-semibold text-neutral-200 truncate block">{anime.producers}</span>
                </div>
              )}
              {anime.duration && (
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Durasi:</span>
                  <span className="font-semibold text-neutral-200">{anime.duration}</span>
                </div>
              )}
              {anime.season && (
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Musim / Tayang:</span>
                  <span className="font-semibold text-neutral-200">{anime.season}</span>
                </div>
              )}
              {anime.releasedOn && (
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Tanggal Rilis:</span>
                  <span className="font-semibold text-neutral-200">{anime.releasedOn}</span>
                </div>
              )}
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">Jumlah Episode:</span>
                <span className="font-bold text-red-500">
                  {anime.episodeList?.length || 0} Episode
                </span>
              </div>
            </div>

            {/* Genre Pills */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {anime.genres.map((genre, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-neutral-850 px-2 py-0.5 text-xs font-semibold text-neutral-300 border border-neutral-700 hover:border-red-600/50 hover:text-red-400 transition-colors"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {anime.synopsis?.paragraphList && anime.synopsis.paragraphList.length > 0 && (
              <div className="space-y-1 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
                  <Info className="h-3.5 w-3.5" />
                  Sinopsis Cerita
                </div>
                {anime.synopsis.paragraphList.map((p, idx) => (
                  <p
                    key={idx}
                    className={!showFullSynopsis && idx > 0 ? "hidden" : "block"}
                  >
                    {p}
                  </p>
                ))}
                {anime.synopsis.paragraphList.length > 1 && (
                  <button
                    onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                    className="text-xs font-bold text-red-500 hover:underline pt-1"
                  >
                    {showFullSynopsis ? "Tampilkan Lebih Sedikit" : "Baca Selengkapnya..."}
                  </button>
                )}
              </div>
            )}

            {/* Primary Action Button */}
            {firstEpisodeSlug && (
              <div className="pt-1">
                <button
                  onClick={() => onSelectEpisode(firstEpisodeSlug)}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/30 hover:bg-red-700 active:scale-95 transition-all"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Mulai Tonton Episode 1</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Episode Browser Section */}
      <div className="rounded-2xl border border-neutral-800 bg-[#121212] p-5 shadow-xl">
        <EpisodeSelector
          episodes={anime.episodeList || []}
          onSelectEpisode={onSelectEpisode}
          watchedEpisodes={watchedEpisodes}
        />
      </div>
    </div>
  );
};
