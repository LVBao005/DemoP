import React, { useState } from 'react';
import { X, Camera, Sparkles, Delete, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MobileAddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    amount: number;
    categoryId: string;
    wallet: string;
    photoUrl?: string;
    note?: string;
  }) => void;
  onOpenCamera?: () => void;
}

const CATEGORIES = [
  { id: 'food', name: 'Ăn uống', icon: '🍜' },
  { id: 'cafe', name: 'Cà phê', icon: '☕' },
  { id: 'shopping', name: 'Mua sắm', icon: '🛍️' },
  { id: 'transport', name: 'Di chuyển', icon: '🚗' },
  { id: 'bills', name: 'Hóa đơn', icon: '🧾' },
  { id: 'activities', name: 'Giải trí', icon: '✨' },
];

const WALLETS = [
  { id: 'w1', name: 'Tiền mặt', icon: '💵' },
  { id: 'w2', name: 'TPBank', icon: '💳' },
  { id: 'w3', name: 'Ví MoMo', icon: '📱' },
];

export const MobileAddExpenseModal: React.FC<MobileAddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onOpenCamera,
}) => {
  const [amountStr, setAmountStr] = useState('85000');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [selectedWallet, setSelectedWallet] = useState('Tiền mặt');
  const [note, setNote] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();

  if (!isOpen) return null;

  // Numpad key press handler
  const handleNumPress = (val: string) => {
    if (val === 'DEL') {
      setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (val === '000') {
      if (amountStr !== '0' && amountStr.length < 9) setAmountStr((prev) => prev + '000');
    } else {
      if (amountStr === '0') {
        setAmountStr(val);
      } else if (amountStr.length < 10) {
        setAmountStr((prev) => prev + val);
      }
    }
  };

  const parsedAmount = parseInt(amountStr, 10) || 0;

  const handleSave = () => {
    const finalTitle = title.trim() || CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Chi tiêu';
    if (!parsedAmount) {
      alert('Vui lòng nhập số tiền chi tiêu.');
      return;
    }

    onSave({
      title: finalTitle,
      amount: parsedAmount,
      categoryId: selectedCategory,
      wallet: selectedWallet,
      photoUrl,
      note: note.trim() || undefined,
    });

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // ignore
    }

    // Reset
    setTitle('');
    setAmountStr('85000');
    setNote('');
    setPhotoUrl(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Thêm Chi Tiêu Mới</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Hero Card */}
          <div className="my-3 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Số tiền chi tiêu
              </span>
              <div className="text-3xl font-black text-emerald-400 mt-0.5">
                -{parsedAmount.toLocaleString('vi-VN')} đ
              </div>
            </div>

            {/* Quick photo attachment button */}
            {photoUrl ? (
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/20">
                <img src={photoUrl} alt="Receipt" className="w-full h-full object-cover" />
                <button
                  onClick={() => setPhotoUrl(undefined)}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 text-white rounded-full flex items-center justify-center text-[10px]"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenCamera}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white flex flex-col items-center gap-0.5 text-[10px]"
              >
                <Camera className="w-5 h-5 text-emerald-400" />
                <span>Thêm ảnh</span>
              </button>
            )}
          </div>

          {/* Title input */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Tên khoản chi (Ví dụ: Cà phê sáng Highlands...)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Category selection */}
          <div className="mb-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Danh mục
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all font-semibold ${
                      active
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallet selection */}
          <div className="mb-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Nguồn tiền
            </label>
            <div className="flex gap-2">
              {WALLETS.map((w) => {
                const active = selectedWallet === w.name;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWallet(w.name)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 font-semibold transition-all ${
                      active
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{w.icon}</span>
                    <span>{w.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Numpad */}
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'DEL'].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => handleNumPress(k)}
                className={`py-3 rounded-xl font-black text-sm active:scale-95 transition-all ${
                  k === 'DEL'
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {k === 'DEL' ? '⌫' : k}
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-xs transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Lưu Chi Tiêu ({parsedAmount.toLocaleString('vi-VN')} đ)</span>
        </button>
      </div>
    </div>
  );
};
