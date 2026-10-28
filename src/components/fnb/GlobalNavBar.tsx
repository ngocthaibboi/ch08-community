'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStoredOrders, STORAGE_EVENT_NAME } from '@/lib/orderStore';
import { getStoredWallet, WALLET_EVENT_NAME, UserWallet, INITIAL_WALLET } from '@/lib/walletStore';
import { getLoggedInUser, logoutUser, AUTH_EVENT_NAME, AuthUser } from '@/lib/authStore';
import AuthModal from '@/components/auth/AuthModal';

export default function GlobalNavBar() {
  const pathname = usePathname();
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_WALLET);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Thanh Giao diện hệ thống: Trượt lên / Trượt xuống khi rê chuột
  const [isSystemDrawerOpen, setIsSystemDrawerOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Modal Auth
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Dropdown Khu máy
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 5 Chế độ trải nghiệm hệ sinh thái Cyber Game
  const ecosystemModes = [
    { href: '/', label: '1. Cổng Khách Hàng (Trang Chủ)', icon: 'public' },
    { href: '/client-pc', label: '2. Khách Ngồi Tại Máy (VIP-08)', icon: 'desktop_windows' },
    { href: '/server', label: '3. Máy Chủ Phòng Máy (Server Tổng)', icon: 'dns' },
    { href: '/kds', label: '4. Màn Hình Bếp (KDS)', icon: 'soup_kitchen', countBadge: true },
    { href: '/dashboard', label: '5. Quản Lý Doanh Thu', icon: 'monitoring', liveBadge: true },
  ];

  useEffect(() => {
    const updateAll = () => {
      try {
        const orders = getStoredOrders();
        const pending = orders.filter((o) => o.status === 'PENDING' || o.status === 'COOKING').length;
        setPendingOrdersCount(pending);
        setWallet(getStoredWallet());
        setCurrentUser(getLoggedInUser());
      } catch {
        // Fallback
      }
    };

    updateAll();
    window.addEventListener(STORAGE_EVENT_NAME, updateAll);
    window.addEventListener(WALLET_EVENT_NAME, updateAll);
    window.addEventListener(AUTH_EVENT_NAME, updateAll);
    window.addEventListener('storage', updateAll);

    // Click outside to close dropdown
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener(STORAGE_EVENT_NAME, updateAll);
      window.removeEventListener(WALLET_EVENT_NAME, updateAll);
      window.removeEventListener(AUTH_EVENT_NAME, updateAll);
      window.removeEventListener('storage', updateAll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalTab(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
      logoutUser();
      setCurrentUser(null);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col shadow-2xl">
      
      {/* ══════════ THANH 1: BỘ CHUYỂN ĐỔI 5 GÓC NHÌN (TRƯỢT LÊN / TRƯỢT XUỐNG KHI RÊ CHUỘT) ══════════ */}
      <div
        onMouseEnter={() => setIsSystemDrawerOpen(true)}
        onMouseLeave={() => {
          if (!isPinned) setIsSystemDrawerOpen(false);
        }}
        className="relative z-50 transition-all duration-300"
      >
        {/* Thanh nội dung trượt thông minh */}
        <div
          className={`bg-[#020617]/98 backdrop-blur-xl border-b border-emerald-500/30 font-mono text-[10px] sm:text-[11px] overflow-hidden transition-all duration-300 ease-in-out shadow-2xl ${
            isSystemDrawerOpen || isPinned
              ? 'max-h-32 opacity-100 py-2 px-3 sm:px-4'
              : 'max-h-0 opacity-0 py-0 px-3 sm:px-4 pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold text-emerald-400 uppercase tracking-wider">
                CHỌN GIAO DIỆN HỆ THỐNG:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {ecosystemModes.map((mode) => {
                const isActive = pathname === mode.href;
                return (
                  <Link
                    key={mode.href}
                    href={mode.href}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black shadow-[0_0_12px_rgba(16,185,129,0.35)] scale-105'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white border border-white/10 hover:border-emerald-500/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{mode.icon}</span>
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

              {/* Nút ghim cố định nếu muốn */}
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? 'Bỏ ghim (tự động ẩn khi rời chuột)' : 'Ghim cố định thanh này'}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer ${
                  isPinned
                    ? 'bg-emerald-400 text-black shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">{isPinned ? 'push_pin' : 'keep'}</span>
                <span>{isPinned ? 'Đã ghim' : 'Ghim'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Handle nhỏ gọn ở mép trên (hiện ra khi thanh bị thu gọn để người dùng lướt chuột vào là trượt xuống) */}
        {!isPinned && (
          <div className="flex justify-center -mb-2 relative z-10 pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsSystemDrawerOpen(!isSystemDrawerOpen)}
              className="flex items-center gap-1.5 px-3 py-0.5 rounded-b-xl bg-[#020617]/95 border-x border-b border-emerald-500/40 text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 hover:text-emerald-400 hover:border-emerald-400 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition group cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse group-hover:scale-125 transition"></span>
              <span className="tracking-wider">GIAO DIỆN HỆ THỐNG</span>
              <span className="material-symbols-outlined text-[13px] group-hover:translate-y-0.5 transition duration-200">
                {isSystemDrawerOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ══════════ THANH 2: TOP ANNOUNCEMENT BAR (Chuẩn Ảnh Mẫu) ══════════ */}
      <div className="bg-black/90 border-b border-white/10 text-[11px] text-slate-400 py-1.5 px-4 font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ĐANG MỞ CỬA 24/7
            </span>
            <span className="hidden sm:inline text-slate-300">
              📍 182 Lê Duẩn, TP. Vinh (Gần ĐH Vinh)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-amber-300 font-semibold">
              ⚡ Tặng 100% nạp lần đầu cho Tân thủ
            </span>
            <a href="tel:19008888" className="text-cyan-400 hover:text-white transition font-bold flex items-center gap-1">
              📞 Hotline: 1900 8888
            </a>
          </div>
        </div>
      </div>

      {/* ══════════ THANH 3: NAVBAR CHÍNH (Đầy Đủ Nút Đăng Nhập / Đăng Ký - Không Có Menu Bếp) ══════════ */}
      <nav className="border-b border-white/10 bg-[#070d1e]/95 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Thương Hiệu */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              CZ
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg sm:text-xl font-black tracking-wider text-white font-gaming block">
                CYBER<span className="text-emerald-400">ZONE</span>
              </span>
              <span className="text-[9px] text-cyan-400 tracking-widest font-mono uppercase block mt-0.5 font-bold">
                ESPORTS &amp; COMPLEX
              </span>
            </div>
          </Link>

          {/* Menu Điều Hướng Trung Tâm: Phù Hợp Đúng Sơ Đồ Máy & Không Có Menu Bếp */}
          <div className="hidden lg:flex items-center gap-5 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            <Link
              href="/"
              className={`transition hover:text-emerald-400 ${pathname === '/' ? 'text-emerald-400 font-black' : ''}`}
            >
              TRANG CHỦ
            </Link>

            {/* Dropdown: Khu máy & Dịch vụ chuẩn khớp Sơ đồ máy */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                className="flex items-center gap-1 hover:text-emerald-400 transition py-2"
              >
                <span>Khu máy &amp; Dịch vụ</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              {isServiceDropdownOpen && (
                <div className="absolute left-0 top-full w-80 pt-2 z-50">
                  <div className="p-3 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl space-y-1">
                    <Link
                      href="/#phan-khu"
                      onClick={() => setIsServiceDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-emerald-400 transition"
                    >
                      <span className="material-symbols-outlined text-emerald-400 text-lg">computer</span>
                      <div>
                        <div className="font-bold text-white normal-case">Standard Zone (12.000đ/h)</div>
                        <div className="text-[10px] text-slate-400 normal-case">Màn Fast-IPS 280Hz • RTX 4060Ti</div>
                      </div>
                    </Link>
                    <Link
                      href="/#phan-khu"
                      onClick={() => setIsServiceDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-cyan-400 transition"
                    >
                      <span className="material-symbols-outlined text-cyan-400 text-lg">speed</span>
                      <div>
                        <div className="font-bold text-white normal-case">Cyber Pro 540Hz (18.000đ/h)</div>
                        <div className="text-[10px] text-slate-400 normal-case">Ryzen 7 7800X3D • Màn 540Hz</div>
                      </div>
                    </Link>
                    <Link
                      href="/#phan-khu"
                      onClick={() => setIsServiceDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-emerald-400 transition"
                    >
                      <span className="material-symbols-outlined text-emerald-400 text-lg">workspace_premium</span>
                      <div>
                        <div className="font-bold text-white normal-case">Ultra VIP Suite (22.000đ/h)</div>
                        <div className="text-[10px] text-slate-400 normal-case">i7 14700K / i9 • RTX 4090 • Màn 240Hz</div>
                      </div>
                    </Link>
                    <Link
                      href="/#phan-khu"
                      onClick={() => setIsServiceDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-purple-400 transition"
                    >
                      <span className="material-symbols-outlined text-purple-400 text-lg">podium</span>
                      <div>
                        <div className="font-bold text-white normal-case">Đấu Trường Arena (25.000đ/h)</div>
                        <div className="text-[10px] text-slate-400 normal-case">5vs5 Thi đấu chuẩn IESF Major</div>
                      </div>
                    </Link>
                    <Link
                      href="/#phan-khu"
                      onClick={() => setIsServiceDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-pink-400 transition"
                    >
                      <span className="material-symbols-outlined text-pink-400 text-lg">favorite</span>
                      <div>
                        <div className="font-bold text-white normal-case">Couple Sanctuary (45.000đ/h)</div>
                        <div className="text-[10px] text-slate-400 normal-case">Sofa đôi Nappa ngả 180° cách âm</div>
                      </div>
                    </Link>
                    <Link
                      href="/#phan-khu"
                      onClick={() => setIsServiceDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-blue-400 transition"
                    >
                      <span className="material-symbols-outlined text-blue-400 text-lg">sports_esports</span>
                      <div>
                        <div className="font-bold text-white normal-case">Console Lounge (79.000đ/h)</div>
                        <div className="text-[10px] text-slate-400 normal-case">PS5 Pro + TV 75" 4K OLED 120Hz</div>
                      </div>
                    </Link>
                    <Link
                      href="/#phan-khu"
                      onClick={() => setIsServiceDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-amber-400 transition"
                    >
                      <span className="material-symbols-outlined text-amber-400 text-lg">sports</span>
                      <div>
                        <div className="font-bold text-white normal-case">Billiards Club (79.000đ/h)</div>
                        <div className="text-[10px] text-slate-400 normal-case">10 Bàn Aileex King 9020 &amp; Min Carom</div>
                      </div>
                    </Link>
                    <Link
                      href="/#showroom"
                      onClick={() => setIsServiceDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-amber-400 transition border-t border-white/5 mt-1 pt-2"
                    >
                      <span className="material-symbols-outlined text-amber-400 text-lg">storefront</span>
                      <div>
                        <div className="font-bold text-white normal-case">Showroom Gear &amp; Mod Phím</div>
                        <div className="text-[10px] text-slate-400 normal-case">Chuột 8000Hz, lót chuột Artisan</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/#bang-gia"
              className="hover:text-emerald-400 transition"
            >
              BẢNG GIÁ MÁY
            </Link>

            <Link
              href="/#khach-hang"
              className="hover:text-emerald-400 transition"
            >
              KHÁCH VIP
            </Link>

            <Link
              href="/#showroom"
              className="hover:text-emerald-400 transition"
            >
              SHOWROOM
            </Link>

            <Link
              href="/booking"
              className={`transition hover:text-emerald-400 ${pathname === '/booking' ? 'text-emerald-400 font-black' : ''}`}
            >
              SƠ ĐỒ MÁY
            </Link>
          </div>

          {/* Cụm Bên Phải: Hotline, Nút Đặt Máy Trước & ĐĂNG NHẬP / ĐĂNG KÝ */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a
              href="tel:19008888"
              className="hidden xl:flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 hover:text-white px-2 py-1.5 rounded-lg transition"
            >
              <span className="text-emerald-400">📞</span> 1900 8888
            </a>

            {/* Nút Đặt Máy Trước */}
            <Link
              href="/#dat-cho"
              className="px-3.5 sm:px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition uppercase font-sans flex items-center gap-1"
            >
              <span>ĐẶT MÁY TRƯỚC</span>
            </Link>

            {/* CỤM ĐĂNG NHẬP / ĐĂNG KÝ HOẶC THÔNG TIN TÀI KHOẢN */}
            {currentUser ? (
              /* ĐÃ ĐĂNG NHẬP */
              <div className="flex items-center gap-2">
                <Link
                  href="/auth"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 transition"
                >
                  <div className="text-right font-mono text-[11px] hidden sm:block">
                    <span className="text-white font-bold block truncate max-w-[120px]">
                      {currentUser.fullName}
                    </span>
                    <span className="text-emerald-400 font-bold block">
                      {wallet.balance.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-400">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center text-xs transition"
                  title="Đăng xuất tài khoản"
                >
                  <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
                </button>
              </div>
            ) : (
              /* CHƯA ĐĂNG NHẬP: HIỆN 2 NÚT ĐĂNG NHẬP & ĐĂNG KÝ */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('login')}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-cyan-400 text-[16px]">login</span>
                  <span>Đăng nhập</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAuth('register')}
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition cursor-pointer"
                >
                  Đăng ký
                </button>
              </div>
            )}

          </div>

        </div>
      </nav>

      {/* MODAL AUTH DÙNG CHUNG TOÀN HỆ THỐNG */}
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </header>
  );
}
