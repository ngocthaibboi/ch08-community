'use client';

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
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Đăng nhập người dùng
 */
export function loginUser(userData: AuthUser) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: userData }));
  } catch (err) {
    console.error('Failed to save auth state:', err);
  }
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
