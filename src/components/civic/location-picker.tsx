"use client";

import { LocateFixed, MapPin, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

const PLACES = [
  "Hyderabad", "Secunderabad", "Banjara Hills", "Malakpet", "LB Nagar",
  "Kukatpally", "Madhapur", "Gachibowli", "Warangal", "Vijayawada",
];

export function LocationPicker({ compact=false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [locating, setLocating] = useState(false);
  const matches = useMemo(() => PLACES.filter(p => p.toLowerCase().includes(query.toLowerCase())).slice(0, 6), [query]);

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => { setSelected("Current location"); setLocating(false); },
      () => { setLocating(false); setSelected("Location unavailable"); },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 300000 }
    );
  }

  return (
    <div className={compact ? "location-picker compact" : "location-picker"}>
      <label htmlFor="civic-location"><MapPin size={17} /> Your location</label>
      <div className="location-search">
        <Search size={18} aria-hidden="true" />
        <input id="civic-location" value={selected || query} onChange={e => { setSelected(""); setQuery(e.target.value); }} placeholder="Search city or locality" autoComplete="off" />
        {(selected || query) && <button type="button" onClick={() => { setSelected(""); setQuery(""); }} aria-label="Clear location"><X size={17} /></button>}
      </div>
      {!selected && query && matches.length > 0 && (
        <div className="location-results">
          {matches.map(place => <button key={place} onClick={() => { setSelected(place); setQuery(""); }}><MapPin size={16} />{place}</button>)}
        </div>
      )}
      <button type="button" className="use-location" onClick={useCurrentLocation} disabled={locating}>
        <LocateFixed size={17} /> {locating ? "Finding your location…" : "Use current location"}
      </button>
      {selected && <div className="location-confirm"><span className="status-dot safe" /> Showing services for <strong>{selected}</strong></div>}
    </div>
  );
}
