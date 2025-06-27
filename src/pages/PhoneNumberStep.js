import React, { useState, useRef, useEffect } from "react";
import countryData from "../data/countryData";
import "./PhoneNumberStep.css";



const PhoneNumberStep = ({ phone, setPhone, nextStep, fieldErrors, setFieldErrors }) => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countryData.find(c => c.name === "United States") || countryData[0]
  );
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countryData.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

const handleEnterKey = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (/^\d+$/.test(phone)) {
      nextStep(); // only allow if phone is numeric
    }
  }
};


  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setShowDropdown(false);
    setPhone("");  // Clear phone number when country code is changed
  };

const handlePhoneChange = (e) => {
  const inputValue = e.target.value;

  if (/^\d*$/.test(inputValue)) {
    setPhone(inputValue);

    // ✅ Clear error if user starts typing again
    if (fieldErrors.phone) {
      setFieldErrors(prev => ({ ...prev, phone: "" }));
    }
  }
};



  // Mapping of countries to phone number formats
  const phoneFormats = {
    "+1": "(201) 555-0123", // United States
    "+93": "070 123 4567",   // Afghanistan
    "+44": "07400 123456",   // United Kingdom
    "+91": "0811234 56789",     // India
    "+61": "04112 345 678",   // Australia
    "+33": "06 12 34 56 78", // France
    "+49": "01512 3456789", // Germany
    "+81": "090-1234-5678",  // Japan
    "+55": "(11) 96123-456", // Brazil
    "+34": "612 34 56 78",    // Spain
    "+27": "071 123 4567",   // South Africa
    "+358": "041 2345678",   //Aland islands
    "+355": "067 212 3456",   // Albania

    // Add more countries as needed
  };

  // Function to get the phone number placeholder format for the selected country
  const getPhonePlaceholder = (countryCode) => {
    return phoneFormats[countryCode] || "(XXX) XXX-XXXX";  // Default format if country not listed
  };

  return (
    <section className="step-section active slide-up">
      <div className="step-label">
        <div className="step_number_main">
          <span className="step-number">3</span>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16" className="shouldFlipIfRtl">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
          </span>
        </div>
        Phone Number:
      </div>

      <div className="phone-input-wrapper" ref={dropdownRef}>
        <div
          className="dropdown-toggle"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <img src={selectedCountry.flag} alt="flag" className="flag" />
          <span className="country-code">{selectedCountry.code}</span>
          <span className="arrow">▼</span>
        </div>

        {showDropdown && (
          <div className="dropdown-box">
            <input
              type="text"
              placeholder="Search countries"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-box"
            />
            <ul className="country-list">
              {filteredCountries.map((country) => (
                <li
                  key={country.code}
                  className="country-item"
                  onClick={() => handleSelectCountry(country)}
                >
                  <img src={country.flag} alt={country.name} className="flag" />
                  <span className="country-name">{country.name}</span>
                  <span className="country-code">{country.code}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={phone}
          onChange={handlePhoneChange}
          placeholder={getPhonePlaceholder(selectedCountry.code)} 
           onKeyDown={handleEnterKey}

          className="phone-input"
        />
      </div>

      {fieldErrors.phone && <p className="error">{fieldErrors.phone}</p>}
        {phone && !/^\d+$/.test(phone) && (
  <p className="error">Numbers only please</p>
)}

      <div className="ok-container">
<button
  onClick={() => {
    if (/^\d+$/.test(phone)) {
      nextStep(); // Only go next if phone is numeric
    }
  }}
  className="ok-button"
>
  OK
</button>
        <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
      </div>
    </section>
  );
};

export default PhoneNumberStep;
