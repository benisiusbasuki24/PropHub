import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  FileCheck, 
  CreditCard, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Search, 
  Crown, 
  AlertTriangle,
  Building,
  Check,
  X,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { formatRupiah, calculateDaysRemaining } from '../utils/currency';
import { KprStatus, Property, UserRole, PropertyStatus, isPropertySold, getPropertyStatusInfo } from '../types';

export const SuperadminDashboard: React.FC = () => {
  const { 
    currentUser, 
    allUsers,
    properties, 
    updateProperty, 
    togglePropertyStatus,
    deleteProperty, 
    transactions, 
    verifyTransaction, 
    kprApplications, 
    updateKprStatus, 
    toggleAgentVerification,
    toggleUserPremium,
    deleteUserAccount,
    triggerNotification,
    setSelectedProperty 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pembayaran' | 'listing' | 'users' | 'kpr' | 'statistik'>('pembayaran');
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editStatus, setEditStatus] = useState<PropertyStatus>('active');
  const [listingStatusFilter, setListingStatusFilter] = useState<'all' | 'belum_laku' | 'laku'>('all');

  // Financial Metrics
  const totalRevenue = transactions
    .filter((t) => t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingTransactionsCount = transactions.filter((t) => t.status === 'pending').length;

  const handleStartEdit = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setEditTitle(prop.title);
    setEditPrice(prop.price);
    setEditStatus(prop.status || 'active');
  };

  const handleSaveEdit = async (propId: string) => {
    await updateProperty(propId, {
      title: editTitle,
      price: editPrice,
      status: editStatus,
    });
    setEditingPropertyId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dashboard Kontrol Pusat Superadmin</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Superadmin Management Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Verifikasi rekening CIMB Niaga (704095513700 an. Benisius Rahmat Basuki), moderasi listing, verifikasi agen, dan status KPR.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            {currentUser?.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'SA'}
          </div>
          <div>
            <p className="text-xs font-bold">{currentUser?.displayName || 'Superadmin'}</p>
            <p className="text-[10px] text-emerald-400 font-mono">benisius.rb@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Quick Statistics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Mutasi Pembayaran Masuk</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{formatRupiah(totalRevenue)}</span>
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Bank CIMB NIAGA</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Menunggu Verifikasi Mutasi</span>
          <div className="text-2xl font-black text-amber-600 mt-1 flex items-center justify-between">
            <span>{pendingTransactionsCount}</span>
            <Crown className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[10px] text-slate-500">Paket 44 Hari (Rp 149k / 299k)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Listing Cloud Firebase</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{properties.length}</span>
            <Building className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-[10px] text-slate-500">{properties.filter((p) => p.isPromoted).length} Listing Di-Boost</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Pengguna Terdaftar</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{allUsers.length}</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-[10px] text-slate-500">Tersimpan di Cloud Firebase</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 overflow-x-auto">
        {[
          { key: 'pembayaran', label: 'Verifikasi Pembayaran 44 Hari', badge: pendingTransactionsCount },
          { key: 'listing', label: 'Pengelolaan & Moderasi Listing', badge: properties.length },
          { key: 'users', label: 'User Management & Verifikasi Agen', badge: allUsers.length },
          { key: 'kpr', label: 'Manajemen Status KPR', badge: kprApplications.length },
          { key: 'statistik', label: 'Laporan Statistik Platform' }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === t.key
                ? 'border-indigo-600 text-indigo-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{t.label}</span>
            {t.badge !== undefined && t.badge > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                t.key === 'pembayaran' && pendingTransactionsCount > 0
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Verifikasi Pembayaran CIMB Niaga */}
      {activeTab === 'pembayaran' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Daftar Bukti Transfer Masuk ke Bank CIMB NIAGA
              </h3>
              <p className="text-xs text-slate-500">
                Rekening No: <strong>704095513700</strong> a.n. <strong>Benisius Rahmat Basuki</strong>. Setujui untuk aktivasi otomatis masa aktif 44 hari.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-700">Belum Ada Transaksi Pembayaran</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Setiap bukti transfer paket 44 hari yang dikirim pengguna akan muncul di sini secara real-time.
                </p>
              </div>
            ) : (
              transactions.map((trx) => (
                <div
                  key={trx.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    trx.status === 'pending'
                      ? 'border-amber-300 bg-amber-50/40'
                      : trx.status === 'approved'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 bg-slate-50 opacity-70'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {trx.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {trx.packageType === 'agent_boost' || trx.packageType === 'agent_listing_boost'
                          ? 'Paket Promosi Listing Agen (44 Hari)'
                          : 'Akses Kontak Agen / Pemilik (44 Hari)'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Pengirim: <strong>{trx.userName}</strong> ({trx.senderBank} a.n {trx.senderAccountName}) • No. HP: {trx.userPhone}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span>Nominal: <strong className="text-slate-900">{formatRupiah(trx.amount)}</strong></span>
                      <span>•</span>
                      <span>Tanggal: {trx.transferDate}</span>
                      <span>•</span>
                      <span>Tujuan: <strong>CIMB NIAGA 704095513700 an Benisius Rahmat Basuki</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {trx.proofImageUrl && (
                      <a
                        href={trx.proofImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Lihat Bukti Struk</span>
                      </a>
                    )}

                    {trx.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => verifyTransaction(trx.id, true, 'Pembayaran terverifikasi mutasi Bank CIMB Niaga an Benisius Rahmat Basuki.')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Setujui (Aktifkan 44 Hari)</span>
                        </button>

                        <button
                          onClick={() => verifyTransaction(trx.id, false, 'Mutasi tidak ditemukan di rekening CIMB Niaga.')}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Tolak</span>
                        </button>
                      </>
                    ) : (
                      <span className={`text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                        trx.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {trx.status === 'approved' ? 'Terverifikasi (Aktif 44 Hari)' : 'Ditolak'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Pengelolaan & Verifikasi Listing */}
      {activeTab === 'listing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Pengelolaan & Moderasi Listing Properti (Cloud Firebase)
              </h3>
              <p className="text-xs text-slate-500">
                Superadmin berhak mengubah harga, judul, menghapus, serta mengubah status properti (Laku / Belum Laku) tersinkronisasi di cloud Firebase.
              </p>
            </div>

            {/* Filter Status Properti (Laku / Belum Laku) */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setListingStatusFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  listingStatusFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({properties.length})
              </button>
              <button
                type="button"
                onClick={() => setListingStatusFilter('belum_laku')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  listingStatusFilter === 'belum_laku'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Belum Laku ({properties.filter((p) => !isPropertySold(p.status)).length})
              </button>
              <button
                type="button"
                onClick={() => setListingStatusFilter('laku')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  listingStatusFilter === 'laku'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-rose-700 hover:bg-rose-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                Laku ({properties.filter((p) => isPropertySold(p.status)).length})
              </button>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
              <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-700">Belum Ada Listing Properti</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Listing yang diunggah oleh agen atau pemilik properti akan tampil di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                    <th className="p-3">Judul Properti</th>
                    <th className="p-3">Kota / Lokasi</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3">Legalitas</th>
                    <th className="p-3">Status (Laku / Belum Laku)</th>
                    <th className="p-3">Skor Keaslian</th>
                    <th className="p-3 text-right">Aksi Superadmin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties
                    .filter((p) => {
                      if (listingStatusFilter === 'belum_laku') return !isPropertySold(p.status);
                      if (listingStatusFilter === 'laku') return isPropertySold(p.status);
                      return true;
                    })
                    .map((p) => {
                      const isEditing = editingPropertyId === p.id;
                      const statusInfo = getPropertyStatusInfo(p.status);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="space-y-0.5">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="p-1 border rounded-md text-xs font-bold w-full"
                                />
                              ) : (
                                <span 
                                  onClick={() => setSelectedProperty(p)}
                                  className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer block max-w-xs truncate"
                                >
                                  {p.title}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 capitalize">
                                {p.propertyType} • Oleh {p.ownerName}
                              </span>
                            </div>
                          </td>

                          <td className="p-3 text-slate-600 font-medium">{p.city}</td>

                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="p-1 border rounded-md text-xs font-bold w-32"
                              />
                            ) : (
                              <span className="font-black text-slate-900">{formatRupiah(p.price)}</span>
                            )}
                          </td>

                          <td className="p-3">
                            <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                              {p.certificate}
                            </span>
                          </td>

                          {/* Status Properti (Laku / Belum Laku) */}
                          <td className="p-3">
                            {isEditing ? (
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value as PropertyStatus)}
                                className="p-1 border border-slate-300 rounded-md text-xs font-bold bg-white text-slate-900"
                              >
                                <option value="active">Belum Laku (Tersedia)</option>
                                <option value="sold">Laku (Terjual)</option>
                                <option value="rented">Laku (Tersewa)</option>
                                <option value="pending_review">Moderasi Review</option>
                              </select>
                            ) : (
                              <div className="space-y-1">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider inline-flex items-center gap-1 ${statusInfo.badgeClass}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.isSold ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                                  {statusInfo.label}
                                </span>
                                <div>
                                  <button
                                    onClick={() => togglePropertyStatus(p.id, statusInfo.isSold ? 'active' : 'sold')}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-all border flex items-center gap-1 shadow-2xs ${
                                      statusInfo.isSold
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                        : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                                    }`}
                                    title={statusInfo.isSold ? 'Ubah status ke Belum Laku (Tersedia)' : 'Tandai properti sebagai Laku (Terjual)'}
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>{statusInfo.isSold ? 'Set Belum Laku' : 'Tandai Laku'}</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="p-3">
                            <span className="font-black text-emerald-700">
                              {p.authenticityScore}%
                            </span>
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isEditing ? (
                                <button
                                  onClick={() => handleSaveEdit(p.id)}
                                  className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                                  title="Simpan Perubahan"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStartEdit(p)}
                                  className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
                                  title="Ubah Listing"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => deleteProperty(p.id)}
                                className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer"
                                title="Hapus Listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: User Management & Verifikasi Agen (Real-time Cloud Firebase) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Manajemen Pengguna & Verifikasi Agen (Cloud Firebase)
              </h3>
              <p className="text-xs text-slate-500">
                Data pengguna riil yang tersimpan di cloud Firestore. Kelola verifikasi agen serta masa aktif fitur premium 44 hari.
              </p>
            </div>
          </div>

          {allUsers.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-700">Belum Ada Pengguna Lain Terdaftar</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pengguna baru yang mendaftar via formulir atau Google Login akan otomatis tersinkronisasi di tabel ini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                    <th className="p-3">Nama & Username</th>
                    <th className="p-3">Email & Kontak</th>
                    <th className="p-3">Peran (Role)</th>
                    <th className="p-3">Agensi Properti</th>
                    <th className="p-3">Status Verifikasi Agen</th>
                    <th className="p-3">Status Paket 44 Hari</th>
                    <th className="p-3 text-right">Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allUsers.map((u) => {
                    const daysLeft = u.premiumUntil ? calculateDaysRemaining(u.premiumUntil).days : 0;
                    return (
                      <tr key={u.uid} className="hover:bg-slate-50">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{u.displayName}</span>
                          {u.username && (
                            <span className="text-[10px] text-emerald-700 font-mono">@{u.username}</span>
                          )}
                        </td>

                        <td className="p-3">
                          <span className="text-slate-600 block">{u.email}</span>
                          {u.phone && <span className="text-[10px] text-slate-400">{u.phone}</span>}
                        </td>

                        <td className="p-3">
                          <span className="capitalize font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            {u.role}
                          </span>
                        </td>

                        <td className="p-3 text-slate-600">{u.agencyName || '-'}</td>

                        <td className="p-3">
                          {u.isAgentVerified ? (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-max">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Terverifikasi Resmi
                            </span>
                          ) : (
                            <span className="text-slate-400">Belum Terverifikasi</span>
                          )}
                        </td>

                        <td className="p-3">
                          {u.isPremium && daysLeft > 0 ? (
                            <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-max">
                              <Crown className="w-3 h-3 text-amber-600" />
                              Aktif ({daysLeft} Hari)
                            </span>
                          ) : (
                            <span className="text-slate-400">Non-Aktif</span>
                          )}
                        </td>

                        <td className="p-3 text-right space-x-1.5">
                          <button
                            onClick={() => toggleAgentVerification(u.uid, !u.isAgentVerified)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            {u.isAgentVerified ? 'Cabut Lisensi' : 'Verifikasi Agen'}
                          </button>

                          <button
                            onClick={() => toggleUserPremium(u.uid, !u.isPremium)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            {u.isPremium ? 'Nonaktifkan 44 Hari' : '+ Beri 44 Hari'}
                          </button>

                          {u.role !== 'superadmin' && (
                            <button
                              onClick={() => deleteUserAccount(u.uid)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[11px] font-bold cursor-pointer"
                              title="Hapus Akun Pengguna"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Manajemen Pengajuan KPR */}
      {activeTab === 'kpr' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Manajemen Status Pengajuan KPR
              </h3>
              <p className="text-xs text-slate-500">
                Pembaruan status di sini otomatis memicu notifikasi push instan ke dashboard calon pembeli.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {kprApplications.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-700">Belum Ada Pengajuan KPR</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pengguna yang melakukan simulasi KPR dan mengajukan berkas online akan dipantau di sini.
                </p>
              </div>
            ) : (
              kprApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-black text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md">
                        #{app.id}
                      </span>
                      <h4 className="font-bold text-slate-900 mt-1">{app.propertyTitle}</h4>
                      <p className="text-xs text-slate-600">
                        Pemohon: <strong>{app.applicantName}</strong> ({app.applicantPhone}) • Bank: <strong>{app.bankPreference}</strong>
                      </p>
                    </div>

                    {/* Status Dropdown to Update */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Update Status:</span>
                      <select
                        value={app.status}
                        onChange={(e) => updateKprStatus(app.id, e.target.value as KprStatus, `Diperbarui admin ke tahap ${e.target.value}`)}
                        className="p-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-emerald-500 cursor-pointer"
                      >
                        <option value="diajukan">1. Diajukan</option>
                        <option value="verifikasi_berkas">2. Verifikasi Berkas</option>
                        <option value="slik_ojk">3. Pengecekan SLIK OJK</option>
                        <option value="appraisal">4. Penilaian Appraisal</option>
                        <option value="disetujui">5. Disetujui (SPK Terbit)</option>
                        <option value="ditolak">6. Ditolak</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Harga Properti:</span>
                      <span className="font-bold">{formatRupiah(app.propertyPrice)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Plafon Pinjaman:</span>
                      <span className="font-bold text-emerald-700">{formatRupiah(app.loanAmount)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Estimasi Cicilan:</span>
                      <span className="font-bold">{formatRupiah(app.monthlyInstallment)}/bln</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tenor & Bunga:</span>
                      <span className="font-bold">{app.tenorYears} Thn ({app.interestRate}%)</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Laporan Statistik Platform */}
      {activeTab === 'statistik' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Laporan & Pelaporan Data Statistik Pengguna Komprehensif
              </h3>
              <p className="text-xs text-slate-500">
                Ringkasan performa ekosistem ProperListId di seluruh Indonesia.
              </p>
            </div>
            <button
              onClick={() => triggerNotification('Laporan Diunduh', 'Rekap statistik pengguna ProperListId berhasil diunduh.', 'system')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              Export Laporan CSV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Distribusi Listing Nasional</h4>
              <p className="text-xl font-black text-slate-900 mt-2">{properties.length} Total Listing</p>
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between"><span>Rumah Tapak</span><span className="font-bold">{properties.filter((p) => p.propertyType === 'rumah').length}</span></div>
                <div className="flex justify-between"><span>Ruko Komersial</span><span className="font-bold">{properties.filter((p) => p.propertyType === 'ruko').length}</span></div>
                <div className="flex justify-between"><span>Apartemen</span><span className="font-bold">{properties.filter((p) => p.propertyType === 'apartemen').length}</span></div>
                <div className="flex justify-between"><span>Tanah / Kavling</span><span className="font-bold">{properties.filter((p) => p.propertyType === 'tanah').length}</span></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Aktivitas Pengguna Cloud</h4>
              <p className="text-xl font-black text-emerald-600 mt-2">{allUsers.length} Terdaftar</p>
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between"><span>Calon Pembeli</span><span className="font-bold">{allUsers.filter((u) => u.role === 'buyer').length}</span></div>
                <div className="flex justify-between"><span>Agen Properti</span><span className="font-bold">{allUsers.filter((u) => u.role === 'agent').length}</span></div>
                <div className="flex justify-between"><span>Pemilik Properti</span><span className="font-bold">{allUsers.filter((u) => u.role === 'owner').length}</span></div>
                <div className="flex justify-between"><span>Superadmin</span><span className="font-bold">{allUsers.filter((u) => u.role === 'superadmin').length}</span></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Laju Konversi Paket 44 Hari</h4>
              <p className="text-xl font-black text-indigo-600 mt-2">
                {transactions.filter((t) => t.status === 'approved').length} Transaksi Selesai
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Total akumulasi pendapatan mutasi Bank CIMB NIAGA: <strong>{formatRupiah(totalRevenue)}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
