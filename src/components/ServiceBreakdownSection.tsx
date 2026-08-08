import React from 'react';
import { FilterState } from '../types';
import { getFilteredServiceBreakdown } from '../utils/filterEngine';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Building,
  Store,
  FileCheck2,
  PieChart as PieChartIcon,
  GraduationCap,
  Tag,
  Sparkles,
} from 'lucide-react';

interface ServiceBreakdownSectionProps {
  filters: FilterState;
}

export const ServiceBreakdownSection: React.FC<ServiceBreakdownSectionProps> = ({
  filters,
}) => {
  const { customerType } = filters;
  const {
    serviceSummary,
    educationSummary,
    prefixSummary,
    hfServices,
    fhrServices,
  } = getFilteredServiceBreakdown(filters);

  // Totals for percentage calculations
  const totalServiceVal = serviceSummary.reduce((sum, item) => sum + item.value, 0) || 1;
  const totalEducationVal = educationSummary.reduce((sum, item) => sum + item.value, 0) || 1;
  const totalPrefixVal = prefixSummary.reduce((sum, item) => sum + item.value, 0) || 1;

  // Custom center label for doughnut charts
  const renderCenterLabel = (total: number, label: string) => {
    return (
      <g>
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-900 font-extrabold text-base sm:text-lg"
        >
          {total.toLocaleString()}
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-400 font-semibold text-[10px] uppercase tracking-wider"
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-6 mb-6">
      {/* 1. Common & HP Services Section */}
      {(customerType === 'ALL' || customerType === 'HP') && (
        <div className="space-y-6">
          {/* Row 1: License Summary by Service & Service Graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* List View Card */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-800">
                        License Summary by Service
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Service breakdown for health professionals
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                    {totalServiceVal.toLocaleString()} Total
                  </span>
                </div>

                <div className="space-y-3">
                  {serviceSummary.map((item, idx) => {
                    const pct = ((item.value / totalServiceVal) * 100).toFixed(1);
                    return (
                      <div
                        key={item.name}
                        className="p-2.5 rounded-lg bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="font-semibold text-slate-800 truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {pct}%
                            </span>
                            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                              {item.value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Doughnut Graph Card */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <PieChartIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-800">
                        License Summary by Service Graph
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Proportional distribution of active services
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Doughnut Share</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Doughnut Chart with Center SVG Callout */}
                  <div className="sm:col-span-6 h-56 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceSummary}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={72}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {serviceSummary.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        {renderCenterLabel(totalServiceVal, 'Services')}
                        <Tooltip
                          formatter={(val: number) => [
                            `${val.toLocaleString()} (${((val / totalServiceVal) * 100).toFixed(1)}%)`,
                            'Count',
                          ]}
                          contentStyle={{
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Custom Rich Legend */}
                  <div className="sm:col-span-6 space-y-2 text-xs max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {serviceSummary.map((item) => {
                      const pct = ((item.value / totalServiceVal) * 100).toFixed(1);
                      return (
                        <div
                          key={item.name}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 mr-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium text-slate-700 truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {pct}%
                            </span>
                            <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {item.value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Education Level Summary & Graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* List View */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-800">
                        License Summary by Education Level
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Qualifications of licensed health personnel
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {totalEducationVal.toLocaleString()} Total
                  </span>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {educationSummary.map((item, idx) => {
                    const pct = ((item.value / totalEducationVal) * 100).toFixed(1);
                    return (
                      <div
                        key={item.name}
                        className="p-2.5 rounded-lg bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="font-semibold text-slate-800 truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {pct}%
                            </span>
                            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                              {item.value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Doughnut Graph */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-100">
                      <PieChartIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-800">
                        License Summary by Education Level Graph
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Proportional distribution of academic degrees
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Doughnut Share</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-6 h-56 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={educationSummary}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={72}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {educationSummary.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        {renderCenterLabel(totalEducationVal, 'Degrees')}
                        <Tooltip
                          formatter={(val: number) => [
                            `${val.toLocaleString()} (${((val / totalEducationVal) * 100).toFixed(1)}%)`,
                            'Count',
                          ]}
                          contentStyle={{
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="sm:col-span-6 space-y-2 text-xs max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {educationSummary.map((item) => {
                      const pct = ((item.value / totalEducationVal) * 100).toFixed(1);
                      return (
                        <div
                          key={item.name}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 mr-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium text-slate-700 truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {pct}%
                            </span>
                            <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {item.value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Prefix Summary & Graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* List View */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-800">
                        License Summary by Prefix
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        License categorization by prefix taxonomy (HP, HF, FHR)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    {totalPrefixVal.toLocaleString()} Total
                  </span>
                </div>

                <div className="space-y-3">
                  {prefixSummary.map((item, idx) => {
                    const pct = ((item.value / totalPrefixVal) * 100).toFixed(1);
                    return (
                      <div
                        key={item.name}
                        className="p-2.5 rounded-lg bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="font-semibold text-slate-800 truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {pct}%
                            </span>
                            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                              {item.value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Doughnut Graph */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
                      <PieChartIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-800">
                        License Summary by Prefix Graph
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Visual breakdown by license prefix code
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Doughnut Share</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-6 h-56 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prefixSummary}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={72}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {prefixSummary.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        {renderCenterLabel(totalPrefixVal, 'Prefixes')}
                        <Tooltip
                          formatter={(val: number) => [
                            `${val.toLocaleString()} (${((val / totalPrefixVal) * 100).toFixed(1)}%)`,
                            'Count',
                          ]}
                          contentStyle={{
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="sm:col-span-6 space-y-2 text-xs max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {prefixSummary.map((item) => {
                      const pct = ((item.value / totalPrefixVal) * 100).toFixed(1);
                      return (
                        <div
                          key={item.name}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 mr-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium text-slate-700 truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {pct}%
                            </span>
                            <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {item.value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Health Facility & FHR Specific Services Section */}
      {(customerType === 'ALL' || customerType === 'HF' || customerType === 'FHR') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Health Facility Specific Services */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Building className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-800">
                Health Facility Specific Services
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Structural & administrative requests for clinics & hospitals
            </p>

            <div className="space-y-3">
              {hfServices.map((s) => (
                <div
                  key={s.name}
                  className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{s.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Avg turnaround: <span className="font-semibold text-emerald-700">{s.avgDays} days</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md shadow-xs border border-emerald-200">
                      {s.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FHR Specific Services */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Store className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-800">
                FHR Institution Specific Services
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Food & Health related production, wholesale, and service requests
            </p>

            <div className="space-y-3">
              {fhrServices.map((s) => (
                <div
                  key={s.name}
                  className="p-3 rounded-lg bg-amber-50/50 border border-amber-100 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{s.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Avg turnaround: <span className="font-semibold text-amber-700">{s.avgDays} days</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-800 bg-white px-2.5 py-1 rounded-md shadow-xs border border-amber-200">
                      {s.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

