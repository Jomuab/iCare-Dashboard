import React, { useState } from 'react';
import { ApplicationDocumentFile } from '../../types';
import {
  IconX as X,
  IconDownload as Download,
  IconPrinter as Printer,
  IconZoomIn as ZoomIn,
  IconZoomOut as ZoomOut,
  IconRotateClockwise as RotateCw,
  IconCheck as Check,
  IconFileText as FileText,
  IconShieldCheck as ShieldCheck,
  IconClock as Clock,
  IconExternalLink as ExternalLink,
  IconEye as Eye,
} from '@tabler/icons-react';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ApplicationDocumentFile | null;
  applicantName?: string;
  trackingNumber?: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document,
  applicantName = 'Getu Demis',
  trackingNumber = '260522-10354',
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !document) return null;

  const handleDownload = () => {
    // Simulated download notification
    const link = window.document.createElement('a');
    link.href = document.previewUrl || '#';
    link.download = `${document.documentName.replace(/\s+/g, '_')}_v${document.version}.pdf`;
    window.document.body.appendChild(link);
    // In demo environment, acknowledge download action
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 z-10 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {document.documentName}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  Version: {document.version}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Applicant: <span className="font-semibold text-slate-700">{applicantName}</span> • Tracking: <span className="font-mono font-semibold text-sky-700">{trackingNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 25))}
                className="p-1.5 hover:bg-white rounded text-slate-700 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-semibold text-slate-700 min-w-[42px] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(200, z + 25))}
                className="p-1.5 hover:bg-white rounded text-slate-700 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 hover:bg-white rounded text-slate-700 transition-colors ml-0.5"
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Print & Close */}
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Preview Canvas */}
        <div className="flex-1 bg-slate-100/80 p-6 overflow-auto flex items-center justify-center min-h-[380px]">
          <div
            className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-2xl w-full transition-transform duration-150 relative"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Watermark / Official Header */}
            <div className="border-b-2 border-slate-800 pb-4 mb-6 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                  FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  FOOD AND HEALTHCARE REGULATORY AUTHORITY (AAFDA)
                </div>
                <div className="text-xs text-slate-600">
                  Health Professional Registration & Credential Verification Registry
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-sky-600 flex items-center justify-center p-1 bg-sky-50 text-sky-700 font-extrabold text-[10px] text-center shrink-0">
                OFFICIAL SEAL
              </div>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 text-xs text-slate-700">
              <div className="text-center py-2">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  {document.documentName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">DOCUMENT TYPE</span>
                  <span className="font-semibold text-slate-800">{document.fileType}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">FILE SIZE</span>
                  <span className="font-semibold text-slate-800">{document.fileSize}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">UPLOADED AT</span>
                  <span className="font-semibold text-slate-800">{document.uploadedAt}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">COMMON / OPTIONAL</span>
                  <span className="font-semibold text-slate-800">
                    {document.isCommonFile ? 'Common File (Yes)' : 'Specialized File (No)'} • {document.isOptional ? 'Optional' : 'Required'}
                  </span>
                </div>
              </div>

              {/* Sample preview illustration / image */}
              <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                {document.documentName === '3X4 Photo' ? (
                  <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-slate-300 shadow-xs mb-2">
                    <img
                      src={document.previewUrl}
                      alt="3X4 Photo"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div className="font-bold text-slate-900">
                      Digitally Verified by AAFDA Credential Verification Service
                    </div>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Official seal cryptographic signature: <span className="font-mono text-slate-700">SHA256:7f83b1657ff1fc53b92dc18148a1d65d</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Footer validation stamp */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Authenticated & Archived</span>
                </div>
                <div className="font-mono text-[10px]">
                  ID: {document.id} • Ref: {trackingNumber}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Document verified under Ethiopian Health Professional Licensing Directives.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Copy</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
