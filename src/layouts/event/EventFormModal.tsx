'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from '@phosphor-icons/react';
import React, { type ReactNode } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import { useController, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useTranslations } from 'next-intl';
import Button from '@/components/core/button/Button';
import Form from '@/components/core/form/Form';
import Label from '@/components/Label';
import Modal from '@/components/Modal';
import { mergeClassnames } from '@/components/core/private/utils';
import Radio from '@/components/core/radio/Radio';
import TextInput from '@/components/core/textInput/TextInput';
import { EmailRegistrationValidation } from '@/validations/EventRegistrationValidation';

type IEventRegistration = Omit<
  z.infer<typeof EmailRegistrationValidation>,
  'transferBill'
> & {
  transferBill?: File;
};

type AmbassadorKey = 'no' | 'yes';

type RadioGroupProps = {
  id?: string;
  label?: ReactNode;
  isError?: boolean;
  dir?: 'ltr' | 'rtl' | 'auto';
};

const RadioGroup = ({
  id,
  name,
  label,
  dir,
  isError,
  options,
  labelClassname,
  optionsClassname,
  isVertical,
  control,
}: {
  options: { label: string; value: string }[];
  labelClassname?: string;
  optionsClassname?: string;
  isVertical?: boolean;
} & RadioGroupProps &
UseControllerProps<
  Omit<z.infer<typeof EmailRegistrationValidation>, 'transferBill'>
>) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  });

  return (
    <>
      {label && (
        <Label dir={dir} htmlFor={id} className={labelClassname}>
          {label}
        </Label>
      )}
      <Radio
        name={name}
        value={value}
        onChange={onChange}
        className={mergeClassnames(
          'flex flex-row gap-12',
          optionsClassname,
          isVertical && 'flex-col gap-0',
        )}
      >
        {options.map(option => (
          <Radio.Option
            key={option.value}
            value={option.value}
            className="py-2"
          >
            <Radio.Indicator
              checked={value === option.value}
              isError={isError}
            />
            {option.label}
          </Radio.Option>
        ))}
      </Radio>
    </>
  );
};

const SocialMedia = [
  { value: 'Instagram', labelKey: 'instagram' },
  { value: 'Facebook', labelKey: 'facebook' },
  { value: 'Tiktok', labelKey: 'tiktok' },
  { value: 'Threads', labelKey: 'threads' },
  { value: 'Other', labelKey: 'other' },
];

const Careers = [
  { value: 'HighSchoolStudent', labelKey: 'high_school_student' },
  { value: 'Student', labelKey: 'student' },
  { value: 'GapYear', labelKey: 'gap_year' },
  { value: 'Working', labelKey: 'working' },
  { value: 'Other', labelKey: 'other' },
];

const Hometowns = [
  { value: 'Hue', labelKey: 'hue' },
  { value: 'DaNang', labelKey: 'danang' },
  { value: 'HoChiMinh', labelKey: 'hochiminh' },
  { value: 'Hanoi', labelKey: 'hanoi' },
  { value: 'Other', labelKey: 'other' },
];

const Choices = [
  { value: 'Family', labelKey: 'family' },
  { value: 'Coworker', labelKey: 'coworker' },
  { value: 'Friendship', labelKey: 'friendship' },
  { value: 'Love', labelKey: 'love' },
];

const BecomingAmbassador: {
  value: string;
  labelKey: AmbassadorKey;
}[] = [
  { value: 'No', labelKey: 'no' },
  { value: 'Yes', labelKey: 'yes' },
];

export type IEventFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (registererName: string) => void;
};

const EventFormModal = (props: IEventFormModalProps) => {
  const t = useTranslations('event');
  const form = useForm<IEventRegistration>({
    resolver: zodResolver(EmailRegistrationValidation),
    defaultValues: {
      fullname: '',
      email: '',
      socialMedia: '',
      career: '',
      hometown: '',
      firstChoice: '',
      secondChoice: '',
      question: '',
      transferBill: undefined,
      transferInfo: '',
      willingToBecomeAmbassador: '',
    },
  });

  // const billUploader = useRef<HTMLInputElement>(null);
  // const { ref: billUploaderRef, ...rest } = form.register('transferBill');

  // const toBase64 = (file: File) => {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader();
  //
  //     fileReader.readAsDataURL(file);
  //
  //     fileReader.onload = () => {
  //       resolve(fileReader.result);
  //     };
  //
  //     fileReader.onerror = (error) => {
  //       reject(error);
  //     };
  //   });
  // };

  const handleSubmit = form.handleSubmit(async (data) => {
    // let imageUrl = '';
    // if (
    //   data.transferBill &&
    //   data.transferBill instanceof File &&
    //   data.transferBill?.name
    // ) {
    //   const base64TransferBill = await toBase64(data.transferBill);
    //
    //   const uploadingImageRes = await fetch(`/api/sign-cloudinary-params`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ transferBill: base64TransferBill }),
    //   });
    //   const responseJson = await uploadingImageRes.json();
    //   imageUrl = responseJson.imageURL;
    // }

    const result = await fetch(`/api/sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        transferBill: '',
      }),
    });

    if (result.status) {
      form.reset();
      props.onClose();
      props.onSuccess(data.fullname);
    }
  });

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-full px-4 lg:min-w-[345px] 2xl:w-7/12 2xl:min-w-[960px] 2xl:px-0">
        <div className="flex h-5/6 w-full flex-col items-center justify-center rounded-[20px] bg-white">
          <div className="inline-flex w-full items-center justify-start gap-6 border-b border-solid border-neutral-90 p-4 lg:justify-between lg:p-8">
            <h4 className="text-[28px] font-medium leading-9 text-neutral-10">
              {t('event_registration_title')}
            </h4>
            <button type="button" onClick={props.onClose}>
              <X size={24} color="#343330" />
            </button>
          </div>
          <div className="custom-scrollbar flex h-[50rem] min-h-[25.5rem] w-full flex-col items-center justify-start gap-6 overflow-y-scroll scroll-smooth">
            <Form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-5 px-4 py-5 lg:gap-6 lg:p-8"
            >
              <Form.Item className="flex flex-col gap-5 lg:flex-row lg:gap-6">
                <fieldset className="w-full">
                  <TextInput
                    id="fullname"
                    type="text"
                    label={t('fullname_label')}
                    placeholder={t('fullname_placeholder')}
                    {...form.register('fullname')}
                    isError={!!form.formState.errors.fullname}
                    hintText={form.formState.errors.fullname?.message}
                  />
                </fieldset>
                <fieldset className="w-full">
                  <TextInput
                    id="birthday"
                    type="date"
                    label={t('birthday_label')}
                    {...form.register('birthday')}
                    isError={!!form.formState.errors.birthday}
                    hintText={form.formState.errors.birthday?.message}
                  />
                </fieldset>
              </Form.Item>
              <Form.Item>
                <TextInput
                  id="email"
                  type="email"
                  label={t('email_label')}
                  placeholder="Hulibvietnamabc@gmail.com"
                  {...form.register('email')}
                  isError={!!form.formState.errors.email}
                  hintText={form.formState.errors.email?.message}
                />
              </Form.Item>
              <Form.Item>
                <RadioGroup
                  name="socialMedia"
                  label={t('social_media_label')}
                  options={SocialMedia.map(item => ({
                    value: item.value,
                    label: t(`social_media.${item.labelKey}` as any),
                  }))}
                  control={form.control}
                  isError={!!form.formState.errors.socialMedia}
                  optionsClassname="flex flex-col gap-0 lg:flex-row lg:gap-12"
                />
              </Form.Item>
              <Form.Item>
                <RadioGroup
                  name="career"
                  label={t('career_label')}
                  options={Careers.map(item => ({
                    value: item.value,
                    label: t(`career.${item.labelKey}` as any),
                  }))}
                  control={form.control}
                  isError={!!form.formState.errors.career}
                  optionsClassname="flex flex-col gap-0 lg:flex-row lg:gap-12"
                />
              </Form.Item>
              <Form.Item>
                <RadioGroup
                  name="hometown"
                  label={t('hometown_label')}
                  options={Hometowns.map(item => ({
                    value: item.value,
                    label: t(`hometown.${item.labelKey}` as any),
                  }))}
                  control={form.control}
                  isError={!!form.formState.errors.hometown}
                  optionsClassname="flex flex-col gap-0 lg:flex-row lg:gap-12"
                />
              </Form.Item>
              <Form.Item>
                <RadioGroup
                  name="firstChoice"
                  label={t('first_choice_label')}
                  options={Choices.map(item => ({
                    value: item.value,
                    label: t(`choice.${item.labelKey}` as any),
                  }))}
                  isVertical
                  control={form.control}
                  isError={!!form.formState.errors.firstChoice}
                />
              </Form.Item>
              <Form.Item>
                <RadioGroup
                  name="secondChoice"
                  label={t('second_choice_label')}
                  options={Choices.map(item => ({
                    value: item.value,
                    label: t(`choice.${item.labelKey}` as any),
                  }))}
                  isVertical
                  control={form.control}
                  isError={!!form.formState.errors.secondChoice}
                />
              </Form.Item>
              <Form.Item>
                <TextInput
                  id="question"
                  type="text"
                  label={t('question_label')}
                  placeholder={t('question_placeholder')}
                  {...form.register('question')}
                  isError={!!form.formState.errors.question}
                  hintText={form.formState.errors.question?.message}
                />
              </Form.Item>
              {/* <Form.Item className="flex flex-col gap-2"> */}
              {/*  <Image */}
              {/*    alt="Transfer QR Code" */}
              {/*    src="/assets/images/account-info.jpeg" */}
              {/*    priority */}
              {/*    width={250} */}
              {/*    height={250} */}
              {/*    className="object-contain" */}
              {/*  /> */}
              {/*  <Label htmlFor="transferBill"> */}
              {/*    Để tham gia chương trình bạn cần đặt cọc trước 50K phí tham */}
              {/*    dự, BTC sẽ chuyển khoản lại cho bạn sau khi sự kiện kết thúc. */}
              {/*    Vì vậy vui lòng đính kèm hình ảnh chứng minh đã chuyển khoản. */}
              {/*  </Label> */}
              {/*  <input */}
              {/*    id="transferBill" */}
              {/*    type="file" */}
              {/*    accept="image/*" */}
              {/*    hidden */}
              {/*    {...rest} */}
              {/*    ref={(e) => { */}
              {/*      billUploaderRef(e); */}
              {/*      if (e) { */}
              {/*        // @ts-ignore */}
              {/*        billUploader.current = e; */}
              {/*      } // you can still assign to ref */}
              {/*    }} */}
              {/*    onChange={(event) => */}
              {/*      event.target.files && */}
              {/*      event.target.files.length > 0 && */}
              {/*      form.setValue( */}
              {/*        'transferBill', */}
              {/*        event.target.files[0] ?? undefined, */}
              {/*        { shouldValidate: true }, */}
              {/*      ) */}
              {/*    } */}
              {/*  /> */}
              {/*  <div className="flex justify-start"> */}
              {/*    <Button */}
              {/*      type="button" */}
              {/*      variant="outline" */}
              {/*      iconLeft={<Upload size={24} color="#0442bf" />} */}
              {/*      onClick={() => */}
              {/*        billUploader && */}
              {/*        billUploader?.current && */}
              {/*        billUploader?.current?.click() */}
              {/*      } */}
              {/*    > */}
              {/*      Thêm tệp */}
              {/*    </Button> */}
              {/*  </div> */}
              {/*  {!form.formState.errors.transferBill && */}
              {/*  form.watch('transferBill') && */}
              {/*  form.watch('transferBill') instanceof File && */}
              {/*  form.watch('transferBill')?.name ? ( */}
              {/*    <div className="flex items-center gap-1 pl-2"> */}
              {/*      <ImageIcon size={20} color="#0442bf" /> */}
              {/*      <p className="truncate text-sm font-medium leading-4 text-primary-50"> */}
              {/*        {form.watch('transferBill')?.name} */}
              {/*      </p> */}
              {/*      <IconButton */}
              {/*        icon={<X size={16} color="#2e3032" weight="bold" />} */}
              {/*        variant="ghost" */}
              {/*        onClick={() => form.setValue('transferBill', undefined)} */}
              {/*      /> */}
              {/*    </div> */}
              {/*  ) : ( */}
              {/*    <Hint error={!!form.formState.errors.transferBill}> */}
              {/*      {form.formState.errors.transferBill?.message ?? ''} */}
              {/*    </Hint> */}
              {/*  )} */}
              {/* </Form.Item> */}
              {/* <Form.Item> */}
              {/*  <TextInput */}
              {/*    id="transferInfo" */}
              {/*    type="text" */}
              {/*    label="Bạn vui lòng cung cấp thông tin: Ngân Hàng + Số tài khoản + Tên. HuLib sẽ chuyển khoản lại số tiền đã cọc cho bạn ngay sau chương trình (Ví dụ: MB Bank - Nguyễn Văn A - 90909012)" */}
              {/*    placeholder="Nhập câu trả lời của bạn" */}
              {/*    {...form.register('transferInfo')} */}
              {/*    isError={!!form.formState.errors.transferInfo} */}
              {/*    hintText={form.formState.errors.transferInfo?.message} */}
              {/*  /> */}
              {/* </Form.Item> */}
              <Form.Item>
                <RadioGroup
                  name="willingToBecomeAmbassador"
                  label={t('ambassador_label')}
                  options={BecomingAmbassador.map(item => ({
                    value: item.value,
                    label: t(`ambassador.${item.labelKey}`),
                  }))}
                  control={form.control}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="submit"
                  value={t('submit_button')}
                  disabled={form.formState.isSubmitting}
                  animation={form.formState.isSubmitting && 'progress'}
                  className="w-full"
                >
                  {t('submit_button')}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="h-2" />
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default EventFormModal;
