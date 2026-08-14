import React, { useState } from 'react';
import {
  IconFileText as FileText,
  IconLayoutDashboard as LayoutDashboard,
  IconCheckbox as CheckSquare,
  IconEye as Eye,
  IconAward as Award,
  IconThumbUp as ThumbsUp,
  IconBuildingCommunity as Building2,
  IconAlertTriangle as AlertTriangle,
  IconFileCheck as FileCheck,
  IconScale as Scale,
  IconUsers as Users,
  IconUserCheck as UserCheck,
  IconBriefcase as Briefcase,
  IconFileSpreadsheet as FileSpreadsheet,
  IconChevronDown as ChevronDown,
  IconChevronRight as ChevronRight,
  IconShieldExclamation as ShieldAlert,
} from '@tabler/icons-react';

interface SidebarProps {
  sidebarOpen: boolean;
  activeItem: string;
  setActiveItem: (item: string) => void;
  onCloseMobile?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasChildren?: boolean;
  children?: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  activeItem,
  setActiveItem,
  onCloseMobile,
}) => {
  const handleItemClick = (itemLabel: string) => {
    setActiveItem(itemLabel);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    Tasks: false,
    Surveillance: false,
    'Organization Digitization': false,
    'User Management': false,
  });

  const toggleAccordion = (label: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="w-5 h-5" />,
      hasChildren: true,
      children: ['My Tasks', 'Assigned Tasks', 'Completed Tasks'],
    },
    {
      id: 'surveillance',
      label: 'Surveillance',
      icon: <Eye className="w-5 h-5" />,
      hasChildren: true,
      children: ['Market Inspections', 'Facility Audits', 'Alerts'],
    },
    {
      id: 'licenses',
      label: 'Licenses',
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: <ThumbsUp className="w-5 h-5" />,
    },
    {
      id: 'digitization',
      label: 'Organization Digitization',
      icon: <Building2 className="w-5 h-5" />,
      hasChildren: true,
      children: ['Health Facilities', 'FHR Institutions', 'Migration Logs'],
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'error_correction',
      label: 'Error Correction Requests',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
      id: 'experience_letters',
      label: 'Experience Letter Requests',
      icon: <FileCheck className="w-5 h-5" />,
    },
    {
      id: 'medico_legal',
      label: 'Medico Legal Tasks',
      icon: <Scale className="w-5 h-5" />,
    },
    {
      id: 'user_management',
      label: 'User Management',
      icon: <Users className="w-5 h-5" />,
      hasChildren: true,
      children: ['Users', 'Roles & Permissions', 'Access Logs'],
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: <UserCheck className="w-5 h-5" />,
    },
    {
      id: 'services',
      label: 'Services',
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      id: 'forms',
      label: 'Forms',
      icon: <FileSpreadsheet className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`fixed top-0 left-0 bottom-0 w-[250px] bg-white border-r border-slate-200 z-40 transition-transform duration-200 ease-in-out flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Header Logo matching AAFDA branding from screenshot */}
      <div className="h-[90px] border-b border-slate-100 flex items-center justify-center px-4 py-2 bg-white">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-14 h-12 relative flex items-center justify-center mb-1">
            {/* Custom SVG logo matching AAFDA oval crescent logo */}
            <svg viewBox="0 0 100 80" className="w-full h-full">
              <ellipse cx="50" cy="40" rx="45" ry="32" fill="#e0f2fe" stroke="#0288d1" strokeWidth="2.5" />
              <path
                d="M 20 40 Q 50 10 80 40 Q 50 70 20 40 Z"
                fill="none"
                stroke="#0288d1"
                strokeWidth="3"
              />
              <path
                d="M 25 45 C 40 25, 60 25, 75 45 C 60 55, 40 55, 25 45 Z"
                fill="#29b6f6"
              />
              <text x="50" y="44" textAnchor="middle" fill="#0369a1" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                AAFDA
              </text>
            </svg>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Addis Ababa Regulatory
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 custom-scrollbar">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeItem === item.label;
            const isOpen = openAccordions[item.label] || false;

            return (
              <div key={item.id} className="w-full">
                {item.hasChildren ? (
                  <div>
                    <button
                      onClick={() => toggleAccordion(item.label)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-lg transition-all ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-white' : 'text-slate-500'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <span className={isActive ? 'text-white' : 'text-slate-400'}>
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                    </button>

                    {isOpen && item.children && (
                      <div className="ml-8 mt-1 space-y-1 border-l-2 border-slate-200 pl-2 py-1">
                        {item.children.map((subItem) => (
                          <button
                            key={subItem}
                            onClick={() => handleItemClick(subItem)}
                            className="w-full text-left px-3 py-1.5 text-[11px] text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-md transition-colors"
                          >
                            {subItem}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleItemClick(item.label)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#29b6f6] text-white shadow-xs rounded-r-xl rounded-l-md font-semibold'
                        : 'text-slate-700 hover:bg-slate-100 rounded-lg'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer System Info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70 text-[11px] text-slate-500 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-cyan-600 shrink-0" />
        <div className="truncate">
          <p className="font-semibold text-slate-700">License Portal v2.4</p>
          <p className="text-[10px] text-slate-400">AAFDA Government System</p>
        </div>
      </div>
    </aside>
  );
};
