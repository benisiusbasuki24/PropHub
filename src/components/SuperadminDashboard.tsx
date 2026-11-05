import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  CreditCard, 
  FileCheck, 
  Users, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Eye, 
  Building2, 
  Clock, 
  TrendingUp, 
  Send, 
  Mail, 
  CheckCircle2, 
  AlertTriangle,
  Crown,
  Search,
  ExternalLink
} from 'lucide-react';
import { formatRupiah, calculateDaysRemaining } from '../utils/currency';
import { KprStatus, Property, UserRole } from '../types';

export const SuperadminDashboard: React.FC = () => {
  const { 
    currentUser, 
    properties, 
    updateProperty, 
    deleteProperty, 
    transactions, 
    verifyTransaction, 
    kprApplications, 
    updateKprStatus, 
    triggerNotification,
    setSelectedProperty 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pembayaran' | 'listing' | 'users' | 'kpr' | 'statistik'>('pembayaran');
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editTitle, setEditTitle] = useState<string>('');
  const [rejectionNote, setRejectionNote] = useState<string>('');

  // Simulated User List for User Management
  const [userList, setUserList] = useState([
    {
      uid: 'user-benisius-admin',
      name: 'Benisius Rahmat Basuki',
      email: 'benisius.rb@gmail.com',
      role: 'superadmin' as UserRole,
      isAgentVerified: true,
      agency: 'ProperList Official',
      isPremium: true,
      daysLeft: 44,
    },
    {
      uid: 'agent-001',
      name: 'Hendrawan Pratama',
      email: 'hendrawan.pratama@century.co.id',
      role: 'agent' as UserRole,
      isAgentVerified: true,
      agency: 'Century Premier Realty',
      isPremium: true,
      daysLeft: 38,
    },
    {
      uid: 'agent-002',
      name: 'Siti Nurhaliza, S.Ars',
      email: 'siti.nurhaliza.agent@gmail.com',
      role: 'agent' as UserRole,
      isAgentVerified: true,
      agency: 'Brighton Real Estate',
      isPremium: true,
      daysLeft: 34,
    },
    {
      uid: 'buyer-007',
      name: 'Kurniawan Wijaya',
      email: 'kurniawan.w@gmail.com',
      role: 'buyer' as UserRole,
      isAgentVerified: false,
      agency: '-',
      isPremium: false,
      daysLeft: 0,
    },
    {
      uid: 'owner-001',
      name: 'I Made Dharma Putra',
      email: 'dharma.putra.bali@yahoo.com',
      role: 'owner' as UserRole,
      isAgentVerified: false,
      agency: '-',
      isPremium: false,
      daysLeft: 0,
    }
  ]);

  // Financial Metrics
  const totalRevenue = transactions
    .filter((t) => t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingTransactionsCount = transactions.filter((t) => t.status === 'pending').length;

  const handleStartEdit = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setEditTitle(prop.title);
    setEditPrice(prop.price);
  };

  const handleSaveEdit = (propId: string) => {
    updateProperty(propId, {
      title: editTitle,
      price: editPrice,
    });
    setEditingPropertyId(null);
  };

  const handleToggleAgentVerification = (uid: string) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.uid === uid ? { ...u, isAgentVerified: !u.isAgentVerified } : u
      )
    );
    triggerNotification('Verifikasi Agen Diperbarui', 'Status sertifikasi agen berhasil diubah.', 'system');
  };

  const handleToggleUserPremium = (uid: string) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.uid === uid
          ? { ...u, isPremium: !u.isPremium, daysLeft: !u.isPremium ? 44 : 0 }
          : u
      )
    );
    triggerNotification('Akses Premium 44 Hari', 'Masa aktif premium pengguna diperbarui 44 hari.', 'system');
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
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-300 uppercase block font-semibold">Total Omset Masuk</span>
            <span className="text-lg font-black text-emerald-400">{formatRupiah(totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Perlu Verifikasi Pembayaran</span>
          <div className="text-2xl font-black text-amber-600 mt-1 flex items-center justify-between">
            <span>{pendingTransactionsCount}</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[10px] text-slate-500">Mutasi CIMB Niaga</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Listing Properti</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{properties.length}</span>
            <Building2 className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[10px] text-emerald-700">Aktif di Indonesia</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Permohonan KPR Berjalan</span>
          <div className="text-2xl font-black text-indigo-700 mt-1 flex items-center justify-between">
            <span>{kprApplications.length}</span>
            <FileCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-[10px] text-slate-500">Bank Mandiri, BCA, CIMB</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Pengguna Terdaftar</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{userList.length}</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-[10px] text-slate-500">Buyer, Agen & Pemilik</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 overflow-x-auto">
        {[
          { key: 'pembayaran', label: 'Verifikasi Pembayaran 44 Hari', badge: pendingTransactionsCount },
          { key: 'listing', label: 'Pengelolaan & Moderasi Listing', badge: properties.length },
          { key: 'users', label: 'User Management & Verifikasi Agen', badge: userList.length },
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

      {/* Tab 1: Verifikasi Pembayaran CIMB Niaga (704095513700 Benisius Rahmat Basuki) */}
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
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              Notifikasi Email: benisius.rb@gmail.com
            </span>
          </div>

          <div className="space-y-3">
            {transactions.map((trx) => (
              <div
                key={trx.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <a
                    href={trx.proofImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative group"
                    title="Klik untuk perbesar bukti transfer"
                  >
                    <img src={trx.proofImageUrl} alt="Struk Transfer" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold">
                      Perbesar
                    </div>
                  </a>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{trx.id}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{trx.userName}</span>
                      <span className="text-xs text-slate-400">({trx.userEmail})</span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      Paket: <strong className="text-slate-900">{trx.packageType === 'buyer_contact_pass' ? 'Akses Kontak Pembeli (44 Hari)' : 'Promosi Listing Agen (44 Hari)'}</strong> • Nominal: <strong className="text-emerald-700">{formatRupiah(trx.amount)}</strong>
                    </p>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pengirim: {trx.senderBank} a.n. {trx.senderAccountName} • Tanggal: {trx.transferDate}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {trx.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => verifyTransaction(trx.id, true, 'Pembayaran CIMB Niaga terverifikasi valid.')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 cursor-pointer transition-colors"
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
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Pengelolaan & Verifikasi Listing (Superadmin Edit & Delete) */}
      {activeTab === 'listing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Kelola Semua Listing Properti
              </h3>
              <p className="text-xs text-slate-500">
                Superadmin berhak mengubah harga, judul, serta menghapus listing yang melanggar aturan.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <th className="p-3">Foto & Judul</th>
                  <th className="p-3">Lokasi</th>
                  <th className="p-3">Harga</th>
                  <th className="p-3">Legalitas</th>
                  <th className="p-3">Skor Otentisitas</th>
                  <th className="p-3 text-right">Aksi Superadmin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => {
                  const isEditing = editingPropertyId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 flex items-center gap-2.5">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-12 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="p-1 border rounded-md text-xs font-bold w-64"
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
        </div>
      )}

      {/* Tab 3: User Management & Verifikasi Agen */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Manajemen Pengguna & Verifikasi Lisensi Agen
              </h3>
              <p className="text-xs text-slate-500">
                Kelola status sertifikasi AREBI agen serta kelola masa aktif fitur premium 44 hari.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <th className="p-3">Nama & Email</th>
                  <th className="p-3">Peran (Role)</th>
                  <th className="p-3">Agensi Properti</th>
                  <th className="p-3">Status Verifikasi Agen</th>
                  <th className="p-3">Status Paket 44 Hari</th>
                  <th className="p-3 text-right">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userList.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                    </td>

                    <td className="p-3">
                      <span className="capitalize font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3 text-slate-600">{u.agency}</td>

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
                      {u.isPremium ? (
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-max">
                          <Crown className="w-3 h-3 text-amber-600" />
                          Aktif ({u.daysLeft} Hari)
                        </span>
                      ) : (
                        <span className="text-slate-400">Non-Aktif</span>
                      )}
                    </td>

                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleToggleAgentVerification(u.uid)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        {u.isAgentVerified ? 'Cabut Lisensi' : 'Verifikasi Agen'}
                      </button>

                      <button
                        onClick={() => handleToggleUserPremium(u.uid)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        {u.isPremium ? 'Nonaktifkan 44 Hari' : '+ Beri 44 Hari'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Manajemen Pengajuan KPR */}
      {activeTab === 'kpr' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Pembaruan Tahapan Berkas KPR Real-time
              </h3>
              <p className="text-xs text-slate-500">
                Perubahan status akan langsung mengirimkan notifikasi push instan ke dashboard pemohon.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {kprApplications.map((app) => (
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
                    <span className="font-bold">{formatRupiah(app.loanAmount)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Angsuran / Bulan:</span>
                    <span className="font-bold text-emerald-700">{formatRupiah(app.monthlyInstallment)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Gaji Pemohon:</span>
                    <span className="font-bold">{formatRupiah(app.applicantIncome)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Laporan Statistik Platform */}
      {activeTab === 'statistik' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Distribusi Listing Berdasarkan Tipe Properti
            </h4>
            <div className="space-y-2.5">
              {[
                { type: 'Rumah Tapak', count: 4, percent: 50 },
                { type: 'Apartemen SCBD', count: 1, percent: 18 },
                { type: 'Ruko Komersial', count: 1, percent: 16 },
                { type: 'Villa Resort Bali', count: 1, percent: 12 },
                { type: 'Tanah Kavling', count: 1, percent: 14 }
              ].map((item) => (
                <div key={item.type} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{item.type}</span>
                    <span>{item.count} Listing ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Laporan Keamanan & Moderasi Konten
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <span className="font-bold text-emerald-950">Nomor Telepon & WA Diblokir di Deskripsi:</span>
                <span className="font-black text-emerald-700">100% Terlindungi</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <span className="font-bold text-emerald-950">Email Eksternal Ditolak Otomatis:</span>
                <span className="font-black text-emerald-700">100% Terlindungi</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-700">Rata-rata Skor Otentisitas Listing:</span>
                <span className="font-black text-slate-900">95.5% Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
