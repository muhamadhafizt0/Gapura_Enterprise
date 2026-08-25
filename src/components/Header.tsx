import React, { useState, useEffect } from 'react';
import { PlusCircle, History, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { ActiveTab } from '../types';
import { GapuraLogo } from './Logo';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onReset: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onReset,
  historyCount,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="bg-[#8B0000] text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <GapuraLogo size="sm" variant="icon" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-wider uppercase leading-tight font-serif text-white">
                  GAPURA ENTERPRISE
                </h1>
                <span className="hidden sm:inline-block bg-[#84cc16]/20 text-[#bef264] text-[10px] font-bold px-2 py-0.5 rounded border border-[#84cc16]/30">
                  WEDDING & EVENT
                </span>
              </div>
              <p className="text-[11px] text-[#bef264] font-medium italic -mt-0.5">
                wedding dream solution • 0821-1887-0862
              </p>
            </div>
          </div>

          {/* Right Status & Navigation */}
          <div className="flex items-center gap-2.5">
            {/* Offline Status Badge */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition border ${
                isOnline
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/30 text-amber-200 border-amber-400/50 animate-pulse'
              }`}
              title={isOnline ? 'Online (Terhubung)' : 'Mode Offline Aktif (Bisa buat nota tanpa internet)'}
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-300" />
                  <span>Offline Ready</span>
                </>
              )}
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="hidden md:flex items-center bg-black/20 p-1 rounded-xl border border-white/10">
              <button
                id="tab-btn-create-desktop"
                type="button"
                onClick={() => onTabChange('create')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'create'
                    ? 'bg-white text-[#8B0000] shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-[#84cc16]" />
                Buat Nota
              </button>
              <button
                id="tab-btn-history-desktop"
                type="button"
                onClick={() => onTabChange('history')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'history'
                    ? 'bg-white text-[#8B0000] shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <History className="w-4 h-4 text-[#84cc16]" />
                Riwayat Nota ({historyCount})
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
