import { Property, UserProfile, Transaction, MarketTrend, AppNotification } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    title: 'Modern Tropical Villa Luxury di Pondok Indah',
    description: 'Hunian mewah 2 lantai berkonsep Modern Tropical di kawasan prestisius Pondok Indah Jakarta Selatan. Dilengkapi private swimming pool, taman asri, smart home security, dan garasi luas 3 mobil. Lingkungan tenang, bebas banjir, serta sistem keamanan 24 jam.',
    price: 18500000000,
    propertyType: 'rumah',
    listingType: 'jual',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    address: 'Jl. Duta Niaga Blok TH, Pondok Indah',
    coordinates: { lat: -6.2796, lng: 106.7844 },
    facilityMarkers: [
      { id: 'pim', name: 'Pondok Indah Mall (PIM 1, 2, 3)', type: 'mall', position: { lat: -6.2654, lng: 106.7831 }, distanceKm: 1.6 },
      { id: 'mrt', name: 'Stasiun MRT Lebak Bulus Grab', type: 'transport', position: { lat: -6.2902, lng: 106.7749 }, distanceKm: 1.4 },
      { id: 'rspi', name: 'RS Pondok Indah (Pusat Medis)', type: 'hospital', position: { lat: -6.2828, lng: 106.7825 }, distanceKm: 0.4 },
      { id: 'jis', name: 'Jakarta Intercultural School (JIS)', type: 'school', position: { lat: -6.2885, lng: 106.7792 }, distanceKm: 1.1 },
      { id: 'tol', name: 'Gerbang Tol TB Simatupang (JORR)', type: 'toll', position: { lat: -6.2941, lng: 106.7865 }, distanceKm: 1.7 }
    ],
    landArea: 480,
    buildingArea: 550,
    bedrooms: 5,
    bathrooms: 6,
    electricity: 16500,
    certificate: 'SHM',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    nearbyFacilities: [
      'Dekat Pondok Indah Mall (PIM 1, 2, 3)',
      'Dekat Stasiun MRT Lebak Bulus',
      'Dekat RS Pondok Indah',
      'Dekat Jakarta Intercultural School (JIS)',
      'Akses Pintu Tol TB Simatupang (5 Menit)'
    ],
    ownerId: 'agent-001',
    ownerName: 'Hendrawan Pratama',
    ownerRole: 'agent',
    ownerAgency: 'Century Premier Realty',
    ownerRating: 4.95,
    isVerified: true,
    isPromoted: true,
    promotedUntil: '2026-12-18T10:00:00Z',
    authenticityScore: 98,
    documentDetails: {
      shmVerified: true,
      pbgVerified: true,
      pbbClear: true
    },
    viewsCount: 1420,
    status: 'active',
    createdAt: '2026-10-15T08:30:00Z',
    updatedAt: '2026-11-01T12:00:00Z'
  },
  {
    id: 'prop-002',
    title: 'Rumah Minimalis Smart Home Grand Wisata BSD City',
    description: 'Rumah baru brand new siap huni di klaster terbaru BSD City. Konsep open space dengan pencahayaan alami optimal, solar panel, ventilasi silang, dan clubhouse komunitas. Sangat cocok bagi keluarga muda dinamis.',
    price: 3250000000,
    propertyType: 'rumah',
    listingType: 'jual',
    city: 'Tangerang Selatan',
    province: 'Banten',
    address: 'Klaster Vanya Park, BSD City, Pagedangan',
    coordinates: { lat: -6.3015, lng: 106.6520 },
    facilityMarkers: [
      { id: 'aeon', name: 'AEON Mall BSD & QBig', type: 'mall', position: { lat: -6.3045, lng: 106.6435 }, distanceKm: 1.1 },
      { id: 'krl', name: 'Stasiun KRL Cisauk (Intermoda)', type: 'transport', position: { lat: -6.3241, lng: 106.6412 }, distanceKm: 2.8 },
      { id: 'eka', name: 'Eka Hospital BSD', type: 'hospital', position: { lat: -6.2995, lng: 106.6678 }, distanceKm: 1.8 },
      { id: 'prasmul', name: 'Universitas Prasetiya Mulya & ICE', type: 'school', position: { lat: -6.3025, lng: 106.6415 }, distanceKm: 1.2 },
      { id: 'tol-bsd', name: 'Pintu Tol Serpong - Balaraja', type: 'toll', position: { lat: -6.3120, lng: 106.6380 }, distanceKm: 1.9 }
    ],
    landArea: 144,
    buildingArea: 180,
    bedrooms: 4,
    bathrooms: 3,
    electricity: 4400,
    certificate: 'SHM',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
    ],
    nearbyFacilities: [
      'Dekat AEON Mall BSD & QBig',
      'Dekat Stasiun KRL Cisauk (Intermoda)',
      'Dekat Akses Tol Serpong - Balaraja',
      'Dekat Universitas Prasetiya Mulya & ICE BSD',
      'Dekat Eka Hospital BSD'
    ],
    ownerId: 'agent-002',
    ownerName: 'Siti Nurhaliza, S.Ars',
    ownerRole: 'agent',
    ownerAgency: 'Brighton Real Estate Serpong',
    ownerRating: 4.88,
    isVerified: true,
    isPromoted: true,
    promotedUntil: '2026-12-15T09:00:00Z',
    authenticityScore: 96,
    documentDetails: {
      shmVerified: true,
      pbgVerified: true,
      pbbClear: true
    },
    viewsCount: 980,
    status: 'active',
    createdAt: '2026-10-20T11:00:00Z',
    updatedAt: '2026-11-02T14:30:00Z'
  },
  {
    id: 'prop-003',
    title: 'Penthouse View Laut Sunset di Seminyak Bali',
    description: 'Unit Penthouse mewah 3 lantai dengan pemandangan langsung ke garis pantai Seminyak. Full furnished dengan furniture kayu jati desainer, private rooftop jacuzzi, high ceiling, dan lisensi IMB/PBG sewa harian (ROI potensial 14% p.a.).',
    price: 9800000000,
    propertyType: 'villa',
    listingType: 'jual',
    city: 'Badung',
    province: 'Bali',
    address: 'Jl. Petitenget No. 88, Seminyak, Kuta Utara',
    coordinates: { lat: -8.6872, lng: 115.1542 },
    facilityMarkers: [
      { id: 'pantai', name: 'Pantai Petitenget & Sunset Point', type: 'beach', position: { lat: -8.6865, lng: 115.1495 }, distanceKm: 0.5 },
      { id: 'potato', name: 'Potato Head Beach Club & Resort', type: 'mall', position: { lat: -8.6798, lng: 115.1512 }, distanceKm: 0.9 },
      { id: 'siloam-bali', name: 'RS Siloam Denpasar', type: 'hospital', position: { lat: -8.7042, lng: 115.1845 }, distanceKm: 4.1 }
    ],
    landArea: 320,
    buildingArea: 400,
    bedrooms: 3,
    bathrooms: 4,
    electricity: 11000,
    certificate: 'HGB',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    nearbyFacilities: [
      'Dekat Pantai Petitenget (Jalan Kaki 3 Menit)',
      'Dekat Potato Head & Ku De Ta Beach Club',
      'Dekat Pusat Kuliner Seminyak & Boutiques',
      'Dekat RS Siloam Denpasar (15 Menit)',
      'Dekat Bandara Internasional Ngurah Rai (25 Menit)'
    ],
    ownerId: 'owner-001',
    ownerName: 'I Made Dharma Putra',
    ownerRole: 'owner',
    ownerRating: 4.9,
    isVerified: true,
    isPromoted: false,
    authenticityScore: 94,
    documentDetails: {
      shmVerified: true,
      pbgVerified: true,
      pbbClear: true
    },
    viewsCount: 2150,
    status: 'active',
    createdAt: '2026-10-10T14:00:00Z',
    updatedAt: '2026-11-03T09:15:00Z'
  },
  {
    id: 'prop-004',
    title: 'Ruko Strategis 3,5 Lantai Main Road Dharmahusada Surabaya',
    description: 'Ruko komersial siap pakai di jalur emas Surabaya Timur. Lantai marmer, parkir depan luas muat 6 mobil, instalasi genset & AC central. Sangat ideal untuk kantor perbankan, klinik kecantikan, showroom, atau kantor notaris.',
    price: 4950000000,
    propertyType: 'ruko',
    listingType: 'jual',
    city: 'Surabaya',
    province: 'Jawa Timur',
    address: 'Jl. Raya Dharmahusada Indah No. 45, Mulyorejo',
    coordinates: { lat: -7.2690, lng: 112.7725 },
    facilityMarkers: [
      { id: 'unair', name: 'Universitas Airlangga (Kampus C)', type: 'school', position: { lat: -7.2715, lng: 112.7840 }, distanceKm: 1.3 },
      { id: 'galaxy-mall', name: 'Galaxy Mall Surabaya', type: 'mall', position: { lat: -7.2762, lng: 112.7801 }, distanceKm: 1.1 },
      { id: 'mitra-keluarga', name: 'RS Mitra Keluarga Kenjeran', type: 'hospital', position: { lat: -7.2612, lng: 112.7872 }, distanceKm: 1.8 }
    ],
    landArea: 160,
    buildingArea: 420,
    bedrooms: 2,
    bathrooms: 4,
    electricity: 13200,
    certificate: 'HGB',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    nearbyFacilities: [
      'Dekat Kampus Universitas Airlangga (UNAIR Kampus C)',
      'Dekat Galaxy Mall Surabaya (5 Menit)',
      'Dekat RS Mitra Keluarga Kenjeran',
      'Dekat Jalur MERR (Middle East Ring Road)',
      'Dekat Pusat Kuliner Kertajaya'
    ],
    ownerId: 'agent-003',
    ownerName: 'Budi Santoso Tan',
    ownerRole: 'agent',
    ownerAgency: 'Ray White Surabaya Pusat',
    ownerRating: 4.92,
    isVerified: true,
    isPromoted: false,
    authenticityScore: 92,
    documentDetails: {
      shmVerified: false,
      pbgVerified: true,
      pbbClear: true
    },
    viewsCount: 760,
    status: 'active',
    createdAt: '2026-10-25T16:20:00Z',
    updatedAt: '2026-11-04T10:00:00Z'
  },
  {
    id: 'prop-005',
    title: 'Tanah Kavling Premium View Gunung di Dago Pakar Resort Bandung',
    description: 'Tanah kavling eksklusif di dataran tinggi Bandung Utara. Udara sejuk 19-24 derajat celcius, view lembah dan lapangan golf 18 holes. Kontur tanah berkontur landai siap bangun villa liburan keluarga.',
    price: 3800000000,
    propertyType: 'tanah',
    listingType: 'jual',
    city: 'Bandung',
    province: 'Jawa Barat',
    address: 'Kawasan Dago Pakar Resort Kavling Merak',
    coordinates: { lat: -6.8624, lng: 107.6251 },
    facilityMarkers: [
      { id: 'golf-dago', name: 'Mountain View Golf Club Dago', type: 'general', position: { lat: -6.8582, lng: 107.6295 }, distanceKm: 0.8 },
      { id: 'skyline', name: 'Skyline Cafe & Kuliner Dago Atas', type: 'mall', position: { lat: -6.8540, lng: 107.6210 }, distanceKm: 1.2 },
      { id: 'itb', name: 'Kampus ITB Ganesha & RS Borromeus', type: 'school', position: { lat: -6.8925, lng: 107.6105 }, distanceKm: 4.2 }
    ],
    landArea: 650,
    buildingArea: 0,
    bedrooms: 0,
    bathrooms: 0,
    electricity: 0,
    certificate: 'SHM',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'
    ],
    nearbyFacilities: [
      'Dekat Mountain View Golf Club Dago',
      'Dekat Kafe & Resto Hits Dago Atas (Sierra, Skyline, Armor Kopi)',
      'Dekat Kampus ITB Ganesha & UNPAD Dipatiukur (15 Menit)',
      'Dekat RS Santo Borromeus Bandung',
      'Akses Pintu Tol Pasteur (20 Menit)'
    ],
    ownerId: 'owner-002',
    ownerName: 'Dr. Raden Asep Wijaya',
    ownerRole: 'owner',
    ownerRating: 5.0,
    isVerified: true,
    isPromoted: true,
    promotedUntil: '2026-12-20T15:00:00Z',
    authenticityScore: 97,
    documentDetails: {
      shmVerified: true,
      pbgVerified: false,
      pbbClear: true
    },
    viewsCount: 1680,
    status: 'active',
    createdAt: '2026-10-18T09:40:00Z',
    updatedAt: '2026-11-03T11:20:00Z'
  },
  {
    id: 'prop-006',
    title: 'Apartemen Sudirman Tower Condominium SCBD Jakarta',
    description: 'Unit apartemen 3BR di jantung kawasan bisnis SCBD Sudirman. Dilengkapi private lift, balkon luas dengan skyline view gedung-gedung pencakar langit Jakarta, semi-olympic swimming pool, gym modern, dan akses langsung jembatan pedestrian.',
    price: 6500000000,
    propertyType: 'apartemen',
    listingType: 'jual',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    address: 'Jl. Jend. Sudirman Kav 52-53, SCBD',
    coordinates: { lat: -6.2255, lng: 106.8080 },
    facilityMarkers: [
      { id: 'pacific-place', name: 'Mall Pacific Place & Ashta District 8', type: 'mall', position: { lat: -6.2248, lng: 106.8095 }, distanceKm: 0.2 },
      { id: 'mrt-istora', name: 'Stasiun MRT Istora Mandiri', type: 'transport', position: { lat: -6.2230, lng: 106.8068 }, distanceKm: 0.3 },
      { id: 'idx', name: 'Bursa Efek Indonesia & Gelora Bung Karno', type: 'general', position: { lat: -6.2240, lng: 106.8085 }, distanceKm: 0.2 },
      { id: 'siloam-semanggi', name: 'RS Siloam Semanggi / MRCCC', type: 'hospital', position: { lat: -6.2198, lng: 106.8155 }, distanceKm: 1.1 }
    ],
    landArea: 0,
    buildingArea: 165,
    bedrooms: 3,
    bathrooms: 2,
    electricity: 6600,
    certificate: 'Strata Title',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    nearbyFacilities: [
      'Akses Langsung Mall Pacific Place & Ashta District 8',
      'Dekat Stasiun MRT Istora Mandiri (5 Menit Jalan Kaki)',
      'Dekat Bursa Efek Indonesia (IDX) & Gelora Bung Karno',
      'Dekat RS Medistra & Siloam Semanggi',
      'Dekat Kawasan Kuliner & Cafe SCBD'
    ],
    ownerId: 'agent-001',
    ownerName: 'Hendrawan Pratama',
    ownerRole: 'agent',
    ownerAgency: 'Century Premier Realty',
    ownerRating: 4.95,
    isVerified: true,
    isPromoted: false,
    authenticityScore: 95,
    documentDetails: {
      shmVerified: true,
      pbgVerified: true,
      pbbClear: true
    },
    viewsCount: 1890,
    status: 'active',
    createdAt: '2026-10-28T07:10:00Z',
    updatedAt: '2026-11-04T08:00:00Z'
  }
];

export const INITIAL_USER: UserProfile = {
  uid: 'user-benisius-admin',
  email: 'benisius.rb@gmail.com',
  displayName: 'Benisius Rahmat Basuki',
  role: 'superadmin',
  isAgentVerified: true,
  rating: 5.0,
  reviewCount: 38,
  dealsCount: 29,
  isPremium: true,
  premiumUntil: '2027-01-01T00:00:00Z',
  premiumType: 'agent_boost',
  createdAt: '2026-01-01T00:00:00Z'
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-202611-001',
    userId: 'buyer-007',
    userName: 'Kurniawan Wijaya',
    userEmail: 'kurniawan.w@gmail.com',
    userPhone: '081288992211',
    packageType: 'buyer_contact_pass',
    durationDays: 44,
    amount: 149000,
    bankName: 'Bank CIMB NIAGA',
    bankAccount: '704095513700',
    accountHolder: 'Benisius Rahmat Basuki',
    senderBank: 'Bank BCA',
    senderAccountName: 'Kurniawan Wijaya',
    transferDate: '2026-11-04',
    proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    status: 'pending',
    adminNotes: 'Menunggu konfirmasi admin pengecekan mutasi rekening CIMB Niaga',
    createdAt: '2026-11-04T14:20:00Z'
  },
  {
    id: 'TRX-202610-092',
    userId: 'agent-002',
    userName: 'Siti Nurhaliza, S.Ars',
    userEmail: 'siti.nurhaliza.agent@gmail.com',
    userPhone: '081399881122',
    packageType: 'agent_listing_boost',
    durationDays: 44,
    amount: 299000,
    bankName: 'Bank CIMB NIAGA',
    bankAccount: '704095513700',
    accountHolder: 'Benisius Rahmat Basuki',
    senderBank: 'Bank Mandiri',
    senderAccountName: 'Siti Nurhaliza',
    transferDate: '2026-10-25',
    proofImageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80',
    status: 'approved',
    adminNotes: 'Dana telah masuk mutasi CIMB Niaga. Akses promosi 44 hari telah diaktifkan.',
    createdAt: '2026-10-25T09:10:00Z',
    approvedAt: '2026-10-25T10:05:00Z',
    propertyIdToBoost: 'prop-002'
  }
];

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
    topDemandType: 'tanah',
    priceTrendHistory: [
      { period: 'Q1 2026', avgM2: 13900000 },
      { period: 'Q2 2026', avgM2: 14400000 },
      { period: 'Q3 2026', avgM2: 14900000 },
      { period: 'Q4 2026', avgM2: 15400000 }
    ]
  },
  {
    province: 'DI Yogyakarta',
    city: 'Sleman & Kota Yogyakarta',
    averagePricePerM2: 12600000,
    quarterlyGrowthPercent: 7.0,
    transactionVolume: 870,
    topDemandType: 'rumah',
    priceTrendHistory: [
      { period: 'Q1 2026', avgM2: 11200000 },
      { period: 'Q2 2026', avgM2: 11700000 },
      { period: 'Q3 2026', avgM2: 12100000 },
      { period: 'Q4 2026', avgM2: 12600000 }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-benisius-admin',
    title: 'Lonjakan Tren Harga Properti!',
    message: 'Harga properti di kawasan Badung (Canggu & Seminyak) naik signifikan sebesar +8.5% kuartal ini.',
    type: 'price_alert',
    isRead: false,
    createdAt: '2026-11-04T15:00:00Z',
    linkTab: 'market'
  },
  {
    id: 'notif-2',
    userId: 'user-benisius-admin',
    title: 'Pembayaran Premium Masuk!',
    message: 'Kurniawan Wijaya mengunggah bukti transfer CIMB Niaga Rp 149.000 untuk Paket Akses Kontak Pembeli (44 Hari).',
    type: 'transaction',
    isRead: false,
    createdAt: '2026-11-04T14:22:00Z',
    linkTab: 'admin'
  },
  {
    id: 'notif-3',
    userId: 'user-benisius-admin',
    title: 'Pembaruan Pengajuan KPR',
    message: 'Berkas permohonan KPR Anda untuk properti "Modern Tropical Villa Luxury" telah lolos Verifikasi Berkas dan berlanjut ke tahap SLIK OJK.',
    type: 'kpr',
    isRead: true,
    createdAt: '2026-11-03T10:15:00Z',
    linkTab: 'kpr'
  }
];

export const TESTIMONIALS = [
  {
    id: 'testi-1',
    name: 'Ir. Handoko Soetjipto',
    role: 'Investor Properti & Direktur Konstruksi',
    city: 'Jakarta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: 'Portal ProperList sangat aman dan profesional. Fitur moderasi yang menolak nomor telp langsung di deskripsi terbukti menyaring makelar liar. Sistem obrolan internal sangat responsif dan analitik tren harga se-Indonesia membantu saya menentukan momen investasi tepat!',
    rating: 5
  },
  {
    id: 'testi-2',
    name: 'Maya Angelina, M.M.',
    role: 'Pembeli Rumah Pertama (Pondok Indah)',
    city: 'Tangerang Selatan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    comment: 'Simulasi KPR langsung terhubung ke status tracking pengajuan berkas. Notifikasi real-time via email benisius.rb@gmail.com dan WhatsApp memberikan kepastian langkah demi langkah hingga akad kredit disetujui!',
    rating: 5
  },
  {
    id: 'testi-3',
    name: 'Gunawan Wibisono',
    role: 'Principal Agent (Brighton Property)',
    city: 'Surabaya',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    comment: 'Paket promosi 44 hari sangat efektif mendatangkan buyer potensial yang sudah tersaring. Verifikasi dokumen SHM memberikan jaminan legalitas sehingga proses closing transaksi jadi 2x lebih cepat.',
    rating: 5
  }
];
