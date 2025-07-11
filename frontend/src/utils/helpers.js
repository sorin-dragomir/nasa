// Date utility functions
export const dateUtils = {
  formatDateTime(date) {
    if (!date) return "";

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return new Date(date).toLocaleDateString(undefined, options);
  },

  formatDateOnly(date) {
    if (!date) return "";

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    return new Date(date).toLocaleDateString(undefined, options);
  },

  isValidDate(date) {
    return date instanceof Date && !isNaN(date);
  },

  isPastDate(date) {
    return new Date(date) < new Date();
  },

  isFutureDate(date) {
    return new Date(date) > new Date();
  },
};

// Form validation utilities
export const validationUtils = {
  validateLaunchData(launchData) {
    const errors = {};

    if (!launchData.mission?.trim()) {
      errors.mission = "Mission name is required";
    }

    if (!launchData.rocket?.trim()) {
      errors.rocket = "Rocket name is required";
    }

    if (!launchData.launchDate) {
      errors.launchDate = "Launch date is required";
    } else if (!dateUtils.isValidDate(new Date(launchData.launchDate))) {
      errors.launchDate = "Invalid launch date";
    } else if (dateUtils.isPastDate(launchData.launchDate)) {
      errors.launchDate = "Launch date cannot be in the past";
    }

    if (!launchData.target?.trim()) {
      errors.target = "Target planet is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  sanitizeInput(input) {
    if (typeof input !== "string") return input;
    return input.trim().replace(/[<>]/g, "");
  },
};

// Sound utility functions
export const soundUtils = {
  playSound(soundType, sounds) {
    if (sounds && sounds[soundType] && typeof sounds[soundType].play === "function") {
      sounds[soundType].play();
    }
  },

  createSoundHandlers(sounds) {
    return {
      onSuccess: () => soundUtils.playSound("success", sounds),
      onAbort: () => soundUtils.playSound("abort", sounds),
      onFailure: () => soundUtils.playSound("warning", sounds),
      onClick: () => soundUtils.playSound("click", sounds),
    };
  },
};
