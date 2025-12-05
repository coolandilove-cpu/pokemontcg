-- ============================================
-- 003: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
-- This script enables Row Level Security on all tables
-- RLS ensures users can only access their own data
-- Run this after creating tables (001_create_tables.sql)
-- ============================================

-- Enable RLS on wallets table
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Enable RLS on transactions table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on pack_openings table
ALTER TABLE pack_openings ENABLE ROW LEVEL SECURITY;

-- Enable RLS on collections table
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Comments
-- ============================================
COMMENT ON TABLE wallets IS 'RLS enabled: Users can only access their own wallet data';
COMMENT ON TABLE transactions IS 'RLS enabled: Users can only access their own transaction history';
COMMENT ON TABLE pack_openings IS 'RLS enabled: Users can only access their own pack opening history';
COMMENT ON TABLE collections IS 'RLS enabled: Users can only access their own collection';

