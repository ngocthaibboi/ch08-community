'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ALL_SEATS_CONFIG, saveBooking } from '@/lib/bookingStore';

export default function Home() {
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSeatId, setFormSeatId] = useState('ARENA-A1');
  const [formTime, setFormTime] = useState('18:00 - 22:00 (Giờ cao điểm)');
  const [successBooking, setSuccessBooking] = useState<{ code: string; seatId: string; name: string } | null>(null);

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const seat = ALL_SEATS_CONFIG.find((s) => s.id === formSeatId) || ALL_SEATS_CONFIG[0];

    const newBooking = saveBooking({
      seatId: seat.id,
      customerName: formName.trim(),
      phone: formPhone.trim() || '0988.888.888',
      timeSlot: formTime,
      date: new Date().toISOString().split('T')[0],
      zone: seat.zoneName,
      branch: 'Flagship Complex: 182 Lê Duẩn, TP. Vinh',
      status: 'RESERVED',
      notes: 'Khách đặt trực tuyến tại Trang Chủ',
    });

    setSuccessBooking({
      code: newBooking.bookingCode,
      seatId: newBooking.seatId,
      name: newBooking.customerName,
    });
    setFormName('');
    setFormPhone('');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black">
      
      {/* ══════════ 1. BANNER CHÀO MỪNG & BỘ ĐIỀU PHỐI HỆ SINH THÁI ══════════ */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        
        {/* BANNER ĐIỀU HƯỚNG 5 CHẾ ĐỘ TRẢI NGHIỆM */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-[#071126] to-slate-900 border border-emerald-500/40 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0"></div>
            <div>
              <span className="text-emerald-400 font-black text-xs uppercase tracking-wider block">
                HỆ SINH THÁI CYBER GAME LIÊN THÔNG TOÀN DIỆN (5 CHẾ ĐỘ HOẠT ĐỘNG)
              </span>
              <span className="text-slate-300 text-[11px] block mt-0.5">
                Trải nghiệm từ <strong className="text-white">Khách xem quán</strong> &rarr; <strong className="text-cyan-400">Ngồi máy VIP-08</strong> &rarr; <strong className="text-purple-400">Máy Chủ Quầy Server</strong> &rarr; <strong className="text-amber-400">Bếp KDS</strong> &rarr; <strong className="text-emerald-400">Doanh thu</strong>.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/client-pc"
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
              <span>NGỒI MÁY VIP-08</span>
            </Link>
            <Link
              href="/server"
              className="px-3.5 py-2 bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/50 text-purple-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-purple-400">dns</span>
              <span>Máy Chủ Server</span>
            </Link>
            <Link
              href="/kds"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-400">soup_kitchen</span>
              <span>Bếp KDS</span>
            </Link>
          </div>
        </div>

      </div>

      {/* ══════════ 2. HERO SECTION: NEXT-GEN ESPORTS & ENTERTAINMENT ══════════ */}
      <div className="relative py-12 md:py-20 border-b border-white/10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <i className="fa-solid fa-certificate"></i> TIÊU CHUẨN THI ĐẤU QUỐC TẾ IESF • HẠ TẦNG RTX 50-SERIES ULTRA
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white font-gaming tracking-wide uppercase leading-tight">
            NEXT-GEN <span className="text-emerald-400">ESPORTS &amp;</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              ENTERTAINMENT COMPLEX
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Tổ hợp giải trí đa phương tiện đỉnh cao: 300+ dàn máy RTX 50-Series, Đấu trường Esports chuẩn quốc tế, Billiards Lounge nghệ thuật 10 bàn nhập khẩu &amp; Private Console Suite 24/7.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link
              href="/client-pc"
              className="px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-0.5 flex items-center gap-2.5 font-mono"
            >
              <span className="material-symbols-outlined text-[20px]">desktop_windows</span>
              <span>TRẢI NGHIỆM MÁY TRẠM VIP-08</span>
            </Link>

            <Link
              href="/booking"
              className="px-8 py-4 bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-white font-bold text-sm rounded-2xl transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px] text-cyan-400">table_restaurant</span>
              <span>SƠ ĐỒ MÁY &amp; ĐẶT CHỖ ONLINE</span>
            </Link>

            <Link
              href="/server"
              className="px-8 py-4 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/50 text-purple-300 font-bold text-sm rounded-2xl transition flex items-center gap-2 font-mono"
            >
              <span className="material-symbols-outlined text-[18px] text-purple-400">dns</span>
              <span>MÁY CHỦ QUẦY SERVER</span>
            </Link>
          </div>

          {/* 5 THẺ THÔNG SỐ KỶ LỤC CỦA TỔ HỢP */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-10 font-mono text-center">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase block">SỨC CHỨA CẤU HÌNH</span>
              <span className="text-xl md:text-2xl font-black text-white font-gaming mt-1 block">300+ Máy</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">RTX 4090 / 5090 Ready</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase block">TẦN SỐ QUÉT KỶ LỤC</span>
              <span className="text-xl md:text-2xl font-black text-emerald-400 font-gaming mt-1 block">540Hz</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">ROG Swift Fast-IPS &amp; OLED</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase block">KHU BILLIARDS</span>
              <span className="text-xl md:text-2xl font-black text-white font-gaming mt-1 block">10 Bàn</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">Aileex King &amp; Min Import</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase block">CONSOLE SUITE</span>
              <span className="text-xl md:text-2xl font-black text-purple-400 font-gaming mt-1 block">PS5 Pro</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">OLED 75" 4K 120Hz HDR</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 col-span-2 md:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase block">SHOWROOM GEAR</span>
              <span className="text-xl md:text-2xl font-black text-amber-400 font-gaming mt-1 block">ASUS &amp; Razer</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Trải nghiệm &amp; Mua sắm</span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">

        {/* ══════════ FORM ĐẶT MÁY & BÀN BIDA TRỰC TIẾP TẠI TRANG CHỦ ══════════ */}
        <div id="dat-cho-nhanh" className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#07132a] via-slate-900 to-[#07132a] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                ĐẶT CHỖ REALTIME TRỰC TIẾP
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-gaming">
                GIỮ MÁY &amp; BÀN BI-A TRƯỚC TỪ XA
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                Thông tin đặt của bạn sẽ lập tức cập nhật trạng thái <strong className="text-amber-400 font-mono">ĐÃ ĐẶT</strong> trên Sơ đồ máy và gửi tin nhắn tức thì về Máy Chủ Quầy Thu Ngân!
              </p>
            </div>

            {successBooking && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl animate-bounce">
                <div>
                  <div className="font-bold text-sm">🎉 ĐẶT CHỖ THÀNH CÔNG CHO: {successBooking.name}</div>
                  <div className="text-[11px] text-slate-300">Vị trí: <strong className="text-white">{successBooking.seatId}</strong> • Mã vé: <strong className="text-cyan-400">{successBooking.code}</strong></div>
                </div>
                <div className="flex gap-2">
                  <Link href="/booking" className="px-3 py-1.5 rounded-xl bg-emerald-400 text-slate-950 font-black text-[11px]">
                    Xem Sơ Đồ Máy &rarr;
                  </Link>
                  <Link href="/server" className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-black text-[11px]">
                    Xem Trên Server &rarr;
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleQuickBook} className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">HỌ &amp; TÊN CỦA BẠN</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">SỐ ĐIỆN THOẠI</label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912.345.678..."
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">CHỌN VỊ TRÍ MÁY HOẶC BÀN BI-A</label>
                <select
                  value={formSeatId}
                  onChange={(e) => setFormSeatId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/80 border border-white/10 text-emerald-400 font-bold focus:outline-none focus:border-cyan-400"
                >
                  <optgroup label="TẦNG 1: ĐẤU TRƯỜNG ARENA 5VS5">
                    <option value="ARENA-A1">ARENA-A1 (Đội Xanh • RTX 4090 • 540Hz)</option>
                    <option value="ARENA-A2">ARENA-A2 (Đội Xanh • RTX 4090 • 540Hz)</option>
                    <option value="ARENA-B1">ARENA-B1 (Đội Đỏ • RTX 4090 • 540Hz)</option>
                    <option value="ARENA-B2">ARENA-B2 (Đội Đỏ • RTX 4090 • 540Hz)</option>
                  </optgroup>
                  <optgroup label="TẦNG 1: BILLIARDS LOUNGE 10 BÀN AILEEX & MIN">
                    <option value="BIDA-01">BIDA-01 (Bàn Aileex King 9020 Pool)</option>
                    <option value="BIDA-02">BIDA-02 (Bàn Aileex King 9020 Pool)</option>
                    <option value="BIDA-03">BIDA-03 (Bàn Min Hàn Quốc Carom 3 Băng)</option>
                    <option value="BIDA-04">BIDA-04 (Bàn Min Hàn Quốc Carom 3 Băng)</option>
                    <option value="BIDA-09">BIDA-09 (Bàn Rasson Ox VIP Suite)</option>
                  </optgroup>
                  <optgroup label="TẦNG 2: CYBER PRO 540HZ">
                    <option value="PRO-01">PRO-01 (Ryzen 7 7800X3D • 540Hz)</option>
                    <option value="PRO-02">PRO-02 (Ryzen 7 7800X3D • 540Hz)</option>
                  </optgroup>
                  <optgroup label="TẦNG 2: ULTRA VIP SUITE">
                    <option value="VIP-01">VIP-01 (Core i9 14900K • RTX 4090)</option>
                    <option value="VIP-02">VIP-02 (Core i7 14700K • RTX 4090)</option>
                    <option value="VIP-03">VIP-03 (Core i7 14700K • RTX 4080 Super)</option>
                  </optgroup>
                  <optgroup label="TẦNG 2: STREAM & COUPLE & CONSOLE">
                    <option value="STREAM-01">STREAM-01 (Phòng Stream Dual-PC)</option>
                    <option value="COUPLE-01">COUPLE-01 (Phòng Đôi Sofa da Nappa)</option>
                    <option value="CONSOLE-01">CONSOLE-01 (Phòng PS5 Pro & TV 75" 4K)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">KHUNG GIỜ CHƠI</label>
                <select
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/80 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="18:00 - 22:00 (Giờ cao điểm)">18:00 - 22:00 (Giờ cao điểm)</option>
                  <option value="13:00 - 17:00 (Buổi chiều)">13:00 - 17:00 (Buổi chiều)</option>
                  <option value="22:00 - 06:00 (Combo cày đêm xuyên sáng)">22:00 - 06:00 (Combo cày đêm xuyên sáng)</option>
                  <option value="08:00 - 12:00 (Buổi sáng)">08:00 - 12:00 (Buổi sáng)</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition font-gaming"
                >
                  XÁC NHẬN ĐẶT CHỖ GIỮ MÁY NGAY &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ══════════ 3. 6 PHÂN KHU ĐẲNG CẤP THƯỢNG THỪA ══════════ */}
        <div id="phan-khu" className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                HỆ THỐNG PHÂN KHU CHUYÊN BIỆT
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white font-gaming mt-1">
                6 KHÔNG GIAN GIẢI TRÍ ĐỘC BẢN
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-400 max-w-md">
              Thiết kế ánh sáng công thái học, hệ thống lọc khí tươi vô trùng 100% cùng điều hòa trung tâm 22°C tiêu chuẩn thi đấu quốc tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Zone 1: Main Arena */}
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=700&q=80"
                  alt="Main Arena"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40">
                  01 • MAIN ARENA 5VS5
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Đấu Trường Thi Đấu Esports</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Sàn đấu trung tâm 120 chỗ ngồi, bục thi đấu 5vs5 Đội Xanh &amp; Đội Đỏ cách âm chuẩn giải đấu Major.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Cấu hình:</span><span className="text-emerald-400 font-bold">i9-14900K • RTX 4090 OC</span></div>
                  <div className="flex justify-between text-slate-400"><span>Màn hình:</span><span className="text-white font-bold">ROG Swift OLED 540Hz</span></div>
                </div>
              </div>
            </div>

            {/* Zone 2: Cyber Pro 540Hz */}
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=700&q=80"
                  alt="Cyber Pro"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/40">
                  02 • CYBER PRO 540HZ
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Khu Máy FPS &amp; MOBA Chuyên Nghiệp</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Trải nghiệm tần số quét vô thực 540Hz đỉnh nhất thế giới. Độ trễ hiển thị gần như bằng 0, ghế Herman Miller Embody.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Cấu hình:</span><span className="text-cyan-400 font-bold">Ryzen 7 7800X3D • RTX 4080 Super</span></div>
                  <div className="flex justify-between text-slate-400"><span>Màn hình:</span><span className="text-white font-bold">ASUS ROG Swift Pro 540Hz</span></div>
                </div>
              </div>
            </div>

            {/* Zone 3: Streamer Studio */}
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 hover:border-purple-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=700&q=80"
                  alt="Streamer Room"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-purple-400 font-mono text-[10px] font-bold border border-purple-500/40">
                  03 • STREAMER STUDIO
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Studio Stream &amp; Caster Riêng Tư</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Phòng riêng cách âm chuẩn phòng thu âm thanh. Dàn máy Dual-PC i9 + RTX 4090, đèn Elgato và Mic Shure SM7B.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Hệ thống:</span><span className="text-purple-400 font-bold">Dual-PC i9 + RTX 4090</span></div>
                  <div className="flex justify-between text-slate-400"><span>Thiết bị:</span><span className="text-white font-bold">Cam 4K Sony • Elgato StreamDeck</span></div>
                </div>
              </div>
            </div>

            {/* Zone 4: Couple Zone */}
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 hover:border-pink-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=700&q=80"
                  alt="Couple Zone"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-pink-400 font-mono text-[10px] font-bold border border-pink-500/40">
                  04 • COUPLE SUITE
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Phòng Đôi Couple VIP</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Không gian riêng tư cho cặp đôi. Ghế sofa đôi da Napa êm ái, vách ngăn chống ồn, phục vụ đồ ăn tại bàn.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Cấu hình:</span><span className="text-pink-400 font-bold">Core i7 14700K • RTX 4070 Ti</span></div>
                  <div className="flex justify-between text-slate-400"><span>Không gian:</span><span className="text-white font-bold">Sofa Đôi VIP • Đèn RGB</span></div>
                </div>
              </div>
            </div>

            {/* Zone 5: Billiards Lounge Aileex 10 Bàn */}
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1615671524827-c1fe3973b648?auto=format&fit=crop&w=700&q=80"
                  alt="Billiards Lounge"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40">
                  05 • BILLIARDS LOUNGE 10 BÀN
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Billiards Club 10 Bàn Chuẩn Quốc Tế</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    10 bàn bi-a Aileex King 9020 và Min Carom nhập khẩu chính hãng. Nỉ Simonis 860 siêu mướt, bóng Aramith Tournament Pro.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Quy mô:</span><span className="text-emerald-400 font-bold">10 Bàn Pool &amp; Carom 3 Băng</span></div>
                  <div className="flex justify-between text-slate-400"><span>Trang thiết bị:</span><span className="text-white font-bold">Bóng Aramith Pro • Cơ carbon</span></div>
                </div>
              </div>
            </div>

            {/* Zone 6: Console Suite PS5 Pro */}
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 hover:border-blue-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=700&q=80"
                  alt="Console Room"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-blue-400 font-mono text-[10px] font-bold border border-blue-500/40">
                  06 • PS5 PRO CONSOLE SUITE
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Private Console Suite</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Trang bị máy chơi game PlayStation 5 Pro thế hệ mới nhất. Màn hình OLED LG 75 inch 4K 120Hz, kho 200 game đỉnh FC 25, Mortal Kombat.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Phần cứng:</span><span className="text-blue-400 font-bold">PlayStation 5 Pro + 4 Tay Cầm</span></div>
                  <div className="flex justify-between text-slate-400"><span>Hiển thị:</span><span className="text-white font-bold">LG OLED 75" 4K 120Hz G-Sync</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ══════════ 4. BẢNG GIÁ DỊCH VỤ & HỆ THỐNG THẺ VIP ══════════ */}
        <div id="bang-gia" className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              MINH BẠCH &amp; NHIỀU ƯU ĐÃI
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white font-gaming">
              BẢNG PHÍ GIỜ CHƠI &amp; HẠNG THẺ VIP
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Nạp tích lũy càng nhiều, cấp hạng hội viên càng cao — tự động giảm giá tiền giờ chơi và menu Bếp F&amp;B vĩnh viễn!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Hạng Đồng */}
            <div className="rounded-3xl p-6 bg-slate-900/60 border border-amber-900/40 flex flex-col justify-between space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-950/60 border border-amber-800 text-amber-500 uppercase">
                  TÂN THỦ (0đ - 200K)
                </span>
                <h3 className="text-2xl font-black text-white font-gaming mt-3">HẠNG ĐỒNG</h3>
                <div className="text-3xl font-black text-white font-mono mt-2">15.000đ<span className="text-xs text-slate-400 font-sans">/giờ</span></div>
                <ul className="mt-4 space-y-2 text-xs text-slate-400 font-mono">
                  <li><i className="fa-solid fa-check text-emerald-400 mr-2"></i> Trải nghiệm dàn máy tiêu chuẩn</li>
                  <li><i className="fa-solid fa-check text-emerald-400 mr-2"></i> Tặng 100% nạp lần đầu</li>
                  <li className="text-slate-600"><i className="fa-solid fa-xmark mr-2"></i> Giảm giá món F&amp;B</li>
                </ul>
              </div>
              <Link href="/auth" className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs font-mono text-center block transition">
                NẠP THẺ &rarr;
              </Link>
            </div>

            {/* Hạng Bạc */}
            <div className="rounded-3xl p-6 bg-slate-900/60 border border-slate-500/30 flex flex-col justify-between space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-800 border border-slate-400 text-slate-300 uppercase">
                  BẠC (&gt; 200K)
                </span>
                <h3 className="text-2xl font-black text-white font-gaming mt-3">HẠNG BẠC</h3>
                <div className="text-3xl font-black text-slate-200 font-mono mt-2">14.250đ<span className="text-xs text-slate-400 font-sans">/giờ</span></div>
                <ul className="mt-4 space-y-2 text-xs text-slate-300 font-mono">
                  <li><i className="fa-solid fa-check text-emerald-400 mr-2"></i> <strong className="text-emerald-400">Giảm 5%</strong> tiền giờ chơi</li>
                  <li><i className="fa-solid fa-check text-emerald-400 mr-2"></i> Đặt giữ máy trước 15 phút</li>
                  <li><i className="fa-solid fa-check text-emerald-400 mr-2"></i> Tặng 1 đồ uống sinh nhật</li>
                </ul>
              </div>
              <Link href="/auth" className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs font-mono text-center block transition">
                NẠP LÊN BẠC &rarr;
              </Link>
            </div>

            {/* Hạng Vàng */}
            <div className="rounded-3xl p-6 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/50 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
              <span className="absolute top-4 right-4 text-amber-400 text-xs font-black font-mono">PHỔ BIẾN ⭐</span>
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/50 text-amber-300 uppercase">
                  VÀNG (&gt; 1 TRIỆU)
                </span>
                <h3 className="text-2xl font-black text-amber-400 font-gaming mt-3">HẠNG VÀNG</h3>
                <div className="text-3xl font-black text-white font-mono mt-2">13.500đ<span className="text-xs text-slate-400 font-sans">/giờ</span></div>
                <ul className="mt-4 space-y-2 text-xs text-slate-200 font-mono">
                  <li><i className="fa-solid fa-check text-amber-400 mr-2"></i> <strong className="text-amber-400">Giảm 10%</strong> tiền giờ chơi</li>
                  <li><i className="fa-solid fa-check text-amber-400 mr-2"></i> <strong className="text-emerald-400">Giảm 5%</strong> thực đơn Bếp F&amp;B</li>
                  <li><i className="fa-solid fa-check text-amber-400 mr-2"></i> Giữ máy trước 30 phút</li>
                </ul>
              </div>
              <Link href="/auth" className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-mono text-center block transition shadow-lg shadow-amber-500/25">
                NÂNG HẠNG VÀNG &rarr;
              </Link>
            </div>

            {/* Hạng Kim Cương */}
            <div className="rounded-3xl p-6 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-400/60 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
              <span className="absolute top-4 right-4 text-cyan-400 text-xs font-black font-mono">VIP CAO CẤP 💎</span>
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 border border-cyan-400 text-cyan-300 uppercase">
                  KIM CƯƠNG (&gt; 3 TRIỆU)
                </span>
                <h3 className="text-2xl font-black text-cyan-300 font-gaming mt-3">KIM CƯƠNG</h3>
                <div className="text-3xl font-black text-cyan-300 font-mono mt-2">12.000đ<span className="text-xs text-slate-400 font-sans">/giờ</span></div>
                <ul className="mt-4 space-y-2 text-xs text-cyan-100 font-mono">
                  <li><i className="fa-solid fa-check text-cyan-400 mr-2"></i> <strong className="text-cyan-400">Giảm 20%</strong> tiền giờ toàn quán</li>
                  <li><i className="fa-solid fa-check text-cyan-400 mr-2"></i> <strong className="text-emerald-400">Giảm 10%</strong> thực đơn Bếp F&amp;B</li>
                  <li><i className="fa-solid fa-check text-cyan-400 mr-2"></i> Ưu tiên đặt máy Arena &amp; Bida</li>
                </ul>
              </div>
              <Link href="/auth" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs font-mono text-center block transition shadow-lg shadow-cyan-500/30">
                LÊN KIM CƯƠNG &rarr;
              </Link>
            </div>

          </div>
        </div>

        {/* ══════════ 5. TESTIMONIALS: FAKER, ĐỘ MIXI, ELON MUSK ══════════ */}
        <div id="khach-hang" className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              KHÁCH HÀNG NÓI VỀ CYBER ZONE
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white font-gaming">
              LỜI KHEN TỪ CÁC HUYỀN THOẠI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            
            {/* Faker */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-emerald-400/40 transition duration-300 flex flex-col justify-between space-y-6">
              <p className="text-slate-300 text-sm leading-relaxed italic">
                “Đấu trường Cyber Zone đem lại trải nghiệm thi đấu không khác gì sân vận động LCK Seoul. Màn hình 540Hz và độ trễ gần như bằng 0 giúp tôi tung chiêu hoàn hảo.”
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400">
                  <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80" alt="Faker" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Faker (Lee Sang-hyeok)</h4>
                  <span className="text-xs font-mono text-emerald-400">Tuyển Thủ LoL T1 • Huyền Thoại LCK</span>
                </div>
              </div>
            </div>

            {/* Độ Mixi */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/40 transition duration-300 flex flex-col justify-between space-y-6">
              <p className="text-slate-300 text-sm leading-relaxed italic">
                “Phòng máy quá đỉnh anh em ơi! Dàn máy bắn CS2 với PUBG sướng tay, đồ ăn Bếp bưng tận bàn nóng hổi, bàn bida Simonis mướt rượt. 10 điểm không có nhưng!”
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" alt="Độ Mixi" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Độ Mixi (Phùng Thanh Độ)</h4>
                  <span className="text-xs font-mono text-cyan-400">Streamer Số 1 Việt Nam • Bộ Tộc MixiGaming</span>
                </div>
              </div>
            </div>

            {/* Elon Musk */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-purple-400/40 transition duration-300 flex flex-col justify-between space-y-6">
              <p className="text-slate-300 text-sm leading-relaxed italic">
                “Đây quả thật là công nghệ tổ hợp giải trí vượt xa tầm vũ trụ! Hạ tầng mạng cáp quang 10Gbps và hệ thống tự động hóa gọi món tại máy này nên có mặt trên Sao Hỏa.”
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400">
                  <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80" alt="Elon Musk" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Elon Musk</h4>
                  <span className="text-xs font-mono text-purple-400">CEO Tesla, SpaceX &amp; xAI</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ══════════ 6. SHOWROOM GEAR & ĐẶT MÁY ══════════ */}
        <div id="showroom" className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0a152e] to-slate-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
              SHOWROOM GAMING GEAR
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white font-gaming">
              Trải Nghiệm &amp; Mua Sắm Phụ Kiện Chính Hãng
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Khu trưng bày chuột, tai nghe, phím cơ ASUS ROG, Razer, Logitech G và Zowie. Khách chơi máy được mượn test thử trực tiếp trước khi mua.
            </p>
          </div>
          <Link
            href="/client-pc"
            className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition shrink-0 font-mono"
          >
            NGỒI VÀO MÁY CHƠI NGAY &rarr;
          </Link>
        </div>

      </div>

    </div>
  );
}
