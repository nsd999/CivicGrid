import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import MapComponent from "@/components/map/MapComponent";
import { Map as MapIcon } from "lucide-react";
import { getAssets, getReports } from "@/lib/resilient-data";

export const metadata = { title: "District Map — CivicGrid" };

export default async function MapPage() {
  const session = await auth();

  const [assetsResult, reportsResult] = await Promise.all([
    getAssets(),
    getReports(),
  ]);
  const assets = assetsResult.data;
  const reports = reportsResult.data;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="page-header" style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <MapIcon size={24} color="#0f172a" />
          <div>
            <h1 style={{ margin: 0, color: "#0f172a", fontSize: "1.25rem" }}>District Overview Map</h1>
            <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
              GIS integration for infrastructure, risks, and active missions
            </p>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <MapComponent assets={assets} reports={reports} />
      </div>
    </div>
  );
}
