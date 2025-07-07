import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Client, Account, Databases, ID, Storage } from "appwrite";
import axios from 'axios';
import "./Authentication.css";
import PhoneNumberStep from './PhoneNumberStep';
import logo from '../assets/Ella stein logo.png';

const Authe = () => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState([]);
  // const [filteredProducts, setFilteredProducts] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(false);
  const [addressLine1, setAddressLine1] = useState(localStorage.getItem("addressLine1") || "");
  const [addressLine2, setAddressLine2] = useState(localStorage.getItem("addressLine2") || "");
  const [city, setCity] = useState(localStorage.getItem("city") || "");
  const [state, setState] = useState(localStorage.getItem("state") || "");
  const [zip, setZip] = useState(localStorage.getItem("zip") || "");
  const [country, setCountry] = useState(localStorage.getItem("country") || "");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [justVerified, setJustVerified] = useState(false);

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lastSelectedAddress, setLastSelectedAddress] = useState(""); // Track last selected address


  // const categories = [
  //   { id: 1, name: "Necklaces", key: "necklace" },
  //   { id: 2, name: "Earrings", key: "earring" },
  //   { id: 3, name: "Bracelets", key: "bracelet" },
  //   { id: 4, name: "Rings", key: "ring" }
  // ];

  const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
  const APPWRITE_PROJECT_ID = "68271c3c000854f08575";
  const APPWRITE_DATABASE_ID = "68271db80016565f6882";
  const APPWRITE_COLLECTION_ID = "68271dcf002c6797363d";
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
  const account = useMemo(() => new Account(client), [client]);
  const database = new Databases(client);
  const storage = new Storage(client);
  const APPWRITE_BUCKET_ID = "683e80fc0019228a6dfa"

  account.get().then(response => {
    // console.log('Account Info:', response);
  }).catch(error => {
    console.error('Error fetching account info:', error);
  });



  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const [imageFileId, setImageFileId] = useState([]);
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail && storedEmail !== email) {
      setEmail(storedEmail);
    }
  }, [step, email]);

  useEffect(() => {
    const storedPhone = localStorage.getItem("phone");
    if (storedPhone && storedPhone !== phone) {
      setPhone(storedPhone);
    }
  }, [step, phone]);


  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    localStorage.setItem("email", newEmail);
  };

  const handleFullNameChange = (e) => {
    const newFullName = e.target.value;
    setFullName(newFullName);
    localStorage.setItem("fullName", newFullName);

    if (fieldErrors.fullName) {
      setFieldErrors(prev => ({ ...prev, fullName: "" }));
    }
  };

  useEffect(() => {
    const storedFullName = localStorage.getItem("fullName");
    if (storedFullName && storedFullName !== fullName) {
      setFullName(storedFullName);
    }
  }, [fullName]);

  // const fetchGoogleSuggestions = async (query) => {
  //   try {
  //     console.log("Fetching suggestions for:", query);
  //     const response = await axios.get("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json", {
  //       params: {
  //         input: query,
  //         types: 'address',
  //         key: "AIzaSyBbS6eSDvhvJ_bSiX-urMEXKGkg4MSpVRE", // Your API key
  //       },
  //     });
  //     console.log("Google API response:", response);
  //     return response.data.predictions;
  //   } catch (err) {
  //     console.error("Google API error:", err.message || err);
  //     if (err.response) {
  //       console.error("Google API error response:", err.response);
  //     }
  //     return [];
  //   }
  // };


const fetchGoogleSuggestions = async (query) => {
  try {
    const response = await axios.get('/.netlify/functions/googleplaces', {
      params: { input: query },
    });

    console.log("Google API response:", response.data);
    setAddressSuggestions(response.data.predictions || []);
  } catch (err) {
    console.error("Google API error:", err.message || err);
    setAddressSuggestions([]);
  }
};

const handleSuggestionClick = async (item) => {
  try {
    const detailsResponse = await axios.get('/.netlify/functions/googleplacesdetails', {
      params: { place_id: item.place_id },
    });

    const place = detailsResponse.data.result;

    if (place) {
      const addressComponents = place.address_components || [];
      let streetNumber = '';
      let route = '';
      let locality = '';
      let administrativeArea = '';
      let postalCode = '';
      let country = '';

      addressComponents.forEach(component => {
        if (component.types.includes('street_number')) streetNumber = component.long_name;
        if (component.types.includes('route')) route = component.long_name;
        if (component.types.includes('locality')) locality = component.long_name;
        if (component.types.includes('administrative_area_level_1')) administrativeArea = component.short_name;
        if (component.types.includes('postal_code')) postalCode = component.long_name;
        if (component.types.includes('country')) country = component.long_name;
      });

      const formattedAddress = `${streetNumber} ${route}`.trim() || place.formatted_address;
      
      // Set form fields
      setAddressLine1(formattedAddress);
      setCity(locality);
      setState(administrativeArea);
      setZip(postalCode);
      setCountry(country || "United States");

      // Track the selected address
      setLastSelectedAddress(formattedAddress);
      setHasSelectedAddress(true);
    } else {
      setAddressLine1(item.description);
      setLastSelectedAddress(item.description);
      setHasSelectedAddress(true);
    }

    // Hide suggestions after selection
    setAddressSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);

  } catch (err) {
    console.error("Error fetching place details:", err);
    setAddressSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }
};


  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => Math.min(prev + 1, addressSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault(); // Prevent the default form submission
      const selected = addressSuggestions[highlightedIndex];
      handleSuggestionClick(selected);
    }
  };
  


  // Handle input field focus
const handleFocus = () => {
  // Always show suggestions when input is focused and has content
  if (addressLine1.trim().length > 1) {
    setShowSuggestions(true);
    // Always fetch suggestions when focused, regardless of selection status
    fetchGoogleSuggestions(addressLine1);
  }
};

// Updated handleBlur function
const handleBlur = () => {
  // Hide suggestions after a delay to allow for click events
  setTimeout(() => {
    setShowSuggestions(false);
  }, 200);
};


const handleAddressChange = (e) => {
  const value = e.target.value;
  setAddressLine1(value);
  clearFieldError("addressLine1");
  setFieldErrors(prev => ({ ...prev, addressLine1: "" }));

  // If the user is typing something different from the last selected address
  if (value !== lastSelectedAddress) {
    setHasSelectedAddress(false);
    setLastSelectedAddress(""); // Clear last selected address
  }

  // Clear other fields if the user is typing a new address
  if (value.trim() !== lastSelectedAddress && hasSelectedAddress) {
    setCity("");
    setState("");
    setZip("");
    setHasSelectedAddress(false);
  }

  setHighlightedIndex(-1);
   setShowSuggestions(true);

  // Fetch suggestions after typing a delay to avoid unnecessary API calls
  if (value.trim().length > 1) { // Minimum length check for better user experience
    const timeoutId = setTimeout(() => {
      fetchGoogleSuggestions(value);
    }, 300); // Adding delay to avoid too many API calls

    return () => clearTimeout(timeoutId);
  } else {
    setAddressSuggestions([]); // Clear suggestions if input is too short
  }
};


useEffect(() => {
  // Fetch suggestions if user has typed something and it's different from last selected
  if (addressLine1.trim().length > 1 && addressLine1 !== lastSelectedAddress) {
    const timeoutId = setTimeout(() => {
      fetchGoogleSuggestions(addressLine1);
    }, 300); // Add small delay to avoid too many API calls
    
    return () => clearTimeout(timeoutId);
  } else if (addressLine1.trim().length <= 1) {
    setAddressSuggestions([]);
  }
}, [addressLine1, lastSelectedAddress]);





  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      console.log("Tab is active again");
    }
  }, []);

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filePreviews = [];
    const uploadedFileIds = [];

    // Create an array of promises for uploading each file
    const uploadPromises = Array.from(files).map(async (file) => {
      filePreviews.push(URL.createObjectURL(file));  // Create file preview URL

      try {
        const response = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);
        console.log("Appwrite upload response:", response);

        if (response && response.$id) {
          uploadedFileIds.push(response.$id);  // Store the file ID
          console.log("Image uploaded successfully. File ID:", response.$id);
        } else {
          throw new Error("Failed to upload image. No file ID returned.");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Image upload failed. Check console for more details.");
      }
    });

    // Wait for all the uploads to complete
    await Promise.all(uploadPromises);

    // Update the state with previews and uploaded file IDs
    setImagePreview(filePreviews);  // Store previews of the images
    setImageFileId(uploadedFileIds);  // Store the file IDs for later use
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
        console.log("Fetched products:", data);
        if (Array.isArray(data)) {
          setProducts(data);
          // setFilteredProducts(data);
        } else {
          setProducts([]);
          // setFilteredProducts([]);
          setFieldErrors({ products: "Invalid products data." });
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        // setFilteredProducts([]);
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

    // setFilteredProducts(filtered);
  }, [productSearch, products, selectedCategory, showProducts, showCategories, categoryKeywords]);

  const handleSkuChange = (e) => {
    setSku(e.target.value);
  };


  const handleSkuProductSelect = (product) => {
    setSelectedSkuProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        setSelectedCategoryProducts(prevCat => prevCat.filter(p => p.id !== product.id));
        return [...prev, product];
      }
    });
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
      localStorage.setItem("userId", response.userId); // ✅ Save userId
      localStorage.setItem("currentStep", "3");        // ✅ Save step
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
  console.log("OTP entered:", secret);

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
    setFieldErrors({ otp: "OTP must be 6 digits." });
    setLoading(false);
    return;
  }

  try {
    const session = await account.createSession(userId, secret);
    console.log("OTP verified successfully, session created:", session);

    // Set all success states
    setIsAuthenticated(true);
    setJustVerified(true);  // Mark OTP as verified
    setAuthMessage("✅ OTP verified successfully!");
    setOtp("");

    // Store verification status in localStorage
    localStorage.setItem("isVerified", "true");
    localStorage.setItem("currentStep", "4");

    // Move to next step after a brief delay to show success message
    setTimeout(() => {
      setStep(4);
    }, 1500);

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
    setAuthMessage("");
  } finally {
    setLoading(false); // Reset the loading state
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
    console.log("Validating step:", currentStep);

    if (currentStep === 1 && !fullName.trim()) errors.fullName = "Enter your full name.";
    if (currentStep === 2 && !email.trim()) errors.email = "Enter your email.";
    if (currentStep === 3 && !otp.trim() && !justVerified) errors.otp = "Enter the OTP."; // Don't validate OTP if already verified
    if (currentStep === 4 && !phone.trim()) errors.phone = "Enter your phone number.";
    if (currentStep === 5 && !addressLine1.trim()) errors.addressLine1 = "Please enter your address.";

    console.log("Validation errors:", errors);

    if (currentStep === 6 && selectedCategoryProducts.length === 0) {
      errors.selectedCategoryProduct = "Please select a product from the category.";
      console.log("Category product not selected.");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };


  useEffect(() => {
    const storedStep = localStorage.getItem("currentStep");

    if (storedStep && !isNaN(storedStep)) {
      const parsedStep = parseInt(storedStep, 10);

      if (parsedStep >= 1 && parsedStep <= 6) {
        setStep(parsedStep);
      } else {
        setStep(1);
        localStorage.setItem("currentStep", "1");
      }
    } else {
      setStep(1);
    }
  }, []);

useEffect(() => {
  const isVerified = localStorage.getItem("isVerified");

  if (isVerified === "true") {
    setJustVerified(true);
    setIsAuthenticated(true);
    setAuthMessage("✅ OTP verified successfully!"); // Show the success message on page load
  }
}, []);



  const nextStep = () => {
    // Validate the current step before moving forward
    if (validateStep(step)) {
      const newStep = step + 1 > 7 ? 7 : step + 1; // Ensure step doesn't go beyond 7
      setStep(newStep);
      localStorage.setItem("currentStep", newStep); // Store the updated step value in localStorage
      setFieldErrors({}); // Clear field errors when transitioning
    } else {
      if (step === 3 && justVerified) {
        setStep(4); // Move to the next step if OTP was successfully verified
      }
    }
  };


  const prevStep = () => {
    setStep((prev) => {
      const newStep = Math.max(prev - 1, 1); // Make sure the step doesn't go below 1
      localStorage.setItem("currentStep", newStep); // Store the updated step value in localStorage

      if (newStep === 3) {
        // Retain the success message if the OTP was verified successfully
        if (justVerified) {
          setAuthMessage("✅ OTP verified successfully!");
        } else {
          setAuthMessage("");  // Optionally reset if OTP wasn't verified yet
        }
      }

      return newStep;
    });
  };

  const handleEnterKey = async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    switch (step) {
      case 1:
        nextStep();
        break;
      case 2:
        await sendOtp();
        break;
      case 3:
        if (justVerified) {
          nextStep();
        } else {
          await verifyOtp();
        }
        break;
      case 4:
        nextStep();
        break;
      case 5:
        nextStep();
        break;
      case 6:
        await handleSubmit();
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
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // const handleCategoryProductSelect = (product) => {
  //   const isSelectedViaSku = selectedSkuProducts.some(p => p.id === product.id);
  //   if (isSelectedViaSku) {
  //     return;
  //   }

  //   setSelectedCategoryProducts(prev => {
  //     const exists = prev.some(p => p.id === product.id);
  //     if (exists) {
  //       return prev.filter(p => p.id !== product.id);
  //     } else {
  //       return [...prev, product];
  //     }
  //   });
  // };

  useEffect(() => {
    // Save address fields to localStorage on change
    localStorage.setItem("addressLine1", addressLine1);
    localStorage.setItem("addressLine2", addressLine2);
    localStorage.setItem("city", city);
    localStorage.setItem("state", state);
    localStorage.setItem("zip", zip);
    localStorage.setItem("country", country);
  }, [addressLine1, addressLine2, city, state, zip, country]);

  useEffect(() => {
    const storedAddressLine1 = localStorage.getItem("addressLine1");
    const storedAddressLine2 = localStorage.getItem("addressLine2");
    const storedCity = localStorage.getItem("city");
    const storedState = localStorage.getItem("state");
    const storedZip = localStorage.getItem("zip");
    const storedCountry = localStorage.getItem("country");

    if (storedAddressLine1) setAddressLine1(storedAddressLine1);
    if (storedAddressLine2) setAddressLine2(storedAddressLine2);
    if (storedCity) setCity(storedCity);
    if (storedState) setState(storedState);
    if (storedZip) setZip(storedZip);
    if (storedCountry) setCountry(storedCountry);
  }, []); // Empty dependency array so this runs only once on mount



  const clearFormData = () => {
    // Clear state
    setFullName("");
    setEmail("");
    setPhone("");
    setProductSearch("");
    // setProducts([]);
    // setFilteredProducts([]);
    setFieldErrors({});
    setOtp("");
    setUserId(false);
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setZip("");
    setCountry("");
    setSku("");
    setSelectedSkuProducts([]);
    setSelectedCategoryProducts([]);
    setHasSelectedAddress(false);
    setShowCategories(false);
    setSelectedCategory("");
    setShowProducts(false);
    setSkuFilteredProducts([]);
    setShowSkuProducts(false);
    setHighlightedIndex(-1);
    setImagePreview([]);
    setImageFileId([]);
    setIsAuthenticated(false);
    setJustVerified(false);

    // ✅ Clear localStorage for form data fields
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    localStorage.removeItem("currentStep");
    localStorage.removeItem("phone");
    localStorage.removeItem("userId");
    localStorage.removeItem("isVerified");

    // Clear all address-related fields from localStorage
    localStorage.removeItem("addressLine1");
    localStorage.removeItem("addressLine2");
    localStorage.removeItem("city");
    localStorage.removeItem("state");
    localStorage.removeItem("zip");
    localStorage.removeItem("country");

    // Clear SKU-related data from localStorage
    localStorage.removeItem("sku");
    localStorage.removeItem("selectedSkuProducts");
    localStorage.removeItem("selectedCategoryProducts");
    localStorage.removeItem("showCategories");
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("showProducts");
    localStorage.removeItem("skuFilteredProducts");
    localStorage.removeItem("showSkuProducts");
  };




  const handleSubmit = async () => {
    console.log("Submit button clicked.");
    setLoading(true);
    setFieldErrors({}); // Clear any existing field errors

    // Allow submission even if no category or SKU product is selected in Step 6
    const hasCategoryProduct = selectedCategoryProducts.length > 0;
    const hasSkuProduct = selectedSkuProducts.length > 0;

    // If no products or images are selected, still allow submission (no error message for this case)
    if (!hasCategoryProduct && !hasSkuProduct) {
      console.log("No products or images selected, but submission will proceed.");
    }

    try {
      console.log("Submitting document...");
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
        image_file_id: imageFileId.join(", "), // Ensure the file ID is passed here
      };

      // Submit data to Appwrite Database
      await database.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        ID.unique(),
        document
      );
      console.log("Document submitted to Appwrite.");

      // Send data to Shopify (via a serverless function or API)
      await fetch("/.netlify/functions/sendToShopify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(document),
      });

      console.log("Document sent to Shopify.");

      // After successful submission, move to Step 7 (Thank You Page)
      setStep(7);
      console.log("Step set to 7: Thank You Page.");

      // Clear the form data for the next user
      clearFormData();
      setAuthMessage(""); // Clear any verification success messages
    } catch (err) {
      console.error("Submission failed:", err);
      setFieldErrors({ submit: `Submission failed: ${err?.message || "Unknown error"}` });
    } finally {
      setLoading(false); // Reset the loading state
    }
  };

  const clearFieldError = (fieldName) => {
    setFieldErrors(prev => ({ ...prev, [fieldName]: "" }));
  };


  // const fetchImage = async (fileId) => {
  //   try {
  //     const file = await storage.getFile(APPWRITE_BUCKET_ID, fileId);
  //     const fileUrl = file.$url;
  //     return fileUrl;
  //   } catch (error) {
  //     console.error("Error fetching image:", error);
  //   }
  // };

  return (
    <div className="auth-wrapper ">
      <div className="logo-text logo-image">
        <img src={logo} alt="Ella Stein Logo" />
      </div>
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
              onChange={handleFullNameChange}
              onKeyDown={handleEnterKey}
              className="styled-input placeholder-gray-700 text-base"
            />
            {fieldErrors.fullName && <p className="error">{fieldErrors.fullName}</p>}
            <div className="ok-container">
              <button onClick={nextStep} className="ok-button">Submit</button>
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
              onChange={handleEmailChange}
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
                </div>

                {fieldErrors.otp && <p className="error">{fieldErrors.otp}</p>}
                {authMessage && <p className={authMessage.includes("✅") ? "success-message" : "info-message"}>{authMessage}</p>}
                {justVerified && <p className="success-message">You're now verified!</p>}
              </>
            ) : (
              <>
                {/* <div>
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
                </div> */}
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

            {/* Adding the "OK" button above the "Verify OTP" button */}

            <div className="email_btn flex gap-4 mt-3">
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6 || justVerified}  // Disable if OTP is verified
                className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                onClick={sendOtp}
                disabled={loading || justVerified}  // Disable if OTP is verified
                className="resend_button bg-gray-200 text-black text-sm px-4 py-2 rounded hover:bg-gray-300"
              >
                {loading ? "Resending..." : "Resend OTP"}
              </button>
            </div>
            
          </section>
        )}


        {step === 4 && (
          <PhoneNumberStep phone={phone} setPhone={setPhone} nextStep={nextStep} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} />
        )}

        {[5, 6, 7].map((num) => (
          <section key={num} className={`step-section ${step === num ? "active slide-up" : "hidden"}`}>
            {num === 5 && (
              <div className="address-step">
                {/* Address Step */}
                <div className="step-label">
                  <div className="step_number_main">
                    <span className="step-number">5</span>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z" />
                      </svg>
                    </span>
                  </div>
                  Address:
                </div>
                <p>This is the address Ella Stein will use to initiate a pick-up and product replacement.</p>
                 {/* Address Input Fields */}
      <div className="address-autocomplete-wrapper">
        <label>Address</label>
        <div className="address-input-container">
          <input
            type="text"
            placeholder="65 Hansen Way"
            value={addressLine1}
       onChange={handleAddressChange}
            onFocus={handleFocus} // Show suggestions when input is focused
            onBlur={handleBlur} // Hide suggestions when input loses focus
            onKeyDown={handleKeyDown} // Handle keyboard navigation
            className="styled-input"
          />

           {showSuggestions && addressSuggestions.length > 0 && (
            <div className="suggestion-box">
              <div className="suggestion-header">
                <span>Suggestions</span>
                <button
                  className="close-suggestions"
                 onClick={() => {
                    setAddressSuggestions([]);
                    setShowSuggestions(false);
                  }}
                >
                  ✖
                </button>
              </div>
              <ul className="suggestions-list">
                {addressSuggestions.map((item, idx) => {
                  const isActive = idx === highlightedIndex;
                  const addressParts = item.description.split(', ');
                  const mainAddress = addressParts[0] || item.description;
                  const location = addressParts.slice(1).join(', ');

                  return (
                    <li
                      key={item.place_id || idx}
                      className={`suggestion-item ${isActive ? "highlighted" : ""}`}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <div className="suggestion-row">
                        <span className="suggestion-number">{mainAddress}</span>
                        <span className="suggestion-location">{location}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        {fieldErrors.addressLine1 && <p className="error">{fieldErrors.addressLine1}</p>}
      </div>

      {/* Rest of your form fields remain the same */}
      <label>Apartment, suite, etc</label>
      <input 
        ref={address2Ref} 
        type="text" 
        placeholder="Apartment 4" 
        value={addressLine2} 
        onChange={(e) => setAddressLine2(e.target.value)} 
        onKeyDown={(e) => { 
          if (e.key === "Enter") { 
            e.preventDefault(); 
            focusNextField(cityRef); 
          } 
        }} 
      />

      {/* City and State Inputs */}
      <div className="input-group">
        <div className="input-item">
          <label>City</label>
          <input 
            ref={cityRef} 
            type="text" 
            placeholder="Palo Alto" 
            value={city} 
            onChange={(e) => { 
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
        </div>

        <div className="input-item">
          <label>State</label>
          <input 
            ref={stateRef} 
            type="text" 
            placeholder="California" 
            value={state} 
            onChange={(e) => setState(e.target.value)} 
            onKeyDown={(e) => { 
              if (e.key === "Enter") { 
                e.preventDefault(); 
                focusNextField(zipRef); 
              } 
            }} 
          />
        </div>
      </div>

      {/* Zip and Country Inputs */}
      <div className="input-group">
        <div className="input-item">
          <label>Zip code</label>
          <input 
            ref={zipRef} 
            type="text" 
            placeholder="94304" 
            value={zip} 
            onChange={(e) => setZip(e.target.value)} 
            onKeyDown={(e) => { 
              if (e.key === "Enter") { 
                e.preventDefault(); 
                focusNextField(countryRef); 
              } 
            }} 
          />
          {fieldErrors.zip && <p className="error">{fieldErrors.zip}</p>}
        </div>

        <div className="input-item">
          <label>Country</label>
          <input 
            ref={countryRef} 
            type="text" 
            placeholder="United States" 
            value="United States" 
            readOnly 
          />
          {fieldErrors.country && <p className="error">{fieldErrors.country}</p>}
        </div>
      </div>

      <div className="ok-container">
        <button onClick={nextStep} className="ok-button">Submit</button>
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
                      <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Upload Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple // Allows multiple files to be selected
                      className="upload_image_span"
                    />

                    {/* Loop through imagePreview to show multiple previews */}
                    {imagePreview && imagePreview.length > 0 && (
                      <div className="image-previews">
                        {imagePreview.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{ width: "120px", marginTop: "10px", marginRight: "10px" }}
                          />
                        ))}
                      </div>
                    )}



                  </div>

                  <label className="upload_image">
                    <span className="subheadding_product" style={{ fontSize: '18px' }}>●</span> Search Product (Enter Product name or SKU) 
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

                  {/* <label className="upload_image search_prdouct_headding">
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
      )} */}

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
                </p>
              </div>
            )}
          </section>
        ))}

<div className={`btn-group mt-4 gap-4 ${step === 2 || step === 3 || step ===6 ? 'btn-left' : 'btn-right'}`}>
  {step === 6 && (
    <button
      onClick={handleSubmit}
      className="submit_btn"
      disabled={loading}
    >
      {loading ? "Submitting..." : "Submit"}
    </button>
  )}

  {(step === 2 || step === 3) && (
    <button onClick={nextStep} className="ok-button">
      Submit
    </button>
  )}

  {step > 1 && step <= 6 && (
    <button className="previous_btn" onClick={prevStep}>
      Back
    </button>
  )}
</div>





      </div>
    </div>
  );
};

export default Authe;