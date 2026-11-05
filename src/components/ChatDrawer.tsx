import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  Building2, 
  Clock, 
  Lock,
  AlertTriangle
} from 'lucide-react';
import { formatRupiah } from '../utils/currency';

export const ChatDrawer: React.FC = () => {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    currentUser, 
    chatMessages, 
    sendMessage, 
    activeChatPartner, 
    setActiveChatPartner,
    setSelectedProperty 
  } = useApp();

  const [inputText, setInputText] = useState('');

  if (!isChatOpen) return null;

  // Derive unique threads for currentUser
  const partnerMap = new Map<string, { id: string; name: string; lastMsg: string; time: string; unread: number }>();

  chatMessages.forEach((msg) => {
    const isSender = msg.senderId === currentUser.uid;
    const partnerId = isSender ? msg.receiverId : msg.senderId;
    const partnerName = isSender ? msg.receiverName : msg.senderName;

    const existing = partnerMap.get(partnerId);
    if (!existing || new Date(msg.timestamp) > new Date(existing.time)) {
      partnerMap.set(partnerId, {
        id: partnerId,
        name: partnerName,
        lastMsg: msg.text,
        time: msg.timestamp,
        unread: !msg.read && msg.receiverId === currentUser.uid ? 1 : 0,
      });
    }
  });

  const threads = Array.from(partnerMap.values());

  // Default active partner if none selected
  const activePartner = activeChatPartner || (threads.length > 0 ? { id: threads[0].id, name: threads[0].name } : null);

  // Filter messages for active partner
  const currentMessages = activePartner
    ? chatMessages.filter(
        (m) =>
          (m.senderId === currentUser.uid && m.receiverId === activePartner.id) ||
          (m.senderId === activePartner.id && m.receiverId === currentUser.uid)
      )
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartner) return;

    sendMessage(activePartner.id, activePartner.name, inputText.trim(), activeChatPartner?.property);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Obrolan Langsung ProperList</h3>
              <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Komunikasi Aman & Terenkripsi
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thread Selector Strip (if multiple) */}
        {threads.length > 1 && (
          <div className="flex gap-2 p-2.5 border-b border-slate-100 overflow-x-auto bg-slate-50/50">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveChatPartner({ id: t.id, name: t.name })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePartner?.id === t.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{t.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        )}

        {/* Property Reference Card in Chat (if discussing a property) */}
        {activeChatPartner?.property && (
          <div 
            onClick={() => setSelectedProperty(activeChatPartner.property!)}
            className="p-3 bg-emerald-50/80 border-b border-emerald-100 flex items-center gap-3 cursor-pointer hover:bg-emerald-100/80 transition-colors"
          >
            <img
              src={activeChatPartner.property.images[0]}
              alt={activeChatPartner.property.title}
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-emerald-200"
            />
            <div className="overflow-hidden">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                Properti yang Ditanyakan
              </span>
              <h5 className="text-xs font-bold text-slate-900 truncate">
                {activeChatPartner.property.title}
              </h5>
              <p className="text-xs font-black text-emerald-700">
                {formatRupiah(activeChatPartner.property.price)}
              </p>
            </div>
          </div>
        )}

        {/* Security Warning Alert */}
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 text-[11px] text-amber-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Privasi Terlindungi: Dilarang membagikan kontak eksternal di luar sistem ProperList.
          </span>
        </div>

        {/* Message Bubble List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {!activePartner ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              Pilih properti dan klik "Hubungi Agen" untuk memulai obrolan langsung.
            </div>
          ) : currentMessages.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              Mulai percakapan aman dengan {activePartner.name}.
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.uid;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-1 px-1">
                    {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-xs shadow-md shadow-emerald-600/20'
                        : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200 shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        {activePartner && (
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input
              type="text"
              placeholder={`Ketik pesan aman untuk ${activePartner.name.split(' ')[0]}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white p-2.5 rounded-xl cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
