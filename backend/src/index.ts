import { Hono } from "hono";
import { verify } from "hono/jwt";
import { cors } from "hono/cors";
import { userRouter } from "./features/user";
import { blogRouter } from "./features/blog";
import { healthRouter } from "./features/health";

type Bindings = {
  JWT_SECRET: string;
  HYPERDRIVE: Hyperdrive;
};

type Variables = {
  userId: string;
};

const app = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

app.options("*", cors());
app.use("*", cors());

// Health check endpoint
app.route("/health", healthRouter);

// User / Auth endpoint
app.route("/api/v1/users", userRouter);

// Blog endpoint
app.route("/api/v1/blogs", blogRouter);

app.get("/", (c) => c.text("Welcome to BlogWeb API"));

app.use("/message/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  const response = await verify(authHeader, c.env.JWT_SECRET);
  if (response.id) {
    await next();
  } else {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }
});

export default app;
