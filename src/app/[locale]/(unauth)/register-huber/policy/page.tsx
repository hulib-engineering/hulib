'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AgreementCheckbox from '../_components/AgreementCheckbox';
// import FooterBar from '../_components/FooterBar';
import EmergencyNotice from '../_components/EmergencyNotice';
import ContinueButton from '../_components/ContinueButton';
import HeroBanner from '../_components/Herobanner';
import RulesGrid from '../_components/Rulesgrid';
import BackButton from '../_components/BackButton';
import RestrictedContent from '../_components/RestrictedContent';
import MobileSafetyWarning from '../_components/MobileSafetyWarning';

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
    <div
      className="flex flex-col gap-6
      sm:mb-8"
    >
      {/* PAGE HEADER */}
      <BackButton />

      {/* PAGE CONTENT */}
      <div className="flex flex-col
        gap-4 max-sm:max-h-[calc(100vh-120px)]
        max-sm:overflow-y-auto
        max-sm:pb-[180px] sm:gap-8 sm:px-24"
      >
        {/* Hero banner */}
        <HeroBanner />
        <MobileSafetyWarning />
        {/* Rules grid */}
        <RulesGrid />
        {/* Restricted content */}
        <RestrictedContent />

        {/*  Normal UI */}
        <div className="flex flex-col gap-4 max-sm:hidden">
          <AgreementCheckbox checked={agreed} onChange={setAgreed} />
          <div className="flex h-full items-center justify-between gap-4">
            <EmergencyNotice />
            <ContinueButton canContinue={agreed} onContinue={handleContinue} />
          </div>
        </div>

        {/*  Responsive mobile UI */}
        <div className="sm:hidden">
          <EmergencyNotice />
          <div
            className="fixed bottom-0 flex flex-col gap-2
            rounded-t-2xl bg-white
            px-4 py-3 shadow-[0_0_4px_rgba(15,15,16,0.06)]"
          >
            <AgreementCheckbox checked={agreed} onChange={setAgreed} />
            <ContinueButton canContinue={agreed} onContinue={handleContinue} />
          </div>
        </div>
      </div>
    </div>
  );
}
