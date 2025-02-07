# Semantq CLI Commands Guide

Welcome to the Semantq CLI Commands Guide! This document provides an overview of the available commands for the Semantq CLI tool, which helps you streamline your project setup and development process.

## How This Works

The Semantq CLI provides a set of commands to quickly scaffold and configure your projects. Below is a list of available commands and their descriptions.

### Available Commands

| Command                     | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| `semantq create myapp`      | Creates a new project with required folders. Run this where you want to install the new project. |
| `semantq install:tailwind`  | Installs Tailwind CSS and configures it. Run this inside the project root.  |
| `semantq make:route myroute`| Creates a new route folder with `+page.smq`, `+layout.smq`, and `+server.js`. Run this inside the project root. |

## Usage Examples

### Creating a New Project

To create a new project named `myapp`, run the following command in your desired directory:

```bash
semantq create myapp
```

This will generate a new project with the required folder structure.

### Installing Tailwind CSS

To install and configure Tailwind CSS in your project, navigate to the project root and run:

```bash
semantq install:tailwind
```

This command will set up Tailwind CSS and its configuration files.

### Creating a New Route

To create a new route named `myroute`, navigate to the project root and run:

```bash
semantq make:route myroute
```

This will generate a new route folder with the following files:
- `+page.smq`
- `+layout.smq`
- `+server.js`

## Contributing

If you have any suggestions or improvements for the Semantq CLI, feel free to open an issue or submit a pull request. We welcome contributions from the community!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Thank you for using Semantq CLI! Happy coding! 🚀
```
