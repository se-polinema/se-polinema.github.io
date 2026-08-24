-- ============================================================
-- The project-images bucket (20260722031833_projects.sql) only allowed
-- jpeg/png/webp, copied from member-photos' bucket definition, but
-- unlike member photos (always client-resized to JPEG), the static
-- /projects content-collection genuinely ships SVG logos
-- (public/images/projects/polinema-snap-link.svg, placeholder.svg).
-- Discovered live: scripts/sync-static-projects.mjs's first real run
-- failed to upload polinema-snap-link.svg with "mime type image/svg+xml
-- is not supported". Widen the allow-list to match what the sync script
-- (and ImageUpload.vue's own file-picker accept list, which already
-- includes image/webp but not svg either: admins can still only pick
-- jpeg/png/webp client-side; svg support here is specifically for the
-- sync script's pre-existing static assets) actually needs to upload.
-- ============================================================

UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
WHERE id = 'project-images';
