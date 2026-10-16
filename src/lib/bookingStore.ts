export interface SeatBooking {
  id: string;
  seatId: string;
  customerName: string;
  phone: string;
  timeSlot: string;
  date: string;
  zone: string;
  branch: string;
  bookingCode: string;
  status: 'RESERVED' | 'OCCUPIED' | 'AVAILABLE';
  createdAt: string;
  notes?: string;
}

export const BOOKING_STORAGE_KEY = 'CYBER_ZONE_BOOKINGS';
export const BOOKING_STORAGE_EVENT = 'cyber_booking_sync';

export const INITIAL_BOOKINGS: SeatBooking[] = [
  {
    id: 'bk-1',
    seatId: 'VIP-02',
    customerName: 'Nguyễn Văn A',
    phone: '0912.345.678',
    timeSlot: '18:00 - 22:00 (Giờ cao điểm)',
    date: '2026-10-16',
    zone: 'Ultra VIP Suite (RTX 4090)',
    branch: 'Zone 01: 128 Nguyễn Trãi, Q.1, TP.HCM',
    bookingCode: 'CZ-2026-X89',
    status: 'RESERVED',
    createdAt: new Date().toISOString(),
    notes: 'Khách đặt trước qua Web Cyber Zone, yêu cầu cài sẵn CS2 và Valorant',
  },
  {
    id: 'bk-2',
    seatId: 'VIP-06',
    customerName: 'Trần Bảo Ngọc',
    phone: '0988.777.666',
    timeSlot: '13:00 - 17:00',
    date: '2026-10-16',
    zone: 'VIP Zone (Màn 240Hz)',
    branch: 'Zone 01: 128 Nguyễn Trãi, Q.1, TP.HCM',
    bookingCode: 'CZ-2026-X42',
    status: 'RESERVED',
    createdAt: new Date().toISOString(),
    notes: 'Giữ máy 30 phút, hội viên VIP',
  },
  {
    id: 'bk-3',
    seatId: 'ARENA-02',
    customerName: 'Lê Minh Vũ (T1 Fan)',
    phone: '0909.888.999',
    timeSlot: '18:00 - 22:00 (Giờ cao điểm)',
    date: '2026-10-16',
    zone: 'Gaming Zone (Đấu trường mở)',
    branch: 'Zone 01: 128 Nguyễn Trãi, Q.1, TP.HCM',
    bookingCode: 'CZ-2026-A10',
    status: 'RESERVED',
    createdAt: new Date().toISOString(),
    notes: 'Đấu giải nội bộ LoL',
  },
];

export function getStoredBookings(): SeatBooking[] {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS;
  try {
    const raw = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BOOKINGS;
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveBooking(
  bookingData: Omit<SeatBooking, 'id' | 'createdAt' | 'bookingCode'> & { bookingCode?: string }
): SeatBooking {
  const current = getStoredBookings();
  const code = bookingData.bookingCode || `CZ-2026-X${Math.floor(100 + Math.random() * 900)}`;

  // Filter out any previous booking on the same seat
  const filtered = current.filter((b) => b.seatId !== bookingData.seatId);

  const newBooking: SeatBooking = {
    ...bookingData,
    id: `bk-${Date.now()}`,
    bookingCode: code,
    status: 'RESERVED',
    createdAt: new Date().toISOString(),
  };

  const updated = [newBooking, ...filtered];
  if (typeof window !== 'undefined') {
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(BOOKING_STORAGE_EVENT, { detail: updated }));
  }
  return newBooking;
}

export function cancelBooking(seatId: string): void {
  const current = getStoredBookings();
  const updated = current.filter((b) => b.seatId !== seatId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(BOOKING_STORAGE_EVENT, { detail: updated }));
  }
}
