# SQL Migration Scripts

Các file SQL này được sử dụng để setup database schema trên Supabase.

## Thứ tự chạy scripts

Chạy các file SQL theo thứ tự sau trong **Supabase SQL Editor**:

1. **001_create_tables.sql** - Tạo tất cả các tables
2. **002_create_indexes.sql** - Tạo indexes để tăng tốc query
3. **003_enable_rls.sql** - Enable Row Level Security
4. **004_create_rls_policies.sql** - Tạo RLS policies để bảo vệ data
5. **005_create_rpc_functions.sql** - Tạo RPC functions để bypass RLS (QUAN TRỌNG!)

## Cách sử dụng

### Bước 1: Mở Supabase SQL Editor

1. Vào Supabase Dashboard: https://app.supabase.com/
2. Chọn project của bạn
3. Click **SQL Editor** ở sidebar trái
4. Click **New query**

### Bước 2: Chạy từng script

1. Mở file `001_create_tables.sql`
2. Copy toàn bộ nội dung
3. Paste vào SQL Editor
4. Click **Run** hoặc nhấn `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
5. Kiểm tra kết quả (Success/Error)
6. Lặp lại với các file tiếp theo

### Bước 3: Verify

Sau khi chạy xong tất cả scripts:

1. Vào **Table Editor** trong Supabase Dashboard
2. Kiểm tra các tables đã được tạo:
   - ✅ `wallets`
   - ✅ `transactions`
   - ✅ `pack_openings`
   - ✅ `collections`

## Lưu ý quan trọng

### ⚠️ RLS Policies và RPC Functions

Các RLS policies sử dụng `current_setting('app.wallet_address', TRUE)` để xác định user, nhưng điều này không hoạt động tốt với client-side code.

**Giải pháp: Sử dụng RPC Functions**

Chúng ta đã tạo các RPC functions với `SECURITY DEFINER` để bypass RLS một cách an toàn:
- `upsert_wallet()` - Upsert wallet
- `insert_transaction()` - Insert transaction
- `insert_pack_opening()` - Insert pack opening
- `upsert_collection_card()` - Upsert collection card

**Code đã được update để sử dụng RPC functions thay vì direct insert/update.**

Các RPC functions này:
- ✅ Bypass RLS một cách an toàn
- ✅ Validate wallet_address trước khi insert
- ✅ Tự động link với wallet_id
- ✅ Đảm bảo data integrity

### 🔄 Nếu cần chạy lại

Nếu cần xóa và tạo lại tables:

```sql
-- ⚠️ CẢNH BÁO: Xóa tất cả data!
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS pack_openings CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
```

Sau đó chạy lại các scripts từ đầu.

### 📝 Thêm columns sau này

Nếu cần thêm columns vào tables sau này, tạo file mới:

```sql
-- 005_add_new_column.sql
ALTER TABLE wallets ADD COLUMN IF NOT EXISTS new_column TEXT;
```

## Troubleshooting

### Lỗi "relation already exists"
- Table đã được tạo trước đó
- Có thể bỏ qua hoặc dùng `DROP TABLE` để xóa và tạo lại

### Lỗi "permission denied"
- Kiểm tra bạn có quyền admin trong Supabase project
- Đảm bảo đang chạy trong SQL Editor (không phải trong Table Editor)

### Lỗi "function uuid_generate_v4() does not exist"
- Extension chưa được enable
- Chạy: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

## Schema Overview

### Tables

1. **wallets** - Thông tin wallet khi user connect
2. **transactions** - Lịch sử giao dịch khi mua pack
3. **pack_openings** - Lịch sử mở pack và card nhận được
4. **collections** - Collection của user (sync với localStorage)

### Relationships

```
wallets (1) ──→ (many) transactions
wallets (1) ──→ (many) pack_openings
wallets (1) ──→ (many) collections
transactions (1) ──→ (many) pack_openings
```

## Next Steps

Sau khi setup xong database:

1. ✅ Install Supabase client: `npm install @supabase/supabase-js`
2. ✅ Create Supabase client file: `lib/supabase.ts`
3. ✅ Implement services để tương tác với database
4. ✅ Test các tính năng

