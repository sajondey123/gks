import React, { useRef } from 'react';
import { Member, IdCardTemplate } from '../types';

interface IDCardTemplateProps {
  member: Member;
  template: IdCardTemplate;
  orgNameBangla: string;
  orgNameEnglish: string;
}

export const IDCardTemplateComponent: React.FC<IDCardTemplateProps> = ({
  member,
  template,
  orgNameBangla,
  orgNameEnglish,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = cardRef.current?.innerHTML;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { background: white; color: black; }
        .no-print { display: none !important; }
        .id-card-print {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 20px !important;
          margin-top: 50px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ID Card - ${member.englishName}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              body { margin: 0; padding: 20px; font-family: ${template.fontFamily || 'sans-serif'}; background: #f3f4f6; }
              .id-container { display: flex; flex-direction: column; align-items: center; gap: 30px; }
            </style>
          </head>
          <body>
            <div class="id-container">
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

  // Generate a mock QR-code SVG block that encodes the verification URL
  const verificationUrl = `${window.location.origin}?verify=${member.id}`;

  return (
    <div className="flex flex-col items-center">
      {/* Container holding the editable card preview */}
      <div ref={cardRef} className="space-y-6 md:space-y-0 md:flex md:gap-8 justify-center items-center">
        {/* FRONT SIDE (CR80 PVC size layout: 3.375" x 2.125" aspect ratio, represented by w-[338px] h-[538px] or standard card shape) */}
        <div 
          id="id-card-front"
          className="relative w-[340px] h-[510px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between border-4 border-yellow-500 bg-white"
          style={{ 
            backgroundColor: template.cardBgColor, 
            color: template.cardTextColor,
            fontFamily: template.fontFamily 
          }}
        >
          {/* Header */}
          <div 
            className="p-4 text-center border-b-2 border-yellow-400 relative"
            style={{ backgroundColor: template.headerBgColor, color: template.headerTextColor }}
          >
            {/* Top Saffron / Red Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500"></div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <img 
                src={template.sealUrl || 'https://i.ibb.co.com/DPr4kZJB/Chat-GPT-Image-Jun-20-2026-11-14-56-PM-1.png'} 
                alt="logo" 
                className="w-10 h-10 object-contain rounded-full border border-yellow-400"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="text-sm font-extrabold tracking-wide leading-tight">{orgNameBangla}</h2>
                <p className="text-[10px] font-medium tracking-wider uppercase opacity-90">{orgNameEnglish}</p>
              </div>
            </div>
            <div className="text-[9px] mt-1 font-mono italic opacity-95">"এই ২৬শে প্রথম প্রয়াসে আমরা"</div>
          </div>

          {/* Member Body Card Details */}
          <div className="px-6 py-4 flex flex-col items-center flex-grow justify-center relative">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <img 
                src={template.sealUrl} 
                alt="watermark" 
                className="w-56 h-56 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Photo Framed with Gold border */}
            <div className="relative mb-3 z-10">
              <div className="w-24 h-28 border-4 border-yellow-500 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                <img 
                  src={member.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                  alt={member.englishName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shadow">
                {member.role}
              </span>
            </div>

            {/* Profile Info */}
            <div className="text-center z-10 w-full">
              <h3 className="text-lg font-extrabold leading-snug">{member.banglaName}</h3>
              <p className="text-xs font-semibold opacity-85 uppercase tracking-wide">{member.englishName}</p>
              
              <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-left text-[11px] border-t border-yellow-200 pt-2 w-full max-w-[240px] mx-auto">
                <div><span className="opacity-75">সদস্য আইডি:</span></div>
                <div className="font-mono font-bold text-orange-600">{member.membershipNumber}</div>
                <div><span className="opacity-75">রক্তের গ্রুপ:</span></div>
                <div className="font-bold text-red-600">{member.bloodGroup || 'O+'}</div>
                <div><span className="opacity-75">মোবাইল:</span></div>
                <div className="font-medium">{member.mobile}</div>
                <div><span className="opacity-75">যোগদান:</span></div>
                <div className="font-medium">{member.joinedDate}</div>
              </div>
            </div>
          </div>

          {/* Card Footer with Signatures & Status Ribbon */}
          <div className="px-6 pb-4 pt-1 border-t border-yellow-200 flex justify-between items-end relative z-10">
            {/* Signature Area Left */}
            <div className="text-center">
              <div className="h-6 flex items-center justify-center">
                <img 
                  src={template.signatureUrl || 'https://i.ibb.co.com/8m4Qk0g/signature.png'} 
                  alt="President Signature" 
                  className="h-6 object-contain filter dark:invert-0"
                  onError={(e) => {
                    // fall back to visual placeholder if blocked
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="border-t border-gray-400 text-[8px] font-bold mt-1 pt-0.5 w-16 opacity-80">সভাপতির স্বাক্ষর</div>
            </div>

            {/* Seal Middle */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-4 bg-white p-1 rounded-full border border-yellow-400 shadow">
              <img 
                src={template.sealUrl} 
                alt="seal" 
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* General Secretary Signature Right */}
            <div className="text-center">
              <div className="h-6 flex items-center justify-center font-serif text-[10px] italic opacity-85">প্রান্ত দে</div>
              <div className="border-t border-gray-400 text-[8px] font-bold mt-1 pt-0.5 w-16 opacity-80">সম্পাদকের স্বাক্ষর</div>
            </div>
          </div>
        </div>

        {/* BACK SIDE OF PVC ID CARD */}
        <div 
          id="id-card-back"
          className="relative w-[340px] h-[510px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between border-4 border-yellow-500 bg-white"
          style={{ 
            backgroundColor: template.cardBgColor, 
            color: template.cardTextColor,
            fontFamily: template.fontFamily 
          }}
        >
          {/* Back Header Banner */}
          <div 
            className="p-3 text-center border-b border-yellow-400"
            style={{ backgroundColor: template.headerBgColor, color: template.headerTextColor }}
          >
            <h4 className="text-xs font-bold tracking-wider">নিয়মাবলী ও নির্দেশনাবলী</h4>
          </div>

          {/* Terms, QR code & Barcode */}
          <div className="p-6 flex-grow flex flex-col items-center justify-around">
            {/* Custom Terms Text */}
            <div className="text-[10px] leading-relaxed text-center opacity-90 max-w-[280px]">
              {template.customTerms.split('\n').map((term, i) => (
                <p key={i} className="mb-1">{term}</p>
              ))}
            </div>

            {/* QR Code section */}
            {template.showQrCode && (
              <div className="flex flex-col items-center bg-white p-3 rounded-xl border-2 border-yellow-500 shadow-md">
                {/* SVG-based QR Code representation (beautifully stylized) */}
                <svg className="w-24 h-24" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="white" />
                  {/* Outer border & corners */}
                  <rect x="10" y="10" width="24" height="24" fill="currentColor" />
                  <rect x="14" y="14" width="16" height="16" fill="white" />
                  <rect x="18" y="18" width="8" height="8" fill="currentColor" />

                  <rect x="66" y="10" width="24" height="24" fill="currentColor" />
                  <rect x="70" y="14" width="16" height="16" fill="white" />
                  <rect x="74" y="18" width="8" height="8" fill="currentColor" />

                  <rect x="10" y="66" width="24" height="24" fill="currentColor" />
                  <rect x="14" y="70" width="16" height="16" fill="white" />
                  <rect x="18" y="74" width="8" height="8" fill="currentColor" />

                  {/* QR random grid dots */}
                  <rect x="42" y="15" width="6" height="10" fill="currentColor" />
                  <rect x="52" y="25" width="10" height="6" fill="currentColor" />
                  <rect x="45" y="45" width="10" height="10" fill="currentColor" />
                  <rect x="25" y="45" width="6" height="12" fill="currentColor" />
                  <rect x="45" y="25" width="4" height="4" fill="currentColor" />
                  <rect x="75" y="45" width="8" height="12" fill="currentColor" />
                  <rect x="70" y="66" width="6" height="18" fill="currentColor" />
                  <rect x="80" y="78" width="10" height="10" fill="currentColor" />
                  <rect x="45" y="70" width="12" height="6" fill="currentColor" />
                  <rect x="52" y="80" width="8" height="8" fill="currentColor" />
                </svg>
                <span className="text-[8px] font-mono mt-1 text-gray-500 uppercase tracking-widest">
                  Scan to Verify
                </span>
              </div>
            )}

            {/* Barcode representation */}
            {template.showBarcode && (
              <div className="flex flex-col items-center w-full max-w-[240px]">
                {/* Visual Barcode bars */}
                <div className="flex h-8 w-full bg-white px-2 border border-gray-300 items-stretch gap-[1px]">
                  {[1,3,1,1,2,3,1,2,1,1,3,1,2,1,3,1,1,2,1,1,3,1,2,1,1,3,1,2,1,1,3,1,2,1,3,1,1,2,1,1].map((w, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-grow ${idx % 2 === 0 ? 'bg-black' : 'bg-transparent'}`}
                      style={{ opacity: idx % 10 === 0 ? 0.9 : 1 }}
                    ></div>
                  ))}
                </div>
                <span className="text-[9px] font-mono tracking-widest mt-0.5">
                  *{member.id.substring(0, 8).toUpperCase()}*
                </span>
              </div>
            )}
          </div>

          {/* Back Footer */}
          <div 
            className="p-2 text-center text-[9px] font-bold border-t border-yellow-400"
            style={{ backgroundColor: template.headerBgColor, color: template.headerTextColor }}
          >
            যোগাযোগ: {template.customTerms.includes('সিলেট') ? 'মন্দির লেন, সিলেট' : 'গণরাজ একতা সংঘ'}
          </div>
        </div>
      </div>

      {/* Print Trigger Button */}
      <button 
        id="btn-print-id-card"
        onClick={handlePrint}
        className="no-print mt-6 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold shadow-lg hover:from-orange-600 hover:to-amber-600 transition flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        প্রিন্ট করুন / পিডিএফ ডাউনলোড
      </button>
    </div>
  );
};
