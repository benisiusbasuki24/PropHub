export type PropertyType = 'rumah' | 'apartemen' | 'ruko' | 'tanah' | 'villa' | 'gudang' | 'kantor';
export type ListingType = 'jual' | 'sewa';
export type CertificateType = 'SHM' | 'HGB' | 'Girik' | 'Strata Title' | 'PPJB';
export type UserRole = 'buyer' | 'agent' | 'owner' | 'admin' | 'superadmin';
export type KprStatus = 'diajukan' | 'verifikasi_berkas' | 'slik_ojk' | 'appraisal' | 'disetujui' | 'ditolak';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';
export type PremiumPackageType = 'buyer_contact_pass' | 'agent_listing_boost' | 'agent_boost';

export interface FacilityMarker {
  id: string;
  name: string;
  type: 'transport' | 'mall' | 'hospital' | 'school' | 'toll' | 'beach' | 'general';
  position: { lat: number; lng: number };
  distanceKm?: number;
}

export type PropertyStatus = 'active' | 'sold' | 'rented' | 'pending_review' | 'rejected' | 'laku' | 'belum_laku';

export const isPropertySold = (status?: string): boolean => {
  return status === 'sold' || status === 'laku' || status === 'rented';
};

export const getPropertyStatusInfo = (status?: string): { label: string; isSold: boolean; badgeClass: string } => {
  if (status === 'sold' || status === 'laku') {
    return { 
      label: 'Laku (Terjual)', 
      isSold: true, 
      badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300' 
    };
  }
  if (status === 'rented') {
    return { 
      label: 'Laku (Tersewa)', 
      isSold: true, 
      badgeClass: 'bg-purple-100 text-purple-800 border border-purple-300' 
    };
  }
  if (status === 'pending_review') {
    return { 
      label: 'Moderasi Review', 
      isSold: false, 
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300' 
    };
  }
  if (status === 'rejected') {
    return { 
      label: 'Ditolak Moderasi', 
      isSold: false, 
      badgeClass: 'bg-red-100 text-red-800 border border-red-300' 
    };
  }
  return { 
    label: 'Belum Laku (Tersedia)', 
    isSold: false, 
    badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
  };
};

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  listingType: ListingType;
  city: string;
  province: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  facilityMarkers?: FacilityMarker[];
  landArea: number; // m² (LT)
  buildingArea: number; // m² (LB)
  bedrooms: number;
  bathrooms: number;
  electricity: number; // Watt
  certificate: CertificateType;
  images: string[];
  nearbyFacilities: string[];
  ownerId: string;
  ownerName: string;
  ownerRole: 'agent' | 'owner';
  ownerAgency?: string;
  ownerRating?: number;
  isVerified: boolean;
  isPromoted: boolean; // 44 days paid boost
  promotedUntil?: string; // ISO date
  authenticityScore: number; // 0 - 100%
  documentDetails: {
    shmVerified: boolean;
    pbgVerified: boolean;
    pbbClear: boolean;
  };
  viewsCount: number;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username?: string;
  photoURL?: string;
  phone?: string;
  role: UserRole;
  isAgentVerified: boolean;
  agencyName?: string;
  rating: number;
  reviewCount: number;
  dealsCount: number;
  isPremium: boolean;
  premiumUntil?: string; // ISO string 44 days
  premiumType: PremiumPackageType | 'none';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  packageType: PremiumPackageType;
  durationDays: number; // 44
  amount: number;
  bankName: string; // CIMB NIAGA
  bankAccount: string; // 704095513700
  accountHolder: string; // Benisius Rahmat Basuki
  senderBank: string;
  senderAccountName: string;
  transferDate: string;
  proofImageUrl: string;
  status: TransactionStatus;
  adminNotes?: string;
  createdAt: string;
  approvedAt?: string;
  propertyIdToBoost?: string;
}

export interface KprApplication {
  id: string;
  userId: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantIncome: number;
  propertyId: string;
  propertyTitle: string;
  propertyCity: string;
  propertyPrice: number;
  downPayment: number;
  loanAmount: number;
  tenorYears: number;
  interestRate: number;
  bankPreference: string;
  monthlyInstallment: number;
  status: KprStatus;
  statusHistory: {
    status: KprStatus;
    timestamp: string;
    note: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
  propertyPrice?: number;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatThread {
  id: string;
  participantIds: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
  lastMessageTime: string;
  propertyId?: string;
  propertyTitle?: string;
  unreadCount: number;
}

export interface MarketTrend {
  province: string;
  city: string;
  averagePricePerM2: number;
  quarterlyGrowthPercent: number;
  transactionVolume: number;
  topDemandType: PropertyType;
  priceTrendHistory: {
    period: string; // e.g. "Q1 2026"
    avgM2: number;
  }[];
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'kpr' | 'price_alert' | 'transaction' | 'chat' | 'system';
  isRead: boolean;
  createdAt: string;
  linkTab?: string;
}
