import { EXTERNAL_URLS } from '../../utils/constants.js';
import styles from './Header.module.css';

/**
 * MobileMenu Component - Mobile overlay menu
 * @param {Array} hostItems - Host dropdown items
 * @param {Array} guestItems - Guest dropdown items
 * @param {boolean} isLoggedIn - Authentication status
 * @param {string} username - User's name if logged in
 * @param {Function} onClose - Close menu callback
 */
function MobileMenu({ hostItems, guestItems, isLoggedIn, username, onClose }) {
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className={styles.mobileMenuOverlay} onClick={onClose}>
      <div className={styles.mobileMenuContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.mobileMenuSection}>
          <h3>Host with Us</h3>
          {hostItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={styles.mobileMenuItem}
              onClick={handleLinkClick}
            >
              {item.title}
            </a>
          ))}
        </div>

        <div className={styles.mobileMenuSection}>
          <h3>Stay with Us</h3>
          {guestItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={styles.mobileMenuItem}
              onClick={handleLinkClick}
            >
              {item.title}
            </a>
          ))}
        </div>

        <div className={styles.mobileMenuSection}>
          <a
            href={EXTERNAL_URLS.SEARCH}
            className={styles.mobileMenuCta}
            onClick={(e) => {
              // If user has selected days, pass them as URL parameters
              if (window.selectedDays && window.selectedDays.length > 0) {
                e.preventDefault();
                const bubbleDays = window.selectedDays.map(day => day + 1);
                window.location.href = `${EXTERNAL_URLS.SEARCH}?days-selected=${bubbleDays.join(',')}`;
              } else {
                handleLinkClick();
              }
            }}
          >
            Explore Rentals
          </a>

          {isLoggedIn && username ? (
            <a
              href={EXTERNAL_URLS.ACCOUNT_PROFILE}
              className={styles.mobileMenuCta}
              onClick={handleLinkClick}
            >
              Hello {username}
            </a>
          ) : (
            <>
              <a
                href={EXTERNAL_URLS.SIGNUP_LOGIN}
                className={styles.mobileMenuCta}
                onClick={handleLinkClick}
              >
                Sign In
              </a>
              <a
                href={EXTERNAL_URLS.SIGNUP_LOGIN}
                className={styles.mobileMenuCta}
                onClick={handleLinkClick}
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
