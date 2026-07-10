import React from 'react';
import { OrgSettings, CustomPage, UploadedHTML } from '../types';
import { Language, translations } from '../lib/translations';

interface NavbarProps {
  settings: OrgSettings;
  customPages: CustomPage[];
  htmlUploads: UploadedHTML[];
  language: Language;
  onSetLanguage: (lang: Language) => void;
  activeView: string;
  onNavigate: (view: string) => void;
  userRole?: string;
}

export const NavbarComponent: React.FC<NavbarProps> = ({
  settings,
  customPages,
  htmlUploads,
  language,
  onSetLanguage,
  activeView,
  onNavigate,
  userRole,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      {/* Dynamic top bar with primary theme colors */}
      <div 
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(to right, ${settings.themeColorPrimary}, ${settings.themeColorSecondary}, ${settings.themeColorAccent})` }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding Area */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img 
            src={settings.logoUrl || 'https://i.ibb.co.com/DPr4kZJB/Chat-GPT-Image-Jun-20-2026-11-14-56-PM-1.png'} 
            alt="Logo" 
            className="w-12 h-12 object-contain rounded-full border-2 border-slate-100 group-hover:scale-105 transition shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#FF6321] transition leading-tight">
              {language === 'bn' ? settings.orgNameBangla : settings.orgNameEnglish}
            </h1>
            <p className="text-[10px] font-mono font-semibold text-slate-500 mt-0.5 select-none">
              {language === 'bn' ? settings.slogan : t.slogan}
            </p>
          </div>
        </div>

        {/* Navigation Actions Menu */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs font-bold uppercase tracking-wide">
          <button 
            id="nav-home"
            onClick={() => onNavigate('home')}
            className={`px-3 py-2 rounded-xl transition ${activeView === 'home' ? 'bg-[#FF6321]/10 text-[#FF6321]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {t.home}
          </button>

          {/* Dynamic custom page routes created by the page builder */}
          {customPages.map(page => (
            <button
              key={page.id}
              onClick={() => onNavigate(`page-${page.slug}`)}
              className={`px-3 py-2 rounded-xl transition ${activeView === `page-${page.slug}` ? 'bg-[#FF6321]/10 text-[#FF6321]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {page.title.split(' (')[0]}
            </button>
          ))}

          {/* Dynamic sandbox routes created by the zip/HTML module manager */}
          {htmlUploads.map(up => (
            <button
              key={up.id}
              onClick={() => onNavigate(`sandbox-${up.slug}`)}
              className={`px-3 py-2 rounded-xl transition ${activeView === `sandbox-${up.slug}` ? 'bg-[#FF6321]/10 text-[#FF6321]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {up.title.split(' (')[0].substring(0, 15)}
            </button>
          ))}

          <button 
            id="nav-verify"
            onClick={() => onNavigate('verify')}
            className={`px-3 py-2 rounded-xl transition ${activeView === 'verify' ? 'bg-[#FF6321]/10 text-[#FF6321]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {t.verification}
          </button>

          {userRole && (
            <button 
              id="nav-admin"
              onClick={() => onNavigate('admin')}
              className={`px-3 py-2 rounded-xl transition ${activeView === 'admin' ? 'bg-[#FF6321]/10 text-[#FF6321]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {t.adminPanel}
            </button>
          )}

          <button 
            id="nav-portal"
            onClick={() => onNavigate('portal')}
            className={`px-3.5 py-2 rounded-xl text-white font-extrabold transition shadow-md hover:brightness-105 active:scale-95`}
            style={{ backgroundColor: settings.themeColorPrimary }}
          >
            {t.memberPortal}
          </button>

          {/* Language Toggle bar */}
          <div className="flex items-center ml-2 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button 
              id="lang-bn"
              onClick={() => onSetLanguage('bn')}
              className={`px-2.5 py-1.5 text-[10px] font-bold transition ${language === 'bn' ? 'bg-[#FF6321] text-white' : 'text-slate-500'}`}
            >
              বাং
            </button>
            <button 
              id="lang-en"
              onClick={() => onSetLanguage('en')}
              className={`px-2.5 py-1.5 text-[10px] font-bold transition ${language === 'en' ? 'bg-[#FF6321] text-white' : 'text-slate-500'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
