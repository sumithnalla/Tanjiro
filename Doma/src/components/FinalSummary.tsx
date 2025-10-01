import React from 'react';
import { IndianRupee } from 'lucide-react';
import { addOns } from '../data/addOnsData';
import TermsConfirmationModal from './TermsConfirmationModal';

interface FinalSummaryProps {
  venue: any;
  formData: any;
  selectedDate: string;
  selectedSlot: string;
  eventType: string;
  selectedCakes: Array<{
    name: string;
    type: 'egg' | 'eggless';
    weight: 'halfKg' | 'oneKg';
    price: number;
    quantity: number;
  }>;
  selectedAddOns: string[];
  onBack: () => void;
  onConfirmBooking: () => void;
  loading: boolean;
  extraPersonCharges?: number;
}

const FinalSummary = ({
  venue,
  formData,
  selectedDate,
  selectedSlot,
  eventType,
  selectedCakes,
  selectedAddOns,
  onBack,
  onConfirmBooking,
  loading,
  extraPersonCharges = 0,
}: FinalSummaryProps) => {
  const [showTermsModal, setShowTermsModal] = React.useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAddOnPrice = (addOnName: string) => {
    const addOn = addOns.find((a) => a.name === addOnName);
    return addOn ? addOn.price : 0;
  };

  const calculateTotals = () => {
    const basePrice = venue.price;
    const decorationFee = 400; // Decoration is now mandatory for all venues
    const calculatedExtraCharges = extraPersonCharges || 0;

    const cakesTotal = selectedCakes.reduce((total, cake) => {
      return total + cake.price * cake.quantity;
    }, 0);

    const addOnsTotal = selectedAddOns.reduce((total, addOnName) => {
      return total + getAddOnPrice(addOnName);
    }, 0);

    const subtotal = basePrice + decorationFee + calculatedExtraCharges + cakesTotal + addOnsTotal;
    const advanceAmount = 700;
    const balanceAmount = subtotal - advanceAmount;

    return {
      basePrice,
      decorationFee,
      calculatedExtraCharges,
      cakesTotal,
      addOnsTotal,
      subtotal,
      advanceAmount,
      balanceAmount,
    };
  };

  const totals = calculateTotals();

  const handleConfirmBooking = () => {
    setShowTermsModal(true);
  };

  const handleTermsAccept = () => {
    setShowTermsModal(false);
    onConfirmBooking();
  };

  return (
    <>
      <div className="bg-gray-800 rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            Step 4: Review & Confirm
          </h2>
          <span className="text-sm text-gray-400">4 of 4</span>
        </div>

        <div className="space-y-6 mb-8">
          {/* Booking Details */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-4">
              Booking Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Venue:</span>
                <span className="text-white font-medium">{venue.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Date:</span>
                <span className="text-white font-medium">
                  {formatDate(selectedDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Time:</span>
                <span className="text-white font-medium">{selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Persons:</span>
                <span className="text-white font-medium">
                  {formData.persons}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Contact:</span>
                <span className="text-white font-medium">
                  {formData.whatsapp}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Event Type:</span>
                <span className="text-white font-medium">{eventType}</span>
              </div>
            </div>
          </div>

          {/* Cake Selection */}
          {selectedCakes.length > 0 && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-4">
                Cake Selection
              </h3>
              <div className="space-y-2">
                {selectedCakes.map((cake, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <span className="text-white font-medium">
                        {cake.name}
                      </span>
                      <p className="text-gray-400 text-sm">
                        {cake.type === 'egg' ? 'Egg' : 'Eggless'} •{' '}
                        {cake.weight === 'halfKg' ? '½ kg' : '1 kg'} • Qty:{' '}
                        {cake.quantity}
                      </p>
                    </div>
                    <span className="text-pink-500 font-bold flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {cake.price * cake.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {selectedAddOns.length > 0 && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-4">
                Selected Add-ons
              </h3>
              <div className="space-y-2">
                {selectedAddOns.map((addOnName, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-white">{addOnName}</span>
                    <span className="text-pink-500 font-bold flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {getAddOnPrice(addOnName)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bill Summary */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-4">Bill Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Base Price ({venue.name})</span>
                <span className="text-white flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {totals.basePrice}
                </span>
              </div>
              {totals.decorationFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Decoration</span>
                  <span className="text-white flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {totals.decorationFee}
                  </span>
                </div>
              )}
              {totals.calculatedExtraCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Extra Person Charges</span>
                  <div className="text-right">
                    <span className="text-white flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {totals.calculatedExtraCharges}
                    </span>
                    <p className="text-xs text-gray-400">
                      {(() => {
                        const venueCapacities = {
                          'Lunar': { included: 4 },
                          'Minimax': { included: 8 },
                          'Aura': { included: 6 },
                          'Couple': { included: 2 }
                        };
                        const capacity = venueCapacities[venue.name as keyof typeof venueCapacities];
                        const extraPersons = parseInt(formData.persons) - (capacity?.included || 0);
                        return `(${extraPersons} × ₹250)`;
                      })()}
                    </p>
                  </div>
                </div>
              )}
              {totals.cakesTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Cakes</span>
                  <span className="text-white flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {totals.cakesTotal}
                  </span>
                </div>
              )}
              {totals.addOnsTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Add-ons</span>
                  <span className="text-white flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {totals.addOnsTotal}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total Amount</span>
                  <span className="text-white flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {totals.subtotal}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-pink-500 font-bold">
                <span>Advance Amount Payable</span>
                <span className="flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {totals.advanceAmount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Balance Amount</span>
                <span className="text-white flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {totals.balanceAmount}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Balance amount to be paid at venue
              </p>
              <p className="text-xs text-gray-400 mt-2">
                (Additional charges will be applied for guests exceeding the
                included limit, as per the respective venue. An extra charge of
                ₹250 per each additional guest will be applicable.)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors duration-300 font-bold"
          >
            Back
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={loading}
            className={`py-3 px-6 rounded-lg transition-colors duration-300 font-bold ${
              loading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-pink-600 hover:bg-pink-700 text-white'
            }`}
          >
            {loading ? 'Processing...' : 'Confirm & Pay Advance'}
          </button>
        </div>
      </div>

      <TermsConfirmationModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccept}
      />
    </>
  );
};

export default FinalSummary;