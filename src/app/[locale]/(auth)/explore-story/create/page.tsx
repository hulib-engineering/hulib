'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Button from '@/components/button/Button';
import Form from '@/components/form/Form';
import { ControlledSelect } from '@/components/Select';
import TextInput from '@/components/textInput/TextInput';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  abstract: z.string().min(1, 'Abstract is required'),
  coverId: z.string().min(1, 'Cover ID is required'),
  humanBookId: z.string().min(1, 'Human Book ID is required'),
});

// Mock data for human books - replace with actual data
const humanBooks = [
  { id: '8686', name: 'Human Book #8686' },
  { id: '8687', name: 'Human Book #8687' },
  { id: '8688', name: 'Human Book #8688' },
];

export default function CreateStoryForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      abstract: '',
      coverId: '',
      humanBookId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold">Create New Story</h1>
      <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="w-full">
          <TextInput
            type="text"
            label={<Form.Label required>Title</Form.Label>}
            {...register('title')}
            isError={!!errors.title?.message}
          />
        </fieldset>
        <Form.Item>
          <TextInput
            id="abstract"
            type="text-area"
            label={<Form.Label required>Abstract</Form.Label>}
            {...register('abstract')}
            isError={!!errors.abstract}
            hintText={errors.abstract?.message}
            className="h-[162px] p-3 text-sm text-[#5C6063]"
          />
        </Form.Item>
        <fieldset className="w-full">
          <TextInput
            type="text"
            label="Cover ID"
            {...register('coverId')}
            isError={!!errors.coverId?.message}
          />
        </fieldset>
        <fieldset className="w-full">
          <ControlledSelect
            name="humanBookId"
            control={control}
            label="HumanBook"
            options={humanBooks.map((book) => {
              return { label: book.name, value: book.id };
            })}
          />
        </fieldset>
        <Form.Item className="py-4">
          <Button
            type="submit"
            value="Submit"
            className="w-full lg:w-[240px]"
            disabled={isSubmitting}
            animation={isSubmitting && 'progress'}
          >
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
