import React from 'react';
import { Calculator, Ruler, Scale, Users, Receipt, BookOpen } from 'lucide-react';

export type TabType = 'converter' | 'area' | 'farayez' | 'division' | 'valuation' | 'glossary';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'converter',
      label: 'একক রূপান্তর',
      icon: <Calculator className="w-4 h-4" />,
      color: 'text-emerald-500',
    },
    {
      id: 'area',
      label: 'আয়তন ও নকশা',
      icon: <Ruler className="w-4 h-4" />,
      color: 'text-blue-500',
    },
    {
      id: 'farayez',
      label: 'ইসলামিক ফারায়েজ',
      icon: <Scale className="w-4 h-4" />,
      color: 'text-amber-500',
    },
    {
      id: 'division',
      label: 'অংশীদার বণ্টন',
      icon: <Users className="w-4 h-4" />,
      color: 'text-purple-500',
    },
    {
      id: 'valuation',
      label: 'দলিল রেজিস্ট্রি ফি',
      icon: <Receipt className="w-4 h-4" />,
      color: 'text-teal-500',
    },
    {
      id: 'glossary',
      label: 'ভূমি শব্দকোষ',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'text-indigo-500',
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[57px] z-40 shadow-sm overflow-x-auto scrollbar-none">
      <div className="max-w-5xl mx-auto flex items-center gap-1.5 px-3 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className={isActive ? 'text-white' : tab.color}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
