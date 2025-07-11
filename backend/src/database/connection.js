const mongoose = require("mongoose");
const logger = require("../shared/utils/logger");

class DatabaseConnection {
  constructor() {
    this.connection = null;
  }

  async connect(uri) {
    try {
      logger.info("Connecting to MongoDB...");
      this.connection = await mongoose.connect(uri);
      logger.info("MongoDB connected successfully");
      return this.connection;
    } catch (error) {
      logger.error("MongoDB connection failed:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        logger.info("MongoDB disconnected");
      }
    } catch (error) {
      logger.error("MongoDB disconnection failed:", error);
      throw error;
    }
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = { DatabaseConnection };
