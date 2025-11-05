# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **stock research platform and portfolio management tool** being built on top of the Mosaic Lite Tailwind React Dashboard Template. The template uses **React 19**, **Tailwind CSS v4**, **Vite 6**, and **Chart.js 4** for data visualization.

## Development Commands

```bash
# Install dependencies (required after cloning)
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## High-Level Architecture

### Tech Stack
- **Build Tool**: Vite 6 (ESM-based, fast HMR)
- **Framework**: React 19 + React Router v7
- **Styling**: Tailwind CSS v4 with PostCSS plugin (@tailwindcss/postcss)
- **Charts**: Chart.js 4.4.1 with chartjs-adapter-moment
- **UI Components**: Radix UI (Popover), React Day Picker
- **Forms**: @tailwindcss/forms plugin

### Directory Structure

```
src/
├── pages/           # Route-level page components (currently only Dashboard.jsx)
├── partials/        # Layout components (Sidebar, Header, Banner)
│   └── dashboard/   # Dashboard-specific card components (DashboardCard01-13.jsx)
├── components/      # Reusable UI components (dropdowns, modals, datepicker)
│   └── ui/          # Radix UI wrapper components
├── charts/          # Chart.js chart components and configuration
├── utils/           # Utility functions and context providers
│   ├── Utils.js         # Formatting helpers (formatValue, formatThousands, etc.)
│   ├── ThemeContext.jsx # Dark mode state management
│   └── Transition.jsx   # CSS transition wrapper
├── css/
│   ├── style.css                    # Main stylesheet with Tailwind v4 theme config
│   └── additional-styles/
│       └── utility-patterns.css     # Custom CSS components (.btn, .form-input, etc.)
└── images/          # Static assets (avatars, icons)
```

### Routing Architecture

**Current State**: Single-page application with only root route (`/`)
- Routing defined in `src/App.jsx` using React Router v7
- Auto-scroll to top on route changes
- Sidebar navigation has been disabled (all links point to `#`) except for the main Dashboard

**Note**: When adding new routes, update both `src/App.jsx` and `src/partials/Sidebar.jsx`

### Tailwind CSS v4 Configuration

The project uses **Tailwind v4** with a modern configuration approach:

- **Configuration Location**: `src/css/style.css` (NOT tailwind.config.js)
- **Custom Theme Variables**: Defined using `@theme` directive with CSS custom properties
- **Color Palette**: violet (primary), sky (secondary), green (success), red (error), yellow (warning), gray (neutral)
- **Custom Variants**:
  - `dark:` for dark mode (via `@custom-variant dark (&:is(.dark *))`
  - `sidebar-expanded:` for sidebar states
- **PostCSS Plugin**: Uses `@tailwindcss/postcss` in `postcss.config.cjs`

### Theme/Dark Mode System

- **Provider**: `ThemeContext.jsx` wraps the app in `main.jsx`
- **State**: Stored in localStorage as `'theme'` ('light' or 'dark')
- **Hook**: `useThemeProvider()` returns `{ currentTheme, changeCurrentTheme }`
- **Implementation**: Adds/removes `.dark` class on `<html>` element
- **Component**: `ThemeToggle.jsx` provides the UI switch

### Chart.js Integration

- **Global Config**: `src/charts/ChartjsConfig.jsx` (imported in App.jsx, runs once)
- **Chart Components**: LineChart01/02, BarChart01/02/03, DoughnutChart, RealtimeChart
- **Theming**: Charts are theme-aware via `useThemeProvider()` hook
- **Data Format**: All charts accept data/labels as props
- **Responsive**: Charts use `width`/`height` props, default to 100% width

### Utility Functions (src/utils/Utils.js)

Key formatting utilities for financial data:
- `formatValue(value)`: Formats currency with USD, compact notation (e.g., "$1.2K")
- `formatThousands(value)`: Formats numbers with K/M suffix
- `getCssVariable(name)`: Retrieves Tailwind color values from DOM
- `adjustColorOpacity(color, opacity)`: Modifies RGBA/HSL/OKLCH colors
- `oklchToRGBA(color)`: Color space conversion for gradients

### Component Patterns

**Dashboard Cards** (partials/dashboard/):
- Self-contained widgets with mock data
- Follow naming convention: `DashboardCard##.jsx`
- Each card can be reused/adapted for stock platform features

**Layout Components** (partials/):
- `Sidebar.jsx`: Collapsible sidebar with localStorage state persistence
- `Header.jsx`: Top navigation with search, notifications, theme toggle, user menu
- Both support `variant` prop for styling variations

**Interactive Components** (components/):
- Use controlled state patterns
- Most dropdowns use `Transition.jsx` wrapper for animations
- Datepicker uses Radix UI Popover + React Day Picker

### State Management

- **No global state library** (Redux, Zustand, etc.)
- Uses React hooks (useState, useContext) and Context API
- localStorage for theme and sidebar state persistence
- Each component manages its own state

## Key Development Notes

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update sidebar navigation in `src/partials/Sidebar.jsx` (change `to="#"` to actual route)
4. Follow existing patterns for layout (use Sidebar + Header components)

### Working with Charts

1. Import the appropriate chart component from `src/charts/`
2. Prepare data in Chart.js format: `{ labels: [], datasets: [] }`
3. Charts automatically adapt to dark mode
4. Use `Utils.js` formatting functions for axis labels and tooltips

### Styling Guidelines

- Use Tailwind utility classes (no custom CSS unless necessary)
- Custom components defined in `src/css/additional-styles/utility-patterns.css`
- Color classes: `text-violet-500`, `bg-gray-800`, `dark:bg-gray-700`
- Responsive: Use `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes
- Dark mode: Always provide dark mode variants with `dark:` prefix

### Form Elements

Pre-styled form classes available:
- `.form-input` - Text inputs
- `.form-select` - Select dropdowns
- `.form-checkbox` - Checkboxes
- `.form-radio` - Radio buttons
- `.form-switch` - Toggle switches
- `.form-textarea` - Textareas

### Git Branch Strategy

- Main development branch: `claude/build-on-template-011CUqBrasdE3JnmAp3MsgqT`
- Always push to this branch
- Branch name matches session ID for tracking

## Stock Platform Specific

This template is being adapted for a **stock research platform and portfolio management tool**. Relevant components:

- **RealtimeChart**: Ideal for live stock price updates
- **LineChart01/02**: Stock price history and trends
- **Tables** (DashboardCard07, Card10): Stock lists, portfolio holdings, watchlists
- **Transaction List** (Card13): Buy/sell history, dividends
- **Datepicker**: Historical data analysis, date range selection
- **DropdownFilter**: Stock screening criteria

When implementing stock features, leverage these existing components rather than building from scratch.
