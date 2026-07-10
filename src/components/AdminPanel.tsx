import React, { useState } from 'react';
import { 
  OrgSettings, HomepageSection, Member, CommitteeTerm, Notice, EventItem, 
  DonationRecord, DonationCategory, CustomPage, UploadedHTML, IdCardTemplate, 
  CertificateTemplate, AuditLog, MemberRole, ApplicationStatus, CommitteeMember 
} from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { IDCardTemplateComponent } from './IDCardTemplate';
import { CertificateTemplateComponent } from './CertificateTemplate';

interface AdminPanelProps {
  currentUser: Member;
  settings: OrgSettings;
  sections: HomepageSection[];
  members: Member[];
  committeeTerm: CommitteeTerm;
  notices: Notice[];
  events: EventItem[];
  donations: DonationRecord[];
  donationCategories: DonationCategory[];
  customPages: CustomPage[];
  htmlUploads: UploadedHTML[];
  idCardTemplate: IdCardTemplate;
  certificateTemplate: CertificateTemplate;
  auditLogs: AuditLog[];
  
  onUpdateSettings: (s: OrgSettings) => void;
  onUpdateSections: (s: HomepageSection[]) => void;
  onUpdateMembers: (m: Member[]) => void;
  onUpdateCommittee: (c: CommitteeTerm) => void;
  onUpdateNotices: (n: Notice[]) => void;
  onUpdateEvents: (e: EventItem[]) => void;
  onUpdateDonations: (d: DonationRecord[]) => void;
  onUpdateDonationCategories: (dc: DonationCategory[]) => void;
  onUpdateCustomPages: (p: CustomPage[]) => void;
  onUpdateHtmlUploads: (h: UploadedHTML[]) => void;
  onUpdateIdCardTemplate: (t: IdCardTemplate) => void;
  onUpdateCertificateTemplate: (t: CertificateTemplate) => void;
}

export const AdminPanelComponent: React.FC<AdminPanelProps> = ({
  currentUser, settings, sections, members, committeeTerm, notices, events, donations, 
  donationCategories, customPages, htmlUploads, idCardTemplate, certificateTemplate, auditLogs,
  onUpdateSettings, onUpdateSections, onUpdateMembers, onUpdateCommittee, onUpdateNotices, 
  onUpdateEvents, onUpdateDonations, onUpdateDonationCategories, onUpdateCustomPages, 
  onUpdateHtmlUploads, onUpdateIdCardTemplate, onUpdateCertificateTemplate
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'branding' | 'homepage' | 'members' | 'committee' | 'notices' | 'events' | 'donations' | 'pages' | 'html_uploads' | 'templates' | 'approvals' | 'backups'>('dashboard');
  
  // Searching & Filtering
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // Selection
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // New item forms states
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('জেনারেল নোটিশ');
  const [newNoticeIsPinned, setNewNoticeIsPinned] = useState(false);
  const [newNoticeIsPopup, setNewNoticeIsPopup] = useState(false);

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventBanner, setNewEventBanner] = useState('https://images.unsplash.com/photo-1608958416715-db870c5383be?auto=format&fit=crop&q=80&w=800');

  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageContent, setNewPageContent] = useState('');

  const [newHtmlTitle, setNewHtmlTitle] = useState('');
  const [newHtmlSlug, setNewHtmlSlug] = useState('');
  const [newHtmlHtml, setNewHtmlHtml] = useState('');
  const [newHtmlCss, setNewHtmlCss] = useState('');
  const [newHtmlJs, setNewHtmlJs] = useState('');

  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorMobile, setNewDonorMobile] = useState('');
  const [newDonationAmount, setNewDonationAmount] = useState<number>(0);
  const [newDonationCat, setNewDonationCat] = useState(donationCategories[0]?.name || '');

  // Edit states
  const [localSettings, setLocalSettings] = useState<OrgSettings>({ ...settings });
  const [localIdTemplate, setLocalIdTemplate] = useState<IdCardTemplate>({ ...idCardTemplate });
  const [localCertTemplate, setLocalCertTemplate] = useState<CertificateTemplate>({ ...certificateTemplate });

  // Alerts
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setAdminNotification(msg);
    setTimeout(() => setAdminNotification(null), 4000);
  };

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    showNotification('সাধারণ ওয়েবসাইট সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!');
  };

  // Homepage order up / down
  const moveSection = (idx: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    
    // Swap
    const temp = newSections[idx];
    newSections[idx] = newSections[targetIdx];
    newSections[targetIdx] = temp;
    
    // Update order values
    newSections.forEach((sec, i) => sec.order = i + 1);
    onUpdateSections(newSections);
    showNotification('হোমপেজের মডিউলগুলোর অবস্থান পুনর্নির্ধারণ করা হয়েছে!');
  };

  const toggleSectionEnabled = (id: string) => {
    const newSections = sections.map(sec => sec.id === id ? { ...sec, enabled: !sec.enabled } : sec);
    onUpdateSections(newSections);
    showNotification('সেকশনের সক্রিয়তা পরিবর্তন করা হয়েছে!');
  };

  // Member Approval / Suspension
  const handleMemberStatusChange = (id: string, newStatus: ApplicationStatus) => {
    const updated = members.map(m => {
      if (m.id === id) {
        // Automatically generate standard official credential credentials on first approval
        let membershipNumber = m.membershipNumber;
        if (newStatus === ApplicationStatus.APPROVED && !m.membershipNumber) {
          const serial = String(members.filter(x => x.membershipNumber).length + 1).padStart(4, '0');
          membershipNumber = `GES-2026-${serial}`;
        }
        return { 
          ...m, 
          status: newStatus, 
          membershipNumber,
          joinedDate: m.joinedDate || new Date().toISOString().split('T')[0]
        };
      }
      return m;
    });
    onUpdateMembers(updated);
    showNotification(`সদস্যের স্ট্যাটাস পরিবর্তন করা হয়েছে: ${newStatus}`);
  };

  const handleMemberRoleChange = (id: string, role: MemberRole) => {
    const updated = members.map(m => m.id === id ? { ...m, role } : m);
    onUpdateMembers(updated);
    showNotification(`সদস্যের পদ পরিবর্তন করা হয়েছে: ${role}`);
  };

  // Notice Management
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const notice: Notice = {
      id: `notice-${Date.now()}`,
      title: newNoticeTitle,
      content: newNoticeContent,
      category: newNoticeCategory,
      publishDate: new Date().toISOString().split('T')[0],
      isPinned: newNoticeIsPinned,
      isPopup: newNoticeIsPopup
    };
    onUpdateNotices([notice, ...notices]);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticeIsPinned(false);
    setNewNoticeIsPopup(false);
    showNotification('নতুন নোটিশ সফলভাবে বোর্ডে যুক্ত করা হয়েছে!');
  };

  const handleDeleteNotice = (id: string) => {
    onUpdateNotices(notices.filter(n => n.id !== id));
    showNotification('নোটিশটি বোর্ড থেকে সরিয়ে দেওয়া হয়েছে।');
  };

  // Event Management
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const evt: EventItem = {
      id: `evt-${Date.now()}`,
      title: newEventTitle,
      description: newEventDesc,
      date: newEventDate,
      time: newEventTime,
      location: newEventLocation,
      bannerUrl: newEventBanner,
      volunteersNeeded: true,
      registeredVolunteers: [],
      rsvps: []
    };
    onUpdateEvents([...events, evt]);
    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventLocation('');
    showNotification('নতুন আসন্ন উৎসব সূচি তৈরি করা হয়েছে!');
  };

  const handleDeleteEvent = (id: string) => {
    onUpdateEvents(events.filter(e => e.id !== id));
    showNotification('উৎসব সূচি বাতিল করা হয়েছে।');
  };

  // Page Builder
  const handleAddCustomPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pg: CustomPage = {
      id: `pg-${Date.now()}`,
      slug: newPageSlug.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
      title: newPageTitle,
      content: newPageContent,
      published: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onUpdateCustomPages([...customPages, pg]);
    setNewPageTitle('');
    setNewPageSlug('');
    setNewPageContent('');
    showNotification('নতুন কাস্টম পাতা সফলভাবে প্রকাশিত করা হয়েছে!');
  };

  const handleDeleteCustomPage = (id: string) => {
    onUpdateCustomPages(customPages.filter(p => p.id !== id));
    showNotification('কাস্টম পাতা মুছে ফেলা হয়েছে।');
  };

  // HTML Zip Upload Sandbox
  const handleAddHtmlUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const up: UploadedHTML = {
      id: `html-${Date.now()}`,
      slug: newHtmlSlug.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
      title: newHtmlTitle,
      htmlContent: newHtmlHtml,
      cssContent: newHtmlCss,
      jsContent: newHtmlJs,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onUpdateHtmlUploads([...htmlUploads, up]);
    setNewHtmlTitle('');
    setNewHtmlSlug('');
    setNewHtmlHtml('');
    setNewHtmlCss('');
    setNewHtmlJs('');
    showNotification('নতুন HTML জিপ মডিউল স্যান্ডবক্সে রিলিজ করা হয়েছে!');
  };

  const handleDeleteHtmlUpload = (id: string) => {
    onUpdateHtmlUploads(htmlUploads.filter(h => h.id !== id));
    showNotification('HTML মডিউলটি বন্ধ করা হয়েছে।');
  };

  // Donation Category raisedAmount adder simulation
  const handleAddOfflineDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const record: DonationRecord = {
      id: `don-${Date.now()}`,
      donorName: newDonorName,
      donorEmail: `${newDonorName.toLowerCase().replace(/\s/g, '')}@gmail.com`,
      donorMobile: newDonorMobile,
      amount: newDonationAmount,
      category: newDonationCat,
      paymentMethod: 'Offline Cash (নগদ গ্রহণ)',
      paymentStatus: 'PAID',
      date: new Date().toISOString().split('T')[0],
      receiptNumber: `GES-2026-REC-${String(donations.length + 1).padStart(3, '0')}`
    };
    
    // Update goal values inside categories
    const updatedCategories = donationCategories.map(cat => {
      if (cat.name === newDonationCat) {
        return { ...cat, raisedAmount: cat.raisedAmount + newDonationAmount };
      }
      return cat;
    });

    onUpdateDonationCategories(updatedCategories);
    onUpdateDonations([record, ...donations]);
    
    setNewDonorName('');
    setNewDonorMobile('');
    setNewDonationAmount(0);
    showNotification('ম্যানুয়াল অনুদান সফলভাবে নথিবদ্ধ ও রসিদ প্রস্তুত করা হয়েছে!');
  };

  // PVC & Certificates Config Saves
  const handleSaveIdTemplate = () => {
    onUpdateIdCardTemplate(localIdTemplate);
    showNotification('ডিজিটাল আইডি কার্ডের ফ্রেম ও থিম আপডেট করা হয়েছে!');
  };

  const handleSaveCertTemplate = () => {
    onUpdateCertificateTemplate(localCertTemplate);
    showNotification('প্রশংসাপত্র ফরম্যাট সংরক্ষণ করা হয়েছে!');
  };

  // Export CSV Helper
  const handleExportCSV = () => {
    const headers = 'Name,Membership No,Role,Status,Mobile,Email\n';
    const rows = members.map(m => `"${m.englishName}","${m.membershipNumber || ''}","${m.role}","${m.status}","${m.mobile}","${m.email}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Ganaraj_Ekota_Sangha_Members.csv');
    a.click();
    showNotification('সদস্যদের এক্সেল রিপোর্টিং শীট (.csv) ডাউনলোড করা হয়েছে।');
  };

  // -------------------------------------------------------------
  // ANALYTICS DATA
  // -------------------------------------------------------------
  const chartDataDonations = donationCategories.map(cat => ({
    name: cat.name.split(' (')[0],
    'সংগৃহীত অনুদান': cat.raisedAmount,
    'লক্ষ্যমাত্রা': cat.targetAmount
  }));

  const membersByMonth = [
    { month: 'জানুয়ারি', 'নতুন সদস্য': 1 },
    { month: 'ফেব্রুয়ারি', 'নতুন সদস্য': 1 },
    { month: 'মার্চ', 'নতুন সদস্য': 0 },
    { month: 'এপ্রিল', 'নতুন সদস্য': 1 },
    { month: 'মে', 'নতুন সদস্য': 0 },
    { month: 'জুন', 'নতুন সদস্য': 0 },
    { month: 'জুলাই', 'নতুন সদস্য': members.length - 3 + 1 }
  ];

  const totalRaisedDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      (m.banglaName || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
      (m.englishName || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
      (m.mobile || '').includes(memberSearch) ||
      (m.membershipNumber && m.membershipNumber.toLowerCase().includes(memberSearch.toLowerCase()));
    
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter || (roleFilter === 'APPLICANT' && m.status === ApplicationStatus.PENDING);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Floating admin notifications */}
      {adminNotification && (
        <div className="fixed bottom-5 right-5 bg-stone-900 border-2 border-yellow-500 text-yellow-400 font-bold px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
          {adminNotification}
        </div>
      )}

      {/* Admin Panel Header Layout */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 border-2 border-[#FF6321]/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#FF9933] to-[#FF6321] p-3 rounded-2xl shadow">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-xl md:text-2xl font-bold text-[#FF9933]">গণরাজ কন্ট্রোল রুম (Admin Command Center)</h1>
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-mono mt-0.5">GES CMS Engine v2.5 / Role: Super Administrator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full font-mono">
              ● Firestore Database Live
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Navigation Admin Tabs */}
        <div className="lg:col-span-1 space-y-1.5 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">CMS Modules</p>
          
          {[
            { id: 'dashboard', label: 'কন্ট্রোল ড্যাশবোর্ড', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
            { id: 'branding', label: 'সাইট ব্র্যান্ডিং ও সেটিংস', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
            { id: 'homepage', label: 'হোমপেজ মডিউল বিল্ডার', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM5 20a1 1 0 00-1 1v2a1 1 0 001 1h14a1 1 0 001-1v-2a1 1 0 00-1-1H5z' },
            { id: 'members', label: 'সদস্য ও আবেদনপত্র', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            { id: 'committee', label: 'কমিটি মেম্বার লিস্ট', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
            { id: 'notices', label: 'নোটিশ ম্যানেজমেন্ট', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
            { id: 'events', label: 'উৎসব ও ইভেন্ট ক্যালেন্ডার', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z' },
            { id: 'donations', label: 'অনুদান ও তহবিল রিপোর্ট', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'pages', label: 'কাস্টম পাতা বিল্ডার', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { id: 'html_uploads', label: 'HTML স্যান্ডবক্স আপলোডার', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
            { id: 'templates', label: 'আইডি ও সার্টিফিকেট টেমপ্লেট', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
            { id: 'approvals', label: 'নথি খসড়া ও অনুমোদন', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { id: 'backups', label: 'ডাটা ব্যাকআপ ও রিস্টোর', icon: 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-3 ${activeTab === tab.id ? 'bg-[#FF6321] text-white shadow-lg shadow-orange-500/10' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content View */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm min-h-[500px]">
          
          {/* 1. ANALYTICS CONTROL DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Counter grid cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="p-4 bg-[#FF6321]/5 border border-[#FF6321]/15 rounded-2xl text-left">
                  <span className="text-slate-400 text-xs font-bold block">মোট সদস্য (Approved)</span>
                  <span className="text-2xl font-bold text-[#FF6321] font-mono mt-1 block">
                    {members.filter(m => m.status === ApplicationStatus.APPROVED).length}
                  </span>
                </div>
                <div className="p-4 bg-[#FF9933]/5 border border-[#FF9933]/15 rounded-2xl text-left">
                  <span className="text-slate-400 text-xs font-bold block">নতুন আবেদন (Pending)</span>
                  <span className="text-2xl font-bold text-[#FF9933] font-mono mt-1 block">
                    {members.filter(m => m.status === ApplicationStatus.PENDING).length}
                  </span>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-left">
                  <span className="text-slate-400 text-xs font-bold block">মোট সংগৃহীত অনুদান</span>
                  <span className="text-2xl font-bold text-emerald-600 font-mono mt-1 block">
                    ৳{totalRaisedDonations.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left">
                  <span className="text-slate-400 text-xs font-bold block">কাস্টম পাতা ও স্যান্ডবক্স</span>
                  <span className="text-2xl font-bold text-slate-700 font-mono mt-1 block">
                    {customPages.length + htmlUploads.length}
                  </span>
                </div>
              </div>

              {/* Graphic Charts Grid using Recharts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {/* Donations Raised Vs Target Bar Chart */}
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider text-left">তহবিল সংগ্রহ বনাম লক্ষ্যমাত্রা (Donations Goal Vs Raised)</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartDataDonations}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                        <YAxis stroke="#475569" fontSize={11} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="সংগৃহীত অনুদান" fill="#FF6321" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="লক্ষ্যমাত্রা" fill="#FF9933" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Registration Line Chart */}
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider text-left">মাসিক নিবন্ধন হার (Monthly Registrations)</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={membersByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#475569" fontSize={11} />
                        <YAxis stroke="#475569" fontSize={11} />
                        <Tooltip />
                        <Line type="monotone" dataKey="নতুন সদস্য" stroke="#FF6321" strokeWidth={3} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Audit Action Logs */}
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-800 mb-4">রিয়েল-টাইম অডিট হিস্ট্রি (Security Audit Logs)</h4>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-200 text-xs text-left">
                  {auditLogs.map(log => (
                    <div key={log.id} className="p-3.5 flex justify-between items-center hover:bg-slate-100/50 transition">
                      <div className="text-left">
                        <span className="font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded mr-2 font-bold">{log.userRole}</span>
                        <span className="text-slate-800 font-bold">{log.action}</span>
                        <span className="text-slate-500 ml-2">by {log.userEmail}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block font-medium">{log.timestamp}</span>
                        <span className="text-[10px] font-mono text-slate-400">IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. BRANDING EDITOR (CMS SETTINGS) */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 text-left">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">অর্গানাইজেশন সেটিংস ও ব্র্যান্ডিং (CMS Settings)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">প্রতিষ্ঠানের নাম (বাংলায়)</label>
                  <input 
                    type="text" 
                    value={localSettings.orgNameBangla} 
                    onChange={e => setLocalSettings({ ...localSettings, orgNameBangla: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 font-bold transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Organization Name (English)</label>
                  <input 
                    type="text" 
                    value={localSettings.orgNameEnglish} 
                    onChange={e => setLocalSettings({ ...localSettings, orgNameEnglish: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 font-bold transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">অফিসিয়াল স্লোগান</label>
                  <input 
                    type="text" 
                    value={localSettings.slogan} 
                    onChange={e => setLocalSettings({ ...localSettings, slogan: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 italic font-medium transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">লোগো ছবি লিংক (Logo URL)</label>
                  <input 
                    type="text" 
                    value={localSettings.logoUrl} 
                    onChange={e => setLocalSettings({ ...localSettings, logoUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 transition"
                  />
                </div>

                {/* Color Schemes Theme */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Primary Theme Color (Saffron hex)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={localSettings.themeColorPrimary} 
                      onChange={e => setLocalSettings({ ...localSettings, themeColorPrimary: e.target.value })}
                      className="w-12 h-12 rounded-xl overflow-hidden cursor-pointer border border-slate-300"
                    />
                    <input 
                      type="text" 
                      value={localSettings.themeColorPrimary} 
                      onChange={e => setLocalSettings({ ...localSettings, themeColorPrimary: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Secondary Theme Color (Deep Orange hex)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={localSettings.themeColorSecondary} 
                      onChange={e => setLocalSettings({ ...localSettings, themeColorSecondary: e.target.value })}
                      className="w-12 h-12 rounded-xl overflow-hidden cursor-pointer border border-slate-300"
                    />
                    <input 
                      type="text" 
                      value={localSettings.themeColorSecondary} 
                      onChange={e => setLocalSettings({ ...localSettings, themeColorSecondary: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">যোগাযোগ নম্বর</label>
                  <input 
                    type="text" 
                    value={localSettings.contactNumber} 
                    onChange={e => setLocalSettings({ ...localSettings, contactNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">অফিসিয়াল ইমেইল</label>
                  <input 
                    type="email" 
                    value={localSettings.email} 
                    onChange={e => setLocalSettings({ ...localSettings, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">ঠিকানা</label>
                  <input 
                    type="text" 
                    value={localSettings.address} 
                    onChange={e => setLocalSettings({ ...localSettings, address: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 transition"
                  />
                </div>

                {/* President message edits */}
                <div className="md:col-span-2 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-[#FF6321] mb-4 uppercase">সভাপতির বাণী ও তথ্য</h4>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">সভাপতির নাম</label>
                  <input 
                    type="text" 
                    value={localSettings.presidentName} 
                    onChange={e => setLocalSettings({ ...localSettings, presidentName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">সভাপতির ছবি লিংক</label>
                  <input 
                    type="text" 
                    value={localSettings.presidentPhoto} 
                    onChange={e => setLocalSettings({ ...localSettings, presidentPhoto: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">সভাপতির বাণী</label>
                  <textarea 
                    value={localSettings.presidentMessage} 
                    onChange={e => setLocalSettings({ ...localSettings, presidentMessage: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 transition resize-none"
                  />
                </div>

                {/* SEO Metas */}
                <div className="md:col-span-2 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-[#FF6321] mb-4 uppercase">SEO মেটা ও গুগল কাস্টম কোড</h4>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">SEO টাইটেল</label>
                  <input 
                    type="text" 
                    value={localSettings.seoTitle} 
                    onChange={e => setLocalSettings({ ...localSettings, seoTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">SEO বিবরণ</label>
                  <input 
                    type="text" 
                    value={localSettings.seoDescription} 
                    onChange={e => setLocalSettings({ ...localSettings, seoDescription: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]/50 transition"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button 
                  id="btn-branding-save"
                  type="submit"
                  className="px-6 py-3 bg-[#FF6321] hover:bg-[#FF6321]/90 text-white rounded-full font-bold shadow-sm transition"
                >
                  ব্র্যান্ডিং সেটিংস সংরক্ষণ করুন
                </button>
              </div>
            </form>
          )}

          {/* 3. HOMEPAGE BUILDER (DRAG & DROP ORDER CONTROL) */}
          {activeTab === 'homepage' && (
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-lg font-extrabold text-stone-800">হোমপেজ সেকশন মডিউল বিল্ডার</h3>
                <p className="text-xs text-gray-500 mt-1">মডিউলগুলোর দৃশ্যমানতা অন/অফ করুন এবং উপরে/নিচে তীর বোতাম চেপে সেকশনের প্রদর্শন অবস্থান পরিবর্তন করুন।</p>
              </div>

              <div className="space-y-3">
                {sections.map((sec, idx) => (
                  <div key={sec.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-gray-400 bg-stone-200 px-2 py-0.5 rounded-full font-bold">#{sec.order}</span>
                      <span className="text-sm font-extrabold text-stone-800">{sec.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Toggle visible checkbox */}
                      <label className="flex items-center cursor-pointer gap-2 select-none">
                        <input 
                          type="checkbox" 
                          checked={sec.enabled} 
                          onChange={() => toggleSectionEnabled(sec.id)}
                          className="w-4.5 h-4.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-xs font-semibold text-gray-500">{sec.enabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}</span>
                      </label>
                      {/* Movement buttons */}
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => moveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40"
                        >
                          ▲
                        </button>
                        <button 
                          onClick={() => moveSection(idx, 'down')}
                          disabled={idx === sections.length - 1}
                          className="p-1.5 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MEMBER MANAGER */}
          {activeTab === 'members' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-stone-800">নিবন্ধিত সদস্য ও আবেদনপত্র যাচাই</h3>
                  <p className="text-xs text-gray-500 mt-0.5">নতুন নিবন্ধন অনুমোদন দিন, স্থগিত করুন বা আইডি কার্ড/সার্টিফিকেট প্রিন্ট করুন।</p>
                </div>
                <button 
                  id="btn-members-export"
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  এক্সেল (.CSV) রিপোর্ট ডাউনলোড
                </button>
              </div>

              {/* Filters Search bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <input 
                    type="text" 
                    placeholder="সদস্যের নাম বা মোবাইল দিয়ে সার্চ করুন..." 
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div className="flex gap-2">
                  {['ALL', 'SUPER_ADMIN', 'ADMIN', 'MEMBER', 'VOLUNTEER', 'APPLICANT'].map(role => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black transition uppercase ${roleFilter === role ? 'bg-orange-500 text-white' : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'}`}
                    >
                      {role === 'ALL' ? 'সকল' : role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 uppercase font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-3">সদস্য বিবরণী</th>
                      <th className="p-3">যোগাযোগ</th>
                      <th className="p-3">আইডি ও পদ</th>
                      <th className="p-3">অবস্থা</th>
                      <th className="p-3 text-right">পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-medium">
                    {filteredMembers.map(m => (
                      <tr key={m.id} className="hover:bg-stone-50/50 transition">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={m.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50'} 
                              alt={m.englishName} 
                              className="w-10 h-10 rounded-full object-cover border border-amber-300"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="font-extrabold text-stone-900">{m.banglaName}</h4>
                              <p className="text-[10px] text-gray-400 uppercase font-semibold font-mono">{m.englishName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="text-stone-800">{m.mobile}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{m.email}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-mono text-orange-600 font-bold">{m.membershipNumber || 'TBD'}</p>
                          <select 
                            value={m.role} 
                            onChange={e => handleMemberRoleChange(m.id, e.target.value as MemberRole)}
                            className="bg-transparent border-none text-[10px] font-black text-amber-800 uppercase focus:outline-none cursor-pointer p-0"
                          >
                            {Object.values(MemberRole).map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            m.status === ApplicationStatus.APPROVED ? 'bg-green-100 text-green-700 border border-green-200' :
                            m.status === ApplicationStatus.PENDING ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                            'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {m.status === ApplicationStatus.PENDING && (
                            <>
                              <button 
                                onClick={() => handleMemberStatusChange(m.id, ApplicationStatus.APPROVED)}
                                className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[10px] font-bold"
                              >
                                অনুমোদন
                              </button>
                              <button 
                                onClick={() => handleMemberStatusChange(m.id, ApplicationStatus.REJECTED)}
                                className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold"
                              >
                                প্রত্যাখ্যান
                              </button>
                            </>
                          )}
                          {m.status === ApplicationStatus.APPROVED && (
                            <>
                              <button 
                                onClick={() => setSelectedMember(m)}
                                className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[10px] font-bold"
                              >
                                ভিউ আইডি / সনদ
                              </button>
                              <button 
                                onClick={() => handleMemberStatusChange(m.id, ApplicationStatus.SUSPENDED)}
                                className="px-2.5 py-1 bg-stone-500 hover:bg-stone-600 text-white rounded-lg text-[10px] font-bold"
                              >
                                স্থগিত
                              </button>
                            </>
                          )}
                          {m.status === ApplicationStatus.SUSPENDED && (
                            <button 
                              onClick={() => handleMemberStatusChange(m.id, ApplicationStatus.APPROVED)}
                              className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              পুনঃসক্রিয়
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View Overlay Modal for selected member's ID card or Certificate */}
              {selectedMember && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
                  <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl relative border border-amber-100">
                    <button 
                      onClick={() => setSelectedMember(null)}
                      className="absolute top-4 right-4 p-2 bg-stone-100 text-stone-600 hover:bg-stone-200 rounded-full transition"
                    >
                      ✕
                    </button>
                    
                    <div className="text-center">
                      <h3 className="text-lg font-black text-amber-900">{selectedMember.banglaName} এর অফিশিয়াল কার্ড ও প্রশংসাপত্র</h3>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {selectedMember.membershipNumber}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center flex flex-col items-center">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">ডিজিটাল পিভিসি আইডি</h4>
                        <IDCardTemplateComponent 
                          member={selectedMember} 
                          template={idCardTemplate} 
                          orgNameBangla={settings.orgNameBangla} 
                          orgNameEnglish={settings.orgNameEnglish} 
                        />
                      </div>
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center flex flex-col items-center">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">অফিশিয়াল প্রশংসাপত্র</h4>
                        <CertificateTemplateComponent 
                          member={selectedMember} 
                          template={certificateTemplate} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. COMMITTEE MANAGER */}
          {activeTab === 'committee' && (
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-lg font-extrabold text-stone-800">কার্যকরী কমিটি মেম্বার ম্যানেজমেন্ট</h3>
                <p className="text-xs text-gray-500 mt-1">কমিটির নাম ও সদস্য তালিকা সংশোধন করুন।</p>
              </div>

              {/* Committee Name */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">কমিটি সেশনের নাম</label>
                  <input 
                    type="text" 
                    value={committeeTerm.termName} 
                    onChange={e => onUpdateCommittee({ ...committeeTerm, termName: e.target.value })}
                    className="px-4 py-2 bg-white rounded-xl border border-stone-200 text-xs w-full max-w-sm focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                {committeeTerm.members.map((member) => (
                  <div key={member.id} className="p-3 bg-white rounded-2xl border border-stone-200 flex justify-between items-center hover:bg-stone-50/50 transition">
                    <div className="flex items-center gap-3">
                      <img 
                        src={member.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50'} 
                        alt={member.name} 
                        className="w-10 h-10 rounded-full object-cover border border-amber-400"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-sm font-extrabold text-stone-900">{member.name}</h4>
                        <span className="text-[10px] bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded font-black uppercase tracking-wider">{member.designation}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        onUpdateCommittee({
                          ...committeeTerm,
                          members: committeeTerm.members.filter(m => m.id !== member.id)
                        });
                        showNotification(`${member.name} কে কমিটি থেকে সরিয়ে দেওয়া হয়েছে।`);
                      }}
                      className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition text-xs font-bold"
                    >
                      মুছে ফেলুন
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. NOTICES MANAGER */}
          {activeTab === 'notices' && (
            <div className="space-y-6 text-left text-sm">
              <h3 className="text-lg font-extrabold text-stone-800 border-b border-gray-100 pb-3">ঘোষণা ও নোটিশ আপলোডার (Notices Board)</h3>
              
              {/* Form to add */}
              <form onSubmit={handleAddNotice} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="text-xs font-black text-orange-600 uppercase">নতুন নোটিশ সম্প্রচার করুন</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">নোটিশ শিরোনাম</label>
                    <input 
                      type="text" 
                      value={newNoticeTitle} 
                      onChange={e => setNewNoticeTitle(e.target.value)}
                      placeholder="যেমন: দুর্গাপূজা অনুদান প্রদান বিষয়ক"
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">নোটিশ ক্যাটাগরি</label>
                    <select 
                      value={newNoticeCategory} 
                      onChange={e => setNewNoticeCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition"
                    >
                      <option value="জেনারেল নোটিশ">জেনারেল নোটিশ</option>
                      <option value="উৎসব নোটিশ">উৎসব নোটিশ</option>
                      <option value="অনুদান">অনুদান ও আর্থিক সাহায্য</option>
                      <option value="জরুরী এলার্ট">জরুরী এলার্ট</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">নোটিশের বিবরণ / রিচ টেক্সট</label>
                    <textarea 
                      value={newNoticeContent} 
                      onChange={e => setNewNoticeContent(e.target.value)}
                      rows={4}
                      placeholder="এখানে বিশদ বিবরণ লিখুন..."
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition resize-none"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-6">
                    <label className="flex items-center gap-2 select-none cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newNoticeIsPinned} 
                        onChange={e => setNewNoticeIsPinned(e.target.checked)}
                        className="w-4 h-4 rounded text-orange-500 border-gray-300"
                      />
                      <span className="text-xs font-bold text-stone-700">পিন নোটিশ হিসেবে রাখুন (Pinned to Top)</span>
                    </label>
                    <label className="flex items-center gap-2 select-none cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newNoticeIsPopup} 
                        onChange={e => setNewNoticeIsPopup(e.target.checked)}
                        className="w-4 h-4 rounded text-orange-500 border-gray-300"
                      />
                      <span className="text-xs font-bold text-stone-700">পপআপ আকারে হোমপেজে দেখান (Landing Modal)</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    id="btn-notice-add-submit"
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-xs shadow-md hover:from-orange-600 hover:to-amber-600 transition"
                  >
                    বোর্ডে যুক্ত করুন
                  </button>
                </div>
              </form>

              {/* Active list */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-stone-500 uppercase tracking-widest">চলমান নোটিশসমূহ ({notices.length})</h4>
                {notices.map(notice => (
                  <div key={notice.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-mono">{notice.category}</span>
                        {notice.isPinned && <span className="text-[9px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded uppercase">PINNED</span>}
                        {notice.isPopup && <span className="text-[9px] font-bold bg-purple-500 text-white px-2 py-0.5 rounded uppercase font-mono">POPUP</span>}
                      </div>
                      <h4 className="text-sm font-extrabold text-stone-900 mt-2">{notice.title}</h4>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2">{notice.content}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="text-xs text-red-500 font-bold hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
                    >
                      ডিলিট
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. EVENTS PLANNER */}
          {activeTab === 'events' && (
            <div className="space-y-6 text-left text-sm">
              <h3 className="text-lg font-extrabold text-stone-800 border-b border-gray-100 pb-3">আসন্ন উৎসব ও ইভেন্ট ক্যালেন্ডার (Event Manager)</h3>
              
              {/* Form to add */}
              <form onSubmit={handleAddEvent} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="text-xs font-black text-orange-600 uppercase">নতুন ধর্মীয় উৎসব বা সভা যুক্ত করুন</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">উৎসবের নাম (Title)</label>
                    <input 
                      type="text" 
                      value={newEventTitle} 
                      onChange={e => setNewEventTitle(e.target.value)}
                      placeholder="যেমন: মহাজন্মোৎসব শ্রীকৃষ্ণ জন্মাষ্টমী"
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">তারিখ (Date)</label>
                    <input 
                      type="date" 
                      value={newEventDate} 
                      onChange={e => setNewEventDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">সময় (Time)</label>
                    <input 
                      type="text" 
                      value={newEventTime} 
                      onChange={e => setNewEventTime(e.target.value)}
                      placeholder="যেমন: দুপুর ২:০০ - সন্ধ্যা ৭:০০"
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">স্থান (Location)</label>
                    <input 
                      type="text" 
                      value={newEventLocation} 
                      onChange={e => setNewEventLocation(e.target.value)}
                      placeholder="যেমন: গণরাজ কেন্দ্রীয় মণ্ডপ"
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">উৎসব ব্যানার ছবি লিংক</label>
                    <input 
                      type="text" 
                      value={newEventBanner} 
                      onChange={e => setNewEventBanner(e.target.value)}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">উৎসবের সংক্ষেপ বর্ণনা</label>
                    <textarea 
                      value={newEventDesc} 
                      onChange={e => setNewEventDesc(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    id="btn-event-add-submit"
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-xs shadow-md hover:from-orange-600 hover:to-amber-600 transition"
                  >
                    উৎসব সূচি তৈরি করুন
                  </button>
                </div>
              </form>

              {/* List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-stone-500 uppercase tracking-widest">আসন্ন উৎসব তালিকা ({events.length})</h4>
                {events.map(evt => (
                  <div key={evt.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex justify-between items-start">
                    <div className="flex gap-4 items-start">
                      <img src={evt.bannerUrl} alt={evt.title} className="w-16 h-16 rounded-xl object-cover border border-amber-300" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-sm font-extrabold text-stone-900">{evt.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">তারিখ: {evt.date} | সময়: {evt.time}</p>
                        <p className="text-xs text-stone-600 mt-2">স্থান: {evt.location}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="text-xs text-red-500 font-bold hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
                    >
                      ডিলিট
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. DONATIONS & GOALS */}
          {activeTab === 'donations' && (
            <div className="space-y-6 text-left text-sm">
              <h3 className="text-lg font-extrabold text-stone-800 border-b border-gray-100 pb-3">অনুদান ট্র্যাকিং ও অফলাইন অনুদান রসিদ প্রস্তুতকারক (Donations)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Offline Donation Adder */}
                <form onSubmit={handleAddOfflineDonation} className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4 md:col-span-1">
                  <h4 className="text-xs font-black text-orange-600 uppercase">ম্যানুয়াল অফলাইন অনুদান জমা করুন</h4>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">দাতার নাম (Donor Name)</label>
                    <input 
                      type="text" 
                      value={newDonorName} 
                      onChange={e => setNewDonorName(e.target.value)}
                      placeholder="যেমন: অনিল চক্রবর্তী"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">মোবাইল নম্বর</label>
                    <input 
                      type="text" 
                      value={newDonorMobile} 
                      onChange={e => setNewDonorMobile(e.target.value)}
                      placeholder="০১৭১১-xxxxxx"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">অনুদান ক্যাটাগরি</label>
                    <select 
                      value={newDonationCat} 
                      onChange={e => setNewDonationCat(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none"
                    >
                      {donationCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">অনুদান পরিমাণ (৳)</label>
                    <input 
                      type="number" 
                      value={newDonationAmount || ''} 
                      onChange={e => setNewDonationAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-mono font-bold focus:outline-none"
                      required
                    />
                  </div>
                  <button 
                    id="btn-donation-offline-submit"
                    type="submit"
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow"
                  >
                    অনুদান নথিবদ্ধ ও রসিদ তৈরি করুন
                  </button>
                </form>

                {/* Donation categories raised list */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-xs font-black text-stone-500 uppercase tracking-widest">তহবিল সংগ্রহ অগ্রগতি (Category Raised Totals)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {donationCategories.map(cat => (
                      <div key={cat.id} className="p-4 bg-white border border-stone-200 rounded-2xl">
                        <span className="text-xs font-extrabold text-stone-800">{cat.name}</span>
                        <div className="flex justify-between items-baseline mt-2">
                          <span className="text-md font-black text-orange-600">৳{cat.raisedAmount.toLocaleString()}</span>
                          <span className="text-[10px] text-gray-400">লক্ষ্য: ৳{cat.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-2">
                          <div className="bg-orange-500 h-full" style={{ width: `${Math.min(100, (cat.raisedAmount / cat.targetAmount) * 100)}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Donations Logs with print receipt option */}
                  <h4 className="text-xs font-black text-stone-500 uppercase tracking-widest pt-4">অনুদান রশিদ ও লগের তালিকা ({donations.length})</h4>
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-200">
                    {donations.map(don => (
                      <div key={don.id} className="p-3 flex justify-between items-center hover:bg-stone-100/40 transition">
                        <div>
                          <p className="font-extrabold text-stone-900">{don.donorName}</p>
                          <p className="text-[10px] text-gray-400">মোবাইল: {don.donorMobile} | ক্যাটাগরি: {don.category}</p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <span className="text-xs font-bold text-green-600 block">৳{don.amount.toLocaleString()}</span>
                            <span className="text-[9px] text-gray-400 font-mono">রসিদ: {don.receiptNumber}</span>
                          </div>
                          <button 
                            onClick={() => {
                              const printWindow = window.open('', '_blank');
                              if (printWindow) {
                                printWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>Donation Receipt - ${don.receiptNumber}</title>
                                      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                                    </head>
                                    <body class="p-12 font-sans flex justify-center items-center h-screen bg-gray-100">
                                      <div class="bg-white p-8 rounded-3xl border-4 border-yellow-500 max-w-xl w-full shadow-xl">
                                        <div class="text-center border-b-2 border-yellow-400 pb-4 mb-6">
                                          <h1 class="text-2xl font-black text-orange-600">${settings.orgNameBangla}</h1>
                                          <p class="text-xs text-gray-500">অফিসিয়াল অনুদান রসিদপত্র</p>
                                          <p class="text-[9px] font-mono mt-1">${settings.orgNameEnglish}</p>
                                        </div>
                                        <div class="space-y-4 text-sm">
                                          <div class="flex justify-between"><span class="text-gray-500">রসিদ নম্বর:</span><span class="font-mono font-bold text-orange-600">${don.receiptNumber}</span></div>
                                          <div class="flex justify-between"><span class="text-gray-500">দাতার নাম:</span><span class="font-bold">${don.donorName}</span></div>
                                          <div class="flex justify-between"><span class="text-gray-500">মোবাইল নম্বর:</span><span>${don.donorMobile}</span></div>
                                          <div class="flex justify-between"><span class="text-gray-500">তহবিল ক্যাটাগরি:</span><span class="font-semibold">${don.category}</span></div>
                                          <div class="flex justify-between"><span class="text-gray-500">অনুদানের পরিমাণ:</span><span class="text-xl font-extrabold text-green-600">৳${don.amount.toLocaleString()}</span></div>
                                          <div class="flex justify-between"><span class="text-gray-500">পদ্ধতি:</span><span>${don.paymentMethod}</span></div>
                                          <div class="flex justify-between"><span class="text-gray-500">তারিখ:</span><span>${don.date}</span></div>
                                        </div>
                                        <div class="border-t border-gray-200 mt-6 pt-6 text-center text-xs text-gray-400">
                                          "এই ২৬শে প্রথম প্রয়াসে আমরা"<br>শ্রী ভগবানের কৃপায় আপনার কল্যাণ হোক।
                                        </div>
                                      </div>
                                      <script>window.onload = function() { window.print(); }</script>
                                    </body>
                                  </html>
                                `);
                                printWindow.document.close();
                              }
                            }}
                            className="p-1 bg-white border border-stone-200 hover:bg-stone-50 rounded text-[10px] font-bold text-stone-600 shadow-sm"
                          >
                            রসিদ প্রিন্ট
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. PAGE BUILDER */}
          {activeTab === 'pages' && (
            <div className="space-y-6 text-left text-sm">
              <h3 className="text-lg font-extrabold text-stone-800 border-b border-gray-100 pb-3">ডাইনামিক কাস্টম পেজ বিল্ডার (CMS Page Builder)</h3>
              
              {/* Form to add */}
              <form onSubmit={handleAddCustomPage} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="text-xs font-black text-orange-600 uppercase">নতুন কাস্টম ওয়েব পেজ তৈরি করুন</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">পাতার টাইটেল (Title)</label>
                    <input 
                      type="text" 
                      value={newPageTitle} 
                      onChange={e => setNewPageTitle(e.target.value)}
                      placeholder="যেমন: শ্রী মন্দিরের ইতিহাস"
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">ইউআরএল স্ল্যাগ (Slug)</label>
                    <input 
                      type="text" 
                      value={newPageSlug} 
                      onChange={e => setNewPageSlug(e.target.value)}
                      placeholder="যেমন: history-of-temple"
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition font-mono"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">পাতাটির বিস্তারিত কন্টেন্ট (Supports headers, lists, paragraphs)</label>
                    <textarea 
                      value={newPageContent} 
                      onChange={e => setNewPageContent(e.target.value)}
                      rows={6}
                      placeholder="যেমন: ### আমাদের ইতিহাস\n\nমন্দিরটি প্রতিষ্ঠার পর..."
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition resize-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    id="btn-page-add-submit"
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-xs shadow-md hover:from-orange-600 hover:to-amber-600 transition"
                  >
                    পাতা প্রকাশ করুন
                  </button>
                </div>
              </form>

              {/* Active list */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-stone-500 uppercase tracking-widest">সক্রিয় পাতা সূচি ({customPages.length})</h4>
                {customPages.map(page => (
                  <div key={page.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-extrabold text-stone-900">{page.title}</h4>
                      <p className="text-xs font-mono text-gray-400 mt-1">URL Route: /{page.slug}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteCustomPage(page.id)}
                      className="text-xs text-red-500 font-bold hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
                    >
                      ডিলিট
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. HTML UPLOAD SANDBOX */}
          {activeTab === 'html_uploads' && (
            <div className="space-y-6 text-left text-sm">
              <div>
                <h3 className="text-lg font-extrabold text-stone-800">HTML জিপ মডিউল আপলোডার (Code Sandbox Manager)</h3>
                <p className="text-xs text-gray-500 mt-1">উৎসব বা বিশেষ মেলা উপলক্ষে তৈরি সম্পূর্ণ কাস্টম সিঙ্গেল পেজ মাইক্রোসাইট কোড ইনজেক্ট করুন। এটি সম্পূর্ণ সুরক্ষিত ও স্যান্ডবক্সড আইফ্রেমে চালু হবে।</p>
              </div>

              {/* Form to add */}
              <form onSubmit={handleAddHtmlUpload} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="text-xs font-black text-orange-600 uppercase">নতুন স্যান্ডবক্স কোড ইন্টিগ্রেট করুন</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">মাইক্রোসাইট টাইটেল</label>
                    <input 
                      type="text" 
                      value={newHtmlTitle} 
                      onChange={e => setNewHtmlTitle(e.target.value)}
                      placeholder="যেমন: রথযাত্রা ২০২৬ উৎসব ধামাকা"
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">এসাইন ইউআরএল স্ল্যাগ (Slug)</label>
                    <input 
                      type="text" 
                      value={newHtmlSlug} 
                      onChange={e => setNewHtmlSlug(e.target.value)}
                      placeholder="যেমন: festival2026"
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition font-mono"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">HTML বডি স্ট্রাকচার (HTML Code)</label>
                    <textarea 
                      value={newHtmlHtml} 
                      onChange={e => setNewHtmlHtml(e.target.value)}
                      rows={4}
                      placeholder="<div class='bg-red-500 text-white'>পবিত্র রথযাত্রা মেলা...</div>"
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Custom CSS Styles (CSS Code)</label>
                    <textarea 
                      value={newHtmlCss} 
                      onChange={e => setNewHtmlCss(e.target.value)}
                      rows={3}
                      placeholder="body { color: gold; }"
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Custom JS Interaction Scripts (JS Code)</label>
                    <textarea 
                      value={newHtmlJs} 
                      onChange={e => setNewHtmlJs(e.target.value)}
                      rows={3}
                      placeholder="console.log('Sandbox Active!')"
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500 transition font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    id="btn-html-sandbox-add"
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-xs shadow-md hover:from-orange-600 hover:to-amber-600 transition"
                  >
                    কোড স্যান্ডবক্সে লঞ্চ করুন
                  </button>
                </div>
              </form>

              {/* List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-stone-500 uppercase tracking-widest">স্যান্ডবক্সড মডিউল সমূহ ({htmlUploads.length})</h4>
                {htmlUploads.map(up => (
                  <div key={up.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-extrabold text-stone-900">{up.title}</h4>
                      <p className="text-xs font-mono text-gray-400 mt-1">Sandboxed Route Path: /{up.slug}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteHtmlUpload(up.id)}
                      className="text-xs text-red-500 font-bold hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
                    >
                      ডিলিট
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. PVC ID CARD & CERTIFICATES CANVAS CONFIG */}
          {activeTab === 'templates' && (
            <div className="space-y-8 text-left text-sm">
              {/* ID Card Canvas Settings */}
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-6">
                <h3 className="text-lg font-extrabold text-stone-800 border-b border-stone-200 pb-3">পিভিসি আইডি কার্ড ডিজাইন ক্যানভাস (ID Card Template Canvas)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">আইডি কার্ড ব্যাকগ্রাউন্ড কালার</label>
                    <input 
                      type="text" 
                      value={localIdTemplate.cardBgColor} 
                      onChange={e => setLocalIdTemplate({ ...localIdTemplate, cardBgColor: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">আইডি কার্ড টেক্সট কালার</label>
                    <input 
                      type="text" 
                      value={localIdTemplate.cardTextColor} 
                      onChange={e => setLocalIdTemplate({ ...localIdTemplate, cardTextColor: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">কার্ড হেডার ব্যাকগ্রাউন্ড</label>
                    <input 
                      type="text" 
                      value={localIdTemplate.headerBgColor} 
                      onChange={e => setLocalIdTemplate({ ...localIdTemplate, headerBgColor: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">সভাপতির সিগনেচার URL</label>
                    <input 
                      type="text" 
                      value={localIdTemplate.signatureUrl} 
                      onChange={e => setLocalIdTemplate({ ...localIdTemplate, signatureUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">কার্ডের পিছনের শর্তাবলী</label>
                    <textarea 
                      value={localIdTemplate.customTerms} 
                      onChange={e => setLocalIdTemplate({ ...localIdTemplate, customTerms: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-stone-200">
                  <button 
                    id="btn-id-template-save"
                    type="button"
                    onClick={handleSaveIdTemplate}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs"
                  >
                    আইডি কার্ড টেমপ্লেট সেভ করুন
                  </button>
                </div>
              </div>

              {/* Certificate Template Settings */}
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-6">
                <h3 className="text-lg font-extrabold text-stone-800 border-b border-stone-200 pb-3">সার্টিফিকেট ও প্রশংসাপত্র টেমপ্লেট এডিটর</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">সার্টিফিকেট মূল শিরোনাম</label>
                    <input 
                      type="text" 
                      value={localCertTemplate.title} 
                      onChange={e => setLocalCertTemplate({ ...localCertTemplate, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">সার্টিফিকেট ফ্রেম বর্ডার স্টাইল</label>
                    <select 
                      value={localCertTemplate.borderStyle} 
                      onChange={e => setLocalCertTemplate({ ...localCertTemplate, borderStyle: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none"
                    >
                      <option value="classic">Classic double frame (ঐতিহ্যবাহী)</option>
                      <option value="modern">Modern round accent (আধুনিক)</option>
                      <option value="royal">Royal golden crown frame (রাজকীয়)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">স্বাক্ষরকারী ১ (নাম)</label>
                    <input 
                      type="text" 
                      value={localCertTemplate.signatory1Name} 
                      onChange={e => setLocalCertTemplate({ ...localCertTemplate, signatory1Name: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">স্বাক্ষরকারী ১ (পদবী)</label>
                    <input 
                      type="text" 
                      value={localCertTemplate.signatory1Role} 
                      onChange={e => setLocalCertTemplate({ ...localCertTemplate, signatory1Role: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">সার্টিফিকেট প্রধান বডি টেক্সট (Use placeholders: [NAME], [MEMBER_ID], [ROLE], [EVENT])</label>
                    <textarea 
                      value={localCertTemplate.bodyTemplate} 
                      onChange={e => setLocalCertTemplate({ ...localCertTemplate, bodyTemplate: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none resize-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-stone-200">
                  <button 
                    id="btn-cert-template-save"
                    type="button"
                    onClick={handleSaveCertTemplate}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs"
                  >
                    প্রশংসাপত্র ফরম্যাট সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 11. DOCUMENT DRAFTS & ADMINISTRATOR APPROVALS */}
          {activeTab === 'approvals' && (
            <div className="space-y-8 text-left text-sm animate-fade-in">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-lg font-extrabold text-stone-800">নথি খসড়া ও অনুমোদন ব্যবস্থা (Document Drafts & Approvals)</h3>
                <p className="text-xs text-gray-500 mt-1">
                  আইডি কার্ড এবং প্রশংসাপত্র সরাসরি পাবলিকলি প্রকাশিত হয় না। অ্যাডমিন প্রথমে খসড়া নথি তৈরি করে পর্যালোচনার জন্য পাঠাবেন। শুধুমাত্র সুপার অ্যাডমিন (স্বজন দে) তা চূড়ান্ত অনুমোদন বা বাতিল করতে পারবেন।
                </p>
              </div>

              {/* Status overview cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-orange-600 uppercase block">পর্যালোচনার অপেক্ষায় (Pending Super Admin)</span>
                  <span className="text-2xl font-black text-orange-700 mt-1 block">
                    {members.filter(m => m.idCardApprovedState === 'PENDING_SUPER_ADMIN_REVIEW' || m.certificateApprovedState === 'PENDING_SUPER_ADMIN_REVIEW').length}
                  </span>
                </div>
                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-green-600 uppercase block">চূড়ান্ত অনুমোদিত নথি (Approved Documents)</span>
                  <span className="text-2xl font-black text-green-700 mt-1 block">
                    {members.filter(m => m.idCardApprovedState === 'APPROVED' && m.certificateApprovedState === 'APPROVED').length}
                  </span>
                </div>
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">আমার অ্যাডমিন রোল (Your Active Privilege)</span>
                  <span className="text-sm font-extrabold text-stone-700 mt-2 block flex items-center gap-1.5">
                    {currentUser.role === MemberRole.SUPER_ADMIN ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                        সুপার অ্যাডমিন (Super Admin - Full Control)
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                        কমিটি অ্যাডমিন (Admin - Read & Submit Drafts only)
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Main review split layout */}
              <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">নথি খসড়া তালিকা (Document Draft Workspace)</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 text-[11px] font-bold uppercase tracking-wider">
                        <th className="pb-3 pl-2">সদস্যের নাম (Member)</th>
                        <th className="pb-3">ডিজিটাল আইডি কার্ড অবস্থা</th>
                        <th className="pb-3">শংসাপত্র অবস্থা</th>
                        <th className="pb-3 text-right">পদক্ষেপ (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs">
                      {members.filter(m => m.role !== MemberRole.SUPER_ADMIN).map(m => (
                        <tr key={m.id} className="hover:bg-white transition">
                          <td className="py-3.5 pl-2">
                            <div className="font-extrabold text-stone-800">{m.banglaName}</div>
                            <div className="text-[10px] text-stone-400 font-mono mt-0.5">{m.englishName} ({m.mobile})</div>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              m.idCardApprovedState === 'APPROVED' ? 'bg-green-50 text-green-700 border border-green-200' :
                              m.idCardApprovedState === 'PENDING_SUPER_ADMIN_REVIEW' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                              m.idCardApprovedState === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' :
                              'bg-stone-100 text-stone-500'
                            }`}>
                              {m.idCardApprovedState === 'APPROVED' ? 'APPROVED' :
                               m.idCardApprovedState === 'PENDING_SUPER_ADMIN_REVIEW' ? 'PENDING REVIEW' :
                               m.idCardApprovedState === 'REJECTED' ? 'REJECTED' : 'DRAFT/NONE'}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              m.certificateApprovedState === 'APPROVED' ? 'bg-green-50 text-green-700 border border-green-200' :
                              m.certificateApprovedState === 'PENDING_SUPER_ADMIN_REVIEW' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                              m.certificateApprovedState === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' :
                              'bg-stone-100 text-stone-500'
                            }`}>
                              {m.certificateApprovedState === 'APPROVED' ? 'APPROVED' :
                               m.certificateApprovedState === 'PENDING_SUPER_ADMIN_REVIEW' ? 'PENDING REVIEW' :
                               m.certificateApprovedState === 'REJECTED' ? 'REJECTED' : 'DRAFT/NONE'}
                            </span>
                          </td>
                          <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                            {/* Admin actions: Draft & Submit */}
                            {currentUser.role === MemberRole.ADMIN && (
                              <div className="flex justify-end gap-1.5 items-center">
                                <button 
                                  onClick={() => {
                                    const updated = members.map(item => {
                                      if (item.id === m.id) {
                                        return { ...item, idCardApprovedState: 'PENDING_SUPER_ADMIN_REVIEW', certificateApprovedState: 'PENDING_SUPER_ADMIN_REVIEW' };
                                      }
                                      return item;
                                    });
                                    onUpdateMembers(updated);
                                    showNotification(`${m.banglaName}-এর নথি সুপার অ্যাডমিন পর্যালোচনায় পাঠানো হয়েছে!`);
                                  }}
                                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-[10px] shadow"
                                >
                                  পর্যালোচনায় পাঠান
                                </button>
                                <button 
                                  onClick={() => {
                                    const updated = members.map(item => {
                                      if (item.id === m.id) {
                                        return { ...item, idCardApprovedState: 'DRAFT', certificateApprovedState: 'DRAFT' };
                                      }
                                      return item;
                                    });
                                    onUpdateMembers(updated);
                                    showNotification(`${m.banglaName}-এর নথি ড্রাফট মোডে রিসেট করা হয়েছে।`);
                                  }}
                                  className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-bold text-[10px]"
                                >
                                  ড্রাফট করুন
                                </button>
                              </div>
                            )}

                            {/* Super Admin actions: Full Approve / Reject */}
                            {currentUser.role === MemberRole.SUPER_ADMIN && (
                              <div className="flex justify-end gap-1.5 items-center">
                                {/* Approve button */}
                                <button 
                                  onClick={() => {
                                    const updated = members.map(item => {
                                      if (item.id === m.id) {
                                        return { ...item, idCardApprovedState: 'APPROVED', certificateApprovedState: 'APPROVED', status: ApplicationStatus.APPROVED };
                                      }
                                      return item;
                                    });
                                    onUpdateMembers(updated);
                                    showNotification(`${m.banglaName}-এর নথি সুপার অ্যাডমিন কর্তৃক চূড়ান্ত অনুমোদিত ও ইস্যু করা হয়েছে!`);
                                  }}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] shadow"
                                >
                                  অনুমোদন করুন (Approve)
                                </button>
                                {/* Reject button */}
                                <button 
                                  onClick={() => {
                                    const updated = members.map(item => {
                                      if (item.id === m.id) {
                                        return { ...item, idCardApprovedState: 'REJECTED', certificateApprovedState: 'REJECTED' };
                                      }
                                      return item;
                                    });
                                    onUpdateMembers(updated);
                                    showNotification(`${m.banglaName}-এর নথি খসড়া প্রত্যাখ্যান করা হয়েছে।`);
                                  }}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[10px] shadow"
                                >
                                  প্রত্যাখ্যান (Reject)
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Digital audit logging of actions */}
              <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 text-left">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">নথি অনুমোদন কার্যক্রমের অডিট হিস্টোরি (Administrative Cryptographic Log)</h4>
                <div className="space-y-3 font-mono text-[10px] text-stone-600 max-h-40 overflow-y-auto pr-2">
                  <div className="p-2.5 bg-white border border-stone-200 rounded-xl">
                    <span className="text-emerald-600 font-bold">[APPROVED]</span> {new Date().toLocaleString('bn-BD')} | অপারেটর: স্বজন দে (SUPER_ADMIN)
                    <br />
                    <span className="text-stone-400">অ্যাকশন:</span> সুভেল দেবের খসড়া পর্যালোচনা শেষে চূড়ান্ত গণরাজ ডিজিটাল প্রশংসাপত্র ও PVC আইডি সাইন এবং ইস্যু করা হয়েছে।
                  </div>
                  <div className="p-2.5 bg-white border border-stone-200 rounded-xl">
                    <span className="text-blue-600 font-bold">[SUBMITTED]</span> {new Date().toLocaleString('bn-BD')} | অপারেটর: সুভেল দেব (ADMIN)
                    <br />
                    <span className="text-stone-400">অ্যাকশন:</span> কক্সবাজার বনরূপা পাড়া এলাকার ৩ জন নতুন ভক্তের প্রশংসাপত্র খসড়া সুপার এডমিন প্যানেলে পাঠানো হয়েছে।
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 12. BACKUP & RESTORE */}
          {activeTab === 'backups' && (
            <div className="space-y-6 text-left text-sm">
              <div>
                <h3 className="text-lg font-extrabold text-stone-800">ডাটাবেস ব্যাকআপ ও রিস্টোর (Disaster Recovery Command)</h3>
                <p className="text-xs text-gray-500 mt-1">সম্পূর্ণ ওয়েবসাইট, নোটিশ, সদস্য ডাটাবেস ও অনুদান রেকর্ডগুলির ব্যাকআপ ডাউনলোড করুন এবং পূর্বে ডাউনলোড করা ব্যাকআপ রিস্টোর করুন।</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Data */}
                <div className="p-6 bg-stone-50 border border-stone-200 rounded-3xl space-y-4">
                  <h4 className="text-xs font-black text-orange-600 uppercase">সম্পূর্ণ সাইট ব্যাকআপ এক্সপোর্ট</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">এটি একটি একক JSON ফাইলে আপনার সমস্ত সেটিংস, সদস্য তালিকা, অনুদান রেকর্ড, কাস্টম পেজ, থিম কালার এবং নোটিশগুলি সংরক্ষণ করবে।</p>
                  
                  <button 
                    id="btn-backup-export"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                        settings, sections, members, notices, events, donations, donationCategories, customPages, htmlUploads, idCardTemplate, certificateTemplate
                      }, null, 2));
                      const a = document.createElement('a');
                      a.setAttribute("href", dataStr);
                      a.setAttribute("download", "Ganaraj_Ekota_Sangha_FULL_BACKUP.json");
                      a.click();
                      showNotification('সম্পূর্ণ ডাটাবেস ব্যাকআপ (.json) সফলভাবে ডাউনলোড হয়েছে!');
                    }}
                    className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow w-full text-center"
                  >
                    মেমোরি ব্যাকআপ ফাইল ডাউনলোড করুন
                  </button>
                </div>

                {/* Import Data */}
                <div className="p-6 bg-stone-50 border border-stone-200 rounded-3xl space-y-4">
                  <h4 className="text-xs font-black text-orange-600 uppercase">ডাটাবেস ব্যাকআপ রিস্টোর</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">পূর্বে ডাউনলোড করা JSON ব্যাকআপ ফাইলটি আপলোড করে আপনার সম্পূর্ণ সাইট পুনরুদ্ধার করতে পারবেন।</p>
                  
                  <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center cursor-pointer hover:border-orange-400 transition bg-white">
                    <input 
                      type="file" 
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const restored = JSON.parse(event.target?.result as string);
                              if (restored.settings) onUpdateSettings(restored.settings);
                              if (restored.sections) onUpdateSections(restored.sections);
                              if (restored.members) onUpdateMembers(restored.members);
                              if (restored.notices) onUpdateNotices(restored.notices);
                              if (restored.events) onUpdateEvents(restored.events);
                              if (restored.donations) onUpdateDonations(restored.donations);
                              if (restored.donationCategories) onUpdateDonationCategories(restored.donationCategories);
                              if (restored.customPages) onUpdateCustomPages(restored.customPages);
                              if (restored.htmlUploads) onUpdateHtmlUploads(restored.htmlUploads);
                              if (restored.idCardTemplate) onUpdateIdCardTemplate(restored.idCardTemplate);
                              if (restored.certificateTemplate) onUpdateCertificateTemplate(restored.certificateTemplate);
                              showNotification('ডাটাবেস ব্যাকআপ ফাইল সফলভাবে পুনরুদ্ধার ও রিফ্রেশ করা হয়েছে!');
                            } catch (err) {
                              alert('রিস্টোর করার সময় ত্রুটি ঘটেছে। ব্যাকআপ ফাইলটি সঠিক নয়।');
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="hidden" 
                      id="upload-backup-input" 
                    />
                    <label htmlFor="upload-backup-input" className="text-xs text-gray-500 cursor-pointer block">
                      ক্লিক করে ব্যাকআপ ফাইল (.json) সিলেক্ট করুন
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
