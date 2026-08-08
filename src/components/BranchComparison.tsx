import React, { useState } from 'react';
import { FilterState } from '../types';
import { getFilteredBranchComparison } from '../utils/filterEngine';
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
import { Building, Award } from 'lucide-react';

interface BranchComparisonProps {
  filters: FilterState;
}

export const BranchComparison: React.FC<BranchComparisonProps> = ({ filters }) => {
  const [metric, setMetric] = useState<'issued' | 'days' | 'sla'>('issued');

  const branchData = getFilteredBranchComparison(filters);

  // Top branch by issuance
  const topBranch = [...branchData].sort(
    (a, b) => b.licensesIssued - a.licensesIssued
  )[0] || branchData[0];

  return (
    <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">
              Sub-city Branch Comparison Dashboard
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Performance & volume metrics across Bole, Kirkos, Yeka, Akaki Kality, Nifas Silk, Lideta, Arada
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setMetric('issued')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              metric === 'issued'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Total Issued
          </button>
          <button
            onClick={() => setMetric('days')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              metric === 'days'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Processing Speed (Days)
          </button>
          <button
            onClick={() => setMetric('sla')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              metric === 'sla'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SLA Compliance %
          </button>
        </div>
      </div>

      {/* Top Performing Branch Banner */}
      {topBranch && (
        <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 rounded-xl p-4 border border-indigo-100 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Most Productive Branch
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {topBranch.branch} Branch Sub-city
              </h3>
              <p className="text-xs text-slate-600">
                Issued{' '}
                <span className="font-bold text-indigo-700">
                  {topBranch.licensesIssued.toLocaleString()}
                </span>{' '}
                licenses ({topBranch.hfLicenses.toLocaleString()} HF + {topBranch.fhrLicenses.toLocaleString()} FHR)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs text-center">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Avg Speed</p>
              <p className="font-bold text-slate-800 text-sm">{topBranch.avgProcessingDays} Days</p>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs text-center">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">SLA Compliance</p>
              <p className="font-bold text-emerald-600 text-sm">{topBranch.slaCompliance}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Bar Chart comparing branches */}
      <div className="h-64 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={branchData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: number) => [
                metric === 'days'
                  ? `${value} Days`
                  : metric === 'sla'
                  ? `${value}%`
                  : value.toLocaleString(),
                metric === 'days'
                  ? 'Avg Days'
                  : metric === 'sla'
                  ? 'SLA %'
                  : 'Licenses Issued',
              ]}
            />
            {metric === 'issued' && (
              <>
                <Legend wrapperStyle={{ paddingTop: 6, fontSize: 11 }} />
                <Bar dataKey="hfLicenses" name="Health Facility (HF)" fill="#10b981" stackId="a" />
                <Bar dataKey="fhrLicenses" name="Food & Health Related (FHR)" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} />
              </>
            )}
            {metric === 'days' && (
              <Bar dataKey="avgProcessingDays" name="Avg Processing Days" fill="#6366f1" radius={[4, 4, 0, 0]} />
            )}
            {metric === 'sla' && (
              <Bar dataKey="slaCompliance" name="SLA Compliance %" fill="#0288d1" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
