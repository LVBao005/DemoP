import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Category, User, MomentItem } from '../types';

interface AppContextType {
  user: User | null;
  transactions: Transaction[];
  categories: Category[];
  moments: MomentItem[];
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
  addTransaction: (tx: Omit<Transaction, 'id'> | Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateCategoryBudget: (catId: string, budget: number) => void;
  logout: () => void;
  login: (email: string) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Ăn uống', icon: '🍜', budget: 3500000, color: '#FF5A1F' },
  { id: 'cafe', name: 'Cà phê', icon: '☕', budget: 800000, color: '#92400E' },
  { id: 'shopping', name: 'Mua sắm', icon: '🛍️', budget: 2000000, color: '#D97706' },
  { id: 'transport', name: 'Di chuyển', icon: '🚗', budget: 1000000, color: '#0284C7' },
  { id: 'bills', name: 'Hóa đơn', icon: '🧾', budget: 2500000, color: '#E11D48' },
  { id: 'activities', name: 'Giải trí', icon: '✨', budget: 1500000, color: '#7C3AED' },
  { id: 'income', name: 'Thu nhập', icon: '💰', budget: 0, color: '#059669' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Bún bò Huế & Nước mía',
    amount: 85000,
    type: 'expense',
    categoryId: 'food',
    date: '2026-09-15',
    time: '12:30',
    wallet: 'Tiền mặt',
    mood: '🍜 Ngon miệng',
    note: 'Bún bò tái nạm chả cua góc đường Nguyễn Trãi',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz7Og1t0m1z9K_RGwF9SXVJzomEb6aBXeI4XhTIK2PDnmqwOSyo5r1W14xu1YwLq7B3qoEQMBl8BibYeTlDKGaJu2Y7LvAKWehNI-_EeA0HK7b3HqLI8TMVKgxpMoOZ1Pe1KCzygItXTMC4gXn_7oMQpzThYHUrknycrgQea0WDJA-l16mvxtxo8pOEtI3-NQChGQU0CYQj-TioonQmI9sI2arOWCoF28D6gW_rjA03CywtuVcIeoW',
  },
  {
    id: 'tx-2',
    title: 'Cà phê Muối Chú Long',
    amount: 35000,
    type: 'expense',
    categoryId: 'food',
    date: '2026-09-15',
    time: '09:45',
    wallet: 'MoMo',
    mood: '☕ Tỉnh táo',
    note: 'Uống ly cà phê sáng bắt đầu ngày làm việc',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrO8vRBFSVc2dkca-rgxi0JQV3Sz8lPpepEQoPYsvW_VjYVRy68LNwo55X7wpEMj-_Blprw0NLfoQtl22J_w58jMEqBFtocf_Qqef8S0hkGSeQdIBcFWKhXqP5uj0yRySTlFurbFSOu91TvtuVZjJq1q3_rWLr-LIsTPnWWwAE7jj-CUJALxyX9g-r_o-NxQwIfZVoMn-w-vWLwU_juOZo_SCzpCx4RwxMlkpz4V5H-0ePXByhCMWv',
  },
  {
    id: 'tx-3',
    title: 'Đổ xăng Petrolimex',
    amount: 70000,
    type: 'expense',
    categoryId: 'transport',
    date: '2026-09-15',
    time: '08:15',
    wallet: 'Tiền mặt',
    mood: '⛽ Đầy bình',
    note: 'Xăng RON 95',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBucZxCmCFEzb_r08Te0gvFCCspEnEVC_GCGe8mgAwYZetoBnF6hn98mmAZDoJ_VVpuQM3Qlbufe0xEvnX5lIpXoVH_zY2jTsrXnVfBomrjQLtvvDQ8t93IYfzmcCgL0sz-RXGbOrCPlAbO4PGSd8vJ9IrrDb3m_rY2y7MppJvJNRyZqcaHIb9bpJxGmosOY8RDGDUoy3-Os4P3QI4WjzrdtS53oIzp-CnzkSmb0wO0Vvb8ORUI8c0d',
  },
  {
    id: 'tx-4',
    title: 'Siêu thị WinMart',
    amount: 245000,
    type: 'expense',
    categoryId: 'shopping',
    date: '2026-09-14',
    time: '18:50',
    wallet: 'TPBank',
    mood: '🛒 Tiện lợi',
    note: 'Mua trái cây, sữa chua và đồ nấu bữa tối',
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'tx-5',
    title: 'Thưởng KPI dự án',
    amount: 3500000,
    type: 'income',
    categoryId: 'income',
    date: '2026-09-10',
    time: '15:00',
    wallet: 'TPBank',
    mood: '🎉 Vui vẻ',
    note: 'Tiền thưởng hoàn thành milestone sprint',
  },
];

const DEFAULT_USER: User = {
  id: 'usr_001',
  fullName: 'Lê Văn Bảo',
  email: 'baole.tanquoc@gmail.com',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBWjEp71LrnWFnr38D8UDrmR2e-7t748gezNnm9O6fPkicudd7wypk7hW_uTldzDz_2Wwmh2I6oJlYBX4Q0q25sSZs2UqAMUpMJ_FBRC9yQfHnixAwXbMk40Bspci4KfTBa2Buq7iGpSJo40o7CVxidg4bp5QZ9PMylgt66TxuTKZa0UlU9Apkio-o6LiaO_lHsomjpCaZEI2yA8jNRj7eJEZ5mhPAAzjNUWiQrUIA09IFWiHTcdfZ',
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('monett_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [language, setLanguage] = useState<'vi' | 'en'>(() => {
    const saved = localStorage.getItem('monett_lang');
    return saved === 'en' ? 'en' : 'vi';
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('monett_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('monett_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('monett_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('monett_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('monett_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('monett_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('monett_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (tx: Omit<Transaction, 'id'> | Transaction) => {
    const id = 'id' in tx && tx.id ? tx.id : `tx_${Date.now()}`;
    const newTx: Transaction = {
      id,
      ...tx,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCategoryBudget = (catId: string, budget: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, budget } : c))
    );
  };

  const logout = () => {
    setUser(null);
  };

  const login = (email: string) => {
    setUser({
      ...DEFAULT_USER,
      email,
    });
  };

  const moments: MomentItem[] = transactions
    .filter((t) => !!t.photoUrl)
    .map((t) => ({
      id: t.id,
      title: t.title,
      amount: t.amount,
      category: t.categoryId,
      photoUrl: t.photoUrl!,
      note: t.note,
      date: t.date,
      time: t.time,
    }));

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        categories,
        moments,
        language,
        setLanguage,
        addTransaction,
        deleteTransaction,
        updateCategoryBudget,
        logout,
        login,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
