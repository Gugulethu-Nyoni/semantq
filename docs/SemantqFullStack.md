## Semantq Full Stack (CRUD App) Quick Start

This guide provides a quick and comprehensive walkthrough to set up a full-stack CRUD application using the Semantq framework. It covers everything from project initialization to creating a full-featured data management page.



### Table of Contents

* [Installation](#installation)
* [Step 1: Project Creation](#step-1-project-creation)
* [Step 2: Configuration](#step-2-configuration)
* [Step 3: Database Initialization](#step-3-database-initialization)
* [Step 4: Creating a CRUD Model and Testing Auth](#step-4-creating-a-crud-model-and-testing-auth)
* [Step 5: Generating CRUD Resources](#step-5-generating-crud-resources)
* [Step 6: Building the CRUD Page](#step-6-building-the-crud-page)
* [Common Issues](#common-issues)



### Installation

To get started, you'll need the **Semantq CLI** installed globally.

```bash
npm install -g semantq
```



### Step 1: Project Creation

Use one of the following commands to create your new full-stack Semantq project.

```bash
semantq create mycrudapp -fs
```

or

```bash
semantq create mycrudapp --fullstack
```

This command will install the following components in your new `mycrudapp` directory:

  * **semantq app**: Your front-end application.
  * **semantq server**: Your back-end server.
  * **@semantq/auth**: The authentication backend.
  * **semantq auth ui**: The front-end authentication files, including routes for sign-up, login, and dashboard.
  * **@semantq/state**: Semantq state management library for handling auth state in this case.
  * **AnyGrid**: A library for data visualization and grids.
  * **@formique/semantq**: A code, low-code, no-code JS schema-driven form library.


### Step 2: Configuration

From your project root, open a terminal and run the following commands:

```bash
cd semantqQL
npm run init
```
This command will create the semantq.config.js in your server directory.  


### Step 3: Database Initialization

Navigate into your new project's server directory and ensure the configuration file is set up correctly.

Open the file at `projectroot/semantqQL/semantq.config.js` and update the following settings:

  * **Database Credentials**: Add your database connection details.
  * **Resend API Key & Approved Domain**: Enter your Resend API key and the domain approved for sending emails.
  * **Brand Details**: Fill in your brand name.
  * **Allowed Domains**: Specify the domains that are permitted to interact with your server. Remember that your front-end will often run on a different domain or IP address than your back-end.


### Step 4: Creating a CRUD Model and Testing Auth

First, add a simple data model for your CRUD operations to the Prisma schema file.

Open `projectroot/semantqQL/prisma/schema.prisma` and add the following `Product` model:

```prisma
model Product {
  id          Int     @id @default(autoincrement())
  name        String
  description String?
  price       Float
  inStock     Boolean @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Next, run the database migrations.  


From your `semantqQL` directory, run this command:

```bash
npx prisma migrate dev --name my_fullstack_migrations // or whatever name you prefer
```

The migrations will create the default auth tables and also create the table for the Product model you just added.

Here’s a refined and professional version of your README section for clarity and ease of understanding:


### Step 5: Generating CRUD Resources

From the root of your project, run the following command in your terminal:

```bash
semantq make:resource Product
```

This will automatically generate all the essential files required for a complete CRUD workflow, including:

* **Model**
* **Controller**
* **Service**
* **Routes**

These files will be created inside your `semantqQL` directory in the models, controllers, services and routes directories.

> 💡 There is no need to manually add routes to your `server.js`. SemantqQL automatically loads and registers them on server boot.


#### Accessing Your API Routes

The route structure follows this pattern:

```
/<modelName>/<resourceName>
```

#### Examples:

* For a model named `Product`, your base route will be:

  ```
  http://localhost:3001/product/products
  ```

* If your model name is in CamelCase (e.g., `ProductCategory`), the route becomes:

  ```
  http://localhost:3001/productCategory/productCategories
  ```

**Note** You can always check the semantqQL/routes/modelRoutes.js file if you are not sure of your routes. 

Make sure to replace `localhost:3001` with your configured server port if different.


#### Test the Authentication Flow

Before you can test the flow there are a few important checks:

- Ensure that projectroot/public/auth/js/config.js has correct BASE_URL which is your backend domain e.g. `http://localhost:3003` 
- Ensure that your dashboard paths are correct - usually the default settings  works fine
- Ensure that your front end domain - the one you you get when you run `npx serve dist` is included in the server's config allowed domains object:

```javascript
allowedOrigins: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080'
  ];
```

Now you can build the front-end and test the authentication functionality.

From your project root, run the following commands:

```bash
npm run build
npx serve dist
```

In another terminal tab also get your server running with these commands:
```bash
cd semantqQL
npn run start
```

Open the address provided by the `serve` command in your browser. You will see the app home page with signup and login handles. You should be able to go through the full authentication flow:

  * Sign up
  * Email confirmation
  * Login
  * Forgot password
  * Reset password

#### Common Issues

If emails are not being sent, verify that your Resend configurations in `semantqQL/semantq.config.js` are correct.
The settings should look like this:

```javascript
email: {
  driver: 'resend',
  resend_api_key: 're_XXXXX',
  email_from: 'noreply@mailer.somedomain.com',
  email_from_name: 'Team YourBrand',
},
```

You can also test your email configurations by running this command from your `semantqQL` directory (remember to edit the file first to include your actual email address):

```bash
node node_modules/@semantq/auth/test-email.js
```

This will output logs indicating success or failure.


### Step 6: Building the CRUD Page

Now you'll create an authenticated page with all the necessary components for your CRUD operations.

From your project root, run one of the following commands:

```bash
semantq make:route auth/dashboard/products --auth --crud -l
```

or the short hand

```bash
semantq make:route auth/dashboard/products -ac -l
```

  * **-a** or **--auth**: Creates an authenticated page.
  * **-c** or **--crud**: Includes the CRUD-ready boilerplate code.
  * **-l** or **--layout**: Creates a layout page (`@layout.smq`) for your route.

The command creates a directory at `projectroot/src/routes/auth/dashboard/products` containing your new page and layout files.

Add a link to this new page from somewhere in your dashboard, such as a main dashboard page (`@page.smq`).

```html
<a href="/auth/dashboard/products"> Products </a>
```

The new page will come with the required imports for building your CRUD page, including `smQL` and `Form`.

The layout page `@layout.smq` contains all resources (including CDN CSS files) required for auth and CRUD functionalities. 

#### a. Create a New Product

Define the form schema and logic inside the `<script>` block.

```javascript
// all required imports are icluded up the script for you
// not need to import them here


// CREATE A FORM USING FORMIQUE

const formSchema = [
  ['text', 'name', 'Name', { required: true }],
  ['text', 'description', 'Description', { required: true }],
  ['number', 'price', 'Price', { required: true }, { step: '0.01' }],
  ['submit', 'submit', 'Submit']
];

const formParams = {
  action: '#',
  method: 'POST',
  id: 'addProduct',
};

const formSettings = {
  theme: 'light',
};


const form = new Formique(formSchema, formSettings, formParams);


// CAPTURE AND SUBMIT FORM DATA  WITH smQL and smQL Form 

// Minimal code for POST data via smQL API

 new Form('addProduct', {
  onCaptured: async (data) => {
    await new smQL('http://localhost:3001/product/products', 'POST', data, {
      formId: 'addProduct',
    });
  },
});

```

#### smQL Syntax Recap (Full Config) for your convinience

```js
new Form('orderForm', 'submit', {
  debug: true,
  onCaptured: async (data) => {
    await new smQL('/orders', 'POST', data, {
      formId: 'orderForm',
      log: true,
      headers: {
        Authorization: 'Bearer token123',
      },
      successMessage: 'Order submitted successfully!',
      errorMessage: 'Failed to submit order. Please try again.',
    });
  },
});
```

```js
new Form('orderForm', 'submit', {
  // Optional: logs captured data to console for debugging
  debug: true,
  // Required: callback function called with form data object on submit
  onCaptured: async (data) => {
    await new smQL('/orders', 'POST', data, {
      // Optional: ID of the form for auto UI feedback messages
      formId: 'orderForm',

      // Optional: whether to log request and response to console (default true)
      log: true,

      // Optional: additional headers for the HTTP request
      headers: {
        Authorization: 'Bearer token123',
      },

      // Optional: custom success message shown in the form UI on success
      successMessage: 'Order submitted successfully!',

      // Optional: custom error message shown in the form UI on failure
      errorMessage: 'Failed to submit order. Please try again.',
    });
  },
});
```

#### Available Parameters

| Parameter    | Type       | Default    | Description                                        |
| ------------ | ---------- | ---------- | -------------------------------------------------- |
| `formId`     | `string`   | —          | ID of the HTML form element                        |
| `eventType`  | `string`   | `'submit'` | Event to listen for (e.g. `'submit'`, `'change'`)  |
| `debug`      | `boolean`  | `false`    | Logs captured form data to the console             |
| `onCaptured` | `function` | —          | Callback function executed with captured form data |



#### b. Display All Products

Use `smQL` to fetch your product data and then render it using **AnyGrid**.

```javascript
let productData;

const response = await new smQL('http://localhost:3001/product/products');

// OR const response = await new smQL('http://localhost:3001/product/products', 'GET', { log: true });

productData = response.data;

const columns = [
  { name: 'id', header: 'ID' },
  { name: 'name', header: 'Title' },
  { name: 'description', header: 'Description' },
  { name: 'price', header: 'Price' }
];

const features = {
  theme: 'light',
  initialItemsPerPage: 5,
  csvExport: true,
  excelExport: true,
  gridModal: true,
  modalConfig: {
    editable: true,
    deletable: true,
    nonEditableFields: ['id', 'inStock', 'createdAt', 'updatedAt']
  },
  dataApiEndPoint: 'http://localhost:3001/product/products',
};

const grid = new AnyGrid(productData, columns, features);
```

You can also customize the rendering of a column this way:

```javascript
const columns = [
  { name: 'id', header: 'ID', render: (row, value) => `<a href="some_url/product/${row.id}">${row.id}</a>` },
  // ...other columns
];
```

#### The HTML

Finally, place these components into your HTML within the `@html` block to render them.

```html
<div id="formique">
  Your form will be displayed here.
</div>

<div id="anygrid">
  Products datagrid will be rendered here.
</div>
```
Here's a refined and more professional version of your README section while keeping the tone accessible and instructional:


### Editing & Deleting Records

To **edit** a record, simply click on any row in the data grid. This will open a modal. Within the modal, click on any editable cell to make changes. When you click away from a cell, a small tick icon and confirmation message will appear—this indicates that your edit has been saved **in the UI**, not yet in the database.

To **apply all changes to the database**, click the **Save All** button at the bottom of the modal.

To **delete** a record, use the **Delete** button located at the bottom of the modal. A confirmation step will appear to prevent accidental deletions.

The cool part is that AnyGrid handles database and UI updates for your data grid and modal seamlessly - without any page reloads. 

To ensure your decoupled frontend and backend communicate securely and reliably—especially on mobile browsers like Safari and in Incognito mode—add this section to your README, likely between **Step 3 (Database Initialization)** and **Step 4 (Creating a CRUD Model)**.


### Live Deployment: Configuring Auth for Decoupled Environments

When your frontend and backend are hosted on different domains (e.g., frontend on `example.com` and backend on `render.com`), standard browser security often blocks the authentication cookies. This results in users being logged out immediately after a successful login.

Semantq handles this using **Subdomain Alignment**, ensuring your session cookies are treated as "First-Party" and trusted by all browsers.

#### 1. The Subdomain Strategy

The industry best practice is to point a subdomain of your main site to your backend.

* **Frontend:** `https://example.com`
* **Backend API:** `https://api.example.com`

> **Note:** Create a **CNAME** record in your DNS manager (cPanel/GoDaddy/Cloudflare) pointing `api` to your Render/Server URL.

#### 2. Configure Backend Cookie Scope

Update your backend configuration to allow the cookie to be shared across the root domain. In Semantq, this is handled in the `cookies.js` config.

**File:** `projectroot/packages/@semantq/auth/config/cookies.js`

```javascript
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return {
      httpOnly: true,    // Prevents XSS: Cookie is invisible to JavaScript
      secure: true,      // Required: Must be sent over HTTPS
      sameSite: 'lax',   // Standard security for subdomain sharing
      maxAge: 24 * 60 * 60 * 1000, 
      path: '/',
      // IMPORTANT: The leading dot allows sharing between app. and api.
      domain: '.example.com', 
    };
  }
  // ... development settings
};

```

#### 3. Update Frontend API Endpoint

Update your frontend configuration to target the new secure subdomain.

**File:** `projectroot/public/auth/js/config.js`

```javascript
const AppConfig = {
    // ...
    BASE_URLS: {
      development: 'http://localhost:3003/@semantq/auth',
      // Ensure this matches your new subdomain
      production: 'https://api.example.com/@semantq/auth'
    },
    // ...
};

```


#### 4. Update CORS Allowed Domains 


```javascript
allowedOrigins: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://localhost:3003',
    // PRODUCTION ORIGINS
    'https://example.com',
    'https://www.example.com', // Standardize to include www if users use it
    'https://api.example.com'   // Helpful for internal API testing/tools
  ],
```


#### 5. Security Layers Recap

Semantq doesn't just rely on cookies. The auth system provides a multi-layered guard that can be applied to any route:

* **HTTP-Only Cookies:** Protects against session hijacking.
* **CORS Protection:** Restricts API access to your specific frontend domains.
* **Access Level Guards:** Granular authorization (e.g., `authorize(3)` for SuperAdmins).
* **API Key Validation:** For secure service-to-service communication.

```javascript
// Example of a fully guarded Semantq route
router.post('/system/reset', validateApiKey, authenticateToken, authorize(3), controller.reset);

```

### You're CRUD-Ready!

You’ve now learned how to **create, read, update, and delete** records using Semantq. With the `gridModal`'s built-in edit and delete features, your entire CRUD workflow is handled on a single page—efficient and seamless.

## **License**

Semantq is open-source software licensed under the **MIT License**.

## Semantq Main Documentation: [Semantq](https://github.com/Gugulethu-Nyoni/semantq).