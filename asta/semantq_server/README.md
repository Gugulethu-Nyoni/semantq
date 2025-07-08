## 📦 `semantq_server` Backend

### Introduction

**`semantq_server`** is a swift, modern, **Node.js backend framework** built on **Express.js**.
Although framework-agnostic, it’s purposefully designed to complement and power the **Semantq JavaScript full-stack framework**.

It ships with the following:

* **CRUD-ready scaffolds**
* Modular **MCSR pattern** (Models, Controllers, Services, Routes)
* Out-the-box **multi-adapter database support**:

  * **MySQL**
  * **Supabase**
  * **MongoDB** - to be added 
  * **SQLite**  - to be added
* Elegant **migration runner** for database schema management
* Seamless **package/module auto-loading system** for extending functionality with minimal setup


## Installation

In a real-world project structure:

* Your **Semantq project root** (e.g. `myapp/`)
* `semantq_server` will sit inside your project as:
  `myapp/semantq_server/`

The install command in production-ready Semantq CLI will be:

```bash
semantq install:server
```

This will clone the semantq_server repo to the root of your app e.g. myapp/semantq_server

## Configuration Setup

After installing the server module:

### 1. Initialising the server 

Use the commands below to into the server directory to initialise it. 

```bash
cd semantq_server
npm run init
```

In the Semantq project context `npm run init` will pick up existence of .env and semantq.config.js in your Semantq project root and you're sorted.

You just need to add this to your semantqproject/semantq.config.js:

```bash
export default {
  // other configs here
  someConfigs: {


  },  
// add these configs for the server 
  database: {
    adapter: 'supabase' // or 'mysql' | 'mongodb' | 'sqlite'
  },
  server: {
    port: 3002
  },
  packages: {
    autoMount: true
  }
/// end of server configs

};
```


**Note** If you are deploying the server as a stand alone (outside the Semantq JS Framework) you will need to run this command:

```bash
npm run env:copy
```


This will copy example config & Env files

From inside `semantq_server/` run:

```bash
npm run env:copy
npm run init
```

* **`.env.example`** → `.env`
* **`semantiq.config.example.js`** → `semantiq.config.js`

These files contain **example credentials and configuration keys** you must review and adjust for your environment.

**⚠️ Critical: Ensure both `.env` and `semantiq.config.js` exist and have valid configs before proceeding.**
The server relies on these files to:

* Determine active DB adapter
* Load database connection credentials
* Load environment settings


## 📑 Running Migrations


**📌 Migration Templates**

We’ve provided **template migration sample files** inside:

```
models/migration_repos/name_of_db_adapter e.g. models/migration_repos/mysql
```

To activate them:

* **Copy the relevant migration files** from `models/migration_repos/<adapter>/`
  **to**
  `models/migrations/<adapter>/`

**Example:**
To set up MySQL migrations:

```bash
cp models/migration_repos/mysql/* models/migrations/mysql/
```

Do the same based on your specified db adaper e.g. `supabase/`, `mongodb/`, or `sqlite/` as needed.

**ℹ️ Note:** Only files inside `models/migrations/<adapter>/` are picked up and executed by the migration runner.

**Note** For Supabase, you will need to copy the sample migrations and modify them according to your needs or create new ones, following the standard Supabase migration format and location. You can copy the provided templates into your project’s projectroot/supabase/migrations directory.


Run database migrations based on the adapter you selected in `semantiq.config.js`:

```bash
npm run migrate
```

* Automatically detects the adapter (e.g. `mysql`, `supabase`)
* Runs all pending migrations from:

  ```
  semantq_server/models/migrations/<adapter>/
  ```
* Tracks applied migrations in a `migrations` table


## 🛠️ Development Commands

| Command            | Description                                |
| :----------------- | :----------------------------------------- |
| `npm run dev`      | Start server in development mode (nodemon) |
| `npm start`        | Start server normally                      |
| `npm run env:copy` | Copy `.env.example` to `.env`              |
| `npm run init`     | Copy config example file if missing        |
| `npm run migrate`  | Run pending DB migrations                  |


## 📦 Architecture (MCSR Pattern)

**Core Semantq Server follows a clean MCSR pattern**:

```
models/       → data models + adapter connectors + migrations  
services/     → pure business logic  
controllers/  → API endpoint handlers  
routes/       → Express routes mounting controllers  
packages/     → plug-and-play Semantq-compatible modules  
config/       → environment and Semantq config files  
lib/          → core utilities and package auto-loader  
server.js     → application entry point  
```


## Important Notes

* When deploying for production, you may add a local `.env` inside `semantq_server/` if needed, but the **project root `.env` should always be the master source**.
* Packages/modules added into `semantq_server/packages/` must follow the MCSR structure to be auto-loaded.


## CRUD Implementation with MCSR Pattern

### Overview of MCSR

Semantq Server follows a clean **MCSR architecture** pattern for structuring API functionality:

* **M**odel — direct interaction with the database (raw queries)
* **C**ontroller — handles HTTP request and response logic
* **S**ervice — business logic layer, interacts with models
* **R**oute — defines API endpoints and assigns controllers to handle them

## 📑 CRUD Implementation Steps

We already covered database migrations earlier.
Now let’s break down CRUD implementation in **MCSR order** — starting with the **Route**, down to the **Model**:


### 1️⃣ Create a Route

Routes live in the `/routes/` directory.

**File:** `routes/userRoutes.js`

```javascript
import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;
```

**➡️ Why first?**
Setting up routes early lets you map your planned API structure cleanly and drive what controllers need to exist.


###  2️⃣ Create the Controller

Controllers handle incoming HTTP requests, call services, and return responses.

**File:** `controllers/userController.js`

```javascript
import userService from '../services/userService.js';

const userController = {
  async getAllUsers(req, res) {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  },
  async getUserById(req, res) {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  },
  async createUser(req, res) {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: newUser });
  },
  async updateUser(req, res) {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: updatedUser });
  },
  async deleteUser(req, res) {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
  }
};

export default userController;
```


### 3️⃣ Create the Service

Services handle business logic and act as a bridge between controllers and models.

**File:** `services/userService.js`

```javascript
import models from '../models/index.js';

const userService = {
  async getAllUsers() {
    return await models.User.findAllUsers();
  },
  async getUserById(id) {
    return await models.User.findUserById(id);
  },
  async createUser(data) {
    return await models.User.createUser(data);
  },
  async updateUser(id, data) {
    return await models.User.updateUser(id, data);
  },
  async deleteUser(id) {
    return await models.User.deleteUser(id);
  }
};

export default userService;
```

**➡️ Why third?**
Services allow you to encapsulate app logic separately from HTTP handling or DB logic — keeping things modular and clean.


### 4️⃣ Create the Model

Models handle direct database access using raw SQL or an ORM.

**File:** `models/mysql/User.js`

```javascript
import { v4 as uuidv4 } from 'uuid';
import db from '../adapters/mysql.js';

const User = {
  async findAllUsers() {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  },
  async findUserById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },
  async createUser(data) {
    const { email, password } = data;
    const uuid = uuidv4();
    await db.query(
      'INSERT INTO users (uuid, email, password_hash) VALUES (?, ?, ?)',
      [uuid, email, password]
    );
    const [rows] = await db.query('SELECT * FROM users WHERE uuid = ?', [uuid]);
    return rows[0];
  },
  async updateUser(id, data) {
    const { email, password, name } = data;
    await db.query(
      'UPDATE users SET email = ?, password_hash = ?, name = ? WHERE id = ?',
      [email, password, name, id]
    );
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },
  async deleteUser(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }
};

export default User;
```


## 📦 Recap Flow

✔️ **Route** calls →
✔️ **Controller** calls →
✔️ **Service** calls →
✔️ **Model** interacts with DB

Each layer stays clean and handles a specific single responsibility.



## 📁 Folder Structure

```bash
routes/
  userRoutes.js
controllers/
  userController.js
services/
  userService.js
models/
  mysql/
    User.js
```



## 📌 Testing CRUD via `curl`

You can run curl api calls on the terminal or use Postman to test this server. 
Example calls:

**Create User**

```bash
curl -X POST http://localhost:3000/user/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"abc123"}'
```

**Get User**

```bash
curl -X GET http://localhost:3000/user/users/1
```

**Update User**

```bash
curl -X PUT http://localhost:3000/user/users/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"updated@example.com","password":"newpass","name":"Updated Name"}'
```

**Delete User**

```bash
curl -X DELETE http://localhost:3000/user/users/1
```


## 📚 API and Packages Documentation

- [📖 Semantq API Reference](docs/SemantqApi.md)
- [📦 Semantq Packages Guide](docs/SemantqPackages.md)





