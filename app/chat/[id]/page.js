"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function ChatPage({ params }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomData, setRoomData] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [myId, setMyId] = useState(null);

  // 1. Funzione per caricare i dati della chat e degli utenti
  const fetchChatData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setMyId(user.id);

    // Recupera dati stanza
    const { data: room } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', params.id)
      .single();

    if (room) {
      setRoomData(room);
      
      // Identifica l'ID dell'altro utente
      const otherId = room.user_1 === user.id ? room.user_2 : room.user_1;
      
      // Recupera profilo dell'altro utente
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherId)
        .single();
      
      setOtherUser(profile);
    }

    // Recupera messaggi precedenti
    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', params.id)
      .order('created_at', { ascending: true });
    
    if (msgs) setMessages(msgs);
  }, [params.id]);

  useEffect(() => {
    fetchChatData();

    // 2. Realtime: Ascolta messaggi E cambiamenti alla stanza (consensi)
    const channel = supabase
      .channel(`room-${params.id}`)
      .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${params.id}` },
          (payload) => setMessages(prev => [...prev, payload.new])
      )
      .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'chat_rooms', filter: `id=eq.${params.id}` },
          (payload) => setRoomData(payload.new)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [params.id, fetchChatData]);

  // 3. Invio messaggio
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await supabase.from('messages').insert([
      { room_id: params.id, sender_id: myId, content: newMessage }
    ]);
    setNewMessage("");
  };

  // 4. Gestione Approvazione (Doppio Consenso)
  const handleApprove = async () => {
    if (!roomData || !myId) return;

    const columnToUpdate = roomData.user_1 === myId ? 'user_1_approved' : 'user_2_approved';
    
    const { error } = await supabase
      .from('chat_rooms')
      .update({ [columnToUpdate]: true })
      .eq('id', params.id);

    if (error) alert("Errore: " + error.message);
    else alert("Hai dato il tuo consenso!");
  };

  // Controllo se i dati sono sbloccati
  const isUnlocked = roomData?.user_1_approved && roomData?.user_2_approved;
  const iHaveApproved = roomData?.user_1 === myId ? roomData?.user_1_approved : roomData?.user_2_approved;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {isUnlocked ? (
          <div style={styles.unlockedInfo}>
            <h3 style={styles.name}>{otherUser?.first_name} {otherUser?.last_name}</h3>
            <p style={styles.subText}>📍 {otherUser?.city?.toUpperCase()}</p>
          </div>
        ) : (
          <div style={styles.lockedInfo}>
            <h3>Utente Compatibile</h3>
            <p style={styles.subText}>Dati personali nascosti</p>
            <button 
              onClick={handleApprove} 
              disabled={iHaveApproved}
              style={iHaveApproved ? styles.btnWait : styles.btnApprove}
            >
              {iHaveApproved ? "In attesa dell'altro..." : "🤝 Scambia Dati Personali"}
            </button>
          </div>
        )}
      </div>
      
      <div style={styles.messagesBox}>
        {messages.map(m => (
          <div 
            key={m.id} 
            style={m.sender_id === myId ? styles.myMsg : styles.theirMsg}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input 
          style={styles.input}
          placeholder="Scrivi un messaggio..."
          value={newMessage} 
          onChange={e => setNewMessage(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button style={styles.sendBtn} onClick={sendMessage}>Invia</button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' },
  header: { padding: '20px', background: 'white', borderBottom: '1px solid #e2e8f0', textAlign: 'center' },
  name: { margin: 0, color: '#1e293b' },
  subText: { margin: '5px 0', fontSize: '12px', color: '#64748b' },
  btnApprove: { background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
  btnWait: { background: '#e2e8f0', color: '#64748b', border: 'none', padding: '8px 16px', borderRadius: '20px', marginTop: '10px' },
  messagesBox: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  myMsg: { alignSelf: 'flex-end', background: '#3b82f6', color: 'white', padding: '10px 15px', borderRadius: '15px 15px 0 15px', maxWidth: '70%' },
  theirMsg: { alignSelf: 'flex-start', background: 'white', color: '#1e293b', padding: '10px 15px', borderRadius: '15px 15px 15px 0', maxWidth: '70%', border: '1px solid #e2e8f0' },
  inputArea: { padding: '20px', background: 'white', display: 'flex', gap: '10px', borderTop: '1px solid #e2e8f0' },
  input: { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' },
  sendBtn: { background: '#10b981', color: 'white', border: 'none', padding: '0 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }
};
