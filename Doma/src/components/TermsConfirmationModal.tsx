import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface TermsConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsConfirmationModal = ({
  isOpen,
  onClose,
  onAccept,
}: TermsConfirmationModalProps) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (!isAccepted) {
      setShowError(true);
      return;
    }
    onAccept();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAccepted(e.target.checked);
    if (e.target.checked) {
      setShowError(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Terms & Conditions and Refund Policy
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8 text-gray-300">
          {/* Terms & Conditions */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Terms & Conditions
            </h3>
            <div className="space-y-4">
              <p>
                1. We do NOT provide any movie/OTT accounts. We will do the
                setups using your OTT accounts/downloaded content.
              </p>
              <p>2. Smoking/Drinking is NOT allowed inside the theater.</p>
              <p>
                3. Any DAMAGE caused to theater, including decorative materials
                like balloons, lights etc. will have to be reimbursed.
              </p>
              <p>
                4. Guests are requested to maintain CLEANLINESS inside the
                theater.
              </p>
              <p>
                5. Party poppers/Snow sprays/Cold Fire, and any other similar
                items are strictly prohibited inside the theater.
              </p>
              <p>
                6. Carrying AADHAAR CARD is mandatory. It will be scanned during
                entry.
              </p>
              <p>
                7. Couples under 18 years of age are not allowed to book the
                theatre.
              </p>
              <p>8. Pets are strictly not allowed inside the theatre.</p>
              <p>
                9. Children under 13 are charged 100 rupees, while those 13 and
                older are charged more.
              </p>
            </div>
          </div>

          {/* Refund Policy */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Refund Policy</h3>
            <div className="space-y-4">
              <p>
                Advance amount is fully refundable if slot is cancelled at least
                72 hrs before the slot time.
              </p>
              <p>
                If your slot is less than 72 hrs away from time of payment, then
                advance is non-refundable.
              </p>
            </div>
          </div>

          {/* Checkbox and Error */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms-accept"
                checked={isAccepted}
                onChange={handleCheckboxChange}
                className="mt-1 h-4 w-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
              />
              <label htmlFor="terms-accept" className="text-white text-sm">
                I have read and agree to the Terms & Conditions and Refund
                Policy
              </label>
            </div>

            {showError && (
              <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Please accept the terms before continuing.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors duration-300 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg transition-colors duration-300 font-bold"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConfirmationModal;
