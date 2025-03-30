import Button from '../button/Button';

interface OpenStoryProps {
  content: string;
  title: string;
}

const OpenStory = ({ content, title }: OpenStoryProps) => {
  const words = content.split(' ');
  const midPoint = Math.floor(words.length / 2);
  const leftPage = words.slice(0, midPoint).join(' ');
  const rightPage = words.slice(midPoint).join(' ');

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200">
      <div className="relative flex h-[250px] w-full max-w-[600px] overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="relative w-1/2 border-r border-gray-300 bg-white p-6 shadow-inner">
          <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-r from-gray-300 to-transparent" />
          <h3 className="mb-4 text-lg font-bold text-gray-800">{title}</h3>{' '}
          <p className="text-sm text-gray-700">{leftPage}</p>
        </div>

        <div className="relative w-1/2 bg-white p-6 shadow-inner">
          <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-l from-gray-300 to-transparent" />
          <p className="text-sm text-gray-700">{rightPage}</p>
          <Button className="absolute bottom-4 right-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-md">
            Read all
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpenStory;
