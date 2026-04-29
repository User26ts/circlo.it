
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const CATALOGO_ESTESO = {
  musica: {
    "Classica & Strumentale": {
      sottogeneri: ["Barocco", "Classico", "Romantico", "Tardo-Romantico", "Impressionismo", "Modernismo", "Contemporaneo", "Minimalismo", "Musica Sacra", "Opera", "Musica da Camera", "Sinfonica", "Pianoforte solo", "Musica per archi", "Musica corale", "Colonne Sonore Orchestrali", "Neoclassico", "Avanguardia"],
      periodi: ["Medievale", "Rinascimentale", "Barocco", "Classico", "Romantico", "Moderno", "Contemporaneo"],
      strumenti: ["Pianoforte", "Violino", "Violoncello", "Organo", "Orchestra completa", "Quartetto d'archi", "Voce lirica", "Arpa", "Fiati"],
      compositori: ["Bach", "Vivaldi", "Handel", "Scarlatti", "Mozart", "Haydn", "Beethoven", "Schubert", "Chopin", "Liszt", "Brahms", "Tchaikovsky", "Mahler", "Wagner", "Verdi", "Puccini", "Debussy", "Ravel", "Satie", "Stravinsky", "Shostakovich", "Prokofiev", "Philip Glass", "Steve Reich", "Arvo Pärt", "Ludovico Einaudi", "Max Richter", "Nils Frahm", "Hans Zimmer", "John Williams", "Ennio Morricone"],
      abitudini: ["Ascolto concentrato", "Concerti in teatro", "Studio della musica", "Seguire orchestre", "Collezione registrazioni storiche", "Preferenza per esecuzioni live", "Confronto direttori d'orchestra", "Playlist rilassamento", "Analisi tecnica"]
    },
    "Rock & Alternative": {
      sottogeneri: ["Rock Classico", "Hard Rock", "Punk", "Grunge", "Indie Rock", "Alternative", "Post-Rock"],
      artisti: ["The Beatles", "Pink Floyd", "Led Zeppelin", "Queen", "Nirvana", "Arctic Monkeys", "Radiohead", "The Strokes", "Foo Fighters", "Tame Impala"]
    },
    "Hip Hop & Urban": {
      sottogeneri: ["Rap Italiano", "Trap", "Old School Hip Hop", "Drill", "R&B", "Lo-Fi Hip Hop"],
      artisti: ["Marracash", "Sfera Ebbasta", "Lazza", "Salmo", "Fabri Fibra", "Drake", "Kanye West", "Travis Scott", "Kendrick Lamar", "The Weeknd"]
    },
    "Elettronica & Dance": {
      sottogeneri: ["House", "Techno", "EDM", "Ambient", "Drum & Bass", "Dubstep", "Synthwave"],
      artisti: ["Daft Punk", "Avicii", "Calvin Harris", "Martin Garrix", "Deadmau5", "Charlotte de Witte", "Aphex Twin", "Eric Prydz", "Peggy Gou", "Skrillex"]
    },
    "Pop & Mainstream": {
      sottogeneri: ["Pop internazionale", "Indie Pop", "K-Pop", "Pop elettronico", "Dance Pop"],
      artisti: ["Taylor Swift", "Billie Eilish", "Dua Lipa", "Harry Styles", "Ariana Grande", "Ed Sheeran", "The Weeknd", "Olivia Rodrigo", "BTS", "Coldplay"]
    },
    "Jazz, Blues & Soul": {
       sottogeneri: ["Jazz classico", "Smooth Jazz", "Blues", "Soul", "Funk", "Neo Soul"],
       artisti: ["Miles Davis", "John Coltrane", "Louis Armstrong", "B.B. King", "Ray Charles", "Aretha Franklin", "Stevie Wonder", "Nina Simone", "Erykah Badu", "Herbie Hancock"]
    },
    "Abitudini Generali": {
       lista: ["Concerti live", "Festival musicali", "Ascolto quotidiano", "Musica per lavorare/studiare", "Scoperta musica nuova", "Playlist curate", "Album completi", "Collezione vinili/CD", "Suono uno strumento", "Produco musica"]
    }
  },
  cinema_tv: {
    generi: ["Thriller", "Commedie Romantiche", "Anime", "Documentari", "Horror", "Fantascienza", "Crime/True Crime", "Sitcom", "Dramma", "Azione", "Avventura", "Fantasy", "Storico", "Biografico", "Noir", "Psicologico", "Supereroi", "Teen Drama", "Reality Show", "Animazione", "Western", "Mockumentary"],
    piattaforme: ["Binge Watching", "Solo Cinema", "Serie TV Infinite", "Film d'autore", "Streaming serale", "Maratone nel weekend", "Guardo poco", "Rewatch comfort series", "Lingua originale", "Cinema indipendente", "Blockbuster", "YouTube/Shorts"]
  },
  sport: {
    attivita: ["Palestra/Fitness", "Calcio", "Padel", "Trekking", "Crossfit", "Yoga/Pilates", "Nuoto", "Tennis", "Arrampicata", "Running", "Ciclismo", "Basket", "Arti marziali", "Sci/Snowboard", "Surf", "Skate", "Beach Volley", "Escursionismo", "Allenamenti a casa", "Functional training"]
  },
  viaggi: {
    stile: ["Avventura/Zaino in spalla", "Città d'arte", "Mare e Relax", "Viaggi Low Cost", "Luxury Travel", "Solo Travel", "Road Trip", "Viaggi organizzati", "Weekend brevi", "Viaggi lunghi", "Esperienze autentiche", "Digital nomad", "Cultura", "Natura/Montagna", "On the road", "Viaggi spontanei", "Crociere", "Work & travel"]
  },
  cibo: {
    gusti: ["Sushi/Giapponese", "Pizza Lover", "Cucina Tradizionale", "Sperimentale/Gourmet", "Vegan/Vegetariano", "Street Food", "Amo Cucinare", "Cucina etnica", "Fast food", "Dolci/Pasticceria", "Cibo salutare", "BBQ/Grigliate", "Cucina casalinga", "Food delivery", "Degustazioni vini", "Birre artigianali", "Caffè specialty", "Brunch lover"]
  },
  creativita: {
    hobby: ["Disegno/Illustrazione", "Scrittura Creativa", "Fotografia", "Ceramica/Fai da te", "Pittura", "Montaggio Video", "Graphic Design", "Fashion design", "Calligrafia", "Contenuti social", "DIY/Artigianato", "Musica (comporre/suonare)", "Recitazione", "Danza", "Podcasting", "Storytelling", "Editing foto"]
  },
  tecnologia: {
    interessi: ["Gaming PC", "Console (PS5/Xbox)", "Nintendo/Retro-gaming", "AI", "Cripto/Web3", "Gadget Tech", "Smart home", "Programmazione", "Startup/Innovazione", "Cybersecurity", "VR/AR", "Streaming/Twitch", "Hardware building", "App productivity", "Social media trends", "Tech news", "Automazione"]
  },
  lettura: {
    generi: ["Manga/Fumetti", "Romanzi Fantasy", "Classici", "Saggistica", "Gialli/Noir", "Fantascienza", "Romanzi romantici", "Thriller psicologici", "Biografie", "Business", "Filosofia", "Storia", "Poesia", "Young adult", "Distopici", "Horror", "Libri motivazionali"]
  },
  social_life: {
    stile: ["Clubbing/Discoteche", "Aperitivo Lungo", "Serate Chill", "Feste Private", "Giochi da Tavolo/D&D", "Networking", "Concerti e live", "Cinema con amici", "Cene fuori", "Bar tranquilli", "Pub e birrerie", "Serate improvvisate", "Weekend movimentati", "Introverso/casa", "Gruppi piccoli", "Grandi compagnie"]
  },
  cultura: {
    interessi: ["Mostre d'Arte", "Storia e Archeologia", "Politica e Attualità", "Eventi Locali", "Filosofia", "Musei", "Teatro", "Letteratura", "Conferenze/Talk", "Psicologia", "Sociologia", "Temi ambientali", "Scienza", "Religione/Spiritualità", "Geopolitica", "Cultura pop", "Festival culturali"]
  }
};

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true); // Parte in loading per caricare i dati esistenti
  
  // Dati Profilo
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selected, setSelected] = useState([]);

  // Navigazione Catalogo
  const [mainCat, setMainCat] = useState("musica");

  // 1. RECUPERO DATI ESISTENTI
  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
          setCity(profile.city || "");
          setGender(profile.gender || "");
          setBirthDate(profile.birth_date || "");
          setSelected(profile.affinity_data?.interests || []);
        }
      }
      setLoading(false);
    }
    loadUserData();
  }, []);

  // 2. FUNZIONE SALVATAGGIO (con Normalizzazione Città)
  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Normalizziamo la città: tutto minuscolo e senza spazi extra
      const normalizedCity = city.trim().toLowerCase();

      const { error } = await supabase.from('profiles').update({
        first_name: firstName,
        last_name: lastName,
        city: normalizedCity,
        gender: gender,
        birth_date: birthDate,
        affinity_data: { interests: selected }
      }).eq('id', user.id);

      if (!error) router.push("/dashboard");
      else alert("Errore nel salvataggio");
    }
    setLoading(false);
  };

  if (loading && step === 1) return <div style={styles.loading}>Caricamento profilo...</div>;

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {step === 1 ? (
          <div>
            <h1>Il tuo Profilo</h1>
            <input style={styles.input} placeholder="Nome" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input style={styles.input} placeholder="Cognome (Facoltativo)" value={lastName} onChange={e => setLastName(e.target.value)} />
            
            {/* Genere */}
            <select style={styles.input} value={gender} onChange={e => setGender(e.target.value)}>
              <option value="">Seleziona Genere</option>
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Altro">Altro</option>
            </select>

            {/* Data di Nascita */}
            <label style={styles.label}>Data di Nascita (per calcolare l'età)</label>
            <input type="date" style={styles.input} value={birthDate} onChange={e => setBirthDate(e.target.value)} />

            {/* Città con suggerimenti */}
            <input 
              list="cities" 
              style={styles.input} 
              placeholder="Città (es. Treviso, Milano...)" 
              value={city} 
              onChange={e => setCity(e.target.value)} 
            />
            <datalist id="cities">
              <option value="Milano" /><option value="Roma" /><option value="Padova" /><option value="Treviso" /><option value="Bologna" /><option value="Torino" /><option value="Venezia" />
            </datalist>

            <button style={styles.btnPrimary} onClick={() => setStep(2)}>MODIFICA DNA DIGITALE</button>
          </div>
        ) : (
          <div>
            {/* Qui va la parte del catalogo che hai già, aggiungendo il tasto indietro e il save finale */}
            <h2>DNA Digitale</h2>
            {/* ... (logica catalogo a cascata) ... */}
            <button style={styles.btnSave} onClick={handleSave}>AGGIORNA TUTTO</button>
            <button style={styles.btnBack} onClick={() => setStep(1)}>INDIETRO</button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' },
  card: { background: 'white', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  label: { display: 'block', marginBottom: '5px', fontSize: '12px', color: '#64748b' },
  btnPrimary: { width: '100%', padding: '14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
  btnSave: { width: '100%', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' },
  btnBack: { width: '100%', padding: '10px', background: 'none', color: '#64748b', border: 'none', cursor: 'pointer', marginTop: '10px' },
  loading: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic' }
};
