import { createBlogInput, updateBlogInput } from "@amitaarav/blog-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// Authentication Middleware
blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ message: "You are not logged in" }, 403);
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = await verify(token, c.env.JWT_SECRET);
    
    if (!user || typeof user !== "object" || !("id" in user) || typeof user.id !== "string") {
      return c.json({ message: "Invalid token" }, 403);
    }

    c.set("userId", user.id);
    await next();
  } catch (e) {
    console.error("Token verification failed:", e);
    return c.json({ message: "Token verification failed" }, 403);
  }
});

// POST: Create Blog
blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);

  if (!success) {
    return c.json({ message: "Invalid blog data" }, 411);
  }

  const userId = c.get("userId");
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json({ id: blog.id, blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    return c.json({ message: "Failed to create blog" }, 500);
  }
});

// POST: Upload Blog Images
blogRouter.post("/:id/images", async (c) => {
  const blogId = c.req.param("id");
  const userId = c.get("userId");
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    // Verify blog ownership
    const blog = await prisma.blog.findFirst({
      where: {
        id: blogId,
        authorId: userId,
      },
    });

    if (!blog) {
      return c.json({ message: "Blog not found or unauthorized" }, 404);
    }

    // Handle image upload here
    // You'll need to implement the actual image storage logic
    // This could be to a cloud storage service like AWS S3, Cloudinary, etc.

    return c.json({ message: "Images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading images:", error);
    return c.json({ message: "Failed to upload images" }, 500);
  }
});

// PUT: Update Blog
blogRouter.put("/update", async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);

  if (!success) {
    return c.json({ message: "Inputs not correct" }, 411);
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  const blog = await prisma.blog.update({
    where: { id: body.id },
    data: { title: body.title, content: body.content },
  });

  return c.json({ blog });
});

// GET: Fetch All Blogs (bulk)
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  const blogs = await prisma.blog.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      author: {
        select: { name: true },
      },
    },
  });

  return c.json({ blogs });
});

// GET: Fetch Single Blog
blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findFirst({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: { name: true },
        },
      },
    });

    if (!blog) {
      return c.json({ message: "Blog not found" }, 404);
    }

    return c.json({ blog });
  } catch (e) {
    console.error("Error fetching blog:", e);
    return c.json({ message: "Error while fetching blog post" }, 500);
  }
});
