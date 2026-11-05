import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calculator, 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  ShieldCheck, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { formatRupiah, calculateKPR } from '../utils/currency';
import { KprStatus } from '../types';

export const KprCalculatorModal: React.FC = () => {
  const { 
    isKprModalOpen, 
    setIsKprModalOpen, 
    selectedProperty, 
    currentUser, 
    kprApplications, 
    submitKprApplication, 
    triggerNotification 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'simulasi' | 'tracking'>('simulasi');

  // Calculator states
  const initialPrice = selectedProperty ? selectedProperty.price : 2000000000;
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice);
  const [dpPercentage, setDpPercentage] = useState<number>(20);
  const [tenorYears, setTenorYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [selectedBank, setSelectedBank] = useState<string>('Bank CIMB NIAGA');

  // Application form states
  const [applicantName, setApplicantName] = useState(currentUser.displayName || '');
  const [applicantPhone, setApplicantPhone] = useState(currentUser.phone || '081234567890');
  const [applicantEmail, setApplicantEmail] = useState(currentUser.email || 'benisius.rb@gmail.com');
  const [applicantIncome, setApplicantIncome] = useState<number>(35000000);

  if (!isKprModalOpen) return null;

  const downPayment = Math.round((propertyPrice * dpPercentage) / 100);
  const kprResult = calculateKPR(propertyPrice, downPayment, tenorYears, interestRate);

  const bankPresets = [
    { name: 'Bank CIMB NIAGA', rate: 6.50, promo: 'Fixed 3 Thn' },
    { name: 'Bank BCA', rate: 6.25, promo: 'Fixed 2 Thn' },
    { name: 'Bank Mandiri', rate: 5.88, promo: 'Fixed 1 Thn' },
    { name: 'Bank BRI', rate: 6.40, promo: 'Fixed 3 Thn' },
    { name: 'Bank BTN', rate: 6.75, promo: 'Spesialis KPR' },
  ];

  const handleBankSelect = (bank: typeof bankPresets[0]) => {
    setSelectedBank(bank.name);
    setInterestRate(bank.rate);
  };

  const handleApplyKpr = (e: React.FormEvent) => {
    e.preventDefault();

    submitKprApplication({
      userId: currentUser.uid,
      applicantName,
      applicantPhone,
      applicantEmail,
      applicantIncome: Number(applicantIncome),
      propertyId: selectedProperty ? selectedProperty.id : 'prop-general',
      propertyTitle: selectedProperty ? selectedProperty.title : 'KPR Umum Properti Pilihan',
      propertyCity: selectedProperty ? selectedProperty.city : 'Jakarta Selatan',
      propertyPrice,
      downPayment,
      loanAmount: kprResult.loanPrincipal,
      tenorYears,
      interestRate,
      bankPreference: selectedBank,
      monthlyInstallment: kprResult.monthlyInstallment,
    });

    setActiveTab('tracking');
  };

  // Status step configuration
  const steps: { key: KprStatus; label: string; desc: string }[] = [
    { key: 'diajukan', label: '1. Diajukan', desc: 'Permohonan KPR online diterima' },
    { key: 'verifikasi_berkas', label: '2. Verifikasi Berkas', desc: 'Analisis KTP, NPWP & slip gaji' },
    { key: 'slik_ojk', label: '3. BI Checking / SLIK', desc: 'Cek kolektibilitas perbankan' },
    { key: 'appraisal', label: '4. Penilaian Appraisal', desc: 'Survei taksasi harga pasar' },
    { key: 'disetujui', label: '5. Disetujui (SPK)', desc: 'Surat Keputusan Kredit terbit' },
  ];

  const getStepIndex = (status: KprStatus) => {
    if (status === 'ditolak') return -1;
    return steps.findIndex((s) => s.key === status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Simulasi & Pengajuan KPR Online</h3>
              <p className="text-xs text-slate-500">
                Hitung angsuran, bandingkan bunga bank, dan pantau status berkas real-time.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsKprModalOpen(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-white">
          <button
            onClick={() => setActiveTab('simulasi')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'simulasi'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Kalkulator Angsuran
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tracking'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Pelacakan Status Pengajuan</span>
            {kprApplications.length > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {kprApplications.length}
              </span>
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6">
          {activeTab === 'simulasi' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Sliders & Inputs */}
              <div className="lg:col-span-7 space-y-5">
                {/* Bank Presets */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Pilih Bank Rekanan KPR
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {bankPresets.map((b) => (
                      <button
                        key={b.name}
                        type="button"
                        onClick={() => handleBankSelect(b)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedBank === b.name
                            ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-800 truncate">{b.name}</p>
                        <div className="flex items-center justify-between mt-1 text-[11px]">
                          <span className="font-extrabold text-emerald-700">{b.rate}% p.a.</span>
                          <span className="text-[10px] text-slate-400">{b.promo}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Price */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Harga Properti
                    </label>
                    <span className="text-sm font-black text-slate-900">
                      {formatRupiah(propertyPrice)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={200000000}
                    max={25000000000}
                    step={50000000}
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Rp 200 Juta</span>
                    <span>Rp 25 Miliar</span>
                  </div>
                </div>

                {/* Down Payment (DP) */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Uang Muka (DP {dpPercentage}%)
                    </label>
                    <span className="text-sm font-black text-emerald-700">
                      {formatRupiah(downPayment)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={dpPercentage}
                    onChange={(e) => setDpPercentage(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>10% (Minimal)</span>
                    <span>30%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Tenor Years */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Jangka Waktu Pinjaman (Tenor)
                    </label>
                    <span className="text-sm font-black text-slate-900">
                      {tenorYears} Tahun ({tenorYears * 12} Bulan)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={tenorYears}
                    onChange={(e) => setTenorYears(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>5 Tahun</span>
                    <span>15 Tahun</span>
                    <span>30 Tahun</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Suku Bunga KPR Tahunan
                    </label>
                    <span className="text-sm font-black text-slate-900">
                      {interestRate}% per tahun
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={12}
                    step={0.25}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Column: Calculation Result Card & Quick Apply Form */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 shadow-xl border border-slate-800 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Estimasi Angsuran Bulanan
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                      {formatRupiah(kprResult.monthlyInstallment)}
                      <span className="text-xs text-slate-400 font-normal"> / bulan</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Plafon Pokok Pinjaman:</span>
                      <span className="font-bold text-white">{formatRupiah(kprResult.loanPrincipal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Bunga ({tenorYears} thn):</span>
                      <span className="font-bold text-white">{formatRupiah(kprResult.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Pembayaran:</span>
                      <span className="font-bold text-white">{formatRupiah(kprResult.totalPayment)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-800 text-emerald-400">
                      <span>Rekomendasi Gaji Bersih:</span>
                      <span className="font-black">{formatRupiah(kprResult.minimumIncomeRecommended)}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-3 text-[11px] text-emerald-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Perhitungan menganut rasio DSR (Debt Service Ratio) aman OJK maksimal 35% dari penghasilan.</span>
                  </div>
                </div>

                {/* Instant Online Apply Form */}
                <form onSubmit={handleApplyKpr} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    Ajukan KPR Bebas Ribet
                  </h4>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Nama Lengkap Pemohon
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Nomor WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Gaji Bersih / Bulan
                      </label>
                      <input
                        type="number"
                        required
                        value={applicantIncome}
                        onChange={(e) => setApplicantIncome(Number(e.target.value))}
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-transform hover:scale-[1.02]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Pengajuan KPR Online</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* KPR Application Status Tracking Tab */
            <div className="space-y-6">
              {kprApplications.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-700">Belum Ada Pengajuan KPR Aktif</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Gunakan tab "Kalkulator Angsuran" untuk menghitung simulasi dan mengirimkan pengajuan berkas KPR ke bank rekanan kami.
                  </p>
                  <button
                    onClick={() => setActiveTab('simulasi')}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Buka Kalkulator KPR
                  </button>
                </div>
              ) : (
                kprApplications.map((app) => {
                  const currentIdx = getStepIndex(app.status);
                  return (
                    <div
                      key={app.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                              ID: #{app.id}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {app.propertyTitle}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Bank Pilihan: <strong>{app.bankPreference}</strong> • Angsuran: <strong>{formatRupiah(app.monthlyInstallment)}/bln</strong>
                          </p>
                        </div>

                        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                          app.status === 'disetujui'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'ditolak'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Timeline Steps Visualization */}
                      <div className="py-2">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {steps.map((st, idx) => {
                            const isDone = currentIdx >= idx;
                            const isCurrent = currentIdx === idx;
                            return (
                              <div
                                key={st.key}
                                className={`p-3 rounded-xl border transition-all ${
                                  isCurrent
                                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                                    : isDone
                                    ? 'border-emerald-200 bg-emerald-50/30'
                                    : 'border-slate-200 bg-slate-50 opacity-60'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 mb-1">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                  <span className={`text-xs font-bold truncate ${
                                    isDone ? 'text-emerald-900' : 'text-slate-600'
                                  }`}>
                                    {st.label}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight">
                                  {st.desc}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Status History Logs */}
                      <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs">
                        <h5 className="font-bold text-slate-700 text-[11px] uppercase">
                          Riwayat Pembaruan Berkas
                        </h5>
                        {app.statusHistory.map((h, i) => (
                          <div key={i} className="flex items-start gap-2 text-slate-600 text-[11px]">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{h.note}</span>
                            <span className="text-[10px] text-slate-400 ml-auto">
                              {new Date(h.timestamp).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
