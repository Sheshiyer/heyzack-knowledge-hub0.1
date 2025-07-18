# DASHBOARD COMPLETE REBUILD TODO

## Project Overview
Complete rebuild of HeyZack Knowledge Hub dashboard with modern floating navigation, glass-morphism design, and reusable component architecture.

## Architecture Goals
- Floating left navigation panel with glass-morphism effects
- Modern purple-pink gradient design system
- Reusable component library for all pages
- Responsive design with mobile-first approach
- Clean separation of concerns

## In Progress

## Completed (move to memory.md)



## PRIORITY 0: CRITICAL ROUTING FIXES (Immediate) ✅ COMPLETED

### Task 0.1: Fix RecentDocs Component ✅
- **Issue**: Uses hardcoded mock data with invalid routes
- **Action**: Replace with real data from DocumentService
- **Files**: `src/components/dashboard/RecentDocs.tsx`
- **Expected**: Dynamic loading of recent documents with valid routes
- **Status**: ✅ COMPLETED - Now dynamically loads 5 most recent documents from DocumentService

### Task 0.2: Fix CategoryGrid Component ✅
- **Issue**: Uses hardcoded categories with incorrect routes
- **Action**: Replace with real data from DocumentService.getAvailableCategories()
- **Files**: `src/components/dashboard/CategoryGrid.tsx`
- **Expected**: Dynamic categories with proper routing
- **Status**: ✅ COMPLETED - Now dynamically loads categories with document counts

### Task 0.3: Audit and Remove Unused Routes ✅
- **Issue**: Multiple routes referenced that don't exist
- **Action**: Remove all references to non-existent routes
- **Files**: All navigation components, link components
- **Expected**: Only valid routes remain in UI
- **Status**: ✅ COMPLETED - Removed invalid routes from categories page Quick Access

### Task 0.4: Update Navigation and Links ✅
- **Issue**: Broken links throughout the application
- **Action**: Update all href attributes to point to valid routes
- **Files**: All components with Link or href usage
- **Expected**: All navigation works correctly
- **Status**: ✅ COMPLETED - Updated homepage stats to use real data, fixed all navigation links

### Task 0.5: Update Homepage Statistics ✅
- **Issue**: Homepage shows hardcoded document counts and stats
- **Action**: Replace with real data from DocumentService.getStats()
- **Files**: `src/app/page.tsx`
- **Expected**: Dynamic stats showing actual document counts and last updated time
- **Status**: ✅ COMPLETED - Homepage now shows real document statistics with loading states

## Pending Tasks

### Phase 0: Cloudflare Infrastructure Migration (PRIORITY)
- [ ] Install and configure Wrangler CLI for Cloudflare Workers
- [ ] Set up Cloudflare KV namespace for document metadata and caching
- [ ] Create Cloudflare Worker for document discovery API (/api/documents/discover)
- [ ] Migrate document indexing logic to Cloudflare Workers
- [ ] Set up Cloudflare Pages deployment configuration
- [ ] Configure GitHub integration for automatic deployments
- [ ] Migrate search functionality to use KV storage for performance
- [ ] Update frontend to use Cloudflare Workers endpoints
- [ ] Deploy to Cloudflare Pages via CLI (wrangler pages deploy)
- [ ] Configure custom domain and SSL settings
- [ ] Set up environment variables and secrets in Cloudflare
- [ ] Test auto-refresh functionality with KV Workers

### Phase 1: Core Architecture & Design System
- [ ] Create new design system with CSS variables and Tailwind config
- [ ] Build floating navigation component with glass effects
- [ ] Create reusable UI components (cards, buttons, inputs)
- [ ] Implement gradient background system
- [ ] Set up responsive breakpoints and spacing system

### Phase 2: Layout Components
- [ ] Rebuild DashboardLayout with floating navigation
- [ ] Create new Header component with search and user actions
- [ ] Build responsive sidebar with collapse/expand functionality
- [ ] Implement mobile navigation overlay
- [ ] Add navigation state management

### Phase 3: Dashboard Pages
- [ ] Rebuild main dashboard page with new design
- [ ] Create statistics cards with glass effects
- [ ] Build search interface with modern styling
- [ ] Implement category browser with floating cards
- [ ] Add recent documents section

### Phase 4: Navigation & Routing
- [ ] Create navigation items configuration
- [ ] Implement active state management
- [ ] Build breadcrumb system
- [ ] Add page transitions and animations
- [ ] Set up routing structure

### Phase 5: Search & Browse Components
- [ ] Rebuild search interface with glass design
- [ ] Create advanced search with filters
- [ ] Build category browser with grid layout
- [ ] Implement document listing components
- [ ] Add search result highlighting

### Phase 6: Document Components
- [ ] Rebuild document viewer with new design
- [ ] Create document list with modern cards
- [ ] Implement document navigation
- [ ] Add document metadata display
- [ ] Build document actions toolbar

### Phase 7: Polish & Optimization
- [ ] Add loading states and skeletons
- [ ] Implement error boundaries
- [ ] Add accessibility features
- [ ] Optimize performance and bundle size
- [ ] Add animations and micro-interactions

### Phase 8: Visual Pricing Calculator Implementation
- [x] Create pricing calculator page route (/pricing-calculator)
- [x] Add Calculator icon to FloatingNav navigation menu
- [x] Build PricingCalculator main component with three-column layout
- [x] Implement Inputs section with cost and shipping fee inputs
- [x] Create Price Selection section with VIP price and MSRP inputs
- [x] Build Final Breakdowns section with revenue, cost, and profit details
- [x] Add real-time calculation logic based on CSV product data
- [x] Implement form validation and error handling
- [x] Create responsive design for mobile and tablet views
- [x] Add export functionality for pricing calculations
- [x] Integrate with HeyZack product data from CSV
- [x] Add save/load pricing scenarios functionality
- [x] Implement glass-morphism design matching dashboard theme
- [ ] Add tooltips and help text for calculator fields
- [x] Create pricing templates for different kit types (Studio, Family, Villa)

### Phase 9: Testing & Documentation
- [ ] Test responsive design across devices
- [ ] Verify accessibility compliance
- [ ] Create component documentation
- [ ] Add TypeScript type definitions
- [ ] Final testing and bug fixes

## Completed (move to memory.md)
- [DONE] ~~Fix CSS compilation errors causing white screen~~
- [DONE] ~~Restore full dashboard functionality with all components~~
- [DONE] ~~Build floating navigation component with glass effects~~
- [DONE] ~~Create new design system with CSS variables and Tailwind config~~
- [DONE] ~~Fix ESLint errors preventing production build~~
- [DONE] ~~Initial planning and architecture review~~
- [DONE] ~~Create multiple Kickstarter kit concepts with pricing strategies~~
- [x] **Task 1.2**: Create route pages for new navigation items
  - [x] `/business-strategy` page
  - [x] `/technical-docs` page
  - [x] `/market-research` page
  - [x] `/strategic-analysis` page
  - [x] `/reference-materials` page
- [x] **Task 1.3**: Update main dashboard page to reflect HeyZack's smart home AI business focus
- [x] **Task 2.1**: Create basic document reader infrastructure
    - [x] Update document loading to use real markdown files from data-sources
    - [x] Create simplified document viewer component
    - [x] Implement basic markdown rendering
    - [x] Add document metadata display (title, category, last modified, etc.)

## Design Specifications

### Color Palette
- Primary: Purple-pink gradient (#8B5CF6 to #EC4899)
- Background: Dark gradient with glass effects
- Text: White with opacity variations
- Accents: Blue, purple, pink tones

### Component Architecture
```
src/components/
├── ui/                    # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   └── Avatar.tsx
├── layout/               # Layout components
│   ├── AppLayout.tsx
│   ├── FloatingNav.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
├── dashboard/            # Dashboard-specific components
│   ├── StatsCards.tsx
│   ├── SearchSection.tsx
│   ├── CategoryGrid.tsx
│   └── RecentDocs.tsx
├── navigation/           # Navigation components
│   ├── NavItem.tsx
│   ├── NavGroup.tsx
│   └── Breadcrumb.tsx
└── features/            # Feature-specific components
    ├── search/
    ├── documents/
    └── categories/
```

### Key Features
- Floating navigation with glass-morphism
- Responsive design (mobile-first)
- Dark theme with gradients
- Smooth animations and transitions
- Modern typography and spacing
- Accessible design patterns