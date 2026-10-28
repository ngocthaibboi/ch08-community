'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredWallet, WALLET_EVENT_NAME, UserWallet, INITIAL_WALLET } from '@/lib/walletStore';
import { createStaffRequest } from '@/lib/staffRequestStore';

export default function ClientPcPage() {
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_WALLET);
  const [remainingSeconds, setRemainingSeconds] = useState(9912); // ~ 2 giờ 45 phút 12 giây
  const [staffCalled, setStaffCalled] = useState(false);
  const [callReason, setCallReason] = useState('Mang thêm đá lạnh');
  const [showCallModal, setShowCallModal] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // Đồng bộ số dư ví
  useEffect(() => {
    setWallet(getStoredWallet());
    const handleWalletUpdate = () => setWallet(getStoredWallet());
    window.addEventListener(WALLET_EVENT_NAME, handleWalletUpdate);
    window.addEventListener('storage', handleWalletUpdate);
    return () => {
      window.removeEventListener(WALLET_EVENT_NAME, handleWalletUpdate);
      window.removeEventListener('storage', handleWalletUpdate);
    };
  }, []);

  // Đồng hồ đếm ngược thời gian chơi sống động từng giây
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Định dạng thời gian HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Xử lý gọi nhân viên hỗ trợ
  const handleCallStaff = (reason: string) => {
    try {
      createStaffRequest({
        pcName: wallet.pcName || 'VIP-08',
        type: 'EXTRA_SERVICE',
        title: reason,
        details: `Khách máy ${wallet.pcName || 'VIP-08'} yêu cầu: ${reason}`,
      });
      setStaffCalled(true);
      setShowCallModal(false);
      setAlertSuccess(`Đã gửi yêu cầu: "${reason}". Nhân viên quầy đang đến máy bạn ngay!`);
      setTimeout(() => setAlertSuccess(null), 5000);
    } catch {
      setAlertSuccess('Đã gửi tín hiệu tới quầy thu ngân!');
      setTimeout(() => setAlertSuccess(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black pb-16">
      
      {/* ══════════ 1. HUD THỜI GIAN THẬT TRÊN MÁY TRẠM ══════════ */}
      <div className="bg-gradient-to-r from-slate-950 via-[#070e22] to-slate-950 border-b border-emerald-500/30 shadow-2xl py-3 px-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Cụm trái: Thông tin máy & Trạng thái kết nối */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black font-gaming text-lg shadow-lg shadow-emerald-500/20">
              08
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-gaming font-black text-white text-base tracking-wide">
                  MÁY TRẠM: <span className="text-emerald-400">VIP-08</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">
                Phân khu: <strong className="text-cyan-400">Cyber Pro 240Hz</strong> • Mạng LAN 10Gbps
              </span>
            </div>
          </div>

          {/* Cụm giữa: ĐỒNG HỒ ĐẾM NGƯỢC THỜI GIAN CHƠI */}
          <div className="flex items-center gap-3 bg-black/60 border border-white/10 px-4 py-2 rounded-2xl shadow-inner font-mono">
            <span className="material-symbols-outlined text-amber-400 text-[20px] animate-pulse">timer</span>
            <div className="text-center">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-sans font-bold">THỜI GIAN CÒN LẠI</span>
              <span className="text-xl md:text-2xl font-black text-amber-300 font-mono tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                {formatTime(remainingSeconds)}
              </span>
            </div>
            <Link
              href="/auth"
              className="ml-2 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black font-black text-[10px] rounded-lg transition uppercase font-sans tracking-wide"
            >
              + NẠP THÊM
            </Link>
          </div>

          {/* Cụm phải: Số dư ví, Hội viên & Nút gọi nhân viên */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block font-mono">
              <div className="flex items-center justify-end gap-1.5 text-xs">
                <span className="text-slate-300 font-bold">{wallet.userName || 'Nguyễn Văn A'}</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                  HẠNG VÀNG ⭐
                </span>
              </div>
              <div className="text-emerald-400 font-extrabold text-xs">
                Ví khả dụng: {wallet.balance.toLocaleString('vi-VN')}đ
              </div>
            </div>

            <button
              onClick={() => setShowCallModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-rose-500/30 transition transform hover:scale-105"
            >
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span>GỌI NHÂN VIÊN</span>
            </button>
          </div>

        </div>
      </div>

      {/* THÔNG BÁO FLASH NẾU VỪA GỌI NHÂN VIÊN */}
      {alertSuccess && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs flex items-center justify-between shadow-xl animate-bounce">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
              {alertSuccess}
            </span>
            <span className="text-[10px] text-slate-400">Đang phục vụ tận máy</span>
          </div>
        </div>
      )}

      {/* ══════════ 2. MÀN HÌNH KHÁCH TẠI MÁY (DESKTOP CLIENT GATEWAY) ══════════ */}
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        {/* BANNER CHÀO MỪNG GAME THỦ TẠI BÀN */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-[#0c1833] via-[#081224] to-[#040812] border border-white/10 shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent"></div>
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              MÁY ĐÃ ĐĂNG NHẬP THÀNH CÔNG • SẴN SÀNG THI ĐẤU
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-gaming tracking-wide uppercase leading-tight">
              CHÀO MỪNG BẠN TỚI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                CYBER ZONE COMPLEX
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
              Bạn đang sử dụng dàn máy thi đấu <strong className="text-white">VIP-08</strong> với cấu hình Core i7 14700K &amp; RTX 4070 Ti Super 16GB. Mọi nhu cầu gọi đồ ăn, nước uống hoặc hỗ trợ kỹ thuật đều được phục vụ trực tiếp tại máy trong 5-8 phút!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <Link
                href="/menu"
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:brightness-110 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/30 transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
                <span>GỌI ĐỒ ĂN &amp; NƯỚC UỐNG TẬN MÁY</span>
              </Link>
              <Link
                href="/games"
                className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-white font-bold rounded-xl transition flex items-center gap-2 hover:border-cyan-400"
              >
                <span className="material-symbols-outlined text-[18px] text-cyan-400">sports_esports</span>
                <span>MỞ KHO 16 GAME BẢN QUYỀN</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ══════════ 3. 4 NÚT TIỆN ÍCH TRỌNG TÂM CỦA MÁY ══════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Gọi Món Bếp F&B */}
          <Link
            href="/menu"
            className="group p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 hover:border-emerald-500/60 transition-all shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl border border-emerald-500/30">
                  <span className="material-symbols-outlined text-[26px]">restaurant</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-mono text-[9px] font-bold uppercase">
                  BƯNG TẬN BÀN
                </span>
              </div>
              <h3 className="font-gaming font-black text-lg text-white group-hover:text-emerald-400 transition-colors">
                Thực Đơn Bếp F&amp;B
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Mì xào bò xúc xích, Cơm sườn trứng ốp la, Trà sữa trân châu, Sting dâu lạnh. Tự trừ ví và nhân viên mang tận nơi.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono text-emerald-400 font-bold">
              <span>Mở Menu Gọi Món</span>
              <span>&rarr;</span>
            </div>
          </Link>

          {/* Card 2: Kho 16 Game Bản Quyền */}
          <Link
            href="/games"
            className="group p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 hover:border-cyan-500/60 transition-all shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-2xl border border-cyan-500/30">
                  <span className="material-symbols-outlined text-[26px]">sports_esports</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[9px] font-bold uppercase">
                  16 GAME READY
                </span>
              </div>
              <h3 className="font-gaming font-black text-lg text-white group-hover:text-cyan-400 transition-colors">
                Kho Game Bản Quyền
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Khởi động siêu tốc LMHT, Valorant, CS2, Black Myth Wukong, FC Online, PUBG. Bản quyền Steam &amp; Riot cài sẵn.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono text-cyan-400 font-bold">
              <span>Mở Launcher Game</span>
              <span>&rarr;</span>
            </div>
          </Link>

          {/* Card 3: Nạp Giờ Chơi & Ví Thẻ */}
          <Link
            href="/auth"
            className="group p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 hover:border-amber-500/60 transition-all shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-2xl border border-amber-500/30">
                  <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[9px] font-bold uppercase">
                  TỰ ĐỘNG +100%
                </span>
              </div>
              <h3 className="font-gaming font-black text-lg text-white group-hover:text-amber-400 transition-colors">
                Nạp Ví Thẻ Hội Viên
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Quét mã VietQR hoặc chuyển khoản, cộng ngay vào giờ chơi trên máy sau 3 giây. Hưởng chiết khấu thăng hạng VIP.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono text-amber-400 font-bold">
              <span>Nạp Tiền Nhanh</span>
              <span>&rarr;</span>
            </div>
          </Link>

          {/* Card 4: Nút Bấm Gọi Nhân Viên Phục Vụ */}
          <div
            onClick={() => setShowCallModal(true)}
            className="group p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 hover:border-rose-500/60 transition-all shadow-xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-2xl border border-rose-500/30 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">notifications_active</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-[9px] font-bold uppercase">
                  HỖ TRỢ 24/7
                </span>
              </div>
              <h3 className="font-gaming font-black text-lg text-white group-hover:text-rose-400 transition-colors">
                Gọi Nhân Viên Tận Máy
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Nhấn để yêu cầu mang ca đá, đổi tai nghe, kiểm tra mạng hoặc hỗ trợ nạp tiền mặt tại máy chỉ sau 60 giây.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono text-rose-400 font-bold">
              <span>Gửi Tín Hiệu Gọi</span>
              <span>🛎️</span>
            </div>
          </div>

        </div>

        {/* ══════════ 4. BẢNG THÔNG SỐ PHẦN CỨNG & ĐẶC QUYỀN HẠNG VÀNG ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Cột trái: Cấu hình phần cứng máy */}
          <div className="lg:col-span-7 bg-[#070d1e]/80 border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">TELEMETRY PHÒNG MÁY</span>
                <h3 className="text-xl font-black text-white font-gaming mt-0.5">Cấu Hình Phần Cứng Máy VIP-08</h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                Tối Ưu 240FPS Ultra
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">VI XỬ LÝ (CPU)</span>
                <span className="font-bold text-white block">Intel Core i7 14700K (20 Cores)</span>
                <span className="text-[10px] text-emerald-400 block">Nhiệt độ: 48°C • Tải 24%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">CARD ĐỒ HỌA (GPU)</span>
                <span className="font-bold text-cyan-400 block">NVIDIA RTX 4070 Ti Super 16GB</span>
                <span className="text-[10px] text-slate-400 block">Driver: Game Ready 565.90</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">MÀN HÌNH CHUYÊN GAME</span>
                <span className="font-bold text-white block">ASUS ROG Swift 27" 240Hz Fast-IPS</span>
                <span className="text-[10px] text-emerald-400 block">Độ phản hồi 0.03ms G-Sync</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">GEAR THI ĐẤU</span>
                <span className="font-bold text-purple-400 block">Zowie EC2-CW + Akko Custom Box</span>
                <span className="text-[10px] text-slate-400 block">Tai nghe HyperX Cloud II Pro</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Đặc quyền thẻ VIP Hạng Vàng */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1730] to-[#060b18] border border-amber-500/30 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">HỘI VIÊN CAO CẤP</span>
                <h3 className="text-xl font-black text-white font-gaming mt-0.5">Thẻ Gamer Pass: GOLD</h3>
              </div>
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
                ⭐
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400">Giảm giá tiền giờ chơi:</span>
                <span className="text-amber-400 font-bold">-10% (Chỉ 13.500đ/h)</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400">Giảm giá món ăn F&amp;B:</span>
                <span className="text-emerald-400 font-bold">-5% toàn menu Bếp</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400">Ưu tiên phục vụ:</span>
                <span className="text-cyan-400 font-bold">Ưu tiên nhận món &lt; 5 phút</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400">Tiến trình lên KIM CƯƠNG:</span>
                <span className="text-white font-bold">65% (Cần nạp thêm 300k)</span>
              </div>
            </div>

            <Link
              href="/auth"
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs font-mono text-center block transition uppercase tracking-wider"
            >
              NÂNG HẠNG KIM CƯƠNG (GIẢM 20%) &rarr;
            </Link>
          </div>

        </div>

      </div>

      {/* ══════════ MODAL GỌI NHÂN VIÊN PHỤC VỤ ══════════ */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">GỌI NHÂN VIÊN PHÒNG MÁY</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Gửi tín hiệu từ máy VIP-08 tới quầy</span>
                </div>
              </div>
              <button
                onClick={() => setShowCallModal(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <span className="text-slate-400 block text-[11px]">Chọn nhanh yêu cầu hỗ trợ:</span>
              {[
                'Mang thêm 1 ca đá lạnh',
                'Hỗ trợ nạp tiền mặt tại máy',
                'Kiểm tra lại tai nghe / mic thoại',
                'Nhờ nhân viên vệ sinh lại bàn phím',
                'Hỗ trợ kỹ thuật phần mềm / game lag',
              ].map((reason, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCallStaff(reason)}
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/5 text-left text-slate-200 hover:text-rose-300 transition flex items-center justify-between"
                >
                  <span>{reason}</span>
                  <span className="text-[10px] text-rose-400">&rarr;</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-mono font-bold transition"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
