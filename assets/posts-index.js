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
    "slug": "fourier-to-laplace",
    "title": "Từ Fourier tới Laplace: tách tần số trong tín hiệu và giữ cho máy móc ổn định",
    "date": "2026-11-15",
    "tags": [
      "fourier",
      "laplace",
      "xử lý tín hiệu",
      "điều khiển",
      "simulation"
    ],
    "summary": "Biến đổi Fourier và Laplace dựng từ một hợp âm: sóng sin, tổng các sóng, sóng thử nhân rồi lấy trung bình, FFT, mặt phẳng s, đạo hàm thành phép nhân, cực và sự ổn định. Đi theo đúng tám phân cảnh của một video giải thích, mỗi phần có mô phỏng riêng và một ví dụ tính tay. Cuối bài là năm ca công nghiệp (rung động máy quay, hài điện lưới, lọc nhiễu lưới, vòng PI, đọc cực từ dao động tắt dần) cùng cách nhận biết khi nào dùng Fourier, khi nào dùng Laplace.",
    "coverSvg": "<svg viewBox=\"0 0 320 180\">\n      <path class=\"hair\" d=\"M16 90h138\"/>\n      <path class=\"soft\" d=\"M16 90c9-36 18-36 27 0s18 36 27 0 18-36 27 0 18 36 27 0\"/>\n      <path class=\"line thick\" d=\"M16 90c8-52 22 12 30-6s16-44 30-8 18 34 34 6 12-26 16-6\"/>\n      <path class=\"pale\" d=\"M176 24h66v132h-66z\"/>\n      <path class=\"hair\" d=\"M242 24v132M176 90h130\"/>\n      <path class=\"line thick\" d=\"M206 62l12 12M218 62l-12 12M206 106l12 12M218 106l-12 12\"/>\n      <path class=\"line dash\" d=\"M242 90c20-30 40-30 56 0\"/>\n    </svg>"
  },
  {
    "slug": "how-bldc-works",
    "title": "Động cơ BLDC hoạt động thế nào: nam châm, sáu bước chuyển mạch, cảm biến Hall và vòng PI",
    "date": "2026-11-11",
    "tags": [
      "bldc",
      "động cơ",
      "điều khiển",
      "simulation"
    ],
    "summary": "Nguyên lý động cơ BLDC từ đầu: stator và rôto nam châm, sức điện động ngược, chuyển mạch sáu bước và vector từ thông, góc 90° và gợn mô-men, bộ nghịch lưu và thời gian chết, cảm biến Hall, điều khiển không cảm biến, PWM lưỡng cực và đơn cực, đo tốc độ bằng phương pháp M và T, vòng PI, gợn mô-men khi chuyển mạch, đấu sai dây Hall và vì sao xe điện dùng Hall còn drone dùng không cảm biến. Mỗi phần có mô phỏng riêng, sơ đồ và một ví dụ tính tay.",
    "coverSvg": "<svg viewBox=\"0 0 320 180\">\r\n      <circle class=\"soft\" cx=\"104\" cy=\"90\" r=\"64\"/>\r\n      <circle class=\"line\" cx=\"104\" cy=\"90\" r=\"64\"/>\r\n      <path class=\"hair\" d=\"M104 26v14M104 154v-14M48.6 58l12.1 7M159.4 122l-12.1-7M48.6 122l12.1-7M159.4 58l-12.1 7\"/>\r\n      <circle class=\"ink\" cx=\"104\" cy=\"90\" r=\"26\"/>\r\n      <path class=\"pale\" d=\"M104 90l24-15 6 10z\"/>\r\n      <path class=\"line thick\" d=\"M104 90l26-16\"/>\r\n      <path class=\"hair\" d=\"M196 124h12l12-34 12 0 12 34 12 0 12-34\"/>\r\n      <path class=\"line thick\" d=\"M190 112l10-28h30l10 28 10 28h30l10-28\"/>\r\n      <path class=\"hair\" d=\"M190 90h122\"/>\r\n    </svg>"
  },
  {
    "slug": "rf-iot-802154",
    "title": "Truyền thông không dây: từ bản chất đến IEEE 802.15.4",
    "date": "2026-11-16",
    "tags": [
      "rf",
      "iot",
      "wireless",
      "802.15.4",
      "simulation"
    ],
    "summary": "Dạy bản chất truyền thông không dây cho người chưa làm RF, rồi đi sâu vào IEEE 802.15.4 (lớp vật lý của Zigbee và Thread): sóng, chip, dB, suy hao, độ nhạy, Wi-Fi, fading, gói tin, CSMA-CA, nhảy kênh, mesh, diversity và chẩn đoán một mạng Zigbee chập chờn. Mọi con số có nguồn.",
    "coverSvg": "<svg viewBox=\"0 0 320 180\">\n      <path class=\"hair\" d=\"M24 150h272\"/>\n      <circle class=\"ink\" cx=\"70\" cy=\"104\" r=\"7\"/>\n      <path class=\"line thick\" d=\"M70 104V66\"/>\n      <path class=\"line\" d=\"M92 88A30 30 0 0 1 92 120\"/><path class=\"line\" d=\"M108 76A52 52 0 0 1 108 132\"/><path class=\"line\" d=\"M124 64A74 74 0 0 1 124 144\"/>\n      <path class=\"soft\" d=\"M196 150V96h10v54zM214 150v-34h10v34zM232 150V78h10v72zM250 150v-48h10v48zM268 150V88h10v62z\"/>\n      <path class=\"hair dash\" d=\"M178 120h118\"/>\n    </svg>"
  },
  {
    "slug": "solid-principles",
    "title": "SOLID: năm nguyên tắc thiết kế qua những ví dụ đời thường",
    "date": "2026-11-03",
    "tags": [
      "solid",
      "lập trình hướng đối tượng",
      "kiến trúc phần mềm",
      "embedded"
    ],
    "summary": "Năm nguyên tắc SOLID giải thích bằng hình ảnh đời thường (nĩa và muỗng, máy trộn, mèo Tom, bảng nút, ổ cắm điện) rồi bằng đúng hình ảnh đó trong code. Mỗi phần có mô phỏng chạy code thật và một ví dụ tính tay.",
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
