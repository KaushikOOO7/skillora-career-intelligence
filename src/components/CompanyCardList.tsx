import React from 'react';
import { 
  Building2, 
  MapPin, 
  Bookmark, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  Briefcase,
  Compass
} from 'lucide-react';
import { Company } from '../types';

interface CompanyCardListProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
  savedCompanyIds: string[];
  onToggleSaveCompany: (companyId: string) => void;
  onCompareCompany?: (company: Company) => void;
  comparedCompanyIds?: string[];
}

export const CompanyCardList: React.FC<CompanyCardListProps> = ({
  companies,
  selectedCompany,
  onSelectCompany,
  savedCompanyIds,
  onToggleSaveCompany,
  onCompareCompany,
  comparedCompanyIds = []
}) => {
  if (companies.length === 0) {
    return (
      <div id="no-companies-placeholder" className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-8 text-center text-[#94A3B8]">
        <Compass className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
        <h4 className="font-display font-semibold text-white text-sm">No companies match current filters</h4>
        <p className="text-xs text-[#64748B] mt-1">Try expanding your search radius or selecting other categories.</p>
      </div>
    );
  }

  return (
    <div id="companies-nearby-shelf" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-white text-sm sm:text-base flex items-center gap-2">
            <span>Discovered Companies</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#00F0FF] border border-[#334155]">
              {companies.length} nearby
            </span>
          </h3>
          <p className="text-xs text-[#64748B]">Real business places discovered around your coordinates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {companies.map((company) => {
          const isSelected = selectedCompany?.placeId === company.placeId;
          const isSaved = savedCompanyIds.includes(company.placeId);
          const isCompared = comparedCompanyIds.includes(company.placeId);
          const isHiring = company.hiringStatus === 'hiring';
          const isInternship = company.hiringStatus === 'internship';

          return (
            <div
              key={company.placeId}
              id={`company-card-${company.placeId}`}
              className={`bg-[#0B0F17] border rounded-lg p-3.5 flex flex-col justify-between transition-all duration-200 hover:border-[#334155] ${
                isSelected
                  ? 'border-[#00F0FF] ring-1 ring-[#00F0FF]/30 bg-[#0F172A]'
                  : 'border-[#1E293B]'
              }`}
            >
              <div>
                {/* Top badges & Save */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
                      {company.businessType}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0F172A] text-[#64748B] border border-[#1E293B]">
                      {company.companyType}
                    </span>
                  </div>

                  <button
                    id={`save-company-btn-${company.placeId}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveCompany(company.placeId);
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      isSaved
                        ? 'text-[#00F0FF] bg-[#00F0FF]/10'
                        : 'text-[#64748B] hover:text-white hover:bg-[#1E293B]'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save Company'}
                  >
                    <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Company Name */}
                <h4
                  onClick={() => onSelectCompany(company)}
                  className="font-display font-bold text-white text-sm mt-2 hover:text-[#00F0FF] cursor-pointer line-clamp-1 transition-colors"
                >
                  {company.name}
                </h4>

                {/* Address & Distance */}
                <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mt-1">
                  <MapPin className="w-3 h-3 text-[#64748B] shrink-0" />
                  <span className="truncate">{company.address}</span>
                </div>

                {/* Distance readout */}
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[#38BDF8] bg-[#0F172A] px-2 py-0.5 rounded border border-[#1E293B]">
                    {company.distanceKm !== undefined ? `${company.distanceKm} km away` : 'Nearby'}
                  </span>

                  {/* Hiring Status Indicator */}
                  {isHiring ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Hiring Verified
                    </span>
                  ) : isInternship ? (
                    <span className="flex items-center gap-1 text-[#38BDF8] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                      Internships
                    </span>
                  ) : (
                    <span className="text-[#64748B]">Verified Hub</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2.5 border-t border-[#1E293B] flex items-center justify-between gap-2">
                {onCompareCompany && (
                  <button
                    id={`compare-company-btn-${company.placeId}`}
                    onClick={() => onCompareCompany(company)}
                    className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                      isCompared
                        ? 'bg-[#1E293B] border-amber-500 text-amber-300 font-medium'
                        : 'border-[#1E293B] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {isCompared ? 'Comparing' : '+ Compare'}
                  </button>
                )}

                <button
                  id={`view-company-details-btn-${company.placeId}`}
                  onClick={() => onSelectCompany(company)}
                  className="ml-auto text-xs font-medium text-[#00F0FF] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
