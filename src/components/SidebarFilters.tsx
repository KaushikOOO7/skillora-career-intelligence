import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Building2, 
  Briefcase, 
  Code, 
  MapPin,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { 
  FilterState, 
  CompanyCategory, 
  CompanyType, 
  OpportunityType,
  Company,
  Opportunity 
} from '../types';

interface SidebarFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  companies: Company[];
  opportunities: Opportunity[];
  onSelectCompany: (company: Company) => void;
  onSelectOpportunity: (opportunity: Opportunity) => void;
}

const DISTANCE_OPTIONS = [5, 10, 25, 50, 100];
const OPPORTUNITY_TYPES: OpportunityType[] = ['Internship', 'Full-time', 'Fresher', 'Experienced', 'Remote'];
const INDUSTRIES: CompanyCategory[] = [
  'Software',
  'AI/ML',
  'Automotive',
  'FinTech',
  'Semiconductor',
  'Robotics',
  'Cybersecurity',
  'IT Services',
  'Research'
];
const COMPANY_TYPES: CompanyType[] = ['Startup', 'MNC', 'Product', 'Service', 'Research'];

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  companies,
  opportunities,
  onSelectCompany,
  onSelectOpportunity
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Categorized Search Suggestions
  const query = filters.searchQuery.trim().toLowerCase();
  const matchedCompanies = query
    ? companies.filter((c) => c.name.toLowerCase().includes(query)).slice(0, 3)
    : [];
  const matchedOpportunities = query
    ? opportunities.filter((o) => o.title.toLowerCase().includes(query) || o.companyName.toLowerCase().includes(query)).slice(0, 3)
    : [];
  const matchedSkills = query
    ? Array.from(new Set(opportunities.flatMap((o) => o.skills).filter((s) => s.toLowerCase().includes(query)))).slice(0, 4)
    : [];

  const handleToggleOpportunityType = (type: OpportunityType) => {
    const exists = filters.opportunityTypes.includes(type);
    const updated = exists
      ? filters.opportunityTypes.filter((t) => t !== type)
      : [...filters.opportunityTypes, type];
    onFilterChange({ ...filters, opportunityTypes: updated });
  };

  const handleToggleIndustry = (ind: CompanyCategory) => {
    const exists = filters.industries.includes(ind);
    const updated = exists
      ? filters.industries.filter((i) => i !== ind)
      : [...filters.industries, ind];
    onFilterChange({ ...filters, industries: updated });
  };

  const handleToggleCompanyType = (ctype: CompanyType) => {
    const exists = filters.companyTypes.includes(ctype);
    const updated = exists
      ? filters.companyTypes.filter((t) => t !== ctype)
      : [...filters.companyTypes, ctype];
    onFilterChange({ ...filters, companyTypes: updated });
  };

  return (
    <div id="skillora-sidebar-filters" className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3 text-xs flex flex-col gap-3.5 shadow-lg">
      {/* Global Categorized Search */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => {
              onFilterChange({ ...filters, searchQuery: e.target.value });
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Search companies, roles, skills..."
            className="w-full pl-8 pr-7 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white placeholder-[#64748B] text-xs focus:outline-none focus:border-[#00F0FF] transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => {
                onFilterChange({ ...filters, searchQuery: '' });
                setShowSearchDropdown(false);
              }}
              className="absolute right-2 text-[#64748B] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categorized Live Search Results Dropdown */}
        {showSearchDropdown && query && (
          <div
            id="search-categorized-dropdown"
            className="absolute top-full left-0 right-0 mt-1 bg-[#0F172A] border border-[#1E293B] rounded-lg shadow-2xl z-50 p-2 max-h-72 overflow-y-auto"
          >
            {matchedCompanies.length === 0 &&
              matchedOpportunities.length === 0 &&
              matchedSkills.length === 0 && (
                <div className="p-3 text-center text-[#64748B]">No matching items found.</div>
              )}

            {matchedCompanies.length > 0 && (
              <div className="mb-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] px-2 py-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#38BDF8]" />
                  <span>Companies</span>
                </div>
                {matchedCompanies.map((c) => (
                  <div
                    key={c.placeId}
                    onClick={() => {
                      onSelectCompany(c);
                      setShowSearchDropdown(false);
                    }}
                    className="px-2 py-1.5 hover:bg-[#1E293B] rounded cursor-pointer flex items-center justify-between text-white"
                  >
                    <span className="font-medium truncate">{c.name}</span>
                    <span className="text-[10px] text-[#64748B]">{c.distanceKm} km</span>
                  </div>
                ))}
              </div>
            )}

            {matchedOpportunities.length > 0 && (
              <div className="mb-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] px-2 py-0.5 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-emerald-400" />
                  <span>Opportunities</span>
                </div>
                {matchedOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    onClick={() => {
                      onSelectOpportunity(opp);
                      setShowSearchDropdown(false);
                    }}
                    className="px-2 py-1.5 hover:bg-[#1E293B] rounded cursor-pointer text-white"
                  >
                    <div className="font-medium truncate">{opp.title}</div>
                    <div className="text-[10px] text-[#94A3B8] flex items-center gap-1.5">
                      <span>{opp.companyName}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{opp.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {matchedSkills.length > 0 && (
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] px-2 py-0.5 flex items-center gap-1">
                  <Code className="w-3 h-3 text-amber-400" />
                  <span>Skills</span>
                </div>
                <div className="flex flex-wrap gap-1 px-1 py-1">
                  {matchedSkills.map((sk) => (
                    <button
                      key={sk}
                      onClick={() => {
                        onFilterChange({ ...filters, searchQuery: sk });
                        setShowSearchDropdown(false);
                      }}
                      className="px-2 py-0.5 rounded bg-[#1E293B] text-[11px] text-[#E2E8F0] hover:bg-[#334155]"
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Accordion Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-1.5 font-display font-semibold text-[#E2E8F0] hover:text-white"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>Filters</span>
          {filtersOpen ? <ChevronUp className="w-3 h-3 text-[#64748B]" /> : <ChevronDown className="w-3 h-3 text-[#64748B]" />}
        </button>

        <button
          id="reset-filters-btn"
          onClick={onResetFilters}
          className="flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-white transition-colors"
          title="Reset all filter options"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {filtersOpen && (
        <div className="flex flex-col gap-3">
          {/* Distance Filter */}
          <div>
            <div className="flex items-center justify-between text-[#94A3B8] mb-1.5">
              <span>Max Distance</span>
              <span className="font-mono text-white font-medium">{filters.maxDistanceKm} km</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {DISTANCE_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => onFilterChange({ ...filters, maxDistanceKm: d })}
                  className={`py-1 rounded text-center text-[10px] font-mono border transition-all ${
                    filters.maxDistanceKm === d
                      ? 'bg-[#1E293B] border-[#00F0FF] text-white font-semibold'
                      : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:border-[#334155]'
                  }`}
                >
                  {d}km
                </button>
              ))}
            </div>
          </div>

          {/* Opportunity Types */}
          <div>
            <div className="text-[#94A3B8] mb-1.5">Opportunity Type</div>
            <div className="flex flex-wrap gap-1">
              {OPPORTUNITY_TYPES.map((type) => {
                const active = filters.opportunityTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => handleToggleOpportunityType(type)}
                    className={`px-2 py-0.5 rounded text-[11px] border transition-all ${
                      active
                        ? 'bg-[#1E293B] border-emerald-500 text-emerald-300 font-medium'
                        : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:border-[#334155]'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Industries */}
          <div>
            <div className="text-[#94A3B8] mb-1.5">Industry / Field</div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {INDUSTRIES.map((ind) => {
                const active = filters.industries.includes(ind);
                return (
                  <button
                    key={ind}
                    onClick={() => handleToggleIndustry(ind)}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                      active
                        ? 'bg-[#1E293B] border-[#38BDF8] text-[#38BDF8] font-medium'
                        : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:border-[#334155]'
                    }`}
                  >
                    {ind}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Company Types */}
          <div>
            <div className="text-[#94A3B8] mb-1.5">Company Type</div>
            <div className="flex flex-wrap gap-1">
              {COMPANY_TYPES.map((ctype) => {
                const active = filters.companyTypes.includes(ctype);
                return (
                  <button
                    key={ctype}
                    onClick={() => handleToggleCompanyType(ctype)}
                    className={`px-2 py-0.5 rounded text-[11px] border transition-all ${
                      active
                        ? 'bg-[#1E293B] border-[#A855F7] text-[#C084FC] font-medium'
                        : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:border-[#334155]'
                    }`}
                  >
                    {ctype}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
