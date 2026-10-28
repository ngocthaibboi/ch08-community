'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getStoredWallet,
  topupWallet,
  resetWalletToDefault,
  calculateRemainingPlayTime,
  getCumulativeTopupAmount,
  WALLET_EVENT_NAME,
  UserWallet,
  INITIAL_WALLET,
} from '@/lib/walletStore';
import {
  determineTierByAmount,
  getTierByName,
  calculateTierProgression,
  GAMER_PASS_TIERS,
  TIERS_ORDER,
  TierInfo,
} from '@/lib/gamerPass';

export default function AuthAndWallet() {
  const [activeTab, setActiveTab] = useState<'topup' | 'gamerpass' | 'login'>('topup');
  const [amount, setAmount] = useState('200000');
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'atm' | 'cash'>('qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState<{
    added: number;
    newBalance: number;
  } | null>(null);
  const [upgradeToast, setUpgradeToast] = useState<{
    oldTier: string;
    newTier: string;
    perks: string[];
  } | null>(null);

  const [wallet, setWallet] = useState<UserWallet>(INITIAL_WALLET);

  // Synchronize wallet state across tabs and components
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

  const quickAmounts = ['50000', '100000', '200000', '500000', '1000000', '1500000'];

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Vui lòng nhập số tiền nạp hợp lệ!');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const prevTier = getTierByName(wallet.userTier);

      // Execute real topup logic and update shared wallet store
      const updated = topupWallet(numAmount, paymentMethod);
      setWallet(updated);
      setIsProcessing(false);

      const newTier = getTierByName(updated.userTier);

      // Phát hiện thăng hạng tự động khi nạp
      if (newTier.minAmount > prevTier.minAmount) {
        setUpgradeToast({
          oldTier: prevTier.name,
          newTier: newTier.name,
          perks: newTier.perks,
        });
      }

      // Show success notification
      setSuccessToast({
        added: numAmount,
        newBalance: updated.balance,
      });

      setTimeout(() => {
        setSuccessToast(null);
      }, 5000);
    }, 600);
  };

  const handleResetWallet = () => {
    if (confirm('Khôi phục số dư ví tài khoản về mặc định 200.000đ (Hội viên Bạc)?')) {
      const reset = resetWalletToDefault();
      setWallet(reset);
    }
  };

  const remainingTimeStr = calculateRemainingPlayTime(wallet.balance, wallet.hourlyRate);
  const currentTier = getTierByName(wallet.userTier);
  const cumulativeAmount = getCumulativeTopupAmount(wallet);
  const progression = calculateTierProgression(cumulativeAmount);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-2xl">
        {/* Module Header Badge */}
        <div className="text-center mb-6">
          <span className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-purple-600 text-black font-mono text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            HỆ THỐNG GAMER PASS &amp; CỔNG NẠP TIỀN ĐỒNG BỘ
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 font-gaming tracking-wide">
            CỔNG TÀI KHOẢN &amp; GAMER PASS
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Nạp tiền tích lũy để tự động thăng hạng hội viên, giảm giá giờ chơi và nhận siêu ưu đãi ẩm thực.
          </p>
        </div>

        {/* Upgrade Congratulatory Alert */}
        {upgradeToast && (
          <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-purple-500/20 border-2 border-amber-400 text-amber-200 px-5 py-4 rounded-2xl mb-6 shadow-[0_0_25px_rgba(245,158,11,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-amber-400">military_tech</span>
              <div>
                <div className="font-gaming font-black text-base text-white">
                  🎉 CHÚC MỪNG BẠN ĐÃ THĂNG HẠNG: {upgradeToast.newTier}!
                </div>
                <div className="text-xs text-amber-300 font-mono mt-0.5">
                  Đã kích hoạt ưu đãi: {upgradeToast.perks[0]}
                </div>
              </div>
            </div>
            <button
              onClick={() => setUpgradeToast(null)}
              className="bg-amber-400 text-black font-extrabold text-[10px] px-3 py-1.5 rounded-lg uppercase font-mono cursor-pointer hover:bg-amber-300"
            >
              TUYỆT VỜI
            </button>
          </div>
        )}

        {/* Success Alert Toast */}
        {successToast && (
          <div className="bg-emerald-950/90 border-2 border-emerald-400 text-emerald-200 px-4 py-3.5 rounded-xl mb-6 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-emerald-400">check_circle</span>
              <div>
                <div className="font-bold text-sm text-white">
                  NẠP THÀNH CÔNG +{successToast.added.toLocaleString('vi-VN')}đ!
                </div>
                <div className="text-xs text-emerald-300 font-mono">
                  Số dư mới: <strong className="text-white font-mono">{successToast.newBalance.toLocaleString('vi-VN')}đ</strong> (Đã cộng trực tiếp vào máy {wallet.pcName})
                </div>
              </div>
            </div>
            <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded font-mono uppercase">
              ĐÃ CỘNG TIỀN
            </span>
          </div>
        )}

        {/* User Account Card with Real-time Gamer Pass Progression */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${currentTier.accentBg} ${currentTier.textColor} border ${currentTier.borderColor} p-0.5 flex items-center justify-center shadow-lg`}>
                <span className="material-symbols-outlined text-2xl">{currentTier.icon}</span>
              </div>
              <div>
                <h3 className="text-white font-black text-base">{wallet.userName}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono border ${currentTier.badgeClass}`}>
                    {currentTier.name}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Giảm {currentTier.playDiscountPercent}% giờ chơi
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-slate-400 text-xs block">Vị Trí Máy:</span>
              <span className="text-cyan-400 font-black text-sm">
                MÁY {wallet.pcName} / TẦNG 2
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-emerald-500/30 shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-slate-400">Số Dư Khả Dụng:</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              </div>
              <span className="font-mono text-2xl font-black text-emerald-400 tracking-tight">
                {wallet.balance.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-cyan-500/30 shadow-[inset_0_0_15px_rgba(0,240,255,0.1)]">
              <span className="text-slate-400 block mb-0.5">Thời Gian Chơi Quy Đổi:</span>
              <span className="font-mono text-2xl font-black text-cyan-400 tracking-tight">
                {remainingTimeStr}
              </span>
            </div>
          </div>

          {/* Tiến trình Gamer Pass */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">
                Tiến trình thăng hạng: <strong className="text-white">{currentTier.shortName} &rarr; {progression.nextTier ? progression.nextTier.shortName : 'MAX'}</strong>
              </span>
              <span className="text-amber-400 font-bold">
                {progression.isMaxTier ? '100% (ĐỈNH CAO)' : `${progression.progressPercent}%`}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progression.progressPercent}%` }}
              ></div>
            </div>
            {!progression.isMaxTier && (
              <div className="text-[11px] text-slate-400 flex justify-between">
                <span>Tích lũy nạp: {cumulativeAmount.toLocaleString('vi-VN')}đ</span>
                <span className="text-amber-300 font-bold">
                  Cần nạp thêm +{progression.neededAmount.toLocaleString('vi-VN')}đ để lên {progression.nextTier?.name}
                </span>
              </div>
            )}
          </div>

          {wallet.lastTransaction && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Giao dịch gần nhất: {wallet.lastTransaction.description}</span>
              <span className={wallet.lastTransaction.type === 'TOPUP' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {wallet.lastTransaction.type === 'TOPUP' ? '+' : '-'}{wallet.lastTransaction.amount.toLocaleString('vi-VN')}đ ({wallet.lastTransaction.timestamp})
              </span>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-4 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('topup')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition font-mono flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'topup'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-extrabold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">add_card</span>
            <span>Nạp Tiền Trực Tuyến</span>
          </button>

          <button
            onClick={() => setActiveTab('gamerpass')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition font-mono flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'gamerpass'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">military_tech</span>
            <span>Đặc Quyền Gamer Pass</span>
          </button>

          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition font-mono flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>Đổi Tài Khoản Máy</span>
          </button>
        </div>

        {/* Tab 1: Form Nạp Tiền */}
        {activeTab === 'topup' && (
          <form onSubmit={handleTopup} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-black text-sm">Chọn Mức Tiền Cần Nạp:</label>
                <span className="text-[11px] text-amber-400 font-mono font-bold">
                  Nạp ≥ 500k thăng hạng Vàng ⭐ | ≥ 1.5M lên Kim Cương 💎
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                      amount === amt
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {parseInt(amt) >= 1000000
                      ? `${parseInt(amt) / 1000000}M`
                      : `${parseInt(amt) / 1000}k`}
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền khác..."
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:border-cyan-400 focus:outline-none w-full text-sm font-mono"
              />
            </div>

            {/* Payment Mode Selector */}
            <div>
              <label className="text-white font-black text-sm block mb-2">Phương Thức Thanh Toán:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    paymentMethod === 'qr'
                      ? 'bg-slate-800 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl block mb-1">qr_code_2</span>
                  <span className="text-[11px] font-bold block">Quét QR VietQR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('atm')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    paymentMethod === 'atm'
                      ? 'bg-slate-800 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl block mb-1">credit_card</span>
                  <span className="text-[11px] font-bold block">Thẻ ATM / Visa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'bg-slate-800 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl block mb-1">payments</span>
                  <span className="text-[11px] font-bold block">Tiền Mặt Tại Máy</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:brightness-110 text-black font-extrabold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 font-gaming text-sm tracking-wide active:scale-98 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isProcessing ? 'sync' : 'bolt'}
              </span>
              <span>
                {isProcessing
                  ? 'ĐANG XÁC THỰC VÀ CỘNG TIỀN...'
                  : `XÁC NHẬN NẠP +${parseInt(amount || '0').toLocaleString('vi-VN')}đ VÀO VÍ`}
              </span>
            </button>

            <div className="flex justify-between items-center pt-2 text-[11px] text-slate-500 font-mono">
              <span>Tự động cập nhật hạng Gamer Pass ngay sau khi nạp</span>
              <button
                type="button"
                onClick={handleResetWallet}
                className="text-slate-400 hover:text-rose-400 underline cursor-pointer"
              >
                Reset ví về 200k
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Thông Tin Đặc Quyền Gamer Pass Chi Tiết */}
        {activeTab === 'gamerpass' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <h3 className="text-white font-gaming font-black text-lg">
                  CHI TIẾT ĐẶC QUYỀN HỘI VIÊN GAMER PASS
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Càng nạp tích lũy nhiều, thứ hạng càng cao và chiết khấu càng lớn
                </p>
              </div>
              <span className="material-symbols-outlined text-amber-400 text-3xl">workspace_premium</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIERS_ORDER.map((tierKey) => {
                const tier = GAMER_PASS_TIERS[tierKey];
                const isCurrent = currentTier.code === tierKey;
                return (
                  <div
                    key={tierKey}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                      isCurrent
                        ? `bg-slate-800/90 ${tier.borderColor} ring-2 ring-emerald-400/50 shadow-lg`
                        : 'bg-black/30 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono border ${tier.badgeClass}`}>
                          {tier.shortName}
                        </span>
                        <span className="material-symbols-outlined text-sm text-slate-400">{tier.icon}</span>
                      </div>
                      <h4 className="text-white font-black text-sm">{tier.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono block mb-2">{tier.tagline}</span>

                      <div className="space-y-1 text-xs font-mono border-t border-white/10 pt-2 mb-2">
                        <div className="flex justify-between text-slate-300">
                          <span>Giảm tiền giờ:</span>
                          <span className="text-emerald-400 font-bold">
                            {tier.playDiscountPercent > 0 ? `-${tier.playDiscountPercent}%` : 'Chuẩn'}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Giảm menu Bếp:</span>
                          <span className="text-cyan-400 font-bold">
                            {tier.fnbDiscountPercent > 0 ? `-${tier.fnbDiscountPercent}%` : 'Chuẩn'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-300">
                        {tier.perks.map((p, idx) => (
                          <div key={idx} className="flex items-start gap-1">
                            <span className="text-emerald-400">✓</span>
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10">
                      {isCurrent ? (
                        <div className="py-1.5 text-center text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                          ✓ HẠNG CỦA BẠN
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAmount(String(tier.minAmount || 50000));
                            setActiveTab('topup');
                          }}
                          className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-white/10 font-bold text-xs font-mono transition text-center cursor-pointer"
                        >
                          Chọn Nạp Mốc Này &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Đổi Tài Khoản Máy */}
        {activeTab === 'login' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-white font-black text-sm">Đăng Nhập Tài Khoản Hội Viên Cyber Zone</h3>
            <div>
              <label className="text-slate-400 block mb-1">Tên tài khoản hoặc số điện thoại:</label>
              <input
                type="text"
                defaultValue={wallet.userName}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:border-cyan-400 focus:outline-none w-full text-sm font-sans"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Mật khẩu:</label>
              <input
                type="password"
                defaultValue="••••••••"
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:border-cyan-400 focus:outline-none w-full text-sm font-sans"
              />
            </div>
            <button
              type="button"
              className="w-full bg-cyan-500 text-black font-extrabold py-3 rounded-xl text-xs shadow-[0_0_12px_rgba(0,240,255,0.3)] hover:bg-cyan-400 transition cursor-pointer"
            >
              ĐĂNG NHẬP MÁY TRẠM
            </button>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/client-pc" className="text-xs text-cyan-400 hover:underline font-mono">
            &larr; Quay lại màn hình điều khiển máy trạm {wallet.pcName}
          </Link>
        </div>
      </div>
    </div>
  );
}
