
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-16">
                    <div className="flex items-center space-x-3">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.494h18" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.5 6.253c0-1.657 3.806-3 8.5-3s8.5 1.343 8.5 3v11.494c0 1.657-3.806 3-8.5 3s-8.5-1.343-8.5-3V6.253z" />
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-800">AI Book Weaver</h1>
                    </div>
                </div>
            </div>
        </header>
    );
};
