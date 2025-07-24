import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv"; // 1. Import the Vercel KV client

// 2. Create a new ratelimiter, that allows 5 requests per 10 seconds
export const rateLimiter = new Ratelimit({
  redis: kv, // 3. Pass the 'kv' object directly here
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
  prefix: "mystery_messages_ratelimit",
});
