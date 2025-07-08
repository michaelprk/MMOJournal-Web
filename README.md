# MMOJournal-Web

MMOJournal-Web is the web-based evolution of the MMOJournal CLI app — a personal tracker and journal designed for PokeMMO players. This project demonstrates full-stack development capabilities while building a comprehensive tool to manage competitive Pokémon builds, shiny hunts, and gameplay progression with a clean, user-friendly interface.

## 🚀 Implemented Features

### ✅ **Competitive Pokémon Build Management**
- **Full CRUD Operations**: Complete data management for Pokémon builds with add, edit, delete, and view functionality
- **Pokemon Build Cards**: Responsive card displays featuring sprites, stats, moves, abilities, and items
- **Tier Filtering**: Dynamic filtering system for competitive tiers (OU, UU, Doubles, RU, NU, LC)
- **Auto-hiding Navbar**: Smooth scroll-based navigation with intelligent hide/show behavior
- **Card Navigation**: Intuitive tab navigation between main view, stats, and moves with forward/back arrows

### ✅ **Enhanced Item & Image System**
- **Local Item Images**: 32+ competitive item images stored locally for instant loading
- **Generation 6-9 Coverage**: Complete support for modern competitive items including Covert Cloak, Loaded Dice, Heavy-Duty Boots
- **Smart Fallback System**: Local images with external URL fallbacks for maximum reliability
- **Performance Optimized**: Zero network requests for item images - 100% offline ready

### ✅ **Advanced Showdown Integration**
- **Gender Support**: Full (M)/(F) gender parsing and display with gender icons
- **Improved Parser**: Enhanced Showdown format parsing with better error handling
- **Team Import**: Batch import functionality with automatic gender detection and species separation
- **Export Compatibility**: Generate Showdown-compatible team strings

### ✅ **PokeAPI Integration** 
- **Real-time Data**: Fetch official Pokémon data including sprites, moves, abilities, and types
- **Autocomplete**: Smart suggestions for Pokémon names, moves, and items during input
- **Move Type Colors**: Dynamic color-coded moves with animated gradients for all 18 types
- **Expanded Item Database**: 1000+ items from all generations with proper mapping

### ✅ **Showdown Import/Export**
- **Team Import**: Parse entire teams from Pokémon Showdown format with automatic processing
- **Manual Entry**: Comprehensive form with IV/EV editing, nature selection, and move management
- **Batch Creation**: Import multiple Pokémon from a single Showdown paste
- **Gender Detection**: Automatic parsing of (M)/(F) gender indicators

### ✅ **Full Backend Implementation**
- **Node.js/Express API**: RESTful endpoints for all CRUD operations
- **SQLite Database**: Lightweight database with Prisma ORM for type-safe queries
- **Data Validation**: Server-side validation for IV/EV limits and Pokémon data integrity
- **PokeAPI Proxy**: Backend integration with PokeAPI for cached data retrieval

### ✅ **Modern UI/UX**
- **Responsive Design**: Optimized layouts for mobile and desktop viewing
- **Loading States**: Smooth loading indicators and comprehensive error handling
- **Hover Effects**: Interactive card reveals with detailed IV/EV information
- **TypeScript**: Full type safety across frontend and backend

## 🆕 Recent Development Progress

### **Local Item Image System** (Latest)
- **Lightning Fast Loading**: All competitive items now load instantly from local storage
- **32 Local Images**: Core competitive items stored locally including all modern generations
- **No External Dependencies**: 100% reliable item display with zero network requests
- **Automatic Fallback**: Smart fallback to external sources for items not available locally

### **Gender Support Enhancement**
- **Complete Gender System**: Full support for male/female/unknown gender states
- **Showdown Compatibility**: Automatic parsing of (M)/(F) indicators from Showdown imports
- **Visual Indicators**: Gender icons displayed alongside Pokémon names on cards
- **Form Integration**: Gender selection in manual build creation forms

### **Enhanced Navigation**
- **Card Tab System**: Seamless navigation between main, stats, and moves views
- **Arrow Navigation**: Forward/back arrows for intuitive tab switching
- **Improved UX**: Cleaner card layouts with better information organization

## 🎯 Development Goals

### 🔄 **Next Steps**
- **User Authentication**: Login and account creation system
- **Personal Collections**: User-specific build management and privacy controls

### 📋 **Planned Features**
- **Shiny Hunt Tracker**: Log and track shiny hunting progress with locations and methods
- **Progress Journal**: Rich text journaling with media uploads and gameplay stories
- **Team Management**: Group builds into teams with strategic analysis
- **AI Team Suggestions**: Smart team building recommendations and synergy analysis
- **Community Features**: Share builds, comment on teams, and social interaction
- **Advanced Filtering**: Search by moves, abilities, stats, and custom criteria
- **Import/Export**: Multiple format support and team sharing
- **Theme Customization**: Dark/light modes and personalized UI preferences

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

1. **Browse Builds**: View competitive Pokémon collection with filtering options
2. **Add New Pokémon**: Use the manual form or paste from Pokémon Showdown
3. **Edit Builds**: Click edit on any card to modify stats, moves, or details
4. **Filter by Tier**: Use the dropdown to view builds by competitive tier
5. **Import Teams**: Paste entire teams from Showdown for quick batch import

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

**Note**: This project showcases full-stack development skills while creating a tool specifically designed for PokeMMO players, though it can be adapted for general competitive Pokémon team building.