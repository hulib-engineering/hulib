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
      <p className="text-[16px] text-black xxl:text-[18px]">
        {question}
      </p>
      {/* Below 1440px: radios on top, labels under them. From 1440px: labels beside the radios */}
      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2 xxl:flex xxl:items-end">
        <Radio name={fieldName} value={value} onChange={onChange} className="col-span-2 row-start-1 flex justify-between xxl:order-2 xxl:grow-0 xxl:justify-center xxl:gap-[27px]">
          {[1, 2, 3, 4, 5].map(rating => (
            <Radio.Option key={rating} value={rating} className="flex-col-reverse text-[16px]">
              <Radio.Indicator checked={value === rating} />
              {rating}
            </Radio.Option>
          ))}
        </Radio>
        <span className="col-start-1 row-start-2 text-left text-[14px] font-medium leading-4 text-primary-60 xxl:order-1 xxl:grow xxl:text-right xxl:text-[16px]">
          {leftLabel}
        </span>
        <span className="col-start-2 row-start-2 text-right text-[14px] font-medium text-primary-60 xxl:order-3 xxl:grow xxl:text-[16px]">
          {rightLabel}
        </span>
      </div>
    </div>
  );
}

export default RatingScale;
