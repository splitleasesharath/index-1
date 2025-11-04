/**
 * DaySelector Component - Simplified version for hero section
 * Matches the existing Split Lease site styling
 */
import React, { useState, useEffect, useCallback } from 'react';
import './DaySelector.css';

const DAYS_OF_WEEK = [
  { index: 0, letter: 'S', name: 'Sunday' },
  { index: 1, letter: 'M', name: 'Monday' },
  { index: 2, letter: 'T', name: 'Tuesday' },
  { index: 3, letter: 'W', name: 'Wednesday' },
  { index: 4, letter: 'T', name: 'Thursday' },
  { index: 5, letter: 'F', name: 'Friday' },
  { index: 6, letter: 'S', name: 'Saturday' },
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const DaySelector = () => {
  const [selectedDays, setSelectedDays] = useState(new Set([1, 2, 3, 4, 5])); // Default weeknight Mon-Fri

  /**
   * Toggle a day selection
   */
  const toggleDay = useCallback((dayIndex) => {
    setSelectedDays(prev => {
      const newSelection = new Set(prev);

      if (newSelection.has(dayIndex)) {
        newSelection.delete(dayIndex);
      } else {
        newSelection.add(dayIndex);
      }

      return newSelection;
    });
  }, []);

  /**
   * Get check-in and check-out days
   */
  const getCheckInCheckOut = useCallback(() => {
    if (selectedDays.size === 0) return null;

    const sortedDays = Array.from(selectedDays).sort((a, b) => a - b);
    const firstDay = sortedDays[0];
    const lastDay = sortedDays[sortedDays.length - 1];

    return {
      checkIn: DAY_NAMES[firstDay],
      checkOut: DAY_NAMES[(lastDay + 1) % 7], // Next day after last selected
    };
  }, [selectedDays]);

  /**
   * Update URL parameters when selection changes
   */
  useEffect(() => {
    const daysParam = Array.from(selectedDays)
      .sort((a, b) => a - b)
      .map(d => d + 1) // Convert 0-indexed to 1-indexed
      .join(', ');

    if (selectedDays.size > 0) {
      const url = new URL(window.location);
      url.searchParams.set('days-selected', daysParam);
      window.history.replaceState({}, '', url);
    } else {
      const url = new URL(window.location);
      url.searchParams.delete('days-selected');
      window.history.replaceState({}, '', url);
    }
  }, [selectedDays]);

  /**
   * Handle Explore Rentals button click
   */
  const handleExploreRentals = useCallback(() => {
    const daysParam = Array.from(selectedDays)
      .sort((a, b) => a - b)
      .map(d => d + 1)
      .join(', ');

    const url = `https://app.split.lease/search-split-lease?days-selected=${encodeURIComponent(daysParam)}&weekly-frequency=1`;
    window.open(url, '_blank');
  }, [selectedDays]);

  // Make handleExploreRentals available globally for the button onclick
  useEffect(() => {
    window.exploreRentals = handleExploreRentals;

    return () => {
      delete window.exploreRentals;
    };
  }, [handleExploreRentals]);

  const checkInCheckOut = getCheckInCheckOut();

  return (
    <div className="day-selector-container">
      <div className="day-selector">
        <div className="calendar-icon">
          <img
            src="https://c.animaapp.com/meh6k861XoGXNn/img/calendar-minimalistic-svgrepo-com-202-svg.svg"
            alt="Calendar"
            width="35"
            height="35"
          />
        </div>
        {DAYS_OF_WEEK.map(day => (
          <div
            key={day.index}
            className={`day-badge ${selectedDays.has(day.index) ? 'active' : ''}`}
            onClick={() => toggleDay(day.index)}
            role="button"
            aria-pressed={selectedDays.has(day.index)}
            aria-label={`Select ${day.name}`}
          >
            {day.letter}
          </div>
        ))}
      </div>

      {checkInCheckOut && (
        <div className="checkin-checkout" id="checkinCheckout">
          <span><strong>Check-in:</strong> <span id="checkinDay">{checkInCheckOut.checkIn}</span></span>
          <span className="separator">•</span>
          <span><strong>Check-out:</strong> <span id="checkoutDay">{checkInCheckOut.checkOut}</span></span>
        </div>
      )}
    </div>
  );
};

export default DaySelector;
