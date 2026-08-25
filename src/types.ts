export interface AnimeItem {
  title: string;
  poster?: string;
  type?: string;
  episode?: string;
  status?: string;
  score?: string;
  rating?: string;
  slug: string;
  episodeSlug?: string;
  seriesName?: string;
  releaseTime?: string;
  genres?: string[];
  href?: string;
}

export interface AnimeDetail {
  title: string;
  poster: string;
  status: string;
  studio?: string;
  duration?: string;
  season?: string;
  type?: string;
  rating?: string;
  releasedOn?: string;
  updatedOn?: string;
  japanese?: string;
  producers?: string;
  batch?: {
    title: string;
    batchId?: string;
    slug?: string;
    href?: string;
  } | null;
  synopsis?: {
    paragraphList?: string[];
  };
  genres?: string[];
  episodeList?: EpisodeItem[];
}

export interface EpisodeItem {
  episode: string;
  title: string;
  date?: string;
  slug: string;
  href?: string;
}

export interface StreamServerQuality {
  title: string; // '360p' | '480p' | '720p'
  serverList: {
    title: string;
    serverId: string;
    href?: string;
  }[];
}

export interface DownloadQuality {
  title: string;
  size?: string;
  urlList: {
    title: string;
    url: string;
  }[];
}

export interface DownloadOption {
  title: string; // e.g. 'Mp4_360p' | 'Mp4_720p' | 'MKV_1080p'
  size?: string;
  qualityList: DownloadQuality[];
}

export interface EpisodeDetail {
  title: string;
  episodeNumber: string;
  seriesName: string;
  seriesSlug: string;
  seriesHref?: string;
  streamingUrl: string;
  releasedOn?: string;
  hasPrevEpisode?: boolean;
  prevEpisode?: string | null;
  hasNextEpisode?: boolean;
  nextEpisode?: string | null;
  servers?: StreamServerQuality[];
  download?: DownloadOption[];
}

export interface ScheduleDay {
  day: string;
  animeList: {
    title: string;
    poster: string;
    slug: string;
    href?: string;
    day?: string;
    status?: string;
    episode?: string;
  }[];
}

export interface CatalogSection {
  letter: string;
  animeList: {
    title: string;
    slug: string;
    href?: string;
  }[];
}

export interface WatchHistoryItem {
  animeSlug: string;
  animeTitle: string;
  poster?: string;
  episodeSlug: string;
  episodeNumber: string;
  updatedAt: number;
  duration?: number;
  currentTime?: number;
}

export interface BookmarkItem {
  animeSlug: string;
  title: string;
  poster: string;
  status: "watching" | "plan" | "completed" | "favorite";
  score?: string;
  type?: string;
  totalEpisodes?: string;
  addedAt: number;
}

export interface CommentItem {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: number;
  likes: number;
  episodeNumber?: string;
}

