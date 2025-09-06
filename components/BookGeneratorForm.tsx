
import React, { useState } from 'react';
import { PenIcon } from './Icons';

interface BookGeneratorFormProps {
    onGenerate: (topic: string, pageCount: number) => void;
    isLoading: boolean;
}

const BookGeneratorForm: React.FC<BookGeneratorFormProps> = ({ onGenerate, isLoading }) => {
    const [topic, setTopic] = useState<string>('');
    const [pageCount, setPageCount] = useState<number>(10);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) {
            setError('Please enter a topic for your book.');
            return;
        }
        if (pageCount < 1 || pageCount > 10000) {
            setError('Page count must be between 1 and 10,000.');
            return;
        }
        setError(null);
        onGenerate(topic, pageCount);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Book Topic</label>
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., The History of Ancient Rome"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="pageCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Pages ({pageCount})</label>
                    <input
                        type="range"
                        id="pageCount"
                        min="1"
                        max="10000"
                        step="1"
                        value={pageCount}
                        onChange={(e) => setPageCount(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        disabled={isLoading}
                    />
                     <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span>10,000</span>
                    </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Weaving Your Tale...' : 'Generate Book'}
                    {!isLoading && <PenIcon />}
                </button>
            </form>
        </div>
    );
};

export default BookGeneratorForm;
