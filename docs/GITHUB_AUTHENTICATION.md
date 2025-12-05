# Hướng dẫn Liên kết GitHub Account

## Cách 1: Dùng GitHub CLI (Khuyến nghị - Dễ nhất)

### Bước 1: Cài đặt GitHub CLI

**Windows (PowerShell):**
```powershell
winget install --id GitHub.cli
```

**Hoặc download từ:**
https://cli.github.com/

### Bước 2: Đăng nhập GitHub

```bash
gh auth login
```

Chọn:
- **GitHub.com**
- **HTTPS** (hoặc SSH nếu muốn)
- **Login with a web browser**
- **Paste authentication token** (sẽ tự động mở browser để authenticate)

### Bước 3: Verify

```bash
gh auth status
```

### Bước 4: Push code

```bash
cd "D:\tcg pokemon\pokemon-pocket-collection"
git push -u origin master
```

GitHub CLI sẽ tự động dùng credentials đã đăng nhập.

---

## Cách 2: Dùng SSH Key (Bảo mật nhất)

### Bước 1: Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

- Nhấn Enter để dùng default location (`C:\Users\your_user\.ssh\id_ed25519`)
- Nhấn Enter để không đặt passphrase (hoặc đặt nếu muốn)

### Bước 2: Start SSH Agent

```bash
# Start ssh-agent
Start-Service ssh-agent

# Add key to agent
ssh-add ~/.ssh/id_ed25519
```

### Bước 3: Copy Public Key

```bash
cat ~/.ssh/id_ed25519.pub
# Hoặc trên Windows:
Get-Content ~/.ssh/id_ed25519.pub
```

Copy toàn bộ output (bắt đầu với `ssh-ed25519...`)

### Bước 4: Add SSH Key vào GitHub

1. Vào: https://github.com/settings/keys
2. Click **"New SSH key"**
3. **Title**: "My PC" (hoặc tên bạn muốn)
4. **Key**: Paste public key đã copy
5. Click **"Add SSH key"**

### Bước 5: Test SSH Connection

```bash
ssh -T git@github.com
```

Nếu thấy: `Hi coolandilove-cpu! You've successfully authenticated...` là OK.

### Bước 6: Đổi Remote sang SSH

```bash
cd "D:\tcg pokemon\pokemon-pocket-collection"
git remote set-url origin git@github.com:coolandilove-cpu/pokemontcg.git
git push -u origin master
```

---

## Cách 3: Dùng Git Credential Manager (Windows)

### Bước 1: Đảm bảo Git Credential Manager đã cài

```bash
git config --global credential.helper manager-core
```

### Bước 2: Push và đăng nhập qua Browser

```bash
cd "D:\tcg pokemon\pokemon-pocket-collection"
git push -u origin master
```

Khi được hỏi, chọn:
- **Sign in with your browser**
- Browser sẽ mở, đăng nhập GitHub
- Approve access
- Quay lại terminal, push sẽ tiếp tục

---

## So sánh các cách

| Cách | Ưu điểm | Nhược điểm |
|------|---------|------------|
| **GitHub CLI** | Dễ dùng, tự động | Cần cài thêm tool |
| **SSH Key** | Bảo mật, không cần nhập lại | Setup phức tạp hơn |
| **Credential Manager** | Tích hợp sẵn Windows | Có thể cần nhập lại |

---

## Khuyến nghị

**Nếu muốn đơn giản**: Dùng **GitHub CLI** (Cách 1)
**Nếu muốn bảo mật**: Dùng **SSH Key** (Cách 2)

