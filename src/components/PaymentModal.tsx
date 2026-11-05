import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Crown, 
  CreditCard, 
  Copy, 
  Check, 
  Upload, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Send, 
  FileText,
  Building,
  Sparkles
} from 'lucide-react';
import { formatRupiah, calculateDaysRemaining } from '../utils/currency';
import { PremiumPackageType } from '../types';

export const PaymentModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    setIsPaymentModalOpen, 
    paymentPackageSelected, 
    setPaymentPackageSelected,
    currentUser, 
    transactions, 
    submitPaymentReceipt, 
    triggerNotification 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bayar' | 'riwayat'>('bayar');
  const [copied, setCopied] = useState(false);

  // Form states
  const [senderBank, setSenderBank] = useState('Bank BCA');
  const [senderAccountName, setSenderAccountName] = useState(currentUser.displayName || '');
  const [proofImageUrl, setProofImageUrl] = useState(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isPaymentModalOpen) return null;

  const currentPackage = paymentPackageSelected;
  const packagePrice = currentPackage === 'agent_listing_boost' ? 299000 : 149000;
  const daysRemaining = calculateDaysRemaining(currentUser.premiumUntil);

  const bankAccountInfo = {
    bankName: 'Bank CIMB NIAGA',
    accountNumber: '704095513700',
    accountHolder: 'Benisius Rahmat Basuki',
    notificationEmail: 'benisius.rb@gmail.com',
  };

  const handleCopyAccount = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bankAccountInfo.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      triggerNotification('Disalin', 'Nomor rekening CIMB Niaga berhasil disalin.', 'system');
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();

    submitPaymentReceipt({
      packageType: currentPackage,
      amount: packagePrice,
      senderBank,
      senderAccountName,
      proofImageUrl,
    });

    setIsSubmitted(true);
    setActiveTab('riwayat');
  };

  // Filter user's transactions
  const userTransactions = transactions.filter((t) => t.userId === currentUser.uid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center font-bold">
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Fitur Premium Eksklusif (Masa Aktif 44 Hari)
              </h3>
              <p className="text-xs text-slate-500">
                Verifikasi manual resmi via Bank CIMB NIAGA a.n. Benisius Rahmat Basuki
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-white">
          <button
            onClick={() => setActiveTab('bayar')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'bayar'
                ? 'border-amber-600 text-amber-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Pilihan Paket & Transfer Bank
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'riwayat'
                ? 'border-amber-600 text-amber-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Riwayat Transaksi</span>
            {userTransactions.length > 0 && (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {userTransactions.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {activeTab === 'bayar' ? (
            <div className="space-y-6">
              {/* Package Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Pilih Paket Fitur Berbayar (44 Hari Penuh)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Buyer Pass */}
                  <div
                    onClick={() => setPaymentPackageSelected('buyer_contact_pass')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      currentPackage === 'buyer_contact_pass'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900">Akses Kontak Pembeli</span>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        44 HARI
                      </span>
                    </div>
                    <div className="text-lg font-black text-emerald-800">Rp 149.000</div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      Bebas hubungi semua agen & pemilik properti tanpa batas via chat terenkripsi internal selama 44 hari.
                    </p>
                  </div>

                  {/* Agent Boost */}
                  <div
                    onClick={() => setPaymentPackageSelected('agent_listing_boost')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      currentPackage === 'agent_listing_boost'
                        ? 'border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900">Promosi Listing Agen</span>
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        44 HARI
                      </span>
                    </div>
                    <div className="text-lg font-black text-amber-800">Rp 299.000</div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      Listing properti tampil di urutan teratas, badge 'Unggulan Eksklusif', dan lencana Gold Agent selama 44 hari.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Account Destination Box (CIMB NIAGA 704095513700 Benisius Rahmat Basuki) */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-red-500" />
                    <span className="font-black text-sm tracking-wider uppercase">
                      {bankAccountInfo.bankName}
                    </span>
                  </div>
                  <span className="text-[11px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-md">
                    Rekening Resmi Admin
                  </span>
                </div>

                <div className="bg-black/40 rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                      Nomor Rekening Tujuan
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-yellow-400 tracking-wider">
                      {bankAccountInfo.accountNumber}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Atas Nama (Penerima):</span>
                    <strong className="text-white text-sm">{bankAccountInfo.accountHolder}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">Jumlah Transfer:</span>
                    <strong className="text-emerald-400 text-sm font-black">
                      {formatRupiah(packagePrice)}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Setelah diverifikasi admin, notifikasi konfirmasi dikirim otomatis ke email{' '}
                    <strong className="text-yellow-300 font-mono">benisius.rb@gmail.com</strong> dan WhatsApp Anda.
                  </span>
                </div>
              </div>

              {/* Upload Proof Form */}
              <form onSubmit={handleSubmitProof} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    Form Unggah Bukti Transfer
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Verifikasi manual dalam 10-30 menit
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Bank Pengirim *
                    </label>
                    <select
                      value={senderBank}
                      onChange={(e) => setSenderBank(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500 bg-white cursor-pointer"
                    >
                      <option value="Bank BCA">Bank BCA</option>
                      <option value="Bank Mandiri">Bank Mandiri</option>
                      <option value="Bank BRI">Bank BRI</option>
                      <option value="Bank BNI">Bank BNI</option>
                      <option value="Bank CIMB NIAGA">Bank CIMB NIAGA</option>
                      <option value="Bank Permata">Bank Permata</option>
                      <option value="Bank Danamon">Bank Danamon</option>
                      <option value="Bank Jago / Seabank">Bank Digital</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Nama Pemilik Rekening Pengirim *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sesuai nama di mutasi bank"
                      value={senderAccountName}
                      onChange={(e) => setSenderAccountName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500 bg-white"
                    />
                  </div>
                </div>

                {/* Screenshot URL / Upload Preview */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Tautan / Bukti Transfer (Resi ATM / M-Banking) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      placeholder="Tempel URL screenshot struk transfer m-banking..."
                      value={proofImageUrl}
                      onChange={(e) => setProofImageUrl(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
                    />
                    <div className="w-14 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <img src={proofImageUrl} alt="Preview Bukti" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <Upload className="w-4 h-4" />
                  <span>Kirim Bukti Transfer untuk Diverifikasi Admin</span>
                </button>
              </form>
            </div>
          ) : (
            /* Transaction History Log Tab */
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-700">Belum Ada Riwayat Transaksi</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Kirim bukti transfer pembayaran CIMB Niaga untuk melihat status verifikasi di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((trx) => (
                    <div
                      key={trx.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                            #{trx.id}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {trx.packageType === 'buyer_contact_pass'
                              ? 'Paket Kontak Pembeli (44 Hari)'
                              : 'Paket Promosi Agen (44 Hari)'}
                          </span>
                        </div>

                        <span className={`text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          trx.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : trx.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {trx.status === 'approved'
                            ? 'Disetujui (Aktif 44 Hari)'
                            : trx.status === 'rejected'
                            ? 'Ditolak'
                            : 'Menunggu Verifikasi Admin'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl text-slate-600">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Nominal:</span>
                          <strong className="text-slate-900">{formatRupiah(trx.amount)}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Bank Pengirim:</span>
                          <span className="font-medium text-slate-800">{trx.senderBank}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Atas Nama:</span>
                          <span className="font-medium text-slate-800">{trx.senderAccountName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Tanggal:</span>
                          <span className="font-medium text-slate-800">{trx.transferDate}</span>
                        </div>
                      </div>

                      {/* Admin Notes */}
                      {trx.adminNotes && (
                        <p className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                          Catatan Admin: {trx.adminNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
