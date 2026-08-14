import React, { useState } from 'react';
import {
  IconX as X,
  IconFilter as Filter,
  IconRotate as Rotate,
  IconCheck as Check,
  IconCalendar as Calendar,
  IconBuildingCommunity as Building2,
} from '@tabler/icons-react';

export interface AdvancedLicenseFilters {
  subCity: string;
  woreda: string;
  status: string;
  prefix: string;
  qualification: string;
  ownership: string;
  issueYear: string;
}

interface LicenseFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedLicenseFilters;
  onApplyFilters: (filters: AdvancedLicenseFilters) => void;
  onResetFilters: () => void;
  activeTab: 'Professional' | 'Facility' | 'FHR';
}

const SUB_CITIES = [
  'ALL',
  'Bole',
  'Kirkos',
  'Yeka',
  'Akaki Kality',
  'Nifas Silk Lafto',
  'Lideta',
  'Arada',
  'Addis Ketema',
  'Gullele',
  'Lemi Kura',
  'Kolfe Keranio',
];

const STATUSES = ['ALL', 'Active', 'Expiring Soon', 'Under Renewal', 'Expired', 'Suspended'];

const PREFIXES = ['ALL', 'Junior', 'Senior', 'Chief', 'Expert', 'Senior Expert'];

const QUALIFICATIONS = ['ALL', 'Diploma', 'Degree', 'Dr.Degree', 'MSC degree', 'SPECIALIST'];

const OWNERSHIPS = [
  'ALL',
  'Private PLC',
  'Government / Public',
  'NGO / Non-Profit',
  'Sole Proprietorship',
  'Share Company',
];

export const LicenseFiltersModal: React.FC<LicenseFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  activeTab,
}) => {
  const [draftFilters, setDraftFilters] = useState<AdvancedLicenseFilters>({ ...filters });

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(draftFilters);
    onClose();
  };

  const handleReset = () => {
    const resetValues: AdvancedLicenseFilters = {
      subCity: 'ALL',
      woreda: '',
      status: 'ALL',
      prefix: 'ALL',
      qualification: 'ALL',
      ownership: 'ALL',
      issueYear: 'ALL',
    };
    setDraftFilters(resetValues);
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Advanced License Filters</h3>
              <p className="text-xs text-slate-500">Refine {activeTab} registry search queries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Body Form */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Sub-City Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Sub-City Location</label>
            <select
              value={draftFilters.subCity}
              onChange={(e) => setDraftFilters({ ...draftFilters, subCity: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              {SUB_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city === 'ALL' ? 'All Sub-Cities' : city}
                </option>
              ))}
            </select>
          </div>

          {/* Woreda Filter */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Woreda Number (e.g. 02, 05)</label>
            <input
              type="text"
              placeholder="e.g. 03"
              value={draftFilters.woreda}
              onChange={(e) => setDraftFilters({ ...draftFilters, woreda: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Status Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">License Status</label>
            <select
              value={draftFilters.status}
              onChange={(e) => setDraftFilters({ ...draftFilters, status: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>

          {/* Professional Tab Specific Filters */}
          {activeTab === 'Professional' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Seniority Prefix</label>
                <select
                  value={draftFilters.prefix}
                  onChange={(e) => setDraftFilters({ ...draftFilters, prefix: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                >
                  {PREFIXES.map((p) => (
                    <option key={p} value={p}>
                      {p === 'ALL' ? 'All Prefixes' : p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Educational Qualification</label>
                <select
                  value={draftFilters.qualification}
                  onChange={(e) =>
                    setDraftFilters({ ...draftFilters, qualification: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                >
                  {QUALIFICATIONS.map((q) => (
                    <option key={q} value={q}>
                      {q === 'ALL' ? 'All Qualifications' : q}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Facility / FHR Tab Specific Filters */}
          {(activeTab === 'Facility' || activeTab === 'FHR') && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ownership Model</label>
              <select
                value={draftFilters.ownership}
                onChange={(e) => setDraftFilters({ ...draftFilters, ownership: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                {OWNERSHIPS.map((o) => (
                  <option key={o} value={o}>
                    {o === 'ALL' ? 'All Ownership Types' : o}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Issue Year */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Issued Year</label>
            <select
              value={draftFilters.issueYear}
              onChange={(e) => setDraftFilters({ ...draftFilters, issueYear: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1.5 text-xs"
          >
            <Rotate className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
