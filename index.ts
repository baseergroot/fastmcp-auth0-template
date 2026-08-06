import { FastMCP, OAuthProvider } from "fastmcp";
import { z } from "zod"; // Or any validation library that supports Standard Schema
import "dotenv/config"

const {authorizationEndpoint, baseUrl, clientId, clientSecret, tokenEndpoint} = {
  authorizationEndpoint: `https://${process.env.AUTH0_ENDPOINT}/authorize`,
  baseUrl: process.env.BASE_URL,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  tokenEndpoint: `https://${process.env.AUTH0_ENDPOINT}/oauth/token`,
}

if(!authorizationEndpoint || !baseUrl || !clientId || !clientSecret || !tokenEndpoint) {
  throw new Error("Missing required environment variables")
}

const auth = new OAuthProvider({
  authorizationEndpoint,
  baseUrl,
  clientId,
  clientSecret,
  scopes: ["openid", "profile"],
  tokenEndpoint
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