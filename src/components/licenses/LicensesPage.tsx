import React, { useState, useMemo } from 'react';
import {
  PROFESSIONAL_LICENSES_SAMPLE,
  FACILITY_LICENSES_SAMPLE,
  FHR_LICENSES_SAMPLE,
  ProfessionalLicenseRecord,
  FacilityLicenseRecord,
  FHRLicenseRecord,
} from '../../data/licensesData';
import { MinimalLicenseDashboard, LicenseTab } from './MinimalLicenseDashboard';
import { LicenseDetailModal } from './LicenseDetailModal';
import { LicenseFiltersModal, AdvancedLicenseFilters } from './LicenseFiltersModal';
import {
  IconUserCheck as UserCheck,
  IconBuildingHospital as Hospital,
  IconBuildingStore as BuildingStore,
  IconSearch as Search,
  IconFilter as Filter,
  IconDownload as Download,
  IconRefresh as Refresh,
  IconColumns as Columns,
  IconMaximize as Maximize,
  IconArrowsSort as ArrowsSort,
  IconArrowUp as ArrowUp,
  IconArrowDown as ArrowDown,
  IconDotsVertical as DotsVertical,
  IconGripVertical as GripVertical,
  IconEye as Eye,
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
  IconChevronsLeft as ChevronsLeft,
  IconChevronsRight as ChevronsRight,
  IconX as X,
  IconCheck as Check,
  IconCopy as Copy,
  IconLayoutGrid as LayoutGrid,
  IconList as List,
  IconChevronDown as ChevronDown,
  IconChevronUp as ChevronUp,
  IconFileSpreadsheet as FileSpreadsheet,
  IconPrinter as Printer,
} from '@tabler/icons-react';

interface ColumnFilterState {
  [key: string]: string;
}

export const LicensesPage: React.FC = () => {
  // 1. Primary State: Active Tab ('Professional' | 'Facility' | 'FHR')
  const [activeTab, setActiveTab] = useState<LicenseTab>('Professional');

  // 2. Minimal Dashboard controls
  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const [quickFilter, setQuickFilter] = useState<string>('ALL');
  const [statusSubFilter, setStatusSubFilter] = useState<string>('ALL');

  // 3. Search & Column Filters
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFilterState>({});
  const [showColumnSearchRow, setShowColumnSearchRow] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // 4. Advanced Filters Modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedLicenseFilters>({
    subCity: 'ALL',
    woreda: '',
    status: 'ALL',
    prefix: 'ALL',
    qualification: 'ALL',
    ownership: 'ALL',
    issueYear: 'ALL',
  });

  // 5. Selected Record for Certificate Modal
  const [selectedRecord, setSelectedRecord] = useState<
    ProfessionalLicenseRecord | FacilityLicenseRecord | FHRLicenseRecord | null
  >(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // 6. View mode & Sort & Pagination
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortField, setSortField] = useState<string>('licenseNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Column Visibility state
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    licenseNumber: true,
    previousLicenseNo: true,
    name: true,
    prefix: true,
    profession: true,
    department: true,
    qualification: true,
    status: true,
    subCity: true,
    issueDate: true,
    expiryDate: true,
  });
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);

  // Switch tabs handler
  const handleTabChange = (tab: LicenseTab) => {
    setActiveTab(tab);
    setQuickFilter('ALL');
    setStatusSubFilter('ALL');
    setColumnFilters({});
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  const handleOpenDetail = (
    record: ProfessionalLicenseRecord | FacilityLicenseRecord | FHRLicenseRecord
  ) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  // Base dataset depending on tab
  const rawData = useMemo(() => {
    if (activeTab === 'Professional') return PROFESSIONAL_LICENSES_SAMPLE;
    if (activeTab === 'Facility') return FACILITY_LICENSES_SAMPLE;
    return FHR_LICENSES_SAMPLE;
  }, [activeTab]);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return rawData.filter((item: any) => {
      // Global Search
      if (globalSearch.trim()) {
        const query = globalSearch.toLowerCase();
        const matchesGlobal =
          item.licenseNumber?.toLowerCase().includes(query) ||
          item.previousLicenseNo?.toLowerCase().includes(query) ||
          item.firstName?.toLowerCase().includes(query) ||
          item.lastName?.toLowerCase().includes(query) ||
          item.facilityName?.toLowerCase().includes(query) ||
          item.establishmentName?.toLowerCase().includes(query) ||
          item.profession?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.subCity?.toLowerCase().includes(query);
        if (!matchesGlobal) return false;
      }

      // Quick filter from minimal dashboard
      if (quickFilter !== 'ALL') {
        if (activeTab === 'Professional') {
          if (quickFilter === 'Expiring Soon') {
            if (item.status !== 'Expiring Soon') return false;
          } else {
            const matchesProf =
              item.profession?.toLowerCase().includes(quickFilter.toLowerCase()) ||
              item.department?.toLowerCase().includes(quickFilter.toLowerCase());
            if (!matchesProf) return false;
          }
        } else if (activeTab === 'Facility') {
          if (quickFilter === 'Expiring Soon') {
            if (item.status !== 'Expiring Soon') return false;
          } else {
            const matchesFac =
              item.facilityType?.toLowerCase().includes(quickFilter.toLowerCase());
            if (!matchesFac) return false;
          }
        } else if (activeTab === 'FHR') {
          if (quickFilter === 'Expiring Soon') {
            if (item.status !== 'Expiring Soon') return false;
          } else {
            const matchesFhr =
              item.category?.toLowerCase().includes(quickFilter.toLowerCase());
            if (!matchesFhr) return false;
          }
        }
      }

      // Status Sub-filter from dashboard
      if (statusSubFilter !== 'ALL') {
        if (item.status !== statusSubFilter) return false;
      }

      // Advanced Filters
      if (advancedFilters.subCity !== 'ALL' && item.subCity !== advancedFilters.subCity) {
        return false;
      }
      if (advancedFilters.woreda && !item.woreda?.includes(advancedFilters.woreda)) {
        return false;
      }
      if (advancedFilters.status !== 'ALL' && item.status !== advancedFilters.status) {
        return false;
      }
      if (activeTab === 'Professional') {
        if (advancedFilters.prefix !== 'ALL' && item.prefix !== advancedFilters.prefix) {
          return false;
        }
        if (
          advancedFilters.qualification !== 'ALL' &&
          item.qualification !== advancedFilters.qualification
        ) {
          return false;
        }
      }
      if (activeTab === 'Facility' || activeTab === 'FHR') {
        if (advancedFilters.ownership !== 'ALL' && item.ownership !== advancedFilters.ownership) {
          return false;
        }
      }
      if (advancedFilters.issueYear !== 'ALL') {
        if (!item.issueDate?.startsWith(advancedFilters.issueYear)) {
          return false;
        }
      }

      // Inline Column Filters
      for (const [colKey, filterVal] of Object.entries(columnFilters)) {
        const strVal = String(filterVal || '');
        if (!strVal.trim()) continue;
        const lowerVal = strVal.toLowerCase();
        let targetValue = '';

        if (colKey === 'licenseNumber') targetValue = item.licenseNumber || '';
        else if (colKey === 'previousLicenseNo') targetValue = item.previousLicenseNo || '';
        else if (colKey === 'firstName') targetValue = item.firstName || '';
        else if (colKey === 'middleName') targetValue = item.middleName || '';
        else if (colKey === 'lastName') targetValue = item.lastName || '';
        else if (colKey === 'prefix') targetValue = item.prefix || '';
        else if (colKey === 'profession') targetValue = item.profession || '';
        else if (colKey === 'department') targetValue = item.department || '';
        else if (colKey === 'qualification') targetValue = item.qualification || '';
        else if (colKey === 'facilityName') targetValue = item.facilityName || '';
        else if (colKey === 'facilityType') targetValue = item.facilityType || '';
        else if (colKey === 'establishmentName') targetValue = item.establishmentName || '';
        else if (colKey === 'category') targetValue = item.category || '';
        else if (colKey === 'subCity') targetValue = item.subCity || '';
        else if (colKey === 'status') targetValue = item.status || '';

        if (!targetValue.toLowerCase().includes(lowerVal)) {
          return false;
        }
      }

      return true;
    });
  }, [
    rawData,
    globalSearch,
    quickFilter,
    statusSubFilter,
    advancedFilters,
    columnFilters,
    activeTab,
  ]);

  // Sorting
  const sortedData = useMemo(() => {
    const data = [...filteredData];
    data.sort((a: any, b: any) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [filteredData, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleColumnFilterChange = (colKey: string, val: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [colKey]: val,
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setGlobalSearch('');
    setQuickFilter('ALL');
    setStatusSubFilter('ALL');
    setColumnFilters({});
    setAdvancedFilters({
      subCity: 'ALL',
      woreda: '',
      status: 'ALL',
      prefix: 'ALL',
      qualification: 'ALL',
      ownership: 'ALL',
      issueYear: 'ALL',
    });
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers =
      activeTab === 'Professional'
        ? ['License Number', 'Prev License', 'Name', 'Prefix', 'Profession', 'Dept', 'Qualification', 'SubCity', 'Status', 'Expiry']
        : activeTab === 'Facility'
        ? ['License Number', 'Facility Name', 'Type', 'Ownership', 'SubCity', 'Manager', 'Status', 'Expiry']
        : ['License Number', 'Establishment', 'Category', 'Grade', 'SubCity', 'Sanitary Officer', 'Status', 'Expiry'];

    const rows = filteredData.map((item: any) => {
      if (activeTab === 'Professional') {
        return [
          item.licenseNumber,
          item.previousLicenseNo || '',
          `${item.firstName} ${item.middleName} ${item.lastName}`,
          item.prefix,
          item.profession,
          item.department,
          item.qualification,
          item.subCity,
          item.status,
          item.expiryDate,
        ];
      } else if (activeTab === 'Facility') {
        return [
          item.licenseNumber,
          item.facilityName,
          item.facilityType,
          item.ownership,
          item.subCity,
          item.technicalManager,
          item.status,
          item.expiryDate,
        ];
      } else {
        return [
          item.licenseNumber,
          item.establishmentName,
          item.category,
          item.grade,
          item.subCity,
          item.sanitaryOfficer,
          item.status,
          item.expiryDate,
        ];
      }
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AAFDA_${activeTab}_Licenses_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters =
    globalSearch.trim() !== '' ||
    quickFilter !== 'ALL' ||
    statusSubFilter !== 'ALL' ||
    Object.values(columnFilters).some((v) => String(v || '').trim() !== '') ||
    advancedFilters.subCity !== 'ALL' ||
    advancedFilters.status !== 'ALL' ||
    advancedFilters.prefix !== 'ALL' ||
    advancedFilters.qualification !== 'ALL' ||
    advancedFilters.woreda !== '' ||
    advancedFilters.ownership !== 'ALL' ||
    advancedFilters.issueYear !== 'ALL';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Expiring Soon':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Under Renewal':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Expired':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* ---------------------------------------------------- */}
      {/* TOP HEADER & TAB BAR (Matching Screenshot) */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Licenses</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                Official Register
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive regulatory register & credential certification repository
            </p>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Toggle Dashboard visibility button */}
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {showDashboard ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Hide Analytics</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Show Analytics</span>
                </>
              )}
            </button>

            {/* Advanced Filters Button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                hasActiveFilters
                  ? 'bg-sky-50 text-sky-700 border-sky-300 ring-2 ring-sky-100'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-sky-600" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              )}
            </button>

            {/* Export Dropdown / Button */}
            <button
              onClick={exportToCSV}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* 3 Main Tabs: Professional, Facility, FHR (As in screenshot) */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto">
          {/* Tab 1: Professional */}
          <button
            onClick={() => handleTabChange('Professional')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'Professional'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Professional</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                activeTab === 'Professional'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {PROFESSIONAL_LICENSES_SAMPLE.length}
            </span>
          </button>

          {/* Tab 2: Facility */}
          <button
            onClick={() => handleTabChange('Facility')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'Facility'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Hospital className="w-4 h-4" />
            <span>Facility</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                activeTab === 'Facility'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {FACILITY_LICENSES_SAMPLE.length}
            </span>
          </button>

          {/* Tab 3: FHR */}
          <button
            onClick={() => handleTabChange('FHR')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'FHR'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BuildingStore className="w-4 h-4" />
            <span>FHR</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                activeTab === 'FHR'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {FHR_LICENSES_SAMPLE.length}
            </span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MINIMAL DYNAMIC DASHBOARD (Changes based on active tab) */}
      {/* ---------------------------------------------------- */}
      {showDashboard && (
        <MinimalLicenseDashboard
          activeTab={activeTab}
          activeQuickFilter={quickFilter}
          onSelectQuickFilter={(f) => {
            setQuickFilter(f);
            setCurrentPage(1);
          }}
          activeSubFilter={statusSubFilter}
          onSelectSubFilter={(s) => {
            setStatusSubFilter(s);
            setCurrentPage(1);
          }}
          totalRecordsCount={filteredData.length}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* TABLE CONTROLS TOOLBAR (Matching Screenshot Icons & Actions) */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left Controls: Refresh & Active Filters Notice */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 transition-colors cursor-pointer ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              title="Refresh Registry Data"
            >
              <Refresh className="w-4 h-4" />
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Active search query summary */}
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredData.length}</span> of{' '}
              <span className="font-bold text-slate-800">{rawData.length}</span> {activeTab} licenses
            </div>
          </div>

          {/* Right Toolbar Icons: Search, Filter toggle, Column Chooser, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Global Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={`Search ${activeTab} records...`}
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 text-slate-800 text-xs pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 w-48 sm:w-60"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Toggle Inline Column Search Row */}
            <button
              onClick={() => setShowColumnSearchRow(!showColumnSearchRow)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                showColumnSearchRow
                  ? 'bg-sky-50 text-sky-700 border-sky-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
              title="Toggle Column Filter Inputs"
            >
              <Filter className="w-4 h-4" />
            </button>

            {/* Columns Visibility Config */}
            <div className="relative">
              <button
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                title="Configure Columns"
              >
                <Columns className="w-4 h-4" />
              </button>

              {showColumnMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-30 space-y-2 text-xs">
                  <div className="font-bold text-slate-800 pb-1 border-b border-slate-100">
                    Visible Columns
                  </div>
                  {Object.keys(visibleColumns).map((colKey) => (
                    <label
                      key={colKey}
                      className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns[colKey]}
                        onChange={() =>
                          setVisibleColumns({
                            ...visibleColumns,
                            [colKey]: !visibleColumns[colKey],
                          })
                        }
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="capitalize">{colKey.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Reset All Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* MAIN DATA TABLE (Structured Exactly like Screenshot) */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              {/* Table Header with column sort, grip, menus, and inline search */}
              <thead className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200">
                {/* 1. Column Titles Row */}
                <tr>
                  {/* Column 1: License Number */}
                  <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1">
                        <GripVertical className="w-3 h-3 text-slate-300" />
                        <span>License Number</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleSort('licenseNumber')}
                          className="hover:text-sky-600"
                        >
                          {sortField === 'licenseNumber' ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-sky-600" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-sky-600" />
                            )
                          ) : (
                            <ArrowsSort className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                        <DotsVertical className="w-3 h-3 text-slate-400 hover:text-slate-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>

                  {/* Column 2: Previous License No */}
                  <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1">
                        <GripVertical className="w-3 h-3 text-slate-300" />
                        <span>Previous License No</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleSort('previousLicenseNo')}
                          className="hover:text-sky-600"
                        >
                          <ArrowsSort className="w-3 h-3 text-slate-400" />
                        </button>
                        <DotsVertical className="w-3 h-3 text-slate-400" />
                      </div>
                    </div>
                  </th>

                  {/* Column 3, 4, 5: Name fields depending on active tab */}
                  {activeTab === 'Professional' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-slate-300" />
                            <span>First Name</span>
                          </div>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-slate-300" />
                            <span>Middle Name</span>
                          </div>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-slate-300" />
                            <span>Last Name</span>
                          </div>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-slate-300" />
                            <span>Prefix</span>
                          </div>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-slate-300" />
                            <span>Profession</span>
                          </div>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-slate-300" />
                            <span>Department</span>
                          </div>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-slate-300" />
                            <span>Qualification</span>
                          </div>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                    </>
                  )}

                  {activeTab === 'Facility' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <span>Facility Name</span>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <span>Facility Type</span>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <span>Ownership</span>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <span>Sub-City</span>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <span>Technical Director</span>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                    </>
                  )}

                  {activeTab === 'FHR' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <span>Establishment Name</span>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <span>FHR Category</span>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <span>Risk Grade</span>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <span>Sub-City</span>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                        <div className="flex items-center justify-between gap-1.5">
                          <span>Sanitary / QC Lead</span>
                          <DotsVertical className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                    </>
                  )}

                  <th className="py-2.5 px-3 whitespace-nowrap border-r border-slate-200/60">
                    <span>Status</span>
                  </th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">
                    <span>Actions</span>
                  </th>
                </tr>

                {/* 2. Inline Column Filter Row (Matching the screenshot input boxes) */}
                {showColumnSearchRow && (
                  <tr className="bg-slate-100/70 border-t border-slate-200">
                    {/* Filter: License Number */}
                    <td className="p-1.5 border-r border-slate-200/60">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Filter No..."
                          value={columnFilters['licenseNumber'] || ''}
                          onChange={(e) =>
                            handleColumnFilterChange('licenseNumber', e.target.value)
                          }
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                        />
                        {columnFilters['licenseNumber'] && (
                          <button
                            onClick={() => handleColumnFilterChange('licenseNumber', '')}
                            className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Filter: Prev License */}
                    <td className="p-1.5 border-r border-slate-200/60">
                      <input
                        type="text"
                        placeholder="Filter Prev..."
                        value={columnFilters['previousLicenseNo'] || ''}
                        onChange={(e) =>
                          handleColumnFilterChange('previousLicenseNo', e.target.value)
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                      />
                    </td>

                    {activeTab === 'Professional' && (
                      <>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="First..."
                            value={columnFilters['firstName'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('firstName', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Middle..."
                            value={columnFilters['middleName'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('middleName', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Last..."
                            value={columnFilters['lastName'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('lastName', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Prefix..."
                            value={columnFilters['prefix'] || ''}
                            onChange={(e) => handleColumnFilterChange('prefix', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Profession..."
                            value={columnFilters['profession'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('profession', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Dept..."
                            value={columnFilters['department'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('department', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Qual..."
                            value={columnFilters['qualification'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('qualification', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                          />
                        </td>
                      </>
                    )}

                    {activeTab === 'Facility' && (
                      <>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Facility..."
                            value={columnFilters['facilityName'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('facilityName', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Type..."
                            value={columnFilters['facilityType'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('facilityType', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Ownership..."
                            value={columnFilters['ownership'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('ownership', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Sub-city..."
                            value={columnFilters['subCity'] || ''}
                            onChange={(e) => handleColumnFilterChange('subCity', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Director..."
                            value={columnFilters['technicalManager'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('technicalManager', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal"
                          />
                        </td>
                      </>
                    )}

                    {activeTab === 'FHR' && (
                      <>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Establishment..."
                            value={columnFilters['establishmentName'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('establishmentName', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Category..."
                            value={columnFilters['category'] || ''}
                            onChange={(e) => handleColumnFilterChange('category', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Grade..."
                            value={columnFilters['grade'] || ''}
                            onChange={(e) => handleColumnFilterChange('grade', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="Sub-city..."
                            value={columnFilters['subCity'] || ''}
                            onChange={(e) => handleColumnFilterChange('subCity', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200/60">
                          <input
                            type="text"
                            placeholder="QC Officer..."
                            value={columnFilters['sanitaryOfficer'] || ''}
                            onChange={(e) =>
                              handleColumnFilterChange('sanitaryOfficer', e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal"
                          />
                        </td>
                      </>
                    )}

                    {/* Filter: Status */}
                    <td className="p-1.5 border-r border-slate-200/60">
                      <input
                        type="text"
                        placeholder="Status..."
                        value={columnFilters['status'] || ''}
                        onChange={(e) => handleColumnFilterChange('status', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-normal"
                      />
                    </td>

                    {/* Clear column filters button */}
                    <td className="p-1.5 text-center">
                      <button
                        onClick={() => setColumnFilters({})}
                        className="text-[10px] text-slate-500 hover:text-slate-800 font-bold underline"
                      >
                        Clear
                      </button>
                    </td>
                  </tr>
                )}
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-200 bg-white">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="py-12 text-center text-slate-500 space-y-2 bg-slate-50/50"
                    >
                      <Filter className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="font-bold text-slate-700">No license records found</div>
                      <p className="text-xs text-slate-400">
                        Try resetting your search query or adjusting column filters.
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="px-3 py-1 bg-sky-600 text-white rounded-lg text-xs font-bold mt-2"
                      >
                        Reset All Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item: any, idx: number) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleOpenDetail(item)}
                        className={`hover:bg-sky-50/60 transition-colors cursor-pointer ${
                          isEven ? 'bg-white' : 'bg-slate-50/40'
                        }`}
                      >
                        {/* License Number with copy */}
                        <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 font-mono font-bold text-sky-700">
                          <div className="flex items-center gap-1.5">
                            <span>{item.licenseNumber}</span>
                            <button
                              onClick={(e) => handleCopy(e, item.licenseNumber)}
                              className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Copy License Number"
                            >
                              {copiedText === item.licenseNumber ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Previous License Number */}
                        <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 font-mono text-slate-600">
                          {item.previousLicenseNo || '-'}
                        </td>

                        {/* Columns for Professional */}
                        {activeTab === 'Professional' && (
                          <>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 font-bold text-slate-900">
                              {item.firstName}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 text-slate-800">
                              {item.middleName}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 text-slate-800">
                              {item.lastName}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100">
                              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                                {item.prefix}
                              </span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 font-semibold text-slate-800">
                              {item.profession}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 text-slate-600">
                              {item.department}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100">
                              <span className="font-semibold text-slate-700">{item.qualification}</span>
                            </td>
                          </>
                        )}

                        {/* Columns for Facility */}
                        {activeTab === 'Facility' && (
                          <>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 font-bold text-slate-900">
                              {item.facilityName}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 font-semibold text-emerald-800">
                              {item.facilityType}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 text-slate-600">
                              {item.ownership}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 font-medium text-slate-700">
                              {item.subCity}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 text-slate-800">
                              {item.technicalManager}
                            </td>
                          </>
                        )}

                        {/* Columns for FHR */}
                        {activeTab === 'FHR' && (
                          <>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 font-bold text-slate-900">
                              {item.establishmentName}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 font-semibold text-indigo-800">
                              {item.category}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {item.grade}
                              </span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 font-medium text-slate-700">
                              {item.subCity}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100 text-slate-800">
                              {item.sanitaryOfficer}
                            </td>
                          </>
                        )}

                        {/* Status Badge */}
                        <td className="py-3 px-3 whitespace-nowrap border-r border-slate-100">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${getStatusBadge(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Action Details */}
                        <td className="py-3 px-3 whitespace-nowrap text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(item);
                            }}
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
                            title="View Certificate"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((item: any) => (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-sky-300 hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    {item.licenseNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {activeTab === 'Professional'
                      ? `${item.firstName} ${item.middleName} ${item.lastName}`
                      : activeTab === 'Facility'
                      ? item.facilityName
                      : item.establishmentName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeTab === 'Professional'
                      ? `${item.prefix} • ${item.profession}`
                      : activeTab === 'Facility'
                      ? `${item.facilityType} • ${item.ownership}`
                      : `${item.category} • ${item.grade}`}
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sub-City:</span>
                    <span className="font-semibold text-slate-800">{item.subCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valid Until:</span>
                    <span className="font-semibold text-slate-800">{item.expiryDate}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <span className="text-xs font-bold text-sky-600 flex items-center gap-1">
                    <span>View Certificate</span>
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PAGINATION BAR (Matching Screenshot) */}
        {/* ---------------------------------------------------- */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-700"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-slate-400">|</span>
            <span>
              Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
            </span>
          </div>

          <div className="flex items-center gap-1 self-center sm:self-auto">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number indicators */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-md font-bold text-xs transition-colors ${
                    currentPage === p
                      ? 'bg-sky-600 text-white'
                      : 'hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* LICENSE CERTIFICATE & DETAIL MODAL */}
      {/* ---------------------------------------------------- */}
      <LicenseDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        record={selectedRecord}
        type={activeTab}
      />

      {/* ---------------------------------------------------- */}
      {/* ADVANCED FILTERS MODAL */}
      {/* ---------------------------------------------------- */}
      <LicenseFiltersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={advancedFilters}
        onApplyFilters={(f) => {
          setAdvancedFilters(f);
          setCurrentPage(1);
        }}
        onResetFilters={() => {
          setAdvancedFilters({
            subCity: 'ALL',
            woreda: '',
            status: 'ALL',
            prefix: 'ALL',
            qualification: 'ALL',
            ownership: 'ALL',
            issueYear: 'ALL',
          });
          setCurrentPage(1);
        }}
        activeTab={activeTab}
      />
    </div>
  );
};
