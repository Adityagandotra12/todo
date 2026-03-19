import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function getDbConfig() {
  // On Vercel it's most common to set only `DATABASE_URL`.
  // If it's present, prefer it over DB_* (avoids using `localhost` accidentally).
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    const url = new URL(databaseUrl);
    const database = url.pathname.replace(/^\//, "");
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database,
      port: url.port ? Number(url.port) : 3306,
    };
  }

  // Local dev fallback
  return {
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "todo_db",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  };
}

const dbConfig = getDbConfig();

const adapter = new PrismaMariaDb({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  connectionLimit: 5,
});

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

