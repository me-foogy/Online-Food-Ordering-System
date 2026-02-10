CREATE TABLE "category" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "each_order" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "each_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"orderId" integer NOT NULL,
	"item_name" varchar(255) NOT NULL,
	"item_category" varchar(255) NOT NULL,
	"item_quantity" integer NOT NULL,
	"item_price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"address" varchar(255) NOT NULL,
	"cutomerNotes" varchar(255),
	"orderProgress" varchar(255) DEFAULT 'notStarted' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "each_order" ADD CONSTRAINT "each_order_orderId_orders_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;