import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useState } from "react";

const EnrollmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    try {
      setLoading(true);

      await api.post(`/enrollments/${id}`);

      alert("Enrollment successful!");
      navigate("/student/dashboard");
    } catch (error) {
      console.error("Enrollment failed:", error);
      alert(error.response?.data.message || "Enrollment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-outline-secondary btn-sm me-3" onClick={() => navigate(-1)}>
          &larr; Go Back
        </button>
      </div>
      <div className="card shadow p-4 text-center">
        <h4>Confirm Enrollment</h4>

        <button
          className="btn btn-primary mt-3"
          onClick={handleEnroll}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Enroll"}
        </button>
      </div>
    </div>
  );
};

export default EnrollmentPage;
