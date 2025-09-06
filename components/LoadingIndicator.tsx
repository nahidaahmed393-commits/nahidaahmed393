
import React from 'react';

interface LoadingIndicatorProps {
    status: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ status }) => {
    return (
        <div className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
            <div className="flex justify-center items-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <p className="text-lg font-semibold text-gray-700">Generating Your Book...</p>
            <p className="text-sm text-gray-500 mt-2">{status}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div className="bg-indigo-600 h-2.5 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-gray-400 mt-4">This may take a few minutes for longer books. Please don't close this window.</p>
        </div>
    );
};

export default LoadingIndicator;
