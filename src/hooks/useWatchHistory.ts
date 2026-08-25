import { useEffect, useState } from "react";
import { BookmarkItem, WatchHistoryItem } from "../types";

const HISTORY_KEY = "kitsunee_watch_history";
const BOOKMARKS_KEY = "kitsunee_bookmarks";

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error("Failed to save bookmarks to localStorage", e);
    }
  }, [bookmarks]);

  const recordHistory = (item: Omit<WatchHistoryItem, "updatedAt">) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (h) => !(h.animeSlug === item.animeSlug && h.episodeSlug === item.episodeSlug)
      );
      return [
        {
          ...item,
          updatedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, 50); // limit to 50 entries
    });
  };

  const removeHistoryItem = (animeSlug: string, episodeSlug?: string) => {
    setHistory((prev) =>
      prev.filter((h) => {
        if (episodeSlug) {
          return !(h.animeSlug === animeSlug && h.episodeSlug === episodeSlug);
        }
        return h.animeSlug !== animeSlug;
      })
    );
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const toggleBookmark = (
    item: Omit<BookmarkItem, "addedAt">,
    targetStatus: BookmarkItem["status"] = "watching"
  ) => {
    setBookmarks((prev) => {
      const existingIndex = prev.findIndex((b) => b.animeSlug === item.animeSlug);
      if (existingIndex > -1) {
        // If already exists with same status, remove it. If different status, update status.
        if (prev[existingIndex].status === targetStatus) {
          return prev.filter((b) => b.animeSlug !== item.animeSlug);
        } else {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            status: targetStatus,
          };
          return updated;
        }
      } else {
        return [
          {
            ...item,
            status: targetStatus,
            addedAt: Date.now(),
          },
          ...prev,
        ];
      }
    });
  };

  const isBookmarked = (animeSlug: string): BookmarkItem | undefined => {
    return bookmarks.find((b) => b.animeSlug === animeSlug);
  };

  const removeBookmark = (animeSlug: string) => {
    setBookmarks((prev) => prev.filter((b) => b.animeSlug !== animeSlug));
  };

  return {
    history,
    bookmarks,
    recordHistory,
    removeHistoryItem,
    clearHistory,
    toggleBookmark,
    isBookmarked,
    removeBookmark,
  };
}
