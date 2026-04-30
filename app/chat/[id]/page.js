"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setMyId(session.user.id);

      // Prendi il nome del destinatario
      const { data: profile } = await supabase.from('profiles').select('first_name').eq('id', receiver_id).single();
      if (profile) setReceiverName(profile.first_name);

      // Carica messaggi esistenti
      const { data: existingMessages } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${session.user.id})`)
        .order('created_at', { ascending: true });

      if (existingMessages) setMessages(existingMessages);

      // Sottoscrizione REALTIME
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          const newMsg = payload.new;
          if ((newMsg.sender_id === session.user.id && newMsg.receiver_id === receiver_id) ||
              (newMsg.sender_id === receiver_id && newMsg.receiver_id === session.user.id)) {
            setMessages(prev => [...prev, newMsg]);
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

    const messageData = {
      sender_id: myId,
      receiver_id: receiver_id,
      content: newMessage.trim()
    };

    // Reset immediato dell'input per velocità UI
    const textToSend = newMessage;
    setNewMessage("");

    const { error } = await supabase.from('messages').insert([messageData]);

    if (error) {
      console.error("Errore invio:", error);
      alert("Errore nell'invio del messaggio");
      setNewMessage(textToSend); // Ripristina il testo se fallisce
    }
  };

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>{receiverName}</h2>
      </header>

      <div style={styles.messageList}>
        {messages.map((msg) => (
          <div key={msg.id} style={msg.sender_id === myId ? styles.myMsgWrapper : styles.theirMsgWrapper}>
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
        <button type="submit" style={styles.sendBtn}>Invia</button>
      </form>
    </main>
  );
}

const styles = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column', background: '#050505', color: '#fff', fontFamily: 'sans-serif' },
  header: { padding: '20px', borderBottom: '1px solid #1a1a1a', textAlign: 'center', background: '#0f0f0f' },
  title: { fontSize: '18px', fontWeight: 'bold', margin: 0 },
  messageList: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  myMsgWrapper: { alignSelf: 'flex-end', maxWidth: '80%' },
  theirMsgWrapper: { alignSelf: 'flex-start', maxWidth: '80%' },
  myMsg: { background: '#007AFF', color: '#fff', padding: '12px 16px', borderRadius: '18px 18px 4px 18px', fontSize: '15px' },
  theirMsg: { background: '#222', color: '#fff', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', fontSize: '15px' },
  inputArea: { padding: '20px', background: '#0f0f0f', display: 'flex', gap: '10px', borderTop: '1px solid #1a1a1a' },
  input: { flex: 1, background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '12px', color: '#fff', outline: 'none' },
  sendBtn: { background: '#007AFF', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
};
