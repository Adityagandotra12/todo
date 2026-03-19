import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL;

// IMPORTANT:
// `@prisma/adapter-mariadb` accepts either:
// - a PoolConfig object, OR
// - a connection string.
// Passing the connection string directly preserves SSL + query params.
const adapter = databaseUrl
  ? new PrismaMariaDb(databaseUrl)
  : new PrismaMariaDb({
      host: process.env.DB_HOST ?? "localhost",
      user: process.env.DB_USER ?? "",
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_NAME ?? "todo_db",
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
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

