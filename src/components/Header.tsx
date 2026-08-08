import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  Globe,
  Menu,
  Shield,
  User,
  LogOut,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  activeRoleLabel: string;
}

export const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  sidebarOpen,
  activeRoleLabel,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[250px] h-[64px] bg-white border-b border-slate-200 z-30 px-4 md:px-6 flex items-center justify-between shadow-xs transition-all duration-200">
      {/* Left side: Toggle button & Dashboard Title */}
      <div className="flex items-center gap-3">
        <button
          id="toggle-sidebar-btn"
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 id="header-page-title" className="text-xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Shield className="w-3 h-3 text-cyan-600" />
            {activeRoleLabel}
          </span>
        </div>
      </div>

      {/* Right side: Notifications, Language, User profile */}
      <div className="flex items-center gap-3">
        {/* Quick Help Link from Screenshot */}
        <a
          href="#reports"
          className="hidden lg:flex items-center gap-1 text-sm text-cyan-600 font-medium hover:text-cyan-700 transition-colors mr-2"
        >
          <span>See All Reports</span>
          <ChevronDown className="w-4 h-4 -rotate-90" />
        </a>

        {/* Notification Bell */}
        <button
          id="notifications-btn"
          className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-sky-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            id="language-selector-btn"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200 transition-colors"
          >
            <Globe className="w-4 h-4 text-cyan-600" />
            <span>{currentLang}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-sm">
              <button
                onClick={() => {
                  setCurrentLang('English');
                  setLangDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
              >
                <span>🇬🇧 English</span>
              </button>
              <button
                onClick={() => {
                  setCurrentLang('Amharic');
                  setLangDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-serif"
              >
                <span>🇪🇹 አማርኛ</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile matching Screenshot */}
        <div className="relative pl-2 border-l border-slate-200">
          <button
            id="user-profile-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-base shadow-xs ring-2 ring-cyan-100">
              ?
            </div>
            <div className="hidden md:block text-xs leading-tight">
              <div className="font-bold text-slate-800">Muluhabt Amsalu</div>
              <div className="text-slate-500 text-[11px]">betmul@gmail.com</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 md:hidden">
                <p className="font-semibold text-slate-800 text-sm">Muluhabt Amsalu</p>
                <p className="text-xs text-slate-500">betmul@gmail.com</p>
              </div>

              <a
                href="#profile"
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </a>
              <a
                href="#settings"
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Account Settings</span>
              </a>
              <a
                href="#help"
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Help & Documentation</span>
              </a>

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
