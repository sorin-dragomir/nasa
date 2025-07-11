const LaunchModel = require("../models/launch");
const PlanetModel = require("../models/planet");
const logger = require("../shared/utils/logger");

class LaunchEntity {
  constructor({ flightNumber, mission, rocket, launchDate, target, customers = [], upcoming, success = true }) {
    // Validation
    if (!flightNumber || flightNumber < 1) {
      throw new Error("Flight number must be a positive integer");
    }
    if (!mission || typeof mission !== "string") {
      throw new Error("Mission must be a valid string");
    }
    if (!rocket || typeof rocket !== "string") {
      throw new Error("Rocket must be a valid string");
    }
    if (!launchDate || !(launchDate instanceof Date)) {
      throw new Error("Launch date must be a valid Date object");
    }
    if (!target || typeof target !== "string") {
      throw new Error("Target must be a valid string");
    }

    this.flightNumber = flightNumber;
    this.mission = mission;
    this.rocket = rocket;
    this.launchDate = launchDate;
    this.target = target;
    this.customers = customers;
    // If upcoming is explicitly provided, use it; otherwise determine based on launch date
    if (upcoming !== undefined) {
      this.upcoming = upcoming;
    } else {
      // Consider launches for today or future dates as upcoming
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of today
      this.upcoming = this.launchDate >= today;
    }
    this.success = success;
  }

  abort() {
    this.upcoming = false;
    this.success = false;
  }

  isAborted() {
    return !this.upcoming && !this.success;
  }

  // Method to recalculate upcoming status based on current date
  updateUpcomingStatus() {
    // Only update if the launch hasn't been aborted
    if (this.success) {
      // Consider launches for today or future dates as upcoming
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of today
      this.upcoming = this.launchDate >= today;
    }
    return this;
  }

  isUpcoming() {
    return this.upcoming;
  }

  isHistorical() {
    return !this.upcoming;
  }

  toJSON() {
    return {
      flightNumber: this.flightNumber,
      mission: this.mission,
      rocket: this.rocket,
      launchDate: this.launchDate,
      target: this.target,
      customers: this.customers,
      upcoming: this.upcoming,
      success: this.success,
    };
  }
}

class LaunchService {
  async findAll() {
    try {
      const launches = await LaunchModel.find({}, { _id: 0, __v: 0 });
      return launches.map((launch) => new LaunchEntity(launch));
    } catch (error) {
      logger.error("Error finding all launches:", error);
      throw error;
    }
  }

  async findByFlightNumber(flightNumber) {
    try {
      const launch = await LaunchModel.findOne({ flightNumber }, { _id: 0, __v: 0 });
      return launch ? new LaunchEntity(launch) : null;
    } catch (error) {
      logger.error(`Error finding launch with flight number ${flightNumber}:`, error);
      throw error;
    }
  }

  async save(launch) {
    try {
      logger.info(`Saving launch with flight number: ${launch.flightNumber}`);
      await LaunchModel.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch.toJSON(), { upsert: true });
      logger.info(`Launch ${launch.flightNumber} saved successfully`);
      return launch;
    } catch (error) {
      logger.error("Error saving launch:", error);
      throw error;
    }
  }

  async update(flightNumber, updateData) {
    try {
      const result = await LaunchModel.updateOne({ flightNumber }, updateData);
      return result.modifiedCount === 1;
    } catch (error) {
      logger.error(`Error updating launch ${flightNumber}:`, error);
      throw error;
    }
  }

  async getLatestFlightNumber() {
    try {
      const latestLaunch = await LaunchModel.findOne().sort("-flightNumber");
      return latestLaunch ? latestLaunch.flightNumber : 99; // Start from 100
    } catch (error) {
      logger.error("Error getting latest flight number:", error);
      throw error;
    }
  }

  async getAllLaunches() {
    try {
      const launches = await this.findAll();
      // Update the upcoming status based on current date
      const updatedLaunches = launches.map((launch) => launch.updateUpcomingStatus());
      return {
        success: true,
        data: updatedLaunches
      };
    } catch (error) {
      logger.error("Error in getAllLaunches:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async validatePlanet(targetPlanet) {
    try {
      const planet = await PlanetModel.findOne({ keplerName: targetPlanet });
      return planet !== null;
    } catch (error) {
      logger.error(`Error validating planet ${targetPlanet}:`, error);
      return false;
    }
  }

  async scheduleLaunch(launchData) {
    try {
      // Validate input
      if (!launchData.mission || !launchData.rocket || !launchData.launchDate || !launchData.target) {
        throw new Error("Missing required launch data");
      }

      // Convert string date to Date object (treats as local date)
      const launchDate = new Date(launchData.launchDate + "T12:00:00"); // Set to noon to avoid timezone issues
      if (isNaN(launchDate.getTime())) {
        throw new Error("Invalid launch date");
      }

      // Check if target planet exists
      const planetExists = await this.validatePlanet(launchData.target);
      if (!planetExists) {
        throw new Error(`Planet ${launchData.target} not found`);
      }

      // Get next flight number
      const latestFlightNumber = await this.getLatestFlightNumber();
      const newFlightNumber = latestFlightNumber + 1;

      const launch = new LaunchEntity({
        flightNumber: newFlightNumber,
        mission: launchData.mission,
        rocket: launchData.rocket,
        launchDate,
        target: launchData.target,
        customers: launchData.customers || ["NASA", ""],
        upcoming: true,
        success: true
      });

      await this.save(launch);

      return {
        success: true,
        data: launch,
        message: "Launch scheduled successfully"
      };
    } catch (error) {
      logger.error("Error in scheduleLaunch:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async abortLaunch(flightNumber) {
    try {
      const launch = await this.findByFlightNumber(flightNumber);
      
      if (!launch) {
        return {
          success: false,
          error: `Launch with flight number ${flightNumber} not found`
        };
      }

      const success = await this.update(flightNumber, {
        upcoming: false,
        success: false
      });

      if (success) {
        return {
          success: true,
          message: `Launch ${flightNumber} aborted successfully`
        };
      } else {
        return {
          success: false,
          error: "Failed to abort launch"
        };
      }
    } catch (error) {
      logger.error("Error in abortLaunch:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createLaunch(launchData) {
    try {
      const launch = new LaunchEntity(launchData);
      await this.save(launch);
      return {
        success: true,
        data: launch,
        message: "Launch created successfully"
      };
    } catch (error) {
      logger.error("Error in createLaunch:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = { LaunchService };
