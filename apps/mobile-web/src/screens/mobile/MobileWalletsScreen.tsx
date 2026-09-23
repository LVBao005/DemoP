import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export const MobileWalletsScreen: React.FC = () => {
  const { transactions, language } = useApp();
  const [hideBalance, setHideBalance] = useState(false);
  const isVi = language === 'vi';

  const wallets = [
    { id: 'w1', name: 'Tiền mặt', type: 'cash', balance: 2500000, icon: 'cash-outline', color: '#047857' },
    { id: 'w2', name: 'Vietcombank', type: 'bank', balance: 14850000, icon: 'card-outline', color: '#0284C7' },
    { id: 'w3', name: 'Ví MoMo', type: 'ewallet', balance: 850000, icon: 'phone-portrait-outline', color: '#D946EF' },
  ];

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <Text style={styles.title}>
          {isVi ? 'Ví & Tài khoản 💳' : 'Wallets & Accounts 💳'}
        </Text>
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setHideBalance(!hideBalance)}
        >
          <Ionicons
            name={hideBalance ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>

      {/* Total Balance Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>
          {isVi ? 'Tổng tài sản khả dụng' : 'Total Net Worth'}
        </Text>
        <Text style={styles.totalAmount}>
          {hideBalance ? '•••••••• ₫' : `${totalBalance.toLocaleString('vi-VN')} ₫`}
        </Text>
      </View>

      {/* Wallets List */}
      <View style={styles.list}>
        {wallets.map((w) => (
          <View key={w.id} style={styles.walletItem}>
            <View style={[styles.iconBox, { backgroundColor: w.color + '15' }]}>
              <Ionicons name={w.icon as any} size={22} color={w.color} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{w.name}</Text>
              <Text style={styles.type}>
                {w.type === 'cash' ? (isVi ? 'Tiền mặt' : 'Cash') : w.type === 'bank' ? (isVi ? 'Ngân hàng' : 'Bank') : 'E-Wallet'}
              </Text>
            </View>
            <Text style={styles.balance}>
              {hideBalance ? '••••••' : `${w.balance.toLocaleString('vi-VN')} ₫`}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  eyeBtn: {
    padding: 6,
  },
  totalCard: {
    backgroundColor: '#047857',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  totalLabel: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  list: {
    gap: 12,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  type: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  balance: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
});
