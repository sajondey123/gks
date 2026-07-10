import React from 'react';
import { CustomPage } from '../types';

interface CustomPageViewerProps {
  page: CustomPage;
  onBackToHome: () => void;
}

export const CustomPageViewer: React.FC<CustomPageViewerProps> = ({ page, onBackToHome }) => {
  // Simple custom renderer to convert basic Markdown to rich HTML safely
  const renderContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-xl font-bold text-amber-900 mt-6 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={idx} className="text-lg font-bold text-orange-600 mt-4 mb-2">{line.replace('#### ', '')}</h4>;
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-6 list-disc text-stone-700 my-1">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      }
      return <p key={idx} className="text-stone-700 leading-relaxed my-2 text-md">{line}</p>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-amber-50">
        {/* Navigation Breadcrumb */}
        <button 
          onClick={onBackToHome}
          className="mb-8 text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          মেইন সাইটে ফিরুন
        </button>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-amber-900 leading-tight border-b border-gray-100 pb-4 mb-6">
          {page.title}
        </h1>

        {/* Page Body content */}
        <div className="prose max-w-none text-stone-800">
          {renderContent(page.content)}
        </div>

        {/* Created Stamp */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
          <span>প্রকাশিত পাতা: /{page.slug}</span>
          <span>তৈরি হয়েছে: {page.createdAt}</span>
        </div>
      </div>
    </div>
  );
};
