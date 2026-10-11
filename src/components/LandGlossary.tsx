import React, { useState } from 'react';
import { BookOpen, ExternalLink, Search, FileText, CheckCircle2 } from 'lucide-react';

interface GlossaryItem {
  term: string;
  en: string;
  category: 'survey' | 'legal' | 'document';
  description: string;
  importance: string;
}

const GLOSSARY_DATA: GlossaryItem[] = [
  {
    term: 'সিএস খতিয়ান (CS Survey)',
    en: 'Cadastral Survey (1888-1940)',
    category: 'survey',
    description: 'ব্রিটিশ শাসনামলে ১৮৮৮ থেকে ১৯৪০ সালের মধ্যে প্রস্তুতকৃত বাংলাদেশের প্রথম পূর্ণাঙ্গ ভূ-জরিপ ও খতিয়ান।',
    importance: 'জমি সংক্রান্ত মালিকানার আদি ভিত্তি বা শিকড় যাচাইয়ে এই খতিয়ান সবচেয়ে গুরুত্বপূর্ণ দলিল।',
  },
  {
    term: 'এসএ খতিয়ান (SA Survey)',
    en: 'State Acquisition Survey (1956-1962)',
    category: 'survey',
    description: '১৯৫০ সালের জমিদারি অধিগ্রহণ ও প্রজাস্বত্ব আইন অনুসারে ১৯৫৬-১৯৬২ সালে প্রস্তুতকৃত খতিয়ান।',
    importance: 'জমিদারি প্রথা বিলুপ্তির পর কার কার দখলে জমি ছিল তা নিশ্চিত করতে এটি ব্যবহৃত হয়।',
  },
  {
    term: 'আরএস খতিয়ান (RS Survey)',
    en: 'Revisional Survey',
    category: 'survey',
    description: 'সিএস ও এসএ জরিপের বিভিন্ন ভুলভ্রান্তি দূর করে পরবর্তীতে মাঠপর্যায়ে সরেজমিনে প্রস্তুতকৃত খতিয়ান।',
    importance: 'আইনগতভাবে এটি অত্যন্ত নির্ভরযোগ্য ও চূড়ান্ত সাক্ষ্য বহন করে।',
  },
  {
    term: 'বিএস / বিআরএস খতিয়ান (BS / BRS)',
    en: 'Bangladesh Revisional Survey',
    category: 'survey',
    description: '১৯৯৮ সাল থেকে চলমান হালনাগাদ আধুনিক জরিপ খতিয়ান। ঢাকা মহানগরীতে এটি সিটি জরিপ নামে পরিচিত।',
    importance: 'বর্তমানে খাজনা প্রদান ও নামজারির প্রধান ভিত্তি হিসেবে বিএস খতিয়ান কার্যকর।',
  },
  {
    term: 'নামজারি (Mutation)',
    en: 'Mutation & Jamakhariz',
    category: 'legal',
    description: 'জমি ক্রয়, হেবা বা উত্তরাধিকারসূত্রে প্রাপ্তির পর পূর্বের মালিকের নাম কেটে সরকারি রেজিস্টারে নতুন মালিকের নাম লিপিবদ্ধ করা।',
    importance: 'নামজারি না করলে জমির মালিকানা পরিপূর্ণ হয় না এবং সরকারির খাতায় খাজনা দেওয়া যায় না।',
  },
  {
    term: 'ডিসিআর (DCR)',
    en: 'Duplicate Carbon Receipt',
    category: 'document',
    description: 'নামজারি আবেদন মঞ্জুর হওয়ার পর সরকারি ফি (১,১৫০ টাকা বা নির্ধারিত ফি) পরিশোধের পাকা রশিদ।',
    importance: 'ডিসিআর ব্যতীত কোনো নামজারি খতিয়ান আইনসিদ্ধ হয় না।',
  },
  {
    term: 'দাখিলা / খাজনা রশিদ',
    en: 'Land Development Tax Receipt',
    category: 'document',
    description: 'ভূমি উন্নয়ন কর (খাজনা) পরিশোধের পর ভূমি মন্ত্রণালয়ের ই-পোর্টালে প্রাপ্ত ডিজিটাল রশিদ।',
    importance: 'জমি বিক্রির সময় হালনাগাদ দাখিলা জমা দেওয়া বাধ্যতামূলক।',
  },
  {
    term: 'বায়া দলিল (Chain of Title)',
    en: 'Parent Deed / Link Deed',
    category: 'document',
    description: 'বর্তমান বিক্রেতা কীভাবে জমিটির মালিক হয়েছেন তার পূর্ববর্তী ধারাবাহিক দলিলসমূহকে বায়া দলিল বলে।',
    importance: 'জমি কেনার আগে বায়া দলিলের ধারাবাহিক মিল থাকা আবশ্যক।',
  },
  {
    term: 'দাগ নম্বর (Plot Number)',
    en: 'Plot Number / Khatian Dag',
    category: 'survey',
    description: 'মৌজা নকশায় নির্দিষ্ট জমির সীমানা চিহ্নিত করতে যে স্বতন্ত্র ক্রমিক নম্বর দেওয়া হয় তাকে দাগ বলে।',
    importance: 'জমি নকশায় অবস্থান ও বাউন্ডারি চিহ্নিত করার একমাত্র চাবিকাঠি।',
  },
  {
    term: 'মৌজা (Mouza) ও জেএল নম্বর',
    en: 'Mouza & Jurisdiction List (JL)',
    category: 'survey',
    description: 'ভূমি রাজস্ব ও জরিপ কাজের জন্য চিহ্নিত এক একটি ভৌগোলিক প্রশাসনিক একক বা গ্রাম।',
    importance: 'প্রত্যেক মৌজার একটি নির্দিষ্ট জেএল (JL) নম্বর থাকে।',
  },
  {
    term: 'ওয়ারিশ কায়েম সনদ',
    en: 'Legal Heir Certificate',
    category: 'legal',
    description: 'মৃত ব্যক্তির প্রকৃত উত্তরাধিকারীদের তালিকা সম্বলিত স্থানীয় পৌরসভা বা ইউনিয়ন পরিষদ কর্তৃক প্রদত্ত প্রত্যয়ন।',
    importance: 'উত্তরাধিকারীদের জমি বণ্টনে এই সনদ অপরিহার্য।',
  },
  {
    term: 'মিসকেস (Miscase)',
    en: 'Mutation Dispute / Appeal Case',
    category: 'legal',
    description: 'নামজারিতে জালিয়াতি বা ত্রুটি হলে এসিল্যান্ড বরাবর দায়েরকৃত পুনর্বিবেচনা বা আপিল মামলা।',
    importance: 'ভুল বা জাল নামজারি বাতিল করার প্রশাসনিক আইনি পথ।',
  },
];

export const LandGlossary: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [filterCat, setFilterCat] = useState<'all' | 'survey' | 'legal' | 'document'>('all');

  const filtered = GLOSSARY_DATA.filter((item) => {
    const matchText =
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.en.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || item.category === filterCat;
    return matchText && matchCat;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>ভূমি সহায়িকা, খতিয়ান পরিচিতি ও শব্দকোষ</span>
        </h2>
        <p className="text-xs text-slate-600">
          জমি কেনাবেচা, রেজিস্ট্রি, খতিয়ান যাচাই এবং বিরোধ এড়াতে প্রয়োজনীয় আইনি পরিভাষা ও সরকারি সেবা লিংক।
        </p>
      </div>

      {/* Official Government Portals */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>বাংলাদেশ সরকারের অফিশিয়াল ভূমি পোর্টালসমূহ:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <a
            href="https://eporcha.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-950 font-bold transition group"
          >
            <div>
              <span className="block text-emerald-900">ই-পরচা পোর্টাল (ePorcha)</span>
              <span className="text-[10px] text-slate-500 font-normal">অনলাইনে খতিয়ান ও মৌজা ম্যাপ আবেদন</span>
            </div>
            <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="https://mutation.land.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-xl flex items-center justify-between text-blue-950 font-bold transition group"
          >
            <div>
              <span className="block text-blue-900">ই-নামজারি (e-Mutation)</span>
              <span className="text-[10px] text-slate-500 font-normal">অনলাইনে ই-নামজারির আবেদন ও ট্র্যাকিং</span>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="https://ldtax.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl flex items-center justify-between text-amber-950 font-bold transition group"
          >
            <div>
              <span className="block text-amber-900">ভূমি উন্নয়ন কর (LD Tax)</span>
              <span className="text-[10px] text-slate-500 font-normal">অনলাইনে জমির খাজনা প্রদান ও দাখিলা সংগ্রহ</span>
            </div>
            <ExternalLink className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="https://land.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 rounded-xl flex items-center justify-between text-indigo-950 font-bold transition group"
          >
            <div>
              <span className="block text-indigo-900">ভূমি সেবা পোর্টাল (land.gov.bd)</span>
              <span className="text-[10px] text-slate-500 font-normal">ভূমি মন্ত্রণালয়ের সকল ডিজিটাল সেবা একত্রে</span>
            </div>
            <ExternalLink className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Glossary Search & List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="খতিয়ান, নামজারি, দাগ, ডিসিআর খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <button
              onClick={() => setFilterCat('all')}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition ${
                filterCat === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              সকল
            </button>
            <button
              onClick={() => setFilterCat('survey')}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition ${
                filterCat === 'survey'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              জরিপ ও খতিয়ান
            </button>
            <button
              onClick={() => setFilterCat('document')}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition ${
                filterCat === 'document'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              দলিল ও রশিদ
            </button>
            <button
              onClick={() => setFilterCat('legal')}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition ${
                filterCat === 'legal'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              আইনি প্রক্রিয়া
            </button>
          </div>
        </div>

        {/* Glossary Cards */}
        <div className="space-y-2.5">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-indigo-50/40 p-3 rounded-xl border border-slate-200 transition space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{item.term}</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium ml-5">{item.en}</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed pl-5">{item.description}</p>
              <div className="text-[11px] text-indigo-900 font-semibold bg-indigo-50/80 px-2.5 py-1 rounded-lg ml-5 border border-indigo-100">
                <strong>গুরুত্ব:</strong> {item.importance}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              কোনো ফলাফল পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
