/* Tự sinh bởi scripts/lib/posts-index.mjs từ posts/*.html, đừng sửa tay. */
window.POSTS = [
  {
    "slug": "can-bus",
    "title": "CAN bus từ đầu đến cuối: tín hiệu, khung, lỗi, CAN FD và STM32",
    "date": "2026-11-09",
    "tags": [
      "can",
      "automotive",
      "embedded",
      "stm32",
      "simulation"
    ],
    "summary": "CAN bus giải thích từ lý thuyết đến mã: tín hiệu vi sai, điện trở kết thúc, phân xử không phá hủy, khung 0x120 dựng từng bit (chèn bit, CRC, ACK), lỗi và bus-off, thời gian bit, CAN FD và TDC, FDCAN trên STM32G474, DBC. Mỗi phần có mô phỏng riêng và một ví dụ tính tay.",
    "cover": "packets"
  },
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
  },
  {
    "slug": "stm32-to-bldc",
    "title": "Từ một dòng mã STM32 đến động cơ BLDC quay: thanh ghi, bộ định thời và cầu MOSFET",
    "date": "2026-11-10",
    "tags": [
      "stm32",
      "bldc",
      "embedded",
      "firmware",
      "simulation"
    ],
    "summary": "Lần theo một dòng mã STM32F767 đến lúc động cơ BLDC quay: BSRR và địa chỉ thanh ghi, bản đồ bộ nhớ, RCC, cảm biến Hall, chuyển mạch sáu bước, PWM căn giữa 20 kHz, thời gian chết, mạch lái cổng, cầu MOSFET và vòng tốc độ PI. Mỗi phần có mô phỏng riêng, trích nguyên văn RM0410, DS11532, PM0253 và hướng dẫn tự phát triển.",
    "coverSvg": "<svg viewBox=\"0 0 320 180\">\n      <rect class=\"ink\" x=\"26\" y=\"64\" width=\"54\" height=\"52\"/>\n      <path class=\"hair\" d=\"M26 76h-10M26 90h-10M26 104h-10M80 76h10M80 90h10M80 104h10\"/>\n      <path class=\"line thick\" d=\"M98 118h16V78h16v40h16V78h16v40h16V78\"/>\n      <path class=\"hair\" d=\"M98 128h96\"/>\n      <circle class=\"soft\" cx=\"246\" cy=\"90\" r=\"50\"/>\n      <circle class=\"line\" cx=\"246\" cy=\"90\" r=\"50\"/>\n      <circle class=\"ink\" cx=\"246\" cy=\"90\" r=\"22\"/>\n      <path class=\"line thick\" d=\"M246 90l34-26\"/>\n      <path class=\"hair\" d=\"M246 40v-12M246 140v12M196 90h-12M296 90h12\"/>\n    </svg>"
  }
];
