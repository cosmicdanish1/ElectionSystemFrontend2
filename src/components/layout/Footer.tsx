import React from 'react';
import { IconBrandTwitter, IconBrandInstagram, IconBrandFacebook } from '@tabler/icons-react';
import GlassEffect from '../GlassEffect/GlassEffect';

const Footer: React.FC = () => {
  return (
    <div className="p-4">
      <GlassEffect className="rounded-lg">
        <footer className="text-black py-12 px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Left Section */}
            <div className="md:col-span-1">
              <h3 className="font-bold text-xl mb-4">ElectionSys</h3>
              <p className="text-gray-700">
                Secure and Transparent Voting Solutions for the Modern Age.
              </p>
            </div>

            {/* Center Section */}
            <div className="md:col-span-1 grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-2 text-gray-700">
                  <li><a href="/about" className="hover:text-black">About Us</a></li>
                  <li><a href="/elections" className="hover:text-black">Elections</a></li>
                  <li><a href="/faq" className="hover:text-black">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2 text-gray-700">
                  <li><a href="/privacy" className="hover:text-black">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-black">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            {/* Right Section */}
            <div className="md:col-span-1 md:text-right">
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4 justify-center md:justify-end mb-4">
                <a href="#" className="text-gray-700 hover:text-black"><IconBrandTwitter /></a>
                <a href="#" className="text-gray-700 hover:text-black"><IconBrandFacebook /></a>
                <a href="#" className="text-gray-700 hover:text-black"><IconBrandInstagram /></a>
              </div>
              <p className="text-gray-700">Phone: (123) 456-7890</p>
              <p className="text-gray-700">Email: contact@electionsys.com</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-black/20 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} ElectionSys. All Rights Reserved.</p>
          </div>
        </footer>
      </GlassEffect>
    </div>
  );
};

export default Footer; 