import React, { useState } from 'react';
import { 
  OrgSettings, HomepageSection, CommitteeTerm, Notice, EventItem, 
  DonationCategory, Member, MemberRole, ApplicationStatus 
} from '../types';

interface PublicHomeProps {
  settings: OrgSettings;
  sections: HomepageSection[];
  committeeTerm: CommitteeTerm;
  notices: Notice[];
  events: EventItem[];
  donationCategories: DonationCategory[];
  members: Member[];
  onNavigate: (view: string) => void;
  onAddDonationAmount: (catId: string, amount: number) => void;
  onRegisterVolunteer: (eventId: string, memberId: string) => void;
}

export const PublicHomeComponent: React.FC<PublicHomeProps> = ({
  settings,
  sections,
  committeeTerm,
  notices,
  events,
  donationCategories,
  members,
  onNavigate,
  onAddDonationAmount,
  onRegisterVolunteer,
}) => {
  // Sort sections by their dynamic admin-defined order
  const activeSections = [...sections]
    .filter(sec => sec.enabled)
    .sort((a, b) => a.order - b.order);

  // States for interactive simulations
  const [selectedDonationCategory, setSelectedDonationCategory] = useState<DonationCategory | null>(null);
  const [customDonationAmount, setCustomDonationAmount] = useState<number>(1000);
  const [donorName, setDonorName] = useState('');
  const [donorMobile, setDonorMobile] = useState('');
  const [donationSuccess, setDonationSuccess] = useState(false);

  const [activeNoticePopup, setActiveNoticePopup] = useState<Notice | null>(
    notices.find(n => n.isPopup) || null
  );

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonationCategory) return;
    onAddDonationAmount(selectedDonationCategory.id, customDonationAmount);
    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      setSelectedDonationCategory(null);
      setDonorName('');
      setDonorMobile('');
    }, 3000);
  };

  return (
    <div className="space-y-16 pb-20 select-none">
      
      {/* 1. POPUP NOTICE IF ANY PINNED POPUP IS ON */}
      {activeNoticePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-4 border-[#FF6321] shadow-2xl relative animate-in fade-in-50 duration-300">
            <span className="absolute top-4 right-4 text-xs font-semibold bg-slate-100 text-slate-500 hover:bg-slate-200 px-3 py-1 rounded-full cursor-pointer transition" onClick={() => setActiveNoticePopup(null)}>
              বন্ধ করুন (✕)
            </span>
            <div className="text-center mb-4">
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1 rounded-full border border-red-100 uppercase tracking-widest">
                জরুরী নোটিশ / Alert Broadcast
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-3">{activeNoticePopup.title}</h3>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4 text-left">
              {activeNoticePopup.content}
            </p>
            <div className="text-right text-xs text-slate-400 mt-6">
              প্রকাশিত: {activeNoticePopup.publishDate}
            </div>
          </div>
        </div>
      )}

      {/* Render Dynamic Sections Based on Order & Active Status */}
      {activeSections.map(sec => {
        
        // A. HERO SECTION
        if (sec.id === 'hero') {
          return (
            <section key={sec.id} className="relative bg-slate-950 text-white py-24 md:py-36 overflow-hidden">
              {/* Dynamic Banner Background Photo */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={settings.bannerUrl || 'https://images.unsplash.com/photo-1609137144814-1e0e98161578?auto=format&fit=crop&q=80&w=1200'} 
                  alt="GES Temple" 
                  className="w-full h-full object-cover opacity-20 scale-105 animate-pulse-slow"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
              </div>

              <div className="max-w-4xl mx-auto text-center px-4 relative z-10 space-y-6">
                <div className="inline-block p-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                  <span className="text-xs font-bold tracking-widest px-4 py-1 text-[#FF9933] uppercase">
                    {settings.slogan}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-white to-orange-400">
                  {settings.orgNameBangla}
                </h1>
                <p className="text-md md:text-xl font-mono tracking-wider text-slate-300 font-bold max-w-2xl mx-auto leading-relaxed">
                  {settings.orgNameEnglish}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button 
                    onClick={() => onNavigate('portal')}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#FF9933] to-[#FF6321] hover:brightness-105 text-white font-bold text-sm rounded-full shadow-lg transition flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    সদস্য পোর্টাল (Member Portal)
                  </button>
                  <button 
                    onClick={() => onNavigate('apply')}
                    className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-bold text-sm rounded-full backdrop-blur-sm transition w-full sm:w-auto justify-center"
                  >
                    অনলাইন সদস্যপদ নিবন্ধন
                  </button>
                </div>
              </div>
            </section>
          );
        }

        // B. WELCOME MESSAGE
        if (sec.id === 'welcome') {
          return (
            <section key={sec.id} className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
              <div className="space-y-6">
                <div className="inline-block h-1.5 w-16 bg-[#FF6321] rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">স্বাগতম আমাদের ধর্মীয় ও সামাজিক আশ্রয়ে</h2>
                <p className="text-slate-600 leading-relaxed text-md font-medium">
                  {settings.mission}
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-xl block">👁️‍🗨️</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">আমাদের লক্ষ্য (Vision)</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{settings.vision}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-xl block">📜</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">আমাদের ইতিহাস (History)</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{settings.history}</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=600" 
                  alt="Mandir Festival" 
                  className="rounded-3xl shadow-xl border-4 border-slate-100 w-full"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-[#FF9933] to-[#FF6321] text-white p-6 rounded-3xl shadow-lg text-center select-none hidden md:block">
                  <span className="text-2xl font-bold block font-mono">২০২৬</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-90">প্রথম প্রয়াস</span>
                </div>
              </div>
            </section>
          );
        }

        // C. PRESIDENT & SECRETARY MESSAGES
        if (sec.id === 'president_msg') {
          return (
            <section key={sec.id} className="bg-slate-50/70 border-y border-slate-150 py-16 text-left">
              <div className="max-w-6xl mx-auto px-4 space-y-12">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">সংঘের নেতৃবৃন্দের পবিত্র বাণী</h2>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Quotes from President and General Secretary</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* President Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row gap-6 relative overflow-hidden">
                    <img 
                      src={settings.presidentPhoto} 
                      alt={settings.presidentName} 
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-200 self-start shadow"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-2.5">
                      <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2.5 py-0.5 rounded-full uppercase">সভাপতি বার্তা</span>
                      <h3 className="text-md font-bold text-slate-900">{settings.presidentName}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed italic">
                        "{settings.presidentMessage}"
                      </p>
                    </div>
                  </div>

                  {/* Secretary Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row gap-6 relative overflow-hidden">
                    <img 
                      src={settings.secretaryPhoto} 
                      alt={settings.secretaryName} 
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-200 self-start shadow"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-2.5">
                      <span className="text-[9px] bg-[#FF6321]/10 text-[#FF6321] border border-[#FF6321]/20 font-bold px-2.5 py-0.5 rounded-full uppercase">সম্পাদক বার্তা</span>
                      <h3 className="text-md font-bold text-slate-900">{settings.secretaryName}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed italic">
                        "{settings.secretaryMessage}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // D. COMMITTEE MEMBERS LIST
        if (sec.id === 'committee') {
          return (
            <section key={sec.id} className="max-w-6xl mx-auto px-4 text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{committeeTerm.termName}</h2>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Executive Committee Members List</p>
                </div>
                <button 
                  onClick={() => onNavigate('committee')}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-full font-bold text-xs hover:bg-slate-200 transition"
                >
                  পূর্ণ বিবরণী কমিটি দেখুন (View Complete Details)
                </button>
              </div>

              {/* Committee Horizontal slider grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {committeeTerm.members.slice(0, 5).map(member => (
                  <div key={member.id} className="bg-white rounded-3xl p-4 border border-slate-200 shadow-md text-center flex flex-col justify-between hover:shadow-lg transition">
                    <img 
                      src={member.photoUrl} 
                      alt={member.name} 
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                      <span className="text-[9px] bg-[#FF6321]/10 text-[#FF6321] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide mt-1 inline-block">
                        {member.designation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // E. NOTICES BOARD
        if (sec.id === 'notices') {
          return (
            <section key={sec.id} className="max-w-6xl mx-auto px-4 text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">অফিসিয়াল নোটিশ বোর্ড (Notices)</h2>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Announcements & Broadcasts</p>
                </div>
              </div>

              {/* Notice grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {notices.slice(0, 3).map(notice => (
                  <div key={notice.id} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between relative hover:shadow-lg transition">
                    {notice.isPinned && (
                      <span className="absolute top-4 right-4 bg-[#FF6321] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        PINNED
                      </span>
                    )}
                    <div>
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded font-mono uppercase">
                        {notice.category}
                      </span>
                      <h3 className="text-md font-bold text-slate-900 mt-3 line-clamp-1">{notice.title}</h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed whitespace-pre-line">{notice.content}</p>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-4 pt-3 border-t border-slate-100">
                      তারিখ: {notice.publishDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // F. UPCOMING FESTIVALS EVENTS
        if (sec.id === 'events') {
          return (
            <section key={sec.id} className="max-w-6xl mx-auto px-4 text-left">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">আসন্ন শুভ উৎসব সূচি</h2>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Festival Calendar & Volunteers Corner</p>
                </div>
              </div>

              {/* Events vertical list */}
              <div className="space-y-4">
                {events.map(evt => (
                  <div key={evt.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <img src={evt.bannerUrl} alt={evt.title} className="w-24 h-24 rounded-2xl object-cover border border-slate-200" referrerPolicy="no-referrer" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-mono uppercase">FESTIVAL</span>
                          <span className="text-xs text-[#FF6321] font-bold font-mono">{evt.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">{evt.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1 max-w-xl">{evt.description}</p>
                        <p className="text-xs text-slate-400 font-medium mt-2">📍 {evt.location} | ⏰ {evt.time}</p>
                      </div>
                    </div>

                    {/* Volunteer registration and counters */}
                    <div className="text-center md:text-right space-y-3 self-stretch md:self-auto flex flex-col justify-between border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      <div>
                        <span className="text-xs font-bold text-slate-400 block uppercase">নিবন্ধিত স্বেচ্ছাসেবক</span>
                        <span className="text-xl font-bold text-slate-900 font-mono mt-0.5 block">{evt.registeredVolunteers.length || 0} জন</span>
                      </div>
                      
                      {/* Register button simulator */}
                      <button 
                        onClick={() => {
                          // Check if Sajon is active (our logged-in member ID is 'm3')
                          onRegisterVolunteer(evt.id, 'm3');
                          alert('স্বেচ্ছাসেবক হিসেবে আপনার নিবন্ধন সফল হয়েছে!');
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#FF9933] to-[#FF6321] hover:brightness-105 text-white rounded-full font-bold text-xs shadow-sm"
                      >
                        স্বেচ্ছাসেবক হতে চাই
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // G. GALLERY
        if (sec.id === 'gallery') {
          return (
            <section key={sec.id} className="max-w-6xl mx-auto px-4 text-left">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">ধর্মীয় উৎসব ফটো গ্যালারি</h2>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Historic Celebrations Gallery</p>
              </div>

              {/* Grid bento layout */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="relative group overflow-hidden rounded-3xl h-48 md:h-64 shadow-md border border-slate-100">
                  <img src="https://images.unsplash.com/photo-1561361513-2d000a45f0d2?auto=format&fit=crop&q=80&w=600" alt="Puja" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white uppercase">শারদীয় দুর্গোৎসব</span>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-3xl h-48 md:h-64 shadow-md border border-slate-100">
                  <img src="https://images.unsplash.com/photo-1608958416715-db870c5383be?auto=format&fit=crop&q=80&w=600" alt="Janmashtami" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white uppercase">শুভ জন্মাষ্টমী মেলা</span>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-3xl h-48 md:h-64 shadow-md border border-slate-100 col-span-2 md:col-span-1">
                  <img src="https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=600" alt="Rath" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white uppercase">রথযাত্রা মহোৎসব</span>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // H. DONATIONS
        if (sec.id === 'donation') {
          return (
            <section key={sec.id} className="max-w-6xl mx-auto px-4 text-left bg-gradient-to-br from-[#FF9933] to-[#FF6321] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full translate-x-20 -translate-y-20"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-6">
                  <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest text-white">
                    তহবিল অনুদান / Donation Fund
                  </span>
                  <h2 className="text-3xl font-bold">পুণ্য অর্জনে অনুদান প্রদান করুন</h2>
                  <p className="text-sm opacity-90 leading-relaxed max-w-md">
                    আমাদের মণ্ডপ সংস্কার, পূজা উদযাপন এবং অসহায় সনাতন পরিবার কল্যাণ তহবিলে আপনার শ্রদ্ধাপূর্বক অনুদান নিবেদন করুন। প্রতিটি অনুদান সিস্টেম দ্বারা রসিদপত্র তৈরি করবে।
                  </p>
                </div>

                <div className="space-y-4">
                  {donationCategories.slice(0, 3).map(cat => (
                    <div key={cat.id} className="bg-white/10 p-4 rounded-2xl border border-white/10 flex justify-between items-center hover:bg-white/15 transition">
                      <div>
                        <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                        <div className="w-44 bg-white/20 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div className="bg-white h-full" style={{ width: `${(cat.raisedAmount / cat.targetAmount) * 100}%` }}></div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedDonationCategory(cat)}
                        className="px-4 py-2 bg-white text-[#FF6321] font-bold text-xs rounded-xl shadow hover:bg-white/90 transition"
                      >
                        অনলাইন পেমেন্ট করুন
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Online Payment Simulator Popup Modal */}
              {selectedDonationCategory && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 text-slate-800">
                  <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-[#FF6321] shadow-2xl relative">
                    <button 
                      onClick={() => setSelectedDonationCategory(null)}
                      className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold transition"
                    >
                      ✕
                    </button>
                    
                    <div className="text-center border-b border-slate-100 pb-4 mb-4">
                      <span className="text-[10px] bg-orange-100 text-[#FF6321] font-bold px-3 py-1 rounded-full uppercase">অনলাইন পেমেন্ট গেটওয়ে (সিমুলেটর)</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-3">{selectedDonationCategory.name}</h3>
                    </div>

                    {donationSuccess ? (
                      <div className="text-center py-8 space-y-3">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="text-md font-bold text-green-700">অনলাইন অনুদান সফল হয়েছে!</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">আপনার পুণ্য অনুদানের ডিজিটাল রশিদ প্রস্তুত করা হয়েছে। অ্যাডমিন প্যানেলে রসিদটি খুঁজে পাবেন। শ্রী ভগবান আপনার মঙ্গল করুন।</p>
                      </div>
                    ) : (
                      <form onSubmit={handleDonateSubmit} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">আপনার নাম (Donor Name)</label>
                          <input 
                            type="text" 
                            value={donorName} 
                            onChange={e => setDonorName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6321]"
                            placeholder="যেমন: অনুপম রায়"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">মোবাইল নম্বর</label>
                          <input 
                            type="text" 
                            value={donorMobile} 
                            onChange={e => setDonorMobile(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6321]"
                            placeholder="০১৭১১-xxxxxx"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">অনুদানের পরিমাণ (৳)</label>
                          <input 
                            type="number" 
                            value={customDonationAmount || ''} 
                            onChange={e => setCustomDonationAmount(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none text-[#FF6321] text-lg focus:border-[#FF6321]"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          {[500, 1000, 5000, 10000].map(amt => (
                            <button 
                              key={amt} 
                              type="button"
                              onClick={() => setCustomDonationAmount(amt)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-[#FF6321] hover:text-white rounded-lg text-xs font-bold transition flex-grow"
                            >
                              ৳{amt}
                            </button>
                          ))}
                        </div>
                        <button 
                          id="btn-homepage-donate-submit"
                          type="submit"
                          className="w-full py-3 bg-gradient-to-r from-[#FF9933] to-[#FF6321] text-white rounded-xl font-bold text-xs shadow-md mt-4"
                        >
                          নিরাপদে পেমেন্ট সম্পন্ন করুন
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </section>
          );
        }

        // I. STATS COUNTERS
        if (sec.id === 'stats') {
          return (
            <section key={sec.id} className="max-w-6xl mx-auto px-4 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 border border-slate-200 rounded-3xl p-8">
                <div>
                  <span className="text-4xl block">🕉️</span>
                  <span className="text-3xl font-bold text-slate-900 block mt-2 font-mono">১০+</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1 block">বার্ষিক উৎসব উদযাপন</span>
                </div>
                <div>
                  <span className="text-4xl block">👥</span>
                  <span className="text-3xl font-bold text-slate-900 block mt-2 font-mono">
                    {members.filter(m => m.status === ApplicationStatus.APPROVED).length}+
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1 block">নিবন্ধিত সক্রিয় সদস্য</span>
                </div>
                <div>
                  <span className="text-4xl block">🤝</span>
                  <span className="text-3xl font-bold text-slate-900 block mt-2 font-mono">৫০+</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1 block">নিবেদিত স্বেচ্ছাসেবক</span>
                </div>
                <div>
                  <span className="text-4xl block">🏛️</span>
                  <span className="text-3xl font-bold text-slate-900 block mt-2 font-mono">২০+</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1 block">সামাজিক উন্নয়ন উদ্যোগ</span>
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};
