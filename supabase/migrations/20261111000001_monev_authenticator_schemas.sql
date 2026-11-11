-- PostgREST reads its exposed schemas from the authenticator role's
-- pgrst.db_schemas setting, which on this shared project was
-- 'public, se, dosen4, graphql_public' and never picked up monev from the
-- Management API / dashboard setting (API answered "Invalid schema: monev").
-- Append monev to whatever is there (preserving se and dosen4 and their order)
-- and ask PostgREST to reload. Idempotent.
DO $$
DECLARE
  cur TEXT;
BEGIN
  SELECT substr(s, length('pgrst.db_schemas=') + 1) INTO cur
  FROM pg_roles r, unnest(r.rolconfig) AS s
  WHERE r.rolname = 'authenticator' AND s LIKE 'pgrst.db_schemas=%';

  IF cur IS NULL THEN
    RAISE NOTICE 'authenticator has no pgrst.db_schemas override; nothing to change';
  ELSIF (',' || replace(cur, ' ', '') || ',') NOT LIKE '%,monev,%' THEN
    EXECUTE format('ALTER ROLE authenticator SET pgrst.db_schemas = %L', cur || ', monev');
  END IF;
END $$;

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
