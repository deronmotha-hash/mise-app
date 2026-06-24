import { useState, useEffect, useMemo, useCallback } from "react";

{
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
  const mv = document.querySelector('meta[name="viewport"]');
  if (mv) mv.content = "width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no";
  const st = document.createElement("style");
  st.textContent = `*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}html,body{margin:0;padding:0;height:100%;overflow:hidden}#root{height:100%}`;
  document.head.appendChild(st);
}

const T = {
  brand500:"#4F46E5",brand700:"#3730A3",brand100:"#EEF2FF",brand50:"#F5F3FF",
  ink900:"#111827",ink500:"#6B7280",ink400:"#9CA3AF",ink300:"#D1D5DB",
  ink200:"#E5E7EB",ink100:"#F3F4F6",ink50:"#F9FAFB",ink0:"#FFFFFF",
  border:"#F0F0F0",borderInput:"#E5E7EB",divider:"#F5F5F5",
  danger:"#EF4444",dangerTint:"#FFF5F5",dangerBorder:"#FECACA",
  r:{xs:6,sm:10,md:12,lg:16,xl:20,pill:999},
  shadow:{sm:"0 1px 4px rgba(0,0,0,0.08)",md:"0 4px 16px rgba(0,0,0,0.10)"},
  font:{sans:'"Geist",system-ui,sans-serif'},
};

const SLOT = {
  Breakfast:{bg:"#FEF9C3",text:"#854D0E",border:"#FDE047"},
  Lunch:    {bg:"#DCFCE7",text:"#166534",border:"#86EFAC"},
  Dinner:   {bg:"#DBEAFE",text:"#1E40AF",border:"#93C5FD"},
  Snack:    {bg:"#FCE7F3",text:"#9D174D",border:"#F9A8D4"},
};

const PATHS = {
  calendar:'<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M16 3v4M8 3v4M4 11h16"/>',
  book:'<path d="M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6v13M12 6v13M21 6v13"/>',
  "shopping-cart":'<path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/><path d="M17 17H6V3H4M6 5l14 1-1 7H6"/>',
  "clipboard-list":'<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z"/><path d="M9 12h.01M13 12h2M9 16h.01M13 16h2"/>',
  settings:'<path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
  edit:'<path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97l-8.415 8.385v3h3l8.385-8.415z"/><path d="M16 5l3 3"/>',
  x:'<path d="M18 6L6 18M6 6l12 12"/>',
  check:'<path d="M5 12l5 5L20 7"/>',
  search:'<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0"/><path d="M21 21l-6-6"/>',
  "chevron-down":'<path d="M6 9l6 6 6-6"/>',
  "chevron-up":'<path d="M6 15l6-6 6 6"/>',
  "chevron-left":'<path d="M15 6l-6 6 6 6"/>',
  "chevron-right":'<path d="M9 6l6 6-6 6"/>',
  "eye-off":'<path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"/><path d="M16.681 16.673A8.717 8.717 0 0 1 12 18c-3.6 0-6.6-2-9-6 1.272-2.12 2.712-3.678 4.32-4.674m2.86-1.146A9.055 9.055 0 0 1 12 6c3.6 0 6.6 2 9 6-.666 1.11-1.379 2.067-2.138 2.87"/><path d="M3 3l18 18"/>',
  "calendar-plus":'<path d="M12.5 21H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5"/><path d="M16 3v4M8 3v4M4 11h16M16 19h6M19 16v6"/>',
  "arrow-left":'<path d="M5 12h14M5 12l6 6M5 12l6-6"/>',
  "arrow-right":'<path d="M5 12h14M13 6l6 6-6 6"/>',
  "chef-hat":'<path d="M12 3a5 5 0 0 1 4.546 2.914a5 5 0 0 1 5.454 4.586a4.99 4.99 0 0 1-2 4v1a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-1a4.99 4.99 0 0 1-2-4a5 5 0 0 1 5.454-4.586a5 5 0 0 1 4.546-2.914z"/><path d="M8 19v2M12 19v2M16 19v2"/>',
  bookmark:'<path d="M18 7v14l-6-4-6 4V7a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4z"/>',
  download:'<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/>',
};

function Icon({ name, size=16, color="currentColor", ariaLabel }) {
  const p = PATHS[name];
  if (!p) return <span style={{display:"inline-block",width:size,height:size,border:"1px dashed #ef4444",borderRadius:3}}/>;
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",flexShrink:0,verticalAlign:"-0.15em"}} aria-label={ariaLabel} aria-hidden={!ariaLabel} dangerouslySetInnerHTML={{__html:p}}/>;
}

const Inp = { width:"100%",padding:"10px 14px",border:`1.5px solid ${T.borderInput}`,borderRadius:T.r.md,fontSize:14,boxSizing:"border-box",background:T.ink50,color:T.ink900,outline:"none",fontFamily:"inherit" };

function Btn({ variant="primary", children, onClick, disabled, style, ariaLabel }) {
  const base = { display:"inline-flex",alignItems:"center",gap:6,fontFamily:T.font.sans,fontWeight:500,fontSize:14,borderRadius:T.r.md,cursor:disabled?"not-allowed":"pointer",border:"none",opacity:disabled?0.4:1 };
  const vs = { primary:{background:T.brand500,color:T.ink0,padding:"10px 18px"}, ghost:{background:"none",color:T.ink900,border:`1.5px solid ${T.borderInput}`,padding:"8px 14px"}, danger:{background:"none",color:T.danger,border:`1.5px solid ${T.dangerBorder}`,padding:"8px 14px"} };
  return <button onClick={onClick} disabled={disabled} aria-label={ariaLabel} style={{...base,...(vs[variant]||vs.primary),...style}}>{children}</button>;
}

function IconBtn({ variant="default", size=34, icon, onClick, ariaLabel, style }) {
  const vs = { default:{borderColor:T.borderInput,color:T.ink500,bg:"none"}, danger:{borderColor:T.dangerBorder,color:T.danger,bg:T.dangerTint}, accent:{borderColor:T.brand500,color:T.brand500,bg:T.brand100}, ghost:{borderColor:"transparent",color:T.ink400,bg:"none"} };
  const v = vs[variant]||vs.default;
  return <button onClick={onClick} aria-label={ariaLabel} style={{width:size,height:size,border:variant==="ghost"?"none":`1.5px solid ${v.borderColor}`,borderRadius:T.r.sm,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:v.color,background:v.bg,flexShrink:0,...style}}><Icon name={icon} size={Math.round(size*0.47)}/></button>;
}

function SlotPill({ slot }) {
  const c = SLOT[slot]||{bg:T.ink100,text:T.ink500,border:T.ink300};
  return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 10px",borderRadius:T.r.xl,fontSize:11,fontWeight:500,background:c.bg,color:c.text,border:`1px solid ${c.border}`,fontFamily:T.font.sans}}>{slot}</span>;
}
function Tag({ children, accent }) {
  return <span style={{fontSize:11,padding:"2px 8px",borderRadius:T.r.xl,fontWeight:500,background:accent?T.brand100:T.ink100,color:accent?T.brand700:T.ink500,fontFamily:T.font.sans}}>{children}</span>;
}
function Card({ children, accent, style }) {
  return <div style={{background:T.ink0,border:`${accent?`1.5px solid ${T.brand500}`:`1px solid ${T.border}`}`,borderRadius:T.r.lg,padding:"14px 16px",marginBottom:12,...style}}>{children}</div>;
}
function Eyebrow({ children, style }) {
  return <p style={{margin:0,fontFamily:T.font.sans,fontSize:11,fontWeight:500,color:T.ink400,letterSpacing:"0.08em",textTransform:"uppercase",...style}}>{children}</p>;
}
function Label({ htmlFor, children }) {
  return <label htmlFor={htmlFor} style={{display:"block",margin:"0 0 4px",fontFamily:T.font.sans,fontSize:11,fontWeight:500,color:T.ink400,letterSpacing:"0.08em",textTransform:"uppercase"}}>{children}</label>;
}
function PageHeader({ eyebrow, title, action }) {
  return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}><div>{eyebrow&&<Eyebrow>{eyebrow}</Eyebrow>}<h1 style={{margin:0,fontFamily:T.font.sans,fontSize:22,fontWeight:500,color:T.ink900}}>{title}</h1></div>{action}</div>;
}
function StatCard({ label, value }) {
  return <div style={{background:T.ink50,borderRadius:T.r.lg,padding:"14px 16px"}}><Eyebrow>{label}</Eyebrow><p style={{margin:"4px 0 0",fontFamily:T.font.sans,fontSize:28,fontWeight:500,color:T.ink900}}>{value}</p></div>;
}
function ProgressBar({ value }) {
  return <div style={{height:6,borderRadius:T.r.pill,background:T.ink100,overflow:"hidden",marginBottom:20}}><div style={{height:"100%",borderRadius:T.r.pill,background:T.brand500,width:`${Math.round(value*100)}%`,transition:"width 0.3s"}}/></div>;
}
function PillToggle({ options, value, onChange }) {
  return <div style={{display:"flex",gap:4,background:T.ink100,borderRadius:T.r.md,padding:4}}>{options.map(o=><button key={o.id} onClick={()=>onChange(o.id)} aria-pressed={value===o.id} style={{flex:1,padding:"7px 0",border:"none",borderRadius:T.r.sm,fontSize:13,fontWeight:value===o.id?500:400,cursor:"pointer",fontFamily:"inherit",background:value===o.id?T.ink0:"transparent",color:value===o.id?T.brand700:T.ink500,boxShadow:value===o.id?T.shadow.sm:"none",transition:"all 0.15s"}}>{o.label}</button>)}</div>;
}
function Stepper({ value, onChange, min=1 }) {
  return <div style={{display:"flex",alignItems:"center",gap:8}}>
    <button onClick={()=>onChange(Math.max(min,value-1))} style={{width:32,height:32,borderRadius:T.r.sm,border:`1.5px solid ${T.borderInput}`,background:T.ink0,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",color:T.ink900,fontFamily:"inherit"}}>−</button>
    <span style={{fontSize:16,fontWeight:500,minWidth:24,textAlign:"center",fontFamily:T.font.sans}}>{value}</span>
    <button onClick={()=>onChange(value+1)} style={{width:32,height:32,borderRadius:T.r.sm,border:`1.5px solid ${T.borderInput}`,background:T.ink0,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",color:T.ink900,fontFamily:"inherit"}}>+</button>
  </div>;
}

function SmartIngredientInput({ directory, onAdd, onSaveToDirectory, placeholder }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const hits = useMemo(() => q.trim() ? directory.filter(d => d.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [], [q, directory]);

  const selectItem = (d) => { onAdd(d); setQ(""); setOpen(false); };
  const addFreeText = () => {
    const trimmed = q.trim(); if (!trimmed) return;
    const existing = directory.find(d => d.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) { selectItem(existing); return; }
    const newItem = { id: uuid(), name: trimmed, qty: "", unit: "", cat: "Other" };
    onAdd(newItem);
    if (onSaveToDirectory) onSaveToDirectory({ name: trimmed, unit: "", cat: "Other" });
    setQ(""); setOpen(false);
  };

  return (
    <div style={{ position: "relative", zIndex: 30 }}>
      <input style={Inp} placeholder={placeholder || "Search or type an ingredient..."}
        value={q}
        onChange={e => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={e => {
          if (e.key === "Enter" && q.trim()) {
            e.preventDefault();
            if (hits.length > 0) selectItem(hits[0]);
            else addFreeText();
          }
        }}
      />
      {open && hits.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 9999, borderRadius: T.r.md, overflow: "hidden", border: `1px solid ${T.borderInput}`, backgroundColor: T.ink0, boxShadow: T.shadow.md }}>
          {hits.map(d => (
            <div key={d.id} onMouseDown={e => { e.preventDefault(); selectItem(d); }}
              style={{ padding: "10px 14px", fontSize: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.divider}`, backgroundColor: T.ink0, fontFamily: T.font.sans }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = T.ink50}
              onMouseOut={e => e.currentTarget.style.backgroundColor = T.ink0}>
              <span style={{ color: T.ink900 }}>{d.name}</span>
              <span style={{ fontSize: 12, color: T.ink400 }}>{d.cat}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const DEFAULT_MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack"];
const CAT_ORDER = ["Produce","Meat","Fish","Dairy","Bakery","Dry Goods","Canned Goods","Condiments","Other"];
const uuid = ()=>crypto.randomUUID();

const BUILT_IN_RECIPES = [
  { id:"r1", name:"Spaghetti Bolognese", category:"Pasta", servings:4,
    steps:["Fry diced onion and garlic in olive oil over medium heat until soft, about 5 minutes.","Add beef mince and brown all over, breaking up lumps with a spoon.","Stir in tinned tomatoes, season well, and simmer on low for 25–30 minutes.","Cook spaghetti per packet instructions. Drain and serve topped with the sauce."],
    ingredients:[{id:"i1",name:"Spaghetti",qty:400,unit:"g",cat:"Dry Goods"},{id:"i2",name:"Beef mince",qty:500,unit:"g",cat:"Meat"},{id:"i3",name:"Tinned tomatoes",qty:800,unit:"g",cat:"Canned Goods"},{id:"i4",name:"Onion",qty:2,unit:"",cat:"Produce"},{id:"i5",name:"Garlic",qty:4,unit:"cloves",cat:"Produce"},{id:"i6",name:"Olive oil",qty:2,unit:"tbsp",cat:"Condiments"},{id:"i7",name:"Parmesan",qty:40,unit:"g",cat:"Dairy"}]},
  { id:"r2", name:"Chicken Stir Fry", category:"Asian", servings:4,
    steps:["Slice chicken into strips and season lightly with salt and pepper.","Heat a wok over high heat and stir-fry chicken until cooked through, about 5 minutes. Set aside.","Add broccoli and bell pepper; stir-fry 3–4 minutes until just tender.","Return chicken, pour in soy sauce and sesame oil, toss together. Serve over steamed rice."],
    ingredients:[{id:"i8",name:"Chicken breast",qty:600,unit:"g",cat:"Meat"},{id:"i9",name:"Broccoli",qty:300,unit:"g",cat:"Produce"},{id:"i10",name:"Bell pepper",qty:2,unit:"",cat:"Produce"},{id:"i11",name:"Soy sauce",qty:4,unit:"tbsp",cat:"Condiments"},{id:"i12",name:"Garlic",qty:3,unit:"cloves",cat:"Produce"},{id:"i13",name:"Rice",qty:320,unit:"g",cat:"Dry Goods"},{id:"i14",name:"Sesame oil",qty:1,unit:"tbsp",cat:"Condiments"}]},
  { id:"r3", name:"Avocado Toast", category:"Breakfast", servings:2,
    steps:["Toast bread until golden and crisp.","Halve and pit avocados; scoop flesh into a bowl, add lemon juice, salt and pepper, and mash.","Spread generously over toast.","Finish with chilli flakes and a drizzle of olive oil."],
    ingredients:[{id:"i15",name:"Sourdough bread",qty:4,unit:"slices",cat:"Bakery"},{id:"i16",name:"Avocado",qty:2,unit:"",cat:"Produce"},{id:"i17",name:"Lemon",qty:1,unit:"",cat:"Produce"},{id:"i18",name:"Chilli flakes",qty:0.5,unit:"tsp",cat:"Condiments"},{id:"i19",name:"Olive oil",qty:1,unit:"tbsp",cat:"Condiments"}]},
  { id:"r4", name:"Caesar Salad", category:"Salad", servings:4,
    steps:["Grill or pan-fry chicken breasts until cooked through, about 6–7 minutes each side. Rest 5 minutes then slice.","Tear romaine lettuce into a large bowl. Add croutons and Parmesan shavings.","Add sliced chicken on top.","Drizzle generously with Caesar dressing and toss to coat."],
    ingredients:[{id:"i20",name:"Romaine lettuce",qty:2,unit:"heads",cat:"Produce"},{id:"i21",name:"Parmesan",qty:80,unit:"g",cat:"Dairy"},{id:"i22",name:"Caesar dressing",qty:6,unit:"tbsp",cat:"Condiments"},{id:"i23",name:"Croutons",qty:100,unit:"g",cat:"Bakery"},{id:"i24",name:"Chicken breast",qty:500,unit:"g",cat:"Meat"}]},
  { id:"r5", name:"Vegetable Curry", category:"Indian", servings:4,
    steps:["Fry onion in oil until golden, about 8 minutes. Add garlic and ginger; cook 2 minutes. Add curry powder and stir for 1 minute.","Pour in tinned tomatoes and coconut milk; stir and bring to a simmer.","Add chickpeas and cook uncovered 15–20 minutes until sauce thickens.","Season and serve over steamed rice."],
    ingredients:[{id:"i25",name:"Chickpeas",qty:800,unit:"g",cat:"Canned Goods"},{id:"i26",name:"Tinned tomatoes",qty:400,unit:"g",cat:"Canned Goods"},{id:"i27",name:"Onion",qty:2,unit:"",cat:"Produce"},{id:"i28",name:"Garlic",qty:4,unit:"cloves",cat:"Produce"},{id:"i29",name:"Curry powder",qty:2,unit:"tbsp",cat:"Condiments"},{id:"i30",name:"Coconut milk",qty:400,unit:"ml",cat:"Canned Goods"},{id:"i31",name:"Rice",qty:320,unit:"g",cat:"Dry Goods"},{id:"i32",name:"Fresh ginger",qty:1,unit:"tbsp",cat:"Produce"}]},
  { id:"r6", name:"Pancakes", category:"Breakfast", servings:4,
    steps:["Whisk flour and a pinch of salt. Make a well, add eggs and half the milk, whisk smooth. Add remaining milk. Rest 10 minutes.","Heat a non-stick pan over medium heat and brush with melted butter.","Pour in a small ladleful of batter, swirl to cover base, cook 1–2 minutes until edges lift. Flip and cook 30 seconds more.","Repeat with remaining batter. Serve with toppings of your choice."],
    ingredients:[{id:"i33",name:"Plain flour",qty:200,unit:"g",cat:"Dry Goods"},{id:"i34",name:"Milk",qty:400,unit:"ml",cat:"Dairy"},{id:"i35",name:"Eggs",qty:2,unit:"",cat:"Dairy"},{id:"i36",name:"Butter",qty:30,unit:"g",cat:"Dairy"}]},
  { id:"r7", name:"Grilled Salmon", category:"Fish", servings:4,
    steps:["Pat salmon dry. Mix olive oil, lemon juice, and crushed garlic; brush over fillets. Season well.","Heat a griddle pan over high heat. Cook salmon skin-side down for 4–5 minutes without moving.","Flip and cook 2–3 more minutes until just cooked through.","Steam or griddle asparagus 3–4 minutes. Serve alongside with lemon wedges."],
    ingredients:[{id:"i37",name:"Salmon fillet",qty:600,unit:"g",cat:"Fish"},{id:"i38",name:"Lemon",qty:2,unit:"",cat:"Produce"},{id:"i39",name:"Garlic",qty:2,unit:"cloves",cat:"Produce"},{id:"i40",name:"Olive oil",qty:2,unit:"tbsp",cat:"Condiments"},{id:"i41",name:"Asparagus",qty:400,unit:"g",cat:"Produce"}]},
  { id:"r8", name:"Beef Tacos", category:"Mexican", servings:4,
    steps:["Brown beef mince over high heat; drain fat. Add taco seasoning and 100ml water; simmer 3–4 minutes.","Warm taco shells in oven at 180°C for 3–4 minutes.","Prep toppings: shred lettuce, dice tomatoes, grate cheese.","Fill shells with beef and top with lettuce, tomato, cheese, and sour cream."],
    ingredients:[{id:"i42",name:"Beef mince",qty:500,unit:"g",cat:"Meat"},{id:"i43",name:"Taco shells",qty:12,unit:"",cat:"Bakery"},{id:"i44",name:"Cheddar cheese",qty:120,unit:"g",cat:"Dairy"},{id:"i45",name:"Iceberg lettuce",qty:0.5,unit:"head",cat:"Produce"},{id:"i46",name:"Tomato",qty:3,unit:"",cat:"Produce"},{id:"i47",name:"Sour cream",qty:150,unit:"ml",cat:"Dairy"},{id:"i48",name:"Taco seasoning",qty:2,unit:"tbsp",cat:"Condiments"}]},
  { id:"r9", name:"Mushroom Risotto", category:"Italian", servings:4,
    steps:["Warm stock in a saucepan. Melt butter in a wide pan and fry onion until soft, about 8 minutes. Add garlic and mushrooms; cook until tender.","Add rice and stir 2 minutes to toast. Pour in white wine and stir until absorbed.","Add warm stock one ladleful at a time, stirring continuously, until rice is creamy and al dente — about 18–20 minutes.","Remove from heat, stir in Parmesan and a knob of butter. Season and rest 2 minutes."],
    ingredients:[{id:"i49",name:"Arborio rice",qty:320,unit:"g",cat:"Dry Goods"},{id:"i50",name:"Chestnut mushrooms",qty:400,unit:"g",cat:"Produce"},{id:"i51",name:"Onion",qty:1,unit:"",cat:"Produce"},{id:"i52",name:"Garlic",qty:3,unit:"cloves",cat:"Produce"},{id:"i53",name:"Parmesan",qty:80,unit:"g",cat:"Dairy"},{id:"i54",name:"Vegetable stock",qty:1200,unit:"ml",cat:"Canned Goods"},{id:"i55",name:"Butter",qty:60,unit:"g",cat:"Dairy"},{id:"i56",name:"White wine",qty:150,unit:"ml",cat:"Condiments"}]},
  { id:"r10", name:"Greek Salad", category:"Salad", servings:4,
    steps:["Chop cucumber, tomatoes, and red onion into chunky bite-size pieces.","Combine in a large bowl with olives and crumbled feta.","Drizzle with olive oil, add dried oregano, season with salt and pepper.","Toss gently and serve immediately."],
    ingredients:[{id:"i57",name:"Cucumber",qty:1,unit:"",cat:"Produce"},{id:"i58",name:"Tomato",qty:4,unit:"",cat:"Produce"},{id:"i59",name:"Feta cheese",qty:200,unit:"g",cat:"Dairy"},{id:"i60",name:"Kalamata olives",qty:80,unit:"g",cat:"Canned Goods"},{id:"i61",name:"Red onion",qty:1,unit:"",cat:"Produce"},{id:"i62",name:"Olive oil",qty:3,unit:"tbsp",cat:"Condiments"},{id:"i63",name:"Dried oregano",qty:1,unit:"tsp",cat:"Condiments"}]},
];

const SEED_DIR = [
  {id:"d1",name:"Onion",unit:"",cat:"Produce"},{id:"d2",name:"Garlic",unit:"cloves",cat:"Produce"},{id:"d3",name:"Tomato",unit:"",cat:"Produce"},{id:"d4",name:"Lemon",unit:"",cat:"Produce"},{id:"d5",name:"Broccoli",unit:"g",cat:"Produce"},{id:"d6",name:"Spinach",unit:"g",cat:"Produce"},{id:"d7",name:"Carrot",unit:"",cat:"Produce"},{id:"d8",name:"Potato",unit:"",cat:"Produce"},{id:"d9",name:"Cucumber",unit:"",cat:"Produce"},{id:"d10",name:"Bell pepper",unit:"",cat:"Produce"},
  {id:"d11",name:"Chicken breast",unit:"g",cat:"Meat"},{id:"d12",name:"Beef mince",unit:"g",cat:"Meat"},{id:"d13",name:"Bacon",unit:"rashers",cat:"Meat"},{id:"d14",name:"Sausages",unit:"",cat:"Meat"},{id:"d15",name:"Salmon fillet",unit:"g",cat:"Fish"},{id:"d16",name:"Tuna",unit:"g",cat:"Fish"},
  {id:"d17",name:"Milk",unit:"ml",cat:"Dairy"},{id:"d18",name:"Eggs",unit:"",cat:"Dairy"},{id:"d19",name:"Butter",unit:"g",cat:"Dairy"},{id:"d20",name:"Cheddar cheese",unit:"g",cat:"Dairy"},{id:"d21",name:"Parmesan",unit:"g",cat:"Dairy"},
  {id:"d22",name:"Bread",unit:"slices",cat:"Bakery"},{id:"d23",name:"Wraps",unit:"",cat:"Bakery"},
  {id:"d24",name:"Rice",unit:"g",cat:"Dry Goods"},{id:"d25",name:"Pasta",unit:"g",cat:"Dry Goods"},{id:"d26",name:"Flour",unit:"g",cat:"Dry Goods"},{id:"d27",name:"Oats",unit:"g",cat:"Dry Goods"},
  {id:"d28",name:"Tinned tomatoes",unit:"g",cat:"Canned Goods"},{id:"d29",name:"Chickpeas",unit:"g",cat:"Canned Goods"},{id:"d30",name:"Coconut milk",unit:"ml",cat:"Canned Goods"},
  {id:"d31",name:"Olive oil",unit:"tbsp",cat:"Condiments"},{id:"d32",name:"Soy sauce",unit:"tbsp",cat:"Condiments"},{id:"d33",name:"Salt",unit:"tsp",cat:"Condiments"},{id:"d34",name:"Curry powder",unit:"tbsp",cat:"Condiments"},
];

const mkWeek = (id,label) => ({id,label,days:Object.fromEntries(ALL_DAYS.map(d=>[d,[]]))});
const initRecipe = () => ({name:"",category:"",servings:4,steps:[""],ingredients:[{id:uuid(),name:"",qty:"",unit:"",cat:"Produce"}]});

function getWeekStartDate(weekIndex, weekStartDay) {
  const today = new Date(); today.setHours(0,0,0,0);
  const dayIdx = today.getDay();
  const startIdx = ALL_DAYS.indexOf(weekStartDay);
  const jsStart = startIdx === 6 ? 0 : startIdx + 1;
  const diff = (dayIdx - jsStart + 7) % 7;
  const d = new Date(today); d.setDate(today.getDate() - diff + weekIndex * 7);
  return d;
}
function getDayDate(weekIndex, dayName, weekStartDay) {
  const ws = getWeekStartDate(weekIndex, weekStartDay);
  const offset = orderedDays(weekStartDay).indexOf(dayName);
  const d = new Date(ws); d.setDate(ws.getDate() + offset);
  return d;
}
function formatDayDate(date) { return date.toLocaleDateString("en-GB",{day:"numeric",month:"short"}); }
function isToday(date) {
  const t = new Date();
  return date.getDate()===t.getDate() && date.getMonth()===t.getMonth() && date.getFullYear()===t.getFullYear();
}
function fmtQty(n) {
  if (!n && n!==0) return "";
  const r = Math.round(n*100)/100;
  return r%1===0 ? String(r) : r.toFixed(2).replace(/\.?0+$/,"");
}
function orderedDays(start) {
  const i = ALL_DAYS.indexOf(start);
  return i<=0 ? ALL_DAYS : [...ALL_DAYS.slice(i),...ALL_DAYS.slice(0,i)];
}
function groupEntries(entries) {
  const g = {};
  entries.forEach(e=>{
    if (!g[e.mealType]) g[e.mealType]=[];
    const ex = g[e.mealType].find(x=>x.recipeId===e.recipeId);
    if (ex){ex.portions+=e.portions;ex.entryIds.push(e.entryId);}
    else g[e.mealType].push({...e,entryIds:[e.entryId]});
  });
  return g;
}

function loadStorage() { try{const r=localStorage.getItem("mise_v2");return r?JSON.parse(r):null;}catch{return null;} }
function useAppState() {
  const saved = useMemo(()=>loadStorage(),[]);
  const [weeks,setWeeks] = useState(()=>saved?.weeks||[mkWeek(uuid(),"Week 1")]);
  const [weekStart,setWeekStart] = useState(()=>saved?.weekStart||"Monday");
  const [plannerView,setPlannerView] = useState(()=>saved?.plannerView||"scroll");
  const [customRecipes,setCustomRecipes] = useState(()=>saved?.customRecipes||[]);
  const [customTypes,setCustomTypes] = useState(()=>saved?.customTypes||[]);
  const [checked,setChecked] = useState(()=>saved?.checked||{});
  const [hidden,setHidden] = useState(()=>saved?.hidden||{});
  const [customGrocery,setCustomGrocery] = useState(()=>saved?.customGrocery||[]);
  const [dir,setDir] = useState(()=>saved?.dir||SEED_DIR);
  useEffect(()=>{
    try{localStorage.setItem("mise_v2",JSON.stringify({weeks,weekStart,plannerView,customRecipes,customTypes,checked,hidden,customGrocery,dir}));}catch{/* quota or storage disabled */}
  },[weeks,weekStart,plannerView,customRecipes,customTypes,checked,hidden,customGrocery,dir]);
  return {weeks,setWeeks,weekStart,setWeekStart,plannerView,setPlannerView,customRecipes,setCustomRecipes,customTypes,setCustomTypes,checked,setChecked,hidden,setHidden,customGrocery,setCustomGrocery,dir,setDir};
}

function useGroceryList(weeks,allRecipes,customGrocery) {
  return useMemo(()=>{
    const map={};
    weeks.forEach(w=>Object.values(w.days).forEach(ms=>ms.forEach(entry=>{
      const r=allRecipes.find(x=>x.id===entry.recipeId); if(!r)return;
      r.ingredients.forEach(ing=>{
        if(!ing.name.trim())return;
        const baseQty = parseFloat(String(ing.qty))||0;
        const recipeServings = r.servings||4;
        const scale = entry.portions / recipeServings;
        const qty = baseQty * scale;
        const key=`${ing.name.toLowerCase().trim()}|${(ing.unit||"").toLowerCase().trim()}|${ing.cat}`;
        if(map[key])map[key].qty+=qty; else map[key]={...ing,qty,_key:key,isCustom:false};
      });
    })));
    customGrocery.forEach(it=>{const key=`cg_${it.id}`;map[key]={...it,_key:key,isCustom:true};});
    const byCat={};
    Object.values(map).forEach(it=>{const c=it.cat||"Other";if(!byCat[c])byCat[c]=[];byCat[c].push(it);});
    return byCat;
  },[weeks,allRecipes,customGrocery]);
}

function PlannerPanel({recipe,weeks,allMealTypes,allRecipes,onConfirm,onClose}) {
  const [mt,setMt]=useState("Dinner");
  const [pts,setPts]=useState(1);
  const [wkId,setWkId]=useState(weeks[0]?.id||"");
  const [pending,setPending]=useState(null);
  const wk=weeks.find(w=>w.id===wkId)||weeks[0];
  return (
    <div style={{marginTop:14,borderTop:`1px solid ${T.border}`,paddingTop:14}}>
      <div style={{display:"grid",gridTemplateColumns:weeks.length>1?"1fr 1fr 1fr":"1fr 1fr",gap:10,marginBottom:14}}>
        {weeks.length>1&&<div><Label>Week</Label><select style={{...Inp,padding:"8px 12px"}} value={wkId} onChange={e=>{setWkId(e.target.value);setPending(null);}}>{weeks.map(w=><option key={w.id} value={w.id}>{w.label}</option>)}</select></div>}
        <div><Label>Meal slot</Label><select style={{...Inp,padding:"8px 12px"}} value={mt} onChange={e=>setMt(e.target.value)}>{allMealTypes.map(t=><option key={t}>{t}</option>)}</select></div>
        <div><Label>Portions</Label><div style={{marginTop:4}}><Stepper value={pts} onChange={setPts}/></div></div>
      </div>
      <Eyebrow style={{marginBottom:8}}>Select a day</Eyebrow>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
        {ALL_DAYS.map(day=>{
          const ex=wk?.days[day]||[];
          const ip=pending===day;
          const groupedEx=groupEntries(ex.map((e,i)=>({...e,entryId:e.entryId||`p_${i}`})));
          return (
            <div key={day} style={{border:`1.5px solid ${ip?T.brand500:T.border}`,borderRadius:T.r.md,background:ip?T.brand100:T.ink0,padding:"8px 12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontWeight:500,fontSize:13,minWidth:88,flexShrink:0,fontFamily:T.font.sans,color:ip?T.brand700:T.ink900}}>{day}</span>
                <div style={{flex:1,display:"flex",flexWrap:"wrap",gap:3,minWidth:0}}>
                  {ex.length===0
                    ?<span style={{fontSize:12,color:T.ink400,fontFamily:T.font.sans}}>Empty</span>
                    :Object.entries(groupedEx).map(([type,entries])=>
                        entries.map((e,i)=>(
                          <span key={`${type}_${i}`} style={{display:"inline-flex",alignItems:"center",padding:"2px 10px",borderRadius:T.r.xl,fontSize:11,fontWeight:500,background:(SLOT[type]||{bg:T.ink100}).bg,color:(SLOT[type]||{text:T.ink500}).text,border:`1px solid ${(SLOT[type]||{border:T.ink300}).border}`,fontFamily:T.font.sans}}>
                            {type} · {allRecipes.find(r=>r.id===e.recipeId)?.name||"?"}{e.portions>1?` ×${e.portions}`:""}
                          </span>
                        ))
                      )
                  }
                </div>
                {!ip
                  ?<Btn variant="ghost" style={{padding:"5px 12px",fontSize:12,flexShrink:0}} onClick={()=>setPending(day)}>Add</Btn>
                  :<div style={{display:"flex",gap:6,flexShrink:0}}>
                    <Btn style={{padding:"5px 12px",fontSize:12}} onClick={()=>{onConfirm(wk.id,day,recipe.id,mt,pts);setPending(null);}}>Confirm</Btn>
                    <Btn variant="ghost" style={{padding:"5px 10px",fontSize:12}} onClick={()=>setPending(null)}><Icon name="x" size={14}/></Btn>
                  </div>
                }
              </div>
            </div>
          );
        })}
      </div>
      <Btn variant="ghost" style={{fontSize:13}} onClick={onClose}>Close</Btn>
    </div>
  );
}

function RecipeForm({initial,directory,onSave,onCancel,label,onSaveToDirectory}) {
  const [rec,setRec]=useState(initial);
  const updIng=(idx,field,val)=>setRec(p=>({...p,ingredients:p.ingredients.map((x,i)=>i===idx?{...x,[field]:val}:x)}));
  const updStep=(idx,val)=>setRec(p=>({...p,steps:p.steps.map((s,i)=>i===idx?val:s)}));
  const handleImg=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setRec(p=>({...p,image:ev.target.result}));r.readAsDataURL(f);};
  return (
    <Card accent style={{marginBottom:16}}>
      <p style={{fontWeight:500,fontSize:15,margin:"0 0 12px",fontFamily:T.font.sans}}>{label}</p>
      <div style={{marginBottom:16}}>
        <Label>Recipe photo</Label>
        <div style={{marginTop:4,display:"flex",alignItems:"center",gap:12}}>
          {rec.image?<img src={rec.image} alt="Recipe" style={{width:72,height:72,borderRadius:T.r.md,objectFit:"cover",border:`1px solid ${T.border}`,flexShrink:0}}/>:<div style={{width:72,height:72,borderRadius:T.r.md,background:T.ink100,border:`1.5px dashed ${T.borderInput}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="chef-hat" size={28} color={T.ink400}/></div>}
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <label htmlFor="rec-img" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:T.r.md,border:`1.5px solid ${T.borderInput}`,fontSize:13,fontWeight:500,fontFamily:T.font.sans,cursor:"pointer",color:T.ink900}}><Icon name="plus" size={13}/>{rec.image?"Change photo":"Upload photo"}</label>
            <input id="rec-img" type="file" accept="image/*" style={{display:"none"}} onChange={handleImg}/>
            {rec.image&&<button onClick={()=>setRec(p=>({...p,image:null}))} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:T.r.md,border:`1.5px solid ${T.dangerBorder}`,fontSize:13,cursor:"pointer",color:T.danger,background:"none",fontWeight:500,fontFamily:T.font.sans}}><Icon name="trash" size={13}/>Remove</button>}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
        <div><Label htmlFor="rn">Name</Label><input id="rn" style={{...Inp,padding:"8px 10px"}} value={rec.name} onChange={e=>setRec(p=>({...p,name:e.target.value}))} placeholder="e.g. Pasta..."/></div>
        <div><Label htmlFor="rc">Category</Label><input id="rc" style={{...Inp,padding:"8px 10px"}} value={rec.category} onChange={e=>setRec(p=>({...p,category:e.target.value}))} placeholder="e.g. Italian"/></div>
        <div><Label>Serves</Label><div style={{marginTop:4}}><Stepper value={rec.servings||1} onChange={v=>setRec(p=>({...p,servings:v}))}/></div></div>
      </div>
      <Eyebrow style={{marginBottom:6}}>Ingredients</Eyebrow>
      <div style={{marginBottom:10,position:"relative",zIndex:50}}><SmartIngredientInput directory={directory} onSaveToDirectory={onSaveToDirectory} placeholder="Search directory to add..." onAdd={d=>setRec(p=>({...p,ingredients:[...p.ingredients,{id:uuid(),name:d.name,qty:"",unit:d.unit||"",cat:d.cat||"Produce"}]}))}/></div>
      {rec.ingredients.map((ing,i)=>(
        <div key={ing.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr auto",gap:6,marginBottom:6}}>
          <input style={{...Inp,padding:"8px 10px"}} placeholder="Name" value={ing.name} onChange={e=>updIng(i,"name",e.target.value)}/>
          <input style={{...Inp,padding:"8px 10px"}} placeholder="Qty" value={ing.qty} onChange={e=>updIng(i,"qty",e.target.value)}/>
          <input style={{...Inp,padding:"8px 10px"}} placeholder="Unit" value={ing.unit} onChange={e=>updIng(i,"unit",e.target.value)}/>
          <select style={{...Inp,padding:"8px 6px"}} value={ing.cat} onChange={e=>updIng(i,"cat",e.target.value)}>{CAT_ORDER.map(c=><option key={c}>{c}</option>)}</select>
          <IconBtn variant="danger" size={34} icon="trash" ariaLabel="Remove" onClick={()=>setRec(p=>({...p,ingredients:p.ingredients.filter((_,j)=>j!==i)}))}/>
        </div>
      ))}
      <Btn variant="ghost" style={{fontSize:12,marginBottom:16,padding:"6px 12px"}} onClick={()=>setRec(p=>({...p,ingredients:[...p.ingredients,{id:uuid(),name:"",qty:"",unit:"",cat:"Produce"}]}))}><Icon name="plus" size={13}/>Add row</Btn>
      <Eyebrow style={{marginBottom:6}}>Method</Eyebrow>
      {rec.steps.map((step,i)=>(
        <div key={i} style={{display:"flex",gap:6,marginBottom:6,alignItems:"flex-start"}}>
          <span style={{fontFamily:T.font.sans,fontSize:12,color:T.ink400,fontWeight:500,minWidth:20,paddingTop:11}}>{i+1}.</span>
          <textarea rows={2} style={{...Inp,padding:"8px 10px",resize:"vertical",flex:1}} value={step} onChange={e=>updStep(i,e.target.value)} placeholder={`Step ${i+1}...`}/>
          <IconBtn variant="danger" size={30} icon="trash" ariaLabel="Remove step" onClick={()=>setRec(p=>({...p,steps:p.steps.filter((_,j)=>j!==i)}))} style={{marginTop:4}}/>
        </div>
      ))}
      <Btn variant="ghost" style={{fontSize:12,marginBottom:16,padding:"6px 12px"}} onClick={()=>setRec(p=>({...p,steps:[...p.steps,""]}))}>
        <Icon name="plus" size={13}/>Add step
      </Btn>
      <div style={{display:"flex",gap:8}}>
        <Btn style={{flex:1,justifyContent:"center"}} onClick={()=>onSave(rec)}>Save recipe</Btn>
        <Btn variant="ghost" style={{flex:1,justifyContent:"center"}} onClick={onCancel}>Cancel</Btn>
      </div>
    </Card>
  );
}

function RecipeImporter({directory,onSave,onCancel,onSaveToDirectory}) {
  const [url,setUrl]=useState("");
  const [status,setStatus]=useState("idle");
  const [errorMsg,setErrorMsg]=useState("");
  const [parsed,setParsed]=useState(null);

  const cleanText = (s) => String(s||"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();

  const findRecipeNode = (json) => {
    const nodes = Array.isArray(json) ? json : [json];
    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      const t = node["@type"];
      const types = Array.isArray(t) ? t : [t];
      if (types.includes("Recipe")) return node;
      if (node["@graph"]) {
        const found = findRecipeNode(node["@graph"]);
        if (found) return found;
      }
    }
    return null;
  };

  const parseIngredient = (raw) => {
    const text = cleanText(raw);
    if (!text) return null;
    const unitPattern = /^([\d\s½¼¾⅓⅔⅛⅜⅝⅞/.-]+)?\s*(tsp|teaspoon|teaspoons|tbsp|tablespoon|tablespoons|cup|cups|ml|g|kg|oz|lb|lbs|litre|liter|l|bunch|handful|pinch|slice|slices|clove|cloves|sprig|sprigs|head|heads|rasher|rashers|can|cans|tin|tins|pack|packs|sheet|sheets|sachet|sachets)\.?\s+(.+)/i;
    const m = text.match(unitPattern);
    if (m) return {id:uuid(),qty:(m[1]||"").trim(),unit:m[2].trim().toLowerCase(),name:m[3].trim(),cat:"Other"};
    const m2 = text.match(/^([\d\s½¼¾⅓⅔⅛⅜⅝⅞/.-]+)\s+(.+)/);
    if (m2) return {id:uuid(),qty:m2[1].trim(),unit:"",name:m2[2].trim(),cat:"Other"};
    return {id:uuid(),qty:"",unit:"",name:text,cat:"Other"};
  };

  const flattenInstructions = (ins) => {
    if (!ins) return [];
    if (typeof ins === "string") return ins.split(/\n+|(?<=\.)\s+(?=[A-Z])/).map(cleanText).filter(Boolean);
    if (!Array.isArray(ins)) ins = [ins];
    const out = [];
    for (const step of ins) {
      if (typeof step === "string") { const c = cleanText(step); if (c) out.push(c); continue; }
      if (step?.["@type"] === "HowToSection" && step.itemListElement) {
        out.push(...flattenInstructions(step.itemListElement));
        continue;
      }
      const t = cleanText(step?.text || step?.name);
      if (t) out.push(t);
    }
    return out;
  };

  const handleImport = async () => {
    if (!url.trim()) return;
    setStatus("fetching"); setErrorMsg(""); setParsed(null);

    const target = url.trim();
    const proxies = [
      (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
      (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
    ];

    let html = null;
    for (const build of proxies) {
      try {
        const res = await fetch(build(target), { signal: AbortSignal.timeout(10000) });
        if (!res.ok) continue;
        const text = await res.text();
        if (text && text.length > 1000) { html = text; break; }
      } catch { continue; }
    }

    if (!html) {
      setStatus("error");
      setErrorMsg("Couldn't reach the page. Check the URL or try again in a moment.");
      return;
    }

    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const scripts = doc.querySelectorAll('script[type="application/ld+json"]');

      let recipe = null;
      for (const s of scripts) {
        try {
          const json = JSON.parse(s.textContent.trim());
          recipe = findRecipeNode(json);
          if (recipe) break;
        } catch { continue; }
      }

      if (!recipe) {
        setStatus("error");
        setErrorMsg("No recipe data found on that page. Try a different source — BBC Good Food, NYT Cooking, AllRecipes, Serious Eats all work well.");
        return;
      }

      const name = cleanText(recipe.name) || "Imported recipe";

      let servings = 4;
      let rawYield = recipe.recipeYield;
      if (Array.isArray(rawYield)) rawYield = rawYield[0];
      if (rawYield != null) {
        const yMatch = String(rawYield).match(/\d+/);
        if (yMatch) servings = parseInt(yMatch[0], 10);
      }

      let category = "";
      const cat = recipe.recipeCategory || recipe.recipeCuisine;
      if (cat) category = Array.isArray(cat) ? cleanText(cat[0]) : cleanText(cat);

      let image = null;
      const img = recipe.image;
      if (img) {
        if (typeof img === "string") image = img;
        else if (Array.isArray(img)) image = typeof img[0] === "string" ? img[0] : img[0]?.url;
        else if (img.url) image = img.url;
      }

      const ingArr = recipe.recipeIngredient || recipe.ingredients || [];
      const ingredients = (Array.isArray(ingArr) ? ingArr : [ingArr])
        .map(parseIngredient).filter(Boolean);

      const steps = flattenInstructions(recipe.recipeInstructions);

      if (ingredients.length === 0 && steps.length === 0) {
        setStatus("error");
        setErrorMsg("Found a recipe entry but no ingredients or steps. Try a different URL.");
        return;
      }

      setParsed({
        name, category, servings, image,
        ingredients: ingredients.length ? ingredients : [{id:uuid(),qty:"",unit:"",name:"",cat:"Produce"}],
        steps: steps.length ? steps : [""],
      });
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMsg("Couldn't parse the recipe. The page may be unusual — try a different URL.");
    }
  };

  if (status==="done" && parsed)
    return <RecipeForm initial={parsed} directory={directory} onSaveToDirectory={onSaveToDirectory} label="Imported recipe — review and save" onSave={onSave} onCancel={onCancel}/>;

  return (
    <Card accent style={{marginBottom:16}}>
      <p style={{fontWeight:500,fontSize:15,margin:"0 0 4px",fontFamily:T.font.sans}}>Import from URL</p>
      <p style={{fontSize:13,color:T.ink400,margin:"0 0 12px",fontFamily:T.font.sans}}>Paste a recipe URL — works with BBC Good Food, NYT Cooking, AllRecipes, Serious Eats and most major recipe sites.</p>
      <Label htmlFor="imp-url">Recipe URL</Label>
      <input id="imp-url" style={{...Inp,marginTop:4,marginBottom:10}} placeholder="https://www.bbcgoodfood.com/recipes/..." value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleImport();}}/>
      {status==="error" && <p style={{fontSize:13,color:T.danger,margin:"0 0 10px",fontFamily:T.font.sans}}>{errorMsg}</p>}
      <div style={{display:"flex",gap:8}}>
        <Btn style={{flex:1,justifyContent:"center"}} disabled={status==="fetching"} onClick={handleImport}>{status==="fetching" ? "Fetching…" : "Import recipe"}</Btn>
        <Btn variant="ghost" style={{flex:1,justifyContent:"center"}} onClick={onCancel}>Cancel</Btn>
      </div>
    </Card>
  );
}

function RecipeDetail({recipe}) {
  const [tab,setTab]=useState("ingredients");
  return (
    <div style={{marginTop:14,borderTop:`1px solid ${T.border}`,paddingTop:14}}>
      <div style={{marginBottom:12}}><PillToggle options={[{id:"ingredients",label:"Ingredients"},{id:"method",label:"Method"}]} value={tab} onChange={setTab}/></div>
      {tab==="ingredients"&&recipe.ingredients.map((ing,i)=>(
        <div key={ing.id||i} style={{display:"flex",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.divider}`,gap:8}}>
          <span style={{flex:1,fontSize:14,fontFamily:T.font.sans,color:T.ink900}}>{ing.name}</span>
          <span style={{fontSize:13,color:T.ink500,fontFamily:T.font.sans}}>{fmtQty(ing.qty)} {ing.unit}</span>
          <Tag>{ing.cat}</Tag>
        </div>
      ))}
      {tab==="method"&&(
        (!recipe.steps||recipe.steps.filter(s=>s.trim()).length===0)
          ?<p style={{fontSize:13,color:T.ink400,fontFamily:T.font.sans}}>No method added yet.</p>
          :recipe.steps.filter(s=>s.trim()).map((step,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.divider}`}}>
              <div style={{minWidth:24,height:24,borderRadius:T.r.pill,background:T.brand100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <span style={{fontSize:11,fontWeight:500,color:T.brand700,fontFamily:T.font.sans}}>{i+1}</span>
              </div>
              <p style={{margin:0,fontSize:14,fontFamily:T.font.sans,color:T.ink900,lineHeight:1.5}}>{step}</p>
            </div>
          ))
      )}
    </div>
  );
}

function CookView({allRecipes,cookTarget,onCookTargetConsumed,weeks,allMealTypes,onConfirm}) {
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [currentStep,setCurrentStep]=useState(0);
  const [cookTab,setCookTab]=useState("ingredients");
  const [cookServings,setCookServings]=useState(4);
  const [showPlanner,setShowPlanner]=useState(false);

  useEffect(()=>{
    if(!cookTarget) return;
    const recipe=allRecipes.find(r=>r.id===cookTarget.recipeId);
    if(recipe){
      setSelected(recipe);setCurrentStep(0);setCookTab("ingredients");
      setCookServings(cookTarget.portions*(recipe.servings||4));
    }
    onCookTargetConsumed();
  },[cookTarget,allRecipes,onCookTargetConsumed]);

  const filtered=useMemo(()=>allRecipes.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())||r.category.toLowerCase().includes(search.toLowerCase())),[allRecipes,search]);
  const openRecipe=r=>{setSelected(r);setCurrentStep(0);setCookTab("ingredients");setCookServings(r.servings||4);};
  const closeRecipe=()=>setSelected(null);

  if(selected){
    const steps=(selected.steps||[]).filter(s=>s.trim());
    const base=selected.servings||4;
    const scaleQty=qty=>{
      const n=parseFloat(String(qty==null?"":qty).trim());
      if(isNaN(n)||n===0)return qty||"";
      const sc=n*cookServings/base;
      const ro=Math.round(sc*100)/100;
      return ro%1===0?String(ro):ro.toFixed(2).replace(/\.?0+$/,"");
    };
    const scaled=cookServings!==base;
    return (
      <div style={{paddingBottom:20}}>
        {selected.image&&<div style={{width:"100%",height:200,overflow:"hidden"}}><img src={selected.image} alt={selected.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>}
        <div style={{padding:"20px 16px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>{closeRecipe();setShowPlanner(false);}} style={{width:36,height:36,borderRadius:T.r.md,border:`1.5px solid ${T.borderInput}`,background:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.ink500,flexShrink:0}}>
            <Icon name="chevron-left" size={18}/>
          </button>
          <div style={{flex:1,minWidth:0}}>
            <p style={{margin:0,fontSize:11,fontWeight:500,color:T.ink400,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:T.font.sans}}>{selected.category}</p>
            <h2 style={{margin:0,fontSize:20,fontWeight:500,fontFamily:T.font.sans,color:T.ink900,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selected.name}</h2>
          </div>
          <IconBtn variant="accent" size={34} icon="calendar-plus" ariaLabel="Add to planner" onClick={()=>setShowPlanner(v=>!v)}/>
        </div>
        {showPlanner&&(
          <div style={{padding:"0 16px"}}>
            <PlannerPanel recipe={selected} weeks={weeks} allMealTypes={allMealTypes} allRecipes={allRecipes} onConfirm={(...args)=>{onConfirm(...args);}} onClose={()=>setShowPlanner(false)}/>
          </div>
        )}
        <div style={{padding:"14px 16px 0"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,padding:"10px 14px",background:T.ink50,borderRadius:T.r.md}}>
            <div><Eyebrow>Servings</Eyebrow><p style={{margin:"2px 0 0",fontSize:12,color:T.ink400,fontFamily:T.font.sans}}>Recipe makes {base}</p></div>
            <Stepper value={cookServings} onChange={setCookServings}/>
          </div>
          <PillToggle options={[{id:"ingredients",label:"Ingredients"},{id:"method",label:"Method"}]} value={cookTab} onChange={t=>{setCookTab(t);setCurrentStep(0);}}/>
        </div>
        {cookTab==="ingredients"&&(
          <div style={{padding:"14px 16px 0"}}>
            <p style={{fontSize:13,color:T.ink400,margin:"0 0 12px",fontFamily:T.font.sans}}>
              {selected.ingredients.length} ingredients{scaled&&<span style={{color:T.brand500,fontWeight:500}}> · scaled for {cookServings}</span>}
            </p>
            {selected.ingredients.map((ing,i)=>{
              const dq=scaleQty(ing.qty);
              return (
                <div key={ing.id||i} style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.divider}`,gap:10}}>
                  <div style={{width:28,height:28,borderRadius:T.r.pill,background:T.ink100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:11,fontWeight:500,color:T.ink500,fontFamily:T.font.sans}}>{i+1}</span>
                  </div>
                  <span style={{flex:1,fontSize:15,fontFamily:T.font.sans,color:T.ink900}}>{ing.name}</span>
                  <span style={{fontSize:14,fontFamily:T.font.sans,fontWeight:scaled?500:400,color:scaled?T.brand500:T.ink500}}>{dq}{ing.unit?` ${ing.unit}`:""}</span>
                </div>
              );
            })}
            {steps.length>0&&<Btn style={{width:"100%",justifyContent:"center",marginTop:20}} onClick={()=>{setCookTab("method");setCurrentStep(0);}}>Start cooking</Btn>}
          </div>
        )}
        {cookTab==="method"&&(
          <div style={{padding:"14px 16px 0"}}>
            {steps.length===0
              ?<p style={{fontSize:14,color:T.ink400,fontFamily:T.font.sans}}>No method added yet.</p>
              :<>
                <div style={{display:"flex",gap:4,marginBottom:20}}>
                  {steps.map((_,i)=><button key={i} onClick={()=>setCurrentStep(i)} style={{flex:1,height:4,borderRadius:T.r.pill,border:"none",cursor:"pointer",padding:0,background:i<=currentStep?T.brand500:T.ink200,transition:"background 0.2s"}}/>)}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <Eyebrow>Step {currentStep+1} of {steps.length}</Eyebrow>
                  <span style={{fontSize:12,color:T.ink400,fontFamily:T.font.sans}}>{Math.round((currentStep+1)/steps.length*100)}% done</span>
                </div>
                <div style={{background:T.ink50,borderRadius:T.r.lg,padding:"24px 20px",marginBottom:20,minHeight:160,display:"flex",alignItems:"flex-start",gap:16}}>
                  <div style={{width:36,height:36,borderRadius:T.r.pill,background:T.brand500,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:16,fontWeight:500,color:T.ink0,fontFamily:T.font.sans}}>{currentStep+1}</span>
                  </div>
                  <p style={{margin:0,fontSize:16,fontFamily:T.font.sans,color:T.ink900,lineHeight:1.6,flex:1}}>{steps[currentStep]}</p>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <Btn variant="ghost" style={{flex:1,justifyContent:"center"}} disabled={currentStep===0} onClick={()=>setCurrentStep(s=>Math.max(0,s-1))}><Icon name="chevron-left" size={16}/>Back</Btn>
                  {currentStep<steps.length-1
                    ?<Btn style={{flex:1,justifyContent:"center"}} onClick={()=>setCurrentStep(s=>s+1)}>Next<Icon name="chevron-right" size={16}/></Btn>
                    :<Btn style={{flex:1,justifyContent:"center",background:"#10B981"}} onClick={closeRecipe}><Icon name="check" size={16}/>Done</Btn>
                  }
                </div>
                <div style={{marginTop:24}}>
                  <Eyebrow style={{marginBottom:10}}>All steps</Eyebrow>
                  {steps.map((s,i)=>(
                    <button key={i} onClick={()=>setCurrentStep(i)} style={{display:"flex",gap:12,padding:"10px 0",width:"100%",background:"none",border:"none",borderBottom:`1px solid ${T.divider}`,cursor:"pointer",textAlign:"left"}}>
                      <div style={{width:24,height:24,borderRadius:T.r.pill,flexShrink:0,background:i<currentStep?T.brand500:i===currentStep?T.brand100:T.ink100,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                        {i<currentStep?<Icon name="check" size={12} color={T.ink0}/>:<span style={{fontSize:11,fontWeight:500,color:i===currentStep?T.brand700:T.ink400,fontFamily:T.font.sans}}>{i+1}</span>}
                      </div>
                      <p style={{margin:0,fontSize:13,fontFamily:T.font.sans,color:i===currentStep?T.ink900:T.ink500,lineHeight:1.5,flex:1,fontWeight:i===currentStep?500:400}}>{s}</p>
                    </button>
                  ))}
                </div>
              </>
            }
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{padding:"20px 16px 0"}}>
      <PageHeader eyebrow="Cook mode" title="Recipes"/>
      <div style={{marginBottom:16}}><input style={Inp} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search recipes..."/></div>
      {filtered.length===0&&<p style={{color:T.ink400,fontSize:14,fontFamily:T.font.sans}}>No recipes found.</p>}
      {filtered.map(r=>{
        const steps=(r.steps||[]).filter(s=>s.trim());
        return (
          <button key={r.id} onClick={()=>openRecipe(r)}
            style={{display:"flex",alignItems:"center",gap:12,width:"100%",background:T.ink0,border:`1px solid ${T.border}`,borderRadius:T.r.lg,padding:"14px 16px",marginBottom:10,cursor:"pointer",textAlign:"left"}}
            onMouseOver={e=>e.currentTarget.style.background=T.ink50} onMouseOut={e=>e.currentTarget.style.background=T.ink0}>
            <div style={{width:44,height:44,borderRadius:T.r.md,background:T.brand100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
              {r.image?<img src={r.image} alt={r.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Icon name="chef-hat" size={22} color={T.brand500}/>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{margin:0,fontWeight:500,fontSize:15,fontFamily:T.font.sans,color:T.ink900,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</p>
              <p style={{margin:"2px 0 0",fontSize:12,color:T.ink400,fontFamily:T.font.sans}}>{r.ingredients.length} ingredients · {steps.length>0?`${steps.length} steps`:"No method yet"} · Serves {r.servings||4}</p>
            </div>
            <Icon name="chevron-right" size={18} color={T.ink300}/>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const {weeks,setWeeks,weekStart,setWeekStart,plannerView,setPlannerView,customRecipes,setCustomRecipes,customTypes,setCustomTypes,checked,setChecked,hidden,setHidden,customGrocery,setCustomGrocery,dir,setDir}=useAppState();

  const [page,setPage]=useState("planner");
  const [activeIdx,setActiveIdx]=useState(0);
  const [recSearch,setRecSearch]=useState("");
  const [showAddRec,setShowAddRec]=useState(false);
  const [showImportRec,setShowImportRec]=useState(false);
  const [editingRec,setEditingRec]=useState(null);
  const [expandedRec,setExpandedRec]=useState(null);
  const [plannerRec,setPlannerRec]=useState(null);
  const [addDay,setAddDay]=useState(null);
  const [mealSearch,setMealSearch]=useState("");
  const [pendingAdd,setPendingAdd]=useState(null);
  const [addType,setAddType]=useState("Dinner");
  const [addPts,setAddPts]=useState(1);
  const [newTypeInput,setNewTypeInput]=useState("");
  const [newGroc,setNewGroc]=useState({name:"",qty:"",unit:"",cat:"Produce"});
  const [grocErr,setGrocErr]=useState("");
  const [showAddGroc,setShowAddGroc]=useState(false);
  const [grocSearchOpen,setGrocSearchOpen]=useState(false);
  const [dirSearch,setDirSearch]=useState("");
  const [newDirE,setNewDirE]=useState({name:"",unit:"",cat:"Produce"});
  const [showAddDir,setShowAddDir]=useState(false);
  const [renamingWk,setRenamingWk]=useState(null);
  const [cookTarget,setCookTarget]=useState(null);

  const allMealTypes=useMemo(()=>[...DEFAULT_MEAL_TYPES,...customTypes],[customTypes]);
  const builtInIds=useMemo(()=>new Set(BUILT_IN_RECIPES.map(r=>r.id)),[]);
  const allRecipes=useMemo(()=>{const ov=new Set(customRecipes.map(r=>r.id));return[...BUILT_IN_RECIPES.filter(r=>!ov.has(r.id)),...customRecipes];},[customRecipes]);
  const filteredRecipes=useMemo(()=>allRecipes.filter(r=>r.name.toLowerCase().includes(recSearch.toLowerCase())||r.ingredients.some(i=>i.name.toLowerCase().includes(recSearch.toLowerCase()))),[allRecipes,recSearch]);
  const filteredMealSearch=useMemo(()=>allRecipes.filter(r=>r.name.toLowerCase().includes(mealSearch.toLowerCase())),[allRecipes,mealSearch]);
  const filteredDir=useMemo(()=>dir.filter(d=>d.name.toLowerCase().includes(dirSearch.toLowerCase())||d.cat.toLowerCase().includes(dirSearch.toLowerCase())),[dir,dirSearch]);
  const DAYS=useMemo(()=>orderedDays(weekStart),[weekStart]);

  const grocByCat=useGroceryList(weeks,allRecipes,customGrocery);
  const glCats=useMemo(()=>CAT_ORDER.filter(c=>grocByCat[c]),[grocByCat]);
  const allGlKeys=useMemo(()=>glCats.flatMap(c=>grocByCat[c].map(i=>i._key)),[glCats,grocByCat]);
  const visKeys=useMemo(()=>allGlKeys.filter(k=>!hidden[k]),[allGlKeys,hidden]);
  const checkedCt=useMemo(()=>visKeys.filter(k=>checked[k]).length,[visKeys,checked]);
  const totalVis=visKeys.length;
  const totalMeals=useMemo(()=>weeks.reduce((s,w)=>s+Object.values(w.days).reduce((ss,m)=>ss+m.length,0),0),[weeks]);

  const updDay=useCallback((wid,day,fn)=>setWeeks(ws=>ws.map(w=>w.id===wid?{...w,days:{...w.days,[day]:fn(w.days[day]||[])}}:w)),[setWeeks]);
  const addWeek=useCallback(()=>{if(weeks.length>=5)return;const id=uuid();setWeeks(ws=>[...ws,mkWeek(id,`Week ${ws.length+1}`)]);setActiveIdx(weeks.length);},[weeks.length,setWeeks]);
  const removeWeek=useCallback(id=>{if(weeks.length===1)return;setWeeks(ws=>ws.filter(w=>w.id!==id).map((w,i)=>({...w,label:`Week ${i+1}`})));setActiveIdx(i=>Math.max(0,i-1));},[weeks.length,setWeeks]);
  const confirmPlan=useCallback((wid,day,rid,mt,pts)=>updDay(wid,day,arr=>[...arr,{entryId:uuid(),recipeId:rid,mealType:mt,portions:pts}]),[updDay]);
  const consumeCookTarget=useCallback(()=>setCookTarget(null),[]);
  const getName=useCallback(e=>allRecipes.find(x=>x.id===e.recipeId)?.name||"?",[allRecipes]);

  const handleSaveRecipe=useCallback(rec=>{
    if(!rec.name.trim())return;
    const cleaned={...rec,ingredients:rec.ingredients.filter(i=>i.name.trim()),steps:rec.steps.filter(s=>s.trim())};
    if(editingRec){
      if(customRecipes.find(x=>x.id===cleaned.id))setCustomRecipes(p=>p.map(r=>r.id===cleaned.id?cleaned:r));
      else setCustomRecipes(p=>[...p,cleaned]);
      setEditingRec(null);
    }else{
      setCustomRecipes(p=>[...p,{...cleaned,id:uuid()}]);
      setShowAddRec(false);
    }
    setExpandedRec(null);
  },[editingRec,customRecipes,setCustomRecipes]);

  const deleteRecipe=useCallback(id=>{
    setCustomRecipes(p=>p.filter(r=>r.id!==id));
    setWeeks(ws=>ws.map(w=>({...w,days:Object.fromEntries(Object.entries(w.days).map(([d,ms])=>[d,ms.filter(e=>e.recipeId!==id)]))})));
  },[setCustomRecipes,setWeeks]);

  const nav=[
    {id:"planner",icon:"calendar",label:"Planner"},
    {id:"recipes",icon:"book",label:"Recipes"},
    {id:"cook",icon:"chef-hat",label:"Cook"},
    {id:"grocery",icon:"shopping-cart",label:"Grocery"},
    {id:"summary",icon:"clipboard-list",label:"Summary"},
    {id:"settings",icon:"settings",label:"Settings"},
  ];

  const renderWeekCard=(wk,weekIndex)=>(
    <div key={wk.id} style={{background:T.ink0,border:`1px solid ${T.border}`,borderRadius:T.r.lg,marginBottom:12,overflow:"hidden"}}>
      <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.divider}`}}>
        {renamingWk===wk.id
          ?<input autoFocus style={{...Inp,fontWeight:500,fontSize:15,maxWidth:160,padding:"6px 10px"}} defaultValue={wk.label}
              onBlur={e=>{setWeeks(ws=>ws.map(w=>w.id===wk.id?{...w,label:e.target.value||w.label}:w));setRenamingWk(null);}}
              onKeyDown={e=>{if(e.key==="Enter"){setWeeks(ws=>ws.map(w=>w.id===wk.id?{...w,label:e.target.value||w.label}:w));setRenamingWk(null);}}}/>
          :<div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontWeight:500,fontSize:16,fontFamily:T.font.sans,color:T.ink900}}>{wk.label}</span>
            <IconBtn variant="ghost" size={26} icon="edit" ariaLabel="Rename" onClick={()=>setRenamingWk(wk.id)}/>
          </div>
        }
        <div style={{display:"flex",gap:6}}>
          <Btn variant="ghost" style={{padding:"5px 10px",fontSize:12}} onClick={()=>setWeeks(ws=>ws.map(w=>w.id===wk.id?mkWeek(w.id,w.label):w))}>Reset</Btn>
          {weeks.length>1&&<IconBtn variant="danger" size={30} icon="trash" ariaLabel="Remove week" onClick={()=>removeWeek(wk.id)}/>}
        </div>
      </div>
      {DAYS.map(day=>{
        const rawEntries=wk.days[day]||[];
        const entries=rawEntries.map((e,i)=>({...e,entryId:e.entryId||`lg_${i}`}));
        const grouped=groupEntries(entries);
        const types=Object.keys(grouped).sort((a,b)=>allMealTypes.indexOf(a)-allMealTypes.indexOf(b));
        const dayDate=getDayDate(weekIndex,day,weekStart);
        const todayFlag=isToday(dayDate);
        return (
          <div key={day} style={{borderTop:`1px solid ${T.divider}`,padding:"12px 16px",background:todayFlag?T.brand50:"transparent"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:types.length?8:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontWeight:500,fontSize:14,fontFamily:T.font.sans,color:todayFlag?T.brand500:T.ink900}}>{day}</span>
                <span style={{fontSize:12,color:todayFlag?T.brand500:T.ink400,fontFamily:T.font.sans}}>{formatDayDate(dayDate)}</span>
                {todayFlag&&<span style={{fontSize:10,fontWeight:500,padding:"1px 7px",borderRadius:T.r.pill,background:T.brand500,color:T.ink0,fontFamily:T.font.sans}}>Today</span>}
              </div>
              <IconBtn variant="accent" size={28} icon="plus" ariaLabel={`Add meal to ${day}`} onClick={()=>{setAddDay({weekId:wk.id,day});setMealSearch("");}}/>
            </div>
            {types.length===0&&<p style={{fontSize:13,color:T.ink400,margin:0,fontFamily:T.font.sans}}>Nothing planned</p>}
            {types.map(type=>(
              <div key={type} style={{marginBottom:6}}>
                <SlotPill slot={type}/>
                <div style={{paddingLeft:12,marginTop:4,display:"flex",flexDirection:"column",gap:3}}>
                  {grouped[type].map(e=>(
                    <div key={e.entryIds[0]} style={{display:"flex",alignItems:"center",gap:6,fontSize:14,fontFamily:T.font.sans}}>
                      <span style={{flex:1,color:T.ink900}}>{getName(e)}</span>
                      {e.portions>1&&<span style={{fontSize:12,color:T.ink400,fontWeight:500}}>×{e.portions}</span>}
                      <button onClick={()=>updDay(wk.id,day,arr=>arr.filter(a=>!e.entryIds.includes(a.entryId||"")))} style={{border:"none",background:"none",cursor:"pointer",color:T.ink300,padding:0,lineHeight:1}}><Icon name="x" size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {addDay?.weekId===wk.id&&addDay?.day===day&&(
              <div style={{marginTop:10,padding:12,background:T.ink50,borderRadius:T.r.md,border:`1px solid ${T.borderInput}`}}>
                <input style={{...Inp,marginBottom:8}} placeholder="Search recipes..." value={mealSearch} onChange={e=>setMealSearch(e.target.value)} autoFocus/>
                <div style={{maxHeight:160,overflowY:"auto",borderRadius:T.r.sm,border:`1px solid ${T.borderInput}`,background:T.ink0}}>
                  {filteredMealSearch.map(r=>(
                    <div key={r.id} onClick={()=>{setPendingAdd({weekId:wk.id,day,recipeId:r.id});setAddDay(null);setMealSearch("");}}
                      style={{padding:"10px 14px",cursor:"pointer",fontSize:14,borderBottom:`1px solid ${T.divider}`,display:"flex",justifyContent:"space-between",fontFamily:T.font.sans}}
                      onMouseOver={e=>e.currentTarget.style.background=T.ink50} onMouseOut={e=>e.currentTarget.style.background=T.ink0}>
                      <span style={{color:T.ink900}}>{r.name}</span><span style={{fontSize:12,color:T.ink400}}>{r.category}</span>
                    </div>
                  ))}
                </div>
                <Btn variant="ghost" style={{marginTop:8,fontSize:12,padding:"5px 12px"}} onClick={()=>setAddDay(null)}>Cancel</Btn>
              </div>
            )}
            {pendingAdd?.weekId===wk.id&&pendingAdd?.day===day&&(
              <div style={{marginTop:10,padding:12,background:T.brand100,borderRadius:T.r.md,border:`1px solid ${T.brand500}`}}>
                <p style={{fontSize:13,fontWeight:500,margin:"0 0 10px",color:T.brand700,fontFamily:T.font.sans}}>Adding: {getName({recipeId:pendingAdd.recipeId})}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <div><Label htmlFor="ps">Meal slot</Label><select id="ps" style={{...Inp,padding:"8px 10px"}} value={addType} onChange={e=>setAddType(e.target.value)}>{allMealTypes.map(t=><option key={t}>{t}</option>)}</select></div>
                  <div><Label>Portions</Label><div style={{marginTop:4}}><Stepper value={addPts} onChange={setAddPts}/></div></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn style={{flex:1,justifyContent:"center"}} onClick={()=>{confirmPlan(wk.id,day,pendingAdd.recipeId,addType,addPts);setPendingAdd(null);setAddType("Dinner");setAddPts(1);}}>Confirm</Btn>
                  <Btn variant="ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>setPendingAdd(null)}>Cancel</Btn>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{fontFamily:T.font.sans,color:T.ink900,maxWidth:420,margin:"0 auto",background:T.ink0,height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>

        {page==="planner"&&(
          <div style={{padding:"20px 16px 0"}}>
            <PageHeader eyebrow="Meal planner" title={`${weeks.length} ${weeks.length===1?"Week":"Weeks"}`}
              action={<Btn onClick={addWeek} disabled={weeks.length>=5} style={{padding:"8px 14px",fontSize:13}}><Icon name="plus" size={14}/>Week{weeks.length>=5?" (max)":""}</Btn>}/>
            <div style={{marginBottom:16}}><PillToggle options={[{id:"scroll",label:"Stack"},{id:"carousel",label:"Swipe"}]} value={plannerView} onChange={setPlannerView}/></div>
            {plannerView==="scroll"&&weeks.map((w,i)=>renderWeekCard(w,i))}
            {plannerView==="carousel"&&(
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <Btn variant="ghost" style={{padding:"6px 10px"}} disabled={activeIdx===0} onClick={()=>setActiveIdx(i=>i-1)}><Icon name="arrow-left" size={15}/></Btn>
                  <div style={{flex:1,display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
                    {weeks.map((w,i)=><button key={w.id} onClick={()=>setActiveIdx(i)} style={{padding:"4px 12px",borderRadius:T.r.pill,border:`1.5px solid ${i===activeIdx?T.brand500:T.borderInput}`,background:i===activeIdx?T.brand500:T.ink0,color:i===activeIdx?T.ink0:T.ink500,cursor:"pointer",fontSize:12,fontWeight:i===activeIdx?500:400,fontFamily:"inherit"}}>{w.label}</button>)}
                  </div>
                  <Btn variant="ghost" style={{padding:"6px 10px"}} disabled={activeIdx===weeks.length-1} onClick={()=>setActiveIdx(i=>i+1)}><Icon name="arrow-right" size={15}/></Btn>
                </div>
                {weeks[activeIdx]&&renderWeekCard(weeks[activeIdx],activeIdx)}
              </div>
            )}
          </div>
        )}

        {page==="recipes"&&(
          <div style={{padding:"20px 16px 0"}}>
            <PageHeader title="Recipes" action={
              <div style={{display:"flex",gap:6}}>
                <Btn variant="ghost" style={{padding:"8px 12px",fontSize:13}} onClick={()=>{setShowImportRec(true);setShowAddRec(false);setEditingRec(null);}}><Icon name="download" size={14}/>Import</Btn>
                <Btn style={{padding:"8px 14px",fontSize:13}} onClick={()=>{setShowAddRec(true);setShowImportRec(false);setEditingRec(null);}}><Icon name="plus" size={14}/>Add</Btn>
              </div>
            }/>
            <div style={{marginBottom:14}}><input style={Inp} value={recSearch} onChange={e=>setRecSearch(e.target.value)} placeholder="Search by name or ingredient..."/></div>
            {showImportRec&&<RecipeImporter directory={dir} onSaveToDirectory={d=>setDir(p=>p.find(x=>x.name.toLowerCase()===d.name.toLowerCase())?p:[...p,{...d,id:uuid()}])} onSave={rec=>{if(!rec.name.trim())return;setCustomRecipes(p=>[...p,{...rec,id:uuid(),ingredients:rec.ingredients.filter(i=>i.name.trim()),steps:rec.steps.filter(s=>s.trim())}]);setShowImportRec(false);}} onCancel={()=>setShowImportRec(false)}/>}
            {showAddRec&&<RecipeForm initial={initRecipe()} directory={dir} label="New recipe" onSaveToDirectory={d=>setDir(p=>p.find(x=>x.name.toLowerCase()===d.name.toLowerCase())?p:[...p,{...d,id:uuid()}])} onSave={rec=>{if(!rec.name.trim())return;setCustomRecipes(p=>[...p,{...rec,id:uuid(),ingredients:rec.ingredients.filter(i=>i.name.trim()),steps:rec.steps.filter(s=>s.trim())}]);setShowAddRec(false);}} onCancel={()=>setShowAddRec(false)}/>}
            {filteredRecipes.length===0&&<p style={{color:T.ink400,fontSize:14}}>No recipes found.</p>}
            {filteredRecipes.map(r=>{
              const isExp=expandedRec===r.id,showPl=plannerRec===r.id,isEd=editingRec?.id===r.id;
              const isOverridden=customRecipes.some(c=>c.id===r.id);
              const isCustomOnly=!builtInIds.has(r.id);
              return (
                <Card key={r.id}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>{if(isEd)return;if(isExp||showPl){setExpandedRec(null);setPlannerRec(null);}else{setExpandedRec(r.id);setPlannerRec(null);}}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontWeight:500,fontSize:14,fontFamily:T.font.sans,color:T.ink900}}>{r.name}</span>
                        <Tag>{r.category}</Tag>
                        {isOverridden&&<Tag accent>Edited</Tag>}
                        {isCustomOnly&&!isOverridden&&<Tag accent>Custom</Tag>}
                      </div>
                      <p style={{margin:"2px 0 0",fontSize:12,color:T.ink400,fontFamily:T.font.sans}}>{r.ingredients.length} ingredients · Serves {r.servings||4}</p>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <IconBtn variant="accent" size={30} icon="calendar-plus" ariaLabel="Add to planner" onClick={e=>{e.stopPropagation();if(!showPl)setExpandedRec(null);setPlannerRec(showPl?null:r.id);setEditingRec(null);}}/>
                      <IconBtn size={30} icon="edit" ariaLabel="Edit" style={{background:T.ink50}} onClick={e=>{e.stopPropagation();setEditingRec(isEd?null:r);setExpandedRec(null);setPlannerRec(null);setShowAddRec(false);}}/>
                      <IconBtn variant="danger" size={30} icon="trash" ariaLabel="Delete" onClick={e=>{e.stopPropagation();deleteRecipe(r.id);}}/>
                      <IconBtn variant="ghost" size={30} icon={isExp||showPl||isEd?"chevron-up":"chevron-down"} ariaLabel="Expand" onClick={()=>{if(isEd)return;if(isExp||showPl){setExpandedRec(null);setPlannerRec(null);}else{setExpandedRec(r.id);setPlannerRec(null);}}}/>
                    </div>
                  </div>
                  {isEd&&<RecipeForm initial={{...r,steps:r.steps||[""],servings:r.servings||4,ingredients:r.ingredients.map(i=>({...i,id:i.id||uuid()}))}} directory={dir} label="Edit recipe" onSaveToDirectory={d=>setDir(p=>p.find(x=>x.name.toLowerCase()===d.name.toLowerCase())?p:[...p,{...d,id:uuid()}])} onSave={handleSaveRecipe} onCancel={()=>setEditingRec(null)}/>}
                  {isExp&&!isEd&&<RecipeDetail recipe={r}/>}
                  {showPl&&!isEd&&<PlannerPanel recipe={r} weeks={weeks} allMealTypes={allMealTypes} allRecipes={allRecipes} onConfirm={confirmPlan} onClose={()=>setPlannerRec(null)}/>}
                </Card>
              );
            })}
          </div>
        )}

        {page==="cook"&&<CookView allRecipes={allRecipes} cookTarget={cookTarget} onCookTargetConsumed={consumeCookTarget} weeks={weeks} allMealTypes={allMealTypes} onConfirm={confirmPlan}/>}

        {page==="grocery"&&(
          <div style={{padding:"20px 16px 0"}}>
            <PageHeader eyebrow="Grocery list" title={totalVis>0?`${checkedCt} / ${totalVis} done`:"Empty"}
              action={<Btn onClick={()=>setShowAddGroc(v=>!v)} style={{padding:"8px 14px",fontSize:13}}><Icon name="plus" size={14}/>Add item</Btn>}/>
            {totalVis>0&&<ProgressBar value={checkedCt/totalVis}/>}
            {showAddGroc&&(
              <Card accent style={{marginBottom:16}}>
                <p style={{fontWeight:500,fontSize:15,margin:"0 0 12px",fontFamily:T.font.sans}}>Add item</p>
                <div style={{marginBottom:10,position:"relative",zIndex:50}}>
                  <Label htmlFor="gi-name">Item name</Label>
                  <div style={{position:"relative"}}>
                    <input id="gi-name" style={Inp} placeholder="e.g. Beef Steak, Eggs, Oat milk..."
                      value={newGroc.name}
                      onChange={e=>{setNewGroc(p=>({...p,name:e.target.value}));setGrocSearchOpen(true);}}
                      onFocus={()=>setGrocSearchOpen(true)}
                      onBlur={()=>setTimeout(()=>setGrocSearchOpen(false),150)}/>
                    {grocSearchOpen&&newGroc.name.trim().length>0&&(()=>{
                      const grocHits=dir.filter(d=>d.name.toLowerCase().includes(newGroc.name.toLowerCase())).slice(0,6);
                      if(grocHits.length===0)return null;
                      return (
                        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:9999,borderRadius:T.r.md,overflow:"hidden",border:`1px solid ${T.borderInput}`,backgroundColor:T.ink0,boxShadow:T.shadow.md}}>
                          {grocHits.map(d=>(
                            <div key={d.id} onMouseDown={e=>{e.preventDefault();setNewGroc(p=>({...p,name:d.name,unit:d.unit||p.unit,cat:d.cat||p.cat}));setGrocSearchOpen(false);}}
                              style={{padding:"10px 14px",fontSize:14,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.divider}`,backgroundColor:T.ink0,fontFamily:T.font.sans}}
                              onMouseOver={e=>e.currentTarget.style.backgroundColor=T.ink50}
                              onMouseOut={e=>e.currentTarget.style.backgroundColor=T.ink0}>
                              <span style={{color:T.ink900}}>{d.name}</span>
                              <span style={{fontSize:12,color:T.ink400}}>{d.cat}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                  <div><Label htmlFor="gq">Qty</Label><input id="gq" style={{...Inp,padding:"8px 10px"}} placeholder="2" value={newGroc.qty} onChange={e=>setNewGroc(p=>({...p,qty:e.target.value}))}/></div>
                  <div><Label htmlFor="gu">Unit</Label><input id="gu" style={{...Inp,padding:"8px 10px"}} placeholder="g" value={newGroc.unit} onChange={e=>setNewGroc(p=>({...p,unit:e.target.value}))}/></div>
                  <div><Label htmlFor="gc">Category</Label><select id="gc" style={{...Inp,padding:"8px 6px"}} value={newGroc.cat} onChange={e=>setNewGroc(p=>({...p,cat:e.target.value}))}>{CAT_ORDER.map(c=><option key={c}>{c}</option>)}</select></div>
                </div>
                {grocErr&&<p style={{color:T.danger,fontSize:13,margin:"0 0 8px",fontFamily:T.font.sans}}>{grocErr}</p>}
                <div style={{display:"flex",gap:8}}>
                  <Btn style={{flex:1,justifyContent:"center"}} onClick={()=>{
                    if(!newGroc.name.trim()){setGrocErr("Please enter an item name.");return;}
                    setCustomGrocery(p=>[...p,{...newGroc,id:uuid()}]);
                    setNewGroc({name:"",qty:"",unit:"",cat:"Produce"});setGrocErr("");setShowAddGroc(false);
                  }}>Add to list</Btn>
                  <Btn variant="ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>{setShowAddGroc(false);setGrocErr("");}}>Cancel</Btn>
                </div>
                {newGroc.name.trim()&&!dir.find(d=>d.name.toLowerCase()===newGroc.name.toLowerCase().trim())&&(
                  <button onClick={()=>{
                    setDir(p=>[...p,{id:uuid(),name:newGroc.name.trim(),unit:newGroc.unit||"",cat:newGroc.cat||"Other"}]);
                  }}
                    style={{display:"flex",alignItems:"center",gap:8,width:"100%",marginTop:10,padding:"10px 14px",borderRadius:T.r.md,border:`1.5px dashed ${T.brand500}`,background:T.brand50,cursor:"pointer",fontFamily:T.font.sans,fontSize:13,fontWeight:500,color:T.brand700}}>
                    <Icon name="bookmark" size={14} color={T.brand500}/>
                    Save "{newGroc.name.trim()}" to ingredient directory
                  </button>
                )}
              </Card>
            )}
            {Object.keys(hidden).filter(k=>hidden[k]).length>0&&(
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"8px 12px",background:T.ink50,borderRadius:T.r.md}}>
                <Icon name="eye-off" size={14} color={T.ink400}/>
                <span style={{fontSize:13,color:T.ink500,flex:1,fontFamily:T.font.sans}}>{Object.values(hidden).filter(Boolean).length} items hidden</span>
                <Btn variant="ghost" style={{padding:"3px 10px",fontSize:12}} onClick={()=>setHidden({})}>Show all</Btn>
              </div>
            )}
            {totalVis===0?(
              <div style={{textAlign:"center",padding:"3rem 1rem"}}>
                <Icon name="shopping-cart" size={40} color={T.ink300}/>
                <p style={{color:T.ink400,marginTop:8,fontSize:14,fontFamily:T.font.sans}}>Add meals in the planner or tap "Add item"</p>
              </div>
            ):glCats.map(cat=>{
              const vis=(grocByCat[cat]||[]).filter(i=>!hidden[i._key]);
              if(!vis.length)return null;
              const sorted=[...vis].sort((a,b)=>(checked[a._key]?1:0)-(checked[b._key]?1:0));
              return (
                <div key={cat} style={{marginBottom:16}}>
                  <div style={{paddingLeft:4,marginBottom:8}}><Eyebrow>{cat}</Eyebrow></div>
                  <Card>
                    {sorted.map((item,idx)=>{
                      const k=item._key,chk=!!checked[k];
                      return (
                        <div key={k} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:idx<sorted.length-1?`1px solid ${T.divider}`:"none"}}>
                          <input type="checkbox" checked={chk} id={`chk-${k}`} onChange={()=>setChecked(p=>({...p,[k]:!p[k]}))} style={{width:20,height:20,accentColor:T.brand500,cursor:"pointer",flexShrink:0}}/>
                          <label htmlFor={`chk-${k}`} style={{flex:1,fontSize:14,fontFamily:T.font.sans,textDecoration:chk?"line-through":"none",color:chk?T.ink400:T.ink900,cursor:"pointer"}}>{item.name}</label>
                          <span style={{fontSize:13,color:T.ink400,minWidth:50,textAlign:"right",fontFamily:T.font.sans}}>{fmtQty(item.qty)} {item.unit}</span>
                          <button onClick={()=>{if(item.isCustom)setCustomGrocery(p=>p.filter(x=>x.id!==item.id));else setHidden(p=>({...p,[k]:true}));}} style={{border:"none",background:"none",cursor:"pointer",color:T.ink300,padding:0,lineHeight:1,flexShrink:0}}><Icon name={item.isCustom?"trash":"eye-off"} size={15}/></button>
                        </div>
                      );
                    })}
                  </Card>
                </div>
              );
            })}
            {checkedCt>0&&<Btn variant="danger" style={{width:"100%",justifyContent:"center",marginTop:4}} onClick={()=>setChecked({})}>Clear all checks</Btn>}
          </div>
        )}

        {page==="summary"&&(
          <div style={{padding:"20px 16px 0"}}>
            <h1 style={{margin:"0 0 16px",fontFamily:T.font.sans,fontSize:22,fontWeight:500,color:T.ink900}}>Summary</h1>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
              <StatCard label="Total meals" value={totalMeals}/>
              <StatCard label="Grocery items" value={totalVis}/>
            </div>
            {(()=>{
              const todayMeals=[];
              weeks.forEach((wk,wi)=>{
                DAYS.forEach(day=>{
                  if(!isToday(getDayDate(wi,day,weekStart)))return;
                  const entries=(wk.days[day]||[]).map((e,i)=>({...e,entryId:e.entryId||`lg_${i}`}));
                  const grouped=groupEntries(entries);
                  Object.keys(grouped).sort((a,b)=>allMealTypes.indexOf(a)-allMealTypes.indexOf(b)).forEach(type=>grouped[type].forEach(e=>todayMeals.push({...e,mealType:type})));
                });
              });
              if(todayMeals.length===0)return null;
              return (
                <div style={{marginBottom:24}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <div style={{width:8,height:8,borderRadius:T.r.pill,background:T.brand500,flexShrink:0}}/>
                    <Eyebrow style={{color:T.brand500}}>Today</Eyebrow>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {todayMeals.map((e,i)=>{
                      const recipe=allRecipes.find(r=>r.id===e.recipeId);
                      if(!recipe)return null;
                      return (
                        <button key={i} onClick={()=>{setCookTarget({recipeId:e.recipeId,portions:e.portions});setPage("cook");}}
                          style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:T.r.lg,border:`1.5px solid ${T.brand100}`,background:T.brand50,cursor:"pointer",textAlign:"left",width:"100%"}}>
                          <div style={{width:40,height:40,borderRadius:T.r.md,background:T.brand100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                            {recipe.image?<img src={recipe.image} alt={recipe.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Icon name="chef-hat" size={20} color={T.brand500}/>}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <p style={{margin:0,fontWeight:500,fontSize:14,fontFamily:T.font.sans,color:T.ink900}}>{recipe.name}</p>
                            <p style={{margin:"2px 0 0",fontSize:12,color:T.ink500,fontFamily:T.font.sans}}>{e.mealType}{e.portions>1?` · ${e.portions} portions`:""}</p>
                          </div>
                          <Icon name="chevron-right" size={16} color={T.brand500}/>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            {weeks.map((wk,wi)=>(
              <div key={wk.id} style={{background:T.ink0,border:`1px solid ${T.border}`,borderRadius:T.r.lg,overflow:"hidden",marginBottom:16}}>
                <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.divider}`}}><span style={{fontWeight:500,fontSize:15,fontFamily:T.font.sans,color:T.ink900}}>{wk.label}</span></div>
                {DAYS.map(day=>{
                  const entries=wk.days[day]||[];
                  const grouped=groupEntries(entries.map((e,i)=>({...e,entryId:e.entryId||`lg_${i}`})));
                  const types=Object.keys(grouped).sort((a,b)=>allMealTypes.indexOf(a)-allMealTypes.indexOf(b));
                  const dayDate=getDayDate(wi,day,weekStart);
                  const todayFlag=isToday(dayDate);
                  return (
                    <div key={day} style={{padding:"12px 16px",borderBottom:`1px solid ${T.divider}`,background:todayFlag?T.brand50:"transparent"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:types.length?6:0}}>
                        <p style={{fontWeight:500,fontSize:14,margin:0,fontFamily:T.font.sans,color:todayFlag?T.brand500:T.ink900}}>{day}</p>
                        <span style={{fontSize:12,color:todayFlag?T.brand500:T.ink400,fontFamily:T.font.sans}}>{formatDayDate(dayDate)}</span>
                        {todayFlag&&<span style={{fontSize:10,fontWeight:500,padding:"1px 7px",borderRadius:T.r.pill,background:T.brand500,color:T.ink0,fontFamily:T.font.sans}}>Today</span>}
                      </div>
                      {types.length===0?<p style={{fontSize:13,color:T.ink400,margin:0,fontFamily:T.font.sans}}>Nothing planned</p>:types.map(type=>(
                        <div key={type} style={{marginBottom:5}}>
                          <SlotPill slot={type}/>
                          <div style={{paddingLeft:12,marginTop:4}}>
                            {grouped[type].map((e,i)=>(
                              <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:14,fontFamily:T.font.sans,color:T.ink900}}>
                                <span style={{flex:1}}>{getName(e)}</span>
                                {e.portions>1&&<span style={{fontSize:12,color:T.ink400}}>×{e.portions}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {page==="settings"&&(
          <div style={{padding:"20px 16px 0"}}>
            <h1 style={{margin:"0 0 20px",fontFamily:T.font.sans,fontSize:22,fontWeight:500,color:T.ink900}}>Settings</h1>
            <Card>
              <p style={{fontWeight:500,fontSize:15,margin:"0 0 4px",fontFamily:T.font.sans}}>Week start day</p>
              <p style={{fontSize:13,color:T.ink400,margin:"0 0 14px",fontFamily:T.font.sans}}>Which day your shopping week begins.</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {ALL_DAYS.map(d=><button key={d} onClick={()=>setWeekStart(d)} style={{padding:"6px 14px",borderRadius:T.r.pill,border:`1.5px solid ${d===weekStart?T.brand500:T.borderInput}`,background:d===weekStart?T.brand500:T.ink0,color:d===weekStart?T.ink0:T.ink500,cursor:"pointer",fontSize:13,fontWeight:d===weekStart?500:400,fontFamily:"inherit"}}>{d.slice(0,3)}</button>)}
              </div>
            </Card>
            <Card>
              <p style={{fontWeight:500,fontSize:15,margin:"0 0 4px",fontFamily:T.font.sans}}>Meal categories</p>
              <p style={{fontSize:13,color:T.ink400,margin:"0 0 14px",fontFamily:T.font.sans}}>Slot options when adding a meal.</p>
              <div style={{marginBottom:12}}>
                {DEFAULT_MEAL_TYPES.map(t=><span key={t} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:13,padding:"4px 10px",borderRadius:T.r.xl,background:T.ink100,color:T.ink500,marginRight:6,marginBottom:6,fontFamily:T.font.sans}}>{t} <span style={{fontSize:11,color:T.ink400}}>default</span></span>)}
                {customTypes.map(t=><span key={t} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:13,padding:"4px 10px",borderRadius:T.r.xl,background:T.brand100,color:T.brand700,marginRight:6,marginBottom:6,fontFamily:T.font.sans}}>{t}<button onClick={()=>setCustomTypes(p=>p.filter(x=>x!==t))} style={{border:"none",background:"none",cursor:"pointer",color:T.brand700,padding:0,lineHeight:1}}><Icon name="x" size={12}/></button></span>)}
              </div>
              <div style={{display:"flex",gap:8}}>
                <input style={{...Inp,flex:1}} placeholder="e.g. Supper, Pre-workout..." value={newTypeInput} onChange={e=>setNewTypeInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newTypeInput.trim()&&!allMealTypes.includes(newTypeInput.trim())){setCustomTypes(p=>[...p,newTypeInput.trim()]);setNewTypeInput("");}}}/>
                <Btn onClick={()=>{const t=newTypeInput.trim();if(t&&!allMealTypes.includes(t)){setCustomTypes(p=>[...p,t]);setNewTypeInput("");}}}>Add</Btn>
              </div>
            </Card>
            <Card>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <p style={{fontWeight:500,fontSize:15,margin:0,fontFamily:T.font.sans}}>Ingredients directory</p>
                <span style={{fontSize:12,color:T.ink400,fontFamily:T.font.sans}}>{dir.length} items</span>
              </div>
              <p style={{fontSize:13,color:T.ink400,margin:"0 0 14px",fontFamily:T.font.sans}}>Searchable bank for recipes and grocery items.</p>
              <Btn style={{marginBottom:14,fontSize:13,padding:"8px 14px"}} onClick={()=>setShowAddDir(v=>!v)}><Icon name="plus" size={13}/>Add ingredient</Btn>
              {showAddDir&&(
                <div style={{background:T.ink50,borderRadius:T.r.md,padding:12,marginBottom:14,border:`1px solid ${T.borderInput}`}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8,marginBottom:8}}>
                    <div><Label htmlFor="dn">Name</Label><input id="dn" style={{...Inp,padding:"8px 10px"}} placeholder="e.g. Fennel" value={newDirE.name} onChange={e=>setNewDirE(p=>({...p,name:e.target.value}))}/></div>
                    <div><Label htmlFor="du">Unit</Label><input id="du" style={{...Inp,padding:"8px 10px"}} placeholder="g" value={newDirE.unit} onChange={e=>setNewDirE(p=>({...p,unit:e.target.value}))}/></div>
                    <div><Label htmlFor="dcat">Category</Label><select id="dcat" style={{...Inp,padding:"8px 6px"}} value={newDirE.cat} onChange={e=>setNewDirE(p=>({...p,cat:e.target.value}))}>{CAT_ORDER.map(c=><option key={c}>{c}</option>)}</select></div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <Btn style={{flex:1,justifyContent:"center",fontSize:13}} onClick={()=>{if(!newDirE.name.trim())return;if(dir.find(d=>d.name.toLowerCase()===newDirE.name.toLowerCase().trim()))return;setDir(p=>[...p,{...newDirE,name:newDirE.name.trim(),id:uuid()}]);setNewDirE({name:"",unit:"",cat:"Produce"});setShowAddDir(false);}}>Save</Btn>
                    <Btn variant="ghost" style={{flex:1,justifyContent:"center",fontSize:13}} onClick={()=>setShowAddDir(false)}>Cancel</Btn>
                  </div>
                </div>
              )}
              <div style={{marginBottom:10}}><input style={Inp} placeholder="Search directory..." value={dirSearch} onChange={e=>setDirSearch(e.target.value)}/></div>
              <div style={{maxHeight:280,overflowY:"auto",borderRadius:T.r.md,border:`1px solid ${T.borderInput}`}}>
                {filteredDir.length===0&&<p style={{fontSize:13,color:T.ink400,padding:"10px 14px",margin:0,fontFamily:T.font.sans}}>No results.</p>}
                {filteredDir.map((d,i)=>(
                  <div key={d.id} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:i<filteredDir.length-1?`1px solid ${T.divider}`:"none",background:T.ink0}}>
                    <span style={{flex:1,fontSize:14,fontFamily:T.font.sans,color:T.ink900}}>{d.name}</span>
                    <span style={{fontSize:12,color:T.ink400,minWidth:40,fontFamily:T.font.sans}}>{d.unit||"—"}</span>
                    <Tag>{d.cat}</Tag>
                    <button onClick={()=>setDir(p=>p.filter(x=>x.id!==d.id))} style={{border:"none",background:"none",cursor:"pointer",color:T.ink300,padding:0,lineHeight:1}}><Icon name="trash" size={15}/></button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

      </div>
      <nav style={{display:"flex",borderTop:`1px solid ${T.border}`,background:T.ink0,padding:"8px 0 4px",flexShrink:0}}>
        {nav.map(n=>{
          const act=page===n.id;
          return <button key={n.id} onClick={()=>setPage(n.id)} aria-label={n.label} aria-current={act?"page":undefined}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 4px",border:"none",background:"none",cursor:"pointer",color:act?T.brand500:T.ink400,fontFamily:"inherit"}}>
            <div style={{width:36,height:36,borderRadius:T.r.md,background:act?T.brand100:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.15s"}}>
              <Icon name={n.icon} size={20} color={act?T.brand500:T.ink400}/>
            </div>
          </button>;
        })}
      </nav>
    </div>
  );
}