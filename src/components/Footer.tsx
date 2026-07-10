import React from 'react';
import { OrgSettings } from '../types';
import { Language } from '../lib/translations';

interface FooterProps {
  settings: OrgSettings;
  language: Language;
}

export const FooterComponent: React.FC<FooterProps> = ({ settings, language }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t-4 border-[#FF6321] relative overflow-hidden no-print">
      {/* Absolute faint background emblem watermark */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-y-16 translate-x-16">
        <img src={settings.logoUrl} alt="Logo Watermark" className="w-96 h-96 object-contain" referrerPolicy="no-referrer" />
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 text-left">
        
        {/* Org branding info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src={settings.logoUrl} 
              alt="Logo" 
              className="w-14 h-14 object-contain rounded-full border border-slate-700 p-0.5" 
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-lg font-bold text-white">{language === 'bn' ? settings.orgNameBangla : settings.orgNameEnglish}</h3>
              <p className="text-[10px] text-[#FF6321] font-semibold font-mono tracking-wider">"{settings.slogan}"</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            {settings.mission}
          </p>
        </div>

        {/* Contact details */}
        <div className="space-y-4 text-sm">
          <h4 className="text-white font-extrabold tracking-wide uppercase text-sm border-b border-slate-800 pb-2">যোগাযোগ করুন (Contact Info)</h4>
          <p className="flex items-start gap-2.5">
            <span className="text-[#FF6321] mt-0.5">📍</span>
            <span>{settings.address}</span>
          </p>
          <p className="flex items-center gap-2.5">
            <span className="text-[#FF6321]">📞</span>
            <span>{settings.contactNumber}</span>
          </p>
          <p className="flex items-center gap-2.5">
            <span className="text-[#FF6321]">✉️</span>
            <span>{settings.email}</span>
          </p>
          
          {/* Social icons */}
          <div className="flex gap-4 pt-2">
            {Object.entries(settings.socialMediaLinks).map(([platform, link]) => (
              <a 
                key={platform}
                href={link} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#FF6321] hover:text-white flex items-center justify-center transition text-xs uppercase font-extrabold"
              >
                {platform.charAt(0)}
              </a>
            ))}
          </div>
        </div>

        {/* Dynamic google maps embed */}
        <div className="space-y-4">
          <h4 className="text-white font-extrabold tracking-wide uppercase text-sm border-b border-slate-800 pb-2">আমাদের অবস্থান (Google Maps)</h4>
          <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            <iframe 
              title="Google Map Embed"
              src={settings.googleMapEmbedUrl}
              className="w-full h-full border-none"
              allowFullScreen={false}
              loading="lazy"
            />
          </div>
        </div>

      </div>

      {/* Footer copyright section */}
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p className="font-medium">{settings.footerText}</p>
        <p className="font-mono">
          Powered by <span className="text-slate-400 font-bold">Ganaraj CMS Engine</span> / v2.5.0
        </p>
      </div>
    </footer>
  );
};
