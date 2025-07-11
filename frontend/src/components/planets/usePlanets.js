import { useState, useEffect, useCallback } from "react";
import { planetService } from "./planetService";

export const usePlanets = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPlanets = useCallback(async () => {
    try {
      setLoading(true);
      const result = await planetService.getAllPlanets();

      if (result.success) {
        setPlanets(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlanets();
  }, [loadPlanets]);

  return {
    planets,
    loading,
    error,
    refreshPlanets: loadPlanets,
  };
};
