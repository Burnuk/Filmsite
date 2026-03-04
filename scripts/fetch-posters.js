import { writeFileSync } from "fs";

const KEY = "e55d496a";
const FILMS = [
  "tt1375666","tt0816692","tt0468569","tt6751668","tt0068646","tt0111161","tt0071562","tt0050083","tt0108052","tt0167260",
  "tt0110912","tt0120737","tt0060196","tt0109830","tt0167261","tt0137523","tt0099685","tt0133093","tt0073486","tt0080684",
  "tt0102926","tt0317248","tt0120815","tt0245429","tt0118799","tt0120689","tt0103064","tt0088763","tt2582802","tt0253474",
  "tt0172495","tt0110357","tt0120586","tt0114814","tt0054215","tt0407887","tt0209144","tt0482571","tt0078748","tt0078788",
  "tt0112573","tt0081505","tt4154796","tt0114709","tt7286456","tt0087843","tt0050825","tt1853728","tt0910970","tt0095327",
  "tt0034583","tt0268978","tt1675434","tt0027977","tt0047396","tt0095765","tt0043014","tt0053291","tt0057012","tt0056172",
  "tt0053125","tt0075314","tt0093058","tt0180093","tt0052357","tt0105236","tt0338013","tt0062622","tt0086879","tt0056592",
  "tt0044741","tt0113277","tt0082971","tt0066921","tt0032553","tt0091251","tt0051201","tt0993846","tt0119217","tt0364569",
  "tt0119698","tt0477348","tt0040522","tt2278388","tt0120382","tt0469494","tt0457430","tt1187043","tt0050976","tt0208092",
  "tt0096283","tt0045152","tt0118849","tt2106476","tt0089881","tt0071853","tt0107207","tt0012349","tt0040897","tt0047478"
];

const result = {};
for (const imdb of FILMS) {
  try {
    const r = await fetch(`https://www.omdbapi.com/?i=${imdb}&apikey=${KEY}`);
    const d = await r.json();
    result[imdb] = d.Poster && d.Poster !== "N/A" ? d.Poster : null;
    console.log(imdb, result[imdb] ? "✓" : "✗");
  } catch(e) {
    result[imdb] = null;
    console.log(imdb, "ERROR");
  }
}

writeFileSync("src/posters.json", JSON.stringify(result, null, 2));
console.log("Done!");
