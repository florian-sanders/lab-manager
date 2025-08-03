# Modèle Conceptuel de Données (MCD) - Lab Manager

Ce document présente le Modèle Conceptuel de Données du système Lab Manager sous forme de diagramme Mermaid.

## Diagramme MCD

```mermaid
erDiagram
    %% Entités principales
    USERS {
        UUID id PK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR first_name
        VARCHAR last_name
        ENUM user_role "user, researcher, admin"
        BOOLEAN is_active
        DATE departure_date
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    PROJECTS {
        UUID id PK
        VARCHAR name
        TEXT description
        BOOLEAN is_archived
        UUID created_by FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    PROJECT_MEMBERS {
        UUID id PK
        UUID project_id FK
        UUID user_id FK
        ENUM project_role "owner, manager, collaborator"
        UUID invited_by FK
        TIMESTAMP joined_at
    }

    EXPERIMENTS {
        UUID id PK
        VARCHAR name
        UUID project_id FK
        UUID created_by FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    EXPERIMENT_TYPES {
        UUID id PK
        VARCHAR name UK
        TEXT description
        BOOLEAN is_active
        TIMESTAMP created_at
    }

    EXPERIMENT_EXPERIMENT_TYPES {
        UUID id PK
        UUID experiment_id FK
        UUID experiment_type_id FK
    }

    LAB_NOTEBOOKS {
        UUID id PK
        VARCHAR title
        TEXT description
        UUID owner_id FK
        BOOLEAN is_confidential
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    LAB_ENTRIES {
        UUID id PK
        VARCHAR title
        TEXT content
        UUID notebook_id FK
        UUID experiment_id FK
        UUID author_id FK
        ENUM validation_status "draft, pending_validation, validated"
        UUID validated_by FK
        TIMESTAMP validated_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    SHARED_PROTOCOLS {
        UUID id PK
        VARCHAR title
        TEXT content
        INTEGER version
        ENUM status "pending_validation, validated, archived"
        UUID created_by FK
        UUID validated_by FK
        TIMESTAMP validated_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    PROTOCOL_VERSIONS {
        UUID id PK
        UUID protocol_id FK
        INTEGER version_number
        VARCHAR title
        TEXT content
        UUID created_by FK
        TIMESTAMP created_at
    }

    INVITATIONS {
        UUID id PK
        VARCHAR email
        ENUM invited_role "user, researcher, admin"
        UUID invited_by FK
        UUID project_id FK
        DATE departure_date
        VARCHAR token UK
        TIMESTAMP expires_at
        TIMESTAMP accepted_at
        TIMESTAMP created_at
    }

    AUDIT_LOGS {
        UUID id PK
        VARCHAR table_name
        UUID record_id
        ENUM action "create, update, delete, view"
        JSONB old_values
        JSONB new_values
        UUID user_id FK
        INET ip_address
        TIMESTAMP created_at
    }

    %% Relations entre entités
    
    %% Relations Users
    USERS ||--o{ PROJECTS : "créé par"
    USERS ||--o{ PROJECT_MEMBERS : "invité par"
    USERS ||--o{ PROJECT_MEMBERS : "membre"
    USERS ||--o{ EXPERIMENTS : "créé par"
    USERS ||--o{ LAB_NOTEBOOKS : "propriétaire"
    USERS ||--o{ LAB_ENTRIES : "auteur"
    USERS ||--o{ LAB_ENTRIES : "validé par"
    USERS ||--o{ SHARED_PROTOCOLS : "créé par"
    USERS ||--o{ SHARED_PROTOCOLS : "validé par"
    USERS ||--o{ PROTOCOL_VERSIONS : "créé par"
    USERS ||--o{ INVITATIONS : "invité par"
    USERS ||--o{ AUDIT_LOGS : "utilisateur"

    %% Relations Projects
    PROJECTS ||--o{ PROJECT_MEMBERS : "appartient"
    PROJECTS ||--o{ EXPERIMENTS : "contient"
    PROJECTS ||--o{ INVITATIONS : "invitation projet"

    %% Relations Experiments
    EXPERIMENTS ||--o{ LAB_ENTRIES : "documenté par"
    EXPERIMENTS ||--o{ EXPERIMENT_EXPERIMENT_TYPES : "utilise techniques"

    %% Relations Experiment Types
    EXPERIMENT_TYPES ||--o{ EXPERIMENT_EXPERIMENT_TYPES : "technique"

    %% Relations Lab Notebooks
    LAB_NOTEBOOKS ||--o{ LAB_ENTRIES : "contient"

    %% Relations Shared Protocols
    SHARED_PROTOCOLS ||--o{ PROTOCOL_VERSIONS : "versions"
```

## Description des Entités

### Entités Principales

#### USERS (Utilisateurs)
- **Rôle** : Gestion des utilisateurs du système
- **Attributs clés** : email unique, rôle (user/researcher/admin), statut actif
- **Relations** : Créateur de projets, membre d'équipes, auteur d'entrées

#### PROJECTS (Projets)
- **Rôle** : Organisation des travaux de recherche
- **Attributs clés** : nom, description, statut archivé
- **Relations** : Contient des expériences, a des membres avec rôles

#### EXPERIMENTS (Expériences)
- **Rôle** : Représentation des expériences scientifiques
- **Attributs clés** : nom unique par projet
- **Relations** : Appartient à un projet, utilise des techniques, documenté par des entrées

#### LAB_ENTRIES (Entrées de laboratoire)
- **Rôle** : Documentation des résultats expérimentaux
- **Attributs clés** : titre, contenu, statut de validation
- **Relations** : Appartient à un carnet, documente une expérience

### Entités de Support

#### PROJECT_MEMBERS (Membres de projet)
- **Rôle** : Association utilisateurs-projets avec rôles
- **Rôles disponibles** : owner, manager, collaborator

#### EXPERIMENT_TYPES (Types d'expérience)
- **Rôle** : Catalogue des techniques expérimentales
- **Exemples** : Culture cellulaire, QRTPCR, Western blot

#### SHARED_PROTOCOLS (Protocoles partagés)
- **Rôle** : Procédures standardisées réutilisables
- **Workflow** : Création → Validation → Publication

#### INVITATIONS (Invitations)
- **Rôle** : Gestion des invitations d'utilisateurs
- **Sécurité** : Token unique avec expiration

#### AUDIT_LOGS (Journal d'audit)
- **Rôle** : Traçabilité des actions utilisateurs
- **Actions** : create, update, delete, view

## Contraintes et Règles Métier

### Contraintes d'Intégrité
- Chaque projet doit avoir au moins un propriétaire (owner)
- Les expériences doivent avoir au moins un type
- Les dates de départ doivent être dans le futur
- Les noms d'expériences sont uniques par projet

### Contraintes de Sécurité
- Accès aux données basé sur l'appartenance aux projets
- Validation des protocoles partagés obligatoire
- Journalisation de toutes les actions sensibles

### Performances
- Index sur les colonnes de recherche fréquentes
- Partitioning potentiel pour audit_logs
- Contraintes de clés étrangères optimisées