import AIViz from "./components/AIViz";
import { runSQL } from "./actions/runSQL";

export default function Page() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Daily Student Logins</h1>

      <AIViz
        query={`
SELECT
  (first_login_attempt::timestamptz)::date AS day,
  COUNT(*) AS logins
FROM "User"
WHERE first_login_attempt IS NOT NULL
GROUP BY day
ORDER BY day;
        `}
        chartConfig={{
          chartType: "line",
          xField: "day",
          yField: "logins",
        }}
        fetcher={runSQL}
        height={350}
      />
    </div>
  );
}
