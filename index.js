import { FastMCP, GoogleProvider, OAuthProvider } from "fastmcp";
import { z } from "zod"; // Or any validation library that supports Standard Schema
import "dotenv/config"

console.log({
  client_id: process.env.AUTH0_CLIENT_ID,
  client_secret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_AUDIENCE,
  endpoint: process.env.AUTH0_ENDPOINT,
})


const auth = new OAuthProvider({
  authorizationEndpoint: `https://${process.env.AUTH0_ENDPOINT}/authorize`,
  baseUrl: "http://localhost:8000",
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