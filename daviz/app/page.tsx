"use client";

import { useRef } from "react";
import Daviz, { DavizRef } from "./components/Daviz";

export default function Page() {
  const davizRef = useRef<DavizRef>(null);
  return (
    <div className="w-screen h-screen p-8 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <Daviz
        ref={davizRef}
        dbUri=""
        model=""
        apiKey={""}
        height={500}
      />
    </div>
  );
}
