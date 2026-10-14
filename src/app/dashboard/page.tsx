'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DashboardFnb() {
  const [dateFilter, setDateFilter] = useState('today');

  // Realistic statistics for Cyber Lounge F&B Operations
  const stats = [
    {
      title: 'Doanh Thu F&B Hôm Nay',
      value: '3.850.000đ',
      change: '+18.4%',
      isPositive: true,
      sub: 'So với cùng kỳ hôm qua (3.250.000đ)',
      icon: 'payments',
      color: 'cyan',
    },
    {
      title: 'Tổng Số Đơn Bếp',
      value: '58 đơn',
      change: '+12 đơn',
      isPositive: true,
      sub: 'Đang chế biến: 3 • Hoàn tất: 55',
      icon: 'receipt_long',
      color: 'amber',
    },
    {
      title: 'Thời Gian Nấu TB / Đơn',
      value: '6.2 phút',
      change: '-0.8 phút',
      isPositive: true,
      sub: 'Chuẩn cam kết quán: < 8 phút',
      icon: 'timer',
      color: 'emerald',
    },
    {
      title: 'Yêu Cầu Gọi Nhân Viên',
      value: '14 lượt',
      change: '100% đã hỗ trợ',
      isPositive: true,
      sub: 'Thời gian phản hồi TB: 45 giây',
      icon: 'support_agent',
      color: 'rose',
    },
  ];

  // Best sellers
  const bestSellers = [
    { rank: 1, name: 'Mì Trộn Indomie Double Trứng', count: 28, revenue: '1.064.000đ', rate: '85%' },
    { rank: 2, name: 'Cơm Bò Lúc Lắc Phô Mai', count: 19, revenue: '1.045.000đ', rate: '72%' },
    { rank: 3, name: 'Combo Thức Đêm Chiến Game', count: 14, revenue: '966.000đ', rate: '64%' },
    { rank: 4, name: 'Monster Energy Trắng Lạnh', count: 24, revenue: '840.000đ', rate: '60%' },
    { rank: 5, name: 'Bánh Mì Chảo Đặc Biệt Cyber', count: 12, revenue: '540.000đ', rate: '45%' },
    { rank: 6, name: 'Khoai Tây Lắc Trứng Muối', count: 12, revenue: '360.000đ', rate: '40%' },
  ];

  // Live support calls
  const [supportCalls, setSupportCalls] = useState([
    {
      id: 'call-1',
      pc: 'VIP-08',
      zone: 'Zone VIP A • Tầng 2',
      content: 'Khách gọi nhân viên lấy thêm ly đá & kiểm tra mic tai nghe',
      time: '1 phút trước',
      status: 'RECEIVING',
      statusText: 'Đang tiếp nhận',
    },
    {
      id: 'call-2',
      pc: 'REG-14',
      zone: 'Zone Regular • Tầng 1',
      content: 'Yêu cầu nạp tiền mặt 100.000đ tại máy',
      time: '4 phút trước',
      status: 'HANDLED',
      statusText: 'Đã hoàn tất',
    },
    {
      id: 'call-3',
      pc: 'ARENA-02',
      zone: 'Sân Khấu Arena Thi Đấu',
      content: 'Hỗ trợ đổi bàn phím cơ sang Switch Linear',
      time: '9 phút trước',
      status: 'HANDLED',
      statusText: 'Đã hoàn tất',
    },
  ]);

  const handleResolveCall = (id: string) => {
    setSupportCalls((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'HANDLED', statusText: 'Đã hoàn tất' } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#070e1d] text-slate-100 p-4 lg:p-6 font-sans">
      {/* Top Header Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0c1322] border border-cyan-500/20 p-4 rounded-xl mb-6 shadow-xl gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-gaming font-black text-xl text-cyan-400 tracking-wider">
              BẢNG ĐIỀU HÀNH &amp; DOANH THU F&amp;B
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi doanh số quầy pha chế, thời gian ra món của trạm bếp và nhật ký gọi phục vụ tại các máy.
          </p>
        </div>

        {/* Quick Date Filters & Navigation */}
        <div className="flex items-center gap-2">
          <div className="bg-[#141b2b] border border-slate-700 p-1 rounded-lg flex text-xs font-mono">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-md font-bold transition ${
                dateFilter === 'today' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hôm Nay
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1.5 rounded-md font-bold transition ${
                dateFilter === 'week' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Ngày
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1.5 rounded-md font-bold transition ${
                dateFilter === 'month' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tháng Này
            </button>
          </div>

          <Link
            href="/kds"
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-1 transition shadow-[0_0_12px_rgba(255,183,3,0.3)]"
          >
            <span className="material-symbols-outlined text-[16px]">soup_kitchen</span>
            <span>Mở KDS Bếp</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-[#0c1322] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-slate-400 font-semibold">{s.title}</span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  s.color === 'cyan'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : s.color === 'amber'
                    ? 'bg-amber-500/20 text-amber-400'
                    : s.color === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-white font-gaming tracking-wide">{s.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-emerald-400 font-mono">{s.change}</span>
                <span className="text-[11px] text-slate-500 truncate">{s.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Best Sellers & Support Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top Best Selling Items (7 cols) */}
        <div className="lg:col-span-7 bg-[#0c1322] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400 text-xl">star</span>
                <h3 className="font-bold text-base text-white">Top Món Ăn &amp; Thức Uống Bán Chạy Nhất</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Dựa trên 58 đơn</span>
            </div>

            <div className="space-y-3">
              {bestSellers.map((item) => (
                <div
                  key={item.rank}
                  className="bg-[#141b2b] p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center font-mono font-black text-xs ${
                        item.rank === 1
                          ? 'bg-amber-400 text-black'
                          : item.rank === 2
                          ? 'bg-slate-300 text-black'
                          : item.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      #{item.rank}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-slate-200">{item.name}</div>
                      <div className="text-[11px] text-slate-400">Đã bán: <strong className="text-cyan-400">{item.count} suất</strong></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-emerald-400">{item.revenue}</span>
                    <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1 ml-auto">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: item.rate }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Khu vực bán nhiều nhất: <strong className="text-slate-200">Zone VIP A (Tầng 2)</strong></span>
            <Link href="/menu" className="text-cyan-400 hover:underline font-bold">
              Xem chi tiết menu khách &rarr;
            </Link>
          </div>
        </div>

        {/* Right: Live Support / Call Staff Feed (5 cols) */}
        <div className="lg:col-span-5 bg-[#0c1322] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500 text-xl animate-pulse">
                  notifications_active
                </span>
                <h3 className="font-bold text-base text-white">Yêu Cầu Gọi Nhân Viên Tại Máy</h3>
              </div>
              <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded font-mono font-bold">
                REALTIME
              </span>
            </div>

            <div className="space-y-3">
              {supportCalls.map((call) => {
                const isReceiving = call.status === 'RECEIVING';

                return (
                  <div
                    key={call.id}
                    className={`p-3.5 rounded-lg border transition-all ${
                      isReceiving
                        ? 'bg-[#1a1525] border-rose-500/60 shadow-[0_0_12px_rgba(255,42,85,0.2)]'
                        : 'bg-[#141b2b] border-slate-800 opacity-70'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-cyan-400 text-base">{call.pc}</span>
                        <span className="text-xs text-slate-400">{call.zone}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{call.time}</span>
                    </div>

                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">{call.content}</p>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                      <span
                        className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                          isReceiving ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {call.statusText}
                      </span>

                      {isReceiving && (
                        <button
                          onClick={() => handleResolveCall(call.id)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-3 py-1 rounded transition font-mono"
                        >
                          Xác Nhận Đã Xử Lý
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-[#070e1d] border border-cyan-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-400">Tình trạng nhân viên trực tầng:</span>
            <span className="text-emerald-400 font-mono font-bold">TẦNG 1: 2 người • TẦNG 2: 2 người</span>
          </div>
        </div>
      </div>
    </div>
  );
}
