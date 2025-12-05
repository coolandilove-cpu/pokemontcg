# Hướng dẫn Setup Solana Mainnet Environment Variables

Hướng dẫn chi tiết cách cấu hình environment variables cho Solana Mainnet.

## 📋 Tổng quan

Để chuyển từ Devnet sang Mainnet, bạn cần cấu hình 3 biến môi trường chính:

1. **NEXT_PUBLIC_SOLANA_NETWORK** - Network (mainnet-beta)
2. **NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS** - Địa chỉ ví merchant (BẮT BUỘC)
3. **NEXT_PUBLIC_SOLANA_RPC_URL** - RPC endpoint (Optional nhưng khuyến nghị)

---

## 🚀 Bước 1: Tạo file .env.local

Nếu chưa có file `.env.local`, tạo từ template:

```bash
# Trong thư mục pokemon-pocket-collection
cp env.local.template .env.local
```

Hoặc tạo file mới `.env.local` trong thư mục `pokemon-pocket-collection`.

---

## 🔧 Bước 2: Cấu hình Environment Variables

Mở file `.env.local` và thêm/cập nhật các biến sau:

### 2.1. Network Configuration (BẮT BUỘC)

```env
# Chuyển từ devnet sang mainnet-beta
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

**Lưu ý:**
- `devnet` - Dùng cho testing
- `mainnet-beta` - Dùng cho production

### 2.2. Merchant Wallet Address (BẮT BUỘC cho Mainnet)

```env
# Thay YOUR_MAINNET_MERCHANT_WALLET_ADDRESS bằng địa chỉ ví thật của bạn
NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=YOUR_MAINNET_MERCHANT_WALLET_ADDRESS
```

**⚠️ QUAN TRỌNG:**
- **PHẢI** là địa chỉ ví Solana thật trên Mainnet
- **KHÔNG** được để placeholder `11111111111111111111111111111111`
- Code sẽ throw error nếu dùng placeholder trên mainnet
- Đây là ví sẽ nhận tiền từ người dùng mua packs

**Cách lấy địa chỉ ví:**
1. Mở Phantom wallet
2. Đảm bảo đang ở Mainnet (không phải Devnet)
3. Copy địa chỉ ví từ Phantom
4. Paste vào `.env.local`

**Ví dụ:**
```env
NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

### 2.3. Custom RPC Endpoint (Optional nhưng khuyến nghị)

```env
# Uncomment và thay YOUR_API_KEY bằng API key của bạn
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
```

**Tại sao nên dùng Custom RPC?**
- Public RPC có rate limit thấp
- Custom RPC (Helius, QuickNode) có rate limit cao hơn
- Tốc độ nhanh hơn và ổn định hơn

**Các nhà cung cấp RPC phổ biến:**

1. **Helius** (Khuyến nghị)
   - Website: https://www.helius.dev/
   - Free tier: 100,000 requests/day
   - Format: `https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY`

2. **QuickNode**
   - Website: https://www.quicknode.com/
   - Free tier: Limited
   - Format: `https://YOUR_ENDPOINT.solana-mainnet.quiknode.pro/YOUR_API_KEY`

3. **Public RPC** (Không khuyến nghị cho production)
   - `https://api.mainnet-beta.solana.com`
   - Rate limit rất thấp, dễ bị block

**Cách setup Helius RPC:**
1. Đăng ký tại https://www.helius.dev/
2. Tạo API key mới
3. Copy API key
4. Thêm vào `.env.local`:
   ```env
   NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY
   ```

---

## 📝 File .env.local hoàn chỉnh cho Mainnet

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# ============================================
# SOLANA CONFIGURATION - MAINNET
# ============================================

# Network: Mainnet for production
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Merchant Wallet Address (BẮT BUỘC - phải là address thật)
NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=YOUR_MAINNET_MERCHANT_WALLET_ADDRESS

# Custom RPC endpoint (khuyến nghị)
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
```

---

## ✅ Bước 3: Kiểm tra cấu hình

### 3.1. Restart Development Server

Sau khi thay đổi `.env.local`, **BẮT BUỘC** phải restart server:

```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại
npm run dev
# hoặc
yarn dev
```

### 3.2. Kiểm tra trong code

Mở browser console và kiểm tra:

```javascript
// Network phải là mainnet-beta
console.log(process.env.NEXT_PUBLIC_SOLANA_NETWORK); // "mainnet-beta"

// Merchant wallet phải là address thật
console.log(process.env.NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS); // Không được là "11111111111111111111111111111111"
```

### 3.3. Kiểm tra trong WalletProvider

Code sẽ tự động đọc từ env variables:

```typescript
// contexts/WalletProvider.tsx
const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK === "devnet" 
  ? WalletAdapterNetwork.Devnet 
  : WalletAdapterNetwork.Mainnet); // Sẽ là Mainnet nếu set mainnet-beta
```

---

## 🧪 Bước 4: Test trên Mainnet

### ⚠️ QUAN TRỌNG: Test với số tiền nhỏ trước!

1. **Kết nối Phantom Wallet**
   - Đảm bảo Phantom đang ở **Mainnet** (không phải Devnet)
   - Settings → Developer Mode → Mainnet

2. **Test mua pack với số tiền nhỏ**
   - Chọn pack rẻ nhất
   - Thực hiện transaction
   - Kiểm tra transaction trên Solscan: https://solscan.io/

3. **Verify transaction**
   - Transaction phải thành công
   - Tiền phải được chuyển đến `MERCHANT_WALLET_ADDRESS`
   - Kiểm tra trên Solscan với transaction signature

---

## 🔍 Troubleshooting

### Lỗi: "Merchant wallet address not configured for mainnet"

**Nguyên nhân:**
- `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` chưa được set
- Hoặc đang dùng placeholder address

**Giải pháp:**
1. Kiểm tra `.env.local` có đúng format không
2. Đảm bảo đã restart server sau khi thay đổi
3. Kiểm tra address không phải là `11111111111111111111111111111111`

### Lỗi: "RPC endpoint rate limit reached"

**Nguyên nhân:**
- Đang dùng public RPC (rate limit thấp)
- Quá nhiều requests

**Giải pháp:**
1. Setup custom RPC (Helius/QuickNode)
2. Thêm `NEXT_PUBLIC_SOLANA_RPC_URL` vào `.env.local`
3. Restart server

### Transaction failed trên mainnet

**Nguyên nhân:**
- Không đủ SOL trong wallet để trả phí transaction
- Network congestion

**Giải pháp:**
1. Đảm bảo wallet có đủ SOL (ít nhất 0.01 SOL cho phí)
2. Thử lại sau vài phút
3. Kiểm tra transaction trên Solscan

---

## 📊 So sánh Devnet vs Mainnet

| Feature | Devnet | Mainnet |
|---------|--------|---------|
| Network | `devnet` | `mainnet-beta` |
| SOL | Free từ faucet | Phải mua thật |
| RPC | Public OK | Nên dùng Custom |
| Merchant Wallet | Optional | **BẮT BUỘC** |
| Transaction Cost | Free | ~0.000005 SOL |
| Use Case | Testing | Production |

---

## 🚀 Deploy lên Vercel/Production

Khi deploy lên Vercel hoặc hosting khác, cần thêm env variables trong dashboard:

### Vercel:
1. Vào Project Settings → Environment Variables
2. Thêm các biến:
   - `NEXT_PUBLIC_SOLANA_NETWORK` = `mainnet-beta`
   - `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` = `YOUR_ADDRESS`
   - `NEXT_PUBLIC_SOLANA_RPC_URL` = `YOUR_RPC_URL` (optional)

3. Redeploy project

---

## ✅ Checklist trước khi deploy Mainnet

- [ ] Đã set `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta`
- [ ] Đã set `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` với address thật
- [ ] Đã setup custom RPC (khuyến nghị)
- [ ] Đã test với số tiền nhỏ trên mainnet
- [ ] Đã verify transaction trên Solscan
- [ ] Merchant wallet có đủ SOL để nhận payments
- [ ] Đã test đầy đủ các tính năng trên devnet trước

---

## 📚 Tài liệu liên quan

- [Production Setup Guide](./PRODUCTION_SETUP.md)
- [Production Readiness Checklist](./PRODUCTION_READINESS_CHECKLIST.md)
- [Payment Flow](./PAYMENT_FLOW.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

---

## 💡 Tips

1. **Luôn test trên Devnet trước** khi chuyển sang Mainnet
2. **Dùng Custom RPC** để tránh rate limit issues
3. **Test với số tiền nhỏ** trước khi chính thức launch
4. **Monitor transactions** trên Solscan để đảm bảo mọi thứ hoạt động đúng
5. **Backup merchant wallet** - Đây là ví nhận tiền, phải bảo mật tốt!

---

**Chúc bạn deploy thành công! 🚀**

