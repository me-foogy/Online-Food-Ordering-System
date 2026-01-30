import { integer, pgTable, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({length: 255}).notNull().unique(),
  password: varchar({length: 255}).notNull(),
  name: varchar({ length: 255 }).notNull(),
  phoneNo:varchar('phone_no',{length: 10}).notNull(),
  address: varchar({ length: 255 }).notNull(),
  role: varchar({length:50}).notNull()
});

export const menuTable = pgTable('menu', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({length: 255}).notNull().unique(),
  category: varchar({length:255}).notNull(),
  price: integer().notNull(),
  description: varchar({length:255}).notNull(),
  image: varchar({length:255}).notNull(),
  inStock: boolean('in_stock').notNull().default(true)
})

export const ordersTable = pgTable('orders',{
  orderId: integer('order_id').primaryKey().generatedAlwaysAsIdentity().notNull(),
  userId: integer('user_id').references(()=>usersTable.id).notNull(),
  customerName:varchar('customer_name',{length: 255}).notNull(),
  createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
  address: varchar({length: 255}).notNull(),
  customerNotes: varchar({length: 255}).default(''),
  orderProgress: varchar({length:255}).notNull().default('notStarted')
})

export const eachOrderTable = pgTable('each_order',{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id').references(()=>ordersTable.orderId).notNull(),
  menuId: integer('menu_id').references(()=>menuTable.id, {onDelete: 'set null'}),
  itemName: varchar('item_name', {length:255}).notNull(),
  itemQuantity: integer('item_quantity').notNull(),
  itemPrice: integer('item_price').notNull()
})

export const categoryTable = pgTable('category', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({length: 255}).notNull().unique()
})

export const cartTable =  pgTable('cart',{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(()=>usersTable.id, {onDelete: 'cascade'}),
  menuId: integer('menu_id').notNull().references(()=>menuTable.id, {onDelete: 'cascade'}),
  quantity: integer().notNull()
})
