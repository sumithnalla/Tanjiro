import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, Monitor, IndianRupee, Sparkles, Images, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    image: string;
    galleryImages: string[];
    price: number;
    baseMembers: number;
    screenSize: string;
    decorationFee: number;
    slots: string[];
    features: string[];
    refundPolicy: string;
  };
}

const VenueCard = ({ venue }: VenueCardProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);

  // Auto-rotate slideshow
  useEffect(() => {
    if (!isHovered && venue.galleryImages && venue.galleryImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === venue.galleryImages.length - 1 ? 0 : prev + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, venue.galleryImages]);

  const handleBookNow = (venueId: string) => {
    navigate(`/payment?venue=${venueId}`);
  };

  const openGallery = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGallery(true);
    setGalleryImageIndex(0);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const nextGalleryImage = () => {
    setGalleryImageIndex((prev) => 
      prev === venue.galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevGalleryImage = () => {
    setGalleryImageIndex((prev) => 
      prev === 0 ? venue.galleryImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-500 h-full flex flex-col border-[3px] border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:border-pink-500/70 hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]">
        <div 
          className="relative overflow-hidden aspect-video"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={venue.galleryImages && venue.galleryImages.length > 0 
              ? venue.galleryImages[currentImageIndex] 
              : venue.image}
            alt={`${venue.name} - Premium private theater venue`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-60"></div>
          
          {/* Gallery Button */}
          <button
            onClick={openGallery}
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Open gallery"
          >
            <Images className="h-4 w-4" />
          </button>

          {/* Slideshow indicators */}
          {venue.galleryImages && venue.galleryImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {venue.galleryImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 flex-1 flex flex-col">
          <div className="mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-start md:gap-4 space-y-3 md:space-y-0">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center md:text-left">
                {venue.name}
              </h3>

              <div className="inline-block px-4 py-3 bg-pink-500/20 text-pink-300 rounded-full mx-auto md:mx-0 flex-shrink-0">
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className="h-5 w-5 flex-shrink-0" />
                  <span className="text-lg sm:text-xl font-bold">
                    {venue.price}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-center mt-1 leading-tight">
                  {venue.name === 'Aura' && '(for 6 or less people)'}
                  {venue.name === 'Lunar' && '(for 4 or less people)'}
                  {venue.name === 'Minimax' && '(for 8 or less people)'}
                  {venue.name === 'Couple' && '(for 2 people)'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-6 flex-1">
            <div className="flex items-start gap-3 text-gray-300">
              <Users className="h-4 md:h-5 w-4 md:w-5 text-pink-500 flex-shrink-0" />
              <span className="text-sm sm:text-base leading-relaxed">
                {venue.features[0]}
              </span>
            </div>
            <div className="flex items-start gap-3 text-gray-300">
              <Monitor className="h-4 md:h-5 w-4 md:w-5 text-pink-500 flex-shrink-0" />
              <span className="text-sm sm:text-base leading-relaxed">
                {venue.screenSize}
              </span>
            </div>
            {venue.name === 'Couple' ? (
              <div className="flex items-start gap-3 text-gray-300">
                <Sparkles className="h-4 md:h-5 w-4 md:w-5 text-pink-500 flex-shrink-0" />
                <span className="text-sm sm:text-base leading-relaxed">
                  {venue.features[1]}
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-3 text-gray-300">
                <Sparkles className="h-4 md:h-5 w-4 md:w-5 text-pink-500 flex-shrink-0" />
                <span className="text-sm sm:text-base leading-relaxed">
                  Decoration fee: ₹400
                </span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h4 className="text-base sm:text-lg text-white font-semibold flex items-center gap-2 mb-4">
              <Clock className="h-4 md:h-5 w-4 md:w-5 text-pink-500" />
              Available Slots
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {venue.slots.map((slot, index) => (
                <div
                  key={index}
                  className="text-gray-300 text-sm sm:text-base flex items-center gap-3 bg-gray-700/30 rounded-lg p-3 sm:p-4"
                >
                  <span className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></span>
                  <span className="leading-relaxed">{slot}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleBookNow(venue.id)}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 sm:py-4 px-4 rounded-lg transition-colors duration-300 font-bold text-base sm:text-lg mt-auto"
            aria-label={`Book ${venue.name} venue now`}
          >
            Book Now
          </button>

          <p className="text-gray-400 text-xs sm:text-sm mt-4 text-center leading-relaxed">
            {venue.refundPolicy}
          </p>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 text-white hover:text-pink-500 transition-colors duration-300 z-10"
              aria-label="Close gallery"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Previous button */}
            <button
              onClick={prevGalleryImage}
              className="absolute left-4 text-white hover:text-pink-500 transition-colors duration-300 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>

            {/* Next button */}
            <button
              onClick={nextGalleryImage}
              className="absolute right-4 text-white hover:text-pink-500 transition-colors duration-300 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-10 w-10" />
            </button>

            {/* Gallery image */}
            <img
              src={venue.galleryImages[galleryImageIndex]}
              alt={`${venue.name} gallery image ${galleryImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {galleryImageIndex + 1} / {venue.galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VenueCard;
