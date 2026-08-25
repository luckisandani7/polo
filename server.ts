import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const API_BASE = "https://www.sankavollerei.web.id/anime";

// Helper for caching responses in memory (TTL 3 minutes for general, 1 minute for latest)
interface CacheEntry {
  data: any;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 3; // 3 minutes

async function fetchFromApi(endpoint: string, ttlMs = CACHE_TTL_MS): Promise<any> {
  const cached = cache.get(endpoint);
  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return cached.data;
  }

  const url = `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "application/json",
    },
  });

  if (res.status === 404) {
    const emptyResult = { statusCode: 404, statusMessage: "Not Found", data: null };
    cache.set(endpoint, { data: emptyResult, timestamp: Date.now() });
    return emptyResult;
  }

  if (!res.ok) {
    throw new Error(`API responded with HTTP ${res.status} for ${endpoint}`);
  }

  const json = await res.json();
  cache.set(endpoint, { data: json, timestamp: Date.now() });
  return json;
}

// Fallback seed data in case external endpoint ever has temporary issues
const FALLBACK_POPULAR = [
  {
    title: "One Piece Subtitle Indonesia",
    poster: "https://otakudesu.blog/wp-content/uploads/2021/05/One-Piece-Sub-Indo.jpg",
    type: "TV",
    episode: "Ep 1122",
    seriesName: "One Piece",
    slug: "1piece-sub-indo",
    score: "8.54",
  },
  {
    title: "Solo Leveling Season 2",
    poster: "https://otakudesu.blog/wp-content/uploads/2026/07/158373.jpg",
    type: "TV",
    episode: "Ep 09",
    seriesName: "Solo Leveling S2",
    slug: "mujikaku-seijo-nagasu-sub-indo",
    score: "8.60",
  },
];

app.use(express.json());

// API Routes
// 1. Home / Spotlight / Latest / Popular
app.get("/api/anime/home", async (req: Request, res: Response) => {
  try {
    const raw = await fetchFromApi("/home", 1000 * 60 * 2);
    const ongoingList = raw?.data?.ongoing?.animeList || [];
    const completedList = raw?.data?.completed?.animeList || [];

    const latestRelease = ongoingList.map((item: any) => ({
      title: item.title,
      poster: item.poster,
      type: "TV",
      episode: item.episodes ? `Ep ${item.episodes}` : item.releaseDay || "Baru",
      status: "Ongoing",
      score: item.score || "",
      slug: item.animeId || item.href?.replace(/^\/anime\/anime\//, "") || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      seriesName: item.title,
      releaseTime: item.latestReleaseDate || item.releaseDay,
      href: item.href,
    }));

    const popularToday = (completedList.length > 0 ? completedList : ongoingList).map((item: any) => ({
      title: item.title,
      poster: item.poster,
      type: "TV",
      episode: item.episodes ? `Total ${item.episodes} Ep` : item.releaseDay || "Complete",
      status: item.episodes ? "Completed" : "Ongoing",
      score: item.score || "7.8",
      slug: item.animeId || item.href?.replace(/^\/anime\/anime\//, "") || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      seriesName: item.title,
      releaseTime: item.lastReleaseDate || item.latestReleaseDate || "",
      href: item.href,
    }));

    res.json({
      status: "success",
      data: {
        popularToday: popularToday.length > 0 ? popularToday : FALLBACK_POPULAR,
        latestRelease: latestRelease.length > 0 ? latestRelease : FALLBACK_POPULAR,
      },
    });
  } catch (err: any) {
    console.error("Error fetching home anime:", err.message);
    res.json({
      status: "success",
      data: {
        popularToday: FALLBACK_POPULAR,
        latestRelease: FALLBACK_POPULAR,
      },
    });
  }
});

// 2. Schedule (Jadwal Tayang)
app.get("/api/anime/schedule", async (req: Request, res: Response) => {
  try {
    const raw = await fetchFromApi("/schedule", 1000 * 60 * 10);
    const rawList = Array.isArray(raw?.data) ? raw.data : [];

    const scheduleList = rawList.map((dayItem: any) => {
      const anime_list = dayItem.anime_list || dayItem.animeList || [];
      return {
        day: dayItem.day,
        animeList: anime_list.map((a: any) => ({
          title: a.title,
          poster: a.poster || "",
          slug: a.slug || a.url?.replace(/^\/anime\/anime\//, "") || a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          href: a.url || a.href,
          day: dayItem.day,
        })),
      };
    });

    res.json({
      status: "success",
      data: { scheduleList },
    });
  } catch (err: any) {
    console.error("Error fetching schedule:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 3. Catalog / Directory (A-Z Section list using /unlimited)
app.get("/api/anime/catalog", async (req: Request, res: Response) => {
  try {
    const raw = await fetchFromApi("/unlimited", 1000 * 60 * 30);
    const rawList = raw?.data?.list || [];

    const sectionList = rawList.map((item: any) => ({
      letter: item.startWith,
      animeList: (item.animeList || []).map((a: any) => ({
        title: a.title,
        slug: a.animeId || a.href?.replace(/^\/anime\/anime\//, "") || a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        href: a.href,
      })),
    }));

    res.json({
      status: "success",
      data: { sectionList },
    });
  } catch (err: any) {
    console.error("Error fetching catalog:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 4. Search anime
app.get("/api/anime/search", async (req: Request, res: Response) => {
  const q = String(req.query.q || "").trim();
  if (!q) {
    return res.json({ status: "success", data: { animeList: [] } });
  }
  try {
    const raw = await fetchFromApi(`/search/${encodeURIComponent(q)}`, 1000 * 60 * 5);
    let animeList = raw?.data?.animeList || [];

    // If search returned empty, fallback to searching through /unlimited
    if (!animeList || animeList.length === 0) {
      try {
        const catRaw = await fetchFromApi("/unlimited", 1000 * 60 * 30);
        const sectionList = catRaw?.data?.list || [];
        const lowerQ = q.toLowerCase();
        const catalogMatches: any[] = [];

        for (const sec of sectionList) {
          for (const a of sec.animeList || []) {
            if (a.title && a.title.toLowerCase().includes(lowerQ)) {
              catalogMatches.push(a);
            }
          }
        }
        if (catalogMatches.length > 0) {
          animeList = catalogMatches;
        }
      } catch (catErr: any) {
        console.warn("Catalog fallback search error:", catErr.message);
      }
    }

    const normalizedList = (animeList || []).map((item: any) => ({
      title: item.title,
      poster: item.poster || "",
      score: item.score || "",
      status: item.status || "",
      genres: (item.genreList || []).map((g: any) => g.title),
      slug: item.animeId || item.href?.replace(/^\/anime\/anime\//, "") || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      href: item.href,
    }));

    res.json({
      status: "success",
      data: { animeList: normalizedList },
    });
  } catch (err: any) {
    console.error(`Error searching query "${q}":`, err.message);
    res.json({ status: "success", data: { animeList: [] } });
  }
});

// 5. Anime Detail by slug
app.get("/api/anime/detail/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const raw = await fetchFromApi(`/anime/${encodeURIComponent(slug)}`, 1000 * 60 * 5);
    const data = raw?.data;
    if (!data) {
      return res.status(404).json({ status: "error", message: "Anime not found" });
    }

    const episodes = (data.episodeList || []).map((ep: any) => ({
      title: ep.title,
      episode: String(ep.eps || ep.title?.match(/Episode\s+(\d+)/i)?.[1] || ""),
      date: ep.date || "",
      slug: ep.episodeId || ep.href?.replace(/^\/anime\/episode\//, ""),
      href: ep.href,
    }));

    const paragraphList = data.synopsis?.paragraphs || [];
    const genres = (data.genreList || []).map((g: any) => g.title);

    const animeDetail = {
      title: data.title,
      poster: data.poster,
      status: data.status || "Ongoing",
      studio: data.studios || data.studio,
      duration: data.duration,
      season: data.season || data.aired,
      type: data.type || "TV",
      rating: data.score,
      releasedOn: data.aired,
      updatedOn: data.status,
      japanese: data.japanese,
      producers: data.producers,
      batch: data.batch,
      synopsis: { paragraphList },
      genres,
      episodeList: episodes,
    };

    res.json({
      status: "success",
      data: animeDetail,
    });
  } catch (err: any) {
    console.error(`Error fetching detail for "${slug}":`, err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 6. Episode Detail by slug (stream, servers, and download info)
app.get("/api/anime/episode/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const raw = await fetchFromApi(`/episode/${encodeURIComponent(slug)}`, 1000 * 60 * 5);
    const data = raw?.data;
    if (!data) {
      return res.status(404).json({ status: "error", message: "Episode not found" });
    }

    // Parse download qualities
    const downloadQualities = data.downloadUrl?.qualities || [];
    const downloadOptions = downloadQualities.map((q: any) => ({
      title: q.title,
      size: q.size,
      qualityList: [
        {
          title: q.title,
          size: q.size,
          urlList: (q.urls || []).map((u: any) => ({
            title: u.title?.trim() || "Download",
            url: u.url,
          })),
        },
      ],
    }));

    // Parse episode number & series name
    const epNumMatch = data.title?.match(/Episode\s+(\d+)/i);
    const episodeNumber = epNumMatch ? epNumMatch[1] : "1";
    const seriesName = data.title ? data.title.replace(/Episode\s+\d+.*$/i, "").trim() : "";

    const episodeDetail = {
      title: data.title,
      episodeNumber,
      seriesName,
      seriesSlug: data.animeId || "",
      streamingUrl: data.defaultStreamingUrl || "",
      releasedOn: data.releaseTime || "",
      hasPrevEpisode: !!data.hasPrevEpisode,
      prevEpisode: data.prevEpisode?.episodeId || null,
      hasNextEpisode: !!data.hasNextEpisode,
      nextEpisode: data.nextEpisode?.episodeId || null,
      servers: data.server?.qualities || [],
      download: downloadOptions,
    };

    res.json({
      status: "success",
      data: episodeDetail,
    });
  } catch (err: any) {
    console.error(`Error fetching episode "${slug}":`, err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 7. Stream Server resolver
app.get("/api/anime/server/:serverId", async (req: Request, res: Response) => {
  const { serverId } = req.params;
  try {
    const raw = await fetchFromApi(`/server/${encodeURIComponent(serverId)}`, 1000 * 60 * 15);
    const url = raw?.data?.url;
    if (!url) {
      return res.status(404).json({ status: "error", message: "Server stream URL not found" });
    }
    res.json({
      status: "success",
      data: { url },
    });
  } catch (err: any) {
    console.error(`Error fetching server stream for "${serverId}":`, err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 8. Genre collection
app.get("/api/anime/genres", async (req: Request, res: Response) => {
  try {
    const raw = await fetchFromApi("/genre", 1000 * 60 * 60);
    const genreList = raw?.data?.genreList || [];
    const genres = genreList.map((g: any) => g.title);

    res.json({
      status: "success",
      data: {
        genres,
        genreList,
      },
    });
  } catch (err: any) {
    console.error("Error fetching genres:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 9. Anime by Genre
app.get("/api/anime/genre/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const page = req.query.page || "1";
  try {
    const raw = await fetchFromApi(`/genre/${encodeURIComponent(slug)}?page=${page}`, 1000 * 60 * 10);
    const animeList = (raw?.data?.animeList || []).map((item: any) => ({
      title: item.title,
      poster: item.poster,
      score: item.score,
      type: item.season || "TV",
      slug: item.animeId || item.href?.replace(/^\/anime\/anime\//, ""),
      seriesName: item.title,
      genres: (item.genreList || []).map((g: any) => g.title),
    }));

    res.json({
      status: "success",
      data: {
        animeList,
        pagination: raw?.pagination,
      },
    });
  } catch (err: any) {
    console.error(`Error fetching genre "${slug}":`, err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 10. Ongoing Anime list with pagination
app.get("/api/anime/ongoing", async (req: Request, res: Response) => {
  const page = req.query.page || "1";
  try {
    const raw = await fetchFromApi(`/ongoing-anime?page=${page}`, 1000 * 60 * 5);
    const animeList = (raw?.data?.animeList || []).map((item: any) => ({
      title: item.title,
      poster: item.poster,
      episode: item.episodes ? `Ep ${item.episodes}` : item.releaseDay,
      status: "Ongoing",
      slug: item.animeId || item.href?.replace(/^\/anime\/anime\//, ""),
      seriesName: item.title,
      releaseTime: item.latestReleaseDate || item.releaseDay,
    }));

    res.json({
      status: "success",
      data: {
        animeList,
        pagination: raw?.pagination,
      },
    });
  } catch (err: any) {
    console.error("Error fetching ongoing anime:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 11. Completed Anime list with pagination
app.get("/api/anime/completed", async (req: Request, res: Response) => {
  const page = req.query.page || "1";
  try {
    const raw = await fetchFromApi(`/complete-anime?page=${page}`, 1000 * 60 * 10);
    const animeList = (raw?.data?.animeList || []).map((item: any) => ({
      title: item.title,
      poster: item.poster,
      episode: item.episodes ? `Total ${item.episodes} Ep` : "Tamat",
      score: item.score,
      status: "Completed",
      slug: item.animeId || item.href?.replace(/^\/anime\/anime\//, ""),
      seriesName: item.title,
      releaseTime: item.lastReleaseDate || "",
    }));

    res.json({
      status: "success",
      data: {
        animeList,
        pagination: raw?.pagination,
      },
    });
  } catch (err: any) {
    console.error("Error fetching complete anime:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 12. Batch download info
app.get("/api/anime/batch/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const raw = await fetchFromApi(`/batch/${encodeURIComponent(slug)}`, 1000 * 60 * 30);
    res.json({
      status: "success",
      data: raw?.data,
    });
  } catch (err: any) {
    console.error(`Error fetching batch "${slug}":`, err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SandAnime Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
