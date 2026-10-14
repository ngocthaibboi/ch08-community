'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/types/fnb';

interface FoodCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, selectedOption?: string) => void;
}

export default function FoodCard({ item, onAddToCart }: FoodCardProps) {
  const [selectedSpicy, setSelectedSpicy] = useState<number | null>(
    item.spicyLevels && item.spicyLevels.length > 0 ? item.spicyLevels[2] || item.spicyLevels[0] : null
  );
  const [selectedAddon, setSelectedAddon] = useState<string | null>(
    item.options && item.options.length > 0 ? item.options[0] : null
  );

  const handleQuickAdd = () => {
    let optionText = '';
    if (selectedSpicy !== null) {
      optionText = `Cay cấp ${selectedSpicy}`;
    }
    if (selectedAddon) {
      optionText = optionText ? `${optionText}, ${selectedAddon}` : selectedAddon;
    }
    onAddToCart(item, optionText || undefined);
  };

  return (
    <div className="bg-[#0b1322] border border-[#26354f] hover:border-primary/60 rounded p-2.5 flex flex-col justify-between group transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,240,255,0.15)]">
      <div>
        {/* Item Image with Badges */}
        <div className="relative h-36 w-full rounded overflow-hidden bg-black mb-2">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {item.isHot && (
            <span className="absolute top-1.5 left-1.5 bg-cyber-red text-white text-[10px] font-black px-1.5 py-0.5 rounded font-gaming tracking-wider uppercase">
              HOT
            </span>
          )}
          {item.isBestSeller && !item.isHot && (
            <span className="absolute top-1.5 left-1.5 bg-[#059669] text-white text-[10px] font-black px-1.5 py-0.5 rounded font-gaming tracking-wider uppercase">
              BESTSELLER
            </span>
          )}
          {item.badge && !item.isHot && !item.isBestSeller && (
            <span className="absolute top-1.5 left-1.5 bg-[#17253b] text-primary border border-primary/40 text-[10px] font-bold px-1.5 py-0.5 rounded font-gaming tracking-wider uppercase">
              {item.badge}
            </span>
          )}
          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[12px] text-primary">timer</span> ~{item.prepTime} phút
          </span>
        </div>

        {/* Title & Price Bar */}
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-headline-sm text-[15px] font-bold text-white group-hover:text-primary transition-colors leading-tight">
            {item.name}
          </h4>
          <span className="font-gaming text-[17px] font-extrabold text-primary whitespace-nowrap">
            {item.price.toLocaleString('vi-VN')}đ
          </span>
        </div>

        {/* Spicy Option Chips (if any) */}
        {item.spicyLevels && item.spicyLevels.length > 0 && (
          <div className="flex items-center gap-1 mt-2 text-[11px]">
            <span className="text-slate-400 font-semibold">Cấp cay:</span>
            <div className="flex items-center gap-1">
              {item.spicyLevels.map((lvl) => {
                const isSelected = selectedSpicy === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedSpicy(lvl)}
                    className={`w-5 h-5 rounded text-[10px] font-bold transition-all ${
                      isSelected
                        ? 'bg-cyber-red text-white shadow-sm font-black scale-105'
                        : 'bg-[#131f33] text-slate-300 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Options / Addon chips (if any) */}
        {item.options && item.options.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-2 text-[11px] text-slate-400">
            {item.options.map((opt, i) => (
              <span
                key={i}
                className="bg-[#121c2c] px-1.5 py-0.5 rounded text-secondary border border-secondary/20"
              >
                {opt}
              </span>
            ))}
          </div>
        )}

        {/* Note detail without options */}
        {item.noteDetail && (!item.options || item.options.length === 0) && (!item.spicyLevels || item.spicyLevels.length === 0) && (
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
            <span className="bg-[#121c2c] px-1.5 py-0.5 rounded text-slate-300">{item.noteDetail}</span>
          </div>
        )}
      </div>

      {/* Quick Add Button */}
      <div className="mt-2.5 pt-2 border-t border-[#26354f]/60 flex items-center gap-1.5">
        <button
          onClick={handleQuickAdd}
          className="flex-1 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/40 font-gaming font-bold text-[12px] uppercase rounded transition-all flex items-center justify-center gap-1 active:scale-95 shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">add</span> THÊM NHANH
        </button>
      </div>
    </div>
  );
}
