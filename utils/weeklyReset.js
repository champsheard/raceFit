/**
 * Utility functions for weekly activity tracking and reset
 */

/**
 * Get the start of the current week (Monday)
 * @returns {Date} Start of the current week
 */
export const getWeekStart = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(today.setDate(diff));
};

/**
 * Get the end of the current week (Sunday)
 * @returns {Date} End of the current week
 */
export const getWeekEnd = () => {
  const start = getWeekStart();
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
};

/**
 * Check if a given date is in the current week
 * @param {string} dateString - Date string in ISO format (YYYY-MM-DD)
 * @returns {boolean} True if date is in current week
 */
export const isInCurrentWeek = (dateString) => {
  const date = new Date(dateString + "T00:00:00");
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();
  
  weekStart.setHours(0, 0, 0, 0);
  weekEnd.setHours(23, 59, 59, 999);
  
  return date >= weekStart && date <= weekEnd;
};

/**
 * Get days remaining in the current week
 * @returns {number} Days remaining in the week
 */
export const getDaysRemainingInWeek = () => {
  const today = new Date();
  const weekEnd = getWeekEnd();
  const daysRemaining = Math.ceil((weekEnd - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysRemaining);
};

/**
 * Format a week period as a string
 * @returns {string} Week period (e.g., "Dec 23 - Dec 29")
 */
export const formatWeekPeriod = () => {
  const start = getWeekStart();
  const end = getWeekEnd();
  
  const options = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString("en-US", options);
  const endStr = end.toLocaleDateString("en-US", options);
  
  return `${startStr} - ${endStr}`;
};
