export type CustomerType = 'ALL' | 'HP' | 'HF' | 'FHR';

export type UserRole =
  | 'DIRECTORATE'
  | 'BRANCH_MANAGER_BOLE'
  | 'FHR_TEAM_LEAD_BOLE'
  | 'HF_TEAM_LEAD_KIRKOS'
  | 'ALL_BRANCH_ROLE'
  | 'INSPECTOR';

export type DeliveryCenterType = 'ALL' | 'HEAD_OFFICE' | 'ADDIS_MESOB' | 'BRANCH' | 'WOREDA';

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
  selectedDate?: string;
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
  provider?: 'AAFDA' | 'Addis Mesob';
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

// ----------------------------------------------------
// Applications Workflow Types (from AAFDA screenshots)
// ----------------------------------------------------

export type ApplicationStatus =
  | 'Inprogress'
  | 'In Progress'
  | 'Success'
  | 'critical'
  | 'Critical'
  | 'inspection'
  | 'Inspection'
  | 'Review'
  | 'Payment'
  | 'Submitted'
  | 'Draft';

export type ApplicationCategoryType = 'PROFESSIONAL' | 'COMPANY' | 'OTHER';

export interface ApplicationDocumentFile {
  id: string;
  documentName: string;
  isCommonFile: boolean;
  isOptional: boolean;
  version: number;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  fileUrl?: string;
  previewUrl?: string;
}

export interface EducationalDetails {
  university: string;
  universityAm?: string;
  profession: string;
  professionAm?: string;
  qualificationDegree: string;
  qualificationDegreeAm?: string;
  fieldOfStudy: string;
  fieldOfStudyAm?: string;
  graduationDate: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  statusType: 'NOT_APPLICABLE' | 'SCORE_1' | 'SCORE_0' | 'COMPLIANT' | 'NON_COMPLIANT';
  statusBadge: string;
  stage: string;
  category?: 'PREMISE' | 'PRODUCT' | 'PROFESSIONAL' | string;
  status: 'MET' | 'UNMET' | 'NOT_APPLICABLE';
  evaluationValue: 'MET' | 'UNMET' | 'N/A';
  score: number;
  maxScore: number;
  deficiencyReason?: string;
  correctiveAction?: string;
  evaluatorComment?: string;
  categoryCode?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  remarks?: string;
}

export interface ChecklistServiceGroup {
  id: string;
  name: string;
  itemCount: number;
  score: string;
  metCount?: number;
  unmetCount?: number;
  naCount?: number;
  category?: 'PREMISE' | 'PRODUCT' | 'PROFESSIONAL' | string;
  tabCategory?: 'PREMISE' | 'PRODUCT' | 'PROFESSIONAL' | string;
  items: ChecklistItem[];
}

export interface InspectionTeamMember {
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface InspectionRecord {
  id: string;
  inspectionType: string;
  inspection: string;
  stages: string;
  score: number | string;
  round: string;
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'PENDING' | 'PASSED' | 'REJECTED';
  facilitator: string;
  team: InspectionTeamMember[];
  checklistGroups: ChecklistServiceGroup[];
  totalScore: string;
  compliance: string;
  metCount?: number;
  unmetCount?: number;
  naCount?: number;
  itemsChecked: number;
  totalCategories: number;
  totalServiceGroups: number;
  findingsSummary?: string;
}

export interface CurrentTaskDetail {
  name: string;
  description: string;
  handlerType: string;
  estimatedTime: string;
  type: string;
  inspectionStage: string;
  pickedAt: string;
  handlerUser: string;
  handlerEmail?: string;
  handlerPhone?: string;
}

export interface ApplicationDetail {
  id: string;
  trackingNumber: string;
  categoryType?: ApplicationCategoryType;
  organizationName: string;
  organizationalService: string;
  appliedAt: string;
  currentStatus: string;
  licenseTypeBadge?: string;
  
  // Overview
  applicationNumber: string;
  applicationStatus: string;
  institutionStatus: string;
  applicationType: string;
  submittedAt: string;
  service: string;
  category: string;
  organizationType: string;

  // Applicant Details
  applicantName: string;
  applicantType?: string; // 'Local' | 'Diaspora' | 'Foreign'
  houseNumber: string;
  city: string;
  subCity: string;
  woreda: string;
  email: string;
  phoneNumber: string;
  specificArea: string;

  // Health Professional specific
  educationalDetails?: EducationalDetails;
  underSupervisionStatus?: string;
  otherDetails?: string[];
  files?: ApplicationDocumentFile[];

  // Institution Details
  institutionName: string;
  institutionNameAm: string;
  ownership: string;
  serviceGroup: string;
  subOrganization: string;
  tradeName: string;
  tinNumber: string;
  businessRegistrationNo: string;
  businessLicenseNo: string;

  // Manager Details
  managerName: string;
  managerNameAm: string;
  managerPhone: string;
  managerAltPhone: string;

  // Address Details
  addressEmail: string;
  addressPhone: string;
  officePhone: string;
  addressCity: string;
  addressSubCity: string;
  addressWoreda: string;
  addressHouseNumber: string;
  postalAddress: string;
  addressSpecificArea: string;
  website: string;
  latitude: number | string;
  longitude: number | string;

  // Services and Products
  selectedServices: string[];
  selectedProducts: string;
  franchise: string;
  franchiser: string;

  // Current Task & Inspections
  currentTask: CurrentTaskDetail;
  inspections: InspectionRecord[];
}

