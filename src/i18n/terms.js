/**
 * Conținutul paginii de Termeni și condiții, pe limbi.
 * Ținut separat de dicționarul principal, fiindcă sunt paragrafe, nu etichete de interfață.
 */
export const TERMS_UPDATED = '2026-08-03'

const ro = {
  title: 'Termeni și condiții',
  updated: 'Ultima actualizare',
  intro:
    'Vinilotecă este o aplicație personală pentru evidența unei colecții de viniluri. Folosind-o, ești de acord cu punctele de mai jos. Sunt scrise pe înțelesul tuturor, fără limbaj juridic inutil.',
  sections: [
    {
      title: 'Ce este aplicația',
      body: [
        'Aplicația rulează integral în browserul tău. Nu există cont, nu există server care să îți stocheze colecția și nimeni — inclusiv autorul aplicației — nu poate vedea ce ai adăugat.',
        'Este un proiect personal, oferit gratuit și fără garanții de disponibilitate. Poate fi modificat sau oprit oricând.',
      ],
    },
    {
      title: 'Datele tale',
      body: [
        'Toate informațiile pe care le introduci se salvează în memoria locală a browserului (localStorage), pe dispozitivul tău. Nu se transmit nicăieri.',
        'Asta înseamnă și că se pot pierde: dacă golești datele browserului, folosești modul incognito, schimbi dispozitivul sau browserul, colecția dispare. Ești singurul responsabil pentru copiile de siguranță — folosește periodic funcția de export din meniul „Date".',
        'Spațiul disponibil în browser este limitat (aproximativ 5 MB). Dacă încarci multe coperte proprii, poți atinge limita, iar salvarea va eșua. Aplicația te avertizează când se întâmplă.',
      ],
    },
    {
      title: 'Fără garanții',
      body: [
        'Aplicația este oferită „ca atare". Nu se garantează că funcționează fără erori, că datele nu se pierd și că valorile estimate sunt corecte.',
        'Autorul nu răspunde pentru pierderi de date, decizii de cumpărare sau vânzare luate pe baza informațiilor din aplicație, ori alte daune rezultate din folosirea ei.',
      ],
    },
    {
      title: 'Valorile și prețurile',
      body: [
        'Valoarea estimată a fiecărui disc este cea introdusă manual de tine. Aplicația nu consultă nicio piață și nu face evaluări proprii.',
        'Cifrele din pagina de statistici sunt simple însumări ale datelor tale. Nu constituie o evaluare profesională și nu pot fi folosite ca atare în scopuri de asigurare, moștenire sau vânzare.',
      ],
    },
    {
      title: 'Conținutul pe care îl adaugi',
      body: [
        'Rămâi proprietarul informațiilor și imaginilor pe care le introduci. Fiindcă nimic nu părăsește dispozitivul tău, nu se acordă nicio licență nimănui.',
        'Ești responsabil să te asiguri că ai dreptul de a folosi imaginile pe care le încarci.',
      ],
    },
    {
      title: 'Copertele generate',
      body: [
        'Albumele fără imagine primesc o copertă generată automat: un desen abstract construit din numele artistului și al albumului. Nu reproduce coperta reală și nu are legătură cu ea.',
        'Datele demo conțin albume reale, folosite doar ca exemplu, fără imagini protejate de drepturi de autor.',
      ],
    },
    {
      title: 'Linkuri externe',
      body: [
        'Aplicația conține linkuri către site-uri terțe, precum Discogs sau MusicBrainz. Acestea au propriii termeni și propriile politici de confidențialitate, pentru care nu purtăm răspundere.',
      ],
    },
    {
      title: 'Modificări',
      body: [
        'Acești termeni pot fi actualizați odată cu aplicația. Data ultimei modificări apare mai sus.',
      ],
    },
  ],
}

const en = {
  title: 'Terms and conditions',
  updated: 'Last updated',
  intro:
    'Vinyl Library is a personal app for keeping track of a vinyl record collection. By using it, you agree to the points below. They are written in plain language, without unnecessary legalese.',
  sections: [
    {
      title: 'What this app is',
      body: [
        'The app runs entirely in your browser. There is no account, no server storing your collection, and nobody — including the author — can see what you have added.',
        'It is a personal project, offered free of charge and with no guarantee of availability. It may change or stop working at any time.',
      ],
    },
    {
      title: 'Your data',
      body: [
        'Everything you enter is saved in your browser’s local storage, on your own device. Nothing is transmitted anywhere.',
        'This also means it can be lost: clearing your browser data, using private mode, or switching device or browser will take the collection with it. Backups are entirely your responsibility — use the export function in the “Data” menu regularly.',
        'Browser storage is limited (roughly 5 MB). If you upload many of your own cover images you may hit that limit and saving will fail. The app warns you when this happens.',
      ],
    },
    {
      title: 'No warranty',
      body: [
        'The app is provided “as is”. There is no guarantee that it works without errors, that data will not be lost, or that estimated values are accurate.',
        'The author is not liable for data loss, for buying or selling decisions made on the basis of information in the app, or for any other damages arising from its use.',
      ],
    },
    {
      title: 'Values and prices',
      body: [
        'The estimated value of each record is the one you enter yourself. The app does not consult any marketplace and does not appraise anything.',
        'The figures on the stats page are simple sums of your own data. They are not a professional valuation and cannot be used as one for insurance, inheritance or sale purposes.',
      ],
    },
    {
      title: 'Content you add',
      body: [
        'You remain the owner of the information and images you enter. Since nothing leaves your device, no licence is granted to anyone.',
        'You are responsible for making sure you have the right to use any images you upload.',
      ],
    },
    {
      title: 'Generated covers',
      body: [
        'Records without an image get an automatically generated cover: an abstract drawing built from the artist and album name. It does not reproduce the real cover and bears no relation to it.',
        'The demo data contains real albums, used purely as examples, with no copyrighted artwork.',
      ],
    },
    {
      title: 'External links',
      body: [
        'The app links to third-party sites such as Discogs and MusicBrainz. Those have their own terms and privacy policies, for which we take no responsibility.',
      ],
    },
    {
      title: 'Changes',
      body: ['These terms may be updated along with the app. The date of the last change is shown above.'],
    },
  ],
}

export const TERMS = { ro, en }
