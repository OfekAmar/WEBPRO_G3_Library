const fetchGoogleBookCover = async (titleOrIsbn) => {
  const query = encodeURIComponent(titleOrIsbn);

  // Try Open Library first
  try {
    const olUrl = `https://openlibrary.org/search.json?title=${query}`;
    const olRes = await fetch(olUrl);
    const olData = await olRes.json();

    if (olData.docs && olData.docs.length > 0 && olData.docs[0].cover_i) {
      return `https://covers.openlibrary.org/b/id/${olData.docs[0].cover_i}-L.jpg`;
    }
  } catch (err) {
    console.error("Open Library API failed, trying Google Books...", err);
  }

  // Fallback to Google Books if needed
  try {
    const apiKey = 'AIzaSyBMKK1v6UsKbtuC9HxPw7rRjlJ7AKKaFOE';
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

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
    console.error("Google Books API also failed:", err);
  }

  return null;
};


export const resolveBookCover = async (book) => {
  const fallback = await fetchGoogleBookCover(book.name || book.title);
  return fallback || '/default-cover.jpg';
};

export default fetchGoogleBookCover;
