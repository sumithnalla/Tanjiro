/*
  # Add booking selection columns

  1. New Columns
    - `event_type` (text) - stores selected event type
    - `cake_selection` (text) - stores cake selection details
    - `selected_addons` (text) - stores comma-separated list of selected add-ons

  2. Changes
    - Add three new columns to existing bookings table
    - Maintain all existing data and constraints
*/

DO $$
BEGIN
  -- Add event_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'event_type'
  ) THEN
    ALTER TABLE bookings ADD COLUMN event_type text;
  END IF;

  -- Add cake_selection column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'cake_selection'
  ) THEN
    ALTER TABLE bookings ADD COLUMN cake_selection text;
  END IF;

  -- Add selected_addons column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'selected_addons'
  ) THEN
    ALTER TABLE bookings ADD COLUMN selected_addons text;
  END IF;
END $$;