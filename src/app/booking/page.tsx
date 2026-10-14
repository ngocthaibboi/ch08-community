'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function BookingSeatMap() {
  const [selectedSeat, setSelectedSeat] = useState<string>('VIP-08');
  const [activeFloor, setActiveFloor] = useState<'floor1' | 'floor2'>('floor2');

  const floor2Seats = [
    { id: 'VIP-01', type: 'VIP', status: 'OCCUPIED', price: '20.000đ/h', user: 'NguyenH***' },
    { id: 'VIP-02', type: 'VIP', status: 'AVAILABLE', price: '20.000đ/h' },
    { id: 'VIP-03', type: 'VIP', status: 'OCCUPIED', price: '20.000đ/h', user: 'TranB***' },
    { id: 'VIP-04', type: 'VIP', status: 'MAINTENANCE', price: '20.000đ/h' },
    { id: 'VIP-05', type: 'VIP', status: 'OCCUPIED', price: '20.000đ/h', user: 'HoangG***' },
    { id: 'VIP-06', type: 'VIP', status: 'AVAILABLE', price: '20.000đ/h' },
    { id: 'VIP-07', type: 'VIP', status: 'AVAILABLE', price: '20.000đ/h' },
    { id: 'VIP-08', type: 'VIP', status: 'CURRENT', price: '20.000đ/h', user: 'ProGamer_VN (Máy hiện tại của bạn)' },
    { id: 'VIP-09', type: 'VIP', status: 'AVAILABLE', price: '20.000đ/h' },
    { id: 'VIP-10', type: 'VIP', status: 'OCCUPIED', price: '20.000đ/h', user: 'LeVan***' },
    { id: 'STREAM-01', type: 'STREAM', status: 'OCCUPIED', price: '35.000đ/h', user: 'MixiG***' },
    { id: 'STREAM-02', type: 'STREAM', status: 'AVAILABLE', price: '35.000đ/h' },
  ];

  const floor1Seats = [
    { id: 'REG-01', type: 'REG', status: 'OCCUPIED', price: '12.000đ/h' },
    { id: 'REG-02', type: 'REG', status: 'AVAILABLE', price: '12.000đ/h' },
    { id: 'REG-03', type: 'REG', status: 'OCCUPIED', price: '12.000đ/h' },
    { id: 'REG-04', type: 'REG', status: 'AVAILABLE', price: '12.000đ/h' },
    { id: 'REG-24', type: 'REG', status: 'OCCUPIED', price: '12.000đ/h', user: 'Gamer_Reg24 (Đang chờ đơn #1043)' },
    { id: 'ARENA-01', type: 'ARENA', status: 'OCCUPIED', price: '25.000đ/h' },
    { id: 'ARENA-02', type: 'ARENA', status: 'OCCUPIED', price: '25.000đ/h' },
    { id: 'ARENA-03', type: 'ARENA', status: 'OCCUPIED', price: '25.000đ/h', user: 'Pro_Arena (Đơn #1040 Sẵn sàng)' },
  ];

  const currentSeats = activeFloor === 'floor2' ? floor2Seats : floor1Seats;
  const currentSeatObj = currentSeats.find((s) => s.id === selectedSeat) || currentSeats[0];

  return (
    <div className="min-h-screen bg-[#070e1d] text-slate-100 p-4 lg:p-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0c1322] border border-cyan-500/20 p-4 rounded-xl mb-6 shadow-xl gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-gaming font-black text-xl text-cyan-400 tracking-wider">
              SƠ ĐỒ MÁY TRẠM &amp; ĐẶT CHỖ GAMING
            </span>
            <span className="bg-purple-500/20 text-purple-400 border border-purple-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
              ZONE MATRIX
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chọn máy thực tế theo cấu hình phòng game: Zone VIP (Màn 240Hz), Sân khấu Arena (360Hz) và Phòng Stream cá nhân.
          </p>
        </div>

        {/* Floor Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-[#141b2b] border border-slate-700 p-1 rounded-lg flex text-xs font-mono">
            <button
              onClick={() => setActiveFloor('floor1')}
              className={`px-3 py-1.5 rounded-md font-bold transition ${
                activeFloor === 'floor1' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tầng 1 (Regular &amp; Arena)
            </button>
            <button
              onClick={() => setActiveFloor('floor2')}
              className={`px-3 py-1.5 rounded-md font-bold transition ${
                activeFloor === 'floor2' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tầng 2 (VIP &amp; Stream Room)
            </button>
          </div>

          <Link
            href="/menu"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-1 transition shadow-[0_0_12px_rgba(0,240,255,0.3)]"
          >
            <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
            <span>Gọi Món Tại Máy Này</span>
          </Link>
        </div>
      </div>

      {/* Main Seat Map Grid & Station Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Seat Grid (8 cols) */}
        <div className="lg:col-span-8 bg-[#0c1322] border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-white">
                {activeFloor === 'floor2' ? 'SƠ ĐỒ PHÒNG VIP TẦNG 2' : 'SƠ ĐỒ TẦNG 1 (ARENA & REGULAR)'}
              </span>
              <span className="text-xs text-slate-500 font-mono">Đang phục vụ: 82/100 máy</span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Trống
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded bg-slate-700"></span> Đang chơi
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded bg-cyan-400"></span> Máy của bạn
              </span>
            </div>
          </div>

          {/* Seats Box Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-2">
            {currentSeats.map((seat) => {
              const isSelected = selectedSeat === seat.id;
              const isCurrent = seat.status === 'CURRENT';
              const isAvailable = seat.status === 'AVAILABLE';
              const isOccupied = seat.status === 'OCCUPIED';

              return (
                <div
                  key={seat.id}
                  onClick={() => setSelectedSeat(seat.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : isSelected
                      ? 'border-purple-400 bg-purple-950/30'
                      : isAvailable
                      ? 'bg-[#141b2b] border-emerald-500/40 hover:border-emerald-400'
                      : isOccupied
                      ? 'bg-[#0f1420] border-slate-800 opacity-60'
                      : 'bg-[#1a1215] border-rose-900/60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-gaming font-black text-base text-white">{seat.id}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase font-bold ${
                        isCurrent
                          ? 'bg-cyan-400 text-black'
                          : isAvailable
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {seat.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">{seat.price}</div>
                  {seat.user && (
                    <div className="text-[10px] text-cyan-300 truncate mt-1">{seat.user}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Station Specs (4 cols) */}
        <div className="lg:col-span-4 bg-[#0c1322] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-800 mb-4 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 font-mono">THÔNG SỐ MÁY</span>
                <h3 className="font-gaming font-black text-2xl text-cyan-400">{currentSeatObj.id}</h3>
              </div>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-2.5 py-1 rounded font-mono font-bold">
                {currentSeatObj.type} ZONE
              </span>
            </div>

            {/* Hardware Telemetry */}
            <div className="space-y-2.5 text-xs">
              <div className="bg-[#141b2b] p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Bộ vi xử lý (CPU):</span>
                <span className="font-bold text-white font-mono">Intel Core i7-14700F</span>
              </div>
              <div className="bg-[#141b2b] p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Card đồ họa (GPU):</span>
                <span className="font-bold text-emerald-400 font-mono">RTX 4070 Ti Super 16GB</span>
              </div>
              <div className="bg-[#141b2b] p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Màn hình Gaming:</span>
                <span className="font-bold text-cyan-400 font-mono">ASUS ROG 27" 240Hz Fast-IPS</span>
              </div>
              <div className="bg-[#141b2b] p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Gaming Gear:</span>
                <span className="font-bold text-slate-200">Logitech G Pro X Superlight + Phím Cơ</span>
              </div>
              <div className="bg-[#141b2b] p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Ghế ngồi:</span>
                <span className="font-bold text-slate-200">Noblechairs HERO Real Leather</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
            <Link
              href="/menu"
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-black py-3 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition"
            >
              <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              <span>ĐẶT MÓN CHO MÁY {currentSeatObj.id}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
