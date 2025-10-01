/*
  # Add total_amount column to bookings table

  1. New Column
    - `total_amount` (integer) - stores the final calculated total amount from frontend
    
  2. Description
    - This column will store the exact total amount shown to users on the final payment screen
    - Includes venue price + decoration + cakes + add-ons
    - Value is calculated on frontend and passed during booking creation
*/

-- Add total_amount column to bookings table
ALTER TABLE bookings 
ADD COLUMN total_amount integer;

-- Add comment to describe the column
COMMENT ON COLUMN bookings.total_amount IS 'Final calculated total amount shown on payment screen (venue + decoration + cakes + add-ons)';