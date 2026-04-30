"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function LiminalChat() {
  const { id: chatId } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [myId, setMyId] = useState(null);
  const [partner, setPartner] = useState("Sconosciuto");
  const scrollRef = useRef();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/");
      setMyId(session.user.id);

      const { data: chat } = await supabase.from('chats').select('user_1, user_2').eq('id', chatId).single();
      if (chat) {
        const otherId = chat.user_1 === session.user.id ? chat.user_2 : chat.user_1;
        const { data: p } = await supabase.from('profiles').select('first_name').eq('id', otherId).single();
        setPartner(p?.first_name || "Entità");
      }

      const { data: history } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
      setMessages(history || []);

      const channel = supabase.channel(`room_${chatId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, 
          (payload) => setMessages(prev => [...prev, payload.new])
        ).subscribe();

      return () => supabase.removeChannel(channel);
    }
    init();
  }, [chatId, router]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { error } = await supabase.from('messages').insert({ chat_id: chatId, sender_id: myId, content: text.trim() });
    if (!error) setText("");
  };

  return (
    <main style={styles.liminalSpace}>
      <header style={styles.header}>
        <button onClick={() => router.push('/discovery')} style={styles.backBtn}>[ INDIETRO ]</button>
        <span style={styles.partnerName}>Terminale di: {partner}</span>
      </header>

      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={m.sender_id === myId ? styles.rowRight : styles.rowLeft}>
            <div style={m.sender_id === myId ? styles.msgMine : styles.msgTheirs}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={send} style={styles.inputArea}>
        <input 
          style={styles.input} 
          placeholder="Digita messaggio..." 
          value={text} 
          onChange={e => setText(e.target.value)} 
        />
        <button type="submit" style={styles.sendBtn}>INVIA</button>
      </form>
    </main>
  );
}

const styles = {
  liminalSpace: { display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '600px', margin: '0 auto', background: '#f0ebd8', fontFamily: 'monospace', color: '#2d2c25' },
  header: { padding: '15px', background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', color: '#5c5a4f' },
  partnerName: { fontWeight: 'bold', textTransform: 'uppercase' },
  chatBox: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' },
  rowRight: { display: 'flex', justifyContent: 'flex-end' },
  rowLeft: { display: 'flex', justifyContent: 'flex-start' },
  msgMine: { background: '#2d2c25', color: '#e3dcb8', padding: '10px 15px', borderRadius: '4px 4px 0 4px', maxWidth: '80%' },
  msgTheirs: { background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(0,0,0,0.1)', padding: '10px 15px', borderRadius: '4px 4px 4px 0', maxWidth: '80%' },
  inputArea: { padding: '15px', background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '12px', border: '1px solid rgba(0,0,0,0.2)', background: 'rgba(255,255,255,0.6)', outline: 'none', fontFamily: 'inherit' },
  sendBtn: { padding: '0 20px', background: '#2d2c25', color: '#e3dcb8', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold' }
};
