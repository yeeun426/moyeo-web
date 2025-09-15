import React from "react";

const ErrorRouting = ({
  error,
  handleGoHome,
}: {
  error: string;
  handleGoHome: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            로그인 실패
          </h2>
          <p className="text-red-500 text-lg">{error}</p>
        </div>
        <button
          onClick={handleGoHome}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ErrorRouting;
