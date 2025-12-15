CREATE SCHEMA "test_data";
--> statement-breakpoint
CREATE TYPE "test_data"."test_status" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "test_data"."test_type" AS ENUM('alive', 'stress');--> statement-breakpoint
CREATE TABLE "test_data"."test_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"test_type" "test_data"."test_type" NOT NULL,
	"start_at" timestamp,
	"end_at" timestamp,
	"status" "test_data"."test_status" DEFAULT 'pending' NOT NULL,
	"device_id" text[] NOT NULL
);
