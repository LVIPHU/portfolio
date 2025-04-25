export const calculateAngle = ({ cx, cy, ex, ey }: { cx: number; cy: number; ex: number; ey: number }) => {
  const dy = ey - cy
  const dx = ex - cx
  const rad = Math.atan2(dy, dx)
  return (rad * 180) / Math.PI
}
