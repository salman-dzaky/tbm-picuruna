import { db } from '.';
import { books, categories } from './schema';
import { eq, like, or, and, desc, asc, count, sql } from 'drizzle-orm';

export const BOOKS_PER_PAGE = 12;

/** Ambil semua kategori, diurutkan berdasarkan nama (Untuk Select/Dropdown) */
export async function getCategories() {
  return db
    .select()
    .from(categories)
    .orderBy(
      sql`CASE WHEN ${categories.id} = 'cat_uncategorized' THEN 0 ELSE 1 END`,
      asc(categories.name)
    );
}

export const CATEGORIES_PER_PAGE = 10;

/** Ambil kategori dengan pencarian, pengurutan, dan paginasi */
export async function getPaginatedCategories(opts: {
  search?: string;
  page?: number;
  sort?: string;
}) {
  const { search, page = 1, sort = 'name_asc' } = opts;
  const offset = (page - 1) * CATEGORIES_PER_PAGE;

  const conditions = [];

  if (search) {
    const term = `%${search}%`;
    conditions.push(like(categories.name, term));
  }

  const whereClause = conditions.length > 0 ? conditions[0] : undefined;

  const orderByClauses: any[] = [
    sql`CASE WHEN ${categories.id} = 'cat_uncategorized' THEN 0 ELSE 1 END`
  ];
  
  switch (sort) {
    case 'name_desc':
      orderByClauses.push(desc(categories.name));
      break;
    case 'newest':
      orderByClauses.push(desc(categories.createdAt));
      break;
    case 'oldest':
      orderByClauses.push(asc(categories.createdAt));
      break;
    default:
      orderByClauses.push(asc(categories.name));
      break;
  }

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(categories)
      .where(whereClause)
      .orderBy(...orderByClauses)
      .limit(CATEGORIES_PER_PAGE)
      .offset(offset),
    db
      .select({ total: count() })
      .from(categories)
      .where(whereClause),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    categories: data,
    pagination: {
      page,
      totalPages: Math.ceil(total / CATEGORIES_PER_PAGE),
      total,
    },
  };
}

/** Ambil buku dengan filter, pencarian, pengurutan, dan paginasi */
export async function getBooks(opts: {
  search?: string;
  category?: string;
  page?: number;
  sort?: string;
}) {
  const { search, category, page = 1, sort = 'newest' } = opts;
  const offset = (page - 1) * BOOKS_PER_PAGE;

  // Build WHERE conditions
  const conditions = [];

  if (search) {
    const term = `%${search}%`;
    conditions.push(
      or(
        like(books.title, term),
        like(books.author, term)
      )
    );
  }

  if (category) {
    conditions.push(eq(books.categoryId, category));
  }

  // Combined where clause
  const whereClause = conditions.length > 0
    ? conditions.length === 1
      ? conditions[0]
      : and(...conditions)
    : undefined;

  // Determine sorting
  let orderByClause = desc(books.createdAt); // Default: newest
  switch (sort) {
    case 'oldest':
      orderByClause = asc(books.createdAt);
      break;
    case 'title_asc':
      orderByClause = asc(books.title);
      break;
    case 'title_desc':
      orderByClause = desc(books.title);
      break;
    case 'author_asc':
      orderByClause = asc(books.author);
      break;
    case 'author_desc':
      orderByClause = desc(books.author);
      break;
    case 'year_asc':
      orderByClause = asc(books.publicationYear);
      break;
    case 'year_desc':
      orderByClause = desc(books.publicationYear);
      break;
  }

  // Parallel queries: data + count
  const [data, totalResult] = await Promise.all([
    db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        publisher: books.publisher,
        publicationYear: books.publicationYear,
        status: books.status,
        coverUrl: books.coverUrl,
        categoryId: books.categoryId,
        categoryName: categories.name,
        locationRack: books.locationRack,
      })
      .from(books)
      .leftJoin(categories, eq(books.categoryId, categories.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(BOOKS_PER_PAGE)
      .offset(offset),
    db
      .select({ total: count() })
      .from(books)
      .where(whereClause),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    books: data,
    pagination: {
      page,
      totalPages: Math.ceil(total / BOOKS_PER_PAGE),
      total,
    },
  };
}

/** Ambil detail buku berdasarkan ID (termasuk relasi kategori) */
export async function getBookById(id: string) {
  return db.query.books.findFirst({
    where: (books, { eq }) => eq(books.id, id),
    with: {
      category: true,
    },
  });
}
