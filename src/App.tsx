import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Title,
  Text,
  Tabs,
  SegmentedControl,
  NumberInput,
  MultiSelect,
  Stack,
  Group,
  Select,
  Paper,
  Divider,
  CopyButton,
  Button,
  Code,
  ThemeIcon,
  List,
} from '@mantine/core';
import { Calendar, Clock, Copy, Check } from 'lucide-react';
import CronDescription from './components/CronDescription';
import { convertToCronString } from './utils/convertToCronString';

// Type for cron expression parts
interface CronExpression {
  minutes: string;
  hours: string;
  daysOfMonth: string;
  months: string;
  daysOfWeek: string;
}

// Component for the Cron Expression Builder
const CronExpressionBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>('simple');
  const [cronExpression, setCronExpression] = useState<CronExpression>({
    minutes: '0',
    hours: '12',
    daysOfMonth: '*',
    months: '*',
    daysOfWeek: '*',
  });
  const [expressionType, setExpressionType] = useState<Record<string, string>>({
    minutes: 'specific',
    hours: 'specific',
    daysOfMonth: 'any',
    months: 'any',
    daysOfWeek: 'any',
  });
  const [nextExecutions, setNextExecutions] = useState<string[]>([]);

  // Generate options for selects
  const generateOptions = (start: number, end: number, prefix: string = '') => {
    return Array.from({ length: end - start + 1 }, (_, i) => ({
      value: (i + start).toString(),
      label: `${prefix}${i + start}`,
    }));
  };

  const minuteOptions = generateOptions(0, 59);
  const hourOptions = generateOptions(0, 23);
  const dayOptions = generateOptions(1, 31);
  const monthOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  const dayOfWeekOptions = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
  ];

  // Common type options for each segment
  const typeOptions = [
    { value: 'any', label: 'Any' },
    { value: 'specific', label: 'Specific' },
    { value: 'range', label: 'Range' },
    { value: 'every', label: 'Every' },
  ];

  // Update cron expression based on type and values
  useEffect(() => {
    const newCronExpression = { ...cronExpression };

    // Calculate future executions
    calculateNextExecutions(getCronString(newCronExpression));
  }, [cronExpression, expressionType]);

  // Function to update a part of the cron expression
  const updateCronPart = (part: keyof CronExpression, value: string) => {
    setCronExpression((prev) => ({
      ...prev,
      [part]: value,
    }));
  };

  // Function to update expression type for a part
  const updateExpressionType = (part: keyof CronExpression, type: string) => {
    setExpressionType((prev) => ({
      ...prev,
      [part]: type,
    }));

    // Reset the value based on new type
    let newValue = '*';
    switch (type) {
      case 'specific':
        newValue =
          part === 'minutes'
            ? '0'
            : part === 'hours'
            ? '12'
            : part === 'daysOfMonth'
            ? '1'
            : part === 'months'
            ? '1'
            : '1';
        break;
      case 'range':
        newValue =
          part === 'minutes'
            ? '0-30'
            : part === 'hours'
            ? '9-17'
            : part === 'daysOfMonth'
            ? '1-15'
            : part === 'months'
            ? '1-6'
            : '1-5';
        break;
      case 'every':
        newValue =
          part === 'minutes'
            ? '*/15'
            : part === 'hours'
            ? '*/2'
            : part === 'daysOfMonth'
            ? '*/5'
            : part === 'months'
            ? '*/3'
            : '*/2';
        break;
    }

    updateCronPart(part, newValue);
  };

  // Function to get the full cron string
  const getCronString = (cron: CronExpression): string => {
    return `${cron.minutes} ${cron.hours} ${cron.daysOfMonth} ${cron.months} ${cron.daysOfWeek}`;
  };

  // Calculate next 5 execution times (mock implementation)
  const calculateNextExecutions = (cronString: string) => {
    // In a real app, you would use a library like cron-parser
    // This is a simplified mock
    const now = new Date();
    const nextExecs = Array.from({ length: 5 }, (_, i) => {
      const next = new Date(now);
      next.setMinutes(now.getMinutes() + (i + 1) * 15); // Just a simple approximation
      return next.toLocaleString();
    });

    setNextExecutions(nextExecs);
  };

  // Function to handle the simple schedule options
  const handleSimpleSchedule = (value: string) => {
    switch (value) {
      case 'hourly':
        setCronExpression({
          minutes: '0',
          hours: '*',
          daysOfMonth: '*',
          months: '*',
          daysOfWeek: '*',
        });
        break;
      case 'daily':
        setCronExpression({
          minutes: '0',
          hours: '12',
          daysOfMonth: '*',
          months: '*',
          daysOfWeek: '*',
        });
        break;
      case 'weekly':
        setCronExpression({
          minutes: '0',
          hours: '12',
          daysOfMonth: '*',
          months: '*',
          daysOfWeek: '1',
        });
        break;
      case 'monthly':
        setCronExpression({
          minutes: '0',
          hours: '12',
          daysOfMonth: '1',
          months: '*',
          daysOfWeek: '*',
        });
        break;
      case 'yearly':
        setCronExpression({
          minutes: '0',
          hours: '12',
          daysOfMonth: '1',
          months: '1',
          daysOfWeek: '*',
        });
        break;
    }
  };

  // Render control for a specific part based on its type
  const renderControl = (part: keyof CronExpression) => {
    const type = expressionType[part];

    switch (type) {
      case 'specific':
        if (part === 'minutes' || part === 'hours' || part === 'daysOfMonth') {
          const options = part === 'minutes' ? minuteOptions : part === 'hours' ? hourOptions : dayOptions;

          return (
            <Select
              data={options}
              value={cronExpression[part]}
              onChange={(value) => updateCronPart(part, value || '*')}
              searchable
              clearable={false}
            />
          );
        } else if (part === 'months') {
          return (
            <Select
              data={monthOptions}
              value={cronExpression[part]}
              onChange={(value) => updateCronPart(part, value || '*')}
              searchable
              clearable={false}
            />
          );
        } else {
          return (
            <Select
              data={dayOfWeekOptions}
              value={cronExpression[part]}
              onChange={(value) => updateCronPart(part, value || '*')}
              searchable
              clearable={false}
            />
          );
        }

      case 'range':
        return (
          <Group>
            <Text size="sm">From</Text>
            <input
              type="text"
              className="mantine-Input-input mantine-NumberInput-input"
              value={cronExpression[part].split('-')[0]}
              onChange={(e) => {
                const range = cronExpression[part].split('-');
                updateCronPart(part, `${e.target.value}-${range[1] || range[0]}`);
              }}
              style={{ width: 70 }}
            />
            <Text size="sm">To</Text>
            <input
              type="text"
              className="mantine-Input-input mantine-NumberInput-input"
              value={cronExpression[part].split('-')[1] || cronExpression[part].split('-')[0]}
              onChange={(e) => {
                const range = cronExpression[part].split('-');
                updateCronPart(part, `${range[0]}-${e.target.value}`);
              }}
              style={{ width: 70 }}
            />
          </Group>
        );

      case 'every':
        return (
          <Group>
            <Text size="sm">Every</Text>
            <input
              type="text"
              className="mantine-Input-input mantine-NumberInput-input"
              value={cronExpression[part].replace('*/', '')}
              onChange={(e) => updateCronPart(part, `*/${e.target.value}`)}
              style={{ width: 70 }}
            />
            <Text size="sm">
              {part === 'minutes'
                ? 'minute(s)'
                : part === 'hours'
                ? 'hour(s)'
                : part === 'daysOfMonth'
                ? 'day(s)'
                : part === 'months'
                ? 'month(s)'
                : 'day(s) of week'}
            </Text>
          </Group>
        );

      default:
        return <Text>Any</Text>;
    }
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="md" radius="md" withBorder mb="lg">
        <Title order={2} mb="md">
          Cron Expression Builder & Visualizer
        </Title>
        <Text color="dimmed" mb="lg">
          Build and visualize cron expressions with an intuitive interface
        </Text>

        <Tabs value={activeTab} onChange={setActiveTab} mb="lg">
          <Tabs.List>
            <Tabs.Tab value="simple" leftSection={<Calendar size={16} />}>
              Simple Schedule
            </Tabs.Tab>
            <Tabs.Tab value="advanced" leftSection={<Clock size={16} />}>
              Advanced Schedule
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="simple" pt="md">
            <Stack>
              <Text size="sm">Choose a predefined schedule:</Text>
              <SegmentedControl
                data={[
                  { label: 'Hourly', value: 'hourly' },
                  { label: 'Daily', value: 'daily' },
                  { label: 'Weekly', value: 'weekly' },
                  { label: 'Monthly', value: 'monthly' },
                  { label: 'Yearly', value: 'yearly' },
                ]}
                onChange={handleSimpleSchedule}
              />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="advanced" pt="md">
            <Stack>
              {/* Minutes */}
              <Paper p="md" withBorder>
                <Title order={4} mb="sm">
                  Minutes
                </Title>
                <Group align="center" mb="sm">
                  <SegmentedControl
                    data={typeOptions}
                    value={expressionType.minutes}
                    onChange={(value) => updateExpressionType('minutes', value)}
                  />
                </Group>
                {renderControl('minutes')}
              </Paper>

              {/* Hours */}
              <Paper p="md" withBorder>
                <Title order={4} mb="sm">
                  Hours
                </Title>
                <Group align="center" mb="sm">
                  <SegmentedControl
                    data={typeOptions}
                    value={expressionType.hours}
                    onChange={(value) => updateExpressionType('hours', value)}
                  />
                </Group>
                {renderControl('hours')}
              </Paper>

              {/* Days of Month */}
              <Paper p="md" withBorder>
                <Title order={4} mb="sm">
                  Day of Month
                </Title>
                <Group align="center" mb="sm">
                  <SegmentedControl
                    data={typeOptions}
                    value={expressionType.daysOfMonth}
                    onChange={(value) => updateExpressionType('daysOfMonth', value)}
                  />
                </Group>
                {renderControl('daysOfMonth')}
              </Paper>

              {/* Months */}
              <Paper p="md" withBorder>
                <Title order={4} mb="sm">
                  Month
                </Title>
                <Group align="center" mb="sm">
                  <SegmentedControl
                    data={typeOptions}
                    value={expressionType.months}
                    onChange={(value) => updateExpressionType('months', value)}
                  />
                </Group>
                {renderControl('months')}
              </Paper>

              {/* Days of Week */}
              <Paper p="md" withBorder>
                <Title order={4} mb="sm">
                  Day of Week
                </Title>
                <Group align="center" mb="sm">
                  <SegmentedControl
                    data={typeOptions}
                    value={expressionType.daysOfWeek}
                    onChange={(value) => updateExpressionType('daysOfWeek', value)}
                  />
                </Group>
                {renderControl('daysOfWeek')}
              </Paper>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Divider my="lg" />

        <Paper p="md" withBorder mb="md">
          <Group mb="md">
            <Title order={3}>Generated Cron Expression</Title>
            <CopyButton value={getCronString(cronExpression)} timeout={2000}>
              {({ copied, copy }) => (
                <Button
                  // leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                  color={copied ? 'teal' : 'blue'}
                  onClick={copy}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </CopyButton>
          </Group>
          <Code block style={{ fontSize: 16 }}>
            {getCronString(cronExpression)}
          </Code>
        </Paper>

        <Paper p="md" withBorder>
          <Title order={3} mb="md">
            Next Execution Times
          </Title>
          <List spacing="xs">
            {nextExecutions.map((time, index) => (
              <List.Item
                key={index}
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <Clock size={16} />
                  </ThemeIcon>
                }
              >
                {time}
              </List.Item>
            ))}
          </List>
        </Paper>
      </Paper>
      <CronDescription initialExpression={convertToCronString(cronExpression)} />
    </Container>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Box style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <CronExpressionBuilder />
    </Box>
  );
};

export default App;
