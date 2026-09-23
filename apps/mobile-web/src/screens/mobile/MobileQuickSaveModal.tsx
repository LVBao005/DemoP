import React, { useState } from 'react';
import { X, Sparkles, Camera, Plus, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MobileQuickSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, category: string, note?: string) => void;
  onOpenFullAdd?: () => void;
  onOpenCamera?: () => void;
}

const PRESET_AMOUNTS = [20000, 35000, 50000, 80000, 100000, 150000];

const QUICK_CATEGORIES = [
  { id: 'food', name: 'Ăn uống', icon: '🍜' },
  { id: 'cafe', name: 'Cà phê', icon: '☕' },
  { id: 'breakfast', name: 'Ăn sáng', icon: '🍳' },
  { id: 'lunch', name: 'Ăn trưa', icon: '🍱' },
  { id: 'transport', name: 'Đổ xăng', icon: '⛽' },
  { id: 'groceries', name: 'Đi chợ', icon: '🛒' },
  { id: 'boba', name: 'Trà sữa', icon: '🧋' },
  { id: 'shopping', name: 'Mua sắm', icon: '🛍️' },
];

export const MobileQuickSaveModal: React.FC<MobileQuickSaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onOpenFullAdd,
  onOpenCamera,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(35000);
  const [selectedCategory, setSelectedCategory] = useState<string>('Cà phê');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const handleQuickSave = () => {
    onSave(selectedAmount, selectedCategory, customNote || undefined);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Lưu nhanh 1-chạm</h3>
              <p className="text-xs text-slate-500">Ghi lại khoản chi tức thì chỉ trong 3 giây</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected amount preview hero */}
        <div className="my-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Số tiền ghi nhận
            </span>
            <div className="text-2xl font-black text-emerald-900 mt-0.5">
              -{selectedAmount.toLocaleString('vi-VN')} đ
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Danh mục</span>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1 justify-end">
              <span>{QUICK_CATEGORIES.find((c) => c.name === selectedCategory)?.icon || '💸'}</span>
              <span>{selectedCategory}</span>
            </div>
          </div>
        </div>

        {/* Preset amounts grid */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">
            1. Chọn số tiền
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((amt) => {
              const active = selectedAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-2.5 px-2 rounded-xl text-center font-bold text-xs transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {amt.toLocaleString('vi-VN')} đ
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick category chips */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">
            2. Cho mục đích gì?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {QUICK_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-2.5 rounded-xl flex flex-col items-center gap-1 text-center transition-all ${
                    active
                      ? 'bg-emerald-100/80 border-2 border-emerald-600 text-emerald-900 font-bold scale-[1.02]'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[11px] leading-tight truncate w-full">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional note input */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Thêm ghi chú ngắn (tùy chọn)..."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          />
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <button
            onClick={handleQuickSave}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lưu Khoản Chi ({selectedAmount.toLocaleString('vi-VN')} đ)</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {onOpenCamera && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCamera();
                }}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Chụp ảnh hóa đơn</span>
              </button>
            )}
            {onOpenFullAdd && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullAdd();
                }}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Nhập chi tiết</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
