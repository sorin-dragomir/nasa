export const validateLaunchForm = (formData) => {
  const errors = {};

  if (!formData.mission || formData.mission.trim() === "") {
    errors.mission = "Mission name is required";
  }

  if (!formData.rocket || formData.rocket.trim() === "") {
    errors.rocket = "Rocket name is required";
  }

  if (!formData.launchDate) {
    errors.launchDate = "Launch date is required";
  } else {
    const launchDate = new Date(formData.launchDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (launchDate < today) {
      errors.launchDate = "Launch date must be in the future";
    }
  }

  if (!formData.target || formData.target === "") {
    errors.target = "Target planet is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim();
};
