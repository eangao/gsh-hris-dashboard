import { useCallback } from "react";
import moment from "moment-timezone";

/**
 * React hook to format UTC dates to Asia/Manila timezone
 * @returns {function(dateStr: string, format?: string): string}
 */
export function useManilaDateFormatter() {
  return useCallback((utcDateStr, format = "YYYY-MM-DD") => {
    if (!utcDateStr) return "";
    return moment(utcDateStr).tz("Asia/Manila").format(format);
  }, []);
}

// ✅ Step 3: Use It in Your Component
// jsx
// Copy
// Edit
// import React from "react";
// import { useManilaDateFormatter } from "./hooks/useManilaDateFormatter";

// export default function BirthdayCard({ birthday }) {
//   const formatToManilaDate = useManilaDateFormatter();

//   return (
//     <div className="p-4 border rounded">
//       <h2 className="text-lg font-bold">Employee Birthday</h2>
//       <p className="text-gray-700">
//         🎂 {formatToManilaDate(birthday, "MMMM D, YYYY")}
//       </p>
//     </div>
//   );
// }
// 🧪 Example Input
// js
// Copy
// Edit
// <BirthdayCard birthday="1991-07-31T00:00:00" />
// 🟰 Output:
// 🎂 July 31, 1991
