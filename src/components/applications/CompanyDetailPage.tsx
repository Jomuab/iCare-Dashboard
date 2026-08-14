import React, { useState, useMemo } from 'react';
import { ApplicationDetail, InspectionRecord, ApplicationDocumentFile } from '../../types';
import { InspectionResultsModal } from './InspectionResultsModal';
import { InspectionTeamModal, HandlerDetailsModal } from './InspectionTeamModal';
import { AuditLogModal, FullMapModal } from './AuditLogModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import {
  IconArrowLeft as ArrowLeft,
  IconSearch as Search,
  IconClipboardList as ClipboardList,
  IconMapPin as MapPin,
  IconMaximize as Maximize,
  IconEye as Eye,
  IconFileText as FileText,
  IconUsers as Users,
  IconCheck as Check,
  IconClock as Clock,
  IconCopy as Copy,
  IconPrinter as Printer,
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
  IconShieldCheck as ShieldCheck,
  IconPhone as Phone,
  IconMail as Mail,
  IconBuildingHospital as Hospital,
  IconBuilding as Building,
  IconUserCheck as UserCheck,
  IconCertificate as Certificate,
  IconCalendar as Calendar,
  IconInfoCircle as InfoCircle,
  IconBriefcase as Briefcase,
  IconCompass as Compass,
  IconStethoscope as Stethoscope,
  IconShare as Share,
  IconChecklist as Checklist,
  IconAlertCircle as AlertCircle,
  IconSquareCheck as SquareCheck,
  IconSquareX as SquareX,
  IconExternalLink as ExternalLink,
  IconWorld as World,
  IconHash as Hash,
} from '@tabler/icons-react';

interface CompanyDetailPageProps {
  application: ApplicationDetail;
  onBackToList: () => void;
  onSelectApplication: (appId: string) => void;
  allApplications: ApplicationDetail[];
}

export const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({
  application,
  onBackToList,
  onSelectApplication,
  allApplications,
}) => {
  // Modal states
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(
    application.inspections[0] || null
  );
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [handlerModalOpen, setHandlerModalOpen] = useState(false);
  const [auditLogModalOpen, setAuditLogModalOpen] = useState(false);
  const [fullMapModalOpen, setFullMapModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ApplicationDocumentFile | null>(null);
  const [docModalOpen, setDocModalOpen] = useState(false);

  // Interaction feedback states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'inspections' | 'services' | 'documents'>('all');

  // Search Application selector dropdown
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [appSearchQuery, setAppSearchQuery] = useState('');

  const handleCopy = (text: string, keyName: string) => {
    if (!text || text === '-') return;
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleOpenResults = (insp: InspectionRecord) => {
    setSelectedInspection(insp);
    setResultsModalOpen(true);
  };

  const handleViewDocument = (doc: ApplicationDocumentFile) => {
    setPreviewDoc(doc);
    setDocModalOpen(true);
  };

  // Quick next / prev navigation
  const currentIndex = allApplications.findIndex((a) => a.id === application.id);
  const prevApp = currentIndex > 0 ? allApplications[currentIndex - 1] : null;
  const nextApp = currentIndex < allApplications.length - 1 ? allApplications[currentIndex + 1] : null;

  // Filter application switcher
  const filteredApps = allApplications.filter(
    (app) =>
      app.trackingNumber.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
      app.organizationName?.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
      app.applicantName?.toLowerCase().includes(appSearchQuery.toLowerCase())
  );

  // Address cleaning and concatenation helpers
  const cleanText = (str?: string) => {
    if (!str || str === '-') return '';
    return str.replace(/\/[\u1200-\u137F]+/g, '').trim();
  };

  // Concatenate Facility Address: "Woreda 7, Addis Ketema, Addis Ababa"
  const formattedFacilityAddress = useMemo(() => {
    const parts: string[] = [];
    const woreda = cleanText(application.addressWoreda);
    const subCity = cleanText(application.addressSubCity);
    const city = cleanText(application.addressCity);
    const houseNo = application.addressHouseNumber && application.addressHouseNumber !== '-' ? application.addressHouseNumber : '';
    const specific = application.addressSpecificArea && application.addressSpecificArea !== '-' ? application.addressSpecificArea : '';

    if (woreda) parts.push(woreda.startsWith('Woreda') ? woreda : `Woreda ${woreda}`);
    if (subCity) parts.push(subCity);
    if (city) parts.push(city);
    if (houseNo) parts.push(`House No: ${houseNo}`);
    if (specific) parts.push(`(${specific})`);

    return parts.length > 0 ? parts.join(', ') : 'Addis Ababa, Ethiopia';
  }, [application]);

  // Concatenate Applicant Address: "Woreda 5, Akaki Kality, Addis Ababa"
  const formattedApplicantAddress = useMemo(() => {
    const parts: string[] = [];
    const woreda = cleanText(application.woreda);
    const subCity = cleanText(application.subCity);
    const city = cleanText(application.city);
    const houseNo = application.houseNumber && application.houseNumber !== '-' ? application.houseNumber : '';

    if (woreda) parts.push(woreda.startsWith('Woreda') ? woreda : `Woreda ${woreda}`);
    if (subCity) parts.push(subCity);
    if (city) parts.push(city);
    if (houseNo && houseNo !== 'aksnd') parts.push(`House: ${houseNo}`);

    return parts.length > 0 ? parts.join(', ') : 'Addis Ababa, Ethiopia';
  }, [application]);

  // Filtered Services list
  const filteredServices = useMemo(() => {
    const services = application.selectedServices || [];
    if (!serviceSearchQuery.trim()) return services;
    return services.filter((s) => s.toLowerCase().includes(serviceSearchQuery.toLowerCase()));
  }, [application.selectedServices, serviceSearchQuery]);

  // Inspection stats calculations
  const primaryInspection = application.inspections[0];
  const metCount = primaryInspection?.metCount ?? 11;
  const unmetCount = primaryInspection?.unmetCount ?? 3;
  const naCount = primaryInspection?.naCount ?? 5;
  const compliance = primaryInspection?.compliance ?? '78.5%';
  const totalScore = primaryInspection?.totalScore ?? '11.0 / 14.0';

  // Status Badge Styles
  const getStatusBadge = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes('success') || lower.includes('approved') || lower.includes('pass')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (lower.includes('critical') || lower.includes('reject')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (lower.includes('inspection') || lower.includes('review') || lower.includes('inprogress')) {
      return 'bg-sky-50 text-sky-700 border-sky-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-12">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER TOOLBAR & RECORD NAVIGATOR                                   */}
      {/* ========================================================================= */}
      <div className="bg-white p-3.5 sm:px-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Breadcrumb & Tracking Number with Status */}
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <button
            onClick={onBackToList}
            className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 font-bold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Applications</span>
          </button>
          <span className="text-slate-300">/</span>
          
          <div className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase">TRACKING:</span>
            <span className="font-mono font-extrabold text-slate-800 text-xs">
              {application.trackingNumber}
            </span>
            <button
              onClick={() => handleCopy(application.trackingNumber, 'header-tracking')}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
              title="Copy tracking number"
            >
              {copiedKey === 'header-tracking' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${getStatusBadge(
              application.currentStatus
            )}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            {application.currentStatus.toUpperCase()}
          </span>

          <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {application.organizationType || 'Health Facility'}
          </span>
        </div>

        {/* Action Controls & Application Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Record Switcher */}
          <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-0.5 shadow-2xs">
            <button
              onClick={() => prevApp && onSelectApplication(prevApp.id)}
              disabled={!prevApp}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white transition-colors"
              title="Previous Company Application"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-semibold px-2 text-slate-600 select-none">
              {currentIndex >= 0 ? currentIndex + 1 : 1} / {allApplications.length}
            </span>
            <button
              onClick={() => nextApp && onSelectApplication(nextApp.id)}
              disabled={!nextApp}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white transition-colors"
              title="Next Company Application"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search Selector Dropdown */}
          <div className="relative">
            <div className="flex items-center relative">
              <input
                type="text"
                placeholder="Jump to application..."
                value={appSearchQuery}
                onFocus={() => setSearchDropdownOpen(true)}
                onChange={(e) => {
                  setAppSearchQuery(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                className="w-36 sm:w-48 pl-3 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 focus:bg-white shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>

            {searchDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setSearchDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-64 overflow-y-auto py-1 text-xs divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                    Registered Applications ({filteredApps.length})
                  </div>
                  {filteredApps.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectApplication(item.id);
                        setSearchDropdownOpen(false);
                        setAppSearchQuery('');
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-sky-50/60 flex items-center justify-between transition-colors ${
                        item.id === application.id ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-mono text-xs font-bold text-slate-900">
                          {item.trackingNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {item.organizationName || item.applicantName}
                        </div>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${getStatusBadge(
                          item.currentStatus
                        )}`}
                      >
                        {item.currentStatus}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 shadow-2xs transition-colors"
            title="Print Application Dossier"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Audit Log Modal Trigger */}
          <button
            onClick={() => setAuditLogModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 shadow-2xs transition-all active:scale-95"
          >
            <ClipboardList className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Audit Log</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE HERO SUMMARY BANNER (High visual hierarchy, rich details)     */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Facility Name & Core Classification */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Hospital className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {application.organizationName || 'Facility Premise'}
                </h1>
                {application.institutionNameAm && application.institutionNameAm !== '-' && (
                  <span className="text-xs sm:text-sm font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {application.institutionNameAm}
                  </span>
                )}
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {application.ownership || 'Private / PLC'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-semibold text-slate-800">
                  {application.organizationalService || 'Hospitalier / Healthcare Service'}
                </span>
                <span className="text-slate-300">•</span>
                <span>{application.serviceGroup || 'Medical Health Care'}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  Applied on {application.submittedAt || application.appliedAt}
                </span>
              </p>
            </div>
          </div>

          {/* Quick High-Level Metrics Pill Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-50/80 p-2 sm:p-2.5 rounded-xl border border-slate-200/80">
            <div className="px-2.5 py-1 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                COMPLIANCE SCORE
              </span>
              <span className="text-sm font-extrabold text-emerald-700">
                {compliance} ({totalScore})
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
            <div className="px-2.5 py-1 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                SERVICES LICENSED
              </span>
              <span className="text-sm font-extrabold text-slate-800">
                {application.selectedServices.length} Selected
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
            <div className="px-2.5 py-1 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ACTIVE TASK
              </span>
              <span className="text-sm font-bold text-sky-700 truncate max-w-[140px] block">
                {application.currentTask?.name || 'Inspection'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RESPONSIVE BENTO GRID (Holds rich information without clutter)           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        
        {/* CARD A: Institution & Legal Profile */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                  <Building className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Institution & Legal Profile</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                REGISTRATION
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5 text-xs">
              {/* Institution Full Name */}
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  INSTITUTION NAME
                </span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                  {application.institutionName}
                  {application.institutionNameAm && application.institutionNameAm !== '-' && (
                    <span className="text-slate-500 font-normal ml-1">({application.institutionNameAm})</span>
                  )}
                </span>
              </div>

              {/* Ownership & Service Classification */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">OWNERSHIP</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                    {application.ownership || 'Private / PLC'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">SERVICE GROUP</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                    {application.serviceGroup || 'Hospitalier'}
                  </span>
                </div>
              </div>

              {/* Legal Identifiers (TIN, Reg No, Trade Name) - Concatenated */}
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  TAX & REGULATORY IDENTIFIERS
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700 font-mono text-[11px] pt-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-sans font-medium">TIN:</span>
                    <span className="font-bold text-slate-900">{application.tinNumber || '0000000000'}</span>
                    <button
                      onClick={() => handleCopy(application.tinNumber, 'tin')}
                      className="text-slate-400 hover:text-slate-700"
                      title="Copy TIN"
                    >
                      {copiedKey === 'tin' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-sans font-medium">Reg No:</span>
                    <span className="font-medium text-slate-800">{application.businessRegistrationNo || 'AA-DOC-2026'}</span>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">APP NUMBER</span>
                  <span className="font-mono font-bold text-slate-800 mt-0.5 block truncate">
                    {application.applicationNumber}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">FRANCHISE</span>
                  <span className="font-medium text-slate-700 mt-0.5 block truncate">
                    {application.franchise === 'Yes' ? `Franchise (${application.franchiser})` : 'Independent / No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Category: <strong className="text-slate-700">{application.category || 'Organization Service'}</strong></span>
            <span>Type: <strong className="text-slate-700">{application.applicationType || 'New License'}</strong></span>
          </div>
        </div>

        {/* CARD B: Facility Premise Location & Geo Positioning */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Physical Premise & Geo Location</h2>
              </div>
              <button
                onClick={() => setFullMapModalOpen(true)}
                className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
              >
                <Maximize className="w-3 h-3" />
                <span>EXPAND</span>
              </button>
            </div>

            <div className="mt-3.5 space-y-2.5 text-xs">
              {/* Concatenated Address Line (As requested: "Woreda 7, Addis Ketema, Addis Ababa (House: aksd)") */}
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  PHYSICAL ADDRESS (CONCATENATED)
                </span>
                <div className="flex items-start gap-1.5 mt-1 font-semibold text-slate-800">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{formattedFacilityAddress}</span>
                </div>
              </div>

              {/* Contact Information (Email & Phone Concatenated) */}
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  PREMISE CONTACT CHANNELS
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700 font-medium text-xs">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                    <span>{application.addressEmail || 'aknd@Kasdc.cocc'}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{application.addressPhone || application.phoneNumber || '(912) 031-023'}</span>
                  </div>
                </div>
              </div>

              {/* Mini Map Widget with Geo Pin */}
              <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-100 h-28 group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-50 flex items-center justify-center p-2">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <MapPin className="w-6 h-6 text-rose-600 mx-auto animate-bounce" />
                      <div className="w-3 h-1 bg-slate-400/50 rounded-full mx-auto -mt-1 blur-xs"></div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-800 block mt-0.5">
                      Lat: {Number(application.latitude || 9.0372).toFixed(4)}°, Lng: {Number(application.longitude || 38.7352).toFixed(4)}°
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {application.addressSubCity || 'Addis Ketema'}, Addis Ababa
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(`${application.latitude}, ${application.longitude}`, 'coords')}
                    className="px-2 py-0.5 bg-white/90 hover:bg-white text-slate-700 font-bold text-[10px] rounded shadow-2xs border border-slate-300 flex items-center gap-1 transition-colors"
                    title="Copy GPS Coordinates"
                  >
                    {copiedKey === 'coords' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copy GPS</span>
                  </button>
                  <button
                    onClick={() => setFullMapModalOpen(true)}
                    className="px-2 py-0.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] rounded shadow-2xs flex items-center gap-1 transition-colors"
                  >
                    <Maximize className="w-3 h-3" />
                    <span>View Map</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Postal: <strong className="text-slate-700">{application.postalAddress || 'P.O. Box Addis Ababa'}</strong></span>
            <span>Area: <strong className="text-slate-700">{application.addressSpecificArea || 'Central Zone'}</strong></span>
          </div>
        </div>

        {/* CARD C: Applicant & Authorized Management */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <Users className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Applicant & Management</h2>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                {application.applicantType || 'Local Applicant'}
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5 text-xs">
              {/* Applicant Name & Type */}
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  AUTHORIZED APPLICANT
                </span>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>{application.applicantName || 'Primary Applicant'}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {application.applicantType || 'Local'}
                  </span>
                </div>
              </div>

              {/* Applicant Address (Concatenated as requested: Woreda 5, Akaki kality, Addis ababa) */}
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  APPLICANT RESIDENCE (CONCATENATED)
                </span>
                <div className="flex items-start gap-1.5 mt-1 font-semibold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{formattedApplicantAddress}</span>
                </div>
              </div>

              {/* Applicant Direct Contact */}
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  APPLICANT CONTACT DETAILS
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700 font-medium text-xs pt-0.5">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                    <span>{application.email || 'ajsd@jasd.com'}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{application.phoneNumber || '(912) 031-023'}</span>
                  </div>
                </div>
              </div>

              {/* Facility Medical Director / General Manager */}
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  GENERAL MANAGER / MEDICAL DIRECTOR
                </span>
                <div className="flex items-center justify-between mt-1 text-xs font-semibold text-slate-800">
                  <span>
                    {application.managerName && application.managerName !== '-'
                      ? application.managerName
                      : 'Authorized Officer (aksdn)'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {application.managerPhone && application.managerPhone !== '-'
                      ? application.managerPhone
                      : application.phoneNumber || '(912) 031-023'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Status: <strong className="text-emerald-700 font-bold">Verified Identity</strong></span>
            <span>Delegation: <strong className="text-slate-700">Official Representative</strong></span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. ACTIVE WORKFLOW TASK & CLINICAL SERVICES ROW                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left (7 cols): Current Task Workflow Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Current Task Detail</h3>
                  <p className="text-[11px] text-slate-500">Active stage in the regulatory approval workflow</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Stage
              </span>
            </div>

            {/* Task Detail Grid */}
            <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">TASK NAME</span>
                <span className="font-bold text-slate-900 mt-0.5 block text-xs">
                  {application.currentTask.name}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">HANDLER USER</span>
                <span className="font-bold text-sky-800 mt-0.5 block text-xs truncate">
                  {application.currentTask.handlerUser}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">HANDLER TYPE & STAGE</span>
                <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                  {application.currentTask.handlerType} • {application.currentTask.inspectionStage || 'Premise'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">ESTIMATED SLA TIME</span>
                <span className="font-semibold text-amber-700 mt-0.5 block truncate">
                  {application.currentTask.estimatedTime}
                </span>
              </div>

              <div className="sm:col-span-2 p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">ASSIGNMENT TIMESTAMP</span>
                  <span className="font-mono font-medium text-slate-800 text-xs">
                    {application.currentTask.pickedAt}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">TASK TYPE</span>
                  <span className="font-semibold text-slate-800 text-xs capitalize">
                    {application.currentTask.type.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Assigned to: <strong className="text-slate-700">{application.currentTask.handlerUser}</strong>
            </span>
            <button
              onClick={() => setHandlerModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#29b6f6] hover:bg-[#0288d1] text-white text-xs font-bold rounded-lg shadow-xs transition-all active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Handler Details</span>
            </button>
          </div>
        </div>

        {/* Right (5 cols): Selected Clinical & Diagnostic Services */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Clinical & Diagnostic Services</h3>
                  <p className="text-[11px] text-slate-500">
                    {application.selectedServices.length} authorized service scope
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {application.selectedServices.length}
              </span>
            </div>

            {/* Live Filter Search within Services */}
            <div className="mt-3 relative">
              <input
                type="text"
                placeholder="Search services..."
                value={serviceSearchQuery}
                onChange={(e) => setServiceSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 focus:bg-white transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Badges Container */}
            <div className="mt-2.5 max-h-44 overflow-y-auto space-y-1.5 pr-1">
              {filteredServices.length > 0 ? (
                filteredServices.map((svc, idx) => {
                  const cleaned = cleanText(svc);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-slate-50/80 hover:bg-sky-50/60 rounded-lg border border-slate-100 transition-colors text-xs"
                    >
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                      <span className="font-semibold text-slate-800 truncate">{cleaned}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No services matching "{serviceSearchQuery}"
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Scope: <strong className="text-slate-700">Full Hospital Portfolio</strong></span>
            <span>Products: <strong className="text-slate-700">{application.selectedProducts || 'Medical Supplies'}</strong></span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. PREMISE INSPECTIONS & TECHNICAL CHECKLIST REGISTER (MET/UNMET Findings) */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Inspection Header & Stats Banner */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500 text-white shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Facility Premise Inspections & Technical Checklist
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                On-site regulatory inspection scoring, multi-member inspector findings, and{' '}
                <strong className="text-emerald-700">MET</strong> /{' '}
                <strong className="text-rose-700">UNMET</strong> evaluation records.
              </p>
            </div>

            {/* Summary Score Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold">
                <SquareCheck className="w-4 h-4 text-emerald-600" />
                <span>{metCount} Items MET</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-bold">
                <SquareX className="w-4 h-4 text-rose-600" />
                <span>{unmetCount} UNMET</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold">
                <span>{naCount} N/A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inspections Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Inspection Type</th>
                <th className="py-3.5 px-4">Inspection Subject</th>
                <th className="py-3.5 px-4">Stage</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4 text-center">Round</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Facilitator</th>
                <th className="py-3.5 px-4 text-center">Inspection Team</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {application.inspections.map((insp) => (
                <tr key={insp.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Inspection Type */}
                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {insp.inspectionType}
                  </td>

                  {/* Inspection Subject */}
                  <td className="py-4 px-4 font-medium text-slate-800 max-w-xs truncate">
                    {insp.inspection}
                  </td>

                  {/* Stage */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {insp.stages}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span className="font-extrabold text-slate-900 font-mono text-sm bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                      {insp.score}
                    </span>
                  </td>

                  {/* Round */}
                  <td className="py-4 px-4 text-center text-slate-500 font-bold font-mono whitespace-nowrap">
                    {insp.round}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-[#00a896] text-white shadow-2xs">
                      {insp.status}
                    </span>
                  </td>

                  {/* Facilitator */}
                  <td className="py-4 px-4 font-semibold text-slate-800 whitespace-nowrap">
                    {insp.facilitator}
                  </td>

                  {/* Inspection Team Modal Trigger */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedInspection(insp);
                        setTeamModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-300 shadow-2xs transition-all active:scale-95"
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Team ({insp.team?.length || 3})</span>
                    </button>
                  </td>

                  {/* View Results Modal Trigger (MET / UNMET breakdown) */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOpenResults(insp)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#29b6f6] hover:bg-[#0288d1] text-white font-bold text-xs rounded-lg shadow-2xs transition-all active:scale-95"
                    >
                      <Checklist className="w-3.5 h-3.5 text-white" />
                      <span>View Results</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Findings Summary Note */}
        {primaryInspection?.findingsSummary && (
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <InfoCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Lead Inspector Remarks: </span>
              <span>{primaryInspection.findingsSummary}</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. UPLOADED DOSSIER DOCUMENTS (If present on company records)              */}
      {/* ========================================================================= */}
      {application.files && application.files.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Uploaded Facility Dossier Files ({application.files.length})</span>
            </div>
            <span className="text-xs text-slate-500 font-semibold px-2 py-0.5 bg-white rounded border border-slate-200">
              Verified Legal Attachments
            </span>
          </div>

          <div className="p-4 sm:p-5 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Optional</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {application.files.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>{doc.documentName}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {doc.isCommonFile ? 'Common Regulatory File' : 'Facility Specific'}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {doc.isOptional ? 'Optional' : 'Mandatory Requirement'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#29b6f6] hover:bg-[#0288d1] text-white font-bold text-xs rounded-lg shadow-2xs transition-all active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5 text-white" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODALS                                                                 */}
      {/* ========================================================================= */}
      {selectedInspection && (
        <InspectionResultsModal
          isOpen={resultsModalOpen}
          onClose={() => setResultsModalOpen(false)}
          checklistGroups={selectedInspection.checklistGroups}
          totalScore={selectedInspection.totalScore}
          compliance={selectedInspection.compliance}
          itemsChecked={selectedInspection.itemsChecked}
          totalCategories={selectedInspection.totalCategories}
          totalServiceGroups={selectedInspection.totalServiceGroups}
          inspectionTitle={selectedInspection.inspection}
          inspectorName={selectedInspection.facilitator}
        />
      )}

      {selectedInspection && (
        <InspectionTeamModal
          isOpen={teamModalOpen}
          onClose={() => setTeamModalOpen(false)}
          team={selectedInspection.team}
          inspectionName={selectedInspection.inspection}
        />
      )}

      <HandlerDetailsModal
        isOpen={handlerModalOpen}
        onClose={() => setHandlerModalOpen(false)}
        task={application.currentTask}
      />

      <AuditLogModal
        isOpen={auditLogModalOpen}
        onClose={() => setAuditLogModalOpen(false)}
        trackingNumber={application.trackingNumber}
      />

      <FullMapModal
        isOpen={fullMapModalOpen}
        onClose={() => setFullMapModalOpen(false)}
        title={application.organizationName}
        lat={application.latitude}
        lng={application.longitude}
        subCity={application.addressSubCity}
      />

      <DocumentPreviewModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        document={previewDoc}
        applicantName={application.organizationName || application.applicantName}
        trackingNumber={application.trackingNumber}
      />
    </div>
  );
};
