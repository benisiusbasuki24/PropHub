import { Property, UserProfile, Transaction, MarketTrend, AppNotification } from '../types';

// Semua data dummy telah dihapus sesuai instruksi pengguna.
// Seluruh data listing, user, transaksi, dan KPR tersimpan & disinkronkan langsung via Firebase Firestore.

export const INITIAL_PROPERTIES: Property[] = [];

export const INITIAL_USER: UserProfile | null = null;

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

// Data referensi indikator tren pasar properti Indonesia
export const INITIAL_MARKET_TRENDS: MarketTrend[] = [
  {
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    averagePricePerM2: 34500000,
    quarterlyGrowthPercent: 4.8,
    transactionVolume: 1240,
    topDemandType: 'rumah',
    priceTrendHistory: [
      { period: 'Q1 2026', avgM2: 32000000 },
      { period: 'Q2 2026', avgM2: 32900000 },
      { period: 'Q3 2026', avgM2: 33700000 },
      { period: 'Q4 2026', avgM2: 34500000 }
    ]
  },
  {
    province: 'Banten',
    city: 'Tangerang Selatan (BSD & Bintaro)',
    averagePricePerM2: 19800000,
    quarterlyGrowthPercent: 6.2,
    transactionVolume: 2100,
    topDemandType: 'rumah',
    priceTrendHistory: [
      { period: 'Q1 2026', avgM2: 17800000 },
      { period: 'Q2 2026', avgM2: 18400000 },
      { period: 'Q3 2026', avgM2: 19100000 },
      { period: 'Q4 2026', avgM2: 19800000 }
    ]
  },
  {
    province: 'Bali',
    city: 'Badung (Canggu & Seminyak)',
    averagePricePerM2: 28500000,
    quarterlyGrowthPercent: 8.5,
    transactionVolume: 920,
    topDemandType: 'villa',
    priceTrendHistory: [
      { period: 'Q1 2026', avgM2: 24500000 },
      { period: 'Q2 2026', avgM2: 25800000 },
      { period: 'Q3 2026', avgM2: 27100000 },
      { period: 'Q4 2026', avgM2: 28500000 }
    ]
  },
  {
    province: 'Jawa Timur',
    city: 'Surabaya Timur & Barat',
    averagePricePerM2: 18200000,
    quarterlyGrowthPercent: 3.9,
    transactionVolume: 1450,
    topDemandType: 'ruko',
    priceTrendHistory: [
      { period: 'Q1 2026', avgM2: 16900000 },
      { period: 'Q2 2026', avgM2: 17300000 },
      { period: 'Q3 2026', avgM2: 17700000 },
      { period: 'Q4 2026', avgM2: 18200000 }
    ]
  },
  {
    province: 'Jawa Barat',
    city: 'Bandung Raya & Dago',
    averagePricePerM2: 15400000,
    quarterlyGrowthPercent: 5.1,
    transactionVolume: 1100,
    topDemandType: 'rumah',
    priceTrendHistory: [
      { period: 'Q1 2026', avgM2: 13900000 },
      { period: 'Q2 2026', avgM2: 14400000 },
      { period: 'Q3 2026', avgM2: 14900000 },
      { period: 'Q4 2026', avgM2: 15400000 }
    ]
  }
];

export const TESTIMONIALS: { id: string; name: string; role: string; city: string; avatar: string; comment: string; rating: number }[] = [];
