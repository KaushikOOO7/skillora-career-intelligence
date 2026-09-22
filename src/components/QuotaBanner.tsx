import React, { useEffect, useState } from 'react';

export const QuotaBanner: React.FC = () => {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaError = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaError);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaError);
  }, []);

  if (!quotaExceeded) return null;

  return (
    <div
      id="quota-exceeded-banner"
      className="bg-amber-950/90 border-b border-amber-500/40 text-amber-200 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 backdrop-blur-md shadow-lg flex items-center justify-center gap-2"
    >
      <span>
        Google Maps Platform quota reached. If you are the app owner, visit{' '}
        <a
          href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-amber-100 hover:text-white transition-colors"
        >
          maps developer site
        </a>{' '}
        for instructions to update your account.
      </span>
      <button
        id="dismiss-quota-banner-btn"
        onClick={() => setQuotaExceeded(false)}
        className="ml-3 text-amber-300 hover:text-white font-bold text-xs px-2 py-0.5 rounded border border-amber-500/30"
      >
        Dismiss
      </button>
    </div>
  );
};
