import React, { useState } from 'react';
import {
  IconX as X,
  IconClock as Clock,
  IconCheck as Check,
  IconUser as User,
  IconFileText as FileText,
  IconMapPin as MapPin,
  IconMaximize as Maximize,
} from '@tabler/icons-react';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingNumber: string;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  onClose,
  trackingNumber,
}) => {
  if (!isOpen) return null;

  const auditEvents = [
    {
      id: '1',
      title: 'Premises Inspection Submitted',
      description: 'Checklist scored 0.0/0.0 with 45 verified items across 10 service groups.',
      actor: 'Facility Inspector Two',
      timestamp: 'Aug 13, 2026 15:20:00',
      badge: 'Audit Completed',
      color: 'bg-emerald-500',
    },
    {
      id: '2',
      title: 'Field Inspection Task Picked',
      description: 'Task assigned to Facility Inspector Two for onsite verification.',
      actor: 'System Auto-Assigner',
      timestamp: 'Thu Aug 13, 2026 14:53:49',
      badge: 'Assigned',
      color: 'bg-sky-500',
    },
    {
      id: '3',
      title: 'Fee Payment Verified',
      description: 'Government licensing fee payment verified via CBE Birr clearance.',
      actor: 'Finance Officer (Addis Ketema)',
      timestamp: 'Aug 13, 2026 14:48:10',
      badge: 'Paid',
      color: 'bg-indigo-500',
    },
    {
      id: '4',
      title: 'Application Submitted Online',
      description: 'Online application submitted with 25 selected clinical services.',
      actor: 'Applicant (aksdn)',
      timestamp: 'Aug 13, 2026 14:46:00',
      badge: 'Submitted',
      color: 'bg-slate-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500 text-white shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Application Audit Log</h3>
              <p className="text-[11px] text-slate-500">Tracking: {trackingNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {auditEvents.map((evt) => (
              <div key={evt.id} className="relative">
                <div
                  className={`absolute -left-6 top-1 w-3 h-3 rounded-full ${evt.color} ring-4 ring-white`}
                />
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{evt.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                      {evt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{evt.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-200/60">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <User className="w-3 h-3" /> {evt.actor}
                    </span>
                    <span>{evt.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface FullMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lat: number | string;
  lng: number | string;
  subCity: string;
}

export const FullMapModal: React.FC<FullMapModalProps> = ({
  isOpen,
  onClose,
  title,
  lat,
  lng,
  subCity,
}) => {
  const [mapType, setMapType] = useState<'Map' | 'Satellite'>('Map');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500 text-white shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title} — Facility Location</h3>
              <p className="text-[11px] text-slate-500">
                {subCity} • Coordinates: {lat} / {lng}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Display */}
        <div className="relative h-[480px] bg-slate-100 overflow-hidden">
          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-20 flex bg-white rounded-md shadow-md border border-slate-200 overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setMapType('Map')}
              className={`px-3 py-1.5 ${mapType === 'Map' ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              Map
            </button>
            <button
              onClick={() => setMapType('Satellite')}
              className={`px-3 py-1.5 ${mapType === 'Satellite' ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              Satellite
            </button>
          </div>

          {/* SVG Vector Map of Addis Ababa Street Network */}
          <div className="w-full h-full relative flex items-center justify-center bg-[#e5e3df]">
            <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
              {/* Background Roads and Land Grids */}
              <rect width="1000" height="600" fill={mapType === 'Map' ? '#f2efe9' : '#1e293b'} />

              {/* Major Arteries / Ring Road */}
              <path
                d="M 50 150 Q 300 80 500 200 T 950 250"
                stroke={mapType === 'Map' ? '#ffd166' : '#475569'}
                strokeWidth="14"
                fill="none"
              />
              <path
                d="M 200 50 Q 400 300 600 550"
                stroke={mapType === 'Map' ? '#ff9f1c' : '#334155'}
                strokeWidth="12"
                fill="none"
              />
              <path
                d="M 100 450 Q 500 400 900 420"
                stroke={mapType === 'Map' ? '#ffffff' : '#64748b'}
                strokeWidth="10"
                fill="none"
              />

              {/* City Grid Roads */}
              <line x1="150" y1="50" x2="850" y2="550" stroke={mapType === 'Map' ? '#ffffff' : '#475569'} strokeWidth="6" />
              <line x1="850" y1="50" x2="150" y2="550" stroke={mapType === 'Map' ? '#ffffff' : '#475569'} strokeWidth="6" />
              <circle cx="500" cy="300" r="180" stroke={mapType === 'Map' ? '#e2e8f0' : '#334155'} strokeWidth="4" fill="none" />

              {/* Green areas */}
              <path
                d="M 650 100 Q 800 50 900 150 T 750 300 Z"
                fill={mapType === 'Map' ? '#c8e6c9' : '#14532d'}
                opacity="0.8"
              />

              {/* Landmarks */}
              <text x="350" y="150" fill={mapType === 'Map' ? '#475569' : '#94a3b8'} fontSize="14" fontWeight="bold">
                St. Paul's Hospital
              </text>
              <text x="520" y="220" fill={mapType === 'Map' ? '#475569' : '#94a3b8'} fontSize="14" fontWeight="bold">
                National Museum
              </text>
              <text x="560" y="320" fill={mapType === 'Map' ? '#0284c7' : '#38bdf8'} fontSize="18" fontWeight="bold">
                Addis Ababa
              </text>
              <text x="320" y="300" fill={mapType === 'Map' ? '#64748b' : '#94a3b8'} fontSize="13" fontWeight="bold">
                ABA KORA
              </text>
            </svg>

            {/* Pin Marker */}
            <div className="absolute top-[48%] left-[42%] -translate-x-1/2 -translate-y-full flex flex-col items-center">
              <div className="bg-red-600 text-white p-2 rounded-full shadow-xl ring-4 ring-white animate-bounce">
                <MapPin className="w-6 h-6 fill-white text-red-600" />
              </div>
              <div className="mt-1 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap">
                {title} (NEW FACILITY LICENSE)
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-lg shadow-lg border border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-700">
              <span className="font-bold">GPS Coordinates:</span> {lat}, {lng}
            </div>
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-sky-600 hover:text-sky-800"
            >
              Open in Google Maps ↗
            </a>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
