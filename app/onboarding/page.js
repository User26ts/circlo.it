"use client";
import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState("");
  
  // Stati per la Navigazione a Cascata
  const [mainCat, setMainCat] = useState("musica");
  const [subCat, setSubCat] = useState("Classica & Strumentale");
  const [leafCat, setLeafCat] = useState("sottogeneri");
  const [selected, setSelected] = useState([]);

  const toggleItem = (item) => {
    setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleFinish = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({
        first_name: firstName, city: city,
        affinity_data: { interests: selected }
      }).eq('id', user.id);
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <main style={{minHeight: '100vh', background: '#f0f9ff', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif'}}>
      <div style={{background: 'white', padding: '35px', borderRadius: '30px', width: '100%', maxWidth: '900px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
        
        {step === 1 ? (
          <div style={{textAlign: 'center'}}>
            <h1>Benvenuto su CIRCLO</h1>
            <input style={styles.input} placeholder="Il tuo Nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input style={styles.input} placeholder="Tua Città" value={city} onChange={(e) => setCity(e.target.value)} />
            <button style={styles.btnPrimary} onClick={() => setStep(2)}>PROSEGUI</button>
          </div>
        ) : (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
              <button onClick={() => setStep(1)} style={{background: 'none', border: 'none', color: '#64748b', cursor: 'pointer'}}>← INDIETRO</button>
              <h2 style={{margin: 0}}>DNA DIGITALE ({selected.length})</h2>
              <div style={{width: '60px'}}></div>
            </div>

            {/* LIVELLO 1: MACRO CATEGORIE */}
            <div style={styles.scrollNav}>
              {Object.keys(CATALOGO_ESTESO).map(cat => (
                <button key={cat} onClick={() => {setMainCat(cat); setSubCat(Object.keys(CATALOGO_ESTESO[cat])[0]); setLeafCat(Object.keys(CATALOGO_ESTESO[cat][Object.keys(CATALOGO_ESTESO[cat])[0]])[0] || "lista")}}
                style={mainCat === cat ? styles.navActive : styles.nav}>{cat.toUpperCase()}</button>
              ))}
            </div>

            {/* LIVELLO 2: SOTTO CATEGORIE */}
            <div style={styles.scrollNav}>
              {Object.keys(CATALOGO_ESTESO[mainCat]).map(sub => (
                <button key={sub} onClick={() => {setSubCat(sub); setLeafCat(Object.keys(CATALOGO_ESTESO[mainCat][sub])[0] || "lista")}}
                style={subCat === sub ? styles.subActive : styles.sub}>{sub}</button>
              ))}
            </div>

            {/* LIVELLO 3: FOGLIE (Se esistono più tipi come sottogeneri/artisti) */}
            {mainCat === "musica" && subCat !== "Abitudini Generali" && (
              <div style={{display: 'flex', gap: '10px', marginBottom: '15px', justifyContent: 'center'}}>
                {Object.keys(CATALOGO_ESTESO[mainCat][subCat]).map(leaf => (
                  <button key={leaf} onClick={() => setLeafCat(leaf)}
                  style={leafCat === leaf ? styles.leafActive : styles.leaf}>{leaf.toUpperCase()}</button>
                ))}
              </div>
            )}

            {/* GRIGLIA ELEMENTI */}
            <div style={styles.grid}>
              {(CATALOGO_ESTESO[mainCat][subCat][leafCat] || CATALOGO_ESTESO[mainCat][subCat]["lista"] || CATALOGO_ESTESO[mainCat][subCat]).map(item => (
                <div key={item} onClick={() => toggleItem(item)} style={selected.includes(item) ? styles.itemActive : styles.item}>{item}</div>
              ))}
            </div>

            <button style={styles.btnSave} onClick={handleFinish} disabled={loading}>{loading ? "SALVATAGGIO..." : "SALVA E SCOPRI CHI TI SOMIGLIA"}</button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  input: { width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #ddd', marginBottom: '15px', fontSize: '16px' },
  btnPrimary: { width: '100%', padding: '15px', borderRadius: '100px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  scrollNav: { display: 'flex', gap: '8px', overflowX: 'auto', padding: '10px 0', borderBottom: '1px solid #f1f5f9', marginBottom: '10px' },
  nav: { padding: '8px 15px', borderRadius: '20px', border: '1px solid #ddd', background: 'white', whiteSpace: 'nowrap', cursor: 'pointer', fontSize: '13px' },
  navActive: { padding: '8px 15px', borderRadius: '20px', border: 'none', background: '#3b82f6', color: 'white', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 'bold' },
  sub: { padding: '6px 12px', borderRadius: '12px', border: '1px solid #eee', background: '#f8fafc', whiteSpace: 'nowrap', cursor: 'pointer', fontSize: '12px' },
  subActive: { padding: '6px 12px', borderRadius: '12px', border: '1px solid #3b82f6', color: '#3b82f6', background: 'white', whiteSpace: 'nowrap', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  leaf: { padding: '4px 10px', borderRadius: '5px', border: 'none', background: '#e2e8f0', color: '#475569', fontSize: '10px', cursor: 'pointer' },
  leafActive: { padding: '4px 10px', borderRadius: '5px', border: 'none', background: '#475569', color: 'white', fontSize: '10px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', maxHeight: '280px', overflowY: 'auto', padding: '10px', background: '#fafafa', borderRadius: '15px' },
  item: { padding: '10px', background: 'white', borderRadius: '10px', border: '1px solid #eee', cursor: 'pointer', fontSize: '13px', textAlign: 'center' },
  itemActive: { padding: '10px', background: '#3b82f6', color: 'white', borderRadius: '10px', border: 'none', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' },
  btnSave: { width: '100%', padding: '18px', borderRadius: '100px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }
};

Il tuo mazzo di slide e il codice sono pronti! Ho organizzato il catalogo con una **struttura a tre livelli** (Macro -> Sotto-categoria -> Tipo Elemento) così gli utenti non si perdono tra migliaia di nomi. Fammi sapere se vuoi fare altre modifiche!
