import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Search, 
  Calculator, 
  ArrowLeftRight, 
  TrendingUp, 
  Crown, 
  MessageSquare, 
  ShieldCheck, 
  Bell, 
  PlusCircle, 
  User, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  LogIn,
  UserPlus
} from 'lucide-react';
import { calculateDaysRemaining } from '../utils/currency';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    comparisonList, 
    chatMessages, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    setIsCreateListingOpen,
    setIsChatOpen,
    setIsAuthModalOpen,
    handleLogout
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;
  const unreadChatsCount = currentUser 
    ? chatMessages.filter((m) => m.receiverId === currentUser.uid && !m.read).length 
    : 0;
  const daysRemaining = currentUser?.premiumUntil 
    ? calculateDaysRemaining(currentUser.premiumUntil) 
    : { days: 0, isExpired: true };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner for Premium Status or Alert (Only for logged-in premium users) */}
      {currentUser && currentUser.isPremium && !daysRemaining.isExpired && (
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
          <Crown className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
          <span>
            Status Premium Aktif ({currentUser.premiumType === 'agent_boost' ? 'Promosi Listing Agen' : 'Akses Kontak Pembeli'}):{' '}
            <strong>Sisa {daysRemaining.days} hari</strong> (Masa aktif 44 hari).
          </span>
          <button 
            onClick={() => setActiveTab('premium')}
            className="underline ml-2 hover:text-yellow-200 font-semibold cursor-pointer"
          >
            Kelola / Perpanjang
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Proper<span className="text-emerald-600">ListId</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none">Portal Properti Seluruh Indonesia</p>
            </div>
          </div>

          {/* Navigation Links - ONLY VISIBLE WHEN USER IS LOGGED IN */}
          {currentUser && (
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Beranda
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'search'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Search className="w-4 h-4" />
                Cari Properti
              </button>

              <button
                onClick={() => setActiveTab('kpr')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'kpr'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-4 h-4 text-emerald-600" />
                Simulasi KPR
              </button>

              <button
                onClick={() => setActiveTab('compare')}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'compare'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                Perbandingan
                {comparisonList.length > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {comparisonList.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('market')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'market'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Tren Pasar RI
              </button>

              <button
                onClick={() => setActiveTab('premium')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'premium'
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-500" />
                Paket 44 Hari
              </button>

              {(currentUser.role === 'superadmin' || currentUser.role === 'admin') && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Superadmin
                </button>
              )}
            </nav>
          )}

          {/* Right Action Icons & User Controls */}
          <div className="flex items-center gap-2.5">
            {!currentUser ? (
              /* When Logged Out: NO MENUS, ONLY LOGIN & REGISTER FORMS */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                >
                  <LogIn className="w-4 h-4 text-emerald-600" />
                  <span>Masuk</span>
                </button>

                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Akun Baru</span>
                </button>
              </div>
            ) : (
              /* When Logged In: Full controls + Direct Logout Button */
              <>
                {/* Direct Chat Drawer Toggle */}
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Obrolan Langsung"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadChatsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Notifikasi"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-ping"></span>
                    )}
                    {unreadNotifsCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                    )}
                  </button>

                  {/* Notification Dropdown Panel */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-bold text-sm text-slate-900">Notifikasi Terkini</h4>
                          {unreadNotifsCount > 0 && (
                            <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {unreadNotifsCount} baru
                            </span>
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                          >
                            Tandai semua dibaca
                          </button>
                        )}
                      </div>

                      <div className="mt-3 max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 text-xs">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            Belum ada notifikasi baru.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                if (notif.linkTab) setActiveTab(notif.linkTab as any);
                                setIsNotifOpen(false);
                              }}
                              className={`pt-2 p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                                !notif.isRead ? 'bg-emerald-50/60 font-medium' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="p-1 rounded-md bg-white shadow-xs shrink-0 mt-0.5">
                                  {notif.type === 'kpr' && <Calculator className="w-3.5 h-3.5 text-blue-600" />}
                                  {notif.type === 'price_alert' && <TrendingUp className="w-3.5 h-3.5 text-amber-600" />}
                                  {notif.type === 'transaction' && <Crown className="w-3.5 h-3.5 text-emerald-600" />}
                                  {notif.type === 'chat' && <MessageSquare className="w-3.5 h-3.5 text-teal-600" />}
                                  {notif.type === 'system' && <AlertTriangle className="w-3.5 h-3.5 text-slate-600" />}
                                </span>
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-slate-900 leading-snug">{notif.title}</p>
                                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <p className="text-[9px] text-slate-400 mt-1">
                                    {new Date(notif.createdAt).toLocaleTimeString('id-ID', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Create Listing (Only for Agent, Owner, Superadmin) */}
                {(currentUser.role === 'agent' || currentUser.role === 'owner' || currentUser.role === 'superadmin') && (
                  <button
                    onClick={() => setIsCreateListingOpen(true)}
                    className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer hover:shadow-lg"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Pasang Iklan</span>
                  </button>
                )}

                {/* User Profile Info Chip */}
                <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Profil Pengguna"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/30">
                      {currentUser.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'PL'}
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                        {currentUser.displayName}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-medium capitalize">
                        {currentUser.role}
                      </p>
                    </div>
                  </button>

                  {/* ACTIVE LOGOUT BUTTON FOR ALL ROLES */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0 ml-1 shadow-xs"
                    title="Keluar dari Akun (Logout)"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
