# Semantq MSCR Architecture: Full-Stack Setup Guide

Welcome to the **Semantq MSCR Architecture** documentation. This guide will walk you through the server up setup, usage, and workflow of the **Model-Service-Controller-Routes (MSCR)** architecture for building scalable and maintainable full-stack applications. Whether you're creating individual components or generating a full resource, Semantq's CLI makes it easy to scaffold your backend with support for database adapters like **Supabase** and **MongoDB**. (More adapters to be added.)

---



### 1. Install the Server
To set up the server directory and initialize the `server.js` file, run:
```bash
semantq install:server
```

This will:
- Create a `server` directory.
- Generate a `server.js` file with the necessary boilerplate code.



### 2. Install Supabase
To install the Supabase client and set up the configuration file, run:
```bash
semantq install:supabase
```

This will:
- Install the `@supabase/supabase-js` package.
- Create a `lib/supabaseConfig.js` file with the Supabase configuration.

#### Supabase Credentials
Make sure that you have the correct .env set up for your SUPABASE_URL and  SUPABASE_ANON_KEY in the .env file. It is recommended to save your .env file in the root of your project.

---

## 🏗️ Project Structure

After running the installation commands, your project server will have the following structure:

```
project-root/
├── server/
│   ├── models/            # Database models
│   ├── services/          # Business logic
│   ├── controllers/       # HTTP request handlers
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── lib/
│   └── supabaseConfig.js  # Supabase configuration

```


## 🚀 CLI Commands Overview

The Semantq CLI provides commands to generate individual components or full resources for your backend. Here's a quick overview:

### 1. Generate Model (Requires `-a` for Database: `supabase` | `mongo`)
```bash
semantq make:model User -a supabase
```
OR 

```bash
semantq make:model User -a mongo
```

### 2. Generate Service (Requires `-a` for Database: `supabase` | `mongo`)
```bash
semantq make:service User -a supabase
```
OR

```bash
semantq make:service User -a mongo
```


### 3. Generate Controller (No `-a` flag required)
```bash
semantq make:controller User
```

### 4. Generate Route (No `-a` flag required)
```bash
semantq make:route User
```

### 5. Generate Full Resource (All MSCR Files: Model, Service, Controller, Route)
```bash
semantq make:resource User -a supabase
semantq make:resource User -a mongo
```

---

## 📂 Directory Structure

When you generate a resource (e.g., `User`), the following files are created:

```
server/
├── models/
│   └── User.js          # Model file for database operations
├── services/
│   └── userService.js   # Service file for business logic
├── controllers/
│   └── userController.js # Controller file for handling HTTP requests
├── routes/
│   └── userRoutes.js    # Route file for defining API endpoints
```

---

## 🔗 Chain of Events: From Form Submission to Database

Here’s how the MSCR architecture handles a form submission:

1. **Form Submission**:
   - A user submits a form (e.g., a registration form).
   - The form's `action` attribute points to the API endpoint (e.g., `/api/user/register`).

   ```javascript
   const formParams = {
       method: 'POST',
       action: '/api/user/register', // API endpoint
       id: 'myForm',
       class: 'form',
       style: 'width: 100%; font-size: 14px;'
   };
   ```

2. **Proxy Server**:
   - The request is routed to the proxy server (e.g., Express.js).
   - The proxy server matches the request URL to the appropriate route.

3. **Route**:
   - The route (`userRoutes.js`) maps the request to the corresponding controller method.

   ```javascript
   router.post('/users', userController.createUser);
   ```

4. **Controller**:
   - The controller (`userController.js`) acts as an intermediary between the route and the service.
   - It validates the request and calls the appropriate service method.

   ```javascript
   async createUser(req, res) {
       try {
           const user = await userService.createUser(req.body);
           res.status(201).json(user);
       } catch (error) {
           res.status(400).json({ error: error.message });
       }
   }
   ```

5. **Service**:
   - The service (`userService.js`) contains the business logic and interacts with the model.

   ```javascript
   async createUser(data) {
       return await User.createRecord(data);
   }
   ```

6. **Model**:
   - The model (`User.js`) performs the actual database operations (e.g., inserting a new record).

   ```javascript
   static async createRecord(data) {
       const { data: record, error } = await supabase
           .from('users')
           .insert([data])
           .single();
       if (error) throw error;
       return record;
   }
   ```

7. **Response**:
   - The response is sent back to the client, confirming the successful creation of the user or providing an error message.

---

## 🛠️ Example: Creating a User

### Step 1: Generate the Full Resource
```bash
semantq make:resource User -a supabase
```

This command generates the following files:

#### `server/models/User.js`
```javascript
import { supabase } from '../utils/supabaseClient.js';

export default class User {
  constructor(data) {
    this.data = data;
  }

  // CRUD Operations
  static async createRecord(data) {
    const { data: record, error } = await supabase
      .from('users')
      .insert([data])
      .single();
    if (error) throw error;
    return record;
  }

  static async getAllRecords() {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) throw error;
    return data;
  }

  static async updateRecord(id, data) {
    const { data: updatedRecord, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .single();
    if (error) throw error;
    return updatedRecord;
  }

  static async deleteRecord(id) {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  }
}
```

#### `server/services/userService.js`
```javascript
import User from '../models/User.js';

class UserService {
  async createUser(data) {
    return await User.createRecord(data);
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async getAllUsers() {
    return await User.getAllRecords();
  }

  async updateUser(id, data) {
    return await User.updateRecord(id, data);
  }

  async deleteUser(id) {
    return await User.deleteRecord(id);
  }
}

export default new UserService();
```

#### `server/controllers/userController.js`
```javascript
import userService from '../services/userService.js';

class UserController {
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUser(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: 'User not found' });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch all records' });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();
```

#### `server/routes/userRoutes.js`
```javascript
import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUser);
router.get('/users', userController.getAllUsers);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;
```

---

## 🎯 Demo: Form Submission

### Form Setup with Formique
Here’s an example of a form built with **Formique**, Semantq's native form builder:

```javascript
@script
import Formique from 'formique';

const formSchema = [
    ['text', 'name', 'Name', { required: true }, {}],
    ['email', 'email', 'Email', { required: true }, {}],
    ['singleSelect', 'diet', 'Dietary Requirements', { required: true }, {}, [
        { value: 'gluten-free', label: 'Gluten-free' },
        { value: 'vegetarian', label: 'Vegetarian' },
    ]],
    ['submit', 'submitButton', 'Submit']
];

const formParams = {
    method: 'POST',
    action: '/api/user/register', // API endpoint
    id: 'myForm',
    class: 'form',
    style: 'width: 100%; font-size: 14px;'
};

const formSettings = {
    submitOnPage: true,
    requiredFieldIndicator: true,
    framework: 'semantq',
    placeholders: true,
    containerid: 'form-div'
};

// Initialize the form
const form = new Formique(formSchema, formParams, formSettings);
@end
```


```html
@html
<div id="formique"></div>
```

### Chain of Events
1. The form is submitted to `/api/user/register`.
2. The request is handled via the `userRoutes.js` file which imports the userController.js.
3. The `createUser` method in `userController.js` handles the request.
4. The `userService.js` imported in userController.js calls the `createRecord` method in `User.js`.
5. The user is created in the database, and a response is sent back to the client.

---

## 🛠️ Usage Tips

- Use `semantq make:resource` to generate all MSCR files at once.
- Use individual commands (`make:model`, `make:service`, etc.) to create specific components as needed.
- Always specify the database adapter (`-a supabase` or `-a mongo`) when creating a resources, models or services.

---

## 🚀 TO DO

- Add additional database adapters (e.g., Firebase, MySQL).
- Extend the CLI to support more advanced features (such as middleware and testing templates).

Happy coding! 🎉

## Semantq Main Documentation: [Semantq Syntax Guide](https://github.com/Gugulethu-Nyoni/semantq).
