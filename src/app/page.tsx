import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black">
      {/* ══════════ 1. HEADER BANNER: TRUNG TÂM DỊCH VỤ MÁY TRẠM & HỘI VIÊN ══════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        
        {/* BANNER THÔNG BÁO LIÊN THÔNG VỚI WEB BẠN THÁI */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#070d1e] to-slate-900 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
            <div>
              <span className="text-emerald-400 font-bold block uppercase tracking-wide">
                HỆ THỐNG LIÊN THÔNG REALTIME VỚI CỔNG ĐẶT CHỖ BẠN THÁI
              </span>
              <span className="text-slate-300 text-[11px] block mt-0.5">
                Vừa cập nhật: <strong className="text-amber-400">VIP-02 đã được giữ chỗ trước</strong> cho khách hàng <strong className="text-white">Nguyễn Văn A</strong> (Mã CZ-2026-X89)
              </span>
            </div>
          </div>
          <Link
            href="/booking"
            className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-[11px] rounded-xl transition shadow-md shadow-emerald-500/20 shrink-0"
          >
            Mở Sơ Đồ Máy &rarr;
          </Link>
        </div>

        {/* HERO SECTION GỌN GÀNG ĐỒNG BỘ NHẬN DIỆN THƯƠNG HIỆU */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              CYBER ZONE ESPORTS &amp; ENTERTAINMENT COMPLEX
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight font-gaming uppercase">
              CỔNG DỊCH VỤ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                MÁY TRẠM &amp; HỘI VIÊN
              </span>
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Hệ thống máy trạm liên thông 24/7: Theo dõi sơ đồ chỗ ngồi realtime, khởi động nhanh kho 16 game bản quyền, gọi món Bếp bưng tận bàn trong 5-8 phút và nạp ví tiền tự động.
            </p>

            {/* 3 Nút hành động nhanh */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <Link
                href="/booking"
                className="px-5 py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:brightness-110 text-black font-black rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
                <span>Xem Sơ Đồ Máy Trạm</span>
              </Link>

              <Link
                href="/games"
                className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-white font-bold rounded-xl transition flex items-center gap-2 hover:border-emerald-400"
              >
                <span className="material-symbols-outlined text-[18px] text-cyan-400">sports_esports</span>
                <span>Kho Game (16 Game)</span>
              </Link>

              <Link
                href="/menu"
                className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 font-bold rounded-xl transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-400">restaurant_menu</span>
                <span>Menu Bếp F&amp;B</span>
              </Link>
            </div>
          </div>

          {/* Cột phải: Card Máy hiện tại của bạn (VIP-08) */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-[#0c1424] to-[#060b14] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

              <div className="flex justify-between items-start mb-5">
                <div>
                  <span className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold tracking-wider uppercase font-mono">
                    MÁY ĐANG SỬ DỤNG
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1.5 font-gaming">MÁY TRẠM: VIP-08</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                  ONLINE
                </span>
              </div>

              {/* Thông số phần cứng chi tiết của máy */}
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400 text-[16px]">memory</span>Vi xử lý
                  </span>
                  <span className="text-white font-bold">Intel Core i7 14700K</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-[16px]">view_in_ar</span>Card đồ họa
                  </span>
                  <span className="text-emerald-400 font-bold">RTX 4070 Ti Super 16GB</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400 text-[16px]">desktop_windows</span>Màn hình
                  </span>
                  <span className="text-white font-bold">ROG 27" 240Hz Fast-IPS</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-400 text-[16px]">keyboard</span>Gaming Gear
                  </span>
                  <span className="text-white font-bold">Zowie EC2 + Phím Cơ Akko</span>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Trạng thái phòng:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  82/100 Máy Đang Hoạt Động
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ 2. 4 KHỐI DỊCH VỤ 1-CHẠM (QUICK SERVICE LAUNCHER) ══════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {/* Card 1: Sơ đồ máy */}
          <Link
            href="/booking"
            className="group p-5 rounded-2xl bg-[#070d1e]/80 border border-white/10 hover:border-emerald-500/50 transition-all shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">desktop_windows</span>
              </div>
              <h3 className="font-gaming font-black text-lg text-white group-hover:text-emerald-400 transition-colors">
                Sơ Đồ Máy &amp; Giữ Chỗ
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Xem trực tiếp chỗ ngồi trống, máy đã đặt trước kèm tên khách hàng. Đặt giữ chỗ tức thì trong 30 phút.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs font-mono text-emerald-400 font-bold">
              <span>Mở Sơ Đồ Máy</span>
              <span>&rarr;</span>
            </div>
          </Link>

          {/* Card 2: Kho 16 Game */}
          <Link
            href="/games"
            className="group p-5 rounded-2xl bg-[#070d1e]/80 border border-white/10 hover:border-cyan-500/50 transition-all shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">sports_esports</span>
              </div>
              <h3 className="font-gaming font-black text-lg text-white group-hover:text-cyan-400 transition-colors">
                Kho Game (16 Tựa Game)
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Launcher cài sẵn 100% bản quyền Steam, Riot, Garena. Nhấn F2 tìm nhanh, tích hợp nút giải phóng RAM.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs font-mono text-cyan-400 font-bold">
              <span>Mở Menu Game</span>
              <span>&rarr;</span>
            </div>
          </Link>

          {/* Card 3: Menu F&B */}
          <Link
            href="/menu"
            className="group p-5 rounded-2xl bg-[#070d1e]/80 border border-white/10 hover:border-amber-500/50 transition-all shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">restaurant_menu</span>
              </div>
              <h3 className="font-gaming font-black text-lg text-white group-hover:text-amber-400 transition-colors">
                Menu Gọi Món F&amp;B
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Đặt món trực tiếp trên máy, tự động trừ ví tiền. Bếp tiếp nhận và nhân viên bưng tận bàn trong 5-8 phút.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs font-mono text-amber-400 font-bold">
              <span>Xem Thực Đơn</span>
              <span>&rarr;</span>
            </div>
          </Link>

          {/* Card 4: Nạp Ví Tiền */}
          <Link
            href="/auth"
            className="group p-5 rounded-2xl bg-[#070d1e]/80 border border-white/10 hover:border-purple-500/50 transition-all shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
              </div>
              <h3 className="font-gaming font-black text-lg text-white group-hover:text-purple-400 transition-colors">
                Nạp Ví Tiền Tự Động
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Nạp tiền qua mã QR tài khoản, số dư được cộng ngay lập tức vào máy tính và đồng bộ toàn bộ hệ thống.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs font-mono text-purple-400 font-bold">
              <span>Nạp Tiền Ngay</span>
              <span>&rarr;</span>
            </div>
          </Link>
        </div>

        {/* ══════════ 3. KHO GAME MÁY TRẠM (16 TỰA GAME BẢN QUYỀN) ══════════ */}
        <div id="kho-game" className="py-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                Hạ Tầng Diskless 10Gbps • Không Cần Chờ Tải
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide font-gaming">
                KHO GAME CÀI SẴN (16 TỰA GAME)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tất cả 16 game bản quyền Steam, Riot Games, Garena, Battle.net đã được tối ưu 240Hz và cập nhật tự động.
              </p>
            </div>

            <Link
              href="/games"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-black text-xs font-mono shadow-[0_0_15px_rgba(0,240,255,0.3)] transition flex items-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">sports_esports</span>
              <span>MỞ MENU GAME TOÀN MÀN HÌNH &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              {
                name: 'Black Myth: Wukong',
                tag: 'STEAM',
                badge: 'HOT',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzkSMq1TKCxW-P4Tyq_oGAJrujxwZLU2E8YGevaRG6L65heDlLNLQhFsRGB46uc2eMTrfrf9aV6XyDz6awgkG2-RE_YUhaX03Eq1sEZ7HJyUnPuaPT9aBvlIfTYxk36j8JYL0KkAY0JVgyMCBM-kT2uvIO2MMp71Di7eG_5KZC05SAOSeP_IlT9RAY8hH5IksZkfuT8x_3Q5b_D7ohykbZwQc9Wc41Osrb2eu37IS-6_8qY4wOmSZG',
              },
              {
                name: 'LMHT (LoL)',
                tag: 'RIOT/VNG',
                badge: 'TOP 1',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMh8ZjJKSY-hDfVBCfwABNCTxRgTZG10L5YMmrTns0xjctwrUXqWMRahhCjJ5e7zqzl8uF-jta_c1ynPWbgtcrsLPY999UdXGI7Nhajna98t3HfAHo0kXp1SWM-pET1QoNXV_l4OuSqnqTJ61Tkkb7xc8zbP-xMku78Oztk4eeNLi7TOT_qTQ9EcTraLUARcK0OCa_pvRZj6lCCXElLehCwZyr8K1-evJZH4pCwFRWy5vMAemuR4Ac',
              },
              {
                name: 'Valorant',
                tag: 'RIOT',
                badge: '240Hz',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5hR9PLfWtbhbOi-WDhXt9yZWZUgsI1tj10eV37UDf80GIS0WFuOXQgwUSfxrYlZnb6oxltIK-EsK_8AzScl_uTqHADWa_wjeq-nOE2pai4bSM-_D6OLMgYjo7uB4t1YBC8k1f9UpBVf9qQUwIdxJ311Hl4HeVAylACgBUkxgEB-aV_ZFIIZvL2PvwpI6kzfx_sHafii_t_khjz8WsnoywBTNQz7Mf-lY7zjhv-NVPXSPJ6ffk35Ls',
              },
              {
                name: 'Counter-Strike 2',
                tag: 'STEAM',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEG5Z51qHJskujQD4bHi9dp-WjKam9MWRmxzTszoUYUGR-C2GN0JlhR2GV_UsKbGpbyN0Zs7yhxFKmRTzNaGk3uaIk8iOxz9kALQz1DGTV_zPq-8Zc9bDgQAqGF2XRo90Z5dybxwHjLjX1YAvHkjfV7MaNf8U-YK5DZQG-M8Pj0jowYpm2b3yrzK8ETDukPweNdt3WdRHy1Msevj6ab5dIbYX6L8SrtFvVCxFd09nDfSchC6t8--o9',
              },
              {
                name: 'FC Online (FO4)',
                tag: 'GARENA',
                badge: 'HOT',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5ZHY-IIPQ4SbBXYve5568SYd1fw48fS_E6voSVRLLIWDiQv74i_y18NQjmCsqtD_4JsC5W-QOzkQurEuziC9UVEFGGvgf3BroT2xPJyiuxc70YLTu44ESZeIoVWnw7gPb5QhpEXFwVJtXHcaBjwtTWyk8sMqEfIbgH39h-6z7iQSm9Nw7uPwYe5Etl6JvXdLHTlud1Ihisk43YYG_qYj6OuT3vdHUbwBr7j-6S6Br-3ncNg2ctsx_',
              },
              {
                name: 'PUBG BATTLEGROUNDS',
                tag: 'STEAM',
                badge: 'ULTRA',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ8dqRxHk7EuPZN8_1BGltr5OYnAkj4TbT8c5JO4v6630hccGgShpEEgwby2yF5nD_as-5GXPeX4_-t1xJO4JZlr1g1J1qYPmr92Ak3I0pe8FOeJbWeAsi_cpfAy22OFj0E1oKAzGug7WNjl3O0CvUvk3JcLRpRQ0FGFzYWQUExn3r7SUeiRg-6xOKroEan7SSr8kD6vfKkS-LMDlOPZkele24Rg1DNqia1s8WFaO1FgGex1UGJ9tL',
              },
              {
                name: 'GTA V (FiveM)',
                tag: 'FIVEM',
                badge: 'ROLEPLAY',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBN8DTkrrdURUkVDToP0InwI6CNn7FDbJkMQIgC8wdXU5io491vTOIc4w4MwAtVsLaGIvJ2sr-ioLpftmD6wN_Bq_1Wq4ETjKvoomXrX35FV24zVuO-gKg3ikVLBIYlmssvpKdW793vSmB3zO2n27AxMXhcmiWsksmuDIOsrjpPF0DoyjKjNZ4csQoa5bkE86Dy7pM7RfgjKRQpodYDTWvuNepA5Uytll4hqroNnT4eBMg80_kLDoF',
              },
              {
                name: 'Elden Ring',
                tag: 'STEAM',
                badge: 'DLC OUT',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz9vx5H_6fggvwQ4dchScj7K_Zlr5CV3owN9FDub4sKfnXznBs4dj0TagegXlsGqmizq0gbCa4SCImTY2rtM23DXalfM88ZU1e6FnXoyjH_NL3cLIjyHKuQqlZpPrrp-AAqiXyos5DU9ayaWjI6B8tmW-LuEKILB6N2M69J-wqL00ezvklyLIfVOjiieOcT6uf8MQjOMuTO-qk_4AXR5UqcQDNpaNLK553eKzzCTsK__CZ60OgsQXv',
              },
            ].map((g, idx) => (
              <Link
                key={idx}
                href="/games"
                className="group relative flex flex-col bg-slate-900/90 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400 transition-all shadow-md hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-800">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url('${g.img}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 font-mono text-[8px] text-cyan-300 font-bold border border-cyan-400/30">
                    {g.tag}
                  </span>
                  {g.badge && (
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-[8px] font-bold border border-rose-500/40">
                      {g.badge}
                    </span>
                  )}
                </div>
                <div className="p-2 text-center bg-slate-900 border-t border-white/5">
                  <h4 className="font-bold text-[11px] text-white truncate group-hover:text-cyan-400">
                    {g.name}
                  </h4>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold mt-0.5 block">
                    Vào Chơi &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ══════════ 4. ĐẶC SẢN BẾP F&B GỌI MÓN TẬN BÀN ══════════ */}
        <div id="dich-vu" className="py-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase font-mono">DỊCH VỤ F&amp;B TẠI CHỖ</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide font-gaming mt-1">
                MENU GỌI MÓN TẬN BÀN
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Đặt món trực tiếp trên máy gaming, trừ tiền ví tự động, nhân viên bưng tận bàn trong 5-8 phút.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/menu"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 text-black font-extrabold text-xs font-mono shadow-md transition"
              >
                Mở Menu Gọi Món &rarr;
              </Link>
              <Link
                href="/kds"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono shadow-md transition"
              >
                Màn Hình Bếp KDS &rarr;
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/menu"
              className="bg-slate-900/80 border border-white/10 hover:border-emerald-400 rounded-2xl p-4 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-rose-400 font-bold uppercase font-mono px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">Bán Chạy Nhất</span>
                <h4 className="text-base font-black text-white mt-2 group-hover:text-emerald-400 transition-colors">
                  Mì Trộn Indomie Double Trứng
                </h4>
                <p className="text-xs text-slate-400 mt-1">Trứng lòng đào béo ngậy, hành phi giòn tan, dưa leo.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="font-mono text-base font-black text-emerald-400">38.000đ</span>
                <span className="text-xs text-slate-400 group-hover:text-emerald-400 font-bold">+ Gọi Ngay</span>
              </div>
            </Link>

            <Link
              href="/menu"
              className="bg-slate-900/80 border border-white/10 hover:border-emerald-400 rounded-2xl p-4 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">Đặc Sản Cyber</span>
                <h4 className="text-base font-black text-white mt-2 group-hover:text-emerald-400 transition-colors">
                  Cơm Bò Lúc Lắc Phô Mai
                </h4>
                <p className="text-xs text-slate-400 mt-1">Bò mềm xào sốt tiêu đen phô mai kéo sợi, trứng ốp la.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="font-mono text-base font-black text-emerald-400">55.000đ</span>
                <span className="text-xs text-slate-400 group-hover:text-emerald-400 font-bold">+ Gọi Ngay</span>
              </div>
            </Link>

            <Link
              href="/menu"
              className="bg-slate-900/80 border border-white/10 hover:border-emerald-400 rounded-2xl p-4 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">Ưu Đãi Đêm</span>
                <h4 className="text-base font-black text-white mt-2 group-hover:text-emerald-400 transition-colors">
                  Combo Thức Đêm Chiến Game (-20%)
                </h4>
                <p className="text-xs text-slate-400 mt-1">1x Cơm Đùi Gà Da Giòn + 1x Sting Dâu + 1x Snack.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="font-mono text-base font-black text-emerald-400">69.000đ</span>
                <span className="text-xs text-slate-400 group-hover:text-emerald-400 font-bold">+ Chọn Combo</span>
              </div>
            </Link>

            <Link
              href="/menu"
              className="bg-slate-900/80 border border-white/10 hover:border-emerald-400 rounded-2xl p-4 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">Nạp Năng Lượng</span>
                <h4 className="text-base font-black text-white mt-2 group-hover:text-cyan-400 transition-colors">
                  Monster Energy Ultra Lạnh
                </h4>
                <p className="text-xs text-slate-400 mt-1">Ướp lạnh âm độ C, phục vụ kèm ly đá riêng tận bàn.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="font-mono text-base font-black text-cyan-400">35.000đ</span>
                <span className="text-xs text-slate-400 group-hover:text-cyan-400 font-bold">+ Thêm Nhanh</span>
              </div>
            </Link>
          </div>
        </div>

      </div>

      {/* FOOTER ĐỒNG BỘ THƯƠNG HIỆU CYBER ZONE */}
      <footer className="border-t border-white/10 bg-black/60 py-8 px-4 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-black font-black flex items-center justify-center font-bold">
              CZ
            </div>
            <div>
              <p className="font-bold text-white">CYBER ZONE ESPORTS &amp; ENTERTAINMENT COMPLEX</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Chi nhánh: TP.HCM • Đà Nẵng • Hà Nội • Hotline: 1900 8888 (24/7)</p>
            </div>
          </div>
          <div className="text-slate-400">
            Hệ thống quản lý máy trạm &amp; F&amp;B tự động • Nhóm đồ án Cyber Game
          </div>
        </div>
      </footer>
    </div>
  );
}
