import React, { useRef } from 'react';
import { Member, CertificateTemplate, OrgSettings } from '../types';

interface CertificateTemplateProps {
  member: Member;
  template: CertificateTemplate;
  settings?: OrgSettings;
  eventName?: string;
}

export const CertificateTemplateComponent: React.FC<CertificateTemplateProps> = ({
  member,
  template,
  settings,
  eventName = 'বার্ষিক ধর্মীয় উৎসব ও সমাজকল্যাণমূলক কার্যক্রম ২০২৬',
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  // Default values if settings is not fully provided
  const orgNameBangla = settings?.orgNameBangla || 'গণরাজ একতা সংঘ';
  const orgNameEnglish = settings?.orgNameEnglish || 'Ganaraj Ekota Sangha';
  const orgLogo = settings?.logoUrl || 'https://i.ibb.co.com/DPr4kZJB/Chat-GPT-Image-Jun-20-2026-11-14-56-PM-1.png';
  const issueDate = member.joinedDate || new Date().toISOString().split('T')[0];

  // Unique Certificate Number and Security Verification details
  const certSerial = member.membershipNumber 
    ? member.membershipNumber.replace('GES-2026-', '') 
    : member.id.substring(member.id.length - 4).toUpperCase();
  const certificateNumber = `GES-CERT-2026-${certSerial}`;
  const digitalHash = `SHA-GES-${member.id.substring(member.id.length - 8).toUpperCase()}-${certSerial}`;
  const verificationUrl = `${window.location.origin}?verify=${member.id}`;

  const handlePrint = () => {
    const printContent = certRef.current?.innerHTML;
    if (!printContent) return;

    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { background: white; color: black; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .no-print { display: none !important; }
        @page { size: landscape; margin: 0; }
        .certificate-print-wrapper {
          transform: scale(1) !important;
          margin: 0 !important;
          box-shadow: none !important;
          border: none !important;
          width: 100% !important;
          height: 100% !important;
        }
      }
    `;
    document.head.appendChild(style);

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificate - ${member.englishName}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Inter:wght@400;600;700;900&display=swap');
              body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #ffffff; font-family: 'Hind Siliguri', 'Inter', sans-serif; }
              .landscape-container { width: 1120px; height: 792px; box-sizing: border-box; position: relative; }
            </style>
          </head>
          <body>
            <div class="landscape-container">
              ${printContent}
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => { window.close(); }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Replace placeholders in body template with structured clean HTML
  const formattedBody = template.bodyTemplate
    .replace('[NAME]', `<strong class="text-stone-900 font-extrabold underline decoration-amber-500">${member.banglaName} (${member.englishName})</strong>`)
    .replace('[MEMBER_ID]', `<span class="font-mono text-amber-700 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">${member.membershipNumber || 'TBD'}</span>`)
    .replace('[ROLE]', `<strong class="text-orange-600 font-bold">${member.role === 'VOLUNTEER' ? 'স্বেচ্ছাসেবক' : 'সম্মানিত সদস্য'}</strong>`)
    .replace('[EVENT]', `<strong class="text-stone-900 font-bold">${eventName}</strong>`);

  const borderStyles = {
    classic: 'border-[16px] border-double border-amber-600',
    modern: 'border-[8px] border-solid border-orange-500 rounded-3xl',
    royal: 'border-[20px] border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50/20 relative before:content-[""] before:absolute before:inset-2 before:border-4 before:border-yellow-600'
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Landscape Container matching standard design ratios */}
      <div 
        ref={certRef}
        className="certificate-print-wrapper relative w-full max-w-[950px] h-[672px] bg-white p-12 flex flex-col justify-between shadow-2xl overflow-hidden rounded-xl border border-gray-100 select-none text-left"
        style={{ fontFamily: 'Hind Siliguri, Inter, sans-serif' }}
      >
        {/* Elegant Golden/Saffron Border Decoration */}
        <div 
          className={`absolute inset-0 pointer-events-none z-10 ${borderStyles[template.borderStyle] || borderStyles.classic}`} 
          style={{ borderColor: template.primaryColor }}
        ></div>
        
        {/* Watermark Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
          <img 
            src={orgLogo} 
            alt="watermark" 
            className="w-[450px] h-[450px] object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* TOP META BAR (No public approved badge, premium clean official layout) */}
        <div className="flex justify-between items-start z-10 relative">
          <div className="text-left font-mono text-[9px] text-amber-800 font-semibold uppercase tracking-wider space-y-0.5">
            <div>{orgNameEnglish} • Official Document</div>
            <div className="text-stone-500 font-bold">Cert. No: {certificateNumber}</div>
            <div className="text-stone-400">Recipient ID: {member.membershipNumber || 'TBD'}</div>
          </div>
          <div className="text-right text-[10px] text-amber-800 font-bold">
            <span className="bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
              স্বেচ্ছাসেবা ও সামাজিক উন্নয়ন সম্মাননা
            </span>
          </div>
        </div>

        {/* HEADER BLOCK */}
        <div className="text-center z-10 relative -mt-2">
          <div className="flex justify-center items-center gap-4 mb-2">
            <img 
              src={orgLogo} 
              alt="logo" 
              className="w-16 h-16 object-contain rounded-full border-2 border-amber-500 p-0.5 shadow-md bg-white"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <h1 className="text-2xl font-black text-amber-900 tracking-tight leading-none" style={{ color: template.primaryColor }}>
                {orgNameBangla}
              </h1>
              <p className="text-[11px] font-mono tracking-widest text-stone-500 uppercase font-bold mt-1">
                {orgNameEnglish}
              </p>
            </div>
          </div>
          <div className="h-0.5 w-60 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-3"></div>
          
          <h2 className="text-xl font-serif italic text-amber-800 font-extrabold uppercase tracking-widest">
            {template.title || 'সম্মাননা ও প্রশংসাপত্র'}
          </h2>
          <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mt-0.5">
            Certificate of Recognition & Service
          </p>
        </div>

        {/* CERTIFICATE BODY CONTENT */}
        <div className="text-center px-12 z-10 relative -mt-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold">
            This Certificate is proudly presented to
          </p>
          <h3 className="text-2xl font-extrabold text-amber-900 mt-1 mb-3">
            {member.banglaName} <span className="text-lg font-normal text-stone-500 font-mono">({member.englishName})</span>
          </h3>
          
          <div 
            className="text-sm text-stone-700 leading-relaxed max-w-2xl mx-auto whitespace-normal"
            dangerouslySetInnerHTML={{ __html: formattedBody }}
          ></div>
        </div>

        {/* BOTTOM METADATA & VALIDATION BLOCK */}
        <div className="flex justify-between items-end px-6 pb-2 z-10 relative">
          
          {/* Signatory Left (President) */}
          <div className="text-center w-40">
            <div className="h-10 flex items-center justify-center">
              <img 
                src="https://i.ibb.co.com/8m4Qk0g/signature.png" 
                alt="President Signature" 
                className="h-8 object-contain filter saturate-150"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="border-t border-amber-800/40 pt-1">
              <h4 className="text-[11px] font-extrabold text-stone-800">{template.signatory1Name}</h4>
              <p className="text-[8px] text-stone-400 font-bold uppercase tracking-wide">{template.signatory1Role}</p>
            </div>
          </div>

          {/* Premium Embedded Golden Seal & QR Security block */}
          <div className="flex items-center gap-6 bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/50">
            {/* Embedded QR Code (Scanner-ready) */}
            <div className="flex flex-col items-center bg-white p-1 rounded-lg border border-amber-200 shadow-sm">
              <svg className="w-14 h-14" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="22" height="22" fill="#1e293b" />
                <rect x="14" y="14" width="14" height="14" fill="white" />
                <rect x="18" y="18" width="6" height="6" fill="#1e293b" />

                <rect x="68" y="10" width="22" height="22" fill="#1e293b" />
                <rect x="72" y="14" width="14" height="14" fill="white" />
                <rect x="76" y="18" width="6" height="6" fill="#1e293b" />

                <rect x="10" y="68" width="22" height="22" fill="#1e293b" />
                <rect x="14" y="72" width="14" height="14" fill="white" />
                <rect x="18" y="76" width="6" height="6" fill="#1e293b" />

                <rect x="40" y="15" width="6" height="10" fill="#1e293b" />
                <rect x="50" y="25" width="10" height="6" fill="#1e293b" />
                <rect x="45" y="45" width="10" height="10" fill="#1e293b" />
                <rect x="25" y="45" width="6" height="12" fill="#1e293b" />
                <rect x="75" y="45" width="8" height="12" fill="#1e293b" />
                <rect x="70" y="68" width="6" height="18" fill="#1e293b" />
                <rect x="45" y="70" width="12" height="6" fill="#1e293b" />
                <rect x="52" y="80" width="8" height="8" fill="#1e293b" />
              </svg>
            </div>

            {/* Validation Data Text */}
            <div className="text-left font-mono text-[8px] text-stone-500 space-y-0.5">
              <div className="text-[9px] font-bold text-amber-900 tracking-tight">GES VERIFIED SECURITY</div>
              <div>Issue Date: {issueDate}</div>
              <div>Security Hash: {digitalHash}</div>
              <div className="text-stone-400 truncate w-36">{verificationUrl}</div>
            </div>

            {/* Premium Golden Seal Circle Graphic */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="absolute w-full h-full text-amber-500 animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M50,4 L55,14 L65,11 L68,22 L79,23 L76,34 L85,39 L78,48 L83,59 L73,65 L74,76 L63,78 L59,88 L48,84 L44,84 L33,88 L29,78 L18,76 L19,65 L9,59 L14,48 L7,39 L16,34 L13,23 L24,22 L27,11 L37,14 Z" fill="currentColor" opacity="0.1" />
                <path d="M50,4 L55,14 L65,11 L68,22 L79,23 L76,34 L85,39 L78,48 L83,59 L73,65 L74,76 L63,78 L59,88 L48,84 L44,84 L33,88 L29,78 L18,76 L19,65 L9,59 L14,48 L7,39 L16,34 L13,23 L24,22 L27,11 L37,14 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <img 
                src={orgLogo} 
                alt="Emblem" 
                className="w-8 h-8 object-contain rounded-full bg-white border border-amber-400 p-0.5"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Signatory Right (General Secretary) */}
          <div className="text-center w-40">
            <div className="h-10 flex items-center justify-center text-amber-900 font-serif font-bold italic text-sm">
              প্রান্ত দে
            </div>
            <div className="border-t border-amber-800/40 pt-1">
              <h4 className="text-[11px] font-extrabold text-stone-800">{template.signatory2Name}</h4>
              <p className="text-[8px] text-stone-400 font-bold uppercase tracking-wide">{template.signatory2Role}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Button controls wrapper (no footer credit inside) */}
      <div className="no-print mt-6 flex gap-4">
        <button 
          id="btn-print-certificate"
          onClick={handlePrint}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-white rounded-full font-bold shadow-lg hover:from-amber-700 hover:to-yellow-600 transition flex items-center gap-2 text-xs"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          সনদ প্রিন্ট / ডাউনলোড করুন
        </button>
      </div>
    </div>
  );
};
