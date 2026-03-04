import { useState, useEffect, useRef } from "react";

const FILMS = [
  { id: 1, title: "The Shawshank Redemption", year: 1994, director: "Frank Darabont", genre: "Dram", rating: 9.3, cover: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", desc: "Haksiz yere hapsedilen bir bankacinin hayatta kalma hikayesi." },
  { id: 2, title: "The Godfather", year: 1972, director: "Francis Ford Coppola", genre: "Suc / Dram", rating: 9.2, cover: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLegHejKInNI.jpg", desc: "Amerikann en guclu mafya ailesi Corleone'nin iktidar mucadelesi." },
  { id: 3, title: "The Dark Knight", year: 2008, director: "Christopher Nolan", genre: "Aksiyon", rating: 9.0, cover: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", desc: "Batman, Gotham'i kaosa suruklemek isteyen Joker ile yuzlesiyor." },
  { id: 4, title: "The Godfather Part II", year: 1974, director: "Francis Ford Coppola", genre: "Suc / Dram", rating: 9.0, cover: "https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg", desc: "Corleone ailesinin yukselisi ve Michael'in iktidari." },
  { id: 5, title: "12 Angry Men", year: 1957, director: "Sidney Lumet", genre: "Dram", rating: 9.0, cover: "https://image.tmdb.org/t/p/w500/ppd0IC2n6HCcGnkiHkQCwBJzSMj.jpg", desc: "12 juri uyesinin bir cinayet davasini tartistigi gerilim dolu film." },
  { id: 6, title: "Schindler's List", year: 1993, director: "Steven Spielberg", genre: "Tarih / Dram", rating: 9.0, cover: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", desc: "2. Dunya Savasi sirasinda Yahudileri kurtaran Alman is insaninin hikayesi." },
  { id: 7, title: "The Lord of the Rings: The Return of the King", year: 2003, director: "Peter Jackson", genre: "Fantastik", rating: 9.0, cover: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", desc: "Yuzuklerin Efendisi uclemesinin epik sonucu." },
  { id: 8, title: "Pulp Fiction", year: 1994, director: "Quentin Tarantino", genre: "Suc / Dram", rating: 8.9, cover: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", desc: "Los Angeles'ta birbirine bagli suclu hikayeler." },
  { id: 9, title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, director: "Peter Jackson", genre: "Fantastik", rating: 8.8, cover: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", desc: "Bir hobbit ve arkadaslarinin yuzugu yok etme yolculugu." },
  { id: 10, title: "The Good, the Bad and the Ugly", year: 1966, director: "Sergio Leone", genre: "Western", rating: 8.8, cover: "https://image.tmdb.org/t/p/w500/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg", desc: "Uc silahsorun Ic Savas sirasinda gizli bir hazineyi arar." },
  { id: 11, title: "Inception", year: 2010, director: "Christopher Nolan", genre: "Bilim Kurgu", rating: 8.8, cover: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", desc: "Ruyalarin icine girerek fikir calan bir hirsizin hikayesi." },
  { id: 12, title: "Forrest Gump", year: 1994, director: "Robert Zemeckis", genre: "Dram / Komedi", rating: 8.8, cover: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", desc: "Dususel engelli bir adamın olaganustu hayat hikayesi." },
  { id: 13, title: "The Lord of the Rings: The Two Towers", year: 2002, director: "Peter Jackson", genre: "Fantastik", rating: 8.8, cover: "https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYspq.jpg", desc: "Yuzuk Kardesliginin bolunmesinin ardindan savas baslar." },
  { id: 14, title: "Fight Club", year: 1999, director: "David Fincher", genre: "Dram / Gerilim", rating: 8.8, cover: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", desc: "Mutsuz bir is insani gizli bir duello kulubu kurar." },
  { id: 15, title: "Goodfellas", year: 1990, director: "Martin Scorsese", genre: "Suc / Dram", rating: 8.7, cover: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg", desc: "New York mafyasinda yukselip duser bir adamın hikayesi." },
  { id: 16, title: "The Matrix", year: 1999, director: "Lana Wachowski", genre: "Bilim Kurgu / Aksiyon", rating: 8.7, cover: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", desc: "Bir bilgisayar korsanı gercekligin aslinda bir simulasyon oldugunu ogrenur." },
  { id: 17, title: "One Flew Over the Cuckoo's Nest", year: 1975, director: "Milos Forman", genre: "Dram", rating: 8.7, cover: "https://image.tmdb.org/t/p/w500/3jcbDmRFiQ83drXNOvRDeKHxS0C.jpg", desc: "Bir akil hastanesinde hastalar ile katı bir hemsire arasindaki mucadele." },
  { id: 18, title: "Star Wars: Episode V", year: 1980, director: "Irvin Kershner", genre: "Bilim Kurgu", rating: 8.7, cover: "https://image.tmdb.org/t/p/w500/2l05cFWJacyIsTpsqSgH0wQXe4V.jpg", desc: "Luke Skywalker Darth Vader ile yuzlesir ve gercegi ogrenur." },
  { id: 19, title: "Interstellar", year: 2014, director: "Christopher Nolan", genre: "Bilim Kurgu / Dram", rating: 8.6, cover: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", desc: "Insanligin gelecegini kurtarmak icin yildizlararasi seyahate cikan astronotlar." },
  { id: 20, title: "Parasite", year: 2019, director: "Bong Joon-ho", genre: "Dram / Gerilim", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", desc: "Yoksul bir ailenin zengin bir aileye sizmasinin ardindan yasananlar." },
  { id: 21, title: "Schindler's List", year: 1993, director: "Steven Spielberg", genre: "Tarih / Dram", rating: 9.0, cover: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", desc: "2. Dunya Savasi sirasinda Yahudileri kurtaran Alman is insaninin hikayesi." },
  { id: 22, title: "The Silence of the Lambs", year: 1991, director: "Jonathan Demme", genre: "Gerilim / Korku", rating: 8.6, cover: "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg", desc: "Bir FBI adayi seri katili yakalamak icin baska bir katille isbirligi yapar." },
  { id: 23, title: "City of God", year: 2002, director: "Fernando Meirelles", genre: "Suc / Dram", rating: 8.6, cover: "https://image.tmdb.org/t/p/w500/k7eYdWvhYQyRQoU2TB2A2Xu2grZ.jpg", desc: "Rio de Janeiro'nun en tehlikeli mahallesinde buyuyen iki gencin hikayesi." },
  { id: 24, title: "Saving Private Ryan", year: 1998, director: "Steven Spielberg", genre: "Savas / Dram", rating: 8.6, cover: "https://image.tmdb.org/t/p/w500/1wY4psJ5NVEhCuOYROwLH2XExM2.jpg", desc: "D-Day'den sonra kayip bir askeri bulmak icin gonderilen ekibin hikayesi." },
  { id: 25, title: "Spirited Away", year: 2001, director: "Hayao Miyazaki", genre: "Anime / Fantastik", rating: 8.6, cover: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", desc: "Ruhlar dunyasina kapilan kucuk bir kizin ailesini kurtarma macerasi." },
  { id: 26, title: "Life is Beautiful", year: 1997, director: "Roberto Benigni", genre: "Dram / Komedi", rating: 8.6, cover: "https://image.tmdb.org/t/p/w500/74hLDKjD5aGYOotO6esUVaeISa2.jpg", desc: "Bir baba ogulunu Nazi kampinin korkusundan korumak icin oyun oynar." },
  { id: 27, title: "The Green Mile", year: 1999, director: "Frank Darabont", genre: "Dram / Fantastik", rating: 8.6, cover: "https://image.tmdb.org/t/p/w500/velWPhVR4nefADMcAMHlylfQJDw.jpg", desc: "Olum koridorunda calisirken olusturdugu baglar icin bir gardiyanin hikayesi." },
  { id: 28, title: "Terminator 2: Judgment Day", year: 1991, director: "James Cameron", genre: "Aksiyon / Bilim Kurgu", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi3JOGMPWsDMQ.jpg", desc: "Gelecekten gelen bir robot insanligi kurtarmak icin gorevlendirililr." },
  { id: 29, title: "Back to the Future", year: 1985, director: "Robert Zemeckis", genre: "Bilim Kurgu / Komedi", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg", desc: "Bir genC bir zaman makinesinde 30 yil geriye gider." },
  { id: 30, title: "Whiplash", year: 2014, director: "Damien Chazelle", genre: "Dram / Muzik", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg", desc: "Genc bir davulcunun zorlu bir ogretmenle iliskisi." },
  { id: 31, title: "The Pianist", year: 2002, director: "Roman Polanski", genre: "Savas / Dram", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/2hFvxCCWrTmCYwfy7yum0GKSmkX.jpg", desc: "Polonyal bir Yahudi piyanistin 2. Dunya Savasi'nda hayatta kalma hikayesi." },
  { id: 32, title: "Gladiator", year: 2000, director: "Ridley Scott", genre: "Aksiyon / Dram", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/ehGpAooqXAqwqLPSh1qSRHdNdOb.jpg", desc: "Imparatoru tarafindan ihanete ugrayan bir general gladyator olarak intikam arar." },
  { id: 33, title: "The Lion King", year: 1994, director: "Roger Allers", genre: "Animasyon", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/sKCr78MXSuS2FrgKK4bPkyfPoBc.jpg", desc: "Babasinin olumunden kendini sorumlu tutan bir aslan yavrusunun hikayesi." },
  { id: 34, title: "American History X", year: 1998, director: "Tony Kaye", genre: "Dram", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/3RNFoSAqsTmYHfJUMzKRhFmHMB4.jpg", desc: "Eski bir neo-Nazi kardesini ayni yola girmekten alikoymaya calisir." },
  { id: 35, title: "The Usual Suspects", year: 1995, director: "Bryan Singer", genre: "Gerilim / Suc", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/bUNFCu9MrthOAOhRQHtXBTiPIWa.jpg", desc: "Bir sorgu sirasinda ortaya cikan gizemli suc orgutunun hikayesi." },
  { id: 36, title: "Psycho", year: 1960, director: "Alfred Hitchcock", genre: "Gerilim / Korku", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg", desc: "Issiz bir motele siginan bir kadinin basina gelenler." },
  { id: 37, title: "The Departed", year: 2006, director: "Martin Scorsese", genre: "Suc / Gerilim", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg", desc: "Polis ve mafya icindeki ajan casusluk savasinin gerilimi." },
  { id: 38, title: "Memento", year: 2000, director: "Christopher Nolan", genre: "Gerilim", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg", desc: "Kisa sureli bellek kaybeden bir adamın karisinin katilini bulmaya calismasi." },
  { id: 39, title: "The Prestige", year: 2006, director: "Christopher Nolan", genre: "Dram / Gizem", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/bdN3gXuIZYaJP6ptza9KxN1XIIW.jpg", desc: "Iki rakip sihirbazin birbirini yok etme savasi." },
  { id: 40, title: "Alien", year: 1979, director: "Ridley Scott", genre: "Bilim Kurgu / Korku", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg", desc: "Uzay gemisindeki musadeye karsı hayatta kalma mucadelesi." },
  { id: 41, title: "Apocalypse Now", year: 1979, director: "Francis Ford Coppola", genre: "Savas / Dram", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg", desc: "Vietnam Savasi sirasinda bir subayın tehlikeli gorevinin hikayesi." },
  { id: 42, title: "Braveheart", year: 1995, director: "Mel Gibson", genre: "Tarih / Aksiyon", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/or1gBugydmjToAEq7OZY0owwFk.jpg", desc: "Iskocyali William Wallace'in Ingiltere'ye karsi bagimsizlik savasi." },
  { id: 43, title: "The Shining", year: 1980, director: "Stanley Kubrick", genre: "Korku / Gerilim", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg", desc: "Issiz bir otelde calisirken yavash yavash deliren bir adamın hikayesi." },
  { id: 44, title: "Avengers: Endgame", year: 2019, director: "Anthony Russo", genre: "Aksiyon / Bilim Kurgu", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", desc: "Marvel kahramanlari evreni kurtarmak icin son savaslarini verir." },
  { id: 45, title: "Toy Story", year: 1995, director: "John Lasseter", genre: "Animasyon / Komedi", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg", desc: "Oyuncaklarin gizli dunyasinda gecen dostluk hikayesi." },
  { id: 46, title: "Joker", year: 2019, director: "Todd Phillips", genre: "Dram / Gerilim", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", desc: "Batman'in en buyuk dusmaninin nasil ortaya ciktigi." },
  { id: 47, title: "Once Upon a Time in America", year: 1984, director: "Sergio Leone", genre: "Suc / Dram", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/7HGKK7DOjAaYuaupTHxJlNsZoF0.jpg", desc: "New York'taki Yahudi gangsterlerin yillara yayilan hikayesi." },
  { id: 48, title: "Paths of Glory", year: 1957, director: "Stanley Kubrick", genre: "Savas / Dram", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/oQK4BXGC2T5g2tvlkBFNF3ACiH7.jpg", desc: "1. Dunya Savasi'nda askerlerine ihanet eden komutanlara karsi mucadele." },
  { id: 49, title: "Django Unchained", year: 2012, director: "Quentin Tarantino", genre: "Western / Aksiyon", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWcKRT.jpg", desc: "Karisini kurtarmak icin yola cikan ozgur bir kole." },
  { id: 50, title: "WALL-E", year: 2008, director: "Andrew Stanton", genre: "Animasyon / Bilim Kurgu", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQ3lbx.jpg", desc: "Gelecekte yalniz kalan bir robotun ask hikayesi." },
  { id: 51, title: "Grave of the Fireflies", year: 1988, director: "Isao Takahata", genre: "Anime / Savas", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/k5BOMgEFSsNP4Md9rFZMUokDCGw.jpg", desc: "2. Dunya Savasi'nda hayatta kalmaya calisan iki kardesinin hikayesi." },
  { id: 52, title: "Casablanca", year: 1942, director: "Michael Curtiz", genre: "Romantik / Dram", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezcs5dnH5op.jpg", desc: "2. Dunya Savasi'nda Casablanca'da gecen unutulmaz bir ask hikayesi." },
  { id: 53, title: "A Beautiful Mind", year: 2001, director: "Ron Howard", genre: "Biyografi / Dram", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/zwzWCmH72OSC9NA0ipoqynHkzpx.jpg", desc: "Akil hastalığiyla savasirken Nobel odulunu kazanan dahinin hikayesi." },
  { id: 54, title: "The Intouchables", year: 2011, director: "Olivier Nakache", genre: "Dram / Komedi", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/1edqM4JlyBGEEZhEKF4SqFWCbfq.jpg", desc: "Felicli bir adam ile bakim personeli arasindaki beklenmedik dostluk." },
  { id: 55, title: "Modern Times", year: 1936, director: "Charlie Chaplin", genre: "Komedi", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/4n9JfXjPDEOlMTIHXhMNVOVOUAj.jpg", desc: "Endustriyel cagda hayatta kalmaya calisan kucuk bir adamın seruvenleri." },
  { id: 56, title: "Rear Window", year: 1954, director: "Alfred Hitchcock", genre: "Gerilim / Gizem", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/ILVF0eJg3JWR3W4hyT5j5GzrRPm.jpg", desc: "Yaralı bir fotograf muhabirinin penceresinden bir cinayeti izlemesi." },
  { id: 57, title: "Cinema Paradiso", year: 1988, director: "Giuseppe Tornatore", genre: "Dram / Romantik", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/gCI2AeMV5JaB1m2BDSWtBBqkbcU.jpg", desc: "Kucuk bir Italyan kasabasinda buyuyen bir gencin sinema asKi." },
  { id: 58, title: "Sunset Boulevard", year: 1950, director: "Billy Wilder", genre: "Dram / Gizem", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg", desc: "Hollywood'un unutulmus bir yildizinin takintili iliskisi." },
  { id: 59, title: "Some Like It Hot", year: 1959, director: "Billy Wilder", genre: "Komedi", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/wUM7l7pqWm5bRKkzJpj2VjVurOs.jpg", desc: "Cinayete tanik olan iki muzisyen kadin kiligi giyerek kacmaya calisir." },
  { id: 60, title: "Dr. Strangelove", year: 1964, director: "Stanley Kubrick", genre: "Komedi / Bilim Kurgu", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/7Zt2qBXX7Tf0sFGfpkrr0Gvq81C.jpg", desc: "Soguk Savas doneminde nukleer bir felakete giden kaotik surec." },
  { id: 61, title: "Lawrence of Arabia", year: 1962, director: "David Lean", genre: "Tarih / Macera", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/AiAm0EtMEPO4jHbRRKpMoiwGBdB.jpg", desc: "T.E. Lawrence'in Arap Isayanı'ndaki rolunun destansi hikayesi." },
  { id: 62, title: "North by Northwest", year: 1959, director: "Alfred Hitchcock", genre: "Gerilim / Macera", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/rEHP8yCaS8gBMJOQTCxBCHH9Yv4.jpg", desc: "Yanlis kimlik kurbanı olan bir reklamcının kacis hikayesi." },
  { id: 63, title: "Taxi Driver", year: 1976, director: "Martin Scorsese", genre: "Dram / Gerilim", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/ekstpH614fwDX8DUln1a2Opz0N8.jpg", desc: "New York'ta geceler calisan melankolik bir taksi soforu." },
  { id: 64, title: "Full Metal Jacket", year: 1987, director: "Stanley Kubrick", genre: "Savas / Dram", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/naYQdaE9GN0ouADVQG3VGVkdaXp.jpg", desc: "Vietnam Savasi'na gonderilen askerlerin hikayesi." },
  { id: 65, title: "Requiem for a Dream", year: 2000, director: "Darren Aronofsky", genre: "Dram", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/nOd6vjEmzCT0k4VYqsA2hwyi87C.jpg", desc: "Madde bagimliliğinin dört insanin hayatini nasil yok ettiginin hikayesi." },
  { id: 66, title: "Vertigo", year: 1958, director: "Alfred Hitchcock", genre: "Gerilim / Romantik", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/5om9LsRCCy0SRqYYs2oLJi0BGRY.jpg", desc: "Yukseklik korkusu olan bir dedektifin gizemli bir kadini izlemesi." },
  { id: 67, title: "Reservoir Dogs", year: 1992, director: "Quentin Tarantino", genre: "Suc / Gerilim", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/lsBnfheKZBO3UKU7lVHIeGZLWuF.jpg", desc: "Bir mücevher soygununda ters giden her seyin hikayesi." },
  { id: 68, title: "Eternal Sunshine of the Spotless Mind", year: 2004, director: "Michel Gondry", genre: "Romantik / Bilim Kurgu", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg", desc: "Bir cift birbirlerini hafizasindan silmeye karar verir." },
  { id: 69, title: "2001: A Space Odyssey", year: 1968, director: "Stanley Kubrick", genre: "Bilim Kurgu", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/ve72VxNqjIqd6axKz45ysclPeSJ.jpg", desc: "Insan evrimi ve yapay zekanin anlami uzerine epik bir yolculuk." },
  { id: 70, title: "Amadeus", year: 1984, director: "Milos Forman", genre: "Biyografi / Dram", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/wUABHk41rBFItzXLzQIbKMHBDuS.jpg", desc: "Mozart ile rakibi Salieri arasindaki kiskanclik ve ihanet." },
  { id: 71, title: "To Kill a Mockingbird", year: 1962, director: "Robert Mulligan", genre: "Dram", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/y0UtJsyJCxXzaKN1bBLmGF9oBLm.jpg", desc: "Irk ayrimciligi doneminde bir avukatin adaleti arayisi." },
  { id: 72, title: "Ikiru", year: 1952, director: "Akira Kurosawa", genre: "Dram", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/ddA7P4DGbhLNTDgCgCNpS1vFjOB.jpg", desc: "Olumcul hasta olan bir memurun hayatina anlam katma cabasi." },
  { id: 73, title: "Ran", year: 1985, director: "Akira Kurosawa", genre: "Tarih / Dram", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/Avp9QHT9C20k5pBfbAi6Ua8eBDd.jpg", desc: "Japonya'da klanlar arasi iktidar savasi." },
  { id: 74, title: "Heat", year: 1995, director: "Michael Mann", genre: "Suc / Aksiyon", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/zMyfPUelumio3tiDKPffaUpsQTD.jpg", desc: "Bir dedektif ile bir soyguncu arasindaki amansiz kovalamaca." },
  { id: 75, title: "Indiana Jones and the Raiders of the Lost Ark", year: 1981, director: "Steven Spielberg", genre: "Macera / Aksiyon", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg", desc: "Arkeolog Indiana Jones'in Kayip Sandigi bulma macerasi." },
  { id: 76, title: "Monty Python and the Holy Grail", year: 1975, director: "Terry Gilliam", genre: "Komedi", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/sGyllhbfCkvETkGSwSjGmdQ5WD4.jpg", desc: "Kral Arthur ve sovalyelerinin kutsal kase arayisi." },
  { id: 77, title: "A Clockwork Orange", year: 1971, director: "Stanley Kubrick", genre: "Dram / Bilim Kurgu", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/4sHeTAp65WrSSuc05nRBKddhBxO.jpg", desc: "Distopik bir gelecekte siddet dunyasinda yasamak." },
  { id: 78, title: "The Great Dictator", year: 1940, director: "Charlie Chaplin", genre: "Komedi / Dram", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/1QpO9wo7JWecZ4NiBuu625FiY1j.jpg", desc: "Charlie Chaplin'in Hitler'i hicvettigi unutulmaz satir." },
  { id: 79, title: "Children of Heaven", year: 1997, director: "Majid Majidi", genre: "Dram", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/5bLGgRiNJE0OdifmCCeVAGHZbBl.jpg", desc: "Kiz kardesinin ayakkabisini kaybeden bir cocugun hikayesi." },
  { id: 80, title: "The Hunt", year: 2012, director: "Thomas Vinterberg", genre: "Dram / Gerilim", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/7GgDNZBhpJEfJJZSe9HgQnEMGMF.jpg", desc: "Yanlis suclamayla hayati mahvolan bir ogretmenin hikayesi." },
  { id: 81, title: "Oldboy", year: 2003, director: "Park Chan-wook", genre: "Gerilim / Gizem", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/pWDtjs568ZfOTMbURQBRC5iB59f.jpg", desc: "15 yil boyunca hapsedilen bir adamın intikam yolculugu." },
  { id: 82, title: "Princess Mononoke", year: 1997, director: "Hayao Miyazaki", genre: "Anime / Fantastik", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/2aGT3qNEbvKITmHCIRz6sqMt6SY.jpg", desc: "Insanlar ile doga ruhları arasindaki savas." },
  { id: 83, title: "The Treasure of the Sierra Madre", year: 1948, director: "John Huston", genre: "Macera / Western", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/hWxDf2dLpOIE0BO4YCNqRFKFcSP.jpg", desc: "Meksika'da altin arayan uc adamın hikayesi." },
  { id: 84, title: "Come and See", year: 1985, director: "Elem Klimov", genre: "Savas / Dram", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/wZBXHdBqsHF9FBf1Wt7XIJQXQ4m.jpg", desc: "2. Dunya Savasi'nda Nazilerin Belarus'taki vahseti." },
  { id: 85, title: "The Kid", year: 1921, director: "Charlie Chaplin", genre: "Komedi / Dram", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/FJTRLTHhRiCTqbFZMXeWkDThYJ.jpg", desc: "Terk edilmis bir bebegi buyuten bir serserinin hikayesi." },
  { id: 86, title: "Witness for the Prosecution", year: 1957, director: "Billy Wilder", genre: "Gerilim / Dram", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/bVm6udIBhgHFazbgqhcEVGBqaLU.jpg", desc: "Bir cinayet davasinda surt surpriz gelen ifadeler." },
  { id: 87, title: "In the Name of the Father", year: 1993, director: "Jim Sheridan", genre: "Dram / Biyografi", rating: 8.1, cover: "https://image.tmdb.org/t/p/w500/bi0T1JrKnGkFwSMWIcSa9m5cFXG.jpg", desc: "Yanlis suclanarak hapsedilen bir Irlandali ve babasinin hikayesi." },
  { id: 88, title: "The Wolf of Wall Street", year: 2013, director: "Martin Scorsese", genre: "Biyografi / Komedi", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzWd4Zp.jpg", desc: "Wall Street'in en buyuk dolandiricilarinden birinin hikayesi." },
  { id: 89, title: "Good Will Hunting", year: 1997, director: "Gus Van Sant", genre: "Dram", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/bABCBKYBK7A5G2PZQN0BUDGAJRD.jpg", desc: "Dahice bir zekaya sahip ama sorunlu bir gencin terapistiyle iliskisi." },
  { id: 90, title: "Singin' in the Rain", year: 1952, director: "Stanley Donen", genre: "Muzik / Komedi", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/w3cMPB5LgB4tUMcbHBUNIaJcBUe.jpg", desc: "Sessiz sinemadan sesli sinemaya gecis doneminde gecen muzik komedisi." },
  { id: 91, title: "My Neighbor Totoro", year: 1988, director: "Hayao Miyazaki", genre: "Anime / Aile", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg", desc: "Iki kiz kardesin orman ruhu Totoro ile arkadasligi." },
  { id: 92, title: "Snatch", year: 2000, director: "Guy Ritchie", genre: "Suc / Komedi", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/56mOJth4pVUMbPqEnBwFjTdCKYp.jpg", desc: "Londra'da birbirinden komik suc hikayelerinin ic ice gectigi film." },
  { id: 93, title: "3 Idiots", year: 2009, director: "Rajkumar Hirani", genre: "Komedi / Dram", rating: 8.4, cover: "https://image.tmdb.org/t/p/w500/66A9MqXZyMFEnhwN4v2jiHhuwTn.jpg", desc: "Hint muhendislik okulundaki uc arkadasin komik ve duygusal hikayesi." },
  { id: 94, title: "The Seventh Seal", year: 1957, director: "Ingmar Bergman", genre: "Dram / Fantastik", rating: 8.1, cover: "https://image.tmdb.org/t/p/w500/dkyKBbQmpITQMZiOJF7hVUMCOrQ.jpg", desc: "Olumle satranc oynayan bir ovalyenin varlik sorgulamasi." },
  { id: 95, title: "Pan's Labyrinth", year: 2006, director: "Guillermo del Toro", genre: "Fantastik / Dram", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/htykNPlTRaBpJMTnh6e5zsNvlYZ.jpg", desc: "Ispanya Ic Savasi sirasinda bir kizin fantastik dunya kacisi." },
  { id: 96, title: "No Country for Old Men", year: 2007, director: "Coen Brothers", genre: "Gerilim / Western", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/6d5XOczc0bAKnHOhohYEFkCeQNb.jpg", desc: "Teksas'ta bulunan bir para cantasinin pesindeki amansiz katil." },
  { id: 97, title: "Bicycle Thieves", year: 1948, director: "Vittorio De Sica", genre: "Dram", rating: 8.3, cover: "https://image.tmdb.org/t/p/w500/ukOxBxHvFpWCM2d7TDCBK0KBnQD.jpg", desc: "Bisikletini calinan bir isci ile oglu Roma sokaklarinda arayis iceinde." },
  { id: 98, title: "The Grand Budapest Hotel", year: 2014, director: "Wes Anderson", genre: "Komedi / Macera", rating: 8.1, cover: "https://image.tmdb.org/t/p/w500/nX5XotM9yprCKarRp4uBRRKNa0A.jpg", desc: "Bir otelin legendar konsiyerjinin cinayete karismasinin hikayesi." },
  { id: 99, title: "The Truman Show", year: 1998, director: "Peter Weir", genre: "Dram / Bilim Kurgu", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/vuza0WqY239yBXOadKlGwJsZJFE.jpg", desc: "Hayatinin bir TV seti oldugunu fark eden bir adamın hikayesi." },
  { id: 100, title: "There Will Be Blood", year: 2007, director: "Paul Thomas Anderson", genre: "Dram", rating: 8.2, cover: "https://image.tmdb.org/t/p/w500/fa0RDkAlCec0I9wbSmEr5boWAzZ.jpg", desc: "Petrol zengininin guc ve ac gozluluk uzerine destansi hikayesi." },
];

const BIN_ID = import.meta.env.VITE_JSONBIN_ID || "";
const API_KEY = import.meta.env.VITE_JSONBIN_KEY || "";
const BIN_URL = "https://api.jsonbin.io/v3/b/" + BIN_ID;
const ADMIN_PASSWORD = "4276";

async function fetchComments() {
  if (!BIN_ID || !API_KEY) return {};
  const res = await fetch(BIN_URL + "/latest", { headers: { "X-Master-Key": API_KEY } });
  const data = await res.json();
  return data.record || {};
}

async function putComments(comments) {
  if (!BIN_ID || !API_KEY) return;
  await fetch(BIN_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": API_KEY },
    body: JSON.stringify(comments),
  });
}

function StarRating({ value, onChange, readonly }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map((s) => (
        <span key={s} onClick={() => !readonly && onChange && onChange(s)} onMouseEnter={() => !readonly && setHovered(s)} onMouseLeave={() => !readonly && setHovered(0)} style={{ fontSize: readonly ? 15 : 22, cursor: readonly ? "default" : "pointer", color: s <= (hovered || value) ? "#F5A623" : "#3a3a4a", transition: "color 0.15s", userSelect: "none" }}>★</span>
      ))}
    </div>
  );
}

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "az once";
  if (m < 60) return m + " dk once";
  const h = Math.floor(m / 60);
  if (h < 24) return h + " saat once";
  return Math.floor(h / 24) + " gun once";
}

const DEMO_MODE = !BIN_ID || !API_KEY;
const TABS = ["Filmler", "Alfabetik", "Tum Yorumlar"];

export default function App() {
  const [tab, setTab] = useState("Filmler");
  const [film, setFilm] = useState(null);
  const [comments, setComments] = useState({});
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassPrompt, setShowPassPrompt] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState("");
  const [search, setSearch] = useState("");
  const pollRef = useRef(null);

  function loadLocal() {
    try { return JSON.parse(localStorage.getItem("film_comments") || "{}"); } catch { return {}; }
  }
  function saveLocal(c) { localStorage.setItem("film_comments", JSON.stringify(c)); }

  async function load() {
    if (DEMO_MODE) { setComments(loadLocal()); return; }
    try { const data = await fetchComments(); setComments(data); } catch(e) { console.error(e); }
  }

  useEffect(() => {
    load();
    pollRef.current = setInterval(load, 10000);
    return () => clearInterval(pollRef.current);
  }, []);

  async function handleSubmit() {
    if (!name.trim()) return setError("Isminizi girin.");
    if (!text.trim()) return setError("Yorum yazin.");
    if (!stars) return setError("Puan verin.");
    setError("");
    setSubmitting(true);
    const fid = film.id;
    const nc = { id: Date.now(), name: name.trim(), text: text.trim(), stars, ts: Date.now() };
    const updated = { ...comments, [fid]: [nc, ...(comments[fid] || [])] };
    setComments(updated);
    if (DEMO_MODE) { saveLocal(updated); } else { await putComments(updated); }
    setText(""); setStars(0); setSubmitting(false);
  }

  async function handleDelete(filmId, commentId) {
    const updated = { ...comments, [filmId]: (comments[filmId] || []).filter(c => c.id !== commentId) };
    setComments(updated);
    if (DEMO_MODE) { saveLocal(updated); } else { await putComments(updated); }
  }

  function handleAdminLogin() {
    if (passInput === ADMIN_PASSWORD) { setIsAdmin(true); setShowPassPrompt(false); setPassInput(""); setPassError(""); }
    else { setPassError("Yanlis sifre!"); }
  }

  const sortedAlpha = [...FILMS].sort((a, b) => a.title.localeCompare(b.title));
  const filtered = (tab === "Alfabetik" ? sortedAlpha : FILMS).filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) || f.director.toLowerCase().includes(search.toLowerCase())
  );

  const allComments = FILMS.flatMap(f => (comments[f.id] || []).map(c => ({ ...c, filmTitle: f.title, filmId: f.id }))).sort((a, b) => b.ts - a.ts);

  const fc = film ? (comments[film.id] || []) : [];
  const avg = fc.length ? (fc.reduce((a, c) => a + c.stars, 0) / fc.length).toFixed(1) : null;

  const page = { minHeight: "100vh", background: "#0d0d14", fontFamily: "Georgia,serif", color: "#e8e0d4" };
  const header = { borderBottom: "1px solid #2a2a3a", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, background: "rgba(13,13,20,0.97)", zIndex: 100 };
  const cardStyle = { cursor: "pointer", borderRadius: 8, overflow: "hidden", background: "#13131e", border: "1px solid #1e1e2e", transition: "transform 0.2s" };
  const formBox = { background: "#13131e", border: "1px solid #1e1e2e", borderRadius: 10, padding: 28, marginBottom: 36 };
  const inp = { background: "#0d0d14", border: "1px solid #2a2a3a", borderRadius: 6, padding: "10px 14px", color: "#e8e0d4", fontSize: 14, outline: "none", fontFamily: "inherit" };
  const commentCard = { background: "#13131e", border: "1px solid #1e1e2e", borderRadius: 8, padding: "18px 22px" };
  const avatarStyle = { width: 36, height: 36, borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: "bold", color: "#0d0d14" };

  return (
    <div style={page}>
      <header style={header}>
        <div onClick={() => { setFilm(null); setTab("Filmler"); }} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22, color: "#F5A623" }}>★</span>
          <span style={{ fontSize: 20, letterSpacing: 2, fontWeight: "bold", color: "#fff" }}>SINEMA KULUBU</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {film && <button onClick={() => setFilm(null)} style={{ background: "none", border: "1px solid #3a3a4a", color: "#aaa", padding: "6px 16px", borderRadius: 4, cursor: "pointer", fontSize: 13 }}>Geri Don</button>}
          {!isAdmin ? (
            <button onClick={() => setShowPassPrompt(true)} style={{ background: "none", border: "1px solid #3a3a4a", color: "#555", padding: "6px 16px", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>Admin</button>
          ) : (
            <button onClick={() => setIsAdmin(false)} style={{ background: "#e05a5a22", border: "1px solid #e05a5a", color: "#e05a5a", padding: "6px 16px", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>Admin Cikis</button>
          )}
        </div>
      </header>

      {showPassPrompt && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#13131e", border: "1px solid #2a2a3a", borderRadius: 10, padding: 32, minWidth: 300 }}>
            <h3 style={{ margin: "0 0 16px", color: "#fff", fontSize: 16 }}>Admin Girisi</h3>
            <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdminLogin()} placeholder="Sifre" style={{ ...inp, width: "100%", boxSizing: "border-box", marginBottom: 8 }} />
            {passError && <div style={{ color: "#e05a5a", fontSize: 13, marginBottom: 8 }}>{passError}</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={handleAdminLogin} style={{ background: "#F5A623", color: "#0d0d14", border: "none", borderRadius: 6, padding: "8px 20px", fontWeight: "bold", cursor: "pointer", flex: 1 }}>Giris</button>
              <button onClick={() => { setShowPassPrompt(false); setPassInput(""); setPassError(""); }} style={{ background: "none", border: "1px solid #3a3a4a", color: "#aaa", borderRadius: 6, padding: "8px 20px", cursor: "pointer" }}>Iptal</button>
            </div>
          </div>
        </div>
      )}

      {!film ? (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <h1 style={{ fontSize: 36, fontWeight: "normal", letterSpacing: 4, color: "#fff", margin: "0 0 24px" }}>FILM ARSIVI</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
              {TABS.map(t => (
                <button key={t} onClick={() => { setTab(t); setSearch(""); }} style={{ background: tab === t ? "#F5A623" : "none", color: tab === t ? "#0d0d14" : "#aaa", border: "1px solid " + (tab === t ? "#F5A623" : "#3a3a4a"), borderRadius: 4, padding: "8px 20px", cursor: "pointer", fontWeight: tab === t ? "bold" : "normal", fontSize: 13 }}>{t}</button>
              ))}
            </div>
            {tab !== "Tum Yorumlar" && (
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Film veya yonetmen ara..." style={{ ...inp, width: "100%", maxWidth: 400, boxSizing: "border-box" }} />
            )}
          </div>

          {tab === "Tum Yorumlar" ? (
            <div>
              <h3 style={{ fontSize: 14, letterSpacing: 3, color: "#888", textTransform: "uppercase", marginBottom: 20 }}>Tum Yorumlar ({allComments.length})</h3>
              {allComments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#444" }}>Henuz hic yorum yok.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {allComments.map(c => (
                    <div key={c.id} style={commentCard}>
                      <div style={{ fontSize: 11, color: "#F5A623", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase", cursor: "pointer" }} onClick={() => setFilm(FILMS.find(f => f.id === c.filmId))}>
                        {c.filmTitle}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={avatarStyle}>{c.name[0].toUpperCase()}</div>
                          <div>
                            <div style={{ fontWeight: "bold", color: "#fff", fontSize: 14 }}>{c.name}</div>
                            <StarRating value={c.stars} readonly />
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ fontSize: 12, color: "#444" }}>{timeAgo(c.ts)}</div>
                          {isAdmin && <button onClick={() => handleDelete(c.filmId, c.id)} style={{ background: "#e05a5a22", border: "1px solid #e05a5a", color: "#e05a5a", borderRadius: 4, padding: "3px 10px", fontSize: 11, cursor: "pointer" }}>Sil</button>}
                        </div>
                      </div>
                      <p style={{ margin: 0, color: "#bbb", lineHeight: 1.7, fontSize: 14 }}>{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 24 }}>
              {filtered.map((f) => {
                const fc2 = comments[f.id] || [];
                const avg2 = fc2.length ? (fc2.reduce((a,c) => a+c.stars,0)/fc2.length).toFixed(1) : null;
                return (
                  <div key={f.id} style={cardStyle} onClick={() => setFilm(f)} onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.borderColor="#F5A623"; }} onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor="#1e1e2e"; }}>
                    <div style={{ position: "relative" }}>
                      <img src={f.cover} alt={f.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.8)", borderRadius: 4, padding: "3px 8px", fontSize: 13, color: "#F5A623", fontWeight: "bold" }}>★ {f.rating}</div>
                    </div>
                    <div style={{ padding: "12px 12px 14px" }}>
                      <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 3, color: "#fff" }}>{f.title}</div>
                      <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>{f.year} - {f.director}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 10, color: "#555" }}>{fc2.length} yorum</span>
                        {avg2 && <span style={{ fontSize: 11, color: "#F5A623" }}>★ {avg2}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ textAlign: "center", padding: "48px 0 24px", color: "#444", fontSize: 13 }}>Made by Bilgehan Yakici</div>
        </div>
      ) : (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "flex", gap: 32, marginBottom: 48, alignItems: "flex-start" }}>
            <img src={film.cover} alt={film.title} style={{ width: 160, borderRadius: 8, flexShrink: 0, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#F5A623", letterSpacing: 3, marginBottom: 8, textTransform: "uppercase" }}>{film.genre}</div>
              <h1 style={{ fontSize: 32, fontWeight: "normal", margin: "0 0 4px", color: "#fff" }}>{film.title}</h1>
              <div style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>{film.year} - {film.director}</div>
              <p style={{ color: "#aaa", lineHeight: 1.7, fontSize: 15, marginBottom: 20, maxWidth: 500 }}>{film.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 28, color: "#F5A623", fontWeight: "bold" }}>★ {film.rating}</div>
                {avg && <div style={{ borderLeft: "1px solid #2a2a3a", paddingLeft: 16, fontSize: 13, color: "#aaa" }}>Kullanici: <span style={{ color: "#F5A623", fontWeight: "bold" }}>★ {avg}</span> <span style={{ color: "#555" }}>({fc.length} yorum)</span></div>}
              </div>
            </div>
          </div>

          <div style={formBox}>
            <h3 style={{ margin: "0 0 20px", fontSize: 14, letterSpacing: 3, color: "#888", textTransform: "uppercase" }}>Yorum Yaz</h3>
            <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Isminiz" style={{ ...inp, flex: 1, minWidth: 160 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#666" }}>Puan:</span>
                <StarRating value={stars} onChange={setStars} />
              </div>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Filmi yorumlayin..." rows={4} style={{ ...inp, width: "100%", resize: "vertical", marginBottom: 12, boxSizing: "border-box" }} />
            {error && <div style={{ color: "#e05a5a", fontSize: 13, marginBottom: 10 }}>{error}</div>}
            <button onClick={handleSubmit} disabled={submitting} style={{ background: submitting ? "#2a2a3a" : "#F5A623", color: submitting ? "#666" : "#0d0d14", border: "none", borderRadius: 6, padding: "10px 28px", fontSize: 14, fontWeight: "bold", cursor: submitting ? "not-allowed" : "pointer" }}>
              {submitting ? "Gonderiliyor..." : "Yorumu Gonder"}
            </button>
          </div>

          <div>
            <h3 style={{ fontSize: 14, letterSpacing: 3, color: "#888", textTransform: "uppercase", marginBottom: 20 }}>Yorumlar {fc.length > 0 && "(" + fc.length + ")"}</h3>
            {fc.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#444", fontSize: 15 }}>Henuz yorum yok. Ilk yorumu siz yazin!</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {fc.map(c => (
                  <div key={c.id} style={commentCard}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={avatarStyle}>{c.name[0].toUpperCase()}</div>
                        <div>
                          <div style={{ fontWeight: "bold", color: "#fff", fontSize: 14 }}>{c.name}</div>
                          <StarRating value={c.stars} readonly />
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 12, color: "#444" }}>{timeAgo(c.ts)}</div>
                        {isAdmin && <button onClick={() => handleDelete(film.id, c.id)} style={{ background: "#e05a5a22", border: "1px solid #e05a5a", color: "#e05a5a", borderRadius: 4, padding: "3px 10px", fontSize: 11, cursor: "pointer" }}>Sil</button>}
                      </div>
                    </div>
                    <p style={{ margin: 0, color: "#bbb", lineHeight: 1.7, fontSize: 14 }}>{c.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
