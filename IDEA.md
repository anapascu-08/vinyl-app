# Vinyl App — Idee de proiect

## Concept
Aplicație front-end pentru colecționarii de viniluri, unde utilizatorii își pot gestiona colecția personală de discuri de vinil: adăugare, căutare, organizare și vizualizare.

## Funcționalități principale
- **Colecția mea** — listă cu vinilurile deținute (artist, album, an, gen, stare/condiție, copertă)
- **Adăugare album** — formular manual sau căutare prin API extern (ex: Discogs, MusicBrainz) pentru autocompletare date + copertă
- **Filtrare și sortare** — după artist, gen, an, stare, preț
- **Wishlist** — listă separată de albume dorite
- **Detalii album** — pagină cu tracklist, notițe personale, evaluare (rating)
- **Statistici colecție** — nr. total viniluri, distribuție pe genuri/decenii, valoare estimată
- **Mod căutare rapidă** — bară de search global

## Funcționalități opționale (v2)
- Autentificare utilizator (login/signup)
- Partajare colecție publică (link vizibil pentru alții)
- Scanare cod de bare pentru adăugare rapidă
- Integrare cu playere/streaming pentru preview audio (ex: Spotify embed)
- Mod întunecat/luminos
- **Istoric ascultări** — marchezi când ai ascultat un disc; util pentru „ce n-am mai ascultat de mult"
- **Tracking preț/valoare** — evoluția valorii de piață a colecției în timp (via Discogs)

## Tech stack sugerat
- **Framework**: React (Vite) sau Next.js
- **Stilizare**: Tailwind CSS
- **State management**: Zustand sau Context API (simplu, fără Redux dacă nu e nevoie)
- **Date externe**: Discogs API pentru informații despre albume
- **Stocare**: LocalStorage inițial (MVP) → backend/DB ulterior (ex: Supabase/Firebase)

## Structură pagini
- `/` — Dashboard / Colecția mea
- `/album/:id` — Detalii album
- `/adauga` — Formular adăugare album nou
- `/wishlist` — Lista de dorințe
- `/statistici` — Statistici colecție

## Pași următori
1. Definire schemă de date pentru un album (câmpuri necesare)
2. Wireframe pentru paginile principale
3. Setup proiect (Vite + React + Tailwind)
4. Implementare CRUD local pentru colecție
5. Integrare API extern pentru date album

test
