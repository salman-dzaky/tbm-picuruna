import { db } from '.';
import { books, categories } from './schema';
import { eq, like, or, and, desc, asc, count } from 'drizzle-orm';

export const BOOKS_PER_PAGE = 12;

/** Ambil semua kategori, diurutkan berdasarkan nama */
export async function getCategories() {
  return db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });
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
