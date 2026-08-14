import React from 'react';
import {
  IconUserCheck as UserCheck,
  IconBuildingHospital as Hospital,
  IconBuildingStore as BuildingStore,
  IconAlertTriangle as AlertTriangle,
  IconCheck as Check,
  IconClock as Clock,
  IconSparkles as Sparkles,
  IconShieldCheck as ShieldCheck,
  IconSchool as School,
  IconCertificate as Certificate,
  IconAward as Award,
  IconActivity as Activity,
  IconCircleDot as CircleDot,
  IconFlame as Flame,
  IconFilter as Filter,
} from '@tabler/icons-react';

export type LicenseTab = 'Professional' | 'Facility' | 'FHR';

interface MinimalLicenseDashboardProps {
  activeTab: LicenseTab;
  activeQuickFilter: string;
  onSelectQuickFilter: (filter: string) => void;
  activeSubFilter: string;
  onSelectSubFilter: (filter: string) => void;
  totalRecordsCount: number;
}

export const MinimalLicenseDashboard: React.FC<MinimalLicenseDashboardProps> = ({
  activeTab,
  activeQuickFilter,
  onSelectQuickFilter,
  activeSubFilter,
  onSelectSubFilter,
  totalRecordsCount,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 transition-all animate-in fade-in duration-200">
      {/* Dynamic Header Info for Active Tab */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors ${
              activeTab === 'Professional'
                ? 'bg-sky-50 text-sky-700 border-sky-200'
                : activeTab === 'Facility'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            {activeTab === 'Professional' ? (
              <UserCheck className="w-5 h-5 text-sky-600" />
            ) : activeTab === 'Facility' ? (
              <Hospital className="w-5 h-5 text-emerald-600" />
            ) : (
              <BuildingStore className="w-5 h-5 text-indigo-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                REGULATORY REGISTRY INTELLIGENCE
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${
                  activeTab === 'Professional'
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : activeTab === 'Facility'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                {activeTab} Overview
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {activeTab === 'Professional'
                ? 'Health Professionals License Register & Cadre Analytics'
                : activeTab === 'Facility'
                ? 'Health Facilities Regulatory Status & Capacity Dashboard'
                : 'Food, Water & Health Related Establishments Registry'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-500 font-medium">Registry Size:</span>
          <span className="px-2.5 py-1 bg-slate-900 text-white font-extrabold text-xs rounded-lg shadow-2xs">
            {totalRecordsCount} Records
          </span>
        </div>
      </div>

      {/* Dynamic KPI Cards Grid based on Active Tab */}
      {activeTab === 'Professional' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Total Licensed HP */}
          <div className="p-3.5 bg-gradient-to-br from-sky-50/60 to-white border border-sky-100 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wide">
                Total Licensed HP
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded">
                +8.4% YoY
              </span>
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black text-slate-900">14,820</div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>94.2% in Active Good Standing</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: '94.2%' }} />
            </div>
          </div>

          {/* Card 2: Cadre Breakdown */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Top Cadre Distribution
              </span>
              <span className="text-[10px] font-semibold text-slate-500">Addis Ababa</span>
            </div>
            <div className="my-1 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Nurses & Midwives</span>
                <span className="font-bold text-slate-900">38% (5,630)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Medical Practitioners</span>
                <span className="font-bold text-slate-900">24% (3,556)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Pharmacy & Techs</span>
                <span className="font-bold text-slate-900">19% (2,815)</span>
              </div>
            </div>
            <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
              <div className="bg-cyan-500" style={{ width: '38%' }} title="Nurses 38%" />
              <div className="bg-indigo-500" style={{ width: '24%' }} title="Doctors 24%" />
              <div className="bg-emerald-500" style={{ width: '19%' }} title="Pharmacy 19%" />
              <div className="bg-amber-400" style={{ width: '19%' }} title="Other 19%" />
            </div>
          </div>

          {/* Card 3: Academic Qualifications */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Academic Qualifications
              </span>
              <School className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="my-1 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="text-slate-500 block text-[10px]">BSc Degrees</span>
                <span className="font-bold text-slate-900">58.7%</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Diplomas (L4)</span>
                <span className="font-bold text-slate-900">25.3%</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Dr. Degree (MD)</span>
                <span className="font-bold text-slate-900">9.8%</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Masters / Spec.</span>
                <span className="font-bold text-slate-900">6.2%</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">HERQA & MoH verified institutions</span>
          </div>

          {/* Card 4: Renewal & Expiry Radar */}
          <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Renewal & Expiry
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-200/80 text-amber-900 rounded">
                Action Required
              </span>
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black text-amber-950">384</div>
              <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                Licenses expiring in &lt; 30 days
              </div>
            </div>
            <button
              onClick={() => onSelectQuickFilter(activeQuickFilter === 'Expiring Soon' ? 'ALL' : 'Expiring Soon')}
              className={`w-full py-1 text-center text-[10px] font-bold rounded transition-colors ${
                activeQuickFilter === 'Expiring Soon'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white/80 hover:bg-white text-amber-800 border border-amber-300'
              }`}
            >
              {activeQuickFilter === 'Expiring Soon' ? '✓ Showing Expiring' : 'Filter Expiring Soon'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Facility' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Total Licensed Facilities */}
          <div className="p-3.5 bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
                Total Licensed Facilities
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                +6.2% YoY
              </span>
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black text-slate-900">2,450</div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>2,305 Operational & Validated</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94.1%' }} />
            </div>
          </div>

          {/* Card 2: Facility Tier Breakdown */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Facility Tier Mix
              </span>
              <span className="text-[10px] font-semibold text-slate-500">11 Sub-cities</span>
            </div>
            <div className="my-1 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">General & Spec. Hospitals</span>
                <span className="font-bold text-slate-900">12% (294)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Specialty & Medium Clinics</span>
                <span className="font-bold text-slate-900">60% (1,470)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Pharmacies & Labs</span>
                <span className="font-bold text-slate-900">28% (686)</span>
              </div>
            </div>
            <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
              <div className="bg-emerald-500" style={{ width: '12%' }} />
              <div className="bg-sky-500" style={{ width: '60%' }} />
              <div className="bg-purple-500" style={{ width: '28%' }} />
            </div>
          </div>

          {/* Card 3: Ownership Structure */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Ownership Model
              </span>
              <Certificate className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="my-1 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Private PLC</span>
                <span className="font-bold text-slate-900">64.0%</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Public / MoH</span>
                <span className="font-bold text-slate-900">28.0%</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="text-slate-500 block text-[10px]">NGO / Non-Profit</span>
                <span className="font-bold text-slate-900">8.0%</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Sole Proprietor</span>
                <span className="font-bold text-slate-900">12.5%</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">Commercial & Non-commercial registries</span>
          </div>

          {/* Card 4: Inspection Compliance Score */}
          <div className="p-3.5 bg-sky-50/60 border border-sky-200 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                Inspection Score
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-sky-200 text-sky-800 rounded">
                AAFDA Certified
              </span>
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black text-slate-900">
                91.8% <span className="text-xs font-bold text-sky-700">Audit Pass Rate</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                112 facilities due for annual audit this month
              </div>
            </div>
            <button
              onClick={() => onSelectQuickFilter(activeQuickFilter === 'Expiring Soon' ? 'ALL' : 'Expiring Soon')}
              className={`w-full py-1 text-center text-[10px] font-bold rounded transition-colors ${
                activeQuickFilter === 'Expiring Soon'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white/80 hover:bg-white text-sky-800 border border-sky-300'
              }`}
            >
              {activeQuickFilter === 'Expiring Soon' ? '✓ Showing Expiring' : 'View Expiring Facilities'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'FHR' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Total Registered FHR */}
          <div className="p-3.5 bg-gradient-to-br from-indigo-50/60 to-white border border-indigo-100 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide">
                Total Registered FHR
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded">
                +11.5% YoY
              </span>
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black text-slate-900">5,180</div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>4,890 Valid Sanitary Licenses</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '94.4%' }} />
            </div>
          </div>

          {/* Card 2: Sector Composition */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Industry Sector Mix
              </span>
              <span className="text-[10px] font-semibold text-slate-500">Food & Health</span>
            </div>
            <div className="my-1 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Food & Beverage Processing</span>
                <span className="font-bold text-slate-900">32% (1,657)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Water Bottling Plants</span>
                <span className="font-bold text-slate-900">21% (1,087)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Cosmetics & Hygiene</span>
                <span className="font-bold text-slate-900">19% (984)</span>
              </div>
            </div>
            <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
              <div className="bg-indigo-500" style={{ width: '32%' }} />
              <div className="bg-sky-400" style={{ width: '21%' }} />
              <div className="bg-teal-400" style={{ width: '19%' }} />
              <div className="bg-amber-400" style={{ width: '28%' }} />
            </div>
          </div>

          {/* Card 3: Sanitary Risk Grading */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Sanitary Risk Classification
              </span>
              <Activity className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="my-1 grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-emerald-50 p-1.5 rounded border border-emerald-100">
                <span className="text-[9px] font-bold text-emerald-800 block">GRADE A</span>
                <span className="text-sm font-black text-emerald-950">68%</span>
                <span className="text-[8px] text-emerald-600 block">Low Risk</span>
              </div>
              <div className="bg-sky-50 p-1.5 rounded border border-sky-100">
                <span className="text-[9px] font-bold text-sky-800 block">GRADE B</span>
                <span className="text-sm font-black text-sky-950">24%</span>
                <span className="text-[8px] text-sky-600 block">Standard</span>
              </div>
              <div className="bg-amber-50 p-1.5 rounded border border-amber-100">
                <span className="text-[9px] font-bold text-amber-800 block">GRADE C</span>
                <span className="text-sm font-black text-amber-950">8%</span>
                <span className="text-[8px] text-amber-600 block">Monitored</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">Quarterly microbiological audit verified</span>
          </div>

          {/* Card 4: HACCP & Safety Certification */}
          <div className="p-3.5 bg-indigo-50/50 border border-indigo-200 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                HACCP / GMP
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-200 text-indigo-900 rounded">
                88.6% Certified
              </span>
            </div>
            <div className="my-1.5">
              <div className="text-2xl font-black text-indigo-950">95</div>
              <div className="text-[11px] text-indigo-800 font-semibold mt-0.5">
                Critical sanitary audits scheduled this month
              </div>
            </div>
            <button
              onClick={() => onSelectQuickFilter(activeQuickFilter === 'Expiring Soon' ? 'ALL' : 'Expiring Soon')}
              className={`w-full py-1 text-center text-[10px] font-bold rounded transition-colors ${
                activeQuickFilter === 'Expiring Soon'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/80 hover:bg-white text-indigo-800 border border-indigo-300'
              }`}
            >
              {activeQuickFilter === 'Expiring Soon' ? '✓ Showing Expiring' : 'View Expiring FHR'}
            </button>
          </div>
        </div>
      )}

      {/* Quick Interactive Slicers / Category Filter Pills */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Quick Slice:
          </span>

          {activeTab === 'Professional' && (
            <>
              {['ALL', 'Nurse', 'Medical Practitioner', 'Pharmacy', 'Public Health', 'Dental'].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => onSelectQuickFilter(filter)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                      activeQuickFilter === filter
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                    }`}
                  >
                    {filter === 'ALL' ? 'All Professions' : filter}
                  </button>
                )
              )}
            </>
          )}

          {activeTab === 'Facility' && (
            <>
              {['ALL', 'Hospital', 'Specialty Clinic', 'Medium Clinic', 'Pharmacy', 'Lab'].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => onSelectQuickFilter(filter)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                      activeQuickFilter === filter
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                    }`}
                  >
                    {filter === 'ALL' ? 'All Facility Tiers' : filter}
                  </button>
                )
              )}
            </>
          )}

          {activeTab === 'FHR' && (
            <>
              {['ALL', 'Water Bottling', 'Food Production', 'Cosmetics', 'Catering', 'Traditional'].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => onSelectQuickFilter(filter)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                      activeQuickFilter === filter
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                    }`}
                  >
                    {filter === 'ALL' ? 'All FHR Sectors' : filter}
                  </button>
                )
              )}
            </>
          )}
        </div>

        {/* Secondary Sub-City / Status Quick Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Status:</span>
          {['ALL', 'Active', 'Expiring Soon', 'Under Renewal'].map((status) => (
            <button
              key={status}
              onClick={() => onSelectSubFilter(status)}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                activeSubFilter === status
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
