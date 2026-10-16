'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getStoredBookings,
  saveBooking,
  cancelBooking,
  SeatBooking,
  BOOKING_STORAGE_EVENT,
} from '@/lib/bookingStore';

interface BaseSeat {
  id: string;
  type: string;
  defaultStatus: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CURRENT';
  price: string;
  cpu: string;
  gpu: string;
  screen: string;
  gear: string;
  chair: string;
  zoneName: string;
}

const FLOOR2_SEATS_CONFIG: BaseSeat[] = [
  {
    id: 'VIP-01',
    type: 'VIP',
    defaultStatus: 'OCCUPIED',
    price: '22.000đ/h',
    cpu: 'Intel Core i9 14900K',
    gpu: 'RTX 4090 24GB Ultra',
    screen: 'ROG Swift OLED 540Hz 0.03ms',
    gear: 'Wooting 60HE + Pulsar X2V2 Wireless',
    chair: 'Herman Miller Embody Gaming',
    zoneName: 'Ultra VIP Suite',
  },
  {
    id: 'VIP-02',
    type: 'VIP',
    defaultStatus: 'AVAILABLE',
    price: '22.000đ/h',
    cpu: 'Intel Core i7 14700K',
    gpu: 'RTX 4090 24GB Ultra',
    screen: 'ROG Swift OLED 540Hz 0.03ms',
    gear: 'Razer Huntsman V3 Pro + DeathAdder V3 Pro',
    chair: 'Herman Miller Embody Gaming',
    zoneName: 'Ultra VIP Suite',
  },
  {
    id: 'VIP-03',
    type: 'VIP',
    defaultStatus: 'OCCUPIED',
    price: '22.000đ/h',
    cpu: 'Intel Core i7 14700K',
    gpu: 'RTX 4080 Super 16GB',
    screen: 'BenQ ZOWIE XL2566K 360Hz DyAc+',
    gear: 'Zowie EC2-CW + Phím cơ HE Rapid Trigger',
    chair: 'Noblechairs HERO Real Leather',
    zoneName: 'Ultra VIP Suite',
  },
  {
    id: 'VIP-04',
    type: 'VIP',
    defaultStatus: 'MAINTENANCE',
    price: '22.000đ/h',
    cpu: 'Intel Core i7 14700K',
    gpu: 'RTX 4080 Super 16GB',
    screen: 'BenQ ZOWIE XL2566K 360Hz',
    gear: 'Đang vệ sinh mod phím & thay keo PTM7950',
    chair: 'Noblechairs HERO',
    zoneName: 'Ultra VIP Suite',
  },
  {
    id: 'VIP-05',
    type: 'VIP',
    defaultStatus: 'OCCUPIED',
    price: '22.000đ/h',
    cpu: 'Intel Core i7 14700K',
    gpu: 'RTX 4080 Super 16GB',
    screen: 'ASUS ROG 27" 240Hz Fast-IPS',
    gear: 'Logitech G Pro X Superlight + Phím Cơ',
    chair: 'Noblechairs HERO',
    zoneName: 'Ultra VIP Suite',
  },
  {
    id: 'VIP-06',
    type: 'VIP',
    defaultStatus: 'AVAILABLE',
    price: '22.000đ/h',
    cpu: 'Intel Core i7 14700K',
    gpu: 'RTX 4070 Ti Super 16GB',
    screen: 'ASUS ROG 27" 240Hz Fast-IPS',
    gear: 'Logitech G Pro X Superlight + Phím Cơ',
    chair: 'Noblechairs HERO',
    zoneName: 'Ultra VIP Suite',
  },
  {
    id: 'VIP-07',
    type: 'VIP',
    defaultStatus: 'AVAILABLE',
    price: '22.000đ/h',
    cpu: 'Intel Core i7 14700K',
    gpu: 'RTX 4070 Ti Super 16GB',
    screen: 'ASUS ROG 27" 240Hz Fast-IPS',
    gear: 'Logitech G Pro X Superlight + Phím Cơ',
    chair: 'Noblechairs HERO',
    zoneName: 'Ultra VIP Suite',
  },
  {
    id: 'VIP-08',
    type: 'VIP',
    defaultStatus: 'CURRENT',
    price: '22.000đ/h',
    cpu: 'Intel Core i7 14700K (14th Gen)',
    gpu: 'NVIDIA RTX 4070 Ti Super 16GB GDDR6X',
    screen: 'ASUS ROG 27" 240Hz 0.5ms Fast IPS G-Sync',
    gear: 'Zowie EC2-CW Wireless + Phím Akko Cream Yellow HE',
    chair: 'Noblechairs HERO Nappa Leather',
    zoneName: 'Khu Thi Đấu VIP (Máy của bạn)',
  },
  {
    id: 'VIP-09',
    type: 'VIP',
    defaultStatus: 'AVAILABLE',
    price: '22.000đ/h',
    cpu: 'Intel Core i7 14700K',
    gpu: 'RTX 4070 Ti Super 16GB',
    screen: 'ASUS ROG 27" 240Hz Fast-IPS',
    gear: 'Logitech G Pro X Superlight + Phím Cơ',
    chair: 'Noblechairs HERO',
    zoneName: 'Ultra VIP Suite',
  },
  {
    id: 'VIP-10',
    type: 'VIP',
    defaultStatus: 'OCCUPIED',
    price: '22.000đ/h',
    cpu: 'Intel Core i7 14700K',
    gpu: 'RTX 4070 Ti Super 16GB',
    screen: 'ASUS ROG 27" 240Hz Fast-IPS',
    gear: 'Logitech G Pro X Superlight + Phím Cơ',
    chair: 'Noblechairs HERO',
    zoneName: 'Ultra VIP Suite',
  },
  {
    id: 'STREAM-01',
    type: 'STREAM',
    defaultStatus: 'OCCUPIED',
    price: '35.000đ/h',
    cpu: 'Intel Core i9 14900KS Dual-PC Streaming',
    gpu: 'Dual RTX 4090 24GB + Elgato 4K60 Pro',
    screen: '2x ROG OLED 240Hz + Màn phụ chat',
    gear: 'Shure SM7B + GoXLR + Cam Sony A6400',
    chair: 'Sofa Streamer cách âm 45dB',
    zoneName: 'Phòng Stream Studio Riêng Tư',
  },
  {
    id: 'STREAM-02',
    type: 'STREAM',
    defaultStatus: 'AVAILABLE',
    price: '35.000đ/h',
    cpu: 'Intel Core i9 14900K Dual-PC',
    gpu: 'RTX 4090 24GB + Elgato Cam Link',
    screen: '2x ROG Fast-IPS 280Hz',
    gear: 'Mic Røde NT-USB + Phím HE Rapid Trigger',
    chair: 'Sofa Streamer cách âm 45dB',
    zoneName: 'Phòng Stream Studio Riêng Tư',
  },
  {
    id: 'CONSOLE-01',
    type: 'CONSOLE',
    defaultStatus: 'AVAILABLE',
    price: '79.000đ/h',
    cpu: 'PlayStation 5 Pro + Nintendo Switch OLED',
    gpu: 'RDNA 3 Customized 4K 120FPS HDR',
    screen: 'TV LG OLED 65" 120Hz Dolby Vision',
    gear: '4x DualSense Wireless Controller + Game Pass',
    chair: 'Sofa đệm lười Da Nappa 4 chỗ',
    zoneName: 'Console Lounge & PS5 Pro',
  },
  {
    id: 'COUPLE-01',
    type: 'COUPLE',
    defaultStatus: 'AVAILABLE',
    price: '45.000đ/h',
    cpu: '2x Intel Core i7 13700K',
    gpu: '2x RTX 4070 12GB',
    screen: '2x Màn cong Samsung Odyssey 27" 240Hz',
    gear: 'Bộ gear đôi hồng - đen Akko Matcha',
    chair: 'Ghế Sofa đôi ngả 180° cửa cách âm',
    zoneName: 'Couple Suite (Phòng Đôi)',
  },
];

const FLOOR1_SEATS_CONFIG: BaseSeat[] = [
  {
    id: 'ARENA-01',
    type: 'ARENA',
    defaultStatus: 'OCCUPIED',
    price: '25.000đ/h',
    cpu: 'Intel Core i9 14900K',
    gpu: 'RTX 4090 24GB',
    screen: 'ROG Swift OLED 540Hz',
    gear: 'Chuột không dây 8000Hz + Phím Hall Effect',
    chair: 'Ghế thi đấu IESF Quốc Tế',
    zoneName: 'Đấu Trường Arena 120 Chỗ',
  },
  {
    id: 'ARENA-02',
    type: 'ARENA',
    defaultStatus: 'AVAILABLE',
    price: '25.000đ/h',
    cpu: 'Intel Core i9 14900K',
    gpu: 'RTX 4090 24GB',
    screen: 'ROG Swift OLED 540Hz',
    gear: 'Chuột không dây 8000Hz + Lót chuột Artisan',
    chair: 'Ghế thi đấu IESF Quốc Tế',
    zoneName: 'Đấu Trường Arena 120 Chỗ',
  },
  {
    id: 'ARENA-03',
    type: 'ARENA',
    defaultStatus: 'OCCUPIED',
    price: '25.000đ/h',
    cpu: 'Intel Core i9 14900K',
    gpu: 'RTX 4080 Super',
    screen: 'ROG Swift OLED 540Hz',
    gear: 'Zowie EC2-CW + Phím Akko HE',
    chair: 'Ghế thi đấu IESF Quốc Tế',
    zoneName: 'Đấu Trường Arena 120 Chỗ',
  },
  {
    id: 'REG-01',
    type: 'REG',
    defaultStatus: 'OCCUPIED',
    price: '12.000đ/h',
    cpu: 'Intel Core i5 13400F',
    gpu: 'RTX 4060 Ti 8GB',
    screen: 'Màn hình Fast-IPS 280Hz',
    gear: 'Logitech G102 + Phím cơ DareU',
    chair: 'Ghế da đúc công thái học',
    zoneName: 'Khu Tiêu Chuẩn Tầng 1',
  },
  {
    id: 'REG-02',
    type: 'REG',
    defaultStatus: 'AVAILABLE',
    price: '12.000đ/h',
    cpu: 'Intel Core i5 13400F',
    gpu: 'RTX 4060 Ti 8GB',
    screen: 'Màn hình Fast-IPS 280Hz',
    gear: 'Logitech G102 + Phím cơ DareU',
    chair: 'Ghế da đúc công thái học',
    zoneName: 'Khu Tiêu Chuẩn Tầng 1',
  },
  {
    id: 'REG-03',
    type: 'REG',
    defaultStatus: 'OCCUPIED',
    price: '12.000đ/h',
    cpu: 'Intel Core i5 13400F',
    gpu: 'RTX 4060 Ti 8GB',
    screen: 'Màn hình Fast-IPS 280Hz',
    gear: 'Logitech G102 + Phím cơ DareU',
    chair: 'Ghế da đúc công thái học',
    zoneName: 'Khu Tiêu Chuẩn Tầng 1',
  },
  {
    id: 'REG-04',
    type: 'REG',
    defaultStatus: 'AVAILABLE',
    price: '12.000đ/h',
    cpu: 'Intel Core i5 13400F',
    gpu: 'RTX 4060 Ti 8GB',
    screen: 'Màn hình Fast-IPS 280Hz',
    gear: 'Logitech G102 + Phím cơ DareU',
    chair: 'Ghế da đúc công thái học',
    zoneName: 'Khu Tiêu Chuẩn Tầng 1',
  },
  {
    id: 'REG-24',
    type: 'REG',
    defaultStatus: 'OCCUPIED',
    price: '12.000đ/h',
    cpu: 'Intel Core i5 13400F',
    gpu: 'RTX 4060 Ti 8GB',
    screen: 'Màn hình Fast-IPS 280Hz',
    gear: 'Logitech G102 + Phím cơ DareU',
    chair: 'Ghế da đúc công thái học',
    zoneName: 'Khu Tiêu Chuẩn Tầng 1',
  },
  {
    id: 'BIDA-01',
    type: 'BILLIARDS',
    defaultStatus: 'AVAILABLE',
    price: '79.000đ/h',
    cpu: 'Bàn Aileex King 9022 Nhập Khẩu',
    gpu: 'Nỉ Simonis 860 Tournament',
    screen: 'Đèn Led Led panel chống chói chuẩn thi đấu',
    gear: 'Bóng Aramith Pro Cup + 4 Cơ Aileex Carbon',
    chair: 'Ghế Bar da lửng ngắm bàn',
    zoneName: 'Billiards Club Tiêu Chuẩn',
  },
  {
    id: 'BIDA-02',
    type: 'BILLIARDS',
    defaultStatus: 'OCCUPIED',
    price: '79.000đ/h',
    cpu: 'Bàn Min Carom 3 Băng',
    gpu: 'Hệ thống sưởi nhiệt mặt đá',
    screen: 'Đèn Led chuyên dụng 5500K',
    gear: 'Bóng Super Aramith + Cơ Hanbat',
    chair: 'Ghế Bar da lửng ngắm bàn',
    zoneName: 'Billiards Club Tiêu Chuẩn',
  },
];

export default function BookingSeatMap() {
  const [selectedSeat, setSelectedSeat] = useState<string>('VIP-08');
  const [activeFloor, setActiveFloor] = useState<'floor1' | 'floor2'>('floor2');
  const [bookings, setBookings] = useState<SeatBooking[]>([]);

  // State modal đặt máy tại chỗ
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTime, setFormTime] = useState('18:00 - 22:00 (Giờ cao điểm)');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync bookings from bookingStore and handle cross-tab/storage changes
  useEffect(() => {
    const update = () => {
      setBookings(getStoredBookings());
    };
    update();

    window.addEventListener(BOOKING_STORAGE_EVENT, update);
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener(BOOKING_STORAGE_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const baseSeats = activeFloor === 'floor2' ? FLOOR2_SEATS_CONFIG : FLOOR1_SEATS_CONFIG;

  // Merge base seat config with live bookings
  const computedSeats = baseSeats.map((seat) => {
    const booking = bookings.find((b) => b.seatId === seat.id && b.status === 'RESERVED');
    if (booking) {
      return {
        ...seat,
        status: 'RESERVED' as const,
        booking,
        user: booking.customerName,
      };
    }
    return {
      ...seat,
      status: seat.defaultStatus,
      booking: undefined,
      user: seat.defaultStatus === 'CURRENT' ? 'Bạn đang ngồi tại đây' : undefined,
    };
  });

  const currentSeatObj = computedSeats.find((s) => s.id === selectedSeat) || computedSeats[0];
  const activeBooking = currentSeatObj.booking;

  const handleOpenBooking = () => {
    setShowBookingModal(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newBooking = saveBooking({
      seatId: currentSeatObj.id,
      customerName: formName.trim(),
      phone: formPhone.trim() || '0988.888.888',
      timeSlot: formTime,
      date: new Date().toISOString().split('T')[0],
      zone: currentSeatObj.zoneName,
      branch: 'Zone 01: 128 Nguyễn Trãi, Q.1, TP.HCM',
      status: 'RESERVED',
      notes: 'Đặt trực tiếp trên sơ đồ máy Cyber Zone',
    });

    setShowBookingModal(false);
    setFormName('');
    setFormPhone('');
    setSuccessToast(`Đã giữ chỗ máy ${newBooking.seatId} cho game thủ ${newBooking.customerName} (${newBooking.bookingCode})!`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const handleCancelBooking = (seatId: string) => {
    if (confirm(`Bạn có chắc muốn hủy đặt chỗ cho máy ${seatId}?`)) {
      cancelBooking(seatId);
      setSuccessToast(`Đã hủy giữ chỗ máy ${seatId}. Chỗ đã trở lại trạng thái sẵn sàng!`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-4 lg:p-6 font-sans">
      {/* Thông báo Realtime Sync Banner */}
      {successToast && (
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-400 text-emerald-300 font-bold text-xs flex items-center justify-between shadow-2xl animate-bounce">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Header đồng bộ với nhận diện CZ của bạn Thái */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#070d1e]/90 border border-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl mb-6 shadow-2xl gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 text-black font-black text-sm flex items-center justify-center shadow-md">
              CZ
            </div>
            <span className="font-gaming font-black text-xl sm:text-2xl text-white tracking-wider">
              SƠ ĐỒ MÁY TRẠM &amp; ĐẶT CHỖ REALTIME
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              ĐỒNG BỘ 24/7 VỚI CỔNG BẠN THÁI
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Hạ tầng liên thông: Khi khách đặt giữ chỗ trên trang của bạn Thái, sơ đồ máy tại đây lập tức cập nhật trạng thái <strong className="text-amber-400">ĐÃ ĐẶT TRƯỚC</strong> kèm tên khách hàng theo thời gian thực.
          </p>
        </div>

        {/* Floor Switcher & Action CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900/90 border border-white/10 p-1 rounded-xl flex text-xs font-mono">
            <button
              onClick={() => setActiveFloor('floor1')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeFloor === 'floor1'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tầng 1 (Arena &amp; Billiards)
            </button>
            <button
              onClick={() => setActiveFloor('floor2')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeFloor === 'floor2'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tầng 2 (Ultra VIP &amp; Stream)
            </button>
          </div>

          <Link
            href="/menu"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition"
          >
            <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
            <span>Gọi Món Tận Bàn</span>
          </Link>
        </div>
      </div>

      {/* Main Seat Map Grid & Station Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Seat Grid (8 cols) */}
        <div className="lg:col-span-8 bg-[#070d1e]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap justify-between items-center pb-4 border-b border-white/10 mb-5 gap-3">
              <div className="flex items-center gap-3">
                <span className="font-gaming font-black text-base text-white tracking-wide">
                  {activeFloor === 'floor2'
                    ? 'PHÂN KHU TẦNG 2: ULTRA VIP • STREAM SUITE • CONSOLE'
                    : 'PHÂN KHU TẦNG 1: ARENA 540Hz • BILLIARDS CLUB • STANDARD'}
                </span>
              </div>

              {/* Legend Chú Thích Trực Quan */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> Máy Trống
                </span>
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block animate-pulse"></span> Đã Đặt Trước
                </span>
                <span className="flex items-center gap-1 text-cyan-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded bg-cyan-400 inline-block"></span> Máy Của Bạn
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded bg-slate-700 inline-block"></span> Đang Chơi
                </span>
              </div>
            </div>

            {/* Grid Các Máy Trạm */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {computedSeats.map((seat) => {
                const isSelected = selectedSeat === seat.id;
                const isCurrent = seat.status === 'CURRENT';
                const isReserved = seat.status === 'RESERVED';
                const isAvailable = seat.status === 'AVAILABLE';
                const isOccupied = seat.status === 'OCCUPIED';

                return (
                  <div
                    key={seat.id}
                    onClick={() => setSelectedSeat(seat.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between select-none relative overflow-hidden ${
                      isReserved
                        ? 'bg-amber-950/40 border-amber-500/80 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/30'
                        : isCurrent
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)] ring-1 ring-cyan-300'
                        : isSelected
                        ? 'border-emerald-400 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : isAvailable
                        ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400 hover:bg-slate-800'
                        : isOccupied
                        ? 'bg-[#0a0f1d] border-white/5 opacity-60'
                        : 'bg-[#150d12] border-rose-900/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-gaming font-black text-base text-white">{seat.id}</span>
                      
                      {isReserved ? (
                        <span className="bg-amber-500 text-black text-[9px] font-mono px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-1 shadow-sm animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-black"></span> ĐÃ ĐẶT
                        </span>
                      ) : isCurrent ? (
                        <span className="bg-cyan-400 text-black text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-black">
                          MÁY BẠN
                        </span>
                      ) : isAvailable ? (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase">
                          TRỐNG
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                          {seat.status}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">{seat.price}</div>

                    {/* Hiển thị rõ tên khách hàng đã đặt trước */}
                    {isReserved && seat.booking && (
                      <div className="mt-2 pt-1.5 border-t border-amber-500/30 font-mono">
                        <div className="text-[10px] text-amber-300 font-bold truncate flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-amber-400">person</span>
                          <span>{seat.booking.customerName}</span>
                        </div>
                        <div className="text-[9px] text-amber-400/80 truncate">
                          🕒 {seat.booking.timeSlot.split(' ')[0]} • {seat.booking.bookingCode}
                        </div>
                      </div>
                    )}

                    {isCurrent && (
                      <div className="text-[10px] text-cyan-300 truncate mt-1.5 font-mono">
                        ● Đang trực tuyến
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap justify-between items-center text-xs text-slate-400 font-mono">
            <span>Server: <strong className="text-emerald-400 font-bold">10Gbps Multi-ISP Trunk (Ping ≤ 1ms)</strong></span>
            <span>Khử mùi ion &amp; Điều hòa âm trần 21°C</span>
          </div>
        </div>

        {/* Right: Selected Station Detail & Live Booking Actions (4 cols) */}
        <div className="lg:col-span-4 bg-[#070d1e]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-white/10 mb-5 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">CHI TIẾT VỊ TRÍ CHỌN</span>
                <h3 className="font-gaming font-black text-3xl text-emerald-400 mt-0.5">{currentSeatObj.id}</h3>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-mono font-bold border ${
                currentSeatObj.status === 'RESERVED'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse'
                  : currentSeatObj.status === 'CURRENT'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
              }`}>
                {currentSeatObj.zoneName}
              </span>
            </div>

            {/* BẢNG CẢNH BÁO NẾU MÁY NÀY ĐÃ ĐƯỢC KHÁCH ĐẶT TRƯỚC */}
            {activeBooking ? (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/70 mb-5 space-y-3 font-mono shadow-lg">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase">
                  <span className="material-symbols-outlined text-[18px] text-amber-400">event_seat</span>
                  <span>MÁY ĐÃ ĐƯỢC GIỮ CHỖ TRƯỚC!</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between border-b border-amber-500/20 pb-1">
                    <span className="text-slate-400">Khách hàng:</span>
                    <strong className="text-white">{activeBooking.customerName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-500/20 pb-1">
                    <span className="text-slate-400">Số điện thoại:</span>
                    <strong className="text-amber-300">{activeBooking.phone}</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-500/20 pb-1">
                    <span className="text-slate-400">Khung giờ:</span>
                    <span className="text-white font-bold">{activeBooking.timeSlot}</span>
                  </div>
                  <div className="flex justify-between border-b border-amber-500/20 pb-1">
                    <span className="text-slate-400">Mã đặt chỗ:</span>
                    <span className="text-emerald-400 font-bold font-mono">{activeBooking.bookingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Chi nhánh:</span>
                    <span className="text-slate-300 text-[10px] text-right truncate max-w-[160px]">{activeBooking.branch}</span>
                  </div>
                </div>
                <p className="text-[10px] text-amber-400/80 italic">
                  * Máy này được giữ riêng cho khách. Khách đến đọc mã để nhận máy hoặc bạn có thể đặt trước đồ ăn để nhân viên phục vụ sẵn.
                </p>
              </div>
            ) : null}

            {/* Hardware Telemetry Specs */}
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5 flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-cyan-400">memory</span>CPU
                </span>
                <span className="font-bold text-white text-right truncate max-w-[200px]">{currentSeatObj.cpu}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5 flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">view_in_ar</span>VGA
                </span>
                <span className="font-bold text-emerald-400 text-right truncate max-w-[200px]">{currentSeatObj.gpu}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5 flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-cyan-400">desktop_windows</span>Màn hình
                </span>
                <span className="font-bold text-cyan-300 text-right truncate max-w-[200px]">{currentSeatObj.screen}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5 flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-purple-400">keyboard</span>Gaming Gear
                </span>
                <span className="font-bold text-slate-200 text-right truncate max-w-[200px]">{currentSeatObj.gear}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5 flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-400">chair</span>Ghế ngồi
                </span>
                <span className="font-bold text-slate-200 text-right truncate max-w-[200px]">{currentSeatObj.chair}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5 font-mono">
            {activeBooking ? (
              <div className="space-y-2">
                <Link
                  href={`/menu`}
                  className="w-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold py-3 rounded-xl text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
                  <span>CHUẨN BỊ MÓN ĂN TRƯỚC CHO MÁY {currentSeatObj.id}</span>
                </Link>
                <button
                  onClick={() => handleCancelBooking(currentSeatObj.id)}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold py-2.5 rounded-xl text-xs uppercase transition cursor-pointer"
                >
                  HỦY GIỮ CHỖ MÁY NÀY
                </button>
              </div>
            ) : currentSeatObj.status === 'AVAILABLE' ? (
              <div className="space-y-2">
                <button
                  onClick={handleOpenBooking}
                  className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500 hover:brightness-110 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                  <span>ĐẶT GIỮ CHỖ MÁY {currentSeatObj.id} NGAY</span>
                </button>
                <Link
                  href={`/menu`}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 font-bold py-2.5 rounded-xl text-xs uppercase flex items-center justify-center gap-2 transition"
                >
                  <span className="material-symbols-outlined text-[16px] text-cyan-400">restaurant_menu</span>
                  <span>Gọi Món Cho Máy {currentSeatObj.id}</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/menu"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
              >
                <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
                <span>GỌI MÓN TẠI MÁY {currentSeatObj.id}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MODAL ĐẶT GIỮ MÁY TẠI CHỖ */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative font-sans">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  CZ
                </div>
                <h3 className="font-gaming font-black text-xl text-white">ĐẶT GIỮ MÁY {currentSeatObj.id}</h3>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">HỌ TÊN BẠN / NICKNAME (*)</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A / ProGamer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">SỐ ĐIỆN THOẠI (*)</label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">KHUNG GIỜ NHẬN MÁY</label>
                <select
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-400 outline-none"
                >
                  <option>Ngay bây giờ (Tức thì)</option>
                  <option>13:00 - 17:00</option>
                  <option>18:00 - 22:00 (Giờ cao điểm)</option>
                  <option>22:00 - 06:00 (Combo cày đêm)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Vị trí:</span>
                  <strong className="text-emerald-400">{currentSeatObj.id} ({currentSeatObj.zoneName})</strong>
                </div>
                <div className="flex justify-between">
                  <span>Giá giờ chơi:</span>
                  <strong className="text-white">{currentSeatObj.price}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian giữ chỗ:</span>
                  <strong className="text-cyan-300">30 phút kể từ mốc giờ</strong>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:brightness-110 text-black font-extrabold text-xs rounded-xl shadow-lg transition"
                >
                  XÁC NHẬN GIỮ CHỖ NGAY
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
