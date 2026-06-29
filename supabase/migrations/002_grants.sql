-- Grant schema-level access to Supabase's built-in roles.
-- Without USAGE on the schema, all PostgREST requests fail with
-- "permission denied for schema se" before RLS policies are evaluated.
GRANT USAGE ON SCHEMA se TO anon, authenticated, service_role;

-- service_role: full access (bypasses RLS; used only in server-side CI scripts).
GRANT ALL ON ALL TABLES IN SCHEMA se TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA se TO service_role;

-- anon: read events (public list/detail pages), insert participants (registration form).
-- RLS policies provide fine-grained enforcement on top.
GRANT SELECT ON se.events TO anon;
GRANT INSERT ON se.participants TO anon;

-- authenticated: read events, read/write participants (admin check-in), read own profile.
-- Full event/participant write is still gated by admin RLS policies.
GRANT SELECT ON se.events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON se.participants TO authenticated;
GRANT SELECT ON se.profiles TO authenticated;

-- Ensure future tables/sequences in this schema inherit the same grants.
ALTER DEFAULT PRIVILEGES IN SCHEMA se GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA se GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA se GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA se GRANT SELECT, INSERT, UPDATE ON TABLES TO authenticated;
