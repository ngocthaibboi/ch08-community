'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ALL_SEATS_CONFIG,
  getStoredBookings,
  cancelBooking,
  clearAllBookings,
  SeatBooking,
  BOOKING_STORAGE_EVENT,
  BaseSeat,
} from '@/lib/bookingStore';
import {
  getStoredStaffRequests,
  resolveStaffRequest,
  clearAllStaffRequests,
  StaffRequest,
  STAFF_REQUEST_EVENT,
} from '@/lib/staffRequestStore';
import {
  getStoredOrders,
  resetOrdersToDefault,
  STORAGE_EVENT_NAME,
} from '@/lib/orderStore';
import {
  getStoredWallet,
  calculateTotalTopupRevenue,
  resetWalletToDefault,
  WALLET_EVENT_NAME,
} from '@/lib/walletStore';

export default function MainServerPage() {
  const [bookings, setBookings] = useState<SeatBooking[]>([]);
  const [staffRequests, setStaffRequests] = useState<StaffRequest[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [activeFloor, setActiveFloor] = useState<number | 'ALL'>('ALL');
  const [selectedSeat, setSelectedSeat] = useState<BaseSeat | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Đồng bộ tất cả dữ liệu hệ thống
  const syncAllData = () => {
    setBookings(getStoredBookings());
    setStaffRequests(getStoredStaffRequests());
    const orders = getStoredOrders();
    setOrdersCount(orders.length);
    const topupRev = calculateTotalTopupRevenue().totalTopup;
    const fnbRev = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    setRevenue(topupRev + fnbRev);
  };

  useEffect(() => {
    syncAllData();
    window.addEventListener(BOOKING_STORAGE_EVENT, syncAllData);
    window.addEventListener(STAFF_REQUEST_EVENT, syncAllData);
    window.addEventListener(STORAGE_EVENT_NAME, syncAllData);
    window.addEventListener(WALLET_EVENT_NAME, syncAllData);
    window.addEventListener('storage', syncAllData);

    return () => {
      window.removeEventListener(BOOKING_STORAGE_EVENT, syncAllData);
      window.removeEventListener(STAFF_REQUEST_EVENT, syncAllData);
      window.removeEventListener(STORAGE_EVENT_NAME, syncAllData);
      window.removeEventListener(WALLET_EVENT_NAME, syncAllData);
      window.removeEventListener('storage', syncAllData);
    };
  }, []);

  // Xử lý hủy đặt chỗ từ quầy máy chủ
  const handleCancelBooking = (seatId: string) => {
    cancelBooking(seatId);
    setNotificationMsg(`Đã hủy đặt trước cho máy/bàn ${seatId}!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Xử lý duyệt yêu cầu hỗ trợ của nhân viên
  const handleResolveStaffRequest = (id: string) => {
    resolveStaffRequest(id);
    setNotificationMsg('Đã hoàn thành hỗ trợ khách hàng!');
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // NÚT RESET TOÀN BỘ VỀ 0 (Theo đúng yêu cầu của người dùng)
  const handleResetAllToZero = () => {
    if (confirm('Bạn có chắc muốn đưa toàn bộ hệ thống về số 0 (0 đơn đặt máy, 0 đơn bếp, 0 yêu cầu, doanh thu 0đ) để bắt đầu chu trình trải nghiệm từ đầu không?')) {
      clearAllBookings();
      clearAllStaffRequests();
      resetOrdersToDefault();
      resetWalletToDefault();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cyber_base_revenue');
      }
      syncAllData();
      setNotificationMsg('✅ Đã RESET toàn bộ hệ thống về 0! Bây giờ bạn có thể thử đặt máy, gọi món và nạp thẻ từng bước.');
      setTimeout(() => setNotificationMsg(null), 6000);
    }
  };

  // Lọc danh sách máy theo tầng
  const filteredSeats = ALL_SEATS_CONFIG.filter((seat) => {
    if (activeFloor === 'ALL') return true;
    return seat.floor === activeFloor;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black pb-20">
      
      {/* ══════════ 1. HEADER HUD MÁY CHỦ QUẢN LÝ TRUNG TÂM ══════════ */}
      <div className="bg-gradient-to-r from-slate-950 via-[#07132a] to-slate-950 border-b border-cyan-500/30 p-4 shadow-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-cyan-500/30">
              <span className="material-symbols-outlined text-[28px]">dns</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-gaming font-black text-xl sm:text-2xl text-white tracking-wide">
                  MÁY CHỦ TRUNG TÂM • QUẦY LỄ TÂN SERVER
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold">
                  MASTER NODE ONLINE
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Điều phối toàn bộ sơ đồ 40 máy/bàn • Nhận tin nhắn đặt chỗ realtime • Xử lý gọi phục vụ
              </span>
            </div>
          </div>

          {/* Cụm nút Reset và Thống kê nhanh */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetAllToZero}
              className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/50 font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
              title="Xóa toàn bộ dữ liệu demo về trạng thái trống ban đầu"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>RESET HỆ THỐNG VỀ 0</span>
            </button>
            
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-white font-mono text-xs font-bold transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-cyan-400">monitoring</span>
              <span>Doanh Thu: {revenue.toLocaleString('vi-VN')}đ</span>
            </Link>
          </div>

        </div>
      </div>

      {/* THÔNG BÁO NOTIFICATION TOÀN HỆ THỐNG */}
      {notificationMsg && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-xs flex items-center justify-between shadow-xl animate-pulse">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-[18px]">info</span>
              {notificationMsg}
            </span>
            <span className="text-[10px] text-slate-400">Server Đồng Bộ Tức Thì</span>
          </div>
        </div>
      )}

      {/* ══════════ 2. BỐ CỤC 2 CỘT: SƠ ĐỒ PHÒNG MÁY (TRÁI) & TIN NHẮN ĐẶT CHỖ (PHẢI) ══════════ */}
      <div className="max-w-7xl mx-auto px-4 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CỘT TRÁI (8 CỘT): TỔNG HỢP SƠ ĐỒ MÁY TRẠM & BÀN BIDA */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-[#070e22]/90 border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            
            {/* Header thanh lọc phân khu */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                  SƠ ĐỒ TỔNG THỂ TẤT CẢ PHÂN KHU
                </span>
                <h2 className="text-xl font-black text-white font-gaming mt-0.5">
                  Quản Lý Trạng Thái Máy &amp; Bàn Bi-a Realtime
                </h2>
              </div>

              {/* Tabs chọn tầng */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                <button
                  onClick={() => setActiveFloor('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    activeFloor === 'ALL'
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tất Cả ({ALL_SEATS_CONFIG.length})
                </button>
                <button
                  onClick={() => setActiveFloor(1)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    activeFloor === 1
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tầng 1 (Arena &amp; Bida)
                </button>
                <button
                  onClick={() => setActiveFloor(2)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    activeFloor === 2
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tầng 2 (VIP &amp; Pro 540Hz)
                </button>
              </div>
            </div>

            {/* Chú thích màu sắc trạng thái */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 bg-black/40 p-3 rounded-2xl border border-white/5">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Trống (Sẵn sàng)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Đã Đặt Trước Online
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Máy VIP-08 Bạn Đang Ngồi
              </span>
            </div>

            {/* LƯỚI DANH SÁCH TẤT CẢ CÁC MÁY */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredSeats.map((seat) => {
                const booking = bookings.find((b) => b.seatId === seat.id);
                const isBooked = !!booking;
                const isCurrent = seat.id === 'VIP-08';

                let cardStyle = 'border-white/10 bg-slate-900/80 hover:border-emerald-400 text-slate-300';
                let statusBadge = (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[9px] font-bold">
                    TRỐNG
                  </span>
                );

                if (isCurrent) {
                  cardStyle = 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]';
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono text-[9px] font-black">
                      MÁY BẠN (ONLINE)
                    </span>
                  );
                } else if (isBooked) {
                  cardStyle = 'border-amber-500 bg-amber-950/40 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono text-[9px] font-black animate-pulse">
                      ĐÃ ĐẶT TRƯỚC
                    </span>
                  );
                }

                return (
                  <div
                    key={seat.id}
                    onClick={() => setSelectedSeat(seat)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative group hover:-translate-y-0.5 ${cardStyle}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-gaming font-black text-sm tracking-wide text-white">
                        {seat.id}
                      </span>
                      {statusBadge}
                    </div>

                    <div className="font-mono text-[10px] space-y-0.5">
                      <div className="text-slate-400 truncate">{seat.zoneName}</div>
                      <div className="text-emerald-400 font-bold">{seat.price}</div>
                    </div>

                    {/* Nếu đã được đặt trước thì hiện tên khách */}
                    {isBooked && (
                      <div className="pt-2 border-t border-amber-500/30 text-[10px] font-mono text-amber-300">
                        <div className="font-bold truncate">👤 {booking.customerName}</div>
                        <div className="text-[9px] text-slate-400">📞 {booking.phone}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* CHI TIẾT MÁY ĐƯỢC CHỌN (MODAL/DRAWER NHANH) */}
          {selectedSeat && (
            <div className="bg-[#070e22] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl font-mono text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-gaming font-black text-lg text-white">
                    CHI TIẾT: {selectedSeat.id} ({selectedSeat.zoneName})
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSeat(null)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400"
                >
                  ✕ Đóng
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">VI XỬ LÝ (CPU)</span>
                  <span className="text-white font-bold block mt-1">{selectedSeat.cpu}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">CARD ĐỒ HỌA (VGA)</span>
                  <span className="text-cyan-400 font-bold block mt-1">{selectedSeat.gpu}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">MÀN HÌNH</span>
                  <span className="text-white font-bold block mt-1">{selectedSeat.screen}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">GIÁ TIỀN</span>
                  <span className="text-emerald-400 font-bold block mt-1">{selectedSeat.price}</span>
                </div>
              </div>

              {/* Nếu máy này đang có đơn đặt trước */}
              {(() => {
                const booking = bookings.find((b) => b.seatId === selectedSeat.id);
                if (!booking) {
                  return (
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-slate-400">Máy đang ở trạng thái Trống, sẵn sàng phục vụ.</span>
                      <Link
                        href="/booking"
                        className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl"
                      >
                        ĐẶT MÁY NÀY &rarr;
                      </Link>
                    </div>
                  );
                }

                return (
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="text-amber-300 font-bold">Khách đặt: {booking.customerName} ({booking.phone})</div>
                      <div className="text-slate-400 text-[11px]">Khung giờ: {booking.timeSlot} • Mã vé: {booking.bookingCode}</div>
                    </div>
                    <button
                      onClick={() => handleCancelBooking(selectedSeat.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition"
                    >
                      HỦY GIỮ CHỖ NÀY
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

        </div>

        {/* CỘT PHẢI (4 CỘT): TRUNG TÂM TIN NHẮN & YÊU CẦU REALTIME */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* KHỐI 1: DANH SÁCH TIN NHẮN ĐẶT MÁY ONLINE TỪ KHÁCH HÀNG */}
          <div className="bg-[#070e22]/90 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[20px]">mark_email_unread</span>
                <h3 className="font-gaming font-black text-white text-base">TIN NHẮN ĐẶT BÀN MỚI</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono text-[10px] font-black">
                {bookings.length} ĐƠN
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-8 text-slate-500 font-mono text-xs space-y-2">
                <span className="material-symbols-outlined text-[36px] text-slate-600 block">inbox</span>
                <span>Chưa có khách đặt máy nào.</span>
                <span className="block text-[10px] text-slate-600">Khi khách đặt bàn tại Trang Chủ hoặc Sơ Đồ Máy, thông tin sẽ bay về đây ngay lập tức!</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 font-mono text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-white text-sm">
                        {b.customerName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black">
                        {b.seatId}
                      </span>
                    </div>

                    <div className="text-slate-300 text-[11px] space-y-0.5">
                      <div>📞 SĐT: <strong className="text-white">{b.phone}</strong></div>
                      <div>🕒 Giờ: <strong className="text-amber-400">{b.timeSlot}</strong></div>
                      <div>🎫 Mã vé: <strong className="text-cyan-400">{b.bookingCode}</strong></div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">
                        {new Date(b.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => handleCancelBooking(b.seatId)}
                        className="text-[11px] text-red-400 hover:text-red-300 font-bold transition"
                      >
                        Hủy đặt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* KHỐI 2: DANH SÁCH YÊU CẦU GỌI NHÂN VIÊN TẬN MÁY */}
          <div className="bg-[#070e22]/90 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-400 text-[20px]">notifications_active</span>
                <h3 className="font-gaming font-black text-white text-base">KHÁCH GỌI NHÂN VIÊN</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-black">
                {staffRequests.filter((r) => r.status === 'PENDING').length} CHỜ
              </span>
            </div>

            {staffRequests.filter((r) => r.status === 'PENDING').length === 0 ? (
              <div className="text-center py-6 text-slate-500 font-mono text-xs space-y-2">
                <span className="material-symbols-outlined text-[32px] text-slate-600 block">check_circle</span>
                <span>Không có yêu cầu phục vụ nào đang chờ.</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {staffRequests
                  .filter((r) => r.status === 'PENDING')
                  .map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-2 font-mono text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-rose-300 font-gaming text-sm">
                          MÁY: {r.pcName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(r.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-white text-xs">{r.title}</p>
                      <button
                        onClick={() => handleResolveStaffRequest(r.id)}
                        className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition shadow"
                      >
                        ĐÃ XỬ LÝ XONG &rarr;
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
