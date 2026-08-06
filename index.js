import { FastMCP, OAuthProvider } from "fastmcp";
import { z } from "zod"; // Or any validation library that supports Standard Schema
import "dotenv/config"


const auth = new OAuthProvider({
  authorizationEndpoint: `https://${process.env.AUTH0_ENDPOINT}/authorize`,
  baseUrl: process.env.BASE_URL,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scopes: ["openid", "profile"],
  tokenEndpoint: `https://${process.env.AUTH0_ENDPOINT}/oauth/token`,
})

const server = new FastMCP({
  auth,
  name: "My Server",
  version: "1.0.0",
});

const app = server.getApp()

app.get("/", (c) => {
  return c.json({ message: "Hello World" })
})

server.addTool({
  name: "add",
  description: "Add two numbers",
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async (args) => {
    return String(args.a + args.b);
  },
});

server.start({
  transportType: "httpStream",
  httpStream: {
    port: 8000,
  },
});

export default server