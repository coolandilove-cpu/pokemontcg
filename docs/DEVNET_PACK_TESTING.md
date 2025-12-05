# Hướng dẫn Test Pack Opening trên Devnet

## Vấn đề thường gặp

### 1. Balance không bị trừ khi mua pack (chỉ trừ fee)

**Nguyên nhân:**
- Merchant wallet address trùng với wallet đang dùng để mua
- Khi gửi SOL cho chính mình, balance không thay đổi (chỉ trừ transaction fee)

**Giải pháp:**
- Tạo một merchant wallet riêng trên devnet
- Set `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` trong `.env.local` với address của merchant wallet
- Hoặc dùng default devnet merchant address (đã được cấu hình sẵn trong code)

### 2. Transaction bị revert trong simulation

**Nguyên nhân:**
- Merchant wallet address không hợp lệ
- Transaction simulation fail

**Giải pháp:**
- Code đã được cập nhật với default devnet merchant address
- Transaction sẽ skip preflight để tránh simulation errors

### 2. Cấu hình Devnet

**Bước 1: Cấu hình `.env.local`**

```env
# Chuyển sang Devnet
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Sử dụng Devnet RPC (optional)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Merchant wallet (optional - sẽ dùng default devnet address nếu không set)
# Nếu muốn test với merchant wallet riêng, tạo một wallet mới trên devnet và set address ở đây
# NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=YOUR_DEVNET_MERCHANT_WALLET_ADDRESS
```

**Lưu ý về Merchant Wallet:**
- Nếu không set `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS`, app sẽ dùng một default devnet address
- Để test đúng cách (thấy balance bị trừ), bạn nên:
  1. Tạo một wallet mới trên devnet (khác với wallet đang dùng để mua)
  2. Set address của wallet đó vào `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS`
  3. Request devnet SOL cho cả 2 wallets (wallet mua và merchant wallet)

**Bước 2: Restart server**

```bash
npm run dev
```

**Bước 3: Chuyển Phantom sang Devnet**

1. Mở Phantom
2. Settings → Developer Settings → Enable Testnet Mode
3. Chọn network: Devnet

**Bước 4: Lấy Devnet SOL**

1. Truy cập: https://faucet.solana.com/
2. Paste địa chỉ ví Devnet
3. Click "Airdrop 2 SOL"
4. Lặp lại nếu cần thêm SOL

### 3. Test Pack Purchase

1. Vào trang Pack Opener
2. Chọn pack muốn mua
3. Click "Purchase & Open Pack"
4. Xác nhận transaction trong Phantom
5. Pack sẽ tự động mở sau khi transaction thành công

## Troubleshooting

### Balance không bị trừ khi mua pack?

1. **Kiểm tra merchant address:**
   - Nếu merchant address trùng với wallet đang dùng, bạn đang gửi SOL cho chính mình
   - Tạo một merchant wallet riêng và set `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` trong `.env.local`
   - Hoặc dùng default devnet merchant address (đã được cấu hình sẵn)

2. **Kiểm tra transaction trên Solscan:**
   - Vào https://solscan.io/?cluster=devnet
   - Paste transaction signature
   - Xem "Balance Changes" để kiểm tra SOL có được transfer không

### Transaction vẫn bị revert?

1. **Kiểm tra merchant address:**
   - Code sẽ dùng default devnet address nếu không set merchant address
   - Hoặc set `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` trong `.env.local` với address hợp lệ

2. **Kiểm tra balance:**
   - Đảm bảo có đủ SOL (bao gồm transaction fee ~0.00001 SOL)
   - Devnet SOL có thể request từ faucet

3. **Kiểm tra network:**
   - Đảm bảo Phantom đang ở Devnet
   - Đảm bảo app đang dùng Devnet RPC

4. **Skip preflight:**
   - Code đã set `skipPreflight: true` để tránh simulation errors
   - Nếu vẫn lỗi, có thể do RPC endpoint

### Transaction thành công nhưng pack không mở?

1. Kiểm tra console logs
2. Kiểm tra `purchaseStatus` state
3. Kiểm tra transaction signature trên Solscan Devnet

### Lỗi "Invalid recipient wallet address"?

- Code sẽ tự động dùng chính ví của bạn nếu merchant address không hợp lệ
- Hoặc set merchant address hợp lệ trong `.env.local`

## Lưu ý

⚠️ **QUAN TRỌNG:**

1. **Devnet testing:**
   - Code sẽ dùng default devnet merchant address nếu không set `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS`
   - Để test đúng cách (thấy balance bị trừ), nên tạo merchant wallet riêng
   - Nếu dùng chính wallet của bạn làm merchant, balance sẽ không thay đổi (chỉ trừ fee)

2. **Production:**
   - **BẮT BUỘC** set merchant wallet address thật trong `.env.local`
   - Chuyển về Mainnet
   - Test lại với số tiền nhỏ trước
   - Không được dùng placeholder address trên mainnet

3. **Security:**
   - Không commit `.env.local` lên Git
   - Không chia sẻ merchant wallet private key

