USE FITR;
GO

-- Insert Roles
IF NOT EXISTS (SELECT 1 FROM User_Role WHERE Name = 'Admin')
BEGIN
    INSERT INTO User_Role (Name, CreatedDate) VALUES ('Admin', GETUTCDATE());
END

IF NOT EXISTS (SELECT 1 FROM User_Role WHERE Name = 'Teacher')
BEGIN
    INSERT INTO User_Role (Name, CreatedDate) VALUES ('Teacher', GETUTCDATE());
END

IF NOT EXISTS (SELECT 1 FROM User_Role WHERE Name = 'Student')
BEGIN
    INSERT INTO User_Role (Name, CreatedDate) VALUES ('Student', GETUTCDATE());
END

-- Insert Default Admin User
-- Password: admin123
-- BCrypt Hash generated for 'admin123'
DECLARE @AdminRoleId INT = (SELECT Id FROM User_Role WHERE Name = 'Admin');

IF NOT EXISTS (SELECT 1 FROM [User] WHERE Username = 'admin')
BEGIN
    INSERT INTO [User] (Username, Email, PasswordHash, RoleId, IsApproved, CreatedDate)
    VALUES ('admin', 'admin@fitr.com', '$2a$11$fB5KqVZP4y.9Qn0H5ZR3OuKvZ1Gq0L6xT5Zb7Zy6Q8W9qE7R5Y3aG', @AdminRoleId, 1, GETUTCDATE());
    -- NOTE: You will need to update this hash with actual BCrypt hash
    -- Or create admin through registration and approve manually
END

-- Insert Sample Platform
IF NOT EXISTS (SELECT 1 FROM Platform WHERE Name = 'Default Platform')
BEGIN
    INSERT INTO Platform (Name, Description, CreatedDate)
    VALUES ('Default Platform', 'Default platform for testing', GETUTCDATE());
END

DECLARE @PlatformId INT = (SELECT Id FROM Platform WHERE Name = 'Default Platform');

-- Insert Sample Nodes for testing
IF NOT EXISTS (SELECT 1 FROM Node WHERE Name = 'Input Node')
BEGIN
    INSERT INTO Node (Name, Description, PlatformId, CreatedDate)
    VALUES ('Input Node', 'Sample input node', @PlatformId, GETUTCDATE());
END

IF NOT EXISTS (SELECT 1 FROM Node WHERE Name = 'Output Node')
BEGIN
    INSERT INTO Node (Name, Description, PlatformId, CreatedDate)
    VALUES ('Output Node', 'Sample output node', @PlatformId, GETUTCDATE());
END

IF NOT EXISTS (SELECT 1 FROM Node WHERE Name = 'Process Node')
BEGIN
    INSERT INTO Node (Name, Description, PlatformId, CreatedDate)
    VALUES ('Process Node', 'Sample processing node', @PlatformId, GETUTCDATE());
END

PRINT 'Seed data inserted successfully!';
PRINT '';
PRINT 'Default Admin Credentials:';
PRINT 'Username: admin';
PRINT 'Email: admin@fitr.com';
PRINT 'Password: admin123';
PRINT '';
PRINT 'NOTE: The password hash needs to be generated using BCrypt.';
PRINT 'You can either:';
PRINT '1. Update the hash in this script with actual BCrypt hash';
PRINT '2. Register admin through API and manually set IsApproved=1 in database';
GO
