'use client';

import { Order, OrderStatus, PaymentMethod } from '@/types/fnb';

export const STORAGE_KEY_ORDERS = 'cyber_orders';
export const STORAGE_KEY_BASE_REVENUE = 'cyber_base_revenue';
export const STORAGE_EVENT_NAME = 'cyber_orders_updated';

// Default mock orders to initialize if storage is empty
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1043',
    orderNumber: 1043,
    pcName: 'REG-24',
    zoneName: 'TẦNG 1 • ZONE REGULAR',
    status: 'PENDING',
    paymentMethod: 'CASH_OR_QR',
    totalAmount: 114000,
    timeElapsed: '09:15',
    note: 'LÀM CAY VỪA, TRỨNG LÒNG ĐÀO MỀM!',
    station: 'HOT_KITCHEN',
    items: ['2x Mì Trộn Indomie Double Trứng', '2x Sting Dâu Đá'],
    createdAt: new Date(Date.now() - (9 * 60 + 15) * 1000).toISOString(),
  },
  {
    id: 'ord-1042',
    orderNumber: 1042,
    pcName: 'VIP-08',
    zoneName: 'PHÒNG RIÊNG VIP TẦNG 2',
    status: 'COOKING',
    paymentMethod: 'ACCOUNT_BALANCE',
    totalAmount: 90000,
    timeElapsed: '04:18',
    note: 'THÊM 01 TRỨNG ỐP LA CHÍN KỸ 100%, KHÔNG ỚT CHUÔNG',
    station: 'HOT_KITCHEN',
    items: ['1x Cơm Bò Lúc Lắc', '1x Monster Energy Lạnh (Đã rót sẵn)'],
    createdAt: new Date(Date.now() - (6 * 60 + 30) * 1000).toISOString(),
    cookingStartedAt: new Date(Date.now() - (4 * 60 + 18) * 1000).toISOString(),
  },
  {
    id: 'ord-1040',
    orderNumber: 1040,
    pcName: 'ARENA-03',
    zoneName: 'SÂN KHẤU THI ĐẤU PRO',
    status: 'READY',
    paymentMethod: 'ACCOUNT_BALANCE',
    totalAmount: 101000,
    timeElapsed: 'READY',
    note: 'Đã đặt khay số 04 tại bàn giao đồ ăn tầng 1',
    station: 'BAR',
    items: ['1x Combo Cày Đêm Esports', '1x Trà Đào Cam Sả 1L'],
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    cookingStartedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-1044',
    orderNumber: 1044,
    pcName: 'VIP-12',
    zoneName: 'PHÒNG STREAM TẦNG 2',
    status: 'PENDING',
    paymentMethod: 'ACCOUNT_BALANCE',
    totalAmount: 75000,
    timeElapsed: '02:05',
    note: 'GIAO GẤP: ĐANG TRONG TRẬN TOURNAMENT FINAL',
    station: 'HOT_KITCHEN',
    items: ['1x Bánh Mì Chảo Đặc Biệt Cyber', '1x Monster Energy Trắng Lạnh'],
    createdAt: new Date(Date.now() - (2 * 60 + 5) * 1000).toISOString(),
  },
];

// Baseline stats from morning shifts (truoc khi cac don moi phat sinh)
export const BASELINE_REVENUE = 3850000;
export const BASELINE_COMPLETED_ORDERS = 55;

/**
 * Get all current orders from localStorage with fallback to INITIAL_ORDERS
 */
export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

/**
 * Broadcast update event so all components and open tabs update synchronously
 */
export function broadcastOrdersUpdate(orders: Order[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT_NAME, { detail: orders }));
  } catch (err) {
    console.error('Failed to broadcast orders update:', err);
  }
}

/**
 * Add a new order from Menu
 */
export function addOrder(newOrder: Order): Order[] {
  const current = getStoredOrders();
  const orderWithTime: Order = {
    ...newOrder,
    createdAt: newOrder.createdAt || new Date().toISOString(),
  };
  const updated = [orderWithTime, ...current];
  broadcastOrdersUpdate(updated);
  return updated;
}

/**
 * Update order status (PENDING -> COOKING -> READY -> DELIVERED)
 */
export function updateOrderStatus(orderId: string, nextStatus: OrderStatus): Order[] {
  const current = getStoredOrders();
  const nowIso = new Date().toISOString();
  const updated = current.map((ord) => {
    if (ord.id === orderId) {
      const isStartingCooking = nextStatus === 'COOKING' && !ord.cookingStartedAt;
      const isDone = nextStatus === 'READY' || nextStatus === 'DELIVERED';
      return {
        ...ord,
        status: nextStatus,
        cookingStartedAt: isStartingCooking ? nowIso : ord.cookingStartedAt,
        completedAt: isDone ? (ord.completedAt || nowIso) : ord.completedAt,
        timeElapsed: isDone ? 'READY' : ord.timeElapsed,
        updatedAt: nowIso,
      };
    }
    return ord;
  });

  broadcastOrdersUpdate(updated);
  return updated;
}

/**
 * Reset orders back to default for clean testing
 */
export function resetOrdersToDefault(): Order[] {
  broadcastOrdersUpdate(INITIAL_ORDERS);
  return INITIAL_ORDERS;
}

/**
 * Calculate dynamic revenue and stats matching actual kitchen completion
 */
export function calculateLiveDashboardStats(orders: Order[]) {
  // Find all orders that have completed preparation in KDS (READY or DELIVERED)
  const completedOrders = orders.filter(
    (o) => o.status === 'READY' || o.status === 'DELIVERED'
  );

  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const cookingOrders = orders.filter((o) => o.status === 'COOKING');

  // Sum revenue from completed orders in the current active session
  // Note: ord-1040 is part of INITIAL_ORDERS with READY status (101.000đ).
  // Baseline is 3.850.000đ.
  // Any order completed adds directly to total revenue.
  const liveCompletedRevenue = completedOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

  // Total revenue = Baseline morning shifts + live completed orders
  const totalRevenue = BASELINE_REVENUE + liveCompletedRevenue;

  // Item sales aggregation
  const itemMap: { [name: string]: { count: number; revenue: number } } = {
    'Mì Trộn Indomie Double Trứng': { count: 28, revenue: 1064000 },
    'Cơm Bò Lúc Lắc Phô Mai': { count: 19, revenue: 1045000 },
    'Combo Thức Đêm Chiến Game': { count: 14, revenue: 966000 },
    'Monster Energy Trắng Lạnh': { count: 24, revenue: 840000 },
    'Bánh Mì Chảo Đặc Biệt Cyber': { count: 12, revenue: 540000 },
    'Khoai Tây Lắc Trứng Muối': { count: 12, revenue: 360000 },
  };

  // Add counts from completed orders
  completedOrders.forEach((ord) => {
    ord.items.forEach((item) => {
      const itemStr = typeof item === 'string' ? item : item.name || '';
      // Parse quantity and name, e.g. "2x Mì Trộn Indomie Double Trứng"
      const match = itemStr.match(/^(\d+)x\s*(.*)$/);
      const qty = match ? parseInt(match[1], 10) : 1;
      const cleanName = (match ? match[2] : itemStr).split('(')[0].trim();

      if (cleanName) {
        if (!itemMap[cleanName]) {
          itemMap[cleanName] = { count: 0, revenue: 0 };
        }
        itemMap[cleanName].count += qty;
        itemMap[cleanName].revenue += (ord.totalAmount / (ord.items.length || 1));
      }
    });
  });

  const bestSellers = Object.entries(itemMap)
    .map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((item, idx) => ({
      rank: idx + 1,
      name: item.name,
      count: item.count,
      revenue: `${item.revenue.toLocaleString('vi-VN')}đ`,
      rate: `${Math.min(95, Math.max(30, Math.round((item.count / 35) * 100)))}%`,
    }));

  return {
    totalRevenue,
    formattedRevenue: `${totalRevenue.toLocaleString('vi-VN')}đ`,
    liveCompletedRevenue,
    formattedLiveCompleted: `${liveCompletedRevenue.toLocaleString('vi-VN')}đ`,
    totalOrdersCount: BASELINE_COMPLETED_ORDERS + completedOrders.length + pendingOrders.length + cookingOrders.length,
    completedCount: BASELINE_COMPLETED_ORDERS + completedOrders.length,
    pendingCount: pendingOrders.length,
    cookingCount: cookingOrders.length,
    readyCount: completedOrders.length,
    recentCompletedOrders: completedOrders,
    bestSellers,
  };
}
