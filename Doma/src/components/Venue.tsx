import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Venue = () => {
  return (
    <section
      id="venue"
      className="py-12 md:py-20 bg-gradient-to-b from-indigo-900/90 to-gray-900"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Store Location
            </span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl shadow-purple-500/5">
            <div className="aspect-video relative overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/b0/df/3e/b0df3e5df2d405d969187327c54c114d.jpg"
                alt="BINGE'N CELEBRATIONS location"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <a
                    href="https://maps.app.goo.gl/ZroCxmJEa7RFq4kb8?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 hover:text-pink-500 transition-colors group"
                    aria-label="View location on Google Maps"
                  >
                    <MapPin className="h-4 md:h-5 w-4 md:w-5 text-pink-500 flex-shrink-0 mt-0.5 group-hover:text-pink-400" />
                    <div className="text-sm md:text-base">
                      <p className="text-white group-hover:text-pink-500 transition-colors">
                        Vijay Sri Complex
                      </p>
                      <p className="text-gray-400">
                        #6/P, 3rd Floor, Kalimandir
                      </p>
                      <p className="text-gray-400">
                        Bandlaguda Jagir, Gandipet Mandal
                      </p>
                      <p className="text-gray-400">
                        Ranga Reddy District, Telangana 500086
                      </p>
                    </div>
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 md:h-5 w-4 md:w-5 text-pink-500 flex-shrink-0" />
                  <p className="text-white text-sm md:text-base">
                    +91 99590 59632
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 md:h-5 w-4 md:w-5 text-pink-500 flex-shrink-0" />
                  <a
                    href="mailto:bingencelebrations@gmail.com"
                    className="text-white hover:text-pink-500 transition-colors text-sm md:text-base"
                    aria-label="Send email to BINGE'N CELEBRATIONS"
                  >
                    bingencelebrations@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Venue;
