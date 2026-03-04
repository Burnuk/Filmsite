export default async function handler(req, res) {
  const { imdb } = req.query;
  if (!imdb) return res.status(400).json({ error: "no imdb" });
  const r = await fetch(`https://www.omdbapi.com/?i=${imdb}&apikey=e55d496a`);
  const data = await r.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({ poster: data.Poster && data.Poster !== "N/A" ? data.Poster : null });
}
