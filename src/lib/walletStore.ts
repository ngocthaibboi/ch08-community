'use client';

import {
  determineTierByAmount,
  getTierByName,
  calculateTierProgression,
  GAMER_PASS_TIERS,
  TierInfo,
} from './gamerPass';

export interface WalletTransaction {
  id: string;
  type: 'TOPUP' | 'FNB_PAYMENT' | 'PLAY_TIME';
  amount: number;
  description: string;
  method?: string;
  pcName: string;
  timestamp: string;
  dateIso: string;
}

export interface UserWallet {
  userName: string;
  pcName: string;
  zoneName: string;
  userTier: string;
  balance: number;
  hourlyRate: number;
  transactions: WalletTransaction[];
  lastTransaction?: WalletTransaction;
}

export const STORAGE_KEY_WALLET = 'cyber_user_wallet';
export const WALLET_EVENT_NAME = 'cyber_wallet_updated';
export const BASELINE_TOPUP_REVENUE = 0;
export const INITIAL_TRANSACTIONS: WalletTransaction[] = [];

export const INITIAL_WALLET: UserWallet = {
  userName: 'Tài khoản Hội viên',
  pcName: 'VIP-08',
  zoneName: 'PHÒNG RIÊNG VIP TẦNG 2',
  userTier: 'HỘI VIÊN BẠC 🥈',
  balance: 200000,
  hourlyRate: 22000,
  transactions: [],
};

export function calculateRemainingPlayTime(balance: number, hourlyRate: number = 22000): string {
  if (balance <= 0 || hourlyRate <= 0) return '00:00:00';
  const totalHours = balance / hourlyRate;
  const hours = Math.floor(totalHours);
  const minutes = Math.floor((totalHours - hours) * 60);
  const seconds = Math.floor((((totalHours - hours) * 60) - minutes) * 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function getCumulativeTopupAmount(wallet: UserWallet): number {
  if (!wallet) return 0;
  const topups = (wallet.transactions || []).filter((tx) => tx.type === 'TOPUP');
  const sumFromTx = topups.reduce((sum, tx) => sum + tx.amount, 0);
  return Math.max(sumFromTx, wallet.balance || 0);
}

export function getStoredWallet(): UserWallet {
  if (typeof window === 'undefined') return INITIAL_WALLET;
  try {
    let authUser: any = null;
    try {
      const authRaw = localStorage.getItem('cyber_auth_current_user');
      if (authRaw) authUser = JSON.parse(authRaw);
    } catch {}

    const raw = localStorage.getItem(STORAGE_KEY_WALLET);
    if (!raw) {
      const init: UserWallet = {
        ...INITIAL_WALLET,
        userName: authUser?.fullName || authUser?.username || INITIAL_WALLET.userName,
        userTier: authUser?.userTier || INITIAL_WALLET.userTier,
      };
      localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(init));
      return init;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.balance === 'number') {
      const merged: UserWallet = {
        ...INITIAL_WALLET,
        ...parsed,
        transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      };
      if (authUser?.fullName || authUser?.username) {
        merged.userName = authUser.fullName || authUser.username;
        if (authUser.userTier) merged.userTier = authUser.userTier;
      }
      const effectiveAmount = getCumulativeTopupAmount(merged);
      const matchedTier = determineTierByAmount(effectiveAmount);
      const currentTierInfo = getTierByName(merged.userTier);
      if (matchedTier.minAmount > currentTierInfo.minAmount) {
        merged.userTier = matchedTier.name;
      }
      return merged;
    }
    localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(INITIAL_WALLET));
    return INITIAL_WALLET;
  } catch {
    return INITIAL_WALLET;
  }
}

export function broadcastWalletUpdate(wallet: UserWallet) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(wallet));
    window.dispatchEvent(new CustomEvent(WALLET_EVENT_NAME, { detail: wallet }));
  } catch (err) {
    console.error('Failed to broadcast wallet update:', err);
  }
}

export function topupWallet(amount: number, method: string = 'QR'): UserWallet {
  const current = getStoredWallet();
  const newBalance = Math.max(0, current.balance + amount);

  const prevTopups = (current.transactions || []).filter((tx) => tx.type === 'TOPUP');
  const totalTopupAfter = prevTopups.reduce((sum, tx) => sum + tx.amount, 0) + amount;
  const effectiveAmount = Math.max(totalTopupAfter, newBalance);

  const newTierInfo = determineTierByAmount(effectiveAmount);

  const tx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    type: 'TOPUP',
    amount,
    description: `Khách nạp tiền qua ${method.toUpperCase()}`,
    method,
    pcName: current.pcName || 'VIP-08',
    timestamp: new Date().toLocaleTimeString('vi-VN'),
    dateIso: new Date().toISOString(),
  };

  const updated: UserWallet = {
    ...current,
    balance: newBalance,
    userTier: newTierInfo.name,
    transactions: [tx, ...(current.transactions || [])],
    lastTransaction: tx,
  };

  if (typeof window !== 'undefined') {
    try {
      const authRaw = localStorage.getItem('cyber_auth_current_user');
      if (authRaw) {
        const authUser = JSON.parse(authRaw);
        if (authUser) {
          authUser.userTier = newTierInfo.name;
          authUser.balance = newBalance;
          localStorage.setItem('cyber_auth_current_user', JSON.stringify(authUser));
          window.dispatchEvent(new CustomEvent('cyber_auth_updated', { detail: authUser }));
        }
      }
    } catch (e) {
      console.error('Failed to sync auth state:', e);
    }
  }

  broadcastWalletUpdate(updated);
  return updated;
}

export function deductWallet(
  amount: number,
  description: string = 'Thanh toán đồ ăn F&B'
): { success: boolean; wallet: UserWallet } {
  const current = getStoredWallet();
  if (current.balance < amount) {
    return { success: false, wallet: current };
  }
  const newBalance = current.balance - amount;
  const tx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    type: 'FNB_PAYMENT',
    amount,
    description,
    pcName: current.pcName || 'VIP-08',
    timestamp: new Date().toLocaleTimeString('vi-VN'),
    dateIso: new Date().toISOString(),
  };

  const updated: UserWallet = {
    ...current,
    balance: newBalance,
    transactions: [tx, ...(current.transactions || [])],
    lastTransaction: tx,
  };

  if (typeof window !== 'undefined') {
    try {
      const authRaw = localStorage.getItem('cyber_auth_current_user');
      if (authRaw) {
        const authUser = JSON.parse(authRaw);
        if (authUser) {
          authUser.balance = newBalance;
          localStorage.setItem('cyber_auth_current_user', JSON.stringify(authUser));
          window.dispatchEvent(new CustomEvent('cyber_auth_updated', { detail: authUser }));
        }
      }
    } catch {}
  }

  broadcastWalletUpdate(updated);
  return { success: true, wallet: updated };
}

export function updateStationAndRate(
  pcName: string,
  zoneName: string,
  hourlyRate: number
): UserWallet {
  const current = getStoredWallet();
  const updated: UserWallet = {
    ...current,
    pcName,
    zoneName,
    hourlyRate: Math.max(1000, hourlyRate),
  };
  broadcastWalletUpdate(updated);
  return updated;
}

export function deductPlayTimeFee(
  amount: number,
  pcName: string,
  description: string
): { success: boolean; wallet: UserWallet } {
  const current = getStoredWallet();
  if (current.balance < amount) {
    return { success: false, wallet: current };
  }
  const newBalance = Math.max(0, current.balance - amount);
  const tx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    type: 'PLAY_TIME',
    amount,
    description: description || `Tiền giờ chơi máy ${pcName}`,
    pcName: pcName || current.pcName || 'VIP-08',
    timestamp: new Date().toLocaleTimeString('vi-VN'),
    dateIso: new Date().toISOString(),
  };

  const updated: UserWallet = {
    ...current,
    balance: newBalance,
    transactions: [tx, ...(current.transactions || [])],
    lastTransaction: tx,
  };

  if (typeof window !== 'undefined') {
    try {
      const authRaw = localStorage.getItem('cyber_auth_current_user');
      if (authRaw) {
        const authUser = JSON.parse(authRaw);
        if (authUser) {
          authUser.balance = newBalance;
          localStorage.setItem('cyber_auth_current_user', JSON.stringify(authUser));
          window.dispatchEvent(new CustomEvent('cyber_auth_updated', { detail: authUser }));
        }
      }
    } catch {}
  }

  broadcastWalletUpdate(updated);
  return { success: true, wallet: updated };
}

export function calculateTotalTopupRevenue(): { totalTopup: number; recentTopups: WalletTransaction[] } {
  if (typeof window === 'undefined') return { totalTopup: 0, recentTopups: [] };
  const wallet = getStoredWallet();
  const topups = wallet.transactions.filter((tx) => tx.type === 'TOPUP');
  const totalFromTx = topups.reduce((sum, tx) => sum + tx.amount, 0);
  return {
    totalTopup: totalFromTx,
    recentTopups: topups.slice(0, 5),
  };
}

export function resetWalletToDefault(): UserWallet {
  broadcastWalletUpdate(INITIAL_WALLET);
  return INITIAL_WALLET;
}