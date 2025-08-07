import { Redis } from "ioredis";

export const client = new Redis({
  host: process.env.HOST_IP,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
export const redisPub = new Redis({
  host: process.env.HOST_IP,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
export const redisSub = new Redis({
  host: process.env.HOST_IP,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});