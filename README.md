# Lab Manager

A research laboratory management application for tracking experiments, protocols, and lab notebook entries.

## Features

- **Electronic Lab Notebook**: Digital experiment tracking and documentation
- **Protocol Management**: Shared procedures with validation workflow
- **Project Management**: Team collaboration with role-based permissions
- **Calendar Integration**: Gmail sync and experiment scheduling
- **User Authentication**: Secure login with invitation system
- **Email Notifications**: Integrated communication system

## Technology Stack

### Backend
- Node.js 24 with TypeScript support
- Fastify + tRPC for type-safe APIs
- PostgreSQL 15+ database
- Express-session authentication

### Frontend
- Lit Web Components
- Web Awesome Design System
- Vite build tool
- Vitest testing framework

## Getting Started

### Prerequisites
- Node.js 24+
- PostgreSQL 15+
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lab-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up your PostgreSQL database and configure environment variables.

4. Start the development servers:
```bash
npm run dev
```

This will start both the backend API server and frontend development server.

## Available Commands

### Project-wide commands (run from root):
- `npm run dev` - Start both backend and frontend dev servers
- `npm run build` - Build both packages for production
- `npm run test` - Run tests for both packages
- `npm run lint` - Run linting for both packages
- `npm run typecheck` - TypeScript type checking for both packages

### Backend-specific commands (from packages/backend):
- `npm run dev` - Start Node.js development server
- `npm run build` - Build TypeScript to JavaScript
- `npm run test` - Run backend tests
- `npm run start` - Start production server

### Frontend-specific commands (from packages/frontend):
- `npm run dev` - Start Vite development server
- `npm run build` - Build frontend for production
- `npm run test` - Run frontend tests in browser mode
- `npm run preview` - Preview production build

## Project Structure

```
packages/
├── backend/
│   └── src/
│       ├── controllers/    # Route handlers
│       ├── services/       # Business logic
│       ├── repositories/   # Database access
│       ├── types/          # TypeScript types
│       └── utils/          # Helper functions
└── frontend/
    └── src/
        ├── components/
        │   ├── pages/      # Page components
        │   ├── ui/         # Reusable UI components
        │   └── layout/     # App shell and navigation
        ├── controllers/    # Data management
        ├── services/       # API client
        ├── types/          # TypeScript types
        └── utils/          # Helper functions
```

## Contributing

This project is currently in active development and is not accepting external contributions at this time.

## License

MIT