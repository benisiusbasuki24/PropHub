import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  LogOut, 
  Crown, 
  Building,
  AtSign,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../types';
import { calculateDaysRemaining } from '../utils/currency';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    currentUser, 
    handleGoogleLogin, 
    handleRegister,
    handleLogin,
    handleLogout
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [agencyName, setAgencyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const daysRemaining = currentUser?.premiumUntil 
    ? calculateDaysRemaining(currentUser.premiumUntil) 
    : { days: 0, isExpired: true };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (mode === 'register') {
        const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
        if (!cleanUsername) {
          setErrorMessage('Username tidak boleh kosong dan hanya huruf, angka, atau garis bawah (_).');
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
          setIsAuthModalOpen(false);
        } else {
          setErrorMessage(res?.error || 'Gagal mendaftar. Silakan coba kembali.');
        }
      } else {
        const cleanId = emailOrUsername.trim();
        if (!cleanId) {
          setErrorMessage('Masukkan email atau username Anda.');
          setIsLoading(false);
          return;
        }

        const res = await handleLogin(cleanId, role);
        if (res?.success) {
          setIsAuthModalOpen(false);
        } else {
          setErrorMessage(res?.error || 'Gagal masuk. Silakan periksa kembali data Anda.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              PL
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                {currentUser ? 'Akun ProperListId' : (mode === 'login' ? 'Masuk ke ProperListId' : 'Daftar Akun Pengguna')}
              </h3>
              <p className="text-[11px] text-slate-500">
                Portal Jual Beli Properti Indonesia Terpercaya
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {currentUser ? (
            /* Logged In Profile Overview */
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-lg">
                  {currentUser.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'PL'}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{currentUser.displayName}</h4>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  {currentUser.username && (
                    <p className="text-[11px] text-emerald-700 font-mono">@{currentUser.username}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                    {currentUser.isAgentVerified && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status 44 Hari Premium */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-600 fill-current" />
                    Status Fitur Berbayar (44 Hari)
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    currentUser.isPremium && !daysRemaining.isExpired
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {currentUser.isPremium && !daysRemaining.isExpired ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">
                  {currentUser.isPremium && !daysRemaining.isExpired
                    ? `Tersisa ${daysRemaining.days} hari masa aktif paket eksklusif Anda.`
                    : 'Aktifkan paket 44 hari untuk membuka kontak agen atau mempromosikan listing eksklusif.'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500">
                Data profil Anda tersimpan aman dan terenkripsi di cloud database Firebase ProperListId.
              </div>

              {/* DIRECT LOGOUT BUTTON */}
              <button
                type="button"
                onClick={async () => {
                  await handleLogout();
                  setIsAuthModalOpen(false);
                }}
                className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun (Logout)</span>
              </button>
            </div>
          ) : (
            /* Login / Register Form */
            <div className="space-y-4">
              {/* Mode Toggle Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Masuk ke Akun
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    mode === 'register' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Daftar Akun Baru
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                  {errorMessage}
                </div>
              )}

              {/* Google One-Click Login */}
              <button
                type="button"
                onClick={async () => {
                  await handleGoogleLogin();
                  setIsAuthModalOpen(false);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-xs font-bold text-slate-800 flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all hover:bg-slate-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Masuk dengan Akun Google</span>
              </button>

              <div className="flex items-center gap-2 my-1">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">atau dengan form internal</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'register' ? (
                  <>
                    {/* Role Selection for registration */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Pilih Peran Pengguna
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setRole('buyer')}
                          className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                            role === 'buyer'
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Pembeli
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('agent')}
                          className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                            role === 'agent'
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Agen
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('owner')}
                          className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                            role === 'owner'
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Pemilik
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
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
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Username (Disimpan di Cloud Firebase)
                      </label>
                      <div className="relative">
                        <AtSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="username_unik"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
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
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
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
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
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
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Email atau Username
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Masukkan email atau username"
                          value={emailOrUsername}
                          onChange={(e) => setEmailOrUsername(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Pilih Peran Masuk
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500 cursor-pointer"
                      >
                        <option value="buyer">Calon Pembeli (Buyer)</option>
                        <option value="agent">Agen Properti (Agent)</option>
                        <option value="owner">Pemilik Properti (Owner)</option>
                        <option value="superadmin">Superadmin (benisius.rb@gmail.com)</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Kata Sandi / PIN Keamanan
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 cursor-pointer transition-transform hover:scale-[1.01] disabled:opacity-50"
                >
                  {isLoading ? 'Memproses ke Cloud Firebase...' : (mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Baru')}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setErrorMessage('');
                  }}
                  className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  {mode === 'login'
                    ? 'Belum punya akun? Daftarkan diri Anda sekarang'
                    : 'Sudah punya akun? Masuk ke portal'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
