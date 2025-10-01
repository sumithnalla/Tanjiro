import React from 'react';
import { CheckCircle, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const BookingSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Thank you for choosing BINGE'N CELEBRATIONS. Your advance payment has been received successfully.
            </p>

            {/* What's Next */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">What happens next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-300">
                    You'll receive a confirmation email with your booking details within 5 minutes.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-300">
                    Our team will contact you 24 hours before your booking to confirm arrangements.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-300">
                    Pay the remaining balance amount at the venue on your booking date.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Need help? Contact us</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <Phone className="h-5 w-5 text-pink-500" />
                  <span>+91 99590 59632</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <Mail className="h-5 w-5 text-pink-500" />
                  <span>bingencelebrations@gmail.com</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <MapPin className="h-5 w-5 text-pink-500" />
                  <span>Bandlaguda Jagir, Hyderabad</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 rounded-lg transition-colors duration-300 font-bold"
                aria-label="Return to home page"
              >
                Back to Home
              </Link>
              <Link
                to="/add-ons"
                className="bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white py-3 px-8 rounded-lg transition-all duration-300 font-bold"
                aria-label="Browse available add-ons"
              >
                Browse Add-ons
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingSuccess;