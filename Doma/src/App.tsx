import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import VenueSpaces from './components/Artists';
import Venue from './components/Venue';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import AddOns from './components/AddOns';
import BookingSuccess from './components/BookingSuccess';
import NotFound from './components/NotFound';
import FloatingActionButtons from './components/FloatingActionButtons';
import PaymentPage from './components/PaymentPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route
            path="/payment"
            element={<PaymentPage />}
          />
          <Route path="/add-ons" element={<AddOns />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route
            path="/"
            element={
              <>
                <Header />
                <main>
                  <Hero />
                  <VenueSpaces />
                  <Venue />
                  <Gallery />
                </main>
                <Footer />
                <FloatingActionButtons />
              </>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
