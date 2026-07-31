import { createAlbum } from './album.js'
import { generateCover } from './coverArt.js'
import { STATUS } from './constants.js'

// Colecție demo: un secol de muzică, 1923–2022.
// Anii și casele de discuri sunt cele reale; prețurile și stările sunt plauzibile, nu reale.
// Înregistrările de dinainte de apariția LP-ului (1948) apar ca discuri de 10" — shellac la 78 rpm.
const OWNED = [
  // ============ Anii 1920 ============
  { artist: 'Bessie Smith', title: 'Downhearted Blues', year: 1923, genres: ['Blues', 'Jazz'], label: 'Columbia', format: '10"', condition: 'G+', purchasePrice: 320, estimatedValue: 640, rating: 5,
    notes: 'Shellac original, 78 rpm. Zgomot de suprafață constant, dar vocea trece prin tot.' },
  { artist: 'Jelly Roll Morton', title: 'Black Bottom Stomp', year: 1926, genres: ['Jazz'], label: 'Victor', format: '10"', condition: 'G', purchasePrice: 280, estimatedValue: 520, rating: 5 },
  { artist: 'Duke Ellington', title: 'East St. Louis Toodle-Oo', year: 1927, genres: ['Jazz'], label: 'Victor', format: '10"', condition: 'G+', purchasePrice: 300, estimatedValue: 560, rating: 4 },
  { artist: 'Louis Armstrong', title: 'West End Blues', year: 1928, genres: ['Jazz'], label: 'OKeh', format: '10"', condition: 'VG', purchasePrice: 420, estimatedValue: 850, rating: 5,
    notes: 'Introducerea de trompetă merită singură prețul.' },

  // ============ Anii 1930 ============
  { artist: 'Robert Johnson', title: 'Cross Road Blues', year: 1937, genres: ['Blues'], label: 'Vocalion', format: '10"', condition: 'G', purchasePrice: 480, estimatedValue: 980, rating: 5 },
  { artist: 'Benny Goodman', title: 'Sing, Sing, Sing', year: 1937, genres: ['Jazz'], label: 'Victor', format: '10"', condition: 'VG', purchasePrice: 260, estimatedValue: 460, rating: 4 },
  { artist: 'Django Reinhardt & Stéphane Grappelli', title: 'Minor Swing', year: 1937, genres: ['Jazz'], label: 'Swing', format: '10"', condition: 'VG', purchasePrice: 340, estimatedValue: 620, rating: 5 },
  { artist: 'Billie Holiday', title: 'Strange Fruit', year: 1939, genres: ['Jazz', 'Blues'], label: 'Commodore', format: '10"', condition: 'VG', purchasePrice: 450, estimatedValue: 900, rating: 5 },

  // ============ Anii 1940 ============
  { artist: 'Nat King Cole Trio', title: 'The King Cole Trio', year: 1944, genres: ['Jazz'], label: 'Capitol', format: 'Box Set', condition: 'G+', purchasePrice: 380, estimatedValue: 700, rating: 4,
    notes: 'Album de 78-uri în mapă. Una dintre plăci are un crack fin pe margine.' },
  { artist: 'Charlie Parker', title: 'Ko-Ko', year: 1945, genres: ['Jazz'], label: 'Savoy', format: '10"', condition: 'VG', purchasePrice: 390, estimatedValue: 760, rating: 5 },
  { artist: 'Dizzy Gillespie', title: 'Salt Peanuts', year: 1945, genres: ['Jazz'], label: 'Guild', format: '10"', condition: 'G+', purchasePrice: 310, estimatedValue: 580, rating: 4 },
  { artist: 'Frank Sinatra', title: 'The Voice of Frank Sinatra', year: 1946, genres: ['Pop', 'Jazz'], label: 'Columbia', format: 'Box Set', condition: 'VG', purchasePrice: 290, estimatedValue: 520, rating: 4 },

  // ============ Anii 1950 ============
  { artist: 'Frank Sinatra', title: 'In the Wee Small Hours', year: 1955, genres: ['Pop', 'Jazz'], label: 'Capitol', condition: 'VG+', purchasePrice: 230, estimatedValue: 380, rating: 5 },
  { artist: 'Sarah Vaughan', title: 'Sarah Vaughan with Clifford Brown', year: 1955, genres: ['Jazz'], label: 'EmArcy', condition: 'VG', purchasePrice: 210, estimatedValue: 390, rating: 5 },
  { artist: 'Elvis Presley', title: 'Elvis Presley', year: 1956, genres: ['Rock', 'Pop'], label: 'RCA Victor', condition: 'VG', purchasePrice: 280, estimatedValue: 520, rating: 4 },
  { artist: 'Ella Fitzgerald', title: 'Sings the Cole Porter Songbook', year: 1956, genres: ['Jazz', 'Pop'], label: 'Verve', format: 'Box Set', condition: 'VG+', purchasePrice: 260, estimatedValue: 430, rating: 5 },
  { artist: 'Chuck Berry', title: 'After School Session', year: 1957, genres: ['Rock', 'Blues'], label: 'Chess', condition: 'G+', purchasePrice: 240, estimatedValue: 460, rating: 5 },
  { artist: 'Little Richard', title: "Here's Little Richard", year: 1957, genres: ['Rock', 'Soul'], label: 'Specialty', condition: 'VG', purchasePrice: 250, estimatedValue: 480, rating: 5 },
  { artist: 'Miles Davis', title: 'Kind of Blue', year: 1959, genres: ['Jazz'], label: 'Columbia', condition: 'VG+', sleeveCondition: 'VG', purchasePrice: 180, estimatedValue: 340, rating: 5,
    notes: 'Reeditare 180g de la Sony. Fața B are un pop ușor la începutul primului track.',
    tracklist: [
      { position: 'A1', title: 'So What', duration: '9:22' },
      { position: 'A2', title: 'Freddie Freeloader', duration: '9:46' },
      { position: 'A3', title: 'Blue in Green', duration: '5:37' },
      { position: 'B1', title: 'All Blues', duration: '11:33' },
      { position: 'B2', title: 'Flamenco Sketches', duration: '9:26' },
    ] },
  { artist: 'Dave Brubeck Quartet', title: 'Time Out', year: 1959, genres: ['Jazz'], label: 'Columbia', condition: 'VG+', purchasePrice: 165, estimatedValue: 290, rating: 4 },
  { artist: 'Charles Mingus', title: 'Mingus Ah Um', year: 1959, genres: ['Jazz'], label: 'Columbia', condition: 'VG', purchasePrice: 150, estimatedValue: 260, rating: 5 },
  { artist: 'Ray Charles', title: "What'd I Say", year: 1959, genres: ['Soul', 'Blues'], label: 'Atlantic', condition: 'VG', purchasePrice: 200, estimatedValue: 360, rating: 5 },

  // ============ Anii 1960 ============
  { artist: 'Bill Evans Trio', title: 'Sunday at the Village Vanguard', year: 1961, genres: ['Jazz'], label: 'Riverside', condition: 'G+', purchasePrice: 130, estimatedValue: 200, rating: 4,
    notes: 'Ediție uzată, dar sună surprinzător de bine. Coperta are ring wear vizibil.' },
  { artist: 'James Brown', title: 'Live at the Apollo', year: 1963, genres: ['Soul', 'Funk'], label: 'King', condition: 'VG', purchasePrice: 220, estimatedValue: 400, rating: 5 },
  { artist: 'John Coltrane', title: 'A Love Supreme', year: 1965, genres: ['Jazz'], label: 'Impulse!', condition: 'VG', purchasePrice: 210, estimatedValue: 380, rating: 5 },
  { artist: 'Otis Redding', title: 'Otis Blue', year: 1965, genres: ['Soul'], label: 'Volt', condition: 'VG+', purchasePrice: 230, estimatedValue: 420, rating: 5 },
  { artist: 'Nina Simone', title: 'I Put a Spell on You', year: 1965, genres: ['Jazz', 'Soul'], label: 'Philips', condition: 'VG', purchasePrice: 200, estimatedValue: 350, rating: 5 },
  { artist: 'The Beatles', title: 'Revolver', year: 1966, genres: ['Rock', 'Pop'], label: 'Parlophone', condition: 'G+', purchasePrice: 220, estimatedValue: 300, rating: 5 },
  { artist: 'The Beach Boys', title: 'Pet Sounds', year: 1966, genres: ['Pop', 'Rock'], label: 'Capitol', condition: 'VG', purchasePrice: 240, estimatedValue: 430, rating: 5 },
  { artist: 'The Velvet Underground', title: 'The Velvet Underground & Nico', year: 1967, genres: ['Rock', 'Experimental'], label: 'Verve', condition: 'VG', purchasePrice: 290, estimatedValue: 520, rating: 5,
    notes: 'Reeditare cu banana nedecojită. Originalul rămâne un vis.' },
  { artist: 'Aretha Franklin', title: 'I Never Loved a Man the Way I Love You', year: 1967, genres: ['Soul'], label: 'Atlantic', condition: 'VG', purchasePrice: 185, estimatedValue: 300, rating: 5 },
  { artist: 'The Jimi Hendrix Experience', title: 'Are You Experienced', year: 1967, genres: ['Rock', 'Blues'], label: 'Track', condition: 'VG+', purchasePrice: 270, estimatedValue: 470, rating: 5 },
  { artist: 'The Rolling Stones', title: 'Beggars Banquet', year: 1968, genres: ['Rock', 'Blues'], label: 'Decca', condition: 'VG', purchasePrice: 210, estimatedValue: 350, rating: 4 },
  { artist: 'The Beatles', title: 'Abbey Road', year: 1969, genres: ['Rock', 'Pop'], label: 'Apple', condition: 'VG', purchasePrice: 300, estimatedValue: 480, rating: 5 },
  { artist: 'Dusty Springfield', title: 'Dusty in Memphis', year: 1969, genres: ['Soul', 'Pop'], label: 'Atlantic', condition: 'VG+', purchasePrice: 195, estimatedValue: 340, rating: 5 },

  // ============ Anii 1970 ============
  { artist: 'Sly & The Family Stone', title: "There's a Riot Goin' On", year: 1971, genres: ['Funk', 'Soul'], label: 'Epic', condition: 'VG', purchasePrice: 205, estimatedValue: 370, rating: 5 },
  { artist: 'Funkadelic', title: 'Maggot Brain', year: 1971, genres: ['Funk', 'Rock'], label: 'Westbound', condition: 'VG+', purchasePrice: 250, estimatedValue: 450, rating: 5 },
  { artist: 'Marvin Gaye', title: "What's Going On", year: 1971, genres: ['Soul'], label: 'Tamla', condition: 'VG+', purchasePrice: 220, estimatedValue: 350, rating: 5 },
  { artist: 'Led Zeppelin', title: 'Led Zeppelin IV', year: 1971, genres: ['Rock', 'Metal'], label: 'Atlantic', condition: 'VG+', purchasePrice: 240, estimatedValue: 380, rating: 5 },
  { artist: 'David Bowie', title: 'The Rise and Fall of Ziggy Stardust and the Spiders from Mars', year: 1972, genres: ['Rock', 'Pop'], label: 'RCA', condition: 'VG+', purchasePrice: 260, estimatedValue: 400, rating: 5 },
  { artist: 'Curtis Mayfield', title: 'Super Fly', year: 1972, genres: ['Soul', 'Funk', 'Soundtrack'], label: 'Curtom', condition: 'VG+', purchasePrice: 210, estimatedValue: 330, rating: 5 },
  { artist: 'Al Green', title: "Let's Stay Together", year: 1972, genres: ['Soul'], label: 'Hi', condition: 'VG', purchasePrice: 180, estimatedValue: 300, rating: 5 },
  { artist: 'Pink Floyd', title: 'The Dark Side of the Moon', year: 1973, genres: ['Rock'], label: 'Harvest', condition: 'NM', sleeveCondition: 'VG+', purchasePrice: 250, estimatedValue: 420, rating: 5,
    notes: 'Cu poster și cele două stickere originale.',
    tracklist: [
      { position: 'A1', title: 'Speak to Me', duration: '1:30' },
      { position: 'A2', title: 'Breathe', duration: '2:43' },
      { position: 'A3', title: 'On the Run', duration: '3:30' },
      { position: 'A4', title: 'Time', duration: '7:01' },
      { position: 'A5', title: 'The Great Gig in the Sky', duration: '4:36' },
      { position: 'B1', title: 'Money', duration: '6:23' },
      { position: 'B2', title: 'Us and Them', duration: '7:49' },
      { position: 'B3', title: 'Any Colour You Like', duration: '3:26' },
      { position: 'B4', title: 'Brain Damage', duration: '3:46' },
      { position: 'B5', title: 'Eclipse', duration: '2:03' },
    ] },
  { artist: 'Stevie Wonder', title: 'Innervisions', year: 1973, genres: ['Soul', 'Funk'], label: 'Tamla', condition: 'VG', purchasePrice: 190, estimatedValue: 290, rating: 5 },
  { artist: 'Herbie Hancock', title: 'Head Hunters', year: 1973, genres: ['Jazz', 'Funk'], label: 'Columbia', condition: 'NM', purchasePrice: 190, estimatedValue: 250, rating: 5 },
  { artist: 'Phoenix', title: 'Mugur de fluier', year: 1974, genres: ['Rock', 'Folk'], label: 'Electrecord', condition: 'VG', purchasePrice: 150, estimatedValue: 320, rating: 5,
    notes: 'Presaj Electrecord. Greu de găsit în stare bună.' },
  { artist: 'Parliament', title: 'Mothership Connection', year: 1975, genres: ['Funk'], label: 'Casablanca', condition: 'VG', purchasePrice: 175, estimatedValue: 280, rating: 4 },
  { artist: 'Patti Smith', title: 'Horses', year: 1975, genres: ['Punk', 'Rock'], label: 'Arista', condition: 'VG+', purchasePrice: 230, estimatedValue: 390, rating: 5 },
  { artist: 'Pink Floyd', title: 'Wish You Were Here', year: 1975, genres: ['Rock'], label: 'Harvest', condition: 'VG+', purchasePrice: 230, estimatedValue: 340, rating: 5 },
  { artist: 'Phoenix', title: 'Cantafabule', year: 1975, genres: ['Rock', 'Folk'], label: 'Electrecord', format: 'Box Set', condition: 'G+', purchasePrice: 260, estimatedValue: 550, rating: 5 },
  { artist: 'Ramones', title: 'Ramones', year: 1976, genres: ['Punk'], label: 'Sire', condition: 'VG', purchasePrice: 170, estimatedValue: 250, rating: 4 },
  { artist: 'Fela Kuti', title: 'Zombie', year: 1976, genres: ['Funk', 'World'], label: 'Coconut', condition: 'VG', purchasePrice: 220, estimatedValue: 360, rating: 5 },
  { artist: 'Fleetwood Mac', title: 'Rumours', year: 1977, genres: ['Rock', 'Pop'], label: 'Warner Bros.', condition: 'G+', purchasePrice: 120, estimatedValue: 170, rating: 4 },
  { artist: 'Sex Pistols', title: 'Never Mind the Bollocks', year: 1977, genres: ['Punk'], label: 'Virgin', condition: 'VG', purchasePrice: 240, estimatedValue: 420, rating: 4 },
  { artist: 'Television', title: 'Marquee Moon', year: 1977, genres: ['Punk', 'Rock'], label: 'Elektra', condition: 'VG+', purchasePrice: 225, estimatedValue: 380, rating: 5 },
  { artist: 'David Bowie', title: 'Low', year: 1977, genres: ['Rock', 'Electronic'], label: 'RCA', condition: 'VG', purchasePrice: 200, estimatedValue: 310, rating: 4 },
  { artist: 'Donna Summer', title: 'I Feel Love', year: 1977, genres: ['Pop', 'Electronic'], label: 'Casablanca', format: '7"', condition: 'VG', purchasePrice: 70, estimatedValue: 120, rating: 5 },
  { artist: 'Sfinx', title: 'Zalmoxe', year: 1978, genres: ['Rock'], label: 'Electrecord', condition: 'VG', purchasePrice: 180, estimatedValue: 340, rating: 4 },
  { artist: 'The Clash', title: 'London Calling', year: 1979, genres: ['Punk', 'Rock'], label: 'CBS', format: 'Box Set', condition: 'VG', purchasePrice: 270, estimatedValue: 390, rating: 5 },
  { artist: 'Joy Division', title: 'Unknown Pleasures', year: 1979, genres: ['Punk', 'Rock'], label: 'Factory', condition: 'VG+', purchasePrice: 250, estimatedValue: 400, rating: 5 },

  // ============ Anii 1980 ============
  { artist: 'Talking Heads', title: 'Remain in Light', year: 1980, genres: ['Rock', 'Funk'], label: 'Sire', condition: 'VG+', purchasePrice: 200, estimatedValue: 300, rating: 5 },
  { artist: 'Black Flag', title: 'Damaged', year: 1981, genres: ['Punk'], label: 'SST', condition: 'VG', purchasePrice: 210, estimatedValue: 360, rating: 4 },
  { artist: 'Grace Jones', title: 'Nightclubbing', year: 1981, genres: ['Pop', 'Funk'], label: 'Island', condition: 'VG+', purchasePrice: 190, estimatedValue: 320, rating: 5 },
  { artist: 'Michael Jackson', title: 'Thriller', year: 1982, genres: ['Pop', 'Funk'], label: 'Epic', condition: 'VG', purchasePrice: 160, estimatedValue: 240, rating: 5 },
  { artist: 'New Order', title: 'Blue Monday', year: 1983, genres: ['Electronic', 'Pop'], label: 'Factory', format: '12"', condition: 'VG+', purchasePrice: 130, estimatedValue: 220, rating: 5 },
  { artist: 'Minor Threat', title: 'Out of Step', year: 1983, genres: ['Punk'], label: 'Dischord', format: 'EP', condition: 'VG', purchasePrice: 180, estimatedValue: 340, rating: 4 },
  { artist: 'Prince', title: 'Purple Rain', year: 1984, genres: ['Funk', 'Pop', 'Rock'], label: 'Warner Bros.', condition: 'VG+', purchasePrice: 210, estimatedValue: 330, rating: 5 },
  { artist: 'Kate Bush', title: 'Hounds of Love', year: 1985, genres: ['Pop', 'Rock'], label: 'EMI', condition: 'NM', purchasePrice: 240, estimatedValue: 390, rating: 5 },
  { artist: 'The Smiths', title: 'The Queen Is Dead', year: 1986, genres: ['Rock', 'Pop'], label: 'Rough Trade', condition: 'VG+', purchasePrice: 215, estimatedValue: 350, rating: 5 },
  { artist: 'Sonic Youth', title: 'Daydream Nation', year: 1988, genres: ['Rock', 'Punk'], label: 'Blast First', condition: 'VG', purchasePrice: 230, estimatedValue: 380, rating: 4 },
  { artist: 'Madonna', title: 'Like a Prayer', year: 1989, genres: ['Pop'], label: 'Sire', condition: 'VG+', purchasePrice: 150, estimatedValue: 230, rating: 4 },

  // ============ Anii 1990 ============
  { artist: 'Nirvana', title: 'Nevermind', year: 1991, genres: ['Rock', 'Punk'], label: 'DGC', condition: 'VG+', purchasePrice: 210, estimatedValue: 280, rating: 4 },
  { artist: 'PJ Harvey', title: 'Rid of Me', year: 1993, genres: ['Rock', 'Punk'], label: 'Island', condition: 'VG+', purchasePrice: 195, estimatedValue: 310, rating: 5 },
  { artist: 'Cassandra Wilson', title: "Blue Light 'Til Dawn", year: 1993, genres: ['Jazz', 'Blues'], label: 'Blue Note', condition: 'NM', purchasePrice: 205, estimatedValue: 300, rating: 5 },
  { artist: 'Portishead', title: 'Dummy', year: 1994, genres: ['Electronic', 'Pop'], label: 'Go! Beat', condition: 'NM', purchasePrice: 210, estimatedValue: 280, rating: 5 },
  { artist: "D'Angelo", title: 'Brown Sugar', year: 1995, genres: ['Soul', 'Funk'], label: 'EMI', condition: 'VG+', purchasePrice: 230, estimatedValue: 360, rating: 5 },
  { artist: 'Pulp', title: 'Different Class', year: 1995, genres: ['Pop', 'Rock'], label: 'Island', condition: 'VG+', purchasePrice: 185, estimatedValue: 290, rating: 5 },
  { artist: 'Erykah Badu', title: 'Baduizm', year: 1997, genres: ['Soul'], label: 'Kedar', condition: 'NM', purchasePrice: 220, estimatedValue: 310, rating: 5 },
  { artist: 'Radiohead', title: 'OK Computer', year: 1997, genres: ['Rock', 'Electronic'], label: 'Parlophone', condition: 'NM', purchasePrice: 230, estimatedValue: 290, rating: 5 },
  { artist: 'Björk', title: 'Homogenic', year: 1997, genres: ['Pop', 'Electronic'], label: 'One Little Indian', condition: 'VG', purchasePrice: 140, estimatedValue: 230, rating: 4,
    notes: 'Găsit la un târg în Cluj. Coperta puțin decolorată pe cotor.' },

  // ============ Anii 2000 ============
  { artist: 'Interpol', title: 'Turn On the Bright Lights', year: 2002, genres: ['Rock', 'Punk'], label: 'Matador', condition: 'NM', purchasePrice: 200, estimatedValue: 280, rating: 4 },
  { artist: 'The White Stripes', title: 'Elephant', year: 2003, genres: ['Rock', 'Blues'], label: 'XL Recordings', condition: 'NM', purchasePrice: 215, estimatedValue: 300, rating: 5 },
  { artist: 'Arcade Fire', title: 'Funeral', year: 2004, genres: ['Rock'], label: 'Merge', condition: 'NM', purchasePrice: 190, estimatedValue: 240, rating: 4 },
  { artist: 'Amy Winehouse', title: 'Back to Black', year: 2006, genres: ['Soul', 'Pop'], label: 'Island', condition: 'M', purchasePrice: 230, estimatedValue: 320, rating: 5 },
  { artist: 'Sharon Jones & The Dap-Kings', title: '100 Days, 100 Nights', year: 2007, genres: ['Soul', 'Funk'], label: 'Daptone', condition: 'NM', purchasePrice: 195, estimatedValue: 270, rating: 5 },
  { artist: 'Radiohead', title: 'In Rainbows', year: 2007, genres: ['Rock', 'Electronic'], label: 'XL Recordings', condition: 'M', purchasePrice: 220, estimatedValue: 270, rating: 5 },

  // ============ Anii 2010 ============
  { artist: "D'Angelo and The Vanguard", title: 'Black Messiah', year: 2014, genres: ['Soul', 'Funk'], label: 'RCA', condition: 'M', purchasePrice: 240, estimatedValue: 300, rating: 5 },
  { artist: 'Kamasi Washington', title: 'The Epic', year: 2015, genres: ['Jazz'], label: 'Brainfeeder', format: 'Box Set', condition: 'NM', purchasePrice: 320, estimatedValue: 420, rating: 5 },
  { artist: 'Tame Impala', title: 'Currents', year: 2015, genres: ['Rock', 'Pop'], label: 'Modular', condition: 'M', purchasePrice: 200, estimatedValue: 230, rating: 4 },
  { artist: 'Anderson .Paak', title: 'Malibu', year: 2016, genres: ['Funk', 'Soul'], label: 'Steel Wool', condition: 'NM', purchasePrice: 210, estimatedValue: 280, rating: 5 },
  { artist: 'Vulfpeck', title: 'The Beautiful Game', year: 2016, genres: ['Funk'], label: 'Vulf', condition: 'M', purchasePrice: 190, estimatedValue: 250, rating: 4 },
  { artist: 'Lorde', title: 'Melodrama', year: 2017, genres: ['Pop'], label: 'Lava', condition: 'M', purchasePrice: 180, estimatedValue: 220, rating: 4 },
  { artist: 'IDLES', title: 'Joy as an Act of Resistance', year: 2018, genres: ['Punk', 'Rock'], label: 'Partisan', condition: 'M', purchasePrice: 185, estimatedValue: 230, rating: 5 },
  { artist: 'Sault', title: '7', year: 2019, genres: ['Soul', 'Funk'], label: 'Forever Living Originals', condition: 'NM', purchasePrice: 250, estimatedValue: 380, rating: 5,
    notes: 'Tiraj mic, fără promovare. Deja greu de găsit.' },

  // ============ Anii 2020 ============
  { artist: 'Nubya Garcia', title: 'Source', year: 2020, genres: ['Jazz'], label: 'Concord Jazz', condition: 'M', purchasePrice: 195, estimatedValue: 240, rating: 5 },
  { artist: 'Olivia Rodrigo', title: 'SOUR', year: 2021, genres: ['Pop', 'Punk'], label: 'Geffen', condition: 'M', purchasePrice: 170, estimatedValue: 200, rating: 4 },
  { artist: 'Silk Sonic', title: 'An Evening with Silk Sonic', year: 2021, genres: ['Soul', 'Funk'], label: 'Aftermath', condition: 'M', purchasePrice: 200, estimatedValue: 250, rating: 5 },
  { artist: 'Wet Leg', title: 'Wet Leg', year: 2022, genres: ['Punk', 'Rock'], label: 'Domino', condition: 'M', purchasePrice: 175, estimatedValue: 210, rating: 4 },
  { artist: 'Beyoncé', title: 'Renaissance', year: 2022, genres: ['Pop', 'Electronic'], label: 'Parkwood', format: 'Box Set', condition: 'M', purchasePrice: 260, estimatedValue: 310, rating: 5 },
  { artist: 'Ezra Collective', title: "Where I'm Meant to Be", year: 2022, genres: ['Jazz', 'Funk'], label: 'Partisan', condition: 'M', purchasePrice: 190, estimatedValue: 230, rating: 5 },
]

const WISHLIST = [
  { artist: 'Ma Rainey', title: 'See See Rider Blues', year: 1925, genres: ['Blues', 'Jazz'], label: 'Paramount', format: '10"', condition: 'G', estimatedValue: 1200,
    notes: 'Presajele Paramount sunt notoriu zgomotoase, dar rarisime. Un vis, nu un plan.' },
  { artist: 'Thelonious Monk', title: 'Brilliant Corners', year: 1957, genres: ['Jazz'], label: 'Riverside', condition: 'VG+', estimatedValue: 520 },
  { artist: 'Sam Cooke', title: 'Night Beat', year: 1963, genres: ['Soul', 'Blues'], label: 'RCA Victor', condition: 'VG+', estimatedValue: 460 },
  { artist: 'The Stooges', title: 'Fun House', year: 1970, genres: ['Punk', 'Rock'], label: 'Elektra', condition: 'VG', estimatedValue: 480 },
  { artist: 'Betty Davis', title: "They Say I'm Different", year: 1974, genres: ['Funk', 'Soul'], label: 'Just Sunshine', condition: 'VG+', estimatedValue: 550 },
  { artist: 'Wire', title: 'Pink Flag', year: 1977, genres: ['Punk'], label: 'Harvest', condition: 'VG+', estimatedValue: 420 },
  { artist: 'X-Ray Spex', title: 'Germfree Adolescents', year: 1978, genres: ['Punk'], label: 'EMI', condition: 'VG', estimatedValue: 390 },
  { artist: 'Slowdive', title: 'Souvlaki', year: 1993, genres: ['Rock', 'Pop'], label: 'Creation', condition: 'NM', estimatedValue: 340 },
  { artist: 'Fela Kuti', title: 'Expensive Shit', year: 1975, genres: ['Funk', 'World'], label: 'Soundwork Shop', condition: 'VG', estimatedValue: 350 },
  { artist: 'Little Simz', title: 'Sometimes I Might Be Introvert', year: 2021, genres: ['Soul', 'Hip-Hop'], label: 'Age 101', condition: 'M', estimatedValue: 280 },

  // The Cure
  { artist: 'The Cure', title: 'Pornography', year: 1982, genres: ['Rock', 'Punk'], label: 'Fiction', condition: 'VG+', estimatedValue: 430,
    notes: 'Presajul original UK, nu reeditarea. Caut unul cu coperta fără urme de inel.' },
  { artist: 'The Cure', title: 'Disintegration', year: 1989, genres: ['Rock', 'Pop'], label: 'Fiction', condition: 'NM', estimatedValue: 380 },

  // Radiohead
  { artist: 'Radiohead', title: 'The Bends', year: 1995, genres: ['Rock'], label: 'Parlophone', condition: 'VG+', estimatedValue: 350 },
  { artist: 'Radiohead', title: 'Kid A', year: 2000, genres: ['Rock', 'Electronic'], label: 'Parlophone', format: 'Box Set', condition: 'NM', estimatedValue: 470,
    notes: 'Ediția dublu 10\" cu carte. Se găsește rar completă.' },

  // Charlie Parker
  { artist: 'Charlie Parker', title: 'Charlie Parker with Strings', year: 1950, genres: ['Jazz'], label: 'Mercury', format: '10"', condition: 'VG', estimatedValue: 620 },
  { artist: 'Charlie Parker', title: 'Bird and Diz', year: 1956, genres: ['Jazz'], label: 'Clef', condition: 'VG+', estimatedValue: 540,
    notes: 'Cu Dizzy Gillespie și Thelonious Monk. Coperta desenată de David Stone Martin.' },
]

const DAY = 24 * 60 * 60 * 1000

/**
 * Generează colecția demo. Datele de adăugare sunt eșalonate în urmă,
 * ca sortarea „adăugat recent" să aibă sens.
 */
export function seedAlbums() {
  const now = Date.now()
  const all = [
    ...OWNED.map((a) => ({ ...a, status: STATUS.OWNED })),
    ...WISHLIST.map((a) => ({ ...a, status: STATUS.WISHLIST })),
  ]

  return all.map((input, i) => {
    const album = createAlbum(input)
    // primul din listă = cel mai vechi adăugat
    const addedAt = new Date(now - (all.length - i) * 8 * DAY).toISOString()
    album.createdAt = addedAt
    album.updatedAt = addedAt
    if (album.status === STATUS.OWNED && album.purchasePrice !== null) {
      album.purchaseDate = addedAt.slice(0, 10)
    }
    // Trei sferturi primesc copertă generată; restul rămân cu placeholder-ul
    // cu inițiale, ca ambele stări să fie vizibile în interfață.
    if (i % 4 !== 3) {
      album.coverUrl = generateCover(album)
    }
    return album
  })
}
