# Hướng dẫn Test với Phantom Devnet

## Tổng quan

Devnet là mạng test của Solana, cho phép bạn test các tính năng mà không cần dùng SOL thật. Đây là cách setup để test tính năng open packs.

---

## Bước 1: Chuyển WalletProvider sang Devnet

### Cách 1: Sửa trực tiếp trong code (Tạm thời cho testing)

Mở file `contexts/WalletProvider.tsx` và thay đổi:

```typescript
// Từ:
const network = WalletAdapterNetwork.Mainnet;

// Thành:
const network = WalletAdapterNetwork.Devnet;
```

### Cách 2: Sử dụng biến môi trường (Khuyến nghị)

Thêm vào file `.env.local`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

Sau đó cập nhật `WalletProvider.tsx` để đọc từ biến môi trường.

---

## Bước 2: Cấu hình RPC Endpoint cho Devnet

Thêm vào file `.env.local`:

```env
# Devnet RPC (có thể dùng public hoặc custom)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Hoặc dùng Helius Devnet (nếu có API key)
# NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY
```

---

## Bước 3: Kết nối Phantom Wallet với Devnet

### 3.1. Mở Phantom Wallet Extension

1. Click vào icon Phantom trong browser
2. Click vào Settings (biểu tượng bánh răng)
3. Scroll xuống phần "Developer Settings"
4. Bật "Testnet Mode" hoặc "Developer Mode"

### 3.2. Chuyển sang Devnet Network

1. Trong Phantom, click vào network selector (thường hiển thị "Mainnet")
2. Chọn "Devnet"
3. Wallet sẽ tự động chuyển sang Devnet

**Lưu ý:** Devnet có địa chỉ ví khác với Mainnet, đây là bình thường.

---

## Bước 4: Lấy Devnet SOL (Faucet)

Devnet SOL không có giá trị thật, bạn có thể lấy miễn phí từ faucet:

### Cách 1: Sử dụng Solana Faucet (Khuyến nghị)

1. Truy cập: https://faucet.solana.com/
2. Paste địa chỉ ví Devnet của bạn
3. Click "Airdrop 2 SOL"
4. Đợi vài giây, SOL sẽ được thêm vào ví

### Cách 2: Sử dụng SolFaucet

1. Truy cập: https://solfaucet.com/
2. Chọn "Devnet"
3. Paste địa chỉ ví
4. Click "Request Airdrop"

### Cách 3: Sử dụng Command Line (nếu có Solana CLI)

```bash
solana airdrop 2 YOUR_DEVNET_WALLET_ADDRESS --url devnet
```

### Cách 4: Sử dụng Phantom Wallet

1. Mở Phantom
2. Click vào địa chỉ ví ở trên cùng
3. Click "Request Airdrop" (nếu có)
4. Hoặc vào Settings → Developer Settings → Request Airdrop

---

## Bước 5: Test Tính năng Open Packs

### 5.1. Kết nối Wallet

1. Mở ứng dụng
2. Click "Connect Wallet" hoặc "Select Wallet"
3. Chọn Phantom
4. Xác nhận kết nối trong Phantom popup

### 5.2. Mua Pack (nếu có tính năng purchase)

1. Vào trang Pack Opener
2. Chọn pack muốn mua
3. Click "Purchase & Open Pack"
4. Xác nhận transaction trong Phantom
5. Transaction sẽ được xử lý trên Devnet (miễn phí, không tốn SOL thật)

### 5.3. Open Pack

1. Sau khi mua thành công, pack sẽ tự động mở
2. Hoặc click "Open Pack" nếu đã có pack
3. Xem animation và card nhận được

---

## Bước 6: Kiểm tra Transactions

1. Vào Dashboard → Trade History
2. Xem transaction history trên Devnet
3. Click vào transaction để xem trên Solscan Devnet: https://solscan.io/?cluster=devnet

---

## Troubleshooting

### Wallet không kết nối được?

- Đảm bảo Phantom đã chuyển sang Devnet
- Đảm bảo ứng dụng đã được cấu hình cho Devnet
- Thử disconnect và connect lại

### Không có SOL để test?

- Request airdrop từ faucet (Bước 4)
- Đảm bảo đang dùng địa chỉ ví Devnet (khác với Mainnet)

### Transaction bị lỗi?

- Kiểm tra có đủ Devnet SOL không
- Kiểm tra RPC endpoint có đúng không
- Xem console log để biết lỗi chi tiết

### Không thấy pack sau khi mua?

- Kiểm tra transaction có thành công không
- Refresh trang
- Kiểm tra localStorage (DevTools → Application → Local Storage)

---

## Lưu ý quan trọng

⚠️ **QUAN TRỌNG:**

1. **Devnet và Mainnet là riêng biệt:**
   - Địa chỉ ví khác nhau
   - SOL không thể chuyển giữa 2 mạng
   - Transactions không liên quan

2. **Devnet có thể bị reset:**
   - Devnet đôi khi bị reset, mất dữ liệu
   - Chỉ dùng để test, không lưu dữ liệu quan trọng

3. **Trước khi deploy production:**
   - Nhớ chuyển lại về Mainnet
   - Kiểm tra lại tất cả cấu hình
   - Test lại trên Mainnet với số tiền nhỏ

---

## Chuyển lại về Mainnet

Sau khi test xong, nhớ:

1. Chuyển WalletProvider về Mainnet:
   ```typescript
   const network = WalletAdapterNetwork.Mainnet;
   ```

2. Cập nhật RPC endpoint trong `.env.local`:
   ```env
   NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
   ```

3. Chuyển Phantom về Mainnet trong Settings

---

## Tài nguyên hữu ích

- Solana Devnet Explorer: https://explorer.solana.com/?cluster=devnet
- Solana Faucet: https://faucet.solana.com/
- Solscan Devnet: https://solscan.io/?cluster=devnet
- Solana Docs: https://docs.solana.com/clusters

