'use client';

import { useTranslations } from 'next-intl';

import type { LearningEntryFormValues, LiberAboutData, Topic, WorkEntryFormValues } from './type';
import LiberAboutSection from './LiberAboutSection';
import LiberLearningPathSection from './LiberLearningPathSection';
import LiberTopicsSection from './LiberTopicsSection';
import LiberWorkSection from './LiberWorkSection';

type LiberAboutPanelProps = {
  data?: LiberAboutData;
  editable?: boolean;
  huberFieldsEditable?: boolean;
  showTopics?: boolean;
  labels?: {
    journeyTitle: string;
    journeyPlaceholder: string;
    learningPathTitle: string;
    worksTitle: string;
    topicsTitle: string;
  };
  availableTopics?: Topic[];
  onSaveText?: (key: 'bio', value: string) => Promise<void> | void;
  onSaveLearningEntry?: (values: LearningEntryFormValues, editingId?: number | string) => Promise<void> | void;
  onSaveWorkEntry?: (values: WorkEntryFormValues, editingId?: number) => Promise<void> | void;
  onSaveTopics?: (topics: Topic[]) => Promise<void> | void;
};

export default function LiberAboutPanel({
  data,
  editable = false,
  huberFieldsEditable = editable,
  showTopics = false,
  labels,
  availableTopics,
  onSaveText,
  onSaveLearningEntry,
  onSaveWorkEntry,
  onSaveTopics,
}: LiberAboutPanelProps) {
  const t = useTranslations('MyProfile');

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
      <LiberAboutSection
        title={labels?.journeyTitle ?? t('liber_about.journey_title')}
        placeholder={labels?.journeyPlaceholder ?? t('liber_about.journey_placeholder')}
        value={data?.journey}
        editable={editable}
        onSave={value => onSaveText?.('bio', value)}
      />
      <LiberLearningPathSection
        title={labels?.learningPathTitle ?? t('liber_about.learning_path_title')}
        entries={data?.learningPath}
        editable={huberFieldsEditable}
        onSave={onSaveLearningEntry}
      />
      <LiberWorkSection
        title={labels?.worksTitle ?? t('liber_about.works_title')}
        entries={data?.works}
        editable={huberFieldsEditable}
        onSave={onSaveWorkEntry}
      />
      {showTopics && (
        <LiberTopicsSection
          title={labels?.topicsTitle ?? t('liber_about.topics_title')}
          topics={data?.topics}
          availableTopics={availableTopics}
          editable={false}
          onSave={onSaveTopics}
        />
      )}
    </div>
  );
}
