# 📦 Optimal Semantq Server Package Structure

This guide outlines the recommended directory and file structure for creating a package designed to seamlessly integrate with the `semantq_server`.
Adhering to this pattern ensures your module is automatically discovered, its routes mounted, and its dependencies managed by the main server.



## 📖 Core Principles

* **Self-Contained:** Each package should contain all necessary components (models, controllers, services, routes) for its specific functionality.
* **MCSR Pattern:** Maintain the **Model-Controller-Service-Route** separation of concerns.
* **ES Module Syntax:** All JavaScript files must use ES Module `import`/`export` syntax.
* **`semantiq-module` Flag:** The package's `package.json` must explicitly declare itself as a Semantq module.
* **Clear Naming:** Use consistent and descriptive naming conventions for files and directories.


```bash
my-semantq-package/
├── package.json               # REQUIRED: Package metadata, dependencies, and 'semantiq-module' flag
├── README.md                  # OPTIONAL: Module-specific documentation
│
├── controllers/               # Handles incoming requests, interacts with services, sends responses
│   ├── myFeatureController.js
│   └── anotherFeatureController.js
│
├── services/                  # Contains business logic, orchestrates models, performs validations
│   ├── myFeatureService.js
│   └── anotherFeatureService.js
│
├── models/                    # Interacts directly with data persistence (DB adapters)
│   ├── myFeatureModel.js      # Example: for a 'myFeature' entity
│   ├── anotherFeatureModel.js
│   ├── index.js               # OPTIONAL: If models need to be dynamically loaded/initialized
│   │
│   ├── adapters/              # OPTIONAL: Custom DB adapters for this package
│   │   └── customDbAdapter.js
│   │
│   └── migrations/            # OPTIONAL: Database migration files for this package's models
│       └── 001_create_my_feature_table.js
│
├── routes/                    # Defines API endpoints and links them to controllers
│   ├── myFeatureRoutes.js
│   └── anotherFeatureRoutes.js
│
├── config/                    # OPTIONAL: Package-specific configuration files
│   └── package.config.js
│
├── lib/                       # OPTIONAL: Utility functions or helpers
│   └── helpers.js
│
└── tests/                     # OPTIONAL: Unit/integration tests
    ├── controllers/
    ├── services/
    └── models/
```


## 📄 Key Files and Their Contents

### `package.json` (REQUIRED)

This file is crucial for discovery and dependency management.

```json
{
  "name": "my-semantq-package",
  "version": "1.0.0",
  "description": "A Semantq module for [brief description of functionality].",
  "type": "module",
  "main": "index.js",
  "semantiq-module": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["semantq", "module", "api", "proxy"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "axios": "^1.6.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "jest": "^29.5.0"
  }
}
```



### `routes/myFeatureRoutes.js` (REQUIRED)

Defines Express routes for the package.

```javascript
import express from 'express';
import myFeatureController from '../controllers/myFeatureController.js';

const router = express.Router();

router.get('/my-feature', myFeatureController.getFeature);
router.post('/my-feature', myFeatureController.createFeature);

export default router;
```



### `controllers/myFeatureController.js`

Handles requests and calls the service layer.

```javascript
import myFeatureService from '../services/myFeatureService.js';

const myFeatureController = {
  async getFeature(req, res) {
    try {
      const feature = await myFeatureService.getFeature(req.params.id);
      if (!feature) {
        return res.status(404).json({ success: false, message: 'Feature not found' });
      }
      res.json({ success: true, data: feature });
    } catch (error) {
      console.error('Error in getFeature:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve feature' });
    }
  },
};

export default myFeatureController;
```



### `services/myFeatureService.js`

Contains business logic and orchestrates models.

```javascript
import myFeatureModel from '../models/myFeatureModel.js';

const myFeatureService = {
  async getFeature(id) {
    const feature = await myFeatureModel.findById(id);
    return feature;
  },
  async createFeature(data) {
    const newFeature = await myFeatureModel.create(data);
    return newFeature;
  },
};

export default myFeatureService;
```



### `models/myFeatureModel.js`

Interacts directly with the database.

```javascript
import db from '../../models/adapters/mysql.js';

const MyFeature = {
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM my_features WHERE id = ?', [id]);
    return rows[0];
  },
  async create(data) {
    const { name, value } = data;
    const [result] = await db.query(
      'INSERT INTO my_features (name, value) VALUES (?, ?)',
      [name, value]
    );
    return { id: result.insertId, ...data };
  },
};

export default MyFeature;
```



## 🚀 How This Structure Enables Seamless Integration

* **`package.json` (`"semantiq-module": true`):** Signals to `semantq_server` that this is a loadable module.
* **Consistent `routes/` Directory:** `server.js` and `lib/routeLoader.js` are designed to look for a `routes/` folder in each module.
* **Default Exports for Routers:** `lib/routeLoader.js` expects `routes/*.js` files to default export an Express router.
* **Internal Module Paths:** Using relative paths within the package ensures internal components resolve correctly.
* **Dependency Management:** Dependencies listed in the module’s `package.json` are automatically installed during `npm run install:module`.



## ✅ Summary

By following this structure, you can develop clean, independent, reusable modules that — once installed via:

```bash
npm run install:module <package-name>
```

— will be automatically discovered, mounted, and integrated into your `semantq_server` environment.

[⬅️ Back to Main Repository](../README.md)

