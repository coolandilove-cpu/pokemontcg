# Pack Opening Sound Effects

## Tổng quan

Thư mục này chứa các file âm thanh cho pack opening animation. Nếu bạn có file audio, đặt chúng vào đây để có trải nghiệm tốt hơn.

## Các file audio cần thiết (Optional)

Nếu không có file audio, hệ thống sẽ tự động tạo synthetic sounds bằng Web Audio API.

### 1. `pack-shuffle.mp3` (Optional)
- **Mô tả**: Âm thanh khi bắt đầu shuffle cards
- **Thời lượng**: 0.5 - 1 giây
- **Khi nào phát**: Khi animation bắt đầu

### 2. `pack-scroll.mp3` (Optional)
- **Mô tả**: Âm thanh loop khi đang scroll cards
- **Thời lượng**: 0.2 - 0.5 giây (sẽ loop)
- **Khi nào phát**: Trong suốt quá trình scroll

### 3. `card-reveal.mp3` (Optional)
- **Mô tả**: Âm thanh khi reveal card thường (Common/Uncommon)
- **Thời lượng**: 0.3 - 0.5 giây
- **Khi nào phát**: Khi reveal card Common hoặc Uncommon

### 4. `card-reveal-rare.mp3` (Optional)
- **Mô tả**: Âm thanh khi reveal card Rare
- **Thời lượng**: 0.5 - 1 giây
- **Khi nào phát**: Khi reveal card Rare (◊◊◊)

### 5. `card-reveal-ultra-rare.mp3` (Optional)
- **Mô tả**: Âm thanh khi reveal card Ultra Rare
- **Thời lượng**: 1 - 2 giây
- **Khi nào phát**: Khi reveal card Ultra Rare (◊◊◊◊)

### 6. `pack-complete.mp3` (Optional)
- **Mô tả**: Âm thanh khi hoàn thành mở pack
- **Thời lượng**: 0.5 - 1 giây
- **Khi nào phát**: Sau khi reveal card

### 7. `click.mp3` (Optional)
- **Mô tả**: Âm thanh khi click button
- **Thời lượng**: 0.1 - 0.2 giây
- **Khi nào phát**: Khi click các button

## Nguồn tài nguyên

Bạn có thể tìm sound effects miễn phí tại:
- [Freesound.org](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [Mixkit](https://mixkit.co/free-sound-effects/)
- [Pixabay](https://pixabay.com/sound-effects/)

## Format khuyến nghị

- **Format**: MP3 hoặc WAV
- **Bitrate**: 128-192 kbps (cho MP3)
- **Sample Rate**: 44.1 kHz
- **Channels**: Mono hoặc Stereo

## Lưu ý

- Nếu không có file audio, hệ thống sẽ tự động tạo synthetic sounds
- Synthetic sounds vẫn tạo được trải nghiệm tốt
- File audio sẽ override synthetic sounds nếu có

## Cách test

1. Thêm file audio vào thư mục `public/sounds/`
2. Restart development server
3. Mở pack và kiểm tra âm thanh

