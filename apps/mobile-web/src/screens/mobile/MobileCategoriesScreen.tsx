import React, { useState } from 'react';
import { Tag, Plus, Edit2, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileCategoriesScreen: React.FC = () => {
  const { categories, transactions, updateCategoryBudget, language } = useApp();
  const isVi = language === 'vi';

  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [newBudgetVal, setNewBudgetVal] = useState<string>('');

  const handleStartEdit = (catId: string, currentBudget: number) => {
    setEditingCatId(catId);
    setNewBudgetVal(currentBudget.toString());
  };

  const handleSaveBudget = (catId: string) => {
    const num = parseInt(newBudgetVal.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      updateCategoryBudget(catId, num);
    }
    setEditingCatId(null);
  };

  return (
    <div className="w-full space-y-4 p-4 pb-28">
      <div>
        <h2 className="text-lg font-black text-slate-900">
          {isVi ? 'Hạn Mức Danh Mục 🏷️' : 'Category Budgets 🏷️'}
        </h2>
        <p className="text-xs text-slate-500">
          {isVi ? 'Thiết lập và theo dõi ngân sách cho từng mục' : 'Set and track spending limits per category'}
        </p>
      </div>

      <div className="space-y-3">
        {categories
          .filter((c) => c.id !== 'income')
          .map((cat) => {
            const spent = transactions
              .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
              .reduce((acc, cur) => acc + cur.amount, 0);

            const percent = cat.monthlyBudget > 0 ? Math.min(100, (spent / cat.monthlyBudget) * 100) : 0;
            const isOver = spent > cat.monthlyBudget && cat.monthlyBudget > 0;

            return (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                      style={{ backgroundColor: cat.bgColor, color: cat.color }}
                    >
                      {cat.id === 'food' ? '🍕' : cat.id === 'shopping' ? '🛍️' : cat.id === 'transport' ? '🚗' : cat.id === 'activities' ? '✨' : '🧾'}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">
                        {isVi ? cat.nameVi : cat.nameEn}
                      </h4>
                      <div className="text-[10px] text-slate-500">
                        Đã chi: {spent.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {editingCatId === cat.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={newBudgetVal}
                          onChange={(e) => setNewBudgetVal(e.target.value)}
                          className="w-24 px-2 py-1 text-xs border border-emerald-500 rounded-lg focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveBudget(cat.id)}
                          className="p-1 bg-emerald-600 text-white rounded-lg"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(cat.id, cat.monthlyBudget)}
                        className="group flex items-center gap-1 text-right"
                      >
                        <div>
                          <div className="text-xs font-black text-slate-900">
                            {cat.monthlyBudget.toLocaleString('vi-VN')} đ
                          </div>
                          <span className="text-[9px] text-slate-400 group-hover:text-emerald-600">
                            Chạm để sửa
                          </span>
                        </div>
                        <Edit2 className="w-3 h-3 text-slate-300 group-hover:text-emerald-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-500">
                  <span className={isOver ? 'text-rose-600 font-bold' : ''}>
                    {percent.toFixed(0)}% hạn mức
                  </span>
                  <span>
                    Còn lại:{' '}
                    {Math.max(0, cat.monthlyBudget - spent).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
