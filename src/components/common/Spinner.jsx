const Spinner = ({ size = "md" }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-7 w-7 border-2",
    lg: "h-12 w-12 border-[3px]",
  };
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizes[size]} rounded-full border-primary-500 border-t-transparent animate-spin`} />
    </div>
  );
};

export default Spinner;
