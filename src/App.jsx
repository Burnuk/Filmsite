import { useState, useEffect, useRef } from "react";

const FILMS = [
  { id: 1, title: "Inception", year: 2010, director: "Christopher Nolan", genre: "Bilim Kurgu / Gerilim", rating: 8.8, cover: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", desc: "Rüyaların içine girerek fikir çalan bir hırsızın hikayesi." },
  { id: 2, title: "Interstellar", year: 2014, director: "Christopher Nolan", genre: "Bilim Kurgu / Dram", rating: 8.6, cover: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", desc: "İnsanlığın geleceğini kurtarmak için yıldızlararası seyahate çıkan astronotlar." },
  { id: 3, title: "The Dark Knight", year: 2008, director: "Christopher Nolan", genre: "Aksiyon / Suç", rating: 9.0, cover: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", desc: "Batman, Gotham'ı kaosa sürüklemek isteyen Joker ile yüzleşiyor." },
  { id: 4, title: "Parasite", year: 2019, director: "Bong Joon-ho", genre: "Dram / Gerilim", rating: 8.5, cover: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", desc: "Yoksul bir ailenin zengin bir aileye sızmasının ardından yaşananlar." },
  { id: 5, title: "The Godfather", year: 1972, director: "Francis Ford Coppola", genre: "Suç / Dram", rating: 9.2, cover: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLegHejKInNI.jpg", desc: "Amerika'nın en güçlü mafya ailesi Corleone'nin iktidar mücadelesi." },
];

const BIN_ID = import.meta.env.VITE_JSONBIN_ID || "";
const API_KEY = import.meta.env.VITE_JSONBIN_KEY || "";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function fetchComments() {
  if (!BIN_ID || !API_KEY) return {};
  const res = await fetch(BIN_URL + "/latest", {
    headers: { "X-Master-Key": API_KEY },
  });
  const data = await res.json();
  return data.record || {};
}

async function putComments(comments) {
  if (!BIN_ID || !API_KEY) return;
  await fetch(BIN_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY,
    },
    body: JSON.stringify(comments),
  });
}

function StarRating({ value, onChange, readonly }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map((s) => (
        <span
          key={s}
          onClick={() => !readonly && onChange?.(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            fontSize: readonly ? 15 : 22,
            cursor: readonly ? "default" : "pointer",
            color: s <= (hovered || value) ? "#F5A623" : "#3a3a4a",
            transition: "color 0.15s",
            userSelect: "none",
          }}
        >★</span>
      ))}
    </div>
  );
}

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} saat önce`;
  return `${Math.floor(h / 24)} gün önce`;
}

const S = {
  page: { minHeight: "100vh", background: "#0d0d14", fontFamily: "'Georgia','Times New Roman',serif", color: "#e8e0d4" },
  header: { borderBottom: "1px solid #2a2a3a", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, background: "rgba(13,13,20,0.97)", backdropFilter: "blur(8px)", zIndex: 100 },
  logo: { cursor: "pointer", display: "flex", alignItems: "center", gap: 10 },
  backBtn: { background: "none", border: "1px solid #3a3a4a", color: "#aaa", padding: "6px 16px", borderRadius: 4, cursor: "pointer", fontSize: 13, letterSpacing: 1 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 28 },
  card: { cursor: "pointer", borderRadius: 8, overflow: "hidden", background: "#13131e", border: "1px solid #1e1e2e", transition: "transform 0.2s,border-color 0.2s" },
  formBox: { background: "#13131e", border: "1px solid #1e1e2e", borderRadius: 10, padding: 28, marginBottom: 36 },
  input: { background: "#0d0d14", border: "1px solid #2a2a3a", borderRadius: 6, padding: "10px 14px", color: "#e8e0d4", fontSize: 14, outline: "none", fontFamily: "inherit" },
  commentCard: { background: "#13131e", border: "1px solid #1e1e2e", borderRadius: 8, padding: "18px 22px" },
  avatar: { width: 36, height: 36, borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: "bold", color: "#0d0d14", flexShrink: 0 },
};

const DEMO_MODE = !BIN_ID || !API_KEY;

export default function App() {
  const [film, setFilm] = useState(null);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const pollRef = useRef(null);

  function loadLocal() {
    try { return JSON.parse(localStorage.getItem("film_comments") || "{}"); } catch { return {}; }
  }
  function saveLocal(c) {
    localStorage.setItem("film_comments", JSON.stringify(c));
  }

  async function load() {
    if (DEMO_MODE) { setComments(loadLocal()); return; }
    try {
      const data = await fetchComments();
      setComments(data);
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    load();
    pollRef.current = setInterval(load, 10000);
    return () => clearInterval(pollRef.current);
  }, []);

  async function handleSubmit() {
    if (!name.trim()) return setError("İsminizi girin.");
    if (!text.trim()) return setError("Yorum yazın.");
    if (!stars) return setError("Puan verin.");
    setError("");
    setSubmitting(true);
    const fid = film.id;
    const nc = { id: Date.now(), name: name.trim(), text: text.trim(), stars, ts: Date.now() };
    const updated = { ...comments, [fid]: [nc, ...(comments[fid] || [])] };
    setComments(updated);
    if (DEMO_MODE) { saveLocal(updated); }
    else { await putComments(updated); }
    setText("");
    setStars(0);
    setSubmitting(false);
  }

  const fc = film ? (comments[film.id] || []) : [];
  const avg = fc.length ? (fc.reduce((a, c) => a + c.stars, 0) / fc.length).toFixed(1) : null;

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div style={S.logo} onClick={() => setFilm(null)}>
          <span style={{ fontSize: 22, color: "#F5A623" }}>🎬</span>
          <span style={{ fontSize: 20, letterSpacing: 2, fontWeight: "bold", color: "#fff" }}>
            SİNEMA <span style={{ color: "#F5A623" }}>KLÜBܡ</span>
          </span>
        </div>
        {film && <button style={S.backBtn} onClick={() => setFilm(null)}>← Filmlere Dön</button>}
      </header>

      {DEMO_MODE && (
        <div style={{ background: "#1a1200", borderBottom: "1px solid #3a2800", padding: "10px 24px", fontSize: 13, color: "#F5A623", textAlign: "center" }}>
          ⚠️ Demo mod — yorumlar sadece bu tarayıcıda saklanıyor. Gerçek sunucu için .env dosyasını yapılandırın.
        </div>
      )}

      {!film ? (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ marginBottom: 40, textAlign: "center" }}>
            <h1 style={{ fontSize: 36, fontWeight: "normal", letterSpacing: 4, color: "#fff", margin: "0 0 8px" }}>FİLM ARŞİVİ</h1>
            <p style={{ color: "#666", fontSize: 14, letterSpacing: 2, margin: 0 }}>Bir film seçin, yorumunuzu bırakın</p>
          </div>
          <div style={S.grid}>
            {FILMS.map((f) => {
              const fc2 = comments[f.id] || [];
              const avg2 = fc2.length ? (fc2.reduce((a,c)=>a+c.stars,0)/fc2.length).toFixed(1) : null;
              return (
                <div key={f.id} style={S.card}
                  onClick={() => setFilm(f)}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.borderColor="#F5A623"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor="#1e1e2e"; }}
                >
                  <div style={{ position: "relative" }}>
                    <img src={f.cover} alt={f.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.8)", borderRadius: 4, padding: "3px 8px", fontSize: 13, color: "#F5A623", fontWeight: "bold" }}>★ {f.rating}</div>
                  </div>
                  <div style={{ padding: "14px 14px 16px" }}>
                    <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 4, color: "#fff" }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>{f.year} · {f.director}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "#555" }}>{fc2.length} yorum</span>
                      {avg2 && <span style={{ fontSize: 12, color: "#F5A623" }}>★ {avg2}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "flex", gap: 32, marginBottom: 48, alignItems: "flex-start" }}>
            <img src={film.cover} alt={film.title} style={{ width: 160, borderRadius: 8, flexShrink: 0, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#F5A623", letterSpacing: 3, marginBottom: 8, textTransform: "uppercase" }}>{film.genre}</div>
              <h1 style={{ fontSize: 32, fontWeight: "normal", margin: "0 0 4px", color: "#fff" }}>{film.title}</h1>
              <div style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>{film.year} · {film.director}</div>
              <p style={{ color: "#aaa", lineHeight: 1.7, fontSize: 15, marginBottom: 20, maxWidth: 500 }}>{film.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 28, color: "#F5A623", fontWeight: "bold" }}>★ {film.rating}</div>
                {avg && (
                  <div style={{ borderLeft: "1px solid #2a2a3a", paddingLeft: 16, fontSize: 13, color: "#aaa" }}>
                    Kullanıcı: <span style={{ color: "#F5A623", fontWeight: "bold" }}>★ {avg}</span>
                    <span style={{ color: "#555", marginLeft: 6 }}>({fc.length} yorum)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={S.formBox}>
            <h3 style={{ margin: "0 0 20px", fontSize: 14, letterSpacing: 3, color: "#888", textTransform: "uppercase" }}>Yorum Yaz</h3>
            <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="İsminiz" style={{ ...S.input, flex: 1, minWidth: 160 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#666" }}>Puan:</span>
                <StarRating value={stars} onChange={setStars} />
              </div>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Filmi yorumlayın..." rows={4}
              style={{ ...S.input, width: "100%", resize: "vertical", marginBottom: 12, boxSizing: "border-box" }} />
            {error && <div style={{ color: "#e05a5a", fontSize: 13, marginBottom: 10 }}>{error}</div>}
            <button onClick={handleSubmit} disabled={submitting} style={{ background: submitting ? "#2a2a3a" : "#F5A623", color: submitting ? "#666" : "#0d0d14", border: "none", borderRadius: 6, padding: "10px 28px", fontSize: 14, fontWeight: "bold", cursor: submitting ? "not-allowed" : "pointer", letterSpacing: 1 }}>
              {submitting ? "Gönderiliyor..." : "Yorumu Gönder"}
            </button>
          </div>

          <div>
            <h3 style={{ fontSize: 14, letterSpacing: 3, color: "#888", textTransform: "uppercase", marginBottom: 20 }}>
              Yorumlar {fc.length > 0 && `(${fc.length})`}
            </h3>
            {fc.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#444", fontSize: 15 }}>
                Henüz yorum yok. İlk yorumu siz yazın!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {fc.map(c => (
                  <div key={c.id} style={S.commentCard}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={S.avatar}>{c.name[0].toUpperCase()}</div>
                        <div>
                          <div style={{ fontWeight: "bold", color: "#fff", fontSize: 14 }}>{c.name}</div>
                          <StarRating value={c.stars} readonly />
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#444" }}>{timeAgo(c.ts)}</div>
                    </div>
                    <p style={{ margin: 0, color: "#bbb", lineHeight: 1.7, fontSize: 14 }}>{c.text}</p>
                  </div>
                <div style={{ textAlign: "center", padding: "24px", color: "#444", fontSize: 13, letterSpacing: 2 }}>
  Made by Bilgehan Yakıcı 
              </div>
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
