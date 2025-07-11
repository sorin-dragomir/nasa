// Planet Controller Mocks

const planetMockRequest = (body, params, query) => ({
  body: body || {},
  params: params || {},
  query: query || {}
});

const planetMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Sample planet data for testing
const mockPlanetData = {
  keplerName: "Kepler-442 b",
  stellarEffectiveTemperature: 4402,
  stellarRadius: 0.61,
  stellarMass: 0.61,
  planetaryRadius: 1.34,
  habitableZone: true
};

const mockPlanetDocument = {
  _id: "60263f14648fed5246e322d1",
  keplerName: "Kepler-442 b",
  stellarEffectiveTemperature: 4402,
  stellarRadius: 0.61,
  stellarMass: 0.61,
  planetaryRadius: 1.34,
  habitableZone: true,
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01")
};

const mockPlanetsArray = [
  {
    _id: "60263f14648fed5246e322d1",
    keplerName: "Kepler-442 b",
    stellarEffectiveTemperature: 4402,
    stellarRadius: 0.61,
    stellarMass: 0.61,
    planetaryRadius: 1.34,
    habitableZone: true
  },
  {
    _id: "60263f14648fed5246e322d2",
    keplerName: "Kepler-452 b",
    stellarEffectiveTemperature: 5757,
    stellarRadius: 1.11,
    stellarMass: 1.04,
    planetaryRadius: 1.63,
    habitableZone: true
  },
  {
    _id: "60263f14648fed5246e322d3",
    keplerName: "Kepler-1649 c",
    stellarEffectiveTemperature: 3240,
    stellarRadius: 0.234,
    stellarMass: 0.198,
    planetaryRadius: 1.06,
    habitableZone: true
  }
];

const mockGetAllPlanetsResponse = {
  success: true,
  data: mockPlanetsArray
};

const mockPlanetErrorResponse = {
  success: false,
  error: "Failed to fetch planets"
};

module.exports = {
  planetMockRequest,
  planetMockResponse,
  mockPlanetData,
  mockPlanetDocument,
  mockPlanetsArray,
  mockGetAllPlanetsResponse,
  mockPlanetErrorResponse
};
