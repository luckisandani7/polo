import {
  AnimeDetail,
  AnimeItem,
  CatalogSection,
  EpisodeDetail,
  ScheduleDay,
} from "../types";

export async function getHomeAnime(): Promise<{
  popularToday: AnimeItem[];
  latestRelease: AnimeItem[];
}> {
  const res = await fetch("/api/anime/home");
  if (!res.ok) throw new Error("Failed to fetch home anime data");
  const json = await res.json();
  return json.data || { popularToday: [], latestRelease: [] };
}

export async function getSchedule(): Promise<ScheduleDay[]> {
  const res = await fetch("/api/anime/schedule");
  if (!res.ok) throw new Error("Failed to fetch schedule data");
  const json = await res.json();
  return json.data?.scheduleList || [];
}

export async function getCatalog(): Promise<CatalogSection[]> {
  const res = await fetch("/api/anime/catalog");
  if (!res.ok) throw new Error("Failed to fetch catalog data");
  const json = await res.json();
  return json.data?.sectionList || [];
}

export async function searchAnime(query: string): Promise<AnimeItem[]> {
  if (!query.trim()) return [];
  const res = await fetch(`/api/anime/search?q=${encodeURIComponent(query.trim())}`);
  if (!res.ok) throw new Error("Failed to search anime");
  const json = await res.json();
  return json.data?.animeList || [];
}

export async function getAnimeDetail(slug: string): Promise<AnimeDetail> {
  const res = await fetch(`/api/anime/detail/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(`Failed to fetch anime detail for ${slug}`);
  const json = await res.json();
  return json.data;
}

export async function getEpisodeDetail(slug: string): Promise<EpisodeDetail> {
  const res = await fetch(`/api/anime/episode/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(`Failed to fetch episode data for ${slug}`);
  const json = await res.json();
  return json.data;
}

export async function getServerStreamUrl(serverId: string): Promise<string> {
  const res = await fetch(`/api/anime/server/${encodeURIComponent(serverId)}`);
  if (!res.ok) throw new Error(`Failed to fetch stream URL for server ${serverId}`);
  const json = await res.json();
  return json.data?.url || "";
}

export async function getGenres(): Promise<string[]> {
  const res = await fetch("/api/anime/genres");
  if (!res.ok) throw new Error("Failed to fetch genres");
  const json = await res.json();
  return json.data?.genres || [];
}

export async function getAnimeByGenre(
  genreSlug: string,
  page = 1
): Promise<{ animeList: AnimeItem[]; pagination?: any }> {
  const res = await fetch(
    `/api/anime/genre/${encodeURIComponent(genreSlug)}?page=${page}`
  );
  if (!res.ok) throw new Error(`Failed to fetch anime for genre ${genreSlug}`);
  const json = await res.json();
  return json.data || { animeList: [] };
}

export async function getOngoingAnime(
  page = 1
): Promise<{ animeList: AnimeItem[]; pagination?: any }> {
  const res = await fetch(`/api/anime/ongoing?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch ongoing anime");
  const json = await res.json();
  return json.data || { animeList: [] };
}

export async function getCompletedAnime(
  page = 1
): Promise<{ animeList: AnimeItem[]; pagination?: any }> {
  const res = await fetch(`/api/anime/completed?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch completed anime");
  const json = await res.json();
  return json.data || { animeList: [] };
}

export async function getBatchDetail(slug: string): Promise<any> {
  const res = await fetch(`/api/anime/batch/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(`Failed to fetch batch for ${slug}`);
  const json = await res.json();
  return json.data;
}
