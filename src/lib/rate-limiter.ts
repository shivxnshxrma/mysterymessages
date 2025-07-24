import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize the Redis client from Vercel's environment variables
const redis = Redis.fromEnv();

// Create a new ratelimiter, that allows 5 requests per 10 seconds
export const rateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
  prefix: "mystery_messages_ratelimit",
});
