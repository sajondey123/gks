import React from 'react';
import { Member, OrgSettings, ApplicationStatus } from '../types';

interface QRVerificationProps {
  memberId: string;
  members: Member[];
  settings: OrgSettings;
  onBackToHome: () => void;
}

export const QRVerificationComponent: React.FC<QRVerificationProps> = ({
  memberId,
  members,
  settings,
  onBackToHome,
}) => {
  const member = members.find(m => m.id === memberId || m.membershipNumber === memberId);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center p-4">
      {/* Container Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100 relative">
        {/* Colorful top bar */}
        <div className="h-3 bg-gradient-to-r from-orange-500 via-amber-400 to-red-500"></div>

        {/* Branding header */}
        <div className="p-6 text-center border-b border-gray-100 bg-amber-50/40">
          <img 
            src={settings.logoUrl} 
            alt="Logo" 
            className="w-16 h-16 mx-auto mb-2 object-contain rounded-full border-2 border-amber-400 shadow"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-xl font-extrabold text-amber-900 leading-snug">{settings.orgNameBangla}</h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{settings.orgNameEnglish}</p>
          <p className="text-[10px] text-amber-600 font-medium font-mono mt-1 italic">"{settings.slogan}"</p>
        </div>

        {member ? (
          <div className="p-6">
            {/* Status Badge */}
            <div className="flex flex-col items-center mb-6">
              {member.status === ApplicationStatus.APPROVED ? (
                <div className="flex flex-col items-center">
                  {/* Glowing Green Shield Icon */}
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 shadow-inner">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-sm font-extrabold text-green-700 tracking-wider bg-green-50 px-4 py-1.5 rounded-full border border-green-200 uppercase">
                    সদস্যতা বৈধ / VERIFIED
                  </span>
                </div>
              ) : member.status === ApplicationStatus.SUSPENDED ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-extrabold text-red-700 tracking-wider bg-red-50 px-4 py-1.5 rounded-full border border-red-200 uppercase">
                    স্থগিত / SUSPENDED
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-2">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-extrabold text-yellow-700 tracking-wider bg-yellow-50 px-4 py-1.5 rounded-full border border-yellow-200 uppercase">
                    আবেদন প্রক্রিয়াধীন / PENDING
                  </span>
                </div>
              )}
            </div>

            {/* Member Details */}
            <div className="space-y-4 border-t border-b border-gray-100 py-6">
              <div className="flex justify-center mb-4">
                <img 
                  src={member.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                  alt={member.englishName} 
                  className="w-28 h-32 object-cover rounded-xl border-4 border-amber-300 shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm leading-relaxed text-left">
                <div className="text-gray-500 font-medium col-span-1">নাম (Bangla):</div>
                <div className="text-gray-900 font-bold col-span-2">{member.banglaName}</div>

                <div className="text-gray-500 font-medium col-span-1">Name (English):</div>
                <div className="text-gray-900 font-bold col-span-2">{member.englishName}</div>

                <div className="text-gray-500 font-medium col-span-1">সদস্য আইডি:</div>
                <div className="text-orange-600 font-mono font-bold col-span-2">{member.membershipNumber}</div>

                <div className="text-gray-500 font-medium col-span-1">সংঘের পদবী:</div>
                <div className="col-span-2"><span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded font-bold uppercase">{member.role}</span></div>

                <div className="text-gray-500 font-medium col-span-1">রক্তের গ্রুপ:</div>
                <div className="text-red-600 font-bold col-span-2">{member.bloodGroup || 'O+'}</div>

                <div className="text-gray-500 font-medium col-span-1">যোগদানের তারিখ:</div>
                <div className="text-gray-900 col-span-2">{member.joinedDate}</div>

                <div className="text-gray-500 font-medium col-span-1">পেশা:</div>
                <div className="text-gray-900 col-span-2">{member.occupation}</div>

                <div className="text-gray-500 font-medium col-span-1">ধর্ম:</div>
                <div className="text-gray-900 col-span-2">{member.religion || 'সনাতন'}</div>
              </div>
            </div>

            {/* Official seal watermark representation */}
            <div className="text-center mt-6 text-xs text-gray-400 font-medium">
              <p>গণরাজ একতা সংঘ কেন্দ্রীয় ডাটাবেস দ্বারা যাচাইকৃত।</p>
              <p className="mt-1 font-mono text-[10px]">Verification Code: VERIFY-{member.id.substring(0, 10).toUpperCase()}</p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-extrabold text-red-900">যাচাইকরণ ব্যর্থ হয়েছে!</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              আপনার স্ক্যান করা সদস্য আইডিটি আমাদের সিস্টেমে খুঁজে পাওয়া যায়নি। আইডি কার্ডের সত্যতা নিশ্চিত করতে আমাদের কেন্দ্রীয় দপ্তরে যোগাযোগ করুন।
            </p>
          </div>
        )}

        {/* Back buttons */}
        <div className="p-6 bg-stone-50 border-t border-gray-100 text-center flex justify-center">
          <button 
            id="btn-verification-back"
            onClick={onBackToHome}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold shadow transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            অফিসিয়াল সাইটে ফিরুন
          </button>
        </div>
      </div>
    </div>
  );
};
