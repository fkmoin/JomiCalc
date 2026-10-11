import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink, Code2, Sparkles, Smartphone } from 'lucide-react';
import { HOPWEB_SINGLE_FILE_HTML } from '../utils/hopwebCode';

interface HopwebModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const HopwebModal: React.FC<HopwebModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(HOPWEB_SINGLE_FILE_HTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onShowToast('হপওয়েব রেডি সম্পূর্ণ HTML কোড কপি হয়েছে!');
  };

  const handleDownloadFile = () => {
    const blob = new Blob([HOPWEB_SINGLE_FILE_HTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('index.html ফাইল ডাউনলোড শুরু হয়েছে!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-400/20 p-2 rounded-xl text-amber-300 border border-amber-400/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                Hopweb আপলোড ও এক্সপোর্ট সেন্টার
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  রেডি কোড
                </span>
              </h3>
              <p className="text-[11px] text-emerald-200/80">
                অ্যান্ড্রয়েড Hopweb অ্যাপ বা যেকোনো হোস্টিংয়ে সরাসরি ব্যবহারের সম্পূর্ণ স্বয়ংসম্পূর্ণ ফাইল
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* How-to Card */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
            <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Hopweb এ কীভাবে আপলোড করবেন? (সহজ ৩টি ধাপ):
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed font-medium">
              <li>
                আপনার ফোনে <strong>Hopweb</strong> অ্যাপটি খুলুন এবং একটি নতুন প্রজেক্ট তৈরি করুন।
              </li>
              <li>
                নিচের <strong>"সম্পূর্ণ কোড কপি করুন"</strong> বাটনে চাপ দিন অথবা <strong>"index.html ডাউনলোড"</strong> করুন।
              </li>
              <li>
                Hopweb-এর <code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono font-bold">index.html</code> ফাইলে এটি পেস্ট করে <strong>Run / Preview</strong> চাপুন! কোনো প্যাকেজ বা সার্ভার ইনস্টল করা লাগবে না।
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopyCode}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>কপি সফল হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>সম্পূর্ণ কোড কপি করুন (১-ক্লিক)</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadFile}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold p-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>index.html ফাইল ডাউনলোড করুন</span>
            </button>
          </div>

          {/* Standalone link */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <span className="text-slate-600">
              ব্রাউজারে সরাসরি সিঙ্গেল ফাইল দেখতে চান?
            </span>
            <a
              href="/hopweb-jomi-calc.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
            >
              <span>লাইভ ফাইল খুলুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Code Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="font-mono flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5" /> index.html (Hopweb Standalone Production Ready)
              </span>
              <span>{HOPWEB_SINGLE_FILE_HTML.length} characters</span>
            </div>
            <pre className="bg-slate-950 text-emerald-400 p-3 rounded-xl font-mono text-[11px] max-h-40 overflow-y-auto border border-slate-800 selection:bg-emerald-800">
              {HOPWEB_SINGLE_FILE_HTML.substring(0, 1200)}
              {'\n... [বাকি কোড দেখতে "সম্পূর্ণ কোড কপি করুন" এ ক্লিক করুন]'}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-3 flex justify-end border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer transition"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
