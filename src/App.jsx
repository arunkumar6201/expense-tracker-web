import { useState, useEffect, useRef, useMemo } from "react";

const CATEGORIES = [
  { name: "Food", icon: "🍽️", color: "#f97316" },
  { name: "Transport", icon: "🚗", color: "#3b82f6" },
  { name: "Shopping", icon: "🛍️", color: "#a855f7" },
  { name: "Bills", icon: "📄", color: "#ef4444" },
  { name: "Entertainment", icon: "🎬", color: "#ec4899" },
  { name: "Other", icon: "📦", color: "#6b7280" },
];

const TABS = ["Overview", "Expenses", "Upload", "Budget", "Goals", "Settings"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const today = () => new Date().toISOString().split("T")[0];
const fmtDate = d => new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"});
const fmtAmt = n => "₹"+Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtAmtShort = n => n>=100000?"₹"+(n/100000).toFixed(1)+"L":n>=1000?"₹"+(n/1000).toFixed(1)+"K":"₹"+Math.round(n);
const startOfMonth = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-01`; };
const startOfWeek = () => { const d=new Date(); d.setDate(d.getDate()-d.getDay()); return d.toISOString().split("T")[0]; };
const monthKey = offset => { const d=new Date(); d.setMonth(d.getMonth()-offset); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; };
const total = list => list.reduce((s,e)=>s+Number(e.amount),0);
const catColor = n => CATEGORIES.find(c=>c.name===n)?.color||"#6b7280";
const catIcon = n => CATEGORIES.find(c=>c.name===n)?.icon||"📦";

const SK = "arun_exp_v3", BK = "arun_budget_v3", GK = "arun_goals_v3", SETK = "arun_settings_v3", TMPK = "arun_templates_v3";

const card = (extra={}) => ({background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",...extra});

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState({monthly:10000,daily:500,categories:{}});
  const [goals, setGoals] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState({darkMode:false,currency:"₹"});
  const [tab, setTab] = useState("Overview");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editExp, setEditExp] = useState(null);
  const [form, setForm] = useState({amount:"",category:"Food",note:"",date:today()});
  const [formErr, setFormErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadPreview, setUploadPreview] = useState(null);
  const [insight, setInsight] = useState("");
  const [insightLoading, setInsightLoading] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [newGoal, setNewGoal] = useState({name:"",target:"",deadline:""});
  const [budgetInput, setBudgetInput] = useState({monthly:"10000",daily:"500"});
  const [catBudgets, setCatBudgets] = useState({});
  const [newTemplate, setNewTemplate] = useState({name:"",amount:"",category:"Food",note:""});
  const fileRef = useRef();
useEffect(() => {
  const savedExpenses = localStorage.getItem(SK);

  if (savedExpenses) {
    setExpenses(JSON.parse(savedExpenses));
  }

  const savedBudget = localStorage.getItem(BK);

  if (savedBudget) {
    const b = JSON.parse(savedBudget);

    setBudget(b);

    setBudgetInput({
      monthly: String(b.monthly),
      daily: String(b.daily),
    });

    setCatBudgets(b.categories || {});
  }

  const savedGoals = localStorage.getItem(GK);

  if (savedGoals) {
    setGoals(JSON.parse(savedGoals));
  }

  const savedTemplates = localStorage.getItem(TMPK);

  if (savedTemplates) {
    setTemplates(JSON.parse(savedTemplates));
  }

  const savedSettings = localStorage.getItem(SETK);

  if (savedSettings) {
    setSettings(JSON.parse(savedSettings));
  }
}, []);
  
const persist = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};
 
  const saveExp = list => { setExpenses(list); persist(SK,list); };
  const saveBudget = b => { setBudget(b); persist(BK,b); };
  const saveGoals = g => { setGoals(g); persist(GK,g); };
  const saveTemplates = t => { setTemplates(t); persist(TMPK,t); };
  const saveSettings = s => { setSettings(s); persist(SETK,s); };

  const addOrEditExpense = () => {
    if(!form.amount||isNaN(form.amount)||Number(form.amount)<=0){setFormErr("Enter a valid amount.");return;}
    if(editExp){
      const updated=expenses.map(e=>e.id===editExp.id?{...e,...form,amount:Number(form.amount)}:e);
      saveExp(updated); setEditExp(null);
    } else {
      saveExp([...expenses,{id:Date.now(),...form,amount:Number(form.amount)}]);
    }
    setForm({amount:"",category:"Food",note:"",date:today()}); setShowForm(false); setFormErr("");
  };

  const startEdit = exp => { setEditExp(exp); setForm({amount:String(exp.amount),category:exp.category,note:exp.note,date:exp.date}); setShowForm(true); setTab("Expenses"); };
  const del = id => saveExp(expenses.filter(e=>e.id!==id));
  const bulkDelete = () => { saveExp(expenses.filter(e=>!selected.has(e.id))); setSelected(new Set()); };
  const toggleSelect = id => setSelected(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; });

  const addFromTemplate = t => saveExp([...expenses,{id:Date.now(),amount:Number(t.amount),category:t.category,note:t.note||t.name,date:today()}]);

  const handleUpload = file => {
    if(!file) return;
    setUploadMsg(""); setUploading(true);
    const reader=new FileReader();
    reader.onload=async ev=>{
      const b64=ev.target.result.split(",")[1], mime=file.type||"image/jpeg";
      setUploadPreview(ev.target.result);
      try{
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:mime,data:b64}},{type:"text",text:`Extract payment info from this screenshot. Return ONLY JSON, no markdown:\n{"amount":150,"note":"Swiggy order","category":"Food","date":"${today()}"}\nCategories: Food,Transport,Shopping,Bills,Entertainment,Other\nIf not a payment screenshot: {"error":"not a payment screenshot"}`}]}]})});
        const data=await res.json();
        const text=data.content?.map(i=>i.text||"").join("")||"";
        const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
        if(parsed.error){setUploadMsg("⚠️ "+parsed.error);}
        else{
          const e={id:Date.now(),amount:Number(parsed.amount),note:parsed.note||"Payment",category:parsed.category||"Other",date:parsed.date||today()};
          saveExp([...expenses,e]);
          setUploadMsg(`✅ Added: ${fmtAmt(e.amount)} — ${e.note}`);
        }
      }catch{setUploadMsg("⚠️ Could not read screenshot. Try again.");}
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const getInsight = async () => {
    setInsightLoading(true); setInsight("");
    const summary = CATEGORIES.map(c=>({category:c.name,total:total(expenses.filter(e=>e.category===c.name&&e.date>=startOfMonth()))}));
    const byDay = DAYS.map((d,i)=>({day:d,total:total(expenses.filter(e=>new Date(e.date+"T00:00:00").getDay()===i))}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,messages:[{role:"user",content:`You are a friendly personal finance assistant for Arun. Give 2-3 short, specific, actionable insights based on this data. Be conversational and encouraging. Keep under 80 words total.\nMonthly category spending: ${JSON.stringify(summary)}\nSpending by day of week: ${JSON.stringify(byDay)}\nMonthly budget: ₹${budget.monthly}\nTotal spent this month: ₹${total(expenses.filter(e=>e.date>=startOfMonth()))}`}]})});
      const data=await res.json();
      setInsight(data.content?.map(i=>i.text||"").join("")||"No insight available.");
    }catch{setInsight("Could not load insights. Try again.");}
    setInsightLoading(false);
  };

  const exportCSV = () => {
    const rows=[["Date","Amount","Category","Note"],...expenses.map(e=>[e.date,e.amount,e.category,e.note||""])];
    const csv=rows.map(r=>r.join(",")).join("\n");
    const a=document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download="arun_expenses.csv"; a.click();
  };

  // Computed
  const todayStr=today(), weekStr=startOfWeek(), monthStr=startOfMonth();
  const todayAmt=total(expenses.filter(e=>e.date===todayStr));
  const weekAmt=total(expenses.filter(e=>e.date>=weekStr));
  const monthAmt=total(expenses.filter(e=>e.date>=monthStr));
  const budgetPct=Math.min(100,Math.round((monthAmt/budget.monthly)*100));
  const dailyPct=Math.min(100,Math.round((todayAmt/budget.daily)*100));
  const budgetColor=p=>p>=90?"#ef4444":p>=70?"#f97316":"#22c55e";

  const monthTrend = useMemo(()=>Array.from({length:6},(_,i)=>{
    const mk=monthKey(5-i);
    const val=total(expenses.filter(e=>e.date.startsWith(mk)));
    return {label:new Date(mk+"-01").toLocaleDateString("en-IN",{month:"short"}),val};
  }),[expenses]);
  const maxTrend=Math.max(...monthTrend.map(m=>m.val),1);

  const dayTotals=DAYS.map((d,i)=>({day:d,val:total(expenses.filter(e=>new Date(e.date+"T00:00:00").getDay()===i))}));
  const maxDay=Math.max(...dayTotals.map(d=>d.val),1);

  const topMerchants=useMemo(()=>{
    const map={};
    expenses.forEach(e=>{ if(e.note){ map[e.note]=(map[e.note]||0)+e.amount; } });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,5);
  },[expenses]);

  const filtered=useMemo(()=>{
    let list=filter==="All"?expenses:expenses.filter(e=>e.category===filter);
    if(search) list=list.filter(e=>(e.note||"").toLowerCase().includes(search.toLowerCase())||e.category.toLowerCase().includes(search.toLowerCase()));
    if(dateFrom) list=list.filter(e=>e.date>=dateFrom);
    if(dateTo) list=list.filter(e=>e.date<=dateTo);
    return [...list].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
  },[expenses,filter,search,dateFrom,dateTo]);

  const catTotals=CATEGORIES.map(c=>({...c,val:total(expenses.filter(e=>e.category===c.name&&e.date>=monthStr))})).filter(c=>c.val>0).sort((a,b)=>b.val-a.val);

  const dm=settings.darkMode;

  return (
    <div style={{padding:"1.25rem 1rem",maxWidth:680,margin:"0 auto",fontFamily:"var(--font-sans)",background:dm?"#111":"transparent",minHeight:"100vh",color:dm?"#e5e7eb":"var(--color-text-primary)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".25rem"}}>
        <h2 style={{margin:0,fontSize:22,fontWeight:500}}>Arun's Expenses</h2>
        <button onClick={()=>{const s={...settings,darkMode:!settings.darkMode};saveSettings(s);}} style={{background:"none",border:"0.5px solid var(--color-border-tertiary)",borderRadius:20,padding:"4px 12px",cursor:"pointer",fontSize:13,color:"var(--color-text-secondary)"}}>
          {dm?"☀️ Light":"🌙 Dark"}
        </button>
      </div>
      <p style={{margin:"0 0 1rem",fontSize:13,color:"var(--color-text-secondary)"}}>Smart daily expense tracker</p>

      {/* Tabs */}
      <div style={{display:"flex",gap:0,marginBottom:"1.25rem",borderBottom:"0.5px solid var(--color-border-tertiary)",overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 14px",fontSize:13,border:"none",background:"none",cursor:"pointer",whiteSpace:"nowrap",color:tab===t?"var(--color-text-primary)":"var(--color-text-secondary)",fontWeight:tab===t?500:400,borderBottom:tab===t?"2px solid var(--color-text-primary)":"2px solid transparent",marginBottom:-1}}>{t}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==="Overview"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:10,marginBottom:"1.25rem"}}>
          {[["Today",todayAmt,dailyPct,"daily"],["This Week",weekAmt,null,null],["This Month",monthAmt,budgetPct,"monthly"]].map(([label,amt,pct,type])=>(
            <div key={label} style={{...card(),padding:"0.85rem 1rem"}}>
              <p style={{margin:"0 0 4px",fontSize:12,color:"var(--color-text-secondary)"}}>{label}</p>
              <p style={{margin:"0 0 6px",fontSize:17,fontWeight:500}}>{fmtAmt(amt)}</p>
              {pct!=null&&<div style={{height:4,background:"var(--color-background-secondary)",borderRadius:99}}><div style={{height:"100%",width:pct+"%",background:budgetColor(pct),borderRadius:99,transition:"width .4s"}}/></div>}
              {pct!=null&&<p style={{margin:"4px 0 0",fontSize:11,color:budgetColor(pct)}}>{pct}% of {type} limit</p>}
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div style={{...card(),marginBottom:"1.25rem"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <p style={{margin:0,fontSize:14,fontWeight:500}}>🤖 AI Spending Insights</p>
            <button onClick={getInsight} disabled={insightLoading} style={{padding:"5px 12px",fontSize:12,border:"0.5px solid var(--color-border-secondary)",borderRadius:20,background:"none",cursor:"pointer",color:"var(--color-text-secondary)"}}>
              {insightLoading?"Thinking...":"Get Insights"}
            </button>
          </div>
          {insight?<p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.6}}>{insight}</p>:<p style={{margin:0,fontSize:13,color:"var(--color-text-tertiary)"}}>Click "Get Insights" for AI-powered spending tips.</p>}
        </div>

        {/* 6-month trend */}
        <div style={{...card(),marginBottom:"1.25rem"}}>
          <p style={{margin:"0 0 .75rem",fontSize:14,fontWeight:500}}>6-Month Trend</p>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:80}}>
            {monthTrend.map((m,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:10,color:"var(--color-text-tertiary)"}}>{m.val?fmtAmtShort(m.val):""}</span>
                <div style={{width:"100%",background:i===5?"#3b82f6":"var(--color-background-secondary)",borderRadius:"4px 4px 0 0",height:m.val?Math.max(8,Math.round((m.val/maxTrend)*60))+"px":"4px",transition:"height .4s"}}/>
                <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day heatmap */}
        <div style={{...card(),marginBottom:"1.25rem"}}>
          <p style={{margin:"0 0 .75rem",fontSize:14,fontWeight:500}}>Spending by Day of Week</p>
          <div style={{display:"flex",gap:6,alignItems:"flex-end",height:60}}>
            {dayTotals.map((d,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:"100%",background:d.val?`rgba(59,130,246,${0.2+0.8*(d.val/maxDay)})`:"var(--color-background-secondary)",borderRadius:4,height:d.val?Math.max(6,Math.round((d.val/maxDay)*44))+"px":"6px"}}/>
                <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category bars */}
        {catTotals.length>0&&<div style={{...card(),marginBottom:"1.25rem"}}>
          <p style={{margin:"0 0 .75rem",fontSize:14,fontWeight:500}}>This Month by Category</p>
          {catTotals.map(c=>(
            <div key={c.name} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:13}}>{c.icon} {c.name}</span>
                <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{fmtAmt(c.val)}</span>
              </div>
              <div style={{height:6,background:"var(--color-background-secondary)",borderRadius:99}}>
                <div style={{height:"100%",width:Math.round((c.val/catTotals[0].val)*100)+"%",background:c.color,borderRadius:99}}/>
              </div>
            </div>
          ))}
        </div>}

        {/* Top merchants */}
        {topMerchants.length>0&&<div style={{...card()}}>
          <p style={{margin:"0 0 .75rem",fontSize:14,fontWeight:500}}>Top Merchants</p>
          {topMerchants.map(([name,amt],i)=>(
            <div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<topMerchants.length-1?"0.5px solid var(--color-border-tertiary)":"none"}}>
              <span style={{fontSize:13}}>#{i+1} {name}</span>
              <span style={{fontSize:13,fontWeight:500}}>{fmtAmt(amt)}</span>
            </div>
          ))}
        </div>}
      </>}

      {/* EXPENSES */}
      {tab==="Expenses"&&<>
        {/* Templates */}
        {templates.length>0&&<div style={{marginBottom:"1rem"}}>
          <p style={{margin:"0 0 .5rem",fontSize:13,fontWeight:500,color:"var(--color-text-secondary)"}}>Quick Add</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {templates.map(t=>(
              <button key={t.id} onClick={()=>addFromTemplate(t)} style={{padding:"5px 12px",fontSize:13,borderRadius:20,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",cursor:"pointer"}}>
                {catIcon(t.category)} {t.name} · {fmtAmt(t.amount)}
              </button>
            ))}
          </div>
        </div>}

        <div style={{display:"flex",gap:8,marginBottom:"1rem",flexWrap:"wrap"}}>
          {!showForm&&<button onClick={()=>{setShowForm(true);setEditExp(null);setForm({amount:"",category:"Food",note:"",date:today()});}} style={{padding:"8px 16px",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",cursor:"pointer",fontSize:14}}>+ Add Expense</button>}
          {selected.size>0&&<button onClick={bulkDelete} style={{padding:"8px 16px",border:"0.5px solid #ef4444",borderRadius:"var(--border-radius-md)",background:"none",cursor:"pointer",fontSize:14,color:"#ef4444"}}>🗑 Delete {selected.size} selected</button>}
          <button onClick={exportCSV} style={{padding:"8px 16px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"none",cursor:"pointer",fontSize:14,color:"var(--color-text-secondary)"}}>⬇ Export CSV</button>
        </div>

        {showForm&&<div style={{...card(),marginBottom:"1rem"}}>
          <p style={{margin:"0 0 .75rem",fontWeight:500,fontSize:15}}>{editExp?"Edit Expense":"New Expense"}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Amount (₹)</label>
              <input type="number" placeholder="0.00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Category</label>
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}>
                {CATEGORIES.map(c=><option key={c.name}>{c.name}</option>)}
              </select></div>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Note</label>
              <input placeholder="What was this for?" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Date</label>
              <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
          </div>
          {formErr&&<p style={{color:"#ef4444",fontSize:13,margin:"0 0 8px"}}>{formErr}</p>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={addOrEditExpense} style={{padding:"8px 18px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",cursor:"pointer",fontSize:14}}>{editExp?"Update":"Save"}</button>
            <button onClick={()=>{setShowForm(false);setEditExp(null);setFormErr("");}} style={{padding:"8px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)",background:"transparent",cursor:"pointer",fontSize:14,color:"var(--color-text-secondary)"}}>Cancel</button>
          </div>
        </div>}

        {/* Search & filter */}
        <input placeholder="🔍 Search expenses..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",boxSizing:"border-box",marginBottom:10,padding:"8px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",fontSize:14}}/>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{flex:1,padding:"7px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",fontSize:13}}/>
          <span style={{lineHeight:"36px",color:"var(--color-text-tertiary)",fontSize:13}}>to</span>
          <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{flex:1,padding:"7px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",fontSize:13}}/>
          {(dateFrom||dateTo)&&<button onClick={()=>{setDateFrom("");setDateTo("");}} style={{padding:"7px 10px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"none",cursor:"pointer",fontSize:12,color:"var(--color-text-secondary)"}}>Clear</button>}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:"1rem"}}>
          {["All",...CATEGORIES.map(c=>c.name)].map(cat=>(
            <button key={cat} onClick={()=>setFilter(cat)} style={{padding:"4px 12px",fontSize:13,borderRadius:20,cursor:"pointer",border:"0.5px solid",borderColor:filter===cat?"var(--color-border-primary)":"var(--color-border-tertiary)",background:filter===cat?"var(--color-background-secondary)":"transparent",fontWeight:filter===cat?500:400}}>
              {cat==="All"?cat:`${catIcon(cat)} ${cat}`}
            </button>
          ))}
        </div>

        <div style={{...card()}}>
          {filtered.length===0?<p style={{textAlign:"center",color:"var(--color-text-secondary)",padding:"2rem 0",fontSize:14}}>No expenses found.</p>
          :filtered.map((exp,i)=>(
            <div key={exp.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<filtered.length-1?"0.5px solid var(--color-border-tertiary)":"none"}}>
              <input type="checkbox" checked={selected.has(exp.id)} onChange={()=>toggleSelect(exp.id)} style={{cursor:"pointer"}}/>
              <span style={{fontSize:20}}>{catIcon(exp.category)}</span>
              <div style={{flex:1,minWidth:0}}>
                <p style={{margin:0,fontSize:14,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{exp.note||exp.category}</p>
                <p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)"}}>{exp.category} · {fmtDate(exp.date)}</p>
              </div>
              <span style={{fontSize:15,fontWeight:500,color:catColor(exp.category),whiteSpace:"nowrap"}}>{fmtAmt(exp.amount)}</span>
              <button onClick={()=>startEdit(exp)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:14,padding:"2px 4px"}}>✏️</button>
              <button onClick={()=>del(exp.id)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:18,padding:"2px 4px",lineHeight:1}}>×</button>
            </div>
          ))}
        </div>
        {filtered.length>0&&<p style={{textAlign:"right",fontSize:13,color:"var(--color-text-secondary)",marginTop:8}}>{filtered.length} expense{filtered.length!==1?"s":""} · {fmtAmt(total(filtered))}</p>}
      </>}

      {/* UPLOAD */}
      {tab==="Upload"&&<>
        <p style={{fontSize:14,color:"var(--color-text-secondary)",marginBottom:"1rem"}}>Upload a GPay, PhonePe, Paytm, or UPI screenshot — AI will auto-extract and add the expense.</p>
        <div style={{...card(),textAlign:"center",padding:"2rem",border:"1.5px dashed var(--color-border-secondary)",cursor:"pointer",marginBottom:"1rem"}}
          onClick={()=>fileRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();handleUpload(e.dataTransfer.files[0]);}}>
          <div style={{fontSize:36,marginBottom:8}}>📸</div>
          <p style={{margin:"0 0 4px",fontWeight:500,fontSize:15}}>Tap to upload screenshot</p>
          <p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)"}}>or drag & drop · JPG, PNG, WEBP</p>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleUpload(e.target.files[0])}/>
        </div>
        {uploading&&<div style={{...card(),textAlign:"center",padding:"1.5rem",marginBottom:"1rem"}}><p style={{margin:0,fontSize:14,color:"var(--color-text-secondary)"}}>🤖 Reading screenshot...</p></div>}
        {uploadPreview&&!uploading&&<div style={{...card(),marginBottom:"1rem"}}><p style={{margin:"0 0 .5rem",fontSize:13,fontWeight:500}}>Preview</p><img src={uploadPreview} alt="preview" style={{width:"100%",maxHeight:220,objectFit:"contain",borderRadius:"var(--border-radius-md)"}}/></div>}
        {uploadMsg&&<div style={{...card(),marginBottom:"1rem"}}><p style={{margin:0,fontSize:14,color:uploadMsg.startsWith("✅")?"#22c55e":"#f97316"}}>{uploadMsg}</p></div>}
        <div style={{...card(),background:"var(--color-background-secondary)"}}><p style={{margin:"0 0 .4rem",fontSize:13,fontWeight:500}}>Supported apps</p><p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)"}}>GPay · PhonePe · Paytm · Amazon Pay · BHIM · Any UPI or bank confirmation</p></div>
      </>}

      {/* BUDGET */}
      {tab==="Budget"&&<>
        <div style={{...card(),marginBottom:"1.25rem"}}>
          <p style={{margin:"0 0 .75rem",fontWeight:500,fontSize:15}}>Budget Limits</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Monthly (₹)</label>
              <input type="number" value={budgetInput.monthly} onChange={e=>setBudgetInput(b=>({...b,monthly:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Daily (₹)</label>
              <input type="number" value={budgetInput.daily} onChange={e=>setBudgetInput(b=>({...b,daily:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
          </div>
          <button onClick={()=>saveBudget({...budget,monthly:Number(budgetInput.monthly),daily:Number(budgetInput.daily),categories:catBudgets})} style={{padding:"8px 18px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",cursor:"pointer",fontSize:14}}>Save Budgets</button>
        </div>

        <div style={{...card(),marginBottom:"1.25rem"}}>
          <p style={{margin:"0 0 .75rem",fontWeight:500,fontSize:15}}>Category-wise Budgets</p>
          {CATEGORIES.map(c=>{
            const spent=total(expenses.filter(e=>e.category===c.name&&e.date>=monthStr));
            const lim=catBudgets[c.name]||0;
            const pct=lim?Math.min(100,Math.round((spent/lim)*100)):0;
            return(
              <div key={c.name} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:13}}>{c.icon} {c.name}</span>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{fmtAmt(spent)}</span>
                    <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>/</span>
                    <input type="number" placeholder="No limit" value={catBudgets[c.name]||""} onChange={e=>setCatBudgets(b=>({...b,[c.name]:e.target.value?Number(e.target.value):undefined}))} style={{width:80,padding:"3px 6px",fontSize:12,borderRadius:6,border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)"}}/>
                  </div>
                </div>
                {lim>0&&<div style={{height:5,background:"var(--color-background-secondary)",borderRadius:99}}><div style={{height:"100%",width:pct+"%",background:budgetColor(pct),borderRadius:99}}/></div>}
              </div>
            );
          })}
          <button onClick={()=>saveBudget({...budget,categories:catBudgets})} style={{marginTop:4,padding:"8px 18px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",cursor:"pointer",fontSize:14}}>Save Category Budgets</button>
        </div>

        <div style={{...card()}}>
          <p style={{margin:"0 0 .75rem",fontWeight:500}}>This Month Summary</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {[["Spent",fmtAmt(monthAmt)],["Remaining",fmtAmt(Math.max(0,budget.monthly-monthAmt))],["Used",budgetPct+"%"]].map(([l,v])=>(
              <div key={l} style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:10}}>
                <p style={{margin:"0 0 2px",fontSize:11,color:"var(--color-text-secondary)"}}>{l}</p>
                <p style={{margin:0,fontSize:15,fontWeight:500}}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </>}

      {/* GOALS */}
      {tab==="Goals"&&<>
        <div style={{...card(),marginBottom:"1.25rem"}}>
          <p style={{margin:"0 0 .75rem",fontWeight:500,fontSize:15}}>Add Savings Goal</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Goal Name</label>
              <input placeholder="e.g. New Phone" value={newGoal.name} onChange={e=>setNewGoal(g=>({...g,name:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Target Amount (₹)</label>
              <input type="number" placeholder="e.g. 50000" value={newGoal.target} onChange={e=>setNewGoal(g=>({...g,target:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Deadline</label>
              <input type="date" value={newGoal.deadline} onChange={e=>setNewGoal(g=>({...g,deadline:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
          </div>
          <button onClick={()=>{
            if(!newGoal.name||!newGoal.target) return;
            const updated=[...goals,{id:Date.now(),...newGoal,target:Number(newGoal.target),saved:0}];
            saveGoals(updated); setNewGoal({name:"",target:"",deadline:""});
          }} style={{padding:"8px 18px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",cursor:"pointer",fontSize:14}}>Add Goal</button>
        </div>
        {goals.length===0?<p style={{textAlign:"center",color:"var(--color-text-secondary)",padding:"2rem 0",fontSize:14}}>No goals yet. Add one above!</p>
        :goals.map(g=>{
          const pct=Math.min(100,Math.round((g.saved/g.target)*100));
          const daysLeft=g.deadline?Math.max(0,Math.round((new Date(g.deadline)-new Date())/(1000*60*60*24))):null;
          return(
            <div key={g.id} style={{...card(),marginBottom:"1rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div><p style={{margin:"0 0 2px",fontWeight:500,fontSize:15}}>🎯 {g.name}</p>
                  {daysLeft!=null&&<p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)"}}>{daysLeft} days left · deadline {fmtDate(g.deadline)}</p>}</div>
                <button onClick={()=>saveGoals(goals.filter(x=>x.id!==g.id))} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:18}}>×</button>
              </div>
              <div style={{height:8,background:"var(--color-background-secondary)",borderRadius:99,marginBottom:6}}><div style={{height:"100%",width:pct+"%",background:"#22c55e",borderRadius:99,transition:"width .4s"}}/></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"var(--color-text-secondary)"}}>
                <span>{fmtAmt(g.saved)} saved</span><span>{pct}% · {fmtAmt(g.target-g.saved)} to go</span>
              </div>
              <div style={{display:"flex",gap:6,marginTop:10}}>
                {[500,1000,5000].map(amt=>(
                  <button key={amt} onClick={()=>{const updated=goals.map(x=>x.id===g.id?{...x,saved:Math.min(x.target,x.saved+amt)}:x);saveGoals(updated);}} style={{padding:"4px 10px",fontSize:12,borderRadius:20,border:"0.5px solid var(--color-border-secondary)",background:"none",cursor:"pointer"}}>+{fmtAmtShort(amt)}</button>
                ))}
              </div>
            </div>
          );
        })}
      </>}

      {/* SETTINGS */}
      {tab==="Settings"&&<>
        <div style={{...card(),marginBottom:"1.25rem"}}>
          <p style={{margin:"0 0 .75rem",fontWeight:500,fontSize:15}}>Recurring Templates</p>
          <p style={{margin:"0 0 .75rem",fontSize:13,color:"var(--color-text-secondary)"}}>Save frequent expenses for one-tap logging.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Template Name</label>
              <input placeholder="e.g. Office Auto" value={newTemplate.name} onChange={e=>setNewTemplate(t=>({...t,name:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Amount (₹)</label>
              <input type="number" value={newTemplate.amount} onChange={e=>setNewTemplate(t=>({...t,amount:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Category</label>
              <select value={newTemplate.category} onChange={e=>setNewTemplate(t=>({...t,category:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}>
                {CATEGORIES.map(c=><option key={c.name}>{c.name}</option>)}
              </select></div>
            <div><label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Note</label>
              <input placeholder="Optional" value={newTemplate.note} onChange={e=>setNewTemplate(t=>({...t,note:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
          </div>
          <button onClick={()=>{
            if(!newTemplate.name||!newTemplate.amount) return;
            saveTemplates([...templates,{id:Date.now(),...newTemplate}]);
            setNewTemplate({name:"",amount:"",category:"Food",note:""});
          }} style={{padding:"8px 18px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",cursor:"pointer",fontSize:14}}>Save Template</button>

          {templates.length>0&&<div style={{marginTop:"1rem"}}>
            {templates.map(t=>(
              <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:"0.5px solid var(--color-border-tertiary)"}}>
                <span style={{fontSize:13}}>{catIcon(t.category)} {t.name} · {fmtAmt(t.amount)}</span>
                <button onClick={()=>saveTemplates(templates.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:16}}>×</button>
              </div>
            ))}
          </div>}
        </div>

        <div style={{...card(),marginBottom:"1.25rem"}}>
          <p style={{margin:"0 0 .75rem",fontWeight:500,fontSize:15}}>Data</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={exportCSV} style={{padding:"8px 16px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",cursor:"pointer",fontSize:14}}>⬇ Export CSV</button>
            <button onClick={()=>{if(window.confirm("Delete ALL expenses? This cannot be undone.")) saveExp([]);}} style={{padding:"8px 16px",borderRadius:"var(--border-radius-md)",border:"0.5px solid #ef4444",background:"none",cursor:"pointer",fontSize:14,color:"#ef4444"}}>🗑 Clear All Expenses</button>
          </div>
        </div>
      </>}
    </div>
  );
}
