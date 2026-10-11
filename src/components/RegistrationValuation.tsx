import React, { useState } from 'react';
import { Receipt, Landmark, AlertCircle, Printer } from 'lucide-react';
import { DeedType, AreaRegion } from '../types';
import { formatNum } from '../utils/conversions';

interface RegistrationValuationProps {
  useBn: boolean;
  onShowToast: (msg: string) => void;
}

export const RegistrationValuation: React.FC<RegistrationValuationProps> = ({
  useBn,
  onShowToast,
}) => {
  const [marketPrice, setMarketPrice] = useState<number>(500000);
  const [deedType, setDeedType] = useState<DeedType>('saf_kabala');
  const [region, setRegion] = useState<AreaRegion>('union_parishad');

  const price = marketPrice || 0;

  // Rates calculation
  let stampRate = 0.015; // 1.5%
  let regRate = 0.01; // 1%
  let localTaxRate = 0.015; // 1.5%
  let aitRate = 0.01; // 1%
  let fixedFee = 600; // affidavit 300 + e-fee 300

  if (region === 'city_corp') {
    localTaxRate = 0.03; // 3%
    aitRate = 0.03; // 3%
  } else if (region === 'municipality') {
    localTaxRate = 0.02; // 2%
    aitRate = 0.02; // 2%
  } else {
    localTaxRate = 0.015; // 1.5%
    aitRate = 0.01; // 1%
  }

  // Deed type overrides
  if (deedType === 'heba_blood') {
    stampRate = 0.002;
    regRate = 0.002;
    localTaxRate = 0;
    aitRate = 0;
    fixedFee = 400;
  } else if (deedType === 'batwara') {
    stampRate = 0.005;
    regRate = 0.005;
    localTaxRate = 0.005;
    aitRate = 0;
    fixedFee = 500;
  } else if (deedType === 'mortgage') {
    stampRate = 0.01;
    regRate = 0.01;
    localTaxRate = 0;
    aitRate = 0;
  }

  const stampCost = price * stampRate;
  const regCost = price * regRate;
  const localCost = price * localTaxRate;
  const aitCost = price * aitRate;
  const totalCost = stampCost + regCost + localCost + aitCost + fixedFee;
  const percentTotal = price > 0 ? (totalCost / price) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-bold text-teal-950 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-teal-600" />
          <span>জমির দলিল রেজিস্ট্রি ফি ও সরকারি খরচ ক্যালকুলেটর</span>
        </h2>
        <p className="text-xs text-slate-600">
          গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের সাব-রেজিস্ট্রি অফিসের হালনাগাদ আইন ও কর হার অনুসারে আনুমানিক সরকারি খরচ হিসাব করুন।
        </p>
      </div>

      {/* Input Parameters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              জমির সরকারি দলিল বাজারমূল্য (টাকা):
            </label>
            <input
              type="number"
              step="1000"
              min="0"
              value={marketPrice || ''}
              onChange={(e) => setMarketPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              দলিলের প্রকৃতি / ধরন:
            </label>
            <select
              value={deedType}
              onChange={(e) => setDeedType(e.target.value as DeedType)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            >
              <option value="saf_kabala">সাফ-কবালা (ক্রয়-বিক্রয় দলিল)</option>
              <option value="heba_blood">হেবা / হেবা-বিল-এওয়াজ (রক্তসম্পর্কীয় দানপত্র)</option>
              <option value="batwara">বাটোয়ারা / বণ্টননামা (শরিকানা জমি)</option>
              <option value="danpotro">সাধারণ দানপত্র (রক্তসম্পর্ক বহির্ভূত)</option>
              <option value="mortgage">বন্ধকী দলিল (ব্যাংক ঋণ বা মর্টগেজ)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            জমির ভৌগোলিক এলাকা (স্থানীয় সরকার কর নির্ধারণের জন্য):
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRegion('union_parishad')}
              className={`p-2.5 rounded-xl font-bold border transition cursor-pointer text-center ${
                region === 'union_parishad'
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ইউনিয়ন পরিষদ (১.৫% কর)
            </button>
            <button
              type="button"
              onClick={() => setRegion('municipality')}
              className={`p-2.5 rounded-xl font-bold border transition cursor-pointer text-center ${
                region === 'municipality'
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              পৌরসভা (২% কর)
            </button>
            <button
              type="button"
              onClick={() => setRegion('city_corp')}
              className={`p-2.5 rounded-xl font-bold border transition cursor-pointer text-center ${
                region === 'city_corp'
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              সিটি কর্পোরেশন (৩% কর)
            </button>
          </div>
        </div>
      </div>

      {/* Itemized Fee Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-xs font-bold text-slate-800">আনুমানিক সরকারি ফি ও খরচের বিবরণী:</h3>
          <button
            onClick={() => window.print()}
            className="text-xs text-teal-700 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <Printer className="w-3.5 h-3.5" /> প্রিন্ট স্লিপ
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="block text-[10px] text-slate-500 mb-0.5">
              স্ট্যাম্প শুল্ক ({(stampRate * 100).toFixed(1)}%)
            </span>
            <span className="text-base font-bold text-slate-900">
              ৳{formatNum(Math.round(stampCost), useBn, 0)}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="block text-[10px] text-slate-500 mb-0.5">
              নিবন্ধন ফি ({(regRate * 100).toFixed(1)}%)
            </span>
            <span className="text-base font-bold text-slate-900">
              ৳{formatNum(Math.round(regCost), useBn, 0)}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="block text-[10px] text-slate-500 mb-0.5">
              স্থানীয় সরকার কর ({(localTaxRate * 100).toFixed(1)}%)
            </span>
            <span className="text-base font-bold text-slate-900">
              ৳{formatNum(Math.round(localCost), useBn, 0)}
            </span>
          </div>

          <div className="bg-teal-50 p-3 rounded-xl border border-teal-300">
            <span className="block text-[10px] text-teal-800 font-bold mb-0.5">
              মোট সরকারি খরচ ({formatNum(percentTotal, useBn, 1)}%)
            </span>
            <span className="text-lg font-black text-teal-950">
              ৳{formatNum(Math.round(totalCost), useBn, 0)}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
          <div className="flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p>
                <strong>জরুরি নোট:</strong> উপরের খরচের সাথে হলফনামা ফি (৳৩০০) ও ই-ফি যুক্ত রয়েছে। বাণিজ্যিক বা আবাসিক এলাকাভেদে উৎসে আয়কর (AIT) পৃথক হতে পারে। এছাড়া দলিল লেখক সমিতির টাইপ ও পেস্টিং ফি আলাদা প্রযোজ্য হবে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
