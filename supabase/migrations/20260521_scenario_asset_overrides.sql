-- Per-asset scenario overrides
-- Replaces single-category house_outcome/vehicle_outcome/business_outcome with per-asset control
-- Covers real_estate, vehicle, business; financial assets (bank/retirement/crypto) still use retirement_split_me %

CREATE TABLE IF NOT EXISTS scenario_asset_overrides (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id  uuid REFERENCES scenarios(id) ON DELETE CASCADE NOT NULL,
  asset_id     uuid REFERENCES assets(id)    ON DELETE CASCADE NOT NULL,
  outcome      text NOT NULL DEFAULT 'not_decided'
               CHECK (outcome IN ('i_keep','spouse_keeps','sell','split','not_decided')),
  split_pct_me numeric(5,2) DEFAULT 50 CHECK (split_pct_me BETWEEN 0 AND 100),
  UNIQUE(scenario_id, asset_id)
);

ALTER TABLE scenario_asset_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_overrides" ON scenario_asset_overrides
  FOR ALL
  USING  (EXISTS (SELECT 1 FROM scenarios s WHERE s.id = scenario_id AND s.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM scenarios s WHERE s.id = scenario_id AND s.user_id = auth.uid()));
