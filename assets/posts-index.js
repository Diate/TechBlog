/* Tự sinh bởi scripts/lib/posts-index.mjs từ posts/*.html, đừng sửa tay. */
window.POSTS = [
  {
    "slug": "dsp-sensor-pipeline",
    "title": "Pipeline DSP cho dữ liệu cảm biến: từ mẫu thô đến đặc trưng",
    "date": "2026-11-01",
    "tags": [
      "dsp",
      "xử lý tín hiệu",
      "embedded",
      "simulation"
    ],
    "summary": "Đi qua từng khối của một pipeline DSP cho dữ liệu cảm biến: lấy mẫu, Q-format, FIR, cửa sổ trượt, detrend, RMS và kurtosis, FFT, band energy. Mỗi phần có mô phỏng riêng để tự chỉnh tham số và một ví dụ tính tay để kiểm lại."
  },
  {
    "slug": "rf-iot-tcu-wireless",
    "title": "RF trong IoT và TCU ô tô: từ link budget đến khung dữ liệu trên không",
    "date": "2026-11-03",
    "tags": [
      "rf",
      "iot",
      "tcu",
      "không dây",
      "automotive",
      "bảo mật"
    ],
    "summary": "Từ vật lý của sóng vô tuyến (dB, link budget, fading) qua BLE, UWB, LoRa/LoRaWAN, NB-IoT/LTE-M, vệ tinh NTN, tới TCU ô tô (CAN, eCall, OTA, V2X, chìa khóa số) và các cách tấn công vô tuyến. Mỗi phần có mô phỏng riêng, khung dữ liệu tính từng byte và các tình huống lỗi kèm cách chẩn đoán.",
    "cover": "packets"
  },
  {
    "slug": "solid-principles",
    "title": "SOLID: năm nguyên tắc thiết kế, từ ví dụ nhỏ đến module firmware",
    "date": "2026-11-03",
    "tags": [
      "solid",
      "kiến trúc phần mềm",
      "embedded",
      "firmware",
      "automotive"
    ],
    "summary": "Năm nguyên tắc SOLID giải thích bằng ví dụ C nhỏ, mỗi nguyên tắc có mô phỏng riêng và một ví dụ tính tay để kiểm lại. Sau đó ráp thành một module điều khiển quạt chạy thật và áp dụng vào embedded, firmware, automotive.",
    "cover": "blocks"
  }
];
