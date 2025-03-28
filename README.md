# Semantq

**Semantq** is an AI-first, full-stack JavaScript framework for building reactive web applications and embedded (IoT) systems, including hardware, firmware, and software. The philosophy of Semantq is Automation with Control.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
  - [Via npm](#install-via-npm)
  - [Global Installation](#install-globally-for-use-anywhere-on-your-system)
- [Getting Started](#getting-started)
  - [Create a New Project](#create-a-new-project)
  - [Development Server](#run-the-development-server)
- [Documentation](#documentation)
  - [Core Features](#core-features)
  - [Template System](#template-system)
  - [Application Architecture](#application-architecture)

## Features
- Full-stack JavaScript support
- Reactive web applications
- Embedded IoT hardware and firmware integration
- AI-assisted development
- Declarative logic blocks in HTML
- Comprehensive state management

## Installation

### Install via npm
```bash
npm install semantq
```

### Install Globally (for use anywhere on your system)
```bash
npm install -g semantq
```

## Getting Started

### Create a New Project
```bash
npx semantq create myapp
# Or if installed globally:
semantq create myapp
```

### Run the Development Server
```bash
cd myapp
npm run dev
```
Your app will be available at `http://localhost:5173` (or the default port).

## Documentation

### Core Features
- [Semantq AI CLI Guide](docs/SemantqAI.md) - Generate compliant code using AI
- [Semantq Config Guide](docs/SemantqConfig.md) - Manage app configuration
- [Semantq State Guide](docs/SemantqState.md) - Reactive state management

### Template System
- [Logic Blocks](docs/logicBlocks/if.md) - Declarative programmatic logic in HTML
- [Syntax Guide](docs/SemantqSyntax.md) - Comprehensive syntax reference
- [Slot Composition](docs/SemantqSlots.md) - Component slot patterns
- [Layout System](docs/SemantqLayouts.md) - Application layout management

### Application Architecture
- [Semantq CLI](docs/SemantqCli.md) - Command line interface
- [MSCR Architecture](docs/mscr.md) - Model-Service-Controller-Routes pattern
```

