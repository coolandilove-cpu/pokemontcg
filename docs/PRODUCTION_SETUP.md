# Hướng dẫn Setup Production (Mainnet)

## Tóm tắt

✅ **Việc không trừ balance trên devnet KHÔNG ảnh hưởng tính năng:**
- Pack vẫn mở được bình thường
- Card vẫn được thêm vào collection
- Tất cả tính năng hoạt động đúng
- Chỉ khác là SOL không thực sự được chuyển đi (vì gửi cho chính mình)

✅ **Có thể chuyển sang mainnet để thương mại:**
- Code đã sẵn sàng cho production
- Chỉ cần cấu hình đúng merchant wallet và network

---

## Bước 1: Chuẩn bị Merchant Wallet cho Mainnet

### 1.1. Tạo Merchant Wallet mới (QUAN TRỌNG)

**⚠️ KHÔNG dùng wallet cá nhân làm merchant wallet!**

1. Tạo một Solana wallet mới hoàn toàn riêng biệt (Phantom, Solflare, etc.)
2. Đây sẽ là wallet nhận tiền từ users
3. **Lưu private key/seed phrase an toàn** - nếu mất thì mất hết tiền!
4. Copy địa chỉ wallet (public key)

### 1.2. Merchant Wallet SOL (KHÔNG CẦN)

**⚠️ QUAN TRỌNG**: Merchant wallet **KHÔNG CẦN** nạp SOL trước!

- Merchant wallet chỉ **NHẬN** tiền từ users
- User sẽ trả transaction fee (không phải merchant)
- Merchant wallet có thể bắt đầu với **0 SOL** và vẫn nhận tiền bình thường
- Chỉ cần nạp SOL vào merchant wallet nếu bạn muốn:
  - Rút tiền ra
  - Chuyển tiền đi nơi khác
  - Hoặc các mục đích khác (KHÔNG liên quan đến việc nhận payments)

---

## Bước 2: Cấu hình Environment Variables

Tạo/sửa file `.env.local` trong thư mục root:

```env
# ============================================
# PRODUCTION CONFIGURATION (MAINNET)
# ============================================

# Network: Mainnet
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Merchant Wallet Address (BẮT BUỘC - phải là address thật)
NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=YOUR_MAINNET_MERCHANT_WALLET_ADDRESS_HERE

# Optional: Custom RPC endpoint (khuyến nghị dùng Helius, QuickNode, etc.)
# NEXT_PUBLIC_SOLANA_RPC_URL=https://your-rpc-endpoint.com
```

**⚠️ QUAN TRỌNG:**
- `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` **BẮT BUỘC** phải là address thật
- Không được để placeholder `11111111111111111111111111111111`
- Code sẽ throw error nếu dùng placeholder trên mainnet

---

## Bước 3: Cập nhật WalletProvider

Kiểm tra `contexts/WalletProvider.tsx` - đảm bảo network được set đúng:

```typescript
// Code đã tự động đọc từ env variable
const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK === "devnet" 
  ? WalletAdapterNetwork.Devnet 
  : WalletAdapterNetwork.Mainnet);
```

Nếu đã set `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta` trong `.env.local`, code sẽ tự động dùng Mainnet.

---

## Bước 4: Test trên Mainnet với số tiền nhỏ

**⚠️ QUAN TRỌNG: Test trước khi launch!**

1. **Test với số tiền nhỏ:**
   - Set pack price thấp (ví dụ: 0.01 SOL)
   - Mua 1 pack để test
   - Kiểm tra:
     - ✅ Transaction thành công
     - ✅ SOL được chuyển đến merchant wallet
     - ✅ Pack mở được
     - ✅ Card được thêm vào collection

2. **Kiểm tra transaction trên Solscan:**
   - Vào https://solscan.io/
   - Paste transaction signature
   - Xem "Balance Changes" để confirm SOL đã được transfer

3. **Kiểm tra merchant wallet:**
   - Mở merchant wallet
   - Xác nhận đã nhận được SOL từ transaction

---

## Bước 5: Security Checklist

Trước khi launch production:

- [ ] Merchant wallet address đã được set đúng
- [ ] Private key/seed phrase của merchant wallet đã được lưu an toàn
- [ ] **Note**: Merchant wallet KHÔNG CẦN nạp SOL trước (chỉ nhận tiền, user trả fee)
- [ ] Đã test với số tiền nhỏ trên mainnet
- [ ] `.env.local` không được commit lên Git (đã có trong `.gitignore`)
- [ ] RPC endpoint đã được cấu hình (nếu dùng custom RPC)
- [ ] Đã review lại pack prices
- [ ] Đã test tất cả các packs

---

## Bước 6: Deploy

1. **Build project:**
   ```bash
   npm run build
   ```

2. **Deploy lên hosting (Vercel, etc.):**
   - Set environment variables trên hosting platform
   - Không commit `.env.local` lên Git
   - Set các biến môi trường trực tiếp trên hosting

3. **Verify sau khi deploy:**
   - Test lại pack purchase
   - Kiểm tra transaction trên Solscan
   - Kiểm tra merchant wallet nhận được SOL

---

## Troubleshooting

### Lỗi "Merchant wallet address not configured for mainnet"

**Nguyên nhân:** Chưa set `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` hoặc đang dùng placeholder

**Giải pháp:**
- Set `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` trong `.env.local` với address thật
- Restart server

### Transaction failed trên mainnet

**Nguyên nhân có thể:**
- User không đủ SOL (bao gồm cả fee)
- RPC endpoint có vấn đề
- Network congestion

**Giải pháp:**
- Kiểm tra user có đủ SOL
- Thử lại sau vài phút
- Kiểm tra RPC endpoint

### SOL không được chuyển đến merchant wallet

**Nguyên nhân:**
- Merchant address sai
- Transaction bị revert

**Giải pháp:**
- Kiểm tra merchant address trên Solscan
- Xem transaction details để tìm lỗi

---

## Lưu ý quan trọng

1. **Merchant Wallet Security:**
   - Đây là wallet nhận tiền từ users
   - Phải bảo mật tuyệt đối
   - Không chia sẻ private key
   - Cân nhắc dùng hardware wallet cho số tiền lớn

2. **Transaction Fees:**
   - User sẽ trả transaction fee (~0.00001 SOL)
   - Merchant wallet KHÔNG cần SOL để nhận tiền (chỉ nhận, không ký transaction)

3. **Monitoring:**
   - Theo dõi merchant wallet balance
   - Monitor transactions trên Solscan
   - Set up alerts nếu cần

4. **Legal & Compliance:**
   - Đảm bảo tuân thủ quy định pháp luật
   - Có thể cần KYC/AML cho số tiền lớn
   - Consult với legal team nếu cần

---

## Tóm tắt

✅ **Devnet (hiện tại):**
- Không trừ balance (gửi cho chính mình) → **KHÔNG ảnh hưởng tính năng**
- Pack vẫn mở được, card vẫn được thêm vào collection
- Phù hợp cho development và testing

✅ **Mainnet (production):**
- Chỉ cần set merchant wallet address thật
- Set network = mainnet-beta
- Code đã sẵn sàng, không cần sửa gì thêm
- Test với số tiền nhỏ trước khi launch

**Code đã được thiết kế để dễ dàng chuyển từ devnet sang mainnet!** 🚀








