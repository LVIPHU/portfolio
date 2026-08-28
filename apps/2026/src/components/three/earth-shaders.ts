// Chunk GLSL gắn vào MeshPhysicalMaterial của Earth. Camera BackgroundCanvas là
// orthographic — eyeDir() phải dùng isOrthographic, không normalize(vViewPosition).
export const EARTH_UNIFORMS_GLSL = /* glsl */ `
uniform vec3 uOcean;
uniform vec3 uLand;
uniform vec3 uLandDeep;
uniform float uLow;
uniform float uHigh;
uniform float uWaterGain;
uniform float uOceanSink;
uniform float uCloudDim;
uniform float uGlow;
uniform float uRimStrength;
uniform float uRimPow;
uniform vec3 uRimColor;
uniform float uNight;
uniform vec3 uNightColor;
uniform sampler2D uNightMap;
uniform vec3 uLightDirWorld;
uniform sampler2D uGeoMap;
uniform float uGeoOnly;
uniform float uLandMetal;
uniform float uLandRough;
uniform float uOceanRough;
uniform float uOceanSpecular;
float vDuotone;
float vLandTone;
// Camera cua BackgroundCanvas la ORTHOGRAPHIC. Voi ortho, huong nhin la HANG (0,0,1) trong
// view space; normalize(vViewPosition) tro ve GOC view-space nen lech truc nhin toi 30-38do
// khi qua cau bi day lech tam (STEPS position toi 0.55*viewport, scale 3.2). Hau qua: ndv o
// ria phia huong vao giua man hinh ra ~0.30 thay vi 0, moi guard "tat dan o ria" deu hut ->
// vanh sang chi o MOT ben. three khai san uniform bool isOrthographic va tu dung dung the nay.
vec3 eyeDir() { return isOrthographic ? vec3(0.0, 0.0, 1.0) : normalize(vViewPosition); }
`

export const EARTH_MAP_GLSL = /* glsl */ `
#include <map_fragment>
{
  vec3 c = diffuseColor.rgb;
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  float mx = max(max(c.r, c.g), c.b);
  float mn = min(min(c.r, c.g), c.b);
  float sat = mx > 0.0 ? (mx - mn) / mx : 0.0;
  float water = clamp((c.b - max(c.r, c.g)) * uWaterGain, 0.0, 1.0);
  float v = smoothstep(uLow, uHigh, lum * (1.0 - water * uOceanSink));
  v *= 1.0 - uCloudDim * max(0.0, 1.0 - sat * 3.0);
  // vMapUv chỉ có khi USE_MAP — sample trong main (sau uv_pars). Hàm global trước include
  // đó sẽ compile fail dù đã gắn placeholder.
#ifdef USE_MAP
  vec2 earthUv = vMapUv;
#else
  vec2 earthUv = vec2(0.0);
#endif
  // threshold lại sau khi sample: mẫu mờ ở mip thấp (rìa nghiêng) không tạo dải nâu smear
  float geo = smoothstep(0.42, 0.58, texture2D(uGeoMap, earthUv).r);
  float detail = max(v, smoothstep(0.10, 0.55, lum));
  // đất/biển do mask bờ biển quyết định; vân địa chất chỉ điều tiết TÔNG vàng đậm↔nhạt
  // → hai theme cho kết quả như nhau (nếu để vân là màu biển lọt qua thì light sẽ trắng nhoè)
  v = mix(detail * geo, geo, uGeoOnly);
  float tone = smoothstep(0.15, 0.75, lum) * mix(0.30, 1.0, detail);
  diffuseColor.rgb = mix(uOcean, mix(uLandDeep, uLand, tone), v);
  vDuotone = v;
  vLandTone = tone;
}
`

export const EARTH_EMISSIVE_GLSL = /* glsl */ `
#include <emissivemap_fragment>
{
  vec3 nrm = normalize(vNormal);
  vec3 vDir = eyeDir();
  float rim = min(pow(1.0 - clamp(dot(nrm, vDir), 0.0, 1.0), uRimPow) * uRimStrength, 1.0);
  // chống cháy rìa: đất dồn ở limb + glow + rim cộng dồn → tắt dần glow khi nghiêng
  float limb = pow(1.0 - clamp(dot(nrm, vDir), 0.0, 1.0), 3.0);
  vec3 lightDirView = normalize((viewMatrix * vec4(uLightDirWorld, 0.0)).xyz);
  float nightSide = smoothstep(0.12, -0.35, dot(nrm, lightDirView));
#ifdef USE_MAP
  vec2 earthUv = vMapUv;
#else
  vec2 earthUv = vec2(0.0);
#endif
  float city = texture2D(uNightMap, earthUv).r;
  vec3 landGlow = mix(uLandDeep, uLand, vLandTone) * vDuotone * uGlow * mix(1.0, 0.3, limb);
  totalEmissiveRadiance = landGlow + uRimColor * rim + uNightColor * city * uNight * nightSide;
}
`

export const EARTH_ROUGH_GLSL = /* glsl */ `
#include <roughnessmap_fragment>
roughnessFactor = mix(uOceanRough, uLandRough + (1.0 - vLandTone) * 0.12, vDuotone);
`

export const EARTH_METAL_GLSL = /* glsl */ `
#include <metalnessmap_fragment>
metalnessFactor = uLandMetal * vDuotone;
`

export const EARTH_NORMAL_GLSL = /* glsl */ `
#include <normal_fragment_maps>
{
  vec3 baseN = normalize(vNormal);
  float ndv = clamp(dot(baseN, eyeDir()), 0.0, 1.0);
  normal = normalize(mix(baseN, normal, smoothstep(0.02, 0.30, ndv)));
}
`

export const EARTH_SPECULAR_GLSL = /* glsl */ `
  float ndvOut = clamp(dot(normalize(vNormal), eyeDir()), 0.0, 1.0);
  totalSpecular *= mix(uOceanSpecular * smoothstep(0.12, 0.45, ndvOut), 1.0, vDuotone);
  vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;`
