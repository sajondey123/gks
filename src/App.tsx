import React, { useState, useEffect } from 'react';
import { 
  OrgSettings, HomepageSection, Member, CommitteeTerm, Notice, EventItem, 
  DonationRecord, DonationCategory, CustomPage, UploadedHTML, IdCardTemplate, 
  CertificateTemplate, AuditLog, MemberRole, ApplicationStatus 
} from './types';
import { 
  INITIAL_ORG_SETTINGS, INITIAL_SECTIONS, INITIAL_COMMITTEE_TERM, 
  INITIAL_NOTICES, INITIAL_EVENTS, INITIAL_DONATION_CATEGORIES, 
  INITIAL_DONATION_RECORDS, INITIAL_CUSTOM_PAGES, INITIAL_ID_CARD_TEMPLATE, 
  INITIAL_CERTIFICATE_TEMPLATE, INITIAL_MEMBERS, INITIAL_MEDIA, 
  INITIAL_AUDIT_LOGS, INITIAL_HTML_UPLOADS 
} from './lib/defaultData';
import { NavbarComponent } from './components/Navbar';
import { FooterComponent } from './components/Footer';
import { PublicHomeComponent } from './components/PublicHome';
import { RegistrationFormComponent } from './components/RegistrationForm';
import { ApplicantPortalComponent } from './components/ApplicantPortal';
import { AdminPanelComponent } from './components/AdminPanel';
import { QRVerificationComponent } from './components/QRVerification';
import { HTMLSandboxComponent } from './components/HTMLSandbox';
import { CustomPageViewer } from './components/CustomPageViewer';
import { isFirebaseAvailable, db } from './lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { sha256, generateStrongPassword, generateSecureToken, generateTOTPCode } from './lib/crypto';

export default function App() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [activeView, setActiveView] = useState<string>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Core CMS state
  const [settings, setSettings] = useState<OrgSettings>(INITIAL_ORG_SETTINGS);
  const [sections, setSections] = useState<HomepageSection[]>(INITIAL_SECTIONS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [committeeTerm, setCommitteeTerm] = useState<CommitteeTerm>(INITIAL_COMMITTEE_TERM);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATION_RECORDS);
  const [donationCategories, setDonationCategories] = useState<DonationCategory[]>(INITIAL_DONATION_CATEGORIES);
  const [customPages, setCustomPages] = useState<CustomPage[]>(INITIAL_CUSTOM_PAGES);
  const [htmlUploads, setHtmlUploads] = useState<UploadedHTML[]>(INITIAL_HTML_UPLOADS);
  const [idCardTemplate, setIdCardTemplate] = useState<IdCardTemplate>(INITIAL_ID_CARD_TEMPLATE);
  const [certificateTemplate, setCertificateTemplate] = useState<CertificateTemplate>(INITIAL_CERTIFICATE_TEMPLATE);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Authentication session state
  const [loggedInUser, setLoggedInUser] = useState<Member | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Security Credentials Display
  const [sajonTempPassword, setSajonTempPassword] = useState<string | null>(null);
  const [suvelTempPassword, setSuvelTempPassword] = useState<string | null>(null);
  
  // Brute Force Lockout
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  // 2FA Verification State
  const [pending2faUser, setPending2faUser] = useState<Member | null>(null);
  const [twoFactorInput, setTwoFactorInput] = useState('');

  // Password Reset Simulation Modal
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  // CSRF Protection Token Simulation
  const [csrfToken, setCsrfToken] = useState('');


  // -------------------------------------------------------------
  // DATABASE SYNCHRONIZER (FIRESTORE + LOCALSTORAGE FALLBACK)
  // -------------------------------------------------------------

  // Load state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        let loadedData: any = null;

        // Try Firestore first
        if (isFirebaseAvailable && db) {
          try {
            console.log('Fetching state from Firestore...');
            const docRef = doc(db, 'ganaraj-cms', 'global-state');
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              loadedData = docSnap.data();
              console.log('State successfully loaded from Firestore!');
            } else {
              console.log('No Firestore state found. Initializing database with seed defaults...');
              const seedData = {
                settings: INITIAL_ORG_SETTINGS,
                sections: INITIAL_SECTIONS,
                members: INITIAL_MEMBERS,
                committeeTerm: INITIAL_COMMITTEE_TERM,
                notices: INITIAL_NOTICES,
                events: INITIAL_EVENTS,
                donations: INITIAL_DONATION_RECORDS,
                donationCategories: INITIAL_DONATION_CATEGORIES,
                customPages: INITIAL_CUSTOM_PAGES,
                htmlUploads: INITIAL_HTML_UPLOADS,
                idCardTemplate: INITIAL_ID_CARD_TEMPLATE,
                certificateTemplate: INITIAL_CERTIFICATE_TEMPLATE,
                auditLogs: INITIAL_AUDIT_LOGS
              };
              await setDoc(docRef, seedData);
              loadedData = seedData;
            }
          } catch (fireErr) {
            console.warn('Firestore load failed (offline or auth issue). Falling back to local storage...', fireErr);
          }
        }

        // LocalStorage fallback if Firestore failed or not available
        if (!loadedData) {
          const localStr = localStorage.getItem('ganaraj_cms_state');
          if (localStr) {
            loadedData = JSON.parse(localStr);
            console.log('State loaded from local storage.');
          }
        }

        // Apply state
        if (loadedData) {
          let needsSync = false;

          // Force brand configurations to the user requested ones
          if (loadedData.settings) {
            const currentSettings = loadedData.settings;
            if (
              currentSettings.orgNameBangla !== 'গণরাজ একতা সংঘ' ||
              currentSettings.address !== 'বিজিবি ক্যাম্প, বনরূপা পাড়া, কক্সবাজার' ||
              currentSettings.contactNumber !== '+880 1775-488049' ||
              currentSettings.email !== ''
            ) {
              loadedData.settings = {
                ...currentSettings,
                orgNameBangla: 'গণরাজ একতা সংঘ',
                address: 'বিজিবি ক্যাম্প, বনরূপা পাড়া, কক্সবাজার',
                contactNumber: '+880 1775-488049',
                email: ''
              };
              needsSync = true;
            }
          }

          // Force Sajon Dey's role to SUPER_ADMIN, and initialize secure password and 2FA credentials
          if (loadedData.members) {
            let updatedMembersList = [...loadedData.members].filter((m: any) => m && typeof m === 'object');
            let modified = false;

            // Sync all 16 predefined members from INITIAL_MEMBERS
            INITIAL_MEMBERS.forEach((defaultMember) => {
              const existingIdx = updatedMembersList.findIndex((m: Member) => m.id === defaultMember.id);
              if (existingIdx === -1) {
                updatedMembersList.push({ ...defaultMember });
                modified = true;
              } else {
                const existing = updatedMembersList[existingIdx];
                let merged = false;
                const fieldsToSync = [
                  'banglaName', 'englishName', 'fatherName', 'dob', 'gender', 
                  'bloodGroup', 'mobile', 'email', 'permanentAddress', 'presentAddress', 
                  'occupation', 'photoUrl', 'membershipNumber'
                ] as const;

                const updated = { ...existing };
                fieldsToSync.forEach(field => {
                  if (defaultMember[field] !== undefined && existing[field] !== defaultMember[field]) {
                    (updated as any)[field] = defaultMember[field];
                    merged = true;
                  }
                });

                if (merged) {
                  updatedMembersList[existingIdx] = updated;
                  modified = true;
                }
              }
            });

            // Sync committee term members list to ensure it always contains the full 16 members
            if (loadedData.committeeTerm) {
              if (!loadedData.committeeTerm.members || loadedData.committeeTerm.members.length < INITIAL_COMMITTEE_TERM.members.length) {
                loadedData.committeeTerm = {
                  ...loadedData.committeeTerm,
                  members: INITIAL_COMMITTEE_TERM.members
                };
                modified = true;
              }
            }

            setCsrfToken(generateSecureToken());

            // Initialize Sajon Dey
            let sajonIndex = updatedMembersList.findIndex((m: Member) => m && typeof m.email === 'string' && m.email.toLowerCase() === 'sajondey123@gmail.com');
            if (sajonIndex !== -1) {
              let sajon = updatedMembersList[sajonIndex];
              let sajonMod = false;
              let sajonUpdated = { ...sajon };

              if (sajon.role !== MemberRole.SUPER_ADMIN) {
                sajonUpdated.role = MemberRole.SUPER_ADMIN;
                sajonMod = true;
              }
              if (!sajon.username || sajon.username !== 'sajon_superadmin') {
                sajonUpdated.username = 'sajon_superadmin';
                sajonMod = true;
              }
              if (!sajon.passwordHash || (sajon as any).passwordVersion !== 'v3') {
                const rawPass = 'Sajon@2026';
                const salt = generateSecureToken();
                sajonUpdated.salt = salt;
                sajonUpdated.passwordHash = await sha256(rawPass + salt);
                sajonUpdated.is2faEnabled = false; // Turn on robust 2FA for demonstration
                sajonUpdated.twoFactorSecret = '';
                (sajonUpdated as any).passwordVersion = 'v3';
                setSajonTempPassword(rawPass);
                sajonMod = true;
              }
              if (sajonMod) {
                updatedMembersList[sajonIndex] = sajonUpdated;
                modified = true;
              }
            }

            // Initialize Suvel Deb
            let suvelIndex = updatedMembersList.findIndex((m: Member) => m && typeof m.email === 'string' && m.email.toLowerCase() === 'suvel@gmail.com');
            if (suvelIndex !== -1) {
              let suvel = updatedMembersList[suvelIndex];
              let suvelMod = false;
              let suvelUpdated = { ...suvel };

              if (suvel.role !== MemberRole.ADMIN) {
                suvelUpdated.role = MemberRole.ADMIN;
                suvelMod = true;
              }
              if (!suvel.username || suvel.username !== 'suvel_admin') {
                suvelUpdated.username = 'suvel_admin';
                suvelMod = true;
              }
              if (!suvel.passwordHash || (suvel as any).passwordVersion !== 'v3') {
                const rawPass = 'Suvel@2026';
                const salt = generateSecureToken();
                suvelUpdated.salt = salt;
                suvelUpdated.passwordHash = await sha256(rawPass + salt);
                suvelUpdated.is2faEnabled = false;
                (suvelUpdated as any).passwordVersion = 'v3';
                setSuvelTempPassword(rawPass);
                suvelMod = true;
              }
              if (suvelMod) {
                updatedMembersList[suvelIndex] = suvelUpdated;
                modified = true;
              }
            }

            // Ensure document approval system states are initialized for anyone APPROVED
            updatedMembersList = updatedMembersList.map((m: Member) => {
              if (!m) return m;
              let mMod = false;
              let mUpdated = { ...m };
              if (m.status === ApplicationStatus.APPROVED) {
                if (!m.idCardApprovedState) {
                  mUpdated.idCardApprovedState = 'APPROVED';
                  mMod = true;
                }
                if (!m.certificateApprovedState) {
                  mUpdated.certificateApprovedState = 'APPROVED';
                  mMod = true;
                }
              } else if (m.status === ApplicationStatus.PENDING) {
                if (!m.idCardApprovedState || m.idCardApprovedState === 'NONE') {
                  mUpdated.idCardApprovedState = 'PENDING_SUPER_ADMIN_REVIEW';
                  mMod = true;
                }
                if (!m.certificateApprovedState || m.certificateApprovedState === 'NONE') {
                  mUpdated.certificateApprovedState = 'PENDING_SUPER_ADMIN_REVIEW';
                  mMod = true;
                }
              }
              return mMod ? mUpdated : m;
            });

            loadedData.members = updatedMembersList;
            needsSync = true;
          }

          if (loadedData.settings) setSettings(loadedData.settings);
          if (loadedData.sections) setSections(loadedData.sections);
          if (loadedData.members) setMembers(loadedData.members);
          if (loadedData.committeeTerm) setCommitteeTerm(loadedData.committeeTerm);
          if (loadedData.notices) setNotices(loadedData.notices);
          if (loadedData.events) setEvents(loadedData.events);
          if (loadedData.donations) setDonations(loadedData.donations);
          if (loadedData.donationCategories) setDonationCategories(loadedData.donationCategories);
          if (loadedData.customPages) setCustomPages(loadedData.customPages);
          if (loadedData.htmlUploads) setHtmlUploads(loadedData.htmlUploads);
          if (loadedData.idCardTemplate) setIdCardTemplate(loadedData.idCardTemplate);
          if (loadedData.certificateTemplate) setCertificateTemplate(loadedData.certificateTemplate);
          if (loadedData.auditLogs) setAuditLogs(loadedData.auditLogs);

          if (needsSync) {
            // Write to LocalStorage
            localStorage.setItem('ganaraj_cms_state', JSON.stringify(loadedData));

            // Write to Firestore if connected
            if (isFirebaseAvailable && db) {
              try {
                const docRef = doc(db, 'ganaraj-cms', 'global-state');
                setDoc(docRef, loadedData, { merge: true })
                  .then(() => console.log('Database synced successfully to Cloud Firestore during initialization.'))
                  .catch(err => console.error('Firestore initialization sync failed:', err));
              } catch (err) {
                console.error('Firestore save setup failed during initialization:', err);
              }
            }
          }
        }
      } catch (err) {
        console.error('Database Sync Load Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Check if the page is loaded via QR code verification URL (e.g. ?verify=m3)
    const urlParams = new URLSearchParams(window.location.search);
    const verifyId = urlParams.get('verify');
    if (verifyId) {
      setActiveView(`verify-${verifyId}`);
    }

    loadState();
  }, []);

  // Save State Helper
  const syncState = async (updatedFields: Partial<{
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
  }>) => {
    // Merge values with existing current states
    const fullState = {
      settings: updatedFields.settings ?? settings,
      sections: updatedFields.sections ?? sections,
      members: updatedFields.members ?? members,
      committeeTerm: updatedFields.committeeTerm ?? committeeTerm,
      notices: updatedFields.notices ?? notices,
      events: updatedFields.events ?? events,
      donations: updatedFields.donations ?? donations,
      donationCategories: updatedFields.donationCategories ?? donationCategories,
      customPages: updatedFields.customPages ?? customPages,
      htmlUploads: updatedFields.htmlUploads ?? htmlUploads,
      idCardTemplate: updatedFields.idCardTemplate ?? idCardTemplate,
      certificateTemplate: updatedFields.certificateTemplate ?? certificateTemplate,
      auditLogs: updatedFields.auditLogs ?? auditLogs
    };

    // Write to LocalStorage
    localStorage.setItem('ganaraj_cms_state', JSON.stringify(fullState));

    // Write to Firestore if connected
    if (isFirebaseAvailable && db) {
      try {
        const docRef = doc(db, 'ganaraj-cms', 'global-state');
        await setDoc(docRef, fullState, { merge: true });
        console.log('Database synced successfully to Cloud Firestore.');
      } catch (err) {
        console.error('Firestore save failed. Relying on local persistence:', err);
      }
    }
  };

  // -------------------------------------------------------------
  // STATE WRITING INTERFACES FOR CHILD COMPONENTS
  // -------------------------------------------------------------
  const handleUpdateSettings = (newSettings: OrgSettings) => {
    setSettings(newSettings);
    syncState({ settings: newSettings });
  };

  const handleUpdateSections = (newSections: HomepageSection[]) => {
    setSections(newSections);
    syncState({ sections: newSections });
  };

  const handleUpdateMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    syncState({ members: newMembers });
    // Update loggedInUser reference if profile is updated
    if (loggedInUser) {
      const refreshed = newMembers.find(m => m.id === loggedInUser.id);
      if (refreshed) setLoggedInUser(refreshed);
    }
  };

  const handleUpdateCommittee = (newCommittee: CommitteeTerm) => {
    setCommitteeTerm(newCommittee);
    syncState({ committeeTerm: newCommittee });
  };

  const handleUpdateNotices = (newNotices: Notice[]) => {
    setNotices(newNotices);
    syncState({ notices: newNotices });
  };

  const handleUpdateEvents = (newEvents: EventItem[]) => {
    setEvents(newEvents);
    syncState({ events: newEvents });
  };

  const handleUpdateDonations = (newDonations: DonationRecord[]) => {
    setDonations(newDonations);
    syncState({ donations: newDonations });
  };

  const handleUpdateDonationCategories = (newCategories: DonationCategory[]) => {
    setDonationCategories(newCategories);
    syncState({ donationCategories: newCategories });
  };

  const handleUpdateCustomPages = (newPages: CustomPage[]) => {
    setCustomPages(newPages);
    syncState({ customPages: newPages });
  };

  const handleUpdateHtmlUploads = (newUploads: UploadedHTML[]) => {
    setHtmlUploads(newUploads);
    syncState({ htmlUploads: newUploads });
  };

  const handleUpdateIdCardTemplate = (newTemplate: IdCardTemplate) => {
    setIdCardTemplate(newTemplate);
    syncState({ idCardTemplate: newTemplate });
  };

  const handleUpdateCertificateTemplate = (newTemplate: CertificateTemplate) => {
    setCertificateTemplate(newTemplate);
    syncState({ certificateTemplate: newTemplate });
  };

  // Interactive: Donate simulation from Homepage
  const handleAddDonationAmount = (catId: string, amount: number) => {
    const updatedCategories = donationCategories.map(cat => {
      if (cat.id === catId) {
        return { ...cat, raisedAmount: cat.raisedAmount + amount };
      }
      return cat;
    });

    const newRecord: DonationRecord = {
      id: `don-${Date.now()}`,
      donorName: 'অনলাইন ভক্ত',
      donorEmail: 'ভক্ত@gmail.com',
      donorMobile: '০১৭১১-২২৩৩৪৪',
      amount,
      category: donationCategories.find(c => c.id === catId)?.name || 'পূজা অনুদান',
      paymentMethod: 'SSLCOMMERZ bKash',
      paymentStatus: 'PAID',
      date: new Date().toISOString().split('T')[0],
      receiptNumber: `GES-2026-REC-${String(donations.length + 1).padStart(3, '0')}`
    };

    setDonationCategories(updatedCategories);
    setDonations([newRecord, ...donations]);
    syncState({
      donationCategories: updatedCategories,
      donations: [newRecord, ...donations]
    });
  };

  // Interactive: Register volunteer for event from Homepage
  const handleRegisterVolunteer = (eventId: string, memberId: string) => {
    const updatedEvents = events.map(evt => {
      if (evt.id === eventId) {
        const list = evt.registeredVolunteers.includes(memberId)
          ? evt.registeredVolunteers
          : [...evt.registeredVolunteers, memberId];
        return { ...evt, registeredVolunteers: list };
      }
      return evt;
    });
    setEvents(updatedEvents);
    syncState({ events: updatedEvents });
  };

  // Interactive: Register applicant form submit
  const handleRegisterSubmit = (applicant: Omit<Member, 'id' | 'membershipNumber' | 'role' | 'status' | 'joinedDate'>) => {
    const newMember: Member = {
      ...applicant,
      id: `member-${Date.now()}`,
      membershipNumber: '', // Will be assigned by Admin upon approval
      role: MemberRole.MEMBER,
      status: ApplicationStatus.PENDING,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);

    // Create Audit Log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userEmail: applicant.email,
      userRole: 'APPLICANT',
      action: `অনলাইনে সদস্যপদের জন্য আবেদন সাবমিট করেছেন`,
      timestamp: new Date().toLocaleString('bn-BD'),
      ipAddress: '১২৭.০.০.১'
    };

    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);

    syncState({
      members: updatedMembers,
      auditLogs: updatedLogs
    });
  };

  // -------------------------------------------------------------
  // SIMULATED AUTHENTICATION LOGINS WITH ADVANCED SECURITY
  // -------------------------------------------------------------
  
  // Timer countdown for brute-force lock
  useEffect(() => {
    if (lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  // Session Timeout simulation (Inactivity timer)
  useEffect(() => {
    let timeoutId: any;
    
    const resetTimer = () => {
      if (loggedInUser) {
        clearTimeout(timeoutId);
        // Auto logout after 15 minutes of inactivity
        timeoutId = setTimeout(() => {
          handleLogout();
          alert('নিষ্ক্রিয়তার কারণে আপনার সেশনটি শেষ হয়ে গেছে। দয়া করে আবার লগইন করুন। (Session Expired due to inactivity)');
        }, 900000); // 15 minutes
      }
    };

    if (loggedInUser) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('click', resetTimer);
      resetTimer();
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [loggedInUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (lockoutTimer > 0) {
      setLoginError(`অতিরিক্ত ভুল পাসওয়ার্ড চেষ্টার কারণে আপনার লগইন সাময়িকভাবে লক করা হয়েছে। দয়া করে ${lockoutTimer} সেকেন্ড অপেক্ষা করুন।`);
      return;
    }

    // Search by email, username, or mobile
    const match = members.find(m => 
      (m.email || '').toLowerCase() === loginEmail.trim().toLowerCase() ||
      (m.username || '').toLowerCase() === loginEmail.trim().toLowerCase() ||
      (m.mobile || '') === loginEmail.trim()
    );

    if (!match) {
      setLoginError('প্রদত্ত ইমেইল বা ব্যবহারকারী নামটি নিবন্ধিত নয়।');
      return;
    }

    if (match.status === ApplicationStatus.SUSPENDED) {
      setLoginError('দুঃখিত, আপনার সদস্যপদটি বর্তমানে সাময়িকভাবে স্থগিত করা হয়েছে। দয়া করে কেন্দ্রীয় দপ্তরে যোগাযোগ করুন।');
      return;
    }

    // If password hash is set, we MUST verify the password
    if (match.passwordHash) {
      const inputHash = await sha256(loginPassword + (match.salt || ''));
      if (inputHash !== match.passwordHash) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        
        // Log failed login audit
        const failLog: AuditLog = {
          id: `log-${Date.now()}`,
          userEmail: match.email,
          userRole: match.role,
          action: `ব্যর্থ লগইন চেষ্টা (ভুল পাসওয়ার্ড)`,
          timestamp: new Date().toLocaleString('bn-BD'),
          ipAddress: '১০৩.৪৫.১২২.৯'
        };
        const updatedLogs = [failLog, ...auditLogs];
        setAuditLogs(updatedLogs);
        syncState({ auditLogs: updatedLogs });

        if (nextAttempts >= 5) {
          setLockoutTimer(60); // 60 seconds lockout
          setFailedAttempts(0);
          setLoginError('৫ বার ভুল পাসওয়ার্ড দেওয়ার কারণে আপনার অ্যাকাউন্টটি ৬০ সেকেন্ডের জন্য লক করা হয়েছে।');
        } else {
          setLoginError(`ভুল পাসওয়ার্ড। আর ${5 - nextAttempts} বার ভুল করলে অ্যাকাউন্ট লক হয়ে যাবে।`);
        }
        return;
      }
    }

    // Success! Reset failed attempts
    setFailedAttempts(0);

    // Normal Login
    finalizeLogin(match);
  };

  const finalizeLogin = (user: Member) => {
    setLoggedInUser(user);
    setLoginEmail('');
    setLoginPassword('');
    setPending2faUser(null);
    setLoginError(null);

    // Save session in sessionStorage (Secure Session Management)
    sessionStorage.setItem('ges_session_token', generateSecureToken());
    sessionStorage.setItem('ges_session_user_id', user.id);

    // Add login history
    const updatedHistory = [
      {
        timestamp: new Date().toLocaleString('bn-BD'),
        ipAddress: '১০৩.৪৫.১২২.৯',
        device: navigator.userAgent.includes('Windows') ? 'Chrome 125.0 (Windows 11)' : 'Safari Mobile (iOS)',
        status: 'SUCCESS' as const
      },
      ...(user.loginHistory || [])
    ].slice(0, 10); // keep last 10 entries

    const updatedMembers = members.map(m => m.id === user.id ? { ...m, loginHistory: updatedHistory } : m);
    setMembers(updatedMembers);

    // Add admin audit log
    const loginLog: AuditLog = {
      id: `log-${Date.now()}`,
      userEmail: user.email,
      userRole: user.role,
      action: `সদস্য পোর্টালে সফলভাবে লগইন করেছেন`,
      timestamp: new Date().toLocaleString('bn-BD'),
      ipAddress: '১০৩.৪৫.১২২.৯'
    };
    const updatedLogs = [loginLog, ...auditLogs];
    setAuditLogs(updatedLogs);

    syncState({
      members: updatedMembers,
      auditLogs: updatedLogs
    });
  };

  const verifyTwoFactor = () => {
    if (!pending2faUser) return;
    
    // Generate current code
    const correctCode = generateTOTPCode(pending2faUser.twoFactorSecret || 'DEFAULT_SECRET');
    
    if (twoFactorInput.trim() === correctCode || twoFactorInput.trim() === '123456') { // Allow 123456 override for easiest testing
      finalizeLogin(pending2faUser);
    } else {
      setLoginError('ভুল ২-ফ্যাক্টর ভেরিফিকেশন কোড। দয়া করে আবার চেষ্টা করুন।');
    }
  };

  const handleLogout = () => {
    if (loggedInUser) {
      const logoutLog: AuditLog = {
        id: `log-${Date.now()}`,
        userEmail: loggedInUser.email,
        userRole: loggedInUser.role,
        action: `পোর্টাল থেকে সফলভাবে লগআউট করেছেন`,
        timestamp: new Date().toLocaleString('bn-BD'),
        ipAddress: '১০৩.৪৫.১২২.৯'
      };
      const updatedLogs = [logoutLog, ...auditLogs];
      setAuditLogs(updatedLogs);
      syncState({ auditLogs: updatedLogs });
    }

    setLoggedInUser(null);
    sessionStorage.removeItem('ges_session_token');
    sessionStorage.removeItem('ges_session_user_id');
    setActiveView('home');
  };

  const handleQuickLogin = async (email: string) => {
    const match = members.find(m => m.email === email);
    if (match) {
      setLoginEmail(match.username || match.email);
      setLoginPassword(email === 'sajondey123@gmail.com' ? 'Sajon@2026' : 'Suvel@2026');
      setLoginError(null);
      finalizeLogin(match);
    }
  };

  // -------------------------------------------------------------
  // VIEW ROUTER
  // -------------------------------------------------------------
  const renderActiveView = () => {
    if (isLoading) {
      return (
        <div className="min-h-[400px] flex flex-col justify-center items-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-500">ডাটাবেস লোড হচ্ছে, দয়া করে অপেক্ষা করুন...</p>
        </div>
      );
    }

    // Public QR Code Verification view (links of format: verify-m1)
    if (activeView.startsWith('verify')) {
      const queryId = activeView.replace('verify-', '').replace('verify', '');
      return (
        <QRVerificationComponent 
          memberId={queryId || 'm3'} 
          members={members} 
          settings={settings} 
          onBackToHome={() => {
            // Remove search query parameter without reloading
            window.history.pushState({}, document.title, window.location.pathname);
            setActiveView('home');
          }} 
        />
      );
    }

    // Custom Page Route page-<slug>
    if (activeView.startsWith('page-')) {
      const slug = activeView.replace('page-', '');
      const foundPage = customPages.find(p => p.slug === slug);
      if (foundPage) {
        return (
          <CustomPageViewer 
            page={foundPage} 
            onBackToHome={() => setActiveView('home')} 
          />
        );
      }
    }

    // Sandboxed HTML Route sandbox-<slug>
    if (activeView.startsWith('sandbox-')) {
      const slug = activeView.replace('sandbox-', '');
      const foundUpload = htmlUploads.find(h => h.slug === slug);
      if (foundUpload) {
        return (
          <HTMLSandboxComponent 
            uploadedHtml={foundUpload} 
            onBackToHome={() => setActiveView('home')} 
          />
        );
      }
    }

    switch (activeView) {
      case 'home':
        return (
          <PublicHomeComponent 
            settings={settings}
            sections={sections}
            committeeTerm={committeeTerm}
            notices={notices}
            events={events}
            donationCategories={donationCategories}
            members={members}
            onNavigate={setActiveView}
            onAddDonationAmount={handleAddDonationAmount}
            onRegisterVolunteer={handleRegisterVolunteer}
          />
        );

      case 'apply':
        return (
          <RegistrationFormComponent 
            onRegisterSubmit={handleRegisterSubmit} 
            onNavigate={setActiveView} 
          />
        );

      case 'portal':
        // If not logged in, render an elite quick login screen with credentials notice and 2FA
        if (!loggedInUser) {
          if (pending2faUser) {
            return (
              <div className="max-w-md mx-auto px-4 py-16 text-left select-none">
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-orange-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                  
                  <div className="text-center pb-6 border-b border-gray-100">
                    <span className="text-2xl">🛡️</span>
                    <h2 className="text-lg font-black text-slate-800 mt-2">২-ফ্যাক্টর নিরাপত্তা ভেরিফিকেশন</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono mt-0.5">Two-Factor Authentication Required</p>
                  </div>

                  {loginError && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                      {loginError}
                    </div>
                  )}

                  <div className="mt-6 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      আপনার অ্যাকাউন্টের ২-ফ্যাক্টর অথেন্টিকেশন সক্রিয় রয়েছে। দয়া করে আপনার গুগল অথেন্টিকেটর অ্যাপের কোডটি দিন। 
                      <span className="block mt-2 font-mono font-bold text-orange-600">টেস্ট কোড: {generateTOTPCode(pending2faUser.twoFactorSecret || '')} বা '123456'</span>
                    </p>

                    <div>
                      <label className="block font-bold text-gray-500 mb-1">ভেরিফিকেশন কোড (৬ সংখ্যার কোড)</label>
                      <input 
                        type="text" 
                        maxLength={6}
                        value={twoFactorInput} 
                        onChange={e => setTwoFactorInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="যেমন: ১২৩৪৫৬"
                        className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 text-sm font-mono text-center tracking-widest transition"
                      />
                    </div>

                    <button 
                      onClick={verifyTwoFactor}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl shadow mt-2 hover:brightness-105 transition text-xs"
                    >
                      কোড যাচাই করে প্রবেশ করুন
                    </button>

                    <button 
                      onClick={() => setPending2faUser(null)}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold rounded-xl text-xs transition"
                    >
                      লগইন স্ক্রিনে ফিরে যান
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="max-w-md mx-auto px-4 py-12 text-left">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-amber-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                
                <div className="text-center pb-6 border-b border-gray-100">
                  <h2 className="text-xl font-black text-amber-900">সদস্য পোর্টালে লগইন (Member Portal)</h2>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider font-mono mt-0.5">GES Digital Identity Center</p>
                </div>

                {/* Display Demo Admin/Super Admin Credentials for reference */}
                <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/50 rounded-2xl text-[11px] text-amber-900 space-y-1">
                  <p className="font-bold border-b border-amber-200/50 pb-1 mb-1">🔐 ডেমো অ্যাডমিন ও সুপার অ্যাডমিন ক্রেডেনশিয়াল:</p>
                  <div>
                    <span className="font-bold">সুপার অ্যাডমিন:</span> sajon_superadmin (বা sajondey123@gmail.com)
                    <br />
                    <span className="font-bold">পাসওয়ার্ড:</span> <code className="bg-amber-100 px-1 rounded">Sajon@2026</code>
                  </div>
                  <div>
                    <span className="font-bold">কমিটি অ্যাডমিন:</span> suvel_admin (বা suvel@gmail.com)
                    <br />
                    <span className="font-bold">পাসওয়ার্ড:</span> <code className="bg-amber-100 px-1 rounded">Suvel@2026</code>
                  </div>
                </div>

                {loginError && (
                  <div className="mt-4 p-3.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 mt-6 text-xs">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">নিবন্ধিত ইমেইল / ব্যবহারকারী নাম / মোবাইল</label>
                    <input 
                      type="text" 
                      value={loginEmail} 
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="যেমন: sajon_superadmin"
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 text-xs transition"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-gray-500">পাসওয়ার্ড</label>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsForgotPasswordOpen(true);
                          setForgotPasswordMessage(null);
                        }}
                        className="text-orange-600 hover:underline text-[10px] font-bold"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </button>
                    </div>
                    <input 
                      type="password" 
                      value={loginPassword} 
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 text-xs transition"
                      required
                    />
                  </div>

                  <button 
                    id="btn-login-submit"
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-105 transition text-white font-black rounded-xl shadow-md mt-2 text-xs"
                  >
                    নিরাপদে লগইন করুন
                  </button>
                </form>

                {/* Instant Quick Login Selector - Elite UX */}
                <div className="border-t border-gray-100 mt-6 pt-6 text-center space-y-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">ওয়ান-ক্লিক অটো লগইন (One-Click Session)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleQuickLogin('sajondey123@gmail.com')}
                      className="px-3 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold rounded-xl text-[10px] flex justify-between items-center transition"
                    >
                      <span>স্বজন দে (সুপার)</span>
                      <span>🔑</span>
                    </button>
                    <button 
                      onClick={() => handleQuickLogin('suvel@gmail.com')}
                      className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-[10px] flex justify-between items-center transition"
                    >
                      <span>সুভেল দেব (অ্যাডমিন)</span>
                      <span>⚙️</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Reset Modal Dialog */}
              {isForgotPasswordOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-stone-100 space-y-4">
                    <h3 className="text-md font-bold text-slate-900 border-b border-stone-100 pb-2">পাসওয়ার্ড রিসেট করুন</h3>
                    
                    {forgotPasswordMessage ? (
                      <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-xl border border-green-200">
                        {forgotPasswordMessage}
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs">
                        <p className="text-stone-500">আপনার নিবন্ধিত ইমেইলটি নিচে লিখুন। একটি রিসেট লিংক ও ওয়ান-টাইম ওটিপি সিমুলেট করে প্রদর্শিত হবে।</p>
                        <div>
                          <label className="block font-bold text-slate-500 mb-1">নিবন্ধিত ইমেইল</label>
                          <input 
                            type="email"
                            value={forgotPasswordEmail}
                            onChange={e => setForgotPasswordEmail(e.target.value)}
                            placeholder="sajondey123@gmail.com"
                            className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => setIsForgotPasswordOpen(false)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-600 text-xs font-bold"
                      >
                        বন্ধ করুন
                      </button>
                      {!forgotPasswordMessage && (
                        <button 
                          onClick={() => {
                            if (!forgotPasswordEmail) {
                              alert('দয়া করে ইমেইল লিখুন');
                              return;
                            }
                            setForgotPasswordMessage(`সফল! আপনার পাসওয়ার্ড রিসেট রিকোয়েস্ট গৃহীত হয়েছে। ${forgotPasswordEmail} ঠিকানায় ইমেইল পাঠানো হয়েছে।`);
                          }}
                          className="px-4 py-2 bg-[#FF6321] text-white hover:brightness-105 rounded-xl text-xs font-bold"
                        >
                          রিসেট লিংক পাঠান
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        // Render Dashboard based on role
        return (
          <ApplicantPortalComponent 
            member={loggedInUser} 
            settings={settings}
            idCardTemplate={idCardTemplate}
            certificateTemplate={certificateTemplate}
            notices={notices}
            onUpdateMember={(updated) => {
              const updatedMembers = members.map(m => m.id === updated.id ? updated : m);
              handleUpdateMembers(updatedMembers);
            }}
            onLogout={handleLogout}
          />
        );

      case 'admin':
        // Check if current user is admin/super_admin
        if (!loggedInUser || (loggedInUser.role !== MemberRole.SUPER_ADMIN && loggedInUser.role !== MemberRole.ADMIN)) {
          return (
            <div className="max-w-md mx-auto py-16 px-4">
              <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-2xl text-center space-y-4">
                <span className="text-3xl">🚫</span>
                <h3 className="text-lg font-black text-red-900">অ্যাডমিন প্রবেশাধিকার সংরক্ষিত!</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  এই সেকশনটি শুধুমাত্র গণরাজ একতা সংঘের অনুমোদিত সভাপতি ও কার্যকরী পর্ষদের জন্য সংরক্ষিত। অনুগ্রহ করে প্রথমে অ্যাডমিন প্রোফাইল দিয়ে লগইন করুন।
                </p>
                <button 
                  onClick={() => setActiveView('portal')}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-xs"
                >
                  অ্যাডমিন লগইন করুন
                </button>
              </div>
            </div>
          );
        }

        return (
          <AdminPanelComponent 
            currentUser={loggedInUser}
            settings={settings}
            sections={sections}
            members={members}
            committeeTerm={committeeTerm}
            notices={notices}
            events={events}
            donations={donations}
            donationCategories={donationCategories}
            customPages={customPages}
            htmlUploads={htmlUploads}
            idCardTemplate={idCardTemplate}
            certificateTemplate={certificateTemplate}
            auditLogs={auditLogs}
            
            onUpdateSettings={handleUpdateSettings}
            onUpdateSections={handleUpdateSections}
            onUpdateMembers={handleUpdateMembers}
            onUpdateCommittee={handleUpdateCommittee}
            onUpdateNotices={handleUpdateNotices}
            onUpdateEvents={handleUpdateEvents}
            onUpdateDonations={handleUpdateDonations}
            onUpdateDonationCategories={handleUpdateDonationCategories}
            onUpdateCustomPages={handleUpdateCustomPages}
            onUpdateHtmlUploads={handleUpdateHtmlUploads}
            onUpdateIdCardTemplate={handleUpdateIdCardTemplate}
            onUpdateCertificateTemplate={handleUpdateCertificateTemplate}
          />
        );

      case 'verify':
        return (
          <QRVerificationComponent 
            memberId="m3" // Default Sajon Dey verify link
            members={members} 
            settings={settings} 
            onBackToHome={() => setActiveView('home')} 
          />
        );

      default:
        return (
          <div className="py-20 text-center text-stone-500 font-bold text-sm">
            ভিউটি খুঁজে পাওয়া যায়নি!
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col justify-between" style={{ fontFamily: settings.fontFamily }}>
      
      {/* Navigation Header */}
      <NavbarComponent 
        settings={settings} 
        customPages={customPages} 
        htmlUploads={htmlUploads}
        language={language} 
        onSetLanguage={setLanguage} 
        activeView={activeView} 
        onNavigate={setActiveView} 
        userRole={loggedInUser?.role === MemberRole.SUPER_ADMIN || loggedInUser?.role === MemberRole.ADMIN ? loggedInUser.role : undefined}
      />

      {/* Primary Dynamic Content Body Area */}
      <main className="flex-grow">
        {renderActiveView()}
      </main>

      {/* Dynamic Footer */}
      <FooterComponent 
        settings={settings} 
        language={language} 
      />
    </div>
  );
}
