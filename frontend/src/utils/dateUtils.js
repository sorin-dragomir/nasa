export const formatDate = (date) => {
  if (!date) return "";

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString(undefined, options);
};

export const formatDateTime = (date) => {
  if (!date) return "";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(date).toLocaleDateString(undefined, options);
};

export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};
