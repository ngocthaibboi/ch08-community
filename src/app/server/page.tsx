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
  updateStationAndRate,
  WALLET_EVENT_NAME,
} from '@/lib/walletStore';

// Cấu hình 6 phân khu chuẩn xác theo trang chủ
interface ZoneCategory {
  id: 'ALL' | 'STANDARD' | 'PRO' | 'VIP' | 'ARENA' | 'COUPLE_STREAM' | 'CONSOLE_BIDA';
  name: string;
  badge: string;
  colorName: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  icon: string;
  description: string;
  standardSpec: {
    cpu: string;
    gpu: string;
    screen: string;
    defaultRate: string;
  };
}

const SIX_ZONES_CONFIG: ZoneCategory[] = [
  {
    id: 'STANDARD',
    name: 'Standard Zone Tiêu Chuẩn',
    badge: '10 MÁY • STD-01..10',
    colorName: 'sky',
    accentBg: 'bg-sky-500/10',
    accentBorder: 'border-sky-500/40',
    accentText: 'text-sky-400',
    icon: 'desktop_windows',
    description: 'Khu máy công cộng tiêu chuẩn, tối ưu eSports đối kháng CS2, Valorant, LMHT, FO4.',
    standardSpec: {
      cpu: 'Core i5 13400F (10 Cores)',
      gpu: 'RTX 4060 Ti 8GB OC',
      screen: 'ASUS TUF 24.5" Fast-IPS 280Hz',
      defaultRate: '12.000đ/h',
    },
  },
  {
    id: 'PRO',
    name: 'Cyber Pro 540Hz Try-Hard',
    badge: '4 MÁY • PRO-01..04',
    colorName: 'emerald',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/40',
    accentText: 'text-emerald-400',
    icon: 'bolt',
    description: 'Khu vực thi đấu FPS cao cấp, BenQ Zowie 540Hz DyAc+, phím cơ Wooting 60HE Rapid Trigger, ghế Herman Miller.',
    standardSpec: {
      cpu: 'AMD Ryzen 7 7800X3D Gaming King',
      gpu: 'RTX 4080 Super 16GB',
      screen: 'BenQ Zowie XL2566K 540Hz DyAc+',
      defaultRate: '18.000đ/h',
    },
  },
  {
    id: 'VIP',
    name: 'Phòng Riêng Ultra VIP Tầng 2',
    badge: '8 MÁY • VIP-01..08',
    colorName: 'amber',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/40',
    accentText: 'text-amber-400',
    icon: 'workspace_premium',
    description: 'Dãy phòng VIP riêng biệt cách âm 45dB, ghế da Nappa ngả 160°, chuột Zowie EC2-CW không dây, bàn phím Akko Lube.',
    standardSpec: {
      cpu: 'Core i7 14700K 20 Cores',
      gpu: 'RTX 4070 Ti Super 16GB',
      screen: 'ASUS ROG Swift 27" 240Hz Fast-IPS',
      defaultRate: '22.000đ/h',
    },
  },
  {
    id: 'ARENA',
    name: 'Đấu Trường 5vs5 Chuẩn IESF',
    badge: '10 MÁY • ARENA-A & B',
    colorName: 'rose',
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/40',
    accentText: 'text-rose-400',
    icon: 'swords',
    description: 'Sàn đấu đối kháng 5vs5 chuyên nghiệp (Đội Xanh A1..A5 vs Đội Đỏ B1..B5), đường truyền cáp quang riêng biệt 1ms.',
    standardSpec: {
      cpu: 'Core i9 14900K Flagship',
      gpu: 'RTX 4090 24GB OC Gaming',
      screen: 'ROG Swift Pro OLED 540Hz Kỷ Lục',
      defaultRate: '25.000đ/h',
    },
  },
  {
    id: 'COUPLE_STREAM',
    name: 'Couple Suite & Phòng Stream 4K',
    badge: '4 PHÒNG • COUPLE & STREAM',
    colorName: 'purple',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/40',
    accentText: 'text-purple-300',
    icon: 'favorite',
    description: 'Phòng đôi hẹn hò Sofa Nappa ngả 180° riêng tư + Phòng Stream Studio cách âm tuyệt đối Shure SM7B & Cam 4K.',
    standardSpec: {
      cpu: 'Core i7 14700K Dual System',
      gpu: 'RTX 4070 Super x2 / Card 4K60 Pro',
      screen: 'Dual Samsung Odyssey G7 240Hz Cong',
      defaultRate: '35.000đ - 45.000đ/h',
    },
  },
  {
    id: 'CONSOLE_BIDA',
    name: 'Console Lounge PS5 & Bida Club',
    badge: '6 BÀN/PHÒNG • PS5 & BIDA',
    colorName: 'blue',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/40',
    accentText: 'text-blue-400',
    icon: 'sports_esports',
    description: 'Phòng PS5 Pro OLED 75" 4K 120Hz Dolby Atmos + Billiards Club 4 bàn Aileex King 9020 Pool & Carom 3 băng.',
    standardSpec: {
      cpu: 'PS5 Pro + Bàn Aileex King 9020',
      gpu: 'Custom RDNA 3 Pro / Đá 3 tấm Bỉ',
      screen: 'LG OLED 75" 4K / Bi Aramith Pro',
      defaultRate: '79.000đ/h',
    },
  },
];

function getZoneIdForSeat(seat: BaseSeat): ZoneCategory['id'] {
  const id = seat.id.toUpperCase();
  if (id.startsWith('STD-')) return 'STANDARD';
  if (id.startsWith('PRO-')) return 'PRO';
  if (id.startsWith('VIP-')) return 'VIP';
  if (id.startsWith('ARENA-')) return 'ARENA';
  if (id.startsWith('COUPLE-') || id.startsWith('STREAM-')) return 'COUPLE_STREAM';
  if (id.startsWith('CONSOLE-') || id.startsWith('BIDA-')) return 'CONSOLE_BIDA';
  return 'STANDARD';
}

function parseDefaultRate(priceStr: string): number {
  const digits = priceStr.replace(/\D/g, '');
  const parsed = parseInt(digits, 10);
  return isNaN(parsed) || parsed <= 0 ? 15000 : parsed;
}

export default function MainServerPage() {
  const [bookings, setBookings] = useState<SeatBooking[]>([]);
  const [staffRequests, setStaffRequests] = useState<StaffRequest[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [topupRev, setTopupRev] = useState(0);
  const [fnbRev, setFnbRev] = useState(0);

  // Bộ lọc theo 6 Phân Khu
  const [selectedZone, setSelectedZone] = useState<ZoneCategory['id']>('ALL');
  // Bộ lọc trạng thái máy
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'ONLINE' | 'BOOKED' | 'BIDA'>('ALL');

  // Máy trạm đang được chọn để quản trị & xem chi tiết
  const [selectedSeat, setSelectedSeat] = useState<BaseSeat | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Đơn giá tùy chỉnh cho từng máy (lưu localStorage)
  const [customSeatRates, setCustomSeatRates] = useState<Record<string, number>>({});
  const [customRateInput, setCustomRateInput] = useState('');

  // Nạp tiền tùy chỉnh cho máy được chọn
  const [customTopupInput, setCustomTopupInput] = useState('');

  // Âm thanh chuông cảnh báo quầy lễ tân
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevReqCountRef = useRef(0);
  const prevBookingCountRef = useRef(0);

  // Hệ thống phát loa toàn quán (PA Broadcast)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [activeBroadcast, setActiveBroadcast] = useState<string | null>(null);

  // Tin nhắn riêng gửi trực tiếp xuống màn hình máy
  const [directMessageText, setDirectMessageText] = useState('');
  const [sentMessageToast, setSentMessageToast] = useState<string | null>(null);

  // Hàm phát chuông đôi Ding-Dong bằng Web Audio API thuần
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
      // Audio autoplay check
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

    // Lấy bảng giá tùy chỉnh từ localStorage
    if (typeof window !== 'undefined') {
      try {
        const rawRates = localStorage.getItem('CYBER_CUSTOM_SEAT_RATES');
        if (rawRates) setCustomSeatRates(JSON.parse(rawRates));
      } catch {
        // ignore
      }

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

  // Cập nhật giá nhập vào khi chọn máy khác
  useEffect(() => {
    if (selectedSeat) {
      const currentRate = customSeatRates[selectedSeat.id] || parseDefaultRate(selectedSeat.price);
      setCustomRateInput(String(currentRate));
      setCustomTopupInput('');
      setSentMessageToast(null);
    }
  }, [selectedSeat, customSeatRates]);

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

  // NÚT RESET TOÀN BỘ VỀ 0
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
        localStorage.removeItem('CYBER_CUSTOM_SEAT_RATES');
      }
      setActiveBroadcast(null);
      setCustomSeatRates({});
      syncAllData();
      setNotificationMsg(
        '✅ Đã RESET toàn bộ hệ thống về 0! Bây giờ bạn có thể thử đặt máy, gọi món và nạp thẻ từng bước.'
      );
      setTimeout(() => setNotificationMsg(null), 6000);
    }
  };

  // Xử lý cập nhật giá giờ cho máy (mốc sẵn hoặc tự gõ)
  const handleUpdateSeatRate = (seatId: string, newRate: number) => {
    if (isNaN(newRate) || newRate <= 0) {
      alert('Vui lòng chọn hoặc nhập đơn giá giờ hợp lệ!');
      return;
    }
    const updatedRates = { ...customSeatRates, [seatId]: newRate };
    setCustomSeatRates(updatedRates);
    setCustomRateInput(String(newRate));

    if (typeof window !== 'undefined') {
      localStorage.setItem('CYBER_CUSTOM_SEAT_RATES', JSON.stringify(updatedRates));
    }

    // Nếu đây là máy mà khách đang ngồi (VIP-08), cập nhật walletStore và phát event
    const currentW = getStoredWallet();
    if (currentW.pcName === seatId) {
      updateStationAndRate(seatId, selectedSeat?.zoneName || currentW.zoneName, newRate);
    }

    setNotificationMsg(`✅ Đã thiết lập đơn giá máy ${seatId} thành ${newRate.toLocaleString('vi-VN')}đ/h!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Xử lý nạp tiền cho khách tại máy (mốc sẵn hoặc tự gõ)
  const handleTopupForSeat = (seatId: string, amount: number) => {
    if (isNaN(amount) || amount <= 0) {
      alert('Vui lòng chọn hoặc nhập số tiền nạp hợp lệ!');
      return;
    }
    topupWallet(amount, `Quầy Lễ Tân Nạp Cho Máy ${seatId}`);
    playServerChime();
    syncAllData();
    setNotificationMsg(
      `🎉 Nạp thành công +${amount.toLocaleString('vi-VN')}đ cho máy ${seatId}! Đã đồng bộ tức thì vào ví và giờ chơi.`
    );
    setCustomTopupInput('');
    setTimeout(() => setNotificationMsg(null), 5000);
  };

  // Xử lý phát loa toàn quán (PA Broadcast)
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
    setSentMessageToast(`Đã gửi tin nhắn riêng tới máy ${seatId}: "${msg}"`);
    setDirectMessageText('');
    setTimeout(() => setSentMessageToast(null), 4000);
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

  // Lọc danh sách máy theo 6 Phân Khu & Trạng Thái
  const filteredSeats = ALL_SEATS_CONFIG.filter((seat) => {
    // 1. Lọc theo Phân Khu
    if (selectedZone !== 'ALL') {
      const seatZone = getZoneIdForSeat(seat);
      if (seatZone !== selectedZone) return false;
    }

    const booking = bookings.find((b) => b.seatId === seat.id);
    const isBooked = !!booking;
    const isCurrent = seat.id === 'VIP-08';
    const isBida = seat.id.startsWith('BIDA');

    // 2. Lọc theo Trạng Thái
    if (statusFilter === 'AVAILABLE') return !isBooked && !isCurrent;
    if (statusFilter === 'ONLINE') return isCurrent;
    if (statusFilter === 'BOOKED') return isBooked;
    if (statusFilter === 'BIDA') return isBida;

    return true;
  });

  const activeSeatsCount = bookings.length + 1; // 1 máy VIP-08 đang online
  const occupancyPercent = Math.min(100, Math.round((activeSeatsCount / ALL_SEATS_CONFIG.length) * 100));
  const pendingStaffCount = staffRequests.filter((r) => r.status === 'PENDING').length;
  const currentSelectedZoneInfo = SIX_ZONES_CONFIG.find((z) => z.id === selectedZone);

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
                Điều phối 6 phân khu • Tự chỉnh giá máy • Nạp tiền ví khách tại quầy • Phát loa toàn quán
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

      {/* ══════════ 4. BỐ CỤC 2 CỘT: 6 PHÂN KHU & SƠ ĐỒ MÁY (TRÁI) & TIN NHẮN (PHẢI) ══════════ */}
      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CỘT TRÁI (8 CỘT): TÍCH HỢP 6 PHÂN KHU VÀ SƠ ĐỒ MÁY CHI TIẾT */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-[#070e22]/90 border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            
            {/* Header: Tích hợp 6 Phân Khu Trực Quan */}
            <div className="border-b border-white/10 pb-4 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">domain</span>
                    HỆ THỐNG 6 PHÂN KHU PHÒNG MÁY CYBER ZONE
                  </span>
                  <h2 className="text-xl font-black text-white font-gaming mt-0.5">
                    Sơ Đồ Máy Theo Phân Khu &amp; Quản Trị Từ Xa
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Bấm vào phân khu để lọc máy • Bấm vào máy để điều khiển
                </span>
              </div>

              {/* LƯỚI 6 PHÂN KHU CHỌN NHANH */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 font-mono text-xs">
                {/* Nút Xem Tất Cả */}
                <button
                  type="button"
                  onClick={() => setSelectedZone('ALL')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer col-span-2 sm:col-span-3 flex items-center justify-between ${
                    selectedZone === 'ALL'
                      ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-cyan-400 text-white shadow-lg'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-cyan-400 text-xl">apps</span>
                    <div>
                      <span className="font-bold text-white block">TẤT CẢ 6 PHÂN KHU (42 MÁY/BÀN)</span>
                      <span className="text-[10px] text-slate-400">Hiển thị đầy đủ sơ đồ toàn bộ hệ thống</span>
                    </div>
                  </div>
                  <span className="text-cyan-300 font-bold text-xs">42 Vị trí &rarr;</span>
                </button>

                {SIX_ZONES_CONFIG.map((zone) => {
                  const isSelected = selectedZone === zone.id;
                  const zoneSeats = ALL_SEATS_CONFIG.filter((s) => getZoneIdForSeat(s) === zone.id);
                  const bookedInZone = zoneSeats.filter((s) => bookings.some((b) => b.seatId === s.id)).length;
                  const onlineInZone = zoneSeats.filter((s) => s.id === 'VIP-08').length;
                  const busyCount = bookedInZone + onlineInZone;

                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone.id)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? `${zone.accentBg} ${zone.accentBorder} ring-2 ring-cyan-400/50 shadow-lg`
                          : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`material-symbols-outlined text-lg ${zone.accentText}`}>
                          {zone.icon}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${zone.accentBorder} ${zone.accentText}`}>
                          {zone.badge}
                        </span>
                      </div>
                      <div className="font-bold text-white text-xs truncate">{zone.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                        <span>Giá: <strong className="text-emerald-400">{zone.standardSpec.defaultRate}</strong></span>
                        <span className={busyCount > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                          {busyCount > 0 ? `${busyCount} máy bận` : '100% trống'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Banner thông tin chi tiết của phân khu đang chọn */}
              {currentSelectedZoneInfo && (
                <div className={`p-4 rounded-2xl ${currentSelectedZoneInfo.accentBg} border ${currentSelectedZoneInfo.accentBorder} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono animate-fadeIn`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-white uppercase text-sm ${currentSelectedZoneInfo.accentText}`}>
                        {currentSelectedZoneInfo.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">({currentSelectedZoneInfo.badge})</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {currentSelectedZoneInfo.description}
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span>CPU: <strong className="text-white">{currentSelectedZoneInfo.standardSpec.cpu}</strong></span>
                      <span>GPU: <strong className="text-cyan-300">{currentSelectedZoneInfo.standardSpec.gpu}</strong></span>
                      <span>Màn hình: <strong className="text-white">{currentSelectedZoneInfo.standardSpec.screen}</strong></span>
                      <span>Đơn giá chuẩn: <strong className="text-emerald-400">{currentSelectedZoneInfo.standardSpec.defaultRate}</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedZone('ALL')}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition shrink-0 cursor-pointer"
                  >
                    Xem tất cả phân khu &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Bộ lọc trạng thái máy nhanh (Status Filter Pills) */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-slate-500 text-[11px]">Trạng thái máy:</span>
              {[
                { id: 'ALL', label: `Tất cả (${filteredSeats.length})` },
                { id: 'AVAILABLE', label: '🟢 Máy trống' },
                { id: 'ONLINE', label: '🔵 Đang online' },
                { id: 'BOOKED', label: '🟡 Đã đặt trước' },
                { id: 'BIDA', label: '🎱 Bàn Bi-a' },
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

            {/* LƯỚI DANH SÁCH MÁY CỦA PHÂN KHU ĐƯỢC CHỌN */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredSeats.map((seat) => {
                const booking = bookings.find((b) => b.seatId === seat.id);
                const isBooked = !!booking;
                const isCurrent = seat.id === 'VIP-08';
                const isSelected = selectedSeat?.id === seat.id;
                const currentSeatPrice = customSeatRates[seat.id] || parseDefaultRate(seat.price);

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
                      <div className="text-emerald-400 font-bold">
                        {currentSeatPrice.toLocaleString('vi-VN')}đ/h
                      </div>
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
                        <span className="text-[9px] text-emerald-400 font-bold">Đang chơi</span>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-white/5 text-[9px] text-slate-500 font-mono flex items-center justify-between">
                        <span>Sẵn sàng đón khách</span>
                        <span>🔍 Bấm xem</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* ══════════ 5. CHI TIẾT MÁY & BẢNG ĐIỀU KHIỂN / CHỈNH GIÁ / NẠP TIỀN ══════════ */}
          {selectedSeat && (
            <div className="bg-[#070e22] border-2 border-cyan-400/50 rounded-3xl p-6 shadow-2xl font-mono text-xs space-y-5 animate-fadeIn">
              
              {/* Header chi tiết máy */}
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-cyan-400 text-2xl">settings_remote</span>
                  <div>
                    <h3 className="font-gaming font-black text-lg text-white">
                      BẢNG ĐIỀU KHIỂN &amp; CHI TIẾT: {selectedSeat.id} ({selectedSeat.zoneName})
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      Tự thiết lập đơn giá giờ • Nạp tiền ví trực tiếp cho khách • Khóa máy từ xa
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSeat(null)}
                  className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                >
                  ✕ Đóng
                </button>
              </div>

              {/* Thông tin phần cứng chi tiết của máy */}
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
                  <span className="text-[10px] text-slate-400 block uppercase">MÀN HÌNH HIỂN THỊ</span>
                  <span className="text-white font-bold block mt-1">{selectedSeat.screen}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">ĐƠN GIÁ HIỆN TẠI</span>
                  <span className="text-emerald-400 font-bold block mt-1">
                    {(customSeatRates[selectedSeat.id] || parseDefaultRate(selectedSeat.price)).toLocaleString('vi-VN')}đ/h
                  </span>
                </div>
              </div>

              {/* MỤC 1: TỰ CHỈNH GIÁ TIỀN GIỜ CHƠI (THEO MỐC VÀ TỰ NHẬP) */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-400 text-base">tune</span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      THIẾT LẬP ĐƠN GIÁ GIỜ CHƠI CHO MÁY {selectedSeat.id}:
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold">
                    Hiện tại: {(customSeatRates[selectedSeat.id] || parseDefaultRate(selectedSeat.price)).toLocaleString('vi-VN')}đ/h
                  </span>
                </div>

                {/* Các mốc giá gợi ý nhanh */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 block">Chọn nhanh mốc giá có sẵn:</span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {[12000, 15000, 18000, 22000, 25000, 35000, 45000, 79000].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleUpdateSeatRate(selectedSeat.id, rate)}
                        className={`py-1.5 rounded-lg border text-[11px] font-bold transition cursor-pointer text-center ${
                          (customSeatRates[selectedSeat.id] || parseDefaultRate(selectedSeat.price)) === rate
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                            : 'bg-black/40 border-white/10 text-slate-300 hover:border-amber-400'
                        }`}
                      >
                        {rate / 1000}k/h
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ô tự gõ giá tiền tùy ý */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2 items-center">
                  <div className="relative flex-1 w-full">
                    <input
                      type="number"
                      step="1000"
                      min="1000"
                      value={customRateInput}
                      onChange={(e) => setCustomRateInput(e.target.value)}
                      placeholder="Hoặc tự gõ đơn giá giờ mới (VNĐ / giờ)..."
                      className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-400 outline-none"
                    />
                    <span className="absolute right-3 top-2 text-slate-500 text-[11px]">VNĐ/h</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateSeatRate(selectedSeat.id, parseInt(customRateInput, 10))}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-gaming font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    ÁP DỤNG GIÁ MÁY
                  </button>
                </div>
              </div>

              {/* MỤC 2: NẠP TIỀN VÍ CHO KHÁCH (THEO MỐC VÀ TỰ NHẬP SỐ TIỀN) */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-400 text-base">add_card</span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      NẠP TIỀN VÍ CHO KHÁCH TẠI MÁY {selectedSeat.id}:
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-300">
                    Cộng tiền tức thì &amp; thăng hạng hội viên Gamer Pass
                  </span>
                </div>

                {/* Các mốc nạp nhanh */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 block">Chọn nhanh mốc tiền nạp:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[20000, 50000, 100000, 200000, 500000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleTopupForSeat(selectedSeat.id, amt)}
                        className="py-2 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>+{amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}k`}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ô tự nhập số tiền nạp tùy ý */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2 items-center">
                  <div className="relative flex-1 w-full">
                    <input
                      type="number"
                      step="1000"
                      min="1000"
                      value={customTopupInput}
                      onChange={(e) => setCustomTopupInput(e.target.value)}
                      placeholder="Hoặc tự gõ số tiền muốn nạp (VD: 30000, 75000, 150000...)"
                      className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-400 outline-none"
                    />
                    <span className="absolute right-3 top-2 text-slate-500 text-[11px]">VNĐ</span>
                  </div>
                  <button
                    type="button"
                    disabled={!customTopupInput || parseInt(customTopupInput, 10) <= 0}
                    onClick={() => handleTopupForSeat(selectedSeat.id, parseInt(customTopupInput, 10))}
                    className={`w-full sm:w-auto px-5 py-2 rounded-xl font-gaming font-black text-xs transition cursor-pointer ${
                      customTopupInput && parseInt(customTopupInput, 10) > 0
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 hover:brightness-110 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    XÁC NHẬN NẠP VÍ &rarr;
                  </button>
                </div>
              </div>

              {/* MỤC 3: CÁC TÁC VỤ ĐIỀU KHIỂN TỪ XA KHÁC (KHÓA, REBOOT, NHẮN RIÊNG) */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                  ⚡ TÁC VỤ ĐIỀU KHIỂN TỪ XA KHÁC:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                </div>

                {/* Gửi tin nhắn riêng xuống màn hình máy */}
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
