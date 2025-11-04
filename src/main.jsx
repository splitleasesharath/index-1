/**
 * Main Entry Point - Island Hydration System
 * Mounts all React Islands on the page
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import island components
import Header from './islands/header.island.jsx';
import Footer from './islands/footer.island.jsx';
import DaySelector from './islands/day-selector.island.jsx';
import SearchScheduleSelector from './islands/search-schedule-selector.island.jsx';

/**
 * Mount a React island component
 * @param {string} selector - CSS selector for mount point
 * @param {React.Component} Component - Component to mount
 */
function mountIsland(selector, Component) {
  const element = document.querySelector(selector);
  if (element) {
    const root = createRoot(element);
    root.render(
      <StrictMode>
        <Component />
      </StrictMode>
    );
    console.log(`✅ Mounted island: ${selector}`);
  } else {
    console.warn(`⚠️ Mount point not found: ${selector}`);
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeIslands);
} else {
  initializeIslands();
}

function initializeIslands() {
  console.log('🚀 Initializing React Islands...');

  // Mount Header island
  mountIsland('[data-island="header"]', Header);

  // Mount Footer island
  mountIsland('[data-island="footer"]', Footer);

  // Mount DaySelector island
  mountIsland('[data-island="day-selector"]', SearchScheduleSelector);

  console.log('✅ All islands initialized');
}
