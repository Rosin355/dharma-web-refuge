# Dharma Web Refuge - Comunità Bodhidharma

Sito web della Comunità Bodhidharma per la gestione di eventi, cerimonie, blog e contenuti didattici.

## 📋 Indice

- [Stack Tecnologico](#stack-tecnologico)
- [Protocolli di Sicurezza](#protocolli-di-sicurezza)
- [Requisiti](#requisiti)
- [Installazione](#installazione)
- [Configurazione](#configurazione)
- [Sviluppo](#sviluppo)
- [Deployment](#deployment)
- [Struttura del Progetto](#struttura-del-progetto)
- [Database](#database)
- [Autenticazione](#autenticazione)
- [Contribuire](#contribuire)

## 🛠 Stack Tecnologico

### Frontend
- **Framework**: React 18.2.0 con TypeScript 5.3.3
- **Build Tool**: Vite 5.0.12
- **Routing**: React Router DOM 6.21.3
- **State Management**: TanStack React Query 5.80.7
- **UI Components**: Radix UI (componenti accessibili)
- **Styling**: Tailwind CSS 3.4.1
- **Form Management**: React Hook Form 7.58.1 + Zod 3.25.67
- **Icons**: Lucide React
- **Date Handling**: date-fns 4.1.0

### Backend/Database
- **BaaS**: Supabase (PostgreSQL)
- **Database**: PostgreSQL (gestito da Supabase)
- **Authentication**: Supabase Auth (JWT)
- **Storage**: Supabase Storage (per immagini e file)
- **API**: REST API di Supabase

### Deployment
- **Hosting**: Netlify
- **Node.js**: versione 18
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

## 🔒 Protocolli di Sicurezza

### 1. Autenticazione e Autorizzazione
- **Protocollo**: JWT (JSON Web Tokens) tramite Supabase Auth
- **Ruoli**: Sistema RBAC con ruoli `admin`, `moderator`, `user`
- **Session Management**: Gestione sessioni lato client con refresh automatico
- **Funzioni SECURITY DEFINER**: Funzioni PostgreSQL con privilegi elevati per operazioni sicure

### 2. Row Level Security (RLS)
Row Level Security abilitato su tutte le tabelle sensibili con policy granulari:
- **profiles**: Utenti vedono solo il proprio profilo; admin vedono tutti
- **posts**: Pubblici se pubblicati; solo admin/moderator possono modificare
- **events**: Pubblici in lettura; solo admin/moderator possono gestire
- **ceremonies**: Pubblici in lettura; solo admin/moderator possono gestire
- **event_registrations**: Utenti vedono solo le proprie registrazioni
- **ceremony_registrations**: Utenti vedono solo le proprie registrazioni
- **email_queue**: Solo admin/moderator possono visualizzare e aggiornare
- **user_roles**: Accesso controllato tramite funzioni SECURITY DEFINER

### 3. Security Headers (Netlify)
Configurati in `netlify.toml`:
- `X-Frame-Options: DENY` - Previene clickjacking
- `X-XSS-Protection: 1; mode=block` - Protezione XSS
- `X-Content-Type-Options: nosniff` - Previene MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controllo referrer

### 4. Validazione e Sanitizzazione
- **Validazione Form**: Zod per schema validation
- **Type Safety**: TypeScript per validazione a compile-time
- **Input Validation**: Validazione lato client e server

### 5. Sicurezza Database
- **Funzioni SECURITY DEFINER**: Con `SET search_path = public` per prevenire SQL injection
- **Foreign Key Constraints**: Integrità referenziale
- **UUID**: Identificatori univoci per record sensibili
- **Timestamps**: Tracciamento automatico di creazione e aggiornamento

### 6. Sicurezza Storage
- **Policy RLS**: Su bucket Supabase Storage
- **Accesso Controllato**: Alle immagini e file
- **Validazione Tipi File**: Supporto solo per tipi consentiti

### 7. Gestione Email
- **Email Queue**: Sistema di coda per invio asincrono
- **Sanitizzazione HTML**: Template email strutturati
- **Error Handling**: Gestione errori con logging

## 📦 Requisiti

- Node.js 18+ ([installazione con nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm o yarn
- Account Supabase
- Account Netlify (per deployment)

## 🚀 Installazione

```bash
# 1. Clona il repository
git clone <YOUR_GIT_URL>
cd dharma-web-refuge

# 2. Installa le dipendenze
npm install

# 3. Configura le variabili d'ambiente
# Crea un file .env.local con le tue credenziali Supabase
```

## ⚙️ Configurazione

### Variabili d'ambiente

Crea un file `.env.local` nella root del progetto:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Le variabili sono già configurate in `src/integrations/supabase/client.ts` ma puoi sovrascriverle con variabili d'ambiente.

### Setup Database

Le migrazioni del database sono nella cartella `supabase/migrations/`. Per applicarle:

1. Accedi al tuo progetto Supabase
2. Vai alla sezione SQL Editor
3. Esegui le migrazioni in ordine cronologico

Oppure usa Supabase CLI:

```bash
supabase db push
```

## 💻 Sviluppo

```bash
# Avvia il server di sviluppo
npm run dev

# Il server sarà disponibile su http://localhost:8080
```

### Script disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Build per produzione
- `npm run build:dev` - Build in modalità sviluppo
- `npm run preview` - Preview della build di produzione

## 🚢 Deployment

### Netlify

Il progetto è configurato per il deployment automatico su Netlify:

1. Connetti il repository GitHub a Netlify
2. Configura le variabili d'ambiente in Netlify Dashboard
3. Il deployment avverrà automaticamente ad ogni push su `main`

### Configurazione Netlify

Il file `netlify.toml` contiene:
- Build command: `npm run build`
- Publish directory: `dist`
- Security headers
- Redirect per React Router

## 📁 Struttura del Progetto

```
dharma-web-refuge/
├── src/
│   ├── components/          # Componenti React
│   │   ├── admin/          # Componenti admin
│   │   └── ui/             # Componenti UI riutilizzabili
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Integrazioni esterne (Supabase)
│   ├── lib/                # Utilities e helper
│   ├── pages/              # Pagine dell'applicazione
│   └── types.d.ts          # Definizioni TypeScript
├── supabase/
│   ├── migrations/         # Migrazioni database
│   └── config.toml         # Configurazione Supabase
├── public/                 # File statici
├── dist/                   # Build di produzione
└── package.json            # Dipendenze e script
```

## 🗄️ Database

### Tabelle principali

- **profiles**: Profili utente
- **posts**: Articoli del blog
- **events**: Eventi
- **event_registrations**: Registrazioni eventi
- **ceremonies**: Cerimonie
- **ceremony_registrations**: Registrazioni cerimonie
- **teachings**: Insegnamenti
- **page_contents**: Contenuti delle pagine
- **email_queue**: Coda email
- **user_roles**: Ruoli utente

### Migrazioni

Le migrazioni sono versionate e si trovano in `supabase/migrations/`. Ogni migrazione include:
- Creazione/modifica tabelle
- Policy RLS
- Funzioni e trigger
- Dati iniziali (se necessario)

## 🔐 Autenticazione

L'autenticazione è gestita tramite Supabase Auth:

- **Login**: Email e password
- **Sessioni**: Gestite automaticamente da Supabase
- **Ruoli**: Sistema RBAC con `admin`, `moderator`, `user`
- **Hook**: `useAuth` per gestire lo stato di autenticazione

### Esempio uso

```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, session, signIn, signOut } = useAuth();
```

## 📝 Features

- ✅ Gestione eventi e cerimonie
- ✅ Sistema di registrazione
- ✅ Blog con CMS integrato
- ✅ Gestione contenuti pagine
- ✅ Upload immagini
- ✅ Sistema email queue
- ✅ Dashboard admin
- ✅ Autenticazione e autorizzazione
- ✅ Responsive design
- ✅ Dark mode support

## 🤝 Contribuire

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è privato e riservato alla Comunità Bodhidharma.

## 👥 Contatti

Per domande o supporto, contattare: bodhidharmait@gmail.com

---

**Nota**: Questo progetto è stato sviluppato per la Comunità Bodhidharma. Per maggiori informazioni, visitare il sito web.
