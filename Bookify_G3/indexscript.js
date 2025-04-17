
// when load the page list of operations to check and execute
window.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("loggedInUser");
  
    const logoutBtn = document.getElementById("logoutBtn");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const profilePopupBtn = document.getElementById("profileBtn");
  
    if (user) {
      if (logoutBtn) logoutBtn.classList.remove("hidden");
      if (loginBtn) loginBtn.classList.add("hidden");
      if (registerBtn) registerBtn.classList.add("hidden");
      if (profilePopupBtn) profilePopupBtn.classList.add("hidden");
    } else {
      if (logoutBtn) logoutBtn.classList.add("hidden");
      if (loginBtn) loginBtn.classList.remove("hidden");
      if (registerBtn) registerBtn.classList.remove("hidden");
      if (profilePopupBtn) profilePopupBtn.classList.remove("hidden");
    }
  });
  

let fakeBooks = [];
fetch('books.json')
  .then(response => response.json())
  .then(data => {
    fakeBooks = data;
    console.log("Books loaded:", fakeBooks);
    renderTrending();
    renderNewlyAddedBooks();
    renderRecentlyReturned();
  })
  .catch(error => console.error("Failed to load books.json:", error));

function searchBooks() {
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

  displayResults(filtered);
}

function displayResults(books) {
  const containerlabel = document.getElementById('searchresultlabel');
  containerlabel.textContent = 'Search Results:';

  const container = document.getElementById('results');
  container.innerHTML = '';

  if (books.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No books found.</p>';
    return;
  }

  books.forEach(book => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 shadow rounded cursor-pointer';
    card.onclick = () => openBook(book.id);

    card.innerHTML = `
  <img src="${book.coverUrl}" alt="${book.title}" class="w-full h-60 object-cover mb-3 rounded">
  <h4 class="text-lg font-bold mb-2">${book.title}</h4>
  <p><strong>Author:</strong> ${book.author}</p>
  <p><strong>Subject:</strong> ${book.subject}</p>
  <p><strong>Availability:</strong> ${book.available ? '✅ Available' : '❌ Unavailable'}</p>
  <button class="mt-3 px-4 py-2 rounded text-white ${book.available ? 'bg-green-600' : 'bg-gray-600'}">
    ${book.available ? '📖 Borrow' : '📩 Notify Me'}
  </button>
`;

    container.appendChild(card);
  });
}

function renderNewlyAddedBooks() {
  const container = document.getElementById('newlyAdded');
  fakeBooks.slice(0, 23).forEach(book => {
    const img = document.createElement('img');
    img.src = book.coverUrl;
    img.className = 'w-40 h-60 object-cover flex-shrink-0 rounded shadow cursor-pointer';
    img.onclick = () => openBook(book.id);
    container.appendChild(img);
  });
  setTimeout(() => updateArrows('newlyAdded'), 100);
}

function renderTrending() {
  const container = document.getElementById('trending');
  fakeBooks.slice(12, 23).forEach(book => {
    const img = document.createElement('img');
    img.src = book.coverUrl;
    img.className = 'w-40 h-60 object-cover flex-shrink-0 rounded shadow cursor-pointer';
    img.onclick = () => openBook(book.id);
    container.appendChild(img);
  });

  setTimeout(() => updateArrows('trending'), 100);
}

function renderRecentlyReturned() {
  const container = document.getElementById('recentlyReturned');
  fakeBooks.slice(16, 23).forEach(book => {
    const img = document.createElement('img');
    img.src = book.coverUrl;
    img.className = 'w-40 h-60 object-cover flex-shrink-0 rounded shadow cursor-pointer';
    img.onclick = () => openBook(book.id);
    container.appendChild(img);
  });
  setTimeout(() => updateArrows('recentlyReturned'), 100);
}

function scrollCarouselLeft(id) {
  const el = document.getElementById(id);
  const targetScroll = el.scrollLeft - 300;

  el.scrollTo({
    left: targetScroll < 0 ? 0 : targetScroll,
    behavior: 'smooth'
  });

  setTimeout(() => updateArrows(id), 400);
}

function scrollCarouselRight(id) {
  const el = document.getElementById(id);
  el.scrollTo({
    left: el.scrollLeft + 300,
    behavior: 'smooth'
  });

  setTimeout(() => updateArrows(id), 400);
}


function updateArrows(id) {
  const container = document.getElementById(id);
  const leftBtn = document.querySelector(`[data-left='${id}']`);
  const rightBtn = document.querySelector(`[data-right='${id}']`);

  if (!container || !leftBtn || !rightBtn) return;

  const canScrollRight = container.scrollLeft + container.offsetWidth < container.scrollWidth - 5;
  const canScrollLeft = container.scrollLeft > 0;

  rightBtn.style.display = canScrollRight ? 'block' : 'none';
  leftBtn.style.display = canScrollLeft ? 'block' : 'none';
}

function openBook(bookId) {
  const book = fakeBooks.find(b => b.id === bookId);
  if (book) {
    sessionStorage.setItem('selectedBook', JSON.stringify(book));
    window.location.href = 'book.html';
  }
}
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("translate-x-full");
}

function toggleLoginPopup() {
  const popup = document.getElementById("loginPopup");
  popup.classList.toggle("hidden");
}


document.addEventListener('click', function (event) {
  const popup = document.getElementById('loginPopup');
  const profileBtn = document.getElementById('profileBtn');
  if (!popup.contains(event.target) && !profileBtn.contains(event.target)) {
    popup.classList.add('hidden');
  }
});

function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  fetch('users.json')
    .then(res => res.json())
    .then(users => {
      const user = users.find(u => u.email.toLowerCase() === email && u.password === password);

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("✅ Login successful! Welcome, " + user.name);
        toggleLoginPopup();
        location.reload(); 
        //window.location.href = "userProfile.html";
      } else {
        alert("❌ Invalid email or password.");
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      alert("Error loading users.");
    });
}

function handleLogout() {
    localStorage.removeItem("loggedInUser");
    alert("You have been logged out.");
    location.reload(); 
  }

  document.addEventListener("DOMContentLoaded", () => {
    const myProfileBtn = document.getElementById("myProfileBtn");
    const myBooksBtn = document.getElementById("myBooksBtn");
  
    const checkLoginAndRedirect = (urlIfLoggedIn) => {
      const user = localStorage.getItem("loggedInUser");
      if (user) {
        window.location.href = urlIfLoggedIn;
      } else {
        window.location.href = "login.html";
      }
    };
  
    myProfileBtn?.addEventListener("click", () => checkLoginAndRedirect("userProfile.html"));
    myBooksBtn?.addEventListener("click", () => checkLoginAndRedirect("MyBooks.html"));
  });
