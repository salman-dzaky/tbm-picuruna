import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// Tabel Kategori Buku
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`),
});

// Tabel Buku
export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  inventoryNumber: text('inventory_number'),
  title: text('title').notNull(),
  author: text('author'),
  illustrator: text('illustrator'),
  publisher: text('publisher'),
  publicationYear: integer('publication_year'),
  numberOfCopies: integer('number_of_copies').default(1).notNull(),
  subject: text('subject'),
  origin: text('origin'),
  isbn: text('isbn'),
  synopsis: text('synopsis'),
  categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  locationRack: text('location_rack'),
  callNumber: text('call_number'),
  status: text('status', { enum: ['TERSEDIA', 'DIPINJAM'] }).default('TERSEDIA').notNull(),
  coverUrl: text('cover_url'),
  coverPublicId: text('cover_public_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
}, (table) => ({
  categoryIdx: index('idx_books_category').on(table.categoryId),
  statusIdx: index('idx_books_status').on(table.status),
  searchIdx: index('idx_books_title_author').on(table.title, table.author),
  inventoryIdx: index('idx_books_inventory_number').on(table.inventoryNumber),
}));

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  books: many(books),
}));

export const booksRelations = relations(books, ({ one }) => ({
  category: one(categories, {
    fields: [books.categoryId],
    references: [categories.id],
  }),
}));

// Type Inference
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
