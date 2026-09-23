import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';

import { MobileHomeScreen } from './MobileHomeScreen';
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
  | 'moments'
  | 'analytics'
  | 'wallets'
  | 'categories'
  | 'profile';

interface MobileAppProps {
  onToggleDesktopView?: () => void;
  isInsideDeviceFrame?: boolean;
}

export const MobileApp: React.FC<MobileAppProps> = () => {
  const { addTransaction, deleteTransaction } = useApp();
  const [activeTab, setActiveTab] = useState<MobileTabKey>('home');

  // Modal states
  const [isQuickSaveOpen, setIsQuickSaveOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <MobileHomeScreen
            onNavigateTab={(tab) => setActiveTab(tab as MobileTabKey)}
            onOpenQuickSave={() => setIsQuickSaveOpen(true)}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onSelectTransaction={(tx) => setSelectedTx(tx)}
          />
        );
      case 'moments':
        return (
          <MobileMomentsScreen
            onSelectTransaction={(tx) => setSelectedTx(tx)}
          />
        );
      case 'analytics':
        return <MobileAnalyticsScreen />;
      case 'wallets':
        return <MobileWalletsScreen />;
      case 'categories':
        return <MobileCategoriesScreen />;
      case 'profile':
        return <MobileProfileScreen />;
      default:
        return (
          <MobileHomeScreen
            onNavigateTab={(tab) => setActiveTab(tab as MobileTabKey)}
            onOpenQuickSave={() => setIsQuickSaveOpen(true)}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onSelectTransaction={(tx) => setSelectedTx(tx)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Content */}
      <View style={styles.container}>{renderScreen()}</View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Home */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'home' ? '#047857' : '#94A3B8'}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'home' && styles.navTextActive,
            ]}
          >
            Trang chủ
          </Text>
        </TouchableOpacity>

        {/* Moments */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('moments')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'moments' ? 'images' : 'images-outline'}
            size={22}
            color={activeTab === 'moments' ? '#047857' : '#94A3B8'}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'moments' && styles.navTextActive,
            ]}
          >
            Nhật ký ảnh
          </Text>
        </TouchableOpacity>

        {/* Center Floating Plus Button */}
        <View style={styles.centerFabContainer}>
          <TouchableOpacity
            style={styles.fabBtn}
            onPress={() => setIsQuickSaveOpen(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Wallets */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('wallets')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'wallets' ? 'wallet' : 'wallet-outline'}
            size={22}
            color={activeTab === 'wallets' ? '#047857' : '#94A3B8'}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'wallets' && styles.navTextActive,
            ]}
          >
            Ví tiền
          </Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={22}
            color={activeTab === 'profile' ? '#047857' : '#94A3B8'}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'profile' && styles.navTextActive,
            ]}
          >
            Tài khoản
          </Text>
        </TouchableOpacity>
      </View>

      {/* Popups & Modals */}
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
          });
        }}
      />

      <MobileAddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSave={(data) => {
          addTransaction({
            title: data.title,
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
          });
        }}
      />

      {selectedTx && (
        <MobileTransactionDetailModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
          onDelete={(id) => {
            deleteTransaction(id);
            setSelectedTx(null);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 3,
  },
  navTextActive: {
    color: '#047857',
    fontWeight: '700',
  },
  centerFabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    marginTop: -16,
  },
});
