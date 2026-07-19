import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";

async function bootstrap() {
  try {
    await connectDB();
  } catch (err) {
    logger.error("Failed to connect to MongoDB. Server will not start.", err);
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    logger.info(
      `Rakshak server listening on port ${env.port} [${env.nodeEnv}]`
    );
  });

  process.on("unhandledRejection", (err) => {
    logger.error("Unhandled promise rejection:", err);
    server.close(() => process.exit(1));
  });
}

bootstrap();