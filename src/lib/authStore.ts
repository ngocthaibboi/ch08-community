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