# Hướng dẫn Liên kết GitHub Account qua Browser

## Cách đơn giản nhất: Đăng nhập qua Browser

### Bước 1: Đảm bảo Git Credential Manager đã được setup

```bash
git config --global credential.helper manager-core
```

✅ **Đã setup xong!**

### Bước 2: Push code - sẽ tự động mở browser để đăng nhập

Khi bạn chạy lệnh push, Git Credential Manager sẽ:

1. **Tự động mở browser**
2. **Yêu cầu đăng nhập GitHub**
3. **Xác nhận quyền truy cập**
4. **Lưu credentials tự động**

### Bước 3: Chạy lệnh push

```bash
cd "D:\tcg pokemon\pokemon-pocket-collection"
git push -u origin master
```

**Khi được hỏi:**
- Browser sẽ tự động mở
- Đăng nhập với tài khoản `coolandilove-cpu`
- Click "Authorize" hoặc "Approve"
- Quay lại terminal, push sẽ tiếp tục tự động

---

## Nếu Browser không tự động mở

### Option 1: Dùng Personal Access Token (vẫn qua browser để tạo)

1. Vào: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Đặt tên: `pokemon-tcg`
4. Chọn scope: **repo**
5. Click "Generate token"
6. Copy token
7. Khi push được hỏi password, dán token vào

### Option 2: Manual browser login

1. Khi push, nếu thấy URL authentication
2. Copy URL đó
3. Mở browser và paste URL
4. Đăng nhập GitHub
5. Approve access
6. Quay lại terminal

---

## Verify đã liên kết

Sau khi push thành công, credentials sẽ được lưu. Lần sau push sẽ không cần đăng nhập lại.

Kiểm tra:
```bash
git config --global credential.helper
# Sẽ hiển thị: manager-core
```

---

## Lưu ý

- Credentials được lưu an toàn trong Windows Credential Manager
- Chỉ cần đăng nhập 1 lần
- Tự động dùng cho tất cả repositories của bạn
- Có thể xóa credentials bất cứ lúc nào trong Windows Credential Manager

