import React from "react";

import { Link } from "react-router-dom";

import "../styles/productsList.css";

const ProductCard = ({ product }) => {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="card-link">
        <div className="product-card-media">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        </div>
        <div className="product-card-body">
          <h3 className="product-card-title">{product.title}</h3>
          <p className="product-card-cat">{product.category}</p>
          <p className="product-card-price">₹ {product.price}</p>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
