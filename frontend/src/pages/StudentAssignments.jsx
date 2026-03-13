import { useState, useEffect } from "react";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mySubmissions, setMySubmissions] = useState({}); // assignmentId -> submission

  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    fetchAssignments();
    fetchMySubmissions();
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

  const fetchMySubmissions = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assignment/student/${studentId}`,
      );
      const data = await res.json();
      if (res.ok) {
        const subMap = {};
        data.forEach((sub) => {
          subMap[sub.assignmentId._id] = sub;
        });
        setMySubmissions(subMap);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setAnswerFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answerFile) {
      alert("Please select an image of your answer.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("assignmentId", selectedAssignment._id);
    formData.append("studentId", studentId);
    formData.append("answerFile", answerFile);

    try {
      const res = await fetch(
        "${import.meta.env.VITE_API_URL}/api/assignment/submit",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      if (res.ok) {
        alert("Assignment submitted and evaluated!");
        fetchMySubmissions(); // refresh to show score
        setAnswerFile(null);
        setSelectedAssignment(null);
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. The AI might be taking too long.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Assignments</h1>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: List of Assignments */}
        <div className="bg-white p-8 rounded-xl shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Pending & Completed</h2>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {assignments.map((a) => {
              const submission = mySubmissions[a._id];
              const isCompleted = !!submission;

              return (
                <div
                  key={a._id}
                  onClick={() => setSelectedAssignment(a)}
                  className={`border p-4 rounded-lg cursor-pointer transition ${selectedAssignment?._id === a._id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">
                      {a.title}
                    </h3>
                    {isCompleted ? (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                        Submitted
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {a.description}
                  </p>

                  {isCompleted && submission.status === "graded" && (
                    <div className="mt-3 bg-gray-100 p-2 rounded text-sm flex gap-2 items-center font-semibold">
                      <span>
                        Score: {submission.score} / {a.maxMarks}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {assignments.length === 0 && (
              <p className="text-gray-500 text-sm">
                No assignments posted yet.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Assignment Details & Upload */}
        <div className="bg-white p-8 rounded-xl shadow h-fit">
          {!selectedAssignment ? (
            <div className="h-40 flex items-center justify-center text-gray-400">
              Select an assignment from the list
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-2">
                {selectedAssignment.title}
              </h2>
              <p className="text-sm font-semibold text-gray-500 mb-4">
                Posted by: {selectedAssignment.teacherId?.name} • Max Marks:{" "}
                {selectedAssignment.maxMarks}
              </p>

              <div className="bg-gray-50 p-4 rounded border mb-6 text-gray-700 whitespace-pre-wrap">
                {selectedAssignment.description}
              </div>

              {/* Question Image Preview */}
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-600 mb-2">
                  Reference Image:
                </p>
                <a
                  href={`${import.meta.env.VITE_API_URL}${selectedAssignment.questionFilePath}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}${selectedAssignment.questionFilePath}`}
                    alt="Question"
                    className="w-full max-h-64 object-cover rounded border hover:opacity-90 transition cursor-zoom-in"
                  />
                </a>
              </div>

              {/* Submission Area */}
              {mySubmissions[selectedAssignment._id] ? (
                <div className="border border-green-200 bg-green-50 p-6 rounded-lg text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="text-lg font-bold text-green-700 mb-1">
                    Assignment Submitted
                  </h3>
                  {mySubmissions[selectedAssignment._id].status ===
                    "graded" && (
                    <div className="mt-4 text-left">
                      <p className="font-bold text-lg mb-2">
                        Grade: {mySubmissions[selectedAssignment._id].score} /{" "}
                        {selectedAssignment.maxMarks}
                      </p>
                      <div className="bg-white p-3 rounded border text-sm text-gray-700">
                        <span className="font-bold block mb-1">
                          AI Teacher Feedback:
                        </span>
                        {mySubmissions[selectedAssignment._id].feedback}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="border border-blue-200 bg-blue-50 p-6 rounded-lg text-center"
                >
                  <h3 className="font-bold text-blue-800 mb-4">
                    Submit Your Answer
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please upload a clear, handwritten image of your answer.
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-4 text-sm w-full"
                    required
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting || !answerFile}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded shadow hover:bg-blue-700 disabled:opacity-50 transition flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Evaluating with AI...
                      </>
                    ) : (
                      "Upload & Evaluate"
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
