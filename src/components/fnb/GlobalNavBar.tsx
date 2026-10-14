'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalNavBar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Trang Chủ', icon: 'home' },
    { href: '/booking', label: 'Sơ Đồ Máy', icon: 'desktop_windows', member: 'TV 2' },
    { href: '/menu', label: 'Menu Đồ Ăn', icon: 'restaurant_menu', member: 'TV 3 (Bạn)' },
    { href: '/kds', label: 'Màn Hình Bếp', icon: 'soup_kitchen', member: 'TV 3 (Bạn)' },
    { href: '/dashboard', label: 'Thống Kê Doanh Thu', icon: 'monitoring', member: 'TV 4' },
    { href: '/auth', label: 'Nạp Tiền Ví', icon: 'account_balance_wallet', member: 'TV 1 (Thái)' },
  ];

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
            Hỗ trợ kỹ thuật 24/7: <strong className="text-cyan-400 font-bold">1900.8888 (Ext 101)</strong>
          </span>
          <span className="bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[10px] px-2 py-0.2 rounded font-bold hidden md:inline">
            HỘI VIÊN VIP
          </span>
        </div>
      </div>

      {/* Main Navbar Cyber Zone */}
      <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo Cyber Zone */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="material-symbols-outlined text-cyan-400 text-[20px]">sports_esports</span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-gaming font-black text-lg tracking-wider text-white group-hover:text-cyan-400 transition-colors">
              CYBER ZONE
            </span>
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              ESPORTS GAMING LOUNGE
            </span>
          </div>
        </Link>

        {/* Navigation Items (Connecting All Branches) */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-cyan-500/40'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                <span>{link.label}</span>
                {link.member && (
                  <span
                    className={`text-[9px] font-mono px-1 py-0.2 rounded hidden xl:inline ${
                      isActive ? 'bg-black/30 text-white' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {link.member}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick User Balance & Topup Action */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/auth"
            className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded-lg hover:border-cyan-400 transition-colors"
          >
            <span className="material-symbols-outlined text-emerald-400 text-[16px]">account_balance_wallet</span>
            <div className="flex flex-col leading-none text-left">
              <span className="text-[9px] text-slate-400 font-semibold uppercase">Ví Máy: VIP-08</span>
              <span className="font-mono text-xs font-bold text-emerald-400">250.000đ</span>
            </div>
          </Link>

          <Link
            href="/auth"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-3 py-2 rounded-lg transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] hidden sm:flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">add_circle</span>
            <span>Nạp Thẻ</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
