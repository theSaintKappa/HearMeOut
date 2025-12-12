# HearMeOut 🎧

### **Get a front-row seat to your own music taste.**

> HearMeOut is a modern web application that connects to your Spotify account to display, explore, and share your top tracks and artists across different time ranges. It was made for a school project.

## 📖 Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Video Demo](#-video-demo)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Project Structure](#-project-structure)
- [Architecture](#️-architecture)
- [Key Components](#-key-components)
- [API Documentation](#-api-documentation)
- [Libraries & Technologies](#-libraries--technologies)
- [Architecture Decision Records (ADR)](#-architecture-decision-records-adr)
- [Challenges & Solutions](#-challenges--solutions)
- [Future Improvements](#-future-improvements)
- [Component Documentation](#-component-documentation)
- [Contribution Guide](#-contribution-guide)
- [License](#-license)

---

## ✨ Features

- **🔐 Spotify OAuth Authentication** - Secure sign-in with Spotify using Better Auth
- **📊 Top Tracks & Artists** - View your most listened to tracks and artists
- **📅 Time Range Filters** - Switch between Last 4 Weeks, Last 6 Months, and Last Year data
- **🎨 Grid & List Views** - Toggle between card grid and detailed list layouts
- **🌙 Dark/Light Mode** - Full theme support with system preference detection
- **🎨 Customizable Theme Colors** - Choose from 8 primary app colors
- **📤 Public Sharing** - Generate shareable links to your music stats
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **⚡ Infinite Scroll Pagination** - Load more items on demand
- **🎭 Smooth Animations** - Fluid transitions and micro-interactions powered by Motion
- **🖼️ Interactive Dialogs** - Detailed track and artist information modals
- **🌊 3D Animated Background** - WebGL-powered floating lines on the landing page

---

## 🔗 Live Demo:

**Live production URL:** [https://hearmeout.saintkappa.dev]()

---

## 📸 Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Dashboard - Grid View
![Dashboard Grid View](docs/screenshots/dashboard-grid.png)

### Dashboard - List View
![Dashboard List View](docs/screenshots/dashboard-list.png)

### Track Details Dialog
![Track Details](docs/screenshots/track-dialog.png)

### Artist Details Dialog
![Artist Details](docs/screenshots/artist-dialog.png)

### Share Dialog
![Share Dialog](docs/screenshots/share-dialog.png)

---

## 🎬 Video Demo

<video controls>
  <source src="docs/videos/demo.mp4" type="video/mp4">
</video>

---

## 🚀 Installation

### Prerequisites

- **Node.js** >= 18.x
- **npm**, **yarn**, **pnpm**, or **bun**
- **PostgreSQL** database (local or cloud-hosted like Neon, Supabase, or Railway)
- **Spotify Developer Account** for API credentials

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/theSaintKappa/HearMeOut.git
   cd HearMeOut
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables** (see [Configuration](#-configuration))
   ```bash
   cp .env.example .env.local
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open the application**
   
   Navigate to [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

---

## ⚙️ Configuration

### Environment Variables

```env
# PostgreSQL Database
DATABASE_URL="postgresql://username:password@localhost:5432/hearmeout"

# better-auth
BETTER_AUTH_SECRET="your_better_auth_secret_key"
BETTER_AUTH_URL="http://127.0.0.1:3000/"

# Spotify API
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
```

See docs: [better-auth](https://www.better-auth.com/docs/installation#set-environment-variables) and [Spotify Developer](https://developer.spotify.com/documentation/web-api/).

### Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Set the **Redirect URI** to: `http://127.0.0.1:3000/api/auth/callback/spotify`
4. Copy the **Client ID** and **Client Secret** to your `.env` file
5. Required scopes (configured automatically):
   - `user-top-read` - Access to user's top artists and tracks
   - `user-read-email` - Access to user's email
   - `user-read-private` - Access to user's profile data

### Prisma Setup

1. Ensure your PostgreSQL database is running
2. Update `DATABASE_URL` in `.env.local` with your connection string
3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
4. (Optional) Open Prisma Studio to view data:
   ```bash
   npx prisma studio
   ```

---

## 📁 Project Structure

```
prisma/
├── schema.prisma # Database schema definition
└── migrations/   # Database migration files

public/ # Static assets

src/
├── app/            # Next.js App Router
│   ├── globals.css # Global styles with Tailwind
│   ├── layout.tsx  # Root layout with providers
│   │
│   ├── (landing)/                  # Landing page route group
│   │   ├── page.tsx                # Landing page
│   │   ├── floating-lines.tsx      # WebGL 3D background
│   │   ├── rotating-text.tsx       # Animated text component
│   │   ├── sign-in-button.tsx      # OAuth sign-in button
│   │   └── oauth-error-handler.tsx # OAuth error toast display
│   │
│   ├── (home)/                     # Authenticated routes group
│   │   ├── layout.tsx              # Layout with header
│   │   ├── header.tsx              # App header
│   │   ├── collection-view.tsx     # Grid/List renderer
│   │   ├── content-filters.tsx     # Type & time range filters
│   │   ├── top-entry-card.tsx      # Grid card component
│   │   ├── top-entry-list-item.tsx # List item component
│   │   ├── track-dialog.tsx        # Track details modal
│   │   ├── artist-dialog.tsx       # Artist details modal
│   │   ├── settings-popover.tsx    # Settings menu
│   │   │
│   │   ├── me/ # Private user dashboard
│   │   │   ├── page.tsx                       # /me page
│   │   │   ├── private-collection-wrapper.tsx # Wrapper for API fetch + SWR
│   │   │   ├── share-dialog.tsx               # Share link management dialog
│   │   │   └── user-popover.tsx               # User profile menu
│   │   │
│   │   └── share/[userId]/  # Public shared stats
│   │       ├── page.tsx                      # /share/[userId] dynamic page
│   │       ├── public-collection-wrapper.tsx # Wrapper for db fetch + SWR
│   │       └── collection-info-banner.tsx    # Banner with collection info
│   │
│   └── api/               # API Routes
│       ├── auth/[...all]/ # Better Auth endpoints
│       ├── me/
│       │   ├── [contentType]/route.ts  # GET top items from Spotify
│       │   └── share/route.ts          # Share management
│       └── shared/[userId]/route.ts    # GET public shared stats
│
├── components/            # Shared UI components
│   ├── theme-provider.tsx # next-themes provider
│   └── ui/                # shadcn/ui components
│
├── generated/             # Auto-generated Prisma client
│
└── lib/                   # Utilities and core logic
    ├── auth.ts            # Better Auth configuration
    ├── auth-client.ts     # Client-side auth helpers
    ├── prisma.ts          # Prisma client instance
    ├── store.ts           # Zustand state stores
    ├── types.ts           # TypeScript interfaces
    └── utils.ts           # Helper functions

biome.json                 # Biome linter config
components.json            # shadcn/ui config
next.config.ts             # Next.js configuration
...
```

### Next.js App Router Structure

This project uses **Next.js 16** with the **App Router** pattern:

- **Route Groups** `(landing)`, `(home)` - Organize routes without affecting URL paths
- **Dynamic Routes** `[userId]`, `[contentType]` - Parameterized routes
- **Route Handlers** - API endpoints in `app/api/`
- **Layouts** - Nested layouts for shared UI
- **Server Components** - Default for better performance
- **Client Components** - Marked with `"use client"` directive

---

## 🏗️ Architecture

### Component Architecture Diagram

![Architecture Diagram](docs/Architecture_Diagram.png)

### Data Flow Architecture

1. **Authentication Flow:**
   - User clicks "Continue with Spotify"
   - Better Auth redirects to Spotify OAuth
   - On success, user data + tokens stored in PostgreSQL
   - Session cookie set for subsequent requests

2. **Data Fetching Flow:**
   - Client components use SWR for data fetching
   - API routes validate session and retrieve access token
   - Spotify API called with user's access token
   - Response mapped to internal types and returned

3. **State Management:**
   - `useHMOStore` - Ephemeral state (content type, time range filters)
   - `useSettingsStore` - Persisted state (view mode, theme color)
   - Both use Zustand for minimal boilerplate

---

## 🧩 Key Components

### 1. CollectionView

The main component for rendering track/artist collections in grid or list format.

```tsx
import { CollectionView } from "@/app/(home)/collection-view";

// Usage example
<CollectionView
  items={tracks}
  contentType="tracks"
  isLoading={false}
  pagination={{
    total: 100,
    hasMore: true,
    isLoadingMore: false,
    remainingItems: 50,
    onLoadMore: () => loadMore(),
  }}
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `items` | `(Artist \| Track)[]` | Array of items to display |
| `contentType` | `"tracks" \| "artists"` | Type of content being displayed |
| `isLoading` | `boolean` | Show skeleton loading state |
| `pagination` | `object` | Optional pagination configuration |

### 2. TopEntryCard

Grid card component for displaying individual tracks or artists.

```tsx
import { TopEntryCard } from "@/app/(home)/top-entry-card";

<TopEntryCard
  type="tracks"
  data={track}
  index={0}
/>
```

**Features:**
- Lazy-loaded images with fade-in effect
- Ranking badge
- Hover animations
- Click to open detail dialog

### 3. ContentFilters

Filter controls for content type and time range selection.

```tsx
import { ContentFilters } from "@/app/(home)/content-filters";

<ContentFilters />
```

**Features:**
- Toggle between Tracks/Artists
- Select time range (4 weeks, 6 months, 1 year)
- Connected to Zustand store

### 4. TrackDialog & ArtistDialog

Modal dialogs showing detailed information.

```tsx
import { TrackDialog } from "@/app/(home)/track-dialog";

<TrackDialog track={trackData}>
  <button>Open Details</button>
</TrackDialog>
```

**Track Dialog displays:**
- Album artwork
- Track name and artists
- Duration
- Album information
- Release date
- "Open in Spotify" button

**Artist Dialog displays:**
- Artist image
- Artist name
- Genres as badges
- Follower count
- Popularity score
- "Open in Spotify" button

### 5. ShareDialog

Dialog for managing shareable links to user's stats.

```tsx
import { ShareDialog } from "@/app/(home)/me/share-dialog";

<ShareDialog />
```

**Features:**
- Generate/update share link
- Copy link to clipboard
- Delete shared stats
- Shows last update timestamp

### 6. FloatingLines (WebGL Background)

Three.js-powered animated background on the landing page.

```tsx
import { FloatingLines } from "@/app/(landing)/floating-lines";

<FloatingLines
  enabledWaves={["top", "middle", "bottom"]}
  lineCount={[8, 6, 8]}
  lineDistance={[10, 12, 12]}
  bendRadius={0}
  bendStrength={0}
/>
```

---

## 📡 API Documentation

### Authentication Endpoints

All authentication is handled by Better Auth at `/api/auth/*`.

### Top Items Endpoint

**GET** `/api/me/{contentType}`

Fetches user's top tracks or artists from Spotify.

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `contentType` | `tracks` \| `artists` | required | Type of content |
| `timeRange` | `short_term` \| `medium_term` \| `long_term` | `medium_term` | Time period |
| `limit` | `number` | `50` | Number of items (1-500) |
| `offset` | `number` | `0` | Starting position |

**Response:**
```json
{
  "contentType": "tracks",
  "limit": 50,
  "offset": 0,
  "total": 99,
  "nextOffset": 50,
  "items": [
    {
      "name": "Track Name",
      "artists": [{"name": "Artist", "url": "..."}],
      "album": {...},
      "durationMs": 210000,
      "popularity": 85,
      "uri": "spotify:track:...",
      "url": "https://open.spotify.com/track/..."
    }
  ]
}
```

### Share Management Endpoint

**GET** `/api/me/share`

Check if user has shared stats.

**Response:**
```json
{
  "hasSharedStats": true,
  "userId": "user-id",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

**POST** `/api/me/share`

Generate or update shared stats snapshot.

**DELETE** `/api/me/share`

Remove shared stats.

### Public Stats Endpoint

**GET** `/api/shared/{userId}`

Fetch publicly shared stats for a user.

**Response:**
```json
{
  "sharedStats": {
    "id": "...",
    "userId": "...",
    "tracksShortTerm": [...],
    "tracksMediumTerm": [...],
    "tracksLongTerm": [...],
    "artistsShortTerm": [...],
    "artistsMediumTerm": [...],
    "artistsLongTerm": [...]
  }
}
```

---

## 📚 Libraries & Technologies

| Library | Version | Purpose |
|---------|---------|---------|
| **Next.js** | 16.x | React framework with App Router, SSR, and API routes |
| **React** | 19.x | UI library with new features like React Compiler |
| **TypeScript** | 5.x | Type safety and better DX |
| **Prisma** | 7.x | Type-safe database ORM with PostgreSQL adapter |
| **Better Auth** | 1.4.x | Modern authentication library with OAuth support |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Radix UI** | Various | Accessible, unstyled UI primitives |
| **Motion** | 12.x | Animation library (formerly Framer Motion) |
| **Zustand** | 5.x | Lightweight state management |
| **SWR** | 2.x | Data fetching with caching and revalidation |
| **Three.js** | 0.181.x | WebGL 3D graphics library |
| **Zod** | 4.x | Schema validation for API inputs |
| **Sonner** | 2.x | Toast notifications |
| **Lucide React** | 0.554.x | Icon library |
| **next-themes** | 0.4.x | Theme switching (dark/light mode) |
| **Biome** | 2.x | Fast linter and formatter |
| **@spotify/web-api-ts-sdk** | 1.x | Spotify API type definitions |

### Why These Choices?

- **Next.js 16** - Latest App Router for better routing and React Server Components
- **Better Auth** - Modern auth solution that's simpler than NextAuth with better TypeScript support
- **Prisma** - Best-in-class type safety for database operations
- **Zustand** - Minimal boilerplate compared to Redux, perfect for this app's needs
- **SWR** - Automatic caching, revalidation, and infinite scroll support
- **Motion** - Smooth animations with layout animations support
- **Radix UI** - Accessible components without styling lock-in
- **Biome** - Faster than ESLint/Prettier combination

---

## 📝 Architecture Decision Records (ADR)

### ADR-001: Using Next.js App Router over Pages Router

**Context:** Starting a new project with Next.js in 2025.

**Decision:** Use the App Router (introduced in Next.js 13).

**Rationale:**
- Server Components reduce client-side JavaScript
- Nested layouts improve code organization
- Better streaming and loading states
- Route groups for logical organization without URL impact
- Industry direction for React applications

---

### ADR-002: Better Auth over NextAuth

**Context:** Need OAuth authentication with Spotify.

**Decision:** Use Better Auth instead of NextAuth (Auth.js).

**Rationale:**
- Better TypeScript support out of the box
- Simpler API for custom profile mapping
- Built-in support for additional user fields
- More straightforward session management
- Active development and good documentation

---

### ADR-003: Zustand over Redux/Context

**Context:** Need client-side state for filters and settings.

**Decision:** Use Zustand for state management.

**Rationale:**
- Minimal boilerplate (no actions, reducers, providers)
- Built-in persistence middleware
- TypeScript support without extra packages
- Smaller bundle size
- Simple API for this app's complexity level
- Has a cool bear mascot 🐻

---

### ADR-004: SWR over React Query

**Context:** Need data fetching with caching for Spotify data.

**Decision:** Use SWR for data fetching.

**Rationale:**
- Simpler API for our use case
- Built-in `useSWRInfinite` for pagination
- Smaller bundle size
- Revalidation strategies fit our needs
- Created by Vercel, integrates well with Next.js

---

### ADR-005: Prisma with PostgreSQL

**Context:** Need database for user sessions and shared stats.

**Decision:** Use Prisma ORM with PostgreSQL.

**Rationale:**
- Type-safe database queries
- Excellent migration system
- Better Auth has first-class Prisma adapter
- PostgreSQL supports JSON columns for stats storage
- Good tooling (Prisma Studio, CLI)

---

### ADR-006: Storing Shared Stats as JSON

**Context:** Need to store snapshots of user's top items for sharing.

**Decision:** Store tracks and artists as JSON columns rather than normalized tables.

**Rationale:**
- Snapshots are immutable (don't need to update individual items)
- Simpler queries for read-heavy access pattern
- No need for complex joins
- Reduces database complexity
- PostgreSQL has efficient JSON storage

---

## 🚧 Challenges & Solutions

### Challenge 1: Spotify API Rate Limiting

**Problem:** Spotify API has rate limits, and fetching 100+ items requires multiple requests.

**Solution:** 
- Implemented parallel request batching in API routes
- Used SWR's caching to minimize redundant requests
- Set `revalidateOnFocus: false` to prevent unnecessary refetches

### Challenge 2: Animation Performance with Large Lists

**Problem:** Rendering 96+ items with animations caused performance issues.

**Solution:**
- Used `AnimatePresence` with `mode="popLayout"` for efficient exits
- Implemented `LayoutGroup` for coordinated layout animations
- Added staggered delays with a maximum cap (`Math.min(index * 0.01, 0.3)`)
- Conditionally disabled layout animations during view mode changes

### Challenge 3: Theme Color Customization

**Problem:** Needed to support multiple primary colors without generating all CSS variations.

**Solution:**
- Used CSS custom properties for primary color
- Created color utility classes that apply hue shifts
- Leveraged Tailwind's `class` attribute with color names
- Combined with `resolvedTheme` for dark/light variations

### Challenge 4: OAuth Token Refresh

**Problem:** Spotify access tokens expire after 1 hour.

**Solution:**
- Better Auth handles token refresh automatically
- Used `getAccessToken` API that refreshes if needed
- Stored refresh token in database for persistence

### Challenge 5: WebGL Background Performance

**Problem:** Three.js background was resource-intensive on mobile devices.

**Solution:**
- Implemented device-based wave configuration
- Reduced line count on mobile
- Used `OrthographicCamera` for 2D optimization
- Enabled hardware-accelerated rendering

---

## 🔮 Future Improvements

### Integrated Spotify Player

**Planned Feature:** Embed Spotify's Web Playback SDK to play track previews directly in the app.

**Implementation Plan:**
1. Add `streaming` scope to OAuth configuration
2. Initialize Spotify Web Playback SDK
3. Create `PlayerContext` for playback state
4. Add play buttons to track cards and dialogs
5. Create mini-player component in header
6. Handle premium/non-premium user differences

**Technical Considerations:**
- Requires Spotify Premium for full playback
- Need to handle device transfer
- Implement queue management
- Add visualization/progress bar

### Other Planned Features

- **Playlist Generation** - Create playlists from top items
- **Friends Comparison** - Compare stats with friends
- **Genre Analytics** - Breakdown by music genre
- **Listening History** - Recently played integration
- **Export Data** - Download stats as image/PDF

---

## 📖 Component Documentation

### Current Component Categories:

1. **Layout Components**
   - `Header` - Main navigation header
   - `HomeLayout` - Authenticated pages layout

2. **Display Components**
   - `CollectionView` - Grid/List renderer
   - `TopEntryCard` - Card for grid view
   - `TopEntryListItem` - Item for list view

3. **Dialog Components**
   - `TrackDialog` - Track details modal
   - `ArtistDialog` - Artist details modal
   - `ShareDialog` - Share link management

4. **Filter Components**
   - `ContentFilters` - Content type and time range selectors
   - `SettingsPopover` - Theme and view settings

5. **UI Primitives** (in `components/ui/`)
   - Button, Dialog, Popover, Toggle, etc.
   - Based on Radix UI with Tailwind styling

---

## 🤝 Contribution Guide

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up your environment** (see [Configuration](#-configuration))

### Development Workflow

1. **Run the development server**
   ```bash
   npm run dev
   ```

2. **Make your changes**
   - Follow existing code patterns
   - Use TypeScript strictly
   - Add proper types for new code

3. **Lint and format**
   ```bash
   npm run lint
   npm run format
   ```

4. **Test your changes manually**
   - Test all affected features
   - Check responsive design
   - Verify dark/light mode

### Code Standards

- **TypeScript:** Strict mode enabled, no `any` types
- **Components:** Functional components with hooks
- **Styling:** Tailwind CSS utilities, use `cn()` for conditional classes
- **State:** Zustand for global state, React state for local
- **Data Fetching:** SWR for client-side, fetch in Server Components

### Pull Request Process

1. **Update documentation** if needed
2. **Write clear commit messages**
3. **Create PR with description** of changes
4. **Request review** from maintainers
5. **Address feedback** and update PR

### Reporting Issues

- Use GitHub Issues
- Include reproduction steps
- Specify browser and device
- Include error messages/screenshots

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Not affiliated with Spotify AB.** All Spotify trademarks are property of Spotify AB.
