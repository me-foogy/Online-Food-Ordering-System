ALTER TABLE "payment" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."paymentStatus";--> statement-breakpoint
CREATE TYPE "public"."paymentStatus" AS ENUM('PENDING', 'COMPLETE', 'Service is currently unavailable');--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "status" SET DATA TYPE "public"."paymentStatus" USING "status"::"public"."paymentStatus";