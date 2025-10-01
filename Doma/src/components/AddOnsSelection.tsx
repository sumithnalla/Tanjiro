import React from 'react';
import { addOns } from '../data/addOnsData';

interface AddOnsSelectionProps {
  selectedAddOns: string[];
  onAddOnToggle: (addOnName: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const AddOnsSelection = ({ selectedAddOns, onAddOnToggle, onNext, onBack }: AddOnsSelectionProps) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Step 3: Select Add-ons</h2>
        <span className="text-sm text-gray-400">3 of 4</span>
      </div>

      <p className="text-gray-400 mb-6 text-center">
        Select multiple add-ons to enhance your celebration (optional)
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {addOns.map((addon) => (
          <div
            key={addon.id}
            onClick={() => onAddOnToggle(addon.name)}
            className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
              selectedAddOns.includes(addon.name)
                ? 'ring-2 ring-pink-500 bg-pink-500/10'
                : 'bg-gray-800/50 hover:bg-gray-700/50'
            }`}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={addon.image}
                alt={addon.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {selectedAddOns.includes(addon.name) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {addon.name}
              </h3>
              <p className="text-pink-500 font-bold">₹{addon.price}</p>
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
          className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg transition-colors duration-300 font-bold"
        >
          Next: Review & Pay
        </button>
      </div>
    </div>
  );
};

export default AddOnsSelection;