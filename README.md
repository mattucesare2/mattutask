# MattuTask

App di gestione attività ispirata a Outlook Tasks, con:

- ✅ Lista attività con completamento, scadenze, data di creazione e categorie
- 📅 Vista calendario mensile
- 🔐 Accesso con username e password
- ☁️ Database condiviso: stesso account = stessi dati su tutti i dispositivi
- 🚀 Pronto per deploy su **Vercel** + database cloud

## Stack

- **Next.js 16** (App Router)
- **Prisma** + SQLite (dev) / PostgreSQL (produzione)
- **JWT** (cookie httpOnly) + bcrypt
- **Tailwind CSS 4**
- **date-fns** + **lucide-react**

## Avvio locale

```bash
# 1. Installa dipendenze
npm install

# 2. Crea il database
npx prisma db push

# 3. Avvia
npm run dev
```

Apri http://localhost:3000

Registrati con un username e password (min 6 caratteri).

## Deploy su Vercel + database condiviso

1. Crea un repo GitHub e pusha questo codice.

2. Crea un database PostgreSQL gratuito:
   - [Neon](https://neon.tech) (consigliato) oppure
   - [Supabase](https://supabase.com) oppure
   - [Vercel Postgres](https://vercel.com/storage/postgres)

3. Copia la connection string (es. `postgresql://...`)

4. Su Vercel:
   - Importa il repo
   - Aggiungi Environment Variables:
     - `DATABASE_URL` = la connection string Postgres
     - `JWT_SECRET` = una stringa lunga e casuale (es. genera con `openssl rand -base64 32`)
   - Deploy

5. Dopo il primo deploy, se il database è vuoto, le tabelle vengono create automaticamente grazie a `prisma generate` nel build.  
   Se serve, puoi eseguire `npx prisma db push` localmente puntando al DATABASE_URL di produzione (oppure usa Prisma Migrate).

### Nota importante sul database

- In **sviluppo** usiamo SQLite (`file:./dev.db`) → semplice e zero config.
- In **produzione su Vercel** SQLite **non funziona** (filesystem efimero). Devi usare Postgres (o altro DB esterno).

Per cambiare provider basta modificare `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"   // invece di "sqlite"
  url      = env("DATABASE_URL")
}
```

Poi `npx prisma db push` o `prisma migrate`.

## Funzionalità

| Funzione              | Descrizione                                      |
|-----------------------|--------------------------------------------------|
| Registrazione / Login | Username + password (hash bcrypt)                |
| Crea / Modifica / Elimina | Attività con titolo, descrizione, scadenza, categoria |
| Completa              | Toggle con un click                              |
| Filtri                | Tutte / Da fare / Completate + per categoria     |
| Ricerca               | Su titolo, descrizione e categoria               |
| Calendario            | Vista mensile con attività per data di scadenza  |
| Multi-device          | Stesso account = stesso database cloud           |

## Struttura cartelle

```
src/
  app/
    api/auth/     → login, register, logout, me
    api/tasks/    → CRUD attività
    login/        → pagina di accesso
    register/     → registrazione
    page.tsx      → dashboard principale
  components/     → Header, TaskItem, TaskForm, CalendarView
  lib/            → prisma, auth, types
prisma/
  schema.prisma
```

## Sicurezza

- Password hashate con bcrypt (cost 12)
- Sessioni JWT in cookie `httpOnly` + `secure` in produzione
- Validazione input con Zod
- Le attività sono sempre filtrate per `userId` → nessun utente vede le attività altrui

---

Creato per **MattuTask** 🚀
