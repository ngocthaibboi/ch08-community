'use client';

import React, { useState } from 'react';

interface ClientHeaderProps {
  pcName?: string;
  zoneName?: string;
  balance?: number;
  remainingTime?: string;
  userName?: string;
  userTier?: string;
  onCallStaff?: () => void;
  onTopup?: () => void;
  currentOrderTicker?: {
    orderCode: string;
    description: string;
    eta: string;
    progressPercent: number;
  } | null;
}

export default function ClientHeader({
  pcName = 'VIP-08',
  zoneName = 'Tầng 2',
  balance = 250000,
  remainingTime = '03:45:12',
  userName = 'ProGamer_VN',
  userTier = 'Hội viên VIP',
  onCallStaff,
  onTopup,
  currentOrderTicker = {
    orderCode: '#KDS-8821',
    description: '1x Mì Trộn Indomie Double Trứng + 1x Sting Dâu Lạnh',
    eta: '04:30',
    progressPercent: 65,
  },
}: ClientHeaderProps) {
  const [callAlertActive, setCallAlertActive] = useState(false);

  const handleCallStaffClick = () => {
    setCallAlertActive(true);
    if (onCallStaff) {
      onCallStaff();
    } else {
      setTimeout(() => {
        setCallAlertActive(false);
      }, 4000);
    }
  };

  return (
    <>
      {/* TOP GAMING CLIENT HUD BAR */}
      <header className="sticky top-0 z-40 bg-[#060b14]/95 backdrop-blur-md border-b border-primary/20 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        <div className="w-full px-4 py-2 flex items-center justify-between gap-3">
          {/* Left: Cyber Brand & Station Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pr-3 border-r border-[#26354f]">
              <div className="w-9 h-9 rounded bg-primary/10 border border-primary/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.25)]">
                <span className="material-symbols-outlined text-primary text-[24px]">sports_esports</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-gaming text-[14px] font-black tracking-widest text-primary">CYBERNET</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-primary/20 text-primary border border-primary/30 rounded uppercase tracking-wider">
                    F&amp;B CLIENT
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
                  <span>G-Cafe Pro v4.8</span>
                </div>
              </div>
            </div>

            {/* Station ID */}
            <div className="flex items-center gap-2 bg-[#0c1626] border border-primary/40 px-3 py-1.5 rounded shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]">
              <span className="material-symbols-outlined text-primary text-[18px]">desktop_windows</span>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">VỊ TRÍ MÁY</span>
                <span className="font-gaming text-[14px] text-primary font-black tracking-wide">
                  {pcName} <span className="text-[11px] font-normal text-slate-400">/ {zoneName}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Center: Time & Balance Stats */}
          <div className="hidden md:flex items-center gap-3">
            {/* Account Balance */}
            <div className="flex items-center gap-2.5 bg-[#0a1220] border border-secondary/30 px-3 py-1.5 rounded">
              <div className="w-7 h-7 rounded bg-secondary/15 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Số dư tài khoản</span>
                <span className="font-gaming text-[15px] font-extrabold text-secondary tracking-wide">
                  {balance.toLocaleString('vi-VN')}<span className="text-[11px]">đ</span>
                </span>
              </div>
              <button
                onClick={onTopup || (() => alert('Tính năng nạp tiền nhanh: Vui lòng quét mã QR tại máy hoặc nạp tại quầy thu ngân!'))}
                className="ml-1 text-[11px] font-bold px-2 py-1 bg-secondary/20 hover:bg-secondary text-secondary hover:text-black rounded transition-colors flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[13px]">add</span> NẠP
              </button>
            </div>

            {/* Remaining Play Time */}
            <div className="flex items-center gap-2.5 bg-[#0a1220] border border-[#26354f] px-3 py-1.5 rounded">
              <div className="w-7 h-7 rounded bg-[#24324a] flex items-center justify-center text-cyber-yellow">
                <span className="material-symbols-outlined text-[18px]">timelapse</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Thời gian chơi</span>
                <span className="font-gaming text-[14px] font-bold text-cyber-yellow tracking-wider">
                  {remainingTime}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Service Call & User Profile HUD */}
          <div className="flex items-center gap-2">
            {/* Call Staff Button (Emergency Red Gaming Style) */}
            <button
              onClick={handleCallStaffClick}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded border transition-all font-headline-sm font-bold text-[13px] uppercase tracking-wider active:scale-95 ${
                callAlertActive
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'bg-cyber-red/90 hover:bg-cyber-red text-white border-cyber-red shadow-[0_0_15px_rgba(255,42,85,0.45)] hover:shadow-[0_0_22px_rgba(255,42,85,0.7)]'
              }`}
              type="button"
            >
              <span className={`material-symbols-outlined text-[18px] ${callAlertActive ? '' : 'animate-bounce'}`}>
                {callAlertActive ? 'check_circle' : 'notifications_active'}
              </span>
              <span>{callAlertActive ? 'ĐÃ GỌI XONG' : 'GỌI NHÂN VIÊN'}</span>
            </button>

            {/* Player Profile Badge */}
            <div className="flex items-center gap-2 bg-[#0c1626] border border-[#26354f] pl-2 pr-3 py-1 rounded">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0a1220] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                </div>
              </div>
              <div className="hidden xl:flex flex-col leading-none text-left">
                <span className="text-[12px] font-bold text-slate-100">{userName}</span>
                <span className="text-[9px] text-secondary font-semibold uppercase">{userTier}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SECONDARY BAR: KDS PROGRESS TICKER (Minified) */}
      {currentOrderTicker && (
        <div className="bg-[#0b1320] border-b border-[#26354f] px-4 py-1.5 flex items-center justify-between text-[12px] gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="font-bold text-secondary uppercase tracking-wider text-[11px] flex-shrink-0">
              ĐANG CHẾ BIẾN:
            </span>
            <span className="text-slate-200 truncate">
              Mã đơn <strong className="text-primary font-mono">{currentOrderTicker.orderCode}</strong> • {currentOrderTicker.description}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-slate-400 text-[11px]">
              Dự kiến giao: <span className="font-gaming font-bold text-primary">{currentOrderTicker.eta}</span>
            </span>
            <span className="w-16 bg-[#121b2b] h-1.5 rounded-full overflow-hidden inline-block border border-slate-700">
              <span
                className="bg-primary h-full block rounded-full transition-all duration-500"
                style={{ width: `${currentOrderTicker.progressPercent}%` }}
              ></span>
            </span>
          </div>
        </div>
      )}

      {/* Call Alert notification toast */}
      {callAlertActive && (
        <div className="fixed top-14 right-6 z-50 bg-[#0f1d33] border-2 border-emerald-400 text-emerald-300 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-2xl text-emerald-400">support_agent</span>
          <div>
            <div className="font-bold text-sm">ĐÃ GỌI NHÂN VIÊN TẠI BÀN {pcName}</div>
            <div className="text-xs text-slate-300">Nhân viên trực tầng 2 đang di chuyển tới máy của bạn trong giây lát.</div>
          </div>
        </div>
      )}
    </>
  );
}
