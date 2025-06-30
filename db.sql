-- =====================================================
-- TelecomDim Database Schema
-- Système de dimensionnement des réseaux GSM
-- =====================================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS telecomdim_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE telecomdim_db;

-- =====================================================
-- TABLE: users
-- Gestion des utilisateurs de l'application
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    organization VARCHAR(255),
    role ENUM('student', 'engineer', 'researcher', 'professor', 'admin', 'other') DEFAULT 'engineer',
    bio TEXT,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_organization (organization),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- TABLE: user_preferences
-- Préférences utilisateur (thème, langue, etc.)
-- =====================================================
CREATE TABLE user_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    theme ENUM('light', 'dark', 'system') DEFAULT 'system',
    language VARCHAR(5) DEFAULT 'fr',
    timezone VARCHAR(50) DEFAULT 'Africa/Dakar',
    notifications_email BOOLEAN DEFAULT TRUE,
    notifications_push BOOLEAN DEFAULT TRUE,
    default_frequency ENUM('900', '1800', '900_1800') DEFAULT '900',
    auto_save BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_preferences (user_id)
);

-- =====================================================
-- TABLE: projects
-- Projets de dimensionnement
-- =====================================================
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INT NOT NULL,
    network_type ENUM('gsm_900', 'gsm_1800', 'gsm_900_1800', 'umts', 'lte') DEFAULT 'gsm_900',
    status ENUM('draft', 'active', 'completed', 'archived') DEFAULT 'draft',
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    tags JSON,
    is_public BOOLEAN DEFAULT FALSE,
    template_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES projects(id) ON DELETE SET NULL,
    INDEX idx_owner (owner_id),
    INDEX idx_status (status),
    INDEX idx_network_type (network_type),
    INDEX idx_location (location),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_search (name, description, location)
);

-- =====================================================
-- TABLE: project_collaborators
-- Collaboration sur les projets
-- =====================================================
CREATE TABLE project_collaborators (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('viewer', 'editor', 'admin') DEFAULT 'viewer',
    invited_by INT NOT NULL,
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NULL,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_user (project_id, user_id),
    INDEX idx_project (project_id),
    INDEX idx_user (user_id)
);

-- =====================================================
-- TABLE: calculations
-- Calculs de dimensionnement
-- =====================================================
CREATE TABLE calculations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    version INT DEFAULT 1,
    is_current BOOLEAN DEFAULT TRUE,
    
    -- Paramètres de zone
    surface_area DECIMAL(10, 2) NOT NULL COMMENT 'Surface en km²',
    population INT NOT NULL,
    zone_type ENUM('urban_dense', 'urban', 'suburban', 'rural') NOT NULL,
    penetration_rate DECIMAL(5, 2) NOT NULL COMMENT 'Taux de pénétration en %',
    bhca_per_subscriber DECIMAL(4, 2) NOT NULL COMMENT 'BHCA par abonné',
    
    -- Paramètres radio
    frequency INT NOT NULL COMMENT 'Fréquence en MHz',
    tx_power DECIMAL(5, 2) NOT NULL COMMENT 'Puissance TX en dBm',
    antenna_gain DECIMAL(5, 2) NOT NULL COMMENT 'Gain antenne en dBi',
    sensitivity DECIMAL(6, 2) NOT NULL COMMENT 'Sensibilité RX en dBm',
    fade_margin DECIMAL(5, 2) DEFAULT 10 COMMENT 'Marge de fading en dB',
    interference_margin DECIMAL(5, 2) DEFAULT 3 COMMENT 'Marge d\'interférence en dB',
    
    -- Paramètres de trafic
    subscribers INT NOT NULL COMMENT 'Nombre d\'abonnés',
    call_duration DECIMAL(4, 2) NOT NULL COMMENT 'Durée moyenne d\'appel en minutes',
    
    -- Résultats calculés
    cell_radius DECIMAL(6, 2) COMMENT 'Rayon de cellule en km',
    covered_area DECIMAL(10, 2) COMMENT 'Surface couverte en km²',
    number_of_sites INT COMMENT 'Nombre de sites BTS',
    total_traffic DECIMAL(10, 2) COMMENT 'Trafic total en Erlangs',
    trx_per_site INT COMMENT 'TRX par site',
    total_channels INT COMMENT 'Nombre total de canaux',
    spectral_efficiency DECIMAL(6, 4) COMMENT 'Efficacité spectrale en bps/Hz',
    site_efficiency DECIMAL(5, 2) COMMENT 'Efficacité des sites en %',
    coverage_reliability DECIMAL(5, 2) COMMENT 'Fiabilité de couverture en %',
    
    -- Métadonnées
    calculation_method VARCHAR(100) DEFAULT 'standard_gsm',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_project (project_id),
    INDEX idx_user (user_id),
    INDEX idx_version (project_id, version),
    INDEX idx_current (project_id, is_current),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- TABLE: reports
-- Rapports générés
-- =====================================================
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    calculation_id INT NOT NULL,
    user_id INT NOT NULL,
    type ENUM('pdf_complete', 'pdf_statistics', 'excel', 'json') NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size INT COMMENT 'Taille en bytes',
    status ENUM('generating', 'completed', 'failed') DEFAULT 'generating',
    download_count INT DEFAULT 0,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (calculation_id) REFERENCES calculations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_calculation (calculation_id),
    INDEX idx_user (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- TABLE: templates
-- Modèles de projets prédéfinis
-- =====================================================
CREATE TABLE templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('urban', 'rural', 'highway', 'indoor', 'custom') NOT NULL,
    network_type ENUM('gsm_900', 'gsm_1800', 'gsm_900_1800', 'umts', 'lte') NOT NULL,
    created_by INT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INT DEFAULT 0,
    
    -- Paramètres par défaut (JSON)
    default_parameters JSON NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_network_type (network_type),
    INDEX idx_public (is_public),
    INDEX idx_usage (usage_count)
);

-- =====================================================
-- TABLE: notifications
-- Système de notifications
-- =====================================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    user_id INT NOT NULL,
    type ENUM('calculation_complete', 'report_ready', 'collaboration_invite', 'system_update', 'warning', 'error') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON COMMENT 'Données additionnelles (IDs, liens, etc.)',
    is_read BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_type (type),
    INDEX idx_read (is_read),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- TABLE: audit_logs
-- Journal d'audit des actions
-- =====================================================
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- TABLE: system_settings
-- Paramètres système globaux
-- =====================================================
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    data_type ENUM('string', 'integer', 'float', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_key (setting_key),
    INDEX idx_public (is_public)
);

-- =====================================================
-- TABLE: api_keys
-- Clés API pour intégrations externes
-- =====================================================
CREATE TABLE api_keys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    permissions JSON COMMENT 'Permissions accordées',
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_key_hash (key_hash),
    INDEX idx_active (is_active)
);

-- =====================================================
-- TABLE: file_uploads
-- Gestion des fichiers uploadés
-- =====================================================
CREATE TABLE file_uploads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    user_id INT NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) UNIQUE NOT NULL,
    purpose ENUM('avatar', 'report', 'import', 'export', 'other') NOT NULL,
    related_id INT COMMENT 'ID de l\'entité liée',
    is_temporary BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_purpose (purpose),
    INDEX idx_hash (file_hash),
    INDEX idx_temporary (is_temporary)
);
