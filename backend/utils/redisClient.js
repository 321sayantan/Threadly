import { Redis } from "ioredis";

const hostIP = process.env.PRODUCTION === "1" ? process.env.HOST_IP : "localhost";

export const client = new Redis({
  host: hostIP,
  port: process.env.REDIS_PORT,
  ...(process.env.PRODUCTION === "1" && { password: process.env.REDIS_PASSWORD }),
});
export const redisPub = new Redis({
  host: hostIP,
  port: process.env.REDIS_PORT,
  ...(process.env.PRODUCTION === "1" && { password: process.env.REDIS_PASSWORD }),
});
export const redisSub = new Redis({
  host: hostIP,
  port: process.env.REDIS_PORT,
  ...(process.env.PRODUCTION === "1" && { password: process.env.REDIS_PASSWORD }),
});