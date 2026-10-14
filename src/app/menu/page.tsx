'use client';

import React, { useState, useMemo } from 'react';
import ClientHeader from '@/components/fnb/ClientHeader';
import FoodCard from '@/components/fnb/FoodCard';
import CartSidebar from '@/components/fnb/CartSidebar';
import { MenuItem, CartItem, PaymentMethod } from '@/types/fnb';

const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'food-1',
    categoryId: 'mi-tron',
    name: 'Mì Cay Hải Sản Kim Chi Cấp 1-7',
    price: 59000,
    prepTime: 7,
    isAvailable: true,
    isHot: true,
    isBestSeller: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYGw4B9RP99PPdjc8wyHSPZdlL3BF-ybaQ4ZQFZmIBZvpxL5cMwxcC2UYjV49YAsCuw0TCueKQtonWF7CT4aJLdA_xHLh-DiwsHwHSnq6m7PMw_Nnl8GxQXX-5Y3jzO53xJF1RBka32vjZ3F8AOnknOs0o1M0t41yL2UJsz7y8OLMldsi4CwczLsxuA5mNyHZHqViwufuqivDquw3E4bsyS0e6zsihVwWbwwtIrh2CUab1oGE98mLz',
    spicyLevels: [1, 2, 3, 5, 7],
    noteDetail: 'Tôm sú, mực tươi, chả cá Hàn Quốc, xúc xích',
  },
  {
    id: 'food-2',
    categoryId: 'com-dia',
    name: 'Cơm Bò Lúc Lắc Phô Mai Trứng Ốp La',
    price: 55000,
    prepTime: 7,
    isAvailable: true,
    isHot: false,
    isBestSeller: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCieTCAC15tEckMyrwhue84L-DVMOQSMkKg5dHSMJMmeZ4zVRkHFxnRC5j3uO3EmkyM1tmSYeKU5w_-AGD8VOinBoKpZSBen1OvI7slhNeBG0QkCBA5n0DUjBdtPyBwh1LlAwSVDCuauVuE5z3b1M9xJMBnEBJmzhEJrhGo-gYaKasamY8WDxAzaNK21dZQHA5iiFvuVh0Hl_0gIR9zB6X61Wd10ciCloHMFyu-x7j044LaTD5C5eGE',
    options: ['+ Trứng ốp la lòng đào (+8k)', 'Kèm canh rong biển nóng'],
    noteDetail: 'Bò mềm xào sốt tiêu đen phô mai kéo sợi',
  },
  {
    id: 'food-3',
    categoryId: 'com-dia',
    name: 'Cơm Gà Xối Mỡ Da Giòn (Đùi Góc Tư)',
    price: 48000,
    prepTime: 6,
    isAvailable: true,
    isHot: false,
    isBestSeller: false,
    badge: 'CÒN 8 SUẤT',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCAllP1JVO0kh48FIhlsTT-oVUOkNrKlBzArTW8cbQ65AVwl5nThWA6jsoJ6yHcELqiDsiqh6OQyanO9s9PYBQJu8C9CjWzeGGKV6PB814DyVYyTyKVQlvh76ssPplsFsAzQipysLnEdco7OT59mwngJqDnc4VEiEJeIXY9r1S2ukCcyoj3pzWHtyIbkS8l3X58b6JOdBMpjGGJp-pkbdRfyqlU9-xl5eLL9MTry-OTHH7SvQ5c0a6',
    noteDetail: 'Đùi góc tư da giòn rụm, cơm chiên tỏi thơm',
  },
  {
    id: 'food-4',
    categoryId: 'com-dia',
    name: 'Bánh Mì Chảo Đặc Biệt Cybernet',
    price: 45000,
    prepTime: 5,
    isAvailable: true,
    isHot: false,
    isBestSeller: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu9F8lH95HkImueHAngFlwqv8l9d7tWFMHx4R-UIU85u6TXMgzRiUc1uxwkPppbstVR2bbV2X2pNNwxgWs_WAayZdF0GTnM0F3hoRlJ5Oqc-5o5Hw_wtMw4sRTpn_PqKlBn4iPJ2U-oPBf1c53nRoKkMXB7Xl-RJd4IuQKFvSKk3l501nok64dzrfqguE0rItav9Eq8FAIGlE9aGoPaumLxml0UBlxY9X0mAZkNEL0-Jxlm_2Xjwi7',
    noteDetail: '2 trứng ốp la, pate Cột Đèn, bò mềm, xíu mại sốt',
  },
  {
    id: 'food-5',
    categoryId: 'nuoc-uong',
    name: 'Monster Energy Ultra Lạnh (Kèm Ly Đá)',
    price: 35000,
    prepTime: 1,
    isAvailable: true,
    isHot: false,
    isBestSeller: false,
    badge: 'LẠNH SÂU',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOyBTly5Kep0QrvUg8IHG2nWtUkwyFKf8Bd7k9P9qhjQAxoVnbwgyG7FRWTeWzVfduBbiXjaa7H746SgUdTkKlnskwVJi1enb3gYJOmFDAQUx0g1vNGnVclidnPxA7noAD9RmKco_2q2Q6h_7GvC17Wx5_ByF3Oh9RZQpLHzQTZI45qxuwZYO9RxrDdfyG9zusmv-oklZTdJL146q7_sHyQNCscWs5uQndNouJSGPa9-UEAfSGCqdy',
    options: ['Kèm 01 ly đá riêng'],
    noteDetail: 'Ướp lạnh âm độ C, sảng khoái chiến game đêm',
  },
  {
    id: 'food-6',
    categoryId: 'an-vat',
    name: 'Khoai Tây Lắc Trứng Muối Phô Mai',
    price: 28000,
    prepTime: 4,
    isAvailable: true,
    isHot: false,
    isBestSeller: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkbTMQIP_QQ8-n8u9fwTne_6N5VanumVSDmKY00UxqDUL0vOWKuNb-9_uHZEGzil8LR3yDg-K-nyyCKsDaWmcjsvHmEuSTTG7wOoMMu9gZq3ZoW_-OoicPj7mjH_UjW3h5s3_S1SqphFm940y7sTiItzUPNVCJSAq4O9O7zm8dcrOcJB5kl8NIivCS0bUA88aRpbS47e3_D7Ju0v8X5KvDcIj0JLezQcUoTwAsiCY9WzguozzE_k6t',
    noteDetail: 'Khoai sợi giòn rụm • Phủ đẫm bột trứng muối béo',
  },
  {
    id: 'food-7',
    categoryId: 'mi-tron',
    name: 'Mì Trộn Indomie Double Trứng Lòng Đào',
    price: 38000,
    prepTime: 5,
    isAvailable: true,
    isHot: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    options: ['Trứng lòng đào béo ngậy', 'Trứng ốp chín kỹ'],
    noteDetail: 'Hành phi thơm giòn, kèm dưa leo và sốt đặc chế',
  },
  {
    id: 'food-8',
    categoryId: 'nuoc-uong',
    name: 'Trà Đào Cam Sả Khổng Lồ 1 Lít',
    price: 28000,
    prepTime: 3,
    isAvailable: true,
    isHot: false,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    noteDetail: 'Ly size khủng 1000ml, 3 miếng đào giòn ngọt',
  },
  {
    id: 'food-9',
    categoryId: 'an-vat',
    name: 'Xúc Xích Đức Nướng Phô Mai Tan Chảy',
    price: 25000,
    prepTime: 4,
    isAvailable: true,
    isHot: false,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
    noteDetail: '2 cây xúc xích Đức nướng kèm tương ớt béo cay',
  },
];

export default function CyberMenuClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHotOnly, setFilterHotOnly] = useState(false);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);

  const [accountBalance, setAccountBalance] = useState(250000);
  const [orderSuccessModal, setOrderSuccessModal] = useState<{
    orderNumber: number;
    total: number;
    method: PaymentMethod;
    itemsCount: number;
  } | null>(null);

  // Active KDS ticker tracking
  const [currentTicker, setCurrentTicker] = useState<{
    orderCode: string;
    description: string;
    eta: string;
    progressPercent: number;
  } | null>({
    orderCode: '#KDS-8821',
    description: '1x Mì Trộn Indomie Double Trứng + 1x Sting Dâu Lạnh',
    eta: '04:30',
    progressPercent: 65,
  });

  // Cart state initialized with default items from Stitch UI
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      menuItemId: 'food-2',
      name: 'Cơm Bò Lúc Lắc Phô Mai',
      price: 63000,
      qty: 1,
      selectedOption: 'Trứng ốp la lòng đào (+8k)',
      note: 'Cơm nóng dẻo',
    },
    {
      id: 'cart-init-2',
      menuItemId: 'food-5',
      name: 'Monster Energy Ultra Lạnh',
      price: 35000,
      qty: 1,
      selectedOption: 'Kèm 01 ly đá riêng',
      note: 'Ưu tiên mang trước nước',
    },
  ]);

  // Categories list
  const categories = [
    { id: 'all', name: 'TẤT CẢ', count: 28, icon: 'grid_view' },
    { id: 'mi-tron', name: 'Mì Trộn / Nước', count: 8, icon: 'ramen_dining' },
    { id: 'com-dia', name: 'Cơm Đĩa', count: 6, icon: 'dinner_dining' },
    { id: 'nuoc-uong', name: 'Nước Tăng Lực & Soda', count: 7, icon: 'bolt' },
    { id: 'an-vat', name: 'Đồ Ăn Vặt', count: 4, icon: 'cookie' },
    { id: 'combo', name: 'Combo Cày Đêm', count: 'HOT', icon: 'military_tech' },
  ];

  // Filter menu items
  const filteredItems = useMemo(() => {
    return INITIAL_MENU_ITEMS.filter((item) => {
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'combo') {
          // Show hot combo items
          if (!item.isHot && !item.isBestSeller) return false;
        } else if (item.categoryId !== selectedCategory) {
          return false;
        }
      }

      if (filterHotOnly && !item.isHot) return false;
      if (filterAvailableOnly && !item.isAvailable) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesNote = item.noteDetail?.toLowerCase().includes(q);
        if (!matchesName && !matchesNote) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, filterHotOnly, filterAvailableOnly]);

  // Add item to cart
  const handleAddToCart = (item: MenuItem, selectedOption?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (c) => c.menuItemId === item.id && c.selectedOption === selectedOption
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          qty: 1,
          selectedOption,
          note: item.noteDetail,
        },
      ];
    });
  };

  // Add Night Owls Combo
  const handleAddNightCombo = () => {
    const comboItem: CartItem = {
      id: `cart-combo-${Date.now()}`,
      menuItemId: 'combo-special',
      name: 'Combo Thức Đêm Chiến Game (-20%)',
      price: 69000,
      qty: 1,
      selectedOption: '1x Cơm Gà + 1x Sting Dâu + 1x Snack',
      note: 'Ưu đãi cày đêm',
    };
    setCart((prev) => [...prev, comboItem]);
  };

  // Update item quantity
  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove single item
  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear cart
  const handleClearCart = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      setCart([]);
    }
  };

  // Checkout order
  const handleCheckout = (note: string, paymentMethod: PaymentMethod, total: number) => {
    const newOrderNumber = Math.floor(1000 + Math.random() * 9000);

    if (paymentMethod === 'ACCOUNT_BALANCE') {
      setAccountBalance((prev) => prev - total);
    }

    // Create synchronized order for KDS screen
    const newKdsOrder = {
      id: `ord-${newOrderNumber}`,
      orderNumber: newOrderNumber,
      pcName: 'VIP-08',
      zoneName: 'ZONE VIP A • TẦNG 2',
      status: 'PENDING' as const,
      paymentMethod,
      totalAmount: total,
      timeElapsed: '00:01',
      note: note || undefined,
      station: 'HOT_KITCHEN' as const,
      items: cart.map(
        (c) => `${c.qty}x ${c.name}${c.selectedOption ? ` (${c.selectedOption})` : ''}`
      ),
    };

    // Save to localStorage for KDS Kitchen screen to pick up instantly
    try {
      if (typeof window !== 'undefined') {
        const existingStr = localStorage.getItem('cyber_orders');
        const existingOrders = existingStr ? JSON.parse(existingStr) : [];
        localStorage.setItem('cyber_orders', JSON.stringify([newKdsOrder, ...existingOrders]));
        window.dispatchEvent(new CustomEvent('cyber_order_created', { detail: newKdsOrder }));
      }
    } catch {
      // LocalStorage fallback
    }

    // Set active KDS ticker
    const firstItem = cart[0];
    setCurrentTicker({
      orderCode: `#KDS-${newOrderNumber}`,
      description: `${cart.length} món • ${firstItem?.name || 'Món ăn Gaming'}`,
      eta: '07:00',
      progressPercent: 15,
    });

    setOrderSuccessModal({
      orderNumber: newOrderNumber,
      total,
      method: paymentMethod,
      itemsCount: cart.length,
    });

    setCart([]);
  };

  // Calculate real remaining time from account balance (20.000đ/hour for VIP station)
  const remainingHours = Math.floor(accountBalance / 20000);
  const remainingMins = Math.floor(((accountBalance % 20000) / 20000) * 60);
  const formattedRemainingTime = `${String(remainingHours).padStart(2, '0')}:${String(remainingMins).padStart(2, '0')}:15`;

  return (
    <div className="min-h-screen bg-[#070e1d] text-slate-100 font-sans flex flex-col">
      {/* Top Gaming Client HUD Bar */}
      <ClientHeader
        pcName="VIP-08"
        zoneName="Tầng 2 (Màn 240Hz)"
        balance={accountBalance}
        remainingTime={formattedRemainingTime}
        userName="ProGamer_VN"
        userTier="Hội viên VIP"
        currentOrderTicker={currentTicker}
      />

      {/* Main Gaming App Layout */}
      <main className="flex-1 w-full p-3 lg:p-4 grid grid-cols-12 gap-3 max-w-[1920px] mx-auto">
        {/* Left & Center: Search, Categories & Food Matrix */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-3">
          {/* Quick Search & Filter Bar */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 text-[18px]">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-16 py-2 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="Tìm tên món ăn, thức uống, combo cày game..."
                type="text"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
                F3 /
              </span>
            </div>

            {/* Quick Filter Badges */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setFilterHotOnly(!filterHotOnly)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                  filterHotOnly
                    ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">local_fire_department</span> Món HOT
              </button>

              <button
                type="button"
                onClick={() => setFilterAvailableOnly(!filterAvailableOnly)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                  filterAvailableOnly
                    ? 'bg-emerald-400 text-black border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                    : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span> Sẵn Hàng
              </button>
            </div>
          </div>

          {/* Gaming Mechanical Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  className={`flex items-center gap-1.5 px-3.5 py-2 font-bold text-xs rounded-lg tracking-wider flex-shrink-0 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-black/30 text-white font-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hero Promo Banner: Combo Chiến Game Xuyên Đêm */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-slate-700 bg-black">
                <img
                  className="w-full h-full object-cover"
                  alt="Combo bữa ăn đêm game thủ"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBymHLb3l1JmWlngJPpyVNfJn_0RCAbnaJG2NAs6alMIt8W-U6SFskoTKEjkvd0Kt7vvjBCCvoWMq-9GbL09b6AtcIxPDPxwB7KFmS-8eNKEzsGrF2k2wBnSiH6P_TwccorCzRjVwDrD24mrKtmtIwLqea1VJLEjpo4i_G2Xh5Wp3aisud9TovqNKYIws2Eae0UKcMazvvkyEXFpBb49Ifw47OL3AkVvC8BrmHmkz9pNJMX_WznqEn6"
                />
                <span className="absolute top-0 left-0 bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 uppercase tracking-wider font-mono">
                  -20%
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded uppercase font-mono">
                    COMBO CÀY ĐÊM
                  </span>
                  <span className="text-xs text-slate-400">1x Cơm Đùi Gà + 1x Sting Dâu + 1x Snack</span>
                </div>
                <h3 className="text-white font-black text-lg uppercase tracking-wide mt-1">
                  COMBO THỨC ĐÊM CHIẾN GAME
                </h3>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="font-mono text-2xl font-black text-emerald-400 leading-none">
                    69.000đ
                  </span>
                  <span className="text-xs line-through text-slate-500 font-mono">85.000đ</span>
                  <span className="text-xs text-cyan-400 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">bolt</span> Tiết kiệm 16k
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddNightCombo}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs uppercase rounded-xl tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 transition-all flex-shrink-0 font-mono"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              <span>CHỌN COMBO NÀY</span>
            </button>
          </div>

          {/* Streamlined Food Cards Grid */}
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-[#0c1424] rounded border border-[#26354f]">
              <span className="material-symbols-outlined text-4xl mb-2 text-slate-600">search_off</span>
              <p className="font-bold text-slate-400">Không tìm thấy món phù hợp</p>
              <p className="text-xs text-slate-500 mt-1">Thử đổi từ khóa hoặc chọn danh mục "TẤT CẢ"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Order Sidebar / Cart */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <CartSidebar
            cart={cart}
            pcName="MÁY VIP-08"
            accountBalance={accountBalance}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </main>

      {/* Bottom Gaming Footer Status */}
      <footer className="w-full bg-[#050912] border-t border-[#26354f]/60 py-2 px-4 mt-auto">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-gaming font-bold text-primary tracking-wider">
              CYBERNET F&amp;B ENGINE v3.2
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Khu máy: Zone VIP A (Gaming Monitor 240Hz)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-secondary font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span> Máy chủ F&amp;B Online (Ping: 1ms)
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Hỗ trợ kỹ thuật: Ext 101</span>
          </div>
        </div>
      </footer>

      {/* Success Order Modal */}
      {orderSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1424] border-2 border-primary rounded-xl max-w-md w-full p-6 shadow-[0_0_30px_rgba(0,240,255,0.3)] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>

            <h3 className="font-gaming text-xl font-black text-white uppercase tracking-wider mb-1">
              ĐẶT MÓN THÀNH CÔNG!
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Đơn hàng của bạn đã được chuyển thẳng tới trạm bếp KDS.
            </p>

            <div className="w-full bg-[#070b14] border border-[#26354f] rounded-lg p-3 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Mã đơn:</span>
                <span className="font-mono font-bold text-primary">#{orderSuccessModal.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vị trí giao:</span>
                <span className="font-mono font-bold text-slate-200">VIP-08 (Tầng 2)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phương thức:</span>
                <span className="font-bold text-secondary">
                  {orderSuccessModal.method === 'ACCOUNT_BALANCE' ? 'Trừ ví tài khoản máy' : 'Tiền mặt / Quét QR tại máy'}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-sm">
                <span className="text-white">Tổng thanh toán:</span>
                <span className="font-mono text-primary text-base">
                  {orderSuccessModal.total.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <button
              onClick={() => setOrderSuccessModal(null)}
              className="w-full bg-primary hover:bg-[#38f8ff] text-black font-gaming font-black py-3 rounded-lg uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              TIẾP TỤC CHƠI GAME
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
