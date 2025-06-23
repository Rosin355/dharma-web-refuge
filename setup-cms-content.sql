-- =====================================================
-- SISTEMA CMS PER CONTENUTI DELLE PAGINE
-- =====================================================

-- Tabella per gestire i contenuti editabili delle pagine
CREATE TABLE IF NOT EXISTS public.page_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name VARCHAR(100) NOT NULL, -- 'chi-siamo', 'home', 'insegnamenti', etc.
  section_key VARCHAR(100) NOT NULL, -- 'header-title', 'maestri-taehye-bio', etc.
  section_title VARCHAR(255), -- Titolo visualizzato nell'admin
  content_type VARCHAR(50) DEFAULT 'text', -- 'text', 'html', 'markdown'
  content TEXT NOT NULL,
  editor_instructions TEXT, -- Istruzioni per l'editor
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint per evitare duplicati
  UNIQUE(page_name, section_key)
);

-- Commenti per la documentazione
COMMENT ON TABLE page_contents IS 'Contenuti editabili delle pagine del sito';
COMMENT ON COLUMN page_contents.page_name IS 'Nome della pagina (chi-siamo, home, etc.)';
COMMENT ON COLUMN page_contents.section_key IS 'Chiave univoca della sezione nella pagina';
COMMENT ON COLUMN page_contents.content_type IS 'Tipo di contenuto: text, html, markdown';
COMMENT ON COLUMN page_contents.editor_instructions IS 'Istruzioni per guidare l''editor';

-- RLS (Row Level Security)
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;

-- Policy per lettura pubblica
CREATE POLICY IF NOT EXISTS "page_contents_select_policy"
ON page_contents FOR SELECT
USING (is_active = true);

-- Policy per modifica (solo admin/authenticated)
CREATE POLICY IF NOT EXISTS "page_contents_admin_policy"
ON page_contents FOR ALL
TO authenticated
USING (true);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_page_contents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS page_contents_updated_at_trigger ON page_contents;
CREATE TRIGGER page_contents_updated_at_trigger
  BEFORE UPDATE ON page_contents
  FOR EACH ROW
  EXECUTE FUNCTION update_page_contents_updated_at();

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_page_contents_page_name ON page_contents(page_name);
CREATE INDEX IF NOT EXISTS idx_page_contents_section_key ON page_contents(section_key);
CREATE INDEX IF NOT EXISTS idx_page_contents_active ON page_contents(is_active);
CREATE INDEX IF NOT EXISTS idx_page_contents_order ON page_contents(page_name, display_order);

-- =====================================================
-- POPOLAMENTO INIZIALE - PAGINA CHI SIAMO
-- =====================================================

INSERT INTO page_contents (page_name, section_key, section_title, content_type, content, editor_instructions, display_order) VALUES

-- Header della pagina
('chi-siamo', 'header-title', 'Titolo principale', 'text', 'Chi Siamo', 'Il titolo principale della pagina', 1),
('chi-siamo', 'header-subtitle', 'Sottotitolo', 'text', 'La Comunità Bodhidharma - Tempio Musang Am (Eremo della Non Forma) di Lerici, dove risiediamo e impartiamo l''insegnamento buddhista', 'Breve descrizione sotto il titolo', 2),

-- Sezione Maestri - Titolo
('chi-siamo', 'maestri-title', 'Titolo sezione maestri', 'text', 'I Nostri Maestri', 'Titolo della sezione dedicata ai maestri', 10),

-- Taehye sunim
('chi-siamo', 'taehye-nome', 'Nome Taehye sunim', 'text', 'Taehye sunim 大慧스님 / Mahapañña', 'Nome completo e titoli monastici', 11),
('chi-siamo', 'taehye-bio-breve', 'Biografia breve Taehye', 'text', 'Nome monastico Taehye sunim, nato a Mikkeli, in Finlandia nel 1952', 'Breve introduzione biografica', 12),
('chi-siamo', 'taehye-oggi', 'Taehye oggi', 'html', 'Taehye sunim è presidente, dal 1997, dell''Associazione Culturale "Comunità Bodhidharma" ed inoltre guida spirituale dell''omonima associazione "Bodhidharma" in Finlandia. È impegnato in diverse attività di Dharma e insegnamento delle pratiche di meditazione al Tempio Musang Am 無相庵 di Lerici (SP) ed a Genova. Dal 05/15 è ufficialmente Ministro di Culto dell''Unione Buddhista Italiana.', 'Attività e ruoli attuali di Taehye sunim', 13),

-- Taeri sunim
('chi-siamo', 'taeri-nome', 'Nome Taeri sunim', 'text', 'Taeri sunim 太利스님 / Kumara', 'Nome completo e titoli monastici', 21),
('chi-siamo', 'taeri-bio-breve', 'Biografia breve Taeri', 'text', 'Nome monastico Taeri sunim, nato a Cittadella(PD), Italia nel 1968', 'Breve introduzione biografica', 22),
('chi-siamo', 'taeri-oggi', 'Taeri oggi', 'html', 'Taeri sunim è attualmente impegnato in diverse attività di Dharma e insegnamento delle pratiche di meditazione a Padova, al monastero Musang Am無相庵 di Lerici (SP) e in collaborazione con vari centri della tradizione Theravada dello Sri Lanka presenti in Italia e della Pagoda vietnamita, Chùa Viên Ý, di Polverara (PD). Dal 2018 è ufficialmente Ministro di Culto dell''Unione Buddhista Italiana.', 'Attività e ruoli attuali di Taeri sunim', 23),

-- Ven. Kusalananda
('chi-siamo', 'kusalananda-nome', 'Nome Ven. Kusalananda', 'text', 'Ven. Kusalananda', 'Nome monastico', 31),
('chi-siamo', 'kusalananda-bio-breve', 'Biografia breve Kusalananda', 'text', 'Nome monastico Kusalananda, nato a Genova, in Italia nel 1964', 'Breve introduzione biografica', 32),

-- La Comunità
('chi-siamo', 'comunita-title', 'Titolo sezione comunità', 'text', 'La Comunità', 'Titolo della sezione sulla comunità', 40),
('chi-siamo', 'comunita-storia-title', 'Sottotitolo storia', 'text', 'Storia della Comunità Bodhidharma', 'Sottotitolo per la storia', 41),
('chi-siamo', 'comunita-storia', 'Storia della comunità', 'html', 'L''attività di Taehye sunim in Italia è cominciata nel 1992 alla Pagoda di Rassina (AR). Dopo la morte dell''ing. Martinelli, proprietario della Pagoda, nel 1996 Taehye sunim ha cominciato a cercare un luogo più adatto alla pratica. Nel 1997 è stata fondata l''associazione culturale "Comunità Bodhidharma". Dal 2000 la sede dell''associazione è nel centro monastico Musang Am a Lerici (SP).', 'Storia e origini della comunità', 42),

-- Attività e Tradizione  
('chi-siamo', 'comunita-attivita-title', 'Sottotitolo attività', 'text', 'Attività e Tradizione', 'Sottotitolo per le attività', 43),
('chi-siamo', 'comunita-attivita', 'Attività della comunità', 'html', '<p>La nostra comunità mantiene viva la tradizione buddhista attraverso diverse attività:</p><ul><li>Studi del Buddhadharma e approfondimenti sui sutra</li><li>Ritiri meditativi nella tradizione Seon (Zen)</li><li>Cerimonie e recitazioni tradizionali</li><li>Insegnamenti dei Grandi Maestri</li><li>Gruppi di pratica e meditazione</li></ul><p>La nostra pratica integra elementi della tradizione Chogye coreana, della scuola Theravada e della tradizione cinese, offrendo un percorso completo e autentico.</p>', 'Lista delle attività e tradizioni della comunità', 44),

-- Il Tempio
('chi-siamo', 'tempio-title', 'Titolo sezione tempio', 'text', 'Il Tempio', 'Titolo della sezione dedicata al tempio', 50),
('chi-siamo', 'tempio-subtitle', 'Sottotitolo tempio', 'text', 'Tempio Musang Am (Eremo della Non Forma) - Monti San Lorenzo, Lerici (SP)', 'Descrizione e ubicazione del tempio', 51),

-- Dana
('chi-siamo', 'dana-title', 'Titolo sezione Dana', 'text', 'Pratica di Dana', 'Titolo della sezione donazioni', 60),
('chi-siamo', 'dana-subtitle', 'Sottotitolo Dana', 'text', 'Dana significa "generosità, disponibilità"', 'Spiegazione del significato di Dana', 61),
('chi-siamo', 'dana-5x1000', 'Codice 5x1000', 'text', '95120790100', 'Codice fiscale per il 5x1000', 62),

-- Contatti
('chi-siamo', 'contatti-title', 'Titolo contatti', 'text', 'Tempio Musang Am', 'Titolo della sezione contatti', 70),
('chi-siamo', 'contatti-indirizzo', 'Indirizzo tempio', 'text', 'Monti San Lorenzo, 26 - 19032 Lerici (SP)', 'Indirizzo completo del tempio', 71)

ON CONFLICT (page_name, section_key) DO NOTHING;

-- =====================================================
-- MESSAGGIO FINALE
-- =====================================================

SELECT 'Sistema CMS per contenuti pagine creato con successo! Ora puoi editare i contenuti dal pannello admin.' as status; 