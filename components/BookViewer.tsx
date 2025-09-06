
import React, { useState } from 'react';
import type { Book } from '../types';
import { PdfIcon, CopyIcon, CheckIcon } from './Icons';

// Declare global libraries to avoid TypeScript errors
declare const jspdf: any;
declare const html2canvas: any;

interface BookViewerProps {
    book: Book;
}

const BookViewer: React.FC<BookViewerProps> = ({ book }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const handleDownloadPdf = () => {
        setIsDownloading(true);
        const { jsPDF } = jspdf;
        const bookElement = document.getElementById('book-content-render');

        if (bookElement) {
            html2canvas(bookElement, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                const imgHeight = pdfWidth / ratio;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                    heightLeft -= pdfHeight;
                }

                const pageCount = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    pdf.setPage(i);
                    pdf.setFontSize(8);
                    pdf.setTextColor(100);
                    pdf.text(`Page ${i}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
                }

                pdf.save(`${book.title.replace(/\s+/g, '_')}.pdf`);
                setIsDownloading(false);
            }).catch(err => {
                console.error("PDF generation failed", err);
                alert("Sorry, there was an error generating the PDF. Please try again.");
                setIsDownloading(false);
            });
        } else {
            setIsDownloading(false);
        }
    };
    
    const handleCopyToClipboard = () => {
        const bookText = `
Title: ${book.title}
Author: ${book.author}

INTRODUCTION
${book.introduction}

---

${book.chapters.map((ch, i) => `CHAPTER ${i + 1}: ${ch.title}\n\n${ch.content}`).join('\n\n---\n\n')}

---

CONCLUSION
${book.conclusion}

---

TABLE OF CONTENTS
${book.tableOfContents.map((title, i) => `${i + 1}. ${title}`).join('\n')}

---

REFERENCES
${book.references}
        `;
        navigator.clipboard.writeText(bookText.trim());
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl shadow-book border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50/50 rounded-t-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                 <h3 className="text-xl font-bold text-gray-800 text-center sm:text-left">
                    Your Generated Book
                </h3>
                <div className="flex items-center gap-3">
                    <button onClick={handleCopyToClipboard} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition">
                         {hasCopied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy Text</>}
                    </button>
                    <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 transition">
                        {isDownloading ? 'Generating...' : <><PdfIcon /> Download PDF</>}
                    </button>
                </div>
            </div>

            <div id="book-content-render" className="p-6 md:p-12 font-serif text-gray-800 prose max-w-none">
                <div className="text-center mb-16" style={{ pageBreakAfter: 'always' }}>
                    <h1 className="text-4xl md:text-5xl font-bold !mb-4">{book.title}</h1>
                    <p className="text-xl text-gray-600">By</p>
                    <p className="text-2xl font-semibold mt-1">{book.author}</p>
                </div>

                <div style={{ pageBreakAfter: 'always' }}>
                    <h2 className="text-3xl font-bold border-b pb-2 mb-6">Introduction</h2>
                    <p className="whitespace-pre-wrap text-justify leading-relaxed">{book.introduction}</p>
                </div>

                {book.chapters.map((chapter, index) => (
                    <div key={index} style={{ pageBreakAfter: 'always' }}>
                        <h2 className="text-3xl font-bold border-b pb-2 mb-6">Chapter {index + 1}: {chapter.title}</h2>
                        <p className="whitespace-pre-wrap text-justify leading-relaxed">{chapter.content}</p>
                    </div>
                ))}

                <div style={{ pageBreakAfter: 'always' }}>
                    <h2 className="text-3xl font-bold border-b pb-2 mb-6">Conclusion</h2>
                    <p className="whitespace-pre-wrap text-justify leading-relaxed">{book.conclusion}</p>
                </div>
                
                <div>
                     <h2 className="text-3xl font-bold border-b pb-2 mb-6">Table of Contents</h2>
                     <ul className="list-decimal list-inside space-y-2 mb-12">
                         {book.tableOfContents.map((title, index) => (
                            <li key={index}>{title}</li>
                         ))}
                     </ul>

                     <h2 className="text-3xl font-bold border-b pb-2 mb-6">References</h2>
                     <p className="whitespace-pre-wrap text-sm leading-loose">{book.references}</p>
                </div>
            </div>
        </div>
    );
};

export default BookViewer;
