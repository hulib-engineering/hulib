'use client';
import Image from 'next/image';

export type RuleCardData = {
  icon: string;
  iconBg: string;
  title: string;
  rules: string;
  size?: 'small' | 'medium';
};

// function RuleItem({ type, text }: RuleItemProps) {
//   return (
//     <li className="flex items-start gap-2 text-sm text-gray-600 leading-snug">
//       {type === 'allow' ? (
//         <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
//           <svg className="w-2.5 h-2.5 text-green-500" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l2.5 2.5L9 1" />
//           </svg>
//         </span>
//       ) : (
//         <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 border-red-400 flex items-center justify-center">
//           <svg className="w-2.5 h-2.5 text-red-400" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" d="M2 2l6 6M8 2l-6 6" />
//           </svg>
//         </span>
//       )}
//       <span>{text}</span>
//     </li>
//   );
// }

type RuleCardProps = {
  card: RuleCardData;
};

export default function Rulecard({ card }: RuleCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#CDDDFE] bg-white px-[20px] py-[30px]">
      <div className="mb-4 flex flex-row items-center justify-center gap-3 ">
        <div className={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full ${card.iconBg}`}>
          {card.size === 'small' ? (
            <Image src={card.icon} alt="icon" width={24} height={24} />
          ) : (
            <Image src={card.icon} alt="icon" width={32} height={32} />
          )}
        </div>
        <h3 className="pt-0.5 text-[16px] font-semibold leading-snug text-gray-800">{card.title}</h3>
      </div>
      {/* <ul className="flex flex-col gap-2.5">
        {card.rules.map((rule, idx) => (
          <RuleItem key={idx} type={rule.type} text={rule.text} />
        ))}
      </ul> */}
      <p className="text-[14px] leading-[22px] tracking-[1.5%] text-[#171819]">{card.rules}</p>
    </div>
  );
}
