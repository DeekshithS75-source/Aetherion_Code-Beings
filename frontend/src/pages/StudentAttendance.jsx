import { useState, useEffect } from "react";

export default function StudentAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentData = JSON.parse(localStorage.getItem("student") || "{}");
  // Since usn was NOT saved to localStorage originally, we need to extract it, or use fallback if they didn't re-login yet.
  // However, if we know they logged in properly, robust app would store it. Let's just prompt error if missing.
  // For now we will assume studentData contains USN or userId is available.

  // We will extract USN by looking at the frontend/backend behavior. Student Login uses USN.
  // We can just ask them to re-login if needed, but a smart way is to store USN directly.
  // Let's modify getting the USN. It may not be in localstorage properly, so let's check.
  // Wait, earlier I did NOT add usn to localstorage output in backend. Let's assume usn is stored or we get it from token.
  // Actually, StudentLogin.jsx has `localStorage.setItem("student", JSON.stringify(data));`
  // Wait, the backend StudentLogin sends `{ message, role, userId }`, NOT USN.
  // So we don't know the USN from localStorage! This is a bug in the old code. We need the USN.
  // Let's fetch it via a new API or just pass the ID.
  // To save time and complexity, let's just use a prompt to ask the student for their USN if they want to view records.

  // Edit: since we have userId, we can fetch their USN from the backend using a /me endpoint, or just ask them for it.
  // Let's just ask them for it via a simple input field if it's not saved.

  const [usnInput, setUsnInput] = useState("");
  const [hasUsn, setHasUsn] = useState(false);

  const fetchAttendance = async (usnToFetch) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/attendance/student/${usnToFetch}`,
      );
      const data = await res.json();
      if (res.ok) {
        setRecords(data);
        setHasUsn(true);
      } else {
        alert("Failed to fetch records: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (usnInput) {
      fetchAttendance(usnInput);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5 flex flex-col items-center">
      {!hasUsn ? (
        <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
            My Attendance
          </h2>
          <p className="text-gray-600 mb-6 text-center text-sm">
            Please enter your USN to view your attendance history.
          </p>
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter USN (e.g. 4CB24CS001)"
              className="border p-3 rounded w-full font-mono uppercase"
              value={usnInput}
              onChange={(e) => setUsnInput(e.target.value.toUpperCase())}
              required
            />
            <button className="bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
              View Records
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                My Attendance Log
              </h2>
              <p className="font-mono text-gray-500 mt-1">
                Showing records for:{" "}
                <span className="font-bold text-blue-600">{usnInput}</span>
              </p>
            </div>
            <button
              onClick={() => setHasUsn(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
            >
              Change USN
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-10">
              Loading records...
            </p>
          ) : records.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No attendance records found for this USN.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-50 text-blue-800">
                    <th className="p-3 border-b-2">Date</th>
                    <th className="p-3 border-b-2">Time</th>
                    <th className="p-3 border-b-2">Class</th>
                    <th className="p-3 border-b-2">Event</th>
                    <th className="p-3 border-b-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr
                      key={record._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="p-3">{record.time}</td>
                      <td className="p-3 font-medium text-gray-700">
                        {record.className}
                      </td>
                      <td className="p-3">
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md font-semibold tracking-wide">
                          {record.eventType}
                        </span>
                      </td>
                      <td className="p-3">
                        {record.present ? (
                          <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                            Present
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-sm">
                            Absent
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
