import { Hono } from 'hono'
import { verify} from 'hono/jwt'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'
import { healthRouter } from './routes/healths'

type Bindings = {
  JWT_SECRET: string,
  HYPERDRIVE: Hyperdrive
}

type Variables = {
  userId: string
}
const app = new Hono<{
  Bindings:Bindings,
  Variables: Variables
}>()
app.use('*', cors());

// temparary endpoint:

app.route("/health", healthRouter);

app.route("/api/v1/users", userRouter);

app.route("/api/v1/blogs", blogRouter);


app.get("/", c => c.text("Welcome to BlogWeb API"));

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

