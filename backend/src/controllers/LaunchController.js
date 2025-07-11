const { asyncHandler, successResponse, errorResponse } = require("../shared/utils/helpers");

class LaunchController {
  constructor(launchService) {
    this.launchService = launchService;
  }

  httpGetAllLaunches = asyncHandler(async (req, res) => {
    const result = await this.launchService.getAllLaunches();

    if (result.success) {
      successResponse(res, result.data, "Launches retrieved successfully");
    } else {
      errorResponse(res, new Error(result.error), 500);
    }
  });

  httpScheduleLaunch = asyncHandler(async (req, res) => {
    const launchData = req.body;
    const result = await this.launchService.scheduleLaunch(launchData);

    if (result.success) {
      successResponse(res, result.data, "Launch scheduled successfully", 201);
    } else {
      errorResponse(res, new Error(result.error), 400);
    }
  });

  httpAbortLaunch = asyncHandler(async (req, res) => {
    const flightNumber = Number(req.params.id);

    if (isNaN(flightNumber)) {
      return errorResponse(res, new Error("Invalid flight number"), 400);
    }

    const result = await this.launchService.abortLaunch(flightNumber);

    if (result.success) {
      successResponse(res, null, result.message);
    } else {
      errorResponse(res, new Error(result.error), 404);
    }
  });
}

module.exports = { LaunchController };
