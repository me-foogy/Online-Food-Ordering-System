ALTER TABLE "cart" DROP CONSTRAINT "cart_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_menuId_menu_id_fk";
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_menuId_menu_id_fk" FOREIGN KEY ("menuId") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;