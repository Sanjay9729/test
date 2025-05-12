import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Assuming supabaseClient is set up correctly
import "./Authentication.css";

const Authe = () => {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [fullName, setFullName] = useState(""); // Full name state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [submissions, setSubmissions] = useState([]); // Store fetched submissions

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://brilliant-kashata-1d4944.netlify.app/.netlify/functions/products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        // Silent error - no global message
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
      await supabase.auth.getSession(); // No message set
      setLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {});
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase.from("submissions").select("*");
    if (error) {
      console.error("Error fetching submissions:", error);
    } else {
      setSubmissions(data);
    }
  };

  useEffect(() => {
    fetchSubmissions(); // Fetch submissions when the component loads
  }, []);

  const sendOtp = async () => {
    if (!email || !validateEmail(email)) {
      setFieldErrors({ email: "❌ Please enter a valid email." });
      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      await supabase.auth.signOut();
      await supabase.auth.signInWithOtp({ email });
      // Silent success
    } catch (err) {
      // Silent failure
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setFieldErrors({});

    try {
      // Insert data into Supabase
      const { data, error } = await supabase.from("submissions").insert([
        {
          full_name: fullName || null,  // Ensure fullName is included
          email: email || null,
          phone: phone || null,
          address: address || null,
          selected_product: selectedProduct || null,
        },
      ]);
      if (error) {
        console.error("Error submitting data:", error);
      } else {
        setStep(6); // Success step
        fetchSubmissions(); // Fetch new submissions after adding
      }
    } catch (err) {
      console.error("Error submitting data:", err); // Log error if any
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    const errors = {};

    // Validation for each step
    if (step === 1 && !fullName) errors.fullName = "Please enter your full name.";
    if (step === 2 && (!email || !validateEmail(email))) errors.email = "Please enter a valid email.";
    if (step === 3 && !phone) errors.phone = "Please enter your phone number.";
    if (step === 4 && !address) errors.address = "Please enter your address.";
    if (step === 5 && !selectedProduct) errors.selectedProduct = "Please select a product.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
      if (step < 6) setStep(step + 1);
    }
  };

  const prevStep = () => {
    setFieldErrors({});
    if (step > 1) setStep(step - 1);
  };

  const steps = [1, 2, 3, 4, 5, 6];

  const rows = submissions.map((item, index) => (
    <tr key={index}>
      <td>{item.full_name || '—'}</td>
      <td>{item.email || '—'}</td>
      <td>{item.selected_product || '—'}</td>
      <td>{item.phone || '—'}</td>
      <td>{item.address || '—'}</td>
    </tr>
  ));

  return (
    <div className="auth-background">
      <div className="container">
        <div className="card">
          <h2 className="title">Warranty Registration</h2>

          <div className="steps">
            {steps.map((s) => (
              <div
                key={s}
                className={`step-circle ${s === step ? "active" : s < step ? "completed" : ""}`}
              >
                {s < step ? "✓" : s}
              </div>
            ))}
          </div>

          {!loading && (
            <>
              {/* Step 1: Full Name */}
              {step === 1 && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setFieldErrors({});
                    }}
                  />
                  {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
                </div>
              )}

              {/* Step 2: Email */}
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
                        setFieldErrors({});
                      }}
                    />
                    <button onClick={sendOtp} disabled={loading} className="otp-btn">
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  </div>
                  {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}
                </div>
              )}

              {/* Step 3: Phone Number */}
              {step === 3 && (
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setFieldErrors({});
                    }}
                  />
                  {fieldErrors.phone && <p className="error">{fieldErrors.phone}</p>}
                </div>
              )}

              {/* Step 4: Address */}
              {step === 4 && (
                <div className="form-group">
                  <label>Physical Address</label>
                  <textarea
                    rows={3}
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setFieldErrors({});
                    }}
                  />
                  {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
                </div>
              )}

              {/* Step 5: Product Selection */}
              {step === 5 && (
                <div className="form-group">
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
                            onClick={() => {
                              setSelectedProduct(product.title);
                              setFieldErrors({});
                            }}
                          >
                            {product.images?.[0]?.src && (
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
                  {fieldErrors.selectedProduct && (
                    <p className="error">{fieldErrors.selectedProduct}</p>
                  )}
                  <button className="submit-btn" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              )}

              {/* Step 6: Completion */}
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
            </>
          )}
        </div>
      </div>

      {/* Displaying the Submissions Table */}
      <div className="submissions-table">
        <h3>Warranty Registration Submissions</h3>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Product</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Authe;
