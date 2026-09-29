import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { FileText, Send } from "lucide-react";

export const metadata = { title: "Submit Citizen Report — CivicGrid" };

export default async function ReportPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div>
      <div className="page-header">
        <h1 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={22} />
          Submit Citizen Report
        </h1>
        <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
          Log a new incident or issue observed by field workers or citizens.
        </p>
      </div>

      <div className="page-body">
        <div className="card" style={{ maxWidth: 600, padding: 24 }}>
          <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }}>
                Incident Title <span style={{ color: "red" }}>*</span>
              </label>
              <input type="text" className="input" placeholder="e.g., Heavy waterlogging at main junction" required />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }}>
                Module Category <span style={{ color: "red" }}>*</span>
              </label>
              <select className="select" required>
                <option value="MONSOONSHIELD">MonsoonShield (Flooding/Rain)</option>
                <option value="SWASTHYAGRID">SwasthyaGrid (Health/Sanitation)</option>
                <option value="SURAKSHAGRID">SurakshaGrid (Infrastructure Risk)</option>
                <option value="HEATSAFE">HeatSafe (Extreme Heat/Power)</option>
                <option value="CIVICGRID_CORE">CivicGrid Core (General)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }}>
                Location (Ward / Area) <span style={{ color: "red" }}>*</span>
              </label>
              <input type="text" className="input" placeholder="e.g., Gachibowli, Ward 104" required />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }}>
                Description
              </label>
              <textarea 
                className="input" 
                rows={4} 
                placeholder="Provide detailed information about the incident, affected population, etc."
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }}>
                Attachments (Photos/Videos)
              </label>
              <input type="file" className="input" multiple accept="image/*,video/*" />
            </div>

            <div style={{ marginTop: 16 }}>
              <button 
                type="button"
                className="btn btn-primary" 
                style={{ width: "100%", display: "flex", justifyContent: "center", gap: 8 }}
                onClick={(e) => {
                  e.preventDefault();
                  alert("Report submitted successfully! (Demo Mode)");
                  window.location.href = "/dashboard/civicgrid";
                }}
              >
                <Send size={18} />
                Submit Report to Command Centre
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
