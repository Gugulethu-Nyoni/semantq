## Semantq Full Stack (CRUD App) Quick Start

This guide provides a quick and comprehensive walkthrough to set up a full-stack CRUD application using the Semantq framework. It covers everything from project initialization to creating a full-featured data management page.



### Table of Contents

* [Installation](#installation)
* [Step 1: Project Creation](#step-1-project-creation)
* [Step 2: Configuration](#step-2-configuration)
* [Step 3: Database Initialization](#step-3-database-initialization)
* [Step 4: Creating a CRUD Model and Testing Auth](#step-4-creating-a-crud-model-and-testing-auth)
* [Step 5: Building the CRUD Page](#step-5-building-the-crud-page)
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
cd semantq_server
npm run init
```
This command will create the semantq.config.js in your server directory.  


### Step 3: Database Initialization

Navigate into your new project's server directory and ensure the configuration file is set up correctly.

Open the file at `projectroot/semantq_server/semantq.config.js` and update the following settings:

  * **Database Credentials**: Add your database connection details.
  * **Resend API Key & Approved Domain**: Enter your Resend API key and the domain approved for sending emails.
  * **Brand Details**: Fill in your brand name.
  * **Allowed Domains**: Specify the domains that are permitted to interact with your server. Remember that your front-end will often run on a different domain or IP address than your back-end.


### Step 4: Creating a CRUD Model and Testing Auth

First, add a simple data model for your CRUD operations to the Prisma schema file.

Open `projectroot/semantq_server/prisma/schema.prisma` and add the following `Product` model:

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


From your `semantq_server` directory, run this command:

```bash
npx prisma migrate dev --name my_fullstack_migrations // or whatever name you prefer
```

The migrations will create the default auth tables and also create the table for the Product model you just added.

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
cd semantq_server
npn run start
```

Open the address provided by the `serve` command in your browser. You will see the app home page with signup and login handles. You should be able to go through the full authentication flow:

  * Sign up
  * Email confirmation
  * Login
  * Forgot password
  * Reset password

#### Common Issues

If emails are not being sent, verify that your Resend configurations in `semantq_server/semantq.config.js` are correct.
The settings should look like this:

```javascript
email: {
  driver: 'resend',
  resend_api_key: 're_XXXXX',
  email_from: 'noreply@mailer.somedomain.com',
  email_from_name: 'Team YourBrand',
},
```

You can also test your email configurations by running this command from your `semantq_server` directory (remember to edit the file first to include your actual email address):

```bash
node node_modules/@semantq/auth/test-email.js
```

This will output logs indicating success or failure.


### Step 5: Building the CRUD Page

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

let formData = null;
const formId = 'addProduct';
const formHandler = new Form(formId);

formHandler.form.addEventListener('form:captured', async (e) => {
  formData = e.detail;

  const res = await new smQL('http://localhost:3001/product/products', 'POST', formData, {
    formId: formId,
  });
});
```

#### b. Display All Products

Use `smQL` to fetch your product data and then render it using **AnyGrid**.

```javascript
let productData;

const response = new smQL('http://localhost:3001/product/products');

// OR const response = new smQL('http://localhost:3001/product/products', 'GET', { log: true });

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


### 🎉 You're CRUD-Ready!

You’ve now learned how to **create, read, update, and delete** records using Semantq. With the `gridModal`'s built-in edit and delete features, your entire CRUD workflow is handled on a single page—efficient and seamless.

## **License**

Semantq is open-source software licensed under the **MIT License**.

## Semantq Main Documentation: [Semantq](https://github.com/Gugulethu-Nyoni/semantq).

Danko! Ngyabonga!. 