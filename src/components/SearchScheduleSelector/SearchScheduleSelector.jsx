/**
 * SearchScheduleSelector Component (JSX adaptation)
 * Converted from TypeScript for compatibility with the current project
 */
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Container,
  SelectorRow,
  CalendarIcon,
  DaysGrid,
  DayCell,
  InfoContainer,
  InfoText,
  ResetButton,
  ErrorPopup,
  ErrorIcon,
  ErrorMessage,
} from './SearchScheduleSelector.styles.adapted.js';

/**
 * Days of the week constant - Starting with Sunday (S, M, T, W, T, F, S)
 */
const DAYS_OF_WEEK = [
  { id: '1', singleLetter: 'S', fullName: 'Sunday', index: 0 },
  { id: '2', singleLetter: 'M', fullName: 'Monday', index: 1 },
  { id: '3', singleLetter: 'T', fullName: 'Tuesday', index: 2 },
  { id: '4', singleLetter: 'W', fullName: 'Wednesday', index: 3 },
  { id: '5', singleLetter: 'T', fullName: 'Thursday', index: 4 },
  { id: '6', singleLetter: 'F', fullName: 'Friday', index: 5 },
  { id: '7', singleLetter: 'S', fullName: 'Saturday', index: 6 },
];

export const SearchScheduleSelector = ({
  listing,
  onSelectionChange,
  onError,
  className,
  minDays = 2,
  maxDays = 5,
  requireContiguous = true,
  initialSelection = [],
}) => {
  const [selectedDays, setSelectedDays] = useState(new Set(initialSelection));
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [mouseDownIndex, setMouseDownIndex] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasContiguityError, setHasContiguityError] = useState(false);
  const [listingsCountPartial, setListingsCountPartial] = useState(0);
  const [listingsCountExact, setListingsCountExact] = useState(0);
  const [validationTimeout, setValidationTimeout] = useState(null);

  /**
   * Check if selected days are contiguous (handles wrap-around)
   */
  const isContiguous = useCallback((days) => {
    if (days.size === 0) return true;

    const daysArray = Array.from(days).sort((a, b) => a - b);

    // Check for normal contiguity (no wrap-around)
    let isNormalContiguous = true;
    for (let i = 1; i < daysArray.length; i++) {
      if (daysArray[i] - daysArray[i - 1] !== 1) {
        isNormalContiguous = false;
        break;
      }
    }

    if (isNormalContiguous) return true;

    // Check for wrap-around contiguity
    let gapIndex = -1;
    for (let i = 1; i < daysArray.length; i++) {
      if (daysArray[i] - daysArray[i - 1] > 1) {
        if (gapIndex !== -1) {
          return false;
        }
        gapIndex = i;
      }
    }

    if (gapIndex !== -1) {
      const lastElement = daysArray[daysArray.length - 1];
      const firstElement = daysArray[0];

      if (lastElement === 6 && firstElement === 0) {
        return true;
      }
    }

    return false;
  }, []);

  /**
   * Validate the current selection
   */
  const validateSelection = useCallback(
    (days) => {
      const dayCount = days.size;
      const nightCount = dayCount - 1;

      if (dayCount === 0) {
        return { valid: true };
      }

      if (nightCount < minDays) {
        return {
          valid: false,
          error: `Please select at least ${minDays} night${minDays > 1 ? 's' : ''} per week`,
        };
      }

      if (nightCount > maxDays) {
        return {
          valid: false,
          error: `Please select no more than ${maxDays} night${maxDays > 1 ? 's' : ''} per week`,
        };
      }

      if (requireContiguous && !isContiguous(days)) {
        return {
          valid: false,
          error: 'Please select contiguous days (e.g., Mon-Tue-Wed, not Mon-Wed-Fri)',
        };
      }

      return { valid: true };
    },
    [minDays, maxDays, requireContiguous, isContiguous]
  );

  /**
   * Display error message
   */
  const displayError = useCallback(
    (error) => {
      setErrorMessage(error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);

      if (onError) {
        onError(error);
      }
    },
    [onError]
  );

  /**
   * Handle mouse down - Start tracking for click vs drag
   */
  const handleMouseDown = useCallback((dayIndex) => {
    setMouseDownIndex(dayIndex);
    setDragStart(dayIndex);
  }, []);

  /**
   * Handle mouse enter - If dragging, fill range
   */
  const handleMouseEnter = useCallback(
    (dayIndex) => {
      if (mouseDownIndex !== null && dayIndex !== mouseDownIndex) {
        setIsDragging(true);

        const newSelection = new Set();
        const totalDays = 7;
        const start = mouseDownIndex;

        let dayCount;
        if (dayIndex >= start) {
          dayCount = dayIndex - start + 1;
        } else {
          dayCount = (totalDays - start) + dayIndex + 1;
        }

        for (let i = 0; i < dayCount; i++) {
          const currentDay = (start + i) % totalDays;
          newSelection.add(currentDay);
        }

        setSelectedDays(newSelection);
      }
    },
    [mouseDownIndex]
  );

  /**
   * Handle mouse up - Determine if click or drag
   */
  const handleMouseUp = useCallback(
    (dayIndex) => {
      if (mouseDownIndex === null) return;

      if (!isDragging && dayIndex === mouseDownIndex) {
        // CLICK - Toggle the day
        setSelectedDays(prev => {
          const newSelection = new Set(prev);

          if (newSelection.has(dayIndex)) {
            newSelection.delete(dayIndex);
          } else {
            newSelection.add(dayIndex);
          }

          if (validationTimeout) {
            clearTimeout(validationTimeout);
          }

          const timeout = setTimeout(() => {
            const validation = validateSelection(newSelection);
            if (!validation.valid && validation.error) {
              displayError(validation.error);
            }
          }, 3000);

          setValidationTimeout(timeout);

          return newSelection;
        });
      } else if (isDragging) {
        // DRAG - Validate immediately
        const validation = validateSelection(selectedDays);
        if (!validation.valid && validation.error) {
          displayError(validation.error);
          setSelectedDays(new Set());
        }
      }

      setIsDragging(false);
      setDragStart(null);
      setMouseDownIndex(null);
    },
    [isDragging, mouseDownIndex, selectedDays, validationTimeout, validateSelection, displayError]
  );

  /**
   * Handle reset - clear all selections
   */
  const handleReset = useCallback(() => {
    setSelectedDays(new Set());
    if (validationTimeout) {
      clearTimeout(validationTimeout);
      setValidationTimeout(null);
    }
  }, [validationTimeout]);

  /**
   * Update parent component on selection change
   */
  useEffect(() => {
    if (onSelectionChange) {
      const selectedDaysArray = Array.from(selectedDays).map(
        index => DAYS_OF_WEEK[index]
      );
      onSelectionChange(selectedDaysArray);
    }

    if (selectedDays.size > 1 && requireContiguous) {
      const isValid = isContiguous(selectedDays);
      setHasContiguityError(!isValid);

      if (!isValid) {
        displayError('Please select contiguous days (e.g., Mon-Tue-Wed, not Mon-Wed-Fri)');
      }
    } else {
      setHasContiguityError(false);
    }
  }, [selectedDays, onSelectionChange, requireContiguous, isContiguous, displayError]);

  /**
   * Mock function for counting listings
   */
  useEffect(() => {
    if (selectedDays.size > 0) {
      setListingsCountPartial(Math.floor(Math.random() * 20));
      setListingsCountExact(Math.floor(Math.random() * 10));
    } else {
      setListingsCountPartial(0);
      setListingsCountExact(0);
    }
  }, [selectedDays]);

  return (
    <Container className={className}>
      <SelectorRow>
        <CalendarIcon>
          <img
            src="https://c.animaapp.com/meh6k861XoGXNn/img/calendar-minimalistic-svgrepo-com-202-svg.svg"
            alt="Calendar"
            width="35"
            height="35"
          />
        </CalendarIcon>

        <DaysGrid>
          {DAYS_OF_WEEK.map((day, index) => (
            <DayCell
              key={day.id}
              $isSelected={selectedDays.has(index)}
              $isDragging={isDragging}
              $hasError={hasContiguityError}
              $errorStyle={1}
              onMouseDown={(e) => {
                e.preventDefault();
                handleMouseDown(index);
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseUp={() => handleMouseUp(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              role="button"
              aria-pressed={selectedDays.has(index)}
              aria-label={`Select ${day.fullName}`}
            >
              {day.singleLetter}
            </DayCell>
          ))}
        </DaysGrid>
      </SelectorRow>

      <InfoContainer>
        {selectedDays.size > 0 && (
          <>
            <InfoText>
              {listingsCountExact} exact match{listingsCountExact !== 1 ? 'es' : ''} • {listingsCountPartial} partial match{listingsCountPartial !== 1 ? 'es' : ''}
            </InfoText>
            <ResetButton onClick={handleReset}>Clear selection</ResetButton>
          </>
        )}
      </InfoContainer>

      <AnimatePresence>
        {showError && (
          <ErrorPopup
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </ErrorPopup>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default SearchScheduleSelector;
