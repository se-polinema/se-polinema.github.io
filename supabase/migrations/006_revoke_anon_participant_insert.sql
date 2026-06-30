-- Account-based registration (since migration 005): only authenticated users
-- insert their own participant row. Drop the legacy anonymous INSERT grant
-- that was added in migration 002 for the old email-only registration flow.
-- RLS already blocks anon inserts via participants_insert_self; this closes
-- the grant layer too so both checks are consistent.
REVOKE INSERT ON se.participants FROM anon;
