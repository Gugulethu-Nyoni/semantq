-- Drop existing sessions table if it exists
DROP TABLE IF EXISTS public.sessions;

-- Create sessions table
CREATE TABLE public.sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token VARCHAR(512) NOT NULL,
  device_info VARCHAR(255),
  ip_address VARCHAR(45),
  is_revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_token ON public.sessions(token);
CREATE INDEX idx_sessions_expires ON public.sessions(expires_at);
CREATE INDEX idx_sessions_active_sessions 
  ON public.sessions(user_id, is_revoked, expires_at);
