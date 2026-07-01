import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE || "transitradar",
    user: process.env.PGUSER || "transitradar",
    password: process.env.PGPASSWORD || "transitradar",
    max: Number(process.env.PGPOOL_MAX || 10)
});

export async function query(text, params = []) {
    return await pool.query(text, params);
}

export async function assertDatabaseConnection() {
    await query("select 1");
}
