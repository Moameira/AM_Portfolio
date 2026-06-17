import { Redis } from "@upstash/redis";
import { defaultContent } from "./default-content";

const CONTENT_KEY = "portfolio:content:v1";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

export async function getPortfolioContent() {
  const redis = getRedis();

  if (!redis) {
    return defaultContent;
  }

  const saved = await redis.get(CONTENT_KEY);
  return saved || defaultContent;
}

export async function savePortfolioContent(content) {
  const redis = getRedis();

  if (!redis) {
    throw new Error("Redis is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.");
  }

  await redis.set(CONTENT_KEY, content);
  return content;
}
