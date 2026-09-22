import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export function createPrisma(connectionString: string) {
  const adapter = new PrismaPg({
    connectionString,
  });

  return new PrismaClient({
    adapter,
  });
}