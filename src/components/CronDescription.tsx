import React, { useState, useEffect } from 'react';
import { Paper, Title, TextInput, Text, Alert, List, Badge, Box, Group } from '@mantine/core';
import { AlertTriangle, Info } from 'lucide-react';

interface CronDescriptionProps {
  initialExpression?: string;
}

const CronDescription: React.FC<CronDescriptionProps> = ({ initialExpression = '' }) => {
  const [cronExpression, setCronExpression] = useState(initialExpression);
  const [description, setDescription] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    parseCronExpression(cronExpression);
  }, [cronExpression]);

  // Parse and validate the cron expression
  const parseCronExpression = (expression: string) => {
    // Simple validation for expected format
    const parts = expression.trim().split(/\s+/);

    if (parts.length !== 5) {
      setIsValid(false);
      setErrorMessage('A cron expression should have 5 parts (minutes, hours, day of month, month, day of week)');
      setDescription('');
      return;
    }

    try {
      const [minutes, hours, dayOfMonth, month, dayOfWeek] = parts;

      // Validate each part with basic regex
      const minutesValid = validatePart(minutes, 0, 59);
      const hoursValid = validatePart(hours, 0, 23);
      const dayOfMonthValid = validatePart(dayOfMonth, 1, 31);
      const monthValid = validatePart(month, 1, 12);
      const dayOfWeekValid = validatePart(dayOfWeek, 0, 6);

      if (!minutesValid || !hoursValid || !dayOfMonthValid || !monthValid || !dayOfWeekValid) {
        setIsValid(false);
        setErrorMessage('One or more parts of the cron expression contain invalid values');
        setDescription('');
        return;
      }

      setIsValid(true);
      setErrorMessage('');
      setDescription(generateDescription(minutes, hours, dayOfMonth, month, dayOfWeek));
    } catch (error) {
      setIsValid(false);
      setErrorMessage('Failed to parse the cron expression');
      setDescription('');
    }
  };

  // Validate a part of the cron expression
  const validatePart = (part: string, min: number, max: number): boolean => {
    // Simple validation for common patterns
    if (part === '*') return true;
    if (part.includes(',')) {
      return part.split(',').every((val) => validatePart(val, min, max));
    }
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      return !isNaN(start) && !isNaN(end) && start >= min && end <= max && start <= end;
    }
    if (part.includes('/')) {
      const [range, step] = part.split('/');
      return (range === '*' || validatePart(range, min, max)) && !isNaN(Number(step)) && Number(step) > 0;
    }
    const num = Number(part);
    return !isNaN(num) && num >= min && num <= max;
  };

  // Generate a human-readable description of the cron expression
  const generateDescription = (
    minutes: string,
    hours: string,
    dayOfMonth: string,
    month: string,
    dayOfWeek: string
  ): string => {
    let description = 'This cron expression will run ';

    // Time (minutes and hours)
    description += describeTime(minutes, hours);

    // Days
    description += describeDays(dayOfMonth, dayOfWeek);

    // Months
    description += describeMonths(month);

    return description;
  };

  // Describe the time part (minutes and hours)
  const describeTime = (minutes: string, hours: string): string => {
    if (minutes === '*' && hours === '*') {
      return 'every minute of every hour';
    }

    if (minutes === '0' && hours === '*') {
      return 'at the start of every hour';
    }

    if (minutes === '0' && hours === '0') {
      return 'at midnight (12:00 AM)';
    }

    if (minutes === '0' && hours === '12') {
      return 'at noon (12:00 PM)';
    }

    if (minutes === '0') {
      if (hours.includes(',')) {
        const hoursList = hours
          .split(',')
          .map((h) => {
            const hourNum = parseInt(h);
            return hourNum === 0
              ? '12 AM'
              : hourNum === 12
              ? '12 PM'
              : hourNum < 12
              ? `${hourNum} AM`
              : `${hourNum - 12} PM`;
          })
          .join(', ');
        return `at ${hoursList}`;
      }

      if (hours.includes('-')) {
        const [start, end] = hours.split('-').map((h) => parseInt(h));
        const startStr =
          start === 0 ? '12 AM' : start === 12 ? '12 PM' : start < 12 ? `${start} AM` : `${start - 12} PM`;
        const endStr = end === 0 ? '12 AM' : end === 12 ? '12 PM' : end < 12 ? `${end} AM` : `${end - 12} PM`;
        return `every hour from ${startStr} to ${endStr}`;
      }

      if (hours.includes('/')) {
        const step = hours.split('/')[1];
        return `every ${step} hours`;
      }

      const hourNum = parseInt(hours);
      const hourStr =
        hourNum === 0 ? '12 AM' : hourNum === 12 ? '12 PM' : hourNum < 12 ? `${hourNum} AM` : `${hourNum - 12} PM`;
      return `at ${hourStr}`;
    }

    if (minutes.includes('/')) {
      const step = minutes.split('/')[1];
      if (hours === '*') {
        return `every ${step} minutes`;
      } else {
        const hourDescription =
          hours === '0'
            ? 'midnight'
            : hours === '12'
            ? 'noon'
            : parseInt(hours) < 12
            ? `${hours} AM`
            : `${parseInt(hours) - 12} PM`;
        return `every ${step} minutes during ${hourDescription}`;
      }
    }

    return 'at specific times';
  };

  // Describe the days part (day of month and day of week)
  const describeDays = (dayOfMonth: string, dayOfWeek: string): string => {
    if (dayOfMonth === '*' && dayOfWeek === '*') {
      return ' on every day';
    }

    if (dayOfMonth !== '*' && dayOfWeek === '*') {
      if (dayOfMonth === '1') {
        return ' on the first day of the month';
      }

      if (dayOfMonth === 'L') {
        return ' on the last day of the month';
      }

      if (dayOfMonth.includes(',')) {
        const days = dayOfMonth.split(',').join(', ');
        return ` on the ${days} of the month`;
      }

      if (dayOfMonth.includes('-')) {
        const [start, end] = dayOfMonth.split('-');
        return ` on days ${start} through ${end} of the month`;
      }

      if (dayOfMonth.includes('/')) {
        const step = dayOfMonth.split('/')[1];
        return ` every ${step} days of the month`;
      }

      return ` on day ${dayOfMonth} of the month`;
    }

    if (dayOfMonth === '*' && dayOfWeek !== '*') {
      const daysMap: Record<string, string> = {
        '0': 'Sunday',
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday',
      };

      if (dayOfWeek.includes(',')) {
        const days = dayOfWeek
          .split(',')
          .map((d) => daysMap[d] || d)
          .join(', ');
        return ` only on ${days}`;
      }

      if (dayOfWeek.includes('-')) {
        const [start, end] = dayOfWeek.split('-');
        return ` from ${daysMap[start] || start} to ${daysMap[end] || end}`;
      }

      if (dayOfWeek.includes('/')) {
        const step = dayOfWeek.split('/')[1];
        return ` every ${step} days of the week`;
      }

      return ` only on ${daysMap[dayOfWeek] || dayOfWeek}`;
    }

    return ' on specific days';
  };

  // Describe the months part
  const describeMonths = (month: string): string => {
    if (month === '*') {
      return '.';
    }

    const monthsMap: Record<string, string> = {
      '1': 'January',
      '2': 'February',
      '3': 'March',
      '4': 'April',
      '5': 'May',
      '6': 'June',
      '7': 'July',
      '8': 'August',
      '9': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December',
    };

    if (month.includes(',')) {
      const months = month
        .split(',')
        .map((m) => monthsMap[m] || m)
        .join(', ');
      return ` in ${months}.`;
    }

    if (month.includes('-')) {
      const [start, end] = month.split('-');
      return ` from ${monthsMap[start] || start} to ${monthsMap[end] || end}.`;
    }

    if (month.includes('/')) {
      const step = month.split('/')[1];
      return ` every ${step} months.`;
    }

    return ` in ${monthsMap[month] || month}.`;
  };

  // Examples for common cron expressions
  const examples = [
    { expression: '0 * * * *', description: 'Every hour at minute 0' },
    { expression: '*/15 * * * *', description: 'Every 15 minutes' },
    { expression: '0 0 * * *', description: 'Daily at midnight' },
    { expression: '0 12 * * *', description: 'Daily at noon' },
    { expression: '0 0 * * 0', description: 'Weekly on Sunday at midnight' },
    { expression: '0 0 1 * *', description: 'Monthly on the 1st at midnight' },
    { expression: '0 0 1 1 *', description: 'Yearly on January 1st at midnight' },
    { expression: '0 9-17 * * 1-5', description: 'Every hour from 9 AM to 5 PM, Monday through Friday' },
  ];

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Title order={3} mb="md">
        Cron Expression Description
      </Title>

      <TextInput
        value={cronExpression}
        onChange={(e) => setCronExpression(e.target.value)}
        placeholder="Enter cron expression (e.g., '*/15 * * * *')"
        label="Cron Expression"
        description="Format: minutes hours day-of-month month day-of-week"
        error={!isValid ? errorMessage : ''}
        mb="md"
      />

      {isValid && description && (
        <Box mb="lg">
          <Text fw={500} mb="xs">
            Description:
          </Text>
          <Alert icon={<Info size={16} />} color="blue">
            <Text>{description}</Text>
          </Alert>
        </Box>
      )}

      <Box>
        <Text fw={500} mb="xs">
          Common Examples:
        </Text>
        <Paper p="md" withBorder>
          <List spacing="xs">
            {examples.map((ex, index) => (
              <List.Item key={index}>
                <Group>
                  <Badge onClick={() => setCronExpression(ex.expression)} style={{ cursor: 'pointer' }}>
                    {ex.expression}
                  </Badge>
                  <Text size="sm">{ex.description}</Text>
                </Group>
              </List.Item>
            ))}
          </List>
        </Paper>
      </Box>
    </Paper>
  );
};

export default CronDescription;
