import React, { useState } from 'react';
import { Flame, Layers, MapPin, Building2, Briefcase } from 'lucide-react';
import { Company, Opportunity } from '../types';

interface OpportunityHeatmapViewProps {
  companies: Company[];
  opportunities: Opportunity[];
  onSelectCompany: (company: Company) => void;
}

export const OpportunityHeatmapView: React.FC<OpportunityHeatmapViewProps> = ({
  companies,
  opportunities,
  onSelectCompany
}) => {
  const [densityCategory, setDensityCategory] = useState<'all' | 'internships' | 'hiring' | 'startups' | 'enterprise'>('all');

  const filtered = companies.filter((c) => {
    if (densityCategory === 'internships') return c.hiringStatus === 'internship';
    if (densityCategory === 'hiring') return c.hiringStatus === 'hiring';
    if (densityCategory === 'startups') return c.companyType === 'Startup';
    if (densityCategory === 'enterprise') return c.companyType === 'MNC';
    return true;
  });

  return (
    <div id="opportunity-heatmap-view" className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header & Controls */}
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Flame className="w-4 h-4" />
            <span>OPPORTUNITY DENSITY MATRIX</span>
          </div>
          <h2 className="font-display font-bold text-white text-xl">
            Regional Opportunity Heatmap
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Spatial distribution computed from verified physical campuses and live role openings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#0F172A] p-1 rounded-lg border border-[#1E293B] text-xs">
          {[
            { id: 'all', label: 'All Opportunities' },
            { id: 'internships', label: 'Internships Only' },
            { id: 'hiring', label: 'Verified Hiring' },
            { id: 'startups', label: 'Startups' },
            { id: 'enterprise', label: 'Enterprise MNC' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setDensityCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                densityCategory === cat.id
                  ? 'bg-[#1E293B] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Density Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((company, idx) => {
          const densityScore = Math.max(
            20,
            (company.verifiedOpeningsCount || 0) * 35 +
              (company.verifiedInternshipsCount || 0) * 25 +
              (company.companyType === 'MNC' ? 20 : 10)
          );

          return (
            <div
              key={company.placeId}
              onClick={() => onSelectCompany(company)}
              className="bg-[#0B0F17] border border-[#1E293B] hover:border-amber-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 group relative overflow-hidden shadow-lg"
            >
              {/* Density glow backdrop */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity duration-300"
                style={{
                  background:
                    densityScore > 60
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(56, 189, 248, 0.1)'
                }}
              />

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#00F0FF]">
                    {company.businessType}
                  </span>
                  <h4 className="font-display font-bold text-white text-base mt-2 group-hover:text-amber-300 transition-colors">
                    {company.name}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs text-amber-400 font-bold">
                    {densityScore}%
                  </span>
                  <span className="text-[9px] block text-[#64748B]">Density Index</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#94A3B8]">
                <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                <span className="truncate">{company.address}</span>
              </div>

              {/* Density progress meter */}
              <div className="mt-4 pt-3 border-t border-[#1E293B]">
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mb-1">
                  <span>Hiring & Opportunity Concentration</span>
                  <span className="font-mono text-white">
                    {(company.verifiedOpeningsCount || 0) + (company.verifiedInternshipsCount || 0)} active posts
                  </span>
                </div>
                <div className="w-full bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, densityScore)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
