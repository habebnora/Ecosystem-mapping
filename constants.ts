import type { FounderGender } from './types';

export const REVENUE_RANGES: string[] = [
  'All',
  '< 100K EGP',
  '100K - 500K EGP',
  '500K - 1M EGP',
  '1M - 5M EGP',
  '> 5M EGP',
];

export const REVENUE_RANGES_MAP: { [key: string]: { min: number; max: number } } = {
  '< 100K EGP': { min: 0, max: 99999 },
  '100K - 500K EGP': { min: 100000, max: 500000 },
  '500K - 1M EGP': { min: 500001, max: 1000000 },
  '1M - 5M EGP': { min: 1000001, max: 5000000 },
  '> 5M EGP': { min: 5000001, max: Infinity },
};

export const EMPLOYEE_RANGES: string[] = [
  'All',
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501+',
];

export const FOUNDER_GENDERS: (FounderGender | 'All')[] = [
  'All',
  'Male',
  'Female',
  'Mixed',
  'Unknown',
];
