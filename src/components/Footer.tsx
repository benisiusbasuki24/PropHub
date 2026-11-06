import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  Mail, 
  CreditCard, 
  Lock, 
  MapPin, 
  PhoneCall, 
  Heart 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsPaymentModalOpen, setPaymentPackageSelected } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-850 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Proper<span className="text-emerald-500">ListId</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Portal jual beli properti (rumah, tanah, ruko, apartemen & villa) terdepan di Indonesia. Dilengkapi kalkulator KPR, perbandingan harga nasional, analitik pasar real-time, dan proteksi komunikasi internal tanpa spam.
            </p>

            <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Rekening Resmi Admin Platform</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Bank: <strong className="text-white">Bank CIMB NIAGA</strong> • No. Rek: <strong className="text-yellow-400 font-mono">704095513700</strong>
                <br />
                Atas Nama: <strong className="text-white">Benisius Rahmat Basuki</strong>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-800">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email Notifikasi: <strong>benisius.rb@gmail.com</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Jelajahi Portal</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('search')} className="hover:text-emerald-400 cursor-pointer">
                  Cari Rumah & Villa
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('search')} className="hover:text-emerald-400 cursor-pointer">
                  Ruko & Komersial
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('search')} className="hover:text-emerald-400 cursor-pointer">
                  Tanah Kavling Siap Bangun
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('kpr')} className="hover:text-emerald-400 cursor-pointer">
                  Simulasi Bunga KPR
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('market')} className="hover:text-emerald-400 cursor-pointer">
                  Tren Harga Properti RI
                </button>
              </li>
            </ul>
          </div>

          {/* Fitur Premium 44 Hari */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Paket Fitur (44 Hari)</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setPaymentPackageSelected('buyer_contact_pass');
                    setIsPaymentModalOpen(true);
                  }}
                  className="hover:text-emerald-400 cursor-pointer text-left"
                >
                  Akses Kontak Pembeli (Rp 149rb)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setPaymentPackageSelected('agent_listing_boost');
                    setIsPaymentModalOpen(true);
                  }}
                  className="hover:text-emerald-400 cursor-pointer text-left"
                >
                  Promosi Listing Agen (Rp 299rb)
                </button>
              </li>
              <li>
                <button onClick={() => setIsPaymentModalOpen(true)} className="hover:text-emerald-400 cursor-pointer">
                  Unggah Bukti Transfer CIMB Niaga
                </button>
              </li>
              <li>
                <button onClick={() => setIsPaymentModalOpen(true)} className="hover:text-emerald-400 cursor-pointer">
                  Riwayat Pembayaran
                </button>
              </li>
            </ul>
          </div>

          {/* Legalitas & Keamanan */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Keamanan & Legalitas</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Verifikasi Sertifikat SHM & PBG BPN RI</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Moderasi Otomatis Perlindungan Privasi Data</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Standar Etika Asosiasi Real Estate Indonesia (AREBI)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 ProperListId Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Syarat & Ketentuan</span>
            <span>Kebijakan Privasi</span>
            <span>Bantuan & FAQ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
