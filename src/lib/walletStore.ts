'use client';

export interface WalletTransaction {
  id: string;
  type: 'TOPUP' | 'FNB_PAYMENT';
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
  hourlyRate: number; // e.g. 20,000đ/hour for VIP Room
  transactions: WalletTransaction[];
  lastTransaction?: WalletTransaction;
}

export const STORAGE_KEY_WALLET = 'cyber_user_wallet';
export const WALLET_EVENT_NAME = 'cyber_wallet_updated';

// DOANH THU BAN ĐẦU: 0Đ (Chỉ tăng khi nạp thẻ thật hoặc đặt món)
export const BASELINE_TOPUP_REVENUE = 0;

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [];

export const INITIAL_WALLET: UserWallet = {
  userName: 'Nguyễn Văn A',
  pcName: 'VIP-08',
  zoneName: 'PHÒNG RIÊNG VIP TẦNG 2',
  userTier: 'HỘI VIÊN TÂN THỦ',
  balance: 0,
  hourlyRate: 20000,
  transactions: [],
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
      return {
        ...INITIAL_WALLET,
        ...parsed,
        transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      };
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
 * Top up money into wallet (Matching auth/page.tsx)
 */
export function topupWallet(amount: number, method: string = 'QR'): UserWallet {
  const current = getStoredWallet();
  const newBalance = current.balance + amount;
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
    transactions: [tx, ...(current.transactions || [])],
    lastTransaction: tx,
  };

  broadcastWalletUpdate(updated);
  return updated;
}

/**
 * Deduct money for F&B payment (Matching menu/page.tsx)
 */
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

  broadcastWalletUpdate(updated);
  return { success: true, wallet: updated };
}

/**
 * Calculate total topup revenue from all transactions
 */
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
