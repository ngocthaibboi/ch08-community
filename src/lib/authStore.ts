'use client';

import { determineTierByAmount, getTierByName } from './gamerPass';

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  email?: string;
  userTier: string;
  balance: number;
}

export const AUTH_STORAGE_KEY = 'cyber_auth_current_user';
export const AUTH_EVENT_NAME = 'cyber_auth_updated';

/**
 * Lấy thông tin user đang đăng nhập từ localStorage.
 * Trả về null nếu chưa đăng nhập.
 */
export function getLoggedInUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const user: AuthUser = JSON.parse(raw);
    if (user && typeof user.balance === 'number') {
      // Chuẩn hóa hạng nếu người dùng nạp tiền
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

/**
 * Đăng nhập người dùng và chuẩn hóa hạng thẻ
 */
export function loginUser(userData: AuthUser) {
  if (typeof window === 'undefined') return;
  try {
    // Tự động kiểm tra thăng hạng theo số dư nếu có
    if (typeof userData.balance === 'number') {
      const matchedTier = determineTierByAmount(userData.balance);
      const currentTier = getTierByName(userData.userTier);
      if (matchedTier.minAmount > currentTier.minAmount) {
        userData.userTier = matchedTier.name;
      }
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: userData }));
  } catch (err) {
    console.error('Failed to save auth state:', err);
  }
}

/**
 * Cập nhật số dư và tự động thăng hạng người dùng
 */
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

/**
 * Đăng xuất
 */
export function logoutUser() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: null }));
  } catch (err) {
    console.error('Failed to logout:', err);
  }
}
