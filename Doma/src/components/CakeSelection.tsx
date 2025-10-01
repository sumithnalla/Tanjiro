import React, { useState } from 'react';
import { cakes } from '../data/addOnsData';

interface CakeSelectionProps {
  selectedCakes: Array<{
    name: string;
    type: 'egg' | 'eggless';
    weight: 'halfKg' | 'oneKg';
    price: number;
    quantity: number;
  }>;
  onCakeSelect: (
    cakes: Array<{
      name: string;
      type: 'egg' | 'eggless';
      weight: 'halfKg' | 'oneKg';
      price: number;
      quantity: number;
    }>
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

const CakeSelection = ({
  selectedCakes,
  onCakeSelect,
  onNext,
  onBack,
}: CakeSelectionProps) => {
  const [cakeType, setCakeType] = useState<'egg' | 'eggless'>('egg');
  const [cakeWeight, setCakeWeight] = useState<'halfKg' | 'oneKg'>('halfKg');

  const handleCakeClick = (cake: any) => {
    const price = cake.prices[cakeType][cakeWeight];
    const cakeKey = `${cake.name}-${cakeType}-${cakeWeight}`;

    const existingCakeIndex = selectedCakes.findIndex(
      (c) => `${c.name}-${c.type}-${c.weight}` === cakeKey
    );

    if (existingCakeIndex >= 0) {
      // Remove cake if already selected
      const newCakes = selectedCakes.filter(
        (_, index) => index !== existingCakeIndex
      );
      onCakeSelect(newCakes);
    } else {
      // Add new cake
      const newCake = {
        name: cake.name,
        type: cakeType,
        weight: cakeWeight,
        price: price,
        quantity: 1,
      };
      onCakeSelect([...selectedCakes, newCake]);
    }
  };

  const updateQuantity = (cakeIndex: number, newQuantity: number) => {
    if (newQuantity < 0) return;

    if (newQuantity === 0) {
      // Remove cake when quantity reaches 0
      const updatedCakes = selectedCakes.filter(
        (_, index) => index !== cakeIndex
      );
      onCakeSelect(updatedCakes);
    } else {
      // Update quantity
      const updatedCakes = selectedCakes.map((cake, index) =>
        index === cakeIndex ? { ...cake, quantity: newQuantity } : cake
      );
      onCakeSelect(updatedCakes);
    }
  };

  const isCakeSelected = (cake: any) => {
    const cakeKey = `${cake.name}-${cakeType}-${cakeWeight}`;
    return selectedCakes.some(
      (c) => `${c.name}-${c.type}-${c.weight}` === cakeKey
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Step 2: Select Cake (Optional)
        </h2>
        <span className="text-sm text-gray-400">2 of 4</span>
      </div>

      <p className="text-gray-400 mb-6 text-center">
        Images are for demonstration purposes only. Actual cake may look
        different.
      </p>

      <div className="flex justify-center gap-4 mb-8">
        <div className="flex items-center gap-4 bg-gray-800/50 rounded-lg p-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type
            </label>
            <select
              value={cakeType}
              onChange={(e) => setCakeType(e.target.value as 'egg' | 'eggless')}
              className="bg-gray-700 text-white rounded-lg px-4 py-2"
            >
              <option value="egg">Egg</option>
              <option value="eggless">Eggless</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Weight
            </label>
            <select
              value={cakeWeight}
              onChange={(e) =>
                setCakeWeight(e.target.value as 'halfKg' | 'oneKg')
              }
              className="bg-gray-700 text-white rounded-lg px-4 py-2"
            >
              <option value="halfKg">½ kg</option>
              <option value="oneKg">1 kg</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {cakes.map((cake) => (
          <div
            key={cake.id}
            onClick={() => handleCakeClick(cake)}
            className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
              isCakeSelected(cake)
                ? 'ring-2 ring-pink-500 bg-pink-500/10'
                : 'bg-gray-800/50 hover:bg-gray-700/50'
            }`}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={cake.image}
                alt={cake.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {isCakeSelected(cake) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {cake.name}
              </h3>
              <p className="text-pink-500 font-bold">
                ₹{cake.prices[cakeType][cakeWeight]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Cakes Summary */}
      {selectedCakes.length > 0 && (
        <div className="mb-8 bg-gray-700/30 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">Selected Cakes:</h3>
          <div className="space-y-3">
            {selectedCakes.map((cake, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-600/30 rounded-lg p-3"
              >
                <div>
                  <span className="text-white font-medium">{cake.name}</span>
                  <p className="text-gray-400 text-sm">
                    {cake.type === 'egg' ? 'Egg' : 'Eggless'} •{' '}
                    {cake.weight === 'halfKg' ? '½ kg' : '1 kg'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(index, cake.quantity - 1);
                      }}
                      className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded-full flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-white font-medium w-8 text-center">
                      {cake.quantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(index, cake.quantity + 1);
                      }}
                      className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded-full flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-pink-500 font-bold">
                    ₹{cake.price * cake.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          Next: Select Add-ons
        </button>
      </div>
    </div>
  );
};

export default CakeSelection;
