import React, { useState } from 'react';
import { ApplicationDetail, ApplicationDocumentFile } from '../../types';
import { HandlerDetailsModal } from './InspectionTeamModal';
import { AuditLogModal } from './AuditLogModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import {
  IconArrowLeft as ArrowLeft,
  IconSearch as Search,
  IconClipboardList as ClipboardList,
  IconMapPin as MapPin,
  IconEye as Eye,
  IconFileText as FileText,
  IconUsers as Users,
  IconCheck as Check,
  IconClock as Clock,
  IconCopy as Copy,
  IconPrinter as Printer,
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
  IconSchool as School,
  IconCertificate as Certificate,
  IconUserCheck as UserCheck,
  IconCalendar as Calendar,
  IconInfoCircle as InfoCircle,
} from '@tabler/icons-react';

interface HealthProfessionalDetailPageProps {
  application: ApplicationDetail;
  onBackToList: () => void;
  onSelectApplication: (appId: string) => void;
  allApplications: ApplicationDetail[];
}

export const HealthProfessionalDetailPage: React.FC<HealthProfessionalDetailPageProps> = ({
  application,
  onBackToList,
  onSelectApplication,
  allApplications,
}) => {
  // Modals
  const [handlerModalOpen, setHandlerModalOpen] = useState(false);
  const [auditLogModalOpen, setAuditLogModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ApplicationDocumentFile | null>(null);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Search Application selector dropdown
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleViewDoc = (doc: ApplicationDocumentFile) => {
    setPreviewDoc(doc);
    setDocModalOpen(true);
  };

  const currentIndex = allApplications.findIndex((a) => a.id === application.id);
  const prevApp = currentIndex > 0 ? allApplications[currentIndex - 1] : null;
  const nextApp = currentIndex < allApplications.length - 1 ? allApplications[currentIndex + 1] : null;

  const filteredApps = allApplications.filter((app) =>
    app.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.applicantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filesList = application.files || [];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Toolbar (Matches Screenshot 2 top bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:px-5 rounded-xl border border-slate-200 shadow-xs">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-semibold">
          <button
            onClick={onBackToList}
            className="text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-1 font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Applications</span>
          </button>
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-slate-800 text-xs">
              {application.trackingNumber}
            </span>
            <button
              onClick={() => handleCopy(application.trackingNumber, 'header-tracking')}
              className="text-slate-400 hover:text-slate-700 p-0.5"
              title="Copy tracking number"
            >
              {copiedKey === 'header-tracking' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            {application.currentStatus}
          </span>
        </div>

        {/* Top Right Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick prev / next switcher */}
          <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-0.5 shadow-2xs">
            <button
              onClick={() => prevApp && onSelectApplication(prevApp.id)}
              disabled={!prevApp}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white transition-colors"
              title="Previous Application"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-semibold px-2 text-slate-600">
              {currentIndex >= 0 ? currentIndex + 1 : 1} of {allApplications.length}
            </span>
            <button
              onClick={() => nextApp && onSelectApplication(nextApp.id)}
              disabled={!nextApp}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white transition-colors"
              title="Next Application"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick switcher search dropdown */}
          <div className="relative">
            <div className="flex items-center relative">
              <input
                type="text"
                placeholder="Select application..."
                value={searchQuery}
                onFocus={() => setSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                className="w-40 sm:w-52 pl-3 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 focus:bg-white shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>

            {searchDropdownOpen && (
              <div className="absolute right-0 mt-1 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto py-1 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                  Select Application
                </div>
                {filteredApps.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectApplication(item.id);
                      setSearchDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      item.trackingNumber === application.trackingNumber
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{item.trackingNumber}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {item.applicantName || item.organizationName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Print / Export Button */}
          <button
            onClick={() => window.print()}
            className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 shadow-2xs transition-colors"
            title="Print Dossier"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Audit Log Button */}
          <button
            onClick={() => setAuditLogModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 shadow-2xs transition-all active:scale-95"
          >
            <ClipboardList className="w-3.5 h-3.5 text-slate-600" />
            <span>Audit Log</span>
          </button>
        </div>
      </div>

      {/* 2. Top Two-Column Cards (Exact screenshot 2 layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Card: Application Number, Applicant Details, Address, Educational Details, Undersupervision Status, Other Details */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header: Tracking Number & Type Pill */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold font-mono text-slate-900">
                  {application.trackingNumber}
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-cyan-50 text-cyan-700 border border-cyan-300 shadow-2xs">
                  {application.licenseTypeBadge || 'NEW LICENSE'}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {application.appliedAt}
              </span>
            </div>

            {/* Applicant Details */}
            <div className="mt-3.5 space-y-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Applicant Details:
                </span>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{application.applicantType || 'Local'}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold">{application.applicantName}</span>
                </div>
              </div>

              {/* Address Details */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Address Details:
                </span>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>
                    {application.city || 'Addis Ababa/አዲስ አበባ'}{' '}
                    {application.subCity || 'Addis Ketema/አዲስ ከተማ'}{' '}
                    {application.woreda || 'Woreda 3/ወረዳ 3'}
                  </span>
                </div>
              </div>

              {/* Educational Details */}
              {application.educationalDetails && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Educational Details:
                  </span>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <School className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>
                        {application.educationalDetails.university}
                        {application.educationalDetails.universityAm
                          ? `/${application.educationalDetails.universityAm}`
                          : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-slate-800 pl-6">
                      <span>
                        {application.educationalDetails.profession}
                        {application.educationalDetails.professionAm
                          ? `/${application.educationalDetails.professionAm}`
                          : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 pl-6 text-[11px]">
                      <span>
                        {application.educationalDetails.qualificationDegree}
                        {application.educationalDetails.qualificationDegreeAm
                          ? `/${application.educationalDetails.qualificationDegreeAm}`
                          : ''}
                      </span>
                      <span>•</span>
                      <span>
                        {application.educationalDetails.fieldOfStudy}
                        {application.educationalDetails.fieldOfStudyAm
                          ? `/${application.educationalDetails.fieldOfStudyAm}`
                          : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono pl-6">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Graduation: {application.educationalDetails.graduationDate}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Undersupervision Status */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Undersupervision Status:
                </span>
                <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                  {application.underSupervisionStatus || 'Expected to attend undersupervision for0'}
                </div>
              </div>

              {/* Other details */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Other details:
                </span>
                <div className="space-y-1">
                  {(application.otherDetails || ['Not Completed the license sharing exam']).map(
                    (detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Current Task Detail (Exact screenshot 2 layout) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Current Task Detail</h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Active Task
              </span>
            </div>

            {/* Field rows matching screenshot 2 format */}
            <div className="mt-3.5 space-y-2.5 text-xs">
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 flex items-start gap-2">
                <FileText className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium">Name : </span>
                  <span className="font-bold text-slate-900">{application.currentTask.name}</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 flex items-start gap-2">
                <InfoCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium">Description : </span>
                  <span className="font-semibold text-slate-800">
                    {application.currentTask.description}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 flex items-start gap-2">
                <UserCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium">Handler Type : </span>
                  <span className="font-semibold text-slate-800">
                    {application.currentTask.handlerType}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 flex items-start gap-2">
                <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium">Estimated time : </span>
                  <span className="font-semibold text-slate-800">
                    {application.currentTask.estimatedTime}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 flex items-start gap-2">
                <Certificate className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium">Type : </span>
                  <span className="font-semibold text-slate-800">
                    {application.currentTask.type}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 flex items-start gap-2">
                <Calendar className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium">Picked at : </span>
                  <span className="font-mono font-medium text-slate-800">
                    {application.currentTask.pickedAt}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-100 flex items-start gap-2">
                <Users className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium">Handler user : </span>
                  <span className="font-bold text-slate-900">
                    {application.currentTask.handlerUser}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* View More Button (Matches Screenshot 2) */}
          <div className="pt-3 border-t border-slate-100 mt-3 flex justify-end">
            <button
              onClick={() => setHandlerModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#29b6f6] hover:bg-[#0288d1] text-white text-xs font-bold rounded-lg shadow-xs transition-all active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View More</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Files Table ONLY (Strictly matches Screenshot 2 - NO inspection checklist for HP) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header Tab */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2 font-bold text-xs text-sky-700">
            <FileText className="w-4 h-4" />
            <span>Files ({filesList.length})</span>
          </div>
          <span className="text-xs text-slate-500 font-semibold px-2.5 py-1 bg-white rounded-md border border-slate-200 shadow-2xs">
            {filesList.length} Uploaded Documents
          </span>
        </div>

        {/* Files Table (Matches Screenshot 2 exactly) */}
        <div className="p-4 sm:p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Document Name</th>
                  <th className="py-3 px-4">Is Common File</th>
                  <th className="py-3 px-4">Is Optional</th>
                  <th className="py-3 px-4 text-right">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filesList.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    {/* Document Name */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>{doc.documentName}</span>
                    </td>

                    {/* Is Common File */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {doc.isCommonFile ? 'Yes' : 'No'}
                    </td>

                    {/* Is Optional */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {doc.isOptional ? 'Yes' : 'No'}
                    </td>

                    {/* Files Action (Version: 1 [👁 View]) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-500">
                          Version: {doc.version}
                        </span>
                        <button
                          onClick={() => handleViewDoc(doc)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#29b6f6] hover:bg-[#0288d1] text-white font-bold text-xs rounded-lg shadow-2xs transition-all active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5 text-white" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Modals */}
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

      <DocumentPreviewModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        document={previewDoc}
        applicantName={application.applicantName}
        trackingNumber={application.trackingNumber}
      />
    </div>
  );
};
