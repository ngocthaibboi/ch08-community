'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStoredOrders, STORAGE_EVENT_NAME } from '@/lib/orderStore';

export default function GlobalNavBar() {
  const pathname = usePathname();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  // Exact 6 links requested by user
  const navLinks = [
    { href: '/', label: 'Trang chủ', icon: 'home' },
    { href: '/booking', label: 'Sơ đồ máy', icon: 'desktop_windows' },
    { href: '/menu', label: 'Menu đồ ăn', icon: 'restaurant_menu', badge: 'HOT' },
    { href: '/kds', label: 'Màn hình bếp', icon: 'soup_kitchen', countBadge: true },
    { href: '/dashboard', label: 'Thống kê doanh thu', icon: 'monitoring', liveBadge: true },
    { href: '/auth', label: 'Nạp ví tiền', icon: 'account_balance_wallet' },
  ];

  // Update pending orders count for badge
  useEffect(() => {
    const updateCount = () => {
      try {
        const orders = getStoredOrders();
        const pending = orders.filter((o) => o.status === 'PENDING' || o.status === 'COOKING').length;
        setPendingOrdersCount(pending);
      } catch {
        // Fallback
      }
    };

    updateCount();
    window.addEventListener(STORAGE_EVENT_NAME, updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener(STORAGE_EVENT_NAME, updateCount);
      window.removeEventListener('storage', updateCount);
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
    const walk = (x - startX) * 1.6; // Scroll speed multiplier
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
    const distance = 240;
    navContainerRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col shadow-2xl">
      {/* 24/7 Telemetry & Cyber Info Bar */}
      <div className="bg-[#050912] border-b border-slate-800 px-4 py-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
            CYBER ZONE SERVER: ONLINE
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Tầng 1 &amp; Tầng 2: 82/100 Máy Đang Hoạt Động</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-300 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-cyan-400">headset_mic</span>
            Hỗ trợ 24/7: <strong className="text-cyan-400 font-bold">1900.8888</strong>
          </span>
          <span className="bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[10px] px-2 py-0.2 rounded font-bold hidden md:inline">
            HỘI VIÊN VIP
          </span>
        </div>
      </div>

      {/* Main Navbar Cyber Zone */}
      <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-4 relative">
        {/* Brand Logo Cyber Zone */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="material-symbols-outlined text-cyan-400 text-[20px]">sports_esports</span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-gaming font-black text-base sm:text-lg tracking-wider text-white group-hover:text-cyan-400 transition-colors">
              CYBER ZONE
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              ESPORTS LOUNGE
            </span>
          </div>
        </Link>

        {/* Draggable & Scrollable Menu Navigation Bar */}
        <div className="relative flex-1 max-w-4xl mx-1 sm:mx-2 flex items-center">
          {/* Scroll Left Button */}
          <button
            onClick={() => scrollNav('left')}
            className="hidden md:flex w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700/80 items-center justify-center mr-1 shadow-md z-10 flex-shrink-0 transition"
            title="Cuộn sang trái"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          {/* Draggable Scroll Area */}
          <div
            ref={navContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center gap-1.5 sm:gap-2 overflow-x-auto select-none py-1 px-1 rounded-xl scrollbar-none transition-colors ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    // Prevent accidental navigation when dragging
                    if (hasMoved) {
                      e.preventDefault();
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex-shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] ring-1 ring-cyan-300'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-cyan-500/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                  <span>{link.label}</span>

                  {link.badge && (
                    <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded font-mono">
                      {link.badge}
                    </span>
                  )}

                  {link.countBadge && pendingOrdersCount > 0 && (
                    <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full font-mono animate-pulse">
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

          {/* Scroll Right Button */}
          <button
            onClick={() => scrollNav('right')}
            className="hidden md:flex w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700/80 items-center justify-center ml-1 shadow-md z-10 flex-shrink-0 transition"
            title="Cuộn sang phải"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        {/* Quick User Balance & Topup Action */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/auth"
            className="flex items-center gap-1.5 sm:gap-2 bg-slate-800 border border-slate-700 px-2 sm:px-2.5 py-1.5 rounded-lg hover:border-cyan-400 transition-colors"
          >
            <span className="material-symbols-outlined text-emerald-400 text-[16px]">account_balance_wallet</span>
            <div className="flex flex-col leading-none text-left">
              <span className="text-[8px] sm:text-[9px] text-slate-400 font-semibold uppercase">Ví Máy: VIP-08</span>
              <span className="font-mono text-xs font-bold text-emerald-400">250.000đ</span>
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
}
