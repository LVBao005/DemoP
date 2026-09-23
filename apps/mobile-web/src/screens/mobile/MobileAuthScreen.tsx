import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export interface MobileAuthScreenProps {
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
  onBackToHome?: () => void;
}

export const MobileAuthScreen: React.FC<MobileAuthScreenProps> = ({
  initialMode = 'login',
  onSuccess,
}) => {
  const { login, register } = useAuth();
  const { language, setLanguage } = useLanguage();
  const isVi = language === 'vi';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('baole.tanquoc@gmail.com');
  const [password, setPassword] = useState('123456');
  const [fullName, setFullName] = useState('Lê Văn Bảo');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg(isVi ? 'Vui lòng nhập đầy đủ email và mật khẩu' : 'Please fill in email and password');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ email, password, fullName });
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.warn('Auth error:', err);
      // Fallback demo login if backend is not running locally
      setErrorMsg(
        err?.message ||
          (isVi
            ? 'Không kết nối được server backend. Bạn có thể nhấn nút "Vào nhanh bản thử nghiệm" bên dưới để test app!'
            : 'Could not connect to backend server. You can tap "Guest / Demo Mode" below to test the app!')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // Simulate quick demo sign in
      await login({ email: 'baole.tanquoc@gmail.com', password: 'password123' });
    } catch {
      // If backend is offline, store mock user in local session
      localStorage?.setItem?.('monett_auth_token', 'demo_mock_token');
    } finally {
      setLoading(false);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Language Toggle */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => setLanguage(isVi ? 'en' : 'vi')}
            activeOpacity={0.7}
          >
            <Ionicons name="globe-outline" size={16} color="#047857" />
            <Text style={styles.langText}>{isVi ? 'VI / EN' : 'EN / VI'}</Text>
          </TouchableOpacity>
        </View>

        {/* Mascot & Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🐸</Text>
          </View>
          <Text style={styles.brandTitle}>
            Monett<Text style={styles.dot}>.</Text>
          </Text>
          <Text style={styles.brandTagline}>Money Moments</Text>
          <Text style={styles.brandSubtitle}>
            {isVi
              ? 'Chi tiêu có chừng mực, trân trọng từng khoảnh khắc cuộc sống ✨'
              : 'Spend mindfully, cherish every moment of life ✨'}
          </Text>
        </View>

        {/* Auth Box */}
        <View style={styles.card}>
          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
              onPress={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                {isVi ? 'Đăng nhập' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
              onPress={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                {isVi ? 'Đăng ký' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {errorMsg && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.form}>
            {mode === 'register' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{isVi ? 'Họ và tên' : 'Full Name'}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={isVi ? 'Nguyễn Văn A' : 'John Doe'}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="your-email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{isVi ? 'Mật khẩu' : 'Password'}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>
                  {mode === 'login'
                    ? isVi
                      ? 'Đăng nhập ngay'
                      : 'Sign In'
                    : isVi
                    ? 'Tạo tài khoản'
                    : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Quick Demo Access Button (Super useful for Android Studio / Expo dev) */}
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={handleDemoLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.demoBtnEmoji}>✨</Text>
              <Text style={styles.demoBtnText}>
                {isVi ? 'Vào nhanh bản thử nghiệm (Demo)' : 'Try Demo / Guest Mode'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Monett App v1.0.0 • Mobile Expo & Android Ready
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 32,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  dot: {
    color: '#F59E0B',
  },
  brandTagline: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 280,
    marginTop: 8,
    lineHeight: 18,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#047857',
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#DC2626',
    lineHeight: 16,
  },
  form: {
    width: '100%',
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  eyeBtn: {
    padding: 6,
  },
  primaryBtn: {
    backgroundColor: '#047857',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 14,
    height: 46,
    marginTop: 4,
  },
  demoBtnEmoji: {
    fontSize: 16,
  },
  demoBtnText: {
    color: '#047857',
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
