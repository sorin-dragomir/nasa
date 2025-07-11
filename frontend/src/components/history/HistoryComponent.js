import React from "react";
import { useLaunchManager } from "../launch/launchUtils";
import LaunchList from "../launch/LaunchList";

const HistoryComponent = () => {
  const { launches, loading } = useLaunchManager();

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-info mt-3">Loading launch history...</p>
          </div>
        </div>
      </div>
    );
  }

  const historicalLaunches = launches.filter((launch) => !launch.upcoming);

  return <LaunchList launches={historicalLaunches} showAbort={false} title="Launch History" />;
};

export default HistoryComponent;
