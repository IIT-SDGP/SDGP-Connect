// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

interface CompetitionSuccessPageProps {
  competitionName: string;
}

const CompetitionSuccessPage: React.FC<CompetitionSuccessPageProps> = ({ competitionName }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-10">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-4">
          Competition Submitted Successfully!
        </h1>
        <p className="text-muted-foreground mb-6">
          Your competition "{competitionName}" has been submitted and is now under review. 
          You will be notified once it's approved.
        </p>
        <p className="text-sm text-muted-foreground">
          Redirecting to home page in 5 seconds...
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Go to Home Now
        </button>
      </div>
    </div>
  );
};

export default CompetitionSuccessPage;
