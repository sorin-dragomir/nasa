const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const PlanetModel = require("../models/planet");
const logger = require("../shared/utils/logger");

class PlanetEntity {
  constructor(keplerName) {
    if (!keplerName || typeof keplerName !== "string") {
      throw new Error("Planet must have a valid keplerName");
    }
    this.keplerName = keplerName;
  }

  static fromCsvData(csvData) {
    return new PlanetEntity(csvData.kepler_name);
  }

  toJSON() {
    return {
      keplerName: this.keplerName,
    };
  }
}

class PlanetService {
  async findAll() {
    try {
      const planets = await PlanetModel.find({}, { _id: 0, __v: 0 });
      return planets.map((planet) => new PlanetEntity(planet.keplerName));
    } catch (error) {
      logger.error("Error finding all planets:", error);
      throw error;
    }
  }

  async findByKeplerName(keplerName) {
    try {
      const planet = await PlanetModel.findOne({ keplerName }, { _id: 0, __v: 0 });
      return planet ? new PlanetEntity(planet.keplerName) : null;
    } catch (error) {
      logger.error(`Error finding planet ${keplerName}:`, error);
      throw error;
    }
  }

  async save(planet) {
    try {
      await PlanetModel.findOneAndUpdate({ keplerName: planet.keplerName }, planet.toJSON(), { upsert: true });
      return planet;
    } catch (error) {
      logger.error("Error saving planet:", error);
      throw error;
    }
  }

  async loadFromCsv(csvPath) {
    return new Promise((resolve, reject) => {
      const habitablePlanets = [];

      fs.createReadStream(csvPath)
        .pipe(
          parse({
            comment: "#",
            columns: true,
          })
        )
        .on("data", (data) => {
          if (this.isHabitablePlanet(data)) {
            habitablePlanets.push(data);
          }
        })
        .on("error", (err) => {
          logger.error("Error reading CSV file:", err);
          reject(err);
        })
        .on("end", async () => {
          try {
            logger.info(`${habitablePlanets.length} habitable planets found!`);

            // Save planets to database
            for (const planetData of habitablePlanets) {
              const planet = PlanetEntity.fromCsvData(planetData);
              await this.save(planet);
            }

            resolve(habitablePlanets);
          } catch (error) {
            logger.error("Error saving planets to database:", error);
            reject(error);
          }
        });
    });
  }

  async getHabitablePlanets() {
    try {
      const planets = await PlanetModel.find({}, { _id: 0, __v: 0 });
      return planets.map((planet) => planet.keplerName);
    } catch (error) {
      logger.error("Error getting habitable planets:", error);
      throw error;
    }
  }

  async getAllPlanets() {
    try {
      const planets = await this.getHabitablePlanets();
      return {
        success: true,
        data: planets,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  isHabitablePlanet(planet) {
    return planet["koi_disposition"] === "CONFIRMED" && planet["koi_insol"] > 0.36 && planet["koi_insol"] < 1.11 && planet["koi_prad"] < 1.6;
  }
}

module.exports = { PlanetService };
