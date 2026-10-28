'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getStoredWallet,
  topupWallet,
  resetWalletToDefault,
  calculateRemainingPlayTime,
  WALLET_EVENT_NAME,
  UserWallet,
  INITIAL_WALLET,
} from '@/lib/walletStore';

export default function AuthAndWallet() {
  const [activeTab, setActiveTab] = useState<'topup' | 'login'>('topup');
  const [amount, setAmount] = useState('50000');
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'atm' | 'cash'>('qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState<{
    added: number;
    newBalance: number;
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

  const quickAmounts = ['20000', '50000', '100000', '200000', '500000'];

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Vui lòng nhập số tiền nạp hợp lệ!');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Execute real topup logic and update shared wallet store
      const updated = topupWallet(numAmount, paymentMethod);
      setWallet(updated);
      setIsProcessing(false);

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
    if (confirm('Khôi phục số dư ví tài khoản về mặc định 250.000đ?')) {
      const reset = resetWalletToDefault();
      setWallet(reset);
    }
  };

  const remainingTimeStr = calculateRemainingPlayTime(wallet.balance, wallet.hourlyRate);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-xl">
        {/* Module Header Badge */}
        <div className="text-center mb-6">
          <span className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            CỔNG NẠP TIỀN ĐỒNG BỘ TOÀN HỆ THỐNG
          </span>
          <h1 className="text-3xl font-black text-white mt-2 font-gaming tracking-wide">
            CỔNG TÀI KHOẢN &amp; NẠP TIỀN VÍ
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Số dư được đồng bộ trực tiếp lên thanh Menu và màn hình gọi đồ ăn tại bàn máy.
          </p>
        </div>

        {/* Success Alert Toast */}
        {successToast && (
          <div className="bg-emerald-950/90 border-2 border-emerald-400 text-emerald-200 px-4 py-3.5 rounded-xl mb-6 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-emerald-400">check_circle</span>
              <div>
                <div className="font-bold text-sm text-white">
                  NẠP THÀNH CÔNG +{successToast.added.toLocaleString('vi-VN')}đ!
                </div>
                <div className="text-xs text-emerald-300">
                  Số dư mới: <strong className="text-white font-mono">{successToast.newBalance.toLocaleString('vi-VN')}đ</strong> (Đã cộng trực tiếp vào ví máy {wallet.pcName})
                </div>
              </div>
            </div>
            <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded font-mono uppercase">
              ĐÃ CỘNG TIỀN
            </span>
          </div>
        )}

        {/* User Account Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-cyan-400">person</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-black text-base">{wallet.userName}</h3>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.2 rounded font-bold font-mono">
                  {wallet.userTier}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-slate-400 text-xs block">Vị Trí Hiện Tại:</span>
              <span className="text-cyan-400 font-mono font-black text-sm">
                MÁY {wallet.pcName} / TẦNG 2
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
            <div className="bg-slate-800/80 p-3.5 rounded-lg border border-emerald-500/30 shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-slate-400">Số Dư Khả Dụng:</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              </div>
              <span className="font-mono text-2xl font-black text-emerald-400 tracking-tight">
                {wallet.balance.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-lg border border-cyan-500/30 shadow-[inset_0_0_15px_rgba(0,240,255,0.1)]">
              <span className="text-slate-400 block mb-0.5">Thời Gian Chơi Quy Đổi:</span>
              <span className="font-mono text-2xl font-black text-cyan-400 tracking-tight">
                {remainingTimeStr}
              </span>
            </div>
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
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition font-mono flex items-center justify-center gap-1.5 ${
              activeTab === 'topup'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">add_card</span>
            <span>Nạp Tiền Trực Tuyến</span>
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition font-mono flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Đổi Tài Khoản Máy</span>
          </button>
        </div>

        {/* Main Tab Content */}
        {activeTab === 'topup' ? (
          <form onSubmit={handleTopup} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div>
              <label className="text-white font-black text-sm block mb-2">Chọn Mức Tiền Cần Nạp:</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition border ${
                      amount === amt
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {parseInt(amt) >= 1000 ? `${parseInt(amt) / 1000}k` : amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền khác..."
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-cyan-400 focus:outline-none w-full text-sm font-mono"
              />
            </div>

            {/* Payment Mode Selector */}
            <div>
              <label className="text-white font-black text-sm block mb-2">Phương Thức Thanh Toán:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr')}
                  className={`p-3 rounded-lg border text-center transition ${
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
                  className={`p-3 rounded-lg border text-center transition ${
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
                  className={`p-3 rounded-lg border text-center transition ${
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
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-95 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 font-mono text-sm tracking-wide active:scale-98 cursor-pointer"
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

            <div className="flex justify-between items-center pt-2 text-[11px] text-slate-500">
              <span>Hỗ trợ nạp tự động 24/7 không tính phí</span>
              <button
                type="button"
                onClick={handleResetWallet}
                className="text-slate-400 hover:text-rose-400 underline"
              >
                Reset ví về 250k
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-white font-black text-sm">Đăng Nhập Tài Khoản Hội Viên Cyber Zone</h3>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Tên tài khoản hoặc số điện thoại:</label>
              <input
                type="text"
                defaultValue={wallet.userName}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-cyan-400 focus:outline-none w-full text-sm"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Mật khẩu:</label>
              <input
                type="password"
                defaultValue="••••••••"
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-cyan-400 focus:outline-none w-full text-sm"
              />
            </div>
            <button
              type="button"
              className="w-full bg-cyan-500 text-black font-bold py-2.5 rounded-lg text-sm shadow-[0_0_12px_rgba(0,240,255,0.3)] hover:bg-cyan-400 transition"
            >
              Đăng Nhập Máy Trạm
            </button>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/menu" className="text-xs text-cyan-400 hover:underline font-mono">
            &larr; Quay lại gọi món F&amp;B tại máy {wallet.pcName}
          </Link>
        </div>
      </div>
    </div>
  );
}
