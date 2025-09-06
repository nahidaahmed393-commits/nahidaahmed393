
import React, { useState, useCallback } from 'react';
import type { Book, Chapter, BookOutline } from './types';
import { generateBookOutline, streamSectionContent, generateSectionContent } from './services/geminiService';
import BookGeneratorForm from './components/BookGeneratorForm';
import BookViewer from './components/BookViewer';
import LoadingIndicator from './components/LoadingIndicator';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [generationStatus, setGenerationStatus] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleGenerateBook = useCallback(async (topic: string, pageCount: number) => {
        setIsLoading(true);
        setError(null);
        setBook(null);
        setGenerationStatus('Warming up the printing press...');

        try {
            // 1. Generate Outline
            setGenerationStatus(`Drafting the blueprint for a ${pageCount}-page book on "${topic}"...`);
            const outline: BookOutline = await generateBookOutline(topic, pageCount);

            const initialBook: Book = {
                title: outline.title,
                author: 'Nahida Ahmed',
                introduction: '',
                chapters: outline.chapters.map(ch => ({ title: ch.title, content: '' })),
                conclusion: '',
                tableOfContents: outline.chapters.map(ch => ch.title),
                references: '',
            };
            setBook(initialBook);

            // 2. Generate Introduction
            setGenerationStatus('Writing a compelling introduction...');
            const intro = await generateSectionContent(`Write a comprehensive introduction for a book titled "${outline.title}" on the topic of "${topic}". The introduction should set the stage for the following chapters: ${outline.chapters.map(c => c.title).join(', ')}.`, 500);
            setBook(prev => prev ? { ...prev, introduction: intro } : null);

            // 3. Generate Chapters via streaming
            for (let i = 0; i < outline.chapters.length; i++) {
                const chapter = outline.chapters[i];
                setGenerationStatus(`Writing Chapter ${i + 1}: ${chapter.title}`);
                const chapterPrompt = `In the context of a book titled "${outline.title}", write a detailed and comprehensive chapter on "${chapter.title}". The book covers these topics: ${outline.chapters.map(c => c.title).join(', ')}. Write only the content for this chapter.`;
                const wordsPerChapter = Math.floor((pageCount * 400) / outline.chapters.length);
                
                await streamSectionContent(chapterPrompt, wordsPerChapter, (chunk) => {
                    setBook(prev => {
                        if (!prev) return null;
                        const newChapters = [...prev.chapters];
                        newChapters[i].content += chunk;
                        return { ...prev, chapters: newChapters };
                    });
                });
            }
            
            // 4. Generate Conclusion
            setGenerationStatus('Crafting a thoughtful conclusion...');
            const conclusion = await generateSectionContent(`Write a comprehensive conclusion for a book titled "${outline.title}" that summarizes the key points from its chapters and provides final thoughts. The chapters were: ${outline.chapters.map(c => c.title).join(', ')}.`, 500);
            setBook(prev => prev ? { ...prev, conclusion: conclusion } : null);

            // 5. Generate References
            setGenerationStatus('Compiling references and sources...');
            const references = await generateSectionContent(`Generate a list of plausible academic and web references for a book on "${topic}" titled "${outline.title}".`, 400);
            setBook(prev => prev ? { ...prev, references: references } : null);

            setGenerationStatus('Your book is complete!');

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during book generation.');
            setGenerationStatus('');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-2">Create Your Masterpiece</h2>
                    <p className="text-center text-gray-600 mb-8">
                        Provide a topic and desired length, and let our AI author bring your book to life.
                    </p>
                    <BookGeneratorForm onGenerate={handleGenerateBook} isLoading={isLoading} />
                    
                    {error && (
                        <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                            <strong className="font-bold">Generation Failed: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {isLoading && !error && <LoadingIndicator status={generationStatus} />}

                    {book && !isLoading && (
                       <div className="mt-12">
                           <BookViewer book={book} />
                       </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
