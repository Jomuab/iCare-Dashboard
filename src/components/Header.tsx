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
  X,
  Check,
  UserCheck,
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
  const [mobileProfileDrawerOpen, setMobileProfileDrawerOpen] = useState(false);

  // Language options: English, Amharic (AM), Afaan Oromoo (OR)
  const languages = [
    { code: 'ENG', label: 'English', abbrv: 'Eng', flag: '🇬🇧' },
    { code: 'AM', label: 'አማርኛ', abbrv: 'AM', flag: '🇪🇹' },
    { code: 'OR', label: 'Afaan Oromoo', abbrv: 'OR', flag: '🇪🇹' },
  ];

  const [langIndex, setLangIndex] = useState(0);
  const currentLang = languages[langIndex];

  // Directly cycle to next language on mobile
  const handleMobileLangToggle = () => {
    setLangIndex((prev) => (prev + 1) % languages.length);
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[250px] h-[64px] bg-white border-b border-slate-200 z-30 px-3 md:px-6 flex items-center justify-between shadow-xs transition-all duration-200">
      {/* Left side: Toggle button & Dashboard Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          id="toggle-sidebar-btn"
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 id="header-page-title" className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Shield className="w-3 h-3 text-cyan-600" />
            {activeRoleLabel}
          </span>
        </div>
      </div>

      {/* Right side: Notifications, Language, User profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Help Link */}
        <a
          href="#reports"
          className="hidden lg:flex items-center gap-1 text-sm text-cyan-600 font-medium hover:text-cyan-700 transition-colors mr-1"
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

        {/* ================================================= */}
        {/* LANGUAGE SWITCHER: MOBILE vs DESKTOP              */}
        {/* ================================================= */}

        {/* MOBILE LANGUAGE SWITCHER: Instant cycle next language (Flag + Abbrv AM/OR/Eng) */}
        <button
          onClick={handleMobileLangToggle}
          className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all active:scale-95"
          title="Tap to switch language (English / Amharic / Afaan Oromoo)"
        >
          <span className="text-sm">{currentLang.flag}</span>
          <span className="font-extrabold text-cyan-700">{currentLang.abbrv}</span>
        </button>

        {/* DESKTOP LANGUAGE SWITCHER: Dropdown selection */}
        <div className="relative hidden md:block">
          <button
            id="language-selector-btn"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200 transition-colors"
          >
            <Globe className="w-4 h-4 text-cyan-600" />
            <span>{currentLang.flag} {currentLang.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-sm">
              {languages.map((lang, idx) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLangIndex(idx);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between ${
                    langIndex === idx ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">({lang.abbrv})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* USER PROFILE: MOBILE DRAWER vs DESKTOP DROPDOWN   */}
        {/* ================================================= */}

        {/* MOBILE USER PROFILE BUTTON (Triggers Slide-over Drawer) */}
        <button
          onClick={() => setMobileProfileDrawerOpen(true)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-cyan-600 text-white font-bold text-sm shadow-xs ring-2 ring-cyan-100 active:scale-95 transition-transform"
          title="Open Profile Menu"
        >
          <User className="w-5 h-5 text-white" />
        </button>

        {/* DESKTOP USER PROFILE BUTTON & DROPDOWN */}
        <div className="relative hidden md:block pl-2 border-l border-slate-200">
          <button
            id="user-profile-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-base shadow-xs ring-2 ring-cyan-100">
              <User className="w-5 h-5" />
            </div>
            <div className="text-xs leading-tight">
              <div className="font-bold text-slate-800">Muluhabt Amsalu</div>
              <div className="text-slate-500 text-[11px]">betmul@gmail.com</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50">
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

      {/* ================================================= */}
      {/* MOBILE PROFILE DRAWER                             */}
      {/* ================================================= */}
      {mobileProfileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileProfileDrawerOpen(false)}
          />

          {/* Drawer Slide Panel */}
          <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-cyan-950 text-white flex items-center justify-between border-b border-cyan-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center font-extrabold text-sm shadow-inner">
                  AA
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">User Profile</h3>
                  <p className="text-[10px] text-cyan-200">AAFDA Management Console</p>
                </div>
              </div>

              <button
                onClick={() => setMobileProfileDrawerOpen(false)}
                className="p-1.5 text-cyan-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info Card */}
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xl shadow-md ring-2 ring-cyan-200">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-900 text-sm truncate">
                    Muluhabt Amsalu
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    betmul@gmail.com
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 text-[10px] font-bold border border-cyan-200">
                      {activeRoleLabel}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                      <UserCheck className="w-3 h-3" /> Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Quick Switcher in Mobile Drawer */}
            <div className="px-4 py-3 bg-cyan-50/50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-600" /> Language:
              </span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
                {languages.map((lang, idx) => (
                  <button
                    key={lang.code}
                    onClick={() => setLangIndex(idx)}
                    className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                      langIndex === idx
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lang.flag} {lang.abbrv}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Options */}
            <div className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 mb-2">
                Account Management
              </p>

              <a
                href="#profile"
                onClick={() => setMobileProfileDrawerOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                    <User className="w-4 h-4" />
                  </div>
                  <span>My Profile Details</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
              </a>

              <a
                href="#settings"
                onClick={() => setMobileProfileDrawerOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span>Account Settings</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
              </a>

              <a
                href="#help"
                onClick={() => setMobileProfileDrawerOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span>Help & Documentation</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
              </a>
            </div>

            {/* Drawer Footer / Sign Out */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setMobileProfileDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs border border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

