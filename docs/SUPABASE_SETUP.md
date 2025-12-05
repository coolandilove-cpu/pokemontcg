# Hướng dẫn Setup Supabase

## Bước 1: Tạo Supabase Project

1. Truy cập: https://app.supabase.com/
2. Đăng nhập hoặc đăng ký tài khoản
3. Click "New Project"
4. Điền thông tin:
   - **Name**: Tên project (ví dụ: `pokemon-tcg-dex`)
   - **Database Password**: Tạo password mạnh (lưu lại!)
   - **Region**: Chọn region gần nhất
   - **Pricing Plan**: Free tier đủ cho development
5. Click "Create new project"
6. Đợi project được tạo (2-3 phút)

---

## Bước 2: Lấy API Keys

1. Vào project vừa tạo
2. Click **Settings** (icon bánh răng) ở sidebar trái
3. Click **API** trong menu Settings
4. Copy các giá trị sau:

### Project URL
- Tìm **Project URL**
- Copy giá trị (ví dụ: `https://abcdefghijklmnop.supabase.co`)
- Đây là `NEXT_PUBLIC_SUPABASE_URL`

### Anon/Public Key
- Tìm **Project API keys** → **anon public**
- Click **Reveal** để hiện key
- Copy key (bắt đầu với `eyJ...`)
- Đây là `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Service Role Key (Optional - chỉ dùng cho server-side)
- Tìm **service_role** key
- ⚠️ **CẢNH BÁO**: Key này có quyền admin, không expose ra client-side!
- Chỉ dùng cho server-side operations

---

## Bước 3: Tạo file `.env.local`

Tạo file `.env.local` trong thư mục root của project (cùng cấp với `package.json`):

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service Role Key (for server-side operations, use with caution)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ============================================
# SOLANA CONFIGURATION
# ============================================

# Network: 'mainnet-beta' for production, 'devnet' for testing
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Merchant Wallet Address (BẮT BUỘC cho mainnet)
# For devnet: có thể dùng default hoặc wallet của bạn
# For mainnet: PHẢI là address thật, không được để placeholder
NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM

# Optional: Custom RPC endpoint (khuyến nghị dùng Helius, QuickNode, etc.)
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
# For mainnet: NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY

# ============================================
# FIREBASE CONFIGURATION (Optional - Legacy)
# ============================================
# Firebase config có thể giữ lại nếu vẫn cần dùng
# Hoặc comment lại nếu đã chuyển hoàn toàn sang Supabase

# NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
# NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Lưu ý:**
- Thay `https://your-project-id.supabase.co` bằng Project URL thực tế
- Thay `your-anon-key-here` bằng anon key thực tế
- File `.env.local` đã được gitignore, không lo lộ thông tin

---

## Bước 4: Restart Development Server

Sau khi tạo/sửa file `.env.local`:

```bash
# Dừng server (Ctrl+C)
# Sau đó chạy lại
npm run dev
```

---

## Bước 5: Verify Setup

Sau khi code được implement, bạn có thể test:

1. Connect wallet → Kiểm tra data được lưu vào Supabase
2. Mở pack → Kiểm tra transaction và pack opening được lưu
3. Xem collection → Kiểm tra data được load từ Supabase

---

## Troubleshooting

### Lỗi "Invalid API key"
- Kiểm tra `NEXT_PUBLIC_SUPABASE_ANON_KEY` có đúng không
- Đảm bảo không có khoảng trắng thừa
- Copy lại key từ Supabase dashboard

### Lỗi "Failed to fetch"
- Kiểm tra `NEXT_PUBLIC_SUPABASE_URL` có đúng không
- Đảm bảo URL bắt đầu với `https://`
- Kiểm tra network connection

### Environment variables không được load
- Đảm bảo file tên là `.env.local` (có dấu chấm ở đầu)
- Restart development server
- Kiểm tra file có trong root directory (cùng cấp với `package.json`)

---

## Security Notes

⚠️ **QUAN TRỌNG:**
- **KHÔNG** commit file `.env.local` lên Git
- File đã được thêm vào `.gitignore` tự động
- **KHÔNG** chia sẻ API keys công khai
- Nếu key bị lộ, hãy regenerate key mới trong Supabase dashboard
- `NEXT_PUBLIC_*` variables sẽ được expose ra client-side (OK cho anon key)
- `SUPABASE_SERVICE_ROLE_KEY` **KHÔNG** được expose ra client-side!

---

## Next Steps

Sau khi setup xong:
1. ✅ Tạo database schema (chạy SQL trong Supabase SQL Editor)
2. ✅ Install Supabase client library
3. ✅ Implement services để tương tác với Supabase
4. ✅ Test các tính năng

Xem thêm: [Database Schema Setup](./SUPABASE_DATABASE_SETUP.md) (sẽ được tạo sau)

