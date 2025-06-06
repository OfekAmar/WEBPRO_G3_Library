// fetchGoogleBookCover.js

const fetchGoogleBookCover = async (titleOrIsbn) => {
  const query = encodeURIComponent(titleOrIsbn);
  const apiKey = 'AIzaSyBMKK1v6UsKbtuC9HxPw7rRjlJ7AKKaFOE';

  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.totalItems > 0) {
      const book = data.items[0];
      const imageLink = book.volumeInfo.imageLinks?.thumbnail || null;
      if (imageLink && !imageLink.includes('archive.org')) {
        return imageLink;
      }
    }
  } catch (err) {
    console.error("Google Books API failed, trying Open Library...", err);
  }

  // Try OpenLibrary fallback
  try {
    const olQuery = encodeURIComponent(titleOrIsbn);
    const olUrl = `https://openlibrary.org/search.json?title=${olQuery}`;
    const olRes = await fetch(olUrl);
    const olData = await olRes.json();

    if (olData.docs && olData.docs.length > 0 && olData.docs[0].cover_i) {
      return `https://covers.openlibrary.org/b/id/${olData.docs[0].cover_i}-L.jpg`;
    }
  } catch (err) {
    console.error("Open Library API also failed:", err);
  }

  return null;
};

export const resolveBookCover = async (book) => {
  const fallback = await fetchGoogleBookCover(book.name || book.title);
  return fallback || '/default-cover.jpg';
};

export default fetchGoogleBookCover;
