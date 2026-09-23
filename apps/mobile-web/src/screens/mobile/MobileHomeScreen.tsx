import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  ArrowDown,
  ChevronRight,
  Camera,
  Plus,
  Zap,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
import { MonettLogo } from '../components/MonettLogo';

interface MobileHomeScreenProps {
  onNavigateTab: (tab: 'home' | 'camera' | 'moments' | 'analytics' | 'wallets' | 'categories' | 'profile') => void;
  onOpenQuickSave: () => void;
  onOpenAddExpense: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onViewPhoto: (url: string) => void;
}

// Days of week corresponding to the HTML design
const WEEK_DAYS = [
  {
    day: 'T2',
    date: '9/9',
    amount: '85k',
    num: 85000,
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=100&auto=format&fit=crop&q=80',
    title: 'Phở bò tái lăn',
  },
  {
    day: 'T3',
    date: '10/9',
    amount: '45k',
    num: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&auto=format&fit=crop&q=80',
    title: 'Cà phê muối',
  },
  {
    day: 'T4',
    date: '11/9',
    amount: '320k',
    num: 320000,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80',
    title: 'Siêu thị cuối tuần',
  },
  {
    day: 'T5',
    date: '12/9',
    amount: '150k',
    num: 150000,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=80',
    title: 'Pizza nướng củi',
  },
  {
    day: 'T6',
    date: '13/9',
    amount: '65k',
    num: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=100&auto=format&fit=crop&q=80',
    title: 'Trà sen vàng',
  },
  {
    day: 'T7',
    date: '14/9',
    amount: '120k',
    num: 120000,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&auto=format&fit=crop&q=80',
    title: 'Bánh ngọt & brunch',
  },
  {
    day: 'CN',
    date: '15/9',
    amount: '185k',
    num: 185000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz7Og1t0m1z9K_RGwF9SXVJzomEb6aBXeI4XhTIK2PDnmqwOSyo5r1W14xu1YwLq7B3qoEQMBl8BibYeTlDKGaJu2Y7LvAKWehNI-_EeA0HK7b3HqLI8TMVKgxpMoOZ1Pe1KCzygItXTMC4gXn_7oMQpzThYHUrknycrgQea0WDJA-l16mvxtxo8pOEtI3-NQChGQU0CYQj-TioonQmI9sI2arOWCoF28D6gW_rjA03CywtuVcIeoW',
    isToday: true,
    title: 'Bún bò Huế & Cafe',
  },
];

const DEFAULT_TODAY_ITEMS = [
  {
    id: 'html_1',
    title: 'Bún bò Huế',
    amount: 85000,
    time: '12:30',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz7Og1t0m1z9K_RGwF9SXVJzomEb6aBXeI4XhTIK2PDnmqwOSyo5r1W14xu1YwLq7B3qoEQMBl8BibYeTlDKGaJu2Y7LvAKWehNI-_EeA0HK7b3HqLI8TMVKgxpMoOZ1Pe1KCzygItXTMC4gXn_7oMQpzThYHUrknycrgQea0WDJA-l16mvxtxo8pOEtI3-NQChGQU0CYQj-TioonQmI9sI2arOWCoF28D6gW_rjA03CywtuVcIeoW',
    categoryId: 'food',
    type: 'expense' as const,
    date: '2026-09-15',
    wallet: 'Tiền mặt',
  },
  {
    id: 'html_2',
    title: 'Cà phê',
    amount: 45000,
    time: '10:15',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrO8vRBFSVc2dkca-rgxi0JQV3Sz8lPpepEQoPYsvW_VjYVRy68LNwo55X7wpEMj-_Blprw0NLfoQtl22J_w58jMEqBFtocf_Qqef8S0hkGSeQdIBcFWKhXqP5uj0yRySTlFurbFSOu91TvtuVZjJq1q3_rWLr-LIsTPnWWwAE7jj-CUJALxyX9g-r_o-NxQwIfZVoMn-w-vWLwU_juOZo_SCzpCx4RwxMlkpz4V5H-0ePXByhCMWv',
    categoryId: 'food',
    type: 'expense' as const,
    date: '2026-09-15',
    wallet: 'MoMo',
  },
  {
    id: 'html_3',
    title: 'Xăng xe',
    amount: 55000,
    time: '08:20',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBucZxCmCFEzb_r08Te0gvFCCspEnEVC_GCGe8mgAwYZetoBnF6hn98mmAZDoJ_VVpuQM3Qlbufe0xEvnX5lIpXoVH_zY2jTsrXnVfBomrjQLtvvDQ8t93IYfzmcCgL0sz-RXGbOrCPlAbO4PGSd8vJ9IrrDb3m_rY2y7MppJvJNRyZqcaHIb9bpJxGmosOY8RDGDUoy3-Os4P3QI4WjzrdtS53oIzp-CnzkSmb0wO0Vvb8ORUI8c0d',
    categoryId: 'transport',
    type: 'expense' as const,
    date: '2026-09-15',
    wallet: 'Tiền mặt',
  },
];

export const MobileHomeScreen: React.FC<MobileHomeScreenProps> = ({
  onNavigateTab,
  onOpenQuickSave,
  onOpenAddExpense,
  onSelectTransaction,
  onViewPhoto,
}) => {
  const { user, transactions, language } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('CN');
  const [hasNotification, setHasNotification] = useState(true);

  const isVi = language === 'vi';
  // User name in HTML is "Bảo"
  const firstName = user?.fullName?.split(' ').pop() || 'Bảo';

  // Merge today transactions with dynamic state
  const realTodayExpenses = transactions.filter((t) => t.type === 'expense');
  const displayItems = realTodayExpenses.length > 0 ? realTodayExpenses : DEFAULT_TODAY_ITEMS;

  // Calculate today's total
  const todayTotal = displayItems.reduce((acc, cur) => acc + cur.amount, 0);

  // Active banner image
  const bannerImage =
    displayItems[0]?.photoUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAjRPNtBd1I8RMVGIeJcfBoVExsIeAfCMCXSUmTF8qsr1CzBWi8aZm97yG7uDuUbe_wyorSwHvxdCHmTb4Mf6ot90iJLmym8bW5yFybhKeg5OOlNpsVP7HaBlZNVv9IAC8SooAvmD_XtKQxs_huWdObM_tktcuavw1KBXqGOfcJm6XwI7n49L1lShvWzmKNFhftZpeAqgyoxcF07BYdpyi4J9GHVpE4r1019tG8xQqOzntcVginXdXF';

  return (
    <div className="w-full pb-24 px-4 font-sans select-none">
      {/* ============================================================ */}
      {/* BEGIN: HeaderNav (Monett Brand Logo)                          */}
      {/* ============================================================ */}
      <section className="flex items-center justify-between mt-2.5 mb-3" data-purpose="brand-bar">
        {/* Logo Monett */}
        <div
          className="flex items-center cursor-pointer transition-transform active:scale-95"
          onClick={() => onNavigateTab('home')}
          title="Monett - Money Moments"
        >
          <MonettLogo className="h-9 w-auto" size={132} />
        </div>

        {/* Notification & User Avatar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Thông báo"
            onClick={() => setHasNotification(!hasNotification)}
            className="relative text-gray-600 hover:text-gray-800 p-1 transition-colors active:scale-95"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {hasNotification && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('profile')}
            className="focus:outline-none"
          >
            <img
              alt={`Avatar ${firstName}`}
              className="w-8 h-8 rounded-full object-cover border border-emerald-500 shadow-sm active:scale-95 transition-transform"
              src={
                user?.avatarUrl ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuB83BoDsYYhiLXb84iFSwpr4E7F2-_uh1RH7qlOCfyzpxQJqxmI1FjJZc66FWYZ-jPYuFU3w7r2Qdj3b32erTbAMliUfGLyBmsW1PF79rD7h2Axwaqc30I_gfXFP5pyLcZ4UgfCQrpGPlHuBQ4r6YnLpa2XpFFWa7XIBYlWFCENfaa08c021dEnJP0O4zdHoaHbqq1dG1jPXua9Kefx7dDM6WGuQ1svrGej1GhH3ogxeciGloWA4JSx'
              }
            />
          </button>
        </div>
      </section>
      {/* END: HeaderNav */}

      {/* ============================================================ */}
      {/* BEGIN: GreetingSection (Matches HTML exactly)                */}
      {/* ============================================================ */}
      <section className="mb-3.5" data-purpose="greeting">
        <p className="text-xs font-normal text-gray-500">
          {isVi ? 'Chào buổi sáng,' : 'Good morning,'}
        </p>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1.5">
          {firstName} <span className="text-xl">👋</span>
        </h1>
      </section>
      {/* END: GreetingSection */}

      {/* ============================================================ */}
      {/* BEGIN: DailyExpenseBanner (Signature emerald card in HTML)   */}
      {/* ============================================================ */}
      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d3b37] via-[#104b45] to-[#145a53] p-4 text-white shadow-md mb-5 cursor-pointer active:scale-[0.99] transition-transform"
        data-purpose="summary-card"
        onClick={onOpenAddExpense}
      >
        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-200">
              <Calendar className="w-3 h-3 text-[11px]" />
              <span className="font-medium">
                {isVi ? 'Hôm nay, 15/09' : 'Today, Sep 15'}
              </span>
            </div>
            <p className="text-xs text-gray-300 font-light">
              {isVi ? 'Bạn đã chi' : 'You spent'}
            </p>
            <p className="text-2xl font-bold tracking-tight">
              {todayTotal.toLocaleString('vi-VN')} đ
            </p>
            <div className="inline-flex items-center gap-1 bg-[#1a645d] text-emerald-200 text-[11px] font-medium px-2 py-0.5 rounded-full mt-1">
              <ArrowDown className="w-2.5 h-2.5" />
              <span>{isVi ? '12% so với hôm qua' : '12% vs yesterday'}</span>
            </div>
          </div>

          {/* Thumbnail minh hoạ đồ ăn trong card */}
          <div
            className="w-20 h-20 rounded-xl overflow-hidden shadow-inner border border-white/10 shrink-0 relative group"
            onClick={(e) => {
              e.stopPropagation();
              onViewPhoto(bannerImage);
            }}
          >
            <img
              alt="Bữa ăn hôm nay"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              src={bannerImage}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </section>
      {/* END: DailyExpenseBanner */}

      {/* ============================================================ */}
      {/* BEGIN: WeeklyOverviewSection (Matches HTML TUẦN NÀY)          */}
      {/* ============================================================ */}
      <section className="mb-5" data-purpose="weekly-overview">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-gray-900 tracking-wider">
            {isVi ? 'TUẦN NÀY' : 'THIS WEEK'}
          </h2>
          <button
            type="button"
            onClick={() => onNavigateTab('analytics')}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
          >
            <span>{isVi ? 'Xem tất cả' : 'View all'}</span>
            <ChevronRight className="w-3 h-3 text-[9px] ml-0.5" />
          </button>
        </div>

        {/* Weekly mini bar chart / cards */}
        <div className="grid grid-cols-7 gap-1.5 bg-gray-50/80 p-2.5 rounded-2xl border border-gray-100">
          {WEEK_DAYS.map((day) => {
            const isSelected = selectedDay === day.day;
            const isToday = day.isToday;

            return (
              <button
                key={day.day}
                type="button"
                onClick={() => setSelectedDay(day.day)}
                className={`flex flex-col items-center rounded-xl transition-all ${
                  isToday || isSelected
                    ? 'bg-emerald-50 py-1 px-1 border border-emerald-200 shadow-sm'
                    : 'py-0.5'
                }`}
              >
                <span
                  className={`text-[10px] ${
                    isToday || isSelected
                      ? 'font-bold text-emerald-800'
                      : 'font-medium text-gray-500'
                  }`}
                >
                  {day.day}
                </span>
                <span
                  className={`text-[9px] mb-1.5 ${
                    isToday || isSelected
                      ? 'text-emerald-600 font-medium'
                      : 'text-gray-400'
                  }`}
                >
                  {day.date}
                </span>

                <div
                  className={`w-full h-12 rounded-lg overflow-hidden shadow-sm border ${
                    isToday || isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-200'
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    alt={day.day}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                    src={day.imageUrl}
                  />
                </div>

                <span
                  className={`text-[10px] mt-1.5 ${
                    isToday || isSelected
                      ? 'font-bold text-emerald-900'
                      : 'font-semibold text-gray-700'
                  }`}
                >
                  {day.amount}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      {/* END: WeeklyOverviewSection */}

      {/* ============================================================ */}
      {/* BEGIN: TodayExpensesSection (Horizontal scrolling cards)     */}
      {/* ============================================================ */}
      <section className="mb-4" data-purpose="today-expense-list">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-gray-900 tracking-wider">
            {isVi ? 'HÔM NAY' : 'TODAY'}
          </h2>
          <button
            type="button"
            onClick={() => onNavigateTab('moments')}
            className="text-xs font-medium text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
          >
            <span>{isVi ? 'Xem tất cả' : 'View all'}</span>
            <ChevronRight className="w-3 h-3 text-[9px] ml-0.5" />
          </button>
        </div>

        {/* Danh sách giao dịch dạng thẻ ngang cuộn ngang */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 scrollbar-none">
          {displayItems.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectTransaction(item)}
              className="w-28 shrink-0 bg-white border border-gray-150 rounded-2xl p-2 shadow-sm flex flex-col cursor-pointer active:scale-95 transition-all hover:border-emerald-300"
              data-purpose="expense-item"
            >
              <div
                className="relative w-full h-16 rounded-xl overflow-hidden mb-2 bg-slate-100"
                onClick={(e) => {
                  if (item.photoUrl) {
                    e.stopPropagation();
                    onViewPhoto(item.photoUrl);
                  }
                }}
              >
                <img
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                  src={
                    item.photoUrl ||
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBz7Og1t0m1z9K_RGwF9SXVJzomEb6aBXeI4XhTIK2PDnmqwOSyo5r1W14xu1YwLq7B3qoEQMBl8BibYeTlDKGaJu2Y7LvAKWehNI-_EeA0HK7b3HqLI8TMVKgxpMoOZ1Pe1KCzygItXTMC4gXn_7oMQpzThYHUrknycrgQea0WDJA-l16mvxtxo8pOEtI3-NQChGQU0CYQj-TioonQmI9sI2arOWCoF28D6gW_rjA03CywtuVcIeoW'
                  }
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              <span className="text-xs font-semibold text-gray-900 truncate">
                {item.title}
              </span>
              <span className="text-xs font-bold text-rose-500 mt-0.5">
                -{item.amount.toLocaleString('vi-VN')} đ
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 font-normal">
                {item.time || '12:30'}
              </span>
            </article>
          ))}
        </div>

        {/* Tổng hôm nay */}
        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-100 px-1">
          <span className="text-xs text-gray-500 font-medium">
            {isVi ? 'Tổng hôm nay' : "Today's total"}
          </span>
          <span className="text-sm font-bold text-rose-500">
            -{todayTotal.toLocaleString('vi-VN')} đ
          </span>
        </div>
      </section>
      {/* END: TodayExpensesSection */}

    </div>
  );
};
