import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type DatabaseBindings = {
  HYPERDRIVE?: { connectionString: string };
  DATABASE_URL?: string;
};

export function createPrismaFromBindings(bindings: DatabaseBindings) {
  const connectionString =
    bindings.HYPERDRIVE?.connectionString ?? bindings.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Database connection is not configured. Set HYPERDRIVE or DATABASE_URL.");
  }

  return createPrisma(connectionString);
}

export function createPrisma(connectionString: string) {
  const adapter = new PrismaPg({
    connectionString,
  });

  return new PrismaClient({
    adapter,
  });
}