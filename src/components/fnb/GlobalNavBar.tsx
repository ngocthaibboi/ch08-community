'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStoredOrders, STORAGE_EVENT_NAME } from '@/lib/orderStore';
import { getStoredWallet, WALLET_EVENT_NAME, UserWallet, INITIAL_WALLET } from '@/lib/walletStore';

export default function GlobalNavBar() {
  const pathname = usePathname();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_WALLET);

  // Check if currently inside Staff / Kitchen Operations Portal
  const isStaffPortal = pathname === '/kds' || pathname === '/dashboard';

  // Links for Player Portal (Clean, no staff clutter)
  const playerLinks = [
    { href: '/', label: 'Trang chủ', icon: 'home' },
    { href: '/booking', label: 'Sơ đồ máy', icon: 'desktop_windows' },
    { href: '/games', label: 'Menu game', icon: 'sports_esports', badge: '16 GAME', badgeBg: 'bg-cyan-500 text-slate-950' },
    { href: '/menu', label: 'Menu đồ ăn', icon: 'restaurant_menu', badge: 'HOT', badgeBg: 'bg-rose-500 text-white' },
    { href: '/auth', label: 'Nạp ví tiền', icon: 'account_balance_wallet' },
  ];

  // Links for Staff & Kitchen Operations Portal
  const staffLinks = [
    { href: '/kds', label: 'Màn hình bếp KDS', icon: 'soup_kitchen', countBadge: true },
    { href: '/dashboard', label: 'Thống kê doanh thu & Vận hành', icon: 'monitoring', liveBadge: true },
    { href: '/auth', label: 'Quầy nạp tiền', icon: 'point_of_sale' },
  ];

  const currentNavLinks = isStaffPortal ? staffLinks : playerLinks;

  // Synchronize orders count and wallet balance
  useEffect(() => {
    const updateAll = () => {
      try {
        const orders = getStoredOrders();
        const pending = orders.filter((o) => o.status === 'PENDING' || o.status === 'COOKING').length;
        setPendingOrdersCount(pending);
        setWallet(getStoredWallet());
      } catch {
        // Fallback
      }
    };

    updateAll();
    window.addEventListener(STORAGE_EVENT_NAME, updateAll);
    window.addEventListener(WALLET_EVENT_NAME, updateAll);
    window.addEventListener('storage', updateAll);

    return () => {
      window.removeEventListener(STORAGE_EVENT_NAME, updateAll);
      window.removeEventListener(WALLET_EVENT_NAME, updateAll);
      window.removeEventListener('storage', updateAll);
    };
  }, []);

  // Mouse Drag Scroll Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navContainerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - navContainerRef.current.offsetLeft);
    setScrollLeft(navContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !navContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - navContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    if (Math.abs(walk) > 4) {
      setHasMoved(true);
    }
    navContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (!navContainerRef.current) return;
    navContainerRef.current.scrollBy({
      left: direction === 'left' ? -200 : 200,
      behavior: 'smooth',
    });
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col shadow-2xl">
      {/* 24/7 Telemetry & Cyber Info Bar */}
      <div className={`px-4 py-1 flex items-center justify-between text-[11px] font-mono border-b ${
        isStaffPortal ? 'bg-[#0f140c] border-amber-900/60 text-amber-300' : 'bg-[#050912] border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-3">
          {isStaffPortal ? (
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
              CỔNG NHÂN VIÊN &amp; VẬN HÀNH BẾP (STAFF PORTAL)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              CỔNG NGƯỜI CHƠI • CYBER ZONE SERVER: ONLINE
            </span>
          )}
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline">
            {isStaffPortal
              ? `Đơn bếp đang hoạt động: ${pendingOrdersCount} đơn • Khu vực pha chế & bếp nóng sẵn sàng`
              : 'Tầng 1 & Tầng 2: 82/100 Máy Đang Hoạt Động'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline">
            Hỗ trợ 24/7: <strong className={isStaffPortal ? 'text-amber-400' : 'text-cyan-400'}>1900.8888</strong>
          </span>
          <span className={`text-[10px] px-2 py-0.2 rounded font-bold font-mono border ${
            isStaffPortal
              ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
              : 'bg-purple-950/60 border-purple-500/40 text-purple-300'
          }`}>
            {isStaffPortal ? 'STAFF / KITCHEN MODE' : 'HỘI VIÊN VIP'}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`backdrop-blur-md border-b px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-4 relative transition-colors ${
        isStaffPortal ? 'bg-[#0c1322]/98 border-amber-500/30' : 'bg-slate-900/95 border-slate-800'
      }`}>
        {/* Brand Logo */}
        <Link href={isStaffPortal ? '/kds' : '/'} className="flex items-center gap-2 group flex-shrink-0">
          <div className={`w-9 h-9 rounded-xl p-0.5 flex items-center justify-center transition-transform group-hover:scale-105 shadow-md ${
            isStaffPortal
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
          }`}>
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className={`material-symbols-outlined text-[20px] ${isStaffPortal ? 'text-amber-400' : 'text-cyan-400'}`}>
                {isStaffPortal ? 'soup_kitchen' : 'sports_esports'}
              </span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-gaming font-black text-base sm:text-lg tracking-wider text-white">
              {isStaffPortal ? 'CYBER OPS' : 'CYBER ZONE'}
            </span>
            <span className={`text-[8px] sm:text-[9px] font-mono uppercase tracking-widest font-bold ${
              isStaffPortal ? 'text-amber-400' : 'text-cyan-400'
            }`}>
              {isStaffPortal ? 'BẾP & VẬN HÀNH' : 'ESPORTS LOUNGE'}
            </span>
          </div>
        </Link>

        {/* Scrollable Navigation Bar */}
        <div className="relative flex-1 max-w-2xl mx-1 sm:mx-2 flex items-center">
          <button
            onClick={() => scrollNav('left')}
            className="hidden md:flex w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700/80 items-center justify-center mr-1 shadow-md z-10 flex-shrink-0 transition"
            title="Cuộn sang trái"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          <div
            ref={navContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center gap-1.5 sm:gap-2 overflow-x-auto select-none py-1 px-1 rounded-xl scrollbar-none transition-colors ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {currentNavLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (hasMoved) e.preventDefault();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex-shrink-0 whitespace-nowrap ${
                    isActive
                      ? isStaffPortal
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                        : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] ring-1 ring-cyan-300'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-cyan-500/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                  <span>{link.label}</span>

                  {link.badge && (
                    <span className={`${link.badgeBg || 'bg-rose-500 text-white'} text-[9px] font-black px-1.5 py-0.2 rounded font-mono shadow-sm`}>
                      {link.badge}
                    </span>
                  )}

                  {link.countBadge && pendingOrdersCount > 0 && (
                    <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full font-mono animate-pulse">
                      {pendingOrdersCount}
                    </span>
                  )}

                  {link.liveBadge && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  )}
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => scrollNav('right')}
            className="hidden md:flex w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700/80 items-center justify-center ml-1 shadow-md z-10 flex-shrink-0 transition"
            title="Cuộn sang phải"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        {/* Portal Switcher & User Balance */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isStaffPortal ? (
            <>
              {/* Player Wallet Badge */}
              <Link
                href="/auth"
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-800 border border-slate-700 px-2 sm:px-2.5 py-1.5 rounded-lg hover:border-cyan-400 transition-colors"
              >
                <span className="material-symbols-outlined text-emerald-400 text-[16px]">account_balance_wallet</span>
                <div className="flex flex-col leading-none text-left">
                  <span className="text-[8px] sm:text-[9px] text-slate-400 font-semibold uppercase">Ví Máy: {wallet.pcName}</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {wallet.balance.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </Link>

              {/* Portal Switch Button: Jump to Staff Portal */}
              <Link
                href="/kds"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-bold transition font-mono shadow-[0_0_12px_rgba(245,158,11,0.25)] cursor-pointer"
                title="Dành cho Nhân viên / Bếp: Quản lý đơn & Doanh thu"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-400">soup_kitchen</span>
                <span className="hidden sm:inline">Cổng Bếp / Vận Hành</span>
                {pendingOrdersCount > 0 && (
                  <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full font-mono animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </>
          ) : (
            <>
              {/* Portal Switch Button: Return to Player Portal */}
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-xs font-bold transition font-mono shadow-[0_0_12px_rgba(0,240,255,0.25)] cursor-pointer"
                title="Quay lại Cổng Khách Hàng / Đặt Món Tại Máy"
              >
                <span className="material-symbols-outlined text-[16px] text-cyan-400">sports_esports</span>
                <span className="hidden sm:inline">Cổng Người Chơi</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
