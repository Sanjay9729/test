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
    const [hasSelectedAddress, setHasSelectedAddress] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showProducts, setShowProducts] = useState(false);
    const [skuFilteredProducts, setSkuFilteredProducts] = useState([]);
    const [showSkuProducts, setShowSkuProducts] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const address2Ref = useRef(null);
    const cityRef = useRef(null);
    const stateRef = useRef(null);
    const zipRef = useRef(null);
    const countryRef = useRef(null);
    const emailInputRef = useRef(null);
    const searchInputRef = useRef(null);
    const skuInputRef = useRef(null);
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


const fetchPhotonSuggestions = async (query) => {
  try {
    const res = await axios.get("https://photon.komoot.io/api/", {
      params: {
        q: query,
        limit: 10,
      },
    });
    const usResults = res.data.features.filter(
      (item) => item.properties.countrycode?.toUpperCase() === "US"
    );
    return usResults;
  } catch (err) {
    console.error("Photon error:", err);
    return [];
  }
};

useEffect(() => {
  const delay = setTimeout(() => {
    if (addressLine1.length > 2 && !hasSelectedAddress) {
      fetchPhotonSuggestions(addressLine1).then(setAddressSuggestions);
    } else {
      setAddressSuggestions([]);
    }
  }, 300);
  return () => clearTimeout(delay);
}, [addressLine1, hasSelectedAddress]);

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

    const debugProducts = useCallback(() => {
      if (products.length > 0) {
        console.log('=== PRODUCT DEBUG INFO ===');
        console.log('Total products:', products.length);
        console.log('First product structure:', products[0]);
        console.log('All keys in first product:', Object.keys(products[0]));
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
  
    useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("/.netlify/functions/products");
      const data = await res.json();
      console.log("Fetched products:", data); // Add logging here
      if (Array.isArray(data)) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        setProducts([]);
        setFilteredProducts([]);
        setFieldErrors({ products: "Invalid products data." });
      }
    } catch (err) {
      console.error("Error fetching products:", err); // Add logging here
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
      if (!products || products.length === 0) return;
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

useEffect(() => {
      if (products.length > 0 && !loadingProducts) {
        debugProducts();
      }
    }, [products, loadingProducts, debugProducts]);

    const categoryKeywords = useMemo(() => ({
  necklace: ['necklace', 'pendant', 'choker'],
  earring: ['earring', 'hoop', 'stud'],
  bracelet: ['bracelet', 'bangle'],
  ring: ['ring'],
}), []);

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
          
          const variantMatch = Array.isArray(p.variants) && p.variants.some(variant => 
            normalize(variant.sku).includes(searchTerm) ||
            normalize(variant.title).includes(searchTerm)
          );
          
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

    const handleSkuChange = (e) => {
      setSku(e.target.value);
    };


const handleSkuProductSelect = (product) => {
  setSelectedSkuProducts(prev => {
    const exists = prev.some(p => p.id === product.id);
    if (exists) {
      // Remove if already selected in SKU
      return prev.filter(p => p.id !== product.id);
    } else {
      // Remove from category if exists there
      setSelectedCategoryProducts(prevCat => prevCat.filter(p => p.id !== product.id));
      // Add to SKU selection
      return [...prev, product];
    }
  });
  
  // Clear search after selection
  setShowSkuProducts(false);
  setSku('');
};

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
      if (currentStep === 4) { if (!phone.trim()) { errors.phone = "Enter your phone number.";
          } else if (!/^\d{10}$/.test(phone.trim())) {
              errors.phone = "Please enter a valid 10-digit phone number.";
          }
      }
      if (currentStep === 5) {
        if (!addressLine1.trim()) errors.addressLine1 = "Please enter your address.";
      if (!city.trim()) errors.city = "Please enter your city.";
      if (!country.trim()) errors.country = "Please enter your country.";
      }
    
       if (currentStep === 6) {
    const hasImage = !!imageFileId; // Check if an image is uploaded
    const hasSku = !!sku.trim();    // Check if SKU is entered
    const hasCategoryProduct = selectedCategoryProducts.length > 0; // Check if any category product is selected

    // Image/SKU Error: Either image or SKU must be provided
    if (!hasSku && !hasImage) {
      errors.generalImageOrSku = "Please select a product from category.";
    }

    // Category Product Error: If no product is selected from the category
    if (!hasCategoryProduct) {
      errors.selectedCategoryProduct = "Please select a product from the category.";
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

const handleCategoryProductSelect = (product) => {
  const isSelectedViaSku = selectedSkuProducts.some(p => p.id === product.id);
  if (isSelectedViaSku) {
    return; 
  }

  setSelectedCategoryProducts(prev => {
    const exists = prev.some(p => p.id === product.id);
    if (exists) {
      // Remove if already selected in category
      return prev.filter(p => p.id !== product.id);
    } else {
      // Add to category selection
      return [...prev, product];
    }
  });
};

const handleSubmit = async () => {
   console.log("handleSubmit triggered"); // Debug log
  setLoading(true);
  setFieldErrors({});

 const isImageUploaded = !!imageFileId;   // Check if an image is uploaded
  const isSkuEntered = sku.trim().length > 0; // Check if SKU is entered
  const hasCategoryProduct = selectedCategoryProducts.length > 0; // Check if any category product is selected

  // Separate image/SKU error validation
  if (!isImageUploaded && !isSkuEntered) {
    setFieldErrors(prev => ({
      ...prev,
      generalImageOrSku: "Please upload an image or enter a SKU.",
    }));
  }

  // Separate category product validation
  if (!hasCategoryProduct) {
    setFieldErrors(prev => ({
      ...prev,
      selectedCategoryProduct: "Please select a product from the category.",
    }));
    setLoading(false);
    return; // Prevent submission
  }
  if (Object.keys(fieldErrors).length > 0) {
    setLoading(false);
    return; // Stop the form submission if there are errors
  }

  const nothingSelected =
    !imageFileId &&
    !sku.trim() &&
    selectedCategoryProducts.length === 0 &&
    selectedSkuProducts.length === 0;

  if (nothingSelected) {
    setFieldErrors({
      generalImageOrSku: "Please upload an image, enter a SKU, or select a product from category.",
    });
    setLoading(false);
    return;
  }

  try {
    const session = await account.get();
    const address = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zip}, ${country}`;

    let skuTitles = [];

    if (selectedSkuProducts.length > 0) {
      skuTitles = selectedSkuProducts.map(p => p.title);
    } else if (sku.trim()) {
      skuTitles = [sku.trim()];
    }

    let categoryTitles = selectedCategoryProducts.map(p => p.title);

    const skuString = skuTitles.join(", ");
    const categoryString = categoryTitles.join(", ");

    const document = {
      full_name: fullName,
      email,
      phone,
      address,
      user_id: session.$id,
      product_sku: skuString,
      selected_product: categoryString,
      image_file_id: imageFileId || null,
    };

    console.log("Final document to submit:", document);

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

    setStep(7); // success
  } catch (err) {
    console.error("Submission failed:", err);
    setFieldErrors({ submit: `Submission failed: ${err?.message || "Unknown error"}` });
  } finally {
    setLoading(false);
  }
};

const clearFieldError = (fieldName) => {
  setFieldErrors(prev => ({ ...prev, [fieldName]: "" }));
};


 return (
      <div className="auth-wrapper ">
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
            <PhoneNumberStep phone={phone} setPhone={setPhone} nextStep={nextStep} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors}/>
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
 clearFieldError("addressLine1");
  setFieldErrors(prev => ({ ...prev, addressLine1: "" })); // Clear error
  setHasSelectedAddress(false);
  setAddressSuggestions([]);
  setCity("");
  setState("");
  setZip("");
  setCountry("");
  setHighlightedIndex(-1);
}}


 onKeyDown={(e) => {
    if (addressSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, addressSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const selected = addressSuggestions[highlightedIndex];
      const props = selected.properties;

      setAddressLine1(props.name || props.street || "");
      setAddressLine2(props.city || props.locality || "");
      setCity(props.city || props.locality || "");
      clearFieldError("city");
      setState(props.state || "");
      setZip(props.postcode || "");
      setCountry(props.country || "");
      clearFieldError("country");
      setAddressSuggestions([]);
      setHasSelectedAddress(true);
      setTimeout(() => address2Ref.current?.focus(), 150);
    }
  }}
  onBlur={() => {
    setTimeout(() => {
      setAddressSuggestions([]);
      setHighlightedIndex(-1);
    }, 200);
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
    const props = item.properties;
    const isActive = idx === highlightedIndex;

    return (
      <li
        key={idx}
        className={`suggestion-item ${isActive ? "highlighted" : ""}`}
        onMouseEnter={() => setHighlightedIndex(idx)}
       onClick={() => {
        setAddressLine1(props.name || props.street || "");
        clearFieldError("addressLine1");

        setAddressLine2(props.city || props.locality || "");
        
        setCity(props.city || props.locality || "");
        clearFieldError("city");

        setState(props.state || "");
        setZip(props.postcode || "");

        setCountry(props.country || "");
        clearFieldError("country");

        setAddressSuggestions([]);
        setHasSelectedAddress(true);
        setTimeout(() => address2Ref.current?.focus(), 150);
      }}

      >
        {props.name}, {props.street}, {props.city}, {props.state}, {props.country}
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
                  <input ref={cityRef} type="text" placeholder="Palo Alto" value={city} onChange={(e) => {
setCity(e.target.value);
  setFieldErrors(prev => ({ ...prev, city: "" }));
}}
    
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
                  <input ref={countryRef} type="text" placeholder="United States" value={country} onChange={(e) => {
  setCountry(e.target.value);
  setFieldErrors(prev => ({ ...prev, country: "" }));
}}
   onKeyDown={handleEnterKey} />

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
                  <li className="product-item" key={product.id} onClick={() => handleSkuProductSelect(product)}>
                    {product.images?.[0]?.src && (
                      <img src={product.images[0].src} alt={product.title} width="100" height="100" />
                    )}
                    <div>
                      <span>{product.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>



        )}
          
        {selectedSkuProducts.length > 0 && (
          <div className="selected-box">
            <h4 className="selected-heading">Selected via SKU Search:</h4>
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

              {fieldErrors.generalImageOrSku && (
  <p className="error" style={{ marginTop: '10px', color: 'red' }}>
    {fieldErrors.generalImageOrSku}
  </p>
)}


        </div>
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
        </div>

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

{fieldErrors.selectedCategoryProduct && (
  <p className="error" style={{ marginTop: '10px', color: 'red' }}>
    {fieldErrors.selectedCategoryProduct}
  </p>
)}
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