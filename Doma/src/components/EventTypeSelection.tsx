import React from 'react';
import { eventTypes } from '../data/addOnsData';

interface EventTypeSelectionProps {
  selectedEventType: string;
  onEventTypeSelect: (eventType: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const EventTypeSelection = ({ 
  selectedEventType, 
  onEventTypeSelect, 
  onNext, 
  onBack 
}: EventTypeSelectionProps) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Step 1: Select Event Type</h2>
        <span className="text-sm text-gray-400">1 of 4</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {eventTypes.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventTypeSelect(event.name)}
            className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
              selectedEventType === event.name
                ? 'ring-2 ring-pink-500 bg-pink-500/10'
                : 'bg-gray-800/50 hover:bg-gray-700/50'
            }`}
          >
            <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
              <img
                src={event.icon}
                alt={event.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-white font-medium text-sm">{event.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors duration-300 font-bold"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedEventType}
          className={`py-3 px-6 rounded-lg transition-colors duration-300 font-bold ${
            selectedEventType
              ? 'bg-pink-600 hover:bg-pink-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next: Select Cake
        </button>
      </div>
    </div>
  );
};

export default EventTypeSelection;