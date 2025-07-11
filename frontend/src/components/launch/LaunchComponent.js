import React from "react";
import { useNavigate } from "react-router-dom";
import { useLaunchManager } from "./launchUtils";
import { usePlanets } from "../planets/usePlanets";
import { playDirectSound } from "../../utils/directSoundManager";
import LaunchForm from "./LaunchForm";

const LaunchComponent = () => {
  const navigate = useNavigate();
  
  const { submitLaunch, isPendingLaunch } = useLaunchManager(
    () => playDirectSound("success"), // Success sound
    () => playDirectSound("abort"), // Abort sound
    () => playDirectSound("warning") // Failure sound
  );

  const { planets, loading: planetsLoading } = usePlanets();

  const handleLaunchSubmit = async (launchData) => {
    try {
      const result = await submitLaunch(launchData);
      
      if (result.success) {
        // Redirect to upcoming page on successful launch submission
        setTimeout(() => {
          navigate('/upcoming');
        }, 1500); // Small delay to show success message/sound
      } else {
        // Ensure failure sound is played even if useLaunchManager didn't trigger it
        playDirectSound("warning");
      }
      
      return result;
    } catch (error) {
      // Handle any unexpected errors and play failure sound
      playDirectSound("warning");
      return { success: false, error: error.message };
    }
  };

  if (planetsLoading) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-info mt-3">Loading planets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <LaunchForm planets={planets} onSubmit={handleLaunchSubmit} isPending={isPendingLaunch} />
    </div>
  );
};

export default LaunchComponent;
