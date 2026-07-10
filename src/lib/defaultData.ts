import { 
  OrgSettings, 
  HomepageSection, 
  CommitteeTerm, 
  Notice, 
  EventItem, 
  DonationRecord, 
  DonationCategory,
  CustomPage,
  UploadedHTML,
  IdCardTemplate,
  CertificateTemplate,
  Member,
  MemberRole,
  ApplicationStatus,
  MediaFile,
  AuditLog
} from '../types';

export const INITIAL_ORG_SETTINGS: OrgSettings = {
  orgNameBangla: 'গণরাজ একতা সংঘ',
  orgNameEnglish: 'Ganaraj Ekota Sangha',
  shortName: 'GES',
  slogan: 'এই ২৬শে প্রথম প্রয়াসে আমরা',
  logoUrl: 'https://i.ibb.co.com/DPr4kZJB/Chat-GPT-Image-Jun-20-2026-11-14-56-PM-1.png',
  faviconUrl: 'https://i.ibb.co.com/DPr4kZJB/Chat-GPT-Image-Jun-20-2026-11-14-56-PM-1.png',
  bannerUrl: 'https://images.unsplash.com/photo-1609137144814-1e0e98161578?auto=format&fit=crop&q=80&w=1200',
  themeColorPrimary: '#FF6321', // Professional Polish Saffron Orange
  themeColorSecondary: '#FF9933', // Professional Polish Light Orange
  themeColorAccent: '#F59E0B', // Amber Gold-500
  themeMode: 'light',
  fontFamily: 'Inter, Hind Siliguri, sans-serif',
  footerText: '© ২০২৬ গণরাজ একতা সংঘ। সর্বস্বত্ব সংরক্ষিত।',
  address: 'বিজিবি ক্যাম্প, বনরূপা পাড়া, কক্সবাজার',
  contactNumber: '+880 1775-488049',
  email: '',
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m4!2sSylhet!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375054d3d270309b%3A0xdf6da01511993433!2sSylhet!5e0!3m2!1sen!2sbd!4v1600000000000',
  websiteUrl: 'https://ganarajekotasangha.org',
  socialMediaLinks: {
    facebook: 'https://facebook.com/ganarajekotasangha',
    youtube: 'https://youtube.com/ganarajekotasangha',
    twitter: 'https://twitter.com/ganarajekota',
    instagram: 'https://instagram.com/ganarajekotasangha'
  },
  mission: 'আমাদের মূল লক্ষ্য হিন্দু ধর্মীয় কৃষ্টি, সংস্কৃতি ও ঐতিহ্যের সংরক্ষণ, উন্নয়ন এবং সামাজিক ঐক্য বজায় রাখা। পিছিয়ে পড়া জনগোষ্ঠীর পাশে দাঁড়ানো ও বিভিন্ন উৎসবের সফল আয়োজন করা।',
  vision: 'একটি সুসংগঠিত, আলোকিত ও স্বাবলম্বী সমাজ গড়ে তোলা যেখানে প্রতিটি মানুষ ধর্মীয় ও মানবিক মূল্যবোধে বলীয়ান হয়ে ঐক্যবদ্ধভাবে বসবাস করবে।',
  history: 'গণরাজ একতা সংঘের প্রতিষ্ঠা হয়েছিল একদল উদ্যমী তরুণের হাত ধরে। ২৬শে প্রথম প্রয়াসে আমাদের এই পথচলা শুরু হয়। এরপর থেকে প্রতিটি ধর্মীয় উৎসবে আমাদের সক্রিয় অংশগ্রহণ এবং সামাজিক কার্যক্রমে এই অঞ্চলের অন্যতম নির্ভরযোগ্য সংগঠনে পরিণত করেছে আমাদের এই সংঘকে।',
  presidentName: 'সুভেল দেব',
  presidentPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  presidentMessage: 'গণরাজ একতা সংঘের সকল সদস্য, শুভাকাঙ্ক্ষী ও সাধারণ জনগণকে আমার আন্তরিক শারদীয় ও উৎসবের শুভেচ্ছা। আমাদের এই সংঘ কেবল উৎসব কেন্দ্রিক নয়, বরং সমাজের ইতিবাচক পরিবর্তনে কাজ করাই আমাদের অঙ্গীকার। আসুন আমরা সকলে মিলে ঐক্যবদ্ধ হয়ে সমাজের মঙ্গলে নিয়োজিত থাকি।',
  secretaryName: 'প্রান্ত দে',
  secretaryPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  secretaryMessage: 'আমাদের এই দীর্ঘ পথচলায় যারা আমাদের ছায়ার মতো আগলে রেখেছেন, তাদের প্রতি আমার বিনম্র শ্রদ্ধা। সদস্যদের অক্লান্ত পরিশ্রম এবং জনগণের সহযোগিতা আমাদের এগিয়ে চলার প্রধান চালিকাশক্তি। ২৬শে প্রথম প্রয়াসে আমরা যে সংকল্প নিয়েছিলাম, তা বজায় রাখতে আমরা অঙ্গীকারবদ্ধ।',
  customCss: '/* Custom adjustments */\n.premium-shadow { box-shadow: 0 10px 30px -10px rgba(249, 115, 22, 0.2); }',
  customJs: '// Custom site interactions\nconsole.log("Ganaraj Ekota Sangha CMS initialized.");',
  seoTitle: 'গণরাজ একতা সংঘ - Ganaraj Ekota Sangha',
  seoDescription: 'গণরাজ একতা সংঘ (Ganaraj Ekota Sangha) এর অফিসিয়াল ওয়েবসাইট ও ধর্মীয় সংগঠন পরিচালনা ব্যবস্থা।',
  analyticsCode: '<!-- GA4 Code -->\n<script>console.log("Analytics Mocked");</script>'
};

export const INITIAL_SECTIONS: HomepageSection[] = [
  { id: 'hero', title: 'হিরো ব্যানার (Hero Banner)', enabled: true, order: 1 },
  { id: 'welcome', title: 'স্বাগতম বার্তা (Welcome Message)', enabled: true, order: 2 },
  { id: 'president_msg', title: 'সভাপতি ও সম্পাদকের বাণী (Messages)', enabled: true, order: 3 },
  { id: 'committee', title: 'কার্যকরী কমিটি (Committee)', enabled: true, order: 4 },
  { id: 'notices', title: 'নোটিশ বোর্ড (Notices)', enabled: true, order: 5 },
  { id: 'events', title: 'আসন্ন উৎসব ও ইভেন্ট (Events)', enabled: true, order: 6 },
  { id: 'gallery', title: 'ফটো গ্যালারি (Gallery)', enabled: true, order: 7 },
  { id: 'donation', title: 'অনুদান তহবিল (Donation)', enabled: true, order: 8 },
  { id: 'stats', title: 'পরিসংখ্যান (Statistics)', enabled: true, order: 9 },
  { id: 'volunteers', title: 'স্বেচ্ছাসেবক কর্নার (Volunteers)', enabled: true, order: 10 }
];

export const INITIAL_COMMITTEE_TERM: CommitteeTerm = {
  id: 'term-2026',
  termName: '২০২৬-২০২৭ কার্যকরী কমিটি',
  isActive: true,
  members: [
    {
      id: 'c1',
      name: 'সুভেল দেব',
      designation: 'সভাপতি',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      bio: 'সংঘের সম্মানিত সভাপতি ও প্রধান পৃষ্ঠপোষক।',
      contact: '০১৭১২-৩৪৫৬৭৮',
      socialLinks: { facebook: 'https://facebook.com' }
    },
    {
      id: 'c2',
      name: 'প্রশান্ত দাশ',
      designation: 'সহ-সভাপতি',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      bio: 'সংঘের সহ-সভাপতি ও উৎসব সমন্বয়কারী।',
      contact: '০১৭১২-৮৭৬৫৪৩',
      socialLinks: { facebook: 'https://facebook.com' }
    },
    {
      id: 'c3',
      name: 'জয় শর্মা',
      designation: 'পরিচালক',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      bio: 'মণ্ডপ ও উৎসবের সার্বিক পরিচালক।',
      contact: '০১৭১২-১১২২৩৩',
      socialLinks: {}
    },
    {
      id: 'c4',
      name: 'স্বজন দে',
      designation: 'সহ-পরিচালক',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      bio: 'মণ্ডপ সাজসজ্জা ও পরিচালনা সাহায্যকারী।',
      contact: '০১৭১২-৪৪৫৫৬৬',
      socialLinks: {}
    },
    {
      id: 'c5',
      name: 'প্রান্ত দে',
      designation: 'সাধারণ সম্পাদক',
      photoUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200',
      bio: 'সংঘের সাধারণ সম্পাদক ও সাংগঠনিক স্তম্ভ।',
      contact: '০১৭১২-৭৭৮৮৯৯',
      socialLinks: { facebook: 'https://facebook.com' }
    },
    {
      id: 'c6',
      name: 'শুভ শর্মা',
      designation: 'সহ-সাধারণ সম্পাদক',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      bio: 'দাপ্তরিক ও প্রশাসনিক কাজে সহায়তা প্রদানকারী।',
      contact: '০১৭১২-০০১১২২',
      socialLinks: {}
    },
    {
      id: 'c7',
      name: 'প্রান্ত দে (পুজন)',
      designation: 'সাংগঠনিক সম্পাদক',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      bio: 'সকল উৎসব ও কার্যক্রমের মূল সংগঠক।',
      contact: '০১৭১২-৩৩৪৪৫৫',
      socialLinks: {}
    },
    {
      id: 'c8',
      name: 'ওম শর্মা',
      designation: 'সহ-সাংগঠনিক সম্পাদক',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      bio: 'সাংগঠনিক কাজে সার্বিক সমন্বয়কারী।',
      contact: '০১৭১২-৫৫৬৬৭৭',
      socialLinks: {}
    },
    {
      id: 'c9',
      name: 'বিজয় শর্মা',
      designation: 'অর্থ সম্পাদক',
      photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200',
      bio: 'তহবিল ও আয়ের হিসাব রক্ষক।',
      contact: '০১৭১২-৮৮৯৯০০',
      socialLinks: {}
    },
    {
      id: 'c10',
      name: 'জয় মল্লিক',
      designation: 'সহ-অর্থ সম্পাদক',
      photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
      bio: 'অর্থনৈতিক কার্যক্রমে সহায়তা প্রদানকারী।',
      contact: '০১৭১২-১২৩৪৫৬',
      socialLinks: {}
    }
  ]
};

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'গণরাজ একতা সংঘের বার্ষিক সাধারণ সভা ২০২৬',
    content: 'সকল কার্যকরী কমিটির সদস্য ও সাধারণ সদস্যদের জানানো যাচ্ছে যে, আগামী ১৫ই জুলাই ২০২৬, রোজ রবিবার সকাল ১০:০০ ঘটিকায় সংঘের প্রধান কার্যালয়ে বার্ষিক সাধারণ সভা অনুষ্ঠিত হবে। উক্ত সভায় সকলের উপস্থিতি একান্ত কাম্য।',
    category: 'জেনারেল নোটিশ',
    publishDate: '২০২৬-০৭-০১',
    isPinned: true,
    isPopup: true
  },
  {
    id: 'n2',
    title: 'আসন্ন শ্রীকৃষ্ণ জন্মাষ্টমী উৎসবের প্রস্তুতি সভা',
    content: 'আসন্ন শ্রীকৃষ্ণ জন্মাষ্টমী উৎসব বর্ণিল ও উৎসবমুখর পরিবেশে উদযাপনের লক্ষ্যে আগামী ২০শে জুলাই ২০২৬, রোজ শুক্রবার সন্ধ্যা ৭:০০ ঘটিকায় এক প্রস্তুতি সভা আহ্বান করা হয়েছে। সভায় মণ্ডপ সাজসজ্জা, শোভাযাত্রা ও অনুদান সংগ্রহ নিয়ে বিশদ আলোচনা হবে।',
    category: 'উৎসব নোটিশ',
    publishDate: '২০২৬-০৭-০৮',
    isPinned: true,
    isPopup: false
  },
  {
    id: 'n3',
    title: 'সার্বজনীন পূজা মণ্ডপ অনুদান সংগ্রহ প্রসঙ্গে',
    content: 'আমাদের গৌরবময় দুর্গাপূজা ২০২৬ উপলক্ষে পূজার তহবিল সংগ্রহের জন্য রসিদ বই ও কিউআর কোড প্রস্তুত রয়েছে। আগ্রহী ভক্তদের অর্থ ও অন্যান্য সাহায্য করার অনুরোধ জানানো যাচ্ছে। সকল প্রকার অনুদানের রসিদ প্রদান করা হবে।',
    category: 'অনুদান',
    publishDate: '২০26-০৭-০৯',
    isPinned: false,
    isPopup: false
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'মহোৎসব শ্রীকৃষ্ণ জন্মাষ্টমী ২০২৬',
    description: 'ভগবান শ্রীকৃষ্ণের পবিত্র শুভ আবির্ভাব তিথি উপলক্ষে গীতা পাঠ প্রতিযোগিতা, মহাপ্রসাদ বিতরণ, বর্ণাঢ্য শোভাযাত্রা ও সাংস্কৃতিক সন্ধ্যার আয়োজন করা হয়েছে।',
    date: '২০২৬-০৯-০৩',
    time: 'সকাল ৮:০০ - রাত ১১:০০',
    location: 'গণরাজ কেন্দ্রীয় মণ্ডপ, সিলেট',
    bannerUrl: 'https://images.unsplash.com/photo-1608958416715-db870c5383be?auto=format&fit=crop&q=80&w=800',
    volunteersNeeded: true,
    registeredVolunteers: [],
    rsvps: []
  },
  {
    id: 'e2',
    title: 'শারদীয় দুর্গোৎসব ২০২৬',
    description: 'আমাদের প্রধান ধর্মীয় উৎসব শারদীয় দুর্গাপূজার মহাসপ্তমী থেকে মহানবমী পর্যন্ত চণ্ডীপাঠ, আরতি প্রতিযোগিতা, ভক্তিমূলক সঙ্গীতানুষ্ঠান এবং বিজয়া দশমীর শোভাযাত্রা।',
    date: '২০২৬-১০-১৯',
    time: 'দিনব্যাপী কার্যক্রম',
    location: 'গণরাজ একতা সংঘ প্রাঙ্গণ, সিলেট',
    bannerUrl: 'https://images.unsplash.com/photo-1561361513-2d000a45f0d2?auto=format&fit=crop&q=80&w=800',
    volunteersNeeded: true,
    registeredVolunteers: [],
    rsvps: []
  },
  {
    id: 'e3',
    title: 'শ্রী জগন্নাথ রথযাত্রা উৎসব',
    description: 'শ্রী জগন্নাথ দেবের রথ টানার আনন্দঘন উৎসব ও মেলা। মহাপ্রসাদ বিতরণ ও শ্রীমদ্ভগবদ্গীতা প্রবচন।',
    date: '২০২৬-০৭-১৬',
    time: 'দুপুর ২:০০ - সন্ধ্যা ৭:০০',
    location: 'সিলেট মেইন রোড',
    bannerUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=800',
    volunteersNeeded: false,
    registeredVolunteers: [],
    rsvps: []
  }
];

export const INITIAL_DONATION_CATEGORIES: DonationCategory[] = [
  { id: 'cat1', name: 'দুর্গাপূজা তহবিল (Durga Puja)', targetAmount: 500000, raisedAmount: 325000 },
  { id: 'cat2', name: 'মন্দির নির্মাণ ও সংস্কার (Temple Building)', targetAmount: 1000000, raisedAmount: 475000 },
  { id: 'cat3', name: 'অসহায় পরিবার কল্যাণ (Social Welfare)', targetAmount: 150000, raisedAmount: 90000 },
  { id: 'cat4', name: 'জন্মাষ্টমী উৎসব (Janmashtami)', targetAmount: 200000, raisedAmount: 120000 }
];

export const INITIAL_DONATION_RECORDS: DonationRecord[] = [
  {
    id: 'd1',
    donorName: 'সুব্রত রায়',
    donorEmail: 'subrata@gmail.com',
    donorMobile: '০১৭১১-২২৩৩৪৪',
    amount: 25000,
    category: 'দুর্গাপূজা তহবিল (Durga Puja)',
    paymentMethod: 'bKash (বিকাশ)',
    paymentStatus: 'PAID',
    date: '২০২৬-০৭-০২',
    remarks: 'পূজার উৎসবের জন্য ক্ষুদ্র নিবেদন।',
    receiptNumber: 'GES-2026-REC-001'
  },
  {
    id: 'd2',
    donorName: 'অনুপম তালুকদার',
    donorEmail: 'anupam@yahoo.com',
    donorMobile: '০১৭১২-৪৪৫৫৬৬',
    amount: 10000,
    category: 'মন্দির নির্মাণ ও সংস্কার (Temple Building)',
    paymentMethod: 'Nagad (নগদ)',
    paymentStatus: 'PAID',
    date: '২০২৬-০৭-০৫',
    remarks: 'পবিত্র ইটের জন্য অনুদান।',
    receiptNumber: 'GES-2026-REC-002'
  },
  {
    id: 'd3',
    donorName: 'তন্ময় চক্রবর্তী',
    donorEmail: 'tonmoy@gmail.com',
    donorMobile: '০১৭১৫-৭৭৮৮৯৯',
    amount: 15000,
    category: 'জন্মাষ্টমী উৎসব (Janmashtami)',
    paymentMethod: 'Bank Transfer (ব্যাংক)',
    paymentStatus: 'PAID',
    date: '২০২৬-০৭-০৮',
    remarks: 'সাংস্কৃতিক অনুষ্ঠানের জন্য অনুদান।',
    receiptNumber: 'GES-2026-REC-003'
  }
];

export const INITIAL_CUSTOM_PAGES: CustomPage[] = [
  {
    id: 'page1',
    slug: 'about',
    title: 'আমাদের সম্পর্কে (About Us)',
    content: '### গণরাজ একতা সংঘ\n\nগণরাজ একতা সংঘ একটি স্বেচ্ছাসেবী, সামাজিক ও ধর্মীয় প্রতিষ্ঠান। আমরা এই অঞ্চলে সনাতন ধর্মের কৃষ্টি, আচার-অনুষ্ঠান এবং সাম্য ও ঐক্যের শিক্ষা প্রচার করে আসছি।\n\n#### আমাদের মূল ভিত্তি\n- **ঐক্য**: সনাতন সমাজের প্রতিটি স্তরের মানুষকে এক সুতায় বাঁধা।\n- **সেবা**: আর্তমানবতার সেবায় নিজেকে নিয়োজিত করা।\n- **আলোকিত আগামী**: সমাজ থেকে ধর্মীয় কুসংস্কার দূর করে সুস্থ মনন গঠন করা।',
    published: true,
    createdAt: '২০২৬-০৬-০১'
  },
  {
    id: 'page2',
    slug: 'rules',
    title: 'সংঘের নিয়মনীতি (Rules & Regulations)',
    content: '### সদস্যগণের পালনীয় সাধারণ নিয়মনীতি\n\n১. সংঘের প্রতিটি সদস্যকে সনাতন আদর্শ ও অহিংসা নীতি মেনে চলতে হবে।\n২. উৎসব বা সাধারণ সভার সিদ্ধান্তসমূহ সকলকে সম্মান করতে হবে।\n৩. সংঘের সুনাম ক্ষুণ্ণ করে এমন কোনো সমাজবিরোধী বা রাষ্ট্রবিরোধী কার্যকলাপে জড়িত থাকা যাবে না।\n৪. মাসিক বা বাৎসরিক অনুদান সময়মতো ফান্ডে জমা করতে হবে।',
    published: true,
    createdAt: '২০২৬-০৬-০৫'
  }
];

export const INITIAL_ID_CARD_TEMPLATE: IdCardTemplate = {
  cardBgColor: '#fff7ed', // orange-50
  cardTextColor: '#1c1917', // stone-900
  headerBgColor: '#ea580c', // deep orange
  headerTextColor: '#ffffff',
  signatureUrl: 'https://i.ibb.co.com/8m4Qk0g/signature.png', // Fallback placeholder
  sealUrl: 'https://i.ibb.co.com/DPr4kZJB/Chat-GPT-Image-Jun-20-2026-11-14-56-PM-1.png',
  fontFamily: 'Inter',
  showBarcode: true,
  showQrCode: true,
  customTerms: '১. এই কার্ডটি গণরাজ একতা সংঘের সম্পত্তি।\n২. কার্ডটি হস্তান্তরযোগ্য নয় এবং হারিয়ে গেলে অবিলম্বে অফিসকে জানাতে হবে।'
};

export const INITIAL_CERTIFICATE_TEMPLATE: CertificateTemplate = {
  title: 'প্রশংসাপত্র / সনদাঙ্কন',
  subTitle: 'গণরাজ একতা সংঘ (Ganaraj Ekota Sangha)',
  bodyTemplate: 'পরম করুণাময় ঈশ্বরের পরম কৃপায়, এই প্রশংসাপত্রটি অত্যন্ত গৌরবের সাথে [NAME] কে প্রদান করা হচ্ছে, যার সদস্য আইডি [MEMBER_ID]। তিনি গণরাজ একতা সংঘের একজন সক্রিয় [ROLE] হিসেবে সমাজসেবামূলক কর্মকাণ্ডে ও [EVENT] উদযাপনে অত্যন্ত প্রশংসনীয় অবদান রেখেছেন। আমরা ওনার সর্বাঙ্গীন মঙ্গল কামনা করছি।',
  signatory1Name: 'সুভেল দেব',
  signatory1Role: 'সভাপতি, গণরাজ একতা সংঘ',
  signatory2Name: 'প্রান্ত দে',
  signatory2Role: 'সাধারণ সম্পাদক, গণরাজ একতা সংঘ',
  borderStyle: 'classic',
  primaryColor: '#ea580c'
};

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    username: 'suvel',
    membershipNumber: 'GES-2026-0001',
    role: MemberRole.SUPER_ADMIN,
    status: ApplicationStatus.APPROVED,
    joinedDate: '২০২৬-০১-০১',
    banglaName: 'সুভেল দেব',
    englishName: 'Suvel Dev',
    fatherName: 'সুনীল দেব',
    motherName: 'গীতা রানী দেব',
    dob: '১৯৮৫-১২-১৫',
    gender: 'পুরুষ',
    bloodGroup: 'B+',
    religion: 'সনাতন',
    maritalStatus: 'বিবাহিত',
    nationality: 'বাংলাদেশী',
    mobile: '০১৭১২-৩৪৫৬৭৮',
    altMobile: '০১৭১১-২২৩৩৪৪',
    email: 'suvel@gmail.com',
    permanentAddress: 'মন্দির গলি, সিলেট',
    presentAddress: 'মন্দির গলি, সিলেট',
    qualification: 'স্নাতক',
    occupation: 'ব্যবসায়ী',
    workplace: 'সিলেট মেইন মার্কেট',
    emergencyName: 'প্রশান্ত দাশ',
    emergencyRelation: 'সহকর্মী',
    emergencyMobile: '০১৭১২-৮৭৬৫৪৩',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'm2',
    username: 'pranta',
    membershipNumber: 'GES-2026-0002',
    role: MemberRole.ADMIN,
    status: ApplicationStatus.APPROVED,
    joinedDate: '২০২৬-০১-০৫',
    banglaName: 'প্রান্ত দে',
    englishName: 'Pranta Dey',
    fatherName: 'প্রদীপ দে',
    motherName: 'মায়া রানী দে',
    dob: '১৯৯০-০৫-২৪',
    gender: 'পুরুষ',
    bloodGroup: 'O+',
    religion: 'সনাতন',
    maritalStatus: 'অবিবাহিত',
    nationality: 'বাংলাদেশী',
    mobile: '০১৭১২-৭৭৮৮৯৯',
    altMobile: '০১৭১২-১১২২৩৩',
    email: 'pranta@gmail.com',
    permanentAddress: 'শিবগঞ্জ, সিলেট',
    presentAddress: 'শিবগঞ্জ, সিলেট',
    qualification: 'স্নাতকোত্তর',
    occupation: 'বেসরকারি চাকুরিজীবী',
    workplace: 'সিলেট প্রাইভেট লিমিটেড',
    emergencyName: 'সুভেল দেব',
    emergencyRelation: 'সভাপতি',
    emergencyMobile: '০১৭১২-৩৪৫৬৭৮',
    photoUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'm3',
    username: 'sajon',
    membershipNumber: 'GES-2026-0003',
    role: MemberRole.SUPER_ADMIN,
    status: ApplicationStatus.APPROVED,
    joinedDate: '২০২৬-০২-১০',
    banglaName: 'স্বজন দে',
    englishName: 'Sajon Dey',
    fatherName: 'সুরেশ দে',
    motherName: 'লতা রানী দে',
    dob: '১৯৯৭-০৪-১৮',
    gender: 'পুরুষ',
    bloodGroup: 'AB+',
    religion: 'সনাতন',
    maritalStatus: 'অবিবাহিত',
    nationality: 'বাংলাদেশী',
    mobile: '০১৭১১-১১২২৩৩',
    altMobile: '০১৭২২-৩৩৪৪৫৫',
    email: 'sajondey123@gmail.com', // Setting user email from metadata to let them log in as Sajon immediately!
    permanentAddress: 'ধোপাদিঘীর পাড়, সিলেট',
    presentAddress: 'ধোপাদিঘীর পাড়, সিলেট',
    qualification: 'স্নাতক (ইঞ্জিনিয়ারিং)',
    occupation: 'সফটওয়্যার ডেভেলপার',
    workplace: 'টেক সলিউশন্স সিলেট',
    emergencyName: 'সুরেশ দে',
    emergencyRelation: 'পিতা',
    emergencyMobile: '০১৭১১-১১২২৩৩',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
  }
];

export const INITIAL_MEDIA: MediaFile[] = [
  { id: 'm1', name: 'durga-puja-2025.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1561361513-2d000a45f0d2?auto=format&fit=crop&q=80&w=600', size: '১.২ মেগাবাইট', uploadedAt: '২০২৫-১০-২৫' },
  { id: 'm2', name: 'janmashtami-rally.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1608958416715-db870c5383be?auto=format&fit=crop&q=80&w=600', size: '৭৫০ কিলোবাইট', uploadedAt: '২০২৫-০৮-১৮' },
  { id: 'm3', name: 'annual-report-2025.pdf', type: 'pdf', url: '#', size: '২.৪ মেগাবাইট', uploadedAt: '২০২৬-০১-০৫' }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', userEmail: 'suvel@gmail.com', userRole: 'SUPER_ADMIN', action: 'সংঘের ব্যানার পরিবর্তন করেছেন', timestamp: '২০২৬-০৭-০৯ সকাল ১০:১৫', ipAddress: '১০৩.২৩০.১০৪.৪' },
  { id: 'l2', userEmail: 'pranta@gmail.com', userRole: 'ADMIN', action: 'দুর্গাপূজা নোটিশ আপডেট করেছেন', timestamp: '২০২৬-০৭-০৯ সকাল ১০:৪৫', ipAddress: '১০৩.২৩০.১০৪.১০' }
];

export const INITIAL_HTML_UPLOADS: UploadedHTML[] = [
  {
    id: 'h1',
    slug: 'festival2026',
    title: 'জন্মাষ্টমী ২০২৬ উৎসব উৎসবমুখর পেজ',
    htmlContent: `<div class="p-8 text-center bg-orange-600 text-white rounded-xl shadow-xl">
  <h1 class="text-3xl font-extrabold mb-4">উৎসবের আলোয় রাঙানো জন্মাষ্টমী!</h1>
  <p class="mb-6 text-lg">গণরাজ একতা সংঘের বিশেষ আয়োজনে সবাইকে আমন্ত্রণ।</p>
  <div class="inline-block p-4 bg-white text-orange-600 rounded-lg font-bold text-xl animate-pulse">
    ৩রা সেপ্টেম্বর, ২০২৬
  </div>
</div>`,
    cssContent: `body { font-family: 'Hind Siliguri', sans-serif; background: #fffbeb; }`,
    jsContent: `console.log("Festival 2026 Sandbox script loaded!");`,
    createdAt: '২০২৬-০৭-০৯'
  }
];
