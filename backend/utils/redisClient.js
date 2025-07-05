import { Redis } from "ioredis";

export const client = new Redis();
export const redisPub = new Redis();
export const redisSub = new Redis();