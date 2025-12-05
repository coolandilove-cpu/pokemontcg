-- ============================================
-- 002: CREATE INDEXES
-- ============================================
-- This script creates indexes for better query performance
-- Run this after creating tables (001_create_tables.sql)
-- ============================================

-- ============================================
-- Indexes for wallets table
-- ============================================
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallets_active ON wallets(is_active);
CREATE INDEX IF NOT EXISTS idx_wallets_network ON wallets(network);
CREATE INDEX IF NOT EXISTS idx_wallets_last_connected ON wallets(last_connected_at DESC);

-- ============================================
-- Indexes for transactions table
-- ============================================
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_address ON transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_signature ON transactions(transaction_signature);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_pack_id ON transactions(pack_id);
CREATE INDEX IF NOT EXISTS idx_transactions_network ON transactions(network);

-- Composite index for common query: get transactions by wallet and status
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_status ON transactions(wallet_address, status, created_at DESC);

-- ============================================
-- Indexes for pack_openings table
-- ============================================
CREATE INDEX IF NOT EXISTS idx_pack_openings_wallet_id ON pack_openings(wallet_id);
CREATE INDEX IF NOT EXISTS idx_pack_openings_wallet_address ON pack_openings(wallet_address);
CREATE INDEX IF NOT EXISTS idx_pack_openings_transaction_id ON pack_openings(transaction_id);
CREATE INDEX IF NOT EXISTS idx_pack_openings_pack_id ON pack_openings(pack_id);
CREATE INDEX IF NOT EXISTS idx_pack_openings_card_id ON pack_openings(card_id);
CREATE INDEX IF NOT EXISTS idx_pack_openings_opened_at ON pack_openings(opened_at DESC);

-- Composite index for common query: get pack openings by wallet and pack
CREATE INDEX IF NOT EXISTS idx_pack_openings_wallet_pack ON pack_openings(wallet_address, pack_id, opened_at DESC);

-- ============================================
-- Indexes for collections table
-- ============================================
CREATE INDEX IF NOT EXISTS idx_collections_wallet_id ON collections(wallet_id);
CREATE INDEX IF NOT EXISTS idx_collections_wallet_address ON collections(wallet_address);
CREATE INDEX IF NOT EXISTS idx_collections_card_id ON collections(card_id);
CREATE INDEX IF NOT EXISTS idx_collections_pack_id ON collections(pack_id);
CREATE INDEX IF NOT EXISTS idx_collections_obtained_at ON collections(obtained_at DESC);

-- Composite index for common query: get collection by wallet
CREATE INDEX IF NOT EXISTS idx_collections_wallet_obtained ON collections(wallet_address, obtained_at DESC);

-- ============================================
-- Comments
-- ============================================
COMMENT ON INDEX idx_wallets_address IS 'Fast lookup by wallet address';
COMMENT ON INDEX idx_transactions_wallet_status IS 'Fast query for user transactions filtered by status';
COMMENT ON INDEX idx_pack_openings_wallet_pack IS 'Fast query for pack opening history by wallet and pack';
COMMENT ON INDEX idx_collections_wallet_obtained IS 'Fast query for user collection sorted by obtained date';

