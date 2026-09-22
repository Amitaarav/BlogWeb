import z from 'zod';

// runtime validation
export const signUpInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3),
    name: z.string().optional()
})

export const signInInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const createBlogInput = z.object({
    title: z.string().min(1),
    content: z.string().min(1)
})

export const updateBlogInput = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    id: z.string()
})

export const updateProfileInput = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    bio: z.string().optional()
})

// type inference in zod
// frontend and backend need to know the type of the data
export type SignUpInput = z.infer<typeof signUpInput>
export type SignInInput = z.infer<typeof signInInput>
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type UpdateBlogInput = z.infer<typeof updateBlogInput>
export type UpdateProfileInput = z.infer<typeof updateProfileInput>

// Backward compatibility alias
export type createBlogInput = CreateBlogInput
export type updateBlogInput = UpdateBlogInput
