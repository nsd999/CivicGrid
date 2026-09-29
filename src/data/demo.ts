// CivicGrid — Synthetic Hyderabad Demo Dataset
// ⚠️ DEMO DATA — All records are synthetic. Not actual government data.

import type {
  Action,
  Asset,
  CitizenReport,
  Event,
  Mission,
  RiskAssessment,
  Notification,
  DashboardStats,
} from "@/types";

// ============================================================
// ⚠️ DEMO DATA DISCLAIMER
// ============================================================

export const DEMO_DISCLAIMER =
  "⚠️ DEMO DATA — All records are synthetic and created for demonstration purposes only. This is not an official Government of India application. Not affiliated with or endorsed by any government body.";

// ============================================================
// LOCATIONS (Hyderabad Wards)
// ============================================================

export const DEMO_LOCATIONS = [
  { id: "loc-001", name: "Jubilee Hills", ward: "Ward 16", district: "Hyderabad", latitude: 17.4326, longitude: 78.4071 },
  { id: "loc-002", name: "Banjara Hills", ward: "Ward 15", district: "Hyderabad", latitude: 17.4156, longitude: 78.4347 },
  { id: "loc-003", name: "Secunderabad", ward: "Ward 42", district: "Hyderabad", latitude: 17.4399, longitude: 78.4983 },
  { id: "loc-004", name: "Madhapur", ward: "Ward 17", district: "Hyderabad", latitude: 17.4485, longitude: 78.3908 },
  { id: "loc-005", name: "LB Nagar", ward: "Ward 61", district: "Hyderabad", latitude: 17.3440, longitude: 78.5514 },
  { id: "loc-006", name: "Kukatpally", ward: "Ward 24", district: "Hyderabad", latitude: 17.4849, longitude: 78.4138 },
  { id: "loc-007", name: "Dilsukhnagar", ward: "Ward 59", district: "Hyderabad", latitude: 17.3688, longitude: 78.5247 },
  { id: "loc-008", name: "Mehdipatnam", ward: "Ward 12", district: "Hyderabad", latitude: 17.3942, longitude: 78.4377 },
  { id: "loc-009", name: "Tarnaka", ward: "Ward 43", district: "Hyderabad", latitude: 17.4380, longitude: 78.5345 },
  { id: "loc-010", name: "Uppal", ward: "Ward 56", district: "Hyderabad", latitude: 17.4057, longitude: 78.5591 },
];

// ============================================================
// ASSETS (Infrastructure)
// ============================================================

export const DEMO_ASSETS: Asset[] = [
  // Hospitals
  { id: "asset-h1", name: "Osmania General Hospital", type: "HOSPITAL", locationId: "loc-009", address: "Station Road, Tarnaka", latitude: 17.3850, longitude: 78.4738, ward: "Ward 43", department: "Health", capacity: 1200, metadata: { beds: 1200, icu_beds: 80, emergency: true }, isActive: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "asset-h2", name: "Gandhi Hospital", type: "HOSPITAL", locationId: "loc-009", address: "Musheerabad, Hyderabad", latitude: 17.4090, longitude: 78.4808, ward: "Ward 43", department: "Health", capacity: 800, metadata: { beds: 800, icu_beds: 60, emergency: true }, isActive: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "asset-h3", name: "Niloufer Hospital", type: "HOSPITAL", locationId: "loc-003", address: "Red Hills, Lakdi Ka Pul", latitude: 17.4115, longitude: 78.4643, ward: "Ward 42", department: "Health", capacity: 600, metadata: { beds: 600, emergency: true }, isActive: true, createdAt: "2024-01-01T00:00:00Z" },

  // PHCs
  { id: "asset-p1", name: "Urban PHC Jubilee Hills", type: "PHC", locationId: "loc-001", address: "Road No. 10, Jubilee Hills", latitude: 17.4310, longitude: 78.4050, ward: "Ward 16", department: "Health", capacity: 150, metadata: { daily_patients: 80, medicine_supply_days: 18 }, isActive: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "asset-p2", name: "Urban PHC Kukatpally", type: "PHC", locationId: "loc-006", address: "KPHB Colony, Kukatpally", latitude: 17.4830, longitude: 78.4100, ward: "Ward 24", department: "Health", capacity: 120, metadata: { daily_patients: 95, medicine_supply_days: 31 }, isActive: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "asset-p3", name: "Urban PHC LB Nagar", type: "PHC", locationId: "loc-005", address: "LB Nagar Circle", latitude: 17.3410, longitude: 78.5490, ward: "Ward 61", department: "Health", capacity: 100, metadata: { daily_patients: 110, medicine_supply_days: 7 }, isActive: true, createdAt: "2024-01-01T00:00:00Z" },

  // Schools
  { id: "asset-s1", name: "ZPHS Jubilee Hills", type: "SCHOOL", locationId: "loc-001", address: "Road No. 45, Jubilee Hills", latitude: 17.4280, longitude: 78.4020, ward: "Ward 16", department: "Education", capacity: 800, isActive: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "asset-s2", name: "Municipal High School Dilsukhnagar", type: "SCHOOL", locationId: "loc-007", address: "Dilsukhnagar Main Road", latitude: 17.3660, longitude: 78.5270, ward: "Ward 59", department: "Education", capacity: 1200, isActive: true, createdAt: "2024-01-01T00:00:00Z" },

  // Power Substations
  { id: "asset-ps1", name: "Jubilee Hills 33KV Substation", type: "POWER_SUBSTATION", locationId: "loc-001", address: "Road No. 92, Jubilee Hills", latitude: 17.4290, longitude: 78.4080, ward: "Ward 16", department: "TSSPDCL", metadata: { capacity_kv: 33, downstream_consumers: 12000 }, isActive: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "asset-ps2", name: "Uppal 132KV Substation", type: "POWER_SUBSTATION", locationId: "loc-010", address: "Uppal Industrial Area", latitude: 17.4020, longitude: 78.5600, ward: "Ward 56", department: "TSSPDCL", metadata: { capacity_kv: 132, downstream_consumers: 45000 }, isActive: true, createdAt: "2024-01-01T00:00:00Z" },

  // Water Facilities
  { id: "asset-w1", name: "Jubilee Hills Water Treatment Plant", type: "WATER_FACILITY", locationId: "loc-001", address: "Durgam Cheruvu Area", latitude: 17.4360, longitude: 78.3990, ward: "Ward 16", department: "HMWSSB", metadata: { capacity_mld: 45 }, isActive: true, createdAt: "2024-01-01T00:00:00Z" },

  // Bridges
  { id: "asset-b1", name: "Nagarjuna Sagar Road Bridge (Jubilee Hills)", type: "BRIDGE", locationId: "loc-001", address: "Road No. 45 near Durgam Cheruvu", latitude: 17.4350, longitude: 78.4020, ward: "Ward 16", department: "GHMC", metadata: { age_years: 28, last_inspection: "2023-03-15" }, isActive: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "asset-b2", name: "Musi River Bridge Chaderghat", type: "BRIDGE", locationId: "loc-007", address: "Chaderghat, Old City", latitude: 17.3706, longitude: 78.4880, ward: "Ward 59", department: "GHMC", metadata: { age_years: 45, last_inspection: "2022-11-20" }, isActive: true, createdAt: "2024-01-01T00:00:00Z" },
];

// ============================================================
// CITIZEN REPORTS
// ============================================================

export const DEMO_REPORTS: CitizenReport[] = [
  {
    id: "report-001",
    category: "ROAD",
    title: "Large pothole causing accidents near school",
    description: "There is a very deep pothole on Road No. 45 near ZPHS Jubilee Hills. Two-wheelers have fallen. Please fix urgently as school children use this road daily.",
    locationId: "loc-001",
    address: "Road No. 45, Jubilee Hills",
    latitude: 17.4285, longitude: 78.4018,
    ward: "Ward 16",
    severity: "HIGH",
    aiCategory: "ROAD",
    aiSummary: "Critical road damage near school facility affecting daily commute safety",
    aiDepartment: "GHMC",
    aiConfidence: 0.94,
    status: "IN_PROGRESS",
    isAnonymous: false,
    createdAt: "2026-09-10T08:30:00Z",
  },
  {
    id: "report-002",
    category: "DRAINAGE",
    title: "Drain blocked — water stagnation",
    description: "Main drain near Durgam Cheruvu entrance blocked with garbage. During last rain, entire road flooded for 3 hours. Hospital road also affected.",
    locationId: "loc-001",
    address: "Durgam Cheruvu Road, Jubilee Hills",
    latitude: 17.4360, longitude: 78.3995,
    ward: "Ward 16",
    severity: "CRITICAL",
    aiCategory: "DRAINAGE",
    aiSummary: "Severe drainage blockage with flood risk to hospital access route",
    aiDepartment: "GHMC",
    aiConfidence: 0.91,
    status: "ASSIGNED",
    isAnonymous: false,
    createdAt: "2026-09-08T14:20:00Z",
  },
  {
    id: "report-003",
    category: "STREETLIGHT",
    title: "5 streetlights not working for 3 weeks",
    description: "Road No. 10 near Jubilee Hills park has 5 consecutive streetlights not working since 3 weeks. Area is dark at night, women feel unsafe.",
    locationId: "loc-001",
    address: "Road No. 10, Jubilee Hills",
    latitude: 17.4305, longitude: 78.4065,
    ward: "Ward 16",
    severity: "MEDIUM",
    aiCategory: "STREETLIGHT",
    aiSummary: "Extended streetlight outage creating safety risk in residential area",
    aiDepartment: "GHMC",
    aiConfidence: 0.89,
    status: "NEW",
    isAnonymous: true,
    createdAt: "2026-09-25T18:45:00Z",
  },
  {
    id: "report-004",
    category: "WASTE",
    title: "Garbage not collected for 5 days",
    description: "Garbage bins on Road No. 36 have not been collected for 5 days. Stray dogs spreading garbage on road. Smell is very bad. Children and elderly affected.",
    locationId: "loc-002",
    address: "Road No. 36, Banjara Hills",
    latitude: 17.4135, longitude: 78.4320,
    ward: "Ward 15",
    severity: "MEDIUM",
    aiCategory: "WASTE",
    aiSummary: "Garbage collection failure with hygiene and public health impact",
    aiDepartment: "GHMC",
    aiConfidence: 0.87,
    status: "REVIEWING",
    isAnonymous: false,
    createdAt: "2026-09-24T09:15:00Z",
  },
  {
    id: "report-005",
    category: "WATER",
    title: "No water supply for 2 days — Kukatpally",
    description: "No water supply in KPHB Colony Phase 4 for 2 days. 500+ households affected. Please fix pipeline or arrange tankers urgently.",
    locationId: "loc-006",
    address: "KPHB Colony Phase 4, Kukatpally",
    latitude: 17.4812, longitude: 78.4090,
    ward: "Ward 24",
    severity: "HIGH",
    aiCategory: "WATER",
    aiSummary: "Major water supply failure affecting 500+ households for 2 days",
    aiDepartment: "HMWSSB",
    aiConfidence: 0.93,
    status: "IN_PROGRESS",
    isAnonymous: false,
    createdAt: "2026-09-27T07:00:00Z",
  },
];

// ============================================================
// ACTIONS
// ============================================================

export const DEMO_ACTIONS: Action[] = [
  {
    id: "action-001",
    module: "CIVICGRID_CORE",
    title: "Repair critical drainage blockage — Durgam Cheruvu Road",
    description: "Main drain blocked causing flood risk to hospital access route. Immediate desilting and repair required.",
    priority: "CRITICAL",
    status: "ASSIGNED",
    locationId: "loc-001",
    ward: "Ward 16",
    reason: "31 correlated reports, hospital within 200m, flood exposure detected, unresolved 21 days",
    recommendedAction: "Deploy drain cleaning crew within 24 hours. Inspect 200m upstream. Report blockage cause.",
    assignedDept: "GHMC",
    aiGenerated: true,
    aiApproved: true,
    slaBreached: false,
    dueAt: "2026-09-30T17:00:00Z",
    createdAt: "2026-09-09T10:00:00Z",
    updatedAt: "2026-09-28T11:00:00Z",
  },
  {
    id: "action-002",
    module: "SWASTHYAGRID",
    title: "Emergency medicine redistribution — LB Nagar PHC",
    description: "LB Nagar PHC projected ORS stockout in 7 days. Kukatpally PHC has 31-day surplus. Transfer recommended.",
    priority: "HIGH",
    status: "REVIEWING",
    locationId: "loc-005",
    ward: "Ward 61",
    reason: "ORS stock at 7-day level. Projected stockout before next supply. 110 daily patients.",
    recommendedAction: "Transfer 500 ORS packets from Kukatpally PHC (31-day surplus). Raise emergency supply requisition.",
    assignedDept: "Health Department",
    aiGenerated: true,
    aiApproved: false,
    slaBreached: false,
    dueAt: "2026-10-02T17:00:00Z",
    createdAt: "2026-09-28T09:00:00Z",
    updatedAt: "2026-09-28T09:00:00Z",
  },
  {
    id: "action-003",
    module: "SURAKSHAGRID",
    title: "Pre-cyclone inspection — Chaderghat Bridge",
    description: "45-year-old Musi River Bridge has high flood exposure. Pre-event structural inspection critical before forecast monsoon event.",
    priority: "HIGH",
    status: "NEW",
    locationId: "loc-007",
    ward: "Ward 59",
    reason: "Bridge age 45 years, last inspection Nov 2022, Musi River flood susceptibility HIGH, 12,000 downstream population",
    recommendedAction: "Structural engineer inspection within 48 hours. Assess load capacity. Prepare diversion route plan.",
    assignedDept: "GHMC",
    aiGenerated: true,
    aiApproved: false,
    slaBreached: false,
    dueAt: "2026-10-01T12:00:00Z",
    createdAt: "2026-09-29T06:00:00Z",
    updatedAt: "2026-09-29T06:00:00Z",
  },
  {
    id: "action-004",
    module: "MONSOONSHIELD",
    title: "Pre-position drain pumps — Jubilee Hills low zones",
    description: "Heavy rainfall forecast (65mm/24h). Ward 16 has 3 flood-prone low-lying zones. Pre-position mobile pumping units.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    locationId: "loc-001",
    ward: "Ward 16",
    reason: "IMD heavy rain warning, 3 low-lying zones identified, historical flooding 2022 and 2023, hospital access route risk",
    recommendedAction: "Pre-position 2 mobile pumps at Durgam Cheruvu junction. Crew on standby. Drainage team alert.",
    assignedDept: "GHMC",
    aiGenerated: true,
    aiApproved: true,
    slaBreached: false,
    dueAt: "2026-09-29T20:00:00Z",
    createdAt: "2026-09-29T05:00:00Z",
    updatedAt: "2026-09-29T08:30:00Z",
  },
  {
    id: "action-005",
    module: "HEATSAFE_INDIA",
    title: "Open cooling point — Ward 18 Mehdipatnam",
    description: "Ward 18 Heat Risk HIGH. 3,400 elderly residents, low water access, outdoor workers exposed. Cooling point not operational.",
    priority: "CRITICAL",
    status: "ASSIGNED",
    locationId: "loc-008",
    ward: "Ward 18",
    reason: "Heat index 42°C, 3,400 elderly population, outdoor worker concentration HIGH, no active cooling point in 2km radius",
    recommendedAction: "Open community hall as cooling point. Deploy water tanker. Notify ASHA workers. Alert nearby hospitals.",
    assignedDept: "GHMC",
    aiGenerated: true,
    aiApproved: true,
    slaBreached: false,
    dueAt: "2026-09-29T12:00:00Z",
    createdAt: "2026-09-29T07:00:00Z",
    updatedAt: "2026-09-29T09:00:00Z",
  },
  {
    id: "action-006",
    module: "CIVICGRID_CORE",
    title: "Repair pothole near ZPHS — Road No. 45",
    description: "Deep pothole causing road accidents near school. 31 correlated reports. Multiple two-wheeler incidents reported.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    locationId: "loc-001",
    ward: "Ward 16",
    reason: "31 reports, school within 300m, accident risk, unresolved 19 days",
    recommendedAction: "Emergency pothole repair within 48 hours using rapid-set concrete. Mark with warning signs until fixed.",
    assignedDept: "GHMC",
    aiGenerated: true,
    aiApproved: true,
    slaBreached: true,
    dueAt: "2026-09-20T17:00:00Z",
    createdAt: "2026-09-10T09:00:00Z",
    updatedAt: "2026-09-28T14:00:00Z",
  },
  {
    id: "action-007",
    module: "SWASTHYAGRID",
    title: "Restore water supply — KPHB Colony Phase 4",
    description: "Major water supply failure. 500+ households. 48+ hours without supply. Emergency tanker deployment and pipe repair needed.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    locationId: "loc-006",
    ward: "Ward 24",
    reason: "500+ households, 2-day outage, no alternate supply, elderly and children affected",
    recommendedAction: "Deploy 3 water tankers immediately. Field team to identify pipe break location. Repair within 12 hours.",
    assignedDept: "HMWSSB",
    aiGenerated: false,
    slaBreached: false,
    dueAt: "2026-09-29T18:00:00Z",
    createdAt: "2026-09-27T09:00:00Z",
    updatedAt: "2026-09-29T08:00:00Z",
  },
  {
    id: "action-008",
    module: "CIVICGRID_CORE",
    title: "Replace streetlights — Road No. 10 Jubilee Hills",
    description: "5 consecutive streetlights faulty for 3 weeks. Safety risk to women and pedestrians at night.",
    priority: "MEDIUM",
    status: "NEW",
    locationId: "loc-001",
    ward: "Ward 16",
    reason: "3-week outage, safety risk, public complaints",
    recommendedAction: "Electrician inspection and bulb/fixture replacement. Verify other lights on circuit.",
    assignedDept: "GHMC",
    aiGenerated: false,
    slaBreached: false,
    dueAt: "2026-10-03T17:00:00Z",
    createdAt: "2026-09-25T20:00:00Z",
    updatedAt: "2026-09-25T20:00:00Z",
  },
];

// ============================================================
// RISK ASSESSMENTS
// ============================================================

export const DEMO_RISKS: RiskAssessment[] = [
  {
    id: "risk-001",
    module: "MONSOONSHIELD",
    ward: "Ward 16",
    priority: "CRITICAL",
    priorityScore: 87.2,
    populationAffected: 45000,
    reportCount: 31,
    recurrenceCount: 8,
    factors: [
      { factor: "flood_history", label: "Historical flooding 2022, 2023", value: "confirmed", weight: 0.25, contribution: 22 },
      { factor: "hospital_proximity", label: "Hospital within 200m of flood zone", value: 180, weight: 0.20, contribution: 18 },
      { factor: "drainage_capacity", label: "Drain capacity 40% blocked", value: 40, weight: 0.15, contribution: 12 },
      { factor: "rainfall_forecast", label: "IMD 65mm/24h heavy rain warning", value: 65, weight: 0.15, contribution: 13 },
    ],
    aiExplanation: "Ward 16 Jubilee Hills has HIGH flood risk due to historically confirmed flooding, blocked drainage (40% capacity), and a hospital access route that becomes impassable during heavy rain events exceeding 40mm/24h. IMD forecast of 65mm exceeds this threshold.",
    aiConfidence: 0.91,
    aiProvider: "openai",
    createdAt: "2026-09-29T06:00:00Z",
  },
  {
    id: "risk-002",
    module: "HEATSAFE_INDIA",
    ward: "Ward 18",
    priority: "CRITICAL",
    priorityScore: 82.5,
    populationAffected: 58000,
    reportCount: 4,
    recurrenceCount: 3,
    factors: [
      { factor: "heat_index", label: "Heat index 42°C (danger zone)", value: 42, weight: 0.30, contribution: 26 },
      { factor: "elderly_population", label: "3,400 elderly residents exposed", value: 3400, weight: 0.25, contribution: 20 },
      { factor: "water_access", label: "Low water access — no active cooling point in 2km", value: "LOW", weight: 0.20, contribution: 16 },
      { factor: "outdoor_workers", label: "High outdoor worker concentration", value: "HIGH", weight: 0.15, contribution: 12 },
    ],
    aiExplanation: "Ward 18 Mehdipatnam presents critical heat-health risk. The combination of heat index 42°C, 3,400 elderly residents without adequate cooling access, and concentrated outdoor worker population creates compounding vulnerability. No active cooling point exists within 2km radius.",
    aiConfidence: 0.89,
    aiProvider: "gemini",
    createdAt: "2026-09-29T07:00:00Z",
  },
  {
    id: "risk-003",
    module: "SURAKSHAGRID",
    assetId: "asset-b2",
    ward: "Ward 59",
    priority: "HIGH",
    priorityScore: 71.3,
    populationAffected: 12000,
    reportCount: 2,
    recurrenceCount: 1,
    factors: [
      { factor: "structure_age", label: "Bridge age 45 years — above safety threshold", value: 45, weight: 0.30, contribution: 28 },
      { factor: "flood_susceptibility", label: "Musi River HIGH flood susceptibility", value: "HIGH", weight: 0.25, contribution: 20 },
      { factor: "inspection_gap", label: "Last inspection November 2022 (>2 years)", value: "2022-11", weight: 0.20, contribution: 14 },
      { factor: "downstream_dependency", label: "12,000 downstream population", value: 12000, weight: 0.15, contribution: 9 },
    ],
    aiExplanation: "Chaderghat Bridge represents HIGH structural vulnerability due to advanced age (45 years), Musi River flood exposure, and inspection gap exceeding 2 years. Forecast monsoon event could create structural stress requiring pre-event assessment.",
    aiConfidence: 0.85,
    aiProvider: "openai",
    createdAt: "2026-09-29T05:30:00Z",
  },
  {
    id: "risk-004",
    module: "SWASTHYAGRID",
    assetId: "asset-p3",
    ward: "Ward 61",
    priority: "HIGH",
    priorityScore: 68.0,
    populationAffected: 15000,
    reportCount: 1,
    recurrenceCount: 2,
    factors: [
      { factor: "ors_stockout", label: "ORS stock 7 days — critical threshold", value: 7, weight: 0.40, contribution: 30 },
      { factor: "patient_load", label: "110 daily patients — above capacity", value: 110, weight: 0.30, contribution: 22 },
      { factor: "supply_recurrence", label: "2nd stockout in 6 months", value: 2, weight: 0.20, contribution: 12 },
    ],
    aiExplanation: "LB Nagar PHC faces imminent ORS stockout (7 days) with patient load exceeding capacity (110/day vs 100 capacity). This is the 2nd stockout event in 6 months, indicating a systematic supply chain issue requiring structural intervention beyond immediate redistribution.",
    aiConfidence: 0.88,
    aiProvider: "openai",
    createdAt: "2026-09-28T08:00:00Z",
  },
];

// ============================================================
// EVENTS
// ============================================================

export const DEMO_EVENTS: Event[] = [
  {
    id: "event-001",
    title: "Heavy Rainfall Warning — Ward 16 Jubilee Hills",
    description: "IMD issued heavy rainfall warning for Hyderabad. 65mm+ forecast over 24 hours. Historical flooding risk areas identified.",
    module: "MONSOONSHIELD",
    source: "WEATHER",
    status: "ACTION_CREATED",
    severity: "CRITICAL",
    ward: "Ward 16",
    metadata: { rainfall_mm: 65, warning_level: "RED", source: "IMD Hyderabad", issuedAt: "2026-09-29T05:00:00Z" },
    detectedAt: "2026-09-29T05:00:00Z",
    createdAt: "2026-09-29T05:00:00Z",
  },
  {
    id: "event-002",
    title: "Heatwave — Ward 18 Mehdipatnam",
    description: "IMD heatwave declaration. Heat index reached 42°C. Vulnerable population alert issued.",
    module: "HEATSAFE_INDIA",
    source: "WEATHER",
    status: "ACTION_CREATED",
    severity: "CRITICAL",
    ward: "Ward 18",
    metadata: { max_temp_c: 42, humidity: 55, heat_index: 42, heatwave_declaration: true },
    detectedAt: "2026-09-27T10:00:00Z",
    createdAt: "2026-09-27T10:00:00Z",
  },
  {
    id: "event-003",
    title: "PHC Medicine Stockout Alert — LB Nagar",
    description: "AI-predicted ORS stockout at LB Nagar PHC within 7 days based on consumption rate analysis.",
    module: "SWASTHYAGRID",
    source: "SYSTEM_DETECTION",
    status: "PRIORITISED",
    severity: "HIGH",
    ward: "Ward 61",
    metadata: { medicine: "ORS", current_stock_days: 7, daily_consumption: 45, predicted_stockout_date: "2026-10-06" },
    detectedAt: "2026-09-28T08:00:00Z",
    createdAt: "2026-09-28T08:00:00Z",
  },
  {
    id: "event-004",
    title: "Drain Blockage — Durgam Cheruvu Road (31 Reports)",
    description: "Correlated citizen reports detect major drainage blockage. 31 reports over 21 days. Hospital access route risk identified.",
    module: "CIVICGRID_CORE",
    source: "CITIZEN_REPORT",
    status: "ASSIGNED",
    severity: "CRITICAL",
    ward: "Ward 16",
    metadata: { report_count: 31, days_unresolved: 21, affected_assets: ["asset-h1"] },
    detectedAt: "2026-09-08T14:00:00Z",
    createdAt: "2026-09-08T14:00:00Z",
  },
  {
    id: "event-005",
    title: "Structural Risk — Chaderghat Bridge",
    description: "GIS analysis identified high-risk aging bridge on Musi River flood plain. Pre-event inspection recommended.",
    module: "SURAKSHAGRID",
    source: "SYSTEM_DETECTION",
    status: "ACTION_CREATED",
    severity: "HIGH",
    ward: "Ward 59",
    metadata: { bridge_id: "asset-b2", age_years: 45, last_inspection: "2022-11-20" },
    detectedAt: "2026-09-29T05:30:00Z",
    createdAt: "2026-09-29T05:30:00Z",
  },
];

// ============================================================
// MISSION (Mission Mode)
// ============================================================

export const DEMO_MISSIONS: Mission[] = [
  {
    id: "mission-001",
    title: "Hyderabad Heavy Rainfall Response — September 2026",
    description: "Coordinated multi-department response to IMD Red Warning for heavy rainfall. Covers flood risk, infrastructure vulnerability, hospital access protection, drainage operations and critical-route management.",
    modules: ["MONSOONSHIELD", "CIVICGRID_CORE", "SURAKSHAGRID", "SWASTHYAGRID"],
    status: "ACTIVE",
    priority: "CRITICAL",
    ward: "Ward 16",
    startedAt: "2026-09-29T06:00:00Z",
    metadata: {
      critical_actions: 3,
      high_actions: 17,
      affected_hospitals: 4,
      affected_roads: 12,
      drainage_interventions: 8,
      departments: ["GHMC", "HMWSSB", "Health", "Traffic Police", "TSSPDCL"],
      summary: "Mission created in response to IMD Red Alert for Hyderabad. 3 critical actions, 17 high-priority actions across 5 departments. Hospital access routes being secured. Drainage clearing in progress.",
    },
    createdAt: "2026-09-29T06:00:00Z",
  },
];

// ============================================================
// DASHBOARD STATS
// ============================================================

export const DEMO_STATS: DashboardStats = {
  criticalIssues: 3,
  highPriorityIssues: 17,
  activeRisks: 12,
  pendingActions: 23,
  resolvedToday: 5,
  activeMissions: 1,
};

// ============================================================
// NOTIFICATIONS
// ============================================================

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-001",
    profileId: "demo-district-001",
    type: "CRITICAL",
    title: "IMD Red Alert — Heavy Rainfall",
    message: "IMD has issued Red Warning for Hyderabad. 65mm+ rainfall forecast in 24 hours. Mission Mode activated.",
    module: "MONSOONSHIELD",
    missionId: "mission-001",
    isRead: false,
    createdAt: "2026-09-29T05:00:00Z",
  },
  {
    id: "notif-002",
    profileId: "demo-district-001",
    type: "CRITICAL",
    title: "Heat Risk — Ward 18 Mehdipatnam",
    message: "Heat index 42°C detected. 3,400 elderly residents at risk. Cooling point action pending approval.",
    module: "HEATSAFE_INDIA",
    actionId: "action-005",
    isRead: false,
    createdAt: "2026-09-29T07:00:00Z",
  },
  {
    id: "notif-003",
    profileId: "demo-officer-001",
    type: "HIGH",
    title: "AI Recommendation — PHC Stockout",
    message: "AI recommends emergency ORS redistribution from Kukatpally PHC to LB Nagar PHC. Awaiting your approval.",
    module: "SWASTHYAGRID",
    actionId: "action-002",
    isRead: false,
    createdAt: "2026-09-28T09:00:00Z",
  },
  {
    id: "notif-004",
    profileId: "demo-officer-001",
    type: "WARNING",
    title: "SLA Breach — Pothole Repair",
    message: "Action #action-006 has breached SLA. Pothole near school has been unresolved for 19 days.",
    module: "CIVICGRID_CORE",
    actionId: "action-006",
    isRead: true,
    readAt: "2026-09-28T10:00:00Z",
    createdAt: "2026-09-28T08:00:00Z",
  },
];

// ============================================================
// HEALTH INVENTORY (SwasthyaGrid)
// ============================================================

export const DEMO_HEALTH_INVENTORY = [
  {
    phcId: "asset-p1",
    phcName: "Urban PHC Jubilee Hills",
    ward: "Ward 16",
    medicines: [
      { name: "ORS Packets", unit: "packets", currentStock: 450, dailyConsumption: 25, stockDays: 18, status: "ADEQUATE" },
      { name: "Paracetamol 500mg", unit: "tablets", currentStock: 2000, dailyConsumption: 80, stockDays: 25, status: "ADEQUATE" },
      { name: "Chlorine tablets", unit: "tablets", currentStock: 500, dailyConsumption: 20, stockDays: 25, status: "ADEQUATE" },
      { name: "ORS Sachets (oral)", unit: "sachets", currentStock: 280, dailyConsumption: 35, stockDays: 8, status: "WARNING" },
    ],
  },
  {
    phcId: "asset-p2",
    phcName: "Urban PHC Kukatpally",
    ward: "Ward 24",
    medicines: [
      { name: "ORS Packets", unit: "packets", currentStock: 960, dailyConsumption: 31, stockDays: 31, status: "SURPLUS" },
      { name: "Paracetamol 500mg", unit: "tablets", currentStock: 3500, dailyConsumption: 100, stockDays: 35, status: "SURPLUS" },
      { name: "Chlorine tablets", unit: "tablets", currentStock: 400, dailyConsumption: 15, stockDays: 27, status: "ADEQUATE" },
    ],
  },
  {
    phcId: "asset-p3",
    phcName: "Urban PHC LB Nagar",
    ward: "Ward 61",
    medicines: [
      { name: "ORS Packets", unit: "packets", currentStock: 315, dailyConsumption: 45, stockDays: 7, status: "CRITICAL" },
      { name: "Paracetamol 500mg", unit: "tablets", currentStock: 800, dailyConsumption: 110, stockDays: 7, status: "CRITICAL" },
      { name: "ORS Sachets (oral)", unit: "sachets", currentStock: 60, dailyConsumption: 20, stockDays: 3, status: "CRITICAL" },
    ],
  },
];

// ============================================================
// FLOOD RISK ZONES (MonsoonShield)
// ============================================================

export const DEMO_FLOOD_ZONES = [
  { id: "fz-001", name: "Durgam Cheruvu Low Zone", ward: "Ward 16", latitude: 17.4360, longitude: 78.3995, riskLevel: "CRITICAL", floodDepthCm: 60, affectedArea: 2.3, historicalEvents: 3 },
  { id: "fz-002", name: "Road No. 45 Junction", ward: "Ward 16", latitude: 17.4285, longitude: 78.4018, riskLevel: "HIGH", floodDepthCm: 35, affectedArea: 0.8, historicalEvents: 2 },
  { id: "fz-003", name: "Musi River Banks Chaderghat", ward: "Ward 59", latitude: 17.3706, longitude: 78.4880, riskLevel: "HIGH", floodDepthCm: 45, affectedArea: 4.1, historicalEvents: 5 },
  { id: "fz-004", name: "Uppal Industrial Drain", ward: "Ward 56", latitude: 17.4057, longitude: 78.5591, riskLevel: "MEDIUM", floodDepthCm: 25, affectedArea: 1.2, historicalEvents: 1 },
];

// ============================================================
// HEAT RISK WARDS (HeatSafe India)
// ============================================================

export const DEMO_HEAT_WARDS = [
  { ward: "Ward 18", name: "Mehdipatnam", latitude: 17.3942, longitude: 78.4377, heatIndex: 42, riskLevel: "CRITICAL", elderlyCount: 3400, outdoorWorkers: "HIGH", waterAccess: "LOW", coolingPoints: 0 },
  { ward: "Ward 59", name: "Dilsukhnagar", latitude: 17.3688, longitude: 78.5247, heatIndex: 40, riskLevel: "HIGH", elderlyCount: 2800, outdoorWorkers: "HIGH", waterAccess: "MEDIUM", coolingPoints: 1 },
  { ward: "Ward 61", name: "LB Nagar", latitude: 17.3440, longitude: 78.5514, heatIndex: 39, riskLevel: "HIGH", elderlyCount: 2200, outdoorWorkers: "MEDIUM", waterAccess: "MEDIUM", coolingPoints: 1 },
  { ward: "Ward 16", name: "Jubilee Hills", latitude: 17.4326, longitude: 78.4071, heatIndex: 37, riskLevel: "MEDIUM", elderlyCount: 1800, outdoorWorkers: "LOW", waterAccess: "HIGH", coolingPoints: 2 },
];
