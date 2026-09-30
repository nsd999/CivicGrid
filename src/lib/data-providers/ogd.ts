export interface OgdProvenance {
  source: string;
  status: "LIVE" | "ERROR" | "MOCK";
  lastUpdated: Date;
}

export interface PHCData {
  id: string;
  name: string;
  district: string;
  state: string;
  facilities: string[];
  bed_capacity: number;
}

export interface OgdHealthResponse {
  records: PHCData[];
  provenance: OgdProvenance;
}

export async function getHealthInfrastructure(state: string = "Telangana"): Promise<OgdHealthResponse> {
  const apiKey = process.env.OGD_API_KEY;

  if (!apiKey) {
    console.warn("OGD_API_KEY is missing. Falling back to mock OGD data.");
    return getMockHealthData();
  }

  try {
    // This uses a generic endpoint structure. Real implementation would use actual resource ID.
    // Example resource ID for health facilities (placeholder).
    const resourceId = "placeholder-health-resource-id";
    const res = await fetch(
      `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&filters[state]=${encodeURIComponent(state)}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error("OGD API error:", await res.text());
      return getMockHealthData("ERROR");
    }

    const data = await res.json();
    
    // Map OGD records to our internal format
    const records = data.records.map((r: any) => ({
      id: r.id || String(Math.random()),
      name: r.facility_name || "Unknown PHC",
      district: r.district || "Unknown",
      state: r.state || state,
      facilities: r.facilities ? r.facilities.split(',') : ["OPD", "Emergency"],
      bed_capacity: parseInt(r.beds || "10", 10),
    }));

    return {
      records,
      provenance: {
        source: "Open Government Data (OGD) Platform India",
        status: "LIVE",
        lastUpdated: new Date(),
      }
    };
  } catch (error) {
    console.error("Failed to fetch OGD Health data:", error);
    return getMockHealthData("ERROR");
  }
}

function getMockHealthData(status: "MOCK" | "ERROR" = "MOCK"): OgdHealthResponse {
  return {
    records: [
      {
        id: "phc-1",
        name: "Kukatpally PHC",
        district: "Medchal-Malkajgiri",
        state: "Telangana",
        facilities: ["OPD", "Maternal Care", "Vaccination"],
        bed_capacity: 15
      },
      {
        id: "phc-2",
        name: "Gachibowli UPHC",
        district: "Rangareddy",
        state: "Telangana",
        facilities: ["OPD", "Emergency", "Diagnostics"],
        bed_capacity: 30
      },
      {
        id: "phc-3",
        name: "Secunderabad Cantonment Gen Hospital",
        district: "Hyderabad",
        state: "Telangana",
        facilities: ["OPD", "ICU", "Surgery", "X-Ray"],
        bed_capacity: 100
      }
    ],
    provenance: {
      source: "Open Government Data (Mock Fallback)",
      status,
      lastUpdated: new Date(),
    }
  };
}
