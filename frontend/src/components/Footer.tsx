export const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* About Us */}
            <div>
              <h3 className="text-lg font-bold mb-4">About Us</h3>
              <p className="text-sm text-gray-400">
                BlogWeb is your one-stop destination for insightful blogs, tutorials, and stories written by experts across various fields. Stay informed and inspired.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>
                  <a href="/blogs" className="hover:text-white">
                    Explore Blogs
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/signin" className="hover:text-white">
                    Sign In
                  </a>
                </li>
              </ul>
            </div>
            {/* Stay Connected */}
            <div>
              <h3 className="text-lg font-bold mb-4">Stay Connected</h3>
              <ul className="flex justify-center md:justify-start space-x-4">
                <li>
                  <a href="#" aria-label="Facebook" className="hover:text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                    >
                      <path d="M22.675 0h-21.35C.582 0 0 .582 0 1.3v21.399c0 .716.582 1.301 1.325 1.301H12.82v-9.284H9.692V9.692h3.128V7.235c0-3.107 1.894-4.804 4.658-4.804 1.325 0 2.463.099 2.794.143v3.24h-1.917c-1.505 0-1.797.716-1.797 1.765v2.314h3.594l-.467 3.624h-3.127V24h6.127c.744 0 1.326-.584 1.326-1.301V1.3c0-.718-.582-1.3-1.325-1.3z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Twitter" className="hover:text-blue-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775a4.932 4.932 0 002.163-2.723 9.864 9.864 0 01-3.127 1.195 4.924 4.924 0 00-8.388 4.482A13.978 13.978 0 011.671 3.149 4.921 4.921 0 003.195 9.72a4.9 4.9 0 01-2.228-.616v.062a4.922 4.922 0 003.95 4.827 4.93 4.93 0 01-2.224.084 4.923 4.923 0 004.6 3.42A9.869 9.869 0 010 21.543a13.94 13.94 0 007.548 2.209c9.058 0 14.01-7.514 14.01-14.01 0-.213-.005-.426-.015-.637A10.012 10.012 0 0024 4.557z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="hover:text-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                    >
                      <path d="M22.23 0H1.77C.79 0 0 .774 0 1.727V22.27C0 23.223.79 24 1.77 24h20.46c.98 0 1.77-.777 1.77-1.73V1.727C24 .774 23.21 0 22.23 0zM7.059 20.452H3.572V9.036h3.487v11.416zM5.316 7.717c-1.107 0-1.99-.886-1.99-1.98a1.99 1.99 0 013.982 0c0 1.094-.883 1.98-1.992 1.98zm15.136 12.735h-3.487v-5.546c0-1.323-.028-3.027-1.845-3.027-1.844 0-2.127 1.442-2.127 2.93v5.643h-3.487V9.036h3.348v1.556h.048c.466-.884 1.605-1.845 3.302-1.845 3.528 0 4.177 2.318 4.177 5.338v6.367z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Bottom Section */}
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
            &copy; 2024 BlogWeb. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  