import React, { useState, useEffect } from 'react';
import {
  Zap,
  RotateCcw,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Trash2,
  ChevronDown,
  Globe2,
  Sparkles,
  Share2,
} from 'lucide-react';
import { LandUnit, CalculationRecord } from '../types';
import {
  UNIT_RATES_SQFT,
  UNIT_LABELS,
  formatNum,
  convertFromSqFt,
  getCombinedBighaKathaShotok,
} from '../utils/conversions';

interface UnitConverterProps {
  useBn: boolean;
  onShowToast: (msg: string) => void;
  savedCalculations: CalculationRecord[];
  onSaveCalculation: (rec: CalculationRecord) => void;
  onDeleteSaved: (id: string) => void;
  onClearAllSaved: () => void;
}

export const UnitConverter: React.FC<UnitConverterProps> = ({
  useBn,
  onShowToast,
  savedCalculations,
  onSaveCalculation,
  onDeleteSaved,
  onClearAllSaved,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<LandUnit>('shotok');
  const [inputValue, setInputValue] = useState<string>('1');
  const [showExtended, setShowExtended] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [calcNote, setCalcNote] = useState<string>('');

  // Numerical value
  const numVal = parseFloat(inputValue);
  const validNum = !isNaN(numVal) && numVal >= 0 ? numVal : 0;
  const totalSqFt = validNum * (UNIT_RATES_SQFT[selectedUnit] || 1);
  const converted = convertFromSqFt(totalSqFt);

  // Apply preset
  const handlePreset = (unit: LandUnit, val: number) => {
    setSelectedUnit(unit);
    setInputValue(val.toString());
  };

  // Clear
  const handleClear = () => {
    setInputValue('');
  };

  // Copy primary input
  const handleCopy = () => {
    if (!inputValue) return;
    const textToCopy = `${inputValue} ${UNIT_LABELS[selectedUnit].bn} = ${converted.shotok.toFixed(3)} শতক (${converted.sqft.toFixed(2)} বর্গফুট)`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে!');
  };

  // Save calculation
  const handleSave = () => {
    if (!inputValue || validNum <= 0) {
      onShowToast('প্রথমে একটি সঠিক পরিমাপ লিখুন!');
      return;
    }
    const newRecord: CalculationRecord = {
      id: Date.now().toString(),
      unit: selectedUnit,
      unitLabel: UNIT_LABELS[selectedUnit].bn,
      inputValue: validNum,
      shotok: converted.shotok,
      sqft: converted.sqft,
      katha: converted.katha,
      bigha: converted.bigha,
      acre: converted.acre,
      timestamp: Date.now(),
      note: calcNote.trim() || undefined,
    };
    onSaveCalculation(newRecord);
    setCalcNote('');
    onShowToast('হিসাব সফলভাবে সেভ করা হয়েছে!');
  };

  return (
    <div className="space-y-4">
      {/* Quick Presets Bar */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-2xl p-3 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            দ্রুত বাছাইকৃত পরিমাপ (Presets):
          </span>
          <button
            onClick={handleClear}
            className="text-red-600 hover:text-red-700 text-[11px] flex items-center gap-1 font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> রিসেট
          </button>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => handlePreset('shotok', 1)}
            className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 font-bold text-emerald-800 shadow-xs whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            ⚡ ১ শতক
          </button>
          <button
            onClick={() => handlePreset('shotok', 5)}
            className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 font-bold text-emerald-800 shadow-xs whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            ⚡ ৫ শতক
          </button>
          <button
            onClick={() => handlePreset('shotok', 10)}
            className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 font-bold text-emerald-800 shadow-xs whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            ⚡ ১০ শতক
          </button>
          <button
            onClick={() => handlePreset('katha', 1)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 shadow-xs whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            🏠 ১ কাঠা
          </button>
          <button
            onClick={() => handlePreset('katha', 5)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 shadow-xs whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            🏠 ৫ কাঠা
          </button>
          <button
            onClick={() => handlePreset('bigha', 1)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 shadow-xs whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            🌾 ১ বিঘা
          </button>
          <button
            onClick={() => handlePreset('acre', 1)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 shadow-xs whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            🌍 ১ একর
          </button>
          <button
            onClick={() => handlePreset('kani_ctg', 1)}
            className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 font-bold text-amber-800 shadow-xs whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            🌿 ১ কানি (চট্টগ্রাম)
          </button>
        </div>
      </div>

      {/* Main Input Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label htmlFor="primary-unit-select" className="text-xs font-bold text-slate-700">
            জমির প্রধান একক নির্বাচন করুন:
          </label>
          <select
            id="primary-unit-select"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value as LandUnit)}
            className="bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="shotok">শতক / শতাংশ / ডেসিমল (৪৩৫.৬ বর্গফুট)</option>
            <option value="katha">কাঠা (৭২০ বর্গফুট / ১৬ ছটাক)</option>
            <option value="bigha">বিঘা (১৪,৪০০ বর্গফুট / ২০ কাঠা)</option>
            <option value="acre">একর (৪৩,৫৬০ বর্গফুট / ১০০ শতক)</option>
            <option value="sqft">বর্গফুট (Square Feet)</option>
            <option value="hectare">হেক্টর (১০৭,৬৩৯ বর্গফুট / ~২.৪৭ একর)</option>
            <option value="kani_ctg">কানি - চট্টগ্রাম (৪০ শতক / ১৭,৪২৪ ফু²)</option>
            <option value="kani_tripura">কানি - কুমিল্লা/ত্রিপুরা (২৪ কাঠা / ১৭,২৮০ ফু²)</option>
            <option value="keyar">কিয়ার - সিলেট (৩০ শতক / ১৩,০৬৮ ফু²)</option>
            <option value="chhatak">ছটাক (৪৫ বর্গফুট)</option>
            <option value="gonda">গণ্ডা (৮৭১.২ বর্গফুট)</option>
          </select>
        </div>

        {/* Input Field */}
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-300 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-emerald-950">
              {UNIT_LABELS[selectedUnit].bn}-এর পরিমাণ লিখুন:
            </label>
            <span className="text-[11px] font-semibold text-emerald-700">
              ভিত্তি: {UNIT_LABELS[selectedUnit].subtitle}
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              step="any"
              min="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="যেমন: ৫"
              className="w-full bg-white border border-emerald-400 rounded-xl py-3 px-3.5 pr-12 text-emerald-950 font-black text-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition shadow-inner"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-emerald-700 transition cursor-pointer"
              title="কপি করুন"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Combined Bigha-Katha-Shotok Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-3.5 rounded-2xl text-center shadow-inner border border-emerald-900">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">
            সমন্বিত বিঘা-কাঠা-শতক বিভাজন
          </span>
          <div className="text-base sm:text-lg font-black text-white tracking-wide">
            {getCombinedBighaKathaShotok(converted.shotok, useBn)}
          </div>
        </div>
      </div>

      {/* Primary Results Grid */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-4 shadow-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>মূল ফলাফল একনজরে</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="হিসাবের নাম/নোট (ঐচ্ছিক)"
              value={calcNote}
              onChange={(e) => setCalcNote(e.target.value)}
              className="hidden sm:block text-[11px] bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-400 w-36"
            />
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>সেভ</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 hover:border-emerald-400/50 transition">
            <span className="block text-[11px] text-slate-300 mb-0.5">বর্গফুট (Sq. Ft)</span>
            <span className="text-lg font-black text-emerald-300">{formatNum(converted.sqft, useBn, 2)}</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 hover:border-amber-400/50 transition">
            <span className="block text-[11px] text-emerald-300 font-semibold mb-0.5">শতক / ডেসিমল</span>
            <span className="text-lg font-black text-amber-300">{formatNum(converted.shotok, useBn, 3)}</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 hover:border-blue-400/50 transition">
            <span className="block text-[11px] text-slate-300 mb-0.5">কাঠা</span>
            <span className="text-lg font-black text-blue-300">{formatNum(converted.katha, useBn, 3)}</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 hover:border-purple-400/50 transition">
            <span className="block text-[11px] text-slate-300 mb-0.5">বিঘা</span>
            <span className="text-lg font-black text-purple-300">{formatNum(converted.bigha, useBn, 3)}</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 hover:border-teal-400/50 transition col-span-2 sm:col-span-1">
            <span className="block text-[11px] text-slate-300 mb-0.5">একর</span>
            <span className="text-lg font-black text-teal-300">{formatNum(converted.acre, useBn, 4)}</span>
          </div>
        </div>
      </div>

      {/* Extended & Regional Units Accordion */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowExtended(!showExtended)}
          className="w-full bg-slate-50 hover:bg-slate-100 p-3.5 font-bold text-xs text-slate-800 flex items-center justify-between transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-600" />
            <span>আঞ্চলিক ও অন্যান্য এককসমূহ (কানি, কিয়ার, গণ্ডা, কড়া, ক্রান্তি, হেক্টর...)</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform ${showExtended ? 'rotate-180' : ''}`}
          />
        </button>

        {showExtended && (
          <div className="p-3.5 border-t border-slate-200 bg-slate-50/70 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="block text-[10px] font-semibold text-slate-500">হেক্টর</span>
                <span className="text-sm font-bold text-slate-900">{formatNum(converted.hectare, useBn, 4)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="block text-[10px] font-semibold text-slate-500">বর্গমিটার (m²)</span>
                <span className="text-sm font-bold text-slate-900">{formatNum(converted.sqmeter, useBn, 2)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="block text-[10px] font-semibold text-slate-500">বর্গগজ (Sq. Yd)</span>
                <span className="text-sm font-bold text-slate-900">{formatNum(converted.sqyd, useBn, 2)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="block text-[10px] font-semibold text-slate-500">ছটাক</span>
                <span className="text-sm font-bold text-slate-900">{formatNum(converted.chhatak, useBn, 2)}</span>
              </div>

              {/* Regional Bangladesh Units */}
              <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                <span className="block text-[10px] font-bold text-amber-900">কানি (চট্টগ্রাম ৪০ শতক)</span>
                <span className="text-sm font-bold text-amber-950">{formatNum(converted.kani_ctg, useBn, 3)}</span>
              </div>
              <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                <span className="block text-[10px] font-bold text-amber-900">কানি (কুমিল্লা/ত্রিপুরা ২৪ কাঠা)</span>
                <span className="text-sm font-bold text-amber-950">{formatNum(converted.kani_tripura, useBn, 3)}</span>
              </div>
              <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                <span className="block text-[10px] font-bold text-amber-900">কিয়ার (সিলেট ৩০ শতক)</span>
                <span className="text-sm font-bold text-amber-950">{formatNum(converted.keyar, useBn, 3)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="block text-[10px] font-semibold text-slate-500">গণ্ডা (৪ কড়া)</span>
                <span className="text-sm font-bold text-slate-900">{formatNum(converted.gonda, useBn, 2)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="block text-[10px] font-semibold text-slate-500">কড়া (৩ ক্রান্তি)</span>
                <span className="text-sm font-bold text-slate-900">{formatNum(converted.kora, useBn, 2)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="block text-[10px] font-semibold text-slate-500">ক্রান্তি (২০ তিল)</span>
                <span className="text-sm font-bold text-slate-900">{formatNum(converted.kranti, useBn, 2)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="block text-[10px] font-semibold text-slate-500">তিল</span>
                <span className="text-sm font-bold text-slate-900">{formatNum(converted.til, useBn, 2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Calculations Box */}
      {savedCalculations.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b pb-2">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              <span>সেভ করা হিসাবসমূহ ({useBn ? formatNum(savedCalculations.length, true, 0) : savedCalculations.length}টি)</span>
            </span>
            <button
              onClick={onClearAllSaved}
              className="text-red-500 hover:text-red-700 text-[11px] font-semibold transition cursor-pointer"
            >
              সব মুছুন
            </button>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {savedCalculations.map((rec) => (
              <div
                key={rec.id}
                className="bg-slate-50 hover:bg-emerald-50/40 p-2.5 rounded-xl border border-slate-200 flex justify-between items-center text-xs transition"
              >
                <div>
                  <span className="font-bold text-slate-800">
                    {formatNum(rec.inputValue, useBn, 2)} {rec.unitLabel}
                  </span>
                  {rec.note && <span className="ml-1.5 text-emerald-700 font-medium">({rec.note})</span>}
                  <span className="text-slate-500 block text-[10px]">
                    = {formatNum(rec.shotok, useBn, 3)} শতক | {formatNum(rec.sqft, useBn, 1)} ফু² ({new Date(rec.timestamp).toLocaleDateString('bn-BD')})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedUnit(rec.unit);
                      setInputValue(rec.inputValue.toString());
                      onShowToast('হিসাব লোড করা হয়েছে');
                    }}
                    className="text-emerald-700 font-bold px-2.5 py-1 bg-emerald-100/70 hover:bg-emerald-200/80 rounded-lg text-xs transition cursor-pointer"
                  >
                    লোড
                  </button>
                  <button
                    onClick={() => onDeleteSaved(rec.id)}
                    className="text-slate-400 hover:text-red-600 p-1 transition cursor-pointer"
                    title="মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
