CREATE TABLE "challenge_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" uuid NOT NULL,
	"type" text NOT NULL,
	"import_source" text,
	"init_code" text,
	"code_source" text,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "challenge_resources" ADD CONSTRAINT "challenge_resources_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_challenge_resources_challenge_id" ON "challenge_resources" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX "idx_challenge_resources_type" ON "challenge_resources" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "challenge_resources_challenge_type_unique" ON "challenge_resources" USING btree ("challenge_id","type");