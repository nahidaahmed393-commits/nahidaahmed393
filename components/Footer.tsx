
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white mt-12 py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} AI Book Weaver. All rights reserved.</p>
                <p className="text-sm mt-1">Crafted with AI, for creators everywhere.</p>
            </div>
        </footer>
    );
};
