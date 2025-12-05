-- ============================================
-- 001: CREATE TABLES
-- ============================================
-- This script creates all necessary tables for the Pokemon TCG collection system
-- Run this script first in Supabase SQL Editor
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: wallets
-- Stores wallet connection information
-- ============================================
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,  -- Solana wallet address (e.g., "ABC123...")
  wallet_name TEXT,                     -- Wallet name (e.g., "Phantom", "Solflare")
  network TEXT DEFAULT 'mainnet-beta',  -- Network: 'mainnet-beta' or 'devnet'
  first_connected_at TIMESTAMP DEFAULT NOW(),
  last_connected_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Table: transactions
-- Stores transaction history when purchasing packs
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,          -- Denormalized for quick access
  transaction_signature TEXT UNIQUE NOT NULL,  -- Solana transaction signature
  pack_id TEXT NOT NULL,                 -- ID of the pack purchased
  pack_name TEXT NOT NULL,               -- Pack name (denormalized)
  amount_sol DECIMAL(18, 9) NOT NULL,    -- Amount in SOL (e.g., 0.1)
  amount_lamports BIGINT NOT NULL,       -- Amount in lamports
  merchant_address TEXT NOT NULL,        -- Merchant wallet address that received payment
  status TEXT DEFAULT 'pending',         -- 'pending', 'confirmed', 'failed'
  network TEXT DEFAULT 'mainnet-beta',   -- Network where transaction occurred
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,               -- When transaction was confirmed
  metadata JSONB,                        -- Additional info (memo, etc.)
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'failed'))
);

-- ============================================
-- Table: pack_openings
-- Stores pack opening history and received cards
-- ============================================
CREATE TABLE IF NOT EXISTS pack_openings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,          -- Denormalized
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,  -- Link to transaction
  pack_id TEXT NOT NULL,                 -- ID of the pack opened
  pack_name TEXT NOT NULL,               -- Pack name
  card_id TEXT NOT NULL,                 -- ID of the card received
  card_name TEXT NOT NULL,               -- Card name (denormalized)
  card_rarity TEXT,                      -- Card rarity (e.g., "◊", "◊◊", "◊◊◊", "◊◊◊◊")
  card_image TEXT,                       -- Card image URL
  opened_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB                         -- Additional card info
);

-- ============================================
-- Table: collections
-- Stores user's card collection
-- ============================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,          -- Denormalized
  card_id TEXT NOT NULL,                 -- ID of the card
  card_name TEXT NOT NULL,               -- Card name
  pack_id TEXT,                          -- Pack that this card belongs to
  obtained_from TEXT,                    -- How card was obtained: 'pack_opening', 'trade', 'gift', etc.
  obtained_at TIMESTAMP DEFAULT NOW(),
  quantity INTEGER DEFAULT 1,            -- Number of copies (if duplicates allowed)
  
  UNIQUE(wallet_id, card_id)             -- Each wallet can only have one record per card
);

-- ============================================
-- Comments for documentation
-- ============================================
COMMENT ON TABLE wallets IS 'Stores wallet connection information when users connect their Solana wallets';
COMMENT ON TABLE transactions IS 'Stores transaction history when users purchase packs';
COMMENT ON TABLE pack_openings IS 'Stores pack opening history and cards received from each pack';
COMMENT ON TABLE collections IS 'Stores user card collections, synced with Supabase and localStorage';

COMMENT ON COLUMN wallets.wallet_address IS 'Solana wallet public key address';
COMMENT ON COLUMN transactions.transaction_signature IS 'Solana transaction signature for verification';
COMMENT ON COLUMN transactions.status IS 'Transaction status: pending (waiting), confirmed (success), failed (error)';
COMMENT ON COLUMN pack_openings.transaction_id IS 'Links pack opening to the transaction that purchased the pack';
COMMENT ON COLUMN collections.obtained_from IS 'Source of the card: pack_opening, trade, gift, etc.';

