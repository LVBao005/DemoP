import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export const MobileCategoriesScreen: React.FC = () => {
  const { categories, transactions, updateCategoryBudget, language } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [val, setVal] = useState('');
  const isVi = language === 'vi';

  const handleSave = (catId: string) => {
    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      updateCategoryBudget(catId, num);
    }
    setEditingId(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        {isVi ? 'Hạn mức chi tiêu 🏷️' : 'Category Budgets 🏷️'}
      </Text>
      <Text style={styles.subtitle}>
        {isVi ? 'Kiểm soát dòng tiền thông minh theo từng mục' : 'Set mindful spending limits per category'}
      </Text>

      <View style={styles.list}>
        {categories
          .filter((c) => c.id !== 'income')
          .map((cat) => {
            const spent = transactions
              .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
              .reduce((s, i) => s + i.amount, 0);
            const budget = cat.budget || 2000000;
            const pct = Math.min(Math.round((spent / budget) * 100), 100);

            return (
              <View key={cat.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <View style={styles.catInfo}>
                    <Text style={styles.catName}>{cat.name}</Text>
                    <Text style={styles.spentText}>
                      {isVi ? 'Đã chi' : 'Spent'}: {spent.toLocaleString('vi-VN')} ₫ / {budget.toLocaleString('vi-VN')} ₫
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => {
                      setEditingId(cat.id);
                      setVal(budget.toString());
                    }}
                  >
                    <Ionicons name="pencil" size={14} color="#047857" />
                  </TouchableOpacity>
                </View>

                {/* Progress */}
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: pct > 90 ? '#EF4444' : '#10B981',
                      },
                    ]}
                  />
                </View>

                {editingId === cat.id && (
                  <View style={styles.editRow}>
                    <TextInput
                      style={styles.input}
                      value={val}
                      onChangeText={setVal}
                      keyboardType="numeric"
                      placeholder="Ngân sách mới..."
                    />
                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={() => handleSave(cat.id)}
                    >
                      <Text style={styles.saveBtnText}>{isVi ? 'Lưu' : 'Save'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
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
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
    marginTop: 2,
  },
  list: {
    gap: 12,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  catIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  spentText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  editBtn: {
    padding: 6,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
  },
  barBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
  editRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    height: 38,
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: '#047857',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
