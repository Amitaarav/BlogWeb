import { Hono } from "hono";
import { createPrisma } from "../../lib/prisma";
import type { Bindings } from "../../types/env";

export const healthRouter = new Hono<{
  Bindings: Bindings;
}>();

healthRouter.get("/db", async (c) => {
  try {
    const prisma = createPrisma(c.env.HYPERDRIVE.connectionString);
    await prisma.$queryRaw`SELECT 1`;

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
      },
      500
    );
  }
});
