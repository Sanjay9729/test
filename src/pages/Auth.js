import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./Authentication.css";

const Authe = () => {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [otpSentMessage, setOtpSentMessage] = useState("");
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");

  // Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/.netlify/functions/products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search
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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Send OTP
  const sendOtpCustom = async () => {
    setLoading(true);
    setOtpSentMessage("");
    setFieldErrors({});

    if (!email || !validateEmail(email)) {
      setFieldErrors({ email: "Please enter a valid email format." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/.netlify/functions/sendOtp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFieldErrors({ email: data.error || "OTP send failed" });
      } else {
        setOtpSent(true);
        setOtpSentMessage("📧 OTP sent to your email.");
      }
    } catch (err) {
      console.error("Send OTP Error:", err);
      setFieldErrors({ email: "Network error while sending OTP." });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtpCustom = async () => {
    setLoading(true);
    setFieldErrors({});
    try {
      const res = await fetch("/.netlify/functions/verifyOtp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFieldErrors({ email: data.error || "OTP verification failed" });
      } else {
        setOtpVerified(true);
        setLoginSuccessMessage("✅ OTP Verified!");
      }
    } catch (err) {
      console.error("Verify OTP Error:", err);
      setFieldErrors({ email: "OTP verification failed." });
    } finally {
      setLoading(false);
    }
  };

  // Submit to Supabase
  const handleSubmit = async () => {
    setLoading(true);
    setFieldErrors({});
    try {
      const { error } = await supabase.from("submissions").insert([
        {
          full_name: fullName,
          email: email,
          phone: phone,
          address: address,
          selected_product: selectedProduct,
        },
      ]);
      if (error) throw error;
      setStep(6);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    const errors = {};

    if (step === 1 && !fullName) errors.fullName = "Please enter your full name.";
    if (step === 2) {
      if (!email || !validateEmail(email)) {
        errors.email = "Enter a valid email address.";
      } else if (!otpVerified) {
        errors.email = "Please verify the OTP sent to your email.";
      }
    }
    if (step === 3 && !phone) errors.phone = "Please enter your phone number.";
    if (step === 4 && !address) errors.address = "Please enter your address.";
    if (step === 5 && !selectedProduct) errors.selectedProduct = "Please select a product.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setFieldErrors({});
    setStep(step - 1);
  };

  return (
    <div className="auth-background">
      <div className="container">
        <div className="card">
          <h2 className="title">Warranty Registration</h2>

          {/* Step Indicator */}
          <div className="steps">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`step-circle ${s === step ? "active" : s < step ? "completed" : ""}`}
              >
                {s < step ? "✓" : s}
              </div>
            ))}
          </div>

          {/* Step Form */}
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
                  {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
                </div>
              )}

              {step === 2 && (
                <div className="form-group">
                  <label>Email</label>
                  <div className="email-input-wrapper">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setOtp("");
                        setOtpVerified(false);
                        setOtpSent(false);
                        setOtpSentMessage("");
                        setLoginSuccessMessage("");
                      }}
                    />
                    <button onClick={sendOtpCustom} className="otp-btn">Send OTP</button>
                  </div>

                  {otpSent && !otpVerified && (
                    <>
                      <label>Enter OTP</label>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <button onClick={verifyOtpCustom} className="otp-btn">Verify OTP</button>
                    </>
                  )}

                  {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}
                  {otpSentMessage && <p className="info-message">{otpSentMessage}</p>}
                  {loginSuccessMessage && <p className="success-message">{loginSuccessMessage}</p>}
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
                  {fieldErrors.phone && <p className="error">{fieldErrors.phone}</p>}
                </div>
              )}

              {step === 4 && (
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    rows={3}
                    placeholder="Your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
                </div>
              )}

              {step === 5 && (
                <div className="form-group">
                  <label>Select Product</label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
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
                            {product.images?.[0]?.src && (
                              <img
                                src={product.images[0].src}
                                alt={product.title}
                                className="product-image"
                              />
                            )}
                            <span>{product.title}</span>
                          </li>
                        ))
                      ) : (
                        <li>No products found</li>
                      )}
                    </ul>
                  </div>
                  {fieldErrors.selectedProduct && <p className="error">{fieldErrors.selectedProduct}</p>}
                  <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                </div>
              )}

              {step === 6 && (
                <div className="form-group text-center">
                  <h2>Thank You!</h2>
                  <p>Your Warranty Registration is complete.</p>
                  <a href="https://wholesale.ellastein.com/" className="text-blue-600 underline">
                    Go to Ellastein.com
                  </a>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="btn-group">
                {step > 1 && step < 6 && (
                  <button className="prev-btn" onClick={prevStep}>Previous</button>
                )}
                {step < 5 && (
                  <button onClick={nextStep}>Next</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authe;
