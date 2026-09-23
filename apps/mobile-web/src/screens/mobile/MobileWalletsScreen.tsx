import React, { useState } from 'react';
import {
  Plus,
  Eye,
  EyeOff,
  ChevronRight,
  X,
  CreditCard,
  Building2,
  Wallet as WalletIcon,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface WalletItem {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'e-wallet' | 'savings';
  balance: number;
  bankName?: string;
}

const INITIAL_WALLETS: WalletItem[] = [
  {
    id: 'w1',
    name: 'Tiền mặt',
    type: 'cash',
    balance: 2500000,
  },
  {
    id: 'w2',
    name: 'Ngân hàng (Vietcombank)',
    type: 'bank',
    balance: 9950000,
    bankName: 'Vietcombank',
  },
];

export const MobileWalletsScreen: React.FC = () => {
  const { transactions } = useApp();

  const [wallets, setWallets] = useState<WalletItem[]>(() => {
    const saved = localStorage.getItem('monett_wallets_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        /* ignore */
      }
    }
    return INITIAL_WALLETS;
  });

  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletBalance, setNewWalletBalance] = useState('');
  const [newWalletType, setNewWalletType] = useState<'cash' | 'bank' | 'e-wallet' | 'savings'>('bank');

  // Compute total balance
  const totalBalance = wallets.reduce((acc, cur) => acc + cur.balance, 0);

  // Compute income and expenses from transactions (or use clean default benchmarks if empty)
  const incomeTx = transactions.filter((t) => t.type === 'income');
  const expenseTx = transactions.filter((t) => t.type === 'expense');

  const totalIncome = incomeTx.length > 0
    ? incomeTx.reduce((sum, t) => sum + t.amount, 0)
    : 8200000;

  const totalExpense = expenseTx.length > 0
    ? expenseTx.reduce((sum, t) => sum + t.amount, 0)
    : 4750000;

  const saveWallets = (updated: WalletItem[]) => {
    setWallets(updated);
    try {
      localStorage.setItem('monett_wallets_v2', JSON.stringify(updated));
    } catch (e) {
      /* ignore */
    }
  };

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const balanceNum = parseInt(newWalletBalance.replace(/[^0-9]/g, ''), 10);
    if (!newWalletName.trim() || isNaN(balanceNum)) return;

    const newW: WalletItem = {
      id: 'w_' + Date.now(),
      name: newWalletName.trim(),
      type: newWalletType,
      balance: balanceNum,
    };

    saveWallets([...wallets, newW]);
    setShowAddModal(false);
    setNewWalletName('');
    setNewWalletBalance('');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white text-slate-800 font-sans select-none relative overflow-hidden">
      {/* ============================================================ */}
      {/* BEGIN: iOSStatusBar                                          */}
      {/* ============================================================ */}
      <header
        className="w-full pt-3 px-7 pb-1 flex justify-between items-center text-slate-900 z-30 select-none shrink-0"
        data-purpose="status-bar"
      >
        {/* Time Display */}
        <span className="text-[15px] font-semibold tracking-tight">9:41</span>

        {/* Dynamic Island / Speaker cutout simulation */}
        <div className="w-28 h-4 bg-transparent rounded-full hidden sm:block" />

        {/* Status Bar Icons (Cellular, Wifi, Battery) */}
        <div className="flex items-center space-x-1.5 text-slate-800">
          {/* Cellular Signal Icon */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M2 17h3v4H2v-4zm6-5h3v9H8v-9zm6-5h3v14h-3V7zm6-5h3v19h-3V2z" />
          </svg>
          {/* Wifi Icon */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.78 0 7.22 1.44 9.8 3.82L12 19.12 2.2 11.32C4.78 8.94 8.22 7.5 12 7.5z" />
          </svg>
          {/* Battery Icon */}
          <div className="w-6 h-3 border border-slate-800 rounded-[3px] p-0.5 flex items-center relative">
            <div className="h-full w-4/5 bg-slate-800 rounded-[1px]" />
            <div className="w-0.5 h-1.5 bg-slate-800 absolute -right-1 top-0.5 rounded-r-xs" />
          </div>
        </div>
      </header>
      {/* END: iOSStatusBar */}

      {/* ============================================================ */}
      {/* BEGIN: ScreenNavigationHeader                                */}
      {/* ============================================================ */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between shrink-0" data-purpose="navigation-bar">
        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ví của tôi</h1>
        {/* Add Button */}
        <button
          aria-label="Thêm ví mới"
          onClick={() => setShowAddModal(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-gray-100 active:scale-95 transition cursor-pointer"
          type="button"
        >
          <Plus className="w-6 h-6 stroke-[2.2]" />
        </button>
      </div>
      {/* END: ScreenNavigationHeader */}

      {/* ============================================================ */}
      {/* BEGIN: MainContentScrollArea                                 */}
      {/* ============================================================ */}
      <div
        className="flex-1 overflow-y-auto px-5 pb-24 space-y-5 hide-scrollbar"
        data-purpose="content-scroll"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* BEGIN: TotalBalanceCard */}
        <section
          className="w-full bg-[#0F172A] rounded-2xl p-4 text-white shadow-md relative overflow-hidden"
          data-purpose="total-balance-card"
        >
          {/* Top row: Label & Visibility Toggle */}
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium tracking-wide">Tổng số dư</span>
            <button
              aria-label="Ẩn hiện số dư"
              onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              className="text-slate-400 hover:text-slate-200 transition cursor-pointer p-0.5"
              type="button"
            >
              {isBalanceHidden ? (
                <EyeOff className="w-4 h-4 stroke-[2]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[2]" />
              )}
            </button>
          </div>

          {/* Big Balance Number */}
          <div className="text-[26px] font-bold tracking-tight text-white mb-4">
            {isBalanceHidden ? '•••••••• đ' : `${totalBalance.toLocaleString('vi-VN')} đ`}
          </div>

          {/* Income & Expense Sub-badges inside Card */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/60">
            {/* Income Summary */}
            <div className="flex items-center space-x-2 bg-slate-800/60 rounded-xl px-2.5 py-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ArrowDownLeft className="w-3 h-3 stroke-[2.5]" />
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 leading-tight">Tiền thu</span>
                <span className="text-xs font-semibold text-emerald-400 leading-tight">
                  {isBalanceHidden ? '••••••' : `${totalIncome.toLocaleString('vi-VN')} đ`}
                </span>
              </div>
            </div>

            {/* Expense Summary */}
            <div className="flex items-center space-x-2 bg-slate-800/60 rounded-xl px-2.5 py-1.5">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 leading-tight">Tiền chi</span>
                <span className="text-xs font-semibold text-rose-400 leading-tight">
                  {isBalanceHidden ? '••••••' : `${totalExpense.toLocaleString('vi-VN')} đ`}
                </span>
              </div>
            </div>
          </div>
        </section>
        {/* END: TotalBalanceCard */}

        {/* BEGIN: AccountsAndWalletsList */}
        <section className="space-y-3" data-purpose="accounts-and-wallets">
          {/* Section Title */}
          <h2 className="text-sm font-semibold text-slate-800">Tài khoản & ví</h2>

          {/* Wallet Items Container */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {wallets.map((wallet) => {
              const isBank = wallet.type === 'bank';
              return (
                <div
                  key={wallet.id}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    {/* Icon container */}
                    <div
                      className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-xs ${
                        isBank ? 'bg-sky-500' : 'bg-emerald-500'
                      }`}
                    >
                      {isBank ? (
                        <Building2 className="w-5 h-5 stroke-[2]" />
                      ) : (
                        <WalletIcon className="w-5 h-5 stroke-[2]" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{wallet.name}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-semibold text-slate-900">
                      {isBalanceHidden ? '•••••• đ' : `${wallet.balance.toLocaleString('vi-VN')} đ`}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Wallet Button (Dotted outline) */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-3.5 border-2 border-dashed border-emerald-400 hover:border-emerald-500 rounded-2xl flex items-center justify-center space-x-2 text-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 active:scale-[0.99] transition font-medium text-sm cursor-pointer"
            type="button"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm ví/tài khoản</span>
          </button>
        </section>
        {/* END: AccountsAndWalletsList */}

        {/* BEGIN: PromotionalIllustration */}
        <section className="pt-2 flex flex-col items-center justify-center text-center px-4" data-purpose="smart-wallet-promo">
          {/* Wallet Art Graphic */}
          <div className="relative w-20 h-20 mb-2 flex items-center justify-center">
            {/* Sparkle Top Right */}
            <svg
              className="w-4 h-4 text-emerald-400 absolute top-1 right-2 animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>

            {/* Sparkle Bottom Left */}
            <svg
              className="w-2.5 h-2.5 text-emerald-300 absolute bottom-3 left-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>

            {/* Illustrated Wallet Container */}
            <div className="w-14 h-11 bg-emerald-400 rounded-xl shadow-md border-2 border-white flex items-center justify-center relative">
              <div className="w-10 h-7 bg-emerald-500 rounded-lg flex items-center justify-end pr-1 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
              </div>
              {/* Coin Accent */}
              <div className="absolute -top-1 left-2 w-4 h-4 rounded-full bg-amber-300 border-2 border-white shadow-xs" />
            </div>
          </div>

          <h3 className="text-sm font-semibold text-slate-800 mb-1">Quản lý ví thông minh</h3>
          <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
            Theo dõi tất cả tài khoản của bạn trong một nơi.
          </p>
        </section>
        {/* END: PromotionalIllustration */}
      </div>
      {/* END: MainContentScrollArea */}

      {/* ============================================================ */}
      {/* MODAL: Thêm ví / tài khoản mới                               */}
      {/* ============================================================ */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Thêm ví / tài khoản mới</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWallet} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Tên ví / ngân hàng
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: MB Bank, Tiền mặt..."
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Số dư ban đầu (đ)
                </label>
                <input
                  type="number"
                  placeholder="1000000"
                  value={newWalletBalance}
                  onChange={(e) => setNewWalletBalance(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Loại tài khoản
                </label>
                <select
                  value={newWalletType}
                  onChange={(e) => setNewWalletType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="bank">Ngân hàng</option>
                  <option value="cash">Tiền mặt</option>
                  <option value="e-wallet">Ví điện tử</option>
                  <option value="savings">Sổ tiết kiệm</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 cursor-pointer"
                >
                  Lưu ví
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
