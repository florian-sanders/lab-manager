# User Stories - Labmanager

## User Personas

### 👤 Regular User
- Research assistant, lab technician, or student
- Creates lab entries and experiments
- Collaborates on projects
- Default role with basic permissions

### 🔬 Researcher
- Senior researcher, PhD student, or postdoc
- Manages projects and invites team members
- Has elevated permissions
- Can validate protocols and entries

### 🏛️ Administrator
- Lab director or IT administrator
- Full system access and user management
- Manages global settings and system maintenance

---

## Epic 1: Authentication & User Management

### User Registration & Invitation System

**US-001** 📧 **Invitation-Only Registration**
> **As an** administrator or researcher  
> **I want to** invite new users by email with optional departure dates  
> **So that** I can control who has access to the lab system and manage temporary access  

**Acceptance Criteria:**
- [ ] Only admins and researchers can send invitations
- [ ] Researchers can only invite users (not other researchers)
- [ ] Admins can invite users or researchers
- [ ] Optional departure date sets automatic account deactivation
- [ ] Invitation email contains secure validation link
- [ ] Link expires after 7 days
- [ ] Invited users are automatically assigned to inviter's projects (for researchers)

**US-002** ✅ **Email Validation & Account Activation**
> **As an** invited user  
> **I want to** validate my email and activate my account  
> **So that** I can access the lab management system  

**Acceptance Criteria:**
- [ ] User receives email with validation link
- [ ] Link contains secure token
- [ ] Account is only activated after email validation
- [ ] User can set password during activation
- [ ] Invalid or expired tokens show appropriate error messages

**US-003** 🔐 **Secure Login System**
> **As a** registered user  
> **I want to** log in securely with my credentials  
> **So that** I can access my lab data safely  

**Acceptance Criteria:**
- [ ] Email and password authentication
- [ ] Session-based authentication with secure cookies
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts
- [ ] Secure logout functionality

### User Role Management

**US-004** 👑 **Role Assignment**
> **As an** administrator  
> **I want to** assign researcher roles to users  
> **So that** I can delegate project management responsibilities  

**Acceptance Criteria:**
- [ ] Only admins can promote users to researchers
- [ ] Role changes are immediately effective
- [ ] Users are notified of role changes
- [ ] Audit trail of role modifications

**US-005** ⏰ **Automatic Account Deactivation**
> **As an** administrator  
> **I want** user accounts to be automatically deactivated on their departure date  
> **So that** access is controlled for temporary team members  

**Acceptance Criteria:**
- [ ] Daily job checks for users with departure dates
- [ ] Accounts are deactivated but data is preserved
- [ ] Deactivated users cannot log in
- [ ] Admins can manually reactivate accounts
- [ ] Notification sent to user and admin before deactivation

---

## Epic 2: Project Management

### Project Creation & Organization

**US-006** 📁 **Project Creation**
> **As a** researcher  
> **I want to** create new research projects with names and descriptions  
> **So that** I can organize my lab work thematically  

**Acceptance Criteria:**
- [ ] Only researchers can create projects
- [ ] Project creator becomes automatic owner
- [ ] Projects require name and optional description
- [ ] Project names must be unique per creator
- [ ] Projects are active by default

**US-007** 👥 **Project Team Management**
> **As a** project owner  
> **I want to** invite team members with specific roles  
> **So that** I can collaborate effectively while maintaining control  

**Acceptance Criteria:**
- [ ] Owners can invite managers and collaborators
- [ ] Managers can invite only collaborators
- [ ] Each user has one role per project
- [ ] Role changes require appropriate permissions
- [ ] Team members receive notification of assignment

**US-008** 🗂️ **Project Archival**
> **As a** project owner  
> **I want to** archive completed projects  
> **So that** I can keep my workspace organized while preserving data  

**Acceptance Criteria:**
- [ ] Only project owners can archive projects
- [ ] Archived projects become read-only
- [ ] All project data remains accessible
- [ ] Archived projects don't appear in active lists
- [ ] Can be unarchived by owners or admins

### Project Permissions

**US-009** 🔒 **Role-Based Project Access**
> **As a** project member  
> **I want** my access rights to match my project role  
> **So that** I can contribute appropriately while respecting data security  

**Acceptance Criteria:**
- [ ] Owners: Full project control including member management
- [ ] Managers: Can modify all project data and manage collaborators
- [ ] Collaborators: Can create/read all data, modify only their own
- [ ] Permission checks on all data operations
- [ ] Clear error messages for unauthorized actions

**US-010** 🔄 **Project Ownership Transfer**
> **As an** administrator  
> **I want to** transfer project ownership between researchers  
> **So that** I can handle personnel changes and maintain project continuity  

**Acceptance Criteria:**
- [ ] Only admins can transfer ownership
- [ ] New owner must be a researcher
- [ ] Projects must always have at least one owner
- [ ] Previous owner becomes manager automatically
- [ ] All parties are notified of the change

---

## Epic 3: Lab Notebook System

### Notebook & Entry Management

**US-011** 📚 **Lab Notebook Creation**
> **As a** user  
> **I want to** create multiple lab notebooks with titles and descriptions  
> **So that** I can organize my research entries logically  

**Acceptance Criteria:**
- [ ] Users can create multiple notebooks
- [ ] Notebooks require title and optional description
- [ ] Notebooks have confidentiality settings
- [ ] Default sharing with all project members
- [ ] Optional confidential mode restricts access

**US-012** ✍️ **Lab Entry Creation**
> **As a** user  
> **I want to** create dated lab entries linked to experiments  
> **So that** I can document my daily research activities  

**Acceptance Criteria:**
- [ ] Entries require title, content, and experiment assignment
- [ ] Rich text editor for entry content
- [ ] Automatic timestamp on creation
- [ ] Multiple entries per day allowed
- [ ] Entries can include images and tables
- [ ] Draft/published status system

**US-013** 🔗 **Experiment Association**
> **As a** user  
> **I want to** link each lab entry to a specific experiment  
> **So that** I can track the progress of my research subjects  

**Acceptance Criteria:**
- [ ] Every entry must be linked to an experiment
- [ ] Dropdown selection of available experiments
- [ ] Can only select experiments from accessible projects
- [ ] Entry context shows project and experiment details
- [ ] Easy navigation between related entries

### Experiment Management

**US-014** 🧪 **Experiment Creation**
> **As a** user  
> **I want to** create experiments with multiple technique types  
> **So that** I can categorize and track different types of research work  

**Acceptance Criteria:**
- [ ] Experiments require name and project assignment
- [ ] Must select at least one technique type
- [ ] Multiple technique types allowed
- [ ] Experiment names unique within project
- [ ] Predefined list of available techniques
- [ ] Can add new experiments on-the-fly during entry creation

**US-015** 🏷️ **Experiment Type Management**
> **As an** administrator  
> **I want to** manage the list of available experiment techniques  
> **So that** users have consistent categorization options  

**Acceptance Criteria:**
- [ ] Predefined techniques: Culture cellulaire, Extraction ARN, QRTPCR, Western blot, etc.
- [ ] Admins can add/edit/deactivate technique types
- [ ] Deactivated types remain on existing experiments
- [ ] New types immediately available for selection
- [ ] Technique descriptions for user guidance

### Content Integration

**US-016** 📊 **Excel Import**
> **As a** user  
> **I want to** import Excel tables into my lab entries  
> **So that** I can include data analysis directly in my research documentation  

**Acceptance Criteria:**
- [ ] File upload interface in entry editor
- [ ] Excel files converted to HTML tables
- [ ] Preserves basic formatting and structure
- [ ] Size limits for uploaded files
- [ ] Error handling for invalid files

**US-017** 🖼️ **Image Management**
> **As a** user  
> **I want to** insert images into my lab entries  
> **So that** I can document visual results and experimental setups  

**Acceptance Criteria:**
- [ ] Image upload in entry editor
- [ ] Support common formats (PNG, JPG, GIF)
- [ ] Image compression and optimization
- [ ] Thumbnail generation
- [ ] Alt text for accessibility

**US-018** 📋 **Protocol Integration**
> **As a** user  
> **I want to** insert shared protocols into my entries  
> **So that** I can reference and modify standard procedures  

**Acceptance Criteria:**
- [ ] Access to shared protocol library from entry editor
- [ ] Insert protocol as editable text
- [ ] Maintains reference to original protocol
- [ ] Can modify inserted protocols without affecting original
- [ ] Version tracking for protocol references

---

## Epic 4: Protocol Management

### Shared Protocol System

**US-019** 📖 **Protocol Library Access**
> **As a** user  
> **I want to** access a shared library of lab protocols  
> **So that** I can use standardized procedures in my experiments  

**Acceptance Criteria:**
- [ ] Universal access to all validated protocols
- [ ] Search and filter protocols by technique type
- [ ] View protocol details and versions
- [ ] Copy protocols to personal notebooks
- [ ] Rate and comment on protocols

**US-020** ➕ **Protocol Submission**
> **As a** user  
> **I want to** submit new protocols for shared use  
> **So that** I can contribute to the lab's knowledge base  

**Acceptance Criteria:**
- [ ] Protocol creation form with title and content
- [ ] Rich text editor for protocol content
- [ ] Automatic submission for validation
- [ ] Status tracking (pending/approved/rejected)
- [ ] Email notifications on status changes

**US-021** ✅ **Protocol Validation**
> **As a** researcher or manager  
> **I want to** review and approve submitted protocols  
> **So that** I can ensure quality and accuracy of shared procedures  

**Acceptance Criteria:**
- [ ] Validation queue for pending protocols
- [ ] Side-by-side comparison for protocol updates
- [ ] Approve/reject with comments
- [ ] Version history tracking
- [ ] Notification to protocol author

### Protocol Versioning

**US-022** 📝 **Protocol Updates**
> **As a** user  
> **I want to** suggest updates to existing protocols  
> **So that** procedures can be improved based on experience  

**Acceptance Criteria:**
- [ ] Edit existing protocols creates new version
- [ ] Previous versions remain accessible
- [ ] Change tracking and comparison view
- [ ] Update requires validation like new protocols
- [ ] Automatic notification to protocol subscribers

**US-023** 📚 **Version History**
> **As a** user  
> **I want to** view the version history of protocols  
> **So that** I can track how procedures have evolved  

**Acceptance Criteria:**
- [ ] Chronological list of all protocol versions
- [ ] Diff view between versions
- [ ] Author and date information for each version
- [ ] Ability to revert to previous versions
- [ ] Download specific versions

---

## Epic 5: Data Access & Navigation

### Entry Organization & Search

**US-024** 🔍 **Multi-Criteria Filtering**
> **As a** user  
> **I want to** filter lab entries by project, experiment, and technique type  
> **So that** I can quickly find relevant research data  

**Acceptance Criteria:**
- [ ] Filter dropdowns for project, experiment, technique
- [ ] Date range filtering
- [ ] Text search in entry titles and content
- [ ] Combined filter criteria
- [ ] Save and load filter presets
- [ ] Clear all filters option

**US-025** 📅 **Chronological Organization**
> **As a** user  
> **I want to** view my entries in chronological order  
> **So that** I can track the timeline of my research progress  

**Acceptance Criteria:**
- [ ] Default chronological sorting (newest first)
- [ ] Alternative sorting options (oldest first, by title)
- [ ] Pagination for large entry lists
- [ ] Jump to specific date ranges
- [ ] Calendar view for entry overview

**US-026** 🗂️ **Hierarchical Navigation**
> **As a** user  
> **I want to** navigate from projects to experiments to entries  
> **So that** I can understand the context and relationships of my work  

**Acceptance Criteria:**
- [ ] Breadcrumb navigation showing Project → Experiment → Entry
- [ ] Quick access to parent and sibling items
- [ ] Entry count indicators at each level
- [ ] Expandable tree view for complex projects
- [ ] Back/forward navigation history

### Data Views & Analysis

**US-027** 📊 **Project Overview**
> **As a** project member  
> **I want to** see all entries and experiments in a project  
> **So that** I can understand the complete scope of the research  

**Acceptance Criteria:**
- [ ] Project dashboard with summary statistics
- [ ] List of all experiments in project
- [ ] Recent entries from all project members
- [ ] Activity timeline for project
- [ ] Export project data functionality

**US-028** 🔬 **Experiment Tracking**
> **As a** user  
> **I want to** view all entries related to a specific experiment  
> **So that** I can track the complete evolution of my research subject  

**Acceptance Criteria:**
- [ ] Experiment detail page with all related entries
- [ ] Timeline view of experiment progress
- [ ] Technique type breakdown for experiment
- [ ] Related experiments suggestions
- [ ] Experiment statistics and insights

**US-029** 📑 **Entry Comparison**
> **As a** user  
> **I want to** compare entries from similar experiments  
> **So that** I can identify patterns and variations in my research  

**Acceptance Criteria:**
- [ ] Side-by-side entry comparison view
- [ ] Highlight differences in protocols and results
- [ ] Filter by similar technique types
- [ ] Export comparison reports
- [ ] Save comparison configurations

---

## Epic 6: Validation & Quality Control

### Entry Validation System

**US-030** ✅ **Entry Validation Workflow**
> **As a** researcher or project manager  
> **I want to** validate lab entries from team members  
> **So that** I can ensure research quality and accuracy  

**Acceptance Criteria:**
- [ ] Validation queue for pending entries
- [ ] Entry review interface with comments
- [ ] Approve/reject with feedback
- [ ] Email notifications for validation status
- [ ] Validation history tracking
- [ ] Bulk validation operations

**US-031** 📝 **Draft Entry Management**
> **As a** user  
> **I want to** save entries as drafts before publishing  
> **So that** I can work on entries over time without premature validation  

**Acceptance Criteria:**
- [ ] Draft/published status for entries
- [ ] Auto-save functionality for drafts
- [ ] Draft entries visible only to author
- [ ] Convert draft to published triggers validation
- [ ] Draft indicators in entry lists

**US-032** 🔔 **Validation Notifications**
> **As a** user  
> **I want to** receive notifications about validation status  
> **So that** I can respond quickly to feedback and approvals  

**Acceptance Criteria:**
- [ ] Email notifications for validation requests
- [ ] In-app notification system
- [ ] Notification preferences per user
- [ ] Batch notifications for multiple entries
- [ ] Escalation for overdue validations

### Access Control & Security

**US-033** 🔒 **Confidential Notebook Access**
> **As a** project manager  
> **I want to** control access to confidential notebooks  
> **So that** I can protect sensitive research data  

**Acceptance Criteria:**
- [ ] Confidential flag on notebook creation
- [ ] Access request system for confidential notebooks
- [ ] Manager approval required for access
- [ ] Audit trail of access grants
- [ ] Temporary access with expiration dates

**US-034** 👀 **Data Visibility Rules**
> **As a** user  
> **I want** to see only data I have permission to access  
> **So that** data security is maintained automatically  

**Acceptance Criteria:**
- [ ] Permission-based data filtering on all views
- [ ] Clear indicators of restricted content
- [ ] Graceful degradation for limited access
- [ ] No exposure of unauthorized data in search results
- [ ] Consistent permission enforcement across all features

---

## Epic 7: Calendar & Planning

### Experiment Planning

**US-035** 📅 **Calendar Integration**
> **As a** user  
> **I want to** sync my lab schedule with my Gmail calendar  
> **So that** I can coordinate lab work with other commitments  

**Acceptance Criteria:**
- [ ] OAuth integration with Gmail calendar
- [ ] Two-way sync between lab calendar and Gmail
- [ ] Lab events appear in Gmail calendar
- [ ] Gmail events visible in lab calendar
- [ ] Conflict detection and warnings

**US-036** ⏰ **Experiment Scheduling**
> **As a** user  
> **I want to** schedule experiment activities in advance  
> **So that** I can plan my lab time effectively  

**Acceptance Criteria:**
- [ ] Create calendar events for experiments
- [ ] Link calendar events to specific experiments
- [ ] Recurring experiment schedules
- [ ] Resource conflict detection
- [ ] Reminder notifications before scheduled activities

**US-037** 👥 **Team Schedule Visibility**
> **As a** project manager  
> **I want to** view and modify team members' lab schedules  
> **So that** I can coordinate team activities and optimize resource use  

**Acceptance Criteria:**
- [ ] Team calendar view showing all member schedules
- [ ] Edit permissions for manager on team schedules
- [ ] Collaborative scheduling with conflict resolution
- [ ] Team availability overview
- [ ] Schedule export and sharing

---

## Epic 8: Communication & Notifications

### Internal Communication

**US-038** 📧 **Email Integration**
> **As a** user  
> **I want to** send emails directly from the lab management system  
> **So that** I can communicate about research without leaving the platform  

**Acceptance Criteria:**
- [ ] Compose emails to team members
- [ ] Include lab entry or experiment links in emails
- [ ] Email templates for common communications
- [ ] Delivery tracking and read receipts
- [ ] Integration with existing email client

**US-039** 🔔 **Automated Notifications**
> **As a** user  
> **I want to** receive automatic notifications for important events  
> **So that** I can stay informed about project activities and requirements  

**Acceptance Criteria:**
- [ ] Validation request notifications
- [ ] Project assignment notifications
- [ ] Deadline reminders for scheduled experiments
- [ ] Protocol approval notifications
- [ ] System maintenance announcements
- [ ] Customizable notification preferences

### Collaboration Features

**US-040** 💬 **Entry Comments**
> **As a** project member  
> **I want to** comment on lab entries  
> **So that** I can provide feedback and ask questions about research  

**Acceptance Criteria:**
- [ ] Comment system on lab entries
- [ ] Reply to comments functionality
- [ ] Notification when entries are commented on
- [ ] Edit/delete own comments
- [ ] Moderator controls for inappropriate comments

**US-041** 🤝 **Research Collaboration**
> **As a** user  
> **I want to** easily reference related work by team members  
> **So that** I can build on existing research and avoid duplication  

**Acceptance Criteria:**
- [ ] Related entries suggestions based on techniques
- [ ] Cross-reference entries from different experiments
- [ ] Mention system for referencing team members
- [ ] Collaborative experiment tracking
- [ ] Shared experiment notes and observations

---

## Epic 9: System Administration

### User Management

**US-042** 👥 **User Administration**
> **As an** administrator  
> **I want to** manage all user accounts and permissions  
> **So that** I can maintain system security and proper access control  

**Acceptance Criteria:**
- [ ] User list with role and status information
- [ ] Bulk user operations (activate/deactivate/delete)
- [ ] Password reset functionality
- [ ] Account merge capabilities for duplicate accounts
- [ ] User activity monitoring and reporting

**US-043** 📊 **System Analytics**
> **As an** administrator  
> **I want to** view system usage statistics  
> **So that** I can monitor adoption and identify areas for improvement  

**Acceptance Criteria:**
- [ ] User activity dashboards
- [ ] Entry creation statistics
- [ ] Project and experiment metrics
- [ ] System performance monitoring
- [ ] Export analytics data

### Data Management

**US-044** 💾 **Data Backup & Recovery**
> **As an** administrator  
> **I want** automated backups and recovery procedures  
> **So that** research data is protected against loss  

**Acceptance Criteria:**
- [ ] Automated daily database backups
- [ ] File storage backup procedures
- [ ] Point-in-time recovery capabilities
- [ ] Backup integrity verification
- [ ] Disaster recovery documentation

**US-045** 📤 **Data Export**
> **As a** user  
> **I want to** export my research data in standard formats  
> **So that** I can use it in other applications and comply with data retention policies  

**Acceptance Criteria:**
- [ ] Export entries to PDF, Word, and Excel formats
- [ ] Bulk export for projects and experiments
- [ ] Include images and formatting in exports
- [ ] Metadata preservation in exported files
- [ ] Scheduled automated exports

---

## Acceptance Testing Scenarios

### Priority Levels
- **🔴 Critical**: Core functionality required for MVP
- **🟡 Important**: Major features for full functionality  
- **🟢 Nice-to-have**: Enhancement features for future versions

### Story Dependencies
Many stories depend on foundational features:
- Authentication system (US-001, US-002, US-003) enables all other features
- Project management (US-006, US-007) required for lab notebook features
- Permission system (US-009, US-033, US-034) affects all data access

### Integration Points
- Gmail calendar synchronization (US-035, US-036)
- Email system integration (US-001, US-002, US-032, US-038)
- File upload and processing (US-016, US-017)
- Rich text editing across multiple features