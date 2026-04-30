"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function ChatPage() {
  const { id: receiver_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [myId, setMyId] = useState(null);
  const [receiverName, setReceiverName] = useState("Chat");
  const scrollRef = useRef();

  useEffect(() => {
    async function initChat() {
      // 1. Prendi la sessione
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const currentUserId = session.user.id;
      setMyId(currentUserId);

      // 2. Prendi il nome del destinatario
      const { data: profile } = await supabase.from('profiles').select('first_name').eq('id', receiver_id).single();
      if (profile) setReceiverName(profile.first_name);

      // 3. Carica messaggi esistenti
      const { data: existingMessages } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (existingMessages) setMessages(existingMessages);

      // 4. Sottoscrizione REALTIME (Usa currentUserId invece di session.user.id dentro il callback)
      const channel = supabase
        .channel(`chat_${receiver_id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages' 
        }, (payload) => {
          const newMsg = payload.new;
          // Verifica se il messaggio appartiene a questa conversazione
          const isRelevant = 
            (newMsg.sender_id === currentUserId && newMsg.receiver_id === receiver_id) ||
            (newMsg.sender_id === receiver_id && newMsg.receiver_id === currentUserId);
          
          if (isRelevant) {
            setMessages(prev => {
              // Evita duplicati se il messaggio è già stato aggiunto ottimisticamente
              if (prev.find(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
    initChat();
  }, [receiver_id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !myId) return;

    const textToSend = newMessage.trim();
    setNewMessage("");

    // Invio al DB
    const { error } = await supabase.from('messages').insert([
      { 
        sender_id: myId, 
        receiver_id: receiver_id, 
        content: textToSend 
      }
    ]);

    if (error) {
      console.error("Errore invio:", error);
      alert("Errore: " + error.message);
      setNewMessage(textToSend);
    }
  };

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <div style={styles.backBtn} onClick={() => window.history.back()}>←</div>
        <h2 style={styles.title}>{receiverName}</h2>
        <div style={{width: '24px'}} /> {/* Spacer per centrare il titolo */}
      </header>

      <div style={styles.messageList}>
        {messages.map((msg, i) => (
          <div key={msg.id || i} style={msg.sender_id === myId ? styles.myMsgWrapper : styles.theirMsgWrapper}>
            <div style={msg.sender_id === myId ? styles.myMsg : styles.theirMsg}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} style={styles.inputArea}>
        <input
          style={styles.input}
          placeholder="Scrivi un messaggio..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" style={styles.sendBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </main>
  );
}

const styles = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff', fontFamily: '-apple-system, system-ui, sans-serif' },
  header: { padding: '15px 20px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 },
  backBtn: { fontSize: '20px', cursor: 'pointer', color: '#007AFF' },
  title: { fontSize: '17px', fontWeight: '700', margin: 0 },
  messageList: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  myMsgWrapper: { alignSelf: 'flex-end', maxWidth: '75%' },
  theirMsgWrapper: { alignSelf: 'flex-start', maxWidth: '75%' },
  myMsg: { background: '#007AFF', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 2px 18px', fontSize: '15px', lineHeight: '1.4' },
  theirMsg: { background: '#1C1C1E', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 18px 2px', fontSize: '15px', lineHeight: '1.4' },
  inputArea: { padding: '15px 20px 30px 20px', background: '#000', display: 'flex', gap: '12px', alignItems: 'center' },
  input: { flex: 1, background: '#1C1C1E', border: 'none', padding: '12px 16px', borderRadius: '22px', color: '#fff', fontSize: '15px', outline: 'none' },
  sendBtn: { background: 'none', border: 'none', color: '#007AFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};
