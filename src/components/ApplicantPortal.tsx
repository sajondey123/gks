import React, { useState } from 'react';
import { Member, OrgSettings, IdCardTemplate, CertificateTemplate, Notice, ApplicationStatus } from '../types';
import { IDCardTemplateComponent } from './IDCardTemplate';
import { CertificateTemplateComponent } from './CertificateTemplate';
import { sha256 } from '../lib/crypto';

interface ApplicantPortalProps {
  member: Member;
  settings: OrgSettings;
  idCardTemplate: IdCardTemplate;
  certificateTemplate: CertificateTemplate;
  notices: Notice[];
  onUpdateMember: (updated: Member) => void;
  onLogout: () => void;
}

export const ApplicantPortalComponent: React.FC<ApplicantPortalProps> = ({
  member,
  settings,
  idCardTemplate,
  certificateTemplate,
  notices,
  onUpdateMember,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'edit_profile' | 'id_card' | 'certificate' | 'alerts' | 'security'>('overview');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // 2FA state
  const [is2faEnabled, setIs2faEnabled] = useState(member.is2faEnabled || false);
  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [twoFactorSuccess, setTwoFactorSuccess] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [portalNotice, setPortalNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setPortalNotice(msg);
    setTimeout(() => setPortalNotice(null), 3500);
  };

  // Local state for editing profile
  const [banglaName, setBanglaName] = useState(member.banglaName);
  const [englishName, setEnglishName] = useState(member.englishName);
  const [mobile, setMobile] = useState(member.mobile);
  const [altMobile, setAltMobile] = useState(member.altMobile);
  const [presentAddress, setPresentAddress] = useState(member.presentAddress);
  const [permanentAddress, setPermanentAddress] = useState(member.permanentAddress);
  const [occupation, setOccupation] = useState(member.occupation);
  const [qualification, setQualification] = useState(member.qualification);
  const [workplace, setWorkplace] = useState(member.workplace);
  const [photoUrl, setPhotoUrl] = useState(member.photoUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMember: Member = {
      ...member,
      banglaName,
      englishName,
      mobile,
      altMobile,
      presentAddress,
      permanentAddress,
      occupation,
      qualification,
      workplace,
      photoUrl,
    };
    onUpdateMember(updatedMember);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const statusProgress = {
    [ApplicationStatus.PENDING]: 33,
    [ApplicationStatus.APPROVED]: 100,
    [ApplicationStatus.REJECTED]: 10,
    [ApplicationStatus.SUSPENDED]: 0,
  };

  const statusColors = {
    [ApplicationStatus.PENDING]: 'bg-amber-500 text-white',
    [ApplicationStatus.APPROVED]: 'bg-green-600 text-white',
    [ApplicationStatus.REJECTED]: 'bg-red-600 text-white',
    [ApplicationStatus.SUSPENDED]: 'bg-slate-600 text-white',
  };

  const statusLabels = {
    [ApplicationStatus.PENDING]: 'আবেদন প্রক্রিয়াধীন (Pending Approval)',
    [ApplicationStatus.APPROVED]: 'সদস্যপদ অনুমোদিত (Active Member)',
    [ApplicationStatus.REJECTED]: 'আবেদন নামঞ্জুর (Rejected)',
    [ApplicationStatus.SUSPENDED]: 'সদস্যপদ সাময়িক স্থগিত (Suspended)',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner with Saffron Theme */}
      <div className="bg-gradient-to-r from-[#FF9933] to-[#FF6321] rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        {/* Background Accent Graphics */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-12 -translate-y-12"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-left">
            <img 
              src={member.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
              alt={member.englishName} 
              className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{member.banglaName}</h1>
                <span className="bg-white/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest text-white">
                  {member.role}
                </span>
              </div>
              <p className="text-sm opacity-90 font-mono mt-1">ID: {member.membershipNumber || 'TBD'}</p>
              <p className="text-xs text-orange-100 mt-0.5">রক্তের গ্রুপ: {member.bloodGroup} | {member.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              id="btn-portal-logout"
              onClick={onLogout}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full transition border border-white/15"
            >
              লগআউট (Logout)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-fit space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-4 text-left">আমার মেনু (Portal Menu)</p>
          
          <button 
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-3 ${activeTab === 'overview' ? 'bg-slate-100 text-[#FF6321]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            ড্যাশবোর্ড ওভারভিউ
          </button>

          <button 
            id="tab-edit-profile"
            onClick={() => setActiveTab('edit_profile')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-3 ${activeTab === 'edit_profile' ? 'bg-slate-100 text-[#FF6321]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            প্রোফাইল আপডেট করুন
          </button>

          <button 
            id="tab-id-card"
            onClick={() => setActiveTab('id_card')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-3 ${activeTab === 'id_card' ? 'bg-slate-100 text-[#FF6321]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a3 3 0 100-6 3 3 0 000 6zm5 6a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            আমার ডিজিটাল আইডি কার্ড
          </button>

          <button 
            id="tab-certificate"
            onClick={() => setActiveTab('certificate')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-3 ${activeTab === 'certificate' ? 'bg-slate-100 text-[#FF6321]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 9" />
            </svg>
            প্রশংসাপত্র / সার্টিফিকেট
          </button>

          <button 
            id="tab-alerts"
            onClick={() => setActiveTab('alerts')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-3 ${activeTab === 'alerts' ? 'bg-slate-100 text-[#FF6321]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            বিজ্ঞপ্তি ও এলার্টস
          </button>

          <button 
            id="tab-security"
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-3 ${activeTab === 'security' ? 'bg-slate-100 text-[#FF6321]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            নিরাপত্তা সেটিংস (Security)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="lg:col-span-3 text-left">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Profile Verification & Progress Status Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">আবেদনের বর্তমান অবস্থা (Registration Status)</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusColors[member.status]}`}>
                    {statusLabels[member.status]}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Status: {member.status}</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
                  <div 
                    className="bg-gradient-to-r from-[#FF9933] to-[#FF6321] h-full transition-all duration-500"
                    style={{ width: `${statusProgress[member.status]}%` }}
                  ></div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {member.status === ApplicationStatus.APPROVED 
                    ? 'অভিনন্দন! আপনার আবেদনটি সফলভাবে যাচাইকৃত ও অনুমোদিত হয়েছে। এখন আপনি ডিজিটাল আইডি কার্ড ও সার্টিফিকেট ডাউনলোড করতে পারবেন।'
                    : 'আপনার জমা দেওয়া তথ্যসমূহ আমাদের কার্যকরী কমিটি যাচাই করছে। ৩ কার্যদিবসের মধ্যে আপনার নিবন্ধিত মোবাইলে এসএমএস বা ইমেইলে ফলাফল জানিয়ে দেওয়া হবে।'}
                </p>
              </div>

              {/* Personal Details Dashboard Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">ব্যক্তিগত বিবরণ (Personal Dossier)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold">পিতার নাম (Father's Name)</p>
                    <p className="text-slate-800 font-bold mt-0.5">{member.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-semibold">মাতার নাম (Mother's Name)</p>
                    <p className="text-slate-800 font-bold mt-0.5">{member.motherName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-semibold">জন্ম তারিখ (Date of Birth)</p>
                    <p className="text-slate-800 font-bold mt-0.5">{member.dob}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-semibold">লিঙ্গ (Gender)</p>
                    <p className="text-slate-800 font-bold mt-0.5">{member.gender}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-semibold">শিক্ষাগত যোগ্যতা (Education)</p>
                    <p className="text-slate-800 font-bold mt-0.5">{member.qualification}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-semibold">পেশা ও কর্মস্থল (Occupation & Workplace)</p>
                    <p className="text-slate-800 font-bold mt-0.5">{member.occupation} - {member.workplace || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-slate-400 text-xs font-semibold">বর্তমান ঠিকানা (Present Address)</p>
                    <p className="text-slate-800 font-bold mt-0.5">{member.presentAddress}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-slate-400 text-xs font-semibold">স্থায়ী ঠিকানা (Permanent Address)</p>
                    <p className="text-slate-800 font-bold mt-0.5">{member.permanentAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'edit_profile' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">প্রোফাইল তথ্য সংশোধন করুন (Edit Profile)</h3>
              
              {saveSuccess && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl text-xs font-bold border border-green-200 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  আপনার তথ্যগুলো সফলভাবে সংশোধন করা হয়েছে!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">পূর্ণ নাম (বাংলায়)</label>
                    <input 
                      type="text" 
                      value={banglaName} 
                      onChange={e => setBanglaName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#FF6321] transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Full Name (English)</label>
                    <input 
                      type="text" 
                      value={englishName} 
                      onChange={e => setEnglishName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#FF6321] transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">মোবাইল নম্বর</label>
                    <input 
                      type="text" 
                      value={mobile} 
                      onChange={e => setMobile(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#FF6321] transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">বিকল্প মোবাইল নম্বর</label>
                    <input 
                      type="text" 
                      value={altMobile} 
                      onChange={e => setAltMobile(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#FF6321] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">শিক্ষাগত যোগ্যতা</label>
                    <input 
                      type="text" 
                      value={qualification} 
                      onChange={e => setQualification(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#FF6321] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">পেশা</label>
                    <input 
                      type="text" 
                      value={occupation} 
                      onChange={e => setOccupation(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#FF6321] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">কর্মস্থল</label>
                    <input 
                      type="text" 
                      value={workplace} 
                      onChange={e => setWorkplace(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#FF6321] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">প্রোফাইল ছবি লিংক</label>
                    <input 
                      type="text" 
                      value={photoUrl} 
                      onChange={e => setPhotoUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#FF6321] transition"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">বর্তমান ঠিকানা</label>
                    <textarea 
                      value={presentAddress} 
                      onChange={e => setPresentAddress(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#FF6321] transition resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">স্থায়ী ঠিকানা</label>
                    <textarea 
                      value={permanentAddress} 
                      onChange={e => setPermanentAddress(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#FF6321] transition resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button 
                    id="btn-profile-submit"
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#FF9933] to-[#FF6321] text-white rounded-full font-bold shadow-md hover:brightness-105 transition text-sm"
                  >
                    তথ্য সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'id_card' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-6 max-w-lg mx-auto">
              {member.idCardApprovedState === 'APPROVED' ? (
                <>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">আপনার ডিজিটাল পিভিসি আইডি কার্ড</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      CR-80 পিভিসি ফরম্যাটে প্রিন্ট-উপযোগী কার্ড। এটি আপনার যাচাইকৃত আইডি হিসেবে মন্দিরে প্রবেশ ও উৎসবে ব্যবহার্য।
                    </p>
                  </div>

                  <div className="flex justify-center p-4 bg-slate-50 rounded-2xl overflow-x-auto">
                    <IDCardTemplateComponent 
                      member={member} 
                      template={idCardTemplate} 
                      orgNameBangla={settings.orgNameBangla} 
                      orgNameEnglish={settings.orgNameEnglish} 
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4 py-8">
                  <div className="text-4xl">⏳</div>
                  <h3 className="text-lg font-black text-slate-800">আইডি কার্ড চূড়ান্ত অনুমোদনের জন্য অপেক্ষমান</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                    আপনার ডিজিটাল আইডি কার্ডের খসড়াটি বর্তমানে কার্যকরী কমিটির সভাপতি ও সুপার এডমিনের (স্বজন দে) চূড়ান্ত অনুমোদনের জন্য অপেক্ষমান রয়েছে। অনুমোদন সম্পন্ন হলে এখানে আপনার ডিজিটাল আইডি কার্ডটি প্রদর্শিত হবে।
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-6 max-w-lg mx-auto">
              {member.certificateApprovedState === 'APPROVED' ? (
                <>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">অফিসিয়াল প্রশংসাপত্র / সনদপত্র</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      গণরাজ একতা সংঘের সম্মানিত সদস্য বা স্বেচ্ছাসেবক হিসেবে সমাজসেবা কাজের রাষ্ট্রীয় মান প্রশংসাপত্র।
                    </p>
                  </div>

                  <div className="flex justify-center p-4 bg-slate-50 rounded-2xl overflow-x-auto">
                    <CertificateTemplateComponent 
                      member={member} 
                      template={certificateTemplate} 
                      settings={settings}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4 py-8">
                  <div className="text-4xl">⏳</div>
                  <h3 className="text-lg font-black text-slate-800">শংসাপত্র চূড়ান্ত অনুমোদনের জন্য অপেক্ষমান</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                    আপনার সম্মাননা প্রশংসাপত্রের খসড়াটি বর্তমানে কার্যকরী কমিটির সভাপতি ও সুপার এডমিনের (স্বজন দে) চূড়ান্ত অনুমোদনের জন্য অপেক্ষমান রয়েছে। অনুমোদন সম্পন্ন হলে এখানে আপনার শংসাপত্রটি প্রদর্শিত হবে।
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-8 text-left">
              <div>
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">নিরাপত্তা সেটিংস (Account Security)</h3>
                <p className="text-xs text-slate-500 mt-1">আপনার পাসওয়ার্ড পরিবর্তন করে অ্যাকাউন্ট সুরক্ষিত রাখুন।</p>
              </div>

              {/* Password change form */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-orange-600 uppercase tracking-widest">পাসওয়ার্ড পরিবর্তন করুন</h4>
                
                {passwordError && (
                  <div className="p-3 bg-red-50 text-red-700 font-bold rounded-xl text-xs border border-red-200">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-green-50 text-green-700 font-bold rounded-xl text-xs border border-green-200">
                    সফল! আপনার পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে।
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">বর্তমান পাসওয়ার্ড</label>
                    <input 
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">নতুন শক্তিশালী পাসওয়ার্ড</label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[10px] text-stone-500 leading-relaxed">
                  <span className="font-bold text-orange-600">পাসওয়ার্ড নীতি:</span> কমপক্ষে ৮টি অক্ষর দীর্ঘ হতে হবে এবং অন্তত ১টি বড় হাতের অক্ষর (A-Z), ১টি ছোট হাতের অক্ষর (a-z), ১টি সংখ্যা (0-9), এবং ১টি বিশেষ চিহ্ন (!@#$) থাকতে হবে।
                </div>

                <button 
                  onClick={async () => {
                    setPasswordError(null);
                    setPasswordSuccess(false);

                    if (!currentPassword || !newPassword || !confirmPassword) {
                      setPasswordError('দয়া করে সবগুলি ফিল্ড পূরণ করুন।');
                      return;
                    }

                    const computedHash = await sha256(currentPassword + member.passwordSalt);
                    if (computedHash !== member.passwordHash) {
                      setPasswordError('বর্তমান পাসওয়ার্ডটি সঠিক নয়!');
                      return;
                    }

                    // Strength check
                    const hasUpper = /[A-Z]/.test(newPassword);
                    const hasLower = /[a-z]/.test(newPassword);
                    const hasDigit = /[0-9]/.test(newPassword);
                    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(newPassword);
                    if (newPassword.length < 8 || !hasUpper || !hasLower || !hasDigit || !hasSpecial) {
                      setPasswordError('পাসওয়ার্ডটি পর্যাপ্ত শক্তিশালী নয়। নীতি অনুসরণ করুন।');
                      return;
                    }

                    if (newPassword !== confirmPassword) {
                      setPasswordError('নতুন পাসওয়ার্ড দুটি মিলছে না!');
                      return;
                    }

                    const newHash = await sha256(newPassword + member.passwordSalt);
                    onUpdateMember({
                      ...member,
                      passwordHash: newHash
                    });
                    
                    setPasswordSuccess(true);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-5 py-2.5 bg-[#FF6321] text-white font-bold rounded-xl text-xs hover:brightness-105 shadow transition"
                >
                  পাসওয়ার্ড আপডেট করুন
                </button>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">ঘোষণা ও নোটিশ বোর্ড (Official Broadcasts)</h3>
              
              <div className="space-y-4">
                {notices.map(notice => (
                  <div key={notice.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 relative text-left">
                    {notice.isPinned && (
                      <span className="absolute top-4 right-4 bg-[#FF6321] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                        PINNED
                      </span>
                    )}
                    <h4 className="text-md font-bold text-slate-900 pr-16">{notice.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">প্রকাশের তারিখ: {notice.publishDate} | ক্যাটাগরি: {notice.category}</p>
                    <p className="text-slate-600 text-sm mt-3 leading-relaxed whitespace-pre-line">{notice.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
