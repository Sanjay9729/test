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





// import React, { useState, useEffect } from 'react';
// import { Client, Account, Databases, ID } from 'appwrite';
// import './Authentication.css';

// const Authe = () => {
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [selectedProduct, setSelectedProduct] = useState('');
//   const [productSearch, setProductSearch] = useState('');
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [authMessage, setAuthMessage] = useState('');
//   const [otp, setOtp] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const APPWRITE_URL = 'https://appwrite.appunik-team.com/v1';
//   const APPWRITE_PROJECT_ID = '68271c3c000854f08575';
//   const APPWRITE_DATABASE_ID = '68271db80016565f6882';

//   const client = new Client()
//     .setEndpoint(APPWRITE_URL)
//     .setProject(APPWRITE_PROJECT_ID);
//   const account = new Account(client);
//   const database = new Databases(client);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch('/.netlify/functions/products');
//         const data = await res.json();
//         setProducts(data);
//         setFilteredProducts(data);
//       } catch (err) {
//         console.error('Product fetch error:', err);
//         setFieldErrors({ products: 'Failed to load products. Try again.' });
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (productSearch.trim() === '') {
//       setFilteredProducts(products);
//     } else {
//       const filtered = products.filter((p) =>
//         p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
//       );
//       setFilteredProducts(filtered);
//     }
//   }, [productSearch, products]);

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const session = await account.get();
//         if (session) {
//           setIsAuthenticated(true);
//           setAuthMessage('✅ You are logged in');
//           setEmail(session.email);
//         }
//       } catch (err) {
//         // Only log non-401 errors, as 401 is expected when no session exists
//         if (err.code !== 401) {
//           console.error('Check session error:', err);
//         }
//       }
//     };
//     checkSession();
//   }, [account]);

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const sendOtp = async () => {
//     setLoading(true);
//     setAuthMessage('');
//     setFieldErrors({});

//     if (!email || !validateEmail(email)) {
//       setFieldErrors({ email: 'Please enter a valid email format.' });
//       setLoading(false);
//       return;
//     }

//     try {
//       // Use existing userId from localStorage if available, otherwise generate new
//       let userId = localStorage.getItem('userId');
//       if (!userId) {
//         userId = `user-${Date.now()}`;
//         localStorage.setItem('userId', userId);
//       }
//       localStorage.setItem('email', email);

//       console.log('Sending OTP for:', { userId, email });
//       await account.createEmailToken(userId, email);

//       setAuthMessage('📧 OTP sent to your email. Check your inbox or spam folder.');
//     } catch (err) {
//       console.error('Send OTP Error:', err);
//       setFieldErrors({ email: 'Failed to send OTP. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resendOtp = async () => {
//     setLoading(true);
//     setAuthMessage('');
//     setFieldErrors({});

//     try {
//       const userId = localStorage.getItem('userId');
//       if (!userId) {
//         setFieldErrors({ email: 'User ID not found. Please send OTP again.' });
//         setLoading(false);
//         return;
//       }

//       console.log('Resending OTP for:', { userId, email });
//       await account.createEmailToken(userId, email);

//       setAuthMessage('📧 OTP resent successfully.');
//     } catch (err) {
//       console.error('Resend OTP Error:', err);
//       setFieldErrors({ email: 'Failed to resend OTP. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

// const verifyOtp = async () => {
//   setLoading(true);
//   setFieldErrors({});
//   setAuthMessage('');

//   // Trim and validate OTP
//   const trimmedOtp = otp.trim();
//   if (!trimmedOtp || trimmedOtp.length !== 6 || !/^\d{6}$/.test(trimmedOtp)) {
//     setFieldErrors({ otp: 'Please enter a valid 6-digit OTP.' });
//     setLoading(false);
//     return;
//   }
// console.log('OTP being sent:', trimmedOtp);
//   // Retrieve userId and email
//   const userId = localStorage.getItem('userId');
//   const email = localStorage.getItem('email');
//   if (!userId || !email) {
//     setFieldErrors({ otp: 'User ID or email not found. Please send OTP again.' });
//     setLoading(false);
//     return;
//   }

//   try {
//     console.log('Verifying OTP with:', { userId, email, otp: trimmedOtp });

//     // Check for existing sessions
//     try {
//       const session = await account.getSession('current');
//       console.log('Existing session found, deleting:', session);
//       await account.deleteSession('current');
//     } catch (err) {
//       console.log('No existing session or error:', err);
//     }

//     // Verify OTP and create session
//     await account.createSession(userId, trimmedOtp);
//     console.log('Session created successfully');
//     setIsAuthenticated(true);
//     setAuthMessage('✅ Email verified successfully!');
//     nextStep();
//   } catch (err) {
//     console.error('Verify OTP Error:', {
//       code: err.code,
//       message: err.message,
//       response: err.response,
//       type: err.type,
//       fullError: JSON.stringify(err, null, 2),
//     });
//     setFieldErrors({ otp: err.message || 'Failed to verify OTP. Please try again.' });
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setFieldErrors({});

//     if (!selectedProduct) {
//       setFieldErrors({ selectedProduct: 'Please select a product.' });
//       setLoading(false);
//       return;
//     }

//     try {
//       const session = await account.get();
//       if (!session) {
//         setFieldErrors({ submit: 'User not authenticated.' });
//         setLoading(false);
//         return;
//       }

//       await database.createDocument(
//         APPWRITE_DATABASE_ID,
//         'submissions',
//         ID.unique(),
//         {
//           address,
//           email,
//           full_name: fullName,
//           phone,
//           selected_product: selectedProduct,
//           user_id: session.$id,
//         }
//       );

//       setStep(6);
//     } catch (err) {
//       console.error('Unexpected submit error:', err);
//       setFieldErrors({ submit: 'Submission failed. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextStep = () => {
//     const errors = {};
//     if (step === 1 && !fullName) errors.fullName = 'Please enter your full name.';
//     if (step === 2) {
//       if (!email || !validateEmail(email)) {
//         errors.email = 'Enter a valid email.';
//       } else if (!isAuthenticated) {
//         errors.email = 'Please verify your email with OTP.';
//       }
//     }
//     if (step === 3 && !phone) errors.phone = 'Enter your phone number.';
//     if (step === 4 && !address) errors.address = 'Enter your address.';
//     if (step === 5 && !selectedProduct) errors.selectedProduct = 'Please select a product.';

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//     } else {
//       if (step < 5) setStep(step + 1);
//     }
//   };

//   const prevStep = () => setStep(step - 1);

//   const handleSignOut = async () => {
//     try {
//       await account.deleteSession('current');
//       setIsAuthenticated(false);
//       setAuthMessage('');
//       setOtp('');
//       localStorage.removeItem('userId');
//       localStorage.removeItem('email');
//     } catch (err) {
//       console.error('Sign out error:', err);
//     }
//   };

//   return (
//     <div className="auth-background">
//       <div className="container">
//         <div className="card">
//           <h2 className="title">Warranty Registration</h2>

//           <div className="steps">
//             {[1, 2, 3, 4, 5, 6].map((s) => (
//               <div
//                 key={s}
//                 className={`step-circle ${s === step ? 'active' : s < step ? 'completed' : ''}`}
//               >
//                 {s < step ? '✓' : s}
//               </div>
//             ))}
//           </div>

//           {loading ? (
//             <p>Loading...</p>
//           ) : (
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
//                       setOtp('');
//                       setIsAuthenticated(false);
//                       setAuthMessage('');
//                       setFieldErrors({});
//                     }}
//                     disabled={isAuthenticated}
//                   />

//                   {!isAuthenticated ? (
//                     <>
//                       <button onClick={sendOtp} className="otp-btn" disabled={loading}>
//                         Send OTP
//                       </button>
//                       <button onClick={resendOtp} className="otp-btn" disabled={loading}>
//                         Resend OTP
//                       </button>
//                     </>
//                   ) : (
//                     <button onClick={handleSignOut} className="otp-btn">
//                       Sign Out
//                     </button>
//                   )}

//                   {!isAuthenticated && authMessage && (
//                     <>
//                       <label>Enter OTP</label>
//                       <input
//                         type="text"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         maxLength={6}
//                       />
//                       <button onClick={verifyOtp} className="otp-btn" disabled={loading}>
//                         Verify OTP
//                       </button>
//                     </>
//                   )}

//                   {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}
//                   {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//                   {authMessage && <p className={isAuthenticated ? "success-message" : "info-message"}>{authMessage}</p>}
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
//                     placeholder="Search products..."
//                   />
//                   {selectedProduct && (
//                     <p className="selected-product">✅ Selected: {selectedProduct}</p>
//                   )}
//                   <ul className="product-list">
//                     {loadingProducts ? (
//                       <li>Loading products...</li>
//                     ) : filteredProducts.length > 0 ? (
//                       filteredProducts.map((product) => (
//                         <li
//                           key={product.id}
//                           className={`product-item ${selectedProduct === product.title ? 'selected' : ''}`}
//                           onClick={() => setSelectedProduct(product.title)}
//                         >
//                           {product.images?.[0]?.src && (
//                             <img
//                               src={product.images[0].src}
//                               alt={product.title}
//                               className="product-image"
//                             />
//                           )}
//                           <span>{product.title}</span>
//                         </li>
//                       ))
//                     ) : (
//                       <li>No products found</li>
//                     )}
//                   </ul>
//                   {fieldErrors.selectedProduct && (
//                     <p className="error">{fieldErrors.selectedProduct}</p>
//                   )}
//                   {fieldErrors.submit && <p className="error">{fieldErrors.submit}</p>}
//                   {fieldErrors.products && <p className="error">{fieldErrors.products}</p>}
//                   <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
//                     Submit
//                   </button>
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
//                 {step > 1 && step < 6 && (
//                   <button onClick={prevStep} disabled={loading}>
//                     Previous
//                   </button>
//                 )}
//                 {step < 5 && (
//                   <button onClick={nextStep} disabled={loading}>
//                     Next
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Authe;




// 19/05/25


// import React, { useState, useEffect } from 'react';
// import { Client, Account, Databases, ID } from 'appwrite';
// import './Authentication.css';

// const Authe = () => {
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [selectedProduct, setSelectedProduct] = useState('');
//   const [productSearch, setProductSearch] = useState('');
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [authMessage, setAuthMessage] = useState('');
//   const [otp, setOtp] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // NEW: Track if user just verified OTP now
//   const [justVerified, setJustVerified] = useState(false);

//   const APPWRITE_ENDPOINT = 'https://appwrite.appunik-team.com/v1';
//   const APPWRITE_PROJECT_ID = '68271c3c000854f08575';
//   const APPWRITE_DATABASE_ID = '68271db80016565f6882';
//   const APPWRITE_COLLECTION_ID = '68271dcf002c6797363d';

//   const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
//   const account = new Account(client);
//   const database = new Databases(client);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch('/.netlify/functions/products');
//         const data = await res.json();
//         setProducts(data);
//         setFilteredProducts(data);
//       } catch {
//         setFieldErrors({ products: 'Failed to load products.' });
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     setFilteredProducts(
//       productSearch.trim() === ''
//         ? products
//         : products.filter((p) =>
//             p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
//           )
//     );
//   }, [productSearch, products]);

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const session = await account.get();
//         setIsAuthenticated(true);
//         setEmail(session.email);
//         localStorage.setItem('userId', session.$id);
//         localStorage.setItem('email', session.email);
//         setJustVerified(false); // Reset here, user is logged in from saved session
//       } catch {}
//     };
//     checkSession();
//   }, []);

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const sendOtp = async () => {
//     setLoading(true);
//     setFieldErrors({});
//     setAuthMessage('');

//     if (!email || !validateEmail(email)) {
//       setFieldErrors({ email: 'Enter a valid email address.' });
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await account.createEmailToken(ID.unique(), email);
//       localStorage.setItem('userId', response.userId);
//       setAuthMessage('📧 OTP sent to your email.');
//     } catch (err) {
//       setFieldErrors({ email: err.message || 'Failed to send OTP.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async () => {
//     setLoading(true);
//     setFieldErrors({});
//     setAuthMessage('');

//     const userId = localStorage.getItem('userId');
//     const secret = otp.trim();

//     if (!userId || !secret) {
//       setFieldErrors({ otp: 'Enter a valid OTP.' });
//       setLoading(false);
//       return;
//     }

//     try {
//       await account.createSession(userId, secret);
//       setIsAuthenticated(true);
//       setAuthMessage('✅ Verified and logged in!');
//       setJustVerified(true); // Mark OTP just verified
//       nextStep();
//     } catch (err) {
//       setFieldErrors({ otp: 'Invalid OTP. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//     setFieldErrors({ ...fieldErrors, otp: '' });
//     setAuthMessage('');
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setFieldErrors({});

//     if (!selectedProduct) {
//       setFieldErrors({ selectedProduct: 'Please select a product.' });
//       setLoading(false);
//       return;
//     }

//     try {
//       const session = await account.get();
//       const document = {
//         full_name: fullName,
//         email,
//         phone,
//         address,
//         selected_product: selectedProduct,
//         user_id: session.$id,
//       };

//       await database.createDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, ID.unique(), document);

//       await fetch('/.netlify/functions/sendToShopify', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           full_name: fullName,
//           email,
//           phone,
//           address,
//           selected_product: selectedProduct,
//         }),
//       });

//       setStep(6);
//     } catch (err) {
//       console.error('Submission error:', err);
//       setFieldErrors({ submit: 'Submission failed. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextStep = () => {
//     const errors = {};
//     if (step === 1 && !fullName) errors.fullName = 'Enter your full name.';
//     if (step === 2 && !isAuthenticated) errors.email = 'Verify email with OTP.';
//     if (step === 3 && !phone) errors.phone = 'Enter phone number.';
//     if (step === 4 && !address) errors.address = 'Enter address.';
//     if (step === 5 && !selectedProduct) errors.selectedProduct = 'Select a product.';

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//     } else {
//       setStep(step + 1);
//     }
//   };

//   const prevStep = () => setStep(step - 1);

//   const handleSignOut = async () => {
//     try {
//       await account.deleteSession('current');
//       setIsAuthenticated(false);
//       setAuthMessage('');
//       setOtp('');
//       setJustVerified(false); // Reset on logout
//       localStorage.clear();
//     } catch (err) {
//       console.error('Sign out error:', err);
//     }
//   };

//   return (
//     <div className="auth-background">
//       <div className="container">
//         <div className="card">
//           <h2 className="title">Warranty Registration</h2>

//           <div className="steps">
//             {[1, 2, 3, 4, 5, 6].map((s) => (
//               <div
//                 key={s}
//                 className={`step-circle ${s === step ? 'active' : s < step ? 'completed' : ''}`}
//               >
//                 {s < step ? '✓' : s}
//               </div>
//             ))}
//           </div>

//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             <>
//               {step === 1 && (
//                 <div className="form-group">
//                   <label>Full Name</label>
//                   <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
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
//     setEmail(e.target.value);
//     setFieldErrors({ ...fieldErrors, email: '' });
//   }}
//                     placeholder="Enter your email"
//                   />
//                   {isAuthenticated ? (
//                     <>
//                       <button
//                         onClick={handleSignOut}
//                         className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-black transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
//                       >
//                         Sign Out
//                       </button>

//                       {/* Show only one message at a time */}
//                       {justVerified ? (
//                         <div className="mt-2 text-base text-green-700 font-semibold">
//                           ✅ Verified and logged in!
//                         </div>
//                       ) : (
//                         <div className="mt-2 text-blue-600">
//                           <h2 className="text-base ">✅ Already logged in!</h2>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <>
//                       <button onClick={sendOtp} className="otp-btn mt-2 mb-2">
//                         Send OTP
//                       </button>
//                       <input
//                         placeholder="Enter OTP"
//                         value={otp}
//                         onChange={handleOtpChange}
//                         maxLength={6}
//                       />
//                       <button onClick={verifyOtp} className="otp-btn mt-2">
//                         Verify OTP
//                       </button>
//                     </>
//                   )}
//                   {fieldErrors.email && !isAuthenticated && (
//                     <div className="error">{fieldErrors.email}</div>
//                   )}
//                   {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}

//                   {/* Show OTP sent message only if NOT authenticated */}
//                   {!isAuthenticated && authMessage && (
//                     <p className="info-message">{authMessage}</p>
//                   )}
//                 </div>
//               )}

//               {step === 3 && (
//                 <div className="form-group">
//                   <label>Phone Number</label>
//                   <input value={phone} onChange={(e) => setPhone(e.target.value)} />
//                   {fieldErrors.phone && <p className="error">{fieldErrors.phone}</p>}
//                 </div>
//               )}

//               {step === 4 && (
//                 <div className="form-group">
//                   <label>Address</label>
//                   <textarea value={address} onChange={(e) => setAddress(e.target.value)} />
//                   {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
//                 </div>
//               )}

//               {step === 5 && (
//                 <div className="form-group">
//                   <label>Select Product</label>
//                   <input
//                     value={productSearch}
//                     onChange={(e) => setProductSearch(e.target.value)}
//                     placeholder="Search products..."
//                   />
//                   <ul className="product-list">
//                     {loadingProducts ? (
//                       <li>Loading...</li>
//                     ) : (
//                       filteredProducts.map((product) => (
//                        <li
//                         key={product.id}
//                         className={`product-item flex items-center ${selectedProduct === product.title ? 'selected' : ''}`}
//                         onClick={() => setSelectedProduct(product.title)}
//                       >

//                           {product.images?.[0]?.src && (
//                             <img src={product.images[0].src} alt={product.title} className="product-image" />
//                           )}
//                           <span>{product.title}</span>
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                   {fieldErrors.selectedProduct && <p className="error">{fieldErrors.selectedProduct}</p>}
//                   {fieldErrors.submit && <p className="error">{fieldErrors.submit}</p>}
//                 </div>
//               )}

//               {step === 6 && (
//               <div className="max-w-md mx-auto p-6 text-left">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-2">Thank You!</h2>
//                 <p className="text-gray-600 mb-4">Your Warranty Registration is complete.</p>
//                 <a
//                   href="https://wholesale.ellastein.com/"
//                   className="inline-block px-5 py-2 text-black rounded"
//                 >
//                   Ellastein.com
//                 </a>
//               </div>
//               )}
//               <div className="btn-group">
//                 {step > 1 && step < 6 && <button onClick={prevStep}>Previous</button>}
//                 {step < 5 && <button onClick={nextStep}>Next</button>}
//                 {step === 5 && (
//                   <button onClick={handleSubmit} className="submit-btn">
//                     Submit
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Authe;



// 28-05-25



// import React, { useState, useEffect } from "react";
// import { Client, Account, Databases, ID } from "appwrite";
// import "./Authentication.css";
// import PhoneNumberStep from './PhoneNumberStep';
// import countryData from '../data/countryData';
// import React, { useState, useEffect } from 'react';
// import { Client, Account, Databases, ID } from 'appwrite';
// import './Authentication.css';

// const Authe = () => {
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [selectedProduct, setSelectedProduct] = useState('');
//   const [productSearch, setProductSearch] = useState('');
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [authMessage, setAuthMessage] = useState('');
//   const [otp, setOtp] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // NEW: Track if user just verified OTP now
//   const [justVerified, setJustVerified] = useState(false);

//   const APPWRITE_ENDPOINT = 'https://appwrite.appunik-team.com/v1';
//   const APPWRITE_PROJECT_ID = '68271c3c000854f08575';
//   const APPWRITE_DATABASE_ID = '68271db80016565f6882';
//   const APPWRITE_COLLECTION_ID = '68271dcf002c6797363d';

//   const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
//   const account = new Account(client);
//   const database = new Databases(client);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch('/.netlify/functions/products');
//         const data = await res.json();
//         setProducts(data);
//         setFilteredProducts(data);
//       } catch {
//         setFieldErrors({ products: 'Failed to load products.' });
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     setFilteredProducts(
//       productSearch.trim() === ''
//         ? products
//         : products.filter((p) =>
//             p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
//           )
//     );
//   }, [productSearch, products]);

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const session = await account.get();
//         setIsAuthenticated(true);
//         setEmail(session.email);
//         localStorage.setItem('userId', session.$id);
//         localStorage.setItem('email', session.email);
//         setJustVerified(false); // Reset here, user is logged in from saved session
//       } catch {}
//     };
//     checkSession();
//   }, []);

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const sendOtp = async () => {
//     setLoading(true);
//     setFieldErrors({});
//     setAuthMessage('');

//     if (!email || !validateEmail(email)) {
//       setFieldErrors({ email: 'Enter a valid email address.' });
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await account.createEmailToken(ID.unique(), email);
//       localStorage.setItem('userId', response.userId);
//       setAuthMessage('📧 OTP sent to your email.');
//     } catch (err) {
//       setFieldErrors({ email: err.message || 'Failed to send OTP.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async () => {
//     setLoading(true);
//     setFieldErrors({});
//     setAuthMessage('');

//     const userId = localStorage.getItem('userId');
//     const secret = otp.trim();

//     if (!userId || !secret) {
//       setFieldErrors({ otp: 'Enter a valid OTP.' });
//       setLoading(false);
//       return;
//     }

//     try {
//       await account.createSession(userId, secret);
//       setIsAuthenticated(true);
//       setAuthMessage('✅ Verified and logged in!');
//       setJustVerified(true); // Mark OTP just verified
//       nextStep();
//     } catch (err) {
//       setFieldErrors({ otp: 'Invalid OTP. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//     setFieldErrors({ ...fieldErrors, otp: '' });
//     setAuthMessage('');
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setFieldErrors({});

//     if (!selectedProduct) {
//       setFieldErrors({ selectedProduct: 'Please select a product.' });
//       setLoading(false);
//       return;
//     }

//     try {
//       const session = await account.get();
//       const document = {
//         full_name: fullName,
//         email,
//         phone,
//         address,
//         selected_product: selectedProduct,
//         user_id: session.$id,
//       };

//       await database.createDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, ID.unique(), document);

//       await fetch('/.netlify/functions/sendToShopify', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           full_name: fullName,
//           email,
//           phone,
//           address,
//           selected_product: selectedProduct,
//         }),
//       });

//       setStep(6);
//     } catch (err) {
//       console.error('Submission error:', err);
//       setFieldErrors({ submit: 'Submission failed. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextStep = () => {
//     const errors = {};
//     if (step === 1 && !fullName) errors.fullName = 'Enter your full name.';
//     if (step === 2 && !isAuthenticated) errors.email = 'Verify email with OTP.';
//     if (step === 3 && !phone) errors.phone = 'Enter phone number.';
//     if (step === 4 && !address) errors.address = 'Enter address.';
//     if (step === 5 && !selectedProduct) errors.selectedProduct = 'Select a product.';

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//     } else {
//       setStep(step + 1);
//     }
//   };

//   const prevStep = () => setStep(step - 1);

//   const handleSignOut = async () => {
//     try {
//       await account.deleteSession('current');
//       setIsAuthenticated(false);
//       setAuthMessage('');
//       setOtp('');
//       setJustVerified(false); // Reset on logout
//       localStorage.clear();
//     } catch (err) {
//       console.error('Sign out error:', err);
//     }
//   };

//   return (
//     <div className="auth-background">
//       <div className="container">
//         <div className="card">
//           <h2 className="title">Warranty Registration</h2>

//           <div className="steps">
//             {[1, 2, 3, 4, 5, 6].map((s) => (
//               <div
//                 key={s}
//                 className={`step-circle ${s === step ? 'active' : s < step ? 'completed' : ''}`}
//               >
//                 {s < step ? '✓' : s}
//               </div>
//             ))}
//           </div>

//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             <>
//               {step === 1 && (
//                 <div className="form-group">
//                   <label>Full Name</label>
//                   <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
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
//     setEmail(e.target.value);
//     setFieldErrors({ ...fieldErrors, email: '' });
//   }}
//                     placeholder="Enter your email"
//                   />
//                   {isAuthenticated ? (
//                     <>
//                       <button
//                         onClick={handleSignOut}
//                         className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-black transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
//                       >
//                         Sign Out
//                       </button>

//                       {/* Show only one message at a time */}
//                       {justVerified ? (
//                         <div className="mt-2 text-base text-green-700 font-semibold">
//                           ✅ Verified and logged in!
//                         </div>
//                       ) : (
//                         <div className="mt-2 text-blue-600">
//                           <h2 className="text-base ">✅ Already logged in!</h2>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <>
//                       <button onClick={sendOtp} className="otp-btn mt-2 mb-2">
//                         Send OTP
//                       </button>
//                       <input
//                         placeholder="Enter OTP"
//                         value={otp}
//                         onChange={handleOtpChange}
//                         maxLength={6}
//                       />
//                       <button onClick={verifyOtp} className="otp-btn mt-2">
//                         Verify OTP
//                       </button>
//                     </>
//                   )}
//                   {fieldErrors.email && !isAuthenticated && (
//                     <div className="error">{fieldErrors.email}</div>
//                   )}
//                   {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}

//                   {/* Show OTP sent message only if NOT authenticated */}
//                   {!isAuthenticated && authMessage && (
//                     <p className="info-message">{authMessage}</p>
//                   )}
//                 </div>
//               )}

//               {step === 3 && (
//                 <div className="form-group">
//                   <label>Phone Number</label>
//                   <input value={phone} onChange={(e) => setPhone(e.target.value)} />
//                   {fieldErrors.phone && <p className="error">{fieldErrors.phone}</p>}
//                 </div>
//               )}

//               {step === 4 && (
//                 <div className="form-group">
//                   <label>Address</label>
//                   <textarea value={address} onChange={(e) => setAddress(e.target.value)} />
//                   {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
//                 </div>
//               )}

//               {step === 5 && (
//                 <div className="form-group">
//                   <label>Select Product</label>
//                   <input
//                     value={productSearch}
//                     onChange={(e) => setProductSearch(e.target.value)}
//                     placeholder="Search products..."
//                   />
//                   <ul className="product-list">
//                     {loadingProducts ? (
//                       <li>Loading...</li>
//                     ) : (
//                       filteredProducts.map((product) => (
//                        <li
//                         key={product.id}
//                         className={`product-item flex items-center ${selectedProduct === product.title ? 'selected' : ''}`}
//                         onClick={() => setSelectedProduct(product.title)}
//                       >

//                           {product.images?.[0]?.src && (
//                             <img src={product.images[0].src} alt={product.title} className="product-image" />
//                           )}
//                           <span>{product.title}</span>
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                   {fieldErrors.selectedProduct && <p className="error">{fieldErrors.selectedProduct}</p>}
//                   {fieldErrors.submit && <p className="error">{fieldErrors.submit}</p>}
//                 </div>
//               )}

//               {step === 6 && (
//               <div className="max-w-md mx-auto p-6 text-left">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-2">Thank You!</h2>
//                 <p className="text-gray-600 mb-4">Your Warranty Registration is complete.</p>
//                 <a
//                   href="https://wholesale.ellastein.com/"
//                   className="inline-block px-5 py-2 text-black rounded"
//                 >
//                   Ellastein.com
//                 </a>
//               </div>
//               )}
//               <div className="btn-group">
//                 {step > 1 && step < 6 && <button onClick={prevStep}>Previous</button>}
//                 {step < 5 && <button onClick={nextStep}>Next</button>}
//                 {step === 5 && (
//                   <button onClick={handleSubmit} className="submit-btn">
//                     Submit
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Authe;



// 28-05-25



import React, { useState, useEffect } from "react";
import { Client, Account, Databases, ID, Storage } from "appwrite";

import "./Authentication.css";
import PhoneNumberStep from './PhoneNumberStep';
import countryData from '../data/countryData';

const Authe = () => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [justVerified, setJustVerified] = useState(false); const [addressLine1, setAddressLine1] = useState("");

  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  
  
  
  const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
  const APPWRITE_PROJECT_ID = "68271c3c000854f08575";
  const APPWRITE_DATABASE_ID = "68271db80016565f6882";
  const APPWRITE_COLLECTION_ID = "68271dcf002c6797363d";
  
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
  const account = new Account(client);
  const database = new Databases(client);
  const storage = new Storage(client);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileId, setImageFileId] = useState(null);
  
  const APPWRITE_BUCKET_ID = "683e80fc0019228a6d";


const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setSelectedImage(file);
  setImagePreview(URL.createObjectURL(file));

  try {
    const uploaded = await storage.createFile(
      "683e80fc0019228a6dfa", // Replace with your Appwrite bucket ID
      ID.unique(),
      file
    );
    setImageFileId(uploaded.$id);
  } catch (err) {
    console.error("Image upload failed (optional):", err);
        } 
};


  // Updated product fetch logic (only change)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/.netlify/functions/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          setProducts([]);
          setFilteredProducts([]);
          setFieldErrors({ products: "Invalid products data." });
        }
      } catch {
        setProducts([]);
        setFilteredProducts([]);
        setFieldErrors({ products: "Failed to load products." });
        setProducts([]);
        setFilteredProducts([]);
        setFieldErrors({ products: "Failed to load products." });
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!Array.isArray(products)) return;
    setFilteredProducts(
      productSearch.trim() === ""
        ? products
        : products.filter((p) =>
            p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
          )
    );
  }, [productSearch, products]);


  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        setIsAuthenticated(true);
        setEmail(session.email);
        localStorage.setItem("userId", session.$id);
        localStorage.setItem("email", session.email);
        setJustVerified(false);
        localStorage.setItem("userId", session.$id);
        localStorage.setItem("email", session.email);
        setJustVerified(false);
      } catch { }
    };
    checkSession();
  }, []);

const validateStep = (currentStep) => {
  const errors = {};

  if (currentStep === 1 && !fullName.trim()) errors.fullName = "Enter your full name.";
  if (currentStep === 2 && !email.trim()) errors.email = "Enter your email.";
  if (currentStep === 3 && !otp.trim()) errors.otp = "Enter the OTP.";
  if (currentStep === 4 && !phone.trim()) errors.phone = "Enter your phone number."; // ✅ validate phone here
  if (currentStep === 5) {
    if (!addressLine1.trim()) errors.addressLine1 = "Enter address line 1.";
    if (!city.trim()) errors.city = "Enter city.";
    if (!state.trim()) errors.state = "Enter state.";
    if (!zip.trim()) errors.zip = "Enter zip.";
    if (!country.trim()) errors.country = "Enter country.";
  }
  if (currentStep === 6 && !selectedProduct) errors.selectedProduct = "Select a product.";

  setFieldErrors(errors);
  return Object.keys(errors).length === 0;
};



  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 7));
      setFieldErrors({});
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setFieldErrors({});
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

 const sendOtp = async () => {
  setLoading(true);
  setFieldErrors({});
  setAuthMessage("");

  if (!email || !validateEmail(email)) {
    setFieldErrors({ email: "Enter a valid email address." });
    setLoading(false);
    return;
  }

  try {
    const response = await account.createEmailToken(ID.unique(), email);
    localStorage.setItem("userId", response.userId);
    setAuthMessage("📧 OTP sent to your email.");
    setOtpSent(true);

    // 🔥 Move to Step 3 (OTP Entry)
    setStep(3);
  } catch (err) {
    setFieldErrors({ email: err.message || "Failed to send OTP." });
  } finally {
    setLoading(false);
  }
};


  const verifyOtp = async () => {
    setLoading(true);
    setFieldErrors({});
    setAuthMessage("");
    const userId = localStorage.getItem("userId");
    setAuthMessage("");
    const secret = otp.trim();
    if (!userId || !secret) {
      setFieldErrors({ otp: "Enter a valid OTP." });
      setFieldErrors({ otp: "Enter a valid OTP." });
      setLoading(false);
      return;
    }
    try {
      await account.createSession(userId, secret);
      setIsAuthenticated(true);
      setAuthMessage("✅ Verified and logged in!");
      setJustVerified(true);
      setAuthMessage("✅ Verified and logged in!");
      setJustVerified(true);
      nextStep();
    } catch (err) {
      setFieldErrors({ otp: "Invalid OTP. Please try again." });
      setFieldErrors({ otp: "Invalid OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setFieldErrors({ ...fieldErrors, otp: "" });
    setAuthMessage("");
    setFieldErrors({ ...fieldErrors, otp: "" });
    setAuthMessage("");
  };

  const handleSubmit = async () => {
  setLoading(true);
  setFieldErrors({});

  if (!selectedProduct) {
    setFieldErrors({ selectedProduct: "Please select a product." });
    setLoading(false);
    return;
  }

  try {
    const session = await account.get();
    const address = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zip}, ${country}`;

    const document = {
      full_name: fullName,
      email,
      phone,
      address,
      selected_product: selectedProduct,
      user_id: session.$id,
      image_file_id: imageFileId || null // ✅ Will be null if image wasn't uploaded
    };

    // 🔥 Save to Appwrite database
    await database.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      ID.unique(),
      document
    );

    // ✅ Send to Shopify (if needed)
    await fetch("/.netlify/functions/sendToShopify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(document)
    });

    setStep(7); // ✅ Show thank-you step
  } catch (err) {
    console.error("Submission failed:", err);
    setFieldErrors({ submit: "Submission failed. Please try again." });
  } finally {
    setLoading(false);
  }
};


  const handleSignOut = async () => {
    try {
      await account.deleteSession("current");
      await account.deleteSession("current");
      setIsAuthenticated(false);
      setAuthMessage("");
      setOtp("");
      setJustVerified(false);
      setAuthMessage("");
      setOtp("");
      setJustVerified(false);
      localStorage.clear();
    } catch (err) {
      console.error("Sign out error:", err);
      console.error("Sign out error:", err);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="logo-text">ELLA STEIN</div>
      <div className="right-side">
        {step === 1 && (
          <section className="step-section active slide-up">
            <div className="step-label">
              <div className="step_number_main">
                <span className="step-number">1</span>
                <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
              </div>
              Your Full Name:
            </div>
            <input
              type="text"
              placeholder="Type your answer here..."
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="styled-input"
            />
            {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
            <div className="ok-container">
              <button onClick={nextStep} className="ok-button">OK</button>
              <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
            </div>
          </section>
        )}

{step === 2 && (
  <section className="step-section active slide-up">
    <div className="step-label">
      <div className="step_number_main">
        <span className="step-number">2</span>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
            <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </span>
      </div>
      Email Address:
    </div>

    <p className="step-description">Please enter an email address whose inbox you access regularly.</p>

    <input
      type="email"
      placeholder="name@example.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="styled-input"
    />

    {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}

    {!isAuthenticated ? (
      <>
        {/* SEND OTP */}
        <div className="ok-container mb-3">
          <button onClick={sendOtp} className="ok-button" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
          <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
        </div>

        {/* OTP FIELD */}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleOtpChange}
          maxLength={6}
          className="styled-input"
        />

        {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
        {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}

        {/* SIDE BY SIDE BUTTONS */}
        <div className="flex gap-4 mt-3">
          <button
            onClick={verifyOtp}
            disabled={loading}
            className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {otpSent && (
            <button
              onClick={sendOtp}
              disabled={loading}
              className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
            >
              {loading ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </>
    ) : (
      <>
        <button
          onClick={async () => {
            try {
              await account.deleteSession("current");
              setIsAuthenticated(false);
              setAuthMessage("");
              setOtp("");
              setJustVerified(false);
              localStorage.clear();
              setStep(2);
            } catch (err) {
              console.error("Sign out error:", err);
            }
          }}
          className="signout-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
        <p className="success-message">✅ Verified and logged in!</p>
      </>
    )}
  </section>
)}

{step === 3 && (
  <section className="step-section active slide-up">
    <div className="step-label">
      <div className="step_number_main">
        <span className="step-number">3</span>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
            <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </span>
      </div>
      Enter OTP:
    </div>

    <p className="step-description">Enter the OTP sent to {email}.</p>

    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={handleOtpChange}
      maxLength={6}
      className="styled-input"
    />

    {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
    {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}

    <div className="flex gap-4 mt-3">
      <button
        onClick={verifyOtp}
        disabled={loading}
        className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <button
        onClick={sendOtp}
        disabled={loading}
        className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
      >
        {loading ? "Resending..." : "Resend OTP"}
      </button>
    </div>
  </section>
)}


        {step === 4 && (
          <PhoneNumberStep phone={phone} setPhone={setPhone} nextStep={nextStep} fieldErrors={fieldErrors} />
        )}

        {[5, 6, 7].map((num) => (
          <section key={num} className={`step-section ${step === num ? "active slide-up" : "hidden"}`}>
            {num === 5 && (
              <div className="address-step">
                <div className="step-label">
                  <div className="step_number_main">

                    <span className="step-number">5</span>
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
                  </div>
                  Address:
                </div>
                <p>This is the address Ella Stein will use to initiate a pick-up and product replacement.</p>
                <label>Address</label>
                <input type="text" placeholder="65 Hansen Way" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />

                <label>Address line 2</label>
                <input type="text" placeholder="Apartment 4" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />

                <label>City/Town</label>
                <input type="text" placeholder="Palo Alto" value={city} onChange={(e) => setCity(e.target.value)} />

                <label>State/Region/Province</label>
                <input type="text" placeholder="California" value={state} onChange={(e) => setState(e.target.value)} />

                <label>Zip/Post code</label>
                <input type="text" placeholder="94304" value={zip} onChange={(e) => setZip(e.target.value)} />

                <label>Country</label>
                <input type="text" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)} />

                {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
              </div>
            )}
{num === 6 && (
  <>
    <div className="step-label">
      <div className="step_number_main">
        <span className="step-number">6</span>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
            <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </span>
      </div>
      Select Product:
    </div>
<div className="image-upload">
  <label>Upload Product Image (Optional)</label>
  <input type="file" accept="image/*" onChange={handleImageChange} />
  {imagePreview && (
    <img src={imagePreview} alt="Preview" style={{ width: "120px", marginTop: "10px" }} />
  )}
  {fieldErrors.image && <p className="error">{fieldErrors.image}</p>}
</div>

    <input
      value={productSearch}
      onChange={(e) => setProductSearch(e.target.value)}
      placeholder="Search products..."
    />

    <ul className="product-list">
      {loadingProducts ? (
        <li>Loading...</li>
      ) : fieldErrors.products ? (
        <li>{fieldErrors.products}</li>
      ) : (
        filteredProducts.map((product) => (
          <li
            key={product.id}
            className={`product-item ${selectedProduct === product.title ? "selected" : ""}`}
            onClick={() => setSelectedProduct(product.title)}
          >
            {product.images?.[0]?.src && (
              <img src={product.images[0].src} alt={product.title} className="product-image" />
            )}
            <span>{product.title}</span>
          </li>
        ))
      )}
    </ul>

    <p className="error">{fieldErrors.selectedProduct}</p>
    <p className="error">{fieldErrors.submit}</p>
  </>
)}



{step === 7 && (
  <div className="max-w-xl mx-auto mt-32 text-center submission_container">
    {/* Removed the step number and arrow */}
    <h1 className="text-5xl font-semibold text-gray-800 submisiion_headding">
      Thank you for registering your Ella Stein jewelry under our Warranty Program.
    </h1>
    <p className="mt-4 text-base text-gray-600">
      Learn more about caring for your jewelry using the link below.
    </p>
    <p className="mt-6 text-base text-black underline submisiion_button">
      <a className="inline-block px-6 py-3 bg-[#f2e1d1] text-lg font-bold text-gray-800 rounded-md shadow-md hover:bg-[#e0cfbf] transition" href="https://www.ellastein.com/pages/jewelry-care-tips" target="_blank" rel="noreferrer">
        JEWELRY CARE TIPS
      </a>
    </p>
  </div>
)}


          </section>
        ))}

       <div className="btn-group flex justify-between mt-4 gap-4">
  {step > 1 && step < 6 && (
    <button onClick={prevStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
      Previous
    </button>
  )}
  {step < 6 && (
    <button onClick={nextStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
      Next
    </button>
  )}
  {step === 6 && (
    <button onClick={handleSubmit} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800" disabled={loading}>
      {loading ? "Submitting..." : "Submit"}
    </button>
  )}
</div>

      </div>
    </div>
  );
};

export default Authe;




