// catalog.js
export const MEGA_CATALOGO = {
  musica: {
    "Rock & Alternative": {
      generi: ["Alternative Rock", "Hard Rock", "Punk Rock", "Heavy Metal", "Grunge", "Indie Rock", "Post-Punk", "Psychedelic", "Prog Rock", "Shoegaze", "Nu Metal", "Garage Rock", "Britpop", "Post-Rock", "Math Rock", "Emo", "Stoner Rock"],
      artisti: ["The Beatles", "Pink Floyd", "Led Zeppelin", "Queen", "Nirvana", "Radiohead", "Arctic Monkeys", "The Smiths", "Metallica", "AC/DC", "The Rolling Stones", "The Cure", "Joy Division", "The Strokes", "Tame Impala", "Linkin Park", "Foo Fighters", "RHCP", "Oasis", "Blur", "Black Sabbath", "Iron Maiden", "David Bowie", "The Clash", "Pixies", "Interpol", "Muse", "Green Day", "Pearl Jam"]
    },
    "Pop & Elettronica": {
      generi: ["Synth-pop", "Dance-pop", "Techno", "House", "Ambient", "Drum & Bass", "K-Pop", "Hyperpop", "Indie Pop", "Disco", "Lo-Fi", "Vaporwave", "Eurodance", "Dubstep", "Trance", "Deep House", "Minimal Techno", "Italo Disco", "Experimental"],
      artisti: ["Daft Punk", "Taylor Swift", "The Weeknd", "Dua Lipa", "Harry Styles", "Billie Eilish", "Lana Del Rey", "Charli XCX", "Aphex Twin", "Peggy Gou", "Calvin Harris", "Depeche Mode", "Pet Shop Boys", "BTS", "Fred again..", "LCD Soundsystem", "Moderat", "Justice", "Disclosure", "Avicii", "Björk", "Flume", "Jamie xx", "Sophie"]
    },
    "Hip Hop & Urban": {
      generi: ["Rap Italiano", "Trap", "Old School", "Lo-fi Hip Hop", "Drill", "R&B", "Soul", "Grime", "Neo-Soul", "Cloud Rap", "Boom Bap", "Afrobeats", "Reggaeton", "Dancehall", "Jazz Rap"],
      artisti: ["Marracash", "Guè", "Salmo", "Fabri Fibra", "Lazza", "Sfera Ebbasta", "Kendrick Lamar", "Drake", "Kanye West", "Travis Scott", "Tyler, The Creator", "Frank Ocean", "J. Cole", "Eminem", "Tupac", "Notorious B.I.G.", "A$AP Rocky", "Post Malone", "Mac Miller", "SZA", "Tedua", "Rkomi", "Ernia", "Noyz Narcos"]
    },
    "Jazz & Classica": {
      generi: ["Barocco", "Classicismo", "Romanticismo", "Minimalismo", "Jazz Classico", "Fusion", "Bossa Nova", "Blues", "Opera", "Colonne Sonore", "Swing", "Free Jazz", "Musica da camera"],
      artisti: ["Bach", "Mozart", "Beethoven", "Chopin", "Debussy", "Miles Davis", "John Coltrane", "Bill Evans", "Chet Baker", "Ennio Morricone", "Hans Zimmer", "Ludovico Einaudi", "Max Richter", "Nina Simone", "Ella Fitzgerald", "B.B. King"]
    }
  },
  cibo: {
    "Cucina Italiana": {
      nord: ["Veneto (Baccalà, Spritz)", "Lombardia (Risotto, Cotoletta)", "Piemonte (Tartufo, Barolo)", "Liguria (Pesto, Focaccia)", "Emilia-Romagna (Lasagna, Tortellini)", "Friuli-Venezia Giulia", "Trentino-Alto Adige"],
      centro: ["Toscana (Fiorentina)", "Lazio (Carbonara)", "Umbria", "Marche", "Abruzzo"],
      sud_isole: ["Campania (Pizza)", "Sicilia (Arancini)", "Puglia (Orecchiette)", "Calabria", "Sardegna", "Basilicata", "Molise"]
    },
    "Mondo & Lifestyle": {
      internazionale: ["Giapponese/Sushi", "Cinese", "Messicano", "Indiano", "Thailandese", "Greco", "Mediorientale", "Poke", "American BBQ", "Coreano", "Peruviano", "Vietnamita", "Libanese", "Spagnolo/Tapas"],
      abitudini: ["Vegan", "Vegetariano", "Senza Glutine", "Bio/Km 0", "Amo Cucinare", "Fine Dining", "Healthy Food", "Fast Food Lover", "Brunch", "Street Food", "Aperitivo Lungo", "Vini Naturali", "Birre Artigianali"]
    }
  },
  passioni_nerd: {
    "Gaming": {
      piattaforme: ["PC Master Race", "PlayStation", "Xbox", "Nintendo Switch", "Retro-gaming", "Mobile Gaming", "VR/Realtà Virtuale"],
      generi: ["RPG/GDR", "FPS/Sparatutto", "MOBA", "Souls-like", "Indie Games", "Simulazione", "Horror Games", "Battle Royale", "E-sports", "MMORPG", "Strategia"]
    },
    "Cultura Pop": {
      interessi: ["Manga", "Anime", "Cosplay", "Marvel/DC", "Star Wars", "Harry Potter", "Il Signore degli Anelli", "Collezionismo", "Action Figures", "Fumetti d'autore", "D&D / Giochi di ruolo", "Giochi da tavolo", "Magic: The Gathering", "Warhammer"]
    }
  },
  benessere_sport: {
    "Sport": {
      classici: ["Calcio", "Padel", "Tennis", "Basket", "Pallavolo", "Nuoto", "Running", "Ciclismo", "Trekking/Hiking", "Arrampicata/Climbing", "Golf", "Arti Marziali", "Boxe", "Palestra/Bodybuilding", "Crossfit"],
      outdoor: ["Surf/Skate", "Sci/Snowboard", "Paracadutismo", "Subacquea", "Vela", "Equitazione", "Motociclismo", "Downhill"]
    },
    "Mind & Body": {
      self_care: ["Yoga", "Pilates", "Meditazione", "Mindfulness", "Skincare Lover", "Biohacking", "Calisthenics", "Sauna/SPA"]
    }
  },
  hobby_creativita: {
    "Arte": ["Pittura", "Disegno/Illustrazione", "Fotografia Analogica", "Fotografia Digitale", "Graphic Design", "Ceramica", "Scultura", "Street Art", "Fashion Design", "Calligrafia", "Montaggio Video"],
    "Tempo Libero": ["Giardinaggio", "Piante da appartamento", "Arredamento", "Fai da te", "Cucito/Maglia", "Scacchi", "Scrittura Creativa", "Poesia", "Podcast", "Lettura", "Astrologia", "Tarocchi", "Volontariato"]
  },
  cultura_studio: {
    "Interessi": ["Filosofia", "Storia", "Psicologia", "Sociologia", "Politica", "Economia", "Scienza", "Astronomia", "Tecnologia/AI", "Coding", "Lingue Straniere", "Geopolitica", "Crescita Personale", "Finanza Personale"]
  },
  viaggi: {
    "Stile": ["Zaino in spalla", "Road Trip", "Luxury/Resort", "Città d'arte", "Natura Selvaggia", "Digital Nomad", "Campeggio/Van Life", "Crociere", "Weekend fuori porta", "Viaggi di gruppo", "Solo Travel", "Interrail"]
  }
};
