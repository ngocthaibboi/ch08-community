'use client';

export interface UserWallet {
  userName: string;
  pcName: string;
  zoneName: string;
  userTier: string;
  balance: number;
  hourlyRate: number; // e.g. 20,000đ/hour for VIP Room
  lastTransaction?: {
    type: 'TOPUP' | 'FNB_PAYMENT';
    amount: number;
    description: string;
    timestamp: string;
  };
}

export const STORAGE_KEY_WALLET = 'cyber_user_wallet';
export const WALLET_EVENT_NAME = 'cyber_wallet_updated';

export const INITIAL_WALLET: UserWallet = {
  userName: 'ProGamer_VN',
  pcName: 'VIP-08',
  zoneName: 'PHÒNG RIÊNG VIP TẦNG 2',
  userTier: 'HỘI VIÊN VIP GOLD',
  balance: 250000,
  hourlyRate: 20000,
};

/**
 * Format balance into play time string (HH:MM:SS)
 */
export function calculateRemainingPlayTime(balance: number, hourlyRate: number = 20000): string {
  if (balance <= 0) return '00:00:00';
  const totalHours = balance / hourlyRate;
  const hours = Math.floor(totalHours);
  const minutes = Math.floor((totalHours - hours) * 60);
  const seconds = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Get current wallet state from localStorage
 */
export function getStoredWallet(): UserWallet {
  if (typeof window === 'undefined') return INITIAL_WALLET;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WALLET);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(INITIAL_WALLET));
      return INITIAL_WALLET;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.balance === 'number') {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(INITIAL_WALLET));
    return INITIAL_WALLET;
  } catch {
    return INITIAL_WALLET;
  }
}

/**
 * Broadcast wallet changes across components and browser tabs
 */
export function broadcastWalletUpdate(wallet: UserWallet) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(wallet));
    window.dispatchEvent(new CustomEvent(WALLET_EVENT_NAME, { detail: wallet }));
  } catch (err) {
    console.error('Failed to broadcast wallet update:', err);
  }
}

/**
 * Top up money into wallet
 */
export function topupWallet(amount: number, method: string = 'QR'): UserWallet {
  const current = getStoredWallet();
  const newBalance = current.balance + amount;
  const updated: UserWallet = {
    ...current,
    balance: newBalance,
    lastTransaction: {
      type: 'TOPUP',
      amount,
      description: `Nạp tiền qua ${method.toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
    },
  };
  broadcastWalletUpdate(updated);
  return updated;
}

/**
 * Deduct money for F&B payment
 */
export function deductWallet(amount: number, description: string = 'Thanh toán đồ ăn F&B'): { success: boolean; wallet: UserWallet } {
  const current = getStoredWallet();
  if (current.balance < amount) {
    return { success: false, wallet: current };
  }
  const newBalance = current.balance - amount;
  const updated: UserWallet = {
    ...current,
    balance: newBalance,
    lastTransaction: {
      type: 'FNB_PAYMENT',
      amount,
      description,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
    },
  };
  broadcastWalletUpdate(updated);
  return { success: true, wallet: updated };
}

/**
 * Reset wallet back to default (for testing)
 */
export function resetWalletToDefault(): UserWallet {
  broadcastWalletUpdate(INITIAL_WALLET);
  return INITIAL_WALLET;
}
