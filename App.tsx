
import React, { useState, useMemo, useEffect } from 'react';
import { FilterSidebar } from './components/FilterSidebar';
import { MapComponent } from './components/MapComponent';
import { rawJsonData } from './data/raw-data';
import type { Startup, Filters, FounderGender } from './types';
import {
  REVENUE_RANGES,
  REVENUE_RANGES_MAP,
  EMPLOYEE_RANGES,
  FOUNDER_GENDERS,
} from './constants';

const geocodeMap: { [key: string]: { lat: number; lng: number } } = {
  'اسيوط': { lat: 27.1783, lng: 31.1859 },
  'مركز أسيوط': { lat: 27.1809, lng: 31.1837 },
  'مركز القوصية': { lat: 27.4425, lng: 30.8161 },
  'مركز منفلوط': { lat: 27.3097, lng: 30.9703 },
  'مركز ساحل سليم': { lat: 26.9942, lng: 31.3093 },
  'مركز صدفا': { lat: 26.9031, lng: 31.4017 },
  'مركز أبو تيج': { lat: 27.0431, lng: 31.3213 },
  'مركز أبنوب': { lat: 27.2650, lng: 31.1517 },
  'مركز الفتح': { lat: 27.2478, lng: 31.1442 },
  'مركز ديروط': { lat: 27.5583, lng: 30.8142 },
  'مركز الغنايم': { lat: 26.9333, lng: 31.3667 },
  'مركز البداري': { lat: 26.9880, lng: 31.3965 },
  'سوهاج': { lat: 26.5569, lng: 31.6948 },
  'مركز سوهاج': { lat: 26.5610, lng: 31.6934 },
  'مركز دار السلام': { lat: 26.2625, lng: 32.1000 },
  'مركز طهطا': { lat: 26.7692, lng: 31.5019 },
  'مركز جهينة': { lat: 26.6858, lng: 31.5833 },
  'مركز أخميم': { lat: 26.5667, lng: 31.7500 },
  'مركز المراغة': { lat: 26.6975, lng: 31.6033 },
  'مركز طما': { lat: 26.9150, lng: 31.4239 },
  'مركز جرجا': { lat: 26.3389, lng: 31.8906 },
  'قنا': { lat: 26.1635, lng: 32.7246 },
  'المنيا': { lat: 28.1099, lng: 30.7503 },
  'default': { lat: 27.1783, lng: 31.1859 } // Default to Asyut
};

const parseNumeric = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const num = parseFloat(val.replace(/[^0-9.-]+/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return 0;
};


const App: React.FC = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [uniqueSectors, setUniqueSectors] = useState<string[]>([]);
  const [uniqueStages, setUniqueStages] = useState<string[]>([]);
  const [uniqueCompanyTypes, setUniqueCompanyTypes] = useState<string[]>([]);

  useEffect(() => {
    const parsedData = rawJsonData.map((item, index): Startup | null => {
      try {
        const name = item.Project?.name || '';
        if (!name) return null;

        const location = item.Founder?.location?.governorate || 'اسيوط';
        const center = item.Founder?.location?.center || '';
        
        const coords = geocodeMap[center] || geocodeMap[location] || geocodeMap['default'];
        const lat = coords.lat + (Math.random() - 0.5) * 0.015;
        const lng = coords.lng + (Math.random() - 0.5) * 0.015;

        const foundingTeamSize = parseNumeric(item.Team?.founding_team_size);
        const femaleFounders = parseNumeric(item.Team?.female_founders);
        
        let foundersGender: FounderGender = 'Unknown';
        if (foundingTeamSize > 0) {
            if (femaleFounders === 0) foundersGender = 'Male';
            else if (femaleFounders > 0 && femaleFounders === foundingTeamSize) foundersGender = 'Female';
            else if (femaleFounders > 0 && femaleFounders < foundingTeamSize) foundersGender = 'Mixed';
        }

        let annualRevenue = parseNumeric(item.Financials?.annual_revenue);
        if (annualRevenue === 0) {
          const monthlyIncome = parseNumeric(item.Financials?.monthly_income);
          annualRevenue = monthlyIncome * 12;
        }
        
        return {
          id: index + 1,
          name,
          description: item.Project?.description || '',
          stage: item.Project?.stage || 'Unknown',
          sector: item.Project?.sub_sector || 'Unknown',
          location,
          center,
          companyType: item.Project?.company_type || 'Unknown',
          foundingTeamSize,
          femaleFounders,
          employees: parseNumeric(item.Team?.current_employees),
          annualRevenue,
          foundersGender,
          lat,
          lng
        };
      } catch (error) {
        console.error(`Error processing item at index ${index}:`, item, error);
        return null;
      }
    }).filter((s): s is Startup => s !== null);

    setStartups(parsedData);
    const sectors = [...new Set(parsedData.map(s => s.sector).filter(s => s && s !== 'Unknown' && s !== 'none' && s.trim() !== '' && s.trim() !== 'N/A'))].sort();
    setUniqueSectors(sectors);

    const stages = [...new Set(parsedData.map(s => s.stage).filter(Boolean))].sort();
    setUniqueStages(['All', ...stages]);

    const companyTypes = [...new Set(parsedData.map(s => s.companyType.toUpperCase()).filter(Boolean))].sort();
    setUniqueCompanyTypes(['All', ...companyTypes]);

  }, []);

  const [filters, setFilters] = useState<Filters>({
    location: '',
    revenueRange: 'All',
    employeeRange: 'All',
    sector: [],
    founderGender: 'All',
    stage: 'All',
    companyType: 'All',
  });

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredStartups = useMemo(() => {
    return startups.filter(startup => {
      const { location, revenueRange, employeeRange, sector, founderGender, stage, companyType } = filters;

      const lowerLocation = location.toLowerCase();
      if (location && !startup.location.toLowerCase().includes(lowerLocation) && !startup.center.toLowerCase().includes(lowerLocation)) {
        return false;
      }

      if (revenueRange !== 'All') {
        const range = REVENUE_RANGES_MAP[revenueRange];
        if (range && (startup.annualRevenue < range.min || startup.annualRevenue > range.max)) {
            return false;
        }
      }
      
      if (employeeRange !== 'All') {
        if (employeeRange.includes('+')) {
            const min = parseInt(employeeRange.replace('+', ''), 10);
            if (startup.employees < min) return false;
        } else {
            const [min, max] = employeeRange.split('-').map(Number);
            if (startup.employees < min || (max && startup.employees > max)) {
                return false;
            }
        }
      }

      if (sector.length > 0 && !sector.includes(startup.sector)) {
        return false;
      }

      if (founderGender !== 'All' && startup.foundersGender !== founderGender) {
        return false;
      }
      
      if (stage !== 'All' && startup.stage !== stage) {
          return false;
      }

      if (companyType !== 'All' && startup.companyType.toLowerCase() !== companyType.toLowerCase()) {
        return false;
      }


      return true;
    });
  }, [startups, filters]);

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans">
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        uniqueSectors={uniqueSectors}
        revenueRanges={REVENUE_RANGES}
        employeeRanges={EMPLOYEE_RANGES}
        founderGenders={FOUNDER_GENDERS}
        stages={uniqueStages}
        companyTypes={uniqueCompanyTypes}
        resultCount={filteredStartups.length}
      />
      <main className="flex-1 h-screen">
        <MapComponent startups={filteredStartups} />
      </main>
    </div>
  );
};

export default App;