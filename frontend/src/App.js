import React from "react";

import { Routes, Route, Link } from "react-router-dom";

import ProductDetails from "./pages/productDetails";
import ProductsList from "./pages/productsList";

import ProtectedRoute from "./components/ProtectedRoute";
import EnquiriesList from "./pages/EnquiriesList";
import Login from "./pages/login";

import "./App.css";

function NotFound() {
  return (
    <div className="not-found">
      <h2>404 - Page not found</h2>
      <p>
        <Link to="/" className="link">
          Back to home
        </Link>
      </p>
    </div>
  );
}

function Header() {
  return (
    <header className="app-header">
      <h3 className="app-header-heading">GVCC</h3>
      <nav className="app-nav">
        <Link to="/" className="nav-link">
          Products
        </Link>
        <Link to="/enquiries" className="nav-link">
          Enquiries
        </Link>
      </nav>
    </header>
  );
}

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route
            path="/enquiries"
            element={
              <ProtectedRoute>
                <EnquiriesList />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
