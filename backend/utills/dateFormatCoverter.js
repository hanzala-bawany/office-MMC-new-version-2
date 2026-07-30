import moment from "moment";

export const formatForOracle = (dateStr) => {
  if (!dateStr) return null;

  // Moment se format karein
  const momentDate = moment(dateStr);
  if (!momentDate.isValid()) return null;

  // Oracle format: 28-JUL-2026
  return momentDate.format("DD-MMM-YYYY").toUpperCase();
};
