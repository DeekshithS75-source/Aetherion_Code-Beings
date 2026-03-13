import { useState, useEffect } from "react";

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    maxMarks: "",
    questionFile: null,
  });

  const teacherId = localStorage.getItem("userId");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch(
        "${import.meta.env.VITE_API_URL}/api/assignment/all",
      );
      const data = await res.json();
      if (res.ok) setAssignments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assignment/${assignmentId}/submissions`,
      );
      const data = await res.json();
      if (res.ok) {
        setSubmissions(data);
        setSelectedAssignmentId(assignmentId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setForm({ ...form, questionFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.questionFile) {
      alert("Please upload an assignment image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("maxMarks", form.maxMarks);
    formData.append("teacherId", teacherId);
    formData.append("questionFile", form.questionFile);

    try {
      const res = await fetch(
        "${import.meta.env.VITE_API_URL}/api/assignment/create",
        {
          method: "POST",
          body: formData, // Do NOT set Content-Type header, let browser set it with boundary
        },
      );

      const data = await res.json();
      if (res.ok) {
        alert("Assignment created!");
        fetchAssignments();
        setForm({
          title: "",
          description: "",
          maxMarks: "",
          questionFile: null,
        });
        e.target.reset(); // clear file input
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit assignment");
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this assignment? All student submissions will also be deleted.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assignment/${assignmentId}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        alert("Assignment deleted successfully");
        fetchAssignments();
        if (selectedAssignmentId === assignmentId) {
          setSelectedAssignmentId(null);
          setSubmissions([]);
        }
      } else {
        const data = await res.json();
        alert("Failed to delete: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting assignment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5 flex flex-col items-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Assignment Form */}
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Create Assignment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Assignment Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              placeholder="Description & Instructions"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border p-2 rounded h-24"
              required
            ></textarea>
            <input
              type="number"
              placeholder="Max Marks"
              value={form.maxMarks}
              onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <div className="border border-dashed p-4 rounded bg-gray-50 flex flex-col">
              <label className="text-sm font-semibold mb-2">
                Upload Question File (Image Only)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
              Publish Assignment
            </button>
          </form>
        </div>

        {/* List Assignments */}
        <div className="bg-white p-8 rounded-xl shadow flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Active Assignments
          </h2>
          <div className="overflow-y-auto max-h-[500px] flex-grow space-y-4">
            {assignments.map((a) => (
              <div
                key={a._id}
                className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center group"
              >
                <div
                  className="cursor-pointer flex-grow"
                  onClick={() => fetchSubmissions(a._id)}
                >
                  <h3 className="font-bold text-lg text-blue-700">{a.title}</h3>
                  <p className="text-sm text-gray-500">
                    Max Marks: {a.maxMarks}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    onClick={() => fetchSubmissions(a._id)}
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAssignment(a._id);
                    }}
                    className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 opacity-0 group-hover:opacity-100 transition"
                    title="Delete Assignment"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions Viewer */}
      {selectedAssignmentId && (
        <div className="w-full max-w-4xl mt-8 bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Student Submissions (AI Evaluated)
          </h2>
          {submissions.length === 0 ? (
            <p className="text-gray-500 italic">
              No submissions yet for this assignment.
            </p>
          ) : (
            <div className="space-y-6">
              {submissions.map((sub) => (
                <div
                  key={sub._id}
                  className="border p-4 rounded-lg flex flex-col md:flex-row gap-6"
                >
                  {/* Left: Image */}
                  <div className="md:w-1/3">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Student Answer
                    </p>
                    <a
                      href={`${import.meta.env.VITE_API_URL}${sub.answerFilePath}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}${sub.answerFilePath}`}
                        alt="Submission"
                        className="w-full h-auto rounded border shadow-sm object-cover hover:opacity-80 transition"
                      />
                    </a>
                  </div>

                  {/* Right: AI Grade */}
                  <div className="md:w-2/3 flex flex-col justify-center">
                    <h3 className="font-bold text-xl mb-1">
                      {sub.studentId?.name || "Unknown Student"}{" "}
                      <span className="text-sm text-gray-500">
                        ({sub.studentId?.usn || "N/A"})
                      </span>
                    </h3>

                    {sub.status === "failed_evaluation" ? (
                      <div className="bg-red-50 text-red-700 p-3 rounded mt-2 border border-red-200">
                        <span className="font-bold">
                          ⚠️ AI Evaluation Failed.
                        </span>{" "}
                        Manual grading required.
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-4 items-center mt-2">
                          <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded text-lg">
                            Score: {sub.score}
                          </span>
                          {sub.isAIGenerated && (
                            <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded flex items-center gap-1">
                              🤖 AI-Generated Font Detected
                            </span>
                          )}
                        </div>
                        <div className="mt-4 bg-gray-50 p-4 rounded text-sm text-gray-700 whitespace-pre-wrap border">
                          <span className="font-bold text-gray-900 block mb-1">
                            AI Feedback:
                          </span>
                          {sub.feedback}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
