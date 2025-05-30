import React, { useState, useRef, useEffect } from "react";
import countryData from "../data/countryData";
import "./PhoneNumberStep.css";

const PhoneNumberStep = ({ phone, setPhone, nextStep, fieldErrors }) => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countryData.find(c => c.name === "India") || countryData[0]
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

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setShowDropdown(false);
    setPhone(`${country.code} `);  // Ye line input me code set karegi
  };

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    setPhone(inputValue);
  };

  return (
    <section className="step-section active slide-up">
      <div className="step-label">
      <div className="step_number_main">
              <span className="step-number">3</span>
              <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16" class="shouldFlipIfRtl">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06Z"></path>
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
  placeholder="Enter phone number"
  className="phone-input"
/>

      </div>

      {fieldErrors.phone && <p className="error">{fieldErrors.phone}</p>}

      <div className="ok-container">
        <button onClick={nextStep} className="ok-button">OK</button>
        <span className="enter-text">press <span className="enter-key">Enter ↵</span></span>
      </div>
    </section>
  );
};

export default PhoneNumberStep;
