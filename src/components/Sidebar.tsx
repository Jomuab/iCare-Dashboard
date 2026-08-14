import React, { useState } from 'react';
import {
  IconGauge,
  IconAdjustments,
  IconFocus2,
  IconIdBadge2,
  IconHeadset,
  IconServer2,
  IconApps,
  IconRotateDot,
  IconFileCertificate,
  IconGavel,
  IconUserCog,
  IconUsers,
  IconSettings,
  IconForms,
  IconFilePencil,
  IconFileSearch,
  IconCpu,
  IconGitFork,
  IconCash,
  IconMessageReport,
  IconMessageExclamation,
  IconMessageQuestion,
  IconMessage,
  IconUserShield,
  IconLetterA,
  IconChevronDown,
  IconChevronRight,
  IconUser,
  IconBuildingHospital,
  IconBuildingSkyscraper,
  IconChefHat,
  IconBuildingStore,
  IconCamera,
  IconKey,
  IconTarget,
  IconActivity,
  IconBriefcase,
  IconFileDescription,
  IconUpload,
  IconGridDots,
  IconMoneybag,
  IconAdjustmentsHorizontal,
  IconTool,
  IconListSearch,
  IconClock,
  IconCalendar,
  IconShieldCheck,
} from '@tabler/icons-react';

interface SidebarProps {
  sidebarOpen: boolean;
  activeItem: string;
  setActiveItem: (item: string) => void;
  onCloseMobile?: () => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: SubMenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasChildren?: boolean;
  children?: SubMenuItem[];
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
    'Task Performance': false,
    'Letters/Requests': false,
    Settings: false,
  });

  const [openNestedAccordions, setOpenNestedAccordions] = useState<Record<string, boolean>>({
    'Application Schedule': false,
  });

  const toggleAccordion = (label: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const toggleNestedAccordion = (label: string) => {
    setOpenNestedAccordions((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <IconGauge className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <IconAdjustments className="w-[18px] h-[18px]" stroke={1.75} />,
      hasChildren: true,
      children: [
        {
          id: 'professional-license-tasks',
          label: 'Professional License Tasks',
          icon: <IconUser className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'facility-license-tasks',
          label: 'Facility License Tasks',
          icon: <IconBuildingHospital className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'institution-license-tasks',
          label: 'Institution License Tasks',
          icon: <IconChefHat className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'designation-tasks',
          label: 'Designation Tasks',
          icon: <IconFocus2 className="w-4 h-4" stroke={1.75} />,
        },
      ],
    },
    {
      id: 'surveillance',
      label: 'Surveillance',
      icon: <IconFocus2 className="w-[18px] h-[18px]" stroke={1.75} />,
      hasChildren: true,
      children: [
        {
          id: 'surveillance-tasks',
          label: 'Surveillance Tasks',
          icon: <IconListSearch className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'surveillance-view',
          label: 'Surveillance',
          icon: <IconCamera className="w-4 h-4" stroke={1.75} />,
        },
      ],
    },
    {
      id: 'licenses',
      label: 'Licenses',
      icon: <IconIdBadge2 className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: <IconHeadset className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'digitization',
      label: 'Organization Digitization',
      icon: <IconServer2 className="w-[18px] h-[18px]" stroke={1.75} />,
      hasChildren: true,
      children: [
        {
          id: 'fhr',
          label: 'FHR',
          icon: <IconIdBadge2 className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'facility',
          label: 'Facility',
          icon: <IconIdBadge2 className="w-4 h-4" stroke={1.75} />,
        },
      ],
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: <IconGridDots className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'error_correction',
      label: 'Error Correction Requests',
      icon: <IconRotateDot className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'experience_letters',
      label: 'Experience Letter Requests',
      icon: <IconFileCertificate className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'medico_legal',
      label: 'Medico Legal Tasks',
      icon: <IconGavel className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'user_management',
      label: 'User Management',
      icon: <IconUserCog className="w-[18px] h-[18px]" stroke={1.75} />,
      hasChildren: true,
      children: [
        {
          id: 'users',
          label: 'users',
          icon: <IconUser className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'role',
          label: 'Role',
          icon: <IconUser className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'permission',
          label: 'Permission',
          icon: <IconKey className="w-4 h-4" stroke={1.75} />,
        },
      ],
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: <IconUsers className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'services',
      label: 'Services',
      icon: <IconSettings className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'forms',
      label: 'Forms',
      icon: <IconForms className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'output_templates',
      label: 'Output Templates',
      icon: <IconFilePencil className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'audit_log',
      label: 'Audit Log',
      icon: <IconFileSearch className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'task_performance',
      label: 'Task Performance',
      icon: <IconCpu className="w-[18px] h-[18px]" stroke={1.75} />,
      hasChildren: true,
      children: [
        {
          id: 'kpi',
          label: 'KPI',
          icon: <IconTarget className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'app-perf',
          label: 'Application Performance',
          icon: <IconActivity className="w-4 h-4" stroke={1.75} />,
        },
      ],
    },
    {
      id: 'license_structure',
      label: 'License Structure',
      icon: <IconGitFork className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <IconCash className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'support_letter',
      label: 'Support Letter',
      icon: <IconMessageReport className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: <IconMessageExclamation className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'suggestion',
      label: 'Suggestion',
      icon: <IconMessageQuestion className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'tips',
      label: 'Tips',
      icon: <IconMessage className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'administrative_actions',
      label: 'Administrative Actions',
      icon: <IconUserShield className="w-[18px] h-[18px]" stroke={1.75} />,
    },
    {
      id: 'letters_requests',
      label: 'Letters/Requests',
      icon: <IconLetterA className="w-[18px] h-[18px]" stroke={1.75} />,
      hasChildren: true,
      children: [
        {
          id: 'good-standing',
          label: 'Good Standing',
          icon: <IconIdBadge2 className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'designation',
          label: 'Designation',
          icon: <IconBriefcase className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'experience',
          label: 'Experience',
          icon: <IconIdBadge2 className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'upload-support-letter',
          label: 'Upload Support Letter',
          icon: <IconUpload className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'data-migration',
          label: 'Data Migration',
          icon: <IconGridDots className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'penalty-waiver',
          label: 'Penalty Waiver',
          icon: <IconMoneybag className="w-4 h-4" stroke={1.75} />,
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <IconSettings className="w-[18px] h-[18px]" stroke={1.75} />,
      hasChildren: true,
      children: [
        {
          id: 'configurations',
          label: 'Configurations',
          icon: <IconAdjustmentsHorizontal className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'announcement',
          label: 'Announcement',
          icon: <IconTool className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'checklists',
          label: 'Checklists',
          icon: <IconListSearch className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'tips-suggestions-config',
          label: 'Tips & Suggestions Config',
          icon: <IconTool className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'administrative-actions-config',
          label: 'Administrative Actions Config',
          icon: <IconTool className="w-4 h-4" stroke={1.75} />,
        },
        {
          id: 'application-schedule-parent',
          label: 'Application Schedule',
          icon: <IconClock className="w-4 h-4" stroke={1.75} />,
          children: [
            {
              id: 'application-schedule-sub',
              label: 'Application Schedule',
              icon: <IconClock className="w-3.5 h-3.5" stroke={1.75} />,
            },
            {
              id: 'daily-capacity',
              label: 'Daily Capacity',
              icon: <IconCalendar className="w-3.5 h-3.5" stroke={1.75} />,
            },
          ],
        },
      ],
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
      <div className="h-[90px] border-b border-slate-100 flex items-center justify-center px-4 py-2 bg-white shrink-0">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-12 relative flex items-center justify-center mb-0.5">
            {/* Custom SVG logo matching AAFDA oval crescent logo */}
            <svg viewBox="0 0 100 80" className="w-full h-full">
              <ellipse cx="50" cy="40" rx="44" ry="28" fill="#e0f2fe" stroke="#0288d1" strokeWidth="2.2" />
              <path
                d="M 22 40 Q 50 14 78 40 Q 50 66 22 40 Z"
                fill="none"
                stroke="#0288d1"
                strokeWidth="2.5"
              />
              <path
                d="M 28 44 C 40 28, 60 28, 72 44 C 60 52, 40 52, 28 44 Z"
                fill="#29b6f6"
              />
              <text x="50" y="43" textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
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
      <div className="flex-1 overflow-y-auto py-2 px-2 custom-scrollbar">
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = activeItem === item.label;
            const isOpen = openAccordions[item.label] || false;

            return (
              <div key={item.id} className="w-full">
                {item.hasChildren && item.children ? (
                  <div>
                    <button
                      onClick={() => toggleAccordion(item.label)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-normal rounded-lg transition-all select-none ${
                        isActive
                          ? 'bg-[#29b6f6] text-white font-medium shadow-xs'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={isActive ? 'text-white' : 'text-slate-600 shrink-0'}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className={isActive ? 'text-white' : 'text-slate-400 shrink-0 ml-1'}>
                        {isOpen ? (
                          <IconChevronDown className="w-3.5 h-3.5" stroke={2} />
                        ) : (
                          <IconChevronRight className="w-3.5 h-3.5" stroke={2} />
                        )}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2 py-0.5">
                        {item.children.map((subItem) => {
                          const isSubActive = activeItem === subItem.label;
                          const hasSubChildren = !!(subItem.children && subItem.children.length > 0);
                          const isNestedOpen = openNestedAccordions[subItem.label] || false;

                          if (hasSubChildren) {
                            return (
                              <div key={subItem.id} className="w-full">
                                <button
                                  onClick={() => toggleNestedAccordion(subItem.label)}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11.5px] rounded-md transition-colors select-none ${
                                    isSubActive
                                      ? 'bg-[#29b6f6] text-white font-medium shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className={isSubActive ? 'text-white' : 'text-slate-500 shrink-0'}>
                                      {subItem.icon}
                                    </span>
                                    <span className="truncate">{subItem.label}</span>
                                  </div>
                                  <span className={isSubActive ? 'text-white' : 'text-slate-400 shrink-0 ml-1'}>
                                    {isNestedOpen ? (
                                      <IconChevronDown className="w-3 h-3" stroke={2} />
                                    ) : (
                                      <IconChevronRight className="w-3 h-3" stroke={2} />
                                    )}
                                  </span>
                                </button>

                                {isNestedOpen && subItem.children && (
                                  <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2 py-0.5">
                                    {subItem.children.map((nestedItem) => {
                                      const isNestedActive = activeItem === nestedItem.label;
                                      return (
                                        <button
                                          key={nestedItem.id}
                                          onClick={() => handleItemClick(nestedItem.label)}
                                          className={`w-full flex items-center gap-2 text-left px-2 py-1 text-[11px] rounded-md transition-colors select-none ${
                                            isNestedActive
                                              ? 'bg-[#29b6f6] text-white font-medium shadow-xs'
                                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                          }`}
                                        >
                                          <span className={isNestedActive ? 'text-white' : 'text-slate-500 shrink-0'}>
                                            {nestedItem.icon}
                                          </span>
                                          <span className="truncate">{nestedItem.label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return (
                            <button
                              key={subItem.id}
                              onClick={() => handleItemClick(subItem.label)}
                              className={`w-full flex items-center gap-2 text-left px-2.5 py-1.5 text-[11.5px] rounded-md transition-colors select-none ${
                                isSubActive
                                  ? 'bg-[#29b6f6] text-white font-medium shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                            >
                              <span className={isSubActive ? 'text-white' : 'text-slate-500 shrink-0'}>
                                {subItem.icon}
                              </span>
                              <span className="truncate">{subItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleItemClick(item.label)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-normal transition-all select-none ${
                      isActive
                        ? 'bg-[#29b6f6] text-white shadow-xs rounded-md font-medium'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-600 shrink-0'}>
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
      <div className="p-2.5 border-t border-slate-200 bg-slate-50/70 text-[11px] text-slate-500 flex items-center gap-2 shrink-0">
        <IconShieldCheck className="w-4 h-4 text-sky-600 shrink-0" stroke={1.75} />
        <div className="truncate">
          <p className="font-semibold text-slate-700 text-[11px] leading-tight">AAFDA Regulatory</p>
          <p className="text-[10px] text-slate-400">v2.4 Online Registry</p>
        </div>
      </div>
    </aside>
  );
};

