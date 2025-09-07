-- Create ENUM types
CREATE TYPE user_role AS ENUM ('user', 'researcher', 'admin');
CREATE TYPE project_role AS ENUM ('owner', 'manager', 'collaborator');
CREATE TYPE entry_validation_status AS ENUM ('draft', 'pending_validation', 'validated', 'rejected');
CREATE TYPE protocol_status AS ENUM ('pending_validation', 'validated', 'rejected', 'archived');
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'view');

-- Users table
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

-- Invitations table
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    invited_role user_role NOT NULL,
    invited_by UUID NOT NULL REFERENCES users(id),
    project_id UUID, -- References projects(id), but projects table doesn't exist yet
    departure_date DATE, -- Optional departure date
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_archived BOOLEAN DEFAULT false,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for invitations.project_id after projects table exists
ALTER TABLE invitations ADD CONSTRAINT fk_invitations_project 
FOREIGN KEY (project_id) REFERENCES projects(id);

-- Project members table (Many-to-Many with Roles)
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role project_role NOT NULL,
    invited_by UUID NOT NULL REFERENCES users(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Experiment types (Techniques) table
CREATE TABLE experiment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experiments table
CREATE TABLE experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, project_id)
);

-- Experiments and experiment types many-to-many
CREATE TABLE experiment_experiment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    experiment_type_id UUID NOT NULL REFERENCES experiment_types(id) ON DELETE CASCADE,
    UNIQUE(experiment_id, experiment_type_id)
);

-- Lab notebooks table
CREATE TABLE lab_notebooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id),
    is_confidential BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lab entries table
CREATE TABLE lab_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    notebook_id UUID NOT NULL REFERENCES lab_notebooks(id),
    experiment_id UUID NOT NULL REFERENCES experiments(id),
    author_id UUID NOT NULL REFERENCES users(id),
    validation_status entry_validation_status DEFAULT 'draft',
    validated_by UUID REFERENCES users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shared protocols table
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

-- Protocol versions table
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

-- Calendar events table
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    experiment_id UUID REFERENCES experiments(id),
    gmail_event_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
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

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_expires_at ON invitations(expires_at);

CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_archived ON projects(is_archived);

CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_members_role ON project_members(role);

CREATE INDEX idx_experiments_project ON experiments(project_id);
CREATE INDEX idx_experiments_created_by ON experiments(created_by);

CREATE INDEX idx_lab_entries_notebook ON lab_entries(notebook_id);
CREATE INDEX idx_lab_entries_experiment ON lab_entries(experiment_id);
CREATE INDEX idx_lab_entries_author ON lab_entries(author_id);
CREATE INDEX idx_lab_entries_created_at ON lab_entries(created_at);
CREATE INDEX idx_lab_entries_validation_status ON lab_entries(validation_status);

CREATE INDEX idx_shared_protocols_status ON shared_protocols(status);
CREATE INDEX idx_shared_protocols_created_by ON shared_protocols(created_by);

CREATE INDEX idx_calendar_events_user ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);

CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Constraints and business rules
ALTER TABLE users ADD CONSTRAINT valid_departure_date 
CHECK (departure_date IS NULL OR departure_date > CURRENT_DATE);

-- Initial data for experiment types
INSERT INTO experiment_types (name) VALUES 
    ('Culture cellulaire'),
    ('Extraction ARN'),
    ('QRTPCR'),
    ('Western blot'),
    ('Extraction de protéines'),
    ('Dosage de protéines'),
    ('Dosage d''ARN'),
    ('Migration'),
    ('Immunofluorescence'),
    ('PCR'),
    ('Clonage'),
    ('Transfection');