import React, { useState, useMemo } from 'react';
import { ChecklistServiceGroup, ChecklistItem } from '../../types';
import { CHECKLIST_SERVICE_GROUPS_SAMPLE } from '../../data/applicationData';
import {
  IconX as X,
  IconClipboardCheck as ClipboardCheck,
  IconPlus as Plus,
  IconChevronDown as ChevronDown,
  IconChevronUp as ChevronUp,
  IconInfoCircle as InfoCircle,
  IconCheck as Check,
  IconAlertTriangle as AlertTriangle,
  IconCircleCheck as CircleCheck,
  IconCircleX as CircleX,
  IconMessageDots as MessageDots,
  IconBuilding as Building,
  IconPill as Pill,
  IconStethoscope as Stethoscope,
  IconSearch as Search,
  IconFilter as Filter,
  IconPrinter as Printer,
  IconFileSpreadsheet as FileSpreadsheet,
  IconEdit as Edit3,
  IconSparkles as Sparkles,
  IconShieldCheck as ShieldCheck,
} from '@tabler/icons-react';

interface InspectionResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklistGroups: ChecklistServiceGroup[];
  totalScore?: string;
  compliance?: string;
  itemsChecked?: number;
  totalCategories?: number;
  totalServiceGroups?: number;
  inspectionTitle?: string;
  inspectorName?: string;
}

type FilterStatusType = 'ALL' | 'MET' | 'UNMET' | 'NOT_APPLICABLE';
export type ChecklistCategoryTab = 'PREMISE' | 'PRODUCT' | 'PROFESSIONAL';

export const InspectionResultsModal: React.FC<InspectionResultsModalProps> = ({
  isOpen,
  onClose,
  checklistGroups: initialGroups,
  totalScore: initialTotalScore = '11.0 / 14.0',
  compliance: initialCompliance = '78.5%',
  itemsChecked = 19,
  totalCategories = 3,
  totalServiceGroups = 5,
  inspectionTitle = 'Hospitalier - Updated Pre-License (HF)',
  inspectorName = 'Facility Inspector Two',
}) => {
  // Helper to ensure groups are populated with Premise, Product, and Professional items
  const normalizeGroups = (incomingGroups: ChecklistServiceGroup[]) => {
    if (!incomingGroups || incomingGroups.length === 0) {
      return CHECKLIST_SERVICE_GROUPS_SAMPLE;
    }
    const hasProductOrProf = incomingGroups.some((g) => {
      const cat = (g.category || g.tabCategory || '').toUpperCase();
      return cat.includes('PRODUCT') || cat.includes('PROFESSIONAL');
    });

    if (hasProductOrProf) {
      return incomingGroups;
    }

    // Merge in Product and Professional sample groups if only Premise was provided
    const nonPremiseSamples = CHECKLIST_SERVICE_GROUPS_SAMPLE.filter((g) => {
      const cat = (g.category || g.tabCategory || '').toUpperCase();
      return cat.includes('PRODUCT') || cat.includes('PROFESSIONAL');
    });

    return [...incomingGroups, ...nonPremiseSamples];
  };

  // Local state for interactive evaluator overrides, category tab, and remarks
  const [groups, setGroups] = useState<ChecklistServiceGroup[]>(() => normalizeGroups(initialGroups));
  const [activeCategoryTab, setActiveCategoryTab] = useState<ChecklistCategoryTab>('PREMISE');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    dentistry: true,
    dermatology: true,
    gynecology: true,
    'prod-medicines': true,
    'prod-devices': true,
    'prof-leadership': true,
    'prof-nursing': true,
  });
  const [activeFilter, setActiveFilter] = useState<FilterStatusType>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [isEvaluationMode, setIsEvaluationMode] = useState(false);
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [newRemarkText, setNewRemarkText] = useState('');
  const [savedRemarks, setSavedRemarks] = useState<string[]>([
    'Premises, Product storage, and Professional credentials verified on-site by AAFDA regulatory team.',
    'Deficiencies noted in Radiation protective barriers & Neonatal radiant warmer sensor calibration.',
  ]);

  // Sync initial groups if prop changes
  React.useEffect(() => {
    if (initialGroups && initialGroups.length > 0) {
      setGroups(normalizeGroups(initialGroups));
    }
  }, [initialGroups]);

  // Helper to categorize items and groups accurately
  const getItemCategory = (
    item: ChecklistItem,
    group?: ChecklistServiceGroup
  ): ChecklistCategoryTab => {
    const cat = (
      item.category ||
      group?.category ||
      group?.tabCategory ||
      item.stage ||
      ''
    ).toUpperCase();

    if (
      cat.includes('PRODUCT') ||
      cat.includes('MEDICIN') ||
      cat.includes('DEVICE') ||
      cat.includes('REAGENT') ||
      cat.includes('DRUG') ||
      cat.includes('VACCINE')
    ) {
      return 'PRODUCT';
    }
    if (
      cat.includes('PROFESSIONAL') ||
      cat.includes('STAFF') ||
      cat.includes('NURS') ||
      cat.includes('DOCTOR') ||
      cat.includes('PRACTITIONER') ||
      cat.includes('LEAD') ||
      cat.includes('IPC') ||
      cat.includes('CREDENTIAL')
    ) {
      return 'PROFESSIONAL';
    }
    return 'PREMISE';
  };

  // Helper to determine item compliance status
  const getItemStatus = (
    item: ChecklistItem
  ): 'MET' | 'UNMET' | 'NOT_APPLICABLE' => {
    if (item.status) return item.status;
    if (item.statusType === 'SCORE_1' || item.statusType === 'COMPLIANT') return 'MET';
    if (item.statusType === 'SCORE_0' || item.statusType === 'NON_COMPLIANT') return 'UNMET';
    return 'NOT_APPLICABLE';
  };

  // Compute live aggregated metrics per category tab (Premise, Product, Professional)
  const categoryStats = useMemo(() => {
    const counts: Record<
      ChecklistCategoryTab,
      {
        totalItems: number;
        metCount: number;
        unmetCount: number;
        naCount: number;
        totalScoreObtained: number;
        maxScorablePoints: number;
        compliancePercent: number;
        complianceStr: string;
        isPassing: boolean;
      }
    > = {
      PREMISE: {
        totalItems: 0,
        metCount: 0,
        unmetCount: 0,
        naCount: 0,
        totalScoreObtained: 0,
        maxScorablePoints: 0,
        compliancePercent: 0,
        complianceStr: '0.0%',
        isPassing: false,
      },
      PRODUCT: {
        totalItems: 0,
        metCount: 0,
        unmetCount: 0,
        naCount: 0,
        totalScoreObtained: 0,
        maxScorablePoints: 0,
        compliancePercent: 0,
        complianceStr: '0.0%',
        isPassing: false,
      },
      PROFESSIONAL: {
        totalItems: 0,
        metCount: 0,
        unmetCount: 0,
        naCount: 0,
        totalScoreObtained: 0,
        maxScorablePoints: 0,
        compliancePercent: 0,
        complianceStr: '0.0%',
        isPassing: false,
      },
    };

    groups.forEach((g) => {
      g.items.forEach((item) => {
        const cat = getItemCategory(item, g);
        const target = counts[cat];
        target.totalItems += 1;

        const status = getItemStatus(item);
        if (status === 'MET') {
          target.metCount += 1;
          target.totalScoreObtained += 1;
          target.maxScorablePoints += 1;
        } else if (status === 'UNMET') {
          target.unmetCount += 1;
          target.maxScorablePoints += 1;
        } else {
          target.naCount += 1;
        }
      });
    });

    (['PREMISE', 'PRODUCT', 'PROFESSIONAL'] as const).forEach((cat) => {
      const target = counts[cat];
      const comp =
        target.maxScorablePoints > 0
          ? ((target.totalScoreObtained / target.maxScorablePoints) * 100).toFixed(1)
          : '100.0';
      target.compliancePercent = Number(comp);
      target.complianceStr = `${comp}%`;
      target.isPassing = Number(comp) >= 75;
    });

    return counts;
  }, [groups]);

  // Active Tab specific metrics (Used to dynamically update all items, met, unmet, N/A)
  const activeTabStats = categoryStats[activeCategoryTab];

  if (!isOpen) return null;

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleToggleItemStatus = (
    groupId: string,
    itemId: string,
    newStatus: 'MET' | 'UNMET' | 'NOT_APPLICABLE'
  ) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: g.items.map((it) => {
            if (it.id !== itemId) return it;
            return {
              ...it,
              status: newStatus,
              statusType:
                newStatus === 'MET'
                  ? 'SCORE_1'
                  : newStatus === 'UNMET'
                  ? 'SCORE_0'
                  : 'NOT_APPLICABLE',
              evaluationValue:
                newStatus === 'MET' ? 'MET' : newStatus === 'UNMET' ? 'UNMET' : 'N/A',
              score: newStatus === 'MET' ? 1 : 0,
              maxScore: newStatus === 'NOT_APPLICABLE' ? 0 : 1,
            };
          }),
        };
      })
    );
  };

  const handleAddRemark = () => {
    if (newRemarkText.trim()) {
      setSavedRemarks((prev) => [newRemarkText.trim(), ...prev]);
      setNewRemarkText('');
      setRemarkModalOpen(false);
    }
  };

  // Filter groups and items based on Active Tab (Premise / Product / Professional), Status Filter, and Search
  const filteredGroups = groups
    .map((group) => {
      const matchingItems = group.items.filter((item) => {
        // 1. Filter by Selected Category Tab (Premise, Product, Professional)
        const itemCategory = getItemCategory(item, group);
        if (itemCategory !== activeCategoryTab) {
          return false;
        }

        // 2. Filter by Active Met / Unmet status
        const itemStatus = getItemStatus(item);
        if (activeFilter === 'MET' && itemStatus !== 'MET') return false;
        if (activeFilter === 'UNMET' && itemStatus !== 'UNMET') return false;
        if (activeFilter === 'NOT_APPLICABLE' && itemStatus !== 'NOT_APPLICABLE') return false;

        // 3. Filter by search query
        if (searchFilter.trim()) {
          const query = searchFilter.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(query);
          const matchesDesc = item.description.toLowerCase().includes(query);
          const matchesDeficiency = item.deficiencyReason?.toLowerCase().includes(query);
          const matchesGroup = group.name.toLowerCase().includes(query);
          return matchesTitle || matchesDesc || matchesDeficiency || matchesGroup;
        }

        return true;
      });

      return {
        ...group,
        items: matchingItems,
      };
    })
    .filter((group) => group.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 z-10 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
              <ClipboardCheck className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Inspection Checklist & Compliance Results
                </h2>
                <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Official Record
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation Title: <span className="font-semibold text-slate-700">{inspectionTitle}</span> • Inspector: <span className="font-semibold text-slate-700">{inspectorName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEvaluationMode(!isEvaluationMode)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                isEvaluationMode
                  ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle Auditor Review Mode"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEvaluationMode ? 'Editing Status' : 'Auditor Mode'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Print Checklist"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar bg-slate-50/50 flex-1">
          {/* Card 1: Met vs Unmet Overview Ribbon */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600">
                      COMPLIANCE AUDIT OVERVIEW
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {activeCategoryTab} SECTION
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Evaluation Findings & Verification Status
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Breakdown of standard criteria evaluated as <span className="font-bold text-emerald-700">MET</span>, <span className="font-bold text-rose-700">UNMET</span>, and <span className="font-bold text-slate-600">NOT APPLICABLE</span> for the selected tab.
                  </p>
                </div>
              </div>

              {/* Actions & Remarks button */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setRemarkModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#29b6f6] hover:bg-[#0288d1] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Inspector Remark</span>
                </button>
                <span className="px-2.5 py-1 bg-sky-50 text-sky-700 font-bold text-xs rounded-lg border border-sky-200">
                  {filteredGroups.length} SERVICE GROUPS
                </span>
              </div>
            </div>

            {/* Met / Unmet / NA Metric Cards (Dynamically calculated based on selected tab) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {/* MET Card */}
              <div
                onClick={() => setActiveFilter(activeFilter === 'MET' ? 'ALL' : 'MET')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeFilter === 'MET'
                    ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                    <CircleCheck className="w-4 h-4 text-emerald-600" />
                    MET CRITERIA
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-emerald-600 text-white rounded">
                    PASS
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-950 mt-2">
                  {activeTabStats.metCount} <span className="text-xs font-medium text-emerald-700">items</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-medium mt-1">
                  {activeTabStats.maxScorablePoints > 0
                    ? `${((activeTabStats.metCount / activeTabStats.maxScorablePoints) * 100).toFixed(0)}% of scorable items`
                    : 'All criteria satisfied'}
                </div>
              </div>

              {/* UNMET Card */}
              <div
                onClick={() => setActiveFilter(activeFilter === 'UNMET' ? 'ALL' : 'UNMET')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeFilter === 'UNMET'
                    ? 'bg-rose-50/90 border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-rose-50/40 border-rose-200/80 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-800 uppercase flex items-center gap-1">
                    <CircleX className="w-4 h-4 text-rose-600" />
                    UNMET CRITERIA
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-rose-600 text-white rounded">
                    DEFICIENT
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-rose-950 mt-2">
                  {activeTabStats.unmetCount} <span className="text-xs font-medium text-rose-700">items</span>
                </div>
                <div className="text-[11px] text-rose-700 font-medium mt-1">
                  Requires corrective action
                </div>
              </div>

              {/* NOT APPLICABLE Card */}
              <div
                onClick={() =>
                  setActiveFilter(activeFilter === 'NOT_APPLICABLE' ? 'ALL' : 'NOT_APPLICABLE')
                }
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeFilter === 'NOT_APPLICABLE'
                    ? 'bg-slate-200 border-slate-500 ring-2 ring-slate-400/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
                    <InfoCircle className="w-4 h-4 text-slate-500" />
                    NOT APPLICABLE
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-500 text-white rounded">
                    EXEMPT
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-800 mt-2">
                  {activeTabStats.naCount} <span className="text-xs font-medium text-slate-500">items</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">
                  Exempted from scoring
                </div>
              </div>

              {/* Total Compliance Score Card */}
              <div className="p-3.5 bg-sky-50/50 rounded-xl border border-sky-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-sky-800 uppercase">
                    COMPLIANCE SCORE
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded ${
                      activeTabStats.isPassing
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {activeTabStats.isPassing ? 'PASSED' : 'ACTION REQUIRED'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-extrabold text-slate-900">
                    {activeTabStats.totalScoreObtained}.0 / {activeTabStats.maxScorablePoints}.0
                    <span className="text-sm font-bold text-sky-700 ml-2">
                      ({activeTabStats.complianceStr})
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        activeTabStats.isPassing ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, activeTabStats.compliancePercent)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Inspector Remarks Display */}
          {savedRemarks.length > 0 && (
            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                  <MessageDots className="w-4 h-4 text-sky-600" />
                  <span>Inspector Official Remarks & Findings ({savedRemarks.length}):</span>
                </div>
                <span className="text-[10px] text-sky-700 font-semibold bg-white px-2 py-0.5 rounded border border-sky-200">
                  Audit Trail
                </span>
              </div>
              <div className="space-y-1.5">
                {savedRemarks.map((rem, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-700 pl-5 relative before:content-['•'] before:absolute before:left-1.5 before:text-sky-500 before:font-bold bg-white/70 p-2 rounded-lg border border-sky-100"
                  >
                    {rem}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card 2: Interactive Filter Tabs & Accordion Checklist Results */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-sky-500 text-white shadow-xs">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Inspection Checklist Results
                  </h4>
                  <p className="text-xs text-slate-500">
                    Switch between Premise, Product, and Professional tabs to review section-level Met / Unmet quantities and findings.
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={`Search ${activeCategoryTab.toLowerCase()} criteria or findings...`}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* ========================================================================= */}
            {/* THREE TABS: Premise, Product, and Professional                            */}
            {/* ========================================================================= */}
            <div className="mt-4 pt-1">
              <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-200">
                {/* 1. Premise Tab */}
                <button
                  type="button"
                  onClick={() => setActiveCategoryTab('PREMISE')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    activeCategoryTab === 'PREMISE'
                      ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-transparent'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Premise</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      activeCategoryTab === 'PREMISE'
                        ? 'bg-sky-800/80 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {categoryStats.PREMISE.totalItems}
                  </span>
                </button>

                {/* 2. Product Tab */}
                <button
                  type="button"
                  onClick={() => setActiveCategoryTab('PRODUCT')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    activeCategoryTab === 'PRODUCT'
                      ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-transparent'
                  }`}
                >
                  <Pill className="w-4 h-4" />
                  <span>Product</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      activeCategoryTab === 'PRODUCT'
                        ? 'bg-indigo-800/80 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {categoryStats.PRODUCT.totalItems}
                  </span>
                </button>

                {/* 3. Professional Tab */}
                <button
                  type="button"
                  onClick={() => setActiveCategoryTab('PROFESSIONAL')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    activeCategoryTab === 'PROFESSIONAL'
                      ? 'bg-teal-600 text-white shadow-xs ring-2 ring-teal-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-transparent'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Professional</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      activeCategoryTab === 'PROFESSIONAL'
                        ? 'bg-teal-800/80 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {categoryStats.PROFESSIONAL.totalItems}
                  </span>
                </button>
              </div>
            </div>

            {/* Met / Unmet Status Filter Buttons with Dynamic Quantities for the Selected Tab */}
            <div className="flex flex-wrap items-center gap-2 mt-4 mb-4">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Items ({activeTabStats.totalItems})
              </button>

              <button
                onClick={() => setActiveFilter('MET')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                  activeFilter === 'MET'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <CircleCheck className="w-3.5 h-3.5" />
                <span>✓ MET Only ({activeTabStats.metCount})</span>
              </button>

              <button
                onClick={() => setActiveFilter('UNMET')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                  activeFilter === 'UNMET'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <CircleX className="w-3.5 h-3.5" />
                <span>✕ UNMET Only ({activeTabStats.unmetCount})</span>
              </button>

              <button
                onClick={() => setActiveFilter('NOT_APPLICABLE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                  activeFilter === 'NOT_APPLICABLE'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <InfoCircle className="w-3.5 h-3.5" />
                <span>N/A Only ({activeTabStats.naCount})</span>
              </button>
            </div>

            {/* Service Groups List / Accordions */}
            <div className="space-y-3">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <InfoCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-medium">
                    No {activeCategoryTab.toLowerCase()} checklist items match the selected filter.
                  </p>
                  <button
                    onClick={() => {
                      setActiveFilter('ALL');
                      setSearchFilter('');
                    }}
                    className="mt-2 text-xs font-bold text-sky-600 hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                filteredGroups.map((group) => {
                  const isExpanded = expandedGroups[group.id] ?? true;
                  const groupMet = group.items.filter((i) => getItemStatus(i) === 'MET').length;
                  const groupUnmet = group.items.filter((i) => getItemStatus(i) === 'UNMET').length;
                  const groupNA = group.items.filter((i) => getItemStatus(i) === 'NOT_APPLICABLE').length;

                  return (
                    <div
                      key={group.id}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-white transition-all shadow-2xs"
                    >
                      {/* Accordion Toggle Header */}
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/90 transition-colors text-left bg-white"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-sky-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                          <div>
                            <h5 className="text-sm font-bold text-slate-900">{group.name}</h5>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {group.items.length} {activeCategoryTab.toLowerCase()} criteria evaluated in this section
                            </p>
                          </div>
                        </div>

                        {/* Met / Unmet mini counters for each group */}
                        <div className="flex items-center gap-2">
                          {groupMet > 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ {groupMet} Met
                            </span>
                          )}
                          {groupUnmet > 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                              ✕ {groupUnmet} Unmet
                            </span>
                          )}
                          {groupNA > 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-600">
                              {groupNA} N/A
                            </span>
                          )}
                          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100 ml-1">
                            {group.score}
                          </span>
                        </div>
                      </button>

                      {/* Accordion Expanded Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-3">
                          {group.items.map((item) => {
                            const status = getItemStatus(item);

                            return (
                              <div
                                key={item.id}
                                className={`p-4 bg-white border rounded-xl shadow-2xs transition-all ${
                                  status === 'MET'
                                    ? 'border-emerald-200 hover:border-emerald-300'
                                    : status === 'UNMET'
                                    ? 'border-rose-200 hover:border-rose-300 bg-rose-50/10'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                  {/* Left: Criteria details & finding */}
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-start gap-2">
                                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded mt-0.5 shrink-0">
                                        {item.id}
                                      </span>
                                      <h6 className="text-xs font-bold text-slate-900 leading-snug">
                                        {item.title}
                                      </h6>
                                    </div>

                                    <p className="text-[11px] text-slate-600 leading-relaxed pl-8">
                                      {item.description}
                                    </p>

                                    {/* If UNMET: Display deficiency and corrective action box */}
                                    {status === 'UNMET' && (
                                      <div className="ml-8 mt-2 p-3 bg-rose-50/80 border border-rose-200 rounded-lg space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                                          <span>Non-Compliance Finding / Deficiency:</span>
                                        </div>
                                        <p className="text-xs text-rose-900 font-medium">
                                          {item.deficiencyReason ||
                                            'Standard verification requirements not satisfied during initial inspection.'}
                                        </p>
                                        {item.correctiveAction && (
                                          <div className="text-[11px] text-rose-700 bg-white/80 p-2 rounded border border-rose-100 mt-1">
                                            <span className="font-bold">Required Corrective Action: </span>
                                            {item.correctiveAction}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* If MET: Show positive verification comment */}
                                    {status === 'MET' && item.evaluatorComment && (
                                      <div className="ml-8 mt-1.5 p-2 bg-emerald-50/60 border border-emerald-100 rounded-lg text-[11px] text-emerald-800 flex items-start gap-1.5">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>
                                          <strong className="font-semibold">Observation:</strong>{' '}
                                          {item.evaluatorComment}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Right: Met / Unmet Visual Status Badge */}
                                  <div className="flex flex-col sm:flex-row lg:flex-col items-end sm:items-center lg:items-end justify-between gap-2 shrink-0">
                                    <div className="flex items-center gap-2">
                                      {/* Clear MET / UNMET Pill */}
                                      {status === 'MET' && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs shadow-xs tracking-wide">
                                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                                          <span>MET (1.0)</span>
                                        </div>
                                      )}

                                      {status === 'UNMET' && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs shadow-xs tracking-wide animate-pulse">
                                          <CircleX className="w-3.5 h-3.5 stroke-[2.5]" />
                                          <span>UNMET (0.0)</span>
                                        </div>
                                      )}

                                      {status === 'NOT_APPLICABLE' && (
                                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-700 text-white font-bold text-xs shadow-2xs">
                                          <InfoCircle className="w-3.5 h-3.5" />
                                          <span>N/A</span>
                                        </div>
                                      )}

                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-sky-50 text-sky-700 border border-sky-200">
                                        {item.stage || activeCategoryTab}
                                      </span>
                                    </div>

                                    {/* Auditor Override Controls in Evaluation Mode */}
                                    {isEvaluationMode && (
                                      <div className="flex items-center gap-1 mt-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[10px] font-bold">
                                        <button
                                          onClick={() =>
                                            handleToggleItemStatus(group.id, item.id, 'MET')
                                          }
                                          className={`px-2 py-0.5 rounded transition-colors ${
                                            status === 'MET'
                                              ? 'bg-emerald-600 text-white'
                                              : 'bg-white text-emerald-700 hover:bg-emerald-50'
                                          }`}
                                        >
                                          Met
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleToggleItemStatus(group.id, item.id, 'UNMET')
                                          }
                                          className={`px-2 py-0.5 rounded transition-colors ${
                                            status === 'UNMET'
                                              ? 'bg-rose-600 text-white'
                                              : 'bg-white text-rose-700 hover:bg-rose-50'
                                          }`}
                                        >
                                          Unmet
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleToggleItemStatus(
                                              group.id,
                                              item.id,
                                              'NOT_APPLICABLE'
                                            )
                                          }
                                          className={`px-2 py-0.5 rounded transition-colors ${
                                            status === 'NOT_APPLICABLE'
                                              ? 'bg-slate-700 text-white'
                                              : 'bg-white text-slate-700 hover:bg-slate-50'
                                          }`}
                                        >
                                          N/A
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-800">{activeCategoryTab}</span> Checklist Items: <span className="font-bold text-slate-800">{activeTabStats.totalItems}</span> • Met:{' '}
            <span className="font-bold text-emerald-700">{activeTabStats.metCount}</span> • Unmet:{' '}
            <span className="font-bold text-rose-700">{activeTabStats.unmetCount}</span> • N/A:{' '}
            <span className="font-bold text-slate-600">{activeTabStats.naCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Compliance Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>

      {/* Nested Add Remark Dialog */}
      {remarkModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageDots className="w-4 h-4 text-sky-600" />
                Add Inspection Remark
              </h4>
              <button
                onClick={() => setRemarkModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Inspector Observation / Remark:
              </label>
              <textarea
                rows={3}
                value={newRemarkText}
                onChange={(e) => setNewRemarkText(e.target.value)}
                placeholder="Enter checklist notes, compliance directives, or inspection findings..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setRemarkModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRemark}
                className="px-4 py-1.5 text-xs bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Save Remark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
