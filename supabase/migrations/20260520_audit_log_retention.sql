-- audit_log retention: enforce the 2-year policy stated in the privacy policy.
-- Entries with user_id IS NOT NULL are set to null at account deletion,
-- so this cleanup removes all entries (both anonymized and system) older than 2 years.
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs() RETURNS void AS $$
BEGIN
  DELETE FROM audit_log WHERE created_at < now() - interval '2 years';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule daily at 04:00 UTC (after expire-plans 02:00 and hard-delete 03:00)
SELECT cron.schedule(
  'cleanup-audit-log',
  '0 4 * * *',
  'SELECT cleanup_old_audit_logs()'
);
