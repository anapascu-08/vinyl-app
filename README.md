# Vinyl Library

Aplicație front-end pentru colecționarii de viniluri: adaugi discurile, le organizezi, le cauți și vezi statistici despre colecție. Interfața e disponibilă în română și engleză — inclusiv numele aplicației, care apare ca „Vinilotecă” în română. Datele se salvează local, în browser — nimic nu pleacă de pe dispozitiv.

**Documentație:** [`IDEA.md`](./IDEA.md) · [`spec.md`](./spec.md) · [`implementation_plan.md`](./implementation_plan.md)

## Rulare locală

```bash
npm install
npm run dev
```

Aplicația pornește pe `http://localhost:5173/vinyl-app/`.

Prima dată colecția e goală. Apasă **Încarcă date demo** din pagina principală (sau **Date → Încarcă date demo** din header) ca să pornești de la o colecție de 116 albume reale, din 1923 până în 2022 — 100 în colecție și 16 pe wishlist. Acoperă un secol de jazz, rock, pop, funk, soul, punk și blues, toate deceniile, toate stările și toate formatele, cu tracklist-uri și notițe pe câteva dintre ele.

## Comenzi

| Comandă | Ce face |
|---|---|
| `npm run dev` | Server de development cu hot reload |
| `npm run build` | Build de producție în `dist/` |
| `npm run preview` | Servește build-ul de producție local |
| `npm test` | Rulează testele (Vitest) |

## Ce e implementat

- **Colecție** — grilă sau listă, căutare fără diacritice („bjork" găsește „Björk"), filtrare pe gen / decadă / stare / format, cinci criterii de sortare și paginare (24, 48 sau 96 pe pagină). Căutarea, filtrele, sortarea și pagina se reflectă în URL, deci sunt shareable.
- **Adăugare și editare** — formular cu validare, tracklist editabil, copertă din link sau upload local, avertisment la duplicate, confirmare la părăsirea paginii cu modificări nesalvate.
- **Detalii album** — toate metadatele, rating cu stele, notițe cu salvare automată, tracklist.
- **Wishlist** — listă separată; butonul „Am cumpărat" mută discul în colecție și deschide formularul pe secțiunea de achiziție.
- **Statistici** — totaluri, valoare estimată, distribuție pe genuri / decenii / stare, top 5 artiști.
- **Export / import JSON** — backup complet, cu opțiunea de a înlocui colecția sau de a adăuga doar albumele noi.
- **Română și engleză** — comutator în header. Limba se detectează din browser la prima vizită și se reține după aceea. Se traduc și formatele de dată și sumă (`15 mar. 2024` / `15 Mar 2024`).

## Stack

React 18 · Vite · React Router (HashRouter) · Zustand · Tailwind CSS · Vitest

Fără backend. Persistența se face în `localStorage`, sub cheia `vinyl-app:collection:v1`.

## Structură

```
src/
  lib/        logică pură: validare, filtrare, paginare, statistici, storage, formatare
  i18n/       dicționarele ro/en și funcțiile de traducere
  store/      state global (Zustand): colecția și starea de UI
  components/ componente reutilizabile
  pages/      câte un fișier per rută
  assets/     imagini
public/
  landing.html  pagina de prezentare inițială
```

### Traduceri

Textele stau în `src/i18n/ro.js` și `src/i18n/en.js`, ca perechi cheie–text. Într-o componentă:

```js
const { t, locale } = useI18n()
t('collection.title')                        // „Colecția mea"
t('pagination.range', { from: 1, to: 24, total: 100 })
formatMoney(value, locale)                   // respectă limba activă
```

Mesajele de validare și cele de eroare la import nu sunt text, ci perechi `[cheie, params]` — se traduc abia la randare, ca logica pură să rămână independentă de limbă. Un test verifică automat că cele două dicționare au exact aceleași chei și aceiași parametri.

Toată logica testabilă stă în `src/lib/` și e acoperită de teste; componentele nu conțin reguli de business.

## Rute

| Rută | Pagină |
|---|---|
| `#/` | Colecția mea |
| `#/album/:id` | Detalii album |
| `#/album/:id/edit` | Editare album |
| `#/add` | Adăugare album |
| `#/wishlist` | Wishlist |
| `#/stats` | Statistici |

Se folosește `HashRouter` pentru că GitHub Pages nu poate servi rute profunde fără configurare de server.

## Deploy

Workflow-ul din `.github/workflows/deploy.yml` rulează testele, face build și publică pe GitHub Pages la fiecare push pe `main`. În setările repo-ului, la **Pages**, sursa trebuie setată pe **GitHub Actions**.

`base` din `vite.config.js` e `/vinyl-app/` — dacă redenumești repo-ul, actualizează și acolo.

## Ce urmează

Integrare Discogs pentru autocompletare și coperte · cont de utilizator și sincronizare · istoric ascultări · tracking automat al valorii · partajare publică · scanare cod de bare.
