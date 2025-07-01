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
│   ├── adapters/                # Strictly for DB connectors
│   │   ├── mysql.js
│   │   ├── supabase.js
│   │   ├── mongodb.js
│   │   └── sqlite.js
│   │
│   └── index.js                 # Dynamic adapter + model loader
│
├── services/
│   ├── auth.js
│   └── cartique.js
│
├── controllers/
│   ├── authController.js
│   └── cartController.js
│
├── routes/
│   ├── auth.js
│   └── cartique.js
│
├── packages/                    # Official + third-party Semantq modules
│   └── semantiq-auth/
│       ├── models/
│       │   └── CustomPackageModel.js
│       ├── service.js
│       ├── routes.js
│       └── package.json
│
├── config/
│   ├── semantiq.config.js       # Framework-wide config (incl. active adapter)
│   └── env.js                   # Env var loader utility
│
├── lib/
│   └── db.js                    # Optional: central proxy/adapter helper
│
├── server.js                    # App entry point
└── .env                         # Environment variables
