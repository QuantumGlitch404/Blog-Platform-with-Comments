import { useReadingProgress } from '../../hooks/useReadingProgress';

const ReadingProgressBar = () => {
  const completion = useReadingProgress();

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-transparent">
      <div
        className="h-full bg-accent-highlight transition-all duration-150 ease-out"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;
