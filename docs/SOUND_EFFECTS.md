# Pack Opening Sound Effects Guide

## Tổng quan

Hệ thống pack opening đã được tích hợp sound effects để tăng trải nghiệm người dùng. Hệ thống hỗ trợ cả file audio và synthetic sounds (tự động tạo).

## Tính năng

### 1. Automatic Sound Generation
- Nếu không có file audio, hệ thống tự động tạo synthetic sounds
- Sử dụng Web Audio API để tạo các tone phù hợp
- Không cần file audio để hoạt động

### 2. File Audio Support
- Hỗ trợ file MP3 và WAV
- Tự động fallback về synthetic sounds nếu file không tồn tại
- Có thể thêm file audio để có trải nghiệm tốt hơn

### 3. Rarity-based Sounds
- **Common/Uncommon**: Sound đơn giản
- **Rare**: Sound phức tạp hơn (chord progression)
- **Ultra Rare**: Sound epic (multiple chords)

## Các sound effects

### 1. Start Scroll Sound
- **Khi nào**: Khi bắt đầu animation
- **Mục đích**: Tạo cảm giác bắt đầu mở pack
- **File**: `/sounds/pack-shuffle.mp3`

### 2. Scroll Loop Sound
- **Khi nào**: Trong suốt quá trình scroll (mỗi 300ms)
- **Mục đích**: Tạo cảm giác cards đang shuffle
- **File**: `/sounds/pack-scroll.mp3`

### 3. Reveal Card Sound
- **Khi nào**: Khi reveal card Common/Uncommon
- **Mục đích**: Tạo cảm giác reveal card
- **File**: `/sounds/card-reveal.mp3`

### 4. Reveal Rare Card Sound
- **Khi nào**: Khi reveal card Rare (◊◊◊)
- **Mục đích**: Tạo cảm giác đặc biệt cho rare card
- **File**: `/sounds/card-reveal-rare.mp3`

### 5. Reveal Ultra Rare Card Sound
- **Khi nào**: Khi reveal card Ultra Rare (◊◊◊◊)
- **Mục đích**: Tạo cảm giác epic cho ultra rare card
- **File**: `/sounds/card-reveal-ultra-rare.mp3`

### 6. Complete Sound
- **Khi nào**: Sau khi reveal card
- **Mục đích**: Tạo cảm giác hoàn thành
- **File**: `/sounds/pack-complete.mp3`

## Cách sử dụng

### Sử dụng với Synthetic Sounds (Mặc định)

Không cần làm gì cả! Hệ thống sẽ tự động tạo sounds.

### Thêm File Audio (Optional)

1. Tạo thư mục `public/sounds/` (nếu chưa có)
2. Thêm các file audio vào thư mục:
   - `pack-shuffle.mp3`
   - `pack-scroll.mp3`
   - `card-reveal.mp3`
   - `card-reveal-rare.mp3`
   - `card-reveal-ultra-rare.mp3`
   - `pack-complete.mp3`
3. Restart development server
4. File audio sẽ tự động được sử dụng thay cho synthetic sounds

### Tắt Sound Effects

Nếu muốn tắt sound effects, có thể:

1. **Tạm thời**: Comment code trong `PackOpeningAnimation.tsx`
2. **Vĩnh viễn**: Thêm setting để user có thể toggle

## Customization

### Thay đổi Volume

Trong `PackOpeningAnimation.tsx`:

```typescript
const { sounds } = usePackOpeningSounds({ 
  enabled: true, 
  volume: 0.5 // Thay đổi từ 0.0 đến 1.0
});
```

### Thay đổi Sound Timing

Trong `PackOpeningAnimation.tsx`, bạn có thể điều chỉnh:
- Interval của scroll sound (hiện tại: 300ms)
- Timing của reveal sound
- Timing của complete sound

## Browser Compatibility

- **Chrome/Edge**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support (cần user interaction để enable AudioContext)
- **Mobile**: ✅ Full support (có thể cần user interaction)

## Troubleshooting

### Sound không phát

1. **Kiểm tra browser permissions**: Một số browser cần user interaction để enable audio
2. **Kiểm tra console**: Xem có error không
3. **Kiểm tra file paths**: Đảm bảo file audio ở đúng thư mục
4. **Kiểm tra AudioContext**: Một số browser cần user click để enable

### Sound quá to/nhỏ

- Điều chỉnh `volume` parameter trong `usePackOpeningSounds`
- Hoặc điều chỉnh volume của từng sound riêng lẻ

### Synthetic sounds không hoạt động

- Kiểm tra browser có support Web Audio API không
- Kiểm tra console có error không
- Thử refresh trang

## Best Practices

1. **File Size**: Giữ file audio nhỏ (< 500KB mỗi file)
2. **Format**: Sử dụng MP3 cho web (tốt nhất)
3. **Volume**: Điều chỉnh volume phù hợp (0.3 - 0.7)
4. **Timing**: Đảm bảo sounds sync với animation
5. **User Control**: Cân nhắc thêm toggle để user có thể tắt/bật sound

## Future Enhancements

- [ ] Thêm setting để user toggle sound on/off
- [ ] Thêm volume control
- [ ] Thêm sound effects cho các actions khác (click, hover, etc.)
- [ ] Thêm background music option
- [ ] Thêm sound effects cho trade system

