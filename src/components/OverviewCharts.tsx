import React, { useState } from 'react';
import { FilterState } from '../types';
import {
  getFilteredApplicationsData,
  getFilteredTrendData,
  getFilteredDecisionsData,
} from '../utils/filterEngine';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { PieChart as PieIcon, TrendingUp, BarChart2 } from 'lucide-react';

interface OverviewChartsProps {
  filters: FilterState;
}

export const OverviewCharts: React.FC<OverviewChartsProps> = ({ filters }) => {
  const [appChartType, setAppChartType] = useState<'pie' | 'area' | 'bar'>('pie');
  const [licChartType, setLicChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [decChartType, setDecChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  const applicationsData = getFilteredApplicationsData(filters);
  const trendData = getFilteredTrendData(filters);
  const decisionData = getFilteredDecisionsData(filters);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Card 1: Applications Status Pie/Chart */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <h2 className="text-base font-bold text-slate-800">Applications</h2>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setAppChartType('pie')}
              className={`p-1 rounded-md text-xs transition-colors ${
                appChartType === 'pie'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Pie Chart"
            >
              <PieIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setAppChartType('area')}
              className={`p-1 rounded-md text-xs transition-colors ${
                appChartType === 'area'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Line Chart"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setAppChartType('bar')}
              className={`p-1 rounded-md text-xs transition-colors ${
                appChartType === 'bar'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Bar Chart"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="h-56 w-full flex items-center justify-center">
          {appChartType === 'pie' && (
            <div className="flex items-center w-full h-full">
              {/* Legend on left */}
              <div className="w-1/2 overflow-y-auto max-h-48 text-[10px] space-y-1 pr-1 custom-scrollbar">
                {applicationsData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-xs shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-600 truncate">{entry.name}</span>
                    <span className="text-slate-400 text-[9px] font-mono">
                      ({entry.value})
                    </span>
                  </div>
                ))}
              </div>

              {/* Pie Chart */}
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      dataKey="value"
                    >
                      {applicationsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [val.toLocaleString(), 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {appChartType === 'bar' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationsData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {appChartType === 'area' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationsData.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0288d1"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Card 2: Licenses Trend Line Graph */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-base font-bold text-slate-800">Licenses Trend</h2>
            <span className="text-[10px] text-slate-400 capitalize">
              {filters.period.toLowerCase()} view
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setLicChartType('line')}
              className={`p-1 rounded-md text-xs transition-colors ${
                licChartType === 'line'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLicChartType('bar')}
              className={`p-1 rounded-md text-xs transition-colors ${
                licChartType === 'bar'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {licChartType === 'line' ? (
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="organizations"
                  name="Organizations"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="individuals"
                  name="Individuals"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            ) : (
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
                <Bar dataKey="organizations" name="Organizations" fill="#10b981" stackId="a" />
                <Bar dataKey="individuals" name="Individuals" fill="#3b82f6" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card 3: Decisions Dual-Bar Graph */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <h2 className="text-base font-bold text-slate-800">Decisions</h2>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setDecChartType('bar')}
              className={`p-1 rounded-md text-xs transition-colors ${
                decChartType === 'bar'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDecChartType('line')}
              className={`p-1 rounded-md text-xs transition-colors ${
                decChartType === 'line'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={decisionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString()} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
