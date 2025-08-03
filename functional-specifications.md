# Brief Technique - Application Labmanager

## Vue d'ensemble du projet

**Nom du projet :** Labmanager  
**Type d'application :** Application web de gestion de laboratoire de recherche  
**Objectif :** Créer une plateforme collaborative et intuitive permettant le suivi quotidien de l'activité de recherche d'un laboratoire

## Concept général

Labmanager est une application collaborative conçue pour faciliter la gestion d'une équipe de recherche. L'application doit être intuitive et permettre un suivi efficace des activités de recherche au quotidien. Le pilier principal de l'application repose sur la création d'un cahier de laboratoire électronique.

## Architecture technique requise

- **Interface :** Application web responsive
- **Authentification :** Système de connexion sécurisé
- **Intégrations externes :** 
 - Calendrier Gmail
 - Système d'envoi d'emails

## Gestion des utilisateurs et autorisations (IAM)

### Processus d'invitation et inscription
- **Invitation uniquement** : Pas d'auto-inscription, les utilisateurs doivent être invités
- **Invitations par admin** : Peuvent inviter des utilisateurs ou des chercheurs
- **Invitations par chercheur** : Peuvent inviter uniquement des utilisateurs
- **Paramètres d'invitation utilisateur** :
  - Date de départ optionnelle (désactivation automatique du compte)
  - Assignation immédiate aux projets gérés par le chercheur invitant
- **Validation par email** : Réception d'un lien de confirmation à cliquer
- **Activation** : Accès à l'application uniquement après validation email

### Rôles et permissions

#### Utilisateurs (rôle par défaut)
**Droits :**
- Créer des entrées de cahier, expériences, techniques
- Lire toutes les données qu'ils ont créées
- Lire toutes les données liées aux projets auxquels ils sont associés

#### Chercheurs
**Attribution :** Rôle accordé par un administrateur
**Droits globaux :** Tous les droits utilisateurs +
- Inviter de nouveaux utilisateurs avec date de départ optionnelle
- Créer de nouveaux projets (deviennent automatiquement propriétaires)
- **Droits par projet :** Déterminés par leur rôle spécifique dans chaque projet (propriétaire/gestionnaire/collaborateur)

#### Administrateurs
**Droits :** Accès complet et modification de toutes les données
- Gestion globale du système
- Inviter de nouveaux utilisateurs ou chercheurs
- Attribution des rôles chercheur et propriétaire de projet
- Transfert de propriété de projet entre chercheurs
- Suppression de projets
- Un projet doit toujours avoir au moins un propriétaire

### Rôles par projet
Chaque utilisateur a un rôle spécifique pour chaque projet auquel il participe :

#### Propriétaire de projet
- Inviter des gestionnaires de projet et des collaborateurs
- Tous les droits des gestionnaires de projet
- Archiver le projet
- Désassigner tous les participants (gestionnaires et collaborateurs)

#### Gestionnaire de projet  
- Inviter uniquement des collaborateurs
- Modifier toutes les données du projet (entrées, expériences, etc.)
- Ne peut pas supprimer de données
- Assigner/désassigner des collaborateurs

#### Collaborateur
- Créer des entrées de cahier, expériences, techniques
- Lire toutes les données du projet
- Modifier uniquement ses propres données
- Droits équivalents à un utilisateur standard pour ce projet

### Cycle de vie des projets
- **Création** : Par un chercheur qui devient automatiquement propriétaire
- **État actif** : Lecture/écriture normale selon les permissions
- **Archivage** : Par un propriétaire, projet devient en lecture seule
- **Suppression** : Par un administrateur uniquement

### Gestion automatique des utilisateurs
- **Désactivation automatique** : Les utilisateurs avec une date de départ sont automatiquement désactivés à cette date
- **Statut inactif** : Perte d'accès à l'application, données conservées

## Fonctionnalités principales

### 1. Cahier de laboratoire électronique (Fonctionnalité principale)

#### Structure du système
- **Projets** : Regroupements thématiques de recherche avec nom et description
  - Relation 1:N entre projet et expériences
- **Expériences/Sujets** : Entités avec identifiants et noms uniques représentant les sujets de recherche
  - Chaque expérience appartient à un seul projet
  - Nom d'expérience unique (texte libre + projet)
  - Types d'expériences multiples choisis parmi une liste de techniques disponibles
  - Relation 0:N entre expérience et entrées de cahier
  - Relation N:N entre expérience et types d'expériences (techniques)
- **Cahier conteneur** : Chaque utilisateur peut créer plusieurs cahiers avec titre et description
- **Entrées individuelles** : Chaque cahier contient des entrées datées (comme un journal)
- **Liaison expérience-entrée** : Chaque entrée est obligatoirement rattachée à une expérience/sujet
- **Entrées multiples par jour** : Possibilité de créer plusieurs entrées dans la même journée pour différents sujets
- **Création d'entrées** : Interface pour ajouter de nouvelles entrées avec titre, contenu libre et sélection d'expérience
- **Datation automatique** : Chaque entrée est automatiquement datée à sa création
- **Création d'expériences** : Interface de création avec sélection de projet et types d'expériences multiples
- **Gestion des types** : Administration des types d'expériences disponibles

#### Interface de rédaction des entrées
- **Éditeur de texte** : Interface de traitement de texte pour décrire les expériences dans chaque entrée
- **Liberté de rédaction** : L'utilisateur peut écrire librement dans chaque entrée
- **Titre d'entrée** : Chaque entrée possède un titre descriptif

#### Gestion des protocoles et types d'expériences
- **Types d'expériences** : Liste de techniques disponibles pour caractériser les expériences
  - Techniques disponibles : Culture cellulaire, Extraction ARN, QRTPCR, Western blot, Extraction de protéines, Dosage de protéines, Dosage d'ARN, Migration, Invasion, Immunocytochimie
  - Sélection multiple possible lors de la création d'une expérience
  - Au moins un type requis par expérience
- **Templates de protocoles** : Possibilité d'intégrer des templates modifiables dans les entrées
- **Base de données de protocoles** : Insertion de protocoles pré-formatés dans les entrées
- **Édition directe** : Modification des protocoles directement dans l'entrée
- **Réutilisation facile** : Accès rapide aux expériences précédentes pour répétition

#### Organisation et navigation
- **Vue projet** : Consultation de toutes les entrées liées aux expériences d'un projet
- **Vue cahier complet** : Possibilité d'afficher toutes les entrées d'un cahier chronologiquement
- **Vue entrée individuelle** : Consultation d'une entrée spécifique avec ses détails
- **Vue par expérience** : Consultation de toutes les entrées liées à une expérience/sujet spécifique
- **Classement chronologique** : Tri des entrées par dates au sein de chaque cahier
- **Filtrage multi-critères** : Possibilité de filtrer par projet, expérience, ou types d'expériences
- **Navigation hiérarchique** : Projet → Expériences → Entrées
- **Pagination** : Navigation efficace dans les cahiers avec de nombreuses entrées
- **Comparaison d'expériences** : Visualisation rapide des expériences similaires entre différentes entrées

#### Intégration de contenu dans les entrées
- **Import Excel** : Insertion de tableaux depuis des classeurs Excel dans les entrées
- **Gestion d'images** : Possibilité d'insérer des images dans les entrées
- **Inventaire intégré** : Accès à l'inventaire des produits depuis les entrées
- **Suivi d'utilisation** : Ajout direct de produits dans les entrées pour traçabilité
- **Référence expérience** : Chaque entrée est obligatoirement associée à une expérience/sujet
- **Continuité expérimentale** : Suivi de l'évolution d'une expérience à travers plusieurs entrées
- **Contextualisation projet** : Visualisation du contexte projet lors de la création d'entrées

#### Gestion des accès et validation
- **Partage par défaut** : Cahiers accessibles à tous les utilisateurs sauf indication contraire
- **Confidentialité** : Option de classification confidentielle au niveau du cahier
- **Validation des entrées** : Système de validation des entrées individuelles par un chercheur gestionnaire
- **États de validation** : Entrées en brouillon, validées ou nécessitant une validation
- **Gestion des accès confidentiels** : Notification aux gestionnaires de projet pour validation d'accès aux cahiers sensibles

### 2. Onglet protocoles partagés

#### Fonctionnalités
- **Accès universel** : Accessible à tous les utilisateurs du laboratoire
- **Import/Export** : Possibilité d'importer et modifier les protocoles dans les cahiers individuels
- **Validation obligatoire** : Chaque nouveau protocole doit être validé par un chercheur gestionnaire
- **Versioning** : Suivi des modifications des protocoles

### 3. Outil de planification

#### Calendrier intégré
- **Synchronisation Gmail** : Connexion avec le calendrier Gmail
- **Planification d'expériences** : Interface de programmation des activités de recherche
- **Suivi temporel** : Suivi des expériences dans le temps pour optimiser la planification
- **Gestion hiérarchique** : Les chercheurs gestionnaires peuvent accéder et modifier les plannings des utilisateurs de leurs projets

### 4. Système de communication

#### Notifications
- **Alertes automatiques** : Notifications pour les validations requises
- **Gestion des accès** : Alertes pour les demandes d'accès aux données confidentielles

#### Messagerie intégrée
- **Envoi d'emails** : Possibilité d'envoyer des emails directement depuis l'application
- **Communication interne** : Facilitation des échanges entre membres de l'équipe

## Exigences techniques

### Performance et sécurité
- **Sécurité des données** : Chiffrement et protection des données sensibles
- **Sauvegarde automatique** : Système de backup régulier
- **Traçabilité** : Historique des modifications et accès

### Interface utilisateur
- **Design intuitif** : Interface claire et ergonomique
- **Responsive design** : Adaptation aux différents supports (desktop, tablette, mobile)
- **Accessibilité** : Respect des standards d'accessibilité web

### Intégrations
- **API Gmail** : Pour la synchronisation calendrier et l'envoi d'emails
- **Import/Export** : Support des formats Excel, images courantes
- **Base de données robuste** : Gestion efficace des protocoles et données de recherche

## Workflow de validation

1. **Création de contenu** par les utilisateurs
2. **Validation automatique** pour les données standard
3. **Validation manuelle** par les chercheurs gestionnaires pour les données critiques
4. **Notification** aux chercheurs gestionnaires pour les accès confidentiels
5. **Approbation** des nouveaux protocoles par les chercheurs gestionnaires

## Livrables attendus

- Application web fonctionnelle
- Documentation technique complète
- Guide utilisateur
- Procédures de déploiement et maintenance
- Tests de sécurité et performance

## Contraintes et considérations

- **Réglementation** : Respect des normes de traçabilité en recherche
- **Évolutivité** : Architecture permettant l'ajout de nouvelles fonctionnalités
- **Formation** : Interface suffisamment intuitive pour minimiser les besoins de formation
- **Migration** : Possibilité d'import de données existantes si nécessaire