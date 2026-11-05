import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  MapPin, 
  AlertCircle, 
  BellRing, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { formatRupiah } from '../utils/currency';

export const MarketAnalyticsView: React.FC = () => {
  const { marketTrends, triggerNotification } = useApp();

  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const [alertThreshold, setAlertThreshold] = useState<number>(5);
  const [subscribedCity, setSubscribedCity] = useState<string>('Badung (Canggu & Seminyak)');

  const currentTrend = marketTrends[selectedRegionIndex] || marketTrends[0];

  const handleSubscribeAlert = (e: React.FormEvent) => {
    e.preventDefault();
    triggerNotification(
      'Langganan Notifikasi Harga Aktif!',
      `Sistem otomatis akan mengirimkan notifikasi instan bila harga properti di "${subscribedCity}" mengalami pergeseran di atas ${alertThreshold}%.`,
      'price_alert',
      'market'
    );
  };

  const handleTriggerSimulatedSpike = (trend: typeof marketTrends[0]) => {
    triggerNotification(
      `Peringatan Perubahan Harga Signifikan: ${trend.city}!`,
      `Rata-rata harga properti di ${trend.city} melonjak +${trend.quarterlyGrowthPercent}% dalam kuartal ini (saat ini ${formatRupiah(trend.averagePricePerM2)}/m²). Peluang investasi bagi pemilik dan calon pembeli!`,
      'price_alert',
      'market'
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Indeks Harga Pasar Properti Nasional (Indonesia Real Estate Index)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Dasbor Analitik Tren Harga Pasar Properti Indonesia
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Data harga pasar per meter persegi (m²) real-time dari 34 provinsi di Indonesia untuk membantu Anda mengambil keputusan beli, jual, dan investasi properti secara objektif.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <BarChart3 className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Grid: Regional Overview & Interactive City Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Region List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Pilih Wilayah / Kota Riset</span>
          </h3>

          <div className="space-y-2">
            {marketTrends.map((trend, idx) => {
              const isSelected = selectedRegionIndex === idx;
              return (
                <div
                  key={trend.city}
                  onClick={() => setSelectedRegionIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {trend.province}
                    </span>
                    <h4 className="font-black text-slate-900 text-sm">{trend.city}</h4>
                    <p className="text-xs text-emerald-700 font-extrabold mt-0.5">
                      {formatRupiah(trend.averagePricePerM2)} / m²
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-0.5 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      +{trend.quarterlyGrowthPercent}%
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      {trend.transactionVolume} Transaksi
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Chart & Trend Analysis of Selected Region */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Analisis Mendalam Wilayah
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {currentTrend.city} ({currentTrend.province})
                </h3>
              </div>

              <button
                onClick={() => handleTriggerSimulatedSpike(currentTrend)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                title="Kirim notifikasi otomatis lonjakan harga wilayah ini ke pengguna"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Uji Notifikasi Otomatis</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Rata-rata / m²</span>
                <span className="text-base font-black text-slate-900">
                  {formatRupiah(currentTrend.averagePricePerM2, true)}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Pertumbuhan Kuartal</span>
                <span className="text-base font-black text-emerald-700">
                  +{currentTrend.quarterlyGrowthPercent}%
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Paling Dicari</span>
                <span className="text-base font-black text-indigo-700 uppercase">
                  {currentTrend.topDemandType}
                </span>
              </div>
            </div>

            {/* Visual Historical Price Growth Bar Representation */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Riwayat Kenaikan Harga Pasar (4 Kuartal Terakhir)
              </h4>

              <div className="space-y-2.5">
                {currentTrend.priceTrendHistory.map((item) => {
                  const maxPrice = 36000000;
                  const percentage = Math.min(100, Math.round((item.avgM2 / maxPrice) * 100));
                  return (
                    <div key={item.period} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{item.period}</span>
                        <span>{formatRupiah(item.avgM2)} / m²</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smart Market Insight Note */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Insight AI Pasar GoProperty:</span>
                <p className="mt-0.5 text-indigo-800 leading-relaxed">
                  Permintaan di wilayah {currentTrend.city} dipicu oleh ekspansi infrastruktur transportasi dan sentimen investasi properti sewa komersial. Kenaikan +{currentTrend.quarterlyGrowthPercent}% melampaui rata-rata inflasi nasional.
                </p>
              </div>
            </div>
          </div>

          {/* Form: Automated Price Drop / Spike Alerts Subscription */}
          <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  Pasang Notifikasi Otomatis Perubahan Harga
                </h4>
                <p className="text-xs text-slate-500">
                  Dapatkan sinyal instan saat harga properti di wilayah target Anda berubah secara signifikan.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubscribeAlert} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Wilayah Pilihan
                </label>
                <select
                  value={subscribedCity}
                  onChange={(e) => setSubscribedCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500 bg-white cursor-pointer"
                >
                  {marketTrends.map((t) => (
                    <option key={t.city} value={t.city}>{t.city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Batas Toleransi Perubahan
                </label>
                <select
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500 bg-white cursor-pointer"
                >
                  <option value={3}>Perubahan &gt; 3%</option>
                  <option value={5}>Perubahan &gt; 5% (Direkomendasikan)</option>
                  <option value={10}>Perubahan &gt; 10% (Signifikan)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer transition-colors"
                >
                  Aktifkan Notifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
