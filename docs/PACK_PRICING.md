# Pack Pricing Structure

## Tổng quan

Giá pack đã được chuyển từ **random** sang **cố định** và được phân loại theo độ hiếm của pack.

---

## Cấu trúc giá

### Common/Regular Packs (Gói thường)
**Giá: 0.03 - 0.05 SOL**

| Pack Name | Price (SOL) | Rarity |
|-----------|-------------|--------|
| Triumphant Light | 0.03 | Common |
| Promo A | 0.03 | Common |
| Mythical Island | 0.04 | Common |
| Shining Revelry | 0.04 | Common |
| Genetic Apex Pikachu | 0.05 | Common |

### Rare/Legendary Packs (Gói hiếm)
**Giá: 0.08 - 0.1 SOL**

| Pack Name | Price (SOL) | Rarity |
|-----------|-------------|--------|
| Space-Time Smackdown Palkia | 0.08 | Rare |
| Space-Time Smackdown Dialga | 0.08 | Rare |
| Celestial Guardians Lunala | 0.09 | Rare |
| Celestial Guardians Solgaleo | 0.09 | Rare |
| Genetic Apex Mewtwo | 0.10 | Rare |
| Genetic Apex Charizard | 0.10 | Rare |

---

## Thay đổi so với trước

### ❌ Trước đây (Random):
- Giá random mỗi lần vào trang
- Giá từ 0.01 - 0.09 SOL (random)
- Không phân loại theo độ hiếm

### ✅ Hiện tại (Fixed):
- **Giá cố định** - không thay đổi
- **Phân loại theo độ hiếm:**
  - Common packs: 0.03 - 0.05 SOL
  - Rare packs: 0.08 - 0.1 SOL
- Tất cả giá đều ≤ 0.1 SOL

---

## Cách thay đổi giá

### File: `app/pack-opener/page.tsx`

Tìm array `PACKS` và sửa giá trong object của từng pack:

```typescript
{
  id: "pack-id",
  name: "Pack Name",
  // ... other properties
  price: 0.05, // ← Sửa giá ở đây (SOL)
  rarity: "common", // hoặc "rare"
}
```

### Lưu ý:
- Giá phải ≤ 0.1 SOL
- Giá tính bằng SOL (không phải lamports)
- Giá sẽ được tự động convert sang lamports khi mua

---

## Logic phân loại

### Common Packs (Gói thường):
- Expansion packs thông thường
- Promotional packs
- Starter packs
- **Giá: 0.03 - 0.05 SOL**

### Rare Packs (Gói hiếm):
- Legendary Pokémon packs (Mewtwo, Charizard, etc.)
- Mythical Pokémon packs (Lunala, Solgaleo, etc.)
- Special edition packs
- **Giá: 0.08 - 0.1 SOL**

---

## Ví dụ

### User mua Common Pack:
```
Pack: Triumphant Light
Price: 0.03 SOL
→ User wallet: -0.03 SOL
→ Merchant wallet: +0.03 SOL
```

### User mua Rare Pack:
```
Pack: Genetic Apex Mewtwo
Price: 0.1 SOL
→ User wallet: -0.1 SOL
→ Merchant wallet: +0.1 SOL
```

---

## Tóm tắt

✅ **Giá cố định** - không random
✅ **Phân loại theo độ hiếm** - Common vs Rare
✅ **Tất cả giá ≤ 0.1 SOL**
✅ **Dễ dàng thay đổi** - chỉ cần sửa trong PACKS array









