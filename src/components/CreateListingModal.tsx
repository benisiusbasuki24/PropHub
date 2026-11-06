import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Building, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { validateListingDescription, evaluatePropertyAuthenticity } from '../utils/moderation';
import { PropertyType, CertificateType } from '../types';

export const CreateListingModal: React.FC = () => {
  const { 
    isCreateListingOpen, 
    setIsCreateListingOpen, 
    addProperty, 
    currentUser,
    triggerNotification
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [propertyType, setPropertyType] = useState<PropertyType>('rumah');
  const [listingType, setListingType] = useState<'jual' | 'sewa'>('jual');
  const [city, setCity] = useState('Jakarta Selatan');
  const [province, setProvince] = useState('DKI Jakarta');
  const [address, setAddress] = useState('');
  const [landArea, setLandArea] = useState<number | ''>(120);
  const [buildingArea, setBuildingArea] = useState<number | ''>(150);
  const [bedrooms, setBedrooms] = useState<number | ''>(3);
  const [bathrooms, setBathrooms] = useState<number | ''>(2);
  const [electricity, setElectricity] = useState<number | ''>(3500);
  const [certificate, setCertificate] = useState<CertificateType>('SHM');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [nearbyFacilityInput, setNearbyFacilityInput] = useState('');
  const [nearbyFacilities, setNearbyFacilities] = useState<string[]>([
    'Dekat Pintu Tol Utama (5 Menit)',
    'Dekat Stasiun KRL / MRT',
    'Keamanan 24 Jam One-Gate System'
  ]);
  const [shmVerified, setShmVerified] = useState(true);
  const [pbgVerified, setPbgVerified] = useState(true);

  // Live moderation evaluation
  const moderationResult = validateListingDescription(description);

  // Live authenticity evaluation
  const authenticityReport = evaluatePropertyAuthenticity({
    title,
    description,
    price: Number(price) || 0,
    landArea: Number(landArea) || 0,
    buildingArea: Number(buildingArea) || 0,
    images,
    certificate,
    shmVerified,
    pbgVerified,
  });

  if (!isCreateListingOpen) return null;

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleAddFacility = () => {
    if (nearbyFacilityInput.trim()) {
      setNearbyFacilities((prev) => [...prev, nearbyFacilityInput.trim()]);
      setNearbyFacilityInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!moderationResult.isValid) {
      triggerNotification('Gagal Menerbitkan Listing', moderationResult.explanation, 'system');
      return;
    }

    if (!title.trim() || !price) {
      triggerNotification('Data Belum Lengkap', 'Judul properti dan harga wajib diisi.', 'system');
      return;
    }

    const res = await addProperty({
      title,
      description,
      price: Number(price),
      propertyType,
      listingType,
      city,
      province,
      address,
      landArea: Number(landArea),
      buildingArea: Number(buildingArea),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      electricity: Number(electricity),
      certificate,
      images,
      nearbyFacilities,
      documentDetails: {
        shmVerified,
        pbgVerified,
        pbbClear: true,
      },
    });

    if (res.success) {
      setIsCreateListingOpen(false);
      // Reset
      setTitle('');
      setDescription('');
    } else {
      triggerNotification('Peringatan Moderasi', res.error || 'Terjadi kesalahan.', 'system');
    }
  };

  // Helper sample image filler for fast user testing
  const handleUseSamplePhotos = () => {
    setImages([
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h3 className="text-base font-black text-slate-900">Pasang Iklan Properti Baru</h3>
            <p className="text-xs text-slate-500">
              Listing Anda akan diperiksa moderasi otomatis untuk perlindungan privasi.
            </p>
          </div>
          <button
            onClick={() => setIsCreateListingOpen(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {/* Authenticity Live Meter Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                {authenticityReport.score}%
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-950">
                  Estimasi Skor Keaslian: {authenticityReport.level}
                </h4>
                <p className="text-[11px] text-emerald-800">
                  {authenticityReport.passedChecks.length} indikator keabsahan data terpenuhi.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase">
              Verifikasi Sistem
            </span>
          </div>

          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Judul Listing Properti *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Rumah Minimalis 2 Lantai Siap Huni di BSD City"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tipe Properti *
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500 cursor-pointer"
              >
                <option value="rumah">Rumah</option>
                <option value="apartemen">Apartemen</option>
                <option value="ruko">Ruko</option>
                <option value="tanah">Tanah</option>
                <option value="villa">Villa</option>
                <option value="gudang">Gudang</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tujuan Listing *
              </label>
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value as 'jual' | 'sewa')}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500 cursor-pointer"
              >
                <option value="jual">Dijual</option>
                <option value="sewa">Disewa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Harga Properti (IDR) *
              </label>
              <input
                type="number"
                required
                placeholder="Contoh: 2500000000"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Legalitas Sertifikat *
              </label>
              <select
                value={certificate}
                onChange={(e) => setCertificate(e.target.value as CertificateType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500 cursor-pointer"
              >
                <option value="SHM">SHM (Sertifikat Hak Milik)</option>
                <option value="HGB">HGB (Hak Guna Bangunan)</option>
                <option value="Strata Title">Strata Title</option>
                <option value="Girik">Girik / Adat</option>
                <option value="PPJB">PPJB</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Kota / Kabupaten *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Jakarta Selatan, Surabaya, Badung"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Provinsi *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: DKI Jakarta, Banten, Bali, Jawa Timur"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Alamat Lengkap / Klaster
              </label>
              <input
                type="text"
                placeholder="Contoh: Jl. Metro Pondok Indah Blok K, Kebayoran Lama"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-emerald-500"
              />
            </div>
          </div>

          {/* CRITICAL: Description Field with Live Moderation Protection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 uppercase">
                Deskripsi Lengkap Properti *
              </label>
              <span className="text-[10px] text-slate-500">
                Dilindungi Sistem Moderasi Otomatis
              </span>
            </div>

            <textarea
              rows={4}
              required
              placeholder="Deskripsikan keunggulan arsitektur, lingkungan, pencahayaan alami, fasilitas penunjang. (Dilarang menuliskan nomor telepon, WhatsApp, atau email langsung demi keamanan & privasi)."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 rounded-2xl border text-xs font-medium focus:outline-hidden transition-all ${
                !moderationResult.isValid
                  ? 'border-rose-500 bg-rose-50/50 text-slate-900 ring-2 ring-rose-500/20'
                  : 'border-slate-300 focus:border-emerald-500 bg-white'
              }`}
            />

            {/* Moderation Warning Banner */}
            {!moderationResult.isValid ? (
              <div className="bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl p-4 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-rose-900">
                      Penulisan Kontak Terdeteksi: Sistem Menolak Penerbitan!
                    </h5>
                    <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                      Sistem ProperListId otomatis menolak pencantuman nomor telepon (misal: 08xx / WhatsApp) dan alamat email di dalam deskripsi iklan. Hal ini dirancang untuk menjaga privasi kedua belah pihak dan memastikan semua interaksi terlindungi oleh sistem enkripsi Obrolan Langsung internal.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-rose-700">Terdeteksi:</span>
                      {moderationResult.flaggedTerms.map((term, i) => (
                        <span key={i} className="bg-rose-200 text-rose-900 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold">
                          "{term}"
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Deskripsi aman dan mematuhi kebijakan privasi ProperListId.</span>
              </div>
            )}
          </div>

          {/* Building Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Luas Tanah (m²)
              </label>
              <input
                type="number"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Luas Bangunan (m²)
              </label>
              <input
                type="number"
                value={buildingArea}
                onChange={(e) => setBuildingArea(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Kamar Tidur
              </label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Kamar Mandi
              </label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Listrik (Watt)
              </label>
              <input
                type="number"
                value={electricity}
                onChange={(e) => setElectricity(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Photo Gallery Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 uppercase">
                Galeri Foto Properti ({images.length} Foto)
              </label>
              <button
                type="button"
                onClick={handleUseSamplePhotos}
                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
              >
                + Gunakan Foto Arsitektur Resolusi Tinggi
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Tempel tautan URL gambar foto properti..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Tambah
              </button>
            </div>

            {/* Photo Preview Strip */}
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 group">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Document Verification Checklist */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase">
              Kelengkapan Berkas & Legalitas
            </h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={shmVerified}
                  onChange={(e) => setShmVerified(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                />
                <span>Sertifikat Hak Milik (SHM) Siap Ditunjukkan</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={pbgVerified}
                  onChange={(e) => setPbgVerified(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                />
                <span>Izin PBG / IMB Terlampir</span>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateListingOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={!moderationResult.isValid}
              className={`px-6 py-2.5 rounded-xl text-xs font-black text-white shadow-lg transition-all flex items-center gap-2 ${
                !moderationResult.isValid
                  ? 'bg-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/30 cursor-pointer hover:scale-105'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Terbitkan Listing Properti</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
