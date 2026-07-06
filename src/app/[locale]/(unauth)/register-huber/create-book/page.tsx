'use client';

import BackButton from '../_components/BackButton';
import StoryForm from '@/features/stories/components/StoryForm';

export default function CreateBook() {
  return (
    <div className="">
      <BackButton text="Tạo sách" />
      <div className="px-[96px]">
        <StoryForm type="create" onCancel={() => { }} onSucceed={() => { }} />
      </div>
    </div>
  );
}
