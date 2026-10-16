import { getDatabase, MissingDatabaseConnectionError } from "@netlify/database";

/** Runs a parameterized query and returns typed rows. Never build SQL from user input. */
export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await getDatabase().pool.query(text, params);
  return result.rows as T[];
}

export const isMissingDatabase = (err: unknown) =>
  err instanceof MissingDatabaseConnectionError || (err as Error)?.name === "MissingDatabaseConnectionError";
