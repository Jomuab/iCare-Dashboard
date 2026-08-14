import React from 'react';
import { InspectionTeamMember, CurrentTaskDetail } from '../../types';
import {
  IconX as X,
  IconUsers as Users,
  IconUser as User,
  IconPhone as Phone,
  IconMail as Mail,
  IconShieldCheck as ShieldCheck,
  IconClock as Clock,
  IconCalendar as Calendar,
  IconMapPin as MapPin,
} from '@tabler/icons-react';

interface InspectionTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: InspectionTeamMember[];
  inspectionName: string;
}

export const InspectionTeamModal: React.FC<InspectionTeamModalProps> = ({
  isOpen,
  onClose,
  team,
  inspectionName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500 text-white shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Inspection Team</h3>
              <p className="text-[11px] text-slate-500">{inspectionName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="p-3.5 border border-slate-200 rounded-xl bg-white flex items-center justify-between gap-3 hover:border-sky-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm shadow-inner">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                  <p className="text-[11px] text-sky-600 font-medium">{member.role}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {member.email}
                    </span>
                    {member.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {member.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                Assigned
              </span>
            </div>
          ))}
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

interface HandlerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: CurrentTaskDetail;
}

export const HandlerDetailsModal: React.FC<HandlerDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500 text-white shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Task Handler Information</h3>
              <p className="text-[11px] text-slate-500">{task.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3.5">
          <div className="flex items-center gap-3 p-3 bg-sky-50/60 border border-sky-100 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shadow-xs">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{task.handlerUser}</h4>
              <p className="text-xs text-sky-700 font-semibold">{task.handlerType}</p>
              <p className="text-[11px] text-slate-500">{task.handlerEmail || 'inspector2.aafda@gov.et'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Inspection Stage</span>
              <span className="font-bold text-slate-800">{task.inspectionStage}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Estimated Time</span>
              <span className="font-bold text-slate-800">{task.estimatedTime}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg col-span-2">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Picked At</span>
              <span className="font-bold text-slate-800">{task.pickedAt}</span>
            </div>
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
