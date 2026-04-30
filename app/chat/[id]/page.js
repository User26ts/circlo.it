"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function PremiumChat() {
  const { id: chatId } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [myId, setMyId] = useState(null);
  const [partner, setPartner] = useState("Chat");
  const scrollRef = useRef();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/");
      setMyId(session.user.id);

      // Carica messaggi esistenti
      const { data: history } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
      setMessages(history || []);

      // Carica dati del partner
      const { data: chatInfo } = await supabase.from('chats').select('user_1, user_2').eq('id', chatId).single();
      if (chatInfo) {
        const otherId = chatInfo.user_1 === session.user.id ? chatInfo.user_2 : chatInfo.user_1;
        const { data: p } = await supabase.from('profiles').select('first_name').eq('id', otherId).single();
        setPartner(p?.first_name || "Amico");
      }

      // Sottoscrizione Realtime
      const channel = supabase.channel(`room:${chatId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
    init();
  }, [chatId, router]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const { error } = await supabase.from('messages').insert({ chat_id: chatId, sender_id: myId, content: inputText.trim() });
    if (!error) setInputText("");
  };

  return (
    <main style={styles.chatContainer}>
      <header style={styles.chatHeader}>
        <button style={styles.backButton} onClick={() => router.push('/discovery')}>←</button>
        <div style={styles.headerUser}>
          <div style={styles.headerAvatar}>👤</div>
          <div>
            <h3 style={styles.headerName}>{partner}</h3>
            <p style={styles.headerStatus}>Nel tuo cerchio</p>
          </div>
        </div>
      </header>

      <div style={styles.messagesContainer}>
        {messages.map((m, idx) => (
          <div key={idx} style={m.sender_id === myId ? styles.myMsgRow : styles.theirMsgRow}>
            <div style={m.sender_id === myId ? styles.myBubble : styles.theirBubble}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form style={styles.chatInputArea} onSubmit={sendMessage}>
        <input 
          style={styles.chatInput} 
          placeholder="Scrivi qualcosa..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" style={styles.sendButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </form>
    </main>
  );
}

const styles = {
  chatContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f1f5f9', maxWidth: '600px', margin: '0 auto' },
  chatHeader: { padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px', position: 'sticky', top: 0 },
  backButton: { border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' },
  headerUser: { display: 'flex', alignItems: 'center', gap: '12px' },
  headerAvatar: { width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  headerName: { margin: 0, fontSize: '16px', fontWeight: '800' },
  headerStatus: { margin: 0, fontSize: '11px', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' },
  messagesContainer: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  myMsgRow: { display: 'flex', justifyContent: 'flex-end' },
  theirMsgRow: { display: 'flex', justifyContent: 'flex-start' },
  myBubble: { backgroundColor: '#3b82f6', color: '#fff', padding: '12px 18px', borderRadius: '20px 20px 4px 20px', maxWidth: '80%', fontSize: '15px', boxShadow: '0 4px 10px rgba(59,130,246,0.15)' },
  theirBubble: { backgroundColor: '#fff', color: '#1e293b', padding: '12px 18px', borderRadius: '20px 20px 20px 4px', maxWidth: '80%', fontSize: '15px', border: '1px solid #e2e8f0' },
  chatInputArea: { padding: '20px', backgroundColor: '#fff', display: 'flex', gap: '12px', borderTop: '1px solid #e2e8f0' },
  chatInput: { flex: 1, padding: '14px 20px', borderRadius: '25px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', outline: 'none', fontSize: '15px' },
  sendButton: { width: '48px', height: '48px', borderRadius: '24px', backgroundColor: '#3b82f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
};
