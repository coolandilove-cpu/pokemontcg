# Hướng dẫn Setup SSH Key cho GitHub

## Bước 1: SSH Key đã được tạo ✅

SSH key đã được tạo tại: `C:\Users\my pc\.ssh\id_ed25519`

## Bước 2: Copy Public Key

Public key đã được hiển thị ở trên. Copy toàn bộ dòng (bắt đầu với `ssh-ed25519...`)

## Bước 3: Add SSH Key vào GitHub

1. **Truy cập**: https://github.com/settings/keys
2. **Click**: "New SSH key" (màu xanh lá)
3. **Điền thông tin**:
   - **Title**: "My PC" hoặc "Windows PC" (tên bạn muốn)
   - **Key type**: Authentication Key
   - **Key**: Paste public key đã copy (dòng bắt đầu với `ssh-ed25519...`)
4. **Click**: "Add SSH key"
5. **Xác nhận** password GitHub nếu được hỏi

## Bước 4: Test SSH Connection

Sau khi add key, chạy lệnh này để test:

```bash
ssh -T git@github.com
```

**Kết quả mong đợi:**
```
Hi coolandilove-cpu! You've successfully authenticated, but GitHub does not provide shell access.
```

Nếu thấy thông báo này là OK! ✅

## Bước 5: Đổi Remote sang SSH

```bash
cd "D:\tcg pokemon\pokemon-pocket-collection"
git remote set-url origin git@github.com:coolandilove-cpu/pokemontcg.git
```

## Bước 6: Push Code

```bash
git push -u origin master
```

Nếu repository dùng branch `main`:
```bash
git branch -M main
git push -u origin main
```

---

## Troubleshooting

### Lỗi "Permission denied (publickey)"

- Kiểm tra SSH key đã được add vào GitHub chưa
- Kiểm tra public key có đúng không
- Thử test lại: `ssh -T git@github.com`

### Lỗi "Could not resolve hostname"

- Kiểm tra internet connection
- Thử ping: `ping github.com`

### Lỗi "Connection timed out"

- Có thể firewall block port 22
- Thử dùng HTTPS thay vì SSH

---

## Sau khi Push thành công

1. Truy cập: https://github.com/coolandilove-cpu/pokemontcg
2. Kiểm tra code đã được push
3. Tiếp tục với deployment!

