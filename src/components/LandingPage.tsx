import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Calculator, 
  MapPin, 
  TrendingUp, 
  Crown, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  AtSign, 
  Building, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../types';

export const LandingPage: React.FC = () => {
  const { 
    handleRegister, 
    handleLogin, 
    handleGoogleLogin 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [role, setRole] = useState<UserRole>('buyer');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      if (mode === 'register') {
        const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
        if (!cleanUsername) {
          setStatusMessage({ type: 'error', text: 'Username wajib diisi (hanya huruf, angka, garis bawah).' });
          setIsLoading(false);
          return;
        }

        const res = await handleRegister({
          displayName: name.trim(),
          username: cleanUsername,
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          role,
          agencyName: role === 'agent' ? agencyName.trim() : undefined,
        });

        if (res?.success) {
          setStatusMessage({ type: 'success', text: 'Registrasi berhasil tersimpan di cloud Firebase! Mengalihkan...' });
        } else {
          setStatusMessage({ type: 'error', text: res?.error || 'Gagal mendaftar ke server.' });
        }
      } else {
        const cleanId = loginIdentifier.trim();
        if (!cleanId) {
          setStatusMessage({ type: 'error', text: 'Masukkan email atau username Anda.' });
          setIsLoading(false);
          return;
        }

        const res = await handleLogin(cleanId, role);
        if (res?.success) {
          setStatusMessage({ type: 'success', text: 'Login berhasil! Mengalihkan ke portal...' });
        } else {
          setStatusMessage({ type: 'error', text: res?.error || 'Gagal masuk. Silakan cek data Anda.' });
        }
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Terjadi kesalahan sistem.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Initial Portal Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Portal Jual Beli Properti Seluruh Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Portal Modern untuk Rumah, Tanah, Ruko, Apartemen & Villa di Seluruh Indonesia.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              ProperListId menghubungkan calon pembeli, investor, pemilik langsung, dan agen properti terlisensi. Dilengkapi sistem moderasi privasi otomatis, simulasi KPR bank terpercaya, dan peta interaktif Google Maps.
            </p>

            {/* Core Features Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Privasi Terenkripsi</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Sistem otomatis menolak pencantuman nomor HP dan email di deskripsi listing untuk menyaring makelar liar dan spam.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                  <Calculator className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Simulasi & Tracking KPR</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Estimasi angsuran KPR dengan perhitungan penghasilan dan pelacakan status berkas hingga SLIK OJK real-time.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Peta Fasilitas Interaktif</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Didukung Google Maps Platform untuk memantau radius stasiun MRT, pintu tol, mall, sekolah, dan fasilitas sekitar.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Analitik Harga Pasar RI</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Pantau tren harga per m² dari Jakarta, Bali, Surabaya, hingga Bandung untuk keputusan investasi properti akurat.
                </p>
              </div>
            </div>

            {/* CIMB Niaga Payment Notice */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-slate-900 border border-red-500/30 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Fitur Berbayar Akses 44 Hari (Pembeli & Agen)</span>
              </div>
              <p className="leading-relaxed">
                Pembayaran paket promosi agen & kontak pembeli resmi ditransfer ke rekening admin: <br />
                <strong className="text-white">Bank CIMB NIAGA</strong> | No. Rek: <strong className="text-white font-mono">704095513700</strong> a.n. <strong className="text-white">Benisius Rahmat Basuki</strong> (Konfirmasi email: <span className="text-amber-200">benisius.rb@gmail.com</span>).
              </p>
            </div>
          </div>

          {/* Right Column: EMBEDDED FORM LOGIN & REGISTER USER (BUYER, AGENT, OWNER) */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
              {/* Form Header */}
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-md mb-2 font-black text-sm">
                  PL
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {mode === 'register' ? 'Daftar Akun Pengguna' : 'Masuk ke ProperListId'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Semua data dan username tersimpan di cloud system Firebase
                </p>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold my-4">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setStatusMessage(null);
                  }}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    mode === 'register' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Daftar Akun Baru
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setStatusMessage(null);
                  }}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    mode === 'login' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Masuk ke Akun
                </button>
              </div>

              {/* Status Alert */}
              {statusMessage && (
                <div className={`p-3 rounded-xl text-xs font-medium mb-3 ${
                  statusMessage.type === 'error' 
                    ? 'bg-rose-50 border border-rose-200 text-rose-800' 
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}>
                  {statusMessage.text}
                </div>
              )}

              {/* Google One-Click Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full p-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-xs font-bold text-slate-800 flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all hover:bg-slate-50 mb-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Masuk / Daftar dengan Google</span>
              </button>

              <div className="flex items-center gap-2 my-2">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">atau dengan form formulir</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* ROLE PICKER: BUYER, AGENT, OWNER */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Pilih Peran:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                        role === 'buyer'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" />
                      <span>Pembeli</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('agent')}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                        role === 'agent'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5 mx-auto mb-1 text-blue-600" />
                      <span>Agen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('owner')}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                        role === 'owner'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 mx-auto mb-1 text-teal-600" />
                      <span>Pemilik</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 italic">
                    {role === 'buyer' && '• Calon Pembeli: Akses cari properti & kontak langsung penjual.'}
                    {role === 'agent' && '• Agen Properti: Pasang listing berlisensi & paket promosi 44 hari.'}
                    {role === 'owner' && '• Pemilik Properti: Jual properti pribadi secara langsung tanpa makelar.'}
                  </p>
                </div>

                {mode === 'register' ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Benisius Rahmat Basuki"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Username (Disimpan di Cloud Firebase)
                      </label>
                      <div className="relative">
                        <AtSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="username_anda"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Alamat Email
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="nama@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Nomor HP / WhatsApp (Disimpan di Cloud)
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          placeholder="0812xxxxxxxx"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
                        />
                      </div>
                    </div>

                    {role === 'agent' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Nama Kantor / Agensi Properti
                        </label>
                        <div className="relative">
                          <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            placeholder="Contoh: Century Premier, Brighton, Ray White"
                            value={agencyName}
                            onChange={(e) => setAgencyName(e.target.value)}
                            className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Email atau Username
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Masukkan email atau username"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Kata Sandi / PIN
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-3 rounded-xl text-xs shadow-md shadow-emerald-600/20 cursor-pointer transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  <span>
                    {isLoading ? 'Menghubungkan Cloud Firebase...' : (mode === 'register' ? `Daftar sebagai ${role.toUpperCase()}` : 'Masuk ke Portal')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Superadmin Access hint */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400">
                  Akses resmi Superadmin: <span className="font-mono text-slate-600 font-semibold">benisius.rb@gmail.com</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
