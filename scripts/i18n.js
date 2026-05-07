// ==================== TRANSLATION DATA ====================

const translations = {
    en: {
        // Common
        common: {
            loading: "Loading...",
            error: "Error",
            success: "Success",
            cancel: "Cancel",
            confirm: "Confirm",
            close: "Close",
            save: "Save",
            delete: "Delete",
            edit: "Edit",
            back: "Back",
            next: "Next",
            previous: "Previous",
            submit: "Submit",
            required: "Required",
            retry: "Retry",
            copied: "Copied!",
            copy: "Copy"
        },

        // Sidebar
        sidebar: {
            main: "Main",
            databases: "Databases",
            users: "Users",
            agents: "Agents",
            profile: "Profile",
            settings: "Settings",
            organization: "Organization"
        },

        // Main Page (Databases)
        main: {
            pageTitle: "My Databases",
            loading: "Loading your databases...",
            loadError: "Failed to load databases",

            // No databases state
            noDatabases: {
                title: "No Database Access",
                message: "You don't have any databases assigned yet.",
                contact: "Contact your administrator to get access."
            },

            // Database card
            card: {
                username: "Username",
                password: "Password"
            },

            // Database modal
            modal: {
                username: "Username",
                password: "Password",
                roles: "Roles",
                noRoles: "No roles assigned",
                noDescription: "No description",
                editPassword: "Edit Password",
                showPassword: "Show Password",
                hidePassword: "Hide Password"
            },

            // Password edit
            passwordEdit: {
                newPassword: "Enter new password",
                save: "Save",
                cancel: "Cancel",
                saving: "Saving...",
                minLength: "Password must be at least 6 characters",
                enterPassword: "Please enter a new password",
                updateSuccess: "Password updated successfully",
                updateError: "Failed to update password",
                notFound: "Error: Password input field not found",
                dbNotAvailable: "Error: Database information not available",
                saveButtonNotFound: "Error: Save button not found",
                connectionError: "Connection error. Please try again."
            },

            // Toast messages
            toast: {
                passwordCopied: "Password copied to clipboard",
                usernameCopied: "Username copied to clipboard"
            }
        },

        // Databases Page
        databases: {
            pageTitle: "Database Management",
            pageSubtitle: "Configure and manage all databases",
            loading: "Loading databases...",
            loadError: "Failed to load databases. Please try again.",
            noDatabases: "No databases found",

            // Database card
            card: {
                members: "Members",
                addMember: "Add Member",
                noMembers: "No members",
                editMember: "Edit member",
                deleteMember: "Delete member"
            },

            // Member modal
            memberModal: {
                unknownUser: "Unknown User",
                username: "Username",
                email: "Email",
                phone: "Phone",
                role: "Role",
                na: "N/A",
                databaseInfo: "Database Information",
                databaseUsername: "Database Username",
                databaseRoles: "Database Roles",
                noRolesAssigned: "No database roles assigned",
                noDescription: "No description available"
            },

            // Add member modal
            addMember: {
                title: "Add Member to",
                step1Title: "Select User",
                step2Title: "Enter Credentials",
                searchPlaceholder: "Search by name, username, or email...",
                searching: "Searching...",
                noUsersFound: "No users found",
                failedToLoad: "Failed to load users",
                selectedUser: "Selected User",
                dbUsername: "Database Username",
                dbUsernamePlaceholder: "Enter database username",
                dbPassword: "Database Password",
                dbPasswordPlaceholder: "Enter database password",
                selectRoles: "Select Database Roles",
                availableRoles: "Available Roles",
                selectedRoles: "Selected Roles",
                noRolesSelected: "No roles selected",
                noRolesAvailable: "No roles available for this database",
                back: "Back",
                cancel: "Cancel",
                next: "Next",
                addMember: "Add Member",
                adding: "Adding...",
                fillAllFields: "Please fill in all required fields",
                invalidUsername: "Database username can only contain letters, numbers, and underscores",
                memberAdded: "has been added to",
                addFailed: "Could not add member. Please try again."
            },

            // Edit member modal
            editMember: {
                title: "Edit Member:",
                username: "Database Username",
                password: "Database Password",
                hint: "💡 You can only modify the roles assigned to this member. Other information is read-only.",
                manageRoles: "Manage Roles",
                availableRoles: "Available Roles",
                selectedRoles: "Selected Roles",
                noRolesSelected: "No roles selected",
                noRolesAvailable: "No roles available for this database",
                cancel: "Cancel",
                saveChanges: "Save Changes",
                updating: "Updating...",
                noMemberSelected: "No member selected for editing",
                noChanges: "changes are successfully saved",
                rolesUpdated: "'s roles have been updated successfully",
                updateFailed: "Could not update member. Please try again.",
                roleSelected: "✓ Selected"
            },

            // Delete member modal
            deleteMember: {
                title: "Delete Member",
                subtitle: "Permanent Action",
                warning: "⚠️ This action cannot be undone!",
                warningText: "You are about to permanently remove this member from the database. All access and permissions will be revoked immediately.",
                memberLabel: "Member",
                databaseLabel: "Database",
                cancel: "Cancel",
                deleteBtn: "Delete Member",
                deleting: "Deleting...",
                memberRemoved: "has been removed from the database",
                deleteFailed: "Could not delete member. Please try again."
            },

            // Roles expand modal
            rolesModal: {
                title: "Available Database Roles",
                noDescription: "No description",
                selected: "✓ Selected"
            }
        },
        // In i18n.js, inside the `en` object, the users section should be:
        users: {
            pageTitle: "Users",
            pageSubtitle: "Manage system users",
            searchPlaceholder: "Search users by name, username, or email...",
            addUserBtn: "Add User",
            loading: "Loading users...",
            searching: "Searching...",
            noUsers: "No users found",
            loadError: "Failed to load users.",
            searchError: "No results or search failed.",
            retry: "Retry",
            clearSearch: "Clear search",

            listItem: {
                editUser: "Edit user",
                deleteUser: "Delete user"
            },

            detailModal: {
                title: "User Details",
                username: "Username",
                email: "Email",
                phone: "Phone",
                role: "Role",
                notProvided: "Not provided",
                noRole: "No role",
                copied: "Copied!"
            },

            addUser: {
                title: "Create New User",
                fullName: "Full Name",
                fullNamePlaceholder: "Enter full name",
                username: "Username",
                usernamePlaceholder: "Enter username",
                email: "Email",
                emailPlaceholder: "Enter email address",
                phone: "Phone Number",
                phonePlaceholder: "Enter phone number (optional)",
                role: "Role",
                selectRole: "Select a role (optional)",
                roleHint: "If not selected, DEVELOPER will be assigned by default",
                cancel: "Cancel",
                createUser: "Create User",
                creating: "Creating...",
                required: "Name, username, and email are required",
                success: "has been created successfully",
                error: "Could not create user. Please try again.",
                connectionError: "Please check your connection."
            },

            editUser: {
                title: "Edit User",
                fullName: "Full Name",
                fullNamePlaceholder: "Enter full name",
                username: "Username",
                usernamePlaceholder: "Enter username",
                email: "Email",
                emailPlaceholder: "Enter email address",
                phone: "Phone Number",
                phonePlaceholder: "Enter phone number (optional)",
                role: "Role",
                selectRole: "Select a role (optional)",
                roleHint: "If not selected, DEVELOPER will be assigned by default",
                cancel: "Cancel",
                saveChanges: "Save Changes",
                updating: "Updating...",
                required: "Name, username, and email are required",
                success: "has been updated successfully",
                error: "Could not update user. Please try again.",
                connectionError: "Please check your connection."
            },

            deleteUser: {
                title: "Delete User",
                subtitle: "Permanent Action",
                warning: "⚠️ This action cannot be undone!",
                warningText: "You are about to permanently delete this user. All their data and access will be removed.",
                userName: "User Name",
                username: "Username",
                cancel: "Cancel",
                deleteBtn: "Delete User",
                deleting: "Deleting...",
                success: "has been deleted successfully",
                error: "Could not delete user. Please try again.",
                connectionError: "Please check your connection."
            }
        },

        // Databases Page
        // databases: {
        //     title: "DB-Controller",
        //     tagline: "Powerful Database Management for Modern Teams",
        //     login: "Login",
        //     createOrg: "Create Organization",
        //     scrollMore: "Scroll to learn more",
        //     aboutTitle: "About the Project",
        //     aboutSubtitle: "Everything you need to know about DB-Controller",
        //     feature1Title: "Database Management",
        //     feature1Desc: "Centralized control over all your database connections. Manage credentials, monitor access, and maintain security across your entire infrastructure.",
        //     feature2Title: "Team Collaboration",
        //     feature2Desc: "Invite team members, assign roles, and manage permissions with ease. Keep your team organized and productive with granular access control.",
        //     feature3Title: "Secure & Encrypted",
        //     feature3Desc: "Enterprise-grade security with encrypted credentials, secure authentication, and comprehensive audit logs to keep your data safe.",
        //     feature4Title: "Real-time Monitoring",
        //     feature4Desc: "Track database performance, monitor connection health, and receive instant alerts when something needs attention.",
        //     feature5Title: "Role-Based Access",
        //     feature5Desc: "Define custom roles and permissions for different team members. Ensure everyone has exactly the access they need, nothing more.",
        //     feature6Title: "Multi-Database Support",
        //     feature6Desc: "Work with PostgreSQL, MySQL, MongoDB, and more. DB-Controller supports all major database systems in one unified interface.",
        //     howItWorksTitle: "How It Works",
        //     step1Title: "Create Organization",
        //     step1Desc: "Set up your organization and receive a unique Organization ID for your db-agent configuration.",
        //     step2Title: "Configure DB Agent",
        //     step2Desc: "Install and configure the db-agent with your Organization ID to connect your databases securely.",
        //     step3Title: "Manage & Monitor",
        //     step3Desc: "Access your dashboard to manage databases, invite team members, and monitor everything in real-time.",
        //     ctaTitle: "Ready to Get Started?",
        //     ctaSubtitle: "Join teams worldwide who trust DB-Controller for their database management needs",
        //     alreadyHaveAccount: "Already have an account? Login",
        //     footerCopyright: "© 2025 DB-Controller. All rights reserved."
        // },

        // Organization Page
        org: {
            title: "Create Organization",
            subtitle: "Set up your organization and admin account",
            orgNameLabel: "Organization Name",
            orgNamePlaceholder: "Enter your organization name",
            createOrgBtn: "Create Organization",
            orgCreatedNotice: "Organization Created!",
            orgCreatedDesc: "Now create your admin account to continue.",
            emailWarningTitle: "Important:",
            emailWarningDesc: "Your password will be sent to the email address you provide. Please ensure the email is valid and accessible.",
            fullNameLabel: "Full Name",
            fullNamePlaceholder: "Enter your full name",
            usernameLabel: "Username",
            usernamePlaceholder: "Choose a username",
            emailLabel: "Email Address",
            emailPlaceholder: "your.email@example.com",
            emailHint: "Your login credentials will be sent to this email",
            createAccountBtn: "Create Account",
            backToHome: "Back to Home",
            editOrgName: "Edit Organization Name",
            successTitle: "Organization Created!",
            successSubtitle: "Your organization and admin account have been successfully created",
            credentialsSent: "Your login credentials have been sent to your email address. Please check your inbox (and spam folder) for your password.",
            downloadAgent: "Download Agent",
            loadingAgents: "Loading available agents...",
            clickToDownload: "Click to download",
            downloading: "Downloading...",
            downloaded: "Downloaded",
            unableToLoad: "Unable to load agents",
            retry: "Retry",
            orgIdWarning: "Important: Include this Organization ID in your db-agent configuration. The agent will not function without it.",
            orgIdLabel: "Organization ID",
            copy: "Copy",
            copied: "Copied!",
            goToLogin: "Go to Login",
            creatingOrg: "Creating Organization...",
            creatingAccount: "Creating Admin Account...",
            enterOrgName: "Please enter an organization name",
            fillAllFields: "Please fill in all required fields",
            nameMinLength: "Full name must be at least 2 characters long",
            invalidEmail: "Please enter a valid email address",
            orgCreationFailed: "Failed to create organization",
            userCreationFailed: "Failed to create admin account",
            downloadFailed: "Failed to download",
            copyFailed: "Failed to copy to clipboard"
        },
        orgPage: {
            title: "Organization Settings",
            subtitle: "Manage your organization information and view activity",

            detailsCard: {
                title: "Organization Details",
                loading: "Loading organization information...",
                error: "Unable to load organization information",
                retry: "Retry"
            },

            fields: {
                orgId: "Organization ID",
                orgIdHint: "Use this ID when configuring your agents",
                orgName: "Organization Name",
                copy: "Copy",
                copied: "Copied!",
                edit: "Edit",
                save: "Save",
                saving: "Saving...",
                cancel: "Cancel",
                placeholder: "Enter organization name"
            },

            activityCard: {
                title: "Activity Analytics",
                comingSoon: "Coming Soon",
                description: "Track your organization's daily activities, agent usage, and performance metrics.",
                features: {
                    tracking: "Activity Tracking",
                    statistics: "Usage Statistics",
                    insights: "Performance Insights"
                }
            },

            toasts: {
                copySuccess: "Organization ID copied to clipboard",
                copyError: "Failed to copy to clipboard",
                nameEmpty: "Organization name cannot be empty",
                dataNotLoaded: "Organization data not loaded",
                updateSuccess: "Organization name updated successfully",
                updateError: "Failed to update organization name",
                loadError: "Failed to load organization information"
            }
        },
        // Agents Page
        agentsPage: {
            title: "Agent Downloads",
            subtitle: "Download and manage your database agent versions",

            versionsSection: {
                title: "Available Versions",
                loading: "Loading available versions...",
                error: "Unable to load versions",
                retry: "Retry",
                selectLabel: "Select Version to Download",
                selectPlaceholder: "Choose a version...",
                download: "Download",
                downloading: "Downloading...",
                downloaded: "Downloaded",
                noVersions: "No versions available",
                noVersionsHint: "Check back later for new releases"
            },

            historySection: {
                title: "Download History",
                loading: "Loading download history...",
                error: "Unable to load history",
                retry: "Retry",
                empty: "No download history yet",
                emptyHint: "Download an agent to see it here",
                tableHeaders: {
                    version: "Version",
                    downloadedBy: "Downloaded By",
                    downloadDate: "Download Date"
                }
            },

            time: {
                justNow: "Just now",
                minAgo: "min ago",
                hourAgo: "hour ago",
                hoursAgo: "hours ago",
                dayAgo: "day ago",
                daysAgo: "days ago",
                unknownSize: "Unknown size",
                notProvided: "Not provided",
                invalidDate: "Invalid date"
            },

            toasts: {
                selectVersion: "Please select a version to download",
                downloadSuccess: "downloaded successfully",
                downloadError: "Failed to download agent. Please try again.",
                loadVersionsError: "Failed to load available versions",
                loadHistoryError: "Failed to load download history"
            }
        },
        // Profile Page
        profilePage: {
            title: "My Profile",
            subtitle: "View and edit your account information",
            loading: "Loading...",

            fields: {
                fullName: "Full Name",
                username: "Username",
                email: "Email",
                phone: "Phone",
                notProvided: "Not provided",
                na: "N/A"
            },

            placeholders: {
                fullName: "Enter full name",
                username: "Enter username",
                email: "Enter email",
                phone: "Enter phone number"
            },

            buttons: {
                edit: "Edit",
                save: "Save",
                saving: "Saving...",
                cancel: "Cancel",
                retry: "Retry"
            },

            error: {
                title: "Failed to Load Profile",
                message: "Unable to retrieve your profile information. Please try again."
            },

            validation: {
                fieldEmpty: "This field cannot be empty",
                invalidEmail: "Please enter a valid email address"
            },

            success: {
                nameUpdated: "Name updated successfully!",
                usernameUpdated: "Username updated successfully!",
                emailUpdated: "Email updated successfully!",
                phoneUpdated: "Phone number updated successfully!"
            },

            toasts: {
                loadError: "Failed to load profile",
                updateError: "Failed to update {field}. Please try again."
            }
        },
        // Add inside each language object (en / ru / uz)

        // Settings Page
        settingsPage: {
            title: "Settings",
            subtitle: "Manage your account preferences",

            sections: {
                security: {
                    title: "Security",
                    description: "Manage your password and security preferences",
                    changePassword: {
                        title: "Change Password",
                        description: "Update your password to keep your account secure",
                        button: "Change"
                    }
                },

                notifications: {
                    title: "Notifications",
                    description: "Configure how you receive notifications",
                    emailNotifications: {
                        title: "Email Notifications",
                        description: "Receive email updates about your account status"
                    }
                },

                preferences: {
                    title: "Preferences",
                    description: "Customize your experience",
                    language: {
                        title: "Language",
                        description: "Select your preferred language"
                    },
                    theme: {
                        title: "Theme",
                        description: "Choose your interface theme",
                        options: {
                            light: "Light",
                            dark: "Dark",
                            auto: "Auto"
                        }
                    }
                },

                account: {
                    title: "Account",
                    description: "Manage your account settings",
                    logout: {
                        title: "Logout",
                        description: "Sign out of your account",
                        button: "Logout"
                    }
                }
            },

            passwordModal: {
                step1: {
                    title: "Change Password",
                    subtitle: "Please enter your current password to continue",
                    currentPassword: "Current Password",
                    placeholder: "Enter your current password",
                    continue: "Continue",
                    cancel: "Cancel",
                    verifying: "Verifying..."
                },

                step2: {
                    title: "Set New Password",
                    subtitle: "Choose a strong password for your account",
                    newPassword: "New Password",
                    newPasswordPlaceholder: "Enter new password (min. 8 characters)",
                    confirmPassword: "Confirm New Password",
                    confirmPasswordPlaceholder: "Re-enter new password",
                    save: "Save Password",
                    saving: "Saving...",
                    cancel: "Cancel"
                },

                requirements: {
                    length: "At least 8 characters",
                    match: "Passwords match"
                },

                warnings: {
                    attemptRemaining: "Warning: {count} attempt{s} remaining before logout",
                    attempts: "attempts",
                    attempt: "attempt"
                },

                toasts: {
                    enterCurrent: "Please enter your current password",
                    verified: "Password verified successfully!",
                    incorrectAttempts: "Incorrect password. {count} attempt{s} remaining.",
                    tooManyAttempts: "Too many failed attempts. Redirecting to login...",
                    connectionError: "Connection error. Please try again.",
                    fillAllFields: "Please fill in all fields",
                    minLength: "Password must be at least 8 characters long",
                    noMatch: "Passwords do not match",
                    success: "Password changed successfully!",
                    updateError: "Failed to update password. Please try again."
                }
            },

            logoutModal: {
                title: "Logout",
                message: "Are you sure you want to logout? You'll need to login again to access your account.",
                cancel: "Cancel",
                confirm: "Logout"
            }
        }
    },

    ru: {
        // Common
        common: {
            loading: "Загрузка...",
            error: "Ошибка",
            success: "Успешно",
            cancel: "Отмена",
            confirm: "Подтвердить",
            close: "Закрыть",
            save: "Сохранить",
            delete: "Удалить",
            edit: "Редактировать",
            back: "Назад",
            next: "Далее",
            previous: "Предыдущий",
            submit: "Отправить",
            required: "Обязательно",
            retry: "Повторить",
            copied: "Скопировано!",
            copy: "Копировать"
        },

        // Sidebar
        sidebar: {
            main: "Главная",
            databases: "Базы данных",
            users: "Пользователи",
            agents: "Агенты",
            profile: "Профиль",
            settings: "Настройки",
            organization: "Организация"
        },

        // Main Page (Databases)
        main: {
            pageTitle: "Мои базы данных",
            loading: "Загрузка ваших баз данных...",
            loadError: "Не удалось загрузить базы данных",
            noDatabases: {
                title: "Нет доступа к базам данных",
                message: "У вас пока нет назначенных баз данных.",
                contact: "Обратитесь к администратору для получения доступа."
            },
            card: {
                username: "Имя пользователя",
                password: "Пароль"
            },
            modal: {
                username: "Имя пользователя",
                password: "Пароль",
                roles: "Роли",
                noRoles: "Роли не назначены",
                noDescription: "Без описания",
                editPassword: "Изменить пароль",
                showPassword: "Показать пароль",
                hidePassword: "Скрыть пароль"
            },
            passwordEdit: {
                newPassword: "Введите новый пароль",
                save: "Сохранить",
                cancel: "Отмена",
                saving: "Сохранение...",
                minLength: "Пароль должен содержать не менее 6 символов",
                enterPassword: "Пожалуйста, введите новый пароль",
                updateSuccess: "Пароль успешно обновлён",
                updateError: "Не удалось обновить пароль",
                notFound: "Ошибка: поле ввода пароля не найдено",
                dbNotAvailable: "Ошибка: информация о базе данных недоступна",
                saveButtonNotFound: "Ошибка: кнопка сохранения не найдена",
                connectionError: "Ошибка подключения. Попробуйте ещё раз."
            },
            toast: {
                passwordCopied: "Пароль скопирован в буфер обмена",
                usernameCopied: "Имя пользователя скопировано в буфер обмена"
            }
        },

        // Databases Page
        databases: {
            pageTitle: "Управление базами данных",
            pageSubtitle: "Настройка и управление всеми базами данных",
            loading: "Загрузка баз данных...",
            loadError: "Не удалось загрузить базы данных. Попробуйте ещё раз.",
            noDatabases: "Базы данных не найдены",
            card: {
                members: "Участники",
                addMember: "Добавить участника",
                noMembers: "Нет участников",
                editMember: "Редактировать участника",
                deleteMember: "Удалить участника"
            },
            memberModal: {
                unknownUser: "Неизвестный пользователь",
                username: "Имя пользователя",
                email: "Email",
                phone: "Телефон",
                role: "Роль",
                na: "Н/Д",
                databaseInfo: "Информация о базе данных",
                databaseUsername: "Имя пользователя БД",
                databaseRoles: "Роли БД",
                noRolesAssigned: "Роли БД не назначены",
                noDescription: "Описание отсутствует"
            },
            addMember: {
                title: "Добавить участника в",
                step1Title: "Выберите пользователя",
                step2Title: "Введите учётные данные",
                searchPlaceholder: "Поиск по имени, username или email...",
                searching: "Поиск...",
                noUsersFound: "Пользователи не найдены",
                failedToLoad: "Не удалось загрузить пользователей",
                selectedUser: "Выбранный пользователь",
                dbUsername: "Имя пользователя БД",
                dbUsernamePlaceholder: "Введите имя пользователя БД",
                dbPassword: "Пароль БД",
                dbPasswordPlaceholder: "Введите пароль БД",
                selectRoles: "Выберите роли БД",
                availableRoles: "Доступные роли",
                selectedRoles: "Выбранные роли",
                noRolesSelected: "Роли не выбраны",
                noRolesAvailable: "Нет доступных ролей для этой БД",
                back: "Назад",
                cancel: "Отмена",
                next: "Далее",
                addMember: "Добавить участника",
                adding: "Добавление...",
                fillAllFields: "Пожалуйста, заполните все обязательные поля",
                invalidUsername: "Имя пользователя БД может содержать только буквы, цифры и подчёркивания",
                memberAdded: "добавлен в",
                addFailed: "Не удалось добавить участника. Попробуйте ещё раз."
            },
            editMember: {
                title: "Редактировать участника:",
                username: "Имя пользователя БД",
                password: "Пароль БД",
                hint: "💡 Вы можете изменить только роли этого участника. Остальная информация доступна только для чтения.",
                manageRoles: "Управление ролями",
                availableRoles: "Доступные роли",
                selectedRoles: "Выбранные роли",
                noRolesSelected: "Роли не выбраны",
                noRolesAvailable: "Нет доступных ролей для этой БД",
                cancel: "Отмена",
                saveChanges: "Сохранить изменения",
                updating: "Обновление...",
                noMemberSelected: "Участник не выбран для редактирования",
                noChanges: "изменения успешно сохранены",
                rolesUpdated: " роли успешно обновлены",
                updateFailed: "Не удалось обновить участника. Попробуйте ещё раз.",
                roleSelected: "✓ Выбрано"
            },
            deleteMember: {
                title: "Удалить участника",
                subtitle: "Необратимое действие",
                warning: "⚠️ Это действие нельзя отменить!",
                warningText: "Вы собираетесь навсегда удалить этого участника из базы данных. Все права доступа и разрешения будут немедленно отозваны.",
                memberLabel: "Участник",
                databaseLabel: "База данных",
                cancel: "Отмена",
                deleteBtn: "Удалить участника",
                deleting: "Удаление...",
                memberRemoved: "удалён из базы данных",
                deleteFailed: "Не удалось удалить участника. Попробуйте ещё раз."
            },
            rolesModal: {
                title: "Доступные роли БД",
                noDescription: "Без описания",
                selected: "✓ Выбрано"
            }
        },

        // Users Page
        users: {
            pageTitle: "Пользователи",
            pageSubtitle: "Управление пользователями системы",
            searchPlaceholder: "Поиск по имени, username или email...",
            addUserBtn: "Добавить",
            loading: "Загрузка пользователей...",
            searching: "Поиск...",
            noUsers: "Пользователи не найдены",
            loadError: "Не удалось загрузить пользователей.",
            searchError: "Нет результатов или поиск не удался.",
            retry: "Повторить",
            clearSearch: "Очистить поиск",

            listItem: {
                editUser: "Редактировать пользователя",
                deleteUser: "Удалить пользователя"
            },

            detailModal: {
                title: "Детали пользователя",
                username: "Имя пользователя",
                email: "Email",
                phone: "Телефон",
                role: "Роль",
                notProvided: "Не указано",
                noRole: "Нет роли",
                copied: "Скопировано!"
            },

            addUser: {
                title: "Создать нового пользователя",
                fullName: "Полное имя",
                fullNamePlaceholder: "Введите полное имя",
                username: "Имя пользователя",
                usernamePlaceholder: "Введите имя пользователя",
                email: "Email",
                emailPlaceholder: "Введите адрес email",
                phone: "Номер телефона",
                phonePlaceholder: "Введите номер телефона (необязательно)",
                role: "Роль",
                selectRole: "Выберите роль (необязательно)",
                roleHint: "Если не выбрано, по умолчанию будет назначена роль DEVELOPER",
                cancel: "Отмена",
                createUser: "Создать",
                creating: "Создание...",
                required: "Имя, username и email обязательны",
                success: "успешно создан",
                error: "Не удалось создать пользователя. Попробуйте ещё раз.",
                connectionError: "Проверьте подключение."
            },

            editUser: {
                title: "Редактировать пользователя",
                fullName: "Полное имя",
                fullNamePlaceholder: "Введите полное имя",
                username: "Имя пользователя",
                usernamePlaceholder: "Введите имя пользователя",
                email: "Email",
                emailPlaceholder: "Введите адрес email",
                phone: "Номер телефона",
                phonePlaceholder: "Введите номер телефона (необязательно)",
                role: "Роль",
                selectRole: "Выберите роль (необязательно)",
                roleHint: "Если не выбрано, по умолчанию будет назначена роль DEVELOPER",
                cancel: "Отмена",
                saveChanges: "Сохранить изменения",
                updating: "Обновление...",
                required: "Имя, username и email обязательны",
                success: "успешно обновлён",
                error: "Не удалось обновить пользователя. Попробуйте ещё раз.",
                connectionError: "Проверьте подключение."
            },

            deleteUser: {
                title: "Удалить пользователя",
                subtitle: "Необратимое действие",
                warning: "⚠️ Это действие нельзя отменить!",
                warningText: "Вы собираетесь навсегда удалить этого пользователя. Все данные и доступ будут удалены.",
                userName: "Имя пользователя",
                username: "Имя пользователя",
                cancel: "Отмена",
                deleteBtn: "Удалить",
                deleting: "Удаление...",
                success: "успешно удалён",
                error: "Не удалось удалить пользователя. Попробуйте ещё раз.",
                connectionError: "Проверьте подключение."
            }
        },

        // Home & Org pages (abbreviated for space)
        home: {
            title: "DB-Controller",
            tagline: "Мощное управление базами данных для современных команд",
            login: "Войти",
            createOrg: "Создать организацию",
            scrollMore: "Прокрутите, чтобы узнать больше",
            aboutTitle: "О проекте",
            aboutSubtitle: "Всё, что вам нужно знать о DB-Controller",
            feature1Title: "Управление базами данных",
            feature1Desc: "Централизованный контроль над всеми подключениями к базам данных.",
            feature2Title: "Командная работа",
            feature2Desc: "Приглашайте членов команды, назначайте роли и управляйте правами доступа.",
            feature3Title: "Безопасность и шифрование",
            feature3Desc: "Корпоративный уровень безопасности с зашифрованными учётными данными.",
            feature4Title: "Мониторинг в реальном времени",
            feature4Desc: "Отслеживайте производительность баз данных и получайте мгновенные уведомления.",
            feature5Title: "Доступ на основе ролей",
            feature5Desc: "Определите пользовательские роли и права для разных членов команды.",
            feature6Title: "Поддержка множества БД",
            feature6Desc: "Работайте с PostgreSQL, MySQL, MongoDB и другими.",
            howItWorksTitle: "Как это работает",
            step1Title: "Создайте организацию",
            step1Desc: "Настройте организацию и получите уникальный ID.",
            step2Title: "Настройте DB Agent",
            step2Desc: "Установите и настройте db-agent для безопасного подключения.",
            step3Title: "Управляйте и мониторьте",
            step3Desc: "Получите доступ к панели управления.",
            ctaTitle: "Готовы начать?",
            ctaSubtitle: "Присоединяйтесь к командам по всему миру",
            alreadyHaveAccount: "Уже есть аккаунт? Войти",
            footerCopyright: "© 2025 DB-Controller. Все права защищены."
        },

        org: {
            title: "Создать организацию",
            subtitle: "Настройте организацию и учётную запись администратора",
            orgNameLabel: "Название организации",
            orgNamePlaceholder: "Введите название организации",
            createOrgBtn: "Создать организацию",
            orgCreatedNotice: "Организация создана!",
            orgCreatedDesc: "Теперь создайте учётную запись администратора.",
            emailWarningTitle: "Важно:",
            emailWarningDesc: "Ваш пароль будет отправлен на указанный email.",
            fullNameLabel: "Полное имя",
            fullNamePlaceholder: "Введите ваше полное имя",
            usernameLabel: "Имя пользователя",
            usernamePlaceholder: "Выберите имя пользователя",
            emailLabel: "Адрес электронной почты",
            emailPlaceholder: "your.email@example.com",
            emailHint: "Учётные данные будут отправлены на этот email",
            createAccountBtn: "Создать аккаунт",
            backToHome: "Вернуться на главную",
            editOrgName: "Изменить название организации",
            successTitle: "Организация создана!",
            successSubtitle: "Ваша организация успешно создана",
            credentialsSent: "Учётные данные отправлены на ваш email.",
            downloadAgent: "Скачать Agent",
            loadingAgents: "Загрузка агентов...",
            clickToDownload: "Нажмите для скачивания",
            downloading: "Загрузка...",
            downloaded: "Загружено",
            unableToLoad: "Не удалось загрузить агенты",
            retry: "Повторить",
            orgIdWarning: "Важно: Включите этот ID в конфигурацию db-agent.",
            orgIdLabel: "ID организации",
            copy: "Копировать",
            copied: "Скопировано!",
            goToLogin: "Перейти ко входу",
            creatingOrg: "Создание организации...",
            creatingAccount: "Создание учётной записи...",
            enterOrgName: "Введите название организации",
            fillAllFields: "Заполните все обязательные поля",
            nameMinLength: "Полное имя должно содержать не менее 2 символов",
            invalidEmail: "Введите действительный email",
            orgCreationFailed: "Не удалось создать организацию",
            userCreationFailed: "Не удалось создать аккаунт",
            downloadFailed: "Не удалось скачать",
            copyFailed: "Не удалось скопировать"
        },
        orgPage: {
            title: "Настройки организации",
            subtitle: "Управление информацией об организации и просмотр активности",

            detailsCard: {
                title: "Детали организации",
                loading: "Загрузка информации об организации...",
                error: "Не удалось загрузить информацию об организации",
                retry: "Повторить"
            },

            fields: {
                orgId: "ID организации",
                orgIdHint: "Используйте этот ID при настройке агентов",
                orgName: "Название организации",
                copy: "Копировать",
                copied: "Скопировано!",
                edit: "Изменить",
                save: "Сохранить",
                saving: "Сохранение...",
                cancel: "Отмена",
                placeholder: "Введите название организации"
            },

            activityCard: {
                title: "Аналитика активности",
                comingSoon: "Скоро",
                description: "Отслеживайте ежедневную активность организации, использование агентов и показатели производительности.",
                features: {
                    tracking: "Отслеживание активности",
                    statistics: "Статистика использования",
                    insights: "Аналитика производительности"
                }
            },

            toasts: {
                copySuccess: "ID организации скопирован в буфер обмена",
                copyError: "Не удалось скопировать в буфер обмена",
                nameEmpty: "Название организации не может быть пустым",
                dataNotLoaded: "Данные организации не загружены",
                updateSuccess: "Название организации успешно обновлено",
                updateError: "Не удалось обновить название организации",
                loadError: "Не удалось загрузить информацию об организации"
            }
        },
        agentsPage: {
            title: "Загрузка агентов",
            subtitle: "Загрузите версии агента базы данных и управляйте ими",

            versionsSection: {
                title: "Доступные версии",
                loading: "Загрузка доступных версий...",
                error: "Не удалось загрузить версии",
                retry: "Повторить",
                selectLabel: "Выберите версию для загрузки",
                selectPlaceholder: "Выберите версию...",
                download: "Скачать",
                downloading: "Загрузка...",
                downloaded: "Загружено",
                noVersions: "Нет доступных версий",
                noVersionsHint: "Проверьте позже для новых релизов"
            },

            historySection: {
                title: "История загрузок",
                loading: "Загрузка истории загрузок...",
                error: "Не удалось загрузить историю",
                retry: "Повторить",
                empty: "История загрузок пуста",
                emptyHint: "Загрузите агент, чтобы увидеть его здесь",
                tableHeaders: {
                    version: "Версия",
                    downloadedBy: "Загрузил",
                    downloadDate: "Дата загрузки"
                }
            },

            time: {
                justNow: "Только что",
                minAgo: "мин назад",
                hourAgo: "час назад",
                hoursAgo: "часов назад",
                dayAgo: "день назад",
                daysAgo: "дней назад",
                unknownSize: "Неизвестный размер",
                notProvided: "Не указано",
                invalidDate: "Неверная дата"
            },

            toasts: {
                selectVersion: "Пожалуйста, выберите версию для загрузки",
                downloadSuccess: "успешно загружен",
                downloadError: "Не удалось загрузить агент. Попробуйте ещё раз.",
                loadVersionsError: "Не удалось загрузить доступные версии",
                loadHistoryError: "Не удалось загрузить историю загрузок"
            }
        },
        profilePage: {
            title: "Мой профиль",
            subtitle: "Просмотр и редактирование информации об аккаунте",
            loading: "Загрузка...",

            fields: {
                fullName: "Полное имя",
                username: "Имя пользователя",
                email: "Email",
                phone: "Телефон",
                notProvided: "Не указано",
                na: "Н/Д"
            },

            placeholders: {
                fullName: "Введите полное имя",
                username: "Введите имя пользователя",
                email: "Введите email",
                phone: "Введите номер телефона"
            },

            buttons: {
                edit: "Изменить",
                save: "Сохранить",
                saving: "Сохранение...",
                cancel: "Отмена",
                retry: "Повторить"
            },

            error: {
                title: "Не удалось загрузить профиль",
                message: "Не удалось получить информацию о вашем профиле. Попробуйте ещё раз."
            },

            validation: {
                fieldEmpty: "Это поле не может быть пустым",
                invalidEmail: "Введите действительный адрес email"
            },

            success: {
                nameUpdated: "Имя успешно обновлено!",
                usernameUpdated: "Имя пользователя успешно обновлено!",
                emailUpdated: "Email успешно обновлён!",
                phoneUpdated: "Телефон номер успешно обновлён!"
            },

            toasts: {
                loadError: "Не удалось загрузить профиль",
                updateError: "Не удалось обновить {field}. Попробуйте ещё раз."
            }
        },
        settingsPage: {
            title: "Настройки",
            subtitle: "Управление настройками аккаунта",

            sections: {
                security: {
                    title: "Безопасность",
                    description: "Управление паролем и настройками безопасности",
                    changePassword: {
                        title: "Изменить пароль",
                        description: "Обновите пароль для защиты аккаунта",
                        button: "Изменить"
                    }
                },

                notifications: {
                    title: "Уведомления",
                    description: "Настройка получения уведомлений",
                    emailNotifications: {
                        title: "Email уведомления",
                        description: "Получать обновления о статусе аккаунта на email"
                    }
                },

                preferences: {
                    title: "Предпочтения",
                    description: "Настройте интерфейс под себя",
                    language: {
                        title: "Язык",
                        description: "Выберите предпочитаемый язык"
                    },
                    theme: {
                        title: "Тема",
                        description: "Выберите тему интерфейса",
                        options: {
                            light: "Light",
                            dark: "Dark",
                            auto: "Auto"
                        }
                    }
                },

                account: {
                    title: "Аккаунт",
                    description: "Управление настройками аккаунта",
                    logout: {
                        title: "Выход",
                        description: "Выйти из аккаунта",
                        button: "Выйти"
                    }
                }
            },

            passwordModal: {
                step1: {
                    title: "Изменить пароль",
                    subtitle: "Введите текущий пароль для продолжения",
                    currentPassword: "Текущий пароль",
                    placeholder: "Введите текущий пароль",
                    continue: "Продолжить",
                    cancel: "Отмена",
                    verifying: "Проверка..."
                },

                step2: {
                    title: "Установить новый пароль",
                    subtitle: "Выберите надёжный пароль для аккаунта",
                    newPassword: "Новый пароль",
                    newPasswordPlaceholder: "Введите новый пароль (мин. 8 символов)",
                    confirmPassword: "Подтвердите пароль",
                    confirmPasswordPlaceholder: "Введите пароль ещё раз",
                    save: "Сохранить пароль",
                    saving: "Сохранение...",
                    cancel: "Отмена"
                },

                requirements: {
                    length: "Минимум 8 символов",
                    match: "Пароли совпадают"
                },

                warnings: {
                    attemptRemaining: "Внимание: осталось {count} попыт{s} до выхода",
                    attempts: "ок",
                    attempt: "ка"
                },

                toasts: {
                    enterCurrent: "Введите текущий пароль",
                    verified: "Пароль успешно проверен!",
                    incorrectAttempts: "Неверный пароль. Осталось попыток: {count}.",
                    tooManyAttempts: "Слишком много попыток. Перенаправление на вход...",
                    connectionError: "Ошибка подключения. Попробуйте ещё раз.",
                    fillAllFields: "Заполните все поля",
                    minLength: "Пароль должен содержать минимум 8 символов",
                    noMatch: "Пароли не совпадают",
                    success: "Пароль успешно изменён!",
                    updateError: "Не удалось обновить пароль. Попробуйте ещё раз."
                }
            },

            logoutModal: {
                title: "Выход",
                message: "Вы уверены, что хотите выйти? Вам нужно будет войти снова для доступа к аккаунту.",
                cancel: "Отмена",
                confirm: "Выйти"
            }
        }
    },

    uz: {
        // Common
        common: {
            loading: "Yuklanmoqda...",
            error: "Xato",
            success: "Muvaffaqiyatli",
            cancel: "Bekor qilish",
            confirm: "Tasdiqlash",
            close: "Yopish",
            save: "Saqlash",
            delete: "O'chirish",
            edit: "Tahrirlash",
            back: "Orqaga",
            next: "Keyingi",
            previous: "Oldingi",
            submit: "Yuborish",
            required: "Majburiy",
            retry: "Qayta urinish",
            copied: "Nusxa olindi!",
            copy: "Nusxa olish"
        },

        // Sidebar
        sidebar: {
            main: "Asosiy",
            databases: "Ma'lumotlar bazalari",
            users: "Foydalanuvchilar",
            agents: "Agentlar",
            profile: "Profil",
            settings: "Sozlamalar",
            organization: "Tashkilot"
        },

        // Main Page (Databases)
        main: {
            pageTitle: "Mening ma'lumotlar bazalarim",
            loading: "Ma'lumotlar bazalaringiz yuklanmoqda...",
            loadError: "Ma'lumotlar bazalarini yuklab bo'lmadi",
            noDatabases: {
                title: "Ma'lumotlar bazasiga kirish yo'q",
                message: "Sizda hali tayinlangan ma'lumotlar bazalari yo'q.",
                contact: "Kirish uchun administratoringizga murojaat qiling."
            },
            card: {
                username: "Foydalanuvchi nomi",
                password: "Parol"
            },
            modal: {
                username: "Foydalanuvchi nomi",
                password: "Parol",
                roles: "Rollar",
                noRoles: "Rollar tayinlanmagan",
                noDescription: "Tavsif yo'q",
                editPassword: "Parolni tahrirlash",
                showPassword: "Parolni ko'rsatish",
                hidePassword: "Parolni yashirish"
            },
            passwordEdit: {
                newPassword: "Yangi parolni kiriting",
                save: "Saqlash",
                cancel: "Bekor qilish",
                saving: "Saqlanmoqda...",
                minLength: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
                enterPassword: "Iltimos, yangi parolni kiriting",
                updateSuccess: "Parol muvaffaqiyatli yangilandi",
                updateError: "Parolni yangilab bo'lmadi",
                notFound: "Xato: parol kiritish maydoni topilmadi",
                dbNotAvailable: "Xato: ma'lumotlar bazasi haqida ma'lumot mavjud emas",
                saveButtonNotFound: "Xato: saqlash tugmasi topilmadi",
                connectionError: "Ulanish xatosi. Qaytadan urinib ko'ring."
            },
            toast: {
                passwordCopied: "Parol buferga nusxalandi",
                usernameCopied: "Foydalanuvchi nomi buferga nusxalandi"
            }
        },

        // Databases Page
        databases: {
            pageTitle: "Ma'lumotlar bazalarini boshqarish",
            pageSubtitle: "Barcha ma'lumotlar bazalarini sozlash va boshqarish",
            loading: "Ma'lumotlar bazalari yuklanmoqda...",
            loadError: "Ma'lumotlar bazalarini yuklab bo'lmadi. Qaytadan urinib ko'ring.",
            noDatabases: "Ma'lumotlar bazalari topilmadi",
            card: {
                members: "A'zolar",
                addMember: "A'zo qo'shish",
                noMembers: "A'zolar yo'q",
                editMember: "A'zoni tahrirlash",
                deleteMember: "A'zoni o'chirish"
            },
            memberModal: {
                unknownUser: "Noma'lum foydalanuvchi",
                username: "Foydalanuvchi nomi",
                email: "Email",
                phone: "Telefon",
                role: "Rol",
                na: "M/Y",
                databaseInfo: "Ma'lumotlar bazasi haqida",
                databaseUsername: "MB foydalanuvchi nomi",
                databaseRoles: "MB rollari",
                noRolesAssigned: "MB rollari tayinlanmagan",
                noDescription: "Tavsif mavjud emas"
            },
            addMember: {
                title: "A'zo qo'shish:",
                step1Title: "Foydalanuvchini tanlang",
                step2Title: "Ma'lumotlarni kiriting",
                searchPlaceholder: "Ism, username yoki email bo'yicha qidirish...",
                searching: "Qidirilmoqda...",
                noUsersFound: "Foydalanuvchilar topilmadi",
                failedToLoad: "Foydalanuvchilarni yuklab bo'lmadi",
                selectedUser: "Tanlangan foydalanuvchi",
                dbUsername: "MB foydalanuvchi nomi",
                dbUsernamePlaceholder: "MB foydalanuvchi nomini kiriting",
                dbPassword: "MB paroli",
                dbPasswordPlaceholder: "MB parolini kiriting",
                selectRoles: "MB rollarini tanlang",
                availableRoles: "Mavjud rollar",
                selectedRoles: "Tanlangan rollar",
                noRolesSelected: "Rollar tanlanmagan",
                noRolesAvailable: "Ushbu MB uchun mavjud rollar yo'q",
                back: "Orqaga",
                cancel: "Bekor qilish",
                next: "Keyingi",
                addMember: "A'zo qo'shish",
                adding: "Qo'shilmoqda...",
                fillAllFields: "Iltimos, barcha majburiy maydonlarni to'ldiring",
                invalidUsername: "MB foydalanuvchi nomi faqat harflar, raqamlar va pastki chiziqlarni o'z ichiga olishi mumkin",
                memberAdded: "qo'shildi:",
                addFailed: "A'zoni qo'shib bo'lmadi. Qaytadan urinib ko'ring."
            },
            editMember: {
                title: "A'zoni tahrirlash:",
                username: "MB foydalanuvchi nomi",
                password: "MB paroli",
                hint: "💡 Siz faqat ushbu a'zoga tayinlangan rollarni o'zgartirishingiz mumkin. Boshqa ma'lumotlar faqat o'qish uchun.",
                manageRoles: "Rollarni boshqarish",
                availableRoles: "Mavjud rollar",
                selectedRoles: "Tanlangan rollar",
                noRolesSelected: "Rollar tanlanmagan",
                noRolesAvailable: "Ushbu MB uchun mavjud rollar yo'q",
                cancel: "Bekor qilish",
                saveChanges: "O'zgarishlarni saqlash",
                updating: "Yangilanmoqda...",
                noMemberSelected: "Tahrirlash uchun a'zo tanlanmagan",
                noChanges: "o'zgarishlar muvaffaqiyatli saqlandi",
                rolesUpdated: " rollari muvaffaqiyatli yangilandi",
                updateFailed: "A'zoni yangilab bo'lmadi. Qaytadan urinib ko'ring.",
                roleSelected: "✓ Tanlangan"
            },
            deleteMember: {
                title: "A'zoni o'chirish",
                subtitle: "Doimiy harakat",
                warning: "⚠️ Bu harakatni bekor qilib bo'lmaydi!",
                warningText: "Siz ushbu a'zoni ma'lumotlar bazasidan butunlay olib tashlashga tayyorsiz. Barcha kirish huquqlari va ruxsatlar darhol bekor qilinadi.",
                memberLabel: "A'zo",
                databaseLabel: "Ma'lumotlar bazasi",
                cancel: "Bekor qilish",
                deleteBtn: "A'zoni o'chirish",
                deleting: "O'chirilmoqda...",
                memberRemoved: "ma'lumotlar bazasidan olib tashlandi",
                deleteFailed: "A'zoni o'chirib bo'lmadi. Qaytadan urinib ko'ring."
            },
            rolesModal: {
                title: "Mavjud MB rollari",
                noDescription: "Tavsif yo'q",
                selected: "✓ Tanlangan"
            }
        },

        // Users Page
        users: {
            pageTitle: "Foydalanuvchilar",
            pageSubtitle: "Tizim foydalanuvchilarini boshqarish",
            searchPlaceholder: "Ism, foydalanuvchi nomi yoki elektron pochta orqali qidirish...",
            addUserBtn: "Qo‘shish",
            loading: "Foydalanuvchilar yuklanmoqda...",
            searching: "Qidirilmoqda...",
            noUsers: "Foydalanuvchilar topilmadi",
            loadError: "Foydalanuvchilarni yuklashda xatolik yuz berdi.",
            searchError: "Natijalar topilmadi yoki qidiruvda xatolik yuz berdi.",
            retry: "Qayta urinish",
            clearSearch: "Qidiruvni tozalash",

            // User list item
            listItem: {
                editUser: "Foydalanuvchini tahrirlash",
                deleteUser: "Foydalanuvchini o‘chirish"
            },

            // User detail modal
            detailModal: {
                title: "Foydalanuvchi ma’lumotlari",
                username: "Foydalanuvchi nomi",
                email: "Elektron pochta",
                phone: "Telefon raqami",
                role: "Rol",
                notProvided: "Kiritilmagan",
                noRole: "Rol belgilanmagan",
                copied: "Nusxalandi!"
            },

            // Add user modal
            addUser: {
                title: "Yangi foydalanuvchi yaratish",
                fullName: "To‘liq ism",
                fullNamePlaceholder: "To‘liq ismni kiriting",
                username: "Foydalanuvchi nomi",
                usernamePlaceholder: "Foydalanuvchi nomini kiriting",
                email: "Elektron pochta",
                emailPlaceholder: "Elektron pochta manzilini kiriting",
                phone: "Telefon raqami",
                phonePlaceholder: "Telefon raqamini kiriting (ixtiyoriy)",
                role: "Rol",
                selectRole: "Rolni tanlang (ixtiyoriy)",
                roleHint: "Agar tanlanmasa, Role DEVELOPER belgilanadi",
                cancel: "Bekor qilish",
                createUser: "Yaratish",
                creating: "Yaratilmoqda...",
                required: "Ism, foydalanuvchi nomi va elektron pochta majburiy",
                success: "muvaffaqiyatli yaratildi",
                error: "Foydalanuvchini yaratib bo‘lmadi. Iltimos, qayta urinib ko‘ring.",
                connectionError: "Iltimos, internet aloqasini tekshiring."
            },

            // Edit user modal
            editUser: {
                title: "Foydalanuvchini tahrirlash",
                fullName: "To‘liq ism",
                fullNamePlaceholder: "To‘liq ismni kiriting",
                username: "Foydalanuvchi nomi",
                usernamePlaceholder: "Foydalanuvchi nomini kiriting",
                email: "Elektron pochta",
                emailPlaceholder: "Elektron pochta manzilini kiriting",
                phone: "Telefon raqami",
                phonePlaceholder: "Telefon raqamini kiriting (ixtiyoriy)",
                role: "Rol",
                selectRole: "Rolni tanlang (ixtiyoriy)",
                roleHint: "Agar tanlanmasa, sukut bo‘yicha DEVELOPER belgilanadi",
                cancel: "Bekor qilish",
                saveChanges: "O‘zgarishlarni saqlash",
                updating: "Yangilanmoqda...",
                required: "Ism, foydalanuvchi nomi va elektron pochta majburiy",
                success: "muvaffaqiyatli yangilandi",
                error: "Foydalanuvchini yangilab bo‘lmadi. Iltimos, qayta urinib ko‘ring.",
                connectionError: "Iltimos, internet aloqasini tekshiring."
            },

            // Delete user modal
            deleteUser: {
                title: "Foydalanuvchini o‘chirish",
                subtitle: "Qaytarib bo‘lmaydigan amal",
                warning: "⚠️ Ushbu amalni bekor qilib bo‘lmaydi!",
                warningText: "Siz ushbu foydalanuvchini butunlay o‘chirmoqchisiz. Barcha ma’lumotlari va kirish huquqlari olib tashlanadi.",
                userName: "Foydalanuvchi ismi",
                username: "Foydalanuvchi nomi",
                cancel: "Bekor qilish",
                deleteBtn: "O‘chirish",
                deleting: "O‘chirilmoqda...",
                success: "muvaffaqiyatli o‘chirildi",
                error: "Foydalanuvchini o‘chirib bo‘lmadi. Iltimos, qayta urinib ko‘ring.",
                connectionError: "Iltimos, internet aloqasini tekshiring."
            }
        },


        // Home Page
        home: {
            title: "DB-Controller",
            tagline: "Zamonaviy jamoalar uchun kuchli ma'lumotlar bazasini boshqarish",
            login: "Kirish",
            createOrg: "Tashkilot yaratish",
            scrollMore: "Ko'proq ma'lumot olish uchun pastga aylantiring",
            aboutTitle: "Loyiha haqida",
            aboutSubtitle: "DB-Controller haqida bilishingiz kerak bo'lgan hamma narsa",
            feature1Title: "Ma'lumotlar bazasini boshqarish",
            feature1Desc: "Barcha ma'lumotlar bazasi ulanishlarini markazlashtirilgan boshqarish.",
            feature2Title: "Jamoaviy hamkorlik",
            feature2Desc: "Jamoa a'zolarini taklif qiling va rollarni belgilang.",
            feature3Title: "Xavfsiz va shifrlangan",
            feature3Desc: "Korporativ darajadagi xavfsizlik.",
            feature4Title: "Real vaqtda monitoring",
            feature4Desc: "Ma'lumotlar bazasi samaradorligini kuzating.",
            feature5Title: "Rollarga asoslangan kirish",
            feature5Desc: "Maxsus rollar va ruxsatlarni belgilang.",
            feature6Title: "Ko'p ma'lumotlar bazasi qo'llab-quvvatlash",
            feature6Desc: "PostgreSQL, MySQL, MongoDB va boshqalar bilan ishlang.",
            howItWorksTitle: "Bu qanday ishlaydi",
            step1Title: "Tashkilot yarating",
            step1Desc: "Tashkilotingizni sozlang va noyob ID oling.",
            step2Title: "DB Agent-ni sozlang",
            step2Desc: "Agent-ni o'rnating va sozlang.",
            step3Title: "Boshqaring va monitoring qiling",
            step3Desc: "Boshqaruv paneliga kiring.",
            ctaTitle: "Boshlashga tayyormisiz?",
            ctaSubtitle: "Butun dunyo bo'ylab jamoalarga qo'shiling",
            alreadyHaveAccount: "Allaqachon hisobingiz bormi? Kirish",
            footerCopyright: "© 2025 DB-Controller. Barcha huquqlar himoyalangan."
        },

        // Organization Page
        org: {
            title: "Tashkilot yaratish",
            subtitle: "Tashkilotingiz va administrator hisobini sozlang",
            orgNameLabel: "Tashkilot nomi",
            orgNamePlaceholder: "Tashkilot nomini kiriting",
            createOrgBtn: "Tashkilot yaratish",
            orgCreatedNotice: "Tashkilot yaratildi!",
            orgCreatedDesc: "Administrator hisobini yarating.",
            emailWarningTitle: "Muhim:",
            emailWarningDesc: "Parolingiz emailga yuboriladi.",
            fullNameLabel: "To'liq ism",
            fullNamePlaceholder: "To'liq ismingizni kiriting",
            usernameLabel: "Foydalanuvchi nomi",
            usernamePlaceholder: "Foydalanuvchi nomini tanlang",
            emailLabel: "Elektron pochta manzili",
            emailPlaceholder: "your.email@example.com",
            emailHint: "Ma'lumotlar emailga yuboriladi",
            createAccountBtn: "Hisob yaratish",
            backToHome: "Bosh sahifaga qaytish",
            editOrgName: "Tashkilot nomini tahrirlash",
            successTitle: "Tashkilot yaratildi!",
            successSubtitle: "Tashkilotingiz muvaffaqiyatli yaratildi",
            credentialsSent: "Ma'lumotlar emailingizga yuborildi.",
            downloadAgent: "Agent-ni yuklab olish",
            loadingAgents: "Agentlar yuklanmoqda...",
            clickToDownload: "Yuklab olish uchun bosing",
            downloading: "Yuklanmoqda...",
            downloaded: "Yuklandi",
            unableToLoad: "Agentlarni yuklab bo'lmadi",
            retry: "Qayta urinish",
            orgIdWarning: "Muhim: Ushbu ID-ni agent konfiguratsiyasiga qo'shing.",
            orgIdLabel: "Tashkilot ID",
            copy: "Nusxa olish",
            copied: "Nusxa olindi!",
            goToLogin: "Kirishga o'tish",
            creatingOrg: "Tashkilot yaratilmoqda...",
            creatingAccount: "Hisob yaratilmoqda...",
            enterOrgName: "Tashkilot nomini kiriting",
            fillAllFields: "Barcha maydonlarni to'ldiring",
            nameMinLength: "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
            invalidEmail: "To'g'ri email kiriting",
            orgCreationFailed: "Tashkilot yaratib bo'lmadi",
            userCreationFailed: "Hisob yaratib bo'lmadi",
            downloadFailed: "Yuklab olib bo'lmadi",
            copyFailed: "Nusxa ko'chirib bo'lmadi"
        },
        orgPage: {
            title: "Tashkilot sozlamalari",
            subtitle: "Tashkilot ma'lumotlarini boshqaring va faoliyatni ko'ring",

            detailsCard: {
                title: "Tashkilot tafsilotlari",
                loading: "Tashkilot ma'lumotlari yuklanmoqda...",
                error: "Tashkilot ma'lumotlarini yuklab bo'lmadi",
                retry: "Qayta urinish"
            },

            fields: {
                orgId: "Tashkilot ID",
                orgIdHint: "Agentlarni sozlashda ushbu ID-dan foydalaning",
                orgName: "Tashkilot nomi",
                copy: "Nusxa olish",
                copied: "Nusxa olindi!",
                edit: "Tahrirlash",
                save: "Saqlash",
                saving: "Saqlanmoqda...",
                cancel: "Bekor qilish",
                placeholder: "Tashkilot nomini kiriting"
            },

            activityCard: {
                title: "Faoliyat tahlili",
                comingSoon: "Tez orada",
                description: "Tashkilotingizning kunlik faoliyatini, agent foydalanishini va samaradorlik ko'rsatkichlarini kuzating.",
                features: {
                    tracking: "Faoliyatni kuzatish",
                    statistics: "Foydalanish statistikasi",
                    insights: "Samaradorlik tahlili"
                }
            },

            toasts: {
                copySuccess: "Tashkilot ID buferga nusxalandi",
                copyError: "Buferga nusxalab bo'lmadi",
                nameEmpty: "Tashkilot nomi bo'sh bo'lishi mumkin emas",
                dataNotLoaded: "Tashkilot ma'lumotlari yuklanmagan",
                updateSuccess: "Tashkilot nomi muvaffaqiyatli yangilandi",
                updateError: "Tashkilot nomini yangilab bo'lmadi",
                loadError: "Tashkilot ma'lumotlarini yuklab bo'lmadi"
            }
        },
        agentsPage: {
            title: "Agent yuklash",
            subtitle: "Ma'lumotlar bazasi agent versiyalarini yuklab oling va boshqaring",

            versionsSection: {
                title: "Mavjud versiyalar",
                loading: "Mavjud versiyalar yuklanmoqda...",
                error: "Versiyalarni yuklab bo'lmadi",
                retry: "Qayta urinish",
                selectLabel: "Yuklab olish uchun versiyani tanlang",
                selectPlaceholder: "Versiyani tanlang...",
                download: "Yuklab olish",
                downloading: "Yuklanmoqda...",
                downloaded: "Yuklandi",
                noVersions: "Mavjud versiyalar yo'q",
                noVersionsHint: "Yangi relizlar uchun keyinroq tekshiring"
            },

            historySection: {
                title: "Yuklab olish tarixi",
                loading: "Yuklab olish tarixi yuklanmoqda...",
                error: "Tarixni yuklab bo'lmadi",
                retry: "Qayta urinish",
                empty: "Yuklab olish tarixi yo'q",
                emptyHint: "Agent-ni yuklab oling, uni bu yerda ko'rish uchun",
                tableHeaders: {
                    version: "Versiya",
                    downloadedBy: "Yuklab oldi",
                    downloadDate: "Yuklab olish sanasi"
                }
            },

            time: {
                justNow: "Hozirgina",
                minAgo: "daqiqa oldin",
                hourAgo: "soat oldin",
                hoursAgo: "soat oldin",
                dayAgo: "kun oldin",
                daysAgo: "kun oldin",
                unknownSize: "Noma'lum hajm",
                notProvided: "Ko'rsatilmagan",
                invalidDate: "Noto'g'ri sana"
            },

            toasts: {
                selectVersion: "Iltimos, yuklab olish uchun versiyani tanlang",
                downloadSuccess: "muvaffaqiyatli yuklandi",
                downloadError: "Agent-ni yuklab bo'lmadi. Qaytadan urinib ko'ring.",
                loadVersionsError: "Mavjud versiyalarni yuklab bo'lmadi",
                loadHistoryError: "Yuklab olish tarixini yuklab bo'lmadi"
            }
        },
        profilePage: {
            title: "Mening profilim",
            subtitle: "Hisob ma'lumotlarini ko'rish va tahrirlash",
            loading: "Yuklanmoqda...",

            fields: {
                fullName: "To'liq ism",
                username: "Foydalanuvchi nomi",
                email: "Email",
                phone: "Telefon",
                notProvided: "Ko'rsatilmagan",
                na: "M/Y"
            },

            placeholders: {
                fullName: "To'liq ismni kiriting",
                username: "Foydalanuvchi nomini kiriting",
                email: "Email-ni kiriting",
                phone: "Telefon raqamini kiriting"
            },

            buttons: {
                edit: "Tahrirlash",
                save: "Saqlash",
                saving: "Saqlanmoqda...",
                cancel: "Bekor qilish",
                retry: "Qayta urinish"
            },

            error: {
                title: "Profilni yuklab bo'lmadi",
                message: "Profil ma'lumotlarini olib bo'lmadi. Qaytadan urinib ko'ring."
            },

            validation: {
                fieldEmpty: "Bu maydon bo'sh bo'lishi mumkin emas",
                invalidEmail: "To'g'ri email manzilini kiriting"
            },

            success: {
                nameUpdated: "Ism muvaffaqiyatli yangilandi!",
                usernameUpdated: "Foydalanuvchi nomi muvaffaqiyatli yangilandi!",
                emailUpdated: "Email muvaffaqiyatli yangilandi!",
                phoneUpdated: "Telefon raqam muvaffaqiyatli yangilandi!"
            },

            toasts: {
                loadError: "Profilni yuklab bo'lmadi",
                updateError: "{field} yangilab bo'lmadi. Qaytadan urinib ko'ring."
            }
        },
        settingsPage: {
            title: "Sozlamalar",
            subtitle: "Hisob sozlamalarini boshqarish",

            sections: {
                security: {
                    title: "Xavfsizlik",
                    description: "Parol va xavfsizlik sozlamalarini boshqarish",
                    changePassword: {
                        title: "Parolni o'zgartirish",
                        description: "Hisobingizni xavfsiz saqlash uchun parolni yangilang",
                        button: "O'zgartirish"
                    }
                },

                notifications: {
                    title: "Bildirishnomalar",
                    description: "Bildirishnomalarni qabul qilish usulini sozlang",
                    emailNotifications: {
                        title: "Email bildirishnomalar",
                        description: "Hisob holati haqida email yangilanishlarini oling"
                    }
                },

                preferences: {
                    title: "Afzalliklar",
                    description: "O'zingizga qulay qilib sozlang",
                    language: {
                        title: "Til",
                        description: "Kerakli tilni tanlang"
                    },
                    theme: {
                        title: "Mavzu",
                        description: "Interfeys mavzusini tanlang",
                        options: {
                            light: "Light",
                            dark: "Dark",
                            auto: "Auto"
                        }
                    }
                },

                account: {
                    title: "Hisob",
                    description: "Hisob sozlamalarini boshqarish",
                    logout: {
                        title: "Chiqish",
                        description: "Hisobdan chiqish",
                        button: "Chiqish"
                    }
                }
            },

            passwordModal: {
                step1: {
                    title: "Parolni o'zgartirish",
                    subtitle: "Davom etish uchun joriy parolni kiriting",
                    currentPassword: "Joriy parol",
                    placeholder: "Joriy parolni kiriting",
                    continue: "Davom etish",
                    cancel: "Bekor qilish",
                    verifying: "Tekshirilmoqda..."
                },

                step2: {
                    title: "Yangi parol o'rnatish",
                    subtitle: "Hisobingiz uchun kuchli parol tanlang",
                    newPassword: "Yangi parol",
                    newPasswordPlaceholder: "Yangi parolni kiriting (min. 8 ta belgi)",
                    confirmPassword: "Parolni tasdiqlang",
                    confirmPasswordPlaceholder: "Parolni qayta kiriting",
                    save: "Parolni saqlash",
                    saving: "Saqlanmoqda...",
                    cancel: "Bekor qilish"
                },

                requirements: {
                    length: "Kamida 8 ta belgi",
                    match: "Parollar mos keladi"
                },

                warnings: {
                    attemptRemaining: "Ogohlantirish: chiqishdan oldin {count} urinish qoldi",
                    attempts: "",
                    attempt: ""
                },

                toasts: {
                    enterCurrent: "Joriy parolni kiriting",
                    verified: "Parol muvaffaqiyatli tekshirildi!",
                    incorrectAttempts: "Noto'g'ri parol. Qolgan urinishlar: {count}.",
                    tooManyAttempts: "Juda ko'p urinishlar. Kirishga yo'naltirish...",
                    connectionError: "Ulanish xatosi. Qaytadan urinib ko'ring.",
                    fillAllFields: "Barcha maydonlarni to'ldiring",
                    minLength: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
                    noMatch: "Parollar mos kelmaydi",
                    success: "Parol muvaffaqiyatli o'zgartirildi!",
                    updateError: "Parolni yangilab bo'lmadi. Qaytadan urinib ko'ring."
                }
            },

            logoutModal: {
                title: "Chiqish",
                message: "Chiqishni xohlaysizmi? Hisobga kirish uchun qayta tizimga kirishingiz kerak bo'ladi.",
                cancel: "Bekor qilish",
                confirm: "Chiqish"
            }
        }
    }
};

// ==================== I18N UTILITY FUNCTIONS ====================

class I18n {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.translations = translations;
    }

    // Detect language from URL or browser
    detectLanguage() {
        // Try to get from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');

        if (urlLang && ['en', 'ru', 'uz'].includes(urlLang)) {
            return urlLang;
        }

        // Try to get from localStorage
        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang && ['en', 'ru', 'uz'].includes(storedLang)) {
            return storedLang;
        }

        // Detect from browser
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('ru')) return 'ru';
        if (browserLang.startsWith('uz')) return 'uz';

        return 'en'; // Default
    }

    // Get translation
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    }

    // Change language
    setLanguage(lang) {
        if (!['en', 'ru', 'uz'].includes(lang)) return;

        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        // Update URL parameter
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.pushState({}, '', url);

        // Trigger update event
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Create global instance
window.i18n = new I18n();

// Helper function for quick access
window.t = (key) => window.i18n.t(key);

// ==================== SETTINGS INTEGRATION ====================
// Bridge with settings-sync.js for seamless language switching

(function() {
    console.log('✅ i18n loaded, current language:', window.i18n.getCurrentLanguage());

    // Store the original handleLanguageChange if it exists
    const originalHandleLanguageChange = window.handleLanguageChange;

    // Enhanced handleLanguageChange that updates UI instantly
    window.handleLanguageChange = function(language) {
        console.log('🌐 Language change triggered:', language);

        // 1. Update i18n immediately for instant UI change
        if (window.i18n && ['en', 'ru', 'uz'].includes(language)) {
            window.i18n.setLanguage(language);
        }

        // 2. Call original handler if it exists (saves to backend)
        if (originalHandleLanguageChange) {
            originalHandleLanguageChange(language);
        }
    };

    console.log('🔗 Settings integration ready');
})();