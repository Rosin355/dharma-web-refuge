
-- =====================================================
-- SISTEMA CMS PER CONTENUTI DELLE PAGINE (VERSIONE CORRETTA)
-- =====================================================

-- Tabella per gestire i contenuti editabili delle pagine
CREATE TABLE IF NOT EXISTS public.page_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name VARCHAR(100) NOT NULL,
  section_key VARCHAR(100) NOT NULL,
  section_title VARCHAR(255),
  content_type VARCHAR(50) DEFAULT 'text',
  content TEXT NOT NULL,
  editor_instructions TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_name, section_key)
);

-- Commenti per la documentazione
COMMENT ON TABLE page_contents IS 'Contenuti editabili delle pagine del sito';
COMMENT ON COLUMN page_contents.page_name IS 'Nome della pagina (chi-siamo, contatti, insegnamenti)';
COMMENT ON COLUMN page_contents.section_key IS 'Chiave univoca della sezione nella pagina';
COMMENT ON COLUMN page_contents.content_type IS 'Tipo di contenuto: text, html, markdown';
COMMENT ON COLUMN page_contents.editor_instructions IS 'Istruzioni per guidare l''editor';

-- RLS (Row Level Security)
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;

-- Rimuovi eventuali policy esistenti
DROP POLICY IF EXISTS "page_contents_select_policy" ON page_contents;
DROP POLICY IF EXISTS "page_contents_admin_policy" ON page_contents;

-- Policy per lettura pubblica (necessaria per il frontend)
CREATE POLICY "page_contents_select_policy"
ON page_contents FOR SELECT
USING (is_active = true);

-- Policy per modifica (solo admin/authenticated)
CREATE POLICY "page_contents_admin_policy"
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
('chi-siamo', 'header-title', 'Titolo principale', 'text', 'Chi Siamo', 'Il titolo principale della pagina', 1),
('chi-siamo', 'header-subtitle', 'Sottotitolo', 'text', 'La Comunità Bodhidharma - Tempio Musang Am (Eremo della Non Forma) di Lerici, dove risiediamo e impartiamo l''insegnamento buddhista', 'Breve descrizione sotto il titolo', 2),
('chi-siamo', 'maestri-title', 'Titolo sezione maestri', 'text', 'I Nostri Maestri', 'Titolo della sezione dedicata ai maestri', 10),
('chi-siamo', 'comunita-title', 'Titolo sezione comunità', 'text', 'La Comunità', 'Titolo della sezione sulla comunità', 40),
('chi-siamo', 'tempio-title', 'Titolo sezione tempio', 'text', 'Il Tempio', 'Titolo della sezione dedicata al tempio', 50),
('chi-siamo', 'dana-title', 'Titolo sezione Dana', 'text', 'Pratica di Dana', 'Titolo della sezione donazioni', 60),
('chi-siamo', 'dana-5x1000', 'Codice 5x1000', 'text', '95120790100', 'Codice fiscale per il 5x1000', 62)
ON CONFLICT (page_name, section_key) DO NOTHING;

-- =====================================================
-- POPOLAMENTO INIZIALE - PAGINA CONTATTI
-- =====================================================

INSERT INTO page_contents (page_name, section_key, section_title, content_type, content, editor_instructions, display_order) VALUES
('contatti', 'header-title', 'Titolo principale', 'text', 'Contatti', 'Il titolo principale della pagina contatti', 1),
('contatti', 'header-subtitle', 'Sottotitolo', 'text', 'Entra in contatto con la nostra comunità. Siamo qui per guidarti nel tuo percorso spirituale', 'Descrizione sotto il titolo principale', 2),
('contatti', 'info-indirizzo-title', 'Titolo indirizzo', 'text', 'Indirizzo', 'Titolo per la sezione indirizzo', 10),
('contatti', 'info-indirizzo-content', 'Contenuto indirizzo', 'html', 'Via del Dharma, 108<br />00100 Roma, Italia', 'Indirizzo completo del tempio', 11),
('contatti', 'info-telefono-title', 'Titolo telefono', 'text', 'Telefono', 'Titolo per la sezione telefono', 12),
('contatti', 'info-telefono-content', 'Contenuto telefono', 'html', '+39 123 456 789<br />Lun-Ven: 9:00-18:00', 'Numero di telefono e orari', 13),
('contatti', 'info-email-title', 'Titolo email', 'text', 'Email', 'Titolo per la sezione email', 14),
('contatti', 'info-email-content', 'Contenuto email', 'html', 'info@bodhidharma.info<br />eventi@bodhidharma.info', 'Indirizzi email di contatto', 15),
('contatti', 'form-title', 'Titolo form', 'text', 'Invia un Messaggio', 'Titolo del form di contatto', 20),
('contatti', 'orari-title', 'Titolo orari', 'text', 'Orari delle Attività', 'Titolo per la sezione orari', 30)
ON CONFLICT (page_name, section_key) DO NOTHING;

-- =====================================================
-- POPOLAMENTO INIZIALE - PAGINA INSEGNAMENTI
-- =====================================================

INSERT INTO page_contents (page_name, section_key, section_title, content_type, content, editor_instructions, display_order) VALUES
('insegnamenti', 'header-title', 'Titolo principale', 'text', 'Insegnamenti', 'Il titolo principale della pagina insegnamenti', 1),
('insegnamenti', 'header-subtitle', 'Sottotitolo principale', 'text', 'del Dharma', 'Seconda parte del titolo principale', 2),
('insegnamenti', 'header-description', 'Descrizione header', 'text', 'Scopri la saggezza millenaria del buddhismo zen attraverso gli insegnamenti dei maestri e la pratica quotidiana del risveglio', 'Descrizione sotto il titolo principale', 3),
('insegnamenti', 'pilastri-title', 'Titolo pilastri', 'text', 'I Quattro Pilastri', 'Titolo della sezione pilastri', 10),
('insegnamenti', 'pilastri-subtitle', 'Sottotitolo pilastri', 'text', 'della Pratica', 'Seconda parte del titolo pilastri', 11),
('insegnamenti', 'maestri-title', 'Titolo maestri', 'text', 'Insegnamenti dei Maestri', 'Titolo della sezione insegnamenti', 30),
('insegnamenti', 'cta-title', 'Titolo CTA', 'text', 'Approfondisci la Tua Pratica', 'Titolo della call to action finale', 50)
ON CONFLICT (page_name, section_key) DO NOTHING;

SELECT 'Sistema CMS creato con successo! Tabella page_contents configurata e popolata.' as status;
