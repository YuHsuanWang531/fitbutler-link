// Course catalog: what a class is, apart from when and where it runs. Shared by the home page's 課程介紹,
// the booking mock data and the 課程資訊 page. Swap for the real API later.
// Photos: Unsplash / Pexels (free license).

import type { ClassCategory } from "@/lib/booking/types"

/** Course names are limited to 15 characters (e.g. 孕婦瑜珈、空中瑜珈). */
export const COURSE_TITLE_MAX = 15

export type Course = {
  id: string
  /** At most `COURSE_TITLE_MAX` characters. */
  title: string
  category: ClassCategory
  durationMin: number
  image: string
  /** 課程介紹, one entry per paragraph. */
  intro: string[]
}

const INTROS: Record<ClassCategory, string[]> = {
  瑜伽: [
    "以呼吸帶動身體，透過一連串流暢的體位串連，伸展緊繃的肩頸與髖部，同時建立核心穩定。課程節奏由慢到快，最後以放鬆休息收尾，讓身心一起沉澱下來。",
    "適合想改善久坐僵硬、提升柔軟度的你，不需要任何基礎，老師會依每位學員的狀況提供輔具與替代動作。",
  ],
  皮拉提斯: [
    "從骨盆與脊椎的正確排列開始，練習深層核心的控制，再延伸到四肢的協調動作。每個動作都講求精準與穩定，而不是次數與速度。",
    "適合想改善體態、腰背容易痠痛，或想為其他運動打好核心基礎的你。初學者也能跟上，老師會逐一調整動作細節。",
  ],
  重訓: [
    "以自由重量與基礎器材為主，學習深蹲、硬舉、推、拉等基本動作模式，並了解如何安排重量與組數，循序漸進地增加肌力。",
    "適合剛開始接觸重量訓練、想安全地建立肌力的你。課程採小班制，老師會留意每位學員的姿勢，確保動作安全到位。",
  ],
  TRX: [
    "利用懸吊帶與自身體重，透過調整身體角度改變強度，在每個動作中同時訓練核心穩定、肌力與平衡，是一堂全身性的功能性訓練。",
    "不論體能程度都能參加，只要靠近或遠離錨點就能調整難度。適合想在短時間內有效率地動到全身的你。",
  ],
  壺鈴: [
    "從壺鈴擺盪、深蹲、推舉等基礎動作開始，學習以髖部發力、全身協調地移動重量，再組合成循環訓練，兼顧肌力與心肺。",
    "適合想提升爆發力與體能、喜歡有節奏感訓練的你。老師會先帶大家熟悉握法與發力方式，再逐步增加強度。",
  ],
  拳擊有氧: [
    "結合拳擊的出拳、步伐與閃躲動作，跟著音樂節奏完成一連串組合，在高強度的節奏中大量燃燒熱量。",
    "不需要任何拳擊經驗，老師會從站姿與基本拳法教起。適合想紓壓、想流汗的你。",
  ],
  飛輪: [
    "在固定式單車上跟著音樂調整阻力與踩踏節奏，模擬爬坡、衝刺等路況，有效提升心肺耐力。",
    "阻力完全由自己控制，初學者也能依體能調整強度。請穿著包覆性佳的運動鞋。",
  ],
  有氧舞蹈: [
    "以簡單易學的舞步串成完整的有氧組合，在輕鬆的氣氛中提升心肺能力與身體協調性。",
    "不用有舞蹈底子，老師會分段教學、逐步加快。適合想開心動一動的你。",
  ],
  伸展放鬆: [
    "透過靜態伸展與滾筒筋膜放鬆，舒緩久坐與訓練後的緊繃，改善關節活動度。",
    "節奏緩慢、強度低，適合訓練後恢復，或想好好放鬆身體的你。",
  ],
  核心訓練: [
    "針對腹部、背部與骨盆周圍的深層肌群，透過穩定性與抗旋轉動作，打造穩固的軀幹。",
    "核心穩定是所有運動的基礎，適合想改善腰背不適、提升運動表現的你。",
  ],
  功能性訓練: [
    "從推、拉、蹲、跨步、旋轉等日常動作模式出發，訓練身體在各種情境下都能有效率地出力。",
    "適合想讓生活更輕鬆、降低受傷風險的你。老師會依每位學員的程度調整器材與次數。",
  ],
}

const IMAGES: Record<ClassCategory, string> = {
  瑜伽: "/images/course-yoga.jpg",
  皮拉提斯: "/images/course-mat-pilates.jpg",
  重訓: "/images/course-strength.jpg",
  TRX: "/images/course-trx.jpg",
  壺鈴: "/images/course-kettlebell.jpg",
  拳擊有氧: "/images/course-boxing.jpg",
  飛輪: "/images/course-spin.jpg",
  有氧舞蹈: "/images/course-dance.jpg",
  伸展放鬆: "/images/course-stretch.jpg",
  核心訓練: "/images/course-core.jpg",
  功能性訓練: "/images/course-functional.jpg",
}

/** `[id, title, category, minutes, image?]`; the image defaults to the category's photo. */
const CATALOG: [string, string, ClassCategory, number, string?][] = [
  ["flow-yoga", "流動瑜伽・肩頸放鬆", "瑜伽", 60],
  ["yin-yoga", "陰瑜伽深層伸展", "瑜伽", 75],
  ["morning-yoga", "晨間伸展瑜伽喚醒", "瑜伽", 50],
  ["mat-pilates", "墊上皮拉提斯核心穩定", "皮拉提斯", 50],
  ["core-pilates", "核心皮拉提斯體態雕塑", "皮拉提斯", 60],
  ["reformer-core", "機械皮拉提斯核心養成進階班", "皮拉提斯", 60, "/images/course-reformer.jpg"],
  ["strength-basics", "新手重訓入門基礎班", "重訓", 60],
  ["lower-body", "下肢肌力訓練・臀腿", "重訓", 60],
  ["upper-body", "上肢肌力訓練・背肩", "重訓", 60],
  ["trx-full-body", "TRX 全身懸吊訓練", "TRX", 50],
  ["trx-core", "TRX 懸吊核心訓練", "TRX", 50],
  ["trx-burn", "TRX 核心燃脂循環", "TRX", 50],
  ["kettlebell-basics", "壺鈴基礎動作入門", "壺鈴", 60],
  ["kettlebell-circuit", "壺鈴循環體能訓練", "壺鈴", 50],
  ["boxing-intro", "拳擊有氧燃脂入門", "拳擊有氧", 60],
  ["boxing-combo", "拳擊組合進階訓練", "拳擊有氧", 75],
  ["rhythm-spin", "節奏飛輪・音樂騎乘", "飛輪", 50],
  ["spin-intervals", "飛輪間歇燃脂挑戰", "飛輪", 50],
  ["dance-party", "流行有氧舞蹈派對", "有氧舞蹈", 60],
  ["low-impact-dance", "低衝擊有氧律動", "有氧舞蹈", 50],
  ["fascia-release", "筋膜放鬆與伸展", "伸展放鬆", 60],
  ["bedtime-stretch", "睡前舒緩伸展", "伸展放鬆", 50],
  ["core-stability", "核心穩定強化訓練", "核心訓練", 50],
  ["core-burn", "腹部核心燃燒", "核心訓練", 50],
  ["functional-full-body", "功能性訓練・全身整合", "功能性訓練", 60],
  ["movement-basics", "動作模式基礎班", "功能性訓練", 60],
]

export const courses: Course[] = CATALOG.map(([id, title, category, durationMin, image]) => ({
  id,
  title,
  category,
  durationMin,
  image: image ?? IMAGES[category],
  intro: INTROS[category],
}))

/** The courses shown in the home page's 課程介紹. */
export const featuredCourses = ["reformer-core", "trx-core", "strength-basics", "kettlebell-circuit"].map((id) =>
  courses.find((c) => c.id === id)!
)

export function getCourse(id: string) {
  return courses.find((c) => c.id === id)
}
