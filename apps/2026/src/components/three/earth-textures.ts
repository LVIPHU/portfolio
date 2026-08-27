const mulberry32 = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

// heightmap (bump) + đèn thành phố, sinh 1 lần từ texture + mask bờ biển
export function buildEarthMasks(img: HTMLImageElement, geoImg: HTMLImageElement) {
  const W = 1024
  const H = 512
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const x = c.getContext('2d', { willReadFrequently: true })!
  x.drawImage(img, 0, 0, W, H)
  const d = x.getImageData(0, 0, W, H).data
  x.clearRect(0, 0, W, H)
  x.drawImage(geoImg, 0, 0, W, H)
  const gd = x.getImageData(0, 0, W, H).data

  const geo = new Float32Array(W * H)
  const lum = new Float32Array(W * H)
  for (let i = 0; i < W * H; i++) {
    geo[i] = (gd[i * 4] ?? 0) / 255
    lum[i] = (0.299 * (d[i * 4] ?? 0) + 0.587 * (d[i * 4 + 1] ?? 0) + 0.114 * (d[i * 4 + 2] ?? 0)) / 255
  }

  // CHỈ đất theo bản đồ thật mới nổi — thềm lục địa không nhô như đất
  const hc = document.createElement('canvas')
  hc.width = W
  hc.height = H
  const hx = hc.getContext('2d')!
  const hd = hx.createImageData(W, H)
  for (let i = 0; i < W * H; i++) {
    const h = (geo[i] ?? 0) * (80 + 160 * (lum[i] ?? 0))
    hd.data[i * 4] = hd.data[i * 4 + 1] = hd.data[i * 4 + 2] = h
    hd.data[i * 4 + 3] = 255
  }
  hx.putImageData(hd, 0, 0)
  const height = document.createElement('canvas')
  height.width = W
  height.height = H
  const bx = height.getContext('2d')!
  bx.filter = 'blur(1px)'
  bx.drawImage(hc, 0, 0)

  // đèn thành phố: chấm li ti trên đất, dày hơn dọc bờ biển, né hai cực
  const night = document.createElement('canvas')
  night.width = W
  night.height = H
  const nx = night.getContext('2d')!
  nx.fillStyle = '#000'
  nx.fillRect(0, 0, W, H)
  const rand = mulberry32(7)
  for (let y = 8; y < H - 8; y++) {
    if (Math.abs(y / H - 0.5) * 180 > 62) continue
    for (let k = 0; k < W; k++) {
      const i = y * W + k
      if ((geo[i] ?? 0) < 0.5) continue
      const coast =
        Math.min(
          geo[y * W + ((k + 3) % W)] ?? 0,
          geo[y * W + ((k - 3 + W) % W)] ?? 0,
          geo[(y + 3) * W + k] ?? 0,
          geo[(y - 3) * W + k] ?? 0
        ) < 0.3
      if (rand() < (coast ? 0.07 : 0.011)) {
        nx.fillStyle = `rgba(255,255,255,${0.5 + rand() * 0.5})`
        nx.fillRect(k, y, rand() < 0.22 ? 2 : 1, 1)
      }
    }
  }
  return { height, night }
}
