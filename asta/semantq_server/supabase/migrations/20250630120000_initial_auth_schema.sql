-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  surname VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_token_expires_at TIMESTAMPTZ,
  reset_token VARCHAR(255),
  reset_token_expires_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  failed_login_attempts INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'locked', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON public.users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON public.users(reset_token);

-- Optional: auto-update updated_at timestamp on row update
/*
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();
*/

-- Create auth_logs table
CREATE TABLE IF NOT EXISTS public.auth_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN (
    'register', 
    'login', 
    'login_failed',
    'logout', 
    'password_reset',
    'email_verified',
    'account_locked'
  )),
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON public.auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON public.auth_logs(created_at);
