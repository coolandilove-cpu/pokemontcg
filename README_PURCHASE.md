# Pack Purchase System

## Overview
Hệ thống mua pack sử dụng Solana blockchain để xử lý thanh toán. Người dùng có thể mua pack bằng SOL và nhận được pack sau khi thanh toán thành công.

## Setup

### 1. Cấu hình Merchant Wallet

Tạo file `.env.local` trong thư mục root:
```env
NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=YOUR_WALLET_ADDRESS_HERE
```

Hoặc sửa trực tiếp trong `config/wallet.ts`:
```typescript
export const MERCHANT_WALLET_ADDRESS = "YOUR_WALLET_ADDRESS_HERE";
```

**⚠️ QUAN TRỌNG:** 
- KHÔNG sử dụng placeholder address trong production
- Đảm bảo merchant wallet có đủ SOL để nhận payments
- Lưu private key an toàn

### 2. Network Configuration

Để test trên Devnet, sửa trong `contexts/WalletProvider.tsx`:
```typescript
const network = WalletAdapterNetwork.Devnet; // Thay vì Mainnet
```

## Flow

1. **User connects wallet** → Wallet button ở góc phải màn hình
2. **User selects pack** → Chọn pack từ danh sách
3. **User clicks "Purchase & Open Pack"** → Hiển thị giá và button purchase
4. **Transaction confirmation** → User xác nhận transaction trong wallet (Phantom, etc.)
5. **Transaction processing** → Hiển thị "Processing payment..."
6. **Transaction confirmed** → Hiển thị "Purchase successful! Opening pack..."
7. **Pack opens automatically** → Animation mở pack và hiển thị card nhận được

## Transaction Details

### Memo Instruction
Mỗi transaction có memo instruction để track purchase:
```
Purchase Pack: {packId}
```

### Transfer Instruction
SOL được transfer từ user wallet đến merchant wallet:
- Amount: `price * 1_000_000_000` lamports (1 SOL = 1B lamports)
- From: User's connected wallet
- To: Merchant wallet address

## Pack Prices

| Pack | Price (SOL) |
|------|-------------|
| Mythical Island | 0.1 |
| Genetic Apex Mewtwo | 0.15 |
| Celestial Guardians Lunala | 0.12 |
| Space-Time Smackdown Palkia | 0.12 |
| Genetic Apex Pikachu | 0.15 |
| Shining Revelry | 0.1 |
| Celestial Guardians Solgaleo | 0.12 |
| Triumphant Light | 0.1 |
| Space-Time Smackdown Dialga | 0.12 |
| Genetic Apex Charizard | 0.15 |
| Promo A | 0.08 |

## Error Handling

- **Wallet not connected**: Hiển thị alert yêu cầu connect wallet
- **Invalid price**: Validate price > 0
- **Transaction failed**: Hiển thị error message từ blockchain
- **Network errors**: Console log và hiển thị user-friendly error

## Security Considerations

1. **Never expose private keys** - Chỉ dùng public addresses
2. **Validate all inputs** - Price, addresses, etc.
3. **Use environment variables** - Không hardcode sensitive data
4. **Test on Devnet first** - Trước khi deploy lên Mainnet
5. **Monitor transactions** - Track successful purchases

## Testing

### Test trên Devnet:
1. Đổi network sang Devnet trong `WalletProvider.tsx`
2. Get Devnet SOL từ faucet: https://faucet.solana.com/
3. Test purchase flow
4. Verify transaction trên Solana Explorer (Devnet)

### Test trên Mainnet:
1. Đảm bảo merchant wallet address đã được set đúng
2. Test với số lượng SOL nhỏ trước
3. Monitor transactions trên Solana Explorer

## Troubleshooting

### Transaction fails:
- Kiểm tra user có đủ SOL (bao gồm transaction fee)
- Kiểm tra network connection
- Kiểm tra merchant wallet address hợp lệ

### Pack không mở sau purchase:
- Kiểm tra transaction signature
- Kiểm tra `purchasedPacks` state
- Kiểm tra console logs

### Wallet không connect:
- Kiểm tra Phantom extension đã cài đặt
- Kiểm tra network trong Phantom (Mainnet/Devnet)
- Clear cache và reload











