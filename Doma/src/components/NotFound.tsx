import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center">
                <span className="text-pink-500 text-4xl font-bold">404</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 rounded-lg transition-colors duration-300 font-bold flex items-center justify-center gap-2"
                aria-label="Go back to home page"
              >
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white py-3 px-8 rounded-lg transition-all duration-300 font-bold flex items-center justify-center gap-2"
                aria-label="Go back to previous page"
              >
                <ArrowLeft className="h-5 w-5" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;