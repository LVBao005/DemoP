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

export const MobileAnalyticsScreen: React.FC = () => {
  const { transactions, language } = useApp();
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const isVi = language === 'vi';

  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0) || 4720000;
  const totalIncome = 12000000;

  const categories = [
    { name: isVi ? 'Ăn uống' : 'Food & Dining', percent: 38, amount: Math.round(totalExpense * 0.38), color: '#FF5A1F' },
    { name: isVi ? 'Mua sắm' : 'Shopping', percent: 24, amount: Math.round(totalExpense * 0.24), color: '#F59E0B' },
    { name: isVi ? 'Di chuyển' : 'Transport', percent: 14, amount: Math.round(totalExpense * 0.14), color: '#0284C7' },
    { name: isVi ? 'Hóa đơn' : 'Bills', percent: 16, amount: Math.round(totalExpense * 0.16), color: '#E11D48' },
    { name: isVi ? 'Khác' : 'Others', percent: 8, amount: Math.round(totalExpense * 0.08), color: '#8B5CF6' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header & Period Switch */}
      <View style={styles.topRow}>
        <Text style={styles.title}>
          {isVi ? 'Báo cáo chi tiêu 📊' : 'Financial Report 📊'}
        </Text>
        <View style={styles.periodTabs}>
          <TouchableOpacity
            style={[styles.pTab, period === 'week' && styles.pTabActive]}
            onPress={() => setPeriod('week')}
          >
            <Text style={[styles.pText, period === 'week' && styles.pTextActive]}>
              {isVi ? 'Tuần' : 'Week'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pTab, period === 'month' && styles.pTabActive]}
            onPress={() => setPeriod('month')}
          >
            <Text style={[styles.pText, period === 'month' && styles.pTextActive]}>
              {isVi ? 'Tháng' : 'Month'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          {isVi ? 'Tổng chi tiêu tuần này' : 'Total spent this week'}
        </Text>
        <Text style={styles.mainTotal}>{totalExpense.toLocaleString('vi-VN')} ₫</Text>

        <View style={styles.diffRow}>
          <View style={styles.diffBadge}>
            <Ionicons name="arrow-down" size={12} color="#047857" />
            <Text style={styles.diffText}>-12% {isVi ? 'so với tuần trước' : 'vs last week'}</Text>
          </View>
        </View>

        {/* Progress Bar Breakdown */}
        <View style={styles.stackedBar}>
          {categories.map((c, i) => (
            <View
              key={i}
              style={[
                styles.barSegment,
                { width: `${c.percent}%`, backgroundColor: c.color },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Category breakdown list */}
      <View style={styles.catSection}>
        <Text style={styles.catSectionTitle}>
          {isVi ? 'Cơ cấu theo danh mục' : 'Category Breakdown'}
        </Text>

        <View style={styles.catList}>
          {categories.map((c, i) => (
            <View key={i} style={styles.catRow}>
              <View style={[styles.dot, { backgroundColor: c.color }]} />
              <Text style={styles.catName}>{c.name}</Text>
              <Text style={styles.catPercent}>{c.percent}%</Text>
              <Text style={styles.catAmount}>{c.amount.toLocaleString('vi-VN')} ₫</Text>
            </View>
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
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
  },
  pTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9,
  },
  pTabActive: {
    backgroundColor: '#FFFFFF',
  },
  pText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  pTextActive: {
    color: '#047857',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  mainTotal: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 4,
  },
  diffRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  diffText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '700',
  },
  stackedBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  barSegment: {
    height: '100%',
  },
  catSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  catSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  catList: {
    gap: 12,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  catName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  catPercent: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 14,
  },
  catAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
});
