'use client';

import React, { useState } from 'react';
import { CartItem, PaymentMethod } from '@/types/fnb';

interface CartSidebarProps {
  cart: CartItem[];
  pcName?: string;
  vipDiscountRate?: number;
  accountBalance?: number;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: (note: string, paymentMethod: PaymentMethod, total: number) => void;
}

export default function CartSidebar({
  cart,
  pcName = 'MÁY VIP-08',
  vipDiscountRate = 0.05,
  accountBalance = 250000,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartSidebarProps) {
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ACCOUNT_BALANCE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vipDiscount = Math.round(subTotal * vipDiscountRate);
  const total = Math.max(0, subTotal - vipDiscount);

  const handleOrderSubmit = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'ACCOUNT_BALANCE' && accountBalance < total) {
      alert(`Số dư tài khoản (${accountBalance.toLocaleString()}đ) không đủ thanh toán (${total.toLocaleString()}đ). Vui lòng nạp thêm hoặc chọn Tiền mặt / Quét QR!`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onCheckout(note, paymentMethod, total);
      setIsSubmitting(false);
      setNote('');
    }, 600);
  };

  return (
    <div className="bg-[#0b1322] border border-[#26354f] rounded p-3 flex flex-col gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.8)] sticky top-16">
      {/* Cart Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26354f]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm font-bold text-[14px] text-white uppercase tracking-wide">
                GIỎ GỌI MÓN
              </span>
              <span className="px-1.5 py-0.2 bg-primary text-black font-gaming text-[10px] font-black rounded">
                {totalItemsCount} MÓN
              </span>
            </div>
            <span className="text-[11px] font-gaming text-secondary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span> GIAO ĐẾN: {pcName}
            </span>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-slate-400 hover:text-cyber-red p-1 transition-colors"
            title="Xóa toàn bộ giỏ hàng"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      {cart.length === 0 ? (
        <div className="py-8 px-4 flex flex-col items-center justify-center text-center text-slate-500 bg-[#080e1a] rounded border border-[#26354f]/50">
          <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">fastfood</span>
          <p className="text-xs font-semibold text-slate-400">Giỏ hàng của bạn đang trống</p>
          <p className="text-[11px] text-slate-500 mt-1">Bấm "+ THÊM NHANH" trên các món để bắt đầu đặt!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-[#080e1a] border border-[#26354f]/60 p-2 rounded flex flex-col gap-1.5 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-1">
                <div className="flex-1">
                  <h5 className="text-[13px] font-bold text-white leading-snug">{item.name}</h5>
                  {item.selectedOption && (
                    <span className="text-[11px] text-secondary font-medium block">
                      + {item.selectedOption}
                    </span>
                  )}
                </div>
                <span className="font-gaming text-[14px] font-bold text-primary whitespace-nowrap">
                  {(item.price * item.qty).toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#26354f]/40">
                <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                  {item.note || 'Món chuẩn vị cyber'}
                </span>
                <div className="flex items-center gap-1.5 bg-[#121c2e] px-1 py-0.5 rounded border border-[#26354f]">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="text-slate-400 hover:text-white px-1 leading-none font-bold"
                    type="button"
                  >
                    -
                  </button>
                  <span className="font-gaming text-[12px] font-bold text-white px-1">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="text-slate-400 hover:text-white px-1 leading-none font-bold"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note to Staff / Kitchen */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
          <span>Lời nhắn bếp / nhân viên:</span>
          <span className="text-[10px] text-slate-500">Tùy chọn</span>
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="VD: Làm cay nhiều, lấy thêm muỗng nĩa..."
          className="w-full bg-[#080e1a] border border-[#26354f] rounded px-2.5 py-1.5 text-[12px] text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors font-body-md"
          type="text"
        />
      </div>

      {/* Payment Method Radio Selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thanh toán:</span>
        <label
          onClick={() => setPaymentMethod('ACCOUNT_BALANCE')}
          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border ${
            paymentMethod === 'ACCOUNT_BALANCE'
              ? 'bg-[#0e1828] border-secondary/60 shadow-[0_0_10px_rgba(0,255,136,0.15)]'
              : 'bg-[#080e1a] border-[#26354f]/60 hover:bg-[#0f192b]'
          }`}
        >
          <div className="flex items-center gap-2">
            <input
              checked={paymentMethod === 'ACCOUNT_BALANCE'}
              onChange={() => setPaymentMethod('ACCOUNT_BALANCE')}
              className="accent-secondary w-3.5 h-3.5"
              name="payment_mode"
              type="radio"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[12px] font-bold text-white">Trừ tài khoản máy trạm</span>
              <span className="text-[10px] text-secondary font-gaming">
                Khả dụng: {accountBalance.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-secondary text-[18px]">account_balance_wallet</span>
        </label>

        <label
          onClick={() => setPaymentMethod('CASH_OR_QR')}
          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border ${
            paymentMethod === 'CASH_OR_QR'
              ? 'bg-[#0e1828] border-primary/60 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
              : 'bg-[#080e1a] border-[#26354f]/60 hover:bg-[#0f192b]'
          }`}
        >
          <div className="flex items-center gap-2">
            <input
              checked={paymentMethod === 'CASH_OR_QR'}
              onChange={() => setPaymentMethod('CASH_OR_QR')}
              className="accent-primary w-3.5 h-3.5"
              name="payment_mode"
              type="radio"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[12px] font-semibold text-slate-300">Tiền mặt tại bàn / Quét QR</span>
              <span className="text-[10px] text-slate-500">Thu khi nhân viên bưng món</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[18px]">qr_code_2</span>
        </label>
      </div>

      {/* Price Breakdown */}
      <div className="bg-[#080e1a] border border-[#26354f]/60 p-2.5 rounded flex flex-col gap-1 text-[12px]">
        <div className="flex items-center justify-between text-slate-400">
          <span>Tiền món ({totalItemsCount} món):</span>
          <span className="text-white font-gaming">{subTotal.toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Phục vụ tận máy:</span>
          <span className="text-secondary font-bold text-[11px] font-gaming">MIỄN PHÍ</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Ưu đãi VIP (-5%):</span>
          <span className="text-secondary font-gaming">-{vipDiscount.toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="pt-1.5 mt-0.5 border-t border-[#26354f]/60 flex items-center justify-between">
          <span className="font-bold text-[13px] text-white uppercase">Tổng thanh toán:</span>
          <span className="font-gaming text-[20px] font-black text-primary">
            {total.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>

      {/* Big CTA Button */}
      <button
        onClick={handleOrderSubmit}
        disabled={cart.length === 0 || isSubmitting}
        className={`w-full py-3 px-4 rounded flex items-center justify-center gap-2 font-gaming font-black text-[14px] uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.45)] hover:shadow-[0_0_28px_rgba(0,240,255,0.65)] active:scale-[0.98] ${
          cart.length === 0
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
            : 'bg-primary hover:bg-[#38f8ff] text-black'
        }`}
        type="button"
      >
        <span className="material-symbols-outlined text-[20px] font-black">
          {isSubmitting ? 'sync' : 'bolt'}
        </span>
        <span>{isSubmitting ? 'ĐANG GỬI BẾP...' : '⚡ ĐẶT MÓN - GIAO TẬN BÀN'}</span>
      </button>

      <span className="text-center text-[10px] text-slate-500 font-medium">
        Bếp trạm KDS nhận thông báo ngay lập tức • Phục vụ trong 5-10 phút
      </span>
    </div>
  );
}
