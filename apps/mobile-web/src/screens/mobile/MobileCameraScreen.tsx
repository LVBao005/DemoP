import React, { useState, useRef, useEffect } from 'react';
import {
  Zap,
  RotateCcw,
  Plus,
  Image as ImageIcon,
  Mic,
  BarChart2,
  Calendar,
  Home,
  Wallet,
  Settings,
  X,
  ChevronDown,
  Camera,
  Check,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  Signal,
  Wifi,
  BatteryFull,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MobileCameraScreenProps {
  onBack: () => void;
  onNavigateTab?: (tab: 'home' | 'analytics' | 'wallets') => void;
  onSaveMoment: (moment: {
    photoUrl: string;
    title: string;
    amount: number;
    category: string;
    note?: string;
  }) => void;
}

const CATEGORIES = [
  { id: 'food', name: 'Ẩm thực', icon: '🍜' },
  { id: 'cafe', name: 'Cà phê', icon: '☕' },
  { id: 'shopping', name: 'Mua sắm', icon: '🛍️' },
  { id: 'transport', name: 'Di chuyển', icon: '🛵' },
  { id: 'entertainment', name: 'Giải trí', icon: '✨' },
  { id: 'bills', name: 'Hóa đơn', icon: '🧾' },
];

export const MobileCameraScreen: React.FC<MobileCameraScreenProps> = ({
  onBack,
  onNavigateTab,
  onSaveMoment,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Screen flow: 'viewfinder' (Screen 2A) -> 'add_expense' (Screen 2B)
  const [currentStep, setCurrentStep] = useState<'viewfinder' | 'add_expense'>('viewfinder');

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [hasCameraError, setHasCameraError] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<'1x' | '2x'>('1x');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Captured photo
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Form states for Screen 2B (Thêm giao dịch)
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('85.000');
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string; icon: string }>(
    CATEGORIES[0]
  );
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false);

  // Default sample image matches HTML 2A and 2B: Tô bún bò Huế thơm ngon
  const defaultSamplePhoto =
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=1000&auto=format&fit=crop';

  // Start camera stream when on 'viewfinder' step
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setHasCameraError(false);
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: cameraFacing,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = newStream;
        setStream(newStream);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.play().catch((err) => console.warn('Video play err:', err));
        }
      } catch (err) {
        console.warn('Camera access unavailable, using high-fidelity fallback viewfinder:', err);
        setHasCameraError(true);
      }
    };

    if (currentStep === 'viewfinder') {
      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraFacing, currentStep]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleToggleFacing = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleToggleZoom = () => {
    setZoomLevel((prev) => (prev === '1x' ? '2x' : '1x'));
  };

  const handleCapturePhoto = () => {
    if (isCapturing) return;
    setIsCapturing(true);

    // Flash animation simulation
    if (flashOn) {
      const flashEl = document.getElementById('camera-flash-overlay');
      if (flashEl) {
        flashEl.style.opacity = '0.9';
        setTimeout(() => {
          flashEl.style.opacity = '0';
        }, 150);
      }
    }

    setTimeout(() => {
      if (videoRef.current && canvasRef.current && !hasCameraError) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCapturedPhoto(dataUrl);
        }
      } else {
        setCapturedPhoto(defaultSamplePhoto);
      }

      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }

      setIsCapturing(false);
      // Seamlessly transition to Screen 2B: Thêm giao dịch
      setCurrentStep('add_expense');
    }, 120);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedPhoto(event.target.result as string);
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
          setStream(null);
        }
        setCurrentStep('add_expense');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceInput = () => {
    setIsVoiceListening(true);
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript || '';
          if (transcript) {
            setExpenseTitle(transcript);
          }
          setIsVoiceListening(false);
        };
        recognition.onerror = () => setIsVoiceListening(false);
        recognition.onend = () => setIsVoiceListening(false);
        recognition.start();
      } catch (e) {
        setIsVoiceListening(false);
      }
    } else {
      setTimeout(() => {
        setIsVoiceListening(false);
        setExpenseTitle('Bún bò Huế đặc biệt');
      }, 800);
    }
  };

  const handleDownloadPhoto = () => {
    const photo = capturedPhoto || defaultSamplePhoto;
    const link = document.createElement('a');
    link.href = photo;
    link.download = `snapmoney-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveExpense = () => {
    const numericStr = expenseAmount.replace(/[^0-9]/g, '');
    const parsedAmount = parseInt(numericStr, 10) || 0;

    const finalTitle = expenseTitle.trim() || selectedCategory.name || 'Chi tiêu ăn uống';

    onSaveMoment({
      photoUrl: capturedPhoto || defaultSamplePhoto,
      title: finalTitle,
      amount: parsedAmount > 0 ? parsedAmount : 85000,
      category: selectedCategory.name,
      note: expenseTitle.trim() || undefined,
    });

    try {
      confetti({
        particleCount: 60,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  // =========================================================================
  // RENDER STEP 2B: THÊM GIAO DỊCH (BỐ CỤC CHUẨN FILE HTML ĐƯỢC CUNG CẤP)
  // =========================================================================
  if (currentStep === 'add_expense') {
    return (
      <div
        className="relative w-full h-full min-h-[640px] max-h-[100dvh] bg-[#0B0E14] text-white overflow-hidden shadow-2xl flex flex-col justify-between font-sans select-none"
        data-purpose="mobile-container"
      >
        {/* BEGIN: CameraBackground - Displays captured receipt with smooth gradient transition */}
        <div
          className="absolute inset-x-0 top-0 h-[64%] overflow-hidden z-0 pointer-events-none"
          data-purpose="camera-preview"
        >
          <img
            alt="Camera capture background bun bo pho"
            className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
            src={capturedPhoto || defaultSamplePhoto}
          />
          {/* Smooth linear gradient fade to deep dark base */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-50% to-[#0B0E14]" />
        </div>
        {/* END: CameraBackground */}

        {/* BEGIN: TopStatusBarAndNavigation */}
        <div className="relative z-10 w-full pt-3 px-6">
          {/* iOS Status Bar */}
          <div
            className="w-full flex items-center justify-between text-white text-[14px] font-semibold tracking-tight pb-2"
            data-purpose="ios-status-bar"
          >
            <span className="pl-1 text-[15px] font-medium">9:41</span>
            {/* Dynamic Island Pill Minimal Placeholder */}
            <div className="w-24 h-4 bg-black/80 rounded-full mx-auto" />
            {/* System Icons */}
            <div className="flex items-center space-x-2 text-white">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryFull className="w-4 h-4" />
            </div>
          </div>

          {/* Top Navigation Bar */}
          <nav className="flex items-center justify-between mt-2.5" data-purpose="top-navigation">
            {/* Close / Retake Button */}
            <button
              type="button"
              aria-label="Đóng"
              onClick={() => {
                setCurrentStep('viewfinder');
                setCapturedPhoto(null);
              }}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-white/30 transition-all active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Title */}
            <h1 className="text-white text-[19px] font-bold tracking-tight">Thêm giao dịch</h1>

            {/* Download / Share Receipt Button */}
            <button
              type="button"
              aria-label="Tải về"
              onClick={handleDownloadPhoto}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-white/30 transition-all active:scale-95 cursor-pointer"
              title="Tải ảnh về máy"
            >
              <Download className="w-5 h-5 stroke-[2.2]" />
            </button>
          </nav>
        </div>
        {/* END: TopStatusBarAndNavigation */}

        {/* BEGIN: TransactionControlsAndInputForm */}
        <main
          className="relative z-10 w-full px-5 pb-4 flex flex-col justify-end mt-auto"
          data-purpose="transaction-form"
        >
          {/* Segmented Type Selector (Chi tiêu / Thu nhập) */}
          <div className="flex items-center justify-center gap-3.5 mb-3.5" data-purpose="transaction-type-toggle">
            {/* Tab: Chi tiêu */}
            <button
              type="button"
              onClick={() => setTransactionType('expense')}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold text-[15px] transition-transform active:scale-95 cursor-pointer ${
                transactionType === 'expense'
                  ? 'bg-[#FF4B60] hover:bg-[#ff3b52] text-white shadow-lg shadow-[#FF4B60]/25'
                  : 'bg-[#252834]/85 hover:bg-[#2e3241] text-[#9EA3B0] hover:text-white backdrop-blur-sm'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 stroke-white stroke-[2.5]" />
              <span>Chi tiêu</span>
            </button>

            {/* Tab: Thu nhập */}
            <button
              type="button"
              onClick={() => setTransactionType('income')}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-[15px] transition-all backdrop-blur-sm active:scale-95 cursor-pointer ${
                transactionType === 'income'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-[#252834]/85 hover:bg-[#2e3241] text-[#9EA3B0] hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              <span>Thu nhập</span>
            </button>
          </div>

          {/* Quick Action Chips (Category & Date) */}
          <div className="flex items-center justify-center gap-2.5 mb-3.5" data-purpose="action-chips">
            {/* Add Category Button / Selected Category Chip */}
            <button
              type="button"
              onClick={() => setShowCategoryDrawer(!showCategoryDrawer)}
              className="flex items-center gap-1.5 bg-[#252834]/90 hover:bg-[#303444] text-white text-[14px] font-medium px-4 py-2 rounded-full border border-white/5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>{selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : 'Thêm danh mục'}</span>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold leading-none">
                +
              </span>
            </button>

            {/* Date Button */}
            <button
              type="button"
              className="bg-[#252834]/90 hover:bg-[#303444] text-white text-[14px] font-medium px-4 py-2 rounded-full border border-white/5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Hôm nay
            </button>
          </div>

          {/* Category Quick Drawer Dropdown if open */}
          {showCategoryDrawer && (
            <div className="mb-3 p-2 bg-[#252834]/95 backdrop-blur-md rounded-2xl border border-white/10 flex gap-2 overflow-x-auto scrollbar-none animate-in fade-in slide-in-from-bottom-2 duration-150">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowCategoryDrawer(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-all ${
                    selectedCategory.id === cat.id
                      ? 'bg-[#FF4B60] text-white font-bold shadow-sm'
                      : 'bg-[#1a1d26] text-zinc-300 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Amount and Description Input Card Container */}
          <section
            className="w-full bg-[#1F222C] rounded-[24px] py-4 px-5 text-center flex flex-col items-center justify-center border border-white/[0.08] shadow-xl backdrop-blur-md mb-4"
            data-purpose="amount-card"
          >
            {/* Amount Display Row with Clear Button */}
            <div className="flex items-center justify-center gap-2 w-full my-1">
              {/* Big Value Display */}
              <div className="text-[34px] font-bold text-white tracking-tight flex items-baseline justify-center">
                <input
                  type="text"
                  value={expenseAmount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    if (!raw) {
                      setExpenseAmount('0');
                    } else {
                      setExpenseAmount(parseInt(raw, 10).toLocaleString('vi-VN'));
                    }
                  }}
                  className="bg-transparent border-none text-center font-bold text-[34px] text-white tracking-tight focus:ring-0 focus:outline-none p-0 w-36 max-w-full"
                />
                <span className="ml-1 text-[30px] font-semibold underline underline-offset-4 decoration-1">đ</span>
              </div>

              {/* Clear Amount Circle Icon */}
              <button
                type="button"
                aria-label="Xóa giá trị"
                onClick={() => setExpenseAmount('0')}
                className="w-5 h-5 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center text-white text-xs ml-1 transition-colors active:scale-95 cursor-pointer"
              >
                <X className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>

            {/* Note / Description Input Placeholder */}
            <div className="w-full text-center mt-0.5">
              <input
                className="bg-transparent border-none text-center text-[#8D93A5] placeholder-[#8D93A5] text-[15px] font-normal focus:ring-0 focus:outline-none w-full p-0"
                placeholder="Nhập mô tả"
                type="text"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
              />
            </div>
          </section>

          {/* Primary Action CTA Button (Lưu) */}
          <button
            type="button"
            onClick={handleSaveExpense}
            className="w-full h-[52px] bg-[#DF24B0] hover:bg-[#ce1e9f] active:scale-[0.98] transition-all rounded-full flex items-center justify-center gap-2 text-white font-bold text-[17px] shadow-lg shadow-[#DF24B0]/30 cursor-pointer"
            data-purpose="save-button"
          >
            <Check className="w-5 h-5 stroke-white stroke-[3]" />
            <span>Lưu</span>
          </button>

          {/* iOS Home Indicator Bar */}
          <div className="w-full flex justify-center items-center pt-5 pb-1" data-purpose="home-indicator">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        </main>
        {/* END: TransactionControlsAndInputForm */}
      </div>
    );
  }

  // =========================================================================
  // RENDER STEP 2A: CAMERA VIEWFINDER (Screen 2A)
  // =========================================================================
  return (
    <div className="relative w-full h-full min-h-[640px] max-h-[100dvh] bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans border-0 sm:border-[4px] sm:border-[#6b21a8]/60 sm:rounded-[44px] shadow-[0_0_50px_rgba(147,51,234,0.3)]">
      {/* Hidden canvas for snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input for album picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Flash simulation overlay */}
      <div
        id="camera-flash-overlay"
        className="absolute inset-0 bg-white pointer-events-none z-40 opacity-0 transition-opacity duration-150"
      />

      {/* ============================================================ */}
      {/* BEGIN: TopBarControls (Matches HTML)                         */}
      {/* ============================================================ */}
      <div className="relative z-30 flex justify-between items-center px-5 pt-3.5 pb-1 shrink-0">
        {/* Top Left Flash Button (glass-btn) */}
        <button
          type="button"
          aria-label="Flash"
          onClick={() => setFlashOn(!flashOn)}
          className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-lg active:scale-95 transition-transform shadow-md backdrop-blur-md cursor-pointer ${
            flashOn ? 'bg-amber-400/90 text-slate-950 font-bold' : 'bg-[#1e1e23]/65 text-yellow-400'
          }`}
        >
          <Zap className="w-5 h-5 fill-current" />
        </button>

        {/* Top Center Close / Back Button to return home */}
        <button
          type="button"
          aria-label="Đóng camera"
          onClick={onBack}
          className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-white/80 hover:text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Đóng</span>
        </button>

        {/* Top Right Settings Button (glass-btn) */}
        <button
          type="button"
          aria-label="Settings"
          onClick={() => {
            if (onNavigateTab) {
              onNavigateTab('wallets');
            } else {
              onBack();
            }
          }}
          className="w-10 h-10 rounded-full bg-[#1e1e23]/65 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white active:scale-95 transition-transform shadow-md cursor-pointer"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
      {/* END: TopBarControls */}

      {/* ============================================================ */}
      {/* BEGIN: ViewfinderArea (Matches HTML Viewfinder exactly)      */}
      {/* ============================================================ */}
      <main className="relative flex-1 mx-3 my-2 rounded-[32px] overflow-hidden bg-zinc-900 flex items-center justify-center border border-white/10">
        {/* Camera Feed Background Simulation / Real Video */}
        <div className="absolute inset-0 bg-[#16171a] flex items-center justify-center overflow-hidden">
          {!hasCameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-transform duration-300 ${
                zoomLevel === '2x' ? 'scale-125' : 'scale-100'
              } ${cameraFacing === 'user' ? '-scale-x-100' : ''}`}
            />
          ) : (
            <img
              alt="Tô bún bò Huế thơm ngon ngắm qua camera"
              className={`w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-300 ${
                zoomLevel === '2x' ? 'scale-125' : 'scale-100'
              }`}
              src={defaultSamplePhoto}
            />
          )}

          {/* Subtle Viewfinder Dark Overlay Gradient at Bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Viewfinder Overlay Right Controls */}
        <aside
          aria-label="Camera Controls"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 flex flex-col space-y-3.5 z-20"
        >
          {/* 2x Zoom Button */}
          <button
            type="button"
            onClick={handleToggleZoom}
            className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/15 text-white font-bold text-xs flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer ${
              zoomLevel === '2x' ? 'bg-purple-600 text-white border-purple-300' : 'bg-black/60'
            }`}
          >
            {zoomLevel}
          </button>

          {/* Flash Light Button */}
          <button
            type="button"
            onClick={() => setFlashOn(!flashOn)}
            className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/15 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer ${
              flashOn ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-black/60 text-yellow-400'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
          </button>

          {/* Camera Flip Button */}
          <button
            type="button"
            onClick={handleToggleFacing}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </aside>

        {/* Magenta Floating Add Button (Center Bottom of Viewport) - Matches HTML */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
          <button
            type="button"
            aria-label="Quick Add Entry"
            onClick={handleCapturePhoto}
            className="w-14 h-14 rounded-full bg-[#c026d3] hover:bg-[#d946ef] text-white flex items-center justify-center text-2xl font-light shadow-xl shadow-fuchsia-600/40 active:scale-95 transition-all cursor-pointer"
            style={{
              boxShadow: '0 0 20px 4px rgba(204, 43, 230, 0.5)',
            }}
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>
      </main>
      {/* END: ViewfinderArea */}

      {/* ============================================================ */}
      {/* BEGIN: BottomControlsSection (Matches HTML bottom section)   */}
      {/* ============================================================ */}
      <footer className="relative z-20 flex flex-col items-center pb-2 pt-1 shrink-0">
        {/* Primary Shutter & Side Action Controls */}
        <div className="w-full px-12 flex items-center justify-between mb-3">
          {/* Photo Gallery / Thumbnail Button */}
          <button
            type="button"
            aria-label="Gallery"
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 flex items-center justify-center text-white text-2xl active:scale-90 transition-transform opacity-90 hover:opacity-100 cursor-pointer"
          >
            <ImageIcon className="w-6 h-6 text-white" />
          </button>

          {/* Large White Camera Shutter Button with Concentric Rings */}
          <button
            type="button"
            aria-label="Capture Receipt"
            onClick={handleCapturePhoto}
            disabled={isCapturing}
            className="relative flex items-center justify-center group active:scale-95 transition-transform cursor-pointer"
          >
            <div
              className="w-[74px] h-[74px] rounded-full border-[4px] border-white/80 flex items-center justify-center p-1 bg-transparent"
              style={{
                boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.25)',
              }}
            >
              <div className="w-full h-full bg-white rounded-full shadow-inner flex items-center justify-center group-hover:scale-95 transition-transform" />
            </div>
          </button>

          {/* Microphone / Voice Input Button */}
          <button
            type="button"
            aria-label="Voice Input"
            onClick={handleVoiceInput}
            className={`w-11 h-11 flex items-center justify-center text-2xl active:scale-90 transition-transform cursor-pointer ${
              isVoiceListening
                ? 'text-rose-500 animate-pulse scale-110'
                : 'text-white opacity-90 hover:opacity-100'
            }`}
          >
            <Mic className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Statistics Pill ("Thống kê") - Matches HTML */}
        <div className="mb-3 flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              if (onNavigateTab) {
                onNavigateTab('analytics');
              } else {
                onBack();
              }
            }}
            className="px-5 py-2 rounded-full bg-[#1b1e28] border border-white/10 text-white text-sm font-medium flex items-center space-x-2 shadow-md active:bg-[#252a38] transition-colors cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold">Thống kê</span>
          </button>

          {/* Downward Chevron */}
          <div className="text-zinc-500 text-xs mt-1 -mb-1 animate-bounce">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Bottom Dock Bar */}
        <nav
          aria-label="Thanh điều hướng nhanh"
          className="w-full max-w-[280px] bg-[#1a1d26]/80 backdrop-blur-md rounded-2xl px-6 py-2.5 flex items-center justify-between border border-white/10 shadow-lg"
        >
          {/* History / Calendar Tab */}
          <button
            type="button"
            aria-label="Lịch sử"
            onClick={() => {
              if (onNavigateTab) {
                onNavigateTab('home');
              } else {
                onBack();
              }
            }}
            className="text-zinc-400 hover:text-white text-lg p-1.5 active:scale-90 transition-transform cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
          </button>

          {/* Active Home Tab */}
          <button
            type="button"
            aria-label="Trang chủ"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-[#232733] border border-white/10 text-white flex items-center justify-center text-base shadow-sm active:scale-90 transition-transform cursor-pointer"
          >
            <Home className="w-4 h-4" />
          </button>

          {/* Wallet / Cards Tab */}
          <button
            type="button"
            aria-label="Ví tiền"
            onClick={() => {
              if (onNavigateTab) {
                onNavigateTab('wallets');
              } else {
                onBack();
              }
            }}
            className="text-zinc-400 hover:text-white text-lg p-1.5 active:scale-90 transition-transform cursor-pointer"
          >
            <Wallet className="w-5 h-5" />
          </button>
        </nav>

        {/* iOS Home Indicator */}
        <div className="w-32 h-1 bg-white/40 rounded-full mt-3 mb-0.5" />
      </footer>
      {/* END: BottomControlsSection */}
    </div>
  );
};
