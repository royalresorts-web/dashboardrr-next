"use client";
const Loader = ({
  size = "w-8 h-8",
  color = "border-blue-500",
}: {
  size?: string;
  color?: string;
}) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-4 border-solid ${color} border-t-transparent ${size}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;