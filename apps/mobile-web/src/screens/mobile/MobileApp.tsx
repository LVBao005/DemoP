import React, { useState } from 'react';
import {
  Home,
  Camera,
  BarChart3,
  ReceiptText,
  User as UserIcon,
  Flame,
  X,
  Bell,
  Wallet,
  Plus,
  Zap,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';

import { MobileHomeScreen } from './MobileHomeScreen';
import { MobileCameraScreen } from './MobileCameraScreen';
import { MobileMomentsScreen } from './MobileMomentsScreen';
import { MobileAnalyticsScreen } from './MobileAnalyticsScreen';
import { MobileWalletsScreen } from './MobileWalletsScreen';
import { MobileCategoriesScreen } from './MobileCategoriesScreen';
import { MobileProfileScreen } from './MobileProfileScreen';
import { MobileQuickSaveModal } from './MobileQuickSaveModal';
import { MobileAddExpenseModal } from './MobileAddExpenseModal';
import { MobileTransactionDetailModal } from './MobileTransactionDetailModal';

export type MobileTabKey =
  | 'home'
  | 'camera'
  | 'moments'
  | 'analytics'
  | 'wallets'
  | 'categories'
  | 'profile';

interface MobileAppProps {
  onToggleDesktopView?: () => void;
  isInsideDeviceFrame?: boolean;
}

export const MobileApp: React.FC<MobileAppProps> = ({
  onToggleDesktopView,
  isInsideDeviceFrame = false,
}) => {
  const { user, addTransaction, deleteTransaction, language } = useApp();
  const isVi = language === 'vi';

  const [activeTab, setActiveTab] = useState<MobileTabKey>('home');
  const [isQuickSaveOpen, setIsQuickSaveOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [viewingPhotoUrl, setViewingPhotoUrl] = useState<string | null>(null);

  // If user opens camera full screen
  if (activeTab === 'camera') {
    return (
      <div className="relative w-full h-full min-h-[640px] bg-black">
        <MobileCameraScreen
          onBack={() => setActiveTab('home')}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSaveMoment={(moment) => {
            addTransaction({
              title: moment.title,
              amount: moment.amount,
              type: 'expense',
              categoryId:
                moment.category === 'Ẩm thực'
                  ? 'food'
                  : moment.category === 'Cà phê'
                  ? 'food'
                  : moment.category === 'Mua sắm'
                  ? 'shopping'
                  : moment.category === 'Di chuyển'
                  ? 'transport'
                  : 'activities',
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              photoUrl: moment.photoUrl,
              note: moment.note,
              wallet: 'Tiền mặt',
              mood: '📸 Khoảnh khắc',
            });
            setActiveTab('moments');
          }}
        />
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <MobileHomeScreen
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenQuickSave={() => setIsQuickSaveOpen(true)}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            onViewPhoto={(url) => setViewingPhotoUrl(url)}
          />
        );
      case 'moments':
        return (
          <MobileMomentsScreen
            onOpenCamera={() => setActiveTab('camera')}
            onViewPhoto={(url) => setViewingPhotoUrl(url)}
            onSelectTransaction={(tx) => setSelectedTransaction(tx)}
          />
        );
      case 'analytics':
        return <MobileAnalyticsScreen />;
      case 'wallets':
        return <MobileWalletsScreen />;
      case 'categories':
        return <MobileCategoriesScreen />;
      case 'profile':
        return (
          <MobileProfileScreen
            onBack={() => setActiveTab('home')}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />
        );
      default:
        return (
          <MobileHomeScreen
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenQuickSave={() => setIsQuickSaveOpen(true)}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            onViewPhoto={(url) => setViewingPhotoUrl(url)}
          />
        );
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-white text-slate-900 flex flex-col font-sans select-none overflow-x-hidden">
      {/* ============================================================ */}
      {/* 1. TOP HEADER (Only shown on tabs that don't have their own navigation bar) */}
      {/* ============================================================ */}
      {activeTab !== 'home' &&
        activeTab !== 'profile' &&
        activeTab !== 'analytics' &&
        activeTab !== 'wallets' && (
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-2.5 flex items-center justify-between shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 text-gray-700 hover:text-emerald-800 font-bold text-xs active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isVi ? 'Trang chủ' : 'Home'}</span>
          </button>

          <span className="font-bold text-sm text-gray-900 capitalize">
            {activeTab === 'categories'
              ? isVi
                ? 'Hạn mức chi'
                : 'Budgets'
              : isVi
              ? 'Nhật ký ảnh'
              : 'Moments'}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('profile')}
              className="w-7 h-7 rounded-full overflow-hidden border border-emerald-500 shadow-xs"
            >
              <img
                src={
                  user?.avatarUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuB83BoDsYYhiLXb84iFSwpr4E7F2-_uh1RH7qlOCfyzpxQJqxmI1FjJZc66FWYZ-jPYuFU3w7r2Qdj3b32erTbAMliUfGLyBmsW1PF79rD7h2Axwaqc30I_gfXFP5pyLcZ4UgfCQrpGPlHuBQ4r6YnLpa2XpFFWa7XIBYlWFCENfaa08c021dEnJP0O4zdHoaHbqq1dG1jPXua9Kefx7dDM6WGuQ1svrGej1GhH3ogxeciGloWA4JSx'
                }
                alt="User"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </header>
      )}

      {/* ============================================================ */}
      {/* 2. ACTIVE SCREEN CONTENT                                     */}
      {/* ============================================================ */}
      <main className="flex-1 w-full max-w-lg mx-auto">{renderActiveScreen()}</main>

      {/* ============================================================ */}
      {/* 3. SIGNATURE BOTTOM NAVIGATION BAR (Matches HTML exactly)    */}
      {/* ============================================================ */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto bg-white border-t border-slate-100 py-2 px-6"
        data-purpose="bottom-navigation"
      >
        <div className="flex justify-between items-center relative">
          {/* Tab: 1. Trang chủ */}
          <button
            type="button"
            aria-label="Trang chủ"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
              activeTab === 'home'
                ? 'text-emerald-600 font-semibold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Home className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] leading-none">
              {isVi ? 'Trang chủ' : 'Home'}
            </span>
          </button>

          {/* Tab: 2. Thống kê */}
          <button
            type="button"
            aria-label="Thống kê"
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
              activeTab === 'analytics'
                ? 'text-emerald-600 font-semibold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <BarChart3 className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] leading-none">
              {isVi ? 'Thống kê' : 'Analytics'}
            </span>
          </button>

          {/* Tab: 3. Camera Action Button (Viền trắng, chỉ để chụp ảnh) */}
          <div className="relative -top-3">
            <button
              type="button"
              aria-label="Chụp ảnh chi tiêu"
              onClick={() => setActiveTab('camera')}
              className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl shadow-slate-900/25 border-4 border-white active:scale-95 transition-all cursor-pointer hover:bg-slate-800"
            >
              <Camera className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          {/* Tab: 4. Ví (Active Tab) */}
          <button
            type="button"
            aria-label="Ví"
            onClick={() => setActiveTab('wallets')}
            className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
              activeTab === 'wallets'
                ? 'text-emerald-600 font-semibold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Wallet className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] leading-none">
              {isVi ? 'Ví' : 'Wallets'}
            </span>
          </button>

          {/* Tab: 5. Cá nhân */}
          <button
            type="button"
            aria-label="Cá nhân"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
              activeTab === 'profile'
                ? 'text-emerald-600 font-semibold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <UserIcon className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] leading-none">
              {isVi ? 'Cá nhân' : 'Profile'}
            </span>
          </button>
        </div>

        {/* Home Indicator bar (iOS) */}
        <div className="w-32 h-1 bg-slate-900 rounded-full mx-auto mt-2 mb-0.5" />
      </nav>

      {/* ============================================================ */}
      {/* 4. PLUS POPUP MENU SHEET (When clicking center +)           */}
      {/* ============================================================ */}
      {isPlusMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3 mb-16 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">
                {isVi ? 'Thêm mới chi tiêu' : 'Add New Expense'}
              </h3>
              <button
                onClick={() => setIsPlusMenuOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setIsPlusMenuOpen(false);
                  setIsAddExpenseOpen(true);
                }}
                className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex flex-col items-center gap-1.5 transition-all text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                  <Plus className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="text-xs font-bold">
                  {isVi ? 'Nhập tiền' : 'Manual'}
                </span>
              </button>

              <button
                onClick={() => {
                  setIsPlusMenuOpen(false);
                  setActiveTab('camera');
                }}
                className="p-3 rounded-2xl bg-rose-50 text-rose-800 hover:bg-rose-100 flex flex-col items-center gap-1.5 transition-all text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                  <Camera className="w-5 h-5 text-rose-600" />
                </div>
                <span className="text-xs font-bold">
                  {isVi ? 'Chụp ảnh' : 'Snap'}
                </span>
              </button>

              <button
                onClick={() => {
                  setIsPlusMenuOpen(false);
                  setIsQuickSaveOpen(true);
                }}
                className="p-3 rounded-2xl bg-amber-50 text-amber-800 hover:bg-amber-100 flex flex-col items-center gap-1.5 transition-all text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                  <Zap className="w-5 h-5 text-amber-600 fill-amber-500" />
                </div>
                <span className="text-xs font-bold">
                  {isVi ? 'Lưu nhanh' : 'Quick Save'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODALS & POPUPS                                           */}
      {/* ============================================================ */}

      {/* Quick Save Modal */}
      <MobileQuickSaveModal
        isOpen={isQuickSaveOpen}
        onClose={() => setIsQuickSaveOpen(false)}
        onSave={(amt, cat, note) => {
          addTransaction({
            title: cat,
            amount: amt,
            type: 'expense',
            categoryId:
              cat === 'Ăn uống' || cat === 'Ăn sáng' || cat === 'Ăn trưa' || cat === 'Cà phê' || cat === 'Trà sữa'
                ? 'food'
                : cat === 'Đổ xăng'
                ? 'transport'
                : 'activities',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            note,
            wallet: 'Tiền mặt',
            mood: '⚡ Lưu nhanh',
          });
        }}
      />

      {/* Full Numpad Add Expense Modal */}
      <MobileAddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSave={(data) => {
          addTransaction({
            title: data.title || 'Chi tiêu mới',
            amount: data.amount,
            type: 'expense',
            categoryId: data.categoryId,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            wallet: data.wallet,
            note: data.note,
            photoUrl: data.photoUrl,
          });
        }}
        onOpenCamera={() => {
          setIsAddExpenseOpen(false);
          setActiveTab('camera');
        }}
      />

      {/* Transaction Detail & Delete Modal */}
      {selectedTransaction && (
        <MobileTransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onDelete={(id) => {
            deleteTransaction(id);
            setSelectedTransaction(null);
          }}
          onViewPhoto={(url) => setViewingPhotoUrl(url)}
        />
      )}

      {/* Fullscreen Photo Lightbox View */}
      {viewingPhotoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setViewingPhotoUrl(null)}
        >
          <button
            onClick={() => setViewingPhotoUrl(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-sm w-full max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <img
              src={viewingPhotoUrl}
              alt="Hóa đơn / Khoảnh khắc chi tiêu"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-white/70 text-xs mt-4">
            {isVi ? 'Chạm bất kỳ đâu để đóng ảnh' : 'Tap anywhere to close'}
          </p>
        </div>
      )}
    </div>
  );
};
