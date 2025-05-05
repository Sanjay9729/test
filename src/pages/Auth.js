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
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://brilliant-kashata-1d4944.netlify.app/.netlify/functions/products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load products.");
      } finally {
        setLoadingProducts(false);
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
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setMessage("✅ Login successful!");
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setMessage("✅ Login successful!");
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const sendOtp = async () => {
    if (!email) {
      setMessage("❌ Please enter a valid email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await supabase.auth.signOut();
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

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      setMessage("📸 Picture captured!");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.from("submissions").insert([
        {
          full_name: fullName || null,
          email: email || null,
          phone: phone || null,
          address: address || null,
          selected_product: selectedProduct || null,
          image_url: capturedImage || null,
        },
      ]);

      if (error) {
        setMessage("❌ Submission failed: " + error.message);
      } else {
        setMessage("✅ Form submitted successfully!");
        setStep(6);
      }
    } catch (err) {
      setMessage("❌ Error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
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

          {!loading && (
            <>
              {step === 1 && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
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
                      placeholder="Email Address"
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
                    placeholder="Phone Number"
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
                    <label>Take a Picture (optional)</label>
                    <input type="file" accept="image/*" onChange={handleCapture} />
                    {capturedImage && (
                      <img src={capturedImage} alt="Captured" className="image-preview" />
                    )}
                  </div>

                  <label>Search & Select Product (optional)</label>
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
                      {loadingProducts ? (
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

                  <button className="submit-btn" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              )}

              {step === 6 && (
                <div className="form-group">
                  <h2>Thank You!</h2>
                  <p className="capitalize">Your Warranty Registration Is Completed.</p>
                  <a href="https://wholesale.ellastein.com/" className="back-btn">
                    Ellastein.com
                  </a>
                </div>
              )}

              <div className="btn-group">
                {step > 1 && step < 6 && (
                  <button className="prev-btn" onClick={prevStep}>
                    Previous
                  </button>
                )}
                {step < 5 && (
                  <button onClick={nextStep}>
                    Next
                  </button>
                )}
              </div>

              {message && <p className="message">{message}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authe;
