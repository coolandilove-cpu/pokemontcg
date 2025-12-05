# Hướng dẫn Push Code lên GitHub

## Lỗi Permission Denied

Nếu gặp lỗi `Permission denied` khi push, bạn cần authenticate với GitHub account của mình.

## Giải pháp 1: Dùng Personal Access Token (Khuyến nghị)

### Bước 1: Tạo Personal Access Token

1. Vào GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Đặt tên token: `pokemon-tcg-deploy` (hoặc tên bạn muốn)
4. Chọn scopes: **repo** (full control)
5. Click **"Generate token"**
6. **Copy token ngay** (chỉ hiện 1 lần!)

### Bước 2: Push với Token

Chạy lệnh sau (thay YOUR_TOKEN bằng token bạn vừa copy):

```bash
cd "D:\tcg pokemon\pokemon-pocket-collection"
git push https://YOUR_TOKEN@github.com/coolandilove-cpu/pokemontcg.git master
```

**Hoặc** set token trong URL:

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/coolandilove-cpu/pokemontcg.git
git push -u origin master
```

⚠️ **Lưu ý**: Token sẽ được lưu trong git config. Nếu muốn bảo mật hơn, dùng SSH key.

---

## Giải pháp 2: Setup SSH Key (Bảo mật hơn)

### Bước 1: Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Nhấn Enter để dùng default location
# Nhấn Enter để không đặt passphrase (hoặc đặt nếu muốn)
```

### Bước 2: Copy Public Key

```bash
cat ~/.ssh/id_ed25519.pub
# Copy toàn bộ output (bắt đầu với ssh-ed25519...)
```

### Bước 3: Add SSH Key vào GitHub

1. Vào GitHub → **Settings** → **SSH and GPG keys**
2. Click **"New SSH key"**
3. Title: "My PC" (hoặc tên bạn muốn)
4. Key: Paste public key đã copy
5. Click **"Add SSH key"**

### Bước 4: Test SSH Connection

```bash
ssh -T git@github.com
# Nếu thấy "Hi coolandilove-cpu! You've successfully authenticated..." là OK
```

### Bước 5: Đổi Remote sang SSH

```bash
cd "D:\tcg pokemon\pokemon-pocket-collection"
git remote set-url origin git@github.com:coolandilove-cpu/pokemontcg.git
git push -u origin master
```

---

## Giải pháp 3: Clear Credentials và Nhập lại

### Windows (Git Credential Manager)

```bash
# Clear stored credentials
git credential-manager-core erase
# Hoặc
git credential reject https://github.com

# Sau đó push lại - sẽ hỏi username/password
git push -u origin master
# Username: coolandilove-cpu
# Password: YOUR_PERSONAL_ACCESS_TOKEN (không phải password GitHub!)
```

---

## Nếu Repository dùng branch `main` thay vì `master`

```bash
# Đổi branch name
git branch -M main

# Push lên main
git push -u origin main
```

---

## Troubleshooting

### Lỗi "Repository not found"

- Kiểm tra repository đã được tạo trên GitHub chưa
- Kiểm tra bạn có quyền truy cập repository không
- Kiểm tra URL remote: `git remote -v`

### Lỗi "Authentication failed"

- Đảm bảo dùng Personal Access Token, không phải password
- Token phải có scope `repo`
- Kiểm tra token chưa hết hạn

### Lỗi "Permission denied"

- Đảm bảo bạn là owner/collaborator của repository
- Kiểm tra repository là Public hoặc bạn có quyền truy cập Private repo

---

## Sau khi Push thành công

1. Truy cập: https://github.com/coolandilove-cpu/pokemontcg
2. Kiểm tra code đã được push
3. Tiếp tục với deployment (Vercel, Netlify, etc.)

