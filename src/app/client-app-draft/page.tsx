'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getStoredWallet,
  WALLET_EVENT_NAME,
  UserWallet,
  INITIAL_WALLET,
  deductWallet,
  topupWallet,
} from '@/lib/walletStore';
import { getLoggedInUser, logoutUser, AUTH_EVENT_NAME, AuthUser } from '@/lib/authStore';
import { createStaffRequest } from '@/lib/staffRequestStore';
import { addOrder } from '@/lib/orderStore';
import { getTierByName, calculateTierProgression, getCumulativeTopupAmount } from '@/lib/gamerPass';

interface QuickGame {
  id: string;
  name: string;
  category: string;
  platform: string;
  icon: string;
  image: string;
  isHot?: boolean;
}

const APP_GAMES: QuickGame[] = [
  {
    id: 'g1',
    name: 'Liên Minh Huyền Thoại',
    category: 'MOBA',
    platform: 'Riot/VNG',
    icon: 'sports_esports',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMh8ZjJKSY-hDfVBCfwABNCTxRgTZG10L5YMmrTns0xjctwrUXqWMRahhCjJ5e7zqzl8uF-jta_c1ynPWbgtcrsLPY999UdXGI7Nhajna98t3HfAHo0kXp1SWM-pET1QoNXV_l4OuSqnqTJ61Tkkb7xc8zbP-xMku78Oztk4eeNLi7TOT_qTQ9EcTraLUARcK0OCa_pvRZj6lCCXElLehCwZyr8K1-evJZH4pCwFRWy5vMAemuR4Ac',
    isHot: true,
  },
  {
    id: 'g2',
    name: 'Valorant',
    category: 'FPS',
    platform: 'Riot Games',
    icon: 'crosshair',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5hR9PLfWtbhbOi-WDhXt9yZWZUgsI1tj10eV37UDf80GIS0WFuOXQgwUSfxrYlZnb6oxltIK-EsK_8AzScl_uTqHADWa_wjeq-nOE2pai4bSM-_D6OLMgYjo7uB4t1YBC8k1f9UpBVf9qQUwIdxJ311Hl4HeVAylACgBUkxgEB-aV_ZFIIZvL2PvwpI6kzfx_sHafii_t_khjz8WsnoywBTNQz7Mf-lY7zjhv-NVPXSPJ6ffk35Ls',
    isHot: true,
  },
  {
    id: 'g3',
    name: 'Counter-Strike 2',
    category: 'FPS',
    platform: 'Steam',
    icon: 'military_tech',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEG5Z51qHJskujQD4bHi9dp-WjKam9MWRmxzTszoUYUGR-C2GN0JlhR2GV_UsKbGpbyN0Zs7yhxFKmRTzNaGk3uaIk8iOxz9kALQz1DGTV_zPq-8Zc9bDgQAqGF2XRo90Z5dybxwHjLjX1YAvHkjfV7MaNf8U-YK5DZQG-M8Pj0jowYpm2b3yrzK8ETDukPweNdt3WdRHy1Msevj6ab5dIbYX6L8SrtFvVCxFd09nDfSchC6t8--o9',
    isHot: true,
  },
  {
    id: 'g4',
    name: 'Black Myth: Wukong',
    category: 'Action/AAA',
    platform: 'Steam',
    icon: 'swords',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzkSMq1TKCxW-P4Tyq_oGAJrujxwZLU2E8YGevaRG6L65heDlLNLQhFsRGB46uc2eMTrfrf9aV6XyDz6awgkG2-RE_YUhaX03Eq1sEZ7HJyUnPuaPT9aBvlIfTYxk36j8JYL0KkAY0JVgyMCBM-kT2uvIO2MMp71Di7eG_5KZC05SAOSeP_IlT9RAY8hH5IksZkfuT8x_3Q5b_D7ohykbZwQc9Wc41Osrb2eu37IS-6_8qY4wOmSZG',
    isHot: true,
  },
  {
    id: 'g5',
    name: 'FC Online (FO4)',
    category: 'Thể Thao',
    platform: 'Garena',
    icon: 'sports_soccer',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5ZHY-IIPQ4SbBXYve5568SYd1fw48fS_E6voSVRLLIWDiQv74i_y18NQjmCsqtD_4JsC5W-QOzkQurEuziC9UVEFGGvgf3BroT2xPJyiuxc70YLTu44ESZeIoVWnw7gPb5QhpEXFwVJtXHcaBjwtTWyk8sMqEfIbgH39h-6z7iQSm9Nw7uPwYe5Etl6JvXdLHTlud1Ihisk43YYG_qYj6OuT3vdHUbwBr7j-6S6Br-3ncNg2ctsx_',
  },
  {
    id: 'g6',
    name: 'PUBG: BATTLEGROUNDS',
    category: 'Battle Royale',
    platform: 'Steam',
    icon: 'shield',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ8dqRxHk7EuPZN8_1BGltr5OYnAkj4TbT8c5JO4v6630hccGgShpEEgwby2yF5nD_as-5GXPeX4_-t1xJO4JZlr1g1J1qYPmr92Ak3I0pe8FOeJbWeAsi_cpfAy22OFj0E1oKAzGug7WNjl3O0CvUvk3JcLRpRQ0FGFzYWQUExn3r7SUeiRg-6xOKroEan7SSr8kD6vfKkS-LMDlOPZkele24Rg1DNqia1s8WFaO1FgGex1UGJ9tL',
  },
  {
    id: 'g7',
    name: 'Đấu Trường Chân Lý',
    category: 'Chiến Thuật',
    platform: 'Riot Games',
    icon: 'casino',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh6LZ9Jev80VpQIlCS5ZitMbsets5WKSJc7ox3VEEfxO1wi-vgVN-qwreUoGdkM5tkR8NqqsltXdcadR5c2ed8Tz-27XgP-ygac7MO4IRZVNOimLRZMvDTv6Z2aTilxcv2lvQI1Nr13uC2aVHQUSfK7FsemDfbQfTEJbMqyiI2mchC_if_aMqG6u3hRts8BmkiN6ARW3PR3pPLZU33sF8_R-DQIrPbCbmWrRRdYfUpFl9824-IwKc7',
  },
  {
    id: 'g8',
    name: 'GTA V (FiveM Roleplay)',
    category: 'Nhập Vai',
    platform: 'FiveM',
    icon: 'directions_car',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBN8DTkrrdURUkVDToP0InwI6CNn7FDbJkMQIgC8wdXU5io491vTOIc4w4MwAtVsLaGIvJ2sr-ioLpftmD6wN_Bq_1Wq4ETjKvoomXrX35FV24zVuO-gKg3ikVLBIYlmssvpKdW793vSmB3zO2n27AxMXhcmiWsksmuDIOsrjpPF0DoyjKjNZ4csQoa5bkE86Dy7pM7RfgjKRQpodYDTWvuNepA5Uytll4hqroNnT4eBMg80_kLDoF',
  },
];

interface QuickFood {
  id: string;
  name: string;
  price: number;
  category: string;
  icon: string;
  desc: string;
}

const APP_FOODS: QuickFood[] = [
  { id: 'f1', name: 'Mì Trộn Indomie Double Trứng', price: 38000, category: 'Mì Trộn', icon: 'ramen_dining', desc: 'Trứng lòng đào, hành phi giòn, dưa chuột' },
  { id: 'f2', name: 'Cơm Bò Lúc Lắc Phô Mai', price: 55000, category: 'Cơm Đĩa', icon: 'dinner_dining', desc: 'Bò mềm xào sốt tiêu, phô mai kéo sợi' },
  { id: 'f3', name: 'Cơm Gà Xối Mỡ Da Giòn', price: 48000, category: 'Cơm Đĩa', icon: 'lunch_dining', desc: 'Đùi góc tư da giòn rụm, cơm chiên tỏi' },
  { id: 'f4', name: 'Combo Cày Đêm (-20%)', price: 69000, category: 'Combo', icon: 'military_tech', desc: '1x Cơm Gà + 1x Sting Dâu + 1x Snack' },
  { id: 'f5', name: 'Sting Dâu Ướp Lạnh (Kèm Ly Đá)', price: 18000, category: 'Nước Uống', icon: 'bolt', desc: 'Ướp lạnh sâu, kèm 01 ly đá riêng' },
  { id: 'f6', name: 'Monster Energy Ultra Trắng', price: 35000, category: 'Nước Uống', icon: 'local_drink', desc: 'Monster Mỹ không đường, lạnh âm độ' },
  { id: 'f7', name: 'Trà Đào Cam Sả 1 Lít', price: 28000, category: 'Nước Uống', icon: 'emoji_food_beverage', desc: 'Ly khủng 1000ml, 3 miếng đào giòn' },
  { id: 'f8', name: 'Xúc Xích Đức Nướng Phô Mai', price: 25000, category: 'Ăn Vặt', icon: 'bakery_dining', desc: '2 cây xúc xích Đức nướng béo ngậy' },
];

export default function CyberClientAppDraft() {
  const [activeTab, setActiveTab] = useState<'games' | 'fnb' | 'services' | 'tools' | 'gamerpass'>('games');
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_WALLET);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [activePlayingGame, setActivePlayingGame] = useState<string | null>('Liên Minh Huyền Thoại');
  const [gamePlaySeconds, setGamePlaySeconds] = useState<number>(1420);
  const [remainingPlaySeconds, setRemainingPlaySeconds] = useState<number>(12640);

  const [isMiniWidget, setIsMiniWidget] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [quickTopupModal, setQuickTopupModal] = useState<boolean>(false);
  const [ramOptimized, setRamOptimized] = useState<boolean>(false);

  useEffect(() => {
    setWallet(getStoredWallet());
    setCurrentUser(getLoggedInUser());

    const handleSync = () => {
      setWallet(getStoredWallet());
      setCurrentUser(getLoggedInUser());
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

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingPlaySeconds((prev) => Math.max(0, prev - 1));
      if (activePlayingGame) {
        setGamePlaySeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activePlayingGame]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const formatHMS = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleLaunchGame = (gameName: string) => {
    setActivePlayingGame(gameName);
    setGamePlaySeconds(0);
    showToast(`Đã mở tựa game "${gameName}"! Chúc bạn thi đấu đỉnh cao!`);
  };

  const handleStopGame = () => {
    setActivePlayingGame(null);
    setGamePlaySeconds(0);
    showToast('Đã dừng phiên chơi game.');
  };

  const handleAddCart = (foodId: string) => {
    setCart((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + 1,
    }));
    const item = APP_FOODS.find((f) => f.id === foodId);
    showToast(`Đã thêm 1x "${item?.name}" vào đơn gọi món!`);
  };

  const handleCheckoutFood = () => {
    const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
      const f = APP_FOODS.find((item) => item.id === id);
      return sum + (f ? f.price * qty : 0);
    }, 0);

    if (totalAmount <= 0) return;

    if (wallet.balance < totalAmount) {
      alert(`Số dư ví (${wallet.balance.toLocaleString('vi-VN')}đ) không đủ thanh toán (${totalAmount.toLocaleString('vi-VN')}đ). Vui lòng nạp thêm tiền ví!`);
      return;
    }

    const deductRes = deductWallet(totalAmount, 'Gọi món từ Client App');
    if (!deductRes.success) {
      alert('Không thể trừ tiền ví.');
      return;
    }

    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderedItems = Object.entries(cart).map(([id, qty]) => {
      const f = APP_FOODS.find((item) => item.id === id);
      return `${qty}x ${f?.name || 'Món'}`;
    });

    addOrder({
      id: `ord-${orderNum}`,
      orderNumber: orderNum,
      pcName: wallet.pcName || 'VIP-08',
      zoneName: 'ZONE VIP A • TẦNG 2',
      status: 'PENDING',
      paymentMethod: 'ACCOUNT_BALANCE',
      totalAmount,
      timeElapsed: '00:01',
      station: 'HOT_KITCHEN',
      items: orderedItems,
      createdAt: new Date().toISOString(),
    });

    setCart({});
    showToast(`Đặt món thành công (#${orderNum})! Bếp đang nấu và bưng tới máy ${wallet.pcName || 'VIP-08'}.`);
  };

  const handleQuickCall = (type: any, title: string, details: string) => {
    createStaffRequest({
      pcName: wallet.pcName || 'VIP-08',
      type,
      title,
      details,
    });
    showToast(`Đã gửi yêu cầu "${title}" tới nhân viên trực tầng!`);
  };

  const handleOptimizeRam = () => {
    setRamOptimized(true);
    setTimeout(() => {
      setRamOptimized(false);
      showToast('Đã dọn dẹp bộ nhớ đệm, giải phóng 3.4GB RAM!');
    }, 1500);
  };

  const handleQuickTopup = (amt: number) => {
    topupWallet(amt, 'Nạp nhanh tại Client App', 'VIETQR');
    setQuickTopupModal(false);
    showToast(`Nạp thành công +${amt.toLocaleString('vi-VN')}đ vào tài khoản máy!`);
  };

  const currentTier = getTierByName(currentUser?.userTier || wallet.userTier);
  const cartTotalQty = Object.values(cart).reduce((a, b) => a + b, 0);

  if (isLocked) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050811] flex flex-col items-center justify-center p-6 text-white font-mono select-none">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-slate-950 font-black text-3xl shadow-[0_0_40px_rgba(245,158,11,0.5)] mb-6 animate-pulse">
          <span className="material-symbols-outlined text-4xl">lock</span>
        </div>
        <h1 className="text-3xl font-black font-gaming tracking-wider uppercase mb-2">MÁY TRẠM ĐANG KHÓA TẠM THỜI</h1>
        <p className="text-slate-400 text-sm mb-6">Phiên chơi tại máy {wallet.pcName || 'VIP-08'} được bảo mật. Giờ chơi vẫn được bảo lưu.</p>
        <button
          onClick={() => setIsLocked(false)}
          className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-sm uppercase shadow-xl transition"
        >
          MỞ KHÓA MÀN HÌNH NGAY
        </button>
      </div>
    );
  }

  if (isMiniWidget) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-[#090e1a]/95 border-2 border-amber-400/80 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)] text-white font-mono flex flex-col gap-3 w-80 animate-scale-in">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-gaming font-black text-amber-400 text-sm">G-CAFE PRO HUD</span>
          </div>
          <button
            onClick={() => setIsMiniWidget(false)}
            className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-0.5 rounded"
            title="Mở toàn màn hình App"
          >
            Phóng To ↗
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Máy:</span>
            <strong className="text-cyan-400">{wallet.pcName || 'VIP-08'}</strong>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Giờ chơi còn:</span>
            <strong className="text-amber-400 text-sm font-black">{formatHMS(remainingPlaySeconds)}</strong>
          </div>
          {activePlayingGame && (
            <div className="flex justify-between text-[11px] pt-1 text-slate-300">
              <span className="text-rose-400 font-bold truncate max-w-[150px]">🎮 {activePlayingGame}</span>
              <span className="font-bold">{formatHMS(gamePlaySeconds)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href={`/menu?seat=${wallet.pcName || 'VIP-08'}`}
            className="py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-[11px] rounded-lg text-center flex items-center justify-center gap-1 shadow-md"
          >
            <span className="material-symbols-outlined text-[14px]">restaurant_menu</span>
            <span>GỌI MÓN</span>
          </Link>
          <button
            onClick={() => handleQuickCall('EXTRA_SERVICE', 'Thêm đá lạnh', 'Khách đang chơi gọi thêm ca đá')}
            className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] rounded-lg text-center border border-slate-700"
          >
            THÊM ĐÁ 🧊
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col select-none overflow-x-hidden">
      
      
      <div className="bg-[#04060c] border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs font-mono select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
              C
            </div>
            <span className="font-gaming font-black text-amber-400 tracking-wider">CYBERNET CLIENT OS</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              v5.4 PRO
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Trạm: <strong className="text-white">{wallet.pcName || 'VIP-08'}</strong> (Tầng 2 VIP)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMiniWidget(true)}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-white/10 flex items-center gap-1"
            title="Thu nhỏ thành thanh tiện ích góc màn hình"
          >
            <span className="material-symbols-outlined text-[13px]">picture_in_picture_alt</span>
            <span>Mini HUD</span>
          </button>

          <button
            onClick={() => setIsLocked(true)}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-rose-300 text-[11px] border border-white/10 flex items-center gap-1"
            title="Khóa màn hình máy trạm"
          >
            <span className="material-symbols-outlined text-[13px] text-rose-400">lock</span>
            <span>Khóa Máy</span>
          </button>

          <div className="flex items-center gap-1 pl-2 border-l border-white/10 text-slate-400">
            <span className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/50 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500/50 inline-block"></span>
          </div>
        </div>
      </div>

      
      <header className="bg-[#090e1a] border-b border-white/10 px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black font-gaming text-xl shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              {wallet.pcName ? wallet.pcName.slice(-2) : '08'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-gaming font-black text-white text-lg">{wallet.pcName || 'VIP-08'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                </span>
                <span className="text-xs font-mono text-slate-400">22.000đ/h</span>
              </div>
              <div className="text-xs text-slate-300 font-mono mt-0.5">
                {currentUser?.fullName || wallet.userName} • <span className="text-amber-400 font-bold">{currentTier.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/60 border border-white/10 px-5 py-2.5 rounded-2xl shadow-inner font-mono">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">THỜI GIAN CÒN LẠI</span>
              <span className="text-2xl font-black text-amber-400 tracking-wider">
                {formatHMS(remainingPlaySeconds)}
              </span>
            </div>

            <div className="h-8 w-px bg-white/10"></div>

            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">SỐ DƯ VÍ MÁY</span>
              <span className="text-lg font-black text-emerald-400 tracking-wide">
                {wallet.balance.toLocaleString('vi-VN')}đ
              </span>
            </div>

            <button
              onClick={() => setQuickTopupModal(true)}
              className="px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl transition uppercase shadow-md cursor-pointer"
            >
              + NẠP VÍ
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/menu?seat=${wallet.pcName || 'VIP-08'}`}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs font-mono rounded-xl flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.5)] transition transform hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              <span>ĐẶT MÓN F&amp;B TẬN BÀN</span>
            </Link>

            <button
              onClick={() => handleQuickCall('EXTRA_SERVICE', 'Gọi nhân viên tại bàn', 'Khách cần nhân viên hỗ trợ trực tiếp tại máy')}
              className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs font-mono rounded-xl flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span>GỌI PHỤC VỤ</span>
            </button>
          </div>

        </div>
      </header>

      
      {activePlayingGame && (
        <div className="bg-gradient-to-r from-[#1c0b15] via-[#2d0e21] to-[#140810] border-b-2 border-rose-500 px-4 py-2.5 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono z-30">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-rose-400 text-xl animate-pulse">sports_esports</span>
            <div>
              <span className="text-white font-bold">ĐANG CHIẾN: <strong className="text-amber-400">{activePlayingGame}</strong></span>
              <span className="text-slate-400 ml-3">Thời gian trận: <strong className="text-white">{formatHMS(gamePlaySeconds)}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('fnb')}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1 shadow-md transition"
            >
              <span className="material-symbols-outlined text-[15px]">fastfood</span>
              <span>GỌI ĐỒ ĂN CHO TRẬN NÀY &rarr;</span>
            </button>
            <button
              onClick={handleStopGame}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] border border-slate-700"
            >
              Thoát Game ✕
            </button>
          </div>
        </div>
      )}

      
      <div className="max-w-7xl w-full mx-auto p-4 lg:p-6 flex-1 flex flex-col gap-5">
        
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
          {[
            { id: 'games', label: '🎮 KHO GAME LAUNCHER', badge: '16 GAME' },
            { id: 'fnb', label: '🍜 BẾP F&B TẬN MÁY', badge: cartTotalQty > 0 ? `${cartTotalQty} MÓN` : 'HOT' },
            { id: 'services', label: '🛎️ GỌI NHÂN VIÊN 1-CHẠM', badge: '24/7' },
            { id: 'tools', label: '⚡ TIỆN ÍCH GAME THỦ', badge: 'RAM/GEAR' },
            { id: 'gamerpass', label: '👑 THẺ GAMER PASS', badge: currentTier.name },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-gaming font-black text-xs tracking-wider uppercase transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-[#0f172a] text-slate-300 hover:bg-slate-800 border border-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${activeTab === tab.id ? 'bg-black/30 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        
        {activeTab === 'games' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black font-gaming text-white uppercase tracking-wide">
                  DANH SÁCH GAME ĐÃ CÀI SẴN TRÊN MÁY TRẠM
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  100% bản quyền Steam &amp; Riot Games • Tối ưu 240Hz không giật lag
                </p>
              </div>

              <button
                onClick={handleOptimizeRam}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[16px] ${ramOptimized ? 'animate-spin' : ''}`}>bolt</span>
                <span>{ramOptimized ? 'Đã giải phóng!' : 'Tối Ưu RAM'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {APP_GAMES.map((game) => {
                const isPlaying = activePlayingGame === game.name;

                return (
                  <div
                    key={game.id}
                    className={`bg-[#0d1424] border rounded-2xl overflow-hidden p-3 flex flex-col justify-between transition-all group ${
                      isPlaying ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'border-white/10 hover:border-amber-400'
                    }`}
                  >
                    <div>
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 mb-3">
                        <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-cyan-300">
                          {game.platform}
                        </span>
                        {isPlaying && (
                          <span className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-rose-600 text-white font-mono font-black text-[10px] text-center animate-pulse">
                            ĐANG CHẠY
                          </span>
                        )}
                      </div>

                      <h3 className="font-gaming font-black text-sm text-white truncate">{game.name}</h3>
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-1">
                        <span>{game.category}</span>
                        <span className="text-emerald-400 font-bold">Ready</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex gap-2">
                      <button
                        onClick={() => handleLaunchGame(game.name)}
                        className={`flex-1 py-2 rounded-xl font-gaming font-black text-xs uppercase tracking-wider transition ${
                          isPlaying
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                        }`}
                      >
                        {isPlaying ? 'CHƠI TIẾP' : 'KHỞI ĐỘNG'}
                      </button>

                      <button
                        onClick={() => setActiveTab('fnb')}
                        className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs border border-amber-400/30"
                        title="Đặt món ăn kèm khi chơi game này"
                      >
                        🍜
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        
        {activeTab === 'fnb' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black font-gaming text-white uppercase tracking-wide">
                    THỰC ĐƠN BẾP NÓNG &amp; NƯỚC UỐNG TẬN MÁY
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Tự động nhận diện máy <strong className="text-amber-400">{wallet.pcName || 'VIP-08'}</strong> • Phục vụ trong 5-7 phút
                  </p>
                </div>
                <Link
                  href={`/menu?seat=${wallet.pcName || 'VIP-08'}`}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold"
                >
                  Mở Toàn Bộ Menu &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {APP_FOODS.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#0d1424] border border-white/10 hover:border-amber-400/50 transition flex items-center justify-between gap-3 shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{item.name}</h4>
                        <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{item.desc}</p>
                        <span className="font-mono font-bold text-amber-400 text-xs">
                          {item.price.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddCart(item.id)}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-mono rounded-xl transition cursor-pointer"
                    >
                      + CHỌN
                    </button>
                  </div>
                ))}
              </div>
            </div>

            
            <div className="lg:col-span-4 bg-[#0d1424] border border-white/10 rounded-3xl p-5 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400">shopping_bag</span>
                    <h3 className="font-gaming font-black text-base text-white">ĐƠN GỌI TẠI MÁY</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                    {wallet.pcName || 'VIP-08'}
                  </span>
                </div>

                {cartTotalQty === 0 ? (
                  <div className="py-12 text-center text-slate-500 font-mono text-xs">
                    <span className="material-symbols-outlined text-3xl mb-1 text-slate-600">lunch_dining</span>
                    <p>Chưa chọn món nào</p>
                    <p className="text-[10px] text-slate-600 mt-1">Bấm nút "+ CHỌN" để thêm món vào bàn</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto no-scrollbar font-mono text-xs">
                    {Object.entries(cart).map(([id, qty]) => {
                      const f = APP_FOODS.find((item) => item.id === id);
                      if (!f) return null;

                      return (
                        <div key={id} className="p-2.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="text-white font-bold">{f.name}</div>
                            <div className="text-[10px] text-amber-400">{f.price.toLocaleString('vi-VN')}đ x {qty}</div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setCart((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }))}
                              className="w-6 h-6 rounded bg-slate-800 text-white font-bold"
                            >
                              -
                            </button>
                            <span className="font-bold text-white px-1">{qty}</span>
                            <button
                              onClick={() => setCart((prev) => ({ ...prev, [id]: prev[id] + 1 }))}
                              className="w-6 h-6 rounded bg-slate-800 text-white font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {cartTotalQty > 0 && (
                <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Tổng thanh toán:</span>
                    <span className="text-amber-400 text-base">
                      {Object.entries(cart)
                        .reduce((sum, [id, qty]) => sum + (APP_FOODS.find((f) => f.id === id)?.price || 0) * qty, 0)
                        .toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <button
                    onClick={handleCheckoutFood}
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs uppercase shadow-lg transition"
                  >
                    XÁC NHẬN GỌI MÓN (TRỪ VÍ MÁY)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black font-gaming text-white uppercase tracking-wide">
                GỌI NHÂN VIÊN PHỤC VỤ TẬN BÀN
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Tín hiệu gửi thẳng tới màn hình bếp KDS và quầy thu ngân • Nhân viên có mặt sau 60 giây
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { type: 'TOPUP_CASH', title: 'Nạp tiền mặt 50.000đ', details: 'Khách cần nạp 50k tiền mặt tại máy', icon: 'payments', badge: 'NẠP TIỀN' },
                { type: 'TOPUP_CASH', title: 'Nạp tiền mặt 100.000đ', details: 'Khách cần nạp 100k tiền mặt tại máy', icon: 'payments', badge: 'NẠP TIỀN' },
                { type: 'HARDWARE_ISSUE', title: 'Đổi tai nghe / Mic bị rè', details: 'Tai nghe tại máy bị rè một bên hoặc lỗi mic', icon: 'headset_mic', badge: 'GEAR' },
                { type: 'HARDWARE_ISSUE', title: 'Đổi chuột gaming / Kẹt switch', details: 'Chuột double click hoặc phím kẹt', icon: 'mouse', badge: 'GEAR' },
                { type: 'CLEAN_DESK', title: 'Dọn bàn & gạt tàn thuốc', details: 'Khách yêu cầu dọn bàn và đổi gạt tàn mới', icon: 'cleaning_services', badge: 'VỆ SINH' },
                { type: 'EXTRA_SERVICE', title: 'Thêm ca đá lạnh & nước lọc', details: 'Khách xin thêm 1 ca đá riêng và giấy lau', icon: 'local_drink', badge: 'DỊCH VỤ' },
              ].map((srv, idx) => (
                <div
                  key={idx}
                  onClick={() => handleQuickCall(srv.type, srv.title, srv.details)}
                  className="p-4 rounded-2xl bg-[#0d1424] border border-white/10 hover:border-rose-500/60 transition cursor-pointer flex flex-col justify-between group shadow-lg hover:-translate-y-1"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">{srv.icon}</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300">
                        {srv.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors">{srv.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{srv.details}</p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/5 text-[11px] font-mono text-rose-400 font-bold flex justify-between items-center">
                    <span>Gửi Yêu Cầu Nhanh</span>
                    <span>🛎️</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0d1424] border border-white/10 space-y-3 shadow-lg">
              <span className="material-symbols-outlined text-emerald-400 text-3xl">bolt</span>
              <h3 className="font-bold text-base text-white">Dọn Dẹp Bộ Nhớ RAM</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Giải phóng bộ nhớ đệm cache hệ điều hành trước khi vào combat.</p>
              <button
                onClick={handleOptimizeRam}
                className="w-full py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 font-bold text-xs rounded-xl transition font-mono"
              >
                {ramOptimized ? 'Đang dọn dẹp...' : 'Dọn RAM 1-Chạm'}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1424] border border-white/10 space-y-3 shadow-lg">
              <span className="material-symbols-outlined text-[#5865F2] text-3xl">forum</span>
              <h3 className="font-bold text-base text-white">Discord Voice &amp; Chat</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Kết nối nhanh vào phòng voice clan và server Discord của quán.</p>
              <button
                onClick={() => showToast('Đang khởi chạy Discord overlay trên máy trạm...')}
                className="w-full py-2.5 bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-indigo-300 border border-[#5865F2]/50 font-bold text-xs rounded-xl transition font-mono"
              >
                Mở Discord Desktop
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1424] border border-white/10 space-y-3 shadow-lg">
              <span className="material-symbols-outlined text-purple-400 text-3xl">mouse</span>
              <h3 className="font-bold text-base text-white">Logitech G-Hub / Zowie</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Chỉnh DPI chuột, polling rate 1000Hz-4000Hz và macro gaming.</p>
              <button
                onClick={() => showToast('Đang mở phần mềm cấu hình Gaming Gear...')}
                className="w-full py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/50 font-bold text-xs rounded-xl transition font-mono"
              >
                Chỉnh DPI Chuột
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1424] border border-white/10 space-y-3 shadow-lg">
              <span className="material-symbols-outlined text-cyan-400 text-3xl">speed</span>
              <h3 className="font-bold text-base text-white">Tối Ưu Ping &amp; Mạng</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Chuyển routing đường truyền 10Gbps Multi-ISP ping ≤ 1ms.</p>
              <button
                onClick={() => showToast('Đã kích hoạt chế độ Gaming QoS Low-Latency!')}
                className="w-full py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 font-bold text-xs rounded-xl transition font-mono"
              >
                Kích Hoạt Low-Ping
              </button>
            </div>
          </div>
        )}

        
        {activeTab === 'gamerpass' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-gradient-to-br from-[#131d36] to-[#090e1c] border border-amber-400/40 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">HẠNG THÀNH VIÊN HIỆN TẠI</span>
                  <h3 className="text-2xl font-black text-white font-gaming">{currentTier.name}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-2xl border border-amber-400/40">
                  <span className="material-symbols-outlined">{currentTier.icon}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Ưu đãi giờ chơi:</span>
                  <strong className="text-emerald-400">Giảm {currentTier.playTimeDiscountPercent}% tiền giờ</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Ưu đãi menu Bếp F&amp;B:</span>
                  <strong className="text-amber-400">Giảm {currentTier.fnbDiscountPercent}% đồ ăn/nước</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tích lũy nạp ví:</span>
                  <strong className="text-white">{getCumulativeTopupAmount(wallet).toLocaleString('vi-VN')}đ</strong>
                </div>
              </div>

              <button
                onClick={() => setQuickTopupModal(true)}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black rounded-xl text-xs uppercase shadow-lg transition"
              >
                NẠP THÊM ĐỂ THĂNG HẠNG KIM CƯƠNG &rarr;
              </button>
            </div>

            <div className="lg:col-span-6 bg-[#0d1424] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <h3 className="font-gaming font-black text-lg text-white mb-2">ĐIỂM DANH HẰNG NGÀY &amp; VÒNG QUAY</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  Mỗi ngày online tại máy trạm, bạn nhận được 01 lượt quay thưởng miễn phí nhận đến 2 giờ chơi hoặc 1 phần mì Indomie.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => showToast('Chúc mừng! Bạn đã nhận 30 phút chơi miễn phí từ điểm danh hằng ngày.')}
                  className="w-1/2 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 font-mono"
                >
                  📅 Điểm Danh
                </button>
                <button
                  onClick={() => showToast('Vòng quay: Bạn đã trúng 1x Sting Dâu Đá ướp lạnh!')}
                  className="w-1/2 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl font-mono"
                >
                  🎰 Vòng Quay May Mắn
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      
      <footer className="sticky bottom-0 z-40 bg-[#050811]/95 backdrop-blur-md border-t border-white/10 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 px-3 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white font-bold">{wallet.pcName || 'VIP-08'}</span>
            <span className="text-amber-400 font-bold ml-1">{formatHMS(remainingPlaySeconds)}</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">Ví: <strong className="text-emerald-400">{wallet.balance.toLocaleString('vi-VN')}đ</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('games')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${activeTab === 'games' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-[15px]">sports_esports</span>
            <span>Kho Game</span>
          </button>

          <button
            onClick={() => setActiveTab('fnb')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${activeTab === 'fnb' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-[15px]">restaurant_menu</span>
            <span>Đặt Món F&amp;B</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${activeTab === 'services' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-[15px]">support_agent</span>
            <span>Gọi Phục Vụ</span>
          </button>
        </div>
      </footer>

      
      {toastMsg && (
        <div className="fixed top-14 right-6 z-50 bg-[#0f1a2e] border-2 border-amber-400 text-amber-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in font-mono text-xs font-bold">
          <span className="material-symbols-outlined text-amber-400 text-xl">notifications</span>
          <span>{toastMsg}</span>
        </div>
      )}

      
      {quickTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1220] border-2 border-amber-400 rounded-3xl w-full max-w-sm p-6 text-white font-mono space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-gaming font-black text-base text-amber-400 uppercase">NẠP TIỀN VÍ MÁY TRẠM</h3>
              <button onClick={() => setQuickTopupModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400">Chọn mệnh giá nạp nhanh để tiếp tục duy trì giờ chơi:</p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[20000, 50000, 100000, 200000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleQuickTopup(amt)}
                  className="py-3 bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/10 rounded-xl font-bold transition font-mono"
                >
                  +{amt.toLocaleString('vi-VN')}đ
                </button>
              ))}
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-500">
              * Quét mã VietQR tại máy hoặc nạp trực tiếp qua nhân viên
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
