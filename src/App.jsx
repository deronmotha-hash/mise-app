import { useState, useEffect, useMemo, useCallback } from "react";
// Mise — Weekly Meal Planner & Grocery App

/* ─── Fonts ─────────────────────────────────────────── */
{
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

/* ─── Types ─────────────────────────────────────────── */
// Ingredient, Recipe, MealEntry, Week, GroceryItem

/* ─── Design tokens ─────────────────────────────────── */
const T = {
  brand500:"#4F46E5",brand700:"#3730A3",brand100:"#EEF2FF",
  ink900:"#111827",ink700:"#374151",ink500:"#6B7280",
  ink400:"#9CA3AF",ink300:"#D1D5DB",ink200:"#E5E7EB",
  ink100:"#F3F4F6",ink50:"#F9FAFB",ink0:"#FFFFFF",
  border:"#F0F0F0",borderInput:"#E5E7EB",divider:"#F5F5F5",
  danger:"#EF4444",dangerTint:"#FFF5F5",dangerBorder:"#FECACA",
  r:{xs:6,sm:10,md:12,lg:16,xl:20,pill:999},
  shadow:{sm:"0 1px 4px rgba(0,0,0,0.08)",md:"0 4px 16px rgba(0,0,0,0.10)"},
  font:{serif:'"Instrument Serif",Georgia,serif',sans:'"Geist",system-ui,sans-serif'},
};
const SLOT = {
  Breakfast:{bg:"#FEF9C3",text:"#854D0E",border:"#FDE047"},
  Lunch:    {bg:"#DCFCE7",text:"#166534",border:"#86EFAC"},
  Dinner:   {bg:"#DBEAFE",text:"#1E40AF",border:"#93C5FD"},
  Snack:    {bg:"#FCE7F3",text:"#9D174D",border:"#F9A8D4"},
};

/* ─── Inline SVG icons ───────────────────────────────── */
const PATHS = {
  calendar:'<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M16 3v4M8 3v4M4 11h16"/>',
  book:'<path d="M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6v13M12 6v13M21 6v13"/>',
  "shopping-cart":'<path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/><path d="M17 17H6V3H4M6 5l14 1-1 7H6"/>',
  "clipboard-list":'<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z"/><path d="M9 12l.01 0M13 12l2 0M9 16l.01 0M13 16l2 0"/>',
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
  "list-check":'<path d="M3.5 5.5l1.5 1.5l2.5-2.5M3.5 11.5l1.5 1.5l2.5-2.5M3.5 17.5l1.5 1.5l2.5-2.5M11 6l9 0M11 12l9 0M11 18l9 0"/>',
  "chef-hat":'<path d="M12 3a5 5 0 0 1 4.546 2.914a5 5 0 0 1 5.454 4.586a4.99 4.99 0 0 1 -2 4v1a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-1a4.99 4.99 0 0 1 -2 -4a5 5 0 0 1 5.454 -4.586a5 5 0 0 1 4.546 -2.914z"/><path d="M8 19l0 2"/><path d="M12 19l0 2"/><path d="M16 19l0 2"/>',};

function Icon({ name, size=16, color="currentColor", sw=1.75, ariaLabel }) {
  const p = PATHS[name];
  if (!p) return <span style={{display:"inline-block",width:size,height:size,border:"1px dashed #ef4444",borderRadius:3}}/>;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{display:"inline-block",flexShrink:0,verticalAlign:"-0.15em"}}
      aria-label={ariaLabel} aria-hidden={!ariaLabel}
      dangerouslySetInnerHTML={{__html:p}}/>
  );
}

/* ─── Primitives ─────────────────────────────────────── */
const Inp = { width:"100%",padding:"10px 14px",border:`1.5px solid ${T.borderInput}`,borderRadius:T.r.md,fontSize:14,boxSizing:"border-box",background:T.ink50,color:T.ink900,outline:"none",fontFamily:"inherit" };

function Btn({ variant="primary", children, onClick, disabled, style, ariaLabel, ...r }) {
  const base = { display:"inline-flex",alignItems:"center",gap:6,fontFamily:T.font.sans,fontWeight:500,fontSize:14,borderRadius:T.r.md,cursor:disabled?"not-allowed":"pointer",border:"none",opacity:disabled?0.4:1,transition:"opacity 0.15s"};
  const v = variant==="primary" ? {background:T.brand500,color:T.ink0,padding:"10px 18px"} : {background:"none",color:T.ink900,border:`1.5px solid ${T.borderInput}`,padding:"8px 14px"};
  const danger = variant==="danger" ? {background:"none",color:T.danger,border:`1.5px solid ${T.dangerBorder}`,padding:"8px 14px"} : {};
  return <button onClick={onClick} disabled={disabled} aria-label={ariaLabel} style={{...base,...v,...danger,...style}} {...r}>{children}</button>;
}

function IconBtn({ variant="default", size=34, icon, onClick, ariaLabel, style }) {
  const vs = { default:{borderColor:T.borderInput,color:T.ink500,bg:"none"}, danger:{borderColor:T.dangerBorder,color:T.danger,bg:T.dangerTint}, accent:{borderColor:T.brand500,color:T.brand500,bg:T.brand100}, ghost:{borderColor:"transparent",color:T.ink400,bg:"none"} };
  const v = vs[variant] || vs.default;
  return (
    <button onClick={onClick} aria-label={ariaLabel}
      style={{width:size,height:size,border:variant==="ghost"?"none":`1.5px solid ${v.borderColor}`,borderRadius:T.r.sm,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:v.color,background:v.bg,flexShrink:0,...style}}>
      <Icon name={icon} size={Math.round(size*0.47)}/>
    </button>
  );
}

function SlotPill({ slot }) {
  const c = SLOT[slot] || {bg:T.ink100,text:T.ink500,border:T.ink300};
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
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
      <div>{eyebrow&&<Eyebrow>{eyebrow}</Eyebrow>}<h1 style={{margin:0,fontFamily:T.font.sans,fontSize:22,fontWeight:500,color:T.ink900}}>{title}</h1></div>
      {action}
    </div>
  );
}
function StatCard({ label, value }) {
  return <div style={{background:T.ink50,borderRadius:T.r.lg,padding:"14px 16px"}}><Eyebrow>{label}</Eyebrow><p style={{margin:"4px 0 0",fontFamily:T.font.sans,fontSize:28,fontWeight:500,color:T.ink900}}>{value}</p></div>;
}
function ProgressBar({ value }) {
  return <div style={{height:6,borderRadius:T.r.pill,background:T.ink100,overflow:"hidden",marginBottom:20}}><div style={{height:"100%",borderRadius:T.r.pill,background:T.brand500,width:`${Math.round(value*100)}%`,transition:"width 0.3s"}}/></div>;
}
function PillToggle({ options, value, onChange }) {
  return (
    <div style={{display:"flex",gap:4,background:T.ink100,borderRadius:T.r.md,padding:4}}>
      {options.map(o=><button key={o.id} onClick={()=>onChange(o.id)} aria-pressed={value===o.id} style={{flex:1,padding:"7px 0",border:"none",borderRadius:T.r.sm,fontSize:13,fontWeight:value===o.id?500:400,cursor:"pointer",fontFamily:"inherit",background:value===o.id?T.ink0:"transparent",color:value===o.id?T.brand700:T.ink500,boxShadow:value===o.id?T.shadow.sm:"none",transition:"all 0.15s"}}>{o.label}</button>)}
    </div>
  );
}

function IngredientSearch({ directory, onSelect, placeholder }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const hits = useMemo(() => q.trim() ? directory.filter(d=>d.name.toLowerCase().includes(q.toLowerCase())).slice(0,6) : [], [q, directory]);
  return (
    <div style={{position:"relative",zIndex:30}}>
      <input style={Inp} placeholder={placeholder||"Search directory..."} value={q}
        aria-label={placeholder||"Search ingredient directory"}
        onChange={e=>{setQ(e.target.value);setOpen(true);}}
        onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),150)}/>
      {open&&hits.length>0&&(
        <div role="listbox" style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:9999,borderRadius:T.r.md,overflow:"hidden",border:`1px solid ${T.borderInput}`,backgroundColor:T.ink0,boxShadow:T.shadow.md}}>
          {hits.map(d=>(
            <div key={d.id} role="option" aria-selected="false" onMouseDown={e=>{e.preventDefault();onSelect(d);setQ("");setOpen(false);}}
              style={{padding:"10px 14px",fontSize:14,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.divider}`,backgroundColor:T.ink0,fontFamily:T.font.sans}}
              onMouseOver={e=>e.currentTarget.style.backgroundColor=T.ink50}
              onMouseOut={e=>e.currentTarget.style.backgroundColor=T.ink0}>
              <span style={{color:T.ink900}}>{d.name}</span>
              <span style={{fontSize:12,color:T.ink400}}>{d.cat}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────── */
const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const DEFAULT_MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack"];
const CAT_ORDER = ["Produce","Meat","Fish","Dairy","Bakery","Dry Goods","Canned Goods","Condiments","Other"];
const uuid = () => crypto.randomUUID();

const BUILT_IN_RECIPES = [
  { id:"r1", name:"Spaghetti Bolognese", category:"Pasta",
    steps:["Fry diced onion and garlic in olive oil over medium heat until soft, about 5 minutes.","Add beef mince and brown all over, breaking up lumps.","Stir in tinned tomatoes, season, and simmer for 20 minutes.","Cook spaghetti per packet instructions. Drain and serve topped with the sauce."],
    ingredients:[{id:"i1",name:"Spaghetti",qty:200,unit:"g",cat:"Dry Goods"},{id:"i2",name:"Beef mince",qty:300,unit:"g",cat:"Meat"},{id:"i3",name:"Tinned tomatoes",qty:400,unit:"g",cat:"Canned Goods"},{id:"i4",name:"Onion",qty:1,unit:"",cat:"Produce"},{id:"i5",name:"Garlic",qty:2,unit:"cloves",cat:"Produce"},{id:"i6",name:"Olive oil",qty:2,unit:"tbsp",cat:"Condiments"}]},
  { id:"r2", name:"Chicken Stir Fry", category:"Asian",
    steps:["Slice chicken into strips and season lightly.","Heat a wok over high heat and stir-fry chicken until cooked through, about 4 minutes.","Add broccoli and bell pepper; stir-fry 3 more minutes.","Pour in soy sauce and toss to coat. Serve over steamed rice."],
    ingredients:[{id:"i7",name:"Chicken breast",qty:300,unit:"g",cat:"Meat"},{id:"i8",name:"Broccoli",qty:150,unit:"g",cat:"Produce"},{id:"i9",name:"Bell pepper",qty:1,unit:"",cat:"Produce"},{id:"i10",name:"Soy sauce",qty:3,unit:"tbsp",cat:"Condiments"},{id:"i11",name:"Garlic",qty:2,unit:"cloves",cat:"Produce"},{id:"i12",name:"Rice",qty:150,unit:"g",cat:"Dry Goods"}]},
  { id:"r3", name:"Avocado Toast", category:"Breakfast",
    steps:["Toast bread until golden.","Halve and pit avocado; scoop flesh into a bowl and mash with lemon juice.","Spread mashed avocado on toast.","Finish with a pinch of chilli flakes and season to taste."],
    ingredients:[{id:"i13",name:"Bread",qty:2,unit:"slices",cat:"Bakery"},{id:"i14",name:"Avocado",qty:1,unit:"",cat:"Produce"},{id:"i15",name:"Lemon",qty:0.5,unit:"",cat:"Produce"},{id:"i16",name:"Chilli flakes",qty:1,unit:"tsp",cat:"Condiments"}]},
  { id:"r4", name:"Caesar Salad", category:"Salad",
    steps:["Grill or pan-fry chicken breast until cooked through; slice thinly.","Tear romaine lettuce into a large bowl.","Add croutons, sliced chicken, and Parmesan shavings.","Drizzle with Caesar dressing and toss to coat."],
    ingredients:[{id:"i17",name:"Romaine lettuce",qty:1,unit:"head",cat:"Produce"},{id:"i18",name:"Parmesan",qty:50,unit:"g",cat:"Dairy"},{id:"i19",name:"Caesar dressing",qty:3,unit:"tbsp",cat:"Condiments"},{id:"i20",name:"Croutons",qty:50,unit:"g",cat:"Bakery"},{id:"i21",name:"Chicken breast",qty:200,unit:"g",cat:"Meat"}]},
  { id:"r5", name:"Vegetable Curry", category:"Indian",
    steps:["Fry onion and garlic until golden. Add curry powder and cook 1 minute.","Stir in tinned tomatoes and coconut milk; bring to a simmer.","Add chickpeas and cook for 15 minutes until the sauce thickens.","Serve over steamed rice."],
    ingredients:[{id:"i22",name:"Chickpeas",qty:400,unit:"g",cat:"Canned Goods"},{id:"i23",name:"Tinned tomatoes",qty:400,unit:"g",cat:"Canned Goods"},{id:"i24",name:"Onion",qty:1,unit:"",cat:"Produce"},{id:"i25",name:"Garlic",qty:3,unit:"cloves",cat:"Produce"},{id:"i26",name:"Curry powder",qty:2,unit:"tbsp",cat:"Condiments"},{id:"i27",name:"Coconut milk",qty:200,unit:"ml",cat:"Canned Goods"},{id:"i28",name:"Rice",qty:200,unit:"g",cat:"Dry Goods"}]},
  { id:"r6", name:"Pancakes", category:"Breakfast",
    steps:["Whisk flour, sugar, milk, and eggs together until a smooth batter forms.","Melt butter in a non-stick pan over medium heat.","Ladle in batter; cook until bubbles form, then flip and cook 1 more minute.","Serve warm with your choice of toppings."],
    ingredients:[{id:"i29",name:"Flour",qty:150,unit:"g",cat:"Dry Goods"},{id:"i30",name:"Milk",qty:200,unit:"ml",cat:"Dairy"},{id:"i31",name:"Eggs",qty:2,unit:"",cat:"Dairy"},{id:"i32",name:"Butter",qty:20,unit:"g",cat:"Dairy"},{id:"i33",name:"Sugar",qty:1,unit:"tbsp",cat:"Dry Goods"}]},
  { id:"r7", name:"Grilled Salmon", category:"Fish",
    steps:["Pat salmon dry and rub with crushed garlic, lemon juice, and olive oil.","Heat a griddle pan until very hot. Cook salmon skin-side down for 4 minutes.","Flip and cook a further 2–3 minutes depending on thickness.","Serve alongside asparagus, lightly steamed or grilled."],
    ingredients:[{id:"i34",name:"Salmon fillet",qty:300,unit:"g",cat:"Fish"},{id:"i35",name:"Lemon",qty:1,unit:"",cat:"Produce"},{id:"i36",name:"Garlic",qty:1,unit:"clove",cat:"Produce"},{id:"i37",name:"Olive oil",qty:1,unit:"tbsp",cat:"Condiments"},{id:"i38",name:"Asparagus",qty:150,unit:"g",cat:"Produce"}]},
  { id:"r8", name:"Beef Tacos", category:"Mexican",
    steps:["Brown beef mince in a pan; drain excess fat. Add taco seasoning and a splash of water; cook 2 minutes.","Warm taco shells in the oven for 3 minutes at 180°C.","Shred lettuce and dice tomatoes. Grate cheddar.","Fill shells with beef, then top with lettuce, tomato, cheese, and sour cream."],
    ingredients:[{id:"i39",name:"Beef mince",qty:250,unit:"g",cat:"Meat"},{id:"i40",name:"Taco shells",qty:8,unit:"",cat:"Bakery"},{id:"i41",name:"Cheddar cheese",qty:80,unit:"g",cat:"Dairy"},{id:"i42",name:"Lettuce",qty:0.5,unit:"head",cat:"Produce"},{id:"i43",name:"Tomato",qty:2,unit:"",cat:"Produce"},{id:"i44",name:"Sour cream",qty:3,unit:"tbsp",cat:"Dairy"},{id:"i45",name:"Taco seasoning",qty:1,unit:"tbsp",cat:"Condiments"}]},
  { id:"r9", name:"Mushroom Risotto", category:"Italian",
    steps:["Warm stock in a separate pan. Fry onion and garlic in butter until soft.","Add rice and stir for 2 minutes. Pour in white wine and stir until absorbed.","Add stock one ladle at a time, stirring continuously, until rice is creamy and al dente — about 18 minutes.","Remove from heat, stir in Parmesan, season, and rest 2 minutes before serving."],
    ingredients:[{id:"i46",name:"Arborio rice",qty:200,unit:"g",cat:"Dry Goods"},{id:"i47",name:"Mushrooms",qty:250,unit:"g",cat:"Produce"},{id:"i48",name:"Onion",qty:1,unit:"",cat:"Produce"},{id:"i49",name:"Garlic",qty:2,unit:"cloves",cat:"Produce"},{id:"i50",name:"Parmesan",qty:50,unit:"g",cat:"Dairy"},{id:"i51",name:"Vegetable stock",qty:700,unit:"ml",cat:"Canned Goods"},{id:"i52",name:"Butter",qty:30,unit:"g",cat:"Dairy"},{id:"i53",name:"White wine",qty:100,unit:"ml",cat:"Condiments"}]},
  { id:"r10", name:"Greek Salad", category:"Salad",
    steps:["Chop cucumber, tomatoes, and red onion into bite-size pieces.","Combine in a bowl with olives and crumbled feta.","Drizzle with olive oil, season with salt and oregano.","Toss gently and serve immediately."],
    ingredients:[{id:"i54",name:"Cucumber",qty:1,unit:"",cat:"Produce"},{id:"i55",name:"Tomato",qty:3,unit:"",cat:"Produce"},{id:"i56",name:"Feta cheese",qty:100,unit:"g",cat:"Dairy"},{id:"i57",name:"Olives",qty:50,unit:"g",cat:"Canned Goods"},{id:"i58",name:"Red onion",qty:0.5,unit:"",cat:"Produce"},{id:"i59",name:"Olive oil",qty:2,unit:"tbsp",cat:"Condiments"}]},
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

const mkWeek = (id, label) => ({ id, label, days: Object.fromEntries(ALL_DAYS.map(d=>[d,[]])) });
const initRecipe = () => ({ name:"", category:"", steps:[""], ingredients:[{id:uuid(),name:"",qty:"",unit:"",cat:"Produce"}] });

/* ─── Safer localStorage hook ────────────────────────── */
function loadStorage() {
  try {
    const raw = localStorage.getItem("mise_v2");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function useAppState() {
  const saved = useMemo(() => loadStorage(), []);
  const [weeks, setWeeks] = useState(() => saved?.weeks || [mkWeek(uuid(),"Week 1")]);
  const [weekStart, setWeekStart] = useState(() => saved?.weekStart || "Monday");
  const [plannerView, setPlannerView] = useState(() => saved?.plannerView || "scroll");
  const [customRecipes, setCustomRecipes] = useState(() => saved?.customRecipes || []);
  const [customTypes, setCustomTypes] = useState(() => saved?.customTypes || []);
  const [checked, setChecked] = useState(() => saved?.checked || {});
  const [hidden, setHidden] = useState(() => saved?.hidden || {});
  const [customGrocery, setCustomGrocery] = useState(() => saved?.customGrocery || []);
  const [dir, setDir] = useState(() => saved?.dir || SEED_DIR);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("mise_v2", JSON.stringify({weeks,weekStart,plannerView,customRecipes,customTypes,checked,hidden,customGrocery,dir}));
    } catch {}
  }, [hydrated,weeks,weekStart,plannerView,customRecipes,customTypes,checked,hidden,customGrocery,dir]);

  return { weeks,setWeeks,weekStart,setWeekStart,plannerView,setPlannerView,customRecipes,setCustomRecipes,customTypes,setCustomTypes,checked,setChecked,hidden,setHidden,customGrocery,setCustomGrocery,dir,setDir };
}

/* ─── Grocery list hook ──────────────────────────────── */
function useGroceryList(weeks, allRecipes, customGrocery) {
  return useMemo(() => {
    // Key by name+unit+cat to avoid merging different units
    const map = {};
    weeks.forEach(w => Object.values(w.days).forEach(ms => ms.forEach(entry => {
      const r = allRecipes.find(x => x.id === entry.recipeId);
      if (!r) return;
      r.ingredients.forEach(ing => {
        const qty = parseFloat(ing.qty);
        if (isNaN(qty)) return; // skip invalid
        const key = `${ing.name.toLowerCase().trim()}|${(ing.unit||"").toLowerCase().trim()}|${ing.cat}`;
        if (map[key]) map[key].qty += qty * entry.portions;
        else map[key] = { ...ing, qty: qty * entry.portions, _key: key, isCustom: false };
      });
    })));

    customGrocery.forEach(it => {
      const key = `cg_${it.id}`;
      map[key] = { ...it, _key: key, isCustom: true };
    });

    const byCat = {};
    Object.values(map).forEach(it => {
      const c = it.cat || "Other";
      if (!byCat[c]) byCat[c] = [];
      byCat[c].push(it);
    });
    return byCat;
  }, [weeks, allRecipes, customGrocery]);
}

function fmtQty(n) {
  if (!n && n !== 0) return "";
  const r = Math.round(n * 100) / 100;
  return r % 1 === 0 ? String(r) : r.toFixed(2).replace(/\.?0+$/, "");
}
function orderedDays(start) {
  const i = ALL_DAYS.indexOf(start);
  return i <= 0 ? ALL_DAYS : [...ALL_DAYS.slice(i), ...ALL_DAYS.slice(0, i)];
}
function groupEntries(entries) {
  const g = {};
  entries.forEach(e => {
    if (!g[e.mealType]) g[e.mealType] = [];
    const ex = g[e.mealType].find(x => x.recipeId === e.recipeId);
    if (ex) { ex.portions += e.portions; ex.entryIds.push(e.entryId); }
    else g[e.mealType].push({ ...e, entryIds: [e.entryId] });
  });
  return g;
}

/* ─── Planner add-to-plan panel ──────────────────────── */
function PlannerPanel({ recipe, weeks, allMealTypes, onConfirm, onClose }) {
  const [mt, setMt] = useState("Dinner");
  const [pts, setPts] = useState(1);
  const [wkId, setWkId] = useState(weeks[0]?.id || "");
  const [pending, setPending] = useState(null);
  const wk = weeks.find(w => w.id === wkId) || weeks[0];
  return (
    <div style={{marginTop:14,borderTop:`1px solid ${T.border}`,paddingTop:14}}>
      <div style={{display:"grid",gridTemplateColumns:weeks.length>1?"1fr 1fr 1fr":"1fr 1fr",gap:10,marginBottom:14}}>
        {weeks.length > 1 && (
          <div><Label>Week</Label>
            <select style={{...Inp,padding:"8px 12px"}} value={wkId} aria-label="Select week" onChange={e=>{setWkId(e.target.value);setPending(null);}}>
              {weeks.map(w=><option key={w.id} value={w.id}>{w.label}</option>)}
            </select>
          </div>
        )}
        <div><Label>Meal slot</Label>
          <select style={{...Inp,padding:"8px 12px"}} value={mt} aria-label="Select meal slot" onChange={e=>setMt(e.target.value)}>
            {allMealTypes.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div><Label>Portions</Label>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
            <Btn variant="ghost" style={{padding:"6px 12px",fontSize:16}} ariaLabel="Decrease portions" onClick={()=>setPts(p=>Math.max(1,p-1))}>−</Btn>
            <span style={{fontSize:16,fontWeight:500,minWidth:20,textAlign:"center",fontFamily:T.font.sans}} aria-live="polite">{pts}</span>
            <Btn variant="ghost" style={{padding:"6px 12px",fontSize:16}} ariaLabel="Increase portions" onClick={()=>setPts(p=>p+1)}>+</Btn>
          </div>
        </div>
      </div>
      <Eyebrow style={{marginBottom:8}}>Select a day</Eyebrow>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
        {ALL_DAYS.map(day => {
          const ex = wk?.days[day] || [];
          const ip = pending === day;
          return (
            <div key={day} style={{border:`1.5px solid ${ip?T.brand500:T.border}`,borderRadius:T.r.md,background:ip?T.brand100:T.ink0,padding:"8px 12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontWeight:500,fontSize:13,minWidth:88,flexShrink:0,fontFamily:T.font.sans,color:ip?T.brand700:T.ink900}}>{day}</span>
                <div style={{flex:1,display:"flex",flexWrap:"wrap",gap:3,minWidth:0}}>
                  {ex.length === 0 ? <span style={{fontSize:12,color:T.ink400,fontFamily:T.font.sans}}>Empty</span> : ex.map((e,i)=><SlotPill key={i} slot={e.mealType}/>)}
                </div>
                {!ip
                  ? <Btn variant="ghost" style={{padding:"5px 12px",fontSize:12,flexShrink:0}} onClick={()=>setPending(day)}>Add</Btn>
                  : <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <Btn style={{padding:"5px 12px",fontSize:12}} onClick={()=>{onConfirm(wk.id,day,recipe.id,mt,pts);setPending(null);}}>Confirm</Btn>
                      <Btn variant="ghost" style={{padding:"5px 10px",fontSize:12}} ariaLabel="Cancel" onClick={()=>setPending(null)}><Icon name="x" size={14}/></Btn>
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

/* ─── Recipe form ────────────────────────────────────── */
function RecipeForm({ initial, directory, onSave, onCancel, label }) {
  const [rec, setRec] = useState(initial);
  const updIng = (idx, field, val) => setRec(p=>({...p,ingredients:p.ingredients.map((x,i)=>i===idx?{...x,[field]:val}:x)}));
  const updStep = (idx, val) => setRec(p=>({...p,steps:p.steps.map((s,i)=>i===idx?val:s)}));
  return (
    <Card accent style={{marginBottom:16}}>
      <p style={{fontWeight:500,fontSize:15,margin:"0 0 12px",fontFamily:T.font.sans}}>{label}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <div><Label htmlFor="rec-name">Name</Label><input id="rec-name" style={{...Inp,padding:"8px 10px"}} value={rec.name} onChange={e=>setRec(p=>({...p,name:e.target.value}))} placeholder="e.g. Pasta..."/></div>
        <div><Label htmlFor="rec-cat">Category</Label><input id="rec-cat" style={{...Inp,padding:"8px 10px"}} value={rec.category} onChange={e=>setRec(p=>({...p,category:e.target.value}))} placeholder="e.g. Italian"/></div>
      </div>

      <Eyebrow style={{marginBottom:6}}>Ingredients</Eyebrow>
      <div style={{marginBottom:10,position:"relative",zIndex:50}}>
        <IngredientSearch directory={directory} placeholder="Search directory to add..." onSelect={d=>setRec(p=>({...p,ingredients:[...p.ingredients,{id:uuid(),name:d.name,qty:"",unit:d.unit,cat:d.cat}]}))}/>
      </div>
      {rec.ingredients.map((ing,i)=>(
        <div key={ing.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr auto",gap:6,marginBottom:6}}>
          <input aria-label="Ingredient name" style={{...Inp,padding:"8px 10px"}} placeholder="Name" value={ing.name} onChange={e=>updIng(i,"name",e.target.value)}/>
          <input aria-label="Quantity" style={{...Inp,padding:"8px 10px"}} placeholder="Qty" value={ing.qty} onChange={e=>updIng(i,"qty",e.target.value)}/>
          <input aria-label="Unit" style={{...Inp,padding:"8px 10px"}} placeholder="Unit" value={ing.unit} onChange={e=>updIng(i,"unit",e.target.value)}/>
          <select aria-label="Category" style={{...Inp,padding:"8px 6px"}} value={ing.cat} onChange={e=>updIng(i,"cat",e.target.value)}>
            {CAT_ORDER.map(c=><option key={c}>{c}</option>)}
          </select>
          <IconBtn variant="danger" size={34} icon="trash" ariaLabel={`Remove ${ing.name||"ingredient"}`} onClick={()=>setRec(p=>({...p,ingredients:p.ingredients.filter((_,j)=>j!==i)}))}/>
        </div>
      ))}
      <Btn variant="ghost" style={{fontSize:12,marginBottom:16,padding:"6px 12px"}} onClick={()=>setRec(p=>({...p,ingredients:[...p.ingredients,{id:uuid(),name:"",qty:"",unit:"",cat:"Produce"}]}))}><Icon name="plus" size={13}/>Add row</Btn>

      <Eyebrow style={{marginBottom:6}}>Method</Eyebrow>
      {rec.steps.map((step,i)=>(
        <div key={i} style={{display:"flex",gap:6,marginBottom:6,alignItems:"flex-start"}}>
          <span style={{fontFamily:T.font.sans,fontSize:12,color:T.ink400,fontWeight:500,minWidth:20,paddingTop:11}}>{i+1}.</span>
          <textarea aria-label={`Step ${i+1}`} rows={2} style={{...Inp,padding:"8px 10px",resize:"vertical",flex:1}} value={step} onChange={e=>updStep(i,e.target.value)} placeholder={`Step ${i+1}...`}/>
          <IconBtn variant="danger" size={30} icon="trash" ariaLabel={`Remove step ${i+1}`} onClick={()=>setRec(p=>({...p,steps:p.steps.filter((_,j)=>j!==i)}))} style={{marginTop:4}}/>
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

/* ─── Recipe expanded detail ─────────────────────────── */
function RecipeDetail({ recipe }) {
  const [tab, setTab] = useState("ingredients");
  return (
    <div style={{marginTop:14,borderTop:`1px solid ${T.border}`,paddingTop:14}}>
      <div style={{marginBottom:12}}>
        <PillToggle options={[{id:"ingredients",label:"Ingredients"},{id:"method",label:"Method"}]} value={tab} onChange={setTab}/>
      </div>
      {tab === "ingredients" && (
        <div>
          {recipe.ingredients.map((ing,i)=>(
            <div key={ing.id||i} style={{display:"flex",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.divider}`,gap:8}}>
              <span style={{flex:1,fontSize:14,fontFamily:T.font.sans,color:T.ink900}}>{ing.name}</span>
              <span style={{fontSize:13,color:T.ink500,fontFamily:T.font.sans}}>{fmtQty(ing.qty)} {ing.unit}</span>
              <Tag>{ing.cat}</Tag>
            </div>
          ))}
        </div>
      )}
      {tab === "method" && (
        <div>
          {(!recipe.steps || recipe.steps.length === 0 || (recipe.steps.length === 1 && !recipe.steps[0])) ? (
            <p style={{fontSize:13,color:T.ink400,fontFamily:T.font.sans}}>No method added yet. Edit the recipe to add steps.</p>
          ) : recipe.steps.map((step,i) => (
            <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.divider}`}}>
              <div style={{minWidth:24,height:24,borderRadius:T.r.pill,background:T.brand100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <span style={{fontSize:11,fontWeight:500,color:T.brand700,fontFamily:T.font.sans}}>{i+1}</span>
              </div>
              <p style={{margin:0,fontSize:14,fontFamily:T.font.sans,color:T.ink900,lineHeight:1.5}}>{step}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Cook View ──────────────────────────────────────── */
function CookView({ allRecipes }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(0);
  const [cookTab, setCookTab] = useState("ingredients");

  const filtered = useMemo(() =>
    allRecipes.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
    ), [allRecipes, search]);

  const openRecipe = (r) => { setSelected(r); setStep(0); setCookTab("ingredients"); };
  const closeRecipe = () => setSelected(null);
  const steps = selected?.steps?.filter(s => s.trim()) || [];

  if (selected) {
    return (
      <div style={{padding:"0 0 20px"}}>
        {/* Header */}
        <div style={{padding:"20px 16px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12}}>
          <button onClick={closeRecipe} aria-label="Back to recipe list"
            style={{width:36,height:36,borderRadius:T.r.md,border:`1.5px solid ${T.borderInput}`,background:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.ink500,flexShrink:0}}>
            <Icon name="chevron-left" size={18}/>
          </button>
          <div style={{flex:1,minWidth:0}}>
            <p style={{margin:0,fontSize:11,fontWeight:500,color:T.ink400,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:T.font.sans}}>{selected.category}</p>
            <h2 style={{margin:0,fontSize:20,fontWeight:500,fontFamily:T.font.sans,color:T.ink900,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{selected.name}</h2>
          </div>
        </div>

        {/* Tab toggle */}
        <div style={{padding:"14px 16px 0"}}>
          <PillToggle
            options={[{id:"ingredients",label:"Ingredients"},{id:"method",label:"Method"}]}
            value={cookTab} onChange={t=>{setCookTab(t);setStep(0);}}/>
        </div>

        {/* Ingredients view */}
        {cookTab==="ingredients" && (
          <div style={{padding:"14px 16px 0"}}>
            <p style={{fontSize:13,color:T.ink400,margin:"0 0 12px",fontFamily:T.font.sans}}>{selected.ingredients.length} ingredients</p>
            {selected.ingredients.map((ing,i)=>(
              <div key={ing.id||i} style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.divider}`,gap:10}}>
                <div style={{width:28,height:28,borderRadius:T.r.pill,background:T.ink100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:11,fontWeight:500,color:T.ink500,fontFamily:T.font.sans}}>{i+1}</span>
                </div>
                <span style={{flex:1,fontSize:15,fontFamily:T.font.sans,color:T.ink900}}>{ing.name}</span>
                <span style={{fontSize:14,color:T.ink500,fontFamily:T.font.sans,fontWeight:500}}>{fmtQty(ing.qty)} {ing.unit}</span>
              </div>
            ))}
            {steps.length>0 && (
              <Btn style={{width:"100%",justifyContent:"center",marginTop:20}} onClick={()=>{setCookTab("method");setStep(0);}}>
                Start cooking
              </Btn>
            )}
          </div>
        )}

        {/* Method / step-through view */}
        {cookTab==="method" && (
          <div style={{padding:"14px 16px 0"}}>
            {steps.length===0 ? (
              <p style={{fontSize:14,color:T.ink400,fontFamily:T.font.sans}}>No method added yet. Edit this recipe in the Recipes tab to add steps.</p>
            ) : (
              <>
                {/* Progress indicator */}
                <div style={{display:"flex",gap:4,marginBottom:20}}>
                  {steps.map((_,i)=>(
                    <button key={i} aria-label={`Go to step ${i+1}`} onClick={()=>setStep(i)}
                      style={{flex:1,height:4,borderRadius:T.r.pill,border:"none",cursor:"pointer",padding:0,background:i<=step?T.brand500:T.ink200,transition:"background 0.2s"}}/>
                  ))}
                </div>

                {/* Step counter */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <Eyebrow>Step {step+1} of {steps.length}</Eyebrow>
                  <span style={{fontSize:12,color:T.ink400,fontFamily:T.font.sans}}>{Math.round((step+1)/steps.length*100)}% done</span>
                </div>

                {/* Step card */}
                <div style={{background:T.ink50,borderRadius:T.r.lg,padding:"24px 20px",marginBottom:20,minHeight:160,display:"flex",alignItems:"flex-start",gap:16}}>
                  <div style={{width:36,height:36,borderRadius:T.r.pill,background:T.brand500,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:16,fontWeight:500,color:T.ink0,fontFamily:T.font.sans}}>{step+1}</span>
                  </div>
                  <p style={{margin:0,fontSize:16,fontFamily:T.font.sans,color:T.ink900,lineHeight:1.6,flex:1}}>{steps[step]}</p>
                </div>

                {/* Navigation */}
                <div style={{display:"flex",gap:10}}>
                  <Btn variant="ghost" style={{flex:1,justifyContent:"center"}} disabled={step===0}
                    ariaLabel="Previous step" onClick={()=>setStep(s=>Math.max(0,s-1))}>
                    <Icon name="chevron-left" size={16}/> Back
                  </Btn>
                  {step < steps.length-1 ? (
                    <Btn style={{flex:1,justifyContent:"center"}} ariaLabel="Next step" onClick={()=>setStep(s=>s+1)}>
                      Next <Icon name="chevron-right" size={16}/>
                    </Btn>
                  ) : (
                    <Btn style={{flex:1,justifyContent:"center",background:"#10B981"}} onClick={closeRecipe}>
                      <Icon name="check" size={16}/> Done
                    </Btn>
                  )}
                </div>

                {/* All steps overview */}
                <div style={{marginTop:24}}>
                  <Eyebrow style={{marginBottom:10}}>All steps</Eyebrow>
                  {steps.map((s,i)=>(
                    <button key={i} onClick={()=>setStep(i)} aria-label={`Jump to step ${i+1}`}
                      style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.divider}`,width:"100%",background:"none",border:"none",borderBottom:`1px solid ${T.divider}`,cursor:"pointer",textAlign:"left"}}>
                      <div style={{width:24,height:24,borderRadius:T.r.pill,flexShrink:0,background:i<step?T.brand500:i===step?T.brand100:T.ink100,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                        {i<step
                          ? <Icon name="check" size={12} color={T.ink0}/>
                          : <span style={{fontSize:11,fontWeight:500,color:i===step?T.brand700:T.ink400,fontFamily:T.font.sans}}>{i+1}</span>
                        }
                      </div>
                      <p style={{margin:0,fontSize:13,fontFamily:T.font.sans,color:i===step?T.ink900:T.ink500,lineHeight:1.5,flex:1,fontWeight:i===step?500:400}}>{s}</p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Recipe browser
  return (
    <div style={{padding:"20px 16px 0"}}>
      <PageHeader eyebrow="Cook mode" title="Recipes"/>
      <div style={{marginBottom:16}}>
        <input style={{...Inp}} value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search recipes..." aria-label="Search recipes"/>
      </div>
      {filtered.length===0 && <p style={{color:T.ink400,fontSize:14,fontFamily:T.font.sans}}>No recipes found.</p>}
      {filtered.map(r=>{
        const steps = (r.steps||[]).filter(s=>s.trim());
        return (
          <button key={r.id} onClick={()=>openRecipe(r)} aria-label={`Open ${r.name}`}
            style={{display:"flex",alignItems:"center",gap:12,width:"100%",background:T.ink0,border:`1px solid ${T.border}`,borderRadius:T.r.lg,padding:"14px 16px",marginBottom:10,cursor:"pointer",textAlign:"left"}}
            onMouseOver={e=>e.currentTarget.style.background=T.ink50}
            onMouseOut={e=>e.currentTarget.style.background=T.ink0}>
            <div style={{width:44,height:44,borderRadius:T.r.md,background:T.brand100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name="chef-hat" size={22} color={T.brand500}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{margin:0,fontWeight:500,fontSize:15,fontFamily:T.font.sans,color:T.ink900,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}</p>
              <p style={{margin:"2px 0 0",fontSize:12,color:T.ink400,fontFamily:T.font.sans}}>
                {r.ingredients.length} ingredients · {steps.length>0?`${steps.length} steps`:"No method yet"}
              </p>
            </div>
            <Icon name="chevron-right" size={18} color={T.ink300}/>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Main App ───────────────────────────────────────── */
export default function App() {
  const { weeks,setWeeks,weekStart,setWeekStart,plannerView,setPlannerView,customRecipes,setCustomRecipes,customTypes,setCustomTypes,checked,setChecked,hidden,setHidden,customGrocery,setCustomGrocery,dir,setDir } = useAppState();

  const [page, setPage] = useState("planner");
  const [activeIdx, setActiveIdx] = useState(0);
  const [recSearch, setRecSearch] = useState("");
  const [showAddRec, setShowAddRec] = useState(false);
  const [editingRec, setEditingRec] = useState(null);
  const [expandedRec, setExpandedRec] = useState(null);
  const [plannerRec, setPlannerRec] = useState(null);
  const [addDay, setAddDay] = useState(null);
  const [mealSearch, setMealSearch] = useState("");
  const [pendingAdd, setPendingAdd] = useState(null);
  const [addType, setAddType] = useState("Dinner");
  const [addPts, setAddPts] = useState(1);
  const [newTypeInput, setNewTypeInput] = useState("");
  const [newGroc, setNewGroc] = useState({name:"",qty:"",unit:"",cat:"Produce"});
  const [grocErr, setGrocErr] = useState("");
  const [showAddGroc, setShowAddGroc] = useState(false);
  const [dirSearch, setDirSearch] = useState("");
  const [newDirE, setNewDirE] = useState({name:"",unit:"",cat:"Produce"});
  const [showAddDir, setShowAddDir] = useState(false);
  const [renamingWk, setRenamingWk] = useState(null);

  const allMealTypes = useMemo(() => [...DEFAULT_MEAL_TYPES, ...customTypes], [customTypes]);

  // Built-in recipe IDs for guard checks
  const builtInIds = useMemo(() => new Set(BUILT_IN_RECIPES.map(r=>r.id)), []);

  // Merge: custom overrides shadow built-ins by id
  const allRecipes = useMemo(() => {
    const overriddenIds = new Set(customRecipes.map(r=>r.id));
    const base = BUILT_IN_RECIPES.filter(r=>!overriddenIds.has(r.id));
    return [...base, ...customRecipes];
  }, [customRecipes]);

  const filteredRecipes = useMemo(() =>
    allRecipes.filter(r=>r.name.toLowerCase().includes(recSearch.toLowerCase()) || r.ingredients.some(i=>i.name.toLowerCase().includes(recSearch.toLowerCase()))),
  [allRecipes, recSearch]);

  const filteredMealSearch = useMemo(() => allRecipes.filter(r=>r.name.toLowerCase().includes(mealSearch.toLowerCase())), [allRecipes, mealSearch]);
  const filteredDir = useMemo(() => dir.filter(d=>d.name.toLowerCase().includes(dirSearch.toLowerCase()) || d.cat.toLowerCase().includes(dirSearch.toLowerCase())), [dir, dirSearch]);
  const DAYS = useMemo(() => orderedDays(weekStart), [weekStart]);

  const grocByCat = useGroceryList(weeks, allRecipes, customGrocery);
  const glCats = useMemo(() => CAT_ORDER.filter(c=>grocByCat[c]), [grocByCat]);
  const allGlKeys = useMemo(() => glCats.flatMap(c=>grocByCat[c].map(i=>i._key)), [glCats, grocByCat]);
  const visKeys = useMemo(() => allGlKeys.filter(k=>!hidden[k]), [allGlKeys, hidden]);
  const checkedCt = useMemo(() => visKeys.filter(k=>checked[k]).length, [visKeys, checked]);
  const totalVis = visKeys.length;
  const totalMeals = useMemo(() => weeks.reduce((s,w)=>s+Object.values(w.days).reduce((ss,m)=>ss+m.length,0),0), [weeks]);

  const updDay = useCallback((wid, day, fn) =>
    setWeeks(ws=>ws.map(w=>w.id===wid?{...w,days:{...w.days,[day]:fn(w.days[day]||[])}}:w)), [setWeeks]);

  const addWeek = useCallback(() => {
    if (weeks.length >= 5) return;
    const id = uuid();
    setWeeks(ws=>[...ws,mkWeek(id,`Week ${ws.length+1}`)]);
    setActiveIdx(weeks.length);
  }, [weeks.length, setWeeks]);

  const removeWeek = useCallback(id => {
    if (weeks.length === 1) return;
    setWeeks(ws=>ws.filter(w=>w.id!==id).map((w,i)=>({...w,label:`Week ${i+1}`})));
    setActiveIdx(i=>Math.max(0,i-1));
  }, [weeks.length, setWeeks]);

  const handleSaveRecipe = useCallback((rec) => {
    if (!rec.name.trim()) return;
    const cleaned = { ...rec, ingredients: rec.ingredients.filter(i=>i.name.trim()), steps: rec.steps.filter(s=>s.trim()) };
    // If editing a built-in, save as override with same id (shadows it in allRecipes)
    // If editing a custom, update in place
    // If new, assign fresh id
    if (editingRec) {
      if (customRecipes.find(x=>x.id===cleaned.id)) {
        setCustomRecipes(p=>p.map(r=>r.id===cleaned.id?cleaned:r));
      } else {
        // built-in override: keep same id so planner refs still work
        setCustomRecipes(p=>[...p, cleaned]);
      }
      setEditingRec(null);
    } else {
      setCustomRecipes(p=>[...p, { ...cleaned, id: uuid() }]);
      setShowAddRec(false);
    }
    setExpandedRec(null);
  }, [editingRec, customRecipes, setCustomRecipes]);

  const deleteRecipe = useCallback(id => {
    if (builtInIds.has(id)) {
      // Remove override if exists; don't delete the built-in itself
      setCustomRecipes(p=>p.filter(r=>r.id!==id));
    } else {
      setCustomRecipes(p=>p.filter(r=>r.id!==id));
    }
    setWeeks(ws=>ws.map(w=>({...w,days:Object.fromEntries(Object.entries(w.days).map(([d,ms])=>[d,ms.filter(e=>e.recipeId!==id)]))})));
  }, [builtInIds, setCustomRecipes, setWeeks]);

  const confirmPlan = useCallback((wid,day,rid,mt,pts) =>
    updDay(wid, day, arr=>[...arr, {entryId:uuid(), recipeId:rid, mealType:mt, portions:pts}]),
  [updDay]);

  const getName = useCallback(e => allRecipes.find(x=>x.id===e.recipeId)?.name || "?", [allRecipes]);

  const nav = [
    {id:"planner",icon:"calendar",label:"Planner"},
    {id:"recipes",icon:"book",label:"Recipes"},
    {id:"cook",icon:"chef-hat",label:"Cook"},
    {id:"grocery",icon:"shopping-cart",label:"Grocery"},
    {id:"summary",icon:"clipboard-list",label:"Summary"},
    {id:"settings",icon:"settings",label:"Settings"},
  ];

  /* ── Week card renderer ── */
  const renderWeekCard = (wk) => (
    <div key={wk.id} style={{background:T.ink0,border:`1px solid ${T.border}`,borderRadius:T.r.lg,marginBottom:12,overflow:"hidden"}}>
      <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.divider}`}}>
        {renamingWk === wk.id
          ? <input autoFocus aria-label="Rename week" style={{...Inp,fontWeight:500,fontSize:15,maxWidth:160,padding:"6px 10px"}} defaultValue={wk.label}
              onBlur={e=>{setWeeks(ws=>ws.map(w=>w.id===wk.id?{...w,label:e.target.value||w.label}:w));setRenamingWk(null);}}
              onKeyDown={e=>{if(e.key==="Enter"){setWeeks(ws=>ws.map(w=>w.id===wk.id?{...w,label:e.target.value||w.label}:w));setRenamingWk(null);}}}/>
          : <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontWeight:500,fontSize:16,fontFamily:T.font.sans,color:T.ink900}}>{wk.label}</span>
              <IconBtn variant="ghost" size={26} icon="edit" ariaLabel="Rename week" onClick={()=>setRenamingWk(wk.id)}/>
            </div>
        }
        <div style={{display:"flex",gap:6}}>
          <Btn variant="ghost" style={{padding:"5px 10px",fontSize:12}} onClick={()=>setWeeks(ws=>ws.map(w=>w.id===wk.id?mkWeek(w.id,w.label):w))}>Reset</Btn>
          {weeks.length > 1 && <IconBtn variant="danger" size={30} icon="trash" ariaLabel="Remove week" onClick={()=>removeWeek(wk.id)}/>}
        </div>
      </div>

      {DAYS.map(day => {
        const rawEntries = wk.days[day] || [];
        // Entries with stable entryId (back-compat: add one if missing)
        const entries = rawEntries.map((e,i) => ({...e, entryId: e.entryId || `legacy_${i}`}));
        const grouped = groupEntries(entries);
        const types = Object.keys(grouped).sort((a,b)=>allMealTypes.indexOf(a)-allMealTypes.indexOf(b));
        return (
          <div key={day} style={{borderTop:`1px solid ${T.divider}`,padding:"12px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:types.length?8:0}}>
              <span style={{fontWeight:500,fontSize:14,fontFamily:T.font.sans,color:T.ink900}}>{day}</span>
              <IconBtn variant="accent" size={28} icon="plus" ariaLabel={`Add meal to ${day}`}
                onClick={()=>{setAddDay({weekId:wk.id,day});setMealSearch("");}}/>
            </div>

            {types.length === 0 && <p style={{fontSize:13,color:T.ink400,margin:0,fontFamily:T.font.sans}}>Nothing planned</p>}

            {types.map(type => (
              <div key={type} style={{marginBottom:6}}>
                <SlotPill slot={type}/>
                <div style={{paddingLeft:12,marginTop:4,display:"flex",flexDirection:"column",gap:3}}>
                  {grouped[type].map((e,i) => (
                    <div key={e.entryIds[0]} style={{display:"flex",alignItems:"center",gap:6,fontSize:14,fontFamily:T.font.sans}}>
                      <span style={{flex:1,color:T.ink900}}>{getName(e)}</span>
                      {e.portions > 1 && <span style={{fontSize:12,color:T.ink400,fontWeight:500}}>×{e.portions}</span>}
                      {/* Remove individual meal entry */}
                      <button aria-label={`Remove ${getName(e)} from ${day}`}
                        onClick={()=>updDay(wk.id,day,arr=>arr.filter(a=>!e.entryIds.includes(a.entryId||"")))}
                        style={{border:"none",background:"none",cursor:"pointer",color:T.ink300,padding:0,lineHeight:1}}>
                        <Icon name="x" size={12}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {addDay?.weekId===wk.id && addDay?.day===day && (
              <div style={{marginTop:10,padding:12,background:T.ink50,borderRadius:T.r.md,border:`1px solid ${T.borderInput}`}}>
                <input style={{...Inp,marginBottom:8}} placeholder="Search recipes..." aria-label="Search recipes to add" value={mealSearch} onChange={e=>setMealSearch(e.target.value)} autoFocus/>
                <div role="listbox" style={{maxHeight:160,overflowY:"auto",borderRadius:T.r.sm,border:`1px solid ${T.borderInput}`,background:T.ink0}}>
                  {filteredMealSearch.map(r=>(
                    <div key={r.id} role="option" aria-selected="false"
                      onClick={()=>{setPendingAdd({weekId:wk.id,day,recipeId:r.id});setAddDay(null);setMealSearch("");}}
                      style={{padding:"10px 14px",cursor:"pointer",fontSize:14,borderBottom:`1px solid ${T.divider}`,display:"flex",justifyContent:"space-between",fontFamily:T.font.sans}}
                      onMouseOver={e=>e.currentTarget.style.background=T.ink50} onMouseOut={e=>e.currentTarget.style.background=T.ink0}>
                      <span style={{color:T.ink900}}>{r.name}</span><span style={{fontSize:12,color:T.ink400}}>{r.category}</span>
                    </div>
                  ))}
                </div>
                <Btn variant="ghost" style={{marginTop:8,fontSize:12,padding:"5px 12px"}} onClick={()=>setAddDay(null)}>Cancel</Btn>
              </div>
            )}

            {pendingAdd?.weekId===wk.id && pendingAdd?.day===day && (
              <div style={{marginTop:10,padding:12,background:T.brand100,borderRadius:T.r.md,border:`1px solid ${T.brand500}`}}>
                <p style={{fontSize:13,fontWeight:500,margin:"0 0 10px",color:T.brand700,fontFamily:T.font.sans}}>Adding: {getName({recipeId:pendingAdd.recipeId})}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <div><Label htmlFor="plan-slot">Meal slot</Label>
                    <select id="plan-slot" style={{...Inp,padding:"8px 10px"}} value={addType} onChange={e=>setAddType(e.target.value)}>
                      {allMealTypes.map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><Label>Portions</Label>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <Btn variant="ghost" style={{padding:"5px 10px"}} ariaLabel="Decrease" onClick={()=>setAddPts(p=>Math.max(1,p-1))}>−</Btn>
                      <span style={{fontSize:15,fontWeight:500,minWidth:20,textAlign:"center",fontFamily:T.font.sans}} aria-live="polite">{addPts}</span>
                      <Btn variant="ghost" style={{padding:"5px 10px"}} ariaLabel="Increase" onClick={()=>setAddPts(p=>p+1)}>+</Btn>
                    </div>
                  </div>
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
    <div style={{fontFamily:T.font.sans,color:T.ink900,maxWidth:420,margin:"0 auto",background:T.ink0,minHeight:"100vh"}}>

      {/* ── PLANNER ── */}
      {page==="planner" && (
        <div style={{padding:"20px 16px 0"}}>
          <PageHeader eyebrow="Meal planner" title={`${weeks.length} ${weeks.length===1?"Week":"Weeks"}`}
            action={<Btn onClick={addWeek} disabled={weeks.length>=5} style={{padding:"8px 14px",fontSize:13}} ariaLabel="Add week">
              <Icon name="plus" size={14}/>Week{weeks.length>=5?" (max)":""}
            </Btn>}/>
          <div style={{marginBottom:16}}>
            <PillToggle options={[{id:"scroll",label:"Stack"},{id:"carousel",label:"Swipe"}]} value={plannerView} onChange={setPlannerView}/>
          </div>
          {plannerView==="scroll" && weeks.map(w=>renderWeekCard(w))}
          {plannerView==="carousel" && (
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <Btn variant="ghost" style={{padding:"6px 10px"}} disabled={activeIdx===0} ariaLabel="Previous week" onClick={()=>setActiveIdx(i=>i-1)}><Icon name="arrow-left" size={15}/></Btn>
                <div style={{flex:1,display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
                  {weeks.map((w,i)=>(
                    <button key={w.id} onClick={()=>setActiveIdx(i)} aria-pressed={i===activeIdx}
                      style={{padding:"4px 12px",borderRadius:T.r.pill,border:`1.5px solid ${i===activeIdx?T.brand500:T.borderInput}`,background:i===activeIdx?T.brand500:T.ink0,color:i===activeIdx?T.ink0:T.ink500,cursor:"pointer",fontSize:12,fontWeight:i===activeIdx?500:400,fontFamily:"inherit"}}>
                      {w.label}
                    </button>
                  ))}
                </div>
                <Btn variant="ghost" style={{padding:"6px 10px"}} disabled={activeIdx===weeks.length-1} ariaLabel="Next week" onClick={()=>setActiveIdx(i=>i+1)}><Icon name="arrow-right" size={15}/></Btn>
              </div>
              {weeks[activeIdx] && renderWeekCard(weeks[activeIdx])}
            </div>
          )}
        </div>
      )}

      {/* ── RECIPES ── */}
      {page==="recipes" && (
        <div style={{padding:"20px 16px 0"}}>
          <PageHeader title="Recipes" action={<Btn onClick={()=>{setShowAddRec(true);setEditingRec(null);}} style={{padding:"8px 14px",fontSize:13}}><Icon name="plus" size={14}/>Add</Btn>}/>
          <div style={{marginBottom:14}}>
            <input style={{...Inp,paddingLeft:38}} value={recSearch} onChange={e=>setRecSearch(e.target.value)} placeholder="Search by name or ingredient..." aria-label="Search recipes"/>
          </div>

          {showAddRec && (
            <RecipeForm initial={initRecipe()} directory={dir} label="New recipe"
              onSave={rec=>{if(!rec.name.trim())return;setCustomRecipes(p=>[...p,{...rec,id:uuid(),ingredients:rec.ingredients.filter(i=>i.name.trim()),steps:rec.steps.filter(s=>s.trim())}]);setShowAddRec(false);}}
              onCancel={()=>setShowAddRec(false)}/>
          )}

          {filteredRecipes.length===0 && <p style={{color:T.ink400,fontSize:14}}>No recipes found.</p>}
          {filteredRecipes.map(r => {
            const isExp = expandedRec===r.id, showPl = plannerRec===r.id, isEd = editingRec?.id===r.id;
            const isOverridden = customRecipes.some(c=>c.id===r.id);
            const isCustomOnly = !builtInIds.has(r.id);
            return (
              <Card key={r.id}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>{if(isEd)return;if(isExp||showPl){setExpandedRec(null);setPlannerRec(null);}else{setExpandedRec(r.id);setPlannerRec(null);}}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontWeight:500,fontSize:14,fontFamily:T.font.sans,color:T.ink900}}>{r.name}</span>
                      <Tag>{r.category}</Tag>
                      {isOverridden && <Tag accent>Edited</Tag>}
                      {isCustomOnly && !isOverridden && <Tag accent>Custom</Tag>}
                    </div>
                    <p style={{margin:"2px 0 0",fontSize:12,color:T.ink400,fontFamily:T.font.sans}}>{r.ingredients.length} ingredients</p>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <IconBtn variant="accent" size={30} icon="calendar-plus" ariaLabel={`Add ${r.name} to planner`}
                      onClick={e=>{e.stopPropagation();if(!showPl)setExpandedRec(null);setPlannerRec(showPl?null:r.id);setEditingRec(null);}}/>
                    <IconBtn size={30} icon="edit" ariaLabel={`Edit ${r.name}`} style={{background:T.ink50}}
                      onClick={e=>{e.stopPropagation();setEditingRec(isEd?null:r);setExpandedRec(null);setPlannerRec(null);setShowAddRec(false);}}/>
                    {/* Delete: for built-ins with no override, show "reset" label; for others show trash */}
                    <IconBtn variant="danger" size={30} icon="trash" ariaLabel={`Delete ${r.name}`}
                      onClick={e=>{e.stopPropagation();deleteRecipe(r.id);}}/>
                    <IconBtn variant="ghost" size={30} icon={isExp||showPl||isEd?"chevron-up":"chevron-down"} ariaLabel="Expand recipe"
                      onClick={()=>{if(isEd)return;if(isExp||showPl){setExpandedRec(null);setPlannerRec(null);}else{setExpandedRec(r.id);setPlannerRec(null);}}}/>
                  </div>
                </div>

                {isEd && (
                  <RecipeForm initial={{...r,steps:r.steps||[""],ingredients:r.ingredients.map(i=>({...i,id:i.id||uuid()}))}}
                    directory={dir} label="Edit recipe"
                    onSave={handleSaveRecipe}
                    onCancel={()=>setEditingRec(null)}/>
                )}
                {isExp && !isEd && <RecipeDetail recipe={r}/>}
                {showPl && !isEd && <PlannerPanel recipe={r} weeks={weeks} allMealTypes={allMealTypes} onConfirm={confirmPlan} onClose={()=>setPlannerRec(null)}/>}
              </Card>
            );
          })}
        </div>
      )}

      {/* ── COOK ── */}
      {page==="cook" && <CookView allRecipes={allRecipes}/>}

      {/* ── GROCERY ── */}
      {page==="grocery" && (
        <div style={{padding:"20px 16px 0"}}>
          <PageHeader eyebrow="Grocery list" title={totalVis>0?`${checkedCt} / ${totalVis} done`:"Empty"}
            action={<Btn onClick={()=>setShowAddGroc(v=>!v)} style={{padding:"8px 14px",fontSize:13}}><Icon name="plus" size={14}/>Add item</Btn>}/>
          {totalVis > 0 && <ProgressBar value={checkedCt/totalVis}/>}

          {showAddGroc && (
            <Card accent style={{marginBottom:16}}>
              <p style={{fontWeight:500,fontSize:15,margin:"0 0 12px",fontFamily:T.font.sans}}>Add item</p>
              <div style={{marginBottom:10,position:"relative",zIndex:50}}>
                <Label>Search directory to autofill (optional)</Label>
                <IngredientSearch directory={dir} placeholder="e.g. Eggs, Oat milk..." onSelect={d=>setNewGroc(p=>({...p,name:d.name,unit:d.unit,cat:d.cat}))}/>
              </div>
              <div style={{marginBottom:10}}>
                <Label htmlFor="groc-name">Name</Label>
                <input id="groc-name" style={{...Inp,padding:"10px 14px"}} placeholder="Type any item name..." value={newGroc.name} onChange={e=>setNewGroc(p=>({...p,name:e.target.value}))}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                <div><Label htmlFor="groc-qty">Qty</Label><input id="groc-qty" style={{...Inp,padding:"8px 10px"}} placeholder="2" value={newGroc.qty} onChange={e=>setNewGroc(p=>({...p,qty:e.target.value}))}/></div>
                <div><Label htmlFor="groc-unit">Unit</Label><input id="groc-unit" style={{...Inp,padding:"8px 10px"}} placeholder="g" value={newGroc.unit} onChange={e=>setNewGroc(p=>({...p,unit:e.target.value}))}/></div>
                <div><Label htmlFor="groc-cat">Category</Label><select id="groc-cat" style={{...Inp,padding:"8px 6px"}} value={newGroc.cat} onChange={e=>setNewGroc(p=>({...p,cat:e.target.value}))}>{CAT_ORDER.map(c=><option key={c}>{c}</option>)}</select></div>
              </div>
              {grocErr && <p role="alert" style={{color:T.danger,fontSize:13,margin:"0 0 8px",fontFamily:T.font.sans}}>{grocErr}</p>}
              <div style={{display:"flex",gap:8}}>
                <Btn style={{flex:1,justifyContent:"center"}} onClick={()=>{
                  if(!newGroc.name.trim()){setGrocErr("Please enter an item name.");return;}
                  setCustomGrocery(p=>[...p,{...newGroc,id:uuid()}]);
                  setNewGroc({name:"",qty:"",unit:"",cat:"Produce"});setGrocErr("");setShowAddGroc(false);
                }}>Add to list</Btn>
                <Btn variant="ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>{setShowAddGroc(false);setGrocErr("");}}>Cancel</Btn>
              </div>
            </Card>
          )}

          {Object.keys(hidden).filter(k=>hidden[k]).length > 0 && (
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"8px 12px",background:T.ink50,borderRadius:T.r.md}}>
              <Icon name="eye-off" size={14} color={T.ink400} ariaLabel="Hidden items"/>
              <span style={{fontSize:13,color:T.ink500,flex:1,fontFamily:T.font.sans}}>{Object.values(hidden).filter(Boolean).length} items hidden</span>
              <Btn variant="ghost" style={{padding:"3px 10px",fontSize:12}} onClick={()=>setHidden({})}>Show all</Btn>
            </div>
          )}

          {totalVis === 0 ? (
            <div style={{textAlign:"center",padding:"3rem 1rem"}}>
              <Icon name="shopping-cart" size={40} color={T.ink300} ariaLabel="Empty grocery list"/>
              <p style={{color:T.ink400,marginTop:8,fontSize:14,fontFamily:T.font.sans}}>Add meals in the planner or tap "Add item"</p>
            </div>
          ) : glCats.map(cat => {
            const vis = (grocByCat[cat]||[]).filter(i=>!hidden[i._key]);
            if (!vis.length) return null;
            const sorted = [...vis].sort((a,b)=>(checked[a._key]?1:0)-(checked[b._key]?1:0));
            return (
              <div key={cat} style={{marginBottom:16}}>
                <div style={{paddingLeft:4,marginBottom:8}}><Eyebrow>{cat}</Eyebrow></div>
                <Card>
                  {sorted.map((item,idx)=>{
                    const k=item._key, chk=!!checked[k];
                    return (
                      <div key={k} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:idx<sorted.length-1?`1px solid ${T.divider}`:"none"}}>
                        <input type="checkbox" checked={chk} id={`chk-${k}`} aria-label={item.name}
                          onChange={()=>setChecked(p=>({...p,[k]:!p[k]}))}
                          style={{width:20,height:20,accentColor:T.brand500,cursor:"pointer",flexShrink:0}}/>
                        <label htmlFor={`chk-${k}`} style={{flex:1,fontSize:14,fontFamily:T.font.sans,textDecoration:chk?"line-through":"none",color:chk?T.ink400:T.ink900,cursor:"pointer"}}>{item.name}</label>
                        <span style={{fontSize:13,color:T.ink400,minWidth:50,textAlign:"right",fontFamily:T.font.sans}}>{fmtQty(item.qty)} {item.unit}</span>
                        <button aria-label={item.isCustom?`Remove ${item.name}`:`Hide ${item.name}`}
                          onClick={()=>{if(item.isCustom)setCustomGrocery(p=>p.filter(x=>x.id!==item.id));else setHidden(p=>({...p,[k]:true}));}}
                          style={{border:"none",background:"none",cursor:"pointer",color:T.ink300,padding:0,lineHeight:1,flexShrink:0}}>
                          <Icon name={item.isCustom?"trash":"eye-off"} size={15}/>
                        </button>
                      </div>
                    );
                  })}
                </Card>
              </div>
            );
          })}
          {checkedCt > 0 && <Btn variant="danger" style={{width:"100%",justifyContent:"center",marginTop:4}} onClick={()=>setChecked({})}>Clear all checks</Btn>}
        </div>
      )}

      {/* ── SUMMARY ── */}
      {page==="summary" && (
        <div style={{padding:"20px 16px 0"}}>
          <h1 style={{margin:"0 0 16px",fontFamily:T.font.sans,fontSize:22,fontWeight:500,color:T.ink900}}>Summary</h1>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
            <StatCard label="Total meals" value={totalMeals}/>
            <StatCard label="Grocery items" value={totalVis}/>
          </div>
          {weeks.map(wk=>(
            <div key={wk.id} style={{background:T.ink0,border:`1px solid ${T.border}`,borderRadius:T.r.lg,overflow:"hidden",marginBottom:16}}>
              <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.divider}`}}>
                <span style={{fontWeight:500,fontSize:15,fontFamily:T.font.sans,color:T.ink900}}>{wk.label}</span>
              </div>
              {DAYS.map(day=>{
                const entries = wk.days[day] || [];
                const grouped = groupEntries(entries.map((e,i)=>({...e,entryId:e.entryId||`lg_${i}`})));
                const types = Object.keys(grouped).sort((a,b)=>allMealTypes.indexOf(a)-allMealTypes.indexOf(b));
                return (
                  <div key={day} style={{padding:"12px 16px",borderBottom:`1px solid ${T.divider}`}}>
                    <p style={{fontWeight:500,fontSize:14,margin:"0 0 6px",fontFamily:T.font.sans,color:T.ink900}}>{day}</p>
                    {types.length===0
                      ? <p style={{fontSize:13,color:T.ink400,margin:0,fontFamily:T.font.sans}}>Nothing planned</p>
                      : types.map(type=>(
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
                      ))
                    }
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* ── SETTINGS ── */}
      {page==="settings" && (
        <div style={{padding:"20px 16px 0"}}>
          <h1 style={{margin:"0 0 20px",fontFamily:T.font.sans,fontSize:22,fontWeight:500,color:T.ink900}}>Settings</h1>
          <Card>
            <p style={{fontWeight:500,fontSize:15,margin:"0 0 4px",fontFamily:T.font.sans}}>Week start day</p>
            <p style={{fontSize:13,color:T.ink400,margin:"0 0 14px",fontFamily:T.font.sans}}>Which day your shopping week begins.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}} role="group" aria-label="Week start day">
              {ALL_DAYS.map(d=>(
                <button key={d} aria-pressed={d===weekStart} onClick={()=>setWeekStart(d)}
                  style={{padding:"6px 14px",borderRadius:T.r.pill,border:`1.5px solid ${d===weekStart?T.brand500:T.borderInput}`,background:d===weekStart?T.brand500:T.ink0,color:d===weekStart?T.ink0:T.ink500,cursor:"pointer",fontSize:13,fontWeight:d===weekStart?500:400,fontFamily:"inherit"}}>
                  {d.slice(0,3)}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <p style={{fontWeight:500,fontSize:15,margin:"0 0 4px",fontFamily:T.font.sans}}>Meal categories</p>
            <p style={{fontSize:13,color:T.ink400,margin:"0 0 14px",fontFamily:T.font.sans}}>Slot options when adding a meal.</p>
            <div style={{marginBottom:12}}>
              {DEFAULT_MEAL_TYPES.map(t=>(
                <span key={t} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:13,padding:"4px 10px",borderRadius:T.r.xl,background:T.ink100,color:T.ink500,marginRight:6,marginBottom:6,fontFamily:T.font.sans}}>
                  {t} <span style={{fontSize:11,color:T.ink400}}>default</span>
                </span>
              ))}
              {customTypes.map(t=>(
                <span key={t} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:13,padding:"4px 10px",borderRadius:T.r.xl,background:T.brand100,color:T.brand700,marginRight:6,marginBottom:6,fontFamily:T.font.sans}}>
                  {t}
                  <button aria-label={`Remove ${t}`} onClick={()=>setCustomTypes(p=>p.filter(x=>x!==t))} style={{border:"none",background:"none",cursor:"pointer",color:T.brand700,padding:0,lineHeight:1}}>
                    <Icon name="x" size={12}/>
                  </button>
                </span>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input style={{...Inp,flex:1}} placeholder="e.g. Supper, Pre-workout..." aria-label="New meal category" value={newTypeInput} onChange={e=>setNewTypeInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&newTypeInput.trim()&&!allMealTypes.includes(newTypeInput.trim())){setCustomTypes(p=>[...p,newTypeInput.trim()]);setNewTypeInput("");}}}/>
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
            {showAddDir && (
              <div style={{background:T.ink50,borderRadius:T.r.md,padding:12,marginBottom:14,border:`1px solid ${T.borderInput}`}}>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8,marginBottom:8}}>
                  <div><Label htmlFor="dir-name">Name</Label><input id="dir-name" style={{...Inp,padding:"8px 10px"}} placeholder="e.g. Fennel" value={newDirE.name} onChange={e=>setNewDirE(p=>({...p,name:e.target.value}))}/></div>
                  <div><Label htmlFor="dir-unit">Unit</Label><input id="dir-unit" style={{...Inp,padding:"8px 10px"}} placeholder="g" value={newDirE.unit} onChange={e=>setNewDirE(p=>({...p,unit:e.target.value}))}/></div>
                  <div><Label htmlFor="dir-cat">Category</Label><select id="dir-cat" style={{...Inp,padding:"8px 6px"}} value={newDirE.cat} onChange={e=>setNewDirE(p=>({...p,cat:e.target.value}))}>{CAT_ORDER.map(c=><option key={c}>{c}</option>)}</select></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn style={{flex:1,justifyContent:"center",fontSize:13}} onClick={()=>{
                    if(!newDirE.name.trim())return;
                    if(dir.find(d=>d.name.toLowerCase()===newDirE.name.toLowerCase().trim()))return;
                    setDir(p=>[...p,{...newDirE,name:newDirE.name.trim(),id:uuid()}]);
                    setNewDirE({name:"",unit:"",cat:"Produce"});setShowAddDir(false);
                  }}>Save</Btn>
                  <Btn variant="ghost" style={{flex:1,justifyContent:"center",fontSize:13}} onClick={()=>setShowAddDir(false)}>Cancel</Btn>
                </div>
              </div>
            )}
            <div style={{marginBottom:10}}>
              <input style={{...Inp,paddingLeft:38}} placeholder="Search directory..." aria-label="Search ingredients directory" value={dirSearch} onChange={e=>setDirSearch(e.target.value)}/>
            </div>
            <div style={{maxHeight:280,overflowY:"auto",borderRadius:T.r.md,border:`1px solid ${T.borderInput}`}}>
              {filteredDir.length===0 && <p style={{fontSize:13,color:T.ink400,padding:"10px 14px",margin:0,fontFamily:T.font.sans}}>No results.</p>}
              {filteredDir.map((d,i)=>(
                <div key={d.id} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:i<filteredDir.length-1?`1px solid ${T.divider}`:"none",background:T.ink0}}>
                  <span style={{flex:1,fontSize:14,fontFamily:T.font.sans,color:T.ink900}}>{d.name}</span>
                  <span style={{fontSize:12,color:T.ink400,minWidth:40,fontFamily:T.font.sans}}>{d.unit||"—"}</span>
                  <Tag>{d.cat}</Tag>
                  <button aria-label={`Remove ${d.name} from directory`} onClick={()=>setDir(p=>p.filter(x=>x.id!==d.id))} style={{border:"none",background:"none",cursor:"pointer",color:T.ink300,padding:0,lineHeight:1}}>
                    <Icon name="trash" size={15}/>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── BOTTOM NAV ── */}
      <nav aria-label="Main navigation" style={{display:"flex",borderTop:`1px solid ${T.border}`,marginTop:24,background:T.ink0,padding:"8px 0 4px"}}>
        {nav.map(n=>{
          const act = page===n.id;
          return (
            <button key={n.id} onClick={()=>setPage(n.id)} aria-label={n.label} aria-current={act?"page":undefined}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 4px",border:"none",background:"none",cursor:"pointer",color:act?T.brand500:T.ink400,fontFamily:"inherit"}}>
              <div style={{width:36,height:36,borderRadius:T.r.md,background:act?T.brand100:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.15s"}}>
                <Icon name={n.icon} size={20} color={act?T.brand500:T.ink400}/>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}