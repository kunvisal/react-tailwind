interface SkeletonLoaderProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  count = 1,
}) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-800";

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const style = {
    width: width || (variant === "circular" ? "40px" : "100%"),
    height: height || (variant === "text" ? "16px" : "40px"),
  };

  const skeleton = (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    ></div>
  );

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>{skeleton}</div>
        ))}
      </div>
    );
  }

  return skeleton;
};

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <SkeletonLoader width="200px" height="32px" />
        <SkeletonLoader width="120px" height="40px" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="p-3">
                  <SkeletonLoader height="20px" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 dark:border-gray-800"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="p-3">
                    <SkeletonLoader height="20px" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Card Skeleton
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div className="mb-4 flex items-center justify-between">
            <SkeletonLoader width="150px" height="24px" />
            <SkeletonLoader variant="circular" width="40px" height="40px" />
          </div>
          <SkeletonLoader height="80px" className="mb-3" />
          <SkeletonLoader variant="text" count={3} />
        </div>
      ))}
    </>
  );
};

// Form Skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <SkeletonLoader width="200px" height="32px" className="mb-6" />
      <div className="space-y-5">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index}>
            <SkeletonLoader width="100px" height="20px" className="mb-2" />
            <SkeletonLoader height="44px" />
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <SkeletonLoader width="120px" height="44px" />
        <SkeletonLoader width="120px" height="44px" />
      </div>
    </div>
  );
};

export default SkeletonLoader;

