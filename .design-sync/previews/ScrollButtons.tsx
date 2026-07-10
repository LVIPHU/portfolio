import { ScrollButtons } from 'web-2025'

// Cặp nút nổi "scroll to comment / scroll to top". Root gốc là overlay
// `fixed bottom-8 right-8 hidden` và chỉ hiện từ lg khi window.scrollY > 50 —
// trong khung capture (900px, không cuộn) sẽ vô hình tuyệt đối. Glue CSS chỉ
// gỡ fixed + hidden để chụp đúng style nút (ring, bo góc, icon lucide),
// không đổi markup.
export const FloatingActions = () => (
  <>
    <style>{'.sbd > div{position:static!important;display:inline-flex!important}'}</style>
    <div className='sbd' style={{ padding: 8 }}>
      <ScrollButtons />
    </div>
  </>
)
