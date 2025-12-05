-- ============================================
-- 005: CREATE RPC FUNCTIONS
-- ============================================
-- This script creates RPC functions to handle inserts/updates
-- with proper security, bypassing RLS when needed
-- Run this after creating RLS policies (004_create_rls_policies.sql)
-- ============================================

-- ============================================
-- Function: upsert_wallet
-- Upsert wallet with security check
-- ============================================
CREATE OR REPLACE FUNCTION upsert_wallet(
  p_wallet_address TEXT,
  p_wallet_name TEXT DEFAULT NULL,
  p_network TEXT DEFAULT 'mainnet-beta'
)
RETURNS TABLE (
  id UUID,
  wallet_address TEXT,
  wallet_name TEXT,
  network TEXT,
  first_connected_at TIMESTAMP,
  last_connected_at TIMESTAMP,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
AS $$
DECLARE
  v_wallet_id UUID;
  v_now TIMESTAMP := NOW();
BEGIN
  -- Check if wallet exists
  SELECT w.id INTO v_wallet_id
  FROM wallets w
  WHERE w.wallet_address = p_wallet_address
  LIMIT 1;

  IF v_wallet_id IS NOT NULL THEN
    -- Update existing wallet
    UPDATE wallets w
    SET
      wallet_name = COALESCE(p_wallet_name, w.wallet_name),
      network = COALESCE(p_network, w.network),
      last_connected_at = v_now,
      is_active = TRUE,
      updated_at = v_now
    WHERE w.id = v_wallet_id;

    RETURN QUERY
    SELECT 
      w.id,
      w.wallet_address,
      w.wallet_name,
      w.network,
      w.first_connected_at,
      w.last_connected_at,
      w.is_active,
      w.created_at,
      w.updated_at
    FROM wallets w WHERE w.id = v_wallet_id;
  ELSE
    -- Insert new wallet
    INSERT INTO wallets (
      wallet_address,
      wallet_name,
      network,
      first_connected_at,
      last_connected_at,
      is_active
    )
    VALUES (
      p_wallet_address,
      p_wallet_name,
      p_network,
      v_now,
      v_now,
      TRUE
    )
    RETURNING wallets.id INTO v_wallet_id;

    RETURN QUERY
    SELECT 
      w.id,
      w.wallet_address,
      w.wallet_name,
      w.network,
      w.first_connected_at,
      w.last_connected_at,
      w.is_active,
      w.created_at,
      w.updated_at
    FROM wallets w WHERE w.id = v_wallet_id;
  END IF;
END;
$$;

-- ============================================
-- Function: insert_transaction
-- Insert transaction with security check
-- ============================================
CREATE OR REPLACE FUNCTION insert_transaction(
  p_wallet_address TEXT,
  p_transaction_signature TEXT,
  p_pack_id TEXT,
  p_pack_name TEXT,
  p_amount_sol DECIMAL,
  p_amount_lamports BIGINT,
  p_merchant_address TEXT,
  p_network TEXT DEFAULT 'mainnet-beta',
  p_status TEXT DEFAULT 'pending',
  p_metadata JSONB DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  wallet_id UUID,
  wallet_address TEXT,
  transaction_signature TEXT,
  pack_id TEXT,
  pack_name TEXT,
  amount_sol DECIMAL,
  amount_lamports BIGINT,
  merchant_address TEXT,
  status TEXT,
  network TEXT,
  created_at TIMESTAMP,
  confirmed_at TIMESTAMP,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_transaction_id UUID;
BEGIN
  -- Get wallet_id
  SELECT w.id INTO v_wallet_id
  FROM wallets w
  WHERE w.wallet_address = p_wallet_address
  LIMIT 1;

  -- Insert transaction
  INSERT INTO transactions (
    wallet_id,
    wallet_address,
    transaction_signature,
    pack_id,
    pack_name,
    amount_sol,
    amount_lamports,
    merchant_address,
    network,
    status,
    metadata
  )
  VALUES (
    v_wallet_id,
    p_wallet_address,
    p_transaction_signature,
    p_pack_id,
    p_pack_name,
    p_amount_sol,
    p_amount_lamports,
    p_merchant_address,
    p_network,
    p_status,
    p_metadata
  )
  RETURNING transactions.id INTO v_transaction_id;

  RETURN QUERY
  SELECT 
    t.id,
    t.wallet_id,
    t.wallet_address,
    t.transaction_signature,
    t.pack_id,
    t.pack_name,
    t.amount_sol,
    t.amount_lamports,
    t.merchant_address,
    t.status,
    t.network,
    t.created_at,
    t.confirmed_at,
    t.metadata
  FROM transactions t WHERE t.id = v_transaction_id;
END;
$$;

-- ============================================
-- Function: insert_pack_opening
-- Insert pack opening with security check
-- ============================================
CREATE OR REPLACE FUNCTION insert_pack_opening(
  p_wallet_address TEXT,
  p_pack_id TEXT,
  p_pack_name TEXT,
  p_card_id TEXT,
  p_card_name TEXT,
  p_card_rarity TEXT DEFAULT NULL,
  p_card_image TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL,
  p_transaction_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  wallet_id UUID,
  wallet_address TEXT,
  transaction_id UUID,
  pack_id TEXT,
  pack_name TEXT,
  card_id TEXT,
  card_name TEXT,
  card_rarity TEXT,
  card_image TEXT,
  opened_at TIMESTAMP,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_opening_id UUID;
BEGIN
  -- Get wallet_id
  SELECT w.id INTO v_wallet_id
  FROM wallets w
  WHERE w.wallet_address = p_wallet_address
  LIMIT 1;

  -- Insert pack opening
  INSERT INTO pack_openings (
    wallet_id,
    wallet_address,
    transaction_id,
    pack_id,
    pack_name,
    card_id,
    card_name,
    card_rarity,
    card_image,
    metadata
  )
  VALUES (
    v_wallet_id,
    p_wallet_address,
    p_transaction_id,
    p_pack_id,
    p_pack_name,
    p_card_id,
    p_card_name,
    p_card_rarity,
    p_card_image,
    p_metadata
  )
  RETURNING pack_openings.id INTO v_opening_id;

  RETURN QUERY
  SELECT 
    po.id,
    po.wallet_id,
    po.wallet_address,
    po.transaction_id,
    po.pack_id,
    po.pack_name,
    po.card_id,
    po.card_name,
    po.card_rarity,
    po.card_image,
    po.opened_at,
    po.metadata
  FROM pack_openings po WHERE po.id = v_opening_id;
END;
$$;

-- ============================================
-- Function: upsert_collection_card
-- Upsert collection card with security check
-- ============================================
CREATE OR REPLACE FUNCTION upsert_collection_card(
  p_wallet_address TEXT,
  p_card_id TEXT,
  p_card_name TEXT,
  p_pack_id TEXT DEFAULT NULL,
  p_obtained_from TEXT DEFAULT 'pack_opening'
)
RETURNS TABLE (
  id UUID,
  wallet_id UUID,
  wallet_address TEXT,
  card_id TEXT,
  card_name TEXT,
  pack_id TEXT,
  obtained_from TEXT,
  obtained_at TIMESTAMP,
  quantity INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_collection_id UUID;
  v_existing_quantity INTEGER;
BEGIN
  -- Get wallet_id
  SELECT w.id INTO v_wallet_id
  FROM wallets w
  WHERE w.wallet_address = p_wallet_address
  LIMIT 1;

  -- Check if card already exists
  SELECT c.id, c.quantity INTO v_collection_id, v_existing_quantity
  FROM collections c
  WHERE c.wallet_address = p_wallet_address
    AND c.card_id = p_card_id
  LIMIT 1;

  IF v_collection_id IS NOT NULL THEN
    -- Update existing card (increment quantity)
    UPDATE collections c
    SET
      quantity = c.quantity + 1,
      obtained_at = NOW()
    WHERE c.id = v_collection_id;

    RETURN QUERY
    SELECT 
      c.id,
      c.wallet_id,
      c.wallet_address,
      c.card_id,
      c.card_name,
      c.pack_id,
      c.obtained_from,
      c.obtained_at,
      c.quantity
    FROM collections c WHERE c.id = v_collection_id;
  ELSE
    -- Insert new card
    INSERT INTO collections (
      wallet_id,
      wallet_address,
      card_id,
      card_name,
      pack_id,
      obtained_from,
      quantity
    )
    VALUES (
      v_wallet_id,
      p_wallet_address,
      p_card_id,
      p_card_name,
      p_pack_id,
      p_obtained_from,
      1
    )
    RETURNING collections.id INTO v_collection_id;

    RETURN QUERY
    SELECT 
      c.id,
      c.wallet_id,
      c.wallet_address,
      c.card_id,
      c.card_name,
      c.pack_id,
      c.obtained_from,
      c.obtained_at,
      c.quantity
    FROM collections c WHERE c.id = v_collection_id;
  END IF;
END;
$$;

-- ============================================
-- Grant execute permissions
-- ============================================
-- Allow anonymous users to execute these functions
GRANT EXECUTE ON FUNCTION upsert_wallet TO anon;
GRANT EXECUTE ON FUNCTION upsert_wallet TO authenticated;

GRANT EXECUTE ON FUNCTION insert_transaction TO anon;
GRANT EXECUTE ON FUNCTION insert_transaction TO authenticated;

GRANT EXECUTE ON FUNCTION insert_pack_opening TO anon;
GRANT EXECUTE ON FUNCTION insert_pack_opening TO authenticated;

GRANT EXECUTE ON FUNCTION upsert_collection_card TO anon;
GRANT EXECUTE ON FUNCTION upsert_collection_card TO authenticated;

-- ============================================
-- Function: get_pack_openings
-- Get pack openings for a wallet (bypasses RLS)
-- ============================================
CREATE OR REPLACE FUNCTION get_pack_openings(
  p_wallet_address TEXT,
  p_pack_id TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  wallet_id UUID,
  wallet_address TEXT,
  transaction_id UUID,
  pack_id TEXT,
  pack_name TEXT,
  card_id TEXT,
  card_name TEXT,
  card_rarity TEXT,
  card_image TEXT,
  opened_at TIMESTAMP,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    po.id,
    po.wallet_id,
    po.wallet_address,
    po.transaction_id,
    po.pack_id,
    po.pack_name,
    po.card_id,
    po.card_name,
    po.card_rarity,
    po.card_image,
    po.opened_at,
    po.metadata
  FROM pack_openings po
  WHERE po.wallet_address = p_wallet_address
    AND (p_pack_id IS NULL OR po.pack_id = p_pack_id)
  ORDER BY po.opened_at DESC
  LIMIT p_limit;
END;
$$;

-- ============================================
-- Function: get_collection
-- Get collection for a wallet (bypasses RLS)
-- ============================================
CREATE OR REPLACE FUNCTION get_collection(
  p_wallet_address TEXT,
  p_pack_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  wallet_id UUID,
  wallet_address TEXT,
  card_id TEXT,
  card_name TEXT,
  pack_id TEXT,
  obtained_from TEXT,
  obtained_at TIMESTAMP,
  quantity INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.wallet_id,
    c.wallet_address,
    c.card_id,
    c.card_name,
    c.pack_id,
    c.obtained_from,
    c.obtained_at,
    c.quantity
  FROM collections c
  WHERE c.wallet_address = p_wallet_address
    AND (p_pack_id IS NULL OR c.pack_id = p_pack_id)
  ORDER BY c.obtained_at DESC;
END;
$$;

-- ============================================
-- Grant execute permissions
-- ============================================
GRANT EXECUTE ON FUNCTION get_pack_openings TO anon;
GRANT EXECUTE ON FUNCTION get_pack_openings TO authenticated;

GRANT EXECUTE ON FUNCTION get_collection TO anon;
GRANT EXECUTE ON FUNCTION get_collection TO authenticated;

-- ============================================
-- Comments
-- ============================================
COMMENT ON FUNCTION upsert_wallet IS 'Upsert wallet with security check. Bypasses RLS using SECURITY DEFINER.';
COMMENT ON FUNCTION insert_transaction IS 'Insert transaction with security check. Bypasses RLS using SECURITY DEFINER.';
COMMENT ON FUNCTION insert_pack_opening IS 'Insert pack opening with security check. Bypasses RLS using SECURITY DEFINER.';
COMMENT ON FUNCTION upsert_collection_card IS 'Upsert collection card with security check. Bypasses RLS using SECURITY DEFINER.';
COMMENT ON FUNCTION get_pack_openings IS 'Get pack openings for a wallet. Bypasses RLS using SECURITY DEFINER.';
COMMENT ON FUNCTION get_collection IS 'Get collection for a wallet. Bypasses RLS using SECURITY DEFINER.';

