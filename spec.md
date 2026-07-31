# Vinyl App — Specificație funcțională (MVP)

**Versiune:** 0.1
**Stadiu:** draft
**Stack:** React (Vite) + Tailwind CSS + Zustand, persistență în LocalStorage
**Nume:** Vinyl Library · **Limbi:** română și engleză

---

## 1. Scop și scope

### 1.1 Scop
Aplicație front-end care permite unui colecționar să își gestioneze colecția personală de discuri de vinil: să adauge discuri, să le organizeze, să le caute și să vadă statistici despre colecție.

### 1.2 În scope pentru MVP
- CRUD complet pe colecție (adăugare, vizualizare, editare, ștergere)
- Căutare, filtrare și sortare
- Wishlist (listă separată de albume dorite)
- Pagină de detalii album (tracklist, notițe, rating)
- Statistici colecție
- Persistență locală (LocalStorage), fără cont de utilizator

### 1.3 În afara scope-ului pentru MVP
- Autentificare / conturi de utilizator
- Backend sau bază de date remote
- Integrare Discogs / MusicBrainz (fază 2)
- Scanare cod de bare, preview audio, partajare publică
- Sincronizare între dispozitive

### 1.4 Presupuneri
- Un singur utilizator per browser; datele nu părăsesc dispozitivul
- Colecție tipică: 20–500 de discuri (nu e nevoie de virtualizare a listei la MVP)
- Aplicația e client-side pură, deployabilă pe GitHub Pages

---

## 2. Modelul de date

### 2.1 `Album`

| Câmp | Tip | Obligatoriu | Observații |
|---|---|---|---|
| `id` | `string` (uuid) | da | Generat la creare (`crypto.randomUUID()`) |
| `artist` | `string` | da | 1–120 caractere |
| `title` | `string` | da | 1–200 caractere |
| `year` | `number \| null` | nu | 1900 – anul curent |
| `genres` | `string[]` | nu | 0–5 valori, din lista predefinită sau libere |
| `label` | `string \| null` | nu | Casa de discuri |
| `format` | `Format` | da | Vezi 2.2, default `LP` |
| `condition` | `Condition` | da | Vezi 2.3, default `VG+` |
| `coverUrl` | `string \| null` | nu | URL absolut sau data-URL |
| `purchasePrice` | `number \| null` | nu | ≥ 0, în RON |
| `purchaseDate` | `string \| null` | nu | ISO `YYYY-MM-DD` |
| `estimatedValue` | `number \| null` | nu | ≥ 0, în RON, introdus manual la MVP |
| `rating` | `number \| null` | nu | Întreg 1–5 |
| `notes` | `string` | nu | Max 2000 caractere |
| `tracklist` | `Track[]` | nu | Vezi 2.4 |
| `status` | `"owned" \| "wishlist"` | da | Determină în ce listă apare |
| `createdAt` | `string` (ISO datetime) | da | Setat automat |
| `updatedAt` | `string` (ISO datetime) | da | Actualizat la fiecare salvare |

### 2.2 `Format`
`"LP"` | `"EP"` | `"Single"` | `"Box Set"` | `"7\""` | `"10\""` | `"12\""`

### 2.3 `Condition` (scara Goldmine, standard în lumea vinilurilor)
`"M"` (Mint) | `"NM"` (Near Mint) | `"VG+"` | `"VG"` | `"G+"` | `"G"` | `"P"` (Poor)

Se stochează separat pentru disc și copertă:
- `condition` — starea discului
- `sleeveCondition` — starea copertei (același enum, opțional)

### 2.4 `Track`

| Câmp | Tip | Obligatoriu | Observații |
|---|---|---|---|
| `position` | `string` | da | Ex: `A1`, `B2`, `1` |
| `title` | `string` | da | |
| `duration` | `string \| null` | nu | Format `mm:ss` |

### 2.5 Persistență
- Cheie LocalStorage: `vinyl-app:collection:v1`
- Structură: `{ version: 1, albums: Album[] }`
- La citire, dacă `version` diferă → rulează migrare; dacă parsarea eșuează → colecție goală + avertisment în UI
- Scriere debounced (300 ms) pentru a evita write-uri la fiecare tastă

---

## 3. User stories

### Colecție
- **US-01** — Ca utilizator, vreau să văd toate vinilurile mele într-o listă/grilă, ca să am o imagine de ansamblu.
- **US-02** — Ca utilizator, vreau să comut între vizualizare grilă (coperte) și listă (tabel compact), ca să aleg ce mi se potrivește.
- **US-03** — Ca utilizator, vreau să caut după artist sau titlu, ca să găsesc rapid un disc.
- **US-04** — Ca utilizator, vreau să filtrez după gen, decadă, stare și format, ca să restrâng lista.
- **US-05** — Ca utilizator, vreau să sortez după artist, titlu, an, dată adăugare sau valoare.

### Adăugare / editare
- **US-06** — Ca utilizator, vreau să adaug manual un disc completând un formular.
- **US-07** — Ca utilizator, vreau să editez orice disc existent.
- **US-08** — Ca utilizator, vreau să șterg un disc, cu o confirmare prealabilă.
- **US-09** — Ca utilizator, vreau ca formularul să mă avertizeze dacă adaug un disc care pare duplicat (același artist + titlu).

### Detalii
- **US-10** — Ca utilizator, vreau o pagină de detalii cu toate informațiile despre un disc.
- **US-11** — Ca utilizator, vreau să adaug notițe personale și un rating de la 1 la 5.
- **US-12** — Ca utilizator, vreau să introduc tracklist-ul manual.

### Wishlist
- **US-13** — Ca utilizator, vreau o listă separată cu albume pe care le caut.
- **US-14** — Ca utilizator, vreau să mut un album din wishlist în colecție cu un click, când îl cumpăr.

### Statistici
- **US-15** — Ca utilizator, vreau să văd numărul total de discuri și valoarea estimată a colecției.
- **US-16** — Ca utilizator, vreau să văd distribuția pe genuri și pe decenii.
- **US-17** — Ca utilizator, vreau să văd top 5 artiști după număr de discuri.

### Date
- **US-18** — Ca utilizator, vreau să export colecția ca JSON, ca backup.
- **US-19** — Ca utilizator, vreau să import un JSON exportat anterior.

### Limbă
- **US-20** — Ca utilizator, vreau să comut interfața între română și engleză dintr-un buton din header.
- **US-21** — Ca utilizator, vreau ca aplicația să pornească în limba browserului meu, iar alegerea mea să fie reținută.

---

## 4. Pagini și comportament

### 4.1 `/` — Colecția mea
**Conținut:** bară de căutare, control filtre, selector de sortare, toggle grilă/listă, buton „Adaugă album", contor rezultate, grila/lista de albume.

**Card album (grilă):** copertă (sau placeholder cu inițialele artistului), titlu, artist, an, badge de stare.

**Stare goală (colecție vidă):** ilustrație + text „Colecția ta e goală" + buton „Adaugă primul disc".
**Stare goală (filtre fără rezultate):** „Niciun disc nu se potrivește filtrelor" + buton „Resetează filtrele".

**Filtre:** genuri (multi-select), decadă (multi-select: 1950s…2020s), stare (multi-select), format (multi-select). Filtrele se combină cu ȘI între categorii și SAU în interiorul unei categorii.

**Sortare:** artist A–Z (default), titlu A–Z, an crescător/descrescător, adăugat recent, valoare descrescătoare.

**Paginare:** 24 de discuri pe pagină implicit, cu opțiunile 48 și 96. Bara de paginare apare doar când există mai mult de o pagină și afișează intervalul curent („Discurile 25–48 din 100"). Orice schimbare de căutare, filtre sau sortare readuce lista la prima pagină. O pagină cerută în afara intervalului e readusă automat la cea mai apropiată validă.

**Persistență filtre:** starea filtrelor, a sortării, a paginii și a numărului de rezultate pe pagină se reflectă în query string, ca să fie shareable/bookmarkabile.

### 4.2 `/album/:id` — Detalii album
**Conținut:** copertă mare, artist + titlu, metadate (an, gen, casă de discuri, format), stare disc + copertă, preț achiziție și dată, valoare estimată, rating editabil (stele), notițe (textarea cu autosave), tracklist.

**Acțiuni:** Editează, Șterge (cu confirmare), Înapoi la colecție.

**ID inexistent:** pagină „Album negăsit" + link spre colecție.

### 4.3 `/add` și `/album/:id/edit` — Formular
Același component, în mod „creare" sau „editare".

**Secțiuni:** Informații de bază (artist*, titlu*, an, genuri, casă de discuri, format*) · Stare (disc*, copertă) · Achiziție (preț, dată, valoare estimată) · Personal (rating, notițe) · Tracklist (rânduri adăugabile/ștergibile) · Copertă (URL sau upload local convertit în data-URL).

**Validare:** vezi secțiunea 5. Erorile apar sub câmp, la blur și la submit.
**La submit reușit:** redirect către `/album/:id` + toast de confirmare.
**Navigare cu modificări nesalvate:** dialog de confirmare.

### 4.4 `/wishlist`
Aceeași structură ca `/`, filtrată pe `status === "wishlist"`. Fiecare card are în plus acțiunea „Am cumpărat" → setează `status = "owned"` și deschide formularul pentru completarea prețului de achiziție.

### 4.5 `/stats`
- **Carduri sumar:** total discuri, total wishlist, valoare estimată totală, cost total achiziții, artist cel mai reprezentat
- **Distribuție pe genuri** — bar chart orizontal
- **Distribuție pe decenii** — bar chart vertical
- **Top 5 artiști** — listă cu număr de discuri
- **Distribuție pe stare** — bar chart

**Stare goală:** dacă nu există discuri, mesaj + link spre adăugare, fără grafice.

### 4.6 Navigație globală
Header persistent: logo/nume, linkuri către Colecție · Wishlist · Statistici, buton „Adaugă album", meniu cu Export/Import JSON.

---

## 5. Reguli de validare

| Câmp | Regulă | Mesaj de eroare |
|---|---|---|
| `artist` | obligatoriu, 1–120 caractere după trim | „Artistul este obligatoriu." |
| `title` | obligatoriu, 1–200 caractere după trim | „Titlul este obligatoriu." |
| `year` | dacă e completat: întreg între 1900 și anul curent | „Anul trebuie să fie între 1900 și {anul curent}." |
| `genres` | maximum 5 | „Poți alege cel mult 5 genuri." |
| `purchasePrice` | dacă e completat: număr ≥ 0 | „Prețul nu poate fi negativ." |
| `estimatedValue` | dacă e completat: număr ≥ 0 | „Valoarea nu poate fi negativă." |
| `purchaseDate` | dacă e completată: dată validă, nu în viitor | „Data nu poate fi în viitor." |
| `rating` | dacă e completat: întreg 1–5 | — (UI cu stele previne valori invalide) |
| `notes` | maximum 2000 caractere | „Notițele depășesc 2000 de caractere." |
| `coverUrl` | dacă e URL: schemă `http`/`https`; dacă e upload: max 2 MB, tip imagine | „Imaginea depășește 2 MB." |
| `tracklist[].title` | obligatoriu dacă rândul există | „Titlul piesei este obligatoriu." |
| duplicat | avertisment (nu blocant) dacă există deja același `artist` + `title` | „Ai deja un disc cu acest artist și titlu. Vrei să continui?" |

---

## 6. Stări de eroare și limită

- **LocalStorage plin / indisponibil (mod privat):** banner persistent — „Nu pot salva local. Modificările se pierd la reîncărcare." Aplicația rămâne funcțională în memorie.
- **Date corupte la citire:** se pornește cu colecție goală + dialog care oferă descărcarea datelor brute pentru recuperare manuală.
- **Import JSON invalid:** mesaj de eroare cu motivul; importul nu modifică nimic (tot-sau-nimic).
- **Copertă care nu se încarcă:** fallback pe placeholder, fără eroare vizibilă.
- **Rută inexistentă:** pagină 404 cu link spre colecție.

---

## 7. Cerințe non-funcționale

- **Accesibilitate:** navigabil complet cu tastatura; focus vizibil; label-uri asociate câmpurilor; contrast minim WCAG AA; `prefers-reduced-motion` respectat.
- **Responsive:** funcțional de la 360 px lățime; grilă cu 1 / 2 / 3 / 4 coloane în funcție de breakpoint.
- **Performanță:** interacțiuni sub 100 ms pentru colecții de până la 500 de discuri.
- **Limbă:** interfață în română și engleză, comutabilă din header. La prima vizită se alege limba browserului, cu engleza ca variantă de rezervă; alegerea se salvează în `localStorage` sub cheia `vinyl-app:lang`. Datele și sumele se formatează după limba activă. Textele introduse de utilizator (notițe, titluri) nu se traduc.
- **Persistență:** nicio dată nu părăsește dispozitivul în MVP.

---

## 8. Criterii de acceptanță (MVP „gata")

1. Pot adăuga un disc completând doar artist, titlu, format și stare; apare imediat în colecție.
2. Datele supraviețuiesc reîncărcării paginii și închiderii browserului.
3. Pot edita și șterge orice disc; ștergerea cere confirmare.
4. Căutarea filtrează live după artist și titlu, fără diacritice obligatorii („Bjork" găsește „Björk").
5. Filtrele, sortarea și paginarea se pot combina și se reflectă în URL.
6. Wishlist-ul e separat, iar „Am cumpărat" mută discul în colecție.
7. Pagina de statistici afișează cifre corecte, verificabile manual pe un set de test.
8. Export → import reconstituie colecția identic.
9. Toate paginile au stări goale tratate explicit.
10. Aplicația e utilizabilă cu tastatura și pe ecran de 360 px.

---

## 9. Fază 2 (post-MVP)

Integrare Discogs pentru autocompletare și coperte · cont de utilizator + sincronizare (Supabase) · istoric ascultări · tracking automat al valorii de piață · partajare colecție publică · scanare cod de bare · preview audio · mod luminos.
