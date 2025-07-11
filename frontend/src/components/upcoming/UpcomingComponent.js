import React from "react";
import { useLaunchManager } from "../launch/launchUtils";
import { playDirectSound } from "../../utils/directSoundManager";
import LaunchList from "../launch/LaunchList";

const UpcomingComponent = () => {
  const { launches, loading, abortLaunch } = useLaunchManager(
    () => playDirectSound("success"), // Success sound
    () => playDirectSound("abort"),   // Abort sound
    () => playDirectSound("warning")  // Failure sound
  );

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-info mt-3">Loading upcoming launches...</p>
          </div>
        </div>
      </div>
    );
  }

  const upcomingLaunches = launches.filter((launch) => launch.upcoming);

  return <LaunchList launches={upcomingLaunches} onAbort={abortLaunch} showAbort={true} title="Upcoming Launches" />;
};

export default UpcomingComponent;
