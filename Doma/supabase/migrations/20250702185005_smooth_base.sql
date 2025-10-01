/*
  # Update venue data for screen sizes and capacities

  1. Changes
    - Update Minimax screen size to 175"
    - Update base_members for all venues to match new capacity requirements
    - Maintain all other venue data unchanged

  2. Updates
    - Couple: base_members = 2 (Maximum 2 people)
    - Lunar: base_members = 8 (For 4 or less, Maximum 8)  
    - Aura: base_members = 12 (For 6 or less, Maximum 12)
    - Minimax: base_members = 20 (For 8 or less, Maximum 20)
*/

-- Update Minimax screen size
UPDATE venues 
SET screen_size = '175" screen with Dolby sound'
WHERE name = 'Minimax';

-- Update base_members for all venues (these are already correct but ensuring consistency)
UPDATE venues SET base_members = 2 WHERE name = 'Couple';
UPDATE venues SET base_members = 8 WHERE name = 'Lunar';
UPDATE venues SET base_members = 12 WHERE name = 'Aura';
UPDATE venues SET base_members = 20 WHERE name = 'Minimax';