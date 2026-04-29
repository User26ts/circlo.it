"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function ChatPage({ params }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    // 1. Carica messaggi esistenti e dati stanza
    fetchChatData();

    // 2. Ascolta nuovi messaggi in TEMPO REALE
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${params.id}` },
          (payload) => setMessages(prev => [...prev, payload.new])
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [params.id]);

  const sendMessage = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('messages').insert([
      { room_id: params.id, sender_id: user.id, content: newMessage }
    ]);
    setNewMessage("");
  };

  const handleApprove = async () => {
    // Logica per aggiornare user_1_approved o user_2_approved
    alert("Hai dato il consenso alla condivisione dei dati!");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>Chat di Gruppo</h3>
        {/* Mostra dati personali solo se entrambi approved */}
        {roomData?.user_1_approved && roomData?.user_2_approved ? 
          <p>Dati sbloccati: Mario Rossi - 340...</p> : 
          <button onClick={handleApprove}>Scambia Dati Personali</button>
        }
      </div>
      
      <div style={styles.messagesBox}>
        {messages.map(m => (
          <div key={m.id} style={styles.msg}>{m.content}</div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} />
        <button onClick={sendMessage}>Invia</button>
      </div>
    </div>
  );
}

const styles = { /* ... stili simili all'onboarding ... */ };
