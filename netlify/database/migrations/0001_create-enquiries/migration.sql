-- Enquiries submitted through the contact form (both languages).
CREATE TABLE IF NOT EXISTS enquiries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'closed')),
  type        TEXT NOT NULL,
  service     TEXT,
  name        TEXT NOT NULL,
  company     TEXT,
  email       TEXT NOT NULL,
  phone       TEXT,
  message     TEXT NOT NULL,
  locale      TEXT NOT NULL DEFAULT 'en',
  -- Google account of the submitter when they were signed in (links it to "My enquiries").
  user_email  TEXT
);

CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries (status);
CREATE INDEX IF NOT EXISTS enquiries_email_idx ON enquiries (LOWER(email));
CREATE INDEX IF NOT EXISTS enquiries_user_email_idx ON enquiries (LOWER(user_email));
