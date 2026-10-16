import { getDatabase } from "@netlify/database";
import type { Enquiry } from "./enquiry";

// Data access for the enquiries table (schema: netlify/database/migrations).
// All queries are parameterized; never build SQL from user input.

export const enquiryStatuses = ["new", "in_progress", "closed"] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];

export type EnquiryRecord = Omit<Enquiry, "locale"> & {
  id: string;
  createdAt: Date;
  status: EnquiryStatus;
  locale: string;
  userEmail: string | null;
};

type Row = {
  id: string;
  created_at: Date | string;
  status: EnquiryStatus;
  type: string;
  service: string | null;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
  locale: string;
  user_email: string | null;
};

const toRecord = (r: Row): EnquiryRecord => ({
  id: r.id,
  createdAt: new Date(r.created_at),
  status: r.status,
  type: r.type,
  service: r.service ?? "",
  name: r.name,
  company: r.company ?? "",
  email: r.email,
  phone: r.phone ?? "",
  message: r.message,
  locale: r.locale,
  userEmail: r.user_email,
});

/** Runs a parameterized query and returns typed rows. */
async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await getDatabase().pool.query(text, params);
  return result.rows as T[];
}
const COLUMNS = "id, created_at, status, type, service, name, company, email, phone, message, locale, user_email";

export async function saveEnquiry(e: Enquiry, userEmail: string | null): Promise<string> {
  const rows = await query<{ id: string }>(
    `INSERT INTO enquiries (type, service, name, company, email, phone, message, locale, user_email)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [e.type, e.service || null, e.name, e.company || null, e.email, e.phone || null, e.message, e.locale || "en", userEmail],
  );
  return rows[0].id;
}

/** Staff view: newest first, optionally filtered by status. */
export async function listEnquiries(status?: EnquiryStatus, limit = 200): Promise<EnquiryRecord[]> {
  const rows = status
    ? await query<Row>(`SELECT ${COLUMNS} FROM enquiries WHERE status = $1 ORDER BY created_at DESC LIMIT $2`, [status, limit])
    : await query<Row>(`SELECT ${COLUMNS} FROM enquiries ORDER BY created_at DESC LIMIT $1`, [limit]);
  return rows.map(toRecord);
}

/** Customer view: enquiries submitted while signed in, or sent from their verified address. */
export async function listEnquiriesFor(email: string): Promise<EnquiryRecord[]> {
  const rows = await query<Row>(
    `SELECT ${COLUMNS} FROM enquiries
     WHERE LOWER(user_email) = LOWER($1) OR LOWER(email) = LOWER($1)
     ORDER BY created_at DESC LIMIT 100`,
    [email],
  );
  return rows.map(toRecord);
}

export async function countByStatus(): Promise<Record<EnquiryStatus, number>> {
  const rows = await query<{ status: EnquiryStatus; n: string }>(
    "SELECT status, COUNT(*)::text AS n FROM enquiries GROUP BY status",
  );
  const counts = { new: 0, in_progress: 0, closed: 0 };
  for (const r of rows) counts[r.status] = Number(r.n);
  return counts;
}

export async function setEnquiryStatus(id: string, status: EnquiryStatus) {
  await query("UPDATE enquiries SET status = $1, updated_at = NOW() WHERE id = $2", [status, id]);
}
