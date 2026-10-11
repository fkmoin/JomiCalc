/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { UnitConverter } from './components/UnitConverter';
import { AreaCalculator } from './components/AreaCalculator';
import { FarayezCalculator } from './components/FarayezCalculator';
import { LandDivision } from './components/LandDivision';
import { RegistrationValuation } from './components/RegistrationValuation';
import { LandGlossary } from './components/LandGlossary';
import { HopwebModal } from './components/HopwebModal';
import { CalculationRecord } from './types';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('converter');
  const [useBn, setUseBn] = useState<boolean>(true);
  const [isHopwebOpen, setIsHopwebOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedCalculations, setSavedCalculations] = useState<CalculationRecord[]>([]);

  // Load saved calculations on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('jomi_pro_saved_calc');
      if (stored) {
        setSavedCalculations(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  const handleSaveCalculation = (rec: CalculationRecord) => {
    const updated = [rec, ...savedCalculations].slice(0, 20);
    setSavedCalculations(updated);
    try {
      localStorage.setItem('jomi_pro_saved_calc', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedCalculations.filter((c) => c.id !== id);
    setSavedCalculations(updated);
    try {
      localStorage.setItem('jomi_pro_saved_calc', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast('হিসাব মুছে ফেলা হয়েছে');
  };

  const handleClearAllSaved = () => {
    setSavedCalculations([]);
    try {
      localStorage.removeItem('jomi_pro_saved_calc');
    } catch {
      // ignore
    }
    showToast('সকল সেভ করা হিসাব মুছে ফেলা হয়েছে');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-800">
      {/* Top Header */}
      <Header
        useBn={useBn}
        onToggleLang={() => setUseBn(!useBn)}
        onOpenHopwebModal={() => setIsHopwebOpen(true)}
        savedCount={savedCalculations.length}
      />

      {/* Navigation Tabs */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Body */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 w-full flex-1">
        {activeTab === 'converter' && (
          <UnitConverter
            useBn={useBn}
            onShowToast={showToast}
            savedCalculations={savedCalculations}
            onSaveCalculation={handleSaveCalculation}
            onDeleteSaved={handleDeleteSaved}
            onClearAllSaved={handleClearAllSaved}
          />
        )}

        {activeTab === 'area' && (
          <AreaCalculator useBn={useBn} onShowToast={showToast} />
        )}

        {activeTab === 'farayez' && (
          <FarayezCalculator useBn={useBn} onShowToast={showToast} />
        )}

        {activeTab === 'division' && (
          <LandDivision useBn={useBn} onShowToast={showToast} />
        )}

        {activeTab === 'valuation' && (
          <RegistrationValuation useBn={useBn} onShowToast={showToast} />
        )}

        {activeTab === 'glossary' && <LandGlossary />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 mt-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; ২০২৬ JomiCalc Pro &bull; সর্বস্বত্ব সংরক্ষিত।</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHopwebOpen(true)}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Hopweb কোড ডাউনলোড
            </button>
            <span>&bull;</span>
            <span className="text-slate-400">বাংলাদেশের ডিজিটাল ভূমি প্ল্যাটফর্ম</span>
          </div>
        </div>
      </footer>

      {/* Hopweb Export Modal */}
      <HopwebModal
        isOpen={isHopwebOpen}
        onClose={() => setIsHopwebOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
