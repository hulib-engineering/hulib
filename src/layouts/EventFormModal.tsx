'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from '@phosphor-icons/react';
import React, { type ReactNode } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import { useController, useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import Form from '@/components/form/Form';
import Label from '@/components/Label';
import Modal from '@/components/Modal';
import { mergeClassnames } from '@/components/private/utils';
import Radio from '@/components/radio/Radio';
import TextInput from '@/components/textInput/TextInput';
import { EmailRegistrationValidation } from '@/validations/EventRegistrationValidation';

type IEventRegistration = Omit<
  z.infer<typeof EmailRegistrationValidation>,
  'transferBill'
> & {
  transferBill?: File;
};

interface RadioGroupProps {
  id?: string;
  label?: ReactNode;
  isError?: boolean;
  dir?: 'ltr' | 'rtl' | 'auto';
}

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
        {options.map((option) => (
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
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Tiktok', label: 'Tiktok' },
  { value: 'Threads', label: 'Threads' },
  { value: 'Khác', label: 'Khác' },
];
const Careers = [
  { value: 'Học sinh THPT', label: 'Học sinh THPT' },
  { value: 'Sinh viên', label: 'Sinh viên' },
  { value: 'Đang gap year', label: 'Đang gap year' },
  { value: 'Đang đi làm', label: 'Đang đi làm' },
  { value: 'Khác', label: 'Khác' },
];
const Hometowns = [
  { value: 'Huế', label: 'Huế mộng mơ' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng thân iu' },
  { value: 'TP. Hồ Chí Minh', label: 'Hồ Chí Minh iu dấu' },
  { value: 'Hà Nội', label: 'Hà Nội thân thương' },
  { value: 'Khác', label: 'Khác' },
];
const Choices = [
  { value: 'Family', label: 'Family (Gia đình)' },
  { value: 'Coworker', label: 'Coworker (Đồng nghiệp)' },
  { value: 'Friendship', label: 'Friendship (Bạn bè)' },
  { value: 'Love', label: 'Love (Tình yêu)' },
];
const BecomingAmbassador = [
  { value: 'Không', label: 'Không' },
  { value: 'Có', label: 'Có' },
];

export type IEventFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (registererName: string) => void;
};

const EventFormModal = (props: IEventFormModalProps) => {
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
              Đăng ký tham dự sự kiện HuLib
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
                    label="Bạn cho HuLib xin họ và tên của bạn nhé!"
                    placeholder="Nhập tên của bạn"
                    {...form.register('fullname')}
                    isError={!!form.formState.errors.fullname}
                    hintText={form.formState.errors.fullname?.message}
                  />
                </fieldset>
                <fieldset className="w-full">
                  <TextInput
                    id="birthday"
                    type="date"
                    label="Ngày/tháng/ năm sinh của bạn nha!"
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
                  label="Email của bạn là gì nhỉ?"
                  placeholder="Hulibvietnamabc@gmail.com"
                  {...form.register('email')}
                  isError={!!form.formState.errors.email}
                  hintText={form.formState.errors.email?.message}
                />
              </Form.Item>
              <Form.Item>
                <RadioGroup
                  name="socialMedia"
                  label="Bạn biết đến sự kiện của HuLib qua đâu vậy?"
                  options={SocialMedia}
                  control={form.control}
                  isError={!!form.formState.errors.socialMedia}
                  optionsClassname="flex flex-col gap-0 lg:flex-row lg:gap-12"
                />
              </Form.Item>
              <Form.Item>
                <RadioGroup
                  name="career"
                  label="Bạn là"
                  options={Careers}
                  control={form.control}
                  isError={!!form.formState.errors.career}
                  optionsClassname="flex flex-col gap-0 lg:flex-row lg:gap-12"
                />
              </Form.Item>
              <Form.Item>
                <RadioGroup
                  name="hometown"
                  label="Bạn đến từ"
                  options={Hometowns}
                  control={form.control}
                  isError={!!form.formState.errors.hometown}
                  optionsClassname="flex flex-col gap-0 lg:flex-row lg:gap-12"
                />
              </Form.Item>
              <Form.Item>
                <RadioGroup
                  name="firstChoice"
                  label="Trong sự kiện lần này, HuLib đã chuẩn bị sẵn bốn căn phòng với những chủ đề khác nhau cho các bạn có thể lựa chọn. Để giúp buổi trò chuyện của chúng mình hiệu quả hơn, tập trung hơn và tụi mình có thể trao đổi sâu hơn về nội dung mà các bạn quan tâm, bạn hãy giúp HuLib chọn ra căn phòng có chủ đề mà bạn có hứng thú nhất nhé"
                  options={Choices}
                  isVertical
                  control={form.control}
                  isError={!!form.formState.errors.firstChoice}
                />
              </Form.Item>
              <Form.Item>
                <RadioGroup
                  name="secondChoice"
                  label="Trong trường hợp căn phòng bạn yêu thích nhất của bạn bị đầy hoặc bị quá tải, vậy thì đâu sẽ là sự lựa chọn thứ hai của bạn?"
                  options={Choices}
                  isVertical
                  control={form.control}
                  isError={!!form.formState.errors.secondChoice}
                />
              </Form.Item>
              <Form.Item>
                <TextInput
                  id="question"
                  type="text"
                  label="Bạn có câu hỏi nào muốn gửi đến Khách Mời (Human book) của HuLib không nhỉ?"
                  placeholder="Nhập câu hỏi của bạn"
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
                  label="HuLib đang tìm kiếm các đại sứ truyền thông nhiệt huyết để cùng lan tỏa giá trị tích cực về sức khỏe tinh thần đến cộng đồng. Bạn có hứng thú muốn thử sức với vai trò này không? Nếu chọn có, tụi mình sẽ gửi thêm thông tin chi tiết nhé qua email nhé!"
                  options={BecomingAmbassador}
                  control={form.control}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="submit"
                  value="Submit"
                  disabled={form.formState.isSubmitting}
                  animation={form.formState.isSubmitting && 'progress'}
                  className="w-full"
                >
                  Gửi
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
