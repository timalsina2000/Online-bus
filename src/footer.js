// Footer.js
import React from 'react';
import './footer.css'; // Import the footer CSS file

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 Terai Bus Sewa. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/about" className="footer-link">About Us</a>
                    <a href="/contact" className="footer-link">Contact</a>
                    <a href="/terms" className="footer-link">Terms & Conditions</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
