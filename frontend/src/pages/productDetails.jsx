import React, { useEffect, useState } from "react";

import { useParams, Link, useNavigate } from "react-router-dom";

import api from "../services/api";

import "../styles/productDetails.css";
import EnquiryForm from "../components/enquiryForm";

// {
//   "data": {
//     "id": 1,
//     "name": "Classic Backpack",
//     "category": "Bags",
//     "short_desc": "Durable everyday backpack",
//     "long_desc": "Large capacity backpack with padded laptop sleeve and water-resistant fabric.",
//     "price": 49.99,
//     "image_url": "https://via.placeholder.com/400x300?text=Backpack",
//     "created_at": "2025-12-05 16:13:13"
//   }
// } -- output for productDetails for id = 1 from backend

const ProductDetailsCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const res = await api.get(`/products/${id}`);
        const pd = res.data?.data;
        setProduct(pd);
      } catch (error) {
        const message = error?.response?.data?.message || error?.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  return (
    <div className="product-details-card">
      <header className="product-details-header">
        <Link to="/" className="pd-back">
          Back to products
        </Link>
      </header>
      {loading && <div className="pd-loading">Loding product...</div>}
      {!loading && error && <div className="pd-error">Error: {error} </div>}
      {!loading && !error && product && (
        <>
          <div className="pd-grid">
            <div className="pd-media">
              <img
                src={product.image_url}
                alt={product.name}
                className="pd-image"
                loading="lazy"
              />
            </div>
            <div className="pd-info">
              <h1 className="pd-title">{product.name}</h1>
              <div className="pd-meta">
                <span className="pd-category">{product.category}</span>
                {product.price !== undefined && (
                  <span className="pd-price">₹ {product.price}</span>
                )}
              </div>
              <p className="pd-short-desc">{product.short_desc}</p>
              <p className="pd-desc">{product.long_desc}</p>

              <div className="pd-button">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Enquire
                </button>
              </div>
            </div>
          </div>
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-box">
                <button
                  className="close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>

                <h3 className="modal-title">
                  Enquiry — {product?.name || product?.title || `#${id}`}
                </h3>

                <EnquiryForm
                  productId={product?.id || id}
                  productTitle={product?.name || product?.title}
                  onCancel={() => setIsModalOpen(false)}
                  onSuccess={() => navigate("/")}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetailsCard;
