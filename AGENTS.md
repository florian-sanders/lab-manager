# AGENTS.md - Labmanager Development Guide

## Project Overview
Lab management system with tRPC API (Fastify + PostgreSQL) backend and Lit Web Components frontend.

## Build Commands
```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run Vitest tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run oxlint
npm run typecheck    # TypeScript type checking

# Frontend  
npm run dev:frontend # Start Vite dev server
npm run build:frontend # Build frontend
npm run test:browser # Run Vitest in browser mode
```

## Code Style Guidelines

### Language & Modules
- **TypeScript only** - Standard features, no experimental syntax
- **Full ESM modules** - Zero CommonJS, use import/export
- **Node.js 24** runtime

### Architecture Patterns
- **Backend**: Controller-Service-Repository pattern with tRPC
- **Frontend**: Controller-Signal-Component pattern with Lit
- **Database**: Direct SQL queries, no ORM

### Imports & Dependencies
- Use relative imports for local files: `import { User } from '../types/user.js'`
- Always include `.js` extension in imports
- Group imports: external libs, then local files
- Check existing dependencies before adding new ones

### Naming Conventions
- **Files**: kebab-case (`user-controller.ts`, `lab-entry.ts`)
- **Classes**: PascalCase (`UserController`, `LabEntry`)
- **Functions/Variables**: camelCase (`fetchEntries`, `userId`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Database**: snake_case tables/columns (`lab_entries`, `created_at`)

### Error Handling
- Use tRPC error types: `TRPCError` with proper codes
- Validate inputs with Zod schemas
- Return meaningful error messages
- Log errors with context

### Type Safety
- Avoid `any` type unless absolutely necessary (prefer `unknown`)
- Avoid `@ts-ignore` and `@ts-expect-error` comments

### Testing
- **TDD approach** - Write tests first
- Use Vitest for all testing
- Test files: `*.test.ts` alongside source files
- Mock external dependencies

### Git Workflow
- **Conventional Commits** - Use standardized commit message format
- **Automated Changelog** - Generated from conventional commits
- Commit format: `type(scope): description`
- Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Monorepo scopes**: Use `backend`, `frontend`, `api`, `ui`, `components`, `services`
- **AI/LLM Restriction**: AI assistants should NEVER commit changes - all commits done manually
- Examples:
  - `feat(backend): add user authentication`
  - `feat(frontend): add login component`
  - `fix(api): handle validation errors`