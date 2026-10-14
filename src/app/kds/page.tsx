'use client';

import React, { useState, useEffect } from 'react';
import KdsOrderCard from '@/components/fnb/KdsOrderCard';
import { Order, OrderStatus, KdsFilterStation } from '@/types/fnb';
import {
  getStoredOrders,
  updateOrderStatus,
  addOrder,
  resetOrdersToDefault,
  STORAGE_EVENT_NAME,
} from '@/lib/orderStore';

export default function KitchenDisplaySystem() {
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [stationFilter, setStationFilter] = useState<KdsFilterStation>('ALL');
  const [runnerNotification, setRunnerNotification] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load and subscribe to synchronized orders
  useEffect(() => {
    // Initial load
    setOrders(getStoredOrders());

    const syncHandler = () => {
      setOrders(getStoredOrders());
    };

    window.addEventListener(STORAGE_EVENT_NAME, syncHandler);
    window.addEventListener('storage', syncHandler);

    return () => {
      window.removeEventListener(STORAGE_EVENT_NAME, syncHandler);
      window.removeEventListener('storage', syncHandler);
    };
  }, []);

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}:${secs}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio Beep / Chime
  const playSoundEffect = (type: 'beep' | 'success' = 'beep') => {
    if (!audioEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'beep') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // AudioContext fallback
    }
  };

  // Status Counts
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const cookingCount = orders.filter((o) => o.status === 'COOKING').length;
  const readyCount = orders.filter((o) => o.status === 'READY' || o.status === 'DELIVERED').length;

  // Update Status - Persists to orderStore and updates Dashboard revenue
  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    playSoundEffect(nextStatus === 'READY' || nextStatus === 'DELIVERED' ? 'success' : 'beep');
    const updated = updateOrderStatus(orderId, nextStatus);
    setOrders(updated);

    const target = updated.find((o) => o.id === orderId);
    if (nextStatus === 'READY' && target) {
      setRunnerNotification(
        `✓ Đã hoàn thành đơn #${target.orderNumber} (${target.pcName}) - Doanh thu +${target.totalAmount.toLocaleString('vi-VN')}đ đã được ghi nhận vào Bảng Thống Kê!`
      );
      setTimeout(() => setRunnerNotification(null), 4500);
    }
  };

  // Notify Runner
  const handleNotifyRunner = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      playSoundEffect('success');
      setRunnerNotification(
        `🔔 Đã phát chuông điều phối Runner mang món đến máy ${targetOrder.pcName}!`
      );
      setTimeout(() => {
        setRunnerNotification(null);
      }, 4000);
    }
  };

  // Quick Simulation: Add mock new order from client machine
  const handleAddMockOrder = () => {
    playSoundEffect('beep');
    const newNum = Math.floor(1050 + Math.random() * 50);
    const mockOrder: Order = {
      id: `ord-${newNum}`,
      orderNumber: newNum,
      pcName: `REG-${Math.floor(10 + Math.random() * 80)}`,
      zoneName: 'ZONE STANDARDS - TẦNG 1',
      status: 'PENDING',
      paymentMethod: 'ACCOUNT_BALANCE',
      totalAmount: 85000,
      timeElapsed: '00:01',
      note: 'Vui lòng giao sớm, khách đang chơi rank LOL',
      station: 'HOT_KITCHEN',
      items: ['1x Cơm Gà Xối Mỡ Da Giòn', '1x Sting Dâu Đá'],
      createdAt: new Date().toISOString(),
    };

    const updated = addOrder(mockOrder);
    setOrders(updated);
  };

  const handleResetData = () => {
    if (confirm('Khôi phục danh sách đơn bếp về mặc định ban đầu?')) {
      const reset = resetOrdersToDefault();
      setOrders(reset);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    if (stationFilter === 'ALL') return true;
    return ord.station === stationFilter;
  });

  return (
    <div className="min-h-screen bg-[#070e1d] text-slate-100 p-4 lg:p-6 flex flex-col font-sans select-none">
      {/* Header KDS */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#0c1322] border border-cyan-500/20 p-4 rounded-xl mb-6 shadow-xl gap-4">
        {/* Left: Clock & Metrics Badges */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Digital Clock */}
          <div className="bg-[#141b2b] border border-cyan-500/40 px-4 py-2 rounded-lg font-mono text-2xl lg:text-3xl font-black text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            {currentTime}
          </div>

          {/* Metric Status Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-rose-500/20 border border-rose-500/40 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span>
              CHỜ XỬ LÝ: {pendingCount}
            </span>
            <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              ĐANG NẤU: {cookingCount}
            </span>
            <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              HOÀN THÀNH: {readyCount}
            </span>
          </div>
        </div>

        {/* Right: Station Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStationFilter('ALL')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition font-mono ${
              stationFilter === 'ALL'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-[#141b2b] border border-slate-700 text-slate-300 hover:bg-[#1a233a]'
            }`}
          >
            Tất cả trạm
          </button>
          <button
            onClick={() => setStationFilter('HOT_KITCHEN')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition font-mono ${
              stationFilter === 'HOT_KITCHEN'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-[#141b2b] border border-slate-700 text-slate-300 hover:bg-[#1a233a]'
            }`}
          >
            🍳 Bếp Nóng
          </button>
          <button
            onClick={() => setStationFilter('BAR')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition font-mono ${
              stationFilter === 'BAR'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-[#141b2b] border border-slate-700 text-slate-300 hover:bg-[#1a233a]'
            }`}
          >
            🍹 Pha Chế Bar
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              audioEnabled
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {audioEnabled ? 'notifications_active' : 'notifications_off'}
            </span>
            <span>Âm Báo: {audioEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Quick Simulation New Order */}
          <button
            onClick={handleAddMockOrder}
            className="bg-[#141b2b] hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 px-3 py-2 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1"
            title="Tạo đơn giả lập từ máy khách"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Thêm Đơn Test</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleResetData}
            className="bg-[#141b2b] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 px-2.5 py-2 rounded-lg text-xs transition"
            title="Khôi phục trạng thái ban đầu"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
          </button>
        </div>
      </header>

      {/* Runner / Sync Notification Toast */}
      {runnerNotification && (
        <div className="bg-emerald-950/90 border-2 border-emerald-400 text-emerald-200 px-4 py-3 rounded-xl mb-4 flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce">
          <span className="material-symbols-outlined text-2xl text-emerald-400">check_circle</span>
          <div className="font-bold text-sm">{runnerNotification}</div>
        </div>
      )}

      {/* Grid KDS Cards */}
      {filteredOrders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-20 bg-[#0c1322] rounded-xl border border-slate-800">
          <span className="material-symbols-outlined text-5xl mb-2 text-slate-600">restaurant</span>
          <p className="text-base font-bold text-slate-300">Không có đơn hàng nào ở trạm này</p>
          <p className="text-xs text-slate-500 mt-1">Đơn hàng mới từ khách sẽ xuất hiện tự động tại đây</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1">
          {filteredOrders.map((ord) => (
            <KdsOrderCard
              key={ord.id}
              order={ord}
              onUpdateStatus={handleUpdateStatus}
              onNotifyRunner={handleNotifyRunner}
            />
          ))}
        </div>
      )}
    </div>
  );
}
