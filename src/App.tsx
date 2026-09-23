import React, { useState } from 'react';
import { AppProvider, useApp } from '../apps/mobile-web/src/context/AppContext';
import { MobileApp } from '../apps/mobile-web/src/screens/mobile/MobileApp';
import { Smartphone, Monitor, Globe, RotateCcw, Sparkles } from 'lucide-react';

function MobileAppWrapper() {
  const [useDeviceFrame, setUseDeviceFrame] = useState(true);
  const { language, setLanguage } = useApp();

  const handleResetData = () => {
    if (window.confirm('Bạn có muốn đặt lại dữ liệu mẫu chi tiêu ban đầu không?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center">
      {/* Top Dev / Preview Control Bar */}
      <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Monett Mobile Dev</span>
          </div>
          <span className="hidden sm:inline-block text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">
            apps/mobile-web/src/screens/mobile
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Frame Toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setUseDeviceFrame(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                useDeviceFrame
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Khung điện thoại iPhone 16"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Khung điện thoại</span>
            </button>
            <button
              onClick={() => setUseDeviceFrame(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                !useDeviceFrame
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Toàn màn hình responsive"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Toàn màn hình</span>
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-200 transition cursor-pointer"
            title="Đổi ngôn ngữ"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">{language === 'vi' ? 'VI' : 'EN'}</span>
          </button>

          {/* Reset sample data */}
          <button
            onClick={handleResetData}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-400 hover:text-amber-300 transition cursor-pointer"
            title="Khôi phục dữ liệu mẫu"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden lg:inline">Đặt lại dữ liệu</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full flex items-center justify-center p-0 md:p-6 lg:p-8">
        {useDeviceFrame ? (
          /* Phone Mockup Frame */
          <div className="relative my-auto">
            {/* Phone Outer Shell */}
            <div className="w-[393px] h-[852px] bg-slate-900 rounded-[55px] p-[11px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-slate-800 relative">
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3 pointer-events-none">
                <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              {/* Side Buttons Visuals */}
              <div className="absolute -left-[14px] top-28 w-[3px] h-10 bg-slate-700 rounded-l-sm" />
              <div className="absolute -left-[14px] top-44 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
              <div className="absolute -left-[14px] top-60 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
              <div className="absolute -right-[14px] top-36 w-[3px] h-16 bg-slate-700 rounded-r-sm" />

              {/* Screen Area */}
              <div className="w-full h-full bg-white rounded-[44px] overflow-hidden flex flex-col relative">
                {/* Scrollable Mobile App inside Phone */}
                <div className="w-full h-full overflow-y-auto overflow-x-hidden pt-7 bg-white">
                  <MobileApp isInsideDeviceFrame={true} />
                </div>

                {/* Home Indicator Bar */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/60 rounded-full z-50 pointer-events-none" />
              </div>
            </div>
          </div>
        ) : (
          /* Responsive Centered View */
          <div className="w-full max-w-md min-h-screen bg-white shadow-2xl overflow-x-hidden flex flex-col">
            <MobileApp isInsideDeviceFrame={false} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MobileAppWrapper />
    </AppProvider>
  );
}
