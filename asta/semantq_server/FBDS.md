server/
├── models/
│   ├── mysql/
│   │   ├── User.js
│   │   └── Session.js
│   │
│   ├── supabase/
│   │   ├── User.js
│   │   └── Session.js
│   │
│   ├── mongodb/
│   │   ├── User.js
│   │   └── Session.js
│   │
│   ├── sqlite/
│   │   ├── User.js
│   │   └── Session.js
│   │
│   ├── adapters/                    # Strictly for DB connectors
│   │   ├── mysql.js
│   │   ├── supabase.js
│   │   ├── mongodb.js
│   │   └── sqlite.js
│   │
│   ├── migrations/                  # Project's active migration files
│   │   ├── mysql/
│   │   ├── supabase/
│   │   ├── sqlite/
│   │   └── mongodb/
│   │
│   ├── migration_repos/             # Stock/optional migration sets (for dev convenience)
│   │   ├── mysql/
│   │   ├── supabase/
│   │   ├── sqlite/
│   │   └── mongodb/
│   │
│   └── index.js                     # Dynamic adapter + model loader (based on semantiq.config.js)
│
├── services/
│   ├── authService.js
│   ├── cartiqueService.js
│   └── userService.js                # Example general-purpose service
│
├── controllers/
│   ├── authController.js
│   ├── cartController.js
│   └── userController.js             # Example user controller
│
├── routes/
│   ├── authRoutes.js
│   ├── cartiqueRoutes.js
│   └── userRoutes.js                 # Example user routes
│
├── packages/                         # Official + third-party Semantq-compatible modules
│   └── semantiq-auth/
│       ├── models/
│       │   └── CustomPackageModel.js
│       │
│       ├── services/
│       │   └── CustomPackageService.js
│       │
│       ├── controllers/
│       │   └── CustomPackageController.js
│       │
│       ├── routes/
│       │   └── customPackageRoutes.js
│       │
│       ├── migrations/                # Optional package-specific migrations
│       ├── package.json               # Must include "semantiq-module": true
│       └── README.md                  # Module-specific documentation
│
├── config/
│   ├── semantiq.config.js            # Framework-wide config (incl. active adapter)
│   └── env.js                        # Env var loader utility
│
├── lib/
│   ├── db.js                         # Optional: central proxy/adapter helper
│   └── packageLoader.js              # Auto package detection + integration
│
├── server.js                         # Main App entry point
└── .env                              # Environment variables
