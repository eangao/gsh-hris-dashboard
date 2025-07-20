import React from "react";

const LoadingIndicator = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <div className="text-gray-700 text-sm font-medium">Loading data...</div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
