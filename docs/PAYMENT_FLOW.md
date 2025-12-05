# Flow Thanh Toán - Pack Purchase

## Tóm tắt ngắn gọn

✅ **Đúng vậy!** Khi user mua pack:
1. **Tiền bị trừ** từ ví của user
2. **Tiền được chuyển đến** `MERCHANT_WALLET_ADDRESS` (ví mainnet mà bạn thêm vào)
3. Đây chính là ví của bạn (merchant/owner website) để nhận tiền

---

## Flow chi tiết

### Bước 1: User mua pack

```
User clicks "Purchase & Open Pack"
    ↓
User xác nhận transaction trong Phantom wallet
    ↓
Transaction được gửi lên Solana blockchain
```

### Bước 2: Transaction được xử lý

**Trong code (`hooks/usePurchasePack.ts`):**

```typescript
// Dòng 43: Lấy merchant wallet address
let recipientAddressToUse = recipientAddress || MERCHANT_WALLET_ADDRESS;

// Dòng 92-96: Tạo transfer instruction
const transferInstruction = SystemProgram.transfer({
  fromPubkey: publicKey,        // ← Ví của USER (người mua)
  toPubkey: recipientPubkey,    // ← Ví MERCHANT (bạn - người nhận tiền)
  lamports: lamports,           // ← Số tiền (pack price)
});
```

### Bước 3: SOL được chuyển

```
┌─────────────────┐         ┌──────────────────┐
│  User Wallet    │  SOL    │ Merchant Wallet  │
│  (Người mua)    │ ──────→ │  (Bạn - Owner)   │
│                 │         │                  │
│  Balance: -0.1  │         │  Balance: +0.1    │
│  SOL            │         │  SOL             │
└─────────────────┘         └──────────────────┘
```

**Ví dụ cụ thể:**
- Pack giá: **0.1 SOL**
- User wallet: `ABC123...` (ví của người mua)
- Merchant wallet: `XYZ789...` (ví của bạn - set trong `.env.local`)

**Kết quả:**
- User wallet `ABC123...` bị trừ: **0.1 SOL**
- Merchant wallet `XYZ789...` nhận được: **0.1 SOL**
- Transaction fee: **~0.00001 SOL** (user trả)

---

## Cấu hình Merchant Wallet

### File `.env.local`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=YOUR_MAINNET_WALLET_ADDRESS_HERE
```

**Ví dụ:**
```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

### Địa chỉ này là gì?

- **Đây là ví của BẠN** (merchant/owner của website)
- **Đây là ví NHẬN TIỀN** từ tất cả users mua pack
- **Bạn có quyền kiểm soát** ví này (có private key/seed phrase)

---

## Ví dụ thực tế

### Scenario: User mua pack "Mythical Island" giá 0.1 SOL

**Trước khi mua:**
- User wallet: `5.0 SOL`
- Merchant wallet (của bạn): `10.0 SOL`

**User click "Purchase & Open Pack":**
1. Phantom hiển thị popup xác nhận
2. User approve transaction
3. Transaction được gửi lên Solana mainnet

**Sau khi transaction thành công:**
- User wallet: `4.9 SOL` (bị trừ 0.1 SOL + fee)
- Merchant wallet (của bạn): `10.1 SOL` (nhận 0.1 SOL)
- Pack tự động mở, card được thêm vào collection

---

## Kiểm tra thanh toán

### 1. Trên Solscan

1. Vào https://solscan.io/
2. Paste transaction signature
3. Xem tab "Balance Changes":
   ```
   From: User Wallet Address
   To:   Merchant Wallet Address (của bạn)
   Amount: 0.1 SOL
   ```

### 2. Trong Merchant Wallet

1. Mở merchant wallet (Phantom, Solflare, etc.)
2. Xem transaction history
3. Sẽ thấy transaction nhận SOL từ user

### 3. Trong Code

Transaction signature được lưu trong `purchaseStatus.signature`:
```typescript
const result = await purchasePack({
  packId: selectedPack,
  price: pack.price || 0.1,
});

// result.signature chứa transaction signature
// Có thể dùng để verify trên Solscan
```

---

## Lưu ý quan trọng

### ✅ Đúng

- **Merchant wallet là ví của bạn** - bạn nhận được tất cả tiền từ users
- **Tiền được chuyển trực tiếp** từ user wallet → merchant wallet
- **Không qua trung gian** - peer-to-peer trên blockchain
- **Bạn có full control** - có thể withdraw bất cứ lúc nào

### ⚠️ Cần lưu ý

1. **Bảo mật merchant wallet:**
   - Đây là ví nhận tiền từ users
   - Phải bảo mật tuyệt đối
   - Không chia sẻ private key/seed phrase
   - Cân nhắc dùng hardware wallet cho số tiền lớn

2. **Transaction fees:**
   - User trả transaction fee (~0.00001 SOL)
   - Merchant wallet không cần trả fee để nhận tiền
   - Fee rất nhỏ, không đáng kể

3. **Tax & Legal:**
   - Tiền nhận được có thể phải khai báo thuế
   - Consult với accountant/legal team
   - Có thể cần KYC/AML cho số tiền lớn

---

## Tóm tắt

**Câu trả lời cho câu hỏi của bạn:**

> Sau khi thêm ví mainnet, người dùng bỏ tiền ra mua packs, thì tiền sẽ trừ của họ sau đó ai là người nhận được số tiền đó? Có phải ví mainnet của tôi thêm vào không?

✅ **Đúng vậy!**

1. ✅ Tiền **bị trừ** từ ví của user
2. ✅ Tiền **được chuyển đến** `MERCHANT_WALLET_ADDRESS` (ví mainnet của bạn)
3. ✅ Đây chính là ví mà bạn set trong `.env.local` với key `NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS`

**Flow:**
```
User Wallet → [Transaction] → Merchant Wallet (của bạn)
   -0.1 SOL                      +0.1 SOL
```

**Bạn là người nhận được tất cả tiền từ users mua pack!** 💰









