# Technical Specifications - Labmanager

## Architecture Overview

### System Architecture

- **Backend**: tRPC API server (Fastify + PostgreSQL)
- **Frontend**: Decoupled SPA with type-safe API client
- **Database**: PostgreSQL with direct SQL queries
- **Authentication**: Session-based (future: OAuth2 with Gmail/Microsoft SSO)
- **API Layer**: tRPC for end-to-end type safety

### Technology Stack

#### Backend

- **Runtime**: Node.js 24
- **Language**: TypeScript (standard features only, type stripping)
- **Module System**: Full ESM (ES Modules), zero CommonJS
- **Framework**: Fastify with tRPC
- **API Layer**: tRPC for type-safe procedures
- **Database**: PostgreSQL 15+
- **Database Access**: Direct SQL queries (no ORM)
- **Authentication**: Express-session with secure cookies
- **Architecture**: Controller-Service-Repository pattern
- **Development Methodology**: Test-Driven Development (TDD)
- **Linting**: oxlint (standard rules)
- **Testing**: Vitest

#### Frontend (Decoupled)

- **Framework**: Lit Web Components
- **UI Library**: Shoelace Design System
- **Styling**: No CSS framework, standard CSS only
- **State Management**: Signals (reactive primitives)
- **API Client**: tRPC client (type-safe)
- **Architecture Pattern**: Controller-Signal-Component
- **Build Tool**: Vite
- **Language**: TypeScript (standard features only, type stripping)
- **Module System**: Full ESM (ES Modules)
- **Theming**: Light & Dark themes
- **Linting**: oxlint (standard rules)
- **Testing**: Vitest (browser mode)

### Frontend Architecture Patterns

#### Controller Pattern
Controllers handle data fetching, transformation, and signal updates:

```typescript
class LabBookController {
  private entriesSignal = signal([]);
  private loadingSignal = signal(false);
  
  async fetchEntries(projectId: string) {
    this.loadingSignal.value = true;
    const response = await fetch(`/api/projects/${projectId}/entries`);
    const entries = await response.json();
    this.entriesSignal.value = this.transformEntries(entries);
    this.loadingSignal.value = false;
  }
}
```

#### Signal-Based Reactivity
- **Data Signals**: Hold application state (entries, projects, users)
- **UI Signals**: Track loading states, validation errors, form states
- **Computed Signals**: Derived state (filtered entries, aggregated data)

#### Component Architecture
```typescript
@customElement('lab-entry-list')
class LabEntryList extends LitElement {
  @property() controller!: LabBookController;
  
  render() {
    return html`
      ${this.controller.entries.value.map(entry => 
        html`<lab-entry-card .entry=${entry}></lab-entry-card>`
      )}
    `;
  }
}
```

### Frontend Directory Structure
```
src/
├── controllers/
│   ├── auth-controller.ts
│   ├── lab-book-controller.ts
│   ├── project-controller.ts
│   └── protocol-controller.ts
├── components/
│   ├── pages/
│   │   ├── lab-book-page.ts
│   │   ├── project-page.ts
│   │   └── protocol-page.ts
│   ├── ui/
│   │   ├── lab-entry-card.ts
│   │   ├── project-selector.ts
│   │   └── rich-text-editor.ts
│   └── layout/
│       ├── app-shell.ts
│       └── navigation-menu.ts
├── services/
│   ├── api-client.ts
│   ├── auth-service.ts
│   └── storage-service.ts
├── types/
│   ├── api.ts
│   ├── domain.ts
│   └── ui.ts
└── utils/
    ├── signals.ts
    ├── validation.ts
    └── formatters.ts
```

### Core Controllers

#### AuthController
- **Responsibilities**: Authentication state, login/logout, token management
- **Signals**: `user`, `isAuthenticated`, `permissions`
- **Methods**: `login()`, `logout()`, `refreshToken()`, `checkPermissions()`

#### LabBookController
- **Responsibilities**: Lab entries CRUD, experiment management
- **Signals**: `entries`, `experiments`, `selectedEntry`, `loadingStates`
- **Methods**: `fetchEntries()`, `createEntry()`, `updateEntry()`, `linkToExperiment()`

#### ProjectController
- **Responsibilities**: Project management, user assignments, permissions
- **Signals**: `projects`, `currentProject`, `projectMembers`, `userRoles`
- **Methods**: `fetchProjects()`, `createProject()`, `assignUser()`, `updatePermissions()`

#### ProtocolController
- **Responsibilities**: Shared protocols, validation workflow
- **Signals**: `protocols`, `protocolTemplates`, `pendingValidations`
- **Methods**: `fetchProtocols()`, `submitForValidation()`, `approveProtocol()`

### Component Types

#### Page Components
Large container components that orchestrate multiple controllers:

```typescript
@customElement('lab-book-page')
class LabBookPage extends LitElement {
  private labBookController = new LabBookController();
  private projectController = new ProjectController();
  
  render() {
    return html`
      <div class="page-layout">
        <project-selector .controller=${this.projectController}></project-selector>
        <lab-entry-list .controller=${this.labBookController}></lab-entry-list>
        <entry-editor .controller=${this.labBookController}></entry-editor>
      </div>
    `;
  }
}
```

#### UI Components
Reusable components focused on specific functionality:
- **Form Components**: Entry forms, protocol editors, user management
- **Display Components**: Entry cards, project lists, calendar views
- **Interactive Components**: Rich text editors, file uploaders, search filters

### Shoelace Integration
Primary UI components from Shoelace:
- `sl-button`, `sl-input`, `sl-textarea` for forms
- `sl-card`, `sl-dialog`, `sl-drawer` for layout
- `sl-alert`, `sl-spinner`, `sl-progress-bar` for feedback
- `sl-menu`, `sl-dropdown`, `sl-tab-group` for navigation

### API Integration

#### tRPC Client Integration
```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/router';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include', // For session cookies
        });
      },
    }),
  ],
});
```

#### Error Handling
- **Network Errors**: Retry logic with exponential backoff
- **Authentication Errors**: Redirect to login
- **Validation Errors**: Display inline validation messages
- **Server Errors**: User-friendly error messages

### State Management

#### Signal Patterns
```typescript
// Domain signals
const projects = signal<Project[]>([]);
const currentProject = signal<Project | null>(null);

// UI signals
const isLoading = signal(false);
const searchQuery = signal('');

// Computed signals
const filteredProjects = computed(() => 
  projects.value.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);
```

## Database Design

### Schema Overview

The database follows a normalized relational design with clear separation of concerns for users, projects, experiments, lab entries, and protocols. All tables use UUID primary keys for security and scalability.

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    departure_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('user', 'researcher', 'admin');
```

#### Projects Table
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_archived BOOLEAN DEFAULT false,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Project Members Table (Many-to-Many with Roles)
```sql
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role project_role NOT NULL,
    invited_by UUID NOT NULL REFERENCES users(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

CREATE TYPE project_role AS ENUM ('owner', 'manager', 'collaborator');
```

#### Experiment Types (Techniques) Table
```sql
CREATE TABLE experiment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial data
INSERT INTO experiment_types (name) VALUES 
    ('Culture cellulaire'),
    ('Extraction ARN'),
    ('QRTPCR'),
    ('Western blot'),
    ('Extraction de protéines'),
    ('Dosage de protéines'),
    ('Dosage d''ARN'),
    ('Migration'),
    ('Invasion'),
    ('Immunocytochimie');
```

#### Experiments Table
```sql
CREATE TABLE experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, project_id)
);
```

#### Experiment Types Association Table (Many-to-Many)
```sql
CREATE TABLE experiment_experiment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    experiment_type_id UUID NOT NULL REFERENCES experiment_types(id) ON DELETE CASCADE,
    UNIQUE(experiment_id, experiment_type_id)
);
```

#### Lab Notebooks Table
```sql
CREATE TABLE lab_notebooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id),
    is_confidential BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Lab Entries Table
```sql
CREATE TABLE lab_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    notebook_id UUID NOT NULL REFERENCES lab_notebooks(id) ON DELETE CASCADE,
    experiment_id UUID NOT NULL REFERENCES experiments(id),
    author_id UUID NOT NULL REFERENCES users(id),
    validation_status entry_validation_status DEFAULT 'draft',
    validated_by UUID REFERENCES users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE entry_validation_status AS ENUM ('draft', 'pending_validation', 'validated');
```

#### Shared Protocols Table
```sql
CREATE TABLE shared_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    status protocol_status DEFAULT 'pending_validation',
    created_by UUID NOT NULL REFERENCES users(id),
    validated_by UUID REFERENCES users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE protocol_status AS ENUM ('pending_validation', 'validated', 'archived');
```

#### Protocol Versions Table (for versioning)
```sql
CREATE TABLE protocol_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_id UUID NOT NULL REFERENCES shared_protocols(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(protocol_id, version_number)
);
```

#### Invitations Table
```sql
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    invited_role user_role NOT NULL,
    invited_by UUID NOT NULL REFERENCES users(id),
    project_id UUID REFERENCES projects(id), -- For project-specific invitations
    departure_date DATE, -- Optional departure date
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Audit Log Table
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action audit_action NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'view');
```

### Indexes for Performance

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Project indexes
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_archived ON projects(is_archived);

-- Project members indexes
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_members_role ON project_members(role);

-- Experiment indexes
CREATE INDEX idx_experiments_project ON experiments(project_id);
CREATE INDEX idx_experiments_created_by ON experiments(created_by);

-- Lab entry indexes
CREATE INDEX idx_lab_entries_notebook ON lab_entries(notebook_id);
CREATE INDEX idx_lab_entries_experiment ON lab_entries(experiment_id);
CREATE INDEX idx_lab_entries_author ON lab_entries(author_id);
CREATE INDEX idx_lab_entries_created_at ON lab_entries(created_at);
CREATE INDEX idx_lab_entries_validation_status ON lab_entries(validation_status);

-- Protocol indexes
CREATE INDEX idx_shared_protocols_status ON shared_protocols(status);
CREATE INDEX idx_shared_protocols_created_by ON shared_protocols(created_by);

-- Audit log indexes
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### Database Constraints and Business Rules

#### Foreign Key Constraints
- All foreign keys include appropriate CASCADE/RESTRICT rules
- User deletion is restricted if they own projects or have entries
- Project deletion cascades to experiments and project memberships

#### Check Constraints
```sql
-- Ensure at least one project owner
ALTER TABLE project_members ADD CONSTRAINT ensure_project_has_owner 
CHECK (role != 'owner' OR 
       EXISTS (SELECT 1 FROM project_members pm2 
               WHERE pm2.project_id = project_id 
               AND pm2.role = 'owner' 
               AND pm2.id != id));

-- Validate departure dates are in the future
ALTER TABLE users ADD CONSTRAINT valid_departure_date 
CHECK (departure_date IS NULL OR departure_date > CURRENT_DATE);

-- Ensure experiment has at least one type
ALTER TABLE experiments ADD CONSTRAINT experiment_has_types
CHECK (EXISTS (SELECT 1 FROM experiment_experiment_types eet 
               WHERE eet.experiment_id = id));
```

#### Unique Constraints
- Email addresses are unique across users
- Experiment names are unique within a project
- Project member combinations are unique

### Data Access Patterns

#### Permission-Based Queries
The database design supports efficient permission checking:

```sql
-- Get projects accessible to a user
SELECT DISTINCT p.* 
FROM projects p
JOIN project_members pm ON p.id = pm.project_id
WHERE pm.user_id = $user_id 
  AND p.is_archived = false;

-- Get lab entries for a project with permission check
SELECT le.* 
FROM lab_entries le
JOIN experiments e ON le.experiment_id = e.id
JOIN project_members pm ON e.project_id = pm.project_id
WHERE pm.user_id = $user_id 
  AND e.project_id = $project_id;
```

#### Hierarchical Data Access
```sql
-- Get complete project hierarchy
SELECT 
    p.name as project_name,
    e.name as experiment_name,
    le.title as entry_title,
    le.created_at
FROM projects p
JOIN experiments e ON p.id = e.project_id
JOIN lab_entries le ON e.id = le.experiment_id
WHERE p.id = $project_id
ORDER BY le.created_at DESC;
```

### Migration Strategy

The database schema will be managed through versioned migrations:

1. **Initial Schema**: Core tables and relationships
2. **Permissions Setup**: Role-based access control
3. **Audit System**: Logging and tracking
4. **Performance Optimization**: Indexes and constraints
5. **Data Seeding**: Initial experiment types and admin user

Each migration includes both forward and rollback scripts for safe deployment.

## Git Workflow and Version Control

### Conventional Commits

The project uses conventional commits for standardized commit messages and automated changelog generation.

#### Commit Format
```
type(scope): description

[optional body]

[optional footer(s)]
```

#### Common Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates

#### Monorepo Scopes
Since backend and frontend are in the same repository, use these scopes:
- `backend`: Backend-specific changes
- `frontend`: Frontend-specific changes
- `api`: API layer changes
- `ui`: UI component changes
- `components`: Shared component changes
- `services`: Service layer changes
- `db`: Database schema or migration changes

#### Examples
```
feat(backend): add user authentication system
feat(frontend): add login component
fix(api): handle validation errors in user registration
docs(readme): update setup instructions
chore(deps): update TypeScript to v5.3
refactor(components): extract common button styles
test(backend): add integration tests for auth endpoints
```

### Changelog Generation

Changelogs are automatically generated from conventional commits using the commit history. This ensures:
- Consistent release documentation
- Clear communication of changes to stakeholders
- Automated versioning based on semantic versioning principles

### Development Workflow

#### AI/LLM Guidelines
- **AI assistants should NEVER commit changes directly**
- All commits must be done manually by developers
- AI can suggest commit messages following conventional commit format
- Code reviews and final commits remain human-controlled

#### Branch Strategy
- `main`: Production-ready code
- Feature branches: `feat/feature-name` or `fix/issue-description`
- Follow conventional naming for branches when possible

#### Commit Guidelines
- Make atomic commits (one logical change per commit)
- Write clear, descriptive commit messages
- Include scope when the change affects a specific area
- Use imperative mood in descriptions ("add" not "added")
- Keep the first line under 72 characters
- Add body text for complex changes explaining the "why"
