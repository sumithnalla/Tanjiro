/*
  # Security Enhancements for Bookings

  1. Enhanced RLS Policies
    - More restrictive read access for authenticated users
    - Validated insert policy with input checks

  2. Data Validation Functions
    - Secure booking creation function
    - Enhanced slot availability checks

  3. Audit Logging
    - Booking audit log table for security monitoring

  4. Data Integrity
    - Validation constraints for new data only
    - Preserve existing data while enforcing rules for new entries
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable insert for public" ON bookings;

-- Create more restrictive policies
CREATE POLICY "Allow authenticated users to read bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public insert with validation"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (
    -- Validate email format
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND length(email) <= 100
    -- Validate phone number format (10 digits)
    AND whatsapp ~ '^[0-9]{10}$'
    -- Validate booking name length
    AND length(trim(booking_name)) >= 2 
    AND length(trim(booking_name)) <= 50
    -- Validate persons count
    AND persons >= 1 
    AND persons <= 20
    -- Validate booking date is in future
    AND booking_date >= CURRENT_DATE
    AND booking_date <= CURRENT_DATE + INTERVAL '1 year'
  );

-- Create validation functions for data integrity
CREATE OR REPLACE FUNCTION validate_email_format(email_input text) 
RETURNS boolean AS $$
BEGIN
  RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
    AND length(email_input) <= 100;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION validate_phone_format(phone_input text) 
RETURNS boolean AS $$
BEGIN
  RETURN phone_input ~ '^[0-9]{10}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION validate_booking_name(name_input text) 
RETURNS boolean AS $$
BEGIN
  RETURN length(trim(name_input)) >= 2 AND length(trim(name_input)) <= 50;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS booking_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  action text NOT NULL,
  user_ip inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE booking_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role to manage audit logs"
  ON booking_audit_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Enhanced slot availability function with security checks
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

  -- Check availability
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

-- Function to create secure booking with validation
CREATE OR REPLACE FUNCTION create_secure_booking(
  p_venue_id uuid,
  p_slot_id uuid,
  p_booking_date date,
  p_booking_name text,
  p_persons integer,
  p_whatsapp text,
  p_email text,
  p_decoration boolean DEFAULT false,
  p_event_type text DEFAULT NULL,
  p_cake_selection text DEFAULT NULL,
  p_selected_addons text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  booking_id uuid;
BEGIN
  -- Validate inputs using validation functions
  IF NOT validate_email_format(p_email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  IF NOT validate_phone_format(p_whatsapp) THEN
    RAISE EXCEPTION 'Invalid phone format - must be 10 digits';
  END IF;

  IF NOT validate_booking_name(p_booking_name) THEN
    RAISE EXCEPTION 'Invalid booking name - must be 2-50 characters';
  END IF;

  IF p_persons < 1 OR p_persons > 20 THEN
    RAISE EXCEPTION 'Invalid person count - must be 1-20';
  END IF;

  IF p_booking_date < CURRENT_DATE OR p_booking_date > CURRENT_DATE + INTERVAL '1 year' THEN
    RAISE EXCEPTION 'Invalid booking date - must be future date within 1 year';
  END IF;

  -- Check slot availability
  IF NOT is_slot_available(p_venue_id, p_slot_id, p_booking_date) THEN
    RAISE EXCEPTION 'Slot is not available';
  END IF;

  -- Insert booking
  INSERT INTO bookings (
    venue_id, slot_id, booking_date, booking_name, persons,
    whatsapp, email, decoration, event_type, cake_selection, selected_addons
  ) VALUES (
    p_venue_id, p_slot_id, p_booking_date, p_booking_name, p_persons,
    p_whatsapp, p_email, p_decoration, p_event_type, p_cake_selection, p_selected_addons
  ) RETURNING id INTO booking_id;

  -- Log the action
  INSERT INTO booking_audit_log (booking_id, action)
  VALUES (booking_id, 'BOOKING_CREATED');

  RETURN booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to validate new bookings
CREATE OR REPLACE FUNCTION validate_booking_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Only validate new inserts, not existing data
  IF TG_OP = 'INSERT' THEN
    IF NOT validate_email_format(NEW.email) THEN
      RAISE EXCEPTION 'Invalid email format';
    END IF;

    IF NOT validate_phone_format(NEW.whatsapp) THEN
      RAISE EXCEPTION 'Invalid phone format - must be 10 digits';
    END IF;

    IF NOT validate_booking_name(NEW.booking_name) THEN
      RAISE EXCEPTION 'Invalid booking name - must be 2-50 characters';
    END IF;

    IF NEW.persons < 1 OR NEW.persons > 20 THEN
      RAISE EXCEPTION 'Invalid person count - must be 1-20';
    END IF;

    IF NEW.booking_date < CURRENT_DATE OR NEW.booking_date > CURRENT_DATE + INTERVAL '1 year' THEN
      RAISE EXCEPTION 'Invalid booking date - must be future date within 1 year';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking validation (only for new inserts)
DROP TRIGGER IF EXISTS validate_booking_data ON bookings;
CREATE TRIGGER validate_booking_data
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_trigger();

-- Function to clean and validate existing data (optional, can be run manually)
CREATE OR REPLACE FUNCTION clean_existing_booking_data()
RETURNS void AS $$
BEGIN
  -- Update any invalid phone numbers to a default format (this is optional)
  -- You can run this manually if needed to clean existing data
  UPDATE bookings 
  SET whatsapp = regexp_replace(whatsapp, '[^0-9]', '', 'g')
  WHERE whatsapp !~ '^[0-9]{10}$' AND length(regexp_replace(whatsapp, '[^0-9]', '', 'g')) = 10;
  
  -- Log the cleanup action
  INSERT INTO booking_audit_log (action)
  VALUES ('DATA_CLEANUP_PERFORMED');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;