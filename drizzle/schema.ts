import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({length: 255}).notNull().unique(),
  password: varchar({length: 255}).notNull(),
  name: varchar({ length: 255 }).notNull(),
  phoneNo:varchar('phone_no',{length: 10}).notNull(),
  address: varchar({ length: 255 }).notNull(),
  role: varchar({length:50}).notNull()
});
