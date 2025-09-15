import { ClipLoader } from "react-spinners";

const LoadingSpinner = ({ contents }: { contents: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <ClipLoader />
      <p className="mt-4 text-gray-600">{contents}</p>
    </div>
  );
};

export default LoadingSpinner;
