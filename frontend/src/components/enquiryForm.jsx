import React, { useState } from "react";

import api from "../services/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EnquiryForm = ({ productId, onCancel, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [validations, setValidations] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccessMsg(null);
  };

  const validate = () => {
    const v = {};
    if (!form.name.trim()) v.name = "Name is required";
    if (!form.email.trim()) v.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim())) v.email = "Enter a valid email";
    if (!form.message.trim()) v.message = "Message is required";
    return v;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const v = validate();
    setValidations(v);
    if (Object.keys(v).length) {
      setSubmitting(false);
      return;
    }
    setSubmitting(true);

    try {
      // const { product_id, name, email, phone = null, message } = req.body || {}; -- backend requirement
      const payload = {
        product_id: productId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      };

      const res = await api.post("/enquiry/create", payload);
      //     res.status(201).json({
      //   message: "Enquiry created",
      //   enquiryId: result.lastID,
      // }); -- backend response

      const response = res.data;
      const { message } = response;
      setSuccessMsg(message);
      setForm({ name: "", email: "", phone: "", message: "" });
      setError(null);
      setSubmitting(false);

      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (error) {
      const errorMsg = error.response.data.error;
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="enquiry-form" onSubmit={handleSubmit}>
      <label>
        <span className="field-label">Name*</span>
        <input
          name="name"
          value={form.name}
          type="text"
          onChange={handleChange}
        />
        {validations.name && (
          <div className="field-error">{validations.name}</div>
        )}
      </label>

      <label>
        <span className="field-label">Email*</span>
        <input
          name="email"
          value={form.email}
          type="email"
          onChange={handleChange}
        />
        {validations.email && (
          <div className="field-error">{validations.email}</div>
        )}
      </label>

      <label>
        <span className="field-label">Phone</span>
        <input name="phone" value={form.phone} onChange={handleChange} />
      </label>

      <label>
        <span className="field-label">Message*</span>
        <textarea
          name="message"
          rows="4"
          value={form.message}
          onChange={handleChange}
        />
        {validations.message && (
          <div className="field-error">{validations.message}</div>
        )}
      </label>
      {error && <div className="field-error">{error}</div>}
      <div className="modal-actions">
        <button
          type="button"
          className="btn"
          onClick={() => onCancel()}
          disabled={submitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Sending..." : "Send Enquiry"}
        </button>
      </div>

      {successMsg && <div className="submit-result ok">{successMsg}</div>}
    </form>
  );
};

export default EnquiryForm;
