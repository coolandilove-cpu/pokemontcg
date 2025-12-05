# Hướng dẫn Push Code lên GitHub và Deploy

## Bước 1: Kiểm tra Git Status

```bash
cd "D:\tcg pokemon\pokemon-pocket-collection"
git status
```

## Bước 2: Add và Commit Code

### 2.1. Add tất cả các file mới và thay đổi

```bash
git add .
```

### 2.2. Commit với message mô tả

```bash
git commit -m "Add pack opening, wallet sync, Supabase integration, and production features"
```

## Bước 3: Kiểm tra Remote Repository

### 3.1. Xem remote hiện tại

```bash
git remote -v
```

### 3.2. Nếu chưa có remote hoặc muốn thay đổi:

**Tạo repository mới trên GitHub:**
1. Vào https://github.com
2. Click "New repository"
3. Đặt tên: `pokemon-tcg-pocket-collection` (hoặc tên bạn muốn)
4. Chọn Public hoặc Private
5. **KHÔNG** check "Initialize with README" (vì đã có code)
6. Click "Create repository"

**Thêm remote (nếu chưa có):**
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Hoặc thay đổi remote (nếu đã có):**
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

## Bước 4: Push Code lên GitHub

### 4.1. Push lên branch master/main

```bash
git push -u origin master
```

**Nếu GitHub repo dùng branch `main` thay vì `master`:**
```bash
git branch -M main
git push -u origin main
```

### 4.2. Nếu có conflict hoặc cần force push:

```bash
git push -u origin master --force
```

⚠️ **Cẩn thận với force push** - chỉ dùng nếu chắc chắn!

## Bước 5: Deploy lên Hosting

### Option 1: Vercel (Khuyến nghị cho Next.js)

1. **Truy cập**: https://vercel.com
2. **Đăng nhập** bằng GitHub account
3. **Click "New Project"**
4. **Import repository** từ GitHub
5. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `pokemon-pocket-collection` (nếu repo ở root) hoặc `.` (nếu repo chứa project)
   - Build Command: `npm run build` hoặc `yarn build`
   - Output Directory: `.next`
6. **Environment Variables**: Thêm các biến môi trường:
   ```
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=YOUR_MERCHANT_WALLET
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
   NEXT_PUBLIC_SOLANA_RPC_URL=YOUR_RPC_URL (optional)
   ```
7. **Click "Deploy"**
8. **Chờ deploy xong** (2-5 phút)
9. **Truy cập URL** được cung cấp

### Option 2: Netlify

1. **Truy cập**: https://netlify.com
2. **Đăng nhập** bằng GitHub account
3. **Click "Add new site" → "Import an existing project"**
4. **Chọn repository** từ GitHub
5. **Build settings**:
   - Build command: `npm run build` hoặc `yarn build`
   - Publish directory: `.next`
6. **Environment Variables**: Thêm các biến môi trường (giống Vercel)
7. **Click "Deploy site"**

### Option 3: Self-hosted (VPS/Server)

1. **Clone repository** trên server:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Tạo file `.env.local`** với các biến môi trường

4. **Build project**:
   ```bash
   npm run build
   ```

5. **Start production server**:
   ```bash
   npm start
   ```

6. **Setup PM2** (process manager):
   ```bash
   npm install -g pm2
   pm2 start npm --name "pokemon-tcg" -- start
   pm2 save
   pm2 startup
   ```

## Bước 6: Verify Deployment

1. **Truy cập URL** của website
2. **Test các tính năng**:
   - Connect wallet
   - Mở pack
   - Xem collection
   - Dashboard
3. **Kiểm tra console** xem có lỗi không
4. **Test transaction** (với số tiền nhỏ trên mainnet)

## Troubleshooting

### Lỗi "Permission denied"

**Nguyên nhân**: Chưa authenticate với GitHub

**Giải pháp**:
1. **Dùng Personal Access Token**:
   - Vào GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token
   - Copy token
   - Dùng token thay vì password khi push:
   ```bash
   git push https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git
   ```

2. **Hoặc setup SSH key**:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Copy public key và add vào GitHub → Settings → SSH keys
   git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
   ```

### Lỗi "Repository not found"

**Nguyên nhân**: URL remote sai hoặc không có quyền truy cập

**Giải pháp**:
- Kiểm tra lại URL: `git remote -v`
- Đảm bảo repository tồn tại trên GitHub
- Đảm bảo bạn có quyền truy cập

### Lỗi khi deploy trên Vercel/Netlify

**Nguyên nhân**: Thiếu environment variables hoặc build fail

**Giải pháp**:
- Kiểm tra build logs trên Vercel/Netlify
- Đảm bảo đã thêm tất cả environment variables
- Kiểm tra `.env.local` không được commit (đã có trong `.gitignore`)

## Lưu ý quan trọng

1. **KHÔNG commit `.env.local`**:
   - File đã có trong `.gitignore`
   - Chỉ thêm environment variables trên hosting platform

2. **Security**:
   - Không share API keys công khai
   - Dùng environment variables trên hosting
   - Review code trước khi push

3. **Backup**:
   - Đảm bảo code đã được push lên GitHub
   - Backup merchant wallet private key
   - Backup Supabase credentials

## Next Steps

Sau khi deploy:
1. ✅ Test tất cả tính năng
2. ✅ Monitor errors
3. ✅ Setup custom domain (nếu cần)
4. ✅ Setup analytics
5. ✅ Review security

