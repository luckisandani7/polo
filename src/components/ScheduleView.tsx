import React, { useState } from "react";
import { Play } from "lucide-react";
import { ScheduleDay } from "../types";

interface ScheduleViewProps {
  schedule: ScheduleDay[];
  onSelectAnime: (slug: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, onSelectAnime }) => {
  // Days mapping in Indonesian
  const dayNamesIndo: { [key: string]: string } = {
    Monday: "Senin",
    Tuesday: "Selasa",
    Wednesday: "Rabu",
    Thursday: "Kamis",
    Friday: "Jumat",
    Saturday: "Sabtu",
    Sunday: "Minggu",
    Random: "Acak / Spesial",
    Senin: "Senin",
    Selasa: "Selasa",
    Rabu: "Rabu",
    Kamis: "Kamis",
    Jumat: "Jumat",
    Sabtu: "Sabtu",
    Minggu: "Minggu",
  };

  // Determine current day of week in English
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = daysOfWeek[new Date().getDay()];

  const [activeDay, setActiveDay] = useState<string>(() => {
    if (schedule && schedule.length > 0) {
      const match = schedule.find(
        (s) =>
          s.day.toLowerCase() === currentDayName.toLowerCase() ||
          s.day.toLowerCase() === (dayNamesIndo[currentDayName] || "").toLowerCase()
      );
      return match ? match.day : schedule[0].day;
    }
    return "Senin";
  });

  const activeSchedule = schedule.find(
    (s) => s.day.toLowerCase() === activeDay.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="text-red-500 text-xs font-bold uppercase tracking-wider">
            Jadwal Rilis Anime
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-white">
            Jadwal Tayang Mingguan
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Waktu update episode anime terbaru Subtitle Indonesia setiap hari
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs border border-neutral-800">
          <span className="text-neutral-400">Hari ini:</span>
          <span className="font-bold text-red-500">{dayNamesIndo[currentDayName] || currentDayName}</span>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {schedule.map((s) => {
          const isToday =
            s.day.toLowerCase() === currentDayName.toLowerCase() ||
            s.day.toLowerCase() === (dayNamesIndo[currentDayName] || "").toLowerCase();
          const isSelected = s.day.toLowerCase() === activeDay.toLowerCase();
          const indoName = dayNamesIndo[s.day] || s.day;

          return (
            <button
              key={s.day}
              onClick={() => setActiveDay(s.day)}
              className={`flex flex-col items-center min-w-[100px] sm:min-w-[120px] rounded-xl p-3 text-center transition-all ${
                isSelected
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30 font-bold"
                  : "bg-[#121212] border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                {indoName}
              </span>
              <span className="mt-1 text-[11px] opacity-80">
                {s.animeList?.length || 0} Anime
              </span>
              {isToday && (
                <span className="mt-1.5 rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                  HARI INI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Anime List for Selected Day */}
      {activeSchedule && activeSchedule.animeList && activeSchedule.animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {activeSchedule.animeList.map((anime, idx) => (
            <div
              key={idx}
              onClick={() => onSelectAnime(anime.slug)}
              className="group cursor-pointer flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-[#121212] transition-all duration-200 hover:-translate-y-1 hover:border-red-600/70 hover:shadow-lg hover:shadow-red-950/20"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                <img
                  src={
                    anime.poster ||
                    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=70"
                  }
                  alt={anime.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30 opacity-60 transition-opacity group-hover:opacity-80" />

                {anime.episode && (
                  <span className="absolute top-2 right-2 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow-sm shadow-red-900">
                    Ep {anime.episode}
                  </span>
                )}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/50">
                    <Play className="ml-0.5 h-4 w-4 fill-white" />
                  </div>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <h4 className="font-bold text-white text-xs line-clamp-2 group-hover:text-red-500 transition-colors">
                  {anime.title}
                </h4>
                <span className="mt-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  {activeSchedule.day}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-[#121212] p-12 text-center text-neutral-400">
          <p className="font-bold text-white text-sm">Tidak ada anime yang dijadwalkan pada hari ini</p>
          <p className="text-xs text-neutral-500 mt-1">Pilih hari lain untuk melihat jadwal tayang mingguan.</p>
        </div>
      )}
    </div>
  );
};
