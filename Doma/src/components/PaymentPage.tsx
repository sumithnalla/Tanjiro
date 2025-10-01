import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { venuesData } from '../data/artistsData';
import BookingForm from './BookingForm';
import BookingSummary from './BookingSummary';
import EventTypeSelection from './EventTypeSelection';
import CakeSelection from './CakeSelection';
import AddOnsSelection from './AddOnsSelection';
import FinalSummary from './FinalSummary';
import { addOns } from '../data/addOnsData';
import {
  validateEmail,
  validatePhone,
  validateBookingName,
  sanitizeInput,
} from '../lib/validation';
import { bookingRateLimiter } from '../lib/rateLimiter';

type PaymentStep = 'booking' | 'event-type' | 'cake' | 'addons' | 'summary';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [venueId, setVenueId] = useState<string>('');
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<PaymentStep>('booking');

  const [formData, setFormData] = useState({
    bookingName: '',
    persons: '1',
    whatsapp: '',
    email: '',
    decoration: true, // Decoration is now mandatory for all venues
    slotId: '',
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [extraPersonCharges, setExtraPersonCharges] = useState(0);
  const [selectedCakes, setSelectedCakes] = useState<
    Array<{
      name: string;
      type: 'egg' | 'eggless';
      weight: 'halfKg' | 'oneKg';
      price: number;
      quantity: number;
    }>
  >([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // Calculate extra person charges
  const calculateExtraCharges = (persons: number, venueName: string) => {
    const venueCapacities = {
      'Lunar': { included: 4, max: 8 },
      'Minimax': { included: 8, max: 20 },
      'Aura': { included: 6, max: 12 },
      'Couple': { included: 2, max: 2 }
    };

    const capacity = venueCapacities[venueName as keyof typeof venueCapacities];
    if (!capacity || persons <= capacity.included) return 0;
    
    const extraPersons = persons - capacity.included;
    return extraPersons * 250; // ₹250 per extra person
  };

  // Update extra charges when form data changes
  useEffect(() => {
    if (venue && formData.persons) {
      const charges = calculateExtraCharges(parseInt(formData.persons), venue.name);
      setExtraPersonCharges(charges);
    }
  }, [venue, formData.persons]);

  useEffect(() => {
    const initVenue = () => {
      try {
        const urlVenueId = searchParams.get('venue');
        if (!urlVenueId) {
          setError('No venue selected');
          return;
        }

        setVenueId(urlVenueId);
        const venueData = venuesData.find(v => v.id === urlVenueId);

        if (!venueData) {
          setError('Venue not found');
          return;
        }

        setVenue(venueData);
        setError(null);
      } catch (err) {
        console.error('Error in venue initialization:', err);
        setError('Failed to load venue details');
      }
    };

    initVenue();
  }, [searchParams]);

  const handleBookingFormSubmit = (bookingData: any) => {
    setFormData(bookingData);
    setSelectedDate(bookingData.selectedDate);
    setSelectedSlot(bookingData.selectedSlot);
    setExtraPersonCharges(bookingData.extraPersonCharges || 0);
    setCurrentStep('event-type');
  };

  const handleEventTypeNext = () => setCurrentStep('cake');
  const handleCakeNext = () => setCurrentStep('addons');
  const handleAddOnsNext = () => setCurrentStep('summary');

  const handleAddOnToggle = (addOnName: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnName)
        ? prev.filter((name) => name !== addOnName)
        : [...prev, addOnName]
    );
  };

  const validateFinalBooking = () => {
    const errors: string[] = [];

    if (!validateBookingName(formData.bookingName)) {
      errors.push('Invalid booking name');
    }

    if (!validateEmail(formData.email)) {
      errors.push('Invalid email address');
    }

    if (!validatePhone(formData.whatsapp)) {
      errors.push('Invalid phone number');
    }

    if (!selectedDate || !formData.slotId) {
      errors.push('Missing date or slot selection');
    }

    if (!selectedEventType) {
      errors.push('Please select an event type');
    }

    return errors;
  };

  const callSecureBookingAPI = async (
    paymentId: string,
    totalAmount: number
  ) => {
    try {
      const cakeSelectionString =
        selectedCakes.length > 0
          ? selectedCakes
              .map(
                (cake) =>
                  `${sanitizeInput(cake.name)} (${cake.type}, ${
                    cake.weight
                  }) x${cake.quantity}`
              )
              .join(', ')
          : '';

      const addOnsString = selectedAddOns
        .map((addon) => sanitizeInput(addon))
        .join(', ');

      const bookingPayload = {
        venue_id: venueId,
        slot_id: formData.slotId,
        booking_date: selectedDate,
        booking_name: sanitizeInput(formData.bookingName),
        persons: parseInt(formData.persons),
        whatsapp: sanitizeInput(formData.whatsapp),
        email: sanitizeInput(formData.email),
        decoration: formData.decoration,
        advance_paid: true,
        payment_id: paymentId,
        event_type: sanitizeInput(selectedEventType),
        cake_selection: cakeSelectionString,
        selected_addons: addOnsString,
        total_amount: totalAmount,
      };

      const { data, error } = await supabase.functions.invoke(
        'secure-booking',
        {
          body: bookingPayload,
        }
      );

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Secure booking API error:', error);
      throw error;
    }
  };

  const handleFinalBooking = async () => {
    setLoading(true);
    setError(null);

    try {
      const clientId = `${formData.email}_booking`;
      if (!bookingRateLimiter.isAllowed(clientId)) {
        const remainingTime = Math.ceil(
          bookingRateLimiter.getRemainingTime(clientId) / 1000
        );
        throw new Error(
          `Too many booking attempts. Please wait ${remainingTime} seconds before trying again.`
        );
      }

      const validationErrors = validateFinalBooking();
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Calculate total amount
      const basePrice = venue.price;
      const decorationFee = 400; // Decoration is now mandatory for all venues
      const extraCharges = extraPersonCharges;
      const cakesTotal = selectedCakes.reduce((total, cake) => {
        return total + cake.price * cake.quantity;
      }, 0);
      const addOnsTotal = selectedAddOns.reduce((total, addOnName) => {
        const addOn = addOns.find((a) => a.name === addOnName);
        return total + (addOn ? addOn.price : 0);
      }, 0);
      const totalAmount = basePrice + decorationFee + extraCharges + cakesTotal + addOnsTotal;

      const advanceAmount = 700;

      // Simulate payment processing with a dummy payment dialog
      const confirmPayment = window.confirm(
        `DUMMY PAYMENT\n\nVenue: ${venue.name}\nAmount: ₹${advanceAmount}\n\nClick OK to simulate successful payment\nClick Cancel to simulate payment cancellation`
      );

      if (!confirmPayment) {
        setLoading(false);
        setError('Payment was cancelled. Please try again.');
        return;
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate dummy payment ID
      const dummyPaymentId = `dummy_pay_${Date.now()}`;

      // Prepare booking data
      const bookingData = {
        venue_id: venueId,
        slot_id: formData.slotId,
        booking_date: selectedDate,
        booking_name: sanitizeInput(formData.bookingName),
        persons: parseInt(formData.persons),
        whatsapp: sanitizeInput(formData.whatsapp),
        email: sanitizeInput(formData.email),
        decoration: formData.decoration,
        extra_person_charges: extraCharges,
        event_type: sanitizeInput(selectedEventType),
        cake_selection:
          selectedCakes.length > 0
            ? selectedCakes
                .map(
                  (cake) =>
                    `${sanitizeInput(cake.name)} (${cake.type}, ${
                      cake.weight
                    }) x${cake.quantity}`
                )
                .join(', ')
            : null,
        selected_addons:
          selectedAddOns.length > 0
            ? selectedAddOns.map((addon) => sanitizeInput(addon)).join(', ')
            : null,
        total_amount: totalAmount,
      };

      // Create booking directly without payment verification
      const cakeSelectionString =
        selectedCakes.length > 0
          ? selectedCakes
              .map(
                (cake) =>
                  `${sanitizeInput(cake.name)} (${cake.type}, ${
                    cake.weight
                  }) x${cake.quantity}`
              )
              .join(', ')
          : '';

      const addOnsString = selectedAddOns
        .map((addon) => sanitizeInput(addon))
        .join(', ');

      const bookingPayload = {
        venue_id: venueId,
        slot_id: formData.slotId,
        booking_date: selectedDate,
        booking_name: sanitizeInput(formData.bookingName),
        persons: parseInt(formData.persons),
        whatsapp: sanitizeInput(formData.whatsapp),
        email: sanitizeInput(formData.email),
        decoration: formData.decoration,
        advance_paid: true,
        payment_id: dummyPaymentId,
        event_type: sanitizeInput(selectedEventType),
        cake_selection: cakeSelectionString,
        selected_addons: addOnsString,
        total_amount: totalAmount,
      };

      const { data, error: bookingError } = await supabase.functions.invoke(
        'secure-booking',
        {
          body: bookingPayload,
        }
      );

      if (bookingError) {
        throw new Error('Failed to create booking');
      }

      // Navigate to success page
      navigate('/booking-success');
    } catch (err: any) {
      console.error('Error in booking process:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'event-type':
        setCurrentStep('booking');
        break;
      case 'cake':
        setCurrentStep('event-type');
        break;
      case 'addons':
        setCurrentStep('cake');
        break;
      case 'summary':
        setCurrentStep('addons');
        break;
      default:
        setCurrentStep('booking');
    }
  };

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          {error || 'Loading venue details...'}
        </div>
      </div>
    );
  }

  const showSummary = currentStep !== 'summary';

  return (
    <div className="min-h-screen bg-gray-900 py-4 md:py-8 lg:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <img
              src="/BINGEN.png"
              alt="Binge'N Celebration Logo"
              className="h-8 md:h-10 lg:h-12 w-8 md:w-10 lg:w-12"
            />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
              Complete Your Booking
            </h1>
          </div>

          <div
            className={`grid gap-6 md:gap-8 ${
              showSummary ? 'lg:grid-cols-3' : 'lg:grid-cols-1'
            }`}
          >
            <div className={showSummary ? 'lg:col-span-2' : 'lg:col-span-1'}>
              {currentStep === 'booking' && (
                <BookingForm
                  venue={venue}
                  venueId={venueId}
                  onSubmit={handleBookingFormSubmit}
                  loading={loading}
                  error={error}
                  formData={formData}
                  setFormData={setFormData}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              )}

              {currentStep === 'event-type' && (
                <EventTypeSelection
                  selectedEventType={selectedEventType}
                  onEventTypeSelect={setSelectedEventType}
                  onNext={handleEventTypeNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 'cake' && (
                <CakeSelection
                  selectedCakes={selectedCakes}
                  onCakeSelect={setSelectedCakes}
                  onNext={handleCakeNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 'addons' && (
                <AddOnsSelection
                  selectedAddOns={selectedAddOns}
                  onAddOnToggle={handleAddOnToggle}
                  onNext={handleAddOnsNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 'summary' && (
                <FinalSummary
                  venue={venue}
                  formData={formData}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  eventType={selectedEventType}
                  selectedCakes={selectedCakes}
                  selectedAddOns={selectedAddOns}
                  extraPersonCharges={extraPersonCharges}
                  onBack={handleBack}
                  onConfirmBooking={handleFinalBooking}
                  loading={loading}
                />
              )}
            </div>

            {showSummary && (
              <div className="lg:col-span-1">
                <BookingSummary
                  venue={venue}
                  formData={formData}
                  extraPersonCharges={extraPersonCharges}
                  selectedCakes={selectedCakes}
                  selectedAddOns={selectedAddOns}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-center" role="alert">
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;