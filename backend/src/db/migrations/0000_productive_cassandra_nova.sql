CREATE TABLE IF NOT EXISTS "chat_messages" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"who" varchar(8) NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tonight_set_tracks" (
	"track_id" varchar(36) NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracks" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"spotify_track_id" varchar(64),
	"spotify_uri" varchar(128),
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"genre" text NOT NULL,
	"ring" integer NOT NULL,
	"radius" integer NOT NULL,
	"seed" integer NOT NULL,
	"length_ms" integer NOT NULL,
	"freq" varchar(16) NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_state" (
	"user_id" varchar(36) PRIMARY KEY NOT NULL,
	"radius" integer DEFAULT 14 NOT NULL,
	"persona_id" varchar(16) DEFAULT 'mira' NOT NULL,
	"sleep" boolean DEFAULT false NOT NULL,
	"auto_advance" boolean DEFAULT true NOT NULL,
	"presets" jsonb DEFAULT '["t1","t4","t7"]'::jsonb NOT NULL,
	"saved" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"courage_max_ring_session" integer DEFAULT 0 NOT NULL,
	"courage_streak_days" integer DEFAULT 0 NOT NULL,
	"onboarded" boolean DEFAULT false NOT NULL,
	"onboarding_picks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"current_track_id" varchar(36),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"spotify_id" varchar(64) NOT NULL,
	"display_name" text NOT NULL,
	"email" text,
	"refresh_token_enc" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_spotify_id_unique" UNIQUE("spotify_id")
);
