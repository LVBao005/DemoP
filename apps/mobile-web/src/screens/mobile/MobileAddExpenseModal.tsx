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

interface MobileAddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    amount: number;
    categoryId: string;
    wallet: string;
    note?: string;
  }) => void;
  onOpenCamera?: () => void;
}

const CATEGORIES = [
  { id: 'food', name: 'Ăn uống', icon: '🍜' },
  { id: 'cafe', name: 'Cà phê', icon: '☕' },
  { id: 'shopping', name: 'Mua sắm', icon: '🛍️' },
  { id: 'transport', name: 'Di chuyển', icon: '🚗' },
  { id: 'bills', name: 'Hóa đơn', icon: '🧾' },
  { id: 'activities', name: 'Giải trí', icon: '✨' },
];

const WALLETS = ['Tiền mặt', 'Vietcombank', 'Ví MoMo'];

export const MobileAddExpenseModal: React.FC<MobileAddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('85000');
  const [selectedCat, setSelectedCat] = useState('food');
  const [selectedWallet, setSelectedWallet] = useState('Tiền mặt');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const num = parseInt(amountStr.replace(/[^0-9]/g, ''), 10) || 0;
    const cat = CATEGORIES.find((c) => c.id === selectedCat);
    onSave({
      title: title || cat?.name || 'Chi tiêu mới',
      amount: num,
      categoryId: selectedCat,
      wallet: selectedWallet,
      note: note || undefined,
    });
    setTitle('');
    setNote('');
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Thêm chi tiêu mới 💸</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Amount input */}
            <Text style={styles.label}>SỐ TIỀN (VNĐ)</Text>
            <View style={styles.amountBox}>
              <TextInput
                style={styles.amountInput}
                value={amountStr}
                onChangeText={setAmountStr}
                keyboardType="numeric"
                placeholder="0"
              />
              <Text style={styles.currency}>₫</Text>
            </View>

            {/* Title / Description */}
            <Text style={styles.label}>TÊN CHI TIÊU</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Bún bò tái nạm, Trà đào..."
              value={title}
              onChangeText={setTitle}
            />

            {/* Category selection */}
            <Text style={styles.label}>DANH MỤC</Text>
            <View style={styles.catGrid}>
              {CATEGORIES.map((cat) => {
                const active = selectedCat === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catCard, active && styles.catCardActive]}
                    onPress={() => setSelectedCat(cat.id)}
                  >
                    <Text style={styles.catIcon}>{cat.icon}</Text>
                    <Text style={[styles.catName, active && styles.catNameActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Wallet selection */}
            <Text style={styles.label}>NGUỒN TIỀN</Text>
            <View style={styles.walletRow}>
              {WALLETS.map((w) => {
                const active = selectedWallet === w;
                return (
                  <TouchableOpacity
                    key={w}
                    style={[styles.walletBtn, active && styles.walletBtnActive]}
                    onPress={() => setSelectedWallet(w)}
                  >
                    <Text style={[styles.walletText, active && styles.walletTextActive]}>
                      {w}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
              <Text style={styles.submitText}>Lưu chi tiêu</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 6,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 56,
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '900',
    color: '#047857',
  },
  currency: {
    fontSize: 22,
    fontWeight: '800',
    color: '#64748B',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catCard: {
    width: '31%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catCardActive: {
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
  walletRow: {
    flexDirection: 'row',
    gap: 8,
  },
  walletBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  walletBtnActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  walletText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  walletTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#047857',
    borderRadius: 16,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
