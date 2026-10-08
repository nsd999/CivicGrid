"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, MapPin, Navigation, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";

const DATA: Record<string, {
  title:string; description:string; categories:string[]; services:string[];
}> = {
  swasthya: { title:"Swasthya Grid", description:"Find health facilities and public-health services around you.", categories:["Hospitals","Primary health centres","Pharmacies","Emergency care"], services:["Government hospital","PHC / health centre","Vaccination service","Emergency care"] },
  suraksha: { title:"Suraksha Grid", description:"Find safety services and understand local emergency support.", categories:["Police","Fire & rescue","Emergency support","Safety information"], services:["Police station","Fire station","Emergency support","Safety guidance"] },
  monsoon: { title:"Monsoon Shield", description:"Check rainfall, flooding and drainage conditions for your area.", categories:["Flood risk","Drainage","Rainfall","Preparedness"], services:["Nearby drainage points","Flood-prone areas","Rainfall status","Monsoon preparedness"] },
  heat: { title:"Heat Safe India", description:"Check heat risk and find practical protection near you.", categories:["Heat risk","Cooling points","Health support","Guidance"], services:["Cooling point","Heat-health facility","Current heat risk","Heat safety guidance"] },
  civic: { title:"Civic Services", description:"Find everyday civic services and report local issues.", categories:["Water","Roads","Waste","Streetlights"], services:["Water service","Road / pothole issue","Waste & sanitation","Streetlight issue"] },
};

export function ServiceFlow({ slug }: { slug:string }) {
  const data = DATA[slug] ?? DATA.civic;
  const [step,setStep] = useState(1);
  const [category,setCategory] = useState("");
  const [service,setService] = useState("");

  const current = useMemo(() => {
    if (step === 1) return { title:"Choose your location", body:"Start with your city or locality so CivicGrid can show relevant services." };
    if (step === 2) return { title:"Choose a category", body:"Select the type of help or information you need." };
    if (step === 3) return { title:"Choose a service", body:"Pick the specific service to continue." };
    return { title:"Service found", body:"Here is the next action for your selected service." };
  },[step]);

  return <div className="flow-page">
    <div className="flow-container">
      <Link href="/services" className="back-link"><ArrowLeft size={17}/> All services</Link>
      <div className="flow-heading">
        <div><span className="eyebrow">Civic service</span><h1>{data.title}</h1><p>{data.description}</p></div>
      </div>

      <div className="stepper" aria-label="Service progress">
        {["Location","Service","Details","Result"].map((label,i) => {
          const n=i+1, done=step>n, active=step===n;
          return <div className={done ? "step done" : active ? "step active" : "step"} key={label}>
            <div className="step-circle">{done ? <Check size={16}/> : n}</div><span>{label}</span>{n<4 && <div className="step-line" />}
          </div>
        })}
      </div>

      <section className="flow-card">
        <div className="flow-card-top"><span className="step-kicker">Step {step} of 4</span><h2>{current.title}</h2><p>{current.body}</p></div>

        {step===1 && <div className="choice-stack">
          <button className="choice-card selected"><MapPin size={21}/><div><strong>Hyderabad</strong><span>Telangana · choose another locality after this</span></div><Check size={19}/></button>
          <div className="search-choice"><Search size={18}/><input placeholder="Search another city or locality" /></div>
          <button className="text-action"><Navigation size={17}/> Use current location</button>
        </div>}

        {step===2 && <div className="choice-grid">{data.categories.map(c=><button key={c} className={category===c?"choice-card selected":"choice-card"} onClick={()=>setCategory(c)}><div><strong>{c}</strong><span>View relevant {c.toLowerCase()} services</span></div><ChevronRight size={18}/></button>)}</div>}

        {step===3 && <div className="choice-grid">{data.services.map(s=><button key={s} className={service===s?"choice-card selected":"choice-card"} onClick={()=>setService(s)}><div><strong>{s}</strong><span>Continue with this service</span></div><ChevronRight size={18}/></button>)}</div>}

        {step===4 && <div className="result-card">
          <div className="success-mark"><Check size={28}/></div>
          <span className="success-label">Service found</span>
          <h3>{service || data.services[0]}</h3>
          <div className="result-grid">
            <div><span>Nearest facility</span><strong>Government Civic Service Centre</strong></div>
            <div><span>Distance</span><strong>1.8 km</strong></div>
            <div><span>Status</span><strong className="inline-status"><span className="status-dot safe"/> Open</strong></div>
            <div><span>Updated</span><strong>Just now</strong></div>
          </div>
          <div className="result-actions"><button className="btn btn-primary"><Navigation size={17}/> Directions</button><button className="btn btn-secondary"><Phone size={17}/> Call</button></div>
        </div>}

        {step<4 && <div className="flow-actions">
          {step>1 ? <button className="btn btn-secondary" onClick={()=>setStep(step-1)}>Back</button> : <span />}
          <button className="btn btn-primary" disabled={step===2&&!category || step===3&&!service} onClick={()=>setStep(step+1)}>Continue <ArrowRight size={17}/></button>
        </div>}
        {step===4 && <div className="flow-actions"><Link href="/services" className="btn btn-secondary">Choose another service</Link><Link href="/alerts" className="btn btn-primary">View local alerts <ArrowRight size={17}/></Link></div>}
      </section>

      <div className="source-note"><Clock3 size={16}/> Results should show the source and last-updated time whenever live data is available.</div>
    </div>
  </div>;
}
