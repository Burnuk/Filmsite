import { useState, useEffect, useRef } from "react";

const OMDB_KEY = "e55d496a";

const FILMS = [
  { id: 1,  title: "Inception",             year: 2010, director: "Christopher Nolan",    genre: "Bilim Kurgu",      rating: 8.8, imdb: "tt1375666", desc: "Ruyalarin icine girerek fikir calan bir hirsizin hikayesi." },
  { id: 2,  title: "Interstellar",           year: 2014, director: "Christopher Nolan",    genre: "Bilim Kurgu",      rating: 8.6, imdb: "tt0816692", desc: "Insanligin gelecegini kurtarmak icin yildizlararasi seyahat." },
  { id: 3,  title: "The Dark Knight",        year: 2008, director: "Christopher Nolan",    genre: "Aksiyon",          rating: 9.0, imdb: "tt0468569", desc: "Batman Joker ile yuzlesiyor." },
  { id: 4,  title: "Parasite",               year: 2019, director: "Bong Joon-ho",         genre: "Gerilim",          rating: 8.5, imdb: "tt6751668", desc: "Iki ailenin carpismasi." },
  { id: 5,  title: "The Godfather",          year: 1972, director: "Francis Ford Coppola", genre: "Suc / Dram",       rating: 9.2, imdb: "tt0068646", desc: "En guclu mafya ailesinin iktidar mucadelesi." },
  { id: 6,  title: "The Shawshank Redemption", year: 1994, director: "Frank Darabont",     genre: "Dram",             rating: 9.3, imdb: "tt0111161", desc: "Haksiz yere hapsedilen bankacinin hayatta kalma hikayesi." },
  { id: 7,  title: "The Godfather Part II",  year: 1974, director: "Francis Ford Coppola", genre: "Suc / Dram",       rating: 9.0, imdb: "tt0071562", desc: "Corleone ailesinin yukselisi ve Michael'in iktidari." },
  { id: 8,  title: "12 Angry Men",           year: 1957, director: "Sidney Lumet",         genre: "Dram",             rating: 9.0, imdb: "tt0050083", desc: "12 juri uyesinin bir cinayet davasini tartistigi film." },
  { id: 9,  title: "Schindler's List",       year: 1993, director: "Steven Spielberg",     genre: "Tarih / Dram",     rating: 9.0, imdb: "tt0108052", desc: "2. Dunya Savasi'nda Yahudileri kurtaran Alman is insani." },
  { id: 10, title: "LOTR: Return of the King", year: 2003, director: "Peter Jackson",      genre: "Fantastik",        rating: 9.0, imdb: "tt0167260", desc: "Yuzuklerin Efendisi uclemesinin epik sonucu." },
  { id: 11, title: "Pulp Fiction",            year: 1994, director: "Quentin Tarantino",   genre: "Suc / Dram",       rating: 8.9, imdb: "tt0110912", desc: "Los Angeles'ta birbirine bagli suclu hikayeler." },
  { id: 12, title: "LOTR: Fellowship of the Ring", year: 2001, director: "Peter Jackson",  genre: "Fantastik",        rating: 8.8, imdb: "tt0120737", desc: "Bir hobbit ve arkadaslarinin yuzugu yok etme yolculugu." },
  { id: 13, title: "The Good the Bad and the Ugly", year: 1966, director: "Sergio Leone",  genre: "Western",          rating: 8.8, imdb: "tt0060196", desc: "Uc silahsorun gizli bir hazineyi arar." },
  { id: 14, title: "Forrest Gump",            year: 1994, director: "Robert Zemeckis",     genre: "Dram / Komedi",    rating: 8.8, imdb: "tt0109830", desc: "Engelli bir adamın olaganustu hayat hikayesi." },
  { id: 15, title: "LOTR: The Two Towers",    year: 2002, director: "Peter Jackson",       genre: "Fantastik",        rating: 8.8, imdb: "tt0167261", desc: "Yuzuk Kardesliginin bolunmesinin ardindan savas baslar." },
  { id: 16, title: "Fight Club",              year: 1999, director: "David Fincher",        genre: "Dram / Gerilim",   rating: 8.8, imdb: "tt0137523", desc: "Mutsuz bir is insani gizli bir duello kulubu kurar." },
  { id: 17, title: "Goodfellas",              year: 1990, director: "Martin Scorsese",      genre: "Suc / Dram",       rating: 8.7, imdb: "tt0099685", desc: "New York mafyasinda yukselip dusen adamın hikayesi." },
  { id: 18, title: "The Matrix",              year: 1999, director: "Lana Wachowski",       genre: "Bilim Kurgu",      rating: 8.7, imdb: "tt0133093", desc: "Gercekligin aslinda bir simulasyon oldugunu ogrenen hacker." },
  { id: 19, title: "One Flew Over the Cuckoos Nest", year: 1975, director: "Milos Forman", genre: "Dram",             rating: 8.7, imdb: "tt0073486", desc: "Akil hastanesinde hastalar ile kati hemsire arasindaki mucadele." },
  { id: 20, title: "Star Wars Episode V",     year: 1980, director: "Irvin Kershner",       genre: "Bilim Kurgu",      rating: 8.7, imdb: "tt0080684", desc: "Luke Skywalker Darth Vader ile yuzlesir." },
  { id: 21, title: "The Silence of the Lambs", year: 1991, director: "Jonathan Demme",     genre: "Gerilim / Korku",  rating: 8.6, imdb: "tt0102926", desc: "FBI adayi seri katili yakalamak icin katille isbirligi yapar." },
  { id: 22, title: "City of God",             year: 2002, director: "Fernando Meirelles",   genre: "Suc / Dram",       rating: 8.6, imdb: "tt0317248", desc: "Rio'nun en tehlikeli mahallesinde buyuyen iki gencin hikayesi." },
  { id: 23, title: "Saving Private Ryan",     year: 1998, director: "Steven Spielberg",     genre: "Savas / Dram",     rating: 8.6, imdb: "tt0120815", desc: "D-Day'den sonra kayip askeri bulmak icin gonderilen ekip." },
  { id: 24, title: "Spirited Away",           year: 2001, director: "Hayao Miyazaki",       genre: "Anime / Fantastik",rating: 8.6, imdb: "tt0245429", desc: "Ruhlar dunyasina kapilan kucuk bir kizin macerasi." },
  { id: 25, title: "Life is Beautiful",       year: 1997, director: "Roberto Benigni",      genre: "Dram / Komedi",    rating: 8.6, imdb: "tt0118799", desc: "Bir baba ogulunu Nazi kampinin korkusundan korur." },
  { id: 26, title: "The Green Mile",          year: 1999, director: "Frank Darabont",       genre: "Dram / Fantastik", rating: 8.6, imdb: "tt0120689", desc: "Olum koridorunda olaganustu mahkumla tanisan gardiyanin hikayesi." },
  { id: 27, title: "Terminator 2",            year: 1991, director: "James Cameron",        genre: "Aksiyon / Bilim Kurgu", rating: 8.5, imdb: "tt0103064", desc: "Gelecekten gelen robot insanligi kurtarmak icin gorevlendirilir." },
  { id: 28, title: "Back to the Future",      year: 1985, director: "Robert Zemeckis",      genre: "Bilim Kurgu / Komedi", rating: 8.5, imdb: "tt0088763", desc: "Bir genc zaman makinesinde 30 yil geriye gider." },
  { id: 29, title: "Whiplash",                year: 2014, director: "Damien Chazelle",      genre: "Dram / Muzik",     rating: 8.5, imdb: "tt2582802", desc: "Genc davulcunun zorlu ogretmenle iliskisi." },
  { id: 30, title: "The Pianist",             year: 2002, director: "Roman Polanski",       genre: "Savas / Dram",     rating: 8.5, imdb: "tt0253474", desc: "Yahudi piyanistin 2. Dunya Savasi'nda hayatta kalma hikayesi." },
  { id: 31, title: "Gladiator",               year: 2000, director: "Ridley Scott",         genre: "Aksiyon / Dram",   rating: 8.5, imdb: "tt0172495", desc: "Ihanete ugrayan general gladyator olarak intikam arar." },
  { id: 32, title: "The Lion King",           year: 1994, director: "Roger Allers",         genre: "Animasyon",        rating: 8.5, imdb: "tt0110357", desc: "Babasinin olumunden kendini sorumlu tutan aslan yavrusu." },
  { id: 33, title: "American History X",      year: 1998, director: "Tony Kaye",            genre: "Dram",             rating: 8.5, imdb: "tt0120586", desc: "Eski neo-Nazi kardesini ayni yola girmekten alikoymaya calisir." },
  { id: 34, title: "The Usual Suspects",      year: 1995, director: "Bryan Singer",         genre: "Gerilim / Suc",    rating: 8.5, imdb: "tt0114814", desc: "Gizemli suc orgutunun hikayesi." },
  { id: 35, title: "Psycho",                  year: 1960, director: "Alfred Hitchcock",     genre: "Gerilim / Korku",  rating: 8.5, imdb: "tt0054215", desc: "Issiz motele siginan kadinin basina gelenler." },
  { id: 36, title: "The Departed",            year: 2006, director: "Martin Scorsese",      genre: "Suc / Gerilim",    rating: 8.5, imdb: "tt0407887", desc: "Polis ve mafya icindeki ajan savasinin gerilimi." },
  { id: 37, title: "Memento",                 year: 2000, director: "Christopher Nolan",    genre: "Gerilim",          rating: 8.4, imdb: "tt0209144", desc: "Kisa sureli bellek kaybeden adamın katil arayisi." },
  { id: 38, title: "The Prestige",            year: 2006, director: "Christopher Nolan",    genre: "Dram / Gizem",     rating: 8.5, imdb: "tt0482571", desc: "Iki rakip sihirbazin birbirini yok etme savasi." },
  { id: 39, title: "Alien",                   year: 1979, director: "Ridley Scott",         genre: "Bilim Kurgu / Korku", rating: 8.4, imdb: "tt0078748", desc: "Uzay gemisindeki yaratiga karsi hayatta kalma mucadelesi." },
  { id: 40, title: "Apocalypse Now",          year: 1979, director: "Francis Ford Coppola", genre: "Savas / Dram",     rating: 8.4, imdb: "tt0078788", desc: "Vietnam Savasi'nda tehlikeli bir gorev." },
  { id: 41, title: "Braveheart",              year: 1995, director: "Mel Gibson",           genre: "Tarih / Aksiyon",  rating: 8.3, imdb: "tt0112573", desc: "William Wallace'in Ingiltere'ye karsi bagimsizlik savasi." },
  { id: 42, title: "The Shining",             year: 1980, director: "Stanley Kubrick",      genre: "Korku / Gerilim",  rating: 8.4, imdb: "tt0081505", desc: "Issiz otelde yavash yavash deliren adamın hikayesi." },
  { id: 43, title: "Avengers Endgame",        year: 2019, director: "Anthony Russo",        genre: "Aksiyon",          rating: 8.4, imdb: "tt4154796", desc: "Marvel kahramanlari evreni kurtarmak icin son savaslarini verir." },
  { id: 44, title: "Toy Story",               year: 1995, director: "John Lasseter",        genre: "Animasyon",        rating: 8.3, imdb: "tt0114709", desc: "Oyuncaklarin gizli dunyasinda gecen dostluk hikayesi." },
  { id: 45, title: "Joker",                   year: 2019, director: "Todd Phillips",        genre: "Dram / Gerilim",   rating: 8.4, imdb: "tt7286456", desc: "Batman'in en buyuk dusmaninin nasil ortaya ciktigi." },
  { id: 46, title: "Once Upon a Time in America", year: 1984, director: "Sergio Leone",     genre: "Suc / Dram",       rating: 8.3, imdb: "tt0087843", desc: "New York gangsterlerin yillara yayilan hikayesi." },
  { id: 47, title: "Paths of Glory",          year: 1957, director: "Stanley Kubrick",      genre: "Savas / Dram",     rating: 8.4, imdb: "tt0050825", desc: "1. Dunya Savasi'nda askerlerine ihanet eden komutanlara karsi." },
  { id: 48, title: "Django Unchained",        year: 2012, director: "Quentin Tarantino",    genre: "Western / Aksiyon",rating: 8.4, imdb: "tt1853728", desc: "Karisini kurtarmak icin yola cikan ozgur bir kole." },
  { id: 49, title: "WALL-E",                  year: 2008, director: "Andrew Stanton",       genre: "Animasyon",        rating: 8.4, imdb: "tt0910970", desc: "Gelecekte yalniz kalan robotun ask hikayesi." },
  { id: 50, title: "Grave of the Fireflies",  year: 1988, director: "Isao Takahata",        genre: "Anime / Savas",    rating: 8.5, imdb: "tt0095327", desc: "2. Dunya Savasi'nda hayatta kalmaya calisan iki kardesinin hikayesi." },
  { id: 51, title: "Casablanca",              year: 1942, director: "Michael Curtiz",       genre: "Romantik / Dram",  rating: 8.5, imdb: "tt0034583", desc: "2. Dunya Savasi'nda unutulmaz ask hikayesi." },
  { id: 52, title: "A Beautiful Mind",        year: 2001, director: "Ron Howard",           genre: "Biyografi / Dram", rating: 8.2, imdb: "tt0268978", desc: "Akil hastalığiyla savasirken Nobel kazanan dahinin hikayesi." },
  { id: 53, title: "The Intouchables",        year: 2011, director: "Olivier Nakache",      genre: "Dram / Komedi",    rating: 8.5, imdb: "tt1675434", desc: "Felicli adam ile bakim personeli arasindaki dostluk." },
  { id: 54, title: "Modern Times",            year: 1936, director: "Charlie Chaplin",      genre: "Komedi",           rating: 8.5, imdb: "tt0027977", desc: "Endustriyel cagda hayatta kalmaya calisan kucuk adamın seruvenleri." },
  { id: 55, title: "Rear Window",             year: 1954, director: "Alfred Hitchcock",     genre: "Gerilim / Gizem",  rating: 8.5, imdb: "tt0047396", desc: "Yaralı fotografcinin penceresinden cinayeti izlemesi." },
  { id: 56, title: "Cinema Paradiso",         year: 1988, director: "Giuseppe Tornatore",   genre: "Dram / Romantik",  rating: 8.5, imdb: "tt0095765", desc: "Kucuk Italyan kasabasinda buyuyen gencin sinema aski." },
  { id: 57, title: "Sunset Boulevard",        year: 1950, director: "Billy Wilder",         genre: "Dram / Gizem",     rating: 8.4, imdb: "tt0043014", desc: "Hollywood'un unutulmus yildizinin takintili iliskisi." },
  { id: 58, title: "Some Like It Hot",        year: 1959, director: "Billy Wilder",         genre: "Komedi",           rating: 8.2, imdb: "tt0053291", desc: "Cinayete tanik olan iki muzisyen kadin kiligi giyerek kacar." },
  { id: 59, title: "Dr. Strangelove",         year: 1964, director: "Stanley Kubrick",      genre: "Komedi / Bilim Kurgu", rating: 8.4, imdb: "tt0057012", desc: "Soguk Savas'ta nukleer felakete giden kaotik surec." },
  { id: 60, title: "Lawrence of Arabia",      year: 1962, director: "David Lean",           genre: "Tarih / Macera",   rating: 8.3, imdb: "tt0056172", desc: "T.E. Lawrence'in Arap Isyanindaki rolunun destansi hikayesi." },
  { id: 61, title: "North by Northwest",      year: 1959, director: "Alfred Hitchcock",     genre: "Gerilim / Macera", rating: 8.3, imdb: "tt0053125", desc: "Yanlis kimlik kurbanı olan reklamcının kacis hikayesi." },
  { id: 62, title: "Taxi Driver",             year: 1976, director: "Martin Scorsese",      genre: "Dram / Gerilim",   rating: 8.2, imdb: "tt0075314", desc: "New York'ta geceler calisan melankolik taksi soforu." },
  { id: 63, title: "Full Metal Jacket",       year: 1987, director: "Stanley Kubrick",      genre: "Savas / Dram",     rating: 8.3, imdb: "tt0093058", desc: "Vietnam Savasi'na gonderilen askerlerin hikayesi." },
  { id: 64, title: "Requiem for a Dream",     year: 2000, director: "Darren Aronofsky",     genre: "Dram",             rating: 8.3, imdb: "tt0180093", desc: "Madde bagimliliğinin dort insanin hayatini yok etmesi." },
  { id: 65, title: "Vertigo",                 year: 1958, director: "Alfred Hitchcock",     genre: "Gerilim / Romantik",rating: 8.3, imdb: "tt0052357", desc: "Yukseklik korkusu olan dedektifin gizemli kadini izlemesi." },
  { id: 66, title: "Reservoir Dogs",          year: 1992, director: "Quentin Tarantino",    genre: "Suc / Gerilim",    rating: 8.3, imdb: "tt0105236", desc: "Mucevher soygununda ters giden her seyin hikayesi." },
  { id: 67, title: "Eternal Sunshine",        year: 2004, director: "Michel Gondry",        genre: "Romantik / Bilim Kurgu", rating: 8.3, imdb: "tt0338013", desc: "Bir cift birbirlerini hafizasindan silmeye karar verir." },
  { id: 68, title: "2001 A Space Odyssey",    year: 1968, director: "Stanley Kubrick",      genre: "Bilim Kurgu",      rating: 8.3, imdb: "tt0062622", desc: "Insan evrimi ve yapay zekanin anlami uzerine epik yolculuk." },
  { id: 69, title: "Amadeus",                 year: 1984, director: "Milos Forman",         genre: "Biyografi / Dram", rating: 8.4, imdb: "tt0086879", desc: "Mozart ile rakibi Salieri arasindaki kiskanclik ve ihanet." },
  { id: 70, title: "To Kill a Mockingbird",   year: 1962, director: "Robert Mulligan",      genre: "Dram",             rating: 8.3, imdb: "tt0056592", desc: "Irc ayrimciligi doneminde bir avukatin adaleti arayisi." },
  { id: 71, title: "Ikiru",                   year: 1952, director: "Akira Kurosawa",       genre: "Dram",             rating: 8.3, imdb: "tt0044741", desc: "Olumcul hasta memurun hayatina anlam katma cabasi." },
  { id: 72, title: "Heat",                    year: 1995, director: "Michael Mann",         genre: "Suc / Aksiyon",    rating: 8.3, imdb: "tt0113277", desc: "Dedektif ile soyguncu arasindaki amansiz kovalamaca." },
  { id: 73, title: "Raiders of the Lost Ark", year: 1981, director: "Steven Spielberg",     genre: "Macera / Aksiyon", rating: 8.4, imdb: "tt0082971", desc: "Indiana Jones'in Kayip Sandigi bulma macerasi." },
  { id: 74, title: "A Clockwork Orange",      year: 1971, director: "Stanley Kubrick",      genre: "Dram / Bilim Kurgu", rating: 8.3, imdb: "tt0066921", desc: "Distopik gelecekte siddet dunyasinda yasamak." },
  { id: 75, title: "The Great Dictator",      year: 1940, director: "Charlie Chaplin",      genre: "Komedi / Dram",    rating: 8.4, imdb: "tt0032553", desc: "Chaplin'in Hitler'i hicvettigi unutulmaz satir." },
  { id: 76, title: "Come and See",            year: 1985, director: "Elem Klimov",          genre: "Savas / Dram",     rating: 8.4, imdb: "tt0091251", desc: "2. Dunya Savasi'nda Nazilerin Belarus'taki vahseti." },
  { id: 77, title: "Witness for the Prosecution", year: 1957, director: "Billy Wilder",     genre: "Gerilim / Dram",   rating: 8.4, imdb: "tt0051201", desc: "Bir cinayet davasinda surpriz ifadeler." },
  { id: 78, title: "The Wolf of Wall Street", year: 2013, director: "Martin Scorsese",      genre: "Biyografi / Komedi",rating: 8.2, imdb: "tt0993846", desc: "Wall Street'in en buyuk dolandiricisindan birinin hikayesi." },
  { id: 79, title: "Good Will Hunting",       year: 1997, director: "Gus Van Sant",         genre: "Dram",             rating: 8.3, imdb: "tt0119217", desc: "Dahice zekaya sahip sorunlu gencin terapistiyle iliskisi." },
  { id: 80, title: "Oldboy",                  year: 2003, director: "Park Chan-wook",       genre: "Gerilim / Gizem",  rating: 8.4, imdb: "tt0364569", desc: "15 yil hapsedilen adamın intikam yolculugu." },
  { id: 81, title: "Princess Mononoke",       year: 1997, director: "Hayao Miyazaki",       genre: "Anime / Fantastik",rating: 8.4, imdb: "tt0119698", desc: "Insanlar ile doga ruhlari arasindaki savas." },
  { id: 82, title: "No Country for Old Men",  year: 2007, director: "Coen Brothers",        genre: "Gerilim / Western",rating: 8.2, imdb: "tt0477348", desc: "Teksas'ta para cantasinin pesindeki amansiz katil." },
  { id: 83, title: "Bicycle Thieves",         year: 1948, director: "Vittorio De Sica",     genre: "Dram",             rating: 8.3, imdb: "tt0040522", desc: "Bisikletini calinan isci ile oglu Roma sokaklarinda arayis iceinde." },
  { id: 84, title: "The Grand Budapest Hotel",year: 2014, director: "Wes Anderson",         genre: "Komedi / Macera",  rating: 8.1, imdb: "tt2278388", desc: "Legendar konsiyerjin cinayete karismasinin hikayesi." },
  { id: 85, title: "The Truman Show",         year: 1998, director: "Peter Weir",           genre: "Dram / Bilim Kurgu",rating: 8.2, imdb: "tt0120382", desc: "Hayatinin bir TV seti oldugunu fark eden adamın hikayesi." },
  { id: 86, title: "There Will Be Blood",     year: 2007, director: "Paul Thomas Anderson",  genre: "Dram",             rating: 8.2, imdb: "tt0469494", desc: "Petrol zengininin guc uzerine destansi hikayesi." },
  { id: 87, title: "Pan's Labyrinth",         year: 2006, director: "Guillermo del Toro",   genre: "Fantastik / Dram", rating: 8.2, imdb: "tt0457430", desc: "Ispanya Ic Savasi'nda bir kizin fantastik dunya kacisi." },
  { id: 88, title: "3 Idiots",                year: 2009, director: "Rajkumar Hirani",      genre: "Komedi / Dram",    rating: 8.4, imdb: "tt1187043", desc: "Hint muhendislik okulundaki uc arkadasin komik hikayesi." },
  { id: 89, title: "The Seventh Seal",        year: 1957, director: "Ingmar Bergman",       genre: "Dram / Fantastik", rating: 8.1, imdb: "tt0050976", desc: "Olumle satranc oynayan ovalyenin varlik sorgulamasi." },
  { id: 90, title: "Snatch",                  year: 2000, director: "Guy Ritchie",          genre: "Suc / Komedi",     rating: 8.3, imdb: "tt0208092", desc: "Londra'da komik suc hikayelerinin ic ice gectigi film." },
  { id: 91, title: "My Neighbor Totoro",      year: 1988, director: "Hayao Miyazaki",       genre: "Anime / Aile",     rating: 8.2, imdb: "tt0096283", desc: "Iki kiz kardesin orman ruhu Totoro ile arkadasligi." },
  { id: 92, title: "Singin in the Rain",      year: 1952, director: "Stanley Donen",        genre: "Muzik / Komedi",   rating: 8.3, imdb: "tt0045152", desc: "Sessiz sinemadan sesli sinemaya gecis doneminde muzik komedisi." },
  { id: 93, title: "Children of Heaven",      year: 1997, director: "Majid Majidi",         genre: "Dram",             rating: 8.2, imdb: "tt0118849", desc: "Kiz kardesinin ayakkabisini kaybeden cocugun hikayesi." },
  { id: 94, title: "The Hunt",                year: 2012, director: "Thomas Vinterberg",    genre: "Dram / Gerilim",   rating: 8.3, imdb: "tt2106476", desc: "Yanlis suclamayla hayati mahvolan ogretmenin hikayesi." },
  { id: 95, title: "Ran",                     year: 1985, director: "Akira Kurosawa",       genre: "Tarih / Dram",     rating: 8.2, imdb: "tt0089881", desc: "Japonya'da klanlar arasi iktidar savasi." },
  { id: 96, title: "Monty Python Holy Grail", year: 1975, director: "Terry Gilliam",        genre: "Komedi",           rating: 8.2, imdb: "tt0071853", desc: "Kral Arthur ve sovalyelerinin kutsal kase arayisi." },
  { id: 97, title: "In the Name of the Father", year: 1993, director: "Jim Sheridan",       genre: "Dram / Biyografi", rating: 8.1, imdb: "tt0107207", desc: "Yanlis suclanarak hapsedilen Irlandali ve babasinin hikayesi." },
  { id: 98, title: "The Kid",                 year: 1921, director: "Charlie Chaplin",      genre: "Komedi / Dram",    rating: 8.3, imdb: "tt0012349", desc: "Terk edilmis bebegi buyuten serserinin hikayesi." },
  { id: 99, title: "Treasure of the Sierra Madre", year: 1948, director: "John Huston",     genre: "Macera / Western", rating: 8.2, imdb: "tt0040897", desc: "Meksika'da altin arayan uc adamın hikayesi." },
  { id: 100, title: "Seven Samurai",          year: 1954, director: "Akira Kurosawa",       genre: "Aksiyon / Dram",   rating: 8.6, imdb: "tt0047478", desc: "Yedi samuray bir koyu haydutlardan korumak icin bir araya gelir." },
];

const BIN_ID = import.meta.env.VITE_JSONBIN_ID || "";
const API_KEY = import.meta.env.VITE_JSONBIN_KEY || "";
const BIN_URL = "https://api.jsonbin.io/v3/b/" + BIN_ID;
const ADMIN_PASSWORD = "4276";
const DEMO_MODE = !BIN_ID || !API_KEY;

async function fetchComments() {
  const res = await fetch(BIN_URL + "/latest", { headers: { "X-Master-Key": API_KEY } });
  const data = await res.json();
  return data.record || {};
}
async function putComments(c) {
  await fetch(BIN_URL, { method: "PUT", headers: { "Content-Type": "application/json", "X-Master-Key": API_KEY }, body: JSON.stringify(c) });
}

function FilmReel({ size=120, opacity=0.1, style={} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{opacity,...style}}>
      <circle cx="60" cy="60" r="58" fill="none" stroke="#c9a84c" strokeWidth="2"/>
      <circle cx="60" cy="60" r="48" fill="none" stroke="#c9a84c" strokeWidth="1" strokeDasharray="4 4"/>
      <circle cx="60" cy="60" r="14" fill="none" stroke="#c9a84c" strokeWidth="2"/>
      <circle cx="60" cy="60" r="6" fill="#c9a84c"/>
      {[0,60,120,180,240,300].map(a=>{const rad=a*Math.PI/180;return <line key={a} x1={60+18*Math.cos(rad)} y1={60+18*Math.sin(rad)} x2={60+44*Math.cos(rad)} y2={60+44*Math.sin(rad)} stroke="#c9a84c" strokeWidth="2"/>;
      })}
      {[0,60,120,180,240,300].map(a=>{const rad=(a+30)*Math.PI/180;return <circle key={a} cx={60+34*Math.cos(rad)} cy={60+34*Math.sin(rad)} r="8" fill="none" stroke="#c9a84c" strokeWidth="1.5"/>;
      })}
    </svg>
  );
}
function FilmStrip({vertical=false,style={}}) {
  const w=vertical?36:220,h=vertical?320:36,frames=vertical?8:6;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{opacity:0.08,...style}}>
      <rect width={w} height={h} fill="#c9a84c" rx="2"/>
      {vertical?Array.from({length:frames*2}).map((_,i)=><rect key={i} x="3" y={3+i*(h/(frames*2))} width="8" height="6" rx="1" fill="#1a1208"/>):Array.from({length:frames*2}).map((_,i)=><rect key={i} x={3+i*(w/(frames*2))} y="3" width="6" height="8" rx="1" fill="#1a1208"/>)}
      {vertical?Array.from({length:frames}).map((_,i)=><rect key={i} x="14" y={5+i*(h/frames)} width="18" height={h/frames-8} rx="1" fill="#1a1208"/>):Array.from({length:frames}).map((_,i)=><rect key={i} x={5+i*(w/frames)} y="14" width={w/frames-8} height="18" rx="1" fill="#1a1208"/>)}
      {vertical?Array.from({length:frames*2}).map((_,i)=><rect key={`r${i}`} x={w-11} y={3+i*(h/(frames*2))} width="8" height="6" rx="1" fill="#1a1208"/>):Array.from({length:frames*2}).map((_,i)=><rect key={`r${i}`} x={3+i*(w/(frames*2))} y={h-11} width="6" height="8" rx="1" fill="#1a1208"/>)}
    </svg>
  );
}
function Ticket({style={}}) {
  return (
    <svg width="190" height="84" viewBox="0 0 190 84" style={{opacity:0.09,...style}}>
      <path d="M10,0 L180,0 Q190,0 190,10 L190,32 Q180,32 180,38 Q180,44 190,44 L190,74 Q190,84 180,84 L10,84 Q0,84 0,74 L0,44 Q10,44 10,38 Q10,32 0,32 L0,10 Q0,0 10,0 Z" fill="none" stroke="#c9a84c" strokeWidth="1.5"/>
      <line x1="52" y1="8" x2="52" y2="76" stroke="#c9a84c" strokeWidth="1" strokeDasharray="4 3"/>
      <text x="118" y="30" textAnchor="middle" fill="#c9a84c" fontSize="9" fontFamily="serif" letterSpacing="3">SINEMA</text>
      <text x="118" y="50" textAnchor="middle" fill="#c9a84c" fontSize="16" fontFamily="serif" fontWeight="bold">KULUBU</text>
      <text x="118" y="66" textAnchor="middle" fill="#c9a84c" fontSize="8" fontFamily="serif" letterSpacing="2">ADMISSION ONE</text>
      <text x="26" y="46" textAnchor="middle" fill="#c9a84c" fontSize="8" fontFamily="serif" transform="rotate(-90,26,46)">NO. 1924</text>
      {Array.from({length:9}).map((_,i)=><line key={i} x1={60+i*14} y1="72" x2={68+i*14} y2="72" stroke="#c9a84c" strokeWidth="3"/>)}
    </svg>
  );
}
function Stars({value,onChange,readonly}) {
  const [hov,setHov]=useState(0);
  return (
    <div style={{display:"flex",gap:4}}>
      {[1,2,3,4,5].map(s=>(
        <span key={s} onClick={()=>!readonly&&onChange&&onChange(s)} onMouseEnter={()=>!readonly&&setHov(s)} onMouseLeave={()=>!readonly&&setHov(0)}
          style={{fontSize:readonly?14:20,cursor:readonly?"default":"pointer",color:s<=(hov||value)?"#c9a84c":"rgba(201,168,76,0.2)",transition:"color .1s"}}>★</span>
      ))}
    </div>
  );
}
function timeAgo(ts){const m=Math.floor((Date.now()-ts)/60000);if(m<1)return"Az once";if(m<60)return m+" dk once";const h=Math.floor(m/60);if(h<24)return h+" saat once";return Math.floor(h/24)+" gun once";}

const css=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Special+Elite&family=IM+Fell+English:ital@0;1&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{--cream:#f0e8d0;--dark:#110e06;--gold:#c9a84c}
.app{min-height:100vh;background:var(--dark);font-family:'IM Fell English',serif;color:var(--cream);position:relative;overflow-x:hidden}
.grain{position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");pointer-events:none;z-index:9999;opacity:0.45}
.deco{position:fixed;pointer-events:none;z-index:0}
.header{border-bottom:1px solid rgba(201,168,76,.25);padding:0 48px;display:flex;align-items:center;height:72px;position:sticky;top:0;background:rgba(17,14,6,.98);z-index:100;gap:16px}
.logo-sub{font-family:'Special Elite',cursive;font-size:10px;letter-spacing:6px;color:var(--gold);opacity:.7}
.logo-main{font-family:'Playfair Display',serif;font-size:22px;font-weight:900;font-style:italic;color:var(--cream);line-height:1;cursor:pointer}
.logo-main em{color:var(--gold)}
.hdiv{width:1px;height:36px;background:linear-gradient(to bottom,transparent,var(--gold),transparent);margin:0 8px}
.htag{font-family:'Special Elite',cursive;font-size:10px;color:rgba(240,232,208,.3);letter-spacing:3px}
.hbtns{display:flex;gap:8px;margin-left:auto}
.wrap{max-width:1100px;margin:0 auto;padding:0 80px;position:relative;z-index:1}
.hero{text-align:center;padding:56px 0 40px}
.hpre{font-family:'Special Elite',cursive;font-size:10px;letter-spacing:8px;color:var(--gold);margin-bottom:14px}
.htitle{font-family:'Playfair Display',serif;font-size:clamp(44px,7vw,80px);font-weight:900;font-style:italic;color:var(--cream);line-height:.9;margin-bottom:12px;text-shadow:2px 4px 32px rgba(0,0,0,.9)}
.htitle em{color:var(--gold)}
.hsub{font-family:'Special Elite',cursive;font-size:10px;letter-spacing:6px;color:rgba(240,232,208,.38);margin-bottom:24px}
.hrule{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:28px}
.hrule::before{content:'';height:1px;width:80px;background:linear-gradient(to right,transparent,var(--gold))}
.hrule::after{content:'';height:1px;width:80px;background:linear-gradient(to left,transparent,var(--gold))}
.hrule span{font-family:'Special Elite',cursive;font-size:12px;color:var(--gold)}
.tabs{display:inline-flex;border:1px solid rgba(201,168,76,.3);margin-bottom:24px}
.tab{font-family:'Special Elite',cursive;font-size:11px;letter-spacing:3px;padding:10px 28px;background:none;border:none;border-right:1px solid rgba(201,168,76,.3);color:rgba(240,232,208,.42);cursor:pointer;transition:all .2s;text-transform:uppercase}
.tab:last-child{border-right:none}
.tab.on{background:var(--gold);color:#110e06;font-weight:bold}
.srch{background:rgba(240,232,208,.04);border:1px solid rgba(201,168,76,.22);padding:12px 20px;color:var(--cream);font-family:'Special Elite',cursive;font-size:12px;letter-spacing:2px;width:100%;max-width:360px;outline:none;transition:border-color .2s;margin-bottom:36px}
.srch:focus{border-color:var(--gold)}
.srch::placeholder{color:rgba(240,232,208,.22);font-style:italic}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:18px;margin-bottom:48px}
.card{cursor:pointer;border:1px solid rgba(201,168,76,.16);transition:all .3s;background:#0d0b05}
.card:hover{border-color:var(--gold);transform:translateY(-8px);box-shadow:0 20px 60px rgba(0,0,0,.8)}
.cimg{position:relative;overflow:hidden;background:#1a1208;aspect-ratio:2/3;display:flex;align-items:center;justify-content:center}
.cimg::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 55%,rgba(13,11,5,.95) 100%);pointer-events:none}
.card img{width:100%;height:100%;object-fit:cover;display:block;filter:sepia(18%) contrast(1.05);transition:filter .3s;position:absolute;top:0;left:0}
.card:hover img{filter:sepia(0%) contrast(1.08)}
.cbadge{position:absolute;top:8px;left:8px;font-family:'Special Elite',cursive;font-size:11px;color:var(--gold);background:rgba(13,11,5,.92);padding:3px 8px;border:1px solid rgba(201,168,76,.38);z-index:2;letter-spacing:1px}
.cbody{padding:11px 11px 13px;border-top:1px solid rgba(201,168,76,.1)}
.ctitle{font-family:'Playfair Display',serif;font-size:12px;font-weight:700;color:var(--cream);margin-bottom:3px;line-height:1.3}
.cyear{font-family:'Special Elite',cursive;font-size:10px;color:rgba(201,168,76,.5);letter-spacing:2px;margin-bottom:4px}
.cfoot{display:flex;align-items:center;justify-content:space-between}
.ccnt{font-family:'Special Elite',cursive;font-size:9px;color:rgba(240,232,208,.25);text-transform:uppercase}
.cur{font-family:'Special Elite',cursive;font-size:10px;color:var(--gold)}
.loading-poster{font-family:'Special Elite',cursive;font-size:9px;color:rgba(201,168,76,.3);letter-spacing:2px;text-align:center;padding:8px;z-index:1}
.footer{text-align:center;padding:28px;font-family:'Special Elite',cursive;font-size:10px;letter-spacing:4px;color:rgba(240,232,208,.16);text-transform:uppercase;border-top:1px solid rgba(201,168,76,.07)}
.detail{max-width:880px;margin:0 auto;padding:48px 80px;position:relative;z-index:1}
.dhero{display:flex;gap:44px;margin-bottom:44px;align-items:flex-start}
.dposter{width:185px;min-height:270px;flex-shrink:0;border:1px solid rgba(201,168,76,.28);box-shadow:-6px 6px 0 rgba(201,168,76,.07),8px 16px 48px rgba(0,0,0,.8);filter:sepia(14%);object-fit:cover}
.dg{font-family:'Special Elite',cursive;font-size:10px;letter-spacing:5px;color:var(--gold);text-transform:uppercase;margin-bottom:10px}
.dt{font-family:'Playfair Display',serif;font-size:clamp(26px,4vw,44px);font-weight:900;font-style:italic;color:var(--cream);line-height:1.1;margin-bottom:7px}
.dd{font-family:'IM Fell English',serif;font-size:14px;color:rgba(240,232,208,.42);font-style:italic;margin-bottom:16px}
.ddesc{font-family:'IM Fell English',serif;font-size:15px;color:rgba(240,232,208,.62);line-height:1.8;max-width:440px;margin-bottom:20px}
.drate{display:flex;align-items:center;gap:18px}
.badge{font-family:'Special Elite',cursive;font-size:22px;color:var(--gold);border:2px solid var(--gold);padding:4px 14px;letter-spacing:1px}
.fbox{background:rgba(240,232,208,.025);border:1px solid rgba(201,168,76,.16);padding:30px;margin-bottom:34px;position:relative}
.fbox::before{content:'';position:absolute;top:-1px;left:30px;width:56px;height:3px;background:var(--gold)}
.flbl{font-family:'Special Elite',cursive;font-size:10px;letter-spacing:5px;color:var(--gold);text-transform:uppercase;margin-bottom:16px;display:block}
.frow{display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap;align-items:center}
.finp{flex:1;min-width:140px;background:rgba(240,232,208,.04);border:1px solid rgba(201,168,76,.2);padding:10px 14px;color:var(--cream);font-family:'IM Fell English',serif;font-size:14px;outline:none;transition:border-color .2s}
.finp:focus{border-color:var(--gold)}
.finp::placeholder{color:rgba(240,232,208,.2);font-style:italic}
.fta{width:100%;background:rgba(240,232,208,.04);border:1px solid rgba(201,168,76,.2);padding:11px 14px;color:var(--cream);font-family:'IM Fell English',serif;font-size:14px;outline:none;resize:vertical;margin-bottom:13px;line-height:1.7;transition:border-color .2s}
.fta:focus{border-color:var(--gold)}
.fta::placeholder{color:rgba(240,232,208,.2);font-style:italic}
.sbtn{background:var(--gold);color:#110e06;border:none;padding:11px 30px;font-family:'Special Elite',cursive;font-size:11px;letter-spacing:4px;text-transform:uppercase;cursor:pointer;transition:all .2s}
.sbtn:hover{background:var(--cream)}
.stitle{font-family:'Playfair Display',serif;font-size:13px;font-style:italic;color:var(--gold);letter-spacing:4px;text-transform:uppercase;margin-bottom:20px;display:flex;align-items:center;gap:12px}
.stitle::after{content:'';flex:1;height:1px;background:linear-gradient(to right,rgba(201,168,76,.32),transparent)}
.ccard{border:1px solid rgba(201,168,76,.12);padding:20px;margin-bottom:12px;position:relative;background:rgba(240,232,208,.015);transition:border-color .2s}
.ccard:hover{border-color:rgba(201,168,76,.3)}
.ccard::before{content:'"';position:absolute;top:8px;left:16px;font-family:'Playfair Display',serif;font-size:52px;color:rgba(201,168,76,.1);line-height:1}
.chdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.cav{width:38px;height:38px;border:1px solid rgba(201,168,76,.35);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--gold);background:rgba(201,168,76,.06)}
.cname{font-family:'Playfair Display',serif;font-weight:700;font-size:14px;color:var(--cream)}
.ctime{font-family:'Special Elite',cursive;font-size:10px;color:rgba(240,232,208,.2);letter-spacing:2px}
.ctext{font-family:'Playfair Display',serif;font-size:16px;color:rgba(240,232,208,.78);line-height:2;padding-left:6px}
.bbtn{font-family:'Special Elite',cursive;font-size:10px;letter-spacing:3px;text-transform:uppercase;background:none;border:1px solid rgba(201,168,76,.25);color:rgba(240,232,208,.42);padding:8px 16px;cursor:pointer;transition:all .2s}
.bbtn:hover{border-color:var(--gold);color:var(--gold)}
.abtn{font-family:'Special Elite',cursive;font-size:9px;letter-spacing:2px;background:none;border:1px solid rgba(201,168,76,.18);color:rgba(240,232,208,.28);padding:6px 13px;cursor:pointer;transition:all .2s}
.abtn:hover{border-color:rgba(201,168,76,.45);color:rgba(240,232,208,.55)}
.abtn.out{border-color:#8b1a1a;color:#8b1a1a}
.dbtn{background:rgba(139,26,26,.12);border:1px solid #8b1a1a;color:#8b1a1a;font-family:'Special Elite',cursive;font-size:9px;padding:3px 9px;cursor:pointer}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;z-index:999}
.mbox{background:#13100a;border:1px solid rgba(201,168,76,.28);padding:34px;min-width:290px;position:relative}
.mbox::before{content:'';position:absolute;top:-1px;left:0;right:0;height:2px;background:linear-gradient(to right,transparent,var(--gold),transparent)}
.mbox h3{font-family:'Playfair Display',serif;font-style:italic;color:var(--cream);font-size:18px;margin-bottom:16px}
.mrow{display:flex;gap:8px;margin-top:10px}
.mok{flex:1;font-family:'Special Elite',cursive;font-size:10px;letter-spacing:2px;padding:10px;cursor:pointer;background:var(--gold);color:#110e06;border:none}
.mok:hover{background:var(--cream)}
.mcancel{flex:1;font-family:'Special Elite',cursive;font-size:10px;padding:10px;cursor:pointer;background:none;border:1px solid rgba(201,168,76,.28);color:rgba(240,232,208,.45)}
.merr{color:#c9503a;font-family:'Special Elite',cursive;font-size:11px;margin-top:6px}
.ftag{font-family:'Special Elite',cursive;font-size:10px;letter-spacing:4px;color:var(--gold);text-transform:uppercase;margin-bottom:8px;cursor:pointer}
.ftag:hover{text-decoration:underline}
.demo-bar{background:#1a1000;border-bottom:1px solid rgba(201,168,76,.2);padding:8px 24px;font-family:'Special Elite',cursive;font-size:10px;color:rgba(201,168,76,.55);text-align:center;letter-spacing:3px}
`;

// Poster cache - sayfa yenilenene kadar tekrar fetch etme
const posterCache = {};

function usePoster(imdbId) {
  const [url, setUrl] = useState(posterCache[imdbId] || null);
  useEffect(() => {
    if (!imdbId || posterCache[imdbId]) return;
    fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_KEY}`)
      .then(r => r.json())
      .then(d => {
        const u = d.Poster && d.Poster !== "N/A" ? d.Poster : null;
        posterCache[imdbId] = u || "N/A";
        setUrl(u);
      })
      .catch(() => { posterCache[imdbId] = "N/A"; });
  }, [imdbId]);
  return url;
}

function FilmCard({ f, comments, onClick }) {
  const poster = usePoster(f.imdb);
  const fc = comments[f.id] || [];
  const avg = fc.length ? (fc.reduce((a,c)=>a+c.stars,0)/fc.length).toFixed(1) : null;
  return (
    <div className="card" onClick={onClick}>
      <div className="cimg">
        {poster
          ? <img src={poster} alt={f.title} />
          : <div className="loading-poster">{poster === null ? "..." : f.title}</div>
        }
        <div className="cbadge">★ {f.rating}</div>
      </div>
      <div className="cbody">
        <div className="ctitle">{f.title}</div>
        <div className="cyear">{f.year}</div>
        <div className="cfoot">
          <span className="ccnt">{fc.length} yorum</span>
          {avg && <span className="cur">★ {avg}</span>}
        </div>
      </div>
    </div>
  );
}

function FilmDetail({ film, comments, isAdmin, onDel, onBack }) {
  const poster = usePoster(film.imdb);
  const fc = comments[film.id] || [];
  const avg = fc.length ? (fc.reduce((a,c)=>a+c.stars,0)/fc.length).toFixed(1) : null;
  const [name,setName]=useState("");
  const [text,setText]=useState("");
  const [stars,setStars]=useState(0);

  async function submit() {
    if(!name.trim()||!text.trim()||!stars) return;
    const nc={id:Date.now(),name:name.trim(),text:text.trim(),stars,ts:Date.now()};
    setName("");setText("");setStars(0);
    onDel("ADD", film.id, nc);
  }

  return (
    <div className="detail">
      <div className="dhero">
        {poster
          ? <img src={poster} alt={film.title} className="dposter" />
          : <div className="dposter" style={{display:"flex",alignItems:"center",justifyContent:"center",background:"#1a1208",fontFamily:"'Special Elite',cursive",fontSize:12,color:"rgba(201,168,76,.3)"}}>{film.title}</div>
        }
        <div style={{flex:1}}>
          <div className="dg">{film.genre}</div>
          <h1 className="dt">{film.title}</h1>
          <div className="dd">Yonetmen: {film.director} · {film.year}</div>
          <p className="ddesc">{film.desc}</p>
          <div className="drate">
            <div className="badge">★ {film.rating}</div>
            {avg && <div style={{fontFamily:"'Special Elite',cursive",fontSize:12,color:"rgba(201,168,76,.6)",letterSpacing:2}}>Okuyucu: ★ {avg} ({fc.length} yorum)</div>}
          </div>
        </div>
      </div>

      <div className="fbox">
        <span className="flbl">Kaleminizi Konusuturun</span>
        <div className="frow">
          <input className="finp" value={name} onChange={e=>setName(e.target.value)} placeholder="Isminiz..."/>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontFamily:"'Special Elite',cursive",fontSize:10,letterSpacing:3,color:"rgba(201,168,76,.5)"}}>PUAN</span>
            <Stars value={stars} onChange={setStars}/>
          </div>
        </div>
        <textarea className="fta" rows={4} value={text} onChange={e=>setText(e.target.value)} placeholder="Film hakkindaki dusuncelerinizi yazin..."/>
        <button className="sbtn" onClick={submit}>Yorumu Yayinla</button>
      </div>

      <div className="stitle">Okuyucu Yorumlari {fc.length>0&&`(${fc.length})`}</div>
      {fc.length===0
        ? <div style={{textAlign:"center",padding:"48px 0",fontFamily:"'IM Fell English',serif",fontStyle:"italic",color:"rgba(240,232,208,.22)"}}>Bu film icin henuz kalem kipirdamamis...</div>
        : fc.map(c=>(
          <div key={c.id} className="ccard">
            <div className="chdr">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div className="cav">{c.name[0]}</div>
                <div><div className="cname">{c.name}</div><Stars value={c.stars} readonly/></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div className="ctime">{timeAgo(c.ts)}</div>
                {isAdmin&&<button className="dbtn" onClick={()=>onDel("DEL",film.id,c.id)}>Sil</button>}
              </div>
            </div>
            <p className="ctext">{c.text}</p>
          </div>
        ))
      }
    </div>
  );
}

export default function App() {
  const [film,setFilm]=useState(null);
  const [tab,setTab]=useState("Filmler");
  const [search,setSearch]=useState("");
  const [isAdmin,setIsAdmin]=useState(false);
  const [showPass,setShowPass]=useState(false);
  const [passVal,setPassVal]=useState("");
  const [passErr,setPassErr]=useState("");
  const [comments,setComments]=useState({});
  const pollRef=useRef(null);

  function loadLocal(){try{return JSON.parse(localStorage.getItem("film_comments")||"{}");}catch{return{};}}
  function saveLocal(c){localStorage.setItem("film_comments",JSON.stringify(c));}

  async function load(){
    if(DEMO_MODE){setComments(loadLocal());return;}
    try{const data=await fetchComments();setComments(data);}catch(e){console.error(e);}
  }

  useEffect(()=>{load();pollRef.current=setInterval(load,10000);return()=>clearInterval(pollRef.current);},[]);

  async function handleComment(action, fid, payload) {
    let updated;
    if(action==="ADD"){
      updated={...comments,[fid]:[payload,...(comments[fid]||[])]};
    } else {
      updated={...comments,[fid]:(comments[fid]||[]).filter(c=>c.id!==payload)};
    }
    setComments(updated);
    if(DEMO_MODE){saveLocal(updated);}else{await putComments(updated);}
  }

  function login(){
    if(passVal===ADMIN_PASSWORD){setIsAdmin(true);setShowPass(false);setPassVal("");setPassErr("");}
    else setPassErr("Yanlis sifre!");
  }

  const filtered=FILMS.filter(f=>f.title.toLowerCase().includes(search.toLowerCase())||f.director.toLowerCase().includes(search.toLowerCase()));
  const allC=FILMS.flatMap(f=>(comments[f.id]||[]).map(c=>({...c,filmTitle:f.title,filmId:f.id}))).sort((a,b)=>b.ts-a.ts);

  return(
    <>
      <style>{css}</style>
      <div className="app">
        <div className="grain"/>
        <div className="deco" style={{top:-20,left:-20}}><FilmReel size={220} opacity={0.09}/></div>
        <div className="deco" style={{bottom:-20,right:-20}}><FilmReel size={260} opacity={0.08}/></div>
        <div className="deco" style={{top:100,right:10}}><FilmReel size={130} opacity={0.07}/></div>
        <div className="deco" style={{top:"38%",left:0}}><FilmStrip vertical/></div>
        <div className="deco" style={{top:"38%",right:0}}><FilmStrip vertical/></div>
        <div className="deco" style={{bottom:60,left:50}}><Ticket/></div>
        <div className="deco" style={{top:120,right:60,transform:"rotate(12deg)"}}><Ticket/></div>
        <div className="deco" style={{top:72,left:"50%",transform:"translateX(-50%)"}}><FilmStrip/></div>
        <div className="deco" style={{bottom:0,left:"28%"}}><FilmStrip/></div>

        <header className="header">
          <div style={{cursor:"pointer"}} onClick={()=>{setFilm(null);setTab("Filmler");}}>
            <div className="logo-sub">Est. 1924</div>
            <div className="logo-main">Sinema <em>Kulubu</em></div>
          </div>
          <div className="hdiv"/>
          <div className="htag">Film · Sanat · Elestiri</div>
          <div className="hbtns">
            {film&&<button className="bbtn" onClick={()=>setFilm(null)}>← Geri Don</button>}
            {!isAdmin?<button className="abtn" onClick={()=>setShowPass(true)}>Admin</button>:<button className="abtn out" onClick={()=>setIsAdmin(false)}>Cikis</button>}
          </div>
        </header>

        {DEMO_MODE&&<div className="demo-bar">DEMO MOD — yorumlar sadece bu tarayicide saklanir</div>}

        {showPass&&(
          <div className="modal">
            <div className="mbox">
              <h3>Admin Girisi</h3>
              <input type="password" className="finp" style={{width:"100%"}} value={passVal} onChange={e=>setPassVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Sifre..."/>
              {passErr&&<div className="merr">{passErr}</div>}
              <div className="mrow">
                <button className="mok" onClick={login}>Giris</button>
                <button className="mcancel" onClick={()=>{setShowPass(false);setPassVal("");setPassErr("");}}>Iptal</button>
              </div>
            </div>
          </div>
        )}

        {!film?(
          <div className="wrap">
            <div className="hero">
              <div className="hpre">— Yuz Yillik Sinema Mirasi —</div>
              <h1 className="htitle">Film <em>Arsivi</em></h1>
              <p className="hsub">Her kare bir hikaye · Her yorum bir iz</p>
              <div className="hrule"><span>✦</span></div>
              <div style={{marginBottom:20}}>
                <div className="tabs">
                  {["Filmler","Tum Yorumlar"].map(t=>(
                    <button key={t} className={`tab${tab===t?" on":""}`} onClick={()=>{setTab(t);setSearch("");}}>{t}</button>
                  ))}
                </div>
              </div>
              {tab==="Filmler"&&<input className="srch" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Film veya yonetmen ara..."/>}
            </div>

            {tab==="Filmler"&&(
              <div className="grid">
                {filtered.map(f=>(
                  <FilmCard key={f.id} f={f} comments={comments} onClick={()=>setFilm(f)}/>
                ))}
              </div>
            )}

            {tab==="Tum Yorumlar"&&(
              <div style={{maxWidth:660,margin:"0 auto",paddingBottom:60}}>
                <div className="stitle">Tum Yorumlar {allC.length>0&&`(${allC.length})`}</div>
                {allC.length===0
                  ?<div style={{textAlign:"center",padding:"48px 0",fontFamily:"'IM Fell English',serif",fontStyle:"italic",color:"rgba(240,232,208,.22)"}}>Henuz kalem kipirdamamis...</div>
                  :allC.map(c=>(
                    <div key={c.id} className="ccard">
                      <div className="ftag" onClick={()=>setFilm(FILMS.find(f=>f.id===c.filmId))}>{c.filmTitle}</div>
                      <div className="chdr">
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div className="cav">{c.name[0]}</div>
                          <div><div className="cname">{c.name}</div><Stars value={c.stars} readonly/></div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div className="ctime">{timeAgo(c.ts)}</div>
                          {isAdmin&&<button className="dbtn" onClick={()=>handleComment("DEL",c.filmId,c.id)}>Sil</button>}
                        </div>
                      </div>
                      <p className="ctext">{c.text}</p>
                    </div>
                  ))
                }
              </div>
            )}
            <div className="footer">Made by Bilgehan Yakici ✦ Sinema Kulubu ✦ Est. 1924</div>
          </div>
        ):(
          <FilmDetail film={film} comments={comments} isAdmin={isAdmin} onDel={handleComment} onBack={()=>setFilm(null)}/>
        )}
      </div>
    </>
  );
}
