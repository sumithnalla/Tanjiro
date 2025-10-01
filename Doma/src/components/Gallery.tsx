import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isModalImageLoaded, setIsModalImageLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(Array(8).fill(false));
  const [preloadedImages, setPreloadedImages] = useState<HTMLImageElement[]>([]);

  const images = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    src: `/${i + 1}.jpg`,
    alt: `Gallery image ${i + 1} - BINGE'N CELEBRATIONS venue showcase`,
  }));

  // Preload all images on component mount
  useEffect(() => {
    const preloadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    const preloadAllImages = async () => {
      try {
        const loadedImages = await Promise.all(
          images.map(img => preloadImage(img.src))
        );
        setPreloadedImages(loadedImages);
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadAllImages();
  }, []);

  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setIsModalImageLoaded(false);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  const handleImageLoad = (index: number) => {
    setIsLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handlePrev = useCallback(() => {
    if (selectedImage === null) return;
    setIsModalImageLoaded(false);
    setSelectedImage(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [selectedImage, images.length]);

  const handleNext = useCallback(() => {
    if (selectedImage === null) return;
    setIsModalImageLoaded(false);
    setSelectedImage(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [selectedImage, images.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedImage === null) return;

    switch (e.key) {
      case 'ArrowLeft':
        handlePrev();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case 'Escape':
        setSelectedImage(null);
        break;
    }
  }, [selectedImage, handlePrev, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section id="gallery" className="py-12 md:py-20 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500">
              Gallery
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group aspect-square relative overflow-hidden rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-102"
              onClick={() => {
                setIsModalImageLoaded(false);
                setSelectedImage(index);
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${image.alt} in full size`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsModalImageLoaded(false);
                  setSelectedImage(index);
                }
              }}
            >
              <div
                className={`absolute inset-0 bg-gray-900 flex items-center justify-center transition-opacity duration-300 ${
                  isLoaded[index] ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="w-6 md:w-10 h-6 md:h-10 border-2 md:border-4 border-t-pink-500 border-gray-800 rounded-full animate-spin"></div>
              </div>
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className={`object-cover w-full h-full transition-all duration-500 group-hover:scale-110 ${
                  isLoaded[index] ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(index)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {selectedImage !== null && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedImage(null);
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery modal"
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-pink-500 transition-colors duration-300 z-10"
              onClick={() => setSelectedImage(null)}
              aria-label="Close gallery modal"
            >
              <X className="h-6 md:h-8 w-6 md:w-8" />
            </button>

            <button
              className="absolute left-4 md:left-8 text-white hover:text-pink-500 transition-colors duration-300 z-10"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 md:h-10 w-8 md:w-10" />
            </button>

            <button
              className="absolute right-4 md:right-8 text-white hover:text-pink-500 transition-colors duration-300 z-10"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-8 md:h-10 w-8 md:w-10" />
            </button>

            <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
              {!isModalImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 md:w-16 h-12 md:h-16 border-4 border-t-pink-500 border-gray-800 rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className={`object-contain w-full h-full max-h-[85vh] mx-auto transition-opacity duration-300 ${
                  isModalImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsModalImageLoaded(true)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;