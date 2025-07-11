import { apiClient, API_ENDPOINTS } from "../api";

export class PlanetService {
  async getAllPlanets() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PLANETS);
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
}

export const planetService = new PlanetService();
