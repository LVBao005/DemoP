import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import { HomeScreen } from './HomeScreen';
import { CameraScreen } from './CameraScreen';
import { AddExpenseScreen } from './AddExpenseScreen';
import { QuickSaveModal } from './QuickSaveModal';
import { TransactionDetail } from './TransactionDetail';
import { AnalyticsScreen } from './AnalyticsScreen';
import { WalletsScreen } from './WalletsScreen';
import { CategoriesScreen } from './CategoriesScreen';
import { ProfileScreen } from './ProfileScreen';

export type MobileTab = 'home' | 'analytics' | 'wallets' | 'categories' | 'profile';
export type ActiveModal = 'none' | 'camera' | 'add_expense' | 'quick_save' | 'detail';

export const MobileNavigator: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<MobileTab>('home');
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [capturedPhoto, setCapturedPhoto] = useState<string | undefined>();
  const [selectedTxId, setSelectedTxId] = useState<string | undefined>();

  const handlePhotoCaptured = (photoUrl: string) => {
    setCapturedPhoto(photoUrl);
    setActiveModal('add_expense');
  };

  const renderCurrentTabScreen = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToCamera={() => setActiveModal('camera')}
            onNavigateToAddExpense={() => setActiveModal('add_expense')}
            onNavigateToQuickSave={() => setActiveModal('quick_save')}
            onNavigateToDetail={(id) => {
              setSelectedTxId(id);
              setActiveModal('detail');
            }}
            onNavigateToAnalytics={() => setCurrentTab('analytics')}
          />
        );
      case 'analytics':
        return <AnalyticsScreen />;
      case 'wallets':
        return <WalletsScreen onAddWallet={() => {}} />;
      case 'categories':
        return <CategoriesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      {/* 1. Màn hình Tab chính */}
      <View style={styles.mainContent}>{renderCurrentTabScreen()}</View>

      {/* 2. Thanh Bottom Navigation chuẩn theo Stitch */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('home')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, currentTab === 'home' && styles.navIconActive]}>
            🏠
          </Text>
          <Text style={[styles.navLabel, currentTab === 'home' && styles.navLabelActive]}>
            Trang chủ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('analytics')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navIcon,
              currentTab === 'analytics' && styles.navIconActive,
            ]}
          >
            📊
          </Text>
          <Text
            style={[
              styles.navLabel,
              currentTab === 'analytics' && styles.navLabelActive,
            ]}
          >
            Thống kê
          </Text>
        </TouchableOpacity>

        {/* Nút tròn nổi chính giữa: Chụp ảnh / Thêm chi tiêu */}
        <View style={styles.centerFabContainer}>
          <TouchableOpacity
            style={styles.fabBtn}
            onPress={() => setActiveModal('camera')}
            activeOpacity={0.85}
          >
            <Text style={styles.fabIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('wallets')}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.navIcon, currentTab === 'wallets' && styles.navIconActive]}
          >
            💳
          </Text>
          <Text
            style={[
              styles.navLabel,
              currentTab === 'wallets' && styles.navLabelActive,
            ]}
          >
            Ví
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('profile')}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.navIcon, currentTab === 'profile' && styles.navIconActive]}
          >
            👤
          </Text>
          <Text
            style={[
              styles.navLabel,
              currentTab === 'profile' && styles.navLabelActive,
            ]}
          >
            Cá nhân
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. Màn hình Camera Fullscreen */}
      {activeModal === 'camera' && (
        <View style={StyleSheet.absoluteFill}>
          <CameraScreen
            onClose={() => setActiveModal('none')}
            onPhotoCaptured={handlePhotoCaptured}
          />
        </View>
      )}

      {/* 4. Màn hình Thêm Chi Tiêu */}
      {activeModal === 'add_expense' && (
        <View style={StyleSheet.absoluteFill}>
          <AddExpenseScreen
            initialPhotoUrl={capturedPhoto}
            onBack={() => setActiveModal('none')}
            onSaveSuccess={() => {
              setActiveModal('none');
              setCapturedPhoto(undefined);
            }}
          />
        </View>
      )}

      {/* 5. Màn hình Chi Tiết Giao Dịch */}
      {activeModal === 'detail' && (
        <View style={StyleSheet.absoluteFill}>
          <TransactionDetail
            transactionId={selectedTxId}
            onBack={() => setActiveModal('none')}
            onEdit={() => setActiveModal('add_expense')}
            onDelete={() => setActiveModal('none')}
          />
        </View>
      )}

      {/* 6. Modal QuickSave (Bạn vừa chi?) */}
      <QuickSaveModal
        visible={activeModal === 'quick_save'}
        onClose={() => setActiveModal('none')}
        onSaveQuick={(amount, category) => {
          console.log('Saved quick expense:', amount, category);
          setActiveModal('none');
        }}
        onOpenFullCamera={() => setActiveModal('camera')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  mainContent: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 8,
    position: 'relative',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#047857',
    fontWeight: '800',
  },
  centerFabContainer: {
    position: 'relative',
    top: -16,
    width: 60,
    alignItems: 'center',
  },
  fabBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 22,
  },
});
