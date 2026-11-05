import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSearch } from './components/HeroSearch';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { KprCalculatorModal } from './components/KprCalculatorModal';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';
import { MarketAnalyticsView } from './components/MarketAnalyticsView';
import { PaymentModal } from './components/PaymentModal';
import { ChatDrawer } from './components/ChatDrawer';
import { SuperadminDashboard } from './components/SuperadminDashboard';
import { AuthModal } from './components/AuthModal';
import { TESTIMONIALS } from './data/mockData';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  ArrowRight, 
  ArrowLeftRight, 
  Star, 
  Calculator, 
  TrendingUp, 
  SlidersHorizontal,
  Search,
  CheckCircle2,
  Lock,
  Compass,
  CreditCard,
  PlusCircle
} from 'lucide-react';
import { formatRupiah } from './utils/currency';

const MainAppContent: React.FC = () => {
  const { 
    properties, 
    activeTab, 
    setActiveTab, 
    searchFilters, 
    setSearchFilters, 
    comparisonList, 
    clearComparison,
    setIsPaymentModalOpen,
    setPaymentPackageSelected,
    setIsCreateListingOpen,
    setIsKprModalOpen,
    currentUser
  } = useApp();

  const [sortBy, setSortBy] = useState<'terbaru' | 'harga_rendah' | 'harga_tinggi' | 'lt_besar'>('terbaru');
  const [isMapsQuotaExceeded, setIsMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setIsMapsQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Filtered properties based on search criteria
  const filteredProperties = properties.filter((prop) => {
    // Listing type
    if (searchFilters.listingType && prop.listingType !== searchFilters.listingType) return false;

    // City filter
    if (searchFilters.city && !prop.city.toLowerCase().includes(searchFilters.city.toLowerCase())) return false;

    // Property type filter
    if (searchFilters.propertyType && prop.propertyType !== searchFilters.propertyType) return false;

    // Keyword filter
    if (searchFilters.keyword) {
      const q = searchFilters.keyword.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchCity = prop.city.toLowerCase().includes(q);
      const matchDesc = prop.description.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchDesc) return false;
    }

    // Price range
    if (prop.price < searchFilters.minPrice) return false;
    if (searchFilters.maxPrice > 0 && prop.price > searchFilters.maxPrice) return false;

    // Luas Tanah (LT)
    if (searchFilters.minLT > 0 && prop.landArea < searchFilters.minLT) return false;

    // Bedrooms
    if (searchFilters.bedrooms > 0 && prop.bedrooms < searchFilters.bedrooms) return false;

    // Certificate
    if (searchFilters.certificate && prop.certificate !== searchFilters.certificate) return false;

    // Verified documents
    if (searchFilters.onlyVerified && !prop.documentDetails.shmVerified) return false;

    // Promoted
    if (searchFilters.onlyPromoted && !prop.isPromoted) return false;

    // Facilities
    if (searchFilters.facilities && searchFilters.facilities.length > 0) {
      const hasAll = searchFilters.facilities.every((fac: string) =>
        prop.nearbyFacilities.some((pf) => pf.toLowerCase().includes(fac.toLowerCase().slice(0, 10)))
      );
      if (!hasAll) return false;
    }

    return true;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    // Boosted/Promoted listings always rank on top
    if (a.isPromoted && !b.isPromoted) return -1;
    if (!a.isPromoted && b.isPromoted) return 1;

    if (sortBy === 'harga_rendah') return a.price - b.price;
    if (sortBy === 'harga_tinggi') return b.price - a.price;
    if (sortBy === 'lt_besar') return b.landArea - a.landArea;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const promotedListings = properties.filter((p) => p.isPromoted);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {isMapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-xs">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <Navbar />

      <main className="flex-1">
        {/* TAB 1: HOME LANDING PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-16">
            {/* Hero Search Section */}
            <HeroSearch />

            {/* Featured / Unggulan Promoted Listings (44-day boosted) */}
            {promotedListings.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-bold mb-2">
                      <Crown className="w-3.5 h-3.5 fill-current" />
                      <span>Rekomendasi Properti Unggulan (Promosi 44 Hari)</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Pilihan Eksklusif Terverifikasi
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Listing premium dengan legalitas sertifikat terjamin dan lokasi strategis.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSearchFilters((prev: any) => ({ ...prev, onlyPromoted: true }));
                      setActiveTab('search');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <span>Lihat Semua Unggulan ({promotedListings.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promotedListings.slice(0, 3).map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              </section>
            )}

            {/* All Recent Listings Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Properti Terbaru di Seluruh Indonesia
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Temukan rumah impian, ruko bisnis, dan kavling tanah siap bangun dengan harga pasar terbaik.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('search')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                >
                  <Search className="w-4 h-4" />
                  <span>Jelajahi Semua Listing</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 6).map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            </section>

            {/* Why GoProperty & Privacy Safety Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
                <div className="max-w-3xl space-y-4 relative z-10">
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider inline-block">
                    Inovasi Keamanan Data
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                    Proteksi Privasi 100% dengan Obrolan Langsung Internal Terenkripsi
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Sistem GoProperty secara otomatis menolak penulisan nomor telepon dan email dalam deskripsi listing untuk menghindarkan Anda dari penipuan, makelar gelap, dan spam telemarketing. Semua negosiasi berlangsung aman di dalam platform kami.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <Lock className="w-5 h-5 text-emerald-400 mb-2" />
                      <h4 className="font-bold text-sm">Privasi Kontak Aman</h4>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Nomor HP dan email Anda tidak dipublikasikan ke publik.
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <ShieldCheck className="w-5 h-5 text-teal-400 mb-2" />
                      <h4 className="font-bold text-sm">Verifikasi Dokumen SHM</h4>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Pemeriksaan keabsahan sertifikat dan perizinan PBG/IMB.
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <Crown className="w-5 h-5 text-amber-400 mb-2" />
                      <h4 className="font-bold text-sm">Paket Fitur 44 Hari</h4>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Akses kontak terverifikasi via transfer resmi CIMB Niaga.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                  Ulasan Pengguna Nyata
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                  Dipercaya Pembeli, Agen & Investor Se-Indonesia
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-3">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{t.comment}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>
                        <p className="text-[10px] text-slate-500">{t.role} • {t.city}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: SEARCH & FILTER PROPERTI */}
        {activeTab === 'search' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <HeroSearch />

            {/* Filter Result Controls & Sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Daftar Properti Tersedia ({sortedProperties.length} Listing Ditemukan)
                </h2>
                <p className="text-xs text-slate-500">
                  {searchFilters.city || 'Seluruh Indonesia'} • Tipe: {searchFilters.propertyType || 'Semua Tipe'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-emerald-500 cursor-pointer"
                >
                  <option value="terbaru">Terbaru & Listing Unggulan</option>
                  <option value="harga_rendah">Harga Terendah</option>
                  <option value="harga_tinggi">Harga Tertinggi</option>
                  <option value="lt_besar">Luas Tanah Terbesar</option>
                </select>
              </div>
            </div>

            {/* Listings Grid */}
            {sortedProperties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-700">Tidak Ada Properti yang Sesuai Filter</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Coba sesuaikan rentang harga, lokasi, atau reset filter pencarian Anda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SIMULASI KPR */}
        {activeTab === 'kpr' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                Fasilitas Pembiayaan Rumah
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
                Kalkulator & Pengajuan KPR Online
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Rencanakan cicilan bulanan secara presisi dengan suku bunga bank terkemuka di Indonesia dan pantau pembaruan status pengajuan secara real-time.
              </p>
            </div>

            <button
              onClick={() => setIsKprModalOpen(true)}
              className="mx-auto block bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black px-6 py-3 rounded-2xl text-xs shadow-lg shadow-emerald-600/30 cursor-pointer hover:scale-105 transition-all"
            >
              Buka Layar Penuh Kalkulator & Tracking KPR
            </button>

            {/* Embedded KPR Component View */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <KprCalculatorModal />
            </div>
          </div>
        )}

        {/* TAB 4: PERBANDINGAN PROPERTI */}
        {activeTab === 'compare' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                Fitur Komparasi Cerdas
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
                Bandingkan Properti Pilihan Anda
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Evaluasi harga per m², spesifikasi luas bangunan, legalitas sertifikat, dan estimasi angsuran KPR berdampingan untuk keputusan tepat.
              </p>
            </div>

            <PropertyComparisonModal />
          </div>
        )}

        {/* TAB 5: TREN PASAR RI */}
        {activeTab === 'market' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <MarketAnalyticsView />
          </div>
        )}

        {/* TAB 6: PAKET PREMIUM (44 HARI) */}
        {activeTab === 'premium' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-black mb-2">
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>Paket Fitur Eksklusif 44 Hari</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Tingkatkan Efektivitas Transaksi Properti Anda
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Akses kontak tak terbatas bagi pembeli & fitur promosi menonjol bagi agen/pemilik selama 44 hari penuh. Pembayaran terverifikasi via rekening resmi Bank CIMB NIAGA.
              </p>
            </div>

            {/* 2 Packages Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Buyer Pass */}
              <div className="bg-white rounded-3xl border-2 border-emerald-500 p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                      Calon Pembeli / Investor
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">44 HARI</span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    Paket Akses Kontak Pembeli
                  </h3>

                  <div className="text-3xl font-black text-emerald-700">
                    Rp 149.000
                    <span className="text-xs text-slate-400 font-normal"> / 44 hari</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bebas kirim pesan ke semua agen & pemilik properti</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Obrolan internal terenkripsi melindungi privasi Anda</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Prioritas penjadwalan survey lokasi properti</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Masa aktif 44 hari dengan opsi perpanjangan fleksibel</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setPaymentPackageSelected('buyer_contact_pass');
                    setIsPaymentModalOpen(true);
                  }}
                  className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl text-xs shadow-md shadow-emerald-600/30 cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  Pilih Paket Pembeli (Rp 149.000)
                </button>
              </div>

              {/* Agent Boost */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-between border-2 border-amber-500 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
                      Agen & Pemilik Properti
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-400">44 HARI</span>
                  </div>

                  <h3 className="text-xl font-black text-white">
                    Paket Promosi Listing Eksklusif
                  </h3>

                  <div className="text-3xl font-black text-amber-400">
                    Rp 299.000
                    <span className="text-xs text-slate-400 font-normal"> / 44 hari</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Listing properti diposisikan di urutan teratas pencarian</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Badge emas 'Unggulan 44 Hari' yang meningkatkan klik 4x</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Lencana Agen Terverifikasi (Gold Certified Agent)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Notifikasi konfirmasi ke email & WhatsApp pengguna</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setPaymentPackageSelected('agent_listing_boost');
                    setIsPaymentModalOpen(true);
                  }}
                  className="mt-6 w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black py-3 rounded-2xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  Pilih Promosi Agen (Rp 299.000)
                </button>
              </div>
            </div>

            {/* Bank Transfer Guide Box */}
            <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Instruksi Pembayaran Manual Resmi</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">1. Rekening Tujuan</span>
                  <strong className="text-white text-sm block mt-1">Bank CIMB NIAGA</strong>
                  <span className="font-mono text-yellow-400 font-bold text-sm">704095513700</span>
                  <span className="block text-[11px] text-slate-300 mt-0.5">a.n. Benisius Rahmat Basuki</span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">2. Unggah Bukti Transfer</span>
                  <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
                    Unggah screenshot mutasi atau struk ATM melalui formulir konfirmasi yang disediakan di halaman pembayaran.
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">3. Konfirmasi & Aktivasi</span>
                  <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
                    Setelah diverifikasi admin, sistem mengirim notifikasi via email <strong>benisius.rb@gmail.com</strong> atau WhatsApp, dan akses 44 hari aktif otomatis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SUPERADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <SuperadminDashboard />
          </div>
        )}
      </main>

      {/* Floating Comparison Drawer if items selected */}
      {comparisonList.length > 0 && activeTab !== 'compare' && (
        <aside aria-label="Bilah perbandingan properti" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
            <span><strong>{comparisonList.length}</strong> Properti dipilih</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('compare')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors"
            >
              Bandingkan Sekarang
            </button>
            <button
              onClick={clearComparison}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Batal
            </button>
          </div>
        </aside>
      )}

      {/* Modals */}
      <PropertyDetailModal />
      <CreateListingModal />
      <KprCalculatorModal />
      <PaymentModal />
      <ChatDrawer />
      <AuthModal />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
