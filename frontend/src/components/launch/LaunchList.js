import React from "react";
import { formatDateTime } from "../../utils/dateUtils";
import "./LaunchList.css";

const LaunchList = ({ launches, onAbort, showAbort = false, title = "Launches" }) => {
  if (!launches || launches.length === 0) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-info mb-4">{title}</h2>
            <div className="alert alert-info text-center" role="alert">
              <i className="bi bi-info-circle me-2"></i>
              No launches found.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="text-info mb-4">{title}</h2>
          <div className="table-responsive">
            <table className="table table-dark table-hover table-striped">
              <thead className="table-info">
                <tr>
                  <th scope="col" className="text-dark">
                    Flight #
                  </th>
                  <th scope="col" className="text-dark">
                    Launch Date
                  </th>
                  <th scope="col" className="text-dark">
                    Mission
                  </th>
                  <th scope="col" className="text-dark">
                    Rocket
                  </th>
                  <th scope="col" className="text-dark">
                    Target
                  </th>
                  <th scope="col" className="text-dark">
                    Customers
                  </th>
                  <th scope="col" className="text-dark">
                    Status
                  </th>
                  {showAbort && (
                    <th scope="col" className="text-dark">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {launches.map((launch) => (
                  <tr key={launch.flightNumber}>
                    <td className="fw-bold">{launch.flightNumber}</td>
                    <td>{formatDateTime(launch.launchDate)}</td>
                    <td className="fw-semibold">{launch.mission}</td>
                    <td>{launch.rocket}</td>
                    <td>{launch.target}</td>
                    <td>{launch.customers?.join(", ") || "N/A"}</td>
                    <td>
                      <span className={`badge ${launch.upcoming ? "bg-warning text-dark" : launch.success ? "bg-success" : "bg-danger"}`}>
                        {launch.upcoming ? "Upcoming" : launch.success ? "Success" : "Failed"}
                      </span>
                    </td>
                    {showAbort && (
                      <td>
                        {launch.upcoming && (
                          <button className="btn btn-outline-danger btn-sm" onClick={() => onAbort(launch.flightNumber)}>
                            Abort
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchList;
