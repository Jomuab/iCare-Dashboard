import React from 'react';
import {
  ProfessionalLicenseRecord,
  FacilityLicenseRecord,
  FHRLicenseRecord,
} from '../../data/licensesData';
import {
  IconX as X,
  IconPrinter as Printer,
  IconDownload as Download,
  IconShieldCheck as ShieldCheck,
  IconQrcode as Qrcode,
  IconBuildingHospital as Hospital,
  IconUserCheck as UserCheck,
  IconAward as Award,
  IconCheck as Check,
  IconCalendar as Calendar,
  IconMapPin as MapPin,
  IconPhone as Phone,
  IconMail as Mail,
  IconSchool as School,
  IconClock as Clock,
  IconBuildingStore as BuildingStore,
  IconExternalLink as ExternalLink,
  IconBadge as Badge,
} from '@tabler/icons-react';

interface LicenseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ProfessionalLicenseRecord | FacilityLicenseRecord | FHRLicenseRecord | null;
  type: 'Professional' | 'Facility' | 'FHR';
}

export const LicenseDetailModal: React.FC<LicenseDetailModalProps> = ({
  isOpen,
  onClose,
  record,
  type,
}) => {
  if (!isOpen || !record) return null;

  const isProf = type === 'Professional';
  const isFac = type === 'Facility';
  const isFhr = type === 'FHR';

  const profRecord = record as ProfessionalLicenseRecord;
  const facRecord = record as FacilityLicenseRecord;
  const fhrRecord = record as FHRLicenseRecord;

  const getFullName = () => {
    if (isProf) {
      return `${profRecord.firstName} ${profRecord.middleName} ${profRecord.lastName}`;
    }
    if (isFac) {
      return facRecord.facilityName;
    }
    return fhrRecord.establishmentName;
  };

  const getStatusColor = (status: string) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Certificate Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 z-10 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-200 text-sky-600">
              {isProf ? (
                <UserCheck className="w-5 h-5" />
              ) : isFac ? (
                <Hospital className="w-5 h-5" />
              ) : (
                <BuildingStore className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Official License Certificate & Verification Record
                </h3>
                <span
                  className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${getStatusColor(
                    record.status
                  )}`}
                >
                  {record.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                License ID: <span className="font-mono font-bold text-slate-700">{record.licenseNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body / Certificate Layout */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar bg-slate-50/30 flex-1">
          {/* Official Certificate Box */}
          <div className="bg-white border-2 border-sky-600/30 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            {/* Watermark Crest */}
            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
              <ShieldCheck className="w-56 h-56 text-sky-900" />
            </div>

            {/* Certificate Header Banner */}
            <div className="text-center pb-5 border-b border-dashed border-slate-200 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 font-extrabold text-[11px] rounded-full uppercase tracking-wider border border-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                Addis Ababa Food and Drug Authority (AAFDA)
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight pt-1">
                {isProf
                  ? 'HEALTH PROFESSIONAL PRACTICE LICENSE'
                  : isFac
                  ? 'HEALTH FACILITY OPERATIONAL LICENSE'
                  : 'FOOD & HEALTH RELATED ESTABLISHMENT PERMIT'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Federal Democratic Republic of Ethiopia • Addis Ababa City Administration
              </p>
            </div>

            {/* License Reference & QR Code */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Official License Number:
                </span>
                <div className="font-mono text-base font-black text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 inline-block">
                  {record.licenseNumber}
                </div>
                {record.previousLicenseNo && (
                  <div className="text-[11px] text-slate-500">
                    Previous Reference: <span className="font-mono font-semibold">{record.previousLicenseNo}</span>
                  </div>
                )}
              </div>

              {/* QR Verification Placeholder */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-800">
                  <Qrcode className="w-10 h-10" />
                </div>
                <div className="text-[10px] space-y-0.5">
                  <span className="font-extrabold text-slate-800 block">Digital Verification</span>
                  <span className="text-emerald-700 font-bold block">✓ Authenticity Validated</span>
                  <span className="text-slate-400 block font-mono">ID: {record.id}</span>
                </div>
              </div>
            </div>

            {/* Licensee Particulars */}
            <div className="py-4 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {isProf ? 'Licensed Professional Full Name:' : 'Licensed Entity Name:'}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{getFullName()}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                {isProf && (
                  <>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Profession / Title:</span>
                      <span className="text-xs font-bold text-slate-900">{profRecord.profession}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Seniority Prefix:</span>
                      <span className="text-xs font-bold text-sky-700">{profRecord.prefix}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Qualification:</span>
                      <span className="text-xs font-bold text-slate-900">{profRecord.qualification}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Department / Specialty:</span>
                      <span className="text-xs font-bold text-slate-900">{profRecord.department}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Graduation Institution:</span>
                      <span className="text-xs font-bold text-slate-900">{profRecord.university} ({profRecord.graduationYear})</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Workplace Facility:</span>
                      <span className="text-xs font-bold text-slate-900">{profRecord.facilityName}</span>
                    </div>
                  </>
                )}

                {isFac && (
                  <>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Facility Type:</span>
                      <span className="text-xs font-bold text-emerald-800">{facRecord.facilityType}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Ownership Structure:</span>
                      <span className="text-xs font-bold text-slate-900">{facRecord.ownership}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Technical Director / Lead:</span>
                      <span className="text-xs font-bold text-slate-900">{facRecord.technicalManager}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Bed Capacity:</span>
                      <span className="text-xs font-bold text-slate-900">{facRecord.bedCapacity || 'N/A (Outpatient/Retail)'}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Inspection Compliance:</span>
                      <span className="text-xs font-bold text-emerald-700">{facRecord.inspectionScore}% (Audited: {facRecord.lastInspectionDate})</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Physical Location:</span>
                      <span className="text-xs font-bold text-slate-900">{facRecord.subCity}, Woreda {facRecord.woreda}, H#{facRecord.houseNo || '-'}</span>
                    </div>
                  </>
                )}

                {isFhr && (
                  <>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">FHR Category:</span>
                      <span className="text-xs font-bold text-indigo-800">{fhrRecord.category}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Risk Grade:</span>
                      <span className="text-xs font-bold text-slate-900">{fhrRecord.grade}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">HACCP / GMP Status:</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {fhrRecord.haccpCertified ? '✓ Certified & Audited' : 'Standard Sanitary Level'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Sanitary / QC Officer:</span>
                      <span className="text-xs font-bold text-slate-900">{fhrRecord.sanitaryOfficer}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Hygiene Audit Score:</span>
                      <span className="text-xs font-bold text-slate-900">{fhrRecord.hygieneAuditScore}%</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 block">Sub-City & Woreda:</span>
                      <span className="text-xs font-bold text-slate-900">{fhrRecord.subCity}, Woreda {fhrRecord.woreda}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Validity Dates Ribbon */}
            <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Valid Period</span>
                  <span className="text-xs font-bold">
                    Issued: {record.issueDate} • Expires: {record.expiryDate}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                  {record.status === 'Active' ? '✓ In Good Standing' : record.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="text-xs text-slate-500">
            Registered on AAFDA Central Portal Database • Addis Ababa, Ethiopia
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              Close Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
