export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  categoryId: string;
  date: string;
  time?: string;
  photoUrl?: string;
  note?: string;
  wallet?: string;
  mood?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  budget: number;
  color?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface MomentItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  photoUrl: string;
  note?: string;
  date: string;
  time?: string;
}
