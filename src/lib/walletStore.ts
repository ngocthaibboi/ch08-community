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
  tierExpiresAt?: number;
  balance: number;
  hourlyRate: number;
  remainingSeconds?: number;
  transactions: WalletTransaction[];
  lastTransaction?: WalletTransaction;
}

export const STORAGE_KEY_WALLET = 'cyber_user_wallet';
export const STORAGE_KEY_REMAINING_SECONDS = 'cyber_client_remaining_seconds';
export const STORAGE_KEY_REMAINING_OWNER = 'cyber_client_remaining_owner';
export const WALLET_EVENT_NAME = 'cyber_wallet_updated';
export const BASELINE_TOPUP_REVENUE = 0;
export const INITIAL_TRANSACTIONS: WalletTransaction[] = [];

export const INITIAL_WALLET: UserWallet = {
  userName: 'Nguyễn Văn A',
  pcName: 'VIP-08',
  zoneName: 'PHÒNG RIÊNG VIP TẦNG 2',
  userTier: 'HỘI VIÊN BẠC 🥈',
  balance: 200000,
  hourlyRate: 22000,
  remainingSeconds: Math.floor((200000 / 22000) * 3600),
  transactions: [],
};

export function getStoredRemainingSeconds(
  ownerUsername?: string,
  fallbackBalance?: number,
  hourlyRate: number = 22000
): number {
  if (typeof window === 'undefined') return 0;
  try {
    const savedOwner = localStorage.getItem(STORAGE_KEY_REMAINING_OWNER);
    const rawSecs = localStorage.getItem(STORAGE_KEY_REMAINING_SECONDS);
    if (rawSecs !== null) {
      const parsed = parseInt(rawSecs, 10);
      if (!isNaN(parsed) && parsed > 0) {
        if (!ownerUsername || !savedOwner || savedOwner.toLowerCase() === ownerUsername.toLowerCase()) {
          return parsed;
        }
      }
    }
    if (ownerUsername) {
      const userSaved = localStorage.getItem(`cyber_saved_time_${ownerUsername.toLowerCase()}`);
      if (userSaved !== null) {
        const parsedUser = parseInt(userSaved, 10);
        if (!isNaN(parsedUser) && parsedUser > 0) {
          return parsedUser;
        }
      }
    }
  } catch {}
  const bal = typeof fallbackBalance === 'number' ? fallbackBalance : 200000;
  const rate = hourlyRate > 0 ? hourlyRate : 22000;
  return bal > 0 ? Math.floor((bal / rate) * 3600) : 0;
}

export function saveStoredRemainingSeconds(seconds: number, ownerUsername?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanSecs = Math.max(0, Math.floor(seconds));
    localStorage.setItem(STORAGE_KEY_REMAINING_SECONDS, String(cleanSecs));
    let uname = ownerUsername;
    if (!uname) {
      try {
        const u = JSON.parse(localStorage.getItem('cyber_auth_current_user') || 'null');
        uname = u?.username;
      } catch {}
    }
    if (uname) {
      localStorage.setItem(STORAGE_KEY_REMAINING_OWNER, uname.toLowerCase());
      localStorage.setItem(`cyber_saved_time_${uname.toLowerCase()}`, String(cleanSecs));
    }
  } catch {}
}

export function addRemainingPlaySeconds(addedSeconds: number, ownerUsername?: string): number {
  const w = getStoredWallet();
  const current = getStoredRemainingSeconds(ownerUsername, w.balance, w.hourlyRate);
  const next = Math.max(0, current + Math.floor(addedSeconds));
  saveStoredRemainingSeconds(next, ownerUsername);
  w.remainingSeconds = next;
  broadcastWalletUpdate(w);
  return next;
}

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
        balance: typeof authUser?.balance === 'number' ? authUser.balance : INITIAL_WALLET.balance,
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

    if (authUser && typeof authUser.balance === 'number') {
      merged.balance = authUser.balance;
      merged.userName = authUser.fullName || authUser.username;
      merged.userTier = authUser.userTier || 'TÂN THỦ (ROOKIE)';
      merged.tierExpiresAt = authUser.tierExpiresAt;

      // Bảo vệ số dư chuẩn cho demo
      if (authUser.username?.toLowerCase() === 'admin1' && merged.balance > 200000) {
        merged.balance = 200000;
        merged.userTier = 'HỘI VIÊN BẠC 🥈';
      } else if (authUser.username?.toLowerCase() === 'admin2' && merged.balance > 500000) {
        merged.balance = 500000;
        merged.userTier = 'HỘI VIÊN KIM CƯƠNG 💎';
      } else if (authUser.username?.toLowerCase() === 'gamer01' && merged.balance > 50000) {
        merged.balance = 50000;
        merged.userTier = 'TÂN THỦ (ROOKIE)';
      }
    }

    if (merged.userName) {
      const normW = merged.userName.replace(/\s+/g, ' ');
      if (normW.includes('Trần Ngọc Nguyễn Văn A') || (merged.userName.includes('Trần Ngọc') && merged.userName.includes('Nguyễn Văn A'))) {
        merged.userName = 'Trần Ngọc Thái';
        localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(merged));
      }
    }

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
    type: 'PLAY_TIME',
    amount: plan.price,
    description: `Đăng ký ${plan.name} (Thời hạn ${plan.durationDays} ngày)`,
    pcName: current.pcName || 'WEB-ONLINE',
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    dateIso: new Date().toISOString(),
  };

  const bonusHours = plan.code === 'DIAMOND' ? 20 : plan.code === 'GOLD' ? 8 : 3;
  const prevSecs = getStoredRemainingSeconds(authUser.username, currentBalance, current.hourlyRate || 22000);
  const nextSecs = prevSecs + bonusHours * 3600;
  saveStoredRemainingSeconds(nextSecs, authUser.username);

  const updated: UserWallet = {
    ...current,
    userName: authUser.fullName || authUser.username,
    userTier: plan.badgeName,
    tierExpiresAt: expiresAt,
    balance: newBalance,
    remainingSeconds: nextSecs,
    transactions: [tx, ...(current.transactions || [])],
    lastTransaction: tx,
  };

      try {
      const sessRaw = localStorage.getItem('cyber_client_pc_session');
      if (sessRaw) {
        const sessUser = JSON.parse(sessRaw);
        if (sessUser) {
          sessUser.balance = newBalance;
          localStorage.setItem('cyber_client_pc_session', JSON.stringify(sessUser));
          window.dispatchEvent(new CustomEvent('cyber_client_pc_updated', { detail: sessUser }));
        }
      }
    } catch {}

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

          const rawAccs = localStorage.getItem('cyber_registered_accounts');
          if (rawAccs) {
            const accs = JSON.parse(rawAccs);
            const idx = accs.findIndex((a: any) => a.username.toLowerCase() === authUser.username.toLowerCase());
            if (idx !== -1) {
              accs[idx].balance = newBalance;
              accs[idx].userTier = newTierInfo.name;
              localStorage.setItem('cyber_registered_accounts', JSON.stringify(accs));
            }
          }
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
  description: string = 'Thanh toán đồ ăn F&B',
  txType?: 'FNB_PAYMENT' | 'PLAY_TIME'
): { success: boolean; wallet: UserWallet; error?: string } {
  const current = getStoredWallet();
  if (current.balance < amount) {
    return {
      success: false,
      wallet: current,
      error: `Số dư tài khoản (${current.balance.toLocaleString('vi-VN')}đ) không đủ để thanh toán ${amount.toLocaleString('vi-VN')}đ! Vui lòng nạp thêm tiền vào tài khoản.`,
    };
  }
  const newBalance = current.balance - amount;
  const descLower = description.toLowerCase();
  const resolvedType: 'FNB_PAYMENT' | 'PLAY_TIME' =
    txType ||
    (descLower.includes('giờ') || descLower.includes('combo') || descLower.includes('nạp máy')
      ? 'PLAY_TIME'
      : 'FNB_PAYMENT');

  const tx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    type: resolvedType,
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

          const rawAccs = localStorage.getItem('cyber_registered_accounts');
          if (rawAccs) {
            const accs = JSON.parse(rawAccs);
            const idx = accs.findIndex((a: any) => a.username.toLowerCase() === authUser.username.toLowerCase());
            if (idx !== -1) {
              accs[idx].balance = newBalance;
              localStorage.setItem('cyber_registered_accounts', JSON.stringify(accs));
            }
          }
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
  const defaultSecs = Math.floor((INITIAL_WALLET.balance / INITIAL_WALLET.hourlyRate) * 3600);
  const resetState: UserWallet = {
    ...INITIAL_WALLET,
    balance: 200000,
    userTier: 'HỘI VIÊN BẠC 🥈',
    remainingSeconds: defaultSecs,
    transactions: [],
  };
  if (typeof window !== 'undefined') {
    try {
      saveStoredRemainingSeconds(defaultSecs, 'admin1');
      const authRaw = localStorage.getItem('cyber_auth_current_user');
      if (authRaw) {
        const authUser = JSON.parse(authRaw);
        if (authUser) {
          authUser.balance = 200000;
          authUser.userTier = 'HỘI VIÊN BẠC 🥈';
          localStorage.setItem('cyber_auth_current_user', JSON.stringify(authUser));
          localStorage.setItem('cyber_client_pc_session', JSON.stringify(authUser));
          saveStoredRemainingSeconds(defaultSecs, authUser.username);
          window.dispatchEvent(new CustomEvent('cyber_auth_updated', { detail: authUser }));

          const rawAccs = localStorage.getItem('cyber_registered_accounts');
          if (rawAccs) {
            const accs = JSON.parse(rawAccs);
            const idx = accs.findIndex((a: any) => a.username.toLowerCase() === authUser.username.toLowerCase());
            if (idx !== -1) {
              accs[idx].balance = 200000;
              accs[idx].userTier = 'HỘI VIÊN BẠC 🥈';
              localStorage.setItem('cyber_registered_accounts', JSON.stringify(accs));
            }
          }
        }
      }
    } catch {}
  }
  broadcastWalletUpdate(resetState);
  return resetState;
}

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
      occupantName: 'Trần Ngọc Thái',
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
    occupantName: w.userName || 'Trần Ngọc Thái',
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
