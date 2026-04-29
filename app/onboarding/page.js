

"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

const CATALOGO_ESTESO = {
  musica: {
    "Classica & Strumentale": {
      sottogeneri: ["Barocco", "Classico", "Romantico", "Tardo-Romantico", "Impressionismo", "Modernismo", "Contemporaneo", "Minimalismo", "Musica Sacra", "Opera", "Musica da Camera", "Sinfonica", "Pianoforte solo", "Musica per archi", "Musica corale", "Colonne Sonore Orchestrali", "Neoclassico", "Avanguardia"],
      compositori: ["Bach", "Vivaldi", "Handel", "Mozart", "Beethoven", "Chopin", "Liszt", "Brahms", "Tchaikovsky", "Mahler", "Wagner", "Verdi", "Puccini", "Debussy", "Ravel", "Satie", "Stravinsky", "Shostakovich", "Prokofiev", "Philip Glass", "Steve Reich", "Arvo Pärt", "Ludovico Einaudi", "Max Richter", "Nils Frahm", "Hans Zimmer", "John Williams", "Ennio Morricone"],
      abitudini: ["Ascolto concentrato", "Concerti in teatro", "Studio della musica", "Collezione registrazioni storiche", "Playlist rilassamento", "Analisi tecnica"]
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
    piattaforme: ["Binge Watching", "Solo Cinema", "Serie TV Infinite", "Film d'autore", "Streaming serale", "Maratone nel weekend", "Rewatch comfort series", "Lingua originale", "Cinema indipendente", "Blockbuster", "YouTube/Shorts"]
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

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [comuni, setComuni] = useState([]);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Navigazione Catalogo State
  const [mainCat, setMainCat] = useState("musica");
  const [subCat, setSubCat] = useState("Classica & Strumentale");
  const [leafCat, setLeafCat] = useState("sottogeneri");

  // 1. CARICAMENTO COMUNI E DATI UTENTE
  useEffect(() => {
    async function init() {
      // Scarica tutti i comuni d'Italia (7901 comuni)
      try {
        const res = await fetch("https://raw.githubusercontent.com/matteocontrini/comuni-italiani/master/comuni.json");
        const data = await res.json();
        setComuni(data.map(c => c.nome));
      } catch (e) { console.error("Errore comuni"); }

      // Carica profilo esistente
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
          setCity(profile.city || "");
          setGender(profile.gender || "");
          setBirthDate(profile.birth_date || "");
          setSelectedInterests(profile.affinity_data?.interests || []);
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  const toggleInterest = (item) => {
    setSelectedInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const normalizedCity = city.trim().toLowerCase();
      const { error } = await supabase.from('profiles').update({
        first_name: firstName,
        last_name: lastName,
        city: normalizedCity,
        gender: gender,
        birth_date: birthDate,
        affinity_data: { interests: selectedInterests }
      }).eq('id', user.id);

      if (!error) router.push("/dashboard");
      else alert("Errore nel salvataggio");
    }
    setLoading(false);
  };

  if (loading && step === 1) return <div style={styles.loading}>Sincronizzazione dati...</div>;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        
        {step === 1 ? (
          <div>
            <h1 style={styles.title}>Il tuo Profilo</h1>
            <p style={styles.subtitle}>Questi dati aiuteranno il Circlo a trovarti amici vicini.</p>
            
            <div style={styles.formGroup}>
              <input style={styles.input} placeholder="Nome" value={firstName} onChange={e => setFirstName(e.target.value)} />
              <input style={styles.input} placeholder="Cognome (Facoltativo)" value={lastName} onChange={e => setLastName(e.target.value)} />
              
              <select style={styles.input} value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Genere</option>
                <option value="M">Uomo</option>
                <option value="F">Donna</option>
                <option value="NB">Non-Binary</option>
              </select>

              <label style={styles.label}>Data di Nascita</label>
              <input type="date" style={styles.input} value={birthDate} onChange={e => setBirthDate(e.target.value)} />

              <input list="listaComuni" style={styles.input} placeholder="In che città vivi?" value={city} onChange={e => setCity(e.target.value)} />
              <datalist id="listaComuni">
                {comuni.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            <button style={styles.btnNext} onClick={() => setStep(2)}>CONFIGURA DNA DIGITALE →</button>
          </div>
        ) : (
          <div>
            <div style={styles.header}>
              <button onClick={() => setStep(1)} style={styles.btnBack}>← PROFILO</button>
              <h2 style={{margin:0}}>DNA ({selectedInterests.length})</h2>
              <div style={{width:60}}></div>
            </div>

            {/* LIVELLO 1: MACRO */}
            <div style={styles.navScroll}>
              {Object.keys(CATALOGO_ESTESO).map(cat => (
                <button key={cat} onClick={() => {setMainCat(cat); setSubCat(Object.keys(CATALOGO_ESTESO[cat])[0]);}} 
                style={mainCat === cat ? styles.tabActive : styles.tab}>{cat.toUpperCase()}</button>
              ))}
            </div>

            {/* LIVELLO 2: SUB */}
            <div style={styles.navScroll}>
              {Object.keys(CATALOGO_ESTESO[mainCat]).map(sub => (
                <button key={sub} onClick={() => {setSubCat(sub); setLeafCat(Object.keys(CATALOGO_ESTESO[mainCat][sub])[0] || "lista")}}
                style={subCat === sub ? styles.subActive : styles.sub}>{sub}</button>
              ))}
            </div>

            {/* LIVELLO 3: LEAF (Solo musica) */}
            {mainCat === "musica" && subCat !== "Abitudini Generali" && (
              <div style={styles.leafBox}>
                {Object.keys(CATALOGO_ESTESO[mainCat][subCat]).map(leaf => (
                  <button key={leaf} onClick={() => setLeafCat(leaf)}
                  style={leafCat === leaf ? styles.leafActive : styles.leaf}>{leaf.toUpperCase()}</button>
                ))}
              </div>
            )}

            {/* GRIGLIA ELEMENTI */}
            <div style={styles.grid}>
              {(CATALOGO_ESTESO[mainCat][subCat][leafCat] || CATALOGO_ESTESO[mainCat][subCat]["lista"] || CATALOGO_ESTESO[mainCat][subCat]).map(item => (
                <div key={item} onClick={() => toggleInterest(item)} style={selectedInterests.includes(item) ? styles.itemActive : styles.item}>{item}</div>
              ))}
            </div>

            <button style={styles.btnFinish} onClick={handleSave} disabled={loading}>{loading ? "SALVATAGGIO..." : "SALVA ED ENTRA NEL CIRCLO"}</button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: { minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' },
  card: { background: 'white', padding: '30px', borderRadius: '32px', width: '100%', maxWidth: '850px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' },
  title: { fontSize: '28px', marginBottom: '5px', color: '#1e293b' },
  subtitle: { color: '#64748b', marginBottom: '25px' },
  formGroup: { marginBottom: '20px' },
  input: { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '12px', fontSize: '16px' },
  label: { fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' },
  btnNext: { width: '100%', padding: '16px', borderRadius: '100px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  btnBack: { background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' },
  navScroll: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' },
  tab: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white', whiteSpace: 'nowrap', cursor: 'pointer' },
  tabActive: { padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#1e293b', color: 'white', whiteSpace: 'nowrap', fontWeight: 'bold' },
  sub: { padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f1f5f9', whiteSpace: 'nowrap', cursor: 'pointer', fontSize: '12px' },
  subActive: { padding: '6px 12px', borderRadius: '10px', border: '1px solid #3b82f6', background: 'white', color: '#3b82f6', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '12px' },
  leafBox: { display: 'flex', gap: '8px', marginBottom: '10px', justifyContent: 'center' },
  leaf: { padding: '4px 10px', borderRadius: '5px', border: 'none', background: '#e2e8f0', fontSize: '10px', cursor: 'pointer' },
  leafActive: { padding: '4px 10px', borderRadius: '5px', border: 'none', background: '#64748b', color: 'white', fontSize: '10px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', maxHeight: '300px', overflowY: 'auto', padding: '15px', background: '#f8fafc', borderRadius: '16px' },
  item: { padding: '10px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '13px', textAlign: 'center' },
  itemActive: { padding: '10px', background: '#3b82f6', color: 'white', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' },
  btnFinish: { width: '100%', padding: '18px', borderRadius: '100px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' },
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontStyle: 'italic' }
};
