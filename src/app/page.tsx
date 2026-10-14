import Link from 'next/link';

export default function Home() {
  const modules = [
    {
      title: 'Đăng Nhập & Nạp Tiền Ví',
      member: 'Thành viên 1 (Thái) • feature/auth',
      desc: 'Quản lý tài khoản hội viên, nạp số dư ví chơi game qua VietQR / Thẻ cào và kiểm tra thời gian chơi.',
      href: '/auth',
      icon: 'account_balance_wallet',
      badge: 'AUTH & WALLET',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Sơ Đồ Máy & Đặt Chỗ',
      member: 'Thành viên 2 • feature/booking',
      desc: 'Xem sơ đồ phòng máy 2 tầng, kiểm tra cấu hình i7-14700F + RTX 4070 Ti, màn 240Hz và chọn vị trí máy VIP-08.',
      href: '/booking',
      icon: 'desktop_windows',
      badge: 'STATION MAP',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'Menu Đặt Món Quán Net (F&B)',
      member: 'Thành viên 3 (Bạn) • feature/fnb',
      desc: 'HUD gọi món tại chỗ: Combo cày đêm (-20%), chọn cấp cay 1-7, giỏ hàng tự động chiết khấu VIP 5% và trừ ví máy.',
      href: '/menu',
      icon: 'restaurant_menu',
      badge: 'SCREEN_2 CLIENT',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Màn Hình Bếp KDS & Quầy Bar',
      member: 'Thành viên 3 (Bạn) • feature/fnb',
      desc: 'Điều hành trạm Bếp Nóng & Pha Chế: Đồng hồ đếm giây thực tế, checklist từng món, âm báo chuông đơn mới & báo giao.',
      href: '/kds',
      icon: 'soup_kitchen',
      badge: 'SCREEN_4 KITCHEN',
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Thống Kê Doanh Thu & Hỗ Trợ',
      member: 'Thành viên 4 • feature/dashboard',
      desc: 'Báo cáo doanh số F&B hôm nay (3.85tr), danh sách top 6 món bán chạy nhất và bảng tiếp nhận gọi nhân viên 24/7.',
      href: '/dashboard',
      icon: 'monitoring',
      badge: 'TELEMETRY & LOGS',
      color: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 lg:p-8 font-sans">
      {/* Hero Welcome Banner */}
      <div className="max-w-6xl mx-auto w-full py-8 text-center">
        <span className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-mono text-[11px] uppercase font-bold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.4)] inline-block mb-3">
          HỆ THỐNG ĐIỀU HÀNH TỔNG THỂ CYBER ZONE
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-white font-gaming tracking-wide">
          CYBER ZONE ESPORTS LOUNGE
        </h1>
        <p className="text-slate-400 text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
          Nền tảng quản lý phòng game thế hệ mới — Kết nối đồng bộ giữa <strong className="text-cyan-400">Tài khoản ví</strong>, <strong className="text-purple-400">Sơ đồ máy</strong>, <strong className="text-emerald-400">Gọi món F&amp;B</strong> và <strong className="text-amber-400">Trạm bếp KDS</strong>.
        </p>
      </div>

      {/* Grid 4 Branch Modules */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {modules.map((m, idx) => (
          <Link
            key={idx}
            href={m.href}
            className="group bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${m.color} p-0.5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-white">{m.icon}</span>
                  </div>
                </div>
                <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] px-2.5 py-1 rounded font-mono font-bold">
                  {m.badge}
                </span>
              </div>

              <span className="text-[11px] font-mono font-bold text-cyan-400 block mb-1">
                {m.member}
              </span>
              <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors">
                {m.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {m.desc}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-cyan-400 font-mono font-bold text-xs group-hover:translate-x-1 transition-transform">
              <span>TRUY CẬP PHÂN HỆ</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer System Status */}
      <footer className="max-w-6xl mx-auto w-full border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
          <span>Dự án Cyber Game Web • 4 Thành viên đồng bộ chung một Base Layout</span>
        </div>
        <div>
          Hotline hỗ trợ kỹ thuật: <strong className="text-white">1900.8888 (Ext 101)</strong>
        </div>
      </footer>
    </div>
  );
}
