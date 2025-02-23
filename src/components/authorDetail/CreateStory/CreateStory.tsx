import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { CreateStep1 } from '@/components/authorDetail/CreateStory/CreateStep1';
import { CreateStep2 } from '@/components/authorDetail/CreateStory/CreateStep2';
import { SubmittedSuccess } from '@/components/authorDetail/CreateStory/SubmittedSuccess';
import { CreateStoryValidation } from '@/validations/CreateStoryValidation';

export const CreateStory = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const methods = useForm<z.infer<typeof CreateStoryValidation>>({
    resolver: zodResolver(CreateStoryValidation),
    defaultValues: {
      topics: [],
      title: '',
      description: '',
      abstract: '',
      uploadFile: undefined,
    },
  });

  const renderCurrentStepSection = React.useCallback(() => {
    switch (currentStep) {
      case 0:
        return (
          <CreateStep1
            methods={methods}
            onNextPress={() => {
              setCurrentStep(1);
            }}
          />
        );
      case 1:
        return (
          <CreateStep2
            methods={methods}
            onBackPress={() => setCurrentStep(0)}
            onNextPress={() => setCurrentStep(2)}
          />
        );
      case 2:
        return <SubmittedSuccess />;
      default:
        return null;
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col gap-y-4 py-5">
      <h2 className="text-4xl font-medium text-[#000000] ">Create Story</h2>

      {renderCurrentStepSection()}
    </div>
  );
};
