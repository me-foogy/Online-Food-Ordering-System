CREATE TYPE "public"."paymentStatus" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TABLE "payment" (
	"payment_id" uuid PRIMARY KEY NOT NULL,
	"amount" numeric NOT NULL,
	"product_code" varchar(255) NOT NULL,
	"order_id" integer NOT NULL,
	"status" "paymentStatus"
);
--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE set null ON UPDATE no action;