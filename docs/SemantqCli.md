# Semantq CLI Commands Guide

Welcome to the Semantq CLI Commands Guide! This document provides a comprehensive overview of all available commands for the Semantq CLI tool.

## Quick Summary of Available Commands

### Project Commands
1. `semantq create <projectName>` - Generate new project structure
   - `-fs, --fullstack` - Install full stack setup (client + server + auth)
2. `semantq update` - Update Semantq to latest version
   - `--dry-run` - Preview changes without applying
   - `--force` - Force update even if versions match
   - `--restore` - Restore missing directories (docs/examples)

### Resource Generation
3. `semantq make:resource <name>` - Generate full backend resource (model+service+controller+route)
   - `-p, --pylon` - Generate Pylon-enabled resources with feature guarding
4. `semantq remove:resource <name>` - Remove all backend resource files
   - `-y, --yes` - Skip confirmation prompt

### Route System
5. `semantq make:route <routeName> [role]` - Create new route with templates
   - `-l, --layout` - Include layout file @layout.smq
   - `-c, --crud` - Add CRUD operations template
   - `-a, --auth` - Add authentication imports
   - `-s, --server` - Include server handlers server.js
   - `-A, --all` - Create all resources (@page.smq, @layout.smq, server.js)
   - `--ac` - Shortcut for both auth and CRUD
   - `-tw, --tailwind` - Add Tailwind CSS support
   - `-p, --pylon` - Create Pylon route with role-based structure (requires role argument)
6. `semantq remove:route <routeName>` - Remove route directory and all contents
   - `-y, --yes` - Skip confirmation prompt

### Component System
7. `semantq make:component <name>` - Create reusable components
   - `-p, --pylon` - Create Pylon-enabled component with feature guarding
8. `semantq remove:component <name>` - Remove component files
   - `-p, --pylon` - Remove Pylon component from pylon subdirectory
   - `-y, --yes` - Skip confirmation prompt

### Installation Commands
9. `semantq install:server` - Install the Semantq server package into your project
10. `semantq add:auth-ui` - Install the Semantq Auth UI into your project
11. `semantq install:tailwind` - Install and configure Tailwind CSS for Semantq

### AI Commands
12. `semantq ai <prompt>` - Generate code using AI and save to route directory
   - `-r, --route <route>` - Specify the route directory
   - `--full` - Wrap response in Semantq custom tags (@script, @style, @html)
   - `--js` - Generate only JavaScript
   - `--css` - Generate only CSS
   - `--html` - Generate only HTML
   - `--append` - Append generated code to file instead of overwriting

### Utility
13. `semantq add <moduleName>` - Add a Semantq module (e.g., @semantq/auth) to your project
14. `semantq migrate` - Run database migrations for the project and its modules
15. `semantq start` - Start the Semantq server in development mode
16. `semantq -v, --version` - Show version number

## Pylon Commands Reference

Pylon is a SaaS feature guard and billing module that enables permission-driven UI components within the Semantq framework.

### Pylon Route Management

**Create Pylon Route:**
Creates a role-based route with Pylon dashboard layout structure.

```bash
semantq make:route <routeName> <role> --pylon
```

**Examples:**
```bash
# Create a plan route for project-manager role
semantq make:route plan project-manager --pylon

# Create a user-add route for admin role (short flag)
semantq make:route user-add admin -p

# Create with server handlers
semantq make:route master-plan project-manager --pylon -A
```

**What it creates:**
- `src/routes/<role>/<routeName>/@page.smq` - Main route page with component imports
- `src/routes/<role>/<routeName>/@layout.smq` - Dashboard layout with CSS imports
- `src/routes/<role>/<routeName>/server.js` (if using `-s` or `-A` flag)

**Key Features:**
- Automatically converts route names to PascalCase (e.g., `user-add` → `UserAdd`)
- Sets up dashboard container with Sidebar, Header, and Footer imports
- Includes dashboard CSS and required external stylesheets
- Enables authentication by default

### Remove Route
Removes an existing route directory and all its contents.

```bash
semantq remove:route <routeName>
```

**Options:**
- `-y, --yes`: Skip confirmation prompt

**Example:**
```bash
# Remove a route with confirmation
semantq remove:route contact

# Remove without confirmation
semantq remove:route about -y
```

**Notes:**
- Works for both regular routes and Pylon routes
- Shows all files that will be removed before deletion
- Requires confirmation unless `-y` flag is used

### Pylon Component Management

**Create Pylon Component:**
Creates a Pylon-enabled component with feature guarding and permission-based UI.

```bash
semantq make:component <componentName> --pylon
```

**Examples:**
```bash
# Create a basic Pylon component
semantq make:component Project --pylon

# Create nested Pylon component
semantq make:component admin/User --pylon
```

**What it creates:**
- `src/components/pylon/<componentName>.smq` (or nested path)
- Includes complete permission system with `can()`, `canAny()`, `canAll()` functions
- Formique configuration for CRUD operations
- AnyGrid integration with permission-controlled features
- Loading states and error handling
- Accordion-based UI for create/view operations

**Key Features:**
- Automatic permission mapping from user settings
- State management with `$state` and `$effect`
- Integrated Formique forms with validation
- AnyGrid data tables with export permissions
- Role-based access control
- Automatic data refresh on record creation

### Remove Component
Removes a component file from the project.

```bash
semantq remove:component <componentName>
```

**Options:**
- `-p, --pylon`: Remove from Pylon components directory
- `-y, --yes`: Skip confirmation prompt

**Examples:**
```bash
# Remove regular component
semantq remove:component Button

# Remove Pylon component
semantq remove:component Plan --pylon

# Remove without confirmation
semantq remove:component User -p -y
```

**Notes:**
- Defaults to regular components directory
- Use `--pylon` flag for Pylon components
- Shows alternative location suggestions if not found

### Pylon Resource Management

**Create Pylon Resource:**
Generates a complete backend resource with Pylon feature guarding.

```bash
semantq make:resource <resourceName> --pylon
```

**Examples:**
```bash
# Create Pylon resource for User model
semantq make:resource User --pylon

# Create regular resource (non-Pylon)
semantq make:resource Product
```

**What it creates:**
- **Model**: Database model with Pylon permission fields
- **Controller**: CRUD operations with permission checks
- **Service**: Business logic layer
- **Routes**: API endpoints with middleware

**Key Features:**
- Database adapter-aware (MySQL, MongoDB, SQLite, Supabase)
- Automatic Pylon permission integration in controllers
- Feature flag system for SaaS capabilities
- Role-based access middleware
- Consistent naming conventions

### Remove Resource
Removes all backend resource files for a given resource.

```bash
semantq remove:resource <resourceName>
```

**Options:**
- `-y, --yes`: Skip confirmation prompt

**Example:**
```bash
# Remove User resource with confirmation
semantq remove:resource User

# Remove without confirmation
semantq remove:resource Product -y
```

**What it removes:**
- Model files across all database adapters
- Controller file
- Service file
- Route file

**Notes:**
- Only removes files that exist
- Shows list of files before deletion
- Requires server directory (`semantqQL`) to exist

## Common Workflow Examples

### Complete Pylon Feature Creation
```bash
# 1. Create the backend resource
semantq make:resource Invoice --pylon

# 2. Create the Pylon component
semantq make:component Invoice --pylon

# 3. Create the route for admin role
semantq make:route invoice admin --pylon
```

This creates:
- Backend: `Invoice` model, controller, service, routes
- Frontend: `Invoice.smq` Pylon component with permission UI
- Route: `/admin/invoice` dashboard route

### Cleanup Example
```bash
# Remove everything
semantq remove:resource Invoice -y
semantq remove:component Invoice --pylon -y
semantq remove:route invoice -y
```

## Advanced Route Management

Create routes with nested directory structures:

```bash
# Simple route
semantq make:route contact

# Nested routes
semantq make:route contact/asia
semantq make:route contact/asia/east
semantq make:route admin/users/list

# Route with options
semantq make:route projects --crud --auth
semantq make:route admin --all --tailwind
semantq make:route api/users --server --layout

# Pylon routes
semantq make:route plan project-manager --pylon
semantq make:route user-add admin -p
```

## Component System

Create reusable components with optional Pylon feature guarding:

```bash
# Standard components
semantq make:component Project
semantq make:component AddUser
semantq make:component forms/ContactForm
semantq make:component ui/Button

# Pylon-enabled components (with feature guarding)
semantq make:component Project --pylon
semantq make:component UserManager -p
semantq make:component admin/Dashboard --pylon
```

**Component Features:**
- Support for nested paths (`folder/ComponentName`)
- Automatic PascalCase conversion
- Pylon components include feature permission checking and CRUD operation templates

## Usage Examples

### Full-Stack Pylon Application
```bash
# Create Pylon-protected backend
semantq make:resource Project --pylon
semantq make:resource Task --pylon

# Create Pylon-enabled frontend components
semantq make:component ProjectList --pylon
semantq make:component TaskManager --pylon

# Create Pylon routes with auth and CRUD
semantq make:route projects project-manager --pylon --all
semantq make:route tasks project-manager --pylon --tailwind
```

### Standard Application
```bash
# Standard backend resources
semantq make:resource Product
semantq make:resource Category

# Standard components
semantq make:component ProductCard
semantq make:component CategoryList

# Basic routes
semantq make:route shop
semantq make:route about
```

## Tailwind CSS Installation

With Semantq, you only need to run one command to install Tailwind CSS:

```bash
semantq install:tailwind
```

This single command handles everything for you:
- Installs Tailwind CSS v3, PostCSS, and Autoprefixer
- Generates and configures `tailwind.config.js` and `postcss.config.js`
- Updates content paths for Semantq project structure
- Adds Tailwind directives to `global.css`

### Testing Your Tailwind Installation

To verify that Tailwind CSS is working correctly:

1. Add HTML elements with Tailwind classes to your page:
   ```html
   <div class="p-6 bg-blue-500 text-white rounded-lg">
     <h1 class="text-2xl font-bold">Tailwind CSS is Working!</h1>
     <p class="mt-2">This is a test to confirm Tailwind is properly installed.</p>
   </div>
   ```

2. Run your development server:
   ```bash
   npm run dev
   ```

3. Open your browser and verify the styled elements appear correctly.

## Migration Notes

### For Existing Projects
If you have existing resources that need Pylon features:

1. Remove old resources:
   ```bash
   semantq remove:resource Task
   ```

2. Regenerate with Pylon:
   ```bash
   semantq make:resource Task --pylon
   ```

3. Update Prisma schema and run migrations:
   ```bash
   npx prisma migrate dev --name add_task_model
   ```

### Pylon Component Requirements
Pylon components require:
- User context from parent components
- Configured Pylon feature flags
- Authentication system setup

## Next Steps After Generation

### For Pylon Resources:
1. Configure feature flags in Pylon dashboard
2. Add routes to main router
3. Run database migrations
4. Restart server

### For Pylon Components:
1. Import in routes: `import Component from './components/pylon/Component.smq'`
2. Ensure parent components provide user context
3. Configure user permissions in database
4. Restart dev server if needed

### For Pylon Routes:
1. Create the corresponding Pylon component first
2. Ensure role-based components (Sidebar, Header, Footer) exist
3. Verify dashboard.css exists at `/public/dashboard/css/dashboard.css`
4. Test access with different user permissions

### For Standard Routes:
1. Update `routes.js` with new route declarations
2. Configure authentication if using `--auth`
3. Implement CRUD operations if using `--crud`

## Notes & Best Practices

1. **Naming Conventions:**
   - Routes: lowercase, hyphenated (e.g., `user-add`)
   - Components: PascalCase (e.g., `UserAdd`)
   - Resources: Singular, PascalCase (e.g., `User`)

2. **Directory Structure:**
   - Pylon components: `src/components/pylon/`
   - Pylon routes: `src/routes/<role>/`
   - Resources: `semantqQL/` (models, controllers, services, routes)

3. **Permission System:**
   - Uses `user.userSettings` Set for permission checks
   - Supports CRUD operations (`create`, `read`, `update`, `delete`)
   - Includes DataGrid features (`datagrid_csvexport`, `datagrid_excelexport`)

4. **File Generation:**
   - All commands check for existing files first
   - Provide helpful error messages for conflicts
   - Include clear "next steps" after creation

## Command Summary Table

| Command | Description | Options |
|---------|-------------|---------|
| `create <projectName>` | Create new project | `-fs, --fullstack` |
| `make:resource <name>` | Create backend resource | `-p, --pylon` |
| `remove:resource <name>` | Remove backend resource | `-y, --yes` |
| `make:route <routeName> [role]` | Create route | `-l, -c, -a, -s, -A, --ac, -tw, -p` |
| `remove:route <path>` | Remove route | `-y, --yes` |
| `make:component <name>` | Create component | `-p, --pylon` |
| `remove:component <name>` | Remove component | `-p, --pylon`, `-y, --yes` |
| `install:server` | Set up server directory | |
| `add:auth-ui` | Install Auth UI | |
| `install:tailwind` | Install Tailwind CSS | |
| `ai <prompt>` | Generate code using AI | `-r, --route`, `--full`, `--js`, `--css`, `--html`, `--append` |
| `add <moduleName>` | Add Semantq module | |
| `migrate` | Run database migrations | |
| `start` | Start development server | |
| `update` | Update Semantq | `--dry-run`, `--force`, `--restore` |
| `-v, --version` | Show version number | |

## Contributing

If you have any suggestions or improvements for the Semantq CLI, feel free to open an issue or submit a pull request. We welcome contributions from the community!

## License

This project is licensed under the MIT License.

Thank you for using Semantq! Happy coding!