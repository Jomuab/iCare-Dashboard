import React, { useState } from 'react';
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
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Building,
  Tag,
  Filter,
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Accordion state for mobile drawer
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    search: false,
    customerType: true,
    datePeriod: false,
    deliveryCenter: false,
    ownership: false,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

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

  // Count active non-default filters for mobile badge indicator
  const activeFilterCount = [
    filters.customerType !== 'ALL',
    filters.deliveryCenter !== 'ALL',
    filters.branch !== 'All Branches',
    filters.woreda !== 'ALL',
    filters.ownership !== 'ALL',
    Boolean(filters.searchQuery),
  ].filter(Boolean).length;

  return (
    <>
      {/* ========================================== */}
      {/* 1. MOBILE DEVICE FILTER TRIGGER BAR (< md) */}
      {/* ========================================== */}
      <div className="md:hidden bg-white rounded-xl shadow-xs border border-slate-200 p-3 mb-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Main Mobile Filter Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex-1 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold px-3 py-2.5 rounded-lg transition-all flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-white/20 text-white">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <span>Filter Options</span>
              {activeFilterCount > 0 && (
                <span className="bg-sky-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-normal text-slate-300">
              <span className="truncate max-w-[110px] font-semibold text-sky-300">
                {filters.customerType === 'ALL' ? 'All Types' : filters.customerType}
              </span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Quick Reset */}
          <button
            onClick={onReset}
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium border border-slate-200 shrink-0"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Export */}
          <button
            onClick={onExport}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold shadow-xs shrink-0"
            title="Export Report"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Selected Summary Pill for quick context */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-medium text-slate-500 pt-1 pb-0.5 custom-scrollbar">
          <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0 font-semibold text-slate-700">
            {filters.period} Period
          </span>
          <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0 text-slate-700">
            Center: <strong className="text-slate-900">{filters.deliveryCenter}</strong>
          </span>
          {filters.branch !== 'All Branches' && (
            <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-md shrink-0 font-semibold">
              {filters.branch}
            </span>
          )}
          {filters.ownership !== 'ALL' && (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md shrink-0 font-semibold">
              {filters.ownership}
            </span>
          )}
          {filters.searchQuery && (
            <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md shrink-0 font-semibold">
              "{filters.searchQuery}"
            </span>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. DESKTOP FULL FILTER CARD (md and above) */}
      {/* ========================================== */}
      <div className="hidden md:block bg-white rounded-xl shadow-xs border border-slate-200 p-4 mb-6 space-y-4">
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

        {/* Middle Row: Date & Time Period Navigator */}
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <PeriodNavigator
            period={filters.period}
            onPeriodChange={(newPeriod: TimePeriod) =>
              setFilters((prev) => ({ ...prev, period: newPeriod }))
            }
            startDate={filters.startDate}
            endDate={filters.endDate}
            selectedDate={filters.selectedDate}
            onCustomDateChange={(start, end) =>
              setFilters((prev) => ({
                ...prev,
                period: 'CUSTOM',
                startDate: start,
                endDate: end,
              }))
            }
            onNavDateChange={(dateStr) =>
              setFilters((prev) => ({
                ...prev,
                selectedDate: dateStr,
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
              <option value="HEAD_OFFICE">AAFDA Head Office (HP)</option>
              <option value="ADDIS_MESOB">Addis Mesob / A-Mesob (HP)</option>
              <option value="BRANCH">Sub-City Branches (HF & FHR)</option>
              <option value="WOREDA">Woreda Level</option>
            </select>
          </div>

          {/* Dynamic Location Field */}
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

      {/* ========================================== */}
      {/* 3. MOBILE FILTER SLIDE-OVER DRAWER          */}
      {/* ========================================== */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[88vh] flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom duration-250">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-500 text-white">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Filter Options
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tap any item below to expand & configure filters
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Collapsable Accordions List */}
            <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar flex-1">
              {/* 1. Search Section */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleSection('search')}
                  className="w-full flex items-center justify-between p-3 text-left bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Search Keyword
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {filters.searchQuery
                          ? `Query: "${filters.searchQuery}"`
                          : 'Search by license number or applicant'}
                      </span>
                    </div>
                  </div>
                  {openSections.search ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openSections.search && (
                  <div className="p-3 border-t border-slate-100 bg-white">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="e.g. HP-2026-1029, Kebede..."
                        value={filters.searchQuery}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            searchQuery: e.target.value,
                          }))
                        }
                        className="w-full bg-slate-50 text-slate-800 text-xs font-medium pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Customer Type Section */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleSection('customerType')}
                  className="w-full flex items-center justify-between p-3 text-left bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <SlidersHorizontal className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Customer Type
                      </span>
                      <span className="text-[10px] font-semibold text-sky-600">
                        Active: {filters.customerType}
                      </span>
                    </div>
                  </div>
                  {openSections.customerType ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openSections.customerType && (
                  <div className="p-3 border-t border-slate-100 bg-white space-y-2">
                    {customerTypeTabs.map((tab) => {
                      const isAllowed = allowedCustomerTypes.includes(tab.id);
                      const isSelected = filters.customerType === tab.id;

                      return (
                        <button
                          key={tab.id}
                          disabled={!isAllowed}
                          onClick={() =>
                            isAllowed &&
                            setFilters((prev) => ({
                              ...prev,
                              customerType: tab.id,
                            }))
                          }
                          className={`w-full p-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-sky-500 text-white shadow-xs'
                              : isAllowed
                              ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                              : 'bg-slate-50 text-slate-400 border border-slate-200 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {!isAllowed && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                            <span>{tab.label}</span>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] bg-white text-sky-600 font-extrabold px-1.5 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Date & Period Section */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleSection('datePeriod')}
                  className="w-full flex items-center justify-between p-3 text-left bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Date & Period Navigator
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        Mode: {filters.period}
                      </span>
                    </div>
                  </div>
                  {openSections.datePeriod ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openSections.datePeriod && (
                  <div className="p-3 border-t border-slate-100 bg-white">
                    <PeriodNavigator
                      period={filters.period}
                      onPeriodChange={(newPeriod: TimePeriod) =>
                        setFilters((prev) => ({ ...prev, period: newPeriod }))
                      }
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      selectedDate={filters.selectedDate}
                      onCustomDateChange={(start, end) =>
                        setFilters((prev) => ({
                          ...prev,
                          period: 'CUSTOM',
                          startDate: start,
                          endDate: end,
                        }))
                      }
                      onNavDateChange={(dateStr) =>
                        setFilters((prev) => ({
                          ...prev,
                          selectedDate: dateStr,
                        }))
                      }
                    />
                  </div>
                )}
              </div>

              {/* 4. Delivery Center & Location Section */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleSection('deliveryCenter')}
                  className="w-full flex items-center justify-between p-3 text-left bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Delivery Center & Location
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {filters.deliveryCenter === 'BRANCH'
                          ? `Branch: ${filters.branch}`
                          : filters.deliveryCenter === 'WOREDA'
                          ? `Woreda: ${filters.woreda}`
                          : filters.deliveryCenter}
                      </span>
                    </div>
                  </div>
                  {openSections.deliveryCenter ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openSections.deliveryCenter && (
                  <div className="p-3 border-t border-slate-100 bg-white space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                        Delivery Center Scope
                      </label>
                      <select
                        value={filters.deliveryCenter}
                        onChange={(e) =>
                          handleDeliveryCenterChange(
                            e.target.value as DeliveryCenterType
                          )
                        }
                        className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="ALL">All Delivery Centers</option>
                        <option value="HEAD_OFFICE">AAFDA Head Office (HP)</option>
                        <option value="ADDIS_MESOB">Addis Mesob / A-Mesob (HP)</option>
                        <option value="BRANCH">Sub-City Branches (HF & FHR)</option>
                        <option value="WOREDA">Woreda Level</option>
                      </select>
                    </div>

                    {filters.deliveryCenter === 'BRANCH' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-600" />
                          Select Branch
                        </label>
                        <select
                          value={filters.branch}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              branch: e.target.value as BranchName,
                            }))
                          }
                          className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                        >
                          {allowedBranches.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {filters.deliveryCenter === 'WOREDA' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-600" />
                          Select Woreda
                        </label>
                        <select
                          value={filters.woreda}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              woreda: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="ALL">All Woredas</option>
                          <option value="Woreda 01">Woreda 01</option>
                          <option value="Woreda 02">Woreda 02</option>
                          <option value="Woreda 03">Woreda 03</option>
                          <option value="Woreda 04">Woreda 04</option>
                          <option value="Woreda 05">Woreda 05</option>
                          <option value="Woreda 06">Woreda 06</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 5. Ownership Type Section */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleSection('ownership')}
                  className="w-full flex items-center justify-between p-3 text-left bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Ownership Type
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {filters.ownership === 'ALL'
                          ? 'All Ownership Types'
                          : filters.ownership}
                      </span>
                    </div>
                  </div>
                  {openSections.ownership ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openSections.ownership && (
                  <div className="p-3 border-t border-slate-100 bg-white">
                    <select
                      value={filters.ownership}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          ownership: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="ALL">All Ownership</option>
                      <option value="PLC">PLC (Private Ltd)</option>
                      <option value="NGO">NGO / Non-Profit</option>
                      <option value="Government">Government / Public</option>
                      <option value="Private/Sole">Sole Ownership</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Footer */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onReset();
                  setMobileDrawerOpen(false);
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs text-center transition-colors"
              >
                Apply & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


