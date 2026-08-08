import React, { useState } from 'react';
import { FilterState } from '../types';
import { getFilteredDeliveryCenterData } from '../utils/filterEngine';
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
import { Building2, Layers, BarChart2, Table } from 'lucide-react';

interface DeliveryCenterChartProps {
  filters: FilterState;
}

export const DeliveryCenterChart: React.FC<DeliveryCenterChartProps> = ({ filters }) => {
  const [viewMode, setViewMode] = useState<'stacked' | 'grouped' | 'table'>('stacked');
  const centerData = getFilteredDeliveryCenterData(filters);

  return (
    <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-800">
              License Distribution by Delivery Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown across Head Office (HP), Sub-city Branches (HF & FHR), and Woredas
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('stacked')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              viewMode === 'stacked'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Stacked</span>
          </button>
          <button
            onClick={() => setViewMode('grouped')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              viewMode === 'grouped'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Grouped</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              viewMode === 'table'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Data Table</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-semibold">Delivery Center</th>
                <th className="p-3 font-semibold text-right">Health Professional (HP)</th>
                <th className="p-3 font-semibold text-right">Health Facility (HF)</th>
                <th className="p-3 font-semibold text-right">Food & Health Related (FHR)</th>
                <th className="p-3 font-semibold text-right">Total Licenses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {centerData.map((row) => (
                <tr key={row.center} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-800">{row.center}</td>
                  <td className="p-3 text-right font-medium text-sky-600">
                    {row.hp.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-medium text-emerald-600">
                    {row.hf.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-medium text-amber-600">
                    {row.fhr.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    {row.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={centerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="center" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Licenses']} />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
              <Bar
                dataKey="hp"
                name="Health Professional (HP)"
                fill="#0288d1"
                stackId={viewMode === 'stacked' ? 'a' : undefined}
                radius={viewMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              />
              <Bar
                dataKey="hf"
                name="Health Facility (HF)"
                fill="#10b981"
                stackId={viewMode === 'stacked' ? 'a' : undefined}
                radius={viewMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              />
              <Bar
                dataKey="fhr"
                name="Food & Health Related (FHR)"
                fill="#f59e0b"
                stackId={viewMode === 'stacked' ? 'a' : undefined}
                radius={viewMode === 'stacked' ? [4, 4, 0, 0] : [4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
