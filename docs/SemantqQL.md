## ⚙️ Semantq Full Stack Installation and Setup Guide

### 🧩 Introduction

Semantq offers a robust **plug-and-play full stack framework**. With a single CLI command, you can generate a complete Node.js server with:

* **Built-in Auth & Dashboard UI**
* **Auto-wired CRUD (MCSR) logic (Supabase and MySQL ready)**
* **API-ready endpoints**
* **Modular plugin detection & autoloading**

You just focus on **business logic**, not boilerplate or server scaffolding.

### Pre-requisites

| Tool           | Required Version                           |
| -------------- | ------------------------------------------ |
| **Node.js**    | `v22.17.0`)              |
| **NPM**        | `v10.9.2`)                |
| **Database**   | MySQL or Supabase                          |
| **Global CLI** | Install via: `npm install -g semantq` |



##  Step-by-Step Setup

### 1. **Create Full Stack App**

> This is the recommended starting point. It scaffolds everything needed.

First install a semnatq frontend project:

```bash
semantq create myapp
```

Then add the full stack infrastructure (server, db driven auth module backend and UI): 

```bash
semantq create myapp --fullstack
# OR
semantq create myapp -fs
```

---

### 📁 Project Structure

```
project_root/
│
├── semantqQL/                     # Node.js server (Express + Semantq API system)
│   ├── node_modules/semantq_auth       # Auth API module (logic)
│   ├── packages/                       # Custom modules go here
│   ├── prisma/schema.prisma            # Prisma schema file
│   └── semantq.config.js               # Main server config (replaces .env)
│
├── src/routes/auth/                    # Frontend auth routes (signup, login, etc.)
├── public/
│   ├── auth/css/auth.css               # Auth UI theme
│   └── dashboard/css/dashboard.css     # Dashboard UI theme
```

## Customizing UI Themes

### Auth Theme

Edit:

```css
public/auth/css/auth.css
```

Customize:

```css
:root {
  --primary: #ff69b4;
  --error: #9370db;
  --success: #ffffff;
  --text: #adb5bd;
  --bg-hover: #9370db;
}
```


### Dashboard Theme

Edit:

```css
public/dashboard/css/dashboard.css
```

Use the same `:root` variables to customize your dashboard appearance.


## Set Up the Server

From project root:

```bash
cd semantqQL
npm run init
```

This initializes:

```
semantqQL/semantq.config.js
```

### Modify `semantq.config.js`:

Ensure you update:

* Database credentials (MySQL/Supabase)
* Brand name / email config (e.g. for Resend)
* Auth keys and other required fields

> ⚠️ Avoid using `.env`. All environment-specific settings should be declared in `semantq.config.js` to allow full runtime loading and module detection.


## Database & Migrations

Update the Prisma schema:

```
semantqQL/prisma/schema.prisma
```

> Preconfigured with **auth-related models**. Extend it with your app models.

Then run migration:

```bash
npx prisma migrate dev --name your_migration_description
```

## 🏗️ Generate a CRUD Resource

Create a full CRUD stack for any model using:

```bash
semantq make:resource Product
```

This will generate these resources:

```
semantqQL/
├── models/{dbadapter e.g. mysql or supabase}/product.js
├── controllers/productController.js
├── services/productService.js
└── routes/productRoutes.js
```


## Accessing API Endpoints

API base:

```
http://localhost:3003
```
You can configure the port in the semantqQL/.env

```bash
PORT=3003
```

Example Product resource route:

```bash
curl -X GET http://localhost:3003/product/products
```

> The base path uses the lowercase segment of the route file name (e.g. `productRoutes.js → /product`), followed by the route defined in the routes main file: e.g. `routes/productRoutes.js`


## Installing Additional Modules

Semantq supports pluggable modules:

```bash
npm run install:module <package-name>
```

Modules or packages are stored here:

```
semantqQL/packages/
```


> Semantq auto-detects these packages on server boot.


## Optional: Install Server Manually

If needed as a fallback or to integrate into an existing app:

```bash
semantq install:server
```

This installs only the server in `semantqQL/`.  

You can add all other related modules such as: `npm i @semantq/auth` and `semantq add: auth-ui` if you prefer to install these individually. 

## Summary

| Action                   | Command/Path                             |
| ------------------------ | ---------------------------------------- |
| Create full stack app    | `semantq create myapp --fullstack`       |
| Initialize server config | `cd semantqQL && npm run init`      |
| Set DB & env settings    | `semantq.config.js`                      |
| Run migrations           | `npx prisma migrate dev --name init_app` |
| Generate CRUD resource   | `semantq make:resource Product`          |
| Access API endpoint      | `http://localhost:3003/product/products` |
| Add a module             | `npm run install:module some-package`    |


Happy CRUDing. !!!

## **License**

Semantq is open-source software licensed under the **MIT License**.

## Semantq Main Documentation: [Semantq](https://github.com/Gugulethu-Nyoni/semantq).
