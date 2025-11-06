import { useState, useEffect } from 'react';
import { EXTERNAL_URLS } from '../../utils/constants.js';
import NavDropdown from './NavDropdown.jsx';
import MobileMenu from './MobileMenu.jsx';
import styles from './Header.module.css';

/**
 * Header Component - Main navigation bar
 * Features: Dropdowns (Host/Guest), Auth buttons, Mobile menu
 */
function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    // Check Split Lease cookies
    const cookies = document.cookie.split('; ');
    const loggedInCookie = cookies.find(c => c.startsWith('loggedIn='));
    const usernameCookie = cookies.find(c => c.startsWith('username='));

    const isLoggedIn = loggedInCookie ? loggedInCookie.split('=')[1] === 'true' : false;
    let username = null;

    if (usernameCookie) {
      username = decodeURIComponent(usernameCookie.split('=')[1]);
      username = username.replace(/^["']|["']$/g, ''); // Remove quotes
    }

    setIsLoggedIn(isLoggedIn);
    setUsername(username);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAuthClick = () => {
    // Direct redirect to Split Lease login
    window.location.href = EXTERNAL_URLS.SIGNUP_LOGIN;
  };

  const handleProfileClick = () => {
    window.location.href = EXTERNAL_URLS.ACCOUNT_PROFILE;
  };

  // Host dropdown items
  const hostDropdownItems = [
    {
      title: 'Why List with Us',
      desc: 'New to Split Lease? Learn more about hosting',
      href: EXTERNAL_URLS.HOST_GUIDE
    },
    {
      title: 'Success Stories',
      desc: 'Explore other hosts\' feedback',
      href: EXTERNAL_URLS.SUCCESS_STORIES
    },
    {
      title: 'List Property',
      href: EXTERNAL_URLS.SIGNUP_LOGIN
    },
    {
      title: 'Legal Information',
      desc: 'Review most important policies',
      href: EXTERNAL_URLS.POLICIES
    },
    {
      title: 'FAQs',
      desc: 'Frequently Asked Questions',
      href: EXTERNAL_URLS.FAQ
    },
    {
      title: 'Sign Up',
      href: EXTERNAL_URLS.SIGNUP_LOGIN
    }
  ];

  // Guest dropdown items
  const guestDropdownItems = [
    {
      title: 'Explore Rentals',
      desc: 'See available listings!',
      href: EXTERNAL_URLS.SEARCH
    },
    {
      title: 'Success Stories',
      desc: 'Explore other guests\' feedback',
      href: EXTERNAL_URLS.SUCCESS_STORIES
    },
    {
      title: 'FAQs',
      desc: 'Frequently Asked Questions',
      href: EXTERNAL_URLS.FAQ
    },
    {
      title: 'Sign Up',
      href: EXTERNAL_URLS.SIGNUP_LOGIN
    }
  ];

  return (
    <header className={styles.mainHeader}>
      <nav className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.navLeft}>
          <a href="https://splitlease.app" className={styles.logo}>
            <img
              src="assets/images/logo.png"
              alt="Split Lease"
              className={styles.logoImage}
            />
            <span className={styles.logoText}>Split Lease</span>
          </a>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          className={`${styles.hamburgerMenu} ${isMobileMenuOpen ? styles.active : ''}`}
          aria-label="Toggle navigation menu"
          onClick={toggleMobileMenu}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        {/* Desktop Navigation */}
        <div className={`${styles.navCenter} ${isMobileMenuOpen ? styles.mobileActive : ''}`}>
          <NavDropdown
            title="Host with Us"
            mobileTitle="Host"
            items={hostDropdownItems}
          />
          <NavDropdown
            title="Stay with Us"
            mobileTitle="Guest"
            items={guestDropdownItems}
          />
        </div>

        {/* Right Side - Auth Buttons */}
        <div className={`${styles.navRight} ${isMobileMenuOpen ? styles.mobileActive : ''}`}>
          <a
            href={EXTERNAL_URLS.SEARCH}
            className={styles.exploreRentalsBtn}
            onClick={(e) => {
              // If user has selected days, pass them as URL parameters
              if (window.selectedDays && window.selectedDays.length > 0) {
                e.preventDefault();
                const bubbleDays = window.selectedDays.map(day => day + 1);
                window.location.href = `${EXTERNAL_URLS.SEARCH}?days-selected=${bubbleDays.join(',')}`;
              }
              // Otherwise, let the default href take over (no parameters)
            }}
          >
            Explore Rentals
          </a>

          {isLoggedIn && username ? (
            <>
              <a
                href={EXTERNAL_URLS.ACCOUNT_PROFILE}
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleProfileClick();
                }}
              >
                Hello {username}
              </a>
            </>
          ) : (
            <>
              <a
                href="javascript:void(0)"
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleAuthClick();
                }}
              >
                Sign In
              </a>
              <span className={styles.divider}>|</span>
              <a
                href="javascript:void(0)"
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleAuthClick();
                }}
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <MobileMenu
          hostItems={hostDropdownItems}
          guestItems={guestDropdownItems}
          isLoggedIn={isLoggedIn}
          username={username}
          onClose={toggleMobileMenu}
        />
      )}
    </header>
  );
}

export default Header;
