/**
 * Converts a CronExpression object into a standard cron string format
 * @param cronExpression - The CronExpression object containing individual cron components
 * @returns A formatted cron string
 */
export const convertToCronString = (cronExpression: any): string => {
  const { minutes, hours, daysOfMonth, months, daysOfWeek } = cronExpression;

  // Ensure all parts are strings and replace undefined/null with '*'
  const minutesStr = minutes?.toString() || '*';
  const hoursStr = hours?.toString() || '*';
  const daysOfMonthStr = daysOfMonth?.toString() || '*';
  const monthsStr = months?.toString() || '*';
  const daysOfWeekStr = daysOfWeek?.toString() || '*';

  // Combine all parts with spaces
  return `${minutesStr} ${hoursStr} ${daysOfMonthStr} ${monthsStr} ${daysOfWeekStr}`;
};

// Example usage
// const cronString = convertToCronString(cronExpression);
// console.log(cronString); // Output: "0 12 * * *"
