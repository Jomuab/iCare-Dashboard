import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, Lock, Eye, AlertCircle, RefreshCw } from 'lucide-react';

interface RoleAccessBannerProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  roleDescription: string;
}

export const RoleAccessBanner: React.FC<RoleAccessBannerProps> = ({
  currentRole,
  onRoleChange,
  roleDescription,
}) => {
  const roles: { value: UserRole; label: string; badge: string }[] = [
    {
      value: 'DIRECTORATE',
      label: 'Directorate User (HQ)',
      badge: 'Full Access (HP, HF, FHR, All Branches)',
    },
    {
      value: 'BRANCH_MANAGER_BOLE',
      label: 'Branch Manager (Bole)',
      badge: 'Bole Data | HF & FHR Tabs Only',
    },
    {
      value: 'FHR_TEAM_LEAD_BOLE',
      label: 'FHR Team Lead (Bole)',
      badge: 'FHR Dashboard ONLY | Bole Branch',
    },
    {
      value: 'HF_TEAM_LEAD_KIRKOS',
      label: 'Health Facility Team Lead (Kirkos)',
      badge: 'HF Dashboard ONLY | Kirkos Branch',
    },
    {
      value: 'INSPECTOR',
      label: 'Inspector (Assigned Scope)',
      badge: 'Assigned Customer Type & Branch',
    },
    {
      value: 'ALL_BRANCH_ROLE',
      label: 'All-Branch / All-Role',
      badge: 'Unrestricted View Across All Centers',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white rounded-xl p-4 shadow-md border border-slate-700/80 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Active Role Title & Description */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Access Control Simulator
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Role-Based Permission active
              </span>
            </div>
            <p className="text-sm font-medium text-slate-200 mt-0.5">
              {roleDescription}
            </p>
          </div>
        </div>

        {/* Role Selector Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="role-simulator-select" className="text-xs text-slate-300 font-medium whitespace-nowrap flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Switch Test Persona:</span>
          </label>

          <select
            id="role-simulator-select"
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-600 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 cursor-pointer hover:bg-slate-700 transition-colors"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
