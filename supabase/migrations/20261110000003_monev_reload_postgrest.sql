-- PostgREST loaded its config while the monev schema did not exist yet, so the
-- API reported "Invalid schema: monev" even though db_schema already lists it.
-- Ask PostgREST to reload its config and schema cache (delivered at commit).
NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
