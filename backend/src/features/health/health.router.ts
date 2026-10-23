import { Hono } from "hono";
import { createPrismaFromBindings } from "../../lib/prisma";
import type { Bindings } from "../../types/env";

export const healthRouter = new Hono<{
  Bindings: Bindings;
}>();

healthRouter.get("/db", async (c) => {
  try {
    const prisma = createPrismaFromBindings(c.env);

    await prisma.$queryRaw`SELECT 1`;

    await prisma.$disconnect();

    return c.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return c.json(
      {
        status: "error",
        database: "disconnected",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});