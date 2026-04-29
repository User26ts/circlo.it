
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

  const [mainCat, setMainCat] = useState("musica");
  const [subCat, setSubCat] = useState("Classica & Strumentale");
  const [leafCat, setLeafCat] = useState("sottogeneri");

  // 1. RECUPERO DATI (SUPABASE + LOCALSTORAGE)
  useEffect(() => {
    async function init() {
      try {
        // Carica comuni
        const res = await fetch("https://raw.githubusercontent.com/matteocontrini/comuni-italiani/master/comuni.json");
        const data = await res.json();
        setComuni(data.map(c => c.nome));

        // Carica dati dal browser (se l'utente ha interrotto prima)
        const savedDraft = localStorage.getItem("circlo_onboarding_draft");
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          setFirstName(draft.firstName || "");
          setLastName(draft.lastName || "");
          setCity(draft.city || "");
          setGender(draft.gender || "");
          setBirthDate(draft.birthDate || "");
          setSelectedInterests(draft.selectedInterests || []);
        }

        // Carica dati da Supabase (se esistono già nel DB)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (profile) {
            setFirstName(f => f || profile.first_name || "");
            setLastName(l => l || profile.last_name || "");
            setCity(c => c || profile.city || "");
            setGender(g => g || profile.gender || "");
            setBirthDate(b => b || profile.birth_date || "");
            setSelectedInterests(i => i.length > 0 ? i : (profile.affinity_data?.interests || []));
          }
        }
      } catch (e) {
        console.error("Errore inizializzazione:", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // 2. AUTO-SALVATAGGIO AD OGNI CLICK
  useEffect(() => {
    if (!loading) {
      const draft = { firstName, lastName, city, gender, birthDate, selectedInterests };
      localStorage.setItem("circlo_onboarding_draft", JSON.stringify(draft));
    }
  }, [firstName, lastName, city, gender, birthDate, selectedInterests, loading]);

  // 3. BLOCCO USCITA ACCIDENTALE
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Hai modifiche non salvate!";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const toggleInterest = (item) => {
    setSelectedInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  // 4. SALVATAGGIO FINALE CON GESTIONE ERRORI SERIA
  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utente non loggato");

      const normalizedCity = city.trim().toLowerCase();
      
      const { error } = await supabase.from('profiles').update({
        first_name: firstName,
        last_name: lastName,
        city: normalizedCity,
        gender: gender,
        birth_date: birthDate,
        affinity_data: { 
          interests: selectedInterests,
          updated_at: new Date().toISOString() 
        }
      }).eq('id', user.id);

      if (error) throw error;

      // Se tutto va bene, puliamo il draft locale e andiamo in dashboard
      localStorage.removeItem("circlo_onboarding_draft");
      router.push("/dashboard");

    } catch (err) {
      console.error("ERRORE GRAVE:", err);
      alert(`Errore: ${err.message || "Problema di connessione al database"}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1) return <div style={styles.loading}>Sincronizzazione...</div>;

  return (
    <main style={styles.main}>
      {/* ... [RESTO DEL JSX RIMANE UGUALE] ... */}
    </main>
  );
}

// [STYLES RIMANGONO UGUALI]
