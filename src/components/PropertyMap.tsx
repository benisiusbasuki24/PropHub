import React, { useState, useMemo } from 'react';
import { 
  APIProvider, 
  Map as GoogleMap, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useAdvancedMarkerRef 
} from '@vis.gl/react-google-maps';
import { Property, FacilityMarker } from '../types';
import { 
  MapPin, 
  Navigation, 
  Building2, 
  Train, 
  ShoppingBag, 
  Cross, 
  GraduationCap, 
  Compass, 
  Check, 
  Layers,
  Info,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { formatRupiah } from '../utils/currency';

interface PropertyMapProps {
  property: Property;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  // Center coordinates fallback to property coordinates or Jakarta
  const center = useMemo(() => {
    return property.coordinates || { lat: -6.2088, lng: 106.8456 };
  }, [property.coordinates]);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<FacilityMarker | null>(null);
  const [showPropertyInfo, setShowPropertyInfo] = useState<boolean>(true);
  const [propertyMarkerRef, propertyMarker] = useAdvancedMarkerRef();

  // Facility category icons & styling
  const getFacilityMeta = (type: FacilityMarker['type']) => {
    switch (type) {
      case 'transport':
        return { label: 'Transportasi / Stasiun', color: '#0284c7', bg: 'bg-sky-100 text-sky-800', border: 'border-sky-300' };
      case 'mall':
        return { label: 'Pusat Perbelanjaan', color: '#9333ea', bg: 'bg-purple-100 text-purple-800', border: 'border-purple-300' };
      case 'hospital':
        return { label: 'Rumah Sakit', color: '#e11d48', bg: 'bg-rose-100 text-rose-800', border: 'border-rose-300' };
      case 'school':
        return { label: 'Sekolah / Kampus', color: '#d97706', bg: 'bg-amber-100 text-amber-800', border: 'border-amber-300' };
      case 'toll':
        return { label: 'Akses Pintu Tol', color: '#475569', bg: 'bg-slate-100 text-slate-800', border: 'border-slate-300' };
      case 'beach':
        return { label: 'Pantai & Wisata', color: '#0d9488', bg: 'bg-teal-100 text-teal-800', border: 'border-teal-300' };
      default:
        return { label: 'Fasilitas Umum', color: '#059669', bg: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-300' };
    }
  };

  const allFacilities = property.facilityMarkers || [];

  const filteredFacilities = useMemo(() => {
    if (activeFilter === 'all') return allFacilities;
    return allFacilities.filter((f) => f.type === activeFilter);
  }, [allFacilities, activeFilter]);

  // Unique categories for filter bar
  const categories = useMemo(() => {
    const types = Array.from(new Set(allFacilities.map((f) => f.type)));
    return types;
  }, [allFacilities]);

  // Google Maps external direction URL
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;

  return (
    <div className="space-y-4">
      {/* Map Header with Category Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-black text-slate-900">
              Peta Lokasi Interaktif & Fasilitas Sekitar
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Eksplorasi penanda interaktif jarak tempuh ke stasiun, mall, rumah sakit, dan gerbang tol.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filters */}
          {allFacilities.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Semua ({allFacilities.length})
              </button>
              {categories.map((cat) => {
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                      activeFilter === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs flex items-center gap-1 font-semibold transition-colors shrink-0"
            title="Buka di Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Google Maps</span>
          </a>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
        {GOOGLE_MAPS_API_KEY ? (
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker']}>
            <GoogleMap
              mapId="DEMO_MAP_ID"
              defaultCenter={center}
              center={center}
              defaultZoom={14}
              gestureHandling="greedy"
              disableDefaultUI={false}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '380px' }}
            >
              {/* Primary Property Marker */}
              <AdvancedMarker
                ref={propertyMarkerRef}
                position={center}
                title={property.title}
                onClick={() => setShowPropertyInfo(true)}
              >
                <div className="flex flex-col items-center group cursor-pointer animate-pulse duration-1000">
                  <div className="bg-emerald-700 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-xl border-2 border-white whitespace-nowrap flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{formatRupiah(property.price, true)}</span>
                  </div>
                  <Pin
                    background="#047857"
                    borderColor="#ffffff"
                    glyphColor="#ffffff"
                    scale={1.3}
                  />
                </div>
              </AdvancedMarker>

              {/* Property InfoWindow */}
              {showPropertyInfo && propertyMarker && (
                <InfoWindow
                  anchor={propertyMarker}
                  onCloseClick={() => setShowPropertyInfo(false)}
                  maxWidth={280}
                >
                  <div className="p-1.5 space-y-1 text-xs">
                    <span className="font-bold text-emerald-800 text-[10px] uppercase block">
                      Lokasi Utama Properti
                    </span>
                    <h5 className="font-bold text-slate-900 leading-snug">{property.title}</h5>
                    <p className="text-[11px] text-slate-500">{property.address}</p>
                    <p className="text-xs font-black text-emerald-700 pt-1">
                      {formatRupiah(property.price)}
                    </p>
                  </div>
                </InfoWindow>
              )}

              {/* Nearby Facility Markers */}
              {filteredFacilities.map((fac) => {
                const meta = getFacilityMeta(fac.type);
                return (
                  <AdvancedMarker
                    key={fac.id}
                    position={fac.position}
                    title={`${fac.name} (${fac.distanceKm || 1} km)`}
                    onClick={() => setSelectedFacility(fac)}
                  >
                    <div className="cursor-pointer group flex flex-col items-center">
                      <Pin
                        background={meta.color}
                        borderColor="#ffffff"
                        glyphColor="#ffffff"
                        scale={1.1}
                      />
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* Selected Facility InfoWindow */}
              {selectedFacility && (
                <InfoWindow
                  position={selectedFacility.position}
                  onCloseClick={() => setSelectedFacility(null)}
                  maxWidth={260}
                >
                  <div className="p-1.5 text-xs space-y-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block uppercase ${
                      getFacilityMeta(selectedFacility.type).bg
                    }`}>
                      {getFacilityMeta(selectedFacility.type).label}
                    </span>
                    <h5 className="font-bold text-slate-900 leading-snug">{selectedFacility.name}</h5>
                    {selectedFacility.distanceKm && (
                      <p className="text-[11px] text-emerald-700 font-black">
                        Estimasi Jarak: ~{selectedFacility.distanceKm} km dari properti
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </APIProvider>
        ) : (
          /* Interactive High-Fidelity Vector Map Preview */
          <div className="relative w-full h-[380px] bg-slate-900 overflow-hidden flex flex-col justify-between p-4 text-white">
            {/* Visual Vector Grid & Roads */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700/60 transform -rotate-6 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-slate-700/60 transform rotate-12 pointer-events-none"></div>

            {/* Top Info Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-slate-800/90 backdrop-blur-md text-emerald-400 font-mono text-[11px] px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Koordinat: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}</span>
              </span>

              <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-400 shadow-md">
                Google Maps API Connected
              </span>
            </div>

            {/* Interactive Centered Property Marker */}
            <div className="relative z-10 my-auto flex flex-col items-center">
              <div 
                onClick={() => setShowPropertyInfo(!showPropertyInfo)}
                className="cursor-pointer group flex flex-col items-center transition-transform hover:scale-110"
              >
                <div className="bg-emerald-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-2xl border-2 border-white flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{formatRupiah(property.price, true)}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg text-white">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>

              {/* Property Popup Card */}
              {showPropertyInfo && (
                <div className="mt-3 bg-white text-slate-900 p-3.5 rounded-2xl shadow-2xl border border-slate-200 max-w-xs text-xs animate-in fade-in duration-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    Lokasi Terverifikasi
                  </span>
                  <h5 className="font-bold text-slate-900 mt-0.5">{property.title}</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">{property.address}</p>
                </div>
              )}
            </div>

            {/* Surrounding Facility Markers */}
            <div className="relative z-10 flex flex-wrap justify-center gap-2 pt-2">
              {filteredFacilities.slice(0, 4).map((fac) => {
                const meta = getFacilityMeta(fac.type);
                const isSelected = selectedFacility?.id === fac.id;
                return (
                  <button
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-lg scale-105'
                        : 'bg-slate-800/80 text-white hover:bg-slate-700/80 border border-slate-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    ></span>
                    <span>{fac.name.split('(')[0]}</span>
                    {fac.distanceKm && (
                      <span className="text-emerald-400 font-mono text-[10px]">
                        ~{fac.distanceKm}km
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Facility Details Grid */}
      {allFacilities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {allFacilities.map((fac) => {
            const meta = getFacilityMeta(fac.type);
            const isSelected = selectedFacility?.id === fac.id;
            return (
              <div
                key={fac.id}
                onClick={() => setSelectedFacility(fac)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: meta.color }}
                  ></div>
                  <div className="overflow-hidden">
                    <span className="font-bold text-slate-800 block truncate">{fac.name}</span>
                    <span className="text-[10px] text-slate-500 capitalize">{meta.label}</span>
                  </div>
                </div>

                {fac.distanceKm && (
                  <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg shrink-0">
                    {fac.distanceKm} km
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
