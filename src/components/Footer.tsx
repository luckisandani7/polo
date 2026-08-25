import React from "react";

interface FooterProps {
  onNavClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="mt-20 border-t border-neutral-800 bg-[#0a0a0a] text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                SAND<span className="text-red-600 font-extrabold">ANIME</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              SandAnime (<strong className="text-neutral-300">sandanime.my.id</strong>) adalah situs streaming dan download anime subtitle Indonesia dengan pembaruan harian, pilihan multi-server, serta pemutar video yang ringan.
            </p>
            <p className="text-[11px] text-neutral-500 pt-1">
              Ditenagai oleh Wajik Anime API & Oploverz Engine.
            </p>
          </div>

          {/* Quick Nav Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Navigasi
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

          {/* Informasi & Peta Situs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Informasi
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavClick("about")}
                  className="hover:text-red-500 transition-colors"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick("sitemap")}
                  className="hover:text-red-500 transition-colors"
                >
                  Peta Situs (Sitemap)
                </button>
              </li>
              <li className="pt-2 text-[11px] text-neutral-500 leading-relaxed">
                SandAnime tidak menyimpan file video di peladen sendiri. Seluruh konten disediakan oleh pihak ketiga.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-900 pt-6 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} SandAnime (sandanime.my.id) — Platform streaming anime Indonesia.</p>
          <p>SandAnime Studio</p>
        </div>
      </div>
    </footer>
  );
};
