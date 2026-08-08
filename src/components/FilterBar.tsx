import React from 'react';
import {
  CustomerType,
  DeliveryCenterType,
  FilterState,
  TimePeriod,
  BranchName,
} from '../types';
import {
  Search,
  RotateCcw,
  Lock,
  Download,
  SlidersHorizontal,
  MapPin,
} from 'lucide-react';
import { PeriodNavigator } from './PeriodNavigator';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  allowedCustomerTypes: CustomerType[];
  allowedBranches: BranchName[];
  onReset: () => void;
  onExport: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  allowedCustomerTypes,
  allowedBranches,
  onReset,
  onExport,
}) => {
  const customerTypeTabs: { id: CustomerType; label: string }[] = [
    { id: 'ALL', label: 'All Customer Types' },
    { id: 'HP', label: 'Health Professional (HP)' },
    { id: 'HF', label: 'Health Facility (HF)' },
    { id: 'FHR', label: 'Food & Health Related (FHR)' },
  ];

  const handleDeliveryCenterChange = (center: DeliveryCenterType) => {
    setFilters((prev) => {
      const next = { ...prev, deliveryCenter: center };
      if (center === 'ALL' || center === 'HEAD_OFFICE') {
        next.branch = 'All Branches';
        next.woreda = 'ALL';
      } else if (center === 'BRANCH') {
        next.woreda = 'ALL';
      }
      return next;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 mb-6 space-y-4">
      {/* Top Row: Customer Type Tabs & Export/Reset */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600" />
            Customer Type:
          </span>

          {customerTypeTabs.map((tab) => {
            const isAllowed = allowedCustomerTypes.includes(tab.id);
            const isSelected = filters.customerType === tab.id;

            return (
              <button
                key={tab.id}
                disabled={!isAllowed}
                onClick={() =>
                  isAllowed &&
                  setFilters((prev) => ({ ...prev, customerType: tab.id }))
                }
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-xs'
                    : isAllowed
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                {!isAllowed && <Lock className="w-3 h-3 text-slate-400" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Export & Reset Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReset}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 border border-slate-200"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onExport}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dashboard Report</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Date & Time Period Navigator (Reference Screenshots 1 & 2) */}
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <PeriodNavigator
          period={filters.period}
          onPeriodChange={(newPeriod: TimePeriod) =>
            setFilters((prev) => ({ ...prev, period: newPeriod }))
          }
          startDate={filters.startDate}
          endDate={filters.endDate}
          onCustomDateChange={(start, end) =>
            setFilters((prev) => ({
              ...prev,
              period: 'CUSTOM',
              startDate: start,
              endDate: end,
            }))
          }
        />
      </div>

      {/* Bottom Row: Detailed Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
        {/* Delivery Center */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Delivery Center
          </label>
          <select
            value={filters.deliveryCenter}
            onChange={(e) =>
              handleDeliveryCenterChange(e.target.value as DeliveryCenterType)
            }
            className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Delivery Centers</option>
            <option value="HEAD_OFFICE">Head Office (HP)</option>
            <option value="BRANCH">Branch Level</option>
            <option value="WOREDA">Woreda Level</option>
          </select>
        </div>

        {/* Dynamic Location Field:
            - If Delivery Center is 'BRANCH', show Branch selector
            - If Delivery Center is 'WOREDA', show Woreda selector
            - If Delivery Center is 'ALL' or 'HEAD_OFFICE', show 'None'
        */}
        <div>
          {filters.deliveryCenter === 'BRANCH' ? (
            <>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-600" />
                Branch / Sub-city
              </label>
              <select
                value={filters.branch}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    branch: e.target.value as BranchName,
                  }))
                }
                className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
              >
                {allowedBranches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </>
          ) : filters.deliveryCenter === 'WOREDA' ? (
            <>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-600" />
                Woreda
              </label>
              <select
                value={filters.woreda}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, woreda: e.target.value }))
                }
                className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
              >
                <option value="ALL">All Woredas</option>
                <option value="Woreda 01">Woreda 01</option>
                <option value="Woreda 02">Woreda 02</option>
                <option value="Woreda 03">Woreda 03</option>
                <option value="Woreda 04">Woreda 04</option>
                <option value="Woreda 05">Woreda 05</option>
                <option value="Woreda 06">Woreda 06</option>
              </select>
            </>
          ) : (
            <>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Location
              </label>
              <div className="w-full bg-slate-100 text-slate-400 text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-200 flex items-center justify-between">
                <span>None</span>
                <span className="text-[10px] bg-slate-200/80 text-slate-500 px-1.5 py-0.5 rounded font-semibold">
                  {filters.deliveryCenter === 'HEAD_OFFICE'
                    ? 'Head Office'
                    : 'All Centers'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Ownership Type */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Ownership Type
          </label>
          <select
            value={filters.ownership}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, ownership: e.target.value }))
            }
            className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Ownership</option>
            <option value="PLC">PLC (Private Ltd)</option>
            <option value="NGO">NGO / Non-Profit</option>
            <option value="Government">Government / Public</option>
            <option value="Private/Sole">Sole Ownership</option>
          </select>
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Search Keyword
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="License #, Name..."
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  searchQuery: e.target.value,
                }))
              }
              className="w-full bg-slate-50 text-slate-800 text-xs font-medium pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

