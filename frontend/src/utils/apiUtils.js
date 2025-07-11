import { apiClient, API_ENDPOINTS } from "../components/api";

// Launch management functions
export const launchUtils = {
  async getAllLaunches() {
    try {
      const launches = await apiClient.get(API_ENDPOINTS.LAUNCHES);
      return launches.data || [];
    } catch (error) {
      console.error("Error fetching launches:", error);
      return [];
    }
  },

  async scheduleLaunch(launchData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LAUNCHES, launchData);
      return {
        success: true,
        data: response.data,
        message: response.message || "Launch scheduled successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  async abortLaunch(flightNumber) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.LAUNCHES}/${flightNumber}`);
      return {
        success: true,
        message: response.message || "Launch aborted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Filter functions
  getUpcomingLaunches(launches) {
    return launches.filter((launch) => launch.upcoming);
  },

  getHistoricalLaunches(launches) {
    return launches.filter((launch) => !launch.upcoming);
  },

  // Sort function
  sortLaunchesByFlightNumber(launches, ascending = true) {
    return [...launches].sort((a, b) => (ascending ? a.flightNumber - b.flightNumber : b.flightNumber - a.flightNumber));
  },
};

// Planet management functions
export const planetUtils = {
  async getAllPlanets() {
    try {
      const planets = await apiClient.get(API_ENDPOINTS.PLANETS);
      return planets.data || [];
    } catch (error) {
      console.error("Error fetching planets:", error);
      return [];
    }
  },

  // Format planet names for display
  formatPlanetName(planetName) {
    return planetName.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  },
};
