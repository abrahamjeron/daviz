"use client";

import { useRef } from "react";
import Daviz, { DavizRef } from "./components/Daviz";

export default function Page() {
  const davizRef = useRef<DavizRef>(null);
  return (
    <div style={{ padding: 32 }}>
      <Daviz
        ref={davizRef}
        dbUri="postgresql://abra:yourpassword@localhost:5432/local_fyule_db_current?schema=public"
        model="gemini-2.5-flash"
        apiKey={"AIzaSyAzko2czBZ9Qy8hPikm7p2qIBlYDmFQeKo"}
        height={500}
      />
    </div>
  );
}
