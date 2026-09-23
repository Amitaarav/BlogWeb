import { Hono } from "hono";
import { createPrisma } from "../../lib/prisma";
import { sign, verify } from "hono/jwt";
import bcrypt from "bcryptjs";
import { signUpInput, signInInput, updateProfileInput } from "@amitaarav/blog-common";
import type { Bindings, Variables } from "../../types/env";

export const userRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

// User Signup with Bcrypt password hashing
userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const { success } = signUpInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const prisma = createPrisma(c.env.HYPERDRIVE.connectionString);

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email: body.email },
    });

    if (existingUser) {
      c.status(409);
      return c.json({ message: "User already exists with this email" });
    }

    // Hash password with bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        name: body.name || body.username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
      },
    });

    const token = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    return c.json({
      token,
      user,
      jwt: token, // backwards-compatibility
    });
  } catch (e) {
    console.error("Signup error:", e);
    c.status(500);
    return c.json({ message: "Error while signing up" });
  }
});

// User Signin with Bcrypt verification
userRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  const { success } = signInInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const prisma = createPrisma(c.env.HYPERDRIVE.connectionString);

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        password: true,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({
        message: "Incorrect credentials",
      });
    }

    // Compare password using bcrypt
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(body.password, user.password);
    } catch {
      isPasswordValid = false;
    }

    // Graceful fallback for legacy accounts that had plaintext passwords
    if (!isPasswordValid && user.password === body.password) {
      isPasswordValid = true;
      // Transparently upgrade to bcrypt hash
      try {
        const upgradedHash = await bcrypt.hash(body.password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: upgradedHash },
        });
      } catch (upgradeErr) {
        console.warn("Failed to upgrade legacy password:", upgradeErr);
      }
    }

    if (!isPasswordValid) {
      c.status(403);
      return c.json({
        message: "Incorrect credentials",
      });
    }

    const token = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
      jwt: token, // backwards-compatibility
    });
  } catch (e) {
    console.error("Signin error:", e);
    c.status(500);
    return c.json({ message: "Error while signing in" });
  }
});

// Get Current User Profile
userRouter.get("/me", async (c) => {
  const authHeader = c.req.header("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload || typeof payload !== "object" || !("id" in payload)) {
      c.status(401);
      return c.json({ message: "Invalid token" });
    }

    const prisma = createPrisma(c.env.HYPERDRIVE.connectionString);

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ message: "User not found" });
    }

    return c.json({ user });
  } catch (e) {
    console.error("Fetch me error:", e);
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }
});

// Update User Profile
userRouter.put("/profile", async (c) => {
  const authHeader = c.req.header("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload || typeof payload !== "object" || !("id" in payload)) {
      c.status(401);
      return c.json({ message: "Invalid token" });
    }

    const body = await c.req.json();
    const { success } = updateProfileInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ message: "Invalid profile inputs" });
    }

    const prisma = createPrisma(c.env.HYPERDRIVE.connectionString);

    const updatedUser = await prisma.user.update({
      where: { id: payload.id as string },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.username !== undefined ? { username: body.username } : {}),
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
      },
    });

    return c.json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (e) {
    console.error("Profile update error:", e);
    c.status(500);
    return c.json({ message: "Failed to update profile" });
  }
});
