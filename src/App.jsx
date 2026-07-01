import { useState, useEffect, useRef } from "react";
import { supabase } from './supabaseClient.js';
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, Shield, Phone, Lock, Mail, User, X, Loader, Star, Building2, CreditCard, Users, MapPin, ScrollText, TrendingUp, LayoutDashboard, RefreshCw, CheckSquare, Settings, Info, Search, Plus, ToggleLeft, ToggleRight, Edit2, Save, Wallet, Archive, Upload, Send, FileText, Home, TrendingDown, ArrowRightLeft, PlusCircle, Bell, BarChart2, ArrowDownLeft, ArrowUpRight, Copy, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ── Admin Data + Helpers + UI Primitives ─────────────────────────────────────
// ── Real data from ProfitSharing_June2026.pdf ─────────────────────────────────
const ALL_INVESTORS = [
  { id:"u01", name:"Toheeb Obidara",            phone:"08140980207", capital:500000,    stake:0.493,  profit:23554.34,   approved_withdrawals:0,          status:"active", email:"toheeb@email.com",    bank:"GTBank",       account:"0162180968", investment_date:"2025-12-30", profit_withdrawn:false, nokName:"Aishat Lawal",          nokPhone:"+18573398794", nokRel:"Sister",   nokAddr:"Apt 7, 114 Shurtleff St, Chelsea, MA" },
  { id:"u02", name:"Abdulrahim Hidayat Oyiza",  phone:"08093885975", capital:400000,    stake:0.394,  profit:18843.48,   approved_withdrawals:0,          status:"active", email:"abdulrahim@email.com", bank:"First Bank",   account:"3105652439", investment_date:"2025-09-02", profit_withdrawn:false, nokName:"Ahmed Abdulrahim",      nokPhone:"07066807479", nokRel:"Brother",  nokAddr:"No 1, Hayin Amina Rigasa, Kaduna" },
  { id:"u03", name:"Zainab Musa Suleiman",      phone:"08033115747", capital:1000000,   stake:0.986,  profit:47108.69,   approved_withdrawals:0,          status:"active", email:"zainab@email.com",     bank:"Jaiz Bank",    account:"0001315305", investment_date:"2025-04-05", profit_withdrawn:false, nokName:"Hajiya Sa'a",           nokPhone:"08166517533", nokRel:"Mother",   nokAddr:"Apalowo Drive Saraha 2, Lokogoma, Abuja" },
  { id:"u04", name:"Fatima Yunusa",             phone:"08167215425", capital:1100000,   stake:1.085,  profit:51819.56,   approved_withdrawals:1151819.56, status:"active", email:"fatima@email.com",     bank:"Palmpay",      account:"8175833349", investment_date:"2025-04-11", profit_withdrawn:true,  nokName:"Hassenetu Baba",        nokPhone:"08138707923", nokRel:"Sister",   nokAddr:"Bwari, Abuja" },
  { id:"u05", name:"Ayuba Abdullahi Ajide",     phone:"08137290402", capital:5000000,   stake:4.931,  profit:235543.45,  approved_withdrawals:0,          status:"active", email:"ayuba@email.com",      bank:"GTBank",       account:"0149299289", investment_date:"2025-04-04", profit_withdrawn:false, nokName:"N/A",                   nokPhone:"N/A",         nokRel:"N/A",      nokAddr:"N/A" },
  { id:"u06", name:"Buhari Aishat",             phone:"08164601304", capital:1000000,   stake:0.986,  profit:47108.69,   approved_withdrawals:0,          status:"active", email:"buhari@email.com",     bank:"Opay",         account:"8164601304", investment_date:"2025-04-04", profit_withdrawn:false, nokName:"Aliu Bashir",           nokPhone:"07055159233", nokRel:"Spouse",   nokAddr:"1 Omokoiki St, Molipa Rd, Ijebu Ode" },
  { id:"u07", name:"Onyedikachi Kuss",          phone:"08062516217", capital:10000000,  stake:9.862,  profit:471086.90,  approved_withdrawals:0,          status:"active", email:"onyedi@email.com",     bank:"GTBank",       account:"0109535981", investment_date:"2025-07-04", profit_withdrawn:false, nokName:"Mr. Ucheoma Nduka Chuks",nokPhone:"07025372192",nokRel:"Brother",  nokAddr:"57 Cemetery Rd, Amukoko, Lagos" },
  { id:"u08", name:"Nduka Ucheoma",             phone:"07025372192", capital:11000000,  stake:10.848, profit:518195.59,  approved_withdrawals:0,          status:"active", email:"nduka@email.com",      bank:"Zenith Bank",  account:"2000839824", investment_date:"2025-04-04", profit_withdrawn:false, nokName:"Mrs Chikodi Ucheoma",   nokPhone:"08053826619", nokRel:"Spouse",   nokAddr:"57 Cemetery Rd, Amukoko, Lagos" },
  { id:"u09", name:"Nuruddeen Ibrahim Sgida",   phone:"07030004568", capital:500000,    stake:0.493,  profit:23554.34,   approved_withdrawals:0,          status:"active", email:"nurudeen@email.com",   bank:"Opay",         account:"7030004568", investment_date:"2025-04-04", profit_withdrawn:false, nokName:"Alhassan Zainab Danfulani",nokPhone:"08069067611",nokRel:"Sister", nokAddr:"Iya Rd Opposite Kasuwan Dare Masjid" },
  { id:"u10", name:"Raji Faridat",              phone:"08144638570", capital:1000000,   stake:0.986,  profit:47108.69,   approved_withdrawals:0,          status:"active", email:"raji@email.com",       bank:"Moniepoint",   account:"8238066884", investment_date:"2026-02-02", profit_withdrawn:false, nokName:"Samaru Yahaya Musa",    nokPhone:"08064288850", nokRel:"Father",   nokAddr:"Palladan" },
  { id:"u11", name:"Ajiboye Hamidat Oluwatoyin",phone:"08167576305", capital:16000000,  stake:15.779, profit:753739.04,  approved_withdrawals:0,          status:"active", email:"ajiboye@email.com",    bank:"UBA",          account:"1019779873", investment_date:"2025-04-03", profit_withdrawn:false, nokName:"Aisha AbdulRa'uf",      nokPhone:"08141737923", nokRel:"Sister",   nokAddr:"Arkilla Layout, Sokoto" },
  { id:"u12", name:"Musa Aminu",                phone:"07087808651", capital:700000,    stake:0.690,  profit:32976.08,   approved_withdrawals:0,          status:"active", email:"musa@email.com",       bank:"Jaiz Bank",    account:"0003753257", investment_date:"2025-04-03", profit_withdrawn:false, nokName:"Juwairiyya Musa",       nokPhone:"07039785626", nokRel:"Sister",   nokAddr:"Area 1 Section 2, Garki, Abuja" },
  { id:"u13", name:"Olaniyan Mustapha",         phone:"07036708965", capital:1000000,   stake:0.986,  profit:47108.69,   approved_withdrawals:0,          status:"active", email:"olaniyan@email.com",   bank:"Opay",         account:"7036708965", investment_date:"2025-04-03", profit_withdrawn:false, nokName:"Zainab Kareem-Olaniyan",nokPhone:"08060420749", nokRel:"Spouse",   nokAddr:"MOQ 5, NAF Base Bauchi" },
  { id:"u14", name:"Abdul ganiy hanaf",         phone:"08023661756", capital:1500000,   stake:1.479,  profit:70663.03,   approved_withdrawals:0,          status:"active", email:"abdulganiy@email.com", bank:"Jaiz Bank",    account:"0002644154", investment_date:"2025-04-14", profit_withdrawn:false, nokName:"N/A",                   nokPhone:"N/A",         nokRel:"N/A",      nokAddr:"N/A" },
  { id:"u15", name:"Ishola Rashidat",           phone:"07037241024", capital:800000,    stake:0.789,  profit:37686.95,   approved_withdrawals:0,          status:"active", email:"ishola@email.com",     bank:"Taj Bank",     account:"0006933295", investment_date:"2025-04-12", profit_withdrawn:false, nokName:"Aworinde Lateefat",     nokPhone:"08109253769", nokRel:"Sister",   nokAddr:"Otta, Ogun State" },
  { id:"u16", name:"Nurudeen D. Ademola",       phone:"08143188190", capital:1000000,   stake:0.986,  profit:47108.69,   approved_withdrawals:0,          status:"active", email:"nurudeen2@email.com",  bank:"Opay",         account:"8089897417", investment_date:"2025-04-03", profit_withdrawn:false, nokName:"Zainab Salaam",         nokPhone:"08032639900", nokRel:"Spouse",   nokAddr:"Kosobo, Oyo" },
  { id:"u17", name:"Abdullahi Nasiru",          phone:"08035388383", capital:14000000,  stake:13.807, profit:659521.66,  approved_withdrawals:0,          status:"active", email:"abdullahi@email.com",  bank:"Fidelity Bank",account:"6237898071",  investment_date:"2025-04-13", profit_withdrawn:false, nokName:"Nasiru Garba",          nokPhone:"08035388383", nokRel:"Brother",  nokAddr:"Unguwar Yayaji Kafin Madaki" },
  { id:"u18", name:"Atanda Ayodele Sarat",      phone:"07034496423", capital:1000000,   stake:0.986,  profit:47108.69,   approved_withdrawals:0,          status:"active", email:"atanda@email.com",     bank:"First Bank",   account:"3048820845", investment_date:"2025-04-03", profit_withdrawn:false, nokName:"Ibrahim Fatimah Zarah", nokPhone:"08067168181", nokRel:"Sister",   nokAddr:"Oloje Estate, Ilorin" },
  { id:"u19", name:"Ucheoma Chinagoro Chizoro", phone:"07039654166", capital:30000000,  stake:29.586, profit:1413260.69, approved_withdrawals:0,          status:"active", email:"ucheoma@email.com",    bank:"Pocketapp",    account:"9108254018", investment_date:"2025-04-14", profit_withdrawn:false, nokName:"Essien Wilfred",        nokPhone:"08026255202", nokRel:"Brother",  nokAddr:"25 Peter Nyam St, Ushafa, Abuja" },
  { id:"u20", name:"Inusa Izuafa Mujibah",      phone:"07032564727", capital:2000000,   stake:1.972,  profit:94217.38,   approved_withdrawals:0,          status:"active", email:"inusa@email.com",      bank:"First Bank",   account:"3147366169", investment_date:"2025-04-19", profit_withdrawn:false, nokName:"Fatimah",               nokPhone:"08068951381", nokRel:"Spouse",   nokAddr:"No 89, Okpokpo Quarter, Adeje" },
  { id:"u21", name:"Suleiman Muktar Salka",     phone:"08108675353", capital:1400000,   stake:1.381,  profit:65952.17,   approved_withdrawals:0,          status:"active", email:"suleiman@email.com",   bank:"First Bank",   account:"3078469807", investment_date:"2025-06-30", profit_withdrawn:false, nokName:"Sadiq Salka",           nokPhone:"07066059060", nokRel:"Brother",  nokAddr:"Minna" },
  { id:"u22", name:"Murtador Sodiq Abubakar",   phone:"07065670207", capital:500000,    stake:0.493,  profit:23554.34,   approved_withdrawals:0,          status:"active", email:"murtador@email.com",   bank:"Palmpay",      account:"7065670207", investment_date:"2025-07-01", profit_withdrawn:false, nokName:"Abdullateef Ishaq",     nokPhone:"08069778576", nokRel:"Brother",  nokAddr:"Orelope Bus Stop, Apata Yakuba, Ilorin" },
];

const CYCLES_DATA = [
  { id:"cyc-001", name:"Cycle Mar–May 2026", start:"2026-03-01", end:"2026-05-31", target_pool:101400000, pool:101400000, company_stake_pct:30, investor_split:70, rollover_days:7, profit_rate:4.7109, total_profit:6824030.20, status:"closed",   investors:22, accepting:false, member_ids:["u01","u02","u03","u04","u05","u06","u07","u08","u09","u10","u11","u12","u13","u14","u15","u16","u17","u18","u19","u20","u21","u22"] },
  { id:"cyc-002", name:"Cycle Jun–Aug 2026", start:"2026-06-01", end:"2026-08-31", target_pool:150000000, pool:67200000,  company_stake_pct:30, investor_split:70, rollover_days:7, profit_rate:null,   total_profit:null,       status:"open",     investors:18, accepting:true,  member_ids:["u01","u02","u03","u04","u05","u06","u07","u08","u09","u10","u11","u12","u13","u14","u15","u16","u17","u18"] },
];

const INIT_PAYMENTS = [
  { id:"pay-001", type:"new_investment", investor:"Aisha Mohammed", investorId:null, amount:500000,  cycle:"Cycle Jun–Aug 2026", date:"14 Jun 2026", status:"pending", receipt:null, rejectReason:"" },
  { id:"pay-002", type:"slot_purchase",  investor:"Ibrahim Salawu", investorId:null, amount:1000000, cycle:"Cycle Mar–May 2026", date:"13 Jun 2026", status:"pending", receipt:null, rejectReason:"" },
];

const INIT_WITHDRAWALS = [
  { id:"wd-001", investorId:"u01", investor:"Toheeb Obidara",  bank:"GTBank",  account:"0162180968", type:"profit_only", amount:23554.34,   capital:0,       date:"10 Jun 2026", status:"pending", adminNote:"" },
  { id:"wd-002", investorId:"u04", investor:"Fatima Yunusa",   bank:"Palmpay", account:"8175833349", type:"profit_full", amount:1151819.56, capital:1100000, date:"11 Jun 2026", status:"pending", adminNote:"" },
];

// Withdrawal threshold bands (admin-configurable). max:null on the last band means "and above".
const INIT_THRESHOLDS = [
  { id:1, min:0,       max:1000000, days:3  },
  { id:2, min:1000001, max:2000000, days:7  },
  { id:3, min:2000001, max:null,    days:14 },
];
// Live-updatable copy that investor-facing settlement calculations read from.
// Updated whenever real threshold data loads from Supabase or admin saves changes.
let liveThresholds = INIT_THRESHOLDS;
const setLiveThresholds = (t) => { if (Array.isArray(t) && t.length) liveThresholds = t; };

// Monthly performance PDF archive — seeded with the real historical report already covering Mar–May 2026
const INIT_PDFS = [
  { id:"pdf-001", cycleId:"cyc-001", cycleName:"Cycle Mar–May 2026", month:"March–May 2026", uploadedDate:"2026-06-01", fileName:"ProfitSharing_June2026.pdf", fileData:null, note:"File not attached — please re-upload via Settings → Monthly Performance Reports." },
];

// Terms & Conditions — draft v1.0, built from this project's own locked business rules.
// NOT independently reviewed by a Shariah scholar or lawyer. Must be confirmed via the
// review checklist below before it can be published.
const INIT_TNC_DRAFT = {
  pendingVersion: "1.0",
  shariahReviewed: false,
  legalReviewed: false,
  clauses: [
    { id:1,  title:"Nature of the Investment (Mudarabah Partnership)", body:"Your investment with NoorInvest operates under the Islamic finance principle of Mudarabah. You, the investor, act as the capital provider (Rab-ul-Mal). DirectCoupon & Avmall LTD acts as the fund manager (Mudarib), responsible for deploying that capital and managing each fund cycle. This is a profit-and-loss-sharing partnership, not a loan and not a deposit." },
    { id:2,  title:"No Guaranteed or Fixed Returns", body:'NoorInvest does not promise, guarantee, or fix any rate of return. Figures labelled "Profit Share" or "Expected Profit Rate" are estimates based on past performance only, never a guarantee of future results. This keeps the investment free of Riba.' },
    { id:3,  title:"Profit Distribution (Pro-Rata)", body:"At the close of each cycle, profit is split between the investor pool and the company according to the percentages fixed at that cycle's creation. Your individual share is calculated proportionally to your capital and the number of days it was actively invested during the cycle. This calculation is performed by the platform and is not subject to manual override." },
    { id:4,  title:"Loss Sharing", body:"If a cycle results in a loss, that loss is borne by investors in proportion to their capital contribution — the same way profit would have been shared. The company's own capital absorbs loss the same way, alongside investors. The exception: loss caused by the company's proven negligence or misconduct is borne by the company alone." },
    { id:5,  title:"The Company's Role and Stake", body:"The company participates in each cycle as a capital contributor, not merely as a fee-charging manager. Its stake percentage is fixed at cycle creation and does not change as new investors join. It shares profit and loss the same way any investor does." },
    { id:6,  title:"Secondary Market Trading", body:"You may sell part or all of your position to another investor before a cycle closes, at exactly the capital amount being sold — no premium, no negotiation beyond the capital amount. You may sell below your capital if you accept a loss on exit. No platform fee applies." },
    { id:7,  title:"Capital Withdrawal and Settlement Timing", body:"At cycle end, you may withdraw profit only, profit plus partial capital, or profit plus full capital. Capital withdrawals settle within a timeframe set by the platform's threshold schedule, based on the amount withdrawn." },
    { id:8,  title:"Automatic Rollover", body:"Unless you opt out within the window set for that cycle, your capital automatically carries into the next cycle." },
    { id:9,  title:"Record-Keeping", body:"NoorInvest does not delete investment, profit, or account records, even after deactivation. You may request your transaction history at any time." },
    { id:10, title:"Review and Amendment", body:"These terms may be updated from time to time. New versions are dated and published; prior versions remain on record. Continued use after a new version is published constitutes acceptance." },
  ],
};
const INIT_TNC_HISTORY = []; // published versions accumulate here, never edited or deleted once published

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt     = n  => "₦"+Number(n).toLocaleString("en-NG",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtM    = n  => "₦"+(n/1000000).toFixed(1)+"M";
const fmtDate = d  => { try{return new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});}catch{return d;}};
const todayStr = () => new Date().toISOString().slice(0,10);
const fmtAmt  = v  => { const d=String(v).replace(/[^\d]/g,""); return d?Number(d).toLocaleString("en-NG"):""; };
const parseAmt= s  => Number(String(s).replace(/,/g,""))||0;
const netCap  = inv=> Math.max(0,inv.capital-inv.approved_withdrawals);
const companyCapital = c => c.investor_split>0 ? c.pool*(c.company_stake_pct/c.investor_split) : 0;
const addAudit = (inv, action) => ({...inv, auditLog:[...(inv.auditLog||[]), {date:new Date().toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}), action}]});

// Pro-Rata engine. Assumes full-cycle participation since per-investor entry-date tracking
// is not yet in this data model — every investor in a cycle is treated as capital-weighted
// against the cycle's total pool. Internal precision kept high, payout rounded to 2dp.
const proRataShare = (capital, totalPool, totalProfit) => {
  if(!totalPool||totalPool<=0) return 0;
  const raw = (capital/totalPool)*totalProfit;
  return Math.round(raw*100)/100;
};
const proRataVariance = (rows, totalProfit) => {
  const sumPaid = rows.reduce((s,r)=>s+(typeof r.uploaded==="number"&&!isNaN(r.uploaded)?r.uploaded:0),0);
  return Math.round((totalProfit-sumPaid)*100)/100;
};

// CSV parsing — expects header row then "investor_id,profit" rows
const parseCSV = text => {
  const lines = String(text).trim().split(/\r?\n/);
  return lines.slice(1).map(line=>{
    const parts = line.split(",");
    return { id:(parts[0]||"").trim(), profitRaw:(parts[1]||"").trim() };
  }).filter(r=>r.id);
};
const buildTemplateCSV = members => {
  const header = "investor_id,investor_name,capital,profit\n";
  const rows = members.map(m=>`${m.id},${m.name},${m.capital},`).join("\n");
  return header+rows;
};

// ── UI Primitives ─────────────────────────────────────────────────────────────
const Card    = ({children,className=""}) => <div className={`bg-white/5 border border-white/10 rounded-2xl p-4 ${className}`}>{children}</div>;
const Label   = ({children})             => <p className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-1">{children}</p>;
const Divider = ()                       => <div className="border-t border-white/10 my-3"/>;
const Pill    = ({label,color})          => <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${color}`}>{label}</span>;


const StatCard = ({label,value,sub,icon:Icon,color="text-blue-400",bg="bg-blue-700/10 border-blue-700/20"}) => (
  <div className={`border rounded-2xl p-4 ${bg}`}>
    <div className="flex items-center justify-between mb-2"><p className="text-[10px] font-bold tracking-widest uppercase text-white/40 leading-tight">{label}</p><Icon className={`w-4 h-4 ${color} flex-shrink-0`}/></div>
    <p className={`text-xl font-black font-mono ${color}`}>{value}</p>
    {sub&&<p className="text-[10px] text-white/30 mt-0.5">{sub}</p>}
  </div>
);

const TF = ({label,value,onChange,type="text",error,hint,disabled}) => (
  <div>
    <label className="block text-[11px] font-bold tracking-widest uppercase text-white/40 mb-1.5">
      {label}{disabled&&<span className="ml-1 text-[9px] text-white/20 normal-case tracking-normal font-normal"> (locked)</span>}
    </label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} disabled={disabled}
      className={`w-full bg-white/5 border rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${error?"border-red-500 focus:ring-red-500/30":"border-white/10 focus:ring-blue-600/40 focus:border-blue-600/50"}`}/>
    {hint&&<p className="text-[10px] text-white/30 mt-0.5">{hint}</p>}
    {error&&<p className="text-xs text-red-400 flex items-center gap-1 mt-0.5"><AlertCircle className="w-3 h-3"/>{error}</p>}
  </div>
);

// ── VIEWS ─────────────────────────────────────────────────────────────────────
const VIEWS={DASH:"dash",CYCLES:"cycles",CREATE_CYCLE:"create",EDIT_CYCLE:"edit",ADD_MEMBERS:"addmem",MEMBERS:"members",APPROVALS:"approvals",SETTINGS:"settings",PROFIT_CSV:"profitcsv",PERFORMANCE_PDF:"perfpdf",THRESHOLDS:"thresholds",TNC:"tnc",ANALYTICS:"analytics"};

// ── Banner (merged: all 4 types, onClose, onAction) ──────────────────────────
const Banner = ({type,msg,onClose,onAction,actionLabel}) => {
  const s={error:"bg-red-950/80 border-red-600 text-red-100",success:"bg-emerald-950/80 border-emerald-600 text-emerald-100",info:"bg-blue-950/80 border-blue-700 text-blue-100",warning:"bg-amber-950/80 border-amber-600 text-amber-100"};
  const ic={error:<AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0"/>,success:<CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0"/>,info:<Info className="w-4 h-4 text-blue-400 flex-shrink-0"/>,warning:<AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0"/>};
  return(
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${s[type]}`}>
      {ic[type]}
      <div className="flex-1 min-w-0"><p className="text-sm leading-snug">{msg}</p>{onAction&&<button onClick={onAction} className="text-xs font-bold underline mt-1 hover:opacity-80">{actionLabel} →</button>}</div>
      {onClose&&<button onClick={onClose} className="opacity-60 hover:opacity-100 flex-shrink-0"><X className="w-4 h-4"/></button>}
    </div>
  );
};

// ── Auth Data + Investor View Constants ──────────────────────────────────────
const INVESTORS = [
  { id:"u01", phone:"08140980207", name:"Toheeb Obidara",            capital:500000,    stake:0.493,  profit:23554.34,   hasAccount:false, email:null, pw:null },
  { id:"u02", phone:"08093885975", name:"Abdulrahim Hidayat Oyiza",  capital:400000,    stake:0.394,  profit:18843.48,   hasAccount:false, email:null, pw:null },
  { id:"u03", phone:"08033115747", name:"Zainab Musa Suleiman",      capital:1000000,   stake:0.986,  profit:47108.69,   hasAccount:false, email:null, pw:null },
  { id:"u04", phone:"08167215425", name:"Fatima Yunusa",             capital:1100000,   stake:1.085,  profit:51819.56,   hasAccount:false, email:null, pw:null },
  { id:"u05", phone:"08137290402", name:"Ayuba Abdullahi Ajide",     capital:5000000,   stake:4.931,  profit:235543.45,  hasAccount:false, email:null, pw:null },
  { id:"u06", phone:"08164601304", name:"Buhari Aishat",             capital:1000000,   stake:0.986,  profit:47108.69,   hasAccount:false, email:null, pw:null },
  { id:"u07", phone:"08062516217", name:"Onyedikachi Kuss",          capital:10000000,  stake:9.862,  profit:471086.90,  hasAccount:false, email:null, pw:null },
  { id:"u08", phone:"07025372192", name:"Nduka Ucheoma",             capital:11000000,  stake:10.848, profit:518195.59,  hasAccount:false, email:null, pw:null },
  { id:"u09", phone:"07030004568", name:"Nuruddeen Ibrahim Sgida",   capital:500000,    stake:0.493,  profit:23554.34,   hasAccount:false, email:null, pw:null },
  { id:"u10", phone:"08144638570", name:"Raji Faridat",              capital:1000000,   stake:0.986,  profit:47108.69,   hasAccount:false, email:null, pw:null },
  { id:"u11", phone:"08167576305", name:"Ajiboye Hamidat Oluwatoyin",capital:16000000,  stake:15.779, profit:753739.04,  hasAccount:false, email:null, pw:null },
  { id:"u12", phone:"07087808651", name:"Musa Aminu",                capital:700000,    stake:0.690,  profit:32976.08,   hasAccount:false, email:null, pw:null },
  { id:"u13", phone:"07036708965", name:"Olaniyan Mustapha",         capital:1000000,   stake:0.986,  profit:47108.69,   hasAccount:false, email:null, pw:null },
  { id:"u14", phone:"08023661756", name:"Abdul ganiy hanaf",         capital:1500000,   stake:1.479,  profit:70663.03,   hasAccount:false, email:null, pw:null },
  { id:"u15", phone:"07037241024", name:"Ishola Rashidat",           capital:800000,    stake:0.789,  profit:37686.95,   hasAccount:false, email:null, pw:null },
  { id:"u16", phone:"08143188190", name:"Nurudeen D. Ademola",       capital:1000000,   stake:0.986,  profit:47108.69,   hasAccount:false, email:null, pw:null },
  { id:"u17", phone:"08035388383", name:"Abdullahi Nasiru",          capital:14000000,  stake:13.807, profit:659521.66,  hasAccount:false, email:null, pw:null },
  { id:"u18", phone:"07034496423", name:"Atanda Ayodele Sarat",      capital:1000000,   stake:0.986,  profit:47108.69,   hasAccount:false, email:null, pw:null },
  { id:"u19", phone:"07039654166", name:"Ucheoma Chinagoro Chizoro", capital:30000000,  stake:29.586, profit:1413260.69, hasAccount:false, email:null, pw:null },
  { id:"u20", phone:"07032564727", name:"Inusa Izuafa Mujibah",      capital:2000000,   stake:1.972,  profit:94217.38,   hasAccount:false, email:null, pw:null },
  { id:"u21", phone:"08108675353", name:"Suleiman Muktar Salka",     capital:1400000,   stake:1.381,  profit:65952.17,   hasAccount:false, email:null, pw:null },
  { id:"u22", phone:"07065670207", name:"Murtador Sodiq Abubakar",   capital:500000,    stake:0.493,  profit:23554.34,   hasAccount:false, email:null, pw:null },
  { id:"demo", phone:"08012345678", name:"Demo Investor",            capital:500000,    stake:0.493,  profit:23554.34,   hasAccount:true,  email:"demo@noorinvest.ng", pw:"Demo123!" },
];

const BANKS = ["Access Bank","Ecobank","Fidelity Bank","First Bank","GTBank","Jaiz Bank","Keystone Bank","Moniepoint","Opay","Palmpay","Pocketapp","Polaris Bank","Stanbic IBTC","Sterling Bank","Taj Bank","UBA","Unity Bank","Wema Bank","Zenith Bank"];
const RELS  = ["Spouse","Father","Mother","Son","Daughter","Brother","Sister","Uncle","Aunt","Other"];

// ── Supabase API ──────────────────────────────────────────────────────────────
let store = INVESTORS.map(i => ({...i})); // kept as fallback during transition
let newUsers = [];
const wait = ms => new Promise(r => setTimeout(r, ms));

const api = {
  phoneLookup: async phone => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('phone, name, has_account')
        .eq('phone', phone)
        .single();
      if (error || !data) return { found: false };
      return { found: true, name: data.name, hasAccount: data.has_account };
    } catch {
      // fallback to in-memory
      const r = store.find(u => u.phone === phone);
      return r ? { found: true, name: r.name, hasAccount: r.hasAccount } : { found: false };
    }
  },

  createAccount: async (phone, email, pw) => {
    try {
      // Check email not already taken
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (existing) return { ok: false, err: "EMAIL_TAKEN" };
      // Hash password using btoa (simple encoding for now, bcrypt needs backend)
      const { error } = await supabase
        .from('users')
        .update({ email, password_hash: btoa(pw), has_account: true })
        .eq('phone', phone);
      if (error) return { ok: false, err: "UPDATE_FAILED" };
      // Sync the real email onto the investor record (overwrites seed placeholder)
      await supabase.from('investors').update({ email }).eq('phone', phone);
      return { ok: true };
    } catch {
      // fallback to in-memory
      const i = store.findIndex(u => u.phone === phone);
      if (i < 0) return { ok: false, err: "NOT_FOUND" };
      if ([...store, ...newUsers].some(u => u.email === email)) return { ok: false, err: "EMAIL_TAKEN" };
      store[i] = { ...store[i], email, pw, hasAccount: true };
      return { ok: true };
    }
  },

  login: async (email, pw) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, phone, password_hash, role')
        .eq('email', email)
        .single();
      if (error || !data) return { ok: false };
      if (data.password_hash !== btoa(pw)) return { ok: false };
      // Get investor record
      const { data: inv } = await supabase
        .from('investors')
        .select('id')
        .eq('phone', data.phone)
        .maybeSingle();
      return { ok: true, name: data.name, id: inv?.id || data.id, phone: data.phone };
    } catch {
      const r = [...store, ...newUsers].find(u => u.email === email && u.pw === pw);
      return r ? { ok: true, name: r.name, id: r.id } : { ok: false };
    }
  },

  adminLogin: async (email, pw) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, password_hash, role')
        .eq('email', email)
        .eq('role', 'admin')
        .single();
      if (error || !data) return { ok: false };
      if (data.password_hash !== btoa(pw)) return { ok: false };
      return { ok: true, name: data.name };
    } catch {
      return email === "admin@noorinvest.ng" && pw === "Admin@2025" ? { ok: true, name: "Ibrahim Usman" } : { ok: false };
    }
  },

  register: async data => {
    try {
      // Check email not taken
      const { data: existingEmail } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .maybeSingle();
      if (existingEmail) return { ok: false, err: "EMAIL_TAKEN" };
      // Check phone not taken
      const { data: existingPhone } = await supabase
        .from('users')
        .select('id')
        .eq('phone', data.phone)
        .maybeSingle();
      if (existingPhone) return { ok: false, err: "PHONE_TAKEN" };
      // Insert new user
      const { error } = await supabase
        .from('users')
        .insert({
          phone: data.phone,
          name: data.fullName || data.name,
          email: data.email,
          password_hash: btoa(data.password),
          has_account: true,
          role: 'investor',
        });
      if (error) return { ok: false, err: "REGISTER_FAILED" };
      // Create matching investor record so the investor portal has real data
      const newInvestorId = `u-${Date.now()}`;
      const { error: invError } = await supabase
        .from('investors')
        .insert({
          id: newInvestorId,
          name: data.fullName || data.name,
          phone: data.phone,
          email: data.email,
          capital: 0,
          stake: 0,
          profit: 0,
          approved_withdrawals: 0,
          profit_withdrawn: false,
          investment_date: new Date().toISOString().slice(0,10),
          status: 'active',
          bank: data.bankName || '',
          account: data.bankAccountNo || '',
          account_number: data.bankAccountNo || '',
          account_name: data.bankAccountName || data.fullName || data.name,
          address: data.address || '',
          nok_name: data.nokName || '',
          nok_phone: data.nokPhone || '',
          nok_rel: data.nokRelationship || '',
          nok_addr: data.nokAddress || '',
        });
      if (invError) return { ok: false, err: "REGISTER_FAILED" };
      return { ok: true };
    } catch {
      if ([...store, ...newUsers].some(u => u.email === data.email)) return { ok: false, err: "EMAIL_TAKEN" };
      if ([...store, ...newUsers].some(u => u.phone === data.phone)) return { ok: false, err: "PHONE_TAKEN" };
      newUsers.push({ ...data, hasAccount: true });
      return { ok: true };
    }
  },

  getInvestor: async (phone) => {
    try {
      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .eq('phone', phone)
        .single();
      if (error || !data) return null;
      return {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        capital: Number(data.capital),
        stake: Number(data.stake),
        profit: Number(data.profit),
        approved_withdrawals: Number(data.approved_withdrawals),
        profit_withdrawn: data.profit_withdrawn,
        investment_date: data.investment_date,
        status: data.status,
        bank: data.bank,
        account: data.account,
        account_number: data.account_number || data.account,
        account_name: data.account_name || data.name,
        address: data.address,
        nokName: data.nok_name,
        nokPhone: data.nok_phone,
        nokRelationship: data.nok_rel,
        nokAddress: data.nok_addr,
      };
    } catch { return null; }
  },

  updateInvestor: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('investors')
        .update(updates)
        .eq('id', id);
      return !error;
    } catch { return false; }
  },

  submitWithdrawal: async (wd) => {
    try {
      const { error } = await supabase.from('withdrawals').insert(wd);
      return !error;
    } catch { return false; }
  },

  submitPayment: async (pay) => {
    try {
      const { error } = await supabase.from('payments').insert(pay);
      return !error;
    } catch { return false; }
  },

  getNotifications: async (investorId) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('investor_id', investorId)
        .order('created_at', { ascending: false });
      if (error) return [];
      return data.map(n => ({ id: n.id, title: n.title, body: n.body, read: n.read, time: new Date(n.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }));
    } catch { return []; }
  },

  getCycles: async () => {
    try {
      const { data, error } = await supabase
        .from('cycles')
        .select('*')
        .order('created_at', { ascending: true });
      if (error || !data) return null;
      return data.map(c => ({
        id: c.id,
        name: c.name,
        start: c.start_date,
        end: c.end_date,
        pool: Number(c.pool),
        target_pool: Number(c.target_pool),
        company_stake_pct: Number(c.company_stake_pct),
        investor_split: Number(c.investor_split),
        rollover_days: c.rollover_days,
        profit_rate: c.profit_rate ? Number(c.profit_rate) : null,
        total_profit: c.total_profit ? Number(c.total_profit) : null,
        status: c.status,
        accepting: c.accepting,
        investors: c.investors_count,
        member_ids: [],
      }));
    } catch { return null; }
  },

  getAllInvestors: async () => {
    try {
      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .order('name', { ascending: true });
      if (error || !data) return null;
      return data.map(i => ({
        id: i.id,
        name: i.name,
        phone: i.phone,
        email: i.email,
        capital: Number(i.capital),
        stake: Number(i.stake),
        profit: Number(i.profit),
        approved_withdrawals: Number(i.approved_withdrawals),
        profit_withdrawn: i.profit_withdrawn,
        investment_date: i.investment_date,
        status: i.status,
        bank: i.bank,
        account: i.account,
        account_number: i.account_number || i.account,
        account_name: i.account_name || i.name,
        address: i.address,
        nokName: i.nok_name,
        nokPhone: i.nok_phone,
        nokRel: i.nok_rel,
        nokAddr: i.nok_addr,
      }));
    } catch { return null; }
  },

  getPayments: async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map(p => ({
        id: p.id,
        type: p.type,
        investor: p.investor_name,
        investorId: p.investor_id,
        amount: Number(p.amount),
        cycle: p.cycle_name,
        date: p.date,
        status: p.status,
        receipt: p.receipt,
        rejectReason: p.reject_reason || '',
      }));
    } catch { return null; }
  },

  getWithdrawals: async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map(w => ({
        id: w.id,
        investorId: w.investor_id,
        investor: w.investor_name,
        bank: w.bank,
        account: w.account,
        type: w.type,
        amount: Number(w.amount),
        capital: Number(w.capital),
        date: w.date,
        status: w.status,
        adminNote: w.admin_note || '',
      }));
    } catch { return null; }
  },

  getThresholds: async () => {
    try {
      const { data, error } = await supabase
        .from('thresholds')
        .select('*')
        .order('min_amount', { ascending: true });
      if (error || !data) return null;
      return data.map(t => ({
        id: t.id,
        min: Number(t.min_amount),
        max: t.max_amount===null ? null : Number(t.max_amount),
        days: t.settlement_days,
      }));
    } catch { return null; }
  },

  getTncDraft: async () => {
    try {
      const { data, error } = await supabase
        .from('tnc_versions')
        .select('*')
        .eq('is_draft', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error || !data) return null;
      return {
        _dbId: data.id,
        pendingVersion: data.version,
        shariahReviewed: data.shariah_reviewed,
        legalReviewed: data.legal_reviewed,
        clauses: data.clauses,
      };
    } catch { return null; }
  },

  getTncHistory: async () => {
    try {
      const { data, error } = await supabase
        .from('tnc_versions')
        .select('*')
        .eq('is_draft', false)
        .order('created_at', { ascending: true });
      if (error || !data) return null;
      return data.map(v => ({
        version: v.version,
        publishedDate: v.published_date,
        clauses: v.clauses,
        shariahReviewed: v.shariah_reviewed,
        legalReviewed: v.legal_reviewed,
      }));
    } catch { return null; }
  },

  markNotificationsRead: async (investorId) => {
    try {
      await supabase.from('notifications').update({ read: true }).eq('investor_id', investorId);
    } catch {}
  },

  getMarketSlots: async () => {
    try {
      const { data, error } = await supabase
        .from('market_slots')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map(s => ({
        slot_id: s.slot_id,
        seller: s.seller,
        cycle: s.cycle_name,
        capital: Number(s.capital),
        stake_pct: Number(s.stake_pct),
        sale_amount: Number(s.sale_amount),
        days_in_fund: s.days_in_fund,
        expected_rate: Number(s.expected_rate),
        lock: s.lock,
        sold: s.sold,
        is_company: s.is_company,
      }));
    } catch { return null; }
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const V = { LAND:"land",PHONE:"phone",CREATE:"create",LOGIN:"login",REG:"reg",DONE:"done",ADMIN:"admin",ADMIN_LOGIN:"admin_login",IDASH:"idash" };

// ── Investor Portal UI Primitives ────────────────────────────────────────────
// ── UI primitives ─────────────────────────────────────────────────────────────
const Err = ({msg}) => msg ? <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3 flex-shrink-0"/>{msg}</p> : null;

const Input = ({label,type="text",value,onChange,icon:Icon,error,placeholder,maxLength,hint,disabled}) => {
  const [show,setShow] = useState(false);
  const isPw = type==="password";
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"><Icon className="w-4 h-4"/></div>}
        <input type={isPw&&!show?"password":"text"} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} disabled={disabled}
          style={{paddingLeft:Icon?"2.5rem":"0.75rem"}}
          className={`w-full bg-white/5 border rounded-xl py-3 pr-10 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-all disabled:opacity-40 ${error?"border-red-500 focus:ring-red-500/30":"border-white/10 focus:ring-blue-600/40 focus:border-blue-600/50"}`}/>
        {isPw && <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">{show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>}
      </div>
      {hint&&!error&&<p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
      <Err msg={error}/>
    </div>
  );
};

const Sel = ({label,value,onChange,icon:Icon,error,opts,placeholder}) => (
  <div>
    <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">{label}</label>
    <div className="relative">
      {Icon&&<div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"><Icon className="w-4 h-4"/></div>}
      <select value={value} onChange={e=>onChange(e.target.value)} style={{paddingLeft:Icon?"2.5rem":"0.75rem"}}
        className={`w-full bg-white/5 border rounded-xl py-3 pr-4 text-sm text-white focus:outline-none focus:ring-2 transition-all appearance-none ${error?"border-red-500 focus:ring-red-500/30":"border-white/10 focus:ring-blue-600/40 focus:border-blue-600/50"}`}>
        <option value="" className="bg-slate-900 text-slate-400">{placeholder}</option>
        {opts.map(o=> <option key={o} value={o} className="bg-slate-900">{o}</option>)}
      </select>
    </div>
    <Err msg={error}/>
  </div>
);

// BankField — top-level (never nested inside another component) to prevent state reset
const BankField = ({showCustom,customVal,bankName,onSel,onCustom,error}) => (
  <div>
    <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">Bank Name</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"><Building2 className="w-4 h-4"/></div>
      <select value={showCustom?"__other__":bankName} onChange={e=>onSel(e.target.value)} style={{paddingLeft:"2.5rem"}}
        className={`w-full bg-white/5 border rounded-xl py-3 pr-4 text-sm text-white appearance-none focus:outline-none focus:ring-2 transition-all ${error?"border-red-500 focus:ring-red-500/30":"border-white/10 focus:ring-blue-600/40 focus:border-blue-600/50"}`}>
        <option value="" className="bg-slate-900 text-slate-400">Select your bank</option>
        {BANKS.map(b=> <option key={b} value={b} className="bg-slate-900">{b}</option>)}
        <option value="__other__" className="bg-slate-900 text-blue-400">✎ My bank is not listed</option>
      </select>
    </div>
    {showCustom&&(
      <div className="relative mt-2">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"><Building2 className="w-4 h-4"/></div>
        <input autoFocus type="text" value={customVal} onChange={e=>onCustom(e.target.value)} placeholder="Type your bank name exactly" style={{paddingLeft:"2.5rem"}}
          className="w-full bg-white/5 border border-blue-600/40 rounded-xl py-3 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-600/30"/>
        <p className="text-[11px] text-slate-500 mt-1">As it appears on your bank statement</p>
      </div>
    )}
    <Err msg={error}/>
  </div>
);

const Btn = ({onClick,disabled,loading,children,ghost}) => (
  <button onClick={onClick} disabled={disabled||loading}
    className={`w-full py-3.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${ghost?"bg-white/5 hover:bg-white/10 border border-white/10 text-white":"bg-blue-700 hover:bg-blue-600 text-white"}`}>
    {loading&&<Loader className="w-4 h-4 animate-spin"/>}{children}{!loading&&<ArrowRight className="w-4 h-4"/>}
  </button>
);


const Steps = ({steps,cur}) => (
  <div className="flex items-center mb-6">
    {steps.map((s,i)=>(
      <div key={i} className="flex items-center flex-1 last:flex-none">
        <div className="flex flex-col items-center">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i<cur?"bg-blue-700 border-blue-700 text-white":i===cur?"border-blue-600 text-blue-400":"border-white/20 text-white/30"}`}>
            {i<cur?<CheckCircle className="w-3.5 h-3.5"/>:i+1}
          </div>
          <span className={`text-[9px] mt-1 font-bold uppercase tracking-wide text-center max-w-[48px] leading-tight ${i===cur?"text-blue-400":"text-white/25"}`}>{s}</span>
        </div>
        {i<steps.length-1&&<div className={`flex-1 h-px mx-1 mb-4 ${i<cur?"bg-blue-700":"bg-white/10"}`}/>}
      </div>
    ))}
  </div>
);

// ── Shell ─────────────────────────────────────────────────────────────────────
const Shell = ({children,nav,badge,title,sub}) => (
  <div className="min-h-screen" style={{background:"linear-gradient(135deg,#0A1628 0%,#0d1f3c 100%)"}}>
    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
      <button onClick={()=>nav(V.LAND)} className="flex items-center gap-2">
        <Star className="w-4 h-4 text-blue-400"/><span className="text-white font-black">Noor<span className="text-blue-400">Invest</span></span>
      </button>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-700/10 border border-blue-700/20">
        <Shield className="w-3 h-3 text-blue-400"/><span className="text-[10px] text-blue-400 font-bold tracking-widest">HALAL</span>
      </div>
    </div>
    <div className="max-w-md mx-auto px-5 py-8 space-y-5">
      {badge&&<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-700/10 border border-blue-700/20"><span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">{badge}</span></div>}
      {title&&<div><h2 className="text-2xl font-black text-white">{title}</h2>{sub&&<p className="text-sm text-white/40 mt-1">{sub}</p>}</div>}
      {children}
    </div>
  </div>
);


// ── T&C Modal ────────────────────────────────────────────────────────────────
const TCModal = ({onClose,onAccept,accepted,publishedTNC}) => {
  const hasPublished = !!publishedTNC;
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-end justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-blue-400"/>
            <div>
              <p className="text-sm font-black text-white">Terms & Conditions</p>
              {hasPublished
                ? <p className="text-[10px] text-white/40">NoorInvest · v{publishedTNC.version} · {publishedTNC.shariahReviewed&&publishedTNC.legalReviewed?"Reviewed":"Pending Full Review"}</p>
                : <p className="text-[10px] text-amber-400">Being finalised — not yet published</p>
              }
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><X className="w-4 h-4 text-white/50"/></button>
        </div>
        {hasPublished ? (
          <>
            <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
              <div className="bg-blue-700/10 border border-blue-700/20 rounded-xl p-3"><p className="text-[11px] text-blue-300/80 leading-relaxed">Read carefully. By accepting you agree to invest on a Shariah-compliant profit-and-loss sharing basis with no guaranteed returns, including the auto-rollover policy.</p></div>
              {publishedTNC.clauses.map((c,i)=> <div key={i} className="space-y-1"><p className="text-xs font-bold text-white">{c.title}</p><p className="text-[11px] text-white/50 leading-relaxed">{c.body}</p></div>)}
            </div>
            <div className="px-5 py-4 border-t border-white/10 space-y-2 flex-shrink-0">
              <button onClick={onAccept} className={`w-full py-3.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${accepted?"bg-emerald-600 text-white":"bg-blue-700 hover:bg-blue-600 text-white"}`}>
                {accepted?<><CheckCircle className="w-4 h-4"/>Accepted</>:"I Have Read & Accept These Terms"}
              </button>
              <button onClick={onClose} className="w-full py-2 text-xs text-white/30 hover:text-white/60">Close without accepting</button>
            </div>
          </>
        ) : (
          <div className="p-5 space-y-4">
            <Banner type="warning" msg="Terms & Conditions are being finalised and have not yet been published. Please check back once the admin publishes the terms."/>
            <button onClick={onClose} className="w-full py-3 text-sm text-white/40 hover:text-white/60">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Investor Portal Screens ──────────────────────────────────────────────────
// ── Screens ───────────────────────────────────────────────────────────────────
const Landing = ({nav}) => (
  <div className="min-h-screen flex flex-col" style={{background:"linear-gradient(135deg,#0A1628 0%,#0d1f3c 60%,#071020 100%)"}}>
    <nav className="flex items-center justify-between px-6 py-5">
      <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-blue-700/20 border border-blue-700/30 flex items-center justify-center"><Star className="w-4 h-4 text-blue-400"/></div><span className="text-white font-black text-lg">Noor<span className="text-blue-400">Invest</span></span></div>
      <div className="flex items-center gap-3">
        <button onClick={()=>nav(V.ADMIN_LOGIN)} className="text-xs text-white/40 hover:text-white/70 font-medium">Admin</button>
        <button onClick={()=>nav(V.LOGIN)} className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors">Sign In</button>
      </div>
    </nav>

    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-10">
      {/* Animated orb */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <style>{`@keyframes orbitA{from{transform:rotateX(60deg) rotateZ(0deg)}to{transform:rotateX(60deg) rotateZ(360deg)}} @keyframes orbitB{from{transform:rotateX(0deg) rotateZ(0deg)}to{transform:rotateX(0deg) rotateZ(360deg)}} @keyframes orbitC{from{transform:rotateX(80deg) rotateY(30deg) rotateZ(0deg)}to{transform:rotateX(80deg) rotateY(30deg) rotateZ(360deg)}} @keyframes pulse3d{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}`}</style>
        <div className="absolute w-24 h-24 rounded-full" style={{background:"radial-gradient(circle,rgba(29,78,216,.5) 0%,rgba(29,78,216,.1) 60%,transparent 80%)",animation:"pulse3d 3s ease-in-out infinite",boxShadow:"0 0 60px rgba(29,78,216,.4)"}}/>
        {[{s:120,dur:"8s",anim:"orbitA",op:.5},{s:148,dur:"11s",anim:"orbitB",op:.35},{s:176,dur:"14s",anim:"orbitC",op:.25}].map(({s,dur,anim,op},i)=>(
          <div key={i} className="absolute rounded-full border border-blue-500" style={{width:s,height:s,opacity:op,animation:`${anim} ${dur} linear infinite`,transformStyle:"preserve-3d"}}/>
        ))}
        {[...Array(10)].map((_,i)=>(
          <div key={i} className="absolute w-1 h-1 rounded-full bg-blue-400" style={{top:`${20+Math.sin(i*0.9)*30}%`,left:`${20+Math.cos(i*0.7)*30}%`,opacity:0.6,animation:`pulse3d ${1.5+i*.3}s ease-in-out infinite`,animationDelay:`${i*.2}s`}}/>
        ))}
      </div>

      <div className="text-center space-y-4 max-w-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-700/10 border border-blue-700/20"><Shield className="w-3 h-3 text-blue-400"/><span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Shariah-Compliant</span></div>
        <h1 className="text-4xl font-black text-white leading-tight">Grow your wealth<br/><span className="text-blue-400">the halal way.</span></h1>
        <p className="text-white/50 text-sm leading-relaxed">Transparent, riba-free investment cycles. Profit shared fairly, never promised.</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button onClick={()=>nav(V.LOGIN)} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all">Existing Investor <ArrowRight className="w-4 h-4"/></button>
        <button onClick={()=>nav(V.REG)}   className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl text-sm transition-all">New Investor — Register</button>
      </div>
    </div>

    <div className="border-t border-white/5 px-6 py-4 flex justify-around">
      {(()=>{ const c=CYCLES_DATA.find(x=>x.status==="closed")||CYCLES_DATA[0]; const activeCount=ALL_INVESTORS.filter(i=>i.status==="active").length; return [{v:`₦${(c.pool/1e6).toFixed(1)}M`,l:"Investor Pool"},{v:String(activeCount),l:"Active Investors"},{v:`${c.profit_rate||"—"}%`,l:"Last Cycle Profit"}];})().map(({v,l})=>(
        <div key={l} className="text-center"><p className="text-base font-black text-blue-400 font-mono">{v}</p><p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{l}</p></div>
      ))}
    </div>
  </div>
);

const PhoneScreen = ({nav}) => {
  const [phone,setPhone]=useState(""); const [loading,setLoading]=useState(false); const [alert,setAlert]=useState(null); const [err,setErr]=useState("");
  const go = async()=>{
    setAlert(null);setErr("");
    if(!/^0[789][01]\d{8}$/.test(phone)){setErr("Enter a valid 11-digit Nigerian mobile number");return;}
    setLoading(true); const r=await api.phoneLookup(phone); setLoading(false);
    if(!r.found){setAlert({type:"error",msg:"Phone not registered as an existing investor.",action:()=>nav(V.REG),al:"Register as new investor"});return;}
    nav(r.hasAccount?V.LOGIN:V.CREATE,{phone,name:r.name});
  };
  return(
    <Shell nav={nav} badge="Existing Investor" title="Find Your Account" sub="Enter the mobile number registered with NoorInvest.">
      <button onClick={()=>nav(V.LAND)} className="text-xs text-white/30 hover:text-white/60">← Back to Home</button>
      {alert&&<Banner type={alert.type} msg={alert.msg} onClose={()=>setAlert(null)} onAction={alert.action} actionLabel={alert.al}/>}
      <Input label="Registered Mobile Number" value={phone} onChange={v=>{setPhone(v.replace(/\D/g,"").slice(0,11));setErr("");}} icon={Phone} placeholder="08012345678" maxLength={11} error={err}/>
      <Btn onClick={go} disabled={phone.length<11} loading={loading}>Find My Account</Btn>
      <p className="text-center text-xs text-white/30">New? <button onClick={()=>nav(V.REG)} className="text-blue-400 font-semibold">Register here</button></p>
    </Shell>
  );
};

const CreateScreen = ({nav,data}) => {
  const [email,setEmail]=useState(""); const [pw,setPw]=useState(""); const [pw2,setPw2]=useState("");
  const [loading,setLoading]=useState(false); const [alert,setAlert]=useState(null); const [errs,setErrs]=useState({});
  const validate=()=>{const e={};if(!email.includes("@")||!email.includes("."))e.email="Valid email required";if(pw.length<8)e.pw="Min 8 characters";else if(!/[A-Z]/.test(pw))e.pw="Must include one uppercase letter";else if(!/[0-9]/.test(pw))e.pw="Must include one number";if(pw!==pw2)e.pw2="Passwords do not match";setErrs(e);return!Object.keys(e).length;};
  const go=async()=>{setAlert(null);if(!validate())return;setLoading(true);const r=await api.createAccount(data?.phone,email,pw);setLoading(false);if(!r.ok){if(r.err==="EMAIL_TAKEN")setErrs({...errs,email:"Email already linked to another account"});else setAlert({type:"error",msg:"Something went wrong. Try again."});return;}nav(V.LOGIN,{phone:data?.phone,name:data?.name,email,justCreated:true});};
  return(
    <Shell nav={nav} badge="One-Time Setup" title="Create Your Login" sub="Set an email and password for future access.">
      <button onClick={()=>nav(V.PHONE)} className="text-xs text-white/30 hover:text-white/60">← Back</button>
      <div className="flex items-center gap-3 p-4 bg-blue-700/10 border border-blue-700/20 rounded-xl">
        <div className="w-9 h-9 rounded-full bg-blue-700/20 flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-blue-400"/></div>
        <div className="flex-1 min-w-0"><p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Record Found</p><p className="text-sm font-bold text-white">{data?.name}</p><p className="text-xs text-white/40">{data?.phone}</p></div>
        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0"/>
      </div>
      {alert&&<Banner type={alert.type} msg={alert.msg} onClose={()=>setAlert(null)}/>}
      <div className="space-y-4">
        <Input label="Email" value={email} onChange={setEmail} icon={Mail} placeholder="you@example.com" error={errs.email}/>
        <Input label="Password" type="password" value={pw} onChange={v=>{setPw(v);if(errs.pw)setErrs({...errs,pw:""});}} icon={Lock} placeholder="Min 8 chars, 1 uppercase, 1 number" error={errs.pw}/>
        <Input label="Confirm Password" type="password" value={pw2} onChange={v=>{setPw2(v);if(errs.pw2)setErrs({...errs,pw2:""});}} icon={Lock} placeholder="Repeat password" error={errs.pw2}/>
      </div>
      <Btn onClick={go} loading={loading}>Create Account & Sign In</Btn>
    </Shell>
  );
};

const LoginScreen = ({nav,data}) => {
  const [email,setEmail]=useState(data?.email||""); const [pw,setPw]=useState("");
  const [loading,setLoading]=useState(false); const [alert,setAlert]=useState(null); const [errs,setErrs]=useState({});
  const [showForgot,setShowForgot]=useState(false);
  const go=async()=>{setAlert(null);const e={};if(!email.includes("@"))e.email="Valid email required";if(!pw.length)e.pw="Enter password";setErrs(e);if(Object.keys(e).length)return;setLoading(true);const r=await api.login(email,pw);setLoading(false);if(r.ok){setAlert({type:"success",msg:`Welcome back, ${r.name}.`});setTimeout(()=>nav(V.IDASH,null,r),700);}else setAlert({type:"error",msg:"Incorrect email or password."});};
  return(
    <Shell nav={nav} badge="Investor Portal" title={`Welcome back${data?.name?", "+data.name.split(" ")[0]:""}`} sub={data?.justCreated?"Sign in with your new credentials.":"Sign in to your dashboard."}>
      <button onClick={()=>nav(V.PHONE)} className="text-xs text-white/30 hover:text-white/60">← Back</button>
      {data?.justCreated&&<Banner type="success" msg="Account created. Sign in below."/>}
      {alert&&<Banner type={alert.type} msg={alert.msg} onClose={()=>setAlert(null)}/>}
      <div className="space-y-4">
        <Input label="Email" value={email} onChange={setEmail} icon={Mail} placeholder="you@example.com" error={errs.email}/>
        <Input label="Password" type="password" value={pw} onChange={v=>{setPw(v);if(errs.pw)setErrs({...errs,pw:""});}} icon={Lock} placeholder="Your password" error={errs.pw}/>
        <div className="flex justify-end"><button onClick={()=>setShowForgot(s=>!s)} className="text-xs text-blue-400/60 hover:text-blue-400">Forgot password?</button></div>
        {showForgot&&<div className="p-3 bg-blue-700/10 border border-blue-700/20 rounded-xl"><p className="text-xs text-blue-300 leading-relaxed">To reset your password, contact admin on <strong>08163532290</strong> with your registered phone number.</p></div>}
      </div>
      <Btn onClick={go} loading={loading}>Sign In Securely</Btn>
      <p className="text-center text-xs text-white/30">New? <button onClick={()=>nav(V.REG)} className="text-blue-400 font-semibold">Register here</button></p>
      <p className="text-center text-xs text-white/30">First time signing in? <button onClick={()=>nav(V.PHONE)} className="text-blue-400 font-semibold">Find your account</button></p>
    </Shell>
  );
};

const RegScreen = ({nav,publishedTNC}) => {
  const STEPS=["Personal","Bank","Next of Kin","Password"];
  const [step,setStep]=useState(1);
  const [f,setF]=useState({fullName:"",phone:"",email:"",address:"",bankAccountNo:"",bankName:"",bankAccountName:"",nokName:"",nokPhone:"",nokRelationship:"",nokAddress:"",password:"",confirmPassword:""});
  const [errs,setErrs]=useState({}); const [alert,setAlert]=useState(null); const [loading,setLoading]=useState(false);
  const [tcOk,setTcOk]=useState(false); const [showTC,setShowTC]=useState(false);
  const [showCB,setShowCB]=useState(false); const [cbVal,setCbVal]=useState("");
  const sf=k=>v=>{setF(p=>({...p,[k]:v}));if(errs[k])setErrs(p=>({...p,[k]:""}));};
  const val=s=>{const e={};
    if(s===1){if(f.fullName.trim().split(" ").length<2)e.fullName="Enter first and last name";if(!/^0[789][01]\d{8}$/.test(f.phone))e.phone="Valid 11-digit Nigerian number";if(!f.email.includes("@")||!f.email.includes("."))e.email="Valid email required";if(!f.address.trim())e.address="Address required";else if(!/\d/.test(f.address))e.address="Include house/plot number";else if(f.address.trim().length<10)e.address="Include street name, area and state";}
    if(s===2){if(!f.bankName.trim())e.bankName="Select or type your bank";if(!/^\d{10}$/.test(f.bankAccountNo))e.bankAccountNo="10-digit account number required";if(f.bankAccountName.trim().length<3)e.bankAccountName="Enter account name as on bank record";}
    if(s===3){if(f.nokName.trim().split(" ").length<2)e.nokName="Enter full name";if(!/^0[789][01]\d{8}$/.test(f.nokPhone))e.nokPhone="Valid 11-digit number";if(!f.nokRelationship)e.nokRelationship="Select relationship";if(f.nokAddress.trim().length<5)e.nokAddress="Enter address";}
    if(s===4){if(f.password.length<8)e.password="Min 8 characters";else if(!/[A-Z]/.test(f.password))e.password="Include one uppercase letter";else if(!/[0-9]/.test(f.password))e.password="Include one number";if(f.password!==f.confirmPassword)e.confirmPassword="Passwords do not match";if(!tcOk)e.tc="Accept Terms & Conditions to continue";}
    setErrs(e);return!Object.keys(e).length;};
  const next=()=>{if(val(step))setStep(s=>s+1);};
  const back=()=>step===1?nav(V.LAND):setStep(s=>s-1);
  const submit=async()=>{if(!val(4))return;setLoading(true);const r=await api.register({...f,name:f.fullName});setLoading(false);if(!r.ok){if(r.err==="EMAIL_TAKEN"){setErrs({email:"Email already registered"});setStep(1);return;}if(r.err==="PHONE_TAKEN"){setErrs({phone:"Phone already registered"});setStep(1);return;}setAlert({type:"error",msg:"Registration failed. Try again."});return;}nav(V.DONE,{name:f.fullName,email:f.email});};
  const BB=({l})=> <button onClick={back} className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1">← {l}</button>;
  return(
    <Shell nav={nav} badge="New Investor">
      <Steps steps={STEPS} cur={step-1}/>
      {alert&&<Banner type={alert.type} msg={alert.msg} onClose={()=>setAlert(null)}/>}
      {step===1&&<div className="space-y-5"><BB l="Back to Home"/><div><p className="text-xs text-blue-400 font-bold tracking-widest uppercase">Step 1 of 4</p><h2 className="text-2xl font-black text-white">Personal Details</h2></div><div className="space-y-4"><Input label="Full Legal Name" value={f.fullName} onChange={sf("fullName")} icon={User} placeholder="Fatima Ibrahim Musa" error={errs.fullName} hint="As on your official ID"/><Input label="Mobile Number" value={f.phone} onChange={v=>sf("phone")(v.replace(/\D/g,"").slice(0,11))} icon={Phone} placeholder="08012345678" maxLength={11} error={errs.phone} hint="Becomes your account identifier"/><Input label="Email" value={f.email} onChange={sf("email")} icon={Mail} placeholder="fatima@example.com" error={errs.email}/><Input label="Residential Address" value={f.address} onChange={sf("address")} icon={MapPin} placeholder="No. 12 Hayin Amina, Rigasa, Kaduna" error={errs.address} hint="Include house number, street, area and state"/></div><Btn onClick={next}>Continue to Bank Details</Btn></div>}
      {step===2&&<div className="space-y-5"><BB l="Back to Personal Details"/><div><p className="text-xs text-blue-400 font-bold tracking-widest uppercase">Step 2 of 4</p><h2 className="text-2xl font-black text-white">Bank Details</h2><p className="text-sm text-white/40 mt-1">Profit distributions go to this account.</p></div><div className="space-y-4"><BankField showCustom={showCB} customVal={cbVal} bankName={f.bankName} error={errs.bankName} onSel={v=>{if(v==="__other__"){setShowCB(true);setF(p=>({...p,bankName:""}));}else{setShowCB(false);setCbVal("");setF(p=>({...p,bankName:v}));if(errs.bankName)setErrs(p=>({...p,bankName:""}));}} } onCustom={v=>{setCbVal(v);setF(p=>({...p,bankName:v}));if(errs.bankName)setErrs(p=>({...p,bankName:""}));}}/><Input label="Account Number" value={f.bankAccountNo} onChange={v=>sf("bankAccountNo")(v.replace(/\D/g,"").slice(0,10))} icon={CreditCard} placeholder="0123456789" maxLength={10} error={errs.bankAccountNo} hint="10-digit NUBAN"/><Input label="Account Name" value={f.bankAccountName} onChange={sf("bankAccountName")} icon={User} placeholder="Fatima Ibrahim Musa" error={errs.bankAccountName} hint="Must match your bank record"/></div><Btn onClick={next}>Continue to Next of Kin</Btn></div>}
      {step===3&&<div className="space-y-5"><BB l="Back to Bank Details"/><div><p className="text-xs text-blue-400 font-bold tracking-widest uppercase">Step 3 of 4</p><h2 className="text-2xl font-black text-white">Next of Kin</h2></div><div className="space-y-4"><Input label="Full Name" value={f.nokName} onChange={sf("nokName")} icon={User} placeholder="Ibrahim Musa" error={errs.nokName}/><Input label="Mobile Number" value={f.nokPhone} onChange={v=>sf("nokPhone")(v.replace(/\D/g,"").slice(0,11))} icon={Phone} placeholder="08012345678" maxLength={11} error={errs.nokPhone}/><Sel label="Relationship" value={f.nokRelationship} onChange={sf("nokRelationship")} icon={Users} error={errs.nokRelationship} opts={RELS} placeholder="Select relationship"/><Input label="Address" value={f.nokAddress} onChange={sf("nokAddress")} icon={MapPin} placeholder="Next of kin address" error={errs.nokAddress}/></div><Btn onClick={next}>Continue to Password</Btn></div>}
      {step===4&&<div className="space-y-5"><BB l="Back to Next of Kin"/><div><p className="text-xs text-blue-400 font-bold tracking-widest uppercase">Step 4 of 4</p><h2 className="text-2xl font-black text-white">Password & Review</h2></div><div className="space-y-4"><Input label="Create Password" type="password" value={f.password} onChange={sf("password")} icon={Lock} placeholder="Min 8 chars, 1 uppercase, 1 number" error={errs.password}/><Input label="Confirm Password" type="password" value={f.confirmPassword} onChange={sf("confirmPassword")} icon={Lock} placeholder="Repeat password" error={errs.confirmPassword}/>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Summary</p>
          {[["Name",f.fullName],["Phone",f.phone],["Email",f.email],["Bank",f.bankName],["Account No",f.bankAccountNo],["Next of Kin",f.nokName]].map(([l,v])=> <div key={l} className="flex justify-between text-sm gap-2"><span className="text-white/40 flex-shrink-0">{l}</span><span className="text-white font-medium text-right truncate max-w-[170px]">{v||<span className="text-white/20 italic">—</span>}</span></div>)}
        </div>
        {!publishedTNC ? (
          <div className="rounded-xl border border-amber-600/30 bg-amber-950/30 p-4">
            <p className="text-xs text-amber-300 leading-relaxed">Terms & Conditions are being finalised. Registration will be available once the admin publishes the terms.</p>
          </div>
        ) : (
          <div className={`rounded-xl border p-4 space-y-3 ${errs.tc?"border-red-500 bg-red-500/5":tcOk?"border-emerald-500/30 bg-emerald-500/5":"border-white/10 bg-white/5"}`}>
          <div className="flex items-start gap-3">
            <button onClick={()=>{setTcOk(!tcOk);if(errs.tc)setErrs(p=>({...p,tc:""}));}} className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${tcOk?"bg-emerald-500 border-emerald-500":"border-white/20 hover:border-blue-400"}`}>{tcOk&&<CheckCircle className="w-3.5 h-3.5 text-white"/>}</button>
            <p className="text-sm text-white/60 leading-relaxed">I have read and accept the <button onClick={()=>setShowTC(true)} className="text-blue-400 font-bold underline underline-offset-2">Terms & Conditions</button>, including the Shariah profit-sharing basis and auto-rollover policy.</p>
          </div>
          {!tcOk&&<button onClick={()=>setShowTC(true)} className="w-full py-2 text-xs font-bold text-blue-400 border border-blue-700/30 rounded-lg hover:bg-blue-700/10 flex items-center justify-center gap-1.5"><ScrollText className="w-3.5 h-3.5"/>Read Terms & Conditions</button>}
          {tcOk&&<div className="flex items-center justify-between"><div className="flex items-center gap-1.5 text-emerald-400"><CheckCircle className="w-3.5 h-3.5"/><span className="text-xs font-semibold">Terms accepted</span></div><button onClick={()=>setShowTC(true)} className="text-[10px] text-white/30 underline">Review again</button></div>}
          {errs.tc&&<Err msg={errs.tc}/>}
          </div>
        )}
      </div><Btn onClick={submit} loading={loading} disabled={!tcOk||!publishedTNC}>Complete Registration</Btn></div>}
      {showTC&&<TCModal onClose={()=>setShowTC(false)} onAccept={()=>{setTcOk(true);setShowTC(false);if(errs.tc)setErrs(p=>({...p,tc:""}));}} accepted={tcOk} publishedTNC={publishedTNC}/>}
    </Shell>
  );
};

const DoneScreen = ({nav,data}) => (
  <Shell nav={nav}><div className="flex flex-col items-center text-center gap-6 py-8">
    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center"><CheckCircle className="w-10 h-10 text-emerald-400"/></div>
    <div><h2 className="text-2xl font-black text-white">Registration Complete</h2><p className="text-sm text-white/40 mt-2 max-w-xs leading-relaxed"><strong className="text-white">{data?.name}</strong>, your account is active.</p></div>
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full text-left space-y-2"><p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Your Login</p><div className="flex justify-between text-sm"><span className="text-white/40">Email</span><span className="text-white font-medium truncate max-w-[170px]">{data?.email}</span></div><div className="flex justify-between text-sm"><span className="text-white/40">Sign in via</span><span className="text-blue-400 font-medium">Email + Password</span></div></div>
    <button onClick={()=>nav(V.LOGIN,{email:data?.email,justCreated:true})} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">Sign In Now <ArrowRight className="w-4 h-4"/></button>
  </div></Shell>
);

const AdminScreen = ({nav}) => {
  const [email,setEmail]=useState(""); const [pw,setPw]=useState("");
  const [loading,setLoading]=useState(false); const [alert,setAlert]=useState(null); const [errs,setErrs]=useState({});
  const go=async()=>{setAlert(null);const e={};if(!email.includes("@"))e.email="Valid email";if(!pw.length)e.pw="Password required";setErrs(e);if(Object.keys(e).length)return;setLoading(true);const r=await api.adminLogin(email,pw);setLoading(false);if(r.ok)setTimeout(()=>nav(V.ADMIN,null,r),600);else setAlert({type:"error",msg:"Invalid admin credentials."});};
  return(
    <Shell nav={nav} badge="Admin Portal" title="Admin Sign In" sub="Restricted access. Authorised personnel only.">
      <button onClick={()=>nav(V.LAND)} className="text-xs text-white/30 hover:text-white/60">← Back</button>
      {alert&&<Banner type={alert.type} msg={alert.msg} onClose={()=>setAlert(null)}/>}
      <div className="space-y-4"><Input label="Admin Email" value={email} onChange={setEmail} icon={Mail} placeholder="admin@noorinvest.ng" error={errs.email}/><Input label="Password" type="password" value={pw} onChange={setPw} icon={Lock} placeholder="Admin password" error={errs.pw}/></div>
      <Btn onClick={go} loading={loading}>Sign In to Admin Panel</Btn>
    </Shell>
  );
};

// ── Investor Portal Data & Helpers ────────────────────────────────────────────
const IV = { HOME:"inv_home", WITHDRAW:"inv_withdraw", HISTORY:"inv_history", MARKET:"inv_market", INVEST:"inv_invest", PROFILE:"inv_profile", STATEMENT:"inv_statement" };

let INVESTOR_CYCLE        = CYCLES_DATA.find(c=>c.status==="closed")||CYCLES_DATA[0];
let INVESTOR_NEXT_CYCLE   = { ...(CYCLES_DATA.find(c=>c.status==="open")||CYCLES_DATA[1]), current_pool:67200000, min_investment:100000, max_investment:20000000, expected_rate:4.5, slots_left:18, is_full:false };
let INVESTOR_FUTURE_CYCLE = { id:"cyc-sep-nov-2026", name:"Cycle Sep–Nov 2026", start:"2026-09-01", end:"2026-11-30", target_pool:200000000, current_pool:200000000, min_investment:500000, max_investment:25000000, expected_rate:5.0, slots_left:0, is_full:true };

// Updates investor-facing cycle variables whenever live data loads from Supabase.
// Called from root useEffect and triggers a re-render of the whole tree.
const updateInvestorCycles = (liveCycles) => {
  if (!liveCycles?.length) return;
  const closed = liveCycles.filter(c=>c.status==="closed");
  const lastClosed = closed.length ? closed.reduce((a,b)=>new Date(a.end)>new Date(b.end)?a:b) : liveCycles[0];
  INVESTOR_CYCLE = lastClosed;
  const openCyc = liveCycles.find(c=>c.status==="open") || liveCycles[liveCycles.length-1];
  INVESTOR_NEXT_CYCLE = {
    ...openCyc,
    current_pool: openCyc.pool || 0,
    min_investment: 100000,
    max_investment: 20000000,
    expected_rate: openCyc.profit_rate || null,
    slots_left: 18,
    is_full: false,
  };
  const future = liveCycles.filter(c=>c.status==="upcoming"||c.status==="draft");
  INVESTOR_FUTURE_CYCLE = future.length ? {...future[0], current_pool:future[0].pool||0, min_investment:500000, max_investment:25000000, slots_left:0, is_full:true} : INVESTOR_FUTURE_CYCLE;
};

// DAYS_LEFT computed as a function so it always reflects current INVESTOR_NEXT_CYCLE
const getDaysLeft = () => Math.max(0,Math.ceil((new Date(INVESTOR_NEXT_CYCLE.end||"2026-08-31") - new Date())/(1000*60*60*24)));

const PAYMENT_ACCOUNT = { bank:"Moniepoint MFB", account_number:"4650580467", account_name:"Gigabundle Ltd - Gigabundle Investment" };

const INIT_INVESTOR = {
  id:"u-demo", name:"Demo Investor", email:"demo@noorinvest.ng",
  phone:"08012345678", capital:500000, stake:0.493, profit:23554.34,
  investment_date:"2026-03-01", profit_withdrawn:false,
  bank:"GTBank", account_number:"0162180968", account_name:"Demo Investor",
  address:"Apt 7, 114 Shurtleff Street, Chelsea, Massachusetts, USA",
  nokName:"Aishat Lawal", nokPhone:"+18573398794", nokRelationship:"Sister",
  nokAddress:"Apt 7, 114 Shurtleff Street, Chelsea, Massachusetts, USA",
};

const INIT_MARKET_SLOTS = [
  { slot_id:"slt-001", seller:"Anonymous Investor", cycle:INVESTOR_CYCLE.name, capital:1000000, stake_pct:0.986, sale_amount:1000000, days_in_fund:76, expected_rate:4.7109, lock:false, sold:false, is_company:false },
  { slot_id:"slt-002", seller:"Company Stake",      cycle:INVESTOR_CYCLE.name, capital:5000000, stake_pct:4.931, sale_amount:5000000, days_in_fund:76, expected_rate:4.7109, lock:false, sold:false, is_company:true  },
  { slot_id:"slt-003", seller:"Anonymous Investor", cycle:INVESTOR_CYCLE.name, capital:400000,  stake_pct:0.394, sale_amount:400000,  days_in_fund:76, expected_rate:4.7109, lock:true,  sold:false, is_company:false },
];
const INIT_MY_LISTING = null;
const INIT_WAITING    = null;

const getDays        = amt => { const b=liveThresholds.find(t=>t.max===null||amt<=t.max); return b?b.days:14; };
const addDays        = n   => { const d=new Date(); d.setDate(d.getDate()+n); return d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}); };
const getGreeting    = ()  => { const h=new Date().getHours(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening"; };
const fmtI   = raw => { const d=String(raw).replace(/[^\d]/g,""); return d?Number(d).toLocaleString("en-NG"):""; };
const parseI = s   => Number(String(s).replace(/,/g,""))||0;
const SmallVal = ({children,color="text-white"}) =>  <p className={`text-sm font-bold ${color}`}>{children}</p>;

const NOTIFS = [
  { id:1, title:"Profit Share Allocated", body:`Your profit of ${fmt(INIT_INVESTOR.profit)} from ${INVESTOR_CYCLE.name} is ready to withdraw.`, time:"1 Jun 2026", read:false },
  { id:2, title:"New Cycle Open",         body:`${INVESTOR_NEXT_CYCLE.name} is now open for investment.`,                                         time:"1 Jun 2026", read:false },
  { id:3, title:"Account Verified",       body:"Your account has been verified and is fully active.",                                               time:"3 Mar 2026", read:true  },
];

// ── Investor Portal UI Helpers ───────────────────────────────────────────────
const CopyBtn = ({text}) => {
  const [ok,setOk]=useState(false);
  return <button onClick={()=>{navigator.clipboard?.writeText(text).catch(()=>{});setOk(true);setTimeout(()=>setOk(false),2000);}} className="ml-2 text-blue-400 hover:text-blue-300 flex-shrink-0">{ok?<CheckCircle className="w-3.5 h-3.5 text-emerald-400"/>:<Copy className="w-3.5 h-3.5"/>}</button>;
};

const AmtInput = ({value,onChange,label,hint,max,error}) => (
  <div>
    {label&&<p className="text-[11px] font-bold tracking-widest uppercase text-white/40 mb-1.5">{label}</p>}
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">₦</span>
      <input type="text" inputMode="numeric" value={value} onChange={e=>onChange(fmtI(e.target.value))} placeholder="0" style={{paddingLeft:"2rem"}}
        className={`w-full bg-white/5 border rounded-xl py-3 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-all ${error?"border-red-500 focus:ring-red-500/30":"border-white/10 focus:ring-blue-600/40 focus:border-blue-600/50"}`}/>
    </div>
    {hint&&!error&&<p className="text-[11px] text-white/30 mt-1">{hint}</p>}
    <Err msg={error}/>
    {max&&parseI(value)>0&&parseI(value)<=max&&(
      <div className="mt-2 flex items-center gap-2 p-2.5 bg-blue-700/10 border border-blue-700/20 rounded-lg">
        <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0"/>
        <p className="text-[11px] text-blue-300">Settlement within <strong>{getDays(parseI(value))} days</strong> · Expected by {addDays(getDays(parseI(value)))}</p>
      </div>
    )}
  </div>
);

const EditField = ({label,value,onChange,editing,hint}) => (
  <div>
    <p className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-1">{label}</p>
    {editing
      ? <><input type="text" value={value} onChange={e=>onChange(e.target.value)}
          className="w-full bg-white/5 border border-blue-600/40 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"/>
          {hint&&<p className="text-[10px] text-white/30 mt-0.5">{hint}</p>}</>
      : <p className="text-sm text-white font-medium">{value}</p>
    }
  </div>
);


// ── Investor Portal Screens ──────────────────────────────────────────────────
const NotifPanel = ({onClose,onMarkRead,notifs}) => (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-end p-4 pt-16">
    <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div><p className="text-sm font-black text-white">Notifications</p><p className="text-[10px] text-white/40">{notifs.filter(n=>!n.read).length} unread</p></div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><X className="w-4 h-4 text-white/50"/></button>
      </div>
      <div className="divide-y divide-white/5 max-h-[65vh] overflow-y-auto">
        {notifs.map(n=>(
          <div key={n.id} className={`flex items-start gap-3 p-4 ${n.read?"opacity-50":""}`}>
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read?"bg-white/20":"bg-blue-400"}`}/>
            <div className="flex-1 min-w-0"><p className="text-xs font-bold text-white">{n.title}</p><p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">{n.body}</p><p className="text-[10px] text-white/30 mt-1">{n.time}</p></div>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-white/10">
        <button onClick={()=>{onMarkRead();onClose();}} className="w-full text-xs text-blue-400 font-semibold hover:text-blue-300 transition-colors">Mark all as read</button>
      </div>
    </div>
  </div>
);

const HomeScreen = ({nav,investor}) => {
  const profitReady = INVESTOR_CYCLE.status==="closed" && !investor.profit_withdrawn;
  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-start justify-between">
        <div><p className="text-xs text-white/40 font-medium">{getGreeting()},</p><h1 className="text-xl font-black text-white">{investor.name.split(" ")[0]}</h1></div>
      </div>

      {profitReady&&<Banner type="success" msg={`Your profit share of ${fmt(investor.profit)} from ${INVESTOR_CYCLE.name} is ready to withdraw.`}/>}

      {/* Capital card */}
      <div className="rounded-2xl p-5 relative overflow-hidden" style={{background:"linear-gradient(135deg,#1a3a6b 0%,#1D4ED8 100%)"}}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8"/>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-8 -translate-x-8"/>
        <div className="relative z-10">
          <p className="text-xs text-blue-200/70 font-bold uppercase tracking-widest">Capital Deployed</p>
          <p className="text-3xl font-black text-white font-mono mt-1">{fmt(investor.capital)}</p>
          <div className="flex items-center justify-between mt-3">
            <div><p className="text-[10px] text-blue-200/60 uppercase tracking-widest">Cycle</p><p className="text-xs text-white font-semibold">{INVESTOR_CYCLE.name}</p></div>
            <div className="text-right"><p className="text-[10px] text-blue-200/60 uppercase tracking-widest">Invested</p><p className="text-xs text-white font-semibold">{fmtDate(investor.investment_date)}</p></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center"><Label>Profit Share</Label><SmallVal color="text-emerald-400">{fmt(investor.profit)}</SmallVal></Card>
        <Card className="text-center"><Label>Last Rate</Label><SmallVal color="text-blue-400">{INVESTOR_CYCLE.profit_rate?`${INVESTOR_CYCLE.profit_rate}%`:"—"}</SmallVal></Card>
        <Card className="text-center"><Label>Your Stake</Label><SmallVal>{investor.stake?`${investor.stake}%`:"—"}</SmallVal></Card>
      </div>
      <p className="text-[10px] text-white/25 text-center -mt-2">Past profit rate shown. Not a guarantee of future returns.</p>

      {/* Countdown */}
      <Card>
        <div className="flex items-center justify-between">
          <div><Label>Next Cycle — {INVESTOR_NEXT_CYCLE.name}</Label><p className="text-base font-black text-white">{getDaysLeft()} days remaining</p><p className="text-xs text-white/40 mt-0.5">Ends {fmtDate(INVESTOR_NEXT_CYCLE.end)}</p></div>
          <div className="w-14 h-14 rounded-full border-2 border-blue-600 flex items-center justify-center flex-shrink-0">
            <div className="text-center"><p className="text-sm font-black text-blue-400 leading-none">{getDaysLeft()}</p><p className="text-[8px] text-white/40 font-bold uppercase">days</p></div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-white/40 mb-1.5"><span>Fund filled</span><span className="text-white font-semibold">{((INVESTOR_NEXT_CYCLE.current_pool/INVESTOR_NEXT_CYCLE.target_pool)*100).toFixed(1)}%</span></div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{width:`${(INVESTOR_NEXT_CYCLE.current_pool/INVESTOR_NEXT_CYCLE.target_pool)*100}%`}}/></div>
          <p className="text-[10px] text-white/30 mt-1">{fmt(INVESTOR_NEXT_CYCLE.current_pool)} of {fmt(INVESTOR_NEXT_CYCLE.target_pool)}</p>
        </div>
      </Card>

      {/* Actions — Add Money removed, replaced with Add to Investment */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Quick Actions</p>
        <div className="grid grid-cols-5 gap-2">
          {[
            {icon:TrendingDown, label:"Withdraw",      color:profitReady?"bg-emerald-700/20 border-emerald-700/30 text-emerald-400":"bg-blue-700/20 border-blue-700/30 text-blue-400", view:IV.WITHDRAW},
            {icon:PlusCircle,   label:"Add to\nInvest",color:"bg-blue-700/20 border-blue-700/30 text-blue-400",    view:IV.INVEST},
            {icon:BarChart2,    label:"History",       color:"bg-blue-700/20 border-blue-700/30 text-blue-400",    view:IV.HISTORY},
            {icon:ArrowRightLeft,label:"Market",        color:"bg-blue-700/20 border-blue-700/30 text-blue-400",    view:IV.MARKET},
            {icon:FileText,     label:"Statement",     color:"bg-blue-700/20 border-blue-700/30 text-blue-400",    view:IV.STATEMENT},
          ].map(({icon:Icon,label,color,view},i)=>(
            <button key={i} onClick={()=>view&&nav(view)} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${color}`}>
              <Icon className="w-5 h-5"/><span className="text-[9px] font-bold uppercase tracking-wide leading-tight text-center whitespace-pre-line">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Recent Activity</p>
        <div className="space-y-2">
          {[
            {type:"in",  label:"Capital deposited",      amount:investor.capital, date:"1 Mar 2026"},
            {type:"out", label:"Profit share allocated",  amount:investor.profit,  date:"1 Jun 2026"},
          ].map((tx,i)=>(
            <div key={i} className="flex items-center gap-3 p-3.5 bg-white/5 border border-white/10 rounded-xl">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type==="out"?"bg-emerald-500/15 border border-emerald-500/20":"bg-blue-700/20 border border-blue-700/30"}`}>
                {tx.type==="out"?<ArrowUpRight className="w-4 h-4 text-emerald-400"/>:<ArrowDownLeft className="w-4 h-4 text-blue-400"/>}
              </div>
              <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white">{tx.label}</p><p className="text-[10px] text-white/40">{INVESTOR_CYCLE.name} · {tx.date}</p></div>
              <p className={`text-sm font-bold flex-shrink-0 ${tx.type==="out"?"text-emerald-400":"text-white"}`}>{tx.type==="out"?"+":""}{fmt(tx.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WithdrawScreen = ({nav,investor,setInvestor,setSlots,setWds}) => {
  const [step,setStep]=useState(1);
  const [type,setType]=useState("");
  const [capAmt,setCapAmt]=useState("");
  const [errs,setErrs]=useState({});
  const [done,setDone]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const isClosed=INVESTOR_CYCLE.status==="closed";
  const profit=investor.profit, capital=investor.capital;
  const capParsed=parseI(capAmt);
  const profitDays=getDays(profit);
  const capDays=getDays(type==="profit_part"?capParsed:capital);
  const maxDays=Math.max(profit>0?profitDays:0,["profit_part","profit_full","capital_mid"].includes(type)?capDays:0);
  const profitAmt=type!=="capital_mid"?profit:0;
  const capToList=type==="profit_part"?capParsed:["profit_full","capital_mid"].includes(type)?capital:0;

  const profitAlreadyRequested=investor.profit_withdrawn;

  const opts=isClosed
    ?[
      ...(!profitAlreadyRequested?[{id:"profit_only", label:"Withdraw profit share only",        sub:`Receive ${fmt(profit)}. Your ${fmt(capital)} stays invested.`}]:[]),
      ...(!profitAlreadyRequested?[{id:"profit_part", label:"Withdraw profit + part of capital", sub:`Receive ${fmt(profit)} and list a chosen portion for sale.`}]:[]),
      ...(!profitAlreadyRequested?[{id:"profit_full", label:"Withdraw profit + all capital",     sub:`Receive ${fmt(profit)} and list your full ${fmt(capital)} on the market.`}]:[]),
      ...(profitAlreadyRequested&&capital>0?[{id:"profit_full", label:"List my capital for sale", sub:`Profit withdrawal already submitted. List your ${fmt(capital)} on the secondary market.`}]:[]),
    ]
    :[{id:"capital_mid", label:"List my investment for sale",       sub:"Round still running. List your slot. Profit for days held pays when the cycle ends."}];

  const next=()=>{
    const e={};
    if(!type) e.type="Select an option to continue";
    if(type==="profit_part"){if(!capAmt||capParsed<1)e.cap="Enter amount to list";else if(capParsed>=capital)e.cap="For full capital, choose the third option";}
    setErrs(e); if(Object.keys(e).length)return; setStep(2);
  };

  // Issue 3: Block withdrawal if investor has no funds at all
  if(!investor.capital && !investor.profit) return(
    <div className="space-y-5 pb-24 flex flex-col items-center text-center pt-12">
      <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center"><Wallet className="w-8 h-8 text-white/30"/></div>
      <div><h2 className="text-xl font-black text-white">No Funds Available</h2><p className="text-sm text-white/40 mt-2 max-w-xs leading-relaxed">You don't have any capital or profit to withdraw yet. Join a cycle to get started.</p></div>
      <button onClick={()=>nav(IV.INVEST)} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">View Available Cycles <ArrowRight className="w-4 h-4"/></button>
      <button onClick={()=>nav(IV.HOME)} className="text-xs text-white/30 hover:text-white/60">Back to Home</button>
    </div>
  );

  // Show "already submitted" only if profit is withdrawn AND investor has no capital to action
  if(investor.profit_withdrawn && !investor.capital) return(
    <div className="space-y-5 pb-24 flex flex-col items-center text-center pt-12">
      <div className="w-16 h-16 rounded-full bg-blue-700/10 border-2 border-blue-700/30 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-blue-400"/></div>
      <div><h2 className="text-xl font-black text-white">Request Already Submitted</h2><p className="text-sm text-white/40 mt-2 max-w-xs leading-relaxed">Your withdrawal request is pending admin approval. You will be notified once it is processed.</p></div>
      <button onClick={()=>nav(IV.HOME)} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm">Back to Home</button>
    </div>
  );

  if(done) return(
    <div className="space-y-5 pb-24 flex flex-col items-center text-center pt-8">
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center"><CheckCircle className="w-10 h-10 text-emerald-400"/></div>
      <div><h2 className="text-xl font-black text-white">Request Submitted</h2>
        <p className="text-sm text-white/40 mt-2 max-w-xs leading-relaxed">
          {profitAmt>0&&`Profit of ${fmt(profitAmt)} sent for admin approval — paid within ${profitDays} days. `}
          {capToList>0&&`${fmt(capToList)} automatically listed on the secondary market.`}
        </p>
      </div>
      <Card className="w-full text-left space-y-2">
        <Label>Settlement Timeline</Label>
        {profitAmt>0&&<div className="flex justify-between text-sm"><span className="text-white/40">Profit payment</span><span className="text-emerald-400 font-bold">Within {profitDays} days</span></div>}
        {capToList>0&&<div className="flex justify-between text-sm"><span className="text-white/40">Capital listed</span><span className="text-blue-400 font-bold">Immediately</span></div>}
        <div className="flex justify-between text-sm"><span className="text-white/40">Expected by</span><span className="text-white font-bold">{addDays(maxDays)}</span></div>
      </Card>
      <button onClick={()=>nav(IV.HOME)} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm">Back to Home</button>
    </div>
  );

  return(
    <div className="space-y-5 pb-24">
      <button onClick={()=>nav(IV.HOME)} className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1">← Back to Home</button>
      <h2 className="text-xl font-black text-white">Withdraw Funds</h2>
      {!isClosed&&<Banner type="warning" msg="This round is still running. You can sell your capital slot now. Your profit will be calculated and paid when the round ends."/>}
      {isClosed&&profitAlreadyRequested&&<Banner type="info" msg="Your profit withdrawal is already submitted and pending admin approval. You can still list your capital on the secondary market."/>}
      {isClosed&&(
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center"><Label>Profit Ready</Label><SmallVal color="text-emerald-400">{fmt(profit)}</SmallVal></Card>
          <Card className="text-center"><Label>Your Capital</Label><SmallVal>{fmt(capital)}</SmallVal></Card>
        </div>
      )}
      {step===1&&(
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">What would you like to do?</p>
          {opts.map(({id,label,sub})=>(
            <button key={id} onClick={()=>{setType(id);setErrs({});}}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${type===id?"border-blue-600 bg-blue-700/15":"border-white/10 bg-white/5 hover:border-white/20"}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${type===id?"border-blue-400 bg-blue-400":"border-white/30"}`}>{type===id&&<span className="w-1.5 h-1.5 rounded-full bg-white"/>}</div>
              <div><p className="text-sm font-bold text-white">{label}</p><p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">{sub}</p></div>
            </button>
          ))}
          {errs.type&&<Err msg={errs.type}/>}
          {type==="profit_part"&&<AmtInput label="How much capital to list? (₦)" value={capAmt} onChange={setCapAmt} hint={`Maximum: ${fmt(capital)}`} max={capital} error={errs.cap}/>}
          {(type==="profit_only"||type==="profit_full"||type==="capital_mid")&&type&&(
            <div className="flex items-start gap-2 p-3 bg-blue-700/10 border border-blue-700/20 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5"/>
              <p className="text-[11px] text-blue-300 leading-relaxed">
                {type==="profit_only"&&`Profit of ${fmt(profit)} — admin reviews and pays within ${profitDays} days.`}
                {type==="profit_full"&&`Profit paid within ${profitDays} days. Capital auto-listed — settlement within ${capDays} days.`}
                {type==="capital_mid"&&`${fmt(capital)} auto-listed immediately — settlement within ${capDays} days.`}
              </p>
            </div>
          )}
          <button onClick={next} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">Continue <ArrowRight className="w-4 h-4"/></button>
        </div>
      )}
      {step===2&&(
        <div className="space-y-4">
          <Card className="space-y-3">
            <Label>Withdrawal Summary</Label>
            {profitAmt>0&&<div className="flex justify-between text-sm"><span className="text-white/40">Profit to receive</span><span className="text-emerald-400 font-bold">{fmt(profitAmt)}</span></div>}
            {capToList>0&&<div className="flex justify-between text-sm"><span className="text-white/40">Capital to list</span><span className="text-white font-bold">{fmt(capToList)}</span></div>}
            <Divider/>
            <div className="flex justify-between text-sm"><span className="text-white/40">Settlement window</span><span className="text-blue-400 font-bold">{maxDays} days</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/40">Expected by</span><span className="text-white font-bold">{addDays(maxDays)}</span></div>
          </Card>
          {capToList>0&&<Banner type="info" msg="Your capital will be automatically listed on the secondary market the moment you confirm."/>}
          <div className="flex gap-3">
            <button onClick={()=>setStep(1)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-sm">← Back</button>
            <button onClick={async ()=>{
              if(submitting) return;
              setSubmitting(true);
              const wdId=`wd-${Date.now()}`;
              const wdRecord={
                id:wdId,
                investorId:investor.id,
                investor:investor.name,
                bank:investor.bank,
                account:investor.account||investor.account_number,
                type,
                amount:profitAmt+capToList,
                capital:capToList,
                date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),
                status:"pending",
                adminNote:"",
              };
              // Save to Supabase
              await api.submitWithdrawal({
                id:wdId,
                investor_id:investor.id,
                investor_name:investor.name,
                bank:investor.bank,
                account:investor.account||investor.account_number,
                type,
                amount:profitAmt+capToList,
                capital:capToList,
                date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),
                status:"pending",
                admin_note:"",
              });
              // Update local state
              setInvestor(prev=>({...prev,profit_withdrawn:true}));
              api.updateInvestor(investor.id,{profit_withdrawn:true});
              setWds(ws=>[...ws,wdRecord]);
              if(capToList>0){
                const slotId=`slt-${Date.now()}`;
                const slotRecord={
                  slot_id:slotId,
                  seller:investor.name,
                  cycle:INVESTOR_CYCLE.name,
                  capital:capToList,
                  stake_pct:Number(((capToList/INVESTOR_CYCLE.pool)*100).toFixed(3)),
                  sale_amount:capToList,
                  days_in_fund:Math.max(0,Math.ceil((new Date()-new Date(investor.investment_date||INVESTOR_CYCLE.start))/(1000*60*60*24))),
                  expected_rate:INVESTOR_CYCLE.profit_rate,
                  lock:false,sold:false,is_company:false,
                };
                setSlots(ss=>[...ss,slotRecord]);
                // Save slot to Supabase
                await supabase.from('market_slots').insert({
                  slot_id:slotId,
                  seller:investor.name,
                  seller_investor_id:investor.id,
                  cycle_name:INVESTOR_CYCLE.name,
                  capital:capToList,
                  stake_pct:Number(((capToList/INVESTOR_CYCLE.pool)*100).toFixed(3)),
                  sale_amount:capToList,
                  days_in_fund:slotRecord.days_in_fund,
                  expected_rate:INVESTOR_CYCLE.profit_rate,
                  lock:false,sold:false,is_company:false,
                });
              }
              setDone(true);
              setSubmitting(false);
            }} disabled={submitting} className={`flex-1 py-3 font-bold rounded-xl text-sm transition-all ${submitting?"bg-white/10 text-white/40 cursor-not-allowed":"bg-blue-700 hover:bg-blue-600 text-white"}`}>{submitting?<span className="flex items-center justify-center gap-2"><Loader className="w-4 h-4 animate-spin"/>Submitting…</span>:"Confirm"}</button>
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryScreen = ({investor, cycles:liveCycles}) => {
  const [showFormula,setShowFormula]=useState(false);
  // Only show cycles this investor was part of
  const myCycles = liveCycles?.length
    ? liveCycles.filter(c=>
        c.status==="closed" &&
        c.total_profit &&
        (c.member_ids?.includes(investor.id) || !c.member_ids?.length)
      )
    : [INVESTOR_CYCLE];
  const c = myCycles[0] || INVESTOR_CYCLE;
  const investor_profit  = c.total_profit*(c.investor_split/100);
  const company_retained = c.total_profit*(c.company_stake_pct/100);
  const company_capital  = companyCapital(c);
  const total_portfolio  = c.pool + company_capital;
  return(
    <div className="space-y-5 pb-24">
      <h2 className="text-xl font-black text-white">Profit History</h2>
      {myCycles.length===0&&(
        <Card className="text-center py-6 space-y-2">
          <TrendingUp className="w-8 h-8 text-white/20 mx-auto"/>
          <p className="text-sm text-white/40">No history yet.</p>
          <p className="text-[11px] text-white/25">Your profit allocation will appear here after your first cycle closes.</p>
        </Card>
      )}
      {myCycles.map(c=>{
        const investor_profit  = (c.total_profit||0)*(c.investor_split/100);
        const company_retained = (c.total_profit||0)*(c.company_stake_pct/100);
        const company_capital  = companyCapital(c);
        const total_portfolio  = c.pool + company_capital;
        return(
          <div key={c.id} className="space-y-4">
            <Card className="space-y-3">
              <Label>Cycle Summary — {c.name}</Label>
              {[["Total Portfolio",fmt(total_portfolio)],["Investor Pool (70%)",fmt(c.pool)],["Company Stake (30%)",fmt(company_capital)],["Net Profit",fmt(c.total_profit)],["Investor Profit",fmt(investor_profit)],["Company Retained",fmt(company_retained)],["Profit Rate",`${c.profit_rate}%`]].map(([l,v])=>(
                <div key={l} className="flex justify-between text-sm"><span className="text-white/40">{l}</span><span className="text-white font-semibold font-mono">{v}</span></div>
              ))}
            </Card>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Your Allocation</p>
              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-black text-white">{c.name}</p><p className="text-[10px] text-white/40">{fmtDate(c.start)} — {fmtDate(c.end)}</p></div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">Allocated</span>
                </div>
                <Divider/>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2">
                  <p className="text-sm text-white leading-relaxed">
                    Your <strong className="text-blue-400">{fmt(investor.capital)}</strong> was <strong className="text-blue-400">{investor.stake}%</strong> of the total fund.<br/>
                    You received <strong className="text-emerald-400">{investor.stake}%</strong> of the <strong className="text-white">{fmt(investor_profit)}</strong> profit pool = <strong className="text-emerald-400">{fmt(investor.profit)}</strong>.
                  </p>
                </div>
                <button onClick={()=>setShowFormula(!showFormula)} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors w-full">
                  {showFormula?<ChevronUp className="w-3.5 h-3.5"/>:<ChevronDown className="w-3.5 h-3.5"/>}
                  How was this calculated?
                </button>
                {showFormula&&(
                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1.5">Formula (backend computed)</p>
                    <p className="text-[11px] text-white/50 leading-relaxed font-mono">(₦{(investor.capital/1000).toFixed(0)}k ÷ ₦{(c.pool/1000).toFixed(0)}k) × {fmt(investor_profit)} = {fmt(investor.profit)}</p>
                    <p className="text-[10px] text-white/25 mt-1">Computed by the backend system at cycle close. Read-only.</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {[{l:"Capital Invested",v:fmt(investor.capital),color:"text-white"},{l:"Your Stake",v:`${investor.stake}%`,color:"text-white"},{l:"Profit Share",v:fmt(investor.profit),color:"text-emerald-400"},{l:"Profit Rate",v:`${c.profit_rate}%`,color:"text-blue-400"}].map(({l,v,color})=>(
                    <div key={l}><Label>{l}</Label><p className={`text-sm font-black font-mono ${color}`}>{v}</p></div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );
      })}
      <Banner type="info" msg="Future cycles will show month-by-month allocation history as the admin uploads profit data each month."/>
    </div>
  );
};

const PurchaseModal = ({slot,onClose,onConfirm,investor}) => {
  const [step,setStep]=useState(1);
  const [buyAll,setBuyAll]=useState(true);
  const [customAmt,setCustomAmt]=useState("");
  const [err,setErr]=useState("");
  const parsed=parseI(customAmt);
  const amount=buyAll?slot.sale_amount:parsed;
  const settDays=getDays(amount);

  const next=()=>{
    if(!buyAll&&(parsed<1||parsed>slot.sale_amount)){setErr(`Enter between ₦1 and ${fmt(slot.sale_amount)}`);return;}
    setErr(""); setStep(2);
  };

  return(
    <div className="fixed inset-0 bg-black/85 z-50 flex items-end justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div><p className="text-xs text-blue-400 font-bold tracking-widest uppercase">{step===1?"Choose Amount":step===2?"Confirm":"Payment Details"}</p><p className="text-sm font-black text-white">{slot.cycle}</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><X className="w-4 h-4 text-white/50"/></button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Step 1 — Choose amount */}
          {step===1&&<>
            <Card className="space-y-2.5">
              <Label>Slot Details</Label>
              {[["Capital Amount",fmt(slot.capital)],["Pool Share",`${slot.stake_pct}%`],["Days in Fund",`${slot.days_in_fund} days`],["Sale Amount",fmt(slot.sale_amount)],["Platform Fee","None"]].map(([l,v])=>(
                <div key={l} className="flex justify-between text-sm"><span className="text-white/40">{l}</span><span className={`font-semibold ${l==="Platform Fee"?"text-emerald-400":"text-white"}`}>{v}</span></div>
              ))}
            </Card>
            <Banner type="info" msg="The seller receives profit up to today. You receive profit from your purchase date onwards."/>
            <div className="space-y-2">
              <p className="text-[11px] font-bold tracking-widest uppercase text-white/40">How much do you want to buy?</p>
              <button onClick={()=>{setBuyAll(true);setErr("");}} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${buyAll?"border-blue-600 bg-blue-700/15":"border-white/10 bg-white/5 hover:border-white/20"}`}>
                <div className="text-left"><p className="text-sm font-bold text-white">Buy the full slot</p><p className="text-xs text-white/40 mt-0.5">Take over the entire position</p></div>
                <div className="text-right"><p className="text-sm font-black text-white">{fmt(slot.sale_amount)}</p>{buyAll&&<CheckCircle className="w-4 h-4 text-blue-400 ml-auto mt-1"/>}</div>
              </button>
              <button onClick={()=>{setBuyAll(false);setErr("");}} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${!buyAll?"border-blue-600 bg-blue-700/15":"border-white/10 bg-white/5 hover:border-white/20"}`}>
                <div className="text-left"><p className="text-sm font-bold text-white">Buy a portion</p><p className="text-xs text-white/40 mt-0.5">Enter a smaller amount</p></div>
                {!buyAll&&<CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0"/>}
              </button>
              {!buyAll&&<AmtInput value={customAmt} onChange={v=>{setCustomAmt(v);setErr("");}} hint={`Maximum: ${fmt(slot.sale_amount)}`} error={err}/>}
            </div>
            {amount>0&&<div className="flex items-center gap-2 p-2.5 bg-blue-700/10 border border-blue-700/20 rounded-lg"><Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0"/><p className="text-[11px] text-blue-300">Your slot activates once the admin confirms your transfer — typically within <strong>24 hours</strong>.</p></div>}
            <button onClick={next} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">Continue <ArrowRight className="w-4 h-4"/></button>
          </>}

          {/* Step 2 — Confirm */}
          {step===2&&<>
            <Card className="space-y-3">
              <Label>Order Summary</Label>
              {[["You Will Pay",fmt(amount)],["Platform Fee","None"],["Total",fmt(amount)]].map(([l,v])=>(
                <div key={l} className={`flex justify-between text-sm ${l==="Total"?"border-t border-white/10 pt-2 mt-1 font-bold":""}`}><span className="text-white/40">{l}</span><span className={`font-semibold ${l==="Platform Fee"?"text-emerald-400":l==="Total"?"text-white text-base":"text-white"}`}>{v}</span></div>
              ))}
            </Card>
            <Banner type="info" msg="After confirming, you will see the bank account to transfer to. Your slot activates once the admin confirms receipt."/>
            <div className="flex gap-3">
              <button onClick={()=>setStep(1)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-sm">← Back</button>
              <button onClick={()=>setStep(3)} className="flex-1 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm">Confirm Purchase</button>
            </div>
          </>}

          {/* Step 3 — Payment */}
          {step===3&&<>
            <div className="flex flex-col items-center text-center gap-2 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center"><CheckCircle className="w-7 h-7 text-emerald-400"/></div>
              <p className="text-base font-black text-white">Transfer {fmt(amount)}</p>
              <p className="text-xs text-white/40 max-w-xs leading-relaxed">Send exactly <strong className="text-white">{fmt(amount)}</strong> to the account below. Your slot activates once admin confirms receipt.</p>
            </div>
            <Card className="space-y-3">
              <Label>Payment Account</Label>
              {[{l:"Bank",v:PAYMENT_ACCOUNT.bank,copy:false},{l:"Account Number",v:PAYMENT_ACCOUNT.account_number,copy:true},{l:"Account Name",v:PAYMENT_ACCOUNT.account_name,copy:false},{l:"Amount",v:fmt(amount),copy:false},{l:"Narration",v:`${investor.name} – ${slot.cycle}`,copy:false}].map(({l,v,copy})=>(
                <div key={l} className="flex justify-between items-center text-sm">
                  <span className="text-white/40">{l}</span>
                  <div className="flex items-center gap-1"><span className={`font-bold ${l==="Account Number"?"text-blue-400 tracking-widest text-base":"text-white"}`}>{v}</span>{copy&&<CopyBtn text={v}/>}</div>
                </div>
              ))}
            </Card>
            <Banner type="warning" msg="No extra fees. Use your registered name as narration. Slot reserved for 24 hours."/>
            <button onClick={()=>{onConfirm(slot.slot_id,amount);onClose();}} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm">Done</button>
          </>}
        </div>
      </div>
    </div>
  );
};

const ListSlotModal = ({onClose,onList,investor}) => {
  const [sellType,setSellType]=useState("");
  const [partAmt,setPartAmt]=useState("");
  const [errs,setErrs]=useState({});

  const capital    = investor.capital;
  const partParsed = parseI(partAmt);
  const saleAmt    = sellType==="all" ? capital : partParsed;

  const handleSellType = t => { setSellType(t); setErrs({}); setPartAmt(""); };

  const submit = () => {
    const e = {};
    if(!sellType)                             e.type="Choose what you want to sell";
    if(sellType==="part"){
      if(!partAmt||partParsed<1)              e.part="Enter the amount you want to sell";
      else if(partParsed>=capital)            e.part="To sell everything, choose 'Sell all'";
    }
    setErrs(e);
    if(Object.keys(e).length) return;
    onList({ capital:saleAmt, sale_amount:saleAmt });
    onClose();
  };

  return(
    <div className="fixed inset-0 bg-black/85 z-50 flex items-end justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div><p className="text-xs text-blue-400 font-bold tracking-widest uppercase">List for Sale</p><p className="text-sm font-black text-white">Your Slot — {INVESTOR_CYCLE.name}</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><X className="w-4 h-4 text-white/50"/></button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          <Card className="space-y-2.5">
            {[["Your Capital",fmt(capital)],["Your Stake",`${investor.stake}%`],["Profit (at cycle close)",fmt(investor.profit)]].map(([l,v])=>(
              <div key={l} className="flex justify-between text-sm"><span className="text-white/40">{l}</span><span className="text-white font-semibold">{v}</span></div>
            ))}
          </Card>

          <div className="space-y-2">
            <p className="text-[11px] font-bold tracking-widest uppercase text-white/40">What do you want to sell?</p>
            {[
              {id:"all",  label:"Sell all my investment",     sub:`List your full ${fmt(capital)} — buyer pays ${fmt(capital)}`},
              {id:"part", label:"Sell part of my investment", sub:"Enter how much capital to list — buyer pays that amount"},
            ].map(({id,label,sub})=>(
              <button key={id} onClick={()=>handleSellType(id)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${sellType===id?"border-blue-600 bg-blue-700/15":"border-white/10 bg-white/5 hover:border-white/20"}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${sellType===id?"border-blue-400 bg-blue-400":"border-white/30"}`}>
                  {sellType===id&&<span className="w-1.5 h-1.5 rounded-full bg-white"/>}
                </div>
                <div><p className="text-sm font-bold text-white">{label}</p><p className="text-[11px] text-white/40 mt-0.5">{sub}</p></div>
              </button>
            ))}
            {errs.type&&<p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errs.type}</p>}
          </div>

          {sellType==="part"&&(
            <AmtInput
              label="How much capital to sell? (₦)"
              value={partAmt}
              onChange={v=>{setPartAmt(v);if(errs.part)setErrs(e=>({...e,part:""}));}}
              hint={`Maximum: ${fmt(capital)} · Buyer pays this exact amount`}
              error={errs.part}
            />
          )}

          {saleAmt>0&&(
            <>
              <div className="flex items-center justify-between p-3.5 bg-blue-700/10 border border-blue-700/20 rounded-xl">
                <p className="text-xs text-white/60">Buyer pays</p>
                <p className="text-base font-black text-blue-400">{fmt(saleAmt)}</p>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-blue-700/10 border border-blue-700/20 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0"/>
                <p className="text-[11px] text-blue-300">Settlement within <strong>{getDays(saleAmt)} days</strong> of buyer found · Expected by {addDays(getDays(saleAmt))}</p>
              </div>
            </>
          )}

          <Banner type="info" msg="Once listed, your slot appears on the market immediately. You can withdraw the listing at any time before a buyer completes purchase."/>
        </div>

        <div className="px-5 py-4 border-t border-white/10 flex-shrink-0">
          <button onClick={submit} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">
            List My Slot <ArrowRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  );
};

const MarketScreen = ({slots,setSlots,myListing,setMyListing,investor,setPays,setInvestor}) => {
  const [activeTab,setActiveTab]=useState("buy");
  const [purchasing,setPurchasing]=useState(null);
  const [showList,setShowList]=useState(false);
  const [lockDemo,setLockDemo]=useState(false);
  const [purchased,setPurchased]=useState([]);

  // Refresh live slot data from Supabase every time this screen opens
  useEffect(()=>{
    api.getMarketSlots().then(data=>{ if(data) setSlots(data); });
  },[]);

  const handleConfirm=async (slotId,amt)=>{
    const slot=slots.find(s=>s.slot_id===slotId);
    const payId=`pay-${Date.now()}`;
    const amount=slot?.sale_amount||amt;
    const cycleName=slot?.cycle||INVESTOR_CYCLE.name;
    const dateStr=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});

    setPurchased(p=>[...p,slotId]);
    setSlots(ss=>ss.map(s=>s.slot_id===slotId?{...s,sold:true}:s));
    setPays(ps=>[...ps,{
      id:payId,
      type:"slot_purchase",
      investor:investor.name,
      investorId:investor.id,
      amount,
      cycle:cycleName,
      date:dateStr,
      status:"pending",
      receipt:null,
      rejectReason:"",
    }]);

    // Save payment to Supabase
    await api.submitPayment({
      id:payId,
      type:"slot_purchase",
      investor_name:investor.name,
      investor_id:investor.id,
      amount,
      cycle_name:cycleName,
      date:dateStr,
      status:"pending",
      receipt:null,
      reject_reason:"",
    });

    // Mark slot as sold in Supabase
    try {
      await supabase.from('market_slots').update({ sold:true }).eq('slot_id',slotId);
    } catch {}
  };

  const handleList=async ({capital,sale_amount})=>{
    if(!capital||capital<=0) return;
    const slotId=`slt-${Date.now()}`;
    const daysInFund=Math.max(0,Math.ceil((new Date()-new Date(investor.investment_date||INVESTOR_CYCLE.start))/(1000*60*60*24)));
    const newSlot={
      slot_id:slotId,
      seller:investor.name,
      cycle:INVESTOR_CYCLE.name,
      capital,
      stake_pct:Number(((capital/INVESTOR_CYCLE.pool)*100).toFixed(3)),
      sale_amount,
      days_in_fund:daysInFund,
      expected_rate:INVESTOR_CYCLE.profit_rate,
      lock:false,sold:false,is_company:false,
    };
    setMyListing({...newSlot,status:"listed",days:getDays(sale_amount)});
    setSlots(ss=>[...ss,newSlot]);
    // 4D: Reduce displayed capital by listed amount immediately
    if(setInvestor){
      const newCapital=Math.max(0,(investor.capital||0)-capital);
      setInvestor(prev=>({...prev,capital:newCapital}));
      // Write reduction to Supabase so it persists on refresh
      try { await supabase.from('investors').update({capital:newCapital}).eq('id',investor.id); } catch {}
    }
    // Issue 5: Save to Supabase so other users see it after refresh
    try {
      await supabase.from('market_slots').insert({
        slot_id:slotId,
        seller:investor.name,
        seller_investor_id:investor.id,
        cycle_name:INVESTOR_CYCLE.name,
        capital,
        stake_pct:newSlot.stake_pct,
        sale_amount,
        days_in_fund:daysInFund,
        expected_rate:INVESTOR_CYCLE.profit_rate,
        lock:false,sold:false,is_company:false,
      });
    } catch {}
  };

  const handleWithdrawListing=async ()=>{
    if(myListing && setInvestor){
      const restored=(investor.capital||0)+(myListing.capital||0);
      setInvestor(prev=>({...prev,capital:restored}));
      try { await supabase.from('investors').update({capital:restored}).eq('id',investor.id); } catch {}
      // Mark slot as withdrawn in Supabase so refresh doesn't restore it
      try { await supabase.from('market_slots').update({sold:true,lock:true}).eq('slot_id',myListing.slot_id); } catch {}
      setSlots(ss=>ss.filter(s=>s.slot_id!==myListing.slot_id));
    }
    setMyListing(null);
  };

  const availableSlots=slots.filter(s=>!s.sold && s.seller_investor_id!==investor.id && s.seller!==investor.name);

  return(
    <div className="space-y-5 pb-24">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
        {[{id:"buy",label:"Buy Slots"},{id:"sell",label:"My Listing"}].map(({id,label})=>(
          <button key={id} onClick={()=>setActiveTab(id)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab===id?"bg-blue-700 text-white":"text-white/40 hover:text-white/60"}`}>{label}</button>
        ))}
      </div>

      {/* BUY TAB */}
      {activeTab==="buy"&&<>
        <Banner type="info" msg="Buying a slot gives you the seller's investment position from today onwards. The seller keeps profit earned up to now."/>

        {availableSlots.length===0&&(
          <Card className="text-center py-6 space-y-2">
            <ArrowRightLeft className="w-8 h-8 text-white/20 mx-auto"/>
            <p className="text-sm text-white/40">No slots available right now.</p>
            <p className="text-[11px] text-white/25">Check back later or join the waiting list for upcoming cycles.</p>
          </Card>
        )}

        {availableSlots.map(slot=>(
          <Card key={slot.slot_id} className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-black text-white">{slot.cycle}</p>
                  {slot.is_company&&<span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-700/20 border border-purple-700/30 text-purple-400">Company Stake</span>}
                  {slot.lock&&<span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-700/20 border border-red-700/30 text-red-400 flex items-center gap-1"><Lock className="w-2.5 h-2.5"/>Reserved</span>}
                </div>
                <p className="text-[10px] text-white/40 mt-0.5">{slot.seller}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-white/40">Sale</p>
                <p className="text-base font-black text-white">{fmt(slot.sale_amount)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[{l:"Capital",v:fmt(slot.capital)},{l:"Pool Share",v:`${slot.stake_pct}%`},{l:"Days in Fund",v:`${slot.days_in_fund}d`}].map(({l,v})=>(
                <div key={l} className="bg-white/5 rounded-xl p-2"><p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{l}</p><p className="text-xs font-black text-white mt-0.5">{v}</p></div>
              ))}
            </div>

            <div className="flex items-start gap-2 p-2.5 bg-emerald-700/10 border border-emerald-700/20 rounded-lg">
              <Info className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5"/>
              <p className="text-[11px] text-emerald-300">No platform fee — you pay exactly the sale amount.</p>
            </div>

            {slot.lock?(
              <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-700/30 rounded-xl">
                <Lock className="w-4 h-4 text-red-400 flex-shrink-0"/>
                <p className="text-xs text-red-300">This slot is temporarily reserved — another investor is completing their purchase. Try again shortly.</p>
              </div>
            ):(
              <button onClick={()=>setPurchasing(slot)} className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all">
                Buy This Slot <ArrowRight className="w-4 h-4"/>
              </button>
            )}
          </Card>
        ))}
      </>}

      {/* SELL TAB */}
      {activeTab==="sell"&&<>
        {myListing?(
          <Card className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-black text-white">{myListing.cycle}</p>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-700/20 border border-amber-700/30 text-amber-400">Listed for Sale</span>
              </div>
              <div className="text-right"><p className="text-[10px] text-white/40">Sale</p><p className="text-base font-black text-white">{fmt(myListing.sale_amount)}</p></div>
            </div>
            <Divider/>
            {[["Your Capital",fmt(myListing.capital)],["Settlement Window",`${myListing.days} days`],["Expected by",addDays(myListing.days)]].map(([l,v])=>(
              <div key={l} className="flex justify-between text-sm"><span className="text-white/40">{l}</span><span className="text-white font-semibold">{v}</span></div>
            ))}
            <Banner type="info" msg="Your slot is visible on the market. You will be notified when a buyer completes purchase."/>
            <button onClick={handleWithdrawListing} className="w-full py-2.5 border border-red-700/30 text-red-400 font-bold rounded-xl text-sm hover:bg-red-700/10 transition-all">Withdraw Listing</button>
          </Card>
        ):(
          <div className="space-y-4">
            <Banner type="info" msg="List your current investment position for sale. Another investor takes over from your purchase date, and you keep profit earned up to today."/>
            <Card className="space-y-3">
              <Label>Your Current Position</Label>
              {[["Capital",fmt(investor.capital)],["Stake",`${investor.stake}%`],["Profit Share (at cycle close)",fmt(investor.profit)]].map(([l,v])=>(
                <div key={l} className="flex justify-between text-sm"><span className="text-white/40">{l}</span><span className="text-white font-semibold">{v}</span></div>
              ))}
            </Card>
            <button onClick={()=>setShowList(true)} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">
              List My Slot for Sale <ArrowRight className="w-4 h-4"/>
            </button>
          </div>
        )}
      </>}

      {purchasing&&<PurchaseModal slot={purchasing} investor={investor} onClose={()=>setPurchasing(null)} onConfirm={handleConfirm}/>}
      {showList&&<ListSlotModal onClose={()=>setShowList(false)} onList={handleList} investor={investor}/>}
    </div>
  );
};

const InvestScreen = ({waitingList,setWaitingList,investor,setPays,cycles:liveCycles}) => {
  const [selectedCycle,setSelectedCycle]=useState(null);
  const [step,setStep]=useState(1);
  const [amount,setAmount]=useState("");
  const [err,setErr]=useState("");
  const [joinedWaiting,setJoinedWaiting]=useState(!!waitingList);
  const [showWaitConfirm,setShowWaitConfirm]=useState(false);
  const [transferring,setTransferring]=useState(false);
  const parsed=parseI(amount);
  const next=()=>{if(parsed<selectedCycle?.min_investment){setErr(`Minimum is ${fmt(selectedCycle.min_investment)}`);return;}if(parsed>selectedCycle?.max_investment){setErr(`Maximum is ${fmt(selectedCycle.max_investment)}`);return;}setErr("");setStep(2);};
  const handleJoinWaiting=()=>{setWaitingList({cycle:selectedCycle?.name||INVESTOR_FUTURE_CYCLE.name,position:1,joined:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})});setJoinedWaiting(true);setShowWaitConfirm(false);};

  // Build cycle list from live data, falling back to hardcoded if none available
  const availCycles = liveCycles?.length
    ? liveCycles
        .filter(c=>c.status!=="closed"&&c.status!=="archived")
        .map(c=>({
          ...c,
          current_pool: c.pool||0,
          min_investment: c.min_investment||100000,
          max_investment: c.max_investment||20000000,
          expected_rate: c.profit_rate||c.expected_rate||null,
          slots_left: c.slots_left||18,
          is_full: c.is_full||false,
        }))
    : [INVESTOR_NEXT_CYCLE, INVESTOR_FUTURE_CYCLE];

  if(selectedCycle&&step===1){
    const fill=((selectedCycle.current_pool/selectedCycle.target_pool)*100).toFixed(1);
    return(
      <div className="space-y-5 pb-24">
        <button onClick={()=>{setSelectedCycle(null);setStep(1);setAmount("");setErr("");}} className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1">← Back to Investments</button>
        <h2 className="text-xl font-black text-white">{selectedCycle.name}</h2>
        <Card className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[{l:"Exp. Rate",v:`${selectedCycle.expected_rate}%`,color:"text-blue-400"},{l:"Min. Join",v:fmt(selectedCycle.min_investment),color:"text-white"},{l:"Slots Left",v:selectedCycle.is_full?"Full":selectedCycle.slots_left,color:selectedCycle.is_full?"text-red-400":"text-white"}].map(({l,v,color})=>(
              <div key={l} className="bg-white/5 rounded-xl p-2.5"><p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{l}</p><p className={`text-xs font-black mt-0.5 ${color}`}>{v}</p></div>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/40 mb-1.5"><span>Fund filled</span><span className="text-white font-semibold">{fill}%</span></div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{width:`${fill}%`}}/></div>
            <p className="text-[10px] text-white/30 mt-1">{fmt(selectedCycle.current_pool)} of {fmt(selectedCycle.target_pool)}</p>
          </div>
        </Card>
        <Banner type="info" msg="Expected rate reflects past cycle performance — not a guaranteed return."/>
        {selectedCycle.is_full?(
          <div className="space-y-4">
            <Banner type="warning" msg="This cycle is fully subscribed. Join the waiting list to be notified when a slot becomes available."/>
            {joinedWaiting&&waitingList?.cycle===selectedCycle.name?(
              <Card className="space-y-3 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto"/>
                <p className="text-sm font-black text-white">You're on the waiting list</p>
                <p className="text-xs text-white/40">{selectedCycle.name}</p>
                <Divider/>
                {[["Your Position",`#${waitingList?.position||1} in queue`],["Joined",waitingList?.joined||"—"],["Notified via","In-app + Email"]].map(([l,v])=>(
                  <div key={l} className="flex justify-between text-sm"><span className="text-white/40">{l}</span><span className="text-white font-semibold">{v}</span></div>
                ))}
                <Banner type="info" msg="You have 24 hours to respond when a slot becomes available. If you don't respond, it moves to the next person in line."/>
              </Card>
            ):(
              <button onClick={()=>setShowWaitConfirm(true)} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">
                Join Waiting List <ArrowRight className="w-4 h-4"/>
              </button>
            )}
          </div>
        ):(
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-white/40 mb-1.5">How much do you want to invest? (₦)</p>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">₦</span>
                <input type="text" inputMode="numeric" value={amount} onChange={e=>{setAmount(fmtI(e.target.value));setErr("");}} placeholder="0" style={{paddingLeft:"2rem"}}
                  className={`w-full bg-white/5 border rounded-xl py-3 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-all ${err?"border-red-500 focus:ring-red-500/30":"border-white/10 focus:ring-blue-600/40 focus:border-blue-600/50"}`}/>
              </div>
              <p className="text-[11px] text-white/30 mt-1">Min: {fmt(selectedCycle.min_investment)} · Max: {fmt(selectedCycle.max_investment)}</p>
              <Err msg={err}/>
            </div>
            {parsed>=selectedCycle.min_investment&&(
              <div className="flex items-start gap-2 p-2.5 bg-blue-700/10 border border-blue-700/20 rounded-lg">
                <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5"/>
                <p className="text-[11px] text-blue-300">Estimated profit at {selectedCycle.expected_rate}%: <strong>{fmt(parsed*(selectedCycle.expected_rate/100))}</strong> <span className="text-white/30">(not guaranteed)</span></p>
              </div>
            )}
            <button onClick={next} disabled={parsed<1} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">Continue <ArrowRight className="w-4 h-4"/></button>
          </div>
        )}

        {showWaitConfirm&&(
          <div className="fixed inset-0 bg-black/85 z-50 flex items-end justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4">
              <p className="text-base font-black text-white">Join Waiting List?</p>
              <p className="text-sm text-white/50 leading-relaxed">You'll be notified in-app and by email when a slot opens in <strong className="text-white">{selectedCycle.name}</strong>. You'll have 24 hours to respond before it moves to the next person.</p>
              <div className="flex gap-3">
                <button onClick={()=>setShowWaitConfirm(false)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-sm">Cancel</button>
                <button onClick={handleJoinWaiting} className="flex-1 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if(selectedCycle&&step===2){
    return(
      <div className="space-y-5 pb-24">
        <button onClick={()=>setStep(1)} className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1">← Back</button>
        <div className="flex flex-col items-center text-center gap-2 py-2">
          <div className="w-14 h-14 rounded-full bg-blue-700/10 border-2 border-blue-700/30 flex items-center justify-center"><CheckCircle className="w-7 h-7 text-blue-400"/></div>
          <p className="text-base font-black text-white">Transfer {fmt(parsed)}</p>
          <p className="text-xs text-white/40 max-w-xs leading-relaxed">Send exactly <strong className="text-white">{fmt(parsed)}</strong> to the account below. Your investment activates once admin confirms receipt.</p>
        </div>
        <Card className="space-y-3">
          <Label>Payment Account</Label>
          {[{l:"Bank",v:PAYMENT_ACCOUNT.bank,copy:false},{l:"Account Number",v:PAYMENT_ACCOUNT.account_number,copy:true},{l:"Account Name",v:PAYMENT_ACCOUNT.account_name,copy:false},{l:"Amount",v:fmt(parsed),copy:false},{l:"Narration",v:`${investor.name} – ${selectedCycle.name}`,copy:false}].map(({l,v,copy})=>(
            <div key={l} className="flex justify-between items-center text-sm">
              <span className="text-white/40">{l}</span>
              <div className="flex items-center gap-1"><span className={`font-bold ${l==="Account Number"?"text-blue-400 tracking-widest text-base":"text-white"}`}>{v}</span>{copy&&<CopyBtn text={v}/>}</div>
            </div>
          ))}
        </Card>
        <Banner type="warning" msg="No extra fees. Transfer the exact amount shown. Use your registered name as narration."/>
        <button onClick={async ()=>{
          if(transferring) return;
          setTransferring(true);
          const payId=`pay-${Date.now()}`;
          const payRecord={
            id:payId,
            type:"new_investment",
            investor:investor.name,
            investorId:investor.id,
            amount:parsed,
            cycle:selectedCycle.name,
            date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),
            status:"pending",
            receipt:null,
            rejectReason:"",
          };
          // Save to Supabase
          await api.submitPayment({
            id:payId,
            type:"new_investment",
            investor_name:investor.name,
            investor_id:investor.id,
            amount:parsed,
            cycle_name:selectedCycle.name,
            date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),
            status:"pending",
            receipt:null,
            reject_reason:"",
          });
          // Update local state
          setPays(ps=>[...ps,payRecord]);
          setTransferring(false);
          setSelectedCycle(null);setStep(1);setAmount("");
        }} disabled={transferring} className={`w-full py-3.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${transferring?"bg-white/10 text-white/40 cursor-not-allowed":"bg-blue-700 hover:bg-blue-600 text-white"}`}>{transferring?<><Loader className="w-4 h-4 animate-spin"/>Submitting…</>:<>Done — I've Made This Transfer</>}</button>
      </div>
    );
  }

  return(
    <div className="space-y-5 pb-24">
      <h2 className="text-xl font-black text-white">Available Investments</h2>
      {waitingList&&(
        <Card className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-700/20 border border-blue-700/30 flex items-center justify-center flex-shrink-0"><Bell className="w-4 h-4 text-blue-400"/></div>
          <div className="flex-1 min-w-0"><p className="text-xs font-bold text-white">Waiting List Active</p><p className="text-[10px] text-white/40">{waitingList.cycle} · Position #{waitingList?.position||1}</p></div>
          <button onClick={()=>setSelectedCycle(INVESTOR_FUTURE_CYCLE)} className="text-[10px] text-blue-400 font-bold hover:text-blue-300 flex-shrink-0">View →</button>
        </Card>
      )}
      {availCycles.map(c=>{
        const fill=Math.min(100,((c.current_pool/c.target_pool)*100)).toFixed(1);
        return(
          <Card key={c.id} className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div><p className="text-sm font-black text-white">{c.name}</p><p className="text-xs text-white/40">{fmtDate(c.start)} — {fmtDate(c.end)}</p></div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border flex-shrink-0 ${c.is_full?"bg-red-700/20 border-red-700/30 text-red-400":"bg-blue-700/20 border-blue-700/30 text-blue-400"}`}>{c.is_full?"Full":"Open"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[{l:"Exp. Rate",v:c.expected_rate?`${c.expected_rate}%`:"Pending",color:c.expected_rate?"text-blue-400":"text-white/40"},{l:"Min. Join",v:fmt(c.min_investment||100000),color:"text-white"},{l:"Slots",v:c.is_full?"Full":c.slots_left||"Open",color:c.is_full?"text-red-400":"text-white"}].map(({l,v,color})=>(
                <div key={l} className="bg-white/5 rounded-xl p-2.5"><p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{l}</p><p className={`text-xs font-black mt-0.5 ${color}`}>{v}</p></div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-white/40 mb-1.5"><span>Fund filled</span><span className="text-white font-semibold">{fill}%</span></div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className={`h-full rounded-full ${c.is_full?"bg-red-500":"bg-blue-600"}`} style={{width:`${fill}%`}}/></div>
              <p className="text-[10px] text-white/30 mt-1">{fmt(c.current_pool||0)} of {fmt(c.target_pool)}</p>
            </div>
            <Banner type="info" msg="Expected rate reflects past cycle performance — not a guaranteed return."/>
            <button onClick={()=>setSelectedCycle(c)} className={`w-full py-2.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${c.is_full?"bg-white/5 border border-white/10 text-white/60 hover:border-white/20":"bg-blue-700 hover:bg-blue-600 text-white"}`}>
              {c.is_full?"Join Waiting List":"Join This Cycle"} <ArrowRight className="w-4 h-4"/>
            </button>
          </Card>
        );
      })}
    </div>
  );
};

const ProfileScreen = ({investor,setInvestor}) => {
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState({
    ...investor,
    account_number: investor.account_number||investor.account||"",
    account_name:   investor.account_name||investor.name||"",
  });
  const [saved,setSaved]=useState(false);
  const sd=k=>v=>setDraft(d=>({...d,[k]:v}));
  const save=async ()=>{
    setInvestor({...draft});
    setEditing(false);
    setSaved(true);
    setTimeout(()=>setSaved(false),3000);
    try {
      await api.updateInvestor(investor.id,{
        name:draft.name,
        email:draft.email,
        phone:draft.phone,
        address:draft.address,
        bank:draft.bank,
        account_number:draft.account_number,
        account_name:draft.account_name,
        nok_name:draft.nokName,
        nok_phone:draft.nokPhone,
        nok_rel:draft.nokRelationship,
        nok_addr:draft.nokAddress,
      });
    } catch {}
  };
  const cancel=()=>{setDraft({...investor,account_number:investor.account_number||investor.account||"",account_name:investor.account_name||investor.name||""});setEditing(false);};

  const [showPwForm,setShowPwForm]=useState(false);
  const [curPw,setCurPw]=useState(""); const [newPw,setNewPw]=useState(""); const [confirmPw,setConfirmPw]=useState("");
  const [pwErr,setPwErr]=useState(""); const [pwSaved,setPwSaved]=useState(false);
  const changePw=async ()=>{
    setPwErr("");
    if(newPw.length<6){setPwErr("New password must be at least 6 characters.");return;}
    if(newPw!==confirmPw){setPwErr("New passwords do not match.");return;}
    try {
      const { data, error } = await supabase
        .from('users')
        .select('password_hash')
        .eq('phone', investor.phone)
        .single();
      if (error || !data) { setPwErr("Could not verify your account. Try again."); return; }
      if (data.password_hash !== btoa(curPw)) { setPwErr("Current password is incorrect."); return; }
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: btoa(newPw) })
        .eq('phone', investor.phone);
      if (updateError) { setPwErr("Failed to update password. Try again."); return; }
      setCurPw("");setNewPw("");setConfirmPw("");
      setShowPwForm(false);setPwSaved(true);setTimeout(()=>setPwSaved(false),3000);
    } catch {
      setPwErr("Something went wrong. Check your connection and try again.");
    }
  };

  return(
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">My Account</h2>
        {!editing
          ?<button onClick={()=>{setDraft({...investor});setEditing(true);}} className="flex items-center gap-1.5 text-xs font-bold text-blue-400 border border-blue-700/30 px-3 py-1.5 rounded-lg hover:bg-blue-700/10"><Edit2 className="w-3.5 h-3.5"/>Edit</button>
          :<div className="flex gap-2"><button onClick={cancel} className="text-xs font-bold text-white/40 border border-white/10 px-3 py-1.5 rounded-lg">Cancel</button><button onClick={save} className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded-lg"><Save className="w-3.5 h-3.5"/>Save</button></div>
        }
      </div>

      {saved&&<Banner type="success" msg="Details updated successfully."/>}
      {pwSaved&&<Banner type="success" msg="Password changed successfully."/>}
      {editing&&<Banner type="info" msg="Tap any field to update it. Changes save when you tap Save."/>}

      <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-blue-700/20 border border-blue-700/30 flex items-center justify-center flex-shrink-0"><User className="w-6 h-6 text-blue-400"/></div>
        <div><p className="text-base font-black text-white">{investor.name}</p><p className="text-xs text-white/40">{investor.email}</p></div>
      </div>

      <Card className="space-y-4">
        <Label>Personal Details</Label>
        <EditField label="Full Name"    value={draft.name}    onChange={sd("name")}    editing={editing}/>
        <EditField label="Email"        value={draft.email}   onChange={sd("email")}   editing={editing}/>
        <EditField label="Phone"        value={draft.phone}   onChange={sd("phone")}   editing={editing} hint="Your account identifier"/>
        <EditField label="Address"      value={draft.address} onChange={sd("address")} editing={editing}/>
        {!editing&&<><div className="flex justify-between text-sm"><span className="text-white/40">Capital</span><span className="text-white font-medium">{fmt(investor.capital)}</span></div><div className="flex justify-between text-sm"><span className="text-white/40">Stake</span><span className="text-white font-medium">{investor.stake}%</span></div><div className="flex justify-between text-sm"><span className="text-white/40">Invested</span><span className="text-white font-medium">{fmtDate(investor.investment_date)}</span></div></>}
      </Card>

      <Card className="space-y-4">
        <Label>Bank Details</Label>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-1">Bank Name</p>
          {editing
            ? <select value={draft.bank} onChange={e=>sd("bank")(e.target.value)} className="w-full bg-white/5 border border-blue-600/40 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30">
                <option value="" className="bg-slate-900">Select bank</option>
                {BANKS.map(b=> <option key={b} value={b} className="bg-slate-900">{b}</option>)}
              </select>
            : <p className="text-sm text-white font-medium">{draft.bank}</p>
          }
        </div>
        <EditField label="Account No."   value={draft.account_number} onChange={sd("account_number")} editing={editing}/>
        <EditField label="Account Name"  value={draft.account_name}   onChange={sd("account_name")}   editing={editing} hint="Must match your bank record"/>
      </Card>

      <Card className="space-y-4">
        <Label>Next of Kin</Label>
        <EditField label="Full Name"     value={draft.nokName}         onChange={sd("nokName")}         editing={editing}/>
        <EditField label="Phone"         value={draft.nokPhone}        onChange={sd("nokPhone")}        editing={editing}/>
        <EditField label="Relationship"  value={draft.nokRelationship} onChange={sd("nokRelationship")} editing={editing}/>
        <EditField label="Address"       value={draft.nokAddress}      onChange={sd("nokAddress")}      editing={editing}/>
      </Card>

      {editing&&<Banner type="warning" msg="Changes to bank details take effect on the next profit distribution. Contact your admin for urgent changes."/>}

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Change Password</Label>
          <button onClick={()=>{setShowPwForm(s=>!s);setPwErr("");setCurPw("");setNewPw("");setConfirmPw("");}} className="text-xs font-bold text-blue-400 hover:text-blue-300">
            {showPwForm?"Cancel":"Change"}
          </button>
        </div>
        {!showPwForm&&<p className="text-xs text-white/30">••••••••</p>}
        {showPwForm&&(
          <div className="space-y-3">
            <Input label="Current Password"  type="password" value={curPw}     onChange={setCurPw}     icon={Lock} placeholder="Enter current password"/>
            <Input label="New Password"      type="password" value={newPw}     onChange={setNewPw}     icon={Lock} placeholder="Min. 6 characters"/>
            <Input label="Confirm Password"  type="password" value={confirmPw} onChange={setConfirmPw} icon={Lock} placeholder="Repeat new password"/>
            {pwErr&&<Err msg={pwErr}/>}
            <button onClick={changePw} className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm">Update Password</button>
          </div>
        )}
      </Card>
    </div>
  );
};


// ── STATEMENT SCREEN ─────────────────────────────────────────────────────────
const StatementScreen = ({nav,investor}) => {
  const [copied,setCopied]=useState(false);
  const cycle=INVESTOR_CYCLE;
  const lines=[
    "NOORINVEST — INVESTOR STATEMENT",
    "================================",
    `Generated : ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}`,
    "",
    "INVESTOR DETAILS",
    `Name       : ${investor.name}`,
    `Phone      : ${investor.phone}`,
    `Email      : ${investor.email||"—"}`,
    `Address    : ${investor.address||"—"}`,
    "",
    "INVESTMENT POSITION",
    `Cycle      : ${cycle.name}`,
    `Inv. Date  : ${fmtDate(investor.investment_date||cycle.start)}`,
    `Capital    : ${fmt(investor.capital)}`,
    `Stake      : ${investor.stake}%`,
    `Profit     : ${fmt(investor.profit)}`,
    `Rate       : ${cycle.profit_rate}%`,
    `Status     : ${investor.status==="active"?"Active":"Inactive"}`,
    "",
    "BANK DETAILS",
    `Bank       : ${investor.bank}`,
    `Account No : ${investor.account_number||investor.account}`,
    `Acct Name  : ${investor.account_name||investor.name}`,
    "",
    "NEXT OF KIN",
    `Name       : ${investor.nokName||"—"}`,
    `Phone      : ${investor.nokPhone||"—"}`,
    `Rel.       : ${investor.nokRelationship||investor.nokRel||"—"}`,
    "",
    "NoorInvest — Shariah-compliant investment platform",
    "Operated by Gigabundle Ltd / Avmall LTD",
  ];
  const text=lines.join("\n");
  const copy=()=>{navigator.clipboard?.writeText(text).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2500);};
  return(
    <div className="space-y-4 pb-24">
      <button onClick={()=>nav(IV.HOME)} className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1">\u2190 Back to Home</button>
      <h2 className="text-xl font-black text-white">My Statement</h2>
      <Card className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Your investment summary</Label>
          <button onClick={copy} className={`text-xs font-bold flex items-center gap-1 transition-all ${copied?"text-emerald-400":"text-blue-400 hover:text-blue-300"}`}>
            {copied?<><CheckCircle className="w-3.5 h-3.5"/>Copied!</>:<><Copy className="w-3.5 h-3.5"/>Copy</>}
          </button>
        </div>
        <pre className="text-[10px] text-white/60 font-mono whitespace-pre-wrap bg-black/30 rounded-xl p-3 overflow-x-auto leading-relaxed">{text}</pre>
      </Card>
      <Banner type="info" msg="Tap Copy to copy this statement to your clipboard. You can then paste it into a message, email, or document."/>
    </div>
  );
};

// ── Investor Bottom Nav ──────────────────────────────────────────────────────
const InvestorNav = ({active,onChange}) => {
  const navActive = active===IV.STATEMENT ? IV.HOME : active;
  const items=[
    {id:IV.HOME,    icon:Home,          label:"Home"},
    {id:IV.WITHDRAW,icon:TrendingDown,  label:"Withdraw"},
    {id:IV.HISTORY, icon:BarChart2,     label:"History"},
    {id:IV.MARKET,  icon:ArrowRightLeft,label:"Market"},
    {id:IV.INVEST,  icon:PlusCircle,    label:"Invest"},
    {id:IV.PROFILE, icon:User,          label:"Account"},
  ];
  return(
    <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/95 backdrop-blur-sm px-1 py-2 flex items-center justify-around z-40">
      {items.map(({id,icon:Icon,label})=>(
        <button key={id} onClick={()=>onChange(id)} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${navActive===id?"text-blue-400":"text-white/30 hover:text-white/60"}`}>
          <Icon className="w-5 h-5"/><span className="text-[8px] font-bold uppercase tracking-wide">{label}</span>
          {navActive===id&&<span className="w-1 h-1 rounded-full bg-blue-400"/>}
        </button>
      ))}
    </div>
  );
};

// ── Investor Portal Root ─────────────────────────────────────────────────────
const InvestorPortal = ({user,onSignOut,slots,setSlots,setPays,setWds,cycles}) => {
  // Issue 2: Restore last sub-screen on refresh
  const savedSubView = (() => {
    try { return JSON.parse(localStorage.getItem('noorinvest_subview')||'null'); } catch { return null; }
  })();
  const [view,setView]=useState(savedSubView||IV.HOME);
  const [investor,setInvestor]=useState(
    ALL_INVESTORS.find(i=>i.phone===user?.phone)||
    ALL_INVESTORS.find(i=>i.id===user?.id)||
    newUsers.find(i=>i.phone===user?.phone)||
    newUsers.find(i=>i.email===user?.email)||
    {...INIT_INVESTOR}
  );

  // Issue 3: Loading state — show spinner until real data arrives
  const [investorLoaded,setInvestorLoaded]=useState(false);

  // Load real investor data from Supabase
  useEffect(()=>{
    if(user?.phone){
      api.getInvestor(user.phone).then(data=>{
        if(data) setInvestor(data);
        setInvestorLoaded(true);
      });
    } else {
      setInvestorLoaded(true);
    }
  },[]);

  const [myListing,setMyListing]=useState(INIT_MY_LISTING);
  const [waitingList,setWaitingList]=useState(INIT_WAITING);

  // 4D: Restore myListing from Supabase on load so it survives refresh
  useEffect(()=>{
    if(!investor?.id) return;
    api.getMarketSlots().then(allSlots=>{
      if(!allSlots) return;
      const own=allSlots.find(s=>!s.sold&&!s.lock&&(s.seller_investor_id===investor.id||s.seller===investor.name));
      if(own) setMyListing({...own,status:"listed",days:getDays(own.sale_amount)});
    });
  },[investor.id]);

  // 4E: Notification read state keyed by investor ID so different users don't share state
  const notifKey=`noorinvest_notifs_read_${investor.id}`;
  const notifsAlreadyRead = (() => { try { return localStorage.getItem(notifKey)==='true'; } catch { return false; } })();
  const [notifs,setNotifs]=useState(NOTIFS.map(n=>notifsAlreadyRead?{...n,read:true}:n));
  const [showNotifs,setShowNotifs]=useState(false);
  const hasUnread=notifs.some(n=>!n.read);

  // Issue 2: Save sub-screen on every nav change
  const nav=v=>{
    setView(v);
    try { localStorage.setItem('noorinvest_subview',JSON.stringify(v)); } catch {}
  };

  const markRead=()=>{
    setNotifs(ns=>ns.map(n=>({...n,read:true})));
    api.markNotificationsRead(investor.id);
    try { localStorage.setItem(notifKey,'true'); } catch {}
  };
  const titles={[IV.HOME]:null,[IV.WITHDRAW]:"Withdraw",[IV.HISTORY]:"History",[IV.MARKET]:"Secondary Market",[IV.INVEST]:"Available Investments",[IV.PROFILE]:"My Account",[IV.STATEMENT]:"My Statement"};

  // Issue 3: Show loading screen until real data arrives
  if(!investorLoaded) return(
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#0A1628 0%,#0d1f3c 100%)"}}>
      <div className="flex flex-col items-center gap-4">
        <Loader className="w-10 h-10 text-blue-400 animate-spin"/>
        <p className="text-white/40 text-sm font-medium">Loading your account…</p>
      </div>
    </div>
  );
  return(
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#0A1628 0%,#0d1f3c 100%)"}}>
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          {view!==IV.HOME&&<button onClick={()=>nav(IV.HOME)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/20"><span className="text-white/60 text-sm font-bold">←</span></button>}
          <div>{view===IV.HOME?<><p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">NoorInvest</p><p className="text-base font-black text-white leading-tight">Investor Dashboard</p></>:<p className="text-base font-black text-white">{titles[view]}</p>}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setShowNotifs(true)} className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
            <Bell className="w-4 h-4 text-white/50"/>
            {hasUnread&&<span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400"/>}
          </button>
          <button onClick={()=>nav(IV.PROFILE)} className="w-9 h-9 rounded-full bg-blue-700/20 border border-blue-700/30 flex items-center justify-center hover:bg-blue-700/30 transition-colors"><User className="w-4 h-4 text-blue-400"/></button>
          <button onClick={onSignOut} className="text-xs text-white/40 border border-white/10 px-3 py-1.5 rounded-lg hover:border-white/30 hover:text-white/60">Sign Out</button>
        </div>
      </div>
      <div className="px-5 py-5 max-w-md mx-auto">
        {view===IV.HOME     &&<HomeScreen nav={nav} investor={investor}/>}
        {view===IV.WITHDRAW &&<WithdrawScreen nav={nav} investor={investor} setInvestor={setInvestor} setSlots={setSlots} setWds={setWds}/>}
        {view===IV.HISTORY  &&<HistoryScreen investor={investor} cycles={cycles}/>}
        {view===IV.MARKET   &&<MarketScreen slots={slots} setSlots={setSlots} myListing={myListing} setMyListing={setMyListing} investor={investor} setPays={setPays} setInvestor={setInvestor}/>}
        {view===IV.INVEST   &&<InvestScreen waitingList={waitingList} setWaitingList={setWaitingList} investor={investor} setPays={setPays} cycles={cycles}/>}
        {view===IV.PROFILE  &&<ProfileScreen investor={investor} setInvestor={setInvestor}/>}
        {view===IV.STATEMENT&&<StatementScreen nav={nav} investor={investor}/>}
      </div>
      <InvestorNav active={view} onChange={nav}/>
      {showNotifs&&<NotifPanel onClose={()=>setShowNotifs(false)} onMarkRead={markRead} notifs={notifs}/>}
    </div>
  );
};
// ── Admin Panel Screens ──────────────────────────────────────────────────────
const DashScreen=({nav,cycles,setCycles,pendingCount})=>{
  // Refresh live cycle data from Supabase every time the dashboard opens
  useEffect(()=>{
    api.getCycles().then(data=>{ if(data){ updateInvestorCycles(data); setCycles(data); }; });
  },[]);

  const totalPool=ALL_INVESTORS.reduce((s,i)=>s+i.capital,0);
  const openCycle=cycles.find(c=>c.status==="open");
  const closedCycles=cycles.filter(c=>c.status==="closed"&&c.total_profit!=null);
  const lastClosed=closedCycles.length?closedCycles.reduce((a,b)=>new Date(a.end)>new Date(b.end)?a:b):null;
  const companyRetained=lastClosed?lastClosed.total_profit*(lastClosed.company_stake_pct/100):0;
  return (
    <div className="space-y-5 pb-24">
      <div><p className="text-xs text-white/40">Admin Panel</p><h1 className="text-xl font-black text-white">Dashboard</h1></div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Investor Pool" value={fmtM(totalPool)}  sub="22 investors"      icon={Wallet}      color="text-blue-400"    bg="bg-blue-700/10 border-blue-700/20"/>
        <StatCard label="Last Cycle Profit"   value={lastClosed?fmtM(lastClosed.total_profit):"—"} sub={lastClosed?lastClosed.name:"No closed cycle yet"}      icon={TrendingUp}  color="text-emerald-400" bg="bg-emerald-700/10 border-emerald-700/20"/>
        <StatCard label="Company Retained"    value={lastClosed?fmtM(companyRetained):"—"} sub={lastClosed?`${lastClosed.company_stake_pct}% of net profit`:"—"}    icon={Building2}   color="text-purple-400"  bg="bg-purple-700/10 border-purple-700/20"/>
        <StatCard label="Pending Actions"     value={pendingCount}      sub="Require attention" icon={CheckSquare} color="text-amber-400"   bg="bg-amber-700/10 border-amber-700/20"/>
      </div>
      {pendingCount>0&&<Banner type="warning" msg={`${pendingCount} pending items require your attention.`}/>}
      {openCycle&&(
        <Card className="space-y-3">
          <div className="flex items-start justify-between"><div><Label>Active Cycle</Label><p className="text-sm font-black text-white">{openCycle.name}</p><p className="text-xs text-white/40">{fmtDate(openCycle.start)} — {fmtDate(openCycle.end)}</p></div><Pill label="Open" color="bg-blue-700/20 border-blue-700/30 text-blue-400"/></div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[{l:"Pool",v:fmtM(openCycle.pool)},{l:"Investors",v:openCycle.investors},{l:"Accepting",v:openCycle.accepting?"Yes":"No"}].map(({l,v})=>(
              <div key={l} className="bg-white/5 rounded-xl p-2"><p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{l}</p><p className="text-xs font-black text-white mt-0.5">{v}</p></div>
            ))}
          </div>
          <div className="flex justify-between text-sm"><span className="text-white/40">Company Capital ({openCycle.company_stake_pct}%)</span><span className="text-purple-400 font-bold font-mono">{fmt(companyCapital(openCycle))}</span></div>
          <div className="flex gap-2">
            <button onClick={()=>setCycles(cs=>cs.map(c=>c.id===openCycle.id?{...c,accepting:!c.accepting}:c))} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${openCycle.accepting?"bg-red-700/15 border-red-700/30 text-red-400":"bg-emerald-700/15 border-emerald-700/30 text-emerald-400"}`}>
              {openCycle.accepting?<><ToggleRight className="w-3.5 h-3.5"/>Close Investment</>:<><ToggleLeft className="w-3.5 h-3.5"/>Open Investment</>}
            </button>
            <button onClick={()=>nav(VIEWS.CYCLES)} className="flex-1 py-2.5 bg-blue-700/15 border border-blue-700/30 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-700/25">Manage →</button>
          </div>
        </Card>
      )}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {[{label:"Fund Cycles",icon:RefreshCw,view:VIEWS.CYCLES,color:"bg-blue-700/15 border-blue-700/30 text-blue-400"},{label:"All Members",icon:Users,view:VIEWS.MEMBERS,color:"bg-purple-700/15 border-purple-700/30 text-purple-400"},{label:"Approvals",icon:CheckSquare,view:VIEWS.APPROVALS,color:"bg-amber-700/15 border-amber-700/30 text-amber-400"},{label:"Settings",icon:Settings,view:VIEWS.SETTINGS,color:"bg-white/5 border-white/10 text-white/50"}].map(({label,icon:Icon,view,color})=>(
            <button key={label} onClick={()=>nav(view)} className={`flex items-center gap-2.5 p-3.5 rounded-2xl border transition-all hover:scale-[1.02] ${color}`}><Icon className="w-5 h-5 flex-shrink-0"/><span className="text-xs font-bold">{label}</span></button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Top Investors</p><button onClick={()=>nav(VIEWS.MEMBERS)} className="text-[10px] text-blue-400 font-semibold">View all →</button></div>
        <div className="space-y-2">
          {ALL_INVESTORS.sort((a,b)=>b.capital-a.capital).slice(0,4).map(inv=>(
            <div key={inv.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-blue-700/20 border border-blue-700/30 flex items-center justify-center flex-shrink-0"><User className="w-3.5 h-3.5 text-blue-400"/></div>
              <div className="flex-1 min-w-0"><p className="text-xs font-bold text-white truncate">{inv.name}</p><p className="text-[10px] text-white/40">{inv.stake}%</p></div>
              <p className="text-xs font-black text-white font-mono">{fmtM(inv.capital)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── CREATE CYCLE ──────────────────────────────────────────────────────────────
const CreateCycleScreen=({nav,onSave})=>{
  const [f,setF]=useState({name:"",start:"",end:"",target_pool:"",company_stake_pct:"30",rollover_days:"7"});
  const [errs,setErrs]=useState({});
  const [done,setDone]=useState(false);
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  const split=100-Number(f.company_stake_pct||0);
  const submit=()=>{
    const e={};
    if(!f.name.trim())e.name="Required";if(!f.start)e.start="Required";if(!f.end)e.end="Required";
    if(f.start&&f.end&&f.end<=f.start)e.end="End must be after start";
    if(!f.target_pool||isNaN(Number(f.target_pool)))e.target_pool="Valid amount required";
    if(Number(f.company_stake_pct)<0||Number(f.company_stake_pct)>99)e.company_stake_pct="0–99%";
    if(!f.rollover_days||isNaN(Number(f.rollover_days)))e.rollover_days="Valid days required";
    setErrs(e);if(Object.keys(e).length)return;
    onSave({id:`cyc-${Date.now()}`,name:f.name,start:f.start,end:f.end,target_pool:Number(f.target_pool),pool:0,company_stake_pct:Number(f.company_stake_pct),investor_split:split,rollover_days:Number(f.rollover_days),profit_rate:null,total_profit:null,status:"open",investors:0,accepting:false,member_ids:[]});
    setDone(true);setTimeout(()=>nav(VIEWS.CYCLES),1200);
  };
  if(done) return (<div className="flex flex-col items-center text-center gap-4 pt-16 pb-24"><div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-emerald-400"/></div><p className="text-lg font-black text-white">Cycle Created</p><p className="text-sm text-white/40">Returning…</p></div>);
  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-xl font-black text-white">Create New Cycle</h2>
      <Banner type="info" msg="Company stake % locks after creation. All other fields remain editable."/>
      <TF label="Cycle Name"    value={f.name}              onChange={sf("name")}              error={errs.name}         hint='e.g. "Cycle Sep–Nov 2026"'/>
      <TF label="Start Date"    value={f.start}             onChange={sf("start")}             error={errs.start}        type="date"/>
      <TF label="End Date"      value={f.end}               onChange={sf("end")}               error={errs.end}          type="date"/>
      <TF label="Target Pool (₦)" value={fmtAmt(f.target_pool)} onChange={v=>sf("target_pool")(parseAmt(v))} error={errs.target_pool}  hint="Company stake calculated from this amount"/>
      <TF label="Company Stake (%)" value={f.company_stake_pct} onChange={v=>setF(p=>({...p,company_stake_pct:v}))} error={errs.company_stake_pct} hint="Locked after creation"/>
      <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl"><span className="text-sm text-white/40">Investor Split</span><span className="text-sm font-bold text-blue-400">{split}%</span></div>
      <TF label="Rollover Opt-Out Window (days)" value={f.rollover_days} onChange={sf("rollover_days")} error={errs.rollover_days}/>
      <button onClick={submit} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">Create Cycle <ArrowRight className="w-4 h-4"/></button>
    </div>
  );
};

// ── EDIT CYCLE ────────────────────────────────────────────────────────────────
const EditCycleScreen=({cycle,nav,onSave})=>{
  const [f,setF]=useState({name:cycle.name,start:cycle.start,end:cycle.end,target_pool:String(cycle.target_pool),rollover_days:String(cycle.rollover_days)});
  const [errs,setErrs]=useState({});const [done,setDone]=useState(false);
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  const submit=()=>{
    const e={};if(!f.name.trim())e.name="Required";if(!f.start)e.start="Required";if(!f.end)e.end="Required";
    if(f.start&&f.end&&f.end<=f.start)e.end="End must be after start";
    if(!f.target_pool||isNaN(Number(f.target_pool)))e.target_pool="Valid amount required";
    if(!f.rollover_days||isNaN(Number(f.rollover_days)))e.rollover_days="Valid days required";
    setErrs(e);if(Object.keys(e).length)return;
    onSave({...cycle,name:f.name,start:f.start,end:f.end,target_pool:Number(f.target_pool),rollover_days:Number(f.rollover_days)});
    setDone(true);setTimeout(()=>nav(VIEWS.CYCLES),1200);
  };
  if(done) return (<div className="flex flex-col items-center text-center gap-4 pt-16 pb-24"><div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-emerald-400"/></div><p className="text-lg font-black text-white">Cycle Updated</p><p className="text-sm text-white/40">Returning…</p></div>);
  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-xl font-black text-white">Edit Cycle</h2>
      <Banner type="info" msg="Company stake % cannot be changed after cycle creation."/>
      <TF label="Cycle Name"    value={f.name}         onChange={sf("name")}        error={errs.name}/>
      <TF label="Start Date"    value={f.start}        onChange={sf("start")}       error={errs.start}   type="date"/>
      <TF label="End Date"      value={f.end}          onChange={sf("end")}         error={errs.end}     type="date"/>
      <TF label="Target Pool (₦)" value={fmtAmt(f.target_pool)} onChange={v=>sf("target_pool")(parseAmt(v))} error={errs.target_pool}/>
      <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl"><div><p className="text-[11px] font-bold tracking-widest uppercase text-white/40">Company Stake %</p><p className="text-sm font-bold text-white/50">{cycle.company_stake_pct}%</p></div><div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10"><Lock className="w-3 h-3 text-white/30"/><span className="text-[10px] text-white/30 font-bold">Locked</span></div></div>
      <TF label="Rollover Opt-Out Window (days)" value={f.rollover_days} onChange={sf("rollover_days")} error={errs.rollover_days}/>
      <button onClick={submit} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">Save Changes <ArrowRight className="w-4 h-4"/></button>
    </div>
  );
};

// ── ADD MEMBERS ───────────────────────────────────────────────────────────────
const AddMembersScreen=({cycle,nav,onAdd})=>{
  const [ticked,setTicked]=useState({});
  const [search,setSearch]=useState("");
  const [done,setDone]=useState(false);
  const filtered=ALL_INVESTORS.filter(i=>i.status==="active"&&!(cycle.member_ids||[]).includes(i.id)&&(i.name.toLowerCase().includes(search.toLowerCase())||i.phone.includes(search)));
  const allSelected=filtered.length>0&&filtered.every(i=>ticked[i.id]!==undefined);

  const toggle=inv=>{setTicked(t=>{if(t[inv.id]!==undefined){const n={...t};delete n[inv.id];return n;}return{...t,[inv.id]:String(netCap(inv))};});};
  const toggleAll=()=>{if(allSelected){setTicked(t=>{const n={...t};filtered.forEach(i=>delete n[i.id]);return n;});}else{setTicked(t=>{const n={...t};filtered.forEach(i=>{if(n[i.id]===undefined)n[i.id]=String(netCap(i));});return n;});}};
  const updateAmt=(id,val)=>setTicked(t=>({...t,[id]:val.replace(/[^\d,]/g,"")}));
  const tickedCount=Object.keys(ticked).length;

  const submit=()=>{if(tickedCount===0)return;onAdd(cycle.id,ticked);setDone(true);setTimeout(()=>nav(VIEWS.CYCLES),1200);};

  if(done) return (<div className="flex flex-col items-center text-center gap-4 pt-16 pb-24"><div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-emerald-400"/></div><p className="text-lg font-black text-white">{tickedCount} Member{tickedCount!==1?"s":""} Added</p><p className="text-sm text-white/40">Amounts recorded. Returning…</p></div>);

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-xl font-black text-white">Add Members</h2>
      <p className="text-xs text-white/40">{cycle.name} · {tickedCount} selected</p>
      {(cycle.member_ids||[]).length>0&&<p className="text-[11px] text-white/30">{(cycle.member_ids||[]).length} investor{(cycle.member_ids||[]).length!==1?"s":""} already in this cycle — hidden from the list below.</p>}
      <Banner type="info" msg="Amounts auto-filled from previous capital minus approved withdrawals. Edit before confirming."/>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"/>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{paddingLeft:"2.5rem"}} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-600/30"/>
        </div>
        <button onClick={toggleAll} className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex-shrink-0 ${allSelected?"bg-blue-700 border-blue-700 text-white":"bg-white/5 border-white/10 text-white/60 hover:border-white/30"}`}>
          {allSelected?"Deselect All":"Select All"}
        </button>
      </div>

      <div className="space-y-2">
        {filtered.map(inv=>{
          const isSel=ticked[inv.id]!==undefined;
          const net=netCap(inv);
          return (
            <div key={inv.id} className={`rounded-xl border transition-all ${isSel?"border-blue-600 bg-blue-700/10":"border-white/10 bg-white/5"}`}>
              <button onClick={()=>toggle(inv)} className="w-full flex items-center gap-3 p-3 text-left">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSel?"bg-blue-600 border-blue-600":"border-white/30"}`}>{isSel&&<CheckCircle className="w-3.5 h-3.5 text-white"/>}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{inv.name}</p>
                  <p className="text-[10px] text-white/40">
                    Prev: {fmt(inv.capital)}{inv.approved_withdrawals>0&&<span className="text-amber-400"> − {fmt(inv.approved_withdrawals)}</span>} → <span className="text-blue-400 font-bold">Net: {fmt(net)}</span>
                  </p>
                </div>
              </button>
              {isSel&&(
                <div className="px-3 pb-3">
                  <label className="block text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Amount for this cycle (₦)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">₦</span>
                    <input type="text" inputMode="numeric" value={fmtAmt(ticked[inv.id])} onChange={e=>updateAmt(inv.id,e.target.value)} style={{paddingLeft:"1.75rem"}}
                      className="w-full bg-white/10 border border-blue-600/40 rounded-xl py-2 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-600/30"/>
                  </div>
                  {parseAmt(ticked[inv.id])>inv.capital&&<p className="text-xs text-amber-400 mt-0.5">⚠ Exceeds previous capital — confirm this is correct</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={submit} disabled={tickedCount===0} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 sticky bottom-20">
        Add {tickedCount} Member{tickedCount!==1?"s":""} <ArrowRight className="w-4 h-4"/>
      </button>
    </div>
  );
};

// ── CYCLES LIST ───────────────────────────────────────────────────────────────
const CyclesScreen=({cycles,setCycles,nav,setEditTarget,setAddTarget})=>{
  const [showArchived,setShowArchived]=useState(false);
  const [reportOpenId,setReportOpenId]=useState(null);
  const [copiedReportId,setCopiedReportId]=useState(null);

  // Refresh live cycle data from Supabase every time this screen opens
  useEffect(()=>{
    api.getCycles().then(data=>{ if(data){ updateInvestorCycles(data); setCycles(data); } });
  },[]);

  const visible=cycles.filter(c=>c.status!=="archived");
  const archived=cycles.filter(c=>c.status==="archived");
  const toggleAccepting=async (id)=>{
    const cyc=cycles.find(c=>c.id===id);
    const newAccepting=!cyc?.accepting;
    setCycles(cs=>cs.map(c=>c.id===id?{...c,accepting:newAccepting}:c));
    try { await supabase.from('cycles').update({ accepting:newAccepting }).eq('id',id); } catch {}
  };
  const archiveCycle=async (id)=>{
    const cyc=cycles.find(c=>c.id===id);
    setCycles(cs=>cs.map(c=>c.id===id?{...c,prevStatus:c.status,prevAccepting:c.accepting,status:"archived",accepting:false}:c));
    try { await supabase.from('cycles').update({ status:"archived", accepting:false }).eq('id',id); } catch {}
  };
  const restoreCycle=async (id)=>{
    const cyc=cycles.find(c=>c.id===id);
    const restoredStatus=cyc?.prevStatus||"closed";
    const restoredAccepting=cyc?.prevAccepting||false;
    setCycles(cs=>cs.map(c=>c.id===id?{...c,status:restoredStatus,accepting:restoredAccepting,prevStatus:undefined,prevAccepting:undefined}:c));
    try { await supabase.from('cycles').update({ status:restoredStatus, accepting:restoredAccepting }).eq('id',id); } catch {}
  };

  const buildCycleReport=c=>[
    "NOORINVEST — CYCLE SUMMARY REPORT",
    `Generated: ${fmtDate(todayStr())}`,
    "",
    `Cycle: ${c.name}`,
    `Period: ${fmtDate(c.start)} — ${fmtDate(c.end)}`,
    `Status: ${c.status==="closed"?"Finished":c.status==="archived"?"Archived":"Open"}`,
    "",
    `Investor Pool: ${fmt(c.pool||0)}`,
    `Investors: ${c.investors}`,
    `Company Stake: ${c.company_stake_pct}% (${fmt(companyCapital(c))})`,
    `Investor Split: ${c.investor_split}%`,
    `Auto-Rollover Window: ${c.rollover_days} days`,
    ...(c.profit_rate?[`Profit Rate: ${c.profit_rate}%`]:[]),
    ...(c.total_profit!=null?[
      `Total Distributed Profit: ${fmt(c.total_profit)}`,
      `Company Retained (${c.company_stake_pct}%): ${fmt(c.total_profit*(c.company_stake_pct/100))}`,
      `Investor Pool Share (${c.investor_split}%): ${fmt(c.total_profit*(c.investor_split/100))}`,
    ]:[]),
  ].join("\n");

  const copyCycleReport=c=>{
    navigator.clipboard?.writeText(buildCycleReport(c)).catch(()=>{});
    setCopiedReportId(c.id);setTimeout(()=>setCopiedReportId(null),2000);
  };

  const CycleCard=({c,isArchived})=>(
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div><p className="text-sm font-black text-white">{c.name}</p><p className="text-xs text-white/40">{fmtDate(c.start)} — {fmtDate(c.end)}</p></div>
        <Pill label={isArchived?"Archived":c.status==="closed"?"Finished":"Open"} color={isArchived?"bg-slate-700/50 border-slate-600 text-slate-400":c.status==="closed"?"bg-slate-700/50 border-slate-600 text-slate-400":"bg-blue-700/20 border-blue-700/30 text-blue-400"}/>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[{l:"Pool",v:fmtM(c.pool||0)},{l:"Investors",v:c.investors},{l:"Co. Stake",v:`${c.company_stake_pct}%`},{l:"Rollover",v:`${c.rollover_days}d`}].map(({l,v})=>(
          <div key={l} className="bg-white/5 rounded-xl p-2"><p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{l}</p><p className="text-xs font-black text-white mt-0.5">{v}</p></div>
        ))}
      </div>
      {c.profit_rate&&<div className="flex justify-between text-sm"><span className="text-white/40">Profit Rate</span><span className="text-emerald-400 font-bold">{c.profit_rate}%</span></div>}
      <div className="flex justify-between text-sm"><span className="text-white/40">Company Capital ({c.company_stake_pct}%)</span><span className="text-purple-400 font-bold font-mono">{fmt(companyCapital(c))}</span></div>
      <div className="flex gap-2 flex-wrap">
        {!isArchived&&<button onClick={()=>{setEditTarget(c);nav(VIEWS.EDIT_CYCLE);}} className="flex-1 py-2 bg-blue-700/15 border border-blue-700/30 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-700/25 flex items-center justify-center gap-1"><Edit2 className="w-3 h-3"/>Edit</button>}
        {!isArchived&&c.status!=="closed"&&<>
          <button onClick={()=>toggleAccepting(c.id)} className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all ${c.accepting?"bg-red-700/15 border-red-700/30 text-red-400":"bg-emerald-700/15 border-emerald-700/30 text-emerald-400"}`}>
            {c.accepting?<><ToggleRight className="w-3 h-3"/>Close</>:<><ToggleLeft className="w-3 h-3"/>Open</>}
          </button>
          <button onClick={()=>{setAddTarget(c);nav(VIEWS.ADD_MEMBERS);}} className="flex-1 py-2 bg-purple-700/15 border border-purple-700/30 text-purple-400 rounded-xl text-xs font-bold hover:bg-purple-700/25 flex items-center justify-center gap-1"><Users className="w-3 h-3"/>Members</button>
        </>}
        {!isArchived&&<button onClick={()=>archiveCycle(c.id)} className="flex-1 py-2 bg-slate-700/20 border border-slate-600/30 text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-700/30 flex items-center justify-center gap-1"><Archive className="w-3 h-3"/>Archive</button>}
        {isArchived&&<button onClick={()=>restoreCycle(c.id)} className="flex-1 py-2 bg-blue-700/15 border border-blue-700/30 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-700/25">Restore</button>}
      </div>
      <button onClick={()=>setReportOpenId(id=>id===c.id?null:c.id)} className="w-full py-2 bg-white/5 border border-white/10 text-white/50 rounded-xl text-xs font-bold hover:border-white/20">
        {reportOpenId===c.id?"Hide":"Generate"} Cycle Report
      </button>
      {reportOpenId===c.id&&(
        <div className="space-y-2">
          <div className="flex items-center justify-between"><Label>Report — copy for records</Label><button onClick={()=>copyCycleReport(c)} className="text-[10px] font-bold text-blue-400 flex-shrink-0">{copiedReportId===c.id?"Copied!":"Copy"}</button></div>
          <pre className="text-[10px] text-white/60 font-mono whitespace-pre-wrap bg-black/30 rounded-xl p-3 max-h-64 overflow-y-auto">{buildCycleReport(c)}</pre>
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Fund Cycles</h2>
        <button onClick={()=>nav(VIEWS.CREATE_CYCLE)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-xl"><Plus className="w-3.5 h-3.5"/>New</button>
      </div>
      {visible.map(c=> <CycleCard key={c.id} c={c} isArchived={false}/>)}
      {archived.length>0&&(
        <div>
          <button onClick={()=>setShowArchived(!showArchived)} className="flex items-center gap-2 text-xs text-white/30 font-bold hover:text-white/50 transition-colors">
            <Archive className="w-3.5 h-3.5"/>{showArchived?"Hide":"Show"} Archived ({archived.length})
          </button>
          {showArchived&&<div className="space-y-3 mt-3">{archived.map(c=> <CycleCard key={c.id} c={c} isArchived={true}/>)}</div>}
        </div>
      )}
    </div>
  );
};

// ── MEMBERS ───────────────────────────────────────────────────────────────────
const MembersScreen=({investors,setInvestors})=>{
  const [search,setSearch]=useState("");const [sel,setSel]=useState(null);const [editing,setEditing]=useState(false);const [draft,setDraft]=useState(null);const [saved,setSaved]=useState(false);
  const [sortBy,setSortBy]=useState("name");
  const [selectMode,setSelectMode]=useState(false);
  const [selectedIds,setSelectedIds]=useState([]);
  const [showStatement,setShowStatement]=useState(false);
  const [copied,setCopied]=useState(false);

  // Refresh live investor data from Supabase every time this screen opens
  useEffect(()=>{
    api.getAllInvestors().then(data=>{ if(data) setInvestors(data); });
  },[]);

  const filtered=investors.filter(i=>i.name.toLowerCase().includes(search.toLowerCase())||i.phone.includes(search));
  const sortedFiltered=[...filtered].sort((a,b)=>{
    if(sortBy==="capital")return b.capital-a.capital;
    if(sortBy==="stake")return b.stake-a.stake;
    if(sortBy==="status")return a.status===b.status?0:a.status==="active"?-1:1;
    return a.name.localeCompare(b.name);
  });

  const sd=k=>v=>setDraft(d=>({...d,[k]:v}));

  const save=()=>{
    const changes=[];
    if(draft.name!==sel.name)changes.push(`Name: ${sel.name} → ${draft.name}`);
    if(draft.phone!==sel.phone)changes.push(`Phone: ${sel.phone} → ${draft.phone}`);
    if(draft.email!==sel.email)changes.push(`Email: ${sel.email} → ${draft.email}`);
    if(draft.bank!==sel.bank)changes.push(`Bank: ${sel.bank} → ${draft.bank}`);
    if(draft.account!==sel.account)changes.push(`Account: ${sel.account} → ${draft.account}`);
    if(draft.capital!==sel.capital)changes.push(`Capital: ${fmt(sel.capital)} → ${fmt(draft.capital)}`);
    if(draft.nokName!==sel.nokName)changes.push(`NOK Name: ${sel.nokName} → ${draft.nokName}`);
    if(draft.nokPhone!==sel.nokPhone)changes.push(`NOK Phone: ${sel.nokPhone} → ${draft.nokPhone}`);
    if(draft.nokRel!==sel.nokRel)changes.push(`NOK Relationship: ${sel.nokRel} → ${draft.nokRel}`);
    if(draft.nokAddr!==sel.nokAddr)changes.push(`NOK Address: ${sel.nokAddr} → ${draft.nokAddr}`);
    const updated=changes.length?addAudit(draft,changes.join("; ")):draft;
    setInvestors(is=>is.map(i=>i.id===updated.id?{...updated}:i));
    setSel({...updated});setEditing(false);setSaved(true);setTimeout(()=>setSaved(false),2500);
  };

  const toggleStatus=id=>{
    const newStatus=investors.find(i=>i.id===id)?.status==="active"?"inactive":"active";
    const label=newStatus==="inactive"?"Account deactivated":"Account reactivated";
    setInvestors(is=>is.map(i=>i.id===id?addAudit({...i,status:newStatus},label):i));
    if(sel?.id===id)setSel(s=>addAudit({...s,status:newStatus},label));
  };

  const toggleSelectId=id=>setSelectedIds(ids=>ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]);
  const bulkSetStatus=newStatus=>{
    const label=newStatus==="inactive"?"Account deactivated (bulk action)":"Account reactivated (bulk action)";
    setInvestors(is=>is.map(i=>selectedIds.includes(i.id)?addAudit({...i,status:newStatus},label):i));
    setSelectedIds([]);setSelectMode(false);
  };

  const buildStatement=inv=>[
    "NOORINVEST — INVESTOR STATEMENT",
    `Generated: ${fmtDate(todayStr())}`,
    "",
    `Investor: ${inv.name}`,
    `Phone: ${inv.phone}`,
    `Email: ${inv.email}`,
    `Status: ${inv.status==="active"?"Active":"Inactive"}`,
    "",
    "INVESTMENT POSITION",
    `Capital: ${fmt(inv.capital)}`,
    `Approved Withdrawals: ${fmt(inv.approved_withdrawals)}`,
    `Net Available: ${fmt(netCap(inv))}`,
    `Stake: ${inv.stake}%`,
    `Profit Share (last cycle): ${fmt(inv.profit)}`,
    "",
    "BANK DETAILS",
    `Bank: ${inv.bank}`,
    `Account Number: ${inv.account}`,
    "",
    "NEXT OF KIN",
    `Name: ${inv.nokName}`,
    `Phone: ${inv.nokPhone}`,
    `Relationship: ${inv.nokRel}`,
    `Address: ${inv.nokAddr}`,
  ].join("\n");

  const copyStatement=()=>{
    navigator.clipboard?.writeText(buildStatement(sel)).catch(()=>{});
    setCopied(true);setTimeout(()=>setCopied(false),2000);
  };

  const EF=({label,value,onChange,dis})=>(<div><label className="block text-[10px] font-bold tracking-widest uppercase text-white/40 mb-1">{label}</label>{editing&&!dis?<input type="text" value={value} onChange={e=>onChange(e.target.value)} className="w-full bg-white/5 border border-blue-600/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-600/30"/>:<p className={`text-sm font-medium ${dis?"text-white/30":"text-white"}`}>{value||"—"}</p>}</div>);

  if(sel) return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <button onClick={()=>{setSel(null);setEditing(false);setShowStatement(false);}} className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1">← Back</button>
        {!editing?<button onClick={()=>{setDraft({...sel});setEditing(true);}} className="flex items-center gap-1.5 text-xs font-bold text-blue-400 border border-blue-700/30 px-3 py-1.5 rounded-lg hover:bg-blue-700/10"><Edit2 className="w-3.5 h-3.5"/>Edit</button>
          :<div className="flex gap-2"><button onClick={()=>{setDraft({...sel});setEditing(false);}} className="text-xs text-white/40 border border-white/10 px-3 py-1.5 rounded-lg">Cancel</button><button onClick={save} className="flex items-center gap-1 text-xs font-bold text-white bg-blue-700 px-3 py-1.5 rounded-lg"><Save className="w-3 h-3"/>Save</button></div>}
      </div>
      {saved&&<Banner type="success" msg="Investor details updated."/>}
      <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-blue-700/20 border border-blue-700/30 flex items-center justify-center flex-shrink-0"><User className="w-6 h-6 text-blue-400"/></div>
        <div className="flex-1 min-w-0"><p className="text-base font-black text-white">{sel.name}</p><p className="text-xs text-white/40">{sel.email}</p></div>
        <Pill label={sel.status==="active"?"Active":"Inactive"} color={sel.status==="active"?"bg-emerald-700/20 border-emerald-700/30 text-emerald-400":"bg-slate-700/50 border-slate-600 text-slate-400"}/>
      </div>
      <Card className="space-y-3"><Label>Investment Position</Label>
        {[["Capital",fmt(sel.capital)],["Net Available",fmt(netCap(sel))],["Stake",`${sel.stake}%`],["Profit Share",fmt(sel.profit)]].map(([l,v])=>(<div key={l} className="flex justify-between text-sm"><span className="text-white/40">{l}</span><span className="text-emerald-400 font-bold font-mono">{v}</span></div>))}
        {editing&&<TF label="Capital Amount (₦)" value={fmtAmt(draft?.capital||"")} onChange={v=>sd("capital")(parseAmt(v))}/>}
      </Card>
      <Card className="space-y-3"><Label>Personal Details</Label>
        <EF label="Full Name" value={editing?draft.name:sel.name}   onChange={sd("name")}/>
        <EF label="Phone"     value={editing?draft.phone:sel.phone} onChange={sd("phone")}/>
        <EF label="Email"     value={editing?draft.email:sel.email} onChange={sd("email")}/>
      </Card>
      <Card className="space-y-3"><Label>Bank Details</Label>
        <EF label="Bank"           value={editing?draft.bank:sel.bank}       onChange={sd("bank")}/>
        <EF label="Account Number" value={editing?draft.account:sel.account} onChange={sd("account")}/>
      </Card>
      <Card className="space-y-3"><Label>Next of Kin</Label>
        <EF label="Full Name"    value={editing?draft.nokName:sel.nokName}   onChange={sd("nokName")}/>
        <EF label="Phone"        value={editing?draft.nokPhone:sel.nokPhone} onChange={sd("nokPhone")}/>
        <EF label="Relationship" value={editing?draft.nokRel:sel.nokRel}     onChange={sd("nokRel")}/>
        <EF label="Address"      value={editing?draft.nokAddr:sel.nokAddr}   onChange={sd("nokAddr")}/>
      </Card>

      <button onClick={()=>setShowStatement(s=>!s)} className="w-full py-2.5 bg-blue-700/15 border border-blue-700/30 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-700/25">
        {showStatement?"Hide":"Generate"} Investor Statement
      </button>
      {showStatement&&(
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Statement — copy and send to investor</Label>
            <button onClick={copyStatement} className="text-[10px] font-bold text-blue-400 flex-shrink-0">{copied?"Copied!":"Copy"}</button>
          </div>
          <pre className="text-[10px] text-white/60 font-mono whitespace-pre-wrap bg-black/30 rounded-xl p-3 max-h-64 overflow-y-auto">{buildStatement(sel)}</pre>
        </Card>
      )}

      {sel.auditLog&&sel.auditLog.length>0&&(
        <Card className="space-y-2">
          <Label>Audit Trail</Label>
          {[...sel.auditLog].reverse().map((log,i)=>(
            <div key={i} className="flex items-start gap-2 text-xs border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
              <span className="text-white/30 flex-shrink-0">{log.date}</span>
              <span className="text-white/60">{log.action}</span>
            </div>
          ))}
        </Card>
      )}

      <button onClick={()=>toggleStatus(sel.id)} className={`w-full py-3 rounded-xl text-sm font-bold border transition-all ${sel.status==="active"?"bg-red-700/10 border-red-700/30 text-red-400 hover:bg-red-700/20":"bg-emerald-700/10 border-emerald-700/30 text-emerald-400 hover:bg-emerald-700/20"}`}>
        {sel.status==="active"?"Deactivate Account":"Reactivate Account"}
      </button>
      <Banner type="info" msg="Deactivating preserves all financial records. No data is deleted."/>
    </div>
  );

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Members ({investors.length})</h2>
        <button onClick={()=>{setSelectMode(s=>!s);setSelectedIds([]);}} className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${selectMode?"bg-blue-700 border-blue-700 text-white":"bg-white/5 border-white/10 text-white/40"}`}>
          {selectMode?"Cancel":"Select"}
        </button>
      </div>
      <div className="relative"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"/><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or phone…" style={{paddingLeft:"2.5rem"}} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-600/30"/></div>

      <div className="flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
        {[{id:"name",label:"Name"},{id:"capital",label:"Capital"},{id:"stake",label:"Stake %"},{id:"status",label:"Status"}].map(({id,label})=>(
          <button key={id} onClick={()=>setSortBy(id)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${sortBy===id?"bg-blue-700 text-white":"text-white/40 hover:text-white/60"}`}>{label}</button>
        ))}
      </div>

      <div className="space-y-2">
        {sortedFiltered.map(inv=>(
          selectMode?(
            <button key={inv.id} onClick={()=>toggleSelectId(inv.id)} className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${selectedIds.includes(inv.id)?"border-blue-600 bg-blue-700/15":"border-white/10 bg-white/5"}`}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedIds.includes(inv.id)?"bg-blue-600 border-blue-600":"border-white/30"}`}>{selectedIds.includes(inv.id)&&<CheckCircle className="w-3.5 h-3.5 text-white"/>}</div>
              <div className="flex-1 min-w-0"><p className="text-xs font-bold text-white truncate">{inv.name}</p><p className="text-[10px] text-white/40">{fmt(inv.capital)} · {inv.stake}%</p></div>
              <Pill label={inv.status==="active"?"Active":"Inactive"} color={inv.status==="active"?"bg-emerald-700/20 border-emerald-700/30 text-emerald-400":"bg-slate-700/50 border-slate-600 text-slate-400"}/>
            </button>
          ):(
            <button key={inv.id} onClick={()=>setSel(inv)} className="w-full flex items-center gap-3 p-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all text-left">
              <div className="w-9 h-9 rounded-full bg-blue-700/20 border border-blue-700/30 flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-blue-400"/></div>
              <div className="flex-1 min-w-0"><p className="text-xs font-bold text-white truncate">{inv.name}</p><p className="text-[10px] text-white/40">{fmt(inv.capital)} · {inv.stake}%</p></div>
              <div className="text-right flex-shrink-0"><p className="text-xs font-black text-emerald-400 font-mono">{fmt(inv.profit)}</p><Pill label={inv.status==="active"?"Active":"Inactive"} color={inv.status==="active"?"bg-emerald-700/20 border-emerald-700/30 text-emerald-400":"bg-slate-700/50 border-slate-600 text-slate-400"}/></div>
            </button>
          )
        ))}
        {sortedFiltered.length===0&&<div className="text-center py-8"><p className="text-sm text-white/30">No investors match.</p></div>}
      </div>

      {selectMode&&selectedIds.length>0&&(
        <div className="fixed bottom-20 left-0 right-0 px-5 flex justify-center z-30">
          <div className="w-full max-w-md flex gap-2 p-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl">
            <span className="text-xs text-white/50 self-center px-2 flex-shrink-0">{selectedIds.length} selected</span>
            <button onClick={()=>bulkSetStatus("active")} className="flex-1 py-2 bg-emerald-700/20 border border-emerald-700/30 text-emerald-400 rounded-xl text-xs font-bold">Activate</button>
            <button onClick={()=>bulkSetStatus("inactive")} className="flex-1 py-2 bg-red-700/20 border border-red-700/30 text-red-400 rounded-xl text-xs font-bold">Deactivate</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── APPROVALS ─────────────────────────────────────────────────────────────────
const ApprovalsScreen=({pays,setPays,wds,setWds,slots,setSlots,investors,setInvestors,cycles,setCycles})=>{
  const [payFilter,setPayFilter]=useState("all");
  const [wdFilter,setWdFilter]=useState("all");
  const [rejectModal,setRejectModal]=useState(null);
  const [rejectReason,setRejectReason]=useState("");
  const [receiptModal,setReceiptModal]=useState(null);

  // Refresh live data from Supabase every time this screen opens
  useEffect(()=>{
    api.getPayments().then(data=>{ if(data) setPays(data); });
    api.getWithdrawals().then(data=>{ if(data) setWds(data); });
  },[]);

  const updatePay=async (id,updates)=>{
    setPays(ps=>ps.map(p=>p.id===id?{...p,...updates}:p));
    try {
      const dbUpdates={};
      if('status' in updates) dbUpdates.status=updates.status;
      if('rejectReason' in updates) dbUpdates.reject_reason=updates.rejectReason;
      await supabase.from('payments').update(dbUpdates).eq('id',id);
    } catch {}
  };
  const updateWd=async (id,updates)=>{
    setWds(ws=>ws.map(w=>w.id===id?{...w,...updates}:w));
    try {
      const dbUpdates={};
      if('status' in updates) dbUpdates.status=updates.status;
      if('adminNote' in updates) dbUpdates.admin_note=updates.adminNote;
      await supabase.from('withdrawals').update(dbUpdates).eq('id',id);
    } catch {}
  };

  const approvePay=async (id)=>{
    await updatePay(id,{status:"approved"});
    try {
      const { data:payData, error:payErr } = await supabase
        .from('payments').select('*').eq('id',id).single();
      if(payErr || !payData){ console.error('approvePay: payment fetch failed',payErr); return; }
      if(payData.type!=='new_investment'||!payData.investor_id||!payData.amount) return;

      const invId=payData.investor_id;
      const amount=Number(payData.amount);

      const { data:invData, error:invErr } = await supabase
        .from('investors').select('capital,stake').eq('id',invId).single();
      if(invErr || !invData){ console.error('approvePay: investor fetch failed',invErr,invId); return; }

      const cycPool=INVESTOR_NEXT_CYCLE.pool||101400000;
      const newCapital=Number(invData.capital||0)+amount;
      const newStake=Number(((newCapital/cycPool)*100).toFixed(3));
      const { error:updErr } = await supabase
        .from('investors').update({capital:newCapital,stake:newStake}).eq('id',invId);
      if(updErr){ console.error('approvePay: capital update failed',updErr); return; }
      setInvestors(is=>is.map(i=>i.id===invId?{...i,capital:newCapital,stake:newStake}:i));

      const { data:cycData } = await supabase
        .from('cycles').select('id,pool').eq('name',payData.cycle_name).maybeSingle();
      if(cycData){
        const newPool=Number(cycData.pool||0)+amount;
        await supabase.from('cycles').update({pool:newPool}).eq('id',cycData.id);
        setCycles(cs=>cs.map(c=>c.id===cycData.id?{...c,pool:newPool}:c));
        updateInvestorCycles(cycles.map(c=>c.id===cycData.id?{...c,pool:newPool}:c));
      }
    } catch(e){ console.error('approvePay error:',e); }
  };

  const approveWd=async (id)=>{
    const wd=wds.find(w=>w.id===id);
    await updateWd(id,{status:"approved"});
    if(wd&&wd.capital>0){
      const inv=ALL_INVESTORS.find(i=>i.id===wd.investorId);
      const slotId=`slt-${id}`;
      const daysInFund=inv?Math.max(0,Math.ceil((new Date()-new Date(inv.investment_date||INVESTOR_CYCLE.start))/(1000*60*60*24))):0;
      const newSlot={
        slot_id:slotId,
        seller:wd.investor,
        cycle:INVESTOR_CYCLE.name,
        capital:wd.capital,
        stake_pct:Number(((wd.capital/INVESTOR_CYCLE.pool)*100).toFixed(3)),
        sale_amount:wd.capital,
        days_in_fund:daysInFund,
        expected_rate:INVESTOR_CYCLE.profit_rate,
        lock:false,sold:false,is_company:false,
      };
      setSlots(ss=>[...ss,newSlot]);
      try {
        await supabase.from('market_slots').insert({
          slot_id:slotId,
          seller:wd.investor,
          seller_investor_id:wd.investorId,
          cycle_name:INVESTOR_CYCLE.name,
          capital:wd.capital,
          stake_pct:newSlot.stake_pct,
          sale_amount:wd.capital,
          days_in_fund:daysInFund,
          expected_rate:INVESTOR_CYCLE.profit_rate,
          lock:false,sold:false,is_company:false,
        });
      } catch {}
    }
  };

  const adminPayWd=id=>updateWd(id,{status:"approved",adminNote:"Admin-initiated payment"});

  const confirmReject=()=>{
    if(rejectModal.type==="pay")updatePay(rejectModal.id,{status:"rejected",rejectReason});
    else updateWd(rejectModal.id,{status:"rejected",adminNote:rejectReason});
    setRejectModal(null);setRejectReason("");
  };

  const handleReceiptUpload=(id,e)=>{
    const file=e.target.files?.[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>updatePay(id,{receipt:ev.target?.result});
    reader.readAsDataURL(file);
  };

  const filteredPays=pays.filter(p=>payFilter==="all"||p.status===payFilter);
  const filteredWds=wds.filter(w=>wdFilter==="all"||w.status===wdFilter);
  const totalPending=pays.filter(p=>p.status==="pending").length+wds.filter(w=>w.status==="pending").length;

  const FilterBar=({value,onChange})=>(
    <div className="flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
      {["all","pending","approved","rejected"].map(f=>(
        <button key={f} onClick={()=>onChange(f)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${value===f?"bg-blue-700 text-white":"text-white/40 hover:text-white/60"}`}>{f}</button>
      ))}
    </div>
  );

  const StatusPill=({status})=>{
    const m={pending:"bg-amber-700/20 border-amber-700/30 text-amber-400",approved:"bg-emerald-700/20 border-emerald-700/30 text-emerald-400",rejected:"bg-red-700/20 border-red-700/30 text-red-400"};
    return <Pill label={status} color={m[status]||"bg-slate-700/50 border-slate-600 text-slate-400"}/>;
  };

  return (
    <div className="space-y-5 pb-24">
      <h2 className="text-xl font-black text-white">Approvals {totalPending>0&&<span className="text-base text-amber-400">({totalPending})</span>}</h2>
      {totalPending===0&&<Card className="text-center py-8 space-y-2"><CheckCircle className="w-10 h-10 text-emerald-400 mx-auto"/><p className="text-sm font-bold text-white">All caught up!</p></Card>}

      {/* Payment Confirmations */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Payment Confirmations</p>
        <FilterBar value={payFilter} onChange={setPayFilter}/>
        {filteredPays.map(p=>(
          <Card key={p.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div><p className="text-sm font-bold text-white">{p.investor}</p><p className="text-[10px] text-white/40 capitalize">{p.type.replace("_"," ")} · {p.cycle}</p><p className="text-[10px] text-white/30">{p.date}</p></div>
              <div className="text-right"><p className="text-base font-black text-white font-mono">{fmt(p.amount)}</p><StatusPill status={p.status}/></div>
            </div>

            {/* Receipt upload / view */}
            {p.status==="pending"&&(
              <div>
                {p.receipt
                  ?<button onClick={()=>setReceiptModal(p.receipt)} className="w-full py-2 bg-blue-700/15 border border-blue-700/30 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-700/25 flex items-center justify-center gap-1.5"><Eye className="w-3.5 h-3.5"/>View Receipt</button>
                  :<label className="w-full py-2 bg-white/5 border border-dashed border-white/20 text-white/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:border-white/40 hover:text-white/60">
                    <Upload className="w-3.5 h-3.5"/>Investor Receipt (optional)
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e=>handleReceiptUpload(p.id,e)}/>
                  </label>
                }
              </div>
            )}

            {p.status==="rejected"&&p.rejectReason&&<div className="bg-red-950/40 border border-red-700/20 rounded-lg p-2.5"><p className="text-[11px] text-red-300">Reject reason: {p.rejectReason}</p></div>}
            <Banner type="info" msg="Confirm only after verifying the bank transfer in your GTBank account."/>

            {p.status==="pending"&&(
              <div className="flex gap-2">
                <button onClick={()=>{setRejectModal({id:p.id,type:"pay",name:p.investor});setRejectReason("");}} className="flex-1 py-2.5 bg-red-700/15 border border-red-700/30 text-red-400 rounded-xl text-xs font-bold hover:bg-red-700/25">Reject</button>
                <button onClick={()=>approvePay(p.id)} className="flex-1 py-2.5 bg-emerald-700/15 border border-emerald-700/30 text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-700/25">Confirm Received</button>
              </div>
            )}
          </Card>
        ))}
        {filteredPays.length===0&&<p className="text-xs text-white/30 text-center py-4">No {payFilter==="all"?"":payFilter} payments.</p>}
      </div>

      {/* Withdrawal Requests */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Withdrawal Requests</p>
        <FilterBar value={wdFilter} onChange={setWdFilter}/>
        {filteredWds.map(w=>{
          const inv=ALL_INVESTORS.find(i=>i.id===w.investorId);
          return (
            <Card key={w.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-bold text-white">{w.investor}</p><p className="text-[10px] text-white/40 capitalize">{w.type.replace(/_/g," ")} · {w.date}</p></div>
                <div className="text-right"><p className="text-base font-black text-white font-mono">{fmt(w.amount)}</p><StatusPill status={w.status}/></div>
              </div>

              {/* Investor bank details */}
              <div className="bg-blue-700/5 border border-blue-700/20 rounded-xl p-3 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/70">Pay To</p>
                {[["Bank",w.bank],["Account No.",w.account],["Investor",w.investor]].map(([l,v])=>(
                  <div key={l} className="flex justify-between text-sm"><span className="text-white/40">{l}</span><span className="text-white font-semibold">{v}</span></div>
                ))}
              </div>

              {w.status==="rejected"&&w.adminNote&&<div className="bg-red-950/40 border border-red-700/20 rounded-lg p-2.5"><p className="text-[11px] text-red-300">Reason: {w.adminNote}</p></div>}
              {w.status==="approved"&&w.adminNote&&<div className="bg-blue-950/40 border border-blue-700/20 rounded-lg p-2.5"><p className="text-[11px] text-blue-300">Note: {w.adminNote}</p></div>}

              {w.status==="pending"&&(
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button onClick={()=>{setRejectModal({id:w.id,type:"wd",name:w.investor});setRejectReason("");}} className="flex-1 py-2.5 bg-red-700/15 border border-red-700/30 text-red-400 rounded-xl text-xs font-bold hover:bg-red-700/25">Reject</button>
                    <button onClick={()=>approveWd(w.id)} className="flex-1 py-2.5 bg-emerald-700/15 border border-emerald-700/30 text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-700/25">Approve & Pay</button>
                  </div>
                  <button onClick={()=>adminPayWd(w.id)} className="w-full py-2.5 bg-purple-700/15 border border-purple-700/30 text-purple-400 rounded-xl text-xs font-bold hover:bg-purple-700/25 flex items-center justify-center gap-1.5">
                    <Send className="w-3.5 h-3.5"/>Admin-Initiated Payment (send & mark paid)
                  </button>
                </div>
              )}
            </Card>
          );
        })}
        {filteredWds.length===0&&<p className="text-xs text-white/30 text-center py-4">No {wdFilter==="all"?"":wdFilter} withdrawals.</p>}
      </div>

      {/* Reject reason modal */}
      {rejectModal&&(
        <div className="fixed inset-0 bg-black/85 z-50 flex items-end justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4">
            <p className="text-sm font-black text-white">Reject — {rejectModal.name}</p>
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-white/40 mb-1.5">Reason for rejection</label>
              <textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="Explain the reason…" rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none"/>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>{setRejectModal(null);setRejectReason("");}} className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-sm">Cancel</button>
              <button onClick={confirmReject} disabled={!rejectReason.trim()} className="flex-1 py-3 bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm">Confirm Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt viewer modal */}
      {receiptModal&&(
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={()=>setReceiptModal(null)}>
          <div className="relative max-w-sm w-full">
            <button onClick={()=>setReceiptModal(null)} className="absolute -top-10 right-0 text-white/60 hover:text-white font-bold text-sm">Close ×</button>
            <img src={receiptModal} alt="Payment receipt" className="w-full rounded-2xl border border-white/10"/>
          </div>
        </div>
      )}
    </div>
  );
};

// ── WITHDRAWAL THRESHOLDS ─────────────────────────────────────────────────────
const ThresholdsScreen=({nav,thresholds,setThresholds})=>{
  const [local,setLocal]=useState(thresholds.map(t=>({...t})));
  const [saved,setSaved]=useState(false);
  const sorted=[...local].sort((a,b)=>a.min-b.min);

  const updateBand=(id,field,val)=>setLocal(ls=>ls.map(b=>b.id===id?{...b,[field]:val}:b));
  const removeBand=id=>setLocal(ls=>ls.length<=1?ls:ls.filter(b=>b.id!==id));
  const addBand=()=>{
    const finite=sorted.filter(b=>b.max!==null);
    const lastMax=finite.length?finite[finite.length-1].max:1000000;
    setLocal(ls=>[...ls,{id:Date.now(),min:lastMax+1,max:lastMax+1000000,days:7}]);
  };

  const hasOverlap=sorted.some((b,idx)=>idx>0&&sorted[idx-1].max!==null&&b.min<=sorted[idx-1].max);
  const hasGap=sorted.some((b,idx)=>idx>0&&sorted[idx-1].max!==null&&b.min>sorted[idx-1].max+1);

  const save=async ()=>{
    setThresholds(sorted);
    setLiveThresholds(sorted);
    setSaved(true);
    setTimeout(()=>nav(VIEWS.SETTINGS),1000);
    try {
      // Delete all existing bands and reinsert with clean sequential ids
      // (avoids integer overflow from Date.now()-based ids on newly added bands)
      await supabase.from('thresholds').delete().gte('id',0);
      const rows=sorted.map((t,idx)=>({
        id: idx+1,
        min_amount: t.min,
        max_amount: t.max,
        settlement_days: t.days,
      }));
      await supabase.from('thresholds').insert(rows);
    } catch {}
  };

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-xl font-black text-white">Withdrawal Thresholds</h2>
      <Banner type="info" msg="These settlement windows apply to the seller only and are never shown to the buyer on the secondary market."/>
      {hasOverlap&&<Banner type="warning" msg="Some bands overlap — an amount could match more than one band. The first matching band will apply."/>}
      {hasGap&&<Banner type="warning" msg="There's a gap between bands — some amounts won't fall into any band. Adjust the min/max values to close it."/>}
      <div className="space-y-3">
        {sorted.map((band,idx)=>(
          <Card key={band.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Band {idx+1}{band.max===null?" — open-ended (no upper limit)":""}</Label>
              {sorted.length>1&&<button onClick={()=>removeBand(band.id)} className="text-red-400 text-xs font-bold">Remove</button>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Min Amount (₦)</label>
                <input type="text" inputMode="numeric" value={fmtAmt(band.min)} onChange={e=>updateBand(band.id,"min",parseAmt(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"/>
              </div>
              {band.max!==null
                ?<div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Max Amount (₦)</label>
                    <input type="text" inputMode="numeric" value={fmtAmt(band.max)} onChange={e=>updateBand(band.id,"max",parseAmt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"/>
                  </div>
                :<div className="flex items-end pb-1.5">
                    <p className="text-[11px] text-white/30 leading-snug">No upper limit — top band</p>
                  </div>
              }
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Settlement Days</label>
              <input type="number" value={band.days} onChange={e=>updateBand(band.id,"days",Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"/>
            </div>
          </Card>
        ))}
      </div>
      <button onClick={addBand} className="w-full py-2.5 border border-dashed border-white/20 text-white/50 rounded-xl text-xs font-bold hover:border-white/40 hover:text-white/70">+ Add Threshold Band</button>
      {saved&&<Banner type="success" msg="Withdrawal thresholds updated."/>}
      <button onClick={save} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm">Save Thresholds</button>
    </div>
  );
};

// ── MONTHLY PERFORMANCE PDF ARCHIVE ───────────────────────────────────────────
const PerformancePDFScreen=({nav,cycles,pdfs,setPdfs})=>{
  const [cycleId,setCycleId]=useState(cycles[0]?.id||"");
  const [month,setMonth]=useState("");
  const [uploading,setUploading]=useState(false);
  const [uploadErr,setUploadErr]=useState("");

  const handleUpload=async (e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    setUploading(true);setUploadErr("");
    const cycle=cycles.find(c=>c.id===cycleId);
    const pdfId=`pdf-${Date.now()}`;
    const fileName=file.name;
    try {
      // Upload actual file bytes to Supabase Storage
      const storagePath=`${pdfId}-${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('performance-pdfs')
        .upload(storagePath, file);
      if (uploadError) {
        setUploadErr("Upload failed. The storage bucket may not be set up yet — check with your developer.");
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from('performance-pdfs')
        .getPublicUrl(storagePath);
      const fileUrl=urlData?.publicUrl||null;
      const newPdf={id:pdfId,cycleId,cycleName:cycle?.name||"—",month,uploadedDate:new Date().toISOString().slice(0,10),fileName,fileData:fileUrl};
      setPdfs(ps=>[...ps,newPdf]);
      // Save record to Supabase
      await supabase.from('performance_pdfs').insert({
        id:pdfId,
        cycle_id:cycleId,
        cycle_name:cycle?.name||"—",
        month_label:month,
        uploaded_date:new Date().toISOString().slice(0,10),
        file_name:fileName,
        file_url:fileUrl,
        note:null,
      });
      setMonth("");
    } catch {
      setUploadErr("Something went wrong. Check your connection and try again.");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-xl font-black text-white">Monthly Performance Reports</h2>
      <Banner type="info" msg="Uploaded reports are archived by month and become downloadable to all active investors. Records are never deleted, only added to."/>
      <Card className="space-y-3">
        <Label>Upload New Report</Label>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Fund Cycle</label>
          <select value={cycleId} onChange={e=>setCycleId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30">
            {cycles.map(c=> <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Month / Period Label</label>
          <input type="text" value={month} onChange={e=>setMonth(e.target.value)} placeholder='e.g. "June 2026"' className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-600/30"/>
        </div>
        {!month.trim()&&<p className="text-xs text-amber-400">Enter a month / period label above to enable the upload button.</p>}
        {uploadErr&&<Err msg={uploadErr}/>}
        {uploading&&<p className="text-xs text-blue-400 flex items-center gap-1.5"><Loader className="w-3.5 h-3.5 animate-spin"/>Uploading…</p>}
        {!uploading&&month.trim()
          ?<label className="w-full py-2.5 bg-white/5 border border-dashed border-white/20 text-white/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:border-white/40 hover:text-white/60">
              <Upload className="w-3.5 h-3.5"/>Choose PDF File
              <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload}/>
            </label>
          :!uploading&&<div className="w-full py-2.5 bg-white/5 border border-dashed border-white/10 text-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed">
              <Upload className="w-3.5 h-3.5"/>Choose PDF File
            </div>
        }
      </Card>
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Archive ({pdfs.length})</p>
        {pdfs.length===0&&<p className="text-xs text-white/30 text-center py-4">No reports uploaded yet.</p>}
        {[...pdfs].sort((a,b)=>new Date(b.uploadedDate)-new Date(a.uploadedDate)).map(p=>(
          <Card key={p.id} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-700/20 border border-blue-700/30 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4 text-blue-400"/></div>
            <div className="flex-1 min-w-0"><p className="text-xs font-bold text-white truncate">{p.month}</p><p className="text-[10px] text-white/40">{p.cycleName} · Uploaded {fmtDate(p.uploadedDate)}</p></div>
            {p.fileData?<a href={p.fileData} download={p.fileName} className="text-[10px] text-blue-400 font-bold flex-shrink-0">View</a>:<span className="text-[10px] text-amber-400/70 flex-shrink-0 text-right max-w-[100px] leading-tight">{p.note||"Archived"}</span>}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ── PROFIT CSV UPLOAD ──────────────────────────────────────────────────────────
const ProfitCSVScreen=({nav,cycles,investors,onApply})=>{
  const [cycleId,setCycleId]=useState(cycles.find(c=>c.status==="open")?.id||cycles[0]?.id||"");
  const [totalProfit,setTotalProfit]=useState("");
  const [parsed,setParsed]=useState(null);
  const [fileErr,setFileErr]=useState("");
  const [applied,setApplied]=useState(false);
  const [showTemplate,setShowTemplate]=useState(false);
  const [copied,setCopied]=useState(false);

  const cycle=cycles.find(c=>c.id===cycleId);
  const members=cycle?investors.filter(i=>(cycle.member_ids||[]).includes(i.id)&&i.status==="active"):[];
  const totalProfitNum=parseAmt(totalProfit);
  const templateCSV=cycle?buildTemplateCSV(members):"";

  const copyTemplate=()=>{
    navigator.clipboard?.writeText(templateCSV).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  };

  const handleFile=e=>{
    const file=e.target.files?.[0];
    if(!file)return;
    setFileErr("");setParsed(null);setApplied(false);
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const rawRows=parseCSV(String(ev.target.result));
        const seen=new Set();
        let hasNegative=false;
        const rows=rawRows.map(r=>{
          const member=members.find(m=>m.id===r.id);
          const flags=[];
          if(!member)flags.push("unknown");
          if(member&&seen.has(r.id))flags.push("duplicate");
          seen.add(r.id);
          const isBlank=r.profitRaw===""||r.profitRaw===undefined;
          const num=isBlank?null:Number(r.profitRaw);
          if(isBlank)flags.push("blank");
          else if(isNaN(num))flags.push("invalid");
          else if(num<0){flags.push("negative");hasNegative=true;}
          const expected=(member&&totalProfitNum>0&&cycle.pool>0)?proRataShare(member.capital,cycle.pool,totalProfitNum):null;
          if(expected!==null&&num!==null&&!isNaN(num)&&Math.abs(num-expected)>Math.max(1,expected*0.02))flags.push("mismatch");
          return {id:r.id,name:member?member.name:"Unknown ID",capital:member?member.capital:0,uploaded:num,expected,flags};
        });
        const missing=members.filter(m=>!seen.has(m.id));
        setParsed({rows,missing,hasNegative});
      }catch(err){setFileErr("Could not read this file. Make sure it's a CSV with investor_id and profit columns.");}
    };
    reader.readAsText(file);
  };

  const canApply=parsed&&!parsed.hasNegative&&parsed.rows.length>0;
  const matchedCount=parsed?parsed.rows.filter(r=>!r.flags.includes("unknown")).length:0;
  const variance=(parsed&&totalProfitNum>0)?proRataVariance(parsed.rows,totalProfitNum):null;

  const apply=()=>{
    if(!canApply)return;
    const updates={};
    parsed.rows.forEach(r=>{if(r.uploaded!==null&&!isNaN(r.uploaded)&&!r.flags.includes("unknown"))updates[r.id]=r.uploaded;});
    onApply(cycle.id,updates,totalProfitNum);
    setApplied(true);
  };

  if(applied) return (
    <div className="flex flex-col items-center text-center gap-4 pt-16 pb-24">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-emerald-400"/></div>
      <p className="text-lg font-black text-white">Profit Allocation Applied</p>
      <p className="text-sm text-white/40 max-w-xs">{matchedCount} investor{matchedCount!==1?"s":""} updated for {cycle.name}.</p>
      <button onClick={()=>nav(VIEWS.SETTINGS)} className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm">Back to Settings</button>
    </div>
  );

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-xl font-black text-white">Profit CSV Upload</h2>
      <Banner type="info" msg="Investors are matched by their unique ID, not name. Re-applying for the same cycle replaces the previous allocation."/>
      <Card className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Fund Cycle</label>
          <select value={cycleId} onChange={e=>{setCycleId(e.target.value);setParsed(null);}} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30">
            {cycles.filter(c=>c.status!=="archived").map(c=> <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
          </select>
        </div>
        <TF label="Total Distributed Profit for this Cycle (₦)" value={fmtAmt(totalProfit)} onChange={v=>setTotalProfit(parseAmt(v))} hint="Used to cross-check each investor's expected Pro-Rata share"/>
      </Card>
      <button onClick={()=>setShowTemplate(s=>!s)} disabled={!cycle} className="w-full py-2.5 bg-blue-700/15 border border-blue-700/30 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-700/25 disabled:opacity-40">
        {showTemplate?"Hide":"Show"} Template ({members.length} investors)
      </button>
      {showTemplate&&(
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Template — copy and fill in the profit column</Label>
            <button onClick={copyTemplate} className="text-[10px] font-bold text-blue-400 flex-shrink-0">{copied?"Copied!":"Copy"}</button>
          </div>
          <pre className="text-[10px] text-white/60 font-mono whitespace-pre overflow-x-auto bg-black/30 rounded-xl p-3 max-h-48 overflow-y-auto">{templateCSV}</pre>
          <p className="text-[10px] text-white/30">Paste into a spreadsheet, fill the profit column, save as .csv, then upload below.</p>
        </Card>
      )}
      <label className="w-full py-2.5 bg-white/5 border border-dashed border-white/20 text-white/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:border-white/40 hover:text-white/60">
        <Upload className="w-3.5 h-3.5"/>Upload Completed CSV
        <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile}/>
      </label>
      {fileErr&&<p className="text-xs text-red-400">{fileErr}</p>}
      {parsed&&(
        <Card className="space-y-3">
          <Label>Validation Summary</Label>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white/5 rounded-xl p-2"><p className="text-[9px] text-white/30 uppercase font-bold">Matched</p><p className="text-sm font-black text-emerald-400">{matchedCount}</p></div>
            <div className="bg-white/5 rounded-xl p-2"><p className="text-[9px] text-white/30 uppercase font-bold">Missing</p><p className="text-sm font-black text-amber-400">{parsed.missing.length}</p></div>
            <div className="bg-white/5 rounded-xl p-2"><p className="text-[9px] text-white/30 uppercase font-bold">Blank/Invalid</p><p className="text-sm font-black text-amber-400">{parsed.rows.filter(r=>r.flags.includes("blank")||r.flags.includes("invalid")).length}</p></div>
            <div className="bg-white/5 rounded-xl p-2"><p className="text-[9px] text-white/30 uppercase font-bold">Negative</p><p className="text-sm font-black text-red-400">{parsed.rows.filter(r=>r.flags.includes("negative")).length}</p></div>
          </div>
          {parsed.hasNegative&&<Banner type="error" msg="Negative profit values are blocked. Fix these rows in your CSV and re-upload before applying."/>}
          {parsed.missing.length>0&&<Banner type="warning" msg={`${parsed.missing.length} active investor(s) in this cycle are missing from the file: ${parsed.missing.map(m=>m.name).join(", ")}.`}/>}
          {parsed.rows.some(r=>r.flags.includes("mismatch"))&&<Banner type="warning" msg="Some uploaded amounts differ from the system's Pro-Rata expectation by more than 2%. Review before applying."/>}
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {parsed.rows.map(r=>(
              <div key={r.id} className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${r.flags.length?"border-amber-700/30 bg-amber-700/5":"border-white/5 bg-white/5"}`}>
                <div className="min-w-0"><p className="font-bold text-white truncate">{r.name}</p><p className="text-[10px] text-white/30">{r.id}{r.flags.length>0&&` · ${r.flags.join(", ")}`}</p></div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono font-bold text-white">{r.uploaded!==null&&!isNaN(r.uploaded)?fmt(r.uploaded):"—"}</p>
                  {r.expected!==null&&<p className="text-[9px] text-white/30">exp. {fmt(r.expected)}</p>}
                </div>
              </div>
            ))}
          </div>
          {variance!==null&&<div className="flex justify-between text-sm pt-2 border-t border-white/10"><span className="text-white/40">Rounding Variance</span><span className="text-purple-400 font-bold font-mono">{fmt(variance)}</span></div>}
        </Card>
      )}
      <button onClick={apply} disabled={!canApply} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm">
        Apply Profit Allocation
      </button>
    </div>
  );
};

// ── TERMS & CONDITIONS EDITOR ──────────────────────────────────────────────────
const TNCScreen=({nav,draft,setDraft,history,setHistory})=>{
  const [expandedVersion,setExpandedVersion]=useState(null);
  const [published,setPublished]=useState(false);

  const updateClause=(id,field,val)=>setDraft(d=>({...d,clauses:d.clauses.map(c=>c.id===id?{...c,[field]:val}:c)}));
  const removeClause=id=>setDraft(d=>d.clauses.length<=1?d:{...d,clauses:d.clauses.filter(c=>c.id!==id)});
  const addClause=()=>setDraft(d=>({...d,clauses:[...d.clauses,{id:Date.now(),title:"New Clause",body:""}]}));
  const toggleReview=field=>setDraft(d=>({...d,[field]:!d[field]}));

  const canPublish=draft.shariahReviewed&&draft.legalReviewed;

  const publish=async ()=>{
    if(!canPublish)return;
    const publishedDate=new Date().toISOString().slice(0,10);
    setHistory(h=>[...h,{version:draft.pendingVersion,publishedDate,clauses:draft.clauses,shariahReviewed:draft.shariahReviewed,legalReviewed:draft.legalReviewed}]);
    const [major,minor]=draft.pendingVersion.split(".").map(Number);
    const nextVersion=`${major}.${minor+1}`;
    setDraft({pendingVersion:nextVersion,clauses:draft.clauses,shariahReviewed:false,legalReviewed:false});
    setPublished(true);
    setTimeout(()=>setPublished(false),3000);
    try {
      if(draft._dbId){
        // Mark the existing draft row as published
        await supabase.from('tnc_versions').update({
          is_draft:false,
          published_date:publishedDate,
        }).eq('id',draft._dbId);
      } else {
        // No tracked draft row — insert the published version directly
        await supabase.from('tnc_versions').insert({
          version:draft.pendingVersion,
          published_date:publishedDate,
          clauses:draft.clauses,
          shariah_reviewed:draft.shariahReviewed,
          legal_reviewed:draft.legalReviewed,
          is_draft:false,
        });
      }
      // Create the next draft row
      await supabase.from('tnc_versions').insert({
        version:nextVersion,
        clauses:draft.clauses,
        shariah_reviewed:false,
        legal_reviewed:false,
        is_draft:true,
      });
    } catch {}
  };

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-xl font-black text-white">Terms & Conditions</h2>
      {!canPublish&&<Banner type="warning" msg="Draft — pending Shariah and legal review. This version cannot be published until both reviews are confirmed below."/>}
      {published&&<Banner type="success" msg={`Version published. Now editing draft v${draft.pendingVersion}.`}/>}

      <Card className="space-y-3">
        <div className="flex items-center justify-between"><Label>Current Draft</Label><span className="text-xs font-bold text-blue-400">v{draft.pendingVersion}</span></div>
        {[{key:"shariahReviewed",label:"Shariah Reviewed"},{key:"legalReviewed",label:"Legally Reviewed"}].map(({key,label})=>(
          <button key={key} onClick={()=>toggleReview(key)} className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-sm text-white">{label}</span>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${draft[key]?"bg-emerald-600 border-emerald-600":"border-white/30"}`}>
              {draft[key]&&<CheckCircle className="w-3.5 h-3.5 text-white"/>}
            </div>
          </button>
        ))}
      </Card>

      <div className="space-y-3">
        {draft.clauses.map((c,idx)=>(
          <Card key={c.id} className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label>Clause {idx+1}</Label>
              {draft.clauses.length>1&&<button onClick={()=>removeClause(c.id)} className="text-red-400 text-xs font-bold">Remove</button>}
            </div>
            <input type="text" value={c.title} onChange={e=>updateClause(c.id,"title",e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"/>
            <textarea value={c.body} onChange={e=>updateClause(c.id,"body",e.target.value)} rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-white/80 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600/30 resize-none"/>
          </Card>
        ))}
      </div>

      <button onClick={addClause} className="w-full py-2.5 border border-dashed border-white/20 text-white/50 rounded-xl text-xs font-bold hover:border-white/40 hover:text-white/70">+ Add Clause</button>

      <button onClick={publish} disabled={!canPublish} className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm">
        Publish New Version
      </button>

      {history.length>0&&(
        <div className="space-y-2 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Version History ({history.length})</p>
          {[...history].reverse().map(v=>(
            <Card key={v.version} className="space-y-2">
              <button onClick={()=>setExpandedVersion(ev=>ev===v.version?null:v.version)} className="w-full flex items-center justify-between text-left">
                <div><p className="text-sm font-bold text-white">Version {v.version}</p><p className="text-[10px] text-white/40">Published {fmtDate(v.publishedDate)}</p></div>
                <Pill label={v.shariahReviewed&&v.legalReviewed?"Fully Reviewed":"Partial Review"} color={v.shariahReviewed&&v.legalReviewed?"bg-emerald-700/20 border-emerald-700/30 text-emerald-400":"bg-amber-700/20 border-amber-700/30 text-amber-400"}/>
              </button>
              {expandedVersion===v.version&&(
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {v.clauses.map(c=>(
                    <div key={c.id}><p className="text-xs font-bold text-white">{c.title}</p><p className="text-[11px] text-white/50 leading-relaxed mt-0.5">{c.body}</p></div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ── SMART ANALYTICS ────────────────────────────────────────────────────────────
const AnalyticsScreen=({cycles,investors})=>{
  const poolData=cycles.map(c=>({name:c.name.replace("Cycle ",""),pool:c.pool||0}));
  const profitData=cycles.filter(c=>c.status==="closed"&&c.profit_rate!=null).map(c=>({name:c.name.replace("Cycle ",""),rate:c.profit_rate}));
  const brackets=[{label:"Under ₦1M",min:0,max:999999},{label:"₦1M–5M",min:1000000,max:4999999},{label:"₦5M–15M",min:5000000,max:14999999},{label:"Above ₦15M",min:15000000,max:Infinity}];
  const distData=brackets.map(b=>({name:b.label,count:investors.filter(i=>i.capital>=b.min&&i.capital<=b.max).length}));
  const totalPool=investors.reduce((s,i)=>s+i.capital,0);
  const activeCount=investors.filter(i=>i.status==="active").length;
  const closedCount=cycles.filter(c=>c.status==="closed").length;

  return (
    <div className="space-y-5 pb-24">
      <h2 className="text-xl font-black text-white">Smart Analytics</h2>
      {closedCount<2&&<Banner type="info" msg="Trend charts will show more meaningful patterns as additional cycles close. Figures shown are real, not projected."/>}

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Pool" value={fmtM(totalPool)} sub={`${investors.length} investors`} icon={Wallet} color="text-blue-400" bg="bg-blue-700/10 border-blue-700/20"/>
        <StatCard label="Active Investors" value={activeCount} sub={`of ${investors.length} total`} icon={Users} color="text-emerald-400" bg="bg-emerald-700/10 border-emerald-700/20"/>
      </div>

      <Card className="space-y-3">
        <Label>Pool Size by Cycle</Label>
        <div style={{height:200}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={poolData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="name" tick={{fill:"rgba(255,255,255,0.4)",fontSize:10}}/>
              <YAxis tick={{fill:"rgba(255,255,255,0.4)",fontSize:10}} tickFormatter={v=>fmtM(v)}/>
              <Tooltip formatter={v=>fmt(v)} contentStyle={{background:"#0d1f3c",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8}} labelStyle={{color:"#fff"}}/>
              <Bar dataKey="pool" fill="#1D4ED8" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="space-y-3">
        <Label>Profit Rate by Closed Cycle</Label>
        {profitData.length===0
          ?<p className="text-xs text-white/30 text-center py-8">No closed cycles with a profit rate yet.</p>
          :<div style={{height:200}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="name" tick={{fill:"rgba(255,255,255,0.4)",fontSize:10}}/>
                  <YAxis tick={{fill:"rgba(255,255,255,0.4)",fontSize:10}} tickFormatter={v=>`${v}%`}/>
                  <Tooltip formatter={v=>`${v}%`} contentStyle={{background:"#0d1f3c",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8}} labelStyle={{color:"#fff"}}/>
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{fill:"#10b981",r:4}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
        }
      </Card>

      <Card className="space-y-3">
        <Label>Investor Distribution by Capital</Label>
        <div style={{height:200}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis type="number" tick={{fill:"rgba(255,255,255,0.4)",fontSize:10}} allowDecimals={false}/>
              <YAxis type="category" dataKey="name" tick={{fill:"rgba(255,255,255,0.4)",fontSize:10}} width={80}/>
              <Tooltip contentStyle={{background:"#0d1f3c",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8}} labelStyle={{color:"#fff"}}/>
              <Bar dataKey="count" fill="#7c3aed" radius={[0,6,6,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

// ── SETTINGS ──────────────────────────────────────────────────────────────────
const SettingsScreen=({nav})=>{
  const [approvalQueue,setApprovalQueue]=useState(false);
  return (
    <div className="space-y-5 pb-24">
      <h2 className="text-xl font-black text-white">Settings</h2>
      <Card className="space-y-4">
        <Label>Registration Approval Queue</Label>
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-bold text-white">{approvalQueue?"Enabled":"Disabled"}</p><p className="text-xs text-white/40">{approvalQueue?"New registrations require admin approval before access":"New investors get immediate access after registering"}</p></div>
          <button onClick={()=>setApprovalQueue(!approvalQueue)} className={`w-12 h-6 rounded-full transition-all flex items-center ${approvalQueue?"bg-blue-600 justify-end":"bg-white/20 justify-start"}`}>
            <div className="w-5 h-5 rounded-full bg-white mx-0.5 shadow"/>
          </button>
        </div>
        {approvalQueue&&<Banner type="warning" msg="Approval queue is ON. New registrations will wait for your approval before accessing the platform."/>}
      </Card>
      <div className="space-y-2">
        {[
          {title:"Profit CSV Upload",          sub:"Upload and validate monthly profit allocation", view:VIEWS.PROFIT_CSV},
          {title:"Monthly Performance Reports", sub:"Upload and archive PDF reports",                view:VIEWS.PERFORMANCE_PDF},
          {title:"Withdrawal Thresholds",       sub:"Set settlement days per amount band",           view:VIEWS.THRESHOLDS},
          {title:"Terms & Conditions",          sub:"Edit clauses and manage published versions",    view:VIEWS.TNC},
          {title:"Smart Analytics",             sub:"Pool, profit, and investor distribution charts", view:VIEWS.ANALYTICS},
        ].map(({title,sub,view})=>(
          <button key={title} onClick={()=>nav(view)} className="w-full flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all text-left">
            <div className="flex-1 min-w-0"><p className="text-sm font-bold text-white">{title}</p><p className="text-xs text-white/40">{sub}</p></div>
            <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0"/>
          </button>
        ))}
      </div>
    </div>
  );
};

// ── BOTTOM NAV ────────────────────────────────────────────────────────────────
const BottomNav=({active,onChange,pendingCount})=>{
  const items=[{id:VIEWS.DASH,icon:LayoutDashboard,label:"Dashboard"},{id:VIEWS.CYCLES,icon:RefreshCw,label:"Cycles"},{id:VIEWS.MEMBERS,icon:Users,label:"Members"},{id:VIEWS.APPROVALS,icon:CheckSquare,label:"Approvals"},{id:VIEWS.SETTINGS,icon:Settings,label:"Settings"}];
  const cycleViews=[VIEWS.CREATE_CYCLE,VIEWS.EDIT_CYCLE,VIEWS.ADD_MEMBERS];
  const settingsViews=[VIEWS.PROFIT_CSV,VIEWS.PERFORMANCE_PDF,VIEWS.THRESHOLDS,VIEWS.TNC,VIEWS.ANALYTICS];
  const activeTab=cycleViews.includes(active)?VIEWS.CYCLES:settingsViews.includes(active)?VIEWS.SETTINGS:active;
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/95 backdrop-blur-sm px-2 py-2 flex items-center justify-around z-40">
      {items.map(({id,icon:Icon,label})=>(
        <button key={id} onClick={()=>onChange(id)} className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${activeTab===id?"text-blue-400":"text-white/30 hover:text-white/60"}`}>
          <Icon className="w-5 h-5"/>
          <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
          {activeTab===id&&<span className="w-1 h-1 rounded-full bg-blue-400"/>}
          {id===VIEWS.APPROVALS&&pendingCount>0&&<span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-[8px] font-black text-white flex items-center justify-center">{pendingCount}</span>}
        </button>
      ))}
    </div>
  );
};

// ── ROOT ──────────────────────────────────────────────────────────────────────

// ── Admin Panel ──────────────────────────────────────────────────────────────
const AdminPanel=({tncDraft,setTncDraft,tncHistory,setTncHistory,slots,setSlots,pays,setPays,wds,setWds,cycles,setCycles,onSignOut})=>{
  const [view,setView]=useState(VIEWS.DASH);
  const [investors,setInvestors]=useState(ALL_INVESTORS);
  const [editTarget,setEditTarget]=useState(null);
  const [addTarget,setAddTarget]=useState(null);

  useEffect(()=>{
    api.getAllInvestors().then(data=>{ if(data) setInvestors(data); });
  },[]);
  const [thresholds,setThresholds]=useState(INIT_THRESHOLDS);
  const [pdfs,setPdfs]=useState(INIT_PDFS);
  const pendingCount=pays.filter(p=>p.status==="pending").length+wds.filter(w=>w.status==="pending").length;
  const nav=v=>setView(v);
  const handleSaveCycle=async (c)=>{
    setCycles(cs=>{const ex=cs.find(x=>x.id===c.id);return ex?cs.map(x=>x.id===c.id?c:x):[...cs,c];});
    try {
      await supabase.from('cycles').upsert({
        id:c.id,
        name:c.name,
        start_date:c.start,
        end_date:c.end,
        pool:c.pool,
        target_pool:c.target_pool,
        company_stake_pct:c.company_stake_pct,
        investor_split:c.investor_split,
        rollover_days:c.rollover_days,
        profit_rate:c.profit_rate,
        total_profit:c.total_profit,
        status:c.status,
        accepting:c.accepting,
        investors_count:c.investors,
      });
    } catch {}
  };

  const handleAddMembers=async (cycleId,ticked)=>{
    const addedCount=Object.keys(ticked).length;
    const addedTotal=Object.values(ticked).reduce((s,v)=>s+parseAmt(v),0);
    setCycles(cs=>cs.map(c=>c.id===cycleId?{...c,investors:c.investors+addedCount,pool:c.pool+addedTotal,member_ids:[...(c.member_ids||[]),...Object.keys(ticked)]}:c));
    try {
      const cyc=cycles.find(c=>c.id===cycleId);
      // Insert cycle_members rows
      const rows=Object.entries(ticked).map(([investorId,amt])=>({
        cycle_id:cycleId,
        investor_id:investorId,
        capital_in_cycle:parseAmt(amt),
      }));
      await supabase.from('cycle_members').insert(rows);
      // Update cycle pool and investor count
      if(cyc){
        await supabase.from('cycles').update({
          pool:cyc.pool+addedTotal,
          investors_count:cyc.investors+addedCount,
        }).eq('id',cycleId);
      }
    } catch {}
  };
  const handleApplyProfitCSV=async (cycleId,updates,totalProfit)=>{
    setInvestors(is=>is.map(i=>updates[i.id]!==undefined?{...i,profit:updates[i.id],profit_withdrawn:false}:i));
    setCycles(cs=>cs.map(c=>c.id===cycleId?{...c,total_profit:totalProfit}:c));
    try {
      const ids=Object.keys(updates);
      await Promise.all(ids.map(id=>
        supabase.from('investors').update({ profit:updates[id], profit_withdrawn:false }).eq('id',id)
      ));
      await supabase.from('cycles').update({ total_profit:totalProfit }).eq('id',cycleId);
    } catch {}
  };
  const backTarget={[VIEWS.CREATE_CYCLE]:VIEWS.CYCLES,[VIEWS.EDIT_CYCLE]:VIEWS.CYCLES,[VIEWS.ADD_MEMBERS]:VIEWS.CYCLES,[VIEWS.PROFIT_CSV]:VIEWS.SETTINGS,[VIEWS.PERFORMANCE_PDF]:VIEWS.SETTINGS,[VIEWS.THRESHOLDS]:VIEWS.SETTINGS,[VIEWS.TNC]:VIEWS.SETTINGS,[VIEWS.ANALYTICS]:VIEWS.SETTINGS};
  const titles={[VIEWS.DASH]:null,[VIEWS.CYCLES]:"Fund Cycles",[VIEWS.MEMBERS]:"Members",[VIEWS.APPROVALS]:"Approvals",[VIEWS.SETTINGS]:"Settings",[VIEWS.CREATE_CYCLE]:"New Cycle",[VIEWS.EDIT_CYCLE]:"Edit Cycle",[VIEWS.ADD_MEMBERS]:"Add Members",[VIEWS.PROFIT_CSV]:"Profit CSV Upload",[VIEWS.PERFORMANCE_PDF]:"Performance Reports",[VIEWS.THRESHOLDS]:"Withdrawal Thresholds",[VIEWS.TNC]:"Terms & Conditions",[VIEWS.ANALYTICS]:"Smart Analytics"};
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#0A1628 0%,#0d1f3c 100%)"}}>
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          {view!==VIEWS.DASH&&<button onClick={()=>nav(backTarget[view]||VIEWS.DASH)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/20"><span className="text-white/60 text-sm font-bold">←</span></button>}
          <div>{view===VIEWS.DASH?<><p className="text-[10px] text-red-400 font-bold tracking-widest uppercase">NoorInvest Admin</p><p className="text-base font-black text-white">Admin Panel</p></>:<p className="text-base font-black text-white">{titles[view]}</p>}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-700/10 border border-red-700/20"><Shield className="w-3 h-3 text-red-400"/><span className="text-[9px] text-red-400 font-bold tracking-widest">ADMIN</span></div>
          <button onClick={onSignOut} className="text-xs text-white/40 border border-white/10 px-3 py-1.5 rounded-lg hover:border-white/30 hover:text-white/60">Sign Out</button>
        </div>
      </div>
      <div className="px-5 py-5 max-w-md mx-auto">
        {view===VIEWS.DASH         &&<DashScreen nav={nav} cycles={cycles} setCycles={setCycles} pendingCount={pendingCount}/>}
        {view===VIEWS.CYCLES       &&<CyclesScreen cycles={cycles} setCycles={setCycles} nav={nav} setEditTarget={setEditTarget} setAddTarget={setAddTarget}/>}
        {view===VIEWS.CREATE_CYCLE &&<CreateCycleScreen nav={nav} onSave={handleSaveCycle}/>}
        {view===VIEWS.EDIT_CYCLE   &&editTarget&&<EditCycleScreen cycle={editTarget} nav={nav} onSave={handleSaveCycle}/>}
        {view===VIEWS.ADD_MEMBERS  &&addTarget&&<AddMembersScreen cycle={addTarget} nav={nav} onAdd={handleAddMembers}/>}
        {view===VIEWS.MEMBERS      &&<MembersScreen investors={investors} setInvestors={setInvestors}/>}
        {view===VIEWS.APPROVALS    &&<ApprovalsScreen pays={pays} setPays={setPays} wds={wds} setWds={setWds} slots={slots} setSlots={setSlots} investors={investors} setInvestors={setInvestors} cycles={cycles} setCycles={setCycles}/>}
        {view===VIEWS.SETTINGS     &&<SettingsScreen nav={nav}/>}
        {view===VIEWS.PROFIT_CSV       &&<ProfitCSVScreen nav={nav} cycles={cycles} investors={investors} onApply={handleApplyProfitCSV}/>}
        {view===VIEWS.PERFORMANCE_PDF  &&<PerformancePDFScreen nav={nav} cycles={cycles} pdfs={pdfs} setPdfs={setPdfs}/>}
        {view===VIEWS.THRESHOLDS       &&<ThresholdsScreen nav={nav} thresholds={thresholds} setThresholds={setThresholds}/>}
        {view===VIEWS.TNC              &&<TNCScreen nav={nav} draft={tncDraft} setDraft={setTncDraft} history={tncHistory} setHistory={setTncHistory}/>}
        {view===VIEWS.ANALYTICS        &&<AnalyticsScreen cycles={cycles} investors={investors}/>}
      </div>
      <BottomNav active={view} onChange={nav} pendingCount={pendingCount}/>
    </div>
  );
};

// ── Shared Root ──────────────────────────────────────────────────────────────
export default function NoorInvest() {
  const [view,setView]=useState(V.LAND);
  const [vd,setVd]=useState(null);
  const [tncDraft,setTncDraftRaw]=useState(INIT_TNC_DRAFT);
  const tncDraftEdited=useRef(false);
  const setTncDraft=(updater)=>{ tncDraftEdited.current=true; setTncDraftRaw(updater); };
  const [tncHistory,setTncHistory]=useState(INIT_TNC_HISTORY);
  const [slots,setSlots]=useState(INIT_MARKET_SLOTS);
  const [pays,setPays]=useState(INIT_PAYMENTS);
  const [wds,setWds]=useState(INIT_WITHDRAWALS);
  const [cycles,setCycles]=useState(CYCLES_DATA);
  const publishedTNC=tncHistory.length>0?tncHistory[tncHistory.length-1]:null;

  // Restore session on page load
  useEffect(()=>{
    try {
      const saved=JSON.parse(localStorage.getItem('noorinvest_session')||'null');
      if(saved?.view && saved?.vd && (saved.view===V.IDASH||saved.view===V.ADMIN)){
        setVd(saved.vd);
        setView(saved.view);
      }
    } catch {}
  },[]);

  // Load live data from Supabase on startup
  useEffect(()=>{
    api.getCycles().then(data=>{ if(data){ updateInvestorCycles(data); setCycles(data); } });
    api.getPayments().then(data=>{ if(data) setPays(data); });
    api.getWithdrawals().then(data=>{ if(data) setWds(data); });
    api.getMarketSlots().then(data=>{ if(data) setSlots(data); });
    api.getThresholds().then(data=>{ if(data) setLiveThresholds(data); });
    api.getTncDraft().then(data=>{ if(data && !tncDraftEdited.current) setTncDraftRaw(data); });
    api.getTncHistory().then(data=>{ if(data) setTncHistory(data); });
  },[]);

  const nav=(v,data=null,user=null)=>{
    const newVd=user||data;
    setVd(newVd);
    setView(v);
    window.scrollTo(0,0);
    if(v===V.IDASH||v===V.ADMIN){
      try { localStorage.setItem('noorinvest_session',JSON.stringify({view:v,vd:newVd})); }
      catch {}
    } else if(v===V.LAND){
      try { localStorage.removeItem('noorinvest_session'); } catch {}
      try { localStorage.removeItem('noorinvest_subview'); } catch {}
    }
  };

  const screens={
    [V.LAND]:<Landing nav={nav}/>,
    [V.PHONE]:<PhoneScreen nav={nav}/>,
    [V.CREATE]:<CreateScreen nav={nav} data={vd}/>,
    [V.LOGIN]:<LoginScreen nav={nav} data={vd}/>,
    [V.REG]:<RegScreen nav={nav} publishedTNC={publishedTNC}/>,
    [V.DONE]:<DoneScreen nav={nav} data={vd}/>,
    [V.ADMIN_LOGIN]:<AdminScreen nav={nav}/>,
    [V.ADMIN]:<AdminPanel tncDraft={tncDraft} setTncDraft={setTncDraft} tncHistory={tncHistory} setTncHistory={setTncHistory} slots={slots} setSlots={setSlots} pays={pays} setPays={setPays} wds={wds} setWds={setWds} cycles={cycles} setCycles={setCycles} onSignOut={()=>nav(V.LAND)}/>,
    [V.IDASH]:<InvestorPortal user={vd} slots={slots} setSlots={setSlots} setPays={setPays} setWds={setWds} cycles={cycles} onSignOut={()=>nav(V.LAND)}/>,
  };
  return <div className="font-sans antialiased">{screens[view]||<Landing nav={nav}/>}</div>;
}
