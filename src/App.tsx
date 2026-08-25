import React, { useState, useEffect, useMemo } from "react";
import {
  Flame,
  Clock,
  Star,
  ChevronRight,
  Play,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { HeroSpotlight } from "./components/HeroSpotlight";
import { AnimeCard } from "./components/AnimeCard";
import { AnimeDetailView } from "./components/AnimeDetailView";
import { VideoPlayer } from "./components/VideoPlayer";
import { ScheduleView } from "./components/ScheduleView";
import { CatalogView } from "./components/CatalogView";
import { WatchHistoryView } from "./components/WatchHistoryView";
import { Footer } from "./components/Footer";

import {
  getHomeAnime,
  getSchedule,
  getCatalog,
  getAnimeDetail,
  getEpisodeDetail,
  getGenres,
} from "./services/api";
import { useWatchHistory } from "./hooks/useWatchHistory";
import { AnimeDetail, AnimeItem, CatalogSection, EpisodeDetail, ScheduleDay } from "./types";

export default function App() {
  // Navigation & View Routing State
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedAnimeSlug, setSelectedAnimeSlug] = useState<string | null>(null);
  const [selectedEpisodeSlug, setSelectedEpisodeSlug] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("ALL");

  // Data States
  const [homeData, setHomeData] = useState<{
    popularToday: AnimeItem[];
    latestRelease: AnimeItem[];
  }>({ popularToday: [], latestRelease: [] });

  const [scheduleData, setScheduleData] = useState<ScheduleDay[]>([]);
  const [catalogData, setCatalogData] = useState<CatalogSection[]>([]);
  const [genresList, setGenresList] = useState<string[]>([]);

  // Detailed view data
  const [currentAnimeDetail, setCurrentAnimeDetail] = useState<AnimeDetail | null>(null);
  const [currentEpisodeDetail, setCurrentEpisodeDetail] = useState<EpisodeDetail | null>(null);

  // Loading and Error States
  const [loadingHome, setLoadingHome] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingEpisode, setLoadingEpisode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Local Storage Hook for Watch History & Bookmarks
  const {
    history,
    bookmarks,
    recordHistory,
    removeHistoryItem,
    clearHistory,
    toggleBookmark,
    isBookmarked,
    removeBookmark,
  } = useWatchHistory();

  // Set of watched episode slugs for checkmark badges
  const watchedEpisodesSet = useMemo(() => {
    return new Set(history.map((h) => h.episodeSlug));
  }, [history]);

  // Initial Data Fetch
  useEffect(() => {
    async function initData() {
      try {
        setLoadingHome(true);
        const [home, sched, cat, gen] = await Promise.allSettled([
          getHomeAnime(),
          getSchedule(),
          getCatalog(),
          getGenres(),
        ]);

        if (home.status === "fulfilled") setHomeData(home.value);
        if (sched.status === "fulfilled") setScheduleData(sched.value);
        if (cat.status === "fulfilled") setCatalogData(cat.value);
        if (gen.status === "fulfilled") setGenresList(gen.value);
      } catch (err: any) {
        console.error("Initial load error:", err);
        setErrorMsg("Gagal memuat data anime dari server.");
      } finally {
        setLoadingHome(false);
      }
    }
    initData();
  }, []);

  // Handle selecting an anime to open detail page
  const handleSelectAnime = async (slug: string) => {
    setSelectedAnimeSlug(slug);
    setSelectedEpisodeSlug(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      setLoadingDetail(true);
      setErrorMsg(null);
      const detail = await getAnimeDetail(slug);
      setCurrentAnimeDetail(detail);
    } catch (err: any) {
      console.error("Error fetching anime detail:", err);
      setErrorMsg("Tidak dapat memuat detail anime.");
    } finally {
      setLoadingDetail(false);
    }
  };

  // Handle selecting an episode to play in video player
  const handleSelectEpisode = async (episodeSlug: string, animeSlug?: string) => {
    setSelectedEpisodeSlug(episodeSlug);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      setLoadingEpisode(true);
      setErrorMsg(null);

      const epDetail = await getEpisodeDetail(episodeSlug);
      setCurrentEpisodeDetail(epDetail);

      // If we don't have anime details yet, fetch it from seriesSlug
      const targetAnimeSlug = animeSlug || epDetail.seriesSlug || selectedAnimeSlug;
      if (targetAnimeSlug && (!currentAnimeDetail || selectedAnimeSlug !== targetAnimeSlug)) {
        setSelectedAnimeSlug(targetAnimeSlug);
        getAnimeDetail(targetAnimeSlug)
          .then((d) => setCurrentAnimeDetail(d))
          .catch((e) => console.warn("Background detail load warning:", e));
      }
    } catch (err: any) {
      console.error("Error fetching episode detail:", err);
      setErrorMsg("Tidak dapat memuat pemutar video untuk episode ini.");
    } finally {
      setLoadingEpisode(false);
    }
  };

  // Random Anime Selector
  const handleRandomAnime = () => {
    let candidateSlugs: string[] = [];

    if (catalogData.length > 0) {
      catalogData.forEach((sec) => {
        sec.animeList.forEach((a) => {
          if (a.slug) candidateSlugs.push(a.slug);
        });
      });
    }

    if (candidateSlugs.length === 0) {
      homeData.popularToday.forEach((a) => {
        if (a.slug) candidateSlugs.push(a.slug);
      });
      homeData.latestRelease.forEach((a) => {
        if (a.slug) candidateSlugs.push(a.slug);
      });
    }

    if (candidateSlugs.length > 0) {
      const randomSlug = candidateSlugs[Math.floor(Math.random() * candidateSlugs.length)];
      handleSelectAnime(randomSlug);
    }
  };

  // Filter latest releases by selected genre if active
  const filteredLatestRelease = useMemo(() => {
    if (selectedGenre === "ALL") return homeData.latestRelease;
    return homeData.latestRelease.filter((item) =>
      item.genres?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
    );
  }, [homeData.latestRelease, selectedGenre]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 font-sans selection:bg-red-600 selection:text-white flex flex-col">
      {/* Top Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedAnimeSlug(null);
          setSelectedEpisodeSlug(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSelectAnime={handleSelectAnime}
        onSelectEpisode={handleSelectEpisode}
        historyCount={history.length}
        bookmarkCount={bookmarks.length}
        onRandomAnime={handleRandomAnime}
      />

      {/* Main Container Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-600/30 bg-red-600/10 p-4 text-xs sm:text-sm text-red-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="rounded-lg bg-red-600/20 px-3 py-1 font-semibold text-red-300 hover:bg-red-600/30"
            >
              Tutup
            </button>
          </div>
        )}

        {/* 1. EPISODE STREAMING VIDEO PLAYER VIEW */}
        {selectedEpisodeSlug && currentEpisodeDetail ? (
          <VideoPlayer
            episode={currentEpisodeDetail}
            animeTitle={currentAnimeDetail?.title || currentEpisodeDetail.seriesName}
            animePoster={currentAnimeDetail?.poster}
            allEpisodes={currentAnimeDetail?.episodeList || []}
            currentEpisodeSlug={selectedEpisodeSlug}
            onSelectEpisode={(epSlug) => handleSelectEpisode(epSlug, selectedAnimeSlug || undefined)}
            onBackToAnime={() => setSelectedEpisodeSlug(null)}
            onRecordHistory={() => {
              recordHistory({
                animeSlug: currentEpisodeDetail.seriesSlug || selectedAnimeSlug || "unknown",
                animeTitle: currentAnimeDetail?.title || currentEpisodeDetail.seriesName,
                poster: currentAnimeDetail?.poster,
                episodeSlug: selectedEpisodeSlug,
                episodeNumber: currentEpisodeDetail.episodeNumber,
              });
            }}
          />
        ) : selectedEpisodeSlug && loadingEpisode ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
            <p className="text-sm font-semibold text-neutral-400">
              Menyiapkan pemutar video streaming...
            </p>
          </div>
        ) : /* 2. ANIME DETAIL PAGE VIEW */
        selectedAnimeSlug && currentAnimeDetail ? (
          <AnimeDetailView
            anime={currentAnimeDetail}
            animeSlug={selectedAnimeSlug}
            onSelectEpisode={(epSlug) => handleSelectEpisode(epSlug, selectedAnimeSlug)}
            onBack={() => setSelectedAnimeSlug(null)}
            isBookmarked={isBookmarked(selectedAnimeSlug)}
            onToggleBookmark={(status) => {
              toggleBookmark(
                {
                  animeSlug: selectedAnimeSlug,
                  title: currentAnimeDetail.title,
                  poster: currentAnimeDetail.poster,
                  status: status || "watching",
                  score: currentAnimeDetail.rating,
                  type: currentAnimeDetail.type,
                  totalEpisodes: String(currentAnimeDetail.episodeList?.length || ""),
                },
                status
              );
            }}
            watchedEpisodes={watchedEpisodesSet}
          />
        ) : selectedAnimeSlug && loadingDetail ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
            <p className="text-sm font-semibold text-neutral-400">
              Memuat detail lengkap anime...
            </p>
          </div>
        ) : /* 3. SCHEDULE TAB VIEW */
        activeTab === "schedule" ? (
          <ScheduleView schedule={scheduleData} onSelectAnime={handleSelectAnime} />
        ) : /* 4. CATALOG TAB VIEW */
        activeTab === "catalog" ? (
          <CatalogView catalog={catalogData} onSelectAnime={handleSelectAnime} />
        ) : /* 5. WATCHLIST & HISTORY TAB VIEW */
        activeTab === "watchlist" || activeTab === "history" ? (
          <WatchHistoryView
            initialTab={activeTab as any}
            history={history}
            bookmarks={bookmarks}
            onSelectAnime={handleSelectAnime}
            onSelectEpisode={(epSlug, animeSlug) => handleSelectEpisode(epSlug, animeSlug)}
            onRemoveHistory={removeHistoryItem}
            onClearHistory={clearHistory}
            onRemoveBookmark={removeBookmark}
          />
        ) : (
          /* 6. HOME PAGE VIEW (DEFAULT) */
          <div className="space-y-10">
            {/* Spotlight Hero Carousel */}
            {loadingHome ? (
              <div className="h-[420px] w-full animate-pulse rounded-2xl bg-neutral-900 border border-neutral-800" />
            ) : (
              <HeroSpotlight
                items={homeData.popularToday}
                onSelectAnime={handleSelectAnime}
                isBookmarked={(slug) => isBookmarked(slug)}
                onToggleBookmark={(item) =>
                  toggleBookmark({
                    animeSlug: item.animeSlug,
                    title: item.title,
                    poster: item.poster,
                    status: "watching",
                    score: item.score,
                    type: item.type,
                  })
                }
              />
            )}

            {/* Continue Watching Ribbon (if user has history) */}
            {history.length > 0 && (
              <div className="rounded-xl border border-neutral-800 bg-[#121212] p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    <h3 className="font-bold text-sm text-white">Lanjutkan Menonton</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("history")}
                    className="text-xs font-semibold text-red-500 hover:underline"
                  >
                    Lihat Semua ({history.length})
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {history.slice(0, 4).map((h) => (
                    <div
                      key={`${h.animeSlug}-${h.episodeSlug}`}
                      onClick={() => handleSelectEpisode(h.episodeSlug, h.animeSlug)}
                      className="group flex cursor-pointer items-center gap-3 rounded-xl bg-neutral-900/90 p-2.5 border border-neutral-800 transition-all hover:border-red-600/50 hover:bg-neutral-800"
                    >
                      <img
                        src={
                          h.poster ||
                          "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=70"
                        }
                        alt={h.animeTitle}
                        className="h-12 w-9 rounded-md object-cover flex-shrink-0 bg-neutral-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-xs font-bold text-white group-hover:text-red-500">
                          {h.animeTitle}
                        </h4>
                        <span className="text-[11px] font-semibold text-red-500 block mt-0.5">
                          Episode {h.episodeNumber}
                        </span>
                      </div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Play className="ml-0.5 h-3 w-3 fill-current" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Genres Quick Filter Bar */}
            {genresList.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-red-500" />
                    <h3 className="font-bold text-sm text-white">Jelajahi Berdasarkan Genre</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  <button
                    onClick={() => setSelectedGenre("ALL")}
                    className={`flex-shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      selectedGenre === "ALL"
                        ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                        : "bg-[#121212] border border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                    }`}
                  >
                    Semua Genre
                  </button>
                  {genresList.slice(0, 16).map((genre) => {
                    const isSelected = selectedGenre.toLowerCase() === genre.toLowerCase();
                    return (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`flex-shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                            : "bg-[#121212] border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section: Episode Terbaru (Latest Updates) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-500" />
                  <h2 className="text-xl font-bold text-white">
                    Episode Terbaru (Latest Release)
                  </h2>
                  {selectedGenre !== "ALL" && (
                    <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-xs font-bold text-red-400">
                      Genre: {selectedGenre}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab("schedule")}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:underline"
                >
                  <span>Lihat Jadwal</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {loadingHome ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] animate-pulse rounded-xl bg-neutral-900 border border-neutral-800"
                    />
                  ))}
                </div>
              ) : filteredLatestRelease.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredLatestRelease.map((anime, idx) => (
                    <AnimeCard
                      key={`${anime.slug}-${idx}`}
                      anime={anime}
                      onSelect={handleSelectAnime}
                      isBookmarked={isBookmarked(anime.slug)}
                      onToggleBookmark={(a) =>
                        toggleBookmark({
                          animeSlug: a.slug,
                          title: a.title,
                          poster: a.poster || "",
                          status: "watching",
                          score: a.score,
                          type: a.type,
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-neutral-800 bg-[#121212] p-8 text-center text-xs text-neutral-400">
                  Tidak ada anime yang sesuai untuk genre "{selectedGenre}".
                </div>
              )}
            </div>

            {/* Section: Anime Populer Hari Ini (Popular Today) */}
            {homeData.popularToday.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                    <h2 className="text-xl font-bold text-white">
                      Anime Populer Hari Ini
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("catalog")}
                    className="flex items-center gap-1 text-xs font-bold text-red-500 hover:underline"
                  >
                    <span>Jelajahi Semua</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {homeData.popularToday.map((anime, idx) => (
                    <AnimeCard
                      key={`pop-${anime.slug}-${idx}`}
                      anime={anime}
                      onSelect={handleSelectAnime}
                      isBookmarked={isBookmarked(anime.slug)}
                      onToggleBookmark={(a) =>
                        toggleBookmark({
                          animeSlug: a.slug,
                          title: a.title,
                          poster: a.poster || "",
                          status: "watching",
                          score: a.score,
                          type: a.type,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Aesthetic Footer */}
      <Footer onNavClick={(tab) => {
        setActiveTab(tab);
        setSelectedAnimeSlug(null);
        setSelectedEpisodeSlug(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }} />
    </div>
  );
}
