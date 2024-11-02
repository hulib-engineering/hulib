'use client';

import { Eye } from '@phosphor-icons/react';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';

import AuthCode from '@/components/authCode/AuthCode';
import Button from '@/components/button/Button';
import Dropdown from '@/components/dropdown/Dropdown';
import Form from '@/components/form/Form';
import { Logo } from '@/components/Logo';
import MenuItem from '@/components/menuItem/MenuItem';
import Modal from '@/components/Modal';
import SocialButton from '@/components/SocialButton';
import TextInput from '@/components/textInput/TextInput';
import FacebookIcon from '@/public/assets/icons/facebook-icon.svg';
import GoogleIcon from '@/public/assets/icons/google-icon.svg';

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const Step1Form = () => (
  <>
    <Form.Item error>
      <TextInput
        id="email"
        type="email"
        label="Email"
        placeholder="john@company.com"
        hintText="Supporting text"
      />
    </Form.Item>
    <Form.Item>
      <TextInput
        id="password"
        type="password"
        label="Password"
        showPasswordText={<Eye />}
      />
    </Form.Item>
    <Form.Item>
      <TextInput
        id="confirmPassword"
        type="password"
        label="Re-enter password"
        showPasswordText={<Eye />}
      />
    </Form.Item>
  </>
);

const Step2Form = () => {
  const [currentGender, setCurrentGender] = useState({ value: '', label: '' });

  return (
    <>
      <Form.Item>
        <TextInput
          id="fullname"
          type="text"
          label="Fullname"
          placeholder="họ Hu tên Lib"
        />
      </Form.Item>
      <Form.Item className="z-10 flex gap-2">
        <fieldset className="w-full">
          <Dropdown
            id="gender"
            size="sm"
            value={currentGender}
            onChange={setCurrentGender}
          >
            {({ open }) => (
              <>
                <Dropdown.Select open={open} label="Gender">
                  {currentGender?.label}
                </Dropdown.Select>
                <Dropdown.Options>
                  {genders.map((gender, index) => (
                    <Dropdown.Option key={index} value={gender}>
                      {({ selected, active }) => (
                        <MenuItem isActive={active} isSelected={selected}>
                          <MenuItem.Title>{gender.label}</MenuItem.Title>
                        </MenuItem>
                      )}
                    </Dropdown.Option>
                  ))}
                </Dropdown.Options>
              </>
            )}
          </Dropdown>
        </fieldset>
        <fieldset className="w-full">
          <TextInput type="date" label="Date of birth" />
        </fieldset>
      </Form.Item>
    </>
  );
};

const Step3Form = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [result, setResult] = useState('');
  console.log(result);

  const handleOnChange = useCallback((res: string) => {
    setResult(res);
  }, []);

  const closeModal = () => setIsOpen(false);

  return (
    <Modal open={isOpen} onClose={closeModal} className="z-50">
      <Modal.Backdrop className="bg-[#F3F4F6] bg-opacity-100 bg-gradient-to-bl from-white/20 to-[#0442bf33] bg-blend-multiply" />
      <Modal.Panel className="flex max-w-xl flex-col items-center gap-12 p-8">
        <Logo />
        <div className="flex flex-col gap-4 text-center text-neutral-10">
          <h2 className="text-4xl font-medium leading-[44px] tracking-[-2%]">
            Enter verification code
          </h2>
          <p className="tracking-[0.5%]">Step 3 of 3</p>
          <p className="tracking-[0.5%]">
            It’s almost done. please enter the 6-digit verification code we just
            sent to{' '}
            <span className="text-primary-50">hoang.nv146@gmail.com</span>
          </p>
        </div>
        <Form className="flex w-full flex-col items-center justify-center gap-4">
          <Form.Item>
            <fieldset className="w-full">
              <AuthCode onChange={handleOnChange} className="justify-center" />
            </fieldset>
          </Form.Item>
        </Form>
        <div className="flex flex-col items-center justify-center">
          <div className="inline-flex items-center justify-center self-stretch">
            <div className="tracking-tight text-neutral-40">
              Haven’t receive the email?
            </div>
            <Button
              variant="ghost"
              className="leading-[18px] underline"
              onClick={() => {}}
            >
              Resend
            </Button>
          </div>
          <div className="inline-flex items-center justify-center self-stretch">
            <div className="tracking-tight text-neutral-40">
              If you need help, contact us via email
            </div>
            <Button
              as="a"
              href="#?"
              variant="ghost"
              className="leading-[18px] underline"
            >
              Hulib@gmail.com
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

const RegistrationForm = () => {
  const [step, setStep] = useState(0);
  console.log(step);

  const handleSubmit = () => {
    // if (step === 0) {
    //   setStep((prev) => prev + 1);
    // }
    setStep((prev) => prev + 1);
  };

  if (step === 2) {
    return <Step3Form />;
  }

  return (
    <>
      <div className="text-center text-neutral-10">
        <h2 className="text-4xl font-medium leading-[44px] tracking-[-2%]">
          Create an account
        </h2>
        <p className="tracking-[0.5%]">Step {step + 1} of 3</p>
      </div>
      <Form className="flex w-full flex-col gap-4">
        {step === 0 ? <Step1Form /> : <Step2Form />}
        <Form.Item className="py-4">
          <Button
            type="button"
            value="Submit"
            className="w-full"
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </Form.Item>
        <p className="text-center">
          By creating an account, I accept{' '}
          <Link
            href="#term-of-use"
            className="font-medium leading-tight tracking-tight text-primary-50 underline"
          >
            Terms of Use
          </Link>{' '}
          and{' '}
          <Link
            href="#privacy-policy"
            className="font-medium leading-tight tracking-tight text-primary-50 underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </Form>
      <div className="inline-flex h-6 items-center justify-start gap-2 self-stretch">
        <div className="h-[1px] w-full shrink grow basis-0 bg-neutral-90" />
        <div className="text-center tracking-tight text-neutral-30">
          Or sign up with
        </div>
        <div className="h-[1px] w-full shrink grow basis-0 bg-neutral-90" />
      </div>
      <div className="flex items-center justify-center gap-2">
        <SocialButton iconUrl={FacebookIcon} />
        <SocialButton iconUrl={GoogleIcon} />
      </div>
      <div className="inline-flex items-center justify-center gap-4 py-3">
        <div className="tracking-tight text-neutral-30">
          Already have an account?
        </div>
        <Link href="login" className="font-medium text-primary-50 underline">
          Log in
        </Link>
      </div>
    </>
  );
};

export { RegistrationForm };
