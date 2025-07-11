import { apiClient, API_ENDPOINTS } from "../api";

export class LaunchService {
  async getAllLaunches() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LAUNCHES);
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async scheduleLaunch(launchData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LAUNCHES, launchData);
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async abortLaunch(flightNumber) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.LAUNCHES}/${flightNumber}`);
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const launchService = new LaunchService();
