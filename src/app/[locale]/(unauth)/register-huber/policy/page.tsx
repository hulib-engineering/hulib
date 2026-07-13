'use client';

import { useState } from 'react';
import AgreementCheckbox from '../_components/AgreementCheckbox';
import FooterBar from '../_components/FooterBar';
import HeroBanner from '../_components/Herobanner';
import RulesGrid from '../_components/Rulesgrid';
import BackButton from '../_components/BackButton';
import RestrictedContent from '../_components/RestrictedContent';
import { useRouter } from '@/libs/i18nNavigation';

export default function RegisterAsHuberPage() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const handleContinue = () => {
    if (!agreed) {
      return;
    }
    router.push('/register-huber/create-book');
  };

  return (
    <div className="min-h-screen bg-white pb-[60px]">
      <div className="">
        {/* Page header */}
        <BackButton />

        <div className="px-[96px]">
          {/* Hero banner */}
          <HeroBanner />

          {/* Rules grid */}
          <RulesGrid />
          <RestrictedContent />
          {/* Agreement checkbox */}
          <AgreementCheckbox checked={agreed} onChange={setAgreed} />

          {/* Footer bar */}
          <FooterBar canContinue={agreed} onContinue={handleContinue} />
        </div>
      </div>
    </div>
  );
}
