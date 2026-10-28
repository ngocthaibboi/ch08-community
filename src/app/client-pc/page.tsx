'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getStoredWallet,
  WALLET_EVENT_NAME,
  UserWallet,
  INITIAL_WALLET,
  updateStationAndRate,
  deductPlayTimeFee,
  topupWallet,
  calculateRemainingPlayTime,
  broadcastWalletUpdate,
} from '@/lib/walletStore';
import { getLoggedInUser, loginUser, logoutUser, AUTH_EVENT_NAME, AuthUser } from '@/lib/authStore';
import { createStaffRequest } from '@/lib/staffRequestStore';

// Cấu hình các loại phòng máy và đơn giá giờ chơi mặc định
interface StationPreset {
  id: string;
  name: string;
  zone: string;
  hourlyRate: number;
  cpu: string;
  gpu: string;
  screen: string;
  gear: string;
  chair: string;
  badge: string;
}

const STATION_PRESETS: StationPreset[] = [
  {
    id: 'VIP-08',
    name: 'Máy Trạm VIP-08',
    zone: 'Phòng Riêng VIP Tầng 2',
    hourlyRate: 22000,
    cpu: 'Intel Core i7 14700K (20 Cores)',
    gpu: 'NVIDIA RTX 4070 Ti Super 16GB',
    screen: 'ASUS ROG Swift 27" 240Hz Fast-IPS',
    gear: 'Zowie EC2-CW + Akko Custom Lube',
    chair: 'Ghế bọc da Nappa ngả 160°',
    badge: 'ULTRA VIP',
  },
  {
    id: 'PRO-01',
    name: 'Khu Thi Đấu PRO-01',
    zone: 'Khu Máy FPS 540Hz Tầng 2',
    hourlyRate: 18000,
    cpu: 'AMD Ryzen 7 7800X3D Gaming King',
    gpu: 'NVIDIA RTX 4080 Super 16GB',
    screen: 'BenQ Zowie XL2566K 540Hz DyAc+',
    gear: 'Razer Viper V3 Pro + Huntsman V3',
    chair: 'Ghế công thái học Herman Miller Embody',
    badge: 'CYBER PRO',
  },
  {
    id: 'STD-01',
    name: 'Máy Tiêu Chuẩn STD-01',
    zone: 'Khu Tiêu Chuẩn Standard Tầng 1',
    hourlyRate: 12000,
    cpu: 'Intel Core i5 13400F (10 Cores)',
    gpu: 'NVIDIA RTX 4060 Ti 8GB OC',
    screen: 'ASUS TUF 24.5" Fast-IPS 280Hz',
    gear: 'Logitech G102 Lightsync + DareU EK87',
    chair: 'Ghế bọc da đúc chống mỏi lưng',
    badge: 'STANDARD',
  },
  {
    id: 'ARENA-A1',
    name: 'Đấu Trường ARENA-A1',
    zone: 'Sàn Đấu 5vs5 Tầng 1 (Đội Xanh)',
    hourlyRate: 25000,
    cpu: 'Intel Core i9 14900K Flagship',
    gpu: 'NVIDIA RTX 4090 24GB OC Gaming',
    screen: 'ROG Swift Pro OLED 540Hz Kỷ Lục',
    gear: 'Wooting 60HE Rapid Trigger + EC2-CW',
    chair: 'Ghế thi đấu chuẩn giải IESF Major',
    badge: 'ARENA 5VS5',
  },
  {
    id: 'STREAM-01',
    name: 'Phòng Stream STREAM-01',
    zone: 'Stream Studio Tầng 2 (Cách Âm)',
    hourlyRate: 35000,
    cpu: 'Dual PC Core i7 14700K + RTX 4080',
    gpu: 'Card Capture 4K60 Pro HDR',
    screen: 'Dual Monitor ROG 27" 2K 240Hz',
    gear: 'GoXLR + Shure SM7B + Sony Cam 4K',
    chair: 'Ghế Streamer Corsair T3 Rush',
    badge: 'STREAM STUDIO',
  },
  {
    id: 'COUPLE-01',
    name: 'Phòng Đôi COUPLE-01',
    zone: 'Couple Suite Tầng 2 (Phòng Riêng)',
    hourlyRate: 45000,
    cpu: 'Intel Core i7 14700K Dual System',
    gpu: 'NVIDIA RTX 4070 Super 12GB x2',
    screen: '2x Samsung Odyssey G7 27" 240Hz Cong',
    gear: 'Sofa Da Nappa Đôi + 2 Tai Nghe Kép',
    chair: 'Sofa giường đôi công thái học ngả 180°',
    badge: 'COUPLE SUITE',
  },
  {
    id: 'CONSOLE-01',
    name: 'Phòng CONSOLE-01',
    zone: 'Console Lounge PS5 Pro Tầng 2',
    hourlyRate: 79000,
    cpu: 'PlayStation 5 Pro + Switch OLED',
    gpu: 'Custom RDNA 3 67WGP Pro Architecture',
    screen: 'LG OLED G3 75" 4K 120Hz Dolby Vision',
    gear: '4 Tay Cầm DualSense Edge + Soundbar Atmos',
    chair: 'Ghế LazyBoy bọc da thư giãn cao cấp',
    badge: 'PS5 PRO LOUNGE',
  },
  {
    id: 'BIDA-01',
    name: 'Bàn Bida BIDA-01',
    zone: 'Billiards Lounge Tầng 1',
    hourlyRate: 79000,
    cpu: 'Bàn Aileex King 9020 Pool Nhập Khẩu',
    gpu: 'Mặt đá tự nhiên 3 tấm phẳng tuyệt đối',
    screen: 'Bóng Aramith Tournament Pro Bỉ',
    gear: 'Cơ Carbon Rhino Pro + Bảng Điểm Điện Tử',
    chair: 'Ghế quầy bar quan sát cao cấp bọc nỉ',
    badge: 'BILLIARDS CLUB',
  },
];

function formatSecondsToHMS(totalSecs: number): string {
  if (totalSecs <= 0) return '00:00:00';
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ClientPcPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_WALLET);
  
  // Trạng thái khóa màn hình: Chưa đăng nhập = Khóa màn hình máy trạm
  const [isLocked, setIsLocked] = useState(true);

  // Trạm máy hiện tại & Giá tiền
  const [currentStation, setCurrentStation] = useState<StationPreset>(STATION_PRESETS[0]);
  const [customRate, setCustomRate] = useState<number>(22000);

  // Đếm ngược thời gian chơi tính bằng giây (HH:MM:SS)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // Form Đăng nhập tại màn hình khóa
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Modal đổi máy & modal setup giá
  const [showStationModal, setShowStationModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [newRateInput, setNewRateInput] = useState('22000');

  // Gọi nhân viên
  const [showCallModal, setShowCallModal] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // Khởi tạo và đồng bộ
  useEffect(() => {
    const user = getLoggedInUser();
    const storedWallet = getStoredWallet();

    setWallet(storedWallet);
    setCurrentUser(user);

    // Tìm máy hiện tại theo wallet hoặc mặc định VIP-08
    const matched = STATION_PRESETS.find((s) => s.id === storedWallet.pcName) || STATION_PRESETS[0];
    setCurrentStation(matched);
    const initialRate = storedWallet.hourlyRate || matched.hourlyRate;
    setCustomRate(initialRate);
    setNewRateInput(String(initialRate));

    // Khởi tạo số giây chơi còn lại
    if (storedWallet.balance > 0 && initialRate > 0) {
      const secs = Math.floor((storedWallet.balance / initialRate) * 3600);
      setRemainingSeconds(secs);
    }

    // Nếu đã đăng nhập và có tiền ví > 0 thì mở khóa máy
    if (user && storedWallet.balance > 0) {
      setIsLocked(false);
    } else {
      setIsLocked(true);
    }

    const handleSync = () => {
      const u = getLoggedInUser();
      const w = getStoredWallet();
      setCurrentUser(u);
      setWallet(w);
    };

    window.addEventListener(WALLET_EVENT_NAME, handleSync);
    window.addEventListener(AUTH_EVENT_NAME, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(WALLET_EVENT_NAME, handleSync);
      window.removeEventListener(AUTH_EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Đếm ngược từng giây khi máy trạm đã mở khóa
  useEffect(() => {
    if (isLocked) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsLocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked]);

  // Xử lý đăng nhập mở máy tại chỗ
  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Vui lòng nhập tên tài khoản và mật khẩu hội viên!');
      return;
    }

    const currentW = getStoredWallet();
    const balanceToUse = currentW.balance > 0 ? currentW.balance : 200000;

    const userObj: AuthUser = {
      id: `usr-${Date.now()}`,
      username: loginUsername.trim(),
      fullName: loginUsername.toLowerCase().includes('thai') ? 'Nguyễn Văn Thái' : loginUsername.trim(),
      phone: '0988.888.888',
      userTier: 'HỘI VIÊN VÀNG ⭐',
      balance: balanceToUse,
    };

    loginUser(userObj);
    updateStationAndRate(currentStation.id, currentStation.zone, customRate);

    const secs = Math.floor((balanceToUse / customRate) * 3600);
    setRemainingSeconds(secs);
    setIsLocked(false);
    setLoginError(null);
    setAlertSuccess(`Chào mừng ${userObj.fullName}! Máy ${currentStation.id} đã mở khóa thành công. Thời gian: ${formatSecondsToHMS(secs)}`);
    setTimeout(() => setAlertSuccess(null), 4000);
  };

  // Nút đăng nhập nhanh cho Thái diễn tập
  const handleQuickDemoLogin = (name: string, demoBalance: number = 200000) => {
    const userObj: AuthUser = {
      id: `demo-${Date.now()}`,
      username: 'thaibboi',
      fullName: name,
      phone: '0912.888.999',
      userTier: 'HỘI VIÊN VÀNG ⭐',
      balance: demoBalance,
    };

    loginUser(userObj);
    const updatedWallet = topupWallet(demoBalance - wallet.balance, 'MÔ PHỎNG NẠP MÁY');
    setWallet(updatedWallet);
    updateStationAndRate(currentStation.id, currentStation.zone, customRate);

    const secs = Math.floor((demoBalance / (customRate || currentStation.hourlyRate)) * 3600);
    setRemainingSeconds(secs);
    setIsLocked(false);
    setAlertSuccess(`Đã mở khóa máy ${currentStation.id} với tài khoản Trưởng nhóm Thái (${demoBalance.toLocaleString('vi-VN')}đ • ${formatSecondsToHMS(secs)})!`);
    setTimeout(() => setAlertSuccess(null), 4000);
  };

  // Khóa máy / Đăng xuất
  const handleLockClient = () => {
    if (confirm(`Bạn có chắc muốn đăng xuất và khóa máy trạm ${currentStation.id}?`)) {
      setIsLocked(true);
      logoutUser();
    }
  };

  // Xử lý chuyển đổi phòng máy với công thức quy đổi tiền và giờ tỷ lệ thuận
  const handleChangeStation = (preset: StationPreset) => {
    const oldStation = currentStation;
    const oldRate = customRate > 0 ? customRate : oldStation.hourlyRate;

    // 1. Số tiền còn lại tại thời điểm bấm chuyển phòng
    const currentMoney = remainingSeconds > 0
      ? (remainingSeconds / 3600) * oldRate
      : wallet.balance;

    // 2. Tính số giây tương ứng tại phòng máy mới
    const newRate = preset.hourlyRate;
    const newSeconds = Math.max(0, Math.floor((currentMoney / newRate) * 3600));

    // 3. Cập nhật state máy, đơn giá và số giây đếm ngược mới
    setCurrentStation(preset);
    setCustomRate(newRate);
    setNewRateInput(String(newRate));
    setRemainingSeconds(newSeconds);

    // 4. Cập nhật đồng bộ vào walletStore và localStorage
    const updatedWallet = updateStationAndRate(preset.id, preset.zone, newRate);
    const roundedMoney = Math.round(currentMoney);
    if (updatedWallet.balance !== roundedMoney) {
      updatedWallet.balance = roundedMoney;
      broadcastWalletUpdate(updatedWallet);
    }
    setWallet(updatedWallet);
    setShowStationModal(false);

    // 5. Hiển thị thông báo chi tiết
    const oldTimeStr = formatSecondsToHMS(remainingSeconds);
    const newTimeStr = formatSecondsToHMS(newSeconds);
    setAlertSuccess(
      `⚡ ĐỔI PHÒNG THÀNH CÔNG: Chuyển từ [${oldStation.id}] (${oldRate.toLocaleString('vi-VN')}đ/h) sang [${preset.id}] (${newRate.toLocaleString('vi-VN')}đ/h). Số tiền bảo lưu: ${roundedMoney.toLocaleString('vi-VN')}đ. Giờ chơi chuyển đổi: ${oldTimeStr} ➔ ${newTimeStr}!`
    );
    setTimeout(() => setAlertSuccess(null), 7000);
  };

  // Xử lý setup giá tiền mới
  const handleSaveCustomRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseInt(newRateInput, 10);
    if (isNaN(rateNum) || rateNum < 1000) {
      alert('Vui lòng nhập giá tiền giờ hợp lệ (tối thiểu 1.000đ)!');
      return;
    }

    const oldRate = customRate > 0 ? customRate : currentStation.hourlyRate;
    const currentMoney = remainingSeconds > 0 ? (remainingSeconds / 3600) * oldRate : wallet.balance;
    const newSeconds = Math.max(0, Math.floor((currentMoney / rateNum) * 3600));

    setCustomRate(rateNum);
    setRemainingSeconds(newSeconds);
    updateStationAndRate(currentStation.id, currentStation.zone, rateNum);
    setShowRateModal(false);

    const oldTimeStr = formatSecondsToHMS(remainingSeconds);
    const newTimeStr = formatSecondsToHMS(newSeconds);
    setAlertSuccess(
      `⚡ ĐÃ SETUP ĐƠN GIÁ MỚI: ${rateNum.toLocaleString('vi-VN')}đ/h. Giờ chơi tự động quy đổi: ${oldTimeStr} ➔ ${newTimeStr}!`
    );
    setTimeout(() => setAlertSuccess(null), 6000);
  };

  // Mô phỏng trừ tiền theo thời gian chơi (Để Thái trình bày thuyết trình)
  const handleSimulatePlayTime = (minutes: number) => {
    const deductSeconds = minutes * 60;
    if (remainingSeconds < deductSeconds) {
      alert(`Thời gian chơi còn lại không đủ ${minutes} phút! Vui lòng nạp thêm tiền.`);
      return;
    }

    const fee = Math.round((customRate / 60) * minutes);
    const res = deductPlayTimeFee(
      fee,
      currentStation.id,
      `Trừ tiền chơi ${minutes} phút tại ${currentStation.id} (${customRate.toLocaleString('vi-VN')}đ/h)`
    );

    const newSecs = Math.max(0, remainingSeconds - deductSeconds);
    setRemainingSeconds(newSecs);

    if (res.success) {
      setWallet(res.wallet);
      setAlertSuccess(
        `⚡ ĐÃ TRỪ GIỜ CHƠI: -${minutes} phút (-${fee.toLocaleString('vi-VN')}đ tại ${customRate.toLocaleString('vi-VN')}đ/h). Thời gian mới: ${formatSecondsToHMS(newSecs)}`
      );
      setTimeout(() => setAlertSuccess(null), 6000);
    }
  };

  // Nạp nhanh tiền để demo
  const handleQuickAddMoney = (amount: number) => {
    const updated = topupWallet(amount, 'Nạp Nhanh Diễn Tập');
    setWallet(updated);
    const addedSeconds = Math.floor((amount / (customRate || currentStation.hourlyRate)) * 3600);
    setRemainingSeconds((prev) => prev + addedSeconds);
    setAlertSuccess(
      `+ ĐÃ NẠP +${amount.toLocaleString('vi-VN')}đ! Cộng thêm +${formatSecondsToHMS(addedSeconds)} vào đồng hồ đếm ngược.`
    );
    setTimeout(() => setAlertSuccess(null), 5000);
  };

  // Xử lý gọi nhân viên
  const handleCallStaff = (reason: string) => {
    try {
      createStaffRequest({
        pcName: currentStation.id,
        type: 'EXTRA_SERVICE',
        title: reason,
        details: `Khách máy ${currentStation.id} (${currentStation.name}) yêu cầu: ${reason}`,
      });
      setShowCallModal(false);
      setAlertSuccess(`Đã gửi yêu cầu: "${reason}". Nhân viên đang đến máy bạn ngay!`);
      setTimeout(() => setAlertSuccess(null), 5000);
    } catch {
      setAlertSuccess('Đã gửi tín hiệu tới quầy thu ngân!');
      setTimeout(() => setAlertSuccess(null), 4000);
    }
  };

  // Tính số dư khả dụng thực tế theo thời gian đếm ngược
  const liveBalance = Math.max(0, Math.round((remainingSeconds / 3600) * (customRate || currentStation.hourlyRate)));

  // ════════════════════════════════════════════════════════════════════════════
  // GIAO DIỆN 1: MÀN HÌNH KHÓA MÁY TRẠM (CYBER CLIENT LOCK SCREEN)
  // Bắt buộc phải đăng nhập thì mới mở khóa được máy
  // ════════════════════════════════════════════════════════════════════════════
  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans select-none">
        {/* Nền hiệu ứng Cyberpunk */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950 to-black pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Màn hình khóa */}
        <div className="relative z-10 max-w-6xl mx-auto w-full flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20">
              CZ
            </div>
            <div>
              <span className="font-gaming font-black text-xl text-white tracking-wider block">
                CYBER<span className="text-emerald-400">ZONE</span> CLIENT OS
              </span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase block -mt-0.5">
                SMART GAMING STATION • v2.6 PRO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={() => setShowStationModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">sync_alt</span>
              <span>Đổi máy trạm: <strong>{currentStation.id}</strong></span>
            </button>
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span> MÁY ĐANG KHÓA
            </span>
          </div>
        </div>

        {/* Nội dung trung tâm: Cửa sổ Đăng nhập mở máy */}
        <div className="relative z-10 max-w-md w-full mx-auto my-auto py-8">
          <div className="bg-[#070e22]/95 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(16,185,129,0.2)] backdrop-blur-xl space-y-5">
            
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-emerald-500/30">
                <span className="material-symbols-outlined text-3xl font-black">lock_open</span>
              </div>
              <h2 className="text-2xl font-black text-white font-gaming mt-2">
                ĐĂNG NHẬP MỞ MÁY {currentStation.id}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {currentStation.name} • Đơn giá: <strong className="text-emerald-400">{customRate.toLocaleString('vi-VN')}đ/h</strong>
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono">
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleClientLogin} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">TÊN TÀI KHOẢN HỘI VIÊN</label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Ví dụ: thaibboi hoặc nguyenvana"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">MẬT KHẨU</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-400 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/30 transition font-gaming mt-2"
              >
                MỞ MÁY &amp; BẮT ĐẦU CHIẾN GAME &rarr;
              </button>
            </form>

            {/* Cụm Diễn tập Nhanh Cho Buổi Thuyết Trình */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[10px] text-slate-400 block text-center uppercase tracking-wider font-mono">
                DÀNH CHO BẠN THÁI DIỄN TẬP / DEMO THẦY CÔ
              </span>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Nguyễn Văn Thái (Trưởng Nhóm)', 200000)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 font-bold rounded-xl transition text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Mở máy nhanh với TK Thái (Ví: 200.000đ)</span>
              </button>
            </div>

            {/* Thông số phần cứng tóm tắt */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Cấu hình:</span>
                <span className="text-white font-bold">{currentStation.cpu}</span>
              </div>
              <div className="flex justify-between">
                <span>Đồ họa:</span>
                <span className="text-emerald-400 font-bold">{currentStation.gpu}</span>
              </div>
              <div className="flex justify-between">
                <span>Màn hình:</span>
                <span className="text-cyan-400 font-bold">{currentStation.screen}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Màn hình khóa */}
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 font-mono pt-4 border-t border-white/10">
          <span>Trạm máy: <strong className="text-slate-300">{currentStation.name}</strong> • IP: 192.168.1.{currentStation.id.replace(/\D/g, '') || '8'}</span>
          <span>Hotline hỗ trợ nạp thẻ tại quầy: <strong className="text-emerald-400">1900 8888</strong></span>
        </div>

        {/* MODAL ĐỔI PHÒNG MÁY / TRẠM MÁY */}
        {showStationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 shadow-2xl space-y-4 font-sans">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-2xl">sync_alt</span>
                  <h3 className="font-gaming font-black text-xl text-white">CHỌN PHÒNG MÁY ĐỂ NGỒI</h3>
                </div>
                <button onClick={() => setShowStationModal(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1 font-mono text-xs">
                {STATION_PRESETS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleChangeStation(p)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      currentStation.id === p.id
                        ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-950 border-white/10 hover:border-cyan-400'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-gaming font-black text-base text-white">{p.id}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                        {p.badge}
                      </span>
                    </div>
                    <div className="text-slate-300 font-bold">{p.name}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{p.zone}</div>
                    <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
                      <span className="text-emerald-400 font-black text-sm">{p.hourlyRate.toLocaleString('vi-VN')}đ/h</span>
                      <span className="text-[10px] text-cyan-400 font-bold">Chọn máy &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // GIAO DIỆN 2: MÀN HÌNH MÁY TRẠM ĐÃ ĐĂNG NHẬP THÀNH CÔNG (LIVE CLIENT PC)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black pb-16">
      
      {/* ══════════ 1. HUD THỜI GIAN THẬT TRÊN MÁY TRẠM ══════════ */}
      <div className="bg-gradient-to-r from-slate-950 via-[#070e22] to-slate-950 border-b border-emerald-500/30 shadow-2xl py-3 px-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Cụm trái: Thông tin máy & Nút đổi phòng máy */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black font-gaming text-lg shadow-lg shadow-emerald-500/20">
              {currentStation.id.slice(-2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-gaming font-black text-white text-base tracking-wide">
                  MÁY: <span className="text-emerald-400">{currentStation.id}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                </span>
                
                {/* Nút Đổi Phòng Máy / Vị Trí */}
                <button
                  onClick={() => setShowStationModal(true)}
                  className="px-2 py-0.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Bấm để đổi sang Arena, Bida, VIP, Couple hoặc Console"
                >
                  <span className="material-symbols-outlined text-[12px]">sync_alt</span>
                  <span>Đổi Phòng</span>
                </button>
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-400 font-mono">
                  Đơn giá: <strong className="text-emerald-400">{customRate.toLocaleString('vi-VN')}đ/h</strong>
                </span>
                <button
                  onClick={() => setShowRateModal(true)}
                  className="text-[10px] text-amber-400 hover:underline font-mono font-bold flex items-center gap-0.5"
                >
                  <span>[⚙️ Setup Giá]</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cụm giữa: ĐỒNG HỒ ĐẾM NGƯỢC THỜI GIAN CHƠI DỰA THEO ĐƠN GIÁ MÁY */}
          <div className="flex items-center gap-3 bg-black/60 border border-white/10 px-4 py-2 rounded-2xl shadow-inner font-mono">
            <span className="material-symbols-outlined text-amber-400 text-[20px] animate-pulse">timer</span>
            <div className="text-center">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-sans font-bold">
                THỜI GIAN CÒN LẠI ({customRate.toLocaleString('vi-VN')}đ/H)
              </span>
              <span className="text-xl md:text-2xl font-black text-amber-300 font-mono tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                {formatSecondsToHMS(remainingSeconds)}
              </span>
            </div>
            <button
              onClick={() => handleQuickAddMoney(50000)}
              className="ml-2 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black font-black text-[10px] rounded-lg transition uppercase font-sans tracking-wide cursor-pointer"
              title="Nạp nhanh 50k vào ví"
            >
              + NẠP 50K
            </button>
          </div>

          {/* Cụm phải: Số dư ví, Hội viên & Nút gọi nhân viên / Khóa máy */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block font-mono">
              <div className="flex items-center justify-end gap-1.5 text-xs">
                <span className="text-white font-bold">{currentUser?.fullName || wallet.userName}</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                  {currentUser?.userTier || wallet.userTier}
                </span>
              </div>
              <div className="text-emerald-400 font-extrabold text-xs">
                Ví khả dụng: {liveBalance.toLocaleString('vi-VN')}đ
              </div>
            </div>

            <button
              onClick={() => setShowCallModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-rose-500/30 transition transform hover:scale-105 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span className="hidden md:inline">GỌI NHÂN VIÊN</span>
            </button>

            {/* Nút Khóa máy / Đăng xuất */}
            <button
              onClick={handleLockClient}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
              title="Khóa máy & Đăng xuất"
            >
              <span className="material-symbols-outlined text-[16px] text-rose-400">lock</span>
              <span className="hidden md:inline">Khóa Máy</span>
            </button>
          </div>

        </div>
      </div>

      {/* THÔNG BÁO FLASH */}
      {alertSuccess && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs flex items-center justify-between shadow-xl animate-bounce">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
              {alertSuccess}
            </span>
            <span className="text-[10px] text-slate-400">Hệ thống đồng bộ</span>
          </div>
        </div>
      )}

      {/* ══════════ 2. MÀN HÌNH KHÁCH TẠI MÁY (DESKTOP CLIENT GATEWAY) ══════════ */}
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        {/* BANNER CHÀO MỪNG GAME THỦ TẠI BÀN */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-[#0c1833] via-[#081224] to-[#040812] border border-white/10 shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl space-y-4">
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
              Bạn đang sử dụng dàn máy thi đấu <strong className="text-emerald-400 font-bold">{currentStation.id}</strong> ({currentStation.name}) với cấu hình <strong className="text-white">{currentStation.cpu} &amp; {currentStation.gpu}</strong>. Đơn giá đang áp dụng: <strong className="text-amber-300 font-mono">{customRate.toLocaleString('vi-VN')}đ/h</strong>.
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

        {/* ══════════ 3. BẢNG MÔ PHỎNG TRỪ TIỀN GIỜ CHƠI DÀNH CHO THUYẾT TRÌNH (DIỄN TẬP ĐIỂM 10) ══════════ */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#07132a] via-[#091834] to-[#07132a] border border-cyan-400/50 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-amber-500 text-black font-black text-[10px] font-mono uppercase">
                  TÍNH NĂNG TRÌNH BÀY DEMO
                </span>
                <h3 className="text-lg font-black text-white font-gaming">
                  MÔ PHỎNG TRỪ TIỀN THEO GIÁ PHÒNG MÁY ({customRate.toLocaleString('vi-VN')}đ/h)
                </h3>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Bấm các nút dưới đây để chứng minh hệ thống tự động trừ tiền ví và tính toán lại thời gian chơi theo giá tiền máy bạn đã setup!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStationModal(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 text-black font-extrabold text-xs font-mono transition hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                <span>Đổi Phòng Máy Khác</span>
              </button>
              <button
                onClick={() => setShowRateModal(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-400 text-black font-extrabold text-xs font-mono transition hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Setup Lại Đơn Giá</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono text-xs">
            <button
              onClick={() => handleSimulatePlayTime(15)}
              className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 text-slate-200 hover:text-emerald-300 transition flex flex-col justify-between cursor-pointer group"
            >
              <span className="text-[10px] text-slate-400 block group-hover:text-emerald-400">CHƠI 15 PHÚT</span>
              <span className="text-base font-black text-rose-400 my-1">
                -{Math.round((customRate / 60) * 15).toLocaleString('vi-VN')}đ
              </span>
              <span className="text-[9px] text-slate-500">Trừ tiền theo đơn giá &rarr;</span>
            </button>

            <button
              onClick={() => handleSimulatePlayTime(30)}
              className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 text-slate-200 hover:text-emerald-300 transition flex flex-col justify-between cursor-pointer group"
            >
              <span className="text-[10px] text-slate-400 block group-hover:text-emerald-400">CHƠI 30 PHÚT</span>
              <span className="text-base font-black text-rose-400 my-1">
                -{Math.round((customRate / 60) * 30).toLocaleString('vi-VN')}đ
              </span>
              <span className="text-[9px] text-slate-500">Trừ tiền theo đơn giá &rarr;</span>
            </button>

            <button
              onClick={() => handleSimulatePlayTime(60)}
              className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 text-slate-200 hover:text-emerald-300 transition flex flex-col justify-between cursor-pointer group"
            >
              <span className="text-[10px] text-slate-400 block group-hover:text-emerald-400">CHƠI 1 TIẾNG</span>
              <span className="text-base font-black text-rose-400 my-1">
                -{customRate.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-[9px] text-slate-500">Trừ đúng 1 giờ tiền &rarr;</span>
            </button>

            <button
              onClick={() => handleQuickAddMoney(100000)}
              className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-400/50 hover:border-emerald-300 text-slate-200 hover:text-emerald-300 transition flex flex-col justify-between cursor-pointer group"
            >
              <span className="text-[10px] text-emerald-400 font-bold block">NẠP TIỀN CẤP TỐC</span>
              <span className="text-base font-black text-emerald-400 my-1">+100.000đ</span>
              <span className="text-[9px] text-slate-400">Kéo dài thêm giờ chơi &rarr;</span>
            </button>
          </div>
        </div>

        {/* ══════════ 4. 4 NÚT TIỆN ÍCH TRỌNG TÂM CỦA MÁY ══════════ */}
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

        {/* ══════════ 5. BẢNG THÔNG SỐ PHẦN CỨNG & ĐẶC QUYỀN HẠNG VÀNG ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Cột trái: Cấu hình phần cứng máy */}
          <div className="lg:col-span-7 bg-[#070d1e]/80 border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">TELEMETRY PHÒNG MÁY</span>
                <h3 className="text-xl font-black text-white font-gaming mt-0.5">
                  Cấu Hình Máy {currentStation.id} ({currentStation.badge})
                </h3>
              </div>
              <button
                onClick={() => setShowStationModal(true)}
                className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold hover:bg-cyan-500/20 transition cursor-pointer"
              >
                Đổi phòng máy &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">VI XỬ LÝ (CPU)</span>
                <span className="font-bold text-white block">{currentStation.cpu}</span>
                <span className="text-[10px] text-emerald-400 block">Nhiệt độ: 48°C • Tải 24%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">CARD ĐỒ HỌA (GPU)</span>
                <span className="font-bold text-cyan-400 block">{currentStation.gpu}</span>
                <span className="text-[10px] text-slate-400 block">Driver: Game Ready 565.90</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">MÀN HÌNH / HIỂN THỊ</span>
                <span className="font-bold text-white block">{currentStation.screen}</span>
                <span className="text-[10px] text-emerald-400 block">Độ phản hồi 0.03ms G-Sync</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">GEAR &amp; GHẾ NGỒI</span>
                <span className="font-bold text-purple-400 block">{currentStation.gear}</span>
                <span className="text-[10px] text-slate-400 block">{currentStation.chair}</span>
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
                <span className="text-slate-400">Đơn giá máy hiện tại:</span>
                <span className="text-emerald-400 font-bold">{customRate.toLocaleString('vi-VN')}đ/h</span>
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

      {/* ══════════ MODAL ĐỔI PHÒNG MÁY / TRẠM MÁY ══════════ */}
      {showStationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400 text-2xl">sync_alt</span>
                <div>
                  <h3 className="font-gaming font-black text-xl text-white">CHUYỂN ĐỔI PHÒNG MÁY</h3>
                  <span className="text-xs text-slate-400 font-mono">Thời gian chơi sẽ tự động tính lại theo đơn giá phòng mới!</span>
                </div>
              </div>
              <button onClick={() => setShowStationModal(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1 font-mono text-xs">
              {STATION_PRESETS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleChangeStation(p)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    currentStation.id === p.id
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                      : 'bg-slate-950 border-white/10 hover:border-cyan-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-gaming font-black text-base text-white">{p.id}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                      {p.badge}
                    </span>
                  </div>
                  <div className="text-slate-200 font-bold">{p.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{p.zone}</div>
                  
                  <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="text-emerald-400 font-black text-sm">{p.hourlyRate.toLocaleString('vi-VN')}đ/h</span>
                    <span className="text-[10px] text-cyan-300 font-bold">
                      {currentStation.id === p.id ? 'Đang ngồi' : 'Chuyển máy &rarr;'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MODAL SETUP ĐƠN GIÁ MÁY ══════════ */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-3xl p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-2xl">tune</span>
                <h3 className="font-gaming font-black text-xl text-white">SETUP GIÁ TIỀN GIỜ CHƠI</h3>
              </div>
              <button onClick={() => setShowRateModal(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveCustomRate} className="space-y-4 font-mono text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Máy trạm đang áp dụng:</span>
                <strong className="text-emerald-400 text-sm">{currentStation.id} ({currentStation.name})</strong>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">NHẬP ĐƠN GIÁ GIỜ MỚI (VNĐ / GIỜ):</label>
                <input
                  type="number"
                  step="1000"
                  min="1000"
                  value={newRateInput}
                  onChange={(e) => setNewRateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-xl p-3 text-emerald-400 font-black text-base focus:border-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[15000, 20000, 25000, 30000, 40000, 50000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewRateInput(String(preset))}
                    className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-white/5"
                  >
                    {preset / 1000}k/h
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400">
                Khi đổi giá, thời gian chơi còn lại sẽ được tính lại tức thì:
                <div className="text-cyan-300 font-bold mt-1">
                  Thời gian mới = {liveBalance.toLocaleString('vi-VN')}đ / {parseInt(newRateInput || '0').toLocaleString('vi-VN')}đ/h
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-black font-extrabold text-xs rounded-xl shadow-lg transition"
                >
                  ÁP DỤNG ĐƠN GIÁ NÀY
                </button>
                <button
                  type="button"
                  onClick={() => setShowRateModal(false)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <span className="text-[10px] text-slate-400 font-mono">Gửi tín hiệu từ máy {currentStation.id} tới quầy</span>
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
