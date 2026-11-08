'use client';

import {
  determineTierByAmount,
  getTierByName,
  calculateTierProgression,
  GAMER_PASS_TIERS,
  TierInfo,
  MEMBERSHIP_PLANS,
  MembershipPlan,
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
  tierExpiresAt?: number; // Thời điểm hết hạn gói hội viên (timestamp ms)
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
  userTier: 'TÂN THỦ (ROOKIE)',
  balance: 0,
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
        tierExpiresAt: authUser?.tierExpiresAt,
        balance: typeof authUser?.balance === 'number' ? authUser.balance : 0,
      };
      localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(init));
      return init;
    }

    const parsed = JSON.parse(raw);
    const merged: UserWallet = {
      ...INITIAL_WALLET,
      ...parsed,
      transactions: Array.isArray(parsed?.transactions) ? parsed.transactions : [],
    };

    // Đồng bộ số dư và hạng từ tài khoản đang đăng nhập
    if (authUser && typeof authUser.balance === 'number') {
      merged.balance = authUser.balance;
      merged.userName = authUser.fullName || authUser.username;
      merged.userTier = authUser.userTier || 'TÂN THỦ (ROOKIE)';
      merged.tierExpiresAt = authUser.tierExpiresAt;
    }

    // KIỂM TRA THỜI HẠN GÓI: Nếu đã quá hạn 30 ngày -> tự động tụt hạng về Tân Thủ
    if (merged.tierExpiresAt && Date.now() > merged.tierExpiresAt) {
      merged.userTier = 'TÂN THỦ (ROOKIE)';
      delete merged.tierExpiresAt;
      localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(merged));
    }

    return merged;
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

// ══════════ ĐĂNG KÝ GÓI HỘI VIÊN THÁNG (CÓ KIỂM TRA SỐ DƯ & TRỪ TIỀN VÍ) ══════════
export function subscribeMembershipPlan(planId: string): {
  success: boolean;
  error?: string;
  wallet: UserWallet;
  plan?: MembershipPlan;
  neededAmount?: number;
  newBalance?: number;
  expiresAt?: number;
} {
  const current = getStoredWallet();

  let authUser: any = null;
  if (typeof window !== 'undefined') {
    try {
      const authRaw = localStorage.getItem('cyber_auth_current_user');
      if (authRaw) authUser = JSON.parse(authRaw);
    } catch {}
  }

  if (!authUser) {
    return {
      success: false,
      error: 'Vui lòng đăng nhập tài khoản để đăng ký gói hội viên!',
      wallet: current,
    };
  }

  const plan = MEMBERSHIP_PLANS.find((p) => p.id === planId);
  if (!plan) {
    return { success: false, error: 'Gói hội viên không tồn tại!', wallet: current };
  }

  const currentBalance = typeof authUser.balance === 'number' ? authUser.balance : current.balance;

  // 1. KIỂM TRA SỐ DƯ: BẮT BUỘC ĐỦ TIỀN MỚI CHO ĐĂNG KÝ
  if (currentBalance < plan.price) {
    const needed = plan.price - currentBalance;
    return {
      success: false,
      error: `Số dư ví không đủ! Bạn hiện có ${currentBalance.toLocaleString('vi-VN')}đ, cần ${plan.price.toLocaleString('vi-VN')}đ để đăng ký gói ${plan.name}. Vui lòng nạp thêm tối thiểu +${needed.toLocaleString('vi-VN')}đ vào ví!`,
      neededAmount: needed,
      wallet: current,
      plan,
    };
  }

  // 2. ĐỦ TIỀN: TRỪ TIỀN VÀ KÍCH HOẠT THỜI HẠN GÓI 30 NGÀY
  const newBalance = currentBalance - plan.price;
  const now = Date.now();
  const expiresAt = now + plan.durationDays * 24 * 60 * 60 * 1000;

  authUser.balance = newBalance;
  authUser.userTier = plan.badgeName;
  authUser.tierExpiresAt = expiresAt;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cyber_auth_current_user', JSON.stringify(authUser));
      window.dispatchEvent(new CustomEvent('cyber_auth_updated', { detail: authUser }));

      // Cập nhật cả trong cơ sở dữ liệu Registered Accounts để lưu vĩnh viễn
      const rawAccs = localStorage.getItem('cyber_registered_accounts');
      if (rawAccs) {
        const accs = JSON.parse(rawAccs);
        const idx = accs.findIndex((a: any) => a.username.toLowerCase() === authUser.username.toLowerCase());
        if (idx !== -1) {
          accs[idx].balance = newBalance;
          accs[idx].userTier = plan.badgeName;
          accs[idx].tierExpiresAt = expiresAt;
          localStorage.setItem('cyber_registered_accounts', JSON.stringify(accs));
        }
      }
    } catch {}
  }

  const tx: WalletTransaction = {
    id: `tx-plan-${Date.now()}`,
    type: 'FNB_PAYMENT',
    amount: plan.price,
    description: `Đăng ký ${plan.name} (Thời hạn ${plan.durationDays} ngày)`,
    pcName: current.pcName || 'WEB-ONLINE',
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    dateIso: new Date().toISOString(),
  };

  const updated: UserWallet = {
    ...current,
    userName: authUser.fullName || authUser.username,
    userTier: plan.badgeName,
    tierExpiresAt: expiresAt,
    balance: newBalance,
    transactions: [tx, ...(current.transactions || [])],
    lastTransaction: tx,
  };

  broadcastWalletUpdate(updated);

  return {
    success: true,
    wallet: updated,
    plan,
    newBalance,
    expiresAt,
  };
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

// ══════════ QUẢN LÝ TRẠM MÁY CLIENT PC ĐANG HOẠT ĐỘNG (ĐỒNG BỘ SERVER & WEB) ══════════
export interface ActiveStationInfo {
  stationId: string;
  stationName: string;
  zone: string;
  hourlyRate: number;
  occupantName: string;
  occupantTier: string;
  balance: number;
  isOnline: boolean;
  updatedAt: number;
}

export const ACTIVE_STATION_STORAGE_KEY = 'cyber_active_station';
export const ACTIVE_STATION_EVENT = 'cyber_active_station_updated';

export function getActiveClientStation(): ActiveStationInfo {
  if (typeof window === 'undefined') {
    return {
      stationId: 'ARENA-A1',
      stationName: 'Đấu Trường ARENA-A1',
      zone: 'Sàn Đấu 5vs5 Tầng 1',
      hourlyRate: 25000,
      occupantName: 'Trần Ngọc Nguyễn Văn A',
      occupantTier: 'TÂN THỦ (ROOKIE)',
      balance: 50000,
      isOnline: true,
      updatedAt: Date.now(),
    };
  }
  try {
    const raw = localStorage.getItem(ACTIVE_STATION_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  const w = getStoredWallet();
  return {
    stationId: w.pcName || 'ARENA-A1',
    stationName: `Máy ${w.pcName || 'ARENA-A1'}`,
    zone: w.zoneName || 'Sàn Đấu 5vs5 Tầng 1',
    hourlyRate: w.hourlyRate || 25000,
    occupantName: w.userName || 'Trần Ngọc Nguyễn Văn A',
    occupantTier: w.userTier || 'TÂN THỦ (ROOKIE)',
    balance: w.balance || 50000,
    isOnline: true,
    updatedAt: Date.now(),
  };
}

export function saveActiveClientStation(info: Partial<ActiveStationInfo>): ActiveStationInfo {
  const current = getActiveClientStation();
  const updated: ActiveStationInfo = {
    ...current,
    ...info,
    updatedAt: Date.now(),
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ACTIVE_STATION_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(ACTIVE_STATION_EVENT, { detail: updated }));
    } catch {}
  }
  return updated;
}
