import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import { ReportForm } from "./report-form";

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
          <ReportForm />
        </div>
      </div>
    </div>
  );
}
