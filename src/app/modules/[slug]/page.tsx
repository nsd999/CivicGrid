import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Activity, Shield, Droplets, Sun, Building2, CheckCircle2 } from "lucide-react";

const data: Record<string, any> = {
  civicgrid: { name:"CivicGrid Core", icon:Building2, tone:"#2563eb", intro:"A public view of everyday civic infrastructure, service issues and community reports.", sections:[["What you can explore",["Roads, drainage, waste, water and streetlight issues","Citizen-reported problems and service priorities","Infrastructure and local response information"]],["How it helps",["See what needs attention","Understand why an issue matters","Connect a local problem with the right response"]]] },
  swasthyagrid: { name:"SwasthyaGrid", icon:Activity, tone:"#15803d", intro:"A public-health intelligence view focused on facilities, readiness and community risk.", sections:[["What you can explore",["Health facilities and capacity","Public-health preparedness","Community health risks and response needs"]],["How it helps",["Understand local health readiness","See where pressure may be building","Learn practical public-health basics"]]] },
  surakshagrid: { name:"SurakshaGrid", icon:Shield, tone:"#b91c1c", intro:"A safety and disaster-risk view for understanding vulnerable places and preparedness.", sections:[["What you can explore",["Risk-prone areas","Critical infrastructure","Preparedness and response priorities"]],["How it helps",["Understand local risks","Prepare before emergencies","See how risk can become coordinated action"]]] },
  monsoonshield: { name:"MonsoonShield", icon:Droplets, tone:"#0e7490", intro:"A monsoon-focused view of rainfall, flooding and drainage risk.", sections:[["What you can explore",["Rainfall and flood exposure","Drainage risk","Pre-event preparedness"]],["How it helps",["Understand monsoon risk","Know what areas need attention","Learn safer flood preparedness"]]] },
  heatsafe: { name:"HeatSafe India", icon:Sun, tone:"#c2410c", intro:"A heat-risk view focused on vulnerable communities and practical protection.", sections:[["What you can explore",["Heat index and heat risk","Vulnerable populations","Cooling and response measures"]],["How it helps",["Recognise heat risk","Protect vulnerable people","Understand what to do during extreme heat"]]] },
};

export function generateStaticParams(){ return Object.keys(data).map(slug=>({slug})); }

export default async function PublicModuleDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const item=data[slug]; if(!item) notFound(); const Icon=item.icon;
  return <main style={{minHeight:"100vh",background:"#f8fafc",color:"#0f172a"}}>
    <header style={{padding:"18px 24px",background:"white",borderBottom:"1px solid #e2e8f0"}}><div style={{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
      <Link href="/modules" className="btn btn-secondary btn-sm"><ArrowLeft size={15}/> All modules</Link>
      <div style={{display:"flex",gap:8}}><Link href="/register" className="btn btn-secondary btn-sm">Register</Link><Link href="/login" className="btn btn-primary btn-sm">Sign in</Link></div>
    </div></header>
    <section style={{maxWidth:900,margin:"0 auto",padding:"clamp(32px,7vw,64px) 24px"}}>
      <div className="card" style={{padding:"clamp(20px,5vw,34px)"}}>
        <Icon size={32} color={item.tone}/>
        <h1 style={{margin:"12px 0 8px",fontSize:"clamp(1.8rem,5vw,3rem)"}}>{item.name}</h1>
        <p style={{margin:0,color:"#64748b",lineHeight:1.7,maxWidth:720}}>{item.intro}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginTop:26}}>
          {item.sections.map(([title,points]:[string,string[]])=><section key={title} style={{padding:17,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10}}>
            <h2 style={{margin:0,fontSize:"1rem"}}>{title}</h2>
            <ul style={{margin:"10px 0 0",paddingLeft:20,color:"#475569",lineHeight:1.8,fontSize:".84rem"}}>{points.map(p=><li key={p}>{p}</li>)}</ul>
          </section>)}
        </div>
        <div style={{marginTop:22,padding:14,borderRadius:9,background:"#f0fdf4",border:"1px solid #bbf7d0",color:"#166534",display:"flex",gap:9,fontSize:".82rem",lineHeight:1.5}}>
          <CheckCircle2 size={18}/><span>You can explore CivicGrid without an account. Register only if you want to receive updates or use account-based features.</span>
        </div>
        <div style={{marginTop:22,display:"flex",gap:9,flexWrap:"wrap"}}><Link href="/modules" className="btn btn-secondary">Explore other modules</Link><Link href="/dashboard" className="btn btn-primary">Open Command Centre <ArrowRight size={15}/></Link></div>
      </div>
    </section>
  </main>;
}
