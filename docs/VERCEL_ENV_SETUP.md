# Hướng dẫn Setup Environment Variables trên Vercel

## ⚠️ Vấn đề

Khi deploy lên Vercel (production), file `.env.local` **KHÔNG** được sử dụng. Bạn **PHẢI** thêm environment variables trong Vercel dashboard.

---

## 🚀 Cách thêm Environment Variables trên Vercel

### Bước 1: Truy cập Vercel Dashboard

1. Đăng nhập vào https://vercel.com
2. Chọn project của bạn (pokemontcg)
3. Click vào **Settings** (ở thanh menu trên cùng)

### Bước 2: Vào Environment Variables

1. Trong Settings, click vào **Environment Variables** (menu bên trái)
2. Bạn sẽ thấy danh sách các environment variables hiện có

### Bước 3: Thêm các biến cần thiết

Click **Add New** và thêm từng biến sau:

#### 1. Solana Network
- **Name**: `NEXT_PUBLIC_SOLANA_NETWORK`
- **Value**: `mainnet-beta`
- **Environment**: Chọn tất cả (Production, Preview, Development)

#### 2. Merchant Wallet Address
- **Name**: `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS`
- **Value**: `6DtEedWf9Wk5hA7Xth82Eq441yf5DA4aGLqaQAVfDokm` (địa chỉ của bạn)
- **Environment**: Chọn tất cả (Production, Preview, Development)

#### 3. Solana RPC URL (Optional nhưng khuyến nghị)
- **Name**: `NEXT_PUBLIC_SOLANA_RPC_URL`
- **Value**: `https://mainnet.helius-rpc.com/?api-key=3f616627-d905-4269-901f-e4a928ae91de` (API key của bạn)
- **Environment**: Chọn tất cả (Production, Preview, Development)

#### 4. Supabase URL (Nếu chưa có)
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://sbwgcpdtxupmazthimad.supabase.co`
- **Environment**: Chọn tất cả

#### 5. Supabase Anon Key (Nếu chưa có)
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNid2djcGR0eHVwbWF6dGhpbWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzA4OTYsImV4cCI6MjA4MDQ0Njg5Nn0.JxcrffhxWoTOA7q3GArp5yA8sWXZoBadv3YA4X8Hrh0`
- **Environment**: Chọn tất cả

### Bước 4: Redeploy

Sau khi thêm tất cả environment variables:

1. Click **Save** cho mỗi biến
2. Vào tab **Deployments** (menu trên cùng)
3. Click vào 3 chấm (⋯) của deployment mới nhất
4. Chọn **Redeploy**
5. Hoặc tạo deployment mới bằng cách push code lên GitHub

---

## 📋 Checklist Environment Variables trên Vercel

Đảm bảo bạn đã thêm:

- [ ] `NEXT_PUBLIC_SOLANA_NETWORK` = `mainnet-beta`
- [ ] `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` = `6DtEedWf9Wk5hA7Xth82Eq441yf5DA4aGLqaQAVfDokm`
- [ ] `NEXT_PUBLIC_SOLANA_RPC_URL` = `https://mainnet.helius-rpc.com/?api-key=...`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://sbwgcpdtxupmazthimad.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🔍 Cách kiểm tra Environment Variables đã được set

### Trên Vercel Dashboard:
1. Vào **Settings** → **Environment Variables**
2. Xem danh sách các biến đã thêm
3. Đảm bảo tất cả biến có giá trị đúng

### Trong Build Logs:
1. Vào **Deployments** → Chọn deployment mới nhất
2. Xem **Build Logs**
3. Kiểm tra xem có lỗi về missing environment variables không

### Trong Browser Console (Sau khi deploy):
1. Mở website trên production
2. Mở Browser DevTools (F12) → Console
3. Chạy lệnh:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_SOLANA_NETWORK);
   console.log(process.env.NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS);
   ```
4. Kiểm tra giá trị có đúng không

---

## ⚠️ Lưu ý quan trọng

1. **`.env.local` chỉ hoạt động trên localhost**
   - File này không được commit lên Git
   - Không được sử dụng trên production

2. **Environment Variables trên Vercel là bắt buộc**
   - Phải thêm trong Vercel dashboard
   - Sau khi thêm, phải redeploy

3. **Sau khi thêm/sửa Environment Variables**
   - **BẮT BUỘC** phải redeploy
   - Vercel sẽ tự động rebuild với env variables mới

4. **Kiểm tra Environment**
   - Đảm bảo chọn đúng environment (Production, Preview, Development)
   - Nên chọn tất cả để đảm bảo hoạt động ở mọi môi trường

---

## 🐛 Troubleshooting

### Lỗi: "Merchant wallet address not configured for mainnet"

**Nguyên nhân:**
- Environment variables chưa được thêm trên Vercel
- Hoặc đã thêm nhưng chưa redeploy

**Giải pháp:**
1. Kiểm tra Vercel dashboard → Settings → Environment Variables
2. Đảm bảo `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` đã được thêm
3. Redeploy project
4. Đợi deployment hoàn tất

### Environment Variables không được load

**Nguyên nhân:**
- Chưa redeploy sau khi thêm env variables
- Tên biến sai (phải bắt đầu với `NEXT_PUBLIC_`)

**Giải pháp:**
1. Kiểm tra tên biến có đúng không (case-sensitive)
2. Redeploy project
3. Clear browser cache và thử lại

---

## 📸 Hướng dẫn bằng hình ảnh

### Bước 1: Vào Settings
```
Vercel Dashboard → [Your Project] → Settings
```

### Bước 2: Click Environment Variables
```
Settings → Environment Variables (menu bên trái)
```

### Bước 3: Add New
```
Click "Add New" button
```

### Bước 4: Điền thông tin
```
Name: NEXT_PUBLIC_SOLANA_NETWORK
Value: mainnet-beta
Environment: ☑ Production ☑ Preview ☑ Development
```

### Bước 5: Save và Redeploy
```
Click "Save" → Vào Deployments → Redeploy
```

---

## ✅ Sau khi setup xong

1. **Redeploy** project trên Vercel
2. **Đợi** deployment hoàn tất (2-5 phút)
3. **Kiểm tra** website trên production domain
4. **Test** mua pack với giá 0.01 SOL

---

**Lưu ý:** File `.env.local` chỉ dùng cho development local. Trên production, bạn **PHẢI** thêm environment variables trong Vercel dashboard!

