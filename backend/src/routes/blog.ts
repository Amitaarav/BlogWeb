import { createBlogInput, updateBlogInput } from "@amitaarav/blog-common";
import { createPrisma } from "../lib/prisma";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { Bindings, Variables } from "../types/env";

export const blogRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

// Helper middleware for strictly protected routes
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization") || "";
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    c.status(403);
    return c.json({ message: "You are not logged in" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = await verify(token, c.env.JWT_SECRET);
    
    if (!user || typeof user !== "object" || !("id" in user) || typeof user.id !== "string") {
      c.status(403);
      return c.json({ message: "Invalid token" });
    }

    c.set("userId", user.id);
    await next();
  } catch (e) {
    console.error("Token verification failed:", e);
    c.status(403);
    return c.json({ message: "Token verification failed" });
  }
};

// GET: Fetch All Blogs (bulk)
blogRouter.get("/bulk", async (c) => {
  const prisma = createPrisma(c.env.HYPERDRIVE.connectionString);

  try {
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        authorId: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return c.json({ blogs });
  } catch (e) {
    console.error("Error fetching blogs bulk:", e);
    c.status(500);
    return c.json({ message: "Error while fetching blogs" });
  }
});

// GET: Fetch Single Blog
blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = createPrisma(c.env.HYPERDRIVE.connectionString);
  try {
    const blog = await prisma.blog.findFirst({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        authorId: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (!blog) {
      c.status(404);
      return c.json({ message: "Blog not found" });
    }

    return c.json({ blog });
  } catch (e) {
    console.error("Error fetching blog:", e);
    c.status(500);
    return c.json({ message: "Error while fetching blog post" });
  }
});

// POST: Create Blog (Protected)
blogRouter.post("/", authMiddleware, async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({ message: "Invalid blog data: title and content are required" });
  }

  const userId = c.get("userId");
  const prisma = createPrisma(c.env.HYPERDRIVE.connectionString);
  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return c.json({ id: blog.id, blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    c.status(500);
    return c.json({ message: "Failed to create blog" });
  }
});

// PUT: Update Blog (Protected with Author Check)
const handleUpdate = async (c: any) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);

  if (!success || !body.id) {
    c.status(411);
    return c.json({ message: "Inputs not correct. Blog ID is required." });
  }

  const userId = c.get("userId");
  const prisma = createPrisma(c.env.HYPERDRIVE.connectionString);
  try {
    const existingBlog = await prisma.blog.findUnique({
      where: { id: body.id }
    });

    if (!existingBlog) {
      c.status(404);
      return c.json({ message: "Blog not found" });
    }

    if (existingBlog.authorId !== userId) {
      c.status(403);
      return c.json({ message: "Unauthorized: You can only edit your own blogs" });
    }

    const blog = await prisma.blog.update({
      where: { id: body.id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.content !== undefined ? { content: body.content } : {}),
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      }
    });

    return c.json({ blog, message: "Blog updated successfully" });
  } catch (error) {
    console.error("Error updating blog:", error);
    c.status(500);
    return c.json({ message: "Failed to update blog" });
  }
};

blogRouter.put("/", authMiddleware, handleUpdate);
blogRouter.put("/update", authMiddleware, handleUpdate);

// DELETE: Delete Blog (Protected with Author Check)
blogRouter.delete("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const prisma = createPrisma(c.env.HYPERDRIVE.connectionString);
  try {
    const existingBlog = await prisma.blog.findUnique({
      where: { id }
    });

    if (!existingBlog) {
      c.status(404);
      return c.json({ message: "Blog not found" });
    }

    if (existingBlog.authorId !== userId) {
      c.status(403);
      return c.json({ message: "Unauthorized: You can only delete your own blogs" });
    }

    await prisma.blog.delete({
      where: { id }
    });

    return c.json({ message: "Blog deleted successfully", id });
  } catch (error) {
    console.error("Error deleting blog:", error);
    c.status(500);
    return c.json({ message: "Failed to delete blog" });
  }
});

