/*
  # Add extra person charges column to bookings table

  1. New Column
    - `extra_person_charges` (integer) - stores calculated extra person charges amount

  2. Changes
    - Add column to existing bookings table
    - Set default value to 0 for existing records
*/

-- Add extra_person_charges column to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS extra_person_charges integer DEFAULT 0;

-- Add comment to describe the column
COMMENT ON COLUMN bookings.extra_person_charges IS 'Extra charges for guests exceeding venue base capacity (₹250 per extra person)';