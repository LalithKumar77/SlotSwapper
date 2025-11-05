import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Landing.css';
import Navbar from '../components/Navbar';

function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userSignedIn = localStorage.getItem('userSignedIn');
    setIsLoggedIn(userSignedIn === 'true');
  }, []);

  return (
    <div className="landing">
      <Navbar />
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Swap Your Time Slots <br />
            <span className="gradient-text">With Ease</span>
          </h1>
          <p className="hero-subtitle">
            A peer-to-peer scheduling platform that lets you exchange busy time slots 
            with others. Transform your calendar conflicts into opportunities.
          </p>
          <div className="hero-buttons">
            <Link to={isLoggedIn ? "/dashboard" : "/login"}>
              <button className="btn btn-large btn-primary">
                {isLoggedIn ? "Go to Dashboard" : "Get Started"}
              </button>
            </Link>
            <a href="#features">
              <button className="btn btn-large btn-outline-dark">Learn More</button>
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="calendar-illustration">
            <div className="calendar-card">
              <div className="calendar-header">📅 Your Calendar</div>
              <div className="time-slot busy">10:00 AM - Team Meeting</div>
              <div className="time-slot swappable">2:00 PM - Focus Block 🔄</div>
            </div>
            <div className="swap-arrow">⇄</div>
            <div className="calendar-card">
              <div className="calendar-header">📅 Available Slots</div>
              <div className="time-slot swappable">3:00 PM - Workshop 🔄</div>
              <div className="time-slot swappable">11:00 AM - Review 🔄</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2 className="section-title">Why SlotSwapper?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Easy Swapping</h3>
            <p>Mark your busy slots as swappable and browse what others are offering. Request a swap in just a few clicks.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is protected with JWT authentication. Only you control what slots you make available.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Updates</h3>
            <p>Accept or reject swap requests instantly. Your calendar updates automatically when a swap is confirmed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Smart Management</h3>
            <p>Track all your incoming and outgoing swap requests in one place. Never miss an opportunity to optimize your schedule.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Your Events</h3>
            <p>Add your busy time slots to your calendar with titles, descriptions, and times.</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Mark as Swappable</h3>
            <p>Choose which events you're willing to swap and make them available to others.</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Browse & Request</h3>
            <p>Explore swappable slots from other users and request the ones that work for you.</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Swap Confirmed</h3>
            <p>When both parties agree, the calendars update automatically. It's that simple!</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Take Control of Your Schedule?</h2>
          <p>Join SlotSwapper today and start swapping your way to a better calendar.</p>
          <Link to="/register">
            <button className="btn btn-large btn-white">Sign Up Now</button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SlotSwapper</h3>
            <p>Peer-to-peer time slot scheduling made simple.</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 SlotSwapper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
