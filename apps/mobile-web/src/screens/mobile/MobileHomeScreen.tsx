import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';

interface MobileHomeScreenProps {
  onNavigateTab?: (tab: 'home' | 'camera' | 'moments' | 'analytics' | 'wallets' | 'categories' | 'profile') => void;
  onOpenQuickSave?: () => void;
  onOpenAddExpense?: () => void;
  onSelectTransaction?: (tx: Transaction) => void;
  onViewPhoto?: (url: string) => void;
}

const WEEK_DAYS = [
  { day: 'T2', date: '9/9', amount: '85k', num: 85000, img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=100&auto=format&fit=crop&q=80' },
  { day: 'T3', date: '10/9', amount: '45k', num: 45000, img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&auto=format&fit=crop&q=80' },
  { day: 'T4', date: '11/9', amount: '320k', num: 320000, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80' },
  { day: 'T5', date: '12/9', amount: '150k', num: 150000, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=80' },
  { day: 'T6', date: '13/9', amount: '65k', num: 65000, img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=100&auto=format&fit=crop&q=80' },
  { day: 'T7', date: '14/9', amount: '120k', num: 120000, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&auto=format&fit=crop&q=80' },
  { day: 'CN', date: '15/9', amount: '185k', num: 185000, isToday: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz7Og1t0m1z9K_RGwF9SXVJzomEb6aBXeI4XhTIK2PDnmqwOSyo5r1W14xu1YwLq7B3qoEQMBl8BibYeTlDKGaJu2Y7LvAKWehNI-_EeA0HK7b3HqLI8TMVKgxpMoOZ1Pe1KCzygItXTMC4gXn_7oMQpzThYHUrknycrgQea0WDJA-l16mvxtxo8pOEtI3-NQChGQU0CYQj-TioonQmI9sI2arOWCoF28D6gW_rjA03CywtuVcIeoW' },
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
  const firstName = user?.fullName?.split(' ').pop() || 'Bảo';

  const realExpenses = transactions.filter((t) => t.type === 'expense');
  const todayTotal = realExpenses.length > 0
    ? realExpenses.reduce((sum, item) => sum + item.amount, 0)
    : 185000;

  const formatVnd = (num: number) => {
    return num.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.brandRow}>
          <View style={styles.frogBadge}>
            <Text style={styles.frogEmoji}>🐸</Text>
          </View>
          <View>
            <Text style={styles.brandName}>
              Monett<Text style={styles.dot}>.</Text>
            </Text>
            <Text style={styles.brandTag}>Money Moments</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setHasNotification(!hasNotification)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color="#334155" />
            {hasNotification && <View style={styles.notifDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={() => onNavigateTab && onNavigateTab('profile')}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri:
                  user?.avatarUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDBWjEp71LrnWFnr38D8UDrmR2e-7t748gezNnm9O6fPkicudd7wypk7hW_uTldzDz_2Wwmh2I6oJlYBX4Q0q25sSZs2UqAMUpMJ_FBRC9yQfHnixAwXbMk40Bspci4KfTBa2Buq7iGpSJo40o7CVxidg4bp5QZ9PMylgt66TxuTKZa0UlU9Apkio-o6LiaO_lHsomjpCaZEI2yA8jNRj7eJEZ5mhPAAzjNUWiQrUIA09IFWiHTcdfZ',
              }}
              style={styles.avatarImg}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Weekdays Strip */}
      <View style={styles.weekSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekScroll}
        >
          {WEEK_DAYS.map((w) => {
            const isSelected = selectedDay === w.day;
            return (
              <TouchableOpacity
                key={w.day}
                style={[styles.dayCard, isSelected && styles.dayCardActive]}
                onPress={() => setSelectedDay(w.day)}
                activeOpacity={0.75}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
                  {w.day}
                </Text>
                <Text style={[styles.dayDate, isSelected && styles.dayDateActive]}>
                  {w.date}
                </Text>

                <Image source={{ uri: w.img }} style={styles.dayThumb} />

                <Text style={[styles.dayAmount, isSelected && styles.dayAmountActive]}>
                  {w.amount}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Hero Spending Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroSubtitle}>
              {isVi ? `Chào ${firstName}! Hôm nay 15 Th9` : `Hello ${firstName}! Today Sep 15`}
            </Text>
            <Text style={styles.heroTotal}>{formatVnd(todayTotal)}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 7 {isVi ? 'ngày liên tiếp' : 'days streak'}</Text>
          </View>
        </View>

        <Text style={styles.quoteText}>
          {isVi
            ? '“Chi tiêu có kiểm soát là cách yêu thương bản thân tốt nhất ✨”'
            : '“Mindful spending is the purest form of self-love ✨”'}
        </Text>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.quickSaveBtn}
            onPress={onOpenQuickSave}
            activeOpacity={0.85}
          >
            <Ionicons name="flash" size={16} color="#047857" />
            <Text style={styles.quickSaveText}>
              {isVi ? 'Lưu nhanh' : 'Quick Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addExpenseBtn}
            onPress={onOpenAddExpense}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addExpenseText}>
              {isVi ? 'Thêm chi tiêu' : 'Add Expense'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Transactions List */}
      <View style={styles.txSection}>
        <View style={styles.txHeaderRow}>
          <Text style={styles.sectionTitle}>
            {isVi ? 'Khoảnh khắc hôm nay' : "Today's Moments"}
          </Text>
          <TouchableOpacity
            onPress={() => onNavigateTab && onNavigateTab('moments')}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>{isVi ? 'Xem tất cả' : 'See all'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.txList}>
          {transactions.slice(0, 5).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.txItem}
              onPress={() => onSelectTransaction && onSelectTransaction(item)}
              activeOpacity={0.7}
            >
              {item.photoUrl ? (
                <Image source={{ uri: item.photoUrl }} style={styles.txThumb} />
              ) : (
                <View style={styles.catIconFallback}>
                  <Text style={styles.fallbackEmoji}>
                    {item.categoryId === 'food' ? '🍜' : item.categoryId === 'transport' ? '🛵' : '🛍️'}
                  </Text>
                </View>
              )}

              <View style={styles.txInfo}>
                <Text style={styles.txTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.txMetaRow}>
                  <Text style={styles.txMetaText}>{item.time || '12:00'}</Text>
                  <Text style={styles.txMetaDot}>•</Text>
                  <Text style={styles.txMetaText}>{item.wallet || 'Tiền mặt'}</Text>
                </View>
              </View>

              <Text
                style={[
                  styles.txAmount,
                  item.type === 'income' ? styles.incomeText : styles.expenseText,
                ]}
              >
                {item.type === 'income' ? '+' : '-'}
                {item.amount.toLocaleString('vi-VN')} ₫
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingBottom: 90,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  frogBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frogEmoji: {
    fontSize: 20,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#047857',
    lineHeight: 20,
  },
  dot: {
    color: '#F59E0B',
  },
  brandTag: {
    fontSize: 9,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    position: 'relative',
    padding: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  avatarWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  weekSection: {
    marginVertical: 12,
  },
  weekScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayCard: {
    width: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayCardActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  dayName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  dayNameActive: {
    color: '#A7F3D0',
  },
  dayDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 6,
  },
  dayDateActive: {
    color: '#FFFFFF',
  },
  dayThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 6,
  },
  dayAmount: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  dayAmountActive: {
    color: '#FFFFFF',
  },
  heroCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  heroTotal: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
    letterSpacing: -0.5,
  },
  streakBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  streakText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  quoteText: {
    fontSize: 12,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickSaveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 12,
  },
  quickSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
  },
  addExpenseBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#047857',
    borderRadius: 14,
    paddingVertical: 12,
  },
  addExpenseText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  txSection: {
    paddingHorizontal: 16,
  },
  txHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  txList: {
    gap: 10,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  txThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  catIconFallback: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackEmoji: {
    fontSize: 22,
  },
  txInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  txMetaText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  txMetaDot: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  expenseText: {
    color: '#EF4444',
  },
  incomeText: {
    color: '#10B981',
  },
});
