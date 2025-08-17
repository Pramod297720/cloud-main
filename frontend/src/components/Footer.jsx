import React from "react";


export default function Footer() {
    {/* Contact Section */ }
    <Element name="contact" className="section contact">
        <h3>Contact Us</h3>
        <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert("Message sent to admin!"); }}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea rows="4" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
        </form>

        <a
            href="https://wa.me/9779800000000?text=Hello,%20I%20need%20support"
            target="_blank"
            rel="noopener noreferrer"
        >
            <button className="whatsapp-btn">Message on WhatsApp</button>
        </a>
    </Element>

    {/* Footer */ }
    <footer className="footer">
        <p>&copy; 2025 Youth Empowerment Project. All rights reserved.</p>
        <p>
            Arun panthi Pramod Adhikari Samriddh Adhikari Sampanna Adhikari
        </p>
    </footer>
}