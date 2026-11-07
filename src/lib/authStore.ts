'use client';

import { determineTierByAmount, getTierByName, GAMER_PASS_TIERS } from './gamerPass';

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  email?: string;
  userTier: string;
  balance: number;
}

export interface RegisteredAccount {
  id: string;
  username: string;
  password: string;
  fullName: string;
  phone: string;
  email?: string;
  userTier: string;
  balance: number;
  createdAt: string;
}

export const AUTH_STORAGE_KEY = 'cyber_auth_current_user';
export const AUTH_EVENT_NAME = 'cyber_auth_updated';
export const REGISTERED_ACCOUNTS_STORAGE_KEY = 'cyber_registered_accounts';

// Danh sách tài khoản mặc định khởi tạo ban đầu cho hệ thống
export const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'usr-thai',
    username: 'thaibboi',
    password: '123',
    fullName: 'Nguyễn Văn Thái',
    phone: '0988.888.888',
    email: 'thai@cyberzone.vn',
    userTier: 'HỘI VIÊN BẠC 🥈',
    balance: 200000,
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'usr-admin',
    username: 'admin',
    password: '123',
    fullName: 'Quản Lý Cyber Zone',
    phone: '0912.888.999',
    email: 'admin@cyberzone.vn',
    userTier: 'HỘI VIÊN KIM CƯƠNG 💎',
    balance: 500000,
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'usr-gamer',
    username: 'gamer01',
    password: '123',
    fullName: 'Trần Văn Nam',
    phone: '0905.123.456',
    email: 'namtv@gmail.com',
    userTier: 'TÂN THỦ (ROOKIE)',
    balance: 50000,
    createdAt: '2026-10-15T00:00:00.000Z',
  },
];

// Lấy danh sách tất cả tài khoản đã đăng ký trong hệ thống
export function getRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const accounts = JSON.parse(raw);
    if (!Array.isArray(accounts) || accounts.length === 0) {
      localStorage.setItem(REGISTERED_ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    return accounts;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

// Lưu danh sách tài khoản
export function saveRegisteredAccounts(accounts: RegisteredAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REGISTERED_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Lỗi lưu danh sách tài khoản:', err);
  }
}

// Tìm tài khoản theo username (không phân biệt hoa thường)
export function findAccountByUsername(username: string): RegisteredAccount | null {
  const accounts = getRegisteredAccounts();
  const cleanUsername = username.trim().toLowerCase();
  return accounts.find((acc) => acc.username.trim().toLowerCase() === cleanUsername) || null;
}

// Đăng ký tài khoản mới vào hệ thống
export function registerAccount(data: {
  username: string;
  password: string;
  fullName?: string;
  phone: string;
  email?: string;
  initialBalance?: number;
}): { success: boolean; error?: string; user?: AuthUser } {
  const cleanUsername = data.username.trim();
  const cleanPassword = data.password.trim();
  const cleanPhone = data.phone.trim();

  if (!cleanUsername) {
    return { success: false, error: 'Vui lòng nhập tên tài khoản!' };
  }
  if (cleanUsername.length < 3) {
    return { success: false, error: 'Tên tài khoản phải có ít nhất 3 ký tự!' };
  }
  if (!cleanPassword) {
    return { success: false, error: 'Vui lòng nhập mật khẩu!' };
  }
  if (cleanPassword.length < 3) {
    return { success: false, error: 'Mật khẩu phải có ít nhất 3 ký tự!' };
  }
  if (!cleanPhone) {
    return { success: false, error: 'Vui lòng nhập số điện thoại liên hệ!' };
  }

  // Kiểm tra tài khoản đã tồn tại chưa
  const existing = findAccountByUsername(cleanUsername);
  if (existing) {
    return {
      success: false,
      error: `Tài khoản "${cleanUsername}" đã tồn tại trên hệ thống! Vui lòng chọn tên khác hoặc chuyển sang Đăng nhập.`,
    };
  }

  const initialBal = typeof data.initialBalance === 'number' ? data.initialBalance : 50000;
  const initialTier = determineTierByAmount(initialBal);

  const newAccount: RegisteredAccount = {
    id: `usr-${Date.now()}`,
    username: cleanUsername,
    password: cleanPassword,
    fullName: data.fullName?.trim() || cleanUsername,
    phone: cleanPhone,
    email: data.email?.trim() || '',
    userTier: initialTier.name,
    balance: initialBal,
    createdAt: new Date().toISOString(),
  };

  const currentAccounts = getRegisteredAccounts();
  const updatedAccounts = [newAccount, ...currentAccounts];
  saveRegisteredAccounts(updatedAccounts);

  const authUser: AuthUser = {
    id: newAccount.id,
    username: newAccount.username,
    fullName: newAccount.fullName,
    phone: newAccount.phone,
    email: newAccount.email,
    userTier: newAccount.userTier,
    balance: newAccount.balance,
  };

  return { success: true, user: authUser };
}

// Xác thực đăng nhập: Bắt buộc đúng tài khoản và đúng mật khẩu
export function authenticateUser(
  username: string,
  password: string
): { success: boolean; error?: string; user?: AuthUser } {
  const cleanUsername = username.trim();
  const cleanPassword = password.trim();

  if (!cleanUsername || !cleanPassword) {
    return { success: false, error: 'Vui lòng nhập đầy đủ tên tài khoản và mật khẩu!' };
  }

  const account = findAccountByUsername(cleanUsername);
  if (!account) {
    return {
      success: false,
      error: `Tài khoản "${cleanUsername}" không tồn tại trên hệ thống! Vui lòng kiểm tra lại hoặc Đăng ký tài khoản mới.`,
    };
  }

  if (account.password !== cleanPassword) {
    return {
      success: false,
      error: 'Mật khẩu không chính xác! Vui lòng kiểm tra lại.',
    };
  }

  const authUser: AuthUser = {
    id: account.id,
    username: account.username,
    fullName: account.fullName,
    phone: account.phone,
    email: account.email,
    userTier: account.userTier,
    balance: account.balance,
  };

  return { success: true, user: authUser };
}

export function getLoggedInUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const user: AuthUser = JSON.parse(raw);
    if (user && typeof user.balance === 'number') {
      const matchedTier = determineTierByAmount(user.balance);
      const currentTier = getTierByName(user.userTier);
      if (matchedTier.minAmount > currentTier.minAmount) {
        user.userTier = matchedTier.name;
      }
    }
    return user;
  } catch {
    return null;
  }
}

export function loginUser(userData: AuthUser) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof userData.balance === 'number') {
      const matchedTier = determineTierByAmount(userData.balance);
      const currentTier = getTierByName(userData.userTier);
      if (matchedTier.minAmount > currentTier.minAmount) {
        userData.userTier = matchedTier.name;
      }
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: userData }));

    // Cập nhật số dư & hạng vào cơ sở dữ liệu Registered Accounts để ghi nhớ vĩnh viễn
    const accounts = getRegisteredAccounts();
    const idx = accounts.findIndex((a) => a.username.toLowerCase() === userData.username.toLowerCase());
    if (idx !== -1) {
      accounts[idx].balance = userData.balance;
      accounts[idx].userTier = userData.userTier;
      if (userData.fullName) accounts[idx].fullName = userData.fullName;
      if (userData.phone) accounts[idx].phone = userData.phone;
      saveRegisteredAccounts(accounts);
    }

    const walletRaw = localStorage.getItem('cyber_user_wallet');
    if (walletRaw) {
      try {
        const w = JSON.parse(walletRaw);
        w.userName = userData.fullName || userData.username;
        if (userData.userTier) w.userTier = userData.userTier;
        if (typeof userData.balance === 'number') w.balance = userData.balance;
        localStorage.setItem('cyber_user_wallet', JSON.stringify(w));
        window.dispatchEvent(new CustomEvent('cyber_wallet_updated', { detail: w }));
      } catch {}
    }
  } catch (err) {
    console.error('Failed to save auth state:', err);
  }
}

export function updateCurrentUserBalanceAndTier(newBalance: number): AuthUser | null {
  const current = getLoggedInUser();
  if (!current) return null;
  const newTier = determineTierByAmount(newBalance);
  const updatedUser: AuthUser = {
    ...current,
    balance: newBalance,
    userTier: newTier.name,
  };
  loginUser(updatedUser);
  return updatedUser;
}

export function logoutUser() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: null }));

    const walletRaw = localStorage.getItem('cyber_user_wallet');
    if (walletRaw) {
      try {
        const w = JSON.parse(walletRaw);
        w.userName = 'Tài khoản Hội viên';
        localStorage.setItem('cyber_user_wallet', JSON.stringify(w));
        window.dispatchEvent(new CustomEvent('cyber_wallet_updated', { detail: w }));
      } catch {}
    }
  } catch (err) {
    console.error('Failed to logout:', err);
  }
}
