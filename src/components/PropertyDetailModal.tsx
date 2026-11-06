import React, { useState } from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  ShieldCheck, 
  Crown, 
  Star, 
  MessageSquare, 
  Calculator, 
  Heart, 
  ArrowLeftRight, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  FileCheck, 
  Share2, 
  Award,
  Lock
} from 'lucide-react';
import { formatRupiah, calculateDaysRemaining } from '../utils/currency';
import { PropertyMap } from './PropertyMap';

export const PropertyDetailModal: React.FC = () => {
  const { 
    selectedProperty, 
    setSelectedProperty, 
    currentUser, 
    favorites, 
    toggleFavorite, 
    comparisonList, 
    addToComparison, 
    removeFromComparison,
    setActiveChatPartner,
    setIsChatOpen,
    setIsPaymentModalOpen,
    setPaymentPackageSelected,
    setIsKprModalOpen,
    setIsAuthModalOpen,
    triggerNotification
  } = useApp();

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!selectedProperty) return null;

  const isFav = favorites.includes(selectedProperty.id);
  const isInComparison = comparisonList.some((p) => p.id === selectedProperty.id);
  const daysRemaining = currentUser?.premiumUntil
    ? calculateDaysRemaining(currentUser.premiumUntil)
    : { days: 0, isExpired: true };

  const handleContact = () => {
    if (!currentUser) {
      triggerNotification('Login Diperlukan', 'Silakan masuk atau daftar terlebih dahulu untuk menghubungi agen/pemilik properti.', 'system');
      setIsAuthModalOpen(true);
      return;
    }

    if (currentUser.uid === selectedProperty.ownerId) {
      triggerNotification('Info', 'Ini adalah properti milik Anda sendiri.', 'system');
      return;
    }

    // Check if buyer has active 44-day pass
    const hasActivePass = currentUser.isPremium && !daysRemaining.isExpired;
    if (!hasActivePass && currentUser.role === 'buyer') {
      setPaymentPackageSelected('buyer_contact_pass');
      setIsPaymentModalOpen(true);
      triggerNotification(
        'Akses Kontak 44 Hari Diperlukan',
        'Untuk menghubungi pemilik/agen dan mencegah kebocoran data kontak pribadi, aktifkan Paket Akses Kontak Pembeli 44 Hari.',
        'transaction',
        'premium'
      );
      return;
    }

    // Open chat
    setActiveChatPartner({
      id: selectedProperty.ownerId,
      name: `${selectedProperty.ownerName} (${selectedProperty.ownerAgency || 'Pemilik'})`,
      property: selectedProperty,
    });
    setSelectedProperty(null);
    setIsChatOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      triggerNotification('Tautan Disalin', 'Tautan properti berhasil disalin ke clipboard.', 'system');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 my-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
              selectedProperty.listingType === 'jual' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {selectedProperty.listingType === 'jual' ? 'Dijual' : 'Disewa'}
            </span>
            <span className="bg-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
              {selectedProperty.propertyType}
            </span>
            {selectedProperty.isPromoted && (
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-current" />
                Unggulan 44 Hari
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Bagikan properti"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(selectedProperty.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isFav ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-200'
              }`}
              title="Favorit"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedProperty(null)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Photo Gallery Lightbox */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 bg-slate-950 rounded-2xl overflow-hidden shadow-inner group">
              <img
                src={selectedProperty.images[activeImgIndex]}
                alt={selectedProperty.title}
                className="w-full h-full object-cover transition-all"
              />

              {/* Prev / Next Controls */}
              {selectedProperty.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev === 0 ? selectedProperty.images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev === selectedProperty.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Index counter */}
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold">
                {activeImgIndex + 1} / {selectedProperty.images.length} Foto
              </div>
            </div>

            {/* Thumbnail Strip */}
            {selectedProperty.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selectedProperty.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImgIndex === idx ? 'border-emerald-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing, Title, Location */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {formatRupiah(selectedProperty.price)}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-1">
                {selectedProperty.title}
              </h2>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.province}</span>
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  if (isInComparison) removeFromComparison(selectedProperty.id);
                  else addToComparison(selectedProperty);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isInComparison
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>{isInComparison ? 'Terpilih Dibandingkan' : 'Bandingkan'}</span>
              </button>

              <button
                onClick={() => {
                  setIsKprModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-emerald-700" />
                <span>Simulasi KPR</span>
              </button>
            </div>
          </div>

          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-center p-2">
              <span className="block text-[11px] font-bold text-slate-400 uppercase">Luas Tanah (LT)</span>
              <span className="text-base font-black text-slate-900">{selectedProperty.landArea} m²</span>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <span className="block text-[11px] font-bold text-slate-400 uppercase">Luas Bangunan (LB)</span>
              <span className="text-base font-black text-slate-900">
                {selectedProperty.buildingArea > 0 ? `${selectedProperty.buildingArea} m²` : '-'}
              </span>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <span className="block text-[11px] font-bold text-slate-400 uppercase">Kamar Tidur</span>
              <span className="text-base font-black text-slate-900">
                {selectedProperty.bedrooms > 0 ? selectedProperty.bedrooms : '-'}
              </span>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <span className="block text-[11px] font-bold text-slate-400 uppercase">Kamar Mandi</span>
              <span className="text-base font-black text-slate-900">
                {selectedProperty.bathrooms > 0 ? selectedProperty.bathrooms : '-'}
              </span>
            </div>
            <div className="text-center p-2 border-l border-slate-200 col-span-2 sm:col-span-1">
              <span className="block text-[11px] font-bold text-slate-400 uppercase">Sertifikat</span>
              <span className="text-base font-black text-emerald-700">{selectedProperty.certificate}</span>
            </div>
          </div>

          {/* Legal Document Verification & Authenticity Report */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-black text-slate-900 text-sm">Verifikasi Dokumen & Keaslian Data</h4>
              </div>
              <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-full">
                Skor Keaslian: {selectedProperty.authenticityScore}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800">Sertifikat {selectedProperty.certificate}</span>
                  <p className="text-[10px] text-slate-500">Tervalidasi BPN & Notaris</p>
                </div>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800">Izin PBG / IMB</span>
                  <p className="text-[10px] text-slate-500">Struktur bangunan legal</p>
                </div>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800">Pajak PBB Lunas</span>
                  <p className="text-[10px] text-slate-500">Bebas sengketa pajak</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Deskripsi Properti</h4>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {selectedProperty.description}
            </p>
          </div>

          {/* Interactive Google Map & Nearby Facilities */}
          <div className="pt-2">
            <PropertyMap property={selectedProperty} />
          </div>

          {/* Agent / Owner Profile Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center font-black text-lg">
                {selectedProperty.ownerName.slice(0, 1)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-base text-white">{selectedProperty.ownerName}</h4>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase">
                    {selectedProperty.ownerRole === 'agent' ? 'Agen Terverifikasi' : 'Pemilik Langsung'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {selectedProperty.ownerRating || 4.9}
                  </span>
                  <span>•</span>
                  <span>{selectedProperty.ownerAgency || 'ProperListId Certified Member'}</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Button */}
            <button
              onClick={handleContact}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-3 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kirim Pesan Obrolan Langsung</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
