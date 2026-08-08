import React, { useState } from 'react';
import { FilterState } from '../types';
import { getFilteredCaseworkersData } from '../utils/filterEngine';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Award,
  AlertCircle,
  CheckCircle,
  Star,
  Clock,
} from 'lucide-react';

interface CaseworkerPerformanceProps {
  filters: FilterState;
}

export const CaseworkerPerformance: React.FC<CaseworkerPerformanceProps> = ({
  filters,
}) => {
  const periodKey =
    filters.period === 'DAILY'
      ? 'daily'
      : filters.period === 'WEEKLY'
      ? 'weekly'
      : filters.period === 'MONTHLY'
      ? 'monthly'
      : 'yearly';

  const [metricTab, setMetricTab] = useState<'yearly' | 'monthly' | 'weekly' | 'daily'>(periodKey);

  // Sync tab if filters.period changes
  React.useEffect(() => {
    setMetricTab(periodKey);
  }, [periodKey]);

  const { workers, topInsp, leastInsp } = getFilteredCaseworkersData(filters);

  // Sorted top and least team leads from filtered Caseworkers based on active metric tab
  const activeSortKey = metricTab;
  const topTeamLeads = [...workers]
    .sort((a, b) => b[activeSortKey] - a[activeSortKey])
    .slice(0, 5);
  const leastTeamLeads = [...workers]
    .sort((a, b) => a[activeSortKey] - b[activeSortKey])
    .slice(0, 3);

  return (
    <div className="space-y-6 mb-6">
      {/* 1. Main Bar Chart */}
      <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              License Generation Summary by Caseworker
            </h2>
            <p className="text-xs text-slate-500">
              Output breakdown for team leads & caseworkers (HAILU YITBAREK, Getu Demsie, Menulkerim...)
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setMetricTab(t)}
                className={`px-3 py-1 text-xs font-semibold capitalize rounded-md transition-all ${
                  metricTab === t
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Caseworkers Bar Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, angle: -25, textAnchor: 'end' }} height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Licenses Issued']} />
              <Legend wrapperStyle={{ paddingTop: 8, fontSize: 11 }} />
              <Bar dataKey="daily" name="Daily" fill="#f43f5e" radius={[2, 2, 0, 0]} />
              <Bar dataKey="weekly" name="Weekly" fill="#0ea5e9" radius={[2, 2, 0, 0]} />
              <Bar dataKey="monthly" name="Monthly" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              <Bar dataKey="yearly" name="Yearly" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Top/Least Team Leads & Inspectors Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Top & Bottom Team Leads */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-800">
                Team Leads Performance Ranking
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Processing Output</span>
          </div>

          <div className="space-y-4">
            {/* Top 5 Team Leads */}
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 block flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Top High Performers
              </span>
              <div className="space-y-2">
                {topTeamLeads.map((cw, idx) => (
                  <div
                    key={cw.name}
                    className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-800">{cw.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {cw.branch} Branch • {cw.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{cw.yearly} licenses</p>
                      <p className="text-[10px] font-semibold text-emerald-600">
                        {cw.slaRate}% SLA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Least Team Leads */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 block flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Needs Output Support / Backlog
              </span>
              <div className="space-y-2">
                {leastTeamLeads.map((cw) => (
                  <div
                    key={cw.name}
                    className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div>
                        <p className="font-bold text-slate-800">{cw.name}</p>
                        <p className="text-[10px] text-slate-500">{cw.branch} Branch</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{cw.yearly} licenses</p>
                      <p className="text-[10px] font-semibold text-amber-600">
                        {cw.slaRate}% SLA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Top & Bottom Inspectors */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-800">
                Inspectors Efficiency Ranking
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Field Inspections</span>
          </div>

          <div className="space-y-4">
            {/* Top Inspectors */}
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 block flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                Top Inspectors (Fast Turnaround & Quality)
              </span>
              <div className="space-y-2">
                {topInsp.slice(0, 3).map((insp, idx) => (
                  <div
                    key={insp.id}
                    className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-800">{insp.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {insp.branch} Branch • {insp.customerType} Scope
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        {insp.inspectionsCompleted} audits
                      </p>
                      <p className="text-[10px] font-semibold text-indigo-600">
                        {insp.avgResponseHours}h avg turnaround
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Inspectors */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                Delayed Inspection Queue
              </span>
              <div className="space-y-2">
                {leastInsp.slice(0, 2).map((insp) => (
                  <div
                    key={insp.id}
                    className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{insp.name}</p>
                      <p className="text-[10px] text-slate-500">{insp.branch} Branch</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        {insp.inspectionsCompleted} audits
                      </p>
                      <p className="text-[10px] font-semibold text-rose-600">
                        {insp.avgResponseHours}h avg response
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
