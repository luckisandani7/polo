import React from "react";
import { Sparkles, Heart, Shield, Film, Github, ExternalLink } from "lucide-react";

interface FooterProps {
  onNavClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="mt-20 border-t border-neutral-800 bg-[#0a0a0a] text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-md shadow-red-600/30">
                <Film className="h-4 w-4" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                SAND<span className="text-red-600 font-extrabold">ANIME</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              SandAnime adalah platform streaming modern yang dirancang khusus untuk para pencinta anime (Otaku & Wibu) di seluruh dunia. Kami berkomitmen untuk memberikan pengalaman menonton terbaik dengan menyediakan ribuan episode anime, mulai dari serial klasik legendaris hingga rilisan simulcast terbaru yang tayang langsung dari Jepang. Dengan antarmuka yang bersih, responsif, dan mudah digunakan, SandAnime memastikan Anda dapat menikmati setiap momen epik, emosional, dan penuh aksi dari karakter favorit Anda tanpa hambatan.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
              <Shield className="h-3.5 w-3.5 text-red-500" />
              <span>Ditenagai oleh Wajik Anime API & Oploverz Engine</span>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Navigasi Cepat
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavClick("home")}
                  className="hover:text-red-500 transition-colors"
                >
                  Beranda Anime
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick("schedule")}
                  className="hover:text-red-500 transition-colors"
                >
                  Jadwal Rilis Mingguan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick("catalog")}
                  className="hover:text-red-500 transition-colors"
                >
                  Katalog Lengkap (A-Z)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick("watchlist")}
                  className="hover:text-red-500 transition-colors"
                >
                  Daftar Tontonan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick("history")}
                  className="hover:text-red-500 transition-colors"
                >
                  Riwayat Nonton
                </button>
              </li>
            </ul>
          </div>

          {/* Disclaimer Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Disclaimer
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Sandanime tidak menyimpan berkas video di server kami. Semua konten video disediakan oleh pihak ketiga yang tidak terafiliasi. Seluruh hak cipta dimiliki oleh pemilik lisensi masing-masing.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-neutral-800 pt-6 text-[11px] text-neutral-400 gap-3">
          <p>© {new Date().getFullYear()} Sandanime. Dibuat untuk para pecinta anime Indonesia.</p>
          <div className="flex items-center gap-1">
            <span>Didesain dengan nuansa</span>
            <Heart className="h-3 w-3 fill-red-600 text-red-600 inline mx-0.5" />
            <span>Sandanime Studio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
