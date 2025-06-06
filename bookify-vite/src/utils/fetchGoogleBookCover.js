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
    return null;
  } catch (err) {
    console.error("Error fetching from Google Books API:", err);
    return null;
  }
};

export const resolveBookCover = async (book) => {
  const fallback = await fetchGoogleBookCover(book.name || book.title);
  return fallback || '/default-cover.jpg';
};

export default fetchGoogleBookCover;
