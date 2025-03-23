const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <i className="fab fa-twitter text-xl"></i>
            </a>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-sm text-gray-500">
              &copy; 2025 Gaby Foster Care. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
