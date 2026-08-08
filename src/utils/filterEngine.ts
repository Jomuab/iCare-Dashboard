import {
  BranchName,
  CustomerType,
  DeliveryCenterType,
  FilterState,
  LicenseRecord,
  TimePeriod,
} from '../types';
import {
  APPLICATIONS_PIE_DATA,
  BRANCH_COMPARISON,
  CASEWORKERS,
  DELIVERY_CENTER_DATA,
  EDUCATION_LEVEL_SUMMARY,
  LEAST_INSPECTORS,
  OWNERSHIP_TYPES,
  PREFIX_SUMMARY,
  SAMPLE_LICENSES,
  SERVICE_SUMMARY_HP,
  SPECIFIC_SERVICES,
  TOP_INSPECTORS,
} from '../data/mockData';

// Helper to calculate scaling multiplier based on all filter parameters
export function getPeriodMultiplier(
  period: TimePeriod,
  startDate?: string,
  endDate?: string
): number {
  switch (period) {
    case 'DAILY':
      return 1 / 365;
    case 'WEEKLY':
      return 7 / 365;
    case 'MONTHLY':
      return 30 / 365;
    case 'QUARTERLY':
      return 90 / 365;
    case 'YEARLY':
      return 1.0;
    case 'CUSTOM': {
      if (startDate && endDate) {
        const s = new Date(startDate);
        const e = new Date(endDate);
        const diffMs = e.getTime() - s.getTime();
        const days = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
        return days / 365;
      }
      return 30 / 365;
    }
  }
}

export function getPeriodSubtext(period: TimePeriod): string {
  switch (period) {
    case 'DAILY':
      return 'vs yesterday';
    case 'WEEKLY':
      return 'vs last week';
    case 'MONTHLY':
      return 'vs last month';
    case 'QUARTERLY':
      return 'vs last quarter';
    case 'YEARLY':
      return 'vs last year';
    case 'CUSTOM':
      return 'vs prev period';
  }
}

export function getFilterMultiplier(filters: FilterState, includePeriod: boolean = true): number {
  let customerMult = 1.0;
  if (filters.customerType === 'HP') customerMult = 0.58;
  else if (filters.customerType === 'HF') customerMult = 0.26;
  else if (filters.customerType === 'FHR') customerMult = 0.16;

  let branchMult = 1.0;
  switch (filters.branch) {
    case 'Head Office':
      branchMult = 0.41;
      break;
    case 'Bole':
      branchMult = 0.18;
      break;
    case 'Kirkos':
      branchMult = 0.14;
      break;
    case 'Yeka':
      branchMult = 0.11;
      break;
    case 'Akaki Kality':
      branchMult = 0.08;
      break;
    case 'Nifas Silk Lafto':
      branchMult = 0.06;
      break;
    case 'Lideta':
      branchMult = 0.05;
      break;
    case 'Arada':
      branchMult = 0.04;
      break;
    case 'Addis Ketema':
      branchMult = 0.03;
      break;
    case 'Gullele':
      branchMult = 0.03;
      break;
    case 'Lemi Kura':
      branchMult = 0.02;
      break;
    case 'Kolfe Keranio':
      branchMult = 0.02;
      break;
    default:
      branchMult = 1.0;
  }

  let centerMult = 1.0;
  if (filters.deliveryCenter === 'HEAD_OFFICE') centerMult = 0.41;
  else if (filters.deliveryCenter === 'BRANCH') centerMult = 0.52;
  else if (filters.deliveryCenter === 'WOREDA') centerMult = 0.07;

  let woredaMult = filters.woreda === 'ALL' ? 1.0 : 0.18;

  let ownershipMult = 1.0;
  if (filters.ownership === 'PLC') ownershipMult = 0.48;
  else if (filters.ownership === 'NGO') ownershipMult = 0.22;
  else if (filters.ownership === 'Government') ownershipMult = 0.18;
  else if (filters.ownership === 'Private/Sole') ownershipMult = 0.12;

  let mult = customerMult * branchMult * centerMult * woredaMult * ownershipMult;

  if (includePeriod) {
    const periodMult = getPeriodMultiplier(filters.period, filters.startDate, filters.endDate);
    mult *= periodMult;
  }

  if (filters.searchQuery.trim()) {
    mult *= 0.6;
  }

  return Math.max(mult, 0.0005);
}

// 1. KPI Cards dynamic calculation
export function getFilteredKpis(filters: FilterState) {
  const mult = getFilterMultiplier(filters);
  const periodSub = getPeriodSubtext(filters.period);

  return [
    {
      id: 'total',
      title: 'Total Licenses',
      value: Math.max(1, Math.round(30140 * mult)),
      change: '+8.4%',
      period: periodSub,
      color: 'from-sky-500 to-cyan-600',
      bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
      iconName: 'ShieldCheck',
    },
    {
      id: 'new',
      title: 'New Licenses',
      value: Math.max(1, Math.round(7070 * mult)),
      change: '+12.1%',
      period: periodSub,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconName: 'PlusCircle',
    },
    {
      id: 'renew',
      title: 'Renew Licenses',
      value: Math.max(1, Math.round(23016 * mult)),
      change: '+6.3%',
      period: periodSub,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconName: 'RefreshCw',
    },
    {
      id: 'upgrade',
      title: 'Upgrade Licenses',
      value: Math.max(0, Math.round(716 * mult)),
      change: '+2.5%',
      period: periodSub,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
      iconName: 'ArrowUpCircle',
    },
    {
      id: 'digitization',
      title: 'Digitization',
      value: Math.max(0, Math.round(2088 * mult)),
      change: '+15.2%',
      period: periodSub,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
      iconName: 'Database',
    },
  ];
}

// 2. Applications Status pie chart data filtered
export function getFilteredApplicationsData(filters: FilterState) {
  const mult = getFilterMultiplier(filters);
  return APPLICATIONS_PIE_DATA.map((item) => ({
    ...item,
    value: Math.max(1, Math.round(item.value * mult)),
  }));
}

// 3. Licenses Trend line data filtered by period & filters
export function getFilteredTrendData(filters: FilterState) {
  const mult = getFilterMultiplier(filters, false);

  if (filters.period === 'DAILY') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseVals = [120, 145, 180, 160, 210, 95, 40];
    return days.map((day, idx) => {
      const tot = Math.round(baseVals[idx] * mult * 2.5);
      return {
        period: day,
        total: Math.max(1, tot),
        organizations: Math.max(0, Math.round(tot * 0.3)),
        individuals: Math.max(0, Math.round(tot * 0.7)),
      };
    });
  }

  if (filters.period === 'WEEKLY') {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const baseVals = [820, 950, 1100, 1050];
    return weeks.map((w, idx) => {
      const tot = Math.round(baseVals[idx] * mult * 1.5);
      return {
        period: w,
        total: Math.max(1, tot),
        organizations: Math.max(0, Math.round(tot * 0.32)),
        individuals: Math.max(0, Math.round(tot * 0.68)),
      };
    });
  }

  if (filters.period === 'QUARTERLY') {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const baseVals = [7200, 8900, 10400, 9800];
    return quarters.map((q, idx) => {
      const tot = Math.round(baseVals[idx] * mult);
      return {
        period: q,
        total: Math.max(1, tot),
        organizations: Math.max(0, Math.round(tot * 0.35)),
        individuals: Math.max(0, Math.round(tot * 0.65)),
      };
    });
  }

  if (filters.period === 'YEARLY') {
    const years = ['2022', '2023', '2024', '2025', '2026'];
    const baseVals = [21000, 24500, 27800, 30140, 34200];
    return years.map((y, idx) => {
      const tot = Math.round(baseVals[idx] * mult);
      return {
        period: y,
        total: Math.max(1, tot),
        organizations: Math.max(0, Math.round(tot * 0.33)),
        individuals: Math.max(0, Math.round(tot * 0.67)),
      };
    });
  }

  if (filters.period === 'CUSTOM') {
    const pMult = getPeriodMultiplier('CUSTOM', filters.startDate, filters.endDate);
    const customPoints = ['Interval 1', 'Interval 2', 'Interval 3', 'Interval 4', 'Interval 5'];
    const baseVals = [2100, 2800, 3100, 2900, 3400];
    return customPoints.map((pt, idx) => {
      const tot = Math.max(1, Math.round(baseVals[idx] * mult * pMult * 10));
      return {
        period: pt,
        total: tot,
        organizations: Math.max(0, Math.round(tot * 0.32)),
        individuals: Math.max(0, Math.round(tot * 0.68)),
      };
    });
  }

  // Monthly default
  const trendBase = [
    { period: 'Jan', total: 2450, orgRate: 0.33 },
    { period: 'Feb', total: 2890, orgRate: 0.32 },
    { period: 'Mar', total: 3410, orgRate: 0.32 },
    { period: 'Apr', total: 3120, orgRate: 0.33 },
    { period: 'May', total: 3890, orgRate: 0.33 },
    { period: 'Jun', total: 4250, orgRate: 0.33 },
    { period: 'Jul', total: 4820, orgRate: 0.33 },
    { period: 'Aug', total: 5310, orgRate: 0.33 },
  ];

  return trendBase.map((row) => {
    const tot = Math.max(1, Math.round(row.total * mult));
    const orgs = Math.round(tot * row.orgRate);
    return {
      period: row.period,
      total: tot,
      organizations: orgs,
      individuals: Math.max(0, tot - orgs),
    };
  });
}

// 4. Decisions dual-bar chart data filtered
export function getFilteredDecisionsData(filters: FilterState) {
  const mult = getFilterMultiplier(filters);
  const total = Math.max(10, Math.round(36000 * mult));
  const orgs = Math.round(total * 0.033);
  const ind = Math.max(0, total - orgs);

  return [
    { category: 'Total', value: total },
    { category: 'Organizations', value: orgs },
    { category: 'Individuals', value: ind },
  ];
}

// 5. Delivery Center distribution data filtered
export function getFilteredDeliveryCenterData(filters: FilterState) {
  const mult = getFilterMultiplier(filters);

  return DELIVERY_CENTER_DATA.map((row) => {
    let hp = row.hp;
    let hf = row.hf;
    let fhr = row.fhr;

    // Filter customer type applicability
    if (filters.customerType === 'HP') {
      hf = 0;
      fhr = 0;
      if (row.center !== 'Head Office') hp = Math.round(row.total * 0.1);
    } else if (filters.customerType === 'HF') {
      hp = 0;
      fhr = 0;
      if (row.center === 'Head Office') hf = 250;
    } else if (filters.customerType === 'FHR') {
      hp = 0;
      hf = 0;
      if (row.center === 'Head Office') fhr = 180;
    }

    // Filter delivery center applicability
    if (filters.deliveryCenter === 'HEAD_OFFICE' && row.center !== 'Head Office') {
      hp = Math.round(hp * 0.1);
      hf = Math.round(hf * 0.1);
      fhr = Math.round(fhr * 0.1);
    } else if (filters.deliveryCenter === 'BRANCH' && row.center === 'Head Office') {
      hp = Math.round(hp * 0.1);
    } else if (filters.deliveryCenter === 'WOREDA' && row.center !== 'Woreda Centers') {
      hp = Math.round(hp * 0.1);
      hf = Math.round(hf * 0.1);
      fhr = Math.round(fhr * 0.1);
    }

    // Filter branch selection
    if (filters.branch !== 'All Branches') {
      if (
        row.center !== 'Head Office' &&
        row.center !== 'Woreda Centers' &&
        !row.center.toLowerCase().includes(filters.branch.toLowerCase())
      ) {
        hp = Math.round(hp * 0.05);
        hf = Math.round(hf * 0.05);
        fhr = Math.round(fhr * 0.05);
      }
    }

    // Apply period/combined scaling
    hp = Math.round(hp * mult);
    hf = Math.round(hf * mult);
    fhr = Math.round(fhr * mult);

    return {
      center: row.center,
      hp,
      hf,
      fhr,
      total: hp + hf + fhr,
    };
  });
}

// 6. Service Breakdown data filtered
export function getFilteredServiceBreakdown(filters: FilterState) {
  const mult = getFilterMultiplier(filters);

  const serviceSummary = SERVICE_SUMMARY_HP.map((s) => ({
    ...s,
    value: Math.max(1, Math.round(s.value * mult)),
  }));

  const educationSummary = EDUCATION_LEVEL_SUMMARY.map((e) => ({
    ...e,
    value: Math.max(1, Math.round(e.value * mult)),
  }));

  const prefixSummary = PREFIX_SUMMARY.map((p) => ({
    ...p,
    value: Math.max(1, Math.round(p.value * mult)),
  }));

  const hfServices = SPECIFIC_SERVICES.healthFacility.map((s) => ({
    ...s,
    count: Math.max(1, Math.round(s.count * mult)),
  }));

  const fhrServices = SPECIFIC_SERVICES.fhr.map((s) => ({
    ...s,
    count: Math.max(1, Math.round(s.count * mult)),
  }));

  return {
    serviceSummary,
    educationSummary,
    prefixSummary,
    hfServices,
    fhrServices,
  };
}

// 7. Ownership data filtered
export function getFilteredOwnershipData(filters: FilterState) {
  const mult = getFilterMultiplier(filters);

  let types = OWNERSHIP_TYPES.map((o) => {
    let val = o.value;
    if (filters.ownership !== 'ALL') {
      if (!o.name.toLowerCase().includes(filters.ownership.toLowerCase())) {
        val = Math.round(val * 0.1);
      }
    }
    val = Math.max(1, Math.round(val * mult));
    return { ...o, value: val };
  });

  const total = types.reduce((acc, cur) => acc + cur.value, 0);

  types = types.map((t) => ({
    ...t,
    percentage: total > 0 ? Math.round((t.value / total) * 100) : 0,
  }));

  return types;
}

// 8. Caseworkers & Inspectors data filtered
export function getFilteredCaseworkersData(filters: FilterState) {
  let workers = [...CASEWORKERS];
  let topInsp = [...TOP_INSPECTORS];
  let leastInsp = [...LEAST_INSPECTORS];

  if (filters.branch !== 'All Branches') {
    const branchQuery = filters.branch.toLowerCase();
    const matchedWorkers = workers.filter((w) =>
      w.branch.toLowerCase().includes(branchQuery)
    );
    if (matchedWorkers.length > 0) {
      workers = matchedWorkers;
    }

    const matchedTop = topInsp.filter((i) =>
      i.branch.toLowerCase().includes(branchQuery)
    );
    if (matchedTop.length > 0) topInsp = matchedTop;

    const matchedLeast = leastInsp.filter((i) =>
      i.branch.toLowerCase().includes(branchQuery)
    );
    if (matchedLeast.length > 0) leastInsp = matchedLeast;
  }

  if (filters.customerType !== 'ALL') {
    topInsp = topInsp.filter(
      (i) => i.customerType === filters.customerType || i.customerType === 'HF'
    );
    leastInsp = leastInsp.filter(
      (i) => i.customerType === filters.customerType || i.customerType === 'FHR'
    );
  }

  return {
    workers,
    topInsp,
    leastInsp,
  };
}

// 9. Branch Comparison data filtered
export function getFilteredBranchComparison(filters: FilterState) {
  const pMult = getPeriodMultiplier(filters.period);

  return BRANCH_COMPARISON.map((b) => {
    let hf = b.hfLicenses;
    let fhr = b.fhrLicenses;

    if (filters.customerType === 'HP') {
      hf = 0;
      fhr = 0;
    } else if (filters.customerType === 'HF') {
      fhr = 0;
    } else if (filters.customerType === 'FHR') {
      hf = 0;
    }

    const totalIssued = Math.max(1, Math.round((hf + fhr) * pMult));

    return {
      ...b,
      hfLicenses: Math.round(hf * pMult),
      fhrLicenses: Math.round(fhr * pMult),
      licensesIssued: totalIssued,
    };
  });
}

// 10. Sample License Records Filtered
export function getFilteredLicenseRecords(filters: FilterState): LicenseRecord[] {
  return SAMPLE_LICENSES.filter((record) => {
    // Customer Type filter
    if (filters.customerType !== 'ALL' && record.customerType !== filters.customerType) {
      return false;
    }

    // Branch filter
    if (filters.branch !== 'All Branches') {
      if (
        !record.branch.toLowerCase().includes(filters.branch.toLowerCase()) &&
        !filters.branch.toLowerCase().includes(record.branch.toLowerCase())
      ) {
        return false;
      }
    }

    // Delivery Center filter
    if (filters.deliveryCenter === 'HEAD_OFFICE' && record.branch !== 'Head Office') {
      return false;
    }
    if (filters.deliveryCenter === 'BRANCH' && record.branch === 'Head Office') {
      return false;
    }
    if (filters.deliveryCenter === 'WOREDA' && record.woreda === 'N/A') {
      return false;
    }

    // Woreda filter
    if (filters.woreda !== 'ALL' && record.woreda !== filters.woreda) {
      return false;
    }

    // Ownership filter
    if (filters.ownership !== 'ALL') {
      if (!record.ownershipType || record.ownershipType !== filters.ownership) {
        return false;
      }
    }

    // Search Query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchNumber = record.licenseNumber.toLowerCase().includes(q);
      const matchName = record.applicantName.toLowerCase().includes(q);
      const matchBranch = record.branch.toLowerCase().includes(q);
      const matchService = record.serviceType.toLowerCase().includes(q);
      const matchFacility = record.facilityType?.toLowerCase().includes(q) || false;
      if (!matchNumber && !matchName && !matchBranch && !matchService && !matchFacility) {
        return false;
      }
    }

    return true;
  });
}
