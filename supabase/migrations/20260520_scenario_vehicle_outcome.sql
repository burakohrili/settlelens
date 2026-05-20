-- Add vehicle_outcome to scenarios table
-- Run in Supabase Dashboard → SQL Editor

ALTER TABLE scenarios
  ADD COLUMN IF NOT EXISTS vehicle_outcome text
    DEFAULT 'not_applicable'
    CHECK (vehicle_outcome IN ('i_keep','spouse_keeps','sell','not_applicable'));
