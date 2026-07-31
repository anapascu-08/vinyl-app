# Vinyl App — Brainstorm

Idei pentru după MVP. Nimic de aici nu e decis; e o listă de posibilități, cu o notă despre ce cred că merită și ce nu.

Context: MVP-ul (colecție, wishlist, filtrare, statistici, export/import) e implementat. Vezi [`spec.md`](./spec.md) și [`implementation_plan.md`](./implementation_plan.md).

---

## 1. Probleme reale de colecționar pe care nicio aplicație nu le rezolvă bine

Astea sunt cele mai interesante, fiindcă Discogs le ignoră — el e catalog și piață, nu unealtă de zi cu zi.

**Contorul de ac.** Un ac de pick-up ține undeva între 500 și 1000 de ore, apoi începe să zgârie discurile. Aproape nimeni nu-l urmărește. Dacă aplicația știe ce ai ascultat și cât durează fiecare album, poate calcula singură: „ai ~640 de ore pe acul curent, schimbă-l". Ar fi funcția care justifică singură existența aplicației.

**Unde e discul, fizic.** La peste 200 de viniluri, găsirea unui anume disc devine o problemă. Un câmp de locație („raft 2, poziția 14") plus o vizualizare de raft ar rezolva-o. Bonus: modul „ordonează raftul" — îți spune unde să inserezi un disc nou ca să respecți ordinea aleasă.

**Jurnal de curățare.** Când ai spălat ultima oară discul ăsta? Cu ce? Util mai ales pentru achizițiile second-hand.

**Împrumuturi.** Cui i-ai dat *Remain in Light* acum opt luni. Un câmp și o listă „la alții acum" ar salva prietenii.

**Upgrade tracker.** Ai *Blue* în stare VG și vrei VG+. Nu e wishlist clasic — e un disc pe care deja îl deții, dar îl cauți în stare mai bună. Merită stare separată, altfel îți poluezi wishlist-ul.

**Numărul din deadwax.** Codul gravat în zona netedă de lângă etichetă identifică presajul exact — singurul mod sigur de a ști ce ediție ai. Un câmp text + căutare după el.

---

## 2. Ascultare și descoperire în propria colecție

**„Ce pun azi?"** Un buton care alege aleatoriu un disc, cu filtre: durată, gen, dispoziție, „ceva ce n-am mai ascultat de peste un an". Problema colecțiilor mari e că ajungi să rotești aceleași 20 de discuri.

**Istoric de ascultări.** Bifezi când ai ascultat ceva. De aici derivă: contorul de ac, „neglijate de mult", top-ul real (nu ce zici că-ți place, ci ce pui efectiv).

**Sesiuni de ascultare.** O seară, trei discuri, cine a fost, ce s-a spus. Mai aproape de un jurnal decât de o bază de date — și probabil partea la care te-ai întoarce peste ani.

**Rating dublu.** Muzica și presajul sunt lucruri diferite: poți avea un album de 5 stele pe un presaj mediocru. Două câmpuri, nu unul.

---

## 3. Date și integrări

**Import din Discogs prin CSV.** Discogs permite exportul colecției ca CSV, fără API și fără token. E cel mai ieftin mod de a aduce o colecție existentă în aplicație — și probabil primul lucru pe care l-ar cere cineva cu 400 de discuri deja catalogate. Prioritate mare, efort mic.

**API-ul Discogs pentru autocompletare.** Cum e deja în plan. Necesită token; atenție la limita de rate și la faptul că datele sunt inegale — multe presaje au informații lipsă.

**Coperte.** Alternativele la Discogs: Cover Art Archive (via MusicBrainz), gratuit și fără cheie. Sau păstrarea generatorului procedural actual ca fallback, ceea ce funcționează surprinzător de bine.

**Fotografii proprii.** Poza discului real, cu zgârieturile lui, e mai utilă decât coperta oficială — mai ales dacă vinzi cândva. Problema e spațiul: `localStorage` are ~5 MB. Ar cere IndexedDB.

**Preview audio.** Spotify embed sau YouTube. Util pentru wishlist („chiar îmi place destul cât să dau 400 de lei?").

---

## 4. Mod „la târg"

Scenariu concret: ești la un târg de discuri, semnal prost, mâinile ocupate. Ai nevoie de trei lucruri, rapid:

- wishlist-ul, offline, sortat după cât de tare vrei fiecare titlu
- răspunsul la „am deja asta?" — căutare instantă, o singură mână
- bugetul: cât ai cheltuit azi din cât ți-ai propus

Asta cere PWA instalabilă și funcțională offline. Tehnic e simplu (aplicația e deja client-side), dar interfața ar trebui gândită separat — un ecran dedicat, nu aplicația normală pe ecran mic.

---

## 5. Statistici mai interesante decât cele actuale

Cele din MVP (număr, valoare, distribuții) sunt corecte, dar plate. Mai bune ar fi:

- **Cost per ascultare** — discul de 400 de lei ascultat de 30 de ori a ieșit mai ieftin decât cel de 80 de lei ascultat o dată
- **Cel mai bun chilipir** — diferența cea mai mare între prețul plătit și valoarea estimată
- **Harta colecției în timp** — nu anii de lansare, ci ritmul în care ai cumpărat: când ai avut perioade de febră și când ai stat
- **Golurile** — „ai 12 albume de jazz din anii '60 și niciunul din anii '50"; sugerează direcții, nu titluri
- **Distribuția stărilor față de preț** — verifici dacă plătești constant prea mult pentru discuri VG

---

## 6. Interfață

- **Vizualizare raft** — copertele înghesuite pe orizontală, ca pe un raft real, cu scroll lateral. Mai plăcut decât grila pentru răsfoit.
- **Timeline** — colecția așezată pe axa anilor de lansare; se văd imediat concentrările.
- **Mod întunecat** — acum aplicația e pe temă deschisă; varianta închisă merită ca opțiune, nu ca înlocuire.
- **Etichete libere** — „duminică dimineața", „de la tata", „de vândut". Mai flexibile decât genurile.
- **Export PDF de inventar** — pentru asigurare sau pentru moștenitori. Sună morbid, dar colecțiile serioase chiar au nevoie.

---

## 7. Ce cred că NU merită făcut

- **Marketplace sau vânzare.** E un produs complet diferit, cu plăți, dispute și moderare. Discogs a construit asta în 20 de ani.
- **Cont obligatoriu.** Aplicația funcționează perfect fără. Un cont ar trebui să fie opțional, doar pentru sincronizare între dispozitive.
- **Scraping de prețuri.** Fragil, probabil împotriva termenilor de utilizare, și te leagă de structura HTML a altcuiva.
- **Rețea socială proprie.** O colecție publică partajabilă printr-un link acoperă 90% din nevoie, cu 5% din efort.
- **Recomandări „AI" de albume noi.** Există deja peste tot și nu asta caută cineva într-o aplicație de inventar.

---

## 8. Dacă ar fi să aleg trei lucruri pentru v1.1

1. **Import CSV din Discogs** — efort mic, deblochează utilizatorii cu colecții mari deja catalogate
2. **Istoric de ascultări** — ieftin de implementat, și din el derivă contorul de ac, „neglijate" și statisticile bune
3. **Locația fizică pe raft** — un singur câmp, dar rezolvă o frustrare zilnică reală

Toate trei sunt pur locale: nu cer backend, cont sau API extern. Adică se pot livra fără a schimba arhitectura.

---

## 9. Întrebări deschise

- Câte discuri are o colecție tipică a utilizatorului vizat? Sub 100 și lista simplă e suficientă; peste 500 și fiecare decizie de interfață se schimbă.
- Aplicația e pentru inventar (știu ce am) sau pentru trăit cu colecția (ascult, notez, redescoper)? Ideile de la punctele 1 și 2 presupun a doua variantă.
- Merită sincronizarea între dispozitive suficient cât să justifice un backend? Alternativa e export/import manual, care e neplăcut dar zero-cost.
