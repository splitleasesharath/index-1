/**
 * Constants and configuration for Split Lease Clone
 * Preserves URL_LOCK mechanism and all authorized URLs
 */

// URL LOCK MECHANISM - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
export const URL_LOCK = {
  AUTHORIZED_DOMAIN: 'app.split.lease',
  LOCKED: true,
  LOCK_MESSAGE: '🔒 URL modifications are locked. Contact project owner for authorization.',

  // Validate that a URL uses the authorized domain
  validateURL(url) {
    if (!this.LOCKED) return true;
    return url.includes(this.AUTHORIZED_DOMAIN);
  },

  // Get the authorized base URL
  getBaseURL() {
    return `https://${this.AUTHORIZED_DOMAIN}`;
  }
};

// Freeze to prevent modifications
Object.freeze(URL_LOCK);

// Property IDs from original Split Lease site
export const PROPERTY_IDS = [
  '1586447992720x748691103167545300', // One Platt | Studio
  '1701107772942x447054126943830000', // Pied-à-terre, Perfect 2 BR
  '1701115344294x620453327586984000', // Fully furnished 1bdr apartment
  '1701196985127x160157906679627780'  // Furnished Studio Apt for Rent
];

// Day names for calendar
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Default selected days (weeknights: Monday-Friday)
export const DEFAULT_SELECTED_DAYS = [1, 2, 3, 4, 5];

// Schedule presets (using 1-based Bubble indexing)
export const SCHEDULE_PRESETS = {
  WEEKNIGHT: '2,3,4,5,6', // Mon-Fri
  WEEKEND: '6,7,1,2',      // Fri-Sun+Mon-Tue
  MONTHLY: '1,2,3,4,5,6,7' // All days
};

// API endpoints
export const API_ENDPOINTS = {
  REFERRAL: `${URL_LOCK.getBaseURL()}/api/1.1/wf/referral-index-lite`,
  USER_AUTH: `${URL_LOCK.getBaseURL()}/version-test/api/1.1/obj/user`
};

// External URLs
export const EXTERNAL_URLS = {
  SEARCH: `${URL_LOCK.getBaseURL()}/search`,
  SIGNUP_LOGIN: `${URL_LOCK.getBaseURL()}/signup-login`,
  FAQ: `${URL_LOCK.getBaseURL()}/faq`,
  HOST_GUIDE: `${URL_LOCK.getBaseURL()}/host-step-by-step-guide-to-list`,
  SUCCESS_STORIES: `${URL_LOCK.getBaseURL()}/success-stories-guest`,
  POLICIES: `${URL_LOCK.getBaseURL()}/policies/cancellation-and-refund-policy`,
  ACCOUNT_PROFILE: `${URL_LOCK.getBaseURL()}/account-profile`,
  MARKET_RESEARCH: `${URL_LOCK.getBaseURL()}/embed-ai-drawer`,
  TERMS: `${URL_LOCK.getBaseURL()}/terms`
};
