import React, { useState } from "react";
import {
  Bookmark,
  History,
  Trash2,
  Play,
  Star,
  Sparkles,
} from "lucide-react";
import { BookmarkItem, WatchHistoryItem } from "../types";

interface WatchHistoryViewProps {
  initialTab?: "watchlist" | "history";
  history: WatchHistoryItem[];
  bookmarks: BookmarkItem[];
  onSelectAnime: (slug: string) => void;
  onSelectEpisode: (episodeSlug: string, animeSlug?: string) => void;
  onRemoveHistory: (animeSlug: string, episodeSlug?: string) => void;
  onClearHistory: () => void;
  onRemoveBookmark: (animeSlug: string) => void;
}

export const WatchHistoryView: React.FC<WatchHistoryViewProps> = ({
  initialTab = "watchlist",
  history,
  bookmarks,
  onSelectAnime,
  onSelectEpisode,
  onRemoveHistory,
  onClearHistory,
  onRemoveBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<"watchlist" | "history">(initialTab);
  const [bookmarkFilter, setBookmarkFilter] = useState<string>("all");

  const filteredBookmarks = bookmarks.filter((b) => {
    if (bookmarkFilter === "all") return true;
    return b.status === bookmarkFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            Koleksi Pribadi
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-white">
            {activeTab === "watchlist" ? "Daftar Tontonan (Watchlist)" : "Riwayat Menonton"}
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Tersimpan otomatis di browser Anda untuk melanjutkan streaming kapan saja
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-[#121212] p-1">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "watchlist"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Watchlist ({bookmarks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "history"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Riwayat ({history.length})</span>
          </button>
        </div>
      </div>

      {/* WATCHLIST TAB */}
      {activeTab === "watchlist" && (
        <div className="space-y-4">
          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "Semua" },
              { id: "watching", label: "Sedang Ditonton" },
              { id: "plan", label: "Rencana Nonton" },
              { id: "completed", label: "Selesai" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setBookmarkFilter(f.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  bookmarkFilter === f.id
                    ? "bg-neutral-800 text-red-500 border border-red-600/50 font-bold"
                    : "bg-[#121212] border border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredBookmarks.length === 0 ? (
            <div className="rounded-xl border border-neutral-800 bg-[#121212] p-12 text-center text-neutral-400">
              <Bookmark className="mx-auto h-10 w-10 text-neutral-600 mb-3" />
              <h3 className="text-base font-bold text-white">Watchlist Kosong</h3>
              <p className="mt-1 text-xs max-w-sm mx-auto">
                Anda belum menandai anime apapun. Klik ikon bookmark pada anime untuk menyimpannya ke daftar tontonan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredBookmarks.map((item) => (
                <div
                  key={item.animeSlug}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-[#121212] transition-all hover:border-red-600/70 hover:shadow-lg"
                >
                  <div
                    onClick={() => onSelectAnime(item.animeSlug)}
                    className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden bg-neutral-900"
                  >
                    <img
                      src={
                        item.poster ||
                        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=70"
                      }
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30" />

                    {item.score && (
                      <span className="absolute top-2 left-2 flex items-center gap-0.5 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-extrabold text-black">
                        <Star className="h-2.5 w-2.5 fill-black" />
                        {item.score}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(item.animeSlug);
                      }}
                      title="Hapus dari Watchlist"
                      className="absolute top-2 right-2 rounded bg-black/70 p-1 text-neutral-400 hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <h4
                      onClick={() => onSelectAnime(item.animeSlug)}
                      className="cursor-pointer text-xs font-bold text-white line-clamp-2 hover:text-red-500 transition-colors"
                    >
                      {item.title}
                    </h4>

                    <div className="mt-2 flex items-center justify-between pt-1 border-t border-neutral-800">
                      <span className="text-[10px] uppercase font-bold text-red-500">
                        {item.status}
                      </span>
                      {item.type && (
                        <span className="text-[10px] text-neutral-400 font-semibold">
                          {item.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400">
              Total {history.length} episode tercatat
            </span>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Semua Riwayat</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="rounded-xl border border-neutral-800 bg-[#121212] p-12 text-center text-neutral-400">
              <History className="mx-auto h-10 w-10 text-neutral-600 mb-3" />
              <h3 className="text-base font-bold text-white">Belum Ada Riwayat</h3>
              <p className="mt-1 text-xs max-w-sm mx-auto">
                Riwayat pemutaran episode anime yang Anda tonton akan otomatis muncul di sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {history.map((h) => (
                <div
                  key={`${h.animeSlug}-${h.episodeSlug}`}
                  className="group relative flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#121212] p-2.5 transition-all hover:border-red-600/60 hover:bg-neutral-900"
                >
                  <div
                    onClick={() => onSelectEpisode(h.episodeSlug, h.animeSlug)}
                    className="relative aspect-[3/4] h-16 w-12 cursor-pointer overflow-hidden rounded-md bg-neutral-900 flex-shrink-0"
                  >
                    <img
                      src={
                        h.poster ||
                        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=70"
                      }
                      alt={h.animeTitle}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-4 w-4 fill-white text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4
                      onClick={() => onSelectAnime(h.animeSlug)}
                      className="cursor-pointer truncate text-xs font-bold text-white hover:text-red-500 transition-colors"
                    >
                      {h.animeTitle}
                    </h4>
                    <span className="mt-0.5 block text-xs font-extrabold text-red-500">
                      Episode {h.episodeNumber}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(h.updatedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveHistory(h.animeSlug, h.episodeSlug)}
                    title="Hapus riwayat episode ini"
                    className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
