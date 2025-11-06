import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';

/**
 * NavDropdown Component - Dropdown menu for navigation
 * @param {string} title - Desktop title
 * @param {string} mobileTitle - Mobile title
 * @param {Array} items - Menu items with title, desc, href
 */
function NavDropdown({ title, mobileTitle, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isOpen) {
      // Close dropdown when mouse leaves and it wasn't clicked open
      setTimeout(() => setIsOpen(false), 100);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown(e);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`${styles.navDropdown} ${isOpen || isHovered ? styles.active : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href="#"
        className={styles.dropdownTrigger}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.mobileText}>{mobileTitle}</span>
        <span className={styles.desktopText}>{title}</span>
        <svg
          className={styles.dropdownArrow}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </a>

      <div
        className={styles.dropdownMenu}
        role="menu"
        aria-label={`${title} menu`}
        style={{
          opacity: isOpen || isHovered ? '1' : '0',
          visibility: isOpen || isHovered ? 'visible' : 'hidden'
        }}
      >
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={styles.dropdownItem}
            role="menuitem"
            onClick={(e) => {
              // Special handling for "Explore Rentals" link
              if (item.title === 'Explore Rentals' && window.selectedDays && window.selectedDays.length > 0) {
                e.preventDefault();
                const bubbleDays = window.selectedDays.map(day => day + 1);
                window.location.href = `${item.href}?days-selected=${bubbleDays.join(',')}`;
              } else {
                setIsOpen(false);
              }
            }}
          >
            <span className={styles.dropdownTitle}>{item.title}</span>
            {item.desc && (
              <span className={styles.dropdownDesc}>{item.desc}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

export default NavDropdown;
