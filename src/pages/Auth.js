// import React, { useState, useEffect, useRef, useCallback, useMemo} from "react";

// import { Client, Account, Databases, ID, Storage } from "appwrite";
// import "./Authentication.css";
// import PhoneNumberStep from './PhoneNumberStep';

// const Authe = () => {
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [authMessage, setAuthMessage] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userId, setUserId] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [addressLine1, setAddressLine1] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [justVerified, setJustVerified] = useState(false);


//   const [addressLine2, setAddressLine2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [zip, setZip] = useState("");
//   const [country, setCountry] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFileId, setImageFileId] = useState(null);
//   const [sku, setSku] = useState("");

//   const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
//   const APPWRITE_PROJECT_ID = "68271c3c000854f08575";
//   const APPWRITE_DATABASE_ID = "68271db80016565f6882";
//   const APPWRITE_COLLECTION_ID = "68271dcf002c6797363d";
  
//   const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
//   const account = useMemo(() => new Account(client), [client]);
//   const database = new Databases(client);
//   const storage = new Storage(client);
  
//   const APPWRITE_BUCKET_ID = "683e80fc0019228a6dfa";

  
// const handleVisibilityChange = useCallback(() => {
//   if (document.visibilityState === "visible") {
//     console.log("Tab is active again");
//   }
// }, []);



// const handleImageChange = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   setImagePreview(URL.createObjectURL(file));

//   try {
//     // Upload the image directly to Appwrite storage
//     const response = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);

//     // Log the response from Appwrite
//     console.log("Appwrite upload response:", response);

//     if (response && response.$id) {
//       setImageFileId(response.$id);  // Store the file ID returned by Appwrite
//       console.log("Image uploaded successfully. File ID:", response.$id);
//     } else {
//       throw new Error("Failed to upload image. No file ID returned.");
//     }
//   } catch (err) {
//     // Detailed error logging
//     console.error("Upload error:", err);
//     alert("Image upload failed. Check console for more details.");
//   }
// };








//   // Updated product fetch logic (only change)
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("/.netlify/functions/products");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setProducts(data);
//           setFilteredProducts(data);
//         } else {
//           setProducts([]);
//           setFilteredProducts([]);
//           setFieldErrors({ products: "Invalid products data." });
//         }
//       } catch {
//         setProducts([]);
//         setFilteredProducts([]);
//         setProducts([]);
//         setFieldErrors({ products: "Failed to load products." });
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);




//   useEffect(() => {
//     if (!Array.isArray(products)) return;
//     setFilteredProducts(
//       productSearch.trim() === ""
//         ? products
//         : products.filter((p) =>
//             p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
//           )
//     );
//   }, [productSearch, products]);



// // Session auto-refresh function
//   const autoRefreshInterval = useRef(null);

// const startAutoRefresh = useCallback(() => {
//   if (autoRefreshInterval.current) {
//     clearInterval(autoRefreshInterval.current);
//   }

//   autoRefreshInterval.current = setInterval(async () => {
//     try {
//       const session = await account.get();
//       if (!session) {
//         console.log("Session expired, logging out...");
//         setIsAuthenticated(false);
//         localStorage.clear();
//       }
//     } catch (err) {
//       console.error("Session refresh failed:", err);
//       setIsAuthenticated(false);
//       localStorage.clear();
//     }
//   }, 15 * 60 * 1000);
// }, [account]); // 👈 Add dependency



// useEffect(() => {
//   if (isAuthenticated) {
//     startAutoRefresh();
//   }
//   return () => {
//     clearInterval(autoRefreshInterval.current);
//   };
// }, [isAuthenticated, startAutoRefresh]);



//   // Handle visibility change to stop and start auto-refresh
// useEffect(() => {
//   document.addEventListener("visibilitychange", handleVisibilityChange);
//   return () => {
//     document.removeEventListener("visibilitychange", handleVisibilityChange);
//   };
// }, [handleVisibilityChange]); // ✅ Fix: add the dependency






//   // OTP and Email handling
//   const sendOtp = async () => {
//     setLoading(true);
//     setFieldErrors({});
//     setAuthMessage("");

//     if (!email || !validateEmail(email)) {
//       setFieldErrors({ email: "Enter a valid email address." });
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await account.createEmailToken(ID.unique(), email);
//       setUserId(response.userId)
//       // localStorage.setItem("userId", response.userId);
//       console.log(response)
//       setOtp()
//       setAuthMessage("📧 OTP sent to your email.");
//       setOtpSent(true);
//       setStep(3);  // Move to OTP entry step
//     } catch (err) {
//       setFieldErrors({ email: err.message || "Failed to send OTP." });
//     } finally {
//       setLoading(false);
//     }
//   };

// const checkSession = async () => {
//   try {
//     const session = await account.get();
//     if (!session) {
//       setFieldErrors({ otp: "You are not logged in. Please log in first." });
//       return false; // User is not logged in
//     }
//     return true; // User is logged in
//   } catch (err) {
//     console.error("Error checking session:", err);
//     setFieldErrors({ otp: "Failed to verify session. Please try again." });
//     return false;
//   }
// };
// useEffect(() => {
//   const checkSession = async () => {
//     try {
//       const session = await account.get();
//       if (session) {
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//       }
//     } catch (error) {
//       setIsAuthenticated(false);
//       console.error("Error checking session", error);
//     }
//   };

//   checkSession();
// }, []);




// // const verifyOtp = async () => {
// //   setLoading(true);
// //   setFieldErrors({});  // Reset field errors
// //   setAuthMessage("");   // Clear previous auth messages

// //   const userId = localStorage.getItem("userId");
// //   const secret = otp.trim();  // OTP entered by the user

// //   if (!userId || !secret) {
// //     setFieldErrors({ otp: "Enter a valid OTP." });
// //     setLoading(false);
// //     return;
// //   }

// //   try {
// //     // Check if the user is already authenticated by checking the session
// //     let session;
// //     try {
// //       session = await account.get();
// //     } catch (err) {
// //       session = null; // If no session exists, the error will be caught and set to null
// //     }

// //     // If the user is already authenticated, skip OTP verification
// //     if (session) {
// //       setAuthMessage("You are already logged in!");
// //       setIsAuthenticated(true);
// //       nextStep();  // Proceed to the next step
// //       return;  // Stop further execution if the user is already logged in
// //     }

// //     // Proceed with OTP verification only if not authenticated
// //     await account.createSession(userId, secret);  // Create session after OTP verification
// //     setIsAuthenticated(true);  // Mark the user as authenticated
// //     setAuthMessage("✅ Verified and logged in!");  // Success message
// //     setJustVerified(true);
// //     nextStep();  // Proceed to the next step
// //   } catch (err) {
// //     setFieldErrors({ otp: "Invalid OTP. Please try again." });
// //     console.error("Error verifying OTP:", err);
// //   } finally {
// //     setLoading(false);
// //   }
// // };




// const verifyOtp = async () => {
//   setLoading(true);
//   setFieldErrors({});  // Reset field errors
//   setAuthMessage("");   // Clear previous auth messages

//   // const userId = localStorage.getItem("userId");
//   const secret = otp.trim();  // OTP entered by the user

//   if (!userId || !secret) {
//     setFieldErrors({ otp: "Enter a valid OTP." });
//     setLoading(false);
//     return;
//   }

//   try {
//     // Check if the user is already authenticated by checking the session
//     let session;
//     try {
//       session = await account.get();
//     } catch (err) {
//       session = null; // If no session exists, the error will be caught and set to null
//     }

//     // If the user is already authenticated, skip OTP verification
//     if (session) {
//       setAuthMessage("You are already logged in!");
//       setIsAuthenticated(true);
//       nextStep();  // Proceed to the next step
//       return;  // Stop further execution if the user is already logged in
//     }

//     // Proceed with OTP verification only if not authenticated
//     await account.createSession(userId, secret);  // Create session after OTP verification
//     setIsAuthenticated(true);  // Mark the user as authenticated
//     setAuthMessage("✅ Verified and logged in!");  // Success message
//     setJustVerified(true);
//     nextStep();  // Proceed to the next step
//   } catch (err) {
//     setFieldErrors({ otp: "Invalid OTP. Please try again." });
//     console.error("Error verifying OTP:", err);
//   } finally {
//     setLoading(false);
//   }
// };






//   // OTP change handler (missing function)
//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//     setFieldErrors({ ...fieldErrors, otp: "" });
//     setAuthMessage("");
//   };

//   // Step validation and navigation
//   const validateStep = (currentStep) => {
//     const errors = {};

//     if (currentStep === 1 && !fullName.trim()) errors.fullName = "Enter your full name.";
//     if (currentStep === 2 && !email.trim()) errors.email = "Enter your email.";
//     if (currentStep === 3 && !otp.trim()) errors.otp = "Enter the OTP.";
//     if (currentStep === 4 && !phone.trim()) errors.phone = "Enter your phone number.";
//     if (currentStep === 5) {
//       if (!addressLine1.trim()) errors.addressLine1 = "Enter address line 1.";
//       if (!city.trim()) errors.city = "Enter city.";
//       if (!state.trim()) errors.state = "Enter state.";
//       if (!zip.trim()) errors.zip = "Enter zip.";
//       if (!country.trim()) errors.country = "Enter country.";
//     }
//     if (currentStep === 6 && !selectedProduct) errors.selectedProduct = "Select a product.";

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

// const nextStep = () => {
//   if (validateStep(step)) {
//     setStep(step + 1 > 7 ? 7 : step + 1);  // Update step without using prev
//     setFieldErrors({});
//   }
// };
//  const prevStep = () => {
//     setStep((prev) => Math.max(prev - 1, 1));
//     setFieldErrors({});
//   };



//   // Email validation
//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   // Handling image change



 

//   // Handle form submission
//   const handleSubmit = async () => {
//     setLoading(true);
//     setFieldErrors({});

//     if (!selectedProduct) {
//       setFieldErrors({ selectedProduct: "Please select a product." });
//       setLoading(false);
//       return;
//     }

//     try {
//       const session = await account.get();
//       const address = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zip}, ${country}`;

//       const document = {
//         full_name: fullName,
//         email,
//         phone,
//         address,
//         selected_product: selectedProduct,
//         product_sku: sku || null, // Add SKU if provided
//         user_id: session.$id,
//         image_file_id: imageFileId || null // Will be null if no image uploaded
//       };

//       // Save to Appwrite database
//       await database.createDocument(
//         APPWRITE_DATABASE_ID,
//         APPWRITE_COLLECTION_ID,
//         ID.unique(),
//         document
//       );

//       // Optionally, send to Shopify (if needed)
//       await fetch("/.netlify/functions/sendToShopify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(document)
//       });

//       setStep(7); // Show thank-you step
//     } catch (err) {
//       console.error("Submission failed:", err);
//       setFieldErrors({ submit: "Submission failed. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

 





 

  
  
//   return (
//     <div className="auth-wrapper">
//       <div className="logo-text">ELLA STEIN</div>
//       <div className="right-side">
//         {step === 1 && (
//           <section className="step-section active slide-up">
//             <div className="step-label">
//               <div className="step_number_main">
//                 <span className="step-number">1</span>
//                 <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//               </div>
//               Your Full Name:
//             </div>
//             <input
//               type="text"
//               placeholder="Type your answer here..."
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="styled-input placeholder-gray-700 text-base"
//             />
//             {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
//             <div className="ok-container">
//               <button onClick={nextStep} className="ok-button">OK</button>
//               <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//             </div>
//           </section>
//         )}

// {step === 2 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">2</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Email Address:
//     </div>

//     <p className="step-description mb-8">Please enter an email address whose inbox you access regularly.</p>

//     <input
//       type="email"
//       placeholder="name@example.com"
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//       className="styled-input"
//     />

//     {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}

//     {!isAuthenticated ? (
//       <>
//         {/* SEND OTP */}
//         <div className="ok-container mb-3">
//           <button onClick={sendOtp} className="ok-button" disabled={loading}>
//             {loading ? "Sending..." : "Send OTP"}
//           </button>
//           <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//         </div>

       

//         {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//         {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}
//         {justVerified && <p className="success-message">You're now verified!</p>}

//         {/* SIDE BY SIDE BUTTONS */}
//         <div className="flex gap-4 mt-3">
         

//           {otpSent && (
//             <button
//               onClick={sendOtp}
//               disabled={loading}
//               className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
//             >
//               {loading ? "Resending..." : "Resend OTP"}
//             </button>
//           )}
//         </div>
//       </>
//     ) : (
//       <>
//         <button
//           onClick={async () => {
//             try {
//               await account.deleteSession("current");
//               setIsAuthenticated(false);
//               setAuthMessage("");
//               setOtp("");
//               setJustVerified(false);
//               localStorage.clear();
//               setStep(2);
//             } catch (err) {
//               console.error("Sign out error:", err);
//             }
//           }}
//           className="signout-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           Sign Out
//         </button>
//         <p className="success-message">✅ Verified and logged in!</p>
//       </>
//     )}
//   </section>
// )}

// {step === 3 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">3</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Enter OTP:
//     </div>


//     <input
//       type="text"
//       placeholder="Enter OTP"
//       value={otp}
//       onChange={handleOtpChange}
//       maxLength={6}
//       className="styled-input"
//     />

//     {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//     {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}

//     <div className="email_btn flex gap-4 mt-3">
//       <button
//         onClick={verifyOtp}
//         disabled={loading}
//         className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
//       >
//         {loading ? "Verifying..." : "Verify OTP"}
//       </button>

//       <button
//         onClick={sendOtp}
//         disabled={loading}
//         className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
//       >
//         {loading ? "Resending..." : "Resend OTP"}
//       </button>
//     </div>
//   </section>
// )}


//         {step === 4 && (
//           <PhoneNumberStep phone={phone} setPhone={setPhone} nextStep={nextStep} fieldErrors={fieldErrors} />
//         )}

//         {[5, 6, 7].map((num) => (
//           <section key={num} className={`step-section ${step === num ? "active slide-up" : "hidden"}`}>
//             {num === 5 && (
//               <div className="address-step">
//                 <div className="step-label">
//                   <div className="step_number_main">

//                     <span className="step-number">5</span>
//                     <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//                   </div>
//                   Address:
//                 </div>
//                 <p>This is the address Ella Stein will use to initiate a pick-up and product replacement.</p>
//                 <label>Address</label>
//                 <input className="text-[20px] sm:text-[18px] md:text-[16px] lg:text-[20px]" type="text" placeholder="65 Hansen Way" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />

//                 <label>Address line 2</label>
//                 <input type="text" placeholder="Apartment 4" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />

//                 <label>City/Town</label>
//                 <input type="text" placeholder="Palo Alto" value={city} onChange={(e) => setCity(e.target.value)} />

//                 <label>State/Region/Province</label>
//                 <input type="text" placeholder="California" value={state} onChange={(e) => setState(e.target.value)} />

//                 <label>Zip/Post code</label>
//                 <input type="text" placeholder="94304" value={zip} onChange={(e) => setZip(e.target.value)} />

//                 <label>Country</label>
//                 <input type="text" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)} />

//                 {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
//                 <div className="ok-container">
//       <button onClick={nextStep} className="ok-button">OK</button>
//       <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//     </div>
//               </div>
//             )}
// {num === 6 && (
//   <>
//   <div className="address-step">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">6</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Select Product:
//     </div>
// <div className="image-upload">
//   <label className="upload_image">Upload Product Image (Optional)</label>
//   <input type="file" accept="image/*" onChange={handleImageChange} />
//   {imagePreview && (
//     <img src={imagePreview} alt="Preview" style={{ width: "120px", marginTop: "10px" }} />
//   )}
//   {fieldErrors.image && <p className="error">{fieldErrors.image}</p>}
// </div>
// </div>
// <label className="upload_image">Enter SKU Number</label>
// <input
//   type="text"
//   placeholder="Enter product SKU"
//   value={sku}
//   onChange={(e) => setSku(e.target.value)}
//   className="styled-input"
// />
// {fieldErrors.sku && <p className="error">{fieldErrors.sku}</p>}

//     <input
//       value={productSearch}
//       onChange={(e) => setProductSearch(e.target.value)}
//       placeholder="Search products..."
//       className="search_product_input"
//     />

//     <ul className="product-list">
//       {loadingProducts ? (
//         <li>Loading...</li>
//       ) : fieldErrors.products ? (
//         <li>{fieldErrors.products}</li>
//       ) : (
//         filteredProducts.map((product) => (
//           <li
//             key={product.id}
//             className={`product-item ${selectedProduct === product.title ? "selected" : ""}`}
//             onClick={() => setSelectedProduct(product.title)}
//           >
//             {product.images?.[0]?.src && (
//               <img src={product.images[0].src} alt={product.title} className="product-image" />
//             )}
//             <span>{product.title}</span>
//           </li>
//         ))
//       )}
//     </ul>

//     <p className="error">{fieldErrors.selectedProduct}</p>
//     <p className="error">{fieldErrors.submit}</p>
//   </>
// )}



// {step === 7 && (
//   <div className="max-w-xl mx-auto  text-center submission_container">
//     {/* Removed the step number and arrow */}
//     <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 submisiion_headding">
//       Thank you for registering your Ella Stein jewelry under our Warranty Program.
//     </h1>
//     <p className="mt-4 text-lg sm:text-xl text-gray-600 submission_pera">
//       Learn more about caring for your jewelry using the link below.
//     </p>
//     <p className="mt-6">
//       <a
//         className=" submission_button inline-block px-6 py-3 bg-[#f2e1d1] text-lg sm:text-xl font-bold text-gray-800 rounded-md shadow-md hover:bg-[#e0cfbf] transition "
//         href="https://www.ellastein.com/pages/jewelry-care-tips"
//         target="_blank"
//         rel="noreferrer"
//       >
//         JEWELRY CARE TIPS
//       </a>
//     </p>
//   </div>
// )}


//           </section>
//         ))}

//        <div className="btn-group flex justify-between mt-4 gap-4">
//  {step > 1 && step <= 6 &&  (
//     <button onClick={prevStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
//       Previous
//     </button>
//   )}
 
// {step === 6 && (
//   <button
//     onClick={handleSubmit}
//     className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//     disabled={loading || !selectedProduct}
//   >
//     {loading ? "Submitting..." : "Submit"}
//   </button>
// )}

// </div>

//       </div>
//     </div>
//   );
// };

// export default Authe;

























// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

// import { Client, Account, Databases, ID, Storage } from "appwrite";
// import "./Authentication.css";
// import PhoneNumberStep from './PhoneNumberStep';

// const Authe = () => {
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [authMessage, setAuthMessage] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userId, setUserId] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [addressLine1, setAddressLine1] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [justVerified, setJustVerified] = useState(false);

//   const [addressLine2, setAddressLine2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [zip, setZip] = useState("");
//   const [country, setCountry] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFileId, setImageFileId] = useState(null);
//   const [sku, setSku] = useState("");

//   const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
//   const APPWRITE_PROJECT_ID = "68271c3c000854f08575";
//   const APPWRITE_DATABASE_ID = "68271db80016565f6882";
//   const APPWRITE_COLLECTION_ID = "68271dcf002c6797363d";
  
//   const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
//   const account = useMemo(() => new Account(client), [client]);
//   const database = new Databases(client);
//   const storage = new Storage(client);
  
//   const APPWRITE_BUCKET_ID = "683e80fc0019228a6dfa";

//   // Handle visibility change
//   const handleVisibilityChange = useCallback(() => {
//     if (document.visibilityState === "visible") {
//       console.log("Tab is active again");
//     }
//   }, []);

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setImagePreview(URL.createObjectURL(file));

//     try {
//       const response = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);
//       if (response && response.$id) {
//         setImageFileId(response.$id);
//         console.log("Image uploaded successfully. File ID:", response.$id);
//       } else {
//         throw new Error("Failed to upload image. No file ID returned.");
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Image upload failed. Check console for more details.");
//     }
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("/.netlify/functions/products");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setProducts(data);
//           setFilteredProducts(data);
//         } else {
//           setProducts([]);
//           setFilteredProducts([]);
//           setFieldErrors({ products: "Invalid products data." });
//         }
//       } catch {
//         setProducts([]);
//         setFilteredProducts([]);
//         setFieldErrors({ products: "Failed to load products." });
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (!Array.isArray(products)) return;
//     setFilteredProducts(
//       productSearch.trim() === ""
//         ? products
//         : products.filter((p) =>
//             p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
//           )
//     );
//   }, [productSearch, products]);

//   const autoRefreshInterval = useRef(null);

//   const startAutoRefresh = useCallback(() => {
//     if (autoRefreshInterval.current) {
//       clearInterval(autoRefreshInterval.current);
//     }

//     autoRefreshInterval.current = setInterval(async () => {
//       try {
//         const session = await account.get();
//         if (!session) {
//           console.log("Session expired, logging out...");
//           setIsAuthenticated(false);
//         }
//       } catch (err) {
//         console.error("Session refresh failed:", err);
//         setIsAuthenticated(false);
//       }
//     }, 15 * 60 * 1000);
//   }, [account]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       startAutoRefresh();
//     }
//     return () => {
//       clearInterval(autoRefreshInterval.current);
//     };
//   }, [isAuthenticated, startAutoRefresh]);

//   useEffect(() => {
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, [handleVisibilityChange]);

//   useEffect(() => {
//     const clearSessionOnLoad = async () => {
//       try {
//         const session = await account.get();
//         if (session) {
//           await account.deleteSession("current");
//           console.log("Previous session cleared on page load");
//         }
//       } catch (error) {
//         console.log("No existing session to clear");
//       } finally {
//         setIsAuthenticated(false);
//         setStep(1);
//         setAuthMessage("");
//         setOtp("");
//         setOtpSent(false);
//         setJustVerified(false);
//         setUserId(false);
//         setFullName("");
//         setEmail("");
//         setPhone("");
//         setSelectedProduct("");
//         setAddressLine1("");
//         setAddressLine2("");
//         setCity("");
//         setState("");
//         setZip("");
//         setCountry("");
//         setImagePreview(null);
//         setImageFileId(null);
//         setSku("");
//       }
//     };

//     clearSessionOnLoad();
//   }, []);

//   const sendOtp = async () => {
//     setLoading(true);
//     setFieldErrors({});
//     setAuthMessage("");

//     if (!email || !validateEmail(email)) {
//       setFieldErrors({ email: "Enter a valid email address." });
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await account.createEmailToken(ID.unique(), email);
//       setUserId(response.userId);
//       setOtpSent(true);
//       setStep(3);
//     } catch (err) {
//       setFieldErrors({ email: err.message || "Failed to send OTP." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async () => {
//     setLoading(true);
//     setFieldErrors({});
//     setAuthMessage("");

//     const secret = otp.trim();

//     if (!userId || !secret) {
//       setFieldErrors({ otp: "Enter a valid OTP." });
//       setLoading(false);
//       return;
//     }

//     try {
//       let session;
//       try {
//         session = await account.get();
//       } catch (err) {
//         session = null;
//       }

//       if (session) {
//         setAuthMessage("You are already logged in!");
//         setIsAuthenticated(true);
//         nextStep();
//         return;
//       }

//       await account.createSession(userId, secret);
//       setIsAuthenticated(true);
//       setAuthMessage("✅ Verified and logged in!");
//       setJustVerified(true);
//       nextStep();
//     } catch (err) {
//       setFieldErrors({ otp: "Invalid OTP. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//     setFieldErrors({ ...fieldErrors, otp: "" });
//     setAuthMessage("");
//   };

//   const validateStep = (currentStep) => {
//     const errors = {};

//     if (currentStep === 1 && !fullName.trim()) errors.fullName = "Enter your full name.";
//     if (currentStep === 2 && !email.trim()) errors.email = "Enter your email.";
//     if (currentStep === 3 && !otp.trim()) errors.otp = "Enter the OTP.";
//     if (currentStep === 4 && !phone.trim()) errors.phone = "Enter your phone number.";
//     if (currentStep === 5) {
//       if (!addressLine1.trim()) errors.addressLine1 = "Enter address line 1.";
//       if (!city.trim()) errors.city = "Enter city.";
//       if (!state.trim()) errors.state = "Enter state.";
//       if (!zip.trim()) errors.zip = "Enter zip.";
//       if (!country.trim()) errors.country = "Enter country.";
//     }
//     if (currentStep === 6 && !selectedProduct) errors.selectedProduct = "Select a product.";

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const nextStep = () => {
//     if (validateStep(step)) {
//       setStep(step + 1 > 7 ? 7 : step + 1);
//       setFieldErrors({});
//     }
//   };

//   const prevStep = () => {
//     setStep((prev) => Math.max(prev - 1, 1));
//     setFieldErrors({});
//   };

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSubmit = async () => {
//     setLoading(true);
//     setFieldErrors({});

//     if (!selectedProduct) {
//       setFieldErrors({ selectedProduct: "Please select a product." });
//       setLoading(false);
//       return;
//     }

//     try {
//       const session = await account.get();
//       const address = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zip}, ${country}`;

//       const document = {
//         full_name: fullName,
//         email,
//         phone,
//         address,
//         selected_product: selectedProduct,
//         product_sku: sku || null,
//         user_id: session.$id,
//         image_file_id: imageFileId || null,
//       };

//       await database.createDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, ID.unique(), document);

//       await fetch("/.netlify/functions/sendToShopify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(document)
//       });

//       setStep(7);
//     } catch (err) {
//       console.error("Submission failed:", err);
//       setFieldErrors({ submit: "Submission failed. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

// return (
//     <div className="auth-wrapper">
//       <div className="logo-text">ELLA STEIN</div>
//       <div className="right-side">
//         {step === 1 && (
//           <section className="step-section active slide-up">
//             <div className="step-label">
//               <div className="step_number_main">
//                 <span className="step-number">1</span>
//                 <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//               </div>
//               Your Full Name:
//             </div>
//             <input
//               type="text"
//               placeholder="Type your answer here..."
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="styled-input placeholder-gray-700 text-base"
//             />
//             {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
//             <div className="ok-container">
//               <button onClick={nextStep} className="ok-button">OK</button>
//               <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//             </div>
//           </section>
//         )}

// {step === 2 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">2</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Email Address:
//     </div>

//     <p className="step-description mb-8">Please enter an email address whose inbox you access regularly.</p>

//     <input
//       type="email"
//       placeholder="name@example.com"
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//       className="styled-input"
//     />

//     {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}

//     {!isAuthenticated ? (
//       <>
//         {/* SEND OTP */}
//         <div className="ok-container mb-3">
//           <button onClick={sendOtp} className="ok-button" disabled={loading}>
//             {loading ? "Sending..." : "Send OTP"}
//           </button>
//           <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//         </div>

       

//         {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//         {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}
//         {justVerified && <p className="success-message">You're now verified!</p>}

//         {/* SIDE BY SIDE BUTTONS */}
//         <div className="flex gap-4 mt-3">
         

//           {otpSent && (
//             <button
//               onClick={sendOtp}
//               disabled={loading}
//               className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
//             >
//               {loading ? "Resending..." : "Resend OTP"}
//             </button>
//           )}
//         </div>
//       </>
//     ) : (
//       <>
//         <button
//           onClick={async () => {
//             try {
//               await account.deleteSession("current");
//               setIsAuthenticated(false);
//               setAuthMessage("");
//               setOtp("");
//               setJustVerified(false);
//               setUserId(false);
//               setOtpSent(false);
//               setStep(2);
//             } catch (err) {
//               console.error("Sign out error:", err);
//             }
//           }}
//           className="signout-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           Sign Out
//         </button>
//         <p className="success-message">✅ Verified and logged in!</p>
//       </>
//     )}
//   </section>
// )}

// {step === 3 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">3</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Enter OTP:
//     </div>


//     <input
//       type="text"
//       placeholder="Enter OTP"
//       value={otp}
//       onChange={handleOtpChange}
//       maxLength={6}
//       className="styled-input"
//     />

//     {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//     {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}

//     <div className="email_btn flex gap-4 mt-3">
//       <button
//         onClick={verifyOtp}
//         disabled={loading}
//         className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
//       >
//         {loading ? "Verifying..." : "Verify OTP"}
//       </button>

//       <button
//         onClick={sendOtp}
//         disabled={loading}
//         className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
//       >
//         {loading ? "Resending..." : "Resend OTP"}
//       </button>
//     </div>
//   </section>
// )}


//         {step === 4 && (
//           <PhoneNumberStep phone={phone} setPhone={setPhone} nextStep={nextStep} fieldErrors={fieldErrors} />
//         )}

//         {[5, 6, 7].map((num) => (
//           <section key={num} className={`step-section ${step === num ? "active slide-up" : "hidden"}`}>
//             {num === 5 && (
//               <div className="address-step">
//                 <div className="step-label">
//                   <div className="step_number_main">

//                     <span className="step-number">5</span>
//                     <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//                   </div>
//                   Address:
//                 </div>
//                 <p>This is the address Ella Stein will use to initiate a pick-up and product replacement.</p>
//                 <label>Address</label>
//                 <input className="text-[20px] sm:text-[18px] md:text-[16px] lg:text-[20px]" type="text" placeholder="65 Hansen Way" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />

//                 <label>Address line 2</label>
//                 <input type="text" placeholder="Apartment 4" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />

//                 <label>City/Town</label>
//                 <input type="text" placeholder="Palo Alto" value={city} onChange={(e) => setCity(e.target.value)} />

//                 <label>State/Region/Province</label>
//                 <input type="text" placeholder="California" value={state} onChange={(e) => setState(e.target.value)} />

//                 <label>Zip/Post code</label>
//                 <input type="text" placeholder="94304" value={zip} onChange={(e) => setZip(e.target.value)} />

//                 <label>Country</label>
//                 <input type="text" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)} />

//                 {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
//                 <div className="ok-container">
//       <button onClick={nextStep} className="ok-button">OK</button>
//       <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//     </div>
//               </div>
//             )}
// {num === 6 && (
//   <>
//   <div className="address-step">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">6</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Select Product:
//     </div>
// <div className="image-upload">
//   <label className="upload_image">Upload Product Image (Optional)</label>
//   <input type="file" accept="image/*" onChange={handleImageChange} />
//   {imagePreview && (
//     <img src={imagePreview} alt="Preview" style={{ width: "120px", marginTop: "10px" }} />
//   )}
//   {fieldErrors.image && <p className="error">{fieldErrors.image}</p>}
// </div>
// </div>
// <label className="upload_image">Enter SKU Number</label>
// <input
//   type="text"
//   placeholder="Enter product SKU"
//   value={sku}
//   onChange={(e) => setSku(e.target.value)}
//   className="styled-input"
// />
// {fieldErrors.sku && <p className="error">{fieldErrors.sku}</p>}

//     <input
//       value={productSearch}
//       onChange={(e) => setProductSearch(e.target.value)}
//       placeholder="Search products..."
//       className="search_product_input"
//     />

//     <ul className="product-list">
//       {loadingProducts ? (
//         <li>Loading...</li>
//       ) : fieldErrors.products ? (
//         <li>{fieldErrors.products}</li>
//       ) : (
//         filteredProducts.map((product) => (
//           <li
//             key={product.id}
//             className={`product-item ${selectedProduct === product.title ? "selected" : ""}`}
//             onClick={() => setSelectedProduct(product.title)}
//           >
//             {product.images?.[0]?.src && (
//               <img src={product.images[0].src} alt={product.title} className="product-image" />
//             )}
//             <span>{product.title}</span>
//           </li>
//         ))
//       )}
//     </ul>

//     <p className="error">{fieldErrors.selectedProduct}</p>
//     <p className="error">{fieldErrors.submit}</p>
//   </>
// )}



// {step === 7 && (
//   <div className="max-w-xl mx-auto  text-center submission_container">
//     {/* Removed the step number and arrow */}
//     <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 submisiion_headding">
//       Thank you for registering your Ella Stein jewelry under our Warranty Program.
//     </h1>
//     <p className="mt-4 text-lg sm:text-xl text-gray-600 submission_pera">
//       Learn more about caring for your jewelry using the link below.
//     </p>
//     <p className="mt-6">
//       <a
//         className=" submission_button inline-block px-6 py-3 bg-[#f2e1d1] text-lg sm:text-xl font-bold text-gray-800 rounded-md shadow-md hover:bg-[#e0cfbf] transition "
//         href="https://www.ellastein.com/pages/jewelry-care-tips"
//         target="_blank"
//         rel="noreferrer"
//       >
//         JEWELRY CARE TIPS
//       </a>
//     </p>
//   </div>
// )}


//           </section>
//         ))}

//        <div className="btn-group flex justify-between mt-4 gap-4">
//  {step > 1 && step <= 6 &&  (
//     <button onClick={prevStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
//       Previous
//     </button>
//   )}
 
// {step === 6 && (
//   <button
//     onClick={handleSubmit}
//     className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//     disabled={loading || !selectedProduct}
//   >
//     {loading ? "Submitting..." : "Submit"}
//   </button>
// )}

// </div>

//       </div>
//     </div>
//   );
// };

// export default Authe;



// import React, { useState, useEffect, useRef, useCallback, useMemo} from "react";

// import { Client, Account, Databases, ID, Storage } from "appwrite";
// import "./Authentication.css";
// import PhoneNumberStep from './PhoneNumberStep';

// const Authe = () => {
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [authMessage, setAuthMessage] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userId, setUserId] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [addressLine1, setAddressLine1] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [justVerified, setJustVerified] = useState(false);


//   const [addressLine2, setAddressLine2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [zip, setZip] = useState("");
//   const [country, setCountry] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFileId, setImageFileId] = useState(null);
//   const [sku, setSku] = useState("");

//   const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
//   const APPWRITE_PROJECT_ID = "68271c3c000854f08575";
//   const APPWRITE_DATABASE_ID = "68271db80016565f6882";
//   const APPWRITE_COLLECTION_ID = "68271dcf002c6797363d";
  
//   const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
//   const account = useMemo(() => new Account(client), [client]);
//   const database = new Databases(client);
//   const storage = new Storage(client);
  
//   const APPWRITE_BUCKET_ID = "683e80fc0019228a6dfa";

  
// const handleVisibilityChange = useCallback(() => {
//   if (document.visibilityState === "visible") {
//     console.log("Tab is active again");
//   }
// }, []);



// const handleImageChange = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   setImagePreview(URL.createObjectURL(file));

//   try {
//     // Upload the image directly to Appwrite storage
//     const response = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);

//     // Log the response from Appwrite
//     console.log("Appwrite upload response:", response);

//     if (response && response.$id) {
//       setImageFileId(response.$id);  // Store the file ID returned by Appwrite
//       console.log("Image uploaded successfully. File ID:", response.$id);
//     } else {
//       throw new Error("Failed to upload image. No file ID returned.");
//     }
//   } catch (err) {
//     // Detailed error logging
//     console.error("Upload error:", err);
//     alert("Image upload failed. Check console for more details.");
//   }
// };








//   // Updated product fetch logic (only change)
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("/.netlify/functions/products");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setProducts(data);
//           setFilteredProducts(data);
//         } else {
//           setProducts([]);
//           setFilteredProducts([]);
//           setFieldErrors({ products: "Invalid products data." });
//         }
//       } catch {
//         setProducts([]);
//         setFilteredProducts([]);
//         setProducts([]);
//         setFieldErrors({ products: "Failed to load products." });
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);




//   useEffect(() => {
//     if (!Array.isArray(products)) return;
//     setFilteredProducts(
//       productSearch.trim() === ""
//         ? products
//         : products.filter((p) =>
//             p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
//           )
//     );
//   }, [productSearch, products]);



// // Session auto-refresh function
//   const autoRefreshInterval = useRef(null);

// const startAutoRefresh = useCallback(() => {
//   if (autoRefreshInterval.current) {
//     clearInterval(autoRefreshInterval.current);
//   }

//   autoRefreshInterval.current = setInterval(async () => {
//     try {
//       const session = await account.get();
//       if (!session) {
//         console.log("Session expired, logging out...");
//         setIsAuthenticated(false);
//         localStorage.clear();
//       }
//     } catch (err) {
//       console.error("Session refresh failed:", err);
//       setIsAuthenticated(false);
//       localStorage.clear();
//     }
//   }, 15 * 60 * 1000);
// }, [account]); // 👈 Add dependency



// useEffect(() => {
//   if (isAuthenticated) {
//     startAutoRefresh();
//   }
//   return () => {
//     clearInterval(autoRefreshInterval.current);
//   };
// }, [isAuthenticated, startAutoRefresh]);



//   // Handle visibility change to stop and start auto-refresh
// useEffect(() => {
//   document.addEventListener("visibilitychange", handleVisibilityChange);
//   return () => {
//     document.removeEventListener("visibilitychange", handleVisibilityChange);
//   };
// }, [handleVisibilityChange]); // ✅ Fix: add the dependency






//   // OTP and Email handling
//   const sendOtp = async () => {
//     setLoading(true);
//     setFieldErrors({});
//     setAuthMessage("");

//     if (!email || !validateEmail(email)) {
//       setFieldErrors({ email: "Enter a valid email address." });
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await account.createEmailToken(ID.unique(), email);
//       setUserId(response.userId)
//       // localStorage.setItem("userId", response.userId);
//       console.log(response)
//       setOtp()
//       setAuthMessage("📧 OTP sent to your email.");
//       setOtpSent(true);
//       setStep(3);  // Move to OTP entry step
//     } catch (err) {
//       setFieldErrors({ email: err.message || "Failed to send OTP." });
//     } finally {
//       setLoading(false);
//     }
//   };

// const checkSession = async () => {
//   try {
//     const session = await account.get();
//     if (!session) {
//       setFieldErrors({ otp: "You are not logged in. Please log in first." });
//       return false; // User is not logged in
//     }
//     return true; // User is logged in
//   } catch (err) {
//     console.error("Error checking session:", err);
//     setFieldErrors({ otp: "Failed to verify session. Please try again." });
//     return false;
//   }
// };
// useEffect(() => {
//   const checkSession = async () => {
//     try {
//       const session = await account.get();
//       if (session) {
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//       }
//     } catch (error) {
//       setIsAuthenticated(false);
//       console.error("Error checking session", error);
//     }
//   };

//   checkSession();
// }, []);




// // const verifyOtp = async () => {
// //   setLoading(true);
// //   setFieldErrors({});  // Reset field errors
// //   setAuthMessage("");   // Clear previous auth messages

// //   const userId = localStorage.getItem("userId");
// //   const secret = otp.trim();  // OTP entered by the user

// //   if (!userId || !secret) {
// //     setFieldErrors({ otp: "Enter a valid OTP." });
// //     setLoading(false);
// //     return;
// //   }

// //   try {
// //     // Check if the user is already authenticated by checking the session
// //     let session;
// //     try {
// //       session = await account.get();
// //     } catch (err) {
// //       session = null; // If no session exists, the error will be caught and set to null
// //     }

// //     // If the user is already authenticated, skip OTP verification
// //     if (session) {
// //       setAuthMessage("You are already logged in!");
// //       setIsAuthenticated(true);
// //       nextStep();  // Proceed to the next step
// //       return;  // Stop further execution if the user is already logged in
// //     }

// //     // Proceed with OTP verification only if not authenticated
// //     await account.createSession(userId, secret);  // Create session after OTP verification
// //     setIsAuthenticated(true);  // Mark the user as authenticated
// //     setAuthMessage("✅ Verified and logged in!");  // Success message
// //     setJustVerified(true);
// //     nextStep();  // Proceed to the next step
// //   } catch (err) {
// //     setFieldErrors({ otp: "Invalid OTP. Please try again." });
// //     console.error("Error verifying OTP:", err);
// //   } finally {
// //     setLoading(false);
// //   }
// // };




// const verifyOtp = async () => {
//   setLoading(true);
//   setFieldErrors({});  // Reset field errors
//   setAuthMessage("");   // Clear previous auth messages

//   // const userId = localStorage.getItem("userId");
//   const secret = otp.trim();  // OTP entered by the user

//   if (!userId || !secret) {
//     setFieldErrors({ otp: "Enter a valid OTP." });
//     setLoading(false);
//     return;
//   }

//   try {
//     // Check if the user is already authenticated by checking the session
//     let session;
//     try {
//       session = await account.get();
//     } catch (err) {
//       session = null; // If no session exists, the error will be caught and set to null
//     }

//     // If the user is already authenticated, skip OTP verification
//     if (session) {
//       setAuthMessage("You are already logged in!");
//       setIsAuthenticated(true);
//       nextStep();  // Proceed to the next step
//       return;  // Stop further execution if the user is already logged in
//     }

//     // Proceed with OTP verification only if not authenticated
//     await account.createSession(userId, secret);  // Create session after OTP verification
//     setIsAuthenticated(true);  // Mark the user as authenticated
//     setAuthMessage("✅ Verified and logged in!");  // Success message
//     setJustVerified(true);
//     nextStep();  // Proceed to the next step
//   } catch (err) {
//     setFieldErrors({ otp: "Invalid OTP. Please try again." });
//     console.error("Error verifying OTP:", err);
//   } finally {
//     setLoading(false);
//   }
// };






//   // OTP change handler (missing function)
//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//     setFieldErrors({ ...fieldErrors, otp: "" });
//     setAuthMessage("");
//   };

//   // Step validation and navigation
//   const validateStep = (currentStep) => {
//     const errors = {};

//     if (currentStep === 1 && !fullName.trim()) errors.fullName = "Enter your full name.";
//     if (currentStep === 2 && !email.trim()) errors.email = "Enter your email.";
//     if (currentStep === 3 && !otp.trim()) errors.otp = "Enter the OTP.";
//     if (currentStep === 4 && !phone.trim()) errors.phone = "Enter your phone number.";
//     if (currentStep === 5) {
//       if (!addressLine1.trim()) errors.addressLine1 = "Enter address line 1.";
//       if (!city.trim()) errors.city = "Enter city.";
//       if (!state.trim()) errors.state = "Enter state.";
//       if (!zip.trim()) errors.zip = "Enter zip.";
//       if (!country.trim()) errors.country = "Enter country.";
//     }
//     if (currentStep === 6 && !selectedProduct) errors.selectedProduct = "Select a product.";

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

// const nextStep = () => {
//   if (validateStep(step)) {
//     setStep(step + 1 > 7 ? 7 : step + 1);  // Update step without using prev
//     setFieldErrors({});
//   }
// };
//  const prevStep = () => {
//     setStep((prev) => Math.max(prev - 1, 1));
//     setFieldErrors({});
//   };



//   // Email validation
//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   // Handling image change



 

//   // Handle form submission
//   const handleSubmit = async () => {
//     setLoading(true);
//     setFieldErrors({});

//     if (!selectedProduct) {
//       setFieldErrors({ selectedProduct: "Please select a product." });
//       setLoading(false);
//       return;
//     }

//     try {
//       const session = await account.get();
//       const address = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zip}, ${country}`;

//       const document = {
//         full_name: fullName,
//         email,
//         phone,
//         address,
//         selected_product: selectedProduct,
//         product_sku: sku || null, // Add SKU if provided
//         user_id: session.$id,
//         image_file_id: imageFileId || null // Will be null if no image uploaded
//       };

//       // Save to Appwrite database
//       await database.createDocument(
//         APPWRITE_DATABASE_ID,
//         APPWRITE_COLLECTION_ID,
//         ID.unique(),
//         document
//       );

//       // Optionally, send to Shopify (if needed)
//       await fetch("/.netlify/functions/sendToShopify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(document)
//       });

//       setStep(7); // Show thank-you step
//     } catch (err) {
//       console.error("Submission failed:", err);
//       setFieldErrors({ submit: "Submission failed. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

 





 

  
  
//   return (
//     <div className="auth-wrapper">
//       <div className="logo-text">ELLA STEIN</div>
//       <div className="right-side">
//         {step === 1 && (
//           <section className="step-section active slide-up">
//             <div className="step-label">
//               <div className="step_number_main">
//                 <span className="step-number">1</span>
//                 <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//               </div>
//               Your Full Name:
//             </div>
//             <input
//               type="text"
//               placeholder="Type your answer here..."
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="styled-input placeholder-gray-700 text-base"
//             />
//             {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
//             <div className="ok-container">
//               <button onClick={nextStep} className="ok-button">OK</button>
//               <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//             </div>
//           </section>
//         )}

// {step === 2 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">2</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Email Address:
//     </div>

//     <p className="step-description mb-8">Please enter an email address whose inbox you access regularly.</p>

//     <input
//       type="email"
//       placeholder="name@example.com"
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//       className="styled-input"
//     />

//     {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}

//     {!isAuthenticated ? (
//       <>
//         {/* SEND OTP */}
//         <div className="ok-container mb-3">
//           <button onClick={sendOtp} className="ok-button" disabled={loading}>
//             {loading ? "Sending..." : "Send OTP"}
//           </button>
//           <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//         </div>

       

//         {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//         {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}
//         {justVerified && <p className="success-message">You're now verified!</p>}

//         {/* SIDE BY SIDE BUTTONS */}
//         <div className="flex gap-4 mt-3">
         

//           {otpSent && (
//             <button
//               onClick={sendOtp}
//               disabled={loading}
//               className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
//             >
//               {loading ? "Resending..." : "Resend OTP"}
//             </button>
//           )}
//         </div>
//       </>
//     ) : (
//       <>
//         <button
//           onClick={async () => {
//             try {
//               await account.deleteSession("current");
//               setIsAuthenticated(false);
//               setAuthMessage("");
//               setOtp("");
//               setJustVerified(false);
//               localStorage.clear();
//               setStep(2);
//             } catch (err) {
//               console.error("Sign out error:", err);
//             }
//           }}
//           className="signout-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           Sign Out
//         </button>
//         <p className="success-message">✅ Verified and logged in!</p>
//       </>
//     )}
//   </section>
// )}

// {step === 3 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">3</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Enter OTP:
//     </div>


//     <input
//       type="text"
//       placeholder="Enter OTP"
//       value={otp}
//       onChange={handleOtpChange}
//       maxLength={6}
//       className="styled-input"
//     />

//     {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//     {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}

//     <div className="email_btn flex gap-4 mt-3">
//       <button
//         onClick={verifyOtp}
//         disabled={loading}
//         className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
//       >
//         {loading ? "Verifying..." : "Verify OTP"}
//       </button>

//       <button
//         onClick={sendOtp}
//         disabled={loading}
//         className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
//       >
//         {loading ? "Resending..." : "Resend OTP"}
//       </button>
//     </div>
//   </section>
// )}


//         {step === 4 && (
//           <PhoneNumberStep phone={phone} setPhone={setPhone} nextStep={nextStep} fieldErrors={fieldErrors} />
//         )}

//         {[5, 6, 7].map((num) => (
//           <section key={num} className={`step-section ${step === num ? "active slide-up" : "hidden"}`}>
//             {num === 5 && (
//               <div className="address-step">
//                 <div className="step-label">
//                   <div className="step_number_main">

//                     <span className="step-number">5</span>
//                     <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//                   </div>
//                   Address:
//                 </div>
//                 <p>This is the address Ella Stein will use to initiate a pick-up and product replacement.</p>
//                 <label>Address</label>
//                 <input className="text-[20px] sm:text-[18px] md:text-[16px] lg:text-[20px]" type="text" placeholder="65 Hansen Way" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />

//                 <label>Address line 2</label>
//                 <input type="text" placeholder="Apartment 4" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />

//                 <label>City/Town</label>
//                 <input type="text" placeholder="Palo Alto" value={city} onChange={(e) => setCity(e.target.value)} />

//                 <label>State/Region/Province</label>
//                 <input type="text" placeholder="California" value={state} onChange={(e) => setState(e.target.value)} />

//                 <label>Zip/Post code</label>
//                 <input type="text" placeholder="94304" value={zip} onChange={(e) => setZip(e.target.value)} />

//                 <label>Country</label>
//                 <input type="text" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)} />

//                 {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
//                 <div className="ok-container">
//       <button onClick={nextStep} className="ok-button">OK</button>
//       <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//     </div>
//               </div>
//             )}
// {num === 6 && (
//   <>
//   <div className="address-step">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">6</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Select Product:
//     </div>
// <div className="image-upload">
//   <label className="upload_image">Upload Product Image (Optional)</label>
//   <input type="file" accept="image/*" onChange={handleImageChange} />
//   {imagePreview && (
//     <img src={imagePreview} alt="Preview" style={{ width: "120px", marginTop: "10px" }} />
//   )}
//   {fieldErrors.image && <p className="error">{fieldErrors.image}</p>}
// </div>
// </div>
// <label className="upload_image">Enter SKU Number</label>
// <input
//   type="text"
//   placeholder="Enter product SKU"
//   value={sku}
//   onChange={(e) => setSku(e.target.value)}
//   className="styled-input"
// />
// {fieldErrors.sku && <p className="error">{fieldErrors.sku}</p>}

//     <input
//       value={productSearch}
//       onChange={(e) => setProductSearch(e.target.value)}
//       placeholder="Search products..."
//       className="search_product_input"
//     />

//     <ul className="product-list">
//       {loadingProducts ? (
//         <li>Loading...</li>
//       ) : fieldErrors.products ? (
//         <li>{fieldErrors.products}</li>
//       ) : (
//         filteredProducts.map((product) => (
//           <li
//             key={product.id}
//             className={`product-item ${selectedProduct === product.title ? "selected" : ""}`}
//             onClick={() => setSelectedProduct(product.title)}
//           >
//             {product.images?.[0]?.src && (
//               <img src={product.images[0].src} alt={product.title} className="product-image" />
//             )}
//             <span>{product.title}</span>
//           </li>
//         ))
//       )}
//     </ul>

//     <p className="error">{fieldErrors.selectedProduct}</p>
//     <p className="error">{fieldErrors.submit}</p>
//   </>
// )}



// {step === 7 && (
//   <div className="max-w-xl mx-auto  text-center submission_container">
//     {/* Removed the step number and arrow */}
//     <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 submisiion_headding">
//       Thank you for registering your Ella Stein jewelry under our Warranty Program.
//     </h1>
//     <p className="mt-4 text-lg sm:text-xl text-gray-600 submission_pera">
//       Learn more about caring for your jewelry using the link below.
//     </p>
//     <p className="mt-6">
//       <a
//         className=" submission_button inline-block px-6 py-3 bg-[#f2e1d1] text-lg sm:text-xl font-bold text-gray-800 rounded-md shadow-md hover:bg-[#e0cfbf] transition "
//         href="https://www.ellastein.com/pages/jewelry-care-tips"
//         target="_blank"
//         rel="noreferrer"
//       >
//         JEWELRY CARE TIPS
//       </a>
//     </p>
//   </div>
// )}


//           </section>
//         ))}

//        <div className="btn-group flex justify-between mt-4 gap-4">
//  {step > 1 && step <= 6 &&  (
//     <button onClick={prevStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
//       Previous
//     </button>
//   )}
 
// {step === 6 && (
//   <button
//     onClick={handleSubmit}
//     className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//     disabled={loading || !selectedProduct}
//   >
//     {loading ? "Submitting..." : "Submit"}
//   </button>
// )}

// </div>

//       </div>
//     </div>
//   );
// };

// export default Authe;

























// import React, { useState, useEffect, useRef, useCallback, useMemo} from "react";

// import { Client, Account, Databases, ID, Storage } from "appwrite";
// import "./Authentication.css";
// import PhoneNumberStep from './PhoneNumberStep';

// const Authe = () => {
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [authMessage, setAuthMessage] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userId, setUserId] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [addressLine1, setAddressLine1] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [justVerified, setJustVerified] = useState(false);


//   const [addressLine2, setAddressLine2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [zip, setZip] = useState("");
//   const [country, setCountry] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFileId, setImageFileId] = useState(null);
//   const [sku, setSku] = useState("");

//   const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
//   const APPWRITE_PROJECT_ID = "68271c3c000854f08575";
//   const APPWRITE_DATABASE_ID = "68271db80016565f6882";
//   const APPWRITE_COLLECTION_ID = "68271dcf002c6797363d";
  
//   const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
//   const account = useMemo(() => new Account(client), [client]);
//   const database = new Databases(client);
//   const storage = new Storage(client);
  
//   const APPWRITE_BUCKET_ID = "683e80fc0019228a6dfa";

  
// const handleVisibilityChange = useCallback(() => {
//   if (document.visibilityState === "visible") {
//     console.log("Tab is active again");
//   }
// }, []);



// const handleImageChange = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   setImagePreview(URL.createObjectURL(file));

//   try {
//     // Upload the image directly to Appwrite storage
//     const response = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);

//     // Log the response from Appwrite
//     console.log("Appwrite upload response:", response);

//     if (response && response.$id) {
//       setImageFileId(response.$id);  // Store the file ID returned by Appwrite
//       console.log("Image uploaded successfully. File ID:", response.$id);
//     } else {
//       throw new Error("Failed to upload image. No file ID returned.");
//     }
//   } catch (err) {
//     // Detailed error logging
//     console.error("Upload error:", err);
//     alert("Image upload failed. Check console for more details.");
//   }
// };








//   // Updated product fetch logic (only change)
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("/.netlify/functions/products");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setProducts(data);
//           setFilteredProducts(data);
//         } else {
//           setProducts([]);
//           setFilteredProducts([]);
//           setFieldErrors({ products: "Invalid products data." });
//         }
//       } catch {
//         setProducts([]);
//         setFilteredProducts([]);
//         setProducts([]);
//         setFieldErrors({ products: "Failed to load products." });
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);




//   useEffect(() => {
//     if (!Array.isArray(products)) return;
//     setFilteredProducts(
//       productSearch.trim() === ""
//         ? products
//         : products.filter((p) =>
//             p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
//           )
//     );
//   }, [productSearch, products]);



// // Session auto-refresh function
//   const autoRefreshInterval = useRef(null);

// const startAutoRefresh = useCallback(() => {
//   if (autoRefreshInterval.current) {
//     clearInterval(autoRefreshInterval.current);
//   }

//   autoRefreshInterval.current = setInterval(async () => {
//     try {
//       const session = await account.get();
//       if (!session) {
//         console.log("Session expired, logging out...");
//         setIsAuthenticated(false);
//         // Don't clear localStorage here since we're not using it for session persistence
//       }
//     } catch (err) {
//       console.error("Session refresh failed:", err);
//       setIsAuthenticated(false);
//       // Don't clear localStorage here since we're not using it for session persistence
//     }
//   }, 15 * 60 * 1000);
// }, [account]); // 👈 Add dependency



// useEffect(() => {
//   if (isAuthenticated) {
//     startAutoRefresh();
//   }
//   return () => {
//     clearInterval(autoRefreshInterval.current);
//   };
// }, [isAuthenticated, startAutoRefresh]);



//   // Handle visibility change to stop and start auto-refresh
// useEffect(() => {
//   document.addEventListener("visibilitychange", handleVisibilityChange);
//   return () => {
//     document.removeEventListener("visibilitychange", handleVisibilityChange);
//   };
// }, [handleVisibilityChange]); // ✅ Fix: add the dependency


// useEffect(() => {
//   const clearSessionOnLoad = async () => {
//   };

//   clearSessionOnLoad();
// }, [account]); // Add `account` as a dependency






//   // OTP and Email handling
//   const sendOtp = async () => {
//     setLoading(true);
//     setFieldErrors({});
//     setAuthMessage("");

//     if (!email || !validateEmail(email)) {
//       setFieldErrors({ email: "Enter a valid email address." });
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await account.createEmailToken(ID.unique(), email);
//       setUserId(response.userId)
//       // localStorage.setItem("userId", response.userId);
//       console.log(response)
//       setOtp()
//       setAuthMessage("📧 OTP sent to your email.");
//       setOtpSent(true);
//       setStep(3);  // Move to OTP entry step
//     } catch (err) {
//       setFieldErrors({ email: err.message || "Failed to send OTP." });
//     } finally {
//       setLoading(false);
//     }
//   };

// // const checkSession = async () => {
// //   try {
// //     const session = await account.get();
// //     if (!session) {
// //       setFieldErrors({ otp: "You are not logged in. Please log in first." });
// //       return false; // User is not logged in
// //     }
// //     return true; // User is logged in
// //   } catch (err) {
// //     console.error("Error checking session:", err);
// //     setFieldErrors({ otp: "Failed to verify session. Please try again." });
// //     return false;
// //   }
// // };


// const verifyOtp = async () => {
//   setLoading(true);
//   setFieldErrors({});  // Reset field errors
//   setAuthMessage("");   // Clear previous auth messages

//   // const userId = localStorage.getItem("userId");
//   const secret = otp.trim();  // OTP entered by the user

//   if (!userId || !secret) {
//     setFieldErrors({ otp: "Enter a valid OTP." });
//     setLoading(false);
//     return;
//   }

//   try {
//     // Check if the user is already authenticated by checking the session
//     let session;
//     try {
//       session = await account.get();
//     } catch (err) {
//       session = null; // If no session exists, the error will be caught and set to null
//     }

//     // If the user is already authenticated, skip OTP verification
//     if (session) {
//       setAuthMessage("You are already logged in!");
//       setIsAuthenticated(true);
//       nextStep();  // Proceed to the next step
//       return;  // Stop further execution if the user is already logged in
//     }

//     // Proceed with OTP verification only if not authenticated
//     await account.createSession(userId, secret);  // Create session after OTP verification
//     setIsAuthenticated(true);  // Mark the user as authenticated
//     setAuthMessage("✅ Verified and logged in!");  // Success message
//     setJustVerified(true);
//     nextStep();  // Proceed to the next step
//   } catch (err) {
//     setFieldErrors({ otp: "Invalid OTP. Please try again." });
//     console.error("Error verifying OTP:", err);
//   } finally {
//     setLoading(false);
//   }
// };






//   // OTP change handler (missing function)
//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//     setFieldErrors({ ...fieldErrors, otp: "" });
//     setAuthMessage("");
//   };

//   // Step validation and navigation
//   const validateStep = (currentStep) => {
//     const errors = {};

//     if (currentStep === 1 && !fullName.trim()) errors.fullName = "Enter your full name.";
//     if (currentStep === 2 && !email.trim()) errors.email = "Enter your email.";
//     if (currentStep === 3 && !otp.trim()) errors.otp = "Enter the OTP.";
//     if (currentStep === 4 && !phone.trim()) errors.phone = "Enter your phone number.";
//     if (currentStep === 5) {
//       if (!addressLine1.trim()) errors.addressLine1 = "Enter address line 1.";
//       if (!city.trim()) errors.city = "Enter city.";
//       if (!state.trim()) errors.state = "Enter state.";
//       if (!zip.trim()) errors.zip = "Enter zip.";
//       if (!country.trim()) errors.country = "Enter country.";
//     }
//     if (currentStep === 6 && !selectedProduct) errors.selectedProduct = "Select a product.";

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

// const nextStep = () => {
//   if (validateStep(step)) {
//     setStep(step + 1 > 7 ? 7 : step + 1);  // Update step without using prev
//     setFieldErrors({});
//   }
// };
//  const prevStep = () => {
//     setStep((prev) => Math.max(prev - 1, 1));
//     setFieldErrors({});
//   };



//   // Email validation
//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   // Handling image change



 

//   // Handle form submission
//   const handleSubmit = async () => {
//     setLoading(true);
//     setFieldErrors({});

//     if (!selectedProduct) {
//       setFieldErrors({ selectedProduct: "Please select a product." });
//       setLoading(false);
//       return;
//     }

//     try {
//       const session = await account.get();
//       const address = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zip}, ${country}`;

//       const document = {
//         full_name: fullName,
//         email,
//         phone,
//         address,
//         selected_product: selectedProduct,
//         product_sku: sku || null, // Add SKU if provided
//         user_id: session.$id,
//         image_file_id: imageFileId || null // Will be null if no image uploaded
//       };

//       // Save to Appwrite database
//       await database.createDocument(
//         APPWRITE_DATABASE_ID,
//         APPWRITE_COLLECTION_ID,
//         ID.unique(),
//         document
//       );

//       // Optionally, send to Shopify (if needed)
//       await fetch("/.netlify/functions/sendToShopify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(document)
//       });

//       setStep(7); // Show thank-you step
//     } catch (err) {
//       console.error("Submission failed:", err);
//       setFieldErrors({ submit: "Submission failed. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

// return (
//     <div className="auth-wrapper">
//       <div className="logo-text">ELLA STEIN</div>
//       <div className="right-side">
//         {step === 1 && (
//           <section className="step-section active slide-up">
//             <div className="step-label">
//               <div className="step_number_main">
//                 <span className="step-number">1</span>
//                 <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//               </div>
//               Your Full Name:
//             </div>
//             <input
//               type="text"
//               placeholder="Type your answer here..."
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="styled-input placeholder-gray-700 text-base"
//             />
//             {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
//             <div className="ok-container">
//               <button onClick={nextStep} className="ok-button">OK</button>
//               <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//             </div>
//           </section>
//         )}

// {step === 2 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">2</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Email Address:
//     </div>

//     <p className="step-description mb-8">Please enter an email address whose inbox you access regularly.</p>

//     <input
//       type="email"
//       placeholder="name@example.com"
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//       className="styled-input"
//     />

//     {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}

//     {!isAuthenticated ? (
//       <>
//         {/* SEND OTP */}
//         <div className="ok-container mb-3">
//           <button onClick={sendOtp} className="ok-button" disabled={loading}>
//             {loading ? "Sending..." : "Send OTP"}
//           </button>
//           <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//         </div>

       

//         {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//         {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}
//         {justVerified && <p className="success-message">You're now verified!</p>}

//         {/* SIDE BY SIDE BUTTONS */}
//         <div className="flex gap-4 mt-3">
         

//           {otpSent && (
//             <button
//               onClick={sendOtp}
//               disabled={loading}
//               className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
//             >
//               {loading ? "Resending..." : "Resend OTP"}
//             </button>
//           )}
//         </div>
//       </>
//     ) : (
//       <>
//         <button
//           onClick={async () => {
//             try {
//               await account.deleteSession("current");
//               setIsAuthenticated(false);
//               setAuthMessage("");
//               setOtp("");
//               setJustVerified(false);
//               setUserId(false);
//               setOtpSent(false);
//               setStep(2);
//             } catch (err) {
//               console.error("Sign out error:", err);
//             }
//           }}
//           className="signout-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           Sign Out
//         </button>
//         <p className="success-message">✅ Verified and logged in!</p>
//       </>
//     )}
//   </section>
// )}

// {step === 3 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">3</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Enter OTP:
//     </div>


//     <input
//       type="text"
//       placeholder="Enter OTP"
//       value={otp}
//       onChange={handleOtpChange}
//       maxLength={6}
//       className="styled-input"
//     />

//     {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//     {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}

//     <div className="email_btn flex gap-4 mt-3">
//       <button
//         onClick={verifyOtp}
//         disabled={loading}
//         className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
//       >
//         {loading ? "Verifying..." : "Verify OTP"}
//       </button>

//       <button
//         onClick={sendOtp}
//         disabled={loading}
//         className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
//       >
//         {loading ? "Resending..." : "Resend OTP"}
//       </button>
//     </div>
//   </section>
// )}


//         {step === 4 && (
//           <PhoneNumberStep phone={phone} setPhone={setPhone} nextStep={nextStep} fieldErrors={fieldErrors} />
//         )}

//         {[5, 6, 7].map((num) => (
//           <section key={num} className={`step-section ${step === num ? "active slide-up" : "hidden"}`}>
//             {num === 5 && (
//               <div className="address-step">
//                 <div className="step-label">
//                   <div className="step_number_main">

//                     <span className="step-number">5</span>
//                     <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//                   </div>
//                   Address:
//                 </div>
//                 <p>This is the address Ella Stein will use to initiate a pick-up and product replacement.</p>
//                 <label>Address</label>
//                 <input className="text-[20px] sm:text-[18px] md:text-[16px] lg:text-[20px]" type="text" placeholder="65 Hansen Way" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />

//                 <label>Address line 2</label>
//                 <input type="text" placeholder="Apartment 4" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />

//                 <label>City/Town</label>
//                 <input type="text" placeholder="Palo Alto" value={city} onChange={(e) => setCity(e.target.value)} />

//                 <label>State/Region/Province</label>
//                 <input type="text" placeholder="California" value={state} onChange={(e) => setState(e.target.value)} />

//                 <label>Zip/Post code</label>
//                 <input type="text" placeholder="94304" value={zip} onChange={(e) => setZip(e.target.value)} />

//                 <label>Country</label>
//                 <input type="text" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)} />

//                 {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
//                 <div className="ok-container">
//       <button onClick={nextStep} className="ok-button">OK</button>
//       <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//     </div>
//               </div>
//             )}
// {num === 6 && (
//   <>
//   <div className="address-step">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">6</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Select Product:
//     </div>
// <div className="image-upload">
//   <label className="upload_image">Upload Product Image (Optional)</label>
//   <input type="file" accept="image/*" onChange={handleImageChange} />
//   {imagePreview && (
//     <img src={imagePreview} alt="Preview" style={{ width: "120px", marginTop: "10px" }} />
//   )}
//   {fieldErrors.image && <p className="error">{fieldErrors.image}</p>}
// </div>
// </div>
// <label className="upload_image">Enter SKU Number</label>
// <input
//   type="text"
//   placeholder="Enter product SKU"
//   value={sku}
//   onChange={(e) => setSku(e.target.value)}
//   className="styled-input"
// />
// {fieldErrors.sku && <p className="error">{fieldErrors.sku}</p>}

//     <input
//       value={productSearch}
//       onChange={(e) => setProductSearch(e.target.value)}
//       placeholder="Search products..."
//       className="search_product_input"
//     />

//     <ul className="product-list">
//       {loadingProducts ? (
//         <li>Loading...</li>
//       ) : fieldErrors.products ? (
//         <li>{fieldErrors.products}</li>
//       ) : (
//         filteredProducts.map((product) => (
//           <li
//             key={product.id}
//             className={`product-item ${selectedProduct === product.title ? "selected" : ""}`}
//             onClick={() => setSelectedProduct(product.title)}
//           >
//             {product.images?.[0]?.src && (
//               <img src={product.images[0].src} alt={product.title} className="product-image" />
//             )}
//             <span>{product.title}</span>
//           </li>
//         ))
//       )}
//     </ul>

//     <p className="error">{fieldErrors.selectedProduct}</p>
//     <p className="error">{fieldErrors.submit}</p>
//   </>
// )}



// {step === 7 && (
//   <div className="max-w-xl mx-auto  text-center submission_container">
//     {/* Removed the step number and arrow */}
//     <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 submisiion_headding">
//       Thank you for registering your Ella Stein jewelry under our Warranty Program.
//     </h1>
//     <p className="mt-4 text-lg sm:text-xl text-gray-600 submission_pera">
//       Learn more about caring for your jewelry using the link below.
//     </p>
//     <p className="mt-6">
//       <a
//         className=" submission_button inline-block px-6 py-3 bg-[#f2e1d1] text-lg sm:text-xl font-bold text-gray-800 rounded-md shadow-md hover:bg-[#e0cfbf] transition "
//         href="https://www.ellastein.com/pages/jewelry-care-tips"
//         target="_blank"
//         rel="noreferrer"
//       >
//         JEWELRY CARE TIPS
//       </a>
//     </p>
//   </div>
// )}


//           </section>
//         ))}

//        <div className="btn-group flex justify-between mt-4 gap-4">
//  {step > 1 && step <= 6 &&  (
//     <button onClick={prevStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
//       Previous
//     </button>
//   )}
 
// {step === 6 && (
//   <button
//     onClick={handleSubmit}
//     className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//     disabled={loading || !selectedProduct}
//   >
//     {loading ? "Submitting..." : "Submit"}
//   </button>
// )}

// </div>

//       </div>
//     </div>
//   );
// };

// export default Authe;


// 09/06/25

// import React, { useState, useEffect, useRef, useCallback, useMemo} from "react";

// import { Client, Account, Databases, ID, Storage } from "appwrite";
// import "./Authentication.css";
// import PhoneNumberStep from './PhoneNumberStep';

// const Authe = () => {
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [authMessage, setAuthMessage] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userId, setUserId] = useState(false);
//   const [addressLine1, setAddressLine1] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [justVerified, setJustVerified] = useState(false);

//   const [addressLine2, setAddressLine2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [zip, setZip] = useState("");
//   const [country, setCountry] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFileId, setImageFileId] = useState(null);
//   const [sku, setSku] = useState("");
 
// // Refs
// const address1Ref = useRef(null);
// const address2Ref = useRef(null);
// const cityRef = useRef(null);
// const stateRef = useRef(null);
// const zipRef = useRef(null);
// const countryRef = useRef(null);

// const emailInputRef = useRef(null);


//   const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
//   const APPWRITE_PROJECT_ID = "68271c3c000854f08575";
//   const APPWRITE_DATABASE_ID = "68271db80016565f6882";
//   const APPWRITE_COLLECTION_ID = "68271dcf002c6797363d";
  
//   const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
//   const account = useMemo(() => new Account(client), [client]);
//   const database = new Databases(client);
//   const storage = new Storage(client);
  
//   const APPWRITE_BUCKET_ID = "683e80fc0019228a6dfa";

// const handleVisibilityChange = useCallback(() => {
//   if (document.visibilityState === "visible") {
//     console.log("Tab is active again");
//   }
// }, []);

// const handleImageChange = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   setImagePreview(URL.createObjectURL(file));

//   try {
//     // Upload the image directly to Appwrite storage
//     const response = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);

//     // Log the response from Appwrite
//     console.log("Appwrite upload response:", response);

//     if (response && response.$id) {
//       setImageFileId(response.$id);  // Store the file ID returned by Appwrite
//       console.log("Image uploaded successfully. File ID:", response.$id);
//     } else {
//       throw new Error("Failed to upload image. No file ID returned.");
//     }
//   } catch (err) {
//     // Detailed error logging
//     console.error("Upload error:", err);
//     alert("Image upload failed. Check console for more details.");
//   }
// };

//   // Updated product fetch logic (only change)
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("/.netlify/functions/products");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setProducts(data);
//           setFilteredProducts(data);
//         } else {
//           setProducts([]);
//           setFilteredProducts([]);
//           setFieldErrors({ products: "Invalid products data." });
//         }
//       } catch {
//         setProducts([]);
//         setFilteredProducts([]);
//         setProducts([]);
//         setFieldErrors({ products: "Failed to load products." });
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (!Array.isArray(products)) return;
//     setFilteredProducts(
//       productSearch.trim() === ""
//         ? products
//         : products.filter((p) =>
//             p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
//           )
//     );
//   }, [productSearch, products]);

// // Session auto-refresh function
//   const autoRefreshInterval = useRef(null);

// const startAutoRefresh = useCallback(() => {
//   if (autoRefreshInterval.current) {
//     clearInterval(autoRefreshInterval.current);
//   }

//   autoRefreshInterval.current = setInterval(async () => {
//     try {
//       const session = await account.get();
//       if (!session) {
//         console.log("Session expired, logging out...");
//         setIsAuthenticated(false);
//         // Don't clear localStorage here since we're not using it for session persistence
//       }
//     } catch (err) {
//       console.error("Session refresh failed:", err);
//       setIsAuthenticated(false);
//       // Don't clear localStorage here since we're not using it for session persistence
//     }
//   }, 15 * 60 * 1000);
// }, [account]); // 👈 Add dependency

// useEffect(() => {
//   if (isAuthenticated) {
//     startAutoRefresh();
//   }
//   return () => {
//     clearInterval(autoRefreshInterval.current);
//   };
// }, [isAuthenticated, startAutoRefresh]);

//   // Handle visibility change to stop and start auto-refresh
// useEffect(() => {
//   document.addEventListener("visibilitychange", handleVisibilityChange);
//   return () => {
//     document.removeEventListener("visibilitychange", handleVisibilityChange);
//   };
// }, [handleVisibilityChange]); // ✅ Fix: add the dependency

// useEffect(() => {
//   const clearSessionOnLoad = async () => {
//   };

//   clearSessionOnLoad();
// }, [account]); // Add `account` as a dependency

//   // OTP and Email handling
//   const sendOtp = async () => {
//     setLoading(true);
//     setFieldErrors({});
//     setAuthMessage("");

//     if (!email || !validateEmail(email)) {
//       setFieldErrors({ email: "Enter a valid email address." });
//       setLoading(false);
//       return;
//     }

//     try {
//       // Clear any existing session first to ensure clean OTP process
//       try {
//         await account.deleteSession("current");
//         setIsAuthenticated(false);
//       } catch (err) {
//         // No existing session, continue
//         console.log("No existing session to clear");
//       }

//       const response = await account.createEmailToken(ID.unique(), email);
//       setUserId(response.userId);
//       console.log("OTP sent successfully:", response);
//       setOtp(""); // Clear any existing OTP
//       setAuthMessage("📧 OTP sent to your email.");
//       setStep(3);  // Move to OTP entry step
//     } catch (err) {
//       console.error("Error sending OTP:", err);
//       setFieldErrors({ email: err.message || "Failed to send OTP." });
//     } finally {
//       setLoading(false);
//     }
//   };

// // Fixed OTP verification function
// const verifyOtp = async () => {
//   setLoading(true);
//   setFieldErrors({});  // Reset field errors
//   setAuthMessage("");   // Clear previous auth messages

//   const secret = otp.trim();  // OTP entered by the user

//   // Validate inputs
//   if (!userId) {
//     setFieldErrors({ otp: "Session expired. Please request a new OTP." });
//     setLoading(false);
//     return;
//   }

//   if (!secret) {
//     setFieldErrors({ otp: "Please enter the OTP." });
//     setLoading(false);
//     return;
//   }

//   if (secret.length !== 6) {
//     setFieldErrors({ otp: "OTP must be 6 digits." });
//     setLoading(false);
//     return;
//   }

//   try {
//     // This will create a session ONLY if the OTP is correct
//     // If OTP is wrong, it will throw an error
//     const session = await account.createSession(userId, secret);
    
//     console.log("OTP verified successfully, session created:", session);
    
//     // Only set authenticated if session creation was successful
//     setIsAuthenticated(true);
//     setAuthMessage("✅ OTP verified successfully!");
//     setJustVerified(true);
    
//     // Clear OTP for security
//     setOtp("");
    
//     // Move to next step
//     nextStep();
    
//   } catch (err) {
//     console.error("OTP verification failed:", err);
    
//     // Handle different types of errors
//     if (err.message.includes("Invalid credentials") || 
//         err.message.includes("token") || 
//         err.code === 401) {
//       setFieldErrors({ otp: "Invalid OTP. Please check and try again." });
//     } else if (err.message.includes("expired")) {
//       setFieldErrors({ otp: "OTP has expired. Please request a new one." });
//       setUserId(false);
//     } else {
//       setFieldErrors({ otp: "Verification failed. Please try again." });
//     }
    
//     // Don't set isAuthenticated to true on error
//     setIsAuthenticated(false);
//     setJustVerified(false);
//   } finally {
//     setLoading(false);
//   }
// };

//   // OTP change handler (missing function)
//   const handleOtpChange = (e) => {
//     const value = e.target.value.replace(/\D/g, ''); // Only allow digits
//     if (value.length <= 6) { // Limit to 6 digits
//       setOtp(value);
//       setFieldErrors({ ...fieldErrors, otp: "" });
//       setAuthMessage("");
//     }
//   };

//   // Step validation and navigation
//   const validateStep = (currentStep) => {
//     const errors = {};

//     if (currentStep === 1 && !fullName.trim()) errors.fullName = "Enter your full name.";
//     if (currentStep === 2 && !email.trim()) errors.email = "Enter your email.";
//     if (currentStep === 3 && !otp.trim()) errors.otp = "Enter the OTP.";
//     if (currentStep === 4 && !phone.trim()) errors.phone = "Enter your phone number.";
//     if (currentStep === 5) {
//       if (!addressLine1.trim()) errors.addressLine1 = "Please enter your address.";
//     if (!city.trim()) errors.city = "Please enter your city.";
//     if (!country.trim()) errors.country = "Please enter your country.";
//     }
//      if (currentStep === 6) {
//   const hasImage = !!imageFileId;
//   const hasSku = !!sku.trim();
//   if (!hasImage && !hasSku) {
//     errors.generalImageOrSku = "Please upload an image or enter SKU number to continue.";
//   }
// }


//   setFieldErrors(errors);
//   return Object.keys(errors).length === 0;
// };
// const nextStep = () => {
//   if (validateStep(step)) {
//     setStep(step + 1 > 7 ? 7 : step + 1);  // Update step without using prev
//     setFieldErrors({});
//   }
// };

// const handleEnterKey = async (e) => {
//   if (e.key !== "Enter") return;
//   e.preventDefault();

//   switch (step) {
//     case 1:
//       if (validateStep(1)) nextStep();
//       break;
//     case 2:
//       if (validateStep(2)) await sendOtp();
//       break;
//     case 3:
//       if (justVerified) nextStep();
//       else if (validateStep(3)) await verifyOtp();
//       break;
//     case 4:
//       if (validateStep(4)) nextStep();
//       break;
//    case 5:
//   console.log("Enter pressed on step 5");
//   if (validateStep(5)) {
//     console.log("Validation passed for step 5");
//     nextStep();
//   } else {
//     console.log("Validation failed for step 5");
//   }
//   break;
//     case 6:
//       if (validateStep(6)) await handleSubmit();
//       break;
//     default:
//       break;
//   }
// };

// const focusNextField = (ref) => {
//   console.log("Attempting to focus:", ref); // Add this
//   if (ref?.current) {
//     ref.current.focus();
//   }
// };



// // const prevStep = () => {
// //   setFieldErrors({});

// //   setStep((prev) => {
// //     const newStep = Math.max(prev - 1, 1);

// //     // If returning to step 3 (OTP step), reset OTP-related state
// //     if (newStep === 3) {
// //       setOtp("");
// //       setAuthMessage("");
// //       setJustVerified(false);
// //       setIsAuthenticated(false);
// //     }

// //     // If returning to step 2 (email step), reset email-related state
// //     if (newStep === 2) {
// //       setEmail("");
// //       setUserId(false);
// //       setAuthMessage(""); // ✅ THIS is the key line to fix your issue
// //       setJustVerified(false); // optional, for safety
// //     }

// //     return newStep;
// //   });
// // };

// const prevStep = () => {
//   setFieldErrors({});

//   setStep((prev) => {
//     const newStep = Math.max(prev - 1, 1);

//     // Step-specific resets
//     switch (newStep) {
//       case 1: // Full Name step
//         setFullName("");
//         break;
//       case 2: // Email step
//         setEmail("");
//         setUserId(false);
//         setIsAuthenticated(false);
//         setJustVerified(false);
//         setAuthMessage("");
//         break;
//       case 3: // OTP step
//         setOtp("");
//         setIsAuthenticated(false);
//         setJustVerified(false);
//         setAuthMessage("");
//         break;
//       case 4: // Phone number step
//         setPhone("");
//         break;
//       case 5: // Address step
//         setAddressLine1("");
//         setAddressLine2("");
//         setCity("");
//         setState("");
//         setZip("");
//         setCountry("");
//         break;
//       case 6: // Product/SKU step
//         setSelectedProduct("");
//         setSku("");
//         setImageFileId(null);
//         setImagePreview(null);
//         break;
//       default:
//         break;
//     }

//     return newStep;
//   });
// };




//   // Email validation
//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   // Handle form submission
//   const handleSubmit = async () => {
//     setLoading(true);
//     setFieldErrors({});

//    const hasImage = !!imageFileId;
// const hasSku = !!sku.trim();

// if (!hasImage && !hasSku) {
//   setFieldErrors({
//     generalImageOrSku: "Please upload an image or enter SKU number.",
//   });
//   setLoading(false);
//   return;
// }


//     try {
//       const session = await account.get();
//       const address = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zip}, ${country}`;

//       const document = {
//         full_name: fullName,
//         email,
//         phone,
//         address,
//         selected_product: selectedProduct,
//         product_sku: sku || null, // Add SKU if provided
//         user_id: session.$id,
//         image_file_id: imageFileId || null // Will be null if no image uploaded
//       };

//       // Save to Appwrite database
//       await database.createDocument(
//         APPWRITE_DATABASE_ID,
//         APPWRITE_COLLECTION_ID,
//         ID.unique(),
//         document
//       );

//       // Optionally, send to Shopify (if needed)
//       await fetch("/.netlify/functions/sendToShopify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(document)
//       });

//       setStep(7); // Show thank-you step
//     } catch (err) {
//       console.error("Submission failed:", err);
//       setFieldErrors({ submit: "Submission failed. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

// return (
//     <div className="auth-wrapper">
//       <div className="logo-text">ELLA STEIN</div>
//       <div className="right-side">
//         {step === 1 && (
//           <section className="step-section active slide-up">
//             <div className="step-label">
//               <div className="step_number_main">
//                 <span className="step-number">1</span>
//                 <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//               </div>
//               Your Full Name:
//             </div>
//             <input
//               type="text"
//               placeholder="Type your answer here..."
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               onKeyDown={handleEnterKey}
//               className="styled-input placeholder-gray-700 text-base"
//             />
//             {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
//             <div className="ok-container">
//               <button onClick={nextStep} className="ok-button">OK</button>
//               <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//             </div>
//           </section>
//         )}

// {step === 2 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">2</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Email Address:
//     </div>

//     <p className="step-description mb-8">Please enter an email address whose inbox you access regularly.</p>

//     <input
//       ref={emailInputRef} // 👈 Add this line

//       type="email"
//       placeholder="name@example.com"
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//       onKeyDown={handleEnterKey}
//       className="styled-input"
//     />

//     {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}

//     {!isAuthenticated ? (
//       <>
//         {/* SEND OTP */}
//         <div className="ok-container mb-3">
//           <button onClick={sendOtp} className="ok-button" disabled={loading}>
//             {loading ? "Sending..." : "Send OTP"}
//           </button>
//           <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//         </div>

//         {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//         {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}
//         {justVerified && <p className="success-message">You're now verified!</p>}

//         {/* SIDE BY SIDE BUTTONS */}
       
//       </>
//     ) : (
//       <>
//         <button
//           onClick={async () => {
//             try {
//               await account.deleteSession("current");
//               setIsAuthenticated(false);
//               setAuthMessage("");
//               setOtp("");
//               setJustVerified(false);
//               setUserId(false);
//               setStep(2);
//             } catch (err) {
//               console.error("Sign out error:", err);
//             }
//           }}
//           className="signout-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           Sign Out
//         </button>
//         <p className="success-message">✅ Verified and logged in!</p>
//       </>
//     )}
//   </section>
// )}

// {step === 3 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">3</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Enter OTP:
//     </div>

//     <p className="step-description mb-4">Please enter the 6-digit OTP sent to your email address.</p>

//     <input
//       type="text"
//       placeholder="Enter 6-digit OTP"
//       value={otp}
//       onChange={handleOtpChange}
//       maxLength={6}
//       onKeyDown={handleEnterKey}
//       className="styled-input"
//       style={{ fontSize: '16px', letterSpacing: '2px', textAlign: 'left' }}
//     />

//     {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//     {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}

//     <div className="email_btn flex gap-4 mt-3">
//       <button
//         onClick={verifyOtp}
//         disabled={loading || otp.length !== 6}
//         className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
//       >
//         {loading ? "Verifying..." : "Verify OTP"}
//       </button>

//       <button
//         onClick={sendOtp}
//         disabled={loading}
//         className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
//       >
//         {loading ? "Resending..." : "Resend OTP"}
//       </button>
//     </div>
//   </section>
// )}

//         {step === 4 && (
//           <PhoneNumberStep phone={phone} setPhone={setPhone} nextStep={nextStep} fieldErrors={fieldErrors} />
//         )}

//         {[5, 6, 7].map((num) => (
//           <section key={num} className={`step-section ${step === num ? "active slide-up" : "hidden"}`}>
//             {num === 5 && (
//               <div className="address-step">
//                 <div className="step-label">
//                   <div className="step_number_main">

//                     <span className="step-number">5</span>
//                     <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//                   </div>
//                   Address:
//                 </div>
//                 <p>This is the address Ella Stein will use to initiate a pick-up and product replacement.</p>
//                 <label>Address</label>
                
//                 <input  ref={address1Ref} className=" "  type="text" placeholder="65 Hansen Way" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)}   
//       onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(address2Ref);
//     }
//   }}
//    />
//   {fieldErrors.addressLine1 && <p className="error">{fieldErrors.addressLine1}</p>}


//                 <label>Address line 2</label>
//                 <input ref={address2Ref} type="text" placeholder="Apartment 4" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)}     
//                  onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(cityRef);
//     }
//   }}

//                 />

//                 <label>City/Town</label>
//                 <input ref={cityRef} type="text" placeholder="Palo Alto" value={city} onChange={(e) => setCity(e.target.value)}    
//                  onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(stateRef);
//     }
//   }}
//                 />
//                   {fieldErrors.city && <p className="error">{fieldErrors.city}</p>}


//                 <label>State/Region/Province</label>
//                 <input ref={stateRef} type="text" placeholder="California" value={state} onChange={(e) => setState(e.target.value)}     
//                 onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(zipRef);
//     }
//   }}
//                 />

//                 <label>Zip/Post code</label>
//                 <input ref={zipRef} type="text" placeholder="94304" value={zip} onChange={(e) => setZip(e.target.value)} 
//                  onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(countryRef);
//     }
//   }}
//                 />
//                   {fieldErrors.zip && <p className="error">{fieldErrors.zip}</p>}


//                 <label>Country</label>
//                 <input ref={countryRef} type="text" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)}   onKeyDown={handleEnterKey} />

//                 {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
//                   {fieldErrors.country && <p className="error">{fieldErrors.country}</p>}

//                 <div className="ok-container">
//       <button onClick={nextStep} className="ok-button">OK</button>
//       <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//     </div>
//               </div>
//             )}
// {num === 6 && (
//   <>
//     <div className="address-step">
//       <div className="step-label">
//         <div className="step_number_main">
//           <span className="step-number">6</span>
//           <span>
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//               <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//             </svg>
//           </span>
//         </div>
//         Select Product:
//       </div>

//       <div className="image-upload">
//         <div className="address-step">
//     <p>Please upload a product image or enter a SKU number.</p>
// </div>
//         <label className="upload_image"> <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Upload Image/ Take picture</label>
//         <input className="upload_image_span" type="file" accept="image/*" onChange={handleImageChange} />
//         {imagePreview && (
//           <img src={imagePreview} alt="Preview" style={{ width: "120px", marginTop: "10px" }} />
//         )}
//       </div>
//     </div>

//     <label className="upload_image"><span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Enter SKU or Product name</label>
//     <input
//       type="text"
//       placeholder="Enter product SKU"
//       value={sku}
//       onChange={(e) => setSku(e.target.value)}
//       handleEnterKey={handleEnterKey}
//       className="styled-input"
//     />

//     {/* ✅ Combined error message */}
//     {fieldErrors.generalImageOrSku && (
//       <p className="error">{fieldErrors.generalImageOrSku}</p>
//     )}
//     <label className="upload_image search_prdouct_headding"><span className="subheadding_product" style={{ fontSize: '18px' }}>●</span>  Search product</label>
//     <input
//       value={productSearch}
//       onChange={(e) => setProductSearch(e.target.value)}
//       placeholder="Search products..."
//       className="search_product_input"
//     />
// <label className="upload_image category_headding "><span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Select Category </label>
//    <ul className="product-list">
//   {loadingProducts ? (
//     <li>Loading...</li>
//   ) : fieldErrors.products ? (
//     <li>{fieldErrors.products}</li>
//   ) : (
//     filteredProducts.map((product) => (
//       <li
//         key={product.id}
//         className={`product-item ${selectedProduct === product.title ? "selected" : ""}`}
//         onClick={() => setSelectedProduct(product.title)}
//       >
//         {product.images?.[0]?.src && (
//           <img src={product.images[0].src} alt={product.title} className="product-image" />
//         )}
//         <span>{product.title}</span>
//       </li>
//     ))
//   )}
// </ul>

// {/* Cross button outside the product list - only show when a product is selected */}
// {selectedProduct && (
//   <div className="selected-product-info" style={{ 
//     marginTop: '15px', 
//     padding: '8px', 
//     backgroundColor: '#f0f8ff', 
//     borderRadius: '4px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   }}>
//     <span style={{ fontSize: '14px', color: '#333' }}>
//       Selected: <strong>{selectedProduct}</strong>
//     </span>
//     <button
//       onClick={() => setSelectedProduct("")}
//       style={{
//         background: 'none',
//         border: 'none',
//         cursor: 'pointer',
//         padding: '5px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: '3px'
//       }}
//       title="Remove selection"
//       onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebee'}
//       onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//     >
//       <svg 
//         xmlns="http://www.w3.org/2000/svg" 
//         width="18" 
//         height="18" 
//         fill="red" 
//         viewBox="0 0 16 16"
//         style={{ transition: 'all 0.2s ease' }}
//       >
//         <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
//       </svg>
//     </button>
//   </div>
// )}

//     <p className="error">{fieldErrors.selectedProduct}</p>
//     <p className="error">{fieldErrors.submit}</p>
//   </>
// )}


// {step === 7 && (
//   <div className="max-w-xl mx-auto  text-center submission_container">
//     {/* Removed the step number and arrow */}
//     <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 submisiion_headding">
//       Thank you for registering your Ella Stein jewelry under our Warranty Program.
//     </h1>
//     <p className="mt-4 text-lg sm:text-xl text-gray-600 submission_pera">
//       Learn more about caring for your jewelry using the link below.
//     </p>
//     <p className="mt-6">
//       <a
//         className=" submission_button inline-block px-6 py-3 bg-[#f2e1d1] text-lg sm:text-xl font-bold text-gray-800 rounded-md shadow-md hover:bg-[#e0cfbf] transition "
//         href="https://www.ellastein.com/pages/jewelry-care-tips"
//         target="_blank"
//         rel="noreferrer"
//       >
//         JEWELRY CARE TIPS
//       </a>
//       <span className="enter-text enter_tips_btn">  press <span className="enter-key">Enter ↵</span></span>
//     </p>
//   </div>
// )}

//           </section>
//         ))}

//        <div className="btn-group flex justify-between mt-4 gap-4">
//  {step > 1 && step <= 6 &&  (
//     <button onClick={prevStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
//       Previous
//     </button>
//   )}
 
// {step === 6 && (
//   <button
//     onClick={handleSubmit}
//     className="submit_btn px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//    disabled={loading}
//   >
//     {loading ? "Submitting..." : "Submit"}
//   </button>
// )}

// </div>

//       </div>
//     </div>
//   );
// };

// export default Authe;








// addres 12-06-25


// import React, { useState, useEffect, useRef, useCallback, useMemo} from "react";
// import { Client, Account, Databases, ID, Storage } from "appwrite";
// import axios from 'axios';
// import "./Authentication.css";
// import PhoneNumberStep from './PhoneNumberStep';

// const Authe = () => {
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [authMessage, setAuthMessage] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userId, setUserId] = useState(false);
//   const [addressLine1, setAddressLine1] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [justVerified, setJustVerified] = useState(false);
//   const [addressLine2, setAddressLine2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [zip, setZip] = useState("");
//   const [country, setCountry] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFileId, setImageFileId] = useState(null);
//   const [sku, setSku] = useState("");
  
//   // New states for categories
//   const [showCategories, setShowCategories] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [showProducts, setShowProducts] = useState(false);
  
//   const address1Ref = useRef(null);
//   const address2Ref = useRef(null);
//   const cityRef = useRef(null);
//   const stateRef = useRef(null);
//   const zipRef = useRef(null);
//   const countryRef = useRef(null);
//   const emailInputRef = useRef(null);
//   const searchInputRef = useRef(null);
  
//   // Categories array
//   const categories = [
//     { id: 1, name: "Necklaces", key: "necklace" },
//     { id: 2, name: "Earrings", key: "earring" },
//     { id: 3, name: "Bracelets", key: "bracelet" },
//     { id: 4, name: "Rings", key: "ring" }
//   ];
  
//   const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
//   const APPWRITE_PROJECT_ID = "68271c3c000854f08575";
//   const APPWRITE_DATABASE_ID = "68271db80016565f6882";
//   const APPWRITE_COLLECTION_ID = "68271dcf002c6797363d";
//   const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
//   const account = useMemo(() => new Account(client), [client]);
//   const database = new Databases(client);
//   const storage = new Storage(client);
//   const APPWRITE_BUCKET_ID = "683e80fc0019228a6dfa";
//   const [addressSuggestions, setAddressSuggestions] = useState([]);


// const fetchNominatimSuggestions = async (query) => {
//   try {
//     const res = await axios.get("https://nominatim.openstreetmap.org/search", {
//       params: {
//         q: query,
//         format: "json",
//         addressdetails: 1,
//         limit: 5,
//         countrycodes: "us", // restrict to United States
//       },
//     });

//     // Extra check in case Nominatim returns unexpected data
//     return res.data.filter(
//       (item) =>
//         item?.address?.country_code?.toLowerCase() === "us" ||
//         item?.address?.country?.toLowerCase() === "united states"
//     );
//   } catch (err) {
//     console.error("Error fetching OSM suggestions:", err);
//     return [];
//   }
// };


// useEffect(() => {
//   const delayDebounceFn = setTimeout(() => {
//     if (addressLine1.length > 3) {
//       fetchNominatimSuggestions(addressLine1).then(setAddressSuggestions);
//     } else {
//       setAddressSuggestions([]);
//     }
//   }, 300); // debounce

//   return () => clearTimeout(delayDebounceFn);
// }, [addressLine1]);



// const handleVisibilityChange = useCallback(() => {
//   if (document.visibilityState === "visible") {
//     console.log("Tab is active again");
//   }
// }, []);

// const handleImageChange = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   setImagePreview(URL.createObjectURL(file));

//   try {
//     const response = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);
//     console.log("Appwrite upload response:", response);

//     if (response && response.$id) {
//       setImageFileId(response.$id); 
//       console.log("Image uploaded successfully. File ID:", response.$id);
//     } else {
//       throw new Error("Failed to upload image. No file ID returned.");
//     }
//   } catch (err) {
//     console.error("Upload error:", err);
//     alert("Image upload failed. Check console for more details.");
//   }
// };




//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("/.netlify/functions/products");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setProducts(data);
//           setFilteredProducts(data);
//         } else {
//           setProducts([]);
//           setFilteredProducts([]);
//           setFieldErrors({ products: "Invalid products data." });
//         }
//       } catch {
//         setProducts([]);
//         setFilteredProducts([]);
//         setFieldErrors({ products: "Failed to load products." });
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Filter products based on category and search
//   useEffect(() => {
//     if (!Array.isArray(products)) return;
    
//     let filtered = products;
    
//     // Filter by category if selected
//     if (selectedCategory) {
//       filtered = products.filter((product) => {
//         const productTitle = product.title?.toLowerCase() || '';
//         const productType = product.product_type?.toLowerCase() || '';
//         const productTags = product.tags || [];
//         const categoryKey = selectedCategory.toLowerCase();
        
//         // Check in title
//         const titleMatch = productTitle.includes(categoryKey);
        
//         // Check in product type
//         const typeMatch = productType.includes(categoryKey);
        
//         // Check in tags
//         const tagMatch = productTags.some(tag => 
//           typeof tag === 'string' ? tag.toLowerCase().includes(categoryKey) : false
//         );
        
//         // Check for specific category mappings
//         let categoryMatch = false;
//         switch(categoryKey) {
//           case 'necklace':
//             categoryMatch = productTitle.includes('necklace') || 
//                           productType.includes('necklace') || 
//                           productTitle.includes('chain') ||
//                           productType.includes('chain');
//             break;
//           case 'earring':
//             categoryMatch = productTitle.includes('earring') || 
//                           productType.includes('earring') ||
//                           productTitle.includes('ear') ||
//                           productType.includes('ear');
//             break;
//           case 'bracelet':
//             categoryMatch = productTitle.includes('bracelet') || 
//                           productType.includes('bracelet') ||
//                           productTitle.includes('band') ||
//                           productType.includes('band');
//             break;
//           case 'ring':
//             categoryMatch = productTitle.includes('ring') || 
//                           productType.includes('ring');
//             break;
//           default:
//             categoryMatch = titleMatch || typeMatch || tagMatch;
//         }
        
//         return titleMatch || typeMatch || tagMatch || categoryMatch;
//       });
//     }
    
//     // Filter by search text
//     if (productSearch.trim() !== "" && showProducts && !showCategories) {
//       filtered = filtered.filter((p) =>
//         p.title.toLowerCase().includes(productSearch.toLowerCase().trim())
//       );
//     }
    
//     setFilteredProducts(filtered);
//   }, [productSearch, products, selectedCategory, showProducts, showCategories]);

//   // Handle search input focus
//   const handleSearchFocus = () => {
//     setShowCategories(true);
//     setShowProducts(false);
//     setProductSearch("");
//     setSelectedCategory("");
//   };

//   // Handle category selection
//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category.key);
//     setProductSearch(category.name);
//     setShowCategories(false);
//     setShowProducts(true);
    
//     // Debug: Log the selected category and available products
//     console.log('Selected category:', category.key);
//     console.log('Available products:', products.length);
//     console.log('First few products:', products.slice(0, 3).map(p => ({
//       title: p.title,
//       product_type: p.product_type,
//       tags: p.tags
//     })));
//   };

//   // Handle clicking outside to close dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
//         setShowCategories(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

  




//   const autoRefreshInterval = useRef(null);
//   const startAutoRefresh = useCallback(() => {
//   if (autoRefreshInterval.current) {
//     clearInterval(autoRefreshInterval.current);
//   }

//   autoRefreshInterval.current = setInterval(async () => {
//     try {
//       const session = await account.get();
//       if (!session) {
//         console.log("Session expired, logging out...");
//         setIsAuthenticated(false);
//       }
//     } catch (err) {
//       console.error("Session refresh failed:", err);
//       setIsAuthenticated(false);
//     }
//   }, 15 * 60 * 1000);
// }, [account]);

// useEffect(() => {
//   if (isAuthenticated) {
//     startAutoRefresh();
//   }
//   return () => {
//     clearInterval(autoRefreshInterval.current);
//   };
// }, [isAuthenticated, startAutoRefresh]);

// useEffect(() => {
//   document.addEventListener("visibilitychange", handleVisibilityChange);
//   return () => {
//     document.removeEventListener("visibilitychange", handleVisibilityChange);
//   };
// }, [handleVisibilityChange]);

// useEffect(() => {
//   const clearSessionOnLoad = async () => {
//   };

//   clearSessionOnLoad();
// }, [account]); 

//   const sendOtp = async () => {
//     setLoading(true);
//     setFieldErrors({});
//     setAuthMessage("");

//     if (!email || !validateEmail(email)) {
//       setFieldErrors({ email: "Enter a valid email address." });
//       setLoading(false);
//       return;
//     }

//     try {
//       try {
//         await account.deleteSession("current");
//         setIsAuthenticated(false);
//       } catch (err) {
//         console.log("No existing session to clear");
//       }

//       const response = await account.createEmailToken(ID.unique(), email);
//       setUserId(response.userId);
//       console.log("OTP sent successfully:", response);
//       setOtp(""); 
//       setAuthMessage("📧 OTP sent to your email.");
//       setStep(3); 
//     } catch (err) {
//       console.error("Error sending OTP:", err);
//       setFieldErrors({ email: err.message || "Failed to send OTP." });
//     } finally {
//       setLoading(false);
//     }
//   };

// const verifyOtp = async () => {
//   setLoading(true);
//   setFieldErrors({});  
//   setAuthMessage("");  

//   const secret = otp.trim();  
//   if (!userId) {
//     setFieldErrors({ otp: "Session expired. Please request a new OTP." });
//     setLoading(false);
//     return;
//   }
//   if (!secret) {
//     setFieldErrors({ otp: "Please enter the OTP." });
//     setLoading(false);
//     return;
//   }
//   if (secret.length !== 6) {
//     setFieldErrors({ otp  : "OTP must be 6 digits." });
//     setLoading(false);
//     return;
//   }

//   try {
//     const session = await account.createSession(userId, secret);
//     console.log("OTP verified successfully, session created:", session);
//         setIsAuthenticated(true);
//     setAuthMessage("✅ OTP verified successfully!");
//     setJustVerified(true);
//     setOtp("");
//         nextStep();
    
//   } catch (err) {
//     console.error("OTP verification failed:", err);
//         if (err.message.includes("Invalid credentials") || 
//         err.message.includes("token") || 
//         err.code === 401) {
//       setFieldErrors({ otp: "Invalid OTP. Please check and try again." });
//     } else if (err.message.includes("expired")) {
//       setFieldErrors({ otp: "OTP has expired. Please request a new one." });
//       setUserId(false);
//     } else {
//       setFieldErrors({ otp: "Verification failed. Please try again." });
//     }
//         setIsAuthenticated(false);
//     setJustVerified(false);
//   } finally {
//     setLoading(false);
//   }
// };
//   const handleOtpChange = (e) => {
//     const value = e.target.value.replace(/\D/g, ''); 
//     if (value.length <= 6) { 
//       setOtp(value);
//       setFieldErrors({ ...fieldErrors, otp: "" });
//       setAuthMessage("");
//     }
//   };
//   const validateStep = (currentStep) => {
//     const errors = {};
//     if (currentStep === 1 && !fullName.trim()) errors.fullName = "Enter your full name.";
//     if (currentStep === 2 && !email.trim()) errors.email = "Enter your email.";
//     if (currentStep === 3 && !otp.trim()) errors.otp = "Enter the OTP.";
//     if (currentStep === 4 && !phone.trim()) errors.phone = "Enter your phone number.";
//     if (currentStep === 5) {
//       if (!addressLine1.trim()) errors.addressLine1 = "Please enter your address.";
//     if (!city.trim()) errors.city = "Please enter your city.";
//     if (!country.trim()) errors.country = "Please enter your country.";
//     }
//      if (currentStep === 6) {
//   const hasImage = !!imageFileId;
//   const hasSku = !!sku.trim();
//   if (!hasImage && !hasSku) {
//     errors.generalImageOrSku = "Please upload an image or enter SKU number to continue.";
//   }
// }

// setFieldErrors(errors);
//   return Object.keys(errors).length === 0;
// };
// const nextStep = () => {
//   if (validateStep(step)) {
//     setStep(step + 1 > 7 ? 7 : step + 1); 
//     setFieldErrors({});
//   }
// };

// const handleEnterKey = async (e) => {
//   if (e.key !== "Enter") return;
//   e.preventDefault();

//   switch (step) {
//     case 1:
//       if (validateStep(1)) nextStep();
//       break;
//     case 2:
//       if (validateStep(2)) await sendOtp();
//       break;
//     case 3:
//       if (justVerified) nextStep();
//       else if (validateStep(3)) await verifyOtp();
//       break;
//     case 4:
//       if (validateStep(4)) nextStep();
//       break;
//    case 5:
//   console.log("Enter pressed on step 5");
//   if (validateStep(5)) {
//     console.log("Validation passed for step 5");
//     nextStep();
//   } else {
//     console.log("Validation failed for step 5");
//   }
//   break;
//     case 6:
//       if (validateStep(6)) await handleSubmit();
//       break;
//     default:
//       break;
//   }
// };

// const focusNextField = (ref) => {
//   console.log("Attempting to focus:", ref); 
//   if (ref?.current) {
//     ref.current.focus();
//   }
// };

// const prevStep = () => {
//   setFieldErrors({});

//   setStep((prev) => {
//     const newStep = Math.max(prev - 1, 1);
//     switch (newStep) {
//       case 1:
//         setFullName("");
//         break;
//       case 2:
//         setEmail("");
//         setUserId(false);
//         setIsAuthenticated(false);
//         setJustVerified(false);
//         setAuthMessage("");
//         break;
//       case 3: 
//         setOtp("");
//         setIsAuthenticated(false);
//         setJustVerified(false);
//         setAuthMessage("");
//         break;
//       case 4: 
//         setPhone("");
//         break;
//       case 5: 
//         setAddressLine1("");
//         setAddressLine2("");
//         setCity("");
//         setState("");
//         setZip("");
//         setCountry("");
//         break;
//       case 6: 
//         setSelectedProduct("");
//         setSku("");
//         setImageFileId(null);
//         setImagePreview(null);
//         break;
//       default:
//         break;
//     }
//     return newStep;
//   });
// };

// const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const handleSubmit = async () => {
//     setLoading(true);
//     setFieldErrors({});

//    const hasImage = !!imageFileId;
// const hasSku = !!sku.trim();

// if (!hasImage && !hasSku) {
//   setFieldErrors({
//     generalImageOrSku: "Please upload an image or enter SKU number.",
//   });
//   setLoading(false);
//   return;
// }

// try {
//       const session = await account.get();
//       const address = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zip}, ${country}`;
//       const document = {
//         full_name: fullName,
//         email,
//         phone,
//         address,
//         selected_product: selectedProduct,
//         product_sku: sku || null,
//         user_id: session.$id,
//         image_file_id: imageFileId || null 
//       };
//       await database.createDocument(
//         APPWRITE_DATABASE_ID,
//         APPWRITE_COLLECTION_ID,
//         ID.unique(),
//         document
//       );
//       await fetch("/.netlify/functions/sendToShopify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(document)
//       });

//       setStep(7); 
//     } catch (err) {
//       console.error("Submission failed:", err);
//       setFieldErrors({ submit: "Submission failed. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

// return (
//     <div className="auth-wrapper">
//       <div className="logo-text">ELLA STEIN</div>
//       <div className="right-side">
//         {step === 1 && (
//           <section className="step-section active slide-up">
//             <div className="step-label">
//               <div className="step_number_main">
//                 <span className="step-number">1</span>
//                 <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//               </div>
//               Your Full Name:
//             </div>
//             <input
//               type="text"
//               placeholder="Type your answer here..."
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               onKeyDown={handleEnterKey}
//               className="styled-input placeholder-gray-700 text-base"
//             />
//             {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
//             <div className="ok-container">
//               <button onClick={nextStep} className="ok-button">OK</button>
//               <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//             </div>
//           </section>
//         )}

// {step === 2 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">2</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Email Address:
//     </div>

//     <p className="step-description mb-8">Please enter an email address whose inbox you access regularly.</p>

//     <input
//       ref={emailInputRef} 
//       type="email"
//       placeholder="name@example.com"
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//       onKeyDown={handleEnterKey}
//       className="styled-input"
//     />
//     {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}
//     {!isAuthenticated ? (
//       <>
//         <div className="ok-container mb-3">
//           <button onClick={sendOtp} className="ok-button" disabled={loading}>
//             {loading ? "Sending..." : "Send OTP"}
//           </button>
//           <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//         </div>

//         {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//         {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}
//         {justVerified && <p className="success-message">You're now verified!</p>}       
//       </>
//     ) : (
//       <>
//         <button
//           onClick={async () => {
//             try {
//               await account.deleteSession("current");
//               setIsAuthenticated(false);
//               setAuthMessage("");
//               setOtp("");
//               setJustVerified(false);
//               setUserId(false);
//               setStep(2);
//             } catch (err) {
//               console.error("Sign out error:", err);
//             }
//           }}
//           className="signout-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           Sign Out
//         </button>
//         <p className="success-message">✅ Verified and logged in!</p>
//       </>
//     )}
//   </section>
// )}

// {step === 3 && (
//   <section className="step-section active slide-up">
//     <div className="step-label">
//       <div className="step_number_main">
//         <span className="step-number">3</span>
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//             <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//           </svg>
//         </span>
//       </div>
//       Enter OTP:
//     </div>
//     <p className="step-description mb-4">Please enter the 6-digit OTP sent to your email address.</p>

//     <input
//       type="text"
//       placeholder="Enter 6-digit OTP"
//       value={otp}
//       onChange={handleOtpChange}
//       maxLength={6}
//       onKeyDown={handleEnterKey}
//       className="styled-input"
//       style={{ fontSize: '16px', letterSpacing: '2px', textAlign: 'left' }}
//     />
//     {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
//     {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}

//     <div className="email_btn flex gap-4 mt-3">
//       <button
//         onClick={verifyOtp}
//         disabled={loading || otp.length !== 6}
//         className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
//       >
//         {loading ? "Verifying..." : "Verify OTP"}
//       </button>

//       <button
//         onClick={sendOtp}
//         disabled={loading}
//         className="bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
//       >
//         {loading ? "Resending..." : "Resend OTP"}
//       </button>
//     </div>
//   </section>
// )}

// {step === 4 && (
//           <PhoneNumberStep phone={phone} setPhone={setPhone} nextStep={nextStep} fieldErrors={fieldErrors} />
//         )}

//         {[5, 6, 7].map((num) => (
//           <section key={num} className={`step-section ${step === num ? "active slide-up" : "hidden"}`}>
//             {num === 5 && (
//               <div className="address-step">
//                 <div className="step-label">
//                   <div className="step_number_main">

//                     <span className="step-number">5</span>
//                     <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//                   </div>
//                   Address:
//                 </div>
//                 <p>This is the address Ella Stein will use to initiate a pick-up and product replacement.</p>
//                 <div className="address-autocomplete-wrapper">
//   <label>Address</label>
//   <div className="address-input-container">
//     <input
//       type="text"
//       placeholder="Start typing address..."
//       value={addressLine1}
//       onChange={(e) => {
//         setAddressLine1(e.target.value);
//         setAddressSuggestions([]);
//         setCity("");
//         setState("");
//         setZip("");
//         setCountry("");
//       }}
//       onFocus={() => {
//         if (addressLine1.length > 3) {
//           fetchNominatimSuggestions(addressLine1).then(setAddressSuggestions);
//         }
//       }}
//       onBlur={() => {
//         setTimeout(() => setAddressSuggestions([]), 200);
//       }}
//       className="styled-input"
//     />

//     {addressSuggestions.length > 0 && (
//       <div className="suggestion-box">
//         <div className="suggestion-header">
//           <span>Suggestions</span>
//           <button
//             className="close-suggestions"
//             onClick={() => setAddressSuggestions([])}
//           >
//             ✖
//           </button>
//         </div>
//         <ul className="suggestions-list">
//           {addressSuggestions.map((item, idx) => {
//             const addr = item.address;
//             const fullAddressLine1 = [
//               addr.house_number,
//               addr.road,
//               addr.suburb,
//               addr.city || addr.town || addr.village,
//               addr.state
//             ]
//               .filter(Boolean)
//               .join(", ");

//             const fullAddressLine2 = [
//               addr.building,
//               addr.unit,
//               addr.neighbourhood,
//               addr.residential,
//               addr.locality,
//               addr.industrial,
//             ]
//               .filter(Boolean)
//               .join(", ");

//             const fallbackCity =
//               addr.city ||
//               addr.town ||
//               addr.village ||
//               addr.state_district ||
//               addr.county ||
//               addr.suburb ||
//               "";

//             return (
//               <li
//                 key={idx}
//                 className="suggestion-item"
//                 onClick={() => {
//                   setAddressLine1(fullAddressLine1);
//                   setAddressLine2(fullAddressLine2);
//                   setCity(fallbackCity);
//                   setState(addr.state || "");
//                   setZip(addr.postcode || "");
//                   setCountry(addr.country || "");
//                   setAddressSuggestions([]);

//                   setTimeout(() => address2Ref.current?.focus(), 150);
//                 }}
//               >
//                 {item.display_name}
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     )}
//   </div>
//   {fieldErrors.addressLine1 && <p className="error">{fieldErrors.addressLine1}</p>}
// </div>

// <label>Address line 2</label>
//                 <input ref={address2Ref} type="text" placeholder="Apartment 4" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)}     
//                  onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(cityRef);
//     }
//   }}
// />

//                 <label>City/Town</label>
//                 <input ref={cityRef} type="text" placeholder="Palo Alto" value={city} onChange={(e) => setCity(e.target.value)}    
//                  onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(stateRef);
//     }
//   }}
//                 />
//                   {fieldErrors.city && <p className="error">{fieldErrors.city}</p>}


//                 <label>State/Region/Province</label>
//                 <input ref={stateRef} type="text" placeholder="California" value={state} onChange={(e) => setState(e.target.value)}     
//                 onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(zipRef);
//     }
//   }}
//                 />

//                 <label>Zip/Post code</label>
//                 <input ref={zipRef} type="text" placeholder="94304" value={zip} onChange={(e) => setZip(e.target.value)} 
//                  onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(countryRef);
//     }
//   }}
//                 />
//                   {fieldErrors.zip && <p className="error">{fieldErrors.zip}</p>}


//                 <label>Country</label>
//                 <input ref={countryRef} type="text" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)}   onKeyDown={handleEnterKey} />

//                 {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
//                   {fieldErrors.country && <p className="error">{fieldErrors.country}</p>}

//                 <div className="ok-container">
//       <button onClick={nextStep} className="ok-button">OK</button>
//       <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//     </div>
//               </div>
//             )}
// {num === 6 && (
//  <>
//       <div className="address-step">
//         <div className="step-label">
//           <div className="step_number_main">
//             <span className="step-number">6</span>
//             <span>
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//                 <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//               </svg>
//             </span>
//           </div>
//           Select Product:
//         </div>

//         <div className="image-upload">
//           <div className="address-step">
//             <p>Please upload a product image or enter a SKU number.</p>
//           </div>
//           <label className="upload_image"> 
//             <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Upload Image/ Take picture
//           </label>
//           <input className="upload_image_span" type="file" accept="image/*" onChange={handleImageChange} />
//           {imagePreview && (
//             <img src={imagePreview} alt="Preview" style={{ width: "120px", marginTop: "10px" }} />
//           )}
//         </div>
//       </div>

//       <label className="upload_image">
//         <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Enter SKU or Product name
//       </label>
//       <input
//         type="text"
//         placeholder="Enter product SKU"
//         value={sku}
//         onChange={(e) => setSku(e.target.value)}
//         onKeyDown={handleEnterKey}
//         className="styled-input"
//       />
//       {fieldErrors.generalImageOrSku && (
//         <p className="error">{fieldErrors.generalImageOrSku}</p>
//       )}

//       <label className="upload_image search_prdouct_headding">
//         <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Search product
//       </label>
      
//       <div ref={searchInputRef} style={{ position: 'relative' }}>
//         <input
//           value={productSearch}
//           onChange={(e) => {
//             setProductSearch(e.target.value);
//             if (showProducts && e.target.value === "") {
//               setShowProducts(false);
//               setShowCategories(true);
//             }
//           }}
//           onFocus={handleSearchFocus}
//           placeholder="Search products..."
//           className="search_product_input"
//         />
        
//         {/* Categories Dropdown */}
//         {showCategories && (
//           <div className="categories-dropdown" style={{
//             position: 'absolute',
//             top: '100%',
//             left: 0,
//             right: 0,
//             backgroundColor: 'white',
//             border: '1px solid #ddd',
//             borderRadius: '4px',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//             zIndex: 1000,
//             maxHeight: '200px',
//             overflowY: 'auto'
//           }}>
//             {categories.map((category) => (
//               <div
//                 key={category.id}
//                 className="category-item"
//                 onClick={() => handleCategorySelect(category)}
//                 style={{
//                   padding: '12px 16px',
//                   cursor: 'pointer',
//                   borderBottom: '1px solid #f0f0f0',
//                   transition: 'background-color 0.2s'
//                 }}
//                 onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
//                 onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
//               >
//                 <span className="subheadding_product" style={{ fontSize: '16px', marginRight: '8px' }}>●</span>
//                 {category.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {selectedCategory && (
//         <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
//           <span style={{ fontSize: '14px', color: '#1976d2' }}>
//             Category: <strong>{categories.find(cat => cat.key === selectedCategory)?.name}</strong>
//           </span>
//           <button
//             onClick={() => {
//               setSelectedCategory("");
//               setProductSearch("");
//               setShowProducts(false);
//               setShowCategories(true);
//             }}
//             style={{
//               marginLeft: '10px',
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               color: '#1976d2'
//             }}
//           >
//             ✕ Clear
//           </button>
//         </div>
//       )}

//       <label className="upload_image category_headding">
//         <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Select Category 
//       </label>

//       {(showProducts || selectedCategory) && (
//         <ul className="product-list">
//           {loadingProducts ? (
//             <li>Loading...</li>
//           ) : fieldErrors.products ? (
//             <li>{fieldErrors.products}</li>
//           ) : filteredProducts.length === 0 ? (
//             <div>
//               <li>No products found in this category.</li>
//               <li style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
//                 Debug: Total products available: {products.length}
//                 {selectedCategory && `, Filtering by: ${selectedCategory}`}
//               </li>
//               <li style={{ fontSize: '12px', color: '#666' }}>
//                 Try a different category or check console for product data structure.
//               </li>
//             </div>
//           ) : (
//             filteredProducts.map((product) => (
//               <li
//                 key={product.id}
//                 className={`product-item ${selectedProduct === product.title ? "selected" : ""}`}
//                 onClick={() => setSelectedProduct(product.title)}
//               >
//                 {product.images?.[0]?.src && (
//                   <img src={product.images[0].src} alt={product.title} className="product-image" />
//                 )}
//                 <span>{product.title}</span>
//               </li>
//             ))
//           )}
//         </ul>
//       )}

//       {selectedProduct && (
//         <div className="selected-product-info" style={{ 
//           marginTop: '15px', 
//           padding: '8px', 
//           backgroundColor: '#f0f8ff', 
//           borderRadius: '4px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <span style={{ fontSize: '14px', color: '#333' }}>
//             Selected: <strong>{selectedProduct}</strong>
//           </span>
//           <button
//             onClick={() => setSelectedProduct("")}
//             style={{
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               padding: '5px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               borderRadius: '3px'
//             }}
//             title="Remove selection"
//             onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebee'}
//             onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//           >
//             <svg 
//               xmlns="http://www.w3.org/2000/svg" 
//               width="18" 
//               height="18" 
//               fill="red" 
//               viewBox="0 0 16 16"
//               style={{ transition: 'all 0.2s ease' }}
//             >
//               <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
//             </svg>
//           </button>
//         </div>
//       )}

//       <p className="error">{fieldErrors.selectedProduct}</p>
//       <p className="error">{fieldErrors.submit}</p>
//     </>
// )}


// {step === 7 && (
//   <div className="max-w-xl mx-auto  text-center submission_container">
//     <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 submisiion_headding">
//       Thank you for registering your Ella Stein jewelry under our Warranty Program.
//     </h1>
//     <p className="mt-4 text-lg sm:text-xl text-gray-600 submission_pera">
//       Learn more about caring for your jewelry using the link below.
//     </p>
//     <p className="mt-6">
//       <a
//         className=" submission_button inline-block px-6 py-3 bg-[#f2e1d1] text-lg sm:text-xl font-bold text-gray-800 rounded-md shadow-md hover:bg-[#e0cfbf] transition "
//         href="https://www.ellastein.com/pages/jewelry-care-tips"
//         target="_blank"
//         rel="noreferrer"
//       >
//         JEWELRY CARE TIPS
//       </a>
//       <span className="enter-text enter_tips_btn">  press <span className="enter-key">Enter ↵</span></span>
//     </p>
//   </div>
// )}
// </section>
//         ))}

//        <div className="btn-group flex justify-between mt-4 gap-4">
//  {step > 1 && step <= 6 &&  (
//     <button onClick={prevStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
//       Previous
//     </button>
//   )}
 
// {step === 6 && (
//   <button
//     onClick={handleSubmit}
//     className="submit_btn px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//    disabled={loading}
//   >
//     {loading ? "Submitting..." : "Submit"}
//   </button>
// )}

// </div>

//       </div>
//     </div>
//   );
// };

// export default Authe;



// import React, { useState, useEffect, useRef, useCallback, useMemo} from "react";
// import { Client, Account, Databases, ID, Storage } from "appwrite";
// import axios from 'axios';
// import "./Authentication.css";
// import PhoneNumberStep from './PhoneNumberStep';

// const Authe = () => {
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [authMessage, setAuthMessage] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userId, setUserId] = useState(false);
//   const [addressLine1, setAddressLine1] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [justVerified, setJustVerified] = useState(false);
//   const [addressLine2, setAddressLine2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [zip, setZip] = useState("");
//   const [country, setCountry] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFileId, setImageFileId] = useState(null);
//   const [sku, setSku] = useState("");
  
//   // New states for categories
//   const [showCategories, setShowCategories] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [showProducts, setShowProducts] = useState(false);
  
//   const address1Ref = useRef(null);
//   const address2Ref = useRef(null);
//   const cityRef = useRef(null);
//   const stateRef = useRef(null);
//   const zipRef = useRef(null);
//   const countryRef = useRef(null);
//   const emailInputRef = useRef(null);
//   const searchInputRef = useRef(null);
  
//   // Categories array
//   const categories = [
//     { id: 1, name: "Necklaces", key: "necklace" },
//     { id: 2, name: "Earrings", key: "earring" },
//     { id: 3, name: "Bracelets", key: "bracelet" },
//     { id: 4, name: "Rings", key: "ring" }
//   ];
  
//   const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
//   const APPWRITE_PROJECT_ID = "68271c3c000854f08575";
//   const APPWRITE_DATABASE_ID = "68271db80016565f6882";
//   const APPWRITE_COLLECTION_ID = "68271dcf002c6797363d";
//   const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
//   const account = useMemo(() => new Account(client), [client]);
//   const database = new Databases(client);
//   const storage = new Storage(client);
//   const APPWRITE_BUCKET_ID = "683e80fc0019228a6dfa";
//   const [addressSuggestions, setAddressSuggestions] = useState([]);
//   const categoryKey = selectedCategory?.toLowerCase();



//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("/.netlify/functions/products");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setProducts(data);
//           setFilteredProducts(data);
//         } else {
//           setProducts([]);
//           setFilteredProducts([]);
//           setFieldErrors({ products: "Invalid products data." });
//         }
//       } catch {
//         setProducts([]);
//         setFilteredProducts([]);
//         setFieldErrors({ products: "Failed to load products." });
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Improved filter products based on category and search
// useEffect(() => {
//   if (!Array.isArray(products)) return;

//   const normalize = (str) => (str || "").toLowerCase().trim(); // ✅ Move this up

//   let filtered = products;

//   if (selectedCategory) {
//     const categoryKey = selectedCategory.toLowerCase();
//     filtered = products.filter((product) => {
//       if (normalize(product.product_type) === categoryKey) return true;

//       const tags = Array.isArray(product.tags) ? product.tags.map(normalize) : [];

//       if (tags.includes(categoryKey)) return true;

//       if (normalize(product.handle) === categoryKey) return true;

//       const titleWords = normalize(product.title).split(" ");
//       if (titleWords.includes(categoryKey)) return true;

//       return false;
//     });

//     console.log('Filtered products count:', filtered.length);
//     if (filtered.length > 0) {
//       console.log('Sample filtered products:', filtered.slice(0, 3).map(p => ({
//         title: p.title,
//         type: p.product_type,
//         tags: p.tags,
//         handle: p.handle
//       })));
//     }
//   }

//   if (productSearch.trim() !== "" && showProducts && !showCategories) {
//     const searchTerm = normalize(productSearch);
//     filtered = filtered.filter((p) =>
//       normalize(p.title).includes(searchTerm) ||
//       normalize(p.product_type).includes(searchTerm) ||
//       (p.tags && p.tags.some(tag => normalize(tag).includes(searchTerm)))
//     );
//   }

//   setFilteredProducts(filtered);
// }, [productSearch, products, selectedCategory, showProducts, showCategories]);




//   // Handle search input focus
//   const handleSearchFocus = () => {
//     setShowCategories(true);
//     setShowProducts(false);
//     setProductSearch("");
//     setSelectedCategory("");
//   };

//   // Handle category selection
//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category.key);
//     setProductSearch(category.name);
//     setShowCategories(false);
    
//     // Set showProducts after a small delay to ensure state updates properly
//     setTimeout(() => {
//       setShowProducts(true);
//     }, 100);
    
//     // Debug: Log the selected category and available products
//     console.log('Selected category:', category.key);
//         console.log('Selected category:', category.id);
//     console.log('Available products:', products.length);
//     console.log('First few products sample:', products.slice(0, 5).map(p => ({
//       title: p.title,
//       product_type: p.product_type,
//       handle: p.handle,
//       tags: p.tags,
//       vendor: p.vendor
//     })));
//   };

//   // Handle clicking outside to close dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
//         setShowCategories(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="auth-wrapper">
//       <div className="logo-text">ELLA STEIN</div>
//       <div className="right-side">
   
// {[5, 6, 7].map((num) => (
//           <section key={num} className={`step-section ${step === num ? "active slide-up" : "hidden"}`}>
//             {num === 5 && (
//               <div className="address-step">
//                 <div className="step-label">
//                   <div className="step_number_main">

//                     <span className="step-number">5</span>
//                     <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" /></svg></span>
//                   </div>
//                   Address:
//                 </div>
//                 <p>This is the address Ella Stein will use to initiate a pick-up and product replacement.</p>
//                 <div className="address-autocomplete-wrapper">
//   <label>Address</label>
//   <div className="address-input-container">
//     <input
//       type="text"
//       placeholder="Start typing address..."
//       value={addressLine1}
//       onChange={(e) => {
//         setAddressLine1(e.target.value);
//         setAddressSuggestions([]);
//         setCity("");
//         setState("");
//         setZip("");
//         setCountry("");
//       }}
//       onFocus={() => {
//         if (addressLine1.length > 3) {
//           fetchNominatimSuggestions(addressLine1).then(setAddressSuggestions);
//         }
//       }}
//       onBlur={() => {
//         setTimeout(() => setAddressSuggestions([]), 200);
//       }}
//       className="styled-input"
//     />

//     {addressSuggestions.length > 0 && (
//       <div className="suggestion-box">
//         <div className="suggestion-header">
//           <span>Suggestions</span>
//           <button
//             className="close-suggestions"
//             onClick={() => setAddressSuggestions([])}
//           >
//             ✖
//           </button>
//         </div>
//         <ul className="suggestions-list">
//           {addressSuggestions.map((item, idx) => {
//             const addr = item.address;
//             const fullAddressLine1 = [
//               addr.house_number,
//               addr.road,
//               addr.suburb,
//               addr.city || addr.town || addr.village,
//               addr.state
//             ]
//               .filter(Boolean)
//               .join(", ");

//             const fullAddressLine2 = [
//               addr.building,
//               addr.unit,
//               addr.neighbourhood,
//               addr.residential,
//               addr.locality,
//               addr.industrial,
//             ]
//               .filter(Boolean)
//               .join(", ");

//             const fallbackCity =
//               addr.city ||
//               addr.town ||
//               addr.village ||
//               addr.state_district ||
//               addr.county ||
//               addr.suburb ||
//               "";

//             return (
//               <li
//                 key={idx}
//                 className="suggestion-item"
//                 onClick={() => {
//                   setAddressLine1(fullAddressLine1);
//                   setAddressLine2(fullAddressLine2);
//                   setCity(fallbackCity);
//                   setState(addr.state || "");
//                   setZip(addr.postcode || "");
//                   setCountry(addr.country || "");
//                   setAddressSuggestions([]);

//                   setTimeout(() => address2Ref.current?.focus(), 150);
//                 }}
//               >
//                 {item.display_name}
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     )}
//   </div>
//   {fieldErrors.addressLine1 && <p className="error">{fieldErrors.addressLine1}</p>}
// </div>

// <label>Address line 2</label>
//                 <input ref={address2Ref} type="text" placeholder="Apartment 4" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)}     
//                  onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(cityRef);
//     }
//   }}
// />

//                 <label>City/Town</label>
//                 <input ref={cityRef} type="text" placeholder="Palo Alto" value={city} onChange={(e) => setCity(e.target.value)}    
//                  onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(stateRef);
//     }
//   }}
//                 />
//                   {fieldErrors.city && <p className="error">{fieldErrors.city}</p>}


//                 <label>State/Region/Province</label>
//                 <input ref={stateRef} type="text" placeholder="California" value={state} onChange={(e) => setState(e.target.value)}     
//                 onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(zipRef);
//     }
//   }}
//                 />

//                 <label>Zip/Post code</label>
//                 <input ref={zipRef} type="text" placeholder="94304" value={zip} onChange={(e) => setZip(e.target.value)} 
//                  onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       focusNextField(countryRef);
//     }
//   }}
//                 />
//                   {fieldErrors.zip && <p className="error">{fieldErrors.zip}</p>}


//                 <label>Country</label>
//                 <input ref={countryRef} type="text" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)}   onKeyDown={handleEnterKey} />

//                 {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
//                   {fieldErrors.country && <p className="error">{fieldErrors.country}</p>}

//                 <div className="ok-container">
//       <button onClick={nextStep} className="ok-button">OK</button>
//       <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
//     </div>
//               </div>
//             )}

// {num === 6 && (
//  <>
//       <div className="address-step">
//         <div className="step-label">
//           <div className="step_number_main">
//             <span className="step-number">6</span>
//             <span>
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
//                 <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
//               </svg>
//             </span>
//           </div>
//           Select Product:
//         </div>

//         <div className="image-upload">
//           <div className="address-step">
//             <p>Please upload a product image or enter a SKU number.</p>
//           </div>
//           <label className="upload_image"> 
//             <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Upload Image/ Take picture
//           </label>
//           <input className="upload_image_span" type="file" accept="image/*" onChange={handleImageChange} />
//           {imagePreview && (
//             <img src={imagePreview} alt="Preview" style={{ width: "120px", marginTop: "10px" }} />
//           )}
//         </div>
//       </div>

//       <label className="upload_image">
//         <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Enter SKU or Product name
//       </label>
//       <input
//         type="text"
//         placeholder="Enter product SKU"
//         value={sku}
//         onChange={(e) => setSku(e.target.value)}
//         onKeyDown={handleEnterKey}
//         className="styled-input"
//       />
//       {fieldErrors.generalImageOrSku && (
//         <p className="error">{fieldErrors.generalImageOrSku}</p>
//       )}

//       <label className="upload_image search_prdouct_headding">
//         <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Search product
//       </label>
      
//       <div ref={searchInputRef} style={{ position: 'relative' }}>
//         <input
//           value={productSearch}
//           onChange={(e) => {
//             setProductSearch(e.target.value);
//             if (showProducts && e.target.value === "") {
//               setShowProducts(false);
//               setShowCategories(true);
//             }
//           }}
//           onFocus={handleSearchFocus}
//           placeholder="Search products..."
//           className="search_product_input"
//         />
        
//         {/* Categories Dropdown */}
//         {showCategories && (
//           <div className="categories-dropdown" style={{
//             position: 'absolute',
//             top: '100%',
//             left: 0,
//             right: 0,
//             backgroundColor: 'white',
//             border: '1px solid #ddd',
//             borderRadius: '4px',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//             zIndex: 1000,
//             maxHeight: '200px',
//             overflowY: 'auto'
//           }}>
//             {categories.map((category) => (
//               <div
//                 key={category.id}
//                 className="category-item"
//                 onClick={() => handleCategorySelect(category)}
//                 style={{
//                   padding: '12px 16px',
//                   cursor: 'pointer',
//                   borderBottom: '1px solid #f0f0f0',
//                   transition: 'background-color 0.2s'
//                 }}
//                 onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
//                 onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
//               >
//                 <span className="subheadding_product" style={{ fontSize: '16px', marginRight: '8px' }}>●</span>
//                 {category.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {selectedCategory && (
//         <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
//           <span style={{ fontSize: '14px', color: '#1976d2' }}>
//             Category: <strong>{categories.find(cat => cat.key === selectedCategory)?.name}</strong>
//           </span>
//           <button
//             onClick={() => {
//               setSelectedCategory("");
//               setProductSearch("");
//               setShowProducts(false);
//               setShowCategories(true);
//             }}
//             style={{
//               marginLeft: '10px',
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               color: '#1976d2'
//             }}
//           >
//             ✕ Clear
//           </button>
//         </div>
//       )}

//       <label className="upload_image category_headding">
//         <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Select Category 
//       </label>

//       {(showProducts && selectedCategory) && (
//         <ul className="product-list">
//           {loadingProducts ? (
//             <li>Loading...</li>
//           ) : fieldErrors.products ? (
//             <li>{fieldErrors.products}</li>
//           ) : filteredProducts.length === 0 ? (
//             <div>
//               <li>No products found in this category.</li>
//               <li style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
//                 Debug: Total products available: {products.length}
//                 {selectedCategory && `, Filtering by: ${selectedCategory}`}
//               </li>
//               <li style={{ fontSize: '12px', color: '#666' }}>
//                 Filtered products count: {filteredProducts.length}
//               </li>
//               <li style={{ fontSize: '12px', color: '#666' }}>
//                 showProducts: {showProducts.toString()}, selectedCategory: {selectedCategory}
//               </li>
//             </div>
//           ) : (
//             filteredProducts.map((product) => (
//               <li
//                 key={product.id}
//                 className={`product-item ${selectedProduct === product.title ? "selected" : ""}`}
//                 onClick={() => setSelectedProduct(product.title)}
//               >
//                 {product.images?.[0]?.src && (
//                   <img src={product.images[0].src} alt={product.title} className="product-image" />
//                 )}
//                 <span>{product.title}</span>
//               </li>
//             ))
//           )}
//         </ul>
//       )}

//       {selectedProduct && (
//         <div className="selected-product-info" style={{ 
//           marginTop: '15px', 
//           padding: '8px', 
//           backgroundColor: '#f0f8ff', 
//           borderRadius: '4px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <span style={{ fontSize: '14px', color: '#333' }}>
//             Selected: <strong>{selectedProduct}</strong>
//           </span>
//           <button
//             onClick={() => setSelectedProduct("")}
//             style={{
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               padding: '5px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               borderRadius: '3px'
//             }}
//             title="Remove selection"
//             onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebee'}
//             onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//           >
//             <svg 
//               xmlns="http://www.w3.org/2000/svg" 
//               width="18" 
//               height="18" 
//               fill="red" 
//               viewBox="0 0 16 16"
//               style={{ transition: 'all 0.2s ease' }}
//             >
//               <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
//             </svg>
//           </button>
//         </div>
//       )}

//       <p className="error">{fieldErrors.selectedProduct}</p>
//       <p className="error">{fieldErrors.submit}</p>
//     </>
// )}

// {step === 7 && (
//   <div className="max-w-xl mx-auto  text-center submission_container">
//     <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 submisiion_headding">
//       Thank you for registering your Ella Stein jewelry under our Warranty Program.
//     </h1>
//     <p className="mt-4 text-lg sm:text-xl text-gray-600 submission_pera">
//       Learn more about caring for your jewelry using the link below.
//     </p>
//     <p className="mt-6">
//       <a
//         className=" submission_button inline-block px-6 py-3 bg-[#f2e1d1] text-lg sm:text-xl font-bold text-gray-800 rounded-md shadow-md hover:bg-[#e0cfbf] transition "
//         href="https://www.ellastein.com/pages/jewelry-care-tips"
//         target="_blank"
//         rel="noreferrer"
//       >
//         JEWELRY CARE TIPS
//       </a>
//       <span className="enter-text enter_tips_btn">  press <span className="enter-key">Enter ↵</span></span>
//     </p>
//   </div>
// )}
// </section>
//         ))}

//        <div className="btn-group flex justify-between mt-4 gap-4">
//  {step > 1 && step <= 6 &&  (
//     <button onClick={prevStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
//       Previous
//     </button>
//   )}
 
// {step === 6 && (
//   <button
//     onClick={handleSubmit}
//     className="submit_btn px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//    disabled={loading}
//   >
//     {loading ? "Submitting..." : "Submit"}
//   </button>
// )}

// </div>

//       </div>
//     </div>
//   );
// };

// export default Authe;






  import React, { useState, useEffect, useRef, useCallback, useMemo} from "react";
  import { Client, Account, Databases, ID, Storage } from "appwrite";
  import axios from 'axios';
  import "./Authentication.css";
  import PhoneNumberStep from './PhoneNumberStep';

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
    const [userId, setUserId] = useState(false);
    const [addressLine1, setAddressLine1] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [justVerified, setJustVerified] = useState(false);
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [country, setCountry] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFileId, setImageFileId] = useState(null);
    const [sku, setSku] = useState("");
    const [selectedSkuProducts, setSelectedSkuProducts] = useState([]);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState([]);


    
    // New states for categories
    const [showCategories, setShowCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showProducts, setShowProducts] = useState(false);
    
    // New states for SKU search
    const [skuFilteredProducts, setSkuFilteredProducts] = useState([]);
    const [showSkuProducts, setShowSkuProducts] = useState(false);


    
    const address2Ref = useRef(null);
    const cityRef = useRef(null);
    const stateRef = useRef(null);
    const zipRef = useRef(null);
    const countryRef = useRef(null);
    const emailInputRef = useRef(null);
    const searchInputRef = useRef(null);
    const skuInputRef = useRef(null);
    
    // Categories array
    const categories = [
      { id: 1, name: "Necklaces", key: "necklace" },
      { id: 2, name: "Earrings", key: "earring" },
      { id: 3, name: "Bracelets", key: "bracelet" },
      { id: 4, name: "Rings", key: "ring" }
    ];
    
    const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
    const APPWRITE_PROJECT_ID = "68271c3c000854f08575";
    const APPWRITE_DATABASE_ID = "68271db80016565f6882";
    const APPWRITE_COLLECTION_ID = "68271dcf002c6797363d";
    const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
    const account = useMemo(() => new Account(client), [client]);
    const database = new Databases(client);
    const storage = new Storage(client);
    const APPWRITE_BUCKET_ID = "683e80fc0019228a6dfa";
    const [addressSuggestions, setAddressSuggestions] = useState([]);


  const fetchNominatimSuggestions = async (query) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
          limit: 5,
          countrycodes: "us", // restrict to United States
        },
      });

      // Extra check in case Nominatim returns unexpected data
      return res.data.filter(
        (item) =>
          item?.address?.country_code?.toLowerCase() === "us" ||
          item?.address?.country?.toLowerCase() === "united states"
      );
    } catch (err) {
      console.error("Error fetching OSM suggestions:", err);
      return [];
    }
  };


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (addressLine1.length > 3) {
        fetchNominatimSuggestions(addressLine1).then(setAddressSuggestions);
      } else {
        setAddressSuggestions([]);
      }
    }, 300); // debounce

    return () => clearTimeout(delayDebounceFn);
  }, [addressLine1]);



  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      console.log("Tab is active again");
    }
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    try {
      const response = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);
      console.log("Appwrite upload response:", response);

      if (response && response.$id) {
        setImageFileId(response.$id); 
        console.log("Image uploaded successfully. File ID:", response.$id);
      } else {
        throw new Error("Failed to upload image. No file ID returned.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed. Check console for more details.");
    }
  };

  const handleCategoryProductSelect = (product) => {
    setSelectedCategoryProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
    });
  };




    // Debug function to understand product structure
    const debugProducts = useCallback(() => {
      if (products.length > 0) {
        console.log('=== PRODUCT DEBUG INFO ===');
        console.log('Total products:', products.length);
        console.log('First product structure:', products[0]);
        console.log('All keys in first product:', Object.keys(products[0]));
        
        // Check for necklace products specifically
        const necklaceProducts = products.filter(p => 
          p.title && p.title.toLowerCase().includes('necklace')
        );
        console.log('Products with "necklace" in title:', necklaceProducts.length);
        
        if (necklaceProducts.length > 0) {
          console.log('Sample necklace products:', necklaceProducts.slice(0, 3).map(p => ({
            title: p.title,
            id: p.id
          })));
        }
      }
    }, [products]);


    // Fetch products
  useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await fetch("/.netlify/functions/products");
          const data = await res.json();
          if (Array.isArray(data)) {
            setProducts(
  data.map((p) => ({
    ...p,
    tags: Array.isArray(p.tags) ? p.tags : [],
  }))
);
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
        } finally {
          setLoadingProducts(false);
        }
      };
      fetchProducts();
    }, []);

    // After: useEffect(() => { fetchProducts() ... }, []);
  // Add this debug logger

  useEffect(() => {
      if (!products || products.length === 0) return;

      console.log("🔍 Product Title Samples:");
      const sample = products.slice(0, 30).map((p, i) => ({
        i,
        title: p.title,
        type: p.type,
        product_type: p.product_type,
        tags: p.tags,
        vendor: p.vendor,
        handle: p.handle
      }));
      console.table(sample);
    }, [products]);



    // Debug products after they're loaded
  useEffect(() => {
      if (products.length > 0 && !loadingProducts) {
        debugProducts();
      }
    }, [products, loadingProducts, debugProducts]);


    // Keyword list for better matching
  const categoryKeywords = useMemo(() => ({
  necklace: ['necklace', 'pendant', 'choker'],
  earring: ['earring', 'hoop', 'stud'],
  bracelet: ['bracelet', 'bangle'],
  ring: ['ring'],
}), []);





  // SKU search functionality
    useEffect(() => {
      if (!Array.isArray(products) || products.length === 0) return;

      if (sku.trim() !== "") {
        const searchTerm = sku.toLowerCase().trim();
        console.log('SKU Search Term:', searchTerm);
        console.log('Total products to search:', products.length);
        
        const filtered = products.filter((p) => {
          const normalize = (str) => (str || "").toLowerCase().trim();
          const titleMatch = normalize(p.title).includes(searchTerm);
          const handleMatch = normalize(p.handle).includes(searchTerm);
          const idMatch = normalize(p.id?.toString()).includes(searchTerm);
          const skuMatch = normalize(p.sku).includes(searchTerm);
          const productTypeMatch = normalize(p.product_type).includes(searchTerm);
          
          // Check variants if they exist
          const variantMatch = Array.isArray(p.variants) && p.variants.some(variant => 
            normalize(variant.sku).includes(searchTerm) ||
            normalize(variant.title).includes(searchTerm)
          );
          
          // Check tags if they exist
          const tagMatch = Array.isArray(p.tags) && p.tags.some(tag => 
            normalize(tag).includes(searchTerm)
          );

          return titleMatch || handleMatch || idMatch || skuMatch || productTypeMatch || variantMatch || tagMatch;
        });
        
        console.log('Filtered products count:', filtered.length);
        if (filtered.length > 0) {
          console.log('Sample filtered products:', filtered.slice(0, 3).map(p => p.title));
        }
        
        setSkuFilteredProducts(filtered);
        setShowSkuProducts(true);
      } else {
        setSkuFilteredProducts([]);
        setShowSkuProducts(false);
      }
    }, [sku, products]);




    useEffect(() => {
      if (!Array.isArray(products)) return;

      let filtered = products;

      const normalize = (str) => (str || "").toLowerCase().trim();

      if (selectedCategory) {
        const categoryKey = selectedCategory.toLowerCase();
        const keywords = categoryKeywords[categoryKey] || [];

        filtered = products.filter((product) => {
          const normalize = (str) => (str || "").toLowerCase().trim();
          const normalizedType = normalize(product.product_type);
          const normalizedHandle = normalize(product.handle);
          const normalizedTitleWords = normalize(product.title).split(/\s+/);
          const normalizedTags = Array.isArray(product.tags)
            ? product.tags.map(normalize)
            : [];

          // Match exact words only (not substrings)
          return (
            keywords.includes(normalizedType) ||
            keywords.includes(normalizedHandle) ||
            normalizedTitleWords.some(word => keywords.includes(word)) ||
            normalizedTags.some(tag => keywords.includes(tag))
          );
        });

        console.log('Filtered products count:', filtered.length);
        if (filtered.length > 0) {
          console.log('Sample filtered products:', filtered.slice(0, 3));
        }
      }

      // Search functionality (keep existing logic)
      if (productSearch.trim() !== "" && showProducts && !showCategories) {
        const searchTerm = normalize(productSearch);
        filtered = filtered.filter((p) =>
          normalize(p.title).includes(searchTerm) ||
          normalize(p.product_type).includes(searchTerm) ||
          (Array.isArray(p.tags) && p.tags.some(tag => normalize(tag).includes(searchTerm)))
        );
      }

      setFilteredProducts(filtered);
    }, [productSearch, products, selectedCategory, showProducts, showCategories,categoryKeywords]);

    // Handle SKU input change
    const handleSkuChange = (e) => {
      setSku(e.target.value);
    };

    // Handle SKU product selection


const handleSkuProductSelect = (product) => {
  setSelectedSkuProducts((prev) => {
    const isAlreadySelected = prev.some((p) => p.id === product.id);
    return isAlreadySelected
      ? prev.filter((p) => p.id !== product.id)
      : [...prev, product];
  });

  setSelectedProduct(product.title); // ✅ This fixes the missing product name
  setSku(""); // clear input
  setShowSkuProducts(false);
};



    
  // Handle search input focus
  // const handleSearchFocus = () => {
  //     setShowCategories(true);
  //     setShowProducts(false);
  //     setProductSearch("");
  //     setSelectedCategory("");
  //   };
    // Handle category selection
  // Handle category selection
  // const handleCategorySelect = (category) => {
  //     console.log('Selecting category:', category);

  //     setSelectedCategory(category.key);
  //     setProductSearch(""); // ← fix here
  //     setShowCategories(false);
  //     setSelectedProduct("");

  //     setTimeout(() => {
  //       setShowProducts(true);
  //       console.log('showProducts set to true, selectedCategory:', category.key);
  //     }, 100);
  //   };


    // Handle clicking outside to close dropdowns
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
          setShowCategories(false);
        }
        if (skuInputRef.current && !skuInputRef.current.contains(event.target)) {
          setShowSkuProducts(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

  // const handleProductSelect = (product) => {
  //   setSelectedProducts((prev) => {
  //     const isAlreadySelected = prev.some((p) => p.id === product.id);
  //     if (isAlreadySelected) {
  //       // Deselect
  //       return prev.filter((p) => p.id !== product.id);
  //     } else {
  //       // Select
  //       return [...prev, product];
  //     }
  //   });
  // };



    const autoRefreshInterval = useRef(null);
    const startAutoRefresh = useCallback(() => {
    if (autoRefreshInterval.current) {
      clearInterval(autoRefreshInterval.current);
    }

    autoRefreshInterval.current = setInterval(async () => {
      try {
        const session = await account.get();
        if (!session) {
          console.log("Session expired, logging out...");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Session refresh failed:", err);
        setIsAuthenticated(false);
      }
    }, 15 * 60 * 1000);
  }, [account]);

  useEffect(() => {
    if (isAuthenticated) {
      startAutoRefresh();
    }
    return () => {
      clearInterval(autoRefreshInterval.current);
    };
  }, [isAuthenticated, startAutoRefresh]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    const clearSessionOnLoad = async () => {
    };

    clearSessionOnLoad();
  }, [account]); 

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
        try {
          await account.deleteSession("current");
          setIsAuthenticated(false);
        } catch (err) {
          console.log("No existing session to clear");
        }

        const response = await account.createEmailToken(ID.unique(), email);
        setUserId(response.userId);
        console.log("OTP sent successfully:", response);
        setOtp(""); 
        setAuthMessage("📧 OTP sent to your email.");
        setStep(3); 
      } catch (err) {
        console.error("Error sending OTP:", err);
        setFieldErrors({ email: err.message || "Failed to send OTP." });
      } finally {
        setLoading(false);
      }
    };

  const verifyOtp = async () => {
    setLoading(true);
    setFieldErrors({});  
    setAuthMessage("");  

    const secret = otp.trim();  
    if (!userId) {
      setFieldErrors({ otp: "Session expired. Please request a new OTP." });
      setLoading(false);
      return;
    }
    if (!secret) {
      setFieldErrors({ otp: "Please enter the OTP." });
      setLoading(false);
      return;
    }
    if (secret.length !== 6) {
      setFieldErrors({ otp  : "OTP must be 6 digits." });
      setLoading(false);
      return;
    }

    try {
      const session = await account.createSession(userId, secret);
      console.log("OTP verified successfully, session created:", session);
          setIsAuthenticated(true);
      setAuthMessage("✅ OTP verified successfully!");
      setJustVerified(true);
      setOtp("");
          nextStep();
      
    } catch (err) {
      console.error("OTP verification failed:", err);
          if (err.message.includes("Invalid credentials") || 
          err.message.includes("token") || 
          err.code === 401) {
        setFieldErrors({ otp: "Invalid OTP. Please check and try again." });
      } else if (err.message.includes("expired")) {
        setFieldErrors({ otp: "OTP has expired. Please request a new one." });
        setUserId(false);
      } else {
        setFieldErrors({ otp: "Verification failed. Please try again." });
      }
          setIsAuthenticated(false);
      setJustVerified(false);
    } finally {
      setLoading(false);
    }
  };
    const handleOtpChange = (e) => {
      const value = e.target.value.replace(/\D/g, ''); 
      if (value.length <= 6) { 
        setOtp(value);
        setFieldErrors({ ...fieldErrors, otp: "" });
        setAuthMessage("");
      }
    };
    const validateStep = (currentStep) => {
      const errors = {};
      if (currentStep === 1 && !fullName.trim()) errors.fullName = "Enter your full name.";
      if (currentStep === 2 && !email.trim()) errors.email = "Enter your email.";
      if (currentStep === 3 && !otp.trim()) errors.otp = "Enter the OTP.";
      if (currentStep === 4 && !phone.trim()) errors.phone = "Enter your phone number.";
      if (currentStep === 5) {
        if (!addressLine1.trim()) errors.addressLine1 = "Please enter your address.";
      if (!city.trim()) errors.city = "Please enter your city.";
      if (!country.trim()) errors.country = "Please enter your country.";
      }
    if (currentStep === 6) {
    const hasImage = !!imageFileId;
    const hasSku = !!sku.trim();
    const hasCategoryProduct = selectedCategoryProducts.length > 0;

    if (!hasSku && !hasCategoryProduct && !hasImage) {
      errors.generalImageOrSku = "Please upload an image, enter a SKU, or select a product from category.";
    }
  }


  setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1 > 7 ? 7 : step + 1); 
      setFieldErrors({});
    }
  };

  const handleEnterKey = async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    switch (step) {
      case 1:
        if (validateStep(1)) nextStep();
        break;
      case 2:
        if (validateStep(2)) await sendOtp();
        break;
      case 3:
        if (justVerified) nextStep();
        else if (validateStep(3)) await verifyOtp();
        break;
      case 4:
        if (validateStep(4)) nextStep();
        break;
    case 5:
    console.log("Enter pressed on step 5");
    if (validateStep(5)) {
      console.log("Validation passed for step 5");
      nextStep();
    } else {
      console.log("Validation failed for step 5");
    }
    break;
      case 6:
        if (validateStep(6)) await handleSubmit();
        break;
      default:
        break;
    }
  };

  const focusNextField = (ref) => {
    console.log("Attempting to focus:", ref); 
    if (ref?.current) {
      ref.current.focus();
    }
  };

  const prevStep = () => {
    setFieldErrors({});

    setStep((prev) => {
      const newStep = Math.max(prev - 1, 1);
      switch (newStep) {
        case 1:
          setFullName("");
          break;
        case 2:
          setEmail("");
          setUserId(false);
          setIsAuthenticated(false);
          setJustVerified(false);
          setAuthMessage("");
          break;
        case 3: 
          setOtp("");
          setIsAuthenticated(false);
          setJustVerified(false);
          setAuthMessage("");
          break;
        case 4: 
          setPhone("");
          break;
        case 5: 
          setAddressLine1("");
          setAddressLine2("");
          setCity("");
          setState("");
          setZip("");
          setCountry("");
          break;
        case 6: 
          setSelectedProduct("");
          setSku("");
          setImageFileId(null);
          setImagePreview(null);
          break;
        default:
          break;
      }
      return newStep;
    });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const handleSubmit = async () => {
  setLoading(true);
  setFieldErrors({});

  const hasImage = !!imageFileId;
  const hasSku = !!sku.trim();
  const hasCategoryProduct = selectedCategoryProducts.length > 0;
  const hasSkuProduct = selectedSkuProducts.length > 0;

  if (!hasImage && !hasSku && !hasCategoryProduct && !hasSkuProduct) {
    setFieldErrors({
      generalImageOrSku: "Please upload an image, enter a SKU, or select a product from category.",
    });
    setLoading(false);
    return;
  }

  try {
    const session = await account.get();
    const address = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zip}, ${country}`;

  // Get product titles only from category

// Get SKUs only from SKU selections
// Get SKUs only from SKU selections
let selectedProductSkus = [
  ...selectedSkuProducts.map(p => p?.variants?.[0]?.sku || p.sku || ""),
  ...selectedCategoryProducts.map(p => p.sku || p?.variants?.find(v => v.sku)?.sku || "")
].filter(Boolean);





// Optionally include SKUs from category products too
const categorySkus = selectedCategoryProducts.map(p => {
  if (p.sku) return p.sku;
  if (Array.isArray(p.variants)) {
    const variantWithSku = p.variants.find(v => v.sku);
    if (variantWithSku) return variantWithSku.sku;
  }
  return "";
}).filter(Boolean);

// Combine both if you want:
selectedProductSkus = [...selectedProductSkus, ...categorySkus];

// Add manual entry only if nothing selected
// Get product titles from both category and SKU selections
let selectedProductTitles = [
  ...selectedCategoryProducts.map(p => p.title),
  ...selectedSkuProducts.map(p => p.title)
];

// Fallback if nothing selected but manual entry is given
if (selectedProductTitles.length === 0 && selectedProduct.trim()) {
  selectedProductTitles.push(selectedProduct.trim());
}





const document = {
  full_name: fullName,
  email,
  phone,
  address,
  user_id: session.$id,
  selected_product: selectedProductTitles.join(", "),
  product_sku: selectedProductSkus.join(", "),
  image_file_id: imageFileId || null
};


    await database.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      ID.unique(),
      document
    );

    await fetch("/.netlify/functions/sendToShopify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(document),
    });

    setStep(7);
  } catch (err) {
    console.error("Submission failed:", err);
    const message = err?.message || "Unknown error";
    setFieldErrors({ submit: `Submission failed: ${message}` });
  } finally {
    setLoading(false);
  }
};



  return (
      <div className="auth-wrapper">
        <div className="logo-text">ELLA STEIN</div>
        <div className="right-side">
          {step === 1 && (
            <section className="step-section active slide-up">
              <div className="step-label">
                <div className="step_number_main flex items-center absolute right-full mr-[140%] mt-5">
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
                onKeyDown={handleEnterKey}
                className="styled-input placeholder-gray-700 text-base"
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

      <p className="step-description mb-8">Please enter an email address whose inbox you access regularly.</p>

      <input
        ref={emailInputRef} 
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleEnterKey}
        className="styled-input"
      />
      {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}
      {!isAuthenticated ? (
        <>
          <div className="ok-container mb-3">
            <button onClick={sendOtp} className="ok-button" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
          </div>

          {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
          {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}
          {justVerified && <p className="success-message">You're now verified!</p>}       
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
                setUserId(false);
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
      <p className="step-description mb-4">Please enter the 6-digit OTP sent to your email address.</p>

      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={handleOtpChange}
        maxLength={6}
        onKeyDown={handleEnterKey}
        className="styled-input"
        style={{ fontSize: '16px', letterSpacing: '2px', textAlign: 'left' }}
      />
      {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
      {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}

      <div className="email_btn flex gap-4 mt-3">
        <button
          onClick={verifyOtp}
          disabled={loading || otp.length !== 6}
          className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
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
                  <div className="address-autocomplete-wrapper">
    <label>Address</label>
    <div className="address-input-container">
      <input
        type="text"
        placeholder="Start typing address..."
        value={addressLine1}
        onChange={(e) => {
          setAddressLine1(e.target.value);
          setAddressSuggestions([]);
          setCity("");
          setState("");
          setZip("");
          setCountry("");
        }}
        onFocus={() => {
          if (addressLine1.length > 3) {
            fetchNominatimSuggestions(addressLine1).then(setAddressSuggestions);
          }
        }}
        onBlur={() => {
          setTimeout(() => setAddressSuggestions([]), 200);
        }}
        className="styled-input"
      />

      {addressSuggestions.length > 0 && (
        <div className="suggestion-box">
          <div className="suggestion-header">
            <span>Suggestions</span>
            <button
              className="close-suggestions"
              onClick={() => setAddressSuggestions([])}
            >
              ✖
            </button>
          </div>
          <ul className="suggestions-list">
            {addressSuggestions.map((item, idx) => {
              const addr = item.address;
              const fullAddressLine1 = [
                addr.house_number,
                addr.road,
                addr.suburb,
                addr.city || addr.town || addr.village,
                addr.state
              ]
                .filter(Boolean)
                .join(", ");

              const fullAddressLine2 = [
                addr.building,
                addr.unit,
                addr.neighbourhood,
                addr.residential,
                addr.locality,
                addr.industrial,
              ]
                .filter(Boolean)
                .join(", ");

              const fallbackCity =
                addr.city ||
                addr.town ||
                addr.village ||
                addr.state_district ||
                addr.county ||
                addr.suburb ||
                "";

              return (
                <li
                  key={idx}
                  className="suggestion-item"
                  onClick={() => {
                    setAddressLine1(fullAddressLine1);
                    setAddressLine2(fullAddressLine2);
                    setCity(fallbackCity);
                    setState(addr.state || "");
                    setZip(addr.postcode || "");
                    setCountry(addr.country || "");
                    setAddressSuggestions([]);

                    setTimeout(() => address2Ref.current?.focus(), 150);
                  }}
                >
                  {item.display_name}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
    {fieldErrors.addressLine1 && <p className="error">{fieldErrors.addressLine1}</p>}
  </div>

  <label>Address line 2</label>
                  <input ref={address2Ref} type="text" placeholder="Apartment 4" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)}     
                  onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        focusNextField(cityRef);
      }
    }}
  />

                  <label>City/Town</label>
                  <input ref={cityRef} type="text" placeholder="Palo Alto" value={city} onChange={(e) => setCity(e.target.value)}    
                  onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        focusNextField(stateRef);
      }
    }}
                  />
                    {fieldErrors.city && <p className="error">{fieldErrors.city}</p>}


                  <label>State/Region/Province</label>
                  <input ref={stateRef} type="text" placeholder="California" value={state} onChange={(e) => setState(e.target.value)}     
                  onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        focusNextField(zipRef);
      }
    }}
                  />

                  <label>Zip/Post code</label>
                  <input ref={zipRef} type="text" placeholder="94304" value={zip} onChange={(e) => setZip(e.target.value)} 
                  onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        focusNextField(countryRef);
      }
    }}
                  />
                    {fieldErrors.zip && <p className="error">{fieldErrors.zip}</p>}


                  <label>Country</label>
                  <input ref={countryRef} type="text" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)}   onKeyDown={handleEnterKey} />

                  {fieldErrors.address && <p className="error">{fieldErrors.address}</p>}
                    {fieldErrors.country && <p className="error">{fieldErrors.country}</p>}

                  <div className="ok-container">
        <button onClick={nextStep} className="ok-button">OK</button>
        <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
      </div>
                </div>
              )}

  {num === 6 && (
    <>
      <div className="address-step">
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

        {/* Image Upload */}
        <div className="image-upload">
          <p>Please upload a product image or enter a SKU number.</p>
          <label className="upload_image">
            <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Upload Image/ Take picture
          </label>
          <input className="upload_image_span" type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" style={{ width: "120px", marginTop: "10px" }} />
          )}
        </div>

        {/* SKU Input */}
        <label className="upload_image">
          <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Enter SKU or Product name
        </label>
        <div ref={skuInputRef} style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Enter product SKU or name"
            value={sku}
            onChange={handleSkuChange}
            onKeyDown={handleEnterKey}
            className="styled-input"
          />
        

          {showSkuProducts && (
            <div className="sku-suggestions">
              {loadingProducts ? (
                <div>Loading...</div>
              ) : skuFilteredProducts.length === 0 ? (
                <div>No products found for "{sku}"</div>
              ) : (
                <ul>
                  {skuFilteredProducts.slice(0, 10).map((product) => (
                    <li key={product.id} onClick={() => handleSkuProductSelect(product)}>
                      {product.images?.[0]?.src && (
                        <img src={product.images[0].src} alt={product.title} width="100" height="100" />
                      )}
                      <div>
                        <strong>{product.title}</strong><br />
                        <small>{product.product_type}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {selectedSkuProducts.length > 0 && (
    <div className="selected-box">
      <h4 className="selected-heading">Selected via SKU:</h4>
      <div className="selected-sku-list">
        {selectedSkuProducts.map((product) => (
          <div className="selected-sku-card" key={product.id}>
            {product.images?.[0]?.src && (
              <img
                src={product.images[0].src}
                alt={product.title}
                width="100" height="100"
                className="sku-thumbnail"
              />
            )}
            <span className="sku-product-title">{product.title}</span>
            <button
              onClick={() => handleSkuProductSelect(product)}
            className="category-remove-btn"
              title="Remove"
            >
              ✕
            </button>
          </div>
          
        ))}
      </div>
    </div>
  )}

        </div>

        {/* Product Category Search */}
        <label className="upload_image search_prdouct_headding">
          <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Search product
        </label>
        <div ref={searchInputRef}>
          <select
            value={selectedCategory}
            onChange={(e) => {
              const key = e.target.value;
              setSelectedCategory(key);
              setShowProducts(true);
              setShowCategories(false);
              setProductSearch("");
            }}
            className="custom-select"
          >
            <option value="" disabled>Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.key}>
                {category.name}
              </option>
            ))}
          </select>

          {/* {selectedCategory && (
            <input
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setShowProducts(true);
                setShowCategories(false);
              }}
              placeholder="Search products by name, SKU, etc."
              className="styled-input"
              style={{ marginTop: '10px' }}
            />
          )} */}
        </div>

        {/* Category Product List */}
        {showProducts && selectedCategory && (
          <ul className="product-list">
            {loadingProducts ? (
              <li>Loading...</li>
            ) : filteredProducts.length === 0 ? (
              <li>No products found in this category.</li>
            ) : (
              filteredProducts.map((product) => {
                const isSelected = selectedCategoryProducts.some((p) => p.id === product.id);
                return (
                  <li
                    key={product.id}
                    className={`product-item ${isSelected ? "selected" : ""}`}
                    onClick={() => handleCategoryProductSelect(product)}
                  >
                    {product.images?.[0]?.src && (
                      <img src={product.images[0].src} alt={product.title} className="product-image" />
                    )}
                    <span>{product.title}</span>
                  </li>
                );
              })
            )}
          </ul>
        )}

        {/* Selected SKU Products */}
      

        {/* Selected Category Products */}
        {selectedCategoryProducts.length > 0 && (
    <div className="selected-box">
      <h4 className="selected-heading">Selected via Category:</h4>
      <div className="selected-category-list">
        {selectedCategoryProducts.map((product) => (
          <div className="selected-category-card" key={product.id}>
            {product.images?.[0]?.src && (
              <img
                src={product.images[0].src}
                alt={product.title}
                width="100" height="100"
                className="category-thumbnail"
              />
            )}
            <span className="sku-product-title">{product.title}</span>
            <button
              onClick={() => handleCategoryProductSelect(product)}
              className="category-remove-btn"
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )}


        {/* Errors */}
        {fieldErrors.generalImageOrSku && <p className="error">{fieldErrors.generalImageOrSku}</p>}
        <p className="error">{fieldErrors.selectedProduct}</p>
        <p className="error">{fieldErrors.submit}</p>
      </div>
    </>
  )}





  {step === 7 && (
    <div className="max-w-xl mx-auto  text-center submission_container">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 submisiion_headding">
        Thank you for registering your Ella Stein jewelry under our Warranty Program.
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-gray-600 submission_pera">
        Learn more about caring for your jewelry using the link below.
      </p>
      <p className="mt-6">
        <a
          className=" submission_button inline-block px-6 py-3 bg-[#f2e1d1] text-lg sm:text-xl font-bold text-gray-800 rounded-md shadow-md hover:bg-[#e0cfbf] transition "
          href="https://www.ellastein.com/pages/jewelry-care-tips"
          target="_blank"
          rel="noreferrer"
        >
          JEWELRY CARE TIPS
        </a>
        <span className="enter-text enter_tips_btn">  press <span className="enter-key">Enter ↵</span></span>
      </p>
    </div>
  )}
  </section>
          ))}

        <div className="btn-group flex justify-between mt-4 gap-4">
  {step > 1 && step <= 6 &&  (
      <button onClick={prevStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
        Previous
      </button>
    )}
  
  {step === 6 && (
    <button
      onClick={handleSubmit}
      className="submit_btn px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
    disabled={loading}
    >
      {loading ? "Submitting..." : "Submit"}
    </button>
  )}

  </div>

        </div>
      </div>
    );
  };

  export default Authe;