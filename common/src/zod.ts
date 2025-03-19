import z from 'zod';

// this is runtime validation
export const signUpInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(4)
})

export const signInInput = z.object({
    email:z.string().email(),
    password: z.string().min(6)
})

export const createBlogInput = z.object({
    title: z.string(),
    content:z.string()
})

export const updateBlogInput = z.object({
    title: z.string(),
    content:z.string(),
    id:z.string()
})

// type inference in zod
// frontend need to know the type of the data
export type SignUpInput = z.infer<typeof signUpInput>
export type SignInInput = z.infer<typeof signInInput>
export type createBlogInput = z.infer<typeof createBlogInput>
export type updateBlogInput = z.infer<typeof updateBlogInput>
