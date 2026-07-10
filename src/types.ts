export enum MemberRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  COMMITTEE_MEMBER = 'COMMITTEE_MEMBER',
  VOLUNTEER = 'VOLUNTEER',
  MEMBER = 'MEMBER',
  APPLICANT = 'APPLICANT'
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export interface Member {
  id: string; // generated automatically
  username: string;
  membershipNumber: string;
  role: MemberRole;
  status: ApplicationStatus;
  joinedDate: string;
  qrCodeUrl?: string;
  
  // Personal Info
  banglaName: string;
  englishName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  religion: string;
  maritalStatus: string;
  nationality: string;
  
  // Contact
  mobile: string;
  altMobile: string;
  email: string;
  permanentAddress: string;
  presentAddress: string;
  
  // Education & Work
  qualification: string;
  occupation: string;
  workplace: string;
  
  // Emergency Contact
  emergencyName: string;
  emergencyRelation: string;
  emergencyMobile: string;
  
  // Uploads
  photoUrl: string;

  // Security & Role-Based Credentials
  passwordHash?: string;
  salt?: string;
  is2faEnabled?: boolean;
  twoFactorSecret?: string;
  failedLoginAttempts?: number;
  lockoutUntil?: string; // ISO string
  loginHistory?: { timestamp: string; ipAddress: string; device: string; status: 'SUCCESS' | 'FAILED' }[];

  // Document Approval System
  idCardApprovedState?: 'PENDING_SUPER_ADMIN_REVIEW' | 'APPROVED' | 'REJECTED' | 'DRAFT' | 'NONE';
  certificateApprovedState?: 'PENDING_SUPER_ADMIN_REVIEW' | 'APPROVED' | 'REJECTED' | 'DRAFT' | 'NONE';
  idCardApprovedBy?: string;
  certificateApprovedBy?: string;
  idCardNotes?: string;
  certificateNotes?: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  photoUrl: string;
  bio: string;
  contact: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface CommitteeTerm {
  id: string;
  termName: string; // e.g. "২০২৬-২০২৭ কার্যকরী কমিটি"
  isActive: boolean;
  members: CommitteeMember[];
}

export interface OrgSettings {
  orgNameBangla: string;
  orgNameEnglish: string;
  shortName: string;
  slogan: string;
  logoUrl: string;
  faviconUrl: string;
  bannerUrl: string;
  themeColorPrimary: string; // hex
  themeColorSecondary: string; // hex
  themeColorAccent: string; // hex
  themeMode: 'light' | 'dark';
  fontFamily: string;
  footerText: string;
  address: string;
  contactNumber: string;
  email: string;
  googleMapEmbedUrl: string;
  websiteUrl: string;
  socialMediaLinks: {
    facebook: string;
    youtube: string;
    twitter: string;
    instagram: string;
  };
  mission: string;
  vision: string;
  history: string;
  presidentName: string;
  presidentPhoto: string;
  presidentMessage: string;
  secretaryName: string;
  secretaryPhoto: string;
  secretaryMessage: string;
  customCss: string;
  customJs: string;
  seoTitle: string;
  seoDescription: string;
  analyticsCode: string;
}

export interface HomepageSection {
  id: string;
  title: string;
  enabled: boolean;
  order: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string; // rich text/markdown
  category: string;
  attachmentUrl?: string;
  publishDate: string;
  isPinned: boolean;
  isPopup: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  bannerUrl: string;
  volunteersNeeded: boolean;
  registeredVolunteers: string[]; // member IDs
  rsvps: { memberId: string; status: 'yes' | 'maybe' | 'no' }[];
}

export interface DonationRecord {
  id: string;
  donorName: string;
  donorEmail: string;
  donorMobile: string;
  amount: number;
  category: string;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  date: string;
  remarks?: string;
  receiptNumber: string;
}

export interface DonationCategory {
  id: string;
  name: string;
  targetAmount: number;
  raisedAmount: number;
}

export interface CustomPage {
  id: string;
  slug: string; // e.g. "about-us"
  title: string;
  content: string; // rich text/markdown
  published: boolean;
  createdAt: string;
}

export interface UploadedHTML {
  id: string;
  slug: string; // e.g. "festival2026"
  title: string;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  createdAt: string;
}

export interface IdCardTemplate {
  cardBgColor: string;
  cardTextColor: string;
  headerBgColor: string;
  headerTextColor: string;
  signatureUrl: string;
  sealUrl: string;
  fontFamily: string;
  showBarcode: boolean;
  showQrCode: boolean;
  customTerms: string;
}

export interface CertificateTemplate {
  title: string;
  subTitle: string;
  bodyTemplate: string; // placeholder text like "This is to certify that [NAME] with Member ID [MEMBER_ID] has successfully participated in [EVENT]."
  signatory1Name: string;
  signatory1Role: string;
  signatory2Name: string;
  signatory2Role: string;
  borderStyle: 'classic' | 'modern' | 'royal';
  primaryColor: string;
}

export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf' | 'doc';
  url: string;
  size: string;
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  userRole: string;
  action: string;
  timestamp: string;
  ipAddress: string;
}
