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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsLoggedIn(true);
      }

      setIsInitializing(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setIsLoggedIn(true);
        setMessage("✅ Login Successful!");
        setStep(3);
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://brilliant-kashata-1d4944.netlify.app/.netlify/functions/products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error(err);
        if (step === 5) {
          setMessage("❌ Failed to load products.");
        }
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [step]);

  useEffect(() => {
    if (productSearch.trim() === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) =>
          p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
        )
      );
    }
  }, [productSearch, products]);

  useEffect(() => {
    setMessage("");
  }, [email]);

  const sendOtp = async () => {
    if (!email) {
      setMessage("❌ Please enter a valid email.");
      return;
    }

    setIsSendingOtp(true);
    setMessage("");

    try {
      await supabase.auth.signOut();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setMessage("❌ " + error.message);
      } else {
        setMessage("📧 OTP sent! Check your email and click the link.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    } finally {
      setIsSendingOtp(false);
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

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        "https://brilliant-kashata-1d4944.netlify.app/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName,
            email,
            phone,
            address,
            product: selectedProduct,
            image: capturedImage,
          }),
        }
      );
  
      const result = await res.json();
  
      if (res.ok && result.success) {
        setMessage("✅ Form submitted successfully!");
        setStep(6); // Move to final step
      } else {
        throw new Error(result.error || "Form submission failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Network error. Please try again.");
    }
  };
  
  if (isInitializing) {
    return (
      <div className="auth-background">
        <div className="container">
          <div className="card">
            <h2 className="title">Warranty Registration</h2>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-background">
      <div className="container">
        <div className="card">
          <h2 className="title">Warranty Registration</h2>

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
                  className="otp-btn"
                  onClick={sendOtp}
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? "Sending..." : "Send OTP"}
                </button>
              </div>
              {message && (
                <p className={`message ${message.startsWith("❌") ? "error" : "success"}`}>
                  {message}
                </p>
              )}
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
              <label>Address</label>
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
              <label>Take a Picture</label>
              <input type="file" accept="image/*" onChange={handleCapture} />
              {capturedImage && (
                <img src={capturedImage} alt="Captured" className="image-preview" />
              )}
              <label>Search & Select Product</label>
              <input
                type="text"
                placeholder="Type product name..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
              {selectedProduct && <p>✅ Selected: {selectedProduct}</p>}
              <ul className="product-list">
                {isLoadingProducts ? (
                  <li>Loading products...</li>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <li
                      key={product.id}
                      className={selectedProduct === product.title ? "selected" : ""}
                      onClick={() => setSelectedProduct(product.title)}
                    >
                      {product.images?.[0]?.src && (
                        <img src={product.images[0].src} alt={product.title} />
                      )}
                      {product.title}
                    </li>
                  ))
                ) : (
                  <li>No products found</li>
                )}
              </ul>
            </div>
          )}

          {step === 6 && (
            <div className="form-group">
              <h2>Final Step</h2>
              <p>Click the button below to complete your warranty registration.</p>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              {submitMessage && (
                <p className={`message ${submitMessage.startsWith("❌") ? "error" : "success"}`}>
                  {submitMessage}
                </p>
              )}
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
        </div>
      </div>
    </div>
  );
};

export default Authe;
