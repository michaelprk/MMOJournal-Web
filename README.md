# MMOJournal-Web

MMOJournal-Web is the web-based evolution of the MMOJournal CLI app — a personal tracker and journal designed for PokeMMO players. This project demonstrates full-stack development capabilities while building a comprehensive tool to manage competitive Pokémon builds, shiny hunts, and gameplay progression with a clean, user-friendly interface.

## 🚀 Implemented Features

### ✅ **Competitive Pokémon Build Management**
- **Full CRUD Operations**: Complete data management for Pokémon builds with add, edit, delete, and view functionality
- **Pokemon Build Cards**: Responsive card displays featuring sprites, stats, moves, abilities, and items
- **Tier Filtering**: Dynamic filtering system for competitive tiers (OU, UU, Doubles, RU, NU, LC)
- **Advanced Sorting**: Sort builds by tier, name, type, newest, or oldest with intuitive dropdown interface
- **Sticky Utility Bar**: Fixed navigation bar with tier filtering and add Pokemon options that stays visible while scrolling
- **Optimized Layout**: Proper spacing and positioning ensuring no overlap between navigation elements
- **Card Navigation**: Intuitive tab navigation between main view, stats, and moves with forward/back arrows

### ✅ **Team Management System**
- **Team Organization**: Group Pokemon builds into teams with unique team IDs and names
- **Team View**: Dedicated team showcase page displaying organized teams with detailed Pokemon information
- **Team Manager**: Interactive team creation and management with drag-and-drop functionality
- **Team Export**: Export entire teams to Pokemon Showdown format with batch export capabilities
- **Team Navigation**: Seamless navigation between individual builds and team collections

### ✅ **Export & Import System**
- **Pokemon Showdown Export**: Export individual Pokemon or entire teams to Showdown format
- **Copy to Clipboard**: One-click copying with visual feedback and fallback support
- **Modal Interface**: Clean, focused export modal with syntax highlighting and easy selection
- **Batch Operations**: Export multiple Pokemon or complete teams simultaneously
- **Format Validation**: Ensures exported data is compatible with Pokemon Showdown

### ✅ **Enhanced UI/UX Design**
- **Multiple View Modes**: Switch between card view, list view, and team view
- **Responsive Layout**: Cards scroll cleanly underneath navigation without obstruction
- **Build Count Display**: Total build count shown at bottom of card list for better organization
- **Consistent Spacing**: Proper margins and padding throughout the application
- **Visual Hierarchy**: Clear separation between navigation, content, and supplementary information
- **Interactive Elements**: Hover effects, transitions, and visual feedback for all interactions

### ✅ **Enhanced Item & Image System**
- **Local Item Images**: 32+ competitive item images stored locally for instant loading
- **Generation 6-9 Coverage**: Complete support for modern competitive items including Covert Cloak, Loaded Dice, Heavy-Duty Boots
- **Smart Fallback System**: Local images with external URL fallbacks for maximum reliability
- **Performance Optimized**: Zero network requests for item images - 100% offline ready

### ✅ **Advanced Showdown Integration**
- **Gender Support**: Full (M)/(F) gender parsing and display with gender icons
- **Improved Parser**: Enhanced Showdown format parsing with better error handling
- **Team Import**: Batch import functionality with automatic gender detection and species separation
- **Export Compatibility**: Generate Showdown-compatible team strings with proper formatting
- **Bidirectional Support**: Import from Showdown and export back to Showdown seamlessly

### ✅ **PokeAPI Integration** 
- **Real-time Data**: Fetch official Pokémon data including sprites, moves, abilities, and types
- **Autocomplete**: Smart suggestions for Pokémon names, moves, and items during input
- **Move Type Colors**: Dynamic color-coded moves with animated gradients for all 18 types
- **Expanded Item Database**: 1000+ items from all generations with proper mapping
- **Data Caching**: Efficient caching system for improved performance and reduced API calls

### ✅ **Full Backend Implementation**
- **Node.js/Express API**: RESTful endpoints for all CRUD operations
- **SQLite Database**: Lightweight database with Prisma ORM for type-safe queries
- **Data Validation**: Server-side validation for IV/EV limits and Pokémon data integrity
- **PokeAPI Proxy**: Backend integration with PokeAPI for cached data retrieval
- **Team Management**: Backend support for team creation, updating, and organization

### ✅ **Modern Navigation & Routing**
- **React Router v7**: Latest routing system with improved navigation performance
- **Fixed Navigation**: Resolved routing conflicts and navigation issues between pages
- **Seamless Transitions**: Smooth page transitions without overlap or layout issues
- **TypeScript**: Full type safety across frontend and backend
- **Multi-page Support**: Dedicated pages for builds, teams, and specialized views

## 🆕 Recent Development Progress

> Note for Shiny Hunts FK: After merging changes that include `app/db/sql/shiny_hunts_fk_cascade.sql`, run that SQL file in the Supabase SQL Editor to switch `parent_hunt_id` foreign key to `ON DELETE CASCADE` so deleting a parent hunt removes its phases.

### **Shiny Hunt Calendar & Showcase** (New)
- Calendar month grid now shows actual shiny sprites + species names, with a PHASE badge for phase entries.
- Hover details use a shared anchored popover that stays interactive and positions within the viewport.
- Clicking a tile opens the edit modal.

### **Showcase Hover Stability** (New)
- Hover popup is anchored to each tile and no longer jumps off-screen; remains interactive without losing hover.

### **Validation & Data Canonicalization** (New)
- Added canonicalization for encounter methods (e.g., Single/Lures, Fishing, Horde) and improved validator logic for cave/grass/surf/water labeling mismatches.
- Scripted audit to verify all method/location combos and DB rows with `npm run audit:hunts`.
- Specific fixes verified: Beldum/Hoenn/Meteor Falls, Larvesta/Unova/Relic Castle, Bagon Single/Lures.

### **Export Modal (Teams)** (New)
- Export modal portals to `document.body`, locks background scroll, and renders above utility bars and headers for clean presentation.

### **Background Visuals** (New)
- App-wide animated background video (`public/images/Snowpoint.mp4`) with muted audio and darkened/blurred styling to preserve the dark+yellow aesthetic.

### **Team Management & Organization** (Latest)
- **Team Creation**: Create and manage teams with unique identifiers and names
- **Team View Page**: Dedicated showcase page for displaying organized teams
- **Team Manager Component**: Interactive interface for team building and organization
- **Team Export**: Export complete teams to Pokemon Showdown format
- **Team Navigation**: Seamless switching between individual builds and team collections

### **Export & Import Enhancements**
- **Modal Export System**: Clean, focused export interface with syntax highlighting
- **Clipboard Integration**: One-click copying with visual feedback and error handling
- **Batch Export**: Export multiple Pokemon or entire teams simultaneously
- **Format Compatibility**: Ensures exported data works seamlessly with Pokemon Showdown

### **Advanced Sorting & Filtering**
- **Multi-criteria Sorting**: Sort by tier, name, type, creation date (newest/oldest)
- **Type-based Sorting**: Intelligent sorting by Pokemon types (placeholder for future type data integration)
- **Tier Organization**: Logical tier ordering (OU → UU → Doubles → RU → NU → LC)
- **Date Sorting**: Sort by creation date for chronological organization

### **UI/UX Improvements**
- **View Toggle System**: Switch between card view, list view, and team view
- **Responsive Design**: Optimized layouts for different screen sizes and content types
- **Interactive Feedback**: Hover effects, transitions, and visual confirmation for all actions
- **Modal System**: Consistent modal design patterns across all popup interfaces

### **Backend Enhancements**
- **Team Data Management**: Database schema and API endpoints for team organization
- **Enhanced Validation**: Improved server-side validation for team and build data
- **Performance Optimization**: Efficient queries and data fetching for team operations
- **Error Handling**: Comprehensive error handling and user feedback systems

## 🎯 Development Goals

### 🔄 **Next Steps**
- **Journal System**: Rich text journaling with media uploads and tagging
- **Shiny Hunt Tracker**: Complete implementation with sprites, progress tracking, and portfolio management
- **User Authentication**: Login and account creation system
- **Personal Collections**: User-specific build management and privacy controls

### 📋 **Planned Features**
- **Enhanced Shiny Hunt System**: Sprite integration, progress tracking, and portfolio showcase
- **Progress Journal**: Rich text journaling with media uploads and gameplay stories
- **AI Team Suggestions**: Smart team building recommendations and synergy analysis
- **Community Features**: Share builds, comment on teams, and social interaction
- **Advanced Filtering**: Search by moves, abilities, stats, and custom criteria
- **Theme Customization**: Dark/light modes and personalized UI preferences
- **Mobile Optimization**: Enhanced mobile experience with touch-friendly interfaces

## 🛠️ Built With

### **Frontend**
- **React Router v7** - Modern SPA navigation and routing
- **TypeScript** - Type-safe JavaScript development
- **CSS-in-JS** - Component-scoped styling with React
- **Vite** - Fast development and build tooling

### **Backend**
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web framework for API development
- **SQLite** - Lightweight, file-based database
- **Prisma** - Modern ORM with type safety and migrations

### **External APIs**
- **PokeAPI** - Official Pokémon data and sprites
- **Pokémon Showdown** - Team format parsing and compatibility

## 📦 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Git

### **Installation**

```bash
# Clone the repository
git clone https://github.com/michaelprk/MMOJournal-Web.git
cd MMOJournal-Web

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Set up the database
npx prisma migrate dev
```

### **Development**

```bash
# Start the backend server (from /backend directory)
npm start
# Server runs on http://localhost:4000

# Start the frontend dev server (from root directory)
npm run dev
# Frontend runs on http://localhost:5173
```

### **API Endpoints**

The backend provides the following endpoints:

- `GET /api/pokemon-builds` - Fetch all Pokémon builds
- `POST /api/pokemon-builds` - Create a new build
- `GET /api/pokemon-builds/:id` - Get specific build
- `PATCH /api/pokemon-builds/:id` - Update a build
- `DELETE /api/pokemon-builds/:id` - Delete a build
- `GET /api/pokeapi/*` - Proxy to PokeAPI

## 🎮 Demonstration Features

1. **Browse Builds**: View competitive Pokémon collection with filtering options via sticky utility bar
2. **Add New Pokémon**: Use the dropdown in utility bar for manual form or Showdown import
3. **Edit Builds**: Click edit on any card to modify stats, moves, or details
4. **Filter by Tier**: Use the tier dropdown in utility bar to view builds by competitive tier
5. **Sort & Organize**: Sort builds by multiple criteria and organize into teams
6. **Team Management**: Create, view, and manage teams with the dedicated team system
7. **Export Functionality**: Export individual Pokemon or entire teams to Showdown format
8. **View Modes**: Switch between card view, list view, and team view for different perspectives
9. **Import Teams**: Paste entire teams from Showdown for quick batch import

## 🤝 Contributing

This is a personal development project and learning showcase. Contributions, feedback, and suggestions are welcome!

### **Areas for Contribution**
- UI/UX improvements and accessibility
- Additional Pokémon format support
- Performance optimizations
- Testing and bug fixes
- Documentation improvements

## 📜 License

MIT License — free to use and modify.

---

**Note**: This project showcases full-stack development skills while creating a tool specifically designed for PokeMMO players, though it can be adapted for general competitive Pokémon team building. The project is currently in active development as a learning exercise with plans for future online deployment.

---

## Damage Calculator (Standalone)

- Entry: visit `/calc` → HTTP 302 redirect to the static calculator at `/pokemmo-damage-calc/index.html?gen=5`.
- No site chrome: the static page runs standalone (not wrapped by the app layout).
- Vendored build lives under `public/pokemmo-damage-calc/` (copied from `third_party/pokemmo-damage-calc/`).
- Theming: MMOJ visual tweaks in `public/pokemmo-damage-calc/mmoj-theme.css` (loaded after stock CSS). Additional runtime overrides and height sync exist in `public/pokemmo-damage-calc/theme/loader.js`.
- SEO: `/calc` loader sets `X-Robots-Tag: noindex` to discourage indexing.

Update workflow (vendored calc):
1) Update from upstream into `third_party/pokemmo-damage-calc/`.
2) Copy updated files into `public/pokemmo-damage-calc/` (preserve our `mmoj-theme.css` and `theme/loader.js`).
3) Do not modify upstream JS/HTML structure beyond linking our theme and removing the internal footer credits if desired.

Notes:
- Legacy `/damage-calc` in-app UI has been removed in favor of the standalone embed.
- All calculator logic remains upstream; our changes are CSS-only for branding and readability.
- Attribution: Engine/UI by upstream project `c4vv/pokemmo-damage-calc`.