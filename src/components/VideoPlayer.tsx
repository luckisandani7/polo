import React, { useState, useEffect } from "react";
import {
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Download,
  Server,
  Share2,
  ExternalLink,
  MessageSquare,
  Send,
  CheckCircle2,
  ListVideo,
  Info,
  Loader2,
} from "lucide-react";
import { EpisodeDetail, EpisodeItem, CommentItem } from "../types";
import { getServerStreamUrl } from "../services/api";

interface VideoPlayerProps {
  episode: EpisodeDetail;
  animeTitle?: string;
  animePoster?: string;
  allEpisodes?: EpisodeItem[];
  currentEpisodeSlug: string;
  onSelectEpisode: (slug: string) => void;
  onBackToAnime: () => void;
  onRecordHistory: (currentTime?: number, duration?: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  episode,
  animeTitle,
  allEpisodes = [],
  currentEpisodeSlug,
  onSelectEpisode,
  onBackToAnime,
  onRecordHistory,
}) => {
  const [theaterMode, setTheaterMode] = useState(false);
  const [lightsOff, setLightsOff] = useState(false);

  // Active stream state
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>(episode.streamingUrl);
  const [activeServerName, setActiveServerName] = useState<string>("Utama (DesuStream)");
  const [selectedQuality, setSelectedQuality] = useState<string>("720p");
  const [loadingServer, setLoadingServer] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [activeDownloadTab, setActiveDownloadTab] = useState<string>("Mp4_720p");
  const [copiedLink, setCopiedLink] = useState(false);

  // Discussion & Comments state
  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem(`comments_${episode.seriesSlug}`);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: "c1",
              user: "AnimeLovers99",
              avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AnimeLovers99",
              text: "Animasi episode ini gila banget! Kualitas visualnya mantap pol 🔥",
              timestamp: Date.now() - 1000 * 60 * 45,
              likes: 14,
              episodeNumber: episode.episodeNumber,
            },
            {
              id: "c2",
              user: "SandAnimeFan",
              avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=SandAnimeFan",
              text: "Gak sabar nunggu kelanjutan episode minggu depan!",
              timestamp: Date.now() - 1000 * 60 * 120,
              likes: 8,
              episodeNumber: episode.episodeNumber,
            },
          ];
    } catch {
      return [];
    }
  });
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("WibuKeren");

  // Reset stream when episode changes
  useEffect(() => {
    setCurrentStreamUrl(episode.streamingUrl);
    setActiveServerName("Utama (DesuStream)");
    setServerError(null);
    onRecordHistory();

    // Default download tab
    if (episode.download && episode.download.length > 0) {
      setActiveDownloadTab(episode.download[0].title);
    }
  }, [episode.episodeNumber, currentEpisodeSlug, episode.streamingUrl]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSwitchServer = async (serverId: string, serverTitle: string, quality: string) => {
    try {
      setLoadingServer(true);
      setServerError(null);
      setActiveServerName(`${serverTitle} (${quality})`);
      const resolvedUrl = await getServerStreamUrl(serverId);
      if (resolvedUrl) {
        setCurrentStreamUrl(resolvedUrl);
      } else {
        setServerError("Gagal memuat URL server, coba server lain.");
      }
    } catch (err: any) {
      console.error("Error switching server:", err);
      setServerError("Server sedang sibuk, silakan coba server lain.");
    } finally {
      setLoadingServer(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const item: CommentItem = {
      id: "c_" + Date.now(),
      user: userName.trim() || "Anonim",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`,
      text: newComment.trim(),
      timestamp: Date.now(),
      likes: 0,
      episodeNumber: episode.episodeNumber,
    };

    const updated = [item, ...comments];
    setComments(updated);
    setNewComment("");
    try {
      localStorage.setItem(`comments_${episode.seriesSlug}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`relative min-h-screen text-neutral-100 ${lightsOff ? "bg-black" : ""}`}>
      {/* Lights Off Dimming Backdrop */}
      {lightsOff && (
        <div
          onClick={() => setLightsOff(false)}
          className="fixed inset-0 z-30 bg-black/95 backdrop-blur-md transition-opacity"
        />
      )}

      <div
        className={`mx-auto transition-all duration-300 ${
          theaterMode ? "max-w-full px-2 sm:px-4" : "max-w-7xl px-4 sm:px-6 lg:px-8"
        }`}
      >
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
            <button
              onClick={onBackToAnime}
              className="flex items-center gap-1 font-bold text-neutral-300 hover:text-red-500 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-red-500" />
              <span>{animeTitle || episode.seriesName || "Detail Anime"}</span>
            </button>
            <span className="text-neutral-600">/</span>
            <span className="font-extrabold text-white">
              Episode {episode.episodeNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLightsOff(!lightsOff)}
              title={lightsOff ? "Nyalakan Lampu" : "Mode Bioskop"}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                lightsOff
                  ? "border-amber-500 bg-amber-500/20 text-amber-300"
                  : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {lightsOff ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">
                {lightsOff ? "Nyalakan Lampu" : "Bioskop"}
              </span>
            </button>

            <button
              onClick={() => setTheaterMode(!theaterMode)}
              title={theaterMode ? "Mode Normal" : "Mode Lebar (Theater)"}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                theaterMode
                  ? "border-red-600 bg-red-600/20 text-red-500"
                  : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {theaterMode ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">
                {theaterMode ? "Normal" : "Theater"}
              </span>
            </button>
          </div>
        </div>

        {/* Video Player & Main Stage */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Player Column */}
          <div className={`space-y-4 ${theaterMode ? "lg:col-span-12" : "lg:col-span-8 xl:col-span-9"}`}>
            {/* Player Container */}
            <div className="relative z-40 overflow-hidden rounded-xl border border-neutral-800 bg-black shadow-2xl">
              <div className="relative aspect-video w-full bg-black">
                {loadingServer ? (
                  <div className="flex h-full w-full flex-col items-center justify-center space-y-3 bg-black/90">
                    <Loader2 className="h-10 w-10 animate-spin text-red-600" />
                    <p className="text-xs font-bold text-neutral-300">
                      Menghubungkan ke {activeServerName}...
                    </p>
                  </div>
                ) : currentStreamUrl ? (
                  <iframe
                    key={currentStreamUrl}
                    src={currentStreamUrl}
                    title={episode.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-neutral-400">
                    <Info className="mb-2 h-10 w-10 text-red-500" />
                    <p className="font-bold text-white">Stream tidak tersedia</p>
                    <p className="mt-1 text-xs">Silakan pilih server lain di bawah ini.</p>
                  </div>
                )}
              </div>

              {/* Player Top-right quick tools */}
              <div className="flex items-center justify-between border-t border-neutral-800 bg-[#0c0c0c] px-4 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-semibold text-neutral-300">
                    Server Aktif: <span className="text-red-500 font-bold">{activeServerName}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={currentStreamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    title="Buka player di tab baru"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Tab Baru</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Error banner if server fails */}
            {serverError && (
              <div className="rounded-lg border border-red-600/30 bg-red-600/10 p-3 text-xs text-red-400">
                {serverError}
              </div>
            )}

            {/* Server Selector Bar (Otakudesu Servers / Qualities) */}
            <div className="rounded-xl border border-neutral-800 bg-[#121212] p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Pilihan Server & Kualitas
                  </span>
                </div>

                {/* Default Server quick switch */}
                <button
                  onClick={() => {
                    setCurrentStreamUrl(episode.streamingUrl);
                    setActiveServerName("Utama (DesuStream)");
                  }}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                    currentStreamUrl === episode.streamingUrl
                      ? "bg-red-600 text-white"
                      : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  Server Default (HD)
                </button>
              </div>

              {/* Qualities & Server list */}
              {episode.servers && episode.servers.length > 0 ? (
                <div className="space-y-2">
                  {episode.servers.map((q) => (
                    <div
                      key={q.title}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg bg-neutral-900/80 p-2 border border-neutral-800"
                    >
                      <span className="min-w-[60px] text-xs font-black text-red-500 uppercase px-1">
                        {q.title}:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {q.serverList.map((srv) => {
                          const isCurrent = activeServerName.includes(srv.title) && activeServerName.includes(q.title);
                          return (
                            <button
                              key={srv.serverId}
                              onClick={() => handleSwitchServer(srv.serverId, srv.title, q.title)}
                              className={`rounded px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-all ${
                                isCurrent
                                  ? "bg-red-600 text-white font-bold shadow-sm shadow-red-600/30"
                                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                              }`}
                            >
                              {srv.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Prev / Next Episode Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <div>
                  {episode.hasPrevEpisode && episode.prevEpisode && (
                    <button
                      onClick={() => onSelectEpisode(episode.prevEpisode!)}
                      className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-200 transition-colors hover:border-red-600 hover:text-red-500"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Episode Sebelumnya</span>
                    </button>
                  )}
                </div>

                <div>
                  {episode.hasNextEpisode && episode.nextEpisode && (
                    <button
                      onClick={() => onSelectEpisode(episode.nextEpisode!)}
                      className="flex items-center gap-1 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-red-600/30 transition-all hover:bg-red-700"
                    >
                      <span>Episode Selanjutnya</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Episode Title & Metadata Info */}
            <div className="rounded-xl border border-neutral-800 bg-[#121212] p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-white">
                    {episode.title}
                  </h1>
                  <p className="mt-1 text-xs text-neutral-400">
                    Serial:{" "}
                    <button
                      onClick={onBackToAnime}
                      className="font-bold text-red-500 hover:underline"
                    >
                      {episode.seriesName}
                    </button>
                    {episode.releasedOn && ` • Rilis: ${episode.releasedOn}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
                  >
                    <Share2 className="h-3.5 w-3.5 text-red-500" />
                    <span>{copiedLink ? "Disalin!" : "Bagikan"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Download Links Accordion */}
            {episode.download && episode.download.length > 0 && (
              <div className="rounded-xl border border-neutral-800 bg-[#121212] p-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-red-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Unduh Episode</h3>
                  </div>

                  {/* Format Tabs */}
                  <div className="flex flex-wrap items-center gap-1 rounded bg-neutral-900 p-0.5 border border-neutral-800">
                    {episode.download.map((format) => (
                      <button
                        key={format.title}
                        onClick={() => setActiveDownloadTab(format.title)}
                        className={`rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                          activeDownloadTab === format.title
                            ? "bg-red-600 text-white"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {format.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {episode.download
                    .find((f) => f.title === activeDownloadTab)
                    ?.qualityList.map((qual, qIdx) => (
                      <div
                        key={qIdx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-neutral-900 p-2.5 border border-neutral-800"
                      >
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-red-600/20 px-2 py-0.5 text-xs font-black text-red-500 border border-red-600/30">
                            {qual.title}
                          </span>
                          {qual.size && (
                            <span className="text-[11px] font-bold text-neutral-400">
                              ({qual.size})
                            </span>
                          )}
                          <span className="text-[11px] text-neutral-400">
                            Subtitle Indonesia
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {qual.urlList.map((mirror, mIdx) => (
                            <a
                              key={mIdx}
                              href={mirror.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs font-semibold text-neutral-200 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
                            >
                              {mirror.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Comments / Discussion Section */}
            <div className="rounded-xl border border-neutral-800 bg-[#121212] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-red-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Diskusi Episode ({comments.length})</h3>
                </div>
              </div>

              {/* Comment Input Box */}
              <form onSubmit={handleAddComment} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Nama Anda"
                    className="sm:w-1/3 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:border-red-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tulis tanggapan untuk episode ini..."
                    className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:border-red-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </form>

              {/* Comment List */}
              <div className="space-y-2 pt-1">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start gap-2.5 rounded-lg bg-neutral-900/60 p-2.5 border border-neutral-800"
                  >
                    <img
                      src={c.avatar}
                      alt={c.user}
                      className="h-7 w-7 rounded-full bg-neutral-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-200">{c.user}</span>
                        <span className="text-[10px] text-neutral-500">
                          {new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-300 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Episode List Sidebar (Sticky) */}
          <div className={`${theaterMode ? "hidden" : "block lg:col-span-4 xl:col-span-3"}`}>
            <div className="sticky top-20 rounded-xl border border-neutral-800 bg-[#121212] p-3.5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <ListVideo className="h-4 w-4 text-red-500" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white">Daftar Episode</h3>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  {allEpisodes.length || 1} Ep
                </span>
              </div>

              {/* Scrollable list of episodes */}
              <div className="max-h-[580px] overflow-y-auto space-y-1 pr-1">
                {allEpisodes.length > 0 ? (
                  allEpisodes.map((ep) => {
                    const isCurrent = ep.slug === currentEpisodeSlug;
                    return (
                      <button
                        key={ep.slug}
                        onClick={() => onSelectEpisode(ep.slug)}
                        className={`flex w-full items-center justify-between rounded-lg p-2 text-left text-xs transition-all ${
                          isCurrent
                            ? "bg-red-600 text-white font-bold shadow-sm shadow-red-600/30"
                            : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-black ${
                              isCurrent ? "bg-white text-red-600" : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {ep.episode}
                          </span>
                          <span className="truncate">{ep.title || `Episode ${ep.episode}`}</span>
                        </div>
                        {isCurrent && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-white" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-4 text-center text-xs text-neutral-400">
                    Memuat daftar episode serial...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
