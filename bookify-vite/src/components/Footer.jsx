const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 text-gray-600 text-sm py-4 mt-10 border-t">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Bookify. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;