// Triggered from index.html when user searches
function searchBooks() {
    if (!window.booksReady) {
        alert("Books are still loading. Please try again in a moment.");
        return;
      }

    const type = document.getElementById('searchType').value;
    const input = document.getElementById('searchInput').value.toLowerCase();

    const filtered = fakeBooks.filter(book => {
        if (type === 'all') {
            return (
                book.title.toLowerCase().includes(input) ||
                book.author.toLowerCase().includes(input) ||
                book.subject.toLowerCase().includes(input)
            );
        }
        return book[type]?.toLowerCase().includes(input);
    });

    sessionStorage.setItem('searchResults', JSON.stringify(filtered));
    window.location.href = 'search.html';
}