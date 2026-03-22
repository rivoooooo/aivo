-- Migration: Add users, sessions, accounts, verifications, sandboxes, admins tables
-- This migration adds Better Auth tables and new sandbox system

-- Users table (for Better Auth)
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Sessions table (for Better Auth)
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp,
	"token" text NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token"),
	CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
);
CREATE INDEX IF NOT EXISTS "idx_sessions_user_id" ON "sessions" USING btree ("user_id");

-- Accounts table (for Better Auth)
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
);
CREATE INDEX IF NOT EXISTS "idx_accounts_user_id" ON "accounts" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "idx_accounts_provider_id" ON "accounts" USING btree ("provider_id", "account_id");

-- Verifications table (for Better Auth)
CREATE TABLE IF NOT EXISTS "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
CREATE INDEX IF NOT EXISTS "idx_verifications_identifier" ON "verifications" USING btree ("identifier");

-- Sandboxes table (templates)
CREATE TABLE IF NOT EXISTS "sandboxes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"import_source" text,
	"files" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sandboxes_slug_unique" UNIQUE("slug")
);

-- Admins table
CREATE TABLE IF NOT EXISTS "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "admins_user_id_unique" UNIQUE("user_id")
);

-- Add new columns to challenges table
ALTER TABLE "challenges" ADD COLUMN IF NOT EXISTS "sandbox_id" uuid REFERENCES "sandboxes"("id") ON DELETE SET NULL;
ALTER TABLE "challenges" ADD COLUMN IF NOT EXISTS "starter_code" jsonb;
ALTER TABLE "challenges" ADD COLUMN IF NOT EXISTS "is_published" boolean DEFAULT false NOT NULL;
