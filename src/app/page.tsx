import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070e1d] text-slate-100 flex flex-col justify-between p-6">
      {/* Top Bar */}
      <header className="flex justify-between items-center bg-[#0c1322] border border-cyan-500/20 px-6 py-4 rounded-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <span className="material-symbols-outlined text-2xl">sports_esports</span>
          </div>
          <div>
            <h1 className="font-gaming font-black text-xl text-cyan-400 tracking-wider">
              CYBERNET ESPORTS LOUNGE
            </h1>
            <p className="text-xs text-slate-400 font-mono">F&amp;B Command Engine &amp; Kitchen Display System</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
          <span className="text-emerald-400 font-bold">SYSTEM ONLINE</span>
        </div>
      </header>

      {/* Main Selector Cards */}
      <main className="max-w-4xl mx-auto w-full py-12 flex flex-col items-center">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
            TÍCH HỢP HỆ THỐNG F&amp;B
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-3 font-gaming">
            CHỌN GIAO DIỆN KHỞI CHẠY
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
            Hệ thống phân chia theo 2 vai trò chính: Khách gọi món tại máy trạm và Bộ phận Bếp / Quầy Bar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Card 1: Client Menu (SCREEN_2) */}
          <Link
            href="/menu"
            className="group bg-[#0c1322] border-2 border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
                </div>
                <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs px-2.5 py-1 rounded font-mono font-bold">
                  SCREEN_2
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors font-headline-sm">
                Client Đặt Món Quán Net
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Giao diện khách hàng tại máy Gaming: Xem danh mục món, combo cày đêm, chọn cấp độ cay, điều chỉnh giỏ hàng, trừ ví tài khoản máy và theo dõi tiến độ KDS thời gian thực.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-cyan-400 font-mono font-bold text-sm">
              <span>TRUY CẬP /menu</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>

          {/* Card 2: Kitchen Display System (SCREEN_4) */}
          <Link
            href="/kds"
            className="group bg-[#0c1322] border-2 border-amber-500/30 hover:border-amber-400 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,183,3,0.25)] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">soup_kitchen</span>
                </div>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs px-2.5 py-1 rounded font-mono font-bold">
                  SCREEN_4
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors font-headline-sm">
                Màn Hình Quản Lý Bếp KDS
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Hệ thống điều hành trạm Bếp &amp; Pha Chế: Đồng hồ số trực tiếp, lọc theo Bếp Nóng / Bar, âm báo khi có đơn mới, checklist từng món, chuyển trạng thái Nấu -&gt; Báo Giao -&gt; Hoàn Tất.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-amber-400 font-mono font-bold text-sm">
              <span>TRUY CẬP /kds</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 font-mono border-t border-slate-800 pt-4">
        Cyber Game Web • Nhánh feature/fnb • Phụ trách bởi Minh Nhật
      </footer>
    </div>
  );
}
