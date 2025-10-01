import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import {
  validateEmail,
  validatePhone,
  validateBookingName,
  validatePersons,
  validateDate,
  validateSlotId,
  sanitizeInput,
} from '../lib/validation';
import { formRateLimiter } from '../lib/rateLimiter';

interface Slot {
  slot_id: string;
  start_time: string;
  end_time: string;
}

interface BookingFormProps {
  venue: any;
  venueId: string;
  onSubmit: (formData: any) => void;
  loading: boolean;
  error: string | null;
  formData: any;
  setFormData: (data: any) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const BookingForm = ({
  venue,
  venueId,
  onSubmit,
  loading,
  error,
  formData,
  setFormData,
  selectedDate,
  setSelectedDate,
}: BookingFormProps) => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [rateLimitError, setRateLimitError] = useState<string>('');

  // Calculate extra person charges
  const calculateExtraCharges = (persons: number, venueName: string) => {
    const venueCapacities = {
      Lunar: { included: 4, max: 8 },
      Minimax: { included: 8, max: 20 },
      Aura: { included: 6, max: 12 },
      Couple: { included: 2, max: 2 },
    };

    const capacity = venueCapacities[venueName as keyof typeof venueCapacities];
    if (!capacity || persons <= capacity.included) return 0;

    const extraPersons = persons - capacity.included;
    return extraPersons * 250; // ₹250 per extra person
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSelectedSlotTime = () => {
    const selectedSlot = slots.find((slot) => slot.slot_id === formData.slotId);
    return selectedSlot
      ? `${selectedSlot.start_time} - ${selectedSlot.end_time}`
      : '';
  };

  // This block is no longer needed as the decoration field is being removed.
  // The 'decoration' value will now be set to 'false' by default during form submission.
  /*
  useEffect(() => {
    if (venue.name === 'Couple' && !formData.decoration) {
      setFormData((prev) => ({ ...prev, decoration: true }));
    }
  }, [venue.name, formData.decoration, setFormData]);
  */

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate || !venueId) {
        setSlots([]);
        return;
      }

      try {
        setSlotsLoading(true);

        // Validate date before making request
        if (!validateDate(selectedDate)) {
          setValidationErrors((prev) => ({
            ...prev,
            selectedDate: 'Please select a valid future date',
          }));
          return;
        }

        // Use the get_available_slots RPC function to get only available slots
        const { data: availableSlots, error: slotsError } = await supabase.rpc(
          'get_available_slots',
          {
            p_venue_id: venueId,
            p_date: selectedDate,
          }
        );

        if (slotsError) {
          console.error('Error fetching available slots:', slotsError);
          throw slotsError;
        }

        // Format the slots for display
        const formattedSlots = (availableSlots || []).map((slot: any) => ({
          slot_id: slot.slot_id,
          start_time: formatTime(slot.start_time),
          end_time: formatTime(slot.end_time),
        }));

        setSlots(formattedSlots);

        // Auto-select first available slot if current selection is not available
        if (formattedSlots.length > 0) {
          if (
            !formattedSlots.find((slot) => slot.slot_id === formData.slotId)
          ) {
            setFormData((prev: any) => ({
              ...prev,
              slotId: formattedSlots[0].slot_id,
            }));
          }
        } else {
          // No slots available, clear selection
          setFormData((prev: any) => ({ ...prev, slotId: '' }));
        }
      } catch (err: any) {
        console.error('Error fetching available slots:', err);
        setSlots([]);
        setFormData((prev: any) => ({ ...prev, slotId: '' }));
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, venueId, setFormData]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!selectedDate) {
      errors.selectedDate = 'Please select a booking date';
    } else if (!validateDate(selectedDate)) {
      errors.selectedDate = 'Please select a valid future date';
    }

    if (!formData.slotId) {
      errors.slotId = 'Please select a time slot';
    } else if (!validateSlotId(formData.slotId)) {
      errors.slotId = 'Please select a valid time slot';
    }

    if (!formData.bookingName.trim()) {
      errors.bookingName = 'Please enter a booking name';
    } else if (!validateBookingName(formData.bookingName)) {
      errors.bookingName = 'Booking name must be between 2-50 characters';
    }

    if (!formData.persons) {
      errors.persons = 'Please select number of persons';
    } else if (
      !validatePersons(parseInt(formData.persons), venue.baseMembers || venue.base_members || 2)
    ) {
      errors.persons = `Number of persons must be between 1 and ${venue.baseMembers || venue.base_members || 2}`;
    }

    if (!formData.whatsapp) {
      errors.whatsapp = 'Please enter a WhatsApp number';
    } else if (!validatePhone(formData.whatsapp)) {
      errors.whatsapp = 'Please enter a valid 10-digit WhatsApp number';
    }

    if (!formData.email.trim()) {
      errors.email = 'Please enter an email address';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    const clientId = `${formData.email || 'anonymous'}_${Date.now()}`;
    if (!formRateLimiter.isAllowed(clientId)) {
      const remainingTime = Math.ceil(
        formRateLimiter.getRemainingTime(clientId) / 1000
      );
      setRateLimitError(
        `Too many requests. Please wait ${remainingTime} seconds before trying again.`
      );
      return;
    }

    setRateLimitError('');

    if (!validateForm()) {
      return;
    }

    // Sanitize inputs before submission
    const sanitizedFormData = {
      ...formData,
      bookingName: sanitizeInput(formData.bookingName), // Sanitize only on submission
      email: sanitizeInput(formData.email),
      whatsapp: sanitizeInput(formData.whatsapp),
    };

    onSubmit({
      ...sanitizedFormData,
      selectedDate,
      selectedSlot: getSelectedSlotTime(),
      extraPersonCharges: calculateExtraCharges(
        parseInt(formData.persons),
        venue.name
      ),
      decoration: false, // Explicitly set decoration to false
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData({ ...formData, whatsapp: value });
      if (validationErrors.whatsapp) {
        setValidationErrors((prev) => ({ ...prev, whatsapp: '' }));
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    // Only sanitize non-booking-name fields during input
    const sanitizedValue =
      typeof value === 'string' && field !== 'bookingName'
        ? sanitizeInput(value)
        : value;
    setFormData({ ...formData, [field]: sanitizedValue });
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Booking Overview */}
      {(selectedDate || formData.slotId || formData.persons) && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-pink-500" />
            Booking Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-pink-500" />
                <span className="text-sm text-gray-300">Venue</span>
              </div>
              <p className="text-white font-medium">{venue.name}</p>
            </div>

            {selectedDate && (
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-pink-500" />
                  <span className="text-sm text-gray-300">Date</span>
                </div>
                <p className="text-white font-medium text-sm">
                  {formatDate(selectedDate)}
                </p>
              </div>
            )}

            {formData.slotId && (
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-pink-500" />
                  <span className="text-sm text-gray-300">Time</span>
                </div>
                <p className="text-white font-medium text-sm">
                  {getSelectedSlotTime()}
                </p>
              </div>
            )}

            {formData.persons && (
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-pink-500" />
                  <span className="text-sm text-gray-300">Guests</span>
                </div>
                <p className="text-white font-medium">
                  {formData.persons} Person
                  {parseInt(formData.persons) !== 1 ? 's' : ''}
                </p>
                {calculateExtraCharges(parseInt(formData.persons), venue.name) >
                  0 && (
                  <p className="text-yellow-400 text-xs mt-1">
                    +₹
                    {calculateExtraCharges(
                      parseInt(formData.persons),
                      venue.name
                    )}{' '}
                    extra charges
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rate Limit Error */}
      {rateLimitError && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400 text-sm" role="alert">
            {rateLimitError}
          </p>
        </div>
      )}

      {/* Booking Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-xl p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Booking Details</h2>
          <span className="text-sm text-gray-400">1 of 4</span>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Booking Date*
            </label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                if (validationErrors.selectedDate) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    selectedDate: '',
                  }));
                }
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Select booking date"
            />
            {validationErrors.selectedDate && (
              <p className="text-red-400 text-sm mt-1" role="alert">
                {validationErrors.selectedDate}
              </p>
            )}
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Available Slots*
              </label>
              {slotsLoading ? (
                <div className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-gray-400">
                  Loading available slots...
                </div>
              ) : (
                <select
                  required
                  value={formData.slotId}
                  onChange={(e) => handleInputChange('slotId', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  aria-label="Select time slot"
                >
                  <option value="">Select a slot</option>
                  {slots.map((slot) => (
                    <option key={slot.slot_id} value={slot.slot_id}>
                      {slot.start_time} - {slot.end_time}
                    </option>
                  ))}
                </select>
              )}
              {validationErrors.slotId && (
                <p className="text-red-400 text-sm mt-1" role="alert">
                  {validationErrors.slotId}
                </p>
              )}
              {slots.length === 0 && !slotsLoading && selectedDate && (
                <p className="text-red-400 text-sm mt-1">
                  No slots available for this date. Please select another date.
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Booking Name*
            </label>
            <input
              type="text"
              required
              value={formData.bookingName}
              onChange={(e) => handleInputChange('bookingName', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter booking name"
              aria-label="Enter booking name"
              maxLength={50}
            />
            {validationErrors.bookingName && (
              <p className="text-red-400 text-sm mt-1" role="alert">
                {validationErrors.bookingName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Persons*
            </label>
            <select
              required
              value={formData.persons}
              onChange={(e) => handleInputChange('persons', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Select number of persons"
            >
              {[...Array(Math.max((venue.baseMembers || venue.base_members || 2) - 1, 1))].map((_, i) => {
                const value = i + 2; // Start from 2 persons
                return (
                  <option key={value} value={value}>
                    {value} Person{value > 1 ? 's' : ''}
                  </option>
                );
              })}
            </select>
            {validationErrors.persons && (
              <p className="text-red-400 text-sm mt-1" role="alert">
                {validationErrors.persons}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              WhatsApp Number*
            </label>
            <input
              type="tel"
              required
              value={formData.whatsapp}
              onChange={handlePhoneChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter 10-digit WhatsApp number"
              aria-label="Enter WhatsApp number"
              maxLength={10}
              minLength={10}
            />
            {validationErrors.whatsapp && (
              <p className="text-red-400 text-sm mt-1" role="alert">
                {validationErrors.whatsapp}
              </p>
            )}
            {formData.whatsapp.length > 0 &&
              formData.whatsapp.length < 10 &&
              !validationErrors.whatsapp && (
                <p className="text-yellow-400 text-sm mt-1">
                  Please enter exactly 10 digits
                </p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email ID*
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter email address"
              aria-label="Enter email address"
              maxLength={100}
            />
            {validationErrors.email && (
              <p className="text-red-400 text-sm mt-1" role="alert">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* This section has been completely removed */}
          {/*
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Do you want decoration?*
            </label>
            {isCoupleVenue ? (
              <div className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white">
                Yes (Mandatory for Couple venue)
              </div>
            ) : (
              <select
                required
                value={formData.decoration ? 'yes' : 'no'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    decoration: e.target.value === 'yes',
                  })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                aria-label="Select decoration option"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            )}
          </div>
          */}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors duration-300 font-bold"
            aria-label="Go back to home page"
          >
            Back to Home
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg transition-colors duration-300 font-bold ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Proceed to event selection"
          >
            {loading ? 'Processing...' : 'Next: Select Event Type'}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-center" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default BookingForm;
