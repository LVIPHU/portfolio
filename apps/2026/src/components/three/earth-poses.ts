// Keyframe pose của Earth cho từng threshold (data-earth-step). position = tỉ lệ viewport
// (0 = giữa; y DƯƠNG = LÊN TRÊN), scale = hệ số, rotationY = số vòng quay (× 2π),
// opacity = độ hiện (mặc định 1).
export type EarthStep = { position: [number, number]; scale: number; rotationY: number; opacity?: number }

export const EARTH_STEPS: EarthStep[] = [
  // 0 hero — ĐÚNG NỬA cầu nhô lên từ đáy. Camera orthographic zoom 1 nên scale = BÁN KÍNH
  // px thật (sphereGeometry r=100): 3.0 → bán kính 300px. Tâm nằm ở (0.5+x)*W theo chiều
  // ngang và (0.5+|y|)*H tính từ đỉnh màn.
  //   y = -0.50 là con số ĐẶC BIỆT: tâm rơi đúng vào mép dưới viewport nên phần lọt vào màn
  //     luôn là chính xác một nửa cầu, ở MỌI chiều cao màn — không phải canh lại theo từng
  //     viewport như các mốc -0.72 / -0.66 trước đó.
  //   x = -0.13 → trục của dòng mô tả (trung điểm giữa "CUỘN / KHÁM PHÁ" và nút "Thuê mình" đo
  //     được là -0.081 ở viewport 1274px) rồi dịch thêm sang trái một nhịp nữa cho thoáng nút.
  //     Dòng mô tả nằm đè vành cầu — chấp nhận được vì .heroDesc đã có quầng tối riêng để đọc
  //     trên gold.
  { position: [-0.13, -0.5], scale: 3.0, rotationY: 0 },
  { position: [-0.5, 0.15], scale: 3.0, rotationY: 0.5 }, // 1 about — nửa cầu lớn bên trái
  { position: [0.0, 0.0], scale: 0.9, rotationY: 1.0 }, // 2 skills — nhỏ giữa (nghỉ nhịp)
  { position: [0.0, 0.25], scale: 0.5, rotationY: 1.6, opacity: 0 }, // 3 zoom-start — MỜ DẦN suốt đoạn scroll ngang, mất hẳn đúng lúc rail kết thúc
  { position: [0.55, 0.0], scale: 0.15, rotationY: 2.0, opacity: 0 }, // 4 marker cuối zoom — vô hình, đã đậu sẵn TẠI vị trí featuring
  { position: [0.55, 0.0], scale: 2.6, rotationY: 2.2 }, // 5 featuring — BLOOM: nở từ tâm + hiện dần đúng lúc wipe xong (xuất hiện kiểu mới)
  { position: [-0.55, -0.1], scale: 2.2, rotationY: 2.8 }, // 6 projects — cung trái
  { position: [0.0, -0.65], scale: 3.2, rotationY: 3.4 }, // 7 footer — cung nhô từ đáy
]

// Pose RIÊNG của hero trang chủ: nửa cầu nhô từ đáy nhưng lệch sang PHẢI (x dương), vì khối
// chữ + hai nút của trang chủ dồn hết sang nửa trái. /about dùng EARTH_STEPS[0] (giữa màn) —
// bố cục bên đó khác hẳn, đừng đồng bộ hai giá trị này.
//   y = -0.45: tâm hơi dưới mép nên phần lọt vào màn nhỉnh hơn nửa cầu một chút.
//   x = 0.21: vành PHẢI của cầu dừng cách nút mở menu đúng một --gap — bằng khe giữa hai nút CTA.
export const EARTH_HERO_POSE: EarthStep[] = [{ position: [0.21, -0.45], scale: 3.0, rotationY: 0 }]
