# MMOJournal-Web

MMOJournal-Web is the web-based evolution of the MMOJournal CLI app — a personal tracker and journal for PokeMMO players. It helps players manage competitive Pokémon builds, shiny hunts, and gameplay progression with a clean, user-friendly interface.

## 🚀 Current Features

### ✅ **Competitive Pokémon Build Management**
- **Full CRUD Operations**: Add, edit, delete, and view Pokémon builds with complete data management
- **Pokemon Build Cards**: Beautiful card displays with sprites, stats, moves, abilities, and items
- **Tier Filtering**: Filter builds by competitive tiers (OU, UU, Doubles, RU, NU, LC)
- **Auto-hiding Navbar**: Smooth scroll-based navigation that hides when browsing builds

### ✅ **PokeAPI Integration** 
- **Real-time Data**: Fetch official Pokémon data including sprites, moves, abilities, and types
- **Autocomplete**: Smart suggestions for Pokémon names, moves, and items as you type
- **Move Type Colors**: Dynamic color-coded moves with animated gradients for all 18 types

### ✅ **Showdown Import/Export**
- **Team Import**: Paste entire teams from Pokémon Showdown format with automatic parsing
- **Manual Entry**: Comprehensive form with IV/EV editing, nature selection, and move management
- **Batch Creation**: Import multiple Pokémon from a single Showdown paste

### ✅ **Full Backend Implementation**
- **Node.js/Express API**: RESTful endpoints for all CRUD operations
- **SQLite Database**: Lightweight database with Prisma ORM for type-safe queries
- **Data Validation**: Server-side validation for IV/EV limits and Pokémon data integrity
- **PokeAPI Proxy**: Backend integration with PokeAPI for cached data retrieval

### ✅ **Modern UI/UX**
- **Responsive Design**: Optimized for mobile and desktop viewing
- **Loading States**: Smooth loading indicators and error handling
- **Hover Effects**: Interactive card reveals with detailed IV/EV information
- **TypeScript**: Full type safety across frontend and backend

## 🎯 Future Goals

### 🔄 **In Progress**
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

## 🎮 Usage

1. **Browse Builds**: View your competitive Pokémon collection with filtering options
2. **Add New Pokémon**: Use the manual form or paste from Pokémon Showdown
3. **Edit Builds**: Click edit on any card to modify stats, moves, or details
4. **Filter by Tier**: Use the dropdown to view builds by competitive tier
5. **Import Teams**: Paste entire teams from Showdown for quick batch import

## 🤝 Contributing

This is an ongoing personal project and learning experience. Contributions, feedback, and suggestions are very welcome!

### **Areas for Contribution**
- UI/UX improvements and accessibility
- Additional Pokémon format support
- Performance optimizations
- Testing and bug fixes
- Documentation improvements

## 📜 License

MIT License — free to use and modify.

---

**Note**: This project is designed specifically for PokeMMO players but can be adapted for general competitive Pokémon team building.