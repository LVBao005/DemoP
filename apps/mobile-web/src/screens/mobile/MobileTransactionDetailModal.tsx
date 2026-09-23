import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';

interface MobileTransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onViewPhoto?: (url: string) => void;
}

export const MobileTransactionDetailModal: React.FC<MobileTransactionDetailModalProps> = ({
  transaction,
  onClose,
  onDelete,
}) => {
  if (!transaction) return null;

  const handleDelete = () => {
    Alert.alert(
      'Xóa giao dịch',
      `Bạn có chắc muốn xóa giao dịch "${transaction.title}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            onDelete(transaction.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={!!transaction}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Chi tiết giao dịch</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Photo if available */}
          {transaction.photoUrl && (
            <Image source={{ uri: transaction.photoUrl }} style={styles.photo} />
          )}

          {/* Amount & Title */}
          <View style={styles.infoCenter}>
            <Text
              style={[
                styles.amount,
                transaction.type === 'income' ? styles.income : styles.expense,
              ]}
            >
              {transaction.type === 'income' ? '+' : '-'}
              {transaction.amount.toLocaleString('vi-VN')} ₫
            </Text>
            <Text style={styles.txTitle}>{transaction.title}</Text>
          </View>

          {/* Meta rows */}
          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Thời gian</Text>
              <Text style={styles.metaVal}>
                {transaction.date} {transaction.time ? `• ${transaction.time}` : ''}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Ví thanh toán</Text>
              <Text style={styles.metaVal}>{transaction.wallet || 'Tiền mặt'}</Text>
            </View>

            {transaction.note && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Ghi chú</Text>
                <Text style={styles.metaVal}>{transaction.note}</Text>
              </View>
            )}
          </View>

          {/* Delete action */}
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text style={styles.deleteText}>Xóa giao dịch này</Text>
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
  box: {
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
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  photo: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: 14,
  },
  infoCenter: {
    alignItems: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 26,
    fontWeight: '900',
  },
  expense: {
    color: '#EF4444',
  },
  income: {
    color: '#10B981',
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 4,
  },
  metaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 14,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
});
