import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  Home, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  X,
  Compass,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { formatRupiah } from '../utils/currency';

export const HeroSearch: React.FC = () => {
  const { 
    searchFilters, 
    setSearchFilters, 
    resetFilters, 
    setActiveTab, 
    properties 
  } = useApp();

  const [isDeepFilterOpen, setIsDeepFilterOpen] = useState(false);

  const cityOptions = [
    'Semua Wilayah Indonesia',
    'Jakarta Selatan',
    'Jakarta Barat',
    'Jakarta Pusat',
    'Tangerang Selatan',
    'Badung',
    'Surabaya',
    'Bandung',
    'Sleman',
    'Medan',
    'Semarang'
  ];

  const facilityOptions = [
    'Dekat Stasiun MRT / KRL',
    'Akses Pintu Tol',
    'Dekat Mall / Perbelanjaan',
    'Dekat Rumah Sakit Internasional',
    'Dekat Sekolah / Kampus Unggulan',
    'Private Swimming Pool',
    'Keamanan 24 Jam & Smart Home'
  ];

  const handleFacilityToggle = (facility: string) => {
    setSearchFilters((prev: any) => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f: string) => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('search');
  };

  const activeFiltersCount = 
    (searchFilters.city ? 1 : 0) +
    (searchFilters.propertyType ? 1 : 0) +
    (searchFilters.bedrooms > 0 ? 1 : 0) +
    (searchFilters.minPrice > 0 || searchFilters.maxPrice < 30000000000 ? 1 : 0) +
    (searchFilters.facilities.length > 0 ? 1 : 0) +
    (searchFilters.onlyVerified ? 1 : 0) +
    (searchFilters.onlyPromoted ? 1 : 0);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-16 lg:py-24">
      {/* Background Architectural Mesh & Subtle Lighting */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Title & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Portal Properti Resmi #1 dengan Proteksi Data & Legalitas Terverifikasi</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Temukan Properti Impian di <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">Seluruh Indonesia</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Jual, beli, dan sewa rumah, tanah, ruko, apartemen & villa dengan simulasi KPR real-time, analitik harga pasar, dan komunikasi internal yang terenkripsi aman.
          </p>

          {/* Quick Stats Badges */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Dokumen SHM/IMB Terverifikasi
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <Compass className="w-4 h-4 text-teal-400" /> 34 Provinsi Terjangkau
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-400" /> Proteksi Privasi Bebas Spam
            </span>
          </div>
        </div>

        {/* Main Search Box */}
        <div className="bg-white/95 text-slate-900 rounded-2xl shadow-2xl p-4 sm:p-6 backdrop-blur-md border border-white/20 max-w-4xl mx-auto">
          {/* Top Switcher: Beli vs Sewa */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchFilters((prev: any) => ({ ...prev, listingType: 'jual' }))}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  searchFilters.listingType === 'jual'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Beli Properti
              </button>
              <button
                type="button"
                onClick={() => setSearchFilters((prev: any) => ({ ...prev, listingType: 'sewa' }))}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  searchFilters.listingType === 'sewa'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sewa Properti
              </button>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filter ({activeFiltersCount})
              </button>
            )}
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Location Select */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Lokasi / Kota
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={searchFilters.city}
                    onChange={(e) => setSearchFilters((prev: any) => ({ ...prev, city: e.target.value === 'Semua Wilayah Indonesia' ? '' : e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-emerald-500 cursor-pointer"
                  >
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Tipe Properti
                </label>
                <div className="relative">
                  <Home className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={searchFilters.propertyType}
                    onChange={(e) => setSearchFilters((prev: any) => ({ ...prev, propertyType: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-emerald-500 cursor-pointer"
                  >
                    <option value="">Semua Tipe (Rumah, Ruko, Villa)</option>
                    <option value="rumah">Rumah Tapak</option>
                    <option value="apartemen">Apartemen / Kondominium</option>
                    <option value="ruko">Ruko & Komersial</option>
                    <option value="tanah">Tanah Kavling</option>
                    <option value="villa">Villa Eksklusif</option>
                    <option value="gudang">Gudang & Industri</option>
                  </select>
                </div>
              </div>

              {/* Keyword / Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Kata Kunci
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Contoh: Pondok Indah, BSD, Pool"
                    value={searchFilters.keyword}
                    onChange={(e) => setSearchFilters((prev: any) => ({ ...prev, keyword: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-emerald-500"
                  />
                </div>
              </div>

              {/* Search Actions */}
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeepFilterOpen(!isDeepFilterOpen)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isDeepFilterOpen || activeFiltersCount > 0
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Filter Mendalam (Luas Tanah, Fasilitas, Legalitas)"
                >
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                  <span>Filter Detail</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <span>Cari</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Deep Search Drawer (Luas Tanah, Luas Bangunan, Fasilitas Sekitar, Sertifikat) */}
            {isDeepFilterOpen && (
              <div className="pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Price Range */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase">
                        Maksimal Harga
                      </label>
                      <span className="text-xs font-bold text-emerald-700">
                        {formatRupiah(searchFilters.maxPrice, true)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={500000000}
                      max={30000000000}
                      step={500000000}
                      value={searchFilters.maxPrice}
                      onChange={(e) => setSearchFilters((prev: any) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* Luas Tanah (m²) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Min. Luas Tanah (LT m²)
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 100"
                      value={searchFilters.minLT || ''}
                      onChange={(e) => setSearchFilters((prev: any) => ({ ...prev, minLT: Number(e.target.value) }))}
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-emerald-500"
                    />
                  </div>

                  {/* Kamar Tidur */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Min. Kamar Tidur
                    </label>
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setSearchFilters((prev: any) => ({ ...prev, bedrooms: num }))}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            searchFilters.bedrooms === num
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {num === 0 ? 'Semua' : `${num}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sertifikat */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Legalitas Sertifikat
                    </label>
                    <select
                      value={searchFilters.certificate}
                      onChange={(e) => setSearchFilters((prev: any) => ({ ...prev, certificate: e.target.value }))}
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-emerald-500 cursor-pointer"
                    >
                      <option value="">Semua Sertifikat</option>
                      <option value="SHM">SHM (Sertifikat Hak Milik)</option>
                      <option value="HGB">HGB (Hak Guna Bangunan)</option>
                      <option value="Strata Title">Strata Title (Apartemen)</option>
                    </select>
                  </div>
                </div>

                {/* Facilities Checkboxes */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-2">
                    Fasilitas Sekitar & Nilai Tambah
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {facilityOptions.map((fac) => {
                      const isSelected = searchFilters.facilities.includes(fac);
                      return (
                        <button
                          key={fac}
                          type="button"
                          onClick={() => handleFacilityToggle(fac)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          <span>{fac}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Toggle Badges */}
                <div className="flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={searchFilters.onlyVerified}
                      onChange={(e) => setSearchFilters((prev: any) => ({ ...prev, onlyVerified: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Hanya Dokumen Legal Terverifikasi (SHM / PBG)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={searchFilters.onlyPromoted}
                      onChange={(e) => setSearchFilters((prev: any) => ({ ...prev, onlyPromoted: e.target.checked }))}
                      className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500 cursor-pointer"
                    />
                    <span>Hanya Listing Unggulan (Promosi Eksklusif)</span>
                  </label>
                </div>
              </div>
            )}
          </form>

          {/* Quick Popular Tags */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Pencarian Populer:</span>
            {[
              { label: 'Pondok Indah', city: 'Jakarta Selatan', type: 'rumah' },
              { label: 'BSD City', city: 'Tangerang Selatan', type: 'rumah' },
              { label: 'Villa Seminyak', city: 'Badung', type: 'villa' },
              { label: 'Ruko Surabaya', city: 'Surabaya', type: 'ruko' },
              { label: 'Kavling Dago', city: 'Bandung', type: 'tanah' }
            ].map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => {
                  setSearchFilters((prev: any) => ({
                    ...prev,
                    city: tag.city,
                    propertyType: tag.type,
                  }));
                  setActiveTab('search');
                }}
                className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
