import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  MoreHorizontal,
  Utensils,
  ShoppingBag,
  Car,
  Sparkles,
  Receipt,
  Calendar,
  Wallet,
  Pencil,
  Trash2,
  Signal,
  Wifi,
  BatteryFull,
  MapPin,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Transaction } from '../types';

interface MobileTransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onViewPhoto?: (url: string) => void;
  onUpdateNote?: (id: string, newNote: string) => void;
}

export const MobileTransactionDetailModal: React.FC<MobileTransactionDetailModalProps> = ({
  transaction,
  onClose,
  onDelete,
  onViewPhoto,
  onUpdateNote,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState(transaction?.note || '');
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!transaction) return null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Helper for category badge styling
  const getCategoryInfo = (catId?: string) => {
    switch (catId) {
      case 'shopping':
        return {
          label: 'Mua sắm',
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          iconBg: 'bg-amber-600',
          icon: <ShoppingBag className="w-2.5 h-2.5 text-white" />,
        };
      case 'transport':
        return {
          label: 'Di chuyển',
          bg: 'bg-sky-50',
          text: 'text-sky-700',
          iconBg: 'bg-sky-600',
          icon: <Car className="w-2.5 h-2.5 text-white" />,
        };
      case 'activities':
        return {
          label: 'Giải trí',
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          iconBg: 'bg-purple-600',
          icon: <Sparkles className="w-2.5 h-2.5 text-white" />,
        };
      case 'bills':
        return {
          label: 'Hóa đơn',
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          iconBg: 'bg-rose-600',
          icon: <Receipt className="w-2.5 h-2.5 text-white" />,
        };
      case 'food':
      default:
        return {
          label: 'Ăn uống',
          bg: 'bg-[#FFF0EB]',
          text: 'text-[#FF5A1F]',
          iconBg: 'bg-[#FF5A1F]',
          icon: <Utensils className="w-2.5 h-2.5 text-white" />,
        };
    }
  };

  const category = getCategoryInfo(transaction.categoryId);

  // Format date display: e.g. "15/09/2026"
  const formattedDate = (() => {
    if (!transaction.date) return '15/09/2026';
    if (transaction.date.includes('-')) {
      const parts = transaction.date.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return transaction.date;
  })();

  const heroImage =
    transaction.photoUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCUQJwo1li0NjmLPOLDf1TJ-4oA0VicReMi8XOMb9WbFvP5Ndbib-NQkdb2RHEsS2fkUU-MT_KDEJVmibIfUsCaqR8MrOcWRqJ3sXkpAbBz42NTU3-YjiIIUDBzo5RTG9A1O_s0Q1fZeFhQvaiYVeU-wrkZfCWJ542OiPlQF21kaqWMA26BnCnwAvxMHgdYBCrLYT5vhrMUyjB33ZeLu8UxRrwBrHGzkKvV9JrE5K_yOTlSXZL-5Isr';

  const foodThumbnail =
    transaction.photoUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDVa6dnkVzUxuRdUzW_P5MJov4KGNq19B0TEeDj8jMx1UBfbNwSz3WJJrv6mEGGrJC1TPmtolBps61zs2b3kswGOd5orwtH1FKW_JgDXKiXxmGR9FKBYkarShAIYqsTz2RWblscZi36Hb0LX8w-SJT7BJFCjsEHMnzrkHZVCjD5ubCBFFISanlDpBaKhyMVUmHtnNF8NoqYKLPh0YKXLeZoXGF8W9zwIpkSsqKnR0FBMmdpyldp4sWc';

  const billThumbnail =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD49qXVnQtEZ1V2r3t0GYTcLt2YcZb5_UcmTqizsZXJe0AdHkj1X3FvRkAuIPzhy-iszZRvqxmlT_cIEWLnmwSg1tmnq7117LZeh8qxHa1gi4y4elxp_HB6Hyi8xwG10ZY0B83K9W2eyWyN66X7fsJ1AnlKm9LXNev7x_1s8pjZle9zbsf14vu-i_7WNs17YtQe3iIglmvUjhrRd86AwpZnkv3E_FHQSzWETZsGzN_Y87fIHDunyrKq';

  const handleSaveNote = () => {
    if (onUpdateNote) {
      onUpdateNote(transaction.id, editedNote);
    }
    transaction.note = editedNote;
    setIsEditingNote(false);
    triggerToast('Đã lưu ghi chú giao dịch');
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(transaction.id);
    }
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl border border-slate-700 animate-fade-in flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Card Viewport - Matches HTML layout */}
      <main
        className="w-full max-w-[393px] h-full sm:min-h-[852px] sm:max-h-[92vh] bg-white sm:rounded-[44px] shadow-2xl relative overflow-y-auto overflow-x-hidden flex flex-col justify-between border-0 sm:border-[8px] sm:border-slate-900 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================ */}
        {/* BEGIN: TopHeroSection                                        */}
        {/* ============================================================ */}
        <div className="relative w-full h-[250px] overflow-hidden shrink-0">
          {/* Dish Hero Image */}
          <img
            alt={transaction.title}
            className="w-full h-full object-cover"
            src={heroImage}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCUQJwo1li0NjmLPOLDf1TJ-4oA0VicReMi8XOMb9WbFvP5Ndbib-NQkdb2RHEsS2fkUU-MT_KDEJVmibIfUsCaqR8MrOcWRqJ3sXkpAbBz42NTU3-YjiIIUDBzo5RTG9A1O_s0Q1fZeFhQvaiYVeU-wrkZfCWJ542OiPlQF21kaqWMA26BnCnwAvxMHgdYBCrLYT5vhrMUyjB33ZeLu8UxRrwBrHGzkKvV9JrE5K_yOTlSXZL-5Isr';
            }}
          />

          {/* Gradient overlay for top status icons readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

          {/* BEGIN: StatusBar */}
          <div className="absolute top-0 left-0 w-full px-6 pt-3 flex justify-between items-center text-white z-20 text-xs font-semibold tracking-tight">
            <span>9:41</span>
            <div className="flex items-center space-x-1.5 text-sm">
              <Signal className="w-3.5 h-3.5 text-white" />
              <Wifi className="w-3.5 h-3.5 text-white" />
              <BatteryFull className="w-4 h-4 text-white" />
            </div>
          </div>
          {/* END: StatusBar */}

          {/* Top Navigation Action Bar */}
          <div className="absolute top-10 left-0 w-full px-4 flex justify-between items-center z-20 text-white">
            {/* Back Button */}
            <button
              type="button"
              aria-label="Quay lại"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md active:bg-black/50 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* Menu/Options Button */}
            <button
              type="button"
              aria-label="Tùy chọn"
              onClick={() => setShowOptionsSheet(!showOptionsSheet)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md active:bg-black/50 transition cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        {/* END: TopHeroSection */}

        {/* Options Dropdown Sheet */}
        {showOptionsSheet && (
          <div className="absolute top-20 right-4 z-40 bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 w-44 text-xs font-medium animate-scale-in">
            <button
              onClick={() => {
                setShowOptionsSheet(false);
                setIsEditingNote(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <Pencil className="w-3.5 h-3.5 text-gray-500" />
              <span>Chỉnh sửa ghi chú</span>
            </button>
            <button
              onClick={() => {
                setShowOptionsSheet(false);
                setShowDeleteConfirm(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Xóa giao dịch này</span>
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* BEGIN: TransactionContentBody                                */}
        {/* ============================================================ */}
        <div className="flex-1 bg-white -mt-4 rounded-t-3xl relative z-10 px-5 pt-5 pb-6 flex flex-col justify-between">
          <div>
            {/* Category Badge */}
            <div
              className={`inline-flex items-center gap-1.5 ${category.bg} ${category.text} px-3 py-1 rounded-full text-xs font-semibold mb-3`}
            >
              <div
                className={`w-4 h-4 rounded-full ${category.iconBg} flex items-center justify-center text-white text-[10px]`}
              >
                {category.icon}
              </div>
              <span>{category.label}</span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {transaction.title}
            </h1>
            <p className="text-xs text-slate-400 font-normal mt-0.5 mb-2.5">
              {transaction.note || `${transaction.title}, quán quen`}
            </p>

            {/* Big Amount Display */}
            <div className="text-[32px] font-extrabold text-[#E53935] tracking-tight leading-none mb-5">
              -{transaction.amount.toLocaleString('vi-VN')} đ
            </div>

            {/* Transaction Meta Info List */}
            <div className="space-y-3 pb-5 border-b border-slate-100 text-slate-700 text-sm">
              {/* Date and Time */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-xs font-medium text-slate-700">
                  {formattedDate} · {transaction.time || '12:30'}
                </span>
              </div>

              {/* Payment Method */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-slate-400">
                  <Wallet className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-xs font-medium text-slate-700">
                  Ví {transaction.wallet || 'tiền mặt'}
                </span>
              </div>
            </div>

            {/* Notes Section */}
            <div className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xs font-semibold text-slate-900">Ghi chú</h2>
                {!isEditingNote && (
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className="text-[11px] text-[#FF5A1F] hover:underline font-medium"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="mt-1 space-y-2">
                  <textarea
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
                    placeholder="Nhập ghi chú cho giao dịch này..."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F] resize-none"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditedNote(transaction.note || '');
                        setIsEditingNote(false);
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#FF5A1F] text-white shadow-xs"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-normal">
                  {transaction.note || `${transaction.title}, quán quen`}
                </p>
              )}
            </div>

            {/* Attachments & Map Gallery Section */}
            <div className="flex items-center gap-3 mt-1">
              {/* Food Image Thumbnail */}
              <div
                onClick={() => onViewPhoto && onViewPhoto(foodThumbnail)}
                className="w-[72px] h-[72px] rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 shadow-xs cursor-pointer group"
                title="Xem ảnh đính kèm"
              >
                <img
                  alt="Món ăn đính kèm"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  src={foodThumbnail}
                />
              </div>

              {/* Bill Receipt Thumbnail */}
              <div
                onClick={() => onViewPhoto && onViewPhoto(billThumbnail)}
                className="w-[72px] h-[72px] rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 shadow-xs bg-amber-50 cursor-pointer group"
                title="Xem hóa đơn đính kèm"
              >
                <img
                  alt="Hóa đơn đính kèm"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  src={billThumbnail}
                />
              </div>

              {/* Interactive / Map Location Thumbnail */}
              <div
                className="w-[72px] h-[72px] rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 relative bg-[#e5f1f8] shadow-xs flex items-center justify-center cursor-pointer"
                title="Vị trí chi tiêu"
                onClick={() => triggerToast('Vị trí: Quán quen gần bạn')}
              >
                {/* Stylized Map Roads Background */}
                <svg
                  className="absolute inset-0 w-full h-full text-slate-200"
                  fill="none"
                  viewBox="0 0 100 100"
                >
                  <path d="M-10 30 Q40 50 110 20" stroke="#d7e3ec" strokeWidth="8" />
                  <path d="M30 -10 Q50 60 70 110" stroke="#d7e3ec" strokeWidth="8" />
                  <path d="M-10 80 Q60 70 110 90" stroke="#f1f5f9" strokeWidth="5" />
                </svg>
                {/* Map Pin Indicator */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md animate-bounce">
                    <MapPin className="w-3.5 h-3.5 fill-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* BEGIN: BottomActionButtons                                   */}
          {/* ============================================================ */}
          <div className="pt-6 mt-2 grid grid-cols-2 gap-3">
            {/* Edit Action Button */}
            <button
              onClick={() => setIsEditingNote(true)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-slate-800 text-xs font-semibold bg-white active:bg-slate-50 transition cursor-pointer hover:border-slate-300"
              type="button"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-700" />
              <span>Chỉnh sửa</span>
            </button>

            {/* Delete Action Button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-200 text-[#E53935] text-xs font-semibold bg-red-50/40 active:bg-red-50 transition cursor-pointer hover:bg-red-50"
              type="button"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#E53935]" />
              <span>Xóa</span>
            </button>
          </div>
          {/* END: BottomActionButtons */}
        </div>
        {/* END: TransactionContentBody */}

        {/* iOS Home Indicator */}
        <div className="w-full pb-2 pt-1 flex justify-center bg-white shrink-0">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </main>

      {/* ============================================================ */}
      {/* CỬA SỔ NHỎ XÁC NHẬN XÓA CHI TIÊU (Delete Confirmation Dialog) */}
      {/* Rendered via createPortal to mount on topmost document layer */}
      {/* ============================================================ */}
      {showDeleteConfirm &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-5 animate-fade-in select-none"
            onClick={() => setShowDeleteConfirm(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div
              className="w-full max-w-[310px] bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-scale-in relative z-[1000000]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning / Trash Icon Header */}
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#E53935] mb-3.5 shadow-xs">
                <Trash2 className="w-7 h-7 text-[#E53935]" />
              </div>

              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Xóa khoản chi tiêu này?
              </h3>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed px-1">
                Bạn có chắc chắn muốn xóa giao dịch{' '}
                <strong className="text-slate-800 font-semibold">"{transaction.title}"</strong> (
                <span className="text-[#E53935] font-semibold">
                  -{transaction.amount.toLocaleString('vi-VN')} đ
                </span>
                )? Hành động này không thể hoàn tác.
              </p>

              {/* Confirmation Buttons */}
              <div className="w-full mt-6 space-y-2">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full py-3 px-4 bg-[#E53935] hover:bg-red-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xác nhận xóa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
