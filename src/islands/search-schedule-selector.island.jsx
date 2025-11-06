/**
 * SearchScheduleSelector Island - Mount point for SearchScheduleSelector component
 * This island handles the schedule selection functionality in the hero section
 *
 * BRIDGE: Syncs React state with global window.selectedDays for vanilla JS compatibility
 */
import { SearchScheduleSelector } from '../components/SearchScheduleSelector/SearchScheduleSelector.tsx';

/**
 * Island Wrapper - Bridges React component state to global JS
 */
function SearchScheduleSelectorIsland() {
  const handleSelectionChange = (selectedDaysArray) => {
    // Convert Day objects to zero-based indices
    const dayIndices = selectedDaysArray.map(day => day.index);

    // Update global selectedDays variable for vanilla JS functions
    window.selectedDays = dayIndices;

    // Log for debugging
    console.log('🔗 Day selection synced to global:', dayIndices);
  };

  return (
    <SearchScheduleSelector
      onSelectionChange={handleSelectionChange}
      minDays={2}
      maxDays={5}
      requireContiguous={true}
    />
  );
}

export default SearchScheduleSelectorIsland;
