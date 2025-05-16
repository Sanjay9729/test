// import React, { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
// import "./Authentication.css";

// const Authe = () => {
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [otpSentMessage, setOtpSentMessage] = useState("");
//   const [loginSuccessMessage, setLoginSuccessMessage] = useState("");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("/.netlify/functions/products");
//         const data = await res.json();
//         setProducts(data);
//         setFilteredProducts(data);
//       } catch (err) {
//         console.error("Product fetch error:", err);
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (productSearch.trim() === "") {
//       setFilteredProducts(products);
//     } else {
//       const filtered = products.filter((p) =>
//         p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
//       );
//       setFilteredProducts(filtered);
//     }
//   }, [productSearch, products]);

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const sendOtpCustom = async () => {
//     setLoading(true);
//     setOtpSentMessage("");
//     setFieldErrors({});

//     if (!email || !validateEmail(email)) {
//       setFieldErrors({ email: "Please enter a valid email format." });
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/.netlify/functions/sendOtp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           full_name: fullName,
//           phone,
//           address,
//           selected_product: selectedProduct,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setFieldErrors({ email: data.error || "OTP sending failed." });
//       } else {
//         setOtpSent(true);
//         setOtpSentMessage("📧 OTP sent to your email.");
//       }
//     } catch (err) {
//       console.error("Send OTP Error:", err);
//       setFieldErrors({ email: "Network error. Try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtpCustom = async () => {
//     setLoading(true);
//     setFieldErrors({});

//     try {
//       const res = await fetch("/.netlify/functions/verifyOtp", {
//         method: "POST",
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setFieldErrors({ email: data.error || "OTP verification failed" });
//       } else {
//         setOtpVerified(true);
//         setLoginSuccessMessage("✅ OTP Verified!");
//       }
//     } catch (err) {
//       console.error("Verify OTP Error:", err);
//       setFieldErrors({ email: "Verification error. Try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setFieldErrors({});

//     if (!selectedProduct) {
//       setFieldErrors({ selectedProduct: "Please select a product." });
//       setLoading(false);
//       return;
//     }

//     try {
//       const { data, error } = await supabase.from('submissions').insert([
//         {
//           address,
//           email,
//           full_name: fullName,
//           phone,
//           selected_product: selectedProduct,
//         },
//       ]);

//       if (error) {
//         console.error("Supabase insert error:", error);
//         setFieldErrors({ submit: error.message });
//         return;
//       }

//       setStep(6); // Thank you screen
//     } catch (err) {
//       console.error("Unexpected submit error:", err);
//       setFieldErrors({ submit: "Submission failed. Try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextStep = () => {
//     const errors = {};
//     if (step === 1 && !fullName) errors.fullName = "Please enter your full name.";
//     if (step === 2) {
//       if (!email || !validateEmail(email)) {
//         errors.email = "Enter a valid email.";
//       } else if (!otpVerified) {
//         errors.email = "Please verify the OTP.";
//       }
//     }
//     if (step === 3 && !phone) errors.phone = "Enter your phone number.";
//     if (step === 4 && !address) errors.address = "Enter your address.";
//     if (step === 5 && !selectedProduct) errors.selectedProduct = "Please select a product.";

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//     } else {
//       if (step < 5) setStep(step + 1);
//     }
//   };

//   const prevStep = () => setStep(step - 1);

//   return (
//     <div className="auth-background">
//       <div className="container">
//         <div className="card">
//           <h2 className="title">Warranty Registration</h2>

//           <div className="steps">
//             {[1, 2, 3, 4, 5, 6].map((s) => (
//               <div
//                 key={s}
//                 className={`step-circle ${s === step ? "active" : s < step ? "completed" : ""}`}
//               >
//                 {s < step ? "✓" : s}
//               </div>
//             ))}
//           </div>

//           {!loading && (
//             <>
//               {step === 1 && (
//                 <div className="form-group">
//                   <label>Full Name</label>
//                   <input
//                     type="text"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                   />
//                   {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
//                 </div>
//               )}

//               {step === 2 && (
//                 <div className="form-group">
//                   <label>Email</label>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => {
//                       setEmail(e.target.value);
//                       setOtp("");
//                       setOtpSent(false);
//                       setOtpVerified(false);
//                       setOtpSentMessage("");
//                       setLoginSuccessMessage("");
//                       setFieldErrors({});
//                     }}
//                   />
//                   <button onClick={sendOtpCustom} className="otp-btn">Send OTP</button>

//                   {otpSent && !otpVerified && (
//                     <>
//                       <label>Enter OTP</label>
//                       <input
//                         type="text"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                       />
//                       <button onClick={verifyOtpCustom} className="otp-btn">Verify OTP</button>
//                     </>
//                   )}

//                   {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}
//                   {otpSentMessage && <p className="info-message">{otpSentMessage}</p>}
//                   {loginSuccessMessage && <p className="success-message">{loginSuccessMessage}</p>}
//                 </div>
//               )}

//               {step === 3 && (
//                 <div className="form-group">
//                   <label>Phone Number</label>
//                   <input
//                     type="tel"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                   />
//                   {fieldErrors.phone && <p className="error">{fieldErrors.phone}</p>}
//                 </div>
//               )}

//               {step === 4 && (
//                 <div className="form-group">
//                   <label>Address</label>
//                   <textarea
//                     rows={3}
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                   />
//                   {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
//                 </div>
//               )}

//               {step === 5 && (
//                 <div className="form-group">
//                   <label>Select Product</label>
//                   <input
//                     type="text"
//                     value={productSearch}
//                     onChange={(e) => setProductSearch(e.target.value)}
//                   />
//                   {selectedProduct && (
//                     <p className="selected-product">✅ Selected: {selectedProduct}</p>
//                   )}
//                   <ul className="product-list">
//                     {loadingProducts ? (
//                       <li>Loading...</li>
//                     ) : filteredProducts.length > 0 ? (
//                       filteredProducts.map((product) => (
//                         <li
//                           key={product.id}
//                           className={`product-item ${selectedProduct === product.title ? "selected" : ""}`}
//                           onClick={() => setSelectedProduct(product.title)}
//                         >
//                           {product.images?.[0]?.src && (
//                             <img src={product.images[0].src} alt={product.title} className="product-image" />
//                           )}
//                           <span>{product.title}</span>
//                         </li>
//                       ))
//                     ) : (
//                       <li>No products found</li>
//                     )}
//                   </ul>
//                   {fieldErrors.selectedProduct && <p className="error">{fieldErrors.selectedProduct}</p>}
//                   {fieldErrors.submit && <p className="error">{fieldErrors.submit}</p>}
//                   <button className="submit-btn" onClick={handleSubmit}>Submit</button>
//                 </div>
//               )}

//               {step === 6 && (
//                 <div className="form-group text-center">
//                   <h2>Thank You!</h2>
//                   <p>Your Warranty Registration is complete.</p>
//                   <a href="https://wholesale.ellastein.com/" className="text-blue-600 underline">
//                     Go to Ellastein.com
//                   </a>
//                 </div>
//               )}

//               <div className="btn-group">
//                 {step > 1 && step < 6 && <button onClick={prevStep}>Previous</button>}
//                 {step < 5 && <button onClick={nextStep}>Next</button>}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Authe;





import React, { useState, useEffect } from 'react';
import { Client, Account, Databases, ID } from 'appwrite';
import './Authentication.css';

const Authe = () => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [authMessage, setAuthMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const APPWRITE_URL = 'https://appwrite.appunik-team.com/v1';
  const APPWRITE_PROJECT_ID = '68271c3c000854f08575';
  const APPWRITE_DATABASE_ID = '68271db80016565f6882';

  const client = new Client().setEndpoint(APPWRITE_URL).setProject(APPWRITE_PROJECT_ID);
  const account = new Account(client);
  const database = new Databases(client);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/.netlify/functions/products');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Product fetch error:', err);
        setFieldErrors({ products: 'Failed to load products. Try again.' });
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (productSearch.trim() === '') {
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
      try {
        const session = await account.get();
        if (session) {
          setIsAuthenticated(true);
          setAuthMessage('✅ You are logged in');
          setEmail(session.email);
        }
      } catch (err) {
        if (err.code !== 401) console.error('Check session error:', err);
      }
    };
    checkSession();
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendOtp = async () => {
    setLoading(true);
    setAuthMessage('');
    setFieldErrors({});

    if (!email || !validateEmail(email)) {
      setFieldErrors({ email: 'Please enter a valid email format.' });
      setLoading(false);
      return;
    }

    try {
      localStorage.setItem('email', email);
      await account.createEmailToken(email); // ✅ No userId
      setAuthMessage('📧 OTP sent to your email. Check your inbox or spam folder.');
    } catch (err) {
      console.error('Send OTP Error:', err);
      setFieldErrors({ email: 'Failed to send OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    await sendOtp();
  };

  const verifyOtp = async () => {
    setLoading(true);
    setFieldErrors({});

    if (!otp || otp.length !== 6) {
      setFieldErrors({ otp: 'Please enter a valid 6-digit OTP.' });
      setLoading(false);
      return;
    }

    try {
      const emailStored = localStorage.getItem('email');
      if (!emailStored) {
        setFieldErrors({ otp: 'Email not found. Please send OTP again.' });
        setLoading(false);
        return;
      }

      await account.createEmailSession(emailStored, otp); // ✅ Correct method
      setIsAuthenticated(true);
      setAuthMessage('✅ Email verified successfully!');
      nextStep();
    } catch (err) {
      console.error('Verify OTP Error:', err);
      setFieldErrors({
        otp: err.code === 401
          ? 'Invalid or expired OTP. Please try resending OTP.'
          : 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    const errors = {};
    if (step === 1 && !fullName) errors.fullName = 'Please enter your full name.';
    if (step === 2) {
      if (!email || !validateEmail(email)) {
        errors.email = 'Enter a valid email.';
      } else if (!isAuthenticated) {
        errors.email = 'Please verify your email with OTP.';
      }
    }
    if (step === 3 && !phone) errors.phone = 'Enter your phone number.';
    if (step === 4 && !address) errors.address = 'Enter your address.';
    if (step === 5 && !selectedProduct) errors.selectedProduct = 'Please select a product.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
    } else {
      if (step < 5) setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setFieldErrors({});

    if (!selectedProduct) {
      setFieldErrors({ selectedProduct: 'Please select a product.' });
      setLoading(false);
      return;
    }

    try {
      const session = await account.get();
      if (!session) {
        setFieldErrors({ submit: 'User not authenticated.' });
        setLoading(false);
        return;
      }

      await database.createDocument(
        APPWRITE_DATABASE_ID,
        'submissions',
        ID.unique(),
        {
          address,
          email,
          full_name: fullName,
          phone,
          selected_product: selectedProduct,
          user_id: session.$id,
        }
      );

      setStep(6);
    } catch (err) {
      console.error('Submit Error:', err);
      setFieldErrors({ submit: 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await account.deleteSession('current');
      setIsAuthenticated(false);
      setAuthMessage('');
      setOtp('');
      localStorage.removeItem('email');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="auth-background">
      <div className="container">
        <div className="card">
          <h2 className="title">Warranty Registration</h2>

          <div className="steps">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`step-circle ${s === step ? 'active' : s < step ? 'completed' : ''}`}
              >
                {s < step ? '✓' : s}
              </div>
            ))}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {step === 1 && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
                </div>
              )}

              {step === 2 && (
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setOtp('');
                      setIsAuthenticated(false);
                      setAuthMessage('');
                      setFieldErrors({});
                    }}
                    disabled={isAuthenticated}
                  />

                  {!isAuthenticated ? (
                    <>
                      <button onClick={sendOtp} className="otp-btn" disabled={loading}>
                        Send OTP
                      </button>
                      <button onClick={resendOtp} className="otp-btn" disabled={loading}>
                        Resend OTP
                      </button>
                    </>
                  ) : (
                    <button onClick={handleSignOut} className="otp-btn">
                      Sign Out
                    </button>
                  )}

                  {!isAuthenticated && authMessage && (
                    <>
                      <label>Enter OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                      />
                      <button onClick={verifyOtp} className="otp-btn" disabled={loading}>
                        Verify OTP
                      </button>
                    </>
                  )}

                  {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}
                  {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
                  {authMessage && (
                    <p className={isAuthenticated ? 'success-message' : 'info-message'}>
                      {authMessage}
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
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
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                  />
                  {selectedProduct && (
                    <p className="selected-product">✅ Selected: {selectedProduct}</p>
                  )}
                  <ul className="product-list">
                    {loadingProducts ? (
                      <li>Loading products...</li>
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <li
                          key={product.id}
                          className={`product-item ${selectedProduct === product.title ? 'selected' : ''}`}
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
                  {fieldErrors.selectedProduct && (
                    <p className="error">{fieldErrors.selectedProduct}</p>
                  )}
                  {fieldErrors.submit && <p className="error">{fieldErrors.submit}</p>}
                  {fieldErrors.products && <p className="error">{fieldErrors.products}</p>}
                  <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                    Submit
                  </button>
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

              <div className="btn-group">
                {step > 1 && step < 6 && (
                  <button onClick={prevStep} disabled={loading}>
                    Previous
                  </button>
                )}
                {step < 5 && (
                  <button onClick={nextStep} disabled={loading}>
                    Next
                  </button>
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




