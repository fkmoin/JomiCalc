import React, { useState } from 'react';
import { Users, Plus, Trash2, Copy, Check, Printer } from 'lucide-react';
import { formatNum } from '../utils/conversions';

interface LandDivisionProps {
  useBn: boolean;
  onShowToast: (msg: string) => void;
}

interface CustomPartner {
  id: string;
  name: string;
  ratio: number;
}

export const LandDivision: React.FC<LandDivisionProps> = ({ useBn, onShowToast }) => {
  const [divisionMode, setDivisionMode] = useState<'equal' | 'custom'>('equal');
  const [totalLand, setTotalLand] = useState<number>(50); // in shotok
  const [equalPersons, setEqualPersons] = useState<number>(4);

  // Custom partners list
  const [partners, setPartners] = useState<CustomPartner[]>([
    { id: '1', name: 'অংশীদার ১ (আব্দুর রহিম)', ratio: 3 },
    { id: '2', name: 'অংশীদার ২ (করিম মিয়া)', ratio: 2 },
    { id: '3', name: 'অংশীদার ৩ (ফারুক হোসেন)', ratio: 1 },
  ]);

  // Equal division
  const personsCount = equalPersons > 0 ? equalPersons : 1;
  const perPersonShotok = (totalLand || 0) / personsCount;
  const perPersonSqFt = perPersonShotok * 435.6;

  // Custom division
  const totalRatio = partners.reduce((sum, p) => sum + (p.ratio || 0), 0) || 1;

  const addPartner = () => {
    const newId = Date.now().toString();
    setPartners([
      ...partners,
      { id: newId, name: `অংশীদার ${partners.length + 1}`, ratio: 1 },
    ]);
  };

  const removePartner = (id: string) => {
    if (partners.length <= 1) return;
    setPartners(partners.filter((p) => p.id !== id));
  };

  const updatePartner = (id: string, field: 'name' | 'ratio', val: string | number) => {
    setPartners(
      partners.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-bold text-purple-950 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-600" />
          <span>শরিক ও অংশীদারদের মধ্যে জমি বণ্টন ক্যালকুলেটর</span>
        </h2>
        <p className="text-xs text-slate-600">
          পৈতৃক বা যৌথ মালিকানার জমি সমান ভাগে অথবা কাস্টম হিস্যা / অনুপাত অনুসারে নির্ভুলভাবে ভাগ করুন।
        </p>

        {/* Mode Selector */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => setDivisionMode('equal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              divisionMode === 'equal'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-purple-200 text-purple-900'
            }`}
          >
            সমান ভাগে বণ্টন
          </button>
          <button
            onClick={() => setDivisionMode('custom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              divisionMode === 'custom'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-purple-200 text-purple-900'
            }`}
          >
            কাস্টম হিস্যা / অনুপাত বণ্টন
          </button>
        </div>
      </div>

      {/* Main Input Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            মোট জমির পরিমাণ (শতক / শতাংশ):
          </label>
          <input
            type="number"
            step="any"
            min="0"
            value={totalLand || ''}
            onChange={(e) => setTotalLand(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
          />
        </div>

        {divisionMode === 'equal' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              মোট অংশীদার বা শরিকের সংখ্যা:
            </label>
            <input
              type="number"
              min="1"
              value={equalPersons}
              onChange={(e) => setEqualPersons(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                অংশীদারদের তালিকা ও অনুপাত / হিস্যা:
              </label>
              <button
                onClick={addPartner}
                className="text-xs text-purple-700 hover:text-purple-800 font-bold flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> শরিক যোগ করুন
              </button>
            </div>

            <div className="space-y-2">
              {partners.map((p, idx) => (
                <div
                  key={p.id}
                  className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2"
                >
                  <span className="text-xs font-bold text-slate-500 w-5">
                    {useBn ? formatNum(idx + 1, true, 0) : idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => updatePartner(p.id, 'name', e.target.value)}
                    placeholder="শরিকের নাম"
                    className="flex-1 bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-semibold"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500">অনুপাত:</span>
                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      value={p.ratio}
                      onChange={(e) =>
                        updatePartner(p.id, 'ratio', parseFloat(e.target.value) || 0)
                      }
                      className="w-16 bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-center"
                    />
                  </div>
                  {partners.length > 1 && (
                    <button
                      onClick={() => removePartner(p.id)}
                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Output */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
          <span>বণ্টন ফলাফল বিবরণী:</span>
          <button
            onClick={() => window.print()}
            className="text-xs text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> প্রিন্ট
          </button>
        </h3>

        {divisionMode === 'equal' ? (
          <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="block text-xs font-bold text-purple-800">
                প্রতি শরিকের সমান প্রাপ্য অংশ ({formatNum(personsCount, useBn, 0)} জন):
              </span>
              <div className="text-2xl font-black text-purple-950 mt-1">
                {formatNum(perPersonShotok, useBn, 3)} শতক
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 block">
                বর্গফুটে: <strong className="text-slate-900">{formatNum(perPersonSqFt, useBn, 1)} ফু²</strong>
              </span>
              <span className="text-xs text-slate-600 block">
                কাঠায়: <strong className="text-slate-900">{formatNum(perPersonSqFt / 720, useBn, 2)} কাঠা</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {partners.map((p) => {
              const partnerShotok = (totalLand * (p.ratio || 0)) / totalRatio;
              const partnerSqFt = partnerShotok * 435.6;
              const percent = ((p.ratio || 0) / totalRatio) * 100;
              return (
                <div
                  key={p.id}
                  className="bg-purple-50/60 p-3 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-purple-950 text-xs">{p.name}</span>
                    <span className="text-[10px] text-purple-700 block">
                      অংশ: {formatNum(p.ratio, useBn, 1)} ভাগ ({formatNum(percent, useBn, 1)}%)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-purple-900 text-sm">
                      {formatNum(partnerShotok, useBn, 3)} শতক
                    </span>
                    <span className="block text-[10px] text-slate-600">
                      {formatNum(partnerSqFt, useBn, 1)} বর্গফুট | {formatNum(partnerSqFt / 720, useBn, 2)} কাঠা
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
