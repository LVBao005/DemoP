import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export const MobileProfileScreen: React.FC = () => {
  const { user, logout, language, setLanguage } = useApp();
  const isVi = language === 'vi';

  const displayName = user?.fullName || 'Lê Văn Bảo';
  const email = user?.email || 'baole.tanquoc@gmail.com';

  const handleLogout = () => {
    Alert.alert(
      isVi ? 'Đăng xuất' : 'Sign Out',
      isVi ? 'Bạn có chắc chắn muốn đăng xuất không?' : 'Are you sure you want to sign out?',
      [
        { text: isVi ? 'Hủy' : 'Cancel', style: 'cancel' },
        { text: isVi ? 'Đăng xuất' : 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header Card */}
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <Image
            source={{
              uri:
                user?.avatarUrl ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDBWjEp71LrnWFnr38D8UDrmR2e-7t748gezNnm9O6fPkicudd7wypk7hW_uTldzDz_2Wwmh2I6oJlYBX4Q0q25sSZs2UqAMUpMJ_FBRC9yQfHnixAwXbMk40Bspci4KfTBa2Buq7iGpSJo40o7CVxidg4bp5QZ9PMylgt66TxuTKZa0UlU9Apkio-o6LiaO_lHsomjpCaZEI2yA8jNRj7eJEZ5mhPAAzjNUWiQrUIA09IFWiHTcdfZ',
            }}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{email}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🛡️ Monett Pioneer</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Settings list */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>{isVi ? 'Cài đặt chung' : 'Settings'}</Text>

        <TouchableOpacity
          style={styles.item}
          onPress={() => setLanguage(isVi ? 'en' : 'vi')}
          activeOpacity={0.7}
        >
          <View style={styles.itemLeft}>
            <Ionicons name="globe-outline" size={20} color="#047857" />
            <Text style={styles.itemText}>{isVi ? 'Ngôn ngữ' : 'Language'}</Text>
          </View>
          <Text style={styles.itemVal}>{isVi ? 'Tiếng Việt' : 'English'}</Text>
        </TouchableOpacity>

        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <Ionicons name="moon-outline" size={20} color="#64748B" />
            <Text style={styles.itemText}>{isVi ? 'Chế độ giao diện' : 'Appearance'}</Text>
          </View>
          <Text style={styles.itemVal}>{isVi ? 'Sáng' : 'Light'}</Text>
        </View>

        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#64748B" />
            <Text style={styles.itemText}>{isVi ? 'Bảo mật & Mã PIN' : 'Security'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
        </View>
      </View>

      {/* Logout button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={18} color="#EF4444" />
        <Text style={styles.logoutText}>{isVi ? 'Đăng xuất tài khoản' : 'Sign Out'}</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#10B981',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  email: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  badgeText: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  itemVal: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 16,
    paddingVertical: 14,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
});
