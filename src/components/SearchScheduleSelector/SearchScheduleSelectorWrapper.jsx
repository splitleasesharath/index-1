/**
 * SearchScheduleSelectorWrapper - Adapted wrapper for hero section
 * Uses the full SearchScheduleSelector component from the repository
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SearchScheduleSelector } from './SearchScheduleSelector.jsx';

export const SearchScheduleSelectorWrapper = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const selectedDaysRef = useRef([]);

  // Keep ref in sync with state
  useEffect(() => {
    selectedDaysRef.current = selectedDays;
  }, [selectedDays]);

  const handleSelectionChange = useCallback((days) => {
    console.log('Selected days:', days);
    setSelectedDays(days);

    // Update URL parameters
    if (days.length > 0) {
      const daysParam = days
        .map(day => day.index + 1) // Convert 0-indexed to 1-indexed
        .join(', ');

      const url = new URL(window.location);
      url.searchParams.set('days-selected', daysParam);
      window.history.replaceState({}, '', url);
    } else {
      const url = new URL(window.location);
      url.searchParams.delete('days-selected');
      window.history.replaceState({}, '', url);
    }
  }, []);

  const handleError = useCallback((error) => {
    console.error('Selection error:', error);
  }, []);

  // Handle Explore Rentals button click - use ref to avoid dependency on selectedDays
  const handleExploreRentals = useCallback(() => {
    const days = selectedDaysRef.current;
    const daysParam = days
      .map(day => day.index + 1)
      .join(', ');

    const url = `https://app.split.lease/search-split-lease?days-selected=${encodeURIComponent(daysParam)}&weekly-frequency=1`;
    window.open(url, '_blank');
  }, []);

  // Make handleExploreRentals available globally for the button onclick
  useEffect(() => {
    window.exploreRentals = handleExploreRentals;

    return () => {
      delete window.exploreRentals;
    };
  }, [handleExploreRentals]);

  return (
    <SearchScheduleSelector
      onSelectionChange={handleSelectionChange}
      onError={handleError}
      minDays={2}
      maxDays={5}
      requireContiguous={true}
      initialSelection={[1, 2, 3, 4, 5]} // Default Monday-Friday
    />
  );
};

export default SearchScheduleSelectorWrapper;
