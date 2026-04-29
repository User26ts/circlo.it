
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient("https://cuntsizxhdoenlmldkrp.supabase.co", "sb_publishable_Snz15uB3yB77q13OuN6oIA_laubStQK");

const MEGA_CATALOGO = {
  musica: {
    "Rock & Metal": {
      generi: ["Alternative Rock", "Hard Rock", "Punk Rock", "Heavy Metal", "Grunge", "Indie Rock", "Post-Punk", "Psychedelic Rock", "Prog Rock", "Shoegaze"],
      artisti: ["The Beatles", "Pink Floyd", "Led Zeppelin", "Queen", "Nirvana", "Radiohead", "Arctic Monkeys", "The Smiths", "Metallica", "AC/DC", "The Rolling Stones", "The Cure", "Joy Division", "The Strokes", "Tame Impala", "Linkin Park", "Foo Fighters", "Red Hot Chili Peppers"]
    },
    "Pop & Elettronica": {
      generi: ["Synth-pop", "Dance-pop", "Techno", "House", "Ambient", "Drum & Bass", "K-Pop", "Hyperpop", "Indie Pop", "Disco", "Lo-Fi"],
      artisti: ["Daft Punk", "Taylor Swift", "The Weeknd", "Dua Lipa", "Harry Styles", "Billie Eilish", "Lana Del Rey", "Charli XCX", "Aphex Twin", "Peggy Gou", "Calvin Harris", "Depeche Mode", "Pet Shop Boys", "BTS", "Fred again.."]
    },
    "Hip Hop & Urban": {
      generi: ["Rap Italiano", "Trap", "Old School", "Lo-fi Hip Hop", "Drill", "R&B", "Soul", "Grime"],
      artisti: ["Marracash", "Guè", "Salmo", "Fabri Fibra", "Lazza", "Sfera Ebbasta", "Kendrick Lamar", "Drake", "Kanye West", "Travis Scott", "Tyler, The Creator", "Frank Ocean", "J. Cole", "Eminem", "Tupac", "Notorious B.I.G."]
    },
    "Classica & Jazz": {
      generi: ["Barocco", "Classicismo", "Romanticismo", "Minimalismo", "Jazz Classico", "Fusion", "Bossa Nova", "Blues", "Opera", "Colonne Sonore"],
      artisti: ["Bach", "Mozart", "Beethoven", "Chopin", "Debussy", "Miles Davis", "John Coltrane", "Bill Evans", "Chet Baker", "Ennio Morricone", "Hans Zimmer", "Ludovico Einaudi", "Max Richter"]
    }
  },
  cibo: {
    "Cucina Italiana": {
      regioni: ["Toscana", "Siciliana", "Pugliese", "Emiliana", "Romana", "Campana", "Veneta", "Piemontese", "Ligure", "Calabrese"],
      specialita: ["Pizza Contemporanea", "Pasta Fresca", "Street Food", "Vini Rossi", "Bollicine", "Formaggi stagionati", "Gelato Artigianale", "Tartufo", "Pasticceria Siciliana"]
    },
    "Cucina Internazionale": {
      etnico: ["Giapponese/Sushi", "Cinese", "Messicano", "Indiano", "Thailandese", "Greco", "Mediorientale/Kebab", "Poke", "American BBQ", "Coreano", "Peruviano/Ceviche"]
    },
    "Stile di Vita": {
      dieta: ["Vegan", "Vegetariano", "Senza Glutine", "Bio/Km 0", "Amo Cucinare", "Fine Dining/Gourmet", "Healthy Food", "Fast Food Lover"]
    }
  },
  tempo_libero: {
    "Cinema & TV": {
      generi: ["Sci-Fi", "Horror", "Thriller", "Drammatico", "Sitcom", "Anime", "Documentari", "Crime/True Crime", "Noir", "Animazione d'autore", "Film d'essai"],
      culto: ["Star Wars", "Marvel/DC", "Harry Potter", "Il Trono di Spade", "Studio Ghibli", "Wes Anderson", "Quentin Tarantino", "Christopher Nolan"]
    },
    "Sport & Outdoor": {
      attivita: ["Palestra/Crossfit", "Calcio", "Padel", "Tennis", "Yoga/Pilates", "Trekking/Hiking", "Arrampicata", "Running", "Nuoto", "Ciclismo", "Basket", "Sci/Snowboard", "Surf", "Skate"]
    },
    "Hobby & Nerd": {
      interessi: ["Gaming (PC/Console)", "Board Games/D&D", "Lettura/Libri", "Manga/Fumetti", "Fotografia", "Pittura/Disegno", "Scrittura", "Tecnologia/AI", "Collezionismo", "Astronomia", "Giardinaggio", "Fai da te"]
    }
  },
  viaggi: {
    "Stile di Viaggio": ["Zaino in spalla", "Road Trip", "Luxury/Resort", "Città d'arte", "Natura Selvaggia", "Digital Nomad", "Campeggio/Van Life", "Crociere", "Weekend fuori porta", "Viaggi di gruppo"]
  }
};

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dati Profilo
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selected, setSelected] = useState([]);

  // Navigazione Catalogo
  const [mainCat, setMainCat] = useState("musica");
  const [subCat, setSubCat] = useState(Object.keys(MEGA_CATALOGO.musica)[0]);
  const [leafCat, setLeafCat] = useState(null);

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  const toggle = (item) => {
    setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('profiles').update({
      first_name: firstName, last_name: lastName, city: city.trim().toLowerCase(),
      gender, birth_date: birthDate || null,
      affinity_data: { interests: selected }
    }).eq('id', user.id);

    if (!error) router.push("/dashboard");
    else alert("Errore: " + error.message);
    setLoading(false);
  };

  // Logica per estrarre gli elementi filtrati
  const getItems = () => {
    let items = [];
    const current = MEGA_CATALOGO[mainCat];

    if (Array.isArray(current)) {
      items = current;
    } else {
      const sub = current[subCat];
      if (Array.isArray(sub)) {
        items = sub;
      } else {
        // Se è un oggetto a 3 livelli (es musica)
        if (!leafCat) {
          // Se non ho ancora scelto il terzo livello, mostro tutto il contenuto della subCat
          items = Object.values(sub).flat();
        } else {
          items = sub[leafCat] || [];
        }
      }
    }

    if (searchTerm) {
      return items.filter(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return items;
  };

  if (loading) return <div style={styles.loading}>Caricamento...</div>;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        
        {step === 1 ? (
          <div>
            <h2 style={styles.title}>Completa il tuo profilo</h2>
            <div style={styles.formGrid}>
              <input style={styles.input} placeholder="Nome" value={firstName} onChange={e=>setFirstName(e.target.value)} />
              <input style={styles.input} placeholder="Cognome" value={lastName} onChange={e=>setLastName(e.target.value)} />
              <select style={styles.input} value={gender} onChange={e=>setGender(e.target.value)}>
                <option value="">Genere</option>
                <option value="M">Uomo</option>
                <option value="F">Donna</option>
                <option value="NB">Non-Binary</option>
              </select>
              <input type="date" style={styles.input} value={birthDate} onChange={e=>setBirthDate(e.target.value)} />
              <input style={{...styles.input, gridColumn: '1 / -1'}} placeholder="Città (es. Treviso)" value={city} onChange={e=>setCity(e.target.value)} />
            </div>
            <button style={styles.btnMain} onClick={()=>setStep(2)}>CONFIGURA DNA DIGITALE →</button>
          </div>
        ) : (
          <div>
            <div style={styles.header}>
              <button style={styles.btnText} onClick={()=>setStep(1)}>← DATI</button>
              <h3 style={{margin:0}}>INTERESSI ({selected.length})</h3>
              <button style={styles.btnSaveTop} onClick={handleSave}>SALVA</button>
            </div>

            {/* Menu Categorie principali */}
            <div style={styles.scrollRow}>
              {Object.keys(MEGA_CATALOGO).map(cat => (
                <button key={cat} onClick={()=>{setMainCat(cat); setSubCat(Object.keys(MEGA_CATALOGO[cat])[0]); setLeafCat(null);}} 
                style={mainCat === cat ? styles.pillActive : styles.pill}>{cat.toUpperCase()}</button>
              ))}
            </div>

            {/* Sotto-categorie (se esistono) */}
            {typeof MEGA_CATALOGO[mainCat] === 'object' && !Array.isArray(MEGA_CATALOGO[mainCat]) && (
              <div style={styles.scrollRow}>
                {Object.keys(MEGA_CATALOGO[mainCat]).map(sub => (
                  <button key={sub} onClick={()=>{setSubCat(sub); setLeafCat(null);}} 
                  style={subCat === sub ? styles.subPillActive : styles.subPill}>{sub}</button>
                ))}
              </div>
            )}

            {/* Terzo livello (es. Generi vs Artisti) */}
            {typeof MEGA_CATALOGO[mainCat][subCat] === 'object' && !Array.isArray(MEGA_CATALOGO[mainCat][subCat]) && (
              <div style={styles.scrollRow}>
                {Object.keys(MEGA_CATALOGO[mainCat][subCat]).map(leaf => (
                  <button key={leaf} onClick={()=>setLeafCat(leaf)} 
                  style={leafCat === leaf ? styles.leafActive : styles.leaf}>{leaf.toUpperCase()}</button>
                ))}
              </div>
            )}

            {/* BARRA DI RICERCA */}
            <input 
              style={styles.searchInput} 
              placeholder={`Cerca in ${leafCat || subCat || mainCat}...`} 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            {/* GRIGLIA ITEMS */}
            <div style={styles.grid}>
              {getItems().map(item => (
                <div key={item} onClick={()=>toggle(item)} 
                style={selected.includes(item) ? styles.itemActive : styles.item}>{item}</div>
              ))}
            </div>

            <button style={styles.btnSaveBottom} onClick={handleSave}>CONCLUDI E TROVA AFFINITÀ</button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: { minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, sans-serif' },
  card: { background: 'white', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '800px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' },
  title: { fontSize: '22px', fontWeight: '800', marginBottom: '20px', textAlign: 'center', color: '#0f172a' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '25px' },
  input: { padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none' },
  searchInput: { width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #3b82f6', marginBottom: '15px', fontSize: '14px', outline: 'none' },
  btnMain: { width: '100%', padding: '16px', borderRadius: '15px', border: 'none', background: '#0f172a', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  scrollRow: { display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' },
  pill: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12px' },
  pillActive: { padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '12px' },
  subPill: { padding: '6px 12px', borderRadius: '10px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap' },
  subPillActive: { padding: '6px 12px', borderRadius: '10px', background: '#94a3b8', color: 'white', cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap' },
  leaf: { padding: '4px 10px', borderRadius: '6px', border: '1px solid #ddd', background: 'none', fontSize: '10px', cursor: 'pointer' },
  leafActive: { padding: '4px 10px', borderRadius: '6px', background: '#333', color: 'white', border: 'none', fontSize: '10px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', maxHeight: '320px', overflowY: 'auto', padding: '15px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' },
  item: { padding: '12px 8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', fontSize: '12px', transition: '0.2s' },
  itemActive: { padding: '12px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  btnSaveBottom: { width: '100%', padding: '16px', borderRadius: '100px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' },
  btnSaveTop: { padding: '6px 15px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  btnText: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 'bold' },
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', color: '#64748b' }
};
