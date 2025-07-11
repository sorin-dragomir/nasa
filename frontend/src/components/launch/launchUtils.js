import { useState, useEffect, useCallback } from "react";
import { launchService } from "./launchService";

export const useLaunchManager = (onSuccessSound, onAbortSound, onFailureSound) => {
  const [launches, setLaunches] = useState([]);
  const [isPendingLaunch, setIsPendingLaunch] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadLaunches = useCallback(async () => {
    try {
      setLoading(true);
      const result = await launchService.getAllLaunches();

      if (result.success) {
        setLaunches(result.data);
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

  const submitLaunch = useCallback(
    async (launchData) => {
      try {
        setIsPendingLaunch(true);
        const result = await launchService.scheduleLaunch(launchData);

        if (result.success) {
          await loadLaunches(); // Refresh the list
          onSuccessSound && onSuccessSound();
          return { success: true, message: result.message };
        } else {
          onFailureSound && onFailureSound();
          return { success: false, error: result.error };
        }
      } catch (err) {
        onFailureSound && onFailureSound();
        return { success: false, error: err.message };
      } finally {
        setIsPendingLaunch(false);
      }
    },
    [loadLaunches, onSuccessSound, onFailureSound]
  );

  const abortLaunch = useCallback(
    async (flightNumber) => {
      try {
        const result = await launchService.abortLaunch(flightNumber);

        if (result.success) {
          await loadLaunches(); // Refresh the list
          onAbortSound && onAbortSound();
          return { success: true, message: result.message };
        } else {
          onFailureSound && onFailureSound();
          return { success: false, error: result.error };
        }
      } catch (err) {
        onFailureSound && onFailureSound();
        return { success: false, error: err.message };
      }
    },
    [loadLaunches, onAbortSound, onFailureSound]
  );

  useEffect(() => {
    loadLaunches();
  }, [loadLaunches]);

  return {
    launches,
    isPendingLaunch,
    error,
    loading,
    submitLaunch,
    abortLaunch,
    refreshLaunches: loadLaunches,
  };
};
