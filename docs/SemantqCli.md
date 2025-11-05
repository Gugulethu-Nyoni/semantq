# Semantq CLI Commands Guide

Welcome to the Semantq CLI Commands Guide! This document provides a comprehensive overview of all available commands for the Semantq CLI tool.

## Quick Summary of Available Commands

### Project Commands
1. `semantq create <projectName>` - Generate new project structure
2. `semantq update` - Update Semantq to latest version
   - `semantq --dry-run` - Preview changes without applying

### Resource Generation
3. `semantq make:resource <name>` - Generate full resource (model+service+controller+route)
   - `-a, --adapter` - Specify database adapter (mongo/supabase)
   - `-p, --pylon` - Add Pylon feature guarding
4. `semantq remove:resource <name>` - Remove backend resource
   - `-y, --yes` - Skip confirmation prompt
5. `semantq make:model <name>` - Generate model only
   - `-a, --adapter` - Specify database adapter
6. `semantq make:service <name>` - Generate service only
   - `-a, --adapter` - Specify database adapter
7. `semantq make:controller <name>` - Generate controller only
8. `semantq make:apiRoute <name>` - Generate route only

### Route System
9. `semantq make:route <routeName>` - Create new route with templates
   - `-l, --layout` - Include layout file @layout.smq
   - `-c, --crud` - Add CRUD operations template
   - `-a, --auth` - Add authentication imports
   - `-s, --server` - Include server handlers server.js
   - `-A, --all` - Create all resources (@page.smq,@layout.smq,config.js,server.js)
   - `--ac` - Shortcut for both auth and CRUD
   - `-tw, --tailwind` - Add Tailwind CSS support
10. `semantq remove:route <path>` - Remove route directory and contents
    - `-y, --yes` - Skip confirmation prompt

### Component System
11. `semantq make:component <name>` - Create reusable components
    - `-p, --pylon` - Add Pylon feature guarding
12. `semantq remove:component <name>` - Remove component files
    - `-y, --yes` - Skip confirmation prompt

### Installation Commands
13. `semantq install:server` - Set up server directory
14. `semantq install:supabase` - Configure Supabase
15. `semantq install:tailwind` - Install Tailwind CSS

### Utility
16. `semantq -v, --version` - Show version number

## Comprehensive Command Reference

### Project Creation
```bash
semantq create myapp
```
Creates a new project with required folders and files. Run this where you want to install the new project.

### Resource Generation with Pylon Support
Generate full backend resources with built-in Pylon feature guarding:

```bash
# Generate resource with Pylon feature guarding
semantq make:resource Task --pylon
semantq make:resource User -p

# Standard resource (without Pylon)
semantq make:resource Product

# Specify database adapter
semantq make:resource Product -a mongo
semantq make:resource User --adapter supabase
```

**Pylon Resource Features:**
- Automatic Pylon feature guarding on all protected routes
- Pylon usage logging in service layer
- Enhanced controller methods with user context
- Support for all database adapters (MySQL, MongoDB, SQLite, Supabase)

### Resource Removal
Safely remove backend resources with confirmation:
```bash
# With confirmation prompt
semantq remove:resource Task

# Skip confirmation (force remove)
semantq remove:resource Task --yes
```

**Safety Features:**
- Shows all files that will be removed
- Confirmation prompt by default
- Clear next steps after removal

### Advanced Route Management
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
```

**Route Options:**
- `-l, --layout` - Include layout file
- `-c, --crud` - Add CRUD operations template
- `-a, --auth` - Add authentication imports
- `-s, --server` - Include server handlers
- `-A, --all` - Create all resources at once
- `--ac` - Shortcut for both auth and CRUD
- `-tw, --tailwind` - Add Tailwind CSS support

### Route Removal
Remove route directories and all nested contents:
```bash
# Remove with confirmation
semantq remove:route contact/asia/east

# Force remove without confirmation
semantq remove:route admin/users --yes
```

### Component System
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

### Component Removal
Safely remove component files:
```bash
# Remove with confirmation
semantq remove:component Project
semantq remove:component forms/ContactForm

# Force remove
semantq remove:component admin/UserManager --yes
```

## Usage Examples

### Full-Stack Pylon Application
```bash
# Create Pylon-protected backend
semantq make:resource Project --pylon
semantq make:resource Task --pylon

# Create Pylon-enabled frontend components
semantq make:component ProjectList --pylon
semantq make:component TaskManager --pylon

# Create routes with auth and CRUD
semantq make:route projects --ac --tailwind
semantq make:route tasks --ac --tailwind
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

### For Components:
1. Import in routes: `import Component from './components/Component.smq'`
2. Ensure parent components provide required context
3. Restart dev server if needed

### For Routes:
1. Update `routes.js` with new route declarations
2. Configure authentication if using `--auth`
3. Implement CRUD operations if using `--crud`

## Command Summary Table

| Command | Description | Options |
|---------|-------------|---------|
| `create <projectName>` | Create new project | |
| `make:resource <name>` | Create backend resource | `-a, --adapter`, `-p, --pylon` |
| `remove:resource <name>` | Remove backend resource | `-y, --yes` |
| `make:model <name>` | Generate model only | `-a, --adapter` |
| `make:service <name>` | Generate service only | `-a, --adapter` |
| `make:controller <name>` | Generate controller only | |
| `make:apiRoute <name>` | Generate route only | |
| `make:route <path>` | Create route | `-l, -c, -a, -s, -A, --ac, -tw` |
| `remove:route <path>` | Remove route | `-y, --yes` |
| `make:component <name>` | Create component | `-p, --pylon` |
| `remove:component <name>` | Remove component | `-y, --yes` |
| `install:server` | Set up server directory | |
| `install:supabase` | Configure Supabase | |
| `install:tailwind` | Install Tailwind CSS | |
| `-v, --version` | Show version number | |

## Contributing

If you have any suggestions or improvements for the Semantq CLI, feel free to open an issue or submit a pull request. We welcome contributions from the community!

## License

This project is licensed under the MIT License.

Thank you for using Semantq! Happy coding!