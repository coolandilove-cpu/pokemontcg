# Hướng dẫn Push Code lên GitHub Account của bạn

## Bước 1: Tạo Repository mới trên GitHub của bạn

1. **Đăng nhập** vào GitHub account của bạn: https://github.com
2. **Click nút "+"** ở góc trên bên phải → **"New repository"**
3. **Điền thông tin**:
   - **Repository name**: `pokemon-tcg-pocket-collection` (hoặc tên bạn muốn)
   - **Description**: "Pokemon TCG Pocket Card Collection - Solana Web3 App"
   - **Visibility**: Chọn **Public** hoặc **Private**
   - **KHÔNG** check "Add a README file" (vì đã có code)
   - **KHÔNG** check "Add .gitignore" (đã có sẵn)
   - **KHÔNG** check "Choose a license"
4. **Click "Create repository"**

## Bước 2: Copy Repository URL

Sau khi tạo xong, GitHub sẽ hiển thị URL. Copy URL này:
- **HTTPS**: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`
- **Hoặc SSH**: `git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git`

## Bước 3: Thay đổi Remote URL

Chạy lệnh sau (thay YOUR_USERNAME và YOUR_REPO_NAME bằng thông tin của bạn):

```bash
cd "D:\tcg pokemon\pokemon-pocket-collection"
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Ví dụ**:
```bash
git remote set-url origin https://github.com/yourusername/pokemon-tcg-pocket-collection.git
```

## Bước 4: Verify Remote đã thay đổi

```bash
git remote -v
```

Bạn sẽ thấy URL mới của bạn.

## Bước 5: Push Code lên Repository mới

```bash
git push -u origin master
```

**Nếu GitHub repo dùng branch `main`**:
```bash
git branch -M main
git push -u origin main
```

## Bước 6: Xác thực (nếu cần)

Nếu GitHub yêu cầu authentication:

### Option 1: Dùng Personal Access Token (Khuyến nghị)

1. Vào GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Đặt tên token (ví dụ: "pokemon-tcg-deploy")
4. Chọn scopes: **repo** (full control)
5. Click **"Generate token"**
6. **Copy token** (chỉ hiện 1 lần!)
7. Khi push, dùng token thay vì password:
   ```bash
   git push -u origin master
   # Username: YOUR_GITHUB_USERNAME
   # Password: YOUR_PERSONAL_ACCESS_TOKEN
   ```

### Option 2: Setup SSH Key

1. **Generate SSH key**:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Nhấn Enter để dùng default location
   # Nhấn Enter để không đặt passphrase (hoặc đặt nếu muốn)
   ```

2. **Copy public key**:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy toàn bộ output
   ```

3. **Add SSH key vào GitHub**:
   - Vào GitHub → **Settings** → **SSH and GPG keys**
   - Click **"New SSH key"**
   - Title: "My PC" (hoặc tên bạn muốn)
   - Key: Paste public key đã copy
   - Click **"Add SSH key"**

4. **Thay đổi remote sang SSH**:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

5. **Test SSH connection**:
   ```bash
   ssh -T git@github.com
   # Nếu thấy "Hi YOUR_USERNAME! You've successfully authenticated..." là OK
   ```

6. **Push lại**:
   ```bash
   git push -u origin master
   ```

## Troubleshooting

### Lỗi "Permission denied"

- Đảm bảo đã thay đổi remote URL đúng
- Kiểm tra bạn có quyền truy cập repository
- Thử dùng Personal Access Token

### Lỗi "Repository not found"

- Kiểm tra repository đã được tạo trên GitHub chưa
- Kiểm tra URL remote có đúng không: `git remote -v`
- Đảm bảo repository name và username đúng

### Lỗi "Authentication failed"

- Dùng Personal Access Token thay vì password
- Hoặc setup SSH key

## Sau khi Push thành công

1. **Truy cập repository** trên GitHub để xem code
2. **Kiểm tra** tất cả files đã được push
3. **Tiếp tục** với deployment (Vercel, Netlify, etc.)

