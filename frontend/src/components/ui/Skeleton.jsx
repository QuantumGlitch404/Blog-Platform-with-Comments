const Skeleton = ({ className = '', width, height, rounded = false }) => {
  return (
    <div
      className={`skeleton ${rounded ? 'rounded-full' : ''} ${className}`}
      style={{ width: width || '100%', height: height || '20px' }}
    />
  );
};

export const PostCardSkeleton = () => (
  <div className="card">
    <div className="flex justify-between mb-4">
      <Skeleton width="80px" height="24px" className="rounded-full" />
      <Skeleton width="60px" height="16px" />
    </div>
    <Skeleton height="24px" className="mb-3" />
    <Skeleton height="16px" className="mb-2" />
    <Skeleton height="16px" width="80%" className="mb-6" />
    <div className="flex items-center gap-3 pt-4 border-t border-border-subtle">
      <Skeleton width="32px" height="32px" rounded />
      <div className="flex-1">
        <Skeleton width="100px" height="14px" className="mb-1" />
        <Skeleton width="60px" height="12px" />
      </div>
    </div>
  </div>
);

export default Skeleton;
