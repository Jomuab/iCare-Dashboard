export type CustomerType = 'ALL' | 'HP' | 'HF' | 'FHR';

export type UserRole =
  | 'DIRECTORATE'
  | 'BRANCH_MANAGER_BOLE'
  | 'FHR_TEAM_LEAD_BOLE'
  | 'HF_TEAM_LEAD_KIRKOS'
  | 'ALL_BRANCH_ROLE'
  | 'INSPECTOR';

export type DeliveryCenterType = 'ALL' | 'HEAD_OFFICE' | 'BRANCH' | 'WOREDA';

export type TimePeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';

export type BranchName =
  | 'All Branches'
  | 'Head Office'
  | 'Bole'
  | 'Kirkos'
  | 'Yeka'
  | 'Akaki Kality'
  | 'Nifas Silk Lafto'
  | 'Lideta'
  | 'Arada'
  | 'Addis Ketema'
  | 'Gullele'
  | 'Lemi Kura'
  | 'Kolfe Keranio';

export interface FilterState {
  customerType: CustomerType;
  role: UserRole;
  deliveryCenter: DeliveryCenterType;
  branch: BranchName;
  woreda: string;
  period: TimePeriod;
  startDate?: string;
  endDate?: string;
  ownership: string;
  searchQuery: string;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  change: string;
  isPositive: boolean;
  subtext: string;
  iconName: string;
}

export interface CaseworkerPerformance {
  name: string;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  slaRate: number;
  branch: string;
  role: string;
}

export interface InspectorMetric {
  id: string;
  name: string;
  branch: string;
  inspectionsCompleted: number;
  passRate: number;
  avgResponseHours: number;
  score: number;
  customerType: CustomerType;
}

export interface BranchComparisonData {
  branch: string;
  licensesIssued: number;
  hpLicenses: number;
  hfLicenses: number;
  fhrLicenses: number;
  avgProcessingDays: number;
  slaCompliance: number;
  revenueEtb: number;
}

export interface TaxonomyNode {
  orgType: string;
  orgSubType: string;
  serviceGroup: string;
  orgServices: string[];
  customerType: 'HF' | 'FHR';
}

export interface LicenseRecord {
  id: string;
  licenseNumber: string;
  applicantName: string;
  customerType: CustomerType;
  serviceType: string;
  branch: string;
  woreda: string;
  issueDate: string;
  expiryDate: string;
  status: 'Approved' | 'In Review' | 'Submitted' | 'Draft' | 'Expired';
  ownershipType?: string;
  facilityType?: string;
}
