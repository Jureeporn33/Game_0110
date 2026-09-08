import React,{useEffect,useState} from "react";
import{createRoot}from"react-dom/client";
import{Shield,Users,Trophy,Play,RotateCcw,MonitorSmartphone,ChevronRight,LockKeyhole,Home,Radio}from"lucide-react";
import"./style.css";

const QS=[
["AND","1","1","1"],["AND","1010","1100","1000"],["OR","0","1","1"],["OR","1010","0101","1111"],
["XOR","1","0","1"],["XOR","1010","1100","0110"],["XOR","01000001","00110101","01110100"],
["AND","1110","1011","1010"],["OR","10010010","00101101","10111111"],["XOR","11010110","01101001","10111111"]
].map((x,i)=>({id:i+1,op:x[0],a:x[1],b:x[2],answer:x[3]}));

const STORE="clq-v2-results";
const getResults=()=>JSON.parse(localStorage.getItem(STORE)||"[]");
const saveResult=r=>localStorage.setItem(STORE,JSON.stringify([...getResults(),r]));

function App(){
 const [mode,setMode]=useState("home");
 return <div className="app"><Bg/><Header go={()=>setMode("home")}/>
 {mode==="home"&&<HomeScreen setMode={setMode}/>}
 {mode==="play"&&<PlayerFlow exit={()=>setMode("home")}/>}
 {mode==="host"&&<Host exit={()=>setMode("home")}/>}
 </div>
}
function Header({go}){return <header><button className="logo" onClick={go}><Shield/> CYBER LOGIC QUEST</button><span><Radio size={14}/> MOBILE TRAINING</span></header>}
function HomeScreen({setMode}){return <main className="home">
 <section className="glass hero"><div className="kicker">20-MINUTE CYBER BASE • PAIR MODE</div><h1>คิดเป็นบิต<br/><em>พิชิตรหัสลับ</em></h1>
 <p>AND • OR • XOR • ASCII — ออกแบบสำหรับนักเรียนจับคู่เล่นบนมือถือและ iPad</p>
 <div className="homeBtns"><button className="primary" onClick={()=>setMode("play")}><Play/> เข้าเล่นเกม</button><button className="secondary" onClick={()=>setMode("host")}><Trophy/> Host / คะแนน</button></div>
 <div className="facts"><span><Users/> 5–6 คู่ / รอบ</span><span><MonitorSmartphone/> Mobile First</span><span>⏱ 20 นาที</span></div></section>
 </main>}
function PlayerFlow({exit}){
 const [stage,setStage]=useState("join"),[p1,setP1]=useState(""),[p2,setP2]=useState(""),[round,setRound]=useState("1"),[pair,setPair]=useState("");
 const [qi,setQi]=useState(0),[bits,setBits]=useState([]),[score,setScore]=useState(0),[correct,setCorrect]=useState(0),[combo,setCombo]=useState(0),[msg,setMsg]=useState(null);
 const [ascii,setAscii]=useState(0);
 const [asciiStep,setAsciiStep]=useState(1);
 const [asciiBits,setAsciiBits]=useState(Array(8).fill("0"));
 const [asciiChoice,setAsciiChoice]=useState("");
 const q=QS[qi];
 useEffect(()=>{if(q)setBits(Array(q.answer.length).fill("0"))},[qi,stage]);
 const submit=()=>{let ans=bits.join(""),ok=ans===q.answer;if(ok){setScore(s=>s+100+Math.min(combo*20,100));setCorrect(c=>c+1);setCombo(c=>c+1)}else setCombo(0);setMsg(ok?"ถูกต้อง!":"ยังไม่ถูก — คำตอบ "+q.answer)};
 const next=()=>{setMsg(null);if(qi===9)setStage("ascii");else setQi(x=>x+1)};
 const asciiMissions=[
  {cipher:"01110100",key:"00110101",binary:"01000001",answer:"A",choices:[["A","01000001"],["B","01000010"],["C","01000011"],["D","01000100"]]},
  {cipher:"01111110",key:"00110101",binary:"01001011",answer:"K",choices:[["H","01001000"],["I","01001001"],["J","01001010"],["K","01001011"]]}
 ];
 const asciiData=asciiMissions[ascii];
 const toggleAsciiBit=index=>setAsciiBits(old=>old.map((bit,i)=>i===index?(bit==="0"?"1":"0"):bit));
 const checkAsciiXor=()=>{
  if(asciiBits.join("")===asciiData.binary){setMsg(null);setAsciiStep(2)}
  else setMsg("XOR ยังไม่ถูก ลองตรวจทีละบิตอีกครั้ง");
 };
 const selectAscii=choice=>{
  setAsciiChoice(choice);
  if(choice!==asciiData.answer){setMsg("ยังไม่ใช่ ลองเปรียบเทียบ Binary กับตาราง ASCII อีกครั้ง");return}
  setMsg(null);
  if(ascii===0){setScore(s=>s+500);setAscii(1);setAsciiStep(1);setAsciiBits(Array(8).fill("0"));setAsciiChoice("");return}
  const finalScore=score+500;
  saveResult({id:Date.now(),round,pair:pair||"-",players:`${p1} + ${p2}`,score:finalScore,accuracy:correct*10,finished:new Date().toLocaleTimeString("th-TH")});
  setScore(finalScore);setStage("result");
 };
 if(stage==="join")return <main className="screen"><section className="glass card"><div className="kicker">PAIR JOIN</div><h2>พร้อมเริ่มภารกิจ?</h2>
 <Input label="ผู้เล่น 1" v={p1} s={setP1}/><Input label="ผู้เล่น 2" v={p2} s={setP2}/>
 <div className="row"><Input label="รอบ" v={round} s={setRound}/><Input label="คู่ที่" v={pair} s={setPair}/></div>
 <button className="primary full" disabled={!p1||!p2} onClick={()=>setStage("brief")}>เข้าสู่ภารกิจ <ChevronRight/></button></section></main>;
 if(stage==="brief")return <main className="screen"><section className="glass card centerText"><div className="kicker">MISSION BRIEF</div><h2>LOGIC GATE CHALLENGE</h2><p>{p1} + {p2}</p>
 <div className="rules"><div><b>AND</b><small>ทั้งคู่ 1 → 1</small></div><div><b>OR</b><small>มี 1 → 1</small></div><div><b>XOR</b><small>ต่างกัน → 1</small></div></div>
 <button className="primary full" onClick={()=>setStage("logic")}><Play/> เริ่ม 10 ด่าน</button></section></main>;
 if(stage==="logic")return <main className="playScreen"><Hud qi={qi} score={score} combo={combo}/>
 <section className="glass gameCard"><div className={"gateTag "+q.op.toLowerCase()}>{q.op} GATE</div><h2>MISSION {qi+1}/10</h2>
 <div className="verticalGate"><Node title="INPUT A" value={q.a}/><div className="flow">↓</div><div className={"gate "+q.op.toLowerCase()}>{q.op}</div><div className="flow">↑</div><Node title="INPUT B" value={q.b}/><div className="flow pulse">↓ OUTPUT</div></div>
 <BitPicker bits={bits} setBits={setBits}/>
 {!msg?<button className="primary full" onClick={submit}>⚡ EXECUTE</button>:<div className={msg==="ถูกต้อง!"?"ok feedback":"bad feedback"}><b>{msg}</b><button onClick={next}>NEXT →</button></div>}
 </section></main>;
 if(stage==="ascii")return <main className="playScreen"><section className="glass gameCard centerText">
  <div className="kicker">XOR ASCII • MISSION {ascii+1}/2</div><LockKeyhole size={48} className="cyan"/><h2>SECRET MISSION</h2>
  <p>{ascii===0?p1:p2} = ENCODER • {ascii===0?p2:p1} = DECODER</p>
  {asciiStep===1&&<>
   <div className="asciiStepTitle">STEP 1 — ถอดรหัสด้วย XOR</div>
   <div className="cipher"><span>ENCRYPTED DATA</span><b>{asciiData.cipher}</b><i>XOR</i><span>SECRET KEY</span><b>{asciiData.key}</b></div>
   <p className="help">💡 XOR : เหมือนกัน = 0 • ต่างกัน = 1</p>
   <div className="outputLabel">OUTPUT — แตะตัวเลขเพื่อเปลี่ยน 0 ↔ 1</div>
   <div className="bits asciiBits">{asciiBits.map((bit,index)=><button key={index} onClick={()=>toggleAsciiBit(index)}>{bit}</button>)}</div>
   {msg&&<div className="badText">{msg}</div>}
   <button className="primary full" onClick={checkAsciiXor}>⚡ CHECK XOR</button>
  </>}
  {asciiStep===2&&<>
   <div className="successBox"><span>✓ XOR COMPLETE</span><strong>{asciiData.binary}</strong></div>
   <div className="asciiStepTitle">STEP 2 — Binary นี้คือตัวอักษรอะไร?</div>
   <p className="help">💡 ASCII ใช้ Binary แทนตัวอักษร — ไม่ต้องจำ ให้เทียบจากตัวเลือกด้านล่าง</p>
   <div className="asciiTable">{asciiData.choices.map(([character,binary])=><button key={character} className={asciiChoice===character?"selected":""} onClick={()=>selectAscii(character)}><strong>{character}</strong><span>{binary}</span></button>)}</div>
   {msg&&<div className="badText">{msg}</div>}
  </>}
 </section></main>;
 return <main className="screen"><section className="glass card result centerText"><Trophy size={70}/><div className="kicker">MISSION COMPLETE</div><h2>{p1} + {p2}</h2><div className="bigScore">{score}<small>POINTS</small></div><p>Logic Accuracy {correct*10}% • Round {round}</p><button className="primary full" onClick={exit}><Home/> กลับหน้าหลัก</button></section></main>
}
function Host(){
 const [results,setResults]=useState(getResults()),[filter,setFilter]=useState("1");
 useEffect(()=>{const t=setInterval(()=>setResults(getResults()),800);return()=>clearInterval(t)},[]);
 const rounds=[...new Set(results.map(x=>x.round))].sort();
 const shown=results.filter(x=>x.round===filter).sort((a,b)=>b.score-a.score||b.accuracy-a.accuracy);
 const clear=()=>{if(confirm("ล้างผลคะแนนทั้งหมดบนเครื่องนี้?")){localStorage.removeItem(STORE);setResults([])}};
 return <main className="host"><section className="glass hostCard"><div className="hostTop"><div><div className="kicker">HOST DASHBOARD • LOCAL PROTOTYPE</div><h2>Leaderboard ประจำรอบ</h2></div><button className="danger" onClick={clear}><RotateCcw/> Reset</button></div>
 <div className="rounds">{(rounds.length?rounds:["1"]).map(r=><button className={filter===r?"active":""} onClick={()=>setFilter(r)} key={r}>ROUND {r}</button>)}</div>
 <div className="leader">{shown.length===0?<div className="empty">ยังไม่มีคู่ที่จบเกมใน Round {filter}<small>Prototype Local: คะแนนจะปรากฏเมื่อเล่นบน browser เครื่องเดียวกัน</small></div>:shown.map((r,i)=><div className={"rank "+(i<3?"top":"")} key={r.id}><strong>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"#"+(i+1)}</strong><div><b>{r.players}</b><small>PAIR {r.pair} • Accuracy {r.accuracy}% • {r.finished}</small></div><em>{r.score}</em></div>)}</div>
 <div className="prototypeNote"><b>ขั้นทดสอบ Local</b> Host Dashboard V2 ใช้ localStorage ก่อน เพื่อทดสอบ flow/หน้าตา เมื่อยืนยัน UX แล้วค่อยเชื่อมฐานข้อมูลกลางเพื่อรับคะแนนจากมือถือหลายเครื่องแบบ realtime</div>
 </section></main>
}
function Input({label,v,s}){return <label className="input"><span>{label}</span><input value={v} onChange={e=>s(e.target.value)} placeholder={label}/></label>}
function Hud({qi,score,combo}){return <><div className="hud"><span>MISSION <b>{qi+1}/10</b></span><span>SCORE <b>{score}</b></span><span>🔥 ×{combo}</span></div><div className="bar"><i style={{width:(qi+1)*10+"%"}}/></div></>}
function Node({title,value}){return <div className="node"><small>{title}</small><b>{value}</b></div>}
function BitPicker({bits,setBits}){return <div><div className="outputLabel">แตะบิตเพื่อเปลี่ยน OUTPUT</div><div className="bits">{bits.map((b,i)=><button key={i} onClick={()=>setBits(x=>x.map((v,j)=>j===i?(v==="0"?"1":"0"):v))}>{b}</button>)}</div></div>}
function Bg(){return <div className="bg"><div className="grid"/><div className="glow"/></div>}
createRoot(document.getElementById("root")).render(<App/>);
