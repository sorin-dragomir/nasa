// Launch Controller Mocks

const launchMockRequest = (body, params, query) => ({
  body: body || {},
  params: params || {},
  query: query || {}
});

const launchMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Sample launch data for testing
const mockLaunchData = {
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: "December 27, 2030",
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
  flightNumber: 100
};

const mockLaunchDocument = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true
};

const mockLaunchesArray = [
  {
    flightNumber: 100,
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date("December 27, 2030"),
    target: "Kepler-442 b",
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true
  },
  {
    flightNumber: 101,
    mission: "Artemis Moon Base",
    rocket: "SLS Block 2",
    launchDate: new Date("January 15, 2031"),
    target: "Moon",
    customers: ["NASA", "ESA"],
    upcoming: true,
    success: true
  }
];

const mockScheduleResponse = {
  success: true,
  data: mockLaunchDocument,
  message: "Launch scheduled successfully"
};

const mockAbortResponse = {
  success: true,
  message: "Launch aborted successfully"
};

const mockGetAllResponse = {
  success: true,
  data: mockLaunchesArray
};

const mockErrorResponse = {
  success: false,
  error: "Launch not found"
};

module.exports = {
  launchMockRequest,
  launchMockResponse,
  mockLaunchData,
  mockLaunchDocument,
  mockLaunchesArray,
  mockScheduleResponse,
  mockAbortResponse,
  mockGetAllResponse,
  mockErrorResponse
};
