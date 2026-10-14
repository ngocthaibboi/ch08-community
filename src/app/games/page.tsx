'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getStoredWallet, WALLET_EVENT_NAME, UserWallet, INITIAL_WALLET } from '@/lib/walletStore';

interface GameItem {
  id: string;
  name: string;
  platform: 'steam' | 'riot' | 'garena' | 'other';
  platformLabel: string;
  badge?: string;
  image: string;
  categories: string[];
}

const GAMES_LIST: GameItem[] = [
  {
    id: 'game-1',
    name: 'Black Myth: Wukong',
    platform: 'steam',
    platformLabel: 'STEAM',
    badge: 'HOT',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzkSMq1TKCxW-P4Tyq_oGAJrujxwZLU2E8YGevaRG6L65heDlLNLQhFsRGB46uc2eMTrfrf9aV6XyDz6awgkG2-RE_YUhaX03Eq1sEZ7HJyUnPuaPT9aBvlIfTYxk36j8JYL0KkAY0JVgyMCBM-kT2uvIO2MMp71Di7eG_5KZC05SAOSeP_IlT9RAY8hH5IksZkfuT8x_3Q5b_D7ohykbZwQc9Wc41Osrb2eu37IS-6_8qY4wOmSZG',
    categories: ['rpg', 'aaa'],
  },
  {
    id: 'game-2',
    name: 'LMHT (LoL)',
    platform: 'riot',
    platformLabel: 'RIOT/VNG',
    badge: 'TOP 1',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMh8ZjJKSY-hDfVBCfwABNCTxRgTZG10L5YMmrTns0xjctwrUXqWMRahhCjJ5e7zqzl8uF-jta_c1ynPWbgtcrsLPY999UdXGI7Nhajna98t3HfAHo0kXp1SWM-pET1QoNXV_l4OuSqnqTJ61Tkkb7xc8zbP-xMku78Oztk4eeNLi7TOT_qTQ9EcTraLUARcK0OCa_pvRZj6lCCXElLehCwZyr8K1-evJZH4pCwFRWy5vMAemuR4Ac',
    categories: ['esports', 'moba'],
  },
  {
    id: 'game-3',
    name: 'Valorant',
    platform: 'riot',
    platformLabel: 'RIOT',
    badge: '240Hz',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5hR9PLfWtbhbOi-WDhXt9yZWZUgsI1tj10eV37UDf80GIS0WFuOXQgwUSfxrYlZnb6oxltIK-EsK_8AzScl_uTqHADWa_wjeq-nOE2pai4bSM-_D6OLMgYjo7uB4t1YBC8k1f9UpBVf9qQUwIdxJ311Hl4HeVAylACgBUkxgEB-aV_ZFIIZvL2PvwpI6kzfx_sHafii_t_khjz8WsnoywBTNQz7Mf-lY7zjhv-NVPXSPJ6ffk35Ls',
    categories: ['esports', 'fps'],
  },
  {
    id: 'game-4',
    name: 'Counter-Strike 2',
    platform: 'steam',
    platformLabel: 'STEAM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEG5Z51qHJskujQD4bHi9dp-WjKam9MWRmxzTszoUYUGR-C2GN0JlhR2GV_UsKbGpbyN0Zs7yhxFKmRTzNaGk3uaIk8iOxz9kALQz1DGTV_zPq-8Zc9bDgQAqGF2XRo90Z5dybxwHjLjX1YAvHkjfV7MaNf8U-YK5DZQG-M8Pj0jowYpm2b3yrzK8ETDukPweNdt3WdRHy1Msevj6ab5dIbYX6L8SrtFvVCxFd09nDfSchC6t8--o9',
    categories: ['esports', 'fps'],
  },
  {
    id: 'game-5',
    name: 'FC Online (FO4)',
    platform: 'garena',
    platformLabel: 'GARENA',
    badge: 'HOT',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5ZHY-IIPQ4SbBXYve5568SYd1fw48fS_E6voSVRLLIWDiQv74i_y18NQjmCsqtD_4JsC5W-QOzkQurEuziC9UVEFGGvgf3BroT2xPJyiuxc70YLTu44ESZeIoVWnw7gPb5QhpEXFwVJtXHcaBjwtTWyk8sMqEfIbgH39h-6z7iQSm9Nw7uPwYe5Etl6JvXdLHTlud1Ihisk43YYG_qYj6OuT3vdHUbwBr7j-6S6Br-3ncNg2ctsx_',
    categories: ['esports'],
  },
  {
    id: 'game-6',
    name: 'PUBG: BATTLEGROUNDS',
    platform: 'steam',
    platformLabel: 'STEAM',
    badge: 'ULTRA',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ8dqRxHk7EuPZN8_1BGltr5OYnAkj4TbT8c5JO4v6630hccGgShpEEgwby2yF5nD_as-5GXPeX4_-t1xJO4JZlr1g1J1qYPmr92Ak3I0pe8FOeJbWeAsi_cpfAy22OFj0E1oKAzGug7WNjl3O0CvUvk3JcLRpRQ0FGFzYWQUExn3r7SUeiRg-6xOKroEan7SSr8kD6vfKkS-LMDlOPZkele24Rg1DNqia1s8WFaO1FgGex1UGJ9tL',
    categories: ['esports', 'fps', 'battle-royale'],
  },
  {
    id: 'game-7',
    name: 'GTA V (FiveM)',
    platform: 'other',
    platformLabel: 'FIVEM',
    badge: 'ROLEPLAY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBN8DTkrrdURUkVDToP0InwI6CNn7FDbJkMQIgC8wdXU5io491vTOIc4w4MwAtVsLaGIvJ2sr-ioLpftmD6wN_Bq_1Wq4ETjKvoomXrX35FV24zVuO-gKg3ikVLBIYlmssvpKdW793vSmB3zO2n27AxMXhcmiWsksmuDIOsrjpPF0DoyjKjNZ4csQoa5bkE86Dy7pM7RfgjKRQpodYDTWvuNepA5Uytll4hqroNnT4eBMg80_kLDoF',
    categories: ['rpg', 'roleplay'],
  },
  {
    id: 'game-8',
    name: 'Naraka: Bladepoint',
    platform: 'steam',
    platformLabel: 'STEAM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsDYn0smoOe8mf1DYibfNT-kGM4dpBo5Uh5CzoVIaCacjUtEwHrkXy2whZ7ff1_hNl2D9k7aZH8Us-bzcmGSNJd9D8zLFcdxZgY4mUEsL7Yx1hEUzW3gaFHqH972kHTxS4VFv5wiNIhY5q_eT_ivDEG5CBfIeHUkeuiS-22LqSQdhRvTm6swF6MkJR1d3vhNFebYWMCUwh7waAvok2y63hp8Dkf6mqO2MnDOadJlKZUi2riSQprt3r',
    categories: ['battle-royale'],
  },
  {
    id: 'game-9',
    name: 'Genshin Impact',
    platform: 'other',
    platformLabel: 'HOYOVERSE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF5NVEgwKqofL1rjLsN8xVd1Pz7r5M70gGEZSej2wKArUmWPm0w5lrSP6coKhPsi3mpoXRhpcCmkbOzy1qFtVQGN5y5SlMhSt6SUYv1KU0Tt50migDcAhR762zMdLZN7fr3RdIkxI9RT7vPNmqpVOvbm1Xnhd0SYL5C_Crcq6m5kNN3vUqLBudQJ_LK-f1q7xxG4BCXNrmH5kmAjUwfzBoN1bvUF9InIUFQh5U9airgN3cUsM9-EYM',
    categories: ['rpg'],
  },
  {
    id: 'game-10',
    name: 'Dota 2',
    platform: 'steam',
    platformLabel: 'STEAM',
    badge: 'TI PRO',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2B7pB8BaB6wwIvtqY2x6cMGEhh1fOLIHdbeWJHw1AHPc10_dNDlz6B1Jbq0W2w3JHlpi8E3QCmGMmF-o0fhTQBTOVg5hspeGmeugKlpi_7KI8fIQQ8-5wjCDeHK-pNwvUyHxwocZXb22EFBTHIdBwGfMsUszbwTt5PkIQaW2A_n1EwJDIbvuOG6LObp3d8VuKgKgThJY_aKf6_eE1Core_yhbWz2O6SiVZ7JmAA6umJRHGshK3aXQ',
    categories: ['esports', 'moba'],
  },
  {
    id: 'game-11',
    name: 'Apex Legends',
    platform: 'steam',
    platformLabel: 'STEAM/EA',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5NSqeBIqL6zMcsL4sYFfHjpgvJHcYVhiHqrnA4W0IaylyUe_JXraUGsEs84p8baio9QfXNn4n0ne9NKyGKK_gKxMznIP4ZbsOec13GSl1ad0HFgI1NxFdhLn3NUFdQ-qsYPi1MfbkBjEZFY8HMXVyEbs6hLUESyuM42hMQOUiV4WuVce4WBL9BZQNOzmqruIrR8uMzCyJI5wHfDQAozMRbX3biAI5qbJftse8cHUD9x5NqkXPE_JZ',
    categories: ['fps', 'battle-royale'],
  },
  {
    id: 'game-12',
    name: 'Đấu Trường Chân Lý',
    platform: 'riot',
    platformLabel: 'RIOT',
    badge: 'MÙA MỚI',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh6LZ9Jev80VpQIlCS5ZitMbsets5WKSJc7ox3VEEfxO1wi-vgVN-qwreUoGdkM5tkR8NqqsltXdcadR5c2ed8Tz-27XgP-ygac7MO4IRZVNOimLRZMvDTv6Z2aTilxcv2lvQI1Nr13uC2aVHQUSfK7FsemDfbQfTEJbMqyiI2mchC_if_aMqG6u3hRts8BmkiN6ARW3PR3pPLZU33sF8_R-DQIrPbCbmWrRRdYfUpFl9824-IwKc7',
    categories: ['moba'],
  },
  {
    id: 'game-13',
    name: 'COD: Warzone',
    platform: 'other',
    platformLabel: 'BATTLE.NET',
    badge: 'DLSS 3',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAySgVQBb4592kcYkP0dNA77bWB-eiHZdNs7WcaB0F4Lrg24FNB3qRs_Wp2M5qKV-nUvPiZa52FWRCxJTq3mzIwJZpRYOElgunG3yUfxm9Kb5IEZDRZSV-Mdjf4QFX1Qrp6Eg6p2-1_tincxBPH9yidQUAMKXQ4kBK3RXnUfRkq72RU8F686uaQo9_G3yjARaQxzcB1eTKRJs6X3O_4zm29P0Ua544jDoJIGKxCKlJllYCjyON80dwx',
    categories: ['fps', 'battle-royale'],
  },
  {
    id: 'game-14',
    name: 'Elden Ring',
    platform: 'steam',
    platformLabel: 'STEAM',
    badge: 'DLC OUT',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz9vx5H_6fggvwQ4dchScj7K_Zlr5CV3owN9FDub4sKfnXznBs4dj0TagegXlsGqmizq0gbCa4SCImTY2rtM23DXalfM88ZU1e6FnXoyjH_NL3cLIjyHKuQqlZpPrrp-AAqiXyos5DU9ayaWjI6B8tmW-LuEKILB6N2M69J-wqL00ezvklyLIfVOjiieOcT6uf8MQjOMuTO-qk_4AXR5UqcQDNpaNLK553eKzzCTsK__CZ60OgsQXv',
    categories: ['rpg', 'aaa'],
  },
  {
    id: 'game-15',
    name: 'Honkai: Star Rail',
    platform: 'other',
    platformLabel: 'HOYOVERSE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBTAwyaok-FQ3cobHnjQQlPP1uuaD_2UB1Xvt_PVPrSiiqK134WFTebxjQl6z610XyxxpmIOfNgfsXpEJvHkX_5VNL8unuFsPqTua1v8eoCwQakTdxxNzUGV2aP1eaeF8p4rc_kiUB7OBfugZAhZAfxJBHwjCBKTZDd2RKImjvDSTHd9T-5KLynUTNCV6pxMtFzXWPe60mGBTRKqZgyW8LAfD9NO9a7rtTs1vwoSVpPgLeLPOa1kwT',
    categories: ['rpg'],
  },
  {
    id: 'game-16',
    name: 'Overwatch 2',
    platform: 'other',
    platformLabel: 'BATTLE.NET',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu4-oMrXKiyYy-uuWtlJ0x7LHzryaxAIcvUELqpNpZ0HcKxYjTIDq6xI2mYN-thddcrHWnVt5id3xsJA0KOdl2WscTPbcl-yhAmMAY8aK34xc4Rv8zCjQn45dp8tJ2GxHXxgd0KOVL-Hlf9b-I9lXpvwNyO6_k_ObI1690lFz3ckEGZpouWRrN0ZkNWhmvFzGYu3OSklK54TBxg3mccNiEDnNBytI-pKQFK7IEE8DySFjWbtbPImvh',
    categories: ['fps', 'esports'],
  },
];

export default function GameMenuPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [launchingGame, setLaunchingGame] = useState<string | null>(null);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [launchStatus, setLaunchStatus] = useState('ĐANG KẾT NỐI SERVER...');
  const [ramOptimized, setRamOptimized] = useState(false);
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_WALLET);

  // Synchronize wallet state
  useEffect(() => {
    setWallet(getStoredWallet());
    const handleWalletUpdate = () => {
      setWallet(getStoredWallet());
    };
    window.addEventListener(WALLET_EVENT_NAME, handleWalletUpdate);
    window.addEventListener('storage', handleWalletUpdate);
    return () => {
      window.removeEventListener(WALLET_EVENT_NAME, handleWalletUpdate);
      window.removeEventListener('storage', handleWalletUpdate);
    };
  }, []);

  // Hotkey F2 to search games
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        const input = document.getElementById('gameSearchInputReal');
        if (input) {
          input.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Exact categories counts matching the 16 games
  const categoryCounts = useMemo(() => {
    return {
      all: GAMES_LIST.length, // 16
      esports: GAMES_LIST.filter((g) => g.categories.includes('esports')).length, // 6
      fps: GAMES_LIST.filter((g) => g.categories.includes('fps')).length, // 5
      moba: GAMES_LIST.filter((g) => g.categories.includes('moba')).length, // 3
      'battle-royale': GAMES_LIST.filter((g) => g.categories.includes('battle-royale')).length, // 4
      rpg: GAMES_LIST.filter((g) => g.categories.includes('rpg')).length, // 4
    };
  }, []);

  // Filtered games
  const filteredGames = useMemo(() => {
    return GAMES_LIST.filter((game) => {
      const matchSearch =
        !searchQuery.trim() ||
        game.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchPlatform =
        selectedPlatform === 'all' || game.platform === selectedPlatform;
      const matchCategory =
        selectedCategory === 'all' || game.categories.includes(selectedCategory);
      return matchSearch && matchPlatform && matchCategory;
    });
  }, [searchQuery, selectedPlatform, selectedCategory]);

  const handleLaunchGame = (gameName: string) => {
    setLaunchingGame(gameName);
    setLaunchProgress(20);
    setLaunchStatus('ĐANG ĐỒNG BỘ CLOUD SAVE...');

    setTimeout(() => {
      setLaunchProgress(65);
      setLaunchStatus('TỐI ƯU CẤU HÌNH 240Hz & ANTI-CHEAT...');
    }, 600);

    setTimeout(() => {
      setLaunchProgress(100);
      setLaunchStatus('VÀO GAME THÀNH CÔNG!');
    }, 1400);

    setTimeout(() => {
      setLaunchingGame(null);
      setLaunchProgress(0);
    }, 2100);
  };

  const handleOptimizeRam = () => {
    setRamOptimized(true);
    setTimeout(() => setRamOptimized(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070e1d] text-slate-100 font-sans flex flex-col select-none">
      {/* Sub-header Telemetry Bar - Synchronized with Cyber Zone Hardware */}
      <div className="bg-[#0c1322] border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-cyan-500/40 px-3 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-gaming font-black text-cyan-400">VỊ TRÍ: {wallet.pcName}</span>
            <span className="text-slate-500">• TẦNG 2</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
            <span className="material-symbols-outlined text-emerald-400 text-[16px]">wifi</span>
            <span>Ping:</span>
            <span className="text-emerald-400 font-bold">1ms</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
            <span className="material-symbols-outlined text-cyan-400 text-[16px]">speed</span>
            <span>Diskless:</span>
            <span className="text-cyan-400 font-bold">10 Gbps</span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
            <span className="material-symbols-outlined text-purple-400 text-[16px]">memory</span>
            <span>RTX 4070 Ti Super:</span>
            <span className="text-emerald-400 font-bold">52°C</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
            <span className="material-symbols-outlined text-amber-400 text-[16px]">desktop_windows</span>
            <span>Màn Hình:</span>
            <span className="text-amber-400 font-bold">240Hz</span>
          </div>
        </div>

        {/* Quick Tools & RAM Optimizer */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => alert('Đang mở ứng dụng voice chat Discord trên máy trạm...')}
              className="px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] font-bold"
            >
              <span className="material-symbols-outlined text-[15px] text-[#5865F2]">forum</span> Discord
            </button>
            <button
              onClick={() => alert('Đang mở TeamSpeak 3 kết nối room thi đấu...')}
              className="px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] font-bold"
            >
              <span className="material-symbols-outlined text-[15px] text-cyan-400">record_voice_over</span> TS3
            </button>
            <button
              onClick={() => alert('Đang mở Logitech G-Hub tùy chỉnh DPI chuột và tai nghe...')}
              className="px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] font-bold"
            >
              <span className="material-symbols-outlined text-[15px] text-purple-400">mouse</span> G-Hub
            </button>
          </div>

          <button
            onClick={handleOptimizeRam}
            className="flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:brightness-110 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.3)] transition active:scale-95 cursor-pointer font-mono"
          >
            <span className={`material-symbols-outlined text-[16px] ${ramOptimized ? 'animate-spin' : ''}`}>
              bolt
            </span>
            <span>{ramOptimized ? 'ĐÃ GIẢI PHÓNG 3.2GB RAM!' : 'TỐI ƯU RAM'}</span>
          </button>
        </div>
      </div>

      {/* Search HUD & Platform Filter Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 text-[18px]">
                search
              </span>
              <input
                id="gameSearchInputReal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhanh tựa game (nhấn F2)..."
                type="text"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-14 py-2 text-xs focus:border-cyan-400 focus:outline-none placeholder:text-slate-500 font-mono transition"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 text-cyan-400 rounded border border-slate-700">
                F2
              </kbd>
            </div>

            {/* Platform Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'riot', label: 'Riot Games' },
                { id: 'steam', label: 'Steam' },
                { id: 'garena', label: 'Garena' },
                { id: 'other', label: 'Battle.net / Khác' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition whitespace-nowrap cursor-pointer ${
                    selectedPlatform === p.id
                      ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Categories with EXACT COUNTS (16 total) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-slate-800/80">
            {[
              { id: 'all', label: `TẤT CẢ (${categoryCounts.all})` },
              { id: 'esports', label: `ESPORTS THI ĐẤU (${categoryCounts.esports})` },
              { id: 'fps', label: `BẮN SÚNG FPS (${categoryCounts.fps})` },
              { id: 'moba', label: `CHIẾN THUẬT MOBA (${categoryCounts.moba})` },
              { id: 'battle-royale', label: `SINH TỒN BATTLE ROYALE (${categoryCounts['battle-royale']})` },
              { id: 'rpg', label: `NHẬP VAI RPG / AAA (${categoryCounts.rpg})` },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Game Grid (16 Games) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-2xl">sports_esports</span>
            <h2 className="text-xl font-black text-white font-gaming tracking-wide uppercase">
              KHO GAME CÀI SẴN TẠI MÁY
            </h2>
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
              100% BẢN QUYỀN
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Hiển thị: <strong className="text-cyan-400">{filteredGames.length} / 16</strong> game
          </span>
        </div>

        {filteredGames.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
            <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">search_off</span>
            <p className="font-bold text-slate-300">Không tìm thấy game phù hợp</p>
            <p className="text-xs text-slate-500 mt-1">Thử đổi từ khóa hoặc chọn "TẤT CẢ"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game.name)}
                className="group relative flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-400 transition-all cursor-pointer shadow-lg hover:-translate-y-1.5 duration-200"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-800">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500 ease-out"
                    style={{ backgroundImage: `url('${game.image}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>

                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 font-mono text-[9px] text-cyan-300 font-bold border border-cyan-400/30">
                    {game.platformLabel}
                  </span>

                  {game.badge && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-[9px] font-bold border border-rose-500/40">
                      {game.badge}
                    </span>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-slate-950/60 backdrop-blur-[2px]">
                    <button className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg font-mono">
                      <span className="material-symbols-outlined text-[16px]">play_arrow</span> CHƠI
                    </button>
                  </div>
                </div>

                <div className="p-2.5 text-center bg-slate-900 border-t border-slate-800">
                  <h3 className="font-bold text-xs text-white truncate group-hover:text-cyan-400 transition-colors">
                    {game.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Interactive Game Launch Modal */}
      {launchingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.3)] flex flex-col items-center text-center gap-4 relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-pulse">
              <span className="material-symbols-outlined text-cyan-400 text-3xl">sports_esports</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-gaming uppercase tracking-wide">
                ĐANG KHỞI CHẠY: {launchingGame.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Đang đồng bộ Cloud Save & tối ưu tần số quét 240Hz / RTX 4070 Ti Super...</p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${launchProgress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> DISKLESS 10GBPS
              </span>
              <span className="text-cyan-400 font-bold">{launchStatus}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
