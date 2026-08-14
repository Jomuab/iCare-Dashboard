import React, { useState, useMemo } from 'react';
import { ApplicationDetail } from '../../types';
import {
  IconSearch as Search,
  IconFilter as Filter,
  IconColumns as Columns,
  IconLayoutList as LayoutList,
  IconMaximize as Maximize,
  IconEye as Eye,
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
  IconChevronsLeft as ChevronsLeft,
  IconChevronsRight as ChevronsRight,
  IconArrowUp as ArrowUp,
  IconArrowDown as ArrowDown,
  IconArrowsSort as ArrowsSort,
  IconBuilding as Building,
  IconBuildingHospital as Hospital,
  IconStethoscope as Stethoscope,
  IconX as X,
  IconRefresh as Refresh,
  IconCopy as Copy,
  IconCheck as Check,
  IconDownload as Download,
  IconFileSpreadsheet as FileSpreadsheet,
  IconAlertTriangle as AlertTriangle,
  IconClock as Clock,
  IconCircleCheck as CircleCheck,
  IconUserCheck as UserCheck,
} from '@tabler/icons-react';

interface ApplicationsListPageProps {
  applications: ApplicationDetail[];
  onSelectApplication: (appId: string) => void;
}

export const ApplicationsListPage: React.FC<ApplicationsListPageProps> = ({
  applications,
  onSelectApplication,
}) => {
  // Active Tab: Default to 'Professional' as pictured in the user's latest screenshot
  const [activeTab, setActiveTab] = useState<'Professional' | 'Company' | 'Other'>('Professional');

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('In Progress');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchVisible, setSearchVisible] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<'trackingNumber' | 'appliedAt' | 'currentStatus'>('appliedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Selection
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Tab Counts
  const professionalApps = useMemo(
    () => applications.filter((a) => a.categoryType === 'PROFESSIONAL' || a.educationalDetails),
    [applications]
  );
  const companyApps = useMemo(
    () => applications.filter((a) => a.categoryType !== 'PROFESSIONAL' && !a.educationalDetails),
    [applications]
  );

  const currentTabApps = activeTab === 'Professional' ? professionalApps : companyApps;

  const handleCopyTracking = (e: React.MouseEvent, trackingNo: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(trackingNo);
    setCopiedId(trackingNo);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter logic
  const filteredApplications = useMemo(() => {
    return currentTabApps.filter((app) => {
      // Status Filter
      if (statusFilter !== 'All') {
        const lowerStatus = app.currentStatus.toLowerCase();
        const lowerFilter = statusFilter.toLowerCase();
        if (lowerFilter === 'in progress') {
          if (!['inprogress', 'basic', 'review', 'doc', 'payment', 'in progress', 'inspection'].includes(lowerStatus)) {
            return false;
          }
        } else if (lowerStatus !== lowerFilter) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTracking = app.trackingNumber.toLowerCase().includes(query);
        const matchApplicant = app.applicantName?.toLowerCase().includes(query);
        const matchProfession = app.educationalDetails?.profession.toLowerCase().includes(query);
        const matchOrg = app.organizationName?.toLowerCase().includes(query);
        if (!matchTracking && !matchApplicant && !matchProfession && !matchOrg) {
          return false;
        }
      }

      return true;
    });
  }, [currentTabApps, statusFilter, searchQuery]);

  const sortedApplications = useMemo(() => {
    return [...filteredApplications].sort((a, b) => {
      const fieldA = a[sortField] || '';
      const fieldB = b[sortField] || '';
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredApplications, sortField, sortDirection]);

  const totalSimulatedCount = activeTab === 'Professional' ? 226 : 510;
  const totalPages = Math.ceil(totalSimulatedCount / rowsPerPage);

  const paginatedApplications = useMemo(() => {
    return sortedApplications.slice(0, rowsPerPage);
  }, [sortedApplications, rowsPerPage]);

  const handleSort = (field: 'trackingNumber' | 'appliedAt' | 'currentStatus') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected: Record<string, boolean> = {};
    if (checked) {
      paginatedApplications.forEach((app) => {
        newSelected[app.id] = true;
      });
    }
    setSelectedIds(newSelected);
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedCount = Object.values(selectedIds).filter(Boolean).length;

  const getStatusBadge = (status: string) => {
    const lower = status.toLowerCase();
    switch (lower) {
      case 'basic':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Basic
          </span>
        );
      case 'doc':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Doc
          </span>
        );
      case 'review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Review
          </span>
        );
      case 'payment':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Payment
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Success
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            {status}
          </span>
        );
    }
  };

  const isAllSelected =
    paginatedApplications.length > 0 &&
    paginatedApplications.every((app) => selectedIds[app.id]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Quick Stats Status Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          onClick={() => setStatusFilter('All')}
          className={`p-3 rounded-xl border text-left transition-all duration-150 ${
            statusFilter === 'All'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">Total Registry</div>
          <div className="text-xl font-extrabold mt-0.5">{totalSimulatedCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('In Progress')}
          className={`p-3 rounded-xl border text-left transition-all duration-150 ${
            statusFilter === 'In Progress'
              ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-[1.02]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-sky-200 hover:bg-sky-50/50 shadow-2xs'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-sky-500 flex items-center justify-between">
            <span>In Progress</span>
            <Clock className="w-3.5 h-3.5 opacity-80" />
          </div>
          <div className="text-xl font-extrabold text-sky-700 mt-0.5">226</div>
        </button>

        <button
          onClick={() => setStatusFilter('Basic')}
          className={`p-3 rounded-xl border text-left transition-all duration-150 ${
            statusFilter === 'Basic'
              ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-[1.02]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Basic</span>
            <UserCheck className="w-3.5 h-3.5 opacity-80" />
          </div>
          <div className="text-xl font-extrabold text-slate-800 mt-0.5">184</div>
        </button>

        <button
          onClick={() => setStatusFilter('Review')}
          className={`p-3 rounded-xl border text-left transition-all duration-150 ${
            statusFilter === 'Review'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 shadow-2xs'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 flex items-center justify-between">
            <span>Review</span>
            <Search className="w-3.5 h-3.5 opacity-80" />
          </div>
          <div className="text-xl font-extrabold text-indigo-700 mt-0.5">28</div>
        </button>

        <button
          onClick={() => setStatusFilter('Doc')}
          className={`p-3 rounded-xl border text-left transition-all duration-150 ${
            statusFilter === 'Doc'
              ? 'bg-sky-500 text-white border-sky-500 shadow-md scale-[1.02]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-sky-200 hover:bg-sky-50/50 shadow-2xs'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600 flex items-center justify-between">
            <span>Doc Verification</span>
            <AlertTriangle className="w-3.5 h-3.5 opacity-80" />
          </div>
          <div className="text-xl font-extrabold text-sky-700 mt-0.5">14</div>
        </button>

        <button
          onClick={() => setStatusFilter('Success')}
          className={`p-3 rounded-xl border text-left transition-all duration-150 ${
            statusFilter === 'Success'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 shadow-2xs'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center justify-between">
            <span>License Issued</span>
            <CircleCheck className="w-3.5 h-3.5 opacity-80" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 mt-0.5">192</div>
        </button>
      </div>

      {/* 2. Primary Tabs Header */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 pt-4 pb-0 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Applications</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                Live Register
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Ethiopian Food & Healthcare Regulatory Authority credential & licensing applications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all ${
                isRefreshing ? 'animate-spin text-sky-600 border-sky-300' : ''
              }`}
              title="Refresh Registry"
            >
              <Refresh className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex items-center gap-6 mt-2 border-b border-slate-200 text-sm">
          <button
            onClick={() => setActiveTab('Professional')}
            className={`pb-2.5 font-bold text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'Professional'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Professional</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200">
              226
            </span>
          </button>
          <button
            onClick={() => setActiveTab('Company')}
            className={`pb-2.5 font-medium text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'Company'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Hospital className="w-4 h-4" />
            <span>Company</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
              510
            </span>
          </button>
          <button
            onClick={() => setActiveTab('Other')}
            className={`pb-2.5 font-medium text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'Other'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Other Facilities</span>
          </button>
        </div>
      </div>

      {/* 3. Main Applications Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Top Controls Bar (Matches Screenshot 1) */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>
                {activeTab === 'Professional'
                  ? 'Professional applications'
                  : 'Company applications'}
              </span>
              {statusFilter !== 'All' && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                  Filtered: {statusFilter}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing active health professional licensing applications.
            </p>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            {/* Status Dropdown Filter */}
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
              <label htmlFor="status-filter-select" className="text-xs font-bold text-slate-600">
                Status:
              </label>
              <select
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Basic">Basic</option>
                <option value="Doc">Doc</option>
                <option value="Review">Review</option>
                <option value="Payment">Payment</option>
                <option value="Success">Success</option>
              </select>
            </div>

            {/* Quick Search Input */}
            {searchVisible && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tracking, applicant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 w-44 sm:w-56 shadow-2xs transition-all"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons Toolbar */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={() => setSearchVisible((prev) => !prev)}
                className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors shadow-2xs"
                title="Toggle Search Field"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setStatusFilter('All');
                  setSearchQuery('');
                }}
                className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors shadow-2xs"
                title="Reset All Filters"
              >
                <Filter className="w-4 h-4" />
              </button>

              <button
                className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors shadow-2xs"
                title="Customize Columns"
              >
                <Columns className="w-4 h-4" />
              </button>

              <button
                className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors shadow-2xs"
                title="Layout View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Batch Selection Banner */}
        {selectedCount > 0 && (
          <div className="px-4 py-2.5 bg-sky-50 border-b border-sky-200 flex items-center justify-between text-xs text-sky-900 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 font-bold">
              <Check className="w-4 h-4 text-sky-600" />
              <span>{selectedCount} application(s) selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIds({})}
                className="px-2.5 py-1 text-slate-600 hover:bg-white rounded font-medium transition-colors"
              >
                Deselect All
              </button>
              <button className="px-3 py-1 bg-white hover:bg-slate-50 text-sky-700 font-bold rounded border border-sky-300 shadow-2xs flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>
        )}

        {/* 4. Interactive Data Table (Matches Screenshot 1 structure) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                {/* Select All Checkbox */}
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer"
                  />
                </th>

                {/* Tracking Number */}
                <th
                  onClick={() => handleSort('trackingNumber')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Tracking Number</span>
                    <span className="text-slate-400 group-hover:text-slate-700">
                      {sortField === 'trackingNumber' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-sky-600" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-sky-600" />
                        )
                      ) : (
                        <ArrowsSort className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </span>
                  </div>
                </th>

                {/* If Company Tab: Show Organization Name */}
                {activeTab === 'Company' && <th className="py-3 px-4">Organization Name</th>}

                {/* Applied At */}
                <th
                  onClick={() => handleSort('appliedAt')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Applied At</span>
                    <span className="text-slate-400 group-hover:text-slate-700">
                      {sortField === 'appliedAt' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-sky-600" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-sky-600" />
                        )
                      ) : (
                        <ArrowsSort className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Current Status */}
                <th
                  onClick={() => handleSort('currentStatus')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Current Status</span>
                    <span className="text-slate-400 group-hover:text-slate-700">
                      {sortField === 'currentStatus' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-sky-600" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-sky-600" />
                        )
                      ) : (
                        <ArrowsSort className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Actions */}
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400 text-sm">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-600">No applications match your criteria</p>
                      <button
                        onClick={() => {
                          setStatusFilter('All');
                          setSearchQuery('');
                        }}
                        className="text-xs text-sky-600 font-bold hover:underline mt-1"
                      >
                        Reset filters and view all
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((app) => {
                  const isChecked = selectedIds[app.id] || false;

                  return (
                    <tr
                      key={app.id}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer group ${
                        isChecked ? 'bg-sky-50/50' : ''
                      }`}
                      onClick={() => onSelectApplication(app.id)}
                    >
                      {/* Checkbox Column */}
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRow(app.id);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRow(app.id)}
                          className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer"
                        />
                      </td>

                      {/* Tracking Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                        <div className="flex items-center gap-2">
                          <span className="hover:text-sky-900 hover:underline">{app.trackingNumber}</span>
                          <button
                            onClick={(e) => handleCopyTracking(e, app.trackingNumber)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 rounded transition-opacity"
                            title="Copy tracking number"
                          >
                            {copiedId === app.trackingNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Organization Name (if Company tab) */}
                      {activeTab === 'Company' && (
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {app.organizationName}
                        </td>
                      )}

                      {/* Applied At */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {app.appliedAt}
                      </td>

                      {/* Current Status Badge */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(app.currentStatus)}
                      </td>

                      {/* Actions Column with [👁 View] */}
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onSelectApplication(app.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#29b6f6] hover:bg-[#0288d1] text-white text-xs font-bold rounded-lg shadow-xs hover:shadow-md transition-all active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Table Pagination Footer (Matches Screenshot 1) */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 bg-white">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-700 focus:ring-1 focus:ring-sky-500 shadow-2xs"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page Indicators & Navigation Buttons */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">
              1-10 of {totalSimulatedCount}
            </span>

            <div className="flex items-center gap-1 text-slate-600">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent shadow-2xs transition-colors"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent shadow-2xs transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent shadow-2xs transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent shadow-2xs transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
