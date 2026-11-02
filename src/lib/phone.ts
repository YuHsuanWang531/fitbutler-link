/** "(+886)0912345678" → "tel:+886912345678" (drop the domestic trunk 0 after the country code). */
export function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "").replace(/^\+8860/, "+886")}`
}
