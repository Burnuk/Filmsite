import { useState, useEffect, useRef } from "react";

const XMDB_KEY = "3dPgSXt2x9jWzFqLEE860r1w9aV1Mqd65DAF5ZmyD6s";
const JSONBIN_KEY = "$2a$10$WWuJS5VHb2.BnxeU9eWel.e/KelymF90gSicK1c5eqDQfVIIKD6HW";
const FILMS_BIN = "69a7545443b1c97be9b06257";
const COMMENTS_BIN = import.meta.env.VITE_JSONBIN_ID || "";
const COMMENTS_KEY = import.meta.env.VITE_JSONBIN_KEY || "";
const ADMIN_PASSWORD = "4276";
const DEMO_MODE = !COMMENTS_BIN || !COMMENTS_KEY;

const FILMS_URL = `https://api.jsonbin.io/v3/b/${FILMS_BIN}`;
const COMMENTS_URL = `https://api.jsonbin.io/v3/b/${COMMENTS_BIN}`;

async function loadFilmsFromBin() {
  const res = await fetch(FILMS_URL + "/latest", { headers: { "X-Master-Key": JSONBIN_KEY } });
  const data = await res.json();
  return Array.isArray(data.record?.films) ? data.record.films : null;
}
async function saveFilmsToBin(films) {
  await fetch(FILMS_URL, { method: "PUT", headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_KEY }, body: JSON.stringify({ films }) });
}
async function fetchFilmsFromXMDB() {
  let films = [], cursor = null;
  while (films.length < 500) {
    const url = cursor
      ? `https://xmdbapi.com/api/v1/trending?count=50&after=${cursor}&apiKey=${XMDB_KEY}`
      : `https://xmdbapi.com/api/v1/trending?count=50&apiKey=${XMDB_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const movies = (data.results || []).filter(f => f.title_type === "Movie");
    films = [...films, ...movies];
    if (!data.has_next_page) break;
    cursor = data.next_cursor;
  }
  return films.slice(0, 500).map(f => ({
    id: f.id, title: f.title, year: f.release_year,
    director: f.credits?.Director?.[0]?.name || f.credits?.Creator?.[0]?.name || "Bilinmiyor",
    genre: (f.genres || []).join(" / ") || "Bilinmiyor",
    rating: f.rating || 0, cover: f.poster_url || null, desc: f.plot || "",
  }));
}
async function fetchComments() {
  const res = await fetch(COMMENTS_URL + "/latest", { headers: { "X-Master-Key": COMMENTS_KEY } });
  const data = await res.json();
  return data.record || {};
}
async function putComments(c) {
  await fetch(COMMENTS_URL, { method: "PUT", headers: { "Content-Type": "application/json", "X-Master-Key": COMMENTS_KEY }, body: JSON.stringify(c) });
}

function Stars({ value, onChange, readonly }) {
  const [hov, setHov] = useState(0);
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => !readonly && onChange?.(s)}
          onMouseEnter={() => !readonly && setHov(s)} onMouseLeave={() => !readonly && setHov(0)}
          style={{ fontSize: readonly ? 12 : 18, cursor: readonly ? "default" : "pointer", color: s <= (hov || value) ? "#c9a84c" : "rgba(201,168,76,0.2)", transition: "color .1s" }}>★</span>
      ))}
    </div>
  );
}
function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "Az once"; if (m < 60) return m + " dk once";
  const h = Math.floor(m / 60); if (h < 24) return h + " saat once";
  return Math.floor(h / 24) + " gun once";
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Special+Elite&family=IM+Fell+English:ital@0;1&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{--cream:#f0e8d0;--dark:#110e06;--gold:#c9a84c;--card:#0d0b05;--border:rgba(201,168,76,.18)}
body{background:var(--dark)}
.app{min-height:100vh;background:var(--dark);font-family:'IM Fell English',serif;color:var(--cream);position:relative;overflow-x:hidden}
.grain{position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");pointer-events:none;z-index:9999;opacity:0.45}

/* HEADER */
.header{border-bottom:1px solid var(--border);padding:0 40px;display:flex;align-items:center;height:64px;position:sticky;top:0;background:rgba(17,14,6,.98);z-index:100;gap:14px}
.logo-sub{font-family:'Special Elite',cursive;font-size:9px;letter-spacing:6px;color:var(--gold);opacity:.7}
.logo-main{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;font-style:italic;color:var(--cream);line-height:1;cursor:pointer}
.logo-main em{color:var(--gold)}
.hdiv{width:1px;height:32px;background:linear-gradient(to bottom,transparent,var(--gold),transparent);margin:0 6px}
.htag{font-family:'Special Elite',cursive;font-size:9px;color:rgba(240,232,208,.25);letter-spacing:3px}
.hbtns{display:flex;gap:8px;margin-left:auto;align-items:center}
.hbtn{font-family:'Special Elite',cursive;font-size:9px;letter-spacing:2px;background:none;border:1px solid var(--border);color:rgba(240,232,208,.4);padding:6px 14px;cursor:pointer;transition:all .2s;text-transform:uppercase}
.hbtn:hover{border-color:var(--gold);color:var(--gold)}
.hbtn.out{border-color:#8b1a1a;color:#8b1a1a}
.hbtn.gold{border-color:var(--gold);color:var(--gold)}
.hbtn.gold:hover{background:var(--gold);color:#110e06}
.hbtn:disabled{opacity:.35;cursor:not-allowed}

/* LAYOUT */
.page{max-width:1000px;margin:0 auto;padding:32px 40px 60px}
.demo-bar{background:#1a1000;border-bottom:1px solid var(--border);padding:7px 24px;font-family:'Special Elite',cursive;font-size:9px;color:rgba(201,168,76,.5);text-align:center;letter-spacing:3px}

/* HERO */
.hero{text-align:center;padding:40px 0 28px}
.hpre{font-family:'Special Elite',cursive;font-size:9px;letter-spacing:8px;color:var(--gold);margin-bottom:10px}
.htitle{font-family:'Playfair Display',serif;font-size:clamp(38px,6vw,68px);font-weight:900;font-style:italic;color:var(--cream);line-height:.9;margin-bottom:10px;text-shadow:2px 4px 32px rgba(0,0,0,.9)}
.htitle em{color:var(--gold)}
.hsub{font-family:'Special Elite',cursive;font-size:9px;letter-spacing:6px;color:rgba(240,232,208,.3);margin-bottom:20px}
.hrule{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:22px}
.hrule::before,.hrule::after{content:'';height:1px;width:60px}
.hrule::before{background:linear-gradient(to right,transparent,var(--gold))}
.hrule::after{background:linear-gradient(to left,transparent,var(--gold))}
.hrule span{font-family:'Special Elite',cursive;font-size:11px;color:var(--gold)}

/* TABS & SEARCH */
.controls{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;gap:12px;flex-wrap:wrap}
.tabs{display:inline-flex;border:1px solid var(--border)}
.tab{font-family:'Special Elite',cursive;font-size:10px;letter-spacing:3px;padding:8px 22px;background:none;border:none;border-right:1px solid var(--border);color:rgba(240,232,208,.38);cursor:pointer;transition:all .2s;text-transform:uppercase}
.tab:last-child{border-right:none}
.tab.on{background:var(--gold);color:#110e06;font-weight:bold}
.srch{background:rgba(240,232,208,.04);border:1px solid var(--border);padding:8px 16px;color:var(--cream);font-family:'Special Elite',cursive;font-size:11px;letter-spacing:2px;width:260px;outline:none;transition:border-color .2s}
.srch:focus{border-color:var(--gold)}
.srch::placeholder{color:rgba(240,232,208,.2);font-style:italic}

/* FILM LIST — IMDB STYLE */
.film-list{display:flex;flex-direction:column;gap:0}
.film-row{display:flex;align-items:flex-start;gap:0;border-bottom:1px solid rgba(201,168,76,.08);padding:14px 0;cursor:pointer;transition:background .2s;position:relative}
.film-row:hover{background:rgba(201,168,76,.03)}
.film-rank{width:48px;flex-shrink:0;font-family:'Special Elite',cursive;font-size:13px;color:rgba(201,168,76,.35);text-align:center;padding-top:6px;letter-spacing:1px}
.film-poster{width:54px;height:78px;flex-shrink:0;object-fit:cover;filter:sepia(15%);border:1px solid rgba(201,168,76,.15);transition:filter .2s}
.film-row:hover .film-poster{filter:sepia(0%)}
.film-poster-ph{width:54px;height:78px;flex-shrink:0;background:#1a1208;border:1px solid rgba(201,168,76,.1);display:flex;align-items:center;justify-content:center;font-family:'Special Elite',cursive;font-size:8px;color:rgba(201,168,76,.2);text-align:center;padding:4px}
.film-info{flex:1;padding:0 16px}
.film-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--cream);margin-bottom:3px;line-height:1.2}
.film-row:hover .film-title{color:var(--gold)}
.film-meta{font-family:'Special Elite',cursive;font-size:9px;color:rgba(240,232,208,.3);letter-spacing:2px;margin-bottom:6px}
.film-genre{font-family:'Special Elite',cursive;font-size:9px;color:rgba(201,168,76,.45);letter-spacing:2px;margin-bottom:8px}
.film-desc{font-family:'IM Fell English',serif;font-size:13.5px;color:rgba(240,232,208,.45);line-height:1.6;max-width:480px;font-style:italic}
.film-right{flex-shrink:0;text-align:right;padding-top:4px}
.film-rating{font-family:'Special Elite',cursive;font-size:16px;color:var(--gold);display:flex;align-items:center;gap:4px;justify-content:flex-end;margin-bottom:4px}
.film-rating span{font-size:11px;color:rgba(201,168,76,.5)}
.film-votes{font-family:'Special Elite',cursive;font-size:9px;color:rgba(240,232,208,.2);letter-spacing:1px;margin-bottom:8px;text-align:right}
.film-comments{font-family:'Special Elite',cursive;font-size:9px;color:rgba(240,232,208,.25);letter-spacing:1px}

/* LOADING */
.loading{text-align:center;padding:60px 0;font-family:'Special Elite',cursive;font-size:11px;letter-spacing:4px;color:rgba(201,168,76,.4)}
.updating{background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.18);padding:9px 18px;font-family:'Special Elite',cursive;font-size:9px;letter-spacing:3px;color:var(--gold);text-align:center;margin-bottom:14px}

/* DETAIL PAGE */
.detail{max-width:860px;margin:0 auto;padding:40px}

.d-hero{display:flex;gap:32px;margin-bottom:36px;align-items:flex-start}
.d-poster{width:160px;flex-shrink:0;border:1px solid rgba(201,168,76,.25);box-shadow:-4px 4px 0 rgba(201,168,76,.06),6px 12px 40px rgba(0,0,0,.8);filter:sepia(12%)}
.d-poster-ph{width:160px;height:240px;flex-shrink:0;background:#1a1208;border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;font-family:'Special Elite',cursive;font-size:10px;color:rgba(201,168,76,.25)}
.d-info{flex:1}
.d-genre{font-family:'Special Elite',cursive;font-size:9px;letter-spacing:5px;color:var(--gold);text-transform:uppercase;margin-bottom:8px}
.d-title{font-family:'Playfair Display',serif;font-size:clamp(24px,4vw,40px);font-weight:900;font-style:italic;color:var(--cream);line-height:1.1;margin-bottom:6px}
.d-meta{font-family:'IM Fell English',serif;font-size:13px;color:rgba(240,232,208,.38);font-style:italic;margin-bottom:12px}
.d-desc{font-family:'IM Fell English',serif;font-size:14px;color:rgba(240,232,208,.58);line-height:1.85;max-width:420px;margin-bottom:18px}
.d-rating{display:flex;align-items:center;gap:14px}
.d-badge{font-family:'Special Elite',cursive;font-size:20px;color:var(--gold);border:2px solid var(--gold);padding:4px 12px;letter-spacing:1px}
.d-user-rating{font-family:'Special Elite',cursive;font-size:11px;color:rgba(201,168,76,.55);letter-spacing:2px}

/* COMMENT FORM */
.fbox{background:rgba(240,232,208,.02);border:1px solid rgba(201,168,76,.14);padding:24px;margin-bottom:28px;position:relative}
.fbox::before{content:'';position:absolute;top:-1px;left:24px;width:48px;height:2px;background:var(--gold)}
.flbl{font-family:'Special Elite',cursive;font-size:9px;letter-spacing:5px;color:var(--gold);text-transform:uppercase;margin-bottom:14px;display:block}
.frow{display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap;align-items:center}
.finp{flex:1;min-width:130px;background:rgba(240,232,208,.04);border:1px solid rgba(201,168,76,.18);padding:9px 13px;color:var(--cream);font-family:'IM Fell English',serif;font-size:13px;outline:none;transition:border-color .2s}
.finp:focus{border-color:var(--gold)}
.finp::placeholder{color:rgba(240,232,208,.18);font-style:italic}
.fta{width:100%;background:rgba(240,232,208,.04);border:1px solid rgba(201,168,76,.18);padding:10px 13px;color:var(--cream);font-family:'IM Fell English',serif;font-size:13px;outline:none;resize:vertical;margin-bottom:12px;line-height:1.7;transition:border-color .2s}
.fta:focus{border-color:var(--gold)}
.fta::placeholder{color:rgba(240,232,208,.18);font-style:italic}
.sbtn{background:var(--gold);color:#110e06;border:none;padding:10px 26px;font-family:'Special Elite',cursive;font-size:10px;letter-spacing:4px;text-transform:uppercase;cursor:pointer;transition:all .2s}
.sbtn:hover{background:var(--cream)}

/* COMMENTS */
.stitle{font-family:'Playfair Display',serif;font-size:12px;font-style:italic;color:var(--gold);letter-spacing:4px;text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:10px}
.stitle::after{content:'';flex:1;height:1px;background:linear-gradient(to right,rgba(201,168,76,.28),transparent)}
.ccard{border:1px solid rgba(201,168,76,.1);padding:16px 16px 12px;margin-bottom:10px;position:relative;background:rgba(240,232,208,.012);transition:border-color .2s}
.ccard:hover{border-color:rgba(201,168,76,.25)}
.ccard::before{content:'"';position:absolute;top:6px;left:14px;font-family:'Playfair Display',serif;font-size:44px;color:rgba(201,168,76,.08);line-height:1}
.chdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.cav{width:34px;height:34px;border:1px solid rgba(201,168,76,.3);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--gold);background:rgba(201,168,76,.05);flex-shrink:0}
.cname{font-family:'Playfair Display',serif;font-weight:700;font-size:13px;color:var(--cream)}
.ctime{font-family:'Special Elite',cursive;font-size:9px;color:rgba(240,232,208,.18);letter-spacing:2px}
.ctext{font-family:'Playfair Display',serif;font-size:14px;color:rgba(240,232,208,.72);line-height:1.9;padding-left:4px;margin-bottom:10px}
.cfoot{display:flex;align-items:center;gap:12px}
.like-btn{display:flex;align-items:center;gap:5px;background:none;border:1px solid rgba(201,168,76,.15);padding:4px 10px;cursor:pointer;font-family:'Special Elite',cursive;font-size:9px;color:rgba(240,232,208,.3);letter-spacing:1px;transition:all .2s}
.like-btn:hover{border-color:rgba(201,168,76,.4);color:var(--gold)}
.like-btn.liked{border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,.06)}
.dbtn{background:rgba(139,26,26,.1);border:1px solid #8b1a1a;color:#8b1a1a;font-family:'Special Elite',cursive;font-size:9px;padding:3px 9px;cursor:pointer;margin-left:auto}

/* MODAL */
.modal{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:999}
.mbox{background:#13100a;border:1px solid rgba(201,168,76,.25);padding:30px;min-width:280px;position:relative}
.mbox::before{content:'';position:absolute;top:-1px;left:0;right:0;height:2px;background:linear-gradient(to right,transparent,var(--gold),transparent)}
.mbox h3{font-family:'Playfair Display',serif;font-style:italic;color:var(--cream);font-size:17px;margin-bottom:14px}
.mrow{display:flex;gap:8px;margin-top:10px}
.mok{flex:1;font-family:'Special Elite',cursive;font-size:10px;letter-spacing:2px;padding:9px;cursor:pointer;background:var(--gold);color:#110e06;border:none}
.mok:hover{background:var(--cream)}
.mcancel{flex:1;font-family:'Special Elite',cursive;font-size:10px;padding:9px;cursor:pointer;background:none;border:1px solid rgba(201,168,76,.25);color:rgba(240,232,208,.4)}
.merr{color:#c9503a;font-family:'Special Elite',cursive;font-size:10px;margin-top:6px}
.ftag{font-family:'Special Elite',cursive;font-size:9px;letter-spacing:4px;color:var(--gold);text-transform:uppercase;margin-bottom:7px;cursor:pointer}
.ftag:hover{text-decoration:underline}
.footer{text-align:center;padding:24px;font-family:'Special Elite',cursive;font-size:9px;letter-spacing:4px;color:rgba(240,232,208,.14);text-transform:uppercase;border-top:1px solid rgba(201,168,76,.06)}
`;

function FilmRow({ f, rank, comments, onClick }) {
  const fc = comments[f.id] || [];
  const avg = fc.length ? (fc.reduce((a,c)=>a+c.stars,0)/fc.length).toFixed(1) : null;
  return (
    <div className="film-row" onClick={onClick}>
      <div className="film-rank">#{rank}</div>
      {f.cover
        ? <img src={f.cover} alt={f.title} className="film-poster"/>
        : <div className="film-poster-ph">{f.title}</div>
      }
      <div className="film-info">
        <div className="film-title">{f.title}</div>
        <div className="film-meta">{f.year} · {f.director}</div>
        <div className="film-genre">{f.genre}</div>
        <div className="film-desc">{f.desc?.slice(0,120)}{f.desc?.length>120?"...":""}</div>
      </div>
      <div className="film-right">
        <div className="film-rating">★ <span>{f.rating}</span></div>
        {avg && <div className="film-votes">Okuyucu: ★{avg}</div>}
        <div className="film-comments">{fc.length} yorum</div>
      </div>
    </div>
  );
}

function FilmDetail({ film, comments, isAdmin, onComment }) {
  const fc = comments[film.id] || [];
  const avg = fc.length ? (fc.reduce((a,c)=>a+c.stars,0)/fc.length).toFixed(1) : null;
  const [name,setName]=useState("");
  const [text,setText]=useState("");
  const [stars,setStars]=useState(0);
  const [liked,setLiked]=useState(()=>{try{return JSON.parse(localStorage.getItem("likes")||"{}");}catch{return{};}});

  function toggleLike(cid) {
    const updated = {...liked,[cid]:!liked[cid]};
    setLiked(updated);
    localStorage.setItem("likes", JSON.stringify(updated));
    const newFc = fc.map(c => c.id===cid ? {...c, likes:(c.likes||0)+(liked[cid]?-1:1)} : c);
    onComment("SET", film.id, newFc);
  }

  function submit() {
    if(!name.trim()||!text.trim()||!stars) return;
    onComment("ADD", film.id, {id:Date.now(),name:name.trim(),text:text.trim(),stars,likes:0,ts:Date.now()});
    setName(""); setText(""); setStars(0);
  }

  return (
    <div className="detail">
      <div className="d-hero">
        {film.cover
          ? <img src={film.cover} alt={film.title} className="d-poster"/>
          : <div className="d-poster-ph">{film.title}</div>
        }
        <div className="d-info">
          <div className="d-genre">{film.genre}</div>
          <h1 className="d-title">{film.title}</h1>
          <div className="d-meta">Yonetmen: {film.director} · {film.year}</div>
          <p className="d-desc">{film.desc}</p>
          <div className="d-rating">
            <div className="d-badge">★ {film.rating}</div>
            {avg && <div className="d-user-rating">Okuyucu ★ {avg} ({fc.length})</div>}
          </div>
        </div>
      </div>

      <div className="fbox">
        <span className="flbl">Kaleminizi Konusturun</span>
        <div className="frow">
          <input className="finp" value={name} onChange={e=>setName(e.target.value)} placeholder="Isminiz..."/>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"'Special Elite',cursive",fontSize:9,letterSpacing:3,color:"rgba(201,168,76,.45)"}}>PUAN</span>
            <Stars value={stars} onChange={setStars}/>
          </div>
        </div>
        <textarea className="fta" rows={3} value={text} onChange={e=>setText(e.target.value)} placeholder="Film hakkindaki dusuncelerinizi yazin..."/>
        <button className="sbtn" onClick={submit}>Yorumu Yayinla</button>
      </div>

      <div className="stitle">Okuyucu Yorumlari {fc.length>0&&`(${fc.length})`}</div>
      {fc.length===0
        ? <div style={{textAlign:"center",padding:"40px 0",fontFamily:"'IM Fell English',serif",fontStyle:"italic",color:"rgba(240,232,208,.2)"}}>Bu film icin henuz kalem kipirdamamis...</div>
        : [...fc].sort((a,b)=>(b.likes||0)-(a.likes||0)).map(c=>(
          <div key={c.id} className="ccard">
            <div className="chdr">
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div className="cav">{c.name[0]}</div>
                <div><div className="cname">{c.name}</div><Stars value={c.stars} readonly/></div>
              </div>
              <div className="ctime">{timeAgo(c.ts)}</div>
            </div>
            <p className="ctext">{c.text}</p>
            <div className="cfoot">
              <button className={`like-btn${liked[c.id]?" liked":""}`} onClick={()=>toggleLike(c.id)}>
                ♥ {c.likes||0} Begeni
              </button>
              {isAdmin&&<button className="dbtn" onClick={()=>onComment("DEL",film.id,c.id)}>Sil</button>}
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default function App() {
  const [films,setFilms]=useState([]);
  const [loading,setLoading]=useState(true);
  const [updating,setUpdating]=useState(false);
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

  async function loadComments(){
    if(DEMO_MODE){setComments(loadLocal());return;}
    try{const data=await fetchComments();setComments(data);}catch(e){console.error(e);}
  }

  async function loadFilms(){
    try{
      const cached=await loadFilmsFromBin();
      cached.sort((a,b) => (b.rating||0) - (a.rating||0));
      if(cached&&cached.length>0){setFilms(cached);setLoading(false);return;}
      const fresh=await fetchFilmsFromXMDB();
      await saveFilmsToBin(fresh);
      fresh.sort((a,b) => (b.rating||0) - (a.rating||0));
      setFilms(fresh);
    }catch(e){console.error(e);}
    setLoading(false);
  }

  async function updateFilms(){
    setUpdating(true);
    try{const fresh=await fetchFilmsFromXMDB();await saveFilmsToBin(fresh);setFilms(fresh);}catch(e){console.error(e);}
    setUpdating(false);
  }

  useEffect(()=>{
    loadFilms(); loadComments();
    pollRef.current=setInterval(loadComments,10000);
    return()=>clearInterval(pollRef.current);
  },[]);

  async function handleComment(action,fid,payload){
    let updated;
    if(action==="ADD") updated={...comments,[fid]:[payload,...(comments[fid]||[])]};
    else if(action==="DEL") updated={...comments,[fid]:(comments[fid]||[]).filter(c=>c.id!==payload)};
    else if(action==="SET") updated={...comments,[fid]:payload};
    setComments(updated);
    if(DEMO_MODE){saveLocal(updated);}else{await putComments(updated);}
  }

  function login(){
    if(passVal===ADMIN_PASSWORD){setIsAdmin(true);setShowPass(false);setPassVal("");setPassErr("");}
    else setPassErr("Yanlis sifre!");
  }

  const filtered=films.filter(f=>
    f.title.toLowerCase().includes(search.toLowerCase())||
    (f.director||"").toLowerCase().includes(search.toLowerCase())
  );
  const allC=films.flatMap(f=>(comments[f.id]||[]).map(c=>({...c,filmTitle:f.title,filmId:f.id}))).sort((a,b)=>b.ts-a.ts);

  return(
    <>
      <style>{css}</style>
      <div className="app">
        <div className="grain"/>
        <header className="header">
          <div style={{cursor:"pointer"}} onClick={()=>{setFilm(null);setTab("Filmler");}}>
            <div className="logo-sub">Est. 1924</div>
            <div className="logo-main">Sinema <em>Kulubu</em></div>
          </div>
          <div className="hdiv"/>
          <div className="htag">Film · Sanat · Elestiri</div>
          <div className="hbtns">
            {film&&<button className="hbtn" onClick={()=>setFilm(null)}>← Geri Don</button>}
            {isAdmin&&<button className="hbtn gold" disabled={updating} onClick={updateFilms}>{updating?"Yukleniyor...":"Filmleri Guncelle"}</button>}
            {!isAdmin?<button className="hbtn" onClick={()=>setShowPass(true)}>Admin</button>:<button className="hbtn out" onClick={()=>setIsAdmin(false)}>Cikis</button>}
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
          <div className="page">
            <div className="hero">
              <div className="hpre">— Gercek Zamanli Film Arsivi —</div>
              <h1 className="htitle">Sinema <em>Kulubu</em></h1>
              <p className="hsub">Her kare bir hikaye · Her yorum bir iz</p>
              <div className="hrule"><span>✦</span></div>
            </div>
            <div className="controls">
              <div className="tabs">
                {["Filmler","Tum Yorumlar"].map(t=>(
                  <button key={t} className={`tab${tab===t?" on":""}`} onClick={()=>{setTab(t);setSearch("");}}>{t}</button>
                ))}
              </div>
              {tab==="Filmler"&&<input className="srch" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Film veya yonetmen ara..."/>}
            </div>
            {updating&&<div className="updating">Filmler guncelleniyor, lutfen bekleyin...</div>}
            {tab==="Filmler"&&(
              loading
                ? <div className="loading">Filmler yukleniyor...</div>
                : <div className="film-list">
                    {filtered.map((f,i)=><FilmRow key={f.id} f={f} rank={i+1} comments={comments} onClick={()=>setFilm(f)}/>)}
                  </div>
            )}
            {tab==="Tum Yorumlar"&&(
              <div style={{maxWidth:640,margin:"0 auto"}}>
                <div className="stitle">Tum Yorumlar {allC.length>0&&`(${allC.length})`}</div>
                {allC.length===0
                  ?<div style={{textAlign:"center",padding:"40px 0",fontFamily:"'IM Fell English',serif",fontStyle:"italic",color:"rgba(240,232,208,.2)"}}>Henuz kalem kipirdamamis...</div>
                  :allC.map(c=>(
                    <div key={c.id} className="ccard">
                      <div className="ftag" onClick={()=>setFilm(films.find(f=>f.id===c.filmId))}>{c.filmTitle}</div>
                      <div className="chdr">
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div className="cav">{c.name[0]}</div>
                          <div><div className="cname">{c.name}</div><Stars value={c.stars} readonly/></div>
                        </div>
                        <div className="ctime">{timeAgo(c.ts)}</div>
                      </div>
                      <p className="ctext">{c.text}</p>
                      <div className="cfoot">
                        <div style={{fontFamily:"'Special Elite',cursive",fontSize:9,color:"rgba(201,168,76,.35)",letterSpacing:1}}>♥ {c.likes||0}</div>
                        {isAdmin&&<button className="dbtn" onClick={()=>handleComment("DEL",c.filmId,c.id)}>Sil</button>}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
            <div className="footer">Made by Bilgehan Yakici ✦ Sinema Kulubu ✦ Est. 1924</div>
          </div>
        ):(
          <FilmDetail film={film} comments={comments} isAdmin={isAdmin} onComment={handleComment}/>
        )}
      </div>
    </>
  );
}
