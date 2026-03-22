// ── Cover image fallback chain ────────────────────────────────────
//
// Priority order:
//   1. cover_url from DB (Open Library, already fetched by seed_cover)
//   2. Google Books thumbnail (fetched client-side by title+author)
//   3. Emoji on cover_color background (always works)
//
// Usage:
//   const url = await fetchGoogleBooksCover(title, author);

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// Cache to avoid re-fetching the same book
const coverCache = new Map<string, string | null>();

export async function fetchGoogleBooksCover(
  title: string,
  author: string
): Promise<string | null> {
  const key = `${title}::${author}`.toLowerCase();

  if (coverCache.has(key)) return coverCache.get(key) ?? null;

  try {
    const query    = encodeURIComponent(`intitle:${title} inauthor:${author}`);
    const response = await fetch(`${GOOGLE_BOOKS_API}?q=${query}&maxResults=1&fields=items/volumeInfo/imageLinks`);
    const data     = await response.json();

    const imageLinks = data?.items?.[0]?.volumeInfo?.imageLinks;
    // Prefer thumbnail, fall back to smallThumbnail
    const url = imageLinks?.thumbnail ?? imageLinks?.smallThumbnail ?? null;

    // Google Books returns http — upgrade to https
    const secureUrl = url ? url.replace('http://', 'https://') : null;

    coverCache.set(key, secureUrl);
    return secureUrl;
  } catch {
    coverCache.set(key, null);
    return null;
  }
}