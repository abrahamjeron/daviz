# Daviz - Reusable AI-Powered Data Visualization Component

## Overview

Daviz is a fully reusable React component that leverages LangChain's SQL Agent to transform natural language queries into interactive charts. All configuration is passed via props, making it perfect for npm distribution.

## Installation

```bash
npm install daviz
# or
yarn add daviz
```

## Basic Usage

```tsx
"use client";

import { useRef } from "react";
import Daviz, { DavizRef } from "daviz";

export default function MyDashboard() {
  const davizRef = useRef<DavizRef>(null);

  const handleQuery = async () => {
    if (davizRef.current) {
      await davizRef.current.executeQuery("Show me sales by region");
    }
  };

  return (
    <div>
      <button onClick={handleQuery}>Execute Query</button>
      
      <Daviz
        ref={davizRef}
        dbUri="postgresql://user:password@localhost:5432/mydb"
        model="gemini-2.5-flash"
        apiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""}
        height={400}
      />
    </div>
  );
}
```

## Props Reference

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `dbUri` | `string` | Database connection URI or file path |
| `model` | `string` | LLM model name (e.g., "gemini-2.5-flash", "gpt-4", "claude-3-sonnet") |
| `apiKey` | `string` | API key for the LLM service |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | `number` | `300` | Chart height in pixels |
| `className` | `string` | `undefined` | CSS class for custom styling |
| `onExecuteQuery` | `function` | `undefined` | Callback when query is executed |
| `onError` | `function` | `undefined` | Custom error handler |
| `onDataLoaded` | `function` | `undefined` | Callback when data is loaded |

## Supported Database URIs

### SQLite
```typescript
dbUri="sqlite:///path/to/database.db"
// or relative path
dbUri="sqlite:///./local.db"
```

### PostgreSQL
```typescript
dbUri="postgresql://username:password@localhost:5432/database_name"
```

### MySQL
```typescript
dbUri="mysql+pymysql://username:password@localhost:3306/database_name"
```

## Supported LLM Models

### Google Gemini
```typescript
model="gemini-2.5-flash"
model="gemini-2.5-flash-lite"
model="gemini-1.5-pro"
```

### OpenAI (with appropriate setup)
```typescript
model="gpt-4"
model="gpt-4-turbo"
```

### Anthropic Claude (with appropriate setup)
```typescript
model="claude-3-sonnet"
model="claude-3-opus"
```

## Chart Types

The component automatically determines the best chart type based on query results:

### 1. **Bar Chart**
- Use for categorical data with numeric values
- Example: Sales by region, products by category count

### 2. **Line Chart**
- Use for time-series data or continuous numeric progression
- Example: Revenue over months, temperature by date

### 3. **Pie Chart**
- Use for showing parts of a whole (distribution percentages)
- Example: Market share distribution, budget allocation

## Advanced Usage

### With Custom Error Handling

```tsx
<Daviz
  ref={davizRef}
  dbUri="sqlite:///./data.db"
  model="gemini-2.5-flash"
  apiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""}
  onError={(error) => {
    console.error("Chart generation failed:", error);
    // Show toast, send to monitoring service, etc.
  }}
/>
```

### With Data Loaded Callback

```tsx
<Daviz
  ref={davizRef}
  dbUri="sqlite:///./data.db"
  model="gemini-2.5-flash"
  apiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""}
  onDataLoaded={(data) => {
    console.log("Data loaded:", data);
    // Perform additional processing
  }}
/>
```

### With Custom Styling

```tsx
<Daviz
  ref={davizRef}
  dbUri="sqlite:///./data.db"
  model="gemini-2.5-flash"
  apiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""}
  className="custom-daviz-container"
  height={500}
/>
```

## How It Works

1. **User Input**: Developer passes database connection, LLM credentials, and chart height
2. **Query Execution**: User provides natural language query through the component UI or ref
3. **Agent Processing**: LangChain SQL Agent:
   - Calls `getSchema` to understand the database structure
   - Generates and executes a SQL query
   - Analyzes results to determine optimal chart type
   - Returns structured data with chart configuration
4. **Data Transformation**: Result is transformed based on chart type requirements
5. **Visualization**: Chart is rendered using MUI X-Charts library

## Architecture

```
Page Component (all props passed here)
    ↓
Daviz Component (client-side state management)
    ↓
runQueryAction (server action)
    ↓
createSQLAgent (with dbUri, model, apiKey)
    ├── getSchema tool (database introspection)
    └── executeSql tool (query execution)
    ↓
transformData (format results for visualization)
    ↓
SimpleChartView (MUI X-Charts rendering)
```

## Security Best Practices

1. **Never hardcode API keys** - Use environment variables
   ```typescript
   apiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""}
   ```

2. **Use read-only database accounts** - The agent only executes SELECT queries

3. **Sanitize user input** - The component safely handles all user queries

4. **Database access control** - Ensure database URI has appropriate permissions

## Troubleshooting

### "Failed to parse agent response"
- Check that the LLM model is working correctly
- Verify the database URI is correct
- Ensure the API key has the necessary permissions

### "Could not connect to database"
- Verify the database URI format matches your database type
- Check database credentials are correct
- Ensure the database is running and accessible

### Chart not displaying
- Check browser console for error messages
- Verify the query returns valid data
- Ensure chart height is sufficient

## Example: Complete Dashboard

```tsx
"use client";

import { useRef, useState } from "react";
import Daviz, { DavizRef } from "daviz";

export default function Dashboard() {
  const davizRef = useRef<DavizRef>(null);
  const [recentQueries] = useState([
    "Show me revenue by quarter",
    "List top 10 customers by spending",
    "What's the distribution of order sizes?",
  ]);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>📊 Analytics Dashboard</h1>
      
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {recentQueries.map((query) => (
          <button
            key={query}
            onClick={() => davizRef.current?.executeQuery(query)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {query}
          </button>
        ))}
      </div>

      <Daviz
        ref={davizRef}
        dbUri={process.env.NEXT_PUBLIC_DB_URI || ""}
        model="gemini-2.5-flash"
        apiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""}
        height={500}
        className="dashboard-chart"
      />
    </div>
  );
}
```

## License

MIT

## Support

For issues and feature requests, please open an issue on the GitHub repository.
