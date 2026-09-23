import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowDown, ArrowUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileAnalyticsScreen: React.FC = () => {
  const { transactions, language } = useApp();
  const isVi = language === 'vi';

  const [periodTab, setPeriodTab] = useState<'week' | 'month' | 'year'>('week');
  const [weekOffset, setWeekOffset] = useState(0);

  // Dynamic calculations or fallback realistic defaults
  const realExpenses = transactions.filter((t) => t.type === 'expense');
  const realTotalExpense = realExpenses.reduce((acc, cur) => acc + cur.amount, 0);

  // If user has expenses, calculate or blend with the sample 4.720.000 đ
  const displayTotalExpense = realTotalExpense > 0 ? realTotalExpense : 4720000;
  const displayTotalIncome = 1200000;

  // Date range display
  const dateRangeText =
    periodTab === 'week'
      ? weekOffset === 0
        ? '09/09 - 15/09/2026'
        : weekOffset === -1
        ? '02/09 - 08/09/2026'
        : '16/09 - 22/09/2026'
      : periodTab === 'month'
      ? 'Tháng 09 / 2026'
      : 'Năm 2026';

  // Categories list exactly matching HTML template
  const categoriesData = [
    {
      name: isVi ? 'Ăn uống' : 'Dining',
      color: '#FF7A00',
      percent: 36,
      amount: Math.round(displayTotalExpense * 0.36),
    },
    {
      name: isVi ? 'Nhà ở' : 'Housing',
      color: '#0284C7',
      percent: 25,
      amount: Math.round(displayTotalExpense * 0.25),
    },
    {
      name: isVi ? 'Đi lại' : 'Transport',
      color: '#10B981',
      percent: 14,
      amount: Math.round(displayTotalExpense * 0.14),
    },
    {
      name: isVi ? 'Giải trí' : 'Entertainment',
      color: '#7C3AED',
      percent: 11,
      amount: Math.round(displayTotalExpense * 0.11),
    },
    {
      name: isVi ? 'Khác' : 'Others',
      color: '#22C55E',
      percent: 14,
      amount: Math.round(displayTotalExpense * 0.14),
    },
  ];

  // Daily bars matching HTML template: T2, T3, T4, T5, T6, T7, CN
  const dailyBars = [
    { day: 'T2', height: '15%', amount: '85k' },
    { day: 'T3', height: '10%', amount: '45k' },
    { day: 'T4', height: '80%', amount: '320k' },
    { day: 'T5', height: '38%', amount: '150k' },
    { day: 'T6', height: '22%', amount: '65k' },
    { day: 'T7', height: '75%', amount: '120k' },
    { day: 'CN', height: '60%', amount: '185k' },
  ];

  return (
    <div className="w-full bg-white text-slate-800 font-sans select-none pb-28">
      {/* BEGIN: Top Navigation Header (Matches HTML) */}
      <section
        className="pt-4 pb-2 px-6 flex items-center justify-center relative bg-white border-b border-gray-50"
        data-purpose="page-title"
      >
        <h1 className="text-base font-bold text-slate-900 tracking-tight">
          {isVi ? 'Thống kê' : 'Statistics'}
        </h1>
      </section>
      {/* END: Top Navigation Header */}

      {/* Main Content Area */}
      <div className="px-4 py-3 space-y-4">
        {/* BEGIN: Time Filter Tabs */}
        <section data-purpose="time-filter-segmented-control">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center justify-between text-xs font-medium">
            <button
              type="button"
              onClick={() => setPeriodTab('week')}
              className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                periodTab === 'week'
                  ? 'bg-[#0F4C44] text-white font-semibold shadow-sm'
                  : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              {isVi ? 'Tuần' : 'Week'}
            </button>
            <button
              type="button"
              onClick={() => setPeriodTab('month')}
              className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                periodTab === 'month'
                  ? 'bg-[#0F4C44] text-white font-semibold shadow-sm'
                  : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              {isVi ? 'Tháng' : 'Month'}
            </button>
            <button
              type="button"
              onClick={() => setPeriodTab('year')}
              className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                periodTab === 'year'
                  ? 'bg-[#0F4C44] text-white font-semibold shadow-sm'
                  : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              {isVi ? 'Năm' : 'Year'}
            </button>
          </div>

          {/* Date Range Navigator */}
          <div className="flex items-center justify-between px-2 pt-3 pb-1 text-slate-700 text-xs font-medium">
            <button
              type="button"
              onClick={() => setWeekOffset((prev) => prev - 1)}
              className="p-1 text-slate-400 hover:text-slate-700 active:scale-90 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="font-semibold text-xs tracking-tight text-slate-800">
              {dateRangeText}
            </span>
            <button
              type="button"
              onClick={() => setWeekOffset((prev) => prev + 1)}
              className="p-1 text-slate-400 hover:text-slate-700 active:scale-90 transition-transform cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </section>
        {/* END: Time Filter Tabs */}

        {/* BEGIN: Summary Cards (Expense & Income) */}
        <section className="grid grid-cols-2 gap-3" data-purpose="expense-income-summary">
          {/* Card 1: Tổng chi */}
          <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-gray-400 font-medium block">
                {isVi ? 'Tổng chi' : 'Total Expense'}
              </span>
              <span className="text-base font-bold text-slate-900 tracking-tight mt-0.5 block">
                {displayTotalExpense.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-1 text-[10px] text-rose-500 font-medium bg-rose-50 rounded-md py-1 px-1.5 w-fit">
              <ArrowDown className="w-3 h-3 stroke-[2.5]" />
              <span>12% so với tuần trước</span>
            </div>
          </div>

          {/* Card 2: Tổng thu */}
          <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-gray-400 font-medium block">
                {isVi ? 'Tổng thu' : 'Total Income'}
              </span>
              <span className="text-base font-bold text-slate-900 tracking-tight mt-0.5 block">
                {displayTotalIncome.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-1 text-[10px] text-teal-600 font-medium bg-teal-50 rounded-md py-1 px-1.5 w-fit">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              <span>8% so với tuần trước</span>
            </div>
          </div>
        </section>
        {/* END: Summary Cards */}

        {/* BEGIN: Donut Chart & Category Breakdown (Matches HTML) */}
        <section
          className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
          data-purpose="category-distribution-section"
        >
          <div className="flex items-center justify-between gap-2">
            {/* Donut Graphic Container with conic-gradient */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              {/* Circular Conic Gradient Ring */}
              <div
                className="w-full h-full rounded-full shadow-inner"
                style={{
                  background:
                    'conic-gradient(#FF7A00 0% 36%, #0284C7 36% 61%, #10B981 61% 75%, #7C3AED 75% 86%, #22C55E 86% 100%)',
                }}
              />
              {/* Inner White Cutout */}
              <div className="absolute w-[80px] h-[80px] bg-white rounded-full flex flex-col items-center justify-center text-center shadow-xs">
                <span className="text-[10px] text-gray-400 font-medium">Chi tiêu</span>
                <span className="text-[12px] font-bold text-slate-900 leading-tight">
                  {(displayTotalExpense / 1000000).toFixed(2)}M đ
                </span>
              </div>
            </div>

            {/* Category Legend List */}
            <div className="flex-1 pl-3 space-y-1.5 text-[11px]">
              {categoriesData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-[10px]">{item.percent}%</span>
                    <span className="text-slate-900 font-semibold">
                      {item.amount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* END: Donut Chart & Category Breakdown */}

        {/* BEGIN: Daily Expense Bar Chart (Matches HTML) */}
        <section
          className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
          data-purpose="daily-bar-chart"
        >
          <h2 className="text-xs font-bold text-slate-900 mb-4">Chi tiêu theo ngày</h2>
          <div className="flex">
            {/* Y-axis values */}
            <div className="flex flex-col justify-between items-end pr-2 text-[9px] text-gray-400 h-28 pb-4 select-none">
              <span>1.5M</span>
              <span>1M</span>
              <span>500K</span>
              <span>0</span>
            </div>

            {/* Chart Bars Container */}
            <div className="flex-1 flex flex-col justify-end">
              {/* Gridlines & Bars Area */}
              <div className="relative h-24 w-full flex items-end justify-between px-2 border-b border-gray-100">
                {/* Horizontal background dashed lines */}
                <div className="absolute inset-x-0 top-0 border-b border-dashed border-gray-100" />
                <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-gray-100" />
                <div className="absolute inset-x-0 top-2/3 border-b border-dashed border-gray-100" />

                {/* Bars */}
                {dailyBars.map((bar, idx) => (
                  <div
                    key={idx}
                    className="w-4 bg-[#0F4C44] rounded-t-sm relative z-10 hover:brightness-110 transition-all cursor-pointer group"
                    style={{ height: bar.height }}
                    title={`${bar.day}: ${bar.amount}`}
                  />
                ))}
              </div>

              {/* X-axis Labels */}
              <div className="flex justify-between px-2 pt-2 text-[9px] text-gray-500 font-medium text-center">
                {dailyBars.map((bar, idx) => (
                  <span key={idx} className="w-4">
                    {bar.day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* END: Daily Expense Bar Chart */}

        {/* BEGIN: Weekly Budget Progress (Matches HTML) */}
        <section
          className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
          data-purpose="budget-progress-section"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-600 font-medium text-[11px]">So với ngân sách tuần</span>
            <span className="text-slate-900 font-bold text-[11px]">78%</span>
          </div>
          <div className="flex items-center justify-between text-[11px] mb-2 font-semibold">
            <span className="text-slate-900 tracking-tight">4.72M / 6.00M</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0F4C44] h-full rounded-full transition-all duration-500"
              style={{ width: '78%' }}
            />
          </div>
        </section>
        {/* END: Weekly Budget Progress */}
      </div>
    </div>
  );
};
