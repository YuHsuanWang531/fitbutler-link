// Derives accessible tab-bar colors from a brand's accent hex.
// Works in OKLCH so lightening/darkening keeps the brand's hue.

type Rgb = [number, number, number] // sRGB, 0–1
type Oklch = { l: number; c: number; h: number }

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
const toGamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.replace("#", ""), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function rgbToHex(rgb: Rgb) {
  return `#${rgb.map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0")).join("")}`
}

function rgbToOklch(rgb: Rgb): Oklch {
  const [r, g, b] = rgb.map(toLinear)
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
  return { l: L, c: Math.hypot(A, B), h: Math.atan2(B, A) }
}

function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const A = c * Math.cos(h)
  const B = c * Math.sin(h)
  const l_ = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m_ = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s_ = (l - 0.0894841775 * A - 1.291485548 * B) ** 3
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((v) => clamp01(toGamma(v))) as Rgb
}

function luminance(rgb: Rgb) {
  const [r, g, b] = rgb.map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [luminance(hexToRgb(a)), luminance(hexToRgb(b))].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** WCAG AA for normal-size text (the 12px tab label). */
const MIN_CONTRAST = 4.5
/** Every brand's tint shares this lightness so the blocks look equally pale. */
const TINT_LIGHTNESS = 0.95
const TINT_MAX_CHROMA = 0.04

/**
 * `tint`: pale block behind the active tab.
 * `onTint`: the accent, darkened only as much as needed to reach 4.5:1 against `tint`.
 */
export function getTabColors(accent: string) {
  const base = rgbToOklch(hexToRgb(accent))
  const tint = rgbToHex(oklchToRgb({ l: TINT_LIGHTNESS, c: Math.min(base.c, TINT_MAX_CHROMA), h: base.h }))

  let onTint = accent
  for (let l = base.l; contrastRatio(onTint, tint) < MIN_CONTRAST && l > 0; l -= 0.01) {
    onTint = rgbToHex(oklchToRgb({ ...base, l }))
  }
  return { tint, onTint }
}
