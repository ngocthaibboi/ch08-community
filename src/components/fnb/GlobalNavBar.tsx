'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalNavBar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/menu',
      label: 'Menu Gọi Món',
      sublabel: 'Client Quán Net',
      icon: 'restaurant_menu',
      badge: 'SCREEN_2',
      color: 'cyan',
    },
    {
      href: '/kds',
      label: 'Màn Hình Bếp KDS',
      sublabel: 'Điều Hành Bếp & Bar',
      icon: 'soup_kitchen',
      badge: 'SCREEN_4',
      color: 'amber',
    },
    {
      href: '/dashboard',
      label: 'Dashboard F&B',
      sublabel: 'Doanh Thu & Hỗ Trợ',
      icon: 'monitoring',
      badge: 'REPORT',
      color: 'emerald',
    },
    {
      href: '/booking',
      label: 'Sơ Đồ Máy Trạm',
      sublabel: 'Chọn Máy VIP-08',
      icon: 'grid_view',
      badge: 'MAP',
      color: 'purple',
    },
  ];

  return (
    <nav className="bg-[#050912] border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between z-50 sticky top-0 backdrop-blur-md">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <div className="w-full h-full bg-[#070e1d] rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-cyan-400 text-[18px]">sports_esports</span>
            </div>
          </div>
          <span className="font-gaming font-black text-xs tracking-wider text-cyan-400 hidden sm:inline">
            CYBER GAME
          </span>
        </Link>
        <span className="text-slate-600 hidden md:inline">|</span>
        <span className="text-[10px] text-slate-400 font-mono hidden md:inline bg-[#0c1424] px-2 py-0.5 rounded border border-slate-800">
          Nhánh: <span className="text-emerald-400 font-bold">feature/fnb</span> (Minh Nhật)
        </span>
      </div>

      {/* Main Switcher Buttons */}
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden lg:inline mr-1">
          Chuyển màn hình:
        </span>

        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                isActive
                  ? item.color === 'cyan'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)] font-bold'
                    : item.color === 'amber'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(255,183,3,0.3)] font-bold'
                    : item.color === 'emerald'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-bold'
                    : 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)] font-bold'
                  : 'bg-[#0d1424] hover:bg-[#152038] text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-inherit' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-slate-300 border border-slate-700/60 hidden md:inline">
                {item.badge}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block"></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Database & Sync Status Indicator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-[#0c1424] border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          <span className="text-emerald-400 font-bold hidden xl:inline">SUPABASE CONNECTED</span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">(pgbouncer:6543)</span>
        </div>
      </div>
    </nav>
  );
}
