interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "h-8 w-8 border-2",
    md: "h-12 w-12 border-3",
    lg: "h-16 w-16 border-4",
    xl: "h-24 w-24 border-4",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-gray-300 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-400 ${sizeClasses[size]} ${className}`}
    ></div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;

