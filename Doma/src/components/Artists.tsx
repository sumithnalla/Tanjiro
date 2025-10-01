import React from 'react';
import { venuesData } from '../data/artistsData';
import VenueCard from './VenueCard';

const VenueSpaces = () => {
  return (
    <section id="venues" className="py-12 md:py-20 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500">
              Our Venues
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Choose from our premium venues for your perfect celebration or
            private screening.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {venuesData.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VenueSpaces;