-- webhook_events: idempotency store for Paddle webhook delivery
-- event_id is a PRIMARY KEY — Postgres returns error 23505 on duplicate INSERT,
-- which the webhook handler uses to detect and skip replays.
CREATE TABLE IF NOT EXISTS webhook_events (
  event_id   text PRIMARY KEY,
  event_type text NOT NULL,
  outcome    text NOT NULL DEFAULT 'processed',
  created_at timestamptz DEFAULT now()
);

-- Index to support the 90-day retention cleanup
CREATE INDEX IF NOT EXISTS webhook_events_created_idx ON webhook_events (created_at);

-- Retention cleanup function (scheduled below — delete entries older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_webhook_events() RETURNS void AS $$
BEGIN
  DELETE FROM webhook_events WHERE created_at < now() - interval '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule daily at 05:00 UTC (requires pg_cron extension — enabled by default on Supabase)
SELECT cron.schedule(
  'cleanup-webhook-events',
  '0 5 * * *',
  'SELECT cleanup_old_webhook_events()'
);
