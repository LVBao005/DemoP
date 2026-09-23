import React, { useState } from 'react';
import { Camera, Sparkles, Plus, Image as ImageIcon, Search, Tag, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';

interface MobileMomentsScreenProps {
  onOpenCamera: () => void;
  onViewPhoto: (url: string) => void;
  onSelectTransaction?: (tx: Transaction) => void;
}

export const MobileMomentsScreen: React.FC<MobileMomentsScreenProps> = ({
  onOpenCamera,
  onViewPhoto,
  onSelectTransaction,
}) => {
  const { transactions, moments, language } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isVi = language === 'vi';

  // Extract items with photos or transactions
  const photoItems = transactions.filter((t) => t.photoUrl);

  const filteredItems = photoItems.filter((item) => {
    const matchesCategory = filterCategory === 'all' || item.categoryId === filterCategory;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-4 p-4 pb-28">
      {/* ============================================================ */}
      {/* 1. HERO BANNER                                               */}
      {/* ============================================================ */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-800 p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="max-w-[70%]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full">
              Locket Money Diary
            </span>
            <h2 className="text-lg font-black mt-1 leading-snug">
              {isVi ? 'Khoảnh Khắc Chi Tiêu 📸' : 'Expense Moments 📸'}
            </h2>
            <p className="text-xs text-emerald-100/80 mt-1">
              {isVi
                ? 'Mỗi món chi là một khoảnh khắc sống động của bạn cùng Monett'
                : 'Every bill is a vivid moment of your financial journey'}
            </p>
          </div>

          <button
            onClick={onOpenCamera}
            className="p-3 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-md active:scale-95 transition-all flex flex-col items-center gap-1 shrink-0"
          >
            <Camera className="w-5 h-5 text-emerald-600" />
            <span>{isVi ? 'Chụp ngay' : 'Snap'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SEARCH & FILTER CHIPS                                     */}
      {/* ============================================================ */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isVi ? 'Tìm kiếm khoảnh khắc, địa điểm...' : 'Search moments, location...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['all', 'food', 'activities', 'shopping', 'transport'].map((cat) => {
            const active = filterCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'all'
                  ? isVi
                    ? 'Tất cả'
                    : 'All'
                  : cat === 'food'
                  ? '🍜 Ẩm thực'
                  : cat === 'activities'
                  ? '✨ Giải trí'
                  : cat === 'shopping'
                  ? '🛍️ Mua sắm'
                  : '🚗 Di chuyển'}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MOMENTS GRID                                              */}
      {/* ============================================================ */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">
            {isVi ? 'Chưa có ảnh chi tiêu nào' : 'No photo moments yet'}
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {isVi
              ? 'Hãy mở camera chụp lại bữa trưa, ly cà phê hoặc hóa đơn để tạo album ảnh chi tiêu!'
              : 'Open the camera and snap your meal, coffee or receipt to build your visual diary!'}
          </p>
          <button
            onClick={onOpenCamera}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>{isVi ? 'Chụp ảnh ngay' : 'Take a photo'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm flex flex-col hover:shadow-md transition-all"
            >
              {/* Photo box with price pill */}
              <div
                className="relative aspect-square w-full bg-slate-900 cursor-pointer overflow-hidden"
                onClick={() => item.photoUrl && onViewPhoto(item.photoUrl)}
              >
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Price tag pill */}
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[11px] font-black tracking-tight border border-white/20">
                  -{item.amount.toLocaleString('vi-VN')} đ
                </div>

                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-1 rounded-full text-white">
                  <Eye className="w-3 h-3" />
                </div>
              </div>

              {/* Card info */}
              <div
                className="p-2.5 flex-1 flex flex-col justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
                onClick={() => onSelectTransaction && onSelectTransaction(item)}
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 truncate leading-snug">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span className="capitalize">{item.categoryId}</span>
                    <span>{item.time || 'Hôm nay'}</span>
                  </div>
                </div>

                {item.note && (
                  <p className="text-[10px] text-slate-500 italic line-clamp-2 mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    "{item.note}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
