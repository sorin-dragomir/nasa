const { PlanetController } = require('../src/controllers/PlanetController');
const {
  planetMockRequest,
  planetMockResponse,
  mockGetAllPlanetsResponse,
  mockPlanetErrorResponse
} = require('./mocks/planetMocks');

// Mock the planet service
const mockPlanetService = {
  getAllPlanets: jest.fn()
};

// Mock the helper functions
jest.mock('../src/shared/utils/helpers', () => ({
  asyncHandler: (fn) => fn,
  successResponse: jest.fn(),
  errorResponse: jest.fn()
}));

const { successResponse, errorResponse } = require('../src/shared/utils/helpers');

describe('PlanetController', () => {
  let planetController;

  beforeEach(() => {
    planetController = new PlanetController(mockPlanetService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('httpGetAllPlanets', () => {
    it('should return all planets successfully', async () => {
      const req = planetMockRequest();
      const res = planetMockResponse();

      mockPlanetService.getAllPlanets.mockResolvedValue(mockGetAllPlanetsResponse);

      await planetController.httpGetAllPlanets(req, res);

      expect(mockPlanetService.getAllPlanets).toHaveBeenCalledTimes(1);
      expect(successResponse).toHaveBeenCalledWith(
        res,
        mockGetAllPlanetsResponse.data,
        "Planets retrieved successfully"
      );
    });

    it('should handle error when getting all planets fails', async () => {
      const req = planetMockRequest();
      const res = planetMockResponse();

      mockPlanetService.getAllPlanets.mockResolvedValue(mockPlanetErrorResponse);

      await planetController.httpGetAllPlanets(req, res);

      expect(mockPlanetService.getAllPlanets).toHaveBeenCalledTimes(1);
      expect(errorResponse).toHaveBeenCalledWith(
        res,
        new Error(mockPlanetErrorResponse.error),
        500
      );
    });

    it('should handle service throwing an error', async () => {
      const req = planetMockRequest();
      const res = planetMockResponse();
      const error = new Error('Database connection failed');

      mockPlanetService.getAllPlanets.mockRejectedValue(error);

      await expect(planetController.httpGetAllPlanets(req, res)).rejects.toThrow('Database connection failed');
      expect(mockPlanetService.getAllPlanets).toHaveBeenCalledTimes(1);
    });
  });
});
