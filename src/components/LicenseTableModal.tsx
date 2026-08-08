import React, { useState } from 'react';
import { FilterState, LicenseRecord } from '../types';
import { getFilteredLicenseRecords } from '../utils/filterEngine';
import {
  Search,
  Eye,
  X,
  Shield,
  Printer,
} from 'lucide-react';

interface LicenseTableModalProps {
  licenses?: LicenseRecord[];
  filters?: FilterState;
  onSelectLicense?: (record: LicenseRecord) => void;
}

export const LicenseTableModal: React.FC<LicenseTableModalProps> = ({
  licenses,
  filters,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<LicenseRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // If filters prop is provided, get dynamically filtered records; otherwise fallback to licenses prop
  const baseRecords = filters ? getFilteredLicenseRecords(filters) : licenses || [];

  const filtered = baseRecords.filter((record) => {
    const matchesSearch =
      !searchTerm.trim() ||
      record.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Review':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Submitted':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 mb-8">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Recent License Applications & Registrations
          </h2>
          <p className="text-xs text-slate-500">
            Real-time query register across Health Professionals, Facilities, and FHR Institutions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="In Review">In Review</option>
            <option value="Submitted">Submitted</option>
          </select>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search record..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <th className="p-3 font-semibold">License Registration #</th>
              <th className="p-3 font-semibold">Applicant Name / Entity</th>
              <th className="p-3 font-semibold">Customer Type</th>
              <th className="p-3 font-semibold">Service Type</th>
              <th className="p-3 font-semibold">Branch</th>
              <th className="p-3 font-semibold">Issue Date</th>
              <th className="p-3 font-semibold text-center">Status</th>
              <th className="p-3 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-bold text-sky-700 font-mono">
                  {record.licenseNumber}
                </td>
                <td className="p-3 font-bold text-slate-800">{record.applicantName}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      record.customerType === 'HP'
                        ? 'bg-sky-100 text-sky-800'
                        : record.customerType === 'HF'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {record.customerType}
                  </span>
                </td>
                <td className="p-3 text-slate-700 font-medium">{record.serviceType}</td>
                <td className="p-3 text-slate-600">{record.branch}</td>
                <td className="p-3 text-slate-500 font-mono">{record.issueDate}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="p-1.5 text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors border border-cyan-200"
                    title="View Full License Certificate Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal / Drawer */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold">
                  Official License Certificate Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-cyan-600">
                    Registration Number
                  </p>
                  <p className="text-sm font-mono font-bold text-cyan-900">
                    {selectedRecord.licenseNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                    selectedRecord.status
                  )}`}
                >
                  {selectedRecord.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Applicant / Entity
                  </p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedRecord.applicantName}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Customer Type
                  </p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedRecord.customerType === 'HP'
                      ? 'Health Professional (HP)'
                      : selectedRecord.customerType === 'HF'
                      ? 'Health Facility (HF)'
                      : 'Food & Health Related (FHR)'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Service Requested
                  </p>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {selectedRecord.serviceType}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Assigned Branch / Woreda
                  </p>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {selectedRecord.branch} ({selectedRecord.woreda})
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Effective Issue Date
                  </p>
                  <p className="font-mono text-slate-800 mt-0.5 font-semibold">
                    {selectedRecord.issueDate}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Expiration Date
                  </p>
                  <p className="font-mono text-slate-800 mt-0.5 font-semibold">
                    {selectedRecord.expiryDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Verified by AAFDA Digital Portal
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Printing Official License Certificate...')}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
