# React Islands Migration Plan

## Project Overview
Modernize Split Lease website from vanilla HTML/CSS/JS to ES Modules + React Islands architecture using Vite, while preserving all existing functionality.

## Architecture Goals
1. **React Islands**: Interactive components as isolated React islands
2. **Plain HTML**: Static content remains as HTML templates
3. **ES Modules**: Modern module system (no UMD)
4. **Vite Build**: Fast development and optimized production builds
5. **Zero Functionality Loss**: 100% feature parity with current implementation
6. **Component Reusability**: Shared components, no code duplication

## Current State Analysis

### Interactive Components (React Islands)
1. **Header** (~150 lines HTML, ~200 lines JS)
   - Navigation dropdowns (Host/Guest menus)
   - Auth buttons (Sign In/Sign Up)
   - Mobile hamburger menu
   - Scroll behavior

2. **DaySelector** (~50 lines HTML, ~300 lines JS)
   - Calendar icon + 7 day badges (S M T W T F S)
   - Toggle selection logic
   - Check-in/check-out display
   - URL parameter sync
   - Continuity validation

3. **ScheduleCards** (~60 lines HTML per card, ~100 lines JS)
   - Lottie animations
   - Animation controls (play/pause/stop)
   - Explore buttons with preset days

4. **PropertyCard** (~20 lines HTML per card, ~50 lines JS)
   - Listing image and details
   - Click handler for property navigation
   - Dynamic property ID routing

5. **Footer** (~130 lines HTML, ~150 lines JS)
   - Referral form (text/email)
   - Import listing form
   - Multi-column navigation
   - Form validation and API calls

6. **ChatWidget** (~30 lines HTML, ~100 lines JS)
   - Floating chat interface
   - Open/close functionality
   - Message display

7. **ModalSystem** (~50 lines HTML, ~200 lines JS)
   - Auth modal (redirects to app.split.lease)
   - Market Research modal
   - Iframe management
   - Intent-based preloading

8. **ToastNotification** (~0 lines HTML, ~50 lines JS)
   - Global notification system
   - Auto-dismiss functionality

9. **FloatingBadge** (~40 lines HTML, ~100 lines JS)
   - Market research badge
   - Click handler
   - Visibility logic

### Static Sections (Plain HTML)
1. **Hero Content** - Title, subtitle (non-interactive parts)
2. **Value Propositions** - 4 static cards with icons
3. **Benefits Section** - Checklist with CTA
4. **Support Section** - 2 static cards with links
5. **App Download** - iOS app + Alexa skill sections
6. **Footer Bottom** - Terms, copyright

## New Project Structure

```
index-1/
├── public/
│   ├── assets/
│   │   └── images/          # Static images
│   └── index.html           # HTML template (minimal, mounts islands)
│
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.module.css
│   │   │   ├── NavDropdown.jsx
│   │   │   └── MobileMenu.jsx
│   │   │
│   │   ├── DaySelector/
│   │   │   ├── DaySelector.jsx
│   │   │   ├── DaySelector.module.css
│   │   │   ├── DayBadge.jsx
│   │   │   └── CheckInOut.jsx
│   │   │
│   │   ├── ScheduleCards/
│   │   │   ├── ScheduleCard.jsx
│   │   │   ├── ScheduleCard.module.css
│   │   │   └── LottieAnimation.jsx
│   │   │
│   │   ├── PropertyCard/
│   │   │   ├── PropertyCard.jsx
│   │   │   └── PropertyCard.module.css
│   │   │
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.module.css
│   │   │   ├── ReferralForm.jsx
│   │   │   └── ImportForm.jsx
│   │   │
│   │   ├── Modals/
│   │   │   ├── MarketResearchModal.jsx
│   │   │   ├── MarketResearchModal.module.css
│   │   │   └── IframeLoader.jsx
│   │   │
│   │   ├── ChatWidget/
│   │   │   ├── ChatWidget.jsx
│   │   │   └── ChatWidget.module.css
│   │   │
│   │   ├── FloatingBadge/
│   │   │   ├── FloatingBadge.jsx
│   │   │   └── FloatingBadge.module.css
│   │   │
│   │   └── Toast/
│   │       ├── Toast.jsx
│   │       ├── Toast.module.css
│   │       └── ToastContainer.jsx
│   │
│   ├── islands/             # Island mount points
│   │   ├── header.island.jsx
│   │   ├── hero-day-selector.island.jsx
│   │   ├── schedule-cards.island.jsx
│   │   ├── property-listings.island.jsx
│   │   ├── footer.island.jsx
│   │   ├── chat-widget.island.jsx
│   │   ├── modals.island.jsx
│   │   ├── floating-badge.island.jsx
│   │   └── toast.island.jsx
│   │
│   ├── utils/               # Shared utilities
│   │   ├── urlManager.js    # URL parameter handling
│   │   ├── dayValidator.js  # Day continuity logic
│   │   ├── authManager.js   # Auth state management
│   │   └── constants.js     # URL_LOCK, property IDs, etc.
│   │
│   ├── styles/              # Global styles
│   │   ├── global.css       # Base styles
│   │   ├── variables.css    # CSS custom properties
│   │   └── static.css       # Static section styles
│   │
│   └── main.jsx             # Entry point - mounts all islands
│
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
├── .gitignore
└── README.md

```

## Implementation Phases

### Phase 1: Setup & Configuration
**Tasks:**
1. Initialize Vite project with React
2. Configure Vite for multi-entry points (island architecture)
3. Set up CSS Modules
4. Install dependencies (React, @lottiefiles/lottie-player, etc.)
5. Create base project structure

**Validation:**
- Run `npm run dev` successfully
- Verify hot module replacement works
- Build process produces optimized bundles

### Phase 2: Extract Header Component
**Tasks:**
1. Create `Header.jsx` with navigation structure
2. Extract `NavDropdown.jsx` for reusable dropdown logic
3. Create `MobileMenu.jsx` for hamburger menu
4. Port styles to `Header.module.css`
5. Create `header.island.jsx` mount point
6. Test dropdown interactions, mobile menu, auth buttons

**Validation with Playwright:**
```javascript
// Test dropdown functionality
await page.goto('http://localhost:5173');
await page.click('.dropdown-trigger');
await expect(page.locator('.dropdown-menu')).toBeVisible();

// Test mobile menu
await page.setViewportSize({ width: 375, height: 667 });
await page.click('.hamburger-menu');
await expect(page.locator('.nav-center')).toHaveClass(/mobile-active/);
```

### Phase 3: Extract DaySelector Component
**Tasks:**
1. Create `DaySelector.jsx` with state management
2. Extract `DayBadge.jsx` for individual day buttons
3. Create `CheckInOut.jsx` for display logic
4. Port day validation logic to `dayValidator.js` utility
5. Port URL sync logic to `urlManager.js`
6. Create `hero-day-selector.island.jsx` mount point

**Validation with Playwright:**
```javascript
// Test day selection
await page.click('[data-day="1"]'); // Click Monday
await expect(page.locator('[data-day="1"]')).toHaveClass(/active/);
await expect(page.url()).toContain('days-selected=2');

// Test continuity validation
await page.click('[data-day="0"]'); // Sunday
await page.click('[data-day="3"]'); // Wednesday (non-continuous)
await expect(page.locator('#checkinCheckout')).toContainText('continuous');
```

### Phase 4: Extract ScheduleCards Component
**Tasks:**
1. Create `ScheduleCard.jsx` with Lottie integration
2. Extract `LottieAnimation.jsx` for player logic
3. Port animation control logic
4. Create `schedule-cards.island.jsx` mount point
5. Handle explore button redirects

**Validation with Playwright:**
```javascript
// Test Lottie animations load
await expect(page.locator('lottie-player').first()).toBeVisible();

// Test explore button redirects
await page.click('.explore-btn >> text=weeknight');
await expect(page).toHaveURL(/days-selected=2,3,4,5,6/);
```

### Phase 5: Extract PropertyCard & Footer
**Tasks:**
1. Create `PropertyCard.jsx` with click handlers
2. Create `Footer.jsx` with all columns
3. Extract `ReferralForm.jsx` with validation
4. Extract `ImportForm.jsx` with API integration
5. Create mount points for both islands

**Validation with Playwright:**
```javascript
// Test property card click
await page.click('.listing-card >> nth=0');
await expect(page).toHaveURL(/view-split-lease\/1586447992720x748691103167545300/);

// Test referral form
await page.check('input[value="email"]');
await page.fill('.referral-input', 'test@example.com');
await page.click('.share-btn');
await expect(page.locator('.share-btn')).toHaveText('Sending...');
```

### Phase 6: Extract Modal System & Supporting Components
**Tasks:**
1. Create `MarketResearchModal.jsx` with iframe management
2. Create `ChatWidget.jsx` with open/close logic
3. Create `FloatingBadge.jsx` with visibility management
4. Create `Toast.jsx` notification system
5. Port `IframeLoader` intent detection logic
6. Create mount points for all modals

**Validation with Playwright:**
```javascript
// Test market research modal
await page.click('.floating-badge');
await expect(page.locator('#marketResearchModal')).toHaveClass(/active/);
await expect(page.locator('#marketResearchIframe')).toBeVisible();

// Test chat widget
// (simulate chat open via support card)
await page.click('.support-card >> text=Chat');
await expect(page.locator('#chat-widget')).toHaveClass(/active/);
```

### Phase 7: Migrate Static Sections
**Tasks:**
1. Convert hero static content to HTML template
2. Convert value propositions to HTML
3. Convert benefits section to HTML
4. Convert app download section to HTML
5. Style all static sections with `static.css`

**Validation:**
- Visual regression testing with Playwright screenshots
- Verify all static content renders correctly
- Check responsive breakpoints

### Phase 8: Island Hydration System
**Tasks:**
1. Create `main.jsx` entry point
2. Implement island mount logic using `data-island` attributes
3. Set up React root rendering for each island
4. Ensure islands are isolated (no shared state except URLs)
5. Handle edge cases (multiple instances of same component)

**Example Island Mount:**
```jsx
// main.jsx
import { createRoot } from 'react-dom/client';
import Header from './islands/header.island';
import DaySelector from './islands/hero-day-selector.island';

// Mount Header island
const headerEl = document.querySelector('[data-island="header"]');
if (headerEl) {
  createRoot(headerEl).render(<Header />);
}

// Mount DaySelector island
const daySelectorEl = document.querySelector('[data-island="hero-day-selector"]');
if (daySelectorEl) {
  createRoot(daySelectorEl).render(<DaySelector />);
}
```

### Phase 9: Build Optimization
**Tasks:**
1. Configure Vite code splitting for islands
2. Set up lazy loading for heavy components (Lottie)
3. Optimize bundle size (tree shaking, minification)
4. Configure production build for GitHub Pages
5. Set up asset optimization (images, fonts)

**Vite Config Example:**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lottie': ['@lottiefiles/lottie-player'],
        },
      },
    },
  },
};
```

### Phase 10: Testing & Validation
**Tasks:**
1. Run full Playwright test suite
2. Test all interactive features
3. Validate URL parameter handling
4. Test mobile responsiveness
5. Check auth flow (redirects to app.split.lease)
6. Verify all property IDs and redirects
7. Test form submissions (referral, import)
8. Performance testing (Lighthouse)

**Playwright Test Structure:**
```javascript
describe('Split Lease Clone - Full Suite', () => {
  test('Header navigation and dropdowns', async ({ page }) => { ... });
  test('Day selector with URL sync', async ({ page }) => { ... });
  test('Schedule cards and explore buttons', async ({ page }) => { ... });
  test('Property listings redirect', async ({ page }) => { ... });
  test('Footer forms (referral & import)', async ({ page }) => { ... });
  test('Modal system (auth & market research)', async ({ page }) => { ... });
  test('Mobile responsive behavior', async ({ page }) => { ... });
  test('Performance (PageSpeed)', async ({ page }) => { ... });
});
```

### Phase 11: Git Workflow & Deployment
**Tasks:**
1. Commit each phase individually (atomic commits)
2. Update CLAUDE.md changelog after each phase
3. Test GitHub Pages deployment
4. Verify production build works correctly
5. Update README.md with new architecture

**Git Workflow:**
```bash
# After each phase
git add [modified files]
git commit -m "Phase N: [Description] - React Islands migration"
git push origin main
```

## Key Technical Decisions

### 1. Island Hydration Strategy
- Use `data-island` attributes in HTML to mark mount points
- Each island is independently hydrated (no shared React context)
- Islands communicate via URL parameters and custom events

### 2. State Management
- **Local State**: React useState/useReducer within islands
- **Shared State**: URL parameters (days-selected, weekly-frequency)
- **Persistence**: localStorage for auth, preferences
- **No Redux**: Keep it simple, islands are mostly isolated

### 3. Styling Approach
- **CSS Modules**: Component-scoped styles
- **Global CSS**: Static sections, CSS variables
- **No CSS-in-JS**: Maintain existing CSS patterns
- **Responsive**: Preserve all media queries

### 4. Component Reusability
- **DaySelector**: Can be mounted multiple times if needed
- **PropertyCard**: Used in grid, each card is independent
- **Toast**: Global singleton, only one instance
- **Header/Footer**: Single instance per page

### 5. Backward Compatibility
- Preserve all `onclick` handlers during migration
- Maintain all global functions (openAuthModal, toggleDay, etc.)
- Keep URL_LOCK mechanism intact
- Preserve all property IDs and redirect URLs

## Risk Mitigation

### High-Risk Areas
1. **Day Selector Logic**: Complex continuity validation and URL sync
   - **Mitigation**: Extract to utility first, test thoroughly

2. **Lottie Animations**: External dependency, may break
   - **Mitigation**: Test all three schedule cards after extraction

3. **Iframe Management**: Cross-origin auth detection
   - **Mitigation**: Preserve exact iframe logic, test with Playwright

4. **URL Parameter Handling**: Critical for property redirects
   - **Mitigation**: Create comprehensive URL manager utility with tests

### Testing Strategy
- **Unit Tests**: Utility functions (dayValidator, urlManager)
- **Component Tests**: React Testing Library for islands
- **E2E Tests**: Playwright for full user flows
- **Visual Regression**: Playwright screenshots before/after

## Success Criteria

### Functional Parity
- ✅ All interactive features work identically to current site
- ✅ URL parameters match original format exactly
- ✅ Property redirects use correct IDs
- ✅ Day selection validation matches original logic
- ✅ Forms submit to correct endpoints
- ✅ Modals and iframes behave identically

### Performance Goals
- ✅ PageSpeed score >= current implementation
- ✅ First Contentful Paint <= 1.5s
- ✅ Time to Interactive <= 3s
- ✅ Bundle size < 500KB (gzipped)

### Code Quality
- ✅ No duplicate code between islands
- ✅ All components are reusable
- ✅ Clean separation of concerns
- ✅ Proper TypeScript types (optional, can add later)
- ✅ Comprehensive test coverage

### Maintainability
- ✅ Clear component hierarchy
- ✅ Well-documented code
- ✅ Updated CLAUDE.md with new architecture
- ✅ Easy to add new islands
- ✅ Simple deployment process

## Rollback Plan
If migration fails at any phase:
1. Git revert to last working commit
2. Document issues in CLAUDE.md
3. Fix root cause before proceeding
4. Re-run affected Playwright tests

## Timeline Estimate
- **Phase 1**: 2 hours (setup)
- **Phase 2**: 3 hours (Header)
- **Phase 3**: 4 hours (DaySelector - most complex)
- **Phase 4**: 2 hours (ScheduleCards)
- **Phase 5**: 3 hours (PropertyCard + Footer)
- **Phase 6**: 3 hours (Modals + supporting)
- **Phase 7**: 2 hours (Static sections)
- **Phase 8**: 2 hours (Island hydration)
- **Phase 9**: 2 hours (Build optimization)
- **Phase 10**: 4 hours (Full testing)
- **Phase 11**: 1 hour (Git workflow)

**Total**: ~28 hours (3-4 days with validation cycles)

## Notes
- This migration preserves 100% of existing functionality
- No feature additions or design changes
- Focus is on maintainability and modern architecture
- All original URLs, IDs, and parameters are preserved
- Git commits happen after each phase with full validation
