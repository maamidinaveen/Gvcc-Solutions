import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/productsList.css";
import ProductCard from "../components/productCard";

const categories = ["all", "Electronics", "Home", "Furniture"];

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // fetch products from backend
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/products", {
          params: {
            page: currentPage,
            search: search || "",
            category: category === "all" ? "" : category,
          },
        });

        const { data, meta } = res.data || {};
        const { totalPages } = meta;

        setProducts(Array.isArray(data) ? data : []);
        setTotalPages(totalPages || 1);
      } catch (err) {
        const msg =
          err?.response?.data?.error || err?.message || "Something went wrong";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, search, category]);

  // reset page when filters change
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  // create page number buttons
  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="products-list-container">
      <header className="products-header">
        <h1 className="products-list-title">Products List</h1>

        <form
          className="products-list-controls"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="product-search" className="label">
            Search Products
          </label>
          <input
            type="search"
            id="product-search"
            className="product-input"
            placeholder="Search product by name"
            value={search}
            onChange={handleSearch}
          />

          <label htmlFor="product-category" className="label">
            Filter by category
          </label>
          <select
            id="product-category"
            className="product-input"
            value={category}
            onChange={handleCategory}
          >
            {categories.map((each) => (
              <option key={each} value={each}>
                {each === "all" ? "All categories" : each}
              </option>
            ))}
          </select>
        </form>
      </header>

      {loading && <p className="loading">Loading products...</p>}
      {!loading && error && <p className="error">{error}</p>}

      <div className="products-grid">
        {!loading &&
          !error &&
          products.length > 0 &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        {!loading && !error && products.length === 0 && (
          <p className="no-results">No products found.</p>
        )}
      </div>

      {/* PAGINATION SECTION */}
      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          {renderPageNumbers()}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
