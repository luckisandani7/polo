import {
  AnimeDetail,
  AnimeItem,
  CatalogSection,
  EpisodeDetail,
  ScheduleDay,
} from "../types";

const DIRECT_API_BASE = "https://www.sankavollerei.web.id/anime";

// Helper to determine if we are running in static hosting (e.g. GitHub Pages) or local backend
async function fetchWithFallback(
  localPath: string,
  directPath: string
): Promise<{ source: "local" | "direct"; json: any }> {
  try {
    const res = await fetch(localPath);
    const contentType = res.headers.get("content-type") || "";
    // If local server returned JSON
    if (res.ok && contentType.includes("application/json")) {
      const json = await res.json();
      return { source: "local", json };
    }
  } catch (e) {
    // Local fetch failed (static hosting environment)
  }

  // Fallback to direct Otakudesu API
  const directUrl = `${DIRECT_API_BASE}${directPath.startsWith("/") ? "" : "/"}${directPath}`;
  const directRes = await fetch(directUrl);
  if (!directRes.ok) {
    throw new Error(`Direct API responded with HTTP ${directRes.status}`);
  }
  const json = await directRes.json();
  return { source: "direct", json };
}

export async function getHomeAnime(): Promise<{
  popularToday: AnimeItem[];
  latestRelease: AnimeItem[];
}> {
  try {
    const { source, json } = await fetchWithFallback("/api/anime/home", "/home");
    if (source === "local" && json.data) {
      return json.data;
    }

    const ongoingList = json?.data?.ongoing?.animeList || [];
    const completedList = json?.data?.completed?.animeList || [];

    const latestRelease = ongoingList.map((item: any) => ({
      title: item.title,
      poster: item.poster,
      type: "TV",
      episode: item.episodes ? `Ep ${item.episodes}` : item.releaseDay || "Baru",
      status: "Ongoing",
      score: item.score || "",
      slug:
        item.animeId ||
        item.href?.replace(/^\/anime\/anime\//, "") ||
        item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
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
      slug:
        item.animeId ||
        item.href?.replace(/^\/anime\/anime\//, "") ||
        item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      seriesName: item.title,
      releaseTime: item.lastReleaseDate || item.latestReleaseDate || "",
      href: item.href,
    }));

    return { popularToday, latestRelease };
  } catch (err: any) {
    console.error("Failed to fetch home anime:", err);
    return { popularToday: [], latestRelease: [] };
  }
}

export async function getSchedule(): Promise<ScheduleDay[]> {
  try {
    const { source, json } = await fetchWithFallback("/api/anime/schedule", "/schedule");
    if (source === "local" && json.data?.scheduleList) {
      return json.data.scheduleList;
    }

    const rawList = Array.isArray(json?.data) ? json.data : [];
    return rawList.map((dayItem: any) => {
      const anime_list = dayItem.anime_list || dayItem.animeList || [];
      return {
        day: dayItem.day,
        animeList: anime_list.map((a: any) => ({
          title: a.title,
          poster: a.poster || "",
          slug:
            a.slug ||
            a.url?.replace(/^\/anime\/anime\//, "") ||
            a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          href: a.url || a.href,
          day: dayItem.day,
        })),
      };
    });
  } catch (err: any) {
    console.error("Failed to fetch schedule:", err);
    return [];
  }
}

export async function getCatalog(): Promise<CatalogSection[]> {
  try {
    const { source, json } = await fetchWithFallback("/api/anime/catalog", "/unlimited");
    if (source === "local" && json.data?.sectionList) {
      return json.data.sectionList;
    }

    const rawList = json?.data?.list || [];
    return rawList.map((item: any) => ({
      letter: item.startWith,
      animeList: (item.animeList || []).map((a: any) => ({
        title: a.title,
        slug:
          a.animeId ||
          a.href?.replace(/^\/anime\/anime\//, "") ||
          a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        href: a.href,
      })),
    }));
  } catch (err: any) {
    console.error("Failed to fetch catalog:", err);
    return [];
  }
}

export async function searchAnime(query: string): Promise<AnimeItem[]> {
  if (!query.trim()) return [];
  try {
    const { source, json } = await fetchWithFallback(
      `/api/anime/search?q=${encodeURIComponent(query.trim())}`,
      `/search/${encodeURIComponent(query.trim())}`
    );

    if (source === "local" && json.data?.animeList) {
      return json.data.animeList;
    }

    const rawList = json?.data?.animeList || [];
    return rawList.map((item: any) => ({
      title: item.title,
      poster: item.poster || "",
      score: item.score || "",
      status: item.status || "",
      genres: (item.genreList || []).map((g: any) => g.title),
      slug:
        item.animeId ||
        item.href?.replace(/^\/anime\/anime\//, "") ||
        item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      href: item.href,
    }));
  } catch (err: any) {
    console.error(`Failed to search anime for query "${query}":`, err);
    return [];
  }
}

export async function getAnimeDetail(slug: string): Promise<AnimeDetail> {
  const { source, json } = await fetchWithFallback(
    `/api/anime/detail/${encodeURIComponent(slug)}`,
    `/anime/${encodeURIComponent(slug)}`
  );

  if (source === "local" && json.data) {
    return json.data;
  }

  const data = json?.data;
  if (!data) throw new Error("Anime detail not found");

  const episodes = (data.episodeList || []).map((ep: any) => ({
    title: ep.title,
    episode: String(ep.eps || ep.title?.match(/Episode\s+(\d+)/i)?.[1] || ""),
    date: ep.date || "",
    slug: ep.episodeId || ep.href?.replace(/^\/anime\/episode\//, ""),
    href: ep.href,
  }));

  const paragraphList = data.synopsis?.paragraphs || [];
  const genres = (data.genreList || []).map((g: any) => g.title);

  return {
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
}

export async function getEpisodeDetail(slug: string): Promise<EpisodeDetail> {
  const { source, json } = await fetchWithFallback(
    `/api/anime/episode/${encodeURIComponent(slug)}`,
    `/episode/${encodeURIComponent(slug)}`
  );

  if (source === "local" && json.data) {
    return json.data;
  }

  const data = json?.data;
  if (!data) throw new Error("Episode detail not found");

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

  const epNumMatch = data.title?.match(/Episode\s+(\d+)/i);
  const episodeNumber = epNumMatch ? epNumMatch[1] : "1";
  const seriesName = data.title ? data.title.replace(/Episode\s+\d+.*$/i, "").trim() : "";

  return {
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
}

export async function getServerStreamUrl(serverId: string): Promise<string> {
  const { source, json } = await fetchWithFallback(
    `/api/anime/server/${encodeURIComponent(serverId)}`,
    `/server/${encodeURIComponent(serverId)}`
  );
  if (source === "local" && json.data?.url) {
    return json.data.url;
  }
  return json?.data?.url || "";
}

export async function getGenres(): Promise<string[]> {
  try {
    const { source, json } = await fetchWithFallback("/api/anime/genres", "/genre");
    if (source === "local" && json.data?.genres) {
      return json.data.genres;
    }
    const genreList = json?.data?.genreList || [];
    return genreList.map((g: any) => g.title);
  } catch (err) {
    console.error("Failed to fetch genres:", err);
    return [];
  }
}

export async function getAnimeByGenre(
  genreSlug: string,
  page = 1
): Promise<{ animeList: AnimeItem[]; pagination?: any }> {
  const { source, json } = await fetchWithFallback(
    `/api/anime/genre/${encodeURIComponent(genreSlug)}?page=${page}`,
    `/genre/${encodeURIComponent(genreSlug)}?page=${page}`
  );
  if (source === "local" && json.data) {
    return json.data;
  }
  const animeList = (json?.data?.animeList || []).map((item: any) => ({
    title: item.title,
    poster: item.poster,
    score: item.score,
    type: item.season || "TV",
    slug: item.animeId || item.href?.replace(/^\/anime\/anime\//, ""),
    seriesName: item.title,
    genres: (item.genreList || []).map((g: any) => g.title),
  }));
  return { animeList, pagination: json?.pagination };
}

export async function getOngoingAnime(
  page = 1
): Promise<{ animeList: AnimeItem[]; pagination?: any }> {
  const { source, json } = await fetchWithFallback(
    `/api/anime/ongoing?page=${page}`,
    `/ongoing-anime?page=${page}`
  );
  if (source === "local" && json.data) {
    return json.data;
  }
  const animeList = (json?.data?.animeList || []).map((item: any) => ({
    title: item.title,
    poster: item.poster,
    episode: item.episodes ? `Ep ${item.episodes}` : item.releaseDay,
    status: "Ongoing",
    slug: item.animeId || item.href?.replace(/^\/anime\/anime\//, ""),
    seriesName: item.title,
    releaseTime: item.latestReleaseDate || item.releaseDay,
  }));
  return { animeList, pagination: json?.pagination };
}

export async function getCompletedAnime(
  page = 1
): Promise<{ animeList: AnimeItem[]; pagination?: any }> {
  const { source, json } = await fetchWithFallback(
    `/api/anime/completed?page=${page}`,
    `/complete-anime?page=${page}`
  );
  if (source === "local" && json.data) {
    return json.data;
  }
  const animeList = (json?.data?.animeList || []).map((item: any) => ({
    title: item.title,
    poster: item.poster,
    episode: item.episodes ? `Total ${item.episodes} Ep` : "Tamat",
    score: item.score,
    status: "Completed",
    slug: item.animeId || item.href?.replace(/^\/anime\/anime\//, ""),
    seriesName: item.title,
    releaseTime: item.lastReleaseDate || "",
  }));
  return { animeList, pagination: json?.pagination };
}

export async function getBatchDetail(slug: string): Promise<any> {
  const { source, json } = await fetchWithFallback(
    `/api/anime/batch/${encodeURIComponent(slug)}`,
    `/batch/${encodeURIComponent(slug)}`
  );
  return json?.data;
}
