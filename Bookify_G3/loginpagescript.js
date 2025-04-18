document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'signup') {
        showSignup();
    }
});

function showSignup() {
    const container = document.getElementById("formContainer");
    const leftTitle = document.getElementById("leftTitle");
    const leftText = document.getElementById("leftText");

    leftTitle.textContent = "📝 Register";
    leftText.innerHTML = `
      Create a free account to start borrowing books, build your reading list,
      and enjoy all the features of Bookify Library.
    `;

    container.innerHTML = `
      <h2 class="text-xl font-bold text-center mb-6">Create Account</h2>
  
      <label class="block mb-2 font-semibold">Full Name</label>
      <input type="text" id="signupName" class="w-full p-2 border rounded mb-4" placeholder="Your name">
  
      <label class="block mb-2 font-semibold">Email</label>
      <input type="email" id="signupEmail" class="w-full p-2 border rounded mb-4" placeholder="you@example.com">
  
      <label class="block mb-2 font-semibold">Phone</label>
      <input type="tel" id="signupPhone" class="w-full p-2 border rounded mb-4" placeholder="050-0000000">
  
      <label class="block mb-2 font-semibold">Password</label>
      <input type="password" id="signupPassword" class="w-full p-2 border rounded mb-4">
  
      <button onclick="handleSignup()" class="bg-green-600 w-full text-white py-2 rounded hover:bg-green-700">Sign Up</button>
  
      <p class="text-center mt-4 text-sm text-gray-600">
        Already have an account? <a href="#" class="text-blue-500 underline" onclick="showLogin()">Log in</a>
      </p>
    `;
}

function showLogin() {
    const leftTitle = document.getElementById("leftTitle");
    const leftText = document.getElementById("leftText");

    leftTitle.textContent = "🔐 Log In";
    leftText.innerHTML = `
      You need to be logged in to access pages like 
      <strong>My Books</strong> or <strong>My Profile</strong>.
      Use your email and password to sign in, or create a free account to get started.
    `;

    const cleanURL = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanURL);

    location.reload();
}

