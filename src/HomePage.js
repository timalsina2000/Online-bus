import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { db } from './firebase'; // Adjust according to your Firebase setup
import { collection, getDocs } from 'firebase/firestore';
import { FiMapPin } from 'react-icons/fi'; // Import the location icon from react-icons
import './home.css';
import busImage from './photos/bus-image.png';
import Footer from './footer';
import siddimage from './photos/sidd.JPG';
import buspartner from './photos/bus-partner.png';
import busroot from './photos/bus-root.png';
import dailybus from './photos/daily-bus.jpg';
import dailyinventory from './photos/daily-inventory.jpg';

const Home = () => {
    const history = useHistory();
    const [searchTerm, setSearchTerm] = useState('');
    const [availablePlaces, setAvailablePlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    

    // Fetch available places from the database
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "bus"));
                const places = Array.from(new Set(querySnapshot.docs.map(doc => doc.data().parent)));
                setAvailablePlaces(places);
            } catch (error) {
                console.error("Error fetching places: ", error);
            }
        };
        fetchPlaces();
    }, []);

    // Filter available places based on the search term
    useEffect(() => {
        const results = availablePlaces.filter(place =>
            place.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPlaces(results);
    }, [searchTerm, availablePlaces]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePlaceClick = (place) => {
        history.push(`/user?destination=${encodeURIComponent(place)}`);
    };
    function toggleFAQ(event) {
        const faqItem = event.currentTarget.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = faqItem.querySelector('.faq-icon');
        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            icon.textContent = '▼';
        } else {
            answer.style.display = 'block';
            icon.textContent = '▲';
        }
    }

    function filterFAQs(category) {
        const buttons = document.querySelectorAll('.faq-btn');
        buttons.forEach((btn) => btn.classList.remove('active'));
    
        const activeButton = Array.from(buttons).find((btn) =>
            btn.textContent.toLowerCase().includes(category)
        );
        if (activeButton) activeButton.classList.add('active');
    
        const items = document.querySelectorAll('.faq-item');
        items.forEach((item) => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    

    return (
        <div className="home-container">
            <header className="header">
                <div className="logo">Terai Bus</div>

                <div className="search-container-header">
                    <FiMapPin className="location-icon" />
                    <input
                        type="text"
                        placeholder="Search destination"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input-header"
                    />
                    <div className="search-results-header">
                        {filteredPlaces.map((place, index) => (
                            <div
                                key={index}
                                className="search-result-item"
                                onClick={() => handlePlaceClick(place)}
                            >
                                {place}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="contact-class">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook style={{ marginRight: '8px' }} /> Facebook
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram style={{ marginRight: '8px' }} /> Instagram
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter style={{ marginRight: '8px' }} /> Twitter
                    </a>
                </div>

                <button className="admin-button" onClick={() => history.push('/')}>Admin</button>
            </header>

            <main className="main-content">
                <h1>Welcome to Terai Bus Sewa</h1>
                <p>
                    Experience hassle-free bus ticket booking with Terai Bus Sewa. Choose your destination below and view available buses.
                </p>

                <button className="book-button-main" onClick={() => history.push('/user')}>Book Tickets</button>

                <div className="bus-animation">
                    <img src={busImage} alt="Moving Bus" className="moving-bus" />
                </div>

                {/* Customer Reviews */}
                    <section className="customer-reviews">
                        <h2>What clients say</h2>
                        <div className="reviews-container">
                            <div className="review-card">
                                <div className="review-header">
                                    <img src={siddimage} alt="Bus Icon" className="review-icon" />
                                    <span className="review-title">Shuva Jagadamba Travels</span>
                                    <span className="review-rating">⭐⭐⭐⭐</span>
                                </div>
                                <p className="review-text">
                                    “As a regular traveler of Shuva Jagadamba, I have a request for them to begin their day services too.”
                                </p>
                                <div className="review-author">manisha</div>
                            </div>

                            <div className="review-card">
                                <div className="review-header">
                                    <img src={siddimage} alt="Bus Icon" className="review-icon" />
                                    <span className="review-title">Dhaulagiri Yatayat</span>
                                    <span className="review-rating">⭐⭐⭐⭐⭐</span>
                                </div>
                                <p className="review-text">
                                    “Dhaulagiri Yatayat has provided extraordinary digital services. Highly recommend them!”
                                </p>
                                <div className="review-author">Siddhartha</div>
                            </div>

                            <div className="review-card">
                                <div className="review-header">
                                    <img src={siddimage} alt="Bus Icon" className="review-icon" />
                                    <span className="review-title">Pokhara Jagadamba Tours & Travels</span>
                                    <span className="review-rating">⭐⭐⭐⭐⭐</span>
                                </div>
                                <p className="review-text">
                                    “Never had a complaint while traveling on Pokhara Jagadamba. Their staff is polite and professional.”
                                </p>
                                <div className="review-author">Hari</div>
                            </div>
                        </div>
                    </section>

                    {/* Milestones Section */}
                        <section className="milestones-section">
                            <h2>Milestones</h2>
                            <p>
                               Terai BusSewa is Nepal's fastest-growing online ticket booking platform. BusSewa – Nepal’s first online real-time bus ticket booking platform powered by Diyalo Technologies Pvt. Ltd. came into existence with a vision of innovating business processes of Travel Operators in Nepal to provide quality service to road passengers.
                            </p>
                            <div className="milestones-grid">
                                <div className="milestone">
                                    <img src={busroot} alt="Bus Routes Icon" />
                                    <h3>300+ Bus Routes</h3>
                                    <p>Enjoy daily services that link over 65 districts in Nepal for seamless travel convenience.</p>
                                </div>
                                <div className="milestone">
                                    <img src={dailyinventory} alt="Daily Inventory Icon" />
                                    <h3>50k+ Daily Inventory</h3>
                                    <p>Providing numerous seat options for a delightful journey tailored to each individual's preference.</p>
                                </div>
                                <div className="milestone">
                                    <img src={buspartner} alt="Bus Partners Icon" />
                                    <h3>300+ Bus Partners</h3>
                                    <p>Our partners are eager to provide even more to our customers, ensuring satisfaction at best.</p>
                                </div>
                                <div className="milestone">
                                    <img src={dailybus} alt="Daily Buses Icon" />
                                    <h3>1k+ Daily Buses</h3>
                                    <p>Explore a variety of luxurious and comfortable bus options for every passenger's preference.</p>
                                </div>
                            </div>
                        </section>



              {/* Frequently Asked Questions */}
                <section className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-buttons">
                        <button className="faq-btn active" onClick={() => filterFAQs('all')}>All</button>
                        <button className="faq-btn" onClick={() => filterFAQs('booking')}>Booking</button>
                        <button className="faq-btn" onClick={() => filterFAQs('tourist')}>TOURIST</button>
                    </div>
                    <div className="faq-container">
                        <div className="faq-item all booking">
                            <div className="faq-question" onClick={toggleFAQ}>
                                What is BusSewa?
                                <span className="faq-icon">▼</span>
                            </div>
                            <div className="faq-answer">
                                BusSewa is a platform for booking bus tickets online for various routes.
                            </div>
                        </div>
                        <div className="faq-item all">
                            <div className="faq-question" onClick={toggleFAQ}>
                                Do I Need To Register To Use BusSewa?
                                <span className="faq-icon">▼</span>
                            </div>
                            <div className="faq-answer">
                                It is optional, but we recommend registering to get access to travel history and offers.
                            </div>
                        </div>
                        <div className="faq-item all booking">
                            <div className="faq-question" onClick={toggleFAQ}>
                                How Can I Make Payments?
                                <span className="faq-icon">▼</span>
                            </div>
                            <div className="faq-answer">
                                You can make payments via eSewa, Khalti, or bank cards.
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
};

export default Home;
