"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getMyChats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Prendo le stanze dove sono user_1 o user_2
      const { data: rooms, error } = await supabase
        .from('chat_rooms')
        .select(`
          id,
          user_1,
          user_2,
          user_1_approved,
          user_2_approved,
          messages (content, created_at)
        `)
        .or(`user_1.eq.${user.id},user_2.eq.${user.id}`)
        .order('created_at', { foreignTable: 'messages', ascending: false });

      if (rooms) {
        // 2. Per ogni stanza, capisco chi è l'altro e prendo il suo profilo
        const chatData = await Promise.all(rooms.map(async (room) => {
          const otherId = room.user_1 === user.id ? room.user_2 : room.user_1;
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, affinity_data')
            .eq('id', otherId)
            .single();

          const bothApproved = room.user_1_approved && room.user_2_approved;
          const lastMsg = room.messages?.[0]?.content || "Nessun messaggio ancora";

          return {
            id: room.id,
            displayName: bothApproved ? `${profile.first_name} ${profile.last_name}` : "Utente Compatibile",
            lastMessage: lastMsg,
            interests: profile?.affinity_data?.interests || []
          };
        }));

        setChats(chatData);
      }
      setLoading(false);
    }

    getMyChats();
  }, []);

  if (loading) return <div style={styles.center}>Caricamento conversazioni...</div>;

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>I tuoi messaggi</h1>
      </header>

      <div style={styles.list}>
        {chats.length > 0 ? (
          chats.map(chat => (
            <div key={chat.id} onClick={() => router.push(`/chat/${chat.id}`)} style={styles.chatRow}>
              <div style={styles.avatar}>?</div>
              <div style={styles.info}>
                <div style={styles.topRow}>
                  <span style={styles.name}>{chat.displayName}</span>
                </div>
                <p style={styles.lastMsg}>{chat.lastMessage}</p>
                <div style={styles.tags}>
                  {chat.interests.slice(0, 3).map(t => (
                    <span key={t} style={styles.tag}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.empty}>
            <p>Non hai ancora iniziato nessuna conversazione.</p>
            <button onClick={() => router.push('/discovery')} style={styles.btn}>Trova persone</button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' },
  header: { marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: 'bold' },
  chatRow: { display: 'flex', gap: '15px', padding: '15px', backgroundColor: 'white', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', border: '1px solid #eee', transition: '0.2s' },
  avatar: { width: '50px', height: '50px', borderRadius: '25px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' },
  info: { flex: 1 },
  topRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  name: { fontWeight: 'bold', color: '#1e293b' },
  lastMsg: { fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' },
  tags: { display: 'flex', gap: '5px', flexWrap: 'wrap' },
  tag: { fontSize: '10px', color: '#3b82f6', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' },
  btn: { padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' },
  center: { textAlign: 'center', marginTop: '50px' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' }
};
