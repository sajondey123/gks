import React, { useState } from 'react';
import { Member, MemberRole, ApplicationStatus } from '../types';

interface RegistrationFormProps {
  onRegisterSubmit: (applicant: Omit<Member, 'id' | 'membershipNumber' | 'role' | 'status' | 'joinedDate'>) => void;
  onNavigate: (view: string) => void;
}

export const RegistrationFormComponent: React.FC<RegistrationFormProps> = ({
  onRegisterSubmit,
  onNavigate,
}) => {
  // Input fields state
  const [banglaName, setBanglaName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('পুরুষ');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [religion, setReligion] = useState('সনাতন');
  const [maritalStatus, setMaritalStatus] = useState('অবিবাহিত');
  const [nationality, setNationality] = useState('বাংলাদেশী');

  const [mobile, setMobile] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [email, setEmail] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [presentAddress, setPresentAddress] = useState('');

  const [qualification, setQualification] = useState('');
  const [occupation, setOccupation] = useState('');
  const [workplace, setWorkplace] = useState('');

  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyMobile, setEmergencyMobile] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [declaration, setDeclaration] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaration) {
      alert('দয়া করে ঘোষণা বাক্সে টিক চিহ্ন দিন।');
      return;
    }

    const applicant = {
      username: englishName.toLowerCase().replace(/\s/g, ''),
      banglaName,
      englishName,
      fatherName,
      motherName,
      dob,
      gender,
      bloodGroup,
      religion,
      maritalStatus,
      nationality,
      mobile,
      altMobile,
      email,
      permanentAddress,
      presentAddress,
      qualification,
      occupation,
      workplace,
      emergencyName,
      emergencyRelation,
      emergencyMobile,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    };

    onRegisterSubmit(applicant);
    setSubmitSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 relative overflow-hidden text-left">
        {/* Saffron accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] to-[#FF6321]"></div>

        {submitSuccess ? (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto animate-bounce">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-green-700">আবেদনপত্র সফলভাবে দাখিল হয়েছে!</h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
              ধন্যবাদ! গণরাজ একতা সংঘের অনলাইন সদস্যপদের আবেদনপত্র আমাদের কেন্দ্রীয় সিস্টেমে জমা হয়েছে। আমাদের কার্যকরী কমিটি আপনার প্রদানকৃত তথ্যসমূহ ৩ কার্যদিবসের মধ্যে যাচাই করবে। 
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl max-w-md mx-auto border border-slate-200 text-xs text-slate-800 leading-relaxed space-y-2">
              <p className="font-bold">🔑 পোর্টাল লগইন ও ভেরিফিকেশন করার নিয়ম:</p>
              <p>১. আপনার ইমেইল এড্রেস দিয়ে সদস্য পোর্টালে ইনস্ট্যান্টলি লগইন করতে পারবেন।</p>
              <p>২. অনুমোদন সম্পন্ন হলে আপনি ওখান থেকে আপনার পিভিসি আইডি কার্ড এবং প্রশংসাপত্র প্রিন্ট করতে পারবেন।</p>
            </div>
            <div className="pt-4 flex justify-center gap-4">
              <button 
                onClick={() => onNavigate('home')}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full text-xs shadow-sm transition"
              >
                হোমপেজে ফিরুন
              </button>
              <button 
                onClick={() => onNavigate('portal')}
                className="px-6 py-2.5 bg-[#FF6321] hover:bg-[#FF6321]/90 text-white font-bold rounded-full text-xs shadow-sm transition"
              >
                সদস্য পোর্টালে যান
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center border-b border-slate-100 pb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">অনলাইন সদস্যপদ নিবন্ধন ফরম</h2>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Official Online Membership Application Portal</p>
            </div>

            {/* A. PERSONAL INFO */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#FF6321] uppercase tracking-widest border-l-4 border-[#FF6321] pl-2">১. ব্যক্তিগত তথ্য (Personal Details)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">পূর্ণ নাম (বাংলায়)</label>
                  <input 
                    type="text" 
                    value={banglaName} 
                    onChange={e => setBanglaName(e.target.value)}
                    placeholder="যেমন: প্রান্ত শর্মা"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Full Name (English)</label>
                  <input 
                    type="text" 
                    value={englishName} 
                    onChange={e => setEnglishName(e.target.value)}
                    placeholder="যেমন: Pranta Sharma"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">পিতার নাম</label>
                  <input 
                    type="text" 
                    value={fatherName} 
                    onChange={e => setFatherName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">মাতার নাম</label>
                  <input 
                    type="text" 
                    value={motherName} 
                    onChange={e => setMotherName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">জন্ম তারিখ</label>
                  <input 
                    type="date" 
                    value={dob} 
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">লিঙ্গ (Gender)</label>
                  <select 
                    value={gender} 
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                  >
                    <option value="পুরুষ">পুরুষ (Male)</option>
                    <option value="নারী">নারী (Female)</option>
                    <option value="অন্যান্য">অন্যান্য (Other)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">রক্তের গ্রুপ (Blood Group)</label>
                  <select 
                    value={bloodGroup} 
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">ধর্ম (Religion)</label>
                  <input 
                    type="text" 
                    value={religion} 
                    onChange={e => setReligion(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* B. CONTACT DETAILS */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#FF6321] uppercase tracking-widest border-l-4 border-[#FF6321] pl-2">২. যোগাযোগের ঠিকানা (Contact Info)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">মোবাইল নম্বর (প্রধান)</label>
                  <input 
                    type="text" 
                    value={mobile} 
                    onChange={e => setMobile(e.target.value)}
                    placeholder="০১xxxxxxxxx"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">বিকল্প মোবাইল নম্বর</label>
                  <input 
                    type="text" 
                    value={altMobile} 
                    onChange={e => setAltMobile(e.target.value)}
                    placeholder="০১xxxxxxxxx"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">ইমেইল এড্রেস</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">বর্তমান ঠিকানা (Present Address)</label>
                  <textarea 
                    value={presentAddress} 
                    onChange={e => setPresentAddress(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition resize-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">স্থায়ী ঠিকানা (Permanent Address)</label>
                  <textarea 
                    value={permanentAddress} 
                    onChange={e => setPermanentAddress(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* C. EDUCATION & OCCUPATION */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#FF6321] uppercase tracking-widest border-l-4 border-[#FF6321] pl-2">৩. শিক্ষাগত ও পেশাগত যোগ্যতা (Education & Occupation)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">শিক্ষাগত যোগ্যতা</label>
                  <input 
                    type="text" 
                    value={qualification} 
                    onChange={e => setQualification(e.target.value)}
                    placeholder="যেমন: এম.এ / বি.এস.সি"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">পেশা (Occupation)</label>
                  <input 
                    type="text" 
                    value={occupation} 
                    onChange={e => setOccupation(e.target.value)}
                    placeholder="যেমন: চাকুরিজীবী / ব্যবসায়ী"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">কর্মস্থল (Workplace)</label>
                  <input 
                    type="text" 
                    value={workplace} 
                    onChange={e => setWorkplace(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321]"
                  />
                </div>
              </div>
            </div>

            {/* D. EMERGENCY CONTACT */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#FF6321] uppercase tracking-widest border-l-4 border-[#FF6321] pl-2">৪. জরুরী যোগাযোগ (Emergency Contact)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">যোগাযোগের ব্যক্তির নাম</label>
                  <input 
                    type="text" 
                    value={emergencyName} 
                    onChange={e => setEmergencyName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">সম্পর্ক (Relation)</label>
                  <input 
                    type="text" 
                    value={emergencyRelation} 
                    onChange={e => setEmergencyRelation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">জরুরী মোবাইল নম্বর</label>
                  <input 
                    type="text" 
                    value={emergencyMobile} 
                    onChange={e => setEmergencyMobile(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* E. PHOTOS UPLOAD */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#FF6321] uppercase tracking-widest border-l-4 border-[#FF6321] pl-2">৫. ছবি ও ঘোষণা (Upload Photo)</h3>
              <div className="text-xs">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">প্রোফাইল ছবি লিংক (URL Link)</label>
                <input 
                  type="text" 
                  value={photoUrl} 
                  onChange={e => setPhotoUrl(e.target.value)}
                  placeholder="যেমন: https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6321] transition"
                />
              </div>
            </div>

            {/* Declaration check box */}
            <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="checkbox-declaration" 
                checked={declaration} 
                onChange={e => setDeclaration(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-[#FF6321] focus:ring-[#FF6321] mt-0.5 cursor-pointer"
                required
              />
              <label htmlFor="checkbox-declaration" className="text-xs text-slate-600 cursor-pointer select-none leading-relaxed">
                আমি ঘোষণা করছি যে উপরে প্রদত্ত সকল তথ্য সম্পূর্ণ সত্য এবং নির্ভরযোগ্য। আমার কোনো সমাজবিরোধী বা রাষ্ট্রবিরোধী কার্যকলাপের ইতিহাস নেই। ভুল তথ্য দিলে আমার আবেদন বাতিল হবে।
              </label>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <button 
                id="btn-register-form-back"
                type="button" 
                onClick={() => onNavigate('home')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full text-xs shadow-sm transition"
              >
                বাতিল (Cancel)
              </button>
              <button 
                id="btn-register-form-submit"
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-[#FF9933] to-[#FF6321] hover:brightness-105 text-white font-bold rounded-full text-xs shadow-md transition"
              >
                আবেদন জমা দিন (Submit Registration)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
