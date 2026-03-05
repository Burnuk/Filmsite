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
  await fetch(FILMS_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_KEY },
    body: JSON.stringify({ films })
  });
}

async function fetchFilmsFromXMDB() {
  let films = [];
  let cursor = null;
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
    id: f.id,
    title: f.title,
    year: f.release_year,
    director: f.credits?.Director?.[0]?.name || f.credits?.Creator?.[0]?.name || "Bilinmiyor",
    genre: (f.genres || []).join(" / ") || "Bilinmiyor",
    rating: f.rating || 0,
    cover: f.poster_url || null,
    desc: f.plot || "",
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
.placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:'Special Elite',cursive;font-size:9px;color:rgba(201,168,76,.25);letter-spacing:1px;text-align:center;padding:8px;position:absolute}
.loading{text-align:center;padding:80px 0;font-family:'Special Elite',cursive;font-size:12px;letter-spacing:4px;color:rgba(201,168,76,.5)}
.updating{background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);padding:10px 20px;font-family:'Special Elite',cursive;font-size:10px;letter-spacing:3px;color:var(--gold);text-align:center;margin-bottom:16px}
.footer{text-align:center;padding:28px;font-family:'Special Elite',cursive;font-size:10px;letter-spacing:4px;color:rgba(240,232,208,.16);text-transform:uppercase;border-top:1px solid rgba(201,168,76,.07)}
.detail{max-width:880px;margin:0 auto;padding:48px 80px;position:relative;z-index:1}
.dhero{display:flex;gap:44px;margin-bottom:44px;align-items:flex-start}
.dposter{width:185px;min-height:270px;flex-shrink:0;border:1px solid rgba(201,168,76,.28);box-shadow:-6px 6px 0 rgba(201,168,76,.07),8px 16px 48px rgba(0,0,0,.8);filter:sepia(14%);object-fit:cover;background:#1a1208}
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
.ubtn{background:none;border:1px solid var(--gold);color:var(--gold);padding:9px 22px;font-family:'Special Elite',cursive;font-size:10px;letter-spacing:3px;cursor:pointer;transition:all .2s;text-transform:uppercase}
.ubtn:hover{background:var(--gold);color:#110e06}
.ubtn:disabled{opacity:.4;cursor:not-allowed}
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

function FilmCard({ f, comments, onClick }) {
  const fc = comments[f.id] || [];
  const avg = fc.length ? (fc.reduce((a,c)=>a+c.stars,0)/fc.length).toFixed(1) : null;
  return (
    <div className="card" onClick={onClick}>
      <div className="cimg">
        {f.cover ? <img src={f.cover} alt={f.title}/> : <div className="placeholder">{f.title}</div>}
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

function FilmDetail({ film, comments, isAdmin, onComment }) {
  const fc = comments[film.id] || [];
  const avg = fc.length ? (fc.reduce((a,c)=>a+c.stars,0)/fc.length).toFixed(1) : null;
  const [name,setName]=useState("");
  const [text,setText]=useState("");
  const [stars,setStars]=useState(0);

  function submit() {
    if(!name.trim()||!text.trim()||!stars) return;
    onComment("ADD", film.id, {id:Date.now(),name:name.trim(),text:text.trim(),stars,ts:Date.now()});
    setName(""); setText(""); setStars(0);
  }

  return (
    <div className="detail">
      <div className="dhero">
        {film.cover
          ? <img src={film.cover} alt={film.title} className="dposter"/>
          : <div className="dposter" style={{display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Special Elite',cursive",fontSize:12,color:"rgba(201,168,76,.3)"}}>{film.title}</div>
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
                {isAdmin&&<button className="dbtn" onClick={()=>onComment("DEL",film.id,c.id)}>Sil</button>}
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
    try {
      const cached = await loadFilmsFromBin();
      if(cached && cached.length > 0){ setFilms(cached); setLoading(false); return; }
      const fresh = await fetchFilmsFromXMDB();
      await saveFilmsToBin(fresh);
      setFilms(fresh);
    } catch(e){ console.error(e); }
    setLoading(false);
  }

  async function updateFilms(){
    setUpdating(true);
    try {
      const fresh = await fetchFilmsFromXMDB();
      await saveFilmsToBin(fresh);
      setFilms(fresh);
    } catch(e){ console.error(e); }
    setUpdating(false);
  }

  useEffect(()=>{
    loadFilms();
    loadComments();
    pollRef.current=setInterval(loadComments,10000);
    return()=>clearInterval(pollRef.current);
  },[]);

  async function handleComment(action,fid,payload){
    let updated;
    if(action==="ADD") updated={...comments,[fid]:[payload,...(comments[fid]||[])]};
    else updated={...comments,[fid]:(comments[fid]||[]).filter(c=>c.id!==payload)};
    setComments(updated);
    if(DEMO_MODE){saveLocal(updated);}else{await putComments(updated);}
  }

  function login(){
    if(passVal===ADMIN_PASSWORD){setIsAdmin(true);setShowPass(false);setPassVal("");setPassErr("");}
    else setPassErr("Yanlis sifre!");
  }

  const filtered=films.filter(f=>f.title.toLowerCase().includes(search.toLowerCase())||(f.director||"").toLowerCase().includes(search.toLowerCase()));
  const allC=films.flatMap(f=>(comments[f.id]||[]).map(c=>({...c,filmTitle:f.title,filmId:f.id}))).sort((a,b)=>b.ts-a.ts);

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
            {isAdmin&&<button className="ubtn" disabled={updating} onClick={updateFilms}>{updating?"Yukleniyor...":"Filmleri Guncelle"}</button>}
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
              <div className="hpre">— Gercek Zamanli Film Arsivi —</div>
              <h1 className="htitle">Sinema <em>Kulubu</em></h1>
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
            {updating&&<div className="updating">Filmler guncelleniyor, lutfen bekleyin...</div>}
            {tab==="Filmler"&&(
              loading
                ? <div className="loading">Filmler yukleniyor...</div>
                : <div className="grid">
                    {filtered.map(f=><FilmCard key={f.id} f={f} comments={comments} onClick={()=>setFilm(f)}/>)}
                  </div>
            )}
            {tab==="Tum Yorumlar"&&(
              <div style={{maxWidth:660,margin:"0 auto",paddingBottom:60}}>
                <div className="stitle">Tum Yorumlar {allC.length>0&&`(${allC.length})`}</div>
                {allC.length===0
                  ?<div style={{textAlign:"center",padding:"48px 0",fontFamily:"'IM Fell English',serif",fontStyle:"italic",color:"rgba(240,232,208,.22)"}}>Henuz kalem kipirdamamis...</div>
                  :allC.map(c=>(
                    <div key={c.id} className="ccard">
                      <div className="ftag" onClick={()=>setFilm(films.find(f=>f.id===c.filmId))}>{c.filmTitle}</div>
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
          <FilmDetail film={film} comments={comments} isAdmin={isAdmin} onComment={handleComment}/>
        )}
      </div>
    </>
  );
}
