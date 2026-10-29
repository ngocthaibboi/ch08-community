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
  getCumulativeTopupAmount,
} from '@/lib/walletStore';
import { getLoggedInUser, loginUser, logoutUser, AUTH_EVENT_NAME, AuthUser } from '@/lib/authStore';
import { createStaffRequest } from '@/lib/staffRequestStore';
import {
  getTierByName,
  determineTierByAmount,
  calculateTierProgression,
  GAMER_PASS_TIERS,
  TIERS_ORDER,
  TierInfo,
} from '@/lib/gamerPass';

export interface StationTheme {
  name: string;
  badgeText: string;
  colorName: string;
  bgGradient: string;
  glowAura: string;
  accentText: string;
  accentBorder: string;
  bannerBg: string;
  hudGlow: string;
  stationTagBg: string;
  exclusiveDesc: string;
  roomIcon: string;
}

export interface StationPreset {
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
  theme: StationTheme;
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
    theme: {
      name: 'Ultra VIP Gold Luxury',
      badgeText: 'VÀNG KIM & CYAN VIP',
      colorName: 'amber-cyan',
      bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#231a06] via-[#091428] to-[#020617]',
      glowAura: 'shadow-[0_0_60px_rgba(245,158,11,0.25)]',
      accentText: 'text-amber-400',
      accentBorder: 'border-amber-500/50',
      bannerBg: 'bg-gradient-to-r from-amber-500/25 via-yellow-500/10 to-transparent border-l-4 border-amber-400',
      hudGlow: 'border-b border-amber-500/40 shadow-[0_4px_25px_rgba(245,158,11,0.25)]',
      stationTagBg: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950',
      exclusiveDesc: '👑 ĐẶC QUYỀN ULTRA VIP: Da Nappa ngả 160°, màn ASUS ROG 240Hz Fast-IPS & Akko Lube',
      roomIcon: 'workspace_premium',
    },
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
    theme: {
      name: 'Cyber Pro 540Hz FPS Lime',
      badgeText: 'LIME NEON & LỤC ESPORTS',
      colorName: 'emerald-neon',
      bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#032918] via-[#041a24] to-[#020617]',
      glowAura: 'shadow-[0_0_60px_rgba(16,185,129,0.3)]',
      accentText: 'text-emerald-400',
      accentBorder: 'border-emerald-500/50',
      bannerBg: 'bg-gradient-to-r from-emerald-500/25 via-teal-500/10 to-transparent border-l-4 border-emerald-400',
      hudGlow: 'border-b border-emerald-500/40 shadow-[0_4px_25px_rgba(16,185,129,0.25)]',
      stationTagBg: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950',
      exclusiveDesc: '⚡ ĐẶC QUYỀN CYBER PRO: Tần số quét kỷ lục 540Hz DyAc+, Ryzen 7 7800X3D & Ghế Herman Miller',
      roomIcon: 'bolt',
    },
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
    theme: {
      name: 'Standard Electric Sky Blue',
      badgeText: 'CYBER SKY BLUE',
      colorName: 'sky-blue',
      bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#071d40] via-[#061226] to-[#020617]',
      glowAura: 'shadow-[0_0_50px_rgba(56,189,248,0.2)]',
      accentText: 'text-sky-400',
      accentBorder: 'border-sky-500/40',
      bannerBg: 'bg-gradient-to-r from-sky-500/20 via-blue-500/10 to-transparent border-l-4 border-sky-400',
      hudGlow: 'border-b border-sky-500/40 shadow-[0_4px_25px_rgba(56,189,248,0.15)]',
      stationTagBg: 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950',
      exclusiveDesc: '🎮 KHU TIÊU CHUẨN STANDARD: Tần số quét 280Hz Fast-IPS, Core i5 13400F & RTX 4060 Ti mát lạnh',
      roomIcon: 'desktop_windows',
    },
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
    theme: {
      name: 'Arena Crimson Battle Flame',
      badgeText: 'CRIMSON RED & RUBY',
      colorName: 'rose-crimson',
      bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#32060e] via-[#1a0513] to-[#020617]',
      glowAura: 'shadow-[0_0_70px_rgba(244,63,94,0.35)]',
      accentText: 'text-rose-400',
      accentBorder: 'border-rose-500/50',
      bannerBg: 'bg-gradient-to-r from-rose-500/25 via-red-500/10 to-transparent border-l-4 border-rose-500',
      hudGlow: 'border-b border-rose-500/50 shadow-[0_4px_30px_rgba(244,63,94,0.3)]',
      stationTagBg: 'bg-gradient-to-r from-rose-500 to-red-600 text-white',
      exclusiveDesc: '⚔️ ĐẶC QUYỀN ĐẤU TRƯỜNG 5VS5: RTX 4090 24GB, OLED 540Hz, Phím Wooting 60HE Rapid Trigger',
      roomIcon: 'swords',
    },
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
    theme: {
      name: 'Stream Neon Violet RGB',
      badgeText: 'VIOLET & FUCHSIA RGB',
      colorName: 'purple-fuchsia',
      bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a053b] via-[#140826] to-[#020617]',
      glowAura: 'shadow-[0_0_60px_rgba(192,132,252,0.3)]',
      accentText: 'text-purple-300',
      accentBorder: 'border-purple-500/50',
      bannerBg: 'bg-gradient-to-r from-purple-500/25 via-fuchsia-500/10 to-transparent border-l-4 border-purple-400',
      hudGlow: 'border-b border-purple-500/40 shadow-[0_4px_30px_rgba(192,132,252,0.25)]',
      stationTagBg: 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white',
      exclusiveDesc: '🎙️ ĐẶC QUYỀN PHÒNG STREAM 4K: Cách âm tuyệt đối, Mic Shure SM7B, Dual PC Core i7 & Cam 4K',
      roomIcon: 'videocam',
    },
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
    theme: {
      name: 'Romantic Rose Pink Suite',
      badgeText: 'ROSE GOLD & PINK',
      colorName: 'pink-coral',
      bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2f081d] via-[#18071f] to-[#020617]',
      glowAura: 'shadow-[0_0_55px_rgba(244,114,182,0.25)]',
      accentText: 'text-pink-300',
      accentBorder: 'border-pink-500/50',
      bannerBg: 'bg-gradient-to-r from-pink-500/20 via-rose-500/10 to-transparent border-l-4 border-pink-400',
      hudGlow: 'border-b border-pink-500/40 shadow-[0_4px_25px_rgba(244,114,182,0.2)]',
      stationTagBg: 'bg-gradient-to-r from-pink-400 to-rose-400 text-slate-950',
      exclusiveDesc: '💖 ĐẶC QUYỀN COUPLE SUITE: Sofa đôi ngả 180°, 2 màn cong Odyssey G7 240Hz riêng biệt',
      roomIcon: 'favorite',
    },
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
    theme: {
      name: 'PlayStation Deep Cobalt',
      badgeText: 'PLAYSTATION COBALT BLUE',
      colorName: 'indigo-blue',
      bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#071647] via-[#050e2b] to-[#020617]',
      glowAura: 'shadow-[0_0_65px_rgba(59,130,246,0.35)]',
      accentText: 'text-blue-400',
      accentBorder: 'border-blue-500/50',
      bannerBg: 'bg-gradient-to-r from-blue-500/25 via-indigo-500/10 to-transparent border-l-4 border-blue-400',
      hudGlow: 'border-b border-blue-500/50 shadow-[0_4px_30px_rgba(59,130,246,0.25)]',
      stationTagBg: 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white',
      exclusiveDesc: '🕹️ ĐẶC QUYỀN PS5 PRO LOUNGE: Màn LG OLED 75" 4K 120Hz Dolby Atmos & Ghế Sofa LazyBoy',
      roomIcon: 'sports_esports',
    },
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
    theme: {
      name: 'Billiards Felt Emerald & Amber',
      badgeText: 'FELT GREEN & AMBER',
      colorName: 'emerald-amber',
      bgGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#042c1b] via-[#1f1a04] to-[#020617]',
      glowAura: 'shadow-[0_0_60px_rgba(16,185,129,0.3)]',
      accentText: 'text-emerald-300',
      accentBorder: 'border-emerald-500/50',
      bannerBg: 'bg-gradient-to-r from-emerald-500/20 via-amber-500/10 to-transparent border-l-4 border-emerald-400',
      hudGlow: 'border-b border-emerald-500/40 shadow-[0_4px_25px_rgba(16,185,129,0.2)]',
      stationTagBg: 'bg-gradient-to-r from-emerald-500 to-amber-500 text-slate-950',
      exclusiveDesc: '🎱 ĐẶC QUYỀN BIDA CLUB: Bàn Aileex King 9020 đá tự nhiên 3 tấm, Cơ Carbon Rhino Pro & Bảng điện tử',
      roomIcon: 'sports',
    },
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
  
  const [isLocked, setIsLocked] = useState(true);

  const [currentStation, setCurrentStation] = useState<StationPreset>(STATION_PRESETS[0]);
  const [customRate, setCustomRate] = useState<number>(22000);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [showStationModal, setShowStationModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [newRateInput, setNewRateInput] = useState('22000');

  const [showCallModal, setShowCallModal] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
  const [customStaffNote, setCustomStaffNote] = useState('');

  const [showGamerPassModal, setShowGamerPassModal] = useState(false);
  const [showUpgradeSuccessModal, setShowUpgradeSuccessModal] = useState(false);
  const [newUpgradedTierName, setNewUpgradedTierName] = useState('');
  const [upgradePerks, setUpgradePerks] = useState<string[]>([]);
  const [activeBroadcast, setActiveBroadcast] = useState<string | null>(null);
  const [directAdminMessage, setDirectAdminMessage] = useState<string | null>(null);

  useEffect(() => {
    const user = getLoggedInUser();
    const storedWallet = getStoredWallet();

    setWallet(storedWallet);
    setCurrentUser(user);

    const matched = STATION_PRESETS.find((s) => s.id === storedWallet.pcName) || STATION_PRESETS[0];
    setCurrentStation(matched);
    const initialRate = storedWallet.hourlyRate || matched.hourlyRate;
    setCustomRate(initialRate);
    setNewRateInput(String(initialRate));

    if (storedWallet.balance > 0 && initialRate > 0) {
      const secs = Math.floor((storedWallet.balance / initialRate) * 3600);
      setRemainingSeconds(secs);
    }

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

    const handleBroadcast = (e: any) => {
      setActiveBroadcast(e.detail || null);
    };

    const handleDirectMessage = (e: any) => {
      if (!e.detail?.seatId || e.detail?.seatId === currentStation.id || e.detail?.seatId === 'VIP-08') {
        setDirectAdminMessage(e.detail?.message || 'Có tin nhắn mới từ quầy lễ tân!');
      }
    };

    const handleRemoteLock = (e: any) => {
      if (!e.detail?.seatId || e.detail?.seatId === currentStation.id || e.detail?.seatId === 'VIP-08') {
        setIsLocked(true);
        setAlertSuccess('⚠️ MÁY ĐÃ ĐƯỢC KHÓA TỪ XA BỞI QUẦY LỄ TÂN SERVER!');
      }
    };

    window.addEventListener('cyber_broadcast_alert', handleBroadcast);
    window.addEventListener('cyber_client_direct_message', handleDirectMessage);
    window.addEventListener('cyber_remote_lock_command', handleRemoteLock);

    return () => {
      window.removeEventListener(WALLET_EVENT_NAME, handleSync);
      window.removeEventListener(AUTH_EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('cyber_broadcast_alert', handleBroadcast);
      window.removeEventListener('cyber_client_direct_message', handleDirectMessage);
      window.removeEventListener('cyber_remote_lock_command', handleRemoteLock);
    };
  }, []);

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

  const handleLockClient = () => {
    if (confirm(`Bạn có chắc muốn đăng xuất và khóa máy trạm ${currentStation.id}?`)) {
      setIsLocked(true);
      logoutUser();
    }
  };

  const handleChangeStation = (preset: StationPreset) => {
    const oldStation = currentStation;
    const oldRate = customRate > 0 ? customRate : oldStation.hourlyRate;

    const currentMoney = remainingSeconds > 0
      ? (remainingSeconds / 3600) * oldRate
      : wallet.balance;

    const newRate = preset.hourlyRate;
    const newSeconds = Math.max(0, Math.floor((currentMoney / newRate) * 3600));

    setCurrentStation(preset);
    setCustomRate(newRate);
    setNewRateInput(String(newRate));
    setRemainingSeconds(newSeconds);

    const updatedWallet = updateStationAndRate(preset.id, preset.zone, newRate);
    const roundedMoney = Math.round(currentMoney);
    if (updatedWallet.balance !== roundedMoney) {
      updatedWallet.balance = roundedMoney;
      broadcastWalletUpdate(updatedWallet);
    }
    setWallet(updatedWallet);
    setShowStationModal(false);

    const oldTimeStr = formatSecondsToHMS(remainingSeconds);
    const newTimeStr = formatSecondsToHMS(newSeconds);
    setAlertSuccess(
      `⚡ ĐỔI PHÒNG THÀNH CÔNG: Chuyển từ [${oldStation.id}] (${oldRate.toLocaleString('vi-VN')}đ/h) sang [${preset.id}] (${newRate.toLocaleString('vi-VN')}đ/h). Số tiền bảo lưu: ${roundedMoney.toLocaleString('vi-VN')}đ. Giờ chơi chuyển đổi: ${oldTimeStr} ➔ ${newTimeStr}!`
    );
    setTimeout(() => setAlertSuccess(null), 7000);
  };

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

  const handleQuickAddMoney = (amount: number) => {
    const prevTier = getTierByName(wallet.userTier);
    const updated = topupWallet(amount, 'Nạp Nhanh Diễn Tập');
    setWallet(updated);
    const newTier = getTierByName(updated.userTier);

    const addedSeconds = Math.floor((amount / (customRate || currentStation.hourlyRate)) * 3600);
    setRemainingSeconds((prev) => prev + addedSeconds);

    if (newTier.minAmount > prevTier.minAmount) {
      setNewUpgradedTierName(newTier.name);
      setUpgradePerks(newTier.perks);
      setShowUpgradeSuccessModal(true);
    } else {
      setAlertSuccess(
        `+ ĐÃ NẠP +${amount.toLocaleString('vi-VN')}đ! Số dư mới: ${updated.balance.toLocaleString('vi-VN')}đ (+${formatSecondsToHMS(addedSeconds)} vào đồng hồ).`
      );
      setTimeout(() => setAlertSuccess(null), 5000);
    }
  };

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

  const liveBalance = Math.max(0, Math.round((remainingSeconds / 3600) * (customRate || currentStation.hourlyRate)));

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans select-none">
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950 to-black pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        
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

        
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 font-mono pt-4 border-t border-white/10">
          <span>Trạm máy: <strong className="text-slate-300">{currentStation.name}</strong> • IP: 192.168.1.{currentStation.id.replace(/\D/g, '') || '8'}</span>
          <span>Hotline hỗ trợ nạp thẻ tại quầy: <strong className="text-emerald-400">1900 8888</strong></span>
        </div>

        
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

  return (
    <div className={`min-h-screen ${currentStation.theme.bgGradient} text-slate-100 font-sans selection:bg-emerald-400 selection:text-black pb-16 transition-colors duration-700 relative`}>
      
      
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 ${currentStation.theme.glowAura} rounded-full blur-3xl pointer-events-none opacity-30 transition-all duration-700`}></div>

      
      {activeBroadcast && (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white py-2 px-4 shadow-xl flex items-center justify-between animate-fadeIn z-50">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 text-xs font-mono font-bold">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base animate-pulse">campaign</span>
              <span>📢 THÔNG BÁO TỪ QUẦY: {activeBroadcast}</span>
            </span>
            <button
              onClick={() => setActiveBroadcast(null)}
              className="text-white/80 hover:text-white px-2 cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      
      {directAdminMessage && (
        <div className="bg-amber-400 text-slate-950 py-2.5 px-4 shadow-2xl flex items-center justify-between font-mono text-xs font-bold z-50 animate-bounce">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">sms</span>
              <span>💬 LỄ TÂN NHẮN RIÊNG: &quot;{directAdminMessage}&quot;</span>
            </span>
            <button
              onClick={() => setDirectAdminMessage(null)}
              className="bg-slate-950 text-white px-3 py-1 rounded-lg text-[10px] cursor-pointer"
            >
              ĐÃ ĐỌC ✓
            </button>
          </div>
        </div>
      )}

      
      <div className={`bg-slate-950/80 backdrop-blur-md ${currentStation.theme.hudGlow} py-3 px-4 sticky top-0 z-40 transition-all duration-500`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${currentStation.theme.stationTagBg} flex items-center justify-center font-black font-gaming text-lg shadow-lg`}>
              {currentStation.id.slice(-2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-gaming font-black text-white text-base tracking-wide">
                  MÁY: <span className={currentStation.theme.accentText}>{currentStation.id}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                </span>
                
                
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

          
          <div className="flex items-center gap-2">
            <Link
              href={`/menu?seat=${currentStation.id}`}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition transform hover:scale-105 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
              <span>GỌI MÓN F&amp;B</span>
            </Link>

            <Link
              href="/games"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-cyan-400">sports_esports</span>
              <span>KHO GAME</span>
            </Link>

            <div className="text-right hidden xl:block font-mono">
              <div className="flex items-center justify-end gap-1.5 text-xs">
                <span className="text-white font-bold">{currentUser?.fullName || wallet.userName}</span>
                {(() => {
                  const t = getTierByName(currentUser?.userTier || wallet.userTier);
                  return (
                    <button
                      type="button"
                      onClick={() => setShowGamerPassModal(true)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border ${t.badgeClass} cursor-pointer hover:brightness-125 transition flex items-center gap-1`}
                      title="Bấm để xem đặc quyền Gamer Pass"
                    >
                      <span>{t.name}</span>
                      <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                    </button>
                  );
                })()}
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

      
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        
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
              Dàn máy thi đấu cao cấp <strong className="text-emerald-400 font-bold">{currentStation.id}</strong> • Màn hình 240Hz Fast-IPS • Đơn giá: <strong className="text-amber-300 font-mono">{customRate.toLocaleString('vi-VN')}đ/h</strong>
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
                Mô phỏng trừ cước giờ chơi theo đơn giá phòng máy trực tuyến.
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

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          
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
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <span>Mở Launcher Game</span>
                <span>&rarr;</span>
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/menu?seat=${currentStation.id}`;
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition"
                title="Gọi đồ ăn kèm khi chơi game"
              >
                <span className="material-symbols-outlined text-[12px]">restaurant_menu</span>
                <span>+ Đặt Món Ăn Kèm</span>
              </span>
            </div>
          </Link>

          
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

        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          
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

          
          {(() => {
            const currentTier = getTierByName(currentUser?.userTier || wallet.userTier);
            const cumulative = getCumulativeTopupAmount(wallet);
            const progression = calculateTierProgression(cumulative);
            return (
              <div className={`lg:col-span-5 bg-gradient-to-br from-[#0c1730] to-[#060b18] border ${currentTier.borderColor} rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden`}>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <span className={`text-xs font-mono font-bold uppercase ${currentTier.textColor}`}>
                      THẺ GAMER PASS HỘI VIÊN
                    </span>
                    <h3 className="text-xl font-black text-white font-gaming mt-0.5">
                      {currentTier.name}
                    </h3>
                  </div>
                  <span className={`w-10 h-10 rounded-2xl ${currentTier.accentBg} ${currentTier.textColor} border ${currentTier.borderColor} flex items-center justify-center font-bold text-lg shadow-lg`}>
                    <span className="material-symbols-outlined">{currentTier.icon}</span>
                  </span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400">Đặc quyền giờ chơi:</span>
                    <span className="text-emerald-400 font-bold">
                      {currentTier.playDiscountPercent > 0 ? `Giảm ${currentTier.playDiscountPercent}% toàn bộ máy` : 'Giá niêm yết chuẩn'}
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400">Đặc quyền menu Bếp F&amp;B:</span>
                    <span className="text-cyan-400 font-bold">
                      {currentTier.fnbDiscountPercent > 0 ? `Giảm ${currentTier.fnbDiscountPercent}% toàn menu Bếp` : 'Giá niêm yết chuẩn'}
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400">Thời gian giữ máy trước:</span>
                    <span className="text-amber-400 font-bold">
                      {currentTier.reserveDurationMinutes >= 999 ? 'Ưu tiên tuyệt đối' : `${currentTier.reserveDurationMinutes} phút`}
                    </span>
                  </div>

                  
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">
                        {progression.isMaxTier ? 'Cấp độ hội viên:' : `Tiến trình lên ${progression.nextTier?.shortName}:`}
                      </span>
                      <span className="text-white font-bold">
                        {progression.isMaxTier
                          ? '100% (ĐỈNH CAO VIP)'
                          : `${progression.progressPercent}% (Cần +${progression.neededAmount.toLocaleString('vi-VN')}đ)`}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${progression.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setShowGamerPassModal(true)}
                    className="py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs font-mono text-center transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">badge</span>
                    <span>Xem Đặc Quyền</span>
                  </button>

                  <button
                    onClick={() => {
                      if (progression.isMaxTier) {
                        setShowGamerPassModal(true);
                      } else {
                        handleQuickAddMoney(progression.neededAmount || 200000);
                      }
                    }}
                    className={`py-2.5 px-3 rounded-xl ${
                      progression.isMaxTier
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black font-extrabold'
                    } text-xs font-mono text-center transition tracking-wider shadow-lg cursor-pointer flex items-center justify-center gap-1`}
                  >
                    <span className="material-symbols-outlined text-sm">upgrade</span>
                    <span>{progression.isMaxTier ? 'Kim Cương Max' : 'Nạp Lên Hạng'}</span>
                  </button>
                </div>
              </div>
            );
          })()}

        </div>

      </div>

      
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
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono ${p.theme.stationTagBg}`}>
                      {p.theme.badgeText}
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
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/5 text-left text-slate-200 hover:text-rose-300 transition flex items-center justify-between cursor-pointer"
                >
                  <span>{reason}</span>
                  <span className="text-[10px] text-rose-400">&rarr;</span>
                </button>
              ))}
            </div>

            
            <div className="pt-3 border-t border-white/10 space-y-2">
              <label className="text-[11px] text-slate-300 font-mono font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-rose-400">edit_note</span>
                <span>Hoặc tự nhập yêu cầu riêng của bạn:</span>
              </label>
              <textarea
                rows={2}
                value={customStaffNote}
                onChange={(e) => setCustomStaffNote(e.target.value)}
                placeholder="Ví dụ: Cho mượn củ sạc Type-C, tăng nhiệt độ điều hòa, xin thêm giấy ăn..."
                className="w-full bg-slate-950 border border-rose-500/40 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none resize-none font-sans"
              />
              <button
                type="button"
                disabled={!customStaffNote.trim()}
                onClick={() => {
                  if (customStaffNote.trim()) {
                    handleCallStaff(customStaffNote.trim());
                    setCustomStaffNote('');
                  }
                }}
                className={`w-full py-2.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition ${
                  customStaffNote.trim()
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:brightness-110 text-white shadow-lg shadow-rose-500/30 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>GỬI YÊU CẦU NÀY TỚI LỄ TÂN &rarr;</span>
              </button>
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

      
      {showGamerPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#090f20] border border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 font-sans text-slate-100 max-h-[92vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-amber-400 text-black flex items-center justify-center font-black text-xl shadow-lg">
                  CZ
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white font-gaming tracking-wide">
                    HỆ THỐNG GAMER PASS &amp; ĐẶC QUYỀN HỘI VIÊN
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Tích lũy nạp tiền tự động mở khóa các cấp bậc hội viên và siêu ưu đãi giảm giá
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGamerPassModal(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            
            {(() => {
              const currentTier = getTierByName(currentUser?.userTier || wallet.userTier);
              const cumulative = getCumulativeTopupAmount(wallet);
              const progression = calculateTierProgression(cumulative);
              return (
                <div className="p-4 rounded-2xl bg-[#060a16] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${currentTier.accentBg} ${currentTier.textColor} border ${currentTier.borderColor} flex items-center justify-center text-2xl`}>
                      <span className="material-symbols-outlined">{currentTier.icon}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Hạng hội viên hiện tại:</span>
                      <h4 className="text-lg font-black text-white flex items-center gap-2">
                        <span>{currentTier.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${currentTier.badgeClass}`}>
                          {currentTier.shortName}
                        </span>
                      </h4>
                      <span className="text-xs text-emerald-400">
                        Số dư khả dụng: {wallet.balance.toLocaleString('vi-VN')}đ • Tích lũy nạp: {cumulative.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                  <div className="w-full md:w-80 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">
                        {progression.isMaxTier ? 'Cấp độ hội viên:' : `Lên ${progression.nextTier?.name}:`}
                      </span>
                      <span className="text-white font-bold">
                        {progression.isMaxTier ? 'HẠNG TỐI ĐA (MAX)' : `${progression.progressPercent}%`}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400"
                        style={{ width: `${progression.progressPercent}%` }}
                      ></div>
                    </div>
                    {!progression.isMaxTier && (
                      <span className="text-[10px] text-amber-300 block text-right font-bold">
                        Cần nạp thêm +{progression.neededAmount.toLocaleString('vi-VN')}đ để thăng hạng
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {TIERS_ORDER.map((tierKey) => {
                const tier = GAMER_PASS_TIERS[tierKey];
                const activeTier = getTierByName(currentUser?.userTier || wallet.userTier);
                const isCurrent = activeTier.code === tierKey;
                return (
                  <div
                    key={tierKey}
                    className={`rounded-2xl p-4 flex flex-col justify-between border transition-all ${
                      isCurrent
                        ? `bg-slate-800/90 ${tier.borderColor} ring-2 ring-emerald-400/60 shadow-xl shadow-emerald-500/10`
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${tier.badgeClass}`}>
                          {tier.shortName}
                        </span>
                        <span className="material-symbols-outlined text-base text-slate-400">{tier.icon}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{tier.name}</h4>
                      <p className="text-[11px] text-slate-400 mb-3 font-mono">{tier.tagline}</p>

                      <div className="space-y-1.5 border-t border-white/10 pt-3 text-xs font-mono">
                        <div className="flex justify-between text-slate-300">
                          <span>Giảm giờ chơi:</span>
                          <span className="font-bold text-emerald-400">
                            {tier.playDiscountPercent > 0 ? `-${tier.playDiscountPercent}%` : 'Chuẩn'}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Giảm món ăn Bếp:</span>
                          <span className="font-bold text-cyan-400">
                            {tier.fnbDiscountPercent > 0 ? `-${tier.fnbDiscountPercent}%` : 'Chuẩn'}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Giữ máy trước:</span>
                          <span className="font-bold text-amber-400">
                            {tier.reserveDurationMinutes >= 999 ? 'Ưu tiên tối đa' : `${tier.reserveDurationMinutes}p`}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-[11px] text-slate-300">
                        {tier.perks.map((p, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10">
                      {isCurrent ? (
                        <div className="py-2 text-center text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                          ✓ HẠNG HIỆN TẠI CỦA BẠN
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            const needed = Math.max(50000, tier.minAmount - wallet.balance);
                            handleQuickAddMoney(needed);
                          }}
                          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 font-bold text-xs font-mono transition text-center cursor-pointer"
                        >
                          Nạp +{(tier.minAmount || 50000).toLocaleString('vi-VN')}đ
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-500/30 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">bolt</span>
                  <span className="text-xs font-bold text-white uppercase">
                    THỬ NGHIỆM THĂNG HẠNG TỨC THÌ (DEMO ĐÁNH GIÁ DỰ ÁN)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Cộng số dư và tự động thăng hạng ngay sau 1 click</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickAddMoney(200000)}
                  className="py-2.5 px-3 bg-slate-700/70 hover:bg-slate-600 text-slate-200 border border-slate-500 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>🥈 Thử nạp +200k lên BẠC</span>
                </button>
                <button
                  onClick={() => handleQuickAddMoney(500000)}
                  className="py-2.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>⭐ Thử nạp +500k lên VÀNG</span>
                </button>
                <button
                  onClick={() => handleQuickAddMoney(1500000)}
                  className="py-2.5 px-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>💎 Thử nạp +1.5M lên KIM CƯƠNG</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      
      {showUpgradeSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-gradient-to-b from-[#132347] to-[#070d1e] border-2 border-amber-400 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-black flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-bounce">
              <span className="material-symbols-outlined text-4xl">military_tech</span>
            </div>

            <div>
              <span className="text-xs font-mono text-amber-400 font-extrabold uppercase tracking-widest">
                🎉 CHÚC MỪNG BẠN ĐÃ THĂNG HẠNG!
              </span>
              <h3 className="text-2xl font-black text-white font-gaming mt-1">
                {newUpgradedTierName}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Hệ thống Cyber Zone đã tự động kích hoạt toàn bộ các quyền lợi ưu đãi mới nhất cho tài khoản của bạn!
            </p>

            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 text-left space-y-1.5 text-xs font-mono text-emerald-300">
              {upgradePerks.slice(0, 3).map((perk, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-amber-400">★</span>
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowUpgradeSuccessModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black font-extrabold text-xs uppercase font-gaming tracking-wider shadow-lg cursor-pointer"
            >
              TIẾP TỤC TRẢI NGHIỆM MÁY
            </button>
          </div>
        </div>
      )}

      
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#080d19]/95 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 border-r border-white/10 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-white font-bold">{currentStation.id}</span>
          <span className="text-amber-400 font-mono font-black">{formatSecondsToHMS(remainingSeconds)}</span>
        </div>
        <Link
          href={`/menu?seat=${currentStation.id}`}
          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
          <span>ĐẶT MÓN F&amp;B</span>
        </Link>
        <Link
          href="/games"
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-cyan-400">sports_esports</span>
          <span>KHO GAME</span>
        </Link>
        <button
          onClick={() => setShowCallModal(true)}
          className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs rounded-xl flex items-center gap-1 transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">support_agent</span>
          <span className="hidden sm:inline">GỌI NHÂN VIÊN</span>
        </button>
      </div>

    </div>
  );
}
