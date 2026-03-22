-- Rollback: Remove playground system changes

-- Drop new columns from challenges
ALTER TABLE "challenges" DROP COLUMN IF EXISTS "sandbox_id";
ALTER TABLE "challenges" DROP COLUMN IF EXISTS "starter_code";
ALTER TABLE "challenges" DROP COLUMN IF EXISTS "is_published";

-- Drop tables in reverse order
DROP TABLE IF EXISTS "admins" CASCADE;
DROP TABLE IF EXISTS "sandboxes" CASCADE;
DROP TABLE IF EXISTS "verifications" CASCADE;
DROP TABLE IF EXISTS "accounts" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
