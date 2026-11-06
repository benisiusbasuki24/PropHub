import React, { useState } from 'react';
import { Property, isPropertySold, getPropertyStatusInfo } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  ArrowLeftRight, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  ShieldCheck, 
  Crown, 
  Star, 
  MessageSquare, 
  Calculator, 
  Eye,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { formatRupiah } from '../utils/currency';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, compact = false }) => {
  const { 
    currentUser, 
    favorites, 
    toggleFavorite, 
    comparisonList, 
    addToComparison, 
    removeFromComparison,
    setSelectedProperty,
    setActiveChatPartner,
    setIsChatOpen,
    setIsPaymentModalOpen,
    setPaymentPackageSelected,
    setIsAuthModalOpen,
    triggerNotification
  } = useApp();

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const isFav = favorites.includes(property.id);
  const isInComparison = comparisonList.some((p) => p.id === property.id);

  // Handle contact agent logic:
  // Requires active 44-day buyer pass unless user is superadmin or the owner themselves
  const handleContactAgent = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!currentUser) {
      triggerNotification('Login Diperlukan', 'Silakan masuk atau daftar terlebih dahulu untuk menghubungi agen/pemilik properti.', 'system');
      setIsAuthModalOpen(true);
      return;
    }

    if (currentUser.uid === property.ownerId) {
      triggerNotification('Info', 'Ini adalah properti milik Anda sendiri.', 'system');
      return;
    }

    if (!currentUser.isPremium && currentUser.role === 'buyer') {
      // Prompt user to purchase 44-day Buyer Contact Pass
      setPaymentPackageSelected('buyer_contact_pass');
      setIsPaymentModalOpen(true);
      triggerNotification(
        'Akses Kontak Premium (44 Hari)',
        'Untuk menghubungi agen dan pemilik properti secara langsung demi keamanan & validitas data, silakan aktifkan Paket Akses Kontak 44 Hari.',
        'transaction',
        'premium'
      );
      return;
    }

    // Open chat
    setActiveChatPartner({
      id: property.ownerId,
      name: `${property.ownerName} (${property.ownerAgency || 'Pemilik'})`,
      property,
    });
    setIsChatOpen(true);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInComparison) {
      removeFromComparison(property.id);
    } else {
      addToComparison(property);
    }
  };

  return (
    <div 
      onClick={() => setSelectedProperty(property)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Photo Container */}
      <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
        <img
          src={property.images[currentImgIndex] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {/* Status Badge: Laku vs Belum Laku */}
          {isPropertySold(property.status) ? (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1 border border-white/30 animate-pulse">
              Laku / Terjual
            </span>
          ) : (
            <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.8 rounded-md uppercase tracking-wider shadow-xs">
              Belum Laku
            </span>
          )}

          {/* Promoted 44-Day Badge */}
          {property.isPromoted && (
            <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
              <Crown className="w-3 h-3 text-slate-950 fill-current" />
              Unggulan 44 Hari
            </span>
          )}

          {/* Certificate Badge */}
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.8 rounded-md flex items-center gap-1 border border-white/20">
            <FileCheck className="w-3 h-3 text-emerald-400" />
            {property.certificate}
          </span>

          {/* Listing Type */}
          <span className={`text-[10px] font-bold px-2 py-0.8 rounded-md uppercase tracking-wider ${
            property.listingType === 'jual' ? 'bg-slate-800/90 text-white' : 'bg-blue-600 text-white'
          }`}>
            {property.listingType === 'jual' ? 'Dijual' : 'Disewa'}
          </span>
        </div>

        {/* Top Right Quick Actions: Favorite & Compare */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={handleToggleCompare}
            title={isInComparison ? 'Hapus dari perbandingan' : 'Bandingkan properti ini'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md cursor-pointer ${
              isInComparison
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-slate-700'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            title={isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md cursor-pointer ${
              isFav
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Bar on Image: Photo Counter & Authenticity Meter */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] z-10">
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md font-medium">
            <Eye className="w-3 h-3" />
            {property.images.length} Foto
          </span>

          <span className="flex items-center gap-1 bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-md font-bold text-[10px]">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Otentik {property.authenticityScore}%
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Property Type */}
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {formatRupiah(property.price)}
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded-md">
              {property.propertyType}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {property.title}
          </h4>

          {/* Location */}
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.city}, {property.province}</span>
          </p>

          {/* Key Specifications (LT, LB, KT, KM) */}
          <div className="grid grid-cols-4 gap-1 py-3 my-2.5 border-y border-slate-100 text-slate-700 text-[11px]">
            <div className="text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">LT</span>
              <span className="font-bold">{property.landArea} m²</span>
            </div>
            <div className="text-center border-l border-slate-100">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">LB</span>
              <span className="font-bold">{property.buildingArea > 0 ? `${property.buildingArea} m²` : '-'}</span>
            </div>
            <div className="text-center border-l border-slate-100">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">KT</span>
              <span className="font-bold">{property.bedrooms > 0 ? property.bedrooms : '-'}</span>
            </div>
            <div className="text-center border-l border-slate-100">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">KM</span>
              <span className="font-bold">{property.bathrooms > 0 ? property.bathrooms : '-'}</span>
            </div>
          </div>
        </div>

        {/* Card Footer: Agent Info & Contact Button */}
        <div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                {property.ownerName.slice(0, 1)}
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800 truncate max-w-[120px]">
                  {property.ownerName}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{property.ownerRating || 4.9}</span>
                  {property.ownerAgency && (
                    <span className="text-slate-400 font-normal truncate max-w-[90px]">
                      • {property.ownerAgency}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isPropertySold(property.status) ? (
              <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1">
                Laku / Terjual
              </span>
            ) : (
              <button
                type="button"
                onClick={handleContactAgent}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Hubungi</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
