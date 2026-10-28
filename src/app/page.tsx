'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ALL_SEATS_CONFIG, saveBooking } from '@/lib/bookingStore';
import { getLoggedInUser, AUTH_EVENT_NAME, AuthUser } from '@/lib/authStore';
import AuthModal from '@/components/auth/AuthModal';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Form Booking State
  const [branch, setBranch] = useState('Zone 01: 182 Lê Duẩn, TP. Vinh (Flagship Complex)');
  const [zoneCategory, setZoneCategory] = useState('Standard Zone Tiêu Chuẩn (STD-01..10) - 12.000đ/h');
  const [quantity, setQuantity] = useState('1');
  const [bookingDate, setBookingDate] = useState('2026-10-28');
  const [timeSlot, setTimeSlot] = useState('Ngay bây giờ (Tức thì)');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');

  // Modal Auth & Booking Success
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState<string | undefined>(undefined);
  const [successBooking, setSuccessBooking] = useState<{
    code: string;
    seatId: string;
    name: string;
    zone: string;
  } | null>(null);

  // Lắng nghe thay đổi đăng nhập
  useEffect(() => {
    const user = getLoggedInUser();
    setCurrentUser(user);
    if (user) {
      setCustomerName(user.fullName);
      setPhone(user.phone);
    }

    const handleAuthChange = () => {
      const updatedUser = getLoggedInUser();
      setCurrentUser(updatedUser);
      if (updatedUser) {
        setCustomerName(updatedUser.fullName);
        setPhone(updatedUser.phone);
      }
    };

    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Xử lý khi nhấn nút Đặt chỗ bàn / máy
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // KIỂM TRA ĐĂNG NHẬP: Bắt buộc phải đăng nhập thì mới cho đặt bàn
    if (!currentUser) {
      setAuthModalMessage('Bạn cần đăng nhập tài khoản Cyber Zone để xác thực và tiến hành đặt giữ chỗ máy / bàn!');
      setIsAuthModalOpen(true);
      return;
    }

    // Tìm máy/bàn phù hợp theo phân khu được chọn
    let targetSeatId = 'REG-01';
    if (zoneCategory.includes('Standard')) targetSeatId = 'REG-01';
    else if (zoneCategory.includes('Billiards')) targetSeatId = 'BIDA-01';
    else if (zoneCategory.includes('VIP')) targetSeatId = 'VIP-01';
    else if (zoneCategory.includes('Pro')) targetSeatId = 'PRO-01';
    else if (zoneCategory.includes('Arena')) targetSeatId = 'ARENA-A1';
    else if (zoneCategory.includes('Stream')) targetSeatId = 'STREAM-01';
    else if (zoneCategory.includes('Couple')) targetSeatId = 'COUPLE-01';
    else if (zoneCategory.includes('Console')) targetSeatId = 'CONSOLE-01';

    const seat = ALL_SEATS_CONFIG.find((s) => s.id === targetSeatId) || ALL_SEATS_CONFIG[0];

    // Lưu vào store và kích hoạt đồng bộ real-time sang Server và Sơ đồ máy
    const newBooking = saveBooking({
      seatId: seat.id,
      customerName: customerName.trim() || currentUser.fullName,
      phone: phone.trim() || currentUser.phone || '0988.888.888',
      timeSlot,
      date: bookingDate,
      zone: seat.zoneName,
      branch,
      status: 'RESERVED',
      notes: `Đặt trước ${quantity} chỗ - ${zoneCategory}`,
    });

    setSuccessBooking({
      code: newBooking.bookingCode,
      seatId: newBooking.seatId,
      name: newBooking.customerName,
      zone: newBooking.zone,
    });
  };

  return (
    <div className="w-full bg-[#030712] text-slate-200 font-sans selection:bg-emerald-400 selection:text-black">
      
      {/* ══════════ 1. HERO SECTION: NEXT-GEN ESPORTS & ENTERTAINMENT COMPLEX (Ảnh 1) ══════════ */}
      <div className="relative py-12 md:py-20 border-b border-white/10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            TIÊU CHUẨN THI ĐẤU QUỐC TẾ IESF • HẠ TẦNG RTX ULTRA
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white font-gaming tracking-wide uppercase leading-tight">
            NEXT-GEN <span className="text-emerald-400">ESPORTS &amp;</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              ENTERTAINMENT COMPLEX
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Tổ hợp giải trí đa phương tiện đỉnh cao: 300+ dàn máy RTX 50-Series, Đấu trường Esports chuẩn quốc tế, Billiards Lounge nghệ thuật &amp; Private Console Suite 24/7.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <a
              href="#dat-cho"
              className="px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 font-sans"
            >
              <span className="material-symbols-outlined text-[18px]">sports_esports</span>
              <span>ĐẶT MÁY GIỮ CHỖ NGAY</span>
            </a>
            <a
              href="#phan-khu"
              className="px-8 py-4 bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-white font-bold text-sm rounded-xl transition flex items-center gap-2 font-sans"
            >
              <span>KHÁM PHÁ PHÂN KHU</span>
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
            </a>
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
              <span className="text-[10px] text-cyan-400 block mt-0.5">Aileex King / Min Import</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase block">CONSOLE SUITE</span>
              <span className="text-xl md:text-2xl font-black text-white font-gaming mt-1 block">15 Phòng</span>
              <span className="text-[10px] text-purple-400 block mt-0.5">PS5 Pro + Switch OLED</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 col-span-2 md:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase block">BĂNG THÔNG CHUYÊN DỤNG</span>
              <span className="text-xl md:text-2xl font-black text-emerald-400 font-gaming mt-1 block">≤ 1ms</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">10Gbps Multi-ISP Trunk</span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-28 py-16">

        {/* ══════════ 2. KHÁI NIỆM GIẢI TRÍ MỚI: VƯƠNG QUỐC CYBERPUNK (Ảnh 2) ══════════ */}
        <div id="khai-niem" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">bolt</span>
              KHÁI NIỆM GIẢI TRÍ MỚI
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white font-gaming leading-tight">
              Không chỉ là Cyber Game.<br />
              Đây là <span className="text-emerald-400">Vương Quốc Cyberpunk</span> của bạn.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Được kiến tạo từ tinh thần thi đấu bất diệt và niềm đam mê công nghệ đỉnh phong. Mọi chi tiết tại Cyber Zone—từ luồng khí lạnh đối lưu tươi lọc ion, ghế bọc da Nappa công thái học cho đến ánh sáng LED Neon đồng bộ âm thanh—đều sinh ra để tối ưu hóa phản xạ và cảm xúc thăng hoa.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300 pt-2">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10">
                <span className="material-symbols-outlined text-cyan-400 text-[16px]">ac_unit</span>
                Điều hòa âm trần 21°C
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10">
                <span className="material-symbols-outlined text-emerald-400 text-[16px]">shield</span>
                Cách âm chuyên biệt 45dB
              </span>
            </div>
          </div>

          {/* 2 Card ảnh không gian */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group rounded-2xl overflow-hidden border border-white/10 relative h-72">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
                alt="Đấu trường thi đấu"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-bold font-mono uppercase">
                  MAIN ARENA
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Đấu trường 120 chỗ ngồi chuẩn thi đấu
                </h4>
              </div>
            </div>

            <div className="group rounded-2xl overflow-hidden border border-white/10 relative h-72">
              <img
                src="https://images.unsplash.com/photo-1615671524827-c1fe3973b648?auto=format&fit=crop&w=800&q=80"
                alt="Billiards Lounge"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-2 py-0.5 rounded bg-cyan-500 text-black text-[9px] font-bold font-mono uppercase">
                  BILLIARDS LOUNGE
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Không gian thư giãn đẳng cấp nghệ thuật
                </h4>
              </div>
            </div>
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
                6 Phân Khu Đẳng Cấp Thượng Thừa
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Mỗi phân khu được thiết kế riêng biệt về âm học, công thái học và cấu hình phần cứng để phục vụ hoàn hảo từng nhu cầu gaming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Zone 1: Standard Zone (Khớp sơ đồ máy STD-01..10) */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=700&q=80"
                  alt="Standard Zone"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40">
                  01 • STANDARD ZONE (12.000đ/h)
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Standard Zone Tiêu Chuẩn</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Khu máy công cộng tiêu chuẩn (mã máy STD-01..10). Tối ưu thi đấu đối kháng CS2, Valorant, LMHT, FO4. Ghế da đúc công thái học, phím cơ DareU, chuột Logitech G102.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Cấu hình:</span><span className="text-emerald-400 font-bold">i5-13400F • RTX 4060Ti 8GB OC</span></div>
                  <div className="flex justify-between text-slate-400"><span>Màn hình:</span><span className="text-white">ASUS TUF 24.5" Fast-IPS 280Hz</span></div>
                </div>
              </div>
            </div>

            {/* Zone 2: Cyber Pro 540Hz (Khớp sơ đồ máy PRO-01..04) */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=700&q=80"
                  alt="Cyber Pro 540Hz"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/40">
                  02 • CYBER PRO 540HZ (18.000đ/h)
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Cyber Pro 540Hz Try-Hard</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Khu vực máy thi đấu FPS cao cấp (mã PRO-01..04). Màn hình Zowie 540Hz phá vỡ mọi giới hạn tốc độ, phím Wooting 60HE Hall Effect Rapid Trigger, ghế Herman Miller Embody.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Cấu hình:</span><span className="text-cyan-400 font-bold">Ryzen 7 7800X3D • RTX 4080 Super</span></div>
                  <div className="flex justify-between text-slate-400"><span>Màn hình:</span><span className="text-white">BenQ Zowie XL2566K 540Hz DyAc+</span></div>
                </div>
              </div>
            </div>

            {/* Zone 3: Ultra VIP Suite (Khớp sơ đồ máy VIP-01..08) */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80"
                  alt="Ultra VIP Suite"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-purple-400 font-mono text-[10px] font-bold border border-purple-500/40">
                  03 • ULTRA VIP SUITE (22.000đ/h)
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Phòng Riêng Ultra VIP Tầng 2</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Dãy phòng VIP riêng biệt (mã VIP-01..08 bao gồm máy bạn trải nghiệm VIP-08). Cách âm 45dB, ghế bọc da Nappa ngả 160°, chuột Zowie EC2-CW không dây, bàn phím Akko Custom Lube.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Cấu hình:</span><span className="text-purple-400 font-bold">Core i7-14700K • RTX 4070Ti Super</span></div>
                  <div className="flex justify-between text-slate-400"><span>Màn hình:</span><span className="text-white">ASUS ROG Swift 27" 240Hz Fast-IPS</span></div>
                </div>
              </div>
            </div>

            {/* Zone 4: Đấu Trường Arena 5vs5 (Khớp sơ đồ máy ARENA-A1..B5) */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=700&q=80"
                  alt="Arena 5vs5"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-amber-400 font-mono text-[10px] font-bold border border-amber-500/40">
                  04 • ĐẤU TRƯỜNG ARENA 5VS5 (25.000đ/h)
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Đấu Trường 5vs5 Chuẩn IESF</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Sàn đấu thi đấu đối kháng chuyên nghiệp (ARENA-A1..A5 Đội Xanh vs ARENA-B1..B5 Đội Đỏ). Đường truyền cáp quang riêng biệt ≤ 1ms, chuẩn bị sẵn sàng cho giải đấu trường học &amp; clan.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Flagship:</span><span className="text-amber-400 font-bold">Core i9-14900K • RTX 4090 24GB</span></div>
                  <div className="flex justify-between text-slate-400"><span>Màn hình:</span><span className="text-white">ROG Swift Pro OLED 540Hz Kỷ Lục</span></div>
                </div>
              </div>
            </div>

            {/* Zone 5: Couple Sanctuary (Khớp sơ đồ máy COUPLE-01..02) */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 hover:border-pink-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=700&q=80"
                  alt="Couple Sanctuary"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-pink-400 font-mono text-[10px] font-bold border border-pink-500/40">
                  05 • COUPLE SANCTUARY (45.000đ/h)
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Couple Suite Phòng Đôi Riêng Tư</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Phòng đôi hẹn hò gaming riêng tư cách âm (COUPLE-01..02). Ghế sofa đôi Nappa ngả 180°, 2 tai nghe độc lập, ánh sáng LED RGB chuyển sắc theo cảm xúc.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Cấu hình đôi:</span><span className="text-pink-400 font-bold">2x Core i7-14700K • 2x RTX 4070</span></div>
                  <div className="flex justify-between text-slate-400"><span>Màn hình:</span><span className="text-white">2x Samsung Odyssey G7 27" Cong</span></div>
                </div>
              </div>
            </div>

            {/* Zone 6: Console Lounge & PS5 Pro (Khớp sơ đồ máy CONSOLE-01..02) */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 hover:border-blue-500/50 transition duration-300 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=700&q=80"
                  alt="Console Living"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-blue-400 font-mono text-[10px] font-bold border border-blue-500/40">
                  06 • CONSOLE LOUNGE &amp; PS5 PRO (79.000đ/h)
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-gaming">Console Lounge PS5 Pro &amp; Bida</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Phòng riêng hội bạn chiến FC25, Mortal Kombat, Mario Kart (CONSOLE-01..02) và Billiards Club 10 bàn Aileex King. TV 75" 4K OLED 120Hz Dolby Vision, 4 tay cầm DualSense Edge.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400"><span>Hệ máy:</span><span className="text-blue-400 font-bold">PS5 Pro + Nintendo Switch OLED</span></div>
                  <div className="flex justify-between text-slate-400"><span>Hiển thị:</span><span className="text-white">LG OLED G3 75" 4K 120Hz Dolby Atmos</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ══════════ 4. BẢNG GIÁ GIỜ CHƠI & GÓI HỘI VIÊN ══════════ */}
        <div id="bang-gia" className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              MINH BẠCH &amp; TIẾT KIỆM
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white font-gaming">
              Bảng Giá Giờ Chơi &amp; Gói Hội Viên
            </h2>
            <p className="text-xs text-slate-400">
              Nạp càng nhiều nhận ưu đãi thưởng giờ lên đến 100%. Áp dụng đồng bộ mọi chi nhánh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Standard */}
            <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>STANDARD</span><span className="px-2 py-0.5 rounded bg-white/5">Public Zone</span>
                </div>
                <div className="text-4xl font-black text-white font-gaming my-4">
                  12.000đ <span className="text-xs text-slate-400 font-normal font-sans">/ h</span>
                </div>
                <p className="text-xs text-slate-400">Dành cho game thủ chiến game hàng ngày.</p>
                <ul className="text-xs space-y-3 text-slate-300 mt-6 border-t border-white/10 pt-6">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    Màn hình Fast-IPS 280Hz - 360Hz
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    VGA RTX 4060Ti / 4070 OC
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    Ghế bọc da đúc chống mỏi lưng
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    Free refill nước lọc tinh khiết
                  </li>
                </ul>
              </div>
              <Link
                href="/auth"
                className="w-full py-3 text-center bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition block"
              >
                Nạp Giờ Chơi
              </Link>
            </div>

            {/* VIP Pro */}
            <div className="rounded-3xl bg-gradient-to-b from-[#09181b] to-slate-900 border-2 border-emerald-400 p-8 flex flex-col justify-between space-y-6 shadow-2xl relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-400 text-black text-[10px] font-black font-mono uppercase tracking-wider shadow-lg">
                LỰA CHỌN PHỔ BIẾN NHẤT
              </span>
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-emerald-400 font-bold">
                  <span>VIP PRO</span><span className="px-2 py-0.5 rounded bg-emerald-400/20">Chống Ồn Tuyệt Đối</span>
                </div>
                <div className="text-4xl font-black text-white font-gaming my-4">
                  22.000đ <span className="text-xs text-slate-400 font-normal font-sans">/ h</span>
                </div>
                <p className="text-xs text-slate-400">Dành cho Rank cao thủ &amp; Streamer.</p>
                <ul className="text-xs space-y-3 text-slate-300 mt-6 border-t border-white/10 pt-6">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    Màn ROG OLED 240Hz / BenQ 540Hz
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    RTX 4080 Super / RTX 4090 24GB
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    Phòng cách âm riêng biệt 100%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    Tai nghe Wireless ROG &amp; Ghế Herman Miller
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    Tặng 01 Mocktail tự chọn khi chơi &ge; 4h
                  </li>
                </ul>
              </div>
              <a
                href="#dat-cho"
                className="w-full py-3 text-center bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/30 transition block"
              >
                ĐẶT CHỖ VIP NGAY
              </a>
            </div>

            {/* Lounge & Club */}
            <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>LOUNGE &amp; CLUB</span><span className="px-2 py-0.5 rounded bg-white/5">Billiards + PS5 Pro</span>
                </div>
                <div className="text-4xl font-black text-white font-gaming my-4">
                  79.000đ <span className="text-xs text-slate-400 font-normal font-sans">/ bàn/h</span>
                </div>
                <p className="text-xs text-slate-400">Trọn gói bàn thi đấu hoặc phòng PS5 Pro.</p>
                <ul className="text-xs space-y-3 text-slate-300 mt-6 border-t border-white/10 pt-6">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    Bàn Aileex King 9022 / Nỉ Simonis nhập
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    Phòng PS5 Pro TV 65" OLED 120Hz (tối đa 4 người)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    Full kho game bản quyền mới nhất 2026
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    Phục vụ đồ ăn uống 24/7 tận phòng
                  </li>
                </ul>
              </div>
              <a
                href="#dat-cho"
                className="w-full py-3 text-center bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition block"
              >
                Đặt Bàn / Phòng
              </a>
            </div>
          </div>

          {/* Banner Khuyến Mãi Nạp Giờ Vàng */}
          <div className="p-4 md:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase block">
                  CHƯƠNG TRÌNH KHUYẾN MÃI NẠP GIỜ VÀNG
                </span>
                <span className="text-xs text-slate-400">
                  Nạp 200k tặng 50k • Nạp 500k tặng 200k • Nạp 1.000k tặng 600k + Voucher Ăn Uống 100k
                </span>
              </div>
            </div>
            <Link
              href="/auth"
              className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold rounded-xl transition shrink-0"
            >
              NẠP NGAY BÂY GIỜ
            </Link>
          </div>
        </div>

        {/* ══════════ 5. BIỂU MẪU GIỮ CHỖ TRỰC TUYẾN 24/7 (Ảnh 3 - Yêu Cầu Đăng Nhập Mới Đặt Được) ══════════ */}
        <div id="dat-cho" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 md:p-12 rounded-3xl bg-slate-900/60 border border-white/10">
          
          {/* Cột Trái: Giới thiệu & Cam kết */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              GIỮ CHỖ TRỰC TUYẾN TỨC THÌ
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white font-gaming leading-tight">
              Đặt Máy &amp; Bàn Không Sợ Hết Chỗ Giờ Cao Điểm
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hệ thống đặt giữ máy theo thời gian thực (Real-time Booking). Đảm bảo cấu hình bạn chọn sẽ được khởi động và đăng nhập sẵn sàng khi bạn tới.
            </p>
            <div className="space-y-2.5 text-xs text-slate-400 pt-2 font-mono">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm">schedule</span>
                <span>Giữ máy trong vòng 30 phút kể từ mốc giờ đã đặt</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm">sms</span>
                <span>Xác nhận tức thì qua tin nhắn Zalo / SMS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm">sync</span>
                <span>Đổi khu vực hoặc hoàn tiền giờ không mất phí</span>
              </div>
            </div>

            {/* Trạng thái xác thực tài khoản */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 mt-4 text-xs font-mono">
              {currentUser ? (
                <div className="text-emerald-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span>Đã đăng nhập: <strong>{currentUser.fullName}</strong> ({currentUser.userTier})</span>
                </div>
              ) : (
                <div className="text-amber-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>Chưa đăng nhập: Cần đăng nhập để hoàn tất giữ chỗ.</span>
                </div>
              )}
            </div>
          </div>

          {/* Cột Phải: Biểu Mẫu Giữ Chỗ 24/7 (Ảnh 3) */}
          <div className="lg:col-span-7 bg-[#070d18] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white font-gaming border-b border-white/10 pb-3">
              Biểu Mẫu Giữ Chỗ 24/7
            </h3>

            {/* Thông báo thành công nếu vừa đặt */}
            {successBooking && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                <div>
                  <div className="font-bold text-sm">🎉 GIỮ CHỖ THÀNH CÔNG CHO: {successBooking.name}</div>
                  <div className="text-[11px] text-slate-300">
                    Vị trí: <strong className="text-white">{successBooking.seatId}</strong> ({successBooking.zone}) • Mã vé: <strong className="text-cyan-400">{successBooking.code}</strong>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href="/booking" className="px-3 py-1.5 rounded-lg bg-emerald-400 text-black font-black text-[11px]">
                    Xem Sơ Đồ Máy &rarr;
                  </Link>
                  <Link href="/server" className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-black text-[11px]">
                    Xem Trên Server &rarr;
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4 font-mono text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1.5">CHỌN CHI NHÁNH</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-400 outline-none"
                  >
                    <option value="Zone 01: 182 Lê Duẩn, TP. Vinh (Flagship Complex)">
                      Zone 01: 182 Lê Duẩn, TP. Vinh (Flagship Complex)
                    </option>
                    <option value="Zone 02: 128 Nguyễn Trãi, Q.1, TP.HCM">
                      Zone 02: 128 Nguyễn Trãi, Q.1, TP.HCM
                    </option>
                    <option value="Zone 03: 45 Lê Duẩn, Hải Châu, Đà Nẵng">
                      Zone 03: 45 Lê Duẩn, Hải Châu, Đà Nẵng
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1.5">KHU VỰC TRẢI NGHIỆM</label>
                  <select
                    value={zoneCategory}
                    onChange={(e) => setZoneCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-400 outline-none"
                  >
                    <option value="Standard Zone Tiêu Chuẩn (STD-01..10) - 12.000đ/h">Standard Zone Tiêu Chuẩn (STD-01..10) - 12.000đ/h</option>
                    <option value="Cyber Pro 540Hz (PRO-01..04) - 18.000đ/h">Cyber Pro 540Hz (PRO-01..04) - 18.000đ/h</option>
                    <option value="Ultra VIP Suite (VIP-01..08) - 22.000đ/h">Ultra VIP Suite (VIP-01..08) - 22.000đ/h</option>
                    <option value="Đấu Trường Arena 5vs5 (ARENA-A1..B5) - 25.000đ/h">Đấu Trường Arena 5vs5 (ARENA-A1..B5) - 25.000đ/h</option>
                    <option value="Stream Studio Soundproof (STREAM-01..02) - 35.000đ/h">Stream Studio Soundproof (STREAM-01..02) - 35.000đ/h</option>
                    <option value="Couple Sanctuary (COUPLE-01..02) - 45.000đ/h">Couple Sanctuary (COUPLE-01..02) - 45.000đ/h</option>
                    <option value="Console Lounge & PS5 Pro (CONSOLE-01..02) - 79.000đ/h">Console Lounge &amp; PS5 Pro (CONSOLE-01..02) - 79.000đ/h</option>
                    <option value="Billiards Club (BIDA-01..10) - 79.000đ/h">Billiards Club 10 Bàn (BIDA-01..10) - 79.000đ/h</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1.5">SỐ LƯỢNG MÁY / BÀN</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1.5">NGÀY ĐẾN</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1.5">KHUNG GIỜ</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-400 outline-none"
                  >
                    <option value="Ngay bây giờ (Tức thì)">Ngay bây giờ (Tức thì)</option>
                    <option value="13:00 - 17:00">13:00 - 17:00</option>
                    <option value="18:00 - 22:00 (Giờ cao điểm)">18:00 - 22:00 (Giờ cao điểm)</option>
                    <option value="22:00 - 06:00 (Combo cày đêm)">22:00 - 06:00 (Combo cày đêm)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1.5">HỌ TÊN GAME THỦ</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A / Nickname"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1.5">SỐ ĐIỆN THOẠI NHẬN MÃ ĐẶT</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-400 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/30 transition uppercase font-sans mt-2"
              >
                XÁC NHẬN GIỮ CHỖ TỨC THÌ
              </button>
            </form>
          </div>

        </div>

        {/* ══════════ 6. SHOWROOM GEAR & TRẠM MOD PHÍM, ĐỘ TẢN NHIỆT (Ảnh 4) ══════════ */}
        <div id="showroom" className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#08151a] to-slate-900 border border-emerald-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                CYBER ZONE TECH HUB
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white font-gaming leading-tight">
                Showroom Gaming Gear &amp; Trạm Mod Phím, Độ Tản Nhiệt
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trải nghiệm thực tế trước khi sở hữu. Chúng tôi phân phối ủy quyền chính hãng chuột không dây 8000Hz, lót chuột Artisan Nhật Bản, phím cơ HE Hall Effect Rapid Trigger và dịch vụ vệ sinh tra keo tản nhiệt PTM7950 trực tiếp tại sảnh.
              </p>
              
              <div className="grid grid-cols-2 gap-4 font-mono text-xs pt-2">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">build</span>
                    Mod Phím &amp; Lube Switch
                  </span>
                  <span className="text-slate-400 text-[10px] mt-1 block">
                    Cân wire, foam Poron, tune âm thanh creamy
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">mouse</span>
                    Swap Gear Cấp Tốc
                  </span>
                  <span className="text-slate-400 text-[10px] mt-1 block">
                    Thay switch chuột, dán dot skates PTFE trong 15p
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/games"
                  className="text-emerald-400 hover:text-emerald-300 font-bold text-xs inline-flex items-center gap-1.5 transition"
                >
                  <span>Tham quan danh mục sản phẩm Gear • Đặt lịch bảo dưỡng</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* 3 Ảnh gear đúng chuẩn */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=500&q=80"
                alt="Phím cơ custom"
                className="w-full h-44 object-cover rounded-2xl border border-white/10"
              />
              <img
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80"
                alt="Ráp máy tính RGB"
                className="w-full h-44 object-cover rounded-2xl border border-white/10"
              />
              <img
                src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=80"
                alt="Chuột gaming"
                className="w-full h-36 object-cover rounded-2xl border border-white/10 col-span-2"
              />
            </div>

          </div>
        </div>

        {/* ══════════ 7. ĐÁNH GIÁ TỪ HUYỀN THOẠI: FAKER, ĐỘ MIXI & ELON MUSK ══════════ */}
        <div id="khach-hang" className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              CỘNG ĐỒNG GAME THỦ TOÀN CẦU
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white font-gaming">
              Đánh Giá Từ Tuyển Thủ &amp; Nhân Vật Hàng Đầu
            </h2>
            <p className="text-xs text-slate-400">
              Nơi hội tụ những huyền thoại eSports và nhân vật công nghệ có tầm ảnh hưởng lớn nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {/* 1. FAKER */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-red-500/30 space-y-4 hover:border-red-500/60 transition flex flex-col justify-between">
              <div className="text-amber-400 text-xs tracking-widest">★★★★★</div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Màn hình OLED 540Hz và ping mạng 1ms ở Cyber Zone cho độ mượt không tưởng, cảm giác thi đấu chuẩn y hệt như trên sân khấu Chung Kết Thế Giới. Thao tác né chiêu và combo Azir, Orianna hoàn toàn không có độ trễ."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-400 font-bold flex items-center justify-center font-mono text-sm border border-red-500/40">
                  T1
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Faker (Lee Sang-hyeok)</span>
                    <span className="text-cyan-400 text-xs">✓</span>
                  </div>
                  <div className="text-[10px] text-red-400 font-mono">
                    Đội trưởng T1 • 5 Lần Vô Địch CKTG LoL
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ĐỘ MIXI */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-amber-500/30 space-y-4 hover:border-amber-500/60 transition flex flex-col justify-between">
              <div className="text-amber-400 text-xs tracking-widest">★★★★★</div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Từ ngày ghé Cyber Zone bắn CS2 với anh em Bộ Tộc, máy mượt quá sấy toàn vào mồm! Phòng Stream Studio cách âm kín đét không sợ ồn, còn quả mì trộn tóp mỡ trứng lòng đào thì ngon nhức cái nách anh em ạ!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-mono text-sm border border-amber-500/40">
                  ĐM
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Độ Mixi (Phùng Thanh Độ)</span>
                    <span className="text-cyan-400 text-xs">✓</span>
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono">
                    Tộc Trưởng MixiGaming • Streamer Top 1
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ELON MUSK */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 space-y-4 hover:border-cyan-500/60 transition flex flex-col justify-between">
              <div className="text-amber-400 text-xs tracking-widest">★★★★★</div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Đây quả thật là công nghệ vượt xa tầm vũ trụ! Hạ tầng mạng 10Gbps Multi-ISP Trunk và hệ thống làm mát tản nhiệt đối lưu ở Cyber Zone đỉnh cao không khác gì kỹ thuật tên lửa Falcon 9 của SpaceX."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center font-mono text-sm border border-cyan-500/40">
                  X
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Elon Musk</span>
                    <span className="text-cyan-400 text-xs">✓</span>
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    CEO Tesla, SpaceX &amp; xAI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ 8. CALL TO ACTION CUỐI CÙNG (Ảnh 5) ══════════ */}
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 text-center space-y-6">
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
            SẴN SÀNG CHO CUỘC ĐẤU TIẾP THEO?
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white font-gaming max-w-3xl mx-auto leading-tight">
            BƯỚC VÀO THẾ GIỚI CYBER ZONE • NHẬN NGAY ƯU ĐÃI GIỜ CHƠI ĐẦU TIÊN
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto">
            Đăng ký tài khoản hội viên trực tiếp hoặc liên hệ Hotline đặt máy nhanh 1900 8888 phục vụ liên tục 24/7.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="#dat-cho"
              className="px-8 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/30 transition"
            >
              ĐẶT MÁY GIỮ CHỖ NGAY
            </a>
            <a
              href="tel:19008888"
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <span className="text-emerald-400">📞</span>
              <span>HOTLINE: 1900 8888</span>
            </a>
          </div>
        </div>

      </div>

      {/* ══════════ FOOTER ESPORTS ĐẲNG CẤP DOANH NGHIỆP (Ảnh 5) ══════════ */}
      <footer className="border-t border-white/10 bg-black/60 pt-16 pb-8 px-4 text-xs text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-black text-lg">
                CZ
              </div>
              <span className="text-xl font-black text-white font-gaming">
                CYBER<span className="text-emerald-400">ZONE</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Tổ hợp giải trí eSports chuẩn thi đấu IESF, Billiards Lounge nghệ thuật và dịch vụ F&amp;B cao cấp 24/7 hàng đầu khu vực.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 flex items-center justify-center transition border border-white/10 font-bold">f</span>
              <span className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 flex items-center justify-center transition border border-white/10 font-bold">TT</span>
              <span className="w-8 h-8 rounded-lg bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 flex items-center justify-center transition border border-white/10 font-bold">YT</span>
              <span className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 flex items-center justify-center transition border border-white/10 font-bold">DC</span>
            </div>
          </div>

          {/* Cột 2: Phân khu & Dịch vụ */}
          <div className="space-y-3 font-mono">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-sans">
              PHÂN KHU TRẢI NGHIỆM
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#phan-khu" className="hover:text-emerald-400 transition">› Đấu Trường Thi Đấu Main Arena</a></li>
              <li><a href="#phan-khu" className="hover:text-emerald-400 transition">› Khu Máy Cyber Pro 540Hz</a></li>
              <li><a href="#phan-khu" className="hover:text-emerald-400 transition">› Billiards Lounge 10 Bàn Aileex</a></li>
              <li><a href="#phan-khu" className="hover:text-emerald-400 transition">› Private Console Suite PS5 Pro</a></li>
              <li><a href="#showroom" className="hover:text-emerald-400 transition">› Showroom Phụ Kiện Gaming Gear</a></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ & Khách hàng */}
          <div className="space-y-3 font-mono">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-sans">
              HỖ TRỢ &amp; HỘI VIÊN
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/auth" className="hover:text-emerald-400 transition">› Chính Sách Hạng VIP &amp; Nạp Thẻ</Link></li>
              <li><a href="#bang-gia" className="hover:text-emerald-400 transition">› Biểu Phí Dịch Vụ Giờ Chơi</a></li>
              <li><a href="#dat-cho" className="hover:text-emerald-400 transition">› Đặt Chỗ Nhóm Thi Đấu &amp; Clan</a></li>
              <li><Link href="/auth" className="hover:text-emerald-400 transition">› Đăng Ký Tài Khoản Tân Thủ</Link></li>
              <li><span className="text-amber-400">🎧 CSKH 24/7: 1900 8888</span></li>
            </ul>
          </div>

          {/* Cột 4: Hệ thống cơ sở */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              HỆ THỐNG CƠ SỞ
            </h4>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-[11px]">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span>📍 FLAGSHIP COMPLEX TP. VINH</span>
              </div>
              <div className="text-slate-300">182 Lê Duẩn, P. Bến Thủy, TP. Vinh (Gần Đại học Vinh)</div>
              <div className="text-slate-400 font-mono text-[10px]">Thời gian: Mở cửa 24/7 (Có bãi đỗ ô tô)</div>
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Đối tác phần cứng chính thức: <span className="text-cyan-400 font-bold">ASUS ROG</span> • <span className="text-emerald-400 font-bold">MSI</span> • <span className="text-purple-400 font-bold">ZOWIE</span>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500 font-mono">
          <div>
            © 2026 <span className="text-white font-bold">CYBER ZONE COMPLEX</span>. All Rights Reserved.
          </div>
          <div className="text-slate-400">
            Đồ án Web Quản Lý Phòng Net Cyber • <span className="text-emerald-400 font-bold">Nhóm 4 Thành Viên</span>
          </div>
        </div>
      </footer>

      {/* MODAL YÊU CẦU ĐĂNG NHẬP */}
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultTab="login"
        message={authModalMessage}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setCustomerName(user.fullName);
          setPhone(user.phone);
        }}
      />

    </div>
  );
}
