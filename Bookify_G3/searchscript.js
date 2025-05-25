// Triggered from index.html when user searches
function searchBooks() {
  const type = document.getElementById('searchType').value;
  const input = document.getElementById('searchInput').value.toLowerCase();

  firebase.database().ref('books').once('value')
    .then(snapshot => {
      const books = Object.values(snapshot.val());

      const filtered = books.filter(book => {
        if (type === 'all') {
          return (
            book.name.toLowerCase().includes(input) ||
            book.author.toLowerCase().includes(input) ||
            book.subject.toLowerCase().includes(input)
          );
        } else if (type === 'title') {
          return book.name.toLowerCase().includes(input);
        } else if (type === 'author') {
          return book.author.toLowerCase().includes(input);
        } else if (type === 'subject') {
          return book.subject.toLowerCase().includes(input);
        }
        return false;
      });

      sessionStorage.setItem('searchResults', JSON.stringify(filtered));
      window.location.href = 'search.html';
    })
    .catch(error => {
      console.error("Error fetching books from Firebase:", error);
      alert("Failed to load books.");
    });
}