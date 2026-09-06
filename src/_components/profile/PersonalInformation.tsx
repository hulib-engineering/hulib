'use client';

// import { useTranslations } from 'next-intl';

// import type { LearningEntryFormValues, LiberAboutData, WorkEntryFormValues } from '../../features/users/types/profile';
// import Input from '@/components/core/input/Input';
import TextInput from '@/components/core/textInput/TextInput';

/* type LiberAboutPanelProps = {
  data?: LiberAboutData;
  editable?: boolean;
  showTopics?: boolean;
  availableTopics?: LiberAboutData['topics'];
  onSaveText?: (key: 'bio', value: string) => Promise<void> | void;
  onSaveLearningEntry?: (values: LearningEntryFormValues, editingId?: number | string) => Promise<void> | void;
  onSaveWorkEntry?: (values: WorkEntryFormValues, editingId?: number) => Promise<void> | void;
  onSaveTopics?: (topics: NonNullable<LiberAboutData['topics']>) => Promise<void> | void;
}; */

type CommonSectionProps = {
  label: string;
  type: string;
  placeholder: string;
  isMandatory: boolean;
};

const FIELDS = [
  { key: 'name', label: 'Họ và tên (bút danh)', isMandatory: true },
  { key: 'gender', label: 'Giới tính', isMandatory: true },
  { key: 'birthday', label: 'Ngày sinh', isMandatory: true },
  { key: 'address', label: 'Địa chỉ (không bắt buộc)', isMandatory: false },
  { key: 'email', label: 'Email', isMandatory: false },
  { key: 'phone', label: 'Số điện thoại (không bắt buộc)', isMandatory: false },
  { key: 'guardianEmail', label: 'Email giám hộ', isMandatory: false },
  { key: 'guardianPhone', label: 'Số điện thoại giám hộ', isMandatory: false },
];

function CommonSection({ label, type, placeholder, isMandatory }: CommonSectionProps) {
  /* rows={6}
        value={draft}
        placeholder={placeholder}
        onChange={e => setDraft(e.target.value)}
      */
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-primary-98 p-5">
      <TextInput
        label={(
          <p className="font-medium">
            {label}
            {isMandatory && <span className="font-normal text-red-50">*</span>}
          </p>
        )}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function PersonalInformation(/* {
  data,
  editable = false,
  showTopics = false,
  availableTopics = [],
  onSaveText,
  onSaveLearningEntry,
  onSaveWorkEntry,
  onSaveTopics,
}: any */) {
  // const t = useTranslations('MyProfile');

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white">
      {FIELDS.map(({ key, label, isMandatory }) => (
        <CommonSection
          key={key}
          label={label}
          type="text"
          placeholder="Đinh Cao Nguyên Quỳnh"
          isMandatory={isMandatory}
        />
      ))}
    </div>
  );
}
