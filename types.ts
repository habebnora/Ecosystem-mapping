export type FounderGender = 'Male' | 'Female' | 'Mixed' | 'Unknown';

export interface Startup {
  id: number;
  name: string;
  description: string;
  stage: string;
  sector: string;
  location: string; // Governorate
  center: string; // City/Center
  companyType: string;
  foundingTeamSize: number;
  femaleFounders: number;
  employees: number;
  annualRevenue: number;
  foundersGender: FounderGender;
  lat: number;
  lng: number;
}

export interface Filters {
  location: string; // Search by governorate or center
  stage: string;
  sector: string[];
  companyType: string;
  employeeRange: string;
  revenueRange: string;
  founderGender: FounderGender | 'All';
}
