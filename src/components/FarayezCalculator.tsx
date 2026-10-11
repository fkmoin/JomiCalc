import React, { useState } from 'react';
import { Scale, Users, Printer, Copy, Check, Info, FileSpreadsheet } from 'lucide-react';
import { formatNum } from '../utils/conversions';

interface FarayezCalculatorProps {
  useBn: boolean;
  onShowToast: (msg: string) => void;
}

export const FarayezCalculator: React.FC<FarayezCalculatorProps> = ({ useBn, onShowToast }) => {
  const [totalLand, setTotalLand] = useState<number>(33);
  const [landPricePerShotok, setLandPricePerShotok] = useState<number>(100000);
  const [deceasedGender, setDeceasedGender] = useState<'male' | 'female'>('male');
  const [spouseCount, setSpouseCount] = useState<number>(1);
  const [sons, setSons] = useState<number>(2);
  const [daughters, setDaughters] = useState<number>(1);
  const [fatherAlive, setFatherAlive] = useState<boolean>(false);
  const [motherAlive, setMotherAlive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Farayez calculations
  const total = totalLand || 0;
  const hasChildren = sons > 0 || daughters > 0;

  let spouseShareTotal = 0;
  let spouseFractionText = '';

  if (spouseCount > 0) {
    if (deceasedGender === 'male') {
      // Wife: 1/8 if children exist, 1/4 if no children
      const fraction = hasChildren ? 1 / 8 : 1 / 4;
      spouseShareTotal = total * fraction;
      spouseFractionText = hasChildren ? '১/৮ (১২.৫%)' : '১/৪ (২৫%)';
    } else {
      // Husband: 1/4 if children exist, 1/2 if no children
      const fraction = hasChildren ? 1 / 4 : 1 / 2;
      spouseShareTotal = total * fraction;
      spouseFractionText = hasChildren ? '১/৪ (২৫%)' : '১/২ (৫০%)';
    }
  }

  // Parents
  let fatherShare = 0;
  let fatherFractionText = '';
  if (fatherAlive) {
    if (hasChildren) {
      fatherShare = total * (1 / 6);
      fatherFractionText = '১/৬ (১৬.৬৭%)';
    } else {
      fatherFractionText = 'আসাবা (অবশিষ্টাংশ)';
    }
  }

  let motherShare = 0;
  let motherFractionText = '';
  if (motherAlive) {
    if (hasChildren) {
      motherShare = total * (1 / 6);
      motherFractionText = '১/৬ (১৬.৬৭%)';
    } else {
      motherShare = total * (1 / 3);
      motherFractionText = '১/৩ (৩৩.৩৩%)';
    }
  }

  // Remaining for children (Asabah)
  let remainingForChildren = total - spouseShareTotal - fatherShare - motherShare;
  if (remainingForChildren < 0) remainingForChildren = 0;

  // If no children and father alive without sons, father gets remainder
  if (!hasChildren && fatherAlive) {
    fatherShare += remainingForChildren;
    remainingForChildren = 0;
  }

  // Children distribution (son gets 2 portions, daughter gets 1 portion)
  const totalKidUnits = sons * 2 + daughters;
  let sonTotalShare = 0;
  let daughterTotalShare = 0;
  let perSonShare = 0;
  let perDaughterShare = 0;

  if (totalKidUnits > 0) {
    sonTotalShare = sons > 0 ? (remainingForChildren * (sons * 2)) / totalKidUnits : 0;
    daughterTotalShare = daughters > 0 ? (remainingForChildren * daughters) / totalKidUnits : 0;
    perSonShare = sons > 0 ? sonTotalShare / sons : 0;
    perDaughterShare = daughters > 0 ? daughterTotalShare / daughters : 0;
  }

  // Copy text summary
  const handleCopySummary = () => {
    let summary = `ইসলামিক ফারায়েজ বণ্টন বিবরণী (মোট জমি: ${total} শতক):\n`;
    if (spouseCount > 0) {
      summary += `- ${deceasedGender === 'male' ? 'স্ত্রী' : 'স্বামী'} (${spouseCount} জন): মোট ${spouseShareTotal.toFixed(3)} শতক\n`;
    }
    if (fatherAlive) summary += `- পিতা: ${fatherShare.toFixed(3)} শতক\n`;
    if (motherAlive) summary += `- মাতা: ${motherShare.toFixed(3)} শতক\n`;
    if (sons > 0) summary += `- পুত্র (${sons} জন): প্রত্যেকে ${perSonShare.toFixed(3)} শতক (মোট ${sonTotalShare.toFixed(3)} শতক)\n`;
    if (daughters > 0) summary += `- কন্যা (${daughters} জন): প্রত্যেকে ${perDaughterShare.toFixed(3)} শতক (মোট ${daughterTotalShare.toFixed(3)} শতক)\n`;

    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('ফারায়েজ বিবরণী কপি করা হয়েছে!');
  };

  return (
    <div className="space-y-4">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-amber-950 flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>ইসলামিক ফারায়েজ ক্যালকুলেটর (শরীয়াহ ভিত্তিক উত্তরাধিকার বণ্টন)</span>
          </h2>
          <span className="text-[11px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
            হানাফি ফিকহ
          </span>
        </div>
        <p className="text-xs text-slate-600">
          কুরআনুল কারীম ও ইসলামিক উত্তরাধিকার নীতি অনুসারে মৃত ব্যক্তির স্থাবর সম্পত্তি (জমি) এবং আনুমানিক মূল্য পরিবারের সদস্যদের মধ্যে নিখুঁতভাবে বণ্টন করুন।
        </p>
      </div>

      {/* Input Parameters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              মোট সম্পত্তির পরিমাণ (শতক / ডেসিমল):
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={totalLand || ''}
              onChange={(e) => setTotalLand(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              প্রতি শতকের আনুমানিক বাজারমূল্য (টাকা - ঐচ্ছিক):
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={landPricePerShotok || ''}
              onChange={(e) => setLandPricePerShotok(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Gender of Deceased */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              মৃত ব্যক্তির পরিচয়:
            </label>
            <select
              value={deceasedGender}
              onChange={(e) => {
                const g = e.target.value as 'male' | 'female';
                setDeceasedGender(g);
                if (g === 'female') setSpouseCount(1);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            >
              <option value="male">পুরুষ (পিতা বা স্বামী প্রয়াত)</option>
              <option value="female">নারী (মাতা বা স্ত্রী প্রয়াত)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {deceasedGender === 'male' ? 'স্ত্রী জীবিত আছেন কি?' : 'স্বামী জীবিত আছেন কি?'}
            </label>
            <select
              value={spouseCount}
              onChange={(e) => setSpouseCount(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            >
              <option value={0}>না (নেই)</option>
              <option value={1}>হ্যাঁ (১ জন)</option>
              {deceasedGender === 'male' && (
                <>
                  <option value={2}>হ্যাঁ (২ জন)</option>
                  <option value={3}>হ্যাঁ (৩ জন)</option>
                  <option value={4}>হ্যাঁ (৪ জন)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Children and Parents */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              পুত্রের সংখ্যা
            </label>
            <input
              type="number"
              min="0"
              value={sons}
              onChange={(e) => setSons(parseInt(e.target.value) || 0)}
              className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-center"
            />
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              কন্যার সংখ্যা
            </label>
            <input
              type="number"
              min="0"
              value={daughters}
              onChange={(e) => setDaughters(parseInt(e.target.value) || 0)}
              className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-center"
            />
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              পিতা জীবিত?
            </label>
            <button
              type="button"
              onClick={() => setFatherAlive(!fatherAlive)}
              className={`w-full py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                fatherAlive ? 'bg-amber-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
              }`}
            >
              {fatherAlive ? 'হ্যাঁ, জীবিত' : 'না'}
            </button>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              মাতা জীবিত?
            </label>
            <button
              type="button"
              onClick={() => setMotherAlive(!motherAlive)}
              className={`w-full py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                motherAlive ? 'bg-amber-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
              }`}
            >
              {motherAlive ? 'হ্যাঁ, জীবিত' : 'না'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>শরীয়াহ মোতাবেক উত্তরাধিকারীদের প্রাপ্য অংশের তালিকা:</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="text-xs text-slate-600 hover:text-emerald-700 flex items-center gap-1 font-semibold transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>কপি</span>
            </button>
            <button
              onClick={() => window.print()}
              className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* Detailed Breakdown Cards */}
        <div className="space-y-2">
          {/* Spouse */}
          {spouseCount > 0 && (
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-amber-950 text-xs">
                  {deceasedGender === 'male' ? 'স্ত্রী' : 'স্বামী'} ({formatNum(spouseCount, useBn, 0)} জন)
                </span>
                <span className="text-[10px] text-amber-700 block">
                  শরীয়াহ অংশ: {spouseFractionText} {spouseCount > 1 && '(সব স্ত্রী মিলে সমান ভাগে পাবেন)'}
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-amber-900 text-sm">
                  {formatNum(spouseShareTotal, useBn, 3)} শতক
                </span>
                <span className="block text-[10px] text-slate-500 font-medium">
                  {formatNum(spouseShareTotal * 435.6, useBn, 1)} বর্গফুট | ৳{formatNum(spouseShareTotal * landPricePerShotok, useBn, 0)}
                </span>
                {spouseCount > 1 && (
                  <span className="block text-[10px] text-emerald-700 font-bold">
                    জনপ্রতি: {formatNum(spouseShareTotal / spouseCount, useBn, 3)} শতক
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Father */}
          {fatherAlive && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 text-xs">পিতা (১ জন)</span>
                <span className="text-[10px] text-slate-600 block">
                  শরীয়াহ অংশ: {fatherFractionText}
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900 text-sm">
                  {formatNum(fatherShare, useBn, 3)} শতক
                </span>
                <span className="block text-[10px] text-slate-500 font-medium">
                  {formatNum(fatherShare * 435.6, useBn, 1)} বর্গফুট | ৳{formatNum(fatherShare * landPricePerShotok, useBn, 0)}
                </span>
              </div>
            </div>
          )}

          {/* Mother */}
          {motherAlive && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 text-xs">মাতা (১ জন)</span>
                <span className="text-[10px] text-slate-600 block">
                  শরীয়াহ অংশ: {motherFractionText}
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900 text-sm">
                  {formatNum(motherShare, useBn, 3)} শতক
                </span>
                <span className="block text-[10px] text-slate-500 font-medium">
                  {formatNum(motherShare * 435.6, useBn, 1)} বর্গফুট | ৳{formatNum(motherShare * landPricePerShotok, useBn, 0)}
                </span>
              </div>
            </div>
          )}

          {/* Sons */}
          {sons > 0 && (
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-emerald-950 text-xs">
                  পুত্র ({formatNum(sons, useBn, 0)} জন)
                </span>
                <span className="text-[10px] text-emerald-700 block">
                  আসাবা (কন্যাদের চেয়ে দ্বিগুণ ২:১ অংশ)
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-emerald-900 text-sm">
                  মোট: {formatNum(sonTotalShare, useBn, 3)} শতক
                </span>
                <span className="block text-[11px] text-emerald-800 font-bold">
                  জনপ্রতি: {formatNum(perSonShare, useBn, 3)} শতক ({formatNum(perSonShare * 435.6, useBn, 1)} ফু²)
                </span>
                <span className="block text-[10px] text-slate-500">
                  জনপ্রতি মূল্য: ৳{formatNum(perSonShare * landPricePerShotok, useBn, 0)}
                </span>
              </div>
            </div>
          )}

          {/* Daughters */}
          {daughters > 0 && (
            <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-teal-950 text-xs">
                  কন্যা ({formatNum(daughters, useBn, 0)} জন)
                </span>
                <span className="text-[10px] text-teal-700 block">
                  আসাবা (১ গুণ অংশ)
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-teal-900 text-sm">
                  মোট: {formatNum(daughterTotalShare, useBn, 3)} শতক
                </span>
                <span className="block text-[11px] text-teal-800 font-bold">
                  জনপ্রতি: {formatNum(perDaughterShare, useBn, 3)} শতক ({formatNum(perDaughterShare * 435.6, useBn, 1)} ফু²)
                </span>
                <span className="block text-[10px] text-slate-500">
                  জনপ্রতি মূল্য: ৳{formatNum(perDaughterShare * landPricePerShotok, useBn, 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
