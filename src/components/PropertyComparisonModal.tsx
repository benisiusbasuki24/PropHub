import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ArrowLeftRight, 
  Trash2, 
  Check, 
  ShieldCheck, 
  Calculator, 
  ExternalLink,
  MessageSquare,
  Building2
} from 'lucide-react';
import { formatRupiah, calculateKPR } from '../utils/currency';

export const PropertyComparisonModal: React.FC = () => {
  const { 
    comparisonList, 
    removeFromComparison, 
    clearComparison, 
    setSelectedProperty,
    setIsChatOpen,
    setActiveChatPartner,
    currentUser,
    setIsPaymentModalOpen,
    setPaymentPackageSelected,
    triggerNotification
  } = useApp();

  if (comparisonList.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-lg mx-auto shadow-sm">
        <ArrowLeftRight className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Belum Ada Properti yang Dibandingkan</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Klik ikon bandingkan (<ArrowLeftRight className="w-3 h-3 inline mx-0.5 text-emerald-600" />) pada kartu properti untuk membandingkan spesifikasi hingga 3 properti sekaligus.
        </p>
      </div>
    );
  }

  const handleContact = (property: typeof comparisonList[0]) => {
    if (!currentUser.isPremium && currentUser.role === 'buyer') {
      setPaymentPackageSelected('buyer_contact_pass');
      setIsPaymentModalOpen(true);
      triggerNotification(
        'Akses Kontak 44 Hari',
        'Aktifkan paket 44 hari untuk menghubungi agen.',
        'transaction',
        'premium'
      );
      return;
    }
    setActiveChatPartner({
      id: property.ownerId,
      name: `${property.ownerName} (${property.ownerAgency || 'Pemilik'})`,
      property,
    });
    setIsChatOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-black text-slate-900">
            Perbandingan Properti ({comparisonList.length} dari 3 Properti)
          </h2>
        </div>

        <button
          onClick={clearComparison}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Kosongkan Semua</span>
        </button>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-48 font-bold text-slate-500 uppercase tracking-wider">
                Parameter Properti
              </th>
              {comparisonList.map((item) => (
                <th key={item.id} className="p-4 min-w-[240px] align-top">
                  <div className="relative group rounded-xl overflow-hidden aspect-16/10 mb-2 bg-slate-900">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFromComparison(item.id)}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
                      title="Hapus dari perbandingan"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">{item.city}, {item.province}</p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* Harga */}
            <tr>
              <td className="p-3.5 font-bold text-slate-600 bg-slate-50/50">Harga Properti</td>
              {comparisonList.map((item) => (
                <td key={item.id} className="p-3.5 font-black text-slate-900 text-sm">
                  {formatRupiah(item.price)}
                </td>
              ))}
            </tr>

            {/* Estimasi KPR */}
            <tr>
              <td className="p-3.5 font-bold text-slate-600 bg-slate-50/50">Estimasi Cicilan KPR (20 Thn)</td>
              {comparisonList.map((item) => {
                const kpr = calculateKPR(item.price, item.price * 0.2, 20, 6.5);
                return (
                  <td key={item.id} className="p-3.5 font-bold text-emerald-700">
                    {formatRupiah(kpr.monthlyInstallment)} / bln
                  </td>
                );
              })}
            </tr>

            {/* Tipe & Status */}
            <tr>
              <td className="p-3.5 font-bold text-slate-600 bg-slate-50/50">Tipe & Status</td>
              {comparisonList.map((item) => (
                <td key={item.id} className="p-3.5 capitalize font-medium text-slate-800">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase mr-1">
                    {item.propertyType}
                  </span>
                  <span>{item.listingType === 'jual' ? 'Dijual' : 'Disewa'}</span>
                </td>
              ))}
            </tr>

            {/* Luas Tanah */}
            <tr>
              <td className="p-3.5 font-bold text-slate-600 bg-slate-50/50">Luas Tanah (LT)</td>
              {comparisonList.map((item) => (
                <td key={item.id} className="p-3.5 font-bold text-slate-800">
                  {item.landArea} m²
                </td>
              ))}
            </tr>

            {/* Luas Bangunan */}
            <tr>
              <td className="p-3.5 font-bold text-slate-600 bg-slate-50/50">Luas Bangunan (LB)</td>
              {comparisonList.map((item) => (
                <td key={item.id} className="p-3.5 font-bold text-slate-800">
                  {item.buildingArea > 0 ? `${item.buildingArea} m²` : 'N/A (Tanah)'}
                </td>
              ))}
            </tr>

            {/* Kamar Tidur & Mandi */}
            <tr>
              <td className="p-3.5 font-bold text-slate-600 bg-slate-50/50">Kamar Tidur / Mandi</td>
              {comparisonList.map((item) => (
                <td key={item.id} className="p-3.5 text-slate-800 font-medium">
                  {item.bedrooms} KT / {item.bathrooms} KM
                </td>
              ))}
            </tr>

            {/* Legalitas Sertifikat */}
            <tr>
              <td className="p-3.5 font-bold text-slate-600 bg-slate-50/50">Legalitas Sertifikat</td>
              {comparisonList.map((item) => (
                <td key={item.id} className="p-3.5">
                  <span className="bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-md">
                    {item.certificate}
                  </span>
                </td>
              ))}
            </tr>

            {/* Skor Keaslian */}
            <tr>
              <td className="p-3.5 font-bold text-slate-600 bg-slate-50/50">Skor Otentisitas</td>
              {comparisonList.map((item) => (
                <td key={item.id} className="p-3.5">
                  <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {item.authenticityScore}% Terverifikasi
                  </span>
                </td>
              ))}
            </tr>

            {/* Fasilitas Sekitar */}
            <tr>
              <td className="p-3.5 font-bold text-slate-600 bg-slate-50/50">Fasilitas Utama</td>
              {comparisonList.map((item) => (
                <td key={item.id} className="p-3.5 space-y-1">
                  {item.nearbyFacilities.slice(0, 3).map((f, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Tindakan */}
            <tr className="bg-slate-50/50">
              <td className="p-3.5 font-bold text-slate-600">Aksi Lanjutan</td>
              {comparisonList.map((item) => (
                <td key={item.id} className="p-3.5 space-y-2">
                  <button
                    onClick={() => setSelectedProperty(item)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lihat Detail Lengkap</span>
                  </button>

                  <button
                    onClick={() => handleContact(item)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Hubungi Agen</span>
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
