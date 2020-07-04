IF OBJECT_ID(N'__EFMigrationsHistory') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AppCustomers] (
        [Id] int NOT NULL IDENTITY,
        [Address] nvarchar(max) NULL,
        [City] nvarchar(50) NULL,
        [CreatedBy] nvarchar(256) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [DateCreated] datetime2 NOT NULL,
        [DateModified] datetime2 NOT NULL,
        [Email] nvarchar(100) NULL,
        [Gender] int NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [PhoneNumber] varchar(30) NULL,
        [UpdatedBy] nvarchar(256) NULL,
        [UpdatedDate] datetime2 NOT NULL,
        CONSTRAINT [PK_AppCustomers] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AppProductCategories] (
        [Id] int NOT NULL IDENTITY,
        [CreatedBy] nvarchar(256) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [DateCreated] datetime2 NOT NULL,
        [DateModified] datetime2 NOT NULL,
        [Description] nvarchar(500) NULL,
        [Icon] nvarchar(max) NULL,
        [Name] nvarchar(100) NOT NULL,
        [UpdatedBy] nvarchar(256) NULL,
        [UpdatedDate] datetime2 NOT NULL,
        CONSTRAINT [PK_AppProductCategories] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AspNetRoles] (
        [Id] nvarchar(450) NOT NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [CreatedBy] nvarchar(max) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [Description] nvarchar(max) NULL,
        [Name] nvarchar(256) NULL,
        [NormalizedName] nvarchar(256) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        [UpdatedDate] datetime2 NOT NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AspNetUsers] (
        [Id] nvarchar(450) NOT NULL,
        [AccessFailedCount] int NOT NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [Configuration] nvarchar(max) NULL,
        [CreatedBy] nvarchar(max) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [Email] nvarchar(256) NULL,
        [EmailConfirmed] bit NOT NULL,
        [FullName] nvarchar(max) NULL,
        [IsEnabled] bit NOT NULL,
        [JobTitle] nvarchar(max) NULL,
        [LockoutEnabled] bit NOT NULL,
        [LockoutEnd] datetimeoffset NULL,
        [NormalizedEmail] nvarchar(256) NULL,
        [NormalizedUserName] nvarchar(256) NULL,
        [PasswordHash] nvarchar(max) NULL,
        [PhoneNumber] nvarchar(max) NULL,
        [PhoneNumberConfirmed] bit NOT NULL,
        [SecurityStamp] nvarchar(max) NULL,
        [TwoFactorEnabled] bit NOT NULL,
        [UpdatedBy] nvarchar(max) NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [UserName] nvarchar(256) NULL,
        CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [OpenIddictApplications] (
        [Id] nvarchar(450) NOT NULL,
        [ClientId] nvarchar(450) NOT NULL,
        [ClientSecret] nvarchar(max) NULL,
        [ConcurrencyToken] nvarchar(max) NULL,
        [DisplayName] nvarchar(max) NULL,
        [PostLogoutRedirectUris] nvarchar(max) NULL,
        [RedirectUris] nvarchar(max) NULL,
        [Type] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_OpenIddictApplications] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [OpenIddictScopes] (
        [Id] nvarchar(450) NOT NULL,
        [ConcurrencyToken] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [Name] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_OpenIddictScopes] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AppProducts] (
        [Id] int NOT NULL IDENTITY,
        [BuyingPrice] decimal(18, 2) NOT NULL,
        [CreatedBy] nvarchar(256) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [DateCreated] datetime2 NOT NULL,
        [DateModified] datetime2 NOT NULL,
        [Description] nvarchar(500) NULL,
        [Icon] varchar(256) NULL,
        [IsActive] bit NOT NULL,
        [IsDiscontinued] bit NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [ParentId] int NULL,
        [ProductCategoryId] int NOT NULL,
        [SellingPrice] decimal(18, 2) NOT NULL,
        [UnitsInStock] int NOT NULL,
        [UpdatedBy] nvarchar(256) NULL,
        [UpdatedDate] datetime2 NOT NULL,
        CONSTRAINT [PK_AppProducts] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AppProducts_AppProducts_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [AppProducts] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_AppProducts_AppProductCategories_ProductCategoryId] FOREIGN KEY ([ProductCategoryId]) REFERENCES [AppProductCategories] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AspNetRoleClaims] (
        [Id] int NOT NULL IDENTITY,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        [RoleId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AppOrders] (
        [Id] int NOT NULL IDENTITY,
        [CashierId] nvarchar(450) NULL,
        [Comments] nvarchar(500) NULL,
        [CreatedBy] nvarchar(256) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CustomerId] int NOT NULL,
        [DateCreated] datetime2 NOT NULL,
        [DateModified] datetime2 NOT NULL,
        [Discount] decimal(18, 2) NOT NULL,
        [UpdatedBy] nvarchar(256) NULL,
        [UpdatedDate] datetime2 NOT NULL,
        CONSTRAINT [PK_AppOrders] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AppOrders_AspNetUsers_CashierId] FOREIGN KEY ([CashierId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_AppOrders_AppCustomers_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [AppCustomers] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AspNetUserClaims] (
        [Id] int NOT NULL IDENTITY,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AspNetUserLogins] (
        [LoginProvider] nvarchar(450) NOT NULL,
        [ProviderKey] nvarchar(450) NOT NULL,
        [ProviderDisplayName] nvarchar(max) NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AspNetUserRoles] (
        [UserId] nvarchar(450) NOT NULL,
        [RoleId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AspNetUserTokens] (
        [UserId] nvarchar(450) NOT NULL,
        [LoginProvider] nvarchar(450) NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [OpenIddictAuthorizations] (
        [Id] nvarchar(450) NOT NULL,
        [ApplicationId] nvarchar(450) NULL,
        [ConcurrencyToken] nvarchar(max) NULL,
        [Scopes] nvarchar(max) NULL,
        [Status] nvarchar(max) NOT NULL,
        [Subject] nvarchar(max) NOT NULL,
        [Type] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_OpenIddictAuthorizations] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_OpenIddictAuthorizations_OpenIddictApplications_ApplicationId] FOREIGN KEY ([ApplicationId]) REFERENCES [OpenIddictApplications] ([Id]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [AppOrderDetails] (
        [Id] int NOT NULL IDENTITY,
        [CreatedBy] nvarchar(256) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [Discount] decimal(18, 2) NOT NULL,
        [OrderId] int NOT NULL,
        [ProductId] int NOT NULL,
        [Quantity] int NOT NULL,
        [UnitPrice] decimal(18, 2) NOT NULL,
        [UpdatedBy] nvarchar(256) NULL,
        [UpdatedDate] datetime2 NOT NULL,
        CONSTRAINT [PK_AppOrderDetails] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AppOrderDetails_AppOrders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [AppOrders] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AppOrderDetails_AppProducts_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [AppProducts] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE TABLE [OpenIddictTokens] (
        [Id] nvarchar(450) NOT NULL,
        [ApplicationId] nvarchar(450) NULL,
        [AuthorizationId] nvarchar(450) NULL,
        [ConcurrencyToken] nvarchar(max) NULL,
        [CreationDate] datetimeoffset NULL,
        [ExpirationDate] datetimeoffset NULL,
        [Payload] nvarchar(max) NULL,
        [ReferenceId] nvarchar(450) NULL,
        [Status] nvarchar(max) NULL,
        [Subject] nvarchar(max) NOT NULL,
        [Type] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_OpenIddictTokens] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_OpenIddictTokens_OpenIddictApplications_ApplicationId] FOREIGN KEY ([ApplicationId]) REFERENCES [OpenIddictApplications] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_OpenIddictTokens_OpenIddictAuthorizations_AuthorizationId] FOREIGN KEY ([AuthorizationId]) REFERENCES [OpenIddictAuthorizations] ([Id]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AppCustomers_Name] ON [AppCustomers] ([Name]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AppOrderDetails_OrderId] ON [AppOrderDetails] ([OrderId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AppOrderDetails_ProductId] ON [AppOrderDetails] ([ProductId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AppOrders_CashierId] ON [AppOrders] ([CashierId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AppOrders_CustomerId] ON [AppOrders] ([CustomerId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AppProducts_Name] ON [AppProducts] ([Name]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AppProducts_ParentId] ON [AppProducts] ([ParentId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AppProducts_ProductCategoryId] ON [AppProducts] ([ProductCategoryId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE UNIQUE INDEX [IX_OpenIddictApplications_ClientId] ON [OpenIddictApplications] ([ClientId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_OpenIddictAuthorizations_ApplicationId] ON [OpenIddictAuthorizations] ([ApplicationId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_OpenIddictTokens_ApplicationId] ON [OpenIddictTokens] ([ApplicationId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE INDEX [IX_OpenIddictTokens_AuthorizationId] ON [OpenIddictTokens] ([AuthorizationId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    CREATE UNIQUE INDEX [IX_OpenIddictTokens_ReferenceId] ON [OpenIddictTokens] ([ReferenceId]) WHERE [ReferenceId] IS NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20171212061431_Initial')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20171212061431_Initial', N'2.0.1-rtm-125');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20180108093004_InitialCreate')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20180108093004_InitialCreate', N'2.0.1-rtm-125');
END;

GO

