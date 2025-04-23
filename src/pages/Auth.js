import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./Authentication.css";

const Authe = () => {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null); // for preview

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (productSearch.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
      );
      setFilteredProducts(filtered);
    }
  }, [productSearch, products]);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsLoggedIn(true);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setIsLoggedIn(true);
        setMessage("✅ Login successful!");
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMessage("");
  }, [email]);

  const sendOtp = async () => {
    if (!email) {
      setMessage("❌ Please enter a valid email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user.email === email) {
        setMessage("✅ You have already logged in.");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) {
        setMessage("❌ " + error.message);
      } else {
        setMessage("📧 OTP sent! Please check your email.");
      }
    } catch (err) {
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 2 && !isLoggedIn) {
      setMessage("❌ Please complete email verification before continuing.");
      return;
    }
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      setMessage("📸 Picture captured!");
    }
  };

  const steps = [1, 2, 3, 4, 5, 6];

  return (
    <div className="auth-background">
      <div className="container">
        <div className="card">
          <h2 className="title">Warranty Registration</h2>

          <div className="steps">
            {steps.map((s, index) => (
              <div
                key={index}
                className={`step-circle ${s === step ? "active" : s < step ? "completed" : ""}`}
              >
                {s < step ? "✓" : s}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="form-group email-step">
              <label>Email</label>
              <div className="email-input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  className="otp-btn"
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. +1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}

          {step === 4 && (
            <div className="form-group">
              <label>Physical Address</label>
              <textarea
                rows={3}
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          )}

          {step === 5 && (
            <div className="form-group">
              <div className="image-upload">
                <label>Take a Picture</label>
                <input type="file" accept="image/*" onChange={handleCapture} />
                {capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="image-preview"
                  />
                )}
              </div>
              <label>Search & Select Product</label>
              <input
                type="text"
                placeholder="Type product name..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
              {selectedProduct && (
                <p className="selected-product">✅ Selected: {selectedProduct}</p>
              )}
              <div className="product-list-container">
                <ul className="product-list">
                  {loading ? (
                    <li>Loading products...</li>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <li
                        key={product.id}
                        className={`product-item ${selectedProduct === product.title ? "selected" : ""}`}
                        onClick={() => setSelectedProduct(product.title)}
                      >
                        {product.images && product.images.length > 0 && (
                          <img
                            src={product.images[0].src}
                            alt={product.title}
                            className="product-image"
                          />
                        )}
                        <span className="product-title">{product.title}</span>
                      </li>
                    ))
                  ) : (
                    <li className="no-products">No products found</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="form-group">
              <h2>Thank You!</h2>
              <p className="capitalize">Your Warranty Registration Is Completed.</p>
              <a href="https://ellastein.in/" className="back-btn">
                ellastein.com
              </a>
            </div>
          )}

          <div className="btn-group">
            {step > 1 && step <= 6 && (
              <button className="prev-btn" onClick={prevStep}>
                Previous
              </button>
            )}
            {step < 6 && (
              <button onClick={nextStep} disabled={step === 5 && !selectedProduct}>
                Next
              </button>
            )}
          </div>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Authe;
