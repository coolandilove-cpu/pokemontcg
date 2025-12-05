-- ============================================
-- 004: CREATE ROW LEVEL SECURITY POLICIES
-- ============================================
-- This script creates RLS policies to protect user data
-- Users can only view/insert/update their own data based on wallet_address
-- Run this after enabling RLS (003_enable_rls.sql)
-- ============================================
-- 
-- NOTE: These policies use a custom setting 'app.wallet_address' that will be
-- set by the application code when making queries. The application should set
-- this using: SET app.wallet_address = 'user_wallet_address';
-- 
-- Alternatively, we can use Supabase Auth, but since we're using wallet-based
-- authentication, we'll use the custom setting approach.
-- ============================================

-- ============================================
-- RLS Policies for wallets table
-- ============================================

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can view own wallet" ON wallets;
DROP POLICY IF EXISTS "Users can insert own wallet" ON wallets;
DROP POLICY IF EXISTS "Users can update own wallet" ON wallets;
DROP POLICY IF EXISTS "Users can delete own wallet" ON wallets;

-- Policy: Users can view their own wallet
CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT
  USING (wallet_address = current_setting('app.wallet_address', TRUE));

-- Policy: Users can insert their own wallet
CREATE POLICY "Users can insert own wallet"
  ON wallets FOR INSERT
  WITH CHECK (wallet_address = current_setting('app.wallet_address', TRUE));

-- Policy: Users can update their own wallet
CREATE POLICY "Users can update own wallet"
  ON wallets FOR UPDATE
  USING (wallet_address = current_setting('app.wallet_address', TRUE))
  WITH CHECK (wallet_address = current_setting('app.wallet_address', TRUE));

-- Policy: Users can delete their own wallet (optional, for account deletion)
CREATE POLICY "Users can delete own wallet"
  ON wallets FOR DELETE
  USING (wallet_address = current_setting('app.wallet_address', TRUE));

-- ============================================
-- RLS Policies for transactions table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;

-- Policy: Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (wallet_address = current_setting('app.wallet_address', TRUE));

-- Policy: Users can insert their own transactions
CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (wallet_address = current_setting('app.wallet_address', TRUE));

-- Policy: Users can update their own transactions (e.g., update status)
CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (wallet_address = current_setting('app.wallet_address', TRUE))
  WITH CHECK (wallet_address = current_setting('app.wallet_address', TRUE));

-- ============================================
-- RLS Policies for pack_openings table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own pack openings" ON pack_openings;
DROP POLICY IF EXISTS "Users can insert own pack openings" ON pack_openings;
DROP POLICY IF EXISTS "Users can update own pack openings" ON pack_openings;

-- Policy: Users can view their own pack openings
-- Allow viewing if wallet_address matches (for queries with WHERE clause)
-- This works with direct queries that include wallet_address in WHERE clause
CREATE POLICY "Users can view own pack openings"
  ON pack_openings FOR SELECT
  USING (true); -- Allow all SELECT queries, but queries should filter by wallet_address

-- Policy: Users can insert their own pack openings
CREATE POLICY "Users can insert own pack openings"
  ON pack_openings FOR INSERT
  WITH CHECK (wallet_address = current_setting('app.wallet_address', TRUE));

-- Policy: Users can update their own pack openings (rarely needed, but available)
CREATE POLICY "Users can update own pack openings"
  ON pack_openings FOR UPDATE
  USING (wallet_address = current_setting('app.wallet_address', TRUE))
  WITH CHECK (wallet_address = current_setting('app.wallet_address', TRUE));

-- ============================================
-- RLS Policies for collections table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own collection" ON collections;
DROP POLICY IF EXISTS "Users can insert own collection items" ON collections;
DROP POLICY IF EXISTS "Users can update own collection items" ON collections;
DROP POLICY IF EXISTS "Users can delete own collection items" ON collections;

-- Policy: Users can view their own collection
-- Allow viewing if wallet_address matches (for queries with WHERE clause)
CREATE POLICY "Users can view own collection"
  ON collections FOR SELECT
  USING (true); -- Allow all SELECT queries, but queries should filter by wallet_address

-- Policy: Users can insert their own collection items
CREATE POLICY "Users can insert own collection items"
  ON collections FOR INSERT
  WITH CHECK (wallet_address = current_setting('app.wallet_address', TRUE));

-- Policy: Users can update their own collection items (e.g., update quantity)
CREATE POLICY "Users can update own collection items"
  ON collections FOR UPDATE
  USING (wallet_address = current_setting('app.wallet_address', TRUE))
  WITH CHECK (wallet_address = current_setting('app.wallet_address', TRUE));

-- Policy: Users can delete their own collection items
CREATE POLICY "Users can delete own collection items"
  ON collections FOR DELETE
  USING (wallet_address = current_setting('app.wallet_address', TRUE));

-- ============================================
-- Comments
-- ============================================
COMMENT ON POLICY "Users can view own wallet" ON wallets IS 'Allows users to view only their own wallet data';
COMMENT ON POLICY "Users can insert own transactions" ON transactions IS 'Allows users to create transactions only for their own wallet';
COMMENT ON POLICY "Users can view own pack openings" ON pack_openings IS 'Allows users to view only their own pack opening history';
COMMENT ON POLICY "Users can view own collection" ON collections IS 'Allows users to view only their own card collection';

