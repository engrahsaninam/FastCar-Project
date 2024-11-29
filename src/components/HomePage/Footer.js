"use client";
import { Phone, Mail, Instagram, MessageCircle, Clock, Link } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Contact & Support */}
          <div className="lg:col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">Contact & Support</h3>
            <div className="space-y-2 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <div>
                
                  <p>Monday to Friday</p>
                  <p>08:00 to 12:00</p>
                  <p>13:30 to 17:00</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <p>+41 12 345 67 89</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <p>info@example.com</p>
              </div>
            </div>
          </div>

          {/* Car Market */}
          <div className="lg:col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">Car Market</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-gray-800">Buy</a></li>
              <li><a href="#" className="hover:text-gray-800">Sell</a></li>
              <li><a href="#" className="hover:text-gray-800">Your Favorites</a></li>
              <li><a href="#" className="hover:text-gray-800">Your Listings</a></li>
              <li><a href="#" className="hover:text-gray-800">All Cars</a></li>
            </ul>
          </div>

          {/* Get Informed */}
          <div className="lg:col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">Get Informed</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-gray-800">Verified</a></li>
              <li><a href="#" className="hover:text-gray-800">Buyer Protection</a></li>
              <li><a href="#" className="hover:text-gray-800">Price Check</a></li>
              <li><a href="#" className="hover:text-gray-800">FAQs</a></li>
              <li><a href="#" className="hover:text-gray-800">Guide</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-gray-800">Team</a></li>
              <li><a href="#" className="hover:text-gray-800">Jobs</a></li>
              <li><a href="#" className="hover:text-gray-800">Terms</a></li>
              <li><a href="#" className="hover:text-gray-800">Privacy</a></li>
              <li><a href="#" className="hover:text-gray-800">Privacy Settings</a></li>
              <li><a href="#" className="hover:text-gray-800">Legal Notice</a></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div className="lg:col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-gray-800">Portal</a></li>
              <li><a href="#" className="hover:text-gray-800">Registration</a></li>
              <li><a href="#" className="hover:text-gray-800">News</a></li>
              <li><a href="#" className="hover:text-gray-800">Insertion Rules</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="lg:col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-800">
                {/* <Instagram size={20} /> */}
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;