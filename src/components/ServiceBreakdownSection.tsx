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
import { Building, Store } from 'lucide-react';

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

  // Customized radial doughnut label component matching Screenshot 2 style
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 14;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (value < 10) return null; // skip tiny overlap text

    return (
      <text
        x={x}
        y={y}
        fill="#334155"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="10"
        fontWeight="bold"
      >
        {value.toLocaleString()}
      </text>
    );
  };

  return (
    <div className="space-y-6 mb-6">
      {/* 1. Common & HP Services Section matching Screenshot 2 Layout */}
      {(customerType === 'ALL' || customerType === 'HP') && (
        <div className="space-y-6">
          {/* Row 1: License Summary by Service & Service Graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* List View Card */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
              <h2 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>License Summary by Service</span>
                <span className="text-xs font-normal text-slate-400">Common & HP Services</span>
              </h2>
              <div className="space-y-3">
                {serviceSummary.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Doughnut Graph Card */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
              <h2 className="text-base font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100">
                License Summary by Service Graph
              </h2>
              <div className="h-56 w-full flex items-center">
                {/* Legend */}
                <div className="w-1/2 space-y-2 text-xs">
                  {serviceSummary.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-slate-600 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
                {/* Chart */}
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceSummary}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={62}
                        paddingAngle={3}
                        dataKey="value"
                        label={renderCustomLabel}
                        labelLine={false}
                      >
                        {serviceSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => [val.toLocaleString(), 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Education Level Summary & Graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* List View */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
              <h2 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>License Summary by Education Level</span>
                <span className="text-xs font-normal text-slate-400">Health Professionals</span>
              </h2>
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {educationSummary.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Doughnut Graph */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
              <h2 className="text-base font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100">
                License Summary by Education Level Graph
              </h2>
              <div className="h-56 w-full flex items-center">
                {/* Legend */}
                <div className="w-1/2 space-y-1.5 text-xs max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                  {educationSummary.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-slate-600 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
                {/* Chart */}
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={educationSummary}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        label={renderCustomLabel}
                        labelLine={false}
                      >
                        {educationSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => [val.toLocaleString(), 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Prefix Summary & Graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
              <h2 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                License Summary by Prefix
              </h2>
              <div className="space-y-3">
                {prefixSummary.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
              <h2 className="text-base font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100">
                License Summary by Prefix Graph
              </h2>
              <div className="h-56 w-full flex items-center">
                <div className="w-1/2 space-y-2 text-xs">
                  {prefixSummary.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-slate-600 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prefixSummary}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={62}
                        paddingAngle={3}
                        dataKey="value"
                        label={renderCustomLabel}
                        labelLine={false}
                      >
                        {prefixSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => [val.toLocaleString(), 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
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
