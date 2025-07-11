const { asyncHandler, successResponse, errorResponse } = require("../shared/utils/helpers");

class PlanetController {
  constructor(planetService) {
    this.planetService = planetService;
  }

  httpGetAllPlanets = asyncHandler(async (req, res) => {
    const result = await this.planetService.getAllPlanets();

    if (result.success) {
      successResponse(res, result.data, "Planets retrieved successfully");
    } else {
      errorResponse(res, new Error(result.error), 500);
    }
  });
}

module.exports = { PlanetController };
