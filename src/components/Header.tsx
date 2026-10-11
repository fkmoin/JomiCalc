import React from 'react';
import { Landmark, Globe, Download, Sparkles, Code2, BookmarkCheck } from 'lucide-react';

interface HeaderProps {
  useBn: boolean;
  onToggleLang: () => void;
  onOpenHopwebModal: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  useBn,
  onToggleLang,
  onOpenHopwebModal,
  savedCount,
}) => {
  return (
    <header className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-lg sticky top-0 z-50 border-b border-emerald-800/40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/20 p-2.5 rounded-2xl border border-emerald-400/30 text-emerald-400 shadow-inner">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                JomiCalc <span className="text-emerald-400">Pro</span>
              </h1>
              <span className="text-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
                v3.0
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">
              {useBn ? 'বাংলাদেশের ডিজিটাল ভূমি প্ল্যাটফর্ম ও ক্যালকুলেটর' : 'Digital Land Platform & Calculator for Bangladesh'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Hopweb Code Button */}
          <button
            onClick={onOpenHopwebModal}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 active:scale-95"
            title="Hopweb এ আপলোড করার রেডি কোড দেখুন"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Hopweb কোড</span>
          </button>

          {/* Numeral Toggle */}
          <button
            onClick={onToggleLang}
            className="bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/15 px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
            <span>{useBn ? 'সংখ্যা: বাংলা' : 'Digits: Eng'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
