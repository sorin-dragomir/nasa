// Dependency injection container
const { LaunchService } = require("../services/LaunchService");
const { PlanetService } = require("../services/PlanetService");
const { SpaceXApiService } = require("../services/SpaceXApiService");
const { ChatbotService } = require("../services/ChatbotService");

// Controllers
const { LaunchController } = require("../controllers/LaunchController");
const { PlanetController } = require("../controllers/PlanetController");
const { ChatbotController } = require("../controllers/ChatbotController");

class Container {
  constructor() {
    this.dependencies = new Map();
    this._setupDependencies();
  }

  _setupDependencies() {
    // Services
    this.dependencies.set("launchService", new LaunchService());
    this.dependencies.set("planetService", new PlanetService());
    this.dependencies.set("spaceXService", new SpaceXApiService());
    this.dependencies.set("chatbotService", new ChatbotService());

    // Controllers
    this.dependencies.set("launchController", new LaunchController(this.get("launchService")));
    this.dependencies.set("planetController", new PlanetController(this.get("planetService")));
    this.dependencies.set("chatbotController", new ChatbotController(this.get("chatbotService")));
  }

  get(name) {
    if (!this.dependencies.has(name)) {
      throw new Error(`Dependency ${name} not found`);
    }
    return this.dependencies.get(name);
  }

  set(name, dependency) {
    this.dependencies.set(name, dependency);
  }
}

module.exports = { Container };
