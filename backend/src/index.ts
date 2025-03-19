import { Hono } from 'hono'
import { verify} from 'hono/jwt'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'
const app = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables:{
    userId: string
  }
}>()
app.use('/api/*', cors());
app.route("api/v1/user", userRouter);
app.route("api/v1/blog", blogRouter);

app.use('/message/*', async (c, next) => {
  const authHeader = c.req.header('Authorization')||"";
  const response = await verify(authHeader, c.env.JWT_SECRET);
  if(response.id) {
    next();
  }
  else{
    c.status(401)
    c.json({message: "Unauthorized"})
  }
})

export default app;

