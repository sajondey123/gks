import React from 'react';
import { UploadedHTML } from '../types';

interface HTMLSandboxProps {
  uploadedHtml: UploadedHTML;
  onBackToHome: () => void;
}

export const HTMLSandboxComponent: React.FC<HTMLSandboxProps> = ({
  uploadedHtml,
  onBackToHome,
}) => {
  // Construct the full HTML document with injected styles and scripts
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Load Tailwind for premium styling if needed -->
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Load Hind Siliguri Font for Bangla -->
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Hind Siliguri', sans-serif;
            margin: 0;
            padding: 20px;
          }
          ${uploadedHtml.cssContent}
        </style>
      </head>
      <body>
        <div id="sandbox-root">
          ${uploadedHtml.htmlContent}
        </div>
        <script>
          try {
            ${uploadedHtml.jsContent}
          } catch (e) {
            console.error("Sandbox Execution Error: ", e);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <div className="flex flex-col min-h-screen bg-stone-100">
      {/* Sandbox Header / Navigation Bar */}
      <div className="no-print bg-white shadow-md p-4 flex justify-between items-center px-6 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-md font-extrabold text-stone-800">{uploadedHtml.title}</h1>
            <p className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded inline-block mt-0.5">
              Sandbox URL: /{uploadedHtml.slug}
            </p>
          </div>
        </div>
        <button 
          id="btn-sandbox-back"
          onClick={onBackToHome}
          className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full shadow hover:opacity-90 transition flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          মেইন সাইটে ফিরুন
        </button>
      </div>

      {/* Sandboxed iframe execution frame */}
      <div className="flex-grow p-4 md:p-6 flex justify-center items-stretch">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
          <div className="bg-gray-50 px-4 py-2 flex items-center gap-1.5 border-b border-gray-200 text-xs text-gray-400">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
            <span className="ml-2 font-mono text-[11px]">Sandboxed Web Environment (no access to parent cookies)</span>
          </div>
          <iframe 
            title={uploadedHtml.title}
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            className="w-full flex-grow border-none"
            style={{ minHeight: '500px' }}
          />
        </div>
      </div>
    </div>
  );
};
