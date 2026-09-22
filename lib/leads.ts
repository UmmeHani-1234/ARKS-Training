// Shared Lead type — used by the API route and any server components
export type LeadStatus = "New" | "Contacted" | "Converted";

export interface Lead {
  id: number;
  name: string;
  email: string;
  status: LeadStatus;
  company: string;
  date: string; // ISO date string
}

// Mock dataset — Phase 2 will replace this with a real database query
export const leads: Lead[] = [
  { id: 1,  name: "Aisha Rahman",    email: "aisha@gmail.com",   status: "New",       company: "TechVentures",  date: "2024-09-01" },
  { id: 2,  name: "Rahul Singh",     email: "rahul@gmail.com",   status: "Contacted", company: "BuildSpace",    date: "2024-09-03" },
  { id: 3,  name: "Sara Malik",      email: "sara@gmail.com",    status: "Converted", company: "GrowFast",      date: "2024-09-05" },
  { id: 4,  name: "James Carter",    email: "james@outlook.com", status: "New",       company: "NovaBiz",       date: "2024-09-07" },
  { id: 5,  name: "Fatima Noor",     email: "fatima@gmail.com",  status: "Contacted", company: "StartupHub",    date: "2024-09-08" },
  { id: 6,  name: "Leo Zhang",       email: "leo@yahoo.com",     status: "Converted", company: "DevForge",      date: "2024-09-10" },
  { id: 7,  name: "Priya Sharma",    email: "priya@gmail.com",   status: "New",       company: "CloudPath",     date: "2024-09-11" },
  { id: 8,  name: "Omar Abdullah",   email: "omar@gmail.com",    status: "Converted", company: "DataPeak",      date: "2024-09-12" },
  { id: 9,  name: "Chloe Martin",    email: "chloe@gmail.com",   status: "New",       company: "LaunchPad",     date: "2024-09-14" },
  { id: 10, name: "Hassan Ahmed",    email: "hassan@gmail.com",  status: "Contacted", company: "NextWave",      date: "2024-09-15" },
];
