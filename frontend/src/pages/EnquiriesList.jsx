import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/enquiriesList.css";

const EnquiriesList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Load Enquiries (protected API)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/enquiry/get", { withCredentials: true });
        setEnquiries(res.data.data);
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to load enquiries";

        setError(msg);

        // If token invalid → redirect to login
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
      navigate("/"); // Redirect after logout
    } catch (err) {
      alert("Logout failed");
    }
  };

  return (
    <div className="enquiries-page">
      <header className="enquiries-header">
        <h1>Enquiries</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {loading && <p className="loading">Loading enquiries...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && enquiries.length === 0 && (
        <p className="empty">No enquiries yet.</p>
      )}

      {!loading && !error && enquiries.length > 0 && (
        <table className="enquiries-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.product_id}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.phone || "-"}</td>
                <td>{e.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EnquiriesList;
