import prisma from "@packages/lib/prisma";
import cron from "node-cron";
import redis from "@packages/lib/redis"; // 👈 Redis import করো

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();

    // 🗑️ Delete product where deletedAt is older than 24 hours
    await prisma.products.deleteMany({
      where: {
        isDeleted: true,
        deletedAt: { lte: now },
      },
    });

    // 💓 Redis keep-alive ping পাঠাও (Upstash কে active রাখতে)
    await redis.set("keep_alive", new Date().toISOString(), "EX", 86400);

    console.log("✅ Cronjob ran successfully & Redis keep-alive sent!");
  } catch (error) {
    console.error("❌ Cronjob error:", error);
  }
});
