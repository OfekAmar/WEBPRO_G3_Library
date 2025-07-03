![LOGOBOOKIFY2](https://github.com/user-attachments/assets/f758689b-abb1-4e51-a8e6-30cd2b818210)
# Bookify - Smart Library Management System

Bookify is a modern, web-based smart library system designed to help users explore, borrow, and manage books easily. The system provides a user-friendly interface with advanced features for both regular users and admins.

---

## Features

-  **Home Page**: Trending and newly added books with carousels.
-  **Search**: Search books by title, author, or free text with dynamic filters.
-  **Book Detail Page**: View detailed book information, borrow, wishlist, rate, and comment.
-  **User Profile**: Manage personal information, change password, and update details.
-  **My Books**: View and manage borrowed and returned books history.
-  **Wishlist**: Save books for later and manage wishlist.
-  **Notifications**: Receive notifications when a book becomes available.
-  **Recommendation ChatBot**: Get book suggestions based on genre and reading length.
-  **Statistics (Admin)**: View most borrowed books and borrowing trends.
-  **Manage Books (Admin)**: Update book availability and location.
-  **Manage Users (Admin)**: Manage user accounts and details.

---

## Project Structure

```
src/
├── components/           # Reusable UI components (BookCard, Header, Footer, etc.)
├── pages/                # Main application pages
├── utils/                # Utility functions (e.g., fetchGoogleBookCover)
├── Layout/               # Main layout wrapper
├── App.jsx               # Main application file
├── firebase.js          # Firebase configuration
```

---

## Technologies

- React.js
- Firebase Realtime Database
- Tailwind CSS / Custom SCSS
- Google Maps API
- Open Library & Google Books API (for book covers)
- Recharts (for statistics visualization)
- Lucide & React Icons

---

##  Usage

- Click on the vercel link at the top of the page 
- Sign up as a new user or log in.
- Search for books, view details, borrow, or add to wishlist.
- Manage your borrowed books and view notifications.
- Admin users can access user and book management panels and view library statistics.

---

## Installation & Setup
**Clone the repository**

```bash
git clone <https://github.com/OfekAmar/WEBPRO_G3_Library.git>
cd WEBPRO_G3_Library-main2
```
**Install dependencies**

```bash
npm install
npm install react lucide-react react-router-dom react-icons recharts
```
**Start the development server**

```bash
npm run dev
```

The app will usually run on [http://localhost:5173](http://localhost:5173) (depending on your Vite config).


---

##  Additional Notes

- **Theme Support**: Light and dark modes are supported, and user preference is saved locally.
- **Responsive Design**: Works on desktop and mobile devices.
- **Recommendation Bot**: Provides suggestions based on genre and book length for an enhanced experience.

---

##  License

This project is for educational purposes and internal use only.
