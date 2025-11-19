# NeuroLearn PWA - Inclusive Learning Platform

## Overview

NeuroLearn is a Progressive Web App (PWA) designed to support neurodiverse learners with dyslexia, dysgraphia, dyscalculia, auditory processing disorder, and visual processing disorder. The platform provides multi-sensory, adaptive learning experiences through interactive games and exercises, with AI-powered personalization and feedback.

The application is built as a mobile-first PWA that installs on devices like a native app, works offline, and provides touch-optimized, accessibility-first learning tools with audio, visual, and haptic feedback.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript and Vite for fast development and optimized builds.

**UI Component System**: Shadcn/ui components built on Radix UI primitives, providing accessible, customizable components with consistent styling through Tailwind CSS.

**Design Philosophy**: Accessibility-first design inspired by Material Design principles but optimized for neurodiverse learners:
- OpenDyslexic font for body text and learning content
- Poppins font for headings and UI elements
- Generous spacing (Tailwind units: 4, 6, 8, 12, 16)
- Large touch targets (minimum 48px)
- High contrast options
- Adjustable font sizes and line spacing
- Calm, playful aesthetic with minimal cognitive load

**Routing**: Wouter for lightweight client-side routing with the following main routes:
- `/` - Home dashboard with activity tiles
- `/math` - Math games for dyscalculia support
- `/reading` - Reading and phonics exercises for dyslexia
- `/writing` - Writing practice and tracing tools for dysgraphia
- `/sensory` - Auditory and visual processing exercises
- `/progress` - Progress tracking with stats and badges
- `/settings` - Accessibility and preference settings

**State Management**:
- React Context API for global settings (SettingsContext, ThemeContext)
- TanStack Query (React Query) for server state management and API caching
- Local state with React hooks for component-level state

**PWA Features**:
- Service Worker for offline functionality and caching
- Web App Manifest for installability
- Responsive design optimized for mobile devices
- Speech Synthesis API for text-to-speech
- Canvas API for drawing/writing exercises
- Local Storage for persisting user preferences

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API endpoints:
- `GET/POST /api/learner` - Learner profile management
- `PUT /api/learner/:id/settings` - Update learner settings
- `GET /api/progress` - Retrieve progress statistics
- `GET/POST /api/activities` - Activity history and creation
- `GET/POST /api/badges` - Badge management
- `POST /api/ai/feedback` - AI-generated encouraging feedback
- `POST /api/ai/content` - AI-generated learning content
- `POST /api/ai/summary` - AI-generated progress summaries

**Storage Strategy**: Dual storage approach:
- **Development**: In-memory storage (MemStorage class) for rapid prototyping
- **Production**: Database storage via Drizzle ORM (configured but storage implementation can be swapped)

**Data Models**:
- Learner: User profile with learning needs and accessibility settings
- Activity: Learning session records with type, difficulty, score, and metadata
- Badge: Achievement tracking
- ProgressStats: Aggregated statistics for dashboard

**Session Management**: Connect-pg-simple for PostgreSQL-backed session storage (when database is provisioned).

### AI Integration

**Provider**: OpenAI API (GPT-5 model) for personalized learning experiences.

**AI Functions**:
- `generateEncouragingFeedback()` - Creates positive, age-appropriate feedback based on activity performance
- `generateLearningContent()` - Generates adaptive learning content for math, reading, and writing activities
- `generateProgressSummary()` - Creates personalized progress reports

**Design Rationale**: AI is used to provide warm, encouraging feedback tailored to each child's performance while focusing on effort and progress rather than just results. Content generation adapts to difficulty levels appropriate for different learning disabilities.

### Design System

**Color System**: HSL-based color tokens with semantic naming:
- Primary: Cyan (#0BC5EA) - main interactive elements
- Secondary: Purple (#9F7AEA) - secondary actions
- Accent: Orange (#F6AD55) - highlights and emphasis
- Supporting colors for charts and visualization
- Light/dark mode support via CSS custom properties

**Typography Scale**:
- Page Titles: text-4xl (36px)
- Section Headings: text-2xl (24px)
- Card Titles: text-xl (20px)
- Body Text: text-lg (18px) - larger than standard for readability
- Button Text: text-base (16px)
- Small Text: text-sm (14px)

**Accessibility Features**:
- Configurable font sizes (default, large, extra large)
- Adjustable line spacing (normal, relaxed, loose)
- High contrast mode toggle
- Animation disable option
- Audio feedback controls
- Haptic feedback support

### Build and Development

**Build Tool**: Vite for fast HMR and optimized production builds with code splitting.

**Development Tools**:
- TypeScript for type safety
- ESBuild for server bundling
- Drizzle Kit for database migrations
- PostCSS with Tailwind CSS and Autoprefixer

**Project Structure**:
- `client/` - React frontend application
- `server/` - Express backend API
- `shared/` - Shared TypeScript types and schemas
- `migrations/` - Database migration files

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Accessible component primitives (@radix-ui/react-*)
- **Shadcn/ui**: Pre-built accessible components configured in components.json
- **Lucide React**: Icon system
- **Embla Carousel**: Touch-friendly carousel component
- **CMDK**: Command menu interface
- **Vaul**: Drawer component for mobile

### Data Management
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support
- **Drizzle Zod**: Runtime validation for database schemas
- **TanStack Query**: Server state management and caching
- **Zod**: Schema validation
- **React Hook Form**: Form state management with @hookform/resolvers

### Database
- **Neon Serverless PostgreSQL**: Configured via @neondatabase/serverless
- **Connect-pg-simple**: PostgreSQL session store for Express
- Database connection via DATABASE_URL environment variable

### AI Service
- **OpenAI API**: GPT-5 model for content generation and feedback
- Requires OPENAI_API_KEY environment variable

### Styling and Design
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Component variant management
- **clsx & tailwind-merge**: Class name utilities
- **PostCSS & Autoprefixer**: CSS processing

### Development Tools (Replit-specific)
- **@replit/vite-plugin-runtime-error-modal**: Error overlay
- **@replit/vite-plugin-cartographer**: Development mapping
- **@replit/vite-plugin-dev-banner**: Development banner

### Fonts
- **Google Fonts**: Poppins family (weights 300-700)
- **OpenDyslexic**: Dyslexia-friendly font loaded via CDN

### Date Utilities
- **date-fns**: Date formatting and manipulation

### Notable Architecture Decisions

**Why PWA over React Native**: Replit cannot run React Native/Expo, but a PWA provides similar capabilities (offline support, installability, native-like experience) while being fully compatible with Replit's environment.

**Why In-Memory Storage**: Allows immediate development and testing without database setup. The IStorage interface enables easy swapping to database-backed storage when Postgres is provisioned.

**Why Drizzle ORM**: Type-safe database access with excellent TypeScript support, while remaining flexible enough to work with or without an active database connection during development.

**Why OpenAI Integration**: Provides personalized, encouraging feedback that adapts to each learner's needs, creating a more supportive and effective learning experience than static responses.

**Why Accessibility-First Design**: The target users have specific needs around font choice, spacing, contrast, and interaction patterns. Building these into the core architecture rather than adding them later ensures a better experience.