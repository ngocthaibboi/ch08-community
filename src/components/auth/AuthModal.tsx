'use client';

import React, { useState } from 'react';
import { loginUser, AuthUser } from '@/lib/authStore';
import { getStoredWallet, broadcastWalletUpdate, getCumulativeTopupAmount } from '@/lib/walletStore';
import { determineTierByAmount, GAMER_PASS_TIERS } from '@/lib/gamerPass';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  message?: string;
  onSuccess?: (user: AuthUser) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'login',
  message,
  onSuccess,
}: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    const currentWallet = getStoredWallet();
    const effective = getCumulativeTopupAmount(currentWallet);
    const tier = determineTierByAmount(effective);
    const loggedUser: AuthUser = {
      id: `usr-${Date.now()}`,
      username: username.trim(),
      fullName: username.toLowerCase().includes('thai') ? 'Nguyễn Văn Thái' : username.trim(),
      phone: phone.trim() || '0988.888.888',
      userTier: tier.name,
      balance: currentWallet.balance,
    };

    loginUser(loggedUser);
    broadcastWalletUpdate({
      ...currentWallet,
      userName: loggedUser.fullName,
      userTier: tier.name,
    });

    if (onSuccess) onSuccess(loggedUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !phone.trim()) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)!');
      return;
    }

    const currentWallet = getStoredWallet();
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      username: username.trim(),
      fullName: fullName.trim() || username.trim(),
      phone: phone.trim(),
      userTier: GAMER_PASS_TIERS.ROOKIE.name,
      balance: 0,
    };

    loginUser(newUser);
    broadcastWalletUpdate({
      ...currentWallet,
      userName: newUser.fullName,
      userTier: GAMER_PASS_TIERS.ROOKIE.name,
      balance: 0,
    });

    if (onSuccess) onSuccess(newUser);
    onClose();
  };

  const handleQuickDemoLogin = (name: string, tierCode: 'ROOKIE' | 'SILVER' | 'GOLD' | 'DIAMOND') => {
    const tier = GAMER_PASS_TIERS[tierCode];
    const balance = tier.minAmount > 0 ? tier.minAmount : 50000;
    const currentWallet = getStoredWallet();
    const demoUser: AuthUser = {
      id: `demo-${Date.now()}`,
      username: 'thaibboi',
      fullName: name,
      phone: '0912.888.999',
      userTier: tier.name,
      balance: balance,
    };

    loginUser(demoUser);
    broadcastWalletUpdate({
      ...currentWallet,
      userName: demoUser.fullName,
      userTier: tier.name,
      balance: balance,
    });

    if (onSuccess) onSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1329] border border-emerald-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative font-sans text-slate-100">
        
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Header Modal */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center text-black font-black text-2xl mx-auto shadow-lg shadow-emerald-500/25">
            CZ
          </div>
          <h3 className="text-2xl font-black text-white font-gaming mt-3 tracking-wide">
            CYBER<span className="text-emerald-400">ZONE</span> PASSPORT
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {message || 'Đăng nhập để đặt giữ chỗ máy, nạp giờ chơi và nhận ưu đãi hội viên'}
          </p>
        </div>

        {/* Thông báo cảnh báo yêu cầu đăng nhập nếu có */}
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-sm">lock</span>
            <span>{message}</span>
          </div>
        )}

        {/* Tabs switcher */}
        <div className="flex gap-2 p-1 bg-slate-900 rounded-xl mb-5 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              tab === 'login'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              tab === 'register'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Ký Mới
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        {/* Form Đăng Nhập */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-slate-400 block mb-1">TÊN ĐĂNG NHẬP / SỐ ĐIỆN THOẠI</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ví dụ: thaibboi hoặc 0912..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-400 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">MẬT KHẨU</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/30 transition font-gaming"
            >
              ĐĂNG NHẬP VÀO HỆ THỐNG
            </button>

            {/* Đăng nhập nhanh cho demo */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-500 block mb-1 text-center uppercase tracking-wider">
                CHỌN TÀI KHOẢN DIỄN TẬP THỬ NGHIỆM HẠNG
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('Nguyễn Văn Thái', 'GOLD')}
                  className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold rounded-lg transition text-[10px] flex items-center justify-center gap-1"
                >
                  <span>⭐ HỘI VIÊN VÀNG (500k)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('ProGamer_Elite', 'DIAMOND')}
                  className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold rounded-lg transition text-[10px] flex items-center justify-center gap-1"
                >
                  <span>💎 KIM CƯƠNG (1.5M)</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Tân Thủ Cyber', 'ROOKIE')}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold rounded-lg transition text-[10px] flex items-center justify-center gap-1"
              >
                <span>🎮 Tài khoản Tân Thủ Mới (0đ - Cần nạp để lên hạng)</span>
              </button>
            </div>
          </form>
        ) : (
          /* Form Đăng Ký */
          <form onSubmit={handleRegisterSubmit} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400 block mb-1">TÊN ĐĂNG NHẬP TÀI KHOẢN (*)</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ví dụ: gamer_cyber_2026"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-emerald-400 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">HỌ VÀ TÊN (*)</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Trần Văn Nam"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-emerald-400 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">SỐ ĐIỆN THOẠI (NHẬN SMS XÁC NHẬN) (*)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-emerald-400 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">MẬT KHẨU (*)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-emerald-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/30 transition font-gaming mt-2"
            >
              TẠO TÀI KHOẢN TÂN THỦ &amp; NHẬN KHUYẾN MÃI 100%
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
