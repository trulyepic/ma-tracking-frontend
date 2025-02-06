import React from "react";
import { useNavigate } from "react-router-dom";
import "./CookieConsent";

const CookieNotice = () => {
  const navigate = useNavigate();

  return (
    <div className="cookie-notice-container">
      <h1>Cookie Notice</h1>
      <p>
        This website uses cookies to enhance your experience. By using our site,
        you agree to our use of cookies as described in this notice.
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device that help us improve
        your experience by enabling personalization, analytics, and security.
      </p>

      <h2>Types of Cookies We Use</h2>

      <h3>1. Essential Cookies</h3>
      <p>
        These cookies are necessary for the website to function properly. They
        enable basic features such as security, network management, and
        accessibility.
      </p>

      <h3>2. Analytics Cookies</h3>
      <p>
        We use analytics cookies to understand how users interact with our
        website. This helps us improve user experience and optimize content.
        These cookies do not collect personal data.
      </p>

      <h3>3. Personalization Cookies</h3>
      <p>
        Personalization cookies allow us to remember your preferences and
        settings, such as your language, saved collections, and browsing
        history.
      </p>

      <h3>4. Third-Party Cookies</h3>
      <p>
        Some cookies are set by third-party services such as Google Analytics to
        help us analyze website traffic and user behavior.
      </p>

      <h2>Managing Cookies</h2>
      <p>
        You can manage or delete cookies at any time through your browser
        settings. You can also revoke your consent by adjusting the cookie
        settings in your account preferences.
      </p>

      <h2>How to Disable Cookies</h2>
      <p>
        You can modify your browser settings to disable cookies, but this may
        impact your experience on our website. Below are links to manage cookies
        in common browsers:
      </p>
      <ul>
        <li>
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/en-us/HT201265"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/en-us/topic/how-to-manage-cookies-in-microsoft-edge-6e8b593d-3a78-8b19-3c6f-3eac50fe34d2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Edge
          </a>
        </li>
      </ul>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about our cookie policy, please contact us at{" "}
        <a href="mailto:trulyepickstudios@gmail.com">
          trulyepickstudios@gmail.com
        </a>
        .
      </p>

      <button className="cookie-back-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default CookieNotice;
