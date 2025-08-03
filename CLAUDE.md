# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lab Manager is a research laboratory management application for tracking experiments, protocols, and lab notebook entries. This is a greenfield TypeScript project with comprehensive specifications but no implementation yet.

## Technology Stack

### Backend
- **Runtime**: Node.js 24 with built-in TypeScript support (type stripping)
- **Module System**: Full ESM with `.js` extensions in imports
- **Framework**: Fastify + tRPC for type-safe APIs
- **Database**: PostgreSQL 15+ with direct SQL queries (no ORM)
- **Authentication**: Express-session with secure cookies
- **Testing**: Vitest with TDD approach
- **Linting**: oxlint (standard rules)

### Frontend
- **Framework**: Lit Web Components
- **UI Library**: Web Awesome Design System
- **Styling**: Standard CSS only
- **State Management**: Signals (reactive primitives)
- **Build Tool**: Vite
- **Testing**: Vitest browser mode

## Architecture Patterns

- **Backend**: Controller-Service-Repository pattern
- **Frontend**: Controller-Signal-Component pattern
- **Database**: snake_case naming (`lab_entries`, `created_at`)
- **Code**: camelCase functions, PascalCase classes, kebab-case files

## Development Commands

**Project Setup** (workspace commands from root):
```bash
npm install
npm run dev          # Start both backend and frontend dev servers
npm run build        # Build both packages
npm run test         # Run tests for both packages
npm run lint         # Run linting for both packages
npm run typecheck    # TypeScript type checking for both packages
```

**Backend specific** (from packages/backend):
```bash
npm run dev          # Start Node.js with --watch and TypeScript support
npm run build        # Build TypeScript to JavaScript
npm run test         # Run Vitest tests
npm run start        # Start production build
```

**Frontend specific** (from packages/frontend):
```bash
npm run dev          # Start Vite dev server
npm run build        # Build frontend for production
npm run test         # Run Vitest in browser mode
npm run preview      # Preview production build
```

## Key Architecture

### Database Schema
Complete PostgreSQL schema is defined in `technical-specifications.md` with tables for:
- Users and authentication (`users`, `user_sessions`)
- Projects and access control (`projects`, `project_members`)
- Lab notebook system (`lab_entries`, `protocols`)
- Calendar integration (`calendar_events`)

### Project Structure
```
packages/
├── backend/
│   └── src/
│       ├── controllers/    # Route handlers and request/response logic
│       ├── services/       # Business logic layer
│       ├── repositories/   # Database access layer
│       ├── types/          # TypeScript type definitions
│       └── utils/          # Helper functions
└── frontend/
    └── src/
        ├── components/
        │   ├── pages/      # Large container components
        │   ├── ui/         # Reusable UI components
        │   └── layout/     # App shell and navigation
        ├── controllers/    # Data fetching and signal management
        ├── services/       # API client and external services
        ├── types/          # TypeScript type definitions
        └── utils/          # Helper functions
```

## Documentation

- `functional-specifications.md`: Complete feature requirements (French)
- `technical-specifications.md`: Database schema and architecture
- `user-stories.md`: 45 user stories across 9 epics
- `AGENTS.md`: Development guidelines and coding standards

## Key Features to Implement

1. **Authentication System**: User management, invitations, role-based access
2. **Project Management**: Project creation, team assignment, permissions  
3. **Lab Notebook**: Electronic lab entries, experiment tracking
4. **Protocol Management**: Shared procedures, validation workflow
5. **Calendar Integration**: Gmail sync, experiment scheduling
6. **Communication**: Email integration, notifications

## Code Style Requirements

- TypeScript only with standard features (no experimental syntax)
- Full ESM modules with `.js` extensions in imports
- Files: kebab-case (`user-controller.ts`)
- Classes: PascalCase (`UserController`)
- Functions/Variables: camelCase (`fetchEntries`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)
- Test files: `*.test.ts` alongside source files
- **Type Safety**: Avoid `any` type unless absolutely necessary (prefer `unknown`)
- **Error Handling**: Avoid `@ts-ignore` and `@ts-expect-error` comments

## Testing Strategy

- Use Vitest for all testing (backend and frontend)
- Follow TDD approach - write tests first
- Frontend components tested in Vitest browser mode
- Place test files alongside source files with `.test.ts` extension

## Git Workflow

- **Conventional Commits**: Use standardized commit message format
- **Automated Changelog**: Generated from conventional commits
- Commit format: `type(scope): description`
- Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Monorepo scopes**: Use `backend`, `frontend`, `api`, `ui`, `components`, `services`
- **AI/LLM Restriction**: AI assistants should NEVER commit changes - all commits done manually
- Examples:
  - `feat(backend): add user authentication`
  - `feat(frontend): add login component`
  - `fix(api): handle validation errors`

## Gmail Integration

The application requires Gmail API integration for:
- Calendar synchronization (`calendar_events` table)
- Email notifications and communication
- OAuth2 authentication flow for Gmail access

## Current Status

Repository has been initialized with:
- Monorepo structure with separate backend and frontend packages
- TypeScript configuration with Node.js 24 built-in type stripping
- Development tooling: Vite, Vitest, oxlint
- Proper ESM module setup with `.js` import extensions
- Directory structure ready for implementation

Next steps: Implement core application features according to the technical specifications.