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

  // Kiểm tra nếu đang ở Cổng Bếp & Vận Hành
  const isStaffPortal = pathname === '/kds' || pathname === '/dashboard';

  // Interface cho menu links
  interface NavLinkItem {
    href: string;
    label: string;
    icon: string;
    badge?: string;
    badgeBg?: string;
    countBadge?: boolean;
    liveBadge?: boolean;
  }

  // 5 Chế độ trải nghiệm hệ sinh thái Cyber Game
  const ecosystemModes = [
    { href: '/', label: '1. Cổng Khách Hàng (Trang Chủ)', icon: 'public', activeBadge: 'Web Chính' },
    { href: '/client-pc', label: '2. Khách Ngồi Tại Máy (VIP-08)', icon: 'desktop_windows', activeBadge: 'Tại Bàn' },
    { href: '/server', label: '3. Máy Chủ Phòng Máy (Server Tổng)', icon: 'dns', activeBadge: 'Master Node' },
    { href: '/kds', label: '4. Màn Hình Bếp (KDS)', icon: 'soup_kitchen', countBadge: true },
    { href: '/dashboard', label: '5. Quản Lý Doanh Thu', icon: 'monitoring', liveBadge: true },
  ];

  // Menu điều hướng chi tiết
  const playerLinks: NavLinkItem[] = [
    { href: '/', label: 'Trang chủ', icon: 'home' },
    { href: '/client-pc', label: 'Màn hình máy VIP-08', icon: 'desktop_windows', badge: 'LIVE PC', badgeBg: 'bg-emerald-500 text-black' },
    { href: '/server', label: 'Máy chủ Server', icon: 'dns', badge: 'MASTER', badgeBg: 'bg-purple-500 text-white' },
    { href: '/booking', label: 'Sơ đồ máy', icon: 'table_restaurant' },
    { href: '/menu', label: 'Menu đồ ăn F&B', icon: 'restaurant_menu', badge: 'HOT', badgeBg: 'bg-rose-500 text-white' },
    { href: '/games', label: 'Kho game', icon: 'sports_esports', badge: '16 GAME', badgeBg: 'bg-cyan-500 text-slate-950' },
    { href: '/auth', label: 'Nạp ví tiền', icon: 'account_balance_wallet' },
  ];

  const staffLinks: NavLinkItem[] = [
    { href: '/server', label: 'Máy chủ Server Quản Lý', icon: 'dns', liveBadge: true },
    { href: '/kds', label: 'Màn hình bếp KDS', icon: 'soup_kitchen', countBadge: true },
    { href: '/dashboard', label: 'Thống kê doanh thu & Vận hành', icon: 'monitoring', liveBadge: true },
    { href: '/client-pc', label: 'Xem màn hình máy trạm', icon: 'desktop_windows' },
    { href: '/auth', label: 'Quầy nạp tiền', icon: 'point_of_sale' },
  ];

  const currentNavLinks = isStaffPortal ? staffLinks : playerLinks;

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

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const scrollNav = (direction: 'left' | 'right') => {
    if (!navContainerRef.current) return;
    navContainerRef.current.scrollBy({
      left: direction === 'left' ? -200 : 200,
      behavior: 'smooth',
    });
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col shadow-2xl">
      
      {/* ══════════ THANH 1: BỘ CHUYỂN ĐỔI 4 GÓC NHÌN HỆ SINH THÁI ══════════ */}
      <div className="bg-[#020617] border-b border-white/10 px-3 sm:px-4 py-2 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5">
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              CHỌN GÓC NHÌN TRẢI NGHIỆM:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {ecosystemModes.map((mode) => {
              const isActive = pathname === mode.href;
              return (
                <Link
                  key={mode.href}
                  href={mode.href}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white border border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{mode.icon}</span>
                  <span>{mode.label}</span>
                  {mode.countBadge && pendingOrdersCount > 0 && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full font-mono animate-pulse">
                      {pendingOrdersCount}
                    </span>
                  )}
                  {mode.liveBadge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  )}
                </Link>
              );
            })}
          </div>

        </div>
      </div>

      {/* ══════════ THANH 2: NAVBAR ĐIỀU HƯỚNG CHÍNH ══════════ */}
      <nav className={`backdrop-blur-md border-b px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-4 relative transition-colors ${
        isStaffPortal ? 'bg-[#0c1322]/98 border-amber-500/30' : 'bg-[#070d1e]/90 border-white/10'
      }`}>
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg transition-transform group-hover:scale-105 shadow-md ${
            isStaffPortal
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 text-black shadow-lg shadow-emerald-500/20'
          }`}>
            {isStaffPortal ? 'OPS' : 'CZ'}
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-gaming font-black text-base sm:text-lg tracking-wider text-white">
              {isStaffPortal ? (
                <>CYBER<span className="text-amber-400">OPS</span></>
              ) : (
                <>CYBER<span className="text-emerald-400">ZONE</span></>
              )}
            </span>
            <span className={`text-[8px] sm:text-[9px] font-mono uppercase tracking-widest font-bold ${
              isStaffPortal ? 'text-amber-400' : 'text-cyan-400'
            }`}>
              {isStaffPortal ? 'BẾP & VẬN HÀNH' : 'eSports & Complex'}
            </span>
          </div>
        </Link>

        {/* Scrollable Navigation Tabs */}
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
                        : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-black font-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-emerald-500/40'
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

        {/* Cụm phải: Số dư ví máy & Chuyển đổi nhanh Cổng */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isStaffPortal ? (
            <>
              {/* Ví người chơi */}
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

              {/* Nút nhảy sang Bếp */}
              <Link
                href="/kds"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-bold transition font-mono shadow-[0_0_12px_rgba(245,158,11,0.25)] cursor-pointer"
                title="Dành cho Nhân viên / Bếp: Quản lý đơn & Doanh thu"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-400">soup_kitchen</span>
                <span className="hidden sm:inline">Cổng Bếp</span>
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
              {/* Nút quay lại Cổng Khách Hàng */}
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-xs font-bold transition font-mono shadow-[0_0_12px_rgba(0,240,255,0.25)] cursor-pointer"
                title="Quay lại Cổng Khách Hàng"
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
