import React from 'react';

const Footer = () => (
  <footer className="bg-gray-800 text-white">
    <div className="container mx-auto px-6 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} Sovereign Woodcraft. All Rights Reserved.</p>
    </div>
  </footer>
);

export default Footer;