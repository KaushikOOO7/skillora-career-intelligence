import React from 'react';
import { X, Building2, MapPin, Briefcase, GraduationCap, Code, BookOpen } from 'lucide-react';
import { Company } from '../types';

interface CompanyComparisonModalProps {
  companies: Company[];
  onClose: () => void;
  onRemoveCompany: (placeId: string) => void;
}

export const CompanyComparisonModal: React.FC<CompanyComparisonModalProps> = ({
  companies,
  onClose,
  onRemoveCompany
}) => {
  if (companies.length === 0) return null;

  return (
    <div id="company-comparison-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-base">Company Factual Comparison</h3>
            <p className="text-xs text-[#64748B]">Comparing {companies.length} of 3 selected employers</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded bg-[#1E293B] text-[#94A3B8] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Table Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {companies.map((company) => (
              <div
                key={company.placeId}
                className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#00F0FF]">
                      {company.businessType}
                    </span>
                    <button
                      onClick={() => onRemoveCompany(company.placeId)}
                      className="text-xs text-[#64748B] hover:text-rose-400"
                    >
                      Remove
                    </button>
                  </div>
                  <h4 className="font-display font-bold text-white text-base mt-2">{company.name}</h4>
                  <div className="text-xs text-[#94A3B8] mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{company.address}</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs border-t border-[#1E293B] pt-3 text-[#94A3B8]">
                  <div className="flex items-center justify-between">
                    <span>Distance:</span>
                    <span className="font-mono text-[#38BDF8]">{company.distanceKm} km away</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Company Type:</span>
                    <span className="text-white">{company.companyType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hiring Status:</span>
                    <span className="text-emerald-400 capitalize">{company.hiringStatus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Verified Openings:</span>
                    <span className="font-mono text-white">{company.verifiedOpeningsCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Verified Internships:</span>
                    <span className="font-mono text-[#38BDF8]">{company.verifiedInternshipsCount || 0}</span>
                  </div>
                  <div className="pt-2 border-t border-[#1E293B]">
                    <span className="text-[10px] font-mono uppercase text-[#64748B] block mb-1">Workforce</span>
                    <span className="text-xs text-white">{company.employeeCount || 'Verified Enterprise Campus'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
