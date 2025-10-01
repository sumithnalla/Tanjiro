/*
  # Populate slots table with time slots for all venues

  1. Purpose
    - Initialize the slots table with time slots for each venue
    - This ensures that the get_available_slots function returns actual time slots
    - Without this data, the system shows "No slots available" even when nothing is booked

  2. Changes
    - Insert time slots for all existing venues
    - Creates hourly time slots from 10:00 AM to 10:00 PM (last slot ends at 11:00 PM)
    - Each slot is 1 hour duration

  3. Time Slots Created
    - 10:00 AM - 11:00 AM
    - 11:00 AM - 12:00 PM
    - 12:00 PM - 01:00 PM
    - 01:00 PM - 02:00 PM
    - 02:00 PM - 03:00 PM
    - 03:00 PM - 04:00 PM
    - 04:00 PM - 05:00 PM
    - 05:00 PM - 06:00 PM
    - 06:00 PM - 07:00 PM
    - 07:00 PM - 08:00 PM
    - 08:00 PM - 09:00 PM
    - 09:00 PM - 10:00 PM
    - 10:00 PM - 11:00 PM
*/

-- First, check if slots already exist to avoid duplicates
DO $$
DECLARE
  venue_record RECORD;
  slot_count INTEGER;
BEGIN
  -- Check if there are any slots in the table
  SELECT COUNT(*) INTO slot_count FROM slots;

  -- Only proceed if there are no slots
  IF slot_count = 0 THEN
    -- Loop through all venues and create time slots for each
    FOR venue_record IN SELECT id FROM venues LOOP
      -- Insert time slots (10 AM to 11 PM, hourly slots)
      INSERT INTO slots (venue_id, start_time, end_time) VALUES
        (venue_record.id, '10:00:00', '11:00:00'),
        (venue_record.id, '11:00:00', '12:00:00'),
        (venue_record.id, '12:00:00', '13:00:00'),
        (venue_record.id, '13:00:00', '14:00:00'),
        (venue_record.id, '14:00:00', '15:00:00'),
        (venue_record.id, '15:00:00', '16:00:00'),
        (venue_record.id, '16:00:00', '17:00:00'),
        (venue_record.id, '17:00:00', '18:00:00'),
        (venue_record.id, '18:00:00', '19:00:00'),
        (venue_record.id, '19:00:00', '20:00:00'),
        (venue_record.id, '20:00:00', '21:00:00'),
        (venue_record.id, '21:00:00', '22:00:00'),
        (venue_record.id, '22:00:00', '23:00:00')
      ON CONFLICT (venue_id, start_time, end_time) DO NOTHING;
    END LOOP;

    RAISE NOTICE 'Successfully populated slots for all venues';
  ELSE
    RAISE NOTICE 'Slots table already has data, skipping initialization';
  END IF;
END $$;
