'use client';

import { useTranslations } from 'next-intl';
import type { RuleCardData } from './Rulecard';
import RuleCard from './Rulecard';

export default function Rulesgrid() {
  const t = useTranslations('Huber');

  const CARDS: RuleCardData[] = [
    {
      iconBg: 'bg-[#CDDDFE]',
      icon: '/assets/images/register-huber/chat_text.png',
      title: t('rule_cards.card_1.title'),
      rules: t('rule_cards.card_1.rules'),
      size: 'small',
    },
    {
      iconBg: 'bg-[#FFE4F1]',
      icon: '/assets/images/register-huber/hand_heart.png',
      title: t('rule_cards.card_2.title'),
      rules: t('rule_cards.card_2.rules'),
    },
    {
      iconBg: 'bg-[#C9ECFF]',
      icon: '/assets/images/register-huber/finger_print.png',
      title: t('rule_cards.card_3.title'),
      rules: t('rule_cards.card_3.rules'),
    },
    {
      iconBg: 'bg-[#D9F9CF]',
      icon: '/assets/images/register-huber/shield_check_green.png',
      title: t('rule_cards.card_4.title'),
      rules: t('rule_cards.card_4.rules'),
    },
    {
      iconBg: 'bg-[#EEE4F7]',
      icon: '/assets/images/register-huber/hand_shake.png',
      title: t('rule_cards.card_5.title'),
      rules: t('rule_cards.card_5.rules'),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 max-sm:px-4 min-[405px]:grid-cols-2 lg:grid-cols-5">
      {CARDS.map((card, idx) => (
        <RuleCard key={idx} card={card} />
      ))}
    </div>
  );
}
