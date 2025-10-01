/*
  # Update slot availability function

  1. Changes
    - Modify is_slot_available function to only consider bookings with advance_paid = true
    - This ensures only confirmed (paid) bookings block slots
    - Pending/unconfirmed bookings (advance_paid = false) do not block availability

  2. Function Logic
    - Returns false (not available) only when a confirmed booking exists
    - Returns true (available) when no confirmed booking exists for the slot
*/

CREATE OR REPLACE FUNCTION is_slot_available(
  p_venue_id uuid,
  p_slot_id uuid,
  p_booking_date date
) RETURNS boolean AS $$
DECLARE
  venue_exists boolean;
  slot_exists boolean;
BEGIN
  -- Validate venue exists
  SELECT EXISTS(SELECT 1 FROM venues WHERE id = p_venue_id) INTO venue_exists;
  IF NOT venue_exists THEN
    RAISE EXCEPTION 'Invalid venue ID';
  END IF;

  -- Validate slot exists for venue
  SELECT EXISTS(
    SELECT 1 FROM slots 
    WHERE id = p_slot_id AND venue_id = p_venue_id
  ) INTO slot_exists;
  IF NOT slot_exists THEN
    RAISE EXCEPTION 'Invalid slot ID for venue';
  END IF;

  -- Check availability - only consider confirmed bookings (advance_paid = true)
  RETURN NOT EXISTS (
    SELECT 1 
    FROM bookings 
    WHERE venue_id = p_venue_id 
    AND slot_id = p_slot_id 
    AND booking_date = p_booking_date
    AND advance_paid = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also update the get_available_slots function to be consistent
CREATE OR REPLACE FUNCTION get_available_slots(
  p_venue_id uuid,
  p_date date
) RETURNS TABLE (
  slot_id uuid,
  start_time time,
  end_time time
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.start_time, s.end_time
  FROM slots s
  WHERE s.venue_id = p_venue_id
  AND NOT EXISTS (
    SELECT 1 
    FROM bookings b 
    WHERE b.venue_id = p_venue_id 
    AND b.slot_id = s.id 
    AND b.booking_date = p_date
    AND b.advance_paid = true
  )
  ORDER BY s.start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;