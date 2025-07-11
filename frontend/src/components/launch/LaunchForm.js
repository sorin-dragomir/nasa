import React, { useState, useMemo } from "react";
import { Button } from "../common";
import {
  validateLaunchForm,
  sanitizeInput,
} from "../../utils/validation";
import { playDirectSound } from "../../utils/directSoundManager";
import "./LaunchForm.css";

const LaunchForm = ({ planets, onSubmit, isPending }) => {
  const [formData, setFormData] = useState({
    mission: "",
    rocket: "Explorer IS1",
    launchDate: new Date().toISOString().split("T")[0],
    target: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const planetOptions = useMemo(() => {
    return planets?.map((planet) => (
      <option value={planet} key={planet}>
        {planet}
      </option>
    ));
  }, [planets]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizeInput(value),
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateLaunchForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Play warning sound when validation fails
      playDirectSound("warning");
      return;
    }

    try {
      const result = await onSubmit(formData);
      if (result.success) {
        // Show success message
        setSuccessMessage(
          "🚀 Launch scheduled successfully! Redirecting to upcoming launches..."
        );

        // Reset form on success
        setFormData({
          mission: "",
          rocket: "Explorer IS1",
          launchDate: new Date().toISOString().split("T")[0],
          target: "",
        });
        setErrors({});
      } else {
        setSuccessMessage("");
        setErrors({ submit: result.error });
        // Play warning sound when submission fails
        playDirectSound("warning");
      }
    } catch (error) {
      setSuccessMessage("");
      setErrors({ submit: error.message });
      // Play warning sound on unexpected errors
      playDirectSound("warning");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="launch-form">
      <div className="form-header">
        <h2>Try for Fun: Send a Spaceship to a Kepler Exoplanet!</h2>
        <p>
          Schedule a mission launch for interstellar travel to one of the Kepler
          Exoplanets.
        </p>
        <p>
          Ever dreamed of launching a mission to another world? 
        </p>
        <p>Now you can (kind of 😄)!</p>
        <p>Pick from a list of confirmed Kepler exoplanets that are:</p>
        <ul>
          <li>🌍 Close to Earth's size (less than 1.6x radius)</li>
          <li>
            🌞 In the "Goldilocks Zone" — just the right amount of sunlight for life
          </li>
        </ul>
        <p>Choose your destination, plan your launch, and imagine your journey across the stars!</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="launchDate">Launch Date</label>
          <input
            type="date"
            id="launchDate"
            name="launchDate"
            value={formData.launchDate}
            onChange={handleInputChange}
            min={today}
            max="2040-12-31"
            className={errors.launchDate ? "error" : ""}
          />
          {errors.launchDate && (
            <span className="error-message">{errors.launchDate}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="mission">Mission Name</label>
          <input
            type="text"
            id="mission"
            name="mission"
            value={formData.mission}
            onChange={handleInputChange}
            placeholder="Enter mission name"
            className={errors.mission ? "error" : ""}
          />
          {errors.mission && (
            <span className="error-message">{errors.mission}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rocket">Rocket Type</label>
          <input
            type="text"
            id="rocket"
            name="rocket"
            value={formData.rocket}
            onChange={handleInputChange}
            placeholder="Enter rocket type"
            className={errors.rocket ? "error" : ""}
          />
          {errors.rocket && (
            <span className="error-message">{errors.rocket}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="target">Destination Exoplanet</label>
          <select
            id="target"
            name="target"
            value={formData.target}
            onChange={handleInputChange}
            className={errors.target ? "error" : ""}
          >
            <option value="">Select a planet</option>
            {planetOptions}
          </select>
          {errors.target && (
            <span className="error-message">{errors.target}</span>
          )}
        </div>

        <div className="form-actions">
          <Button>
            <button
              type="submit"
              className="submit-button"
              disabled={isPending}
            >
              {isPending ? "Launching..." : "Launch Mission ✔"}
            </button>
          </Button>
        </div>

        {successMessage && (
          <div className="form-group success-group">
            <div className="success-message">{successMessage}</div>
          </div>
        )}

        {errors.submit && (
          <div className="form-group error-group">
            <span className="error-message">{errors.submit}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default LaunchForm;
