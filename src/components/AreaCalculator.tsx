import React, { useState } from 'react';
import { Ruler, ShieldAlert, Sparkles, Copy, Check, Fence } from 'lucide-react';
import { formatNum, getCombinedBighaKathaShotok } from '../utils/conversions';

interface AreaCalculatorProps {
  useBn: boolean;
  onShowToast: (msg: string) => void;
}

type ShapeKey = 'rect' | 'irregular_avg' | 'irregular_heron' | 'triangle' | 'circle';

export const AreaCalculator: React.FC<AreaCalculatorProps> = ({ useBn, onShowToast }) => {
  const [shape, setShape] = useState<ShapeKey>('rect');

  // Rectangle
  const [rectLen, setRectLen] = useState<number>(100);
  const [rectWid, setRectWid] = useState<number>(50);

  // Irregular average
  const [irrN, setIrrN] = useState<number>(80);
  const [irrS, setIrrS] = useState<number>(85);
  const [irrE, setIrrE] = useState<number>(40);
  const [irrW, setIrrW] = useState<number>(45);

  // Irregular Heron (4 sides + diagonal)
  const [ihA, setIhA] = useState<number>(80);
  const [ihB, setIhB] = useState<number>(40);
  const [ihC, setIhC] = useState<number>(85);
  const [ihD, setIhD] = useState<number>(45);
  const [ihDiag, setIhDiag] = useState<number>(90);

  // Triangle
  const [triA, setTriA] = useState<number>(60);
  const [triB, setTriB] = useState<number>(80);
  const [triC, setTriC] = useState<number>(100);

  // Circle
  const [circleMode, setCircleMode] = useState<'radius' | 'diameter'>('radius');
  const [circleVal, setCircleVal] = useState<number>(30);

  // Boundary fencing cost
  const [showFence, setShowFence] = useState<boolean>(false);
  const [fenceRate, setFenceRate] = useState<number>(150); // taka per foot

  // Calculations
  let totalSqFt = 0;
  let perimeter = 0;
  let shapeDescription = '';
  let warningMsg = '';

  if (shape === 'rect') {
    totalSqFt = (rectLen || 0) * (rectWid || 0);
    perimeter = 2 * ((rectLen || 0) + (rectWid || 0));
    shapeDescription = 'আয়তক্ষেত্র';
  } else if (shape === 'irregular_avg') {
    const avgLen = ((irrN || 0) + (irrS || 0)) / 2;
    const avgWid = ((irrE || 0) + (irrW || 0)) / 2;
    totalSqFt = avgLen * avgWid;
    perimeter = (irrN || 0) + (irrS || 0) + (irrE || 0) + (irrW || 0);
    shapeDescription = '৪-বাহু গড় পদ্ধতি';
  } else if (shape === 'irregular_heron') {
    // Two triangles: (ihA, ihB, ihDiag) and (ihC, ihD, ihDiag)
    const a = ihA || 0,
      b = ihB || 0,
      c = ihC || 0,
      d = ihD || 0,
      diag = ihDiag || 0;

    const s1 = (a + b + diag) / 2;
    const s2 = (c + d + diag) / 2;

    let a1 = 0,
      a2 = 0;
    if (s1 > a && s1 > b && s1 > diag) {
      a1 = Math.sqrt(s1 * (s1 - a) * (s1 - b) * (s1 - diag));
    } else {
      warningMsg = '১ম ত্রিভুজের বাহুগুলোর যোগফল কর্ণের চেয়ে বড় হতে হবে!';
    }

    if (s2 > c && s2 > d && s2 > diag) {
      a2 = Math.sqrt(s2 * (s2 - c) * (s2 - d) * (s2 - diag));
    } else {
      warningMsg = '২য় ত্রিভুজের বাহুগুলোর যোগফল কর্ণের চেয়ে বড় হতে হবে!';
    }

    totalSqFt = a1 + a2;
    perimeter = a + b + c + d;
    shapeDescription = '৪-বাহু নিখুঁত হেরন সূত্র';
  } else if (shape === 'triangle') {
    const a = triA || 0,
      b = triB || 0,
      c = triC || 0;
    const s = (a + b + c) / 2;
    if (s > a && s > b && s > c) {
      totalSqFt = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    } else {
      warningMsg = 'যেকোনো দুই বাহুর যোগফল ৩য় বাহুর চেয়ে বড় হতে হবে!';
    }
    perimeter = a + b + c;
    shapeDescription = 'ত্রিভুজাকার জমি';
  } else if (shape === 'circle') {
    const r = circleMode === 'diameter' ? (circleVal || 0) / 2 : circleVal || 0;
    totalSqFt = Math.PI * r * r;
    perimeter = 2 * Math.PI * r;
    shapeDescription = 'বৃত্তাকার / পুকুর';
  }

  const shotok = totalSqFt / 435.6;
  const katha = totalSqFt / 720;
  const bigha = totalSqFt / 14400;
  const fenceTotalCost = perimeter * fenceRate;

  // Copy result
  const handleCopyArea = () => {
    const text = `জমির ক্ষেত্রফল (${shapeDescription}): ${totalSqFt.toFixed(2)} বর্গফুট = ${shotok.toFixed(3)} শতক (${katha.toFixed(2)} কাঠা)`;
    navigator.clipboard?.writeText(text);
    onShowToast('ক্ষেত্রফল কপি করা হয়েছে!');
  };

  return (
    <div className="space-y-4">
      {/* Shape Selector Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
            <Ruler className="w-4 h-4 text-blue-600" />
            <span>জমির আকৃতি ও পরিমাপের পদ্ধতি বাছুন:</span>
          </h2>
          <span className="text-[11px] font-semibold text-blue-700">একক: ফুট</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => setShape('rect')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              shape === 'rect'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            আয়তক্ষেত্র (দৈর্ঘ্য × প্রস্থ)
          </button>
          <button
            onClick={() => setShape('irregular_avg')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              shape === 'irregular_avg'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            ৪-বাহু (গড় পদ্ধতি)
          </button>
          <button
            onClick={() => setShape('irregular_heron')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              shape === 'irregular_heron'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            ৪-বাহু + কর্ণ (হেরন নিখুঁত)
          </button>
          <button
            onClick={() => setShape('triangle')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              shape === 'triangle'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            ত্রিভুজ (Heron)
          </button>
          <button
            onClick={() => setShape('circle')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              shape === 'circle'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            বৃত্ত / পুকুর
          </button>
        </div>
      </div>

      {/* Grid: Inputs & Result Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Card */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3.5 shadow-sm">
          {shape === 'rect' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800">আয়তাকার জমির দৈর্ঘ্য ও প্রস্থ (ফুট):</h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  দৈর্ঘ্য (Length - ফুট)
                </label>
                <input
                  type="number"
                  step="any"
                  value={rectLen || ''}
                  onChange={(e) => setRectLen(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  প্রস্থ (Width - ফুট)
                </label>
                <input
                  type="number"
                  step="any"
                  value={rectWid || ''}
                  onChange={(e) => setRectWid(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {shape === 'irregular_avg' && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-800">
                ৪-বাহুর দৈর্ঘ্য (ফুট - গড় পদ্ধতি):
              </h3>
              <p className="text-[11px] text-slate-500">
                সূত্র: উত্তর ও দক্ষিণ বাহুর গড় × পূর্ব ও পশ্চিম বাহুর গড়
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    উত্তর বাহু (North - ফু)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={irrN || ''}
                    onChange={(e) => setIrrN(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    দক্ষিণ বাহু (South - ফু)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={irrS || ''}
                    onChange={(e) => setIrrS(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    পূর্ব বাহু (East - ফু)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={irrE || ''}
                    onChange={(e) => setIrrE(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    পশ্চিম বাহু (West - ফু)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={irrW || ''}
                    onChange={(e) => setIrrW(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {shape === 'irregular_heron' && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-800">
                ৪-বাহু + কর্ণ (হেরন সূত্র - সার্ভেয়ার স্ট্যান্ডার্ড):
              </h3>
              <p className="text-[11px] text-blue-700">
                মাঝখান দিয়ে ফিতা ফেলে একটি কর্ণ মাপুন। এটি জমিকে দুটি ত্রিভুজে ভাগ করে ১০০% সঠিক ফলাফল দেয়।
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    বাহু ১ (উত্তর - ফু)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={ihA || ''}
                    onChange={(e) => setIhA(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    বাহু ২ (পূর্ব - ফু)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={ihB || ''}
                    onChange={(e) => setIhB(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    বাহু ৩ (দক্ষিণ - ফু)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={ihC || ''}
                    onChange={(e) => setIhC(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    বাহু ৪ (পশ্চিম - ফু)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={ihD || ''}
                    onChange={(e) => setIhD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-amber-800 mb-0.5">
                    মাঝের কর্ণ (Diagonal - ফু)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={ihDiag || ''}
                    onChange={(e) => setIhDiag(parseFloat(e.target.value) || 0)}
                    className="w-full bg-amber-50 border border-amber-300 rounded-xl p-2 text-xs font-black text-amber-950"
                  />
                </div>
              </div>
            </div>
          )}

          {shape === 'triangle' && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-800">ত্রিভুজাকার ৩টি বাহুর মাপ (ফুট):</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    বাহু ১ (a - ফুট)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={triA || ''}
                    onChange={(e) => setTriA(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    বাহু ২ (b - ফুট)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={triB || ''}
                    onChange={(e) => setTriB(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    বাহু ৩ (c - ফুট)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={triC || ''}
                    onChange={(e) => setTriC(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {shape === 'circle' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800">বৃত্তাকার জমি বা পুকুরের মাপ:</h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  পরিমাপের প্রকার:
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => setCircleMode('radius')}
                    className={`py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                      circleMode === 'radius'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ব্যাসার্ধ (Radius)
                  </button>
                  <button
                    onClick={() => setCircleMode('diameter')}
                    className={`py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                      circleMode === 'diameter'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ব্যাস (Diameter)
                  </button>
                </div>
                <input
                  type="number"
                  step="any"
                  value={circleVal || ''}
                  onChange={(e) => setCircleVal(parseFloat(e.target.value) || 0)}
                  placeholder="ফুট লিখুন"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold"
                />
              </div>
            </div>
          )}

          {warningMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{warningMsg}</span>
            </div>
          )}

          {/* Boundary fence toggle */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowFence(!showFence)}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <Fence className="w-3.5 h-3.5" />
              <span>{showFence ? 'সীমানা প্রাচীর হিসাব বন্ধ করুন' : 'সীমানা প্রাচীর / বেড়া খরচ হিসাব করুন'}</span>
            </button>
            {showFence && (
              <div className="mt-2 p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>মোট পরিসীমা (Perimeter):</span>
                  <span className="font-bold text-blue-950">{formatNum(perimeter, useBn, 1)} ফুট</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>প্রতি ফুট বেড়া নির্মাণ খরচ (টাকা):</span>
                  <input
                    type="number"
                    value={fenceRate}
                    onChange={(e) => setFenceRate(parseFloat(e.target.value) || 0)}
                    className="w-20 bg-white border border-blue-300 rounded-lg p-1 text-center font-bold text-xs"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-blue-200 pt-1.5 font-bold text-blue-900">
                  <span>আনুমানিক মোট সীমানা খরচ:</span>
                  <span className="text-sm">৳{formatNum(fenceTotalCost, useBn, 0)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Scaled Preview & Results Box */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-md border border-slate-800">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                গণনাকৃত মোট ক্ষেত্রফল
              </span>
              <button
                onClick={handleCopyArea}
                className="text-slate-300 hover:text-white text-xs flex items-center gap-1 transition cursor-pointer"
                title="কপি করুন"
              >
                <Copy className="w-3.5 h-3.5" /> কপি
              </button>
            </div>

            <div className="text-2xl font-black text-white">
              {formatNum(totalSqFt, useBn, 2)} বর্গফুট
            </div>
            <div className="text-base font-bold text-amber-300 mt-1">
              {formatNum(shotok, useBn, 3)} শতক (ডিসিমল)
            </div>
            <div className="text-xs text-slate-300 mt-1">
              {getCombinedBighaKathaShotok(shotok, useBn)}
            </div>
          </div>

          {/* Dynamic Scaled SVG Diagram */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700/80 flex flex-col items-center justify-center min-h-[160px]">
            <span className="text-[10px] text-slate-400 mb-2">নকশা স্কেল প্রিভিউ ({shapeDescription})</span>
            <div className="w-full flex justify-center items-center">
              {shape === 'rect' && (
                <svg width="200" height="110" viewBox="0 0 200 110" className="border border-slate-700 rounded bg-slate-950">
                  <rect x="30" y="25" width="140" height="60" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" rx="4" />
                  <text x="100" y="18" fill="#94a3b8" fontSize="10" textAnchor="middle">
                    দৈর্ঘ্য: {rectLen} ফু
                  </text>
                  <text x="18" y="58" fill="#94a3b8" fontSize="10" textAnchor="middle" transform="rotate(-90 18 58)">
                    {rectWid} ফু
                  </text>
                  <text x="100" y="58" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {formatNum(totalSqFt, useBn, 0)} ফু²
                  </text>
                </svg>
              )}

              {shape === 'irregular_avg' && (
                <svg width="200" height="110" viewBox="0 0 200 110" className="border border-slate-700 rounded bg-slate-950">
                  <polygon points="35,28 165,20 155,90 30,82" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
                  <text x="100" y="16" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    উ: {irrN}
                  </text>
                  <text x="100" y="102" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    দ: {irrS}
                  </text>
                  <text x="15" y="55" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    প: {irrW}
                  </text>
                  <text x="182" y="55" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    পূ: {irrE}
                  </text>
                  <text x="100" y="58" fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {formatNum(totalSqFt, useBn, 0)} ফু²
                  </text>
                </svg>
              )}

              {shape === 'irregular_heron' && (
                <svg width="200" height="110" viewBox="0 0 200 110" className="border border-slate-700 rounded bg-slate-950">
                  <polygon points="35,28 165,22 155,90 30,82" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                  <line x1="35" y1="28" x2="155" y2="90" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
                  <text x="100" y="45" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">
                    কর্ণ: {ihDiag} ফু
                  </text>
                  <text x="100" y="70" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    নিখুঁত: {formatNum(totalSqFt, useBn, 0)} ফু²
                  </text>
                </svg>
              )}

              {shape === 'triangle' && (
                <svg width="200" height="110" viewBox="0 0 200 110" className="border border-slate-700 rounded bg-slate-950">
                  <polygon points="100,18 175,90 25,90" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                  <text x="50" y="50" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    a: {triA}
                  </text>
                  <text x="150" y="50" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    b: {triB}
                  </text>
                  <text x="100" y="103" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    c: {triC}
                  </text>
                  <text x="100" y="70" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {formatNum(totalSqFt, useBn, 0)} ফু²
                  </text>
                </svg>
              )}

              {shape === 'circle' && (
                <svg width="200" height="110" viewBox="0 0 200 110" className="border border-slate-700 rounded bg-slate-950">
                  <circle cx="100" cy="55" r="40" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                  <line x1="100" y1="55" x2="140" y2="55" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="120" y="50" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    r
                  </text>
                  <text x="100" y="62" fill="#06b6d4" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {formatNum(totalSqFt, useBn, 0)} ফু²
                  </text>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
