import { useState, useEffect } from "react";

export default function TeacherAttendanceView() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/attendance/all");
            const data = await res.json();
            if (res.ok) {
                setRecords(data);
            }
        } catch (error) {
            console.error("Failed to fetch attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-5 flex flex-col items-center">
            <div className="w-full max-w-5xl bg-white p-8 rounded-xl shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Campus Attendance Log</h2>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">Database View</span>
                </div>

                {loading ? (
                    <p className="text-gray-500 text-center py-10">Loading records...</p>
                ) : records.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No attendance records found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-blue-50 text-blue-800">
                                    <th className="p-3 border-b-2">Date</th>
                                    <th className="p-3 border-b-2">Time</th>
                                    <th className="p-3 border-b-2">Class</th>
                                    <th className="p-3 border-b-2">Event</th>
                                    <th className="p-3 border-b-2">Student Name</th>
                                    <th className="p-3 border-b-2">USN</th>
                                    <th className="p-3 border-b-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => (
                                    <tr key={record._id} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">{new Date(record.date).toLocaleDateString()}</td>
                                        <td className="p-3">{record.time}</td>
                                        <td className="p-3 font-medium text-gray-700">{record.className}</td>
                                        <td className="p-3">
                                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md font-semibold tracking-wide">
                                                {record.eventType}
                                            </span>
                                        </td>
                                        <td className="p-3">{record.studentName}</td>
                                        <td className="p-3 font-mono text-sm">{record.usn}</td>
                                        <td className="p-3">
                                            {record.present ? (
                                                <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">Present</span>
                                            ) : (
                                                <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-sm">Absent</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
