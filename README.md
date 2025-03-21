# Cron Expression Builder

A React TypeScript application for building, visualizing, and understanding cron expressions with an intuitive UI.

## Features

- **Intuitive Interface**: Build cron expressions without remembering the syntax
- **Dual Mode Operation**:
  - Simple schedule presets (hourly, daily, weekly, monthly, yearly)
  - Advanced control for fine-grained scheduling
- **Visual Controls**: Interactive UI for each part of the cron expression
- **Expression Description**: Converts cron expressions to human-readable descriptions
- **Execution Visualization**: See when your cron job will run next
- **Copy to Clipboard**: Easily copy the generated expression

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cron-expression-builder.git
cd cron-expression-builder

# Install dependencies
npm install

# Start the development server
npm start
```

## Dependencies

- React 18+
- TypeScript 4+
- Mantine UI v7
- Lucide React (for icons)

## Usage

The application consists of three main components:

1. **CronExpressionBuilder**: The main component for building cron expressions
2. **CronDescription**: Converts cron expressions to human-readable text
3. **Utility Functions**: For converting between different formats

### Basic Example

```jsx
import { CronExpressionBuilder } from './components/CronExpressionBuilder';
import { CronDescription } from './components/CronDescription';

function App() {
  return (
    <div className="App">
      <CronExpressionBuilder />
      <CronDescription />
    </div>
  );
}
```

### Programmatic Usage

```typescript
// Convert CronExpression object to string
import { convertToCronString } from './utils/cronUtils';

const cronObj = {
  minutes: '0',
  hours: '12',
  daysOfMonth: '*',
  months: '*',
  daysOfWeek: '*',
};

const cronString = convertToCronString(cronObj);
console.log(cronString); // "0 12 * * *"
```

## Component Documentation

### CronExpressionBuilder

The main component for building cron expressions through an intuitive UI.

**Props:**

- `initialExpression?: CronExpression` - Optional initial cron expression

### CronDescription

Converts cron expressions to human-readable descriptions.

**Props:**

- `initialExpression?: string` - Optional initial cron expression string

### Utility Functions

- `convertToCronString(cronExpression: CronExpression): string` - Converts a CronExpression object to a cron string

## Types

```typescript
interface CronExpression {
  minutes: string;
  hours: string;
  daysOfMonth: string;
  months: string;
  daysOfWeek: string;
}
```

## Common Cron Patterns

| Cron Expression | Description                       |
| --------------- | --------------------------------- |
| `* * * * *`     | Every minute                      |
| `0 * * * *`     | Every hour at minute 0            |
| `*/15 * * * *`  | Every 15 minutes                  |
| `0 0 * * *`     | Daily at midnight                 |
| `0 12 * * *`    | Daily at noon                     |
| `0 0 * * 0`     | Weekly on Sunday at midnight      |
| `0 0 1 * *`     | Monthly on the 1st at midnight    |
| `0 0 1 1 *`     | Yearly on January 1st at midnight |

## License

MIT
