import React from 'react';
import type { Filters } from '../types';

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  uniqueSectors: string[];
  revenueRanges: string[];
  employeeRanges: string[];
  founderGenders: (Filters['founderGender'])[];
  stages: string[];
  companyTypes: string[];
  resultCount: number;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-4 border-b border-gray-700">
    <h3 className="font-semibold text-lg text-gray-200 mb-3 px-4">{title}</h3>
    <div className="px-4 space-y-2">
      {children}
    </div>
  </div>
);

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  uniqueSectors,
  revenueRanges,
  employeeRanges,
  founderGenders,
  stages,
  companyTypes,
  resultCount
}) => {
  const handleSectorChange = (sector: string, isChecked: boolean) => {
    // Fix: Renamed `sectors` to `sector` to match the `Filters` type definition.
    const newSectors = isChecked
      ? [...filters.sector, sector]
      : filters.sector.filter(s => s !== sector);
    // Fix: Renamed `sectors` to `sector` to match the `Filters` type definition.
    onFilterChange({ sector: newSectors });
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-gray-800 text-white flex flex-col h-screen">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-400">Startup Map</h2>
        <p className="text-gray-400">Filter and explore the ecosystem.</p>
      </div>

      <div className="flex-grow overflow-y-auto">
        <FilterSection title="Location">
          <input
            type="text"
            placeholder="Search by city or governorate..."
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.location}
            onChange={e => onFilterChange({ location: e.target.value })}
          />
        </FilterSection>

        <FilterSection title="Company Stage">
          <select
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.stage}
            onChange={e => onFilterChange({ stage: e.target.value })}
          >
            {stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
          </select>
        </FilterSection>

        <FilterSection title="Company Type">
          <select
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.companyType}
            onChange={e => onFilterChange({ companyType: e.target.value })}
          >
            {companyTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </FilterSection>

        <FilterSection title="Annual Revenue">
          <select
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.revenueRange}
            onChange={e => onFilterChange({ revenueRange: e.target.value })}
          >
            {revenueRanges.map(range => <option key={range} value={range}>{range}</option>)}
          </select>
        </FilterSection>
        
        <FilterSection title="Employee Count">
          <select
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.employeeRange}
            onChange={e => onFilterChange({ employeeRange: e.target.value })}
          >
            {employeeRanges.map(range => <option key={range} value={range}>{range}</option>)}
          </select>
        </FilterSection>

        <FilterSection title="Founders' Gender">
          <div className="flex flex-wrap gap-2">
            {founderGenders.map(gender => (
              <button
                key={gender}
                onClick={() => onFilterChange({ founderGender: gender })}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filters.founderGender === gender
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Sectors">
          <div className="max-h-48 overflow-y-auto pr-2">
            {uniqueSectors.map(sector => (
              <label key={sector} className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 bg-gray-700 border-gray-600 rounded text-indigo-500 focus:ring-indigo-500"
                  // Fix: Renamed `sectors` to `sector` to match the `Filters` type definition.
                  checked={filters.sector.includes(sector)}
                  onChange={e => handleSectorChange(sector, e.target.checked)}
                />
                <span>{sector}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <p className="text-lg text-center font-semibold text-gray-300">
          Showing <span className="text-indigo-400">{resultCount}</span> startups
        </p>
      </div>
    </aside>
  );
};