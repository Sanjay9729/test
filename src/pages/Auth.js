import React, { useState, useEffect, useRef, useCallback, useMemo} from "react";

import { Client, Account, Databases, ID, Storage } from "appwrite";
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
  const [otpSent, setOtpSent] = useState(false);
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

  const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
  const APPWRITE_PROJECT_ID = "68271c3c000854f08575";
  const APPWRITE_DATABASE_ID = "68271db80016565f6882";
  const APPWRITE_COLLECTION_ID = "68271dcf002c6797363d";
  
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
  const account = useMemo(() => new Account(client), [client]);
  const database = new Databases(client);
  const storage = new Storage(client);
  
  const APPWRITE_BUCKET_ID = "683e80fc0019228a6dfa";

  
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
    // Upload the image directly to Appwrite storage
    const response = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);

    // Log the response from Appwrite
    console.log("Appwrite upload response:", response);

    if (response && response.$id) {
      setImageFileId(response.$id);  // Store the file ID returned by Appwrite
      console.log("Image uploaded successfully. File ID:", response.$id);
    } else {
      throw new Error("Failed to upload image. No file ID returned.");
    }
  } catch (err) {
    // Detailed error logging
    console.error("Upload error:", err);
    alert("Image upload failed. Check console for more details.");
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
        setProducts([]);
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



// Session auto-refresh function
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
        localStorage.clear();
      }
    } catch (err) {
      console.error("Session refresh failed:", err);
      setIsAuthenticated(false);
      localStorage.clear();
    }
  }, 15 * 60 * 1000);
}, [account]); // 👈 Add dependency



useEffect(() => {
  if (isAuthenticated) {
    startAutoRefresh();
  }
  return () => {
    clearInterval(autoRefreshInterval.current);
  };
}, [isAuthenticated, startAutoRefresh]);



  // Handle visibility change to stop and start auto-refresh
useEffect(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [handleVisibilityChange]); // ✅ Fix: add the dependency






  // OTP and Email handling
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
      setStep(3);  // Move to OTP entry step
    } catch (err) {
      setFieldErrors({ email: err.message || "Failed to send OTP." });
    } finally {
      setLoading(false);
    }
  };

 const verifyOtp = async () => {
    setLoading(true);
    setFieldErrors({});  // Reset field errors
    setAuthMessage("");   // Clear previous auth messages

    const userId = localStorage.getItem("userId");
    const secret = otp.trim();  // OTP entered by the user

    if (!userId || !secret) {
        setFieldErrors({ otp: "Enter a valid OTP." });
        setLoading(false);
        return;
    }

    try {
        // Check if there's an active session before verifying OTP
        const session = await account.get();
        if (session) {
            setAuthMessage("You are already logged in!");
            setIsAuthenticated(true);
            nextStep();  // Proceed to the next step
            return;  // Prevent OTP verification if user is already logged in
        }

        // Proceed to verify OTP and create a new session
        await account.createSession(userId, secret);  // Create session after OTP verification
        setIsAuthenticated(true);  // Mark the user as authenticated
        setAuthMessage("✅ Verified and logged in!");  // Success message
        setJustVerified(true);
        nextStep();  // Proceed to the next step
    } catch (err) {
        setFieldErrors({ otp: "Invalid OTP. Please try again." });
        console.error("Error verifying OTP:", err);
    } finally {
        setLoading(false);
    }
};


  // OTP change handler (missing function)
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setFieldErrors({ ...fieldErrors, otp: "" });
    setAuthMessage("");
  };

  // Step validation and navigation
  const validateStep = (currentStep) => {
    const errors = {};

    if (currentStep === 1 && !fullName.trim()) errors.fullName = "Enter your full name.";
    if (currentStep === 2 && !email.trim()) errors.email = "Enter your email.";
    if (currentStep === 3 && !otp.trim()) errors.otp = "Enter the OTP.";
    if (currentStep === 4 && !phone.trim()) errors.phone = "Enter your phone number.";
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

  // Email validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handling image change



 

  // Handle form submission
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
        product_sku: sku || null, // Add SKU if provided
        user_id: session.$id,
        image_file_id: imageFileId || null // Will be null if no image uploaded
      };

      // Save to Appwrite database
      await database.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        ID.unique(),
        document
      );

      // Optionally, send to Shopify (if needed)
      await fetch("/.netlify/functions/sendToShopify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(document)
      });

      setStep(7); // Show thank-you step
    } catch (err) {
      console.error("Submission failed:", err);
      setFieldErrors({ submit: "Submission failed. Please try again." });
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

       

        {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
        {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}
        {justVerified && <p className="success-message">You're now verified!</p>}

        {/* SIDE BY SIDE BUTTONS */}
        <div className="flex gap-4 mt-3">
         

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
                <input className="text-[20px] sm:text-[18px] md:text-[16px] lg:text-[20px]" type="text" placeholder="65 Hansen Way" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />

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
  <label className="text-[16px]">Upload Product Image (Optional)</label>
  <input type="file" accept="image/*" onChange={handleImageChange} />
  {imagePreview && (
    <img src={imagePreview} alt="Preview" style={{ width: "120px", marginTop: "10px" }} />
  )}
  {fieldErrors.image && <p className="error">{fieldErrors.image}</p>}
</div>
<label className="text-[16px]">Enter SKU Number</label>
<input
  type="text"
  placeholder="Enter product SKU"
  value={sku}
  onChange={(e) => setSku(e.target.value)}
  className="styled-input"
/>
{fieldErrors.sku && <p className="error">{fieldErrors.sku}</p>}

    <input
      value={productSearch}
      onChange={(e) => setProductSearch(e.target.value)}
      placeholder="Search products..."
      className="w-full"
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
  <div className="max-w-xl mx-auto  text-center submission_container">
    {/* Removed the step number and arrow */}
    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 submisiion_headding">
      Thank you for registering your Ella Stein jewelry under our Warranty Program.
    </h1>
    <p className="mt-4 text-lg sm:text-xl text-gray-600">
      Learn more about caring for your jewelry using the link below.
    </p>
    <p className="mt-6">
      <a
        className="inline-block px-6 py-3 bg-[#f2e1d1] text-lg sm:text-xl font-bold text-gray-800 rounded-md shadow-md hover:bg-[#e0cfbf] transition"
        href="https://www.ellastein.com/pages/jewelry-care-tips"
        target="_blank"
        rel="noreferrer"
      >
        JEWELRY CARE TIPS
      </a>
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
  {step < 6 && (
    <button onClick={nextStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
      Next
    </button>
  )}
{step === 6 && (
  <button
    onClick={handleSubmit}
    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
    disabled={loading || !selectedProduct}
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




