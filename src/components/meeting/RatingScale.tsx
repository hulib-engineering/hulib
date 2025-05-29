const RatingScale = ({
  question,
  leftLabel,
  rightLabel,
  value,
  onChange,
}: {
  question: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (rating: number) => void;
}) => (
  <div className="space-y-3 sm:space-y-4">
    <h3 className="text-base font-medium text-gray-900 sm:text-lg">
      {question}
    </h3>
    <div className="mx-auto flex w-full items-end justify-between sm:w-[80%]">
      <span className="text-xs font-medium text-primary-60 sm:text-sm">
        {leftLabel}
      </span>
      <div className="flex space-x-4 sm:space-x-10">
        {[1, 2, 3, 4, 5].map((rating) => (
          <div
            key={rating}
            className="flex flex-col items-center space-y-1 sm:space-y-2"
          >
            <span className="text-sm sm:text-base">{rating}</span>
            <button
              type="button"
              onClick={() => onChange(rating)}
              className={`h-5 w-5 rounded-full border-2 transition-all duration-200 hover:scale-110 sm:h-6 sm:w-6 ${
                value === rating
                  ? 'border-primary-60 bg-primary-60'
                  : 'border-gray-300 bg-white hover:border-primary-60'
              }`}
              aria-label={`Rating ${rating}`}
            >
              <span className="sr-only">{rating}</span>
            </button>
          </div>
        ))}
      </div>
      <span className="text-xs font-medium text-primary-60 sm:text-sm">
        {rightLabel}
      </span>
    </div>
  </div>
);

export default RatingScale;
