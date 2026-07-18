-- ============================================================
-- Supabase Storage bucket for member/alumni photos.
--
-- Replaces the plain free-text `photo` URL field (previously either a
-- committed static path under public/images/members/, or a hand-typed URL)
-- with real uploads. Photos are resized/re-encoded client-side to ~683px
-- JPEG before upload (src/utils/resizeImage.ts), so the stored object is
-- already optimized — no Storage Image Transformation add-on needed.
--
-- Path convention: self-service uploads live under {auth.uid()}/photo.jpg
-- (one fixed path per user, natural upsert-overwrite); admin-added entries
-- live under admin/{member-id or a fresh uuid}.jpg. This is the standard
-- Supabase-documented "user-scoped storage folder" RLS shape, reusing the
-- same se.get_user_role() admin-check helper used by every other
-- admin-gated policy in this schema (008_members.sql, 013_alumni_self_service.sql).
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('member-photos', 'member-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "member_photos_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'member-photos');

CREATE POLICY "member_photos_insert_own_or_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'member-photos'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR se.get_user_role() = 'admin')
  );

CREATE POLICY "member_photos_update_own_or_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'member-photos'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR se.get_user_role() = 'admin')
  );

CREATE POLICY "member_photos_delete_own_or_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'member-photos'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR se.get_user_role() = 'admin')
  );
