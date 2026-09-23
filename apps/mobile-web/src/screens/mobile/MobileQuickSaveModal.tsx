import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MobileQuickSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, category: string, note?: string) => void;
  onOpenFullAdd?: () => void;
}

const PRESET_AMOUNTS = [20000, 35000, 50000, 80000, 100000, 150000];

const QUICK_CATEGORIES = [
  { id: 'food', name: 'Ăn uống', icon: '🍜' },
  { id: 'cafe', name: 'Cà phê', icon: '☕' },
  { id: 'breakfast', name: 'Ăn sáng', icon: '🍳' },
  { id: 'lunch', name: 'Ăn trưa', icon: '🍱' },
  { id: 'transport', name: 'Đổ xăng', icon: '⛽' },
  { id: 'groceries', name: 'Đi chợ', icon: '🛒' },
  { id: 'boba', name: 'Trà sữa', icon: '🧋' },
  { id: 'shopping', name: 'Mua sắm', icon: '🛍️' },
];

export const MobileQuickSaveModal: React.FC<MobileQuickSaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onOpenFullAdd,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(35000);
  const [selectedCategory, setSelectedCategory] = useState<string>('Cà phê');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedAmount, selectedCategory, note || undefined);
    setNote('');
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.flashBadge}>
                <Ionicons name="flash" size={14} color="#047857" />
              </View>
              <Text style={styles.title}>Lưu nhanh chi tiêu ⚡</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Amount presets */}
          <Text style={styles.label}>CHỌN SỐ TIỀN</Text>
          <View style={styles.amountGrid}>
            {PRESET_AMOUNTS.map((amt) => {
              const active = selectedAmount === amt;
              return (
                <TouchableOpacity
                  key={amt}
                  style={[styles.amtBtn, active && styles.amtBtnActive]}
                  onPress={() => setSelectedAmount(amt)}
                >
                  <Text style={[styles.amtText, active && styles.amtTextActive]}>
                    {(amt / 1000).toString()}k
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Category selection */}
          <Text style={styles.label}>DANH MỤC</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {QUICK_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.name;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catBtn, active && styles.catBtnActive]}
                  onPress={() => setSelectedCategory(cat.name)}
                >
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text style={[styles.catName, active && styles.catNameActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Note Input */}
          <Text style={styles.label}>GHI CHÚ (TÙY CHỌN)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: Cà phê muối sáng, phở bò..."
            value={note}
            onChangeText={setNote}
          />

          {/* Save button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>
              Lưu ngay • {selectedAmount.toLocaleString('vi-VN')} ₫
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flashBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 8,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amtBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    minWidth: 60,
    alignItems: 'center',
  },
  amtBtnActive: {
    backgroundColor: '#047857',
  },
  amtText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  amtTextActive: {
    color: '#FFFFFF',
  },
  catScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  catBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#047857',
  },
  catIcon: {
    fontSize: 16,
  },
  catName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  catNameActive: {
    color: '#047857',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: '#047857',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
