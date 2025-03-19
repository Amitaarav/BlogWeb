import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signUpInput, signInInput } from "@amitaarav/blog-common";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const { success } = signUpInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    try {
        const user = await prisma.user.create({
            data: {
                username: body.username,
                email:body.email,
                password: body.password
        }
        })
        const jwt = await sign({
        id: user.id
        }, c.env.JWT_SECRET);
        
        return c.text(jwt)
    } catch(e) {
        console.log(e);
        c.status(411);
        return c.text('Invalid')
    }
    })
    
    
    userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const { success } = signInInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    try {
        const user = await prisma.user.findFirst({
        where: {
            email: body.email,
            password: body.password,
        }
        })
        if (!user) {
        c.status(403);
        return c.json({
            message: "Incorrect creds"
        })
        }
        const token = await sign({
        id: user.id
        }, c.env.JWT_SECRET);
        return c.text(token)
        } catch(e) {
            console.log(e);
            c.status(411);
            return c.text('Invalid')
    }
    })