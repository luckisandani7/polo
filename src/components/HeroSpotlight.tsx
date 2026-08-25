import React, { useState, useEffect } from "react";
import { Play, Plus, Check, Star, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { AnimeItem, BookmarkItem } from "../types";

interface HeroSpotlightProps {
  items: AnimeItem[];
  onSelectAnime: (slug: string) => void;
  onPlayEpisode?: (episodeSlug: string, animeSlug?: string) => void;
  isBookmarked: (slug: string) => BookmarkItem | undefined;
  onToggleBookmark: (item: any) => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  items,
  onSelectAnime,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannerImgSrc, setBannerImgSrc] = useState(
    "https://gcdnb.pbrd.co/images/ekI_V8ZConDj.png"
  );

  // Auto-advance spotlight every 6 seconds if items exist
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length]);

  const current = items && items.length > 0 ? items[currentIndex] : null;
  const bookmarked = current ? isBookmarked(current.slug) : false;

  const prevSlide = () => {
    if (!items.length) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const nextSlide = () => {
    if (!items.length) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="space-y-4">
      {/* 1. Main Custom Brand Banner (As requested by User) */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-800 bg-[#0d0d0d] shadow-2xl">
        <div className="relative w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-[340px] overflow-hidden flex items-center justify-center bg-black">
          <img
            src={bannerImgSrc}
            alt="Sandanime Banner"
            onError={() => {
              if (bannerImgSrc !== "https://www.pasteboard.co/ekI_V8ZConDj.png") {
                setBannerImgSrc("https://www.pasteboard.co/ekI_V8ZConDj.png");
              }
            }}
            className="h-full w-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Red/Black overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

          {/* Quick interactive banner badge overlay */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-red-600/40">
              <Flame className="h-3.5 w-3.5 fill-white" />
              Nonton Anime Sub Indo
            </span>
            <span className="hidden sm:inline-block rounded-md bg-black/80 px-2.5 py-1 text-xs font-bold text-neutral-300 backdrop-blur-md border border-neutral-700">
              Koleksi Lengkap & Update Cepat
            </span>
          </div>
        </div>
      </div>

      {/* 2. Featured Anime Spotlight Carousel (Simple, Clean Red & Black) */}
      {current && (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#121212] p-5 sm:p-7 shadow-xl">
          {/* Background Blurred Glow */}
          <div className="absolute inset-0 overflow-hidden opacity-15">
            <img
              src={current.poster}
              alt={current.title}
              className="h-full w-full object-cover filter blur-xl scale-125"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/80" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Poster Thumbnail */}
            <div
              onClick={() => onSelectAnime(current.slug)}
              className="relative w-36 sm:w-44 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl group"
            >
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src={current.poster}
                  alt={current.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/40">
                  <Play className="ml-0.5 h-4 w-4 fill-white" />
                </div>
              </div>
            </div>

            {/* Anime Meta & Actions */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="rounded bg-red-600/20 px-2 py-0.5 text-[11px] font-black text-red-500 border border-red-600/30 uppercase tracking-wide">
                  Rekomendasi #{currentIndex + 1}
                </span>
                {current.type && (
                  <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] font-bold text-neutral-300 border border-neutral-700">
                    {current.type}
                  </span>
                )}
                {current.score && (
                  <span className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/30">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {current.score}
                  </span>
                )}
                {current.episode && (
                  <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] font-bold text-neutral-300 border border-neutral-700">
                    {current.episode}
                  </span>
                )}
              </div>

              <h2
                onClick={() => onSelectAnime(current.slug)}
                className="cursor-pointer text-xl sm:text-2xl lg:text-3xl font-extrabold text-white hover:text-red-500 transition-colors line-clamp-2"
              >
                {current.title}
              </h2>

              {current.seriesName && (
                <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2">
                  {current.seriesName.replace(/\t+/g, " - ")}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <button
                  id="hero-watch-btn"
                  onClick={() => onSelectAnime(current.slug)}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition-all hover:bg-red-700 active:scale-95"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Tonton Sekarang</span>
                </button>

                <button
                  id="hero-bookmark-btn"
                  onClick={() =>
                    onToggleBookmark({
                      animeSlug: current.slug,
                      title: current.title,
                      poster: current.poster,
                      type: current.type,
                      score: current.score,
                    })
                  }
                  className={`flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    bookmarked
                      ? "border-emerald-600/50 bg-emerald-600/20 text-emerald-300"
                      : "border-neutral-700 bg-neutral-850 text-neutral-200 hover:bg-neutral-800 hover:border-red-600/50"
                  }`}
                >
                  {bookmarked ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Di Watchlist</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      <span>+ Watchlist</span>
                    </>
                  )}
                </button>

                {/* Slider Nav buttons */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    id="hero-prev-btn"
                    onClick={prevSlide}
                    aria-label="Sebelumnya"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    id="hero-next-btn"
                    onClick={nextSlide}
                    aria-label="Selanjutnya"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
