/**
 * URL Manager - Handle URL parameter synchronization
 * Preserves exact URL encoding format from original site
 */

import { DEFAULT_SELECTED_DAYS } from './constants.js';

/**
 * Parse selected days from URL parameter
 * Converts from 1-based (Bubble) to 0-based (JavaScript) indexing
 * @returns {number[]} - Array of selected day indices
 */
export function loadDaysFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const daysParam = urlParams.get('days-selected');

  if (daysParam) {
    // Parse days from URL parameter (decode URL encoding)
    const decoded = decodeURIComponent(daysParam);
    // Convert from 1-based (Bubble) to 0-based (JavaScript) by subtracting 1
    const bubbleDays = decoded.split(',').map((d) => parseInt(d.trim()));
    return bubbleDays.map((day) => day - 1).filter((d) => d >= 0 && d <= 6);
  } else {
    // Default to Monday-Friday (indices 1-5 in JavaScript, days 2-6 in URL)
    return DEFAULT_SELECTED_DAYS;
  }
}

/**
 * Update URL with selected days parameter
 * Converts from 0-based (JavaScript) to 1-based (Bubble) indexing
 * Uses exact URL encoding format: %2C%20 = ", "
 * @param {number[]} selectedDays - Array of selected day indices
 */
export function updateURLWithDays(selectedDays) {
  const currentUrl = new URL(window.location);

  if (selectedDays.length === 0) {
    currentUrl.searchParams.delete('days-selected');
  } else {
    // Convert to 1-based indexing for Bubble (add 1 to each day)
    const bubbleDays = selectedDays.map((day) => day + 1);
    // Use exact URL encoding format like original site: %2C%20 = ", "
    currentUrl.searchParams.set('days-selected', bubbleDays.join(', '));
  }

  // Update URL without page reload
  window.history.replaceState({}, '', currentUrl);
}

/**
 * Build search URL with selected days
 * @param {number[]} selectedDays - Array of selected day indices
 * @param {string} baseUrl - Base URL for search page
 * @returns {string} - Complete URL with parameters
 */
export function buildSearchURL(selectedDays, baseUrl = 'https://app.split.lease/search') {
  // Convert to 1-based indexing for Bubble
  const bubbleDays = selectedDays.map((day) => day + 1);
  return `${baseUrl}?days-selected=${bubbleDays.join(',')}`;
}

/**
 * Build property URL with selected days
 * @param {string} propertyId - Property ID
 * @param {number[]} selectedDays - Array of selected day indices
 * @param {string} weeklyFrequency - Weekly frequency parameter
 * @returns {string} - Complete property URL
 */
export function buildPropertyURL(
  propertyId,
  selectedDays,
  weeklyFrequency = 'Every%20week'
) {
  const bubbleDays = selectedDays.map((day) => day + 1);
  return `https://app.split.lease/view-split-lease/${propertyId}?days-selected=${bubbleDays.join(',')}&weekly-frequency=${weeklyFrequency}`;
}
