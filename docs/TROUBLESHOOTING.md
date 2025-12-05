# Troubleshooting Guide

## Lỗi khi mua pack

### 1. Lỗi "Merchant wallet address not configured"

**Nguyên nhân**: Chưa set `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS` trong `.env.local`

**Giải pháp**:
1. Tạo file `.env.local` trong thư mục root (nếu chưa có)
2. Thêm dòng:
   ```env
   NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=YOUR_WALLET_ADDRESS_HERE
   ```
3. Restart development server

**Cho Devnet**:
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

**Cho Mainnet**:
```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=YOUR_MAINNET_WALLET_ADDRESS
```

---

### 2. Lỗi "Wallet not connected"

**Nguyên nhân**: Wallet chưa được kết nối

**Giải pháp**:
1. Click nút "Connect Wallet" ở header
2. Chọn wallet (Phantom, Solflare, etc.)
3. Approve connection
4. Thử lại mua pack

---

### 3. Lỗi "Insufficient SOL balance"

**Nguyên nhân**: Không đủ SOL trong wallet

**Giải pháp**:
1. Kiểm tra balance trong wallet
2. Cần đủ SOL = pack price + transaction fee (~0.00001 SOL)
3. Nạp thêm SOL vào wallet
4. Thử lại

---

### 4. Lỗi "Failed to get latest blockhash"

**Nguyên nhân**: 
- RPC endpoint có vấn đề
- Network connection issue
- Solana network đang bận

**Giải pháp**:
1. Kiểm tra internet connection
2. Thử lại sau vài phút
3. Nếu dùng custom RPC, kiểm tra RPC endpoint
4. Thử refresh trang

---

### 5. Lỗi "Transaction failed"

**Nguyên nhân**: Transaction bị reject hoặc fail trên blockchain

**Giải pháp**:
1. Kiểm tra console log để xem chi tiết lỗi
2. Kiểm tra transaction trên Solscan:
   - Devnet: https://solscan.io/?cluster=devnet
   - Mainnet: https://solscan.io/
3. Xem error message trong transaction details

---

### 6. Lỗi "User rejected" hoặc "User cancelled"

**Nguyên nhân**: User đã cancel transaction trong wallet popup

**Giải pháp**:
- Đây không phải lỗi, chỉ cần thử lại và approve transaction

---

### 7. Lỗi "Wallet adapter error" hoặc "Transaction send error"

**Nguyên nhân**: 
- Network mismatch (wallet ở mainnet nhưng app ở devnet hoặc ngược lại)
- RPC endpoint không hoạt động
- Transaction không hợp lệ
- Wallet không đủ SOL để trả phí

**Triệu chứng**:
- Error trong console: `Wallet adapter error` hoặc `Transaction send error`
- Stack trace từ `StandardWalletAdapter.sendTransaction`

**Giải pháp**:

1. **Kiểm tra Network Match**:
   - Đảm bảo Phantom wallet và app cùng network:
     - Nếu `.env.local` có `NEXT_PUBLIC_SOLANA_NETWORK=devnet` → Phantom phải ở Devnet
     - Nếu `.env.local` có `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta` → Phantom phải ở Mainnet
   - Cách kiểm tra: Mở Phantom → Settings → Developer Mode → Xem network hiện tại

2. **Kiểm tra RPC Endpoint**:
   - Mở Browser DevTools → Network tab
   - Thử mua pack
   - Xem có request nào đến RPC endpoint fail không
   - Nếu dùng custom RPC, kiểm tra API key còn valid không

3. **Kiểm tra SOL Balance**:
   - Wallet cần có đủ SOL = pack price + transaction fee (~0.000005 SOL)
   - Nếu không đủ, nạp thêm SOL

4. **Kiểm tra Console Log**:
   - Mở Browser DevTools → Console
   - Xem error message chi tiết:
     ```javascript
     Transaction send error: {
       error: Error,
       message: "...",
       network: "mainnet-beta",
       recipientAddress: "...",
       amount: 0.1
     }
     ```

5. **Thử lại**:
   - Refresh trang
   - Disconnect và reconnect wallet
   - Thử lại transaction

**Common Error Messages**:

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "User rejected" | User cancelled in wallet | Thử lại và approve |
| "insufficient funds" | Không đủ SOL | Nạp thêm SOL |
| "network" / "Network" | Network/RPC issue | Check network match, RPC endpoint |
| "timeout" / "Timeout" | Transaction timeout | Thử lại sau vài phút |
| "Invalid recipient" | Merchant address không hợp lệ | Check `.env.local` merchant address |

---

## Debug Steps

### Bước 1: Kiểm tra Console Log

Mở Browser DevTools (F12) → Console tab, xem error message chi tiết:

```javascript
// Error sẽ hiển thị như này:
Purchase error: {
  error: Error,
  name: "Error",
  message: "Merchant wallet address not configured...",
  stack: "...",
  packId: "a1-mewtwo",
  price: 0.1,
  walletAddress: "YourWalletAddress..."
}
```

### Bước 2: Kiểm tra Environment Variables

1. Kiểm tra file `.env.local` có tồn tại không
2. Kiểm tra các biến:
   - `NEXT_PUBLIC_SOLANA_NETWORK`
   - `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS`
   - `NEXT_PUBLIC_SUPABASE_URL` (nếu dùng Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (nếu dùng Supabase)

3. Restart development server sau khi sửa `.env.local`

### Bước 3: Kiểm tra Wallet Connection

1. Mở Browser DevTools → Console
2. Kiểm tra có error về wallet connection không
3. Thử disconnect và connect lại wallet

### Bước 4: Kiểm tra Network

1. Mở Browser DevTools → Network tab
2. Thử mua pack
3. Xem có request nào fail không
4. Kiểm tra RPC endpoint có response không

---

## Common Issues

### Issue 1: Environment variables không được load

**Triệu chứng**: Code vẫn dùng giá trị mặc định dù đã set trong `.env.local`

**Giải pháp**:
1. Đảm bảo file tên là `.env.local` (có dấu chấm ở đầu)
2. File phải ở root directory (cùng cấp với `package.json`)
3. Restart development server
4. Clear browser cache

### Issue 2: Transaction bị pending mãi

**Triệu chứng**: Transaction được gửi nhưng không confirm

**Giải pháp**:
1. Kiểm tra network connection
2. Kiểm tra RPC endpoint
3. Thử lại với `skipPreflight: false` (trong code)
4. Kiểm tra transaction trên Solscan

### Issue 3: Pack mua được nhưng không mở được

**Triệu chứng**: Transaction thành công nhưng pack không mở

**Giải pháp**:
1. Kiểm tra console log
2. Kiểm tra Supabase có lưu transaction không
3. Refresh trang và thử lại
4. Kiểm tra pack cards có được load không

---

## Getting Help

Nếu vẫn gặp vấn đề:

1. **Collect thông tin**:
   - Error message từ console
   - Network tab screenshots
   - Environment variables (ẩn sensitive data)
   - Steps to reproduce

2. **Check documentation**:
   - `docs/PRODUCTION_SETUP.md`
   - `docs/SUPABASE_SETUP.md`
   - `docs/DEVNET_PACK_TESTING.md`

3. **Common fixes**:
   - Restart development server
   - Clear browser cache
   - Disconnect và reconnect wallet
   - Check network connection

---

## Error Codes Reference

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Wallet not connected" | Wallet chưa connect | Connect wallet trước |
| "Merchant wallet address not configured" | Chưa set merchant address | Set trong `.env.local` |
| "Insufficient SOL balance" | Không đủ SOL | Nạp thêm SOL |
| "Failed to get latest blockhash" | RPC/Network issue | Thử lại hoặc check RPC |
| "Transaction failed" | Transaction bị reject | Check transaction trên Solscan |
| "User rejected" | User cancel transaction | Thử lại và approve |
| "Wallet adapter error" | Network/RPC/Transaction issue | Check network match, RPC, SOL balance |
| "Transaction send error" | Transaction không gửi được | Check console log, network, RPC endpoint |

