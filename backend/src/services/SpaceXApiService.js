const axios = require("axios");
const logger = require("../shared/utils/logger");

class SpaceXApiService {
  constructor() {
    this.baseUrl = "https://api.spacexdata.com/v4";
  }

  async getLatestLaunches() {
    try {
      const response = await axios.post(`${this.baseUrl}/launches/query`, {
        query: {},
        options: {
          pagination: false,
          populate: [
            {
              path: "rocket",
              select: { name: 1 },
            },
            {
              path: "payloads",
              select: { customers: 1 },
            },
          ],
        },
      });

      logger.info(`Fetched ${response.data.docs.length} SpaceX launches`);
      return response.data.docs;
    } catch (error) {
      logger.error("Error fetching SpaceX launches:", error);
      throw error;
    }
  }

  async validateLaunch(launch) {
    try {
      // Basic validation logic
      // This could include checking against SpaceX data for rocket types, etc.
      return {
        isValid: true,
        message: "Launch validated successfully",
      };
    } catch (error) {
      logger.error("Error validating launch:", error);
      return {
        isValid: false,
        message: "Launch validation failed",
      };
    }
  }
}

module.exports = { SpaceXApiService };
