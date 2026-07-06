CREATE TYPE "public"."type" AS ENUM('blog');--> statement-breakpoint
CREATE TABLE "stats" (
	"type" "type" NOT NULL,
	"slug" varchar(255) NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"loves" integer DEFAULT 0 NOT NULL,
	"applauses" integer DEFAULT 0 NOT NULL,
	"ideas" integer DEFAULT 0 NOT NULL,
	"bullseyes" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "stats_type_slug_pk" PRIMARY KEY("type","slug")
);
