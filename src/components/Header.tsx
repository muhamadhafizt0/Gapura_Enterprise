import React from 'react';
import { PlusCircle, History, Sparkles } from 'lucide-react';
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
    </header>
  );
};
