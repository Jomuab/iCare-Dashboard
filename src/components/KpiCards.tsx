import React from 'react';
import { FilterState } from '../types';
import { getFilteredKpis } from '../utils/filterEngine';
import {
  IconShieldCheck as ShieldCheck,
  IconCirclePlus as PlusCircle,
  IconRefresh as RefreshCw,
  IconCircleArrowUp as ArrowUpCircle,
  IconDatabase as Database,
  IconTrendingUp as TrendingUp,
} from '@tabler/icons-react';

interface KpiCardsProps {
  filters: FilterState;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ filters }) => {
  const cardsData = getFilteredKpis(filters);

  const renderIcon = (iconName: string, bgColor: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-sky-600" />;
      case 'PlusCircle':
        return <PlusCircle className="w-6 h-6 text-indigo-600" />;
      case 'RefreshCw':
        return <RefreshCw className="w-6 h-6 text-emerald-600" />;
      case 'ArrowUpCircle':
        return <ArrowUpCircle className="w-6 h-6 text-amber-600" />;
      case 'Database':
        return <Database className="w-6 h-6 text-purple-600" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-sky-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cardsData.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
        >
          {/* Top accent bar */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`}
          />

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {card.title}
            </span>
            <div className={`p-2 rounded-lg ${card.bgColor} border`}>
              {renderIcon(card.iconName, card.bgColor)}
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {card.value.toLocaleString()}
            </div>

            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                <TrendingUp className="w-3 h-3" />
                {card.change}
              </span>
              <span className="text-[11px] text-slate-400">{card.period}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
