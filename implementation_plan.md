# Vinyl App — Plan de implementare (MVP)

Referință funcțională: [`spec.md`](./spec.md)
**Stack:** React 18 + Vite + React Router + Tailwind CSS + Zustand · persistență LocalStorage · deploy GitHub Pages

---

## Principii de lucru

- Fiecare fază se termină cu ceva vizibil și funcțional în browser — fără faze „doar infrastructură" care durează zile.
- Persistența se leagă devreme (faza 2), ca să nu descoperi târziu probleme de serializare.
- Fără API extern în MVP: tot ce ține de Discogs e fază 2.
- Commit mic și des; fiecare pas din tabelele de mai jos e un commit rezonabil.

---

## Faza 0 — Setup proiect

| # | Task | Rezultat |
|---|---|---|
| 0.1 | `npm create vite@latest . -- --template react` | Proiect care pornește cu `npm run dev` |
| 0.2 | Instalare Tailwind + configurare `tailwind.config.js`, `index.css` | O clasă Tailwind se aplică vizibil |
| 0.3 | Instalare `react-router-dom` și `zustand` | — |
| 0.4 | Configurare `base` în `vite.config.js` pentru GitHub Pages (`/vinyl-app/`) | — |
| 0.5 | Definire paletă în Tailwind, preluată din `index.html` actual (violet `#6a4fd6`, fundal `#1a0b2e`, accent `#a78bfa`) | Tema vizuală e consistentă cu landing page-ul |
| 0.6 | Structură de foldere: `src/{components,pages,store,lib,types}` | — |
| 0.7 | Prettier + ESLint | `npm run lint` trece |

**Notă deploy:** `index.html` actual (landing page-ul) trebuie mutat, de ex. în `docs/landing.html` sau păstrat pe branch separat — Vite va genera propriul `index.html`. Decide înainte de 0.1 ca să nu-l suprascrii accidental.

**Definiție de gata:** aplicația goală pornește local, are Tailwind funcțional și rutare configurată.

---

## Faza 1 — Model de date și store

| # | Task | Rezultat |
|---|---|---|
| 1.1 | `src/lib/constants.js` — enum-uri `FORMATS`, `CONDITIONS`, `GENRES` (secțiunile 2.2–2.3 din spec) | — |
| 1.2 | `src/lib/album.js` — `createAlbum(input)` cu valori default, `id`, `createdAt`, `updatedAt` | — |
| 1.3 | `src/lib/validation.js` — `validateAlbum(input)` → `{ field: message }`, conform secțiunii 5 din spec | Funcție pură, ușor de testat |
| 1.4 | `src/store/collectionStore.js` — Zustand: `albums`, `addAlbum`, `updateAlbum`, `removeAlbum`, `moveToCollection` | — |
| 1.5 | Selectori derivați: `selectOwned`, `selectWishlist`, `selectStats` | — |
| 1.6 | Seed cu 8–10 albume de test (fișier separat, activabil dintr-un buton „Încarcă date demo") | Poți lucra pe UI fără să introduci date manual |

**Definiție de gata:** poți adăuga și șterge albume din consolă prin store, iar selectorii returnează valorile corecte.

---

## Faza 2 — Persistență

| # | Task | Rezultat |
|---|---|---|
| 2.1 | `src/lib/storage.js` — `load()` / `save()` pe cheia `vinyl-app:collection:v1`, cu `version` | — |
| 2.2 | Hidratarea store-ului la pornire | Datele supraviețuiesc refresh-ului |
| 2.3 | Salvare debounced (300 ms) la orice mutație | — |
| 2.4 | Tratare erori: JSON corupt → colecție goală + flag `storageError`; quota depășită → flag `storageUnavailable` | Secțiunea 6 din spec |
| 2.5 | Banner global care afișează erorile de mai sus | — |

**Definiție de gata:** criteriul de acceptanță #2 din spec e îndeplinit; modul privat nu strică aplicația.

---

## Faza 3 — Shell UI și navigație

| # | Task | Rezultat |
|---|---|---|
| 3.1 | `Layout` cu header persistent și `<Outlet />` | — |
| 3.2 | Rute: `/`, `/album/:id`, `/adauga`, `/album/:id/editeaza`, `/wishlist`, `/statistici`, `*` (404) | — |
| 3.3 | Componente comune: `Button`, `Input`, `Select`, `Badge`, `Modal`, `EmptyState`, `Toast` | Kit reutilizabil pentru fazele următoare |
| 3.4 | `ConfirmDialog` accesibil (focus trap, `Esc` închide) | Folosit la ștergere |

**Definiție de gata:** poți naviga între toate paginile (goale), pe desktop și mobil.

---

## Faza 4 — Colecția (citire)

| # | Task | Rezultat |
|---|---|---|
| 4.1 | `AlbumCard` (grilă) cu fallback de copertă pe inițialele artistului | — |
| 4.2 | `AlbumRow` (listă compactă) + toggle grilă/listă, salvat în LocalStorage | US-02 |
| 4.3 | Bară de căutare cu normalizare diacritice (`String.normalize("NFD")`) | US-03, criteriu #4 |
| 4.4 | Panou de filtre: genuri, decadă, stare, format — ȘI între categorii, SAU în interior | US-04 |
| 4.5 | Selector de sortare (artist, titlu, an, adăugat recent, valoare) | US-05 |
| 4.6 | Sincronizare filtre + sortare cu query string prin `useSearchParams` | Criteriu #5 |
| 4.7 | Stări goale: colecție vidă vs. filtre fără rezultate | Criteriu #9 |

**Definiție de gata:** cu datele demo încărcate, poți căuta, filtra și sorta, iar URL-ul reflectă starea.

---

## Faza 5 — Formular (creare + editare)

| # | Task | Rezultat |
|---|---|---|
| 5.1 | `AlbumForm` cu secțiunile din 4.3 al spec-ului | — |
| 5.2 | Legare `validateAlbum`; erori afișate la blur și la submit | Secțiunea 5 |
| 5.3 | Editor de tracklist (adăugare/ștergere/reordonare rânduri) | US-12 |
| 5.4 | Copertă: input URL + upload local → data-URL, cu limită de 2 MB | — |
| 5.5 | Mod editare: pre-populare din `:id`, gestionare id inexistent | US-07 |
| 5.6 | Avertisment de duplicat (artist + titlu), neblocant | US-09 |
| 5.7 | Guard pentru modificări nesalvate la navigare | — |
| 5.8 | Redirect + toast la salvare reușită | — |

**Definiție de gata:** criteriile #1 și #3 din spec sunt îndeplinite.

---

## Faza 6 — Detalii album

| # | Task | Rezultat |
|---|---|---|
| 6.1 | Layout pagină detalii cu toate metadatele | US-10 |
| 6.2 | Rating cu stele, editabil, accesibil de la tastatură | US-11 |
| 6.3 | Notițe cu autosave debounced | US-11 |
| 6.4 | Afișare tracklist | — |
| 6.5 | Acțiuni Editează / Șterge (cu `ConfirmDialog`) | US-08 |
| 6.6 | Pagină „Album negăsit" | Secțiunea 6 |

---

## Faza 7 — Wishlist

| # | Task | Rezultat |
|---|---|---|
| 7.1 | Refolosire componentelor din faza 4, filtrate pe `status === "wishlist"` | US-13 |
| 7.2 | Acțiune „Am cumpărat" → `status = "owned"` + deschide formularul pe secțiunea Achiziție | US-14 |
| 7.3 | Comutator `status` în formular, pentru adăugare directă în wishlist | — |

**Definiție de gata:** criteriul #6 din spec.

---

## Faza 8 — Statistici

| # | Task | Rezultat |
|---|---|---|
| 8.1 | `selectStats`: totaluri, valoare, cost, distribuții pe gen/decadă/stare, top artiști | US-15…17 |
| 8.2 | Carduri sumar | — |
| 8.3 | Grafice — bare făcute din `div`-uri cu Tailwind, fără librărie de charting la MVP | Zero dependențe în plus |
| 8.4 | Stare goală când nu există discuri | — |

**Definiție de gata:** criteriul #7 — cifrele se verifică manual pe setul demo.

---

## Faza 9 — Export / Import

| # | Task | Rezultat |
|---|---|---|
| 9.1 | Export: descărcare `vinyl-collection-YYYY-MM-DD.json` | US-18 |
| 9.2 | Import: selectare fișier, validare schemă, aplicare tot-sau-nimic | US-19 |
| 9.3 | Alegere la import: înlocuiește tot vs. adaugă la colecție | — |
| 9.4 | Mesaje de eroare clare la JSON invalid | Secțiunea 6 |

**Definiție de gata:** criteriul #8 — export urmat de import reconstituie colecția identic.

---

## Faza 10 — Finisare și deploy

| # | Task | Rezultat |
|---|---|---|
| 10.1 | Trecere de accesibilitate: focus vizibil, label-uri, `aria-*`, ordine de tab | Criteriu #10 |
| 10.2 | Verificare responsive de la 360 px în sus | Criteriu #10 |
| 10.3 | `prefers-reduced-motion` respectat peste tot | — |
| 10.4 | Actualizare `README.md` cu instrucțiuni de rulare și build | — |
| 10.5 | GitHub Actions: build + deploy pe GitHub Pages la push pe `main` | Site live |
| 10.6 | Trecere finală prin toate cele 10 criterii de acceptanță | MVP declarat gata |

---

## Testare

Fără suită completă la MVP, dar cu acoperire acolo unde greșelile sunt tăcute:

- **Vitest** pentru funcțiile pure: `validateAlbum`, `selectStats`, normalizarea diacriticelor, serializarea storage-ului.
- **Manual, la fiecare fază:** parcurgerea definiției de gata din tabelul fazei.
- **Înainte de deploy:** cele 10 criterii de acceptanță din spec, pe un browser curat (LocalStorage golit).

---

## Ordine de dependențe

```
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10
                    └──── 8 poate începe în paralel cu 6–7
```

Fazele 0–5 sunt strict secvențiale. După faza 5 ai deja o aplicație utilă (adaugi și vezi discuri); restul adaugă valoare incremental și pot fi reordonate după preferință.

---

## Riscuri și decizii deschise

| Risc / decizie | Impact | Mitigare |
|---|---|---|
| `index.html` actual e suprascris de Vite | Pierzi landing page-ul | Mută-l în `public/landing.html` sau pe branch separat **înainte** de faza 0 |
| Coperte ca data-URL umplu LocalStorage (limită ~5 MB) | Erori de salvare la colecții mari | Limită de 2 MB per imagine + avertisment la peste 40 de coperte locale; fază 2: doar URL-uri externe |
| GitHub Pages + React Router (rute care dau 404 la refresh) | Linkuri directe nu funcționează | `HashRouter`, sau `404.html` care redirectează |
| Valoarea estimată e introdusă manual | Statistica de valoare e aproximativă | Acceptat la MVP; automatizare în faza 2 via Discogs |

---

## Fază 2 (după MVP)

Integrare Discogs (căutare, autocompletare, coperte) · cont de utilizator și sincronizare (Supabase) · istoric ascultări · tracking automat al valorii · partajare publică · scanare cod de bare · preview audio · mod luminos.
