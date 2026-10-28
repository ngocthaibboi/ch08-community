'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ALL_SEATS_CONFIG,
  getStoredBookings,
  cancelBooking,
  clearAllBookings,
  SeatBooking,
  BOOKING_STORAGE_EVENT,
  BaseSeat,
} from '@/lib/bookingStore';
import {
  getStoredStaffRequests,
  resolveStaffRequest,
  clearAllStaffRequests,
  StaffRequest,
  STAFF_REQUEST_EVENT,
} from '@/lib/staffRequestStore';
import {
  getStoredOrders,
  resetOrdersToDefault,
  STORAGE_EVENT_NAME,
} from '@/lib/orderStore';
import {
  getStoredWallet,
  calculateTotalTopupRevenue,
  resetWalletToDefault,
  topupWallet,
  WALLET_EVENT_NAME,
} from '@/lib/walletStore';

export default function MainServerPage() {
  const [bookings, setBookings] = useState<SeatBooking[]>([]);
  const [staffRequests, setStaffRequests] = useState<StaffRequest[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [topupRev, setTopupRev] = useState(0);
  const [fnbRev, setFnbRev] = useState(0);

  // Bộ lọc tầng & bộ lọc trạng thái máy
  const [activeFloor, setActiveFloor] = useState<number | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'ONLINE' | 'BOOKED' | 'BIDA'>('ALL');

  // Máy trạm đang được chọn để quản trị từ xa
  const [selectedSeat, setSelectedSeat] = useState<BaseSeat | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Âm thanh chuông cảnh báo quầy lễ tân
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevReqCountRef = useRef(0);
  const prevBookingCountRef = useRef(0);

  // Hệ thống phát loa toàn quán (PA Broadcast)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [activeBroadcast, setActiveBroadcast] = useState<string | null>(null);

  // Quản trị điều khiển máy trạm từ xa: tin nhắn riêng & nạp tiền
  const [directMessageText, setDirectMessageText] = useState('');
  const [sentMessageToast, setSentMessageToast] = useState<string | null>(null);

  // Hàm phát chuông đôi Ding-Dong bằng Web Audio API thuần (Không cần file mp3 ngoài)
  const playServerChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Chime note 1: E5 (659Hz) -> Chime note 2: A5 (880Hz)
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Bỏ qua nếu trình duyệt chưa kích hoạt audio
    }
  };

  // Đồng bộ tất cả dữ liệu hệ thống thời gian thực
  const syncAllData = () => {
    const currentBookings = getStoredBookings();
    const currentStaffRequests = getStoredStaffRequests();
    const orders = getStoredOrders();
    const topups = calculateTotalTopupRevenue().totalTopup;
    const fnbTotal = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Kích hoạt chuông nếu có yêu cầu gọi nhân viên hoặc đặt máy mới
    if (
      currentStaffRequests.length > prevReqCountRef.current ||
      currentBookings.length > prevBookingCountRef.current
    ) {
      playServerChime();
    }
    prevReqCountRef.current = currentStaffRequests.length;
    prevBookingCountRef.current = currentBookings.length;

    setBookings(currentBookings);
    setStaffRequests(currentStaffRequests);
    setOrdersCount(orders.length);
    setTopupRev(topups);
    setFnbRev(fnbTotal);
    setRevenue(topups + fnbTotal);

    // Kiểm tra tin phát loa đang hoạt động
    if (typeof window !== 'undefined') {
      const bCast = localStorage.getItem('CYBER_ACTIVE_BROADCAST');
      if (bCast) setActiveBroadcast(bCast);
    }
  };

  useEffect(() => {
    syncAllData();
    window.addEventListener(BOOKING_STORAGE_EVENT, syncAllData);
    window.addEventListener(STAFF_REQUEST_EVENT, syncAllData);
    window.addEventListener(STORAGE_EVENT_NAME, syncAllData);
    window.addEventListener(WALLET_EVENT_NAME, syncAllData);
    window.addEventListener('storage', syncAllData);

    return () => {
      window.removeEventListener(BOOKING_STORAGE_EVENT, syncAllData);
      window.removeEventListener(STAFF_REQUEST_EVENT, syncAllData);
      window.removeEventListener(STORAGE_EVENT_NAME, syncAllData);
      window.removeEventListener(WALLET_EVENT_NAME, syncAllData);
      window.removeEventListener('storage', syncAllData);
    };
  }, [soundEnabled]);

  // Xử lý hủy đặt chỗ từ quầy máy chủ
  const handleCancelBooking = (seatId: string) => {
    cancelBooking(seatId);
    setNotificationMsg(`Đã hủy đặt trước cho máy/bàn ${seatId}!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Xử lý duyệt yêu cầu hỗ trợ của nhân viên
  const handleResolveStaffRequest = (id: string) => {
    resolveStaffRequest(id);
    setNotificationMsg('✅ Đã hoàn thành hỗ trợ khách hàng!');
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // NÚT RESET TOÀN BỘ VỀ 0 (Chu trình trải nghiệm mới)
  const handleResetAllToZero = () => {
    if (
      confirm(
        'Bạn có chắc muốn đưa toàn bộ hệ thống về số 0 (0 đơn đặt máy, 0 đơn bếp, 0 yêu cầu, doanh thu 0đ) để bắt đầu chu trình trải nghiệm từ đầu không?'
      )
    ) {
      clearAllBookings();
      clearAllStaffRequests();
      resetOrdersToDefault();
      resetWalletToDefault();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cyber_base_revenue');
        localStorage.removeItem('CYBER_ACTIVE_BROADCAST');
      }
      setActiveBroadcast(null);
      syncAllData();
      setNotificationMsg(
        '✅ Đã RESET toàn bộ hệ thống về 0! Bây giờ bạn có thể thử đặt máy, gọi món và nạp thẻ từng bước.'
      );
      setTimeout(() => setNotificationMsg(null), 6000);
    }
  };

  // Xử lý phát loa toàn quán (Central PA Broadcast)
  const handleDispatchBroadcast = (msg: string) => {
    if (!msg.trim()) return;
    playServerChime();
    setActiveBroadcast(msg.trim());
    if (typeof window !== 'undefined') {
      localStorage.setItem('CYBER_ACTIVE_BROADCAST', msg.trim());
      window.dispatchEvent(new CustomEvent('cyber_broadcast_alert', { detail: msg.trim() }));
    }
    setShowBroadcastModal(false);
    setBroadcastText('');
    setNotificationMsg(`📢 ĐÃ PHÁT LOA TOÀN BỘ 42 MÁY: "${msg.trim()}"`);
    setTimeout(() => setNotificationMsg(null), 6000);
  };

  // Xử lý gửi tin nhắn cảnh báo riêng xuống 1 máy trạm
  const handleSendDirectMessage = (seatId: string) => {
    if (!directMessageText.trim()) return;
    const msg = directMessageText.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem(`CYBER_DIRECT_MSG_${seatId}`, msg);
      window.dispatchEvent(
        new CustomEvent('cyber_client_direct_message', {
          detail: { seatId, message: msg, time: new Date().toLocaleTimeString('vi-VN') },
        })
      );
    }
    setSentMessageToast(`Đã gửi cảnh báo tới máy ${seatId}: "${msg}"`);
    setDirectMessageText('');
    setTimeout(() => setSentMessageToast(null), 4000);
  };

  // Xử lý nạp tiền trực tiếp từ quầy cho máy
  const handleRemoteTopupForSeat = (seatId: string, amt: number) => {
    topupWallet(amt, `Quầy Lễ Tân Nạp Cho Máy ${seatId}`);
    setNotificationMsg(`Đã nạp +${amt.toLocaleString('vi-VN')}đ thành công cho máy ${seatId}!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Xử lý khóa máy từ xa
  const handleRemoteLockSeat = (seatId: string) => {
    if (confirm(`Bạn có chắc muốn KHÓA MÀN HÌNH từ xa máy ${seatId}?`)) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cyber_remote_lock_command', { detail: { seatId } }));
      }
      setNotificationMsg(`🔒 Đã phát tín hiệu KHÓA MÁY ${seatId} từ xa thành công!`);
      setTimeout(() => setNotificationMsg(null), 4000);
    }
  };

  // Xử lý khởi động lại máy từ xa
  const handleRemoteRebootSeat = (seatId: string) => {
    if (confirm(`Gửi lệnh KHỞI ĐỘNG LẠI (Reboot) máy ${seatId}?`)) {
      setNotificationMsg(`🔄 Đang phát lệnh khởi động lại máy ${seatId} qua BootROM LAN...`);
      setTimeout(() => {
        setNotificationMsg(`✅ Máy ${seatId} đã khởi động lại hoàn tất!`);
        setTimeout(() => setNotificationMsg(null), 3000);
      }, 1500);
    }
  };

  // Lọc danh sách máy theo tầng & trạng thái
  const filteredSeats = ALL_SEATS_CONFIG.filter((seat) => {
    // 1. Lọc theo tầng
    if (activeFloor !== 'ALL' && seat.floor !== activeFloor) return false;

    const booking = bookings.find((b) => b.seatId === seat.id);
    const isBooked = !!booking;
    const isCurrent = seat.id === 'VIP-08';
    const isBida = seat.id.startsWith('BIDA');

    // 2. Lọc theo trạng thái
    if (statusFilter === 'AVAILABLE') return !isBooked && !isCurrent;
    if (statusFilter === 'ONLINE') return isCurrent;
    if (statusFilter === 'BOOKED') return isBooked;
    if (statusFilter === 'BIDA') return isBida;

    return true;
  });

  // Tính số lượng máy đang hoạt động (Đang ngồi + Đã đặt)
  const activeSeatsCount = bookings.length + 1; // 1 máy VIP-08 đang online
  const occupancyPercent = Math.min(100, Math.round((activeSeatsCount / ALL_SEATS_CONFIG.length) * 100));
  const pendingStaffCount = staffRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black pb-20">
      
      {/* ══════════ 1. HEADER HUD MÁY CHỦ QUẢN LÝ TRUNG TÂM ══════════ */}
      <div className="bg-gradient-to-r from-slate-950 via-[#07132a] to-slate-950 border-b border-cyan-500/30 p-4 shadow-2xl backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-cyan-500/30">
              <span className="material-symbols-outlined text-[28px]">dns</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-gaming font-black text-xl sm:text-2xl text-white tracking-wide">
                  MÁY CHỦ TRUNG TÂM • QUẦY LỄ TÂN SERVER
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  MASTER NODE ONLINE
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Điều phối toàn bộ 42 máy/bàn • Nhận tin nhắn đặt chỗ realtime • Xử lý gọi phục vụ • Phát loa toàn quán
              </span>
            </div>
          </div>

          {/* Cụm nút Reset, Chuông âm thanh và Thống kê */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Nút bật/tắt chuông */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playServerChime();
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-white/10'
              }`}
              title="Bật/Tắt chuông âm thanh khi có khách đặt bàn hoặc gọi nhân viên"
            >
              <span className="material-symbols-outlined text-sm">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
              <span>{soundEnabled ? 'Chuông: Bật' : 'Chuông: Tắt'}</span>
            </button>

            <button
              onClick={handleResetAllToZero}
              className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/50 font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg cursor-pointer"
              title="Xóa toàn bộ dữ liệu demo về trạng thái trống ban đầu"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>RESET HỆ THỐNG VỀ 0</span>
            </button>
            
            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-white font-mono text-xs font-bold transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-cyan-400">monitoring</span>
              <span>Doanh Thu: {revenue.toLocaleString('vi-VN')}đ</span>
            </Link>
          </div>

        </div>
      </div>

      {/* THÔNG BÁO NOTIFICATION TOÀN HỆ THỐNG */}
      {notificationMsg && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-xs flex items-center justify-between shadow-xl animate-pulse">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-[18px]">info</span>
              {notificationMsg}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">Server Đồng Bộ Tức Thì</span>
          </div>
        </div>
      )}

      {/* ══════════ 2. THANH PHÁT LOA TOÀN QUÁN (PA BROADCAST SYSTEM) ══════════ */}
      <div className="max-w-7xl mx-auto px-4 mt-5">
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#170a2c] via-[#091534] to-[#061e24] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
              <span className="material-symbols-outlined">campaign</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-gaming font-black text-sm tracking-wide">
                  HỆ THỐNG PHÁT LOA TOÀN BỘ PHÒNG MÁY (PA BROADCAST)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold">
                  LIVE AUDIO &amp; POPUP
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {activeBroadcast ? (
                  <span className="text-amber-300 font-bold">Đang phát loa: &quot;{activeBroadcast}&quot;</span>
                ) : (
                  'Phát âm thanh và tin nhắn thông báo khẩn cấp tới 42 máy trạm cùng lúc'
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() =>
                handleDispatchBroadcast('🏆 Giải đấu Custom 5vs5 tại Đấu Trường Arena sẽ khởi tranh sau 15 phút, các tuyển thủ tập trung!')
              }
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-mono font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>🏆 Loa giải đấu</span>
            </button>
            <button
              onClick={() =>
                handleDispatchBroadcast('🍜 Bếp vừa ra lò mẻ Cơm Gà Xối Mỡ da giòn & Mì Cay xá xíu nóng hổi, mời quý khách gọi món tận bàn!')
              }
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>🍜 Giới thiệu món ăn</span>
            </button>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-gaming font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-sm">mic</span>
              <span>TỰ GÕ PHÁT LOA &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════ 3. 4 THẺ THỐNG KÊ TELEMETRY & CÔNG SUẤT REALTIME ══════════ */}
      <div className="max-w-7xl mx-auto px-4 mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Card 1: Công suất phòng máy */}
        <div className="p-4 rounded-2xl bg-[#070e22]/90 border border-emerald-500/30 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>CÔNG SUẤT PHÒNG MÁY</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-gaming">{activeSeatsCount}/42</span>
            <span className="text-emerald-400 text-xs font-bold">({occupancyPercent}%)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, occupancyPercent)}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>{42 - activeSeatsCount} máy trống</span>
            <span className="text-cyan-300 font-bold">2 Bàn Bida Sẵn Sàng</span>
          </div>
        </div>

        {/* Card 2: Doanh thu ca trực */}
        <div className="p-4 rounded-2xl bg-[#070e22]/90 border border-cyan-500/30 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>DOANH THU CA TRỰC</span>
            <span className="material-symbols-outlined text-cyan-400 text-sm">payments</span>
          </div>
          <div className="text-2xl font-black text-cyan-300 font-gaming">
            {revenue.toLocaleString('vi-VN')}đ
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between border-t border-white/5 pt-1.5">
            <span>Nạp thẻ: <strong className="text-white">{topupRev.toLocaleString('vi-VN')}đ</strong></span>
            <span>F&amp;B Bếp: <strong className="text-emerald-400">{fnbRev.toLocaleString('vi-VN')}đ</strong></span>
          </div>
        </div>

        {/* Card 3: Yêu cầu & Điều phối */}
        <div className="p-4 rounded-2xl bg-[#070e22]/90 border border-rose-500/30 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>YÊU CẦU &amp; PHỤC VỤ</span>
            <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold">
              {pendingStaffCount > 0 ? `${pendingStaffCount} CẦN XỬ LÝ` : 'ĐÃ XONG'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-300 font-gaming">
              {pendingStaffCount} Khách Gọi
            </span>
            <span className="text-xs text-amber-300">({bookings.length} Đơn Đặt)</span>
          </div>
          <div className="text-[10px] text-slate-400 border-t border-white/5 pt-1.5 flex justify-between">
            <span>Bếp: {ordersCount} đơn</span>
            <span className="text-cyan-300 font-bold">Âm thanh: {soundEnabled ? 'BẬT' : 'TẮT'}</span>
          </div>
        </div>

        {/* Card 4: Hạ tầng mạng & BootROM */}
        <div className="p-4 rounded-2xl bg-[#070e22]/90 border border-purple-500/30 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>MẠNG BOOTROM LAN</span>
            <span className="text-[10px] text-emerald-400 font-bold">100% OK</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-300 font-gaming">1 ms</span>
            <span className="text-xs text-slate-400">/ 2.5 Gbps Full Duplex</span>
          </div>
          <div className="text-[10px] text-slate-400 border-t border-white/5 pt-1.5 flex justify-between">
            <span>Server Master Node #01</span>
            <span className="text-purple-300 font-bold">iCafe Cloud Ready</span>
          </div>
        </div>
      </div>

      {/* ══════════ 4. BỐ CỤC 2 CỘT: SƠ ĐỒ PHÒNG MÁY (TRÁI) & TIN NHẮN ĐẶT CHỖ (PHẢI) ══════════ */}
      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CỘT TRÁI (8 CỘT): TỔNG HỢP SƠ ĐỒ MÁY TRẠM & BÀN BIDA */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-[#070e22]/90 border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            
            {/* Header thanh lọc phân khu */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                  SƠ ĐỒ TỔNG THỂ TẤT CẢ PHÂN KHU
                </span>
                <h2 className="text-xl font-black text-white font-gaming mt-0.5">
                  Quản Lý Trạng Thái Máy &amp; Bàn Bi-a Realtime
                </h2>
              </div>

              {/* Tabs chọn tầng */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                <button
                  onClick={() => setActiveFloor('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeFloor === 'ALL'
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tất Cả ({ALL_SEATS_CONFIG.length})
                </button>
                <button
                  onClick={() => setActiveFloor(1)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeFloor === 1
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tầng 1 (Arena &amp; Bida)
                </button>
                <button
                  onClick={() => setActiveFloor(2)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeFloor === 2
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tầng 2 (VIP &amp; Pro 540Hz)
                </button>
              </div>
            </div>

            {/* Bộ lọc trạng thái máy nhanh (Status Filter Pills) */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-slate-500 text-[11px]">Lọc theo trạng thái:</span>
              {[
                { id: 'ALL', label: `Tất cả (${ALL_SEATS_CONFIG.length})` },
                { id: 'AVAILABLE', label: `🟢 Trống (${ALL_SEATS_CONFIG.length - activeSeatsCount})` },
                { id: 'ONLINE', label: '🔵 Đang online (1)' },
                { id: 'BOOKED', label: `🟡 Đã đặt trước (${bookings.length})` },
                { id: 'BIDA', label: '🎱 Bàn Bi-a (2)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as 'ALL' | 'AVAILABLE' | 'ONLINE' | 'BOOKED' | 'BIDA')}
                  className={`px-3 py-1 rounded-xl transition text-[11px] font-bold cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm'
                      : 'bg-black/40 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Chú thích màu sắc trạng thái */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 bg-black/40 p-3 rounded-2xl border border-white/5">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Trống (Sẵn sàng)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Đã Đặt Trước Online
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Máy VIP-08 Khách Đang Ngồi
              </span>
              <span className="text-[10px] text-slate-500 ml-auto">
                * Bấm vào máy bất kỳ để điều khiển từ xa
              </span>
            </div>

            {/* LƯỚI DANH SÁCH TẤT CẢ CÁC MÁY */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredSeats.map((seat) => {
                const booking = bookings.find((b) => b.seatId === seat.id);
                const isBooked = !!booking;
                const isCurrent = seat.id === 'VIP-08';
                const isSelected = selectedSeat?.id === seat.id;

                let cardStyle = 'border-white/10 bg-slate-900/80 hover:border-emerald-400 text-slate-300';
                let statusBadge = (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[9px] font-bold">
                    TRỐNG
                  </span>
                );

                if (isCurrent) {
                  cardStyle = 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)] ring-1 ring-cyan-400';
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono text-[9px] font-black">
                      MÁY KHÁCH (ONLINE)
                    </span>
                  );
                } else if (isBooked) {
                  cardStyle = 'border-amber-500 bg-amber-950/40 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono text-[9px] font-black animate-pulse">
                      ĐÃ ĐẶT TRƯỚC
                    </span>
                  );
                }

                if (isSelected) {
                  cardStyle += ' ring-2 ring-emerald-400';
                }

                return (
                  <div
                    key={seat.id}
                    onClick={() => setSelectedSeat(seat)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative group hover:-translate-y-0.5 ${cardStyle}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-gaming font-black text-sm tracking-wide text-white">
                        {seat.id}
                      </span>
                      {statusBadge}
                    </div>

                    <div className="font-mono text-[10px] space-y-0.5">
                      <div className="text-slate-400 truncate">{seat.zoneName}</div>
                      <div className="text-emerald-400 font-bold">{seat.price}</div>
                    </div>

                    {/* Nếu đã được đặt trước thì hiện tên khách */}
                    {isBooked ? (
                      <div className="pt-2 border-t border-amber-500/30 text-[10px] font-mono text-amber-300">
                        <div className="font-bold truncate">👤 {booking.customerName}</div>
                        <div className="text-[9px] text-slate-400">📞 {booking.phone}</div>
                      </div>
                    ) : isCurrent ? (
                      <div className="pt-2 border-t border-cyan-500/30 text-[10px] font-mono text-cyan-300 flex justify-between items-center">
                        <span className="truncate">👤 Nguyễn Văn Thái</span>
                        <span className="text-[9px] text-emerald-400">Đang bật</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

          </div>

          {/* ══════════ CHI TIẾT MÁY & BẢNG ĐIỀU KHIỂN MÁY TỪ XA ══════════ */}
          {selectedSeat && (
            <div className="bg-[#070e22] border-2 border-cyan-400/50 rounded-3xl p-6 shadow-2xl font-mono text-xs space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-cyan-400 text-2xl">settings_remote</span>
                  <div>
                    <h3 className="font-gaming font-black text-lg text-white">
                      BẢNG ĐIỀU KHIỂN TỪ XA: {selectedSeat.id} ({selectedSeat.zoneName})
                    </h3>
                    <span className="text-[10px] text-slate-400">Điều phối, nạp giờ, gửi cảnh báo hoặc khóa máy từ quầy</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSeat(null)}
                  className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                >
                  ✕ Đóng
                </button>
              </div>

              {/* Thông tin phần cứng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">VI XỬ LÝ (CPU)</span>
                  <span className="text-white font-bold block mt-1">{selectedSeat.cpu}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">CARD ĐỒ HỌA (VGA)</span>
                  <span className="text-cyan-400 font-bold block mt-1">{selectedSeat.gpu}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">MÀN HÌNH</span>
                  <span className="text-white font-bold block mt-1">{selectedSeat.screen}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">ĐƠN GIÁ GIỜ</span>
                  <span className="text-emerald-400 font-bold block mt-1">{selectedSeat.price}</span>
                </div>
              </div>

              {/* 4 NÚT QUẢN TRỊ TÁC VỤ ĐỘC QUYỀN TỪ XA */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                  ⚡ TÁC VỤ ĐIỀU KHIỂN TỪ XA (REMOTE CONTROL):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleRemoteLockSeat(selectedSeat.id)}
                    className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">lock</span>
                    <span>Khóa Màn Hình Từ Xa</span>
                  </button>

                  <button
                    onClick={() => handleRemoteRebootSeat(selectedSeat.id)}
                    className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">restart_alt</span>
                    <span>Khởi Động Lại (Reboot)</span>
                  </button>

                  <button
                    onClick={() => handleRemoteTopupForSeat(selectedSeat.id, 50000)}
                    className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">add_card</span>
                    <span>Nạp +50k Cho Máy</span>
                  </button>
                </div>

                {/* Gửi tin nhắn / nhắc nhở riêng xuống màn hình máy này */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={directMessageText}
                      onChange={(e) => setDirectMessageText(e.target.value)}
                      placeholder={`Gõ tin nhắn riêng gửi thẳng xuống màn hình ${selectedSeat.id}... (VD: Món ăn đang mang lên bàn nhé!)`}
                      className="flex-1 bg-black/50 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                    <button
                      onClick={() => handleSendDirectMessage(selectedSeat.id)}
                      disabled={!directMessageText.trim()}
                      className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer shrink-0 ${
                        directMessageText.trim()
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      <span>Gửi Xuống Máy</span>
                    </button>
                  </div>

                  {sentMessageToast && (
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                      ✓ {sentMessageToast}
                    </div>
                  )}
                </div>
              </div>

              {/* Nếu máy này đang có đơn đặt trước */}
              {(() => {
                const booking = bookings.find((b) => b.seatId === selectedSeat.id);
                if (booking) {
                  return (
                    <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="text-amber-300 font-bold">Khách đặt trước: {booking.customerName} ({booking.phone})</div>
                        <div className="text-slate-400 text-[11px]">Khung giờ: {booking.timeSlot} • Mã vé: {booking.bookingCode}</div>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(selectedSeat.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition cursor-pointer"
                      >
                        HỦY GIỮ CHỖ NÀY
                      </button>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}

        </div>

        {/* CỘT PHẢI (4 CỘT): TRUNG TÂM TIN NHẮN & YÊU CẦU REALTIME */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* KHỐI 1: DANH SÁCH TIN NHẮN ĐẶT MÁY ONLINE TỪ KHÁCH HÀNG */}
          <div className="bg-[#070e22]/90 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[20px]">mark_email_unread</span>
                <h3 className="font-gaming font-black text-white text-base">TIN NHẮN ĐẶT BÀN MỚI</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono text-[10px] font-black">
                {bookings.length} ĐƠN
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-8 text-slate-500 font-mono text-xs space-y-2">
                <span className="material-symbols-outlined text-[36px] text-slate-600 block">inbox</span>
                <span>Chưa có khách đặt máy nào.</span>
                <span className="block text-[10px] text-slate-600">Khi khách đặt bàn tại Trang Chủ hoặc Sơ Đồ Máy, thông tin sẽ bay về đây ngay lập tức!</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 font-mono text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-white text-sm">
                        {b.customerName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black">
                        {b.seatId}
                      </span>
                    </div>

                    <div className="text-slate-300 text-[11px] space-y-0.5">
                      <div>📞 SĐT: <strong className="text-white">{b.phone}</strong></div>
                      <div>🕒 Giờ: <strong className="text-amber-400">{b.timeSlot}</strong></div>
                      <div>🎫 Mã vé: <strong className="text-cyan-400">{b.bookingCode}</strong></div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">
                        {new Date(b.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => handleCancelBooking(b.seatId)}
                        className="text-[11px] text-red-400 hover:text-red-300 font-bold transition cursor-pointer"
                      >
                        Hủy đặt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* KHỐI 2: DANH SÁCH YÊU CẦU GỌI NHÂN VIÊN TẬN MÁY */}
          <div className="bg-[#070e22]/90 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-400 text-[20px]">notifications_active</span>
                <h3 className="font-gaming font-black text-white text-base">KHÁCH GỌI NHÂN VIÊN</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-black">
                {pendingStaffCount} CHỜ
              </span>
            </div>

            {pendingStaffCount === 0 ? (
              <div className="text-center py-6 text-slate-500 font-mono text-xs space-y-2">
                <span className="material-symbols-outlined text-[32px] text-slate-600 block">check_circle</span>
                <span>Không có yêu cầu phục vụ nào đang chờ.</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {staffRequests
                  .filter((r) => r.status === 'PENDING')
                  .map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-2 font-mono text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-rose-300 font-gaming text-sm">
                          MÁY: {r.pcName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(r.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-white text-xs">{r.title}</p>
                      <button
                        onClick={() => handleResolveStaffRequest(r.id)}
                        className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition shadow cursor-pointer"
                      >
                        ĐÃ XỬ LÝ XONG &rarr;
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ══════════ MODAL PHÁT LOA TỰ NHẬP NỘI DUNG ══════════ */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#081024] border border-cyan-400/50 rounded-3xl p-6 shadow-2xl space-y-4 font-sans text-slate-100">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400 text-2xl">campaign</span>
                <h3 className="font-gaming font-black text-xl text-white">PHÁT LOA TOÀN BỘ PHÒNG MÁY</h3>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Thông điệp sẽ kích hoạt âm thanh chuông cảnh báo và hiển thị trực tiếp lên toàn bộ 42 màn hình máy trạm.
            </p>

            <textarea
              rows={3}
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="Nhập nội dung phát loa thông báo tới toàn thể khách hàng trong quán..."
              className="w-full bg-slate-950 border border-cyan-500/40 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none resize-none font-mono"
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleDispatchBroadcast(broadcastText)}
                disabled={!broadcastText.trim()}
                className={`flex-1 py-3 rounded-xl font-gaming font-black text-xs uppercase tracking-wide transition ${
                  broadcastText.trim()
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 shadow-lg cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                PHÁT LOA NGAY BÂY GIỜ &rarr;
              </button>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
