import React, { useState } from 'react';
import { FilterState } from '../types';
import { getFilteredOwnershipData } from '../utils/filterEngine';
import { TAXONOMY_DATA } from '../data/mockData';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  IconChartPie as PieIcon,
  IconGitFork as GitFork,
  IconChevronRight as ChevronRight,
  IconCircleCheck as CheckCircle2,
} from '@tabler/icons-react';

interface TaxonomyOwnershipSectionProps {
  filters: FilterState;
}

export const TaxonomyOwnershipSection: React.FC<TaxonomyOwnershipSectionProps> = ({
  filters,
}) => {
  const ownershipData = getFilteredOwnershipData(filters);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);
  const activeNode = TAXONOMY_DATA[selectedNodeIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      {/* Left Column: Ownership Type Breakdown */}
      <div className="lg:col-span-5 bg-white rounded-xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
            <PieIcon className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-800">
              Ownership Type Distribution
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Percentage share across registered facilities & institutions
          </p>

          <div className="h-52 w-full flex items-center justify-between">
            {/* Pie Chart */}
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ownershipData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ownershipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [val.toLocaleString(), 'Facilities']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend & Stats */}
            <div className="w-1/2 space-y-2.5 pl-2">
              {ownershipData.map((o) => (
                <div key={o.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: o.color }}
                    />
                    <span className="font-medium text-slate-700 truncate">{o.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {o.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-sky-50 text-sky-800">
            <p className="text-[10px] text-sky-600 font-semibold uppercase">PLC & Sole</p>
            <p className="font-bold text-base">
              {(
                (ownershipData.find((d) => d.name.includes('PLC'))?.percentage || 0) +
                (ownershipData.find((d) => d.name.includes('Private'))?.percentage || 0)
              ).toFixed(1)}
              %
            </p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
            <p className="text-[10px] text-emerald-600 font-semibold uppercase">NGO & Govt</p>
            <p className="font-bold text-base">
              {(
                (ownershipData.find((d) => d.name.includes('NGO'))?.percentage || 0) +
                (ownershipData.find((d) => d.name.includes('Government'))?.percentage || 0)
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Structure Context & Taxonomy Browser */}
      <div className="lg:col-span-7 bg-white rounded-xl p-5 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Structure Context & Service Taxonomy
              </h2>
              <p className="text-xs text-slate-500">
                Org Type → Org Sub-type → Service Group → Organizational Services
              </p>
            </div>
          </div>
        </div>

        {/* Category Node Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 custom-scrollbar">
          {TAXONOMY_DATA.map((node, idx) => {
            const isMatch =
              filters.customerType === 'ALL' || node.customerType === filters.customerType;
            return (
              <button
                key={idx}
                onClick={() => setSelectedNodeIndex(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedNodeIndex === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isMatch
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                    : 'bg-slate-50 text-slate-400 opacity-60'
                }`}
              >
                <span className="text-[10px] opacity-80 uppercase font-bold">
                  [{node.customerType}]
                </span>
                <span>{node.serviceGroup}</span>
              </button>
            );
          })}
        </div>

        {/* Visual 4-Step Hierarchy Stepper */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            {/* Step 1 */}
            <div className="bg-white px-3 py-2 rounded-lg shadow-xs border border-slate-200 flex-1 min-w-[110px]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                1. Org Type
              </span>
              <span className="font-bold text-indigo-700">{activeNode.orgType}</span>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />

            {/* Step 2 */}
            <div className="bg-white px-3 py-2 rounded-lg shadow-xs border border-slate-200 flex-1 min-w-[120px]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                2. Org Sub-Type
              </span>
              <span className="font-bold text-slate-800">{activeNode.orgSubType}</span>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />

            {/* Step 3 */}
            <div className="bg-white px-3 py-2 rounded-lg shadow-xs border border-slate-200 flex-1 min-w-[110px]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                3. Service Group
              </span>
              <span className="font-bold text-cyan-700">{activeNode.serviceGroup}</span>
            </div>
          </div>
        </div>

        {/* Step 4: Organizational Services Chips */}
        <div>
          <span className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
            4. Registered Organizational Services under ({activeNode.serviceGroup}):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeNode.orgServices.map((service, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between shadow-xs hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate">{service}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded-xs">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
