const express = require("express");

function createLaunchRoutes(launchController) {
  const router = express.Router();

  router.get("/", launchController.httpGetAllLaunches);
  router.post("/", launchController.httpScheduleLaunch);
  router.delete("/:id", launchController.httpAbortLaunch);

  return router;
}

module.exports = { createLaunchRoutes };
