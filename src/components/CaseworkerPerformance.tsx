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
  UserCheck,
} from 'lucide-react';

interface CaseworkerPerformanceProps {
  filters: FilterState;
}

export const CaseworkerPerformance: React.FC<CaseworkerPerformanceProps> = ({
  filters,
}) => {
  // CRITICAL REQUIREMENT: License Generation Summary by Caseworker is Health Professional license card
  // It MUST be shown for customer type Health Professional ('HP') ONLY.
  if (filters.customerType !== 'HP') {
    return null;
  }

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
  const [selectedProvider, setSelectedProvider] = useState<'ALL' | 'AAFDA' | 'ADDIS_MESOB'>('ALL');

  // Filter workers based on selected provider
  const filteredWorkers = workers.filter((w) => {
    if (selectedProvider === 'AAFDA') return w.provider === 'AAFDA';
    if (selectedProvider === 'ADDIS_MESOB') return w.provider === 'Addis Mesob';
    return true;
  });

  // Sorted top and least team leads from filtered Caseworkers based on active metric tab
  const activeSortKey = metricTab;
  const topTeamLeads = [...filteredWorkers]
    .sort((a, b) => b[activeSortKey] - a[activeSortKey])
    .slice(0, 5);
  const leastTeamLeads = [...filteredWorkers]
    .sort((a, b) => a[activeSortKey] - b[activeSortKey])
    .slice(0, 3);

  // Provider aggregates
  const aafdaWorkers = workers.filter((w) => w.provider === 'AAFDA');
  const addisMesobWorkers = workers.filter((w) => w.provider === 'Addis Mesob');

  const aafdaOutput = aafdaWorkers.reduce((sum, w) => sum + w[metricTab], 0);
  const addisMesobOutput = addisMesobWorkers.reduce((sum, w) => sum + w[metricTab], 0);

  const totalHpOutputInPeriod = filteredWorkers.reduce((sum, w) => sum + w[metricTab], 0);
  const avgSlaRate = Math.round(filteredWorkers.reduce((sum, w) => sum + w.slaRate, 0) / (filteredWorkers.length || 1));
  const topCaseworkerName = topTeamLeads[0]?.name || 'Gutu Kebede';

  return (
    <div className="space-y-6 mb-6">
      {/* Service Delivery Option Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-cyan-900 to-slate-900 rounded-xl p-4 sm:p-5 text-white shadow-md border border-cyan-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold tracking-wide border border-cyan-400/30">
                Health Professional Service Delivery
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold tracking-wide border border-emerald-400/30">
                AAFDA & Addis Mesob Performance
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Service Delivery Provider Breakdown: AAFDA vs Addis Mesob (A-Mesob)
            </h3>
            <p className="text-xs text-cyan-100/90 leading-relaxed">
              AAFDA platform owners have configured Health Professional services to be delivered either by <span className="font-semibold text-white">AAFDA Head Office</span> or <span className="font-semibold text-cyan-300">Addis Mesob (A-Mesob)</span> based on customer choice. Active Addis Mesob caseworkers include <span className="font-semibold text-white underline decoration-cyan-400">Iyasu Hordofa</span>, <span className="font-semibold text-white underline decoration-cyan-400">Betelhem M.</span>, and <span className="font-semibold text-white underline decoration-cyan-400">Gutu Kebede</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
            <div className="text-center px-2">
              <span className="block text-[10px] text-cyan-200 uppercase font-bold">AAFDA Output</span>
              <span className="text-base sm:text-lg font-extrabold text-white">{aafdaOutput.toLocaleString()}</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="block text-[10px] text-cyan-200 uppercase font-bold">A-Mesob Output</span>
              <span className="text-base sm:text-lg font-extrabold text-cyan-300">{addisMesobOutput.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Main Bar Chart Card: License Generation Summary by Caseworker */}
      <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
                  License Generation Summary by Caseworker
                </h2>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  Health Professional Only
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Output tracking across AAFDA & Addis Mesob HP caseworkers
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Service Provider Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => setSelectedProvider('ALL')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedProvider === 'ALL'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                All Providers
              </button>
              <button
                onClick={() => setSelectedProvider('AAFDA')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedProvider === 'AAFDA'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                AAFDA Only
              </button>
              <button
                onClick={() => setSelectedProvider('ADDIS_MESOB')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedProvider === 'ADDIS_MESOB'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                Addis Mesob (A-Mesob)
              </button>
            </div>

            {/* Timeframe Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setMetricTab(t)}
                  className={`px-2.5 py-1 text-xs font-bold capitalize rounded-lg transition-all ${
                    metricTab === t
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* HP Caseworker Quick Highlights Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 p-3 rounded-xl bg-sky-50/50 border border-sky-100/80">
          <div className="p-2.5 rounded-lg bg-white border border-sky-100/60 shadow-2xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {metricTab} HP Licenses ({selectedProvider})
            </p>
            <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
              {totalHpOutputInPeriod.toLocaleString()}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-sky-100/60 shadow-2xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Active Caseworkers
            </p>
            <p className="text-sm sm:text-base font-extrabold text-sky-600 mt-0.5">
              {filteredWorkers.length} Personnel
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-sky-100/60 shadow-2xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Avg SLA Rate
            </p>
            <p className="text-sm sm:text-base font-extrabold text-emerald-600 mt-0.5">
              {avgSlaRate}% SLA
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-sky-100/60 shadow-2xs truncate">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">
              Top Lead ({metricTab})
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5 truncate">
              {topCaseworkerName}
            </p>
          </div>
        </div>

        {/* Caseworkers Output Bar Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredWorkers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', angle: -20, textAnchor: 'end' }} height={50} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                formatter={(value: number) => [value.toLocaleString(), 'Licenses Issued']}
                contentStyle={{ borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}
              />
              <Legend wrapperStyle={{ paddingTop: 8, fontSize: 11 }} />
              <Bar dataKey="daily" name="Daily" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="weekly" name="Weekly" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="monthly" name="Monthly" fill="#f59e0b" radius={[4, 4, 0, 0]} />
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
                Caseworkers Performance Ranking
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Processing Output</span>
          </div>

          <div className="space-y-4">
            {/* Top Performers */}
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 block flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Top High Performers ({selectedProvider})
              </span>
              <div className="space-y-2">
                {topTeamLeads.map((cw, idx) => (
                  <div
                    key={cw.name}
                    className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs hover:bg-emerald-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-slate-800 truncate">{cw.name}</p>
                          {cw.provider === 'Addis Mesob' ? (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-teal-100 text-teal-800 rounded-md border border-teal-200 shrink-0">
                              Addis Mesob
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-sky-100 text-sky-800 rounded-md border border-sky-200 shrink-0">
                              AAFDA
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {cw.branch} • {cw.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="font-bold text-slate-900">{cw[metricTab].toLocaleString()} licenses</p>
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
                    className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 flex items-center justify-between text-xs hover:bg-amber-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-slate-800 truncate">{cw.name}</p>
                          {cw.provider === 'Addis Mesob' ? (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-teal-100 text-teal-800 rounded-md border border-teal-200 shrink-0">
                              Addis Mesob
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-sky-100 text-sky-800 rounded-md border border-sky-200 shrink-0">
                              AAFDA
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{cw.branch}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="font-bold text-slate-900">{cw[metricTab].toLocaleString()} licenses</p>
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
                    className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-center justify-between text-xs hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{insp.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {insp.branch} Branch • {insp.customerType} Scope
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
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
                    className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100 flex items-center justify-between text-xs hover:bg-rose-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{insp.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{insp.branch} Branch</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
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
