export type OpportunityType =
  | 'Internship'
  | 'Full-time'
  | 'Part-time'
  | 'Fresher'
  | 'Experienced'
  | 'Remote';

export type CompanyCategory =
  | 'Software'
  | 'AI/ML'
  | 'Automotive'
  | 'FinTech'
  | 'Healthcare'
  | 'Semiconductor'
  | 'Robotics'
  | 'Cybersecurity'
  | 'IT Services'
  | 'Research';

export type CompanyType = 'Startup' | 'MNC' | 'Product' | 'Service' | 'Research';

export type HiringStatus = 'hiring' | 'internship' | 'unverified';

export interface Company {
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  website: string;
  phone?: string;
  businessType: CompanyCategory;
  companyType: CompanyType;
  distanceKm?: number;
  source: string;
  lastVerified: string;
  verifiedOpeningsCount?: number;
  verifiedInternshipsCount?: number;
  isDemoData?: boolean;
  hiringStatus: HiringStatus;
  overview?: string;
  employeeCount?: string;
  employeeCountSource?: string;
  publicRecruitmentContact?: {
    email?: string;
    phone?: string;
    careersUrl?: string;
    notes?: string;
  };
}

export interface Opportunity {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  location: string;
  type: OpportunityType;
  experience: string;
  skills: string[];
  postedDate: string;
  deadline?: string;
  applicationUrl: string;
  source: string;
  lastVerified: string;
  isDemoData: boolean;
  description?: string;
}

export interface ResearchItem {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  year: number;
  date: string;
  description: string;
  source: string;
  sourceUrl: string;
}

export interface SkillStat {
  skill: string;
  category: 'languages' | 'frameworks' | 'databases' | 'cloud' | 'tools' | 'concepts';
  count: number;
  postingsCount: number;
}

export interface CommonRequirement {
  name: string;
  count: number;
  totalAnalyzed: number;
  category: string;
}

export interface FilterState {
  searchQuery: string;
  maxDistanceKm: number;
  opportunityTypes: OpportunityType[];
  industries: CompanyCategory[];
  companyTypes: CompanyType[];
}

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  maxDistanceKm: 25,
  opportunityTypes: [],
  industries: [],
  companyTypes: []
};

export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  address?: string;
  isUserSpecified?: boolean;
}

export type ApplicationStage = 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Offer';

export interface ApplicationItem {
  id: string;
  companyName: string;
  roleTitle: string;
  opportunityId?: string;
  type: OpportunityType;
  stage: ApplicationStage;
  updatedAt: string;
  notes?: string;
}

export interface StoredAlert {
  id: string;
  title: string;
  query: string;
  radiusKm: number;
  roleType?: string;
  createdAt: string;
  active: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  education: string;
  skills: string[];
  projects: string;
  certifications: string;
  github: string;
  targetRole: string;
  targetCompany: string;
}

export interface UserAuth {
  isLoggedIn: boolean;
  userId?: string;
  email?: string;
  displayName?: string;
  isAnonymous?: boolean;
}
