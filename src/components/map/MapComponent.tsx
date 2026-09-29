"use client";

import { useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

export default function MapComponent({ assets = [], reports = [] }: { assets?: any[], reports?: any[] }) {
  const [apiKey] = useState(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");

  if (!apiKey) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
        Loading map configuration...
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 17.4065, lng: 78.4772 }}
          defaultZoom={11}
          mapId="DEMO_MAP_ID"
        >
          {/* Infrastructure Assets */}
          {assets.map((asset) => (
            <AdvancedMarker
              key={asset.id}
              position={{ lat: asset.latitude!, lng: asset.longitude! }}
              title={asset.name}
            >
              <Pin 
                background={asset.type === "HOSPITAL" ? "#0e7490" : asset.type === "POWER_SUBSTATION" ? "#b45309" : "#475569"} 
                borderColor="#ffffff" 
                glyphColor="#ffffff" 
              />
            </AdvancedMarker>
          ))}

          {/* Citizen Reports */}
          {reports.map((report) => (
            <AdvancedMarker
              key={report.id}
              position={{ lat: report.latitude!, lng: report.longitude! }}
              title={report.title}
            >
              <Pin background="#c2410c" borderColor="#ffffff" glyphColor="#ffffff" />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
