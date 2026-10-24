export interface StaffRequest {
  id: string;
  pcName: string;
  type: 'TOPUP_CASH' | 'HARDWARE_ISSUE' | 'CLEAN_DESK' | 'EXTRA_SERVICE' | 'OTHER';
  title: string;
  details: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
}

export const STAFF_REQUEST_STORAGE_KEY = 'CYBER_STAFF_REQUESTS';
export const STAFF_REQUEST_EVENT = 'cyber_staff_request_sync';

export const INITIAL_STAFF_REQUESTS: StaffRequest[] = [
  {
    id: 'req-1',
    pcName: 'VIP-05',
    type: 'TOPUP_CASH',
    title: 'Nạp tiền mặt tại máy',
    details: 'Khách cần nạp 100.000đ tiền mặt vào tài khoản máy VIP-05',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: 'req-2',
    pcName: 'ARENA-03',
    type: 'EXTRA_SERVICE',
    title: 'Thêm đá lạnh & nước lọc',
    details: 'Khách xin thêm 01 ly đá riêng và giấy lau tay',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
];

export function getStoredStaffRequests(): StaffRequest[] {
  if (typeof window === 'undefined') return INITIAL_STAFF_REQUESTS;
  try {
    const raw = localStorage.getItem(STAFF_REQUEST_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STAFF_REQUEST_STORAGE_KEY, JSON.stringify(INITIAL_STAFF_REQUESTS));
      return INITIAL_STAFF_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_STAFF_REQUESTS;
  } catch {
    return INITIAL_STAFF_REQUESTS;
  }
}

export function createStaffRequest(
  data: Omit<StaffRequest, 'id' | 'status' | 'createdAt'>
): StaffRequest {
  const current = getStoredStaffRequests();
  const newReq: StaffRequest = {
    ...data,
    id: `req-${Date.now()}`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  const updated = [newReq, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STAFF_REQUEST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(STAFF_REQUEST_EVENT, { detail: updated }));
    window.dispatchEvent(new Event('storage'));
  }
  return newReq;
}

export function resolveStaffRequest(requestId: string): StaffRequest[] {
  const current = getStoredStaffRequests();
  const updated = current.map((r) =>
    r.id === requestId ? { ...r, status: 'RESOLVED' as const } : r
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem(STAFF_REQUEST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(STAFF_REQUEST_EVENT, { detail: updated }));
    window.dispatchEvent(new Event('storage'));
  }
  return updated;
}
