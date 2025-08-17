import { Element, Link } from 'react-scroll';
import './OnePage.css';


export default function HomePage() {
    return (
        <div className="main-container">

            {/* Hero Section */}
            <Element name="home" className="section hero">
                <div className="hero-content">
                    <h2>Empowering Youth • Ending Violence</h2>
                    <p>
                        We provide safe spaces, cognitive-behavioral therapy (CBT), mentoring, and rapid-response tools to empower youth.
                    </p>
                    <Link to="about" smooth={true} className="cta-btn">
                        Learn More
                    </Link>
                </div>
            </Element>

            {/* About Section */}
            <Element name="about" className="section about">
                <h3>About Us</h3>
                <p>
                    We aim to create safe and inclusive environments for youth by offering mental health support, education on emotional resilience,
                    and community-driven workshops. Our team includes psychologists, counselors, peer mentors, and social workers.
                </p>
            </Element>

            {/* What We Offer Section */}
            <Element name="offer" className="section offer">
                <h3>Our Services</h3>
                <div className="cards">
                    {["Counselling", "Peer Support", "Emergency Response", "Educational Workshops", "Career Mentoring", "Therapy Sessions"].map(txt => (
                        <div key={txt} className="offer-card">{txt}</div>
                    ))}
                </div>
            </Element>

            {/* Mission & Vision */}
            <Element name="mission" className="section mission">
                <h3>Mission & Vision</h3>
                <p><strong>Mission:</strong> To help youth grow into empowered and confident individuals by addressing emotional, physical, and social trauma.</p>
                <p><strong>Vision:</strong> A violence-free society where every youth has a voice, a purpose, and equal opportunity to thrive.</p>
            </Element>

            {/* Team Section */}
            <Element name="team" className="section team">
                <h3>Meet Our Team</h3>
                <div className="team-cards">
                    {["Dr. Anjali Rai", "Ravi Karki", "Elena Thapa"].map(name => (
                        <div className="team-member" key={name}>
                            <div className="avatar-placeholder">{name[0]}</div>
                            <h4>{name}</h4>
                            <p>Support Specialist</p>
                        </div>
                    ))}
                </div>
            </Element>

            {/* Statistics */}
            <Element name="stats" className="section stats">
                <h3>Impact in Numbers</h3>
                <div className="cards">
                    <div className="offer-card"><strong>10,000+</strong><br /> Youth Reached</div>
                    <div className="offer-card"><strong>150+</strong><br /> Workshops Conducted</div>
                    <div className="offer-card"><strong>95%</strong><br /> Positive Feedback</div>
                </div>
            </Element>

            {/* Contact Section */}
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

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2025 Youth Empowerment Project. All rights reserved.</p>
                <p>
                    <a href="#home">Home</a> | <a href="#about">About</a> | <a href="#contact">Contact</a>
                </p>
            </footer>
        </div>
    );
}
