import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';

interface MobileMomentsScreenProps {
  onOpenCamera?: () => void;
  onViewPhoto?: (url: string) => void;
  onSelectTransaction?: (tx: Transaction) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const MobileMomentsScreen: React.FC<MobileMomentsScreenProps> = ({
  onSelectTransaction,
}) => {
  const { transactions, language } = useApp();
  const [filterCat, setFilterCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const isVi = language === 'vi';

  const photoItems = transactions.filter((t) => !!t.photoUrl);
  const filtered = photoItems.filter((item) => {
    const matchCat = filterCat === 'all' || item.categoryId === filterCat;
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>Locket Money Diary</Text>
        </View>
        <Text style={styles.bannerTitle}>
          {isVi ? 'Nhật ký khoảnh khắc chi tiêu 📸' : 'Photo Expense Diary 📸'}
        </Text>
        <Text style={styles.bannerSub}>
          {isVi
            ? 'Mỗi bức ảnh là một trải nghiệm sống đáng giá'
            : 'Every photo is a memorable spending moment'}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder={isVi ? 'Tìm kiếm món ăn, địa điểm, ghi chú...' : 'Search meals, places, notes...'}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Grid of Moments */}
      <View style={styles.grid}>
        {filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => onSelectTransaction && onSelectTransaction(item)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.photoUrl }} style={styles.cardImg} />
            <View style={styles.cardOverlay}>
              <Text style={styles.cardAmount}>
                {item.amount.toLocaleString('vi-VN')} ₫
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardDate}>
                {item.date} {item.time ? `• ${item.time}` : ''}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>📷</Text>
          <Text style={styles.emptyTitle}>
            {isVi ? 'Chưa có ảnh nào' : 'No photos yet'}
          </Text>
          <Text style={styles.emptyDesc}>
            {isVi
              ? 'Hãy chụp hoặc thêm ảnh khi chi tiêu để lưu giữ kỷ niệm nhé!'
              : 'Add photo when spending to keep your memories!'}
          </Text>
        </View>
      )}
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
  banner: {
    backgroundColor: '#064E3B',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  bannerBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  bannerBadgeText: {
    color: '#6EE7B7',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 12,
    color: '#A7F3D0',
    lineHeight: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImg: {
    width: '100%',
    height: 140,
    backgroundColor: '#E2E8F0',
  },
  cardOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardAmount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
});
