import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { searchAnime } from "../services/api";
import { AnimeItem } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectAnime: (slug: string) => void;
  onSelectEpisode?: (episodeSlug: string, animeSlug?: string) => void;
  onSearchSubmit?: (query: string) => void;
  historyCount: number;
  bookmarkCount: number;
  onRandomAnime: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectAnime,
  onSearchSubmit,
  historyCount,
  bookmarkCount,
  onRandomAnime,
}) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AnimeItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchAnime(query);
        setSearchResults(results.slice(0, 8));
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchResultClick = (slug: string) => {
    setShowSearchDropdown(false);
    setQuery("");
    onSelectAnime(slug);
  };

  const handleSearchFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setShowSearchDropdown(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
    if (onSearchSubmit) {
      onSearchSubmit(trimmed);
    }
  };

  const navLinks = [
    { id: "home", label: "Beranda" },
    { id: "schedule", label: "Jadwal" },
    { id: "catalog", label: "Katalog" },
    { id: "watchlist", label: "Watchlist", badge: bookmarkCount },
    { id: "history", label: "Riwayat", badge: historyCount },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            id="nav-brand-logo"
            onClick={() => setActiveTab("home")}
            className="group flex flex-col text-left transition-opacity hover:opacity-90 active:scale-95"
          >
            <div className="flex items-center gap-0.5 font-black tracking-tight text-lg sm:text-xl leading-none">
              <span className="text-white">SAND</span>
              <span className="text-red-600 font-extrabold">ANIME</span>
            </div>
            <p className="text-[10px] font-medium tracking-wider text-neutral-400 uppercase mt-0.5">
              Anime Sub Indo
            </p>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => setActiveTab(link.id)}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-red-600 text-white shadow-sm shadow-red-600/30"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span
                      className={`flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-black ${
                        isActive
                          ? "bg-black text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Search & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div ref={searchRef} className="relative w-44 sm:w-60 md:w-72">
            <form onSubmit={handleSearchFormSubmit} className="relative">
              <input
                ref={inputRef}
                id="main-search-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Cari anime... (Tekan Enter)"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/90 py-1.5 pl-8 pr-7 text-xs text-neutral-100 placeholder-neutral-500 transition-all focus:border-red-600 focus:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <button
                type="submit"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500"
                title="Cari"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {/* Search Dropdown Popup */}
            {showSearchDropdown && (query.trim() || searchResults.length > 0) && (
              <div className="absolute left-0 right-0 top-full mt-2 max-h-96 overflow-y-auto rounded-xl border border-neutral-800 bg-[#121212] p-2 shadow-2xl z-50">
                {isSearching ? (
                  <div className="flex items-center justify-center py-5 text-xs text-neutral-400">
                    <div className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    Mencari anime...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      <span>Hasil Langsung ({searchResults.length})</span>
                      <span className="text-[9px] text-neutral-500 lowercase">tekan enter untuk melihat semua</span>
                    </div>
                    {searchResults.map((item, idx) => (
                      <button
                        key={`${item.slug}-${idx}`}
                        id={`search-item-${idx}`}
                        onClick={() => handleSearchResultClick(item.slug)}
                        className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-neutral-800"
                      >
                        <img
                          src={
                            item.poster ||
                            "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=60"
                          }
                          alt={item.title}
                          className="h-11 w-8 rounded object-cover flex-shrink-0 bg-neutral-900 border border-neutral-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-xs font-semibold text-white hover:text-red-500">
                            {item.title}
                          </h4>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-neutral-400">
                            {item.type && (
                              <span className="text-red-500 font-medium">{item.type}</span>
                            )}
                            {item.status && <span>• {item.status}</span>}
                            {item.score && (
                              <span className="text-amber-400 font-bold">
                                Skor {item.score}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
                      </button>
                    ))}

                    <button
                      onClick={() => handleSearchFormSubmit()}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/20 border border-red-600/40 p-2 text-center text-xs font-bold text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <span>Lihat semua hasil untuk "{query}"</span>
                    </button>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-neutral-400 flex flex-col items-center">
                    <img
                      src="https://i.ibb.co.com/4Rz71j9y/1000440130-removebg-preview.png"
                      alt="Tidak ditemukan"
                      className="h-12 w-12 object-contain mb-2 opacity-90 drop-shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <p>Tidak ada preview instan untuk "{query}"</p>
                    <button
                      onClick={() => handleSearchFormSubmit()}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm hover:bg-red-700"
                    >
                      Cari Di Semua Database
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Random Anime Button */}
          <button
            id="nav-random-btn"
            onClick={onRandomAnime}
            title="Pilih Anime Acak"
            className="hidden sm:flex items-center rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300 transition-colors hover:border-red-600 hover:text-red-500"
          >
            <span>Acak</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden rounded-lg border border-neutral-800 bg-neutral-900 p-1.5 text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-800 bg-[#0a0a0a] px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-mobile-link-${link.id}`}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-lg p-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="rounded-full bg-red-600 px-1.5 py-0.2 text-[9px] font-black text-white">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <button
              id="nav-mobile-random"
              onClick={() => {
                onRandomAnime();
                setMobileMenuOpen(false);
              }}
              className="col-span-2 flex items-center justify-center rounded-lg bg-red-600 p-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/30"
            >
              <span>Tonton Anime Acak</span>
            </button>
            <div className="col-span-2 flex items-center justify-center gap-4 pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
              <button
                onClick={() => {
                  setActiveTab("about");
                  setMobileMenuOpen(false);
                }}
                className="hover:text-red-400 transition-colors"
              >
                Tentang Kami
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setActiveTab("sitemap");
                  setMobileMenuOpen(false);
                }}
                className="hover:text-red-400 transition-colors"
              >
                Peta Situs
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
