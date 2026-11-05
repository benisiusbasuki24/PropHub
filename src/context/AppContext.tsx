import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, 
  UserProfile, 
  Transaction, 
  KprApplication, 
  ChatMessage, 
  MarketTrend, 
  AppNotification, 
  UserRole,
  KprStatus,
  PremiumPackageType
} from '../types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_USER, 
  INITIAL_TRANSACTIONS, 
  INITIAL_MARKET_TRENDS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { validateListingDescription, evaluatePropertyAuthenticity } from '../utils/moderation';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  
  // Properties
  properties: Property[];
  addProperty: (propertyData: Partial<Property>) => { success: boolean; error?: string; property?: Property };
  updateProperty: (id: string, updates: Partial<Property>) => { success: boolean; error?: string };
  deleteProperty: (id: string) => boolean;
  
  // Favorites & Comparison
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  comparisonList: Property[];
  addToComparison: (property: Property) => boolean;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  
  // KPR
  kprApplications: KprApplication[];
  submitKprApplication: (data: Omit<KprApplication, 'id' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'>) => void;
  updateKprStatus: (id: string, newStatus: KprStatus, note: string) => void;
  
  // Transactions & 44-day Premium
  transactions: Transaction[];
  submitPaymentReceipt: (data: {
    packageType: PremiumPackageType;
    amount: number;
    senderBank: string;
    senderAccountName: string;
    proofImageUrl: string;
    propertyIdToBoost?: string;
  }) => void;
  verifyTransaction: (id: string, isApproved: boolean, adminNotes?: string) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  sendMessage: (receiverId: string, receiverName: string, text: string, property?: Property) => void;
  activeChatPartner: { id: string; name: string; property?: Property } | null;
  setActiveChatPartner: (partner: { id: string; name: string; property?: Property } | null) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  
  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  triggerNotification: (title: string, message: string, type: AppNotification['type'], linkTab?: string) => void;
  
  // Market Trends
  marketTrends: MarketTrend[];
  
  // Active Modals & Tabs
  activeTab: 'home' | 'search' | 'kpr' | 'compare' | 'market' | 'admin' | 'premium';
  setActiveTab: (tab: 'home' | 'search' | 'kpr' | 'compare' | 'market' | 'admin' | 'premium') => void;
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  isCreateListingOpen: boolean;
  setIsCreateListingOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  paymentPackageSelected: PremiumPackageType;
  setPaymentPackageSelected: (pkg: PremiumPackageType) => void;
  isKprModalOpen: boolean;
  setIsKprModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  
  // Search Filters
  searchFilters: {
    keyword: string;
    city: string;
    propertyType: string;
    listingType: string;
    minPrice: number;
    maxPrice: number;
    minLT: number;
    maxLT: number;
    minLB: number;
    maxLB: number;
    bedrooms: number;
    bathrooms: number;
    facilities: string[];
    certificate: string;
    onlyVerified: boolean;
    onlyPromoted: boolean;
  };
  setSearchFilters: React.Dispatch<React.SetStateAction<any>>;
  resetFilters: () => void;
  
  // Auth helpers
  handleGoogleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_FILTERS = {
  keyword: '',
  city: '',
  propertyType: '',
  listingType: 'jual',
  minPrice: 0,
  maxPrice: 30000000000,
  minLT: 0,
  maxLT: 2000,
  minLB: 0,
  maxLB: 2000,
  bedrooms: 0,
  bathrooms: 0,
  facilities: [] as string[],
  certificate: '',
  onlyVerified: false,
  onlyPromoted: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('properlist_user') || localStorage.getItem('goproperty_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Properties list
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('properlist_listings') || localStorage.getItem('goproperty_listings');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  // Comparison & Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('properlist_favorites') || localStorage.getItem('goproperty_favorites');
    return saved ? JSON.parse(saved) : ['prop-001'];
  });
  const [comparisonList, setComparisonList] = useState<Property[]>([]);

  // KPR Applications
  const [kprApplications, setKprApplications] = useState<KprApplication[]>(() => {
    const saved = localStorage.getItem('properlist_kpr') || localStorage.getItem('goproperty_kpr');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'KPR-2026-001',
        userId: 'user-benisius-admin',
        applicantName: 'Benisius Rahmat Basuki',
        applicantPhone: '081234567890',
        applicantEmail: 'benisius.rb@gmail.com',
        applicantIncome: 45000000,
        propertyId: 'prop-001',
        propertyTitle: 'Modern Tropical Villa Luxury di Pondok Indah',
        propertyCity: 'Jakarta Selatan',
        propertyPrice: 18500000000,
        downPayment: 3700000000, // 20%
        loanAmount: 14800000000,
        tenorYears: 20,
        interestRate: 6.75,
        bankPreference: 'Bank CIMB NIAGA',
        monthlyInstallment: 112500000,
        status: 'slik_ojk',
        statusHistory: [
          { status: 'diajukan', timestamp: '2026-10-28T09:00:00Z', note: 'Permohonan KPR online berhasil didaftarkan.' },
          { status: 'verifikasi_berkas', timestamp: '2026-10-29T14:30:00Z', note: 'Kelengkapan KTP, NPWP, dan Slip Gaji 3 bulan terverifikasi lengkap.' },
          { status: 'slik_ojk', timestamp: '2026-11-02T10:00:00Z', note: 'Sedang dalam pengecekan riwayat kredit BI Checking / SLIK OJK perbankan.' }
        ],
        createdAt: '2026-10-28T09:00:00Z',
        updatedAt: '2026-11-02T10:00:00Z'
      }
    ];
  });

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('properlist_transactions') || localStorage.getItem('goproperty_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('properlist_chats') || localStorage.getItem('goproperty_chats');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'msg-1',
        threadId: 'thread-agent-001',
        senderId: 'agent-001',
        senderName: 'Hendrawan Pratama (Century Premier)',
        receiverId: 'user-benisius-admin',
        receiverName: 'Benisius Rahmat Basuki',
        propertyId: 'prop-001',
        propertyTitle: 'Modern Tropical Villa Luxury di Pondok Indah',
        propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80',
        propertyPrice: 18500000000,
        text: 'Halo Bapak Benisius, terima kasih telah berminat dengan Villa Pondok Indah. Dokumen sertifikat SHM dan IMB sudah kami validasi di BPN. Kapan Bapak ada waktu luang untuk private survey lokasi?',
        timestamp: '2026-11-04T11:30:00Z',
        read: true
      }
    ];
  });
  const [activeChatPartner, setActiveChatPartner] = useState<{ id: string; name: string; property?: Property } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('properlist_notifs') || localStorage.getItem('goproperty_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Market Trends
  const [marketTrends] = useState<MarketTrend[]>(INITIAL_MARKET_TRENDS);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'kpr' | 'compare' | 'market' | 'admin' | 'premium'>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentPackageSelected, setPaymentPackageSelected] = useState<PremiumPackageType>('buyer_contact_pass');
  const [isKprModalOpen, setIsKprModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Search Filters
  const [searchFilters, setSearchFilters] = useState(DEFAULT_FILTERS);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('properlist_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('properlist_listings', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('properlist_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('properlist_kpr', JSON.stringify(kprApplications));
  }, [kprApplications]);

  useEffect(() => {
    localStorage.setItem('properlist_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('properlist_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('properlist_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Firebase Auth sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser((prev) => ({
          ...prev,
          uid: user.uid,
          email: user.email || 'benisius.rb@gmail.com',
          displayName: user.displayName || prev.displayName,
          photoURL: user.photoURL || undefined,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Notifications helper
  const triggerNotification = (title: string, message: string, type: AppNotification['type'], linkTab?: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.uid,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
      linkTab,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Role Switcher for seamless testing
  const switchRole = (newRole: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role: newRole,
      isPremium: newRole === 'superadmin' ? true : prev.isPremium,
    }));
    triggerNotification('Peran Akun Diperbarui', `Mode akun Anda sekarang beralih ke: ${newRole.toUpperCase()}`, 'system');
  };

  // Add Property with Content Moderation & Authenticity Verifier
  const addProperty = (propertyData: Partial<Property>) => {
    // 1. Content Moderation on Description
    const modResult = validateListingDescription(propertyData.description || '');
    if (!modResult.isValid) {
      return {
        success: false,
        error: modResult.explanation,
      };
    }

    // 2. Automated Authenticity Evaluation
    const authReport = evaluatePropertyAuthenticity({
      title: propertyData.title || '',
      description: propertyData.description || '',
      price: propertyData.price || 0,
      landArea: propertyData.landArea || 0,
      buildingArea: propertyData.buildingArea || 0,
      images: propertyData.images || [],
      certificate: propertyData.certificate || 'SHM',
      shmVerified: propertyData.documentDetails?.shmVerified,
      pbgVerified: propertyData.documentDetails?.pbgVerified,
    });

    const isPromoted = currentUser.isPremium && currentUser.premiumType === 'agent_boost';
    const nowIso = new Date().toISOString();
    const promotedUntil = isPromoted 
      ? new Date(Date.now() + 44 * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: propertyData.title || 'Properti Baru',
      description: propertyData.description || '',
      price: Number(propertyData.price) || 1000000000,
      propertyType: propertyData.propertyType || 'rumah',
      listingType: propertyData.listingType || 'jual',
      city: propertyData.city || 'Jakarta Selatan',
      province: propertyData.province || 'DKI Jakarta',
      address: propertyData.address || '',
      landArea: Number(propertyData.landArea) || 100,
      buildingArea: Number(propertyData.buildingArea) || 100,
      bedrooms: Number(propertyData.bedrooms) || 2,
      bathrooms: Number(propertyData.bathrooms) || 1,
      electricity: Number(propertyData.electricity) || 2200,
      certificate: propertyData.certificate || 'SHM',
      images: propertyData.images && propertyData.images.length > 0 
        ? propertyData.images 
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      nearbyFacilities: propertyData.nearbyFacilities || ['Dekat Akses Jalan Utama', 'Dekat Fasilitas Umum'],
      ownerId: currentUser.uid,
      ownerName: currentUser.displayName,
      ownerRole: currentUser.role === 'agent' ? 'agent' : 'owner',
      ownerAgency: currentUser.agencyName || 'Independent Seller',
      ownerRating: currentUser.rating || 4.9,
      isVerified: true,
      isPromoted: !!isPromoted,
      promotedUntil,
      authenticityScore: authReport.score,
      documentDetails: propertyData.documentDetails || {
        shmVerified: propertyData.certificate === 'SHM',
        pbgVerified: true,
        pbbClear: true,
      },
      viewsCount: 1,
      status: 'active',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setProperties((prev) => [newProp, ...prev]);

    triggerNotification(
      'Listing Berhasil Diterbitkan!',
      `Properti "${newProp.title}" telah lolos verifikasi moderasi konten otomatis dan aktif di ProperList.`,
      'system',
      'search'
    );

    return { success: true, property: newProp };
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    if (updates.description) {
      const modResult = validateListingDescription(updates.description);
      if (!modResult.isValid) {
        return { success: false, error: modResult.explanation };
      }
    }

    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item))
    );

    triggerNotification('Listing Diperbarui', 'Pembaruan data properti berhasil disimpan.', 'system');
    return { success: true };
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((item) => item.id !== id));
    setComparisonList((prev) => prev.filter((item) => item.id !== id));
    triggerNotification('Listing Dihapus', 'Listing properti telah dihapus dari sistem ProperList.', 'system');
    return true;
  };

  // Favorites
  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  };

  // Comparison
  const addToComparison = (property: Property): boolean => {
    if (comparisonList.some((p) => p.id === property.id)) {
      return false; // already added
    }
    if (comparisonList.length >= 3) {
      triggerNotification('Batas Maksimal Perbandingan', 'Anda dapat membandingkan maksimal 3 properti sekaligus.', 'system', 'compare');
      return false;
    }
    setComparisonList((prev) => [...prev, property]);
    triggerNotification('Ditambahkan ke Perbandingan', `"${property.title}" siap dibandingkan.`, 'system', 'compare');
    return true;
  };

  const removeFromComparison = (propertyId: string) => {
    setComparisonList((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  // KPR Application
  const submitKprApplication = (
    data: Omit<KprApplication, 'id' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'>
  ) => {
    const nowIso = new Date().toISOString();
    const newKpr: KprApplication = {
      ...data,
      id: `KPR-${Date.now().toString().slice(-6)}`,
      status: 'diajukan',
      statusHistory: [
        {
          status: 'diajukan',
          timestamp: nowIso,
          note: `Pengajuan KPR online diteruskan ke analis ${data.bankPreference}.`,
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setKprApplications((prev) => [newKpr, ...prev]);

    triggerNotification(
      'Pengajuan KPR Diterima!',
      `Permohonan KPR untuk "${newKpr.propertyTitle}" dengan bank ${newKpr.bankPreference} berhasil diajukan dan sedang diproses.`,
      'kpr',
      'kpr'
    );
  };

  const updateKprStatus = (id: string, newStatus: KprStatus, note: string) => {
    const nowIso = new Date().toISOString();
    setKprApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const updatedHistory = [...app.statusHistory, { status: newStatus, timestamp: nowIso, note }];
        return {
          ...app,
          status: newStatus,
          statusHistory: updatedHistory,
          updatedAt: nowIso,
        };
      })
    );

    const statusLabels: Record<KprStatus, string> = {
      diajukan: 'Diajukan',
      verifikasi_berkas: 'Verifikasi Berkas',
      slik_ojk: 'Pengecekan SLIK OJK / BI Checking',
      appraisal: 'Penilaian Properti (Appraisal)',
      disetujui: 'Disetujui (SPK Terbit)',
      ditolak: 'Belum Memenuhi Syarat',
    };

    triggerNotification(
      'Status KPR Diperbarui!',
      `Pengajuan KPR ID #${id} sekarang berada pada tahap: ${statusLabels[newStatus]}. Catatan: ${note}`,
      'kpr',
      'kpr'
    );
  };

  // Payment Receipt Upload (CIMB Niaga 704095513700 an. Benisius Rahmat Basuki)
  const submitPaymentReceipt = (data: {
    packageType: PremiumPackageType;
    amount: number;
    senderBank: string;
    senderAccountName: string;
    proofImageUrl: string;
    propertyIdToBoost?: string;
  }) => {
    const newTrx: Transaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userEmail: currentUser.email,
      userPhone: currentUser.phone || '081234567890',
      packageType: data.packageType,
      durationDays: 44,
      amount: data.amount,
      bankName: 'Bank CIMB NIAGA',
      bankAccount: '704095513700',
      accountHolder: 'Benisius Rahmat Basuki',
      senderBank: data.senderBank,
      senderAccountName: data.senderAccountName,
      transferDate: new Date().toISOString().split('T')[0],
      proofImageUrl: data.proofImageUrl,
      status: 'pending',
      adminNotes: 'Menunggu verifikasi admin manual pada mutasi rekening CIMB Niaga',
      createdAt: new Date().toISOString(),
      propertyIdToBoost: data.propertyIdToBoost,
    };

    setTransactions((prev) => [newTrx, ...prev]);

    triggerNotification(
      'Bukti Transfer Berhasil Diunggah!',
      'Bukti transfer rekening CIMB Niaga (704095513700 an. Benisius Rahmat Basuki) sedang diverifikasi oleh admin. Fitur premium 44 hari akan aktif otomatis.',
      'transaction',
      'admin'
    );
  };

  // Superadmin verifies transaction -> Auto-activates 44 days premium + triggers confirmation to benisius.rb@gmail.com
  const verifyTransaction = (id: string, isApproved: boolean, adminNotes?: string) => {
    const nowIso = new Date().toISOString();
    const expirationIso = new Date(Date.now() + 44 * 24 * 60 * 60 * 1000).toISOString();

    let targetTrx: Transaction | undefined;

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        targetTrx = t;
        return {
          ...t,
          status: isApproved ? 'approved' : 'rejected',
          adminNotes: adminNotes || (isApproved ? 'Pembayaran CIMB Niaga terverifikasi valid.' : 'Bukti transfer tidak sesuai mutasi.'),
          approvedAt: isApproved ? nowIso : undefined,
        };
      })
    );

    if (isApproved && targetTrx) {
      // Activate user premium
      setCurrentUser((prev) => ({
        ...prev,
        isPremium: true,
        premiumUntil: expirationIso,
        premiumType: targetTrx!.packageType,
      }));

      // If it was a listing boost, mark the property
      if (targetTrx.propertyIdToBoost) {
        setProperties((prev) =>
          prev.map((p) =>
            p.id === targetTrx!.propertyIdToBoost
              ? { ...p, isPromoted: true, promotedUntil: expirationIso }
              : p
          )
        );
      }

      triggerNotification(
        'Akses Fitur Premium 44 Hari Aktif!',
        `Selamat! Pembayaran Anda telah diverifikasi oleh admin. Akses aktif selama 44 hari penuh. Konfirmasi resmi otomatis dikirimkan ke email benisius.rb@gmail.com dan WhatsApp Anda.`,
        'transaction',
        'premium'
      );
    } else {
      triggerNotification(
        'Verifikasi Pembayaran Ditolak',
        `Pembayaran transaksi ID #${id} ditolak admin. Silakan periksa kembali bukti transfer rekening CIMB Niaga Anda.`,
        'transaction'
      );
    }
  };

  // Chat message sending
  const sendMessage = (receiverId: string, receiverName: string, text: string, property?: Property) => {
    if (!text.trim()) return;

    // Content moderation in chat
    const mod = validateListingDescription(text);
    if (!mod.isValid) {
      triggerNotification('Peringatan Keamanan', mod.explanation, 'system');
      return;
    }

    const threadId = [currentUser.uid, receiverId].sort().join('_');
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      receiverId,
      receiverName,
      propertyId: property?.id,
      propertyTitle: property?.title,
      propertyImage: property?.images?.[0],
      propertyPrice: property?.price,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Simulated auto-reply from agent/owner for engaging UX
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        threadId,
        senderId: receiverId,
        senderName: receiverName,
        receiverId: currentUser.uid,
        receiverName: currentUser.displayName,
        propertyId: property?.id,
        propertyTitle: property?.title,
        propertyImage: property?.images?.[0],
        propertyPrice: property?.price,
        text: `Terima kasih Bapak/Ibu ${currentUser.displayName}. Pesan Anda sudah kami terima melalui enkripsi ProperList. Segala dokumen sertifikat (SHM) dan IMB siap kami perlihatkan saat survey lokasi. Ada yang ingin ditanyakan lebih lanjut?`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setChatMessages((prev) => [...prev, replyMsg]);
      triggerNotification(`Pesan Baru dari ${receiverName}`, replyMsg.text.slice(0, 80) + '...', 'chat');
    }, 1800);
  };

  // Google Auth
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      if (result.user) {
        setCurrentUser((prev) => ({
          ...prev,
          uid: result.user.uid,
          email: result.user.email || 'benisius.rb@gmail.com',
          displayName: result.user.displayName || 'Pengguna Terverifikasi',
          photoURL: result.user.photoURL || undefined,
        }));
        triggerNotification('Login Berhasil', `Selamat datang di ProperList, ${result.user.displayName || 'User'}!`, 'system');
      }
    } catch (e) {
      console.warn('Google Popup skipped or unsupported in iframe, switched to demo authenticated session.', e);
      setCurrentUser((prev) => ({
        ...prev,
        uid: 'demo-google-user',
        email: 'benisius.rb@gmail.com',
        displayName: 'Benisius Rahmat Basuki (Google)',
      }));
      triggerNotification('Akun Terhubung', 'Berhasil masuk dengan akun Google terverifikasi.', 'system');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn(e);
    }
    setCurrentUser(INITIAL_USER);
    triggerNotification('Logout', 'Anda telah keluar dari sesi.', 'system');
  };

  const resetFilters = () => {
    setSearchFilters(DEFAULT_FILTERS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        favorites,
        toggleFavorite,
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        kprApplications,
        submitKprApplication,
        updateKprStatus,
        transactions,
        submitPaymentReceipt,
        verifyTransaction,
        chatMessages,
        sendMessage,
        activeChatPartner,
        setActiveChatPartner,
        isChatOpen,
        setIsChatOpen,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        triggerNotification,
        marketTrends,
        activeTab,
        setActiveTab,
        selectedProperty,
        setSelectedProperty,
        isCreateListingOpen,
        setIsCreateListingOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        paymentPackageSelected,
        setPaymentPackageSelected,
        isKprModalOpen,
        setIsKprModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        searchFilters,
        setSearchFilters,
        resetFilters,
        handleGoogleLogin,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
