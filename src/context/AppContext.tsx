import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, 
  PropertyStatus,
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
  INITIAL_MARKET_TRENDS 
} from '../data/mockData';
import { validateListingDescription, evaluatePropertyAuthenticity } from '../utils/moderation';
import { auth, db, handleFirestoreError, OperationType, testFirestoreConnection } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  allUsers: UserProfile[];
  
  // Properties
  properties: Property[];
  addProperty: (propertyData: Partial<Property>) => Promise<{ success: boolean; error?: string; property?: Property }>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<{ success: boolean; error?: string }>;
  togglePropertyStatus: (id: string, newStatus: PropertyStatus) => Promise<{ success: boolean }>;
  deleteProperty: (id: string) => Promise<boolean>;
  
  // Favorites & Comparison
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  comparisonList: Property[];
  addToComparison: (property: Property) => boolean;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  
  // KPR
  kprApplications: KprApplication[];
  submitKprApplication: (data: Omit<KprApplication, 'id' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateKprStatus: (id: string, newStatus: KprStatus, note: string) => Promise<void>;
  
  // Transactions & 44-day Premium
  transactions: Transaction[];
  submitPaymentReceipt: (data: {
    packageType: PremiumPackageType;
    amount: number;
    senderBank: string;
    senderAccountName: string;
    proofImageUrl: string;
    propertyIdToBoost?: string;
  }) => Promise<void>;
  verifyTransaction: (id: string, isApproved: boolean, adminNotes?: string) => Promise<void>;
  
  // User Management
  toggleAgentVerification: (userId: string, isVerified: boolean) => Promise<void>;
  toggleUserPremium: (userId: string, isPremium: boolean, days?: number) => Promise<void>;
  deleteUserAccount: (userId: string) => Promise<void>;
  
  // Chat
  chatMessages: ChatMessage[];
  sendMessage: (receiverId: string, receiverName: string, text: string, property?: Property) => Promise<void>;
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
  
  // Auth operations
  handleGoogleLogin: () => Promise<void>;
  handleRegister: (data: { displayName: string; username: string; email: string; phone?: string; role: UserRole; agencyName?: string }) => Promise<{ success: boolean; error?: string }>;
  handleLogin: (identifier: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
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
  // User Profile: null means unauthenticated / logged out (visitor starts on landing page)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      localStorage.removeItem('goproperty_user');
      localStorage.removeItem('properlist_user');
      const saved = localStorage.getItem('properlistid_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparisonList, setComparisonList] = useState<Property[]>([]);
  const [kprApplications, setKprApplications] = useState<KprApplication[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [marketTrends] = useState<MarketTrend[]>(INITIAL_MARKET_TRENDS);

  const [activeChatPartner, setActiveChatPartner] = useState<{ id: string; name: string; property?: Property } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  // Sync currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('properlistid_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('properlistid_user');
    }
  }, [currentUser]);

  // Test Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Real-time Firestore sync: properties
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'properties'), (snapshot) => {
      const loaded: Property[] = [];
      snapshot.forEach((docSnap) => {
        loaded.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      // Sort: promoted first, then newest
      loaded.sort((a, b) => {
        if (a.isPromoted && !b.isPromoted) return -1;
        if (!a.isPromoted && b.isPromoted) return 1;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      setProperties(loaded);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'properties');
    });

    return () => unsub();
  }, []);

  // Real-time Firestore sync: transactions
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      const loaded: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        loaded.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      loaded.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setTransactions(loaded);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'transactions');
    });

    return () => unsub();
  }, []);

  // Real-time Firestore sync: kprApplications
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'kprApplications'), (snapshot) => {
      const loaded: KprApplication[] = [];
      snapshot.forEach((docSnap) => {
        loaded.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      loaded.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setKprApplications(loaded);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'kprApplications');
    });

    return () => unsub();
  }, []);

  // Real-time Firestore sync: chatMessages
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'chatMessages'), (snapshot) => {
      const loaded: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        loaded.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      loaded.sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
      setChatMessages(loaded);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'chatMessages');
    });

    return () => unsub();
  }, []);

  // Real-time Firestore sync: users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const loaded: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        loaded.push({ uid: docSnap.id, ...(docSnap.data() as any) });
      });
      setAllUsers(loaded);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    return () => unsub();
  }, []);

  // Firebase Auth sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setCurrentUser(data);
          } else {
            // Create user profile in Firestore
            const isSuperadmin = user.email === 'benisius.rb@gmail.com';
            const newUser: UserProfile = {
              uid: user.uid,
              email: user.email || 'user@properlistid.id',
              displayName: user.displayName || 'Pengguna ProperListId',
              username: user.email ? user.email.split('@')[0] : `user_${user.uid.slice(0, 6)}`,
              photoURL: user.photoURL || undefined,
              role: isSuperadmin ? 'superadmin' : 'buyer',
              isAgentVerified: isSuperadmin,
              agencyName: isSuperadmin ? 'ProperListId Official' : undefined,
              rating: 5.0,
              reviewCount: 0,
              dealsCount: 0,
              isPremium: isSuperadmin,
              premiumUntil: isSuperadmin ? '2027-01-01T00:00:00Z' : undefined,
              premiumType: isSuperadmin ? 'agent_boost' : 'none',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newUser);
            setCurrentUser(newUser);
          }
        } catch (e) {
          console.warn('Error reading user profile from Firestore:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync: notifications (Cross-device)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const loaded: AppNotification[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        if (
          !currentUser ||
          data.userId === currentUser.uid ||
          data.userId === 'guest' ||
          data.userId === 'all' ||
          currentUser.role === 'superadmin'
        ) {
          loaded.push({ id: docSnap.id, ...data });
        }
      });
      loaded.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setNotifications(loaded);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'notifications');
    });

    return () => unsub();
  }, [currentUser?.uid, currentUser?.role]);

  // Trigger in-app notification (persisted to Firestore for real-time cross-device sync)
  const triggerNotification = async (
    title: string, 
    message: string, 
    type: AppNotification['type'] = 'system',
    linkTab?: string
  ) => {
    const notifId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newNotif: AppNotification = {
      id: notifId,
      userId: currentUser?.uid || 'guest',
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
      linkTab,
    };
    // Optimistic local update
    setNotifications((prev) => [newNotif, ...prev.filter(n => n.id !== notifId)]);

    try {
      await setDoc(doc(db, 'notifications', notifId), newNotif);
    } catch (e) {
      console.warn('Sync notification to Firestore notice:', e);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (e) {
      console.warn('Failed to mark notification read in Firestore:', e);
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      const promises = notifications.filter(n => !n.isRead).map(n => 
        updateDoc(doc(db, 'notifications', n.id), { isRead: true }).catch(() => {})
      );
      await Promise.all(promises);
    } catch (e) {
      console.warn('Failed to mark all notifications read:', e);
    }
  };

  // Property CRUD (Real-time Cloud Firestore)
  const addProperty = async (propertyData: Partial<Property>) => {
    if (!currentUser) {
      return { success: false, error: 'Silakan login terlebih dahulu untuk memasang iklan.' };
    }

    if (currentUser.role !== 'agent' && currentUser.role !== 'owner' && currentUser.role !== 'superadmin') {
      return { success: false, error: 'Hanya akun Agen atau Pemilik Properti yang dapat memasang iklan.' };
    }

    // Strict internal privacy moderation check
    if (propertyData.description) {
      const modResult = validateListingDescription(propertyData.description);
      if (!modResult.isValid) {
        return {
          success: false,
          error: modResult.explanation,
        };
      }
    }

    const authenticity = evaluatePropertyAuthenticity({
      title: propertyData.title || '',
      description: propertyData.description || '',
      price: propertyData.price || 0,
      landArea: propertyData.landArea || 0,
      buildingArea: propertyData.buildingArea || 0,
      images: propertyData.images || [],
      certificate: propertyData.certificate || 'SHM',
      shmVerified: propertyData.certificate === 'SHM',
      pbgVerified: true,
    });
    const newId = `prop-${Date.now()}`;

    const newProp: Property = {
      id: newId,
      title: propertyData.title || 'Properti Tanpa Judul',
      description: propertyData.description || '',
      price: propertyData.price || 0,
      propertyType: propertyData.propertyType || 'rumah',
      listingType: propertyData.listingType || 'jual',
      city: propertyData.city || 'Jakarta Selatan',
      province: propertyData.province || 'DKI Jakarta',
      address: propertyData.address || '',
      coordinates: propertyData.coordinates || { lat: -6.2088, lng: 106.8456 },
      facilityMarkers: propertyData.facilityMarkers || [],
      landArea: propertyData.landArea || 100,
      buildingArea: propertyData.buildingArea || 80,
      bedrooms: propertyData.bedrooms || 2,
      bathrooms: propertyData.bathrooms || 1,
      electricity: propertyData.electricity || 2200,
      certificate: propertyData.certificate || 'SHM',
      images: propertyData.images && propertyData.images.length > 0 
        ? propertyData.images 
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      nearbyFacilities: propertyData.nearbyFacilities || ['Akses Jalan Utama'],
      ownerId: currentUser.uid,
      ownerName: currentUser.displayName,
      ownerRole: currentUser.role === 'agent' ? 'agent' : 'owner',
      ownerAgency: currentUser.agencyName,
      ownerRating: currentUser.rating || 5.0,
      isVerified: currentUser.isAgentVerified || currentUser.role === 'superadmin',
      isPromoted: Boolean(currentUser.isPremium && currentUser.premiumType === 'agent_boost'),
      promotedUntil: currentUser.premiumUntil,
      authenticityScore: authenticity.score,
      documentDetails: {
        shmVerified: propertyData.certificate === 'SHM',
        pbgVerified: true,
        pbbClear: true,
      },
      viewsCount: 1,
      status: propertyData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'properties', newId), newProp);
      triggerNotification(
        'Listing Berhasil Diterbitkan!',
        `Properti "${newProp.title}" telah lolos verifikasi moderasi konten dan tersimpan di cloud Firebase ProperListId.`,
        'system',
        'search'
      );
      return { success: true, property: newProp };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `properties/${newId}`);
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    if (updates.description) {
      const modResult = validateListingDescription(updates.description);
      if (!modResult.isValid) {
        return { success: false, error: modResult.explanation };
      }
    }

    try {
      const propertyRef = doc(db, 'properties', id);
      await updateDoc(propertyRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      setSelectedProperty((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
      triggerNotification('Listing Diperbarui', 'Pembaruan data properti berhasil disinkronkan ke cloud.', 'system');
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `properties/${id}`);
    }
  };

  const togglePropertyStatus = async (id: string, newStatus: PropertyStatus) => {
    try {
      const propertyRef = doc(db, 'properties', id);
      await updateDoc(propertyRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      setSelectedProperty((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev));
      const isSold = newStatus === 'sold' || newStatus === 'laku';
      triggerNotification(
        'Status Listing Diperbarui',
        `Listing kini ditandai "${isSold ? 'LAKU (Terjual)' : 'BELUM LAKU (Tersedia)'}" dan tersinkronisasi langsung ke cloud Firebase di seluruh perangkat.`,
        'system'
      );
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `properties/${id}`);
      return { success: false };
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'properties', id));
      setComparisonList((prev) => prev.filter((item) => item.id !== id));
      triggerNotification('Listing Dihapus', 'Listing properti telah dihapus dari cloud Firestore ProperListId.', 'system');
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `properties/${id}`);
    }
  };

  // Favorites
  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  };

  // Comparison
  const addToComparison = (property: Property): boolean => {
    if (comparisonList.length >= 3) {
      triggerNotification('Batas Perbandingan', 'Maksimal 3 properti dapat dibandingkan bersamaan.', 'system');
      return false;
    }
    if (comparisonList.some((p) => p.id === property.id)) {
      triggerNotification('Sudah Ditambahkan', 'Properti ini sudah ada di daftar perbandingan.', 'system');
      return false;
    }
    setComparisonList((prev) => [...prev, property]);
    triggerNotification('Ditambahkan ke Perbandingan', `Properti ${property.title.slice(0, 30)}... ditambahkan.`, 'system', 'compare');
    return true;
  };

  const removeFromComparison = (propertyId: string) => {
    setComparisonList((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const clearComparison = () => setComparisonList([]);

  // KPR Application
  const submitKprApplication = async (data: Omit<KprApplication, 'id' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'>) => {
    const kprId = `KPR-${Date.now()}`;
    const newKpr: KprApplication = {
      ...data,
      id: kprId,
      status: 'diajukan',
      statusHistory: [
        {
          status: 'diajukan',
          timestamp: new Date().toISOString(),
          note: 'Permohonan KPR online diajukan via platform ProperListId.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'kprApplications', kprId), newKpr);
      triggerNotification(
        'Pengajuan KPR Dikirim',
        `Pengajuan KPR untuk ${data.propertyTitle} sedang diproses verifikasi bank (${data.bankPreference}).`,
        'kpr',
        'kpr'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `kprApplications/${kprId}`);
    }
  };

  const updateKprStatus = async (id: string, newStatus: KprStatus, note: string) => {
    const existing = kprApplications.find((k) => k.id === id);
    if (!existing) return;

    const newHistory = [
      ...(existing.statusHistory || []),
      { status: newStatus, timestamp: new Date().toISOString(), note }
    ];

    try {
      await updateDoc(doc(db, 'kprApplications', id), {
        status: newStatus,
        statusHistory: newHistory,
        updatedAt: new Date().toISOString(),
      });

      triggerNotification(
        'Status KPR Diperbarui',
        `Pengajuan KPR (${id}): Status kini "${newStatus.replace('_', ' ').toUpperCase()}". Catatan: ${note}`,
        'kpr',
        'kpr'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `kprApplications/${id}`);
    }
  };

  // 44-Day Premium Payment Receipt Submission
  const submitPaymentReceipt = async (data: {
    packageType: PremiumPackageType;
    amount: number;
    senderBank: string;
    senderAccountName: string;
    proofImageUrl: string;
    propertyIdToBoost?: string;
  }) => {
    if (!currentUser) return;

    const txId = `TRX-${Date.now()}`;
    const newTx: Transaction = {
      id: txId,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userEmail: currentUser.email,
      userPhone: currentUser.phone || '0812xxxxxxx',
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
      adminNotes: 'Menunggu konfirmasi mutasi rekening Bank CIMB NIAGA',
      createdAt: new Date().toISOString(),
      propertyIdToBoost: data.propertyIdToBoost,
    };

    try {
      await setDoc(doc(db, 'transactions', txId), newTx);
      triggerNotification(
        'Bukti Pembayaran Diterima',
        'Bukti transfer CIMB NIAGA Anda sedang diverifikasi admin. Email notifikasi terkirim ke benisius.rb@gmail.com.',
        'transaction',
        'admin'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `transactions/${txId}`);
    }
  };

  const verifyTransaction = async (id: string, isApproved: boolean, adminNotes?: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    const newStatus = isApproved ? 'approved' : 'rejected';
    const approvedAt = isApproved ? new Date().toISOString() : undefined;

    try {
      await updateDoc(doc(db, 'transactions', id), {
        status: newStatus,
        adminNotes: adminNotes || (isApproved ? 'Pembayaran terverifikasi mutasi Bank CIMB NIAGA.' : 'Bukti transfer tidak valid.'),
        approvedAt: approvedAt || null,
      });

      // If approved, activate 44-day premium in Firestore for target user
      if (isApproved) {
        const premiumUntilDate = new Date();
        premiumUntilDate.setDate(premiumUntilDate.getDate() + 44);

        const targetUserRef = doc(db, 'users', tx.userId);
        await updateDoc(targetUserRef, {
          isPremium: true,
          premiumUntil: premiumUntilDate.toISOString(),
          premiumType: tx.packageType === 'agent_boost' || tx.packageType === 'agent_listing_boost' ? 'agent_boost' : 'buyer_pass',
        });

        // If boosting a specific property
        if (tx.propertyIdToBoost) {
          await updateDoc(doc(db, 'properties', tx.propertyIdToBoost), {
            isPromoted: true,
            promotedUntil: premiumUntilDate.toISOString(),
          });
        }

        // If target user is currentUser, update state
        if (currentUser && currentUser.uid === tx.userId) {
          setCurrentUser({
            ...currentUser,
            isPremium: true,
            premiumUntil: premiumUntilDate.toISOString(),
            premiumType: tx.packageType === 'agent_boost' || tx.packageType === 'agent_listing_boost' ? 'agent_boost' : 'buyer_contact_pass',
          });
        }
      }

      triggerNotification(
        'Verifikasi Pembayaran',
        `Transaksi ${id} telah ${isApproved ? 'DISETUJUI (Akses 44 hari aktif)' : 'DITOLAK'}.`,
        'transaction'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `transactions/${id}`);
    }
  };

  // User management operations for Superadmin
  const toggleAgentVerification = async (userId: string, isVerified: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isAgentVerified: isVerified,
      });
      triggerNotification('Status Agen Diperbarui', `Status verifikasi agen ${userId} telah diubah menjadi ${isVerified ? 'Terverifikasi' : 'Belum Diverifikasi'}.`, 'system');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const toggleUserPremium = async (userId: string, isPremium: boolean, days: number = 44) => {
    try {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + days);

      await updateDoc(doc(db, 'users', userId), {
        isPremium,
        premiumUntil: isPremium ? expDate.toISOString() : null,
      });
      triggerNotification('Status Premium Diperbarui', `Status akses 44 hari user ${userId} telah diubah.`, 'system');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const deleteUserAccount = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      triggerNotification('User Dihapus', `Akun pengguna ${userId} telah dihapus dari cloud database.`, 'system');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
    }
  };

  // Internal Chat System (Saved to Firestore)
  const sendMessage = async (receiverId: string, receiverName: string, text: string, property?: Property) => {
    if (!currentUser) {
      triggerNotification('Akses Dibatasi', 'Silakan login terlebih dahulu untuk mengirim pesan.', 'system');
      return;
    }

    const modResult = validateListingDescription(text);
    if (!modResult.isValid) {
      triggerNotification(
        'Pesan Ditolak Sistem',
        'Untuk keamanan privasi, dilarang mencantumkan nomor telepon / email langsung dalam obrolan.',
        'chat'
      );
      return;
    }

    const threadId = `thread-${[currentUser.uid, receiverId].sort().join('-')}`;
    const msgId = `msg-${Date.now()}`;

    const newMsg: ChatMessage = {
      id: msgId,
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

    try {
      await setDoc(doc(db, 'chatMessages', msgId), newMsg);
      triggerNotification('Pesan Terkirim', `Pesan Anda terkirim secara aman ke ${receiverName}.`, 'chat');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `chatMessages/${msgId}`);
    }
  };

  // User Registration (Stores to Firestore /users/{uid})
  const handleRegister = async (data: {
    displayName: string;
    username: string;
    email: string;
    phone?: string;
    role: UserRole;
    agencyName?: string;
  }) => {
    const isSuperadmin = data.email === 'benisius.rb@gmail.com' || data.role === 'superadmin';
    const newUid = `user-${Date.now()}`;

    const userProfile: UserProfile = {
      uid: newUid,
      email: data.email,
      displayName: data.displayName,
      username: data.username,
      phone: data.phone,
      role: isSuperadmin ? 'superadmin' : data.role,
      isAgentVerified: isSuperadmin,
      agencyName: data.agencyName || (isSuperadmin ? 'ProperListId Official' : undefined),
      rating: 5.0,
      reviewCount: 0,
      dealsCount: 0,
      isPremium: isSuperadmin,
      premiumUntil: isSuperadmin ? '2027-01-01T00:00:00Z' : undefined,
      premiumType: isSuperadmin ? 'agent_boost' : 'none',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', newUid), userProfile);
      setCurrentUser(userProfile);
      triggerNotification('Registrasi Berhasil', `Selamat datang di ProperListId, ${data.displayName}! Akun ${data.role.toUpperCase()} Anda telah tersimpan di cloud Firebase.`, 'system');
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${newUid}`);
    }
  };

  // User Login (Checks Firestore /users)
  const handleLogin = async (identifier: string, role?: UserRole) => {
    const cleanId = identifier.trim().toLowerCase();

    // Check if matching user in allUsers
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === cleanId || (u.username && u.username.toLowerCase() === cleanId)
    );

    if (found) {
      setCurrentUser(found);
      triggerNotification('Login Berhasil', `Selamat datang kembali, ${found.displayName}!`, 'system');
      return { success: true };
    }

    // If identifier is benisius.rb@gmail.com, create/restore superadmin
    if (cleanId === 'benisius.rb@gmail.com') {
      const superadminProfile: UserProfile = {
        uid: 'user-benisius-admin',
        email: 'benisius.rb@gmail.com',
        displayName: 'Benisius Rahmat Basuki',
        username: 'benisius_admin',
        role: 'superadmin',
        isAgentVerified: true,
        agencyName: 'ProperListId Official',
        rating: 5.0,
        reviewCount: 42,
        dealsCount: 30,
        isPremium: true,
        premiumUntil: '2027-01-01T00:00:00Z',
        premiumType: 'agent_boost',
        createdAt: '2026-01-01T00:00:00Z',
      };
      await setDoc(doc(db, 'users', superadminProfile.uid), superadminProfile);
      setCurrentUser(superadminProfile);
      triggerNotification('Login Superadmin', 'Selamat datang Superadmin Benisius Rahmat Basuki.', 'system');
      return { success: true };
    }

    // If not found in cloud, create new profile with requested role
    const newUid = `user-${Date.now()}`;
    const newProfile: UserProfile = {
      uid: newUid,
      email: cleanId.includes('@') ? cleanId : `${cleanId}@properlistid.id`,
      displayName: identifier.includes('@') ? identifier.split('@')[0] : identifier,
      username: cleanId.replace(/[^a-z0-9_]/g, '_'),
      role: role || 'buyer',
      isAgentVerified: false,
      rating: 5.0,
      reviewCount: 0,
      dealsCount: 0,
      isPremium: false,
      premiumType: 'none',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', newUid), newProfile);
      setCurrentUser(newProfile);
      triggerNotification('Login Berhasil', `Selamat datang di ProperListId, ${newProfile.displayName}!`, 'system');
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${newUid}`);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      if (result.user) {
        const u = result.user;
        const isSuperadmin = u.email === 'benisius.rb@gmail.com';
        const userProfile: UserProfile = {
          uid: u.uid,
          email: u.email || 'user@properlistid.id',
          displayName: u.displayName || 'Pengguna Google',
          username: u.email ? u.email.split('@')[0] : `user_${u.uid.slice(0, 6)}`,
          photoURL: u.photoURL || undefined,
          role: isSuperadmin ? 'superadmin' : 'buyer',
          isAgentVerified: isSuperadmin,
          agencyName: isSuperadmin ? 'ProperListId Official' : undefined,
          rating: 5.0,
          reviewCount: 0,
          dealsCount: 0,
          isPremium: isSuperadmin,
          premiumUntil: isSuperadmin ? '2027-01-01T00:00:00Z' : undefined,
          premiumType: isSuperadmin ? 'agent_boost' : 'none',
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', u.uid), userProfile);
        setCurrentUser(userProfile);
        triggerNotification('Login Berhasil', `Selamat datang di ProperListId, ${userProfile.displayName}!`, 'system');
      }
    } catch (e) {
      console.warn('Google Popup fallback:', e);
      // Fallback demo session
      const demoUser: UserProfile = {
        uid: 'demo-google-user',
        email: 'benisius.rb@gmail.com',
        displayName: 'Benisius Rahmat Basuki',
        username: 'benisius_rb',
        role: 'superadmin',
        isAgentVerified: true,
        agencyName: 'ProperListId Official',
        rating: 5.0,
        reviewCount: 30,
        dealsCount: 20,
        isPremium: true,
        premiumUntil: '2027-01-01T00:00:00Z',
        premiumType: 'agent_boost',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', demoUser.uid), demoUser);
      setCurrentUser(demoUser);
      triggerNotification('Akun Terhubung', 'Berhasil masuk dengan akun Google terverifikasi.', 'system');
    }
  };

  // Logout (Redirects directly to clean landing page)
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('properlistid_user');
    localStorage.removeItem('properlist_user');
    localStorage.removeItem('goproperty_user');
    setActiveTab('home');
    setIsChatOpen(false);
    setIsAuthModalOpen(false);
    triggerNotification('Berhasil Keluar', 'Anda telah keluar dari akun ProperListId. Sampai jumpa kembali!', 'system');
  };

  const resetFilters = () => {
    setSearchFilters(DEFAULT_FILTERS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers,
        properties,
        addProperty,
        updateProperty,
        togglePropertyStatus,
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
        toggleAgentVerification,
        toggleUserPremium,
        deleteUserAccount,
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
        handleRegister,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
