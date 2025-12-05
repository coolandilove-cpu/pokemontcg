# Hướng dẫn lấy API Key cho Solana RPC Endpoint

## Tại sao cần API Key?

Public RPC endpoints của Solana thường có rate limits và có thể bị chặn (403 Forbidden). Sử dụng custom RPC endpoint với API key sẽ:
- Tăng tốc độ và độ tin cậy
- Tránh rate limits
- Có hỗ trợ tốt hơn

## Các dịch vụ RPC phổ biến

### 1. Helius (Khuyến nghị - Miễn phí)

**Bước 1: Đăng ký tài khoản**
1. Truy cập: https://www.helius.dev/
2. Click "Get Started" hoặc "Sign Up"
3. Đăng nhập bằng Google hoặc email

**Bước 2: Tạo API Key**
1. Sau khi đăng nhập, vào Dashboard
2. Click "Create API Key" hoặc "New API Key"
3. Chọn network: **Mainnet** (hoặc Devnet nếu đang test)
4. Đặt tên cho API key (ví dụ: "Pokemon Collection App")
5. Click "Create"
6. Copy API key được tạo

**Bước 3: Sử dụng API Key**
- RPC URL sẽ có dạng: `https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY`
- Hoặc: `https://rpc.helius.xyz/?api-key=YOUR_API_KEY`

**Giới hạn miễn phí:**
- 100,000 requests/ngày
- Đủ cho hầu hết các ứng dụng

---

### 2. QuickNode

**Bước 1: Đăng ký**
1. Truy cập: https://www.quicknode.com/
2. Click "Get Started" hoặc "Sign Up"
3. Đăng nhập bằng email

**Bước 2: Tạo Endpoint**
1. Vào Dashboard
2. Click "Create Endpoint"
3. Chọn blockchain: **Solana**
4. Chọn network: **Mainnet** (hoặc Devnet)
5. Chọn plan: **Free** (hoặc paid nếu cần)
6. Click "Create Endpoint"
7. Copy HTTP URL được tạo (đã bao gồm API key)

**Bước 3: Sử dụng**
- URL sẽ có dạng: `https://your-endpoint.solana-mainnet.quiknode.pro/YOUR_API_KEY/`

**Giới hạn miễn phí:**
- 10 requests/giây
- Đủ cho ứng dụng nhỏ

---

### 3. Alchemy

**Bước 1: Đăng ký**
1. Truy cập: https://www.alchemy.com/
2. Click "Get Started"
3. Đăng nhập bằng email hoặc Google

**Bước 2: Tạo App**
1. Vào Dashboard
2. Click "Create App"
3. Chọn blockchain: **Solana**
4. Chọn network: **Mainnet** (hoặc Devnet)
5. Đặt tên app
6. Click "Create App"

**Bước 3: Lấy API Key**
1. Click vào app vừa tạo
2. Copy "HTTP URL" hoặc "API Key"
3. URL sẽ có dạng: `https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY`

**Giới hạn miễn phí:**
- 300M compute units/tháng
- Đủ cho hầu hết ứng dụng

---

### 4. Solana Foundation Public RPC (Không cần API key)

**URL:**
- Mainnet: `https://api.mainnet-beta.solana.com`
- Devnet: `https://api.devnet.solana.com`

**Lưu ý:**
- Có rate limits nghiêm ngặt
- Có thể bị chặn (403) nếu request quá nhiều
- Không khuyến nghị cho production

---

## Cách cấu hình trong project

### Bước 1: Tạo file `.env.local`

Tạo file `.env.local` trong thư mục root của project (cùng cấp với `package.json`):

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY_HERE
```

**Lưu ý:** Thay `YOUR_API_KEY_HERE` bằng API key thực tế của bạn.

### Bước 2: Restart development server

Sau khi thêm biến môi trường, restart server:

```bash
# Dừng server (Ctrl+C)
# Sau đó chạy lại
npm run dev
```

### Bước 3: Kiểm tra

Mở trang Transaction History trong dashboard, nếu không còn lỗi 403 thì đã cấu hình thành công.

---

## Ví dụ cấu hình

### Helius:
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=abc123-def456-ghi789
```

### QuickNode:
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-endpoint.solana-mainnet.quiknode.pro/abc123def456/
```

### Alchemy:
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/abc123def456
```

---

## Bảo mật

⚠️ **QUAN TRỌNG:**
- **KHÔNG** commit file `.env.local` lên Git
- File `.env.local` đã được thêm vào `.gitignore` tự động
- **KHÔNG** chia sẻ API key công khai
- Nếu API key bị lộ, hãy revoke và tạo key mới ngay lập tức

---

## Troubleshooting

### Vẫn gặp lỗi 403?
1. Kiểm tra API key có đúng không
2. Kiểm tra network (Mainnet vs Devnet)
3. Kiểm tra rate limits của dịch vụ
4. Thử tạo API key mới

### Lỗi "Invalid API key"?
1. Kiểm tra URL có đúng format không
2. Đảm bảo API key không có khoảng trắng
3. Kiểm tra API key còn active không

### Cần hỗ trợ?
- Helius: https://docs.helius.dev/
- QuickNode: https://www.quicknode.com/docs
- Alchemy: https://docs.alchemy.com/

