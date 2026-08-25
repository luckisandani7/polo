import React from "react";
import { ArrowLeft } from "lucide-react";

interface AboutUsViewProps {
  onBack: () => void;
  onExploreCatalog: () => void;
  onViewSchedule: () => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({
  onBack,
  onExploreCatalog,
  onViewSchedule,
}) => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Top Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-[#121212] px-4 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Beranda</span>
        </button>

        <span className="text-[11px] font-medium text-neutral-500">
          sandanime.my.id • Tentang Kami
        </span>
      </div>

      {/* Hero / Header Story */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/90 via-[#121212] to-[#0d0d0d] p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-block rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
            Cerita di Balik SandAnime
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Ruang Nonton Anime yang Bersih, Nyaman, dan Ramah Pengguna
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            SandAnime lahir dari pengalaman sesama penggemar anime di Indonesia yang sering kali merasa terganggu oleh situs streaming yang lambat, penuh pop-up membingungkan, serta tautan unduh yang berputar-putar.
          </p>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Kami mendedikasikan <strong className="text-neutral-200">sandanime.my.id</strong> sebagai wadah menonton yang berfokus pada kecepatan pemutaran, kemudahan pencarian judul, dan antarmuka yang bersih tanpa gangguan.
          </p>
        </div>
      </div>

      {/* 4 Pillars / Prinsip Kami */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Prinsip dan Komitmen Kami
          </h2>
          <p className="text-xs text-neutral-400">
            Nilai utama yang kami utamakan dalam pengelolaan situs ini:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Card 1 */}
          <div className="rounded-2xl border border-neutral-800/80 bg-[#121212] p-6 space-y-2 transition-colors hover:border-neutral-700">
            <span className="text-xs font-bold text-red-500">01</span>
            <h3 className="text-sm font-bold text-white">Pemutar Video Fleksibel & Multi-Server</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Jika salah satu server pemutar sedang penuh atau lambat, Anda dapat berpindah ke server cadangan dalam hitungan detik. Kami juga menyediakan opsi resolusi sesuai kebutuhan kuota internet Anda.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-neutral-800/80 bg-[#121212] p-6 space-y-2 transition-colors hover:border-neutral-700">
            <span className="text-xs font-bold text-amber-500">02</span>
            <h3 className="text-sm font-bold text-white">Jadwal Rilis Mingguan Teratur</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pantau jadwal penayangan serial anime dari Senin hingga Minggu agar Anda selalu tahu kapan episode terbaru anime favorit dirilis dengan subtitle Indonesia.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-neutral-800/80 bg-[#121212] p-6 space-y-2 transition-colors hover:border-neutral-700">
            <span className="text-xs font-bold text-emerald-500">03</span>
            <h3 className="text-sm font-bold text-white">Privasi Data Lokal Tanpa Wajib Akun</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Daftar simpanan (Watchlist) dan riwayat episode terakhir Anda tersimpan aman langsung di peramban (browser) masing-masing, sehingga Anda bisa langsung menonton tanpa registrasi rumit.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-neutral-800/80 bg-[#121212] p-6 space-y-2 transition-colors hover:border-neutral-700">
            <span className="text-xs font-bold text-blue-500">04</span>
            <h3 className="text-sm font-bold text-white">Katalog Lengkap Berdasarkan Abjad</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dari serial klasik hingga anime musiman terbaru, semua terindeks rapi berdasarkan huruf A sampai Z dan genre untuk memudahkan pencarian.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer & DMCA Transparency */}
      <div className="rounded-2xl border border-neutral-800 bg-[#141414] p-6 sm:p-8 space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-neutral-200">
          Catatan Hak Cipta & Disclaimer Konten
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Semua materi video anime yang dapat diakses melalui SandAnime di-hosting di server pihak ketiga independen. SandAnime bertindak semata-mata sebagai peramban antarmuka pengguna (user-interface indexer) dan tidak menyimpan file video di peladen kami sendiri. Seluruh hak cipta, merek dagang, dan materi grafis adalah milik sah pemegang lisensi dan studio produksi di Jepang.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Pertanyaan Umum (FAQ)
        </h2>

        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-neutral-800 bg-[#121212] p-4">
            <h4 className="font-bold text-neutral-200">Apakah saya perlu membayar untuk menonton di SandAnime?</h4>
            <p className="mt-1 text-neutral-400 leading-relaxed">
              Tidak. Semua konten anime yang terindeks dapat Anda akses secara gratis tanpa biaya langganan.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-[#121212] p-4">
            <h4 className="font-bold text-neutral-200">Bagaimana jika video tidak bisa diputar atau buffering?</h4>
            <p className="mt-1 text-neutral-400 leading-relaxed">
              Gunakan menu pilihan server di bawah pemutar video untuk beralih ke server alternatif, atau turunkan resolusi video ke 480p/360p.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-[#121212] p-4">
            <h4 className="font-bold text-neutral-200">Bagaimana cara menyimpan anime yang sedang saya ikuti?</h4>
            <p className="mt-1 text-neutral-400 leading-relaxed">
              Klik tombol Simpan / Bookmark pada halaman detail anime. Episode yang sedang ditonton juga akan tercatat otomatis di menu Riwayat Nonton.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-[#111111] p-6">
        <div>
          <h3 className="text-sm font-bold text-white">Mulai Menonton</h3>
          <p className="text-xs text-neutral-400">Jelajahi ribuan judul anime atau periksa jadwal rilis hari ini.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onExploreCatalog}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700"
          >
            Buka Katalog A-Z
          </button>
          <button
            onClick={onViewSchedule}
            className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-bold text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            Lihat Jadwal Rilis
          </button>
        </div>
      </div>
    </div>
  );
};
