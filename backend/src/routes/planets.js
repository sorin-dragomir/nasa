const express = require("express");

function createPlanetRoutes(planetController) {
  const router = express.Router();

  router.get("/", planetController.httpGetAllPlanets);

  return router;
}

module.exports = { createPlanetRoutes };
