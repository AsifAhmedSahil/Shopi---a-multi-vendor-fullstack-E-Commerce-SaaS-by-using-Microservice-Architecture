import prisma from "@packages/lib/prisma";
import cron from "node-cron";
import redis from "@packages/lib/redis"; // 👈 Redis import করো

console.log("🟢 Cron job file loaded!");


cron.schedule("0,10,20,30,40,50 * * * *", async () => {
  try {
    const now = new Date();

   

    // 💓 Redis keep-alive ping পাঠাও (Upstash কে active রাখতে)
    await redis.set("keep_alive", new Date().toISOString(), "EX", 86400);

    console.log("✅ Cronjob ran successfully & Redis keep-alive sent!");
  } catch (error) {
    console.error("❌ Cronjob error:", error);
  }
});
