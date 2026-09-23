import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  Compass,
  Cloud,
  Sun,
  HelpCircle,
  Info,
  LogOut,
  Pencil,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileProfileScreenProps {
  onBack?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const MobileProfileScreen: React.FC<MobileProfileScreenProps> = ({
  onBack,
  onNavigateTab,
}) => {
  const { user, logout, language, setLanguage } = useApp();
  const isVi = language === 'vi';

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailValue, setEmailValue] = useState(user?.email || 'baole@example.com');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [showToast, setShowToast] = useState<string | null>(null);

  const displayName = user?.fullName || 'Lê Văn Bảo';
  const avatarUrl =
    user?.avatarUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDBWjEp71LrnWFnr38D8UDrmR2e-7t748gezNnm9O6fPkicudd7wypk7hW_uTldzDz_2Wwmh2I6oJlYBX4Q0q25sSZs2UqAMUpMJ_FBRC9yQfHnixAwXbMk40Bspci4KfTBa2Buq7iGpSJo40o7CVxidg4bp5QZ9PMylgt66TxuTKZa0UlU9Apkio-o6LiaO_lHsomjpCaZEI2yA8jNRj7eJEZ5mhPAAzjNUWiQrUIA09IFWiHTcdfZ';

  const handleActionClick = (title: string, tabTarget?: string) => {
    if (tabTarget && onNavigateTab) {
      onNavigateTab(tabTarget);
      return;
    }
    setShowToast(`Đã mở: ${title}`);
    setTimeout(() => setShowToast(null), 2000);
  };

  return (
    <div className="w-full bg-[#FDFDFD] min-h-[640px] text-neutral-800 font-sans select-none flex flex-col justify-between pb-28">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/90 text-white text-xs font-semibold py-2 px-4 rounded-full shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
          {showToast}
        </div>
      )}

      <div>
        {/* BEGIN: NavigationBackHeader */}
        <nav className="w-full px-5 py-2.5 flex items-center">
          <button
            type="button"
            aria-label="Quay lại"
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-800 stroke-[2.2]" />
          </button>
        </nav>
        {/* END: NavigationBackHeader */}

        {/* BEGIN: UserProfileSection */}
        <section className="px-6 pt-1 pb-6 flex items-center" data-purpose="user-profile">
          {/* Avatar circle container */}
          <div className="relative shrink-0">
            <img
              alt={`Ảnh đại diện ${displayName}`}
              className="w-[62px] h-[62px] rounded-full object-cover shadow-xs ring-1 ring-gray-100"
              src={avatarUrl}
            />
          </div>

          {/* User Information */}
          <div className="ml-4 flex-1 min-w-0">
            <h1 className="text-lg font-bold text-neutral-900 leading-tight truncate">
              {displayName}
            </h1>
            <div className="flex items-center mt-1 space-x-1.5 text-neutral-400">
              {isEditingEmail ? (
                <div className="flex items-center gap-1">
                  <input
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    className="text-xs px-2 py-0.5 rounded border border-neutral-300 text-neutral-800 w-36 focus:outline-none focus:border-teal-600"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(false)}
                    className="p-1 rounded bg-teal-600 text-white"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xs tracking-tight truncate text-neutral-400">
                    {emailValue}
                  </span>
                  {/* Edit Icon */}
                  <button
                    type="button"
                    aria-label="Chỉnh sửa email"
                    onClick={() => setIsEditingEmail(true)}
                    className="text-neutral-400 hover:text-neutral-600 focus:outline-none cursor-pointer p-0.5"
                  >
                    <Pencil className="w-3.5 h-3.5 stroke-[1.8]" />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
        {/* END: UserProfileSection */}

        {/* BEGIN: SettingsMenuList (Matches HTML item list) */}
        <section className="flex-1 px-5 divide-y divide-gray-100" data-purpose="settings-menu">
          {/* Item 1: Tài khoản & bảo mật */}
          <button
            type="button"
            onClick={() => handleActionClick('Tài khoản & bảo mật')}
            className="w-full py-3.5 flex items-center justify-between group transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3.5">
              <Shield className="w-5 h-5 text-neutral-700 stroke-[1.8]" />
              <span className="text-sm font-medium text-neutral-800">
                {isVi ? 'Tài khoản & bảo mật' : 'Account & Security'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
          </button>

          {/* Item 2: Thông báo */}
          <button
            type="button"
            onClick={() => handleActionClick('Thông báo')}
            className="w-full py-3.5 flex items-center justify-between group transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3.5">
              <Bell className="w-5 h-5 text-neutral-700 stroke-[1.8]" />
              <span className="text-sm font-medium text-neutral-800">
                {isVi ? 'Thông báo' : 'Notifications'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
          </button>

          {/* Item 3: Ngân sách */}
          <button
            type="button"
            onClick={() => handleActionClick('Ngân sách', 'categories')}
            className="w-full py-3.5 flex items-center justify-between group transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3.5">
              <Compass className="w-5 h-5 text-neutral-700 stroke-[1.8]" />
              <span className="text-sm font-medium text-neutral-800">
                {isVi ? 'Ngân sách' : 'Budgets'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
          </button>

          {/* Item 4: Đồng bộ dữ liệu */}
          <button
            type="button"
            onClick={() => handleActionClick('Đồng bộ dữ liệu')}
            className="w-full py-3.5 flex items-center justify-between group transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3.5">
              <Cloud className="w-5 h-5 text-neutral-700 stroke-[1.8]" />
              <span className="text-sm font-medium text-neutral-800">
                {isVi ? 'Đồng bộ dữ liệu' : 'Data Synchronization'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
          </button>

          {/* Item 5: Giao diện */}
          <button
            type="button"
            onClick={() => {
              const nextTheme = themeMode === 'light' ? 'dark' : 'light';
              setThemeMode(nextTheme);
              handleActionClick(`Chế độ giao diện: ${nextTheme === 'light' ? 'Sáng' : 'Tối'}`);
            }}
            className="w-full py-3.5 flex items-center justify-between group transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3.5">
              <Sun className="w-5 h-5 text-neutral-700 stroke-[1.8]" />
              <span className="text-sm font-medium text-neutral-800">
                {isVi ? 'Giao diện' : 'Theme'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-neutral-400">
                {themeMode === 'light' ? 'Sáng' : 'Tối'}
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
            </div>
          </button>

          {/* Item 6: Trợ giúp & Hỗ trợ */}
          <button
            type="button"
            onClick={() => handleActionClick('Trợ giúp & Hỗ trợ')}
            className="w-full py-3.5 flex items-center justify-between group transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3.5">
              <HelpCircle className="w-5 h-5 text-neutral-700 stroke-[1.8]" />
              <span className="text-sm font-medium text-neutral-800">
                {isVi ? 'Trợ giúp & Hỗ trợ' : 'Help & Support'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
          </button>

          {/* Item 7: Giới thiệu Monett */}
          <button
            type="button"
            onClick={() => handleActionClick('Giới thiệu Monett (Phiên bản v2.4)')}
            className="w-full py-3.5 flex items-center justify-between group transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3.5">
              <Info className="w-5 h-5 text-neutral-700 stroke-[1.8]" />
              <span className="text-sm font-medium text-neutral-800">
                {isVi ? 'Giới thiệu Monett' : 'About Monett'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
          </button>
        </section>
        {/* END: SettingsMenuList */}
      </div>

      {/* BEGIN: LogoutAction (Matches HTML soft red card button) */}
      <div className="px-5 py-6">
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                isVi
                  ? 'Bạn có chắc chắn muốn đăng xuất tài khoản?'
                  : 'Are you sure you want to log out?'
              )
            ) {
              logout();
            }
          }}
          className="w-full py-3 px-4 rounded-xl bg-[#FEECEE] hover:bg-[#fedde0] text-[#D83A52] flex items-center justify-center space-x-2 text-xs font-medium active:opacity-85 transition-opacity cursor-pointer shadow-xs"
        >
          <LogOut className="w-4 h-4 stroke-[1.8]" />
          <span>{isVi ? 'Đăng xuất' : 'Log Out'}</span>
        </button>
      </div>
      {/* END: LogoutAction */}
    </div>
  );
};
