const { LaunchController } = require('../src/controllers/LaunchController');
const {
  launchMockRequest,
  launchMockResponse,
  mockLaunchData,
  mockScheduleResponse,
  mockAbortResponse,
  mockGetAllResponse,
  mockErrorResponse
} = require('./mocks/launchMocks');

// Mock the launch service
const mockLaunchService = {
  getAllLaunches: jest.fn(),
  scheduleLaunch: jest.fn(),
  abortLaunch: jest.fn()
};

// Mock the helper functions
jest.mock('../src/shared/utils/helpers', () => ({
  asyncHandler: (fn) => fn,
  successResponse: jest.fn(),
  errorResponse: jest.fn()
}));

const { successResponse, errorResponse } = require('../src/shared/utils/helpers');

describe('LaunchController', () => {
  let launchController;

  beforeEach(() => {
    launchController = new LaunchController(mockLaunchService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('httpGetAllLaunches', () => {
    it('should return all launches successfully', async () => {
      const req = launchMockRequest();
      const res = launchMockResponse();

      mockLaunchService.getAllLaunches.mockResolvedValue(mockGetAllResponse);

      await launchController.httpGetAllLaunches(req, res);

      expect(mockLaunchService.getAllLaunches).toHaveBeenCalledTimes(1);
      expect(successResponse).toHaveBeenCalledWith(
        res,
        mockGetAllResponse.data,
        "Launches retrieved successfully"
      );
    });

    it('should handle error when getting all launches fails', async () => {
      const req = launchMockRequest();
      const res = launchMockResponse();

      mockLaunchService.getAllLaunches.mockResolvedValue(mockErrorResponse);

      await launchController.httpGetAllLaunches(req, res);

      expect(mockLaunchService.getAllLaunches).toHaveBeenCalledTimes(1);
      expect(errorResponse).toHaveBeenCalledWith(
        res,
        new Error(mockErrorResponse.error),
        500
      );
    });
  });

  describe('httpScheduleLaunch', () => {
    it('should schedule a launch successfully', async () => {
      const req = launchMockRequest(mockLaunchData);
      const res = launchMockResponse();

      mockLaunchService.scheduleLaunch.mockResolvedValue(mockScheduleResponse);

      await launchController.httpScheduleLaunch(req, res);

      expect(mockLaunchService.scheduleLaunch).toHaveBeenCalledWith(mockLaunchData);
      expect(successResponse).toHaveBeenCalledWith(
        res,
        mockScheduleResponse.data,
        "Launch scheduled successfully",
        201
      );
    });

    it('should handle error when scheduling launch fails', async () => {
      const req = launchMockRequest(mockLaunchData);
      const res = launchMockResponse();

      mockLaunchService.scheduleLaunch.mockResolvedValue(mockErrorResponse);

      await launchController.httpScheduleLaunch(req, res);

      expect(mockLaunchService.scheduleLaunch).toHaveBeenCalledWith(mockLaunchData);
      expect(errorResponse).toHaveBeenCalledWith(
        res,
        new Error(mockErrorResponse.error),
        400
      );
    });
  });

  describe('httpAbortLaunch', () => {
    it('should abort a launch successfully', async () => {
      const req = launchMockRequest({}, { id: '100' });
      const res = launchMockResponse();

      mockLaunchService.abortLaunch.mockResolvedValue(mockAbortResponse);

      await launchController.httpAbortLaunch(req, res);

      expect(mockLaunchService.abortLaunch).toHaveBeenCalledWith(100);
      expect(successResponse).toHaveBeenCalledWith(
        res,
        null,
        mockAbortResponse.message
      );
    });

    it('should handle invalid flight number', async () => {
      const req = launchMockRequest({}, { id: 'invalid' });
      const res = launchMockResponse();

      await launchController.httpAbortLaunch(req, res);

      expect(mockLaunchService.abortLaunch).not.toHaveBeenCalled();
      expect(errorResponse).toHaveBeenCalledWith(
        res,
        new Error("Invalid flight number"),
        400
      );
    });

    it('should handle error when aborting launch fails', async () => {
      const req = launchMockRequest({}, { id: '999' });
      const res = launchMockResponse();

      mockLaunchService.abortLaunch.mockResolvedValue(mockErrorResponse);

      await launchController.httpAbortLaunch(req, res);

      expect(mockLaunchService.abortLaunch).toHaveBeenCalledWith(999);
      expect(errorResponse).toHaveBeenCalledWith(
        res,
        new Error(mockErrorResponse.error),
        404
      );
    });
  });
});
