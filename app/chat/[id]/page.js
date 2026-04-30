"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function ChatRoom() {
  const { id: chatId } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [myId, setMyId] = useState(null);
  const [partner, setPartner] = useState({ name: "Caricamento...", id: "" });
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    async function initChat() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return router.push("/");
        setMyId(session.user.id);

        // 1. Recupero i dati della chat per sapere chi è l'altro utente
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .select('user_1, user_2')
          .eq('id', chatId)
          .single();

        if (chatError) throw chatError;

        const otherId = chatData.user_1 === session.user.id ? chatData.user_2 : chatData.user_1;

        // 2. Recupero il profilo del partner
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', otherId)
          .single();
        
        setPartner({ name: profile?.first_name || "Utente Circlo", id: otherId });

        // 3. Carico la cronologia dei messaggi
        const { data: history } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });
        
        setMessages(history || []);
        setLoading(false);

        // 4. Sottoscrizione REALTIME per i nuovi messaggi
        const channel = supabase
          .channel(`chat_room_${chatId}`)
          .on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, 
            (payload) => {
              setMessages((current) => {
                // Evitiamo duplicati se l'insert arriva sia da locale che da realtime
                if (current.find(m => m.id === payload.new.id)) return current;
                return [...current, payload.new];
              });
            }
          )
          .subscribe();

        return () => supabase.removeChannel(channel);
      } catch (err) {
        console.error("Errore init chat:", err);
        setLoading(false);
      }
    }

    if (chatId) initChat();
  }, [chatId, router]);

  // Scroll automatico all'ultimo messaggio
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !myId) return;

    const tempText = newMessage.trim();
    setNewMessage(""); // Svuota subito l'input per feedback immediato

    const { error } = await supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: myId,
      content: tempText
    });

    if (error) {
      alert("Errore nell'invio del messaggio");
      setNewMessage(tempText); // Ripristina il testo se fallisce
    }
  };

  if (loading) return (
    <div style={styles.center}>
      <div style={styles.loader}>🧬</div>
      <p>Entrando nel cerchio...</p>
    </div>
  );

  return (
    <main style={styles.container}>
      {/* HEADER FISSO */}
      <header style={styles.header}>
        <button onClick={() => router.push('/discovery')} style={styles.backBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={styles.avatarSmall}>👤</div>
        <div style={styles.headerInfo}>
          <h2 style={styles.partnerName}>{partner.name}</h2>
          <span style={styles.status}>Online nel cerchio</span>
        </div>
      </header>

      {/* AREA MESSAGGI */}
      <div style={styles.chatArea}>
        <div style={styles.infoBubble}>
          I messaggi sono condivisi solo tra voi due. Buona conversazione!
        </div>
        
        {messages.map((msg, index) => {
          const isMine = msg.sender_id === myId;
          return (
            <div key={msg.id || index} style={isMine ? styles.myRow : styles.theirRow}>
              <div style={isMine ? styles.myBubble : styles.theirBubble}>
                {msg.content}
                <div style={isMine ? styles.myTime : styles.theirTime}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* INPUT FISSO IN BASSO */}
      <form onSubmit={handleSend} style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <input 
            style={styles.input} 
            placeholder="Scrivi qualcosa di bello..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" style={styles.sendBtn} disabled={!newMessage.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </form>
    </main>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '600px', margin: '0 auto', backgroundColor: '#f1f5f9', fontFamily: '-apple-system, system-ui, sans-serif' },
  
  header: { padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 10 },
  backBtn: { background: 'none', border: 'none', padding: '5px', cursor: 'pointer', color: '#64748b' },
  avatarSmall: { width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  headerInfo: { display: 'flex', flexDirection: 'column' },
  partnerName: { fontSize: '17px', fontWeight: '800', margin: 0, color: '#0f172a' },
  status: { fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' },

  chatArea: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  infoBubble: { textAlign: 'center', fontSize: '12px', color: '#94a3b8', backgroundColor: '#fff', padding: '10px', borderRadius: '12px', margin: '10px 40px', border: '1px solid #e2e8f0' },
  
  myRow: { display: 'flex', justifyContent: 'flex-end', width: '100%' },
  theirRow: { display: 'flex', justifyContent: 'flex-start', width: '100%' },
  
  myBubble: { backgroundColor: '#3b82f6', color: '#fff', padding: '12px 16px', borderRadius: '20px 20px 4px 20px', maxWidth: '80%', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)', position: 'relative' },
  theirBubble: { backgroundColor: '#fff', color: '#1e293b', padding: '12px 16px', borderRadius: '20px 20px 20px 4px', maxWidth: '80%', border: '1px solid #e2e8f0', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
  
  myTime: { fontSize: '10px', opacity: 0.8, textAlign: 'right', marginTop: '5px', fontWeight: '600' },
  theirTime: { fontSize: '10px', color: '#94a3b8', textAlign: 'right', marginTop: '5px', fontWeight: '600' },

  inputContainer: { padding: '20px', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0' },
  inputWrapper: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '20px', border: '1px solid #e2e8f0' },
  input: { flex: 1, border: 'none', background: 'transparent', padding: '10px 15px', outline: 'none', fontSize: '15px', color: '#1e293b' },
  sendBtn: { backgroundColor: '#3b82f6', border: 'none', width: '42px', height: '42px', borderRadius: '21px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s', ':disabled': { opacity: 0.5 } },

  center: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' },
  loader: { fontSize: '40px', marginBottom: '15px', animation: 'spin 2s linear infinite' }
};
