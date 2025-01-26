import React, { useEffect } from "react";
import { useState } from "react";
import Cookies from "js-cookie";
import "./CookieConsent.css";
import { Button } from "antd";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(
    !localStorage.getItem("cookieConsent") ||
      localStorage.getItem("cookieConsent") === "denied"
  );

  useEffect(() => {
    // check if consent was already granted
    const consentStatus = localStorage.getItem("cookieConsent");
    if (consentStatus === "accepted") {
      loadGoogleAnalytics();
    }
  }, []);

  const handleAccept = () => {
    setIsVisible(false);
    localStorage.setItem("cookieConsent", "accepted");

    //set cookies for analytics and marketing
    Cookies.set("analytics", "true", { expires: 365 });
    // Cookies.set("marketing", "true", { expires: 365 }); //facebook

    // Load Google Analytics
    loadGoogleAnalytics();
  };

  const handleDeny = () => {
    setIsVisible(false);
    localStorage.setItem("cookieConsent", "denied");

    // Remove cookies if denied
    Cookies.remove("analytics");
    // Cookies.remove("marketing"); //facebook
  };

  const loadGoogleAnalytics = () => {
    // Avoid adding the script if it's already present
    if (
      !document.querySelector(
        'script[src="https://www.googletagmanager.com/gtag/js?id=G-VWDRMP7P3T"]'
      )
    ) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-VWDRMP7P3T";
      document.head.appendChild(script);

      script.onload = () => {
        // Initialize the Google Analytics script once it's loaded
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        gtag("js", new Date());
        gtag("config", "G-VWDRMP7P3T");
      };
    }
  };

  return (
    isVisible && (
      <div className="cookie-consent">
        <p>
          This website stores data such as cookies to enable personalization,
          and analytics.{" "}
          <a href="/cookie-policy" className="cookie-link">
            Cookie Notice
          </a>
        </p>
        <div className="cookie-buttons">
          <button className="cookie-accept" onClick={handleAccept}>
            Accept
          </button>
          <button className="cookie-deny" onClick={handleDeny}>
            Deny
          </button>
        </div>
      </div>
    )
  );
};
export default CookieConsent;
