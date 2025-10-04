import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import Radio from '@/components/core/radio/Radio';

type IRatingScaleProps<T extends FieldValues> = {
  question: string;
  leftLabel: string;
  rightLabel: string;
  name: Path<T>;
  control: Control<T>;
};

function RatingScale<T extends FieldValues>({
  question,
  leftLabel,
  rightLabel,
  name,
  control,
}: IRatingScaleProps<T>) {
  const {
    field: { name: fieldName, onChange, value },
  } = useController({
    name,
    control,
    rules: { required: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-black sm:text-lg">
        {question}
      </p>
      <div className="flex w-full items-end gap-4">
        <span className="grow text-right text-sm font-medium leading-4 text-primary-60">
          {leftLabel}
        </span>
        <Radio name={fieldName} value={value} onChange={onChange} className="flex grow-0 justify-center gap-[27px]">
          {[1, 2, 3, 4, 5].map(rating => (
            <Radio.Option key={rating} value={rating} className="flex-col-reverse">
              <Radio.Indicator checked={value === rating} />
              {rating}
            </Radio.Option>
          ))}
        </Radio>
        <span className="grow text-xs font-medium text-primary-60 sm:text-sm">
          {rightLabel}
        </span>
      </div>
    </div>
  );
}

export default RatingScale;
