import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 font-sans selection:bg-cyan-500 selection:text-black">
      {/* HERO BANNER SECTION (Từ Bạn Thái - Leader) */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Cột trái: Giới thiệu & Kêu gọi hành động */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Phòng máy Tiêu chuẩn eSports 5 sao đầu tiên tại Vinh
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none font-gaming">
              CHIẾN GAME ĐỈNH CAO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                KHÔNG GIAN ESPORTS
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Trang bị 100% màn hình 240Hz siêu mượt, card đồ họa RTX 40 Series thế hệ mới,
              không gian máy lạnh khử mùi 24/7 và hệ thống Bếp phục vụ tận bàn chuẩn vị.
            </p>

            {/* Banner Ưu Đãi Nạp Thẻ */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 max-w-xl">
              <div>
                <span className="text-xs font-bold text-cyan-400 font-mono">CHƯƠNG TRÌNH HỘI VIÊN MỚI</span>
                <p className="text-sm text-slate-200 font-bold mt-0.5">Tặng ngay 50% giá trị nạp lần đầu</p>
                <p className="text-[11px] text-slate-500">Áp dụng cho tất cả tài khoản đăng ký mới tuần này</p>
              </div>
              <Link
                href="/auth"
                className="shrink-0 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-lg transition shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                Nhận ưu đãi
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/games"
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:brightness-110 text-white font-black text-sm rounded-xl shadow-lg shadow-cyan-500/30 transition flex items-center gap-2 ring-1 ring-cyan-300"
              >
                <span className="material-symbols-outlined text-[20px]">sports_esports</span>
                <span>Kho Game Máy Trạm (16 Game)</span>
              </Link>

              <Link
                href="/menu"
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
                <span>Menu Gọi Món Tận Bàn (F&amp;B)</span>
              </Link>

              <Link
                href="/auth"
                className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                <span>Nạp Tiền Vào Máy</span>
              </Link>
            </div>
          </div>

          {/* Cột phải: Card Cấu hình Dàn máy "Sát thủ" */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900 to-[#0e1628] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-bold tracking-wider uppercase font-mono">
                    KHU THI ĐẤU SUPER VIP
                  </span>
                  <h3 className="text-xl font-black text-white mt-2 font-gaming">DÀN MÁY BATTLE PRO</h3>
                </div>
                <span className="text-2xl font-black text-cyan-400 font-mono">
                  18.000đ<span className="text-xs text-slate-400 font-normal">/giờ</span>
                </span>
              </div>

              {/* Danh sách linh kiện chi tiết */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400 text-[16px]">memory</span>Vi xử lý
                  </span>
                  <span className="text-white font-bold">Intel Core i7 14700F</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400 text-[16px]">view_in_ar</span>Card đồ họa
                  </span>
                  <span className="text-emerald-400 font-bold">NVIDIA RTX 4070 12GB</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400 text-[16px]">desktop_windows</span>Màn hình
                  </span>
                  <span className="text-white font-bold">ASUS ROG 24.5" 240Hz 0.5ms</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400 text-[16px]">keyboard</span>Gaming Gear
                  </span>
                  <span className="text-white font-bold">Zowie EC2 + Phím Cơ Akko</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Trạng thái khu vực:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span> Còn 6 máy trống
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KHO GAME MÁY TRẠM (16 TỰA GAME BẢN QUYỀN) */}
        <div id="kho-game" className="py-12 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                Hệ Thống Diskless 10Gbps • Không Cần Chờ Tải
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-wide font-gaming">
                KHO GAME MÁY TRẠM (16 TỰA GAME)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tất cả 16 game bản quyền Steam, Riot Games, Garena, Battle.net đã được tối ưu 240Hz và cập nhật tự động.
              </p>
            </div>

            <Link
              href="/games"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:brightness-110 text-white font-black text-xs font-mono shadow-[0_0_15px_rgba(0,240,255,0.4)] transition flex items-center gap-2 ring-1 ring-cyan-300"
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
                className="group relative flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-400 transition-all shadow-md hover:-translate-y-1"
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
                <div className="p-2 text-center bg-slate-900 border-t border-slate-800">
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

        {/* BẢNG GIÁ THEO KHU VỰC THẬT CỦA QUÁN NET (Từ bạn Thái) */}
        <div id="bang-gia" className="py-12 border-t border-slate-800/80">
          <div className="text-left mb-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-wide font-gaming">
              BẢNG GIÁ DỊCH VỤ GIỜ CHƠI
            </h2>
            <p className="text-xs text-slate-400 mt-1">Phù hợp từ nhu cầu giải trí cơ bản đến thi đấu chuyên nghiệp</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Khu Thường */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition">
              <span className="text-xs font-bold text-slate-400 uppercase font-mono">Khu Tiêu Chuẩn (Tầng 1)</span>
              <div className="text-3xl font-black text-white my-3 font-mono">
                9.000đ <span className="text-xs font-normal text-slate-500">/ giờ</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Cấu hình phổ thông cân mượt LOL, FIFA Online 4, Valorant, Đột Kích.</p>
              <ul className="text-xs space-y-2.5 text-slate-300 border-t border-slate-800 pt-4 font-mono">
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Core i5 12400F + RAM 16GB</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> GTX 1660 Super 6GB</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Màn hình 27" 144Hz cong</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Ghế Gaming bọc da êm ái</li>
              </ul>
            </div>

            {/* Khu VIP (Nổi bật) */}
            <div className="bg-gradient-to-b from-slate-900 to-[#0e182e] border-2 border-cyan-500 rounded-xl p-6 shadow-xl relative">
              <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-black uppercase font-mono">
                Được chọn nhiều nhất
              </span>
              <span className="text-xs font-bold text-cyan-400 uppercase font-mono">Khu VIP Đấu Trường (Tầng 2)</span>
              <div className="text-3xl font-black text-white my-3 font-mono">
                14.000đ <span className="text-xs font-normal text-slate-500">/ giờ</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Trải nghiệm hoàn hảo cho PUBG, CS2, Naraka, Black Myth Wukong.</p>
              <ul className="text-xs space-y-2.5 text-slate-300 border-t border-slate-800 pt-4 font-mono">
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Core i5 13400F + RAM 32GB</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> RTX 3060Ti 8GB</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Màn hình 24.5" 240Hz IPS chuyên FPS</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Chuột Logitech G102 + Phím Blue Switch</li>
              </ul>
            </div>

            {/* Phòng Couple / Stream */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition">
              <span className="text-xs font-bold text-purple-400 uppercase font-mono">Phòng Đôi (Couple) &amp; Stream</span>
              <div className="text-3xl font-black text-white my-3 font-mono">
                22.000đ <span className="text-xs font-normal text-slate-500">/ giờ</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Không gian riêng tư có cửa cách âm, sofa đôi, mic và webcam rời cho Streamer.</p>
              <ul className="text-xs space-y-2.5 text-slate-300 border-t border-slate-800 pt-4 font-mono">
                <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Core i7 13700K + RTX 4070</li>
                <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Màn hình 2K 240Hz siêu sắc nét</li>
                <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Ghế sofa da nằm ngả lưng 180°</li>
                <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Cửa cách âm riêng biệt</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PHÂN HỆ F&B VÀ BẾP KDS (Của Bạn - Minh Nhật) */}
        <div id="dich-vu" className="py-12 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase font-mono">DỊCH VỤ F&amp;B TẠI CHỖ</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-wide font-gaming mt-1">
                MENU GỌI MÓN 
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Đặt món trực tiếp trên máy gaming, trừ tiền ví tự động, nhân viên bưng tận bàn trong 5-8 phút.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/menu"
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono shadow-[0_0_12px_rgba(0,240,255,0.3)] transition"
              >
                Mở Menu Gọi Món &rarr;
              </Link>
              <Link
                href="/kds"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono shadow-[0_0_12px_rgba(245,158,11,0.3)] transition"
              >
                Mở Màn Hình Bếp KDS &rarr;
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/menu"
              className="bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-xl p-4 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-rose-400 font-bold uppercase font-mono">Bán Chạy Nhất</span>
                <h4 className="text-base font-black text-white mt-1 group-hover:text-cyan-400 transition-colors">
                  Mì Trộn Indomie Double Trứng
                </h4>
                <p className="text-xs text-slate-400 mt-1">Trứng lòng đào béo ngậy, hành phi giòn tan, dưa leo.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="font-mono text-base font-black text-cyan-400">38.000đ</span>
                <span className="text-xs text-slate-400 group-hover:text-cyan-400 font-bold">+ Gọi Ngay</span>
              </div>
            </Link>

            <Link
              href="/menu"
              className="bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-xl p-4 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase font-mono">Đặc Sản Cyber</span>
                <h4 className="text-base font-black text-white mt-1 group-hover:text-cyan-400 transition-colors">
                  Cơm Bò Lúc Lắc Phô Mai
                </h4>
                <p className="text-xs text-slate-400 mt-1">Bò mềm xào sốt tiêu đen phô mai kéo sợi, trứng ốp la.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="font-mono text-base font-black text-cyan-400">55.000đ</span>
                <span className="text-xs text-slate-400 group-hover:text-cyan-400 font-bold">+ Gọi Ngay</span>
              </div>
            </Link>

            <Link
              href="/menu"
              className="bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-xl p-4 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase font-mono">Ưu Đãi Đêm</span>
                <h4 className="text-base font-black text-white mt-1 group-hover:text-cyan-400 transition-colors">
                  Combo Thức Đêm Chiến Game (-20%)
                </h4>
                <p className="text-xs text-slate-400 mt-1">1x Cơm Đùi Gà Da Giòn + 1x Sting Dâu + 1x Snack.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="font-mono text-base font-black text-emerald-400">69.000đ</span>
                <span className="text-xs text-slate-400 group-hover:text-emerald-400 font-bold">+ Chọn Combo</span>
              </div>
            </Link>

            <Link
              href="/menu"
              className="bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-xl p-4 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-cyan-400 font-bold uppercase font-mono">Nạp Năng Lượng</span>
                <h4 className="text-base font-black text-white mt-1 group-hover:text-cyan-400 transition-colors">
                  Monster Energy Ultra Lạnh
                </h4>
                <p className="text-xs text-slate-400 mt-1">Ướp lạnh âm độ C, phục vụ kèm ly đá riêng tận bàn.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="font-mono text-base font-black text-cyan-400">35.000đ</span>
                <span className="text-xs text-slate-400 group-hover:text-cyan-400 font-bold">+ Thêm Nhanh</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER CHUẨN THÔNG TIN PHÒNG MÁY (Từ bạn Thái) */}
      <footer className="border-t border-slate-800/80 bg-black/40 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-slate-300">HỆ THỐNG PHÒNG MÁY CYBER ZONE eSPORTS</p>
            <p className="mt-1">Địa chỉ: 182 Lê Duẩn, TP. Vinh (Gần ĐH Vinh) • Hotline: 0988.123.456 (24/7 có bảo vệ)</p>
          </div>
          <div className="text-slate-400 font-mono">
            Đồ án Web Quản Lý Quán Net Cyber • Phụ trách F&amp;B: Minh Nhật (feature/fnb)
          </div>
        </div>
      </footer>
    </div>
  );
}
