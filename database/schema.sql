-- =============================================
-- Admin Panel Database Schema
-- Database: SQL Server / PostgreSQL
-- =============================================

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(20),
    IsActive BIT NOT NULL DEFAULT 1,
    IsEmailVerified BIT NOT NULL DEFAULT 0,
    EmailVerifiedAt DATETIME2,
    LastLoginAt DATETIME2,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy UNIQUEIDENTIFIER,
    UpdatedBy UNIQUEIDENTIFIER,
    CONSTRAINT FK_Users_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(Id),
    CONSTRAINT FK_Users_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES Users(Id)
);

CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_IsActive ON Users(IsActive);

CREATE TABLE Roles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    IsSystemRole BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE UserRoles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    RoleId UNIQUEIDENTIFIER NOT NULL,
    AssignedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    AssignedBy UNIQUEIDENTIFIER,
    CONSTRAINT FK_UserRoles_User FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_Role FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_AssignedBy FOREIGN KEY (AssignedBy) REFERENCES Users(Id),
    CONSTRAINT UK_UserRoles_User_Role UNIQUE (UserId, RoleId)
);

CREATE INDEX IX_UserRoles_UserId ON UserRoles(UserId);
CREATE INDEX IX_UserRoles_RoleId ON UserRoles(RoleId);

CREATE TABLE Permissions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    Resource NVARCHAR(100) NOT NULL, -- e.g., 'Users', 'Regions', 'Branches'
    Action NVARCHAR(50) NOT NULL, -- e.g., 'Create', 'Read', 'Update', 'Delete'
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Permissions_Resource ON Permissions(Resource);

CREATE TABLE RolePermissions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RoleId UNIQUEIDENTIFIER NOT NULL,
    PermissionId UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_RolePermissions_Role FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    CONSTRAINT FK_RolePermissions_Permission FOREIGN KEY (PermissionId) REFERENCES Permissions(Id) ON DELETE CASCADE,
    CONSTRAINT UK_RolePermissions_Role_Permission UNIQUE (RoleId, PermissionId)
);

CREATE INDEX IX_RolePermissions_RoleId ON RolePermissions(RoleId);

-- =============================================
-- REGIONS & BRANCHES
-- =============================================

CREATE TABLE Regions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Code NVARCHAR(50) NOT NULL UNIQUE, -- e.g., 'BB1/KH0010002/BATTAMBANG RO'
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy UNIQUEIDENTIFIER,
    UpdatedBy UNIQUEIDENTIFIER,
    CONSTRAINT FK_Regions_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(Id),
    CONSTRAINT FK_Regions_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES Users(Id)
);

CREATE INDEX IX_Regions_Code ON Regions(Code);
CREATE INDEX IX_Regions_IsActive ON Regions(IsActive);

CREATE TABLE Branches (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RegionId UNIQUEIDENTIFIER NOT NULL,
    Code NVARCHAR(50) NOT NULL, -- e.g., 'YTP/KH0010220/BB-THMA PUOK'
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(500),
    Address NVARCHAR(500),
    PhoneNumber NVARCHAR(20),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy UNIQUEIDENTIFIER,
    UpdatedBy UNIQUEIDENTIFIER,
    CONSTRAINT FK_Branches_Region FOREIGN KEY (RegionId) REFERENCES Regions(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Branches_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(Id),
    CONSTRAINT FK_Branches_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES Users(Id),
    CONSTRAINT UK_Branches_Code UNIQUE (Code)
);

CREATE INDEX IX_Branches_RegionId ON Branches(RegionId);
CREATE INDEX IX_Branches_Code ON Branches(Code);
CREATE INDEX IX_Branches_IsActive ON Branches(IsActive);

-- =============================================
-- USER-REGION-BRANCH ASSIGNMENTS
-- =============================================

CREATE TABLE UserRegionBranchAssignments (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    RegionId UNIQUEIDENTIFIER NOT NULL,
    BranchId UNIQUEIDENTIFIER NULL, -- NULL means access to all branches in region
    IsActive BIT NOT NULL DEFAULT 1,
    AssignedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    AssignedBy UNIQUEIDENTIFIER,
    CONSTRAINT FK_UserRegionBranch_User FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserRegionBranch_Region FOREIGN KEY (RegionId) REFERENCES Regions(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserRegionBranch_Branch FOREIGN KEY (BranchId) REFERENCES Branches(Id),
    CONSTRAINT FK_UserRegionBranch_AssignedBy FOREIGN KEY (AssignedBy) REFERENCES Users(Id),
    CONSTRAINT UK_UserRegionBranch UNIQUE (UserId, RegionId, BranchId)
);

CREATE INDEX IX_UserRegionBranch_UserId ON UserRegionBranchAssignments(UserId);
CREATE INDEX IX_UserRegionBranch_RegionId ON UserRegionBranchAssignments(RegionId);

-- =============================================
-- DYNAMIC MENU STRUCTURE
-- =============================================

CREATE TABLE MenuItems (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ParentId UNIQUEIDENTIFIER NULL, -- NULL for root level items
    Name NVARCHAR(100) NOT NULL,
    DisplayName NVARCHAR(255) NOT NULL,
    Icon NVARCHAR(100), -- Icon name or class
    Path NVARCHAR(255), -- Route path
    OrderIndex INT NOT NULL DEFAULT 0,
    IsVisible BIT NOT NULL DEFAULT 1,
    RequiredPermissionId UNIQUEIDENTIFIER NULL, -- NULL = no permission required
    ComponentName NVARCHAR(255), -- React component name
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_MenuItems_Parent FOREIGN KEY (ParentId) REFERENCES MenuItems(Id),
    CONSTRAINT FK_MenuItems_Permission FOREIGN KEY (RequiredPermissionId) REFERENCES Permissions(Id)
);

CREATE INDEX IX_MenuItems_ParentId ON MenuItems(ParentId);
CREATE INDEX IX_MenuItems_OrderIndex ON MenuItems(OrderIndex);

-- =============================================
-- AUDIT LOGS
-- =============================================

CREATE TABLE AuditLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NULL, -- NULL for system actions
    Action NVARCHAR(100) NOT NULL, -- 'Create', 'Update', 'Delete', 'Login', 'Logout'
    EntityType NVARCHAR(100) NOT NULL, -- 'User', 'Region', 'Branch', etc.
    EntityId UNIQUEIDENTIFIER NULL,
    OldValues NVARCHAR(MAX), -- JSON
    NewValues NVARCHAR(MAX), -- JSON
    IpAddress NVARCHAR(50),
    UserAgent NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_AuditLogs_User FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
);

CREATE INDEX IX_AuditLogs_UserId ON AuditLogs(UserId);
CREATE INDEX IX_AuditLogs_EntityType_EntityId ON AuditLogs(EntityType, EntityId);
CREATE INDEX IX_AuditLogs_CreatedAt ON AuditLogs(CreatedAt);
CREATE INDEX IX_AuditLogs_Action ON AuditLogs(Action);

-- =============================================
-- SYSTEM SETTINGS
-- =============================================

CREATE TABLE SystemSettings (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Key NVARCHAR(100) NOT NULL UNIQUE,
    Value NVARCHAR(MAX),
    Description NVARCHAR(500),
    Category NVARCHAR(100), -- 'General', 'Security', 'Email', etc.
    IsEncrypted BIT NOT NULL DEFAULT 0,
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedBy UNIQUEIDENTIFIER,
    CONSTRAINT FK_SystemSettings_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES Users(Id)
);

CREATE INDEX IX_SystemSettings_Category ON SystemSettings(Category);

-- =============================================
-- REFRESH TOKENS
-- =============================================

CREATE TABLE RefreshTokens (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Token NVARCHAR(500) NOT NULL UNIQUE,
    ExpiresAt DATETIME2 NOT NULL,
    IsRevoked BIT NOT NULL DEFAULT 0,
    RevokedAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedByIp NVARCHAR(50),
    CONSTRAINT FK_RefreshTokens_User FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE INDEX IX_RefreshTokens_UserId ON RefreshTokens(UserId);
CREATE INDEX IX_RefreshTokens_Token ON RefreshTokens(Token);
CREATE INDEX IX_RefreshTokens_ExpiresAt ON RefreshTokens(ExpiresAt);

