/**
 * Day Validator - Continuity and validation logic for day selection
 * Preserves exact logic from original implementation
 */

import { DAY_NAMES } from './constants.js';

/**
 * Check if selected days are continuous
 * Handles both regular continuity and wrap-around cases (e.g., Fri-Sat-Sun-Mon)
 * @param {number[]} days - Array of day indices (0=Sunday, 6=Saturday)
 * @returns {boolean} - True if days are continuous
 */
export function areDaysContinuous(days) {
  console.log('areDaysContinuous called with:', days);

  // Edge cases
  if (days.length <= 1) {
    console.log('-> Length <= 1, returning true');
    return true;
  }

  if (days.length >= 6) {
    console.log('-> Length >= 6, returning true');
    return true;
  }

  const sortedDays = [...days].sort((a, b) => a - b);
  console.log('-> Sorted days:', sortedDays);

  // STEP 1: Check if selected days are continuous (regular check)
  let isRegularContinuous = true;
  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i] !== sortedDays[i - 1] + 1) {
      isRegularContinuous = false;
      break;
    }
  }

  if (isRegularContinuous) {
    console.log('-> Regular continuous check passed');
    return true;
  }

  // STEP 2: Check if UNSELECTED days are continuous (implies wrap-around)
  console.log('-> Regular check failed, checking wrap-around via unselected days');

  const allDays = [0, 1, 2, 3, 4, 5, 6];
  const unselectedDays = allDays.filter((day) => !sortedDays.includes(day));

  if (unselectedDays.length === 0) {
    // All days selected
    return true;
  }

  console.log('-> Unselected days:', unselectedDays);

  // Check if unselected days are continuous
  const sortedUnselected = [...unselectedDays].sort((a, b) => a - b);
  for (let i = 1; i < sortedUnselected.length; i++) {
    if (sortedUnselected[i] !== sortedUnselected[i - 1] + 1) {
      console.log('-> Unselected days not continuous, selection is not valid');
      return false;
    }
  }

  console.log('-> Unselected days are continuous, selection wraps around!');
  return true;
}

/**
 * Calculate check-in and check-out days from selected days
 * Handles wrap-around cases properly
 * @param {number[]} selectedDays - Array of selected day indices
 * @returns {{checkinDay: string, checkoutDay: string}} - Day names
 */
export function calculateCheckInOut(selectedDays) {
  if (selectedDays.length === 0) {
    return { checkinDay: '', checkoutDay: '' };
  }

  if (selectedDays.length === 1) {
    return {
      checkinDay: DAY_NAMES[selectedDays[0]],
      checkoutDay: DAY_NAMES[selectedDays[0]],
    };
  }

  const sortedDays = [...selectedDays].sort((a, b) => a - b);
  const hasSunday = sortedDays.includes(0);
  const hasSaturday = sortedDays.includes(6);

  // Check if this is a wrap-around case
  if (hasSunday && hasSaturday && sortedDays.length < 7) {
    // Find the gap (unselected days) in the week
    let gapStart = -1;
    let gapEnd = -1;

    // Look for the gap in the sorted days
    for (let i = 0; i < sortedDays.length - 1; i++) {
      if (sortedDays[i + 1] - sortedDays[i] > 1) {
        // Found the gap
        gapStart = sortedDays[i] + 1; // First unselected day
        gapEnd = sortedDays[i + 1] - 1; // Last unselected day
        break;
      }
    }

    if (gapStart !== -1 && gapEnd !== -1) {
      // Wrap-around case with a gap in the middle
      let checkinDayIndex;
      if (sortedDays.some((day) => day > gapEnd)) {
        // There are days after the gap in the same week
        checkinDayIndex = sortedDays.find((day) => day > gapEnd);
      } else {
        // Wrap to Sunday
        checkinDayIndex = 0;
      }

      let checkoutDayIndex;
      if (sortedDays.some((day) => day < gapStart)) {
        // There are days before the gap
        checkoutDayIndex = sortedDays.filter((day) => day < gapStart).pop();
      } else {
        // Wrap to Saturday
        checkoutDayIndex = 6;
      }

      console.log(`🔄 Wrap-around: Gap is ${DAY_NAMES[gapStart]}-${DAY_NAMES[gapEnd]}`);
      console.log(`   Check-in: ${DAY_NAMES[checkinDayIndex]}, Check-out: ${DAY_NAMES[checkoutDayIndex]}`);

      return {
        checkinDay: DAY_NAMES[checkinDayIndex],
        checkoutDay: DAY_NAMES[checkoutDayIndex],
      };
    }
  }

  // Non-wrap-around case: use first and last in sorted order
  return {
    checkinDay: DAY_NAMES[sortedDays[0]],
    checkoutDay: DAY_NAMES[sortedDays[sortedDays.length - 1]],
  };
}

/**
 * Validate minimum days requirement
 * @param {number[]} days - Array of day indices
 * @returns {boolean} - True if at least 2 days selected
 */
export function hasMinimumDays(days) {
  return days.length >= 2;
}
