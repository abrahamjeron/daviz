"use client";

import { useRef } from "react";
import Daviz, { DavizRef } from "./components/Daviz";

export default function Page() {
  const davizRef = useRef<DavizRef>(null);

  const handleExecuteQuery = async () => {
    if (davizRef.current) {
      await davizRef.current.executeQuery("Show me the top 5 customers by order count");
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>🎨 Daviz - AI-Powered Data Visualizer</h1>
      
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: "#666", marginBottom: 12 }}>
          This component uses LangChain SQL Agent to execute natural language queries.
        </p>
        <button 
          onClick={handleExecuteQuery} 
          style={{ 
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Execute Example Query
        </button>
      </div>

      <Daviz
        ref={davizRef}
        dbUri="postgresql://abra:yourpassword@localhost:5432/local_fyule_db_current"
        model="gemini-2.5-flash"
        apiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""}
        chartConfig={{
          chartType: "bar",
          xField: "category",
          yField: "value",
        }}
      />
    </div>
  );
}
