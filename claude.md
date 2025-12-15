# CLAUDE.md - Inboop Frontend

This file provides guidance to Claude Code when working with the Inboop frontend codebase.

## Project Overview

**Inboop Frontend** is a Next.js 15 application for an AI-powered CRM for social commerce. It provides a unified inbox for managing Instagram, WhatsApp, and Facebook conversations, along with lead management, order tracking, and analytics.

## Technology Stack

- **Framework**: Next.js 15.5.7 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Font**: Plus Jakarta Sans

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Project Structure

```
app/
├── (app)/                    # Authenticated app routes
│   ├── home/                 # Dashboard home page
│   ├── inbox/                # Unified inbox
│   ├── leads/                # Lead management
│   ├── orders/               # Order tracking
│   ├── analytics/            # Analytics dashboard
│   ├── settings/             # User settings
│   └── layout.tsx            # App layout with sidebar
├── (marketing)/              # Public marketing pages
│   ├── login/                # Login page
│   └── register/             # Registration page
├── layout.tsx                # Root layout
└── globals.css               # Global styles

components/
├── inbox/                    # Inbox-specific components
│   ├── ConversationList.tsx  # Left sidebar conversation list
│   ├── ChatView.tsx          # Center chat panel
│   └── LeadSnapshot.tsx      # Right panel lead details
├── leads/                    # Leads page components
├── shared/                   # Shared components
│   └── ChannelIcons.tsx      # Platform icons (Instagram, WhatsApp, etc.)
├── ui/                       # Base UI components
├── GlobalHeader.tsx          # Top header bar
└── Sidebar.tsx               # Left navigation sidebar

stores/
├── useLeadStore.ts           # Lead state management (Zustand)
├── useUIStore.ts             # UI state (selected items, etc.)
└── useConversationStore.ts   # Conversation state

contexts/
└── AuthContext.tsx           # Authentication context

lib/
├── mockData.ts               # Mock data for development
├── helpers.ts                # Utility functions
└── utils.ts                  # General utilities (cn function)

types/
└── index.ts                  # TypeScript type definitions
```

## Design System

### Brand Colors

```css
/* Primary Brand Green */
--brand-primary: #2F5D3E;
--brand-primary-dark: #285239;
--brand-primary-light: #3a7a50;

/* Background */
--bg-app: #212121;           /* Dark sidebar/header */
--bg-content: #F8F9FA;       /* Light content area */
--bg-white: #FFFFFF;         /* Cards, panels */

/* Text */
--text-primary: #111827;     /* gray-900 */
--text-secondary: #6B7280;   /* gray-500 */
--text-muted: #9CA3AF;       /* gray-400 */

/* Sidebar */
--sidebar-bg: #212121;
--sidebar-hover: #2d2d2d;
--sidebar-text: #CCCCCC;
--sidebar-active: #2F5D3E;
```

### Common UI Patterns

#### Page Layout
```tsx
<div className="flex h-full flex-col bg-[#F8F9FA]">
  {/* Page Header */}
  <div className="px-8 pt-6 pb-4">
    <h1 className="text-2xl font-semibold text-gray-900">Page Title</h1>
    <p className="text-sm text-gray-500 mt-0.5">Page description</p>
  </div>

  {/* Content */}
  <div className="flex-1 overflow-hidden">
    {/* ... */}
  </div>
</div>
```

#### Cards
```tsx
<div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100
                transition-all duration-150 ease-out
                hover:shadow-md hover:-translate-y-[2px] cursor-default">
  {/* Card content */}
</div>
```

#### Primary Button
```tsx
<button
  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium
             transition-all duration-150 ease-out shadow-md
             hover:shadow-lg hover:brightness-110 hover:-translate-y-[1px]"
  style={{
    background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
  }}
>
  <Plus className="w-4 h-4" />
  Button Text
</button>
```

#### Secondary Button
```tsx
<button className="px-3.5 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-medium
                   hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300
                   transition-all duration-150 ease-out">
  Button Text
</button>
```

#### Icon Container
```tsx
<div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
  <Icon className="w-5 h-5 text-blue-600" />
</div>
```

### Status Colors

```tsx
// Lead Status
const getLeadStatusColor = (status: LeadStatus) => {
  switch (status) {
    case 'New': return 'bg-blue-50 text-blue-700';
    case 'Contacted': return 'bg-amber-50 text-amber-700';
    case 'Qualified': return 'bg-purple-50 text-purple-700';
    case 'Converted': return 'bg-emerald-50 text-emerald-700';
    case 'Lost': return 'bg-gray-100 text-gray-600';
  }
};

// Intent Type
const getIntentColor = (intent: IntentType) => {
  switch (intent) {
    case 'Order': return 'bg-emerald-50 text-emerald-600';
    case 'Inquiry': return 'bg-blue-50 text-blue-600';
    case 'Payment': return 'bg-amber-50 text-amber-600';
    case 'Delivery': return 'bg-purple-50 text-purple-600';
    case 'Issue': return 'bg-red-50 text-red-600';
    case 'Other': return 'bg-gray-50 text-gray-600';
  }
};
```

### Animation Patterns

```css
/* Micro-interactions */
transition-all duration-150 ease-out

/* Card hover */
hover:shadow-md hover:-translate-y-[2px]

/* Button hover */
hover:shadow-lg hover:brightness-110 hover:-translate-y-[1px]

/* Panel slide-in */
animate-in fade-in slide-in-from-right-2 duration-200 ease-out
```

## State Management

### Zustand Store Pattern

```tsx
// stores/useLeadStore.ts
import { create } from 'zustand';
import { Lead } from '@/types';

interface LeadState {
  leads: Lead[];
  deleteLead: (id: string) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  getLead: (id: string) => Lead | undefined;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: initialLeads,
  deleteLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((lead) => lead.id !== id),
    })),
  addLead: (lead) =>
    set((state) => ({
      leads: [lead, ...state.leads],
    })),
  updateLead: (id, updates) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, ...updates } : lead
      ),
    })),
  getLead: (id) => get().leads.find((lead) => lead.id === id),
}));
```

## Authentication

- **Methods**: Google OAuth + Email/Password
- **Token Storage**: JWT tokens in localStorage
- **Post-login Redirect**: `/home`
- **Context**: `AuthContext.tsx` provides `useAuth()` hook

```tsx
const { isAuthenticated, isLoading, user, login, logout } = useAuth();
```

## Routing

### App Routes (Authenticated)
- `/home` - Dashboard with action cards
- `/inbox` - Unified inbox
- `/leads` - Lead management
- `/orders` - Order tracking
- `/analytics` - Analytics dashboard
- `/settings` - User settings

### Marketing Routes (Public)
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

## Key Types

```tsx
type Channel = 'instagram' | 'whatsapp' | 'messenger';
type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
type IntentType = 'Order' | 'Inquiry' | 'Payment' | 'Delivery' | 'Issue' | 'Other';
type ConversationStatus = 'Open' | 'Pending' | 'Resolved';
type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

interface Lead {
  id: string;
  channel: Channel;
  customerHandle: string;
  customerName?: string;
  profilePicture?: string;
  intent: IntentType;
  status: LeadStatus;
  lastMessageTime: Date;
  lastMessageSnippet: string;
  createdAt: Date;
  value?: number;
  labels?: string[];
  conversationId?: string;
  assignedTo?: string;
}

interface Conversation {
  id: string;
  channel: Channel;
  customerHandle: string;
  customerName?: string;
  profilePicture?: string;
  lastMessage: string;
  lastMessageTime: Date;
  status: ConversationStatus;
  unreadCount: number;
  intent: IntentType;
  isVIP?: boolean;
}
```

## Common Patterns

### Master-Detail Layout (Leads Page)
```
┌──────────────────────────────────────────────────────────────┐
│ Header (Title, Actions)                                       │
├──────────────────────────────────────────────────────────────┤
│ Metrics Cards (4-column grid)                                 │
├──────────────────────────────────────────────────────────────┤
│ Filters (Search, Status Pills, Filter Button)                 │
├───────────────────────────────────────┬──────────────────────┤
│ Table (flex-1)                        │ Detail Panel (25%)   │
│ - Header row                          │ - Lead info          │
│ - Scrollable body                     │ - Quick tags         │
│ - Footer                              │ - Metrics            │
│                                       │ - Notes timeline     │
│                                       │ - Actions            │
└───────────────────────────────────────┴──────────────────────┘
```

### Three-Panel Layout (Inbox)
```
┌──────────────────────────────────────────────────────────────┐
│ Global Header                                                 │
├────────┬────────────────────────────────────┬────────────────┤
│Sidebar │ Conversation List │ Chat View       │ Lead Snapshot  │
│ (80px) │ (320px)          │ (flex-1)        │ (320px)        │
│        │                   │                 │                │
└────────┴───────────────────┴─────────────────┴────────────────┘
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.inboop.com
NEXT_PUBLIC_APP_URL=https://app.inboop.com
NEXT_PUBLIC_MARKETING_URL=https://inboop.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-client-id>
```

## Production URLs

| URL | Purpose |
|-----|---------|
| `https://inboop.com` | Marketing/landing pages |
| `https://app.inboop.com` | Authenticated app |
| `https://api.inboop.com` | Backend API |

## Git Guidelines

- Branch naming: `feature/<feature-name>`, `fix/<bug-name>`
- Commit messages: Single-line, descriptive
- Always create feature branches for new work

## Instagram OAuth Integration

### Overview
The Settings page includes Instagram Business account connection via OAuth.

### Flow
1. User clicks "Connect Instagram" button in Settings → Integrations tab
2. Frontend redirects to backend: `GET {API_URL}/api/v1/instagram/oauth/authorize?redirect=/settings`
3. Backend redirects to Facebook OAuth dialog
4. After authorization, backend redirects to: `https://app.inboop.com/settings?success=true&token=xxx`
5. Frontend detects `success` and `token` params, shows toast, updates connection state

### Key Files
- `app/(app)/settings/page.tsx` - Settings page with Integrations tab
- `stores/useAuthStore.ts` - Contains `instagramConnection` state
- `stores/useToastStore.ts` - Toast notification system
- `components/ui/toast.tsx` - Toast UI component

### State Management
```tsx
// useAuthStore.ts
instagramConnection: {
  isConnected: boolean;
  username?: string;
  lastSync?: Date;
}
setInstagramConnection: (connection) => void;
```

### Toast Notifications
```tsx
import { toast } from '@/stores/useToastStore';

toast.success('Title', 'Description');
toast.error('Title', 'Description');
toast.info('Title', 'Description');
toast.warning('Title', 'Description');
```

### Settings Page Structure
The Settings page uses a tabbed layout with left sidebar:
- **Profile** - User info, avatar, name, email, phone
- **Workspace** - Brand name, timezone, business category
- **Notifications** - Toggle switches for notification preferences
- **Integrations** - Instagram, WhatsApp, Facebook connection cards
- **Billing** - Plan info, payment method

### Design Colors (Settings Page)
Only uses 3 colors as per design spec:
- Black: `#111` (text)
- White: `#FFFFFF` (cards, backgrounds)
- Dark Green: `#2F5D3E` (buttons, accents, active states)
- Light Gray: `#F8F9FA` (page background)

### Team Page
Team management has been moved from Settings to a dedicated `/team` route in the main sidebar.
