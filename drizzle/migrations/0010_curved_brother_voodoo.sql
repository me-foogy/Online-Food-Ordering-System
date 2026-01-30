ALTER TABLE "cart" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "cart" RENAME COLUMN "menuId" TO "menu_id";--> statement-breakpoint
ALTER TABLE "each_order" RENAME COLUMN "orderId" TO "order_id";--> statement-breakpoint
ALTER TABLE "each_order" RENAME COLUMN "menuId" TO "menu_id";--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_menuId_menu_id_fk";
--> statement-breakpoint
ALTER TABLE "each_order" DROP CONSTRAINT "each_order_orderId_orders_order_id_fk";
--> statement-breakpoint
ALTER TABLE "each_order" DROP CONSTRAINT "each_order_menuId_menu_id_fk";
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_menu_id_menu_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "each_order" ADD CONSTRAINT "each_order_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "each_order" ADD CONSTRAINT "each_order_menu_id_menu_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menu"("id") ON DELETE set null ON UPDATE no action;